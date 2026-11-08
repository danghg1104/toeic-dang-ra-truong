const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const p6Sets = [
    [131, 134], [135, 138], [139, 142], [143, 146]
];

// The exact 14 ranges for ETS 2026 Part 7 (54 questions total)
const p7Sets = [
    [147, 148], [149, 150], [151, 152], [153, 155], [156, 158],
    [159, 161], [162, 165], [166, 169], [170, 175],
    [176, 180], [181, 185], [186, 190], [191, 195], [196, 200]
];

function cleanOcrArtifacts(text) {
    if (!text) return '';
    return text
        .replace(/--\s*\d+\s+of\s+\d+\s*--\s*\n\s*ETS\s*20\d\d\s*READING\s*TEST[^\n]*\n/gi, '\n')
        .replace(/\n\s*\d+\s*\n\s*ETS\s*20\d\d\s*READING\s*TEST[^\n]*/gi, '')
        .replace(/ETS\s*20\d\d\s*READING\s*TEST[^\n]*/gi, '')
        .replace(/PART\s*[567]\s*\n/gi, '')
        .replace(/\r\n/g, '\n');
}

function sanitizePassageText(raw) {
    if (!raw) return '';
    let cleaned = raw
        .replace(/^(?:Question|Questions)\s*\d+[-–]\d+\s*\n*/i, '')
        .replace(/^(?:Question|Questions)\s*\d+\s*\n*/i, '')
        .replace(/\bĐáp\s*án:\s*\([A-D]\)[^\n]*\n*/gi, '')
        .replace(/^[A-D]\s*\n*Mục\s*đích[^\n]*\n*/gim, '')
        .replace(/→\s*Chọn[^\n]*\n*/gi, '')
        .replace(/=>\s*Chọn[^\n]*\n*/gi, '')
        .trim();

    return cleaned;
}

function formatDocTypeBadge(title, startQ, endQ) {
    const t = (title || '').toLowerCase();
    let icon = 'fa-file-lines';
    let typeName = 'Thông Báo / Tài Liệu Đọc';
    let theme = 'from-blue-600 to-indigo-600';

    if (t.includes('email') || t.includes('thư điện tử') || t.includes('gửi:') || t.includes('to:')) {
        icon = 'fa-envelope';
        typeName = 'Email Doanh Nghiệp';
        theme = 'from-indigo-600 to-purple-600';
    } else if (t.includes('memo') || t.includes('bản ghi nhớ')) {
        icon = 'fa-note-sticky';
        typeName = 'Thông Điệp Nội Bộ (Memo)';
        theme = 'from-amber-600 to-orange-600';
    } else if (t.includes('tin nhắn') || t.includes('chat') || t.includes('tin vắn')) {
        icon = 'fa-comments';
        typeName = 'Hội Thoại Trực Tuyến / Tin Nhắn';
        theme = 'from-teal-600 to-emerald-600';
    } else if (t.includes('báo') || t.includes('article') || t.includes('tin tức')) {
        icon = 'fa-newspaper';
        typeName = 'Bài Báo / Tin Tức Kinh Tế';
        theme = 'from-blue-700 to-cyan-700';
    } else if (t.includes('hóa đơn') || t.includes('đơn hàng') || t.includes('order') || t.includes('receipt') || t.includes('phiếu')) {
        icon = 'fa-receipt';
        typeName = 'Chứng Từ / Hóa Đơn Thương Mại';
        theme = 'from-emerald-600 to-teal-700';
    } else if (t.includes('lịch') || t.includes('schedule') || t.includes('chương trình')) {
        icon = 'fa-calendar-days';
        typeName = 'Lịch Trình Sự Kiện / Công Tác';
        theme = 'from-violet-600 to-indigo-600';
    }

    return { icon, typeName, theme };
}

function buildPassageHtml(passageText, title, startQ, endQ, part) {
    const { icon, typeName, theme } = formatDocTypeBadge(title, startQ, endQ);
    const paragraphs = passageText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const bodyHtml = paragraphs.map(p => {
        const highlighted = p.replace(/(?:\[|\()(\d{3})(?:\]|\))/g, '<span class="inline-flex items-center justify-center px-2 py-0.5 mx-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs border border-amber-400/40">[$1]</span>');
        return `<p class="leading-relaxed text-[13px] sm:text-[13.5px] text-slate-800 dark:text-slate-100">${highlighted.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return `
<div class="toeic-reading-passage-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-4 select-text">
    <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${theme} shadow-xs">
                <i class="fa-solid ${icon}"></i>
                <span>${typeName}</span>
            </span>
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">
                Part ${part} · Câu ${startQ}–${endQ}
            </span>
        </div>
        <span class="text-[10px] font-bold text-slate-400">ETS 2026</span>
    </div>
    <div class="space-y-3 font-serif sm:font-sans">
        ${bodyHtml}
    </div>
</div>
`.trim();
}

async function extractAllTests() {
    console.log('--- EXTRACTING & REBUILDING READING PASSAGES FOR TESTS 1 TO 10 ---');
    const allExtracted = {};

    for (let t = 1; t <= 10; t++) {
        const file = `data/ets2026_raw/ETS 2026 READING TEST ${t}- KEY.pdf`;
        if (!fs.existsSync(file)) continue;

        const parser = new PDFParse({ data: fs.readFileSync(file) });
        const { text } = await parser.getText();
        const cleaned = cleanOcrArtifacts(text);

        const testData = { p6: {}, p7: {} };

        function extractSetPassage(startQ, endQ, part) {
            const qHeaderRegex = new RegExp(`(?:^|\\n)\\s*${startQ}\\s*(?:\\n|[\\(\\t\\.])`, 'm');
            const qMatch = cleaned.match(qHeaderRegex);
            if (!qMatch) return '';
            const qIdx = qMatch.index;

            const before = cleaned.slice(Math.max(0, qIdx - 3500), qIdx);
            const markers = ['PART ' + part, 'PART 6', 'PART 7', '→ Chọn', '=> Chọn', 'Chọn (A)', 'Chọn (B)', 'Chọn (C)', 'Chọn (D)'];
            let lastMarker = 0;
            for (const m of markers) {
                const idx = before.lastIndexOf(m);
                if (idx !== -1 && idx > lastMarker) {
                    const lineEnd = before.indexOf('\n', idx);
                    lastMarker = (lineEnd !== -1) ? lineEnd : idx + m.length;
                }
            }
            const passageRaw = before.slice(lastMarker).trim();
            return sanitizePassageText(passageRaw);
        }

        for (const [startQ, endQ] of p6Sets) {
            testData.p6[`${startQ}-${endQ}`] = extractSetPassage(startQ, endQ, 6);
        }

        for (const [startQ, endQ] of p7Sets) {
            testData.p7[`${startQ}-${endQ}`] = extractSetPassage(startQ, endQ, 7);
        }

        allExtracted[t] = testData;
        const p6Count = Object.values(testData.p6).filter(Boolean).length;
        const p7Count = Object.values(testData.p7).filter(Boolean).length;
        console.log(`Test ${t}: Extracted P6 = ${p6Count}/${p6Sets.length}, P7 = ${p7Count}/${p7Sets.length}`);
    }

    return allExtracted;
}

async function runMasterHeal() {
    const extractedData = await extractAllTests();

    // 1. Update data/ets2026/test01_full.json through test10_full.json
    console.log('\n--- 1. UPDATING data/ets2026/testXX_full.json FILES ---');
    for (let t = 1; t <= 10; t++) {
        const fullJsonPath = `data/ets2026/test${String(t).padStart(2, '0')}_full.json`;
        if (!fs.existsSync(fullJsonPath)) continue;

        const testJson = JSON.parse(fs.readFileSync(fullJsonPath, 'utf8'));
        const testPassages = extractedData[t] || { p6: {}, p7: {} };

        // Part 6
        if (testJson.reading && testJson.reading.part6) {
            testJson.reading.part6.forEach(set => {
                const qStart = set.questions[0]?.qNum || parseInt((set.qRange || '').split('-')[0], 10);
                const qEnd = set.questions[set.questions.length - 1]?.qNum || parseInt((set.qRange || '').split('-')[1], 10);
                const rangeStr = `${qStart}-${qEnd}`;
                const rawP = testPassages.p6[rangeStr] || set.passage_vi || '';
                const html = buildPassageHtml(rawP, set.topic || 'Part 6 Text Completion', qStart, qEnd, 6);
                set.passage = html;
                set.questions.forEach(q => {
                    q.passage = html;
                    q.passage_vi = rawP;
                });
            });
        }

        // Part 7
        if (testJson.reading && testJson.reading.part7) {
            testJson.reading.part7.forEach(q => {
                let qNum = q.qNum;
                if (!qNum && typeof q.id === 'string') {
                    const m = q.id.match(/\d+$/);
                    if (m) qNum = parseInt(m[0], 10);
                } else if (!qNum && typeof q.id === 'number') {
                    qNum = q.id;
                }
                const matchingSet = p7Sets.find(([s, e]) => qNum >= s && qNum <= e);
                if (matchingSet) {
                    const rangeStr = `${matchingSet[0]}-${matchingSet[1]}`;
                    const rawP = testPassages.p7[rangeStr] || '';
                    if (rawP) {
                        const html = buildPassageHtml(rawP, q.topic || 'Part 7 Reading Document', matchingSet[0], matchingSet[1], 7);
                        q.passage = html;
                        q.passage_vi = rawP;
                    }
                }
            });
        }

        fs.writeFileSync(fullJsonPath, JSON.stringify(testJson, null, 2), 'utf8');
        console.log(`✓ Updated ${fullJsonPath}`);
    }

    // 2. Clean and update js/reading-practice-database.js
    console.log('\n--- 2. UPDATING js/reading-practice-database.js ---');
    const rdbPath = 'js/reading-practice-database.js';
    let rdbContent = fs.readFileSync(rdbPath, 'utf8');

    for (let t = 1; t <= 10; t++) {
        const testPassages = extractedData[t] || { p6: {}, p7: {} };

        for (const [startQ, endQ] of p7Sets) {
            const rangeStr = `${startQ}-${endQ}`;
            const rawP = testPassages.p7[rangeStr];
            if (!rawP) continue;

            const html = buildPassageHtml(rawP, `Part 7 Document (Q${startQ}–${endQ})`, startQ, endQ, 7);
            const escapedHtml = JSON.stringify(html);

            const pattern = new RegExp(`"setId":\\s*"ets26_t${t}_p7_set_${startQ}_${endQ}"[\\s\\S]*?"passageContent":\\s*"[\\s\\S]*?"\\s*,\\s*"passage_vi"`, 'm');
            const target = `"setId": "ets26_t${t}_p7_set_${startQ}_${endQ}"`;
            const idx = rdbContent.indexOf(target);
            if (idx !== -1) {
                const sub = rdbContent.slice(idx, idx + 6000);
                const pcIdx = sub.indexOf('"passageContent":');
                const viIdx = sub.indexOf('"passage_vi":');
                if (pcIdx !== -1 && viIdx !== -1 && viIdx > pcIdx) {
                    const oldPassageContentBlock = sub.slice(pcIdx, viIdx);
                    const newPassageContentBlock = `"passageContent": ${escapedHtml},\n                    `;
                    rdbContent = rdbContent.slice(0, idx + pcIdx) + newPassageContentBlock + rdbContent.slice(idx + viIdx);
                }
            }
        }
    }

    fs.writeFileSync(rdbPath, rdbContent, 'utf8');
    console.log(`✓ Cleaned and updated ${rdbPath}`);
    console.log('\n=== MASTER HEAL FINISHED SUCCESSFULLY ===');
}

runMasterHeal().catch(console.error);
