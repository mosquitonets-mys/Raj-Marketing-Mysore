/* ============================================================
   ADMIN NOTIFICATION SYSTEM
   Raj Marketing Mysore
   - Inbox notifications
   - Customer/dealer approval alerts
   - Product price update alerts
   - Order updates
============================================================ */

(function() {
    'use strict';

    // ============================================================
    // NOTIFICATION TYPES
    // ============================================================
    const NOTIFICATION_TYPES = {
        CUSTOMER_REGISTRATION: { icon: 'fa-user-plus', color: '#1a56db', label: 'New Customer' },
        DEALER_REGISTRATION: { icon: 'fa-handshake', color: '#f59e0b', label: 'New Dealer' },
        DEALER_APPROVED: { icon: 'fa-check-circle', color: '#10b981', label: 'Dealer Approved' },
        DEALER_REJECTED: { icon: 'fa-times-circle', color: '#ef4444', label: 'Dealer Rejected' },
        PRICE_UPDATE: { icon: 'fa-tag', color: '#8b5cf6', label: 'Price Update' },
        NEW_ORDER: { icon: 'fa-box', color: '#0ea5e9', label: 'New Order' },
        NEW_ENQUIRY: { icon: 'fa-phone', color: '#f59e0b', label: 'New Enquiry' },
        PAYMENT_RECEIVED: { icon: 'fa-rupee-sign', color: '#10b981', label: 'Payment' },
        SYSTEM: { icon: 'fa-cog', color: '#6b7280', label: 'System' }
    };

    // ============================================================
    // STORAGE
    // ============================================================
    function getNotifications() {
        try {
            return JSON.parse(localStorage.getItem('raj_admin_notifications') || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveNotifications(list) {
        // Keep max 200 notifications
        if (list.length > 200) list = list.slice(-200);
        localStorage.setItem('raj_admin_notifications', JSON.stringify(list));
    }

    // ============================================================
    // ADD NOTIFICATION
    // ============================================================
    function addNotification(type, title, message, data = {}) {
        const list = getNotifications();
        const notif = {
            id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            type: type,
            title: title,
            message: message,
            data: data,
            read: false,
            createdAt: new Date().toISOString()
        };
        list.push(notif);
        saveNotifications(list);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('adminNotification', { detail: notif }));

        return notif;
    }

    // ============================================================
    // MARK AS READ
    // ============================================================
    function markAsRead(id) {
        const list = getNotifications();
        const n = list.find(x => x.id === id);
        if (n) {
            n.read = true;
            saveNotifications(list);
        }
    }

    function markAllAsRead() {
        const list = getNotifications();
        list.forEach(n => n.read = true);
        saveNotifications(list);
    }

    // ============================================================
    // DELETE
    // ============================================================
    function deleteNotification(id) {
        let list = getNotifications();
        list = list.filter(n => n.id !== id);
        saveNotifications(list);
    }

    function clearAll() {
        saveNotifications([]);
    }

    // ============================================================
    // GET UNREAD COUNT
    // ============================================================
    function getUnreadCount() {
        return getNotifications().filter(n => !n.read).length;
    }

    // ============================================================
    // FORMAT TIME
    // ============================================================
    function formatTime(iso) {
        try {
            const d = new Date(iso);
            const now = new Date();
            const diff = (now - d) / 1000;

            if (diff < 60) return 'Just now';
            if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
            if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
            if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
            return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        } catch (e) {
            return '—';
        }
    }

    // ============================================================
    // PUBLIC API
    // ============================================================
    window.AdminNotifications = {
        types: NOTIFICATION_TYPES,
        add: addNotification,
        getAll: getNotifications,
        getUnreadCount: getUnreadCount,
        markAsRead: markAsRead,
        markAllAsRead: markAllAsRead,
        delete: deleteNotification,
        clearAll: clearAll,
        formatTime: formatTime,

        // ===== Convenience methods =====
        notifyCustomerRegistration: function(customer) {
            return addNotification('CUSTOMER_REGISTRATION',
                'New Customer Registered',
                `${customer.name} (${customer.mobile}) has registered.`,
                { customerId: customer.id, email: customer.email }
            );
        },

        notifyDealerRegistration: function(dealer) {
            return addNotification('DEALER_REGISTRATION',
                'New Dealer Application',
                `${dealer.businessName} (${dealer.ownerName}) applied for dealership.`,
                { dealerId: dealer.id, email: dealer.email }
            );
        },

        notifyDealerApproved: function(dealer) {
            return addNotification('DEALER_APPROVED',
                'Dealer Approved',
                `${dealer.businessName} has been approved as dealer.`,
                { dealerId: dealer.id, dealerId_no: dealer.dealerId }
            );
        },

        notifyDealerRejected: function(dealer, reason) {
            return addNotification('DEALER_REJECTED',
                'Dealer Application Rejected',
                `${dealer.businessName} was rejected. ${reason || ''}`,
                { dealerId: dealer.id }
            );
        },

        notifyPriceUpdate: function(product, oldPrice, newPrice) {
            return addNotification('PRICE_UPDATE',
                'Product Price Updated',
                `${product}: ₹${oldPrice} → ₹${newPrice}`,
                { product, oldPrice, newPrice }
            );
        },

        notifyNewOrder: function(order) {
            return addNotification('NEW_ORDER',
                'New Order Received',
                `${order.product} - ₹${order.totalAmount} from ${order.customerName}`,
                { orderId: order.id }
            );
        },

        notifyNewEnquiry: function(enquiry) {
            return addNotification('NEW_ENQUIRY',
                'New Customer Enquiry',
                `${enquiry.customerName} (${enquiry.mobile}) - ${enquiry.product}`,
                { enquiryId: enquiry.id }
            );
        },

        notifyPaymentReceived: function(payment) {
            return addNotification('PAYMENT_RECEIVED',
                'Payment Received',
                `₹${payment.amount} received from ${payment.customerName}`,
                { paymentId: payment.id }
            );
        }
    };

    console.log('%c🔔 Admin Notifications Ready', 'color:#f59e0b;font-weight:bold;');
})();
