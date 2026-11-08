const fs = require('fs');
const t1 = JSON.parse(fs.readFileSync('data/ets2026/test01_full.json', 'utf8'));
const q164 = t1.reading.part7.find(q => q.id === 'ets26_t1_p7_q164');
console.log('Q164 topic:', q164.topic);
console.log('Q164 passage start:', q164.passage ? q164.passage.slice(0, 300) : 'none');
