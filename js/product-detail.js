/* ============================================================
   product-detail.js — Robust version (no ES modules required)
   Works even if Firebase fails. Falls back to static data.
============================================================ */

(function () {
    'use strict';

    console.log('🟢 product-detail.js loaded');

    // ============================================================
    // STATIC FALLBACK DATA (must match products.html IDs)
    // ============================================================
    var STATIC_PRODUCTS = {
        'velcro-economic': {
            name: 'Velcro System – Economic',
            category: 'Velcro',
            variant: 'Economic',
            price: 65,
            unit: 'sq.ft',
            description: 'Economical velcro-based mosquito net. Ideal for windows and small openings.',
            longDescription: 'The Economic Velcro System offers a budget-friendly solution for mosquito protection. The net attaches with high-quality velcro tape and can be easily removed for cleaning. Suitable for standard residential windows.',
            images: ['images/velcro-economic.jpg'],
            colours: ['Ivory', 'White', 'Black'],
            types: ['Single', 'Double'],
            benefits: ['Economical pricing', 'Easy to install & remove', 'Washable net', 'Custom sizes available'],
            applications: ['Windows', 'Ventilators', 'Balcony openings'],
            onlinePurchase: true,
            specs: { 'Product Type': 'Velcro Mosquito Net', 'Mesh': 'Fiberglass', 'Attachment': 'Velcro Tape', 'Custom Size': 'Yes', 'Warranty': '1 Year' },
            faqs: [
                { q: 'Can I install it myself?', a: 'Yes, velcro nets are DIY-friendly. We provide tape and instructions.' },
                { q: 'Is the net washable?', a: 'Yes, the mesh can be removed and washed gently.' }
            ]
        },
        'velcro-premium': {
            name: 'Velcro System – Premium Saint-Gobain',
            category: 'Velcro', variant: 'Premium Saint-Gobain', price: 80, unit: 'sq.ft',
            description: 'Premium velcro net with Saint-Gobain mesh for superior durability.',
            images: ['images/velcro-premium.jpg'],
            colours: ['Ivory', 'White'], types: ['Single', 'Double'],
            onlinePurchase: true
        },
        'aluminium-black-ss': {
            name: 'Aluminium Frame – Black Coated SS Mesh',
            category: 'Aluminium', variant: 'Regular + Black Coated SS', price: 200, unit: 'sq.ft',
            description: 'Aluminium frame with black coated SS mesh. Durable and rust-resistant.',
            images: ['images/aluminium-black-ss.jpg'],
            colours: ['Black', 'Ivory'], types: ['Single', 'Double', 'Sliding'],
            onlinePurchase: false
        },
        'aluminium-bright-ss': {
            name: 'Aluminium Frame – Bright SS 304 Mesh',
            category: 'Aluminium', variant: 'Regular + Bright SS 304', price: 220, unit: 'sq.ft',
            description: 'Aluminium frame with bright SS 304 mesh.',
            images: ['images/aluminium-bright-ss.jpg'],
            colours: ['Silver', 'Ivory'], types: ['Single', 'Double'],
            onlinePurchase: false
        },
        'aluminium-teakwood': {
            name: 'Premium Teakwood – Black Coated SS Mesh',
            category: 'Premium', variant: 'Teakwood + Black Coated SS', price: 300, unit: 'sq.ft',
            description: 'Premium teakwood finish with black SS mesh.',
            images: ['images/aluminium-teakwood.jpg'],
            colours: ['Teakwood'], types: ['Single', 'Double'],
            onlinePurchase: false
        },
        'pleated-gold': {
            name: 'Pleated Mesh – Gold Detachable',
            category: 'Pleated', variant: '32mm Single', price: 380, originalPrice: 420, discount: 10,
            unit: 'sq.ft', description: 'Pleated mesh with gold finish. Detachable for cleaning.',
            images: ['images/pleated-gold.jpg'],
            colours: ['Gold', 'Ivory'], types: ['Single'],
            onlinePurchase: false
        },
        'pleated-platinum': {
            name: 'Pleated SS Mesh – Platinum Detachable',
            category: 'Pleated', variant: '25mm Single', price: 500, unit: 'sq.ft',
            description: 'Pleated SS mesh with platinum finish.',
            images: ['images/pleated-platinum.jpg'],
            colours: ['Platinum'], types: ['Single'],
            onlinePurchase: false
        },
        'pleated-diamond': {
            name: 'Pleated SS Mesh – Diamond Detachable',
            category: 'Pleated', variant: '32mm Single', price: 560, unit: 'sq.ft',
            description: 'Pleated SS mesh with diamond finish.',
            images: ['images/pleated-diamond.jpg'],
            colours: ['Diamond'], types: ['Single'],
            onlinePurchase: false
        },
        'honeycomb-gold': {
            name: 'Pleated Honeycomb Gold – Detachable',
            category: 'Pleated', variant: '32mm Single', price: 520, unit: 'sq.ft',
            description: 'Honeycomb pleated net.',
            images: ['images/honeycomb-gold.jpg'],
            colours: ['Gold'], types: ['Single'],
            onlinePurchase: false
        },
        'single-sliding-economic': {
            name: 'Single Sliding Economic',
            category: 'Sliding', variant: 'Single Sliding', price: 400, unit: 'sq.ft',
            description: 'Single sliding mosquito net.',
            images: ['images/single-sliding.jpg'],
            colours: ['Ivory', 'Black'], types: ['Single'],
            onlinePurchase: false
        },
        'double-sliding-economic': {
            name: 'Double Sliding Economic',
            category: 'Sliding', variant: 'Double Sliding', price: 450, unit: 'sq.ft',
            description: 'Double sliding mosquito net.',
            images: ['images/double-sliding.jpg'],
            colours: ['Ivory', 'Black'], types: ['Double'],
            onlinePurchase: false
        },
        'security-screen-single-door': {
            name: 'Security Screen – Single Door',
            category: 'Security', variant: 'Single Door + GST', price: 990, unit: 'sq.ft',
            description: 'Security screen for single door.',
            images: ['images/security-screen-single.jpg'],
            colours: ['Black'], types: ['Single'],
            onlinePurchase: false
        },
        'security-screen-double-door': {
            name: 'Security Screen – Double Door',
            category: 'Security', variant: 'Double Door + GST', price: 1150, unit: 'sq.ft',
            description: 'Security screen for double door.',
            images: ['images/security-screen-double.jpg'],
            colours: ['Black'], types: ['Double'],
            onlinePurchase: false
        },
        'ss-black-mesh-0.18mm': {
            name: 'SS Black Mesh 0.18mm',
            category: 'Mesh', variant: '0.18mm Black', price: 36, unit: 'sq.ft',
            description: 'SS black mesh 0.18mm.',
            images: ['images/ss-black-mesh.jpg'],
            colours: ['Black'], types: ['Roll'],
            onlinePurchase: false
        },
        'ss-black-mesh': {
            name: 'SS Black Mesh',
            category: 'Mesh', variant: 'Black', price: 38, unit: 'sq.ft',
            description: 'SS black mesh.',
            images: ['images/ss-black-mesh-standard.jpg'],
            colours: ['Black'], types: ['Roll'],
            onlinePurchase: false
        },
        'ss-black-mesh-3ft': {
            name: 'SS Black Mesh 3 ft',
            category: 'Mesh', variant: '3 ft Black', price: 42, unit: 'sq.ft',
            description: 'SS black mesh 3 ft.',
            images: ['images/ss-black-mesh-3ft.jpg'],
            colours: ['Black'], types: ['Roll'],
            onlinePurchase: false
        },
        'ss-bright-mesh-0.24mm-4ft': {
            name: 'SS Bright Mesh 0.24mm, 4 ft',
            category: 'Mesh', variant: '0.24mm Bright 4ft', price: 48, unit: 'sq.ft',
            description: 'SS bright mesh 0.24mm.',
            images: ['images/ss-bright-mesh.jpg'],
            colours: ['Bright'], types: ['Roll'],
            onlinePurchase: false
        },
        'ss-black-304g-0.5mm': {
            name: 'SS Black 304G 0.5mm',
            category: 'Mesh', variant: '304G 0.5mm', price: 550, unit: 'sq.ft',
            description: 'SS black 304G 0.5mm.',
            images: ['images/ss-black-304g.jpg'],
            colours: ['Black'], types: ['Roll'],
            onlinePurchase: false
        },
        'fiber-touflex-mesh': {
            name: 'Fiber/Touflex Mesh',
            category: 'Mesh', variant: 'Fiber Mesh', price: 8, unit: 'sq.ft',
            description: 'Fiber touflex mesh.',
            images: ['images/fiber-mesh.jpg'],
            colours: ['Grey'], types: ['Roll'],
            onlinePurchase: false
        },
        'mesh-door-black': {
            name: 'Mesh Door – Black Coated SS Mesh',
            category: 'Door', variant: 'Regular + Black Coated SS', price: 350, unit: 'sq.ft',
            description: 'Mesh door with black SS.',
            images: ['images/mesh-door-black.jpg'],
            colours: ['Black'], types: ['Single', 'Double'],
            onlinePurchase: false
        },
        'mesh-door-bright': {
            name: 'Mesh Door – Bright SS 304 Mesh',
            category: 'Door', variant: 'Regular + Bright SS 304', price: 380, unit: 'sq.ft',
            description: 'Mesh door with bright SS 304.',
            images: ['images/mesh-door-bright.jpg'],
            colours: ['Bright'], types: ['Single', 'Double'],
            onlinePurchase: false
        }
    };

    // ============================================================
    // STATE
    // ============================================================
    var currentProduct = null;
    var currentUnit = 'in';
    var selectedColour = null;
    var selectedType = null;
    var currentSlide = 0;
    var unitRate = 0;
    var WIDTH_OPTIONS = [12,18,24,30,36,42,48,54,60,66,72,78,84,90,96,102,108,114,120];

    // ============================================================
    // HELPERS
    // ============================================================
    function qs(id) { return document.getElementById(id); }
    function toCm(i) { return Math.round(i * 2.54); }
    function fromCm(c) { return Math.round(c / 2.54); }
    function formatINR(n) { return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }); }

    // ============================================================
    // BOOT
    // ============================================================
    function boot() {
        try {
            var params = new URLSearchParams(window.location.search);
            var productId = params.get('id');
            console.log('🔎 Product ID:', productId);

            if (!productId) {
                showError('No product ID provided in URL.');
                return;
            }

            // Load from Firebase if available, else static
            loadProduct(productId);
        } catch (e) {
            console.error('❌ Boot error:', e);
            showError(e.message);
        }
    }

    function loadProduct(productId) {
        // Try Firebase first
        if (window.__firebaseDB && window.__firebaseDoc && window.__firebaseGetDoc) {
            var db = window.__firebaseDB;
            var doc = window.__firebaseDoc;
            var getDoc = window.__firebaseGetDoc;

            getDoc(doc(db, 'products', productId))
                .then(function (snap) {
                    if (snap.exists()) {
                        var data = snap.data();
                        data.id = snap.id;
                        console.log('✅ Firebase product loaded');
                        finishLoad(data);
                    } else {
                        console.warn('⚠️ Not in Firebase, using static');
                        finishLoad(STATIC_PRODUCTS[productId]);
                    }
                })
                .catch(function (err) {
                    console.warn('⚠️ Firebase error, using static:', err.message);
                    finishLoad(STATIC_PRODUCTS[productId]);
                });
        } else {
            // No Firebase — use static
            console.log('ℹ️ Firebase not available, using static data');
            finishLoad(STATIC_PRODUCTS[productId]);
        }
    }

    function finishLoad(product) {
        if (!product) {
            showError('Product not found: ' + (new URLSearchParams(location.search).get('id')));
            return;
        }
        currentProduct = product;
        try {
            renderProduct(product);
            qs('loadingState').style.display = 'none';
            qs('productContainer').style.display = 'block';
            console.log('✅ Product rendered successfully');
        } catch (e) {
            console.error('❌ Render error:', e);
            showError('Render error: ' + e.message);
        }
    }

    function showError(msg) {
        var ls = qs('loadingState');
        if (ls) ls.style.display = 'none';
        var es = qs('errorState');
        if (es) {
            es.style.display = 'block';
            var p = es.querySelector('p');
            if (p) p.textContent = msg;
        }
        console.error('❌', msg);
    }

    // ============================================================
    // RENDER
    // ============================================================
    function renderProduct(p) {
        document.title = p.name + ' – Raj Marketing Mysore';

        var md = document.querySelector('meta[name="description"]');
        if (md) md.content = p.description || ('Buy ' + p.name + ' in Mysore.');

        setText('productTitle', p.name);
        setText('productVariant', p.variant || '');
        setText('breadcrumbCategory', p.category || 'Category');
        setText('breadcrumbProduct', p.name);
        setText('productDescription', p.description || '');

        unitRate = Number(p.price) || 0;
        setText('currentPrice', formatINR(unitRate));
        setText('priceUnit', '/ ' + (p.unit || 'sq.ft'));

        if (p.originalPrice) {
            var op = qs('originalPrice');
            if (op) { op.textContent = formatINR(p.originalPrice); op.style.display = 'inline'; }
        }
        if (p.discount) {
            var dt = qs('discountTag');
            if (dt) { dt.textContent = p.discount + '% OFF'; dt.style.display = 'inline'; }
        }

        // Gallery
        var images = (p.images && p.images.length) ? p.images : ['images/placeholder.jpg'];
        buildGallery(images);
        setText('galleryBadge', p.category || 'Product');

        // Colours
        var colours = (p.colours && p.colours.length) ? p.colours : ['Ivory'];
        selectedColour = colours[0];
        setText('selectedColour', selectedColour);
        var co = qs('colourOptions');
        if (co) {
            co.innerHTML = colours.map(function (c, i) {
                var cls = 'colour-' + c.toLowerCase().replace(/\s+/g, '-');
                return '<span class="colour ' + cls + (i === 0 ? ' active' : '') + '" data-colour="' + c + '" title="' + c + '"></span>';
            }).join('');
            co.querySelectorAll('.colour').forEach(function (el) {
                el.addEventListener('click', function () {
                    co.querySelectorAll('.colour').forEach(function (x) { x.classList.remove('active'); });
                    el.classList.add('active');
                    selectedColour = el.dataset.colour;
                    setText('selectedColour', selectedColour);
                });
            });
        }

        // Types
        var types = (p.types && p.types.length) ? p.types : ['Single'];
        selectedType = types[0];
        setText('selectedType', selectedType);
        var to = qs('typeOptions');
        if (to) {
            to.innerHTML = types.map(function (t, i) {
                return '<span class="type' + (i === 0 ? ' active' : '') + '" data-type="' + t + '">' + t + '</span>';
            }).join('');
            to.querySelectorAll('.type').forEach(function (el) {
                el.addEventListener('click', function () {
                    to.querySelectorAll('.type').forEach(function (x) { x.classList.remove('active'); });
                    el.classList.add('active');
                    selectedType = el.dataset.type;
                    setText('selectedType', selectedType);
                });
            });
        }

        populateDimensionSelects();
        buildBuyActions(p);
        buildTabs(p);
        buildRelated(p);
        calculatePrice();
        bindTabs();
    }

    function setText(id, val) {
        var el = qs(id);
        if (el) el.textContent = val;
    }

    // ============================================================
    // GALLERY
    // ============================================================
    function buildGallery(images) {
        var track = qs('galleryTrack');
        var dots = qs('galleryDots');
        var thumbs = qs('galleryThumbs');
        var counter = qs('galleryCounter');
        if (!track) return;

        track.innerHTML = images.map(function (src) {
            return '<div class="gallery-slide"><img src="' + src + '" alt="" loading="lazy" onerror="this.src=\'images/placeholder.jpg\'"></div>';
        }).join('');

        if (dots) dots.innerHTML = images.map(function (_, i) {
            return '<button class="dot' + (i === 0 ? ' active' : '') + '" data-i="' + i + '"></button>';
        }).join('');

        if (thumbs) thumbs.innerHTML = images.map(function (src, i) {
            return '<div class="thumb' + (i === 0 ? ' active' : '') + '" data-i="' + i + '"><img src="' + src + '" alt="" onerror="this.src=\'images/placeholder.jpg\'"></div>';
        }).join('');

        function goTo(i) {
            currentSlide = (i + images.length) % images.length;
            track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
            if (dots) dots.querySelectorAll('.dot').forEach(function (d, idx) {
                d.classList.toggle('active', idx === currentSlide);
            });
            if (thumbs) thumbs.querySelectorAll('.thumb').forEach(function (t, idx) {
                t.classList.toggle('active', idx === currentSlide);
            });
            if (counter) counter.textContent = (currentSlide + 1) + ' / ' + images.length;
        }

        var prev = qs('galleryPrev'), next = qs('galleryNext');
        if (prev) prev.onclick = function () { goTo(currentSlide - 1); };
        if (next) next.onclick = function () { goTo(currentSlide + 1); };
        if (dots) dots.querySelectorAll('.dot').forEach(function (d) {
            d.onclick = function () { goTo(+d.dataset.i); };
        });
        if (thumbs) thumbs.querySelectorAll('.thumb').forEach(function (t) {
            t.onclick = function () { goTo(+t.dataset.i); };
        });

        var startX = 0;
        track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) goTo(currentSlide + (dx < 0 ? 1 : -1));
        });
    }

    // ============================================================
    // DIMENSIONS
    // ============================================================
    function populateDimensionSelects() {
        var wSel = qs('widthSelect'), hSel = qs('heightSelect');
        if (!wSel || !hSel) return;

        var opts = WIDTH_OPTIONS.map(function (v) {
            if (currentUnit === 'in') return '<option value="' + v + '">' + v + '"</option>';
            return '<option value="' + toCm(v) + '">' + toCm(v) + ' cm</option>';
        }).join('');

        wSel.innerHTML = opts;
        hSel.innerHTML = opts;
        wSel.value = currentUnit === 'in' ? 36 : toCm(36);
        hSel.value = currentUnit === 'in' ? 48 : toCm(48);
        setText('widthUnitBadge', currentUnit);
        setText('heightUnitBadge', currentUnit);
    }

    window.setUnit = function (unit) {
        currentUnit = unit;
        document.querySelectorAll('.unit-toggle button').forEach(function (b) {
            b.classList.toggle('active', b.dataset.unit === unit);
        });
        populateDimensionSelects();
        calculatePrice();
    };

    // ============================================================
    // CALCULATOR
    // ============================================================
    window.changeQty = function (delta) {
        var input = qs('qtyInput');
        if (!input) return;
        var v = parseInt(input.value, 10) || 1;
        v = Math.max(1, Math.min(999, v + delta));
        input.value = v;
        calculatePrice();
    };

    window.calculatePrice = function () {
        if (!currentProduct) return;
        var wRaw = parseFloat(qs('widthSelect').value) || 0;
        var hRaw = parseFloat(qs('heightSelect').value) || 0;
        var qty = Math.max(1, parseInt(qs('qtyInput').value, 10) || 1);

        var wIn = currentUnit === 'cm' ? fromCm(wRaw) : wRaw;
        var hIn = currentUnit === 'cm' ? fromCm(hRaw) : hRaw;

        var perUnitSqFt = (wIn * hIn) / 144;
        var totalSqFt = perUnitSqFt * qty;
        var total = totalSqFt * unitRate;

        setText('sqftValue', perUnitSqFt.toFixed(2));
        setText('breakdownPerUnit', perUnitSqFt.toFixed(2) + ' sq.ft');
        setText('breakdownQty', '× ' + qty);
        setText('breakdownTotalSqft', totalSqFt.toFixed(2) + ' sq.ft');
        setText('breakdownRate', formatINR(unitRate));
        setText('breakdownTotal', formatINR(Math.round(total)));
        setText('totalBarValue', formatINR(Math.round(total)));
    };

    // ============================================================
    // BUY ACTIONS
    // ============================================================
    function buildBuyActions(p) {
        var isOnline = p.onlinePurchase !== false;
        var c = qs('buyActions');
        if (!c) return;
        if (isOnline) {
            c.innerHTML =
                '<button class="btn btn-add-cart" onclick="addToCart()"><i class="fas fa-cart-plus"></i> Add to Cart</button>' +
                '<button class="btn btn-buy-now" onclick="buyNow()"><i class="fas fa-bolt"></i> Buy Now</button>';
        } else {
            c.innerHTML =
                '<button class="btn btn-buy-now" style="grid-column:1/-1;" onclick="bookAppointment()"><i class="fas fa-calendar-check"></i> Book Appointment</button>';
        }
    }

    window.addToCart = function () {
        if (!currentProduct) return;
        var total = parseFloat((qs('breakdownTotal').textContent || '0').replace(/[^0-9.]/g, '')) || 0;
        var cart = [];
        try { cart = JSON.parse(localStorage.getItem('rm_cart') || '[]'); } catch (e) {}
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

    window.buyNow = function () {
        window.addToCart();
        window.location.href = 'checkout.html';
    };

    window.bookAppointment = function () {
        window.location.href = 'appointment.html?product=' + encodeURIComponent(currentProduct.name);
    };

    function showToast(msg) {
        var toast = document.querySelector('.cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'cart-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + msg;
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 2500);
    }

    // ============================================================
    // TABS
    // ============================================================
    function buildTabs(p) {
        var dc = qs('descriptionContent');
        if (dc) dc.innerHTML = '<p>' + (p.longDescription || p.description || '') + '</p>';

        var at = qs('appTags');
        var apps = p.applications || ['Windows', 'Doors', 'Balcony'];
        if (at) at.innerHTML = apps.map(function (a) { return '<span class="app-tag">' + a + '</span>'; }).join('');

        var specs = p.specs || {
            'Product Type': p.category || 'Mosquito Net',
            'Mesh': 'Premium Quality',
            'Frame': 'Aluminium',
            'Custom Size': 'Yes',
            'Warranty': 'As applicable'
        };
        var st = qs('specTable');
        if (st) st.innerHTML = Object.keys(specs).map(function (k) {
            return '<tr><td class="spec-label">' + k + '</td><td class="spec-value">' + specs[k] + '</td></tr>';
        }).join('');

        var benefits = p.benefits || ['Mosquito Protection', 'Custom Measurements', 'Durable Materials', 'Easy Maintenance'];
        var bg = qs('benefitsGrid');
        if (bg) bg.innerHTML = benefits.map(function (b) {
            return '<div class="benefit-card"><i class="fas fa-check-circle"></i><span>' + b + '</span></div>';
        }).join('');

        var steps = ['Book Appointment', 'Site Measurement', 'Confirm Order', 'Manufacturing', 'Installation'];
        var ps = qs('processSteps');
        if (ps) ps.innerHTML = steps.map(function (s, i) {
            return '<div class="process-step"><span class="step-num">' + (i + 1) + '</span><span>' + s + '</span></div>';
        }).join('');

        var faqs = p.faqs || [
            { q: 'Can this be customized?', a: 'Yes, custom sizes are available.' },
            { q: 'Is installation included?', a: 'Yes, professional installation is available in Mysore.' },
            { q: 'What is the warranty?', a: 'Warranty as per manufacturer terms.' }
        ];
        var fl = qs('faqList');
        if (fl) {
            fl.innerHTML = faqs.map(function (f, i) {
                return '<div class="faq-item' + (i === 0 ? ' open' : '') + '">' +
                    '<div class="faq-q"><span>' + f.q + '</span><i class="fas fa-chevron-down"></i></div>' +
                    '<div class="faq-a">' + f.a + '</div></div>';
            }).join('');
            fl.querySelectorAll('.faq-q').forEach(function (q) {
                q.addEventListener('click', function () { q.parentElement.classList.toggle('open'); });
            });
        }
    }

    function bindTabs() {
        document.querySelectorAll('.tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
                document.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('active'); });
                btn.classList.add('active');
                var pane = qs('tab-' + btn.dataset.tab);
                if (pane) pane.classList.add('active');
            });
        });
    }

    // ============================================================
    // RELATED
    // ============================================================
    function buildRelated(p) {
        var grid = qs('relatedGrid');
        if (!grid) return;

        var related = Object.keys(STATIC_PRODUCTS)
            .filter(function (id) { return id !== p.id && STATIC_PRODUCTS[id].category === p.category; })
            .slice(0, 4);

        if (!related.length) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:20px;">No related products.</div>';
            return;
        }

        grid.innerHTML = related.map(function (id) {
            var r = STATIC_PRODUCTS[id];
            var img = (r.images && r.images[0]) || 'images/placeholder.jpg';
            return '<a href="product-detail.html?id=' + id + '" class="related-card">' +
                '<div class="related-img"><img src="' + img + '" alt="' + r.name + '" onerror="this.src=\'images/placeholder.jpg\'"></div>' +
                '<div class="related-name">' + r.name + '</div>' +
                '<div class="related-price">' + formatINR(r.price) + '</div></a>';
        }).join('');
    }

    // ============================================================
    // START
    // ============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
```
