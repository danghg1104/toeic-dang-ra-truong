const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

for (let i = 5170; i <= 9200; i++) {
    const chunk = lines.slice(5168, i).join('\n');
    try {
        new Function(chunk);
    } catch(e) {
        if (!e.message.includes('Unexpected end of input') && !e.message.includes("Unexpected token '}'")) {
            console.log(`Syntax error at/before line ${i}: ${e.message}`);
            console.log(`Line ${i}: ${lines[i-1]}`);
            for (let j = Math.max(5168, i - 10); j <= Math.min(lines.length, i + 5); j++) {
                console.log(`${j}: ${lines[j-1]}`);
            }
            break;
        }
    }
}
