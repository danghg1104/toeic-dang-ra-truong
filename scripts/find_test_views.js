const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find where test view is shown / hidden
console.log('Finding test view containers:');
const matches = [];
const regex = /id="(view-[^"]+|diagnostic[^"]+|fullTest[^"]+|exam[^"]+)"/g;
let m;
while ((m = regex.exec(html)) !== null) {
    matches.push(m[1]);
}
console.log('Found views/elements:', matches);

// Let's search where sanhTopHeaderBar is used in JS
const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));
for (const file of files) {
    const content = fs.readFileSync('js/' + file, 'utf8');
    if (content.includes('sanhTopHeaderBar')) {
        console.log(`js/${file} mentions sanhTopHeaderBar`);
    }
}
