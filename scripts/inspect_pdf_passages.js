const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function main() {
    const parser = new PDFParse({ data: fs.readFileSync('data/ets2026_raw/ETS 2026 READING TEST 1- KEY.pdf') });
    const data = await parser.getText();
    console.log('Total text length:', data.text.length);

    // Search for Part 6 passages
    const p6Index = data.text.indexOf('PART 6');
    console.log('Found PART 6 at:', p6Index);
    if (p6Index !== -1) {
        console.log('--- PART 6 Preview (first 1500 chars) ---');
        console.log(data.text.slice(p6Index, p6Index + 1500));
    }

    // Search for Question 131
    const q131Index = data.text.indexOf('131');
    console.log('Found 131 at:', q131Index);
}

main().catch(console.error);
