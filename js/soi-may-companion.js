/**
 * =========================================================================
 * SÓI MÂY COMPANION ENGINE (REACTIVE MASCOT MICRO-INTERACTIONS)
 * =========================================================================
 * Chuẩn mực Product Design & Tech Lead:
 * - Linh vật Sói Mây tương tác động thời gian thực (Micro-interactions).
 * - Phản ứng cảm xúc (Celebrate, Encourage, Tip, Zen Breath) theo hành vi học tập.
 * - Hiệu ứng âm thanh tinh tế (Micro-chimes) tạo bằng Web Audio API (0KB CDN).
 * - Bong bóng thoại động (Speech Bubble Balloon) thanh thoát, tự hủy sau 2.5s.
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    class SoiMayCompanionEngine {
        constructor() {
            this.audioCtx = null;
            this.activeBalloon = null;
            this.balloonTimeout = null;
            this.encouragementQuotes = [
                'Không sao cả, mỗi lần sai là một lần não bộ ghi nhớ sâu hơn!',
                'Kiên trì là chìa khóa ETS 990. Tiếp tục nào!',
                'Sói Mây đã lưu câu này vào sổ để ôn lại cho bạn nhé!',
                'Hít thở một hơi thật sâu rồi xem phân tích 3 bước nhé!'
            ];
            this.celebrationQuotes = [
                'Chuẩn xác! Bắt trọn keyword đỉnh cao!',
                'Tuyệt vời! Phản xạ xuất sắc +5 XP!',
                'Rất mượt mà! Cứ giữ vững phong độ này nhé!',
                'Bứt phá ngoạn mục! Tiến gần hơn tới mốc điểm mục tiêu!'
            ];
            this.injectStyles();
        }

        injectStyles() {
            if (document.getElementById('soi-may-companion-styles')) return;
            const style = document.createElement('style');
            style.id = 'soi-may-companion-styles';
            style.textContent = `
                @keyframes soiMayBreathe {
                    0%, 100% { transform: scale(1) translateY(0); }
                    50% { transform: scale(1.025) translateY(-2px); }
                }
                @keyframes soiMayCelebrate {
                    0% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.15) rotate(-6deg); filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.6)); }
                    50% { transform: scale(1.1) rotate(6deg); filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.7)); }
                    75% { transform: scale(1.05) rotate(-2deg); }
                    100% { transform: scale(1) rotate(0deg); filter: none; }
                }
                @keyframes soiMayEncourage {
                    0% { transform: translateY(0); }
                    30% { transform: translateY(4px); }
                    60% { transform: translateY(-2px); }
                    100% { transform: translateY(0); }
                }
                @keyframes bubbleFloatIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.92); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes bubbleFloatOut {
                    from { opacity: 1; transform: translateY(0) scale(1); }
                    to { opacity: 0; transform: translateY(-10px) scale(0.95); }
                }

                .soi-may-breathing {
                    animation: soiMayBreathe 4s ease-in-out infinite;
                }
                .soi-may-celebrate {
                    animation: soiMayCelebrate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .soi-may-encourage {
                    animation: soiMayEncourage 0.6s ease-out;
                }

                .soi-may-speech-bubble {
                    position: fixed;
                    z-index: 10000;
                    pointer-events: none;
                    animation: bubbleFloatIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
                }
                .soi-may-speech-bubble.fade-out {
                    animation: bubbleFloatOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

        // Âm thanh chúc mừng nhẹ nhàng (Micro-chime)
        playChime(type = 'celebrate') {
            try {
                this.initAudio();
                if (!this.audioCtx) return;
                const now = this.audioCtx.currentTime;

                if (type === 'celebrate') {
                    // Hợp âm Arpeggio thăng hoa: C6 -> E6 -> G6 -> C7 (dịu ngọt)
                    const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
                    freqs.forEach((freq, idx) => {
                        const osc = this.audioCtx.createOscillator();
                        const gain = this.audioCtx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, now + (idx * 0.05));
                        gain.gain.setValueAtTime(0.04, now + (idx * 0.05));
                        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.05) + 0.3);
                        osc.connect(gain);
                        gain.connect(this.audioCtx.destination);
                        osc.start(now + (idx * 0.05));
                        osc.stop(now + (idx * 0.05) + 0.35);
                    });
                } else if (type === 'encourage') {
                    // Âm thanh ấm áp, êm dịu vỗ về: F4 -> A4
                    const freqs = [349.23, 440.0];
                    freqs.forEach((freq, idx) => {
                        const osc = this.audioCtx.createOscillator();
                        const gain = this.audioCtx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(freq, now + (idx * 0.08));
                        gain.gain.setValueAtTime(0.04, now + (idx * 0.08));
                        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.08) + 0.4);
                        osc.connect(gain);
                        gain.connect(this.audioCtx.destination);
                        osc.start(now + (idx * 0.08));
                        osc.stop(now + (idx * 0.08) + 0.45);
                    });
                }
            } catch (e) {}
        }

        findMascotAnchor() {
            // Tìm mascot Sói Mây đang hiển thị trên giao diện hiện tại
            const candidates = [
                document.querySelector('#zenFocusHeader img'),
                document.querySelector('#view-vocabulary-study img[src*="may"]'),
                document.querySelector('#view-hom-nay img[src*="may"]'),
                document.querySelector('#sanh-member img[src*="may"]'),
                document.querySelector('header img[src*="may"]')
            ];
            for (const el of candidates) {
                if (el && el.offsetParent !== null) {
                    return el;
                }
            }
            return null;
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
            bubble.className = 'soi-may-speech-bubble px-3.5 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-md text-xs font-bold';
            
            if (type === 'celebrate') {
                bubble.classList.add('bg-slate-900/95', 'text-white', 'border', 'border-cyan-400/60');
                bubble.innerHTML = `
                    <span class="text-amber-400 text-sm">✨</span>
                    <span>${text}</span>
                `;
            } else {
                bubble.classList.add('bg-slate-900/95', 'text-white', 'border', 'border-indigo-400/60');
                bubble.innerHTML = `
                    <span class="text-indigo-400 text-sm">💙</span>
                    <span>${text}</span>
                `;
            }

            document.body.appendChild(bubble);
            this.activeBalloon = bubble;

            // Định vị bong bóng thoại cạnh Mascot
            if (anchorEl) {
                const rect = anchorEl.getBoundingClientRect();
                const bubbleRect = bubble.getBoundingClientRect();
                
                let top = rect.top - bubbleRect.height - 10;
                let left = rect.left + (rect.width / 2) - (bubbleRect.width / 2);

                if (top < 10) top = rect.bottom + 10;
                if (left < 10) left = 10;
                if (left + bubbleRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - bubbleRect.width - 10;
                }

                bubble.style.top = `${top}px`;
                bubble.style.left = `${left}px`;
            } else {
                // Fallback nổi ở góc trên phải
                bubble.style.top = '20px';
                bubble.style.right = '20px';
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
            }, 2600);
        }

        celebrate(customText = null) {
            const text = customText || this.celebrationQuotes[Math.floor(Math.random() * this.celebrationQuotes.length)];
            const anchor = this.findMascotAnchor();
            if (anchor) {
                anchor.classList.remove('soi-may-celebrate', 'soi-may-encourage');
                void anchor.offsetWidth; // Force reflow
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
    console.log('🐺 Sói Mây Reactive Companion Engine initialized successfully.');

})(window, document);
