const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('title="Tải tóm tắt bài học 1 trang chuẩn in ấn"');
console.log(html.slice(s - 250, s));
