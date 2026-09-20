/* ============================================================
   FIRESTORE SERVICE — Unified CRUD Layer
   Raj Marketing Mysore
   ============================================================ */

import { db } from '../firebase-config.js';
import {
    collection, doc, getDoc, getDocs, setDoc, addDoc,
    updateDoc, deleteDoc, query, where, orderBy, limit,
    serverTimestamp, onSnapshot, increment, writeBatch,
    Timestamp, startAfter, endBefore
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
    ADMIN_SESSIONS: 'adminSessions',
    APP_LOGS: 'appLogs'
};

// ============================================================
// GENERIC CRUD
// ============================================================
async function create(collectionName, data, customId = null) {
    try {
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
    } catch (e) {
        console.error(`Create ${collectionName} error:`, e);
        throw e;
    }
}

async function read(collectionName, id) {
    try {
        const snap = await getDoc(doc(db, collectionName, id));
        if (!snap.exists()) return null;
        return { id: snap.id, ...snap.data() };
    } catch (e) {
        console.error(`Read ${collectionName}/${id} error:`, e);
        throw e;
    }
}

async function update(collectionName, id, updates) {
    try {
        await updateDoc(doc(db, collectionName, id), {
            ...updates,
            updatedAt: serverTimestamp()
        });
        return { id, ...updates };
    } catch (e) {
        console.error(`Update ${collectionName}/${id} error:`, e);
        throw e;
    }
}

async function remove(collectionName, id) {
    try {
        await deleteDoc(doc(db, collectionName, id));
        return true;
    } catch (e) {
        console.error(`Delete ${collectionName}/${id} error:`, e);
        throw e;
    }
}

async function listAll(collectionName, options = {}) {
    try {
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
    } catch (e) {
        console.error(`List ${collectionName} error:`, e);
        throw e;
    }
}

async function findByField(collectionName, field, value) {
    try {
        const q = query(collection(db, collectionName), where(field, '==', value));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error(`Find ${collectionName} by ${field}:`, e);
        throw e;
    }
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
    }, error => {
        console.error(`Subscribe ${collectionName} error:`, error);
    });
}

// ============================================================
// CUSTOMER-SPECIFIC HELPERS
// ============================================================
const Customers = {
    async create(uid, data) {
        return create(COLLECTIONS.CUSTOMERS, data, uid);
    },
    async get(uid) {
        return read(COLLECTIONS.CUSTOMERS, uid);
    },
    async update(uid, updates) {
        return update(COLLECTIONS.CUSTOMERS, uid, updates);
    },
    async getByMobile(mobile) {
        return findByField(COLLECTIONS.CUSTOMERS, 'mobile', mobile);
    },
    async list(options = {}) {
        return listAll(COLLECTIONS.CUSTOMERS, options);
    },
    subscribe(callback) {
        return subscribe(COLLECTIONS.CUSTOMERS, callback, {
            orderBy: [['createdAt', 'desc']]
        });
    }
};

// ============================================================
// DEALER-SPECIFIC HELPERS
// ============================================================
const Dealers = {
    async create(uid, data) {
        return create(COLLECTIONS.DEALERS, data, uid);
    },
    async get(uid) {
        return read(COLLECTIONS.DEALERS, uid);
    },
    async update(uid, updates) {
        return update(COLLECTIONS.DEALERS, uid, updates);
    },
    async approve(uid, adminData = {}) {
        return update(COLLECTIONS.DEALERS, uid, {
            status: 'Approved',
            approvedAt: serverTimestamp(),
            approvedBy: adminData.email || 'admin',
            tier: adminData.tier || 'Bronze'
        });
    },
    async reject(uid, reason, adminData = {}) {
        return update(COLLECTIONS.DEALERS, uid, {
            status: 'Rejected',
            rejectedAt: serverTimestamp(),
            rejectReason: reason,
            rejectedBy: adminData.email || 'admin'
        });
    },
    async list(options = {}) {
        return listAll(COLLECTIONS.DEALERS, options);
    },
    async listPending() {
        return listAll(COLLECTIONS.DEALERS, {
            where: [['status', '==', 'Pending']],
            orderBy: [['createdAt', 'desc']]
        });
    },
    subscribe(callback) {
        return subscribe(COLLECTIONS.DEALERS, callback, {
            orderBy: [['createdAt', 'desc']]
        });
    }
};

// ============================================================
// PRODUCT HELPERS
// ============================================================
const Products = {
    async create(id, data) {
        return create(COLLECTIONS.PRODUCTS, data, id);
    },
    async get(id) {
        return read(COLLECTIONS.PRODUCTS, id);
    },
    async update(id, updates) {
        return update(COLLECTIONS.PRODUCTS, id, updates);
    },
    async list(options = {}) {
        return listAll(COLLECTIONS.PRODUCTS, options);
    },
    async listByCategory(category) {
        return listAll(COLLECTIONS.PRODUCTS, {
            where: [['category', '==', category]]
        });
    },
    async bulkUpsert(products) {
        const batch = writeBatch(db);
        let count = 0;

        for (const product of products) {
            if (!product.id) continue;
            const ref = doc(db, COLLECTIONS.PRODUCTS, product.id);
            batch.set(ref, {
                ...product,
                updatedAt: serverTimestamp()
            }, { merge: true });
            count++;

            if (count % 450 === 0) {
                await batch.commit();
                count = 0;
            }
        }

        if (count > 0) await batch.commit();
        return true;
    },
    async updatePrice(id, newPrice) {
        return update(COLLECTIONS.PRODUCTS, id, { displayPrice: newPrice });
    },
    subscribe(callback) {
        return subscribe(COLLECTIONS.PRODUCTS, callback);
    }
};

// ============================================================
// ORDER HELPERS
// ============================================================
const Orders = {
    async create(orderId, data) {
        return create(COLLECTIONS.ORDERS, data, orderId);
    },
    async get(orderId) {
        return read(COLLECTIONS.ORDERS, orderId);
    },
    async getByOrderId(orderId) {
        const results = await findByField(COLLECTIONS.ORDERS, 'orderId', orderId);
        return results[0] || null;
    },
    async update(orderId, updates) {
        return update(COLLECTIONS.ORDERS, orderId, updates);
    },
    async updateStatus(orderId, status, note = '') {
        return update(COLLECTIONS.ORDERS, orderId, {
            status,
            statusUpdatedAt: serverTimestamp(),
            statusNote: note
        });
    },
    async listByCustomer(customerId, options = {}) {
        return listAll(COLLECTIONS.ORDERS, {
            where: [['customerId', '==', customerId]],
            orderBy: [['createdAt', 'desc']],
            ...options
        });
    },
    async listAll(options = {}) {
        return listAll(COLLECTIONS.ORDERS, {
            orderBy: [['createdAt', 'desc']],
            ...options
        });
    },
    async listByStatus(status) {
        return listAll(COLLECTIONS.ORDERS, {
            where: [['status', '==', status]],
            orderBy: [['createdAt', 'desc']]
        });
    },
    async addTimelineEntry(orderId, entry) {
        const order = await read(COLLECTIONS.ORDERS, orderId);
        if (!order) return;

        const timeline = order.timeline || [];
        timeline.push({
            ...entry,
            timestamp: new Date().toISOString()
        });

        return update(COLLECTIONS.ORDERS, orderId, { timeline });
    },
    subscribe(callback) {
        return subscribe(COLLECTIONS.ORDERS, callback, {
            orderBy: [['createdAt', 'desc']]
        });
    },
    subscribeByCustomer(customerId, callback) {
        return subscribe(COLLECTIONS.ORDERS, callback, {
            where: [['customerId', '==', customerId]],
            orderBy: [['createdAt', 'desc']]
        });
    }
};

// ============================================================
// CART HELPERS
// ============================================================
const Cart = {
    async get(userId) {
        const cartDoc = await read(COLLECTIONS.CARTS, userId);
        return cartDoc?.items || [];
    },
    async save(userId, items) {
        return create(COLLECTIONS.CARTS, { items }, userId);
    },
    async addItem(userId, item) {
        const items = await Cart.get(userId);
        item.cartId = 'CART-' + Date.now();
        item.addedAt = new Date().toISOString();
        items.push(item);
        await Cart.save(userId, items);
        return item;
    },
    async updateItem(userId, cartId, updates) {
        const items = await Cart.get(userId);
        const idx = items.findIndex(i => i.cartId === cartId);
        if (idx < 0) return null;
        items[idx] = { ...items[idx], ...updates };
        await Cart.save(userId, items);
        return items[idx];
    },
    async removeItem(userId, cartId) {
        const items = await Cart.get(userId);
        const filtered = items.filter(i => i.cartId !== cartId);
        await Cart.save(userId, filtered);
        return filtered;
    },
    async clear(userId) {
        return Cart.save(userId, []);
    },
    subscribe(userId, callback) {
        return onSnapshot(doc(db, COLLECTIONS.CARTS, userId), snap => {
            callback(snap.exists() ? (snap.data().items || []) : []);
        });
    }
};

// ============================================================
// NOTIFICATIONS
// ============================================================
const Notifications = {
    async create(data) {
        return create(COLLECTIONS.NOTIFICATIONS, {
            ...data,
            read: false
        });
    },
    async markRead(id) {
        return update(COLLECTIONS.NOTIFICATIONS, id, { read: true });
    },
    async markAllRead() {
        const list = await listAll(COLLECTIONS.NOTIFICATIONS, {
            where: [['read', '==', false]]
        });
        const batch = writeBatch(db);
        list.forEach(n => {
            batch.update(doc(db, COLLECTIONS.NOTIFICATIONS, n.id), { read: true });
        });
        await batch.commit();
    },
    async listRecent(limitCount = 20) {
        return listAll(COLLECTIONS.NOTIFICATIONS, {
            orderBy: [['createdAt', 'desc']],
            limit: limitCount
        });
    },
    subscribe(callback) {
        return subscribe(COLLECTIONS.NOTIFICATIONS, callback, {
            orderBy: [['createdAt', 'desc']],
            limit: 50
        });
    }
};

// ============================================================
// VISITOR STATS
// ============================================================
const VisitorStats = {
    async incrementDaily() {
        const today = new Date().toISOString().split('T')[0];
        const ref = doc(db, COLLECTIONS.VISITOR_STATS, today);

        try {
            const snap = await getDoc(ref);
            if (snap.exists()) {
                await updateDoc(ref, {
                    views: increment(1),
                    lastVisit: serverTimestamp()
                });
            } else {
                await setDoc(ref, {
                    date: today,
                    views: 1,
                    uniqueVisitors: 1,
                    createdAt: serverTimestamp(),
                    lastVisit: serverTimestamp()
                });
            }
        } catch (e) {
            console.warn('Visitor increment failed:', e.message);
        }
    },
    async getRange(days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const sinceStr = since.toISOString().split('T')[0];

        const list = await listAll(COLLECTIONS.VISITOR_STATS, {
            where: [['date', '>=', sinceStr]],
            orderBy: [['date', 'asc']]
        });
        return list;
    }
};

// ============================================================
// BUSINESS RULES
// ============================================================
const BusinessRules = {
    async get() {
        return read(COLLECTIONS.BUSINESS_RULES, 'global');
    },
    async update(rules) {
        return create(COLLECTIONS.BUSINESS_RULES, rules, 'global');
    }
};

// ============================================================
// ESTIMATES
// ============================================================
const Estimates = {
    async create(id, data) {
        return create(COLLECTIONS.ESTIMATES, data, id);
    },
    async get(id) {
        return read(COLLECTIONS.ESTIMATES, id);
    },
    async update(id, updates) {
        return update(COLLECTIONS.ESTIMATES, id, updates);
    },
    async listByDealer(dealerId) {
        return listAll(COLLECTIONS.ESTIMATES, {
            where: [['dealerId', '==', dealerId]],
            orderBy: [['createdAt', 'desc']]
        });
    },
    async listByCustomer(customerId) {
        return listAll(COLLECTIONS.ESTIMATES, {
            where: [['customerId', '==', customerId]],
            orderBy: [['createdAt', 'desc']]
        });
    },
    subscribe(callback) {
        return subscribe(COLLECTIONS.ESTIMATES, callback, {
            orderBy: [['createdAt', 'desc']]
        });
    }
};

// ============================================================
// FEEDBACK
// ============================================================
const Feedback = {
    async create(data) {
        return create(COLLECTIONS.FEEDBACK, data);
    },
    async list(options = {}) {
        return listAll(COLLECTIONS.FEEDBACK, {
            orderBy: [['createdAt', 'desc']],
            ...options
        });
    }
};

// ============================================================
// EXPORT
// ============================================================
export {
    COLLECTIONS,
    create, read, update, remove, listAll, findByField, subscribe,
    Customers, Dealers, Products, Orders, Cart,
    Notifications, VisitorStats, BusinessRules, Estimates, Feedback
};
