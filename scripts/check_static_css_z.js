const fs = require('fs');
const css = fs.readFileSync('css/tailwind.static.css', 'utf8');
console.log('Does tailwind.static.css have z-[10000]?', css.includes('z-[10000]'));
console.log('Does tailwind.static.css have z-10000?', css.includes('10000'));
