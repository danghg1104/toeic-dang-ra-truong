const fs = require('fs');
const pattern = process.argv[2] || '';
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
lines.forEach((l, i) => {
    if (l.toLowerCase().includes(pattern.toLowerCase())) {
        console.log(`${i + 1}: ${l.trim().slice(0, 120)}`);
    }
});
