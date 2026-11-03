const fs = require('fs');
const files = [
    'index.html',
    'js/web-audio-micro-engine.js',
    'js/app-tour-guide.js',
    'js/pvp-arena-client.js',
    'js/editorial-theme-manager.js',
    'lib/pvp-arena-server.js'
];
for (const f of files) {
    const rootPath = f;
    const wwwPath = 'www/' + f;
    if (fs.existsSync(wwwPath)) {
        const rootC = fs.readFileSync(rootPath, 'utf8');
        const wwwC = fs.readFileSync(wwwPath, 'utf8');
        console.log(`${f}: match = ${rootC === wwwC} (root: ${rootC.length}, www: ${wwwC.length})`);
    } else {
        console.log(`www/${f} does not exist`);
    }
}
