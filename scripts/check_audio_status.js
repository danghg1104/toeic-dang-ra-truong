const fs = require('fs');
const path = require('path');

function checkDir(base) {
    console.log(`=== ${base} ===`);
    if (!fs.existsSync(base)) {
        console.log('Does not exist');
        return;
    }
    const parts = fs.readdirSync(base);
    parts.forEach(p => {
        const full = path.join(base, p);
        if (fs.statSync(full).isDirectory()) {
            const files = fs.readdirSync(full);
            console.log(`  ${p}: ${files.length} files`);
        }
    });
}

checkDir('audio/listening');
checkDir('public/audio/listening');
