// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    // Firebase Configuration
    firebase: {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    },
    
    // Business Info
    business: {
        name: 'Raj Marketing Mysore',
        phone: '+919483037385',
        whatsapp: '919483037385',
        email: 'info@rajmarketingmysore.info',
        address: '#45, Devraj Urs Road, Mysore – 570001',
        gstin: '29CHKPR1962H1ZT',
        businessHours: 'Mon–Sat: 9:30 AM – 6:30 PM | Sun: Closed'
    },
    
    // API Endpoints
    api: {
        baseUrl: 'https://api.rajmarketingmysore.info',
        products: '/api/products',
        estimates: '/api/estimates',
        orders: '/api/orders',
        customers: '/api/customers',
        dealers: '/api/dealers'
    },
    
    // Feature Flags
    features: {
        enableAI: true,
        enableWhatsApp: true,
        enablePayment: false,
        enableTracking: true,
        enableReviews: true
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
