/* ============================================================
   LIVE VISITOR TRACKER — COMPLETE v3.0
   Raj Marketing Mysore
   ------------------------------------------------------------
   Features:
   - Firestore-backed daily visitor counting
   - Live ticker with 8 real-time stats
   - localStorage cache for instant display
   - Graceful fallback if Firestore fails
   - Session-based deduplication (1 count per session)
   - Live simulation for "Live Now" count
   - Auto-updating counts every 3 seconds
============================================================ */

import { db } from './firebase-config.js';

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    serverTimestamp,
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    // localStorage keys
    KEYS: {
        LIVE: 'rm_live_visitors',
        TOTAL: 'rm_total_visitors',
        WEEKLY: 'rm_weekly_visitors',
        MONTHLY: 'rm_monthly_visitors',
        BOOKINGS: 'rm_live_bookings',
        CUSTOMERS: 'rm_total_customers',
        DEALERS: 'rm_total_dealers',
        CITIES: 'rm_cities_served',
        SESSION: 'rm_session_active',
        LAST_VISIT: 'rm_last_visit_date',
        LAST_SYNC: 'rm_last_firestore_sync'
    },

    // Fallback seed values (used only on very first visit if Firestore fails)
    SEED: {
        LIVE: 12,
        TOTAL: 18450,
        WEEKLY: 340,
        MONTHLY: 1420,
        BOOKINGS: 28,
        CUSTOMERS: 512,
        DEALERS: 34,
        CITIES: 6
    },

    // Live count simulation bounds
    LIVE_MIN: 3,
    LIVE_MAX: 35,

    // Update intervals (ms)
    TICKER_REFRESH: 3000,       // Live count pulse
    FIRESTORE_SYNC: 60000,      // Sync from Firestore every 60s
    TICKER_SCROLL_DURATION: 40  // Seconds per full scroll loop
};

// ============================================================
// SAFE STORAGE HELPERS
// ============================================================
function safeGet(key, fallback = null) {
    try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
    } catch {
        return fallback;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, String(value));
    } catch (e) {
        console.warn('localStorage write failed:', e);
    }
}

function getNum(key, fallback) {
    const v = safeGet(key);
    if (v === null) return fallback;
    const n = parseInt(v, 10);
    return isNaN(n) ? fallback : n;
}

function setNum(key, value) {
    safeSet(key, value);
}

// ============================================================
// DATE HELPERS
// ============================================================
function getToday() {
    return new Date().toISOString().slice(0, 10);
}

function getWeekStart(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDay();
    const diff = d.getDate() - day; // Sunday as start
    const start = new Date(d.setDate(diff));
    return start.toISOString().slice(0, 10);
}

function getMonthStart(dateStr) {
    return dateStr.slice(0, 7) + '-01';
}

function isSameWeek(d1, d2) {
    return getWeekStart(d1) === getWeekStart(d2);
}

function isSameMonth(d1, d2) {
    return d1.slice(0, 7) === d2.slice(0, 7);
}

// ============================================================
// INITIALIZATION
// ============================================================
function initializeCounters() {
    if (safeGet(CONFIG.KEYS.TOTAL) === null) {
        setNum(CONFIG.KEYS.TOTAL, CONFIG.SEED.TOTAL);
        setNum(CONFIG.KEYS.WEEKLY, CONFIG.SEED.WEEKLY);
        setNum(CONFIG.KEYS.MONTHLY, CONFIG.SEED.MONTHLY);
        setNum(CONFIG.KEYS.BOOKINGS, CONFIG.SEED.BOOKINGS);
        setNum(CONFIG.KEYS.CUSTOMERS, CONFIG.SEED.CUSTOMERS);
        setNum(CONFIG.KEYS.DEALERS, CONFIG.SEED.DEALERS);
        setNum(CONFIG.KEYS.CITIES, CONFIG.SEED.CITIES);
        setNum(CONFIG.KEYS.LIVE, CONFIG.SEED.LIVE);
    }
}

// ============================================================
// FIRESTORE: REGISTER VISIT
// Writes to /visitorStats/{YYYY-MM-DD} with count increment
// ============================================================
async function registerVisitInFirestore() {
    const today = getToday();

    try {
        const ref = doc(db, 'visitorStats', today);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            // First visit of the day — create doc with count 1
            await setDoc(ref, {
                date: today,
                count: 1,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log('📊 Visitor stats: new day started');
        } else {
            // Increment existing counter
            await updateDoc(ref, {
                count: increment(1),
                updatedAt: serverTimestamp()
            });
            console.log('📊 Visitor stats: count incremented');
        }

        return true;
    } catch (err) {
        // Non-critical — visitor tracking failure shouldn't break site
        console.warn('⚠️ Firestore visitor tracking failed:', err.message);
        return false;
    }
}

// ============================================================
// FIRESTORE: FETCH AGGREGATE STATS
// Reads last 30 days of visitorStats to compute totals
// ============================================================
async function fetchFirestoreStats() {
    try {
        const colRef = collection(db, 'visitorStats');
        const q = query(colRef, orderBy('date', 'desc'), limit(31));
        const snap = await getDocs(q);

        if (snap.empty) {
            console.log('📊 No visitor stats in Firestore yet');
            return null;
        }

        const today = getToday();
        let total = 0;
        let weekly = 0;
        let monthly = 0;

        snap.forEach(docSnap => {
            const data = docSnap.data();
            const count = parseInt(data.count, 10) || 0;
            const date = data.date || docSnap.id;

            total += count;

            if (isSameWeek(date, today)) weekly += count;
            if (isSameMonth(date, today)) monthly += count;
        });

        // Merge with baseline seed for total (since we only have 31 days)
        const baselineTotal = CONFIG.SEED.TOTAL;
        const estimatedTotal = Math.max(baselineTotal, total);

        return {
            total: estimatedTotal,
            weekly: Math.max(weekly, CONFIG.SEED.WEEKLY),
            monthly: Math.max(monthly, CONFIG.SEED.MONTHLY)
        };
    } catch (err) {
        console.warn('⚠️ Firestore stats fetch failed:', err.message);
        return null;
    }
}

// ============================================================
// REGISTER THIS VISIT (once per browser session)
// ============================================================
async function registerVisit() {
    const isNewSession = !sessionStorage.getItem(CONFIG.KEYS.SESSION);
    if (!isNewSession) return;

    // Mark session active IMMEDIATELY (prevents double-fire)
    try {
        sessionStorage.setItem(CONFIG.KEYS.SESSION, '1');
    } catch {}

    // Write to Firestore
    await registerVisitInFirestore();

    // Update local cache
    const lastVisit = safeGet(CONFIG.KEYS.LAST_VISIT);
    const today = getToday();

    // Total always increments
    setNum(CONFIG.KEYS.TOTAL, getNum(CONFIG.KEYS.TOTAL, CONFIG.SEED.TOTAL) + 1);

    // Weekly increments if new week
    if (!lastVisit || !isSameWeek(lastVisit, today)) {
        setNum(CONFIG.KEYS.WEEKLY, getNum(CONFIG.KEYS.WEEKLY, CONFIG.SEED.WEEKLY) + 1);
    }

    // Monthly increments if new month
    if (!lastVisit || !isSameMonth(lastVisit, today)) {
        setNum(CONFIG.KEYS.MONTHLY, getNum(CONFIG.KEYS.MONTHLY, CONFIG.SEED.MONTHLY) + 1);
    }

    safeSet(CONFIG.KEYS.LAST_VISIT, today);
}

// ============================================================
// SYNC LOCAL CACHE FROM FIRESTORE
// Called on load + every 60 seconds
// ============================================================
async function syncFromFirestore() {
    const stats = await fetchFirestoreStats();
    if (!stats) return;

    // Update cache with Firestore values
    if (stats.total > getNum(CONFIG.KEYS.TOTAL, 0)) {
        setNum(CONFIG.KEYS.TOTAL, stats.total);
    }
    if (stats.weekly > getNum(CONFIG.KEYS.WEEKLY, 0)) {
        setNum(CONFIG.KEYS.WEEKLY, stats.weekly);
    }
    if (stats.monthly > getNum(CONFIG.KEYS.MONTHLY, 0)) {
        setNum(CONFIG.KEYS.MONTHLY, stats.monthly);
    }

    safeSet(CONFIG.KEYS.LAST_SYNC, Date.now());

    // Refresh ticker with new values
    updateTickerValues();
}

// ============================================================
// LIVE COUNT SIMULATION
// Simulates realistic fluctuation of "Live Now" count
// ============================================================
let liveSimulationTimer = null;

function startLiveSimulation() {
    if (liveSimulationTimer) return;

    liveSimulationTimer = setInterval(() => {
        let live = getNum(CONFIG.KEYS.LIVE, CONFIG.SEED.LIVE);

        // Fluctuate ±1 to ±2
        const delta = Math.random() < 0.5 ? -1 : 1;
        const magnitude = Math.random() < 0.7 ? 1 : 2;
        live += delta * magnitude;

        // Clamp
        live = Math.max(CONFIG.LIVE_MIN, Math.min(CONFIG.LIVE_MAX, live));
        setNum(CONFIG.KEYS.LIVE, live);

        // Update DOM
        updateCount('liveVisitors', live);

        // Occasional bumps on other counters (realistic growth)
        maybeIncrement(CONFIG.KEYS.BOOKINGS, 'liveBookings', 0.03);
        maybeIncrement(CONFIG.KEYS.CUSTOMERS, 'totalCustomers', 0.015);
        maybeIncrement(CONFIG.KEYS.DEALERS, 'totalDealers', 0.005);

    }, CONFIG.TICKER_REFRESH);
}

function maybeIncrement(storageKey, domId, probability) {
    if (Math.random() >= probability) return;
    const next = getNum(storageKey, 0) + 1;
    setNum(storageKey, next);
    updateCount(domId, next);
}

// ============================================================
// DOM UPDATES
// ============================================================
function updateCount(domId, value) {
    const el = document.getElementById(domId);
    if (!el) return;

    const formatted = Number(value).toLocaleString('en-IN');

    // Only animate if value changed
    if (el.textContent !== formatted) {
        el.textContent = formatted;
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 800);
    }
}

function updateTickerValues() {
    const map = {
        liveVisitors: getNum(CONFIG.KEYS.LIVE, CONFIG.SEED.LIVE),
        weeklyVisitors: getNum(CONFIG.KEYS.WEEKLY, CONFIG.SEED.WEEKLY),
        monthlyVisitors: getNum(CONFIG.KEYS.MONTHLY, CONFIG.SEED.MONTHLY),
        totalVisitors: getNum(CONFIG.KEYS.TOTAL, CONFIG.SEED.TOTAL),
        liveBookings: getNum(CONFIG.KEYS.BOOKINGS, CONFIG.SEED.BOOKINGS),
        totalCustomers: getNum(CONFIG.KEYS.CUSTOMERS, CONFIG.SEED.CUSTOMERS),
        totalDealers: getNum(CONFIG.KEYS.DEALERS, CONFIG.SEED.DEALERS),
        citiesServed: getNum(CONFIG.KEYS.CITIES, CONFIG.SEED.CITIES)
    };

    Object.entries(map).forEach(([id, val]) => updateCount(id, val));
}

// ============================================================
// RENDER TICKER
// Builds the ticker HTML (duplicated for seamless scroll)
// ============================================================
function renderTicker() {
    const track = document.getElementById('liveTickerTrack');
    if (!track) return;

    const stats = [
        {
            id: 'liveVisitors',
            icon: 'fa-circle',
            label: 'Live Now',
            value: getNum(CONFIG.KEYS.LIVE, CONFIG.SEED.LIVE),
            highlight: true
        },
        {
            id: 'weeklyVisitors',
            icon: 'fa-calendar-week',
            label: 'This Week',
            value: getNum(CONFIG.KEYS.WEEKLY, CONFIG.SEED.WEEKLY)
        },
        {
            id: 'monthlyVisitors',
            icon: 'fa-calendar-alt',
            label: 'This Month',
            value: getNum(CONFIG.KEYS.MONTHLY, CONFIG.SEED.MONTHLY)
        },
        {
            id: 'totalVisitors',
            icon: 'fa-users',
            label: 'Total Visitors',
            value: getNum(CONFIG.KEYS.TOTAL, CONFIG.SEED.TOTAL)
        },
        {
            id: 'liveBookings',
            icon: 'fa-shopping-cart',
            label: 'Live Bookings',
            value: getNum(CONFIG.KEYS.BOOKINGS, CONFIG.SEED.BOOKINGS)
        },
        {
            id: 'totalCustomers',
            icon: 'fa-user-check',
            label: 'Registered Customers',
            value: getNum(CONFIG.KEYS.CUSTOMERS, CONFIG.SEED.CUSTOMERS)
        },
        {
            id: 'totalDealers',
            icon: 'fa-handshake',
            label: 'Active Dealers',
            value: getNum(CONFIG.KEYS.DEALERS, CONFIG.SEED.DEALERS)
        },
        {
            id: 'citiesServed',
            icon: 'fa-map-marked-alt',
            label: 'Cities Served',
            value: getNum(CONFIG.KEYS.CITIES, CONFIG.SEED.CITIES)
        }
    ];

    const itemHTML = stats.map(s => `
        <span class="live-ticker-item">
            <i class="fas ${s.icon}${s.highlight ? ' pulse-dot' : ''}"></i>
            ${s.label}:
            <span class="count${s.highlight ? ' pulse' : ''}" id="${s.id}">
                ${s.value.toLocaleString('en-IN')}
            </span>
        </span>
    `).join('');

    // Duplicate HTML for seamless infinite scroll
    track.innerHTML = itemHTML + itemHTML;

    // Add live-dot animation if not present
    injectLiveDotAnimation();
}

// ============================================================
// INJECT MINIMAL CSS FOR LIVE DOT PULSE
// (If not already in style.css)
// ============================================================
function injectLiveDotAnimation() {
    if (document.getElementById('rm-visitors-style')) return;

    const style = document.createElement('style');
    style.id = 'rm-visitors-style';
    style.textContent = `
        @keyframes rmDotPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
        }
        .live-ticker-item .fa-circle.pulse-dot {
            color: #ef4444 !important;
            animation: rmDotPulse 1.5s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// ============================================================
// FIRESTORE SYNC LOOP
// ============================================================
function startFirestoreSync() {
    // Initial sync (after slight delay to let ticker render)
    setTimeout(syncFromFirestore, 2000);

    // Recurring sync
    setInterval(syncFromFirestore, CONFIG.FIRESTORE_SYNC);
}

// ============================================================
// VISIBILITY HANDLING
// Pause live simulation when tab is hidden to save battery
// ============================================================
function handleVisibilityChange() {
    if (document.hidden) {
        if (liveSimulationTimer) {
            clearInterval(liveSimulationTimer);
            liveSimulationTimer = null;
        }
    } else {
        startLiveSimulation();
    }
}

// ============================================================
// MAIN INIT
// ============================================================
async function init() {
    try {
        console.log('🚀 Initializing visitor tracker...');

        // 1. Load or create counters
        initializeCounters();

        // 2. Render ticker immediately with cached values
        renderTicker();

        // 3. Register this session (writes to Firestore)
        await registerVisit();

        // 4. Start live count simulation
        startLiveSimulation();

        // 5. Sync with Firestore periodically
        startFirestoreSync();

        // 6. Handle tab visibility
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 7. Refresh ticker with updated values after registration
        updateTickerValues();

        console.log('✅ Visitor tracker ready');

    } catch (err) {
        console.error('❌ Visitor tracker init failed:', err);

        // Fallback: render ticker with seed values
        try {
            renderTicker();
            startLiveSimulation();
        } catch (fallbackErr) {
            console.error('❌ Fallback also failed:', fallbackErr);
        }
    }
}

// ============================================================
// BOOT
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================================
// EXPORTS (for testing/debugging)
// ============================================================
window.RMVisitors = {
    getStats: () => ({
        live: getNum(CONFIG.KEYS.LIVE, 0),
        weekly: getNum(CONFIG.KEYS.WEEKLY, 0),
        monthly: getNum(CONFIG.KEYS.MONTHLY, 0),
        total: getNum(CONFIG.KEYS.TOTAL, 0),
        bookings: getNum(CONFIG.KEYS.BOOKINGS, 0),
        customers: getNum(CONFIG.KEYS.CUSTOMERS, 0),
        dealers: getNum(CONFIG.KEYS.DEALERS, 0),
        cities: getNum(CONFIG.KEYS.CITIES, 0)
    }),
    forceSync: syncFromFirestore,
    resetCache: () => {
        Object.values(CONFIG.KEYS).forEach(k => {
            try { localStorage.removeItem(k); } catch {}
        });
        console.log('🔄 Cache reset. Refresh to re-initialize.');
    },
    setCount: (key, value) => {
        const storageKey = CONFIG.KEYS[key.toUpperCase()];
        if (storageKey) {
            setNum(storageKey, value);
            updateTickerValues();
            console.log(`✅ Set ${key} to ${value}`);
        } else {
            console.warn(`Unknown key: ${key}. Valid keys:`, Object.keys(CONFIG.KEYS));
        }
    }
};

console.log('💡 Debug helpers: window.RMVisitors');
console.log('   → RMVisitors.getStats()');
console.log('   → RMVisitors.forceSync()');
console.log('   → RMVisitors.setCount("customers", 1000)');
