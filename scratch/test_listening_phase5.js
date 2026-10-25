/**
 * Comprehensive Unit Test Suite for Listening Module Phase 5
 * Verifies Spaced Repetition System (SRS), Dictation LCS Diff Engine, Gamification Badges
 */
const assert = require('assert');

console.log('--- RUNNING PHASE 5 TESTS: SMART REVIEW (SRS), DICTATION DIFF & GAMIFICATION ---');

// Mock DOM & Storage
const storage = {};
global.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = v.toString(); },
    clear: () => { for (let k in storage) delete storage[k]; }
};

global.window = {
    showToast: (msg) => console.log('   Toast:', msg),
    addEventListener: () => {},
    removeEventListener: () => {}
};

global.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getElementById: () => ({ classList: { add: () => {}, remove: () => {} }, textContent: '' })
};

// Load Phase 5 module
require('../js/listening-smart-review.js');

const SRS = global.window.ToeicListeningSRS;
const Dictation = global.window.ToeicDictationEngine;
const Badges = global.window.ToeicListeningBadges;

assert(SRS, 'ToeicListeningSRS should be available');
assert(Dictation, 'ToeicDictationEngine should be available');
assert(Badges, 'ToeicListeningBadges should be available');
console.log('✅ 1. Phase 5 modules loaded successfully.');

// Test 2: SRS Scheduling Logic (1 - 3 - 7 - 14 - 30 days)
const sampleQuestion = {
    id: 'p2_q05',
    part: 2,
    q: 'Where is the monthly financial review held?',
    options: ['A. In Room 302', 'B. At 2:00 PM', 'C. Yes, it was reviewed'],
    ans: 0,
    ansLetter: 'A',
    explanation_vi: 'Câu hỏi Where hỏi địa điểm, chọn A.'
};

SRS.addQuestion(sampleQuestion);
let items = SRS.getItems();
assert.strictEqual(items.length, 1, 'SRS should contain 1 item');
assert.strictEqual(items[0].box, 1, 'Initial box must be 1');
console.log('✅ 2. SRS item addition verified (starts at Box 1).');

// Verify successful review moves to Box 2
SRS.recordReview('p2_q05', true);
items = SRS.getItems();
assert.strictEqual(items[0].box, 2, 'Successful review must advance to Box 2 (3 days)');

// Another successful review moves to Box 3
SRS.recordReview('p2_q05', true);
items = SRS.getItems();
assert.strictEqual(items[0].box, 3, 'Second successful review must advance to Box 3 (7 days)');

// Failed review resets back to Box 1
SRS.recordReview('p2_q05', false);
items = SRS.getItems();
assert.strictEqual(items[0].box, 1, 'Incorrect review must reset item back to Box 1');
console.log('✅ 3. SRS Leitner box progression and regression verified.');

// Test 3: Dictation LCS Diff Checking
const targetSentence = "She is typing on a computer keyboard";
const perfectInput = "she is typing on a computer keyboard";
const imperfectInput = "she is typin on computer keyboard"; // 'typin' wrong, 'a' missing

const resPerfect = Dictation.checkDiff(perfectInput, targetSentence);
assert.strictEqual(resPerfect.accuracy, 100, 'Perfect input must have 100% accuracy');
assert.strictEqual(resPerfect.correctCount, 7, 'All 7 words matched');

const resImperfect = Dictation.checkDiff(imperfectInput, targetSentence);
assert(resImperfect.accuracy < 100 && resImperfect.accuracy >= 70, 'Imperfect input accuracy should be ~71%');
assert(resImperfect.html.includes('line-through'), 'Incorrect word should have line-through styling');
assert(resImperfect.html.includes('thiếu: a'), 'Missing word should be annotated as missing');
console.log('✅ 4. Dictation LCS word-by-word diff algorithm verified.');

// Test 4: Gamification & Badges
Badges.unlockBadge('streak_7');
let unlocked = Badges.getUnlockedBadges();
assert(unlocked.includes('streak_7'), 'Badge streak_7 should be unlocked');
console.log('✅ 5. Gamification badge system verified.');

console.log('\n🎉 ALL PHASE 5 UNIT TESTS PASSED 100%!\n');
process.exit(0);
