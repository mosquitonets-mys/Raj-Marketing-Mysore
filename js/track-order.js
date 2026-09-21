/* ============================================================
   TRACK ORDER ENGINE — FIRESTORE
   Raj Marketing Mysore · v3.0
   ============================================================ */

import { Orders as FirestoreOrders } from './firestore-service.js';

(function() {
    'use strict';

    const STATUS_FLOW = [
        { key: 'NEW',         label: 'Order Placed',        icon: 'fa-check' },
        { key: 'CONFIRMED',   label: 'Order Confirmed',     icon: 'fa-thumbs-up' },
        { key: 'PROCESSING',  label: 'In Manufacturing',    icon: 'fa-cog' },
        { key: 'READY',       label: 'Ready for Delivery',  icon: 'fa-box' },
        { key: 'OUT',         label: 'Out for Delivery',    icon: 'fa-truck' },
        { key: 'DELIVERED',   label: 'Delivered',           icon: 'fa-check-double' }
    ];

    const STATUS_META = {
        'NEW':        { label: 'New Order',        color: '#1a56db' },
        'CONFIRMED':  { label: 'Confirmed',        color: '#3b82f6' },
        'PROCESSING': { label: 'Processing',       color: '#f59e0b' },
        'READY':      { label: 'Ready',            color: '#8b5cf6' },
        'OUT':        { label: 'Out for Delivery', color: '#06b6d4' },
        'DELIVERED':  { label: 'Delivered',        color: '#10b981' },
        'CANCELLED':  { label: 'Cancelled',        color: '#dc2626' }
    };

    async function findOrder(orderId) {
        const cleanId = orderId.trim().toUpperCase();

        // Try Firestore
        try {
            const order = await FirestoreOrders.getByOrderId(cleanId);
            if (order) return order;
        } catch (e) {
            console.warn('Firestore track failed');
        }

        // Fallback to localStorage
        try {
            const orders = JSON.parse(localStorage.getItem('raj_orders') || '[]');
            return orders.find(o => {
                const oid = (o.orderId || o.id || '').toUpperCase();
                return oid === cleanId || oid.includes(cleanId);
            });
        } catch (e) {
            return null;
        }
    }

    function init() {
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get('id');
        if (urlId) {
            document.getElementById('orderInput').value = urlId;
            setTimeout(() => trackOrder(), 300);
        }

        document.getElementById('orderInput').addEventListener('keypress', e => {
            if (e.key === 'Enter') trackOrder();
        });

        document.getElementById('orderInput').addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }

    window.trackOrder = async function() {
        const input = document.getElementById('orderInput');
        const orderId = input.value.trim();

        hideAll();
        if (!orderId) {
            showToast('Please enter an order ID', 'error');
            return;
        }

        document.getElementById('trackLoading').classList.add('active');
        document.getElementById('trackBtn').disabled = true;

        const order = await findOrder(orderId);

        document.getElementById('trackLoading').classList.remove('active');
        document.getElementById('trackBtn').disabled = false;

        if (!order) {
            document.getElementById('trackNotFound').classList.add('active');
            return;
        }

        renderOrder(order);
    };

    function hideAll() {
        document.getElementById('trackLoading').classList.remove('active');
        document.getElementById('trackResult').classList.remove('active');
        document.getElementById('trackNotFound').classList.remove('active');
    }

    function renderOrder(order) {
        const container = document.getElementById('trackResult');
        const status = (order.status || 'NEW').toUpperCase();
        const meta = STATUS_META[status] || STATUS_META['NEW'];
        const totals = order.totals || {};
        const cust = order.customer || {};
        const items = order.items || [];

        const statusIdx = STATUS_FLOW.findIndex(s => s.key === status);
        const progressPct = status === 'CANCELLED' ? 0 :
                            statusIdx >= 0 ? ((statusIdx + 1) / STATUS_FLOW.length) * 100 : 0;

        const orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })
            : '—';

        container.innerHTML = `
            <div class="order-hero">
                <div class="hero-top">
                    <div>
                        <div class="order-id-label">Order ID</div>
                        <div class="order-id-value">${order.orderId || order.id}</div>
                        <div class="order-date"><i class="fas fa-calendar"></i> ${orderDate}</div>
                    </div>
                    <div class="status-pill">
                        ${meta.label}
                    </div>
                </div>
                <div class="order-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill" style="width:0%;"></div>
                    </div>
                </div>
            </div>

            <div class="track-card">
                <div class="card-title"><i class="fas fa-user"></i> Customer</div>
                <div class="info-row"><span class="label">Name</span><span class="value">${cust.name || '—'}</span></div>
                <div class="info-row"><span class="label">Mobile</span><span class="value">${cust.mobile || '—'}</span></div>
                ${cust.address ? `<div class="info-row"><span class="label">Address</span><span class="value">${cust.address}, ${cust.city || ''}</span></div>` : ''}
            </div>

            <div class="track-card">
                <div class="card-title"><i class="fas fa-box"></i> Items</div>
                ${items.map(item => `
                    <div class="track-item">
                        <div class="item-info">
                            <div class="name">${item.productName || 'Product'}</div>
                            <div class="meta">${item.width || 0}" × ${item.height || 0}" · Qty ${item.qty || 1}</div>
                        </div>
                        <div class="item-price">₹${Math.round(item.totalPrice || 0).toLocaleString('en-IN')}</div>
                    </div>
                `).join('')}
            </div>

            <div class="track-card">
                <div class="card-title"><i class="fas fa-receipt"></i> Payment</div>
                <div class="info-row"><span class="label">Subtotal</span><span class="value">₹${Math.round(totals.subtotal || 0).toLocaleString('en-IN')}</span></div>
                <div class="info-row"><span class="label">GST</span><span class="value">₹${Math.round(totals.gst || 0).toLocaleString('en-IN')}</span></div>
                <div class="info-row"><span class="label">Grand Total</span><span class="value" style="color:#1a56db;font-weight:900;">₹${Math.round(totals.grandTotal || 0).toLocaleString('en-IN')}</span></div>
                <div class="info-row"><span class="label">Status</span><span class="value">${order.paymentStatus || 'PENDING'}</span></div>
            </div>
        `;

        container.classList.add('active');

        setTimeout(() => {
            const fill = document.getElementById('progressFill');
            if (fill) fill.style.width = progressPct + '%';
        }, 200);
    }

    function showToast(msg, type = 'info') {
        document.querySelectorAll('.rm-toast').forEach(t => t.remove());
        const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b' };
        const t = document.createElement('div');
        t.className = 'rm-toast';
        t.textContent = msg;
        t.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);background:${colors[type] || '#1a56db'};color:#fff;padding:12px 24px;border-radius:40px;font-size:13px;font-weight:700;box-shadow:0 8px 32px rgba(0,0,0,0.25);z-index:9999;opacity:0;transition:all 0.3s ease;`;
        document.body.appendChild(t);
        requestAnimationFrame(() => {
            t.style.opacity = '1';
            t.style.transform = 'translateX(-50%) translateY(0)';
        });
        setTimeout(() => {
            t.style.opacity = '0';
            setTimeout(() => t.remove(), 300);
        }, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('%c✅ Track Order Engine (Firestore) loaded', 'color:#1a56db;font-weight:bold;');
})();
