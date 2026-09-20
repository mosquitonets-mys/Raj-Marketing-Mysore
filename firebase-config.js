/* ============================================================
   FIREBASE CONFIGURATION
   Raj Marketing Mysore
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";

// ============================================================
// YOUR FIREBASE CONFIG
// Replace with your own values from Firebase Console
// ============================================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "raj-marketing-mysore.firebaseapp.com",
    projectId: "raj-marketing-mysore",
    storageBucket: "raj-marketing-mysore.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890",
    measurementId: "G-XXXXXXXXXX"
};

// ============================================================
// INITIALIZE
// ============================================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics (optional — wrap in try/catch)
let analytics = null;
try {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        analytics = getAnalytics(app);
    }
} catch (e) {
    console.warn('Analytics not initialized:', e.message);
}

// ============================================================
// EXPORT
// ============================================================
export { app, auth, db, storage, analytics };
export default { app, auth, db, storage, analytics };

console.log('%c🔥 Firebase initialized', 'color:#f59e0b;font-weight:bold;');
