/* ============================================================
   VISITOR TRACKING SYSTEM
   Raj Marketing Mysore
   - Daily, weekly, monthly counts
   - Unique visitors (by fingerprint)
   - Page views
   - Session tracking
============================================================ */

(function() {
    'use strict';

    // ============================================================
    // FINGERPRINT (for unique visitor detection)
    // ============================================================
    function getFingerprint() {
        let fp = localStorage.getItem('raj_visitor_fp');
        if (fp) return fp;

        const data = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 0,
            navigator.platform || '',
            Math.random().toString(36).substring(2)
        ].join('|');

        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data.charCodeAt(i);
            hash |= 0;
        }
        fp = 'V-' + Math.abs(hash).toString(36).substring(0, 10).toUpperCase();
        localStorage.setItem('raj_visitor_fp', fp);
        return fp;
    }

    // ============================================================
    // DATE HELPERS
    // ============================================================
    function getDateKey(d = new Date()) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function getWeekKey(d = new Date()) {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        return 'W-' + getDateKey(monday);
    }

    function getMonthKey(d = new Date()) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    // ============================================================
    // TRACK VISIT
    // ============================================================
    function trackVisit() {
        // Skip if already tracked in this session
        if (sessionStorage.getItem('raj_visit_tracked')) return;
        sessionStorage.setItem('raj_visit_tracked', '1');

        try {
            const fp = getFingerprint();
            const today = getDateKey();
            const week = getWeekKey();
            const month = getMonthKey();
            const now = new Date().toISOString();
            const page = window.location.pathname.split('/').pop() || 'index.html';

            // Load existing data
            const data = JSON.parse(localStorage.getItem('raj_visitor_data') || '{}');
            data.daily = data.daily || {};
            data.weekly = data.weekly || {};
            data.monthly = data.monthly || {};
            data.uniqueVisitors = data.uniqueVisitors || {};
            data.pages = data.pages || {};
            data.sessions = data.sessions || [];
            data.totalViews = (data.totalViews || 0) + 1;

            // ===== DAILY =====
            if (!data.daily[today]) {
                data.daily[today] = { views: 0, unique: {}, pages: {} };
            }
            data.daily[today].views++;
            data.daily[today].unique[fp] = true;
            data.daily[today].pages[page] = (data.daily[today].pages[page] || 0) + 1;

            // ===== WEEKLY =====
            if (!data.weekly[week]) {
                data.weekly[week] = { views: 0, unique: {} };
            }
            data.weekly[week].views++;
            data.weekly[week].unique[fp] = true;

            // ===== MONTHLY =====
            if (!data.monthly[month]) {
                data.monthly[month] = { views: 0, unique: {} };
            }
            data.monthly[month].views++;
            data.monthly[month].unique[fp] = true;

            // ===== UNIQUE VISITOR =====
            if (!data.uniqueVisitors[fp]) {
                data.uniqueVisitors[fp] = {
                    firstSeen: now,
                    lastSeen: now,
                    visits: 0
                };
            }
            data.uniqueVisitors[fp].lastSeen = now;
            data.uniqueVisitors[fp].visits++;

            // ===== PAGE COUNTS =====
            data.pages[page] = (data.pages[page] || 0) + 1;

            // ===== SESSION LOG =====
            data.sessions.push({
                fingerprint: fp,
                page: page,
                timestamp: now,
                userAgent: navigator.userAgent.substring(0, 100)
            });

            // Keep only last 500 sessions
            if (data.sessions.length > 500) {
                data.sessions = data.sessions.slice(-500);
            }

            // Keep only last 90 days of daily data
            const dailyKeys = Object.keys(data.daily).sort();
            if (dailyKeys.length > 90) {
                dailyKeys.slice(0, dailyKeys.length - 90).forEach(k => delete data.daily[k]);
            }

            localStorage.setItem('raj_visitor_data', JSON.stringify(data));
        } catch (e) {
            console.warn('Visitor tracking error:', e);
        }
    }

    // ============================================================
    // GET ANALYTICS
    // ============================================================
    function getAnalytics() {
        try {
            const data = JSON.parse(localStorage.getItem('raj_visitor_data') || '{}');
            const today = getDateKey();
            const week = getWeekKey();
            const month = getMonthKey();

            const daily = data.daily || {};
            const weekly = data.weekly || {};
            const monthly = data.monthly || {};
            const uniqueVisitors = data.uniqueVisitors || {};
            const pages = data.pages || {};

            const todayData = daily[today] || { views: 0, unique: {} };
            const weekData = weekly[week] || { views: 0, unique: {} };
            const monthData = monthly[month] || { views: 0, unique: {} };

            // Last 7 days
            const last7Days = [];
            const last30Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = getDateKey(d);
                last7Days.push({
                    date: key,
                    label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
                    views: (daily[key]?.views) || 0,
                    unique: Object.keys(daily[key]?.unique || {}).length
                });
            }
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = getDateKey(d);
                last30Days.push({
                    date: key,
                    views: (daily[key]?.views) || 0,
                    unique: Object.keys(daily[key]?.unique || {}).length
                });
            }

            // Top pages
            const topPages = Object.entries(pages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([page, count]) => ({ page, count }));

            return {
                today: {
                    views: todayData.views || 0,
                    unique: Object.keys(todayData.unique || {}).length
                },
                week: {
                    views: weekData.views || 0,
                    unique: Object.keys(weekData.unique || {}).length
                },
                month: {
                    views: monthData.views || 0,
                    unique: Object.keys(monthData.unique || {}).length
                },
                total: {
                    views: data.totalViews || 0,
                    unique: Object.keys(uniqueVisitors).length
                },
                last7Days,
                last30Days,
                topPages,
                sessions: (data.sessions || []).slice(-20).reverse()
            };
        } catch (e) {
            return {
                today: { views: 0, unique: 0 },
                week: { views: 0, unique: 0 },
                month: { views: 0, unique: 0 },
                total: { views: 0, unique: 0 },
                last7Days: [],
                last30Days: [],
                topPages: [],
                sessions: []
            };
        }
    }

    // ============================================================
    // RESET ANALYTICS
    // ============================================================
    function resetAnalytics() {
        localStorage.removeItem('raj_visitor_data');
    }

    // ============================================================
    // PUBLIC API
    // ============================================================
    window.VisitorTracker = {
        track: trackVisit,
        getAnalytics: getAnalytics,
        reset: resetAnalytics,
        getFingerprint: getFingerprint
    };

    // Auto-track on every page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisit);
    } else {
        trackVisit();
    }

    console.log('%c📊 Visitor Tracker Active', 'color:#10b981;font-weight:bold;');
})();
