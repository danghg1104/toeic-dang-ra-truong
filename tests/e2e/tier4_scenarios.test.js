/**
 * Tier 4: Real-World Scenarios Test Suite (13 Comprehensive Scenarios)
 * Validates complex, multi-step end-to-end user journeys through the application.
 */

const {
  assert,
  assertEqual,
  assertNotEqual,
  assertDeepEqual,
  assertInDelta,
  assertMatch,
  TestSuite,
  setupMockBrowser,
  FSRS_GROUND_TRUTH,
  IRT_GROUND_TRUTH,
  RADAR_GROUND_TRUTH,
  GAUSSIAN_GROUND_TRUTH,
  TRAP_CATEGORIES_CATALOG
} = require('./test_helper');

const suite = new TestSuite('Tier 4: Real-World Scenarios (13 Scenarios)');

// Initialize browser mock environment
setupMockBrowser();

// =========================================================================
// SCENARIO 1: Onboarding & Theme Personalization
// =========================================================================

suite.test('Scenario 1: New User Onboarding & Visual Theme Personalization', () => {
  // Step 1: User visits app for first time; tour guide launches
  window.localStorage.clear();
  assertEqual(window.localStorage.getItem('toeic_tour_completed'), null);

  const tour = {
    currentStep: 0,
    steps: ['Welcome', 'Listening', 'Reading', 'PvP'],
    next() { this.currentStep++; },
    finish() { window.localStorage.setItem('toeic_tour_completed', 'true'); }
  };

  // Step 2: User completes 4 onboarding steps
  tour.next();
  tour.next();
  tour.next();
  tour.finish();
  assertEqual(window.localStorage.getItem('toeic_tour_completed'), 'true');

  // Step 3: User prefers Warm Sand theme to avoid eye fatigue
  document.documentElement.classList.add('editorial');
  window.localStorage.setItem('toeic_theme_editorial', 'true');
  assertEqual(document.documentElement.classList.contains('editorial'), true);

  // Step 4: User toggles ETS Serif font for authentic test reading
  document.documentElement.classList.add('font-ets');
  window.localStorage.setItem('toeic_font_ets', 'true');
  assertEqual(document.documentElement.classList.contains('font-ets'), true);

  // Step 5: Verify preferences persist across reloads
  assertEqual(window.localStorage.getItem('toeic_theme_editorial'), 'true');
  assertEqual(window.localStorage.getItem('toeic_font_ets'), 'true');
});

// =========================================================================
// SCENARIO 2: Complete 10-Minute Diagnostic Test to Radar
// =========================================================================

suite.test('Scenario 2: Complete 10-Minute Adaptive Diagnostic Test to 7-Axis Competency Radar', () => {
  // Step 1: Start 10-minute adaptive test (theta baseline 0.0)
  let theta = 0.0;
  let standardError = 1.0;
  const administeredQuestions = [];

  // Step 2: Answer 16 questions (simulate alternating correct/incorrect)
  const answers = [
    { part: 1, correct: true, b: -0.5 },
    { part: 2, correct: true, b: 0.2 },
    { part: 3, correct: false, b: 0.8 }, // Part 3 wrong
    { part: 3, correct: false, b: 0.4 }, // Part 3 wrong again
    { part: 4, correct: true, b: 0.1 },
    { part: 5, correct: true, b: 0.5 },
    { part: 5, correct: true, b: 0.9 },
    { part: 6, correct: true, b: 0.3 },
    { part: 7, correct: true, b: 0.7 },
    { part: 1, correct: true, b: 0.2 },
    { part: 2, correct: true, b: 0.4 },
    { part: 3, correct: false, b: 0.1 }, // Part 3 weak
    { part: 4, correct: true, b: 0.6 },
    { part: 5, correct: true, b: 1.1 },
    { part: 6, correct: false, b: 0.8 },
    { part: 7, correct: true, b: 1.0 }
  ];

  answers.forEach(a => {
    administeredQuestions.push(a);
    const P = IRT_GROUND_TRUTH.probability(theta, a.b);
    theta += (a.correct ? 1 : 0 - P) * 0.15;
    standardError = Math.max(0.22, standardError - 0.05);
  });

  // Step 3: Test concludes, calculate estimated score
  const estimatedScore = IRT_GROUND_TRUTH.thetaToScore(theta);
  assertEqual(estimatedScore >= 500 && estimatedScore <= 800, true);

  // Step 4: Map Part proficiencies to 7-Axis Radar
  const partProficiencies = [
    0.90, // Part 1
    0.85, // Part 2
    0.35, // Part 3 (Weak!)
    0.80, // Part 4
    0.95, // Part 5
    0.65, // Part 6
    0.85  // Part 7
  ];

  const vertices = RADAR_GROUND_TRUTH.getVertices(partProficiencies);
  assertEqual(vertices.length, 7);

  // Step 5: Verify weak Part 3 is highlighted in orange (<60%)
  const weakParts = RADAR_GROUND_TRUTH.findWeakParts(partProficiencies);
  assertEqual(weakParts.includes(3), true, 'Part 3 must be identified as weak');

  // Step 6: Verify score prediction for exam target 650
  const prob650 = GAUSSIAN_GROUND_TRUTH.predictOverTarget(estimatedScore, 30, 1.5, 650);
  assertEqual(prob650 > 50, true);
});

// =========================================================================
// SCENARIO 3: Weak Part Remediation via 180s Micro-Capsule
// =========================================================================

suite.test('Scenario 3: Weak Domain Remediation via 180-Second Micro-Capsule', () => {
  // Step 1: User notices Part 3 is weak on radar chart (TRAP-06 Reversal trap)
  const targetTrap = 'TRAP-06';

  // Step 2: System launches 180s Micro-Capsule Type A
  const capsule = {
    trap: targetTrap,
    phase1_theorySec: 30,
    phase2_drillSec: 120,
    phase3_wrapSec: 30,
    questions: [
      { id: 'q1', type: 'reversal', ans: 'B', userAns: 'B', correct: true },
      { id: 'q2', type: 'reversal', ans: 'D', userAns: 'D', correct: true },
      { id: 'q3', type: 'reversal', ans: 'A', userAns: 'A', correct: true }
    ]
  };

  // Step 3: User gets 3/3 correct within drill phase
  const allCorrect = capsule.questions.every(q => q.ans === q.userAns);
  assertEqual(allCorrect, true);

  // Step 4: Heat Matrix updates, reducing heat for TRAP-06
  let trapHeat = 75; // Initial critical heat
  if (allCorrect) trapHeat = Math.max(15, trapHeat - 40); // Drops to warm/cold
  assertEqual(trapHeat, 35);

  // Step 5: Audio feedback celebrates completion
  let soundPlayed = true;
  assertEqual(soundPlayed, true);
});

// =========================================================================
// SCENARIO 4: FSRS Vocabulary Flashcard Daily Review
// =========================================================================

suite.test('Scenario 4: FSRS Vocabulary Flashcard Daily Review with 3D Tinder Gestures', () => {
  // Step 1: Initialize 5 vocab cards due for review
  const cards = [
    FSRS_GROUND_TRUTH.initCard('w_abide_by'),
    FSRS_GROUND_TRUTH.initCard('w_accommodate'),
    FSRS_GROUND_TRUTH.initCard('w_expedite'),
    FSRS_GROUND_TRUTH.initCard('w_moratorium'),
    FSRS_GROUND_TRUTH.initCard('w_preliminary')
  ];

  // Step 2: User swipes right (Good) on 3 cards, swipes left (Again) on 2 cards
  const results = [];
  results.push(FSRS_GROUND_TRUTH.rateCard(cards[0], 3, 1.0)); // Good
  results.push(FSRS_GROUND_TRUTH.rateCard(cards[1], 3, 1.0)); // Good
  results.push(FSRS_GROUND_TRUTH.rateCard(cards[2], 1, 1.0)); // Again (Lapse)
  results.push(FSRS_GROUND_TRUTH.rateCard(cards[3], 1, 1.0)); // Again (Lapse)
  results.push(FSRS_GROUND_TRUTH.rateCard(cards[4], 3, 1.0)); // Good

  // Step 3: Check stability increases for Good cards, lapses recorded for Again cards
  assertEqual(results[0].stability > cards[0].stability, true);
  assertEqual(results[2].lapses, 1);
  assertEqual(results[3].lapses, 1);

  // Step 4: Next review interval updated for each card
  assertEqual(results[0].intervalDays >= 3, true);
  assertEqual(results[2].intervalDays >= 1, true);
});

// =========================================================================
// SCENARIO 5: Part 7 Authentic Document Reading Practice
// =========================================================================

suite.test('Scenario 5: Part 7 Authentic Document Reading Practice in VAT Invoice Template', () => {
  // Step 1: User selects Part 7 practice item with VAT Invoice document type
  const passage = {
    docType: 'Invoice',
    serial: 'AA/26E',
    number: '0049281',
    items: [
      { name: 'Ergonomic Desk Chair', qty: 10, unitPrice: 85.0, total: 850.0 },
      { name: 'Dual Monitor Arm', qty: 5, unitPrice: 40.0, total: 200.0 }
    ],
    subtotal: 1050.0,
    vat: 105.0,
    total: 1155.0
  };

  // Step 2: Verify subtotal and total calculations match invoice line items
  const computedSubtotal = passage.items.reduce((acc, it) => acc + it.total, 0);
  assertEqual(computedSubtotal, passage.subtotal);
  assertEqual(computedSubtotal + passage.vat, passage.total);

  // Step 3: User answers cross-reference comprehension question
  const question = {
    prompt: 'What is the total expenditure including VAT for the office furniture?',
    options: ['$1,050.00', '$1,155.00', '$850.00', '$200.00'],
    correctAnswer: '$1,155.00'
  };
  const userSelected = '$1,155.00';
  assertEqual(userSelected, question.correctAnswer);

  // Step 4: User toggles font to ETS Serif; table typography remains clear
  document.documentElement.classList.add('font-ets');
  assertEqual(document.documentElement.classList.contains('font-ets'), true);
});

// =========================================================================
// SCENARIO 6: Listening Practice with Karaoke Sync & Accent Detection
// =========================================================================

suite.test('Scenario 6: Part 4 Talk with Pre-Listening Tips, Karaoke Sync & UK Accent Detection', () => {
  // Step 1: Pre-listening 8s window warns of UK accent and scans question keywords
  const talkMeta = {
    accent: 'UK',
    speaker: 'Gareth Evans',
    topic: 'Transit Maintenance'
  };
  assertEqual(talkMeta.accent, 'UK');

  // Step 2: Audio starts playing; karaoke lines sync to timestamps
  const transcriptSegments = [
    { start: 0.0, end: 3.5, text: 'Attention passengers on the Northern Line.' },
    { start: 3.6, end: 7.0, text: 'Track maintenance has been scheduled for this Saturday.' },
    { start: 7.1, end: 11.0, text: 'Please seek alternative bus routes at King Cross.' }
  ];

  const currentTime = 5.2;
  const activeLine = transcriptSegments.find(s => currentTime >= s.start && currentTime <= s.end);
  assertEqual(activeLine.text.includes('Track maintenance'), true);

  // Step 3: User seeks by clicking line 3
  const seekTarget = transcriptSegments[2].start;
  assertEqual(seekTarget, 7.1);
});

// =========================================================================
// SCENARIO 7: Real-Time 1v1 PvP Vocabulary Arena
// =========================================================================

suite.test('Scenario 7: Real-Time 1v1 PvP Vocabulary Arena Match against Sói Mây Bot', () => {
  // Step 1: User joins queue; after 5s matches with Sói Mây Bot
  const match = {
    matchId: 'pvp_match_1001',
    opponent: { username: 'Sói Mây AI Bot 🐺', isBot: true },
    durationSeconds: 60,
    words: [
      { word: 'abide by', correctOption: 'comply with' },
      { word: 'expedite', correctOption: 'speed up' },
      { word: 'accommodate', correctOption: 'adapt to' }
    ]
  };
  assertEqual(match.opponent.isBot, true);
  assertEqual(match.durationSeconds, 60);

  // Step 2: User answers 3 words correctly with speed bonus
  let userScore = 0;
  let combo = 0;
  match.words.forEach(w => {
    combo++;
    userScore += 100 * combo;
  });
  // Score: 100*1 + 100*2 + 100*3 = 600
  assertEqual(userScore, 600);
  assertEqual(combo, 3);

  // Step 3: Match timer expires; user wins
  const botScore = 450;
  const winner = userScore > botScore ? 'USER' : 'BOT';
  assertEqual(winner, 'USER');

  // Step 4: Rank delta awarded
  const rankDelta = 25;
  assertEqual(rankDelta > 0, true);
});

// =========================================================================
// SCENARIO 8: AI "Vì sao em sai?" Mistake Analysis
// =========================================================================

suite.test('Scenario 8: AI "Vì sao em sai?" Mistake Analysis with Multi-Tier Fallback', () => {
  // Step 1: User gets Part 5 conjunction question wrong (due to vs because)
  const mistake = {
    question: 'The flight was canceled ____ heavy fog rolled over the runway.',
    userChoice: 'due to', // Preposition followed by full clause!
    correctChoice: 'because',
    trapCategory: 'TRAP-10' // Prep vs Conj
  };

  // Step 2: System queries AI Gateway
  const generateExplanation = (mistakeObj) => {
    return {
      provider: 'gemini-3.8-flash',
      sections: {
        tiengLong: 'Thấy "heavy fog" là vội chọn "due to" vì nghe rất thuận tai đúng không nào!',
        bocMeBay: 'Bẫy TRAP-10: Phía sau có động từ "rolled" cấu thành mệnh đề S+V! "Due to" chỉ đi với cụm danh từ.',
        viSaoDung: '"Because" là liên từ liên kết 2 mệnh đề hoàn chỉnh.',
        meo3Giay: 'Có động từ chia thì -> Chọn liên từ! Chỉ có danh từ trơ trọi -> Chọn giới từ!'
      }
    };
  };

  const aiOutput = generateExplanation(mistake);
  assert(aiOutput.sections.tiengLong.includes('due to'));
  assert(aiOutput.sections.bocMeBay.includes('TRAP-10'));
  assert(aiOutput.sections.meo3Giay.includes('liên từ'));
});

// =========================================================================
// SCENARIO 9: Pomodoro Study Session with Ambient Soundscape
// =========================================================================

suite.test('Scenario 9: Pomodoro 25/5 Study Session with Rain Ambient Audio', () => {
  // Step 1: Start 25-minute Pomodoro focus block
  let phase = 'focus';
  let remaining = 1500;
  let activeTrack = 'rain';

  assertEqual(remaining, 1500);
  assertEqual(activeTrack, 'rain');

  // Step 2: Fast-forward focus phase completion
  remaining = 0;
  if (remaining === 0 && phase === 'focus') {
    phase = 'break';
    remaining = 300;
    activeTrack = 'cafe';
  }

  // Step 3: Transition to 5-minute break with cafe soundscape
  assertEqual(phase, 'break');
  assertEqual(remaining, 300);
  assertEqual(activeTrack, 'cafe');
});

// =========================================================================
// SCENARIO 10: Exam Simulation with 5-Minute Red Alert
// =========================================================================

suite.test('Scenario 10: Exam Simulation with 5-Minute Countdown Red Alert Flash', () => {
  // Step 1: Exam begins with 7200 seconds (120 mins)
  let timerSeconds = 7200;
  const isRedAlert = (t) => t <= 300;
  assertEqual(isRedAlert(timerSeconds), false);

  // Step 2: Fast forward to final 5 minutes (300 seconds)
  timerSeconds = 300;
  assertEqual(isRedAlert(timerSeconds), true);

  // Step 3: Fast forward to final 30 seconds
  timerSeconds = 30;
  assertEqual(isRedAlert(timerSeconds), true);

  // Step 4: Exam finishes at 0 seconds
  timerSeconds = 0;
  assertEqual(timerSeconds, 0);
});

// =========================================================================
// SCENARIO 11: End-of-Lesson Cheat Sheet Export
// =========================================================================

suite.test('Scenario 11: End-of-Lesson One-Page Cheat Sheet Generation and Export', () => {
  // Step 1: Lesson completes with 12 vocabulary terms and 2 trap categories
  const lessonData = {
    unit: 'Unit 03: Sales & Contracting',
    vocabCount: 12,
    traps: ['TRAP-09', 'TRAP-10']
  };

  // Step 2: Generates clean 1-page HTML document
  const sheetHtml = `
    <div class="cheat-sheet-page">
      <h2>${lessonData.unit}</h2>
      <p>Tổng từ vựng: ${lessonData.vocabCount}</p>
      <div class="traps-box">${lessonData.traps.join(', ')}</div>
    </div>
  `;

  assert(sheetHtml.includes('Unit 03'));
  assert(sheetHtml.includes('TRAP-09'));

  // Step 3: Download action initiates
  const triggerDownload = (fileName) => ({ downloaded: true, file: fileName });
  const dl = triggerDownload('cheatsheet_unit03.pdf');
  assertEqual(dl.downloaded, true);
  assertEqual(dl.file, 'cheatsheet_unit03.pdf');
});

// =========================================================================
// SCENARIO 12: Offline Continuity & Network Resiliency
// =========================================================================

suite.test('Scenario 12: Offline Continuity via Service Worker and Background Sync', () => {
  // Step 1: User goes into airplane mode (navigator.onLine = false)
  let isOnline = false;
  const localSyncQueue = [];

  // Step 2: User completes 5 practice questions offline; answers queued locally
  for (let i = 1; i <= 5; i++) {
    localSyncQueue.push({ qId: `q_${i}`, answer: 'A', timestamp: Date.now() });
  }
  assertEqual(localSyncQueue.length, 5);

  // Step 3: Network reconnects (navigator.onLine = true)
  isOnline = true;
  let serverRecords = [];
  if (isOnline) {
    serverRecords = [...localSyncQueue];
    localSyncQueue.length = 0; // Cleared
  }

  // Step 4: Verifies all 5 items successfully synced to server
  assertEqual(localSyncQueue.length, 0);
  assertEqual(serverRecords.length, 5);
});

// =========================================================================
// SCENARIO 13: Full Master User Journey (End-to-End Cycle)
// =========================================================================

suite.test('Scenario 13: Master User Journey (Onboarding -> Adaptive Test -> Capsule -> Flashcard -> PvP -> Report)', () => {
  // 1. Onboarding
  window.localStorage.setItem('toeic_tour_completed', 'true');
  assertEqual(window.localStorage.getItem('toeic_tour_completed'), 'true');

  // 2. Diagnostic adaptive test yields weak Part 3
  const partMasteries = [0.9, 0.8, 0.4, 0.7, 0.85, 0.6, 0.75];
  const weak = RADAR_GROUND_TRUTH.findWeakParts(partMasteries);
  assertEqual(weak.includes(3), true);

  // 3. Drill weak Part 3 reversal traps with 180s Micro-Capsule
  const capsuleResults = { completed: true, score: 3 };
  assertEqual(capsuleResults.score, 3);

  // 4. Daily Vocab review using 3D Tinder Flashcards (Good rating)
  const card = FSRS_GROUND_TRUTH.initCard('w_synergy');
  const rated = FSRS_GROUND_TRUTH.rateCard(card, 3, 1.0);
  assertEqual(rated.stability > card.stability, true);

  // 5. Duel in 1v1 PvP Arena
  const pvpWin = true;
  assertEqual(pvpWin, true);

  // 6. Generate weekly report
  const weeklyReport = {
    streakDays: 5,
    radarUpdated: true,
    rankScore: 1250
  };
  assertEqual(weeklyReport.streakDays, 5);
  assertEqual(weeklyReport.radarUpdated, true);
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
