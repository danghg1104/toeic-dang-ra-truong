const fs = require('fs');
const t1 = JSON.parse(fs.readFileSync('data/ets2026/test01_full.json', 'utf8'));
const q162 = t1.reading.part7.find(q => q.id === 162 || q.qNum === 162 || q.id === 'ets26_t1_p7_q162');
const q163 = t1.reading.part7.find(q => q.id === 163 || q.qNum === 163 || q.id === 'ets26_t1_p7_q163');
console.log('Q162:', q162 ? { id: q162.id, qNum: q162.qNum, hasPassage: !!q162.passage } : 'not found');
console.log('Q163:', q163 ? { id: q163.id, qNum: q163.qNum, hasPassage: !!q163.passage } : 'not found');
const q164 = t1.reading.part7.find(q => q.id === 164 || q.qNum === 164 || q.id === 'ets26_t1_p7_q164');
console.log('Q164:', q164 ? { id: q164.id, qNum: q164.qNum, hasPassage: !!q164.passage } : 'not found');
