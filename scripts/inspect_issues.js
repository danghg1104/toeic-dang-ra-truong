const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const headerIdx = html.indexOf('id="sanhTopHeaderBar"');
console.log('--- sanhTopHeaderBar snippet ---');
console.log(html.substring(Math.max(0, headerIdx - 200), headerIdx + 2500));

const fontIdx = html.indexOf('toggleStudyFont');
console.log('--- toggleStudyFont snippet ---');
console.log(html.substring(fontIdx, fontIdx + 1200));

const pomodoroIdx = html.indexOf('id="pomodoroHudModal"');
console.log('--- pomodoroHudModal snippet ---');
console.log(html.substring(pomodoroIdx, pomodoroIdx + 2000));
