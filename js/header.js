/* ============================================================
   HEADER COMPONENT LOADER — FIXED
============================================================ */

(function() {
    'use strict';

    function getBasePath() {
        // Works on: /index.html, /pages/foo.html, /cities/mandya.html, file:///
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);

        // If we're at the root (e.g., /index.html or /), depth = 1
        // If we're nested (e.g., /cities/mandya.html), depth = 2
        const depth = parts.length;

        if (depth <= 1) return '';
        // For each extra folder level beyond root, add ../
        return '../'.repeat(depth - 1);
    }

    function getCurrentNavKey() {
        const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (file === '' || file === 'index.html') return 'home';
        if (file.includes('products')) return 'products';
        if (file.includes('solutions')) return 'solutions';
        if (file.includes('how-it-works')) return 'how-it-works';
        if (file.includes('about')) return 'about';
        if (file.includes('contact')) return 'contact';
        return '';
    }

    function applyActiveState() {
        const current = getCurrentNavKey();
        if (!current) return;
        document.querySelectorAll('[data-nav]').forEach(link => {
            if (link.getAttribute('data-nav') === current) {
                link.classList.add('active');
            }
        });
    }

    function initMobileMenu() {
        const btn = document.getElementById('hamburgerBtn');
        const menu = document.getElementById('mobileMenu');
        if (!btn || !menu) return;

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('open');
            const isOpen = menu.classList.contains('open');
            this.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                menu.classList.remove('open');
                btn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        document.addEventListener('click', function(e) {
            if (menu.classList.contains('open') &&
                !menu.contains(e.target) &&
                !btn.contains(e.target)) {
                menu.classList.remove('open');
                btn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                menu.classList.remove('open');
                btn.innerHTML = '<i class="fas fa-bars"></i>';
                btn.focus();
            }
        });
    }

    function loadHeader() {
        const placeholder = document.getElementById('header-placeholder');
        if (!placeholder) return;

        const base = getBasePath();
        fetch(base + 'components/header.html')
            .then(r => { if (!r.ok) throw new Error('Header missing'); return r.text(); })
            .then(html => {
                if (base) {
                    html = html.replace(/(href|src)="(?!https?:|data:|mailto:|tel:|#|javascript:)/g, `$1="${base}`);
                }
                placeholder.innerHTML = html;
                applyActiveState();
                initMobileMenu();
            })
            .catch(err => {
                console.warn('Header load failed:', err);
                placeholder.innerHTML = `
                    <header class="site-header">
                        <div class="header-inner" style="justify-content:space-between;">
                            <a href="${base}index.html" class="logo-area">
                                <div class="logo-text">
                                    <span class="brand-name">Raj Marketing</span>
                                    <span class="brand-sub">Mysore</span>
                                </div>
                            </a>
                        </div>
                    </header>
                `;
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();
