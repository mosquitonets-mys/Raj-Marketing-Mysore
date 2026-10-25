/* ============================================================
   YOUTUBE SHORTS VIDEO SLIDER — AUTO-PLAY + SCROLL
   Add-on script — does NOT override existing code
============================================================ */

(function () {
    'use strict';

    // ---------- CONFIG ----------
    // Each entry: video ID + caption + tag
    const VIDEO_DATA = [
        { id: 'eFg5rOZrpgM', title: 'Premium Mosquito Net Installation', tag: 'Installation', meta: 'Mysore' },
        { id: 'UbjG32ul0A0', title: 'Velcro Net Fitting — Live Demo', tag: 'Velcro', meta: 'Quick Fit' },
        { id: 'HXASWHy40AE', title: 'Pleated Net in Action', tag: 'Pleated', meta: 'Smooth Slide' },
        { id: 'OQf5gZ99M98', title: 'Aluminium Frame Window Net', tag: 'Aluminium', meta: 'Durable' },
        { id: 'cwNTPYkTsKs', title: 'Sliding Door Net — Perfect Fit', tag: 'Sliding', meta: 'Custom Made' },
        { id: 'wn14Zkn7jlc', title: 'SS Mesh Protection Showcase', tag: 'SS Mesh', meta: 'Rust-free' },
        { id: 'aSAoNgIsj_0', title: 'Professional Measurement Visit', tag: 'Service', meta: 'On-site' },
        { id: 'CW1IAqdnq20', title: 'Security Screen for Doors', tag: 'Security', meta: 'Heavy Duty' },
        { id: '_CtBTE6Kgcc', title: 'Customer Review — Mysore', tag: 'Review', meta: '★★★★★' },
        { id: '4hxo9zDCtdc', title: 'Before & After Transformation', tag: 'Transform', meta: 'Real Work' }
    ];

    const CARD_WIDTH_DESKTOP = 200; // px
    const CARD_GAP = 18;            // px
    const AUTO_SLIDE_MS = 3800;     // auto-advance every 3.8s
    const AUTO_PLAY_NEXT_MS = 9000; // play next video after 9s

    // ---------- STATE ----------
    let currentIndex = 0;
    let visibleCount = 1;
    let maxIndex = 0;
    let autoSlideTimer = null;
    let autoPlayTimer = null;
    let autoplayEnabled = true;
    let isUserInteracting = false;
    let currentlyPlaying = null; // card element
    let playingIframe = null;

    // ---------- HELPERS ----------
    function qs(sel, root) { return (root || document).querySelector(sel); }
    function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function calcVisibleCount() {
        const vp = qs('.video-slider-viewport');
        if (!vp) return 1;
        const w = vp.clientWidth;
        const cardW = window.innerWidth <= 640 ? (window.innerWidth <= 380 ? 130 : 145) : (window.innerWidth <= 900 ? 170 : CARD_WIDTH_DESKTOP);
        return Math.max(1, Math.floor((w + CARD_GAP) / (cardW + CARD_GAP)));
    }

    // ---------- BUILD CARDS ----------
    function buildCards() {
        const track = qs('#videoTrack');
        if (!track) return;

        track.innerHTML = VIDEO_DATA.map(function (v, i) {
            const ytThumb = 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
            return (
                '<div class="video-short-card" data-index="' + i + '" data-id="' + v.id + '" role="button" tabindex="0" aria-label="Play ' + v.title + '">' +
                    '<div class="video-thumb">' +
                        '<img src="' + ytThumb + '" alt="' + v.title + '" loading="lazy" onerror="this.style.display=\'none\';this.parentElement.style.background=\'linear-gradient(135deg,#1e3a8a,#0f1b33)\';">' +
                    '</div>' +
                    '<div class="play-btn"><i class="fas fa-play"></i></div>' +
                    '<div class="video-caption">' +
                        '<span class="cap-tag"><i class="fas fa-bolt"></i> ' + v.tag + '</span>' +
                        '<div class="cap-title">' + v.title + '</div>' +
                        '<div class="cap-meta"><i class="fas fa-map-marker-alt"></i> ' + v.meta + '</div>' +
                    '</div>' +
                '</div>'
            );
        }).join('');

        // Click to play
        qsa('.video-short-card', track).forEach(function (card) {
            card.addEventListener('click', function () { playCard(card); });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playCard(card);
                }
            });
        });
    }

    // ---------- PLAY A CARD ----------
    function playCard(card) {
        if (!card || card.classList.contains('playing')) return;
        const videoId = card.getAttribute('data-id');
        if (!videoId) return;

        // Stop previous
        stopCurrentPlay();

        // Insert iframe
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src',
            'https://www.youtube.com/embed/' + videoId +
            '?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=' + videoId
        );
        iframe.setAttribute('title', 'YouTube Short');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', '0');

        card.appendChild(iframe);
        card.classList.add('playing');
        currentlyPlaying = card;
        playingIframe = iframe;

        // Auto-play next video after N seconds
        clearTimeout(autoPlayTimer);
        if (autoplayEnabled) {
            autoPlayTimer = setTimeout(function () {
                autoPlayNext();
            }, AUTO_PLAY_NEXT_MS);
        }
    }

    function stopCurrentPlay() {
        if (currentlyPlaying) {
            currentlyPlaying.classList.remove('playing');
            if (playingIframe && playingIframe.parentNode) {
                playingIframe.parentNode.removeChild(playingIframe);
            }
            currentlyPlaying = null;
            playingIframe = null;
        }
        clearTimeout(autoPlayTimer);
    }

    function autoPlayNext() {
        // Find next card after currently playing
        const cards = qsa('.video-short-card');
        if (!cards.length) return;
        let idx = currentlyPlaying ? parseInt(currentlyPlaying.getAttribute('data-index'), 10) : -1;
        idx = (idx + 1) % cards.length;
        // Scroll that card into view first
        scrollToIndex(Math.min(idx, maxIndex));
        // Small delay so slide animation looks natural
        setTimeout(function () { playCard(cards[idx]); }, 600);
    }

    // ---------- SLIDE ----------
    function scrollToIndex(index) {
        const track = qs('#videoTrack');
        if (!track) return;

        // Bounds
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        currentIndex = index;

        const cardW = window.innerWidth <= 640 ? (window.innerWidth <= 380 ? 130 : 145) : (window.innerWidth <= 900 ? 170 : CARD_WIDTH_DESKTOP);
        const offset = -(index * (cardW + CARD_GAP));
        track.style.transform = 'translateX(' + offset + 'px)';

        updateDots();
    }

    function nextSlide() {
        if (currentIndex >= maxIndex) {
            scrollToIndex(0); // loop to start
        } else {
            scrollToIndex(currentIndex + 1);
        }
    }
    function prevSlide() {
        if (currentIndex <= 0) {
            scrollToIndex(maxIndex); // loop to end
        } else {
            scrollToIndex(currentIndex - 1);
        }
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
        qsa('.v-dot', wrap).forEach(function (d) {
            d.addEventListener('click', function () {
                scrollToIndex(parseInt(this.getAttribute('data-idx'), 10));
                restartAutoSlide();
            });
        });
    }
    function updateDots() {
        qsa('.v-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    // ---------- AUTO SLIDE ----------
    function startAutoSlide() {
        clearInterval(autoSlideTimer);
        if (!autoplayEnabled) return;
        autoSlideTimer = setInterval(function () {
            if (isUserInteracting) return;
            nextSlide();
        }, AUTO_SLIDE_MS);
    }
    function restartAutoSlide() {
        startAutoSlide();
    }

    // ---------- AUTOPLAY TOGGLE ----------
    function initAutoplayToggle() {
        const btn = qs('#videoAutoplayToggle');
        if (!btn) return;
        // Sync initial state
        if (autoplayEnabled) btn.classList.add('active');
        btn.addEventListener('click', function () {
            autoplayEnabled = !autoplayEnabled;
            btn.classList.toggle('active', autoplayEnabled);
            if (autoplayEnabled) {
                startAutoSlide();
                btn.innerHTML = '<i class="fas fa-pause"></i> Autoplay: ON';
            } else {
                clearInterval(autoSlideTimer);
                clearTimeout(autoPlayTimer);
                btn.innerHTML = '<i class="fas fa-play"></i> Autoplay: OFF';
            }
        });
        // Set initial label
        btn.innerHTML = autoplayEnabled
            ? '<i class="fas fa-pause"></i> Autoplay: ON'
            : '<i class="fas fa-play"></i> Autoplay: OFF';
    }

    // ---------- NAV ARROWS ----------
    function initArrows() {
        const prev = qs('#videoPrev');
        const next = qs('#videoNext');
        if (prev) prev.addEventListener('click', function () {
            prevSlide(); restartAutoSlide();
        });
        if (next) next.addEventListener('click', function () {
            nextSlide(); restartAutoSlide();
        });
    }

    // ---------- INTERACTION PAUSE ----------
    function initInteractionPause() {
        const wrap = qs('.video-slider-wrap');
        if (!wrap) return;
        wrap.addEventListener('mouseenter', function () { isUserInteracting = true; });
        wrap.addEventListener('mouseleave', function () { isUserInteracting = false; });

        // Touch: pause during swipe
        let tx = 0;
        wrap.addEventListener('touchstart', function (e) {
            isUserInteracting = true;
            tx = e.changedTouches[0].screenX;
        }, { passive: true });
        wrap.addEventListener('touchend', function (e) {
            const diff = e.changedTouches[0].screenX - tx;
            if (Math.abs(diff) > 40) {
                if (diff < 0) nextSlide();
                else prevSlide();
                restartAutoSlide();
            }
            setTimeout(function () { isUserInteracting = false; }, 300);
        }, { passive: true });
    }

    // ---------- RESIZE ----------
    function onResize() {
        visibleCount = calcVisibleCount();
        maxIndex = Math.max(0, VIDEO_DATA.length - visibleCount);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        buildDots();
        scrollToIndex(currentIndex);
    }

    // ---------- SCROLL ANIMATION (intersection) ----------
    function initScrollReveal() {
        const section = qs('#videoSection');
        if (!section) return;
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                    io.unobserve(section);
                }
            });
        }, { threshold: 0.15 });
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        io.observe(section);
    }

    // ---------- INIT ----------
    function init() {
        if (!document.getElementById('videoTrack')) return; // section not present
        buildCards();
        visibleCount = calcVisibleCount();
        maxIndex = Math.max(0, VIDEO_DATA.length - visibleCount);
        buildDots();
        scrollToIndex(0);
        initArrows();
        initAutoplayToggle();
        initInteractionPause();
        initScrollReveal();
        startAutoSlide();
        window.addEventListener('resize', onResize);
        console.log('✅ Video section loaded —', VIDEO_DATA.length, 'shorts');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
