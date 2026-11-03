const fs = require('fs');
const serverJs = fs.readFileSync('server.js', 'utf8');
const lines = serverJs.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('staticAssetCache') || lines[i].includes('PUBLIC_DIR') || lines[i].includes('index.html')) {
        console.log(`Line ${i}:`, lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 10)).join('\n'));
        i += 10;
    }
}
