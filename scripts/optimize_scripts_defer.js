const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const targets = [
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>',
  '<script src="js/pdfmake.min.js"></script>',
  '<script src="js/vfs_fonts.js"></script>',
  '<script src="js/html-to-pdfmake.min.js"></script>'
];

targets.forEach(t => {
  const deferred = t.replace('></script>', ' defer></script>');
  if (html.includes(t)) {
    html = html.replace(t, deferred);
    console.log('Added defer to:', t);
  }
});

fs.writeFileSync(filePath, html, 'utf8');
console.log('Script defer optimization complete!');
