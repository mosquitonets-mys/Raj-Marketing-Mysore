/* ============================================================
   LIVE VISITOR TRACKER
   Uses localStorage + sessionStorage for accurate simulation
   In production: replace with real Firebase counter calls
============================================================ */

(function() {
    'use strict';

    const KEYS = {
        LIVE: 'rm_live_visitors',
        WEEKLY: 'rm_weekly_visitors',
        MONTHLY: 'rm_monthly_visitors',
        TOTAL: 'rm_total_visitors',
        BOOKINGS: 'rm_live_bookings',
        CUSTOMERS: 'rm_total_customers',
        DEALERS: 'rm_total_dealers',
        LAST_VISIT: 'rm_last_visit_date',
        SESSION: 'rm_session_active'
    };

    const SEED = {
        LIVE: 12,
        WEEKLY: 340,
        MONTHLY: 1420,
        TOTAL: 18450,
        BOOKINGS: 28,
        CUSTOMERS: 512,
        DEALERS: 34
    };

    function getNumber(key, fallback) {
        const v = localStorage.getItem(key);
        return v ? parseInt(v, 10) : fallback;
    }

    function setNumber(key, value) {
        localStorage.setItem(key, String(value));
    }

    function getToday() {
        return new Date().toISOString().slice(0, 10);
    }

    // Initialize counters if first visit
    function initializeCounters() {
        if (!localStorage.getItem(KEYS.TOTAL)) {
            setNumber(KEYS.TOTAL, SEED.TOTAL);
            setNumber(KEYS.WEEKLY, SEED.WEEKLY);
            setNumber(KEYS.MONTHLY, SEED.MONTHLY);
            setNumber(KEYS.BOOKINGS, SEED.BOOKINGS);
            setNumber(KEYS.CUSTOMERS, SEED.CUSTOMERS);
            setNumber(KEYS.DEALERS, SEED.DEALERS);
        }
    }

    // Register this visit (once per session)
    function registerVisit() {
        const lastVisit = localStorage.getItem(KEYS.LAST_VISIT);
        const today = getToday();
        const isNewSession = !sessionStorage.getItem(KEYS.SESSION);

        if (isNewSession) {
            sessionStorage.setItem(KEYS.SESSION, '1');

            // Increment total
            setNumber(KEYS.TOTAL, getNumber(KEYS.TOTAL, SEED.TOTAL) + 1);

            // Increment monthly if new month
            if (!lastVisit || lastVisit.slice(0, 7) !== today.slice(0, 7)) {
                setNumber(KEYS.MONTHLY, SEED.MONTHLY + 1);
            }

            // Increment weekly (Mon-Sun)
            if (!lastVisit || !isSameWeek(lastVisit, today)) {
                setNumber(KEYS.WEEKLY, getNumber(KEYS.WEEKLY, SEED.WEEKLY) + 1);
            }

            localStorage.setItem(KEYS.LAST_VISIT, today);
        }
    }

    function isSameWeek(d1, d2) {
        const a = new Date(d1);
        const b = new Date(d2);
        const startA = new Date(a);
        startA.setDate(a.getDate() - a.getDay());
        const startB = new Date(b);
        startB.setDate(b.getDate() - b.getDay());
        return startA.toISOString().slice(0, 10) === startB.toISOString().slice(0, 10);
    }

    // Simulate live fluctuations
    function startLiveSimulation() {
        setInterval(() => {
            // Live visitors: fluctuate ±1-2
            let live = getNumber(KEYS.LIVE, SEED.LIVE);
            live += Math.random() < 0.5 ? -1 : 1;
            live = Math.max(3, Math.min(35, live));
            setNumber(KEYS.LIVE, live);
            updateDom('liveVisitors', live);

            // Live bookings: occasional increment
            if (Math.random() < 0.05) {
                const b = getNumber(KEYS.BOOKINGS, SEED.BOOKINGS) + 1;
                setNumber(KEYS.BOOKINGS, b);
                updateDom('liveBookings', b);
            }

            // Customers: occasional increment
            if (Math.random() < 0.02) {
                const c = getNumber(KEYS.CUSTOMERS, SEED.CUSTOMERS) + 1;
                setNumber(KEYS.CUSTOMERS, c);
                updateDom('totalCustomers', c);
            }

            // Dealers: rare increment
            if (Math.random() < 0.005) {
                const d = getNumber(KEYS.DEALERS, SEED.DEALERS) + 1;
                setNumber(KEYS.DEALERS, d);
                updateDom('totalDealers', d);
            }
        }, 3000);
    }

    function updateDom(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = value.toLocaleString('en-IN');
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 800);
    }

    function renderTicker() {
        const track = document.getElementById('liveTickerTrack');
        if (!track) return;

        const stats = [
            { id: 'liveVisitors', icon: 'fa-circle', label: 'Live Now', value: getNumber(KEYS.LIVE, SEED.LIVE) },
            { id: 'weeklyVisitors', icon: 'fa-calendar-week', label: 'This Week', value: getNumber(KEYS.WEEKLY, SEED.WEEKLY) },
            { id: 'monthlyVisitors', icon: 'fa-calendar-alt', label: 'This Month', value: getNumber(KEYS.MONTHLY, SEED.MONTHLY) },
            { id: 'totalVisitors', icon: 'fa-users', label: 'Total Visitors', value: getNumber(KEYS.TOTAL, SEED.TOTAL) },
            { id: 'liveBookings', icon: 'fa-shopping-cart', label: 'Bookings', value: getNumber(KEYS.BOOKINGS, SEED.BOOKINGS) },
            { id: 'totalCustomers', icon: 'fa-user-check', label: 'Customers', value: getNumber(KEYS.CUSTOMERS, SEED.CUSTOMERS) },
            { id: 'totalDealers', icon: 'fa-handshake', label: 'Dealers', value: getNumber(KEYS.DEALERS, SEED.DEALERS) },
            { id: 'citiesServed', icon: 'fa-map-marked-alt', label: 'Cities Served', value: 6 }
        ];

        // Duplicate for seamless loop
        const html = stats.map(s => `
            <span class="live-ticker-item">
                <i class="fas ${s.icon}"></i>
                ${s.label}: <span class="count" id="${s.id}">${s.value.toLocaleString('en-IN')}</span>
            </span>
        `).join('');

        track.innerHTML = html + html;
    }

    function init() {
        initializeCounters();
        registerVisit();
        renderTicker();
        startLiveSimulation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
