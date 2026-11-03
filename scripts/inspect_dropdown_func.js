const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('toggleMemberProfileDropdown');
console.log(content.slice(pos - 100, pos + 1200));
