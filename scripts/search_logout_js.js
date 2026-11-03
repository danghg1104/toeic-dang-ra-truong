const fs = require('fs');
const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));
for (const f of files) {
    const c = fs.readFileSync('js/' + f, 'utf8');
    if (c.includes('logout') || c.includes('Logout')) {
        console.log(`js/${f} mentions logout`);
        let p = 0;
        while ((p = c.indexOf('logout', p)) !== -1) {
            console.log(`[${f} at ${p}]:`, c.slice(Math.max(0, p - 30), Math.min(c.length, p + 150)));
            p += 100;
        }
    }
}
