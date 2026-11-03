const fs = require('fs');
const server = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');

const lines = server.split('\n');
for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.match(/^\s{4}[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{/)) {
        console.log(`Line ${i+1}: ${l.trim()}`);
    }
}
