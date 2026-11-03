const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

const s = bundle.indexOf('window.toggleMemberProfileDropdown');
console.log('window.toggleMemberProfileDropdown:', s);

const s2 = bundle.indexOf('window.openAccountProfileView');
console.log('window.openAccountProfileView:', s2);
