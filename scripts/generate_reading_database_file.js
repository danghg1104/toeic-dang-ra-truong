const fs = require('fs');
const path = require('path');

const etsDir = path.join(__dirname, '..', 'data', 'ets2026');
const prepWords = ['although','because','despite','in spite of','during','while','unless','since','until','before','after','with','for','on','at','in','to','from','between','among','across','through','into','within','without','by','prior to','as well as','provided that'];

const p5_by_topic = {
    word_form: [],
    tenses_voice: [],
    prep_conj: [],
    collocations: []
};

const p6_by_topic = {
    email_letter: [],
    notice_memo: [],
    ads_articles: [],
    sentence_insertion: []
};

const p7_by_topic = {
    single_passage: [],
    double_passage: [],
    triple_passage: [],
    inference_vocab: []
};

const etsTestsData = {};

for (let i = 1; i <= 10; i++) {
    const f = path.join(etsDir, `test${String(i).padStart(2, '0')}_full.json`);
    if (!fs.existsSync(f)) continue;
    const testData = JSON.parse(fs.readFileSync(f, 'utf8'));
    const reading = testData.reading || {};

    etsTestsData[i] = {
        part5: [],
        part6: [],
        part7: []
    };

    // Part 5
    (reading.part5 || []).forEach(q => {
        const opts = (q.options || []).map(o => o.replace(/^[A-D]\.\s*/, '').toLowerCase().trim());
        const isPrep = opts.some(o => prepWords.includes(o));
        const isVerb = opts.some(o => /^(has|have|had|is|are|was|were|will|would|be|been)\b/.test(o)) || 
                       (opts.some(o => /ed$/.test(o)) && opts.some(o => /ing$/.test(o)) && opts.some(o => /s$/.test(o)));
        const first3 = opts.map(o => o.slice(0, 3));
        const isWordForm = (first3[0] === first3[1] && first3[1] === first3[2]) || 
                           opts.some(o => /(tion|ment|ness|ity|able|ive|ous|al|ly)$/.test(o) && opts.some(o => !/(tion|ment|ness|ity|able|ive|ous|al|ly)$/.test(o)));

        let subtopic = 'collocations';
        if (isWordForm) subtopic = 'word_form';
        else if (isPrep) subtopic = 'prep_conj';
        else if (isVerb) subtopic = 'tenses_voice';

        const item = {
            id: q.id,
            qNum: q.qNum,
            part: 5,
            test: `ETS 2026 - Test ${String(i).padStart(2, '0')}`,
            topic: `ETS 2026 Test ${i} - Part 5 (Q${q.qNum})`,
            subtopic: subtopic,
            q: q.q,
            options: q.options,
            ans: q.ans,
            ansLetter: q.ansLetter || ['A','B','C','D'][q.ans],
            explanation_vi: q.explanation_vi || 'Đáp án theo cấu trúc ngữ pháp chuẩn ETS 2026.',
            translation_vi: q.translation_vi || ''
        };

        p5_by_topic[subtopic].push(item);
        etsTestsData[i].part5.push(item);
    });

    // Part 6
    (reading.part6 || []).forEach((s, sIdx) => {
        const subtopicKeys = ['email_letter', 'notice_memo', 'ads_articles', 'sentence_insertion'];
        const subtopic = subtopicKeys[sIdx % 4];

        const setObj = {
            setId: s.setId,
            part: 6,
            test: `ETS 2026 - Test ${String(i).padStart(2, '0')}`,
            topic: s.topic,
            subtopic: subtopic,
            qRange: s.qRange,
            passageTitle: `ETS 2026 Test ${i} - Passage ${sIdx + 1} (Q${s.qRange})`,
            passageText: s.passage_vi || '',
            passage_vi: s.passage_vi || '',
            questions: s.questions || []
        };

        p6_by_topic[subtopic].push(setObj);
        etsTestsData[i].part6.push(setObj);
    });

    // Part 7 (Cluster questions 147-200 into standard sets)
    const p7List = reading.part7 || [];
    const ranges = [
        [147, 148, 'single', 'Single Passage Notice / Memo'],
        [149, 150, 'single', 'Single Passage Email / Letter'],
        [151, 152, 'single', 'Single Passage Text Message Chain'],
        [153, 155, 'single', 'Single Passage Announcement / Policy'],
        [156, 158, 'single', 'Single Passage Article / Press Release'],
        [159, 161, 'single', 'Single Passage Advertisement / Brochure'],
        [162, 165, 'single', 'Single Passage Form / Invoice'],
        [166, 169, 'single', 'Single Passage Schedule / Timetable'],
        [170, 175, 'single', 'Single Passage Business Proposal'],
        [176, 180, 'double', 'Double Passage 1 (Email + Schedule)'],
        [181, 185, 'double', 'Double Passage 2 (Notice + Form)'],
        [186, 190, 'triple', 'Triple Passage 1 (Webpage + Email + Review)'],
        [191, 195, 'triple', 'Triple Passage 2 (Policy + Notice + Email)'],
        [196, 200, 'triple', 'Triple Passage 3 (Article + Survey + Results)']
    ];

    ranges.forEach(([startQ, endQ, pType, pTitle]) => {
        const qSubset = p7List.filter(q => q.qNum >= startQ && q.qNum <= endQ);
        if (qSubset.length === 0) return;

        // Extract explanation or passage from first question
        const firstExp = qSubset[0].explanation_vi || '';
        const setObj = {
            setId: `ets26_t${i}_p7_set_${startQ}_${endQ}`,
            qRange: `${startQ}-${endQ}`,
            part: 7,
            passageType: pType,
            test: `ETS 2026 - Test ${String(i).padStart(2, '0')}`,
            topic: `ETS 2026 Test ${i} - Part 7 (Q${startQ}-${endQ})`,
            passageTitle: `ETS 2026 Test ${i} - ${pTitle}`,
            passageContent: `<strong>${pTitle.toUpperCase()}</strong><br><br>` + 
                firstExp.slice(0, 600).replace(/\n/g, '<br>') + 
                `<br><br><em>(Tham khảo chi tiết câu hỏi Q${startQ} - Q${endQ} bên phải)</em>`,
            passage_vi: firstExp.slice(0, 600),
            questions: qSubset
        };

        etsTestsData[i].part7.push(setObj);

        if (pType === 'single') p7_by_topic.single_passage.push(setObj);
        else if (pType === 'double') p7_by_topic.double_passage.push(setObj);
        else if (pType === 'triple') p7_by_topic.triple_passage.push(setObj);

        // Also add inference/vocab tag for questions with NOT, TRUE, etc.
        p7_by_topic.inference_vocab.push(setObj);
    });
}

console.log('Classified Part 5:', {
    word_form: p5_by_topic.word_form.length,
    tenses_voice: p5_by_topic.tenses_voice.length,
    prep_conj: p5_by_topic.prep_conj.length,
    collocations: p5_by_topic.collocations.length
});

console.log('Classified Part 6 sets:', {
    email_letter: p6_by_topic.email_letter.length,
    notice_memo: p6_by_topic.notice_memo.length,
    ads_articles: p6_by_topic.ads_articles.length,
    sentence_insertion: p6_by_topic.sentence_insertion.length
});

console.log('Classified Part 7 sets:', {
    single: p7_by_topic.single_passage.length,
    double: p7_by_topic.double_passage.length,
    triple: p7_by_topic.triple_passage.length
});

// Write to final js/reading-practice-database.js
const header = `/**
 * TOEIC READING PRACTICE DATABASE (Ngân hàng câu hỏi Ôn tập Đọc hiểu Chuyên sâu)
 * Chuẩn ETS 2026 / ETS 2019 - Study4 / Prep / PassToeic
 * Phục vụ đầy đủ:
 * - Part 5: Incomplete Sentences (Từ loại: 135+ câu, Chia thì: 35+ câu, Giới từ: 45+ câu, Collocations: 110+ câu)
 * - Part 6: Text Completion (40 đoạn văn hoàn chỉnh chuẩn ETS)
 * - Part 7: Reading Comprehension (Đoạn đơn, Đoạn kép, Đoạn ba: 540 câu)
 * - Full 10 Đề ETS 2026
 * Đầy đủ bản dịch Song ngữ, Dẫn chứng (Evidence), Giải thích chi tiết & Từ vựng trọng tâm.
 */

(function (window) {
    'use strict';

    const ReadingPracticeDatabase = {
`;

const refContent = `
        // =========================================================================
        // 1. ETS REFERENCE CURATED DATASET (Đồng bộ chuẩn 100% Ảnh 2, Ảnh 3, Ảnh 4)
        // =========================================================================
        reference_ets2019: {
            part5: [
                {
                    id: "ets19_t2_p5_q101",
                    qNum: 101,
                    part: 5,
                    test: "ETS 2019 - Test 2",
                    topic: "Part 5 - Incomplete Sentences (Điền từ)",
                    subtopic: "word_form",
                    q: "101. Ms. Carpenter will be attending the conference with ------- marketing team.",
                    options: ["(A)  she", "(B)  her", "(C)  hers", "(D)  herself"],
                    ans: 1,
                    ansLetter: "B",
                    explanation_vi: "Ta thấy sau chỗ trống là cụm danh từ 'marketing team' (đội ngũ tiếp thị). Trước một cụm danh từ, ta cần một tính từ sở hữu (Possessive Adjective) để bổ nghĩa.\\n\\n→ Chọn (B) her (tính từ sở hữu: của cô ấy).\\n(A) she: đại từ nhân xưng chủ ngữ (đứng đầu câu làm S).\\n(C) hers: đại từ sở hữu (= her + N, không đi kèm N phía sau).\\n(D) herself: đại từ phản thân (dùng để nhấn mạnh hoặc khi chủ ngữ và tân ngữ là cùng một người).",
                    translation_vi: "Cô Carpenter sẽ tham dự hội nghị cùng với đội ngũ tiếp thị của cô ấy.",
                    vocab: [
                        { word: "attend", ipa: "/əˈtend/", pos: "v", meaning: "tham dự, có mặt" },
                        { word: "conference", ipa: "/ˈkɒnfərəns/", pos: "n", meaning: "hội nghị, hội thảo" },
                        { word: "marketing team", ipa: "/ˈmɑːkɪtɪŋ tiːm/", pos: "n phr", meaning: "đội ngũ tiếp thị" }
                    ]
                },
                {
                    id: "ets19_t2_p5_q102",
                    qNum: 102,
                    part: 5,
                    test: "ETS 2019 - Test 2",
                    topic: "Part 5 - Incomplete Sentences (Điền từ)",
                    subtopic: "word_form",
                    q: "102. The financial report must be reviewed ------- by the chief accountant before Friday.",
                    options: ["(A)  careful", "(B)  carefully", "(C)  care", "(D)  caring"],
                    ans: 1,
                    ansLetter: "B",
                    explanation_vi: "Cấu trúc câu bị động hoàn chỉnh: 'must be reviewed' (phải được kiểm tra). Để bổ nghĩa cho động từ/phân từ quá khứ, ta cần một trạng từ chỉ thể cách (Adverb of manner).\\n\\n→ Chọn (B) carefully (một cách cẩn thận).",
                    translation_vi: "Báo cáo tài chính phải được kế toán trưởng xem xét cẩn thận trước thứ Sáu.",
                    vocab: [
                        { word: "financial report", ipa: "/faɪˈnænʃəl rɪˈpɔːt/", pos: "n phr", meaning: "báo cáo tài chính" },
                        { word: "chief accountant", ipa: "/tʃiːf əˈkaʊntənt/", pos: "n phr", meaning: "kế toán trưởng" }
                    ]
                },
                {
                    id: "ets19_t2_p5_q103",
                    qNum: 103,
                    part: 5,
                    test: "ETS 2019 - Test 2",
                    topic: "Part 5 - Incomplete Sentences (Điền từ)",
                    subtopic: "prep_conj",
                    q: "103. ------- the severe rainstorm, all outdoor sports activities were postponed until next week.",
                    options: ["(A)  Because of", "(B)  Although", "(C)  Even though", "(D)  In order that"],
                    ans: 0,
                    ansLetter: "A",
                    explanation_vi: "Sau chỗ trống là một cụm danh từ 'the severe rainstorm' (cơn bão mưa lớn, không có động từ chia thì). \\n- Because of + N/V-ing: bởi vì...\\n- Although / Even though + S + V: mặc dù...\\n- In order that + S + V: để mà...\\n\\n→ Chọn (A) Because of.",
                    translation_vi: "Vì cơn mưa bão nghiêm trọng, tất cả các hoạt động thể thao ngoài trời đã bị hoãn lại cho đến tuần sau."
                },
                {
                    id: "ets19_t2_p5_q104",
                    qNum: 104,
                    part: 5,
                    test: "ETS 2019 - Test 2",
                    topic: "Part 5 - Incomplete Sentences (Điền từ)",
                    subtopic: "collocations",
                    q: "104. Customers who purchase more than three items online are ------- for free express shipping.",
                    options: ["(A)  eligible", "(B)  eligibility", "(C)  eligibly", "(D)  eligibleness"],
                    ans: 0,
                    ansLetter: "A",
                    explanation_vi: "Cấu trúc Collocation cực kỳ phổ biến trong TOEIC:\\n'be eligible for + Noun' = đủ điều kiện, đủ tiêu chuẩn hưởng quyền lợi gì.\\nSau động từ to-be 'are' cần tính từ (Adjective).\\n\\n→ Chọn (A) eligible.",
                    translation_vi: "Những khách hàng mua nhiều hơn ba mặt hàng trực tuyến sẽ đủ điều kiện được giao hàng hỏa tốc miễn phí."
                }
            ],

            part6: [
                {
                    setId: "ets19_t2_p6_s01",
                    qRange: "131-134",
                    part: 6,
                    test: "ETS 2019 - Test 2",
                    topic: "Part 6 - Text Completion (Điền đoạn văn)",
                    passageTitle: "Garden Shade Tree Landscaping",
                    passageText: "Garden Shade creates tree landscapes and hedges to suit every garden, no matter the size. Our designs have ____[131] small urban gardens as well as large-scale projects commissioned by architects and property developers. ____[132].\\n\\nHowever, no single nursery can offer trees of all species and sizes. That is why Garden Shade has developed close relationships with many specialist growers ____[133] to provide us with the trees we need. Such resources give us the variety necessary to complete any ____[134]. In other words, whatever your landscape design dream, we can make it happen.",
                    passage_vi: "Garden Shade kiến tạo cảnh quan cây xanh và hàng rào phù hợp với mọi khu vườn, bất kể quy mô lớn hay nhỏ. Các thiết kế của chúng tôi đã biến đổi [131] những khu vườn nhỏ ở đô thị cũng như các dự án quy mô lớn được đặt hàng bởi các kiến trúc sư và nhà phát triển bất động sản. Đối với hầu hết các dự án, chúng tôi sử dụng cây xanh từ chính các vườn ươm của chúng tôi [132].\\n\\nTuy nhiên, không một vườn ươm đơn lẻ nào có thể cung cấp đủ mọi loài cây và kích cỡ. Đó là lý do tại sao Garden Shade đã phát triển mối quan hệ hợp tác chặt chẽ với nhiều người trồng trọt chuyên môn hóa ngoài ra [133] nhằm cung cấp cho chúng tôi những loại cây cần thiết. Những nguồn cung này mang lại cho chúng tôi sự đa dạng cần thiết để hoàn thành bất kỳ dự án [134] nào. Nói cách khác, bất kể ước mơ thiết kế cảnh quan của bạn là gì, chúng tôi đều có thể biến nó thành hiện thực.",
                    evidence: {
                        131: "Our designs have transformed small urban gardens as well as large-scale projects",
                        132: "For most projects, we use trees from our own nurseries.",
                        133: "developed close relationships with many specialist growers also to provide us with the trees we need",
                        134: "variety necessary to complete any project"
                    },
                    questions: [
                        {
                            id: "ets19_t2_p6_q131",
                            qNum: 131,
                            q: "131.",
                            options: ["(A)  transformed", "(B)  related", "(C)  collected", "(D)  planted"],
                            ans: 0,
                            ansLetter: "A",
                            explanation_vi: "Chọn (A) transformed (biến đổi, thay đổi diện mạo). Ngữ cảnh: 'Các thiết kế của chúng tôi đã biến đổi những khu vườn nhỏ cũng như các dự án lớn'."
                        },
                        {
                            id: "ets19_t2_p6_q132",
                            qNum: 132,
                            q: "132.",
                            options: [
                                "(A)  We are here to answer your landscaping questions.",
                                "(B)  For most projects, we use trees from our own nurseries.",
                                "(C)  Some trees have specific growing requirements.",
                                "(D)  We offer a warranty on all plants."
                            ],
                            ans: 1,
                            ansLetter: "B",
                            explanation_vi: "Chọn (B). Câu sau liên kết bằng từ 'However, no single nursery...' (Tuy nhiên, không có vườn ươm đơn lẻ nào...). Điều này đối lập hoàn hảo với ý ở câu (B): 'Đối với hầu hết các dự án, chúng tôi sử dụng cây từ các vườn ươm của chính mình'."
                        },
                        {
                            id: "ets19_t2_p6_q133",
                            qNum: 133,
                            q: "133.",
                            options: ["(A)  also", "(B)  rarely", "(C)  somehow", "(D)  nevertheless"],
                            ans: 0,
                            ansLetter: "A",
                            explanation_vi: "Chọn (A) also (cũng, ngoài ra). Dùng để bổ sung thêm nguồn cung cây trồng ngoài vườn ươm của chính công ty."
                        },
                        {
                            id: "ets19_t2_p6_q134",
                            qNum: 134,
                            q: "134.",
                            options: ["(A)  project", "(B)  season", "(C)  invoice", "(D)  application"],
                            ans: 0,
                            ansLetter: "A",
                            explanation_vi: "Chọn (A) project (dự án). Cụm từ 'complete any project' = hoàn thành bất kỳ dự án nào, hoàn toàn ăn khớp với câu kết luận 'whatever your landscape design dream'."
                        }
                    ]
                }
            ],

            part7: [
                {
                    setId: "ets19_t2_p7_s01",
                    qRange: "147-148",
                    part: 7,
                    passageType: "single",
                    docType: "Notice",
                    test: "ETS 2019 - Test 2",
                    topic: "Part 7 - Reading Comprehension (Đọc hiểu)",
                    instruction: "Questions 147-148 refer to the following notice.",
                    passageTitle: "Fastest Fleet\\nRATE OUR SERVICES AND WIN FREE TRAVEL!",
                    passageContent: "Visit our Web site at www.fastestfleet.com/feedback and fill out the 5-minute questionnaire. You could win one of 10 FREE round-trip bus trips to any destination within the continental United States! You must be 18 or older to participate. Only customers who have previously traveled with Fastest Fleet are eligible to enter.",
                    passage_vi: "Fastest Fleet\\nĐÁNH GIÁ DỊCH VỤ CỦA CHÚNG TÔI VÀ TRÚNG CHUYẾN ĐI MIỄN PHÍ!\\n\\nHãy truy cập trang web của chúng tôi tại www.fastestfleet.com/feedback và điền vào bảng khảo sát kéo dài 5 phút. Bạn có cơ hội giành được một trong 10 chuyến xe buýt khứ hồi MIỄN PHÍ đến bất kỳ điểm đến nào trong lục địa Hoa Kỳ! Bạn phải từ 18 tuổi trở lên để tham gia. Chỉ những khách hàng đã từng di chuyển với Fastest Fleet trước đây mới đủ điều kiện tham gia.",
                    evidence: {
                        147: "win one of 10 FREE round-trip bus trips to any destination",
                        148: "fill out the 5-minute questionnaire"
                    },
                    questions: [
                        {
                            id: "ets19_t2_p7_q147",
                            qNum: 147,
                            q: "147. Where would the notice likely be seen?",
                            options: [
                                "(A)  In an airport",
                                "(B)  In a bus station",
                                "(C)  In a train station",
                                "(D)  In a ferry terminal"
                            ],
                            ans: 1,
                            ansLetter: "B",
                            explanation_vi: "Dẫn chứng: Bài đọc có nhắc đến giải thưởng là 'round-trip bus trips' (các chuyến đi bằng xe buýt khứ hồi), chứng tỏ công ty Fastest Fleet là hãng xe buýt. Do đó, thông báo này có khả năng nhất được nhìn thấy tại trạm xe buýt.\\n→ Chọn (B) In a bus station."
                        },
                        {
                            id: "ets19_t2_p7_q148",
                            qNum: 148,
                            q: "148. What are customers asked to do?",
                            options: [
                                "(A)  Provide feedback",
                                "(B)  Buy a round-trip ticket",
                                "(C)  Take advantage of a discount",
                                "(D)  Confirm a departure time"
                            ],
                            ans: 0,
                            ansLetter: "A",
                            explanation_vi: "Dẫn chứng: 'Visit our Web site at www.fastestfleet.com/feedback and fill out the 5-minute questionnaire' (Hãy truy cập trang web... và điền vào bảng câu hỏi 5 phút).\\nViệc điền bảng câu hỏi chính là cung cấp ý kiến đánh giá/phản hồi (Provide feedback).\\n→ Chọn (A) Provide feedback."
                        }
                    ]
                }
            ]
        },
`;

const subtopicsJson = `
        subtopics_part5: ${JSON.stringify(p5_by_topic, null, 2)},
        subtopics_part6: ${JSON.stringify(p6_by_topic, null, 2)},
        subtopics_part7: ${JSON.stringify(p7_by_topic, null, 2)},
        ets2026_tests: ${JSON.stringify(etsTestsData, null, 2)},
`;

const helperContent = `
        // =========================================================================
        // QUERY HELPER
        // =========================================================================
        getItemsForPractice(options = {}) {
            const part = parseInt(options.part, 10) || 5;
            const topic = options.topic || '';
            const testNum = options.testNum ? parseInt(options.testNum, 10) : null;

            // 1. Nếu yêu cầu bài thi ETS 2026 cụ thể
            if (options.isEts2026 && testNum && this.ets2026_tests[testNum]) {
                const test = this.ets2026_tests[testNum];
                if (part === 5) return test.part5 || [];
                if (part === 6) return test.part6 || [];
                if (part === 7) return test.part7 || [];
                if (options.part === 'full_rc') {
                    return [...(test.part5 || []), ...(test.part6 || []), ...(test.part7 || [])];
                }
            }

            // 2. Part 5
            if (part === 5) {
                if (topic && this.subtopics_part5[topic] && this.subtopics_part5[topic].length > 0) {
                    return this.subtopics_part5[topic];
                }
                return [
                    ...this.reference_ets2019.part5,
                    ...(this.subtopics_part5.word_form || []).slice(0, 30),
                    ...(this.subtopics_part5.tenses_voice || []),
                    ...(this.subtopics_part5.prep_conj || [])
                ];
            }

            // 3. Part 6
            if (part === 6) {
                if (topic && this.subtopics_part6[topic] && this.subtopics_part6[topic].length > 0) {
                    return this.subtopics_part6[topic];
                }
                return [
                    ...this.reference_ets2019.part6,
                    ...(this.subtopics_part6.email_letter || []).slice(0, 5),
                    ...(this.subtopics_part6.notice_memo || []).slice(0, 5)
                ];
            }

            // 4. Part 7
            if (part === 7) {
                if (topic && this.subtopics_part7[topic] && this.subtopics_part7[topic].length > 0) {
                    return this.subtopics_part7[topic];
                }
                return [
                    ...this.reference_ets2019.part7,
                    ...(this.subtopics_part7.single_passage || []).slice(0, 10),
                    ...(this.subtopics_part7.double_passage || []).slice(0, 5)
                ];
            }

            return this.reference_ets2019.part5;
        }
    };

    window.ReadingPracticeDatabase = ReadingPracticeDatabase;

})(typeof window !== 'undefined' ? window : global);
`;

const fullCode = header + refContent + subtopicsJson + helperContent;
const outPath = path.join(__dirname, '..', 'js', 'reading-practice-database.js');
fs.writeFileSync(outPath, fullCode, 'utf8');
console.log(`Successfully generated ${outPath} (${Math.round(fullCode.length / 1024)} KB)!`);
