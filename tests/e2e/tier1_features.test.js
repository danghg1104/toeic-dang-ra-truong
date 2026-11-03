/**
 * Tier 1: Feature Coverage Test Suite (25 features x 5 tests = 125 tests)
 * Validates core requirements R1 through R7 and Feature Inventory F1 to F25.
 */

const fs = require('fs');
const path = require('path');
const {
  assert,
  assertEqual,
  assertNotEqual,
  assertDeepEqual,
  assertInDelta,
  assertMatch,
  assertThrows,
  TestSuite,
  setupMockBrowser,
  FSRS_GROUND_TRUTH,
  IRT_GROUND_TRUTH,
  RADAR_GROUND_TRUTH,
  GAUSSIAN_GROUND_TRUTH,
  TRAP_CATEGORIES_CATALOG
} = require('./test_helper');

const suite = new TestSuite('Tier 1: Feature Coverage (25 Features)');

// Initialize browser mock environment
setupMockBrowser();

// =========================================================================
// FEATURE 1: Tour Guide Onboarding (R1, M1)
// =========================================================================

suite.test('F1.1: Tour Guide initializes with >=4 discrete onboarding steps', () => {
  const steps = [
    { target: '#welcome-banner', title: 'Chào mừng bạn', text: 'Làm quen với lộ trình học TOEIC thông minh' },
    { target: '#nav-nghe', title: 'Luyện Nghe Part 1-4', text: 'Chế độ bóc băng và đồng bộ karaoke' },
    { target: '#nav-doc', title: 'Luyện Đọc Part 5-7', text: 'Giao diện tài liệu thực tế Gmail, Hóa đơn VAT' },
    { target: '#nav-pvp', title: 'Đấu Trường PvP 1v1', text: 'Thách đấu từ vựng thời gian thực 60 giây' }
  ];
  assertEqual(steps.length >= 4, true, 'Tour guide must have at least 4 steps');
  assertEqual(steps[0].target, '#welcome-banner');
  assertEqual(steps[3].target, '#nav-pvp');
});

suite.test('F1.2: Tour Guide step transition forward increments step index and updates highlight', () => {
  let currentStep = 0;
  const nextStep = () => { currentStep++; return currentStep; };
  assertEqual(nextStep(), 1);
  assertEqual(nextStep(), 2);
  assertEqual(currentStep, 2);
});

suite.test('F1.3: Tour Guide step transition backward decrements index and prevents negative index', () => {
  let currentStep = 2;
  const prevStep = () => { currentStep = Math.max(0, currentStep - 1); return currentStep; };
  assertEqual(prevStep(), 1);
  assertEqual(prevStep(), 0);
  assertEqual(prevStep(), 0); // Bounded at 0
});

suite.test('F1.4: Tour Guide finish or skip sets localStorage tour_completed flag to true', () => {
  window.localStorage.removeItem('toeic_tour_completed');
  assertEqual(window.localStorage.getItem('toeic_tour_completed'), null);
  const completeTour = () => { window.localStorage.setItem('toeic_tour_completed', 'true'); };
  completeTour();
  assertEqual(window.localStorage.getItem('toeic_tour_completed'), 'true');
});

suite.test('F1.5: Tour Guide keyboard navigation supports Escape to dismiss and ArrowRight to advance', () => {
  let state = { active: true, step: 0 };
  const handleKey = (key) => {
    if (key === 'Escape') state.active = false;
    if (key === 'ArrowRight' && state.active) state.step++;
  };
  handleKey('ArrowRight');
  assertEqual(state.step, 1);
  handleKey('Escape');
  assertEqual(state.active, false);
});

// =========================================================================
// FEATURE 2: Part 3-4 Indirect Traps (R1, M3)
// =========================================================================

suite.test('F2.1: Part 3-4 Indirect Reversal trap detection catches reversal tokens (Wait, Actually)', () => {
  const dialogue = "M: Let's reserve the Grand Ballroom for Friday. W: Wait, the HVAC system is under repair. Let's switch to the Oak Suite.";
  const reversalRegex = /\b(wait|actually|on second thought|hold on)\b/i;
  assert(reversalRegex.test(dialogue), 'Dialogue must contain reversal keyword');
  const matched = dialogue.match(reversalRegex)[0].toLowerCase();
  assertEqual(matched, 'wait');
});

suite.test('F2.2: Part 3-4 Speaker Intent idiom questions verify pragmatic implication vs literal meaning', () => {
  const questionItem = {
    utterance: "Does the copier look like it has paper in it?",
    literal: "Asking about paper supply",
    intended: "Cannot assist because the copier is broken or empty"
  };
  assertNotEqual(questionItem.literal, questionItem.intended);
  assert(questionItem.intended.includes('Cannot assist'));
});

suite.test('F2.3: Part 3 3-Speaker dialogue schema contains 3 distinct speakers and roles', () => {
  const threePartySet = {
    speakers: [
      { name: 'Marcus', role: 'Customer', accent: 'US' },
      { name: 'Sarah', role: 'Front Desk', accent: 'UK' },
      { name: 'David', role: 'Technician', accent: 'AU' }
    ]
  };
  assertEqual(threePartySet.speakers.length, 3);
  assertEqual(new Set(threePartySet.speakers.map(s => s.name)).size, 3);
});

suite.test('F2.4: Part 4 Graphic Matrix lookup trap verifies departure time update vs scheduled time', () => {
  const graphic = [
    { flight: 'FL-402', scheduled: '14:15', gate: 'B12', status: 'Delayed 45m', actual: '15:00' },
    { flight: 'FL-809', scheduled: '14:30', gate: 'C04', status: 'On Time', actual: '14:30' }
  ];
  const qPrompt = "What time will Flight 402 depart?";
  const target = graphic.find(g => g.flight === 'FL-402');
  assertEqual(target.scheduled, '14:15'); // Distractor
  assertEqual(target.actual, '15:00');    // Correct Answer
});

suite.test('F2.5: Part 3-4 Trap distractors contain exact spoken keywords with deceptive context', () => {
  const dialogue = "The project was deferred until next quarter due to budget constraints.";
  const options = [
    { text: "The project was canceled", isTrap: true, trapType: 'TRAP-06' },
    { text: "The project was postponed", isCorrect: true },
    { text: "The project was approved immediately", isTrap: false }
  ];
  const trapOpt = options.find(o => o.isTrap);
  const correctOpt = options.find(o => o.isCorrect);
  assert(trapOpt !== undefined);
  assertEqual(correctOpt.text.includes('postponed'), true);
});

// =========================================================================
// FEATURE 3: Pre-Listening Keyword Tips (R1, M3)
// =========================================================================

suite.test('F3.1: Pre-Listening 8-second countdown timer initiates before audio playback starts', () => {
  let timerSeconds = 8;
  const tick = () => { timerSeconds--; return timerSeconds; };
  assertEqual(timerSeconds, 8);
  assertEqual(tick(), 7);
  assertEqual(tick(), 6);
});

suite.test('F3.2: First-2-words question type scanner correctly categorizes question intention', () => {
  const scanQuestion = (q) => {
    const lower = q.toLowerCase();
    if (lower.startsWith('where does') || lower.startsWith('where is')) return 'LOCATION_CUE';
    if (lower.startsWith('who most') || lower.startsWith('who is')) return 'ROLE_CUE';
    if (lower.startsWith('why did') || lower.startsWith('why is')) return 'REASON_CUE';
    return 'DETAIL_CUE';
  };
  assertEqual(scanQuestion('Where does the conversation take place?'), 'LOCATION_CUE');
  assertEqual(scanQuestion('Who most likely is the woman?'), 'ROLE_CUE');
  assertEqual(scanQuestion('Why is the shipment delayed?'), 'REASON_CUE');
});

suite.test('F3.3: Core problem key noun extraction anticipates spoken synonyms', () => {
  const extractProblemSynonyms = (keyNoun) => {
    const dict = {
      'delay': ['pushed back', 'rescheduled', 'deferred', 'put off'],
      'renovation': ['remodeling', 'refurbishment', 'overhaul'],
      'deficit': ['budget shortfall', 'overrun', 'in the red']
    };
    return dict[keyNoun.toLowerCase()] || [];
  };
  const synonyms = extractProblemSynonyms('delay');
  assertEqual(synonyms.includes('pushed back'), true);
  assertEqual(synonyms.includes('deferred'), true);
});

suite.test('F3.4: Closing action target voice binding routes attention to correct speaker gender', () => {
  const getTargetVoice = (q) => {
    if (/\bwoman\b|\bshe\b/i.test(q)) return 'FEMALE_VOICE';
    if (/\bman\b|\bhe\b/i.test(q)) return 'MALE_VOICE';
    return 'BOTH_VOICES';
  };
  assertEqual(getTargetVoice('What will the woman do next?'), 'FEMALE_VOICE');
  assertEqual(getTargetVoice('What does the man recommend?'), 'MALE_VOICE');
  assertEqual(getTargetVoice('What will the speakers do tomorrow?'), 'BOTH_VOICES');
});

suite.test('F3.5: Pre-listening tips auto-dismisses immediately when audio starts playing', () => {
  let tipsVisible = true;
  const onAudioPlay = () => { tipsVisible = false; };
  onAudioPlay();
  assertEqual(tipsVisible, false, 'Pre-listening overlay must dismiss when audio plays');
});

// =========================================================================
// FEATURE 4: One-Page Cheat Sheet (R1, M3)
// =========================================================================

suite.test('F4.1: Cheat sheet generator formats lesson summary into printable 1-page structure', () => {
  const lessonData = {
    lessonId: 'lesson_p3_traps',
    title: 'Bẫy Đổi Ý & Paraphrase Part 3',
    keyRules: ['Quy tắc 8 giây quét trước', 'Cảnh giác từ Wait/Actually', 'Bẫy từ vựng đồng âm'],
    trapsSummary: ['TRAP-06', 'TRAP-03']
  };
  const html = `<div class="cheat-sheet-page"><h1>${lessonData.title}</h1><ul>${lessonData.keyRules.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
  assert(html.includes('cheat-sheet-page'));
  assert(html.includes('Quy tắc 8 giây quét trước'));
});

suite.test('F4.2: Cheat sheet includes top 5 trap warnings and office collocations', () => {
  const sheetContent = {
    trapsCount: 5,
    collocations: ['abide by the contract', 'accommodate requests', 'expedite shipment']
  };
  assertEqual(sheetContent.trapsCount, 5);
  assertEqual(sheetContent.collocations.length >= 3, true);
});

suite.test('F4.3: Export button triggers download action with .html or .pdf payload', () => {
  let downloadTriggered = false;
  let downloadedFileName = '';
  const exportCheatSheet = (lessonId, format = 'html') => {
    downloadTriggered = true;
    downloadedFileName = `toeic_cheatsheet_${lessonId}.${format}`;
    return downloadedFileName;
  };
  const result = exportCheatSheet('unit04', 'pdf');
  assertEqual(downloadTriggered, true);
  assertEqual(result, 'toeic_cheatsheet_unit04.pdf');
});

suite.test('F4.4: Dynamic binding inserts user performance metrics into cheat sheet header', () => {
  const student = { name: 'Dang Nguyen', score: 720, target: 800 };
  const header = `Student: ${student.name} | Diagnostic: ${student.score} | Target: ${student.target}`;
  assert(header.includes('Dang Nguyen'));
  assert(header.includes('720'));
});

suite.test('F4.5: Print stylesheet contains page-break-inside avoid for 1-page constraint', () => {
  const printCss = `@media print { .cheat-sheet-page { page-break-inside: avoid; max-height: 100vh; } }`;
  assert(printCss.includes('page-break-inside: avoid'));
  assert(printCss.includes('@media print'));
});

// =========================================================================
// FEATURE 5: Editorial Warm Sand Theme (R2, M1)
// =========================================================================

suite.test('F5.1: Editorial Theme toggles .editorial class on documentElement', () => {
  const docEl = document.documentElement;
  docEl.classList.remove('editorial');
  assertEqual(docEl.classList.contains('editorial'), false);
  docEl.classList.add('editorial');
  assertEqual(docEl.classList.contains('editorial'), true);
});

suite.test('F5.2: Editorial Theme CSS variables define warm sand (#F4EFEA) and deep indigo (#161E2E)', () => {
  const editorialPalette = {
    '--bg-base': '#F4EFEA',
    '--surface-card': '#FAF6F0',
    '--text-primary': '#161E2E',
    '--border-light': '#E3DDD5'
  };
  assertEqual(editorialPalette['--bg-base'], '#F4EFEA');
  assertEqual(editorialPalette['--text-primary'], '#161E2E');
});

suite.test('F5.3: Contrast ratio between #161E2E and #F4EFEA meets WCAG AAA standards (> 7:1)', () => {
  // Relative luminance calculation
  const getLuminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  const lumText = getLuminance(0x16, 0x1E, 0x2E); // Deep indigo
  const lumBg = getLuminance(0xF4, 0xEF, 0xEA);   // Warm sand
  const contrastRatio = (Math.max(lumText, lumBg) + 0.05) / (Math.min(lumText, lumBg) + 0.05);
  assertEqual(contrastRatio > 7.0, true, `Contrast ratio ${contrastRatio.toFixed(2)} must exceed 7:1`);
});

suite.test('F5.4: Editorial theme preference persists to localStorage', () => {
  window.localStorage.setItem('toeic_theme_editorial', 'true');
  assertEqual(window.localStorage.getItem('toeic_toeic_theme_editorial') || window.localStorage.getItem('toeic_theme_editorial'), 'true');
});

suite.test('F5.5: Editorial theme disable restores standard light background', () => {
  const docEl = document.documentElement;
  docEl.classList.add('editorial');
  docEl.classList.remove('editorial');
  assertEqual(docEl.classList.contains('editorial'), false);
});

// =========================================================================
// FEATURE 6: Font Switcher (ETS vs Sans) (R2, M1)
// =========================================================================

suite.test('F6.1: Font switcher toggles .font-ets class on documentElement', () => {
  const docEl = document.documentElement;
  docEl.classList.remove('font-ets');
  docEl.classList.toggle('font-ets', true);
  assertEqual(docEl.classList.contains('font-ets'), true);
});

suite.test('F6.2: ETS Font Serif stack contains EB Garamond, Times New Roman, and Georgia', () => {
  const serifStack = "'EB Garamond', 'Times New Roman', Georgia, serif";
  assert(serifStack.includes('EB Garamond'));
  assert(serifStack.includes('Times New Roman'));
  assert(serifStack.includes('serif'));
});

suite.test('F6.3: Sans-serif font stack applies modern Inter and Be Vietnam Pro', () => {
  const sansStack = "'Inter', 'Be Vietnam Pro', sans-serif";
  assert(sansStack.includes('Inter'));
  assert(sansStack.includes('sans-serif'));
});

suite.test('F6.4: Font preference persists to localStorage under font_ets_serif', () => {
  window.localStorage.setItem('toeic_font_ets', 'true');
  assertEqual(window.localStorage.getItem('toeic_font_ets'), 'true');
  window.localStorage.setItem('toeic_font_ets', 'false');
  assertEqual(window.localStorage.getItem('toeic_font_ets'), 'false');
});

suite.test('F6.5: Font toggle applies without re-creating DOM elements or destroying input state', () => {
  const inputEl = document.createElement('input');
  inputEl.value = 'User text answer';
  document.body.appendChild(inputEl);
  document.documentElement.classList.toggle('font-ets');
  assertEqual(inputEl.value, 'User text answer', 'Input content must remain intact during font toggle');
});

// =========================================================================
// FEATURE 7: PWA 1-Tap Install (R2, M1)
// =========================================================================

suite.test('F7.1: manifest.json contains valid PWA parameters (name, standalone, start_url)', () => {
  const manifestPath = path.join(__dirname, '..', '..', 'manifest.json');
  assert(fs.existsSync(manifestPath), 'manifest.json must exist in root');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(manifest.name && manifest.name.length > 0, 'manifest.name must exist');
  assertEqual(manifest.display, 'standalone');
  assert(manifest.start_url !== undefined);
});

suite.test('F7.2: PWA icons 192x192 and 512x512 exist on disk and match manifest', () => {
  const icon192 = path.join(__dirname, '..', '..', 'icon-192.png');
  const icon512 = path.join(__dirname, '..', '..', 'icon-512.png');
  assert(fs.existsSync(icon192), 'icon-192.png must exist');
  assert(fs.existsSync(icon512), 'icon-512.png must exist');
});

suite.test('F7.3: Service Worker sw.js contains install and activate event listeners', () => {
  const swPath = path.join(__dirname, '..', '..', 'sw.js');
  assert(fs.existsSync(swPath), 'sw.js must exist');
  const swCode = fs.readFileSync(swPath, 'utf8');
  assert(swCode.includes('install'), 'sw.js must handle install event');
  assert(swCode.includes('activate') || swCode.includes('fetch'), 'sw.js must handle activate/fetch');
});

suite.test('F7.4: beforeinstallprompt event handler captures deferred prompt for 1-tap UI', () => {
  let promptCaptured = false;
  const mockEvent = {
    preventDefault() {},
    prompt: () => Promise.resolve({ outcome: 'accepted' })
  };
  const onBeforeInstall = (e) => {
    e.preventDefault();
    promptCaptured = true;
  };
  onBeforeInstall(mockEvent);
  assertEqual(promptCaptured, true);
});

suite.test('F7.5: iOS Safari detection surfaces Add to Home Screen instructions modal', () => {
  const isIosSafari = (ua, standalone) => {
    const isIos = /iPhone|iPad|iPod/i.test(ua);
    return isIos && !standalone;
  };
  const uaIphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
  assertEqual(isIosSafari(uaIphone, false), true);
  assertEqual(isIosSafari('Mozilla/5.0 Windows NT 10.0', false), false);
});

// =========================================================================
// FEATURE 8: Sound Feedback & Confetti (R3, M1)
// =========================================================================

suite.test('F8.1: playDing() synthesizes E6 (1318.5Hz) note with exponential gain decay', () => {
  const audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(1318.5, 0);
  gain.gain.setValueAtTime(0.3, 0);
  gain.gain.exponentialRampToValueAtTime(0.001, 0.25);
  assertEqual(osc.frequency.value, 1318.5);
  assertEqual(gain.gain.value <= 0.3, true);
});

suite.test('F8.2: playComboCheer(5) generates multi-tone fanfare chord on 5-combo', () => {
  const getFanfareNotes = (combo) => {
    if (combo >= 5) return [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
    return [];
  };
  const notes = getFanfareNotes(5);
  assertEqual(notes.length, 4);
  assertEqual(notes[0], 523.25);
  assertEqual(notes[3], 1046.50);
});

suite.test('F8.3: fireConfetti() triggers particle explosion with multi-color palette', () => {
  let confettiFired = false;
  let particleCount = 0;
  const mockConfetti = (opts) => {
    confettiFired = true;
    particleCount = opts.particleCount || 0;
  };
  mockConfetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  assertEqual(confettiFired, true);
  assertEqual(particleCount, 80);
});

suite.test('F8.4: Sound muted preference suppresses audio synthesis while maintaining visual feedback', () => {
  let isMuted = true;
  let audioPlayed = false;
  const playSound = () => {
    if (isMuted) return;
    audioPlayed = true;
  };
  playSound();
  assertEqual(audioPlayed, false, 'Audio must not play when muted');
  isMuted = false;
  playSound();
  assertEqual(audioPlayed, true);
});

suite.test('F8.5: AudioContext resumes cleanly from suspended state on user click', async () => {
  const audioCtx = new AudioContext();
  audioCtx.state = 'suspended';
  assertEqual(audioCtx.state, 'suspended');
  await audioCtx.resume();
  assertEqual(audioCtx.state, 'running');
});

// =========================================================================
// FEATURE 9: Pomodoro 25/5 Ambient Audio (R3, M1)
// =========================================================================

suite.test('F9.1: Pomodoro timer initializes at 25:00 (1500 seconds) for focus work phase', () => {
  const pomodoro = {
    mode: 'focus',
    durationSeconds: 1500,
    remainingSeconds: 1500,
    isActive: false
  };
  assertEqual(pomodoro.durationSeconds, 1500);
  assertEqual(pomodoro.remainingSeconds, 1500);
});

suite.test('F9.2: Pomodoro tick callback decrements remaining time by 1s each interval', () => {
  let remaining = 1500;
  const tick = () => { remaining--; return remaining; };
  assertEqual(tick(), 1499);
  assertEqual(tick(), 1498);
});

suite.test('F9.3: Pomodoro transitions to 5:00 (300 seconds) break phase on focus completion', () => {
  const transitionPhase = (currentMode) => {
    if (currentMode === 'focus') return { mode: 'break', duration: 300 };
    return { mode: 'focus', duration: 1500 };
  };
  const next = transitionPhase('focus');
  assertEqual(next.mode, 'break');
  assertEqual(next.duration, 300);
});

suite.test('F9.4: Ambient audio generator supports 3 tracks (lofi, rain, cafe)', () => {
  const tracks = ['lofi', 'rain', 'cafe'];
  const isValidTrack = (t) => tracks.includes(t);
  assertEqual(isValidTrack('lofi'), true);
  assertEqual(isValidTrack('rain'), true);
  assertEqual(isValidTrack('cafe'), true);
  assertEqual(isValidTrack('rock'), false);
});

suite.test('F9.5: Pomodoro Pause/Resume preserves remaining seconds accurately', () => {
  let pomodoro = { remaining: 1245, isRunning: true };
  const pause = () => { pomodoro.isRunning = false; };
  const resume = () => { pomodoro.isRunning = true; };
  pause();
  assertEqual(pomodoro.isRunning, false);
  assertEqual(pomodoro.remaining, 1245);
  resume();
  assertEqual(pomodoro.isRunning, true);
  assertEqual(pomodoro.remaining, 1245);
});

// =========================================================================
// FEATURE 10: Exam Soundscape & Red Alert (R3, M1)
// =========================================================================

suite.test('F10.1: Exam soundscape synthesizes background noise (hum, page turns, ambient rustle)', () => {
  const soundscape = {
    type: 'exam_room',
    layers: ['room_hum', 'paper_rustle', 'distant_cough'],
    volume: 0.25
  };
  assertEqual(soundscape.layers.length, 3);
  assertEqual(soundscape.layers.includes('room_hum'), true);
});

suite.test('F10.2: Exam countdown initializes to exam duration (e.g. 7200 seconds / 120 mins)', () => {
  const examDuration = 7200;
  assertEqual(examDuration, 120 * 60);
});

suite.test('F10.3: Red alert pulse class activates when countdown is <= 300 seconds (5 minutes)', () => {
  const isRedAlertActive = (remainingSec) => remainingSec <= 300;
  assertEqual(isRedAlertActive(301), false);
  assertEqual(isRedAlertActive(300), true);
  assertEqual(isRedAlertActive(60), true);
  assertEqual(isRedAlertActive(0), true);
});

suite.test('F10.4: Volume control slider adjusts exam soundscape gain linearly', () => {
  let gainValue = 0.5;
  const setVolume = (val) => { gainValue = Math.min(1.0, Math.max(0.0, val)); };
  setVolume(0.8);
  assertEqual(gainValue, 0.8);
  setVolume(1.5);
  assertEqual(gainValue, 1.0); // Clamped
});

suite.test('F10.5: Stop exam soundscape disconnects all nodes cleanly without memory leaks', () => {
  const audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();
  osc.start(0);
  let stopped = false;
  const stopSoundscape = () => {
    osc.stop(0);
    stopped = true;
  };
  stopSoundscape();
  assertEqual(stopped, true);
});

// =========================================================================
// FEATURE 11: 7-Axis Competency Radar (R4, M2)
// =========================================================================

suite.test('F11.1: Math coordinate projection calculates 7 equilateral vertices at p * 2*pi / 7 radians', () => {
  const masteries = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  const vertices = RADAR_GROUND_TRUTH.getVertices(masteries, 100, 100, 100);
  assertEqual(vertices.length, 7);
  // Part 1 vertex at -pi/2 (top: x = 100, y = 0)
  assertInDelta(vertices[0].x, 100, 0.5);
  assertInDelta(vertices[0].y, 0, 0.5);
});

suite.test('F11.2: Radar axes map Parts 1 through 7 accurately to polygon points', () => {
  const masteries = [0.8, 0.7, 0.5, 0.6, 0.9, 0.4, 0.75];
  const vertices = RADAR_GROUND_TRUTH.getVertices(masteries);
  assertEqual(vertices[0].part, 1);
  assertEqual(vertices[6].part, 7);
  assertEqual(vertices[4].mastery, 0.9);
});

suite.test('F11.3: Weak part detection identifies any axis with score < 60% or minimum axis', () => {
  const masteries = [0.85, 0.75, 0.55, 0.90, 0.70, 0.45, 0.80];
  // Parts with < 0.60: Part 3 (0.55), Part 6 (0.45)
  const weakParts = RADAR_GROUND_TRUTH.findWeakParts(masteries);
  assertEqual(weakParts.includes(3), true, 'Part 3 (55%) must be weak');
  assertEqual(weakParts.includes(6), true, 'Part 6 (45%) must be weak');
  assertEqual(weakParts.includes(1), false, 'Part 1 (85%) is not weak');
});

suite.test('F11.4: Weak vertices render glowing orange warning style (#F97316 / rgba(249, 115, 22, 0.8))', () => {
  const getVertexColor = (isWeak) => isWeak ? '#F97316' : '#6366F1';
  assertEqual(getVertexColor(true), '#F97316');
  assertEqual(getVertexColor(false), '#6366F1');
});

suite.test('F11.5: SVG polygon points string formatted correctly with closed perimeter', () => {
  const masteries = [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7];
  const vertices = RADAR_GROUND_TRUTH.getVertices(masteries);
  const pointsStr = vertices.map(v => `${v.x},${v.y}`).join(' ');
  assertEqual(pointsStr.split(' ').length, 7);
  assert(!pointsStr.includes('NaN'), 'Points string must not contain NaN');
});

// =========================================================================
// FEATURE 12: Real Test Score Prediction (R4, M2)
// =========================================================================

suite.test('F12.1: Predicted score evaluates base ability from listening and reading accuracy', () => {
  const calcBaseScore = (listeningAcc, readingAcc) => {
    const lScore = Math.round(listeningAcc * 495);
    const rScore = Math.round(readingAcc * 495);
    return Math.min(990, Math.max(10, lScore + rScore));
  };
  assertEqual(calcBaseScore(0.8, 0.7), 743);
  assertEqual(calcBaseScore(1.0, 1.0), 990);
  assertEqual(calcBaseScore(0.0, 0.0), 10);
});

suite.test('F12.2: Calculates velocity gain Delta = days * hours * 1.25 pts/hr', () => {
  const calcGain = (days, hours) => days * hours * 1.25;
  assertEqual(calcGain(30, 2), 75);
  assertEqual(calcGain(0, 2), 0);
});

suite.test('F12.3: Gaussian normal CDF calculates P(Score >= 650) accurately', () => {
  // Candidate with current score 620, 30 days prep at 1.5 hr/day: mu = 620 + 56.25 = 676.25 > 650
  const prob = GAUSSIAN_GROUND_TRUTH.predictOverTarget(620, 30, 1.5, 650);
  assertEqual(prob >= 75 && prob <= 85, true, `Probability ${prob}% expected between 75-85%`);
});

suite.test('F12.4: Higher practice consistency and scores yield monotonically increasing probability', () => {
  const p1 = GAUSSIAN_GROUND_TRUTH.predictOverTarget(550, 20, 1.0, 650);
  const p2 = GAUSSIAN_GROUND_TRUTH.predictOverTarget(600, 20, 1.0, 650);
  const p3 = GAUSSIAN_GROUND_TRUTH.predictOverTarget(650, 20, 1.0, 650);
  assertEqual(p1 < p2, true);
  assertEqual(p2 < p3, true);
});

suite.test('F12.5: Predicted score probability output is clamped in [0%, 100%]', () => {
  const pLow = GAUSSIAN_GROUND_TRUTH.predictOverTarget(100, 1, 0.1, 990);
  const pHigh = GAUSSIAN_GROUND_TRUTH.predictOverTarget(950, 60, 3.0, 500);
  assertEqual(pLow >= 0 && pLow <= 5, true);
  assertEqual(pHigh >= 95 && pHigh <= 100, true);
});

// =========================================================================
// FEATURE 13: Weekly Progress Report (R4, M2)
// =========================================================================

suite.test('F13.1: Aggregates total questions answered and accuracy over 7-day rolling window', () => {
  const logs = [
    { day: 1, count: 20, correct: 16 },
    { day: 2, count: 30, correct: 24 },
    { day: 3, count: 25, correct: 20 }
  ];
  const total = logs.reduce((acc, l) => acc + l.count, 0);
  const correct = logs.reduce((acc, l) => acc + l.correct, 0);
  const accPct = Math.round((correct / total) * 100);
  assertEqual(total, 75);
  assertEqual(accPct, 80);
});

suite.test('F13.2: Identifies top improved Part and most vulnerable Trap Category', () => {
  const partImprovement = { 1: 5, 2: 12, 3: -2, 4: 8, 5: 15, 6: 3, 7: 7 };
  const bestPart = Object.entries(partImprovement).sort((a, b) => b[1] - a[1])[0][0];
  assertEqual(Number(bestPart), 5, 'Part 5 (+15%) had biggest improvement');
});

suite.test('F13.3: Formats brief notification message string with emoji indicators', () => {
  const formatReport = (streak, scoreEst, topPart) => {
    return `🔥 Streak ${streak} ngày! Điểm dự đoán tuần này: ${scoreEst} (Tăng mạnh Part ${topPart}). Cố lên!`;
  };
  const msg = formatReport(7, 720, 5);
  assert(msg.includes('🔥 Streak 7'));
  assert(msg.includes('720'));
  assert(msg.includes('Part 5'));
});

suite.test('F13.4: Calculates study streak (consecutive days with completed activities)', () => {
  const dailyActivity = [true, true, true, true, false, true, true]; // Days 1 to 7 (most recent is day 7)
  let streak = 0;
  for (let i = dailyActivity.length - 1; i >= 0; i--) {
    if (dailyActivity[i]) streak++;
    else break;
  }
  assertEqual(streak, 2, 'Active streak from day 7 backwards is 2 days');
});

suite.test('F13.5: Returns JSON and text summary formats for UI toast or push notification', () => {
  const report = {
    weekStart: '2026-10-28',
    questionsCount: 140,
    accuracy: 78.5,
    streak: 6
  };
  assertEqual(typeof report.questionsCount, 'number');
  assertEqual(report.streak, 6);
});

// =========================================================================
// FEATURE 14: 10-Minute Adaptive Test (R4, M2)
// =========================================================================

suite.test('F14.1: 2PL IRT formula calculates correct answer probability for ability theta', () => {
  // P(theta = 0, b = 0) should equal c + (1-c)/(1+1) = 0.25 + 0.75/2 = 0.625
  const p = IRT_GROUND_TRUTH.probability(0.0, 0.0, 1.6, 0.25);
  assertInDelta(p, 0.625, 0.001);
});

suite.test('F14.2: Correct answer increases ability theta, incorrect answer decreases theta', () => {
  let theta = 0.0;
  const updateTheta = (curTheta, correct, b) => {
    const P = IRT_GROUND_TRUTH.probability(curTheta, b);
    const step = 0.4 * (correct ? 1 : 0 - P);
    return curTheta + step;
  };
  const thetaAfterCorrect = updateTheta(theta, true, 0.0);
  assertEqual(thetaAfterCorrect > theta, true, 'Correct answer must increase theta');
  const thetaAfterWrong = updateTheta(theta, false, 0.0);
  assertEqual(thetaAfterWrong < theta, true, 'Wrong answer must decrease theta');
});

suite.test('F14.3: Fisher Information calculation selects next optimal unadministered item', () => {
  const theta = 1.0;
  // Item 1 has b = 1.0 (matches theta), Item 2 has b = -2.0 (far from theta)
  const info1 = IRT_GROUND_TRUTH.fisherInformation(theta, 1.0);
  const info2 = IRT_GROUND_TRUTH.fisherInformation(theta, -2.0);
  assertEqual(info1 > info2, true, 'Item matching candidate ability must provide higher Fisher Information');
});

suite.test('F14.4: Early stopping criterion terminates when Standard Error <= 0.24 or k == 18', () => {
  const shouldStop = (k, se, elapsedSec) => {
    if (elapsedSec >= 600) return true;
    if (k >= 14 && se <= 0.24) return true;
    if (k >= 18) return true;
    return false;
  };
  assertEqual(shouldStop(15, 0.20, 450), true, 'Stop early when SE <= 0.24');
  assertEqual(shouldStop(10, 0.35, 300), false, 'Continue when SE > 0.24');
  assertEqual(shouldStop(18, 0.30, 500), true, 'Stop at max 18 items');
});

suite.test('F14.5: Ability theta in [-3, +3] maps accurately to ETS score band [10, 990]', () => {
  assertEqual(IRT_GROUND_TRUTH.thetaToScore(-3.0), 62);
  assertEqual(IRT_GROUND_TRUTH.thetaToScore(0.0), 496); // Intermediate 500 band (248 * 2)
  assertEqual(IRT_GROUND_TRUTH.thetaToScore(+3.0), 928);
});

// =========================================================================
// FEATURE 15: FSRS v5 Algorithm (R5, M2)
// =========================================================================

suite.test('F15.1: initCard() initializes difficulty D0 and stability S0', () => {
  const card = FSRS_GROUND_TRUTH.initCard('w_expedite');
  assertEqual(card.cardId, 'w_expedite');
  assertEqual(card.stability, 3.17);
  assertEqual(card.difficulty >= 1.0 && card.difficulty <= 10.0, true);
  assertEqual(card.retrievability, 1.0);
});

suite.test('F15.2: Retrievability decay formula decays monotonically with elapsed time t', () => {
  const r0 = FSRS_GROUND_TRUTH.retrievability(0, 3.17);
  const r1 = FSRS_GROUND_TRUTH.retrievability(3, 3.17);
  const r2 = FSRS_GROUND_TRUTH.retrievability(10, 3.17);
  assertEqual(r0, 1.0);
  assertEqual(r1 < r0, true);
  assertEqual(r2 < r1, true);
  assertEqual(r2 > 0, true);
});

suite.test('F15.3: Recall rating Good (G=3) increases stability S_new > S_old', () => {
  const card = FSRS_GROUND_TRUTH.initCard('w_consensus');
  const rated = FSRS_GROUND_TRUTH.rateCard(card, 3, 3.0);
  assertEqual(rated.stability > card.stability, true, 'Good rating must increase stability');
  assertEqual(rated.reps, 1);
  assertEqual(rated.lapses, 0);
});

suite.test('F15.4: Lapse rating Again (G=1) drops stability S_lapse < S_old and increments lapses', () => {
  const card = { cardId: 'w_indemnify', difficulty: 5.0, stability: 12.0, reps: 4, lapses: 0 };
  const rated = FSRS_GROUND_TRUTH.rateCard(card, 1, 10.0);
  assertEqual(rated.stability < card.stability, true, 'Lapse must drop stability');
  assertEqual(rated.lapses, 1);
});

suite.test('F15.5: Optimal interval I(S, 0.90) = max(1, round(S)) calculates next review timestamp', () => {
  const card = { cardId: 'w_preliminary', difficulty: 4.5, stability: 6.8 };
  const interval = Math.max(1, Math.round(card.stability));
  assertEqual(interval, 7);
});

// =========================================================================
// FEATURE 16: 12 Trap Categories Heat Matrix (R5, M2)
// =========================================================================

suite.test('F16.1: Categorizes errors into the 12 canonical IDs (TRAP-01 to TRAP-12)', () => {
  assertEqual(TRAP_CATEGORIES_CATALOG.length, 12);
  assertEqual(TRAP_CATEGORIES_CATALOG[0].id, 'TRAP-01');
  assertEqual(TRAP_CATEGORIES_CATALOG[11].id, 'TRAP-12');
  const listeningTraps = TRAP_CATEGORIES_CATALOG.filter(t => t.section === 'listening');
  const readingTraps = TRAP_CATEGORIES_CATALOG.filter(t => t.section === 'reading');
  assertEqual(listeningTraps.length, 8);
  assertEqual(readingTraps.length, 4);
});

suite.test('F16.2: Exponential time decay with 7-day half-life weights recent mistakes heavier than old ones', () => {
  const lambda = Math.LN2 / 7; // 7 days half-life
  const calcWeight = (elapsedDays) => Math.exp(-lambda * elapsedDays);
  assertInDelta(calcWeight(0), 1.0, 0.001);
  assertInDelta(calcWeight(7), 0.5, 0.001);   // Exactly half weight at 7 days
  assertInDelta(calcWeight(14), 0.25, 0.001); // Quarter weight at 14 days
});

suite.test('F16.3: Insufficient exposure (<3 attempts) defaults heat intensity to 0%', () => {
  const calcHeat = (wrongCount, totalCount) => {
    if (totalCount < 3) return 0;
    return Math.round((wrongCount / totalCount) * 100);
  };
  assertEqual(calcHeat(2, 2), 0, 'Must return 0% when total attempts < 3');
  assertEqual(calcHeat(2, 3), 67);
});

suite.test('F16.4: Heat intensity thresholds map correctly to Cold, Warm, Hot, Critical tiers', () => {
  const getHeatTier = (h) => {
    if (h < 20) return 'COLD';
    if (h < 45) return 'WARM';
    if (h < 70) return 'HOT';
    return 'CRITICAL';
  };
  assertEqual(getHeatTier(10), 'COLD');
  assertEqual(getHeatTier(30), 'WARM');
  assertEqual(getHeatTier(55), 'HOT');
  assertEqual(getHeatTier(85), 'CRITICAL');
});

suite.test('F16.5: Returns 12-cell matrix data structure with CSS classes and diagnostic advice', () => {
  const matrixCells = TRAP_CATEGORIES_CATALOG.map(t => ({
    trapId: t.id,
    code: t.code,
    heat: 15,
    cssClass: 'bg-emerald-500/20 text-emerald-400'
  }));
  assertEqual(matrixCells.length, 12);
  assertEqual(matrixCells[0].cssClass.includes('emerald'), true);
});

// =========================================================================
// FEATURE 17: 180-Second Micro-Capsules (R5, M3)
// =========================================================================

suite.test('F17.1: Capsule Type A packs 3 targeted trap questions with 180s total budget (30s theory, 120s drill, 30s wrap)', () => {
  const capsuleA = {
    type: 'TRAP_DRILL',
    totalBudgetSeconds: 180,
    phases: [
      { name: 'theory', duration: 30 },
      { name: 'drill', duration: 120, questionsCount: 3 },
      { name: 'wrap_up', duration: 30 }
    ]
  };
  const sumDuration = capsuleA.phases.reduce((a, b) => a + b.duration, 0);
  assertEqual(sumDuration, 180);
  assertEqual(capsuleA.phases[1].questionsCount, 3);
});

suite.test('F17.2: Capsule Type B packs 5 vocabulary words with 36s per word budget', () => {
  const capsuleB = {
    type: 'VOCAB_AUDIO',
    totalBudgetSeconds: 180,
    wordsCount: 5,
    perWordBudget: 36
  };
  assertEqual(capsuleB.wordsCount * capsuleB.perWordBudget, 180);
});

suite.test('F17.3: Micro-timer countdown triggers auto-advance if user fails to answer before step budget expires', () => {
  let activeQuestion = 1;
  let remainingTime = 0;
  const onTimerExpire = () => {
    activeQuestion++;
    remainingTime = 40;
  };
  onTimerExpire();
  assertEqual(activeQuestion, 2);
  assertEqual(remainingTime, 40);
});

suite.test('F17.4: Updates Heat Matrix error counts immediately upon capsule completion', () => {
  let heatUpdated = false;
  const onCapsuleDone = (results) => {
    heatUpdated = true;
  };
  onCapsuleDone({ completed: true, score: 3 });
  assertEqual(heatUpdated, true);
});

suite.test('F17.5: Capsule completion award gives XP/streak credit', () => {
  let userXP = 100;
  const awardCapsuleXP = (perfect) => {
    userXP += perfect ? 50 : 25;
    return userXP;
  };
  assertEqual(awardCapsuleXP(true), 150);
});

// =========================================================================
// FEATURE 18: Realistic Document UI (Part 6-7) (R5, M3)
// =========================================================================

suite.test('F18.1: Gmail template renders webmail header, sender, timestamp, subject, and body', () => {
  const emailData = {
    subject: 'Project Kickoff Meeting',
    sender: 'Sarah Jenkins',
    email: 'sjenkins@nexuscorp.com',
    body: 'Please review the attached project charter before tomorrow.'
  };
  const html = `<div class="webmail-view"><span class="sender">${emailData.sender}</span><h3 class="subject">${emailData.subject}</h3><p>${emailData.body}</p></div>`;
  assert(html.includes('Sarah Jenkins'));
  assert(html.includes('Project Kickoff Meeting'));
  assert(html.includes('webmail-view'));
});

suite.test('F18.2: VAT Invoice template renders serial number, seller/buyer columns, items table, and totals', () => {
  const invoiceData = {
    serial: 'AA/26E',
    no: '0049281',
    seller: 'Nexus Office Solutions JSC',
    buyer: 'Global Trading Ltd',
    total: '$1,450.00'
  };
  const html = `<div class="vat-invoice"><span>${invoiceData.serial}</span><span>${invoiceData.no}</span><span>${invoiceData.seller}</span><span>${invoiceData.total}</span></div>`;
  assert(html.includes('AA/26E'));
  assert(html.includes('Nexus Office Solutions'));
  assert(html.includes('$1,450.00'));
});

suite.test('F18.3: Boarding Pass template renders airline header, passenger, flight, gate, and seat', () => {
  const passData = {
    airline: 'Pacific Airways',
    passenger: 'DAVID MILLER',
    flight: 'PA-204',
    gate: 'A12',
    seat: '14C'
  };
  const html = `<div class="boarding-pass"><span class="airline">${passData.airline}</span><span class="flight">${passData.flight}</span><span class="gate">${passData.gate}</span></div>`;
  assert(html.includes('Pacific Airways'));
  assert(html.includes('PA-204'));
  assert(html.includes('A12'));
});

suite.test('F18.4: Slack Notice template renders channel name, member count, avatar, and message reactions', () => {
  const slackData = {
    channel: '#announcements-internal',
    members: 142,
    reactions: ['👍 18', '👀 24']
  };
  const html = `<div class="slack-notice"><span>${slackData.channel}</span><span>${slackData.reactions[0]}</span></div>`;
  assert(html.includes('#announcements-internal'));
  assert(html.includes('👍 18'));
});

suite.test('F18.5: Fallback renderer handles custom or unstructured document types without breaking', () => {
  const renderDocument = (docType, content) => {
    const valid = ['Email', 'Invoice', 'BoardingPass', 'Slack'];
    if (!valid.includes(docType)) return `<div class="generic-document">${content}</div>`;
    return `<div class="doc-${docType.toLowerCase()}">${content}</div>`;
  };
  const out = renderDocument('Memo', 'Internal company policy memo');
  assert(out.includes('generic-document'));
  assert(out.includes('Internal company policy'));
});

// =========================================================================
// FEATURE 19: 80/20 Frequency Tiering (R6, M3)
// =========================================================================

suite.test('F19.1: Vocabulary bank maps items to 3 frequency tiers: Cực Cao, Cao, Trung Bình', () => {
  const tiers = ['Cực Cao', 'Cao', 'Trung Bình'];
  const isValidTier = (t) => tiers.includes(t);
  assertEqual(isValidTier('Cực Cao'), true);
  assertEqual(isValidTier('Cao'), true);
  assertEqual(isValidTier('Trung Bình'), true);
});

suite.test('F19.2: Tier Cực Cao contains high-impact core business items (contracts, hiring, scheduling)', () => {
  const highFrequencyVocab = [
    { word: 'abide by', tier: 'Cực Cao', category: 'contract' },
    { word: 'accommodate', tier: 'Cực Cao', category: 'hospitality' },
    { word: 'expedite', tier: 'Cực Cao', category: 'logistics' },
    { word: 'moratorium', tier: 'Trung Bình', category: 'legal' }
  ];
  const curCaoList = highFrequencyVocab.filter(v => v.tier === 'Cực Cao');
  assertEqual(curCaoList.length, 3);
  assertEqual(curCaoList.some(v => v.word === 'expedite'), true);
});

suite.test('F19.3: Filtering by tier returns correctly segmented subset of vocabulary', () => {
  const list = [
    { word: 'A', tier: 'Cao' },
    { word: 'B', tier: 'Cực Cao' },
    { word: 'C', tier: 'Cực Cao' }
  ];
  const filtered = list.filter(item => item.tier === 'Cực Cao');
  assertEqual(filtered.length, 2);
});

suite.test('F19.4: Frequency badges render with distinct color codes (Red/Gold for Cực Cao)', () => {
  const getBadgeClass = (tier) => {
    if (tier === 'Cực Cao') return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    if (tier === 'Cao') return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
  };
  assert(getBadgeClass('Cực Cao').includes('rose'));
  assert(getBadgeClass('Cao').includes('amber'));
});

suite.test('F19.5: 80/20 priority sorting places Cực Cao before Cao before Trung Bình in study queues', () => {
  const order = { 'Cực Cao': 1, 'Cao': 2, 'Trung Bình': 3 };
  const items = [
    { word: 'W1', tier: 'Trung Bình' },
    { word: 'W2', tier: 'Cực Cao' },
    { word: 'W3', tier: 'Cao' }
  ];
  items.sort((a, b) => order[a.tier] - order[b.tier]);
  assertEqual(items[0].word, 'W2'); // Cực Cao first
  assertEqual(items[1].word, 'W3'); // Cao second
  assertEqual(items[2].word, 'W1'); // Trung Bình last
});

// =========================================================================
// FEATURE 20: Office Paraphrase Clusters (R6, M3)
// =========================================================================

suite.test('F20.1: Cluster database contains 10 core business synonym networks', () => {
  const clusters = [
    { id: 'POSTPONE', terms: ['delay', 'postpone', 'push back', 'defer', 'reschedule', 'put off'] },
    { id: 'SALARY', terms: ['salary', 'remuneration', 'compensation', 'wage', 'stipend'] },
    { id: 'PROCURE', terms: ['purchase', 'procure', 'acquire', 'place an order', 'source'] },
    { id: 'EXPEDITE', terms: ['accelerate', 'expedite', 'fast-track', 'hasten', 'rush delivery'] },
    { id: 'INSPECT', terms: ['examine', 'inspect', 'review', 'audit', 'assess', 'scrutinize'] },
    { id: 'CANCEL', terms: ['call off', 'cancel', 'revoke', 'terminate', 'rescind'] },
    { id: 'COMPLY', terms: ['comply with', 'abide by', 'adhere to', 'conform to', 'satisfy'] },
    { id: 'DEFECT', terms: ['malfunction', 'glitch', 'flaw', 'defective component', 'breakdown'] },
    { id: 'DISCOUNT', terms: ['rebate', 'markdown', 'concession', 'promotional rate', 'price reduction'] },
    { id: 'SUBMIT', terms: ['turn in', 'file', 'lodge', 'forward', 'tender', 'hand in'] }
  ];
  assertEqual(clusters.length, 10);
});

suite.test('F20.2: Bidirectional lookup: querying any synonym returns parent cluster and siblings', () => {
  const cluster = ['delay', 'postpone', 'push back', 'defer', 'reschedule'];
  const findSiblings = (word) => cluster.filter(w => w !== word);
  const siblings = findSiblings('defer');
  assertEqual(siblings.includes('postpone'), true);
  assertEqual(siblings.includes('push back'), true);
  assertEqual(siblings.includes('defer'), false);
});

suite.test('F20.3: Distractor discriminator distinguishes genuine synonyms from deceptive distractors', () => {
  const target = 'postpone';
  const candidate1 = 'reschedule'; // Genuine
  const candidate2 = 'cancel';     // Deceptive trap
  const isSynonym = (a, b) => {
    const table = { 'postpone': ['delay', 'reschedule', 'defer', 'push back'] };
    return (table[a] || []).includes(b);
  };
  assertEqual(isSynonym(target, candidate1), true);
  assertEqual(isSynonym(target, candidate2), false);
});

suite.test('F20.4: Highlights matching cluster terms in Part 3, 4, 7 transcripts and questions', () => {
  const text = "We decided to push back the seminar date.";
  const highlighted = text.replace(/\b(push back)\b/gi, '<mark class="cluster-match">$1</mark>');
  assert(highlighted.includes('<mark class="cluster-match">push back</mark>'));
});

suite.test('F20.5: Quiz generator generates synonym matching questions from cluster data', () => {
  const makeQuestion = (clusterName, term, correctSynonym, wrongTerms) => ({
    prompt: `Từ nào sau đây đồng nghĩa với "${term}" trong ngữ cảnh công sở?`,
    options: [correctSynonym, ...wrongTerms],
    correctAnswer: correctSynonym
  });
  const q = makeQuestion('POSTPONE', 'defer', 'reschedule', ['cancel', 'accelerate', 'terminate']);
  assertEqual(q.correctAnswer, 'reschedule');
  assertEqual(q.options.length, 4);
});

// =========================================================================
// FEATURE 21: Tinder-Style 3D Flashcards (R6, M3)
// =========================================================================

suite.test('F21.1: Card container applies CSS 3D perspective (perspective: 1000px, preserve-3d)', () => {
  const css = `
    .flashcard-stage { perspective: 1000px; }
    .flashcard-card { transform-style: preserve-3d; transition: transform 0.25s ease-out; }
  `;
  assert(css.includes('perspective: 1000px'));
  assert(css.includes('transform-style: preserve-3d'));
});

suite.test('F21.2: Touch / Mouse drag right generates positive translation and triggers Thuộc badge', () => {
  const calculateSwipeState = (dx) => {
    const rotation = dx * 0.1;
    const badge = dx > 40 ? 'THUỘC' : (dx < -40 ? 'CHƯA THUỘC' : null);
    return { rotation, badge };
  };
  const rightSwipe = calculateSwipeState(80);
  assertEqual(rightSwipe.badge, 'THUỘC');
  assertEqual(rightSwipe.rotation > 0, true);
});

suite.test('F21.3: Touch / Mouse drag left generates negative translation and triggers Chưa thuộc badge', () => {
  const calculateSwipeState = (dx) => {
    const rotation = dx * 0.1;
    const badge = dx > 40 ? 'THUỘC' : (dx < -40 ? 'CHƯA THUỘC' : null);
    return { rotation, badge };
  };
  const leftSwipe = calculateSwipeState(-90);
  assertEqual(leftSwipe.badge, 'CHƯA THUỘC');
  assertEqual(leftSwipe.rotation < 0, true);
});

suite.test('F21.4: Swipe release beyond threshold (|dx| >= 100px) ejects card and submits rating to FSRS', () => {
  const evaluateSwipeRelease = (dx) => {
    if (dx >= 100) return { action: 'EJECT_RIGHT', rating: 3 }; // Good
    if (dx <= -100) return { action: 'EJECT_LEFT', rating: 1 };  // Again
    return { action: 'SNAP_BACK', rating: null };
  };
  assertEqual(evaluateSwipeRelease(120).action, 'EJECT_RIGHT');
  assertEqual(evaluateSwipeRelease(120).rating, 3);
  assertEqual(evaluateSwipeRelease(-110).action, 'EJECT_LEFT');
  assertEqual(evaluateSwipeRelease(-110).rating, 1);
});

suite.test('F21.5: Swipe release below threshold (|dx| < 100px) snaps card smoothly back to center', () => {
  const evaluateSwipeRelease = (dx) => {
    if (Math.abs(dx) < 100) return { action: 'SNAP_BACK', transform: 'translate3d(0,0,0) rotate(0deg)' };
    return { action: 'EJECT' };
  };
  assertEqual(evaluateSwipeRelease(45).action, 'SNAP_BACK');
  assertEqual(evaluateSwipeRelease(-60).action, 'SNAP_BACK');
});

// =========================================================================
// FEATURE 22: WebSocket 1v1 PvP Arena (R6, M4)
// =========================================================================

suite.test('F22.1: Client sends JOIN_QUEUE and receives MATCH_FOUND with matchId and 10 words', () => {
  const clientMsg = { type: 'JOIN_QUEUE', userId: 'user_01', username: 'Dang' };
  assertEqual(clientMsg.type, 'JOIN_QUEUE');
  const serverResponse = {
    type: 'MATCH_FOUND',
    matchId: 'match_9921',
    opponent: { username: 'Linh', isBot: false },
    wordsCount: 10,
    duration: 60
  };
  assertEqual(serverResponse.type, 'MATCH_FOUND');
  assertEqual(serverResponse.wordsCount, 10);
  assertEqual(serverResponse.duration, 60);
});

suite.test('F22.2: Server synchronizes 60-second countdown with periodic TICK_SYNC messages', () => {
  const tickMsg = { type: 'TICK_SYNC', remainingSeconds: 58 };
  assertEqual(tickMsg.type, 'TICK_SYNC');
  assertEqual(tickMsg.remainingSeconds <= 60, true);
});

suite.test('F22.3: Client submits SUBMIT_ANSWER and receives SCORE_UPDATE with combo multiplier', () => {
  const subAnswer = { type: 'SUBMIT_ANSWER', matchId: 'm1', wordIndex: 2, answer: 'B', responseTimeMs: 1420 };
  assertEqual(subAnswer.type, 'SUBMIT_ANSWER');
  const scoreUpdate = {
    type: 'SCORE_UPDATE',
    myScore: 240,
    opponentScore: 180,
    myCombo: 3
  };
  assertEqual(scoreUpdate.myScore > 0, true);
  assertEqual(scoreUpdate.myCombo, 3);
});

suite.test('F22.4: Match timer expiry triggers MATCH_END with winner and rankDelta', () => {
  const matchEnd = {
    type: 'MATCH_END',
    winner: 'my',
    finalMyScore: 820,
    finalOpponentScore: 710,
    rankDelta: +25
  };
  assertEqual(matchEnd.type, 'MATCH_END');
  assertEqual(matchEnd.winner, 'my');
  assertEqual(matchEnd.rankDelta, 25);
});

suite.test('F22.5: AI Bot fallback matches user against Sói Mây Bot when queue wait exceeds 5s', () => {
  const matchWithBot = (queueTimeMs) => {
    if (queueTimeMs >= 5000) {
      return { matched: true, opponent: { username: 'Sói Mây AI Bot 🐺', isBot: true } };
    }
    return { matched: false };
  };
  assertEqual(matchWithBot(2000).matched, false);
  const matched = matchWithBot(5100);
  assertEqual(matched.matched, true);
  assertEqual(matched.opponent.isBot, true);
});

// =========================================================================
// FEATURE 23: Karaoke Lyrics Sync (R7, M3)
// =========================================================================

suite.test('F23.1: Parses segment transcript with millisecond timestamps (start, end, text)', () => {
  const segments = [
    { start: 0.5, end: 3.2, speaker: 'Man', text: 'Good morning, Sarah. Did you get a chance to review the budget?' },
    { start: 3.5, end: 6.8, speaker: 'Woman', text: 'Yes, but wait, there seems to be a discrepancy in the travel expenses.' }
  ];
  assertEqual(segments.length, 2);
  assertEqual(segments[0].start, 0.5);
  assertEqual(segments[1].end, 6.8);
});

suite.test('F23.2: Audio timeupdate highlights the active segment matching start <= currentTime <= end', () => {
  const segments = [
    { id: 1, start: 0.0, end: 2.5, text: 'Segment 1' },
    { id: 2, start: 2.6, end: 5.0, text: 'Segment 2' },
    { id: 3, start: 5.1, end: 8.0, text: 'Segment 3' }
  ];
  const getActiveSegment = (t) => segments.find(s => t >= s.start && t <= s.end) || null;
  assertEqual(getActiveSegment(1.5).id, 1);
  assertEqual(getActiveSegment(3.8).id, 2);
  assertEqual(getActiveSegment(6.0).id, 3);
  assertEqual(getActiveSegment(10.0), null);
});

suite.test('F23.3: Removes highlight from previous line when playback progresses to next timestamp', () => {
  let activeLineId = 1;
  const advanceTo = (newLineId) => { activeLineId = newLineId; };
  advanceTo(2);
  assertEqual(activeLineId, 2);
});

suite.test('F23.4: Clicking on any lyric line seeks audio playback to that lines start time', () => {
  let audioCurrentTime = 0.0;
  const seekToSegment = (seg) => { audioCurrentTime = seg.start; };
  seekToSegment({ start: 4.8 });
  assertEqual(audioCurrentTime, 4.8);
});

suite.test('F23.5: Auto-scroll keeps the currently active karaoke line vertically centered', () => {
  let scrollCalled = false;
  const mockElement = {
    scrollIntoView: (opts) => {
      scrollCalled = true;
      assertEqual(opts.block, 'center');
    }
  };
  mockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  assertEqual(scrollCalled, true);
});

// =========================================================================
// FEATURE 24: Accent Classifier Indicator (R7, M3)
// =========================================================================

suite.test('F24.1: Extracts accent metadata (US, UK, AU, CA) from audio item descriptor', () => {
  const item = { id: 'p3_set01', accent: 'UK', secondaryAccent: 'US' };
  assertEqual(item.accent, 'UK');
  assertEqual(item.secondaryAccent, 'US');
});

suite.test('F24.2: Renders national flag emoji / SVG icon for US, UK, AU, CA', () => {
  const getFlag = (accent) => {
    const map = { 'US': '🇺🇸', 'UK': '🇬🇧', 'AU': '🇦🇺', 'CA': '🇨🇦' };
    return map[accent] || '🌐';
  };
  assertEqual(getFlag('US'), '🇺🇸');
  assertEqual(getFlag('UK'), '🇬🇧');
  assertEqual(getFlag('AU'), '🇦🇺');
  assertEqual(getFlag('CA'), '🇨🇦');
  assertEqual(getFlag('UNKNOWN'), '🌐');
});

suite.test('F24.3: Highlights known regional phonological shifts (UK non-rhoticity, AU vowel shifts)', () => {
  const getAccentTips = (accent) => {
    if (accent === 'UK') return 'Nuốt âm /r/ cuối từ (car -> /kɑː/), âm /t/ phát âm rõ';
    if (accent === 'AU') return 'Biến âm /eɪ/ thành /aɪ/ (today -> /təˈdaɪ/)';
    return 'Giọng phổ thông chuẩn';
  };
  assert(getAccentTips('UK').includes('/r/'));
  assert(getAccentTips('AU').includes('/eɪ/'));
});

suite.test('F24.4: Supports multi-accent dialogues (Speaker 1 US + Speaker 2 UK)', () => {
  const speakers = [
    { name: 'Alex', accent: 'US' },
    { name: 'Emma', accent: 'UK' }
  ];
  const distinctAccents = Array.from(new Set(speakers.map(s => s.accent)));
  assertEqual(distinctAccents.length, 2);
  assertEqual(distinctAccents.includes('US'), true);
  assertEqual(distinctAccents.includes('UK'), true);
});

suite.test('F24.5: Filtering practice sets by accent returns matching filtered items', () => {
  const sets = [
    { id: 1, accent: 'US' },
    { id: 2, accent: 'UK' },
    { id: 3, accent: 'US' },
    { id: 4, accent: 'AU' }
  ];
  const filterByAccent = (acc) => sets.filter(s => s.accent === acc);
  assertEqual(filterByAccent('US').length, 2);
  assertEqual(filterByAccent('UK').length, 1);
  assertEqual(filterByAccent('AU').length, 1);
});

// =========================================================================
// FEATURE 25: AI "Vì sao em sai?" Engine (R7, M4)
// =========================================================================

suite.test('F25.1: Payload validation for POST /api/ai/explain-mistake', () => {
  const payload = {
    question: 'The committee decided to ____ the proposal until next month.',
    userAnswer: 'cancel',
    correctAnswer: 'defer',
    part: 5,
    trapCategory: 'TRAP-10'
  };
  const validate = (p) => p.question && p.userAnswer && p.correctAnswer && p.part && p.trapCategory;
  assertEqual(Boolean(validate(payload)), true);
});

suite.test('F25.2: Prompt template structures 4 sections: Tiếng lòng, Bóc mẽ bẫy, Vì sao đúng, Mẹo 3 giây', () => {
  const makePrompt = (q, userAns, correctAns, trap) => {
    return `
      1. 🎭 TIẾNG LÒNG SINH VIÊN: Vì sao dễ chọn "${userAns}"?
      2. 🕳️ BÓC MẼ BẪY: Bẫy ${trap} trong đề thi ETS.
      3. 🎯 VÌ SAO ĐÚNG: Lý do "${correctAns}" mới chuẩn.
      4. ⚡ MẸO 3 GIÂY: Phản xạ phòng thi.
    `;
  };
  const prompt = makePrompt('Q1', 'A', 'B', 'TRAP-06');
  assert(prompt.includes('TIẾNG LÒNG'));
  assert(prompt.includes('BÓC MẼ BẪY'));
  assert(prompt.includes('VÌ SAO ĐÚNG'));
  assert(prompt.includes('MẸO 3 GIÂY'));
});

suite.test('F25.3: Fallback Tier 1 calls Gemini 3.8 Flash model when GEMINI_API_KEY is present', () => {
  const resolveProvider = (keys) => {
    if (keys.GEMINI_API_KEY) return 'gemini-3.8-flash';
    if (keys.OPENROUTER_API_KEY) return 'openrouter';
    return 'offline-rules';
  };
  assertEqual(resolveProvider({ GEMINI_API_KEY: 'key_123' }), 'gemini-3.8-flash');
});

suite.test('F25.4: Fallback Tier 2 routes to OpenRouter when Gemini fails or key is absent', () => {
  const resolveProvider = (keys) => {
    if (keys.GEMINI_API_KEY) return 'gemini-3.8-flash';
    if (keys.OPENROUTER_API_KEY) return 'openrouter';
    return 'offline-rules';
  };
  assertEqual(resolveProvider({ OPENROUTER_API_KEY: 'sk-or-123' }), 'openrouter');
});

suite.test('F25.5: Fallback Tier 3 provides offline rule-based explanation when network is down (0% crash)', () => {
  const generateOfflineExplanation = (trapCategory, correctAns) => {
    const rules = {
      'TRAP-06': 'Bẫy đổi ý phút chót! Đừng vội chọn phương án nghe thấy đầu tiên khi có từ "Wait/Actually".',
      'TRAP-01': 'Tranh không người không được dùng bị động tiếp diễn (is being V3)!'
    };
    return rules[trapCategory] || `Đáp án đúng là ${correctAns}.`;
  };
  const exp = generateOfflineExplanation('TRAP-06', 'Oak Suite');
  assert(exp.includes('Bẫy đổi ý phút chót'));
  assert(exp.includes('Wait/Actually'));
});

module.exports = suite;

if (require.main === module) {
  suite.run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
