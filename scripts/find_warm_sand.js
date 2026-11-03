const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let idx = 0;
while ((idx = html.indexOf('Warm Sand', idx)) !== -1) {
    console.log('Found "Warm Sand" at', idx);
    console.log(html.substring(Math.max(0, idx - 200), Math.min(html.length, idx + 400)));
    idx += 9;
}
