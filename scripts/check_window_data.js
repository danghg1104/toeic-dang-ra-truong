const fs = require('fs');
const content = fs.readFileSync('js/youtube-dictation-data.js', 'utf8');

const windowPart = content.substring(content.indexOf('window.YouTubeDictationData'));
// Evaluate windowPart in a fake window context
const fakeWindow = {};
try {
    const fn = new Function('window', windowPart);
    fn(fakeWindow);
    console.log('Window data song count:', fakeWindow.YouTubeDictationData.length);
    fakeWindow.YouTubeDictationData.forEach(s => {
        console.log(`- [WINDOW] ${s.title} (${s.id}): ${s.lines.length} lines, first line start: ${s.lines[0]?.start}s`);
    });
} catch (e) {
    console.error('Error evaluating window part:', e.message);
}
