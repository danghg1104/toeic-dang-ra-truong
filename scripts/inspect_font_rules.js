const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('/* ========================================================');
// Find editorial / font css in index.html
const matches = [];
let pos = 0;
while ((pos = html.indexOf('font-ets', pos)) !== -1) {
    matches.push(pos);
    pos += 10;
}
console.log('Matches count:', matches.length);
if (matches.length > 1) {
    const p1 = matches[1]; // first CSS match
    console.log(html.substring(p1 - 200, p1 + 2000));
}
