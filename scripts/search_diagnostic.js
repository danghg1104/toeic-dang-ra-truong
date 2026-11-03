const fs = require('fs');

function searchAll(term) {
    console.log(`=== Searching for "${term}" ===`);
    const html = fs.readFileSync('index.html', 'utf8');
    if (html.includes(term)) {
        console.log(`Found in index.html!`);
        let idx = 0;
        while ((idx = html.indexOf(term, idx)) !== -1) {
            console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 200)));
            console.log('---');
            idx += term.length;
        }
    }
    const jsFiles = fs.readdirSync('js').filter(f => f.endsWith('.js'));
    for (const f of jsFiles) {
        const c = fs.readFileSync('js/' + f, 'utf8');
        if (c.includes(term)) {
            console.log(`Found in js/${f}!`);
        }
    }
}

searchAll('Bài Thi Chuẩn ETS');
searchAll('diagnostic');
