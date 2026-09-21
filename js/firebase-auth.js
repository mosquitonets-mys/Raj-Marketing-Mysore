/* ============================================================
   FIREBASE AUTH HELPER
   Raj Marketing Mysore
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
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { Customers, Dealers } from './firestore-service.js';

// ============================================================
// CUSTOMER AUTH
// ============================================================
const CustomerAuth = {
    async register(data) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth, data.email, data.password
            );
            const user = userCredential.user;

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
                status: 'Active',
                createdAt: serverTimestamp()
            });

            return { success: true, user };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const profile = await Customers.get(userCredential.user.uid);

            if (!profile) {
                await signOut(auth);
                return { success: false, error: 'Profile not found. Please contact support.' };
            }

            if (profile.status === 'Suspended' || profile.status === 'Blocked') {
                await signOut(auth);
                return { success: false, error: 'Your account is suspended. Contact support.' };
            }

            return { success: true, user: userCredential.user, profile };
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

    logout: () => signOut(auth),

    getCurrentProfile: async () => {
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
            const userCredential = await createUserWithEmailAndPassword(
                auth, data.email, data.password
            );
            const user = userCredential.user;

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
                tier: 'Bronze',
                createdAt: serverTimestamp()
            });

            await db.collection('notifications').add({
                type: 'dealer_registration',
                title: 'New Dealer Application',
                message: `${data.businessName} (${data.ownerName}) applied for dealership.`,
                userId: 'ADMIN',
                dealerId: user.uid,
                read: false,
                createdAt: serverTimestamp()
            });

            return { success: true, user, dealerId };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const profile = await Dealers.get(userCredential.user.uid);

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
                return { success: false, error: 'Account suspended. Contact admin.', status: 'Suspended' };
            }

            return { success: true, user: userCredential.user, profile };
        } catch (error) {
            return { success: false, error: mapAuthError(error) };
        }
    },

    resetPassword: (email) => sendPasswordResetEmail(auth, email).then(() => ({ success: true })).catch(e => ({ success: false, error: mapAuthError(e) })),

    logout: () => signOut(auth),

    getCurrentProfile: async () => {
        const user = auth.currentUser;
        if (!user) return null;
        return Dealers.get(user.uid);
    }
};

// ============================================================
// ADMIN AUTH (Custom — uses Firestore)
// ============================================================
const AdminAuth = {
    async verifyPassword(password) {
        try {
            const snap = await getDoc(doc(db, 'businessRules', 'adminAuth'));
            if (!snap.exists()) {
                return { success: false, error: 'Admin config not found' };
            }

            const config = snap.data();
            const hash = await sha256(password);

            if (hash !== config.passwordHash) {
                return { success: false, error: 'Invalid password' };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async generateOTP() {
        const otp = generateRandomOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await setDoc(doc(db, 'adminSessions', 'current-otp'), {
            otp,
            expiresAt: expiresAt.toISOString(),
            used: false,
            createdAt: serverTimestamp()
        });

        return otp;
    },

    async verifyOTP(inputOTP) {
        try {
            const ref = doc(db, 'adminSessions', 'current-otp');
            const snap = await getDoc(ref);

            if (!snap.exists()) return { success: false, error: 'No OTP found' };
            const data = snap.data();

            if (data.used) return { success: false, error: 'OTP already used' };
            if (new Date(data.expiresAt) < new Date()) return { success: false, error: 'OTP expired' };
            if (data.otp !== inputOTP.toUpperCase().trim()) return { success: false, error: 'Invalid OTP' };

            await setDoc(ref, { used: true }, { merge: true });

            const sessionId = 'ADMIN-' + Date.now();
            await setDoc(doc(db, 'adminSessions', sessionId), {
                sessionId,
                email: 'rajmarketingmys@gmail.com',
                createdAt: serverTimestamp(),
                expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                active: true
            });

            localStorage.setItem('raj_admin_session', JSON.stringify({
                sessionId,
                email: 'rajmarketingmys@gmail.com',
                expiresAt: Date.now() + 4 * 60 * 60 * 1000
            }));

            return { success: true, sessionId };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async checkSession() {
        try {
            const cached = JSON.parse(localStorage.getItem('raj_admin_session') || 'null');
            if (!cached) return false;
            if (Date.now() > cached.expiresAt) {
                localStorage.removeItem('raj_admin_session');
                return false;
            }

            const snap = await getDoc(doc(db, 'adminSessions', cached.sessionId));
            if (!snap.exists()) return false;
            const data = snap.data();
            if (!data.active) return false;
            if (new Date(data.expiresAt) < new Date()) return false;

            return true;
        } catch (e) {
            return false;
        }
    },

    async logout() {
        try {
            const cached = JSON.parse(localStorage.getItem('raj_admin_session') || 'null');
            if (cached?.sessionId) {
                await setDoc(doc(db, 'adminSessions', cached.sessionId), { active: false }, { merge: true });
            }
        } catch (e) {}

        localStorage.removeItem('raj_admin_session');
        window.location.href = 'admin-login.html';
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
async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function generateRandomOTP() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let otp = '';
    const array = new Uint32Array(6);
    crypto.getRandomValues(array);
    for (let i = 0; i < 6; i++) {
        otp += chars[array[i] % chars.length];
    }
    return otp;
}

function mapAuthError(error) {
    const messages = {
        'auth/email-already-in-use': 'This email is already registered. Try logging in.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/invalid-credential': 'Invalid email or password.'
    };
    return messages[error.code] || error.message;
}

// ============================================================
// EXPORT
// ============================================================
export {
    CustomerAuth,
    DealerAuth,
    AdminAuth,
    onAuthChange,
    sha256,
    generateRandomOTP
};

export default {
    CustomerAuth,
    DealerAuth,
    AdminAuth,
    onAuthChange
};
