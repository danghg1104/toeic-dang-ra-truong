const fs = require('fs');

const fn = 'data/ets2026/test01_full.json';
const data = JSON.parse(fs.readFileSync(fn, 'utf8'));

const q161 = data.reading.part7.find(q => q.qNum === 161);
const q162 = data.reading.part7.find(q => q.qNum === 162);
const q163 = data.reading.part7.find(q => q.qNum === 163);

if (q161 && q162 && q163) {
    q162.passage = q161.passage;
    q162.passage_vi = q161.passage_vi;
    q163.passage = q161.passage;
    q163.passage_vi = q161.passage_vi;
    fs.writeFileSync(fn, JSON.stringify(data, null, 2), 'utf8');
    console.log('✓ Fixed Q162 and Q163 in Test 1!');
}
