const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const head = html.substring(0, html.indexOf('</head>'));
const scripts = [...head.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/gi)].map(m => m[1]);

console.log('Scripts in <head>:');
scripts.forEach((s, i) => console.log(`${i+1}. ${s}`));
