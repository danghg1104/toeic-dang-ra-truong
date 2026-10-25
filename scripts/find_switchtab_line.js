const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
    if (l.includes('function switchTab')) {
        console.log(`Line ${idx + 1}: ${l}`);
    }
});
