const fs = require('fs');
const code = fs.readFileSync('js/toeic-diagnostic-workstation.js', 'utf8');

const idx = code.indexOf('_createModalDOM');
if (idx !== -1) {
    console.log(code.substring(idx, idx + 1500));
} else {
    // Search for modal creation
    const matches = code.match(/function\s+[a-zA-Z0-9_]+\s*\([^)]*\)|[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{/g);
    console.log('Methods:', matches ? matches.slice(0, 30) : 'none');
}
