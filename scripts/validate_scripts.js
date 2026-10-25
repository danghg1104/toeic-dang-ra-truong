const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

// Extract all <script>...</script> blocks
const scripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);

console.log('Inline script tags count:', scripts.length);

scripts.forEach((code, idx) => {
    if (code.includes('function switchTab')) {
        console.log(`Script ${idx} contains switchTab! Code length: ${code.length}`);
        try {
            new vm.Script(code);
            console.log(`Script ${idx} syntax is VALID!`);
        } catch (e) {
            console.error(`Script ${idx} syntax error:`, e.message);
            // Print error line
            if (e.stack) {
                console.error(e.stack.split('\n').slice(0, 5).join('\n'));
            }
        }
    }
});
