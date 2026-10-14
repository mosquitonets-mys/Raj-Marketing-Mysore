/* ============================================================
   FIREBASE CONFIGURATION — Raj Marketing Mysore
   Project: raj-marketing-mysore-f91f7
   SDK: Firebase v10.13.0 (modular)
   ============================================================ */

// ============================================================
// CORE SDK IMPORTS
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-functions.js";

// ============================================================
// FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyD6c8X3vRzXq9Z5Y7W1pQmK2nB4hLfT8sVeA",   // ⚠️ Replace with your actual API key from Firebase Console
  authDomain: "raj-marketing-mysore-f91f7.firebaseapp.com",
  projectId: "raj-marketing-mysore-f91f7",
  storageBucket: "raj-marketing-mysore-f91f7.firebasestorage.app",
  messagingSenderId: "534782698781",
  appId: "1:534782698781:web:bad9454adb5d2ad1e7edf4",
  measurementId: "G-P95PHHGV2M"
};

// ============================================================
// INITIALIZE FIREBASE
// ============================================================
const app = initializeApp(firebaseConfig);

// ============================================================
// INITIALIZE SERVICES
// ============================================================
let auth, db, storage, functions, analytics;

try {
    auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');
} catch (e) {
    console.error('❌ Firebase Auth init failed:', e.message);
}

try {
    db = getFirestore(app);
    console.log('✅ Firestore initialized');
} catch (e) {
    console.error('❌ Firestore init failed:', e.message);
}

try {
    storage = getStorage(app);
    console.log('✅ Storage initialized');
} catch (e) {
    console.error('❌ Storage init failed:', e.message);
}

try {
    functions = getFunctions(app, 'us-central1');
    console.log('✅ Functions initialized');
} catch (e) {
    console.error('❌ Functions init failed:', e.message);
}

// Analytics — only on HTTPS/secure contexts
try {
    if (typeof window !== 'undefined' && window.isSecureContext) {
        analytics = getAnalytics(app);
        console.log('✅ Analytics initialized');
    } else {
        console.log('ℹ️ Analytics skipped (not secure context)');
    }
} catch (e) {
    console.warn('⚠️ Analytics not available:', e.message);
}

// ============================================================
// EXPORT SERVICES
// ============================================================
export { app, auth, db, storage, functions, analytics, logEvent };

// ============================================================
// DEFAULT EXPORT (for compatibility)
// ============================================================
export default {
    app,
    auth,
    db,
    storage,
    functions,
    analytics
};

// ============================================================
// GLOBAL HELPERS (optional — useful for debugging in console)
// ============================================================
if (typeof window !== 'undefined') {
    window.__FIREBASE__ = {
        app,
        auth,
        db,
        storage,
        functions,
        analytics,
        projectId: firebaseConfig.projectId
    };
    console.log('%c🔥 Firebase Config Loaded', 'color:#f59e0b;font-weight:900;font-size:14px;');
    console.log('%cProject: ' + firebaseConfig.projectId, 'color:#1a56db;font-weight:bold;');
    console.log('%cServices: Auth · Firestore · Storage · Functions · Analytics', 'color:#059669;font-weight:bold;');
}
