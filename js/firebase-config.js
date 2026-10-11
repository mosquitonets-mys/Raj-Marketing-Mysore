/* ============================================================
   FIREBASE CONFIGURATION
   Raj Marketing Mysore
   Version: 3.0
   Project: raj-marketing-mysore-f91f7
   ------------------------------------------------------------
   Location: /firebase-config.js  (root)
============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
    getFirestore,
    enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyB_a91sI0xpFRX5_ti2ukM8Ybn2lMXS6Zw",
    authDomain: "raj-marketing-mysore-f91f7.firebaseapp.com",
    projectId: "raj-marketing-mysore-f91f7",
    storageBucket: "raj-marketing-mysore-f91f7.firebasestorage.app",
    messagingSenderId: "534782698781",
    appId: "1:534782698781:web:bad9454adb5d2ad1e7edf4",
    measurementId: "G-P95PHHGV2M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Enable offline cache (safe to fail)
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('⚠️ Firestore: multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Firestore: browser unsupported');
    }
});

// Global debug helper
if (typeof window !== 'undefined') {
    window.RMFirebase = {
        app, db, auth, storage, config: firebaseConfig,
        test: async () => {
            try {
                const { collection, getDocs, limit, query } = await import(
                    "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js"
                );
                const snap = await getDocs(query(collection(db, 'products'), limit(1)));
                console.log(`✅ Firestore OK — ${snap.size} docs`);
                return true;
            } catch (e) {
                console.error('❌ Firestore failed:', e.message);
                return false;
            }
        },
        whoami: () => auth.currentUser
    };
}

export { app, db, auth, storage };
export default app;
