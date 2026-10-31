const fs = require('fs');
const code = fs.readFileSync('step108.js', 'utf8');

console.log('--- FIRST 50 LINES ---');
console.log(code.split('\n').slice(0, 50).join('\n'));

console.log('--- LINES 50 TO 120 ---');
console.log(code.split('\n').slice(50, 120).join('\n'));
