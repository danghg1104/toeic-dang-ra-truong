'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..');
const workstationContext = {
  window: { addEventListener() {} },
  document: {},
  console,
  setTimeout,
  clearTimeout,
  Promise,
  Math,
  Date,
  JSON,
  Array,
  Object,
  String,
  Number,
  RegExp
};
vm.runInNewContext(
  fs.readFileSync(path.join(projectRoot, 'js', 'toeic-reading-workstation.js'), 'utf8'),
  workstationContext,
  { filename: 'toeic-reading-workstation.js', timeout: 10000 }
);
const workstation = workstationContext.window.ToeicReadingWorkstation;

const databaseContext = {
  window: {},
  console,
  setTimeout,
  clearTimeout,
  Promise,
  Math,
  Date,
  JSON,
  Array,
  Object,
  String,
  Number,
  RegExp
};
vm.runInNewContext(
  fs.readFileSync(path.join(projectRoot, 'js', 'reading-practice-database.js'), 'utf8'),
  databaseContext,
  { filename: 'reading-practice-database.js', timeout: 15000 }
);
const db = databaseContext.window.ReadingPracticeDatabase;
assert.ok(db, 'ReadingPracticeDatabase must initialize');

const cleanText = value => String(value || '')
  .replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'")
  .replace(/\s+/g, ' ')
  .trim();

const unsafePassagePatterns = [
  /correct answer|answer key|explanation:/i,
  /SINGLE PASSAGE NOTICE|SINGLE PASSAGE MEMO/i,
  /\u0111\u00e1p \u00e1n\s*[:：]/i,
  /ch\u1ecdn\s+[A-D]\b/i,
  /gi\u1ea3i th\u00edch\s*[:：]/i,
  /questions?\s*1[3-4]\d\s*[-–]\s*1[3-4]\d/i
];
const containsUnsafeMaterial = text => unsafePassagePatterns.some(pattern => pattern.test(text));

let p6Total = 0;
let p6Available = 0;
let p6Hidden = 0;
let p7Total = 0;
let p7Available = 0;
let p7Hidden = 0;

for (let test = 1; test <= 10; test++) {
  const fileName = 'test' + String(test).padStart(2, '0') + '_full.json';
  const file = path.join(projectRoot, 'data', 'ets2026', fileName);
  const testData = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (const group of testData.reading.part6 || []) {
    p6Total++;
    const result = workstation.getSafePart6Passage(group);

    // Exercise the legacy flattened Part 6 fallback shape (numeric test + ETS topic).
    const flattenedPart6 = {
      ...(group.questions && group.questions[0] ? group.questions[0] : {}),
      part: 6,
      test,
      topic: 'ETS 2026 Test ' + test + ' - Part 6 (' + group.qRange + ')',
      setRange: group.qRange,
      passage: group.passage || group.passage_vi || '',
      passage_vi: group.passage_vi || ''
    };
    const fallbackPart6 = workstation.getSafePart6Passage(flattenedPart6);
    assert.strictEqual(fallbackPart6.isEts2026Source, true, 'Flattened Part 6 fallback must be detected as ETS 2026');
    assert.strictEqual(fallbackPart6.isAvailable, result.isAvailable, 'Flattened Part 6 fallback must use the same safe translation decision');
    assert.strictEqual(result.isEts2026Source, true, 'Part 6 must be detected as ETS 2026: test ' + test + ' ' + group.qRange);
    const text = cleanText(result.text);
    if (result.isAvailable) {
      p6Available++;
      assert.ok(text.length >= 120, 'Part 6 passage too short: test ' + test + ' ' + group.qRange);
      assert.ok(!containsUnsafeMaterial(text), 'Part 6 leaked answer/explanation: test ' + test + ' ' + group.qRange);
    } else {
      p6Hidden++;
      assert.match(text, /ch\u01b0a c\u00f3 b\u1ea3n d\u1ecbch ngu\u1ed3n s\u1ea1ch/i);
    }
  }

  const testName = 'ETS 2026 - Test ' + String(test).padStart(2, '0');
  const groups = [
    ...(db.subtopics_part7.single_passage || []),
    ...(db.subtopics_part7.double_passage || []),
    ...(db.subtopics_part7.triple_passage || [])
  ].filter(group => group.test === testName);

  for (const group of groups) {
    p7Total++;
    const result = workstation.getSafePart7Passage(group);
    const firstQuestionInGroup = group.questions && group.questions[0];
    const fallbackQuestion = firstQuestionInGroup
      ? (testData.reading.part7 || []).find(item => item.qNum === firstQuestionInGroup.qNum)
      : null;
    if (fallbackQuestion) {
      // Legacy Ets2026Database flattens each question and provides numeric test + ETS topic.
      // It no longer carries the group range, so the safe renderer must fail closed.
      const flattenedPart7 = {
        ...fallbackQuestion,
        part: 7,
        test,
        topic: 'ETS 2026 Test ' + test + ' - Part 7 (' + group.qRange + ')'
      };
      const fallbackPart7 = workstation.getSafePart7Passage(flattenedPart7);
      assert.strictEqual(fallbackPart7.isTranslatedSource, true, 'Flattened Part 7 fallback must be detected as ETS 2026');
      assert.strictEqual(fallbackPart7.isAvailable, false, 'Flattened Part 7 fallback must not display unverified mixed passage content');
      assert.match(cleanText(fallbackPart7.html), /v\u0103n b\u1ea3n b\u00e0i \u0111\u1ecdc.*ch\u01b0a c\u00f3 b\u1ea3n ngu\u1ed3n s\u1ea1ch/i);
    }
    const text = cleanText(result.html);
    if (result.isAvailable) {
      p7Available++;
      assert.ok(text.length >= 100, 'Part 7 passage too short: test ' + test + ' ' + group.qRange);
      assert.ok(!containsUnsafeMaterial(text), 'Part 7 leaked answer/explanation: test ' + test + ' ' + group.qRange);
      assert.ok(!/SINGLE PASSAGE NOTICE|SINGLE PASSAGE MEMO/i.test(text));
      const firstQuestion = group.questions && group.questions[0];
      if (firstQuestion && firstQuestion.q) {
        const normalizedPassage = text.toLowerCase().replace(/\s+/g, ' ');
        const normalizedQuestion = String(firstQuestion.q).toLowerCase().replace(/\s+/g, ' ').trim();
        assert.ok(
          !normalizedPassage.includes(normalizedQuestion),
          'Part 7 leaked the question prompt into the passage: test ' + test + ' ' + group.qRange
        );
      }
    } else {
      p7Hidden++;
      assert.match(text, /v\u0103n b\u1ea3n b\u00e0i \u0111\u1ecdc.*ch\u01b0a c\u00f3 b\u1ea3n ngu\u1ed3n s\u1ea1ch/i);
    }
  }
}

assert.strictEqual(p6Total, 40, 'Expected 40 ETS 2026 Part 6 groups');
assert.strictEqual(p7Total, 140, 'Expected 140 ETS 2026 Part 7 groups');
assert.strictEqual(p6Available, 9, 'Only the nine verified Part 6 source translations should be visible');
assert.strictEqual(p7Available, 3, 'Only three range-matched Part 7 passages are currently recoverable');
assert.strictEqual(p6Available + p6Hidden, p6Total);
assert.strictEqual(p7Available + p7Hidden, p7Total);

// Non-ETS practice content must retain existing English + optional translation behavior.
const normalPart6 = workstation.getSafePart6Passage({
  test: 'Daily Practice',
  passage: 'This is an ordinary English reading passage.',
  passage_vi: 'Đây là bản dịch.'
});
assert.strictEqual(normalPart6.isEts2026Source, false);
assert.strictEqual(normalPart6.text, 'This is an ordinary English reading passage.');

console.log(JSON.stringify({
  result: 'PASS',
  part6: { total: p6Total, visible: p6Available, hidden: p6Hidden },
  part7: { total: p7Total, visible: p7Available, hidden: p7Hidden },
  note: 'No answer keys, explanation blocks or placeholders were emitted as passage text.'
}, null, 2));
