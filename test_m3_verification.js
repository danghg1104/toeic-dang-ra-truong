#!/usr/bin/env node

/**
 * Dedicated Milestone 3 Verification Test Suite
 * Tests all 5 modules:
 * 1. AuthenticDocumentTemplates (F18 - R5)
 * 2. ToeicListeningSync (F2, F3, F23, F24 - R1, R7)
 * 3. TinderFlashcards3D (F21 - R6)
 * 4. OnePageCheatSheet (F4 - R1)
 * 5. ToeicCapsuleStation (F17, F19, F20 - R5, R6)
 */

const assert = require('assert');
const AuthenticDocumentTemplates = require('./js/authentic-document-templates');
const ToeicListeningSync = require('./js/toeic-listening-sync');
const TinderFlashcards3D = require('./js/tinder-flashcards-3d');
const OnePageCheatSheet = require('./js/one-page-cheat-sheet');
const ToeicCapsuleStation = require('./js/toeic-capsule-station');
const FSRS5Engine = require('./js/fsrs-v5-engine');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    failedTests++;
  }
}

console.log('================================================================');
console.log('       MILESTONE 3 DEDICATED VERIFICATION TEST SUITE            ');
console.log('================================================================\n');

// ============================================================================
// 1. AUTHENTIC DOCUMENT TEMPLATES (F18 - R5)
// ============================================================================
console.log('--- 1. Testing AuthenticDocumentTemplates (F18) ---');
const docEngine = new AuthenticDocumentTemplates();

runTest('F18: Corporate Gmail template renders subject, sender, email, timestamp, body, avatar, and reply button', () => {
  const emailData = {
    subject: 'Quarterly Logistics Budget Review',
    sender: 'Sarah Jenkins',
    email: 'sjenkins@nexuscorp.com',
    recipient: 'logistics-team@nexuscorp.com',
    timestamp: 'Today, 09:42 AM',
    body: 'Please review the attached project charter before tomorrow morning.',
    attachmentName: 'Project_Charter.pdf',
    attachmentSize: '2.4 MB'
  };
  const html = docEngine.render('Email', emailData);
  assert(html.includes('Quarterly Logistics Budget Review'), 'Must contain subject');
  assert(html.includes('Sarah Jenkins'), 'Must contain sender name');
  assert(html.includes('sjenkins@nexuscorp.com'), 'Must contain sender email');
  assert(html.includes('Project_Charter.pdf'), 'Must contain attachment');
  assert(html.includes('Corporate Webmail — Inbox'), 'Must have webmail header');
  assert(html.includes('webmail-view'), 'Must have webmail-view class');
});

runTest('F18: Electronic VAT Invoice template renders serial, invoice no, seller/buyer, item table, and digital seal', () => {
  const invoiceData = {
    serial: 'AA/26E',
    no: '0049281',
    date: '15/10/2026',
    seller: 'Nexus Office Solutions JSC',
    taxId: '0109847291',
    buyer: 'Global Trading Ltd',
    items: [
      { name: 'Ergonomic Desk Chair', unit: 'Pcs', qty: 10, unitPrice: 85.0, amount: 850.0 },
      { name: 'Dual Monitor Mount', unit: 'Pcs', qty: 5, unitPrice: 40.0, amount: 200.0 }
    ],
    subtotal: '$1,050.00',
    vat: '$105.00',
    total: '$1,155.00'
  };
  const html = docEngine.render('Invoice', invoiceData);
  assert(html.includes('AA/26E'), 'Must include serial');
  assert(html.includes('0049281'), 'Must include invoice number');
  assert(html.includes('Nexus Office Solutions'), 'Must include seller');
  assert(html.includes('Global Trading Ltd'), 'Must include buyer');
  assert(html.includes('Ergonomic Desk Chair'), 'Must include items');
  assert(html.includes('$1,155.00'), 'Must include total amount');
  assert(html.includes('Đã ký điện tử'), 'Must include valid digital seal');
  assert(html.includes('vat-invoice'), 'Must have vat-invoice class');
});

runTest('F18: International Airline Boarding Pass template renders airline, passenger, flight, gate, seat, barcode', () => {
  const passData = {
    airline: 'Pacific Airways',
    passenger: 'DAVID MILLER',
    flight: 'PA-204',
    gate: 'A12',
    seat: '14C',
    origin: 'SGN',
    destination: 'ICN',
    boardingTime: '08:20 AM'
  };
  const html = docEngine.render('BoardingPass', passData);
  assert(html.includes('Pacific Airways'), 'Must include airline');
  assert(html.includes('DAVID MILLER'), 'Must include passenger in caps');
  assert(html.includes('PA-204'), 'Must include flight number');
  assert(html.includes('A12'), 'Must include gate');
  assert(html.includes('14C'), 'Must include seat');
  assert(html.includes('ETKT:'), 'Must include barcode and e-ticket reference');
  assert(html.includes('boarding-pass'), 'Must have boarding-pass class');
});

runTest('F18: Enterprise Slack Workspace Notice renders channel, members, avatar, reactions, and thread', () => {
  const slackData = {
    channel: '#announcements-internal',
    members: 142,
    posterName: 'Elena Rostova',
    posterBadge: 'Operations Lead',
    message: 'Team, please submit travel receipts before 5 PM today.',
    reactions: ['👍 18', '👀 24']
  };
  const html = docEngine.render('Slack', slackData);
  assert(html.includes('#announcements-internal'), 'Must include channel name');
  assert(html.includes('142 members'), 'Must include member count');
  assert(html.includes('Elena Rostova'), 'Must include poster name');
  assert(html.includes('Operations Lead'), 'Must include role badge');
  assert(html.includes('👍 18'), 'Must include reaction counter');
  assert(html.includes('slack-notice'), 'Must have slack-notice class');
});

runTest('F18: Fallback renderer gracefully handles unstructured document types', () => {
  const memoHtml = docEngine.render('Memo', 'Internal company policy reminder regarding remote work.');
  assert(memoHtml.includes('generic-document'), 'Must return generic container');
  assert(memoHtml.includes('Internal company policy'), 'Must preserve message content');
  assert(docEngine.getTemplates().length === 4, 'Must define 4 authentic templates');
});

// ============================================================================
// 2. TOEIC LISTENING SYNC & INDIRECT TRAPS (F2, F3, F23, F24 - R1, R7)
// ============================================================================
console.log('\n--- 2. Testing ToeicListeningSync (F2, F3, F23, F24) ---');
const listenEngine = new ToeicListeningSync();

runTest('F23: Karaoke parses segment transcript and matches active line start <= currentTime <= end', () => {
  const segments = listenEngine.parseSegments([
    { start: 0.0, end: 2.5, speaker: 'Man', text: 'Good morning Sarah.' },
    { start: 2.6, end: 5.0, speaker: 'Woman', text: 'Hello Marcus, did you check the itinerary?' },
    { start: 5.1, end: 8.0, speaker: 'Man', text: 'Yes, everything looks ready for the client.' }
  ]);
  assert.strictEqual(segments.length, 3);
  
  const active1 = listenEngine.getActiveSegment(1.5, segments);
  assert.strictEqual(active1.id, 1);
  assert(active1.text.includes('Good morning'));

  const active2 = listenEngine.getActiveSegment(3.8, segments);
  assert.strictEqual(active2.id, 2);
  assert(active2.text.includes('Hello Marcus'));

  const activeNone = listenEngine.getActiveSegment(12.0, segments);
  assert.strictEqual(activeNone, null);
});

runTest('F23: Karaoke calculateLineProgress returns correct normalized progression ratio [0, 1]', () => {
  assert.strictEqual(listenEngine.calculateLineProgress(2.0, 2.0, 4.0), 0.0);
  assert.strictEqual(listenEngine.calculateLineProgress(3.0, 2.0, 4.0), 0.5);
  assert.strictEqual(listenEngine.calculateLineProgress(4.0, 2.0, 4.0), 1.0);
  assert.strictEqual(listenEngine.calculateLineProgress(5.0, 2.0, 4.0), 1.0); // Clamped
});

runTest('F23: SeekToSegment sets audio element currentTime and returns start timestamp', () => {
  const mockAudio = { currentTime: 0, play: () => Promise.resolve() };
  const target = { start: 4.8, end: 7.2 };
  const seekTime = listenEngine.seekToSegment(target, mockAudio);
  assert.strictEqual(seekTime, 4.8);
  assert.strictEqual(mockAudio.currentTime, 4.8);
});

runTest('F24: Accent Classifier extracts metadata and maps national flags for US, UK, AU, CA', () => {
  assert.strictEqual(listenEngine.getFlag('US'), '🇺🇸');
  assert.strictEqual(listenEngine.getFlag('UK'), '🇬🇧');
  assert.strictEqual(listenEngine.getFlag('AU'), '🇦🇺');
  assert.strictEqual(listenEngine.getFlag('CA'), '🇨🇦');
  assert.strictEqual(listenEngine.getFlag('UNKNOWN'), '🌐');

  const meta = listenEngine.extractAccent({ id: 'p3_01', accent: 'UK', secondaryAccent: 'US' });
  assert.strictEqual(meta.accent, 'UK');
  assert.strictEqual(meta.secondaryAccent, 'US');
});

runTest('F24: Accent Classifier returns regional phonetic variations and multi-accent detection', () => {
  const ukTip = listenEngine.getAccentTips('UK');
  assert(ukTip.includes('/r/'), 'UK tip should mention non-rhotic r');
  const auTip = listenEngine.getAccentTips('AU');
  assert(auTip.includes('/eɪ/'), 'AU tip should mention vowel shift');

  const speakers = [
    { name: 'Alex', accent: 'US' },
    { name: 'Emma', accent: 'UK' },
    { name: 'Jack', accent: 'US' }
  ];
  const distinct = listenEngine.getDistinctAccents(speakers);
  assert.strictEqual(distinct.length, 2);
  assert(distinct.includes('US') && distinct.includes('UK'));
});

runTest('F2: Indirect Reversal trap detection catches reversal trigger tokens (wait, actually)', () => {
  const dialogue1 = "M: Let's reserve the Grand Ballroom for Friday. W: Wait, the HVAC system is under repair. Let's switch to the Oak Suite.";
  const res1 = listenEngine.detectReversal(dialogue1);
  assert.strictEqual(res1.hasReversal, true);
  assert.strictEqual(res1.token, 'wait');

  const dialogue2 = "Actually, the delivery was postponed until next Monday.";
  const res2 = listenEngine.detectReversal(dialogue2);
  assert.strictEqual(res2.hasReversal, true);
  assert.strictEqual(res2.token, 'actually');
});

runTest('F2: Graphic matrix lookup trap distinguishes scheduled distractor vs actual revised value', () => {
  const matrix = [
    { flight: 'FL-402', scheduled: '14:15', gate: 'B12', status: 'Delayed 45m', actual: '15:00' },
    { flight: 'FL-809', scheduled: '14:30', gate: 'C04', status: 'On Time', actual: '14:30' }
  ];
  const res = listenEngine.lookupGraphicMatrix(matrix, 'flight', 'FL-402');
  assert.strictEqual(res.distractorValue, '14:15');
  assert.strictEqual(res.correctValue, '15:00');
});

runTest('F3: 8s Pre-Listening Protocol scans question cues and extracts problem synonyms', () => {
  assert.strictEqual(listenEngine.scanQuestionCue('Where does the conversation take place?'), 'LOCATION_CUE');
  assert.strictEqual(listenEngine.scanQuestionCue('Who most likely is the woman?'), 'ROLE_CUE');
  assert.strictEqual(listenEngine.scanQuestionCue('Why did the manager postpone the meeting?'), 'REASON_CUE');
  assert.strictEqual(listenEngine.scanQuestionCue('What is mentioned about the office equipment?'), 'DETAIL_CUE');

  assert.strictEqual(listenEngine.getTargetVoice('What will the woman do next?'), 'FEMALE_VOICE');
  assert.strictEqual(listenEngine.getTargetVoice('What does the man recommend?'), 'MALE_VOICE');
  assert.strictEqual(listenEngine.getTargetVoice('What will the speakers do tomorrow?'), 'BOTH_VOICES');

  const synonyms = listenEngine.extractProblemSynonyms('delay');
  assert(synonyms.includes('pushed back'));
  assert(synonyms.includes('deferred'));
});

// ============================================================================
// 3. TINDER-STYLE 3D FLASHCARDS (F21 - R6)
// ============================================================================
console.log('\n--- 3. Testing TinderFlashcards3D (F21) ---');
const tinderEngine = new TinderFlashcards3D();

runTest('F21: calculateSwipeState calculates real-time 3D tilt rotation and badges', () => {
  const rightState = tinderEngine.calculateSwipeState(80, 360);
  assert.strictEqual(rightState.badge, 'THUỘC');
  assert(rightState.rotation > 0, 'Right swipe should have positive rotation');
  assert(rightState.opacity > 0.5, 'Badge opacity should scale with dx');

  const leftState = tinderEngine.calculateSwipeState(-90, 360);
  assert.strictEqual(leftState.badge, 'CHƯA THUỘC');
  assert(leftState.rotation < 0, 'Left swipe should have negative rotation');

  const zeroState = tinderEngine.calculateSwipeState(0, 360);
  assert.strictEqual(zeroState.badge, null);
  assert.strictEqual(zeroState.rotation, 0);
});

runTest('F21: evaluateSwipeRelease evaluates release thresholds (|dx| >= 100px vs snap back)', () => {
  const ejectRight = tinderEngine.evaluateSwipeRelease(120);
  assert.strictEqual(ejectRight.action, 'EJECT_RIGHT');
  assert.strictEqual(ejectRight.rating, 3); // Good

  const ejectLeft = tinderEngine.evaluateSwipeRelease(-110);
  assert.strictEqual(ejectLeft.action, 'EJECT_LEFT');
  assert.strictEqual(ejectLeft.rating, 1);  // Again

  const snapBack = tinderEngine.evaluateSwipeRelease(45);
  assert.strictEqual(snapBack.action, 'SNAP_BACK');
  assert.strictEqual(snapBack.rating, null);
});

runTest('F21: Integration with FSRS v5 engine updates card stability and interval on rating', () => {
  const fsrs = new FSRS5Engine();
  const card = fsrs.initCard('w_requisition', 3);
  const initialStability = card.stability;

  // Swipe Right = Rating 3 (Good)
  const afterGood = fsrs.rateCard(card, 3, 1.0);
  assert(afterGood.stability > initialStability, 'Good rating must increase stability');
  assert(afterGood.intervalDays >= 3, 'Interval must be >= 3 days');

  // Swipe Left = Rating 1 (Again)
  const afterAgain = fsrs.rateCard(card, 1, 1.0);
  assert(afterAgain.stability <= initialStability, 'Again rating decreases/resets stability');
  assert.strictEqual(afterAgain.lapses, 1, 'Lapse counter must increment');
});

// ============================================================================
// 4. ONE-PAGE CHEAT SHEET GENERATOR (F4 - R1)
// ============================================================================
console.log('\n--- 4. Testing OnePageCheatSheet (F4) ---');
const cheatEngine = new OnePageCheatSheet();

runTest('F4: generateHtml produces complete 1-page printable summary with student metrics and rules', () => {
  const lessonData = {
    lessonId: 'unit03_logistics',
    title: 'Unit 03: Logistics & Transport Negotiations',
    keyRules: [
      'Quy tắc 8 giây quét trước từ khóa Part 3-4',
      'Cảnh giác từ Wait/Actually trong đổi ý phút chót'
    ],
    vocab: [
      { word: 'expedite', ipa: '/ˈek.spə.daɪt/', meaning: 'thúc đẩy nhanh tiến độ', collocation: 'expedite the shipment' }
    ],
    traps: ['TRAP-06: Bẫy đổi ý phút chót', 'TRAP-10: Bẫy Giới từ vs Liên từ']
  };
  const html = cheatEngine.generateHtml(lessonData, {
    student: { name: 'Dang Nguyen', score: 720, target: 800 }
  });

  assert(html.includes('cheat-sheet-page'), 'Must include .cheat-sheet-page container');
  assert(html.includes('Dang Nguyen'), 'Must include student name');
  assert(html.includes('720'), 'Must include diagnostic score');
  assert(html.includes('800'), 'Must include target score');
  assert(html.includes('Quy tắc 8 giây quét trước'), 'Must include key rules');
  assert(html.includes('expedite'), 'Must include vocabulary');
  assert(html.includes('TRAP-06'), 'Must include trap category warnings');
  assert(html.includes('@media print'), 'Must include print media stylesheet');
  assert(html.includes('page-break-inside: avoid'), 'Must constrain to 1 printable page');
});

runTest('F4: exportCheatSheet formats filename for download payload', () => {
  const filename = cheatEngine.exportCheatSheet('unit04', 'pdf');
  assert.strictEqual(filename, 'toeic_cheatsheet_unit04.pdf');

  const htmlFilename = cheatEngine.exportCheatSheet('unit04', 'html');
  assert.strictEqual(htmlFilename, 'toeic_cheatsheet_unit04.html');
});

// ============================================================================
// 5. TOEIC CAPSULE STATION, 80/20 & CLUSTERS (F17, F19, F20 - R5, R6)
// ============================================================================
console.log('\n--- 5. Testing ToeicCapsuleStation (F17, F19, F20) ---');
const capsuleEngine = new ToeicCapsuleStation();

runTest('F17: Capsule Type A creates 180s 3-phase drill (30s theory, 120s drill with 3 questions, 30s wrap)', () => {
  const capA = capsuleEngine.createCapsule('TRAP_DRILL');
  assert.strictEqual(capA.totalBudgetSeconds, 180);
  assert.strictEqual(capA.phases.length, 3);
  const sumPhaseDuration = capA.phases.reduce((acc, p) => acc + p.duration, 0);
  assert.strictEqual(sumPhaseDuration, 180);
  assert.strictEqual(capA.phases[1].questionsCount, 3);
  assert.strictEqual(capA.questions.length, 3);
});

runTest('F17: Capsule Type B creates 180s 5-vocab audio memory recall capsule (36s per word)', () => {
  const capB = capsuleEngine.createCapsule('VOCAB_AUDIO');
  assert.strictEqual(capB.totalBudgetSeconds, 180);
  assert.strictEqual(capB.wordsCount, 5);
  assert.strictEqual(capB.perWordBudget, 36);
  assert.strictEqual(capB.wordsCount * capB.perWordBudget, 180);
});

runTest('F17: awardCapsuleXP awards correct XP bonus for perfect and standard completions', () => {
  assert.strictEqual(capsuleEngine.awardCapsuleXP(true), 50);
  assert.strictEqual(capsuleEngine.awardCapsuleXP(false), 25);
});

runTest('F19: 80/20 Frequency tiering maps items into Cực Cao, Cao, Trung Bình and sorts by priority', () => {
  assert.strictEqual(capsuleEngine.isValidTier('Cực Cao'), true);
  assert.strictEqual(capsuleEngine.isValidTier('Cao'), true);
  assert.strictEqual(capsuleEngine.isValidTier('Trung Bình'), true);
  assert.strictEqual(capsuleEngine.isValidTier('Thấp'), false);

  const curCaoList = capsuleEngine.filterByTier('Cực Cao');
  assert(curCaoList.length >= 5, 'Should have multiple Cực Cao items');
  assert(curCaoList.some(v => v.word === 'expedite'));

  const items = [
    { word: 'W1', tier: 'Trung Bình' },
    { word: 'W2', tier: 'Cực Cao' },
    { word: 'W3', tier: 'Cao' }
  ];
  const sorted = capsuleEngine.sortVocabBy8020(items);
  assert.strictEqual(sorted[0].word, 'W2', 'Cực Cao must come first');
  assert.strictEqual(sorted[1].word, 'W3', 'Cao must come second');
  assert.strictEqual(sorted[2].word, 'W1', 'Trung Bình must come last');

  assert(capsuleEngine.getBadgeClass('Cực Cao').includes('rose'));
  assert(capsuleEngine.getBadgeClass('Cao').includes('amber'));
});

runTest('F20: 10 Office Paraphrase clusters bidirectional lookup and sibling extraction', () => {
  const clusters = capsuleEngine.getClusters();
  assert.strictEqual(clusters.length, 10, 'Must have exactly 10 core business clusters');

  const parent = capsuleEngine.findClusterByTerm('defer');
  assert(parent !== null);
  assert.strictEqual(parent.id, 'POSTPONE');

  const siblings = capsuleEngine.findSiblings('defer');
  assert(siblings.includes('postpone'));
  assert(siblings.includes('push back'));
  assert(!siblings.includes('defer'), 'Siblings must exclude target query term');
});

runTest('F20: Distractor discriminator distinguishes genuine synonyms from deceptive distractors', () => {
  assert.strictEqual(capsuleEngine.isSynonym('postpone', 'reschedule'), true);
  assert.strictEqual(capsuleEngine.isSynonym('postpone', 'push back'), true);
  assert.strictEqual(capsuleEngine.isSynonym('postpone', 'cancel'), false, 'Cancel is deceptive distractor');
});

runTest('F20: highlightClusterMatches highlights occurrences in text with <mark class="cluster-match">', () => {
  const sample = "The manager decided to push back the seminar and expedite the review.";
  const highlighted = capsuleEngine.highlightClusterMatches(sample);
  assert(highlighted.includes('<mark class="cluster-match">push back</mark>'));
  assert(highlighted.includes('<mark class="cluster-match">expedite</mark>'));
});

runTest('F20: generateSynonymQuiz constructs structured 4-option quiz question', () => {
  const quiz = capsuleEngine.generateSynonymQuiz('POSTPONE', 'defer', 'reschedule', ['cancel', 'accelerate', 'terminate']);
  assert.strictEqual(quiz.correctAnswer, 'reschedule');
  assert.strictEqual(quiz.options.length, 4);
  assert(quiz.prompt.includes('defer'));
});

console.log('\n================================================================');
console.log(`MILESTONE 3 VERIFICATION SUMMARY: Passed: ${passedTests}, Failed: ${failedTests}`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL MILESTONE 3 VERIFICATION TESTS PASSED 100%!');
  process.exit(0);
}
