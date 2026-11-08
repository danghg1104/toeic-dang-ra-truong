const fs = require('fs');

let rdb = fs.readFileSync('js/reading-practice-database.js', 'utf8');

// Load passages from test01_full.json through test10_full.json
const passagesMap = {};
for (let t = 1; t <= 10; t++) {
    const fn = `data/ets2026/test${String(t).padStart(2, '0')}_full.json`;
    if (!fs.existsSync(fn)) continue;
    const data = JSON.parse(fs.readFileSync(fn, 'utf8'));

    // Part 6
    (data.reading?.part6 || []).forEach(set => {
        const qStart = set.questions[0]?.qNum || parseInt((set.qRange || '').split('-')[0], 10);
        const qEnd = set.questions[set.questions.length - 1]?.qNum || parseInt((set.qRange || '').split('-')[1], 10);
        if (set.passage) {
            passagesMap[`t${t}_p6_${qStart}_${qEnd}`] = set.passage;
        }
    });

    // Part 7
    (data.reading?.part7 || []).forEach(q => {
        let qNum = q.qNum;
        if (!qNum && typeof q.id === 'string') {
            const m = q.id.match(/\d+$/);
            if (m) qNum = parseInt(m[0], 10);
        } else if (!qNum && typeof q.id === 'number') {
            qNum = q.id;
        }
        if (q.passage) {
            passagesMap[`t${t}_p7_q${qNum}`] = q.passage;
        }
    });
}

console.log('Passage map built. Part 7 questions with clean passage:', Object.keys(passagesMap).filter(k => k.includes('_p7_')).length);

// Replace any passageContent in rdb with clean version if it contains "Đáp án:"
rdb = rdb.replace(/"setId":\s*"([^"]+)"[\s\S]*?"passageContent":\s*"([\s\S]*?)"\s*,\s*"passage_vi"/g, (match, setId, oldContent) => {
    // If it has leaked answers or questions
    if (oldContent.includes('Đáp án:') || oldContent.includes('What is') || oldContent.includes('SINGLE PASSAGE')) {
        // Find matching clean passage
        const p7Match = setId.match(/_t(\d+)_p7_set_(\d+)_(\d+)/);
        if (p7Match) {
            const t = p7Match[1];
            const startQ = p7Match[2];
            const clean = passagesMap[`t${t}_p7_q${startQ}`];
            if (clean) {
                return match.replace(`"passageContent": "${oldContent}"`, `"passageContent": ${JSON.stringify(clean)}`);
            }
        }
    }
    return match;
});

// Any remaining "Đáp án: (X)" inside passageContent: strip it cleanly
rdb = rdb.replace(/"passageContent":\s*"([^"]+)"/g, (match, content) => {
    if (content.includes('Đáp án:')) {
        let cleaned = content
            .replace(/Đáp án:\s*\([A-D]\)[^<]*<br>/gi, '')
            .replace(/Đáp án:\s*\([A-D]\)\s*\\n/gi, '')
            .replace(/Đáp án:\s*\([A-D]\)[^\n]*/gi, '')
            .replace(/What is the purpose[^\n]*<br>/gi, '')
            .replace(/What is suggested[^\n]*<br>/gi, '');
        return `"passageContent": "${cleaned}"`;
    }
    return match;
});

fs.writeFileSync('js/reading-practice-database.js', rdb, 'utf8');

// Check leaks remaining
const leaksRemaining = (rdb.match(/"passageContent":\s*"[^"]*Đáp án:\s*\([A-D]\)/g) || []).length;
console.log('Leaks remaining in passageContent after clean:', leaksRemaining);
