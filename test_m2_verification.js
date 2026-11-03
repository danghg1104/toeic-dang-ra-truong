/**
 * Dedicated Milestone 2 Verification Suite
 * Tests all mathematical models, schemas, edge cases, and UI integration points
 * for Features F11, F12, F13, F14, F15, F16.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('       MILESTONE 2 VERIFICATION SUITE — COMPREHENSIVE AUDIT      ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ [PASS] ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ [FAIL] ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

// =========================================================================
// 1. FSRS v5 ENGINE (FEATURE F15)
// =========================================================================
console.log('\n--- 1. Testing FSRS v5 Spaced Repetition Engine (js/fsrs-v5-engine.js) ---');
const FSRS5Engine = require('./js/fsrs-v5-engine.js');

runTest('FSRS5Engine: 19 calibrated parameters loaded correctly', () => {
  assert.strictEqual(FSRS5Engine.DEFAULT_WEIGHTS.length, 19);
  FSRS5Engine.DEFAULT_WEIGHTS.forEach((w, i) => {
    assert.strictEqual(typeof w, 'number', `Weight w[${i}] must be a number`);
    assert(!isNaN(w));
  });
});

runTest('FSRS5Engine.initCard(): Initializes card with D0 and S0 defaults', () => {
  const card = FSRS5Engine.initCard('w_test_vocab');
  assert.strictEqual(card.cardId, 'w_test_vocab');
  assert.strictEqual(card.stability, 3.17);
  assert(card.difficulty >= 1.0 && card.difficulty <= 10.0);
  assert.strictEqual(card.retrievability, 1.0);
  assert.strictEqual(card.reps, 0);
  assert.strictEqual(card.lapses, 0);
  assert(card.nextReview > card.lastReview);
});

runTest('FSRS5Engine.retrievability(): R(t, S) decays monotonically without NaN', () => {
  const engine = new FSRS5Engine();
  const r0 = engine.retrievability(0, 3.17);
  const r1 = engine.retrievability(1, 3.17);
  const r7 = engine.retrievability(7, 3.17);
  const r365 = engine.retrievability(365, 3.17);

  assert.strictEqual(r0, 1.0);
  assert(r1 < r0);
  assert(r7 < r1);
  assert(r365 < r7);
  assert(r365 > 0);
  assert(!isNaN(r365));
});

runTest('FSRS5Engine.rateCard(): Recall rating Good (3) increases stability', () => {
  const card = FSRS5Engine.initCard('w_good_test');
  const rated = FSRS5Engine.rateCard(card, 3, 3.0);
  assert(rated.stability > card.stability, `Expected ${rated.stability} > ${card.stability}`);
  assert.strictEqual(rated.reps, 1);
  assert.strictEqual(rated.lapses, 0);
  assert(rated.intervalDays >= 3);
});

runTest('FSRS5Engine.rateCard(): Lapse rating Again (1) drops stability & increments lapses', () => {
  const card = { cardId: 'w_lapse_test', difficulty: 5.0, stability: 15.0, reps: 4, lapses: 0 };
  const rated = FSRS5Engine.rateCard(card, 1, 10.0);
  assert(rated.stability < card.stability, `Expected ${rated.stability} < ${card.stability}`);
  assert.strictEqual(rated.lapses, 1);
  assert.strictEqual(rated.reps, 5);
  assert(rated.intervalDays >= 1);
});

runTest('FSRS5Engine.rateCard(): Hard (2) and Easy (4) apply modifier penalties/bonuses', () => {
  const card = FSRS5Engine.initCard('w_diff_test');
  const ratedHard = FSRS5Engine.rateCard(card, 2, 2.0);
  const ratedEasy = FSRS5Engine.rateCard(card, 4, 2.0);
  assert(ratedEasy.stability > ratedHard.stability, 'Easy must yield higher stability than Hard');
  assert(ratedHard.difficulty > ratedEasy.difficulty, 'Hard must yield higher difficulty than Easy');
});

runTest('FSRS5Engine: Boundary clamping across 50 consecutive ratings', () => {
  let card = FSRS5Engine.initCard('w_boundary');
  for (let i = 0; i < 50; i++) {
    card = FSRS5Engine.rateCard(card, 4, 1.0);
  }
  assert(card.difficulty >= 1.0 && card.difficulty <= 10.0);
  assert(card.stability >= 0.1);

  for (let i = 0; i < 50; i++) {
    card = FSRS5Engine.rateCard(card, 1, 1.0);
  }
  assert(card.difficulty >= 1.0 && card.difficulty <= 10.0);
  assert(card.stability >= 0.1);
});

runTest('FSRS5Engine.getDueCards(): Correctly filters and sorts overdue cards', () => {
  const now = Date.now();
  const cards = [
    { cardId: 'c1', nextReview: now - 10000 },
    { cardId: 'c2', nextReview: now + 50000 }, // future
    { cardId: 'c3', nextReview: now - 30000 }, // most overdue
    { cardId: 'c4', nextReview: now - 5000 }
  ];
  const due = FSRS5Engine.getDueCards(cards, 10);
  assert.strictEqual(due.length, 3);
  assert.strictEqual(due[0].cardId, 'c3'); // sorted ascending by nextReview
  assert(!due.some(c => c.cardId === 'c2'));
});

// =========================================================================
// 2. 7-AXIS RADAR CHART & PREDICTOR (FEATURES F11, F12, F13)
// =========================================================================
console.log('\n--- 2. Testing 7-Axis Competency Radar Chart (js/toeic-radar-chart.js) ---');
const ToeicRadarChart = require('./js/toeic-radar-chart.js');

runTest('ToeicRadarChart.getVertices(): Projects 7 vertices at equilateral angles -pi/2 + 2pi*k/7', () => {
  const masteries = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  const vertices = ToeicRadarChart.getVertices(masteries, 100, 100, 100);
  assert.strictEqual(vertices.length, 7);
  // Part 1 vertex at top (x=100, y=0)
  assert(Math.abs(vertices[0].x - 100) < 0.5);
  assert(Math.abs(vertices[0].y - 0) < 0.5);
});

runTest('ToeicRadarChart.findWeakParts(): Flags score < 60% or minimum axis', () => {
  const masteries = [0.85, 0.75, 0.55, 0.90, 0.70, 0.45, 0.80];
  const weak = ToeicRadarChart.findWeakParts(masteries);
  assert(weak.includes(3), 'Part 3 (55%) must be flagged as weak');
  assert(weak.includes(6), 'Part 6 (45%) must be flagged as weak');
  assert(!weak.includes(1), 'Part 1 (85%) is not weak');
});

runTest('ToeicRadarChart.findWeakParts(): Tied lowest scores all receive weak status', () => {
  const tied = [0.4, 0.8, 0.4, 0.9, 0.4, 0.7, 0.8];
  const weak = ToeicRadarChart.findWeakParts(tied);
  assert(weak.includes(1) && weak.includes(3) && weak.includes(5));
});

runTest('ToeicRadarChart.getVertices(): Zero masteries collapse to center without NaN', () => {
  const zero = [0, 0, 0, 0, 0, 0, 0];
  const vertices = ToeicRadarChart.getVertices(zero, 100, 100, 100);
  vertices.forEach(v => {
    assert.strictEqual(v.x, 100);
    assert.strictEqual(v.y, 100);
    assert(!isNaN(v.x) && !isNaN(v.y));
  });
});

runTest('ToeicRadarChart.generateSVG(): Formats valid SVG string with closed polygon points', () => {
  const svg = ToeicRadarChart.generateSVG([0.7, 0.8, 0.5, 0.6, 0.9, 0.65, 0.75]);
  assert(svg.includes('<svg'));
  assert(svg.includes('<polygon points='));
  assert(svg.includes('weak-vertex-pulse'));
  assert(!svg.includes('NaN'));
});

runTest('ToeicRadarChart.predictOverTarget(): Gaussian CDF predicts P(Score >= 650) accurately', () => {
  // Score 620, 30 days prep, 1.5 hr/day -> mu = 620 + 56.25 = 676.25 > 650
  const prob = ToeicRadarChart.predictOverTarget(620, 30, 1.5, 650);
  assert(prob >= 75 && prob <= 85, `Expected prob ${prob} to be between 75-85%`);
});

runTest('ToeicRadarChart.predictOverTarget(): Monotonically increases with current score', () => {
  const p1 = ToeicRadarChart.predictOverTarget(550, 20, 1.0, 650);
  const p2 = ToeicRadarChart.predictOverTarget(600, 20, 1.0, 650);
  const p3 = ToeicRadarChart.predictOverTarget(650, 20, 1.0, 650);
  assert(p1 < p2, `Expected ${p1} < ${p2}`);
  assert(p2 < p3, `Expected ${p2} < ${p3}`);
});

runTest('ToeicRadarChart.generateWeeklyReport(): Generates 7-day rolling report with streak & top part', () => {
  const logs = [
    { count: 20, correct: 16, part: 5, date: Date.now() - 86400000 },
    { count: 30, correct: 24, part: 2, date: Date.now() - 2 * 86400000 }
  ];
  const report = ToeicRadarChart.generateWeeklyReport(logs, { manualStreak: 5 });
  assert.strictEqual(report.questionsCount, 50);
  assert.strictEqual(report.accuracy, 80);
  assert.strictEqual(report.streak, 5);
  assert(report.message.includes('Streak 5'));
});

// =========================================================================
// 3. 10-MINUTE ADAPTIVE TEST ENGINE (FEATURE F14)
// =========================================================================
console.log('\n--- 3. Testing 10-Minute Adaptive Engine 2PL IRT (js/toeic-adaptive-engine.js) ---');
const ToeicAdaptiveEngine = require('./js/toeic-adaptive-engine.js');

runTest('ToeicAdaptiveEngine.probability(): 2PL IRT formula produces P(theta=0, b=0) = 0.625', () => {
  const p = ToeicAdaptiveEngine.probability(0.0, 0.0, 1.6, 0.25);
  assert(Math.abs(p - 0.625) < 0.001, `Expected 0.625, got ${p}`);
});

runTest('ToeicAdaptiveEngine.fisherInformation(): Maximizes information when difficulty matches ability', () => {
  const theta = 1.0;
  const infoMatch = ToeicAdaptiveEngine.fisherInformation(theta, 1.0, 1.6, 0.25);
  const infoFar = ToeicAdaptiveEngine.fisherInformation(theta, -2.0, 1.6, 0.25);
  assert(infoMatch > infoFar, `Expected infoMatch ${infoMatch} > infoFar ${infoFar}`);
});

runTest('ToeicAdaptiveEngine.thetaToScore(): Maps latent ability [-3, +3] to ETS Scaled Scores', () => {
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(-3.0), 62);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(0.0), 496);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(+3.0), 928);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(5.0), 990);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(-5.0), 10);
});

runTest('ToeicAdaptiveEngine: startTest() selects initial question and initializes 600s timer', () => {
  const engine = new ToeicAdaptiveEngine();
  const q1 = engine.startTest();
  assert(q1 !== null);
  assert(q1.id);
  assert(Array.isArray(q1.options));
  assert.strictEqual(q1.totalAnswered, 0);
  assert(engine.getTimeRemaining() <= 600 && engine.getTimeRemaining() >= 598);
});

runTest('ToeicAdaptiveEngine: submitAnswer() updates theta and standard error', () => {
  const engine = new ToeicAdaptiveEngine();
  const q1 = engine.startTest();
  const initialTheta = engine.theta;
  const res = engine.submitAnswer(q1.id, 1);
  assert.strictEqual(typeof res.theta, 'number');
  assert.notStrictEqual(engine.theta, initialTheta);
  assert(engine.standardError < 1.0);
});

runTest('ToeicAdaptiveEngine: Complete adaptive flow reaches termination and produces ETS score breakdown', () => {
  const engine = new ToeicAdaptiveEngine();
  let q = engine.startTest();
  for (let i = 0; i < 18; i++) {
    if (!q || engine.isFinished) break;
    const res = engine.submitAnswer(q.id, 1);
    q = res.nextQuestion;
  }
  const summary = engine.finishTest();
  assert(summary.totalScore >= 10 && summary.totalScore <= 990);
  assert(Array.isArray(summary.estimatedScore) && summary.estimatedScore.length === 2);
  assert(summary.listeningScore >= 5 && summary.listeningScore <= 495);
  assert(summary.readingScore >= 5 && summary.readingScore <= 495);
  assert.strictEqual(Object.keys(summary.partBreakdown).length, 7);
  assert(summary.probabilityOver650 >= 0 && summary.probabilityOver650 <= 100);
});

// =========================================================================
// 4. 12 TRAP CATEGORIES HEAT MATRIX (FEATURE F16)
// =========================================================================
console.log('\n--- 4. Testing 12 Trap Categories Heat Matrix (js/toeic-trap-heat-matrix.js) ---');
const ToeicTrapHeatMatrix = require('./js/toeic-trap-heat-matrix.js');

runTest('ToeicTrapHeatMatrix: 12 Canonical traps catalog loaded (8 L, 4 R)', () => {
  const catalog = ToeicTrapHeatMatrix.TRAP_CATEGORIES_CATALOG;
  assert.strictEqual(catalog.length, 12);
  assert.strictEqual(catalog[0].id, 'TRAP-01');
  assert.strictEqual(catalog[11].id, 'TRAP-12');
  assert.strictEqual(catalog.filter(t => t.section === 'listening').length, 8);
  assert.strictEqual(catalog.filter(t => t.section === 'reading').length, 4);
});

runTest('ToeicTrapHeatMatrix: Exponential decay weights recent mistakes heavier (7-day half-life)', () => {
  const inst = new ToeicTrapHeatMatrix();
  const w0 = inst.calcWeight(0);
  const w7 = inst.calcWeight(7);
  const w14 = inst.calcWeight(14);
  const w60 = inst.calcWeight(60);

  assert(Math.abs(w0 - 1.0) < 0.001);
  assert(Math.abs(w7 - 0.5) < 0.001);
  assert(Math.abs(w14 - 0.25) < 0.001);
  assert(w60 < 0.003, `Expected w60 < 0.003, got ${w60}`);
});

runTest('ToeicTrapHeatMatrix.getHeatTier(): Classifies correctly into Cold, Warm, Hot, Critical tiers', () => {
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(10).tier, 'COLD');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(30).tier, 'WARM');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(55).tier, 'HOT');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(85).tier, 'CRITICAL');
});

runTest('ToeicTrapHeatMatrix.recordAttempt(): Unknown trap ID rejected safely', () => {
  const inst = new ToeicTrapHeatMatrix();
  assert.strictEqual(inst.recordAttempt('TRAP-INVALID', false), false);
  assert.strictEqual(inst.recordAttempt('TRAP-01', true), true);
});

runTest('ToeicTrapHeatMatrix.filterByPart(): Filters traps by TOEIC Part', () => {
  const inst = new ToeicTrapHeatMatrix();
  const p3Traps = inst.filterByPart(3);
  assert.strictEqual(p3Traps.length, 1);
  assert.strictEqual(p3Traps[0].code, 'P3-REVERSAL');
});

// =========================================================================
// 5. INDEX.HTML INTEGRATION CHECK
// =========================================================================
console.log('\n--- 5. Testing index.html UI Integration ---');

runTest('index.html: Includes script tags for all 4 Milestone 2 modules', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(html.includes('src="/js/fsrs-v5-engine.js'), 'Must include fsrs-v5-engine.js');
  assert(html.includes('src="/js/toeic-radar-chart.js'), 'Must include toeic-radar-chart.js');
  assert(html.includes('src="/js/toeic-adaptive-engine.js'), 'Must include toeic-adaptive-engine.js');
  assert(html.includes('src="/js/toeic-trap-heat-matrix.js'), 'Must include toeic-trap-heat-matrix.js');
});

runTest('index.html: Contains UI modals and trigger points for M2 features', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  assert(html.includes('id="toeicAdaptiveTestModal"'), 'Must contain toeicAdaptiveTestModal');
  assert(html.includes('id="toeicTrapHeatMatrixModal"'), 'Must contain toeicTrapHeatMatrixModal');
  assert(html.includes('id="toeicRadarAnalyticsModal"'), 'Must contain toeicRadarAnalyticsModal');
  assert(html.includes('openAdaptiveTestModal'), 'Must expose openAdaptiveTestModal');
  assert(html.includes('openTrapHeatMatrixModal'), 'Must expose openTrapHeatMatrixModal');
  assert(html.includes('openRadarAnalyticsModal'), 'Must expose openRadarAnalyticsModal');
});

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
if (failedTests === 0) {
  console.log('🎉 ALL MILESTONE 2 TESTS PASSED PERFECTLY!');
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}
console.log('================================================================\n');
