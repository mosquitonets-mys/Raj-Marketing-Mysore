// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";

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
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
