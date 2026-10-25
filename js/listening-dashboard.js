/**
 * =========================================================================
 * TOEIC LISTENING DASHBOARD & ADAPTIVE ENGINE (PHASE 4 - ETS 2026 EDITION)
 * =========================================================================
 * Quản lý giao diện Luyện Nghe thông minh:
 * - Tiếp tục học (nhớ bài/set gần nhất)
 * - Gợi ý hôm nay theo điểm yếu & loại bẫy
 * - Thống kê thực tế: Tỷ lệ đúng từng Part, Điểm ước tính 5-495, Heatmap bẫy
 * - Đấu trường Thi Thử 100 câu (45 phút) & Mini Test 25 câu (12 phút)
 * - Luyện nghe thích ứng Adaptive AI
 * - Bộ lọc & tìm kiếm chủ đề / độ khó / trạng thái làm bài
 * =========================================================================
 */

(function(window) {
    'use strict';

    const STORAGE_KEY_ANSWERS = 'toeic_listening_answers_v2';
    const STORAGE_KEY_LAST = 'toeic_listening_last_practiced_v2';
    const STORAGE_KEY_SESSIONS = 'toeic_listening_sessions_v2';

    const ListeningDashboard = {
        // Lấy lịch sử làm bài từ localStorage
        getHistory() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                console.warn('Could not read listening history:', e);
                return [];
            }
        },

        // Ghi nhận 1 câu trả lời
        recordAnswer(qData, isCorrect, timeSpentSec = 15) {
            if (!qData || !qData.id) return;
            try {
                const history = this.getHistory();
                const record = {
                    id: qData.id,
                    part: qData.part || 1,
                    topic: qData.topic || '',
                    trap_type: qData.trap_type || 'cơ bản',
                    question_type: qData.question_type || 'general',
                    difficulty: qData.difficulty || 'B1',
                    isCorrect: !!isCorrect,
                    timeSpentSec: Math.max(2, parseInt(timeSpentSec, 10) || 15),
                    timestamp: Date.now()
                };

                // Cập nhật câu gần nhất
                history.push(record);
                // Giữ tối đa 1000 bản ghi gần nhất
                if (history.length > 1000) history.shift();
                localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(history));

                // Lưu vị trí học cuối cùng
                const lastInfo = {
                    part: qData.part || 1,
                    questionId: qData.id,
                    topic: qData.topic || `Part ${qData.part}`,
                    timestamp: Date.now()
                };
                localStorage.setItem(STORAGE_KEY_LAST, JSON.stringify(lastInfo));

                // Tự động làm mới UI Dashboard nếu view-nghe đang hiển thị
                this.renderStats();
            } catch (e) {
                console.error('Error saving listening answer:', e);
            }
        },

        // Lấy bài học gần nhất
        getLastPracticed() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_LAST);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        },

        // Tính toán toàn bộ thống kê thực tế
        getStats() {
            const history = this.getHistory();
            const totalAnswered = history.length;
            const totalCorrect = history.filter(h => h.isCorrect).length;
            const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

            // Thống kê theo từng Part (1, 2, 3, 4)
            const parts = { 1: { done: 0, correct: 0 }, 2: { done: 0, correct: 0 }, 3: { done: 0, correct: 0 }, 4: { done: 0, correct: 0 } };
            let totalTimeSec = 0;

            // Bảng phân tích bẫy (Heatmap)
            const trapStats = {};

            history.forEach(item => {
                const p = item.part || 1;
                if (parts[p]) {
                    parts[p].done++;
                    if (item.isCorrect) parts[p].correct++;
                }
                totalTimeSec += (item.timeSpentSec || 15);

                const trap = item.trap_type || 'Chung';
                if (!trapStats[trap]) {
                    trapStats[trap] = { total: 0, wrong: 0 };
                }
                trapStats[trap].total++;
                if (!item.isCorrect) trapStats[trap].wrong++;
            });

            const avgTimePerQuestion = totalAnswered > 0 ? Math.round(totalTimeSec / totalAnswered) : 0;

            // Ước lượng điểm Listening 5-495
            const scaledScoreObj = window.ListeningDatabaseV2 ? 
                window.ListeningDatabaseV2.calculateScore(Math.round((overallAccuracy / 100) * 100)) : 
                { scaledScore: 5, cefr: 'A1', evaluation: 'Chưa đủ dữ liệu' };

            // Chuyển trapStats thành danh sách sắp xếp theo độ yếu (tỷ lệ sai cao nhất)
            const trapHeatmap = Object.keys(trapStats).map(trap => {
                const st = trapStats[trap];
                const errorRate = Math.round((st.wrong / st.total) * 100);
                return {
                    name: trap,
                    total: st.total,
                    wrong: st.wrong,
                    errorRate
                };
            }).sort((a, b) => b.errorRate - a.errorRate);

            return {
                totalAnswered,
                totalCorrect,
                overallAccuracy,
                parts,
                avgTimePerQuestion,
                scaledScoreObj,
                trapHeatmap
            };
        },

        // Gợi ý thông minh hôm nay dựa trên điểm yếu
        getDailyRecommendation() {
            const stats = this.getStats();
            
            // Nếu chưa có lịch sử, gợi ý làm Part 1 khởi động
            if (stats.totalAnswered === 0) {
                return {
                    part: 1,
                    title: "Khởi động với Part 1: Mô tả hình ảnh (6 câu chuẩn ETS)",
                    reason: "Hãy bắt đầu làm quen với giọng đọc và nhịp độ bài thi thật qua 6 câu miêu tả tranh có hình ảnh minh họa sắc nét.",
                    actionText: "Luyện Part 1 ngay",
                    badge: "🌟 Khởi động ngày mới"
                };
            }

            // Tìm Part có tỷ lệ đúng thấp nhất trong các Part đã làm
            let lowestPart = 1;
            let lowestAcc = 101;
            let partsAttempted = 0;

            [1, 2, 3, 4].forEach(p => {
                const pStat = stats.parts[p];
                if (pStat.done > 0) {
                    partsAttempted++;
                    const acc = Math.round((pStat.correct / pStat.done) * 100);
                    if (acc < lowestAcc) {
                        lowestAcc = acc;
                        lowestPart = p;
                    }
                }
            });

            // Nếu còn Part chưa từng làm, gợi ý Part đó để hoàn thiện đủ 4 Part
            for (let p = 1; p <= 4; p++) {
                if (stats.parts[p].done === 0) {
                    const partNames = {
                        1: "Part 1: Photographs (Tranh tả người & vật)",
                        2: "Part 2: Question-Response (Phản xạ 3 đáp án)",
                        3: "Part 3: Conversations (Đoạn hội thoại đa giọng)",
                        4: "Part 4: Short Talks (Bài nói độc thoại ngắn)"
                    };
                    return {
                        part: p,
                        title: `Khám phá ${partNames[p]}`,
                        reason: `Bạn chưa thử sức với Part ${p}. Hãy hoàn thành để mở khóa đầy đủ bản đồ năng lực 4 Part!`,
                        actionText: `Luyện Part ${p} ngay`,
                        badge: "🎯 Mở rộng kỹ năng"
                    };
                }
            }

            // Gợi ý củng cố Part yếu nhất
            const worstTrap = stats.trapHeatmap[0]?.name || 'các bẫy âm thanh tương tự';
            return {
                part: lowestPart,
                title: `Củng cố Part ${lowestPart} (Tỷ lệ đúng hiện tại: ${lowestAcc}%)`,
                reason: `Hệ thống ghi nhận bạn hay nhầm lẫn ở dạng "${worstTrap}". Luyện tập ngay để bứt phá phản xạ nghe!`,
                actionText: `Khắc phục điểm yếu Part ${lowestPart}`,
                badge: "🔥 Trọng tâm cải thiện"
            };
        },

        // Tạo bộ câu hỏi Adaptive dựa trên câu sai & dạng bẫy yếu
        getAdaptiveQuestions(count = 20) {
            if (!window.ListeningDatabaseV2) return [];
            const allQ = window.ListeningDatabaseV2.getAllMockTestQuestions();
            const history = this.getHistory();
            
            // Tập hợp ID các câu đã sai
            const wrongIds = new Set(history.filter(h => !h.isCorrect).map(h => h.id));
            
            // Nhặt các câu người học đã từng làm sai
            const wrongQuestions = allQ.filter(q => wrongIds.has(q.id));

            // Nhặt thêm các câu có dạng bẫy mà người học có tỷ lệ sai cao
            const stats = this.getStats();
            const worstTrapNames = new Set(stats.trapHeatmap.slice(0, 3).map(t => t.name));
            const trapQuestions = allQ.filter(q => worstTrapNames.has(q.trap_type) && !wrongIds.has(q.id));

            // Trộn và bù câu hỏi cho đủ số lượng
            let adaptivePool = [...wrongQuestions, ...trapQuestions];
            if (adaptivePool.length < count) {
                const remaining = allQ.filter(q => !adaptivePool.some(a => a.id === q.id));
                // Xáo trộn ngẫu nhiên
                remaining.sort(() => 0.5 - Math.random());
                adaptivePool = [...adaptivePool, ...remaining.slice(0, count - adaptivePool.length)];
            }

            // Xáo trộn cuối cùng
            adaptivePool.sort(() => 0.5 - Math.random());
            return adaptivePool.slice(0, count);
        },

        // Khởi động bài Thi thử Full 100 câu
        startFullMockTest() {
            if (window.FullPartPracticeEngine) {
                window.FullPartPracticeEngine.startPart('mock_full', 'exam');
            } else {
                showToast('Hệ thống thi thử đang khởi tạo...');
            }
        },

        // Khởi động bài Mini Test 25 câu
        startMiniMockTest() {
            if (window.FullPartPracticeEngine) {
                window.FullPartPracticeEngine.startPart('mock_mini', 'exam');
            } else {
                showToast('Hệ thống thi thử đang khởi tạo...');
            }
        },

        // Khởi động bài Adaptive AI
        startAdaptivePractice() {
            if (window.FullPartPracticeEngine) {
                window.FullPartPracticeEngine.startPart('adaptive', 'practice');
            } else {
                showToast('Hệ thống luyện thích ứng đang khởi tạo...');
            }
        },

        // Tiếp tục bài học cuối cùng
        continueLastPracticed() {
            const last = this.getLastPracticed();
            if (last && last.part) {
                window.openFullPartPracticeModal(last.part, 'practice');
            } else {
                window.openFullPartPracticeModal(1, 'practice');
            }
        },

        // Render thống kê và giao diện Dashboard
        renderStats() {
            const stats = this.getStats();
            const last = this.getLastPracticed();
            const dailyRec = this.getDailyRecommendation();

            // 1. Cập nhật các stat pills trên banner chính
            const partsDoneCount = [1, 2, 3, 4].filter(p => stats.parts[p].done > 0).length;
            const listenPartsCount = document.getElementById('listenPartsCount');
            if (listenPartsCount) listenPartsCount.textContent = `${partsDoneCount}/4`;

            const listenDoneStat = document.getElementById('listenDoneStat');
            if (listenDoneStat) listenDoneStat.textContent = `${stats.totalAnswered}/100`;

            const listenMinStat = document.getElementById('listenMinStat');
            if (listenMinStat) {
                const minutes = Math.round((stats.totalAnswered * (stats.avgTimePerQuestion || 15)) / 60);
                listenMinStat.textContent = `${minutes} phút`;
            }

            const listenAvgTimeStat = document.getElementById('listenAvgTimeStat');
            if (listenAvgTimeStat) {
                listenAvgTimeStat.textContent = stats.avgTimePerQuestion ? `${stats.avgTimePerQuestion}s` : '—';
            }

            const totalCoverage = Math.min(100, Math.round((stats.totalAnswered / 100) * 100));
            const listenTotalPercent = document.getElementById('listenTotalPercent');
            if (listenTotalPercent) listenTotalPercent.textContent = `${totalCoverage}%`;
            const listenTotalProgressBar = document.getElementById('listenTotalProgressBar');
            if (listenTotalProgressBar) listenTotalProgressBar.style.width = `${totalCoverage}%`;

            // Cập nhật badges và progress bars từng Part
            const p1Done = stats.parts[1].done || 0;
            const p1Pct = Math.min(100, Math.round((p1Done / 6) * 100));
            const part1DoneBadge = document.getElementById('part1DoneBadge');
            if (part1DoneBadge) part1DoneBadge.innerHTML = `<i class="fa-solid fa-list-check mr-1 text-indigo-500"></i>${p1Done}/6 câu`;
            const part1Percent = document.getElementById('part1Percent');
            if (part1Percent) part1Percent.textContent = `${p1Pct}%`;
            const part1ProgressBar = document.getElementById('part1ProgressBar');
            if (part1ProgressBar) part1ProgressBar.style.width = `${p1Pct}%`;

            const p2Done = stats.parts[2].done || 0;
            const p2Pct = Math.min(100, Math.round((p2Done / 25) * 100));
            const part2DoneBadge = document.getElementById('part2DoneBadge');
            if (part2DoneBadge) part2DoneBadge.innerHTML = `<i class="fa-solid fa-list-check mr-1 text-fuchsia-500"></i>${p2Done}/25 câu`;
            const part2Percent = document.getElementById('part2Percent');
            if (part2Percent) part2Percent.textContent = `${p2Pct}%`;
            const part2ProgressBar = document.getElementById('part2ProgressBar');
            if (part2ProgressBar) part2ProgressBar.style.width = `${p2Pct}%`;

            const p3Done = stats.parts[3].done || 0;
            const p3Pct = Math.min(100, Math.round((p3Done / 39) * 100));
            const part3DoneBadge = document.getElementById('part3DoneBadge');
            if (part3DoneBadge) part3DoneBadge.innerHTML = `<i class="fa-solid fa-list-check mr-1 text-teal-600"></i>${p3Done}/39 câu`;
            const part3Percent = document.getElementById('part3Percent');
            if (part3Percent) part3Percent.textContent = `${p3Pct}%`;
            const part3ProgressBar = document.getElementById('part3ProgressBar');
            if (part3ProgressBar) part3ProgressBar.style.width = `${p3Pct}%`;

            const p4Done = stats.parts[4].done || 0;
            const p4Pct = Math.min(100, Math.round((p4Done / 30) * 100));
            const part4DoneBadge = document.getElementById('part4DoneBadge');
            if (part4DoneBadge) part4DoneBadge.innerHTML = `<i class="fa-solid fa-list-check mr-1 text-sky-600"></i>${p4Done}/30 câu`;
            const part4Percent = document.getElementById('part4Percent');
            if (part4Percent) part4Percent.textContent = `${p4Pct}%`;
            const part4ProgressBar = document.getElementById('part4ProgressBar');
            if (part4ProgressBar) part4ProgressBar.style.width = `${p4Pct}%`;

            // 2. Render khối "Tiếp tục học" & "Gợi ý hôm nay"
            const priorityContainer = document.getElementById('listeningPriorityDashboard');
            if (priorityContainer) {
                priorityContainer.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-in fade-in duration-200">
                        <!-- Khối 1: Tiếp tục học -->
                        <div class="glass-panel rounded-2xl p-4 border border-teal-200/80 dark:border-slate-700 bg-gradient-to-br from-teal-50/60 to-white dark:from-slate-800 dark:to-slate-850 flex flex-col justify-between gap-3 shadow-xs">
                            <div class="space-y-1.5">
                                <div class="flex items-center justify-between">
                                    <span class="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10.5px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                                        <i class="fa-solid fa-clock-rotate-left"></i> TIẾP TỤC HỌC
                                    </span>
                                    <span class="text-[11px] text-slate-400">
                                        ${last ? new Date(last.timestamp).toLocaleDateString('vi-VN') : 'Mới bắt đầu'}
                                    </span>
                                </div>
                                <h3 class="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                                    ${last ? `Đang học dở: Part ${last.part} (${last.topic || 'Luyện nghe'})` : 'Bắt đầu với bài thi mẫu ETS 2026'}
                                </h3>
                                <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                                    ${last ? 'Hệ thống đã lưu lại tiến độ bài trước. Nhấn để tiếp tục ngay mà không mất thời gian tìm kiếm.' : 'Chọn một Part hoặc làm bài kiểm tra nhanh để hệ thống đo lường trình độ hiện tại.'}
                                </p>
                            </div>
                            <div class="pt-1 flex items-center justify-between">
                                <button onclick="ListeningDashboard.continueLastPracticed()" class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                    <i class="fa-solid fa-play text-[10px]"></i>
                                    <span>${last ? 'Tiếp tục luyện tập' : 'Luyện ngay Part 1'}</span>
                                </button>
                                <span class="text-[11.5px] font-bold text-teal-700 dark:text-teal-400">
                                    ${stats.totalAnswered} câu đã làm
                                </span>
                            </div>
                        </div>

                        <!-- Khối 2: Gợi ý hôm nay theo điểm yếu -->
                        <div class="glass-panel rounded-2xl p-4 border border-indigo-200/80 dark:border-slate-700 bg-gradient-to-br from-indigo-50/60 to-white dark:from-slate-800 dark:to-slate-850 flex flex-col justify-between gap-3 shadow-xs">
                            <div class="space-y-1.5">
                                <div class="flex items-center justify-between">
                                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-[10.5px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                                        <i class="fa-solid fa-wand-magic-sparkles"></i> ${dailyRec.badge}
                                    </span>
                                    <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">AI Recommender</span>
                                </div>
                                <h3 class="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                                    ${dailyRec.title}
                                </h3>
                                <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                                    ${dailyRec.reason}
                                </p>
                            </div>
                            <div class="pt-1 flex items-center justify-between">
                                <button onclick="openFullPartPracticeModal(${dailyRec.part}, 'practice')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                    <i class="fa-solid fa-bullseye text-[10px]"></i>
                                    <span>${dailyRec.actionText}</span>
                                </button>
                                <button onclick="ListeningDashboard.startAdaptivePractice()" class="text-[11.5px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                    <i class="fa-solid fa-arrows-split-up-and-left"></i> Adaptive AI
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            // 3. Render Khối Đấu trường Thi Thử 100 câu & Mini Test
            const mockTestContainer = document.getElementById('listeningMockTestArena');
            if (mockTestContainer) {
                mockTestContainer.innerHTML = `
                    <div class="glass-panel rounded-[24px] p-4 sm:p-5 border border-purple-200/80 dark:border-slate-700 bg-gradient-to-r from-purple-50/80 via-indigo-50/60 to-white dark:from-slate-800 dark:to-slate-900 space-y-4 shadow-sm">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <div class="flex items-center gap-3">
                                <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md shrink-0">
                                    <i class="fa-solid fa-trophy text-amber-300"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <h3 class="text-[15px] font-black text-slate-900 dark:text-white">Đấu Trường Thi Thử Listening ETS 2026</h3>
                                        <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase">Thi thật</span>
                                    </div>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">Trải nghiệm phòng thi thực tế: 1 lần nghe duy nhất, tự nộp khi hết giờ, thang điểm ETS 5 - 495</p>
                                </div>
                            </div>

                            ${stats.scaledScoreObj ? `
                                <div class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-right shadow-xs">
                                    <div class="text-[10px] font-bold uppercase text-slate-400">Ước tính hiện tại</div>
                                    <div class="text-base font-black text-purple-700 dark:text-purple-300">
                                        ${stats.scaledScoreObj.scaledScore} <span class="text-xs font-normal text-slate-500">/ 495 (${stats.scaledScoreObj.cefr})</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <!-- Full Test 100 câu -->
                            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2 flex flex-col justify-between hover:border-purple-300 transition">
                                <div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-black text-slate-900 dark:text-white">Full Test 100 Câu</span>
                                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700">45 phút</span>
                                    </div>
                                    <p class="text-[11.5px] text-slate-500 mt-1">Chuẩn đề ETS: P1 (6) + P2 (25) + P3 (39) + P4 (30).</p>
                                </div>
                                <button onclick="ListeningDashboard.startFullMockTest()" class="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer">
                                    <i class="fa-solid fa-play text-[10px]"></i>
                                    <span>Vào Thi Full Test</span>
                                </button>
                            </div>

                            <!-- Mini Test 25 câu -->
                            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2 flex flex-col justify-between hover:border-indigo-300 transition">
                                <div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-black text-slate-900 dark:text-white">Mini Test 25 Câu</span>
                                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700">12 phút</span>
                                    </div>
                                    <p class="text-[11.5px] text-slate-500 mt-1">Dành cho người ít thời gian: Trích xuất chuẩn tỉ lệ 4 Part.</p>
                                </div>
                                <button onclick="ListeningDashboard.startMiniMockTest()" class="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer">
                                    <i class="fa-solid fa-bolt text-[10px]"></i>
                                    <span>Làm Mini Test</span>
                                </button>
                            </div>

                            <!-- Adaptive Test 20 câu -->
                            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2 flex flex-col justify-between hover:border-teal-300 transition">
                                <div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-black text-slate-900 dark:text-white">Luyện Adaptive AI</span>
                                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-700">20 câu</span>
                                    </div>
                                    <p class="text-[11.5px] text-slate-500 mt-1">Tự động tập hợp các câu bẫy bạn hay sai nhất để luyện triệt để.</p>
                                </div>
                                <button onclick="ListeningDashboard.startAdaptivePractice()" class="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer">
                                    <i class="fa-solid fa-arrows-split-up-and-left text-[10px]"></i>
                                    <span>Luyện Trọng Tâm Bẫy</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            // 4. Render Bảng Phân Tích Bẫy & Heatmap
            const heatmapContainer = document.getElementById('listeningHeatmapContainer');
            if (heatmapContainer && stats.trapHeatmap.length > 0) {
                heatmapContainer.classList.remove('hidden');
                heatmapContainer.innerHTML = `
                    <div class="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-fire-flame-curved text-rose-500"></i>
                                <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    Bản Đồ Nhiệt Điểm Yếu & Loại Bẫy (Heatmap)
                                </h4>
                            </div>
                            <span class="text-[11px] text-slate-400">Sắp xếp theo tỷ lệ sai cao nhất</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            ${stats.trapHeatmap.slice(0, 6).map(t => {
                                let badgeColor = 'bg-slate-100 text-slate-700';
                                if (t.errorRate >= 50) badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
                                else if (t.errorRate >= 30) badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
                                else badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';

                                return `
                                    <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                                        <div class="space-y-0.5 truncate pr-2">
                                            <div class="font-bold text-slate-800 dark:text-slate-200 truncate capitalize">${t.name}</div>
                                            <div class="text-[10px] text-slate-400">${t.wrong}/${t.total} câu sai</div>
                                        </div>
                                        <span class="px-2 py-0.5 rounded-md font-black text-[11px] ${badgeColor} shrink-0">
                                            ${t.errorRate}% sai
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        },

        // Bộ lọc và tìm kiếm chủ đề
        filterTopics() {
            const searchInput = document.getElementById('listenTopicSearchInput');
            const searchVal = (searchInput ? searchInput.value : '').trim().toLowerCase();
            const activeLevel = window._currentListenLevelFilter || 'all';
            const activeStatus = window._currentListenStatusFilter || 'all';

            const history = this.getHistory();
            const answeredIds = new Set(history.map(h => h.id));
            const wrongIds = new Set(history.filter(h => !h.isCorrect).map(h => h.id));

            const cards = document.querySelectorAll('.listening-topic-card');
            let matchCount = 0;

            cards.forEach(card => {
                const title = (card.getAttribute('data-topic-title') || card.textContent || '').toLowerCase();
                const level = card.getAttribute('data-level') || 'all';
                const topicId = card.getAttribute('data-id') || '';

                let matchText = !searchVal || title.includes(searchVal);
                let matchLevel = (activeLevel === 'all') || (level === activeLevel);
                
                let matchStatus = true;
                if (activeStatus === 'done') {
                    matchStatus = answeredIds.has(topicId);
                } else if (activeStatus === 'wrong') {
                    matchStatus = wrongIds.has(topicId);
                } else if (activeStatus === 'not_done') {
                    matchStatus = !answeredIds.has(topicId);
                }

                if (matchText && matchLevel && matchStatus) {
                    card.classList.remove('hidden');
                    matchCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            // Hiển thị trạng thái empty nếu không có kết quả
            const emptyEl = document.getElementById('listeningTopicsEmptyState');
            if (emptyEl) {
                if (matchCount === 0) {
                    emptyEl.classList.remove('hidden');
                } else {
                    emptyEl.classList.add('hidden');
                }
            }
        },

        // Thiết lập sự kiện và đồng bộ
        init() {
            this.renderStats();

            // Lắng nghe sự kiện click mở rộng card chủ đề
            if (typeof document !== 'undefined' && document.querySelectorAll) {
                document.querySelectorAll('.listening-part-toggle-btn').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        const targetId = this.getAttribute('data-target');
                        const targetEl = document.getElementById(targetId);
                        const icon = this.querySelector('.chevron-icon');
                        if (targetEl) {
                            targetEl.classList.toggle('hidden');
                            if (icon) icon.classList.toggle('rotate-180');
                        }
                    });
                });
            }

            // Tối ưu nút chat AI Tutor Đăng TOEIC: Thu nhỏ thành FAB tròn trên mobile khi cuộn
            if (typeof document !== 'undefined' && document.querySelector) {
                const aiButton = document.querySelector('button[title*="Gia Sư AI"]');
                if (aiButton && typeof window !== 'undefined' && window.addEventListener) {
                    window.addEventListener('scroll', () => {
                        if (window.innerWidth < 768 && window.scrollY > 150) {
                            aiButton.classList.add('ai-tutor-fab-collapsed');
                        } else {
                            aiButton.classList.remove('ai-tutor-fab-collapsed');
                        }
                    }, { passive: true });
                }
            }
        }
    };

    window.ListeningDashboard = ListeningDashboard;

    // Tự động khởi chạy khi trang tải xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ListeningDashboard.init());
    } else {
        setTimeout(() => ListeningDashboard.init(), 100);
    }

})(typeof window !== 'undefined' ? window : global);
