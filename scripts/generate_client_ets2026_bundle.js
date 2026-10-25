const fs = require('fs');
const path = require('path');

const test01Path = path.join(__dirname, '..', 'data', 'ets2026', 'test01_full.json');
const test01 = JSON.parse(fs.readFileSync(test01Path, 'utf8'));

const outJsPath = path.join(__dirname, '..', 'js', 'ets2026-data.js');

const jsContent = `/**
 * ETS 2026 OFFICIAL TOEIC EXAM COLLECTION - CLIENT MODULE
 * Cung cấp dữ liệu 200 câu hỏi chính thức ETS 2026 Test 1
 * Hỗ trợ làm bài theo từng Part hoặc thi Full Test 200 câu bấm giờ
 */
(function(window) {
    'use strict';

    const ETS2026_TEST01 = ${JSON.stringify(test01)};

    const Ets2026Database = {
        test01: ETS2026_TEST01,

        getTest(testNum = 1) {
            return this.test01;
        },

        getPart(partNum, testNum = 1) {
            const p = parseInt(partNum, 10);
            if (p >= 1 && p <= 4) {
                return this.test01.listening['part' + p] || [];
            } else if (p >= 5 && p <= 7) {
                return this.test01.reading['part' + p] || [];
            }
            return [];
        },

        // Flatten Part 3 or Part 4 for questions array
        getFlattenedPart(partNum, testNum = 1) {
            const p = parseInt(partNum, 10);
            if (p === 1) return this.test01.listening.part1;
            if (p === 2) return this.test01.listening.part2;
            if (p === 3) {
                const flat = [];
                this.test01.listening.part3.forEach(set => {
                    set.questions.forEach((q, idx) => {
                        flat.push({
                            ...q,
                            part: 3,
                            setRange: set.qRange,
                            audio_url: set.audio_url,
                            dialogue: set.dialogue,
                            dialogue_vi: set.dialogue_vi,
                            transcript: set.dialogue,
                            transcript_vi: set.dialogue_vi,
                            audioScript: set.dialogue
                        });
                    });
                });
                return flat;
            }
            if (p === 4) {
                const flat = [];
                this.test01.listening.part4.forEach(set => {
                    set.questions.forEach((q, idx) => {
                        flat.push({
                            ...q,
                            part: 4,
                            setRange: set.qRange,
                            audio_url: set.audio_url,
                            talk: set.talk,
                            talk_vi: set.talk_vi,
                            transcript: set.talk,
                            transcript_vi: set.talk_vi,
                            audioScript: set.talk
                        });
                    });
                });
                return flat;
            }
            if (p === 5) return this.test01.reading.part5;
            if (p === 6) {
                const flat = [];
                this.test01.reading.part6.forEach(set => {
                    set.questions.forEach(q => {
                        flat.push({
                            ...q,
                            part: 6,
                            setRange: set.qRange,
                            passage_vi: set.passage_vi
                        });
                    });
                });
                return flat;
            }
            if (p === 7) return this.test01.reading.part7;
            return [];
        },

        // Full 100 Listening questions
        getFullListening(testNum = 1) {
            return [
                ...this.getFlattenedPart(1, testNum),
                ...this.getFlattenedPart(2, testNum),
                ...this.getFlattenedPart(3, testNum),
                ...this.getFlattenedPart(4, testNum)
            ];
        },

        // Full 100 Reading questions
        getFullReading(testNum = 1) {
            return [
                ...this.getFlattenedPart(5, testNum),
                ...this.getFlattenedPart(6, testNum),
                ...this.getFlattenedPart(7, testNum)
            ];
        },

        // Calculate official Scaled Score (5 - 495 per section, 10 - 990 total)
        calculateScaledScore(lcCorrect, rcCorrect) {
            const lc = Math.max(0, Math.min(100, parseInt(lcCorrect, 10) || 0));
            const rc = Math.max(0, Math.min(100, parseInt(rcCorrect, 10) || 0));

            // Approximate ETS conversion curve
            const convertLC = c => {
                if (c <= 5) return 5;
                if (c >= 96) return 495;
                return Math.min(495, Math.round(5 + (c - 5) * 5.4));
            };
            const convertRC = c => {
                if (c <= 5) return 5;
                if (c >= 97) return 495;
                return Math.min(495, Math.round(5 + (c - 5) * 5.3));
            };

            const lcScore = convertLC(lc);
            const rcScore = convertRC(rc);
            const totalScore = lcScore + rcScore;

            return {
                lcCorrect: lc,
                rcCorrect: rc,
                totalCorrect: lc + rc,
                lcScore,
                rcScore,
                totalScore,
                maxScore: 990,
                percent: Math.round(((lc + rc) / 200) * 100)
            };
        },

        // Mở làm bài trong Listening Workstation hoặc Reading UI
        startPractice(partNum, testNum = 1) {
            const p = parseInt(partNum, 10);
            if (p >= 1 && p <= 4) {
                if (window.ToeicListeningWorkstation) {
                    window.ToeicListeningWorkstation.open({
                        isEts2026: true,
                        testNumber: testNum,
                        part: p,
                        type: 'ets2026_p' + p,
                        title: 'ETS 2026 - Test ' + testNum + ' - Part ' + p,
                        count: p === 1 ? 6 : p === 2 ? 25 : p === 3 ? 39 : 30
                    });
                } else if (typeof window.startQuickQuiz === 'function') {
                    window.startQuickQuiz('ets2026_p' + p, 'ETS 2026 Test ' + testNum + ' - Part ' + p);
                }
            } else if (p >= 5 && p <= 7) {
                if (typeof window.startQuickQuiz === 'function') {
                    window.startQuickQuiz('ets2026_p' + p, 'ETS 2026 Test ' + testNum + ' - Part ' + p);
                }
            }
        }
    };

    window.Ets2026Database = Ets2026Database;

})(typeof window !== 'undefined' ? window : global);
`;

fs.writeFileSync(outJsPath, jsContent, 'utf8');
console.log(`✅ Generated ${outJsPath} (${fs.statSync(outJsPath).size} bytes)`);
