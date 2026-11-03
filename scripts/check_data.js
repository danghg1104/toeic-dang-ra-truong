const fs = require('fs');
const content = fs.readFileSync('js/youtube-dictation-data.js', 'utf8');

// Check structure
console.log('Total characters:', content.length);
console.log('Index of window.YouTubeDictationData:', content.indexOf('window.YouTubeDictationData'));
console.log('Index of module.exports:', content.indexOf('module.exports'));

// Try requiring it as a module
try {
    const data = require('../js/youtube-dictation-data.js');
    console.log('Successfully required! Number of songs:', Array.isArray(data) ? data.length : typeof data);
    if (Array.isArray(data)) {
        data.forEach(s => {
            console.log(`- ${s.title} (${s.id}): ${s.lines.length} lines, first line start: ${s.lines[0]?.start}s`);
        });
    }
} catch (e) {
    console.error('Error requiring:', e.message);
}
