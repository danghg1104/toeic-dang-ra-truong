const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="sanhTopHeaderBar"');
const eIdx = html.indexOf('</section>', sIdx);
console.log(html.substring(sIdx, eIdx));
