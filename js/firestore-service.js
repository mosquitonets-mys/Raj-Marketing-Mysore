/* ============================================================
   FIRESTORE SERVICE
   Raj Marketing Mysore
   ------------------------------------------------------------
   Centralized collection helpers for Customers, Dealers, etc.
   Location: /js/firestore-service.js
============================================================ */

import { db } from '../firebase-config.js';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// ============================================================
// CUSTOMERS
// ============================================================
const Customers = {
    async create(uid, data) {
        const ref = doc(db, 'customers', uid);
        await setDoc(ref, {
            ...data,
            uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: uid, ...data };
    },

    async get(uid) {
        if (!uid) return null;
        const snap = await getDoc(doc(db, 'customers', uid));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    async update(uid, updates) {
        const ref = doc(db, 'customers', uid);
        await updateDoc(ref, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    },

    async delete(uid) {
        await deleteDoc(doc(db, 'customers', uid));
    },

    async list(max = 100) {
        const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'), limit(max));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async findByMobile(mobile) {
        const q = query(collection(db, 'customers'), where('mobile', '==', mobile), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
    },

    async findByEmail(email) {
        const q = query(collection(db, 'customers'), where('email', '==', email), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
    },

    subscribe(uid, callback) {
        return onSnapshot(doc(db, 'customers', uid), (snap) => {
            callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        });
    }
};

// ============================================================
// DEALERS
// ============================================================
const Dealers = {
    async create(uid, data) {
        const ref = doc(db, 'dealers', uid);
        await setDoc(ref, {
            ...data,
            uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: uid, ...data };
    },

    async get(uid) {
        if (!uid) return null;
        const snap = await getDoc(doc(db, 'dealers', uid));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    async update(uid, updates) {
        const ref = doc(db, 'dealers', uid);
        await updateDoc(ref, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    },

    async delete(uid) {
        await deleteDoc(doc(db, 'dealers', uid));
    },

    async listByStatus(status, max = 100) {
        const q = query(
            collection(db, 'dealers'),
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            limit(max)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async findByDealerId(dealerId) {
        const q = query(collection(db, 'dealers'), where('dealerId', '==', dealerId), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
    },

    async findByEmail(email) {
        const q = query(collection(db, 'dealers'), where('email', '==', email), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
    }
};

// ============================================================
// ORDERS
// ============================================================
const Orders = {
    async create(orderId, data) {
        const ref = doc(db, 'orders', orderId);
        await setDoc(ref, {
            ...data,
            orderId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: orderId, ...data };
    },

    async get(orderId) {
        const snap = await getDoc(doc(db, 'orders', orderId));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    async listByCustomer(customerId, max = 50) {
        const q = query(
            collection(db, 'orders'),
            where('customerId', '==', customerId),
            orderBy('createdAt', 'desc'),
            limit(max)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async listByDealer(dealerId, max = 50) {
        const q = query(
            collection(db, 'orders'),
            where('dealerId', '==', dealerId),
            orderBy('createdAt', 'desc'),
            limit(max)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
};

// ============================================================
// PRODUCTS (read-only on frontend)
// ============================================================
const Products = {
    async list(max = 100) {
        const q = query(collection(db, 'products'), where('active', '==', true), limit(max));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async get(productId) {
        const snap = await getDoc(doc(db, 'products', productId));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    async listByCategory(category, max = 100) {
        const q = query(
            collection(db, 'products'),
            where('category', '==', category),
            where('active', '==', true),
            limit(max)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
};

// ============================================================
// NOTIFICATIONS
// ============================================================
const Notifications = {
    async createForUser(userId, data) {
        const id = 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        const ref = doc(db, 'notifications', id);
        await setDoc(ref, {
            ...data,
            userId,
            read: false,
            createdAt: serverTimestamp()
        });
        return id;
    },

    async listForUser(userId, max = 50) {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(max)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
};

// ============================================================
// EXPORTS
// ============================================================
export { Customers, Dealers, Orders, Products, Notifications };
export default { Customers, Dealers, Orders, Products, Notifications };
