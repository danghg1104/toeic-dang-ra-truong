const fs = require('fs');

const s = fs.readFileSync('js/reading-practice-database.js', 'utf8');
const regex = /"setId":\s*"([^"]+)"[\s\S]*?"passage_vi":\s*"([\s\S]*?)"\s*,\s*"questions"/g;
let m;
let count = 0;
while ((m = regex.exec(s)) !== null && count < 8) {
    count++;
    console.log(`Set ${count}: ${m[1]} | len=${m[2].length}`);
    console.log(`  Preview: ${m[2].slice(0, 140).replace(/\n/g, ' ')}`);
}
