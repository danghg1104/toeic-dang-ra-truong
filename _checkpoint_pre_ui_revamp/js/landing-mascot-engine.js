/**
 * Landing Mascot & Interactive Preview Engine
 * Cung Cấp Vector SVG Mascot Cú Xanh Thông Thái (TART Mascot) & Các Tương Tác Sảnh
 */

(function(window) {
    'use strict';

    function getOwlMascotSVG(variant = 'hero') {
        const isTrophy = (variant === 'trophy');
        
        return `
        <svg viewBox="0 0 170 170" class="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#93c5fd"/>
                    <stop offset="50%" stop-color="#60a5fa"/>
                    <stop offset="100%" stop-color="#3b82f6"/>
                </linearGradient>
                <linearGradient id="owlCapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e40af"/>
                    <stop offset="100%" stop-color="#1e3a8a"/>
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef08a"/>
                    <stop offset="50%" stop-color="#facc15"/>
                    <stop offset="100%" stop-color="#eab308"/>
                </linearGradient>
                <filter id="glowEffect" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>

            <!-- Circular Ambient Backdrop -->
            <circle cx="85" cy="90" r="58" fill="#dbeafe" opacity="0.45"/>

            <!-- Royal Blue Cape Wings -->
            <path d="M42 74 C26 98, 24 128, 40 142 C48 132, 52 106, 56 90 Z" fill="url(#owlCapeGrad)"/>
            <path d="M128 74 C144 98, 146 128, 130 142 C122 132, 118 106, 114 90 Z" fill="url(#owlCapeGrad)"/>

            <!-- Owl Main Chubby Body -->
            <ellipse cx="85" cy="92" rx="46" ry="50" fill="url(#owlBodyGrad)"/>

            <!-- Soft Belly & Feathers -->
            <path d="M58 82 Q85 74 112 82 Q124 112 110 132 Q85 140 60 132 Q46 112 58 82 Z" fill="#f8fafc"/>
            <path d="M72 100 Q85 96 98 100 M68 112 Q85 108 102 112 M74 124 Q85 120 96 124" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round" fill="none"/>

            <!-- Cape Clasp & Star Brooch -->
            <circle cx="85" cy="90" r="6.5" fill="#facc15"/>
            <path d="M85 86 L86.5 89 L89.5 89.5 L87.5 91.5 L88 94.5 L85 93 L82 94.5 L82.5 91.5 L80.5 89.5 L83.5 89 Z" fill="#b45309"/>

            <!-- Rosy Cheeks -->
            <ellipse cx="48" cy="80" rx="8" ry="4" fill="#f43f5e" opacity="0.3"/>
            <ellipse cx="122" cy="80" rx="8" ry="4" fill="#f43f5e" opacity="0.3"/>

            <!-- Big Round Spectacles -->
            <circle cx="62" cy="68" r="18" stroke="#1e3a8a" stroke-width="4.5" fill="#ffffff" fill-opacity="0.95"/>
            <circle cx="108" cy="68" r="18" stroke="#1e3a8a" stroke-width="4.5" fill="#ffffff" fill-opacity="0.95"/>
            <path d="M80 68 Q85 64 90 68" stroke="#1e3a8a" stroke-width="4.5" fill="none"/>

            <!-- Expressive Owl Eyes -->
            <circle cx="64" cy="68" r="8.5" fill="#0f172a"/>
            <circle cx="61" cy="65" r="3" fill="#ffffff"/>
            <circle cx="110" cy="68" r="8.5" fill="#0f172a"/>
            <circle cx="107" cy="65" r="3" fill="#ffffff"/>

            <!-- Curved Orange Beak -->
            <polygon points="80,74 90,74 85,85" fill="#f97316"/>

            <!-- Graduation Cap (Mortarboard) -->
            <polygon points="85,16 135,32 85,48 35,32" fill="#1e3a8a"/>
            <path d="M58 38 L58 50 Q85 60 112 50 L112 38 Z" fill="#1e40af"/>
            <circle cx="85" cy="32" r="4" fill="#facc15"/>
            <path d="M85 32 Q115 30 120 46" stroke="#facc15" stroke-width="3" fill="none"/>
            <circle cx="120" cy="48" r="3" fill="#facc15"/>

            ${isTrophy ? `
                <!-- Confetti & Celebration Sparkles -->
                <circle cx="30" cy="40" r="3" fill="#ec4899"/>
                <rect x="24" y="60" width="5" height="5" fill="#eab308" transform="rotate(25 24 60)"/>
                <circle cx="145" cy="45" r="3.5" fill="#3b82f6"/>
                <rect x="140" y="70" width="6" height="6" fill="#10b981" transform="rotate(45 140 70)"/>
                <circle cx="130" cy="25" r="2.5" fill="#f97316"/>

                <!-- Golden Trophy Cup in Wings -->
                <path d="M72 105 L98 105 L94 125 Q85 132 76 125 Z" fill="url(#goldGrad)" stroke="#ca8a04" stroke-width="1.5"/>
                <path d="M82 128 L88 128 L88 136 L82 136 Z" fill="#ca8a04"/>
                <rect x="75" y="136" width="20" height="7" rx="2" fill="#854d0e"/>
                <!-- Trophy Handles -->
                <path d="M72 108 C64 108 64 120 73 120" stroke="#ca8a04" stroke-width="2.5" fill="none"/>
                <path d="M98 108 C106 108 106 120 97 120" stroke="#ca8a04" stroke-width="2.5" fill="none"/>
                <!-- Trophy Star Badge -->
                <polygon points="85,110 86.5,113.5 90,114 87.5,116.5 88,120 85,118 82,120 82.5,116.5 80,114 83.5,113.5" fill="#ffffff" filter="url(#glowEffect)"/>
            ` : `
                <!-- Left Wing Holding Blue Notebook -->
                <rect x="115" y="84" width="24" height="32" rx="4" fill="#1e3a8a" transform="rotate(10 115 84)"/>
                <rect x="117" y="86" width="20" height="28" rx="3" fill="#3b82f6" transform="rotate(10 115 84)"/>
                <rect x="119" y="90" width="16" height="3" fill="#93c5fd" transform="rotate(10 115 84)"/>
                <rect x="119" y="96" width="12" height="2" fill="#93c5fd" transform="rotate(10 115 84)"/>
                <rect x="127" y="82" width="4" height="12" fill="#facc15" transform="rotate(10 115 84)"/>

                <!-- Right Wing Raised Holding Glowing Star -->
                <path d="M52 96 Q34 80 30 62 Q44 70 58 84 Z" fill="#60a5fa"/>
                <polygon points="26,38 30,48 40,49 32,57 34,67 26,61 18,67 20,57 12,49 22,48" fill="url(#goldGrad)" filter="url(#glowEffect)"/>
                <circle cx="26" cy="52" r="2" fill="#ffffff"/>
            `}

            <!-- Orange Feet -->
            <ellipse cx="68" cy="142" rx="8" ry="4.5" fill="#f97316"/>
            <ellipse cx="102" cy="142" rx="8" ry="4.5" fill="#f97316"/>
        </svg>
        `;
    }

    // Audio Player Controller for Landing Listening Card
    let isPreviewPlaying = false;
    let previewPlayTimer = null;

    function toggleLandingListeningAudio() {
        const btn = document.getElementById('landingAudioPlayBtn');
        const icon = document.getElementById('landingAudioPlayIcon');
        const progress = document.getElementById('landingAudioProgressBar');
        const timerText = document.getElementById('landingAudioTimer');

        const transcript = "Some of our employees flew to San Antonio to attend a conference on property rental and sales.";

        if (!isPreviewPlaying) {
            isPreviewPlaying = true;
            if (icon) icon.className = "fa-solid fa-pause";
            if (btn) btn.classList.add('ring-4', 'ring-cyan-200');

            if (window.UniversalAudioEngine && typeof window.UniversalAudioEngine.speak === 'function') {
                window.UniversalAudioEngine.speak(transcript, {
                    lang: 'en-US',
                    rate: 0.95,
                    onend: () => stopLandingListeningAudio()
                });
            }

            let currentSec = 14;
            const totalSec = 107;
            if (previewPlayTimer) clearInterval(previewPlayTimer);
            previewPlayTimer = setInterval(() => {
                currentSec++;
                if (currentSec > totalSec) {
                    stopLandingListeningAudio();
                    return;
                }
                const m = Math.floor(currentSec / 60);
                const s = currentSec % 60;
                if (timerText) timerText.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                if (progress) progress.style.width = `${(currentSec / totalSec) * 100}%`;
            }, 1000);

            if (window.showToast) window.showToast('🎧 Đang phát âm thanh bài nói Part 4...');
        } else {
            stopLandingListeningAudio();
        }
    }

    function stopLandingListeningAudio() {
        isPreviewPlaying = false;
        const icon = document.getElementById('landingAudioPlayIcon');
        const btn = document.getElementById('landingAudioPlayBtn');
        if (icon) icon.className = "fa-solid fa-play";
        if (btn) btn.classList.remove('ring-4', 'ring-cyan-200');
        if (previewPlayTimer) {
            clearInterval(previewPlayTimer);
            previewPlayTimer = null;
        }
        if (window.UniversalAudioEngine && typeof window.UniversalAudioEngine.stop === 'function') {
            window.UniversalAudioEngine.stop();
        }
    }

    // Grammar Quiz Interactive Selector
    function selectLandingGrammarOption(opt) {
        const options = ['A', 'B', 'C', 'D'];
        options.forEach(o => {
            const el = document.getElementById(`landing-gram-opt-${o}`);
            if (el) {
                el.className = "p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer " +
                    (o === opt 
                        ? (o === 'B' ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-extrabold" : "border-rose-400 bg-rose-50 text-rose-800")
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300");
            }
        });

        const iconB = document.getElementById('landing-gram-check-B');
        if (iconB) iconB.className = (opt === 'B') ? "fa-solid fa-check text-emerald-600 font-bold" : "hidden";

        const reasoningBox = document.getElementById('landingGrammarReasoningBox');
        if (reasoningBox) {
            reasoningBox.classList.remove('hidden');
        }

        if (opt === 'B') {
            if (window.showToast) window.showToast('🎉 Chính xác! Mr. Tanaka là ngôi 3 số ít, chọn "submits"!');
        } else {
            if (window.showToast) window.showToast('💡 Chưa chính xác! Hãy đọc kỹ phần "Cách suy luận" bên cạnh.');
        }
    }

    // Pronounce Landing Vocab Word
    function speakLandingVocab(accent = 'US') {
        const word = "access";
        if (window.UniversalAudioEngine && typeof window.UniversalAudioEngine.speak === 'function') {
            window.UniversalAudioEngine.speak(word, {
                lang: accent === 'UK' ? 'en-GB' : 'en-US',
                rate: 0.95
            });
            if (window.showToast) window.showToast(`🔊 Phát âm "${word}" (${accent})`);
        }
    }

    // Expose to window
    window.LandingMascotEngine = {
        getOwlMascotSVG,
        toggleLandingListeningAudio,
        stopLandingListeningAudio,
        selectLandingGrammarOption,
        speakLandingVocab
    };

    // Auto-mount mascots on DOM ready
    function initLandingMascots() {
        const heroEl = document.getElementById('landingHeroOwl');
        if (heroEl) heroEl.innerHTML = getOwlMascotSVG('hero');

        const trophyEl = document.getElementById('landingTrophyOwl');
        if (trophyEl) trophyEl.innerHTML = getOwlMascotSVG('trophy');

        const sideEl = document.getElementById('sidebarOwlContainer');
        if (sideEl) sideEl.innerHTML = getOwlMascotSVG('hero');
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initLandingMascots);
        } else {
            initLandingMascots();
        }
    }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
