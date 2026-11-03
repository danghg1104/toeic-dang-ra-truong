const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let p = 0;
while ((p = html.indexOf('handleHeaderLogout', p)) !== -1) {
    console.log('handleHeaderLogout at', p);
    console.log(html.slice(p - 30, p + 300));
    p += 20;
}

// Also check logout functions in index.html
const regex = /function\s+([a-zA-Z0-9_]*logout[a-zA-Z0-9_]*|[a-zA-Z0-9_]*Logout[a-zA-Z0-9_]*)\s*\(/gi;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log('Logout function in HTML:', m[1]);
}
