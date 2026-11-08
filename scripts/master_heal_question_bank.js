const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const isVietnamese = (s) => /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(s);

// Helper to strip OCR noise, leaked Vietnamese question translation, page numbers from end of option
function cleanOptionText(opt, expectedLetter) {
    if (!opt) return `${expectedLetter}. `;
    let s = opt.trim();

    // Remove leading duplicate labels like "A. (A) ", "A. A. ", "(A) ", "A. "
    s = s.replace(/^[A-D]\.\s*/i, '');
    s = s.replace(/^\([A-D]\)\s*/i, '');
    s = s.replace(/^[A-D]\.\s*/i, '');

    // Remove trailing "Chọn (A|B|C|D)..."
    s = s.replace(/\s*Chọn\s*\(?[A-D]\)?[\s\S]*$/i, '');

    // Remove trailing page headers like "12 ETS 2036 READING TEST" or "ETS 2026..."
    s = s.replace(/\s*\d{1,3}\s+ETS\s*20\d\d[\s\S]*$/i, '');
    s = s.replace(/\s*ETS\s*20\d\d[\s\S]*$/i, '');

    // Remove leaked answer letter + Vietnamese text at the end: e.g. " C Mục đích của thông báo là gì?"
    s = s.replace(/\s+[A-D]\s+[À-ỹ].*$/i, '');

    // Remove trailing page numbers
    s = s.replace(/\s+\d{1,3}$/, '');

    // Remove vocabulary POS tags if accidentally in option: e.g. "calculate (Động từ nguyên thể): tính toán." -> "calculate"
    const vocMatch = s.match(/^([a-zA-Z\s\-']+)\s*\([^\)]*từ[^\)]*\)\s*:/i);
    if (vocMatch) {
        s = vocMatch[1].trim();
    }

    s = s.trim();
    return `${expectedLetter}. ${s}`;
}

async function getPdfTexts(testNum) {
    const lcPath = path.join(__dirname, '..', 'data', 'ets2026_raw', `ETS 2026 LISTENING TEST ${testNum} (SCRIPT AND KEY).pdf`);
    const rcPath = path.join(__dirname, '..', 'data', 'ets2026_raw', `ETS 2026 READING TEST ${testNum}- KEY.pdf`);
    
    let lcText = '';
    let rcText = '';

    if (fs.existsSync(lcPath)) {
        const parser = new PDFParse({ data: fs.readFileSync(lcPath) });
        const res = await parser.getText();
        lcText = res.text
            .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
            .replace(/ETS\s*20\d\d\s+LISTENING\s+TEST\s*\d*/gi, '')
            .replace(/\n\s*\d{1,3}\s*\n/g, '\n');
    }

    if (fs.existsSync(rcPath)) {
        const parser = new PDFParse({ data: fs.readFileSync(rcPath) });
        const res = await parser.getText();
        rcText = res.text
            .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
            .replace(/ETS\s*20\d\d\s+READING\s+TEST\s*\d*/gi, '')
            .replace(/\n\s*\d{1,3}\s*\n/g, '\n');
    }

    return { lcText, rcText };
}

// Extract question data for qn from PDF text
function extractQuestionFromPdf(qn, pdfText) {
    // Find English question prompt
    const re = new RegExp(`(?:^|\\n)\\s*${qn}\\.\\s+([A-Z][^\\n]+)`, 'g');
    const matches = [...pdfText.matchAll(re)];
    let englishMatch = null;
    for (const m of matches) {
        const line = m[1].trim();
        if (!isVietnamese(line)) {
            englishMatch = m;
            break;
        }
    }
    if (!englishMatch) return null;

    const qIndex = englishMatch.index;
    const searchWindow = pdfText.slice(qIndex, qIndex + 3000);

    const getOpt = (letter) => {
        const optRegex = new RegExp(`\\(${letter}\\)\\s*([^\\n\\(\\)]+)`, 'g');
        const optMatches = [...searchWindow.matchAll(optRegex)];
        for (const om of optMatches) {
            const optText = om[1].trim();
            if (!isVietnamese(optText) && optText.length > 0 && !optText.startsWith('Chọn')) {
                return optText;
            }
        }
        return null;
    };

    const a = getOpt('A');
    const b = getOpt('B');
    const c = getOpt('C');
    const d = getOpt('D');

    // Answer
    let ansLetter = null;
    const ansRegex = new RegExp(`(?:^|\\n)\\s*${qn}\\.?\\s*\\(?([A-D])\\)?(?:\\s|\\n|$)`, 'm');
    const ansMatch = searchWindow.match(ansRegex) || pdfText.match(ansRegex);
    if (ansMatch) ansLetter = ansMatch[1].toUpperCase();

    if (a && b && c && d) {
        return {
            q: englishMatch[1].trim(),
            options: [
                cleanOptionText(a, 'A'),
                cleanOptionText(b, 'B'),
                cleanOptionText(c, 'C'),
                cleanOptionText(d, 'D')
            ],
            ansLetter,
            ans: ansLetter ? ansLetter.charCodeAt(0) - 65 : 0
        };
    }
    return null;
}

async function healTest(testNum) {
    const jsonPath = path.join(__dirname, '..', 'data', 'ets2026', `test${String(testNum).padStart(2,'0')}_full.json`);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const { lcText, rcText } = await getPdfTexts(testNum);

    let fixedCount = 0;

    // Helper to process a single question
    function processQuestion(q, part) {
        const expCount = part === 2 ? 3 : 4;
        let opts = q.options || [];

        // Check if question text is corrupted (e.g. "C", "(B)", or starts with letter and Vietnamese)
        const isCorruptPrompt = !q.q || q.q.length <= 4 || /^[A-D]\s+Nữ:|^[A-D]\s+Nam:/i.test(q.q) || !/[A-Za-z]{3,}/.test(q.q);
        const isCorruptOpts = opts.length !== expCount || opts.some((o, idx) => {
            const m = (o || '').trim().match(/^([A-D])[\.\)]/i);
            return !m || m[1].toUpperCase() !== ['A','B','C','D'][idx];
        });

        if (isCorruptPrompt || isCorruptOpts) {
            // Attempt to extract from PDF
            const pdf = part <= 4 ? lcText : rcText;
            const extracted = extractQuestionFromPdf(q.qNum, pdf);
            if (extracted) {
                if (isCorruptPrompt) q.q = extracted.q;
                if (opts.length !== expCount || isCorruptOpts) {
                    opts = extracted.options;
                    if (extracted.ansLetter) {
                        q.ansLetter = extracted.ansLetter;
                        q.ans = extracted.ans;
                    }
                }
            }
        }

        // Special handling for Part 2 with 3 options
        if (part === 2) {
            // Part 2 should only have 3 options
            if (opts.length > 3) {
                // Find the English A, B, C
                const engA = opts.find(o => /^[A\.]\s*[A-Za-z]/i.test(o) && !isVietnamese(o));
                const engB = opts.find(o => /^B[\.\)]/i.test(o) && !isVietnamese(o));
                const engC = opts.find(o => /^C[\.\)]/i.test(o) && !isVietnamese(o));
                if (engA && engB && engC) {
                    opts = [engA, engB, engC];
                } else {
                    opts = opts.slice(0, 3);
                }
            }
        }

        // Special handling for Part 5 with vocabulary explanation in options (like Q110, Q117, Q126)
        if (part === 5 && opts.length > 4) {
            // Check if there are options with "(Động từ" or "(prep)" or "(Danh từ"
            const vocOpts = opts.filter(o => /\([^\)]*từ[^\)]*\)|\(prep\)/i.test(o));
            if (vocOpts.length >= 4) {
                opts = vocOpts.slice(0, 4);
            } else {
                // Keep only English options without "Chọn"
                const cleanOpts = opts.filter(o => !o.includes('Chọn') && !isVietnamese(o));
                if (cleanOpts.length >= 4) {
                    opts = cleanOpts.slice(0, 4);
                }
            }
        }

        // If still wrong count for Part 1 (e.g. Test 6 Q6, Test 9 Q6 where page break cut off C and D)
        if (part === 1 && opts.length === 2 && q.qNum === 6) {
            if (testNum === 6) {
                opts = [
                    'A. Some paintings have been hung above a sofa.',
                    'B. Some wooden chairs are stacked in a corner.',
                    'C. There are lamps lighting some seating areas.',
                    'D. There are curtains framing a doorway.'
                ];
                q.ansLetter = 'C';
                q.ans = 2;
            } else if (testNum === 9) {
                opts = [
                    'A. The woman is standing in front of a painting.',
                    'B. The woman is carrying a painting through a doorway.',
                    'C. One of the paintings is displayed in a round frame.',
                    'D. Some paintings are leaning against a wooden bench.'
                ];
                q.ansLetter = 'C';
                q.ans = 2;
            }
        }

        // Standardize clean options format
        const finalCount = part === 2 ? 3 : 4;
        const letters = ['A', 'B', 'C', 'D'];
        const cleaned = [];
        for (let i = 0; i < finalCount; i++) {
            const raw = opts[i] || '';
            cleaned.push(cleanOptionText(raw, letters[i]));
        }

        q.options = cleaned;
        if (!q.ansLetter || q.ansLetter.length !== 1) {
            q.ansLetter = letters[q.ans] || 'A';
        }
        q.ans = letters.indexOf(q.ansLetter.toUpperCase());
        if (q.ans < 0 || q.ans >= finalCount) q.ans = 0;
        q.ansLetter = letters[q.ans];

        // Clean question text
        if (q.q) {
            q.q = q.q.replace(/^[A-D]\s+Nữ:[\s\S]*$/i, '').trim();
            q.q = q.q.replace(/^[A-D]\s+Nam:[\s\S]*$/i, '').trim();
            q.q = q.q.replace(/\s*Chọn\s*\(?[A-D]\)?[\s\S]*$/i, '').trim();
            if (!q.q || q.q.length <= 2) {
                q.q = `Question ${q.qNum}`;
            }
        }
    }

    // Traverse all parts
    (data.listening?.part1 || []).forEach(q => processQuestion(q, 1));
    (data.listening?.part2 || []).forEach(q => processQuestion(q, 2));
    (data.listening?.part3 || []).forEach(s => (s.questions || [s]).forEach(q => processQuestion(q, 3)));
    (data.listening?.part4 || []).forEach(s => (s.questions || [s]).forEach(q => processQuestion(q, 4)));
    (data.reading?.part5 || []).forEach(q => processQuestion(q, 5));
    (data.reading?.part6 || []).forEach(s => (s.questions || [s]).forEach(q => processQuestion(q, 6)));
    (data.reading?.part7 || []).forEach(s => (s.questions || [s]).forEach(q => processQuestion(q, 7)));

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Saved healed Test ${testNum}`);
}

async function run() {
    console.log('🚀 Running Master Question Bank Healer...');
    for (let t = 1; t <= 10; t++) {
        await healTest(t);
    }
    console.log('🎉 All 10 tests healed! Running audit check...');
}
run();
