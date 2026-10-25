/**
 * Unit Test Suite for ToeicAudioPlayer State Machine & Behavior
 */

const assert = require('assert');

// Mock browser window and DOM environment
class MockAudio {
    constructor() {
        this.src = '';
        this.currentTime = 0;
        this.duration = 60;
        this.playbackRate = 1.0;
        this.preload = 'auto';
        this.crossOrigin = '';
        this.listeners = {};
        this.paused = true;
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    removeEventListener(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    trigger(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    play() {
        this.paused = false;
        return Promise.resolve();
    }

    pause() {
        this.paused = true;
    }

    load() {
        // mock load
    }
}

global.Audio = MockAudio;
global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    showToast: (msg) => { /* mock toast */ }
};
global.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getElementById: (id) => null
};

// Load ToeicAudioPlayer into global context
require('../js/toeic-audio-player.js');

const { AudioState, ToeicAudioPlayer } = global.window;

console.log('--- RUNNING TOEIC AUDIO PLAYER UNIT TESTS ---');

let passedTests = 0;

function it(name, fn) {
    try {
        fn();
        console.log(`[PASS] ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`[FAIL] ${name}`);
        console.error(err);
        process.exit(1);
    }
}

// 1. Initial State
it('Should initialize with IDLE state and practice mode', () => {
    const player = new ToeicAudioPlayer();
    assert.strictEqual(player.getState(), AudioState.IDLE);
    assert.strictEqual(player.mode, 'practice');
    assert.strictEqual(player.currentSpeed, 1.0);
});

// 2. Load & State Transition
it('Should transition to LOADING state on load()', () => {
    const player = new ToeicAudioPlayer();
    let stateHistory = [];
    player.onStateChange = (newState) => stateHistory.push(newState);

    player.load('https://example.com/audio1.mp3');
    assert.strictEqual(player.getState(), AudioState.LOADING);
    assert.strictEqual(player.currentUrl, 'https://example.com/audio1.mp3');
    assert.strictEqual(player.audio.src, 'https://example.com/audio1.mp3');
});

// 3. Play & Pause Transitions
it('Should transition between PLAYING and PAUSED', async () => {
    const player = new ToeicAudioPlayer();
    player.load('https://example.com/audio1.mp3');
    
    player.play();
    // Wait microtask for promise resolution
    await new Promise(r => setImmediate(r));
    assert.strictEqual(player.getState(), AudioState.PLAYING);
    assert.strictEqual(player.audio.paused, false);

    player.pause();
    assert.strictEqual(player.getState(), AudioState.PAUSED);
    assert.strictEqual(player.audio.paused, true);
});

// 4. Speed clamping
it('Should clamp playback speed between 0.5x and 2.0x', () => {
    const player = new ToeicAudioPlayer();
    player.setSpeed(1.25);
    assert.strictEqual(player.currentSpeed, 1.25);
    assert.strictEqual(player.audio.playbackRate, 1.25);

    player.setSpeed(0.1);
    assert.strictEqual(player.currentSpeed, 0.5);

    player.setSpeed(5.0);
    assert.strictEqual(player.currentSpeed, 2.0);
});

// 5. Exam Mode Restrictions
it('Should enforce 1-play rule in exam mode', async () => {
    const player = new ToeicAudioPlayer({ mode: 'exam' });
    assert.strictEqual(player.mode, 'exam');

    player.load('https://example.com/audio1.mp3');
    player.play();
    await new Promise(r => setImmediate(r));
    assert.strictEqual(player.hasPlayedInExamMode, true);
    assert.strictEqual(player.playCount, 1);

    // Try to replay in exam mode
    player.replay();
    // In exam mode, replay should be rejected and playCount remains 1
    assert.strictEqual(player.playCount, 1);

    // Attempting second play should be blocked
    player.play();
    assert.strictEqual(player.playCount, 1);
});

// 6. A-B Loop Controls
it('Should manage A-B looping accurately in practice mode', () => {
    const player = new ToeicAudioPlayer({ mode: 'practice' });
    player.audio.duration = 60;

    // Set A at 5s
    player.audio.currentTime = 5.0;
    player.setPointA();
    assert.strictEqual(player.pointA, 5.0);
    assert.strictEqual(player.isAbLoopActive, false);

    // Set B at 12s
    player.audio.currentTime = 12.0;
    player.setPointB();
    assert.strictEqual(player.pointB, 12.0);
    assert.strictEqual(player.isAbLoopActive, true);
    assert.strictEqual(player.audio.currentTime, 5.0); // Resets to point A

    // Time update: when reaching or exceeding B (12.5s), should jump back to A (5.0s)
    player.audio.currentTime = 12.5;
    player._handleTimeUpdate();
    assert.strictEqual(player.audio.currentTime, 5.0);

    // Clear A-B
    player.clearAB();
    assert.strictEqual(player.pointA, null);
    assert.strictEqual(player.pointB, null);
    assert.strictEqual(player.isAbLoopActive, false);
});

// 7. Error & Fallback handling
it('Should transition to ERROR state and trigger fallback callback', () => {
    let fallbackTriggeredWith = null;
    const player = new ToeicAudioPlayer({
        onErrorFallback: (url) => {
            fallbackTriggeredWith = url;
        }
    });

    player.load('https://example.com/broken.mp3');
    player.audio.trigger('error', new Error('Network timeout'));

    assert.strictEqual(player.getState(), AudioState.ERROR);
    assert.strictEqual(fallbackTriggeredWith, 'https://example.com/broken.mp3');
});

// 8. Seeking
it('Should seek correctly within 0 and duration', () => {
    const player = new ToeicAudioPlayer();
    player.audio.duration = 30;
    player.audio.currentTime = 10;

    player.seek(5);
    assert.strictEqual(player.audio.currentTime, 15);

    player.seek(-10);
    assert.strictEqual(player.audio.currentTime, 5);

    player.seek(-20);
    assert.strictEqual(player.audio.currentTime, 0);

    player.seek(50);
    assert.strictEqual(player.audio.currentTime, 30);
});

console.log(`\nALL ${passedTests} UNIT TESTS PASSED SUCCESSFULLY!`);
