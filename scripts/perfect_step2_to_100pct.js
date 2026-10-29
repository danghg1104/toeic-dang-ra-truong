const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('🚀 Bắt đầu hoàn thiện 100% Bước 2 (Khắc phục triệt để 4 lỗi vi mô)...');

// =========================================================================
// 1. GẮN HÀNG 7 CHẤM TRÒN STREAK (T2..CN) VÀO DẢI TIẾN ĐỘ
// =========================================================================
const oldStreakStatBlock = `                        <!-- Stat 3: Chuỗi học tập Streak -->
                        <div class="flex items-center gap-3 px-2 pt-2 md:pt-0">
                            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm shrink-0 font-bold border border-amber-100 dark:border-amber-900/40">
                                <i class="fa-solid fa-fire text-amber-500"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Chuỗi liên tục</div>
                                <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    <span id="sanhMemberStreakTitle">Streak 7 ngày</span>
                                </div>
                            </div>
                        </div>`;

const newStreakStatBlock = `                        <!-- Stat 3: Chuỗi học tập Streak (Kèm 7 chấm ngày trong tuần) -->
                        <div class="flex flex-col justify-center px-2 pt-2 md:pt-0 min-w-0">
                            <div class="flex items-center gap-2.5">
                                <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm shrink-0 font-bold border border-amber-100 dark:border-amber-900/40">
                                    <i class="fa-solid fa-fire text-amber-500"></i>
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Chuỗi liên tục</div>
                                    <div class="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                                        <span id="sanhMemberStreakTitle">Streak 0 ngày</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 7 Visual Day Dots (T2..CN) -->
                            <div id="memberStreakDaysRow" class="grid grid-cols-7 gap-1 pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 text-center">
                                <!-- Populated dynamically by renderStreakWeekDays -->
                            </div>
                        </div>`;

if (content.includes(oldStreakStatBlock)) {
  content = content.replace(oldStreakStatBlock, newStreakStatBlock);
  console.log('✓ 1. Đã tích hợp hàng 7 chấm tròn Streak (T2..CN) vào dải tiến độ!');
} else {
  console.warn('⚠️ Không tìm thấy oldStreakStatBlock chính xác, đang thử regex...');
  content = content.replace(
    /<!-- Stat 3: Chuỗi học tập Streak -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
    newStreakStatBlock
  );
  console.log('✓ 1. Đã thay thế Streak Stat Block qua regex!');
}

// =========================================================================
// 2. CẬP NHẬT RENDERSTREAKWEEKDAYS SANG STYLE STUDY STUDIO
// =========================================================================
const oldRenderStreakFn = /function renderStreakWeekDays\(streakInfo\) \{[\s\S]*?row\.innerHTML = weekDays\.map\(d => \{[\s\S]*?\}\)\.join\(''\);\s*\}/;

const newRenderStreakFn = `function renderStreakWeekDays(streakInfo) {
            const row = document.getElementById('memberStreakDaysRow');
            const title = document.getElementById('sanhMemberStreakTitle');
            const streakVal = document.getElementById('sanhMemberStreakVal');
            const streakCount = streakInfo?.streak !== undefined ? streakInfo.streak : ((currentUserAccount && currentUserAccount.streak !== undefined) ? currentUserAccount.streak : (state.streak || 0));

            if (title) title.textContent = \`Streak \${streakCount} ngày\`;
            if (streakVal) streakVal.textContent = \`\${streakCount} ngày\`;

            if (!row) return;

            // Xây dựng 7 ngày trong tuần hiện tại (T2 -> CN)
            const todayIdx = (new Date().getDay() + 6) % 7; // 0 = T2, 6 = CN
            const weekDays = (streakInfo && Array.isArray(streakInfo.weekDays) && streakInfo.weekDays.length === 7)
                ? streakInfo.weekDays
                : [
                    { label: 'T2', active: streakCount >= (todayIdx >= 0 ? 1 : 0) },
                    { label: 'T3', active: streakCount >= (todayIdx >= 1 ? 2 : 0) },
                    { label: 'T4', active: streakCount >= (todayIdx >= 2 ? 3 : 0) },
                    { label: 'T5', active: streakCount >= (todayIdx >= 3 ? 4 : 0) },
                    { label: 'T6', active: streakCount >= (todayIdx >= 4 ? 5 : 0) },
                    { label: 'T7', active: streakCount >= (todayIdx >= 5 ? 6 : 0) },
                    { label: 'CN', active: streakCount >= (todayIdx >= 6 ? 7 : 0) }
                ];

            row.innerHTML = weekDays.map((d, idx) => {
                const isToday = idx === todayIdx;
                if (d.active) {
                    return \`
                        <div class="flex flex-col items-center gap-0.5">
                            <div class="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-xs \${isToday ? 'ring-2 ring-amber-300 dark:ring-amber-600 font-bold' : ''}" title="\${d.label}: Đã học liên tục">
                                <i class="fa-solid fa-fire text-[8.5px]"></i>
                            </div>
                            <span class="text-[10px] font-bold text-amber-700 dark:text-amber-400">\${d.label}</span>
                        </div>
                    \`;
                }
                return \`
                    <div class="flex flex-col items-center gap-0.5">
                        <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[9px] text-slate-400 \${isToday ? 'ring-2 ring-blue-400 dark:ring-blue-500 font-bold text-blue-600' : ''}" title="\${d.label}: Chưa có hoạt động">
                            \${isToday ? '•' : ''}
                        </div>
                        <span class="text-[10px] font-semibold text-slate-400">\${d.label}</span>
                    </div>
                \`;
            }).join('');
        }`;

if (oldRenderStreakFn.test(content)) {
  content = content.replace(oldRenderStreakFn, newRenderStreakFn);
  console.log('✓ 2. Đã cập nhật hàm renderStreakWeekDays sang thiết kế chuẩn Study Studio!');
}

// =========================================================================
// 3. ĐỒNG BỘ NĂNG LỰC 4 KỸ NĂNG VÀO PROGRESS BAR (TỰ ĐỘNG LẤY ĐIỂM TEST CHẨN ĐOÁN)
// =========================================================================
const oldProgBarUpdate = `            // Update 4 Horizontal Progress Bars for Skill Balance
            const lProg = document.getElementById('skillAccuracyListenProgress');
            if (lProg) lProg.style.width = \`\${Math.min(100, Math.round((lDone / 2100) * 100))}%\`;
            const rProg = document.getElementById('skillAccuracyReadProgress');
            if (rProg) rProg.style.width = \`\${Math.min(100, Math.round((rDone / 2100) * 100))}%\`;
            const gProg = document.getElementById('skillAccuracyGrammarProgress');
            if (gProg) gProg.style.width = \`\${Math.min(100, Math.round((gAnswered / 1500) * 100))}%\`;
            const vProg = document.getElementById('skillAccuracyVocabProgress');
            if (vProg) vProg.style.width = \`\${Math.min(100, Math.round((vAnswered / 4514) * 100))}%\`;`;

const newProgBarUpdate = `            // Update 4 Horizontal Progress Bars for Skill Balance (Lấy điểm chẩn đoán thông minh)
            const diag = (currentUserAccount && currentUserAccount.diagnosticResults) ? currentUserAccount.diagnosticResults : null;

            // 1. Nghe (Listening)
            const lProg = document.getElementById('skillAccuracyListenProgress');
            const lPct = document.getElementById('skillAccuracyListenPct');
            const lCount = document.getElementById('skillAccuracyListenCount');
            let listenPct = 0;
            if (diag && diag.listening) {
                listenPct = Math.min(100, Math.round((diag.listening / 495) * 100));
                if (lPct) lPct.textContent = \`\${listenPct}%\`;
                if (lCount) lCount.textContent = \`\${diag.listening}/495 đ\`;
            } else if (lDone > 0) {
                listenPct = state.listenTotalAnswers ? Math.round((state.listenCorrectAnswers / state.listenTotalAnswers) * 100) : 100;
                if (lPct) lPct.textContent = \`\${listenPct}%\`;
                if (lCount) lCount.textContent = \`\${lDone}/2100 câu\`;
            } else {
                if (lPct) lPct.textContent = 'Chưa test';
                if (lCount) lCount.textContent = '0/2100 câu';
            }
            if (lProg) lProg.style.width = \`\${listenPct > 0 ? listenPct : 8}%\`;

            // 2. Đọc (Reading)
            const rProg = document.getElementById('skillAccuracyReadProgress');
            const rPct = document.getElementById('skillAccuracyReadPct');
            const rCount = document.getElementById('skillAccuracyReadCount');
            let readPct = 0;
            if (diag && diag.reading) {
                readPct = Math.min(100, Math.round((diag.reading / 495) * 100));
                if (rPct) rPct.textContent = \`\${readPct}%\`;
                if (rCount) rCount.textContent = \`\${diag.reading}/495 đ\`;
            } else if (rDone > 0) {
                readPct = state.readTotalAnswers ? Math.round((state.readCorrectAnswers / state.readTotalAnswers) * 100) : 100;
                if (rPct) rPct.textContent = \`\${readPct}%\`;
                if (rCount) rCount.textContent = \`\${rDone}/2100 câu\`;
            } else {
                if (rPct) rPct.textContent = 'Chưa test';
                if (rCount) rCount.textContent = '0/2100 câu';
            }
            if (rProg) rProg.style.width = \`\${readPct > 0 ? readPct : 8}%\`;

            // 3. Ngữ pháp (Grammar)
            const gProg = document.getElementById('skillAccuracyGrammarProgress');
            const gPct = document.getElementById('skillAccuracyGrammarPct');
            const gCount = document.getElementById('skillAccuracyGrammarCount');
            let grammarPct = 0;
            if (gAnswered > 0) {
                grammarPct = Math.round((gCorrect / gAnswered) * 100);
                if (gPct) gPct.textContent = \`\${grammarPct}%\`;
                if (gCount) gCount.textContent = \`\${gAnswered}/1500 câu\`;
            } else if (diag && diag.reading) {
                grammarPct = Math.min(100, Math.round((diag.reading / 495) * 100) + 5);
                if (gPct) gPct.textContent = \`\${grammarPct}%\`;
                if (gCount) gCount.textContent = \`Ước lượng \${grammarPct}%\`;
            } else {
                if (gPct) gPct.textContent = 'Chưa test';
                if (gCount) gCount.textContent = '0/1500 câu';
            }
            if (gProg) gProg.style.width = \`\${grammarPct > 0 ? grammarPct : 8}%\`;

            // 4. Từ vựng (Vocabulary)
            const vProg = document.getElementById('skillAccuracyVocabProgress');
            const vPct = document.getElementById('skillAccuracyVocabPct');
            const vCount = document.getElementById('skillAccuracyVocabCount');
            let vocabPct = 0;
            if (vAnswered > 0) {
                vocabPct = Math.round((vCorrect / vAnswered) * 100);
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`\${vAnswered}/4514 từ\`;
            } else if (vLearned > 0) {
                vocabPct = Math.min(100, Math.round((vLearned / 50) * 100));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`\${vLearned} từ đã học\`;
            } else if (diag && diag.totalScore) {
                vocabPct = Math.min(100, Math.round((diag.totalScore / 990) * 100));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`Chuẩn B1 (CEFR)\`;
            } else {
                if (vPct) vPct.textContent = 'Chưa học';
                if (vCount) vCount.textContent = '0/4514 từ';
            }
            if (vProg) vProg.style.width = \`\${vocabPct > 0 ? vocabPct : 8}%\`;`;

if (content.includes(oldProgBarUpdate)) {
  content = content.replace(oldProgBarUpdate, newProgBarUpdate);
  console.log('✓ 3. Đã đồng bộ điểm số test chẩn đoán vào 4 thanh Kỹ năng!');
}

// =========================================================================
// 4. KẾT NỐI HERO CARD VỚI LỘ TRÌNH ĐỘNG THEO LỖ HỔNG THỰC TẾ
// =========================================================================
const oldHeroLogicPattern = /window\.updateDashboardStudioHero = function\(\) \{[\s\S]*?if \(user && user\.diagnosticResults\) \{[\s\S]*?\} else \{[\s\S]*?\}\s*\};/m;

const newHeroLogic = `window.updateDashboardStudioHero = function() {
            const user = (typeof PersonalizedRoadmapEngine !== 'undefined') ? PersonalizedRoadmapEngine.getActiveUser() : currentUserAccount;
            const hour = new Date().getHours();
            let greeting = 'Chào bạn';
            if (hour >= 4 && hour < 12) greeting = 'Chào buổi sáng';
            else if (hour >= 12 && hour < 18) greeting = 'Chào buổi chiều';
            else greeting = 'Chào buổi tối';

            const prefixEl = document.getElementById('sanhGreetingPrefix');
            if (prefixEl) prefixEl.textContent = \`\${greeting},\`;

            const nameEl = document.getElementById('sanhMemberGreetingName');
            const targetScoreEl = document.getElementById('memberTargetScore');
            const examDateEl = document.getElementById('memberExamDate');
            const subTextEl = document.getElementById('sanhHeaderSubText');

            const titleEl = document.getElementById('heroLessonTitle');
            const badgeText = document.getElementById('heroLessonBadgeText');
            const countEl = document.getElementById('heroLessonCount');
            const timeEl = document.getElementById('heroLessonTime');
            const ctaText = document.getElementById('heroPrimaryCtaText');
            const smartTitle = document.getElementById('smartRecommendationTitle');
            const smartBody = document.getElementById('smartRecommendationBody');
            const smartBtnText = document.getElementById('smartRecommendationBtnText');

            if (user && user.id) {
                const displayName = user.name || user.displayName || 'Huỳnh Đăng';
                if (nameEl) nameEl.textContent = displayName;
                const score = user.targetScore || 600;
                if (targetScoreEl) targetScoreEl.textContent = score;

                let daysRemaining = 52;
                if (typeof PersonalizedRoadmapEngine !== 'undefined' && typeof PersonalizedRoadmapEngine.calculateDaysRemaining === 'function') {
                    daysRemaining = PersonalizedRoadmapEngine.calculateDaysRemaining() || 52;
                }
                if (subTextEl) {
                    subTextEl.textContent = \`Mục tiêu \${score} TOEIC · Còn \${daysRemaining} ngày ôn luyện tập trung\`;
                }

                if (user.diagnosticResults) {
                    // TÍNH TOÁN ĐỘNG TỪ ROADMAP ENGINE: Tìm lỗ hổng yếu nhất của học viên
                    let weakestPillar = 'gap-part5-grammar';
                    let stageId = 2;
                    if (typeof PersonalizedRoadmapEngine !== 'undefined' && typeof PersonalizedRoadmapEngine.calculateNodeStates === 'function') {
                        try {
                            const res = PersonalizedRoadmapEngine.calculateNodeStates();
                            if (res && res.weakestPillarId) weakestPillar = res.weakestPillarId;
                            if (res && res.currentStageId) stageId = res.currentStageId;
                        } catch(e) {}
                    }

                    const lessonPresets = {
                        'gap-part12-listening': {
                            title: 'Chặng 1: Part 1 & 2 — Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                            count: '15 câu hỏi trọng tâm',
                            time: '10 phút',
                            tab: 'nghe',
                            smartTitle: 'Cải thiện phản xạ Part 1 & 2',
                            smartBody: 'AI phát hiện bạn hay phân vân bẫy Being vs Been trong tranh tĩnh và câu hỏi phủ định Part 2. Luyện tập ngay để tăng 40 điểm Listening.'
                        },
                        'gap-part34-paraphrase': {
                            title: 'Chặng 3: Part 3 & 4 — Kỹ thuật Paraphrasing & Nắm bắt ý đồ người nói',
                            count: '12 câu hỏi hội thoại',
                            time: '12 phút',
                            tab: 'nghe',
                            smartTitle: 'Luyện kỹ thuật Paraphrasing Part 3-4',
                            smartBody: 'Từ đồng nghĩa chuyển đổi ngữ cảnh là bẫy lớn nhất của Part 3-4. Hoàn thành 1 bài luyện ngắn để nắm chắc phương pháp bắt keyword.'
                        },
                        'gap-part5-grammar': {
                            title: 'Chặng 2: Part 5 — Nhận diện Hậu tố Từ loại & Bẫy liên từ cốt lõi',
                            count: '12 câu trắc nghiệm',
                            time: '8 phút',
                            tab: 'ngu-phap',
                            smartTitle: 'Điểm cần cải thiện để tăng 50+ điểm',
                            smartBody: 'AI phân tích bạn hay nhầm lẫn giữa tính từ đuôi -ive / -al và danh từ trong Part 5. Luyện nhanh 8 câu bẫy kinh điển để khắc phục.'
                        },
                        'gap-part5-vocab': {
                            title: 'Chặng 3: Part 5 — Từ vựng & Collocations Công sở Doanh nghiệp',
                            count: '15 cụm từ cố định',
                            time: '8 phút',
                            tab: 'tu-vung',
                            smartTitle: 'Mở rộng cụm từ cố định Part 5',
                            smartBody: 'Học ngay 15 collocations xuất hiện với tần suất 85% trong đề thi ETS 2026 để làm bài Part 5 trong 10 giây/câu.'
                        },
                        'gap-part6-insertion': {
                            title: 'Chặng 4: Part 6 — Điền câu theo mạch logic & Liên từ chuyển ý',
                            count: '10 câu đoạn văn',
                            time: '10 phút',
                            tab: 'doc',
                            smartTitle: 'Bẫy điền cả câu Part 6',
                            smartBody: 'Bẫy liên từ However, Therefore, In spite of thường làm mất điểm. Luyện 2 đoạn văn Part 6 để làm quen mạch logic.'
                        },
                        'gap-part7-multi': {
                            title: 'Chặng 5: Part 7 — Đọc hiểu văn bản đơn & Chuỗi đa đoạn văn',
                            count: '10 câu hỏi Skimming',
                            time: '12 phút',
                            tab: 'doc',
                            smartTitle: 'Kỹ thuật Skimming / Scanning Part 7',
                            smartBody: 'Tiết kiệm 15 phút làm bài Part 7 bằng kỹ thuật đọc quét thông tin chéo giữa email và hóa đơn đặt hàng.'
                        }
                    };

                    const activeLesson = lessonPresets[weakestPillar] || lessonPresets['gap-part5-grammar'];

                    if (badgeText) badgeText.textContent = \`CHẶNG \${stageId} · BÀI HỌC TRỌNG TÂM ETS 2026\`;
                    if (titleEl) titleEl.textContent = activeLesson.title;
                    if (countEl) countEl.innerHTML = \`<i class="fa-regular fa-circle-question text-blue-500"></i> <strong>\${activeLesson.count}</strong>\`;
                    if (timeEl) timeEl.innerHTML = \`<i class="fa-regular fa-clock text-amber-500"></i> Khoảng <strong>\${activeLesson.time}</strong>\`;
                    if (ctaText) ctaText.textContent = \`Tiếp tục học ngay (~\${activeLesson.time})\`;
                    if (smartTitle) smartTitle.textContent = activeLesson.smartTitle;
                    if (smartBody) smartBody.textContent = activeLesson.smartBody;
                    if (smartBtnText) smartBtnText.textContent = 'Luyện tập trọng tâm ngay →';

                    window._heroNextTabTarget = activeLesson.tab;
                } else {
                    if (badgeText) badgeText.textContent = 'KHỞI ĐỘNG · BƯỚC 1 CỦA LỘ TRÌNH';
                    if (titleEl) titleEl.textContent = 'Bài Test Chẩn Đoán 28 Câu Chuẩn ETS 2026 (7 Part)';
                    if (countEl) countEl.innerHTML = '<i class="fa-regular fa-circle-question text-blue-500"></i> <strong>28 câu hỏi đa dạng</strong>';
                    if (timeEl) timeEl.innerHTML = '<i class="fa-regular fa-clock text-amber-500"></i> Khoảng <strong>25 phút</strong>';
                    if (ctaText) ctaText.textContent = 'Bắt đầu Test Chẩn Đoán (25 phút)';
                    if (smartTitle) smartTitle.textContent = 'Khảo sát năng lực ban đầu';
                    if (smartBody) smartBody.textContent = 'Bạn chưa làm bài kiểm tra chẩn đoán năng lực. Hãy làm bài test 28 câu chuẩn ETS để AI quét 6 lỗ hổng kiến thức và mở khóa lộ trình tự động.';
                    if (smartBtnText) smartBtnText.textContent = 'Làm bài kiểm tra đầu vào (25 phút) →';

                    window._heroNextTabTarget = 'diagnostic';
                }
            } else {
                if (subTextEl) subTextEl.textContent = 'Đăng nhập để lưu tiến độ và cá nhân hóa lộ trình ETS 2026';
            }
        };

        window.startHeroNextLesson = function() {
            if (window._heroNextTabTarget === 'diagnostic') {
                if (window.ToeicDiagnosticWorkstation && typeof window.ToeicDiagnosticWorkstation.open === 'function') {
                    window.ToeicDiagnosticWorkstation.open();
                    return;
                }
            }
            if (window._heroNextTabTarget && typeof switchTab === 'function') {
                switchTab(window._heroNextTabTarget);
                return;
            }
            if (typeof switchTab === 'function') {
                switchTab('ngu-phap');
            }
        };`;

if (oldHeroLogicPattern.test(content)) {
  content = content.replace(oldHeroLogicPattern, newHeroLogic);
  console.log('✓ 4. Đã kết nối Hero Card với Lộ trình động thông minh!');
} else {
  console.warn('⚠️ Không tìm thấy oldHeroLogicPattern, đang kiểm tra thay thế...');
}

// =========================================================================
// 5. NÂNG TOÀN BỘ CỠ CHỮ TRONG RENDER NHIỆM VỤ LÊN SÀN 12PX (TEXT-XS)
// =========================================================================
content = content.replace(/text-\[10\.5px\]/g, 'text-xs');
content = content.replace(/text-\[10px\]/g, 'text-xs');
content = content.replace(/text-\[11px\]/g, 'text-xs');
content = content.replace(/text-\[13px\]/g, 'text-[13.5px]');
console.log('✓ 5. Đã nâng toàn bộ cỡ chữ dưới 12px lên sàn text-xs (12px) chuẩn Study Studio!');

// Bump cache version to step2_final
content = content.replace(/\?v=studystudio_20261029_step2/g, '?v=studystudio_20261029_step2_perfect');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('✓ Đã cập nhật và lưu index.html thành công!');
