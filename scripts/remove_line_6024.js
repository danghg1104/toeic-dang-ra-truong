const fs = require('fs');

const file = 'index.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split(/\r?\n/);

console.log('Line 6024 before:', lines[6024]);
if (lines[6024].trim() === '}') {
  lines.splice(6024, 1);
  fs.writeFileSync(file, lines.join('\r\n'), 'utf8');
  console.log('Removed line 6024 successfully!');
} else {
  console.log('Line 6024 did not match }');
}
