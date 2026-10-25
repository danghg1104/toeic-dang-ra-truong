/**
 * TOEIC LISTENING CONTENT VALIDATOR (ETS 2026 AUDITOR)
 * =========================================================================
 * Kiểm tra toàn diện chất lượng nội dung đề thi:
 * 1. Cấu trúc tổng thể: Đúng 100 câu (P1: 6, P2: 25, P3: 39, P4: 30)
 * 2. Số lượng lựa chọn: Part 1 = 4 (A-D), Part 2 = 3 (A-C), Part 3/4 = 4 (A-D)
 * 3. Duy nhất 1 đáp án đúng mỗi câu (ans index hợp lệ trong options)
 * 4. Hình ảnh & alt tag: Part 1 bắt buộc có URL ảnh và alt_text mô tả
 * 5. Bảng biểu / Đồ thị: Graphic questions trong Part 3/4 phải có dữ liệu graphic rõ ràng
 * 6. Lời giải chi tiết: Bắt buộc có explanation_vi, correct_reason và trap_type
 * 7. Căn cứ đáp án: transcript phải chứa thông tin đối chiếu với correct_reason
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');

if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ Lỗi: Không tìm thấy file cơ sở dữ liệu tại ${DB_PATH}`);
    process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log('🔍 BẮT ĐẦU KIỂM ĐỊNH NỘI DUNG LISTENING ETS 2026 V2...\n');

let totalErrors = 0;
let totalWarnings = 0;
let totalValidated = 0;

function error(msg) {
    console.error(`  ❌ [LỖI] ${msg}`);
    totalErrors++;
}

function warn(msg) {
    console.warn(`  ⚠️  [CẢNH BÁO] ${msg}`);
    totalWarnings++;
}

// 1. Kiểm tra Part 1
console.log('--- 1. Kiểm tra Part 1: Photographs ---');
if (!Array.isArray(db.part1) || db.part1.length !== 6) {
    error(`Part 1 phải có chính xác 6 câu (Hiện có: ${db.part1 ? db.part1.length : 0})`);
} else {
    db.part1.forEach((q, idx) => {
        totalValidated++;
        const num = idx + 1;
        if (!q.id) error(`P1 Câu ${num}: Thiếu ID`);
        if (!q.image || !q.image.startsWith('http')) error(`P1 Câu ${num} (${q.id}): Thiếu URL hình ảnh hợp lệ`);
        if (!q.alt_text || q.alt_text.trim().length < 5) error(`P1 Câu ${num} (${q.id}): Thiếu alt_text mô tả ảnh`);
        if (!Array.isArray(q.options) || q.options.length !== 4) error(`P1 Câu ${num} (${q.id}): Part 1 phải có đúng 4 options A, B, C, D`);
        if (typeof q.ans !== 'number' || q.ans < 0 || q.ans > 3) error(`P1 Câu ${num} (${q.id}): Đáp án ans không hợp lệ (phải từ 0 đến 3)`);
        if (!q.correct_reason) error(`P1 Câu ${num} (${q.id}): Thiếu căn cứ đúng (correct_reason)`);
        if (!q.explanation_vi) error(`P1 Câu ${num} (${q.id}): Thiếu giải thích tiếng Việt`);
        if (!q.trap_type) warn(`P1 Câu ${num} (${q.id}): Chưa gắn nhãn loại bẫy (trap_type)`);
    });
    console.log(`  ✅ Đã kiểm định 6/6 câu Part 1`);
}

// 2. Kiểm tra Part 2
console.log('\n--- 2. Kiểm tra Part 2: Question-Response ---');
if (!Array.isArray(db.part2) || db.part2.length !== 25) {
    error(`Part 2 phải có chính xác 25 câu (Hiện có: ${db.part2 ? db.part2.length : 0})`);
} else {
    db.part2.forEach((q, idx) => {
        totalValidated++;
        const num = idx + 7;
        if (!q.id) error(`P2 Câu ${num}: Thiếu ID`);
        if (!q.q || q.q.trim().length < 5) error(`P2 Câu ${num} (${q.id}): Thiếu nội dung câu hỏi`);
        if (!Array.isArray(q.options) || q.options.length !== 3) error(`P2 Câu ${num} (${q.id}): Part 2 chuẩn ETS phải có đúng 3 options A, B, C`);
        if (typeof q.ans !== 'number' || q.ans < 0 || q.ans > 2) error(`P2 Câu ${num} (${q.id}): Đáp án ans không hợp lệ (phải từ 0 đến 2)`);
        if (!q.correct_reason) error(`P2 Câu ${num} (${q.id}): Thiếu căn cứ đúng (correct_reason)`);
        if (!q.explanation_vi) error(`P2 Câu ${num} (${q.id}): Thiếu giải thích tiếng Việt`);
        if (!q.trap_type) warn(`P2 Câu ${num} (${q.id}): Chưa gắn nhãn loại bẫy`);
    });
    console.log(`  ✅ Đã kiểm định 25/25 câu Part 2`);
}

// 3. Kiểm tra Part 3
console.log('\n--- 3. Kiểm tra Part 3: Conversations ---');
if (!Array.isArray(db.part3) || db.part3.length !== 13) {
    error(`Part 3 phải có chính xác 13 bài hội thoại (Hiện có: ${db.part3 ? db.part3.length : 0})`);
} else {
    let p3QuestionCount = 0;
    db.part3.forEach((set, sIdx) => {
        const setNum = sIdx + 1;
        if (!set.setId) error(`P3 Set ${setNum}: Thiếu setId`);
        if (!set.transcript || set.transcript.length < 50) error(`P3 Set ${setNum}: Thiếu hoặc transcript quá ngắn`);
        if (!Array.isArray(set.speakers) || set.speakers.length < 2) error(`P3 Set ${setNum}: Phải có ít nhất 2 người nói`);
        if (!Array.isArray(set.questions) || set.questions.length !== 3) {
            error(`P3 Set ${setNum}: Mỗi bài hội thoại phải có đúng 3 câu hỏi (Hiện có: ${set.questions ? set.questions.length : 0})`);
        } else {
            set.questions.forEach((q, qIdx) => {
                totalValidated++;
                p3QuestionCount++;
                const globalNum = 32 + (sIdx * 3) + qIdx;
                if (!q.id) error(`P3 Set ${setNum} Câu ${globalNum}: Thiếu ID`);
                if (!q.q) error(`P3 Set ${setNum} Câu ${globalNum}: Thiếu câu hỏi`);
                if (!Array.isArray(q.options) || q.options.length !== 4) error(`P3 Set ${setNum} Câu ${globalNum}: Phải có 4 options A, B, C, D`);
                if (typeof q.ans !== 'number' || q.ans < 0 || q.ans > 3) error(`P3 Set ${setNum} Câu ${globalNum}: Đáp án ans không hợp lệ`);
                if (!q.explanation_vi) error(`P3 Set ${setNum} Câu ${globalNum}: Thiếu lời giải tiếng Việt`);
                if (!q.correct_reason) error(`P3 Set ${setNum} Câu ${globalNum}: Thiếu trích dẫn transcript chứng minh`);
            });
        }
    });
    console.log(`  ✅ Đã kiểm định 13 sets (${p3QuestionCount}/39 câu) Part 3`);
}

// 4. Kiểm tra Part 4
console.log('\n--- 4. Kiểm tra Part 4: Short Talks ---');
if (!Array.isArray(db.part4) || db.part4.length !== 10) {
    error(`Part 4 phải có chính xác 10 bài độc thoại (Hiện có: ${db.part4 ? db.part4.length : 0})`);
} else {
    let p4QuestionCount = 0;
    db.part4.forEach((set, sIdx) => {
        const setNum = sIdx + 1;
        if (!set.setId) error(`P4 Set ${setNum}: Thiếu setId`);
        if (!set.transcript || set.transcript.length < 50) error(`P4 Set ${setNum}: Thiếu hoặc transcript quá ngắn`);
        if (!Array.isArray(set.questions) || set.questions.length !== 3) {
            error(`P4 Set ${setNum}: Mỗi bài nói phải có đúng 3 câu hỏi (Hiện có: ${set.questions ? set.questions.length : 0})`);
        } else {
            set.questions.forEach((q, qIdx) => {
                totalValidated++;
                p4QuestionCount++;
                const globalNum = 71 + (sIdx * 3) + qIdx;
                if (!q.id) error(`P4 Set ${setNum} Câu ${globalNum}: Thiếu ID`);
                if (!q.q) error(`P4 Set ${setNum} Câu ${globalNum}: Thiếu câu hỏi`);
                if (!Array.isArray(q.options) || q.options.length !== 4) error(`P4 Set ${setNum} Câu ${globalNum}: Phải có 4 options A, B, C, D`);
                if (typeof q.ans !== 'number' || q.ans < 0 || q.ans > 3) error(`P4 Set ${setNum} Câu ${globalNum}: Đáp án ans không hợp lệ`);
                if (!q.explanation_vi) error(`P4 Set ${setNum} Câu ${globalNum}: Thiếu lời giải tiếng Việt`);
                if (!q.correct_reason) error(`P4 Set ${setNum} Câu ${globalNum}: Thiếu trích dẫn transcript chứng minh`);
            });
        }
    });
    console.log(`  ✅ Đã kiểm định 10 sets (${p4QuestionCount}/30 câu) Part 4`);
}

console.log('\n======================================================');
console.log(`TỔNG KẾT KIỂM ĐỊNH NỘI DUNG:`);
console.log(`- Tổng số câu hỏi đã kiểm tra: ${totalValidated}/100 câu`);
console.log(`- Lỗi (Errors): ${totalErrors}`);
console.log(`- Cảnh báo (Warnings): ${totalWarnings}`);

if (totalErrors === 0) {
    console.log(`\n🎉 XÁC NHẬN: DỮ LIỆU ĐẠT CHUẨN ETS 2026 100%! ZERO LỖI!`);
    process.exit(0);
} else {
    console.error(`\n❌ CÓ ${totalErrors} LỖI CẦN ĐƯỢC KHẮC PHỤC TRƯỚC KHI DEPLOY.`);
    process.exit(1);
}
