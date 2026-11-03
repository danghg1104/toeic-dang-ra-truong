const fs = require('fs');
const www = fs.readFileSync('www/index.html', 'utf8');

const s = www.indexOf('id="toeicCheatSheetModal"');
console.log('In www/index.html:');
console.log(www.slice(s - 50, s + 300));
