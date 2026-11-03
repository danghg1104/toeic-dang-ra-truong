const fs = require('fs');
const path = require('path');

function searchDir(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
        const full = path.join(dir, item);
        const st = fs.statSync(full);
        if (st.isDirectory()) {
            if (item !== 'node_modules' && item !== '.git') searchDir(full);
        } else if (item.endsWith('.js') || item.endsWith('.html')) {
            const c = fs.readFileSync(full, 'utf8');
            if (c.includes('Còn 47 ngày') || c.includes('Chào buổi chiều,') || c.includes('sanhGreetingPrefix')) {
                console.log(`Matched in: ${full}`);
                let idx = 0;
                while ((idx = c.indexOf('Còn 47 ngày', idx)) !== -1) {
                    console.log(`[Còn 47 ngày at ${idx}]:`, c.substring(Math.max(0, idx - 150), Math.min(c.length, idx + 200)));
                    idx += 10;
                }
            }
        }
    }
}

searchDir('.');
