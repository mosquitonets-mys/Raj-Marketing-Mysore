/* ============================================================
   product-detail.js
   Loads product from Firestore (falls back to static data),
   renders gallery, info, calculator, tabs, related products.
============================================================ */

import { db } from './firebase-config.js';
import { doc, getDoc, collection, getDocs, query, limit } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// ============================================================
// STATIC FALLBACK (must match products.html IDs exactly)
// ============================================================
const STATIC_PRODUCTS = {
    'velcro-economic': { name:'Velcro System – Economic', category:'Velcro', variant:'Economic', price:65, unit:'sq.ft', description:'Economical velcro-based mosquito net.', images:['images/velcro-economic.jpg'], colours:['Ivory','White','Black'], types:['Single','Double'], onlinePurchase:true },
    'velcro-premium': { name:'Velcro System – Premium Saint-Gobain', category:'Velcro', variant:'Premium Saint-Gobain', price:80, unit:'sq.ft', description:'Premium velcro net with Saint-Gobain mesh.', images:['images/velcro-premium.jpg'], colours:['Ivory','White'], types:['Single','Double'], onlinePurchase:true },
    'aluminium-black-ss': { name:'Aluminium Frame – Black Coated SS Mesh', category:'Aluminium', variant:'Regular + Black Coated SS', price:200, unit:'sq.ft', description:'Aluminium frame with black coated SS mesh.', images:['images/aluminium-black-ss.jpg'], colours:['Black','Ivory'], types:['Single','Double','Sliding'], onlinePurchase:false },
    'aluminium-bright-ss': { name:'Aluminium Frame – Bright SS 304 Mesh', category:'Aluminium', variant:'Regular + Bright SS 304', price:220, unit:'sq.ft', description:'Aluminium frame with bright SS 304 mesh.', images:['images/aluminium-bright-ss.jpg'], colours:['Silver','Ivory'], types:['Single','Double'], onlinePurchase:false },
    'aluminium-teakwood': { name:'Premium Teakwood – Black Coated SS Mesh', category:'Premium', variant:'Teakwood + Black Coated SS', price:300, unit:'sq.ft', description:'Premium teakwood finish with black SS mesh.', images:['images/aluminium-teakwood.jpg'], colours:['Teakwood'], types:['Single','Double'], onlinePurchase:false },
    'pleated-gold': { name:'Pleated Mesh – Gold Detachable', category:'Pleated', variant:'32mm Single', price:380, originalPrice:420, discount:10, unit:'sq.ft', description:'Pleated mesh with gold finish.', images:['images/pleated-gold.jpg'], colours:['Gold','Ivory'], types:['Single'], onlinePurchase:false },
    'pleated-platinum': { name:'Pleated SS Mesh – Platinum Detachable', category:'Pleated', variant:'25mm Single', price:500, unit:'sq.ft', description:'Pleated SS mesh with platinum finish.', images:['images/pleated-platinum.jpg'], colours:['Platinum'], types:['Single'], onlinePurchase:false },
    'pleated-diamond': { name:'Pleated SS Mesh – Diamond Detachable', category:'Pleated', variant:'32mm Single', price:560, unit:'sq.ft', description:'Pleated SS mesh with diamond finish.', images:['images/pleated-diamond.jpg'], colours:['Diamond'], types:['Single'], onlinePurchase:false },
    'honeycomb-gold': { name:'Pleated Honeycomb Gold – Detachable', category:'Pleated', variant:'32mm Single', price:520, unit:'sq.ft', description:'Honeycomb pleated net.', images:['images/honeycomb-gold.jpg'], colours:['Gold'], types:['Single'], onlinePurchase:false },
    'single-sliding-economic': { name:'Single Sliding Economic', category:'Sliding', variant:'Single Sliding', price:400, unit:'sq.ft', description:'Single sliding mosquito net.', images:['images/single-sliding.jpg'], colours:['Ivory','Black'], types:['Single'], onlinePurchase:false },
    'double-sliding-economic': { name:'Double Sliding Economic', category:'Sliding', variant:'Double Sliding', price:450, unit:'sq.ft', description:'Double sliding mosquito net.', images:['images/double-sliding.jpg'], colours:['Ivory','Black'], types:['Double'], onlinePurchase:false },
    'security-screen-single-door': { name:'Security Screen – Single Door', category:'Security', variant:'Single Door + GST', price:990, unit:'sq.ft', description:'Security screen for single door.', images:['images/security-screen-single.jpg'], colours:['Black'], types:['Single'], onlinePurchase:false },
    'security-screen-double-door': { name:'Security Screen – Double Door', category:'Security', variant:'Double Door + GST', price:1150, unit:'sq.ft', description:'Security screen for double door.', images:['images/security-screen-double.jpg'], colours:['Black'], types:['Double'], onlinePurchase:false },
    'ss-black-mesh-0.18mm': { name:'SS Black Mesh 0.18mm', category:'Mesh', variant:'0.18mm Black', price:36, unit:'sq.ft', description:'SS black mesh 0.18mm.', images:['images/ss-black-mesh.jpg'], colours:['Black'], types:['Roll'], onlinePurchase:false },
    'ss-black-mesh': { name:'SS Black Mesh', category:'Mesh', variant:'Black', price:38, unit:'sq.ft', description:'SS black mesh.', images:['images/ss-black-mesh-standard.jpg'], colours:['Black'], types:['Roll'], onlinePurchase:false },
    'ss-black-mesh-3ft': { name:'SS Black Mesh 3 ft', category:'Mesh', variant:'3 ft Black', price:42, unit:'sq.ft', description:'SS black mesh 3 ft.', images:['images/ss-black-mesh-3ft.jpg'], colours:['Black'], types:['Roll'], onlinePurchase:false },
    'ss-bright-mesh-0.24mm-4ft': { name:'SS Bright Mesh 0.24mm, 4 ft', category:'Mesh', variant:'0.24mm Bright 4ft', price:48, unit:'sq.ft', description:'SS bright mesh 0.24mm.', images:['images/ss-bright-mesh.jpg'], colours:['Bright'], types:['Roll'], onlinePurchase:false },
    'ss-black-304g-0.5mm': { name:'SS Black 304G 0.5mm', category:'Mesh', variant:'304G 0.5mm', price:550, unit:'sq.ft', description:'SS black 304G 0.5mm.', images:['images/ss-black-304g.jpg'], colours:['Black'], types:['Roll'], onlinePurchase:false },
    'fiber-touflex-mesh': { name:'Fiber/Touflex Mesh', category:'Mesh', variant:'Fiber Mesh', price:8, unit:'sq.ft', description:'Fiber touflex mesh.', images:['images/fiber-mesh.jpg'], colours:['Grey'], types:['Roll'], onlinePurchase:false },
    'mesh-door-black': { name:'Mesh Door – Black Coated SS Mesh', category:'Door', variant:'Regular + Black Coated SS', price:350, unit:'sq.ft', description:'Mesh door with black SS.', images:['images/mesh-door-black.jpg'], colours:['Black'], types:['Single','Double'], onlinePurchase:false },
    'mesh-door-bright': { name:'Mesh Door – Bright SS 304 Mesh', category:'Door', variant:'Regular + Bright SS 304', price:380, unit:'sq.ft', description:'Mesh door with bright SS 304.', images:['images/mesh-door-bright.jpg'], colours:['Bright'], types:['Single','Double'], onlinePurchase:false }
};

// ============================================================
// STATE
// ============================================================
let currentProduct = null;
let currentQty = 1;
let currentUnit = 'in'; // 'in' or 'cm'
let selectedColour = null;
let selectedType = null;
let currentSlide = 0;
let unitRate = 0;

const WIDTH_OPTIONS_IN = [12,18,24,30,36,42,48,54,60,66,72,78,84,90,96,102,108,114,120];
const HEIGHT_OPTIONS_IN = [12,18,24,30,36,42,48,54,60,66,72,78,84,90,96,102,108,114,120];

// ============================================================
// HELPERS
// ============================================================
const qs = (id) => document.getElementById(id);

function toCm(inches) { return Math.round(inches * 2.54); }
function fromCm(cm) { return Math.round(cm / 2.54); }
function formatINR(n) { return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }); }

// ============================================================
// INIT
// ============================================================
async function init() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        showError('No product ID provided');
        return;
    }

    try {
        // Try Firestore first
        let product = null;
        try {
            const snap = await getDoc(doc(db, 'products', productId));
            if (snap.exists()) {
                product = { id: snap.id, ...snap.data() };
            }
        } catch (e) {
            console.warn('Firestore lookup failed, using static data:', e.message);
        }

        // Fallback to static
        if (!product && STATIC_PRODUCTS[productId]) {
            product = { id: productId, ...STATIC_PRODUCTS[productId] };
        }

        if (!product) {
            showError('Product not found');
            return;
        }

        currentProduct = product;
        renderProduct(product);
        qs('loadingState').style.display = 'none';
        qs('productContainer').style.display = 'block';

    } catch (err) {
        console.error('Init error:', err);
        showError(err.message);
    }
}

function showError(msg) {
    qs('loadingState').style.display = 'none';
    qs('errorState').style.display = 'block';
    const p = qs('errorState').querySelector('p');
    if (p) p.textContent = msg || 'The product you are looking for does not exist.';
}

// ============================================================
// RENDER
// ============================================================
function renderProduct(p) {
    // SEO
    document.title = `${p.name} – Raj Marketing Mysore`;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.content = p.description || `Buy ${p.name} in Mysore.`;
    const ogT = qs('ogTitle'); if (ogT) ogT.content = p.name;
    const ogD = qs('ogDescription'); if (ogD) ogD.content = p.description || '';
    const twT = qs('twitterTitle'); if (twT) twT.content = p.name;
    const twD = qs('twitterDescription'); if (twD) twD.content = p.description || '';

    // Title / variant / breadcrumb
    qs('productTitle').textContent = p.name;
    qs('productVariant').textContent = p.variant || '';
    qs('breadcrumbCategory').textContent = p.category || 'Category';
    qs('breadcrumbProduct').textContent = p.name;
    qs('productDescription').textContent = p.description || '';

    // Price
    unitRate = Number(p.price) || 0;
    qs('currentPrice').textContent = formatINR(unitRate);
    qs('priceUnit').textContent = '/ ' + (p.unit || 'sq.ft');
    if (p.originalPrice) {
        qs('originalPrice').textContent = formatINR(p.originalPrice);
        qs('originalPrice').style.display = 'inline';
    }
    if (p.discount) {
        qs('discountTag').textContent = p.discount + '% OFF';
        qs('discountTag').style.display = 'inline';
    }

    // Gallery
    const images = p.images && p.images.length ? p.images : ['images/placeholder.jpg'];
    buildGallery(images);
    const badge = qs('galleryBadge');
    if (badge) badge.textContent = p.category || 'Product';

    // Colours
    const colours = p.colours && p.colours.length ? p.colours : ['Ivory'];
    selectedColour = colours[0];
    qs('selectedColour').textContent = selectedColour;
    qs('colourOptions').innerHTML = colours.map((c, i) => {
        const cls = 'colour-' + c.toLowerCase().replace(/\s+/g, '-');
        return `<span class="colour ${cls} ${i===0?'active':''}" data-colour="${c}" title="${c}"></span>`;
    }).join('');
    qs('colourOptions').querySelectorAll('.colour').forEach(el => {
        el.addEventListener('click', () => {
            qs('colourOptions').querySelectorAll('.colour').forEach(x => x.classList.remove('active'));
            el.classList.add('active');
            selectedColour = el.dataset.colour;
            qs('selectedColour').textContent = selectedColour;
        });
    });

    // Types
    const types = p.types && p.types.length ? p.types : ['Single'];
    selectedType = types[0];
    qs('selectedType').textContent = selectedType;
    qs('typeOptions').innerHTML = types.map((t, i) =>
        `<span class="type ${i===0?'active':''}" data-type="${t}">${t}</span>`
    ).join('');
    qs('typeOptions').querySelectorAll('.type').forEach(el => {
        el.addEventListener('click', () => {
            qs('typeOptions').querySelectorAll('.type').forEach(x => x.classList.remove('active'));
            el.classList.add('active');
            selectedType = el.dataset.type;
            qs('selectedType').textContent = selectedType;
        });
    });

    // Populate width/height selects
    populateDimensionSelects();

    // Buy actions
    buildBuyActions(p);

    // Tabs
    buildTabs(p);

    // Related
    buildRelated(p);

    // Calculator
    calculatePrice();

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pane = qs('tab-' + btn.dataset.tab);
            if (pane) pane.classList.add('active');
        });
    });
}

// ============================================================
// GALLERY
// ============================================================
function buildGallery(images) {
    const track = qs('galleryTrack');
    const dots = qs('galleryDots');
    const thumbs = qs('galleryThumbs');
    const counter = qs('galleryCounter');

    track.innerHTML = images.map(src =>
        `<div class="gallery-slide"><img src="${src}" alt="" loading="lazy" onerror="this.src='images/placeholder.jpg'"></div>`
    ).join('');

    dots.innerHTML = images.map((_, i) =>
        `<button class="dot ${i===0?'active':''}" data-i="${i}"></button>`
    ).join('');

    thumbs.innerHTML = images.map((src, i) =>
        `<div class="thumb ${i===0?'active':''}" data-i="${i}"><img src="${src}" alt="" onerror="this.src='images/placeholder.jpg'"></div>`
    ).join('');

    const goTo = (i) => {
        currentSlide = (i + images.length) % images.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('active', idx === currentSlide));
        thumbs.querySelectorAll('.thumb').forEach((t, idx) => t.classList.toggle('active', idx === currentSlide));
        counter.textContent = `${currentSlide + 1} / ${images.length}`;
    };

    qs('galleryPrev').onclick = () => goTo(currentSlide - 1);
    qs('galleryNext').onclick = () => goTo(currentSlide + 1);
    dots.querySelectorAll('.dot').forEach(d => d.onclick = () => goTo(+d.dataset.i));
    thumbs.querySelectorAll('.thumb').forEach(t => t.onclick = () => goTo(+t.dataset.i));

    // Swipe
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) goTo(currentSlide + (dx < 0 ? 1 : -1));
    });
}

// ============================================================
// DIMENSIONS
// ============================================================
function populateDimensionSelects() {
    const wSel = qs('widthSelect');
    const hSel = qs('heightSelect');
    const buildOptions = () => {
        if (currentUnit === 'in') {
            return WIDTH_OPTIONS_IN.map(v => `<option value="${v}">${v}"</option>`).join('');
        }
        return WIDTH_OPTIONS_IN.map(v => `<option value="${toCm(v)}">${toCm(v)} cm</option>`).join('');
    };
    wSel.innerHTML = buildOptions();
    hSel.innerHTML = buildOptions();
    wSel.value = currentUnit === 'in' ? 36 : toCm(36);
    hSel.value = currentUnit === 'in' ? 48 : toCm(48);
    qs('widthUnitBadge').textContent = currentUnit;
    qs('heightUnitBadge').textContent = currentUnit;
}

window.setUnit = function(unit) {
    currentUnit = unit;
    document.querySelectorAll('.unit-toggle button').forEach(b => {
        b.classList.toggle('active', b.dataset.unit === unit);
    });
    populateDimensionSelects();
    calculatePrice();
};

// ============================================================
// CALCULATOR
// ============================================================
window.changeQty = function(delta) {
    const input = qs('qtyInput');
    let v = parseInt(input.value, 10) || 1;
    v = Math.max(1, Math.min(999, v + delta));
    input.value = v;
    calculatePrice();
};

window.calculatePrice = function() {
    if (!currentProduct) return;

    const wRaw = parseFloat(qs('widthSelect').value) || 0;
    const hRaw = parseFloat(qs('heightSelect').value) || 0;
    const qty = Math.max(1, parseInt(qs('qtyInput').value, 10) || 1);

    // Convert to inches for sq.ft calc
    const wIn = currentUnit === 'cm' ? fromCm(wRaw) : wRaw;
    const hIn = currentUnit === 'cm' ? fromCm(hRaw) : hRaw;

    const perUnitSqFt = (wIn * hIn) / 144;
    const totalSqFt = perUnitSqFt * qty;
    const total = totalSqFt * unitRate;

    qs('sqftValue').textContent = perUnitSqFt.toFixed(2);
    qs('breakdownPerUnit').textContent = perUnitSqFt.toFixed(2) + ' sq.ft';
    qs('breakdownQty').textContent = '× ' + qty;
    qs('breakdownTotalSqft').textContent = totalSqFt.toFixed(2) + ' sq.ft';
    qs('breakdownRate').textContent = formatINR(unitRate);
    qs('breakdownTotal').textContent = formatINR(Math.round(total));
    qs('totalBarValue').textContent = formatINR(Math.round(total));
};

// ============================================================
// BUY ACTIONS
// ============================================================
function buildBuyActions(p) {
    const isOnline = p.onlinePurchase !== false;
    const container = qs('buyActions');
    if (isOnline) {
        container.innerHTML = `
            <button class="btn btn-add-cart" onclick="addToCart()">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn btn-buy-now" onclick="buyNow()">
                <i class="fas fa-bolt"></i> Buy Now
            </button>
        `;
    } else {
        container.innerHTML = `
            <button class="btn btn-buy-now" style="grid-column:1/-1;" onclick="bookAppointment()">
                <i class="fas fa-calendar-check"></i> Book Appointment
            </button>
        `;
    }
}

window.addToCart = function() {
    if (!currentProduct) return;
    const total = parseFloat(qs('breakdownTotal').textContent.replace(/[^0-9.]/g, '')) || 0;
    const cart = JSON.parse(localStorage.getItem('rm_cart') || '[]');
    cart.push({
        id: currentProduct.id,
        name: currentProduct.name,
        colour: selectedColour,
        type: selectedType,
        width: qs('widthSelect').value,
        height: qs('heightSelect').value,
        unit: currentUnit,
        qty: parseInt(qs('qtyInput').value, 10),
        total: total
    });
    localStorage.setItem('rm_cart', JSON.stringify(cart));
    showToast('✅ Added to cart!');
};

window.buyNow = function() {
    window.addToCart();
    window.location.href = 'checkout.html';
};

window.bookAppointment = function() {
    window.location.href = 'appointment.html?product=' + encodeURIComponent(currentProduct.name);
};

function showToast(msg) {
    let toast = document.querySelector('.cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'cart-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================================================
// TABS CONTENT
// ============================================================
function buildTabs(p) {
    // Description
    qs('descriptionContent').innerHTML = `<p>${p.longDescription || p.description || ''}</p>`;
    const apps = p.applications || ['Windows', 'Doors', 'Balcony'];
    qs('appTags').innerHTML = apps.map(a => `<span class="app-tag">${a}</span>`).join('');

    // Specs
    const specs = p.specs || {
        'Product Type': p.category || 'Mosquito Net',
        'Mesh': 'Premium Quality',
        'Frame': 'Aluminium',
        'Custom Size': 'Yes',
        'Warranty': 'As applicable'
    };
    qs('specTable').innerHTML = Object.entries(specs).map(([k, v]) =>
        `<tr><td class="spec-label">${k}</td><td class="spec-value">${v}</td></tr>`
    ).join('');

    // Benefits
    const benefits = p.benefits || ['Mosquito Protection', 'Custom Measurements', 'Durable Materials', 'Easy Maintenance'];
    qs('benefitsGrid').innerHTML = benefits.map(b =>
        `<div class="benefit-card"><i class="fas fa-check-circle"></i><span>${b}</span></div>`
    ).join('');

    // Installation
    const steps = ['Book Appointment', 'Site Measurement', 'Confirm Order', 'Manufacturing', 'Installation'];
    qs('processSteps').innerHTML = steps.map((s, i) =>
        `<div class="process-step"><span class="step-num">${i+1}</span><span>${s}</span></div>`
    ).join('');

    // FAQs
    const faqs = p.faqs || [
        { q: 'Can this be customized?', a: 'Yes, custom sizes are available.' },
        { q: 'Is installation included?', a: 'Yes, professional installation is available in Mysore.' },
        { q: 'What is the warranty?', a: 'Warranty as per manufacturer terms.' }
    ];
    qs('faqList').innerHTML = faqs.map((f, i) =>
        `<div class="faq-item ${i===0?'open':''}">
            <div class="faq-q"><span>${f.q}</span><i class="fas fa-chevron-down"></i></div>
            <div class="faq-a">${f.a}</div>
        </div>`
    ).join('');
    qs('faqList').querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
    });
}

// ============================================================
// RELATED
// ============================================================
async function buildRelated(p) {
    const grid = qs('relatedGrid');
    if (!grid) return;

    const all = Object.entries(STATIC_PRODUCTS)
        .filter(([id]) => id !== p.id && STATIC_PRODUCTS[id].category === p.category)
        .slice(0, 4);

    if (!all.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:20px;">No related products.</div>';
        return;
    }

    grid.innerHTML = all.map(([id, r]) => `
        <a href="product-detail.html?id=${id}" class="related-card">
            <div class="related-img"><img src="${r.images[0]}" alt="${r.name}" onerror="this.src='images/placeholder.jpg'"></div>
            <div class="related-name">${r.name}</div>
            <div class="related-price">${formatINR(r.price)}</div>
        </a>
    `).join('');
}

// ============================================================
// BOOT
// ============================================================
init();
