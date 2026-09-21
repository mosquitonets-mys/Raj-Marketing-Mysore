/* ============================================================
   PRODUCT DETAIL ENGINE — FIRESTORE
   Raj Marketing Mysore · v5.0
   ============================================================ */

import { Products as FirestoreProducts } from './firestore-service.js';

(function() {
    'use strict';

    let currentProduct = null;
    let currentSlide = 0;
    let currentColour = 'Ivory';
    let currentType = 'Single';
    let selectedImages = [];

    // Measurement state
    let currentUnit = 'in';
    let selectedWidth = 36;
    let selectedHeight = 48;
    let selectedQty = 1;

    const MIN_DIM = { in: 12, cm: 30 };
    const MAX_DIM = { in: 60, cm: 152 };
    const CM_PER_INCH = 2.54;

    // ============================================================
    // INIT
    // ============================================================
    async function init() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id') || 'pleated-economic';

        // Show loading
        document.getElementById('loadingState').style.display = 'block';
        document.getElementById('productContainer').style.display = 'none';

        let product = null;

        // Try Firestore first
        try {
            product = await FirestoreProducts.get(id);
        } catch (e) {
            console.warn('Firestore fetch failed, trying localStorage');
        }

        // Fallback to localStorage
        if (!product) {
            try {
                const products = JSON.parse(localStorage.getItem('raj_master_products') || '[]');
                product = products.find(p => p.id === id);
            } catch (e) {}
        }

        if (!product) {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('errorState').style.display = 'block';
            return;
        }

        currentProduct = product;
        currentColour = (product.colours && product.colours[0]) || 'Ivory';
        currentType = (product.types && product.types[0]) || 'Single';
        selectedImages = product.images || ['images/placeholder.jpg'];
        currentSlide = 0;
        selectedWidth = 36;
        selectedHeight = 48;
        selectedQty = 1;

        setTimeout(() => {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('productContainer').style.display = 'block';
            renderProduct(product);
        }, 250);
    }

    // ============================================================
    // RENDER PRODUCT
    // ============================================================
    function renderProduct(product) {
        // Breadcrumb
        const bcCat = document.getElementById('breadcrumbCategory');
        const bcProd = document.getElementById('breadcrumbProduct');
        if (bcCat) {
            bcCat.textContent = product.category || 'Product';
            bcCat.href = `products.html?cat=${(product.category || '').toLowerCase()}`;
        }
        if (bcProd) bcProd.textContent = product.name;

        // Header
        document.getElementById('productTitle').textContent = product.name;
        document.getElementById('productVariant').textContent = product.variant || '';
        document.getElementById('galleryBadge').textContent = product.category || 'Product';

        // Price
        document.getElementById('currentPrice').textContent = `₹${product.displayPrice || product.price || 0}`;

        // Description
        document.getElementById('productDescription').textContent = product.description || '';

        // Gallery
        renderGallery(product);

        // Colour options
        renderColourOptions(product);

        // Type options
        renderTypeOptions(product);

        // Calculator
        initializeCalculator(product);

        // CTA
        renderBuyActions(product);

        // Tabs content
        document.getElementById('descriptionContent').innerHTML =
            `<p>${product.description || ''}</p>${product.longDescription ? `<p>${product.longDescription}</p>` : ''}`;

        document.getElementById('appTags').innerHTML = (product.applications || [])
            .map(a => `<span class="tag">${a}</span>`).join('');

        document.getElementById('specTable').innerHTML = Object.entries(product.specs || {})
            .map(([k, v]) => `<tr><td class="label">${k}</td><td class="value">${v}</td></tr>`).join('');

        const benefitIcons = ['fa-check-circle', 'fa-star', 'fa-shield-alt', 'fa-trophy', 'fa-gem', 'fa-award'];
        document.getElementById('benefitsGrid').innerHTML = (product.benefits || [])
            .map((b, i) => `
                <div class="benefit-item">
                    <i class="fas ${benefitIcons[i % benefitIcons.length]}"></i>
                    <span>${b}</span>
                </div>
            `).join('');

        const faqs = product.faqs || [];
        document.getElementById('faqList').innerHTML = faqs.map((f, i) => `
            <div class="faq-item ${i === 0 ? 'open' : ''}">
                <div class="faq-question" onclick="toggleFaq(this)">
                    <span>${f.q}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">${f.a}</div>
            </div>
        `).join('');

        // Related products
        renderRelated(product);

        calculatePrice();
    }

    // ============================================================
    // GALLERY
    // ============================================================
    function renderGallery(product) {
        const track = document.getElementById('galleryTrack');
        const dots = document.getElementById('galleryDots');
        const thumbs = document.getElementById('galleryThumbs');
        const images = product.images || ['images/placeholder.jpg'];

        track.innerHTML = images.map((src, i) => `
            <div class="gallery-slide">
                <img src="${src}" alt="${product.name} - Image ${i + 1}"
                     loading="${i === 0 ? 'eager' : 'lazy'}"
                     onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fas fa-box icon-placeholder\\'></i>'" />
            </div>
        `).join('');

        if (images.length > 1) {
            dots.innerHTML = images.map((_, i) =>
                `<button class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></button>`
            ).join('');
            dots.style.display = 'flex';

            thumbs.innerHTML = images.map((src, i) => `
                <button class="thumb ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})">
                    <img src="${src}" alt="Thumb ${i + 1}" loading="lazy" onerror="this.style.display='none'" />
                </button>
            `).join('');
            thumbs.style.display = 'flex';
        }
    }

    // ============================================================
    // COLOUR / TYPE
    // ============================================================
    function renderColourOptions(product) {
        const container = document.getElementById('colourOptions');
        if (!container) return;
        const colours = product.colours || ['Ivory'];
        container.innerHTML = colours.map(colour => {
            const colourClass = colour.toLowerCase().replace(/\s+/g, '-');
            const isActive = colour === currentColour;
            return `
                <div class="colour-item ${isActive ? 'active' : ''}" onclick="selectColour(this, '${colour}')">
                    <span class="colour colour-${colourClass}" title="${colour}"></span>
                    <span class="colour-name">${colour}</span>
                </div>
            `;
        }).join('');
    }

    function renderTypeOptions(product) {
        const container = document.getElementById('typeOptions');
        if (!container) return;
        const types = product.types || ['Single'];
        container.innerHTML = types.map(type => {
            const isActive = type === currentType;
            return `<button class="type ${isActive ? 'active' : ''}" onclick="selectType(this, '${type}')">${type}</button>`;
        }).join('');
    }

    // ============================================================
    // CALCULATOR
    // ============================================================
    function initializeCalculator(product) {
        populateDimensionDropdowns();
        const ws = document.getElementById('widthSelect');
        const hs = document.getElementById('heightSelect');
        if (ws) ws.value = selectedWidth;
        if (hs) hs.value = selectedHeight;
        const qi = document.getElementById('qtyInput');
        if (qi) qi.value = selectedQty;
    }

    function populateDimensionDropdowns() {
        const widthSelect = document.getElementById('widthSelect');
        const heightSelect = document.getElementById('heightSelect');
        if (!widthSelect || !heightSelect) return;

        const step = currentUnit === 'in' ? 1 : 5;
        const min = MIN_DIM[currentUnit];
        const max = MAX_DIM[currentUnit];

        widthSelect.innerHTML = '';
        heightSelect.innerHTML = '';

        for (let val = min; val <= max; val += step) {
            const label = currentUnit === 'cm' ? `${val} cm` : `${val}"`;
            const opt1 = new Option(label, val);
            const opt2 = new Option(label, val);
            widthSelect.appendChild(opt1);
            heightSelect.appendChild(opt2);
        }
    }

    window.setUnit = function(unit) {
        if (unit === currentUnit) return;

        if (unit === 'cm') {
            selectedWidth = Math.round(selectedWidth * CM_PER_INCH);
            selectedHeight = Math.round(selectedHeight * CM_PER_INCH);
        } else {
            selectedWidth = Math.round(selectedWidth / CM_PER_INCH);
            selectedHeight = Math.round(selectedHeight / CM_PER_INCH);
        }

        currentUnit = unit;
        document.querySelectorAll('.unit-toggle button').forEach(b => {
            b.classList.toggle('active', b.dataset.unit === unit);
        });

        const wb = document.getElementById('widthUnitBadge');
        const hb = document.getElementById('heightUnitBadge');
        if (wb) wb.textContent = unit;
        if (hb) hb.textContent = unit;

        populateDimensionDropdowns();

        const min = MIN_DIM[unit], max = MAX_DIM[unit];
        const step = unit === 'in' ? 1 : 5;
        selectedWidth = Math.max(min, Math.min(max, Math.round(selectedWidth / step) * step));
        selectedHeight = Math.max(min, Math.min(max, Math.round(selectedHeight / step) * step));

        document.getElementById('widthSelect').value = selectedWidth;
        document.getElementById('heightSelect').value = selectedHeight;

        calculatePrice();
    };

    window.changeQty = function(delta) {
        const input = document.getElementById('qtyInput');
        if (!input) return;
        let val = parseInt(input.value) || 1;
        val = Math.max(1, Math.min(999, val + delta));
        input.value = val;
        selectedQty = val;
        calculatePrice();
    };

    window.calculatePrice = function() {
        if (!currentProduct) return;

        selectedWidth = parseFloat(document.getElementById('widthSelect')?.value) || 36;
        selectedHeight = parseFloat(document.getElementById('heightSelect')?.value) || 48;
        selectedQty = parseInt(document.getElementById('qtyInput')?.value) || 1;
        selectedQty = Math.max(1, Math.min(999, selectedQty));

        let wIn = currentUnit === 'in' ? selectedWidth : selectedWidth / CM_PER_INCH;
        let hIn = currentUnit === 'in' ? selectedHeight : selectedHeight / CM_PER_INCH;

        const perUnitSqft = (wIn * hIn) / 144;
        const totalSqft = perUnitSqft * selectedQty;
        const rate = parseFloat(currentProduct.displayPrice || currentProduct.price || 0);
        const totalPrice = totalSqft * rate;

        const sv = document.getElementById('sqftValue');
        if (sv) sv.textContent = perUnitSqft.toFixed(2);

        const bpu = document.getElementById('breakdownPerUnit');
        if (bpu) bpu.textContent = perUnitSqft.toFixed(2) + ' sq.ft';
        const bq = document.getElementById('breakdownQty');
        if (bq) bq.textContent = '× ' + selectedQty;
        const bts = document.getElementById('breakdownTotalSqft');
        if (bts) bts.textContent = totalSqft.toFixed(2) + ' sq.ft';
        const br = document.getElementById('breakdownRate');
        if (br) br.textContent = '₹' + rate.toFixed(2);
        const bt = document.getElementById('breakdownTotal');
        if (bt) bt.textContent = '₹' + Math.round(totalPrice).toLocaleString('en-IN');
        const tbv = document.getElementById('totalBarValue');
        if (tbv) tbv.textContent = '₹' + Math.round(totalPrice).toLocaleString('en-IN');

        currentProduct._calc = {
            width: selectedWidth,
            height: selectedHeight,
            unit: currentUnit,
            qty: selectedQty,
            perUnitSqft,
            totalSqft,
            rate,
            totalPrice
        };
    };

    // ============================================================
    // BUY ACTIONS
    // ============================================================
    function renderBuyActions(product) {
        const container = document.getElementById('buyActions');
        if (!container) return;

        if (product.onlinePurchase !== false) {
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
                <button class="btn btn-add-cart" style="grid-column:1/-1;border-color:#f59e0b;color:#d97706;" onclick="bookAppointment()">
                    <i class="fas fa-calendar-check"></i> Book Appointment
                </button>
            `;
        }
    }

    window.addToCart = async function() {
        if (!currentProduct || !currentProduct._calc) return;
        const calc = currentProduct._calc;

        const item = {
            productId: currentProduct.id,
            productName: currentProduct.name,
            image: (currentProduct.images && currentProduct.images[0]) || '',
            colour: currentColour,
            type: currentType,
            width: calc.width,
            height: calc.height,
            unit: calc.unit,
            qty: calc.qty,
            perUnitSqft: calc.perUnitSqft,
            totalSqft: calc.totalSqft,
            rate: calc.rate,
            totalPrice: calc.totalPrice
        };

        await window.CartEngine.addItem(item);
        showCartToast(`✅ Added to cart`);
    };

    window.buyNow = async function() {
        await window.addToCart();
        setTimeout(() => window.location.href = 'cart.html', 600);
    };

    window.bookAppointment = function() {
        const calc = currentProduct._calc || {};
        const params = new URLSearchParams({
            product: currentProduct.name,
            width: calc.width || '',
            height: calc.height || '',
            unit: calc.unit || 'in',
            qty: calc.qty || 1
        });
        window.location.href = 'appointment.html?' + params.toString();
    };

    // ============================================================
    // RELATED
    // ============================================================
    async function renderRelated(product) {
        const container = document.getElementById('relatedGrid');
        if (!container) return;

        const relatedIds = product.related || [];
        if (!relatedIds.length) {
            container.innerHTML = '';
            return;
        }

        try {
            const relatedProducts = [];
            for (const rid of relatedIds) {
                try {
                    const p = await FirestoreProducts.get(rid);
                    if (p) relatedProducts.push(p);
                } catch (e) {}
            }

            container.innerHTML = relatedProducts.map(p => {
                const img = (p.images && p.images[0]) || 'images/placeholder.jpg';
                return `
                    <a href="product-detail.html?id=${p.id}" class="related-card">
                        <div class="img-wrap">
                            <img src="${img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" />
                        </div>
                        <div class="name">${p.name}</div>
                        <div class="price">₹${p.displayPrice || p.price || 0}</div>
                    </a>
                `;
            }).join('');
        } catch (e) {
            container.innerHTML = '';
        }
    }

    // ============================================================
    // HELPERS
    // ============================================================
    window.goToSlide = function(index) {
        const track = document.getElementById('galleryTrack');
        if (!track || !selectedImages.length) return;
        const total = selectedImages.length;
        currentSlide = Math.max(0, Math.min(index, total - 1));
        track.style.transform = `translateX(-${currentSlide * (100 / total)}%)`;
        document.querySelectorAll('.gallery-dots .dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        document.querySelectorAll('.gallery-thumbs .thumb').forEach((t, i) => t.classList.toggle('active', i === currentSlide));
        const counter = document.getElementById('galleryCounter');
        if (counter) counter.textContent = `${currentSlide + 1} / ${total}`;
    };

    window.changeSlide = function(dir) {
        const total = selectedImages.length;
        if (!total) return;
        goToSlide((currentSlide + dir + total) % total);
    };

    window.selectColour = function(el, colour) {
        document.querySelectorAll('.colour-options .colour-item').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        currentColour = colour;
        const sv = document.getElementById('selectedColour');
        if (sv) sv.textContent = colour;
    };

    window.selectType = function(el, type) {
        document.querySelectorAll('.type-options .type').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        currentType = type;
        const st = document.getElementById('selectedType');
        if (st) st.textContent = type;
    };

    window.toggleFaq = function(el) {
        const item = el.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-list .faq-item').forEach(f => f.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    };

    function showCartToast(msg) {
        document.querySelectorAll('.cart-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ============================================================
    // BOOT
    // ============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('%c✅ Product Detail Engine (Firestore) loaded', 'color:#1a56db;font-weight:bold;');
})();
