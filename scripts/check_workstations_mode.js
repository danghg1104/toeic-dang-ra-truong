const fs = require('fs');
const files = [
  'js/toeic-diagnostic-workstation.js',
  'js/toeic-listening-workstation.js',
  'js/toeic-reading-workstation.js',
  'js/full-part-practice.js',
  'js/vocab-game-workstation.js'
];
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  console.log(f, 'includes in-workstation-mode:', c.includes('in-workstation-mode'));
  if (c.includes('in-workstation-mode')) {
    const lines = c.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('in-workstation-mode')) console.log('  line ' + (i+1) + ': ' + line.trim());
    });
  }
});
