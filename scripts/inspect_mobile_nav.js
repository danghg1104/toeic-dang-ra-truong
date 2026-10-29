const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('mobileBottomNav') || l.includes('id="mobile-nav"') || l.includes('bottom-0') && l.includes('fixed') && l.includes('lg:hidden'));
console.log('Mobile bottom nav around line:', idx + 1);
if (idx !== -1) {
  console.log(lines.slice(idx - 5, idx + 80).join('\n'));
} else {
  // search for lg:hidden fixed bottom
  lines.forEach((l, i) => {
    if (l.includes('fixed bottom-0') || l.includes('fixed bottom')) {
      console.log('Match at ' + (i+1) + ': ' + l.trim());
    }
  });
}
