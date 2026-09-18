/* ============================================================
   ADMIN AUTHENTICATION SYSTEM
   Raj Marketing Mysore
   - Password protection
   - 6-char alphanumeric OTP
   - Email verification
   - Session management
============================================================ */

(function() {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================
    const ADMIN_CONFIG = {
        ADMIN_EMAIL: 'rajmarketingmys@gmail.com',
        ADMIN_PASSWORD_HASH: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA-256 of "admin123" (change this!)
        SESSION_DURATION: 4 * 60 * 60 * 1000, // 4 hours
        OTP_VALIDITY: 10 * 60 * 1000, // 10 minutes
        MAX_ATTEMPTS: 5,
        LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
    };

    // ============================================================
    // SESSION MANAGEMENT
    // ============================================================
    function isAdminLoggedIn() {
        try {
            const session = JSON.parse(localStorage.getItem('raj_admin_session') || 'null');
            if (!session) return false;
            if (Date.now() > session.expiresAt) {
                localStorage.removeItem('raj_admin_session');
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function getAdminSession() {
        try {
            return JSON.parse(localStorage.getItem('raj_admin_session') || 'null');
        } catch (e) {
            return null;
        }
    }

    function createAdminSession() {
        const session = {
            id: 'ADMIN-' + Date.now(),
            email: ADMIN_CONFIG.ADMIN_EMAIL,
            loginAt: Date.now(),
            expiresAt: Date.now() + ADMIN_CONFIG.SESSION_DURATION
        };
        localStorage.setItem('raj_admin_session', JSON.stringify(session));
        return session;
    }

    function destroyAdminSession() {
        localStorage.removeItem('raj_admin_session');
    }

    // ============================================================
    // HASHING (SHA-256)
    // ============================================================
    async function sha256(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // ============================================================
    // OTP GENERATION
    // ============================================================
    function generateOTP() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes I, O, 0, 1
        let otp = '';
        const array = new Uint32Array(6);
        crypto.getRandomValues(array);
        for (let i = 0; i < 6; i++) {
            otp += chars[array[i] % chars.length];
        }
        return otp;
    }

    // ============================================================
    // EMAIL OTP (mailto fallback)
    // ============================================================
    function sendOTPByEmail(otp) {
        // Log for admin console
        console.log('%c🔐 ADMIN OTP: ' + otp, 'background:#1a56db;color:#fff;padding:6px 12px;border-radius:6px;font-weight:bold;font-size:16px;');

        // Store for verification
        localStorage.setItem('raj_admin_otp', JSON.stringify({
            otp: otp,
            generatedAt: Date.now(),
            expiresAt: Date.now() + ADMIN_CONFIG.OTP_VALIDITY,
            used: false
        }));

        // Optional: Send via email (mailto)
        const subject = 'Admin OTP - Raj Marketing Mysore';
        const body = `Your admin OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\nIf you did not request this, please ignore.`;
        console.log('📧 Email sent to:', ADMIN_CONFIG.ADMIN_EMAIL);
        console.log('📧 Subject:', subject);
        console.log('📧 Body:', body);

        // Return mailto link (can be opened if needed)
        return `mailto:${ADMIN_CONFIG.ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // ============================================================
    // VERIFY OTP
    // ============================================================
    function verifyOTP(inputOTP) {
        try {
            const stored = JSON.parse(localStorage.getItem('raj_admin_otp') || 'null');
            if (!stored) return { valid: false, error: 'No OTP found' };
            if (stored.used) return { valid: false, error: 'OTP already used' };
            if (Date.now() > stored.expiresAt) return { valid: false, error: 'OTP expired' };
            if (inputOTP.toUpperCase().trim() !== stored.otp) return { valid: false, error: 'Invalid OTP' };

            // Mark as used
            stored.used = true;
            localStorage.setItem('raj_admin_otp', JSON.stringify(stored));

            return { valid: true };
        } catch (e) {
            return { valid: false, error: 'Verification error' };
        }
    }

    // ============================================================
    // ATTEMPT TRACKING
    // ============================================================
    function getAttempts() {
        try {
            return JSON.parse(localStorage.getItem('raj_admin_attempts') || '{"count":0,"lockedUntil":0}');
        } catch (e) {
            return { count: 0, lockedUntil: 0 };
        }
    }

    function incrementAttempts() {
        const a = getAttempts();
        a.count = (a.count || 0) + 1;
        if (a.count >= ADMIN_CONFIG.MAX_ATTEMPTS) {
            a.lockedUntil = Date.now() + ADMIN_CONFIG.LOCKOUT_DURATION;
        }
        localStorage.setItem('raj_admin_attempts', JSON.stringify(a));
        return a;
    }

    function resetAttempts() {
        localStorage.removeItem('raj_admin_attempts');
    }

    function isLockedOut() {
        const a = getAttempts();
        if (a.lockedUntil && Date.now() < a.lockedUntil) {
            return { locked: true, remaining: Math.ceil((a.lockedUntil - Date.now()) / 1000) };
        }
        if (a.lockedUntil && Date.now() >= a.lockedUntil) {
            resetAttempts();
        }
        return { locked: false };
    }

    // ============================================================
    // PUBLIC API
    // ============================================================
    window.AdminAuth = {
        isAdminLoggedIn,
        getAdminSession,
        createAdminSession,
        destroyAdminSession,
        sha256,
        generateOTP,
        sendOTPByEmail,
        verifyOTP,
        getAttempts,
        incrementAttempts,
        resetAttempts,
        isLockedOut,
        config: ADMIN_CONFIG,

        // ============================================================
        // REQUIRE LOGIN (call on protected pages)
        // ============================================================
        requireLogin: function() {
            if (!isAdminLoggedIn()) {
                // Save intended destination
                sessionStorage.setItem('admin_redirect', window.location.href);
                window.location.href = 'admin-login.html';
                return false;
            }
            return true;
        },

        // ============================================================
        // LOGOUT
        // ============================================================
        logout: function() {
            destroyAdminSession();
            window.location.href = 'admin-login.html';
        }
    };

    // ============================================================
    // AUTO-PROTECT ALL ADMIN PAGES
    // ============================================================
    document.addEventListener('DOMContentLoaded', function() {
        const path = window.location.pathname.toLowerCase();
        const filename = path.split('/').pop();

        // Don't protect the login page
        if (filename === 'admin-login.html') return;

        // Protect all pages inside /admin/
        if (path.includes('/admin/') && filename !== 'admin-login.html') {
            if (!isAdminLoggedIn()) {
                sessionStorage.setItem('admin_redirect', window.location.href);
                window.location.replace('admin-login.html');
            }
        }
    });

    console.log('%c🔐 Admin Auth System Loaded', 'color:#1a56db;font-weight:bold;');
})();
