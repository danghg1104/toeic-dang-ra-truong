const fs = require('fs');
const c = fs.readFileSync('js/full-part-practice.js', 'utf8');
const lines = c.split('\n');
lines.forEach((l, idx) => {
  if (l.match(/^\s*(render|display|show|function|select|load)[a-zA-Z0-9_]*\s*\(|class\s+|const\s+[a-zA-Z0-9_]+\s*=\s*\{/)) {
    console.log((idx+1) + ': ' + l.trim().slice(0, 80));
  }
});
