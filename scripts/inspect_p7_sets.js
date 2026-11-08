const fs = require('fs');
const t1 = JSON.parse(fs.readFileSync('data/ets2026/test01_full.json', 'utf8'));

const p7 = t1.reading.part7;
console.log('Test 1 Part 7 questions:', p7.length);

// Group by set / consecutive questions
const groups = [];
let curr = [p7[0]];
for (let i = 1; i < p7.length; i++) {
    const prev = p7[i - 1];
    const q = p7[i];
    // In TOEIC, Part 7 ranges are:
    // 147-148 (2), 149-150 (2), 151-152 (2), 153-155 (3), 156-158 (3), 159-160 (2), 161-163 (3), 164-167 (4), 168-171 (4), 172-175 (4), 176-180 (5), 181-185 (5), 186-190 (5), 191-195 (5), 196-200 (5)
}
console.log('Q147 topic:', p7[0].topic, 'q:', p7[0].q);
console.log('Q148 topic:', p7[1].topic, 'q:', p7[1].q);
console.log('Q149 topic:', p7[2].topic, 'q:', p7[2].q);
