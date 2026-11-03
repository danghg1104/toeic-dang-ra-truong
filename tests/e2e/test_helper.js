/**
 * TOEIC Master Test Helper & In-Memory Browser Environment Mock
 * Provides assertions, test harness, DOM/Web Audio mocks, and mathematical references.
 */

const fs = require('fs');
const path = require('path');

// =========================================================================
// 1. ASSERTION LIBRARY
// =========================================================================

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(actual)} to strictly equal ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertNotEqual(actual, expected, message) {
  if (actual === expected) {
    const msg = message || `Expected ${JSON.stringify(actual)} NOT to equal ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    const msg = message || `Deep equal mismatch:\nActual:   ${actualStr}\nExpected: ${expectedStr}`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertInDelta(actual, expected, delta, message) {
  const diff = Math.abs(actual - expected);
  if (diff > delta) {
    const msg = message || `Expected ${actual} to be within ${delta} of ${expected} (diff=${diff})`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertMatch(actual, regex, message) {
  if (!regex.test(String(actual))) {
    const msg = message || `Expected "${actual}" to match regex ${regex}`;
    throw new AssertionError(msg, actual, regex);
  }
}

function assertThrows(fn, expectedRegex, message) {
  let threw = false;
  let thrownError = null;
  try {
    fn();
  } catch (err) {
    threw = true;
    thrownError = err;
  }
  if (!threw) {
    throw new AssertionError(message || 'Expected function to throw an error, but it did not', null, expectedRegex);
  }
  if (expectedRegex && !expectedRegex.test(String(thrownError.message || thrownError))) {
    throw new AssertionError(
      message || `Expected error message "${thrownError.message}" to match ${expectedRegex}`,
      thrownError.message,
      expectedRegex
    );
  }
}

// =========================================================================
// 2. LIGHTWEIGHT TEST RUNNER HARNESS
// =========================================================================

class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.failures = [];
  }

  test(description, fn) {
    this.tests.push({ description, fn });
  }

  async run() {
    console.log(`\n======================================================`);
    console.log(`RUNNING SUITE: ${this.name} (${this.tests.length} tests)`);
    console.log(`======================================================`);

    const startTime = Date.now();
    for (let i = 0; i < this.tests.length; i++) {
      const { description, fn } = this.tests[i];
      try {
        const result = fn();
        if (result && typeof result.then === 'function') {
          await result;
        }
        this.passed++;
        process.stdout.write('.');
      } catch (err) {
        this.failed++;
        process.stdout.write('F');
        this.failures.push({
          index: i + 1,
          description,
          error: err
        });
      }
    }
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\nCompleted in ${duration}s. Passed: ${this.passed}, Failed: ${this.failed}`);

    if (this.failures.length > 0) {
      console.log(`\nFAILURES in ${this.name}:`);
      this.failures.forEach((f) => {
        console.log(`\n[${f.index}] ${f.description}`);
        console.log(`  Error: ${f.error.message || f.error}`);
        if (f.error.stack) {
          const lines = f.error.stack.split('\n').slice(1, 4).join('\n');
          console.log(`  Stack:\n${lines}`);
        }
      });
    }

    return {
      suite: this.name,
      total: this.tests.length,
      passed: this.passed,
      failed: this.failed,
      failures: this.failures
    };
  }
}

// =========================================================================
// 3. MOCK BROWSER ENVIRONMENT (DOM, Storage, Audio, Touch, WebSocket)
// =========================================================================

class MockClassList {
  constructor(element) {
    this.classes = new Set();
    this.element = element;
  }
  add(...names) {
    names.forEach(n => n && this.classes.add(n));
  }
  remove(...names) {
    names.forEach(n => this.classes.delete(n));
  }
  toggle(name, force) {
    if (force === true) {
      this.classes.add(name);
      return true;
    } else if (force === false) {
      this.classes.delete(name);
      return false;
    }
    if (this.classes.has(name)) {
      this.classes.delete(name);
      return false;
    } else {
      this.classes.add(name);
      return true;
    }
  }
  contains(name) {
    return this.classes.has(name);
  }
  toString() {
    return Array.from(this.classes).join(' ');
  }
}

class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.classList = new MockClassList(this);
    this.attributes = new Map();
    this.style = {
      _styles: {},
      setProperty(k, v) { this._styles[k] = v; },
      getPropertyValue(k) { return this._styles[k] || ''; },
      removeProperty(k) { delete this._styles[k]; }
    };
    this.children = [];
    this.parentNode = null;
    this.innerHTML = '';
    this.textContent = '';
    this.listeners = new Map();
    this.dataset = {};
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  setAttribute(k, v) { this.attributes.set(k, String(v)); }
  getAttribute(k) { return this.attributes.has(k) ? this.attributes.get(k) : null; }
  hasAttribute(k) { return this.attributes.has(k); }
  removeAttribute(k) { this.attributes.delete(k); }

  addEventListener(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
  }

  removeEventListener(event, fn) {
    if (!this.listeners.has(event)) return;
    const arr = this.listeners.get(event).filter(f => f !== fn);
    this.listeners.set(event, arr);
  }

  dispatchEvent(event) {
    const fns = this.listeners.get(event.type) || [];
    fns.forEach(fn => fn.call(this, event));
    return true;
  }

  querySelector(selector) {
    // Simple mock querySelector by id or class
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      if (this.getAttribute('id') === id) return this;
      for (const ch of this.children) {
        const found = ch.querySelector(selector);
        if (found) return found;
      }
    } else if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      if (this.classList.contains(cls)) return this;
      for (const ch of this.children) {
        const found = ch.querySelector(selector);
        if (found) return found;
      }
    }
    return null;
  }

  querySelectorAll(selector) {
    const results = [];
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      if (this.classList.contains(cls)) results.push(this);
      for (const ch of this.children) {
        results.push(...ch.querySelectorAll(selector));
      }
    }
    return results;
  }
}

class MockStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
  key(i) {
    return Array.from(this.store.keys())[i] || null;
  }
}

class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.currentTime = 0;
    this.nodesCreated = [];
    this.destination = { type: 'destination' };
  }

  createOscillator() {
    const osc = {
      type: 'sine',
      frequency: { value: 440, setValueAtTime: (val, t) => { osc.frequency.value = val; } },
      connect: (target) => { osc.target = target; },
      start: (t) => { osc.startedAt = t; },
      stop: (t) => { osc.stoppedAt = t; }
    };
    this.nodesCreated.push(osc);
    return osc;
  }

  createGain() {
    const gain = {
      gain: {
        value: 1.0,
        setValueAtTime: (val, t) => { gain.gain.value = val; },
        exponentialRampToValueAtTime: (val, t) => { gain.gain.value = val; }
      },
      connect: (target) => { gain.target = target; }
    };
    this.nodesCreated.push(gain);
    return gain;
  }

  createBiquadFilter() {
    const filter = {
      type: 'lowpass',
      frequency: { value: 350 },
      Q: { value: 1.0 },
      connect: (target) => { filter.target = target; }
    };
    this.nodesCreated.push(filter);
    return filter;
  }

  createBufferSource() {
    const source = {
      buffer: null,
      loop: false,
      connect: (target) => { source.target = target; },
      start: (t) => { source.startedAt = t; },
      stop: (t) => { source.stoppedAt = t; }
    };
    this.nodesCreated.push(source);
    return source;
  }

  resume() {
    this.state = 'running';
    return Promise.resolve();
  }

  close() {
    this.state = 'closed';
    return Promise.resolve();
  }
}

function setupMockBrowser() {
  const documentElement = new MockElement('html');
  const body = new MockElement('body');
  documentElement.appendChild(body);

  const elementsById = new Map();

  const mockDoc = {
    documentElement,
    body,
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => elementsById.get(id) || null,
    registerElementById: (id, el) => {
      el.setAttribute('id', id);
      elementsById.set(id, el);
    },
    querySelector: (sel) => documentElement.querySelector(sel),
    querySelectorAll: (sel) => documentElement.querySelectorAll(sel),
    addEventListener: (ev, fn) => documentElement.addEventListener(ev, fn),
    removeEventListener: (ev, fn) => documentElement.removeEventListener(ev, fn),
    dispatchEvent: (ev) => documentElement.dispatchEvent(ev)
  };

  const mockWindow = {
    document: mockDoc,
    localStorage: new MockStorage(),
    sessionStorage: new MockStorage(),
    AudioContext: MockAudioContext,
    webkitAudioContext: MockAudioContext,
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    listeners: new Map(),
    addEventListener(ev, fn) {
      if (!this.listeners.has(ev)) this.listeners.set(ev, []);
      this.listeners.get(ev).push(fn);
    },
    removeEventListener(ev, fn) {
      if (!this.listeners.has(ev)) return;
      this.listeners.set(ev, this.listeners.get(ev).filter(f => f !== fn));
    },
    dispatchEvent(ev) {
      const fns = this.listeners.get(ev.type) || [];
      fns.forEach(fn => fn.call(this, ev));
      return true;
    }
  };

  // Assign to global if not already present
  global.window = mockWindow;
  global.document = mockDoc;
  global.localStorage = mockWindow.localStorage;
  global.AudioContext = MockAudioContext;
  global.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail || null;
    }
  };

  return { mockWindow, mockDoc };
}

// =========================================================================
// 4. MATHEMATICAL GROUND TRUTH REFERENCE MODELS
// =========================================================================

/**
 * Canonical FSRS v5 Reference Math
 */
const FSRS_GROUND_TRUTH = {
  w: [
    0.40255, 1.18385, 3.17300, 15.69105, 7.19490, 0.53450, 1.46040, 0.00460, 1.54575,
    0.11920, 1.01925, 1.93950, 0.11000, 0.29605, 0.22695, 0.23150, 2.98980, 0.51655, 0.66210
  ],
  clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  },
  initCard(cardId = 'card_1') {
    const d0 = this.clamp(this.w[4] - Math.exp(this.w[5] * 2) + 1, 1, 10);
    const s0 = this.w[2]; // Good default
    return {
      cardId,
      difficulty: Number(d0.toFixed(2)),
      stability: Number(s0.toFixed(2)),
      retrievability: 1.0,
      reps: 0,
      lapses: 0,
      lastReview: Date.now(),
      nextReview: Date.now() + Math.round(s0) * 86400000
    };
  },
  retrievability(tDays, stability) {
    return Math.pow(1 + (19 * tDays) / (9 * stability), -0.5);
  },
  rateCard(card, grade, elapsedDays = 1.0) {
    const G = Number(grade); // 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
    let { difficulty: D, stability: S } = card;
    const R = this.retrievability(elapsedDays, S);

    // Difficulty update
    const d0_3 = this.w[4] - Math.exp(this.w[5] * 2) + 1;
    const newD = this.clamp(
      this.w[7] * d0_3 + (1 - this.w[7]) * (D - this.w[6] * (G - 3)),
      1.0,
      10.0
    );

    let newS;
    if (G === 1) {
      // Lapse (Again)
      const lapseS = this.w[11] * Math.pow(D, -this.w[12]) * (Math.pow(S + 1, this.w[13]) - 1) * Math.exp(this.w[14] * (1 - R));
      newS = Math.max(0.1, Math.min(S, lapseS));
    } else {
      // Recall (Hard, Good, Easy)
      let hG = 1.0;
      if (G === 2) hG = this.w[15];
      if (G === 4) hG = this.w[16];
      newS = S * (1 + Math.exp(this.w[8]) * (11 - D) * Math.pow(S, -this.w[9]) * (Math.exp(this.w[10] * (1 - R)) - 1) * hG);
      newS = Math.max(0.1, newS);
    }

    const intervalDays = Math.max(1, Math.round(newS));
    const now = Date.now();

    return {
      cardId: card.cardId,
      difficulty: Number(newD.toFixed(2)),
      stability: Number(newS.toFixed(2)),
      retrievability: Number(this.retrievability(intervalDays, newS).toFixed(4)),
      reps: (card.reps || 0) + 1,
      lapses: G === 1 ? (card.lapses || 0) + 1 : (card.lapses || 0),
      lastReview: now,
      intervalDays,
      nextReview: now + intervalDays * 86400000
    };
  }
};

/**
 * 2PL IRT Reference Math
 */
const IRT_GROUND_TRUTH = {
  probability(theta, b, a = 1.6, c = 0.25) {
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
  },
  fisherInformation(theta, b, a = 1.6, c = 0.25) {
    const P = this.probability(theta, b, a, c);
    const num = Math.pow(a, 2) * Math.pow(P - c, 2) * (1 - P);
    const den = Math.pow(1 - c, 2) * P;
    return den > 0 ? num / den : 0;
  },
  thetaToScore(theta) {
    const scaled = Math.round(495 / (1 + Math.exp(-0.9 * theta))) * 2;
    return Math.min(990, Math.max(10, scaled));
  }
};

/**
 * 7-Axis Radar Reference Math
 */
const RADAR_GROUND_TRUTH = {
  getVertices(masteries, radius = 120, cx = 150, cy = 150) {
    const vertices = [];
    for (let p = 0; p < 7; p++) {
      const alpha = -Math.PI / 2 + p * ((2 * Math.PI) / 7);
      const raw = Number(masteries && masteries[p]);
      const m = (!isNaN(raw) && isFinite(raw)) ? Math.max(0, Math.min(1.0, raw)) : 0;
      const x = cx + radius * m * Math.cos(alpha);
      const y = cy + radius * m * Math.sin(alpha);
      vertices.push({ part: p + 1, alpha, x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), mastery: m });
    }
    return vertices;
  },
  findWeakParts(masteries) {
    let minIdx = 0;
    let minVal = masteries[0] !== undefined ? masteries[0] : 1.0;
    const weak = [];
    for (let p = 0; p < 7; p++) {
      const val = masteries[p] !== undefined ? masteries[p] : 0;
      if (val < minVal) {
        minVal = val;
        minIdx = p;
      }
      if (val < 0.60) {
        weak.push(p + 1);
      }
    }
    if (!weak.includes(minIdx + 1)) {
      weak.push(minIdx + 1);
    }
    return weak.sort((a, b) => a - b);
  }
};

/**
 * Gaussian Normal CDF Reference Math for Score Prediction
 */
const GAUSSIAN_GROUND_TRUTH = {
  erf(x) {
    // Abramowitz and Stegun approximation
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
  },
  predictOverTarget(currentScore, daysUntilExam = 30, dailyHours = 1.5, target = 650) {
    const delta = daysUntilExam * dailyHours * 1.25;
    const mu = currentScore + delta;
    const sigma = 32; // Standard combined std deviation
    const z = (mu - target) / (sigma * Math.SQRT2);
    const prob = 0.5 * (1 + this.erf(z));
    return Math.min(100, Math.max(0, Math.round(prob * 100)));
  }
};

/**
 * 12 Trap Categories Definition
 */
const TRAP_CATEGORIES_CATALOG = [
  { id: 'TRAP-01', code: 'P1-BEING', section: 'listening', part: 1, name: 'Tranh tĩnh không người (is being V3)' },
  { id: 'TRAP-02', code: 'P1-ACTION', section: 'listening', part: 1, name: 'Trạng thái vs Hành động (wear / put on)' },
  { id: 'TRAP-03', code: 'P12-SOUND', section: 'listening', part: 2, name: 'Từ đồng âm & gần âm gây nhiễu' },
  { id: 'TRAP-04', code: 'P2-INDIRECT', section: 'listening', part: 2, name: 'Trả lời né tránh / gián tiếp' },
  { id: 'TRAP-05', code: 'P2-YESNO', section: 'listening', part: 2, name: 'Bẫy Yes/No cho câu hỏi Wh-' },
  { id: 'TRAP-06', code: 'P3-REVERSAL', section: 'listening', part: 3, name: 'Đổi ý phút chót (Wait / Actually)' },
  { id: 'TRAP-07', code: 'P34-INTENT', section: 'listening', part: 4, name: 'Hàm ý người nói & câu trích dẫn' },
  { id: 'TRAP-08', code: 'P34-GRAPHIC', section: 'listening', part: 4, name: 'Bẫy nhìn nhầm bảng biểu đối chiếu' },
  { id: 'TRAP-09', code: 'P5-POS', section: 'reading', part: 5, name: 'Từ loại đặc biệt (-ive, -al)' },
  { id: 'TRAP-10', code: 'P5-PREPCONJ', section: 'reading', part: 5, name: 'Liên từ vs Giới từ mệnh đề' },
  { id: 'TRAP-11', code: 'P6-INSERT', section: 'reading', part: 6, name: 'Điền câu & liên từ logic' },
  { id: 'TRAP-12', code: 'P7-CROSSREF', section: 'reading', part: 7, name: 'Bẫy xâu chuỗi đa văn bản' }
];

module.exports = {
  AssertionError,
  assert,
  assertEqual,
  assertNotEqual,
  assertDeepEqual,
  assertInDelta,
  assertMatch,
  assertThrows,
  TestSuite,
  MockElement,
  MockClassList,
  MockStorage,
  MockAudioContext,
  setupMockBrowser,
  FSRS_GROUND_TRUTH,
  IRT_GROUND_TRUTH,
  RADAR_GROUND_TRUTH,
  GAUSSIAN_GROUND_TRUTH,
  TRAP_CATEGORIES_CATALOG
};
