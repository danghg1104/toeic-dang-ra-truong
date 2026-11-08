const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function test6Inspection() {
    const parser = new PDFParse({ data: fs.readFileSync('data/ets2026_raw/ETS 2026 READING TEST 6- KEY.pdf') });
    const { text } = await parser.getText();
    console.log('Test 6 total text length:', text.length);

    // Look for Q131 to Q146
    const p6Index = text.indexOf('PART 6');
    console.log('PART 6 index:', p6Index);
    if (p6Index !== -1) {
        console.log(text.slice(p6Index, p6Index + 2500));
    }
}

test6Inspection().catch(console.error);
