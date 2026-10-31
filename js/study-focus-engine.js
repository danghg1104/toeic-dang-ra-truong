/**
 * =========================================================================
 * STUDY FOCUS ENGINE (CHẾ ĐỘ TẬP TRUNG HỌC SÂU - STUDY STUDIO ZEN MODE)
 * =========================================================================
 * Chuẩn mực Product Design & Tech Lead cho nền tảng "Tôi Đi Đâu Đó" 2026:
 * - Triệt tiêu 100% sao nhãng: ẩn sidebar, mobile bottom nav, header rườm rà.
 * - Mở rộng không gian bài làm ra 100% chiều ngang màn hình với tỷ lệ vàng tối ưu.
 * - Đồng hồ bấm giờ tập trung (Deep Focus Stopwatch) tự động ghi nhận phút học thực tế.
 * - Tích hợp bộ tạo âm thanh nền học tập (Web Audio API Synthesizer: Mưa êm / Sóng biển / Brown Noise).
 * - Sói Mây học thuật đồng hành tĩnh lặng (Quiet Confidence).
 * - Phím tắt toàn cục: [Alt + Z] bật/tắt, [Escape] thoát chế độ tập trung.
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    class StudyFocusEngineClass {
        constructor() {
            this.isActive = false;
            this.stationName = 'Luyện tập chuyên sâu';
            this.startTime = null;
            this.elapsedSeconds = 0;
            this.timerInterval = null;

            // Ambient Sound Synthesizer (Web Audio API)
            this.audioCtx = null;
            this.noiseNode = null;
            this.gainNode = null;
            this.lfoNode = null;
            this.isSoundPlaying = false;
            this.soundType = localStorage.getItem('study_zen_sound_type') || 'brown'; // 'brown' | 'rain' | 'waves'
            this.volumePercent = parseInt(localStorage.getItem('study_zen_volume') || '40', 10);

            this.initKeyboardShortcuts();
            this.injectStyles();
        }

        // =========================================================================
        // 1. INJECT CSS TẬP TRUNG TOÀN CỤC
        // =========================================================================
        injectStyles() {
            if (document.getElementById('study-focus-styles')) return;
            const style = document.createElement('style');
            style.id = 'study-focus-styles';
            style.textContent = `
                /* Trạng thái kích hoạt Zen Mode toàn trang */
                body.zen-focus-active {
                    background-color: #0b0f19 !important;
                    color: #f1f5f9 !important;
                    overflow-x: hidden;
                    padding-bottom: 2rem !important;
                }

                /* Ẩn triệt để các thành phần ngoại vi gây mất tập trung */
                body.zen-focus-active #sidebarContainer,
                body.zen-focus-active #mobileBottomNav,
                body.zen-focus-active .lg\\:hidden.sticky,
                body.zen-focus-active #sanh-member > div.flex.items-center.justify-between,
                body.zen-focus-active #sanh-member .banner-grammar,
                body.zen-focus-active #sanh-member .banner-reading {
                    display: none !important;
                }

                /* Mở rộng khung nội dung chính ra giữa màn hình chuẩn Studio */
                body.zen-focus-active #mainContent {
                    margin: 0 auto !important;
                    max-width: 1320px !important;
                    width: 100% !important;
                    padding-top: 5rem !important;
                    padding-left: 1rem !important;
                    padding-right: 1rem !important;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                /* Tinh chỉnh màu nền thẻ bài tập trong Zen Mode */
                body.zen-focus-active .glass-panel,
                body.zen-focus-active .bg-white {
                    background-color: #131b2e !important;
                    border-color: rgba(255, 255, 255, 0.08) !important;
                    color: #e2e8f0 !important;
                }

                body.zen-focus-active .text-slate-900 {
                    color: #f8fafc !important;
                }

                body.zen-focus-active .text-slate-600,
                body.zen-focus-active .text-slate-700 {
                    color: #cbd5e1 !important;
                }

                body.zen-focus-active .border-slate-200,
                body.zen-focus-active .border-slate-200\\/80 {
                    border-color: rgba(255, 255, 255, 0.08) !important;
                }

                /* Zen Mode trong Workstations */
                body.zen-focus-active #toeicReadingWorkstation header,
                body.zen-focus-active #toeicListeningWorkstation header {
                    border-bottom-color: rgba(56, 189, 248, 0.2) !important;
                }

                /* Floating Zen HUD trên cùng */
                #zenFocusHeader {
                    animation: zenSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes zenSlideDown {
                    from { transform: translate(-50%, -100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }

                @keyframes zenPulseGlow {
                    0%, 100% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }
                    50% { box-shadow: 0 0 25px rgba(56, 189, 248, 0.6); }
                }
                .zen-pulse-glow {
                    animation: zenPulseGlow 3s infinite ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }

        // =========================================================================
        // 2. PHÍM TẮT TOÀN CỤC (ALT + Z ĐỂ BẬT/TẮT, ESC ĐỂ THOÁT)
        // =========================================================================
        initKeyboardShortcuts() {
            window.addEventListener('keydown', (e) => {
                // Alt + Z: Bật/tắt nhanh chế độ tập trung
                if (e.altKey && (e.code === 'KeyZ' || e.key === 'z' || e.key === 'Z')) {
                    e.preventDefault();
                    this.toggle();
                    return;
                }

                // Escape: Thoát chế độ tập trung nếu đang bật
                if (e.code === 'Escape' && this.isActive) {
                    // Nếu có modal khác đang mở thì ưu tiên modal đó xử lý Esc trước
                    const openModals = document.querySelectorAll('.modal:not(.hidden), [id$="Modal"]:not(.hidden)');
                    if (openModals.length > 0) return;

                    e.preventDefault();
                    this.exit();
                }
            });
        }

        // =========================================================================
        // 3. BẬT CHẾ ĐỘ TẬP TRUNG (ENTER ZEN MODE)
        // =========================================================================
        enter(stationName = 'Luyện tập chuyên sâu') {
            if (this.isActive) {
                this.updateTitle(stationName);
                return;
            }

            this.isActive = true;
            this.stationName = stationName;
            this.startTime = Date.now();
            this.elapsedSeconds = 0;

            document.body.classList.add('zen-focus-active');
            this.createOrUpdateZenHUD();

            // Khởi động đồng hồ bấm giờ (Stopwatch)
            if (this.timerInterval) clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                this.elapsedSeconds++;
                this.updateTimerDisplay();
            }, 1000);

            if (typeof showToast === 'function') {
                showToast('🌿 Đã bật Chế độ Tập trung Học sâu. Nhấn [Alt+Z] hoặc [Esc] để thoát.');
            }
        }

        // =========================================================================
        // 4. THOÁT CHẾ ĐỘ TẬP TRUNG (EXIT ZEN MODE)
        // =========================================================================
        exit() {
            if (!this.isActive) return;

            this.isActive = false;
            document.body.classList.remove('zen-focus-active');

            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }

            // Dừng âm thanh nền nếu đang phát
            this.stopAmbientSound();

            const hud = document.getElementById('zenFocusHeader');
            if (hud) hud.remove();

            // Tính toán thời gian học thực tế và cộng dồn vào hồ sơ
            const focusMinutes = Math.max(1, Math.round(this.elapsedSeconds / 60));
            if (this.elapsedSeconds >= 60) {
                if (window.state) {
                    window.state.studyMinutes = (window.state.studyMinutes || 0) + focusMinutes;
                    window.state.xp = (window.state.xp || 0) + (focusMinutes * 2);
                }
                if (window.currentUserAccount) {
                    window.currentUserAccount.studyMinutes = (window.currentUserAccount.studyMinutes || 0) + focusMinutes;
                    window.currentUserAccount.xp = (window.currentUserAccount.xp || 0) + (focusMinutes * 2);
                }

                if (typeof updateDashboardMetrics === 'function') {
                    updateDashboardMetrics();
                }
                if (typeof saveCurrentUserProgressToServer === 'function') {
                    saveCurrentUserProgressToServer();
                }

                if (typeof showToast === 'function') {
                    showToast(`✨ Xuất sắc! Bạn đã hoàn thành ${focusMinutes} phút tập trung học sâu (+${focusMinutes * 2} XP)!`);
                }
            } else if (typeof showToast === 'function') {
                showToast('Đã thoát Chế độ Tập trung.');
            }
        }

        toggle(stationName) {
            if (this.isActive) this.exit();
            else this.enter(stationName);
        }

        updateTitle(stationName) {
            this.stationName = stationName;
            const el = document.getElementById('zenStationLabel');
            if (el) el.textContent = stationName;
        }

        // =========================================================================
        // 5. GIAO DIỆN THANH ZEN HUD NỔI TRÊN CÙNG
        // =========================================================================
        createOrUpdateZenHUD() {
            let hud = document.getElementById('zenFocusHeader');
            if (hud) {
                this.updateTitle(this.stationName);
                return;
            }

            hud = document.createElement('div');
            hud.id = 'zenFocusHeader';
            hud.className = 'fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex items-center justify-between gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-cyan-500/30 text-white shadow-2xl zen-pulse-glow max-w-2xl w-[92%] sm:w-auto';

            hud.innerHTML = `
                <!-- Bên trái: Mascot Sói Mây & Tên Trạm Học -->
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-slate-800 border border-cyan-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img src="/assets/mascot/may_reading.png" alt="Sói Mây Focus" class="w-full h-full object-contain filter brightness-110">
                    </div>
                    <div class="leading-tight">
                        <div class="flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span class="text-[10px] font-black uppercase tracking-wider text-cyan-300">ZEN FOCUS STUDIO</span>
                        </div>
                        <div id="zenStationLabel" class="text-xs font-extrabold text-slate-100 truncate max-w-[150px] sm:max-w-xs">
                            ${this.stationName}
                        </div>
                    </div>
                </div>

                <div class="h-6 w-px bg-slate-700 mx-1 hidden sm:block"></div>

                <!-- Ở giữa: Đồng hồ bấm giờ tập trung -->
                <div class="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-black text-amber-300">
                    <i class="fa-regular fa-clock text-[11px] text-amber-400"></i>
                    <span id="zenTimerText">00:00</span>
                </div>

                <!-- Bên phải: Nút Âm thanh nền, Bộ chỉnh âm lượng & Nút Thoát -->
                <div class="flex items-center gap-1.5 sm:gap-2">
                    <!-- Dropdown chọn âm nền -->
                    <select id="zenSoundSelector" onchange="StudyFocusEngine.changeSoundType(this.value)" 
                        class="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer">
                        <option value="brown" ${this.soundType === 'brown' ? 'selected' : ''}>🪵 Brown Noise</option>
                        <option value="rain" ${this.soundType === 'rain' ? 'selected' : ''}>🌧️ Mưa êm dịu</option>
                        <option value="waves" ${this.soundType === 'waves' ? 'selected' : ''}>🌊 Sóng biển</option>
                    </select>

                    <!-- Nút Bật/Tắt Âm nền -->
                    <button id="zenAmbientBtn" onclick="StudyFocusEngine.toggleAmbientSound()" 
                        class="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title="Bật/Tắt âm thanh sóng tập trung (Brown Noise)">
                        <i class="fa-solid fa-headphones text-[11px]"></i>
                        <span class="hidden sm:inline text-[11px]" id="zenAmbientLabel">Âm nền</span>
                    </button>

                    <!-- Volume Slider -->
                    <div class="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-xl bg-slate-800/80 border border-slate-700/60" title="Điều chỉnh âm lượng âm nền">
                        <i class="fa-solid fa-volume-low text-[10px] text-slate-400"></i>
                        <input id="zenVolumeSlider" type="range" min="0" max="100" value="${this.volumePercent}" 
                            oninput="StudyFocusEngine.setVolume(this.value)" 
                            class="w-14 sm:w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400">
                        <span id="zenVolumeLabel" class="text-[10px] font-mono text-cyan-300 w-6 text-right">${this.volumePercent}%</span>
                    </div>

                    <button onclick="StudyFocusEngine.exit()" 
                        class="px-3 py-1 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        title="Thoát chế độ tập trung (Esc)">
                        <i class="fa-solid fa-xmark text-xs"></i>
                        <span class="hidden sm:inline">Thoát</span>
                    </button>
                </div>
            `;

            document.body.appendChild(hud);
        }

        updateTimerDisplay() {
            const el = document.getElementById('zenTimerText');
            if (!el) return;
            const m = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
            const s = (this.elapsedSeconds % 60).toString().padStart(2, '0');
            el.textContent = `${m}:${s}`;
        }

        // =========================================================================
        // 6. TỔNG HỢP ÂM THANH NỀN SINH HỌC TẬP TRUNG (WEB AUDIO API - 0KB CDN)
        // =========================================================================
        initAudio() {
            if (!this.audioCtx && typeof window.AudioContext !== 'undefined') {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        }

        setVolume(val) {
            this.volumePercent = Math.min(100, Math.max(0, parseInt(val, 10)));
            localStorage.setItem('study_zen_volume', this.volumePercent.toString());
            const lbl = document.getElementById('zenVolumeLabel');
            if (lbl) lbl.textContent = `${this.volumePercent}%`;

            if (this.gainNode && this.audioCtx) {
                // Công thức logarithmic volume chuẩn tai người
                const targetGain = (this.volumePercent / 100) * 0.16;
                this.gainNode.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);
            }
        }

        changeSoundType(newType) {
            this.soundType = newType;
            localStorage.setItem('study_zen_sound_type', newType);
            if (this.isSoundPlaying) {
                this.stopAmbientSound();
                this.startAmbientSound();
            }
        }

        toggleAmbientSound() {
            if (this.isSoundPlaying) {
                this.stopAmbientSound();
            } else {
                this.startAmbientSound();
            }
        }

        startAmbientSound() {
            try {
                this.initAudio();
                if (!this.audioCtx) return;

                const sampleRate = this.audioCtx.sampleRate;
                const bufferSize = sampleRate * 3; // 3 giây loop
                const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, sampleRate);
                const output = noiseBuffer.getChannelData(0);

                if (this.soundType === 'brown') {
                    // Brown Noise: Random Walk
                    let lastOut = 0.0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        output[i] = (lastOut + (0.02 * white)) / 1.02;
                        lastOut = output[i];
                        output[i] *= 3.5;
                    }
                } else if (this.soundType === 'rain') {
                    // Tiếng mưa rơi: Pink Noise kết hợp hạt mưa rải rác
                    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        b0 = 0.99886 * b0 + white * 0.0555179;
                        b1 = 0.99332 * b1 + white * 0.0750759;
                        b2 = 0.96900 * b2 + white * 0.1538520;
                        b3 = 0.86650 * b3 + white * 0.3104856;
                        b4 = 0.55000 * b4 + white * 0.5329522;
                        b5 = -0.7616 * b5 - white * 0.0168980;
                        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                        b6 = white * 0.115926;
                        // Thỉnh thoảng có hạt mưa gõ nhẹ
                        const raindrop = Math.random() > 0.995 ? (Math.random() - 0.5) * 1.5 : 0;
                        output[i] = (pink * 0.18 + raindrop) * 1.8;
                    }
                } else {
                    // Sóng biển (Ocean Waves): Pink noise điều chế biên độ chu kỳ 8 giây
                    let lastOut = 0.0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        output[i] = (lastOut + (0.025 * white)) / 1.02;
                        lastOut = output[i];
                        output[i] *= 3.2;
                    }
                }

                this.noiseNode = this.audioCtx.createBufferSource();
                this.noiseNode.buffer = noiseBuffer;
                this.noiseNode.loop = true;

                // Bộ lọc Biquad Filter
                const filter = this.audioCtx.createBiquadFilter();
                if (this.soundType === 'rain') {
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(650, this.audioCtx.currentTime);
                } else if (this.soundType === 'waves') {
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(380, this.audioCtx.currentTime);
                    // LFO điều chế tần số lọc tạo hiệu ứng sóng dạt dào 8s
                    const lfo = this.audioCtx.createOscillator();
                    const lfoGain = this.audioCtx.createGain();
                    lfo.frequency.setValueAtTime(0.125, this.audioCtx.currentTime); // 8 giây / chu kỳ sóng
                    lfoGain.gain.setValueAtTime(150, this.audioCtx.currentTime);
                    lfo.connect(lfoGain);
                    lfoGain.connect(filter.frequency);
                    lfo.start();
                    this.lfoNode = lfo;
                } else {
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
                }

                this.gainNode = this.audioCtx.createGain();
                const targetGain = (this.volumePercent / 100) * 0.16;
                this.gainNode.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);

                this.noiseNode.connect(filter);
                filter.connect(this.gainNode);
                this.gainNode.connect(this.audioCtx.destination);

                this.noiseNode.start();
                this.isSoundPlaying = true;

                const btn = document.getElementById('zenAmbientBtn');
                const lbl = document.getElementById('zenAmbientLabel');
                if (btn) btn.className = 'px-2.5 py-1 rounded-xl bg-cyan-600 text-white border border-cyan-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm';
                if (lbl) {
                    const soundNames = { brown: 'Đang phát Brown Noise', rain: 'Đang phát Mưa êm', waves: 'Đang phát Sóng biển' };
                    lbl.textContent = soundNames[this.soundType] || 'Đang phát';
                }

                if (typeof showToast === 'function') {
                    const soundTitles = { brown: '🪵 Brown Noise', rain: '🌧️ Tiếng mưa êm dịu', waves: '🌊 Tiếng sóng biển dạt dào' };
                    showToast(`🎧 ${soundTitles[this.soundType] || 'Âm nền'} (Âm lượng ${this.volumePercent}%).`);
                }
            } catch (e) {
                console.warn('Lỗi bật âm thanh tập trung:', e);
            }
        }

        stopAmbientSound() {
            try {
                if (this.noiseNode) {
                    this.noiseNode.stop();
                    this.noiseNode.disconnect();
                    this.noiseNode = null;
                }
                if (this.lfoNode) {
                    this.lfoNode.stop();
                    this.lfoNode.disconnect();
                    this.lfoNode = null;
                }
                this.isSoundPlaying = false;

                const btn = document.getElementById('zenAmbientBtn');
                const lbl = document.getElementById('zenAmbientLabel');
                if (btn) btn.className = 'px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer';
                if (lbl) lbl.textContent = 'Âm nền';
            } catch (e) {}
        }
    }

    window.StudyFocusEngine = new StudyFocusEngineClass();

})(window, document);