const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
const code = lines.slice(5168, 13900).join('\n');
const vm = require('vm');

try {
    new vm.Script(code, { lineOffset: 5168, filename: 'index.html' });
    console.log('Main script block is 100% syntactically valid!');
} catch (e) {
    console.error('Error message:', e.message);
    console.error('Error line:', e.stack.split('\n')[0]);
}
