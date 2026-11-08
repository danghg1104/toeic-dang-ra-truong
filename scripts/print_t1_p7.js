const fs = require('fs');
const t1 = JSON.parse(fs.readFileSync('data/ets2026/test01_full.json', 'utf8'));
t1.reading.part7.forEach((q, idx) => {
    console.log(`${idx + 147}: id=${q.id}, qNum=${q.qNum}, hasPassage=${!!q.passage}`);
});
