const fs = require('fs');

console.log('Comparing index.html and www/index.html...');
if (fs.existsSync('www/index.html')) {
    const rootHtml = fs.readFileSync('index.html', 'utf8');
    const wwwHtml = fs.readFileSync('www/index.html', 'utf8');
    console.log('Root index.html length:', rootHtml.length);
    console.log('www/index.html length:', wwwHtml.length);
    console.log('Match?', rootHtml === wwwHtml);
} else {
    console.log('www/index.html does not exist');
}

// Check where server.js serves files from!
const serverJs = fs.readFileSync('server.js', 'utf8');
console.log('--- server.js static paths ---');
serverJs.split('\n').filter(l => l.includes('static') || l.includes('express.static') || l.includes('sendFile')).forEach(l => console.log(l));
