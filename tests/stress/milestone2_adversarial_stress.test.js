/**
 * =========================================================================
 * MILESTONE 2 ADVERSARIAL STRESS TEST SUITE
 * =========================================================================
 * Comprehensive empirical challenge for TOEIC Master algorithms:
 * 1. FSRS v5 Spaced Repetition Engine:
 *    - 50,000 rapid reviews with extreme rating sequences (All Again, All Easy, Alternating)
 *    - Huge lapse gaps (1,000 days, 10,000 days, 1,000,000 days)
 *    - Corrupted/malicious card state sanitization
 * 2. 2PL IRT 10-Minute Adaptive Engine:
 *    - Extreme response vectors (All Correct, All Wrong, Alternating)
 *    - 10,000 simulated candidates across diverse ability spectrum [-4.0, +4.0]
 *    - Latent ability theta bounded within [-3.0, +3.0], ETS scores within [10, 990]
 *    - Mathematical edge cases (Infinite/boundary inputs)
 * 3. 7-Axis Competency Radar Chart Geometry & Score Predictor:
 *    - Boundary masteries: All zero, all 100%, negative inputs, sparse/missing parts
 *    - Vertex coordinate sanity and SVG generation without NaN
 *    - Gaussian Normal CDF prediction monotonicity and [0, 100] clamping
 *    - Weekly report generator with 0 to 10,000 logs
 * 4. 12 Trap Categories Heat Matrix:
 *    - 10,000 random error events across 365 days with exponential decay
 *    - Insufficient exposure rule (< 3 attempts -> 0%)
 *    - 4-Tier classification (Cold, Warm, Hot, Critical)
 *    - Unknown trap ID rejection resilience
 * =========================================================================
 */

'use strict';

const assert = require('assert');

// -------------------------------------------------------------------------
// Global Mock Environment for Node.js
// -------------------------------------------------------------------------
const mockStorageData = new Map();
global.localStorage = {
  getItem: (k) => mockStorageData.has(k) ? mockStorageData.get(k) : null,
  setItem: (k, v) => mockStorageData.set(k, String(v)),
  removeItem: (k) => mockStorageData.delete(k),
  clear: () => mockStorageData.clear()
};

// Import M2 Modules
const FSRS5Engine = require('../../js/fsrs-v5-engine.js');
const ToeicAdaptiveEngine = require('../../js/toeic-adaptive-engine.js');
const ToeicRadarChart = require('../../js/toeic-radar-chart.js');
const ToeicTrapHeatMatrix = require('../../js/toeic-trap-heat-matrix.js');

console.log('================================================================');
console.log('    MILESTONE 2 EMPIRICAL ADVERSARIAL STRESS TEST HARNESS       ');
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
    console.error(`    -> Error: ${err.message}`);
    if (err.stack) console.error(`    ${err.stack.split('\n').slice(1, 3).join('\n')}`);
  }
}

// =========================================================================
// SECTION 1: FSRS v5 NUMERICAL STABILITY UNDER EXTREME REVIEW SEQUENCES
// =========================================================================
console.log('--- SECTION 1: FSRS v5 Numerical Stability (50k Rapid Reviews & Extreme Gaps) ---');

runTest('FSRS5Engine: 50,000 rapid consecutive Again (grade 1) reviews maintain finite bounds', () => {
  const engine = new FSRS5Engine();
  let card = engine.initCard('stress_again_50k');
  
  for (let i = 0; i < 50000; i++) {
    card = engine.rateCard(card, 1, 0.001); // rapid review within seconds
    
    assert.strictEqual(Number.isNaN(card.stability), false, `Stability is NaN at iter ${i}`);
    assert.strictEqual(Number.isFinite(card.stability), true, `Stability is not finite at iter ${i}`);
    assert.ok(card.stability >= 0.1, `Stability dropped below 0.1: ${card.stability}`);
    assert.ok(card.difficulty >= 1.0 && card.difficulty <= 10.0, `Difficulty out of range at iter ${i}: ${card.difficulty}`);
    assert.ok(card.intervalDays >= 1, `Interval should be >= 1 day`);
    assert.ok(card.lapses === i + 1, `Lapses counter mismatch`);
  }
  
  assert.strictEqual(card.difficulty, 10.0, `Final difficulty should clamp to 10.0`);
  assert.strictEqual(card.stability, 0.1, `Final stability should floor at 0.1`);
  assert.strictEqual(card.reps, 50000);
  assert.strictEqual(card.lapses, 50000);
});

runTest('FSRS5Engine: 50,000 rapid consecutive Easy (grade 4) reviews do not overflow to NaN or negative intervals', () => {
  const engine = new FSRS5Engine();
  let card = engine.initCard('stress_easy_50k');
  
  for (let i = 0; i < 50000; i++) {
    card = engine.rateCard(card, 4, 0.001);
    
    assert.strictEqual(Number.isNaN(card.stability), false, `Stability is NaN at iter ${i}`);
    assert.strictEqual(Number.isFinite(card.stability), true, `Stability is not finite at iter ${i}`);
    assert.ok(card.stability > 0, `Stability non-positive: ${card.stability}`);
    assert.ok(card.difficulty >= 1.0 && card.difficulty <= 10.0, `Difficulty out of range at iter ${i}: ${card.difficulty}`);
    assert.ok(card.intervalDays >= 1, `Interval should be >= 1 day`);
  }
  
  assert.strictEqual(card.difficulty, 1.0, `Final difficulty should clamp to 1.0`);
  assert.ok(card.stability > 1000, `Stability should expand with Easy ratings: ${card.stability}`);
  assert.strictEqual(card.reps, 50000);
  assert.strictEqual(card.lapses, 0);
});

runTest('FSRS5Engine: 50,000 alternating rating reviews (1, 2, 3, 4) cycle smoothly', () => {
  const engine = new FSRS5Engine();
  let card = engine.initCard('stress_alt_50k');
  
  for (let i = 0; i < 50000; i++) {
    const grade = (i % 4) + 1; // 1, 2, 3, 4
    card = engine.rateCard(card, grade, 1.0);
    
    assert.strictEqual(Number.isNaN(card.stability), false, `NaN stability at iter ${i}`);
    assert.strictEqual(Number.isFinite(card.stability), true, `Infinite stability at iter ${i}`);
    assert.ok(card.stability >= 0.1, `Stability below 0.1 at iter ${i}`);
    assert.ok(card.difficulty >= 1.0 && card.difficulty <= 10.0, `Difficulty out of [1, 10]: ${card.difficulty}`);
    assert.ok(card.intervalDays >= 1, `Negative/zero interval at iter ${i}`);
  }
  
  assert.strictEqual(card.reps, 50000);
  assert.strictEqual(card.lapses, 12500); // 50000 / 4
});

runTest('FSRS5Engine: Astronomical lapse gaps (1,000 days to 1,000,000 days) evaluate safely', () => {
  const engine = new FSRS5Engine();
  const card = engine.initCard('stress_astronomical_gap');
  
  const extremeDays = [1000, 5000, 10000, 50000, 365000, 1000000];
  
  extremeDays.forEach(days => {
    // Retrievability direct call
    const R = engine.retrievability(days, card.stability);
    assert.strictEqual(Number.isNaN(R), false, `R is NaN for ${days} days`);
    assert.strictEqual(Number.isFinite(R), true, `R is not finite for ${days} days`);
    assert.ok(R >= 0.0001 && R <= 1.0, `R out of bounds [0.0001, 1.0]: ${R}`);
    
    // Rating after lapse
    const lapsed = engine.rateCard(card, 1, days);
    assert.strictEqual(Number.isNaN(lapsed.stability), false, `Lapse stability NaN for ${days} days`);
    assert.strictEqual(Number.isFinite(lapsed.stability), true, `Lapse stability infinite for ${days} days`);
    assert.ok(lapsed.stability >= 0.1, `Lapse stability < 0.1`);
    assert.ok(lapsed.intervalDays >= 1, `Lapse interval < 1`);
    
    // Rating with success after long gap
    const recalled = engine.rateCard(card, 3, days);
    assert.strictEqual(Number.isNaN(recalled.stability), false, `Recall stability NaN for ${days} days`);
    assert.strictEqual(Number.isFinite(recalled.stability), true, `Recall stability infinite for ${days} days`);
    assert.ok(recalled.stability >= 0.1);
    assert.ok(recalled.intervalDays >= 1);
  });
});

runTest('FSRS5Engine: Corrupted / adversarial input sanitization', () => {
  const engine = new FSRS5Engine();
  
  const adversarialCards = [
    null,
    undefined,
    {},
    { cardId: null, difficulty: NaN, stability: Infinity },
    { cardId: 12345, difficulty: -50, stability: -100, lapses: -5 },
    { cardId: 'corrupted', difficulty: 9999, stability: 'invalid', reps: 'ten' }
  ];
  
  adversarialCards.forEach((badCard, idx) => {
    const sanitized = engine.sanitizeCard(badCard);
    assert.ok(sanitized.cardId !== null && sanitized.cardId !== undefined);
    assert.ok(['string', 'number'].includes(typeof sanitized.cardId));
    assert.ok(sanitized.difficulty >= 1.0 && sanitized.difficulty <= 10.0, `Bad D at ${idx}: ${sanitized.difficulty}`);
    assert.ok(sanitized.stability >= 0.1, `Bad S at ${idx}: ${sanitized.stability}`);
    assert.ok(sanitized.intervalDays >= 1, `Bad interval at ${idx}: ${sanitized.intervalDays}`);
    assert.ok(sanitized.reps >= 0, `Bad reps at ${idx}`);
    assert.ok(sanitized.lapses >= 0, `Bad lapses at ${idx}`);
    
    // Test that rateCard also succeeds on sanitized card
    const rated = engine.rateCard(badCard, 'invalid_grade');
    assert.ok(rated && typeof rated === 'object');
    assert.strictEqual(Number.isNaN(rated.stability), false);
    assert.strictEqual(Number.isNaN(rated.intervalDays), false);
  });
});

// =========================================================================
// SECTION 2: 2PL IRT CONVERGENCE UNDER EXTREME VECTORS & 10,000 CANDIDATES
// =========================================================================
console.log('\n--- SECTION 2: 2PL IRT Convergence & 10,000 Simulated Candidates ---');

runTest('ToeicAdaptiveEngine: Extreme Response Vector — All Correct (18 items)', () => {
  const engine = new ToeicAdaptiveEngine();
  let currentQ = engine.startTest();
  
  while (!engine.isFinished && currentQ) {
    const qObj = engine.pool.find(it => it.id === currentQ.id);
    const res = engine.submitAnswer(currentQ.id, qObj.ans);
    currentQ = res.nextQuestion;
  }
  
  const results = engine.finishTest();
  assert.strictEqual(engine.isFinished, true);
  assert.ok(results.administeredCount >= 14, `Administered count should be >= 14, got ${results.administeredCount}`);
  assert.strictEqual(Number.isNaN(results.theta), false);
  assert.strictEqual(Number.isFinite(results.theta), true);
  assert.ok(results.theta > 1.0, `All correct theta should be positive high: ${results.theta}`);
  assert.ok(results.theta <= 3.0, `Theta clamped at 3.0`);
  assert.ok(results.totalScore >= 700 && results.totalScore <= 990, `Total score in [700, 990]: ${results.totalScore}`);
  assert.ok(results.estimatedScore[0] >= 10 && results.estimatedScore[1] <= 990);
  assert.ok(results.estimatedScore[0] <= results.estimatedScore[1]);
  assert.strictEqual(results.listeningScore, 495);
  assert.strictEqual(results.readingScore, 495);
});

runTest('ToeicAdaptiveEngine: Extreme Response Vector — All Wrong (18 items)', () => {
  const engine = new ToeicAdaptiveEngine();
  let currentQ = engine.startTest();
  
  while (!engine.isFinished && currentQ) {
    const qObj = engine.pool.find(it => it.id === currentQ.id);
    const wrongChoice = (qObj.ans + 1) % qObj.options.length;
    const res = engine.submitAnswer(currentQ.id, wrongChoice);
    currentQ = res.nextQuestion;
  }
  
  const results = engine.finishTest();
  assert.strictEqual(engine.isFinished, true);
  assert.ok(results.administeredCount >= 14);
  assert.strictEqual(Number.isNaN(results.theta), false);
  assert.strictEqual(Number.isFinite(results.theta), true);
  assert.ok(results.theta < -1.0, `All wrong theta should be negative low: ${results.theta}`);
  assert.ok(results.theta >= -3.0, `Theta clamped at -3.0`);
  assert.ok(results.totalScore >= 10 && results.totalScore <= 300, `Total score in [10, 300]: ${results.totalScore}`);
  assert.ok(results.estimatedScore[0] >= 10 && results.estimatedScore[1] <= 990);
  assert.ok(results.estimatedScore[0] <= results.estimatedScore[1]);
});

runTest('ToeicAdaptiveEngine: 10,000 Simulated Candidates across ability spectrum [-4.0, +4.0]', () => {
  const numCandidates = 10000;
  let invalidThetaCount = 0;
  let invalidScoreCount = 0;
  let nonTerminatedCount = 0;
  let invalidConfidenceIntervals = 0;
  let invalidPartBreakdowns = 0;

  for (let c = 0; c < numCandidates; c++) {
    const engine = new ToeicAdaptiveEngine();
    let currentQ = engine.startTest();
    
    // Sample true latent ability uniformly in [-3.5, +3.5]
    const trueTheta = -3.5 + Math.random() * 7.0;
    let safetySteps = 0;

    while (!engine.isFinished && currentQ && safetySteps < 25) {
      safetySteps++;
      const fullQ = engine.pool.find(it => it.id === currentQ.id);
      
      // Calculate true probability of correct answer under 2PL IRT model
      const pCorrect = ToeicAdaptiveEngine.probability(trueTheta, fullQ.b, fullQ.a, fullQ.c);
      const isCorrect = Math.random() < pCorrect;
      const choice = isCorrect ? fullQ.ans : (fullQ.ans + 1) % fullQ.options.length;
      
      const stepRes = engine.submitAnswer(currentQ.id, choice);
      currentQ = stepRes.nextQuestion;
    }

    if (!engine.isFinished) {
      nonTerminatedCount++;
    }

    const report = engine.finishTest();

    // Verify theta properties
    if (typeof report.theta !== 'number' || Number.isNaN(report.theta) || !Number.isFinite(report.theta) || report.theta < -3.0 || report.theta > 3.0) {
      invalidThetaCount++;
    }

    // Verify ETS Scaled Score bounds [10, 990]
    if (report.totalScore < 10 || report.totalScore > 990 || Number.isNaN(report.totalScore)) {
      invalidScoreCount++;
    }

    // Verify 95% Confidence Interval bounds [scoreMin, scoreMax]
    const [minS, maxS] = report.estimatedScore;
    if (minS < 10 || maxS > 990 || minS > maxS || Number.isNaN(minS) || Number.isNaN(maxS)) {
      invalidConfidenceIntervals++;
    }

    // Verify Part Breakdown (Parts 1–7)
    for (let p = 1; p <= 7; p++) {
      const partAcc = report.partBreakdown[p];
      if (typeof partAcc !== 'number' || Number.isNaN(partAcc) || partAcc < 0.0 || partAcc > 1.0) {
        invalidPartBreakdowns++;
      }
    }
  }

  assert.strictEqual(nonTerminatedCount, 0, `Candidates failed to terminate: ${nonTerminatedCount}`);
  assert.strictEqual(invalidThetaCount, 0, `Invalid theta count: ${invalidThetaCount}`);
  assert.strictEqual(invalidScoreCount, 0, `Invalid score count: ${invalidScoreCount}`);
  assert.strictEqual(invalidConfidenceIntervals, 0, `Invalid confidence intervals: ${invalidConfidenceIntervals}`);
  assert.strictEqual(invalidPartBreakdowns, 0, `Invalid part breakdowns: ${invalidPartBreakdowns}`);
});

runTest('ToeicAdaptiveEngine: Mathematical edge cases and asymptotes in IRT functions', () => {
  // thetaToScore bounds
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(Infinity), 990);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(5.0), 990);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(-Infinity), 10);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(-5.0), 10);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(NaN), 496); // theta = 0 fallback
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(undefined), 496);

  // probability bounds with default parameters
  const pInf = ToeicAdaptiveEngine.probability(Infinity, 0);
  assert.ok(pInf >= 0.25 && pInf <= 1.0);
  const pNegInf = ToeicAdaptiveEngine.probability(-Infinity, 0);
  assert.ok(pNegInf >= 0.25 && pNegInf <= 1.0);
  const pNaN = ToeicAdaptiveEngine.probability(NaN, NaN);
  assert.ok(!Number.isNaN(pNaN) && pNaN >= 0.0 && pNaN <= 1.0);

  // Fisher information bounds
  const infoZero = ToeicAdaptiveEngine.fisherInformation(0, 0);
  assert.ok(!Number.isNaN(infoZero) && Number.isFinite(infoZero) && infoZero > 0.0);
  const infoInf = ToeicAdaptiveEngine.fisherInformation(Infinity, 0);
  assert.ok(!Number.isNaN(infoInf) && Number.isFinite(infoInf) && infoInf >= 0.0);
});

// =========================================================================
// SECTION 3: 7-AXIS RADAR GEOMETRY & SCORE PREDICTOR STRESS TESTING
// =========================================================================
console.log('\n--- SECTION 3: 7-Axis Radar Geometry & Gaussian Score Predictor ---');

runTest('ToeicRadarChart: All Zero scores [0,0,0,0,0,0,0] geometry and weak parts', () => {
  const masteries = [0, 0, 0, 0, 0, 0, 0];
  const vertices = ToeicRadarChart.getVertices(masteries, 120, 150, 150);
  
  assert.strictEqual(vertices.length, 7);
  vertices.forEach(v => {
    assert.strictEqual(v.x, 150, `Vertex x should collapse to cx (150)`);
    assert.strictEqual(v.y, 150, `Vertex y should collapse to cy (150)`);
    assert.strictEqual(v.mastery, 0.0);
    assert.strictEqual(v.isWeak, true, `All zero parts should be weak`);
  });

  const weakParts = ToeicRadarChart.findWeakParts(masteries);
  assert.strictEqual(weakParts.length, 7, `All 7 parts must be flagged weak`);

  const svg = ToeicRadarChart.generateSVG(masteries);
  assert.strictEqual(svg.includes('NaN'), false, `SVG contains NaN`);
  assert.ok(svg.includes('<polygon points="150,150 150,150 150,150 150,150 150,150 150,150 150,150"'));
});

runTest('ToeicRadarChart: All 100% scores [1,1,1,1,1,1,1] and percentage format [100,100,...]', () => {
  const formats = [
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    [100, 100, 100, 100, 100, 100, 100],
    { 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0, 6: 1.0, 7: 1.0 }
  ];

  formats.forEach((fmt, idx) => {
    const vertices = ToeicRadarChart.getVertices(fmt, 120, 150, 150);
    assert.strictEqual(vertices.length, 7);
    vertices.forEach(v => {
      assert.strictEqual(Number.isNaN(v.x), false);
      assert.strictEqual(Number.isNaN(v.y), false);
      assert.strictEqual(v.mastery, 1.0);
    });

    const svg = ToeicRadarChart.generateSVG(fmt);
    assert.strictEqual(svg.includes('NaN'), false, `Format ${idx} SVG has NaN`);
  });
});

runTest('ToeicRadarChart: Negative and out-of-range inputs clamped safely', () => {
  const extremeMasteries = [-999, -50, -0.01, 150, 500, NaN, Infinity];
  const normalized = ToeicRadarChart.normalizeMasteries(extremeMasteries);
  
  assert.strictEqual(normalized.length, 7);
  assert.strictEqual(normalized[0], 0.0); // -999 -> clamped 0.0
  assert.strictEqual(normalized[1], 0.0); // -50 -> clamped 0.0
  assert.strictEqual(normalized[2], 0.0); // -0.01 -> clamped 0.0
  assert.strictEqual(normalized[3], 1.0); // 150 / 100 = 1.5 -> clamped 1.0
  assert.strictEqual(normalized[4], 1.0); // 500 / 100 = 5.0 -> clamped 1.0
  assert.strictEqual(normalized[5], 0.0); // NaN -> 0.0
  assert.strictEqual(normalized[6], 0.0); // Infinity -> 0.0

  const vertices = ToeicRadarChart.getVertices(extremeMasteries);
  vertices.forEach(v => {
    assert.strictEqual(Number.isNaN(v.x), false);
    assert.strictEqual(Number.isNaN(v.y), false);
    assert.strictEqual(Number.isFinite(v.x), true);
    assert.strictEqual(Number.isFinite(v.y), true);
  });
});

runTest('ToeicRadarChart: Missing and sparse parts handling', () => {
  const sparseInputs = [
    {},
    null,
    undefined,
    { 2: 0.85, 5: 0.65 }, // only P2 and P5 present
    [0.9] // only 1 element in array
  ];

  sparseInputs.forEach(input => {
    const vertices = ToeicRadarChart.getVertices(input);
    assert.strictEqual(vertices.length, 7);
    vertices.forEach(v => {
      assert.ok(!Number.isNaN(v.x) && !Number.isNaN(v.y));
      assert.ok(v.mastery >= 0.0 && v.mastery <= 1.0);
    });
    const svg = ToeicRadarChart.generateSVG(input);
    assert.strictEqual(svg.includes('NaN'), false);
  });
});

runTest('ToeicRadarChart: Gaussian Normal CDF score predictor monotonicity & edge bounds', () => {
  // Edge targets
  assert.strictEqual(ToeicRadarChart.predictOverTarget(10, 0, 0, 990), 0);
  assert.strictEqual(ToeicRadarChart.predictOverTarget(990, 30, 2, 10), 100);

  // Monotonicity check across scores 100 to 950
  let prevProb = -1;
  for (let score = 100; score <= 950; score += 50) {
    const prob = ToeicRadarChart.predictOverTarget(score, 30, 1.5, 650);
    assert.ok(prob >= 0 && prob <= 100, `Probability out of [0, 100]: ${prob}`);
    assert.ok(prob >= prevProb, `Probability failed monotonicity at score ${score}: ${prob} < ${prevProb}`);
    prevProb = prob;
  }

  // Extreme parameters
  assert.strictEqual(ToeicRadarChart.predictOverTarget(-100, -10, -5, -500), 100); // clamped validly
  assert.strictEqual(ToeicRadarChart.predictOverTarget(NaN, NaN, NaN, NaN), 0);
});

runTest('ToeicRadarChart: Weekly progress report generator with 10,000 log records', () => {
  const now = Date.now();
  const logs = [];
  
  for (let i = 0; i < 10000; i++) {
    const daysAgo = Math.random() * 14; // half inside 7-day window, half outside
    const isCorrect = (i % 2 === 0);
    logs.push({
      timestamp: now - daysAgo * 86400000,
      part: (i % 7) + 1,
      questionsCount: 1,
      correctCount: isCorrect ? 1 : 0,
      trapCategory: 'TRAP-0' + ((i % 6) + 1)
    });
  }

  const report = ToeicRadarChart.generateWeeklyReport(logs);
  assert.strictEqual(report.isEmpty, false);
  assert.ok(report.questionsCount > 0 && report.questionsCount < 10000);
  assert.ok(report.accuracy >= 45 && report.accuracy <= 55);
  assert.ok(report.streak >= 0 && report.streak <= 30);
  assert.ok(report.estimatedScore >= 10 && report.estimatedScore <= 990);
  assert.ok(report.bestPart >= 1 && report.bestPart <= 7);
  assert.ok(report.worstPart >= 1 && report.worstPart <= 7);
  assert.ok(typeof report.message === 'string' && report.message.length > 0);
});

// =========================================================================
// SECTION 4: 12 TRAP CATEGORIES HEAT MATRIX 10,000 EVENT STRESS TESTING
// =========================================================================
console.log('\n--- SECTION 4: 12 Trap Categories Heat Matrix (10,000 Events & Time-Decay) ---');

runTest('ToeicTrapHeatMatrix: 10,000 events across 365 days with exponential time-decay', () => {
  const engine = new ToeicTrapHeatMatrix('stress_matrix_10k');
  const now = Date.now();
  const records = [];

  // Generate 10,000 events:
  // Part 1-2 traps (TRAP-01 to TRAP-05): 90% error rate
  // Part 3-4 traps (TRAP-06 to TRAP-08): 50% error rate
  // Part 5-7 traps (TRAP-09 to TRAP-12): 10% error rate
  for (let i = 0; i < 10000; i++) {
    const trapNum = (i % 12) + 1;
    const trapId = 'TRAP-' + (trapNum < 10 ? '0' + trapNum : trapNum);
    const daysAgo = Math.random() * 365;
    const ts = now - daysAgo * 86400000;

    let isWrong = false;
    if (trapNum <= 5) {
      isWrong = (i % 10 < 9); // 90% error
    } else if (trapNum <= 8) {
      isWrong = (i % 10 < 5); // 50% error
    } else {
      isWrong = (i % 10 < 1); // 10% error
    }

    records.push({ trapId, isCorrect: !isWrong, timestamp: ts });
  }

  engine.saveRecords(records);
  const matrix = engine.getMatrixData(now);

  assert.strictEqual(matrix.length, 12, `Matrix must have exactly 12 canonical cells`);

  matrix.forEach(cell => {
    assert.strictEqual(Number.isNaN(cell.heat), false, `Heat is NaN in ${cell.trapId}`);
    assert.strictEqual(Number.isFinite(cell.heat), true, `Heat is infinite in ${cell.trapId}`);
    assert.ok(cell.heat >= 0 && cell.heat <= 100, `Heat out of [0, 100]: ${cell.heat}`);
    assert.ok(cell.totalAttempts > 700, `Total attempts should be ~833, got ${cell.totalAttempts}`);
    assert.strictEqual(Number.isNaN(cell.weightedTotal), false);
    assert.strictEqual(Number.isNaN(cell.weightedErrors), false);
    assert.ok(cell.weightedTotal >= cell.weightedErrors);
    assert.ok(['COLD', 'WARM', 'HOT', 'CRITICAL'].includes(cell.tier));
  });

  // Verify that high-error traps (1-5) have higher heat than low-error traps (9-12)
  const highErrorAvgHeat = (matrix[0].heat + matrix[1].heat + matrix[2].heat + matrix[3].heat + matrix[4].heat) / 5;
  const lowErrorAvgHeat = (matrix[8].heat + matrix[9].heat + matrix[10].heat + matrix[11].heat) / 4;
  assert.ok(highErrorAvgHeat > 70, `High error traps heat should be > 70%, got ${highErrorAvgHeat}%`);
  assert.ok(lowErrorAvgHeat < 30, `Low error traps heat should be < 30%, got ${lowErrorAvgHeat}%`);
});

runTest('ToeicTrapHeatMatrix: Insufficient exposure rule (< 3 attempts) enforces 0% and CHƯA_GHI_NHẬN', () => {
  const engine = new ToeicTrapHeatMatrix('stress_matrix_insufficient');
  engine.clearRecords();

  // Record exactly 2 wrong attempts on TRAP-01 (100% wrong, but total < 3)
  engine.recordAttempt('TRAP-01', false);
  engine.recordAttempt('TRAP-01', false);

  const matrix = engine.getMatrixData();
  const trap1 = matrix.find(c => c.trapId === 'TRAP-01');

  assert.strictEqual(trap1.totalAttempts, 2);
  assert.strictEqual(trap1.wrongAttempts, 2);
  assert.strictEqual(trap1.heat, 0, `Heat must remain 0% when total attempts < 3`);
  assert.strictEqual(trap1.status, 'THIẾU_DỮ_LIỆU');
  assert.strictEqual(trap1.tier, 'COLD');

  // Record 3rd attempt: exposure threshold met, heat activates
  engine.recordAttempt('TRAP-01', false);
  const updatedMatrix = engine.getMatrixData();
  const updatedTrap1 = updatedMatrix.find(c => c.trapId === 'TRAP-01');
  
  assert.strictEqual(updatedTrap1.totalAttempts, 3);
  assert.strictEqual(updatedTrap1.wrongAttempts, 3);
  assert.strictEqual(updatedTrap1.heat, 100);
  assert.strictEqual(updatedTrap1.status, 'GHI_NHẬN');
  assert.strictEqual(updatedTrap1.tier, 'CRITICAL');
});

runTest('ToeicTrapHeatMatrix: 4-Tier classification boundary conditions', () => {
  const testTiers = [
    { heat: 0, expected: 'COLD' },
    { heat: 19, expected: 'COLD' },
    { heat: 20, expected: 'WARM' },
    { heat: 44, expected: 'WARM' },
    { heat: 45, expected: 'HOT' },
    { heat: 69, expected: 'HOT' },
    { heat: 70, expected: 'CRITICAL' },
    { heat: 100, expected: 'CRITICAL' }
  ];

  testTiers.forEach(({ heat, expected }) => {
    const tier = ToeicTrapHeatMatrix.getHeatTier(heat);
    assert.strictEqual(tier.tier, expected, `Heat ${heat}% should map to ${expected}, got ${tier.tier}`);
    assert.ok(typeof tier.name === 'string');
    assert.ok(typeof tier.cssClass === 'string');
  });
});

runTest('ToeicTrapHeatMatrix: 1,000 malicious / unknown trap IDs rejected cleanly', () => {
  const engine = new ToeicTrapHeatMatrix('stress_matrix_rejection');
  engine.clearRecords();

  let rejectedCount = 0;
  for (let i = 0; i < 1000; i++) {
    const success = engine.recordAttempt('INVALID_TRAP_' + i, false);
    if (!success) rejectedCount++;
  }

  assert.strictEqual(rejectedCount, 1000, `All 1,000 invalid trap IDs must be rejected`);
  const records = engine.getStoredRecords();
  assert.strictEqual(records.length, 0, `No invalid records should have been stored`);
});

// =========================================================================
// SUMMARY
// =========================================================================
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
if (failedTests === 0) {
  console.log('🎉 ALL MILESTONE 2 ADVERSARIAL STRESS TESTS PASSED EMPIRICALLY!');
} else {
  console.error(`⚠️ ${failedTests} STRESS TESTS FAILED!`);
}
console.log('================================================================\n');

process.exit(failedTests > 0 ? 1 : 0);
