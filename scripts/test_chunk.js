const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const chunk = lines.slice(5531, 5770).join('\n');
console.log('Chunk length:', chunk.length);

try {
    const sandbox = { window: {}, document: { getElementById: () => null } };
    vm.createContext(sandbox);
    vm.runInContext(chunk, sandbox);
    console.log('Chunk executed cleanly! switchTab type:', typeof sandbox.switchTab);
} catch (e) {
    console.error('Error executing chunk:', e.message);
}
