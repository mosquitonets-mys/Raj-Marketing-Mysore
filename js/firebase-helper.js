/* ============================================================
   FIREBASE HELPER — Reusable functions for all pages
============================================================ */

import { auth, db, storage, functions } from '../firebase-config.js';
import {
    collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, serverTimestamp, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
    ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
import {
    httpsCallable
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-functions.js";

export {
    // Auth
    auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail,
    
    // Firestore
    db, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, serverTimestamp, onSnapshot,
    
    // Storage
    storage, ref, uploadBytes, getDownloadURL, deleteObject,
    
    // Functions
    functions, httpsCallable
};
