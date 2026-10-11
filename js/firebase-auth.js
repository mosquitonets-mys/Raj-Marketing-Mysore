/* ============================================================
   FIREBASE AUTH HELPER
   Raj Marketing Mysore
   Version: 3.0  (compatible with firebase-config.js v12.17.1)
   Location: /js/firebase-auth.js
   ------------------------------------------------------------
   Handles: Customer, Dealer, Admin authentication
============================================================ */

import { auth, db } from '../firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { Customers, Dealers, Notifications } from './firestore-service.js';

// ============================================================
// CUSTOMER AUTH
// ============================================================
const CustomerAuth = {
    async register(data) {
        try {
            const credential = await createUserWithEmailAndPassword(
                auth, data.email, data.password
            );
            const user = credential.user;

            await updateProfile(user, { displayName: data.name });

            await Customers.create(user.uid, {
                uid: user.uid,
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                whatsapp: data.whatsapp || data.mobile,
                city: data.city || 'Mysore',
                address: data.address || '',
                role: 'customer',
                status: 'Active'
            });

            // Notify admin (best-effort)
            try {
                await Notifications.createForUser('ADMIN', {
                    type: 'customer_registration',
                    title: 'New Customer',
                    message: `${data.name} (${data.mobile}) registered.`
                });
            } catch (e) {
                console.warn('Admin notify failed:', e.message);
            }

            return { success: true, user };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async login(email, password) {
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const profile = await Customers.get(credential.user.uid);

            if (!profile) {
                await signOut(auth);
                return { success: false, error: 'Profile not found. Contact support.' };
            }

            if (profile.status === 'Suspended' || profile.status === 'Blocked') {
                await signOut(auth);
                return { success: false, error: 'Account suspended. Contact support.' };
            }

            return { success: true, user: credential.user, profile };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async logout() {
        await signOut(auth);
    },

    async getCurrentProfile() {
        const user = auth.currentUser;
        if (!user) return null;
        return Customers.get(user.uid);
    },

    async updateProfile(updates) {
        const user = auth.currentUser;
        if (!user) return { success: false, error: 'Not logged in' };
        try {
            if (updates.name) await updateProfile(user, { displayName: updates.name });
            await Customers.update(user.uid, updates);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// ============================================================
// DEALER AUTH
// ============================================================
const DealerAuth = {
    async register(data) {
        try {
            const credential = await createUserWithEmailAndPassword(
                auth, data.email, data.password
            );
            const user = credential.user;

            await updateProfile(user, { displayName: data.ownerName });

            const dealerId = 'DLR-' + String(Date.now()).slice(-6);

            await Dealers.create(user.uid, {
                uid: user.uid,
                dealerId,
                ownerName: data.ownerName,
                businessName: data.businessName,
                email: data.email,
                mobile: data.mobile,
                whatsapp: data.whatsapp || data.mobile,
                gst: data.gst || '',
                address: data.address,
                city: data.city,
                pincode: data.pincode || '',
                role: 'dealer',
                status: 'Pending',
                tier: 'Bronze'
            });

            // Notify admin (best-effort, ignore failure)
            try {
                await Notifications.createForUser('ADMIN', {
                    type: 'dealer_registration',
                    title: 'New Dealer Application',
                    message: `${data.businessName} (${data.ownerName}) applied.`
                });
            } catch (e) {
                console.warn('Admin notify failed:', e.message);
            }

            return { success: true, user, dealerId };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async login(email, password) {
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const profile = await Dealers.get(credential.user.uid);

            if (!profile) {
                await signOut(auth);
                return { success: false, error: 'Dealer profile not found.' };
            }

            if (profile.status === 'Pending') {
                await signOut(auth);
                return {
                    success: false,
                    error: 'Your application is under review. Please wait for approval.',
                    status: 'Pending'
                };
            }

            if (profile.status === 'Rejected') {
                await signOut(auth);
                return {
                    success: false,
                    error: profile.rejectReason || 'Your application was rejected.',
                    status: 'Rejected'
                };
            }

            if (profile.status === 'Suspended') {
                await signOut(auth);
                return {
                    success: false,
                    error: 'Account suspended. Contact admin.',
                    status: 'Suspended'
                };
            }

            return { success: true, user: credential.user, profile };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async logout() {
        await signOut(auth);
    },

    async getCurrentProfile() {
        const user = auth.currentUser;
        if (!user) return null;
        return Dealers.get(user.uid);
    }
};

// ============================================================
// ADMIN AUTH (Firebase Auth email/password + Firestore role)
// ------------------------------------------------------------
// Admin user is created manually in Firebase Console with
// email rajmarketingmys@gmail.com, then added to /admins/{uid}
// ============================================================
const ADMIN_EMAIL = 'rajmarketingmys@gmail.com';

const AdminAuth = {
    async login(email, password) {
        try {
            if (email.toLowerCase() !== ADMIN_EMAIL) {
                return { success: false, error: 'Not an admin email.' };
            }

            const credential = await signInWithEmailAndPassword(auth, email, password);
            const uid = credential.user.uid;

            // Verify admin doc in Firestore
            const snap = await getDoc(doc(db, 'admins', uid));
            if (!snap.exists()) {
                await signOut(auth);
                return { success: false, error: 'You are not registered as admin.' };
            }

            sessionStorage.setItem('rm_admin_uid', uid);
            sessionStorage.setItem('rm_admin_login_at', Date.now().toString());

            return { success: true, user: credential.user };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async checkSession() {
        const user = auth.currentUser;
        if (!user) return false;
        try {
            const snap = await getDoc(doc(db, 'admins', user.uid));
            return snap.exists();
        } catch {
            return false;
        }
    },

    async logout() {
        sessionStorage.removeItem('rm_admin_uid');
        sessionStorage.removeItem('rm_admin_login_at');
        await signOut(auth);
    }
};

// ============================================================
// UNIFIED AUTH OBSERVER
// ============================================================
function onAuthChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (!user) {
            callback(null, null, null);
            return;
        }

        let role = 'customer';
        let profile = null;

        try {
            const custProfile = await Customers.get(user.uid);
            if (custProfile) {
                profile = custProfile;
                role = 'customer';
            } else {
                const dealerProfile = await Dealers.get(user.uid);
                if (dealerProfile) {
                    profile = dealerProfile;
                    role = 'dealer';
                } else {
                    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
                    if (adminDoc.exists()) {
                        profile = { uid: user.uid, role: 'admin', email: user.email };
                        role = 'admin';
                    }
                }
            }
        } catch (e) {
            console.warn('Profile fetch error:', e.message);
        }

        callback(user, profile, role);
    });
}

// ============================================================
// UTILITIES
// ============================================================
function mapAuthError(error) {
    const messages = {
        'auth/email-already-in-use': 'This email is already registered. Try logging in.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Please try later.',
        'auth/network-request-failed': 'Network error. Check connection.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-disabled': 'This account has been disabled.'
    };
    return messages[error.code] || error.message || 'Something went wrong.';
}

// ============================================================
// EXPORTS
// ============================================================
export {
    CustomerAuth,
    DealerAuth,
    AdminAuth,
    onAuthChange,
    mapAuthError
};

export default {
    CustomerAuth,
    DealerAuth,
    AdminAuth,
    onAuthChange
};
