const fs = require('fs');
const path = require('path');

['C:/Users/Admin/Desktop', 'C:/Users/Public/Desktop'].forEach(d => {
  console.log('=== DIR:', d, '===');
  try {
    const list = fs.readdirSync(d);
    list.forEach(f => {
      const full = path.join(d, f);
      const st = fs.lstatSync(full);
      console.log(f, '| size:', st.size, '| isLnk:', f.endsWith('.lnk'));
    });
  } catch(e) {
    console.error(e);
  }
});
