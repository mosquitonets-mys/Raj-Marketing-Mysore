/* ============================================================
   DATA MIGRATION — localStorage → Firestore
   Raj Marketing Mysore
   Run once from admin panel or browser console
   ============================================================ */

import { db } from '../firebase-config.js';
import {
    doc, setDoc, writeBatch, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { Products, BusinessRules as _ } from './firestore-service.js';

async function migrateAllData() {
    console.log('🚀 Starting migration...');
    const results = { products: 0, rules: 0, orders: 0, errors: [] };

    // ===== MIGRATE PRODUCTS =====
    try {
        const products = JSON.parse(localStorage.getItem('raj_master_products') || '[]');
        if (products.length) {
            console.log(`📦 Migrating ${products.length} products...`);
            await Products.bulkUpsert(products);
            results.products = products.length;
            console.log('✅ Products migrated');
        } else {
            console.log('ℹ️ No products to migrate');
        }
    } catch (e) {
        results.errors.push('Products: ' + e.message);
        console.error('❌ Product migration failed:', e);
    }

    // ===== MIGRATE PRICE UPDATES =====
    try {
        const priceUpdates = JSON.parse(localStorage.getItem('raj_price_updates') || '{}');
        const entries = Object.entries(priceUpdates);
        if (entries.length) {
            console.log(`💰 Migrating ${entries.length} price updates...`);
            for (const [id, price] of entries) {
                await Products.updatePrice(id, price);
            }
            console.log('✅ Prices migrated');
        }
    } catch (e) {
        results.errors.push('Prices: ' + e.message);
    }

    // ===== MIGRATE BUSINESS RULES =====
    try {
        const rules = JSON.parse(localStorage.getItem('raj_business_rules') || '{}');
        if (Object.keys(rules).length) {
            await setDoc(doc(db, 'businessRules', 'global'), {
                ...rules,
                updatedAt: serverTimestamp()
            }, { merge: true });
            results.rules = 1;
            console.log('✅ Business rules migrated');
        }
    } catch (e) {
        results.errors.push('Rules: ' + e.message);
    }

    // ===== MIGRATE ORDERS =====
    try {
        const orders = JSON.parse(localStorage.getItem('raj_orders') || '[]');
        if (orders.length) {
            console.log(`📋 Migrating ${orders.length} orders...`);
            let count = 0;
            for (const order of orders) {
                const orderId = order.orderId || order.id || 'ORD-' + Date.now();
                await setDoc(doc(db, 'orders', orderId), {
                    ...order,
                    orderId,
                    createdAt: order.createdAt || new Date().toISOString(),
                    updatedAt: serverTimestamp()
                }, { merge: true });
                count++;
            }
            results.orders = count;
            console.log(`✅ ${count} orders migrated`);
        }
    } catch (e) {
        results.errors.push('Orders: ' + e.message);
    }

    console.log('🎉 Migration complete!', results);
    return results;
}

// Expose to window
window.migrateData = migrateAllData;

console.log('%c📦 Data Migration tool loaded. Run migrateData() to start.', 'color:#f59e0b;font-weight:bold;');
