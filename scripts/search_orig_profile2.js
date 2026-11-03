const fs = require('fs');

const orig = fs.readFileSync('_checkpoint_pre_ui_revamp/index.html', 'utf8');
const s = orig.indexOf('Huynh Dang');
console.log('Huynh Dang at', s);
if (s !== -1) {
    console.log(orig.slice(Math.max(0, s - 300), Math.min(orig.length, s + 500)));
} else {
    // search for tai-khoan
    const s2 = orig.indexOf('#tai-khoan');
    console.log('#tai-khoan at', s2);
    if (s2 !== -1) {
        console.log(orig.slice(Math.max(0, s2 - 300), Math.min(orig.length, s2 + 500)));
    }
}
