const fs = require('fs');
if (fs.existsSync('js/one-page-cheat-sheet.js')) {
    const code = fs.readFileSync('js/one-page-cheat-sheet.js', 'utf8');
    console.log('File length:', code.length);
    console.log('--- Start of js/one-page-cheat-sheet.js ---');
    console.log(code.slice(0, 1500));
} else {
    console.log('js/one-page-cheat-sheet.js not found');
}
