/* ============================================================
   CART ENGINE — FIRESTORE VERSION
   Raj Marketing Mysore
   Falls back to localStorage if not logged in
   ============================================================ */

import { auth } from '../firebase-config.js';
import { Cart as FirestoreCart } from './firestore-service.js';

(function() {
    'use strict';

    const CART_KEY = 'raj_cart';
    let currentUserId = null;

    function initAuthWatcher() {
        setInterval(() => {
            const uid = auth.currentUser?.uid || null;
            if (uid !== currentUserId) {
                currentUserId = uid;
                if (uid) syncLocalToFirestore();
            }
        }, 2000);
    }

    async function getCartAsync() {
        if (currentUserId) {
            try {
                return await FirestoreCart.get(currentUserId);
            } catch (e) {
                console.warn('Firestore cart fetch failed');
            }
        }
        return getCartLocal();
    }

    function getCartLocal() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    async function saveCart(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: items } }));

        if (currentUserId) {
            try {
                await FirestoreCart.save(currentUserId, items);
            } catch (e) {
                console.warn('Firestore cart sync failed');
            }
        }
    }

    async function addItem(item) {
        const cart = getCartLocal();
        item.cartId = 'CART-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        item.addedAt = new Date().toISOString();
        cart.push(item);
        await saveCart(cart);
        return item;
    }

    async function removeItem(cartId) {
        let cart = getCartLocal();
        cart = cart.filter(i => i.cartId !== cartId);
        await saveCart(cart);
        return cart;
    }

    async function updateItem(cartId, updates) {
        const cart = getCartLocal();
        const idx = cart.findIndex(i => i.cartId === cartId);
        if (idx < 0) return null;

        cart[idx] = { ...cart[idx], ...updates };

        if (cart[idx].perUnitSqft && cart[idx].qty && cart[idx].rate) {
            cart[idx].totalSqft = cart[idx].perUnitSqft * cart[idx].qty;
            cart[idx].totalPrice = cart[idx].totalSqft * cart[idx].rate;
        }

        await saveCart(cart);
        return cart[idx];
    }

    async function clearCart() {
        await saveCart([]);
    }

    async function syncLocalToFirestore() {
        if (!currentUserId) return;
        try {
            const local = getCartLocal();
            if (!local.length) return;

            const remote = await FirestoreCart.get(currentUserId);
            const merged = [...remote];
            const remoteIds = new Set(remote.map(i => i.cartId));

            local.forEach(item => {
                if (!remoteIds.has(item.cartId)) merged.push(item);
            });

            await FirestoreCart.save(currentUserId, merged);
            localStorage.setItem(CART_KEY, JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: merged } }));
        } catch (e) {
            console.warn('Cart sync failed:', e.message);
        }
    }

    function getTotals() {
        const cart = getCartLocal();
        const itemCount = cart.length;
        const totalQty = cart.reduce((s, i) => s + (i.qty || 0), 0);
        const totalSqft = cart.reduce((s, i) => s + (i.totalSqft || 0), 0);
        const subtotal = cart.reduce((s, i) => s + (i.totalPrice || 0), 0);
        const gst = subtotal * 0.18;
        const grandTotal = subtotal + gst;

        return { itemCount, totalQty, totalSqft, subtotal, gst, grandTotal };
    }

    function updateBadges() {
        const cart = getCartLocal();
        const count = cart.length;
        document.querySelectorAll('[data-cart-count]').forEach(el => {
            el.textContent = count > 99 ? '99+' : count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    function formatCurrency(amount) {
        return '₹' + Math.round(parseFloat(amount) || 0).toLocaleString('en-IN');
    }

    window.CartEngine = {
        getCart: getCartLocal,
        getCartAsync,
        saveCart,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        getTotals,
        updateBadges,
        formatCurrency,
        syncLocalToFirestore
    };

    document.addEventListener('DOMContentLoaded', () => {
        initAuthWatcher();
        updateBadges();
    });
    window.addEventListener('cartUpdated', updateBadges);
    window.addEventListener('storage', e => {
        if (e.key === CART_KEY) updateBadges();
    });

    console.log('%c🛒 Cart Engine (Firestore) Ready', 'color:#10b981;font-weight:bold;');
})();
