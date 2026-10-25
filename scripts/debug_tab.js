const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/const tabConfig = \{([\s\S]*?)\};/);
if (match) {
    const keys = [];
    const re = /['"]([^'"]+)['"]\s*:/g;
    let m;
    while ((m = re.exec(match[1])) !== null) {
        keys.push(m[1]);
    }
    console.log('tabConfig keys:', keys);
}

// Check where switchTab is defined and its implementation
const switchIdx = html.indexOf('function switchTab(');
if (switchIdx !== -1) {
    console.log(html.substring(switchIdx, switchIdx + 1200));
}
