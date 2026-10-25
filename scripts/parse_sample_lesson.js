const fs = require('fs');

const html = fs.readFileSync('scripts/sample_lesson.html', 'utf8');

// Check audio tags, sound URLs, js data objects
const audioMatches = html.match(/https?:\/\/[^"']*\.mp3[^"']*/g);
console.log('MP3 matches:', audioMatches);

// Check for JSON or script variables
const scriptMatches = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0]);
console.log('Script tags count:', scriptMatches.length);

scriptMatches.forEach((s, idx) => {
    if (s.includes('audio') || s.includes('parts') || s.includes('sentence') || s.includes('transcript') || s.includes('data') || s.includes('items')) {
        console.log(`\n--- Script ${idx} interesting snippet ---`);
        console.log(s.substring(0, 500));
        if (s.length > 500) console.log('... [total len: ' + s.length + ']');
    }
});

// Check for any input/textarea/hint elements in html
console.log('\n--- Searching for Hint or Form in HTML ---');
const hintIdx = html.indexOf('Hint:');
if (hintIdx !== -1) {
    console.log(html.substring(hintIdx - 100, hintIdx + 300));
} else {
    console.log('No direct "Hint:" in static html, might be dynamically rendered by JS');
}
