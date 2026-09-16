/* ============================================================
   HEADER COMPONENT LOADER
   Loads components/header.html via fetch()
   Raj Marketing Mysore
============================================================ */

(function() {
    'use strict';

    // ============================================================
    // Detect current page for active nav highlighting
    // ============================================================
    function getCurrentNavKey() {
        const path = window.location.pathname.toLowerCase();
        const file = path.split('/').pop() || 'index.html';

        if (file === '' || file === 'index.html') return 'home';
        if (file.includes('products')) return 'products';
        if (file.includes('solutions')) return 'solutions';
        if (file.includes('how-it-works')) return 'how-it-works';
        if (file.includes('about')) return 'about';
        if (file.includes('contact')) return 'contact';
        if (file.includes('estimate') || file.includes('price-checker')) return 'estimate';
        if (file.includes('track-order') || file.includes('orders')) return 'orders';
        if (file.includes('customer-login') || file.includes('customer-registration') || file.includes('account')) return 'account';
        return '';
    }

    // ============================================================
    // Apply active state to nav links
    // ============================================================
    function applyActiveState() {
        const currentNav = getCurrentNavKey();
        if (!currentNav) return;

        document.querySelectorAll('[data-nav]').forEach(link => {
            if (link.getAttribute('data-nav') === currentNav) {
                link.classList.add('active');
            }
        });
    }

    // ============================================================
    // Initialize mobile menu toggle
    // ============================================================
    function initMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!hamburgerBtn || !mobileMenu) return;

        hamburgerBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            const isOpen = mobileMenu.classList.contains('open');
            this.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
            this.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });

        // Auto-close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
                hamburgerBtn.setAttribute('aria-label', 'Open menu');
            });
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('open') &&
                !mobileMenu.contains(e.target) &&
                !hamburgerBtn.contains(e.target)) {
                mobileMenu.classList.remove('open');
                hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
                hamburgerBtn.focus();
            }
        });
    }

    // ============================================================
    // Load header.html into #header-placeholder
    // ============================================================
    function loadHeader() {
        const placeholder = document.getElementById('header-placeholder');
        if (!placeholder) return;

        // Determine base path (handles nested pages like /customer/login.html)
        const depth = (window.location.pathname.match(/\//g) || []).length;
        const isNested = depth > 1 && !window.location.pathname.endsWith('/');
        const basePath = isNested ? '../' : '';

        fetch(basePath + 'components/header.html')
            .then(response => {
                if (!response.ok) throw new Error('Header not found');
                return response.text();
            })
            .then(html => {
                // Fix relative paths for nested pages
                if (isNested) {
                    html = html.replace(/href="(?!http|https|#|mailto|tel|javascript)/g, `href="${basePath}`);
                    html = html.replace(/src="(?!http|https|data)/g, `src="${basePath}`);
                }
                placeholder.innerHTML = html;
                applyActiveState();
                initMobileMenu();
            })
            .catch(err => {
                console.warn('Header component failed to load:', err);
                // Fallback: inline minimal header
                placeholder.innerHTML = `
                    <header class="site-header">
                        <div class="header-inner">
                            <a href="${basePath}index.html" class="logo-area">
                                <div class="logo-text">
                                    <span class="brand-animation">Raj Marketing</span>
                                    <span>Mysore</span>
                                </div>
                            </a>
                        </div>
                    </header>
                `;
            });
    }

    // ============================================================
    // Boot
    // ============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();
