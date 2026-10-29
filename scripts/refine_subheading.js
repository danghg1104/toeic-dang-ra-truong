const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(
  '<p class="text-xs text-slate-500 dark:text-slate-400">Tỷ lệ chính xác & Đánh giá năng lực theo chuẩn ETS</p>',
  '<p class="text-xs text-slate-500 dark:text-slate-400">Tỷ lệ chính xác bài tập đã giải & Đánh giá năng lực ETS</p>'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Đã cập nhật phụ đề Cân bằng 4 kỹ năng minh bạch 100%!');
