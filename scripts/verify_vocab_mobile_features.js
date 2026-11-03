const fs = require('fs');

['js/vocab-game-workstation.js', 'www/js/vocab-game-workstation.js'].forEach(filePath => {
    const code = fs.readFileSync(filePath, 'utf8');
    console.log(`Checking ${filePath}...`);
    console.log(' - focusMobileInput:', code.includes('focusMobileInput('));
    console.log(' - giveHintLetter:', code.includes('giveHintLetter('));
    console.log(' - toggleThumbKeypad:', code.includes('toggleThumbKeypad('));
    console.log(' - handleKeypadTouch:', code.includes('handleKeypadTouch('));
    console.log(' - vgMobileInput:', code.includes('id="vgMobileInput"'));
    console.log(' - vgThumbKeypad:', code.includes('id="vgThumbKeypad"'));
    console.log(' - vgMobileControlPanel:', code.includes('id="vgMobileControlPanel"'));
});
