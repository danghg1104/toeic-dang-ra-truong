const fs = require('fs');
if (fs.existsSync('_checkpoint_pre_sidebar_toggle/index.html')) {
  const orig = fs.readFileSync('_checkpoint_pre_sidebar_toggle/index.html', 'utf8');
  let idx = 0;
  while ((idx = orig.indexOf('function toggleMemberProfileDropdown', idx + 1)) !== -1) {
    console.log(orig.slice(idx, idx + 500));
  }
}
