const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pIdx = html.indexOf('id="pomodoroHudModal"');
console.log('--- pomodoroHudModal in index.html ---');
console.log(html.substring(pIdx, pIdx + 3000));
