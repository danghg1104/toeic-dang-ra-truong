const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let index = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  index++;
  const fullTag = match[0];
  const code = match[1];
  if (!code.trim()) continue;
  if (fullTag.includes('type="module"')) {
    console.log('Script ' + index + ' (module) skipped for vm.Script');
    continue;
  }
  try {
    new vm.Script(code);
    console.log('Script ' + index + ' valid (' + code.length + ' chars)');
  } catch (err) {
    console.error('ERROR in script ' + index + ':', err.message);
  }
}
