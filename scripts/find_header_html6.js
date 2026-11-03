const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('id=\x22sanhMemberDropdownWrapper\x22');
console.log(content.slice(pos, pos + 2500));
