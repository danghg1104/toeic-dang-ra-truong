const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extractTestPassages(testNum) {
    const file = `data/ets2026_raw/ETS 2026 READING TEST ${testNum}- KEY.pdf`;
    if (!fs.existsSync(file)) return null;

    const parser = new PDFParse({ data: fs.readFileSync(file) });
    const { text } = await parser.getText();

    // Clean OCR page breaks: e.g. -- 15 of 50 -- \n ETS 2026 READING TEST
    const cleanedText = text.replace(/--\s*\d+\s+of\s+\d+\s*--\s*\n\s*ETS\s*20\d\d\s*READING\s*TEST[^\n]*\n/gi, '\n');

    // Part 6 sets: (131-134), (135-138), (139-142), (143-146)
    const p6Ranges = [
        { start: 131, end: 134 },
        { start: 135, end: 138 },
        { start: 139, end: 142 },
        { start: 143, end: 146 }
    ];

    // Part 7 sets: standard TOEIC ranges
    const p7Ranges = [
        { start: 147, end: 148 },
        { start: 149, end: 150 },
        { start: 151, end: 152 },
        { start: 153, end: 155 },
        { start: 156, end: 158 },
        { start: 159, end: 160 },
        { start: 161, end: 163 },
        { start: 164, end: 167 },
        { start: 168, end: 171 },
        { start: 172, end: 175 },
        { start: 176, end: 180 },
        { start: 181, end: 185 },
        { start: 186, end: 190 },
        { start: 191, end: 195 },
        { start: 196, end: 200 }
    ];

    const results = { p6: [], p7: [] };

    function findPassageForRange(startQ, endQ) {
        // Pattern 1: Question startQ-endQ ... startQ
        const qRangeRegex = new RegExp(`(?:Question|Questions)?\\s*${startQ}\\s*[-–]\\s*${endQ}[\\s\\S]*?(?=(?:^|\\n)\\s*${startQ}[\\.\\t\\s])`, 'im');
        let m = cleanedText.match(qRangeRegex);
        if (m) {
            let p = m[0].replace(new RegExp(`^(?:Question|Questions)?\\s*${startQ}\\s*[-–]\\s*${endQ}`, 'i'), '').trim();
            if (p.length > 50) return p;
        }

        // Pattern 2: Search for number indicator with brackets/parentheses/dashes e.g. (131), [131], — 131. ---
        const blankRegex = new RegExp(`[\\(\\[—–_\\-]\\s*${startQ}[\\.\\)\\]—–_\\-]`, 'm');
        const matchBlank = cleanedText.match(blankRegex);
        if (matchBlank && matchBlank.index !== undefined) {
            const citeIdx = matchBlank.index;
            // Walk backwards to find start of passage (previous question answer `Chọn` or `Question` or `PART`)
            const beforeText = cleanedText.slice(Math.max(0, citeIdx - 1500), citeIdx);
            const markers = ['PART 6', 'PART 7', 'Chọn (A)', 'Chọn (B)', 'Chọn (C)', 'Chọn (D)', '→ Chọn', '=> Chọn', 'Phân tích đáp án sai:'];
            let lastMarkerIdx = 0;
            for (const marker of markers) {
                const idx = beforeText.lastIndexOf(marker);
                if (idx !== -1 && idx > lastMarkerIdx) lastMarkerIdx = idx + marker.length;
            }
            const passageStart = Math.max(0, citeIdx - 1500) + lastMarkerIdx;

            // Walk forwards to find start of questions: e.g. `\nstartQ.` or `\nstartQ\t` or `\nstartQ `
            const afterText = cleanedText.slice(citeIdx);
            const qStartRegex = new RegExp(`(?:\\n\\s*${startQ}[\\.\\t\\s]|${startQ}\\s*\\t)`, 'm');
            const qMatch = afterText.match(qStartRegex);
            const passageEnd = qMatch ? (citeIdx + qMatch.index) : (citeIdx + 800);

            const passage = cleanedText.slice(passageStart, passageEnd).trim();
            if (passage.length > 50) return passage;
        }

        return '';
    }

    for (const r of p6Ranges) {
        const passage = findPassageForRange(r.start, r.end);
        results.p6.push({ range: `${r.start}-${r.end}`, len: passage.length, text: passage });
    }

    for (const r of p7Ranges) {
        const passage = findPassageForRange(r.start, r.end);
        results.p7.push({ range: `${r.start}-${r.end}`, len: passage.length, text: passage });
    }

    return results;
}

async function run() {
    let totalP6 = 0, totalP7 = 0;
    const allPassages = {};
    for (let t = 1; t <= 10; t++) {
        const res = await extractTestPassages(t);
        const p6Found = res.p6.filter(p => p.len > 0).length;
        const p7Found = res.p7.filter(p => p.len > 0).length;
        totalP6 += p6Found;
        totalP7 += p7Found;
        allPassages[t] = res;
        console.log(`Test ${t}: P6 extracted = ${p6Found}/4, P7 extracted = ${p7Found}/${res.p7.length}`);
    }
    console.log(`\nTOTAL EXTRACTED: Part 6 = ${totalP6}/40, Part 7 = ${totalP7}/147`);
    fs.writeFileSync('data/cleaned_extracted_passages.json', JSON.stringify(allPassages, null, 2), 'utf8');
}

run().catch(console.error);
