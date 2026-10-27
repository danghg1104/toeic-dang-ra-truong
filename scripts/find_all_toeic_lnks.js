const fs = require('fs');
const path = require('path');

function search(dir, depth = 0) {
  if (depth > 6) return;
  try {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of list) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (!['Windows', 'Program Files', 'Program Files (x86)', '$Recycle.Bin', 'node_modules', '.git', 'AppData'].includes(ent.name) || dir.includes('Users')) {
          search(full, depth + 1);
        }
      } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.lnk')) {
        const name = ent.name.toLowerCase();
        if (name.includes('toeic') || name.includes('dang') || name.includes('vstep') || name.includes('cung') || name.includes('cùng') || name.includes('đăng')) {
          console.log('FOUND LNK:', full);
        }
      }
    }
  } catch(e) {}
}

search('C:/Users/Admin');
search('C:/Users/Public');
console.log('Search finished.');
