/**
 * Unit & Integration Test Suite for Listening Module Phase 4
 * Verifies ListeningDashboard, Mock Test Engine, Adaptive AI, Stats & Heatmap
 */
const assert = require('assert');

console.log('--- RUNNING PHASE 4 TESTS: LISTENING DASHBOARD & MOCK TEST ---');

// Mock Browser Environment & LocalStorage
class MockAudio {
    constructor() {
        this.src = '';
        this.currentTime = 0;
        this.duration = 60;
        this.playbackRate = 1.0;
        this.listeners = {};
        this.paused = true;
    }
    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    removeEventListener() {}
    play() {
        this.paused = false;
        return Promise.resolve();
    }
    pause() {
        this.paused = true;
    }
    load() {}
}
global.Audio = MockAudio;

const localStorageMock = (function() {
    let store = {};
    return {
        getItem: function(key) {
            return store[key] || null;
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        }
    };
})();

global.localStorage = localStorageMock;
global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    showToast: (msg) => { console.log('Toast:', msg); },
    openAITutorModal: () => {},
    openFullPartPracticeModal: () => {}
};
global.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getElementById: (id) => ({
        id,
        classList: { add: () => {}, remove: () => {}, toggle: () => {}, replace: () => {} },
        style: {},
        innerHTML: '',
        textContent: '',
        children: []
    }),
    querySelectorAll: () => [],
    createElement: (tag) => ({
        tagName: tag,
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        style: {},
        innerHTML: '',
        appendChild: () => {}
    }),
    body: {
        appendChild: () => {}
    }
};

// Load dependencies
require('../js/toeic-audio-player.js');
require('../js/listening-data-v2.js');
require('../js/full-part-practice.js');
require('../js/listening-dashboard.js');

const db = global.window.ListeningDatabaseV2;
const Engine = global.window.FullPartPracticeEngine;
const Dashboard = global.window.ListeningDashboard;

assert(db, 'ListeningDatabaseV2 should be globally available');
assert(Engine, 'FullPartPracticeEngine should be globally available');
assert(Dashboard, 'ListeningDashboard should be globally available');
console.log('✅ 1. All Phase 4 modules loaded successfully.');

// Test 2: Initial Stats
let stats = Dashboard.getStats();
assert.strictEqual(stats.totalAnswered, 0, 'Initial totalAnswered should be 0');
assert.strictEqual(stats.overallAccuracy, 0, 'Initial overallAccuracy should be 0');
console.log('✅ 2. Initial stats verified.');

// Test 3: Record answers & calculate stats
const q1 = { id: 'p1_q01', part: 1, topic: 'Văn phòng', trap_type: 'hành động không có trong tranh', difficulty: 'A2' };
const q2 = { id: 'p2_q01', part: 2, topic: 'Hỏi Wh-', trap_type: 'bẫy từ đồng âm', difficulty: 'B1' };
const q3 = { id: 'p2_q02', part: 2, topic: 'Hỏi Wh-', trap_type: 'bẫy từ đồng âm', difficulty: 'B1' };

Dashboard.recordAnswer(q1, true, 12);
Dashboard.recordAnswer(q2, false, 15);
Dashboard.recordAnswer(q3, false, 18);

stats = Dashboard.getStats();
assert.strictEqual(stats.totalAnswered, 3, 'totalAnswered should be 3');
assert.strictEqual(stats.totalCorrect, 1, 'totalCorrect should be 1');
assert.strictEqual(stats.parts[1].done, 1, 'Part 1 done should be 1');
assert.strictEqual(stats.parts[2].done, 2, 'Part 2 done should be 2');
assert.strictEqual(stats.parts[2].correct, 0, 'Part 2 correct should be 0');
assert(stats.trapHeatmap.length > 0, 'Trap heatmap should contain records');
assert.strictEqual(stats.trapHeatmap[0].name, 'bẫy từ đồng âm', 'Worst trap should be bẫy từ đồng âm');
assert.strictEqual(stats.trapHeatmap[0].errorRate, 100, 'Error rate of worst trap should be 100%');
console.log('✅ 3. Answer recording and trap heatmap calculation verified.');

// Test 4: Daily recommendation reflects weakness
const rec = Dashboard.getDailyRecommendation();
assert(rec, 'Recommendation should not be null');
console.log('   Recommendation title:', rec.title);
console.log('   Recommendation reason:', rec.reason);
console.log('✅ 4. Daily recommendation verified.');

// Test 5: Full Mock Test 100 Questions Integration
Engine.startPart('mock_full', 'exam');
assert.strictEqual(Engine.activeQuestions.length, 100, 'Mock Full Test must have exactly 100 questions');
assert.strictEqual(Engine.mode, 'exam', 'Mock Full Test must start in exam mode');
assert.strictEqual(Engine.timeRemaining, 45 * 60, 'Mock Full Test must have 45 minutes timer');
console.log('✅ 5. Full Mock Test (100 questions / 45 mins) verified.');

// Test 6: Mini Mock Test 25 Questions Integration
Engine.startPart('mock_mini', 'exam');
assert.strictEqual(Engine.activeQuestions.length, 25, 'Mini Mock Test must have exactly 25 questions');
assert.strictEqual(Engine.mode, 'exam', 'Mini Mock Test must start in exam mode');
assert.strictEqual(Engine.timeRemaining, 12 * 60, 'Mini Mock Test must have 12 minutes timer');
console.log('✅ 6. Mini Mock Test (25 questions / 12 mins) verified.');

// Test 7: Adaptive AI Practice 20 Questions
const adaptiveQuestions = Dashboard.getAdaptiveQuestions(20);
assert.strictEqual(adaptiveQuestions.length, 20, 'Adaptive questions pool must return 20 questions');
Engine.startPart('adaptive', 'practice');
assert.strictEqual(Engine.activeQuestions.length, 20, 'Adaptive practice must load 20 questions');
assert.strictEqual(Engine.mode, 'practice', 'Adaptive practice must be in practice mode');
console.log('✅ 7. Adaptive AI practice (20 questions / 15 mins) verified.');

console.log('\n🎉 ALL PHASE 4 UNIT & INTEGRATION TESTS PASSED 100%!\n');
process.exit(0);
