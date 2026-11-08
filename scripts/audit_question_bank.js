const fs = require('fs');
const path = require('path');

let grandTotalWrongCount = 0;
let grandTotalWrongLabel = 0;

for (let t = 1; t <= 10; t++) {
    const fn = path.join(__dirname, '..', 'data', 'ets2026', `test${String(t).padStart(2,'0')}_full.json`);
    if (!fs.existsSync(fn)) { console.log('Missing:', fn); continue; }
    const data = JSON.parse(fs.readFileSync(fn, 'utf8'));
    
    // Gather all questions
    const allQs = [];
    if (data.listening) {
        if (data.listening.part1) allQs.push(...data.listening.part1);
        if (data.listening.part2) allQs.push(...data.listening.part2);
        if (data.listening.part3) {
            data.listening.part3.forEach(s => {
                if (s.questions) allQs.push(...s.questions);
                else allQs.push(s);
            });
        }
        if (data.listening.part4) {
            data.listening.part4.forEach(s => {
                if (s.questions) allQs.push(...s.questions);
                else allQs.push(s);
            });
        }
    }
    if (data.reading) {
        if (data.reading.part5) allQs.push(...data.reading.part5);
        if (data.reading.part6) {
            data.reading.part6.forEach(s => {
                if (s.questions) allQs.push(...s.questions);
                else allQs.push(s);
            });
        }
        if (data.reading.part7) {
            data.reading.part7.forEach(s => {
                if (s.questions) allQs.push(...s.questions);
                else allQs.push(s);
            });
        }
    }
    
    let wrongOptCount = 0;
    let wrongLabel = 0;
    const samples = [];

    allQs.forEach(q => {
        const expectedCount = q.part === 2 ? 3 : 4;
        const opts = q.options || [];
        const isWrongCount = opts.length !== expectedCount;
        if (isWrongCount) {
            wrongOptCount++;
        }
        const letters = ['A', 'B', 'C', 'D'];
        let hasMismatch = false;
        opts.forEach((opt, idx) => {
            const exp = letters[idx];
            const trimmed = (opt || '').trim();
            const m = trimmed.match(/^([A-D])[\.\)]/i);
            if (m && m[1].toUpperCase() !== exp) {
                hasMismatch = true;
            }
        });
        if (hasMismatch) wrongLabel++;

        if ((isWrongCount || hasMismatch) && samples.length < 3) {
            samples.push({ qNum: q.qNum, part: q.part, optsLength: opts.length, options: opts, ans: q.ans, ansLetter: q.ansLetter });
        }
    });
    grandTotalWrongCount += wrongOptCount;
    grandTotalWrongLabel += wrongLabel;
    console.log(`Test ${t}: Total ${allQs.length} questions | Wrong count: ${wrongOptCount} | Wrong label: ${wrongLabel}`);
    if (samples.length > 0) {
        console.log(`   Sample for Test ${t}:`, JSON.stringify(samples[0]));
    }
}
console.log(`\nGRAND TOTAL -> Wrong Count: ${grandTotalWrongCount} | Wrong Label: ${grandTotalWrongLabel}`);
