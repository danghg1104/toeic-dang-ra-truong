const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Lines 5525-5545 ---');
console.log(lines.slice(5524, 5545).join('\n'));

console.log('\n--- Lines 5755-5775 ---');
console.log(lines.slice(5754, 5775).join('\n'));
