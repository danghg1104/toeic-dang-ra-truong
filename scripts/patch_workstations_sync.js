const fs = require('fs');

console.log('--- PATCHING WORKSTATIONS TO ADD in-workstation-mode ---');

// 1. js/toeic-listening-workstation.js
let tlw = fs.readFileSync('js/toeic-listening-workstation.js', 'utf8');
tlw = tlw.replace(
    "document.body.classList.add('overflow-hidden');",
    "document.body.classList.add('overflow-hidden', 'in-workstation-mode');"
);
tlw = tlw.replace(
    "document.body.classList.remove('overflow-hidden');",
    "document.body.classList.remove('overflow-hidden', 'in-workstation-mode');"
);
fs.writeFileSync('js/toeic-listening-workstation.js', tlw, 'utf8');
fs.writeFileSync('www/js/toeic-listening-workstation.js', tlw, 'utf8');
console.log('Updated js/toeic-listening-workstation.js and synced to www');

// 2. js/toeic-reading-workstation.js
let trw = fs.readFileSync('js/toeic-reading-workstation.js', 'utf8');
trw = trw.replace(
    "document.body.style.overflow = 'hidden';",
    "document.body.style.overflow = 'hidden'; document.body.classList.add('in-workstation-mode');"
);
trw = trw.replace(
    "document.body.style.overflow = '';",
    "document.body.style.overflow = ''; document.body.classList.remove('in-workstation-mode');"
);
fs.writeFileSync('js/toeic-reading-workstation.js', trw, 'utf8');
fs.writeFileSync('www/js/toeic-reading-workstation.js', trw, 'utf8');
console.log('Updated js/toeic-reading-workstation.js and synced to www');

// 3. js/full-part-practice.js
let fpp = fs.readFileSync('js/full-part-practice.js', 'utf8');
fpp = fpp.replace(
    "modal.className = 'fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-3 overflow-hidden';",
    "modal.className = 'fixed inset-0 z-[10000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-3 overflow-hidden workstation-fullscreen-modal'; document.body.classList.add('in-workstation-mode');"
);
fpp = fpp.replace(
    "if (modal) modal.style.display = 'none';",
    "if (modal) modal.style.display = 'none'; document.body.classList.remove('in-workstation-mode');"
);
fs.writeFileSync('js/full-part-practice.js', fpp, 'utf8');
fs.writeFileSync('www/js/full-part-practice.js', fpp, 'utf8');
console.log('Updated js/full-part-practice.js and synced to www');

// 4. Verify diagnostic workstation sync
const tdw = fs.readFileSync('js/toeic-diagnostic-workstation.js', 'utf8');
fs.writeFileSync('www/js/toeic-diagnostic-workstation.js', tdw, 'utf8');
console.log('Re-synced js/toeic-diagnostic-workstation.js to www');

// 5. Verify index.html sync
const idx = fs.readFileSync('index.html', 'utf8');
fs.writeFileSync('www/index.html', idx, 'utf8');
console.log('Re-synced index.html to www');

console.log('ALL WORKSTATIONS PATCHED AND SYNCED SUCCESSFULLY!');
