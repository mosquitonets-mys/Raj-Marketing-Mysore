/* ============================================================
   FIREBASE CONFIGURATION
   Raj Marketing Mysore
   ------------------------------------------------------------
   Version: 3.0
   Project: raj-marketing-mysore-f91f7
   ------------------------------------------------------------
   Loads:
   - Firebase App (core)
   - Firestore (database)
   - Auth (user authentication)
   - Storage (file uploads)
   - Analytics (optional — page views)
   ------------------------------------------------------------
   Usage (in any HTML):
     <script type="module" src="js/firebase-config.js"></script>
   Usage (in other JS modules):
     import { db, auth, storage } from './firebase-config.js';
============================================================ */

// ============================================================
// SDK IMPORTS (CDN — no npm required)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
    getFirestore,
    enableIndexedDbPersistence,
    connectFirestoreEmulator
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";
import {
    getAnalytics,
    isSupported as analyticsIsSupported
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";

// ============================================================
// FIREBASE PROJECT CONFIG
// ============================================================
// NOTE: These values are NOT secrets. Firebase API keys are
// designed to be public. Security comes from Firestore Rules,
// Auth rules, and Storage rules — not from hiding this object.
// ============================================================
const firebaseConfig = {
    apiKey: "AIzaSyB_a91sI0xpFRX5_ti2ukM8Ybn2lMXS6Zw",
    authDomain: "raj-marketing-mysore-f91f7.firebaseapp.com",
    projectId: "raj-marketing-mysore-f91f7",
    storageBucket: "raj-marketing-mysore-f91f7.firebasestorage.app",
    messagingSenderId: "534782698781",
    appId: "1:534782698781:web:bad9454adb5d2ad1e7edf4",
    measurementId: "G-P95PHHGV2M"
};

// ============================================================
// ENVIRONMENT DETECTION
// ============================================================
const isLocalhost = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '' ||
    window.location.protocol === 'file:'
);

const isGitHubPages = window.location.hostname.includes('github.io');
const isProduction = window.location.hostname === 'rajmarketingmysore.info' ||
                     window.location.hostname === 'www.rajmarketingmysore.info';

// ============================================================
// INITIALIZE APP
// ============================================================
const app = initializeApp(firebaseConfig);

// ============================================================
// INITIALIZE FIRESTORE
// ============================================================
const db = getFirestore(app);

// Enable offline persistence (works in most modern browsers)
// This lets Firestore cache data and work offline
if (typeof window !== 'undefined' && !isLocalhost) {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('⚠️ Firestore persistence: multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('⚠️ Firestore persistence: browser not supported');
        } else {
            console.warn('⚠️ Firestore persistence unavailable:', err.code);
        }
    });
}

// ============================================================
// INITIALIZE AUTH
// ============================================================
const auth = getAuth(app);

// ============================================================
// INITIALIZE STORAGE
// ============================================================
const storage = getStorage(app);

// ============================================================
// INITIALIZE ANALYTICS (optional — only if supported)
// ============================================================
let analytics = null;

analyticsIsSupported()
    .then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
            console.log('📊 Firebase Analytics enabled');
        } else {
            console.log('ℹ️ Firebase Analytics not supported in this browser');
        }
    })
    .catch((err) => {
        console.warn('⚠️ Analytics init failed:', err.message);
    });

// ============================================================
// CONNECTION MONITORING
// ============================================================
if (typeof window !== 'undefined') {
    // Log env
    if (isLocalhost) {
        console.log('🔧 Firebase: LOCALHOST mode');
    } else if (isGitHubPages) {
        console.log('🌐 Firebase: GitHub Pages mode');
    } else if (isProduction) {
        console.log('🚀 Firebase: PRODUCTION mode');
    } else {
        console.log('🌍 Firebase: Unknown host —', window.location.hostname);
    }

    // Online/offline events
    window.addEventListener('online', () => {
        console.log('🟢 Back online');
    });

    window.addEventListener('offline', () => {
        console.log('🔴 Offline — Firestore will use cache');
    });
}

// ============================================================
// EXPORTS
// ============================================================
export { app, db, auth, storage, analytics };
export default app;

// ============================================================
// GLOBAL DEBUG HELPERS
// Accessible as window.RMFirebase in browser console
// ============================================================
if (typeof window !== 'undefined') {
    window.RMFirebase = {
        app,
        db,
        auth,
        storage,
        analytics,
        config: firebaseConfig,
        env: {
            isLocalhost,
            isGitHubPages,
            isProduction
        },
        // Quick connection test
        test: async () => {
            try {
                const { collection, getDocs, limit, query } = await import(
                    "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js"
                );
                const snap = await getDocs(query(collection(db, 'products'), limit(1)));
                console.log(`✅ Firestore connected — ${snap.size} products found`);
                return true;
            } catch (err) {
                console.error('❌ Firestore connection failed:', err.message);
                return false;
            }
        },
        // Show current auth user
        whoami: () => {
            const user = auth.currentUser;
            if (!user) {
                console.log('👤 Not signed in');
                return null;
            }
            console.log('👤 Signed in as:', {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified
            });
            return user;
        }
    };

    console.log('💡 Debug helpers loaded: window.RMFirebase');
    console.log('   → RMFirebase.test()      (test Firestore connection)');
    console.log('   → RMFirebase.whoami()    (show current user)');
   }
