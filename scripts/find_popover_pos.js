const fs = require('fs');
const code = fs.readFileSync('js/app-tour-guide.js', 'utf8');

const idx = code.indexOf('_positionPopover');
if (idx !== -1) {
    console.log(code.substring(idx, idx + 2000));
} else {
    // search for popover
    let p = 0;
    while ((p = code.indexOf('popover', p)) !== -1) {
        console.log('popover at', p);
        console.log(code.substring(Math.max(0, p - 50), Math.min(code.length, p + 250)));
        p += 20;
    }
}
