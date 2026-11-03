const fs = require('fs');

const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));
for (const f of files) {
    const c = fs.readFileSync('js/' + f, 'utf8');
    if (c.includes('toggleSanhMemberProfileMenu')) {
        console.log(`Found in js/${f}!`);
    }
}

// Also search for profile menu functions
const html = fs.readFileSync('index.html', 'utf8');
const regex = /function\s+([a-zA-Z0-9_]*Profile[a-zA-Z0-9_]*)\s*\(/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log('Profile function in HTML:', m[1]);
}
