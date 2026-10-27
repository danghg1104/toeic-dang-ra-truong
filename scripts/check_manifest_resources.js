const fs = require('fs');
const path = require('path');

const base = 'C:/Users/Admin/AppData/Local/Google/Chrome/User Data/Default/Web Applications/Manifest Resources';
fs.readdirSync(base).forEach(dir => {
  const full = path.join(base, dir);
  if (fs.statSync(full).isDirectory()) {
    console.log('--- DIR:', dir);
    function walk(d) {
      fs.readdirSync(d).forEach(f => {
        const sub = path.join(d, f);
        if (fs.statSync(sub).isDirectory()) walk(sub);
        else console.log(' ', path.relative(full, sub), fs.statSync(sub).size, 'bytes');
      });
    }
    walk(full);
  }
});
