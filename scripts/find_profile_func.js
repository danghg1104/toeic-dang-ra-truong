const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let p = 0;
while ((p = html.indexOf('toggleSanhMemberProfileMenu', p)) !== -1) {
    console.log('toggleSanhMemberProfileMenu at:', p);
    console.log(html.slice(Math.max(0, p - 30), Math.min(html.length, p + 300)));
    p += 25;
}
