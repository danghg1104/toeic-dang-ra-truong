const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const attrs = match[1];
    const code = match[2];
    console.log(`Script ${count}: attrs=[${attrs}], code length=${code.length}`);
    if (!attrs.includes('src=') && !attrs.includes('type="module"')) {
        try {
            new vm.Script(code);
            console.log(`  -> Syntax OK!`);
        } catch (e) {
            console.error(`  -> SYNTAX ERROR at line:`, e);
        }
    }
}
