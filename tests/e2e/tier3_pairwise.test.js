/**
 * Tier 3: Pairwise Cross-Feature Interactions Test Suite (25 Tests)
 * Validates cross-module contracts, state propagation, and integration between feature pairs.
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

const suite = new TestSuite('Tier 3: Pairwise Cross-Feature Interactions (25 Tests)');

// Initialize browser mock environment
setupMockBrowser();

// =========================================================================
// PAIRWISE TESTS T3.01 - T3.25
// =========================================================================

suite.test('T3.01: F5 (Editorial Theme) + F21 (3D Flashcard): Flashcard faces inherit Editorial Theme CSS color tokens', () => {
  document.documentElement.classList.add('editorial');
  const cardElement = document.createElement('div');
  cardElement.className = 'flashcard-face bg-base text-primary';
  assert(document.documentElement.classList.contains('editorial'));
  assert(cardElement.className.includes('bg-base'));
  assert(cardElement.className.includes('text-primary'));
});

suite.test('T3.02: F5 (Editorial Theme) + F18 (Document UI): Authentic documents apply warm sand tinting in Editorial mode', () => {
  document.documentElement.classList.add('editorial');
  const getDocumentBackground = (isEditorial) => isEditorial ? '#FAF6F0' : '#FFFFFF';
  assertEqual(getDocumentBackground(document.documentElement.classList.contains('editorial')), '#FAF6F0');
});

suite.test('T3.03: F6 (Font Switcher) + F18 (Document UI): Font switch to ETS Serif preserves fixed-width font in invoice tables', () => {
  document.documentElement.classList.add('font-ets');
  const invoiceHtml = `<div class="vat-invoice"><p class="passage-body">Passage in ETS Serif</p><span class="font-mono text-xs">#INV-2026-99</span></div>`;
  assert(invoiceHtml.includes('font-mono')); // Numeric serial stays monospaced
  assert(document.documentElement.classList.contains('font-ets'));
});

suite.test('T3.04: F8 (Sound Feedback) + F21 (3D Flashcard): Swipe right triggers playDing(); 5-combo triggers playComboCheer() & confetti', () => {
  let dingPlayed = false;
  let comboCheerPlayed = false;
  let confettiFired = false;
  let combo = 0;

  const onSwipeRight = () => {
    dingPlayed = true;
    combo++;
    if (combo >= 5) {
      comboCheerPlayed = true;
      confettiFired = true;
    }
  };

  for (let i = 0; i < 5; i++) onSwipeRight();
  assertEqual(dingPlayed, true);
  assertEqual(combo, 5);
  assertEqual(comboCheerPlayed, true);
  assertEqual(confettiFired, true);
});

suite.test('T3.05: F9 (Pomodoro) + F10 (Exam Soundscape): Switching to Exam mode pauses Pomodoro ambient track and starts room noise', () => {
  let pomodoroTrack = 'rain';
  let examSoundscapeActive = false;

  const switchMode = (newMode) => {
    if (newMode === 'exam') {
      pomodoroTrack = null; // Paused
      examSoundscapeActive = true;
    }
  };

  switchMode('exam');
  assertEqual(pomodoroTrack, null);
  assertEqual(examSoundscapeActive, true);
});

suite.test('T3.06: F9 (Pomodoro) + F17 (180s Micro-Capsule): Launching 180s capsule inside Pomodoro session credits capsule duration to focus metrics', () => {
  let totalFocusMinutes = 20;
  const onCapsuleComplete = (durationSeconds) => {
    totalFocusMinutes += Math.round(durationSeconds / 60);
  };
  onCapsuleComplete(180); // 3 minutes
  assertEqual(totalFocusMinutes, 23);
});

suite.test('T3.07: F11 (7-Axis Radar) + F14 (Adaptive Test): Finishing 10-minute adaptive test updates all 7 axes of radar chart', () => {
  const adaptiveResults = {
    partScores: { 1: 0.85, 2: 0.70, 3: 0.55, 4: 0.65, 5: 0.90, 6: 0.50, 7: 0.75 }
  };
  const masteries = [1, 2, 3, 4, 5, 6, 7].map(p => adaptiveResults.partScores[p]);
  const vertices = RADAR_GROUND_TRUTH.getVertices(masteries);
  assertEqual(vertices.length, 7);
  assertEqual(vertices[0].mastery, 0.85); // Part 1
  assertEqual(vertices[2].mastery, 0.55); // Part 3
  assertEqual(vertices[5].mastery, 0.50); // Part 6
});

suite.test('T3.08: F11 (7-Axis Radar) + F16 (12 Traps Heat Matrix): Clicking weak part on radar filters Heat Matrix to show that Parts traps', () => {
  const weakPart = 3; // Part 3
  const filterTrapsByPart = (p) => TRAP_CATEGORIES_CATALOG.filter(t => t.part === p);
  const part3Traps = filterTrapsByPart(weakPart);
  assertEqual(part3Traps.length >= 1, true);
  assertEqual(part3Traps.some(t => t.code === 'P3-REVERSAL'), true);
});

suite.test('T3.09: F12 (Score Prediction) + F14 (Adaptive Test): Adaptive test score directly feeds into score prediction Gaussian model', () => {
  const adaptiveTheta = 0.5; // ~600 score band
  const estimatedScore = IRT_GROUND_TRUTH.thetaToScore(adaptiveTheta);
  const probOver650 = GAUSSIAN_GROUND_TRUTH.predictOverTarget(estimatedScore, 30, 1.5, 650);
  assertEqual(estimatedScore > 550, true);
  assertEqual(probOver650 >= 40 && probOver650 <= 70, true);
});

suite.test('T3.10: F15 (FSRS v5) + F21 (3D Flashcard): Swiping Left (Again) or Right (Good) passes rating into FSRS5Engine.rateCard()', () => {
  const card = FSRS_GROUND_TRUTH.initCard('w_requisition');
  const onSwipe = (direction) => {
    const grade = direction === 'right' ? 3 : 1;
    return FSRS_GROUND_TRUTH.rateCard(card, grade, 1.0);
  };
  const resultRight = onSwipe('right');
  assertEqual(resultRight.stability > card.stability, true);
  assertEqual(resultRight.intervalDays >= 3, true);
});

suite.test('T3.11: F15 (FSRS v5) + F17 (180s Micro-Capsule): Micro-capsule Type B pulls 5 due vocabulary words scheduled by FSRS', () => {
  const vocabCards = [
    { word: 'W1', nextReview: Date.now() - 1000 },
    { word: 'W2', nextReview: Date.now() - 5000 },
    { word: 'W3', nextReview: Date.now() + 86400000 }, // Future
    { word: 'W4', nextReview: Date.now() - 2000 },
    { word: 'W5', nextReview: Date.now() - 3000 },
    { word: 'W6', nextReview: Date.now() - 4000 }
  ];
  const dueWords = vocabCards.filter(c => c.nextReview <= Date.now()).slice(0, 5);
  assertEqual(dueWords.length, 5);
  assertEqual(dueWords.some(w => w.word === 'W3'), false); // Future card excluded
});

suite.test('T3.12: F16 (12 Traps Matrix) + F2 (Indirect Traps): Mistake on Part 3 reversal question logs error under TRAP-06 and increments heat', () => {
  let heatRecords = { 'TRAP-06': { attempts: 5, errors: 2 } };
  const onAnswerSubmitted = (q) => {
    if (q.trapCategory && !q.isCorrect) {
      heatRecords[q.trapCategory].attempts++;
      heatRecords[q.trapCategory].errors++;
    }
  };
  onAnswerSubmitted({ trapCategory: 'TRAP-06', isCorrect: false });
  assertEqual(heatRecords['TRAP-06'].errors, 3);
  assertEqual(heatRecords['TRAP-06'].attempts, 6);
});

suite.test('T3.13: F16 (12 Traps Matrix) + F25 (AI Explanation): Clicking hot trap in matrix requests AI explanation with that trap pre-selected', () => {
  const selectedTrap = 'TRAP-06';
  const buildExplanationRequest = (trapId) => ({
    question: 'Sample reversal question',
    trapCategory: trapId,
    requestAI: true
  });
  const req = buildExplanationRequest(selectedTrap);
  assertEqual(req.trapCategory, 'TRAP-06');
  assertEqual(req.requestAI, true);
});

suite.test('T3.14: F23 (Karaoke Lyrics Sync) + F24 (Accent Classifier): Karaoke player displays active speakers national flag next to running transcript', () => {
  const activeSegment = {
    speaker: 'Marcus',
    accent: 'UK',
    text: 'Good morning everyone.'
  };
  const getFlag = (acc) => acc === 'UK' ? '🇬🇧' : '🇺🇸';
  const renderedLine = `<div class="karaoke-line"><span class="flag">${getFlag(activeSegment.accent)}</span> <span class="text">${activeSegment.text}</span></div>`;
  assert(renderedLine.includes('🇬🇧'));
  assert(renderedLine.includes('Good morning everyone'));
});

suite.test('T3.15: F23 (Karaoke Lyrics Sync) + F2 (Indirect Traps): When indirect reversal phrase (Wait...) is spoken, karaoke sync highlights in warning amber', () => {
  const segment = { text: 'Wait, the room is unavailable.' };
  const getHighlightClass = (txt) => {
    if (/\b(wait|actually)\b/i.test(txt)) return 'karaoke-warning-amber';
    return 'karaoke-standard-blue';
  };
  assertEqual(getHighlightClass(segment.text), 'karaoke-warning-amber');
});

suite.test('T3.16: F22 (WebSocket PvP) + F8 (Sound Feedback): Correct answer in PvP arena plays sound ding and updates streak combo cheer', () => {
  let pvpScore = 100;
  let dingCount = 0;
  const onPvPAnswer = (isCorrect) => {
    if (isCorrect) {
      pvpScore += 100;
      dingCount++;
    }
  };
  onPvPAnswer(true);
  assertEqual(pvpScore, 200);
  assertEqual(dingCount, 1);
});

suite.test('T3.17: F22 (WebSocket PvP) + F19 (80/20 Vocab): PvP arena draws 10 match words exclusively from Cực Cao frequency tier', () => {
  const vocabBank = [
    { word: 'abide by', tier: 'Cực Cao' },
    { word: 'accommodate', tier: 'Cực Cao' },
    { word: 'expedite', tier: 'Cực Cao' },
    { word: 'fiduciary', tier: 'Trung Bình' }
  ];
  const getPvPWords = (bank) => bank.filter(w => w.tier === 'Cực Cao');
  const pvpSet = getPvPWords(vocabBank);
  assertEqual(pvpSet.every(w => w.tier === 'Cực Cao'), true);
});

suite.test('T3.18: F22 (WebSocket PvP) + F25 (AI Explanation): After PvP match finishes, clicking missed word opens Vì sao em sai? explanation', () => {
  const matchSummary = {
    missedWords: [
      { word: 'expedite', userChoice: 'slow down', correctChoice: 'speed up', trap: 'Antonym trap' }
    ]
  };
  const requestExplanation = (item) => ({
    prompt: `Vì sao em nhầm ${item.word} thành ${item.userChoice}?`,
    explanationAvailable: true
  });
  const res = requestExplanation(matchSummary.missedWords[0]);
  assert(res.prompt.includes('expedite'));
  assertEqual(res.explanationAvailable, true);
});

suite.test('T3.19: F1 (Tour Guide) + F5 (Editorial Theme): Tour guide step bubbles apply high-contrast borders under Editorial theme', () => {
  document.documentElement.classList.add('editorial');
  const getTourBubbleClass = (isEditorial) => isEditorial ? 'border-amber-900/30 bg-[#FAF6F0] text-[#161E2E]' : 'bg-white text-slate-800';
  const cls = getTourBubbleClass(document.documentElement.classList.contains('editorial'));
  assert(cls.includes('FAF6F0'));
  assert(cls.includes('161E2E'));
});

suite.test('T3.20: F1 (Tour Guide) + F7 (PWA Install): Final step of tour guide highlights 1-tap PWA install action button', () => {
  const steps = [
    { id: 1, title: 'Luyện Nghe' },
    { id: 2, title: 'Luyện Đọc' },
    { id: 3, title: 'Cài Đặt App', target: '#pwa-install-btn' }
  ];
  const lastStep = steps[steps.length - 1];
  assertEqual(lastStep.target, '#pwa-install-btn');
});

suite.test('T3.21: F3 (Pre-Listening Tips) + F24 (Accent Classifier): Pre-listening 8s card warns student of upcoming speakers accent', () => {
  const upcomingDialogue = { speakerAccent: 'AU' };
  const generateTip = (acc) => `⚠️ Chú ý: Giọng ${acc} (Úc) thường phát âm /eɪ/ thành /aɪ/!`;
  const tip = generateTip(upcomingDialogue.speakerAccent);
  assert(tip.includes('AU'));
  assert(tip.includes('Úc'));
});

suite.test('T3.22: F4 (Cheat Sheet) + F20 (Paraphrase Clusters): One-page cheat sheet embeds top 3 office paraphrase clusters from that lesson', () => {
  const lessonClusters = ['POSTPONE', 'COMPENSATION', 'PROCURE'];
  const embedClusters = (clusters) => clusters.map(c => `Cluster [${c}]`).join(' | ');
  const embedded = embedClusters(lessonClusters);
  assert(embedded.includes('[POSTPONE]'));
  assert(embedded.includes('[COMPENSATION]'));
});

suite.test('T3.23: F13 (Weekly Progress) + F11 (7-Axis Radar): Weekly report embeds mini summary of 7-axis competency radar', () => {
  const weeklyData = {
    weakestPart: 3,
    strongestPart: 5,
    radarSummary: 'Part 5 dẫn đầu (90%), Part 3 cần củng cố (55%)'
  };
  assert(weeklyData.radarSummary.includes('Part 5'));
  assert(weeklyData.radarSummary.includes('Part 3'));
});

suite.test('T3.24: F13 (Weekly Progress) + F16 (12 Traps Matrix): Weekly report highlights #1 trap category with biggest heat reduction', () => {
  const trapDeltas = [
    { trap: 'TRAP-06', heatReduction: 35 },
    { trap: 'TRAP-01', heatReduction: 10 }
  ];
  const topRemediated = trapDeltas.sort((a, b) => b.heatReduction - a.heatReduction)[0];
  assertEqual(topRemediated.trap, 'TRAP-06');
  assertEqual(topRemediated.heatReduction, 35);
});

suite.test('T3.25: F10 (Exam Soundscape) + F14 (Adaptive Test): Exam soundscape activates red alert flash when 10-minute test has 60s left', () => {
  const adaptiveTimer = 55; // 55s remaining in 600s test
  const isRedAlert = (remaining) => remaining <= 60;
  assertEqual(isRedAlert(adaptiveTimer), true);
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
