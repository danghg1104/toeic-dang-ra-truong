const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

console.log('openAccountProfileView in bundle:', bundle.includes('openAccountProfileView'));
console.log('openAccountSettingsView in bundle:', bundle.includes('openAccountSettingsView'));
console.log('handleLogoutUser in bundle:', bundle.includes('handleLogoutUser'));
console.log('toggleMemberProfileDropdown in bundle:', bundle.includes('toggleMemberProfileDropdown'));
