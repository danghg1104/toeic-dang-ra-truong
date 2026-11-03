const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('id="sanhMemberDropdownWrapper"');
console.log('Location:', s);
if (s !== -1) {
    console.log(html.slice(s, s + 1500));
}
