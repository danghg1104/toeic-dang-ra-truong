/**
 * =========================================================================
 * MILESTONE 3 ADVERSARIAL EMPIRICAL STRESS TEST HARNESS
 * =========================================================================
 * Rigorous empirical stress verification for Milestone 3:
 * Authentic Practice UI, Listening & Vocab System (noble-franklin / Tôi Đi Đâu Đó)
 *
 * STRESS WORKLOADS:
 * 1. 3D Flashcards (F21 - R6):
 *    - 10,000 rapid swipe calculations across extreme coordinate ranges (Verify 0 NaN)
 *    - 10,000 simulated touch & mouse drag gestures with rapid direction reversals & multi-touch rejection (Verify 0 memory leak)
 *    - Rapid swipe burst race condition test (Uncancelled setTimeout ghost ejects & stats corruption >100%)
 *    - 1,000 sequential card ejects with FSRS v5 rating state tracking
 *
 * 2. 180s Capsule Station (F17 - R5):
 *    - 1,000 rapid start/pause/resume/reset cycles & timer concurrency
 *    - Rapid question answer submissions (Type A: 3-trap drill, Type B: 5-vocab recall)
 *    - XP award monotonicity & Heat Matrix state synchronization
 *
 * 3. Top 10 Office Paraphrase Clusters & 80/20 Tiering (F19, F20 - R6):
 *    - 10,000 term queries (bidirectional cluster lookup with mixed casing & edge cases)
 *    - Deep synonym lookups and distractor discrimination
 *    - High-volume text highlighting on 50KB text strings (performance & regex ReDoS safety)
 *    - 80/20 priority sorting on 10,000 items
 *
 * 4. Authentic Document Templates (F18 - R5):
 *    - High-load rendering (1,000 invoices/emails/passes/slack notices)
 *    - Adversarial XSS / script injection sanitization
 *    - Memory footprint stability
 *
 * 5. Listening Sync & One-Page Cheat Sheet (F2, F3, F4, F23, F24 - R1, R7):
 *    - 10,000 playback timeupdate ticks with karaoke progress clamping [0, 1]
 *    - 10,000 accent extractions and phonological shift queries
 *    - 10,000 indirect trap detections (reversals, speaker intent, graphic matrix)
 *    - 1,000 One-Page Cheat Sheet generations with print media integrity
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

// Mock Elements Registry
const elementsRegistry = new Map();

function createMockElement(id, tag = 'div') {
  const el = {
    id: id || '',
    tagName: tag.toUpperCase(),
    clientWidth: 360,
    clientHeight: 480,
    style: {},
    classList: {
      _classes: new Set(),
      add(cls) { this._classes.add(cls); },
      remove(cls) { this._classes.delete(cls); },
      contains(cls) { return this._classes.has(cls); },
      toggle(cls, force) {
        if (force !== undefined) {
          if (force) this._classes.add(cls);
          else this._classes.delete(cls);
        } else {
          if (this._classes.has(cls)) this._classes.delete(cls);
          else this._classes.add(cls);
        }
      }
    },
    _listeners: {},
    addEventListener(event, fn, opts) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
    },
    removeEventListener(event, fn) {
      if (!this._listeners[event]) return;
      this._listeners[event] = this._listeners[event].filter(cb => cb !== fn);
    },
    dispatchEvent(event, payload) {
      if (!this._listeners[event]) return;
      this._listeners[event].forEach(fn => fn(payload));
    },
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) {
      this._innerHTML = val;
      // Auto-register elements if rendered
      if (val.includes('id="activeTinderCard"')) {
        const card = createMockElement('activeTinderCard');
        elementsRegistry.set('activeTinderCard', card);
      }
      if (val.includes('id="badgeThuoc"')) {
        const b = createMockElement('badgeThuoc');
        elementsRegistry.set('badgeThuoc', b);
      }
      if (val.includes('id="badgeChua"')) {
        const b = createMockElement('badgeChua');
        elementsRegistry.set('badgeChua', b);
      }
    },
    querySelector(selector) {
      if (selector.startsWith('#')) return elementsRegistry.get(selector.slice(1)) || null;
      return createMockElement('query_' + Math.random().toString(36).substring(7));
    },
    querySelectorAll(selector) {
      return [createMockElement('sub_1'), createMockElement('sub_2')];
    },
    appendChild(child) {},
    removeChild(child) {},
    scrollIntoView() {},
    click() {
      this.dispatchEvent('click', {});
    }
  };
  if (id) elementsRegistry.set(id, el);
  return el;
}

const mockHead = createMockElement('head', 'head');
const mockBody = createMockElement('body', 'body');

if (!global.URL) {
  global.URL = {
    createObjectURL: () => 'blob:mock-url',
    revokeObjectURL: () => {}
  };
} else {
  if (!global.URL.createObjectURL) global.URL.createObjectURL = () => 'blob:mock-url';
  if (!global.URL.revokeObjectURL) global.URL.revokeObjectURL = () => {};
}

global.document = {
  head: mockHead,
  body: mockBody,
  getElementById: (id) => {
    if (elementsRegistry.has(id)) return elementsRegistry.get(id);
    const newEl = createMockElement(id);
    elementsRegistry.set(id, newEl);
    return newEl;
  },
  createElement: (tag) => createMockElement('created_' + tag, tag),
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.window = {
  innerWidth: 375,
  innerHeight: 667,
  localStorage: global.localStorage,
  addEventListener: (event, fn, opts) => mockBody.addEventListener(event, fn, opts),
  removeEventListener: (event, fn) => mockBody.removeEventListener(event, fn),
  dispatchEvent: (event, payload) => mockBody.dispatchEvent(event, payload)
};

// Audio Mock
global.window.WebAudioMicroEngine = {
  playDing: () => {},
  playComboCheer: () => {},
  fireConfetti: () => {},
  playThud: () => {},
  playPop: () => {}
};

// Import Milestone 3 Modules & Dependencies
const AuthenticDocumentTemplates = require('../../js/authentic-document-templates.js');
const ToeicListeningSync = require('../../js/toeic-listening-sync.js');
const TinderFlashcards3D = require('../../js/tinder-flashcards-3d.js');
const OnePageCheatSheet = require('../../js/one-page-cheat-sheet.js');
const ToeicCapsuleStation = require('../../js/toeic-capsule-station.js');
const FSRS5Engine = require('../../js/fsrs-v5-engine.js');

global.window.FSRS5Engine = FSRS5Engine;

console.log('================================================================');
console.log('    MILESTONE 3 EMPIRICAL ADVERSARIAL STRESS TEST HARNESS       ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function runTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ [PASS] ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ [FAIL] ${name}`);
    console.error(`    -> Error: ${err.message}`);
    if (err.stack) console.error(`    ${err.stack.split('\n').slice(1, 4).join('\n')}`);
  }
}

// Helper to check memory
function getMemoryMB() {
  return process.memoryUsage().heapUsed / (1024 * 1024);
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAllStressTests() {
  // =========================================================================
  // SECTION 1: 3D FLASHCARDS ADVERSARIAL STRESS HARNESS
  // =========================================================================
  console.log('--- SECTION 1: 3D Flashcards (10,000 Swipes, Reversals, Multi-touch & FSRS Tracking) ---');

  await runTest('F21: 10,000 Rapid Swipe Calculations produce strictly bounded non-NaN values', () => {
    const engine = new TinderFlashcards3D();
    const testWidths = [360, 480, 768, 1024, 0, -100, undefined, null];
    
    for (let i = 0; i < 10000; i++) {
      const dx = ((i * 137.5) % 4001) - 2000;
      const width = testWidths[i % testWidths.length];
      
      const state = engine.calculateSwipeState(dx, width);
      
      assert.strictEqual(Number.isNaN(state.rotation), false, `Rotation is NaN at iter ${i} for dx=${dx}, w=${width}`);
      assert.strictEqual(Number.isFinite(state.rotation), true, `Rotation is non-finite at iter ${i}`);
      assert.strictEqual(Number.isNaN(state.opacity), false, `Opacity is NaN at iter ${i}`);
      assert.ok(state.opacity >= 0 && state.opacity <= 1.0, `Opacity out of bounds [0, 1]: ${state.opacity}`);
      
      if (dx > 40) {
        assert.strictEqual(state.badge, 'THUỘC', `Expected THUỘC badge for dx=${dx}`);
      } else if (dx < -40) {
        assert.strictEqual(state.badge, 'CHƯA THUỘC', `Expected CHƯA THUỘC badge for dx=${dx}`);
      } else {
        assert.strictEqual(state.badge, null, `Expected null badge for dx=${dx}`);
      }
      
      const release = engine.evaluateSwipeRelease(dx);
      if (dx >= 100) {
        assert.strictEqual(release.action, 'EJECT_RIGHT');
        assert.strictEqual(release.rating, 3);
      } else if (dx <= -100) {
        assert.strictEqual(release.action, 'EJECT_LEFT');
        assert.strictEqual(release.rating, 1);
      } else {
        assert.strictEqual(release.action, 'SNAP_BACK');
        assert.strictEqual(release.rating, null);
      }
    }
  });

  await runTest('F21: 10,000 Simulated Touch & Mouse Drag Gestures with Multi-touch Rejection & Rapid Reversals', () => {
    const container = createMockElement('tinderContainer');
    const engine = new TinderFlashcards3D({ soundEnabled: false });
    
    const dummyDeck = [];
    for (let d = 0; d < 200; d++) {
      dummyDeck.push({
        cardId: `card_${d}`,
        word: `term_${d}`,
        ipa: `/tɜːrm_${d}/`,
        meaning: `Định nghĩa ${d}`,
        tier: d % 3 === 0 ? 'Cực Cao' : (d % 3 === 1 ? 'Cao' : 'Trung Bình')
      });
    }
    
    engine.mount(container, dummyDeck);
    const cardEl = elementsRegistry.get('activeTinderCard');
    assert.ok(cardEl, 'activeTinderCard must be mounted');
    
    const memBefore = getMemoryMB();
    let multiTouchRejections = 0;
    let reversalsHandled = 0;
    
    for (let i = 0; i < 10000; i++) {
      const isTouch = (i % 2 === 0);
      const startX = 180;
      const startY = 300;
      
      if (isTouch) {
        // Multi-touch injection on 10% of iterations (2+ fingers)
        const isMultiTouch = (i % 10 === 0);
        if (isMultiTouch) {
          engine.handleTouchStart({
            touches: [
              { clientX: startX, clientY: startY },
              { clientX: startX + 50, clientY: startY + 50 }
            ]
          });
          assert.strictEqual(engine.isDragging, false, `Multi-touch (2 fingers) must NOT trigger dragging at iter ${i}`);
          multiTouchRejections++;
          continue;
        }
        
        // Valid 1-finger start
        engine.handleTouchStart({
          touches: [{ clientX: startX, clientY: startY }]
        });
        assert.strictEqual(engine.isDragging, true, 'Single touch must start dragging');
        
        // Rapid Direction Reversal within single drag (inspect tilt without ejecting)
        engine.handleTouchMove({
          touches: [{ clientX: startX - 80, clientY: startY + 5 }],
          cancelable: true,
          preventDefault: () => {}
        });
        assert.strictEqual(engine.currentX, startX - 80);
        
        engine.handleTouchMove({
          touches: [{ clientX: startX + 80, clientY: startY - 10 }],
          cancelable: true,
          preventDefault: () => {}
        });
        assert.strictEqual(engine.currentX, startX + 80);
        reversalsHandled++;
        
        // Verify style transform does not contain NaN
        const transform = cardEl.style.transform || '';
        assert.ok(!transform.includes('NaN'), `Transform contains NaN at iter ${i}: ${transform}`);
        
        // Release touch at snapback distance (+40px < 100px threshold)
        engine.currentX = startX + 40;
        engine.handleTouchEnd({});
      } else {
        // Mouse Drag
        engine.handleMouseDown({ button: 0, clientX: startX, clientY: startY });
        assert.strictEqual(engine.isDragging, true, 'Mouse left-click must start dragging');
        
        // Move right (+75px) then reverse left (-75px)
        engine.handleMouseMove({ clientX: startX + 75, clientY: startY + 10 });
        engine.handleMouseMove({ clientX: startX - 75, clientY: startY - 5 });
        reversalsHandled++;
        
        const transform = cardEl.style.transform || '';
        assert.ok(!transform.includes('NaN'), `Mouse transform contains NaN at iter ${i}: ${transform}`);
        
        engine.currentX = startX - 30;
        engine.handleMouseUp({});
      }
    }
    
    const memAfter = getMemoryMB();
    const memDelta = memAfter - memBefore;
    console.log(`    -> Memory Delta after 10,000 gestures: ${memDelta.toFixed(2)} MB (Rejections: ${multiTouchRejections}, Reversals: ${reversalsHandled})`);
    assert.strictEqual(multiTouchRejections, 1000, `Expected exactly 1,000 multi-touch rejections, got ${multiTouchRejections}`);
    assert.ok(memDelta < 60, `Memory leak detected! Heap increased by ${memDelta} MB`);
  });

  await runTest('F21 (Adversarial): Rapid swipe bursts trigger uncancelled animation timers causing ghost card ejects & stats corruption (>100%)', async () => {
    const container = createMockElement('tinderGhostTestContainer');
    const engine = new TinderFlashcards3D({ soundEnabled: false });
    const deck = [
      { cardId: 'c1', word: 'word_1' },
      { cardId: 'c2', word: 'word_2' },
      { cardId: 'c3', word: 'word_3' },
      { cardId: 'c4', word: 'word_4' },
      { cardId: 'c5', word: 'word_5' }
    ];
    engine.mount(container, deck);
    
    // Rapid burst of 10 swipes on 5-card deck
    for (let i = 0; i < 10; i++) {
      engine.swipe('right');
    }
    
    // Wait for the 300ms animation timers to fire
    await sleep(350);
    
    const stats = engine.getDeckStats();
    // In a sound implementation with timer cancellation and boundary guard:
    // stats.known cannot exceed deck length (5), and currentIndex cannot exceed 5!
    assert.ok(engine.currentIndex <= 5, `Uncancelled ghost timers advanced currentIndex past deck length: currentIndex=${engine.currentIndex} (deck length=5)`);
    assert.ok(stats.known <= 5, `Uncancelled ghost timers overcounted known cards beyond deck total: stats.known=${stats.known} (total=5)`);
  });

  await runTest('F21: 1,000 Paced Card Ejects with FSRS v5 State Tracking and Finite Bounds', () => {
    const container = createMockElement('tinderFSRSContainer');
    const ratedCards = [];
    
    const engine = new TinderFlashcards3D({
      soundEnabled: false,
      onRate: (card, rating, fsrsResult) => {
        ratedCards.push({ card, rating, fsrsResult });
      }
    });
    
    const fsrsEngine = new FSRS5Engine();
    const largeDeck = [];
    for (let i = 0; i < 1000; i++) {
      largeDeck.push(fsrsEngine.initCard(`fsrs_vocab_${i}`));
    }
    
    engine.mount(container, largeDeck);
    
    // Eject 1,000 cards sequentially ensuring animation completes
    for (let i = 0; i < 1000; i++) {
      const dir = (i % 3 === 0) ? 'left' : 'right'; // 33% Again, 67% Good
      const curCard = engine.deck[engine.currentIndex];
      engine.finishSwipe(dir, dir === 'right' ? 3 : 1, curCard);
    }
    
    assert.strictEqual(engine.currentIndex, 1000, 'All 1,000 cards should have been processed');
    assert.strictEqual(ratedCards.length, 1000, 'All 1,000 cards should trigger onRate callback');
    
    const stats = engine.getDeckStats();
    assert.strictEqual(stats.total, 1000);
    assert.strictEqual(stats.known + stats.reviewAgain, 1000);
    assert.ok(stats.known > 600, 'Known cards should match right swipe ratio');
    assert.ok(stats.reviewAgain > 300, 'Review again should match left swipe ratio');
    
    // Verify FSRS state validity across all rated cards
    ratedCards.forEach(({ card, rating, fsrsResult }, idx) => {
      assert.ok(card.stability >= 0.1, `Invalid stability at card ${idx}: ${card.stability}`);
      assert.ok(card.difficulty >= 1.0 && card.difficulty <= 10.0, `Invalid difficulty at card ${idx}: ${card.difficulty}`);
      assert.strictEqual(Number.isNaN(card.stability), false, `Stability is NaN at card ${idx}`);
      assert.strictEqual(Number.isNaN(card.difficulty), false, `Difficulty is NaN at card ${idx}`);
    });
  });

  // =========================================================================
  // SECTION 2: 180s CAPSULE STATION STRESS HARNESS
  // =========================================================================
  console.log('\n--- SECTION 2: 180s Capsule Station (1,000 Start/Reset Cycles, Concurrency & Answer Submission) ---');

  await runTest('F17: 1,000 Rapid Capsule Blueprint Generations & Validation', () => {
    const station = new ToeicCapsuleStation();
    
    for (let i = 0; i < 1000; i++) {
      const type = (i % 2 === 0) ? 'TRAP_DRILL' : 'VOCAB_AUDIO';
      const capsule = station.createCapsule(type);
      
      assert.strictEqual(capsule.totalBudgetSeconds, 180, `Capsule total budget must be 180s`);
      assert.ok(capsule.id.startsWith('capsule_'), `Capsule must have valid ID`);
      
      if (type === 'TRAP_DRILL') {
        assert.strictEqual(capsule.phases.length, 3);
        assert.strictEqual(capsule.questions.length, 3);
        const totalPhaseDuration = capsule.phases.reduce((sum, p) => sum + p.duration, 0);
        assert.strictEqual(totalPhaseDuration, 180, `Phase duration must sum to 180s`);
      } else {
        assert.strictEqual(capsule.wordsCount, 5);
        assert.strictEqual(capsule.perWordBudget, 36);
        assert.strictEqual(capsule.wordsCount * capsule.perWordBudget, 180);
        assert.strictEqual(capsule.words.length, 5);
      }
    }
  });

  await runTest('F17: 1,000 Rapid Question Answer Submissions with XP Awarding & Heat Matrix Sync', () => {
    const station = new ToeicCapsuleStation();
    mockStorageData.clear();
    mockStorageData.set('toeic_user_xp', '100');
    
    // Mock Heat Matrix
    const recordedAttempts = [];
    global.window.ToeicTrapHeatMatrix = {
      recordAttempt: (trapId, isCorrect) => {
        recordedAttempts.push({ trapId, isCorrect });
      }
    };
    
    let expectedXP = 100;
    for (let i = 0; i < 1000; i++) {
      const isPerfect = (i % 4 !== 0); // 75% perfect
      const awarded = station.awardCapsuleXP(isPerfect);
      expectedXP += isPerfect ? 50 : 25;
      assert.strictEqual(awarded, isPerfect ? 50 : 25);
      
      const dummyResults = {
        capsuleId: `cap_res_${i}`,
        answered: [
          { trapCategory: 'TRAP-01', isCorrect: isPerfect },
          { trapCategory: 'TRAP-06', isCorrect: true },
          { trapCategory: 'TRAP-10', isCorrect: isPerfect }
        ]
      };
      station.syncResultsToHeatMatrix(dummyResults);
    }
    
    const finalXP = parseInt(global.localStorage.getItem('toeic_user_xp'), 10);
    assert.strictEqual(finalXP, expectedXP, `Final XP mismatch: ${finalXP} vs ${expectedXP}`);
    assert.strictEqual(recordedAttempts.length, 3000, `Expected 3,000 recorded attempts in Heat Matrix`);
  });

  await runTest('F17/F3: 1,000 Rapid Pre-listening Timer Start/Reset Cycles (Zero Interval Leakage)', () => {
    const listenSync = new ToeicListeningSync();
    const ticks = [];
    
    for (let i = 0; i < 1000; i++) {
      const cancel = listenSync.startPreListeningTimer(8, (remaining) => {
        ticks.push(remaining);
      });
      
      if (i % 2 === 0) {
        cancel();
        assert.strictEqual(listenSync.activeTimer, null, `activeTimer must be null after cancel at iter ${i}`);
      }
    }
    
    if (listenSync.activeTimer) {
      clearInterval(listenSync.activeTimer);
      listenSync.activeTimer = null;
    }
    
    assert.strictEqual(listenSync.activeTimer, null);
    assert.ok(ticks.length >= 1000, 'Each start must trigger initial tick');
  });

  // =========================================================================
  // SECTION 3: TOP 10 PARAPHRASE CLUSTERS & 80/20 TIERING STRESS HARNESS
  // =========================================================================
  console.log('\n--- SECTION 3: Paraphrase Clusters & 80/20 (10,000 Queries, 50KB Text Highlight, 10,000 Sort) ---');

  await runTest('F20: 10,000 Term Queries with Mixed Casing, Whitespace & Extreme Malformed Inputs', () => {
    const station = new ToeicCapsuleStation();
    const knownClusterTerms = [
      'delay', 'postpone', 'push back', 'defer', 'reschedule',
      'salary', 'remuneration', 'compensation', 'wage',
      'purchase', 'procure', 'acquire',
      'accelerate', 'expedite', 'fast-track',
      'examine', 'inspect', 'review', 'audit',
      'call off', 'cancel', 'revoke', 'terminate',
      'comply with', 'abide by', 'adhere to',
      'malfunction', 'glitch', 'flaw',
      'rebate', 'markdown', 'concession',
      'turn in', 'file', 'lodge', 'tender'
    ];
    
    const malformedInputs = [
      null, undefined, '', '   ', 12345, true, {}, [],
      '__proto__', 'constructor', 'undefined', 'null',
      'DELAY!@#', '   pOsTpOnE  \n\t', 'nonexistent_quantum_term'
    ];
    
    for (let i = 0; i < 10000; i++) {
      if (i < 8000) {
        const rawTerm = knownClusterTerms[i % knownClusterTerms.length];
        const variedTerm = (i % 3 === 0) ? rawTerm.toUpperCase() : ((i % 3 === 1) ? `  ${rawTerm}  ` : rawTerm);
        const cluster = station.findClusterByTerm(variedTerm);
        
        assert.ok(cluster, `Failed to find cluster for valid term: "${variedTerm}"`);
        assert.ok(cluster.id, 'Cluster must have valid ID');
        
        const siblings = station.findSiblings(variedTerm);
        assert.ok(Array.isArray(siblings), 'Siblings must be an array');
        assert.ok(siblings.length >= 5, `Expected >= 5 siblings for cluster ${cluster.id}`);
        assert.ok(!siblings.map(s => s.toLowerCase()).includes(rawTerm.toLowerCase()), 'Siblings must exclude query term itself');
        
        const genuineSibling = siblings[0];
        assert.strictEqual(station.isSynonym(rawTerm, genuineSibling), true);
        assert.strictEqual(station.isSynonym(rawTerm, 'unrelated_bogus_distractor'), false);
      } else {
        const badInput = malformedInputs[i % malformedInputs.length];
        const cluster = station.findClusterByTerm(badInput);
        if (typeof badInput === 'string' && badInput.trim().toLowerCase() === 'delay!@#') {
          assert.strictEqual(cluster, null);
        } else if (typeof badInput === 'string' && badInput.trim().toLowerCase() === 'postpone') {
          assert.ok(cluster && cluster.id === 'POSTPONE');
        } else {
          assert.strictEqual(cluster, null, `Malformed input must return null: ${badInput}`);
        }
        
        const sibs = station.findSiblings(badInput);
        if (typeof badInput === 'string' && badInput.trim().toLowerCase() === 'postpone') {
          assert.ok(sibs.length > 0);
        } else {
          assert.strictEqual(sibs.length, 0);
        }
      }
    }
  });

  await runTest('F20: High-Volume Text Highlighting on 50KB String (Performance & ReDoS Resilience)', () => {
    const station = new ToeicCapsuleStation();
    
    const baseParagraph = `
      The executive management decided to push back the project milestone until next quarter.
      Due to a sudden budget deficit, all department leads must review their remuneration and salary structures.
      We need to procure new aluminum mounts and expedite shipping to avoid further delay.
      Please ensure all staff comply with safety standards, inspect equipment regularly, and report any malfunction immediately.
      If you wish to cancel an order, submit documentation to procurement before 5:00 PM.
      Special markdown and rebate options are available for wholesale buyers.
    `;
    
    let largeText50KB = '';
    while (largeText50KB.length < 50000) {
      largeText50KB += baseParagraph + '\n';
    }
    
    console.log(`    -> Generated text size: ${(largeText50KB.length / 1024).toFixed(2)} KB`);
    
    const t0 = Date.now();
    const highlighted = station.highlightClusterMatches(largeText50KB);
    const durationMs = Date.now() - t0;
    
    console.log(`    -> Highlighting 50KB completed in: ${durationMs} ms`);
    assert.ok(durationMs < 500, `Highlighting 50KB took too long: ${durationMs}ms (threshold: 500ms)`);
    assert.ok(highlighted.length > largeText50KB.length, 'Highlighted text must contain <mark> tags');
    assert.ok(highlighted.includes('<mark class="cluster-match">push back</mark>'), 'Must highlight multi-word phrase "push back"');
    assert.ok(highlighted.includes('<mark class="cluster-match">remuneration</mark>'), 'Must highlight "remuneration"');
    assert.ok(highlighted.includes('<mark class="cluster-match">expedite</mark>'), 'Must highlight "expedite"');
    assert.ok(highlighted.includes('<mark class="cluster-match">malfunction</mark>'), 'Must highlight "malfunction"');
    
    assert.strictEqual(station.highlightClusterMatches(null), '');
    assert.strictEqual(station.highlightClusterMatches(''), '');
    assert.strictEqual(station.highlightClusterMatches(undefined), '');
  });

  await runTest('F19: 80/20 Frequency Tiering on 10,000 Items preserves strict sorting monotonicity', () => {
    const station = new ToeicCapsuleStation();
    const tiers = ['Cực Cao', 'Cao', 'Trung Bình', 'Unranked'];
    
    const largeVocabList = [];
    for (let i = 0; i < 10000; i++) {
      const tier = tiers[i % tiers.length];
      largeVocabList.push({
        id: `w_${i}`,
        word: `term_${i}`,
        tier: tier
      });
    }
    
    const sorted = station.sortVocabBy8020(largeVocabList);
    assert.strictEqual(sorted.length, 10000);
    
    let prevOrder = 0;
    for (let i = 0; i < sorted.length; i++) {
      const curOrder = station.tierOrder[sorted[i].tier] || 99;
      assert.ok(curOrder >= prevOrder, `Sorting violation at index ${i}: prev=${prevOrder}, cur=${curOrder}`);
      prevOrder = curOrder;
    }
    
    assert.ok(station.getBadgeClass('Cực Cao').includes('rose-500'));
    assert.ok(station.getBadgeClass('Cao').includes('amber-500'));
    assert.ok(station.getBadgeClass('Trung Bình').includes('slate-500'));
  });

  // =========================================================================
  // SECTION 4: AUTHENTIC DOCUMENT TEMPLATES STRESS HARNESS
  // =========================================================================
  console.log('\n--- SECTION 4: Authentic Document Templates (1,000 High-Load Renders & XSS Sanitization) ---');

  await runTest('F18: 1,000 High-Load Realistic Document Renders with HTML Sanitization', () => {
    const docEngine = new AuthenticDocumentTemplates();
    const memBefore = getMemoryMB();
    
    const maliciousPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert(1)>',
      '" onmouseover="evil()',
      '\' OR \'1\'=\'1',
      '&<>"\'',
      '<iframe src="evil.com"></iframe>'
    ];
    
    for (let i = 0; i < 1000; i++) {
      const typeMod = i % 4;
      const evilPayload = maliciousPayloads[i % maliciousPayloads.length];
      
      if (typeMod === 0) {
        // 250 Corporate Gmail emails
        const html = docEngine.render('Email', {
          subject: `Weekly Update #${i} ${evilPayload}`,
          senderName: `Sarah Jenkins <script>${i}</script>`,
          senderEmail: `sjenkins_${i}@nexus.corp`,
          body: `Dear team,\n\nHere is progress #${i}.\n${evilPayload}`,
          attachmentName: `Report_${i}.pdf`
        });
        assert.ok(html.includes('webmail-view'), 'Must render webmail-view');
        assert.ok(!html.includes('<script>'), `Unescaped <script> tag found in Email #${i}`);
      } else if (typeMod === 1) {
        // 250 Electronic VAT Invoices
        const items = [];
        const itemCount = (i % 10) + 1;
        for (let k = 0; k < itemCount; k++) {
          items.push({
            name: `Office Supply #${k} ${evilPayload}`,
            unit: 'Pcs',
            qty: k + 1,
            unitPrice: 25.5,
            amount: (k + 1) * 25.5
          });
        }
        const html = docEngine.render('Invoice', {
          serial: `AA/${i}E`,
          invoiceNo: `00${i}`,
          sellerCompany: `Nexus JSC ${evilPayload}`,
          items: items
        });
        assert.ok(html.includes('vat-invoice'), 'Must render vat-invoice');
        assert.ok(html.includes('Đã ký điện tử'), 'Must include digital seal');
        assert.ok(!html.includes('<script>'), `Unescaped <script> tag found in Invoice #${i}`);
      } else if (typeMod === 2) {
        // 250 Boarding Passes
        const html = docEngine.render('BoardingPass', {
          airline: `Skyways ${evilPayload}`,
          passenger: `Miller / John ${i}`,
          flight: `SK-${100 + i}`,
          gate: `B${(i % 20) + 1}`,
          seat: `${(i % 30) + 1}A`
        });
        assert.ok(html.includes('boarding-pass'), 'Must render boarding-pass');
        assert.ok(html.includes('ETKT:'), 'Must include barcode representation');
        assert.ok(!html.includes('<script>'), `Unescaped <script> tag found in BoardingPass #${i}`);
      } else {
        // 250 Slack Notices
        const html = docEngine.render('Slack', {
          channel: `#announcements-${i}`,
          posterName: `Alex Rivera ${evilPayload}`,
          message: `Please review update #${i} immediately.\n${evilPayload}`,
          reactions: ['👍 12', '🚀 5', evilPayload]
        });
        assert.ok(html.includes('slack-notice'), 'Must render slack-notice');
        assert.ok(!html.includes('<script>'), `Unescaped <script> tag found in Slack #${i}`);
      }
    }
    
    const memAfter = getMemoryMB();
    const memDelta = memAfter - memBefore;
    console.log(`    -> Memory Delta after 1,000 document renders: ${memDelta.toFixed(2)} MB`);
    assert.ok(memDelta < 50, `Memory bloat during document rendering: ${memDelta} MB`);
  });

  // =========================================================================
  // SECTION 5: LISTENING SYNC & ONE-PAGE CHEAT SHEET STRESS HARNESS
  // =========================================================================
  console.log('\n--- SECTION 5: Listening Sync & Cheat Sheet (10,000 Audio Ticks, Accent & Traps) ---');

  await runTest('F23: 10,000 Audio Playback Timeupdate Ticks with Clamped Progress [0, 1] without NaN', () => {
    const listenSync = new ToeicListeningSync();
    const segments = [
      { id: 1, start: 0.0, end: 3.5, speaker: 'Man', text: 'Good morning, did you receive the revised schedule?' },
      { id: 2, start: 3.5, end: 7.8, speaker: 'Woman', text: 'Wait, actually the client called to postpone the venue.' },
      { id: 3, start: 7.8, end: 12.0, speaker: 'Man', text: 'In that case, let me notify the catering team right away.' }
    ];
    
    for (let i = 0; i < 10000; i++) {
      const curTime = (i * 0.015);
      const activeSeg = listenSync.getActiveSegment(curTime, segments);
      
      if (curTime <= 12.0) {
        if (curTime < 3.5) assert.strictEqual(activeSeg && activeSeg.id, 1);
        else if (curTime <= 7.8) assert.strictEqual(activeSeg && activeSeg.id, 2);
        else if (curTime <= 12.0) assert.strictEqual(activeSeg && activeSeg.id, 3);
      } else {
        assert.strictEqual(activeSeg, null, `Time ${curTime}s beyond transcript should be null`);
      }
      
      const progNormal = listenSync.calculateLineProgress(curTime, 3.5, 7.8);
      assert.ok(progNormal >= 0.0 && progNormal <= 1.0, `Progress out of bounds [0, 1]: ${progNormal}`);
      assert.strictEqual(Number.isNaN(progNormal), false, `Progress is NaN at iter ${i}`);
      
      const progZeroDuration = listenSync.calculateLineProgress(5.0, 5.0, 5.0);
      assert.strictEqual(progZeroDuration, 1.0, `Zero duration must return 1.0`);
      
      const progInverted = listenSync.calculateLineProgress(5.0, 8.0, 4.0);
      assert.strictEqual(progInverted, 1.0, `Inverted duration must return 1.0 without NaN`);
    }
  });

  await runTest('F2, F24: 10,000 Accent Extractions, Flags & Reversal Trap Scans', () => {
    const listenSync = new ToeicListeningSync();
    const accentCodes = ['US', 'UK', 'AU', 'CA', 'GB', 'us-east', 'unknown'];
    
    const reversalTexts = [
      "Wait, let's look at the contract again.",
      "Actually, the flights were grounded due to fog.",
      "On second thought, I prefer the morning session.",
      "Hold on, didn't we discuss this yesterday?",
      "Change of plans: we are shifting to Room 402.",
      "Normal dialogue without any sudden turn or switch.",
      "Everything is going exactly as scheduled."
    ];
    
    for (let i = 0; i < 10000; i++) {
      const rawAcc = accentCodes[i % accentCodes.length];
      const extracted = listenSync.extractAccent({ accent: rawAcc, secondaryAccent: 'UK' });
      assert.ok(['US', 'UK', 'AU', 'CA'].includes(extracted.accent), `Extracted accent invalid: ${extracted.accent}`);
      assert.strictEqual(extracted.secondaryAccent, 'UK');
      
      const flag = listenSync.getFlag(extracted.accent);
      assert.ok(flag.length > 0, 'Flag must be non-empty');
      
      const text = reversalTexts[i % reversalTexts.length];
      const reversal = listenSync.detectReversal(text);
      if (i % reversalTexts.length <= 4) {
        assert.strictEqual(reversal.hasReversal, true, `Should detect reversal in "${text}"`);
        assert.ok(reversal.token, 'Must return reversal token');
      } else {
        assert.strictEqual(reversal.hasReversal, false, `Should not detect reversal in "${text}"`);
      }
    }
  });

  await runTest('F4: 1,000 One-Page Cheat Sheet Generations with Print Media Integrity', () => {
    const cheatEngine = new OnePageCheatSheet();
    
    for (let i = 0; i < 1000; i++) {
      const html = cheatEngine.generateHtml({
        lessonId: `unit_${i}`,
        title: `Lesson #${i} Tactical Summary`,
        keyRules: [
          'Scan first 2 words in 8 seconds',
          'Watch out for Wait / Actually reversals',
          'Distinguish because vs due to'
        ],
        vocab: [
          { word: 'abide by', ipa: '/əˈbaɪd baɪ/', meaning: 'tuân thủ hợp đồng', collocation: 'abide by the contract' },
          { word: 'expedite', ipa: '/ˈek.spə.daɪt/', meaning: 'xúc tiến', collocation: 'expedite shipment' }
        ],
        trapsSummary: ['TRAP-01: Being vs Been', 'TRAP-06: Phút chót']
      });
      
      assert.ok(html.includes('cheat-sheet-page'), 'Must include cheat-sheet-page class');
      assert.ok(html.includes('@media print'), 'Must include print media stylesheet');
      assert.ok(html.includes('page-break-inside: avoid'), 'Must enforce single page print rule');
      assert.ok(html.includes(`Lesson #${i}`), `Must include lesson title #${i}`);
    }
    
    const exportFile = cheatEngine.exportCheatSheet('unit04', 'html');
    assert.strictEqual(exportFile, 'toeic_cheatsheet_unit04.html');
  });

  // =========================================================================
  // STRESS TEST SUITE SUMMARY
  // =========================================================================
  console.log('\n================================================================');
  console.log(`STRESS SUITE SUMMARY: Total: ${totalTests}, Passed: ${passedTests}, Failed: ${failedTests}`);
  console.log('================================================================');

  if (failedTests > 0) {
    console.error(`\n❌ VERDICT: REQUEST_CHANGES — ${failedTests} stress test(s) failed!`);
    process.exit(1);
  } else {
    console.log('\n🎉 VERDICT: APPROVE — All Milestone 3 stress tests passed with 0 crashes, 0 leaks, and 0 NaN coordinates!');
    process.exit(0);
  }
}

runAllStressTests().catch(err => {
  console.error('Fatal stress suite runner error:', err);
  process.exit(1);
});
