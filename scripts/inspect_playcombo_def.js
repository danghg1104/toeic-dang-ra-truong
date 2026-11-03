const fs = require('fs');
const content = fs.readFileSync('js/web-audio-micro-engine.js', 'utf8');
const pos = content.indexOf('playComboCheer(comboCount');
console.log(content.slice(pos, pos + 800));
