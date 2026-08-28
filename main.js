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

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

function getProductsByCategory(category) {
    return PRODUCTS.filter(p => p.category === category);
}

function searchProducts(query) {
    const term = query.toLowerCase().trim();
    return PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.price.toLowerCase().includes(term)
    );
}

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// ============================================================
// FAQ TOGGLE
// ============================================================
function toggleFaq(el) {
    const answer = el.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    document.querySelectorAll('.faq-item .a').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-item .q').forEach(q => q.classList.remove('open'));
    if (!isOpen) {
        answer.classList.add('open');
        el.classList.add('open');
    }
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            this.innerHTML = mobileMenu.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// ============================================================
// SEARCH
// ============================================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value;
        if (!query || query.length < 1) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        const results = searchProducts(query);
        if (results.length === 0) {
            searchResults.innerHTML = `<div style="padding:16px;text-align:center;color:var(--muted-text);font-size:13px;"><i class="fas fa-search" style="display:block;font-size:24px;margin-bottom:4px;"></i>No products found for "<strong>${query}</strong>"</div>`;
            searchResults.classList.add('active');
            return;
        }
        searchResults.innerHTML = results.map(p => `
            <a href="product-detail.html?id=${p.id}" class="result-item">
                <span class="icon"><i class="fas fa-box"></i></span>
                <div class="info"><div class="name">${p.name}</div><div class="category">${p.category} · ${p.price}</div></div>
            </a>
        `).join('');
        searchResults.classList.add('active');
    });
    
    document.addEventListener('click', function(e) {
        const searchBar = document.querySelector('.search-bar');
        if (searchBar && searchResults && !searchBar.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

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
            <img src="images/slider/slider-${String(i).padStart(2, '0')}.jpg" alt="Slide ${i}" onerror="this.style.display='none'">
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
    
    const display = PRODUCTS.slice(0, 6);
    scroll.innerHTML = display.map(p => `
        <a href="product-detail.html?id=${p.id}" class="product-card">
            <div class="img">
                <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-box\\' style=\\'font-size:32px;color:#9ca3af;\\'></i>'" />
            </div>
            <div class="name">${p.name}</div>
            <div class="price">${p.price}</div>
            <span class="view-btn">${p.online ? 'Buy Online' : 'View Details'}</span>
        </a>
    `).join('');
}

// ============================================================
// INITIALIZE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSearch();
    initSlider();
    loadProducts();
    
    console.log('✅ Raj Marketing website loaded with', PRODUCTS.length, 'products');
});
