/* ============================================================
   MAIN JAVASCRIPT — FIXED
   Raj Marketing Mysore
============================================================ */

(function() {
    'use strict';

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

    const PRODUCTS = [
        { id: 'pleated-economic', name: 'Pleated Economic', category: 'Pleated', price: '₹380-460', image: 'images/pleated-economic.jpg', online: false },
        { id: 'pleated-heavy', name: 'Pleated Heavy', category: 'Pleated', price: '₹450-460', image: 'images/pleated-heavy.jpg', online: false },
        { id: 'pleated-top-heavy', name: 'Pleated Top Heavy', category: 'Pleated', price: '₹510', image: 'images/pleated-top-heavy.jpg', online: false },
        { id: 'ss-pleated-economic', name: 'SS Pleated / SS Economic', category: 'Pleated', price: '₹470', image: 'images/ss-pleated.jpg', online: false },
        { id: 'heavy-detachable-pleated', name: 'Heavy Detachable Pleated', category: 'Pleated', price: '₹460', image: 'images/heavy-detachable-pleated.jpg', online: false },
        { id: 'economic-woodgrain-pleated', name: 'Economic Woodgrain Pleated', category: 'Pleated', price: '₹460', image: 'images/woodgrain-pleated.jpg', online: false },
        { id: 'honeycomb-mesh-double-door', name: 'Honeycomb + Mesh Double Door', category: 'Honeycomb', price: '₹680', image: 'images/honeycomb-double-door.jpg', online: false },
        { id: 'single-sliding-economic', name: 'Single Sliding Economic', category: 'Sliding', price: '₹400', image: 'images/single-sliding.jpg', online: false },
        { id: 'double-sliding-economic', name: 'Double Sliding Economic', category: 'Sliding', price: '₹450', image: 'images/double-sliding.jpg', online: false },
        { id: 'single-door-pleated', name: 'Single Door Pleated', category: 'Pleated', price: '₹900', image: 'images/single-door-pleated.jpg', online: false },
        { id: 'security-screen-single-door', name: 'Security Screen – Single Door', category: 'Security', price: '₹990 + GST', image: 'images/security-screen-single.jpg', online: false },
        { id: 'security-screen-double-door', name: 'Security Screen – Double Door', category: 'Security', price: '₹1,150 + GST', image: 'images/security-screen-double.jpg', online: false },
        { id: 'aluminium-frame-colour-mesh', name: 'Aluminium Frame + Colour Mesh', category: 'Aluminium', price: '₹420', image: 'images/aluminium-colour-mesh.jpg', online: false },
        { id: 'woodgrain-ss-304-mesh', name: 'Woodgrain + SS 304 Mesh', category: 'Aluminium', price: '₹580', image: 'images/woodgrain-ss304.jpg', online: false },
        { id: 'ss-black-mesh-0.18mm', name: 'SS Black Mesh 0.18mm', category: 'Mesh', price: '₹36', image: 'images/ss-black-mesh.jpg', online: false },
        { id: 'ss-black-mesh', name: 'SS Black Mesh', category: 'Mesh', price: '₹38', image: 'images/ss-black-mesh-standard.jpg', online: false },
        { id: 'ss-black-mesh-3ft', name: 'SS Black Mesh 3 ft', category: 'Mesh', price: '₹42', image: 'images/ss-black-mesh-3ft.jpg', online: false },
        { id: 'ss-bright-mesh-0.24mm-4ft', name: 'SS Bright Mesh 0.24mm, 4 ft', category: 'Mesh', price: '₹48', image: 'images/ss-bright-mesh.jpg', online: false },
        { id: 'ss-black-304g-0.5mm', name: 'SS Black 304G 0.5mm', category: 'Mesh', price: '₹550', image: 'images/ss-black-304g.jpg', online: false },
        { id: 'fiber-touflex-mesh', name: 'Fiber/Touflex Mesh', category: 'Mesh', price: '₹8', image: 'images/fiber-mesh.jpg', online: false }
    ];

    window.RM_PRODUCTS = PRODUCTS;
    window.RM_BUSINESS = BUSINESS_INFO;

    // ============================================================
    // SLIDER — SYNCED DOTS (FIXED)
    // ============================================================
    function initSlider() {
        const track = document.getElementById('sliderTrack');
        const dotContainer = document.getElementById('sliderDots');
        if (!track || !dotContainer) return;

        const slideTexts = [
            { main: 'Premium Mosquito Nets', sub: '100% Protection · Quality Guaranteed' },
            { main: 'Custom Window Screens', sub: 'Perfect Fit for Every Window' },
            { main: 'Trusted Since 2016', sub: '500+ Happy Customers' },
            { main: 'Quality You Can Trust', sub: 'Premium materials · Expert craftsmanship' },
            { main: 'Protect Your Family', sub: 'Safe · Reliable · Affordable' },
            { main: 'Why Raj Marketing?', sub: 'Quality · Trust · Excellence' },
            { main: 'Professional Installation', sub: 'Expert team · Hassle-free service' },
            { main: 'Premium Quality Nets', sub: 'Velcro · Aluminium · Pleated · Mesh' },
            { main: 'Dealer Opportunities', sub: 'Join our network · Grow your business' },
            { main: 'New Offers Coming!', sub: 'Stay tuned for exclusive deals' }
        ];

        // Build slides
        track.innerHTML = slideTexts.map((t, i) => `
            <div class="slider-slide">
                <img src="images/slider/slider-${String(i+1).padStart(2,'0')}.jpg"
                     alt="${t.main}"
                     loading="lazy"
                     onerror="this.style.display='none'">
                <div class="overlay"></div>
                <div class="slide-content">
                    <span class="main-text">${t.main}</span>
                    <span class="sub-text">${t.sub}</span>
                </div>
            </div>
        `).join('');

        // Build dots
        dotContainer.innerHTML = slideTexts.map((_, i) =>
            `<button class="dot${i === 0 ? ' active' : ''}" data-slide="${i}" aria-label="Go to slide ${i+1}"></button>`
        ).join('');

        const dots = dotContainer.querySelectorAll('.dot');
        let currentSlide = 0;
        const totalSlides = slideTexts.length;
        const DURATION = 3000; // 30s / 10 slides

        function goToSlide(index) {
            currentSlide = index;
            track.style.animation = 'none';
            track.style.transform = `translateX(-${index * 10}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        }

        // CSS animation runs 30s loop; we sync dots to same timing
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        }, DURATION);

        // Manual dot click
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-slide'), 10);
                goToSlide(idx);
            });
        });
    }

    // ============================================================
    // PRODUCTS
    // ============================================================
    function loadProducts() {
        const scroll = document.getElementById('productScroll');
        if (!scroll) return;
        scroll.innerHTML = PRODUCTS.slice(0, 8).map(p => `
            <a href="product-detail.html?id=${p.id}" class="product-card" role="listitem">
                <div class="img"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
                <div class="name">${p.name}</div>
                <div class="price">${p.price}</div>
                <span class="view-btn">${p.online ? 'Buy Online' : 'View Details'}</span>
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
    // FAQ
    // ============================================================
    function toggleFaq(el) {
        const answer = el.nextElementSibling;
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
    }
    window.toggleFaq = toggleFaq;

    // ============================================================
    // IMAGE FALLBACKS
    // ============================================================
    function initImageFallbacks() {
        document.querySelectorAll('.category-card .img img').forEach(img => {
            img.onerror = function() {
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

        document.querySelectorAll('.product-card .img img').forEach(img => {
            img.onerror = function() {
                const parent = this.parentElement;
                parent.innerHTML = `<div class="img-fallback"><i class="fas fa-box"></i><span class="fallback-label">${this.alt || 'Product'}</span></div>`;
            };
        });

        document.querySelectorAll('.gallery-grid .item img').forEach(img => {
            img.onerror = function() {
                const parent = this.parentElement;
                parent.innerHTML = `<div class="img-fallback"><i class="fas fa-image"></i><span class="fallback-label">${this.alt || 'Gallery'}</span></div>`;
            };
        });
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
        initSlider();
        loadProducts();
        initImageFallbacks();

        document.addEventListener('click', function(e) {
            const bar = document.querySelector('.search-bar');
            const results = document.getElementById('searchResults');
            if (bar && results && !bar.contains(e.target) && !results.contains(e.target)) {
                results.classList.remove('active');
            }
        });

        console.log('✅ Raj Marketing loaded ·', PRODUCTS.length, 'products');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
