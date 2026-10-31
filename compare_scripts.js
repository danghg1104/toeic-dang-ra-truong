const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/a5c812dd-6346-4cf6-a90c-dad8dc9b5691/.system_generated/logs/transcript_full.jsonl', 'utf8').trim().split('\n');
let c100 = '', c108 = '';
lines.forEach(l => {
    try {
        const o = JSON.parse(l);
        if (o.step_index === 100) c100 = o.content;
        if (o.step_index === 108) c108 = o.content;
    } catch(e){}
});

function getJs(content) {
    const start = content.indexOf('```javascript\n');
    if (start === -1) return '';
    const end = content.indexOf('\n```', start + 14);
    if (end === -1) return '';
    return content.slice(start + 14, end);
}

fs.writeFileSync('step100.js', getJs(c100));
fs.writeFileSync('step108.js', getJs(c108));
console.log('step100 length:', getJs(c100).length);
console.log('step108 length:', getJs(c108).length);
