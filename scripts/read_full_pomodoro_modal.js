const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="pomodoroHudModal"');
const eIdx = html.indexOf('<!-- END POMODORO', sIdx) !== -1 
    ? html.indexOf('<!-- END POMODORO', sIdx) 
    : html.indexOf('</section>', sIdx);
console.log(html.substring(sIdx, sIdx + 2000));
