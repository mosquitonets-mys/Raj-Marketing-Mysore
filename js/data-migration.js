/* ============================================================
   DATA MIGRATION — localStorage → Firestore
   Raj Marketing Mysore
   Run once from browser console or via admin panel
============================================================ */

import { db } from '../firebase-config.js';
import {
    collection, doc, setDoc, writeBatch, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { Products, BusinessRules } from './firestore-service.js';

async function migrateAllData() {
    console.log('🚀 Starting migration...');
    const results = { products: 0, rules: 0, errors: [] };

    // ===== 1. MIGRATE PRODUCTS =====
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

    // ===== 2. MIGRATE PRICE UPDATES =====
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
        console.error('❌ Price migration failed:', e);
    }

    // ===== 3. MIGRATE BUSINESS RULES =====
    try {
        const rules = JSON.parse(localStorage.getItem('raj_business_rules') || '{}');
        if (Object.keys(rules).length) {
            console.log('⚙️ Migrating business rules...');
            await BusinessRules.update(rules);
            console.log('✅ Business rules migrated');
            results.rules = 1;
        }
    } catch (e) {
        results.errors.push('Rules: ' + e.message);
        console.error('❌ Rules migration failed:', e);
    }

    // ===== 4. MIGRATE ORDERS =====
    try {
        const orders = JSON.parse(localStorage.getItem('raj_orders') || '[]');
        if (orders.length) {
            console.log(`📋 Migrating ${orders.length} orders...`);
            const batch = writeBatch(db);
            let count = 0;

            for (const order of orders) {
                const orderId = order.orderId || order.id || 'ORD-' + Date.now();
                const ref = doc(db, 'orders', orderId);
                batch.set(ref, {
                    ...order,
                    orderId,
                    createdAt: order.createdAt || new Date().toISOString(),
                    updatedAt: serverTimestamp()
                }, { merge: true });
                count++;

                if (count % 400 === 0) {
                    await batch.commit();
                }
            }
            if (count > 0) await batch.commit();
            console.log(`✅ ${count} orders migrated`);
        }
    } catch (e) {
        results.errors.push('Orders: ' + e.message);
        console.error('❌ Orders migration failed:', e);
    }

    // ===== 5. MIGRATE CUSTOMERS (basic) =====
    try {
        const customers = JSON.parse(localStorage.getItem('raj_customers') || '[]');
        if (customers.length) {
            console.log(`👥 Found ${customers.length} local customers`);
            console.log('ℹ️ Customers must re-register to create Firebase Auth accounts.');
            console.log('   Their profiles will be linked to their new UIDs.');
        }
    } catch (e) {
        results.errors.push('Customers: ' + e.message);
    }

    // ===== 6. MIGRATE DEALERS =====
    try {
        const dealers = JSON.parse(localStorage.getItem('raj_dealers') || '[]');
        if (dealers.length) {
            console.log(`🏢 Found ${dealers.length} local dealers`);
            console.log('ℹ️ Dealers must re-register to create Firebase Auth accounts.');
        }
    } catch (e) {
        results.errors.push('Dealers: ' + e.message);
    }

    console.log('🎉 Migration complete!', results);
    return results;
}

// Expose to window
window.migrateData = migrateAllData;

console.log('%c📦 Data Migration tool loaded. Run migrateData() to start.', 'color:#f59e0b;font-weight:bold;');
