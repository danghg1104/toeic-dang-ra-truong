const fs = require('fs');
const path = require('path');

const base = 'C:/Users/Admin/AppData/Local/CocCoc/Browser/User Data/Default/Web Shortcut Icons';
if (fs.existsSync(base)) {
  console.log('BASE EXISTS:', base);
  fs.readdirSync(base).forEach(dir => {
    const full = path.join(base, dir);
    if (fs.statSync(full).isDirectory()) {
      fs.readdirSync(full).forEach(f => {
        const filePath = path.join(full, f);
        console.log(dir, f, fs.statSync(filePath).size, 'bytes', fs.statSync(filePath).mtime);
      });
    }
  });
} else {
  console.log('BASE NOT FOUND');
}
