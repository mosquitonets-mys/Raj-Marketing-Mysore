/* ============================================================
   RAZORPAY CHECKOUT — Frontend Integration
   Raj Marketing Mysore
   ============================================================ */

import { functions, auth } from '../firebase-config.js';
import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-functions.js";

// ============================================================
// RAZORPAY PUBLIC KEY (Safe to expose in frontend)
// ============================================================
const RAZORPAY_KEY_ID = 'rzp_test_xxxxxxxxxxxx'; // ← Replace with your Key ID

// ============================================================
// INITIATE PAYMENT
// ============================================================
export async function initiateRazorpayPayment({ orderId, amount, customer, description }) {
    try {
        // Step 1: Backend creates Razorpay order
        const createOrderFn = httpsCallable(functions, 'createRazorpayOrder');
        const orderResult = await createOrderFn({
            amount: Math.round(amount * 100), // Convert ₹ to paise
            currency: 'INR',
            receipt: orderId,
            notes: { orderId, customerName: customer.name }
        });

        if (!orderResult.data.success) {
            throw new Error('Failed to create Razorpay order');
        }

        const razorpayOrder = orderResult.data.order;

        // Step 2: Open Razorpay Checkout modal
        return new Promise((resolve, reject) => {
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'Raj Marketing Mysore',
                description: description || 'Mosquito Net Order',
                image: 'images/logo.png',
                order_id: razorpayOrder.id,
                prefill: {
                    name: customer.name || '',
                    email: customer.email || '',
                    contact: customer.mobile || ''
                },
                notes: { orderId: orderId },
                theme: { color: '#1a56db' },
                handler: async function(response) {
                    // Payment success — verify signature on backend
                    try {
                        const verifyFn = httpsCallable(functions, 'verifyRazorpayPayment');
                        const verifyResult = await verifyFn({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderId
                        });

                        if (verifyResult.data.success) {
                            resolve({
                                success: true,
                                paymentId: response.razorpay_payment_id,
                                orderId: orderId
                            });
                        } else {
                            reject(new Error('Payment verification failed'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                modal: {
                    ondismiss: function() {
                        reject(new Error('Payment cancelled by user'));
                    }
                }
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function(response) {
                reject(new Error(response.error.description || 'Payment failed'));
            });

            rzp.open();
        });
    } catch (error) {
        console.error('Razorpay initiation error:', error);
        throw error;
    }
}

console.log('%c💳 Razorpay Checkout loaded', 'color:#1a56db;font-weight:bold;');
