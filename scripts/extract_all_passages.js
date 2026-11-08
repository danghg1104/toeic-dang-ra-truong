const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extractAllPassages() {
    const allTests = {};
    for (let t = 1; t <= 10; t++) {
        const fn = `data/ets2026_raw/ETS 2026 READING TEST ${t}- KEY.pdf`;
        if (!fs.existsSync(fn)) continue;
        const parser = new PDFParse({ data: fs.readFileSync(fn) });
        const { text } = await parser.getText();

        const pattern = /(?:Questions?|Question)\s+(\d{3})[-–](\d{3})([\s\S]*?)(?=(?:Questions?|Question)\s+\d{3}[-–]\d{3}|TEST\s+\d+|$)/gi;
        let match;
        const testSets = [];
        while ((match = pattern.exec(text)) !== null) {
            const startQ = parseInt(match[1], 10);
            const endQ = parseInt(match[2], 10);
            const rawContent = match[3];

            const firstQRegex = new RegExp(`(?:^|\\n)\\s*${startQ}\\s+`, 'm');
            const qPos = rawContent.search(firstQRegex);
            let passage = '';
            if (qPos !== -1) {
                passage = rawContent.slice(0, qPos).trim();
            } else {
                passage = rawContent.slice(0, 800).trim();
            }
            testSets.push({ startQ, endQ, passage });
        }
        allTests[t] = testSets;
        console.log(`Test ${t}: Extracted ${testSets.length} sets. (Part 6 sets: ${testSets.filter(s => s.startQ >= 131 && s.endQ <= 146).length}, Part 7 sets: ${testSets.filter(s => s.startQ >= 147).length})`);
    }

    fs.writeFileSync('data/extracted_pdf_passages.json', JSON.stringify(allTests, null, 2), 'utf8');
    console.log('Saved all extracted passages to data/extracted_pdf_passages.json!');
}

extractAllPassages().catch(console.error);
