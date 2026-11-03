const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('window.openAccountSettingsView');
console.log(content.slice(pos, pos + 1000));
