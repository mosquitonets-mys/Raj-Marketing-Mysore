/* ============================================================
   CART ENGINE
   Raj Marketing Mysore
   - Add / Remove / Update items
   - Persist to localStorage
   - Calculate totals
   ============================================================ */

(function() {
    'use strict';

    const CART_KEY = 'raj_cart';

    // ============================================================
    // GET CART
    // ============================================================
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    // ============================================================
    // SAVE CART
    // ============================================================
    function saveCart(cart) {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            // Dispatch event for other tabs/components
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
        } catch (e) {
            console.error('Failed to save cart', e);
        }
    }

    // ============================================================
    // ADD ITEM
    // ============================================================
    function addItem(item) {
        const cart = getCart();
        item.cartId = 'CART-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        item.addedAt = new Date().toISOString();
        cart.push(item);
        saveCart(cart);
        return item;
    }

    // ============================================================
    // REMOVE ITEM
    // ============================================================
    function removeItem(cartId) {
        let cart = getCart();
        cart = cart.filter(item => item.cartId !== cartId);
        saveCart(cart);
        return cart;
    }

    // ============================================================
    // UPDATE ITEM
    // ============================================================
    function updateItem(cartId, updates) {
        const cart = getCart();
        const idx = cart.findIndex(item => item.cartId === cartId);
        if (idx < 0) return null;

        cart[idx] = { ...cart[idx], ...updates };

        // Recalculate item total if qty/rate/sqft changed
        if (cart[idx].perUnitSqft && cart[idx].qty && cart[idx].rate) {
            cart[idx].totalSqft = cart[idx].perUnitSqft * cart[idx].qty;
            cart[idx].totalPrice = cart[idx].totalSqft * cart[idx].rate;
        }

        saveCart(cart);
        return cart[idx];
    }

    // ============================================================
    // CLEAR CART
    // ============================================================
    function clearCart() {
        saveCart([]);
    }

    // ============================================================
    // GET TOTALS
    // ============================================================
    function getTotals() {
        const cart = getCart();
        const itemCount = cart.length;
        const totalQty = cart.reduce((sum, i) => sum + (i.qty || 0), 0);
        const totalSqft = cart.reduce((sum, i) => sum + (i.totalSqft || 0), 0);
        const subtotal = cart.reduce((sum, i) => sum + (i.totalPrice || 0), 0);

        // Default GST 18%
        const gst = subtotal * 0.18;
        const grandTotal = subtotal + gst;

        return {
            itemCount,
            totalQty,
            totalSqft,
            subtotal,
            gst,
            grandTotal
        };
    }

    // ============================================================
    // UPDATE CART BADGES
    // ============================================================
    function updateBadges() {
        const cart = getCart();
        const count = cart.length;
        document.querySelectorAll('[data-cart-count]').forEach(el => {
            el.textContent = count > 99 ? '99+' : count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    // ============================================================
    // FORMAT CURRENCY
    // ============================================================
    function formatCurrency(amount) {
        return '₹' + Math.round(parseFloat(amount) || 0).toLocaleString('en-IN');
    }

    // ============================================================
    // PUBLIC API
    // ============================================================
    window.CartEngine = {
        getCart,
        saveCart,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        getTotals,
        updateBadges,
        formatCurrency
    };

    // Auto-update badges
    document.addEventListener('DOMContentLoaded', updateBadges);
    window.addEventListener('cartUpdated', updateBadges);

    // Cross-tab sync
    window.addEventListener('storage', e => {
        if (e.key === CART_KEY) updateBadges();
    });

    console.log('%c🛒 Cart Engine Ready', 'color:#10b981;font-weight:bold;');
})();
