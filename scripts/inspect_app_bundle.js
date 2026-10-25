const fs = require('fs');

const html = fs.readFileSync('scripts/sample_lesson.html', 'utf8');
const scriptSrcs = [];
const re = /src="([^"]+)"/g;
let m;
while ((m = re.exec(html)) !== null) {
    scriptSrcs.push(m[1]);
}
console.log('Script sources:', scriptSrcs);
