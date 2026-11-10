/**
 * =========================================================================
 * SÓI MÂY COMPANION ENGINE 2.0 (LIVING MASCOT & INTERACTIVE ASSISTANT)
 * =========================================================================
 * Thiết kế bởi Senior Product Designer & Tech Lead:
 * 1. Living Mascot: Hoạt ảnh thở sinh học, phản ứng micro-interactions 60fps.
 * 2. Adaptive Expressions: Đổi biểu cảm linh hoạt (may_reading, may_listening, may_trophy, may_guide).
 * 3. Hero Click Interaction: Tương tác chạm phát micro-chime + bong bóng thoại học thuật ETS.
 * 4. Floating Companion Dock: Widget Sói Mây nổi ở góc màn hình, luôn đồng hành khi cuộn trang.
 * 5. Web Audio Soundscapes: Micro-chimes C6-C7 (thưởng), F4-A4 (động viên), Soft Pop (click).
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    class SoiMayCompanionEngine {
        constructor() {
            this.audioCtx = null;
            this.activeBalloon = null;
            this.balloonTimeout = null;
            this.heroQuoteIndex = 0;

            this.heroQuotes = [
                'Mẹo từ Sói Mây: 💡 Part 5 đừng dịch hết cả câu, nhìn từ trước và sau chỗ trống trước nhé!',
                'Mỗi ngày 15 phút là 700+ TOEIC nằm chắc trong tay! Cố lên bạn ơi! ✨',
                'Nghe Part 1: Bẫy hành động đang diễn ra (V-ing) trong khi tranh chỉ có tĩnh vật!',
                'Sói Mây luôn ở đây cùng bạn nè! Uống ngụm nước rồi làm bài tiếp nhé! 🥤',
                'Đọc Part 7: Đọc câu hỏi trước để bắt từ khóa (Keyword Scanning), đừng đọc bài trước!',
                'Bạn đã ôn từ vựng hôm nay chưa? Cùng Sói Mây lật thẻ flashcard ngay nhé! 🦊',
                'Tập trung cao độ với chế độ Zen Focus: Bật tiếng sóng biển hoặc mưa êm dịu nhé!'
            ];

            this.encouragementQuotes = [
                'Không sao cả, mỗi lần sai là một lần não bộ nhớ sâu hơn!',
                'Kiên trì là chìa khóa ETS 990. Tiếp tục nào!',
                'Sói Mây đã lưu câu này vào sổ bẫy đề để ôn lại cho bạn nhé!',
                'Hít thở một hơi thật sâu rồi xem phân tích 3 bước nhé!'
            ];

            this.celebrationQuotes = [
                'Chuẩn xác! Bắt trọn keyword đỉnh cao! 🎯',
                'Tuyệt vời! Phản xạ xuất sắc +5 XP! ⚡',
                'Rất mượt mà! Cứ giữ vững phong độ này nhé! ✨',
                'Bứt phá ngoạn mục! Tiến gần hơn tới mốc điểm 600+! 🏆'
            ];

            this.injectStyles();
            this.createFloatingCompanion();

            // Lời chào mở màn tự động sau 1.5s
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(() => this.greetOnLoad(), 1500);
            } else {
                window.addEventListener('DOMContentLoaded', () => setTimeout(() => this.greetOnLoad(), 1500));
            }
        }

        injectStyles() {
            if (document.getElementById('soi-may-companion-styles')) return;
            const style = document.createElement('style');
            style.id = 'soi-may-companion-styles';
            style.textContent = `
                @keyframes soiMayBreathe {
                    0%, 100% { transform: scale(1) translateY(0); }
                    50% { transform: scale(1.03) translateY(-3px); }
                }
                @keyframes soiMayCelebrate {
                    0% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.18) rotate(-8deg); filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.8)); }
                    50% { transform: scale(1.12) rotate(8deg); filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.8)); }
                    75% { transform: scale(1.06) rotate(-3deg); }
                    100% { transform: scale(1) rotate(0deg); filter: none; }
                }
                @keyframes soiMayEncourage {
                    0% { transform: translateY(0); }
                    30% { transform: translateY(6px); }
                    60% { transform: translateY(-3px); }
                    100% { transform: translateY(0); }
                }
                @keyframes bubbleFloatIn {
                    from { opacity: 0; transform: translateY(10px) scale(0.92); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes bubbleFloatOut {
                    from { opacity: 1; transform: translateY(0) scale(1); }
                    to { opacity: 0; transform: translateY(-10px) scale(0.95); }
                }
                @keyframes auraPulse {
                    0%, 100% { opacity: 0.35; transform: scale(1); }
                    50% { opacity: 0.75; transform: scale(1.08); }
                }

                .soi-may-breathing {
                    animation: soiMayBreathe 3.6s ease-in-out infinite;
                }
                .soi-may-celebrate {
                    animation: soiMayCelebrate 0.85s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .soi-may-encourage {
                    animation: soiMayEncourage 0.65s ease-out;
                }
                .soi-may-aura {
                    animation: auraPulse 3s ease-in-out infinite;
                }

                .soi-may-speech-bubble {
                    position: fixed;
                    z-index: 26;
                    pointer-events: none;
                    animation: bubbleFloatIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    box-shadow: 0 12px 30px -5px rgba(15, 23, 42, 0.3), 0 4px 6px -4px rgba(15, 23, 42, 0.2);
                }
                .soi-may-speech-bubble.fade-out {
                    animation: bubbleFloatOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                /* Floating Companion Dock (Góc dưới bên phải - nằm dưới header 30 và modal >=50) */
                #soiMayFloatingDock {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 25;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                #soiMayFloatingDock:hover {
                    transform: scale(1.05);
                }
                @media (max-width: 1023px) {
                    #soiMayFloatingDock {
                        bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
                        right: 14px !important;
                        z-index: 25 !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        initAudio() {
            if (!this.audioCtx && typeof window.AudioContext !== 'undefined') {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioCtx();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        }

        // Âm thanh Web Audio API (0KB)
        playChime(type = 'celebrate') {
            try {
                this.initAudio();
                if (!this.audioCtx) return;
                const now = this.audioCtx.currentTime;

                if (type === 'celebrate') {
                    // Hợp âm Arpeggio vui tươi: C6 (1046.5) -> E6 (1318.5) -> G6 (1567.98) -> C7 (2093.0)
                    const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
                    freqs.forEach((freq, idx) => {
                        const osc = this.audioCtx.createOscillator();
                        const gain = this.audioCtx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, now + (idx * 0.055));
                        gain.gain.setValueAtTime(0.045, now + (idx * 0.055));
                        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.055) + 0.32);
                        osc.connect(gain);
                        gain.connect(this.audioCtx.destination);
                        osc.start(now + (idx * 0.055));
                        osc.stop(now + (idx * 0.055) + 0.38);
                    });
                } else if (type === 'encourage') {
                    // Âm thanh ấm áp, êm dịu vỗ về: F4 -> A4
                    const freqs = [349.23, 440.0];
                    freqs.forEach((freq, idx) => {
                        const osc = this.audioCtx.createOscillator();
                        const gain = this.audioCtx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(freq, now + (idx * 0.09));
                        gain.gain.setValueAtTime(0.04, now + (idx * 0.09));
                        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.09) + 0.45);
                        osc.connect(gain);
                        gain.connect(this.audioCtx.destination);
                        osc.start(now + (idx * 0.09));
                        osc.stop(now + (idx * 0.09) + 0.5);
                    });
                } else if (type === 'pop') {
                    // Âm soft pop khi click
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.09);
                }
            } catch (e) {}
        }

        // Tương tác khi click vào Mascot Sói Mây ở Hero Banner
        interactHero() {
            this.playChime('pop');
            const heroImg = document.getElementById('heroSoiMayImg');
            const heroBubbleText = document.getElementById('heroSoiMayBubbleText');

            if (heroImg) {
                heroImg.classList.remove('soi-may-celebrate');
                void heroImg.offsetWidth;
                heroImg.classList.add('soi-may-celebrate');

                // Tạm thời đổi sang biểu cảm ăn mừng (may_trophy.png) trong 1.6s
                const originalSrc = heroImg.src;
                if (!heroImg.src.includes('may_trophy.png')) {
                    heroImg.src = 'assets/mascot/may_trophy.png';
                    setTimeout(() => {
                        heroImg.src = originalSrc;
                    }, 1600);
                }
            }

            // Đổi câu nói sinh động tiếp theo
            this.heroQuoteIndex = (this.heroQuoteIndex + 1) % this.heroQuotes.length;
            const quote = this.heroQuotes[this.heroQuoteIndex];

            if (heroBubbleText) {
                heroBubbleText.style.opacity = '0';
                setTimeout(() => {
                    heroBubbleText.textContent = quote;
                    heroBubbleText.style.opacity = '1';
                }, 180);
            }

            this.playChime('celebrate');
        }

        // Lời chào mở màn khi vào Dashboard (Cá nhân hóa theo tài khoản thực tế)
        greetOnLoad() {
            const heroBubbleText = document.getElementById('heroSoiMayBubbleText');
            if (heroBubbleText) {
                const hour = new Date().getHours();
                const currentAcc = window.currentUserAccount || (typeof currentUserAccount !== 'undefined' ? currentUserAccount : null);
                const userName = (currentAcc && (currentAcc.name || currentAcc.displayName))
                    ? (currentAcc.name || currentAcc.displayName).trim().split(' ').pop()
                    : 'bạn';

                let timeGreeting = `Chào ${userName}! 🎯`;
                if (hour >= 5 && hour < 12) timeGreeting = `Chào buổi sáng ${userName}! 🌅`;
                else if (hour >= 12 && hour < 18) timeGreeting = `Chào buổi chiều ${userName}! ☕`;
                else timeGreeting = `Chào buổi tối ${userName}! 🌙`;

                if (currentAcc && currentAcc.diagnosticResults) {
                    heroBubbleText.textContent = `${timeGreeting} Cùng Sói Mây tiếp tục lộ trình học nhé! ✨`;
                } else {
                    heroBubbleText.textContent = `${timeGreeting} Cùng Sói Mây làm bài test 25 phút để xác định trình độ và mở khóa lộ trình nhé! 🎯`;
                }
            }
        }

        // Tạo Widget Bạn học Sói Mây nổi ở góc màn hình (Floating Live Companion)
        createFloatingCompanion() {
            if (document.getElementById('soiMayFloatingDock')) return;

            const dock = document.createElement('div');
            dock.id = 'soiMayFloatingDock';
            dock.className = 'group cursor-pointer select-none';
            dock.innerHTML = `
                <!-- Mini Speech Bubble khi hover -->
                <div id="floatingSoiMayTip" class="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-sky-300 dark:border-sky-700 shadow-lg text-xs font-bold text-slate-800 dark:text-slate-200 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none">
                    <span class="text-sky-500">🐺</span>
                    <span id="floatingSoiMayTipText">Sói Mây luôn ở đây để giúp bạn!</span>
                </div>

                <!-- Avatar Mascot có nhịp thở và vòng sáng -->
                <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-0.5 shadow-xl hover:shadow-2xl transition-all">
                    <div class="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center p-1 overflow-hidden relative">
                        <img id="floatingMascotImg" src="/assets/mascot/may_avatar.png" alt="Sói Mây AI" class="soi-may-breathing w-10 h-10 object-contain drop-shadow transition-transform group-hover:scale-115">
                        <span class="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                    </div>
                </div>
            `;

            dock.onclick = (e) => {
                e.stopPropagation();
                this.interactFloating();
            };

            const attachDock = () => {
                if (document.body && !document.getElementById('soiMayFloatingDock')) {
                    document.body.appendChild(dock);
                }
            };

            if (document.body) {
                attachDock();
            } else {
                document.addEventListener('DOMContentLoaded', attachDock);
            }
        }

        hideFloating() {
            const dock = document.getElementById('soiMayFloatingDock');
            if (dock) dock.style.display = 'none';
        }

        showFloating() {
            const dock = document.getElementById('soiMayFloatingDock');
            if (dock) dock.style.display = '';
        }

        interactFloating() {
            this.playChime('pop');
            const floatingImg = document.getElementById('floatingMascotImg');
            const tipText = document.getElementById('floatingSoiMayTipText');

            if (floatingImg) {
                floatingImg.classList.remove('soi-may-celebrate');
                void floatingImg.offsetWidth;
                floatingImg.classList.add('soi-may-celebrate');
            }

            this.heroQuoteIndex = (this.heroQuoteIndex + 1) % this.heroQuotes.length;
            const quote = this.heroQuotes[this.heroQuoteIndex];

            if (tipText) {
                tipText.textContent = quote;
            }

            this.showSpeechBubble(document.getElementById('soiMayFloatingDock'), quote, 'celebrate');
            this.playChime('celebrate');
        }

        findMascotAnchor() {
            const candidates = [
                document.getElementById('heroSoiMayImg'),
                document.getElementById('floatingMascotImg'),
                document.querySelector('#zenFocusHeader img'),
                document.querySelector('#view-vocabulary-study img[src*="may"]'),
                document.querySelector('#view-hom-nay img[src*="may"]')
            ];
            for (const el of candidates) {
                if (el && el.offsetParent !== null) {
                    return el;
                }
            }
            return document.getElementById('soiMayFloatingDock');
        }

        showSpeechBubble(anchorEl, text, type = 'celebrate') {
            if (this.activeBalloon) {
                this.activeBalloon.remove();
                this.activeBalloon = null;
            }
            if (this.balloonTimeout) {
                clearTimeout(this.balloonTimeout);
                this.balloonTimeout = null;
            }

            const bubble = document.createElement('div');
            bubble.className = 'soi-may-speech-bubble px-4 py-2.5 rounded-2xl flex items-center gap-2.5 backdrop-blur-md text-xs font-bold max-w-xs sm:max-w-sm';
            
            if (type === 'celebrate') {
                bubble.classList.add('bg-slate-900/95', 'text-white', 'border', 'border-sky-400/80');
                bubble.innerHTML = `
                    <span class="text-amber-400 text-base">✨</span>
                    <span class="leading-relaxed">${text}</span>
                `;
            } else {
                bubble.classList.add('bg-slate-900/95', 'text-white', 'border', 'border-indigo-400/80');
                bubble.innerHTML = `
                    <span class="text-sky-400 text-base">💙</span>
                    <span class="leading-relaxed">${text}</span>
                `;
            }

            if (!document.body) return;
            document.body.appendChild(bubble);
            this.activeBalloon = bubble;

            if (anchorEl) {
                const rect = anchorEl.getBoundingClientRect();
                const bubbleRect = bubble.getBoundingClientRect();
                
                let top = rect.top - bubbleRect.height - 12;
                let left = rect.left + (rect.width / 2) - (bubbleRect.width / 2);

                if (top < 12) top = rect.bottom + 12;
                if (left < 12) left = 12;
                if (left + bubbleRect.width > window.innerWidth - 12) {
                    left = window.innerWidth - bubbleRect.width - 12;
                }

                bubble.style.top = `${top}px`;
                bubble.style.left = `${left}px`;
            } else {
                bubble.style.bottom = '90px';
                bubble.style.right = '24px';
            }

            this.balloonTimeout = setTimeout(() => {
                if (this.activeBalloon) {
                    this.activeBalloon.classList.add('fade-out');
                    setTimeout(() => {
                        if (this.activeBalloon) {
                            this.activeBalloon.remove();
                            this.activeBalloon = null;
                        }
                    }, 300);
                }
            }, 3200);
        }

        celebrate(customText = null) {
            const text = customText || this.celebrationQuotes[Math.floor(Math.random() * this.celebrationQuotes.length)];
            const anchor = this.findMascotAnchor();
            if (anchor) {
                anchor.classList.remove('soi-may-celebrate', 'soi-may-encourage');
                void anchor.offsetWidth;
                anchor.classList.add('soi-may-celebrate');
            }
            this.playChime('celebrate');
            this.showSpeechBubble(anchor, text, 'celebrate');
        }

        encourage(customText = null) {
            const text = customText || this.encouragementQuotes[Math.floor(Math.random() * this.encouragementQuotes.length)];
            const anchor = this.findMascotAnchor();
            if (anchor) {
                anchor.classList.remove('soi-may-celebrate', 'soi-may-encourage');
                void anchor.offsetWidth;
                anchor.classList.add('soi-may-encourage');
            }
            this.playChime('encourage');
            this.showSpeechBubble(anchor, text, 'encourage');
        }
    }

    window.SoiMayCompanion = new SoiMayCompanionEngine();
    console.log('🐺 Sói Mây Reactive Companion Engine 2.0 initialized successfully.');

})(window, document);
