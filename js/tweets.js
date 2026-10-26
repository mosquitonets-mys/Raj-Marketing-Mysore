/* ============================================================
   TWITTER / X PINNED POSTS LOADER
   Uses official Twitter widget JS; falls back to custom cards
============================================================ */

(function () {
    'use strict';

    const TWEETS = [
        {
            id: '1359850685966082049',
            text: 'Protect your home from mosquitoes with our premium pleated mosquito nets. Custom-fit for every window and door. Serving Mysore & nearby.',
            tags: ['#mosquitonets', '#mysore', '#pleatednets'],
            date: 'Feb 12, 2021',
            pinned: true,
            stats: { likes: '0', retweets: '0', replies: '0' }
        },
        {
            id: '2099323883543515505',
            text: 'Raj Marketing Mysore — Pleatednets. Premium mosquito nets for windows & doors. 📍 Mysore, India. 🌐 rajmarketingmysore.info',
            tags: ['#mosquitonets', '#mysore'],
            date: 'Sep 14, 2026',
            pinned: true,
            stats: { likes: '0', retweets: '0', replies: '0' }
        }
    ];

    const X_PROFILE_URL = 'https://x.com/Mosquito_Nets_';

    // ---------- RENDER FALLBACK CARDS ----------
    function renderFallback() {
        const grid = document.getElementById('tweetsGrid');
        if (!grid) return;

        grid.innerHTML = TWEETS.map(function (t) {
            return (
                '<div class="tweet-card">' +
                    '<div class="tweet-fallback">' +
                        (t.pinned ? '<div class="tf-pinned"><i class="fas fa-thumbtack"></i> Pinned Post</div>' : '') +
                        '<div class="tf-header">' +
                            '<div class="tf-avatar">R</div>' +
                            '<div class="tf-author">' +
                                '<div class="tf-name">Raj Marketing Mysore <i class="fas fa-certificate" title="Verified"></i></div>' +
                                '<div class="tf-handle">@Mosquito_Nets_</div>' +
                            '</div>' +
                            '<i class="fab fa-x-twitter tf-x-logo"></i>' +
                        '</div>' +
                        '<div class="tf-body">' + t.text + '</div>' +
                        (t.tags.length ? '<div class="tf-tags">' + t.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>' : '') +
                        '<div class="tf-footer">' +
                            '<div class="tf-stats">' +
                                '<span class="tf-stat"><i class="fas fa-heart"></i> ' + t.stats.likes + '</span>' +
                                '<span class="tf-stat"><i class="fas fa-retweet"></i> ' + t.stats.retweets + '</span>' +
                                '<span class="tf-stat"><i class="fas fa-reply"></i> ' + t.stats.replies + '</span>' +
                            '</div>' +
                            '<a href="https://x.com/Mosquito_Nets_/status/' + t.id + '" target="_blank" rel="noopener" class="tf-view-link">' +
                                'View on X <i class="fas fa-external-link-alt"></i>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }).join('');
    }

    // ---------- TRY OFFICIAL EMBEDS ----------
    function tryTwitterEmbeds() {
        if (!window.twttr || !window.twttr.widgets) {
            renderFallback();
            return;
        }
        window.twttr.widgets.load(document.getElementById('tweetsSection'))
            .then(function () {
                // Check if embeds rendered
                setTimeout(function () {
                    const rendered = document.querySelectorAll('#tweetsGrid iframe.twitter-tweet').length;
                    if (rendered === 0) {
                        renderFallback();
                    }
                }, 1500);
            })
            .catch(function () {
                renderFallback();
            });
    }

    // ---------- LOAD TWITTER WIDGET SCRIPT ----------
    function loadTwitterWidget() {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = function () {
            // Give the widget a moment to initialize
            setTimeout(tryTwitterEmbeds, 500);
        };
        script.onerror = function () {
            // If twitter is blocked (ad blocker, offline), show fallback immediately
            renderFallback();
        };
        document.body.appendChild(script);
    }

    // ---------- INIT ----------
    function init() {
        if (!document.getElementById('tweetsSection')) return;

        // Show loading state first
        const grid = document.getElementById('tweetsGrid');
        if (grid) {
            grid.innerHTML =
                '<div class="tweets-loading" style="grid-column: 1 / -1;">' +
                    '<i class="fas fa-spinner"></i> Loading latest posts...' +
                '</div>';
        }

        // After 2.5 seconds, if official embeds haven't appeared, use fallback
        const fallbackTimer = setTimeout(function () {
            const rendered = document.querySelectorAll('#tweetsGrid iframe.twitter-tweet').length;
            if (rendered === 0) {
                renderFallback();
            }
        }, 2500);

        // Try official Twitter widget
        loadTwitterWidget();

        // Clear fallback timer if widget loads first
        window.addEventListener('load', function () {
            setTimeout(function () {
                const rendered = document.querySelectorAll('#tweetsGrid iframe.twitter-tweet').length;
                if (rendered > 0) {
                    clearTimeout(fallbackTimer);
                }
            }, 3000);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
