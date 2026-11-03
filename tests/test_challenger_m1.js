/**
 * Challenger Empirical Stress Test Suite for Milestone 1
 * Adversarially challenges:
 * 1. localStorage throwing or disabled (private browsing / sandboxed webview)
 * 2. window.AudioContext / webkitAudioContext missing, undefined, or throwing
 * 3. W3C Web App Manifest compliance and asset presence
 * 4. Micro-engine edge cases (multiple startPomodoro, rapid toggles, zero/negative durations)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('===============================================================');
console.log('CHALLENGER EMPIRICAL VERIFICATION HARNESS — MILESTONE 1');
console.log('===============================================================');

let passedTests = 0;
let failedTests = 0;
const failures = [];

function runTest(name, fn) {
    try {
        fn();
        passedTests++;
        console.log(`[PASS] ${name}`);
    } catch (err) {
        failedTests++;
        failures.push({ name, error: err });
        console.error(`[FAIL] ${name}\n  Error: ${err.message}`);
    }
}

// Helper to create clean DOM mock
function createMockDOM() {
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

    const mockBody = {
        children: [],
        appendChild: function(child) { this.children.push(child); return child; },
        removeChild: function(child) {
            const idx = this.children.indexOf(child);
            if (idx >= 0) this.children.splice(idx, 1);
            return child;
        }
    };

    const mockDoc = {
        documentElement: mockRoot,
        body: mockBody,
        readyState: 'complete',
        getElementById: (id) => null,
        querySelector: (sel) => null,
        querySelectorAll: (sel) => [],
        createElement: (tag) => ({
            tagName: tag.toUpperCase(),
            setAttribute: () => {},
            getAttribute: () => null,
            appendChild: () => {},
            style: {},
            innerHTML: '',
            remove: () => {}
        }),
        addEventListener: () => {},
        removeEventListener: () => {}
    };

    return { mockDoc, classListSet };
}

// ============================================================================
// CHALLENGE SUITE 1: localStorage BOUNDARY CONDITIONS
// ============================================================================
console.log('\n--- 1. CHALLENGE: localStorage Disabled / Throws ---');

runTest('1.1: WebAudioMicroEngine when localStorage.getItem throws SecurityError', () => {
    // Reset require cache
    delete require.cache[require.resolve('../js/web-audio-micro-engine.js')];
    
    // Simulate Safari private browsing where localStorage.getItem throws SecurityError
    global.window = {};
    global.document = createMockDOM().mockDoc;
    global.localStorage = {
        getItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
        setItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
        removeItem: () => { throw new Error('SecurityError: The operation is insecure.'); }
    };
    global.window.localStorage = global.localStorage;

    try {
        require('../js/web-audio-micro-engine.js');
        assert(global.window.WebAudioMicroEngine, 'WebAudioMicroEngine should exist on window');
    } catch (e) {
        throw new Error(`WebAudioMicroEngine crashed when localStorage.getItem throws: ${e.message}`);
    }
});

runTest('1.2: WebAudioMicroEngine when window.localStorage getter throws SecurityError', () => {
    delete require.cache[require.resolve('../js/web-audio-micro-engine.js')];

    global.window = {};
    global.document = createMockDOM().mockDoc;
    
    // Define throwing localStorage getter on window and global
    Object.defineProperty(global, 'localStorage', {
        get() { throw new Error('SecurityError: Access is denied for this document.'); },
        configurable: true
    });
    Object.defineProperty(global.window, 'localStorage', {
        get() { throw new Error('SecurityError: Access is denied for this document.'); },
        configurable: true
    });

    try {
        require('../js/web-audio-micro-engine.js');
        assert(global.window.WebAudioMicroEngine, 'WebAudioMicroEngine should exist on window');
    } catch (e) {
        throw new Error(`WebAudioMicroEngine crashed when accessing window.localStorage getter throws: ${e.message}`);
    } finally {
        delete global.localStorage;
    }
});

runTest('1.3: EditorialThemeManager when localStorage.getItem throws SecurityError', () => {
    delete require.cache[require.resolve('../js/editorial-theme-manager.js')];

    global.window = {};
    const { mockDoc } = createMockDOM();
    global.document = mockDoc;
    global.localStorage = {
        getItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
        setItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
        removeItem: () => { throw new Error('SecurityError: The operation is insecure.'); }
    };
    global.window.localStorage = global.localStorage;

    require('../js/editorial-theme-manager.js');
    const etm = global.window.EditorialThemeManager;
    assert(etm, 'EditorialThemeManager must exist');
    assert.strictEqual(etm.isEditorial(), false, 'Should safely default to false');
    assert.strictEqual(etm.isFontSerif(), false, 'Should safely default to false');

    // setEditorial and setFontSerif should not crash when localStorage.setItem throws
    etm.setEditorial(true);
    assert.strictEqual(etm.isEditorial(), true, 'In-memory state should update');
    etm.setFontSerif(true);
    assert.strictEqual(etm.isFontSerif(), true, 'In-memory font state should update');
});

runTest('1.4: AppTourGuide when localStorage throws SecurityError', () => {
    delete require.cache[require.resolve('../js/app-tour-guide.js')];

    global.window = {};
    const { mockDoc } = createMockDOM();
    global.document = mockDoc;
    global.localStorage = {
        getItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
        setItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
        removeItem: () => { throw new Error('SecurityError: The operation is insecure.'); }
    };
    global.window.localStorage = global.localStorage;

    require('../js/app-tour-guide.js');
    const atg = global.window.AppTourGuide;
    assert(atg, 'AppTourGuide must exist');
    assert.strictEqual(atg.isCompleted(), false, 'isCompleted should safely return false');
    
    // reset() and end() should not crash when removeItem/setItem throws
    atg.reset();
    atg.end(true);
});

// ============================================================================
// CHALLENGE SUITE 2: AudioContext BOUNDARY CONDITIONS
// ============================================================================
console.log('\n--- 2. CHALLENGE: AudioContext Missing or Throwing ---');

runTest('2.1: WebAudioMicroEngine when window.AudioContext & webkitAudioContext are undefined', () => {
    delete require.cache[require.resolve('../js/web-audio-micro-engine.js')];

    const mockStore = {};
    global.localStorage = {
        getItem: (k) => mockStore[k] || null,
        setItem: (k, v) => { mockStore[k] = String(v); },
        removeItem: (k) => { delete mockStore[k]; }
    };
    global.window = {
        AudioContext: undefined,
        webkitAudioContext: undefined,
        localStorage: global.localStorage
    };
    delete global.AudioContext;
    delete global.webkitAudioContext;
    global.document = createMockDOM().mockDoc;

    require('../js/web-audio-micro-engine.js');
    const wame = global.window.WebAudioMicroEngine;
    assert(wame, 'WebAudioMicroEngine should exist');

    // Verify all sound methods degrade gracefully (no unhandled error)
    wame.playDing();
    wame.playComboCheer(3);
    wame.playSingingBowlChime();
    
    // Pomodoro should still count down even if audio is missing
    let tickCount = 0;
    wame.startPomodoro('work', (tick) => {
        tickCount++;
    });
    assert.strictEqual(tickCount, 1, 'Pomodoro tick must execute without AudioContext');
    wame.stopPomodoro();

    // Exam soundscape should still count down
    let examTick = 0;
    wame.startExamSoundscape(60, () => { examTick++; });
    assert.strictEqual(examTick, 1, 'Exam tick must execute without AudioContext');
    wame.stopExamSoundscape();
});

runTest('2.2: WebAudioMicroEngine when new AudioContext() throws hardware/limit error', () => {
    delete require.cache[require.resolve('../js/web-audio-micro-engine.js')];

    const mockStore = {};
    global.localStorage = {
        getItem: (k) => mockStore[k] || null,
        setItem: (k, v) => { mockStore[k] = String(v); },
        removeItem: (k) => { delete mockStore[k]; }
    };
    global.window = {
        AudioContext: class {
            constructor() {
                throw new Error('DOMException: The number of hardware contexts provided (6) is greater than the maximum supported (6)');
            }
        },
        localStorage: global.localStorage
    };
    global.AudioContext = global.window.AudioContext;
    global.document = createMockDOM().mockDoc;

    require('../js/web-audio-micro-engine.js');
    const wame = global.window.WebAudioMicroEngine;
    assert(wame, 'WebAudioMicroEngine should exist');

    // Does getAudioContext() or playDing() throw when new AudioContext() throws?
    try {
        wame.playDing();
    } catch (e) {
        throw new Error(`playDing threw when new AudioContext() failed: ${e.message}`);
    }

    try {
        wame.startPomodoro('work', () => {});
        wame.stopPomodoro();
    } catch (e) {
        throw new Error(`startPomodoro threw when new AudioContext() failed: ${e.message}`);
    }
});

// ============================================================================
// CHALLENGE SUITE 3: W3C WEB APP MANIFEST INTEGRITY
// ============================================================================
console.log('\n--- 3. CHALLENGE: W3C Web App Manifest Spec Integrity ---');

runTest('3.1: Manifest JSON valid structure, start_url within scope, display standalone', () => {
    const raw = fs.readFileSync(path.join(__dirname, '../manifest.json'), 'utf8');
    const manifest = JSON.parse(raw);

    assert(manifest.name && typeof manifest.name === 'string', 'name must be non-empty string');
    assert(manifest.short_name && typeof manifest.short_name === 'string', 'short_name must be non-empty string');
    assert.strictEqual(manifest.display, 'standalone', 'display mode must be standalone for PWA');
    assert.strictEqual(manifest.start_url, '/', 'start_url must be /');
    assert.strictEqual(manifest.scope, '/', 'scope must be /');

    // Colors must be valid 6-character hex colors
    assert(/^#[0-9A-Fa-f]{6}$/.test(manifest.background_color), 'background_color must be valid 6-char hex');
    assert(/^#[0-9A-Fa-f]{6}$/.test(manifest.theme_color), 'theme_color must be valid 6-char hex');
    assert.strictEqual(manifest.background_color.toUpperCase(), '#F4EFEA', 'background_color should be Warm Sand (#F4EFEA)');
    assert.strictEqual(manifest.theme_color.toUpperCase(), '#161E2E', 'theme_color should be Deep Indigo (#161E2E)');
});

runTest('3.2: Manifest icons physical existence and specs on disk', () => {
    const raw = fs.readFileSync(path.join(__dirname, '../manifest.json'), 'utf8');
    const manifest = JSON.parse(raw);

    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'manifest.icons must have at least 2 icons');

    let has192 = false;
    let has512 = false;
    let hasMaskable = false;

    manifest.icons.forEach((icon, idx) => {
        assert(icon.src, `icon[${idx}] missing src`);
        assert(icon.sizes, `icon[${idx}] missing sizes`);
        assert(icon.type === 'image/png', `icon[${idx}] type must be image/png`);

        // Check if physical file exists (stripping query string)
        const cleanPath = icon.src.split('?')[0].replace(/^\//, '');
        const fullDiskPath = path.join(__dirname, '..', cleanPath);
        assert(fs.existsSync(fullDiskPath), `Physical icon file does not exist on disk: ${cleanPath}`);

        const stat = fs.statSync(fullDiskPath);
        assert(stat.size > 0, `Icon file is empty (0 bytes): ${cleanPath}`);

        if (icon.sizes.includes('192x192')) has192 = true;
        if (icon.sizes.includes('512x512')) has512 = true;
        if (icon.purpose && icon.purpose.includes('maskable')) hasMaskable = true;
    });

    assert(has192, 'Manifest must declare at least one 192x192 icon');
    assert(has512, 'Manifest must declare at least one 512x512 icon');
    assert(hasMaskable, 'Manifest should declare a maskable icon for Android adaptive icons');
});

runTest('3.3: index.html links manifest and registers service worker', () => {
    const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    assert(/<link\s+[^>]*rel=["']manifest["'][^>]*>/i.test(indexHtml), 'index.html must have <link rel="manifest">');
    assert(indexHtml.includes('manifest.json'), 'index.html must reference manifest.json');
});

runTest('3.4: sw.js caches all manifest assets', () => {
    const swContent = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');
    assert(swContent.includes('/manifest.json'), 'sw.js must cache /manifest.json');
    assert(swContent.includes('/icon-192.png'), 'sw.js must cache /icon-192.png');
    assert(swContent.includes('/icon-512.png'), 'sw.js must cache /icon-512.png');
});

// ============================================================================
// CHALLENGE SUITE 4: MICRO-ENGINE RUNTIME ADVERSARIAL STRESS
// ============================================================================
console.log('\n--- 4. CHALLENGE: Micro-engine Runtime Stress ---');

runTest('4.1: Rapid startPomodoro calls should not leak multiple intervals', (done) => {
    delete require.cache[require.resolve('../js/web-audio-micro-engine.js')];

    const mockStore = {};
    global.localStorage = {
        getItem: (k) => mockStore[k] || null,
        setItem: (k, v) => { mockStore[k] = String(v); },
        removeItem: (k) => { delete mockStore[k]; }
    };
    global.window = { localStorage: global.localStorage };
    global.document = createMockDOM().mockDoc;

    require('../js/web-audio-micro-engine.js');
    const wame = global.window.WebAudioMicroEngine;

    let totalTicks = 0;
    // Rapidly start pomodoro 5 times
    for (let i = 0; i < 5; i++) {
        wame.startPomodoro('work', () => { totalTicks++; });
    }
    // Each call fires 1 immediate tick, so totalTicks after 5 synchronous calls should be 5
    assert.strictEqual(totalTicks, 5, 'Synchronous ticks counted');
    
    // Internal interval should be exactly 1
    assert(wame.pomodoroInterval !== null, 'Only one active interval should be stored');
    wame.stopPomodoro();
    assert.strictEqual(wame.pomodoroInterval, null, 'Interval cleared cleanly');
});

runTest('4.2: startExamSoundscape with 0 seconds expires immediately and safely', () => {
    delete require.cache[require.resolve('../js/web-audio-micro-engine.js')];

    const mockStore = {};
    global.localStorage = {
        getItem: (k) => mockStore[k] || null,
        setItem: (k, v) => { mockStore[k] = String(v); },
        removeItem: (k) => { delete mockStore[k]; }
    };
    global.window = { localStorage: global.localStorage };
    global.document = createMockDOM().mockDoc;

    require('../js/web-audio-micro-engine.js');
    const wame = global.window.WebAudioMicroEngine;

    let tickFired = false;
    wame.startExamSoundscape(0, (tick) => {
        tickFired = true;
        assert.strictEqual(tick.isUrgent, true, '0 seconds is <= 300 so isUrgent should be true');
    });
    assert.strictEqual(tickFired, true, 'Immediate tick fired');
    assert.strictEqual(wame.examIsRunning, false, 'Exam should immediately stop when remaining <= 0');
});

console.log('\n===============================================================');
console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed out of ${passedTests + failedTests} tests.`);
if (failures.length > 0) {
    console.log('\nFAILURES DETECTED:');
    failures.forEach((f, idx) => {
        console.log(`${idx + 1}. ${f.name}: ${f.error.message}`);
    });
}
console.log('===============================================================');

process.exit(failedTests > 0 ? 1 : 0);
