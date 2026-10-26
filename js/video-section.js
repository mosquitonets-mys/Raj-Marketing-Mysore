/* ============================================================
   YOUTUBE SHORTS VIDEO SLIDER — FULL-PLAY AUTO-ADVANCE
   Version 3.0 — Uses YouTube IFrame API to detect video end
============================================================ */

(function () {
    'use strict';

    // ---------- CONFIG ----------
    const VIDEO_DATA = [
        { id: 'eFg5rOZrpgM', title: 'Premium Mosquito Net Installation', tag: 'Installation' },
        { id: 'UbjG32ul0A0', title: 'Velcro Net Fitting — Live Demo', tag: 'Velcro' },
        { id: 'HXASWHy40AE', title: 'Pleated Net in Action', tag: 'Pleated' },
        { id: 'OQf5gZ99M98', title: 'Aluminium Frame Window Net', tag: 'Aluminium' },
        { id: 'cwNTPYkTsKs', title: 'Sliding Door Net — Perfect Fit', tag: 'Sliding' },
        { id: 'wn14Zkn7jlc', title: 'SS Mesh Protection Showcase', tag: 'SS Mesh' },
        { id: 'aSAoNgIsj_0', title: 'Professional Measurement Visit', tag: 'Service' },
        { id: 'CW1IAqdnq20', title: 'Security Screen for Doors', tag: 'Security' },
        { id: '_CtBTE6Kgcc', title: 'Customer Review — Mysore', tag: 'Review' },
        { id: '4hxo9zDCtdc', title: 'Before & After Transformation', tag: 'Transform' }
    ];

    const CARD_GAP = 18;
    const AUTO_NEXT_DELAY_MS = 900; // small pause before sliding to next

    // ---------- STATE ----------
    let currentIndex = 0;
    let maxIndex = 0;
    let autoplayEnabled = true;
    let currentlyPlaying = null;
    let currentPlayer = null;   // YT.Player instance
    let progressTimer = null;
    let ytApiReady = false;
    let pendingAutoPlay = false;

    // ---------- YT API LOADER ----------
    function loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            ytApiReady = true;
            if (pendingAutoPlay) { pendingAutoPlay = false; startAutoplayFirst(); }
            return;
        }
        // Load API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = function () {
            ytApiReady = true;
            if (pendingAutoPlay) { pendingAutoPlay = false; startAutoplayFirst(); }
        };
    }

    // ---------- HELPERS ----------
    function qs(sel) { return document.querySelector(sel); }
    function qsa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

    function getCardWidth() {
        if (window.innerWidth <= 380) return 140;
        if (window.innerWidth <= 640) return 155;
        if (window.innerWidth <= 900) return 180;
        return 220;
    }

    function calcMaxIndex() {
        const vp = qs('.video-slider-viewport');
        if (!vp) return 0;
        const cardW = getCardWidth();
        const visible = Math.max(1, Math.floor((vp.clientWidth + CARD_GAP) / (cardW + CARD_GAP)));
        return Math.max(0, VIDEO_DATA.length - visible);
    }

    // ---------- BUILD CARDS ----------
    function buildCards() {
        const track = qs('#videoTrack');
        if (!track) return;
        track.innerHTML = VIDEO_DATA.map(function (v, i) {
            return (
                '<div class="video-short-card" data-index="' + i + '" data-id="' + v.id + '" role="button" tabindex="0" aria-label="Play ' + v.title + '">' +
                    '<div class="video-thumb">' +
                        '<img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="' + v.title + '" loading="lazy" onerror="this.style.display=\'none\';">' +
                    '</div>' +
                    '<div class="play-btn"><i class="fas fa-play"></i></div>' +
                    '<div class="video-caption">' +
                        '<span class="cap-tag"><i class="fas fa-bolt"></i> ' + v.tag + '</span>' +
                        '<div class="cap-title">' + v.title + '</div>' +
                    '</div>' +
                    '<div class="video-time-bar"></div>' +
                '</div>'
            );
        }).join('');

        qsa('.video-short-card').forEach(function (card) {
            card.addEventListener('click', function () { playCard(card); });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playCard(card);
                }
            });
        });
    }

    // ---------- PLAY CARD (with YouTube IFrame API) ----------
    function playCard(card) {
        if (!card) return;
        if (!ytApiReady) {
            pendingAutoPlay = true;
            loadYouTubeAPI();
            // Fallback: use plain iframe if API doesn't load in 2s
            setTimeout(function () {
                if (!ytApiReady && card && !card.classList.contains('playing')) {
                    playWithIframeFallback(card);
                }
            }, 2500);
            return;
        }

        // Stop any current playback
        stopCurrentPlay();

        const videoId = card.getAttribute('data-id');
        const idx = parseInt(card.getAttribute('data-index'), 10);

        // Create player container
        const holder = document.createElement('div');
        holder.style.position = 'absolute';
        holder.style.inset = '0';
        holder.style.zIndex = '4';
        card.appendChild(holder);
        card.classList.add('playing');
        currentlyPlaying = card;

        // Create YT.Player
        currentPlayer = new YT.Player(holder, {
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                mute: 1,              // required for autoplay policy
                controls: 1,
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                loop: 0,              // DON'T loop — we want to detect end
                origin: location.origin
            },
            events: {
                'onReady': function (e) {
                    e.target.playVideo();
                    startProgressTracking(card, e.target);
                },
                'onStateChange': function (e) {
                    // YT.PlayerState.ENDED === 0
                    if (e.data === 0) {
                        handleVideoEnd(idx);
                    }
                }
            }
        });

        // Scroll into view
        scrollToIndex(Math.min(idx, maxIndex));
    }

    // Fallback if API doesn't load
    function playWithIframeFallback(card) {
        if (!card || card.classList.contains('playing')) return;
        stopCurrentPlay();
        const videoId = card.getAttribute('data-id');
        const idx = parseInt(card.getAttribute('data-index'), 10);

        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId +
            '?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.frameBorder = '0';
        iframe.style.position = 'absolute';
        iframe.style.inset = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';

        card.appendChild(iframe);
        card.classList.add('playing');
        currentlyPlaying = card;

        // Since we can't detect end without API, use fixed fallback duration
        const fallbackDuration = 45000; // 45 seconds
        const bar = card.querySelector('.video-time-bar');
        const startTime = Date.now();
        progressTimer = setInterval(function () {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, (elapsed / fallbackDuration) * 100);
            if (bar) bar.style.width = pct + '%';
            if (pct >= 100) {
                clearInterval(progressTimer);
                handleVideoEnd(idx);
            }
        }, 250);

        scrollToIndex(Math.min(idx, maxIndex));
    }

    // ---------- PROGRESS TRACKING ----------
    function startProgressTracking(card, player) {
        clearInterval(progressTimer);
        const bar = card.querySelector('.video-time-bar');
        progressTimer = setInterval(function () {
            try {
                if (!player.getDuration) return;
                const dur = player.getDuration();
                const cur = player.getCurrentTime();
                if (dur > 0 && bar) {
                    bar.style.width = Math.min(100, (cur / dur) * 100) + '%';
                }
            } catch (e) { /* ignore */ }
        }, 300);
    }

    // ---------- VIDEO END HANDLER ----------
    function handleVideoEnd(endedIndex) {
        clearInterval(progressTimer);

        // Reset the "playing" state
        if (currentlyPlaying) {
            const bar = currentlyPlaying.querySelector('.video-time-bar');
            if (bar) bar.style.width = '0%';
        }

        if (!autoplayEnabled) {
            // Autoplay off: just stop
            stopCurrentPlay();
            return;
        }

        // Move to next video
        const nextIdx = (endedIndex + 1) % VIDEO_DATA.length;

        setTimeout(function () {
            // Slide to next card
            const targetScroll = Math.min(nextIdx, maxIndex);
            scrollToIndex(targetScroll);

            // Then play that card
            const nextCard = document.querySelector('.video-short-card[data-index="' + nextIdx + '"]');
            if (nextCard) {
                setTimeout(function () { playCard(nextCard); }, AUTO_NEXT_DELAY_MS);
            }
        }, 400);
    }

    // ---------- STOP ----------
    function stopCurrentPlay() {
        clearInterval(progressTimer);
        if (currentPlayer) {
            try { currentPlayer.stopVideo(); } catch (e) {}
            try { currentPlayer.destroy(); } catch (e) {}
            currentPlayer = null;
        }
        if (currentlyPlaying) {
            currentlyPlaying.classList.remove('playing');
            // Remove all iframe / player holders
            const iframes = currentlyPlaying.querySelectorAll('iframe');
            for (let i = 0; i < iframes.length; i++) {
                if (iframes[i].parentNode) iframes[i].parentNode.removeChild(iframes[i]);
            }
            const divs = currentlyPlaying.querySelectorAll('div[style*="position: absolute"]');
            for (let i = 0; i < divs.length; i++) {
                if (divs[i].parentNode && !divs[i].classList.contains('video-thumb')) {
                    divs[i].parentNode.removeChild(divs[i]);
                }
            }
            const bar = currentlyPlaying.querySelector('.video-time-bar');
            if (bar) bar.style.width = '0%';
            currentlyPlaying = null;
        }
    }

    // ---------- SLIDE ----------
    function scrollToIndex(index) {
        const track = qs('#videoTrack');
        if (!track) return;
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        currentIndex = index;
        const cardW = getCardWidth();
        const offset = -(index * (cardW + CARD_GAP));
        track.style.transform = 'translateX(' + offset + 'px)';
        updateDots();
    }

    function nextSlide() {
        if (currentIndex >= maxIndex) scrollToIndex(0);
        else scrollToIndex(currentIndex + 1);
    }
    function prevSlide() {
        if (currentIndex <= 0) scrollToIndex(maxIndex);
        else scrollToIndex(currentIndex - 1);
    }

    // ---------- DOTS ----------
    function buildDots() {
        const wrap = qs('#videoProgress');
        if (!wrap) return;
        const count = maxIndex + 1;
        if (count <= 1) { wrap.innerHTML = ''; return; }
        wrap.innerHTML = Array.from({ length: count }, function (_, i) {
            return '<button class="v-dot' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '" aria-label="Go to video ' + (i + 1) + '"></button>';
        }).join('');
        qsa('.v-dot').forEach(function (d) {
            d.addEventListener('click', function () {
                scrollToIndex(parseInt(this.getAttribute('data-idx'), 10));
            });
        });
    }
    function updateDots() {
        qsa('.v-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    // ---------- AUTOPLAY ----------
    function startAutoplayFirst() {
        // Start playing the first video immediately
        const first = document.querySelector('.video-short-card[data-index="0"]');
        if (first && autoplayEnabled) {
            setTimeout(function () { playCard(first); }, 800);
        }
    }

    // ---------- TOGGLE ----------
    function initAutoplayToggle() {
        const btn = qs('#videoAutoplayToggle');
        if (!btn) return;
        btn.innerHTML = autoplayEnabled
            ? '<i class="fas fa-pause"></i> Auto-play: ON'
            : '<i class="fas fa-play"></i> Auto-play: OFF';
        if (autoplayEnabled) btn.classList.add('active');

        btn.addEventListener('click', function () {
            autoplayEnabled = !autoplayEnabled;
            btn.classList.toggle('active', autoplayEnabled);
            btn.innerHTML = autoplayEnabled
                ? '<i class="fas fa-pause"></i> Auto-play: ON'
                : '<i class="fas fa-play"></i> Auto-play: OFF';
            if (!autoplayEnabled) {
                stopCurrentPlay();
            } else {
                startAutoplayFirst();
            }
        });
    }

    // ---------- ARROWS ----------
    function initArrows() {
        const prev = qs('#videoPrev');
        const next = qs('#videoNext');
        if (prev) prev.addEventListener('click', function () {
            stopCurrentPlay();
            prevSlide();
        });
        if (next) next.addEventListener('click', function () {
            stopCurrentPlay();
            nextSlide();
        });
    }

    // ---------- RESIZE ----------
    function onResize() {
        maxIndex = calcMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        buildDots();
        scrollToIndex(currentIndex);
    }

    // ---------- SCROLL REVEAL ----------
    function initScrollReveal() {
        const section = qs('#videoSection');
        if (!section) return;
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                    io.unobserve(section);
                }
            });
        }, { threshold: 0.15 });
        io.observe(section);
    }

    // ---------- INIT ----------
    function init() {
        if (!document.getElementById('videoTrack')) return;

        loadYouTubeAPI();  // Start loading API immediately
        buildCards();
        maxIndex = calcMaxIndex();
        buildDots();
        scrollToIndex(0);
        initArrows();
        initAutoplayToggle();
        initScrollReveal();
        onResize();

        // Start autoplay once API ready (or fallback after 3s)
        if (autoplayEnabled) {
            if (ytApiReady) {
                startAutoplayFirst();
            } else {
                pendingAutoPlay = true;
                setTimeout(function () {
                    if (!ytApiReady && autoplayEnabled) {
                        const first = document.querySelector('.video-short-card[data-index="0"]');
                        if (first) playWithIframeFallback(first);
                    }
                }, 3000);
            }
        }

        window.addEventListener('resize', onResize);
        console.log('✅ Video section v3.0 loaded —', VIDEO_DATA.length, 'shorts');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
