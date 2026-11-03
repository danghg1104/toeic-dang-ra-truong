const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s = html.indexOf('id="view-tai-khoan"');
console.log('view-tai-khoan at', s);
if (s !== -1) {
    console.log(html.slice(s, s + 1000));
}

// And check switchMainTab or how tabs are switched
const sSwitch = html.indexOf('function switchMainTab');
if (sSwitch !== -1) {
    console.log(html.slice(sSwitch, sSwitch + 600));
} else {
    // search in bundle
    const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');
    const bSwitch = bundle.indexOf('switchMainTab');
    console.log('switchMainTab in bundle at', bSwitch);
}
