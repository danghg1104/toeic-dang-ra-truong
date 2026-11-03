const fs = require('fs');
const client = fs.readFileSync('js/pvp-arena-client.js', 'utf8');

const lines = client.split('\n');
for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.match(/^\s{4,8}[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{/)) {
        console.log(`Line ${i+1}: ${l.trim()}`);
    }
}
