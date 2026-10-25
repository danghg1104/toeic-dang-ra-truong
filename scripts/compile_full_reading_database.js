const fs = require('fs');
const path = require('path');

const etsDir = path.join(__dirname, '..', 'data', 'ets2026');
const allP5 = [];
const allP6 = [];
const allP7 = [];

const prepWords = ['although','because','despite','in spite of','during','while','unless','since','until','before','after','with','for','on','at','in','to','from','between','among','across','through','into','within','without','by','prior to','as well as','provided that'];

for (let i = 1; i <= 10; i++) {
    const f = path.join(etsDir, `test${String(i).padStart(2, '0')}_full.json`);
    if (!fs.existsSync(f)) continue;
    const testData = JSON.parse(fs.readFileSync(f, 'utf8'));
    const reading = testData.reading || {};

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

        allP5.push({
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
            explanation_vi: q.explanation_vi || 'Cấu trúc câu chuẩn bài thi TOEIC ETS.',
            translation_vi: q.translation_vi || ''
        });
    });

    // Part 6
    (reading.part6 || []).forEach(s => {
        allP6.push({
            setId: s.setId,
            part: 6,
            test: `ETS 2026 - Test ${String(i).padStart(2, '0')}`,
            topic: s.topic,
            qRange: s.qRange,
            passageText: s.passage_vi || '',
            passage_vi: s.passage_vi || '',
            questions: s.questions || []
        });
    });

    // Part 7
    (reading.part7 || []).forEach(q => {
        allP7.push({
            id: q.id,
            qNum: q.qNum,
            part: 7,
            test: `ETS 2026 - Test ${String(i).padStart(2, '0')}`,
            topic: q.topic,
            q: q.q,
            options: q.options,
            ans: q.ans,
            ansLetter: q.ansLetter || ['A','B','C','D'][q.ans],
            explanation_vi: q.explanation_vi || ''
        });
    });
}

console.log(`Parsed total: ${allP5.length} Part 5, ${allP6.length} Part 6 sets, ${allP7.length} Part 7 questions.`);
