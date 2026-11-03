const fs = require('fs');

const orig = fs.readFileSync('_checkpoint_pre_sidebar_toggle/index.html', 'utf8');
const s = orig.indexOf('id="sanhMemberDropdownWrapper"');
console.log(orig.slice(s, s + 1000));
