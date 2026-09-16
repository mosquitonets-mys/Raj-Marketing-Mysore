/* ============================================================
   HEADER COMPONENT LOADER
   Raj Marketing Mysore
============================================================ */

(function() {
    'use strict';

    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) return;

        // Determine active page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isHome = currentPage === 'index.html' || currentPage === '' || currentPage === '/';
        const isProducts = currentPage.includes('products');
        const isSolutions = currentPage.includes('solutions');
        const isHowItWorks = currentPage.includes('how-it-works');
        const isAbout = currentPage.includes('about');
        const isContact = currentPage.includes('contact');

        const headerHTML = `
        <header class="site-header" id="siteHeader">
            <div class="header-inner">
                <a href="index.html" class="logo-area">
                    <img src="images/logo.png" alt="Raj Marketing Mysore - Premium Mosquito Nets" class="logo-img"
                         onerror="this.style.display='none';this.parentElement.querySelector('.logo-icon').style.display='flex'">
                    <div class="logo-icon" style="display:none;width:44px;height:44px;border-radius:10px;background:var(--light-blue);align-items:center;justify-content:center;font-size:22px;color:var(--royal-blue);">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="logo-text">
                        <span class="brand-animation">Raj Marketing</span>
                        <span>Mysore</span>
                    </div>
                </a>

                <nav class="desktop-nav" aria-label="Main Navigation">
                    <a href="index.html" class="${isHome ? 'active' : ''}">Home</a>
                    <a href="products.html" class="${isProducts ? 'active' : ''}">Products</a>
                    <a href="solutions.html" class="${isSolutions ? 'active' : ''}">Solutions</a>
                    <a href="how-it-works.html" class="${isHowItWorks ? 'active' : ''}">How It Works</a>
                    <a href="about.html" class="${isAbout ? 'active' : ''}">About</a>
                    <a href="contact.html" class="${isContact ? 'active' : ''}">Contact</a>
                    <a href="customer/customer-login.html" class="btn-outline">Customer</a>
                    <a href="dealer/dealer-login.html" class="btn-outline">Dealer</a>
                    <a href="admin/dashboard.html" class="admin-link"><i class="fas fa-crown"></i> Admin</a>
                </nav>

                <div class="header-right">
                    <a href="https://wa.me/919483037385" target="_blank" aria-label="WhatsApp" class="wa-link"><i class="fab fa-whatsapp"></i></a>
                    <a href="tel:9483037385" aria-label="Call Raj Marketing"><i class="fas fa-phone"></i></a>
                    <button class="hamburger" id="hamburgerBtn" aria-label="Toggle Menu"><i class="fas fa-bars"></i></button>
                </div>
            </div>
        </header>

        <div class="mobile-menu" id="mobileMenu" role="navigation" aria-label="Mobile Navigation">
            <a href="index.html" class="${isHome ? 'active' : ''}">Home</a>
            <a href="products.html" class="${isProducts ? 'active' : ''}">Products</a>
            <a href="solutions.html" class="${isSolutions ? 'active' : ''}">Solutions</a>
            <a href="estimate.html">Get Estimate</a>
            <a href="appointment.html">Book Measurement</a>
            <a href="track-order.html">Track Order</a>
            <a href="customer/customer-login.html">Customer Login</a>
            <a href="customer/customer-registration.html">Customer Register</a>
            <a href="dealer/dealer-login.html">Dealer Login</a>
            <a href="dealer/dealer-registration.html" class="btn-sky">Become a Dealer</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="admin/dashboard.html" style="background:#fef3c7;color:#92400e;border-radius:8px;padding:8px 16px;margin-top:4px;">
                <i class="fas fa-crown"></i> Admin Dashboard
            </a>
        </div>
        `;

        headerPlaceholder.innerHTML = headerHTML;
        initMobileMenu();
    }

    function initMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        if (hamburgerBtn && mobileMenu) {
            hamburgerBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('open');
                const isOpen = mobileMenu.classList.contains('open');
                this.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                this.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            });

            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                    hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    hamburgerBtn.setAttribute('aria-label', 'Open menu');
                });
            });
        }
    }

    // Load on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();
