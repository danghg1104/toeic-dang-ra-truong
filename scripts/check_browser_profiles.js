const fs = require('fs');

['CocCoc/Browser', 'Microsoft/Edge', 'Google/Chrome'].forEach(b => {
  const p = 'C:/Users/Admin/AppData/Local/' + b + '/User Data';
  if (fs.existsSync(p)) {
    console.log('===', b, '===');
    fs.readdirSync(p).forEach(f => {
      if (f.startsWith('Profile') || f === 'Default') {
        console.log(' ', f);
      }
    });
  }
});
