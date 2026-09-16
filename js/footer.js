/* ============================================================
   FOOTER COMPONENT LOADER
   Loads components/footer.html via fetch()
   Raj Marketing Mysore
============================================================ */

(function() {
    'use strict';

    // ============================================================
    // Detect current page for bottom nav highlighting
    // ============================================================
    function getCurrentNavKey() {
        const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (file === '' || file === 'index.html') return 'home';
        if (file.includes('products')) return 'products';
        if (file.includes('estimate') || file.includes('price-checker')) return 'estimate';
        if (file.includes('track-order') || file.includes('orders')) return 'orders';
        if (file.includes('customer-login') || file.includes('customer-registration') || file.includes('account')) return 'account';
        return '';
    }

    // ============================================================
    // Apply active state to bottom nav
    // ============================================================
    function applyActiveState() {
        const currentNav = getCurrentNavKey();
        if (!currentNav) return;

        document.querySelectorAll('.bottom-nav [data-nav]').forEach(link => {
            if (link.getAttribute('data-nav') === currentNav) {
                link.classList.add('active');
            }
        });
    }

    // ============================================================
    // Load footer.html into #footer-placeholder
    // ============================================================
    function loadFooter() {
        const placeholder = document.getElementById('footer-placeholder');
        if (!placeholder) return;

        // Determine base path for nested pages
        const depth = (window.location.pathname.match(/\//g) || []).length;
        const isNested = depth > 1 && !window.location.pathname.endsWith('/');
        const basePath = isNested ? '../' : '';

        fetch(basePath + 'components/footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Footer not found');
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
            })
            .catch(err => {
                console.warn('Footer component failed to load:', err);
                // Fallback: minimal footer
                placeholder.innerHTML = `
                    <footer class="site-footer">
                        <div class="container">
                            <div class="footer-bottom">
                                © 2026 <span>Raj Marketing Mysore</span> · All Rights Reserved
                            </div>
                        </div>
                    </footer>
                `;
            });
    }

    // ============================================================
    // Boot
    // ============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();
