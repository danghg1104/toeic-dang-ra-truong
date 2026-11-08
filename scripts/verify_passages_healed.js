const fs = require('fs');

const t1 = JSON.parse(fs.readFileSync('data/ets2026/test01_full.json', 'utf8'));
const q147 = t1.reading.part7.find(q => q.id === 147 || q.qNum === 147);
const q131 = t1.reading.part6[0].questions.find(q => q.id === 131 || q.qNum === 131);

console.log('Q147 has passage:', !!q147?.passage, 'length:', q147?.passage?.length);
console.log('Q147 passage preview:', q147?.passage?.slice(0, 150).replace(/\n/g, ' '));
console.log('Q131 has passage:', !!q131?.passage, 'length:', q131?.passage?.length);

const rdb = fs.readFileSync('js/reading-practice-database.js', 'utf8');
const leakRegex = /"passageContent":\s*"[^"]*Đáp án:\s*\([A-D]\)/g;
const leaks = rdb.match(leakRegex) || [];
console.log('Leaked answer count in reading-practice-database.js:', leaks.length);

// Check all 10 tests for Part 7 passage presence
let missingPassages = 0;
for (let t = 1; t <= 10; t++) {
    const fn = `data/ets2026/test${String(t).padStart(2, '0')}_full.json`;
    const data = JSON.parse(fs.readFileSync(fn, 'utf8'));
    const p7 = data.reading?.part7 || [];
    const withoutPassage = p7.filter(q => !q.passage);
    if (withoutPassage.length > 0) {
        console.log(`Test ${t}: ${withoutPassage.length} Part 7 questions missing passage`);
        missingPassages += withoutPassage.length;
    }
}
console.log('Total Part 7 questions across all 10 tests without passage:', missingPassages, '/ 540');
