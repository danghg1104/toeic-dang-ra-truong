/**
 * Tôi Đi Đâu Đó - UI Motion & Sound Engine
 * Điều phối toàn bộ hiệu ứng động, hạt pháo hoa (Confetti) và âm thanh xúc giác (Web Audio)
 */

(function(window) {
    'use strict';

    // 1. WEB AUDIO API SYNTHESIZER (Không cần file mp3, dung lượng 0 KB)
    let audioCtx = null;
    let isSoundEnabled = localStorage.getItem('ui_motion_sound_enabled') !== 'false';

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const sound = {
        isEnabled: function() { return isSoundEnabled; },
        toggle: function(forceState) {
            isSoundEnabled = (typeof forceState === 'boolean') ? forceState : !isSoundEnabled;
            localStorage.setItem('ui_motion_sound_enabled', isSoundEnabled ? 'true' : 'false');
            return isSoundEnabled;
        },
        pop: function() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            osc.start(now);
            osc.stop(now + 0.06);
        },
        success: function() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // Hợp âm 3 nốt Đô Trưởng (C5 - E5 - G5)
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                const startOffset = now + idx * 0.06;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, startOffset);

                gain.gain.setValueAtTime(0.08, startOffset);
                gain.gain.exponentialRampToValueAtTime(0.001, startOffset + 0.28);

                osc.start(startOffset);
                osc.stop(startOffset + 0.28);
            });
        },
        streak: function() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // Âm thanh vút lên của ngọn lửa streak (G4 -> B4 -> D5 -> G5)
            const notes = [392.00, 493.88, 587.33, 783.99];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                const startOffset = now + idx * 0.05;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startOffset);

                gain.gain.setValueAtTime(0.1, startOffset);
                gain.gain.exponentialRampToValueAtTime(0.001, startOffset + 0.35);

                osc.start(startOffset);
                osc.stop(startOffset + 0.35);
            });
        }
    };

    // 2. CONFETTI PHYSICS (Bung pháo giấy mừng chiến thắng)
    const confettiWrapper = {
        fire: function() {
            if (typeof window.confetti === 'function') {
                window.confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.65 },
                    colors: ['#4f46e5', '#f59e0b', '#10b981', '#ec4899', '#38bdf8'],
                    disableForReducedMotion: true
                });
            }
            sound.success();
        },
        streak: function() {
            if (typeof window.confetti === 'function') {
                window.confetti({
                    particleCount: 60,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#f59e0b', '#fbbf24', '#f97316', '#ef4444'],
                    shapes: ['circle', 'star'],
                    disableForReducedMotion: true
                });
            }
            sound.streak();
        },
        burstFromElement: function(element) {
            if (!element || typeof window.confetti !== 'function') return;
            const rect = element.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            window.confetti({
                particleCount: 35,
                spread: 45,
                origin: { x: x, y: y },
                colors: ['#10b981', '#34d399', '#6ee7b7', '#facc15'],
                disableForReducedMotion: true
            });
            sound.pop();
        }
    };

    // 3. SPRING PROGRESS BAR ANIMATOR
    function animateProgress(barElement, targetPercent, durationMs = 600) {
        if (!barElement) return;
        const startWidth = parseFloat(barElement.style.width) || 0;
        const target = Math.min(Math.max(targetPercent, 0), 100);
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease-out cubic formula
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentWidth = startWidth + (target - startWidth) * easeProgress;
            barElement.style.width = currentWidth + '%';

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // 4. CARD 3D TILT MICRO-INTERACTION (Góc nghiêng nhẹ tinh tế theo chuột)
    function bindTilt(cardElement, maxTiltDeg = 3.5) {
        if (!cardElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        cardElement.style.transition = 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)';
        cardElement.style.transformStyle = 'preserve-3d';

        cardElement.addEventListener('mousemove', function(e) {
            const rect = cardElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -maxTiltDeg;
            const rotateY = ((x - centerX) / centerX) * maxTiltDeg;

            cardElement.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
        });

        cardElement.addEventListener('mouseleave', function() {
            cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    }

    // 5. GLOBAL INITIALIZER
    function init() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('[data-sound="pop"], .motion-btn');
            if (btn) {
                sound.pop();
            }
            const completeTaskBtn = e.target.closest('[data-action="complete-task"]');
            if (completeTaskBtn) {
                confettiWrapper.burstFromElement(completeTaskBtn);
            }
        });
    }

    // Tự động khởi chạy khi trang đã nạp xong DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export toàn cầu
    window.UIMotion = {
        sound: sound,
        confetti: confettiWrapper,
        animateProgress: animateProgress,
        bindTilt: bindTilt,
        init: init
    };

})(window);
