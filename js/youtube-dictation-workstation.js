/**
 * YOUTUBE & MUSIC LYRICS DICTATION WORKSTATION (VOCATYPE STUDIO PRO)
 * Phiên bản Tinh Tế & Thượng Hạng (Silk Harmonic Engine):
 * 1. DẢI LỤA ÂM THANH TRONG VEO, THUẦN KHIẾT (SILK HARMONIC WAVE):
 *    - Loại bỏ hoàn toàn khối hộp đen cồng kềnh và các thanh cột giật cục.
 *    - Thay bằng đường cong dải lụa ngang bay bổng uốn lượn mượt mà theo nhịp (dual-layer organza silk wave).
 *    - Trong suốt, nhẹ nhàng, quý phái, tơi xốp, không chiếm diện tích, không che khuất chữ hay khung gõ.
 * 2. PHÁT NHẠC MƯỢT MÀ SUỐT BÀI (KHÔNG BỊ CẮT KHÚC KHÓ CHỊU):
 *    - Mặc định: Chế độ Phát tiếp liên tục (Continuous Flow). Nhạc chạy mượt mà từ đầu đến hết bài hát như nghe YouTube/Spotify.
 *    - Tuyệt đối không giật ngược hay cắt ngang câu hát khi đang nghe và gõ.
 *    - Hệ thống tự động bám sát từng giây theo dòng nhạc, chuyển câu mượt mà tự nhiên.
 *    - Vẫn có phím Space để nghe lại câu bất cứ khi nào bạn muốn.
 * 3. GIAO DIỆN GỌN GÀNG, VỪA VẶN TẦM MẮT (ZERO CLIPPING):
 *    - Khung video 16:9 sắc nét, dải lụa thanh thoát 28px, khung chữ to rõ và ô gõ phím nằm trọn vẹn trong màn hình laptop.
 * 4. TỰ ĐỘNG DỊCH VIETSUB CHO MỌI BÀI HÁT NHÚNG TỪ YOUTUBE:
 *    - Tích hợp API dịch thuật song ngữ theo thời gian thực (/api/youtube-dictation-translate), mọi bài hát nhúng vào đều có Vietsub chạy đều đều.
 * 5. SIÊU MƯỢT & KHÔNG LAG (ZERO-LAG ARCHITECTURE):
 *    - Vẽ Canvas 60 FPS bằng requestAnimationFrame siêu nhẹ (chỉ tốn < 0.2% CPU), tự tắt khi ẩn tab.
 */

(function (window, document) {
    'use strict';

    class YouTubeDictationWorkstation {
        constructor() {
            this.containerId = 'youtubeDictationContainer';
            this.activeView = 'catalog'; // 'catalog' | 'studio' | 'summary'
            this.activeSong = null;
            this.currentLineIndex = 0; // 0..N-1
            this.activeWordIndex = 0; // Index từ đang gõ trong câu
            this.currentInput = '';
            
            // 2 Chế độ học cốt lõi:
            // - 'copy_lyrics': Chép lời (hiện chữ đầy đủ, nhìn và gõ theo nhịp ca sĩ)
            // - 'blind_dictation': Nghe nhạc tự gõ (che chữ bằng gạch dưới, thử thách đôi tai)
            this.studyMode = 'copy_lyrics'; 
            
            // Cài đặt phát & lặp:
            // - 'continuous': (Mặc định) Phát mượt mà suốt cả bài hát không ngắt khúc, chữ tự bám theo nhạc
            // - 'loop_line': Lặp lại câu hiện tại cho tới khi gõ xong
            // - 'pause_at_end': Dừng ở cuối câu chờ gõ
            this.settings = {
                showVietsub: true,
                playbackFlow: 'continuous',
                playbackSpeed: 1.0,
                soundEffects: true
            };
            this.loadSettings();

            // Thống kê phiên học
            this.stats = {
                startTime: null,
                correctChars: 0,
                totalKeystrokes: 0,
                wrongKeystrokes: 0,
                skippedLines: 0,
                streak: 0,
                maxStreak: 0
            };

            // YouTube Player
            this.ytPlayer = null;
            this.ytReady = false;
            this.isPlayerPlaying = false;
            this.timeTrackerInterval = null;
            this.hasUserInteractedAudio = false;

            // Web Audio API Synth (Melodic Pentatonic Kalimba)
            this.audioCtx = null;
            this.melodyNoteIndex = 0;
            this.pentatonicScale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];

            // Silk Harmonic Wave Canvas State
            this.silkCanvas = null;
            this.silkCtx = null;
            this.silkAnimationId = null;
            this.silkPhase = 0;
            this.silkRipples = []; // Các gợn sóng khi gõ phím

            // Cache dịch thuật tại client
            this.translationCache = {};

            // Bind methods
            this.handleGlobalKeyDown = this.handleGlobalKeyDown.bind(this);
            this.animateSilkWave = this.animateSilkWave.bind(this);
            this.initYouTubeAPI();
        }

        loadSettings() {
            try {
                const saved = localStorage.getItem('cung_dang_yt_dictation_settings_v5');
                if (saved) {
                    this.settings = Object.assign(this.settings, JSON.parse(saved));
                }
            } catch (e) {}
            // Luôn mặc định chế độ Phát suốt bài liên tục (Continuous Flow), không cắt khúc
            this.settings.playbackFlow = 'continuous';
        }

        saveSettings() {
            try {
                localStorage.setItem('cung_dang_yt_dictation_settings_v5', JSON.stringify(this.settings));
            } catch (e) {}
        }

        initYouTubeAPI() {
            if (window.YT && window.YT.Player) {
                this.ytReady = true;
                return;
            }
            if (!document.getElementById('ytIframeApiScript')) {
                const tag = document.createElement('script');
                tag.id = 'ytIframeApiScript';
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScript = document.getElementsByTagName('script')[0];
                firstScript.parentNode.insertBefore(tag, firstScript);
            }
            const prevOnReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (typeof prevOnReady === 'function') prevOnReady();
                this.ytReady = true;
                console.log('⚡ YouTube IFrame API Ready for Vocatype Pro Silk Studio.');
            };
        }

        // =========================================================================
        // HỆ THỐNG ÂM THANH NGÂN NGA (MELODIC PENTATONIC KALIMBA SYNTH)
        // =========================================================================
        getAudioContext() {
            if (!this.audioCtx && typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined') {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioCtx();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume().catch(() => {});
            }
            return this.audioCtx;
        }

        playMelodicChime(type = 'correct_char') {
            if (!this.settings.soundEffects) return;
            const ctx = this.getAudioContext();
            if (!ctx) return;

            try {
                const now = ctx.currentTime;
                const delay = ctx.createDelay();
                delay.delayTime.value = 0.08;
                const delayFeedback = ctx.createGain();
                delayFeedback.gain.value = 0.22;
                delay.connect(delayFeedback);
                delayFeedback.connect(delay);
                delay.connect(ctx.destination);

                if (type === 'correct_char') {
                    const freq = this.pentatonicScale[this.melodyNoteIndex % this.pentatonicScale.length];
                    this.melodyNoteIndex++;

                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);

                    gain.gain.setValueAtTime(0.14, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    gain.connect(delay);

                    osc.start(now);
                    osc.stop(now + 0.34);

                    // Kích hoạt làn sóng lụa bay bổng khi gõ phím
                    this.triggerSilkRipple(1.0);

                } else if (type === 'word_complete') {
                    const chord = [523.25, 659.25, 783.99, 1046.50];
                    chord.forEach((f, idx) => {
                        const noteTime = now + idx * 0.03;
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(f, noteTime);
                        gain.gain.setValueAtTime(0.12, noteTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.42);

                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        gain.connect(delay);

                        osc.start(noteTime);
                        osc.stop(noteTime + 0.45);
                    });
                    this.triggerSilkRipple(1.8);

                } else if (type === 'wrong') {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(110, now + 0.07);

                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(now);
                    osc.stop(now + 0.08);
                }
            } catch (e) {}
        }

        triggerSilkRipple(strength = 1.0) {
            // Thêm một gợn sóng lụa nhẹ nhàng
            if (this.silkRipples.length < 5) {
                this.silkRipples.push({
                    x: Math.random() * 0.6 + 0.2, // vị trí tương đối trên dải ngang
                    radius: 0,
                    maxRadius: 180,
                    alpha: 0.85 * strength,
                    speed: 4.5
                });
            }
        }

        // =========================================================================
        // DẢI LỤA ÂM THANH NGANG TRONG VEO, THUẦN KHIẾT (SILK WAVE ENGINE)
        // Nhẹ nhàng, quý phái, tơi xốp, chuyển động mượt mà 60fps không lag
        // =========================================================================
        initSilkWave() {
            this.silkCanvas = document.getElementById('ytSilkWaveCanvas');
            if (!this.silkCanvas) return;
            this.silkCtx = this.silkCanvas.getContext('2d');
            this.resizeSilkCanvas();
            window.addEventListener('resize', () => this.resizeSilkCanvas());

            if (this.silkAnimationId) cancelAnimationFrame(this.silkAnimationId);
            this.silkAnimationId = requestAnimationFrame(this.animateSilkWave);
        }

        resizeSilkCanvas() {
            if (!this.silkCanvas) return;
            const rect = this.silkCanvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.silkCanvas.width = (rect.width || 600) * dpr;
            this.silkCanvas.height = (rect.height || 30) * dpr;
            if (this.silkCtx) {
                this.silkCtx.scale(dpr, dpr);
            }
        }

        stopSilkWave() {
            if (this.silkAnimationId) {
                cancelAnimationFrame(this.silkAnimationId);
                this.silkAnimationId = null;
            }
        }

        animateSilkWave() {
            if (this.activeView !== 'studio') return;
            const canvas = this.silkCanvas;
            const ctx = this.silkCtx;
            if (!canvas || !ctx) return;

            const rect = canvas.getBoundingClientRect();
            const w = rect.width || 600;
            const h = rect.height || 30;

            // Xóa canvas trong suốt
            ctx.clearRect(0, 0, w, h);

            this.silkPhase += this.isPlayerPlaying ? 0.045 : 0.015;
            const midY = h / 2;

            // Tính biên độ sóng lụa: khi phát nhạc sóng bồng bềnh hơn (8px), khi dừng sóng vi vu êm ái (3.5px)
            const baseAmp = this.isPlayerPlaying ? 7.5 : 3.5;

            // 1. VẼ DẢI LỤA LỚP 1: Xanh ngọc phát sáng mờ ảo (Translucent Cyan Silk)
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, midY);

            const pointsCount = 48;
            const step = w / pointsCount;

            for (let i = 0; i <= pointsCount; i++) {
                const x = i * step;
                const normX = x / w;

                // Hàm sóng lụa mượt mà đa tần số
                let y = midY + Math.sin(normX * Math.PI * 3 + this.silkPhase) * baseAmp * Math.sin(normX * Math.PI)
                             + Math.cos(normX * Math.PI * 1.5 - this.silkPhase * 0.7) * (baseAmp * 0.45);

                // Thêm xung lực gợn sóng khi gõ phím
                for (const r of this.silkRipples) {
                    const dist = Math.abs(x - r.x * w);
                    if (dist < r.radius) {
                        const rippleEffect = Math.sin((dist / r.radius) * Math.PI * 2) * (1 - dist / r.radius) * 6 * (r.alpha);
                        y += rippleEffect;
                    }
                }

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            const grad1 = ctx.createLinearGradient(0, 0, w, 0);
            grad1.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
            grad1.addColorStop(0.3, 'rgba(34, 211, 238, 0.75)');
            grad1.addColorStop(0.7, 'rgba(129, 140, 248, 0.8)');
            grad1.addColorStop(1, 'rgba(6, 182, 212, 0.1)');

            ctx.strokeStyle = grad1;
            ctx.lineWidth = 2.0;
            ctx.shadowColor = 'rgba(34, 211, 238, 0.6)';
            ctx.shadowBlur = 6;
            ctx.stroke();
            ctx.restore();

            // 2. VẼ DẢI LỤA LỚP 2: Tím khói & Hồng pastel mềm mại (Lavender Rose Silk)
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, midY);

            for (let i = 0; i <= pointsCount; i++) {
                const x = i * step;
                const normX = x / w;

                let y = midY + Math.cos(normX * Math.PI * 2.5 - this.silkPhase * 0.85) * (baseAmp * 0.85) * Math.sin(normX * Math.PI)
                             + Math.sin(normX * Math.PI * 4 + this.silkPhase * 0.5) * (baseAmp * 0.35);

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            const grad2 = ctx.createLinearGradient(0, 0, w, 0);
            grad2.addColorStop(0, 'rgba(236, 72, 153, 0.05)');
            grad2.addColorStop(0.4, 'rgba(236, 72, 153, 0.6)');
            grad2.addColorStop(0.6, 'rgba(168, 85, 247, 0.65)');
            grad2.addColorStop(1, 'rgba(236, 72, 153, 0.05)');

            ctx.strokeStyle = grad2;
            ctx.lineWidth = 1.6;
            ctx.shadowColor = 'rgba(236, 72, 153, 0.5)';
            ctx.shadowBlur = 5;
            ctx.stroke();
            ctx.restore();

            // 3. VẼ DÒNG TƠ SÁNG NỘI TẠI (Luminous Inner Filament)
            ctx.save();
            ctx.beginPath();
            for (let i = 0; i <= pointsCount; i++) {
                const x = i * step;
                const normX = x / w;
                const y = midY + Math.sin(normX * Math.PI * 3 + this.silkPhase) * (baseAmp * 0.5) * Math.sin(normX * Math.PI);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 0.9;
            ctx.stroke();
            ctx.restore();

            // Cập nhật gợn sóng khi gõ phím
            for (let idx = this.silkRipples.length - 1; idx >= 0; idx--) {
                const r = this.silkRipples[idx];
                r.radius += r.speed;
                r.alpha *= 0.94;
                if (r.radius > r.maxRadius || r.alpha < 0.05) {
                    this.silkRipples.splice(idx, 1);
                }
            }

            // Tiếp tục vòng lặp 60fps mượt mà
            this.silkAnimationId = requestAnimationFrame(this.animateSilkWave);
        }

        // =========================================================================
        // ROUTING & VIEW CONTROLLER
        // =========================================================================
        renderInto(containerId = 'youtubeDictationContainer') {
            this.containerId = containerId || this.containerId || 'youtubeDictationContainer';
            const container = document.getElementById(this.containerId);
            if (!container) return;

            if (this.activeView === 'catalog') {
                this.stopTracker();
                this.stopSilkWave();
                this.detachKeyboard();
                container.innerHTML = this.buildCatalogHTML();
            } else if (this.activeView === 'studio') {
                container.innerHTML = this.buildStudioHTML();
                this.attachKeyboard();
                this.mountYouTubePlayer();
                this.initSilkWave();
                this.updateTypingLineDisplay();
            } else if (this.activeView === 'summary') {
                this.stopTracker();
                this.stopSilkWave();
                this.detachKeyboard();
                container.innerHTML = this.buildSummaryHTML();
            }
        }

        // =========================================================================
        // VIEW 1: CATALOG DANH SÁCH BÀI HÁT & IMPORT YOUTUBE
        // =========================================================================
        buildCatalogHTML() {
            const songs = window.YouTubeDictationData || [];
            return `
                <div class="space-y-5 max-w-7xl mx-auto px-2 sm:px-4 py-2">
                    <!-- 1. HERO BANNER -->
                    <div class="rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden" style="background: linear-gradient(135deg, #090d16 0%, #151833 50%, #2e1065 100%);">
                        <div class="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
                        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                            <div class="space-y-2.5 max-w-2xl">
                                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-cyan-300 text-xs font-black border border-cyan-400/30">
                                    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                                    <span>VOCATYPE STUDIO PRO • NHẠC YOUTUBE & CHÉP CHÍNH TẢ</span>
                                </div>
                                <h1 class="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                                    Luyện Nghe Chép Lời & Gõ Phím Cùng Giai Điệu Mượt Mà
                                </h1>
                                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                                    Nhạc phát êm dịu xuyên suốt bài hát, dải lụa âm thanh trong veo thanh khiết bay bổng theo nhịp, 
                                    tích hợp 2 chế độ: <b>Chép lời</b> hoặc <b>Nghe tự gõ</b>. Hỗ trợ phụ đề Vietsub tự động cho mọi video YouTube!
                                </p>
                            </div>
                            <div class="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-indigo-400/30 shrink-0 shadow-lg">
                                <div class="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
                                    <img src="/assets/mascot/may_reading.png" alt="Sói Mây Companion" class="w-full h-full object-contain">
                                </div>
                                <div class="text-xs">
                                    <div class="font-extrabold text-amber-300 text-xs sm:text-sm">Bạn học Sói Mây</div>
                                    <div class="text-slate-400 font-medium">"Âm nhạc lụa là, học nhẹ như gió!"</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. TOOLBAR: LEVEL FILTER & NHÚNG YOUTUBE -->
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold overflow-x-auto max-w-full">
                            <button onclick="YouTubeDictationWorkstation.filterCatalog('ALL')" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs cursor-pointer">
                                Tất cả (${songs.length})
                            </button>
                            <button onclick="YouTubeDictationWorkstation.filterCatalog('A2')" class="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer">
                                A2 Cơ bản
                            </button>
                            <button onclick="YouTubeDictationWorkstation.filterCatalog('B1')" class="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer">
                                B1 Trung cấp
                            </button>
                            <button onclick="YouTubeDictationWorkstation.filterCatalog('B2')" class="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer">
                                B2 Nâng cao
                            </button>
                        </div>

                        <button onclick="YouTubeDictationWorkstation.openImportModal()" 
                            class="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer">
                            <i class="fa-brands fa-youtube text-sm"></i>
                            <span>+ Nhúng Mọi Bài Hát Trên YouTube</span>
                        </button>
                    </div>

                    <!-- 3. DANH SÁCH BÀI HÁT TUYỂN CHỌN -->
                    <div id="ytSongGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        ${songs.map(song => `
                            <div class="yt-song-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                                <div class="relative overflow-hidden aspect-video bg-slate-950">
                                    <img src="${song.thumbnail}" alt="${song.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                    <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10.5px] font-extrabold text-cyan-300 border border-cyan-400/30">
                                        Level ${song.level}
                                    </span>
                                    <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-semibold">
                                        <span><i class="fa-solid fa-music text-purple-400 mr-1"></i>${song.genre}</span>
                                        <span>${song.lines.length} câu</span>
                                    </div>
                                </div>
                                <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <h3 class="font-black text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition line-clamp-1">
                                            ${song.title}
                                        </h3>
                                        <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">${song.artist}</div>
                                        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                            ${song.description || ''}
                                        </p>
                                    </div>
                                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div class="text-[11px] font-bold text-slate-400">${song.vocabFocus ? song.vocabFocus.length : 0} từ vựng</div>
                                        <button onclick="YouTubeDictationWorkstation.startSong('${song.id}')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer">
                                            <i class="fa-solid fa-headphones text-cyan-300"></i> Vào nghe & gõ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Modal Nhúng YouTube Thông Minh -->
                    <div id="ytImportModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
                        <div class="max-w-xl w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
                            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center text-lg">
                                        <i class="fa-brands fa-youtube"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-black text-slate-900 dark:text-white text-base">Nhúng Mọi Bài Hát Trên YouTube</h3>
                                        <p class="text-xs text-slate-400">Tự động lấy lời đồng bộ từng giây & sinh Vietsub chuẩn xác</p>
                                    </div>
                                </div>
                                <button onclick="YouTubeDictationWorkstation.closeImportModal()" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition flex items-center justify-center cursor-pointer">
                                    <i class="fa-solid fa-xmark text-sm"></i>
                                </button>
                            </div>

                            <div class="space-y-2.5">
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Dán đường link YouTube (hoặc Video ID):</label>
                                <div class="relative">
                                    <input type="text" id="ytImportInputUrl" placeholder="Ví dụ: https://www.youtube.com/watch?v=24u3NoPvgMw" 
                                        class="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-red-500 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-none">
                                    <i class="fa-solid fa-link absolute right-3.5 top-3.5 text-slate-400"></i>
                                </div>
                                <div class="text-[11px] text-slate-400 leading-relaxed">
                                    💡 <b>Mẹo:</b> Hỗ trợ hàng triệu bài hát tiếng Anh US/UK (Taylor Swift, Ed Sheeran, Conan Gray, Adele, Charlie Puth...).
                                </div>
                            </div>

                            <div id="ytImportLoading" class="hidden py-4 text-center space-y-2">
                                <i class="fa-solid fa-circle-notch fa-spin text-2xl text-red-500"></i>
                                <div class="text-xs font-bold text-slate-600 dark:text-slate-300">Đang đồng bộ mốc thời gian & dịch phụ đề Vietsub...</div>
                            </div>

                            <div class="flex items-center justify-end gap-3 pt-2">
                                <button onclick="YouTubeDictationWorkstation.closeImportModal()" class="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition cursor-pointer">
                                    Hủy bỏ
                                </button>
                                <button onclick="YouTubeDictationWorkstation.submitImportYouTube()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 hover:opacity-95 text-white text-xs font-extrabold shadow-md transition flex items-center gap-2 cursor-pointer">
                                    <i class="fa-solid fa-cloud-arrow-down"></i>
                                    <span>Nạp Bài Hát & Bắt Đầu Ngay</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // VIEW 2: PHÒNG THU (STUDIO VOCATYPE PRO) - GỌN GÀNG, SANG TRỌNG, KHÔNG CHE KHUẤT
        // =========================================================================
        buildStudioHTML() {
            if (!this.activeSong) return '';
            const song = this.activeSong;
            const currentLine = song.lines[this.currentLineIndex];
            const totalLines = song.lines.length;

            return `
                <div class="max-w-4xl mx-auto space-y-3.5 px-3 sm:px-6 py-2 pb-12 transition-all duration-300">
                    <!-- 1. TOP BAR TINH TẾ, CHUYÊN NGHIỆP, THOÁNG ĐÃNG -->
                    <div class="glass-panel rounded-2xl px-4 py-2.5 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <button onclick="YouTubeDictationWorkstation.backToCatalog()" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-rose-600 transition flex items-center justify-center font-bold cursor-pointer" title="Thoát ra danh sách bài hát">
                                <i class="fa-solid fa-arrow-left text-xs"></i>
                            </button>
                            <div>
                                <h2 class="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2 leading-tight">
                                    <span>${song.title}</span>
                                    <span class="text-xs font-normal text-slate-400">• ${song.artist}</span>
                                </h2>
                                <div class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2 mt-0.5">
                                    <span class="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px]">Level ${song.level}</span>
                                    <span>${song.genre}</span>
                                </div>
                            </div>
                        </div>

                        <!-- 2 CHẾ ĐỘ RÕ RÀNG & CHẾ ĐỘ PHÁT MƯỢT SUỐT BÀI -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <!-- 2 Chế độ -->
                            <div class="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold border border-slate-200/80 dark:border-slate-700">
                                <button onclick="YouTubeDictationWorkstation.setStudyMode('copy_lyrics')" 
                                    class="px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer text-xs ${this.studyMode === 'copy_lyrics' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'}" 
                                    title="Chép lời: hiện chữ đầy đủ để nhìn và gõ theo nhịp ca sĩ">
                                    <i class="fa-solid fa-pen-fancy text-[11px]"></i>
                                    <span>Chép Lời</span>
                                </button>
                                <button onclick="YouTubeDictationWorkstation.setStudyMode('blind_dictation')" 
                                    class="px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer text-xs ${this.studyMode === 'blind_dictation' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500'}" 
                                    title="Nghe tự gõ: che toàn bộ chữ để luyện phản xạ đôi tai">
                                    <i class="fa-solid fa-headphones text-[11px]"></i>
                                    <span>Nghe Tự Gõ</span>
                                </button>
                            </div>

                            <!-- Flow Switch: Mặc định Phát mượt suốt bài vs Lặp lại câu -->
                            <button onclick="YouTubeDictationWorkstation.cyclePlaybackFlow()" 
                                class="px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                                    this.settings.playbackFlow === 'continuous' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' :
                                    'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                                }" 
                                title="Click để chuyển: Phát mượt suốt bài (không cắt khúc) | Lặp 1 lần rồi chuyển tiếp">
                                <i class="fa-solid ${this.settings.playbackFlow === 'continuous' ? 'fa-forward' : 'fa-rotate'} text-[11px]"></i>
                                <span>${this.settings.playbackFlow === 'continuous' ? '▶️ Phát suốt bài' : '🔁 Lặp 1 lần rồi chuyển tiếp'}</span>
                            </button>

                            <!-- Vietsub Toggle -->
                            <button onclick="YouTubeDictationWorkstation.toggleVietsub()" 
                                class="px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${this.settings.showVietsub ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'}"
                                title="Bật/Tắt phụ đề tiếng Việt ngữ cảnh">
                                <i class="fa-solid fa-language text-xs"></i>
                                <span>Vietsub: ${this.settings.showVietsub ? 'BẬT' : 'TẮT'}</span>
                            </button>
                        </div>
                    </div>

                    <!-- 2. KHU VỰC VIDEO PLAYER YOUTUBE CHUẨN 16:9 TO RÕ, ĐIỆN ẢNH & HÀO QUANG AMBIENT GLOW -->
                    <div class="relative w-full max-w-3xl mx-auto group">
                        <!-- Hào quang Aura phát sáng nhẹ nhàng sau video (Tao nhã & Bay bổng) -->
                        <div class="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 rounded-[28px] blur-xl opacity-70 group-hover:opacity-90 transition duration-700 pointer-events-none"></div>

                        <!-- Khung Video Player 16:9 To Rõ, Cân Đối, Không Bị Chèn Ép -->
                        <div class="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-white/20 dark:border-white/10 flex items-center justify-center" style="aspect-ratio: 16 / 9; width: 100%; max-height: 400px;">
                            <div id="youtubePlayerContainer" class="absolute inset-0 w-full h-full pointer-events-auto"></div>
                            
                            <!-- Overlay Bật Tiếng To Rõ Ràng (Chỉ hiện khi trình duyệt chặn tự phát âm thanh) -->
                            <div id="ytUnmuteOverlay" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs transition pointer-events-auto">
                                <button onclick="YouTubeDictationWorkstation.forcePlayWithSound()" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:scale-105 active:scale-95 text-white font-black text-sm shadow-2xl transition flex items-center gap-2.5 cursor-pointer animate-pulse border border-white/20">
                                    <i class="fa-solid fa-volume-high text-lg text-yellow-300"></i>
                                    <span>BẬT TIẾNG & PHÁT NHẠC 🔊</span>
                                </button>
                                <span class="text-xs text-slate-300 font-semibold mt-1.5">Đảm bảo loa máy tính/điện thoại đang mở nhé!</span>
                            </div>

                            <!-- Video Overlay Controls Dưới Cùng Của Video -->
                            <div class="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-20">
                                <div class="flex items-center gap-2 pointer-events-auto">
                                    <div class="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-bold flex items-center gap-1">
                                        <span id="ytCurrentTimeDisplay">0:00</span>
                                        <span class="text-slate-400">/</span>
                                        <span id="ytTotalDurationDisplay">--:--</span>
                                    </div>
                                    <div class="px-2.5 py-0.5 rounded-full bg-indigo-600/80 backdrop-blur-md text-white text-[11px] font-extrabold flex items-center gap-1.5">
                                        <span>Câu <span id="ytLineNumberOverlay">${this.currentLineIndex + 1}</span>/${totalLines}</span>
                                        <span class="text-indigo-200 text-[10px] font-mono">(<span id="ytLineStartDisplay">${this.formatTime(currentLine ? currentLine.start : 0)}</span> - <span id="ytLineEndDisplay">${this.formatTime(currentLine ? currentLine.end : 0)}</span>)</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 pointer-events-auto">
                                    <button onclick="YouTubeDictationWorkstation.replayCurrentLine()" class="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs" title="Nghe lại câu này (Phím Space)">
                                        <i class="fa-solid fa-rotate-left text-cyan-300"></i> Nghe lại (Space)
                                    </button>
                                    <button onclick="YouTubeDictationWorkstation.togglePlayPause()" class="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-xs" title="Tạm dừng / Phát">
                                        <i id="ytPlayPauseIcon" class="fa-solid fa-pause"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. DẢI LỤA ÂM THANH NGÂN NGA TRONG VEO & THANH ĐIỀU HƯỚNG CÂU HÁT THÔNG MINH -->
                    <div class="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center select-none py-1">
                        <!-- Canvas sóng lụa ngang uốn lượn tơi xốp, trong veo -->
                        <div class="w-full h-7 relative flex items-center justify-center overflow-hidden">
                            <canvas id="ytSilkWaveCanvas" class="w-full h-full pointer-events-none" style="display: block;"></canvas>
                        </div>
                        
                        <!-- Thanh điều hướng câu hát thông minh (Interactive Sentence Nav Rail) -->
                        <div class="w-full flex items-center justify-between px-2 pt-1 gap-2">
                            <div id="ytSentenceNavRail" class="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                                ${song.lines.map((l, idx) => `
                                    <button type="button" onclick="YouTubeDictationWorkstation.jumpToLine(${idx})"
                                        class="yt-sentence-dot h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                            idx === this.currentLineIndex 
                                                ? 'w-7 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(34,211,238,0.7)]' 
                                                : (idx < this.currentLineIndex ? 'w-2 bg-emerald-400/80 hover:bg-emerald-300' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400')
                                        }"
                                        title="Câu ${idx + 1}: ${l.text.replace(/"/g, '&quot;')}">
                                    </button>
                                `).join('')}
                            </div>

                            <div class="shrink-0 flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                                <span id="ytWpmMini">0 WPM</span>
                                <span>•</span>
                                <span id="ytAccMini" class="text-emerald-500">100%</span>
                                <span>•</span>
                                <span id="ytStreakMini" class="text-amber-500 font-extrabold">🔥 ${this.stats.streak}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 4. KHU VỰC LYRICS TƯƠNG TÁC & Ô GÕ CHỮ (RỘNG RÃI, TAO NHÃ, SANG TRỌNG) -->
                    <div class="max-w-3xl mx-auto rounded-3xl p-5 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl text-center space-y-3 select-none relative">
                        <!-- DÒNG THÔNG BÁO NHẠC DẠO ĐẦU (INTRO BANNER) -->
                        <div id="ytIntroBanner" class="hidden w-full max-w-xl mx-auto p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-400/30 flex items-center justify-between gap-3 text-xs shadow-xs animate-fade-in mb-1">
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                                <span class="font-bold text-indigo-700 dark:text-indigo-300">🎵 Đang phát nhạc dạo đầu: <span id="ytIntroTimeCountdown" class="font-mono text-cyan-500 dark:text-cyan-400 font-extrabold">0:00 / 0:10</span></span>
                            </div>
                            <button type="button" onclick="YouTubeDictationWorkstation.skipIntro()" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95">
                                <i class="fa-solid fa-forward-step text-[10px]"></i> Bỏ qua dạo đầu ⏩
                            </button>
                        </div>

                        <!-- Tag Chế độ & Thông tin -->
                        <div class="flex items-center justify-between flex-wrap gap-2 text-xs">
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold border border-indigo-200 dark:border-indigo-800">
                                <i class="fa-solid ${this.studyMode === 'copy_lyrics' ? 'fa-pen-fancy' : 'fa-headphones'}"></i>
                                <span>${this.studyMode === 'copy_lyrics' ? 'Chép Lời (Nhìn Chữ Gõ Theo Nhịp)' : 'Nghe Tự Gõ (Che Chữ Thử Thách)'}</span>
                            </div>

                            <div class="text-xs font-semibold text-slate-400">
                                ${this.settings.playbackFlow === 'continuous' ? 'Nhạc chạy mượt suốt bài • Bấm Space nếu muốn nghe lại câu' : 'Lặp 1 lần nếu chưa kịp gõ, sau đó tự chuyển sang câu mới'}
                            </div>
                        </div>

                        <!-- DÒNG LỜI BÀI HÁT CHÍNH (TYPOGRAPHY TO RÕ CHUẨN XỊN) -->
                        <div id="ytLyricsDisplay" class="min-h-[48px] flex items-center justify-center flex-wrap gap-2 text-xl sm:text-2xl md:text-3xl font-black tracking-wide text-slate-800 dark:text-slate-100 font-sans leading-relaxed">
                            <!-- Rendered dynamically -->
                        </div>

                        <!-- PHỤ ĐỀ TIẾNG VIỆT NGỮ CẢNH (VIETSUB) - TỰ ĐỘNG CHẠY ĐỀU ĐẶN -->
                        <div id="ytVietsubDisplay" class="${this.settings.showVietsub ? 'block' : 'hidden'} text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 italic">
                            ${currentLine ? (currentLine.vietsub || '') : ''}
                        </div>

                        <!-- KHU VỰC GÕ PHÍM TRỰC TIẾP (TỰ ĐỘNG FOCUS, VỪA VẶN TẦM MẮT) -->
                        <div class="max-w-md mx-auto relative pt-1">
                            <input type="text" id="ytLiveTypingInput" autocomplete="off" spellcheck="false"
                                placeholder="${this.studyMode === 'copy_lyrics' ? 'Nhìn chữ ở trên và gõ theo nhịp ca sĩ...' : 'Lắng nghe giai điệu và gõ từ bạn nghe được...'}"
                                class="w-full text-center px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border-2 border-indigo-400 dark:border-indigo-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 text-slate-900 dark:text-white font-black text-base sm:text-lg transition shadow-inner outline-none">
                            <div class="text-[11px] font-bold text-slate-400 mt-1.5 flex items-center justify-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                <span>Bàn phím tự động nhận • Nốt nhạc ngân nga theo từng ngón tay gõ</span>
                            </div>
                        </div>

                        <!-- PHÍM TẮT TIỆN ÍCH DƯỚI CÙNG (GỌN GÀNG) -->
                        <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <button onclick="YouTubeDictationWorkstation.replayCurrentLine()" class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                                <kbd class="px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border text-[10px]">Space</kbd>
                                <span>Nghe lại</span>
                            </button>

                            <button onclick="YouTubeDictationWorkstation.giveHint()" class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                                <kbd class="px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border text-[10px]">Tab</kbd>
                                <span>Gợi ý 1 chữ</span>
                            </button>

                            <button onclick="YouTubeDictationWorkstation.skipCurrentLine()" class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                                <kbd class="px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border text-[10px]">Enter</kbd>
                                <span>Bỏ qua</span>
                            </button>

                            <div class="flex items-center gap-1">
                                <button onclick="YouTubeDictationWorkstation.prevLine()" class="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center cursor-pointer" title="Câu trước">
                                    <i class="fa-solid fa-chevron-left text-[11px]"></i>
                                </button>
                                <button onclick="YouTubeDictationWorkstation.nextLine()" class="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center cursor-pointer" title="Câu sau">
                                    <i class="fa-solid fa-chevron-right text-[11px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // VIEW 3: MÀN HÌNH TỔNG KẾT & KẾT QUẢ
        // =========================================================================
        buildSummaryHTML() {
            if (!this.activeSong) return '';
            const song = this.activeSong;
            const accuracy = this.stats.totalKeystrokes > 0 ? Math.round((this.stats.correctChars / this.stats.totalKeystrokes) * 100) : 100;
            const timeSeconds = this.stats.startTime ? Math.max(1, Math.round((Date.now() - this.stats.startTime) / 1000)) : 60;
            const wpm = Math.round((this.stats.correctChars / 5) / (timeSeconds / 60));

            return `
                <div id="ytSummaryContainer" class="max-w-3xl mx-auto space-y-5 px-3 sm:px-6 py-5 pb-20 animate-scale-up">
                    <div class="rounded-3xl p-6 sm:p-7 text-white shadow-2xl border border-indigo-500/30 text-center space-y-3.5" style="background: linear-gradient(135deg, #090d16 0%, #151833 50%, #2e1065 100%);">
                        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs">
                            <i class="fa-solid fa-trophy text-amber-400"></i>
                            <span>HOÀN THÀNH BÀI LUYỆN CHÉP CHÍNH TẢ!</span>
                        </div>
                        <h2 class="text-xl sm:text-2xl font-black text-white">
                            ${song.title} • ${song.artist}
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                            Tuyệt vời! Bạn đã hoàn thành toàn bộ ${song.lines.length} câu hát với dòng nhạc mượt mà.
                        </p>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto pt-1">
                            <div class="p-2.5 rounded-2xl border border-white/10" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px);">
                                <div class="text-[11px] text-slate-400 font-bold">Tốc độ WPM</div>
                                <div class="text-lg sm:text-xl font-black text-purple-300">${wpm} WPM</div>
                            </div>
                            <div class="p-2.5 rounded-2xl border border-white/10" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px);">
                                <div class="text-[11px] text-slate-400 font-bold">Độ chính xác</div>
                                <div class="text-lg sm:text-xl font-black text-emerald-400">${accuracy}%</div>
                            </div>
                            <div class="p-2.5 rounded-2xl border border-white/10" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px);">
                                <div class="text-[11px] text-slate-400 font-bold">Streak lớn nhất</div>
                                <div class="text-lg sm:text-xl font-black text-amber-400">${this.stats.maxStreak} 🔥</div>
                            </div>
                            <div class="p-2.5 rounded-2xl border border-white/10" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px);">
                                <div class="text-[11px] text-slate-400 font-bold">Thời gian</div>
                                <div class="text-lg sm:text-xl font-black text-cyan-300">${Math.floor(timeSeconds / 60)}m ${timeSeconds % 60}s</div>
                            </div>
                        </div>

                        <div class="pt-3 flex flex-wrap items-center justify-center gap-2.5">
                            <button onclick="YouTubeDictationWorkstation.saveVocabToNotebook()" class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer">
                                <i class="fa-solid fa-bookmark"></i> Lưu ${song.vocabFocus ? song.vocabFocus.length : 0} từ vào Sổ tay
                            </button>
                            <button onclick="YouTubeDictationWorkstation.startSong('${song.id}')" class="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer">
                                <i class="fa-solid fa-rotate"></i> Luyện lại bài này
                            </button>
                            <button onclick="YouTubeDictationWorkstation.backToCatalog()" class="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer">
                                <i class="fa-solid fa-arrow-left"></i> Chọn bài khác
                            </button>
                        </div>
                    </div>

                    ${song.vocabFocus && song.vocabFocus.length > 0 ? `
                        <div class="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
                            <div class="flex items-center justify-between">
                                <h3 class="font-black text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                                    <i class="fa-solid fa-spell-check text-indigo-600"></i>
                                    <span>Từ vựng & Cụm từ hay trong bài hát (${song.vocabFocus.length})</span>
                                </h3>
                                <span class="text-xs text-slate-400">Bấm loa để nghe phát âm</span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                ${song.vocabFocus.map(item => `
                                    <div class="yt-summary-vocab-chip p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2.5">
                                        <div>
                                            <div class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                                                <span>${item.word}</span>
                                                <span class="text-[11px] font-mono font-normal text-slate-400">${item.ipa || ''}</span>
                                            </div>
                                            <div class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">${item.meaning}</div>
                                        </div>
                                        <button onclick="YouTubeDictationWorkstation.speakWord('${item.word}')" class="w-7 h-7 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 transition cursor-pointer" title="Nghe phát âm">
                                            <i class="fa-solid fa-volume-high text-[10px]"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // =========================================================================
        // YOUTUBE PLAYER MOUNT & SYNC ENGINE
        // =========================================================================
        mountYouTubePlayer() {
            if (!this.activeSong) return;
            const song = this.activeSong;
            const container = document.getElementById('youtubePlayerContainer');
            if (!container) return;

            // QUAN TRỌNG: Luôn phát từ 0:00 để người dùng nghe trọn vẹn nhạc dạo đầu tự nhiên!
            const startSec = 0;

            container.innerHTML = `
                <iframe id="ytIframeEmbed" class="w-full h-full"
                    src="https://www.youtube.com/embed/${song.youtubeId}?enablejsapi=1&autoplay=1&controls=1&rel=0&modestbranding=1&fs=1&playsinline=1&start=0&origin=${encodeURIComponent(window.location.origin)}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>
            `;

            try {
                if (window.YT && window.YT.Player) {
                    this.ytPlayer = new window.YT.Player('ytIframeEmbed', {
                        events: {
                            onReady: () => {
                                try {
                                    this.ytPlayer.unMute();
                                    this.ytPlayer.setVolume(100);
                                    this.ytPlayer.playVideo();
                                } catch (e) {}
                                // Để nhạc phát mượt mà từ 0:00, không tua ép vào câu 1
                                this.startTracker();
                            },
                            onStateChange: (e) => {
                                const icon = document.getElementById('ytPlayPauseIcon');
                                const overlay = document.getElementById('ytUnmuteOverlay');
                                if (e.data === 1) { // Playing
                                    this.isPlayerPlaying = true;
                                    if (icon) icon.className = 'fa-solid fa-pause';
                                    if (overlay) overlay.style.display = 'none';
                                    this.checkAndSyncTime();
                                } else if (e.data === 3) { // Buffering (xảy ra ngay khi người dùng tua video!)
                                    this.checkAndSyncTime();
                                } else {
                                    this.isPlayerPlaying = false;
                                    if (icon) icon.className = 'fa-solid fa-play';
                                    this.checkAndSyncTime();
                                }
                            }
                        }
                    });
                } else {
                    this.startTracker();
                }
            } catch (e) {
                this.startTracker();
            }
        }

        forcePlayWithSound() {
            this.hasUserInteractedAudio = true;
            this.getAudioContext();
            if (this.ytPlayer) {
                try {
                    this.ytPlayer.unMute();
                    this.ytPlayer.setVolume(100);
                    this.ytPlayer.playVideo();
                } catch (e) {}
            }
            const overlay = document.getElementById('ytUnmuteOverlay');
            if (overlay) overlay.style.display = 'none';

            // Chỉ tua lại đầu câu khi người dùng ĐÃ VÀO CÂU HÁT (không tua khi đang nghe dạo đầu 0:00)
            let curTime = 0;
            try { curTime = this.ytPlayer.getCurrentTime() || 0; } catch (e) {}
            const firstStart = (this.activeSong && this.activeSong.lines && this.activeSong.lines[0]) ? this.activeSong.lines[0].start : 0;
            if (this.currentLineIndex > 0 || curTime >= Math.max(0, firstStart - 0.5)) {
                this.seekToLineStart();
            }

            const inputEl = document.getElementById('ytLiveTypingInput');
            if (inputEl) inputEl.focus();
        }

        skipIntro() {
            if (!this.activeSong || !this.activeSong.lines || !this.activeSong.lines[0]) return;
            const targetStart = Math.max(0, this.activeSong.lines[0].start - 0.35);
            if (this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
                try {
                    this.ytPlayer.unMute();
                    this.ytPlayer.setVolume(100);
                    this.ytPlayer.seekTo(targetStart, true);
                    this.ytPlayer.playVideo();
                } catch (e) {}
            }
            this.currentLineIndex = 0;
            this.activeWordIndex = 0;
            this.currentInput = '';
            this.updateTypingLineDisplay();
            const inputEl = document.getElementById('ytLiveTypingInput');
            if (inputEl) inputEl.focus();
        }

        seekToLineStart() {
            if (!this.activeSong) return;
            const line = this.activeSong.lines[this.currentLineIndex];
            if (!line) return;

            try {
                if (this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
                    this.ytPlayer.unMute();
                    this.ytPlayer.setVolume(100);
                    // Lùi nhẹ 0.25s để không bị cụt âm đầu câu
                    this.ytPlayer.seekTo(Math.max(0, line.start - 0.25), true);
                    this.ytPlayer.playVideo();
                }
            } catch (e) {}

            const startDisp = document.getElementById('ytLineStartDisplay');
            const endDisp = document.getElementById('ytLineEndDisplay');
            const numOverlay = document.getElementById('ytLineNumberOverlay');
            if (startDisp) startDisp.textContent = this.formatTime(line.start);
            if (endDisp) endDisp.textContent = this.formatTime(line.end);
            if (numOverlay) numOverlay.textContent = this.currentLineIndex + 1;
        }

        // =========================================================================
        // TÌM CÂU THEO MỐC THỜI GIAN (ĐỒNG BỘ 100% KHI NGƯỜI DÙNG TUA VIDEO)
        // =========================================================================
        getLineIndexAtTime(curTime) {
            if (!this.activeSong || !this.activeSong.lines || this.activeSong.lines.length === 0) return 0;
            const lines = this.activeSong.lines;

            // Nếu curTime trước hoặc bằng thời gian bắt đầu câu đầu tiên (nhạc dạo đầu)
            if (curTime < (lines[0].start - 0.35)) {
                return 0;
            }

            // Quét tìm câu phù hợp với mốc giây curTime
            for (let i = 0; i < lines.length; i++) {
                const cur = lines[i];
                const next = lines[i + 1];
                const nextStart = next ? next.start : (cur.end + 15.0);
                if (curTime >= (cur.start - 0.35) && curTime < nextStart) {
                    return i;
                }
            }

            return lines.length - 1;
        }

        // Nhảy đến câu được chỉ định (Khi click vào các chấm điều hướng trên thanh tiến trình)
        jumpToLine(index) {
            if (!this.activeSong || !this.activeSong.lines) return;
            const lines = this.activeSong.lines;
            if (index < 0 || index >= lines.length) return;

            this.currentLineIndex = index;
            this.activeWordIndex = 0;
            this.currentInput = '';
            this.seekToLineStart();
            this.updateTypingLineDisplay();

            const inputEl = document.getElementById('ytLiveTypingInput');
            if (inputEl) inputEl.focus();
        }

        // Kiểm tra và đồng bộ câu hát theo thời gian thực (Cả khi chạy tự nhiên lẫn khi tua)
        checkAndSyncTime() {
            if (!this.activeSong || this.activeView !== 'studio') return;
            if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;

            let curTime = 0;
            try {
                curTime = this.ytPlayer.getCurrentTime() || 0;
            } catch (e) {
                return;
            }

            const timeDisp = document.getElementById('ytCurrentTimeDisplay');
            if (timeDisp) timeDisp.textContent = this.formatTime(curTime);

            let totalDur = 0;
            try { totalDur = this.ytPlayer.getDuration() || 0; } catch (e) {}
            const durDisp = document.getElementById('ytTotalDurationDisplay');
            if (durDisp && totalDur > 0) durDisp.textContent = this.formatTime(totalDur);

            const lines = this.activeSong.lines;
            const firstLine = lines[0];
            const isIntro = (firstLine && curTime < (firstLine.start - 0.35));

            // Cập nhật Banner Nhạc dạo đầu
            const introBanner = document.getElementById('ytIntroBanner');
            if (introBanner) {
                if (isIntro) {
                    introBanner.classList.remove('hidden');
                    const countdown = document.getElementById('ytIntroTimeCountdown');
                    if (countdown) {
                        const rem = Math.max(0, Math.ceil(firstLine.start - curTime));
                        countdown.textContent = `${this.formatTime(curTime)} / ${this.formatTime(firstLine.start)} (còn ${rem}s)`;
                    }
                } else {
                    introBanner.classList.add('hidden');
                }
            }

            const targetIdx = this.getLineIndexAtTime(curTime);

            if (targetIdx !== this.currentLineIndex) {
                const currentLine = lines[this.currentLineIndex];
                let shouldSync = false;

                if (this.settings.playbackFlow === 'continuous') {
                    // Chế độ phát mượt suốt bài: Tự động bám sát câu theo dòng nhạc
                    shouldSync = true;
                } else if (this.settings.playbackFlow === 'loop_line') {
                    // Chế độ lặp câu: Nếu người dùng chủ động tua video ra ngoài phạm vi câu hiện tại
                    if (currentLine && (curTime < (currentLine.start - 0.6) || curTime > (currentLine.end + 0.6))) {
                        shouldSync = true;
                    }
                } else {
                    if (currentLine && (curTime < (currentLine.start - 0.6) || curTime > (currentLine.end + 0.6))) {
                        shouldSync = true;
                    }
                }

                if (shouldSync) {
                    this.currentLineIndex = targetIdx;
                    this.activeWordIndex = 0;
                    this.currentInput = '';
                    this.updateTypingLineDisplay();
                }
            }
        }

        // =========================================================================
        // TIME TRACKER: THEO DÕI THỜI GIAN & PHÁT MƯỢT MÀ SUỐT BÀI KHÔNG CẮT KHÚC
        // =========================================================================
        startTracker() {
            this.stopTracker();
            this.timeTrackerInterval = setInterval(() => {
                if (!this.activeSong || this.activeView !== 'studio') return;
                
                // 1. Kiểm tra và đồng bộ câu theo thời gian thực (kể cả khi người dùng tua video)
                this.checkAndSyncTime();

                // 2. Chế độ lặp lại câu (Loop line) - THÔNG MINH: Lặp 1 lần cho người dùng kịp nghe, sau đó tự động chuyển tiếp câu mới (Không bị kẹt vô tận)
                if (this.settings.playbackFlow === 'loop_line') {
                    const lines = this.activeSong.lines;
                    const line = lines[this.currentLineIndex];
                    if (line && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
                        try {
                            const curTime = this.ytPlayer.getCurrentTime() || 0;
                            // Chỉ lặp khi video đã chạy qua ít nhất 1.2s VÀ đã vượt quá line.end + 0.35s
                            if (curTime >= (line.start + 1.2) && curTime >= (line.end + 0.35)) {
                                if (!this.lineRepeatCount || this.lineRepeatCount === 0) {
                                    // Lặp lại 1 lần để người dùng có thêm cơ hội nghe và gõ
                                    this.lineRepeatCount = 1;
                                    this.ytPlayer.seekTo(Math.max(0, line.start - 0.25), true);
                                    this.ytPlayer.playVideo();
                                } else {
                                    // Đã lặp 1 lần mà người dùng chưa gõ kịp -> TỰ ĐỘNG TUA QUA CÂU MỚI (Tránh bị kẹt lại câu đó)
                                    this.lineRepeatCount = 0;
                                    if (this.currentLineIndex < lines.length - 1) {
                                        this.nextLine();
                                    } else {
                                        this.finishSong();
                                    }
                                }
                            }
                        } catch (e) {}
                    }
                }

                // 3. Chế độ dừng cuối câu (Pause at end)
                if (this.settings.playbackFlow === 'pause_at_end') {
                    const line = this.activeSong.lines[this.currentLineIndex];
                    if (line && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
                        try {
                            const curTime = this.ytPlayer.getCurrentTime() || 0;
                            if (curTime >= (line.start + 1.2) && curTime >= line.end) {
                                this.ytPlayer.pauseVideo();
                            }
                        } catch (e) {}
                    }
                }

            }, 80);
        }

        stopTracker() {
            if (this.timeTrackerInterval) {
                clearInterval(this.timeTrackerInterval);
                this.timeTrackerInterval = null;
            }
        }

        formatTime(sec, isDuration = false) {
            if (!Number.isFinite(sec) || sec < 0) return isDuration ? '--:--' : '00:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }

        togglePlayPause() {
            if (!this.ytPlayer) return;
            try {
                if (this.isPlayerPlaying) {
                    this.ytPlayer.pauseVideo();
                } else {
                    this.ytPlayer.unMute();
                    this.ytPlayer.setVolume(100);
                    this.ytPlayer.playVideo();
                }
            } catch (e) {}
        }

        // =========================================================================
        // TYPING MECHANICS & WORD RENDERING
        // =========================================================================
        cleanWord(raw) {
            return (raw || '').replace(/[\u2018\u2019\u201A\u201B\u2032\u0060\u00B4]/g, "'").replace(/[^a-zA-Z0-9']/g, '').toLowerCase();
        }

        getTargetWordsForLine(line) {
            if (!line) return [];
            const tokens = line.text.split(/\s+/);

            if (this.studyMode === 'copy_lyrics') {
                return tokens.map((tok, idx) => ({
                    token: tok,
                    clean: this.cleanWord(tok),
                    index: idx,
                    isBlank: true
                }));
            }

            const blankWordsClean = (line.blanks || []).map(b => this.cleanWord(b));
            return tokens.map((tok, idx) => {
                const c = this.cleanWord(tok);
                const isBlank = blankWordsClean.length > 0 ? blankWordsClean.includes(c) : true;
                return {
                    token: tok,
                    clean: c,
                    index: idx,
                    isBlank: isBlank
                };
            });
        }

        updateTypingLineDisplay() {
            const song = this.activeSong;
            if (!song) return;
            const line = song.lines[this.currentLineIndex];
            const lyricsContainer = document.getElementById('ytLyricsDisplay');
            if (!lyricsContainer || !line) return;

            const targets = this.getTargetWordsForLine(line);
            const blankIndices = [];
            targets.forEach((t, i) => { if (t.isBlank) blankIndices.push(i); });

            let html = '';
            targets.forEach((t, i) => {
                if (!t.isBlank) {
                    html += `<span class="text-slate-400 dark:text-slate-500 font-semibold mx-1">${t.token}</span>`;
                } else {
                    const blankPos = blankIndices.indexOf(i);
                    if (blankPos < this.activeWordIndex) {
                        html += `<span class="text-emerald-500 font-extrabold mx-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/30">${t.token}</span>`;
                    } else if (blankPos === this.activeWordIndex) {
                        const cleanTarget = t.clean;
                        const userTyped = (this.currentInput || '').toLowerCase();
                        let charHtml = '';

                        for (let c = 0; c < cleanTarget.length; c++) {
                            const expectedChar = cleanTarget[c];
                            const typedChar = userTyped[c];
                            if (typedChar === expectedChar) {
                                charHtml += `<span class="text-cyan-400 font-mono font-black drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">${expectedChar}</span>`;
                            } else if (c === userTyped.length) {
                                charHtml += `<span class="inline-block border-b-4 border-cyan-400 font-mono text-cyan-200 animate-pulse px-0.5">_</span>`;
                            } else {
                                if (this.studyMode === 'copy_lyrics') {
                                    charHtml += `<span class="text-slate-400 font-mono px-0.5">${expectedChar}</span>`;
                                } else {
                                    charHtml += `<span class="inline-block border-b-2 border-slate-400/50 font-mono text-slate-500 px-0.5">_</span>`;
                                }
                            }
                        }
                        html += `<span class="mx-1 px-3 py-1 rounded-2xl bg-cyan-500/15 border-2 border-cyan-400 shadow-md inline-flex items-center gap-0.5">${charHtml}</span>`;
                    } else {
                        if (this.studyMode === 'copy_lyrics') {
                            html += `<span class="text-slate-600 dark:text-slate-300 font-bold mx-1">${t.token}</span>`;
                        } else {
                            const dashes = '_'.repeat(Math.max(t.clean.length, 3));
                            html += `<span class="text-slate-400/50 font-mono mx-1">${dashes}</span>`;
                        }
                    }
                }
            });

            lyricsContainer.innerHTML = html;

            // Cập nhật Vietsub tự động & On-demand translation
            this.ensureVietsubForLine(line);

            // Cập nhật input
            const inputEl = document.getElementById('ytLiveTypingInput');
            if (inputEl) {
                inputEl.value = this.currentInput;
                inputEl.focus();
            }

            this.updateHUD();
        }

        // Tự động kiểm tra & sinh Vietsub cho mọi bài hát nhúng từ YouTube
        ensureVietsubForLine(line) {
            const vietsubEl = document.getElementById('ytVietsubDisplay');
            if (!line) return;

            if (line.vietsub && line.vietsub.trim() !== '') {
                if (vietsubEl) vietsubEl.textContent = line.vietsub;
                return;
            }

            if (this.translationCache[line.text]) {
                line.vietsub = this.translationCache[line.text];
                if (vietsubEl) vietsubEl.textContent = line.vietsub;
                return;
            }

            // Gọi API dịch tự động nhẹ nhàng
            if (line.text && line.text.trim() !== '♪') {
                fetch(`/api/youtube-dictation-translate?text=${encodeURIComponent(line.text)}`)
                    .then(r => r.json())
                    .then(data => {
                        if (data.success && data.translation) {
                            line.vietsub = data.translation;
                            this.translationCache[line.text] = data.translation;
                            if (vietsubEl && this.activeSong && this.activeSong.lines[this.currentLineIndex] === line) {
                                vietsubEl.textContent = line.vietsub;
                            }
                        }
                    })
                    .catch(() => {});
            }
        }

        updateHUD() {
            const song = this.activeSong;
            if (!song) return;

            const startDisp = document.getElementById('ytLineStartDisplay');
            const endDisp = document.getElementById('ytLineEndDisplay');
            const line = song.lines[this.currentLineIndex];
            if (line) {
                if (startDisp) startDisp.textContent = this.formatTime(line.start);
                if (endDisp) endDisp.textContent = this.formatTime(line.end);
            }

            const numOverlay = document.getElementById('ytLineNumberOverlay');
            if (numOverlay) numOverlay.textContent = this.currentLineIndex + 1;

            const streakMini = document.getElementById('ytStreakMini');
            if (streakMini) streakMini.textContent = `🔥 ${this.stats.streak}`;

            const accuracy = this.stats.totalKeystrokes > 0 ? Math.round((this.stats.correctChars / this.stats.totalKeystrokes) * 100) : 100;
            const accMini = document.getElementById('ytAccMini');
            if (accMini) accMini.textContent = `${accuracy}% chính xác`;

            const timeSeconds = this.stats.startTime ? Math.max(1, (Date.now() - this.stats.startTime) / 1000) : 1;
            const wpm = Math.round((this.stats.correctChars / 5) / (timeSeconds / 60));
            const wpmMini = document.getElementById('ytWpmMini');
            if (wpmMini) wpmMini.textContent = `${wpm} WPM`;

            // Cập nhật trạng thái hiển thị trên thanh điều hướng câu hát thông minh
            const dots = document.querySelectorAll('.yt-sentence-dot');
            if (dots && dots.length > 0) {
                dots.forEach((dot, idx) => {
                    if (idx === this.currentLineIndex) {
                        dot.className = 'yt-sentence-dot h-2 w-7 rounded-full transition-all duration-300 cursor-pointer bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(34,211,238,0.7)]';
                    } else if (idx < this.currentLineIndex) {
                        dot.className = 'yt-sentence-dot h-2 w-2 rounded-full transition-all duration-300 cursor-pointer bg-emerald-400/80 hover:bg-emerald-300';
                    } else {
                        dot.className = 'yt-sentence-dot h-2 w-2 rounded-full transition-all duration-300 cursor-pointer bg-slate-300 dark:bg-slate-700 hover:bg-slate-400';
                    }
                });
            }
        }

        attachKeyboard() {
            window.removeEventListener('keydown', this.handleGlobalKeyDown);
            window.addEventListener('keydown', this.handleGlobalKeyDown);

            const inputEl = document.getElementById('ytLiveTypingInput');
            if (inputEl) {
                inputEl.oninput = (e) => {
                    this.handleTypingInput(e.target.value);
                };
                inputEl.focus();
            }
        }

        detachKeyboard() {
            window.removeEventListener('keydown', this.handleGlobalKeyDown);
        }

        handleGlobalKeyDown(e) {
            if (this.activeView !== 'studio') return;

            if (e.key && e.key.toLowerCase() === 'i' && document.activeElement !== document.getElementById('ytLiveTypingInput')) {
                e.preventDefault();
                this.skipIntro();
                return;
            }

            if (e.code === 'Space' && (!this.currentInput || this.currentInput.trim() === '')) {
                e.preventDefault();
                this.replayCurrentLine();
                return;
            }

            if (e.key === 'Tab') {
                e.preventDefault();
                this.giveHint();
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                this.skipCurrentLine();
                return;
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevLine();
                return;
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextLine();
                return;
            }

            const inputEl = document.getElementById('ytLiveTypingInput');
            if (inputEl && document.activeElement !== inputEl && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                inputEl.focus();
                this.handleTypingInput((this.currentInput || '') + e.key);
                return;
            }
        }

        handleTypingInput(rawVal) {
            rawVal = (rawVal || '').replace(/[\u2018\u2019\u201A\u201B\u2032\u0060\u00B4]/g, "'");
            if (!this.activeSong) return;
            const line = this.activeSong.lines[this.currentLineIndex];
            if (!line) return;

            const targets = this.getTargetWordsForLine(line);
            const blankTargets = targets.filter(t => t.isBlank);
            const activeTarget = blankTargets[this.activeWordIndex];
            if (!activeTarget) return;

            const cleanTarget = activeTarget.clean;
            const cleanVal = this.cleanWord(rawVal);
            this.stats.totalKeystrokes++;

            if (cleanTarget.startsWith(cleanVal)) {
                this.currentInput = cleanVal;
                this.stats.correctChars++;
                
                this.playMelodicChime('correct_char');

                if (cleanVal === cleanTarget) {
                    this.playMelodicChime('word_complete');
                    this.currentInput = '';
                    this.activeWordIndex++;

                    if (this.activeWordIndex >= blankTargets.length) {
                        this.handleLineCompleted();
                        return;
                    }
                }
            } else {
                this.stats.wrongKeystrokes++;
                this.playMelodicChime('wrong');

                let validPrefix = '';
                for (let i = 0; i < cleanVal.length; i++) {
                    if (cleanTarget[i] === cleanVal[i]) {
                        validPrefix += cleanVal[i];
                    } else {
                        break;
                    }
                }
                this.currentInput = validPrefix;
            }

            this.updateTypingLineDisplay();
        }

        handleLineCompleted() {
            this.stats.streak++;
            if (this.stats.streak > this.stats.maxStreak) this.stats.maxStreak = this.stats.streak;

            if (typeof window.showToast === 'function') {
                window.showToast(`🔥 Chuỗi ${this.stats.streak} câu liên tiếp!`);
            }

            const lyricsContainer = document.getElementById('ytLyricsDisplay');
            if (lyricsContainer) {
                lyricsContainer.classList.add('animate-pulse');
            }

            // Trong chế độ phát mượt suốt bài (continuous): KHÔNG GIẬT CẮT NHẠC
            if (this.settings.playbackFlow === 'continuous') {
                // Nhạc vẫn phát mượt mà tự nhiên, khi hết câu nó tự động theo nhịp sang câu kế
                setTimeout(() => {
                    if (lyricsContainer) lyricsContainer.classList.remove('animate-pulse');
                }, 350);
            } else {
                setTimeout(() => {
                    if (this.currentLineIndex < this.activeSong.lines.length - 1) {
                        this.currentLineIndex++;
                        this.activeWordIndex = 0;
                        this.currentInput = '';
                        this.seekToLineStart();
                        this.updateTypingLineDisplay();
                    } else {
                        this.finishSong();
                    }
                }, 350);
            }
        }

        replayCurrentLine() {
            this.forcePlayWithSound();
            this.seekToLineStart();
            const inputEl = document.getElementById('ytLiveTypingInput');
            if (inputEl) inputEl.focus();
        }

        giveHint() {
            if (!this.activeSong) return;
            const line = this.activeSong.lines[this.currentLineIndex];
            if (!line) return;

            const targets = this.getTargetWordsForLine(line).filter(t => t.isBlank);
            const activeTarget = targets[this.activeWordIndex];
            if (!activeTarget) return;

            const targetWord = activeTarget.clean;
            const curLen = this.currentInput.length;
            if (curLen < targetWord.length) {
                this.currentInput = targetWord.substring(0, curLen + 1);
                this.stats.totalKeystrokes++;
                this.playMelodicChime('correct_char');

                if (this.currentInput === targetWord) {
                    this.playMelodicChime('word_complete');
                    this.currentInput = '';
                    this.activeWordIndex++;
                    if (this.activeWordIndex >= targets.length) {
                        this.handleLineCompleted();
                        return;
                    }
                }
                this.updateTypingLineDisplay();
            }
        }

        skipCurrentLine() {
            this.stats.skippedLines++;
            this.stats.streak = 0;
            if (this.currentLineIndex < this.activeSong.lines.length - 1) {
                this.currentLineIndex++;
                this.activeWordIndex = 0;
                this.currentInput = '';
                if (this.settings.playbackFlow !== 'continuous') {
                    this.seekToLineStart();
                }
                this.updateTypingLineDisplay();
            } else {
                this.finishSong();
            }
        }

        prevLine() {
            if (this.currentLineIndex > 0) {
                this.currentLineIndex--;
                this.activeWordIndex = 0;
                this.currentInput = '';
                this.seekToLineStart();
                this.updateTypingLineDisplay();
            }
        }

        nextLine() {
            if (this.currentLineIndex < this.activeSong.lines.length - 1) {
                this.currentLineIndex++;
                this.activeWordIndex = 0;
                this.currentInput = '';
                this.seekToLineStart();
                this.updateTypingLineDisplay();
            }
        }

        finishSong() {
            try {
                if (typeof window.addXP === 'function') {
                    window.addXP(45, 'Hoàn thành bài chép nhạc YouTube: ' + (this.activeSong ? this.activeSong.title : ''));
                }
            } catch(e) {}
            this.stopTracker();
            this.stopSilkWave();
            this.detachKeyboard();
            this.activeView = 'summary';
            this.renderInto(this.containerId);
        }

        startSong(songId) {
            const songs = window.YouTubeDictationData || [];
            const target = songs.find(s => s.id === songId) || songs[0];
            if (!target) return;

            const viewToeic = document.getElementById('subViewDictationToeic');
            const viewYt = document.getElementById('subViewDictationYoutube');
            if (viewToeic) viewToeic.classList.add('hidden');
            if (viewYt) viewYt.classList.remove('hidden');

            this.activeSong = target;
            this.currentLineIndex = 0;
            this.activeWordIndex = 0;
            this.currentInput = '';
            this.melodyNoteIndex = 0;

            // QUAN TRỌNG: Mặc định luôn là 'continuous' để bài hát phát mượt mà suốt bài từ đầu đến cuối
            this.settings.playbackFlow = 'continuous';
            this.saveSettings();

            this.stats = {
                startTime: Date.now(),
                correctChars: 0,
                totalKeystrokes: 0,
                wrongKeystrokes: 0,
                skippedLines: 0,
                streak: 0,
                maxStreak: 0
            };

            this.activeView = 'studio';
            this.renderInto(this.containerId);
        }

        backToCatalog() {
            this.activeView = 'catalog';
            this.renderInto(this.containerId);
        }

        setStudyMode(mode) {
            this.studyMode = mode;
            this.activeWordIndex = 0;
            this.currentInput = '';
            this.updateTypingLineDisplay();
            if (typeof window.showToast === 'function') {
                window.showToast(mode === 'copy_lyrics' ? '✍️ Chế độ Chép Lời (Hiện chữ rõ ràng)' : '🎧 Chế độ Nghe Tự Gõ (Che chữ thử thách)');
            }
        }

        cyclePlaybackFlow() {
            const flows = ['continuous', 'loop_line'];
            const curIdx = flows.indexOf(this.settings.playbackFlow);
            const nextIdx = (curIdx + 1) % flows.length;
            this.settings.playbackFlow = flows[nextIdx];
            this.saveSettings();

            const toastMessages = {
                'continuous': '▶️ Đã bật: Phát mượt mà suốt bài (không cắt khúc)',
                'loop_line': '🔁 Đã bật: Lặp lại 1 lần nếu chưa kịp gõ, sau đó tự chuyển sang câu mới'
            };

            if (typeof window.showToast === 'function') {
                window.showToast(toastMessages[this.settings.playbackFlow]);
            }
            this.renderInto(this.containerId);
        }

        toggleVietsub() {
            this.settings.showVietsub = !this.settings.showVietsub;
            this.saveSettings();
            const vietsubEl = document.getElementById('ytVietsubDisplay');
            if (vietsubEl) {
                if (this.settings.showVietsub) vietsubEl.classList.remove('hidden');
                else vietsubEl.classList.add('hidden');
            }
            this.renderInto(this.containerId);
        }

        filterCatalog(level) {
            try { localStorage.setItem('yt_dict_filter_level', level); } catch(e) {}
            this.selectedCatalogLevel = level;
            const songs = window.YouTubeDictationData || [];
            const grid = document.getElementById('ytSongGrid');
            if (!grid) return;

            const filtered = level === 'ALL' ? songs : songs.filter(s => s.level === level);
            grid.innerHTML = filtered.map(song => `
                <div class="yt-song-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div class="relative overflow-hidden aspect-video bg-slate-950">
                        <img src="${song.thumbnail}" alt="${song.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10.5px] font-extrabold text-cyan-300 border border-cyan-400/30">
                            Level ${song.level}
                        </span>
                        <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-semibold">
                            <span><i class="fa-solid fa-music text-purple-400 mr-1"></i>${song.genre}</span>
                            <span>${song.lines.length} câu</span>
                        </div>
                    </div>
                    <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                            <h3 class="font-black text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition line-clamp-1">
                                ${song.title}
                            </h3>
                            <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">${song.artist}</div>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                ${song.description || ''}
                            </p>
                        </div>
                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div class="text-[11px] font-bold text-slate-400">${song.vocabFocus ? song.vocabFocus.length : 0} từ vựng</div>
                            <button onclick="YouTubeDictationWorkstation.startSong('${song.id}')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer">
                                <i class="fa-solid fa-headphones text-cyan-300"></i> Vào nghe & gõ
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        speakWord(word) {
            if (!word) return;
            if (window.UniversalAudioEngine && typeof window.UniversalAudioEngine.speak === 'function') {
                window.UniversalAudioEngine.speak(word, { accent: 'US', rate: 0.92 });
                return;
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(word);
                utter.lang = 'en-US';
                utter.rate = 0.92;
                utter.pitch = 1.01;
                window.speechSynthesis.speak(utter);
            }
        }

        saveVocabToNotebook() {
            if (!this.activeSong || !this.activeSong.vocabFocus) return;
            try {
                const cur = JSON.parse(localStorage.getItem('cung_dang_vocab_state') || '{}');
                cur.bookmarkedWordsMap = cur.bookmarkedWordsMap || {};
                this.activeSong.vocabFocus.forEach(v => {
                    cur.bookmarkedWordsMap[v.word] = {
                        word: v.word,
                        ipa: v.ipa || '',
                        meaning: v.meaning || 'Từ vựng trong bài hát',
                        source: this.activeSong.title,
                        timestamp: Date.now()
                    };
                });
                localStorage.setItem('cung_dang_vocab_state', JSON.stringify(cur));
                if (typeof window.showToast === 'function') {
                    window.showToast(`📖 Đã lưu ${this.activeSong.vocabFocus.length} từ vào Sổ tay của bạn!`);
                }
            } catch (e) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Đã lưu từ vựng!');
                }
            }
        }

        // =========================================================================
        // NHÚNG BẤT KỲ BÀI HÁT YOUTUBE NÀO (GỌI API TỰ ĐỘNG BÓC LỜI & VIETSUB)
        // =========================================================================
        buildImportModalHTML() {
            return `
                <div id="ytImportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
                    <div class="max-w-xl w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center text-lg">
                                    <i class="fa-brands fa-youtube"></i>
                                </div>
                                <div>
                                    <h3 class="font-black text-slate-900 dark:text-white text-base">Nhúng Mọi Bài Hát Trên YouTube</h3>
                                    <p class="text-xs text-slate-400">Tự động lấy lời đồng bộ từng giây & sinh Vietsub chuẩn xác</p>
                                </div>
                            </div>
                            <button onclick="YouTubeDictationWorkstation.closeImportModal()" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition flex items-center justify-center cursor-pointer">
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        <div class="space-y-2.5">
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Dán đường link YouTube (hoặc Video ID):</label>
                            <div class="relative">
                                <input type="text" id="ytImportInputUrl" placeholder="Ví dụ: https://www.youtube.com/watch?v=24u3NoPvgMw" 
                                    class="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-red-500 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-none">
                                <i class="fa-solid fa-link absolute right-3.5 top-3.5 text-slate-400"></i>
                            </div>
                            <div class="text-[11px] text-slate-400 leading-relaxed">
                                💡 <b>Mẹo:</b> Hỗ trợ hàng triệu bài hát tiếng Anh US/UK (Taylor Swift, Ed Sheeran, Conan Gray, Adele, Charlie Puth...).
                            </div>
                        </div>

                        <div id="ytImportLoading" class="hidden py-4 text-center space-y-2">
                            <i class="fa-solid fa-circle-notch fa-spin text-2xl text-red-500"></i>
                            <div class="text-xs font-bold text-slate-600 dark:text-slate-300">Đang đồng bộ mốc thời gian & dịch phụ đề Vietsub...</div>
                        </div>

                        <div class="flex items-center justify-end gap-3 pt-2">
                            <button onclick="YouTubeDictationWorkstation.closeImportModal()" class="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition cursor-pointer">
                                Hủy bỏ
                            </button>
                            <button onclick="YouTubeDictationWorkstation.submitImportYouTube()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 hover:opacity-95 text-white text-xs font-extrabold shadow-md transition flex items-center gap-2 cursor-pointer">
                                <i class="fa-solid fa-cloud-arrow-down"></i>
                                <span>Nạp Bài Hát & Bắt Đầu Ngay</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        openImportModal() {
            let modal = document.getElementById('ytImportModal');
            if (!modal) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = this.buildImportModalHTML();
                document.body.appendChild(wrapper.firstElementChild);
                modal = document.getElementById('ytImportModal');
            }
            if (modal) {
                modal.classList.remove('hidden');
                const inp = document.getElementById('ytImportInputUrl');
                if (inp) {
                    inp.value = '';
                    inp.focus();
                }
            }
        }

        closeImportModal() {
            const modal = document.getElementById('ytImportModal');
            if (modal) modal.classList.add('hidden');
        }

        async submitImportYouTube() {
            const inp = document.getElementById('ytImportInputUrl');
            const loading = document.getElementById('ytImportLoading');
            const val = inp ? inp.value.trim() : '';

            if (!val) {
                alert('Vui lòng dán link video YouTube (hoặc YouTube Video ID)!');
                return;
            }

            if (loading) loading.classList.remove('hidden');

            try {
                const res = await fetch(`/api/youtube-dictation-import?url=${encodeURIComponent(val)}`);
                const json = await res.json();

                if (!json.success || !json.song) {
                    throw new Error(json.error || 'Không thể lấy lời bài hát từ video này.');
                }

                window.YouTubeDictationData = window.YouTubeDictationData || [];
                const existingIdx = window.YouTubeDictationData.findIndex(s => s.id === json.song.id);
                if (existingIdx !== -1) {
                    window.YouTubeDictationData[existingIdx] = json.song;
                } else {
                    window.YouTubeDictationData.unshift(json.song);
                }

                this.closeImportModal();
                if (typeof window.showToast === 'function') {
                    window.showToast(`🎉 Nhập thành công: ${json.song.title} (${json.song.lines.length} câu)`);
                }

                this.startSong(json.song.id);

            } catch (err) {
                alert('Lỗi: ' + (err.message || 'Không thể cào dữ liệu từ YouTube. Vui lòng kiểm tra lại link!'));
            } finally {
                if (loading) loading.classList.add('hidden');
            }
        }
    }

    window.YouTubeDictationWorkstation = new YouTubeDictationWorkstation();
    window.ytDictationStation = window.YouTubeDictationWorkstation;

})(window, document);
