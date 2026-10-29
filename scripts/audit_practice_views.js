const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

function findSection(id) {
  const lines = content.split('\n');
  const start = lines.findIndex(l => l.includes(`id="${id}"`));
  if (start === -1) return `Section ${id} NOT FOUND`;
  return lines.slice(start, start + 40).join('\n');
}

console.log('=== VIEW NGU-PHAP ===\n', findSection('view-ngu-phap'));
console.log('=== VIEW DOC ===\n', findSection('view-doc'));
console.log('=== VIEW NGHE ===\n', findSection('view-nghe'));
console.log('=== VIEW TU-VUNG ===\n', findSection('view-tu-vung'));
