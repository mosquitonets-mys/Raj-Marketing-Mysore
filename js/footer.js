/* ============================================================
   FOOTER COMPONENT LOADER — FIXED
============================================================ */

(function() {
    'use strict';

    function getBasePath() {
        const parts = window.location.pathname.split('/').filter(Boolean);
        const depth = parts.length;
        return depth <= 1 ? '' : '../'.repeat(depth - 1);
    }

    function loadFooter() {
        const placeholder = document.getElementById('footer-placeholder');
        if (!placeholder) return;

        const base = getBasePath();
        fetch(base + 'components/footer.html')
            .then(r => { if (!r.ok) throw new Error('Footer missing'); return r.text(); })
            .then(html => {
                if (base) {
                    html = html.replace(/(href|src)="(?!https?:|data:|mailto:|tel:|#|javascript:)/g, `$1="${base}`);
                }
                placeholder.innerHTML = html;
            })
            .catch(err => {
                console.warn('Footer load failed:', err);
                placeholder.innerHTML = `
                    <footer class="site-footer">
                        <div class="container">
                            <div class="footer-copyright" style="text-align:center;padding:20px 0;">
                                © 2026 <strong>Raj Marketing Mysore</strong> · GST: 29GKYPM6953C1ZA
                            </div>
                        </div>
                    </footer>
                `;
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();
