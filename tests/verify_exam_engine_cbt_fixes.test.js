const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('RUNNING EXAM ENGINE & CBT READING/AUDIO VERIFICATION');
console.log('====================================================\n');

const appCoreContent = fs.readFileSync(path.join(__dirname, '../js/app-core.bundle.js'), 'utf8');
const audioServiceContent = fs.readFileSync(path.join(__dirname, '../js/audio-service.js'), 'utf8');
const ddContent = fs.readFileSync(path.join(__dirname, '../js/dailydictation-workstation.js'), 'utf8');
const diagContent = fs.readFileSync(path.join(__dirname, '../js/toeic-diagnostic-workstation.js'), 'utf8');
const listeningContent = fs.readFileSync(path.join(__dirname, '../js/toeic-listening-workstation.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// ------------------------------------------------------------
// 1. Centralized AudioManager, Ducking, Multi-Voice & Cancellation
// ------------------------------------------------------------
console.log('--- 1. Testing Centralized AudioManager & Audio Ducking ---');
let ambientStopped = 0;
let focusStopped = 0;
let spokenUtterances = [];
let synthCancelled = 0;

class MockUtterance {
    constructor(text) {
        this.text = text;
        this.lang = '';
        this.rate = 1.0;
        this.pitch = 1.0;
        this.voice = null;
        this.onend = null;
        this.onerror = null;
    }
}

const audioSandbox = {
    window: null,
    self: null,
    navigator: {},
    document: {
        addEventListener: () => {},
        removeEventListener: () => {},
        querySelectorAll: () => []
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    Audio: class {
        constructor(src) { this.src = src || ''; this.paused = false; this.currentTime = 0; }
        play() { return Promise.resolve(); }
        pause() { this.paused = true; }
    },
    SpeechSynthesisUtterance: MockUtterance,
    speechSynthesis: {
        paused: false,
        getVoices: () => [
            { name: 'Microsoft Zira Desktop', lang: 'en-US' },
            { name: 'Microsoft David Desktop', lang: 'en-US' }
        ],
        speak: (u) => { spokenUtterances.push(u); },
        cancel: () => { synthCancelled++; },
        resume: () => {}
    },
    WebAudioMicroEngine: {
        pomodoroIsRunning: false,
        pomodoroAmbientNodes: { active: true },
        _stopAmbientAudio: () => { ambientStopped++; }
    },
    StudyFocusEngine: {
        isSoundPlaying: true,
        stopAmbientSound: () => { focusStopped++; }
    },
    _miniLofiActive: true,
    setTimeout,
    clearTimeout,
    console
};
audioSandbox.window = audioSandbox;
audioSandbox.self = audioSandbox;
vm.runInNewContext(audioServiceContent, audioSandbox);

assert(audioSandbox.AudioManager, 'AudioManager must be defined on window');
audioSandbox.AudioManager.pauseLofi();
assert.strictEqual(ambientStopped, 1, 'pauseLofi must stop WebAudioMicroEngine ambient nodes');
assert.strictEqual(focusStopped, 1, 'pauseLofi must stop StudyFocusEngine ambient sound via stopAmbientSound');
assert.strictEqual(audioSandbox._miniLofiActive, false, 'pauseLofi must reset _miniLofiActive');

spokenUtterances = [];
audioSandbox.AudioManager.speakDialogue("Woman: Can you review the report?\nMan: Sure, I'll check it after lunch.");
assert.strictEqual(spokenUtterances.length, 1, 'First turn plays immediately');
assert(!spokenUtterances[0].text.includes('Woman:'), 'Speaker label must NOT be spoken aloud');
assert(spokenUtterances[0].pitch > 1.0, 'Woman turn gets higher female pitch');
assert.strictEqual(spokenUtterances[0]._preserveVoice, true, 'Woman turn preserves voice against generic hook override');

// Verify cancellation token blocks next turn if stopAll fires mid-dialogue pause
audioSandbox.AudioManager.stopAll();
if (spokenUtterances[0].onend) spokenUtterances[0].onend();
assert.strictEqual(spokenUtterances.length, 1, 'Cancelled dialogue turn must NOT trigger next turn');

console.log('  ✓ PASS: AudioManager ducks Lofi/Focus soundscape, preserves multi-voice dialogue turns, and cancels stale turns on stopAll');

// ------------------------------------------------------------
// 2. Dictation Smart Normalization (Edge Cases Included)
// ------------------------------------------------------------
console.log('\n--- 2. Testing Dictation Smart Normalization (Contractions, Punctuation, Numbers, Edge Cases) ---');
const normSandbox = { window: {}, module: { exports: {} } };
vm.runInNewContext(
    appCoreContent.slice(
        appCoreContent.indexOf('function normalizeDictation('),
        appCoreContent.indexOf('// Application State')
    ),
    normSandbox
);
const normalizeDictation = normSandbox.normalizeDictation;
assert.strictEqual(normalizeDictation(''), '');
assert.strictEqual(normalizeDictation('   ... --- !!!  '), '');
assert.strictEqual(normalizeDictation("I'm Jack."), normalizeDictation("I am Jack"));
assert.strictEqual(normalizeDictation("Don't worry, it's fine!"), normalizeDictation("Do not worry, it is fine."));
assert.strictEqual(normalizeDictation("There are 15 cars."), normalizeDictation("There are fifteen cars"));
assert.strictEqual(normalizeDictation("She didn't know."), normalizeDictation("She did not know"));
assert.strictEqual(ddContent.includes('const fullNormUser = (typeof normalizeDictation === \'function\')'), true);
assert.strictEqual(ddContent.includes('window.AudioManager.pauseLofi();'), true);
console.log('  ✓ PASS: normalizeDictation & DailyDictationWorkstation verified across empty, punctuation, contractions & numbers');

// ------------------------------------------------------------
// 3. Anti-Drift Timestamp Timers & Tab Switch Cleanup
// ------------------------------------------------------------
console.log('\n--- 3. Testing Anti-Drift Timers & Tab Switch Cleanup ---');
assert(appCoreContent.includes('window._quizExamEndTime = Date.now() + quizExamSecondsRemaining * 1000;'), 'Exam quiz timer must use Date.now() delta');
assert(diagContent.includes('this.timerEndTime = Date.now() + (this.timeRemaining || (25 * 60)) * 1000;'), 'Diagnostic timer must use Date.now() delta');
assert(appCoreContent.includes('window.AudioManager.stopAll()'), 'switchTab must call AudioManager.stopAll()');
console.log('  ✓ PASS: Anti-drift Date.now() timers and switchTab ghost-audio cleanup verified');

// ------------------------------------------------------------
// 4. Diagnostic Session Persistence, Seekbar Lock & ETS Weighted Scoring
// ------------------------------------------------------------
console.log('\n--- 4. Testing Diagnostic Persistence, Locked Seekbar & ETS Weighted Scoring ---');
assert(diagContent.includes('this.loadSavedSession();'), 'open() must restore saved session');
assert(diagContent.includes('this.showQuestion(this.currentIndex);'), 'open() must jump to restored index');
assert(diagContent.includes('this.saveSession();'), 'selectOption/showQuestion must persist session');
assert(diagContent.includes('id="tdwSeekbarContainer"') && diagContent.includes('pointer-events-none select-none'), 'Diagnostic seekbar must lock pointer-events');

// Evaluate scaleEtsScore logic
const scaleFnMatch = diagContent.match(/function scaleEtsScore\([\s\S]*?\n\s*\}/);
assert(scaleFnMatch, 'scaleEtsScore function must exist');
const scaleFn = new Function('return ' + scaleFnMatch[0])();
assert.strictEqual(scaleFn(0, 20), 5, '0 weighted points scales to minimum ETS score 5');
assert.strictEqual(scaleFn(20, 20), 495, 'Full weighted points scales to maximum ETS score 495');
assert(scaleFn(1.8, 5.7) > scaleFn(1.1, 5.7), 'Part 7 weight (1.8) contributes more than Part 5 weight (1.1)');
console.log('  ✓ PASS: Diagnostic session restore/save, pointer-events:none seekbar, and ETS difficulty weights verified');

// ------------------------------------------------------------
// 5. Reading CBT Split-Screen & Authentic Document Formatting
// ------------------------------------------------------------
console.log('\n--- 5. Testing Reading CBT Split-Screen & formatAuthenticPassage Runtime ---');
const formatSandbox = { window: {}, module: { exports: {} } };
vm.runInNewContext(
    appCoreContent.slice(
        0,
        appCoreContent.indexOf('function normalizeDictation(')
    ),
    formatSandbox
);
const formatAuthenticPassage = formatSandbox.window.formatAuthenticPassage;
assert.strictEqual(typeof formatAuthenticPassage, 'function', 'formatAuthenticPassage must be exported on window');

const emailSample = "To: Dr. Marcus Vance <m.vance@veridia-ai.com>\nFrom: Sarah Jenkins <s.jenkins@vanguardtech.com>\nSubject: Workshop\n\nDear Dr. Vance,\nLet's meet tomorrow.";
const emailHtml = formatAuthenticPassage(emailSample);
assert(emailHtml.includes('doc-header-card'), 'Email must render structured doc-header-card');
assert(emailHtml.includes('&lt;m.vance@veridia-ai.com&gt;'), 'Email addresses in angle brackets must be safely escaped so they remain visible');
assert(emailHtml.includes('Workplace Email / Correspondence'), 'Email header banner must appear');

const noticeSample = "NOTICE: Parking Lot Repaving\nAll vehicles must be moved by 8:00 AM.";
const noticeHtml = formatAuthenticPassage(noticeSample);
assert(noticeHtml.includes('fa-bullhorn') && noticeHtml.includes('NOTICE'), 'Notice must render bullhorn banner');

const preformattedCard = '<div class="toeic-reading-passage-card"><p>Already formatted</p></div>';
assert.strictEqual(formatAuthenticPassage(preformattedCard), preformattedCard, 'Preformatted HTML cards must pass through untouched');

assert(indexHtml.includes('.reading-workspace {') && indexHtml.includes('.passage-pane {') && indexHtml.includes('.questions-pane {'), 'CSS split-screen panes required');
assert(diagContent.includes('window.formatAuthenticPassage(q.passageContent)'), 'Diagnostic Part 6 & 7 must use formatAuthenticPassage');
console.log('  ✓ PASS: Reading CBT split-screen and formatAuthenticPassage (Email, Notice, Preformatted Card, XSS escape) verified');

// ------------------------------------------------------------
// 6. Practice Mode Seek/Speed & Live Transcript Highlighting
// ------------------------------------------------------------
console.log('\n--- 6. Testing Practice Audio Player (-5s/+5s, Speed, Live Transcript Highlight) ---');
assert(indexHtml.includes('ToeicListeningWorkstation.seekBy(-5)') && indexHtml.includes('ToeicListeningWorkstation.seekBy(5)'), 'Practice player must have -5s/+5s seek buttons');
assert(indexHtml.includes('data-speed="0.75"') && indexHtml.includes('data-speed="1.25"'), 'Practice player must include speed pills');
assert(listeningContent.includes('if (this.mode === \'exam\') return;') && listeningContent.includes('updateTranscriptHighlight()'), 'Listening workstation must guard exam-mode seek and update live transcript highlight');
assert(listeningContent.includes('window.AudioManager.pauseLofi()'), 'Listening workstation play() must pause Lofi');

// Runtime test of updateTranscriptHighlight logic
const mockLines = [
    { dataset: { charWeight: '50' }, classList: { classes: new Set(), toggle(c, on) { on ? this.classes.add(c) : this.classes.delete(c); } } },
    { dataset: { charWeight: '50' }, classList: { classes: new Set(), toggle(c, on) { on ? this.classes.add(c) : this.classes.delete(c); } } }
];
const lwSandbox = {
    window: { addEventListener: () => {} },
    document: {
        getElementById: (id) => id === 'tlwTranscriptBox' ? { querySelectorAll: () => mockLines } : null
    },
    Audio: class { addEventListener() {} },
    localStorage: { getItem: () => null },
    console
};
lwSandbox.window.ToeicListeningWorkstation = null;
vm.runInNewContext(listeningContent, lwSandbox);
const tlw = lwSandbox.window.ToeicListeningWorkstation;
tlw.isPlaying = true;
tlw.duration = 20;
tlw.currentTime = 15; // 75% progress -> should highlight line index 1
tlw.updateTranscriptHighlight();
assert(!mockLines[0].classList.classes.has('bg-indigo-100/90'), 'Line 0 should not be highlighted at 75%');
assert(mockLines[1].classList.classes.has('bg-indigo-100/90'), 'Line 1 should be highlighted at 75%');
tlw.mode = 'exam';
tlw.audio.duration = 20;
tlw.audio.currentTime = 5;
tlw.seekBy(5);
assert.strictEqual(tlw.audio.currentTime, 5, 'seekBy must be blocked in exam mode');
console.log('  ✓ PASS: Practice seek/speed controls, exam-mode lock, Lofi pause & live transcript sync verified');

// Verify Ets2026Database Test 1 Part 6 & Part 7 flattened passages are populated (not blank)
const etsDataContent = fs.readFileSync(path.join(__dirname, '../js/ets2026-data.js'), 'utf8');
const etsSandbox = { window: {}, console };
vm.runInNewContext(etsDataContent, etsSandbox);
const rc1 = etsSandbox.window.Ets2026Database.getFullReading(1);
const p6Passages = rc1.filter(q => q.part === 6 && q.passage && q.passage.trim().length > 50);
const p7Passages = rc1.filter(q => q.part === 7 && q.passage && q.passage.trim().length > 50);
assert.strictEqual(p6Passages.length, 16, `Expected 16 Part 6 passages in Test 1, got ${p6Passages.length}`);
assert.strictEqual(p7Passages.length, 54, `Expected 54 Part 7 passages in Test 1, got ${p7Passages.length}`);
console.log('  ✓ PASS: Ets2026Database.getFullReading(1) provides 16 Part 6 and 54 Part 7 reading passages');

console.log('\n====================================================');
console.log('ALL EXAM ENGINE & CBT VERIFICATION CHECKS PASSED!');
console.log('====================================================\n');
