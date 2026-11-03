const fs = require('fs');

if (fs.existsSync('_checkpoint_pre_ui_revamp/index.html')) {
    const orig = fs.readFileSync('_checkpoint_pre_ui_revamp/index.html', 'utf8');
    const s = orig.indexOf('sanhMemberAccountName');
    console.log('In pre_ui_revamp:');
    console.log(orig.slice(Math.max(0, s - 300), Math.min(orig.length, s + 500)));
}
