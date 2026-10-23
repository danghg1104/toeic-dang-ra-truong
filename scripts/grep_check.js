const fs = require('fs');
const path = require('path');

const targets = [
  'Chọn tài khoản',
  'tienganhratruong.com',
  'doncry152',
  'danghg20008',
  'neveralonevp',
  'dang.hg.68khhh',
  'Sử dụng một tài khoản khác',
  'Vào học'
];

function searchDir(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (['.git', 'node_modules', '.gradle', 'data_backup_pre_auth'].includes(file) || file === 'grep_check.js') continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(searchDir(fullPath));
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath).toLowerCase();
        const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.jar', '.aar', '.so', '.dll', '.exe', '.traineddata'];
        if (!binaryExts.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split(/\r?\n/);
            lines.forEach((line, idx) => {
              for (const target of targets) {
                if (line.includes(target)) {
                  results.push({
                    file: path.relative(process.cwd(), fullPath).replace(/\\/g, '/'),
                    lineNum: idx + 1,
                    target: target,
                    line: line.trim()
                  });
                }
              }
            });
          } catch (e) {}
        }
      }
    }
  } catch (e) {}
  return results;
}

const found = searchDir('.');
console.log('--- KẾT QUẢ TÌM KIẾM TOÀN REPO ---');
found.forEach(r => {
  console.log(r.file + ':' + r.lineNum + ': [' + r.target + '] ' + r.line.substring(0, 140));
});
console.log('Tổng số kết quả tìm thấy:', found.length);
