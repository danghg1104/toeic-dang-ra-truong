const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];
let okCount = 0;
scripts.forEach((s, idx) => {
  if (s.includes('src=') || s.includes('type="module"')) return;
  const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
  try {
    new Function(code);
    okCount++;
    console.log(`Script tag ${idx}: OK`);
  } catch(e) {
    console.error(`Script tag ${idx} ERROR:`, e.message);
  }
});
console.log(`Successfully verified ${okCount} inline scripts in index.html!`);
