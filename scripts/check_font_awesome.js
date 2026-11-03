const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
let idx = 0;
while ((idx = html.indexOf('font-awesome', idx)) !== -1) {
    console.log(html.substring(Math.max(0, idx - 50), Math.min(html.length, idx + 200)));
    idx += 12;
}
while ((idx = html.indexOf('fontawesome', idx)) !== -1) {
    console.log(html.substring(Math.max(0, idx - 50), Math.min(html.length, idx + 200)));
    idx += 12;
}
