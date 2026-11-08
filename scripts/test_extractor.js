const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function testExtractor() {
    const parser = new PDFParse({ data: fs.readFileSync('data/ets2026_raw/ETS 2026 READING TEST 1- KEY.pdf') });
    const { text } = await parser.getText();

    // Regex to find Question XXX-YYY blocks
    const pattern = /(?:Questions?|Question)\s+(\d{3})[-–](\d{3})([\s\S]*?)(?=(?:Questions?|Question)\s+\d{3}[-–]\d{3}|TEST\s+\d+|$)/gi;
    let match;
    const blocks = [];
    while ((match = pattern.exec(text)) !== null) {
        const startQ = parseInt(match[1], 10);
        const endQ = parseInt(match[2], 10);
        const rawContent = match[3];

        // The passage comes before the first question number (e.g. before "131" or "147")
        const firstQRegex = new RegExp(`(?:^|\\n)\\s*${startQ}\\s+`, 'm');
        const qPos = rawContent.search(firstQRegex);
        let passage = '';
        if (qPos !== -1) {
            passage = rawContent.slice(0, qPos).trim();
        } else {
            passage = rawContent.slice(0, 500).trim();
        }
        blocks.push({ startQ, endQ, passageLen: passage.length, preview: passage.slice(0, 150) });
    }

    console.log('Found blocks in Test 1:', blocks.length);
    blocks.forEach(b => {
        console.log(`Q${b.startQ}-${b.endQ}: len=${b.passageLen} | ${b.preview.replace(/\n/g, ' ')}`);
    });
}

testExtractor().catch(console.error);
