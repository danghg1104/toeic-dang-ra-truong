const fs = require('fs');
const content = fs.readFileSync('js/grammar-database.js', 'utf8');
const lines = content.split('\n');
const slugs = [];
lines.forEach(l => {
  const m = l.match(/slug:\s*['"]([^'"]+)['"]/);
  if (m) slugs.push(m[1]);
});
console.log('Total slugs found:', slugs.length);
console.log('Sample slugs:', slugs.slice(0, 15));
