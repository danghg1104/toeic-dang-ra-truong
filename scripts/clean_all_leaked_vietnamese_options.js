const fs = require('fs');
const path = require('path');

console.log('--- Cleaning Leaked Vietnamese & OCR Fragments from All 10 Tests ---');

function isVietnamese(str) {
    return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(str);
}

function cleanOptionText(text) {
    if (!text) return '';
    let s = text.trim();
    // Remove leading letter label
    s = s.replace(/^[A-D][\.\)]\s*/i, '');
    // Remove leaked "Chọn..." or "Chọn (A)..."
    s = s.replace(/\s*Chọn\s*\(?[A-D]?\)?.*$/i, '');
    // Remove OCR headers like ETS 2036...
    s = s.replace(/ETS\s*20\d\d.*$/i, '');
    // Remove page breaks like -- 22 of 70 --
    s = s.replace(/--\s*\d+\s*of\s*\d+\s*--.*$/i, '');
    // Remove trailing single answer letter e.g. " fees    C   Mục đích..."
    s = s.replace(/\s+[A-D]\s+.*$/i, (match) => {
        // If the match contains Vietnamese, strip it
        if (isVietnamese(match)) return '';
        return match;
    });
    // If text still contains Vietnamese, find where the first Vietnamese character/word starts and cut it off if preceding is English
    const viMatch = s.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i);
    if (viMatch) {
        // Look backwards for where the Vietnamese sentence/clause started
        const viIdx = viMatch.index;
        const prefix = s.slice(0, viIdx);
        // Find last period, question mark, or 2+ spaces before Vietnamese
        const lastPunct = Math.max(prefix.lastIndexOf('.'), prefix.lastIndexOf('?'), prefix.lastIndexOf('!'));
        if (lastPunct > 0 && lastPunct >= prefix.length - 30) {
            s = prefix.slice(0, lastPunct + 1).trim();
        } else {
            // Cut at last multi-space or word boundary
            const words = prefix.trim().split(/\s+/);
            if (words.length >= 2) {
                // If the last word is a lone letter like "C" or "B", drop it
                if (words[words.length - 1].match(/^[A-D]$/i)) {
                    words.pop();
                }
                s = words.join(' ').trim();
            }
        }
    }
    // Remove trailing single letter e.g. "fees C"
    s = s.replace(/\s+[A-D]$/i, '');
    return s.replace(/\s+/g, ' ').trim();
}

function extractOptionsFromExplanation(exp) {
    if (!exp) return null;
    const lines = exp.split('\n').map(l => l.trim()).filter(Boolean);
    const options = {};
    let curLetter = null;
    let curText = [];

    for (const l of lines) {
        const m = l.match(/^\(([A-D])\)\s*(.*)/);
        if (m) {
            const letter = m[1].toUpperCase();
            const rest = m[2];
            if (!options[letter] && !isVietnamese(rest)) {
                if (curLetter) options[curLetter] = curText.join(' ').trim();
                curLetter = letter;
                curText = [rest];
            } else if (curLetter) {
                options[curLetter] = curText.join(' ').trim();
                curLetter = null;
            }
        } else if (curLetter) {
            if (!isVietnamese(l) && !l.startsWith('Chọn') && !l.match(/^\(([A-D])\)/)) {
                curText.push(l);
            } else {
                options[curLetter] = curText.join(' ').trim();
                curLetter = null;
            }
        }
    }
    if (curLetter) options[curLetter] = curText.join(' ').trim();

    if (options.A && options.B && options.C && options.D) {
        return ['A', 'B', 'C', 'D'].map(L => {
            const raw = options[L];
            const clean = cleanOptionText(raw);
            return L + '. ' + clean;
        });
    }
    return null;
}

let totalFixed = 0;

for (let t = 1; t <= 10; t++) {
    const filePath = path.join(__dirname, '..', 'data', 'ets2026', `test${String(t).padStart(2, '0')}_full.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    function sanitizeQuestion(q) {
        if (!q || !q.options) return;
        const expectedCount = q.part === 2 ? 3 : 4;
        const letters = ['A', 'B', 'C', 'D'];

        // Check if any option has Vietnamese or leaked fragments
        const hasLeakedVi = q.options.some(opt => isVietnamese(opt) || opt.includes('Chọn') || opt.includes('ETS 2036'));
        if (hasLeakedVi) {
            totalFixed++;
            // Try explanation_vi first
            const fromExp = extractOptionsFromExplanation(q.explanation_vi);
            if (fromExp && fromExp.length === expectedCount && !fromExp.some(o => isVietnamese(o))) {
                q.options = fromExp;
            } else {
                // Sanitize each option string
                q.options = q.options.map((opt, idx) => {
                    const clean = cleanOptionText(opt);
                    return letters[idx] + '. ' + clean;
                });
            }
        } else {
            // Standardize format "A. text"
            q.options = q.options.map((opt, idx) => {
                const clean = cleanOptionText(opt);
                return letters[idx] + '. ' + clean;
            });
        }
    }

    if (data.listening) {
        if (data.listening.part1) data.listening.part1.forEach(sanitizeQuestion);
        if (data.listening.part2) data.listening.part2.forEach(sanitizeQuestion);
        if (data.listening.part3) {
            data.listening.part3.forEach(s => {
                if (s.questions) s.questions.forEach(sanitizeQuestion);
                else sanitizeQuestion(s);
            });
        }
        if (data.listening.part4) {
            data.listening.part4.forEach(s => {
                if (s.questions) s.questions.forEach(sanitizeQuestion);
                else sanitizeQuestion(s);
            });
        }
    }

    if (data.reading) {
        if (data.reading.part5) data.reading.part5.forEach(sanitizeQuestion);
        if (data.reading.part6) {
            data.reading.part6.forEach(s => {
                if (s.questions) s.questions.forEach(sanitizeQuestion);
                else sanitizeQuestion(s);
            });
        }
        if (data.reading.part7) {
            data.reading.part7.forEach(s => {
                if (s.questions) s.questions.forEach(sanitizeQuestion);
                else sanitizeQuestion(s);
            });
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

console.log(`✓ Sanitized options across all 10 tests! (Cleaned ${totalFixed} questions)`);
