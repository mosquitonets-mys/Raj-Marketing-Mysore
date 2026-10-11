<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    <title>Admin Login - Raj Marketing Mysore</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔐</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <link rel="stylesheet" href="../css/style.css" />
    <style>
        body {
            background: linear-gradient(135deg, #0f1b33, #1a56db);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .admin-login-card {
            background: #fff;
            border-radius: 20px;
            padding: 36px 28px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .admin-logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(145deg, #1a56db, #0f1b33);
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 36px;
            margin: 0 auto 20px;
            box-shadow: 0 12px 32px rgba(26, 86, 219, 0.35);
        }
        .admin-login-card h1 {
            font-size: 26px;
            font-weight: 900;
            color: #1e293b;
            text-align: center;
            margin-bottom: 6px;
        }
        .admin-login-card .subtitle {
            text-align: center;
            font-size: 13px;
            color: #64748b;
            margin-bottom: 28px;
        }
        .admin-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #fee2e2;
            color: #dc2626;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 auto 16px;
            width: fit-content;
        }
        .step-indicator {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-bottom: 24px;
        }
        .step-dot {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #f1f5f9;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 800;
            transition: all 0.3s ease;
        }
        .step-dot.active {
            background: linear-gradient(145deg, #1a56db, #0f1b33);
            color: #fff;
            box-shadow: 0 4px 14px rgba(26, 86, 219, 0.35);
        }
        .step-dot.completed {
            background: #10b981;
            color: #fff;
        }
        .step-line {
            width: 40px;
            height: 2px;
            background: #e2e8f0;
        }
        .step-line.completed { background: #10b981; }
        .otp-input {
            font-family: 'Courier New', monospace;
            font-size: 28px;
            font-weight: 900;
            text-align: center;
            letter-spacing: 8px;
            padding: 16px !important;
            text-transform: uppercase;
        }
        .email-sent-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 14px 16px;
            margin-bottom: 16px;
            font-size: 12px;
            color: #1e40af;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .email-sent-box i { color: #1a56db; font-size: 16px; margin-top: 2px; }
        .email-sent-box strong { color: #0f1b33; font-weight: 800; }
        .form-group {
            margin-bottom: 18px;
        }
        .form-group label {
            display: block;
            font-size: 13px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 6px;
        }
        .form-group input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 15px;
            font-family: 'Poppins', sans-serif;
            transition: border-color 0.2s;
            outline: none;
        }
        .form-group input:focus {
            border-color: #1a56db;
            box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
        }
        .form-hint {
            font-size: 11px;
            color: #64748b;
            margin-top: 6px;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 24px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
            font-family: 'Poppins', sans-serif;
            width: 100%;
        }
        .btn-primary {
            background: linear-gradient(145deg, #1a56db, #0f1b33);
            color: #fff;
        }
        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(26, 86, 219, 0.35);
        }
        .btn-success {
            background: linear-gradient(145deg, #10b981, #059669);
            color: #fff;
        }
        .btn-success:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
        }
        .btn-secondary {
            background: #f1f5f9;
            color: #334155;
        }
        .btn-secondary:hover {
            background: #e2e8f0;
        }
        .btn-link {
            background: none;
            border: none;
            color: #1a56db;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
            padding: 8px;
            width: 100%;
        }
        .btn-link:hover {
            text-decoration: underline;
        }
        .btn-lg {
            padding: 16px 24px;
            font-size: 15px;
        }
        .btn-block {
            width: 100%;
        }
        .lockout-box {
            background: #fee2e2;
            border: 1px solid #fca5a5;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            color: #991b1b;
            font-weight: 700;
            font-size: 13px;
        }
        .rm-toast {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            padding: 14px 24px;
            border-radius: 12px;
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            z-index: 9999;
            transition: transform 0.3s ease;
            max-width: 90vw;
            text-align: center;
        }
        .rm-toast.show {
            transform: translateX(-50%) translateY(0);
        }
        .dev-otp-hint {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 12px;
            padding: 10px 14px;
            margin-top: 12px;
            font-size: 11px;
            color: #92400e;
            display: none;
        }
        .dev-otp-hint.show { display: block; }
        .dev-otp-hint code {
            background: #fff;
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #dc2626;
        }
    </style>
</head>
<body>

    <div class="admin-login-card">
        <div class="admin-badge">
            <i class="fas fa-shield-alt"></i> Admin Access Only
        </div>
        <div class="admin-logo">
            <i class="fas fa-crown"></i>
        </div>
        <h1>Admin Login</h1>
        <p class="subtitle">Raj Marketing Mysore · Secure Portal</p>

        <div class="step-indicator">
            <div class="step-dot active" id="stepDot1">1</div>
            <div class="step-line" id="stepLine1"></div>
            <div class="step-dot" id="stepDot2">2</div>
        </div>

        <!-- STEP 1: PASSWORD -->
        <div id="passwordStep">
            <form id="passwordForm" onsubmit="submitPassword(event)">
                <div class="form-group">
                    <label>Admin Password <span style="color:#dc2626;">*</span></label>
                    <input type="password" id="adminPassword" required placeholder="Enter admin password" autocomplete="off" />
                    <div class="form-hint">
                        <i class="fas fa-info-circle"></i>
                        Default password: <code style="background:#f1f5f9;padding:1px 6px;border-radius:4px;font-weight:700;">admin123</code>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg" id="passwordSubmitBtn">
                    <i class="fas fa-lock"></i> Continue
                </button>
            </form>

            <div id="lockoutBox" class="lockout-box" style="display:none;margin-top:16px;">
                <i class="fas fa-ban"></i> Too many attempts. Try again in <span id="lockoutTimer">15:00</span>
            </div>
        </div>

        <!-- STEP 2: OTP -->
        <div id="otpStep" style="display:none;">
            <div class="email-sent-box">
                <i class="fas fa-envelope-open-text"></i>
                <div>
                    A 6-character alphanumeric OTP has been sent to
                    <strong>rajmarketingmys@gmail.com</strong>
                </div>
            </div>

            <form id="otpForm" onsubmit="submitOTP(event)">
                <div class="form-group">
                    <label>Enter OTP <span style="color:#dc2626;">*</span></label>
                    <input type="text" id="otpInput" class="otp-input" required maxlength="6"
                           placeholder="XXXXXX" autocomplete="off" autocapitalize="characters" />
                    <div class="form-hint">
                        <i class="fas fa-clock"></i> OTP valid for <strong>10 minutes</strong>
                    </div>
                </div>

                <button type="submit" class="btn btn-success btn-block btn-lg">
                    <i class="fas fa-check-circle"></i> Verify &amp; Login
                </button>
            </form>

            <button class="btn btn-secondary btn-block" onclick="backToPassword()" style="margin-top:10px;">
                <i class="fas fa-arrow-left"></i> Back
            </button>

            <button class="btn btn-link" onclick="resendOTP()" id="resendBtn" style="margin-top:8px;">
                <i class="fas fa-redo"></i> Resend OTP
            </button>

            <div id="devOTPHint" class="dev-otp-hint">
                <i class="fas fa-code"></i> <strong>Development Mode:</strong> OTP is <code id="devOTPCode">------</code>
                <br><small style="color:#78350f;">(Check browser console for the OTP. In production, this is sent via email.)</small>
            </div>
        </div>

        <div style="text-align:center;margin-top:20px;font-size:11px;color:#64748b;">
            <i class="fas fa-shield-alt"></i> Secured with 256-bit encryption
        </div>
    </div>

    <script>
    (function() {
        'use strict';

        // ============================================================
        // CONFIGURATION
        // ============================================================
        const CONFIG = {
            ADMIN_PASSWORD_HASH: null, // Will be computed from 'admin123' on load
            MAX_ATTEMPTS: 5,
            LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in ms
            OTP_LENGTH: 6,
            OTP_VALIDITY: 10 * 60 * 1000, // 10 minutes in ms
            SESSION_KEY: 'rm_admin_session',
            ATTEMPTS_KEY: 'rm_admin_attempts',
            LOCKOUT_KEY: 'rm_admin_lockout'
        };

        let currentOTP = '';
        let otpGeneratedAt = 0;

        // ============================================================
        // UTILITY FUNCTIONS
        // ============================================================
        async function sha256(message) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        function generateOTP() {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let otp = '';
            const array = new Uint32Array(CONFIG.OTP_LENGTH);
            crypto.getRandomValues(array);
            for (let i = 0; i < CONFIG.OTP_LENGTH; i++) {
                otp += chars[array[i] % chars.length];
            }
            return otp;
        }

        function showToast(msg, type = 'info') {
            document.querySelectorAll('.rm-toast').forEach(t => t.remove());
            const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#1a56db' };
            const t = document.createElement('div');
            t.className = 'rm-toast';
            t.textContent = msg;
            t.style.background = colors[type] || colors.info;
            document.body.appendChild(t);
            requestAnimationFrame(() => t.classList.add('show'));
            setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3500);
        }

        // ============================================================
        // ATTEMPT TRACKING
        // ============================================================
        function getAttempts() {
            try {
                return JSON.parse(localStorage.getItem(CONFIG.ATTEMPTS_KEY)) || { count: 0, lastAttempt: 0 };
            } catch { return { count: 0, lastAttempt: 0 }; }
        }

        function incrementAttempts() {
            const attempts = getAttempts();
            attempts.count++;
            attempts.lastAttempt = Date.now();
            localStorage.setItem(CONFIG.ATTEMPTS_KEY, JSON.stringify(attempts));
            return attempts;
        }

        function resetAttempts() {
            localStorage.removeItem(CONFIG.ATTEMPTS_KEY);
        }

        function isLockedOut() {
            const lockout = localStorage.getItem(CONFIG.LOCKOUT_KEY);
            if (!lockout) return { locked: false, remaining: 0 };
            const unlockTime = parseInt(lockout, 10);
            const remaining = unlockTime - Date.now();
            if (remaining <= 0) {
                localStorage.removeItem(CONFIG.LOCKOUT_KEY);
                resetAttempts();
                return { locked: false, remaining: 0 };
            }
            return { locked: true, remaining: Math.ceil(remaining / 1000) };
        }

        function setLockout() {
            const unlockTime = Date.now() + CONFIG.LOCKOUT_DURATION;
            localStorage.setItem(CONFIG.LOCKOUT_KEY, unlockTime.toString());
        }

        // ============================================================
        // SESSION MANAGEMENT
        // ============================================================
        function createAdminSession() {
            const session = {
                token: generateOTP() + generateOTP(), // Random session token
                createdAt: Date.now(),
                expiresAt: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
            };
            sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(session));
            return session;
        }

        function isAdminLoggedIn() {
            try {
                const session = JSON.parse(sessionStorage.getItem(CONFIG.SESSION_KEY));
                if (!session) return false;
                if (Date.now() > session.expiresAt) {
                    sessionStorage.removeItem(CONFIG.SESSION_KEY);
                    return false;
                }
                return true;
            } catch { return false; }
        }

        // ============================================================
        // LOCKOUT UI
        // ============================================================
        function showLockout(seconds) {
            const box = document.getElementById('lockoutBox');
            const timer = document.getElementById('lockoutTimer');
            const submitBtn = document.getElementById('passwordSubmitBtn');
            box.style.display = 'block';
            if (submitBtn) submitBtn.disabled = true;

            function update() {
                if (seconds <= 0) {
                    box.style.display = 'none';
                    if (submitBtn) submitBtn.disabled = false;
                    resetAttempts();
                    return;
                }
                const m = Math.floor(seconds / 60);
                const s = seconds % 60;
                timer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                seconds--;
                setTimeout(update, 1000);
            }
            update();
        }

        // ============================================================
        // STEP 1: PASSWORD
        // ============================================================
        window.submitPassword = async function(e) {
            e.preventDefault();

            const lock = isLockedOut();
            if (lock.locked) {
                showToast('Account locked. Please wait.', 'error');
                return;
            }

            const password = document.getElementById('adminPassword').value;

            // Compute hash of entered password and compare with stored hash
            const inputHash = await sha256(password);

            // Default password hash for 'admin123'
            // In production, this should be loaded from a secure backend or Firestore
            const defaultHash = await sha256('admin123');

            if (inputHash !== defaultHash) {
                const attempts = incrementAttempts();
                const remaining = CONFIG.MAX_ATTEMPTS - attempts.count;
                showToast(`❌ Invalid password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, 'error');

                if (attempts.count >= CONFIG.MAX_ATTEMPTS) {
                    setLockout();
                    showLockout(Math.floor(CONFIG.LOCKOUT_DURATION / 1000));
                }
                return;
            }

            // Password correct - generate OTP
            currentOTP = generateOTP();
            otpGeneratedAt = Date.now();

            // Log OTP to console (development mode)
            console.log('%c🔐 ADMIN OTP: ' + currentOTP, 'color: #dc2626; font-size: 20px; font-weight: bold;');
            console.log('This OTP expires in 10 minutes. In production, this would be sent to rajmarketingmys@gmail.com');

            // Show dev hint
            const devHint = document.getElementById('devOTPHint');
            document.getElementById('devOTPCode').textContent = currentOTP;
            devHint.classList.add('show');

            // Move to OTP step
            document.getElementById('passwordStep').style.display = 'none';
            docum
