const fs = require('fs');
const path = require('path');

function searchFor(dir, target, depth = 0) {
  if (depth > 4) return;
  try {
    fs.readdirSync(dir).forEach(f => {
      const full = path.join(dir, f);
      if (f.toLowerCase().includes(target.toLowerCase())) {
        console.log('FOUND:', full);
      }
      try {
        if (fs.statSync(full).isDirectory()) {
          searchFor(full, target, depth + 1);
        }
      } catch(e) {}
    });
  } catch(e) {}
}

searchFor('C:/Users/Admin/AppData/Local/CocCoc', 'Shortcut');
searchFor('C:/Users/Admin/AppData/Local/Google/Chrome', 'Shortcut');
searchFor('C:/Users/Admin/AppData/Local/Microsoft/Edge', 'Shortcut');
