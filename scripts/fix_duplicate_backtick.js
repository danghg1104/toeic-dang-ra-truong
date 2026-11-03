const fs = require('fs');

['js/vocab-game-workstation.js', 'www/js/vocab-game-workstation.js'].forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split(/\r?\n/);
    let removed = false;
    for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i].trim() === '`;' && lines[i + 1].trim() === '`;') {
            console.log(`Found duplicate at line ${i + 1} in ${filePath}`);
            lines.splice(i + 1, 1);
            removed = true;
            break;
        }
    }
    if (removed) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No duplicate found in ${filePath}`);
    }
});
