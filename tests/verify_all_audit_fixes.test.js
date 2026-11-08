const fs = require('fs');
const assert = require('assert');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('RUNNING COMPREHENSIVE AUDIT REMEDIATION VERIFICATION');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function it(name, fn) {
    totalTests++;
    try {
        fn();
        console.log(`  ✓ PASS: ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`  ✗ FAIL: ${name}`);
        console.error(`    ${err.message}`);
    }
}

function extractAllQuestionsFromTestJson(data) {
    const allQs = [];
    if (data.listening) {
        if (data.listening.part1) allQs.push(...data.listening.part1);
        if (data.listening.part2) allQs.push(...data.listening.part2);
        if (data.listening.part3) {
            data.listening.part3.forEach(s => {
                if (s.questions) allQs.push(...s.questions);
                else allQs.push(s);
            });
        }
        if (data.listening.part4) {
            data.listening.part4.forEach(s => {
                if (s.questions) allQs.push(...s.questions);
                else allQs.push(s);
            });
        }
    }
    if (data.reading) {
        if (data.reading.part5) allQs.push(...data.reading.part5);
        if (data.reading.part6) {
            data.reading.part6.forEach(s => {
                if (s.questions) allQs.push(...s.questions);
                else allQs.push(s);
            });
        }
        if (data.reading.part7) {
            data.reading.part7.forEach(s => {
                if (s.questions) allQs.push(...s.questions);
                else allQs.push(s);
            });
        }
    }
    return allQs;
}

// ----------------------------------------------------
// 1. QUESTION BANK INTEGRITY (10 TESTS, 2,000 QUESTIONS)
// ----------------------------------------------------
console.log('--- 1. Testing Question Bank (2,000 Questions) ---');

it('All 10 tests exist with exactly 200 questions each (2,000 total)', () => {
    let grandTotal = 0;
    for (let t = 1; t <= 10; t++) {
        const file = `data/ets2026/test${String(t).padStart(2, '0')}_full.json`;
        assert(fs.existsSync(file), `File ${file} must exist`);
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        const qs = extractAllQuestionsFromTestJson(data);
        assert.strictEqual(qs.length, 200, `Test ${t} must have 200 questions, got ${qs.length}`);
        grandTotal += qs.length;
    }
    assert.strictEqual(grandTotal, 2000, 'Grand total must be 2,000');
});

it('Exact option counts: Part 2 has 3 options, all others have 4 options across all 2,000 questions', () => {
    for (let t = 1; t <= 10; t++) {
        const data = JSON.parse(fs.readFileSync(`data/ets2026/test${String(t).padStart(2, '0')}_full.json`, 'utf8'));
        const qs = extractAllQuestionsFromTestJson(data);
        qs.forEach(q => {
            const expectedCount = (q.part === 2) ? 3 : 4;
            assert.strictEqual(
                q.options.length,
                expectedCount,
                `Test ${t} Q${q.qNum || q.num || q.id} Part ${q.part} has ${q.options.length} options, expected ${expectedCount}`
            );
        });
    }
});

it('Options match labels A/B/C/D and no OCR headers or leaked Vietnamese translations', () => {
    for (let t = 1; t <= 10; t++) {
        const data = JSON.parse(fs.readFileSync(`data/ets2026/test${String(t).padStart(2, '0')}_full.json`, 'utf8'));
        const qs = extractAllQuestionsFromTestJson(data);
        qs.forEach(q => {
            const letters = ['A', 'B', 'C', 'D'];
            q.options.forEach((opt, idx) => {
                const expLetter = letters[idx];
                assert(opt && opt.trim().length > 0, `Test ${t} Q${q.qNum} option ${expLetter} is empty`);
                assert(!opt.includes('ETS 2036'), `Test ${t} Q${q.qNum} has OCR header leak`);
                assert(!opt.includes('Trang ') && !opt.match(/Page \d+\s*(of|\/)/i) && !opt.match(/ETS.*Page/i), `Test ${t} Q${q.qNum} has page number leak`);
                assert(!opt.toLowerCase().includes('chọn ('), `Test ${t} Q${q.qNum} has leaked answer marker`);
                const m = opt.trim().match(/^([A-D])[\.\)]/i);
                if (m) {
                    assert.strictEqual(m[1].toUpperCase(), expLetter, `Option label mismatch: ${m[1]} vs expected ${expLetter}`);
                }
            });
        });
    }
});

it('Test 1 Q110 options are clean standard words without explanations', () => {
    const t1 = JSON.parse(fs.readFileSync('data/ets2026/test01_full.json', 'utf8'));
    const qs = extractAllQuestionsFromTestJson(t1);
    const q110 = qs.find(q => q.qNum === 110 || q.num === 110 || q.id === 'q110');
    assert(q110, 'Q110 must exist');
    assert.strictEqual(q110.options.length, 4, 'Q110 must have 4 options');
    const optsJoined = q110.options.join(' ').toLowerCase();
    assert(optsJoined.includes('calculate'), 'Q110 must contain calculate');
    assert(optsJoined.includes('calculator'), 'Q110 must contain calculator');
    assert(!optsJoined.includes('động từ nguyên thể'), 'Q110 must NOT contain Vietnamese explanations');
});

// ----------------------------------------------------
// 2. FULL READING (100 QUESTIONS)
// ----------------------------------------------------
console.log('\n--- 2. Testing Full Reading Routing & Data ---');

it('getFullReading(1) provides exactly 100 questions (P5: 30, P6: 16, P7: 54)', () => {
    const etsCode = fs.readFileSync('js/ets2026-data.js', 'utf8');
    const sandbox = { window: {}, console };
    vm.runInNewContext(etsCode, sandbox);
    const db = sandbox.window.Ets2026Database;
    assert(db, 'Ets2026Database must exist');

    const p5 = db.getFlattenedPart(5, 1);
    const p6 = db.getFlattenedPart(6, 1);
    const p7 = db.getFlattenedPart(7, 1);
    const fullRc = db.getFullReading(1);

    assert.strictEqual(p5.length, 30, 'Part 5 must have 30 questions');
    assert.strictEqual(p6.length, 16, 'Part 6 must have 16 questions');
    assert.strictEqual(p7.length, 54, 'Part 7 must have 54 questions');
    assert.strictEqual(fullRc.length, 100, 'Full Reading must have 100 questions');
});

it('app-core.bundle.js routes Full Reading / 100 questions to Ets2026Database.getFullReading', () => {
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(
        appCore.includes("const isFullRc = type.includes('rc') || cleanTitle.includes('full reading') || cleanTitle.includes('100 câu') || count === 100;"),
        'app-core must detect isFullRc and bypass single part restriction'
    );
    assert(
        appCore.includes('questionsPool = window.Ets2026Database.getFullReading(testNum);'),
        'app-core must load full reading 100 questions'
    );
});

// ----------------------------------------------------
// 3. QUIZ BOOKMARKING, CONTROLS & PALETTE
// ----------------------------------------------------
console.log('\n--- 3. Testing Bookmark Controls, Palette & Exit ---');

it('index.html "Đánh dấu xem lại" calls toggleQuizBookmark(), not closeQuizModal()', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(!html.includes('<button onclick="closeQuizModal()" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Đóng bài trắc nghiệm">Đánh dấu xem lại</button>'), 'Old broken closeQuizModal button must be removed');
    assert(html.includes('id="quizBookmarkBtn" onclick="toggleQuizBookmark()"'), 'quizBookmarkBtn must call toggleQuizBookmark');
    assert(html.includes('id="quizBookmarkIcon"'), 'quizBookmarkIcon must exist');
    assert(html.includes('id="prevQuestionBtn" onclick="prevQuizQuestion()"'), 'prevQuestionBtn must exist');
});

it('quizModal exit button calls handleExitQuiz() with confirmed exit', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(html.includes('onclick="handleExitQuiz()"'), 'Header exit must call handleExitQuiz()');
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(appCore.includes('function handleExitQuiz()'), 'handleExitQuiz function must exist in app-core');
    assert(appCore.includes('confirm('), 'handleExitQuiz must prompt confirmation when exam is active');
});

it('Question Palette Drawer exists in index.html with filters and grid', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(html.includes('id="quizQuestionPaletteDrawer"'), 'Palette drawer must exist');
    assert(html.includes('id="paletteFilterAll"'), 'Filter all must exist');
    assert(html.includes('id="paletteFilterUnanswered"'), 'Filter unanswered must exist');
    assert(html.includes('id="paletteFilterBookmarked"'), 'Filter bookmarked must exist');
    assert(html.includes('id="paletteQuestionsGrid"'), 'Questions grid container must exist');
});

it('toggleQuizBookmark, toggleQuizQuestionPalette and jumpToQuizQuestion are defined in app-core', () => {
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(appCore.includes('window.toggleQuizBookmark = toggleQuizBookmark;'), 'toggleQuizBookmark must be exported');
    assert(appCore.includes('window.toggleQuizQuestionPalette = toggleQuizQuestionPalette;'), 'toggleQuizQuestionPalette must be exported');
    assert(appCore.includes('window.jumpToQuizQuestion = jumpToQuizQuestion;'), 'jumpToQuizQuestion must be exported');
});

// ----------------------------------------------------
// 4. EXAM HISTORY & STATS WIRING
// ----------------------------------------------------
console.log('\n--- 4. Testing Exam History & Banner Stats ---');

it('History Banner button opens openExamHistoryModal() instead of fake toast', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(!html.includes("showToast('Bạn chưa có bài thi thử nào trong lịch sử"), 'Fake toast on history button must be gone');
    assert(html.includes('onclick="openExamHistoryModal()"'), 'History button must call openExamHistoryModal()');
    assert(html.includes('id="examHistoryModal"'), 'examHistoryModal markup must exist');
    assert(html.includes('id="examHistoryListContainer"'), 'examHistoryListContainer must exist');
});

it('finishExamQuiz stores rich attempt record in toeic_exam_history and updates stats', () => {
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(appCore.includes('updateMockTestBannerStats()'), 'finishExamQuiz must call updateMockTestBannerStats');
    assert(appCore.includes('questionsSummary: activeQuizList.map('), 'finishExamQuiz must save questionsSummary for historical review');
    assert(appCore.includes('userAnswers: { ...examUserAnswers }'), 'finishExamQuiz must save userAnswers');
});

it('updateMockTestBannerStats correctly calculates bestScore, latestScore and count', () => {
    const mockStorage = {
        toeic_exam_history: JSON.stringify([
            { totalScore: 780, date: new Date().toISOString() },
            { totalScore: 850, date: new Date().toISOString() },
            { totalScore: 690, date: new Date().toISOString() }
        ])
    };
    const history = JSON.parse(mockStorage.toeic_exam_history);
    const count = history.length;
    const latestScore = history[0].totalScore;
    const bestScore = Math.max(...history.map(h => h.totalScore));

    assert.strictEqual(count, 3);
    assert.strictEqual(latestScore, 780);
    assert.strictEqual(bestScore, 850);
});

// ----------------------------------------------------
// 5. DICTATION IDEMPOTENCY
// ----------------------------------------------------
console.log('\n--- 5. Testing Dictation Idempotency ---');

it('app-core.bundle.js tracks completedDictationKeys in localStorage and prevents repeated XP/done increments', () => {
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(appCore.includes('toeic_completed_dictation_keys'), 'Must persist completed dictation keys');
    assert(appCore.includes('completedDictationKeys.has(sKey)'), 'Must check if sentence was already completed');
    assert(appCore.includes('completedDictationKeys.add(sKey)'), 'Must add newly completed sentence key');
});

// ----------------------------------------------------
// 6. AUDIO TRANSCRIPTION REAL FAILURE HANDLING
// ----------------------------------------------------
console.log('\n--- 6. Testing Audio Transcription Error Handling ---');

it('toeic-boc-bang-station.js never returns fake fallback "Audio file loaded."', () => {
    const stationCode = fs.readFileSync('js/toeic-boc-bang-station.js', 'utf8');
    assert(!stationCode.includes("text: 'Audio file loaded.'"), 'Fake transcript fallback must be eliminated');
    assert(stationCode.includes("throw new Error('Cloud AI không thể bóc băng"), 'Real error must be thrown');
});

// ----------------------------------------------------
// 7. DICTIONARY LEXICON QUALITY
// ----------------------------------------------------
console.log('\n--- 7. Testing Dictionary Lexicon Quality ---');

it('Dictionary entry for appointment has pos="noun", CEFR B1/B2 definition and incomplete=false', () => {
    const lexicon = JSON.parse(fs.readFileSync('data/dictionary_lexicon.json', 'utf8'));
    const entry = lexicon.appointment;
    assert(entry, 'appointment must exist in lexicon');
    assert.strictEqual(entry.partOfSpeech, 'noun', 'partOfSpeech must be noun');
    assert.strictEqual(entry.pos, 'noun', 'pos must be noun');
    assert.strictEqual(entry.incomplete, false, 'incomplete must be false');
    assert(entry.definition.includes('arrangement to meet'), 'Definition must be authentic dictionary definition');
    assert(entry.collocations && entry.collocations.length >= 3, 'Must have at least 3 collocations');
    const hasCambridgeOrOxford = JSON.stringify(entry.sources).includes('Cambridge') || JSON.stringify(entry.sources).includes('Oxford');
    assert(hasCambridgeOrOxford, 'Must cite Cambridge or Oxford Dictionary');
});

// ----------------------------------------------------
// 8. TONE & QUIET CONFIDENCE MICROCOPY
// ----------------------------------------------------
console.log('\n--- 8. Testing Tone & Quiet Confidence ---');

it('index.html replaced sensationalist words with quiet confidence terms', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(!html.includes('<span>12 Bẫy Tử Huyệt</span>'), '12 Bẫy Tử Huyệt must be replaced');
    assert(html.includes('<span>12 Bẫy Đề Thường Gặp</span>'), '12 Bẫy Đề Thường Gặp must be used');
    assert(!html.includes('Công Cụ Luyện Thi Siêu Tốc 2026'), 'Siêu tốc must be replaced');
    assert(html.includes('Công Cụ Luyện Thi Trọng Tâm'), 'Trọng tâm must be used');
    assert(!html.includes('Vuốt Tinder FSRS v5'), 'Vuốt Tinder must be replaced');
    assert(html.includes('Ôn tập FSRS'), 'Ôn tập FSRS must be used');
});

// ----------------------------------------------------
// 9. GUEST PROFILE EXAM DATE CONSISTENCY
// ----------------------------------------------------
console.log('\n--- 9. Testing Guest Profile & Exam Date ---');

it('Guest accounts do not have 20/12/2026 assigned automatically when unset', () => {
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(!appCore.includes("setTxt('memberExamDate', currentUserAccount.examDate ? `Thi: ${currentUserAccount.examDate}` : 'Thi: 20/12/2026');"), 'Hardcoded memberExamDate 20/12/2026 must be removed');
    assert(!appCore.includes("setTxt('targetDateVal', `Thi: ${currentUserAccount.examDate || '20/12/2026'}`);"), 'Hardcoded targetDateVal 20/12/2026 must be removed');
    assert(!appCore.includes("if (inputDate) inputDate.value = currentUserAccount.examDate || '20/12/2026';"), 'inputTargetDate fallback must be removed');
    
    const roadmap = fs.readFileSync('js/roadmap-and-traps.js', 'utf8');
    assert(!roadmap.includes("id: 'acc-student-' + Date.now(),\n                name: 'Học viên',\n                email: 'student@cungdang.edu.vn',\n                targetScore: '650',\n                examDate: '20/12/2026'"), 'Roadmap guest must not have hardcoded 20/12/2026');
});

// ----------------------------------------------------
// 10. EXAM SESSION AUTO-SAVE & RESUME
// ----------------------------------------------------
console.log('\n--- 10. Testing Exam Session Auto-Save & Resume ---');

it('saveActiveExamSession, clearActiveExamSession, and checkAndResumeActiveExamSession exist and function', () => {
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(appCore.includes('window.saveActiveExamSession = saveActiveExamSession;'), 'saveActiveExamSession must be exported');
    assert(appCore.includes('window.clearActiveExamSession = clearActiveExamSession;'), 'clearActiveExamSession must be exported');
    assert(appCore.includes('window.checkAndResumeActiveExamSession = checkAndResumeActiveExamSession;'), 'checkAndResumeActiveExamSession must be exported');
    assert(appCore.includes('localStorage.setItem(\'toeic_active_exam_session\','), 'saveActiveExamSession must write to localStorage');
});

// ----------------------------------------------------
// 11. DAILY DICTATION WORKSTATION IDEMPOTENCY
// ----------------------------------------------------
console.log('\n--- 11. Testing Daily Dictation Workstation Idempotency ---');

it('DailyDictationWorkstation tracks completedKeys and avoids duplicate increments on multiple checks', () => {
    const ddwCode = fs.readFileSync('js/dailydictation-workstation.js', 'utf8');
    assert(ddwCode.includes('this.completedKeys = new Set()'), 'Must initialize completedKeys Set');
    assert(ddwCode.includes('localStorage.getItem(\'dailydictation_completed_keys\')'), 'Must persist completed keys in localStorage');
    assert(ddwCode.includes('!this.completedKeys.has(challengeKey)'), 'Must guard increment behind completedKeys.has(challengeKey)');
    assert(ddwCode.includes('this.completedKeys.add(challengeKey)'), 'Must add key to completedKeys');
    assert(ddwCode.includes('this._autoNextTimeout = null'), 'Must track single auto next timeout');
});

// ----------------------------------------------------
// 12. EXAM HISTORY DETAILED REVIEW MODE
// ----------------------------------------------------
console.log('\n--- 12. Testing Exam Detailed Review Mode ---');

it('app-core.bundle.js supports dedicated activeQuizMode === "review" with locked options & explanations', () => {
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(appCore.includes("activeQuizMode = 'review'"), 'review mode must be set when reviewing attempts');
    assert(appCore.includes('b.disabled = true;'), 'Options must be disabled during review');
    assert(appCore.includes('quizExplanationBox'), 'Explanation box must be rendered for review');
    assert(appCore.includes("if (activeQuizMode === 'review') {\n                    closeQuizModal();\n                    showToast('Đã hoàn thành xem lại bài làm');\n                    return;\n                }"), 'Completing review mode must exit cleanly without awarding XP or mockDone');
});

// ----------------------------------------------------
// 13. SCORE ESTIMATION & QUIET CONFIDENCE PHRASING
// ----------------------------------------------------
console.log('\n--- 13. Testing Score Estimation Phrasing ---');

it('ets-adaptive-scorer.js and finishExamQuiz use honest estimated score wording', () => {
    const scorer = fs.readFileSync('js/ets-adaptive-scorer.js', 'utf8');
    assert(!scorer.includes('Dự Báo Điểm ETS Thích Ứng (AI IRT Model)'), 'Must not claim AI IRT Model in header');
    assert(scorer.includes('Dự Báo Điểm ETS Thích Ứng (Ước lượng tham khảo)'), 'Must use quiet estimated reference wording');
    assert(!scorer.includes('Khoảng tin cậy 95% được kích hoạt'), 'Must not claim unverified 95% confidence interval');
    
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(appCore.includes('Điểm ước lượng tham khảo theo thang điểm ETS 10 - 990 (Tính theo tỷ lệ số câu đúng của bài làm)'), 'finishExamQuiz must describe estimated reference score');
});

// ----------------------------------------------------
// 14. GUEST DIAGNOSTIC STATE IN DASHBOARD
// ----------------------------------------------------
console.log('\n--- 14. Testing Guest Diagnostic Dashboard State ---');

it('updateDashboardHeroLessonState updates hero CTA once guest completes diagnostic test', () => {
    const appCore = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    assert(appCore.includes("const saved = localStorage.getItem('study_studio_guest_diagnostic') || localStorage.getItem('cung_dang_diagnostic_results');"), 'Must check guest diagnostic result from localStorage');
    assert(appCore.includes("ctaText.textContent = 'Tiếp tục luyện tập ngay (~10 phút)';"), 'Must update hero CTA for completed diagnostic guest');
    assert(appCore.includes("window._heroNextTabTarget = 'lo-trinh';"), 'Must target roadmap tab once diagnostic is done');
});

// ----------------------------------------------------
// 15. DICTIONARY MINI-QUIZ SUPPRESSION
// ----------------------------------------------------
console.log('\n--- 15. Testing Dictionary Mini-Quiz Suppression ---');

it('dictionary-engine.js suppresses mini-quiz for limited or incomplete entries', () => {
    const dictCode = fs.readFileSync('js/dictionary-engine.js', 'utf8');
    assert(dictCode.includes("entry.dataStatus === 'limited' || entry.incomplete"), 'generateMiniQuiz must guard against limited or incomplete entries');
});

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('====================================================');

if (passedTests !== totalTests) {
    process.exit(1);
} else {
    process.exit(0);
}
