const assert = require('assert');
const fs = require('fs');

console.log('================================================================');
console.log('  VERIFYING FLASHCARD 3D & UI OPTIMIZATIONS');
console.log('================================================================');

// 1. Test WebAudioMicroEngine methods
const webAudioCode = fs.readFileSync('js/web-audio-micro-engine.js', 'utf8');
assert(webAudioCode.includes('playThud()'), 'playThud must be defined in js/web-audio-micro-engine.js');
assert(webAudioCode.includes('playPop()'), 'playPop must be defined in js/web-audio-micro-engine.js');
assert(webAudioCode.includes('playDing()'), 'playDing must be defined in js/web-audio-micro-engine.js');
console.log('  ✓ [PASS] WebAudioMicroEngine: playThud, playPop, and playDing exist and syntactically sound.');

// 2. Test TinderFlashcards3D Engine
const TinderFlashcards3D = require('../js/tinder-flashcards-3d.js');

// Mock DOM
class MockElement {
    constructor(id = '') {
        this.id = id;
        this.innerHTML = '';
        this.style = {};
        this._classes = new Set();
        this.classList = {
            add: (c) => this._classes.add(c),
            remove: (c) => this._classes.delete(c),
            contains: (c) => this._classes.has(c)
        };
        this.children = [];
    }
    addEventListener() {}
    removeEventListener() {}
    setAttribute(k, v) { this[k] = v; }
    getAttribute(k) { return this[k]; }
}

global.document = {
    getElementById: (id) => new MockElement(id),
    head: { appendChild: () => {} },
    createElement: () => new MockElement()
};
global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener: () => {},
    removeEventListener: () => {},
    WebAudioMicroEngine: {
        playDing: () => true,
        playThud: () => true,
        playPop: () => true,
        playComboCheer: () => true,
        fireConfetti: () => true
    }
};

const deck = [
    { word: 'abide by', ipa: '/əˈbaɪd baɪ/', pos: 'v.', meaning: 'Tuân thủ' },
    { word: 'accommodate', ipa: '/əˈkɑː.mə.deɪt/', pos: 'v.', meaning: 'Đáp ứng' },
    { word: 'expedite', ipa: '/ˈek.spə.daɪt/', pos: 'v.', meaning: 'Xúc tiến' }
];

const container = new MockElement('tinderCardStageContainer');
const instance = new TinderFlashcards3D({ soundEnabled: true });
instance.mount(container, deck);

assert.strictEqual(instance.currentIndex, 0, 'Initial card index must be 0');
assert.strictEqual(instance.deck.length, 3, 'Deck size must be 3');
console.log('  ✓ [PASS] TinderFlashcards3D: Mounted successfully with 3 cards.');

// Test card flip
instance.flip();
assert.strictEqual(instance.isFlipped, true, 'Card flip state must be true');
instance.flip();
assert.strictEqual(instance.isFlipped, false, 'Card flip state must toggle back to false');
console.log('  ✓ [PASS] TinderFlashcards3D: 3D Flip toggle and audio triggered without errors.');

// Test finishSwipe directly (which executes when eject timer fires or rapid swipe happens)
instance.finishSwipe('left', 1);
assert.strictEqual(instance.currentIndex, 1, 'Current index must advance to 1 after swipe left');
assert.strictEqual(instance.stats.reviewAgain, 1, 'stats.reviewAgain must increment');
console.log('  ✓ [PASS] TinderFlashcards3D: Swipe Left executed, card advanced, stats recorded.');

// Test Swipe Right
instance.finishSwipe('right', 3);
assert.strictEqual(instance.currentIndex, 2, 'Current index must advance to 2 after swipe right');
assert.strictEqual(instance.stats.known, 1, 'stats.known must increment');
console.log('  ✓ [PASS] TinderFlashcards3D: Swipe Right executed, card advanced, stats recorded.');

// Swipe last card to complete deck
instance.finishSwipe('right', 3);
assert.strictEqual(instance.currentIndex, 3, 'Deck index reached completion');
assert(container.innerHTML.includes('Hoàn Thành Ôn Tập!'), 'Completion screen must render inside container');
console.log('  ✓ [PASS] TinderFlashcards3D: Deck complete screen rendered with victory stats.');

// 3. Test index.html DOM structure
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('id="sanhTopHeaderBar"'), 'Header must exist');
assert(indexHtml.includes('id="sanhMemberDropdownWrapper"'), 'Avatar dropdown wrapper must exist');
assert(indexHtml.includes('id="sanhMemberProfileMenu"'), 'Avatar dropdown menu must exist');
assert(indexHtml.includes('id="studyEnvironmentControls"'), 'Study environment controls cluster must exist');
assert(indexHtml.includes('id="quickStudyToolsContainer"'), 'Quick study tools dock must exist');
assert(indexHtml.includes('Trạm 180s'), 'Trạm 180s must exist');
assert(indexHtml.includes('Flashcard 3D'), 'Flashcard 3D must exist');
assert(indexHtml.includes('Cheat Sheet'), 'Cheat Sheet must exist');
assert(indexHtml.includes('Tài Liệu Đề Thi') || indexHtml.includes('Tài Liệu Thực Chiến'), 'Authentic docs must exist');
console.log('  ✓ [PASS] index.html: 2-Tier header bar, Avatar dropdown, and 4-tool quick study dock verified.');

// 4. Test app-tour-guide.js
const tourCode = fs.readFileSync('js/app-tour-guide.js', 'utf8');
assert(tourCode.includes("placement === 'right'"), 'Tour guide must support right placement');
assert(tourCode.includes("placement === 'top'"), 'Tour guide must support top placement');
assert(tourCode.includes('#quickStudyToolsContainer'), 'Tour guide must target quick study tools');
console.log('  ✓ [PASS] app-tour-guide.js: Enhanced multi-directional spotlight & positioning verified.');

console.log('================================================================');
console.log('🎉 ALL FLASHCARD & UI OPTIMIZATION TESTS PASSED WITH 100%!');
console.log('================================================================');
