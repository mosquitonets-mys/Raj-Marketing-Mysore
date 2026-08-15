// pricing-engine.js - Centralized pricing engine
// Import this into any page that needs pricing calculations

import { collection, getDocs, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

// ============================================================
// PRICING ENGINE CLASS
// ============================================================
export class PricingEngine {
    constructor() {
        this.products = [];
        this.priceList = [];
        this.dealerSettings = null;
        this.extraCharges = [];
        this.loaded = false;
    }

    async initialize() {
        if (this.loaded) return;
        try {
            // Load products
            const productSnap = await getDocs(collection(db, 'products'));
            this.products = [];
            productSnap.forEach(doc => this.products.push({ id: doc.id, ...doc.data() }));

            // Load price list
            const priceSnap = await getDocs(collection(db, 'priceList'));
            this.priceList = [];
            priceSnap.forEach(doc => this.priceList.push({ id: doc.id, ...doc.data() }));

            // Load dealer settings
            const settingsSnap = await getDoc(doc(db, 'dealerSettings', 'eligibility'));
            if (settingsSnap.exists()) {
                this.dealerSettings = settingsSnap.data();
            }

            // Load extra charges
            const chargeSnap = await getDocs(collection(db, 'extraCharges'));
            this.extraCharges = [];
            chargeSnap.forEach(doc => this.extraCharges.push({ id: doc.id, ...doc.data() }));

            this.loaded = true;
            console.log('✅ Pricing engine initialized');
        } catch (error) {
            console.error('❌ Pricing engine initialization failed:', error);
            throw error;
        }
    }

    // ============================================================
    // GET PRODUCT PRICE
    // ============================================================
    getProductPrice(productId, userRole = 'customer') {
        const product = this.products.find(p => p.id === productId);
        if (!product) return null;

        const price = this.priceList.find(p => p.productId === productId);
        if (!price) return null;

        // Determine which price to return based on role
        if (userRole === 'admin' || userRole === 'dealer') {
            return {
                product: product,
                price: price,
                rate: price.dealerBasePrice || price.customerPrice,
                role: userRole
            };
        } else {
            // Customer - only show customer price
            return {
                product: product,
                price: price,
                rate: price.customerPrice,
                role: 'customer'
            };
        }
    }

    // ============================================================
    // CALCULATE SQ.FT
    // ============================================================
    calculateSqft(width, height, quantity = 1) {
        if (width <= 0 || height <= 0) return 0;
        return (width * height * quantity) / 144;
    }

    // ============================================================
    // CALCULATE MINIMUM BILLING
    // ============================================================
    calculateMinimumBilling(sqft, productType) {
        let minSqft = sqft;
        if (productType === 'Window') {
            minSqft = Math.max(sqft, 9); // Minimum 9 feet for windows
        } else if (productType === 'Door') {
            minSqft = Math.max(sqft, 21); // Minimum 21 feet for doors
        }
        return minSqft;
    }

    // ============================================================
    // CALCULATE DEALER DISCOUNT
    // ============================================================
    calculateDealerDiscount(dealerData) {
        if (!dealerData) return 0;

        const monthsActive = dealerData.monthsActive || 0;
        let discount = this.dealerSettings?.initialDiscount || 12;

        if (monthsActive >= 12 && dealerData.performanceApproved) {
            discount = Math.min(discount + 8, this.dealerSettings?.maxDiscount || 25);
        } else if (monthsActive >= 6) {
            discount = Math.min(discount + 3, 20);
        } else if (monthsActive >= 3) {
            discount = Math.min(discount + 5, 17);
        }

        // Admin override
        if (dealerData.customDiscount && dealerData.customDiscount > 0) {
            discount = Math.min(dealerData.customDiscount, this.dealerSettings?.maxDiscount || 25);
        }

        return discount;
    }

    // ============================================================
    // CALCULATE ESTIMATE
    // ============================================================
    calculateEstimate(params) {
        const {
            productId,
            width,
            height,
            quantity = 1,
            userRole = 'customer',
            dealerData = null,
            includeInstallation = false,
            includeDelivery = false,
            includeWoodFinish = false,
            includeWallInstallation = false,
            discountPercent = 0
        } = params;

        // Get product price
        const priceData = this.getProductPrice(productId, userRole);
        if (!priceData) return null;

        const product = priceData.product;
        const rate = priceData.rate || 0;

        // Calculate sqft
        let sqft = this.calculateSqft(width, height, quantity);

        // Apply minimum billing
        const billableSqft = this.calculateMinimumBilling(sqft, product.category);

        // Calculate subtotal
        let subtotal = billableSqft * rate;

        // Apply dealer discount if applicable
        let dealerDiscount = 0;
        if (userRole === 'dealer' && dealerData) {
            dealerDiscount = this.calculateDealerDiscount(dealerData);
            subtotal = subtotal * (1 - dealerDiscount / 100);
        }

        // Apply extra discount
        if (discountPercent > 0) {
            subtotal = subtotal * (1 - discountPercent / 100);
        }

        // Add extra charges
        let extraChargesTotal = 0;
        if (includeInstallation) {
            const installation = this.extraCharges.find(c => c.type === 'installation');
            if (installation) extraChargesTotal += billableSqft * (installation.price || 0);
        }
        if (includeDelivery) {
            const delivery = this.extraCharges.find(c => c.type === 'delivery');
            if (delivery) extraChargesTotal += delivery.price || 0;
        }
        if (includeWoodFinish) {
            const woodFinish = this.extraCharges.find(c => c.name === 'Wood Finish');
            if (woodFinish) extraChargesTotal += billableSqft * woodFinish.price;
        }
        if (includeWallInstallation) {
            const wallInstall = this.extraCharges.find(c => c.name === 'Wall Installation');
            if (wallInstall) extraChargesTotal += billableSqft * wallInstall.price;
        }

        const total = subtotal + extraChargesTotal;

        // GST (18%)
        const gst = total * 0.18;
        const grandTotal = total + gst;

        return {
            product: product,
            rate: rate,
            width: width,
            height: height,
            quantity: quantity,
            actualSqft: sqft,
            billableSqft: billableSqft,
            subtotal: subtotal,
            dealerDiscount: dealerDiscount,
            extraCharges: extraChargesTotal,
            gst: gst,
            total: total,
            grandTotal: grandTotal,
            // Detailed breakdown
            breakdown: {
                sqft: billableSqft,
                rate: rate,
                baseAmount: billableSqft * rate,
                discountPercent: dealerDiscount,
                discountAmount: (billableSqft * rate) * (dealerDiscount / 100),
                extraCharges: extraChargesTotal,
                gst: gst
            }
        };
    }

    // ============================================================
    // GET PLEATED PRICE (Manufacturer × 2)
    // ============================================================
    getPleatedPrice(manufacturerRate) {
        if (!manufacturerRate) return null;
        return manufacturerRate * 2;
    }

    // ============================================================
    // GET DEALER DISCOUNT FOR PLEATED
    // ============================================================
    getDealerPleatedPrice(manufacturerRate, dealerDiscount) {
        if (!manufacturerRate) return null;
        const base = manufacturerRate * 2;
        return base * (1 - dealerDiscount / 100);
    }
}

// ============================================================
// SINGLETON INSTANCE
// ============================================================
let pricingEngine = null;

export async function getPricingEngine() {
    if (!pricingEngine) {
        pricingEngine = new PricingEngine();
        await pricingEngine.initialize();
    }
    return pricingEngine;
}

export default PricingEngine;
