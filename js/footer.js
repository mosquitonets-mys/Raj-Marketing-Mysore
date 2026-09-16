/* ============================================================
   FOOTER COMPONENT LOADER
   Raj Marketing Mysore
============================================================ */

(function() {
    'use strict';

    function loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;

        const footerHTML = `
        <footer class="site-footer" id="siteFooter">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <div class="brand">Raj <span>Marketing</span> Mysore</div>
                        <p>Quality mosquito nets since 2016.</p>
                        <div class="contact-info"><i class="fas fa-phone" aria-hidden="true"></i> 9483037385</div>
                        <div class="contact-info"><i class="fas fa-envelope" aria-hidden="true"></i> info@rajmarketingmysore.info</div>
                        <div class="contact-info"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> #45, Devraj Urs Road, Mysore</div>
                    </div>
                    <div class="footer-col">
                        <h4>Products</h4>
                        <a href="products.html">Velcro Nets</a>
                        <a href="products.html">Aluminium Frame</a>
                        <a href="products.html">Sliding Nets</a>
                        <a href="products.html">Pleated Nets</a>
                        <a href="products.html">SS Mesh</a>
                    </div>
                    <div class="footer-col">
                        <h4>Services</h4>
                        <a href="estimate.html">Get Estimate</a>
                        <a href="appointment.html">Book Measurement</a>
                        <a href="price-checker.html">AI Price Checker</a>
                        <a href="track-order.html">Track Order</a>
                        <a href="dealer/dealer-registration.html">Dealer Registration</a>
                    </div>
                    <div class="footer-col">
                        <h4>Company</h4>
                        <a href="about.html">About Us</a>
                        <a href="contact.html">Contact</a>
                        <a href="customer/customer-login.html">Customer Login</a>
                        <a href="dealer/dealer-login.html">Dealer Login</a>
                        <a href="privacy.html">Privacy Policy</a>
                        <a href="terms.html">Terms</a>
                    </div>
                </div>
                <div class="footer-bottom">
                    © 2026 <span>Raj Marketing Mysore</span> · All Rights Reserved · GST: 29CHKPR1962H1ZT
                    <div class="footer-legal">
                        <a href="privacy.html">Privacy Policy</a>
                        <a href="terms.html">Terms &amp; Conditions</a>
                        <a href="refund.html">Refund Policy</a>
                        <a href="disclaimer.html">Disclaimer</a>
                    </div>
                </div>
            </div>
        </footer>

        <a href="https://wa.me/919483037385" class="whatsapp-float" target="_blank" aria-label="Chat on WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>

        <nav class="bottom-nav" aria-label="Bottom navigation">
            <a href="index.html" class="active"><i class="fas fa-home" aria-hidden="true"></i> Home</a>
            <a href="products.html"><i class="fas fa-th-large" aria-hidden="true"></i> Products</a>
            <a href="estimate.html"><i class="fas fa-file-invoice" aria-hidden="true"></i> Estimate</a>
            <a href="track-order.html"><i class="fas fa-box" aria-hidden="true"></i> Orders</a>
            <a href="customer/customer-login.html"><i class="fas fa-user" aria-hidden="true"></i> Account</a>
        </nav>
        `;

        footerPlaceholder.innerHTML = footerHTML;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();
