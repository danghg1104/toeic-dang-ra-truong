const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /function\s+toggleStudyFont[^{]*\{[^}]*\}/;
const match = html.match(regex);
if (match) {
    console.log(match[0]);
} else {
    // search for toggleStudyFont
    let idx = 0;
    while ((idx = html.indexOf('toggleStudyFont', idx)) !== -1) {
        console.log('Found at', idx);
        console.log(html.substring(Math.max(0, idx - 50), Math.min(html.length, idx + 350)));
        idx += 15;
    }
}
