const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('overflow-y-auto">\n        <div class="relative w-full max-w-md bg-white');
console.log(html.slice(s - 300, s + 50));
