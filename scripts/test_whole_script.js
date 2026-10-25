const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

const match = html.match(/<script>\s*\/\/ Application State[\s\S]*?<\/script>/);
if (!match) {
    console.log('Script not found');
} else {
    console.log('Script length:', match[0].length);
    try {
        new vm.Script(match[0].replace(/<\/?script>/g, ''));
        console.log('Whole script tag compiled SUCCESSFULLY!');
    } catch (e) {
        console.error('Syntax error in whole script tag:', e);
    }
}
