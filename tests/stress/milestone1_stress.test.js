/**
 * =========================================================================
 * MILESTONE 1 ADVERSARIAL STRESS TEST SUITE
 * =========================================================================
 * Tests:
 * 1. EditorialThemeManager rapid toggle stress (10,000 cycles, memory & race condition checks)
 * 2. WebAudioMicroEngine concurrency, rapid firing, buffer exhaustion, timer leaks & race conditions
 * 3. AppTourGuide invalid step boundaries, rapid next/prev triggers, DOM resilience & event spam
 * =========================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('   MILESTONE 1 ADVERSARIAL STRESS & RACE CONDITION HARNESS      ');
console.log('================================================================\n');

// -------------------------------------------------------------------------
// Mock Environment Setup
// -------------------------------------------------------------------------
const mockLocalStorage = new Map();
global.localStorage = {
    getItem: (k) => mockLocalStorage.has(k) ? mockLocalStorage.get(k) : null,
    setItem: (k, v) => mockLocalStorage.set(k, String(v)),
    removeItem: (k) => mockLocalStorage.delete(k),
    clear: () => mockLocalStorage.clear()
};

const domClasses = new Set();
const mockRoot = {
    classList: {
        add: (...cls) => cls.forEach(c => c && domClasses.add(c)),
        remove: (...cls) => cls.forEach(c => domClasses.delete(c)),
        contains: (c) => domClasses.has(c)
    }
};

const mockButtons = new Map();
function createMockButton(id) {
    const btnClasses = new Set();
    const btnAttrs = new Map();
    let labelEl = { textContent: '' };
    const btn = {
        id,
        style: {},
        classList: {
            add: (...cls) => cls.forEach(c => btnClasses.add(c)),
            remove: (...cls) => cls.forEach(c => btnClasses.delete(c)),
            contains: (c) => btnClasses.has(c)
        },
        setAttribute: (k, v) => btnAttrs.set(k, String(v)),
        getAttribute: (k) => btnAttrs.get(k) || null,
        querySelector: (sel) => sel.includes('label') ? labelEl : null,
        scrollIntoView: () => {},
        getBoundingClientRect: () => ({ left: 100, top: 100, width: 200, height: 50 }),
        offsetParent: {}
    };
    mockButtons.set(id, btn);
    return btn;
}

// Create expected UI elements
[
    'btnEditorialToggle', 'btnMobileEditorialToggle', 'btnFloatEditorialToggle',
    'btnFontToggle', 'btnMobileFontToggle', 'btnFloatFontToggle',
    'tourCutoutRect', 'tourHighlightRing', 'tourPopoverCard',
    'tourStepIndicator', 'tourStepTitle', 'tourMascotText', 'tourStepContent',
    'tourPrevBtn', 'tourNextBtn', 'appTourGuideRoot'
].forEach(id => createMockButton(id));

global.document = {
    documentElement: mockRoot,
    readyState: 'complete',
    getElementById: (id) => mockButtons.get(id) || null,
    querySelector: (sel) => {
        if (sel.startsWith('#')) return mockButtons.get(sel.slice(1)) || null;
        return null;
    },
    querySelectorAll: (sel) => [],
    createElement: (tag) => {
        const el = createMockButton('elem_' + Math.random().toString(36).substring(7));
        el.tagName = tag.toUpperCase();
        el.innerHTML = '';
        el.remove = () => {};
        return el;
    },
    body: {
        appendChild: () => {}
    },
    addEventListener: () => {},
    removeEventListener: () => {}
};

global.window = global;
global.window.innerWidth = 1280;
global.window.innerHeight = 800;

// Web Audio Mock with node tracking
let totalOscillatorsCreated = 0;
let totalGainsCreated = 0;
let totalBuffersCreated = 0;
let activeIntervals = new Set();

class MockAudioParam {
    constructor() { this.value = 1.0; }
    setValueAtTime(v) { this.value = v; }
    linearRampToValueAtTime(v) { this.value = v; }
    exponentialRampToValueAtTime(v) { this.value = v; }
}

class MockAudioNode {
    connect() {}
    disconnect() {}
}

class MockOscillator extends MockAudioNode {
    constructor() {
        super();
        totalOscillatorsCreated++;
        this.frequency = new MockAudioParam();
        this.type = 'sine';
    }
    start() {}
    stop() {}
}

class MockGain extends MockAudioNode {
    constructor() {
        super();
        totalGainsCreated++;
        this.gain = new MockAudioParam();
    }
}

class MockBiquadFilter extends MockAudioNode {
    constructor() {
        super();
        this.frequency = new MockAudioParam();
        this.Q = new MockAudioParam();
    }
}

class MockBufferSource extends MockAudioNode {
    start() {}
    stop() {}
}

class MockAudioContext {
    constructor() {
        this.currentTime = 0;
        this.sampleRate = 44100;
        this.state = 'running';
        this.destination = new MockAudioNode();
    }
    createOscillator() { return new MockOscillator(); }
    createGain() { return new MockGain(); }
    createBiquadFilter() { return new MockBiquadFilter(); }
    createBuffer(ch, len, sr) {
        totalBuffersCreated++;
        return { getChannelData: () => new Float32Array(len) };
    }
    createBufferSource() { return new MockBufferSource(); }
    resume() { return Promise.resolve(); }
}

global.AudioContext = MockAudioContext;
global.window.AudioContext = MockAudioContext;

// Track setInterval and clearInterval
const originalSetInterval = global.setInterval;
const originalClearInterval = global.clearInterval;
const intervalTracker = new Set();

global.setInterval = function (fn, delay) {
    const id = originalSetInterval(fn, delay);
    intervalTracker.add(id);
    return id;
};
global.clearInterval = function (id) {
    intervalTracker.delete(id);
    return originalClearInterval(id);
};

// Load modules under test
require('../../js/editorial-theme-manager.js');
require('../../js/web-audio-micro-engine.js');
require('../../js/app-tour-guide.js');

const etm = global.window.EditorialThemeManager;
const wame = global.window.WebAudioMicroEngine;
const atg = global.window.AppTourGuide;

const results = [];

function recordTest(name, passed, details) {
    results.push({ name, passed, details });
    const tag = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${tag}] ${name}`);
    if (details) {
        console.log(`       Details: ${details}`);
    }
}

async function runStressTests() {
    console.log('\n--- SUITE 1: EditorialThemeManager Rapid Toggle Stress (10,000 cycles) ---');

    // 1.1: 10,000 tight loop toggleEditorial
    const memBefore1 = process.memoryUsage().heapUsed;
    const start1 = Date.now();
    for (let i = 0; i < 10000; i++) {
        etm.toggleEditorial();
    }
    const duration1 = Date.now() - start1;
    const memAfter1 = process.memoryUsage().heapUsed;
    const memDelta1Mb = ((memAfter1 - memBefore1) / (1024 * 1024)).toFixed(2);

    const isEdFinal = etm.isEditorial();
    const storageEd = mockLocalStorage.get('study_editorial_theme');
    const classEd = domClasses.has('editorial');
    const stateConsistent = (isEdFinal === (storageEd === 'true')) && (isEdFinal === classEd);

    recordTest(
        '1.1: Rapid 10,000 toggleEditorial cycles in tight loop',
        stateConsistent && duration1 < 3000,
        `Duration: ${duration1}ms, Heap delta: ${memDelta1Mb}MB, State consistent: ${stateConsistent}`
    );

    // 1.2: 10,000 tight loop toggleFont
    const start2 = Date.now();
    for (let i = 0; i < 10000; i++) {
        etm.toggleFont();
    }
    const duration2 = Date.now() - start2;
    const isFontFinal = etm.isFontSerif();
    const storageFont = mockLocalStorage.get('study_font_mode');
    const classFontEts = domClasses.has('font-ets');
    const classFontInter = domClasses.has('font-inter');
    const fontStateConsistent = (isFontFinal === (storageFont === 'ets')) &&
        (isFontFinal === classFontEts) && (!isFontFinal === classFontInter);

    recordTest(
        '1.2: Rapid 10,000 toggleFont cycles in tight loop',
        fontStateConsistent && duration2 < 3000,
        `Duration: ${duration2}ms, State consistent: ${fontStateConsistent}`
    );

    // 1.3: Asynchronous interleaved race condition simulation
    let asyncErrors = 0;
    const asyncTasks = [];
    for (let i = 0; i < 200; i++) {
        asyncTasks.push(new Promise((resolve) => {
            setImmediate(() => {
                try {
                    etm.setEditorial(i % 2 === 0);
                    etm.setFontSerif(i % 3 === 0);
                } catch (e) {
                    asyncErrors++;
                }
                resolve();
            });
        }));
    }
    await Promise.all(asyncTasks);
    recordTest(
        '1.3: 200 asynchronous interleaved setEditorial & setFontSerif operations',
        asyncErrors === 0,
        `Async errors: ${asyncErrors}`
    );

    // 1.4: Extreme input handling in setEditorial & setFontSerif
    let extremeInputErrors = 0;
    try {
        etm.setEditorial(null);
        etm.setEditorial(undefined);
        etm.setEditorial(0);
        etm.setEditorial(1);
        etm.setEditorial(NaN);
        etm.setEditorial({});
        etm.setFontSerif(null);
        etm.setFontSerif(undefined);
        etm.setFontSerif('');
    } catch (e) {
        extremeInputErrors++;
    }
    recordTest(
        '1.4: Extreme input types to setEditorial/setFontSerif',
        extremeInputErrors === 0,
        `Errors thrown on non-boolean inputs: ${extremeInputErrors}`
    );


    console.log('\n--- SUITE 2: WebAudioMicroEngine Concurrency, Stress & Timer Leak Testing ---');

    // 2.1: 5,000 rapid firing of playDing & playComboCheer
    const oscBefore = totalOscillatorsCreated;
    const gainBefore = totalGainsCreated;
    const startAudio = Date.now();
    for (let i = 0; i < 5000; i++) {
        wame.playDing();
        if (i % 2 === 0) wame.playComboCheer(5);
    }
    const audioDuration = Date.now() - startAudio;
    const oscDelta = totalOscillatorsCreated - oscBefore;
    const gainDelta = totalGainsCreated - gainBefore;

    recordTest(
        '2.1: 5,000 rapid firing of playDing and playComboCheer',
        audioDuration < 4000,
        `Duration: ${audioDuration}ms, Oscillators created: ${oscDelta}, Gains created: ${gainDelta}`
    );

    // 2.2: Simultaneous rapid triggers with Pomodoro & Exam soundscapes running
    let simultaneousCrashes = 0;
    try {
        wame.startPomodoro('work', () => {}, () => {});
        wame.startExamSoundscape(3600, () => {});

        for (let i = 0; i < 1000; i++) {
            wame.playDing();
            wame.playComboCheer(i % 10);
            wame.playSingingBowlChime();
        }
        wame.stopPomodoro();
        wame.stopExamSoundscape();
    } catch (e) {
        simultaneousCrashes++;
    }
    recordTest(
        '2.2: High-density simultaneous sound trigger under active Pomodoro & Exam engines',
        simultaneousCrashes === 0,
        `Simultaneous crashes: ${simultaneousCrashes}`
    );

    // 2.3: ADVERSARIAL CHALLENGE: Ambient audio channel switching & closure race condition
    console.log('Testing ambient switching race condition...');
    wame.startPomodoro('work'); // starts lofi
    wame.setAmbient('rain');    // immediately switches to rain

    // Check after 650ms whether rain nodes were destroyed by the 500ms delayed timeout of lofi
    await new Promise(r => setTimeout(r, 650));
    const ambientNodesPrematurelyDestroyed = (wame.pomodoroAmbientNodes === null);
    wame.stopPomodoro();

    recordTest(
        '2.3: ADVERSARIAL RACE CONDITION: Ambient channel switch closure leak in _stopAmbientAudio',
        !ambientNodesPrematurelyDestroyed, // We EXPECT it to fail due to the bug we found!
        ambientNodesPrematurelyDestroyed 
            ? 'VULNERABILITY CONFIRMED: pomodoroAmbientNodes prematurely cleared to null and previous interval orphaned!'
            : 'pomodoroAmbientNodes remained intact.'
    );

    // 2.4: Timer interval leak test in rapid start/stop cycling
    const initialIntervalCount = intervalTracker.size;
    for (let i = 0; i < 50; i++) {
        wame.startPomodoro('work');
        wame.stopPomodoro();
        wame.startExamSoundscape(60);
        wame.stopExamSoundscape();
    }
    // Wait for any pending timeouts to settle
    await new Promise(r => setTimeout(r, 600));
    const finalIntervalCount = intervalTracker.size;
    const intervalDifference = finalIntervalCount - initialIntervalCount;

    recordTest(
        '2.4: Start/Stop cycling interval leak detection (50 rapid iterations)',
        intervalDifference === 0,
        `Intervals active before: ${initialIntervalCount}, after: ${finalIntervalCount}, delta: ${intervalDifference}`
    );


    console.log('\n--- SUITE 3: AppTourGuide Adversarial Traversal, Boundary & Spam Testing ---');

    // 3.1: Invalid step index bounds
    let stepIndexSafe = true;
    atg.start(true);
    const initialStep = atg.currentStep;

    const invalidIndexes = [-999, -1, 5, 6, 9999, NaN, null, undefined, 'foo', {}];
    for (const idx of invalidIndexes) {
        atg.goToStep(idx);
        if (atg.currentStep < 0 || atg.currentStep >= atg.steps.length) {
            stepIndexSafe = false;
        }
    }
    recordTest(
        '3.1: Step traversal with invalid step indexes bounds protection',
        stepIndexSafe,
        `currentStep stayed within [0, ${atg.steps.length - 1}]: ${stepIndexSafe}`
    );

    // 3.2: Rapid Next triggers beyond bounds (1,000 next() calls)
    for (let i = 0; i < 1000; i++) {
        atg.next();
    }
    const completedAfter1000Next = atg.isCompleted() && !atg.isActive;
    recordTest(
        '3.2: 1,000 rapid next() calls (must complete gracefully without error or out-of-bounds)',
        completedAfter1000Next,
        `Tour completed: ${atg.isCompleted()}, isActive: ${atg.isActive}`
    );

    // 3.3: Rapid Prev triggers beyond bounds (1,000 prev() calls)
    atg.start(true);
    for (let i = 0; i < 1000; i++) {
        atg.prev();
    }
    const boundedAtZero = (atg.currentStep === 0 && atg.isActive);
    recordTest(
        '3.3: 1,000 rapid prev() calls (must clamp cleanly at step 0 without underflow)',
        boundedAtZero,
        `currentStep: ${atg.currentStep}, isActive: ${atg.isActive}`
    );

    // 3.4: Alternating Next/Prev spam (10,000 rapid triggers)
    const startSpam = Date.now();
    for (let i = 0; i < 10000; i++) {
        if (i % 2 === 0) atg.next();
        else atg.prev();
    }
    const spamDuration = Date.now() - startSpam;
    const spamSafe = (atg.currentStep >= 0 && atg.currentStep < atg.steps.length);
    recordTest(
        '3.4: 10,000 alternating next/prev triggers',
        spamSafe && spamDuration < 2000,
        `Duration: ${spamDuration}ms, Final step: ${atg.currentStep}`
    );

    // 3.5: Rapid start/end/reset cycling (100 iterations)
    let lifecycleErrors = 0;
    try {
        for (let i = 0; i < 100; i++) {
            atg.start(true);
            atg.reset();
            atg.end(true);
        }
    } catch (e) {
        lifecycleErrors++;
    }
    recordTest(
        '3.5: Rapid 100 start-reset-end lifecycle iterations',
        lifecycleErrors === 0,
        `Lifecycle errors: ${lifecycleErrors}`
    );

    console.log('\n================================================================');
    console.log('                 ADVERSARIAL STRESS TEST SUMMARY                ');
    console.log('================================================================');
    const totalPassed = results.filter(r => r.passed).length;
    const totalFailed = results.filter(r => !r.passed).length;
    console.log(`Total tests executed: ${results.length}`);
    console.log(`Passed:               ${totalPassed}`);
    console.log(`Failed:               ${totalFailed}`);
    console.log('================================================================\n');

    if (totalFailed > 0) {
        console.log('⚠️ ADVERSARIAL STRESS TEST REVEALED FAILURES!');
        process.exit(1);
    } else {
        console.log('✅ ALL STRESS TESTS PASSED!');
        process.exit(0);
    }
}

runStressTests().catch(err => {
    console.error('Fatal Stress Suite Error:', err);
    process.exit(1);
});
