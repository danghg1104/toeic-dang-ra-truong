const fs = require('fs');
const bundle = fs.readFileSync('js/app-core.bundle.js', 'utf8');

let p = 0;
while ((p = bundle.indexOf('sanhMemberProfileMenu', p)) !== -1) {
    console.log('sanhMemberProfileMenu in bundle at', p);
    console.log(bundle.slice(p - 100, p + 300));
    p += 25;
}
