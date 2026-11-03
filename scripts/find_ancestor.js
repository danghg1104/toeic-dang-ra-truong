const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
let modalLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="toeicRadarAnalyticsModal"')) {
    modalLine = i;
    break;
  }
}
console.log('toeicRadarAnalyticsModal is at line:', modalLine + 1);

// Traverse up to see which <section> or <main> it is inside
for (let i = modalLine; i >= 0; i--) {
  const line = lines[i];
  if (line.includes('<section') || line.includes('</main>') || line.includes('<main') || line.includes('id="view-')) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
    if (line.includes('<main') || line.includes('</main>')) break;
  }
}
