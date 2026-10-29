const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;

let count = 0;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  try {
    new vm.Script(match[1]);
    console.log(`Script block #${count} syntax OK!`);
  } catch (err) {
    console.error(`Script block #${count} syntax ERROR:`, err.message);
  }
}
