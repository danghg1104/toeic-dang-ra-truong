const fs = require('fs');

// 1. Fix data/ets2026/test02_full.json
const t2Path = 'data/ets2026/test02_full.json';
const t2 = JSON.parse(fs.readFileSync(t2Path, 'utf8'));
const q166 = t2.reading.part7.find(q => q.qNum === 166);
if (q166) {
    q166.ans = 0;
    q166.ansLetter = 'A';
    q166.options = [
        'A. They can be discounted if bought as a package.',
        'B. They are unavailable in some dealerships.',
        'C. Some will be discontinued soon.',
        'D. Some are available only if bought in a package.'
    ];
    q166.explanation_vi = 'Đáp án đúng: (A). Dẫn chứng: Quảng cáo nêu rõ các tùy chọn (options) có thể được giảm giá nếu mua theo gói trọn gói (package).\n→ Chọn (A) They can be discounted if bought as a package.';
}
fs.writeFileSync(t2Path, JSON.stringify(t2, null, 2), 'utf8');

// 2. Fix data/ets2026/test06_full.json
const t6Path = 'data/ets2026/test06_full.json';
const t6 = JSON.parse(fs.readFileSync(t6Path, 'utf8'));
let q131 = null;
if (t6.reading.part6) {
    for (const item of t6.reading.part6) {
        if (item.questions) {
            const found = item.questions.find(q => q.qNum === 131);
            if (found) { q131 = found; break; }
        } else if (item.qNum === 131) {
            q131 = item; break;
        }
    }
}
if (q131) {
    q131.ans = 2;
    q131.ansLetter = 'C';
    q131.options = [
        'A. furniture',
        'B. exhibition',
        'C. equipment',
        'D. application'
    ];
    q131.explanation_vi = 'Đáp án đúng: (C) equipment. Giải thích: equipment (thiết bị) là danh từ phù hợp nhất để thay thế cho bicycle racks (giá đỡ xe đạp bên ngoài).\n(A) furniture: đồ nội thất\n(B) exhibition: cuộc triển lãm\n(C) equipment: thiết bị\n(D) application: đơn xin việc\n→ Chọn (C) equipment.';
}
fs.writeFileSync(t6Path, JSON.stringify(t6, null, 2), 'utf8');

// 3. Fix js/reading-practice-database.js
const rdbPath = 'js/reading-practice-database.js';
let rdb = fs.readFileSync(rdbPath, 'utf8');

// Fix Q166
const q166Target = `"id": "ets26_t2_p7_q166",`;
if (rdb.includes(q166Target)) {
    rdb = rdb.replace(
        /("id":\s*"ets26_t2_p7_q166"[\s\S]*?"ans":\s*)\d+([\s\S]*?"ansLetter":\s*)"[A-D]"/,
        '$10$2"A"'
    );
}

// Fix Q131
const q131Target = `"id": "ets26_t6_p6_q131",`;
if (rdb.includes(q131Target)) {
    // Replace options for Q131
    const q131OptionsRegex = /("id":\s*"ets26_t6_p6_q131"[\s\S]*?"options":\s*\[)([\s\S]*?)(\][\s\S]*?"ans":\s*)\d+([\s\S]*?"ansLetter":\s*)"[A-D]"/;
    rdb = rdb.replace(q131OptionsRegex, (match, prefix, oldOpts, mid, post) => {
        const cleanOpts = `\n            "A. furniture",\n            "B. exhibition",\n            "C. equipment",\n            "D. application"\n          `;
        return `${prefix}${cleanOpts}${mid}2${post}"C"`;
    });
}
fs.writeFileSync(rdbPath, rdb, 'utf8');

console.log('Successfully patched Test 2 Q166 and Test 6 Q131 across all files!');
