const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
    if (l.includes('id="nav-') || l.includes('id=\'nav-')) {
        console.log(idx + 1, l.trim());
    }
});
