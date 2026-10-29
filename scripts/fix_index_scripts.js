const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Chuyển Tailwind CDN sang local js/vendor/tailwindcss.js
html = html.replace('https://cdn.tailwindcss.com', 'js/vendor/tailwindcss.js');

// 2. Bỏ defer để khôi phục đúng thứ tự thực thi đồng bộ ban đầu
html = html.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js" defer></script>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>');
html = html.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" defer></script>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>');
html = html.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" defer></script>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>');
html = html.replace('<script src="js/pdfmake.min.js" defer></script>', '<script src="js/pdfmake.min.js"></script>');
html = html.replace('<script src="js/vfs_fonts.js" defer></script>', '<script src="js/vfs_fonts.js"></script>');
html = html.replace('<script src="js/html-to-pdfmake.min.js" defer></script>', '<script src="js/html-to-pdfmake.min.js"></script>');

// 3. Thêm quy tắc CSS khẩn cấp cho .hidden để tuyệt đối không bao giờ bị hiện trần trụi các modal/popup ẩn
const criticalRule = '<style id="critical-hidden-precaution">.hidden { display: none !important; }</style>';
if (!html.includes('critical-hidden-precaution')) {
    html = html.replace('</head>', '    ' + criticalRule + '\n</head>');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully fixed index.html scripts and local tailwind!');
