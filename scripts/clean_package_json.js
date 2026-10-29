const fs = require('fs');
let pkgStr = fs.readFileSync('package.json', 'utf8');
pkgStr = pkgStr.replace(/'icon-totoro-192\.png','icon-totoro-512\.png','icon-totoro-maskable-512\.png',/g, '');
fs.writeFileSync('package.json', pkgStr, 'utf8');
console.log('✅ Đã dọn sạch icon-totoro khỏi package.json');
