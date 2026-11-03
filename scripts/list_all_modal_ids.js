const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /id="(toeic[A-Z][a-zA-Z0-9]*Modal|[a-zA-Z0-9]*Modal)"/g;
const ids = new Set();
let m;
while ((m = regex.exec(html)) !== null) {
    ids.add(m[1]);
}
console.log('All Modal IDs in index.html:', Array.from(ids));
