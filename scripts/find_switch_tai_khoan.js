const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let p = 0;
while ((p = html.indexOf('switchTab(\'tai-khoan\')', p)) !== -1) {
    console.log('switchTab(tai-khoan) at', p);
    console.log(html.slice(Math.max(0, p - 200), Math.min(html.length, p + 300)));
    p += 22;
}
