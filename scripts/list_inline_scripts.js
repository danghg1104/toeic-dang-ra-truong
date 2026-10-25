const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find all script tags in html and print their opening and first 200 chars
const scriptTags = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];

console.log('Total inline script tags:', scriptTags.length);

scriptTags.forEach((s, idx) => {
    console.log(`\n=== Script tag ${idx} ===`);
    console.log(s[1].substring(0, 200));
    console.log('... length:', s[1].length);
});
