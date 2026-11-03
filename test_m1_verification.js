/**
 * Test Suite for Milestone 1: Core UI/UX, Themes, Typography, PWA & Audio Engine
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- STARTING MILESTONE 1 VERIFICATION TEST SUITE ---');

// 1. Verify manifest.json
console.log('Testing manifest.json...');
const manifestRaw = fs.readFileSync('manifest.json', 'utf8');
const manifest = JSON.parse(manifestRaw);
assert.strictEqual(manifest.display, 'standalone', 'manifest display must be standalone');
assert.strictEqual(manifest.start_url, '/', 'manifest start_url must be /');
assert.strictEqual(manifest.background_color, '#F4EFEA', 'background_color should be Warm Sand');
assert.strictEqual(manifest.theme_color, '#161E2E', 'theme_color should be Deep Indigo');
assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'icons array should have at least 3 icons');
console.log('✓ manifest.json is valid and fully configured.');

// 2. Verify sw.js
console.log('Testing sw.js...');
const swContent = fs.readFileSync('sw.js', 'utf8');
assert(swContent.includes('CACHE_NAME'), 'sw.js must define CACHE_NAME');
assert(swContent.includes('/js/editorial-theme-manager.js'), 'sw.js must cache editorial-theme-manager.js');
assert(swContent.includes('/js/web-audio-micro-engine.js'), 'sw.js must cache web-audio-micro-engine.js');
assert(swContent.includes('/js/app-tour-guide.js'), 'sw.js must cache app-tour-guide.js');
assert(swContent.includes('/js/vendor/canvas-confetti.min.js'), 'sw.js must cache canvas-confetti.min.js');
console.log('✓ sw.js has complete cache asset registry.');

// 3. Verify index.html requirements
console.log('Testing index.html...');
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes(':root.editorial') || indexHtml.includes('html.editorial'), 'index.html must have editorial theme css');
assert(indexHtml.includes('#F4EFEA'), 'index.html must contain Warm Sand background color #F4EFEA');
assert(indexHtml.includes('#161E2E'), 'index.html must contain Deep Indigo color #161E2E');
assert(indexHtml.includes(':root.font-ets') || indexHtml.includes('html.font-ets'), 'index.html must have font-ets css');
assert(indexHtml.includes('EB Garamond'), 'index.html must reference EB Garamond font');
assert(indexHtml.includes('btnEditorialToggle'), 'index.html must contain btnEditorialToggle');
assert(indexHtml.includes('btnFontToggle'), 'index.html must contain btnFontToggle');
assert(indexHtml.includes('btnStartTourGuide'), 'index.html must contain btnStartTourGuide');
assert(indexHtml.includes('btnQuickPomodoroLaunch'), 'index.html must contain btnQuickPomodoroLaunch');
assert(indexHtml.includes('pomodoroHudModal'), 'index.html must contain pomodoroHudModal');
assert(indexHtml.includes('btnPwaHeaderInstall'), 'index.html must contain btnPwaHeaderInstall');
assert(indexHtml.includes('iosPwaInstallModal'), 'index.html must contain iosPwaInstallModal');
assert(indexHtml.includes('canvas-confetti.min.js'), 'index.html must load canvas-confetti.min.js');
assert(indexHtml.includes('editorial-theme-manager.js'), 'index.html must load editorial-theme-manager.js');
assert(indexHtml.includes('web-audio-micro-engine.js'), 'index.html must load web-audio-micro-engine.js');
assert(indexHtml.includes('app-tour-guide.js'), 'index.html must load app-tour-guide.js');
console.log('✓ index.html satisfies all Milestone 1 markup, styling, and script dependencies.');

// 4. Test EditorialThemeManager in mocked DOM
console.log('Testing EditorialThemeManager runtime logic...');
const mockLocalStorage = {};
global.localStorage = {
    getItem: (k) => mockLocalStorage[k] || null,
    setItem: (k, v) => { mockLocalStorage[k] = String(v); },
    removeItem: (k) => { delete mockLocalStorage[k]; }
};

const classListSet = new Set();
const mockRoot = {
    classList: {
        add: (...cls) => cls.forEach(c => classListSet.add(c)),
        remove: (...cls) => cls.forEach(c => classListSet.delete(c)),
        toggle: (c, force) => {
            if (force === undefined) {
                if (classListSet.has(c)) classListSet.delete(c);
                else classListSet.add(c);
            } else if (force) classListSet.add(c);
            else classListSet.delete(c);
        },
        contains: (c) => classListSet.has(c)
    }
};

global.document = {
    documentElement: mockRoot,
    readyState: 'complete',
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {} }),
    body: { appendChild: () => {} },
    addEventListener: () => {}
};
global.window = global;

// Load EditorialThemeManager
require('./js/editorial-theme-manager.js');
const etm = global.window.EditorialThemeManager;
assert(etm, 'window.EditorialThemeManager must exist');

// Test setEditorial
etm.setEditorial(true);
assert.strictEqual(etm.isEditorial(), true, 'isEditorial should be true');
assert.strictEqual(classListSet.has('editorial'), true, 'root must have editorial class');
assert.strictEqual(mockLocalStorage['study_editorial_theme'], 'true', 'localStorage must have true');

etm.setEditorial(false);
assert.strictEqual(etm.isEditorial(), false, 'isEditorial should be false');
assert.strictEqual(classListSet.has('editorial'), false, 'root must not have editorial class');
assert.strictEqual(mockLocalStorage['study_editorial_theme'], 'false', 'localStorage must have false');

etm.toggleEditorial();
assert.strictEqual(etm.isEditorial(), true, 'toggleEditorial should invert state');

// Test setFontSerif
etm.setFontSerif(true);
assert.strictEqual(etm.isFontSerif(), true, 'isFontSerif should be true');
assert.strictEqual(classListSet.has('font-ets'), true, 'root must have font-ets class');
assert.strictEqual(classListSet.has('font-inter'), false, 'root must not have font-inter class');

etm.setFontSerif(false);
assert.strictEqual(etm.isFontSerif(), false, 'isFontSerif should be false');
assert.strictEqual(classListSet.has('font-ets'), false, 'root must not have font-ets class');
assert.strictEqual(classListSet.has('font-inter'), true, 'root must have font-inter class');

etm.toggleFont();
assert.strictEqual(etm.isFontSerif(), true, 'toggleFont should invert font state');

console.log('✓ EditorialThemeManager passed all functional tests.');

// 5. Test WebAudioMicroEngine
console.log('Testing WebAudioMicroEngine runtime logic...');
// Mock Web Audio API
class MockAudioNode {
    connect() {}
    disconnect() {}
}
class MockAudioParam {
    setValueAtTime() {}
    linearRampToValueAtTime() {}
    exponentialRampToValueAtTime() {}
}
class MockOscillator extends MockAudioNode {
    constructor() {
        super();
        this.frequency = new MockAudioParam();
        this.type = 'sine';
    }
    start() {}
    stop() {}
}
class MockGain extends MockAudioNode {
    constructor() {
        super();
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
        return { getChannelData: () => new Float32Array(len) };
    }
    createBufferSource() { return new MockBufferSource(); }
    resume() { return Promise.resolve(); }
}

global.AudioContext = MockAudioContext;
global.window.AudioContext = MockAudioContext;

require('./js/web-audio-micro-engine.js');
const wame = global.window.WebAudioMicroEngine;
assert(wame, 'window.WebAudioMicroEngine must exist');

// Test playDing
wame.playDing();
console.log('✓ playDing executed cleanly.');

// Test playComboCheer
wame.playComboCheer(5);
console.log('✓ playComboCheer executed cleanly.');

// Test fireConfetti
let confettiFired = false;
global.window.confetti = (opts) => { confettiFired = true; };
wame.fireConfetti();
assert(confettiFired, 'fireConfetti should call window.confetti');
console.log('✓ fireConfetti executed cleanly.');

// Test startPomodoro
let tickReceived = false;
wame.startPomodoro('work', (tick) => {
    tickReceived = true;
    assert.strictEqual(tick.mode, 'work');
    assert.strictEqual(tick.totalSeconds, 1500);
}, () => {});
assert(tickReceived, 'startPomodoro must execute onTick');
wame.stopPomodoro();
console.log('✓ startPomodoro executed cleanly.');

// Test startExamSoundscape
let examTickReceived = false;
wame.startExamSoundscape(60, (tick) => {
    examTickReceived = true;
    assert.strictEqual(tick.isUrgent, true); // <= 300s is urgent
});
assert(examTickReceived, 'startExamSoundscape must execute onCountdownTick');
wame.stopExamSoundscape();
console.log('✓ startExamSoundscape executed cleanly.');

// 6. Test AppTourGuide
console.log('Testing AppTourGuide runtime logic...');
require('./js/app-tour-guide.js');
const atg = global.window.AppTourGuide;
assert(atg, 'window.AppTourGuide must exist');
assert(Array.isArray(atg.steps) && atg.steps.length === 5, 'AppTourGuide must have 5 tour steps');

atg.reset();
assert.strictEqual(atg.isCompleted(), false, 'Tour should be uncompleted after reset');

atg.start(true);
assert.strictEqual(atg.isActive, true, 'Tour should be active');
assert.strictEqual(atg.currentStep, 0, 'Current step should be 0');

atg.next();
assert.strictEqual(atg.currentStep, 1, 'Current step should advance to 1');

atg.prev();
assert.strictEqual(atg.currentStep, 0, 'Current step should return to 0');

atg.goToStep(4);
assert.strictEqual(atg.currentStep, 4, 'Current step should be 4');

atg.end(true);
assert.strictEqual(atg.isActive, false, 'Tour should be inactive');
assert.strictEqual(atg.isCompleted(), true, 'Tour should be marked completed');
console.log('✓ AppTourGuide passed all functional tests.');

console.log('--- ALL MILESTONE 1 VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
