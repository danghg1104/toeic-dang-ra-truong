const fs = require('fs');

const html = fs.readFileSync('scripts/toeic_index.html', 'utf8');

// DailyDictation structure:
// Accordion items for Practice Tests
// Regex or DOM parsing
// Let's inspect the HTML around accordion items
const testBlocks = html.split('<span class="fw-bolder fs-5 d-inline-block me-2">Practice Test ');

console.log('Test blocks found:', testBlocks.length - 1);

const testsData = [];

for (let i = 1; i < testBlocks.length; i++) {
    const block = testBlocks[i];
    const testNumMatch = block.match(/^(\d+)/);
    const testNum = testNumMatch ? parseInt(testNumMatch[1]) : i;

    // Find all lessons inside this block (until the next accordion or end)
    const lessons = [];
    const lessonRegex = /href="([^"]*exercises\/toeic\/([^"/]+)\/listen-and-type)"[\s\S]*?<span class="fw-semibold">([^<]+)<\/span>[\s\S]*?<small class="text-muted">([^<]*)<\/small>[\s\S]*?<small>(\d+) parts<\/small>[\s\S]*?Vocab level: ([^<]+)<\/small>/g;
    
    let match;
    while ((match = lessonRegex.exec(block)) !== null) {
        lessons.push({
            url: match[1],
            slug: match[2],
            name: match[3].trim(),
            topic: match[4].trim(),
            parts: parseInt(match[5]),
            vocabLevel: match[6].trim()
        });
    }

    testsData.push({
        testNum,
        title: `Practice Test ${testNum}`,
        lessonCount: lessons.length,
        lessons
    });
}

console.log('Parsed tests summary:');
testsData.forEach(t => {
    console.log(`Practice Test ${t.testNum}: ${t.lessons.length} lessons`);
});

fs.writeFileSync('scripts/parsed_toeic_tests.json', JSON.stringify(testsData, null, 2));
console.log('Saved to scripts/parsed_toeic_tests.json');
