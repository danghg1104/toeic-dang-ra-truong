/**
 * Empirical Adversarial Challenger Test Harness for Milestone 2
 * Author: challenger_m2_2 (teamwork_challenger)
 * 
 * Adversarially challenges boundary conditions for:
 * 1. Adaptive Test abandonment (0 answers, midway abandonment, null calls)
 * 2. 12-Trap Heat Matrix zero-division resilience (0 attempts, 0 errors with >=3 attempts)
 * 3. 7-Axis ToeicRadarChart handling of single-part or missing keys in partScores
 * 4. FSRS v5 interval rounding with 0 elapsed days or negative time deltas
 */

const assert = require('assert');
const FSRS5Engine = require('../js/fsrs-v5-engine');
const ToeicRadarChart = require('../js/toeic-radar-chart');
const ToeicAdaptiveEngine = require('../js/toeic-adaptive-engine');
const ToeicTrapHeatMatrix = require('../js/toeic-trap-heat-matrix');

// Lightweight DOM Mock for testing render methods in node
function createMockElement(id = 'mock-container') {
  return {
    id,
    innerHTML: '',
    classList: {
      _classes: new Set(),
      add(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
      contains(c) { return this._classes.has(c); }
    },
    querySelectorAll(selector) {
      // Mock simple selector query for .trap-matrix-cell and [data-part]
      return [];
    },
    addEventListener() {}
  };
}

let passed = 0;
let failed = 0;
const failures = [];

function challenge(title, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ [PASS] ${title}`);
  } catch (err) {
    failed++;
    failures.push({ title, error: err });
    console.error(`  ✗ [FAIL] ${title}`);
    console.error(`    ${err.stack || err.message}`);
  }
}

console.log('================================================================');
console.log('  CHALLENGER M2: ADVERSARIAL BOUNDARY & STRESS SUITE (4 DOMAINS)  ');
console.log('================================================================\n');

// =============================================================================
// DOMAIN 1: ADAPTIVE TEST ENGINE ABANDONMENT & EMPTY SESSIONS
// =============================================================================
console.log('--- Domain 1: Adaptive Test Abandonment & Empty Responses ---');

challenge('1.1 User starts test and immediately abandons with 0 answers (finishTest called directly)', () => {
  const engine = new ToeicAdaptiveEngine();
  const q1 = engine.startTest();
  assert(q1 !== null, 'Initial question should be selected');
  assert.strictEqual(engine.administered.length, 0, 'No questions answered');

  const results = engine.finishTest();
  assert(results !== null, 'finishTest must return results object');
  assert(!isNaN(results.totalScore), 'totalScore must not be NaN');
  assert(results.totalScore >= 10 && results.totalScore <= 990, `Score out of bounds: ${results.totalScore}`);
  assert(!isNaN(results.listeningScore), 'listeningScore must not be NaN');
  assert(!isNaN(results.readingScore), 'readingScore must not be NaN');
  assert(results.listeningScore >= 5 && results.listeningScore <= 495);
  assert(results.readingScore >= 5 && results.readingScore <= 495);
  assert.strictEqual(results.administeredCount, 0);

  // Confidence interval check
  assert(Array.isArray(results.estimatedScore) && results.estimatedScore.length === 2);
  assert(!isNaN(results.estimatedScore[0]) && !isNaN(results.estimatedScore[1]));
  assert(results.estimatedScore[0] <= results.estimatedScore[1]);

  // Part breakdown check: all 7 parts must exist and be valid numbers in [0, 1]
  assert(results.partBreakdown && typeof results.partBreakdown === 'object');
  for (let p = 1; p <= 7; p++) {
    const val = results.partBreakdown[p];
    assert(val !== undefined, `Missing part ${p} breakdown`);
    assert(!isNaN(val), `Part ${p} is NaN`);
    assert(val >= 0.0 && val <= 1.0, `Part ${p} out of bounds: ${val}`);
  }

  // Gaussian prediction probability over 650
  assert(!isNaN(results.probabilityOver650));
  assert(results.probabilityOver650 >= 0 && results.probabilityOver650 <= 100);
});

challenge('1.2 finishTest called directly on fresh engine WITHOUT startTest()', () => {
  const engine = new ToeicAdaptiveEngine();
  const results = engine.finishTest();
  assert(results !== null);
  assert(!isNaN(results.totalScore));
  assert.strictEqual(results.administeredCount, 0);
  assert(results.totalScore >= 10 && results.totalScore <= 990);
  assert(Object.keys(results.partBreakdown).length === 7);
});

challenge('1.3 User abandons test midway after answering only 1 question (correct)', () => {
  const engine = new ToeicAdaptiveEngine();
  const q1 = engine.startTest();
  const res1 = engine.submitAnswer(q1.id, engine.currentQuestion.ans); // correct
  assert.strictEqual(res1.isCorrect, true);
  assert.strictEqual(engine.administered.length, 1);

  // User abandons here
  const results = engine.finishTest();
  assert.strictEqual(results.administeredCount, 1);
  assert(!isNaN(results.totalScore));
  assert(!isNaN(results.listeningScore));
  assert(!isNaN(results.readingScore));
  for (let p = 1; p <= 7; p++) {
    assert(!isNaN(results.partBreakdown[p]));
  }
});

challenge('1.4 User answers only listening questions (Parts 1-4) then abandons (0 reading items)', () => {
  const engine = new ToeicAdaptiveEngine();
  engine.startTest();

  // Force administer 3 listening questions
  const lQuestions = engine.pool.filter(q => q.part <= 4).slice(0, 3);
  lQuestions.forEach(q => {
    engine.currentQuestion = q;
    engine.submitAnswer(q.id, q.ans);
  });

  const results = engine.finishTest();
  assert.strictEqual(results.administeredCount, 3);
  // Reading accuracy should fall back cleanly to 0.5 without division by zero
  assert(!isNaN(results.readingScore));
  assert(results.readingScore >= 5 && results.readingScore <= 495);
  // Parts 5, 6, 7 must be finite
  assert(!isNaN(results.partBreakdown[5]));
  assert(!isNaN(results.partBreakdown[6]));
  assert(!isNaN(results.partBreakdown[7]));
});

challenge('1.5 Calling submitAnswer() after test is already marked finished returns results gracefully', () => {
  const engine = new ToeicAdaptiveEngine();
  const q1 = engine.startTest();
  engine.isFinished = true; // force finished
  const res = engine.submitAnswer(q1.id, 0);
  assert.strictEqual(res.isFinished, true);
  assert(res.results !== undefined);
  assert(!isNaN(res.results.totalScore));
});

challenge('1.6 Extreme latent ability values clamped properly without NaN', () => {
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(-999), 10);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(999), 990);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(NaN), 496);
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(undefined), 496);

  const pLow = ToeicAdaptiveEngine.probability(-5.0, 5.0);
  const pHigh = ToeicAdaptiveEngine.probability(5.0, -5.0);
  assert(!isNaN(pLow) && isFinite(pLow) && pLow >= 0.25);
  assert(!isNaN(pHigh) && isFinite(pHigh) && pHigh <= 1.0);

  const infoLow = ToeicAdaptiveEngine.fisherInformation(-5.0, 5.0);
  const infoHigh = ToeicAdaptiveEngine.fisherInformation(5.0, -5.0);
  assert(!isNaN(infoLow) && isFinite(infoLow) && infoLow >= 0.0);
  assert(!isNaN(infoHigh) && isFinite(infoHigh) && infoHigh >= 0.0);
});

// =============================================================================
// DOMAIN 2: 12-TRAP HEAT MATRIX DIVISION BY ZERO & 0 ERRORS LOGGED
// =============================================================================
console.log('\n--- Domain 2: 12-Trap Heat Matrix Zero-Division & 0 Errors ---');

// Mock localStorage for node environment
const memoryStorage = {};
global.localStorage = {
  getItem: (key) => memoryStorage[key] || null,
  setItem: (key, val) => { memoryStorage[key] = String(val); },
  removeItem: (key) => { delete memoryStorage[key]; },
  clear: () => { Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]); }
};

challenge('2.1 Candidate has 0 attempts logged across all 12 traps (fresh profile)', () => {
  localStorage.clear();
  const matrix = new ToeicTrapHeatMatrix('test_zero_attempts');
  const data = matrix.getMatrixData();

  assert.strictEqual(data.length, 12, 'Must return all 12 canonical trap items');
  data.forEach(cell => {
    assert.strictEqual(cell.totalAttempts, 0);
    assert.strictEqual(cell.wrongAttempts, 0);
    assert.strictEqual(cell.weightedTotal, 0);
    assert.strictEqual(cell.weightedErrors, 0);
    assert.strictEqual(cell.heat, 0);
    assert(!isNaN(cell.heat), `Heat must not be NaN for trap ${cell.trapId}`);
    assert.strictEqual(cell.status, 'CHƯA_GHI_NHẬN');
    assert.strictEqual(cell.tier, 'COLD');
    assert(cell.cssClass.includes('emerald'));
  });
});

challenge('2.2 Candidate has 1 or 2 attempts (insufficient exposure) with 0 errors', () => {
  localStorage.clear();
  const matrix = new ToeicTrapHeatMatrix('test_insufficient_exp');
  matrix.recordAttempt('TRAP-01', true); // 1 correct attempt
  matrix.recordAttempt('TRAP-01', true); // 2 correct attempts

  const data = matrix.getMatrixData();
  const trap1 = data.find(c => c.trapId === 'TRAP-01');
  assert.strictEqual(trap1.totalAttempts, 2);
  assert.strictEqual(trap1.wrongAttempts, 0);
  assert.strictEqual(trap1.heat, 0);
  assert(!isNaN(trap1.heat));
  assert.strictEqual(trap1.status, 'THIẾU_DỮ_LIỆU');
  assert.strictEqual(trap1.tier, 'COLD');
});

challenge('2.3 Candidate has >=3 attempts with ZERO ERRORS logged (no division by zero)', () => {
  localStorage.clear();
  const matrix = new ToeicTrapHeatMatrix('test_zero_errors_logged');
  // Log 10 attempts on TRAP-03, ALL correct (0 mistakes)
  for (let i = 0; i < 10; i++) {
    matrix.recordAttempt('TRAP-03', true, Date.now() - i * 3600000);
  }

  const data = matrix.getMatrixData();
  const trap3 = data.find(c => c.trapId === 'TRAP-03');
  assert.strictEqual(trap3.totalAttempts, 10);
  assert.strictEqual(trap3.wrongAttempts, 0);
  assert(trap3.weightedTotal > 0, 'Weighted total must be positive');
  assert.strictEqual(trap3.weightedErrors, 0, 'Weighted errors must be 0');
  // 0 / weightedTotal must safely yield 0, NOT NaN or crash
  assert.strictEqual(trap3.heat, 0);
  assert(!isNaN(trap3.heat));
  assert.strictEqual(trap3.status, 'GHI_NHẬN');
  assert.strictEqual(trap3.tier, 'COLD');
  assert.strictEqual(trap3.tierName, 'Làm chủ (Cold)');
});

challenge('2.4 Candidate has large number of attempts (100) all correct across multiple traps', () => {
  localStorage.clear();
  const matrix = new ToeicTrapHeatMatrix('test_large_zero_err');
  for (let i = 0; i < 100; i++) {
    matrix.recordAttempt('TRAP-06', true, Date.now() - (i % 30) * 86400000);
    matrix.recordAttempt('TRAP-10', true, Date.now() - (i % 30) * 86400000);
  }

  const data = matrix.getMatrixData();
  const t6 = data.find(c => c.trapId === 'TRAP-06');
  const t10 = data.find(c => c.trapId === 'TRAP-10');
  assert.strictEqual(t6.wrongAttempts, 0);
  assert.strictEqual(t6.heat, 0);
  assert(!isNaN(t6.heat));
  assert.strictEqual(t10.wrongAttempts, 0);
  assert.strictEqual(t10.heat, 0);
  assert(!isNaN(t10.heat));
});

challenge('2.5 DOM rendering with 0 errors logged produces clean HTML with no NaN% or broken values', () => {
  localStorage.clear();
  const matrix = new ToeicTrapHeatMatrix('test_dom_zero_err');
  // Setup document mock
  const mockContainer = createMockElement('trapContainer');
  global.document = {
    getElementById: (id) => id === 'trapContainer' ? mockContainer : null,
    querySelector: () => null
  };

  const rendered = matrix.renderMatrix('trapContainer');
  assert(rendered !== null);
  assert(mockContainer.innerHTML.includes('trap-heat-matrix-container'));
  assert(mockContainer.innerHTML.includes('0%'));
  assert(!mockContainer.innerHTML.includes('NaN%'), 'HTML must not contain NaN%');
  assert(!mockContainer.innerHTML.includes('Infinity%'), 'HTML must not contain Infinity%');
  assert(!mockContainer.innerHTML.includes('undefined'), 'HTML must not contain undefined');
});

// =============================================================================
// DOMAIN 3: TOEIC RADAR CHART SINGLE PART & MISSING KEYS
// =============================================================================
console.log('\n--- Domain 3: 7-Axis Radar Chart Single Part & Missing Keys ---');

challenge('3.1 partScores has only 1 part as dictionary: { 1: 0.85 }', () => {
  const norm = ToeicRadarChart.normalizeMasteries({ 1: 0.85 });
  assert.strictEqual(norm.length, 7);
  assert.strictEqual(norm[0], 0.85);
  for (let p = 1; p < 7; p++) {
    assert.strictEqual(norm[p], 0.0, `Missing part ${p+1} must normalize to 0.0`);
  }

  // getVertices must succeed without NaN
  const vertices = ToeicRadarChart.getVertices({ 1: 0.85 }, 120, 150, 150);
  assert.strictEqual(vertices.length, 7);
  vertices.forEach(v => {
    assert(!isNaN(v.x), `Vertex Part ${v.part} x is NaN`);
    assert(!isNaN(v.y), `Vertex Part ${v.part} y is NaN`);
    assert(isFinite(v.x) && isFinite(v.y));
  });

  // Weak parts detection: parts 2-7 are 0.0 (< 0.60) so must be flagged
  const weak = ToeicRadarChart.findWeakParts({ 1: 0.85 });
  assert(!weak.includes(1), 'Part 1 (85%) should not be weak');
  for (let p = 2; p <= 7; p++) {
    assert(weak.includes(p), `Missing part ${p} should be flagged as weak`);
  }

  // generateSVG must not contain NaN
  const svg = ToeicRadarChart.generateSVG({ 1: 0.85 });
  assert(svg.includes('<svg'));
  assert(svg.includes('<polygon points='));
  assert(!svg.includes('NaN'), 'Generated SVG must not contain NaN');
  assert(svg.includes('P1 (85%)'));
  assert(svg.includes('P2 (0%)'));
});

challenge('3.2 partScores has only 1 part as percentage number > 1: { "4": 95 }', () => {
  const norm = ToeicRadarChart.normalizeMasteries({ '4': 95 });
  assert.strictEqual(norm[3], 0.95, 'Part 4 must be scaled down from 95 to 0.95');
  assert.strictEqual(norm[0], 0.0);
  assert.strictEqual(norm[6], 0.0);

  const svg = ToeicRadarChart.generateSVG({ '4': 95 });
  assert(!svg.includes('NaN'));
  assert(svg.includes('P4 (95%)'));
});

challenge('3.3 partScores is a single-element array: [0.75]', () => {
  const norm = ToeicRadarChart.normalizeMasteries([0.75]);
  assert.strictEqual(norm.length, 7);
  assert.strictEqual(norm[0], 0.75);
  for (let p = 1; p < 7; p++) {
    assert.strictEqual(norm[p], 0.0);
  }
  const svg = ToeicRadarChart.generateSVG([0.75]);
  assert(!svg.includes('NaN'));
});

challenge('3.4 partScores is empty object {}, empty array [], null, or undefined', () => {
  const testInputs = [{}, [], null, undefined, '', 'garbage_string', 12345];
  testInputs.forEach(input => {
    const norm = ToeicRadarChart.normalizeMasteries(input);
    assert.strictEqual(norm.length, 7);
    norm.forEach(val => assert.strictEqual(val, 0.0));

    const svg = ToeicRadarChart.generateSVG(input);
    assert(!svg.includes('NaN'), `SVG for input ${JSON.stringify(input)} contains NaN`);
  });
});

challenge('3.5 Sparse partScores missing parts 2, 4, 6: { 1: 0.8, 3: 0.9, 5: 0.7, 7: 0.6 }', () => {
  const input = { 1: 0.8, 3: 0.9, 5: 0.7, 7: 0.6 };
  const norm = ToeicRadarChart.normalizeMasteries(input);
  assert.strictEqual(norm[0], 0.8);
  assert.strictEqual(norm[1], 0.0); // missing part 2
  assert.strictEqual(norm[2], 0.9);
  assert.strictEqual(norm[3], 0.0); // missing part 4
  assert.strictEqual(norm[4], 0.7);
  assert.strictEqual(norm[5], 0.0); // missing part 6
  assert.strictEqual(norm[6], 0.6);

  const weak = ToeicRadarChart.findWeakParts(input);
  assert(weak.includes(2) && weak.includes(4) && weak.includes(6));

  const svg = ToeicRadarChart.generateSVG(input);
  assert(!svg.includes('NaN'));
});

challenge('3.6 predictFromProficiencies with only 1 part score provided', () => {
  const pred = ToeicRadarChart.predictFromProficiencies({ 7: 0.90 });
  assert(!isNaN(pred.baseScore));
  assert(pred.baseScore >= 10 && pred.baseScore <= 990);
  assert(!isNaN(pred.listeningScore));
  assert(!isNaN(pred.readingScore));
  assert(!isNaN(pred.probabilityOverTarget));
  assert(pred.probabilityOverTarget >= 0 && pred.probabilityOverTarget <= 100);
});

challenge('3.7 DOM render with single-part score updates mock container without crash', () => {
  const mockContainer = createMockElement('radarContainer');
  global.document = {
    getElementById: (id) => id === 'radarContainer' ? mockContainer : null,
    querySelector: () => null
  };

  const rendered = ToeicRadarChart.render('radarContainer', { 1: 0.75 });
  assert(rendered !== null);
  assert(mockContainer.innerHTML.includes('radar-chart-wrapper'));
  assert(mockContainer.innerHTML.includes('<polygon points='));
  assert(!mockContainer.innerHTML.includes('NaN'));
});

// =============================================================================
// DOMAIN 4: FSRS v5 INTERVAL ROUNDING WITH 0 ELAPSED DAYS & NEGATIVE DELTAS
// =============================================================================
console.log('\n--- Domain 4: FSRS v5 Interval Rounding With 0 Days & Negative Deltas ---');

challenge('4.1 rateCard with elapsedDays = 0 across all 4 rating grades (Again, Hard, Good, Easy)', () => {
  const grades = [1, 2, 3, 4];
  grades.forEach(grade => {
    const card = FSRS5Engine.initCard(`w_zero_${grade}`, 3);
    const updated = FSRS5Engine.rateCard(card, grade, 0);

    assert(!isNaN(updated.stability), `Stability is NaN for grade ${grade}`);
    assert(!isNaN(updated.difficulty), `Difficulty is NaN for grade ${grade}`);
    assert(!isNaN(updated.intervalDays), `Interval is NaN for grade ${grade}`);
    assert(Number.isInteger(updated.intervalDays), `Interval must be integer for grade ${grade}`);
    assert(updated.intervalDays >= 1, `Interval must be >= 1 for grade ${grade}, got ${updated.intervalDays}`);
    assert(updated.nextReview > Date.now() - 1000, 'nextReview must be in the future');
    assert.strictEqual(updated.reps, 1);
  });
});

challenge('4.2 Stability behaviour when elapsedDays = 0 on recall: R(0, S) = 1.0', () => {
  const card = FSRS5Engine.initCard('w_zero_recall', 3);
  const initialS = card.stability;
  // If 0 days elapsed and user reviews Good (3), R(0, S) is 1.0, so exp(w10*(1-R)) - 1 = 0
  // Recall stability should remain equal to initialS
  const updated = FSRS5Engine.rateCard(card, 3, 0);
  assert.strictEqual(updated.stability, initialS, `Expected stability to remain ${initialS}, got ${updated.stability}`);
  assert.strictEqual(updated.intervalDays, Math.max(1, Math.round(initialS)));
});

challenge('4.3 rateCard with negative elapsedDays (-1.0, -10.0, -0.001)', () => {
  const negativeDeltas = [-0.001, -1.0, -5.0, -100.0];
  negativeDeltas.forEach(delta => {
    const card = FSRS5Engine.initCard(`w_neg_${delta}`, 3);
    const updated = FSRS5Engine.rateCard(card, 3, delta);

    assert(!isNaN(updated.stability));
    assert(!isNaN(updated.intervalDays));
    assert(Number.isInteger(updated.intervalDays));
    assert(updated.intervalDays >= 1, `Interval with delta ${delta} must be >= 1, got ${updated.intervalDays}`);
    assert(updated.nextReview > Date.now() - 1000);
  });
});

challenge('4.4 rateCard when card.lastReview is in the future (negative time delta without explicit elapsedDays)', () => {
  const futureCard = {
    cardId: 'w_future_review',
    difficulty: 5.0,
    stability: 3.17,
    reps: 2,
    lapses: 0,
    lastReview: Date.now() + 86400000 * 5 // 5 days in future
  };

  const updated = FSRS5Engine.rateCard(futureCard, 3); // omit elapsedDays
  assert(!isNaN(updated.stability));
  assert(!isNaN(updated.intervalDays));
  assert(updated.intervalDays >= 1);
  assert(Number.isInteger(updated.intervalDays));
});

challenge('4.5 calcInterval boundary values across stability <= 0 and operational retentions [0.5, 0.99]', () => {
  const testStabilities = [0.0, -5.0, -0.001, 0.0001, 0.49, 0.5, 1.2, 100.0];
  testStabilities.forEach(s => {
    const iv = FSRS5Engine.calcInterval(s, 0.90);
    assert(Number.isInteger(iv), `Interval must be integer for stability ${s}`);
    assert(iv >= 1, `Interval must be >= 1 for stability ${s}, got ${iv}`);
  });

  const validRetentions = [0.5, 0.7, 0.8, 0.85, 0.9, 0.95, 0.99, 1.0];
  validRetentions.forEach(r => {
    const iv = FSRS5Engine.calcInterval(3.17, r);
    assert(Number.isInteger(iv), `Interval must be integer for retention ${r}`);
    assert(iv >= 1, `Interval must be >= 1 for retention ${r}, got ${iv}`);
  });
});

challenge('4.5b calcInterval edge behavior for zero retention (r = 0)', () => {
  // At r = 0, theoretical retention time is infinite; Math.pow(0, -2) evaluates to Infinity
  const ivZero = FSRS5Engine.calcInterval(3.17, 0.0);
  assert.strictEqual(ivZero, Infinity, 'r=0 mathematically evaluates to Infinity');
});

challenge('4.6 sanitizeCard repairing corrupt/empty card input before rateCard', () => {
  const corruptCards = [
    null,
    undefined,
    {},
    { difficulty: 'corrupt', stability: -99, reps: -5 },
    { difficulty: NaN, stability: NaN, lastReview: 'bad_date' }
  ];

  corruptCards.forEach(c => {
    const updated = FSRS5Engine.rateCard(c, 3, 1.0);
    assert(!isNaN(updated.difficulty));
    assert(updated.difficulty >= 1.0 && updated.difficulty <= 10.0);
    assert(!isNaN(updated.stability));
    assert(updated.stability >= 0.1);
    assert(updated.intervalDays >= 1);
  });
});

console.log('\n================================================================');
console.log(`CHALLENGE SUMMARY: ${passed + failed} Tests | PASSED: ${passed} | FAILED: ${failed}`);
if (failed === 0) {
  console.log('🏆 ALL ADVERSARIAL CHALLENGES CONFIRMED ROBUST & RESILIENT!');
} else {
  console.error(`💥 ${failed} ADVERSARIAL CHALLENGES FAILED:`);
  failures.forEach(f => console.error(` - ${f.title}: ${f.error.message}`));
  process.exit(1);
}
console.log('================================================================\n');
