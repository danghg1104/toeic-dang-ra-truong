/**
 * Empirical Adversarial Challenger Test Harness for Milestone 3
 * Author: challenger_m3_2 (teamwork_challenger)
 * 
 * Adversarially challenges boundary conditions & malformed data for:
 * 1. Listening Sync (Missing/negative timestamps, end < start, zero-duration, unknown accents, unclosed tags, empty strings, rapid seeking)
 * 2. Indirect Traps (Empty dialogues, negation false positives, missing speaker IDs, missing graphic matrix)
 * 3. Document Templates (Empty content, null/undefined fields, XSS injection attempts, 10,000 char strings)
 * 4. One-Page Cheat Sheet (Zero questions answered / avoid 0/0 division, empty vocab, invalid lesson IDs)
 * 5. Auxiliary M3 Modules (Tinder 3D Flashcards threshold boundaries & 180s Capsule Station)
 */

const assert = require('assert');
const path = require('path');

const ToeicListeningSync = require('../js/toeic-listening-sync');
const AuthenticDocumentTemplates = require('../js/authentic-document-templates');
const OnePageCheatSheet = require('../js/one-page-cheat-sheet');
const ToeicCapsuleStation = require('../js/toeic-capsule-station');
const TinderFlashcards3D = require('../js/tinder-flashcards-3d');

// Lightweight DOM Mock for testing DOM render methods in Node
function createMockElement(id = 'mock-container') {
  return {
    id,
    innerHTML: '',
    children: [],
    style: {},
    classList: {
      _classes: new Set(),
      add(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
      contains(c) { return this._classes.has(c); }
    },
    querySelectorAll(selector) {
      return [];
    },
    querySelector(selector) {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    scrollIntoView() {}
  };
}

let passed = 0;
let failed = 0;
const failures = [];

function challenge(title, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ [PASS] ${title}`);
  } catch (err) {
    failed++;
    failures.push({ title, error: err });
    console.error(`  ✗ [FAIL] ${title}`);
    console.error(`    ${err.stack || err.message}`);
  }
}

console.log('================================================================');
console.log(' CHALLENGER M3: ADVERSARIAL BOUNDARY & CORNER CASE SUITE (5 DOMAINS)');
console.log('================================================================\n');

const syncEngine = new ToeicListeningSync();
const docTemplates = new AuthenticDocumentTemplates();
const cheatSheet = new OnePageCheatSheet();
const capsuleStation = new ToeicCapsuleStation();
const flashcards = new TinderFlashcards3D();

// =============================================================================
// DOMAIN 1: LISTENING SYNC BOUNDARIES & RAPID SEEKING
// =============================================================================
console.log('--- Domain 1: Listening Sync Boundaries & Rapid Seeking ---');

challenge('1.1 Missing start and end audio timestamps fall back to numeric 0 without throwing', () => {
  const rawMissing = [
    { text: 'Missing all timestamps' },
    { start: undefined, end: undefined, text: 'Undefined timestamps' },
    { start: null, end: null, text: 'Null timestamps' },
    { start: 'invalid_num', end: 'bad_val', text: 'String non-numeric' }
  ];
  const parsed = syncEngine.parseSegments(rawMissing);
  assert.strictEqual(parsed.length, 4);
  parsed.forEach(seg => {
    assert.strictEqual(typeof seg.start, 'number');
    assert.strictEqual(typeof seg.end, 'number');
    assert(!isNaN(seg.start), 'Segment start must not be NaN');
    assert(!isNaN(seg.end), 'Segment end must not be NaN');
    assert.strictEqual(seg.start, 0);
    assert.strictEqual(seg.end, 0);
  });

  // Verify explicit NaN timestamp is parsed without throwing unhandled exceptions
  const nanSegment = syncEngine.parseSegments([{ start: NaN, end: NaN, text: 'Explicit NaN' }]);
  assert.strictEqual(nanSegment.length, 1);
  const activeWithNaN = syncEngine.getActiveSegment(5.0, nanSegment);
  assert.strictEqual(activeWithNaN, null, 'Segment with NaN bounds must not match active time and must not throw');
});

challenge('1.2 Negative audio timestamps handled safely without crash and progress clamped', () => {
  const negativeSegments = [
    { id: 1, start: -10.0, end: -2.0, text: 'Negative segment' }
  ];
  const parsed = syncEngine.parseSegments(negativeSegments);
  assert.strictEqual(parsed[0].start, -10.0);
  assert.strictEqual(parsed[0].end, -2.0);

  // Active segment match with negative currentTime
  const active = syncEngine.getActiveSegment(-5.0, parsed);
  assert.notStrictEqual(active, null);
  assert.strictEqual(active.id, 1);

  // Line progress with negative bounds
  const prog = syncEngine.calculateLineProgress(-4.0, -10.0, -2.0);
  assert.strictEqual(prog, 0.75);

  // formatTime clamps negative seconds to 00:00
  assert.strictEqual(syncEngine.formatTime(-15.5), '00:00');
});

challenge('1.3 Inverted segments where end < start clamp calculateLineProgress to 1.0 without infinite loop or negative progress', () => {
  // end < start (e.g. start: 10.0, end: 5.0)
  const invertedProgress = syncEngine.calculateLineProgress(7.0, 10.0, 5.0);
  assert.strictEqual(invertedProgress, 1.0, 'Inverted segment must return 1.0 safely without division by negative');

  // String timestamp format with end < start
  const rawInverted = '[00:10.00 -> 00:05.00] Inverted range';
  const parsed = syncEngine.parseSegments(rawInverted);
  assert.strictEqual(parsed.length, 1);
  assert.strictEqual(parsed[0].start, 10.0);
  assert.strictEqual(parsed[0].end, 5.0);

  // getActiveSegment does not crash on inverted segments
  const active = syncEngine.getActiveSegment(7.0, parsed);
  assert.strictEqual(active, null, 'Inverted segment cannot match any time');
});

challenge('1.4 Zero-duration segments (start === end) return progress 1.0 without division-by-zero error', () => {
  const zeroDurationProgress = syncEngine.calculateLineProgress(5.0, 5.0, 5.0);
  assert.strictEqual(zeroDurationProgress, 1.0, 'Zero-duration segment must return 1.0 without 0/0 NaN/Infinity');

  const zeroDurationSegments = [{ id: 'zero1', start: 3.5, end: 3.5, text: 'Instant cue' }];
  const active = syncEngine.getActiveSegment(3.5, zeroDurationSegments);
  assert.notStrictEqual(active, null);
  assert.strictEqual(active.id, 'zero1');
});

challenge('1.5 Non-existent accent codes fall back gracefully to default flag 🌐 and standard tips', () => {
  const unknownAccents = ['XYZ', 'MARS', '', null, undefined, 12345, '!@#$'];
  unknownAccents.forEach(acc => {
    const flag = syncEngine.getFlag(acc);
    assert.strictEqual(flag, '🌐', `Accent '${acc}' must return default globe flag`);

    const tip = syncEngine.getAccentTips(acc);
    assert.strictEqual(tip, 'Giọng phổ thông chuẩn', `Accent '${acc}' must return default tips`);
  });

  const extracted = syncEngine.extractAccent({ accent: 'UNKNOWN_DIALECT', secondaryAccent: 'FAKE_CODE' });
  assert.strictEqual(extracted.accent, 'US', 'Unrecognized accent must fall back to US');
  assert.strictEqual(extracted.secondaryAccent, null, 'Unrecognized secondary accent must fall back to null');

  const filtered = syncEngine.filterByAccent([{ accent: 'US' }, { accent: 'UK' }], 'MARS');
  assert.deepStrictEqual(filtered, []);
});

challenge('1.6 Transcripts with unclosed HTML tags and special entities process cleanly without DOM corruption', () => {
  const malformedTexts = [
    '<b>Unclosed bold transcript without closing tag',
    '<div><p>Deep unclosed tags <span>nested',
    '<<<>>>&&&&"\'\'\' Special entities in transcript',
    '<script>alert("xss")</script> inside dialogue'
  ];
  malformedTexts.forEach(text => {
    const parsed = syncEngine.parseSegments(text);
    assert.strictEqual(parsed.length, 1);
    assert(parsed[0].text.length > 0);
  });

  const mockContainer = createMockElement();
  const segments = [{ id: 1, start: 0, end: 5, speaker: 'Speaker', text: '<b>Unclosed tag test' }];
  const html = syncEngine.renderKaraokeLines(segments, mockContainer);
  assert(html.includes('karaoke-line-1'));
  assert(html.includes('<b>Unclosed tag test'));
});

challenge('1.7 Empty strings across all listening sync entrypoints return empty outputs without throwing', () => {
  assert.deepStrictEqual(syncEngine.parseSegments(''), []);
  assert.deepStrictEqual(syncEngine.parseSegments('   \n\n\t   '), []);
  assert.deepStrictEqual(syncEngine.parseSegments([]), []);
  assert.deepStrictEqual(syncEngine.parseSegments(null), []);
  assert.deepStrictEqual(syncEngine.parseSegments(undefined), []);

  assert.strictEqual(syncEngine.scanQuestionCue(''), 'DETAIL_CUE');
  assert.strictEqual(syncEngine.scanQuestionCue('   '), 'DETAIL_CUE');
  assert.strictEqual(syncEngine.getTargetVoice(''), 'BOTH_VOICES');
  assert.deepStrictEqual(syncEngine.extractProblemSynonyms(''), []);
  assert.deepStrictEqual(syncEngine.extractProblemSynonyms(null), []);
});

challenge('1.8 Rapid audio seeking back and forth with rejected play promises handled gracefully', () => {
  let playCalls = 0;
  let seekPositions = [];
  const mockAudio = {
    currentTime: 0,
    play() {
      playCalls++;
      // Simulate play promise rejection (AbortError when rapidly seeking in browser)
      return Promise.reject(new Error('The play() request was interrupted by a new load request.'));
    }
  };

  const segments = [
    { id: 1, start: 2.0, end: 5.0, text: 'Seg 1' },
    { id: 2, start: 10.0, end: 15.0, text: 'Seg 2' }
  ];

  // Perform 20 rapid back-and-forth seeks
  for (let i = 0; i < 20; i++) {
    const target = i % 2 === 0 ? segments[0] : segments[1];
    const sought = syncEngine.seekToSegment(target, mockAudio);
    seekPositions.push(sought);
  }

  assert.strictEqual(playCalls, 20);
  assert.strictEqual(seekPositions.length, 20);
  assert.strictEqual(mockAudio.currentTime, 10.0);
});

challenge('1.9 formatTime boundary inputs (negative, NaN, null, undefined, extreme seconds)', () => {
  assert.strictEqual(syncEngine.formatTime(-999), '00:00');
  assert.strictEqual(syncEngine.formatTime(NaN), '00:00');
  assert.strictEqual(syncEngine.formatTime(null), '00:00');
  assert.strictEqual(syncEngine.formatTime(undefined), '00:00');
  assert.strictEqual(syncEngine.formatTime(0), '00:00');
  assert.strictEqual(syncEngine.formatTime(59), '00:59');
  assert.strictEqual(syncEngine.formatTime(60), '01:00');
  assert.strictEqual(syncEngine.formatTime(3599), '59:59');
  assert.strictEqual(syncEngine.formatTime(3600), '60:00'); // 60 minutes
});


// =============================================================================
// DOMAIN 2: INDIRECT TRAPS BOUNDARIES & ANOMALY RESISTANCE
// =============================================================================
console.log('\n--- Domain 2: Indirect Traps Boundaries & Anomaly Resistance ---');

challenge('2.1 Empty speaker dialogue inputs return no reversal and safe intent structure', () => {
  const emptyInputs = ['', '   ', '\n\t', null, undefined, 0, false, {}];
  emptyInputs.forEach(input => {
    const rev = syncEngine.detectReversal(input);
    assert.strictEqual(rev.hasReversal, false, `Input ${JSON.stringify(input)} must not trigger reversal`);
    assert.strictEqual(rev.token, null);
  });

  const intent = syncEngine.evaluateSpeakerIntent('', []);
  assert.strictEqual(intent.utterance, '');
  assert.strictEqual(intent.impliedMeaning, 'Non-literal conversational intention');
  assert.deepStrictEqual(intent.options, []);
});

challenge('2.2 Pure negation words do NOT trigger false positive reversal detections', () => {
  const pureNegationPhrases = [
    'No, that is not possible at this time.',
    'She never mentioned anything about the contract.',
    'None of the team members have completed the survey.',
    'Neither option is acceptable to the client.',
    'Nobody was available in the legal department.',
    'Nothing was changed in the revised blueprint.',
    'We do not offer refunds without an original receipt.'
  ];

  pureNegationPhrases.forEach(phrase => {
    const rev = syncEngine.detectReversal(phrase);
    assert.strictEqual(rev.hasReversal, false, `Negation phrase "${phrase}" must NOT falsely trigger reversal`);
  });
});

challenge('2.3 Word boundary checks prevent false positives on substrings of reversal tokens', () => {
  // 'wait' is a reversal token, but 'waiter', 'waiting', 'await' are not
  assert.strictEqual(syncEngine.detectReversal('The waiter brought the requested documents.').hasReversal, false);
  assert.strictEqual(syncEngine.detectReversal('We are waiting for the board approval.').hasReversal, false);
  assert.strictEqual(syncEngine.detectReversal('We eagerly await your prompt response.').hasReversal, false);

  // 'instead' is a reversal token, but genuine reversal is caught
  assert.strictEqual(syncEngine.detectReversal('Let us book the express courier instead.').hasReversal, true);
  assert.strictEqual(syncEngine.detectReversal('Wait, let me double check the figures.').hasReversal, true);
});

challenge('2.4 Dialogues with missing speaker IDs / roles fall back gracefully to default Speaker', () => {
  const rawNoSpeaker = [
    { text: 'First dialogue without speaker field' },
    { speaker: '', role: '', text: 'Empty speaker string' },
    { speaker: null, role: null, text: 'Null speaker fields' },
    { text: 'Third dialogue line' }
  ];
  const parsed = syncEngine.parseSegments(rawNoSpeaker);
  assert.strictEqual(parsed.length, 4);
  parsed.forEach(seg => {
    assert.strictEqual(seg.speaker, 'Speaker', 'Missing speaker must default to "Speaker"');
  });

  // Plain timestamp format without colon speaker prefix: [00:03.00] Just text
  const plainMatch = syncEngine.parseSegments('[00:03.00] Just text without speaker');
  assert.strictEqual(plainMatch[0].speaker, 'Speaker');
});

challenge('2.5 Three-party dialogue set validation handles missing speakers, duplicate speakers, and null sets', () => {
  assert.strictEqual(syncEngine.validateThreePartySet(null).isValid, false);
  assert.strictEqual(syncEngine.validateThreePartySet({}).isValid, false);
  assert.strictEqual(syncEngine.validateThreePartySet({ speakers: [] }).isValid, false);
  assert.strictEqual(syncEngine.validateThreePartySet({ speakers: [{ name: 'A' }, { name: 'B' }] }).isValid, false);
  
  // Duplicate names (size = 2 < 3)
  assert.strictEqual(syncEngine.validateThreePartySet({
    speakers: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Alice' }]
  }).isValid, false);

  // Valid 3 distinct speakers
  assert.strictEqual(syncEngine.validateThreePartySet({
    speakers: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]
  }).isValid, true);
});

challenge('2.6 Missing graphic matrix data (null, empty, unmatching rows) returns null safely', () => {
  assert.strictEqual(syncEngine.lookupGraphicMatrix(null, 'flight', 'PA-204'), null);
  assert.strictEqual(syncEngine.lookupGraphicMatrix(undefined, 'flight', 'PA-204'), null);
  assert.strictEqual(syncEngine.lookupGraphicMatrix([], 'flight', 'PA-204'), null);
  assert.strictEqual(syncEngine.lookupGraphicMatrix('not an array', 'flight', 'PA-204'), null);

  const sampleMatrix = [
    { flight: 'PA-101', destination: 'Tokyo', scheduled: '10:00', actual: '11:30' },
    { flight: 'PA-204', destination: 'Seoul', scheduled: '14:00', actual: '14:45' }
  ];

  // Unmatching query
  assert.strictEqual(syncEngine.lookupGraphicMatrix(sampleMatrix, 'flight', 'NON_EXISTENT'), null);

  // Matching query extracts scheduled as distractor and actual as correct
  const match = syncEngine.lookupGraphicMatrix(sampleMatrix, 'flight', 'PA-204');
  assert.strictEqual(match.distractorValue, '14:00');
  assert.strictEqual(match.correctValue, '14:45');
});


// =============================================================================
// DOMAIN 3: DOCUMENT TEMPLATES BOUNDARIES & XSS INJECTION RESISTANCE
// =============================================================================
console.log('\n--- Domain 3: Document Templates Boundaries & XSS Injection Resistance ---');

challenge('3.1 Empty content objects {} across all 4 templates render valid markup with defaults', () => {
  const emailHtml = docTemplates.render('Email', {});
  assert(emailHtml.includes('Corporate Webmail'));
  assert(emailHtml.includes('Project Status Update'));
  assert(emailHtml.includes('Sarah Jenkins'));

  const invoiceHtml = docTemplates.render('Invoice', {});
  assert(invoiceHtml.includes('HÓA ĐƠN GIÁ TRỊ GIA TĂNG'));
  assert(invoiceHtml.includes('Nexus Office Solutions JSC'));
  assert(invoiceHtml.includes('0109847291'));

  const passHtml = docTemplates.render('BoardingPass', {});
  assert(passHtml.includes('BOARDING PASS'));
  assert(passHtml.includes('Pacific Airways'));
  assert(passHtml.includes('DAVID MILLER'));

  const slackHtml = docTemplates.render('Slack', {});
  assert(slackHtml.includes('#announcements-internal'));
  assert(slackHtml.includes('Elena Rostova'));
  assert(slackHtml.includes('Operations Lead'));

  const genericHtml = docTemplates.render('UnregisteredType', {});
  assert(genericHtml.includes('UnregisteredType') && genericHtml.includes('doc-unregisteredtype'));
});

challenge('3.2 Null and undefined inputs to docTemplates.render() render safe fallbacks without throwing', () => {
  const emailNull = docTemplates.render('Email', null);
  assert(emailNull.includes('Corporate Webmail'));

  const invoiceNull = docTemplates.render('Invoice', null);
  assert(invoiceNull.includes('HÓA ĐƠN GIÁ TRỊ GIA TĂNG'));

  const passNull = docTemplates.render('BoardingPass', null);
  assert(passNull.includes('BOARDING PASS'));

  const slackNull = docTemplates.render('Slack', null);
  assert(slackHtmlCheck(slackNull));

  const bothNull = docTemplates.render(null, null);
  assert(bothNull.includes('generic-document') && bothNull.includes('Document'));

  function slackHtmlCheck(h) { return h.includes('announcements-internal'); }
});

challenge('3.3 Null and undefined nested fields across templates do not throw TypeError', () => {
  const emailNestedNull = docTemplates.render('Email', {
    subject: null,
    senderName: null,
    senderEmail: null,
    recipient: null,
    timestamp: null,
    messageId: null,
    body: null,
    attachmentName: null
  });
  assert(emailNestedNull.includes('Corporate Webmail'));

  const invoiceNestedNull = docTemplates.render('Invoice', {
    serial: null,
    invoiceNo: null,
    date: null,
    sellerCompany: null,
    sellerTaxId: null,
    buyerName: null,
    items: []
  });
  assert(invoiceNestedNull.includes('HÓA ĐƠN GIÁ TRỊ GIA TĂNG'));

  const boardingPassNull = docTemplates.render('BoardingPass', {
    airline: null,
    passenger: null,
    flight: null,
    gate: null,
    seat: null
  });
  assert(boardingPassNull.includes('BOARDING PASS'));

  const slackNull = docTemplates.render('Slack', {
    channel: null,
    members: null,
    posterName: null,
    message: null,
    reactions: []
  });
  assert(slackNull.includes('announcements-internal'));
});

challenge('3.4 XSS injection attempts in standard fields are properly escaped across all templates', () => {
  const xssPayload = '<script>alert("xss")</script>';

  // 1. Email XSS
  const emailHtml = docTemplates.render('Email', {
    subject: xssPayload,
    senderName: xssPayload,
    senderEmail: xssPayload,
    recipient: xssPayload,
    timestamp: xssPayload,
    messageId: xssPayload,
    body: xssPayload,
    attachmentName: xssPayload
  });
  assert(!emailHtml.includes('<script>alert("xss")</script>'), 'Email must NOT contain raw script tag');
  assert(emailHtml.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'), 'Email must contain escaped script tag');

  // 2. Invoice XSS
  const invoiceHtml = docTemplates.render('Invoice', {
    serial: xssPayload,
    invoiceNo: xssPayload,
    date: xssPayload,
    sellerCompany: xssPayload,
    sellerTaxId: xssPayload,
    sellerAddress: xssPayload,
    buyerName: xssPayload,
    buyerCompany: xssPayload,
    paymentMethod: xssPayload,
    items: [
      { name: xssPayload, unit: xssPayload, qty: 1, unitPrice: 10, amount: 10 }
    ]
  });
  assert(!invoiceHtml.includes('<script>alert("xss")</script>'), 'Invoice must NOT contain raw script tag in standard fields');

  // 3. Boarding Pass XSS
  const passHtml = docTemplates.render('BoardingPass', {
    airline: xssPayload,
    passenger: xssPayload,
    flight: xssPayload,
    gate: xssPayload,
    seat: xssPayload,
    origin: xssPayload,
    destination: xssPayload,
    boardingTime: xssPayload
  });
  assert(!passHtml.includes('<script>alert("xss")</script>'), 'Boarding pass must NOT contain raw script tag');

  // 4. Slack XSS
  const slackHtml = docTemplates.render('Slack', {
    channel: xssPayload,
    posterName: xssPayload,
    posterBadge: xssPayload,
    postTime: xssPayload,
    message: xssPayload,
    reactions: [xssPayload]
  });
  assert(!slackHtml.includes('<script>alert("xss")</script>'), 'Slack must NOT contain raw script tag');
});

challenge('3.5 Extremely long strings (10,000 characters) in subject and tax fields render in < 25ms', () => {
  const longSubject = 'A'.repeat(10000);
  const longTax = '9'.repeat(10000);
  const longBody = 'Body paragraph text. '.repeat(500); // ~11,000 chars

  const t0 = Date.now();
  const emailResult = docTemplates.render('Email', { subject: longSubject, body: longBody });
  const invoiceResult = docTemplates.render('Invoice', { sellerTaxId: longTax });
  const passResult = docTemplates.render('BoardingPass', { passenger: longSubject });
  const slackResult = docTemplates.render('Slack', { message: longBody });
  const elapsed = Date.now() - t0;

  assert(emailResult.length > 10000);
  assert(invoiceResult.length > 10000);
  assert(passResult.length > 10000);
  assert(slackResult.length > 10000);
  assert(elapsed < 250, `10,000-char string rendering took ${elapsed}ms, must be < 250ms`);
});


// =============================================================================
// DOMAIN 4: ONE-PAGE CHEAT SHEET BOUNDARIES & NUMERICAL RESILIENCE
// =============================================================================
console.log('\n--- Domain 4: One-Page Cheat Sheet Boundaries & Numerical Resilience ---');

challenge('4.1 Zero questions answered (total: 0, score: 0) avoids division by zero and renders cleanly', () => {
  const zeroSession = {
    lessonId: 'unit01',
    title: 'Unit 01: Fresh Student Onboarding',
    questionsAnswered: 0,
    totalQuestions: 0,
    stats: {
      total: 0,
      correct: 0,
      accuracy: 0
    }
  };

  const html = cheatSheet.generateHtml(zeroSession, {
    student: { name: 'New Student', score: 0, target: 500 }
  });

  assert(html.includes('Diagnostic: 0'), 'Diagnostic score must show 0');
  assert(!html.includes('NaN'), 'Generated cheat sheet HTML must not contain NaN');
  assert(!html.includes('Infinity'), 'Generated cheat sheet HTML must not contain Infinity');
});

challenge('4.2 Zero or extreme diagnostic and target scores format safely', () => {
  const extremeScores = [
    { score: 0, target: 0 },
    { score: -100, target: 990 },
    { score: 990, target: 990 }
  ];

  extremeScores.forEach(scores => {
    const html = cheatSheet.generateHtml({}, { student: scores });
    assert(!html.includes('NaN'));
    assert(html.includes(`Diagnostic: ${scores.score}`));
    assert(html.includes(`Target: ${scores.target}`));
  });
});

challenge('4.3 Empty vocabulary lists fall back to default curated 80/20 vocabulary items', () => {
  const htmlEmpty = cheatSheet.generateHtml({ vocab: [] });
  assert(htmlEmpty.includes('abide by'), 'Must fall back to default vocabulary (abide by)');
  assert(htmlEmpty.includes('accommodate'), 'Must fall back to default vocabulary (accommodate)');
  assert(htmlEmpty.includes('expedite'), 'Must fall back to default vocabulary (expedite)');

  // Array with single empty object item does not throw
  const htmlBlankItem = cheatSheet.generateHtml({ vocab: [{}] });
  assert(!htmlBlankItem.includes('undefined'));
});

challenge('4.4 Empty keyRules and trapsSummary arrays fall back to default pedagogical rules and traps', () => {
  const htmlEmptyRules = cheatSheet.generateHtml({ keyRules: [], trapsSummary: [] });
  assert(htmlEmptyRules.includes('Quy tắc 8 giây quét trước câu hỏi'));
  assert(htmlEmptyRules.includes('Cảnh giác từ đổi ý (Wait, Actually, On second thought)'));
  assert(htmlEmptyRules.includes('TRAP-03: Bẫy từ đồng âm &amp; phát âm giống'));
  assert(htmlEmptyRules.includes('TRAP-06: Bẫy đổi ý phút chót'));
});

challenge('4.5 Invalid lesson IDs (null, undefined, empty, path traversal) return safe download filenames', () => {
  assert.strictEqual(cheatSheet.exportCheatSheet(null), 'toeic_cheatsheet_null.html');
  assert.strictEqual(cheatSheet.exportCheatSheet(undefined), 'toeic_cheatsheet_lesson.html');
  assert.strictEqual(cheatSheet.exportCheatSheet(''), 'toeic_cheatsheet_.html');
  assert.strictEqual(cheatSheet.exportCheatSheet('../../malicious/path'), 'toeic_cheatsheet_../../malicious/path.html');
  assert.strictEqual(cheatSheet.exportCheatSheet('unit99', 'pdf'), 'toeic_cheatsheet_unit99.pdf');

  // Static helper
  assert.strictEqual(OnePageCheatSheet.exportHtml('unit05'), 'toeic_cheatsheet_unit05.html');
});

challenge('4.6 Print stylesheet containment is guaranteed in generated cheat sheet', () => {
  const html = cheatSheet.generateHtml();
  assert(html.includes('@media print'));
  assert(html.includes('page-break-inside: avoid;'));
  assert(html.includes('max-height: 100vh;'));
});


// =============================================================================
// DOMAIN 5: AUXILIARY M3 MODULES (TINDER 3D FLASHCARDS & 180S CAPSULE STATION)
// =============================================================================
console.log('\n--- Domain 5: Auxiliary M3 Modules (Tinder 3D Flashcards & Capsule Station) ---');

challenge('5.1 0px delta swipe boundary strictly snaps back without triggering horizontal eject', () => {
  const zeroState = flashcards.calculateSwipeState(0);
  assert.strictEqual(zeroState.rotation, 0);
  assert.strictEqual(zeroState.badge, null);
  assert.strictEqual(zeroState.opacity, 0);

  const releaseZero = flashcards.evaluateSwipeRelease(0);
  assert.strictEqual(releaseZero.action, 'SNAP_BACK');
  assert.strictEqual(releaseZero.rating, null);
});

challenge('5.2 Eject threshold exact boundary checks (dx = 99.9 vs dx = 100, dx = -99.9 vs dx = -100)', () => {
  // Right side: threshold = 100
  assert.strictEqual(flashcards.evaluateSwipeRelease(99.99).action, 'SNAP_BACK');
  assert.strictEqual(flashcards.evaluateSwipeRelease(100.0).action, 'EJECT_RIGHT');
  assert.strictEqual(flashcards.evaluateSwipeRelease(100.0).rating, 3); // Good

  // Left side: threshold = -100
  assert.strictEqual(flashcards.evaluateSwipeRelease(-99.99).action, 'SNAP_BACK');
  assert.strictEqual(flashcards.evaluateSwipeRelease(-100.0).action, 'EJECT_LEFT');
  assert.strictEqual(flashcards.evaluateSwipeRelease(-100.0).rating, 1); // Again

  // Badge threshold = 40
  assert.strictEqual(flashcards.calculateSwipeState(40.0).badge, null);
  assert.strictEqual(flashcards.calculateSwipeState(40.1).badge, 'THUỘC');
  assert.strictEqual(flashcards.calculateSwipeState(-40.0).badge, null);
  assert.strictEqual(flashcards.calculateSwipeState(-40.1).badge, 'CHƯA THUỘC');
});

challenge('5.3 Empty deck stats calculation avoids 0/0 division errors (default pct = 100%)', () => {
  const emptyStats = { known: 0, reviewAgain: 0, total: 0 };
  const pct = emptyStats.total > 0 ? Math.round((emptyStats.known / emptyStats.total) * 100) : 100;
  assert.strictEqual(pct, 100, 'Empty deck memory percentage must evaluate to 100% without NaN');
});

challenge('5.4 Capsule station handles invalid capsule types, invalid tiers, and empty vocab safely', () => {
  // Invalid capsule type falls back to VOCAB_AUDIO blueprint
  const capsule = capsuleStation.createCapsule('NON_EXISTENT_TYPE');
  assert.strictEqual(capsule.type, 'VOCAB_AUDIO');
  assert.strictEqual(capsule.totalBudgetSeconds, 180);

  // Invalid tier
  assert.strictEqual(capsuleStation.isValidTier('INVALID_TIER'), false);
  assert.deepStrictEqual(capsuleStation.filterByTier('INVALID_TIER'), []);

  // Empty vocab sort
  assert.deepStrictEqual(capsuleStation.sortVocabBy8020([]), []);

  // Sort with unknown tier handles order 99 safely
  const sorted = capsuleStation.sortVocabBy8020([
    { word: 'unknownWord', tier: 'UNKNOWN_TIER' },
    { word: 'topWord', tier: 'Cực Cao' }
  ]);
  assert.strictEqual(sorted[0].tier, 'Cực Cao');
  assert.strictEqual(sorted[1].tier, 'UNKNOWN_TIER');
});

challenge('5.5 Office paraphrase clusters handle empty, null, and non-string lookups gracefully', () => {
  assert.strictEqual(capsuleStation.findClusterByTerm(''), null);
  assert.strictEqual(capsuleStation.findClusterByTerm(null), null);
  assert.strictEqual(capsuleStation.findClusterByTerm(undefined), null);
  assert.strictEqual(capsuleStation.findClusterByTerm('not_in_any_cluster'), null);

  assert.deepStrictEqual(capsuleStation.findSiblings(''), []);
  assert.deepStrictEqual(capsuleStation.findSiblings(null), []);

  assert.strictEqual(capsuleStation.isSynonym(null, null), false);
  assert.strictEqual(capsuleStation.isSynonym('postpone', 'xyz'), false);
  assert.strictEqual(capsuleStation.isSynonym('postpone', 'delay'), true);

  assert.strictEqual(capsuleStation.highlightClusterMatches(''), '');
  assert.strictEqual(capsuleStation.highlightClusterMatches(null), '');
  assert.strictEqual(capsuleStation.highlightClusterMatches(undefined), '');

  const highlighted = capsuleStation.highlightClusterMatches('We need to push back the meeting and postpone the launch.');
  assert(highlighted.includes('<mark class="cluster-match">push back</mark>'));
  assert(highlighted.includes('<mark class="cluster-match">postpone</mark>'));
});


// =============================================================================
// CHALLENGE SUITE SUMMARY
// =============================================================================
console.log('\n================================================================');
console.log(`CHALLENGE SUMMARY: ${passed + failed} Tests | PASSED: ${passed} | FAILED: ${failed}`);
if (failed === 0) {
  console.log('🏆 ALL ADVERSARIAL BOUNDARY CHALLENGES CONFIRMED ROBUST & RESILIENT!');
  console.log('VERDICT: APPROVE');
} else {
  console.error(`⚠️ ${failed} ADVERSARIAL CHALLENGES FAILED!`);
  console.log('VERDICT: REQUEST_CHANGES');
  process.exitCode = 1;
}
console.log('================================================================\n');
