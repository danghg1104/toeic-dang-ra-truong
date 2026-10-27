const fs = require('fs');
const path = require('path');
const recentDir = 'C:/Users/Admin/AppData/Roaming/Microsoft/Windows/Recent';

fs.readdirSync(recentDir).forEach(f => {
  if (f.endsWith('.lnk') && (f.includes('toeic') || f.includes('dang') || f.includes('tr_ng') || f.includes('CungDang'))) {
    const buf = fs.readFileSync(path.join(recentDir, f));
    const str = buf.toString('latin1');
    const regex = /[A-Za-z]:\\[A-Za-z0-9_\-\s\\.]+\.(html|zip|pdf|txt)/gi;
    const matches = str.match(regex);
    console.log(f, '-->', matches ? matches[0] : 'no target match');
  }
});
