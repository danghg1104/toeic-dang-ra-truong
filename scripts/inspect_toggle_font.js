const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('html.font-ets body');
if (startIdx !== -1) {
    console.log(html.substring(startIdx - 100, startIdx + 2000));
} else {
    const idx2 = html.indexOf('toggleStudyFont');
    console.log(html.substring(idx2 - 300, idx2 + 1000));
}
