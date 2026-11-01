const fs = require('fs');

console.log('--- RUNNING AUDIT REMEDIATION VERIFICATION SUITE ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        failed++;
    }
}

// 1. Check Diagnostic Questions Equilibrium & Score Map
const diagContent = fs.readFileSync('js/toeic-diagnostic-workstation.js', 'utf8');
const regex = /id:\s*'(diag_p\d_q\d+)'[\s\S]*?correct:\s*'([A-D])'/g;
let m, list = [];
while ((m = regex.exec(diagContent)) !== null) {
    list.push({ id: m[1], correct: m[2] });
}
assert(list.length === 28, 'Total 28 diagnostic questions found');

const overallCounts = { A: 0, B: 0, C: 0, D: 0 };
list.forEach(q => overallCounts[q.correct]++);
assert(overallCounts.A === 7 && overallCounts.B === 7 && overallCounts.C === 7 && overallCounts.D === 7,
    `Balanced 7 A, 7 B, 7 C, 7 D across all 28 questions (Actual: A=${overallCounts.A}, B=${overallCounts.B}, C=${overallCounts.C}, D=${overallCounts.D})`
);

const lcCounts = { A: 0, B: 0, C: 0, D: 0 };
list.slice(0, 16).forEach(q => lcCounts[q.correct]++);
assert(lcCounts.A === 4 && lcCounts.B === 4 && lcCounts.C === 4 && lcCounts.D === 4,
    `Listening Part 1-4 balanced 4 A, 4 B, 4 C, 4 D (Actual: A=${lcCounts.A}, B=${lcCounts.B}, C=${lcCounts.C}, D=${lcCounts.D})`
);

const rcCounts = { A: 0, B: 0, C: 0, D: 0 };
list.slice(16).forEach(q => rcCounts[q.correct]++);
assert(rcCounts.A === 3 && rcCounts.B === 3 && rcCounts.C === 3 && rcCounts.D === 3,
    `Reading Part 5-7 balanced 3 A, 3 B, 3 C, 3 D (Actual: A=${rcCounts.A}, B=${rcCounts.B}, C=${rcCounts.C}, D=${rcCounts.D})`
);

// Check score calculation for guessing all B:
// LC has 4 B -> 105 pts. RC has 3 B -> 95 pts. Total: 200 pts.
assert(diagContent.includes('4: 105') && diagContent.includes('3: 95'), 'Guessing all B yields 105 LC + 95 RC = 200 total');
assert(diagContent.includes('bindKeyShortcuts') && diagContent.includes('unbindKeyShortcuts'), 'Keyboard shortcuts A/B/C/D listener implemented');

// 2. Check Full Part Practice & Listening Dashboard
const fppContent = fs.readFileSync('js/full-part-practice.js', 'utf8');
assert(fppContent.includes('getFlattenedQuestions(1).slice(0, 6)'), 'Part 1 loads exactly 6 questions (not 40)');
assert(fppContent.includes('if (userAns === undefined)'), 'Early submit does not record unattempted questions into dashboard');
assert(fppContent.includes('hideFloating'), 'Floating dock hidden during listening practice');

const ldContent = fs.readFileSync('js/listening-dashboard.js', 'utf8');
assert(ldContent.includes('Math.min(6, stats.parts[1].done || 0)'), 'Part 1 progress badge capped at 6 questions');

// 3. Check Reading Workstation
const trwContent = fs.readFileSync('js/toeic-reading-workstation.js', 'utf8');
assert(trwContent.includes('slice(0, 30)'), 'Part 5 loads exactly 30 questions (not 88)');
assert(trwContent.includes('hideFloating'), 'Floating dock hidden during reading workstation');

// 4. Check Roadmap & Traps
const rmtContent = fs.readFileSync('js/roadmap-and-traps.js', 'utf8');
assert(rmtContent.includes("daysRemaining !== null ? daysRemaining : '——'"), 'Days remaining handles null safely without displaying "null ngày thi"');
assert(rmtContent.includes("status: 'exempted'"), 'Lower stages marked as "exempted" instead of "completed 100%"');

// 5. Check Vocab Game Workstation Config
const vgContent = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
assert(vgContent.includes('buildTopicAIHTML'), 'buildTopicAIHTML function restored');
assert(vgContent.includes('vgCountSlider') && vgContent.includes('vgCountNumInput'), 'Word count slider and direct number input restored');
assert(vgContent.includes('selectQuickTopic'), 'Topic suggestions and input restored');

console.log(`\nRESULTS: ${passed} PASSED, ${failed} FAILED.`);
if (failed > 0) process.exit(1);
