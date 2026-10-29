const fs = require('fs');
const content = fs.readFileSync('js/roadmap-and-traps.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(685, 735).join('\n'));
