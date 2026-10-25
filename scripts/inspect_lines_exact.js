const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

for (let i = 5525; i <= 5545; i++) {
    console.log(`${i}: ${JSON.stringify(lines[i-1])}`);
}
