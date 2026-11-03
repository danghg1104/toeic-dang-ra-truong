const fs = require('fs');
const files = ['index.html', ...fs.readdirSync('js').map(f => 'js/' + f)];
for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('Còn 47 ngày ôn luyện')) {
        console.log(`Found "Còn 47 ngày ôn luyện" in ${f}`);
    }
}
