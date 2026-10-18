/* ============================================================
   MAIN JAVASCRIPT — Raj Marketing Mysore
   Handles: slider sync, product loading, search, FAQ, fallbacks
============================================================ */

(function () {
    'use strict';

    // ============================================================
    // BUSINESS INFO
    // ============================================================
    const BUSINESS_INFO = {
        name: 'Raj Marketing Mysore',
        phone: '9483037385',
        whatsapp: '919483037385',
        email: 'info@rajmarketingmysore.info',
        address: '#45, Devraj Urs Road, Mysore – 570001',
        city: 'Mysore',
        pincode: '570001',
        mapsUrl: 'https://maps.google.com',
        website: 'https://rajmarketingmysore.info',
        businessHours: 'Mon–Sat: 9:30 AM – 6:30 PM | Sun: Closed',
        gstin: '29GKYPM6953C1ZA'
    };

    // ============================================================
    // PRODUCT CATALOG — FULL 21 items (matches products.html)
    // ============================================================
    const PRODUCTS = [
        // Velcro
        { id: 'velcro-economic', name: 'Velcro System – Economic', category: 'Velcro', price: '₹65', image: 'images/velcro-economic.jpg' },
        { id: 'velcro-premium', name: 'Velcro System – Premium', category: 'Velcro', price: '₹80', image: 'images/velcro-premium.jpg' },
        // Aluminium
        { id: 'aluminium-black-ss', name: 'Aluminium Frame – Black SS', category: 'Aluminium', price: '₹200', image: 'images/aluminium-black-ss.jpg' },
        { id: 'aluminium-bright-ss', name: 'Aluminium Frame – Bright SS', category: 'Aluminium', price: '₹220', image: 'images/aluminium-bright-ss.jpg' },
        { id: 'aluminium-teakwood', name: 'Premium Teakwood', category: 'Premium', price: '₹300', image: 'images/aluminium-teakwood.jpg' },
        // Pleated
        { id: 'pleated-gold', name: 'Pleated Mesh – Gold', category: 'Pleated', price: '₹380', image: 'images/pleated-gold.jpg' },
        { id: 'pleated-platinum', name: 'Pleated SS – Platinum', category: 'Pleated', price: '₹500', image: 'images/pleated-platinum.jpg' },
        { id: 'pleated-diamond', name: 'Pleated SS – Diamond', category: 'Pleated', price: '₹560', image: 'images/pleated-diamond.jpg' },
        { id: 'honeycomb-gold', name: 'Honeycomb Gold', category: 'Pleated', price: '₹520', image: 'images/honeycomb-gold.jpg' },
        // Sliding
        { id: 'single-sliding-economic', name: 'Single Sliding Economic', category: 'Sliding', price: '₹400', image: 'images/single-sliding.jpg' },
        { id: 'double-sliding-economic', name: 'Double Sliding Economic', category: 'Sliding', price: '₹450', image: 'images/double-sliding.jpg' },
        // Security
        { id: 'security-screen-single-door', name: 'Security Screen – Single', category: 'Security', price: '₹990', image: 'images/security-screen-single.jpg' },
        { id: 'security-screen-double-door', name: 'Security Screen – Double', category: 'Security', price: '₹1,150', image: 'images/security-screen-double.jpg' },
        // Mesh
        { id: 'ss-black-mesh-0.18mm', name: 'SS Black Mesh 0.18mm', category: 'Mesh', price: '₹36', image: 'images/ss-black-mesh.jpg' },
        { id: 'ss-black-mesh', name: 'SS Black Mesh', category: 'Mesh', price: '₹38', image: 'images/ss-black-mesh-standard.jpg' },
        { id: 'ss-black-mesh-3ft', name: 'SS Black Mesh 3 ft', category: 'Mesh', price: '₹42', image: 'images/ss-black-mesh-3ft.jpg' },
        { id: 'ss-bright-mesh-0.24mm-4ft', name: 'SS Bright Mesh 0.24mm', category: 'Mesh', price: '₹48', image: 'images/ss-bright-mesh.jpg' },
        { id: 'ss-black-304g-0.5mm', name: 'SS Black 304G 0.5mm', category: 'Mesh', price: '₹550', image: 'images/ss-black-304g.jpg' },
        { id: 'fiber-touflex-mesh', name: 'Fiber/Touflex Mesh', category: 'Mesh', price: '₹8', image: 'images/fiber-mesh.jpg' },
        // Door
        { id: 'mesh-door-black', name: 'Mesh Door – Black SS', category: 'Door', price: '₹350', image: 'images/mesh-door-black.jpg' },
        { id: 'mesh-door-bright', name: 'Mesh Door – Bright SS', category: 'Door', price: '₹380', image: 'images/mesh-door-bright.jpg' }
    ];

    // Expose globally for other scripts
    window.RM_PRODUCTS = PRODUCTS;
    window.RM_BUSINESS = BUSINESS_INFO;

    // ============================================================
    // SLIDER — sync dots with CSS animation
    // (CSS keyframes `sliderAnimation` handle the visual animation)
    // (JS just syncs the active dot every 3 seconds = 30s / 10 slides)
    // ============================================================
    function initSlider() {
        const track = document.getElementById('sliderTrack');
        const dotContainer = document.getElementById('sliderDots');
        if (!track || !dotContainer) return;

        // If slider is already populated (from index.html), just build dots
        const existingSlides = track.querySelectorAll('.slider-slide');
        const slideCount = existingSlides.length || 10;

        // Build dots only if empty
        if (!dotContainer.children.length) {
            dotContainer.innerHTML = Array.from({ length: slideCount }, (_, i) =>
                `<button class="dot${i === 0 ? ' active' : ''}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
            ).join('');
        }

        const dots = dotContainer.querySelectorAll('.dot');
        let current = 0;
        const DURATION = 3000; // 30 seconds / 10 slides

        // Sync dots with CSS animation
        setInterval(() => {
            current = (current + 1) % slideCount;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }, DURATION);

        // Manual click
        dots.forEach(dot => {
            dot.addEventListener('click', function () {
                const idx = parseInt(this.getAttribute('data-slide'), 10);
                // CSS animation is running — we can't easily control it.
                // Best approach: restart the animation by cloning the track.
                // For now, just sync the dot visually.
                current = idx;
                dots.forEach((d, i) => d.classList.toggle('active', i === current));
            });
        });
    }

    // ============================================================
    // PRODUCTS — Load "Popular Products" scroll on home page
    // ============================================================
    function loadProducts() {
        const scroll = document.getElementById('productScroll');
        if (!scroll) return;

        // Show 8 featured products (curated selection)
        const featuredIds = [
            'velcro-economic', 'pleated-gold', 'aluminium-black-ss',
            'mesh-door-black', 'single-sliding-economic', 'pleated-platinum',
            'security-screen-single-door', 'ss-black-mesh'
        ];

        const featured = featuredIds
            .map(id => PRODUCTS.find(p => p.id === id))
            .filter(Boolean);

        scroll.innerHTML = featured.map(p => `
            <a href="product-detail.html?id=${p.id}" class="product-card" role="listitem">
                <div class="img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-box\\'></i>'"></div>
                <div class="name">${p.name}</div>
                <div class="price">${p.price}</div>
                <span class="view-btn">View Details</span>
            </a>
        `).join('');
    }

    // ============================================================
    // SEARCH
    // ============================================================
    function handleSearch(query) {
        const container = document.getElementById('searchResults');
        if (!container) return;

        if (!query || query.length < 1) {
            container.classList.remove('active');
            container.innerHTML = '';
            return;
        }

        const term = query.toLowerCase().trim();
        const results = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.price.toLowerCase().includes(term)
        );

        if (results.length === 0) {
            container.innerHTML = `<div style="padding:16px;text-align:center;color:var(--muted-text);font-size:13px;">
                <i class="fas fa-search" style="display:block;font-size:24px;margin-bottom:4px;"></i>
                No products found for "<strong>${query}</strong>"
            </div>`;
        } else {
            container.innerHTML = results.map(p => `
                <a href="product-detail.html?id=${p.id}" class="result-item" role="option">
                    <span class="icon"><i class="fas fa-box"></i></span>
                    <div class="info">
                        <div class="name">${p.name}</div>
                        <div class="category">${p.category} · ${p.price}</div>
                    </div>
                </a>
            `).join('');
        }
        container.classList.add('active');
    }
    window.handleSearch = handleSearch;

    // ============================================================
    // FAQ TOGGLE — Only if not already handled inline
    // (index.html has inline onclick="toggleFaq(this)" — this is the handler)
    // ============================================================
    if (!window.toggleFaq) {
        window.toggleFaq = function (el) {
            const answer = el.nextElementSibling;
            if (!answer) return;
            const isOpen = answer.classList.contains('open');

            document.querySelectorAll('.faq-item .a').forEach(a => a.classList.remove('open'));
            document.querySelectorAll('.faq-item .q').forEach(q => {
                q.classList.remove('open');
                q.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                answer.classList.add('open');
                el.classList.add('open');
                el.setAttribute('aria-expanded', 'true');
            }
        };
    }

    // ============================================================
    // IMAGE FALLBACKS
    // ============================================================
    function initImageFallbacks() {
        document.querySelectorAll('.category-card .img img').forEach(img => {
            img.onerror = function () {
                const parent = this.parentElement;
                const alt = this.alt || 'Category';
                let icon = 'fa-image';
                const l = alt.toLowerCase();
                if (l.includes('velcro')) icon = 'fa-link';
                else if (l.includes('aluminium')) icon = 'fa-border-all';
                else if (l.includes('sliding')) icon = 'fa-arrows-alt-h';
                else if (l.includes('pleated')) icon = 'fa-wind';
                else if (l.includes('openable')) icon = 'fa-door-open';
                else if (l.includes('ss') || l.includes('steel')) icon = 'fa-circle';
                else if (l.includes('fibre')) icon = 'fa-circle-notch';
                else if (l.includes('all')) icon = 'fa-th-large';
                parent.innerHTML = `<div class="img-fallback"><i class="fas ${icon}"></i><span class="fallback-label">${alt}</span></div>`;
            };
        });

        document.querySelectorAll('.product-card .img img, .featured-card .img-wrap img').forEach(img => {
            img.onerror = function () {
                const parent = this.parentElement;
                parent.innerHTML = `<div class="img-fallback"><i class="fas fa-box"></i><span class="fallback-label">${this.alt || 'Product'}</span></div>`;
            };
        });

        document.querySelectorAll('.gallery-grid .item img').forEach(img => {
            img.onerror = function () {
                const parent = this.parentElement;
                parent.innerHTML = `<div class="img-fallback"><i class="fas fa-image"></i><span class="fallback-label">${this.alt || 'Gallery'}</span></div>`;
            };
        });
    }

    // ============================================================
    // CLOSE SEARCH ON OUTSIDE CLICK
    // ============================================================
    function initSearchClose() {
        document.addEventListener('click', function (e) {
            const bar = document.querySelector('.search-bar');
            const results = document.getElementById('searchResults');
            if (bar && results && !bar.contains(e.target) && !results.contains(e.target)) {
                results.classList.remove('active');
            }
        });
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
        initSlider();
        loadProducts();
        initImageFallbacks();
        initSearchClose();
        console.log('✅ Raj Marketing main.js loaded ·', PRODUCTS.length, 'products');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
