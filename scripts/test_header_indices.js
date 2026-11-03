const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Check header position
const headerStart = indexHtml.indexOf('<div id="sanhTopHeaderBar"');
const headerEnd = indexHtml.indexOf('<!-- MAIN DASHBOARD CONTENT GRID', headerStart);

console.log('Header found:', headerStart !== -1, 'End found:', headerEnd !== -1);
