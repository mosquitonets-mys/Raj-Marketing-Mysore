/* ============================================================
   INDEX-PAGE.JS
   Page-specific logic for index.html ONLY.
   Requires: main.js (for RM_PRODUCTS)
============================================================ */

(function () {
    'use strict';

    // ============================================================
    // 1. HERO SLIDER AUTO-ROTATION (if using .hero-slider)
    // ============================================================
    // Only runs if the OLD .hero-slider exists (not .slider-container)
    function initHeroSlider() {
        const slider = document.getElementById('heroSlider');
        if (!slider) return; // Uses .slider-container instead — skip

        const slides = slider.querySelectorAll('.slide');
        const dotsBox = document.getElementById('heroDots');
        if (!slides.length || !dotsBox) return;

        let current = 0;
        let timer;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.onclick = () => goTo(i);
            dotsBox.appendChild(dot);
        });

        function goTo(i) {
            slides[current].classList.remove('active');
            dotsBox.children[current].classList.remove('active');
            current = (i + slides.length) % slides.length;
            slides[current].classList.add('active');
            dotsBox.children[current].classList.add('active');
            resetTimer();
        }

        function next() { goTo(current + 1); }

        function resetTimer() {
            clearInterval(timer);
            timer = setInterval(next, 4000);
        }

        resetTimer();

        slider.addEventListener('mouseenter', () => clearInterval(timer));
        slider.addEventListener('mouseleave', resetTimer);

        // Touch swipe
        let startX = 0;
        slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        slider.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) {
                if (dx < 0) goTo(current + 1);
                else goTo(current - 1);
            }
        });
    }

    // ============================================================
    // 2. FEATURED PRODUCTS — Populate the featured scroll
    // ============================================================
    function initFeaturedProducts() {
        const container = document.getElementById('featuredProducts');
        if (!container) return;

        // Wait for RM_PRODUCTS to be available
        if (!window.RM_PRODUCTS) {
            setTimeout(initFeaturedProducts, 100);
            return;
        }

        // Curated featured list — 8 items across categories
        const featuredIds = [
            'velcro-economic', 'velcro-premium',
            'aluminium-black-ss', 'pleated-gold',
            'pleated-platinum', 'mesh-door-black',
            'single-sliding-economic', 'security-screen-single-door'
        ];

        const badges = {
            'velcro-economic': 'Best Seller',
            'velcro-premium': 'Premium',
            'aluminium-black-ss': 'Popular',
            'pleated-gold': 'Sale',
            'pleated-platinum': 'Premium',
            'mesh-door-black': 'Best Seller',
            'single-sliding-economic': 'New',
            'security-screen-single-door': 'Security'
        };

        const featured = featuredIds
            .map(id => window.RM_PRODUCTS.find(p => p.id === id))
            .filter(Boolean);

        container.innerHTML = featured.map(p => `
            <a href="product-detail.html?id=${p.id}" class="featured-card">
                <div class="img-wrap">
                    <span class="badge-tag">${badges[p.id] || 'Featured'}</span>
                    <img src="${p.image}" alt="${p.name}" loading="lazy"
                         onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="name">${p.name}</div>
                <div class="variant">${p.category}</div>
                <div class="price-row">
                    <span class="price">${p.price}</span>
                    <span class="unit">/sq.ft</span>
                </div>
                <div class="cta-btn">View Details</div>
            </a>
        `).join('');
    }

    // ============================================================
    // 3. INIT
    // ============================================================
    function init() {
        initHeroSlider();
        initFeaturedProducts();
        console.log('✅ Index page-specific JS loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
