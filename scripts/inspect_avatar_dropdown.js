const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('sanhMemberDropdownWrapper');
console.log('--- sanhMemberDropdownWrapper snippet ---');
console.log(html.slice(s - 100, s + 1500));

const sFunc = html.indexOf('toggleSanhMemberProfileMenu');
console.log('--- toggleSanhMemberProfileMenu snippet ---');
console.log(html.slice(sFunc - 50, sFunc + 1000));
