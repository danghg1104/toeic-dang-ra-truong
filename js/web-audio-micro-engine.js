/**
 * =========================================================================
 * WEB AUDIO MICRO-ENGINE & FOCUS SOUNDSCAPE (STUDY STUDIO 2026)
 * =========================================================================
 * Trạm âm thanh phản xạ micro-interactions 0ms latency (0KB MP3 CDN):
 * 1. playDing(): Nốt E6 (1318.5Hz) giòn tan khi làm đúng câu trắc nghiệm.
 * 2. playComboCheer(count): Hợp âm Arpeggio ngân vang chúc mừng chuỗi liên tiếp.
 * 3. fireConfetti(): Bắn pháo hoa giấy Canvas Confetti kết hợp âm thanh fanfare.
 * 4. startPomodoro(mode, onTick, onComplete): Đồng hồ 25/5 chuẩn Pomodoro với 3
 *    kênh âm thanh nền tổng hợp (Lo-fi beat, Mưa rơi hiên nhà, Quán cà phê yên tĩnh).
 * 5. startExamSoundscape(onCountdownTick): Âm nền phòng thi thực tế (quạt trần,
 *    lật giấy thi, ho khẽ) + Cảnh báo nhấp nháy đỏ 5 phút cuối (<= 300s).
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    class WebAudioMicroEngineClass {
        constructor() {
            this.audioCtx = null;
            this.isSoundEnabled = true;
            this.masterVolume = 0.7;
            try {
                if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && window.localStorage !== null) {
                    const soundPref = window.localStorage.getItem('web_audio_micro_sound_enabled');
                    if (soundPref !== null) {
                        this.isSoundEnabled = (soundPref !== 'false');
                    }
                    const volPref = window.localStorage.getItem('web_audio_micro_volume');
                    if (volPref !== null) {
                        this.masterVolume = parseFloat(volPref) || 0.7;
                    }
                }
            } catch (e) {
                // Gracefully fallback on private browsing or sandboxed iframe
            }

            // Pomodoro State
            this.pomodoroInterval = null;
            this.pomodoroRemaining = 1500; // 25 min default
            this.pomodoroTotal = 1500;
            this.pomodoroMode = 'work'; // 'work' | 'break'
            this.pomodoroIsRunning = false;
            this.pomodoroAmbientType = 'lofi'; // 'lofi' | 'rain' | 'cafe' | 'none'
            this.pomodoroAmbientNodes = null;
            this._pomodoroOnTick = null;
            this._pomodoroOnComplete = null;

            // Exam Soundscape State
            this.examInterval = null;
            this.examRemaining = 3600; // 60 min default
            this.examTotal = 3600;
            this.examIsRunning = false;
            this.examAmbientNodes = null;
            this._examOnCountdownTick = null;

            // Initialize user gesture unlock
            this._setupGestureUnlock();
        }

        // =========================================================================
        // AUDIO CONTEXT & CORE SYNTHESIZER UTILITIES
        // =========================================================================

        getAudioContext() {
            if (!this.audioCtx) {
                try {
                    const AudioContextClass = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) ||
                                              (typeof global !== 'undefined' && (global.AudioContext || global.webkitAudioContext));
                    if (AudioContextClass) {
                        this.audioCtx = new AudioContextClass();
                    }
                } catch (e) {
                    this.audioCtx = null;
                }
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                try {
                    this.audioCtx.resume().catch(() => {});
                } catch (e) {}
            }
            return this.audioCtx;
        }

        _setupGestureUnlock() {
            if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
            const unlock = () => {
                const ctx = this.getAudioContext();
                if (ctx && ctx.state === 'suspended') {
                    try {
                        ctx.resume().catch(() => {});
                    } catch (e) {}
                }
                window.removeEventListener('click', unlock);
                window.removeEventListener('touchstart', unlock);
                window.removeEventListener('keydown', unlock);
            };
            window.addEventListener('click', unlock, { once: true, passive: true });
            window.addEventListener('touchstart', unlock, { once: true, passive: true });
            window.addEventListener('keydown', unlock, { once: true, passive: true });
        }

        setSoundEnabled(enabled) {
            this.isSoundEnabled = Boolean(enabled);
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem('web_audio_micro_sound_enabled', this.isSoundEnabled ? 'true' : 'false');
                }
            } catch (e) {}
            if (!this.isSoundEnabled) {
                this._stopAmbientAudio();
            }
            return this.isSoundEnabled;
        }

        toggleSound() {
            return this.setSoundEnabled(!this.isSoundEnabled);
        }

        setVolume(val) {
            this.masterVolume = Math.max(0, Math.min(1, parseFloat(val) || 0.7));
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem('web_audio_micro_volume', this.masterVolume.toString());
                }
            } catch (e) {}
            if (this.pomodoroAmbientNodes && this.pomodoroAmbientNodes.masterGain && this.audioCtx) {
                this.pomodoroAmbientNodes.masterGain.gain.setValueAtTime(this.masterVolume * 0.35, this.audioCtx.currentTime);
            }
            if (this.examAmbientNodes && this.examAmbientNodes.masterGain && this.audioCtx) {
                this.examAmbientNodes.masterGain.gain.setValueAtTime(this.masterVolume * 0.28, this.audioCtx.currentTime);
            }
        }

        // =========================================================================
        // 1. PLAY DING (Nốt E6 1318.5Hz - ĐÁP ÁN ĐÚNG 0ms LATENCY)
        // =========================================================================
        playThud() {
            if (!this.isSoundEnabled) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(160, now);
                osc.frequency.exponentialRampToValueAtTime(70, now + 0.09);

                const peakGain = 0.18 * this.masterVolume;
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(peakGain, now + 0.008);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.1);
            } catch (e) {
                console.warn('playThud audio error:', e);
            }
        }

        playPop() {
            if (!this.isSoundEnabled) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(950, now + 0.06);

                const peakGain = 0.15 * this.masterVolume;
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(peakGain, now + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.07);
            } catch (e) {
                console.warn('playPop audio error:', e);
            }
        }

        playDing() {
            if (!this.isSoundEnabled) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;

            // Nốt chính E6 (1318.51Hz)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Nốt họa âm E7 (2637.02Hz) tạo độ sáng trong trẻo
            const sparkle = ctx.createOscillator();
            const sparkleGain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1318.51, now);

            sparkle.type = 'sine';
            sparkle.frequency.setValueAtTime(2637.02, now);

            // Envelope decay nhanh 0.4s
            const peakGain = 0.22 * this.masterVolume;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(peakGain, now + 0.005); // Rapid 5ms attack
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);

            sparkleGain.gain.setValueAtTime(0.0001, now);
            sparkleGain.gain.linearRampToValueAtTime(peakGain * 0.35, now + 0.005);
            sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

            osc.connect(gain);
            sparkle.connect(sparkleGain);

            gain.connect(ctx.destination);
            sparkleGain.connect(ctx.destination);

            osc.start(now);
            sparkle.start(now);
            osc.stop(now + 0.41);
            sparkle.stop(now + 0.41);
        }

        // =========================================================================
        // 2. PLAY COMBO CHEER (HỢP ÂM ARPEGGIO CHÚC MỪNG CHIẾN THẮNG)
        // =========================================================================
        playComboCheer(comboCount = 5) {
            if (!this.isSoundEnabled) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;

            // C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
            const baseNotes = [523.25, 659.25, 783.99, 1046.50];
            if (comboCount >= 5) {
                // Thêm nốt E6 và G6 hoành tráng cho combo >= 5
                baseNotes.push(1318.51);
                baseNotes.push(1567.98);
            }

            baseNotes.forEach((freq, idx) => {
                const startTime = now + idx * 0.065;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle'; // Âm sắc ấm và vang
                osc.frequency.setValueAtTime(freq, startTime);

                // Thêm vibrato nhẹ tạo cảm giác reo mừng
                const vibrato = ctx.createOscillator();
                const vibratoGain = ctx.createGain();
                vibrato.frequency.setValueAtTime(6.0, startTime);
                vibratoGain.gain.setValueAtTime(3.5, startTime);
                vibrato.connect(osc.frequency);
                vibrato.start(startTime);
                vibrato.stop(startTime + 0.45);

                const noteGain = (0.16 * this.masterVolume) * (1 - idx * 0.08);
                gain.gain.setValueAtTime(0.001, startTime);
                gain.gain.linearRampToValueAtTime(noteGain, startTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.46);
            });
        }

        // =========================================================================
        // 3. FIRE CONFETTI (PHÁO HOA GIẤY CANVAS CONFETTI)
        // =========================================================================
        fireConfetti(customOptions = {}) {
            // Phát âm thanh reo mừng hoành tráng
            this.playComboCheer(6);

            const confettiFunc = window.confetti || (typeof confetti === 'function' ? confetti : null);
            if (!confettiFunc) {
                console.info('🎉 Confetti: Record broken! (canvas-confetti library fallback)');
                return;
            }

            const defaults = {
                particleCount: 80,
                spread: 75,
                origin: { y: 0.65 },
                colors: ['#3157D5', '#F2B84B', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B'],
                ticks: 240,
                zIndex: 99999
            };

            const options = Object.assign({}, defaults, customOptions);

            // Bắn 2 pháo kép từ hai bên góc màn hình tạo hiệu ứng vòm
            confettiFunc(Object.assign({}, options, {
                particleCount: 50,
                angle: 60,
                origin: { x: 0.05, y: 0.75 }
            }));

            confettiFunc(Object.assign({}, options, {
                particleCount: 50,
                angle: 120,
                origin: { x: 0.95, y: 0.75 }
            }));

            // Bắn tỏa giữa tâm
            setTimeout(() => {
                confettiFunc(Object.assign({}, options, {
                    particleCount: 60,
                    spread: 100,
                    origin: { x: 0.5, y: 0.55 }
                }));
            }, 180);
        }

        // =========================================================================
        // 4. POMODORO FOCUS 25/5 & 3 CHANNELS AMBIENT AUDIO
        // =========================================================================

        /**
         * Bắt đầu phiên Pomodoro
         * @param {'work'|'break'} mode 
         * @param {function} onTick - ({ remainingSeconds, totalSeconds, formattedTime, mode, isRunning })
         * @param {function} onComplete - ()
         */
        startPomodoro(mode = 'work', onTick = null, onComplete = null, customSeconds = null) {
            this.stopPomodoro();

            this.pomodoroMode = mode;
            if (typeof customSeconds === 'number' && customSeconds > 0) {
                this.pomodoroTotal = Math.round(customSeconds);
            } else {
                this.pomodoroTotal = (mode === 'break') ? (5 * 60) : (25 * 60);
            }
            this.pomodoroRemaining = this.pomodoroTotal;
            this.pomodoroIsRunning = true;
            this._pomodoroOnTick = onTick;
            this._pomodoroOnComplete = onComplete;

            // Bật âm thanh nền đã chọn
            this._startAmbientAudio(this.pomodoroAmbientType);

            const tick = () => {
                const formatted = this._formatSeconds(this.pomodoroRemaining);
                if (typeof this._pomodoroOnTick === 'function') {
                    this._pomodoroOnTick({
                        remainingSeconds: this.pomodoroRemaining,
                        totalSeconds: this.pomodoroTotal,
                        formattedTime: formatted,
                        mode: this.pomodoroMode,
                        isRunning: this.pomodoroIsRunning
                    });
                }

                if (this.pomodoroRemaining <= 0) {
                    this.stopPomodoro();
                    this.playSingingBowlChime();
                    if (typeof this._pomodoroOnComplete === 'function') {
                        this._pomodoroOnComplete();
                    }
                    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                        const nextMsg = (this.pomodoroMode === 'work')
                            ? '⏰ Đã hoàn thành 25 phút Pomodoro! Đến giờ giải lao 5 phút rồi 🎉'
                            : '⚡ Hết giờ nghỉ 5 phút! Sẵn sàng cho chặng tiếp theo nhé! 🐺';
                        window.showToast(nextMsg);
                    }
                    return;
                }

                this.pomodoroRemaining--;
            };

            tick();
            this.pomodoroInterval = setInterval(tick, 1000);
        }

                /**
         * Thêm/bớt giây trực tiếp vào phiên Pomodoro đang chạy hoặc tạm dừng
         * @param {number} deltaSeconds - Số giây cộng thêm (+300s = 5p, -60s = 1p)
         */
        addPomodoroSeconds(deltaSeconds) {
            this.pomodoroRemaining = Math.max(0, this.pomodoroRemaining + deltaSeconds);
            this.pomodoroTotal = Math.max(this.pomodoroTotal, this.pomodoroRemaining);
            const formatted = this._formatSeconds(this.pomodoroRemaining);
            if (typeof this._pomodoroOnTick === 'function') {
                this._pomodoroOnTick({
                    remainingSeconds: this.pomodoroRemaining,
                    totalSeconds: this.pomodoroTotal,
                    formattedTime: formatted,
                    mode: this.pomodoroMode,
                    isRunning: this.pomodoroIsRunning
                });
            }
        }

        /**
         * Thiết lập thời lượng Pomodoro tùy chỉnh khi chưa chạy
         * @param {number} totalSeconds
         */
        setPomodoroSeconds(totalSeconds) {
            this.pomodoroTotal = Math.max(10, Math.round(totalSeconds));
            this.pomodoroRemaining = this.pomodoroTotal;
            const formatted = this._formatSeconds(this.pomodoroRemaining);
            if (typeof this._pomodoroOnTick === 'function') {
                this._pomodoroOnTick({
                    remainingSeconds: this.pomodoroRemaining,
                    totalSeconds: this.pomodoroTotal,
                    formattedTime: formatted,
                    mode: this.pomodoroMode,
                    isRunning: this.pomodoroIsRunning
                });
            }
        }

        pausePomodoro() {
            this.pomodoroIsRunning = false;
            if (this.pomodoroInterval) {
                clearInterval(this.pomodoroInterval);
                this.pomodoroInterval = null;
            }
            this._stopAmbientAudio();
        }

        resumePomodoro(onTick = null, onComplete = null) {
            if (this.pomodoroRemaining <= 0) return;
            if (this.pomodoroInterval) {
                clearInterval(this.pomodoroInterval);
                this.pomodoroInterval = null;
            }
            if (typeof onTick === 'function') this._pomodoroOnTick = onTick;
            if (typeof onComplete === 'function') this._pomodoroOnComplete = onComplete;

            this.pomodoroIsRunning = true;
            this._startAmbientAudio(this.pomodoroAmbientType);

            const tick = () => {
                const formatted = this._formatSeconds(this.pomodoroRemaining);
                if (typeof this._pomodoroOnTick === 'function') {
                    this._pomodoroOnTick({
                        remainingSeconds: this.pomodoroRemaining,
                        totalSeconds: this.pomodoroTotal,
                        formattedTime: formatted,
                        mode: this.pomodoroMode,
                        isRunning: this.pomodoroIsRunning
                    });
                }

                if (this.pomodoroRemaining <= 0) {
                    this.stopPomodoro();
                    this.playSingingBowlChime();
                    if (typeof this._pomodoroOnComplete === 'function') {
                        this._pomodoroOnComplete();
                    }
                    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                        const nextMsg = (this.pomodoroMode === 'work')
                            ? '⏰ Đã hoàn thành 25 phút Pomodoro! Đến giờ giải lao 5 phút rồi 🎉'
                            : '⚡ Hết giờ nghỉ 5 phút! Sẵn sàng cho chặng tiếp theo nhé! 🐺';
                        window.showToast(nextMsg);
                    }
                    return;
                }

                this.pomodoroRemaining--;
            };

            this.pomodoroInterval = setInterval(tick, 1000);
        }

        stopPomodoro() {
            this.pomodoroIsRunning = false;
            if (this.pomodoroInterval) {
                clearInterval(this.pomodoroInterval);
                this.pomodoroInterval = null;
            }
            this._stopAmbientAudio();
        }

        setAmbient(type) {
            this.pomodoroAmbientType = type || 'none';
            if (this.pomodoroIsRunning) {
                this._startAmbientAudio(this.pomodoroAmbientType);
            }
        }

        getPomodoroState() {
            return {
                mode: this.pomodoroMode,
                remainingSeconds: this.pomodoroRemaining,
                totalSeconds: this.pomodoroTotal,
                formattedTime: this._formatSeconds(this.pomodoroRemaining),
                isRunning: this.pomodoroIsRunning,
                ambientType: this.pomodoroAmbientType
            };
        }

        // =========================================================================
        // 5. EXAM SOUNDSCAPE & LAST 5-MIN RED COUNTDOWN FLASH
        // =========================================================================

        /**
         * Bắt đầu môi trường phòng thi thực tế
         * @param {function} onCountdownTick - ({ remainingSeconds, formattedTime, isUrgent })
         */
        startExamSoundscape(durationSeconds = 7200, onCountdownTick = null) {
            this.stopExamSoundscape();

            this.examTotal = durationSeconds;
            this.examRemaining = durationSeconds;
            this.examIsRunning = true;
            this._examOnCountdownTick = onCountdownTick;

            // Kích hoạt synthesizer âm thanh phòng thi
            this._startExamAtmosphereAudio();

            const tick = () => {
                const isUrgent = this.examRemaining <= 300; // <= 5 phút cuối
                const formatted = this._formatSeconds(this.examRemaining);

                // Cập nhật class nhấp nháy đỏ trên toàn bộ phần tử đồng hồ thi
                this._updateUrgentTimerUI(isUrgent);

                if (typeof this._examOnCountdownTick === 'function') {
                    this._examOnCountdownTick({
                        remainingSeconds: this.examRemaining,
                        totalSeconds: this.examTotal,
                        formattedTime: formatted,
                        isUrgent: isUrgent
                    });
                }

                if (this.examRemaining <= 0) {
                    this.stopExamSoundscape();
                    this.playSingingBowlChime();
                    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                        window.showToast('🛑 HẾT GIỜ LÀM BÀI THI! Đang lưu kết quả...');
                    }
                    return;
                }

                this.examRemaining--;
            };

            tick();
            this.examInterval = setInterval(tick, 1000);
        }

        pauseExamSoundscape() {
            this.examIsRunning = false;
            if (this.examInterval) {
                clearInterval(this.examInterval);
                this.examInterval = null;
            }
            this._stopExamAtmosphereAudio();
        }

        resumeExamSoundscape(onCountdownTick = null) {
            if (this.examRemaining <= 0) return;
            if (this.examInterval) {
                clearInterval(this.examInterval);
                this.examInterval = null;
            }
            if (typeof onCountdownTick === 'function') this._examOnCountdownTick = onCountdownTick;

            this.examIsRunning = true;
            this._startExamAtmosphereAudio();

            const tick = () => {
                const isUrgent = this.examRemaining <= 300;
                const formatted = this._formatSeconds(this.examRemaining);
                this._updateUrgentTimerUI(isUrgent);

                if (typeof this._examOnCountdownTick === 'function') {
                    this._examOnCountdownTick({
                        remainingSeconds: this.examRemaining,
                        totalSeconds: this.examTotal,
                        formattedTime: formatted,
                        isUrgent: isUrgent
                    });
                }

                if (this.examRemaining <= 0) {
                    this.stopExamSoundscape();
                    this.playSingingBowlChime();
                    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                        window.showToast('🛑 HẾT GIỜ LÀM BÀI THI! Đang lưu kết quả...');
                    }
                    return;
                }

                this.examRemaining--;
            };

            this.examInterval = setInterval(tick, 1000);
        }

        stopExamSoundscape() {
            this.examIsRunning = false;
            if (this.examInterval) {
                clearInterval(this.examInterval);
                this.examInterval = null;
            }
            this._stopExamAtmosphereAudio();
            this._updateUrgentTimerUI(false);
        }

        _updateUrgentTimerUI(isUrgent) {
            const timerElements = document.querySelectorAll(
                '#trwTimer, #tlwTimer, .exam-countdown-display, #examCountdownBox'
            );
            timerElements.forEach(el => {
                if (isUrgent) {
                    el.classList.add('exam-timer-urgency');
                } else {
                    el.classList.remove('exam-timer-urgency');
                }
            });
        }

        // =========================================================================
        // AMBIENT SYNTHESIZERS (LO-FI, RAIN, CAFE, EXAM HALL)
        // =========================================================================

        _startAmbientAudio(type) {
            this._stopAmbientAudio();
            if (!this.isSoundEnabled || type === 'none') return;
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
            masterGain.gain.linearRampToValueAtTime(this.masterVolume * 0.28, ctx.currentTime + 1.2);
            masterGain.connect(ctx.destination);

            this.pomodoroAmbientNodes = {
                masterGain: masterGain,
                cleanup: []
            };

            if (type === 'lofi') {
                this._synthesizeLoFiBeat(ctx, masterGain);
            } else if (type === 'rain') {
                this._synthesizeGentleRain(ctx, masterGain);
            } else if (type === 'cafe') {
                this._synthesizeQuietCafe(ctx, masterGain);
            }
        }

        _stopAmbientAudio() {
            if (this.pomodoroAmbientNodes) {
                const nodesToClean = this.pomodoroAmbientNodes;
                this.pomodoroAmbientNodes = null;
                try {
                    const ctx = this.getAudioContext();
                    if (ctx && nodesToClean.masterGain) {
                        nodesToClean.masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
                    }
                } catch (e) {}

                if (nodesToClean && nodesToClean.cleanup) {
                    nodesToClean.cleanup.forEach(fn => {
                        try { fn(); } catch (err) {}
                    });
                }
            }
        }

        /**
         * Kênh 1: Lo-fi Beat (Hợp âm Rhodes ấm áp + Tiếng đĩa than Vinyl xước)
         */
        _synthesizeLoFiBeat(ctx, destNode) {
            // 1. Vinyl Crackle Noise
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                // Tạo tiếng lách tách vinyl ngẫu nhiên
                if (Math.random() < 0.0035) {
                    data[i] = (Math.random() * 2 - 1) * 0.6;
                } else {
                    data[i] = (Math.random() * 2 - 1) * 0.03;
                }
            }

            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = buffer;
            noiseSource.loop = true;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1400, ctx.currentTime);
            noiseFilter.Q.setValueAtTime(1.2, ctx.currentTime);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);

            noiseSource.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(destNode);
            noiseSource.start();

            // 2. Chords Progression (Dm9 -> G13 -> Cmaj7 -> Am7) lặp lại
            const chordChords = [
                [293.66, 349.23, 440.00, 523.25], // Dm9
                [246.94, 329.63, 392.00, 523.25], // G13
                [261.63, 329.63, 392.00, 493.88], // Cmaj7
                [220.00, 261.63, 329.63, 440.00]  // Am7
            ];

            let chordIndex = 0;
            const playNextChord = () => {
                if (!this.pomodoroAmbientNodes) return;
                const now = ctx.currentTime;
                const notes = chordChords[chordIndex % chordChords.length];
                chordIndex++;

                notes.forEach(f => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const filter = ctx.createBiquadFilter();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(650, now);

                    gain.gain.setValueAtTime(0.0001, now);
                    gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(destNode);

                    osc.start(now);
                    osc.stop(now + 4.0);
                });
            };

            playNextChord();
            const chordInterval = setInterval(playNextChord, 4000);

            this.pomodoroAmbientNodes.cleanup.push(() => {
                clearInterval(chordInterval);
                try { noiseSource.stop(); } catch (e) {}
            });
        }

        /**
         * Kênh 2: Gentle Rain (Mưa rơi hiên nhà - Pink noise + giọt mưa lộp bộp)
         */
        _synthesizeGentleRain(ctx, destNode) {
            // 1. Continuous Pink Noise
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
                b6 = white * 0.115926;
            }

            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = buffer;
            noiseSource.loop = true;

            const rainFilter = ctx.createBiquadFilter();
            rainFilter.type = 'lowpass';
            rainFilter.frequency.setValueAtTime(950, ctx.currentTime);

            noiseSource.connect(rainFilter);
            rainFilter.connect(destNode);
            noiseSource.start();

            // 2. Random Water Drop Ticks
            const dropInterval = setInterval(() => {
                if (!this.pomodoroAmbientNodes) return;
                const now = ctx.currentTime;
                const dropOsc = ctx.createOscillator();
                const dropGain = ctx.createGain();

                const freq = 1200 + Math.random() * 800;
                dropOsc.type = 'sine';
                dropOsc.frequency.setValueAtTime(freq, now);
                dropOsc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.04);

                dropGain.gain.setValueAtTime(0.02, now);
                dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

                dropOsc.connect(dropGain);
                dropGain.connect(destNode);

                dropOsc.start(now);
                dropOsc.stop(now + 0.05);
            }, 350);

            this.pomodoroAmbientNodes.cleanup.push(() => {
                clearInterval(dropInterval);
                try { noiseSource.stop(); } catch (e) {}
            });
        }

        /**
         * Kênh 3: Quiet Coffee Shop (Tiếng rì rầm xa xa + tách sứ va chạm ngẫu nhiên)
         */
        _synthesizeQuietCafe(ctx, destNode) {
            // 1. Muffled Low Murmur
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.12;
            }

            const murmurSource = ctx.createBufferSource();
            murmurSource.buffer = buffer;
            murmurSource.loop = true;

            const murmurFilter = ctx.createBiquadFilter();
            murmurFilter.type = 'bandpass';
            murmurFilter.frequency.setValueAtTime(260, ctx.currentTime);
            murmurFilter.Q.setValueAtTime(0.8, ctx.currentTime);

            murmurSource.connect(murmurFilter);
            murmurFilter.connect(destNode);
            murmurSource.start();

            // 2. Ceramic Cup / Spoon Clinks (Poisson process every 4-7s)
            const scheduleNextClink = () => {
                if (!this.pomodoroAmbientNodes) return;
                const delay = 3500 + Math.random() * 4000;
                clinkTimer = setTimeout(() => {
                    if (!this.pomodoroAmbientNodes) return;
                    const now = ctx.currentTime;
                    const clinkOsc = ctx.createOscillator();
                    const clinkGain = ctx.createGain();

                    clinkOsc.type = 'sine';
                    clinkOsc.frequency.setValueAtTime(2850 + Math.random() * 600, now);

                    clinkGain.gain.setValueAtTime(0.025, now);
                    clinkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

                    clinkOsc.connect(clinkGain);
                    clinkGain.connect(destNode);

                    clinkOsc.start(now);
                    clinkOsc.stop(now + 0.13);

                    scheduleNextClink();
                }, delay);
            };

            let clinkTimer = null;
            scheduleNextClink();

            this.pomodoroAmbientNodes.cleanup.push(() => {
                if (clinkTimer) clearTimeout(clinkTimer);
                try { murmurSource.stop(); } catch (e) {}
            });
        }

        /**
         * Âm nền phòng thi: Quạt trần 60Hz + Tiếng sột soạt giấy thi + Tiếng ho khẽ
         */
        _startExamAtmosphereAudio() {
            this._stopExamAtmosphereAudio();
            if (!this.isSoundEnabled) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
            masterGain.gain.linearRampToValueAtTime(this.masterVolume * 0.22, ctx.currentTime + 1.0);
            masterGain.connect(ctx.destination);

            // 1. Quạt gió trần 60Hz Hum với LFO 0.5Hz modulation
            const fanOsc = ctx.createOscillator();
            const fanGain = ctx.createGain();
            fanOsc.type = 'sawtooth';
            fanOsc.frequency.setValueAtTime(60.0, ctx.currentTime);

            const fanFilter = ctx.createBiquadFilter();
            fanFilter.type = 'lowpass';
            fanFilter.frequency.setValueAtTime(140, ctx.currentTime);

            // LFO tạo nhịp xoay cánh quạt
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(0.45, ctx.currentTime);
            lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);
            lfo.connect(fanGain.gain);

            fanGain.gain.setValueAtTime(0.06, ctx.currentTime);
            fanOsc.connect(fanFilter);
            fanFilter.connect(fanGain);
            fanGain.connect(masterGain);

            fanOsc.start();
            lfo.start();

            // 2. Paper Rustle ngẫu nhiên (Lật trang đề thi)
            const rustleInterval = setInterval(() => {
                if (!this.examAmbientNodes) return;
                const now = ctx.currentTime;
                const bSize = ctx.sampleRate * 0.35;
                const b = ctx.createBuffer(1, bSize, ctx.sampleRate);
                const d = b.getChannelData(0);
                for (let i = 0; i < bSize; i++) {
                    d[i] = (Math.random() * 2 - 1) * 0.08;
                }
                const rustleSrc = ctx.createBufferSource();
                rustleSrc.buffer = b;

                const rustleFilter = ctx.createBiquadFilter();
                rustleFilter.type = 'highpass';
                rustleFilter.frequency.setValueAtTime(2200, now);

                const rustleGain = ctx.createGain();
                rustleGain.gain.setValueAtTime(0.015, now);
                rustleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

                rustleSrc.connect(rustleFilter);
                rustleFilter.connect(rustleGain);
                rustleGain.connect(masterGain);

                rustleSrc.start(now);
                rustleSrc.stop(now + 0.35);
            }, 12000);

            this.examAmbientNodes = {
                masterGain: masterGain,
                cleanup: [
                    () => {
                        clearInterval(rustleInterval);
                        try { fanOsc.stop(); lfo.stop(); } catch (e) {}
                    }
                ]
            };
        }

        _stopExamAtmosphereAudio() {
            if (this.examAmbientNodes) {
                const nodesToClean = this.examAmbientNodes;
                this.examAmbientNodes = null;
                try {
                    const ctx = this.getAudioContext();
                    if (ctx && nodesToClean.masterGain) {
                        nodesToClean.masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
                    }
                } catch (e) {}

                if (nodesToClean && nodesToClean.cleanup) {
                    nodesToClean.cleanup.forEach(fn => {
                        try { fn(); } catch (err) {}
                    });
                }
            }
        }

        /**
         * Chuông Tây Tạng (Singing Bowl Chime - Kết thúc Pomodoro & Bài thi)
         */
        playSingingBowlChime() {
            if (!this.isSoundEnabled) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            // Tần số 432Hz tự nhiên & họa âm 864Hz
            [432, 864].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                const amp = (0.20 * this.masterVolume) / (idx + 1);
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(amp, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 3.25);
            });
        }

        _formatSeconds(sec) {
            if (!Number.isFinite(sec) || sec < 0) return '00:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }
    }

    // Khởi tạo Global Singleton
    window.WebAudioMicroEngine = new WebAudioMicroEngineClass();

})(window, document);


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WebAudioMicroEngine: window.WebAudioMicroEngine };
}
