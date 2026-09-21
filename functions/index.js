/* ============================================================
   FIREBASE CLOUD FUNCTIONS — RAZORPAY BACKEND
   Raj Marketing Mysore
   ============================================================ */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// ============================================================
// RAZORPAY INSTANCE
// ============================================================
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ============================================================
// 1. CREATE RAZORPAY ORDER
// ============================================================
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
    const { amount, currency = 'INR', receipt, notes = {} } = data;

    if (!amount || amount < 100) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Amount must be at least ₹1 (100 paise)'
        );
    }

    try {
        const options = {
            amount: Math.round(amount),
            currency: currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes,
            payment_capture: 1
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return {
            success: true,
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                receipt: razorpayOrder.receipt,
                status: razorpayOrder.status
            }
        };
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create Razorpay order', error.message);
    }
});

// ============================================================
// 2. VERIFY PAYMENT SIGNATURE
// ============================================================
exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing payment verification data');
    }

    try {
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            console.warn('Signature mismatch for order:', razorpay_order_id);
            throw new functions.https.HttpsError('permission-denied', 'Invalid payment signature');
        }

        if (orderId) {
            const orderRef = db.collection('orders').doc(orderId);

            await orderRef.update({
                paymentStatus: 'PAID',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'CONFIRMED',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            const orderSnap = await orderRef.get();
            if (orderSnap.exists()) {
                const existingTimeline = orderSnap.data().timeline || [];
                existingTimeline.push({
                    status: 'Payment Received',
                    time: new Date().toISOString(),
                    note: `Payment ID: ${razorpay_payment_id}`
                });
                await orderRef.update({ timeline: existingTimeline });
            }
        }

        return {
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id,
            orderId: orderId
        };
    } catch (error) {
        console.error('Payment verification error:', error);
        if (error.code) throw error;
        throw new functions.https.HttpsError('internal', 'Verification failed', error.message);
    }
});

// ============================================================
// 3. WEBHOOK HANDLER
// ============================================================
exports.razorpayWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSignature) {
        console.warn('Missing webhook signature');
        return res.status(400).send('Missing signature');
    }

    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);

    try {
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');

        if (expectedSignature !== webhookSignature) {
            console.warn('Webhook signature mismatch');
            return res.status(400).send('Invalid signature');
        }

        const event = req.body.event;
        const payload = req.body.payload;

        console.log('Webhook received:', event);

        if (event === 'payment.captured') {
            const payment = payload.payment.entity;
            const razorpayOrderId = payment.order_id;
            const paymentId = payment.id;

            const ordersSnap = await db.collection('orders')
                .where('razorpayOrderId', '==', razorpayOrderId)
                .limit(1)
                .get();

            if (!ordersSnap.empty) {
                const orderDoc = ordersSnap.docs[0];
                const orderData = orderDoc.data();

                if (orderData.paymentStatus === 'PAID') {
                    console.log('Order already marked as paid:', orderDoc.id);
                    return res.status(200).send('OK');
                }

                await orderDoc.ref.update({
                    paymentStatus: 'PAID',
                    razorpayPaymentId: paymentId,
                    paidAt: admin.firestore.FieldValue.serverTimestamp(),
                    status: 'CONFIRMED',
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                const timeline = orderData.timeline || [];
                timeline.push({
                    status: 'Payment Confirmed (Webhook)',
                    time: new Date().toISOString(),
                    note: `Payment ID: ${paymentId}`
                });
                await orderDoc.ref.update({ timeline });

                console.log('Order updated via webhook:', orderDoc.id);
            }
        }

        if (event === 'payment.failed') {
            const payment = payload.payment.entity;
            const razorpayOrderId = payment.order_id;

            const ordersSnap = await db.collection('orders')
                .where('razorpayOrderId', '==', razorpayOrderId)
                .limit(1)
                .get();

            if (!ordersSnap.empty) {
                const orderDoc = ordersSnap.docs[0];
                await orderDoc.ref.update({
                    paymentStatus: 'FAILED',
                    failureReason: payment.error_description || 'Payment failed',
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        }

        return res.status(200).send('OK');

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).send('Webhook processing failed');
    }
});

// ============================================================
// 4. CHECK PAYMENT STATUS
// ============================================================
exports.checkPaymentStatus = functions.https.onCall(async (data, context) => {
    const { paymentId } = data;
    if (!paymentId) {
        throw new functions.https.HttpsError('invalid-argument', 'Payment ID required');
    }

    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return {
            success: true,
            status: payment.status,
            amount: payment.amount,
            method: payment.method
        };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Failed to fetch payment', error.message);
    }
});

// ============================================================
// 5. CREATE REFUND
// ============================================================
exports.createRefund = functions.https.onCall(async (data, context) => {
    const { paymentId, amount, reason } = data;

    if (!paymentId) {
        throw new functions.https.HttpsError('invalid-argument', 'Payment ID required');
    }

    try {
        const refundOptions = {};
        if (amount) refundOptions.amount = Math.round(amount);
        if (reason) refundOptions.notes = { reason };

        const refund = await razorpay.payments.refund(paymentId, refundOptions);
        return {
            success: true,
            refundId: refund.id,
            amount: refund.amount,
            status: refund.status
        };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Refund failed', error.message);
    }
});

console.log('🔥 Razorpay Cloud Functions loaded');
