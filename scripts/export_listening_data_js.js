/**
 * EXPORT SCRIPT: Transforms data/listening_database_v2.json into js/listening-data-v2.js
 */
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const JS_PATH = path.join(__dirname, '..', 'js', 'listening-data-v2.js');

const db = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// ETS Listening Score Conversion Table (Raw Score 0-100 -> Scaled Score 5-495)
// Source: ETS Official TOEIC Conversion Guidelines
const etsScoreTable = [
    5, 5, 5, 5, 5, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
    80, 85, 90, 95, 100, 110, 115, 120, 125, 130, 135, 140, 145, 150, 160, 165,
    170, 175, 180, 185, 190, 195, 200, 210, 215, 220, 230, 240, 245, 250, 255,
    260, 270, 275, 280, 290, 295, 300, 310, 315, 320, 325, 330, 340, 345, 350,
    360, 365, 370, 380, 385, 390, 395, 400, 405, 410, 420, 425, 430, 440, 445,
    450, 460, 465, 470, 475, 480, 485, 490, 495, 495, 495, 495, 495, 495, 495,
    495, 495, 495, 495, 495
];

const jsContent = `/**
 * =========================================================================
 * TOEIC LISTENING DATABASE V2 & ENGINE (ETS 2026 EDITION)
 * =========================================================================
 * Chuẩn 100 câu đề thi ETS TOEIC Listening:
 * - Part 1: Photographs (6 câu · hình ảnh thực tế · 4 options A-D)
 * - Part 2: Question-Response (25 câu · chuẩn 3 options A-C)
 * - Part 3: Conversations (13 sets × 3 = 39 câu · đa giọng · câu hỏi ý định & bảng biểu)
 * - Part 4: Short Talks (10 sets × 3 = 30 câu · độc thoại · câu hỏi ý định & biểu đồ)
 * =========================================================================
 */

(function(window) {
    'use strict';

    const RAW_DB = ${JSON.stringify(db, null, 2)};
    const SCORE_TABLE = ${JSON.stringify(etsScoreTable)};

    const ListeningDatabaseV2 = {
        metadata: RAW_DB.metadata,
        part1: RAW_DB.part1,
        part2: RAW_DB.part2,
        part3: RAW_DB.part3,
        part4: RAW_DB.part4,

        // Lấy danh sách câu hỏi theo Part (dạng Set nguyên bản cho Part 3 & 4)
        getPartQuestions(partNum) {
            const p = parseInt(partNum, 10);
            if (p === 1) return this.part1;
            if (p === 2) return this.part2;
            if (p === 3) return this.part3;
            if (p === 4) return this.part4;
            return [];
        },

        // Làm phẳng Part 3 & Part 4 thành danh sách từng câu hỏi độc lập (dành cho QuickQuiz & tương thích ngược)
        getFlattenedQuestions(partNum) {
            const p = parseInt(partNum, 10);
            if (p === 1) return this.part1;
            if (p === 2) return this.part2;

            if (p === 3) {
                const flat = [];
                this.part3.forEach((set, setIdx) => {
                    const audioUrl = set.audio_url || \`/audio/listening/part3/p3-set\${setIdx + 1}.mp3\`;
                    set.questions.forEach((q, qIdx) => {
                        flat.push({
                            ...q,
                            part: 3,
                            setIndex: setIdx + 1,
                            audio_url: audioUrl,
                            audioScript: set.audioScript,
                            transcript: set.transcript,
                            passage: \`<strong>🎧 Transcript Part 3 (Đoạn \${setIdx + 1}/13):</strong><br>\` + set.transcript.replace(/\\n/g, '<br>'),
                            graphic: set.graphic || null,
                            translation_vi: set.translation_vi,
                            accent: set.accent
                        });
                    });
                });
                return flat;
            }

            if (p === 4) {
                const flat = [];
                this.part4.forEach((set, setIdx) => {
                    const audioUrl = set.audio_url || \`/audio/listening/part4/p4-set\${setIdx + 1}.mp3\`;
                    set.questions.forEach((q, qIdx) => {
                        flat.push({
                            ...q,
                            part: 4,
                            setIndex: setIdx + 1,
                            audio_url: audioUrl,
                            audioScript: set.audioScript,
                            transcript: set.transcript,
                            passage: \`<strong>🎧 Transcript Part 4 (Bài \${setIdx + 1}/10):</strong><br>\` + set.transcript.replace(/\\n/g, '<br>'),
                            graphic: set.graphic || null,
                            translation_vi: set.translation_vi,
                            accent: set.accent
                        });
                    });
                });
                return flat;
            }

            return [];
        },

        // Lấy toàn bộ 100 câu cho Thi Thử Full Test (P1: 6, P2: 25, P3: 39, P4: 30)
        getAllMockTestQuestions() {
            return [
                ...this.getFlattenedQuestions(1),
                ...this.getFlattenedQuestions(2),
                ...this.getFlattenedQuestions(3),
                ...this.getFlattenedQuestions(4)
            ];
        },

        // Lấy 25 câu ngẫu nhiên cho Mini Test (P1: 2, P2: 6, P3: 9 [3 sets], P4: 8 [~3 sets])
        getMiniTestQuestions() {
            const p1 = [...this.part1].sort(() => 0.5 - Math.random()).slice(0, 2);
            const p2 = [...this.part2].sort(() => 0.5 - Math.random()).slice(0, 6);
            
            // Lấy 3 sets ngẫu nhiên từ Part 3 (9 câu)
            const p3Sets = [...this.part3].sort(() => 0.5 - Math.random()).slice(0, 3);
            const p3Flat = [];
            p3Sets.forEach((set, setIdx) => {
                const audioUrl = set.audio_url || \`/audio/listening/part3/p3-set\${set.setNumber}.mp3\`;
                set.questions.forEach(q => {
                    p3Flat.push({
                        ...q,
                        part: 3,
                        audio_url: audioUrl,
                        audioScript: set.audioScript,
                        transcript: set.transcript,
                        graphic: set.graphic || null,
                        translation_vi: set.translation_vi
                    });
                });
            });

            // Lấy 3 sets từ Part 4 (hoặc 8 câu)
            const p4Sets = [...this.part4].sort(() => 0.5 - Math.random()).slice(0, 3);
            const p4Flat = [];
            p4Sets.forEach((set, setIdx) => {
                const audioUrl = set.audio_url || \`/audio/listening/part4/p4-set\${set.setNumber}.mp3\`;
                set.questions.forEach(q => {
                    p4Flat.push({
                        ...q,
                        part: 4,
                        audio_url: audioUrl,
                        audioScript: set.audioScript,
                        transcript: set.transcript,
                        graphic: set.graphic || null,
                        translation_vi: set.translation_vi
                    });
                });
            });

            return [...p1, ...p2, ...p3Flat, ...p4Flat.slice(0, 8)];
        },

        // Quy đổi điểm thi TOEIC Listening chuẩn ETS (0 - 100 câu đúng -> Thang điểm 5 - 495)
        calculateScore(correctCount) {
            const count = Math.max(0, Math.min(100, parseInt(correctCount, 10) || 0));
            const scaledScore = SCORE_TABLE[count] || 5;

            // Đánh giá cấp độ CEFR
            let cefr = 'A1';
            let evaluation = 'Mức độ sơ cấp (Beginner)';
            if (scaledScore >= 400) {
                cefr = 'C1';
                evaluation = 'Xuất sắc: Tiệm cận người bản xứ (Advanced / Fluent)';
            } else if (scaledScore >= 300) {
                cefr = 'B2';
                evaluation = 'Tốt: Đủ điều kiện làm việc trong môi trường quốc tế (Upper-Intermediate)';
            } else if (scaledScore >= 200) {
                cefr = 'B1';
                evaluation = 'Trung bình khá: Giao tiếp cơ bản và xử lý công việc thường nhật (Intermediate)';
            } else if (scaledScore >= 110) {
                cefr = 'A2';
                evaluation = 'Sơ trung cấp: Hiểu được các câu giao tiếp cơ bản chậm và rõ (Elementary)';
            }

            return {
                correctCount: count,
                totalQuestions: 100,
                scaledScore,
                cefr,
                evaluation,
                accuracyPercent: Math.round((count / 100) * 100)
            };
        }
    };

    window.ListeningDatabaseV2 = ListeningDatabaseV2;

})(typeof window !== 'undefined' ? window : global);
`;

fs.writeFileSync(JS_PATH, jsContent, 'utf8');
console.log(`✅ Đã xuất listening-data-v2.js tại ${JS_PATH}`);
