const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

function findSection(id) {
  const lines = content.split('\n');
  const start = lines.findIndex(l => l.includes(`id="${id}"`));
  if (start === -1) return `Section ${id} NOT FOUND`;
  return lines.slice(start, start + 30).join('\n');
}

console.log('=== GRAMMAR PRACTICE ===\n', findSection('view-grammar-practice'));
console.log('=== GRAMMAR THEORY ===\n', findSection('view-grammar-theory'));
console.log('=== VOCAB STUDY ===\n', findSection('view-vocabulary-study'));
console.log('=== VOCAB MATCH ===\n', findSection('view-vocabulary-match'));
