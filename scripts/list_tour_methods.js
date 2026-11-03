const fs = require('fs');
const content = fs.readFileSync('js/app-tour-guide.js', 'utf8');
const methods = content.match(/_?[a-zA-Z0-9]+\([^)]*\)\s*\{/g);
console.log(methods);
