const fs = require('fs');
const www = fs.readFileSync('www/index.html', 'utf8');
console.log('www contains stepper?', www.includes('Bộ Điều Chỉnh Thời Gian Tùy Ý'));
