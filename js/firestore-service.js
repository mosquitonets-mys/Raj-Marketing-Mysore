/* ============================================================
   FIRESTORE SERVICE — Unified CRUD Layer
   Raj Marketing Mysore
   ============================================================ */

import { db } from '../firebase-config.js';
import {
    collection, doc, getDoc, getDocs, setDoc, addDoc,
    updateDoc, deleteDoc, query, where, orderBy, limit,
    serverTimestamp, onSnapshot, increment, writeBatch
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ============================================================
// COLLECTIONS
// ============================================================
const COLLECTIONS = {
    CUSTOMERS: 'customers',
    DEALERS: 'dealers',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CARTS: 'carts',
    ESTIMATES: 'estimates',
    ENQUIRIES: 'enquiries',
    PAYMENTS: 'payments',
    NOTIFICATIONS: 'notifications',
    FEEDBACK: 'feedback',
    PRICE_LIST: 'priceList',
    SETTINGS: 'settings',
    BUSINESS_RULES: 'businessRules',
    VISITOR_STATS: 'visitorStats',
    ADMIN_SESSIONS: 'adminSessions'
};

// ============================================================
// GENERIC CRUD
// ============================================================
async function create(collectionName, data, customId = null) {
    const payload = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    if (customId) {
        await setDoc(doc(db, collectionName, customId), payload);
        return { id: customId, ...data };
    } else {
        const ref = await addDoc(collection(db, collectionName), payload);
        return { id: ref.id, ...data };
    }
}

async function read(collectionName, id) {
    const snap = await getDoc(doc(db, collectionName, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
}

async function update(collectionName, id, updates) {
    await updateDoc(doc(db, collectionName, id), {
        ...updates,
        updatedAt: serverTimestamp()
    });
    return { id, ...updates };
}

async function remove(collectionName, id) {
    await deleteDoc(doc(db, collectionName, id));
    return true;
}

async function listAll(collectionName, options = {}) {
    const constraints = [];

    if (options.where) {
        options.where.forEach(([field, op, value]) => {
            constraints.push(where(field, op, value));
        });
    }

    if (options.orderBy) {
        options.orderBy.forEach(([field, dir = 'asc']) => {
            constraints.push(orderBy(field, dir));
        });
    }

    if (options.limit) {
        constraints.push(limit(options.limit));
    }

    const q = query(collection(db, collectionName), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function findByField(collectionName, field, value) {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

function subscribe(collectionName, callback, options = {}) {
    const constraints = [];

    if (options.where) {
        options.where.forEach(([field, op, value]) => {
            constraints.push(where(field, op, value));
        });
    }

    if (options.orderBy) {
        options.orderBy.forEach(([field, dir = 'asc']) => {
            constraints.push(orderBy(field, dir));
        });
    }

    if (options.limit) {
        constraints.push(limit(options.limit));
    }

    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(q, snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(data, snapshot);
    });
}

// ============================================================
// CUSTOMER HELPERS
// ============================================================
const Customers = {
    create: (uid, data) => create(COLLECTIONS.CUSTOMERS, data, uid),
    get: (uid) => read(COLLECTIONS.CUSTOMERS, uid),
    update: (uid, updates) => update(COLLECTIONS.CUSTOMERS, uid, updates),
    getByMobile: (mobile) => findByField(COLLECTIONS.CUSTOMERS, 'mobile', mobile),
    list: (options = {}) => listAll(COLLECTIONS.CUSTOMERS, options),
    subscribe: (cb) => subscribe(COLLECTIONS.CUSTOMERS, cb, {
        orderBy: [['createdAt', 'desc']]
    })
};

// ============================================================
// DEALER HELPERS
// ============================================================
const Dealers = {
    create: (uid, data) => create(COLLECTIONS.DEALERS, data, uid),
    get: (uid) => read(COLLECTIONS.DEALERS, uid),
    update: (uid, updates) => update(COLLECTIONS.DEALERS, uid, updates),
    approve: (uid, adminData = {}) => update(COLLECTIONS.DEALERS, uid, {
        status: 'Approved',
        approvedAt: serverTimestamp(),
        approvedBy: adminData.email || 'admin',
        tier: adminData.tier || 'Bronze'
    }),
    reject: (uid, reason, adminData = {}) => update(COLLECTIONS.DEALERS, uid, {
        status: 'Rejected',
        rejectedAt: serverTimestamp(),
        rejectReason: reason,
        rejectedBy: adminData.email || 'admin'
    }),
    list: (options = {}) => listAll(COLLECTIONS.DEALERS, options),
    listPending: () => listAll(COLLECTIONS.DEALERS, {
        where: [['status', '==', 'Pending']],
        orderBy: [['createdAt', 'desc']]
    }),
    subscribe: (cb) => subscribe(COLLECTIONS.DEALERS, cb, {
        orderBy: [['createdAt', 'desc']]
    })
};

// ============================================================
// PRODUCT HELPERS
// ============================================================
const Products = {
    create: (id, data) => create(COLLECTIONS.PRODUCTS, data, id),
    get: (id) => read(COLLECTIONS.PRODUCTS, id),
    update: (id, updates) => update(COLLECTIONS.PRODUCTS, id, updates),
    list: (options = {}) => listAll(COLLECTIONS.PRODUCTS, options),
    listByCategory: (category) => listAll(COLLECTIONS.PRODUCTS, {
        where: [['category', '==', category]]
    }),
    bulkUpsert: async (products) => {
        const batch = writeBatch(db);
        let count = 0;

        for (const product of products) {
            if (!product.id) continue;
            const ref = doc(db, COLLECTIONS.PRODUCTS, product.id);
            batch.set(ref, { ...product, updatedAt: serverTimestamp() }, { merge: true });
            count++;
            if (count % 450 === 0) await batch.commit();
        }
        if (count % 450 !== 0) await batch.commit();
        return true;
    },
    updatePrice: (id, newPrice) => update(COLLECTIONS.PRODUCTS, id, { displayPrice: newPrice }),
    subscribe: (cb) => subscribe(COLLECTIONS.PRODUCTS, cb)
};

// ============================================================
// ORDER HELPERS
// ============================================================
const Orders = {
    create: (orderId, data) => create(COLLECTIONS.ORDERS, data, orderId),
    get: (orderId) => read(COLLECTIONS.ORDERS, orderId),
    getByOrderId: async (orderId) => {
        const results = await findByField(COLLECTIONS.ORDERS, 'orderId', orderId);
        return results[0] || null;
    },
    update: (orderId, updates) => update(COLLECTIONS.ORDERS, orderId, updates),
    updateStatus: (orderId, status, note = '') => update(COLLECTIONS.ORDERS, orderId, {
        status,
        statusUpdatedAt: serverTimestamp(),
        statusNote: note
    }),
    listByCustomer: (customerId, options = {}) => listAll(COLLECTIONS.ORDERS, {
        where: [['customerId', '==', customerId]],
        orderBy: [['createdAt', 'desc']],
        ...options
    }),
    listAll: (options = {}) => listAll(COLLECTIONS.ORDERS, {
        orderBy: [['createdAt', 'desc']],
        ...options
    }),
    listByStatus: (status) => listAll(COLLECTIONS.ORDERS, {
        where: [['status', '==', status]],
        orderBy: [['createdAt', 'desc']]
    }),
    subscribe: (cb) => subscribe(COLLECTIONS.ORDERS, cb, {
        orderBy: [['createdAt', 'desc']]
    }),
    subscribeByCustomer: (customerId, cb) => subscribe(COLLECTIONS.ORDERS, cb, {
        where: [['customerId', '==', customerId]],
        orderBy: [['createdAt', 'desc']]
    })
};

// ============================================================
// CART HELPERS
// ============================================================
const Cart = {
    get: async (userId) => {
        const cartDoc = await read(COLLECTIONS.CARTS, userId);
        return cartDoc?.items || [];
    },
    save: (userId, items) => create(COLLECTIONS.CARTS, { items }, userId),
    addItem: async (userId, item) => {
        const items = await Cart.get(userId);
        item.cartId = 'CART-' + Date.now();
        item.addedAt = new Date().toISOString();
        items.push(item);
        await Cart.save(userId, items);
        return item;
    },
    updateItem: async (userId, cartId, updates) => {
        const items = await Cart.get(userId);
        const idx = items.findIndex(i => i.cartId === cartId);
        if (idx < 0) return null;
        items[idx] = { ...items[idx], ...updates };
        await Cart.save(userId, items);
        return items[idx];
    },
    removeItem: async (userId, cartId) => {
        const items = await Cart.get(userId);
        const filtered = items.filter(i => i.cartId !== cartId);
        await Cart.save(userId, filtered);
        return filtered;
    },
    clear: (userId) => Cart.save(userId, [])
};

// ============================================================
// NOTIFICATIONS
// ============================================================
const Notifications = {
    create: (data) => create(COLLECTIONS.NOTIFICATIONS, { ...data, read: false }),
    markRead: (id) => update(COLLECTIONS.NOTIFICATIONS, id, { read: true }),
    markAllRead: async () => {
        const list = await listAll(COLLECTIONS.NOTIFICATIONS, {
            where: [['read', '==', false]]
        });
        const batch = writeBatch(db);
        list.forEach(n => {
            batch.update(doc(db, COLLECTIONS.NOTIFICATIONS, n.id), { read: true });
        });
        await batch.commit();
    },
    subscribe: (cb) => subscribe(COLLECTIONS.NOTIFICATIONS, cb, {
        orderBy: [['createdAt', 'desc']],
        limit: 50
    })
};

// ============================================================
// EXPORT
// ============================================================
export {
    COLLECTIONS,
    create, read, update, remove, listAll, findByField, subscribe,
    Customers, Dealers, Products, Orders, Cart, Notifications
};
