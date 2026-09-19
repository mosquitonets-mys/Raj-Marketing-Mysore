/* ============================================================
   PRODUCT DETAIL ENGINE — WITH MEASUREMENT CALCULATOR
   Raj Marketing Mysore · v4.0
   ============================================================ */

(function() {
    'use strict';

    // ============================================================
    // PRODUCT DATABASE (abbreviated — same as before, add your full data)
    // ============================================================
    const PRODUCT_DB = {
        'pleated-economic': {
            id: 'pleated-economic',
            name: 'Pleated Economic',
            category: 'Pleated',
            variant: 'Standard Pleated',
            displayPrice: 420,
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'pleated',
            description: 'Economical pleated mosquito net for windows and doors.',
            longDescription: 'Compact folding design that retracts neatly when not in use.',
            specs: {
                'Product Type': 'Pleated Mosquito Net',
                'Mesh Type': 'Fiber Mesh',
                'Frame Material': 'Aluminium',
                'Operation': 'Pleated Folding',
                'Custom Size': 'Yes',
                'Warranty': '1 Year'
            },
            benefits: ['Space Saving', 'Easy Operation', 'Affordable', 'Custom Sizes', 'Neat Look'],
            applications: ['Windows', 'Doors', 'Balcony', 'Kitchen', 'Bedroom'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White'],
            types: ['Single', 'Double'],
            images: ['images/pleated-economic.jpg', 'images/pleated-economic-2.jpg', 'images/pleated-economic-3.jpg'],
            faqs: [
                { q: 'What is the price range?', a: 'Starts from ₹380/sq.ft depending on size.' },
                { q: 'Is installation included?', a: 'Professional installation available at extra charge.' }
            ],
            related: ['pleated-heavy', 'single-sliding-economic', 'aluminium-frame-colour-mesh']
        },

        'velcro-economic': {
            id: 'velcro-economic',
            name: 'Velcro System – Economic',
            category: 'Velcro',
            variant: 'Economic',
            displayPrice: 65,
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'velcro',
            description: 'Adhesive-based flexible mosquito net for windows.',
            longDescription: 'Perfect for rental homes and quick installation needs.',
            specs: {
                'Product Type': 'Velcro Mosquito Net',
                'Mesh Type': 'Fiber Mesh',
                'Installation': 'Adhesive Velcro',
                'Warranty': '6 Months'
            },
            benefits: ['Easy Install', 'Removable', 'Affordable', 'No Drilling'],
            applications: ['Windows', 'Rental Homes', 'Quick Setup'],
            colours: ['White', 'Black', 'Ivory'],
            types: ['Standard'],
            images: ['images/velcro-economic.jpg', 'images/velcro-economic-2.jpg', 'images/velcro-economic-3.jpg'],
            faqs: [{ q: 'Does this require drilling?', a: 'No, adhesive-based.' }],
            related: ['velcro-premium', 'aluminium-frame-colour-mesh']
        },

        'aluminium-black-ss': {
            id: 'aluminium-black-ss',
            name: 'Aluminium Frame – Black Coated SS Mesh',
            category: 'Aluminium',
            variant: 'Black SS',
            displayPrice: 200,
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'frame',
            description: 'Durable aluminium frame with black coated SS mesh.',
            longDescription: 'Long-lasting protection with a premium finish.',
            specs: {
                'Product Type': 'Aluminium Frame',
                'Mesh Type': 'Black Coated SS',
                'Frame Material': 'Aluminium',
                'Warranty': '5 Years'
            },
            benefits: ['Durable', 'SS Mesh', 'Corrosion Resistant'],
            applications: ['Windows', 'Doors', 'Commercial'],
            colours: ['Ivory', 'Black', 'Brown'],
            types: ['Single', 'Double'],
            images: ['images/aluminium-black-ss.jpg'],
            faqs: [{ q: 'What is the warranty?', a: '5 years on frame.' }],
            related: ['aluminium-bright-ss', 'pleated-gold']
        }

        // … add rest of your products
    };

    // ============================================================
    // STATE
    // ============================================================
    let currentProduct = null;
    let currentSlide = 0;
    let currentColour = 'Ivory';
    let currentType = 'Single';
    let selectedImages = [];

    // Measurement state
    let currentUnit = 'in'; // 'in' or 'cm'
    let selectedWidth = 36;
    let selectedHeight = 48;
    let selectedQty = 1;

    // ============================================================
    // CONSTANTS
    // ============================================================
    const MIN_DIM = { in: 12, cm: 30 };  // 12 inches = ~30 cm
    const MAX_DIM = { in: 60, cm: 152 }; // 60 inches = ~152 cm
    const CM_PER_INCH = 2.54;

    // ============================================================
    // INIT
    // ============================================================
    function init() {
        loadProduct();
        setupEventListeners();
    }

    function loadProduct() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id') || 'pleated-economic';
        const product = PRODUCT_DB[id];

        if (!product) {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('errorState').style.display = 'block';
            return;
        }

        currentProduct = product;
        currentColour = product.colours[0] || 'Ivory';
        currentType = product.types[0] || 'Single';
        selectedImages = product.images || ['images/placeholder.jpg'];
        currentSlide = 0;

        // Default dimensions in inches
        selectedWidth = 36;
        selectedHeight = 48;
        selectedQty = 1;

        setTimeout(() => {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('productContainer').style.display = 'block';
            renderProduct(product);
            updateSEO(product);
            updateSchema(product);
        }, 250);
    }

    // ============================================================
    // RENDER PRODUCT
    // ============================================================
    function renderProduct(product) {
        // Breadcrumb
        document.getElementById('breadcrumbCategory').textContent = product.category;
        document.getElementById('breadcrumbCategory').href = `products.html?cat=${product.category.toLowerCase()}`;
        document.getElementById('breadcrumbProduct').textContent = product.name;

        // Header
        document.getElementById('productTitle').textContent = product.name;
        document.getElementById('productVariant').textContent = product.variant || '';
        document.getElementById('galleryBadge').textContent = product.category;
        document.getElementById('ratingCount').textContent = `(${Math.floor(Math.random() * 30) + 15} reviews)`;

        // Stock
        const stockBadge = document.getElementById('stockBadge');
        if (product.onlinePurchase) {
            stockBadge.innerHTML = '<i class="fas fa-check-circle"></i> In Stock';
        } else {
            stockBadge.innerHTML = '<i class="fas fa-calendar-check"></i> Book Only';
            stockBadge.style.background = '#fef3c7';
            stockBadge.style.color = '#d97706';
        }

        // Price
        document.getElementById('currentPrice').textContent = `₹${product.displayPrice}`;
        document.getElementById('priceUnit').textContent = `/ ${product.unit}`;

        const origEl = document.getElementById('originalPrice');
        if (product.originalPrice) {
            origEl.textContent = `₹${product.originalPrice}`;
            origEl.style.display = 'inline';
        } else {
            origEl.style.display = 'none';
        }

        const discEl = document.getElementById('discountTag');
        if (product.discount) {
            discEl.textContent = `${product.discount}% OFF`;
            discEl.style.display = 'inline';
        } else {
            discEl.style.display = 'none';
        }

        // Description
        document.getElementById('productDescription').textContent = product.description;

        // Gallery
        renderGallery(product);

        // Colour & Type
        renderColourOptions(product);
        renderTypeOptions(product);

        // Initialize dropdowns and calculator
        initializeCalculator(product);

        // Render CTA buttons inside calculator (Buy / Cart)
        renderBuyActions(product);

        // Tabs content
        document.getElementById('descriptionContent').innerHTML =
            `<p>${product.description}</p><p>${product.longDescription}</p>`;

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

        const steps = [
            { title: 'Contact Us', desc: 'Call, WhatsApp or enquire' },
            { title: 'Book Measurement', desc: 'Free site visit' },
            { title: 'Confirm Order', desc: 'Transparent pricing' },
            { title: 'Installation', desc: 'Professional fitment' }
        ];
        document.getElementById('processSteps').innerHTML = steps
            .map((s, i) => `
                <div class="step-item">
                    <div class="step-number">${i + 1}</div>
                    <div class="step-content">
                        <h4>${s.title}</h4>
                        <p>${s.desc}</p>
                    </div>
                </div>
            `).join('');

        document.getElementById('faqList').innerHTML = (product.faqs || [])
            .map((f, i) => `
                <div class="faq-item ${i === 0 ? 'open' : ''}">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>${f.q}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">${f.a}</div>
                </div>
            `).join('');

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
        const counter = document.getElementById('galleryCounter');
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
                `<button class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})" aria-label="Image ${i + 1}"></button>`
            ).join('');
            dots.style.display = 'flex';

            thumbs.innerHTML = images.map((src, i) => `
                <button class="thumb ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})">
                    <img src="${src}" alt="Thumb ${i + 1}" loading="lazy" onerror="this.style.display='none'" />
                </button>
            `).join('');
            thumbs.style.display = 'flex';

            counter.textContent = `1 / ${images.length}`;
            counter.style.display = 'block';
            document.getElementById('galleryPrev').style.display = 'flex';
            document.getElementById('galleryNext').style.display = 'flex';
        } else {
            dots.style.display = 'none';
            thumbs.style.display = 'none';
            counter.style.display = 'none';
            document.getElementById('galleryPrev').style.display = 'none';
            document.getElementById('galleryNext').style.display = 'none';
        }
    }

    // ============================================================
    // COLOUR
    // ============================================================
    function renderColourOptions(product) {
        const container = document.getElementById('colourOptions');
        container.innerHTML = product.colours.map(colour => {
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

    // ============================================================
    // TYPE
    // ============================================================
    function renderTypeOptions(product) {
        const container = document.getElementById('typeOptions');
        container.innerHTML = product.types.map(type => {
            const isActive = type === currentType;
            return `<button class="type ${isActive ? 'active' : ''}" onclick="selectType(this, '${type}')">${type}</button>`;
        }).join('');
    }

    // ============================================================
    // INITIALIZE MEASUREMENT CALCULATOR
    // ============================================================
    function initializeCalculator(product) {
        // Populate width & height dropdowns based on default unit
        populateDimensionDropdowns();

        // Set default values
        document.getElementById('widthSelect').value = selectedWidth;
        document.getElementById('heightSelect').value = selectedHeight;
        document.getElementById('qtyInput').value = selectedQty;
    }

    function populateDimensionDropdowns() {
        const widthSelect = document.getElementById('widthSelect');
        const heightSelect = document.getElementById('heightSelect');

        const step = currentUnit === 'in' ? 1 : 5; // 1 inch step or 5 cm step
        const min = MIN_DIM[currentUnit];
        const max = MAX_DIM[currentUnit];

        widthSelect.innerHTML = '';
        heightSelect.innerHTML = '';

        for (let val = min; val <= max; val += step) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = `${val}"`; // shows 36" etc.
            if (currentUnit === 'cm') opt.textContent = `${val} cm`;
            widthSelect.appendChild(opt.cloneNode(true));
            heightSelect.appendChild(opt.cloneNode(true));
        }
    }

    // ============================================================
    // UNIT TOGGLE
    // ============================================================
    window.setUnit = function(unit) {
        if (unit === currentUnit) return;

        // Convert current values
        if (unit === 'cm') {
            selectedWidth = Math.round(selectedWidth * CM_PER_INCH);
            selectedHeight = Math.round(selectedHeight * CM_PER_INCH);
        } else {
            selectedWidth = Math.round(selectedWidth / CM_PER_INCH);
            selectedHeight = Math.round(selectedHeight / CM_PER_INCH);
        }

        currentUnit = unit;

        // Update UI
        document.querySelectorAll('.unit-toggle button').forEach(b => {
            b.classList.toggle('active', b.dataset.unit === unit);
        });

        document.getElementById('widthUnitBadge').textContent = unit === 'in' ? 'in' : 'cm';
        document.getElementById('heightUnitBadge').textContent = unit === 'in' ? 'in' : 'cm';

        // Repopulate dropdowns
        populateDimensionDropdowns();

        // Set values (clamp to range)
        const min = MIN_DIM[unit], max = MAX_DIM[unit];
        selectedWidth = Math.max(min, Math.min(max, selectedWidth));
        selectedHeight = Math.max(min, Math.min(max, selectedHeight));

        // Snap to nearest option
        const step = unit === 'in' ? 1 : 5;
        selectedWidth = Math.round(selectedWidth / step) * step;
        selectedHeight = Math.round(selectedHeight / step) * step;

        document.getElementById('widthSelect').value = selectedWidth;
        document.getElementById('heightSelect').value = selectedHeight;

        calculatePrice();
    };

    // ============================================================
    // QUANTITY CONTROLS
    // ============================================================
    window.changeQty = function(delta) {
        const input = document.getElementById('qtyInput');
        let val = parseInt(input.value) || 1;
        val = Math.max(1, Math.min(999, val + delta));
        input.value = val;
        selectedQty = val;
        calculatePrice();
    };

    // ============================================================
    // PRICE CALCULATION (CORE)
    // ============================================================
    window.calculatePrice = function() {
        if (!currentProduct) return;

        // Read values
        selectedWidth = parseFloat(document.getElementById('widthSelect').value) || 36;
        selectedHeight = parseFloat(document.getElementById('heightSelect').value) || 48;
        selectedQty = parseInt(document.getElementById('qtyInput').value) || 1;
        selectedQty = Math.max(1, Math.min(999, selectedQty));

        // Convert to inches if in cm
        let wIn = currentUnit === 'in' ? selectedWidth : selectedWidth / CM_PER_INCH;
        let hIn = currentUnit === 'in' ? selectedHeight : selectedHeight / CM_PER_INCH;

        // Area per unit (sq.ft)
        // 1 sq.ft = 144 sq.inches
        const perUnitSqft = (wIn * hIn) / 144;

        // Total area
        const totalSqft = perUnitSqft * selectedQty;

        // Rate
        const rate = parseFloat(currentProduct.displayPrice) || 0;

        // Total price
        const totalPrice = totalSqft * rate;

        // ===== UPDATE UI =====
        // Sq.ft per unit
        document.getElementById('sqftValue').textContent = perUnitSqft.toFixed(2);

        // Breakdown
        document.getElementById('breakdownPerUnit').textContent = perUnitSqft.toFixed(2) + ' sq.ft';
        document.getElementById('breakdownQty').textContent = '× ' + selectedQty;
        document.getElementById('breakdownTotalSqft').textContent = totalSqft.toFixed(2) + ' sq.ft';
                document.getElementById('breakdownRate').textContent = '₹' + rate.toFixed(2);

        // Total
        document.getElementById('breakdownTotal').textContent = '₹' + Math.round(totalPrice).toLocaleString('en-IN');
        document.getElementById('totalBarValue').textContent = '₹' + Math.round(totalPrice).toLocaleString('en-IN');

        // Store for cart
        currentProduct._calc = {
            width: selectedWidth,
            height: selectedHeight,
            unit: currentUnit,
            qty: selectedQty,
            perUnitSqft: perUnitSqft,
            totalSqft: totalSqft,
            rate: rate,
            totalPrice: totalPrice
        };
    };

    // ============================================================
    // BUY / CART ACTIONS
    // ============================================================
    function renderBuyActions(product) {
        const container = document.getElementById('buyActions');
        const isOnline = product.onlinePurchase !== false;

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
                <button class="btn btn-add-cart" style="grid-column:1/-1;border-color:#f59e0b;color:#d97706;" onclick="bookAppointment()">
                    <i class="fas fa-calendar-check"></i> Book Appointment
                </button>
            `;
        }
    }

    // ============================================================
    // ADD TO CART
    // ============================================================
    window.addToCart = function() {
        if (!currentProduct || !currentProduct._calc) return;

        const calc = currentProduct._calc;
        const item = {
            id: 'CART-' + Date.now(),
            productId: currentProduct.id,
            productName: currentProduct.name,
            image: currentProduct.images ? currentProduct.images[0] : '',
            colour: currentColour,
            type: currentType,
            width: calc.width,
            height: calc.height,
            unit: calc.unit,
            qty: calc.qty,
            perUnitSqft: calc.perUnitSqft,
            totalSqft: calc.totalSqft,
            rate: calc.rate,
            totalPrice: calc.totalPrice,
            addedAt: new Date().toISOString()
        };

        // Load existing cart
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('raj_cart') || '[]');
        } catch (e) { cart = []; }

        cart.push(item);
        localStorage.setItem('raj_cart', JSON.stringify(cart));

        // Update badge
        updateCartBadge();

        // Show success toast
        showCartToast(`✅ Added to cart · ${cart.length} item${cart.length > 1 ? 's' : ''}`);
    };

    // ============================================================
    // BUY NOW
    // ============================================================
    window.buyNow = function() {
        if (!currentProduct || !currentProduct._calc) return;

        // Add to cart first
        addToCart();

        // Redirect to cart/checkout
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 600);
    };

    // ============================================================
    // BOOK APPOINTMENT (for offline products)
    // ============================================================
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
    // CART BADGE
    // ============================================================
    function updateCartBadge() {
        try {
            const cart = JSON.parse(localStorage.getItem('raj_cart') || '[]');
            // If header has a cart icon, update the badge here
            const cartBadges = document.querySelectorAll('[data-cart-count]');
            cartBadges.forEach(el => {
                el.textContent = cart.length;
                el.style.display = cart.length > 0 ? 'flex' : 'none';
            });
        } catch (e) {}
    }

    // ============================================================
    // CART TOAST
    // ============================================================
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
    // GALLERY NAV
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

    // ============================================================
    // COLOUR / TYPE SELECT
    // ============================================================
    window.selectColour = function(el, colour) {
        document.querySelectorAll('.colour-options .colour-item').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        currentColour = colour;
        document.getElementById('selectedColour').textContent = colour;
    };

    window.selectType = function(el, type) {
        document.querySelectorAll('.type-options .type').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        currentType = type;
        document.getElementById('selectedType').textContent = type;
    };

    // ============================================================
    // FAQ
    // ============================================================
    window.toggleFaq = function(el) {
        const item = el.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-list .faq-item').forEach(f => f.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    };

    // ============================================================
    // RELATED
    // ============================================================
    function renderRelated(product) {
        const container = document.getElementById('relatedGrid');
        const relatedIds = product.related || [];
        const relatedProducts = relatedIds.map(id => PRODUCT_DB[id]).filter(p => p);

        if (!relatedProducts.length) {
            container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--muted-text);font-size:13px;">No related products available.</div>`;
            return;
        }

        container.innerHTML = relatedProducts.map(p => {
            const imgSrc = (p.images && p.images[0]) || 'images/placeholder.jpg';
            return `
                <a href="product-detail.html?id=${p.id}" class="related-card">
                    <div class="img-wrap">
                        <img src="${imgSrc}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" />
                    </div>
                    <div class="name">${p.name}</div>
                    <div class="price">₹${p.displayPrice}</div>
                </a>
            `;
        }).join('');
    }

    // ============================================================
    // SEO
    // ============================================================
    function updateSEO(product) {
        document.title = `${product.name} – Raj Marketing Mysore`;
        const m = document.getElementById('metaDescription');
        if (m) m.content = `${product.name}. ${product.description}`;
        const c = document.getElementById('canonicalUrl');
        if (c) c.href = `https://rajmarketingmysore.info/product-detail.html?id=${product.id}`;
    }

    function updateSchema(product) {
        const existing = document.getElementById('productSchema');
        if (existing) existing.remove();

        const script = document.createElement('script');
        script.id = 'productSchema';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images ? product.images.map(i => `https://rajmarketingmysore.info/${i}`) : [],
            sku: product.id,
            brand: { '@type': 'Brand', name: 'Raj Marketing Mysore' },
            offers: {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: product.displayPrice,
                availability: 'https://schema.org/InStock',
                url: `https://rajmarketingmysore.info/product-detail.html?id=${product.id}`
            }
        });
        document.head.appendChild(script);
    }

    // ============================================================
    // EVENT LISTENERS
    // ============================================================
    function setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                document.getElementById(`tab-${tabId}`)?.classList.add('active');
            });
        });

        document.getElementById('galleryPrev')?.addEventListener('click', () => changeSlide(-1));
        document.getElementById('galleryNext')?.addEventListener('click', () => changeSlide(1));

        // Touch/swipe gallery
        const galleryMain = document.getElementById('galleryMain');
        if (galleryMain) {
            let startX = 0, dragging = false;
            galleryMain.addEventListener('touchstart', e => {
                startX = e.touches[0].clientX;
                dragging = true;
            }, { passive: true });
            galleryMain.addEventListener('touchend', e => {
                if (!dragging) return;
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
                dragging = false;
            }, { passive: true });
        }

        // Update cart badge on load
        updateCartBadge();
    }

    // ============================================================
    // BOOT
    // ============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('%c✅ Product Detail Engine v4.0 loaded', 'color:#1a56db;font-weight:bold;');
    console.log('%c📐 Measurement calculator active', 'color:#10b981;font-weight:bold;');

})();
