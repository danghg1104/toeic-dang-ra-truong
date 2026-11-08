const fs = require('fs');
const rdb = fs.readFileSync('js/reading-practice-database.js', 'utf8');

const regex = /"setId":\s*"([^"]+)"[\s\S]*?"passageContent":\s*"([^"]*Đáp án:[^"]*)"/g;
let m;
const setsWithLeaks = [];
while ((m = regex.exec(rdb)) !== null) {
    setsWithLeaks.push({ id: m[1], snippet: m[2].slice(0, 80) });
}
console.log('Sets with leaked answer in passageContent:', setsWithLeaks.length);
console.log('Sample set IDs:', setsWithLeaks.slice(0, 10).map(s => s.id));
