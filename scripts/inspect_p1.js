const fs = require('fs');
const content = fs.readFileSync('js/listening-data-v2.js', 'utf8');
const p1Match = content.match(/"part1":\s*\[([\s\S]*?)\n\s*\]/);
if (!p1Match) {
    console.log('part1 not found');
    process.exit(1);
}
const part1List = JSON.parse('[' + p1Match[1] + ']');
console.log(`Found ${part1List.length} questions in part1:`);
for (let i = 0; i < 6; i++) {
    const q = part1List[i];
    console.log(`Q${i+1} (${q.id}):`);
    console.log(`  Topic: ${q.topic} - ${q.subtopic}`);
    console.log(`  Image: ${q.image}`);
    console.log(`  Script: ${q.audioScript}`);
    console.log(`  Correct: ${q.ansLetter}`);
}
