const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function checkAllPdfs() {
    for (let t = 1; t <= 10; t++) {
        const pdfName = `data/ets2026_raw/ETS 2026 READING TEST ${t}- KEY.pdf`;
        if (!fs.existsSync(pdfName)) {
            console.log(`Test ${t}: NOT FOUND (${pdfName})`);
            continue;
        }
        const parser = new PDFParse({ data: fs.readFileSync(pdfName) });
        const data = await parser.getText();
        console.log(`Test ${t}: Pages=${data.total}, TextLen=${data.text.length}, HasPart6=${data.text.includes('PART 6')}, HasPart7=${data.text.includes('PART 7')}`);
    }
}

checkAllPdfs().catch(console.error);
