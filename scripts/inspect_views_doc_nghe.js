const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

function inspectView(id, count = 120) {
  const lines = content.split('\n');
  const start = lines.findIndex(l => l.includes(`id="${id}"`));
  if (start === -1) return `${id} not found`;
  return lines.slice(start, start + count).join('\n');
}

console.log('=== VIEW DOC ===');
console.log(inspectView('view-doc'));
console.log('=== VIEW NGHE ===');
console.log(inspectView('view-nghe'));
