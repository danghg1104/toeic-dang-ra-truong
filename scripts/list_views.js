const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const re = /id=["']view-([a-zA-Z0-9_\-]+)["']/g;
let m;
const ids = new Set();
while ((m = re.exec(html)) !== null) {
  ids.add(m[1]);
}
console.log('All view IDs in index.html:', Array.from(ids));
