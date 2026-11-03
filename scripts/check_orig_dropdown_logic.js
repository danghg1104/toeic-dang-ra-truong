const fs = require('fs');
if (fs.existsSync('_checkpoint_pre_sidebar_toggle/index.html')) {
  const orig = fs.readFileSync('_checkpoint_pre_sidebar_toggle/index.html', 'utf8');
  const pos = orig.indexOf('toggleMemberProfileDropdown');
  console.log(orig.slice(pos - 100, pos + 1500));
}
