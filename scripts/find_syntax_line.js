const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

for (let end = 5535; end <= 5770; end++) {
    const chunk = lines.slice(5531, end).join('\n');
    try {
        new vm.Script(chunk);
    } catch (e) {
        if (!e.message.includes('Unexpected end of input')) {
            console.log(`Syntax error at line ${end}:`, e.message);
            console.log(`Line content: ${lines[end - 1]}`);
            break;
        }
    }
}
