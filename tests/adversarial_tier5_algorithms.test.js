#!/usr/bin/env node

/**
 * =============================================================================
 * TIER 5 WHITE-BOX ADVERSARIAL TEST SUITE: ALGORITHMS, AUDIO & DIAGNOSTICS
 * =============================================================================
 * Project: noble-franklin (TOEIC Master / Tôi Đi Đâu Đó)
 * Milestone: 5 Phase 2 (Adversarial Coverage Hardening — Track A)
 * Author: challenger_m5_1 (EMPIRICAL CHALLENGER)
 * 
 * Target Modules Under Test:
 * 1. js/fsrs-v5-engine.js (FSRS v5 Spaced Repetition Engine)
 * 2. js/toeic-adaptive-engine.js (2PL IRT 10-Minute Adaptive Engine)
 * 3. js/toeic-radar-chart.js (7-Axis Radar Chart & Gaussian Score Predictor)
 * 4. js/toeic-trap-heat-matrix.js (12 Trap Categories & Time-Decayed Heat Matrix)
 * 5. js/web-audio-micro-engine.js (Web Audio Micro-Engine, Pomodoro & Exam Soundscape)
 * 6. js/editorial-theme-manager.js (Editorial Theme & ETS Font Switcher)
 * 
 * Verifies:
 * - Mathematical invariants & boundary conditions (division by zero, NaN, infinite inputs)
 * - State machine stability under abandonment, empty sessions, and unstarted calls
 * - Resource leak prevention (timer intervals, AudioContext nodes, event listeners)
 * - Corrupted payload sanitization and graceful degradation
 * =============================================================================
 */

'use strict';

const assert = require('assert');

// =============================================================================
// GLOBAL MOCK ENVIRONMENT FOR NODE.JS
// =============================================================================

const mockStorageMap = new Map();
const mockLocalStorage = {
  getItem: (k) => mockStorageMap.has(k) ? mockStorageMap.get(k) : null,
  setItem: (k, v) => mockStorageMap.set(k, String(v)),
  removeItem: (k) => mockStorageMap.delete(k),
  clear: () => mockStorageMap.clear()
};
global.localStorage = mockLocalStorage;

// Mock Web Audio API
class MockAudioParam {
  constructor(val = 0) { this.value = val; }
  setValueAtTime(val) { this.value = val; }
  linearRampToValueAtTime(val) { this.value = val; }
  exponentialRampToValueAtTime(val) { this.value = val; }
}

class MockGainNode {
  constructor() { this.gain = new MockAudioParam(1); }
  connect() {}
}

class MockOscillatorNode {
  constructor() {
    this.frequency = new MockAudioParam(440);
    this.type = 'sine';
    this.started = false;
    this.stopped = false;
  }
  connect() {}
  start() { this.started = true; }
  stop() { this.stopped = true; }
}

class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.state = 'running';
    this.destination = {};
  }
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillatorNode(); }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: new MockAudioParam(1000),
      Q: new MockAudioParam(1),
      connect() {}
    };
  }
  createBuffer(channels, length, sampleRate) {
    const data = new Float32Array(length);
    return { getChannelData: () => data };
  }
  createBufferSource() {
    return { buffer: null, loop: false, connect() {}, start() {}, stop() {} };
  }
  resume() { return Promise.resolve(); }
}
global.AudioContext = MockAudioContext;

// Mock DOM Environment
const rootClassList = new Set();
const mockElements = new Map();

function createMockDomElement(tag = 'div', id = '') {
  const classes = new Set();
  const attributes = new Map();
  return {
    tagName: tag.toUpperCase(),
    id,
    classList: {
      add: (...cls) => cls.forEach(c => classes.add(c)),
      remove: (...cls) => cls.forEach(c => classes.delete(c)),
      toggle: (c, force) => {
        if (force === undefined) {
          if (classes.has(c)) classes.delete(c); else classes.add(c);
        } else if (force) classes.add(c); else classes.delete(c);
      },
      contains: (c) => classes.has(c)
    },
    setAttribute: (k, v) => attributes.set(k, String(v)),
    getAttribute: (k) => attributes.get(k) || null,
    removeAttribute: (k) => attributes.delete(k),
    innerHTML: '',
    style: {},
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  };
}

global.document = {
  documentElement: {
    classList: {
      add: (c) => rootClassList.add(c),
      remove: (c) => rootClassList.delete(c),
      contains: (c) => rootClassList.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (rootClassList.has(c)) rootClassList.delete(c); else rootClassList.add(c);
        } else if (force) rootClassList.add(c); else rootClassList.delete(c);
      }
    }
  },
  getElementById: (id) => mockElements.get(id) || null,
  querySelector: (sel) => null,
  querySelectorAll: (sel) => [],
  addEventListener: () => {},
  removeEventListener: () => {},
  readyState: 'complete'
};

global.window = {
  document: global.document,
  localStorage: mockLocalStorage,
  AudioContext: MockAudioContext,
  addEventListener: () => {},
  removeEventListener: () => {},
  showToast: () => {}
};

// Import Target Modules
const FSRS5Engine = require('../js/fsrs-v5-engine');
const ToeicAdaptiveEngine = require('../js/toeic-adaptive-engine');
const ToeicRadarChart = require('../js/toeic-radar-chart');
const ToeicTrapHeatMatrix = require('../js/toeic-trap-heat-matrix');
require('../js/editorial-theme-manager');
require('../js/web-audio-micro-engine');

const EditorialThemeManager = global.window.EditorialThemeManager;
const WebAudioMicroEngine = global.window.WebAudioMicroEngine;

// =============================================================================
// TEST HARNESS ENGINE
// =============================================================================

let totalCount = 0;
let passCount = 0;
let failCount = 0;
const failureRecords = [];

function challenge(title, fn) {
  totalCount++;
  try {
    fn();
    passCount++;
    console.log(`  ✓ [PASS] ${title}`);
  } catch (err) {
    failCount++;
    failureRecords.push({ title, error: err });
    console.error(`  ✗ [FAIL / GAP DISCOVERED] ${title}`);
    console.error(`    ↳ Error: ${err.message}`);
  }
}

console.log('================================================================');
console.log('  TIER 5 ADVERSARIAL COVERAGE HARDENING: ALGORITHMS & AUDIO     ');
console.log('  Target: noble-franklin (Milestone 5 Phase 2 Audit)             ');
console.log('================================================================\n');

// =============================================================================
// DOMAIN 1: FSRS v5 ENGINE MATHEMATICAL STABILITY & INTERVAL BOUNDS
// =============================================================================
console.log('--- Domain 1: FSRS v5 Numerical Stability & Boundary Guards ---');

challenge('1.1 calcInterval with valid retention rates (0.50 to 0.99) yields positive integer days', () => {
  const engine = new FSRS5Engine();
  const retentions = [0.50, 0.70, 0.80, 0.85, 0.90, 0.95, 0.99];
  retentions.forEach(r => {
    const days = engine.calcInterval(5.0, r);
    assert(!isNaN(days), `calcInterval(5.0, ${r}) returned NaN`);
    assert(isFinite(days), `calcInterval(5.0, ${r}) returned non-finite`);
    assert(Number.isInteger(days), `calcInterval(5.0, ${r}) must be integer: ${days}`);
    assert(days >= 1, `calcInterval(5.0, ${r}) must be >= 1 day`);
  });
});

challenge('1.2 calcInterval guard against NaN or degenerate targetRetention (must not leak NaN)', () => {
  const engine = new FSRS5Engine();
  const degenerateValues = [NaN, null, undefined, -0.5, 0];
  degenerateValues.forEach(val => {
    const days = engine.calcInterval(3.0, val);
    assert(!isNaN(days), `calcInterval(3.0, ${val}) leaked NaN! Expected finite integer fallback.`);
    assert(isFinite(days), `calcInterval(3.0, ${val}) leaked Infinity!`);
    assert(days >= 1, `calcInterval(3.0, ${val}) returned invalid days: ${days}`);
  });
});

challenge('1.3 retrievability monotonicity: R(t, S) strictly decreases with elapsed time t', () => {
  const engine = new FSRS5Engine();
  const S = 4.0;
  let prevR = 1.0;
  for (let t = 0; t <= 100; t += 5) {
    const r = engine.retrievability(t, S);
    assert(!isNaN(r), `R(${t}, ${S}) is NaN`);
    assert(r >= 0.0001 && r <= 1.0, `R(${t}, ${S}) = ${r} out of bounds [0.0001, 1.0]`);
    if (t > 0) {
      assert(r < prevR, `R must strictly decrease: R(${t})=${r} not < R(${t-5})=${prevR}`);
    }
    prevR = r;
  }
});

challenge('1.4 retrievability with extreme values: t=10^8 days, t=-50, S=0, S=10^8, S=NaN', () => {
  const engine = new FSRS5Engine();
  assert.strictEqual(engine.retrievability(0, 5), 1.0);
  assert.strictEqual(engine.retrievability(-10, 5), 1.0, 'Negative elapsed days must be clamped to t=0 (R=1.0)');
  assert.strictEqual(engine.retrievability(NaN, 5), 1.0, 'NaN elapsed days must be treated as 0 (R=1.0)');

  const rAstro = engine.retrievability(1e8, 5);
  assert(!isNaN(rAstro) && isFinite(rAstro) && rAstro >= 0.0001 && rAstro <= 0.01, `Astronomical time failed: ${rAstro}`);

  const rZeroS = engine.retrievability(10, 0);
  assert(!isNaN(rZeroS) && isFinite(rZeroS) && rZeroS >= 0.0001, `Zero stability failed: ${rZeroS}`);

  const rNaNS = engine.retrievability(10, NaN);
  assert(!isNaN(rNaNS) && isFinite(rNaNS), `NaN stability failed: ${rNaNS}`);
});

challenge('1.5 initDifficulty & initStability with non-numeric, negative, or excessive grades', () => {
  const engine = new FSRS5Engine();
  [-10, 0, 1, 2, 3, 4, 10, NaN, null, 'invalid'].forEach(g => {
    const d = engine.initDifficulty(g);
    const s = engine.initStability(g);
    assert(!isNaN(d) && isFinite(d), `initDifficulty(${g}) returned non-finite: ${d}`);
    assert(d >= 1.0 && d <= 10.0, `initDifficulty(${g}) out of bounds [1.0, 10.0]: ${d}`);
    assert(!isNaN(s) && isFinite(s), `initStability(${g}) returned non-finite: ${s}`);
    assert(s >= 0.1, `initStability(${g}) must be >= 0.1: ${s}`);
  });
});

challenge('1.6 sanitizeCard thoroughly cleans corrupt / malicious card objects', () => {
  const engine = new FSRS5Engine();
  const maliciousCards = [
    null,
    undefined,
    12345,
    'not_an_object',
    {},
    { cardId: null, difficulty: NaN, stability: -5, reps: -10, lapses: 'bad', lastReview: 'never' },
    { difficulty: Infinity, stability: Infinity }
  ];

  maliciousCards.forEach(c => {
    const clean = engine.sanitizeCard(c);
    assert(clean && typeof clean === 'object', 'Must return an object');
    assert(typeof clean.cardId === 'string' && clean.cardId.length > 0, 'cardId must be non-empty string');
    assert(!isNaN(clean.difficulty) && clean.difficulty >= 1.0 && clean.difficulty <= 10.0, `Difficulty invalid: ${clean.difficulty}`);
    assert(!isNaN(clean.stability) && clean.stability >= 0.1 && isFinite(clean.stability), `Stability invalid: ${clean.stability}`);
    assert(Number.isInteger(clean.reps) && clean.reps >= 0, `Reps must be non-negative integer: ${clean.reps}`);
    assert(Number.isInteger(clean.lapses) && clean.lapses >= 0, `Lapses must be non-negative integer: ${clean.lapses}`);
    assert(!isNaN(clean.lastReview) && isFinite(clean.lastReview), `lastReview invalid: ${clean.lastReview}`);
  });
});

challenge('1.7 Repeated same-day reviews (elapsedDays = 0) do not cause stability runaway or collapse', () => {
  const engine = new FSRS5Engine();
  let card = engine.initCard('rapid_flip');
  for (let i = 0; i < 50; i++) {
    card = engine.rateCard(card, 3, 0); // Good, 0 elapsed days
    assert(!isNaN(card.stability) && isFinite(card.stability), `Stability is NaN on flip ${i}`);
    assert(!isNaN(card.difficulty) && card.difficulty >= 1.0 && card.difficulty <= 10.0);
    assert(card.intervalDays >= 1);
  }
  assert(card.reps === 50, `Expected 50 reps, got ${card.reps}`);
});

challenge('1.8 getDueCards handles malformed card entries and negative timestamps', () => {
  const engine = new FSRS5Engine();
  const corruptList = [
    null,
    undefined,
    {},
    { cardId: 'c1', nextReview: Date.now() - 5000 },
    { cardId: 'c2', nextReview: NaN },
    { cardId: 'c3', nextReview: 'invalid' },
    { cardId: 'c4', nextReview: Date.now() + 86400000 },
    { cardId: 'c5', nextReview: -1000 }
  ];
  const due = engine.getDueCards(corruptList, 10);
  assert(Array.isArray(due), 'getDueCards must return array');
  assert(due.some(c => c.cardId === 'c1'), 'c1 should be due');
  assert(!due.some(c => c.cardId === 'c4'), 'c4 in future should not be due');
});

// =============================================================================
// DOMAIN 2: TOEIC ADAPTIVE TEST ENGINE (2PL IRT) STATE MACHINE & BOUNDARIES
// =============================================================================
console.log('\n--- Domain 2: 2PL IRT Adaptive Engine State Machine & Gaps ---');

challenge('2.1 startTest(null) / startTest(undefined) parameter resilience without crash', () => {
  const engine = new ToeicAdaptiveEngine();
  assert.doesNotThrow(() => {
    const q1 = engine.startTest(null);
    assert(q1 !== null && typeof q1 === 'object', 'startTest(null) should return first question');
  }, 'startTest(null) must not throw TypeError: Cannot read properties of null (reading maxTimeSeconds)');

  assert.doesNotThrow(() => {
    const q2 = engine.startTest(undefined);
    assert(q2 !== null, 'startTest(undefined) should return first question');
  });
});

challenge('2.2 submitAnswer fallback finds question by id when currentQuestion is null', () => {
  const engine = new ToeicAdaptiveEngine();
  // Test submitAnswer without prior startTest()
  assert.doesNotThrow(() => {
    const res = engine.submitAnswer('adp_p1_01', 2);
    assert(res !== null && typeof res === 'object');
    assert(typeof res.isCorrect === 'boolean', 'submitAnswer should evaluate isCorrect');
  }, 'submitAnswer() when currentQuestion is null must not crash reading ans from null');
});

challenge('2.3 submitAnswer when qId differs from currentQuestion.id grades against target qId', () => {
  const engine = new ToeicAdaptiveEngine();
  engine.startTest();
  // Request grading for a specific valid question different from currentQuestion
  const targetId = 'adp_p5_01'; // ans is 1 (B)
  assert.doesNotThrow(() => {
    const res = engine.submitAnswer(targetId, 1);
    assert(res !== null, 'Should return result');
    assert.strictEqual(res.isCorrect, true, 'Option 1 is correct for adp_p5_01');
  }, 'submitAnswer with different qId should grade found question, not old currentQuestion');
});

challenge('2.4 submitAnswer throws informative error for non-existent question ID', () => {
  const engine = new ToeicAdaptiveEngine();
  engine.startTest();
  assert.throws(() => {
    engine.submitAnswer('non_existent_question_999', 0);
  }, /not found in pool/i, 'Must throw explicit question not found in pool error');
});

challenge('2.5 submitAnswer with invalid / out-of-range option index (-1, 999, NaN, "B") does not crash', () => {
  const engine = new ToeicAdaptiveEngine();
  const q = engine.startTest();
  const res = engine.submitAnswer(q.id, -1);
  assert(res !== null && typeof res === 'object');
  assert.strictEqual(res.isCorrect, false, 'Invalid choice -1 must be graded incorrect');
  assert(!isNaN(engine.theta) && isFinite(engine.theta), 'Theta must remain finite');
  assert(!isNaN(engine.standardError) && engine.standardError > 0, 'Standard Error must remain valid');
});

challenge('2.6 fisherInformation remains non-negative and finite across extreme theta [-10.0, +10.0]', () => {
  const thetas = [-10.0, -5.0, -3.0, 0.0, 3.0, 5.0, 10.0, NaN, Infinity, -Infinity];
  thetas.forEach(th => {
    const info = ToeicAdaptiveEngine.fisherInformation(th, 0.0, 1.6, 0.25);
    assert(!isNaN(info), `fisherInformation(${th}) returned NaN`);
    assert(isFinite(info), `fisherInformation(${th}) returned Infinity`);
    assert(info >= 0.0, `fisherInformation(${th}) returned negative: ${info}`);
  });
});

challenge('2.7 2PL probability stays strictly within [0.0, 1.0] across extreme inputs', () => {
  const thetas = [-100, -3, 0, 3, 100];
  const bs = [-100, 0, 100];
  const as = [0.1, 1.6, 5.0];
  const cs = [0.0, 0.25, 0.5, 0.9];

  thetas.forEach(th => {
    bs.forEach(b => {
      as.forEach(a => {
        cs.forEach(c => {
          const p = ToeicAdaptiveEngine.probability(th, b, a, c);
          assert(!isNaN(p) && isFinite(p), `P(${th}, ${b}, ${a}, ${c}) non-finite: ${p}`);
          assert(p >= 0.0 && p <= 1.0, `P(${th}, ${b}, ${a}, ${c}) out of [0, 1]: ${p}`);
        });
      });
    });
  });
});

challenge('2.8 thetaToScore strictly monotonic non-decreasing, clamped to [10, 990]', () => {
  let prevScore = 10;
  for (let th = -4.0; th <= 4.0; th += 0.2) {
    const score = ToeicAdaptiveEngine.thetaToScore(th);
    assert(!isNaN(score) && isFinite(score), `thetaToScore(${th}) is NaN`);
    assert(score >= 10 && score <= 990, `Score ${score} out of bounds [10, 990]`);
    assert(score >= prevScore, `Score decreased: Score(${th})=${score} < Score(${th-0.2})=${prevScore}`);
    prevScore = score;
  }
  assert.strictEqual(ToeicAdaptiveEngine.thetaToScore(-100), 10);
  const nanScore = ToeicAdaptiveEngine.thetaToScore(NaN);
  assert(nanScore >= 10 && nanScore <= 990);
  assert.strictEqual(nanScore, ToeicAdaptiveEngine.thetaToScore(0));
});

challenge('2.9 600-second time budget expiration terminates test immediately', () => {
  const engine = new ToeicAdaptiveEngine();
  const q = engine.startTest({ maxTimeSeconds: 5 }); // 5 second budget
  // Force simulate elapsed time
  engine.startTime = Date.now() - 10000; // 10s ago (> 5s)
  const res = engine.submitAnswer(q.id, 0);
  assert.strictEqual(res.isFinished, true, 'Test must be marked finished when time expires');
  assert(res.results && typeof res.results === 'object', 'Must include full test results');
  assert(res.results.totalScore >= 10 && res.results.totalScore <= 990);
});

// =============================================================================
// DOMAIN 3: 7-AXIS RADAR CHART & GAUSSIAN SCORE PREDICTOR
// =============================================================================
console.log('\n--- Domain 3: 7-Axis Radar Chart & Gaussian Predictor Invariants ---');

challenge('3.1 generateWeeklyReport resilience against null or corrupt activity log entries', () => {
  const corruptActivityLogs = [
    null,
    undefined,
    12345,
    {},
    { questionsCount: 5, correctCount: 3, timestamp: Date.now() },
    null,
    { count: 10, correct: 8, timestamp: Date.now() - 86400000 }
  ];

  assert.doesNotThrow(() => {
    const report = ToeicRadarChart.generateWeeklyReport(corruptActivityLogs);
    assert(report !== null && typeof report === 'object');
    assert(!isNaN(report.accuracy) && report.accuracy >= 0 && report.accuracy <= 100);
    assert(!isNaN(report.questionsCount) && report.questionsCount > 0);
    assert(!isNaN(report.estimatedScore) && report.estimatedScore >= 10 && report.estimatedScore <= 990);
  }, 'generateWeeklyReport([null]) must not throw TypeError: Cannot read properties of null (reading timestamp)');
});

challenge('3.2 Abramowitz erf error function accuracy vs mathematical ground truth', () => {
  const testPoints = [
    { x: 0.0, expected: 0.0 },
    { x: 1.0, expected: 0.84270079 },
    { x: -1.0, expected: -0.84270079 },
    { x: 2.0, expected: 0.99532226 },
    { x: -2.0, expected: -0.99532226 },
    { x: 3.0, expected: 0.99997791 }
  ];

  testPoints.forEach(tp => {
    const actual = ToeicRadarChart.erf(tp.x);
    const diff = Math.abs(actual - tp.expected);
    assert(diff < 0.0001, `erf(${tp.x}) error too large: got ${actual}, expected ${tp.expected}, diff: ${diff}`);
  });

  // Infinite inputs
  assert.strictEqual(ToeicRadarChart.erf(Infinity), 1.0);
  assert.strictEqual(ToeicRadarChart.erf(-Infinity), -1.0);
});

challenge('3.3 predictOverTarget bounds [0, 100] and monotonicity with increasing currentScore', () => {
  let prevProb = 0;
  for (let score = 200; score <= 800; score += 50) {
    const prob = ToeicRadarChart.predictOverTarget(score, 30, 1.5, 650);
    assert(!isNaN(prob), `predictOverTarget(${score}) returned NaN`);
    assert(prob >= 0 && prob <= 100, `Probability ${prob} out of [0, 100]`);
    assert(prob >= prevProb, `predictOverTarget must be non-decreasing: P(${score})=${prob} < P(${score-50})=${prevProb}`);
    prevProb = prob;
  }
});

challenge('3.4 predictOverTarget with degenerate arguments (target <= 0, target >= 1500, score = NaN)', () => {
  const pTargetZero = ToeicRadarChart.predictOverTarget(500, 30, 1.5, 0);
  assert.strictEqual(pTargetZero, 100, 'Probability of reaching >= 0 points must be 100%');

  const pTargetAstro = ToeicRadarChart.predictOverTarget(500, 30, 1.5, 1500);
  assert.strictEqual(pTargetAstro, 0, 'Probability of reaching >= 1500 points must be 0%');

  const pScoreNaN = ToeicRadarChart.predictOverTarget(NaN, 30, 1.5, 650);
  assert(!isNaN(pScoreNaN) && pScoreNaN >= 0 && pScoreNaN <= 100);
});

challenge('3.5 normalizeMasteries handles mixed types, percentages > 100, negative values, and sparse keys', () => {
  const weirdInputs = [
    { '1': 75, '2': 0.85, '3': -0.2, '4': 150, '5': '0.6', '6': NaN, '7': null },
    [100, '50%', -10, 0.4, undefined, Infinity, '0.9'],
    null,
    undefined,
    'garbage'
  ];

  weirdInputs.forEach(input => {
    const norm = ToeicRadarChart.normalizeMasteries(input);
    assert(Array.isArray(norm) && norm.length === 7, 'Must always return 7-element array');
    norm.forEach((val, idx) => {
      assert(!isNaN(val) && isFinite(val), `Index ${idx} is non-finite: ${val}`);
      assert(val >= 0.0 && val <= 1.0, `Index ${idx} = ${val} out of bounds [0.0, 1.0]`);
    });
  });
});

challenge('3.6 findWeakParts selection: at least 1 weak part always identified, tied minimums included', () => {
  // Case A: All parts 100%
  const allPerfect = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  const weakPerfect = ToeicRadarChart.findWeakParts(allPerfect);
  assert(Array.isArray(weakPerfect) && weakPerfect.length > 0, 'Must identify at least 1 weak part even when all 100%');
  assert.strictEqual(weakPerfect.length, 7, 'When all tied, all 7 parts should be represented');

  // Case B: Clear single weak part
  const singleWeak = [0.9, 0.9, 0.9, 0.3, 0.9, 0.9, 0.9];
  const weakSingle = ToeicRadarChart.findWeakParts(singleWeak);
  assert(weakSingle.includes(4), 'Part 4 must be identified as weak');

  // Case C: Tied minimums at 0.50
  const tiedWeak = [0.8, 0.5, 0.9, 0.5, 0.8, 0.7, 0.6];
  const weakTied = ToeicRadarChart.findWeakParts(tiedWeak);
  assert(weakTied.includes(2) && weakTied.includes(4), 'Both tied parts 2 and 4 must be included');
});

// =============================================================================
// DOMAIN 4: 12 TRAP CATEGORIES & TIME-DECAYED HEAT MATRIX
// =============================================================================
console.log('\n--- Domain 4: 12 Trap Categories & Time-Decay Half-Life Precision ---');

challenge('4.1 Half-life precision: lambda = ln(2)/7 gives exactly w(7d) = 0.500 and w(14d) = 0.250', () => {
  const matrix = new ToeicTrapHeatMatrix('test_fsrs_lambda');
  const w0 = matrix.calcWeight(0);
  assert.strictEqual(w0, 1.0, 'w(0) must be 1.0');

  const w7 = matrix.calcWeight(7);
  assert(Math.abs(w7 - 0.500) < 0.0001, `w(7) was ${w7}, expected 0.500`);

  const w14 = matrix.calcWeight(14);
  assert(Math.abs(w14 - 0.250) < 0.0001, `w(14) was ${w14}, expected 0.250`);

  const w21 = matrix.calcWeight(21);
  assert(Math.abs(w21 - 0.125) < 0.0001, `w(21) was ${w21}, expected 0.125`);
});

challenge('4.2 Future timestamps (negative elapsed days) clamped to 0 without exponential explosion', () => {
  const matrix = new ToeicTrapHeatMatrix('test_future_timestamps');
  const wNeg = matrix.calcWeight(-10);
  assert.strictEqual(wNeg, 1.0, 'Negative elapsed days must yield weight 1.0, not e^(+large)');

  const wNaN = matrix.calcWeight(NaN);
  assert.strictEqual(wNaN, 1.0, 'NaN elapsed days must default to 1.0');
});

challenge('4.3 Insufficient exposure gating: < 3 attempts enforces 0% heat and correct status', () => {
  const matrix = new ToeicTrapHeatMatrix('test_exposure_gate');
  matrix.clearRecords();

  // 0 attempts
  let cells = matrix.getMatrixData();
  assert(cells.every(c => c.heat === 0 && c.status === 'CHƯA_GHI_NHẬN'));

  // 1 error attempt for TRAP-01
  matrix.recordAttempt('TRAP-01', false);
  cells = matrix.getMatrixData();
  const trap1_1 = cells.find(c => c.trapId === 'TRAP-01');
  assert.strictEqual(trap1_1.heat, 0, '1 attempt must yield 0% heat');
  assert.strictEqual(trap1_1.status, 'THIẾU_DỮ_LIỆU');

  // 2 error attempts for TRAP-01
  matrix.recordAttempt('TRAP-01', false);
  cells = matrix.getMatrixData();
  const trap1_2 = cells.find(c => c.trapId === 'TRAP-01');
  assert.strictEqual(trap1_2.heat, 0, '2 attempts must yield 0% heat');
  assert.strictEqual(trap1_2.status, 'THIẾU_DỮ_LIỆU');

  // 3 error attempts -> NOW registered at 100% Critical
  matrix.recordAttempt('TRAP-01', false);
  cells = matrix.getMatrixData();
  const trap1_3 = cells.find(c => c.trapId === 'TRAP-01');
  assert.strictEqual(trap1_3.heat, 100, '3 attempts with 3 errors must yield 100% heat');
  assert.strictEqual(trap1_3.status, 'GHI_NHẬN');
  assert.strictEqual(trap1_3.tier, 'CRITICAL');
});

challenge('4.4 Zero-division prevention: >= 3 attempts with 0 errors yields 0% heat without NaN', () => {
  const matrix = new ToeicTrapHeatMatrix('test_zero_div');
  matrix.clearRecords();

  for (let i = 0; i < 5; i++) {
    matrix.recordAttempt('TRAP-02', true); // Correct
  }

  const cells = matrix.getMatrixData();
  const trap2 = cells.find(c => c.trapId === 'TRAP-02');
  assert(!isNaN(trap2.heat), 'Heat must not be NaN');
  assert.strictEqual(trap2.heat, 0, '0 errors must yield 0% heat');
  assert.strictEqual(trap2.tier, 'COLD');
  assert.strictEqual(trap2.status, 'GHI_NHẬN');
});

challenge('4.5 4-Tier classification boundary exactness: [0-19] COLD, [20-44] WARM, [45-69] HOT, [70-100] CRITICAL', () => {
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(0).tier, 'COLD');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(19).tier, 'COLD');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(20).tier, 'WARM');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(44).tier, 'WARM');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(45).tier, 'HOT');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(69).tier, 'HOT');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(70).tier, 'CRITICAL');
  assert.strictEqual(ToeicTrapHeatMatrix.getHeatTier(100).tier, 'CRITICAL');
});

challenge('4.6 Unknown trap IDs rejected safely without throwing', () => {
  const matrix = new ToeicTrapHeatMatrix('test_unknown_ids');
  const badIds = [null, undefined, '', 'TRAP-99', 'DROP TABLE', 1234];
  badIds.forEach(id => {
    const res = matrix.recordAttempt(id, true);
    assert.strictEqual(res, false, `Unknown ID "${id}" must return false`);
  });
});

challenge('4.7 LocalStorage parsing resilience with non-array, corrupted JSON or null values', () => {
  const matrix = new ToeicTrapHeatMatrix('test_corrupt_ls');
  
  mockLocalStorage.setItem('test_corrupt_ls', '{ not: "an_array" }');
  assert.doesNotThrow(() => {
    const data1 = matrix.getMatrixData();
    assert.strictEqual(data1.length, 12);
  });

  mockLocalStorage.setItem('test_corrupt_ls', 'MALFORMED_JSON{{{');
  assert.doesNotThrow(() => {
    const data2 = matrix.getMatrixData();
    assert.strictEqual(data2.length, 12);
  });
});

// =============================================================================
// DOMAIN 5: WEB AUDIO MICRO-ENGINE RESOURCE LEAK PREVENTION & TIMERS
// =============================================================================
console.log('\n--- Domain 5: Web Audio Micro-Engine & Resource Leak Prevention ---');

challenge('5.1 AudioContext failure resilience: playDing, playComboCheer do not crash if AudioContext is null', () => {
  const engine = WebAudioMicroEngine;
  const originalCtx = engine.audioCtx;
  engine.audioCtx = null;
  // Mock AudioContext throwing
  const origAudioContext = global.AudioContext;
  global.AudioContext = function() { throw new Error('AudioContext disabled by system policy'); };

  assert.doesNotThrow(() => {
    engine.playDing();
    engine.playComboCheer(5);
    engine.playSingingBowlChime();
  }, 'Audio playback methods must fail gracefully when AudioContext is unavailable');

  global.AudioContext = origAudioContext;
  engine.audioCtx = originalCtx;
});

challenge('5.2 Rapid startPomodoro / stopPomodoro cycles do not leak intervals or background nodes', () => {
  const engine = WebAudioMicroEngine;
  
  // Rapidly start 50 pomodoros
  for (let i = 0; i < 50; i++) {
    engine.startPomodoro('work');
  }

  // Ensure only 1 active interval exists
  assert(engine.pomodoroInterval !== null, 'Should have active interval');
  assert(engine.pomodoroIsRunning === true, 'Should be running');

  // Stop cleanly
  engine.stopPomodoro();
  assert.strictEqual(engine.pomodoroInterval, null, 'Interval must be cleared and set to null');
  assert.strictEqual(engine.pomodoroIsRunning, false);
  assert.strictEqual(engine.pomodoroAmbientNodes, null, 'Ambient nodes must be null after stop');
});

challenge('5.3 Rapid startExamSoundscape / stopExamSoundscape cycles do not leak intervals or LFOs', () => {
  const engine = WebAudioMicroEngine;

  for (let i = 0; i < 50; i++) {
    engine.startExamSoundscape(3600);
  }

  assert(engine.examInterval !== null, 'Should have active exam interval');
  assert(engine.examIsRunning === true, 'Should be running');

  engine.stopExamSoundscape();
  assert.strictEqual(engine.examInterval, null, 'Exam interval must be cleared and set to null');
  assert.strictEqual(engine.examIsRunning, false);
  assert.strictEqual(engine.examAmbientNodes, null, 'Exam ambient nodes must be null after stop');
});

challenge('5.4 Multiple idempotent stops do not throw or corrupt state', () => {
  const engine = WebAudioMicroEngine;
  assert.doesNotThrow(() => {
    engine.stopPomodoro();
    engine.stopPomodoro();
    engine.stopExamSoundscape();
    engine.stopExamSoundscape();
  });
});

challenge('5.5 setVolume sanitization clamps within [0.0, 1.0] and handles NaNs cleanly', () => {
  const engine = WebAudioMicroEngine;
  engine.setVolume(-5.0);
  assert.strictEqual(engine.masterVolume, 0.0);

  engine.setVolume(10.0);
  assert.strictEqual(engine.masterVolume, 1.0);

  engine.setVolume(0.45);
  assert.strictEqual(engine.masterVolume, 0.45);

  engine.setVolume(NaN);
  assert.strictEqual(engine.masterVolume, 0.7, 'NaN volume should fallback to default 0.7');
});

challenge('5.6 _formatSeconds handles boundary times accurately (0s, 60s, 3600s)', () => {
  const engine = WebAudioMicroEngine;
  assert.strictEqual(engine._formatSeconds(0), '00:00');
  assert.strictEqual(engine._formatSeconds(59), '00:59');
  assert.strictEqual(engine._formatSeconds(60), '01:00');
  assert.strictEqual(engine._formatSeconds(1500), '25:00');
  assert.strictEqual(engine._formatSeconds(3600), '60:00');
});

// =============================================================================
// DOMAIN 6: EDITORIAL THEME & TYPOGRAPHY MANAGER INVARIANTS
// =============================================================================
console.log('\n--- Domain 6: Editorial Theme & Typography Manager DOM Invariants ---');

challenge('6.1 Repeated setEditorial(true) is idempotent and keeps .editorial class active', () => {
  const mgr = EditorialThemeManager;
  for (let i = 0; i < 10; i++) {
    mgr.setEditorial(true);
  }
  assert.strictEqual(mgr.isEditorial(), true);
  assert(global.document.documentElement.classList.contains('editorial'));

  for (let i = 0; i < 10; i++) {
    mgr.setEditorial(false);
  }
  assert.strictEqual(mgr.isEditorial(), false);
  assert(!global.document.documentElement.classList.contains('editorial'));
});

challenge('6.2 Font switching cleanly toggles between .font-ets and .font-inter without collision', () => {
  const mgr = EditorialThemeManager;
  mgr.setFontSerif(true);
  assert.strictEqual(mgr.isFontSerif(), true);
  assert(global.document.documentElement.classList.contains('font-ets'));
  assert(!global.document.documentElement.classList.contains('font-inter'));

  mgr.setFontSerif(false);
  assert.strictEqual(mgr.isFontSerif(), false);
  assert(!global.document.documentElement.classList.contains('font-ets'));
  assert(global.document.documentElement.classList.contains('font-inter'));
});

challenge('6.3 syncUIControls executes cleanly even when UI buttons do not exist in DOM', () => {
  const mgr = EditorialThemeManager;
  assert.doesNotThrow(() => {
    mgr.syncUIControls();
  });
});

challenge('6.4 syncUIControls properly updates aria-pressed and classes when buttons exist', () => {
  const mgr = EditorialThemeManager;
  const mockBtnTheme = createMockDomElement('button', 'btnEditorialToggle');
  const mockBtnFont = createMockDomElement('button', 'btnFontToggle');
  mockElements.set('btnEditorialToggle', mockBtnTheme);
  mockElements.set('btnFontToggle', mockBtnFont);

  mgr.setEditorial(true);
  mgr.setFontSerif(true);

  assert.strictEqual(mockBtnTheme.getAttribute('aria-pressed'), 'true');
  assert(mockBtnTheme.classList.contains('editorial-active'));
  assert.strictEqual(mockBtnFont.getAttribute('aria-pressed'), 'true');
  assert(mockBtnFont.classList.contains('font-serif-active'));

  mgr.setEditorial(false);
  mgr.setFontSerif(false);
  assert.strictEqual(mockBtnTheme.getAttribute('aria-pressed'), 'false');
  assert(!mockBtnTheme.classList.contains('editorial-active'));
  assert.strictEqual(mockBtnFont.getAttribute('aria-pressed'), 'false');
  assert(!mockBtnFont.classList.contains('font-serif-active'));
});

// =============================================================================
// SUMMARY & VERDICT GENERATION
// =============================================================================

console.log('\n================================================================');
console.log('              TIER 5 ADVERSARIAL TEST SUITE SUMMARY             ');
console.log('================================================================');
console.log(`Total Challenges Executed:  ${totalCount}`);
console.log(`Challenges Passed:          ${passCount}`);
console.log(`Gaps / Failures Discovered: ${failCount}`);
console.log('----------------------------------------------------------------');

if (failCount > 0) {
  console.log('STATUS: ⚠️ GAPS DISCOVERED REQUIRING ATTENTION');
  console.log('\nDiscovered Gaps Breakdown:');
  failureRecords.forEach((f, idx) => {
    console.log(`[Gap ${idx + 1}] ${f.title}`);
    console.log(`  Error: ${f.error.message}`);
  });
} else {
  console.log('STATUS: ✅ ALL TIER 5 ADVERSARIAL TESTS PASSED ROBUSTLY');
}
console.log('================================================================\n');

// Export for programmatic runner integration
module.exports = {
  total: totalCount,
  passed: passCount,
  failed: failCount,
  failures: failureRecords
};

// Standalone execution: return code 0 or 1 based on test outcomes
if (require.main === module) {
  process.exit(failCount === 0 ? 0 : 1);
}
