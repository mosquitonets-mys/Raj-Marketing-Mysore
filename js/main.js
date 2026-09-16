/* ============================================================
   MAIN JAVASCRIPT
   Raj Marketing Mysore
============================================================ */

(function() {
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
        gstin: '29CHKPR1962H1ZT'
    };

    // ============================================================
    // PRODUCT DATABASE
    // ============================================================
    const PRODUCTS = [
        { id: 'pleated-economic', name: 'Pleated Economic', category: 'Pleated', price: '₹380-460', image: 'images/pleated-economic.jpg', badge: 'pleated', online: false },
        { id: 'pleated-heavy', name: 'Pleated Heavy', category: 'Pleated', price: '₹450-460', image: 'images/pleated-heavy.jpg', badge: 'pleated', online: false },
        { id: 'pleated-top-heavy', name: 'Pleated Top Heavy', category: 'Pleated', price: '₹510', image: 'images/pleated-top-heavy.jpg', badge: 'pleated', online: false },
        { id: 'ss-pleated-economic', name: 'SS Pleated / SS Economic', category: 'Pleated', price: '₹470', image: 'images/ss-pleated.jpg', badge: 'pleated', online: false },
        { id: 'heavy-detachable-pleated', name: 'Heavy Detachable Pleated', category: 'Pleated', price: '₹460', image: 'images/heavy-detachable-pleated.jpg', badge: 'pleated', online: false },
        { id: 'economic-woodgrain-pleated', name: 'Economic Woodgrain Pleated', category: 'Pleated', price: '₹460', image: 'images/woodgrain-pleated.jpg', badge: 'pleated', online: false },
        { id: 'honeycomb-mesh-double-door', name: 'Honeycomb + Mesh Double Door', category: 'Honeycomb', price: '₹680', image: 'images/honeycomb-double-door.jpg', badge: 'honeycomb', online: false },
        { id: 'single-sliding-economic', name: 'Single Sliding Economic', category: 'Sliding', price: '₹400', image: 'images/single-sliding.jpg', badge: 'sliding', online: false },
        { id: 'double-sliding-economic', name: 'Double Sliding Economic', category: 'Sliding', price: '₹450', image: 'images/double-sliding.jpg', badge: 'sliding', online: false },
        { id: 'single-door-pleated', name: 'Single Door Pleated', category: 'Pleated', price: '₹900', image: 'images/single-door-pleated.jpg', badge: 'pleated', online: false },
        { id: 'security-screen-single-door', name: 'Security Screen – Single Door', category: 'Security', price: '₹990 + GST', image: 'images/security-screen-single.jpg', badge: 'security', online: false },
        { id: 'security-screen-double-door', name: 'Security Screen – Double Door', category: 'Security', price: '₹1,150 + GST', image: 'images/security-screen-double.jpg', badge: 'security', online: false },
        { id: 'aluminium-frame-colour-mesh', name: 'Aluminium Frame + Colour Mesh', category: 'Aluminium', price: '₹420', image: 'images/aluminium-colour-mesh.jpg', badge: 'frame', online: false },
        { id: 'woodgrain-ss-304-mesh', name: 'Woodgrain + SS 304 Mesh', category: 'Aluminium', price: '₹580', image: 'images/woodgrain-ss304.jpg', badge: 'premium', online: false },
        { id: 'ss-black-mesh-0.18mm', name: 'SS Black Mesh 0.18mm', category: 'Mesh', price: '₹36', image: 'images/ss-black-mesh.jpg', badge: 'mesh', online: false },
        { id: 'ss-black-mesh', name: 'SS Black Mesh', category: 'Mesh', price: '₹38', image: 'images/ss-black-mesh-standard.jpg', badge: 'mesh', online: false },
        { id: 'ss-black-mesh-3ft', name: 'SS Black Mesh 3 ft', category: 'Mesh', price: '₹42', image: 'images/ss-black-mesh-3ft.jpg', badge: 'mesh', online: false },
        { id: 'ss-bright-mesh-0.24mm-4ft', name: 'SS Bright Mesh 0.24mm, 4 ft', category: 'Mesh', price: '₹48', image: 'images/ss-bright-mesh.jpg', badge: 'mesh', online: false },
        { id: 'ss-black-304g-0.5mm', name: 'SS Black 304G 0.5mm', category: 'Mesh', price: '₹550', image: 'images/ss-black-304g.jpg', badge: 'mesh', online: false },
        { id: 'fiber-touflex-mesh', name: 'Fiber/Touflex Mesh', category: 'Mesh', price: '₹8', image: 'images/fiber-mesh.jpg', badge: 'mesh', online: false }
    ];

    // Expose globally for other scripts
    window.RM_PRODUCTS = PRODUCTS;
    window.RM_BUSINESS = BUSINESS_INFO;

    // ============================================================
    // SLIDER
    // ============================================================
    function initSlider() {
        const sliderContainer = document.getElementById('sliderTrack');
        const dotContainer = document.getElementById('sliderDots');
        if (!sliderContainer || !dotContainer) return;

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

        for (let i = 1; i <= 10; i++) {
            const slide = document.createElement('div');
            slide.className = 'slider-slide';
            slide.innerHTML = `
                <img src="images/slider/slider-${String(i).padStart(2, '0')}.jpg" alt="Slide ${i}" loading="lazy" onerror="this.style.display='none'">
                <div class="overlay"></div>
                <div class="slide-content">
                    <span class="main-text">${slideTexts[i-1].main}</span>
                    <span class="sub-text">${slideTexts[i-1].sub}</span>
                </div>
            `;
            sliderContainer.appendChild(slide);

            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 1 ? ' active' : '');
            dotContainer.appendChild(dot);
        }

        setInterval(() => {
            const track = document.querySelector('.slider-track');
            const dots = document.querySelectorAll('.slider-dots .dot');
            if (!track) return;
            const pos = Math.abs(parseFloat(track.style.transform?.replace('translateX(', '').replace('%)', '')) || 0);
            const idx = Math.round(pos / 10);
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }, 1000);
    }

    // ============================================================
    // LOAD PRODUCTS
    // ============================================================
    function loadProducts() {
        const scroll = document.getElementById('productScroll');
        if (!scroll) return;
        const display = PRODUCTS.slice(0, 8);
        scroll.innerHTML = display.map(p => `
            <a href="product-detail.html?id=${p.id}" class="product-card" role="listitem">
                <div class="img">
                    <img src="${p.image}" alt="${p.name}" loading="lazy" />
                </div>
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
                <i class="fas fa-search" style="display:block;font-size:24px;margin-bottom:4px;" aria-hidden="true"></i>
                No products found for "<strong>${query}</strong>"
            </div>`;
            container.classList.add('active');
            return;
        }

        container.innerHTML = results.map(p => `
            <a href="product-detail.html?id=${p.id}" class="result-item" role="option">
                <span class="icon"><i class="fas fa-box" aria-hidden="true"></i></span>
                <div class="info">
                    <div class="name">${p.name}</div>
                    <div class="category">${p.category} · ${p.price}</div>
                </div>
            </a>
        `).join('');
        container.classList.add('active');
    }

    window.handleSearch = handleSearch;

    // ============================================================
    // FAQ TOGGLE
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
    // IMAGE FALLBACK SYSTEM
    // ============================================================
    function initImageFallbacks() {
        document.querySelectorAll('.category-card .img img').forEach(img => {
            img.onerror = function() {
                const parent = this.parentElement;
                const altText = this.alt || 'Category';
                let icon = 'fa-image';
                if (altText.toLowerCase().includes('velcro')) icon = 'fa-link';
                else if (altText.toLowerCase().includes('aluminium')) icon = 'fa-border-all';
                else if (altText.toLowerCase().includes('sliding')) icon = 'fa-arrows-alt-h';
                else if (altText.toLowerCase().includes('pleated')) icon = 'fa-wind';
                else if (altText.toLowerCase().includes('openable')) icon = 'fa-door-open';
                else if (altText.toLowerCase().includes('ss') || altText.toLowerCase().includes('steel')) icon = 'fa-circle';
                else if (altText.toLowerCase().includes('fibre')) icon = 'fa-circle-notch';
                else if (altText.toLowerCase().includes('all')) icon = 'fa-th-large';
                parent.innerHTML = `<div class="img-fallback"><i class="fas ${icon}"></i><span class="fallback-label">${altText}</span></div>`;
            };
        });

        document.querySelectorAll('.product-card .img img').forEach(img => {
            img.onerror = function() {
                const parent = this.parentElement;
                const altText = this.alt || 'Product';
                parent.innerHTML = `<div class="img-fallback"><i class="fas fa-box"></i><span class="fallback-label">${altText}</span></div>`;
            };
        });

        document.querySelectorAll('.gallery-grid .item img').forEach(img => {
            img.onerror = function() {
                const parent = this.parentElement;
                const altText = this.alt || 'Gallery';
                parent.innerHTML = `<div class="img-fallback"><i class="fas fa-image"></i><span class="fallback-label">${altText}</span></div>`;
            };
        });
    }

    // ============================================================
    // INITIALIZE
    // ============================================================
    function init() {
        initSlider();
        loadProducts();
        initImageFallbacks();

        // Close search on outside click
        document.addEventListener('click', function(e) {
            const searchBar = document.querySelector('.search-bar');
            const results = document.getElementById('searchResults');
            if (searchBar && results && !searchBar.contains(e.target) && !results.contains(e.target)) {
                results.classList.remove('active');
            }
        });

        console.log('✅ Raj Marketing homepage loaded with', PRODUCTS.length, 'products');
        console.log('✅ Header: MOVABLE (non-fixed) | Footer: MOVABLE & COMPACT');
        console.log('✅ Bold grey highlights active');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
