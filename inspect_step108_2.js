const fs = require('fs');
const code = fs.readFileSync('step108.js', 'utf8');
const lines = code.split('\n');

console.log('--- LINES 120 TO 200 ---');
console.log(lines.slice(120, 200).join('\n'));

console.log('--- LINES 200 TO 300 ---');
console.log(lines.slice(200, 300).join('\n'));

console.log('--- LAST 80 LINES ---');
console.log(lines.slice(-80).join('\n'));
