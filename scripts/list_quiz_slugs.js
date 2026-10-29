const fs = require('fs');
const content = fs.readFileSync('js/grammar-quiz-data.js', 'utf8');
const lines = content.split('\n');

const slugs = [];
lines.forEach(l => {
  const m = l.match(/['"]([a-zA-Z0-9_\-]+)['"]\s*:\s*\{/);
  if (m) slugs.push(m[1]);
});
console.log('Quiz data keys:', slugs.slice(0, 20));
