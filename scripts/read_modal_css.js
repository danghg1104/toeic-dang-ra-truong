const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('Workstations, Test & Practice Modals: Phải luôn có z-index tối thượng');
console.log(html.slice(s - 50, s + 1000));
