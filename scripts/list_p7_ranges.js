const fs = require('fs');
const rdb = fs.readFileSync('js/reading-practice-database.js', 'utf8');

const regex = /"setId":\s*"([^"]*_p7_[^"]*)"[\s\S]*?"qRange":\s*"([^"]*)"/g;
let m;
const setsByTest = {};
while ((m = regex.exec(rdb)) !== null) {
    const id = m[1];
    const qRange = m[2];
    const testMatch = id.match(/_t(\d+)_/);
    const t = testMatch ? testMatch[1] : 'unknown';
    if (!setsByTest[t]) setsByTest[t] = [];
    setsByTest[t].push({ id, qRange });
}

console.log('Test 1 sets:');
console.log(setsByTest['1']);
