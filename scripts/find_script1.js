const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf("ui:sidebar_manual_v2");
console.log('ui:sidebar_manual_v2 at line:', html.substring(0, idx).split('\n').length);
console.log('Surrounding code:');
console.log(html.substring(idx - 100, idx + 800));
