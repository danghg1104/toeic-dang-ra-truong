const fs = require('fs');

const server = fs.readFileSync('server.js', 'utf8');
const lines = server.split('\n');

console.log('--- Lines 2940 to 3020 of server.js ---');
console.log(lines.slice(2939, 3020).join('\n'));
