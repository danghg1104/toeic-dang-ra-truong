const fs = require('fs');

const orig = fs.readFileSync('_checkpoint_pre_sidebar_toggle/index.html', 'utf8');
const s = orig.indexOf('id="sanhMemberProfileMenu"');
console.log('Location in pre_sidebar_toggle:', s);
if (s !== -1) {
    console.log(orig.slice(s - 50, s + 1500));
}
