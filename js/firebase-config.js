
/* =====================================================
   RAJ MARKETING MYSORE
   FIREBASE CONFIGURATION — VERSION 4.0
   File: /firebase-config.js
===================================================== */

import {
  initializeApp,
  getApps,
  getApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";

import {
  collection,
  getDocs,
  limit,
  query
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// 1. FIREBASE CONFIGURATION

const firebaseConfig = {
  apiKey: "AIzaSyB_a91sI0xpFRX5_ti2ukM8Ybn2lMXS6Zw",
  authDomain: "raj-marketing-mysore-f91f7.firebaseapp.com",
  projectId: "raj-marketing-mysore-f91f7",
  storageBucket: "raj-marketing-mysore-f91f7.firebasestorage.app",
  messagingSenderId: "534782698781",
  appId: "1:534782698781:web:bad9454adb5d2ad1e7edf4",
  measurementId: "G-P95PHHGV2M"
};

// 2. INITIALIZE APP

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// 3. FIRESTORE

const db = getFirestore(app);

// 4. AUTHENTICATION

const auth = getAuth(app);

// 5. STORAGE

const storage = getStorage(app);

// 6. DEBUG HELPERS

if (typeof window !== "undefined") {
  window.RMFirebase = {
    app,
    db,
    auth,
    storage,
    config: firebaseConfig,

    test: async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "products"), limit(1))
        );

        console.log("Firestore connected:", snap.size);
        return true;
      } catch (error) {
        console.error("Firestore error:", error.code, error.message);
        return false;
      }
    },

    whoami: () => auth.currentUser,

    checkAdmin: async () => {
      if (!auth.currentUser) return false;

      const token = await auth.currentUser.getIdTokenResult(true);

      return token.claims.admin === true;
    }
  };

  console.log("Raj Marketing Mysore Firebase initialized");
}

export {
  app,
  db,
  auth,
  storage,
  firebaseConfig
};

export default app;
