import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import os
import json

test1_path = os.path.join('data', 'ets2026', 'test01_full.json')
index_path = os.path.join('data', 'ets2026', 'tests_index.json')

test01_data = json.load(open(test1_path, 'r', encoding='utf-8'))
index_data = json.load(open(index_path, 'r', encoding='utf-8'))

js_content = f"""/**
 * ETS 2026 OFFICIAL TOEIC EXAM COLLECTION - CLIENT MODULE
 * Cung cấp toàn bộ 10 Full Tests chính thức ETS 2026 (2,000 câu hỏi LC + RC)
 * Hỗ trợ làm bài từng Part hoặc thi Full Test 200 câu với audio và ảnh gốc ETS
 */
(function(window) {{
    'use strict';

    const ETS2026_TEST01 = {json.dumps(test01_data, ensure_ascii=False)};
    const ETS2026_INDEX = {json.dumps(index_data, ensure_ascii=False)};

    const Ets2026Database = {{
        testsIndex: ETS2026_INDEX.tests || [],
        testsCache: {{
            1: ETS2026_TEST01
        }},
        currentTestNum: 1,

        hasTest(testNum) {{
            return !!this.testsCache[parseInt(testNum, 10)];
        }},

        async loadTest(testNum) {{
            const num = parseInt(testNum, 10) || 1;
            if (this.testsCache[num]) return this.testsCache[num];
            try {{
                const res = await fetch('/api/ets2026/test/' + num);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const json = await res.json();
                const actual = (json && json.data) ? json.data : json;
                if (actual && (actual.listening || actual.test_info)) {{
                    this.testsCache[num] = actual;
                    return actual;
                }}
            }} catch (err) {{
                console.warn('Could not fetch ETS 2026 test ' + num + ':', err);
            }}
            return this.testsCache[1];
        }},

        getTestData(testNum = 1) {{
            const num = parseInt(testNum, 10) || 1;
            return this.testsCache[num] || this.testsCache[1];
        }},

        getPart(partNum, testNum = 1) {{
            const p = parseInt(partNum, 10);
            const db = this.getTestData(testNum);
            if (!db) return [];
            if (p >= 1 && p <= 4) return (db.listening && db.listening['part' + p]) || [];
            if (p >= 5 && p <= 7) return (db.reading && db.reading['part' + p]) || [];
            return [];
        }},

        getFlattenedPart(partNum, testNum = 1) {{
            const p = parseInt(partNum, 10);
            const db = this.getTestData(testNum);
            if (!db) return [];
            if (p === 1 || p === 2) return this.getPart(p, testNum);
            if (p === 3) {{
                const flat = [];
                const sets = (db.listening && db.listening.part3) || [];
                sets.forEach(set => {{
                    set.questions.forEach(q => {{
                        flat.push({{
                            ...q,
                            part: 3,
                            test: db.test_info ? db.test_info.test_number : testNum,
                            audio_url: set.audio_url,
                            dialogue: set.dialogue,
                            dialogue_vi: set.dialogue_vi,
                            transcript: set.dialogue,
                            transcript_vi: set.dialogue_vi,
                            audioScript: set.dialogue
                        }});
                    }});
                }});
                return flat;
            }}
            if (p === 4) {{
                const flat = [];
                const sets = (db.listening && db.listening.part4) || [];
                sets.forEach(set => {{
                    set.questions.forEach(q => {{
                        flat.push({{
                            ...q,
                            part: 4,
                            test: db.test_info ? db.test_info.test_number : testNum,
                            audio_url: set.audio_url,
                            talk: set.talk,
                            talk_vi: set.talk_vi,
                            transcript: set.talk,
                            transcript_vi: set.talk_vi,
                            audioScript: set.talk
                        }});
                    }});
                }});
                return flat;
            }}
            if (p === 5) return (db.reading && db.reading.part5) || [];
            if (p === 6) {{
                const flat = [];
                const sets = (db.reading && db.reading.part6) || [];
                sets.forEach(set => {{
                    const cleanPassage = (set.passage_vi || '').trim();
                    const passageHtml = `
                        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-xs sm:text-[13px] leading-relaxed mb-3 space-y-2">
                            <div class="font-bold text-teal-700 dark:text-teal-300 text-xs uppercase flex items-center gap-1.5">
                                <i class="fa-solid fa-file-lines"></i>
                                <span>Đoạn văn hoàn thành câu (Câu ${{set.qRange}}):</span>
                            </div>
                            <div class="text-slate-800 dark:text-slate-200 leading-relaxed">${{cleanPassage.replace(/\\n/g, '<br>')}}</div>
                        </div>
                    `;
                    set.questions.forEach(q => {{
                        flat.push({{
                            ...q,
                            part: 6,
                            test: db.test_info ? db.test_info.test_number : testNum,
                            setRange: set.qRange,
                            passage: passageHtml,
                            passage_vi: set.passage_vi
                        }});
                    }});
                }});
                return flat;
            }}
            if (p === 7) return (db.reading && db.reading.part7) || [];
            return [];
        }},

        getFullListening(testNum = 1) {{
            return [
                ...this.getFlattenedPart(1, testNum),
                ...this.getFlattenedPart(2, testNum),
                ...this.getFlattenedPart(3, testNum),
                ...this.getFlattenedPart(4, testNum)
            ];
        }},

        getFullReading(testNum = 1) {{
            return [
                ...this.getFlattenedPart(5, testNum),
                ...this.getFlattenedPart(6, testNum),
                ...this.getFlattenedPart(7, testNum)
            ];
        }},

        calculateScaledScore(lcCorrect, rcCorrect) {{
            const lc = Math.max(0, Math.min(100, parseInt(lcCorrect, 10) || 0));
            const rc = Math.max(0, Math.min(100, parseInt(rcCorrect, 10) || 0));

            const convertLC = c => {{
                if (c <= 5) return 5;
                if (c >= 96) return 495;
                return Math.min(495, Math.round(5 + (c - 5) * 5.4));
            }};
            const convertRC = c => {{
                if (c <= 5) return 5;
                if (c >= 97) return 495;
                return Math.min(495, Math.round(5 + (c - 5) * 5.3));
            }};

            const lcScore = convertLC(lc);
            const rcScore = convertRC(rc);

            return {{
                lcCorrect: lc,
                rcCorrect: rc,
                totalCorrect: lc + rc,
                lcScore,
                rcScore,
                totalScore: lcScore + rcScore,
                maxScore: 990,
                percent: Math.round(((lc + rc) / 200) * 100)
            }};
        }},

        selectTest(testNum, section = 'all') {{
            const num = parseInt(testNum, 10) || 1;
            this.currentTestNum = num;
            
            // Sync dropdowns
            const lcSel = document.getElementById('ets2026LcTestSelect');
            if (lcSel) lcSel.value = num;
            const rcSel = document.getElementById('ets2026RcTestSelect');
            if (rcSel) rcSel.value = num;
            
            // Update banners
            const badgeLc = document.getElementById('ets2026LcBadge');
            if (badgeLc) badgeLc.textContent = `Test ${{String(num).padStart(2, '0')}} · 100 Câu Listening`;
            const titleLc = document.getElementById('ets2026LcTitle');
            if (titleLc) titleLc.textContent = `ETS 2026 TOEIC Full Test ${{String(num).padStart(2, '0')}} - Trọn Bộ Listening Bản Quyền`;

            const badgeRc = document.getElementById('ets2026RcBadge');
            if (badgeRc) badgeRc.textContent = `Test ${{String(num).padStart(2, '0')}} · 100 Câu Reading`;
            const titleRc = document.getElementById('ets2026RcTitle');
            if (titleRc) titleRc.textContent = `ETS 2026 TOEIC Full Test ${{String(num).padStart(2, '0')}} - Đọc Hiểu & Ngữ Pháp Chi Tiết`;

            // Prefetch test in background
            this.loadTest(num);
        }},

        async startPractice(partNum, testNum = null) {{
            const num = testNum !== null ? (parseInt(testNum, 10) || 1) : this.currentTestNum;
            const pStr = String(partNum).toLowerCase();

            // Ensure test is loaded
            if (!this.hasTest(num)) {{
                await this.loadTest(num);
            }}

            // Full Listening (100 câu)
            if (pStr === 'full_lc' || pStr === 'lc' || pStr === '100' || pStr === 'listening') {{
                if (window.ToeicListeningWorkstation) {{
                    window.ToeicListeningWorkstation.open({{
                        isEts2026: true,
                        testNumber: num,
                        type: 'ets2026_full_lc',
                        title: `ETS 2026 - Test ${{num}} - Full Listening (100 câu)`,
                        count: 100
                    }});
                }} else if (typeof window.startQuickQuiz === 'function') {{
                    window.startQuickQuiz(`ets2026_t${{num}}_lc`, `ETS 2026 Test ${{num}} - Full Listening`, 100);
                }}
                return;
            }}

            // Full Reading (100 câu)
            if (pStr === 'full_rc' || pStr === 'rc' || pStr === 'reading') {{
                if (typeof window.startQuickQuiz === 'function') {{
                    window.startQuickQuiz(`ets2026_t${{num}}_rc`, `ETS 2026 Test ${{num}} - Full Reading (100 câu)`, 100);
                }}
                return;
            }}

            // Full Test 200 câu (100 LC + 100 RC)
            if (pStr === 'full' || pStr === 'full_test' || pStr === 'exam' || pStr === '200') {{
                if (typeof window.startQuickQuiz === 'function') {{
                    window.startQuickQuiz(`ets2026_t${{num}}_full`, `ETS 2026 Test ${{num}} - Full Exam 200 Câu (LC + RC)`, 200);
                }}
                return;
            }}

            const p = parseInt(partNum, 10);
            if (p >= 1 && p <= 4) {{
                if (window.ToeicListeningWorkstation) {{
                    window.ToeicListeningWorkstation.open({{
                        isEts2026: true,
                        testNumber: num,
                        part: p,
                        type: `ets2026_t${{num}}_p${{p}}`,
                        title: `ETS 2026 - Test ${{num}} - Part ${{p}}`,
                        count: p === 1 ? 6 : p === 2 ? 25 : p === 3 ? 39 : 30
                    }});
                }} else if (typeof window.startQuickQuiz === 'function') {{
                    window.startQuickQuiz(`ets2026_t${{num}}_p${{p}}`, `ETS 2026 Test ${{num}} - Part ${{p}}`);
                }}
            }} else if (p >= 5 && p <= 7) {{
                if (typeof window.startQuickQuiz === 'function') {{
                    const count = p === 5 ? 30 : p === 6 ? 16 : 54;
                    window.startQuickQuiz(`ets2026_t${{num}}_p${{p}}`, `ETS 2026 Test ${{num}} - Part ${{p}}`, count);
                }}
            }}
        }}
    }};

    window.Ets2026Database = Ets2026Database;

}})(typeof window !== 'undefined' ? window : global);
"""

out_js_path = os.path.join('js', 'ets2026-data.js')
with open(out_js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"✅ Generated {out_js_path} ({os.path.getsize(out_js_path)} bytes)")
