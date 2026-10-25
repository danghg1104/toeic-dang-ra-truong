/**
 * =========================================================================
 * TOEIC AUDIO PLAYER COMPONENT & STATE MACHINE (ETS 2026 EDITION)
 * =========================================================================
 * - Finite State Machine: IDLE -> LOADING -> PLAYING -> PAUSED -> BUFFERING -> ENDED -> ERROR
 * - Hỗ trợ 2 Chế độ: PRACTICE (Luyện tập - replay tự do, A-B loop) vs EXAM (Thi thật - 1 lần nghe)
 * - Lặp đoạn A-B (A-B Repeat Looping) phục vụ luyện nghe sâu từng câu thoại khó
 * - Preload audio câu tiếp theo trong nền
 * - Phím tắt toàn diện: Space, R, 1-4, A-D, Enter
 * - Tối ưu 100% cho iOS Safari (Autoplay policy, unlock audio context, HTTP Range)
 * - Visualizer thanh sóng âm thanh (Equalizer/Waveform) chuyển động nhẹ
 * =========================================================================
 */

(function(window) {
    'use strict';

    // Các trạng thái của State Machine
    const AudioState = {
        IDLE: 'IDLE',
        LOADING: 'LOADING',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        BUFFERING: 'BUFFERING',
        ENDED: 'ENDED',
        ERROR: 'ERROR'
    };

    class ToeicAudioPlayer {
        constructor(options = {}) {
            this.state = AudioState.IDLE;
            this.mode = options.mode || 'practice'; // 'practice' | 'exam'
            this.containerId = options.containerId || 'toeicAudioPlayerContainer';
            this.onStateChange = options.onStateChange || null;
            this.onOptionSelect = options.onOptionSelect || null;
            this.onNextQuestion = options.onNextQuestion || null;
            this.onErrorFallback = options.onErrorFallback || null;

            // HTML5 Audio Element
            this.audio = new Audio();
            this.audio.preload = 'auto';
            this.audio.crossOrigin = 'anonymous';

            // Audio Preloader (cho câu tiếp theo)
            this.preloader = new Audio();
            this.preloader.preload = 'auto';

            // Thuộc tính phát
            this.currentUrl = '';
            this.currentSpeed = 1.0;
            this.hasPlayedInExamMode = false;
            this.playCount = 0;

            // Điểm lặp A-B
            this.pointA = null;
            this.pointB = null;
            this.isAbLoopActive = false;

            // Đăng ký sự kiện âm thanh
            this._setupAudioEvents();
            this._setupKeyboardShortcuts();
            this._setupMobileAudioUnlock();
        }

        // =====================================================================
        // 1. STATE MACHINE & CONTROLS
        // =====================================================================

        _setState(newState, metadata = {}) {
            const oldState = this.state;
            this.state = newState;
            if (typeof this.onStateChange === 'function') {
                this.onStateChange(this.state, oldState, metadata);
            }
            this._updateUI();
        }

        getState() {
            return this.state;
        }

        setMode(newMode) {
            this.mode = newMode === 'exam' ? 'exam' : 'practice';
            if (this.mode === 'exam') {
                this.clearAB(); // Chế độ thi không cho phép lặp A-B
            }
            this._updateUI();
        }

        load(audioUrl, options = {}) {
            if (!audioUrl) return;
            this.currentUrl = audioUrl;
            this.hasPlayedInExamMode = false;
            this.playCount = 0;
            this.clearAB();

            this._setState(AudioState.LOADING);
            this.audio.src = audioUrl;
            this.audio.playbackRate = this.currentSpeed;
            this.audio.load();

            if (options.autoPlay) {
                this.play();
            }
        }

        play() {
            // Kiểm tra quy chế phòng thi ETS
            if (this.mode === 'exam' && this.hasPlayedInExamMode) {
                if (typeof window.showToast === 'function') {
                    window.showToast('⏱️ Chế độ thi: Audio mỗi câu chỉ được nghe duy nhất 1 lần!');
                }
                return;
            }

            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this._setState(AudioState.PLAYING);
                    this.hasPlayedInExamMode = true;
                    this.playCount++;
                }).catch(err => {
                    console.warn('ToeicAudioPlayer play interrupted or policy blocked:', err.message);
                    this._handlePlayFailure(err);
                });
            }
        }

        pause() {
            if (this.state === AudioState.PLAYING || this.state === AudioState.BUFFERING) {
                this.audio.pause();
                this._setState(AudioState.PAUSED);
            }
        }

        togglePlay() {
            if (this.state === AudioState.PLAYING) {
                this.pause();
            } else if (this.state === AudioState.PAUSED || this.state === AudioState.IDLE || this.state === AudioState.ENDED) {
                this.play();
            }
        }

        seek(deltaSeconds) {
            if (!this.audio.duration || isNaN(this.audio.duration)) return;
            const newTime = Math.max(0, Math.min(this.audio.duration, this.audio.currentTime + deltaSeconds));
            this.audio.currentTime = newTime;
        }

        seekToPercent(percent) {
            if (!this.audio.duration || isNaN(this.audio.duration)) return;
            const targetTime = (Math.max(0, Math.min(100, percent)) / 100) * this.audio.duration;
            this.audio.currentTime = targetTime;
        }

        setSpeed(speed) {
            this.currentSpeed = Math.max(0.5, Math.min(2.0, parseFloat(speed) || 1.0));
            this.audio.playbackRate = this.currentSpeed;
            this._updateUI();
        }

        replay() {
            if (this.mode === 'exam' && this.hasPlayedInExamMode) {
                if (typeof window.showToast === 'function') {
                    window.showToast('⚠️ Không thể nghe lại ở Chế độ thi!');
                }
                return;
            }
            this.audio.currentTime = 0;
            this.play();
        }

        // =====================================================================
        // 2. TÍNH NĂNG LẶP ĐOẠN A-B (CHO CHẾ ĐỘ HỌC)
        // =====================================================================

        setPointA() {
            if (this.mode === 'exam') return;
            this.pointA = this.audio.currentTime;
            this.isAbLoopActive = false;
            if (typeof window.showToast === 'function') {
                window.showToast(`📌 Đã đặt điểm bắt đầu [A] tại ${this._formatTime(this.pointA)}`);
            }
            this._updateUI();
        }

        setPointB() {
            if (this.mode === 'exam' || this.pointA === null) return;
            if (this.audio.currentTime <= this.pointA) {
                if (typeof window.showToast === 'function') {
                    window.showToast('⚠️ Điểm [B] phải lớn hơn điểm [A]!');
                }
                return;
            }
            this.pointB = this.audio.currentTime;
            this.isAbLoopActive = true;
            this.audio.currentTime = this.pointA;
            this.play();
            if (typeof window.showToast === 'function') {
                window.showToast(`🔁 Đang lặp đoạn A-B (${this._formatTime(this.pointA)} ➜ ${this._formatTime(this.pointB)})`);
            }
            this._updateUI();
        }

        clearAB() {
            this.pointA = null;
            this.pointB = null;
            this.isAbLoopActive = false;
            this._updateUI();
        }

        // =====================================================================
        // 3. PRELOAD CÂU KẾ TIẾP & TỐI ƯU BĂNG THÔNG
        // =====================================================================

        preloadNext(nextAudioUrl) {
            if (!nextAudioUrl || nextAudioUrl === this.currentUrl) return;
            try {
                this.preloader.src = nextAudioUrl;
                this.preloader.load();
            } catch (e) {
                // Preload error is safe to ignore
            }
        }

        // =====================================================================
        // 4. SỰ KIỆN NỘI BỘ AUDIO & XỬ LÝ LỖI / FALLBACK
        // =====================================================================

        _setupAudioEvents() {
            this.audio.addEventListener('waiting', () => {
                if (this.state === AudioState.PLAYING) this._setState(AudioState.BUFFERING);
            });

            this.audio.addEventListener('playing', () => {
                this._setState(AudioState.PLAYING);
            });

            this.audio.addEventListener('timeupdate', () => {
                this._handleTimeUpdate();
            });

            this.audio.addEventListener('ended', () => {
                this._setState(AudioState.ENDED);
                this._updateProgressBar(100);
            });

            this.audio.addEventListener('error', (e) => {
                this._handleAudioError(e);
            });
        }

        _handleTimeUpdate() {
            const current = this.audio.currentTime;
            const duration = this.audio.duration || 0;

            // Xử lý vòng lặp A-B
            if (this.isAbLoopActive && this.pointB !== null && current >= this.pointB) {
                this.audio.currentTime = this.pointA || 0;
                return;
            }

            if (duration > 0) {
                const percent = (current / duration) * 100;
                this._updateProgressBar(percent);
            }
            this._updateTimerLabels(current, duration);
        }

        _handleAudioError(e) {
            console.warn(`ToeicAudioPlayer: Không tải được audio "${this.currentUrl}". Đang kích hoạt Fallback...`);
            this._setState(AudioState.ERROR, { url: this.currentUrl });

            if (typeof this.onErrorFallback === 'function') {
                this.onErrorFallback(this.currentUrl);
            } else if (window.UniversalAudioEngine && typeof window.UniversalAudioEngine.speak === 'function') {
                // Tự động dùng Web Speech API làm phương án dự phòng khẩn cấp
                if (typeof window.showToast === 'function') {
                    window.showToast('⚠️ Đang phát giọng đọc dự phòng do mạng gián đoạn.');
                }
            }
        }

        _handlePlayFailure(err) {
            this._setState(AudioState.PAUSED);
        }

        _setupMobileAudioUnlock() {
            const unlockHandler = () => {
                this.audio.play().then(() => {
                    this.audio.pause();
                    this.audio.currentTime = 0;
                }).catch(() => {});
                document.removeEventListener('touchstart', unlockHandler);
                document.removeEventListener('click', unlockHandler);
            };
            document.addEventListener('touchstart', unlockHandler, { once: true, passive: true });
            document.addEventListener('click', unlockHandler, { once: true, passive: true });
        }

        // =====================================================================
        // 5. BÀN PHÍM PHÍM TẮT THAO TÁC NHANH
        // =====================================================================

        _setupKeyboardShortcuts() {
            window.addEventListener('keydown', (e) => {
                // Bỏ qua nếu người dùng đang gõ trong input/textarea
                const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
                if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;

                // Space: Phát/Tạm dừng
                if (e.code === 'Space' || e.key === ' ') {
                    e.preventDefault();
                    this.togglePlay();
                }
                // R: Nghe lại
                else if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
                    e.preventDefault();
                    this.replay();
                }
                // 1, 2, 3, 4 hoặc A, B, C, D: Chọn đáp án
                else if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'KeyA', 'KeyB', 'KeyC', 'KeyD'].includes(e.code)) {
                    let index = -1;
                    if (e.code === 'Digit1' || e.code === 'KeyA') index = 0;
                    else if (e.code === 'Digit2' || e.code === 'KeyB') index = 1;
                    else if (e.code === 'Digit3' || e.code === 'KeyC') index = 2;
                    else if (e.code === 'Digit4' || e.code === 'KeyD') index = 3;

                    if (index !== -1 && typeof this.onOptionSelect === 'function') {
                        e.preventDefault();
                        this.onOptionSelect(index);
                    }
                }
                // Enter: Chuyển câu tiếp theo
                else if (e.code === 'Enter') {
                    if (typeof this.onNextQuestion === 'function') {
                        e.preventDefault();
                        this.onNextQuestion();
                    }
                }
            });
        }

        // =====================================================================
        // 6. GIAO DIỆN & VISUALIZER SÓNG ÂM
        // =====================================================================

        render() {
            const container = document.getElementById(this.containerId);
            if (!container) return;

            const isExam = this.mode === 'exam';
            const isPlaying = this.state === AudioState.PLAYING;
            const playDisabled = isExam && this.hasPlayedInExamMode && this.state !== AudioState.PLAYING;

            container.innerHTML = `
                <div class="toeic-player-card rounded-2xl bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-indigo-500/10 dark:from-slate-800 dark:to-slate-800 border border-teal-200/80 dark:border-slate-700 p-3.5 space-y-3 shadow-xs">
                    
                    <!-- Top Status Row -->
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${isExam ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300'}">
                                <i class="fa-solid ${isExam ? 'fa-stopwatch' : 'fa-graduation-cap'}"></i>
                                <span>${isExam ? 'Chế độ Thi: Nghe 1 Lần' : 'Chế độ Luyện Tập'}</span>
                            </span>

                            <!-- Waveform Equalizer Animated Bars -->
                            <div class="toeic-waveform-bars flex items-center gap-0.5 h-4 px-1 ${isPlaying ? 'opacity-100' : 'opacity-40'}">
                                <span class="waveform-bar ${isPlaying ? 'animate-wave-1' : ''} w-0.5 h-2 bg-teal-600 rounded-full"></span>
                                <span class="waveform-bar ${isPlaying ? 'animate-wave-2' : ''} w-0.5 h-3.5 bg-teal-500 rounded-full"></span>
                                <span class="waveform-bar ${isPlaying ? 'animate-wave-3' : ''} w-0.5 h-1.5 bg-sky-600 rounded-full"></span>
                                <span class="waveform-bar ${isPlaying ? 'animate-wave-4' : ''} w-0.5 h-3 bg-sky-500 rounded-full"></span>
                                <span class="waveform-bar ${isPlaying ? 'animate-wave-5' : ''} w-0.5 h-2 bg-indigo-600 rounded-full"></span>
                            </div>
                        </div>

                        <!-- Speed Controls -->
                        <div class="flex items-center gap-1">
                            ${[0.75, 1.0, 1.25, 1.5].map(s => `
                                <button type="button" onclick="window._currentToeicAudioPlayer?.setSpeed(${s})" class="px-2 py-0.5 text-[10.5px] font-bold rounded-lg transition ${this.currentSpeed === s ? 'bg-teal-600 text-white shadow-xs' : 'bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                                    ${s}x
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Progress Bar & Scrubbing -->
                    <div class="space-y-1">
                        <div class="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer overflow-hidden" onclick="window._currentToeicAudioPlayer?._handleProgressClick(event)">
                            <div id="toeicPlayerProgressFill" class="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full transition-all duration-100" style="width: 0%"></div>
                        </div>
                        <div class="flex items-center justify-between text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                            <span id="toeicPlayerCurrentTime">00:00</span>
                            <span id="toeicPlayerDuration">--:--</span>
                        </div>
                    </div>

                    <!-- Playback Action Controls Row -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        
                        <!-- Left: Seek -5s, Play/Pause, Seek +5s -->
                        <div class="flex items-center gap-1.5">
                            <button type="button" onclick="window._currentToeicAudioPlayer?.seek(-5)" title="Tua lùi 5 giây" class="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 text-xs font-bold transition flex items-center justify-center shadow-xs">
                                <i class="fa-solid fa-rotate-left"></i>
                            </button>

                            <button type="button" onclick="window._currentToeicAudioPlayer?.togglePlay()" ${playDisabled ? 'disabled' : ''} class="px-4 py-2 rounded-xl ${playDisabled ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white shadow-md active:scale-95'} text-xs font-bold transition flex items-center gap-2">
                                <i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs"></i>
                                <span>${isPlaying ? 'Tạm dừng' : (this.state === AudioState.ENDED ? 'Nghe lại' : 'Phát Audio')}</span>
                            </button>

                            <button type="button" onclick="window._currentToeicAudioPlayer?.seek(5)" title="Tua tới 5 giây" class="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 text-xs font-bold transition flex items-center justify-center shadow-xs">
                                <i class="fa-solid fa-rotate-right"></i>
                            </button>

                            <button type="button" onclick="window._currentToeicAudioPlayer?.replay()" ${playDisabled ? 'disabled' : ''} title="Nghe lại từ đầu" class="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 transition shadow-xs flex items-center gap-1">
                                <i class="fa-solid fa-arrows-rotate text-[10px]"></i>
                                <span class="hidden sm:inline">Từ đầu</span>
                            </button>
                        </div>

                        <!-- Right: A-B Loop Controls (Practice mode only) -->
                        ${!isExam ? `
                            <div class="flex items-center gap-1">
                                <button type="button" onclick="window._currentToeicAudioPlayer?.setPointA()" class="px-2 py-1 rounded-lg ${this.pointA !== null ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'} text-[11px] font-bold border border-slate-200 dark:border-slate-600 hover:bg-amber-50 transition" title="Đặt điểm bắt đầu đoạn lặp [A]">
                                    [A] ${this.pointA !== null ? this._formatTime(this.pointA) : ''}
                                </button>
                                <button type="button" onclick="window._currentToeicAudioPlayer?.setPointB()" class="px-2 py-1 rounded-lg ${this.pointB !== null ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'} text-[11px] font-bold border border-slate-200 dark:border-slate-600 hover:bg-amber-50 transition" title="Đặt điểm kết thúc đoạn lặp [B]">
                                    [B] ${this.pointB !== null ? this._formatTime(this.pointB) : ''}
                                </button>
                                ${this.isAbLoopActive ? `
                                    <button type="button" onclick="window._currentToeicAudioPlayer?.clearAB()" class="p-1 rounded-lg text-rose-500 hover:bg-rose-50 text-xs" title="Hủy lặp A-B">
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        _handleProgressClick(e) {
            const bar = e.currentTarget;
            const rect = bar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = (clickX / rect.width) * 100;
            this.seekToPercent(percent);
        }

        _updateProgressBar(percent) {
            const el = document.getElementById('toeicPlayerProgressFill');
            if (el) el.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        }

        _updateTimerLabels(current, duration) {
            const curEl = document.getElementById('toeicPlayerCurrentTime');
            const durEl = document.getElementById('toeicPlayerDuration');
            if (curEl) curEl.textContent = this._formatTime(current);
            if (durEl && duration > 0) durEl.textContent = this._formatTime(duration);
        }

        _updateUI() {
            this.render();
        }

        _formatTime(seconds) {
            if (isNaN(seconds) || seconds < 0) return '00:00';
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }
    }

    // Gắn vào window và export
    window.AudioState = AudioState;
    window.ToeicAudioPlayer = ToeicAudioPlayer;

})(typeof window !== 'undefined' ? window : global);
