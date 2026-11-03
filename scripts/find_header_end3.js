const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const headerStart = indexHtml.indexOf('<div id="sanhTopHeaderBar"');
console.log(indexHtml.slice(headerStart + 8000, headerStart + 11000));
