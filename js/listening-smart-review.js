/**
 * =========================================================================
 * TOEIC LISTENING SMART REVIEW, SRS, SHADOWING & GAMIFICATION (PHASE 5)
 * =========================================================================
 * - Spaced Repetition System (SRS: 1 - 3 - 7 - 14 - 30 ngày)
 * - Dictation Engine: Chấm từng từ với thuật toán LCS Diff & tô màu chuẩn xác
 * - Shadowing Engine: Nghe - Thu âm - So sánh giọng nói qua Web Audio API
 * - Gamification & Huy hiệu mốc thực tế: Streak 7 ngày, Thợ săn bẫy, Mock Centurion
 * - Offline Preloading & Audio Caching (Cache Storage API)
 * =========================================================================
 */

(function(window) {
    'use strict';

    function safeToast(msg) {
        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
            window.showToast(msg);
        } else if (typeof showToast === 'function') {
            showToast(msg);
        } else {
            console.log('[TOAST]', msg);
        }
    }

    const SRS_STORAGE_KEY = 'toeic_listening_srs_v2';
    const BADGES_STORAGE_KEY = 'toeic_listening_badges_v2';
    const AUDIO_CACHE_NAME = 'toeic-listening-audio-v2';

    // SRS Intervals in Milliseconds
    const SRS_INTERVALS_MS = {
        1: 1 * 24 * 60 * 60 * 1000,   // Box 1: 1 ngày
        2: 3 * 24 * 60 * 60 * 1000,   // Box 2: 3 ngày
        3: 7 * 24 * 60 * 60 * 1000,   // Box 3: 7 ngày
        4: 14 * 24 * 60 * 60 * 1000,  // Box 4: 14 ngày
        5: 30 * 24 * 60 * 60 * 1000   // Box 5: 30 ngày
    };

    /* -------------------------------------------------------------------------
     * 1. SPACED REPETITION SYSTEM (SRS) ENGINE
     * ------------------------------------------------------------------------- */
    const ToeicListeningSRS = {
        getItems() {
            try {
                const raw = localStorage.getItem(SRS_STORAGE_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        },

        saveItems(items) {
            try {
                localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(items));
            } catch (e) {
                console.error('Failed to save SRS items:', e);
            }
        },

        // Tự động thêm câu làm sai vào Sổ tay Ôn tập ngắt quãng (Box 1)
        addQuestion(qData) {
            if (!qData || !qData.id) return;
            const items = this.getItems();
            const existingIdx = items.findIndex(item => item.id === qData.id);

            const newItem = {
                id: qData.id,
                part: qData.part || 1,
                q: qData.q || '',
                options: qData.options || [],
                ans: qData.ans !== undefined ? qData.ans : 0,
                ansLetter: qData.ansLetter || (typeof qData.ans === 'number' ? ['A','B','C','D'][qData.ans] : qData.ans) || 'A',
                explanation_vi: qData.explanation_vi || qData.explain || '',
                trap_type: qData.trap_type || 'Bẫy đề thi',
                correct_reason: qData.correct_reason || '',
                audio_url: qData.audio_url || '',
                transcript: qData.transcript || qData.audioScript || '',
                translation_vi: qData.translation_vi || '',
                box: 1, // Khởi đầu tại Hộp 1 (1 ngày)
                addedAt: Date.now(),
                lastReviewed: Date.now(),
                nextReviewDate: Date.now() + SRS_INTERVALS_MS[1],
                consecutiveSuccesses: 0
            };

            if (existingIdx >= 0) {
                // Nếu đã có nhưng làm sai lại, hạ về Box 1
                items[existingIdx].box = 1;
                items[existingIdx].nextReviewDate = Date.now() + SRS_INTERVALS_MS[1];
                items[existingIdx].lastReviewed = Date.now();
                items[existingIdx].consecutiveSuccesses = 0;
            } else {
                items.push(newItem);
            }

            this.saveItems(items);
            this.updateBadgeCounter();
        },

        // Lấy danh sách các câu cần ôn tập hôm nay
        getDueItems() {
            const now = Date.now();
            return this.getItems().filter(item => item.nextReviewDate <= now);
        },

        // Ghi nhận kết quả ôn tập một câu trong SRS
        recordReview(itemId, wasCorrect) {
            const items = this.getItems();
            const item = items.find(i => i.id === itemId);
            if (!item) return;

            item.lastReviewed = Date.now();
            if (wasCorrect) {
                item.consecutiveSuccesses = (item.consecutiveSuccesses || 0) + 1;
                item.box = Math.min(5, (item.box || 1) + 1);
            } else {
                item.consecutiveSuccesses = 0;
                item.box = 1; // Sai thì quay lại Hộp 1
            }

            item.nextReviewDate = Date.now() + (SRS_INTERVALS_MS[item.box] || SRS_INTERVALS_MS[1]);
            this.saveItems(items);
            this.updateBadgeCounter();
        },

        updateBadgeCounter() {
            const dueCount = this.getDueItems().length;
            const el = document.getElementById('srsDueBadge');
            if (el) {
                if (dueCount > 0) {
                    el.textContent = `${dueCount} cần ôn`;
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            }
        },

        // Mở Modal Ôn Tập Lặp Lại Ngắt Quãng
        openReviewModal() {
            const dueItems = this.getDueItems();
            if (dueItems.length === 0) {
                safeToast('🎉 Tuyệt vời! Bạn không còn câu hỏi nào tồn đọng cần ôn hôm nay.');
                return;
            }

            let modal = document.getElementById('srsReviewModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'srsReviewModal';
                modal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-hidden';
                document.body.appendChild(modal);
            }

            let currentIndex = 0;

            const renderQuestion = () => {
                if (currentIndex >= dueItems.length) {
                    modal.innerHTML = `
                        <div class="bg-white dark:bg-slate-900 rounded-[28px] max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
                            <div class="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 flex items-center justify-center text-3xl mx-auto shadow-md">
                                <i class="fa-solid fa-calendar-check"></i>
                            </div>
                            <h3 class="text-xl font-black text-slate-900 dark:text-white">Hoàn Thành Ôn Tập Hôm Nay!</h3>
                            <p class="text-xs text-slate-500">Các câu hỏi đã được tự động dời lịch theo thuật toán SRS (1-3-7-14-30 ngày). Não bộ của bạn đã củng cố trí nhớ dài hạn thành công!</p>
                            <button onclick="document.getElementById('srsReviewModal').remove();" class="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer">
                                Đóng & Tiếp tục học
                            </button>
                        </div>
                    `;
                    return;
                }

                const item = dueItems[currentIndex];
                const boxDays = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };

                modal.innerHTML = `
                    <div class="bg-white dark:bg-slate-900 rounded-[28px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-150">
                        <!-- Header -->
                        <div class="p-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between shrink-0">
                            <div class="space-y-0.5">
                                <span class="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                                    🧠 ÔN TẬP NGẮT QUÃNG (SRS BOX ${item.box || 1} · LẶP LẠI SAU ${boxDays[item.box || 1]} NGÀY)
                                </span>
                                <h3 class="text-sm font-black">Câu ${currentIndex + 1} / ${dueItems.length} cần ôn hôm nay</h3>
                            </div>
                            <button onclick="document.getElementById('srsReviewModal').remove();" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer">
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                            ${item.audio_url ? `
                                <div class="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between gap-3">
                                    <div class="flex items-center gap-2">
                                        <i class="fa-solid fa-headphones text-teal-600 text-base"></i>
                                        <span class="font-bold text-slate-800 dark:text-slate-200">Nghe lại audio câu hỏi:</span>
                                    </div>
                                    <button onclick="const a = new Audio('${item.audio_url}'); a.play();" class="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1.5 transition cursor-pointer">
                                        <i class="fa-solid fa-play text-[10px]"></i> Phát Audio
                                    </button>
                                </div>
                            ` : ''}

                            <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                                ${item.q}
                            </div>

                            <div class="space-y-2" id="srsOptionsBox">
                                ${item.options.map((opt, optIdx) => {
                                    const optKey = opt.trim().charAt(0);
                                    return `
                                        <button onclick="handleSRSAnswer('${optKey}')" class="srs-opt-btn w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-400 font-medium transition flex items-center justify-between cursor-pointer">
                                            <span>${opt}</span>
                                            <span class="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 font-bold flex items-center justify-center text-[10px]">${optKey}</span>
                                        </button>
                                    `;
                                }).join('')}
                            </div>

                            <div id="srsResultBox" class="hidden p-4 rounded-2xl space-y-2 border"></div>
                        </div>

                        <!-- Footer -->
                        <div class="p-3.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
                            <span class="text-[11px] text-slate-500">Mẹo: Hãy lắng nghe kỹ bẫy trước khi chọn đáp án</span>
                            <button id="srsNextBtn" onclick="nextSRSQuestion()" class="hidden px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition flex items-center gap-1 cursor-pointer">
                                <span>Câu tiếp theo</span>
                                <i class="fa-solid fa-chevron-right text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                `;

                window.handleSRSAnswer = (selectedKey) => {
                    const isCorrect = selectedKey === item.ansLetter;
                    ToeicListeningSRS.recordReview(item.id, isCorrect);

                    const resBox = document.getElementById('srsResultBox');
                    const nextBtn = document.getElementById('srsNextBtn');
                    const buttons = document.querySelectorAll('.srs-opt-btn');
                    buttons.forEach(b => b.disabled = true);

                    if (resBox) {
                        resBox.classList.remove('hidden');
                        if (isCorrect) {
                            resBox.className = 'p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 space-y-1';
                            resBox.innerHTML = `
                                <div class="font-extrabold flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600"></i> Chính xác! Đã nâng lên Hộp ${Math.min(5, (item.box || 1) + 1)} (Lặp lại sau ${boxDays[Math.min(5, (item.box || 1) + 1)]} ngày)</div>
                                <p class="text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-300">${item.explanation_vi}</p>
                            `;
                        } else {
                            resBox.className = 'p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-900 dark:text-rose-200 space-y-1';
                            resBox.innerHTML = `
                                <div class="font-extrabold flex items-center gap-1.5"><i class="fa-solid fa-circle-xmark text-rose-600"></i> Chưa đúng! Đáp án đúng là <strong>${item.ansLetter}</strong>. Đã đưa về Hộp 1 (Lặp lại vào ngày mai)</div>
                                <p class="text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-300">${item.explanation_vi}</p>
                            `;
                        }
                    }

                    if (nextBtn) nextBtn.classList.remove('hidden');
                };

                window.nextSRSQuestion = () => {
                    currentIndex++;
                    renderQuestion();
                };
            };

            renderQuestion();
        }
    };


    /* -------------------------------------------------------------------------
     * 2. DICTATION DIFF ENGINE (Thuật toán LCS so sánh từng từ chính xác)
     * ------------------------------------------------------------------------- */
    const ToeicDictationEngine = {
        // Làm sạch văn bản để so sánh từ vựng (bỏ dấu câu, chuyển chữ thường)
        cleanTokens(text) {
            return (text || '')
                .toLowerCase()
                .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
                .trim()
                .split(/\s+/)
                .filter(Boolean);
        },

        // Thuật toán Longest Common Subsequence (LCS) chấm điểm từng từ
        checkDiff(userInput, targetText) {
            const userTokens = this.cleanTokens(userInput);
            const targetTokens = this.cleanTokens(targetText);

            const m = userTokens.length;
            const n = targetTokens.length;

            // Ma trận DP tính độ dài chuỗi con chung dài nhất
            const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    if (userTokens[i - 1] === targetTokens[j - 1]) {
                        dp[i][j] = dp[i - 1][j - 1] + 1;
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                }
            }

            // Truy vết kết quả Diff
            let i = m, j = n;
            const diffSequence = [];

            while (i > 0 || j > 0) {
                if (i > 0 && j > 0 && userTokens[i - 1] === targetTokens[j - 1]) {
                    diffSequence.unshift({ type: 'correct', word: targetTokens[j - 1] });
                    i--;
                    j--;
                } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                    // Thiếu từ trong bài gốc
                    diffSequence.unshift({ type: 'missing', word: targetTokens[j - 1] });
                    j--;
                } else if (i > 0) {
                    // Thừa hoặc sai từ
                    diffSequence.unshift({ type: 'wrong', word: userTokens[i - 1] });
                    i--;
                }
            }

            const correctCount = dp[m][n];
            const accuracy = targetTokens.length > 0 ? Math.round((correctCount / targetTokens.length) * 100) : 0;

            // Sinh HTML tô màu trực quan
            const html = diffSequence.map(item => {
                if (item.type === 'correct') {
                    return `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">${item.word}</span>`;
                } else if (item.type === 'missing') {
                    return `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded-md border-b-2 border-amber-500 text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 italic font-semibold">[thiếu: ${item.word}]</span>`;
                } else {
                    return `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 line-through font-semibold">${item.word}</span>`;
                }
            }).join(' ');

            return {
                accuracy,
                correctCount,
                totalTargetWords: targetTokens.length,
                totalUserWords: userTokens.length,
                html,
                diffSequence
            };
        }
    };


    /* -------------------------------------------------------------------------
     * 3. SHADOWING ENGINE (Nghe - Ghi âm - So sánh giọng nói qua Web Audio API)
     * ------------------------------------------------------------------------- */
    const ToeicShadowingEngine = {
        mediaRecorder: null,
        audioChunks: [],
        recordedAudioUrl: null,
        isRecording: false,

        async startRecording() {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    safeToast('⚠️ Trình duyệt của bạn không hỗ trợ ghi âm microphone.');
                    return false;
                }
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.audioChunks = [];
                this.mediaRecorder = new MediaRecorder(stream);

                this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) this.audioChunks.push(e.data);
                };

                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    this.recordedAudioUrl = URL.createObjectURL(audioBlob);
                    if (window.onShadowRecordingFinished) {
                        window.onShadowRecordingFinished(this.recordedAudioUrl);
                    }
                };

                this.mediaRecorder.start();
                this.isRecording = true;
                return true;
            } catch (err) {
                console.error('Shadowing mic access error:', err);
                safeToast('⚠️ Không thể truy cập Microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.');
                return false;
            }
        },

        stopRecording() {
            if (this.mediaRecorder && this.isRecording) {
                this.mediaRecorder.stop();
                this.isRecording = false;
                this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
            }
        }
    };


    /* -------------------------------------------------------------------------
     * 4. GAMIFICATION & HUY HIỆU ETS THỰC TẾ
     * ------------------------------------------------------------------------- */
    const ToeicListeningBadges = {
        BADGE_DEFINITIONS: [
            { id: 'first_blood', title: 'Khởi đầu nan', desc: 'Hoàn thành bài luyện nghe đầu tiên', icon: '🌱' },
            { id: 'streak_7', title: 'Kỷ luật Thép 7 Ngày', desc: 'Duy trì chuỗi học nghe 7 ngày liên tiếp', icon: '🔥' },
            { id: 'part2_master', title: 'Phản Xạ Part 2', desc: 'Đạt từ 90% chính xác trở lên trong Part 2', icon: '🎯' },
            { id: 'mock_centurion', title: 'Dũng Sĩ 100 Câu ETS', desc: 'Hoàn thành bài thi Full Test 100 câu', icon: '🏆' },
            { id: 'trap_hunter', title: 'Thợ Săn Bẫy Đồng Âm', desc: 'Vượt qua 15 bẫy câu hỏi gián tiếp & đồng âm', icon: '🛡️' },
            { id: 'srs_scholar', title: 'Bậc Thầy Trí Nhớ SRS', desc: 'Đưa 10 câu hỏi lên Hộp 5 trong hệ thống SRS', icon: '🧠' }
        ],

        getUnlockedBadges() {
            try {
                const raw = localStorage.getItem(BADGES_STORAGE_KEY);
                return raw ? JSON.parse(raw) : ['first_blood'];
            } catch (e) {
                return ['first_blood'];
            }
        },

        unlockBadge(badgeId) {
            const unlocked = new Set(this.getUnlockedBadges());
            if (!unlocked.has(badgeId)) {
                unlocked.add(badgeId);
                localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify([...unlocked]));
                const def = this.BADGE_DEFINITIONS.find(b => b.id === badgeId);
                if (def) {
                    safeToast(`🎖️ HUY HIỆU MỚI: ${def.icon} ${def.title} - ${def.desc}`);
                }
            }
        },

        checkMilestones() {
            const stats = window.ListeningDashboard ? window.ListeningDashboard.getStats() : null;
            if (!stats) return;

            if (stats.totalAnswered >= 1) this.unlockBadge('first_blood');
            if (stats.parts[2].done >= 25 && Math.round((stats.parts[2].correct / stats.parts[2].done) * 100) >= 90) {
                this.unlockBadge('part2_master');
            }
            if (stats.totalAnswered >= 100) this.unlockBadge('mock_centurion');

            const srsItems = ToeicListeningSRS.getItems();
            if (srsItems.filter(i => i.box === 5).length >= 10) {
                this.unlockBadge('srs_scholar');
            }
        }
    };


    /* -------------------------------------------------------------------------
     * 5. OFFLINE AUDIO PRELOADER (Cache Storage API)
     * ------------------------------------------------------------------------- */
    const ToeicOfflineAudioCache = {
        async preloadPartAudio(partNum) {
            if (!('caches' in window)) {
                safeToast('Trình duyệt không hỗ trợ Cache Storage để lưu offline.');
                return;
            }
            try {
                safeToast(`⏳ Đang tải trước âm thanh Part ${partNum} để học Offline...`);
                const cache = await caches.open(AUDIO_CACHE_NAME);
                const qList = window.ListeningDatabaseV2 ? window.ListeningDatabaseV2.getFlattenedQuestions(partNum) : [];
                const urls = [...new Set(qList.map(q => q.audio_url).filter(Boolean))];

                let loaded = 0;
                for (const url of urls) {
                    try {
                        await cache.add(url);
                        loaded++;
                    } catch (e) {
                        console.warn('Could not cache url:', url, e);
                    }
                }
                safeToast(`✅ Đã tải xong ${loaded}/${urls.length} tệp âm thanh Part ${partNum} sẵn sàng cho chế độ Offline!`);
            } catch (err) {
                console.error('Offline caching error:', err);
                safeToast('⚠️ Không thể lưu cache offline.');
            }
        }
    };


    // Export to Window Global
    window.ToeicListeningSRS = ToeicListeningSRS;
    window.ToeicDictationEngine = ToeicDictationEngine;
    window.ToeicShadowingEngine = ToeicShadowingEngine;
    window.ToeicListeningBadges = ToeicListeningBadges;
    window.ToeicOfflineAudioCache = ToeicOfflineAudioCache;

    // Tự động kiểm tra badge và SRS khi nạp
    setTimeout(() => {
        if (ToeicListeningSRS.updateBadgeCounter) ToeicListeningSRS.updateBadgeCounter();
        if (ToeicListeningBadges.checkMilestones) ToeicListeningBadges.checkMilestones();
    }, 500);

})(typeof window !== 'undefined' ? window : global);
