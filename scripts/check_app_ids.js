const fs = require('fs');
const path = require('path');

const base = 'C:/Users/Admin/AppData/Local/Google/Chrome/User Data/Default/Web Applications/Manifest Resources';
fs.readdirSync(base).forEach(dir => {
  const p192 = path.join(base, dir, 'Icons', '192.png');
  if (fs.existsSync(p192)) {
    const buf = fs.readFileSync(p192);
    console.log(dir, 'size:', buf.length, 'mtime:', fs.statSync(p192).mtime);
  }
});
