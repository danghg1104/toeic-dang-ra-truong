const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

const s = bundle.indexOf('window.toggleMemberProfileDropdown');
console.log('window.toggleMemberProfileDropdown:', s);

// Search for exports at the bottom of the bundle
console.log('Bundle end:');
console.log(bundle.slice(bundle.length - 1000));
