const fs = require('fs');
if (fs.existsSync('scripts/read_orig_trigger.js')) {
  console.log(fs.readFileSync('scripts/read_orig_trigger.js', 'utf8'));
}
