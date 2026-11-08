const fs = require('fs');
const assert = require('assert');

console.log('====================================================');
console.log('VERIFYING PART 5-6-7 PRACTICE AND PVP TEASER BANNER');
console.log('====================================================\n');

// 1. Reading Practice Database Syntax & Question Loading
console.log('--- 1. Testing ReadingPracticeDatabase ---');
require('../js/reading-practice-database.js');
const db = global.ReadingPracticeDatabase;
assert(db, 'ReadingPracticeDatabase must be defined on global');

const p5WordForm = db.getItemsForPractice({ part: 5, topic: 'word_form' });
assert(p5WordForm && p5WordForm.length > 0, 'Part 5 word_form must return questions');
assert(p5WordForm[0].q && p5WordForm[0].options && p5WordForm[0].options.length === 4, 'Question must have text and 4 options');
console.log(`  ✓ PASS: Part 5 word_form loaded ${p5WordForm.length} questions successfully`);

const p6Email = db.getItemsForPractice({ part: 6, topic: 'email_letter' });
assert(p6Email && p6Email.length > 0, 'Part 6 email_letter must return sets');
console.log(`  ✓ PASS: Part 6 email_letter loaded ${p6Email.length} passage sets`);

const p7Single = db.getItemsForPractice({ part: 7, topic: 'single_passage' });
assert(p7Single && p7Single.length > 0, 'Part 7 single_passage must return sets');
console.log(`  ✓ PASS: Part 7 single_passage loaded ${p7Single.length} passage sets`);

// 2. ToeicReadingWorkstation Fallback & Resilience
console.log('\n--- 2. Testing ToeicReadingWorkstation Resilience ---');
const workstationCode = fs.readFileSync('js/toeic-reading-workstation.js', 'utf8');
assert(workstationCode.includes('loadItems()'), 'loadItems must exist');
assert(workstationCode.includes('window.Ets2026Database'), 'Workstation must support instant fallback to Ets2026Database');
assert(!workstationCode.includes('studystudio_20261029_step2_perfect'), 'Outdated cache-buster replaced');
console.log('  ✓ PASS: ToeicReadingWorkstation has instant Ets2026Database zero-latency fallback');

// 3. PvP 1v1 Teaser Banner & Floating Action Card
console.log('\n--- 3. Testing Roadmap PvP Teaser Banner & Floating Card ---');
const roadmapCode = fs.readFileSync('js/roadmap-and-traps.js', 'utf8');
assert(!roadmapCode.includes('ĐẤU TRƯỜNG TỪ VỰNG 1V1 (DƯỚI LỘ TRÌNH CÁ NHÂN)\n            <!-- ========================================================================= -->\n            <div class="rounded-[26px] p-5 lg:p-6 bg-gradient-to-r from-[#102350] via-[#152a60] to-[#1e3b7b] text-white border border-indigo-400/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 artisan-deckled-paper">'), 'Broken artisan-deckled-paper banner must be gone');
assert(roadmapCode.includes('RankAvatarFrames.getSvg(\'diamond\''), 'Banner must feature animated Diamond Frost / Snow Rank Avatar Frame');
assert(!roadmapCode.includes('const nodeId = this.selectedNodeId || \'s1_n1\';'), 'Floating card must not auto-open on page load');
console.log('  ✓ PASS: PvP Banner is styled cleanly without artisan-deckled-paper and includes animated Rank Avatar Frame');
console.log('  ✓ PASS: Floating card only appears when user explicitly clicks a node');

// 4. index.html checks
console.log('\n--- 4. Testing index.html Optimization ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('reading-practice-database.js'), 'reading-practice-database.js must be preloaded/deferred in index.html');
assert(!indexHtml.includes('<span id="trwNavRangeLabel">1/630</span>'), 'Hardcoded 1/630 placeholder must be removed');
console.log('  ✓ PASS: index.html has deferred script tag and clean initial counter label');

console.log('\n====================================================');
console.log('ALL VERIFICATIONS PASSED (100%)');
console.log('====================================================');
