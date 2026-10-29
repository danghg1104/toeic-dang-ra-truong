/**
 * DAILYDICTATION TOEIC LISTENING WORKSTATION
 * Chuẩn giao diện 100% DailyDictation.com (Ảnh 1, 2, 3, 4)
 * - Quản lý 30 Practice Tests (600 bài nghe TOEIC Conversation & Short Talk)
 * - Đa giọng chuẩn bản xứ: Mỹ, Anh, Úc, Canada từ nguồn BestMyTest & ETS
 * - Trình nghe chép chính tả thông minh:
 *   + Tự động phát âm thanh câu
 *   + So sánh chi tiết từng từ (Word-by-word diffing), highlight lỗi sai & từ đúng
 *   + Nhận diện giọng nói qua Micro (Web Speech API)
 *   + Phím tắt nhanh: Ctrl nghe lại, Enter kiểm tra, Shift+Enter bỏ qua
 *   + Tab xem Full Transcript với nút phát từng câu
 *   + Hộp cài đặt Settings chuyên sâu (Tốc độ, tự động chuyển câu, lặp lại)
 */

(function (window, document) {
    'use strict';

    class DailyDictationWorkstation {
        constructor() {
            this.activeView = 'catalog'; // 'catalog' | 'exercise'
            this.activeTestNum = 1;
            this.activeLesson = null;
            this.currentPartIndex = 0; // 0..N-1
            
            // Practice State for current lesson
            this.userInputs = {}; // { [partIndex]: string }
            this.partResults = {}; // { [partIndex]: { isCorrect: bool, skipped: bool, checked: bool, feedbackHtml: string } }
            
            // Settings
            this.settings = {
                autoPlay: true,
                replayCount: 1, // 1, 2, 3, 99 (infinite)
                autoNext: true,
                hideHint: false,
                playbackSpeed: 1.0
            };
            this.loadSettings();

            // Catalog filters
            this.filterSearch = '';
            this.filterLevel = 'All';
            this.openAccordions = new Set([1]); // Mặc định mở Test 1 như Ảnh 3

            // Audio Player instance
            this.audioEl = typeof Audio !== 'undefined' ? new Audio() : {
                addEventListener: () => {},
                play: () => Promise.resolve(),
                pause: () => {},
                currentTime: 0,
                duration: 0
            };
            this.audioPlayCount = 0;
            this.isPlaying = false;
            this.speechRecognition = null;
            this.isRecording = false;

            // Tips list from DailyDictation
            this.tips = [
                'If possible, read out loud the sentence after completing it!',
                'Repeat each exercise at least 3 times to improve faster!',
                'Practice at least 30 minutes every day to sharpen your ear!',
                'If a sentence is too difficult, click Skip to see the answer and continue.',
                'Listening to diverse accents (US, UK, AU, CA) is key to TOEIC 900+.'
            ];
            this.currentTipIndex = 0;

            this.dom = {};
            this.initAudioEvents();
            this.initSpeechRecognition();
            this.initKeyboardShortcuts();
        }

        // =========================================================================
        // SETTINGS STORAGE
        // =========================================================================
        loadSettings() {
            try {
                const saved = localStorage.getItem('dailydictation_settings');
                if (saved) {
                    this.settings = Object.assign(this.settings, JSON.parse(saved));
                }
            } catch (e) {}
        }

        saveSettings() {
            try {
                localStorage.setItem('dailydictation_settings', JSON.stringify(this.settings));
            } catch (e) {}
        }

        // =========================================================================
        // AUDIO & SPEECH ENGINE
        // =========================================================================
        initAudioEvents() {
            this.audioEl.addEventListener('play', () => {
                this.isPlaying = true;
                this.updatePlayBtnUI();
            });

            this.audioEl.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updatePlayBtnUI();
            });

            this.audioEl.addEventListener('ended', () => {
                this.isPlaying = false;
                this.audioPlayCount++;
                this.updatePlayBtnUI();

                // Kiểm tra số lần replay cài đặt
                const maxReplays = parseInt(this.settings.replayCount, 10) || 1;
                if (this.audioPlayCount < maxReplays) {
                    setTimeout(() => {
                        if (this.activeView === 'exercise') {
                            this.audioEl.currentTime = 0;
                            this.audioEl.play().catch(() => {});
                        }
                    }, 400);
                }
            });

            this.audioEl.addEventListener('timeupdate', () => {
                this.updateAudioProgressUI();
            });

            this.audioEl.addEventListener('loadedmetadata', () => {
                this.updateAudioProgressUI();
            });
        }

        initSpeechRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.speechRecognition = new SpeechRecognition();
                this.speechRecognition.continuous = false;
                this.speechRecognition.interimResults = false;
                this.speechRecognition.lang = 'en-US';

                this.speechRecognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    const inputEl = document.getElementById('ddwInput');
                    if (inputEl) {
                        inputEl.value = transcript;
                        this.userInputs[this.currentPartIndex] = transcript;
                    }
                    this.stopSpeechRecognition();
                };

                this.speechRecognition.onerror = () => {
                    this.stopSpeechRecognition();
                };

                this.speechRecognition.onend = () => {
                    this.stopSpeechRecognition();
                };
            }
        }

        toggleSpeechRecognition() {
            if (!this.speechRecognition) {
                if (typeof showToast === 'function') showToast('⚠️ Trình duyệt của bạn không hỗ trợ Speech-to-Text.');
                return;
            }
            if (this.isRecording) {
                this.stopSpeechRecognition();
            } else {
                try {
                    this.speechRecognition.start();
                    this.isRecording = true;
                    this.updateMicBtnUI();
                } catch (e) {
                    this.stopSpeechRecognition();
                }
            }
        }

        stopSpeechRecognition() {
            if (this.speechRecognition && this.isRecording) {
                try { this.speechRecognition.stop(); } catch (e) {}
            }
            this.isRecording = false;
            this.updateMicBtnUI();
        }

        updateMicBtnUI() {
            const micBtn = document.getElementById('ddwMicBtn');
            if (micBtn) {
                if (this.isRecording) {
                    micBtn.classList.add('text-red-500', 'animate-pulse');
                    micBtn.classList.remove('text-slate-400');
                } else {
                    micBtn.classList.remove('text-red-500', 'animate-pulse');
                    micBtn.classList.add('text-slate-400');
                }
            }
        }

        playChimeSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.4);
            } catch (e) {}
        }

        initKeyboardShortcuts() {
            if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
            window.addEventListener('keydown', (e) => {
                if (this.activeView !== 'exercise' || !this.activeLesson) return;
                const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                const isInputActive = activeTag === 'textarea' || activeTag === 'input';

                // Phím Ctrl: Phát lại audio lập tức
                if (e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
                    e.preventDefault();
                    this.replayAudio();
                    return;
                }

                // Khi trong ô gõ:
                if (isInputActive) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.checkAnswer();
                    } else if (e.key === 'Enter' && e.shiftKey) {
                        e.preventDefault();
                        this.skipCurrentPart();
                    }
                    return;
                }

                // Khi ngoài ô gõ:
                if (e.code === 'Space') {
                    e.preventDefault();
                    this.toggleAudio();
                } else if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevPart();
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    this.nextPart();
                }
            });
        }

        // =========================================================================
        // VIEW SWITCHING & RENDERING
        // =========================================================================
        renderInto(containerId = 'view-dictation') {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = `
                <div id="dailyDictationRoot" class="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
                    <!-- VIEW 1: CATALOG LIST (Ảnh 1, 2, 3) -->
                    <div id="ddwCatalogView" class="${this.activeView === 'catalog' ? 'block' : 'hidden'} space-y-6"></div>

                    <!-- VIEW 2: EXERCISE WORKSTATION (Ảnh 4) -->
                    <div id="ddwExerciseView" class="${this.activeView === 'exercise' ? 'block' : 'hidden'}"></div>
                </div>

                <!-- SETTINGS MODAL -->
                <div id="ddwSettingsModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden items-center justify-center p-4">
                    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-scale-up">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 class="font-extrabold text-slate-800 dark:text-white text-base flex items-center gap-2">
                                <i class="fa-solid fa-gear text-indigo-500"></i> Cài đặt nghe chép (Settings)
                            </h3>
                            <button onclick="DailyDictationWorkstation.closeSettings()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div class="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                            <!-- Auto Play -->
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-bold">Tự động phát audio</div>
                                    <div class="text-xs text-slate-400">Tự động chạy âm thanh khi chuyển sang câu mới</div>
                                </div>
                                <input type="checkbox" id="ddwSetAutoPlay" class="w-5 h-5 accent-indigo-600 rounded" onchange="DailyDictationWorkstation.updateSetting('autoPlay', this.checked)">
                            </div>
                            <!-- Replay Count -->
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-bold">Số lần phát lại</div>
                                    <div class="text-xs text-slate-400">Số lần lặp lại audio của mỗi câu</div>
                                </div>
                                <select id="ddwSetReplayCount" class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold" onchange="DailyDictationWorkstation.updateSetting('replayCount', parseInt(this.value, 10))">
                                    <option value="1">1 lần</option>
                                    <option value="2">2 lần</option>
                                    <option value="3">3 lần</option>
                                    <option value="99">Lặp vô hạn</option>
                                </select>
                            </div>
                            <!-- Auto Next -->
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-bold">Tự động qua câu mới</div>
                                    <div class="text-xs text-slate-400">Tự động chuyển câu khi gõ đúng 100%</div>
                                </div>
                                <input type="checkbox" id="ddwSetAutoNext" class="w-5 h-5 accent-indigo-600 rounded" onchange="DailyDictationWorkstation.updateSetting('autoNext', this.checked)">
                            </div>
                            <!-- Hide Hint -->
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-bold">Ẩn từ gợi ý (Hide Hint)</div>
                                    <div class="text-xs text-slate-400">Thử thách nghe không có từ gợi ý</div>
                                </div>
                                <input type="checkbox" id="ddwSetHideHint" class="w-5 h-5 accent-indigo-600 rounded" onchange="DailyDictationWorkstation.updateSetting('hideHint', this.checked)">
                            </div>
                            <!-- Shortcut tips -->
                            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                                <div class="font-bold text-slate-700 dark:text-slate-200">⌨️ Phím tắt nhanh:</div>
                                <div>• <code class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-bold">Ctrl</code> : Nghe lại câu hiện tại</div>
                                <div>• <code class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-bold">Enter</code> : Kiểm tra đáp án (Check)</div>
                                <div>• <code class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-bold">Shift + Enter</code> : Bỏ qua câu (Skip)</div>
                                <div>• <code class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 font-bold">← / →</code> : Chuyển câu trước / sau</div>
                            </div>
                        </div>
                        <div class="pt-2 text-right">
                            <button onclick="DailyDictationWorkstation.closeSettings()" class="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition">
                                Đã hiểu & Đóng
                            </button>
                        </div>
                    </div>
                </div>
            `;

            if (this.activeView === 'catalog') {
                this.renderCatalog();
            } else {
                this.renderExercise();
            }
        }

        // =========================================================================
        // VIEW 1: CATALOG / TEST LIST (Ảnh 1, 2, 3)
        // =========================================================================
        renderCatalog() {
            const catView = document.getElementById('ddwCatalogView');
            if (!catView) return;

            const summary = window.DailyDictationDatabase ? window.DailyDictationDatabase.getSummary() : [];

            // Chuẩn hóa bộ lọc (Hỗ trợ cả 'Level A2', 'A2', 'All levels', v.v.)
            const cleanFilter = (this.filterLevel || 'All').replace(/^Levels*/i, '').trim().toUpperCase();
            const q = (this.filterSearch || '').trim().toLowerCase();
            const isFiltering = (cleanFilter !== 'ALL' && cleanFilter !== '') || q !== '';

            // Đếm số lượng bài theo từng level trên toàn bộ 600 bài
            const globalLevelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            summary.forEach(t => {
                t.lessons.forEach(l => {
                    const lLevel = (l.vocabLevel || 'B1').replace(/^Levels*/i, '').trim().toUpperCase();
                    if (globalLevelCounts[lLevel] !== undefined) globalLevelCounts[lLevel]++;
                });
            });

            // Lọc theo search và level
            const filteredTests = summary.map(test => {
                const matchesLessons = test.lessons.filter(l => {
                    const cleanVocab = (l.vocabLevel || '').replace(/^Levels*/i, '').trim().toUpperCase();
                    const matchLevel = cleanFilter === 'ALL' || cleanFilter === '' || cleanVocab === cleanFilter;

                    const matchSearch = !q || 
                        l.name.toLowerCase().includes(q) || 
                        l.topic.toLowerCase().includes(q) ||
                        cleanVocab.toLowerCase() === q ||
                        ('level ' + cleanVocab.toLowerCase()).includes(q) ||
                        test.title.toLowerCase().includes(q) ||
                        ('test ' + test.testNum).toLowerCase().includes(q) ||
                        (l.slug && l.slug.toLowerCase().includes(q));

                    return matchSearch && matchLevel;
                });
                return {
                    ...test,
                    filteredLessons: matchesLessons
                };
            }).filter(t => t.filteredLessons.length > 0);

            // Tự động mở tất cả accordion khớp khi người dùng đang tìm kiếm hoặc lọc level
            if (isFiltering) {
                filteredTests.forEach(t => this.openAccordions.add(t.testNum));
            }

            // Đếm tổng số bài khớp
            const totalMatches = filteredTests.reduce((acc, t) => acc + t.filteredLessons.length, 0);

            let html = `
                <!-- Breadcrumb -->
                <nav class="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                    <span class="hover:text-indigo-600 cursor-pointer">All topics</span>
                    <span class="mx-1.5">/</span>
                    <span class="text-slate-700 dark:text-slate-200">TOEIC Listening</span>
                </nav>

                <!-- Totoro Moonlight Listening Mascot Card (Ảnh 3: Totoro Ocarina Moonlight) -->
                <div class="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-4 overflow-hidden relative">
                    <div class="w-20 sm:w-24 aspect-[219/286] shrink-0 rounded-2xl overflow-hidden border border-indigo-400/40 shadow-lg relative bg-slate-800">
                        <img src="assets/mascot/totoro_listening_card.png" alt="Totoro Thổi Sáo Dưới Trăng (Ảnh 3)" class="w-full h-full object-cover filter brightness-105 hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="space-y-1 text-center sm:text-left flex-1 min-w-0">
                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30">Góc Luyện Nghe Studio Ghibli</span>
                            <span class="text-xs text-amber-300 font-bold">🌙 Totoro Thổi Sáo Dưới Ánh Trăng</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-black text-white tracking-tight">
                            Luyện Đôi Tai Tinh Tường — Bắt Trọn Từng Âm Điệu & Nối Âm TOEIC
                        </h3>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            Lắng nghe êm dịu, kiên trì chép chính tả mỗi ngày 15 phút cùng Totoro giúp bạn phản xạ tự nhiên với tốc độ nói thực tế của người bản xứ và xóa bỏ hoàn toàn nỗi sợ Part 1-4!
                        </p>
                    </div>
                </div>

                <!-- Top Header & Filter Bar (Chuẩn Ảnh 1, 2, 3) -->
                <div class="pb-3 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                TOEIC Listening
                            </h1>
                            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Luyện nghe chép chính tả chuẩn 30 Đề ETS & BestMyTest · 600 bài nghe đa giọng bản xứ (US, UK, AU, CA)
                            </p>
                        </div>

                        <!-- Search & Filter Controls -->
                        <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                            <div class="relative">
                                <input type="text" id="ddwSearchInput" value="${this.filterSearch}" placeholder="Tìm bài nghe, chủ đề..." 
                                    oninput="DailyDictationWorkstation.onSearchInput(this.value)"
                                    onkeydown="if(event.key==='Enter') DailyDictationWorkstation.applyFilters()"
                                    class="w-40 sm:w-56 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 shadow-2xs">
                            </div>
                            <select id="ddwLevelSelect" onchange="DailyDictationWorkstation.onLevelSelect(this.value)" 
                                class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 shadow-2xs">
                                <option value="All" ${cleanFilter === 'ALL' || cleanFilter === '' ? 'selected' : ''}>All levels (${summary.reduce((a, t) => a + t.lessons.length, 0)})</option>
                                <option value="Level A1" ${cleanFilter === 'A1' ? 'selected' : ''}>Level A1 (${globalLevelCounts.A1})</option>
                                <option value="Level A2" ${cleanFilter === 'A2' ? 'selected' : ''}>Level A2 (${globalLevelCounts.A2})</option>
                                <option value="Level B1" ${cleanFilter === 'B1' ? 'selected' : ''}>Level B1 (${globalLevelCounts.B1})</option>
                                <option value="Level B2" ${cleanFilter === 'B2' ? 'selected' : ''}>Level B2 (${globalLevelCounts.B2})</option>
                                <option value="Level C1" ${cleanFilter === 'C1' ? 'selected' : ''}>Level C1 (${globalLevelCounts.C1})</option>
                                <option value="Level C2" ${cleanFilter === 'C2' ? 'selected' : ''}>Level C2 (${globalLevelCounts.C2})</option>
                            </select>
                            <button onclick="DailyDictationWorkstation.applyFilters()" class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition">
                                OK
                            </button>
                        </div>
                    </div>

                    <!-- Quick Level Filter Pills (Thanh lọc nhanh chuẩn CEFR) -->
                    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] pt-1">
                        <span class="text-xs text-slate-400 font-bold shrink-0 mr-1">
                            <i class="fa-solid fa-layer-group text-slate-400 mr-1"></i>Phân loại CEFR:
                        </span>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('All')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${cleanFilter === 'ALL' || cleanFilter === '' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}">
                            Tất cả (${summary.reduce((a, t) => a + t.lessons.length, 0)})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('A1')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${cleanFilter === 'A1' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'}">
                            A1 (${globalLevelCounts.A1})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('A2')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${cleanFilter === 'A2' ? 'bg-teal-600 text-white shadow-xs' : 'bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800'}">
                            A2 (${globalLevelCounts.A2})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('B1')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${cleanFilter === 'B1' ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800'}">
                            B1 (${globalLevelCounts.B1})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('B2')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${cleanFilter === 'B2' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'}">
                            B2 (${globalLevelCounts.B2})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('C1')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${cleanFilter === 'C1' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800'}">
                            C1 (${globalLevelCounts.C1})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('C2')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${cleanFilter === 'C2' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800'}">
                            C2 (${globalLevelCounts.C2})
                        </button>
                        ${isFiltering ? `
                            <button onclick="DailyDictationWorkstation.resetFilters()" 
                                class="px-2.5 py-1 rounded-lg font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition shrink-0 flex items-center gap-1">
                                <i class="fa-solid fa-xmark"></i> Xóa lọc
                            </button>
                        ` : ''}
                    </div>

                    ${isFiltering ? `
                        <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1">
                            <span>Đang hiển thị <strong>${totalMatches}</strong> bài nghe phù hợp</span>
                            <span>•</span>
                            <span>${filteredTests.length} Practice Tests</span>
                        </div>
                    ` : ''}
                </div>

                <!-- Practice Tests Accordion List (Chuẩn Ảnh 1, 2, 3) -->
                <div class="space-y-2.5 pt-2">
            `;

            if (filteredTests.length === 0) {
                const searchDesc = q ? `từ khóa "<strong>${this.filterSearch}</strong>"` : '';
                const levelDesc = (cleanFilter !== 'ALL' && cleanFilter !== '') ? `cấp độ <strong>Level ${cleanFilter}</strong>` : '';
                const combinedDesc = [searchDesc, levelDesc].filter(Boolean).join(' và ');

                html += `
                    <div class="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                        <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <i class="fa-solid fa-magnifying-glass text-lg"></i>
                        </div>
                        <p class="font-medium text-slate-700 dark:text-slate-300">
                            Không tìm thấy bài nghe nào phù hợp với ${combinedDesc || 'bộ lọc hiện tại'}.
                        </p>
                        <p class="text-xs text-slate-400 mt-1">
                            Hãy thử tìm với từ khóa khác hoặc xóa bộ lọc để hiển thị toàn bộ 600 bài nghe.
                        </p>
                        <button onclick="DailyDictationWorkstation.resetFilters()" class="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition">
                            <i class="fa-solid fa-rotate-left"></i> Xem tất cả bài nghe
                        </button>
                    </div>
                `;
            } else {
                filteredTests.forEach(test => {
                    const isOpen = this.openAccordions.has(test.testNum);
                    html += `
                        <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all shadow-2xs">
                            <!-- Accordion Header -->
                            <button onclick="DailyDictationWorkstation.toggleAccordion(${test.testNum})" 
                                class="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition ${isOpen ? 'bg-sky-50/70 dark:bg-slate-800/80 border-b border-sky-100 dark:border-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
                                <div class="flex items-center gap-2">
                                    <span class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                                        Practice Test ${test.testNum}
                                    </span>
                                    <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                        (${test.filteredLessons.length} lessons${test.filteredLessons.length !== test.lessons.length ? ` / ${test.lessons.length}` : ''})
                                    </span>
                                </div>
                                <span class="text-slate-400 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-600' : ''}">
                                    <i class="fa-solid fa-chevron-down"></i>
                                </span>
                            </button>

                            <!-- Accordion Body: 3-column Grid (Ảnh 3) -->
                            <div class="${isOpen ? 'block' : 'hidden'} p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-950/40">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    ${test.filteredLessons.map((lesson, idx) => {
                                        const lvl = (lesson.vocabLevel || 'B1').replace(/^Level\s*/i, '').trim().toUpperCase();
                                        let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
                                        if (lvl === 'A1') {
                                            badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
                                        } else if (lvl === 'A2') {
                                            badgeClass = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
                                        } else if (lvl === 'B1') {
                                            badgeClass = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
                                        } else if (lvl === 'B2') {
                                            badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
                                        } else if (lvl === 'C1') {
                                            badgeClass = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
                                        } else if (lvl === 'C2') {
                                            badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
                                        }

                                        return `
                                            <div onclick="DailyDictationWorkstation.openLesson(${test.testNum}, '${lesson.slug}')" 
                                                class="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition cursor-pointer group flex items-start justify-between">
                                                <div class="space-y-1">
                                                    <div class="font-bold text-sm text-indigo-700 dark:text-indigo-400 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                                                        <span>${lesson.name}</span>
                                                    </div>
                                                    <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                                                        ${lesson.topic}
                                                    </div>
                                                    <div class="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                                                        <span>${lesson.partsCount} parts</span>
                                                        <span>•</span>
                                                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${badgeClass}">
                                                            Level ${lvl}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="text-slate-300 group-hover:text-indigo-500 transition pt-1">
                                                    <i class="fa-solid fa-circle-play text-lg"></i>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                });
            }

            html += `
                </div>

                <!-- Footer Apps / Branding like DailyDictation -->
                <div class="pt-8 pb-4 flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800 gap-3">
                    <div>
                        Bản quyền bài nghe thuộc <strong>BestMyTest.com & ETS</strong> · Tích hợp chuyên sâu trên <strong>Cùng Đăng Ra Trường</strong>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10.5px]">
                            ✓ 30 Đề (600 Bài học: A1 · A2 · B1 · B2 · C1 · C2) sẵn sàng
                        </span>
                    </div>
                </div>
            `;

            catView.innerHTML = html;
        }

        toggleAccordion(testNum) {
            if (this.openAccordions.has(testNum)) {
                this.openAccordions.delete(testNum);
            } else {
                this.openAccordions.add(testNum);
            }
            this.renderCatalog();
        }

        onSearchInput(val) {
            this.filterSearch = val;
            clearTimeout(this._searchDebounce);
            this._searchDebounce = setTimeout(() => {
                this.renderCatalog();
            }, 300);
        }

        onLevelSelect(val) {
            this.filterLevel = val;
            this.renderCatalog();
        }

        quickFilterLevel(lvl) {
            this.filterLevel = lvl === 'All' ? 'All' : ('Level ' + lvl);
            this.renderCatalog();
        }

        applyFilters() {
            const searchInput = document.getElementById('ddwSearchInput');
            if (searchInput) this.filterSearch = searchInput.value.trim();
            const levelSelect = document.getElementById('ddwLevelSelect');
            if (levelSelect) this.filterLevel = levelSelect.value;
            this.renderCatalog();
        }

        resetFilters() {
            this.filterSearch = '';
            this.filterLevel = 'All';
            this.renderCatalog();
        }

        // =========================================================================
        // VIEW 2: EXERCISE WORKSTATION (Ảnh 4)
        // =========================================================================
        async openLesson(testNum, lessonSlug) {
            this.activeTestNum = testNum;
            if (typeof showToast === 'function') showToast(`🎧 Đang nạp bài nghe [Test ${testNum}] ${lessonSlug}...`);

            // Nạp chi tiết test từ DailyDictationDatabase
            if (window.DailyDictationDatabase) {
                const fullTest = await window.DailyDictationDatabase.loadTest(testNum);
                if (fullTest && fullTest.lessons) {
                    this.activeLesson = fullTest.lessons.find(l => l.slug === lessonSlug) || fullTest.lessons[0];
                }
            }

            if (!this.activeLesson) {
                if (typeof showToast === 'function') showToast('⚠️ Không thể tải dữ liệu bài nghe. Vui lòng thử lại!');
                return;
            }

            this.currentPartIndex = 0;
            this.userInputs = {};
            this.partResults = {};
            this.activeTab = 'dictation'; // 'dictation' | 'transcript'
            this.audioPlayCount = 0;

            this.activeView = 'exercise';
            const catView = document.getElementById('ddwCatalogView');
            const exView = document.getElementById('ddwExerciseView');
            if (catView) catView.classList.add('hidden');
            if (exView) exView.classList.remove('hidden');

            this.renderExercise();
            this.playCurrentSentenceAudio();
        }

        backToCatalog() {
            this.audioEl.pause();
            this.activeView = 'catalog';
            const catView = document.getElementById('ddwCatalogView');
            const exView = document.getElementById('ddwExerciseView');
            if (catView) catView.classList.remove('hidden');
            if (exView) exView.classList.add('hidden');
            this.renderCatalog();
        }

        renderExercise() {
            const exView = document.getElementById('ddwExerciseView');
            if (!exView || !this.activeLesson) return;

            const lesson = this.activeLesson;
            const currentChallenge = (lesson.challenges && lesson.challenges[this.currentPartIndex]) || {
                content: '',
                hint: null,
                audioSrc: lesson.audioSrc
            };

            const totalParts = lesson.challenges ? lesson.challenges.length : lesson.partsCount || 1;
            const currentPartNum = this.currentPartIndex + 1;
            const currentVal = this.userInputs[this.currentPartIndex] || '';
            const resultState = this.partResults[this.currentPartIndex];

            // Hint logic
            let hintDisplay = '';
            if (!this.settings.hideHint && currentChallenge.hint) {
                hintDisplay = `
                    <div class="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300 font-semibold py-1">
                        <span class="text-base">💡</span>
                        <span>Hint: <strong>${currentChallenge.hint}</strong></span>
                    </div>
                `;
            }

            let html = `
                <!-- Exercise Header (Ảnh 4) -->
                <div class="mb-4">
                    <button onclick="DailyDictationWorkstation.backToCatalog()" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 mb-2">
                        <i class="fa-solid fa-arrow-left"></i> Quay lại danh sách TOEIC Listening
                    </button>
                    <div class="flex flex-wrap items-baseline gap-2">
                        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                            [Practice Test ${this.activeTestNum}] ${lesson.name}
                        </h2>
                        <span class="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Vocab level: ${lesson.vocabLevel.replace('Level ', '')}
                        </span>
                    </div>
                    <div class="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                        ${lesson.topic}
                    </div>
                </div>

                <!-- Tabs (Dictation | Full transcript) (Ảnh 4) -->
                <div class="flex items-center border-b border-slate-200 dark:border-slate-800 mb-0">
                    <button onclick="DailyDictationWorkstation.switchTab('dictation')" 
                        class="px-5 py-2.5 text-sm font-bold border-b-2 transition ${this.activeTab === 'dictation' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-xl border-t border-x border-slate-200 dark:border-slate-800 mb-[-1px]' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}">
                        Dictation
                    </button>
                    <button onclick="DailyDictationWorkstation.switchTab('transcript')" 
                        class="px-5 py-2.5 text-sm font-bold border-b-2 transition ${this.activeTab === 'transcript' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-xl border-t border-x border-slate-200 dark:border-slate-800 mb-[-1px]' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}">
                        Full transcript
                    </button>
                </div>

                <!-- TAB 1: DICTATION WORKSPACE -->
                <div class="${this.activeTab === 'dictation' ? 'block' : 'hidden'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-2xl rounded-tr-2xl p-4 sm:p-7 shadow-sm space-y-4">
                    <!-- Top control row: Pagination & Settings -->
                    <div class="flex items-center justify-between">
                        <!-- Pagination -->
                        <div class="flex items-center gap-3 text-sm font-extrabold text-slate-700 dark:text-slate-200">
                            <button onclick="DailyDictationWorkstation.prevPart()" class="p-1 hover:text-indigo-600 transition" title="Câu trước (←)">
                                <i class="fa-solid fa-arrow-left"></i>
                            </button>
                            <span id="ddwPartCounter">${currentPartNum} / ${totalParts}</span>
                            <button onclick="DailyDictationWorkstation.nextPart()" class="p-1 hover:text-indigo-600 transition" title="Câu sau (→)">
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>

                        <!-- Settings Button -->
                        <button onclick="DailyDictationWorkstation.openSettings()" class="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 transition">
                            <i class="fa-solid fa-gear"></i> Settings
                        </button>
                    </div>

                    <!-- Audio Player Box (Ảnh 4) -->
                    <div class="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3 flex-grow max-w-xl">
                            <!-- Play / Pause Button -->
                            <button id="ddwPlayBtn" onclick="DailyDictationWorkstation.toggleAudio()" 
                                class="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-sm shadow-sm transition shrink-0" title="Phát/Dừng (Ctrl)">
                                <i class="fa-solid fa-play ml-0.5"></i>
                            </button>

                            <!-- Scrubber Progress Bar -->
                            <div class="flex-grow flex items-center gap-2">
                                <span id="ddwTimeCurrent" class="text-xs font-mono text-slate-500 font-bold shrink-0">0:00</span>
                                <input type="range" id="ddwScrubber" min="0" max="100" value="0" step="0.1" 
                                    oninput="DailyDictationWorkstation.onScrubberSeek(this.value)"
                                    class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600">
                                <span id="ddwTimeDuration" class="text-xs font-mono text-slate-500 font-bold shrink-0">0:00</span>
                            </div>
                        </div>

                        <!-- Speed selector & Volume -->
                        <div class="flex items-center gap-2.5">
                            <button onclick="DailyDictationWorkstation.toggleMute()" id="ddwVolBtn" class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition text-sm">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                            <select id="ddwSpeedSelect" onchange="DailyDictationWorkstation.setPlaybackSpeed(parseFloat(this.value))" 
                                class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-extrabold text-slate-700 dark:text-slate-200 focus:outline-none">
                                <option value="0.75" ${this.settings.playbackSpeed === 0.75 ? 'selected' : ''}>0.75x</option>
                                <option value="0.8" ${this.settings.playbackSpeed === 0.8 ? 'selected' : ''}>0.8x</option>
                                <option value="0.9" ${this.settings.playbackSpeed === 0.9 ? 'selected' : ''}>0.9x</option>
                                <option value="1.0" ${this.settings.playbackSpeed === 1.0 ? 'selected' : ''}>1.0x</option>
                                <option value="1.1" ${this.settings.playbackSpeed === 1.1 ? 'selected' : ''}>1.1x</option>
                                <option value="1.25" ${this.settings.playbackSpeed === 1.25 ? 'selected' : ''}>1.25x</option>
                            </select>
                        </div>
                    </div>

                    <!-- Hint -->
                    <div id="ddwHintBox">${hintDisplay}</div>

                    <!-- Feedback Box (Khi đã Check hoặc Skip) -->
                    <div id="ddwFeedbackBox" class="${resultState && resultState.checked ? 'block' : 'hidden'} p-4 rounded-2xl border transition-all">
                        ${resultState ? resultState.feedbackHtml : ''}
                    </div>

                    <!-- Textarea Typing Box (Ảnh 4) -->
                    <div class="relative">
                        <textarea id="ddwInput" rows="3" 
                            placeholder="Type what you hear..."
                            oninput="DailyDictationWorkstation.onUserTyping(this.value)"
                            class="w-full p-4 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none text-[15px] font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none transition shadow-inner">${currentVal}</textarea>
                        
                        <!-- Microphone Speech-to-Text Button -->
                        <button id="ddwMicBtn" onclick="DailyDictationWorkstation.toggleSpeechRecognition()" 
                            class="absolute right-3.5 bottom-3.5 p-2 text-slate-400 hover:text-indigo-600 transition" title="Nói qua Micro (Speech-to-Text)">
                            <i class="fa-solid fa-microphone text-base"></i>
                        </button>
                    </div>

                    <!-- Action Buttons (Check & Skip) (Ảnh 4) -->
                    <div class="flex items-center gap-3 pt-1">
                        <button id="ddwCheckBtn" onclick="DailyDictationWorkstation.checkAnswer()" 
                            class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm shadow-sm transition">
                            Check
                        </button>
                        <button id="ddwSkipBtn" onclick="DailyDictationWorkstation.skipCurrentPart()" 
                            class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-extrabold text-sm shadow-2xs transition">
                            Skip
                        </button>
                    </div>
                </div>

                <!-- TAB 2: FULL TRANSCRIPT WORKSPACE -->
                <div class="${this.activeTab === 'transcript' ? 'block' : 'hidden'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-2xl rounded-tr-2xl p-4 sm:p-6 shadow-sm space-y-3">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span class="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            <i class="fa-solid fa-file-audio text-indigo-500"></i> Toàn bộ nội dung bài nghe (${totalParts} câu)
                        </span>
                        <button onclick="DailyDictationWorkstation.playFullAudio()" class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition flex items-center gap-1.5">
                            <i class="fa-solid fa-play"></i> Nghe trọn bài
                        </button>
                    </div>

                    <div class="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                        ${(lesson.challenges || []).map((c, idx) => `
                            <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3 transition">
                                <button onclick="DailyDictationWorkstation.playSentenceAtIndex(${idx})" class="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-600 hover:text-white text-indigo-600 flex items-center justify-center text-xs shrink-0 mt-0.5 transition" title="Nghe câu này">
                                    <i class="fa-solid fa-play ml-0.5"></i>
                                </button>
                                <div class="space-y-1">
                                    <div class="text-xs font-bold text-slate-400">Câu ${idx + 1}</div>
                                    <div class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                                        ${c.content}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Footer Attribution & Tips (Ảnh 4) -->
                <div class="mt-5 space-y-3">
                    <div class="text-xs text-slate-400 leading-relaxed">
                        The recording in this exercise belongs to <a href="https://www.bestmytest.com" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline font-semibold">BestMyTest.com</a> - a website to help you prepare for TOEIC, IELTS and TOEFL exams.
                    </div>

                    <!-- Cycling Tip with Refresh Button -->
                    <div class="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 font-medium">
                        <div class="flex items-center gap-2">
                            <span class="text-base">💡</span>
                            <span id="ddwTipText">${this.tips[this.currentTipIndex]}</span>
                        </div>
                        <button onclick="DailyDictationWorkstation.cycleTip()" class="text-amber-600 hover:text-amber-800 dark:hover:text-amber-300 p-1 transition" title="Đổi mẹo khác">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                    </div>
                </div>
            `;

            exView.innerHTML = html;

            // Focus textarea after rendering
            setTimeout(() => {
                const inputEl = document.getElementById('ddwInput');
                if (inputEl) inputEl.focus();
            }, 100);
        }

        switchTab(tabName) {
            this.activeTab = tabName;
            this.renderExercise();
        }

        cycleTip() {
            this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
            const tipEl = document.getElementById('ddwTipText');
            if (tipEl) tipEl.textContent = this.tips[this.currentTipIndex];
        }

        // =========================================================================
        // AUDIO PLAYBACK CONTROLS
        // =========================================================================
        playCurrentSentenceAudio() {
            if (!this.activeLesson) return;
            const challenges = this.activeLesson.challenges || [];
            const challenge = challenges[this.currentPartIndex];
            const audioUrl = (challenge && challenge.audioSrc) || this.activeLesson.audioSrc;

            if (audioUrl) {
                this.audioEl.src = audioUrl;
                this.audioEl.playbackRate = this.settings.playbackSpeed || 1.0;
                this.audioPlayCount = 0;
                if (this.settings.autoPlay) {
                    this.audioEl.play().catch(() => {});
                }
            }
        }

        playSentenceAtIndex(idx) {
            if (!this.activeLesson) return;
            const challenge = (this.activeLesson.challenges || [])[idx];
            if (challenge && challenge.audioSrc) {
                this.audioEl.src = challenge.audioSrc;
                this.audioEl.playbackRate = this.settings.playbackSpeed || 1.0;
                this.audioEl.play().catch(() => {});
            }
        }

        playFullAudio() {
            if (this.activeLesson && this.activeLesson.audioSrc) {
                this.audioEl.src = this.activeLesson.audioSrc;
                this.audioEl.playbackRate = this.settings.playbackSpeed || 1.0;
                this.audioEl.play().catch(() => {});
            }
        }

        toggleAudio() {
            if (this.isPlaying) {
                this.audioEl.pause();
            } else {
                this.audioEl.play().catch(() => {});
            }
        }

        replayAudio() {
            this.audioEl.currentTime = 0;
            this.audioEl.play().catch(() => {});
        }

        updatePlayBtnUI() {
            const btn = document.getElementById('ddwPlayBtn');
            if (btn) {
                btn.innerHTML = this.isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play ml-0.5"></i>';
            }
        }

        updateAudioProgressUI() {
            const currentEl = document.getElementById('ddwTimeCurrent');
            const durationEl = document.getElementById('ddwTimeDuration');
            const scrubber = document.getElementById('ddwScrubber');

            const cur = this.audioEl.currentTime || 0;
            const dur = this.audioEl.duration || 0;

            if (currentEl) currentEl.textContent = this.formatTime(cur);
            if (durationEl) durationEl.textContent = this.formatTime(dur);
            if (scrubber && dur > 0) {
                scrubber.value = (cur / dur) * 100;
            }
        }

        onScrubberSeek(pct) {
            const dur = this.audioEl.duration || 0;
            if (dur > 0) {
                this.audioEl.currentTime = (pct / 100) * dur;
            }
        }

        formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${String(s).padStart(2, '0')}`;
        }

        setPlaybackSpeed(speed) {
            this.settings.playbackSpeed = speed;
            this.saveSettings();
            if (this.audioEl) {
                this.audioEl.playbackRate = speed;
            }
        }

        toggleMute() {
            this.audioEl.muted = !this.audioEl.muted;
            const volBtn = document.getElementById('ddwVolBtn');
            if (volBtn) {
                volBtn.innerHTML = this.audioEl.muted ? '<i class="fa-solid fa-volume-xmark text-red-500"></i>' : '<i class="fa-solid fa-volume-high"></i>';
            }
        }

        // =========================================================================
        // CHECKING & DIFF LOGIC
        // =========================================================================
        onUserTyping(val) {
            this.userInputs[this.currentPartIndex] = val;
        }

        normalizeWord(w) {
            return (w || '').toLowerCase().replace(/[^a-z0-9']/g, '');
        }

        checkAnswer() {
            if (!this.activeLesson) return;
            const currentChallenge = (this.activeLesson.challenges || [])[this.currentPartIndex];
            if (!currentChallenge) return;

            const targetContent = currentChallenge.content || '';
            const userText = (this.userInputs[this.currentPartIndex] || '').trim();

            if (!userText) {
                if (typeof showToast === 'function') showToast('✍️ Hãy gõ những gì bạn nghe được vào ô văn bản!');
                return;
            }

            // Word-by-word comparison
            const targetWords = targetContent.split(/\s+/).filter(Boolean);
            const userWords = userText.split(/\s+/).filter(Boolean);

            let allMatch = true;
            let diffHtml = '';

            const maxLen = Math.max(targetWords.length, userWords.length);

            for (let i = 0; i < maxLen; i++) {
                const targetW = targetWords[i];
                const userW = userWords[i];

                if (!targetW && userW) {
                    // Extra word typed by user
                    diffHtml += `<span class="px-1 text-red-500 line-through font-bold">${userW}</span> `;
                    allMatch = false;
                } else if (targetW && !userW) {
                    // Missing word
                    diffHtml += `<span class="px-1 text-red-600 bg-red-50 dark:bg-red-950/60 rounded border border-red-200 dark:border-red-800 font-bold underline">${targetW}</span> `;
                    allMatch = false;
                } else {
                    const normTarget = this.normalizeWord(targetW);
                    const normUser = this.normalizeWord(userW);

                    // Check acceptable solutions if available
                    let isAcceptable = normTarget === normUser;
                    if (!isAcceptable && currentChallenge.solution && currentChallenge.solution[i]) {
                        const altList = currentChallenge.solution[i];
                        if (Array.isArray(altList) && altList.some(alt => this.normalizeWord(alt) === normUser)) {
                            isAcceptable = true;
                        }
                    }

                    if (isAcceptable) {
                        diffHtml += `<span class="text-emerald-600 dark:text-emerald-400 font-bold">${targetW}</span> `;
                    } else {
                        allMatch = false;
                        diffHtml += `
                            <span class="inline-flex flex-col items-center mx-1">
                                <span class="text-[11px] text-emerald-600 font-bold">${targetW}</span>
                                <span class="text-red-500 line-through text-xs font-semibold">${userW}</span>
                            </span>
                        `;
                    }
                }
            }

            // Construct Feedback Banner
            let feedbackHtml = '';
            if (allMatch) {
                this.playChimeSound();
                feedbackHtml = `
                    <div class="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 space-y-1">
                        <div class="font-extrabold text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                            <i class="fa-solid fa-circle-check"></i> Chính xác tuyệt đối! (Correct)
                        </div>
                        <div class="text-sm font-bold text-slate-900 dark:text-white pt-1">
                            ${targetContent}
                        </div>
                    </div>
                `;
            } else {
                feedbackHtml = `
                    <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 space-y-2">
                        <div class="font-extrabold text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                            <span>⚠️ Chưa hoàn toàn chính xác. Hãy so sánh và sửa lại nhé:</span>
                            <span class="text-[11px] text-slate-400">Bấm Ctrl nghe lại</span>
                        </div>
                        <div class="text-sm leading-relaxed p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800">
                            ${diffHtml}
                        </div>
                    </div>
                `;
            }

            this.partResults[this.currentPartIndex] = {
                checked: true,
                isCorrect: allMatch,
                skipped: false,
                feedbackHtml
            };

            const fbBox = document.getElementById('ddwFeedbackBox');
            if (fbBox) {
                fbBox.innerHTML = feedbackHtml;
                fbBox.classList.remove('hidden');
            }

            // Cập nhật thống kê user nếu có hệ thống lưu tiến độ
            if (allMatch && window.state) {
                window.state.dictationDone = (window.state.dictationDone || 0) + 1;
                const counter = document.getElementById('dictationDoneCount');
                if (counter) counter.textContent = `${window.state.dictationDone} câu`;
            }

            // Tự động qua câu mới nếu đúng và bật Auto Next
            if (allMatch && this.settings.autoNext) {
                setTimeout(() => {
                    const totalParts = this.activeLesson.challenges ? this.activeLesson.challenges.length : 1;
                    if (this.currentPartIndex < totalParts - 1) {
                        this.nextPart();
                    } else {
                        if (typeof showToast === 'function') showToast('🎉 Chúc mừng bạn đã hoàn thành trọn vẹn bài nghe này!');
                    }
                }, 1200);
            }
        }

        skipCurrentPart() {
            if (!this.activeLesson) return;
            const currentChallenge = (this.activeLesson.challenges || [])[this.currentPartIndex];
            if (!currentChallenge) return;

            const targetContent = currentChallenge.content || '';

            const feedbackHtml = `
                <div class="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-3.5 space-y-1">
                    <div class="font-extrabold text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                        <i class="fa-solid fa-eye"></i> Đáp án của câu (Answer):
                    </div>
                    <div class="text-sm font-extrabold text-slate-900 dark:text-white pt-1">
                        ${targetContent}
                    </div>
                </div>
            `;

            this.partResults[this.currentPartIndex] = {
                checked: true,
                isCorrect: false,
                skipped: true,
                feedbackHtml
            };

            const inputEl = document.getElementById('ddwInput');
            if (inputEl) inputEl.value = targetContent;
            this.userInputs[this.currentPartIndex] = targetContent;

            const fbBox = document.getElementById('ddwFeedbackBox');
            if (fbBox) {
                fbBox.innerHTML = feedbackHtml;
                fbBox.classList.remove('hidden');
            }
        }

        prevPart() {
            if (this.currentPartIndex > 0) {
                this.currentPartIndex--;
                this.renderExercise();
                this.playCurrentSentenceAudio();
            }
        }

        nextPart() {
            const totalParts = this.activeLesson && this.activeLesson.challenges ? this.activeLesson.challenges.length : 1;
            if (this.currentPartIndex < totalParts - 1) {
                this.currentPartIndex++;
                this.renderExercise();
                this.playCurrentSentenceAudio();
            }
        }

        // =========================================================================
        // SETTINGS MODAL
        // =========================================================================
        openSettings() {
            const modal = document.getElementById('ddwSettingsModal');
            if (!modal) return;
            const autoPlayCb = document.getElementById('ddwSetAutoPlay');
            const replaySelect = document.getElementById('ddwSetReplayCount');
            const autoNextCb = document.getElementById('ddwSetAutoNext');
            const hideHintCb = document.getElementById('ddwSetHideHint');

            if (autoPlayCb) autoPlayCb.checked = !!this.settings.autoPlay;
            if (replaySelect) replaySelect.value = String(this.settings.replayCount || 1);
            if (autoNextCb) autoNextCb.checked = !!this.settings.autoNext;
            if (hideHintCb) hideHintCb.checked = !!this.settings.hideHint;

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        closeSettings() {
            const modal = document.getElementById('ddwSettingsModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }

        updateSetting(key, val) {
            this.settings[key] = val;
            this.saveSettings();
        }
    }

    window.DailyDictationWorkstation = new DailyDictationWorkstation();

})(typeof window !== 'undefined' ? window : global, typeof document !== 'undefined' ? document : {});
