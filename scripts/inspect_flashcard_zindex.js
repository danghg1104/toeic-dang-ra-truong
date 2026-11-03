const fs = require('fs');

console.log('=== Checking Flashcard Modal z-index ===');
const html = fs.readFileSync('index.html', 'utf8');

let p = 0;
while ((p = html.indexOf('Flashcard 3D', p)) !== -1) {
    console.log('Flashcard 3D in HTML at', p);
    console.log(html.slice(Math.max(0, p - 100), Math.min(html.length, p + 300)));
    p += 15;
}

const jsFiles = fs.readdirSync('js').filter(f => f.includes('tinder') || f.includes('flashcard'));
for (const f of jsFiles) {
    console.log('Checking js/' + f);
    const c = fs.readFileSync('js/' + f, 'utf8');
    const zMatch = c.match(/z-\[?[0-9]+\]?|z-index:\s*[0-9]+/g);
    console.log(f, 'z-indices:', zMatch);
}
