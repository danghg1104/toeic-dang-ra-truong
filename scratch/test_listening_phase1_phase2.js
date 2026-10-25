/**
 * Integration Test for Listening Module Phase 1 & Phase 2
 */
const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('--- RUNNING INTEGRATION TESTS FOR PHASE 1 & PHASE 2 ---');

// Mock DOM & Browser Environment
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
global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    showToast: (msg) => {},
    openAITutorModal: () => {}
};
global.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getElementById: () => ({
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        style: {},
        innerHTML: '',
        textContent: ''
    }),
    createElement: () => ({
        classList: { add: () => {}, remove: () => {} },
        style: {},
        innerHTML: '',
        appendChild: () => {}
    }),
    body: {
        appendChild: () => {}
    }
};

// 1. Load ToeicAudioPlayer and ListeningDatabaseV2
require('../js/toeic-audio-player.js');
require('../js/listening-data-v2.js');
require('../js/full-part-practice.js');

const db = global.window.ListeningDatabaseV2;
const Engine = global.window.FullPartPracticeEngine;

assert(db, 'ListeningDatabaseV2 should be globally available on window');
assert(Engine, 'FullPartPracticeEngine should be globally available on window');

console.log('✅ Modules loaded successfully');

// 2. Validate Questions Counts
const p1Questions = db.getFlattenedQuestions(1);
const p2Questions = db.getFlattenedQuestions(2);
const p3Questions = db.getFlattenedQuestions(3);
const p4Questions = db.getFlattenedQuestions(4);
const all100 = db.getAllMockTestQuestions();

assert.strictEqual(p1Questions.length, 6, 'Part 1 must have 6 questions');
assert.strictEqual(p2Questions.length, 25, 'Part 2 must have 25 questions');
assert.strictEqual(p3Questions.length, 39, 'Part 3 must have 39 questions (13 sets x 3)');
assert.strictEqual(p4Questions.length, 30, 'Part 4 must have 30 questions (10 sets x 3)');
assert.strictEqual(all100.length, 100, 'Mock test must contain exactly 100 questions');

console.log('✅ Question counts verified: 6 + 25 + 39 + 30 = 100 questions');

// 3. Score Conversion Scale
const score0 = db.calculateScore(0);
const score50 = db.calculateScore(50);
const score85 = db.calculateScore(85);
const score100 = db.calculateScore(100);

assert.strictEqual(score0.scaledScore, 5, 'Score for 0 correct should be 5');
assert(score50.scaledScore >= 250 && score50.scaledScore <= 270, 'Score for 50 correct should be ~255');
assert(score85.scaledScore >= 450, 'Score for 85 correct should be ~465');
assert.strictEqual(score100.scaledScore, 495, 'Score for 100 correct should be 495');

console.log(`✅ Score calculation verified (0 -> ${score0.scaledScore}, 50 -> ${score50.scaledScore}, 100 -> ${score100.scaledScore})`);

// 4. Test FullPartPracticeEngine startPart for Part 3 & 4
Engine.startPart(3, 'practice');
assert.strictEqual(Engine.currentPart, 3, 'Current part should be 3');
assert.strictEqual(Engine.activeQuestions.length, 39, 'Engine activeQuestions for Part 3 should be 39');
assert.strictEqual(Engine.mode, 'practice', 'Engine mode should be practice');

Engine.startPart(4, 'exam');
assert.strictEqual(Engine.currentPart, 4, 'Current part should be 4');
assert.strictEqual(Engine.activeQuestions.length, 30, 'Engine activeQuestions for Part 4 should be 30');
assert.strictEqual(Engine.mode, 'exam', 'Engine mode should be exam');

console.log('✅ FullPartPracticeEngine Part 3 & 4 integration verified');

// 5. Test Server HTTP Audio Streaming for all parts
function testAudioUrl(url) {
    return new Promise((resolve, reject) => {
        const req = http.request(`http://localhost:3000${url}`, {
            headers: { 'Range': 'bytes=0-100' }
        }, res => {
            if (res.statusCode === 206 || res.statusCode === 200) {
                resolve({ status: res.statusCode, length: res.headers['content-length'] });
            } else {
                reject(new Error(`Status ${res.statusCode} for ${url}`));
            }
        });
        req.on('error', reject);
        req.end();
    });
}

async function testAllAudioSamples() {
    const samples = [
        '/audio/listening/part1/p1_q01.mp3',
        '/audio/listening/part1/p1_q06.mp3',
        '/audio/listening/part2/p2_q01.mp3',
        '/audio/listening/part2/p2_q25.mp3',
        '/audio/listening/part3/p3_set01.mp3',
        '/audio/listening/part3/p3_set13.mp3',
        '/audio/listening/part4/p4_set01.mp3',
        '/audio/listening/part4/p4_set10.mp3'
    ];

    for (const url of samples) {
        const res = await testAudioUrl(url);
        console.log(`  🎵 Checked ${url} -> HTTP ${res.status}`);
    }
}

testAllAudioSamples().then(() => {
    console.log('\n🎉 ALL INTEGRATION TESTS PASSED 100%!');
    process.exit(0);
}).catch(err => {
    console.error('❌ Integration test failed:', err);
    process.exit(1);
});
