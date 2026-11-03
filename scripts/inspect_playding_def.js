const fs = require('fs');
const content = fs.readFileSync('js/web-audio-micro-engine.js', 'utf8');
const pos = content.indexOf('playDing() {');
console.log(content.slice(pos, pos + 1000));
