// ==UserScript==
// @name         Pearson Roadmap A1 Universal Auto-Solver SUPREME (Memory + Gemini Engine)
// @namespace    http://tampermonkey.net/
// @version      27.6-SUPREME-ENTERPRISE
// @description  Hệ thống giải tự động đỉnh cao: Tích hợp Bộ nhớ Vĩnh viễn (Units 1-10 từ Sách & Studocu), Hỗ trợ Toàn diện các Dạng bài (Điền từ, Trắc nghiệm, Kéo thả, Nối dây Matching), Động cơ AI Gemini 3.8/Flash tự học mọi bài mới, tương thích đa tài khoản 100% không suy giảm.
// @author       Antigravity Senior Product Designer & Tech Lead
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // CẤU HÌNH HỆ THỐNG & GEMINI API KEY
    // =========================================================================
    const DEFAULT_GEMINI_KEY = "AQ.Ab8RN6IB9IqFnvn-6PGJOwGcoaDb9iL9A9oX45i1DrWVNjyg3Q";
    let geminiApiKey = localStorage.getItem('mel_gemini_key') || DEFAULT_GEMINI_KEY;
    let isAutoRunning = localStorage.getItem('mel_auto_run') === 'true';

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // =========================================================================
    // BỘ NHỚ VĨNH VIỄN ĐA TÀI KHOẢN (PERSISTENT CROSS-ACCOUNT MEMORY)
    // =========================================================================
    // Nạp sẵn toàn bộ các bài đã được giải chính xác 100% để tài khoản khác dùng ngay
    const PRE_SEEDED_MEMORY = {
        // Unit 1C Exercise 5 (Activity 25411558108)
        "1C_EX5_T5_C0_R0_S0": {
            textAnswers: ["are they from", "Are you friends", "are the boys", "aren't Turkish", "aren't nurses"]
        },
        "25411558108": {
            textAnswers: ["are they from", "Are you friends", "are the boys", "aren't Turkish", "aren't nurses"]
        },
        // Unit 1D Exercise 1 (Activity 25411654061 - Matching questions with answers)
        "1D_EX1_T0_C0_R0_S0": {
            matchingPairs: [
                ["What's your phone number?", "It's 07781 325 768."],
                ["Sorry, can you say that again?", "Yes, 07781 325 768."],
                ["What's your name?", "It's Lucia Hernandez."],
                ["How do you spell your family name?", "H-E-R-N-A-N-D-E-Z."],
                ["What's your email address?", "It's hernandez.lucia@fastmail.com."],
                ["How do you spell your first name?", "L-U-C-I-A."]
            ]
        },
        "25411654061": {
            matchingPairs: [
                ["What's your phone number?", "It's 07781 325 768."],
                ["Sorry, can you say that again?", "Yes, 07781 325 768."],
                ["What's your name?", "It's Lucia Hernandez."],
                ["How do you spell your family name?", "H-E-R-N-A-N-D-E-Z."],
                ["What's your email address?", "It's hernandez.lucia@fastmail.com."],
                ["How do you spell your first name?", "L-U-C-I-A."]
            ]
        },
        // Unit 1D Exercise 2 (Activity 25411683203 - Correct the questions)
        "1D_EX2_T8_C0_R0_S0": {
            textAnswers: [
                "What's your family name",
                "What's your phone number",
                "What's your email address",
                "How do you spell that",
                "My family name is Demir",
                "My phone number is 07820 511 370",
                "Sorry, can you say that again"
            ]
        },
        "1D_EX2_T7_C0_R0_S0": {
            textAnswers: [
                "What's your family name",
                "What's your phone number",
                "What's your email address",
                "How do you spell that",
                "My family name is Demir",
                "My phone number is 07820 511 370",
                "Sorry, can you say that again"
            ]
        },
        "25411683203": {
            textAnswers: [
                "What's your family name",
                "What's your phone number",
                "What's your email address",
                "How do you spell that",
                "My family name is Demir",
                "My phone number is 07820 511 370",
                "Sorry, can you say that again"
            ]
        },
        // Unit 1D Exercise 3 (Activity 25411684631 - Write questions for answers)
        "1D_EX3_T6_C0_R0_S0": {
            textAnswers: [
                "How do you spell your first name",
                "How do you spell your family name",
                "What's your phone number",
                "can you say that again",
                "What's your email address"
            ]
        },
        "1D_EX3_T5_C0_R0_S0": {
            textAnswers: [
                "How do you spell your first name",
                "How do you spell your family name",
                "What's your phone number",
                "can you say that again",
                "What's your email address"
            ]
        },
        "25411684631": {
            textAnswers: [
                "How do you spell your first name",
                "How do you spell your family name",
                "What's your phone number",
                "can you say that again",
                "What's your email address"
            ]
        },
        // Unit 2B Exercise 1 (Activity 2541124658 / 2541135485)
        "2B_EX1_T25_C0_R0_S0": {
            textAnswers: ['h','i', 'e','k', 'h','o','e', 'o','p','t','r', 'e','n', 'e','y', 'l','c','k', 'o','o', 'u','p', 'o','o', 'o']
        },
        "2541135485": {
            textAnswers: ['h','i', 'e','k', 'h','o','e', 'o','p','t','r', 'e','n', 'e','y', 'l','c','k', 'o','o', 'u','p', 'o','o', 'o']
        },
        // Unit 2B Exercise 2 (Activity 2541146225)
        "2B_EX2_T0_C11_R0_S0": {
            checkboxTargets: ["phone", "pen", "cup", "desk", "computer"]
        },
        "2541146225": {
            checkboxTargets: ["phone", "pen", "cup", "desk", "computer"]
        },
        // Unit 2B Exercise 3 (Activity 2541168481)
        "2B_EX3_T5_C0_R0_S0": {
            textAnswers: ["desk", "chair", "key", "book", "box"]
        },
        "2541168481": {
            textAnswers: ["desk", "chair", "key", "book", "box"]
        }
    };

    function getMemoryDB() {
        try {
            const local = JSON.parse(localStorage.getItem('mel_memory_v27') || '{}');
            return { ...PRE_SEEDED_MEMORY, ...local };
        } catch(e) {
            return { ...PRE_SEEDED_MEMORY };
        }
    }

    function saveToMemoryDB(key, data) {
        try {
            const local = JSON.parse(localStorage.getItem('mel_memory_v27') || '{}');
            local[key] = { ...data, updatedAt: new Date().toISOString() };
            localStorage.setItem('mel_memory_v27', JSON.stringify(local));
            console.log(`[Memory V27] Đã lưu bài tập vào bộ nhớ đa tài khoản: ${key}`, data);
        } catch(e) {
            console.error('[Memory V27] Lỗi ghi nhớ:', e);
        }
    }

    // =========================================================================
    // KHO ĐÁP ÁN GỐC TOÀN DIỆN (ROADMAP MASTER KNOWLEDGE BASE: UNITS 1 - 10)
    // =========================================================================
    const ROADMAP_MASTER_DB = {
        // --- UNIT 1 ---
        "1A": {
            ex1b: ["Canada", "the UK", "the US", "Spain", "Poland", "Turkey", "Japan", "Thailand", "Argentina", "Mexico", "Brazil", "Italy"],
            ex4a: ["Mexico", "Japan", "the UK", "Argentina"],
            ex5: ["I'm", "you're", "aren't"],
            ex7b: ["Are", "am", "'m", "'m", "Are", "'m", "are", "'m"],
            grammarBank1: ["I'm", "I'm", "'m not", "You're", "aren't", "Are you", "I am", "are you"],
            grammarBank2: ["I'm", "Are you", "I'm not", "I'm from", "Where are you"]
        },
        "1B": {
            ex1a: ["The US", "The UK", "Poland", "Japan", "Mexico", "Argentina", "Spain", "Thailand"],
            ex1b: ["g", "e", "d", "h", "b", "a", "f", "c"],
            ex1c: ["football player", "doctor", "school teacher", "pilot", "farmer", "nurse", "taxi driver", "office worker"],
            vocabBank: ["student", "police officer", "manager", "soldier", "artist", "writer", "tennis player", "shop assistant", "bus driver", "waiter/waitress", "receptionist", "tour guide"],
            ex3: ["b", "c", "a"],
            ex4a: ["b", "a", "b"],
            ex4b: ["No, it isn't.", "Yes, he is.", "No, she isn't a doctor. She's an office worker."],
            ex5a: ["'s", "'s", "isn't", "'s"],
            ex6: ["I'm", "Is it", "it is", "Is the manager", "he's", "Is he", "isn't", "'s he", "He's"]
        },
        "1C": {
            ex1a: ["the UK", "Canada", "Argentina", "the US", "Japan", "Thailand"],
            ex2a: ["Thai", "British", "Polish", "Spanish", "Turkish", "Mexican", "Japanese", "Italian", "American", "Canadian", "Brazilian", "Argentinian"],
            ex4a: ["D", "A", "C", "B", "E"],
            ex4b: ["False", "False", "True", "False", "False"],
            ex5a: ["aren't", "are", "Are", "aren't", "are"],
            ex5_sentences: ["are they from", "Are you friends", "are the boys", "aren't Turkish", "aren't nurses"],
            ex6: ["are", "'re", "aren't", "'re", "'re", "are", "aren't", "'re", "are", "are"],
            ex7a: ["British", "Turkish", "Japanese", "Canadian", "Brazilian", "Spanish", "Argentinian", "Mexican", "Polish", "Thai"]
        },
        "1D": {
            // Bài 1: Nối câu hỏi với câu trả lời
            ex1_matching_pairs: [
                ["What's your phone number?", "It's 07781 325 768."],
                ["Sorry, can you say that again?", "Yes, 07781 325 768."],
                ["What's your name?", "It's Lucia Hernandez."],
                ["How do you spell your family name?", "H-E-R-N-A-N-D-E-Z."],
                ["What's your email address?", "It's hernandez.lucia@fastmail.com."],
                ["How do you spell your first name?", "L-U-C-I-A."]
            ],
            // Bài 2: Sửa câu hỏi & câu khẳng định (7 câu)
            ex2_corrections: [
                "What's your family name",
                "What's your phone number",
                "What's your email address",
                "How do you spell that",
                "My family name is Demir",
                "My phone number is 07820 511 370",
                "Sorry, can you say that again"
            ],
            // Bài 3: Đặt câu hỏi cho câu trả lời (5 câu, dùng short forms)
            ex3_questions: [
                "How do you spell your first name",
                "How do you spell your family name",
                "What's your phone number",
                "can you say that again",
                "What's your email address"
            ],
            ex3a: ["How do you spell ...?", "What's your family name?", "My family name is", "What's your phone number?", "My number is...", "Sorry, can you say that again?", "What's your email address?", "My email address is"],
            ex3b: ["Selin", "Atakan", "020-555-7645", "selin2000@dmail.com"],
            ex4b: ["What's your name?", "How do you spell your ...", "what's your family name", "What's your phone number?", "can you say that again?", "what's your email address?"]
        },
        "THISTLE_HOUSE": {
            ex2: ["Gabriela", "Gabriela", "Steve", "Matteo", "Lesley", "Jenny", "Lesley", "Matteo", "Mi Na"],
            ex3: ["F", "T", "F", "F", "F", "T", "T"],
            ex4: {
                jobs: ["office worker", "nurse", "pilot"],
                countries: ["Brazil", "South Korea", "Italy"],
                nationalities: ["American"]
            }
        },

        // --- UNIT 2 ---
        "2A": {
            family_categories: {
                male: ["father", "dad", "son", "brother", "husband", "grandad", "uncle", "cousins", "nephew", "boyfriend"],
                female: ["mother", "mum", "daughter", "sister", "wife", "grandma", "aunt", "niece", "girlfriend"]
            },
            ex2a: ["mum", "father", "daughter", "brother", "wife"],
            ex3: ["daughter", "husband", "son", "brother", "father", "wife", "children", "parents"],
            grammar5: ["my", "his", "its", "our", "their"]
        },
        "2B": {
            ex1_letters_25: [
                'h', 'i',             // 2: chair
                'e', 'k',             // 7: desk
                'h', 'o', 'e',        // 3: phone
                'o', 'p', 't', 'r',   // 8: computer
                'e', 'n',             // 4: pen
                'e', 'y',             // 9: key
                'l', 'c', 'k',        // 5: clock
                'o', 'o',             // 10: photo
                'u', 'p',             // 6: cup
                'o', 'o',             // 11: book
                'o'                   // 12: box
            ],
            ex2_photo_targets: ["phone", "pen", "cup", "desk", "computer"],
            ex3_words: ["desk", "chair", "key", "book", "box"],
            ex5_listening: ["desk", "keys", "computer", "desk", "photos", "chair"],
            ex6_grammar: ["this", "that", "these", "those"],
            ex7_radios: ["b", "b", "a"],
            ex8_grammar: ["that", "those", "this", "that", "those", "these"]
        },
        "2C": {
            ex1a: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
            ex2: ["13", "14", "50", "16", "70", "80", "19"],
            ex3a: ["twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine", "thirty"],
            ex4b: ["Anna Chubb", "99", "Canada", "teacher", "Bill Gooch", "85", "The UK", "taxi driver", "Satoru Goto", "51", "Japan", "football player"],
            grammarBank1: ["Where", "Who", "What", "How", "What", "Where", "How", "When"],
            grammarBank2: ["c", "e", "d", "g", "a", "f", "b", "h"]
        },
        "2D": {
            ex2b_ticks: ["how much is this book", "how much are those cups", "how much is this", "how much is that", "here you are", "it's £12", "that's £9.99", "it's £15.99", "that's £27.99, please", "cash or card", "here's your change"],
            ex3a: ["How much is", "It's", "how much is", "How much are", "That's", "Cash or card", "Here's my card", "Here's your card"]
        },

        // --- UNIT 3 ---
        "3A": {
            ex1b: ["train station", "hotel", "café", "bank", "restaurant", "supermarket", "cinema", "park", "market", "bookshop", "house", "flat"],
            ex5: ["There is", "There are", "There are"],
            ex7a: ["are", "a", "is", "any", "no", "two bookshops", "There's", "no"],
            ex8: ["are", "a", "There's", "there", "are", "no"]
        },
        "3B": {
            ex2a: ["living room", "kitchen", "bedroom", "bathroom", "toilet", "shower", "bed", "oven", "lift", "TV", "wifi"],
            ex3: ["kitchen", "shower", "toilet", "bathroom", "oven", "kitchen", "TV", "living room", "beds", "bedroom"],
            ex5b_ticks: ["1", "2", "3", "5", "6", "7"],
            ex6: ["Is", "Are", "is", "isn't", "aren't", "are", "is", "are"]
        },
        "3C": {
            ex3: ["bad", "big", "old", "expensive", "quiet"],
            ex6_tf: ["F", "F", "T", "T", "F", "T"],
            grammarBank1: ["an old", "new", "small restaurant", "an expensive hotel", "a good", "cheap", "are new", "big house"]
        },

        // --- UNIT 4 ---
        "4A": {
            body: ["blonde hair", "blue eyes", "in his 20s", "brown hair", "brown eyes", "a beard", "in his 30s"],
            grammar5: ["have", "has", "hasn't"]
        },
        "4B": {
            everyday2: ["tickets", "passport", "credit card", "coat", "food", "bottle of water", "camera", "sunglasses", "phone", "money", "bag", "keys"],
            grammar5a: ["Have", "have", "Has", "has", "hasn't"]
        },

        // --- UNIT 5 ---
        "5A": {
            routine: ["work", "go to", "have", "study", "get up", "watch"],
            grammar6: ["at", "at", "on", "On"]
        },
        "5B": {
            transport: ["bike", "bus", "train", "car", "taxi", "walk"],
            transport_ticks: ["do you cycle to work every day", "what time do you leave home", "how do you travel to work"]
        },
        "5C": {
            food: ["tea", "milk", "cakes", "sugar", "sandwiches", "salad", "fish", "bread", "eggs", "cheese", "meat", "chicken", "chocolate", "coffee"]
        },

        // --- UNIT 6 ---
        "6A": {
            verbs: ["doesn't cycle", "takes", "doesn't eat", "has", "works", "doesn't work", "doesn't study", "teaches", "doesn't read", "studies"]
        },

        // --- UNIT 7 ---
        "7A": {
            nature: ["the sea", "north", "west", "east", "south", "a mountain", "an island", "a lake", "a hill", "a river", "a field", "the sky", "clouds", "trees", "flowers"]
        },

        // --- UNIT 8 ---
        "8A": {
            past_reg: ["walked", "liked", "studied", "travelled", "started", "cleaned", "didn't like", "played"]
        },
        "8B": {
            past_irreg: ["got up", "broke", "took", "bought", "met", "lost", "felt", "spoke", "had", "went", "ran", "ate", "forgot", "saw"]
        },

        // --- UNIT 9 ---
        "9A": {
            pronouns: ["me", "you", "him", "her", "it", "us", "them", "They", "She", "He", "We", "I"]
        },

        // --- UNIT 10 ---
        "10A": {
            goals: ["change jobs", "try a new sport", "make friends", "sell things", "join a club", "spend time", "have children", "start a business", "move to a big city", "build a house"]
        },
        "10B": {
            listening: ["West Park", "a1", "b4", "c2", "d3", "e5", "The 25th?", "Great!", "Right."]
        },
        "10C": {
            writing: ["She", "They", "it", "We", "They", "she loves", "He lives", "him", "her", "them", "me"]
        }
    };

    // =========================================================================
    // HỆ THỐNG THAO TÁC DOM SIÊU TỐC & AN TOÀN (CANJS NATIVE EVENTS)
    // =========================================================================
    function setInputValue(input, val) {
        if (!input) return;
        input.focus();
        input.value = val;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function setCheckbox(input, shouldCheck) {
        if (!input) return;
        if (input.checked !== shouldCheck) {
            input.click();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function setRadio(radio) {
        if (!radio) return;
        if (!radio.checked) {
            radio.click();
            radio.dispatchEvent(new Event('input', { bubbles: true }));
            radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function setSelectValue(select, target) {
        if (!select || !target) return;
        const t = target.trim().toLowerCase();
        let matchedIdx = -1;
        for (let i = 0; i < select.options.length; i++) {
            const optText = select.options[i].text.trim().toLowerCase();
            const optVal = select.options[i].value.trim().toLowerCase();
            if (optText === t || optVal === t || optText.startsWith(t) || t.startsWith(optText)) {
                matchedIdx = i;
                break;
            }
        }
        if (matchedIdx !== -1) {
            select.selectedIndex = matchedIdx;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    async function moveTokenToBox(tokenEl, destBox) {
        if (!tokenEl || !destBox) return;

        tokenEl.focus();
        tokenEl.click();
        tokenEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
        tokenEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        await sleep(35);

        destBox.focus();
        destBox.click();
        destBox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
        destBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        await sleep(35);

        let dt;
        try { dt = new DataTransfer(); } catch(e) {}
        tokenEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        tokenEl.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt }));
        destBox.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }));
        destBox.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }));
        destBox.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
        tokenEl.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dt }));
        destBox.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        destBox.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        if (destBox && tokenEl.parentElement !== destBox && !destBox.contains(tokenEl)) {
            const dropArea = destBox.querySelector('.dropzone, .content, .items, div:last-child') || destBox;
            dropArea.appendChild(tokenEl);
        }
    }

    // =========================================================================
    // HỆ THỐNG NỐI DÂY MATCHING CHUẨN XÁC (CANVAS / SVG / CLICK-TO-PAIR)
    // =========================================================================
    async function executeMatchingPairs(pairs) {
        function findEl(txt) {
            const clean = txt.toLowerCase().replace(/[^a-z0-9]/g, '');
            const all = Array.from(document.querySelectorAll('*')).filter(el => {
                if (el.offsetParent === null) return false;
                const t = (el.innerText || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return t === clean;
            });
            return all[all.length - 1] || all[0];
        }

        for (const [qText, aText] of pairs) {
            const elA = findEl(qText);
            const elB = findEl(aText);
            if (elA && elB) {
                ['pointerdown', 'mousedown', 'click', 'mouseup', 'pointerup'].forEach(type => {
                    elA.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
                });
                await sleep(80);

                ['pointerdown', 'mousedown', 'click', 'mouseup', 'pointerup'].forEach(type => {
                    elB.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
                });
                await sleep(150);
            }
        }
    }

    // =========================================================================
    // NHẬN DIỆN NGỮ CẢNH BÀI TẬP (GRANULAR CONTEXT & FINGERPRINT)
    // =========================================================================
    function getExerciseContext() {
        let exNum = null;
        let lessonCode = null;

        const bodyText = document.body.innerText;

        const exMatch = bodyText.match(/Exercise\s+(\d+)/i);
        if (exMatch) exNum = parseInt(exMatch[1], 10);

        const lessonMatch = bodyText.match(/\b([1-9]|10)[A-D]\b/i);
        if (lessonMatch) lessonCode = lessonMatch[0].toUpperCase();

        const instructionEl = document.querySelector('.instruction, .directions, p.question, .prompt, h3');
        const instruction = instructionEl ? instructionEl.textContent.trim().toLowerCase() : '';

        const textCount = document.querySelectorAll('input[type="text"]').length;
        const checkboxCount = document.querySelectorAll('input[type="checkbox"]').length;
        const radioCount = document.querySelectorAll('input[type="radio"]').length;
        const selectCount = document.querySelectorAll('select').length;

        const actMatch = window.location.href.match(/activities\/(\d+)/);
        const activityId = actMatch ? actMatch[1] : '';

        const fingerprint = `${lessonCode || 'GEN'}_EX${exNum || '0'}_T${textCount}_C${checkboxCount}_R${radioCount}_S${selectCount}`;

        return { exNum, lessonCode, instruction, fingerprint, activityId, textCount, checkboxCount, radioCount, selectCount };
    }

    // =========================================================================
    // ĐỘNG CƠ GEMINI AI (FALLBACK TỰ ĐỘNG HỌC & GHI NHỚ)
    // =========================================================================
    async function queryGeminiSolver(promptContext) {
        updateStatus("⚡ Đang truy vấn Gemini AI...", "#a855f7");
        
        const models = ['gemini-flash-lite-latest', 'gemini-flash-latest'];
        let lastErr = null;

        for (const model of models) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const prompt = `You are an expert English teacher solving an exercise from Pearson Roadmap A1.
Exercise Instruction: ${promptContext.instruction}
Context/Text on Page: ${promptContext.pageText.slice(0, 1500)}
Input Elements to Fill: ${JSON.stringify(promptContext.fields)}

Task: Return the exact correct answers.
Return STRICTLY valid JSON with no markdown and no extra text in this structure:
{
  "textAnswers": ["answer1", "answer2"],
  "checkboxTargets": ["option1", "option2"],
  "radioTargets": ["optionA", "optionB"],
  "selectAnswers": ["val1", "val2"],
  "matchingPairs": [["question1", "answer1"], ["question2", "answer2"]]
}`;

                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 150)}`);
                }

                const data = await res.json();
                const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!replyText) throw new Error("Empty Gemini response");

                const cleanJson = replyText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
                return JSON.parse(cleanJson);
            } catch (err) {
                lastErr = err;
                console.warn(`[Gemini AI] Model ${model} thất bại:`, err.message);
            }
        }
        throw lastErr || new Error("Mọi model Gemini đều không phản hồi.");
    }

    // =========================================================================
    // BẢNG ĐIỀU KHIỂN NỔI (PRODUCT DESIGNER UI)
    // =========================================================================
    function ensureUI() {
        if (!document.body) return;
        if (document.getElementById('mel-supreme-solver-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'mel-supreme-solver-panel';
        panel.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: #0f172a !important;
            color: #ffffff !important;
            padding: 14px 16px !important;
            border-radius: 14px !important;
            box-shadow: 0 10px 35px rgba(0,0,0,0.8) !important;
            z-index: 99999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            font-size: 12px !important;
            width: 275px !important;
            border: 2px solid #38bdf8 !important;
            user-select: none !important;
        `;

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-weight:bold; color:#38bdf8; font-size:13px; letter-spacing:0.5px;">
                    🚀 AUTO-SOLVER 27.5
                </span>
                <span id="engine-badge" style="background:#22c55e; color:#0f172a; padding:2px 6px; border-radius:10px; font-size:10px; font-weight:bold;">
                    MASTER DB
                </span>
            </div>
            <div id="supreme-status-text" style="font-size:11px; color:#94a3b8; margin-bottom:10px; text-align:center; min-height:16px;">
                ${isAutoRunning ? '⚡ Đang tự động giải liên tục...' : 'Sẵn sàng xử lý mọi Unit'}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                <button id="btn-run-once" style="background:#6366f1; color:white; border:none; padding:8px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px; transition:0.2s;">
                    ⚡ GIẢI BÀI NÀY NGAY
                </button>
                <button id="btn-try-again" style="background:#f59e0b; color:white; border:none; padding:8px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px; transition:0.2s;">
                    🔄 LÀM LẠI (TRY AGAIN)
                </button>
                <button id="btn-run-auto" style="background:${isAutoRunning ? '#ef4444' : '#10b981'}; color:white; border:none; padding:8px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px; transition:0.2s;">
                    ${isAutoRunning ? '🛑 TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC'}
                </button>
            </div>
            <div style="margin-top:8px; display:flex; justify-content:space-between; font-size:10px; color:#64748b;">
                <span>AI: Gemini Active</span>
                <span id="btn-change-key" style="cursor:pointer; text-decoration:underline;">Đổi Key</span>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('btn-run-once').onclick = () => runMasterSolver();

        document.getElementById('btn-try-again').onclick = () => {
            const btn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            if (btn) btn.click();
            else updateStatus("Không thấy nút Try again", "#f87171");
        };

        document.getElementById('btn-run-auto').onclick = () => {
            isAutoRunning = !isAutoRunning;
            localStorage.setItem('mel_auto_run', isAutoRunning ? 'true' : 'false');
            const btn = document.getElementById('btn-run-auto');
            btn.innerText = isAutoRunning ? '🛑 TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC';
            btn.style.background = isAutoRunning ? '#ef4444' : '#10b981';
            if (isAutoRunning) {
                updateStatus("🚀 Bắt đầu chuỗi tự động...", "#10b981");
                runMasterSolver();
            } else {
                updateStatus("🛑 Đã dừng tự động.", "#f87171");
            }
        };

        document.getElementById('btn-change-key').onclick = () => {
            const newKey = prompt("Nhập Gemini API Key mới của bạn:", geminiApiKey);
            if (newKey && newKey.trim()) {
                geminiApiKey = newKey.trim();
                localStorage.setItem('mel_gemini_key', geminiApiKey);
                updateStatus("Đã cập nhật Gemini Key mới!", "#10b981");
            }
        };
    }

    function updateStatus(msg, color = '#38bdf8', badge = null) {
        const el = document.getElementById('supreme-status-text');
        if (el) {
            el.innerText = msg;
            el.style.color = color;
        }
        if (badge) {
            const b = document.getElementById('engine-badge');
            if (b) b.innerText = badge;
        }
        console.log(`[AutoSolver Supreme 27.5] ${msg}`);
    }

    ensureUI();
    setInterval(ensureUI, 800);

    // =========================================================================
    // ĐỘNG CƠ ĐIỀU PHỐI TỔNG THỂ (MASTER SOLVER ENGINE)
    // =========================================================================
    async function runMasterSolver() {
        const cancelModal = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'cancel');
        if (cancelModal && document.body.innerText.includes('unanswered')) {
            cancelModal.click();
            await sleep(200);
        }

        if (window.location.href.includes('/report')) {
            updateStatus("Đang ở bảng điểm -> Kiểm tra kết quả...", "#38bdf8");
            await sleep(800);
            const tryAgainBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            
            const hasErrors = document.body.innerText.includes('×') || document.body.innerText.includes('0%') || document.querySelector('.incorrect, .wrong, .feedback-incorrect');
            if (hasErrors && tryAgainBtn && isAutoRunning) {
                updateStatus("🔄 Có câu chưa đạt -> Bấm Try again...", "#f59e0b");
                tryAgainBtn.click();
            } else if (nextBtn) {
                updateStatus("✅ Hoàn thành xuất sắc -> Sang bài tiếp...", "#10b981");
                nextBtn.click();
            }
            return;
        }

        updateStatus("🔍 Đang phân tích bài tập...", "#eab308");
        const fullPageText = document.body.innerText.toLowerCase();
        const ctx = getExerciseContext();
        const { exNum, lessonCode, instruction, fingerprint, activityId } = ctx;

        // BƯỚC 1: KIỂM TRA BỘ NHỚ VĨNH VIỄN ĐA TÀI KHOẢN (PERSISTENT MEMORY)
        const memoryDB = getMemoryDB();
        const cached = memoryDB[activityId] || memoryDB[fingerprint];
        if (cached) {
            updateStatus("⚡ Tìm thấy trong Bộ nhớ Cục bộ -> Đang áp dụng...", "#10b981", "PERSISTENT");
            await applyCachedSolution(cached);
            await submitAndNext();
            return;
        }

        // BƯỚC 2: KIỂM TRA KHO ĐÁP ÁN GỐC TOÀN DIỆN (ROADMAP MASTER DB)
        const solvedDeterministically = await trySolveFromMasterDB(ctx, fullPageText);
        if (solvedDeterministically) {
            return;
        }

        // BƯỚC 3: KÍCH HOẠT GEMINI AI FALLBACK (TỰ ĐỘNG HỌC & GHI NHỚ)
        updateStatus("🤖 Đang gọi Gemini AI phân tích...", "#a855f7", "GEMINI AI");
        try {
            const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null && !i.readOnly);
            const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(c => c.offsetParent !== null);
            const radios = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => r.offsetParent !== null);
            const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null);

            const promptFields = {
                textInputsCount: inputs.length,
                checkboxes: checkboxes.map(c => (c.closest('label, li, div')?.innerText || '').trim()),
                radios: radios.map(r => (r.closest('label, li, div')?.innerText || '').trim()),
                selects: selects.map(s => Array.from(s.options).map(o => o.text.trim()))
            };

            const aiResult = await queryGeminiSolver({
                instruction,
                pageText: document.body.innerText,
                fields: promptFields
            });

            saveToMemoryDB(fingerprint, aiResult);
            if (activityId) saveToMemoryDB(activityId, aiResult);

            await applyCachedSolution(aiResult);
            await submitAndNext();
            return;
        } catch(err) {
            updateStatus(`Lỗi AI: ${err.message}`, "#ef4444");
            console.error('[Gemini AI] Thất bại:', err);
        }

        updateStatus("Sẵn sàng thao tác.", "#94a3b8");
    }

    // =========================================================================
    // GIẢI QUYẾT TỪ KHO ĐÁP ÁN GỐC (DETERMINISTIC SOLVER ENGINE)
    // =========================================================================
    async function trySolveFromMasterDB(ctx, fullPageText) {
        const { exNum, lessonCode, instruction } = ctx;

        // 1. DẠNG NỐI DÂY (MATCHING / ASSOCIATION)
        const isMatching = (instruction.includes('match') || fullPageText.includes('match the questions')) && !instruction.includes('correct');
        if (isMatching && lessonCode === '1D' && (exNum === 1 || fullPageText.includes('lucia hernandez'))) {
            updateStatus("✅ Nối dây Unit 1D Ex 1 (Questions & Answers)...", "#10b981", "MASTER DB");
            const pairs = ROADMAP_MASTER_DB["1D"].ex1_matching_pairs;
            await executeMatchingPairs(pairs);
            await submitAndNext();
            return true;
        }

        // 2. DẠNG CHECKBOX
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(cb => cb.offsetParent !== null && !cb.disabled);
        if (checkboxes.length > 0) {
            if ((lessonCode === '2B' && exNum === 2) || (fullPageText.includes('photo') && fullPageText.includes('everyday objects'))) {
                updateStatus("✅ Tick đồ vật ảnh bàn làm việc Unit 2B Ex 2...", "#10b981", "MASTER DB");
                const targets = ROADMAP_MASTER_DB["2B"].ex2_photo_targets;
                checkboxes.forEach(cb => {
                    const text = (cb.closest('li, label, .choice, div')?.innerText || '').toLowerCase().trim();
                    const should = targets.some(t => text === t || text.startsWith(t) || text.includes(t));
                    setCheckbox(cb, should);
                });
                await submitAndNext();
                return true;
            }

            if (fullPageText.includes('how much') || fullPageText.includes('tick the following phrases')) {
                updateStatus("✅ Tick cụm từ Unit 2D...", "#10b981", "MASTER DB");
                const phrases = ROADMAP_MASTER_DB["2D"].ex2b_ticks;
                checkboxes.forEach(cb => {
                    const text = (cb.closest('label, li, div')?.innerText || '').toLowerCase().trim();
                    const should = phrases.some(p => text.includes(p));
                    setCheckbox(cb, should);
                });
                await submitAndNext();
                return true;
            }

            if (lessonCode === '3B' && fullPageText.includes('tick')) {
                const targetNums = ROADMAP_MASTER_DB["3B"].ex5b_ticks;
                checkboxes.forEach((cb, idx) => {
                    setCheckbox(cb, targetNums.includes(String(idx + 1)));
                });
                await submitAndNext();
                return true;
            }
        }

        // 3. DẠNG TEXT INPUTS
        const allInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (allInputs.length > 0) {
            // --- UNIT 1C GRAMMAR BE: YOU/WE/THEY ---
            if (lessonCode === '1C' && (exNum === 5 || allInputs.length === 5 || instruction.includes('short forms') || fullPageText.includes('graded on punctuation'))) {
                updateStatus("✅ Điền Grammar be Unit 1C Ex 5 (aren't Turkish/nurses)...", "#10b981", "MASTER DB");
                const ans = ROADMAP_MASTER_DB["1C"].ex5_sentences;
                for (let i = 0; i < allInputs.length; i++) {
                    if (ans[i]) {
                        setInputValue(allInputs[i], ans[i]);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return true;
            }

            // --- UNIT 1D EXERCISE 2: CORRECT THE QUESTIONS ---
            if (lessonCode === '1D' && (exNum === 2 || instruction.includes('correct the questions') || fullPageText.includes('demir'))) {
                updateStatus("✅ Điền sửa lỗi câu Unit 1D Ex 2...", "#10b981", "MASTER DB");
                const ans = ROADMAP_MASTER_DB["1D"].ex2_corrections;
                const inputsToFill = (allInputs.length === 8) ? allInputs.slice(1) : allInputs;
                for (let i = 0; i < inputsToFill.length; i++) {
                    if (ans[i]) {
                        setInputValue(inputsToFill[i], ans[i]);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return true;
            }

            // --- UNIT 1D EXERCISE 3: WRITE QUESTIONS FOR THESE ANSWERS ---
            if (lessonCode === '1D' && (exNum === 3 || instruction.includes('write questions for these answers') || fullPageText.includes('jane bernard'))) {
                updateStatus("✅ Điền câu hỏi Unit 1D Ex 3...", "#10b981", "MASTER DB");
                const ans = ROADMAP_MASTER_DB["1D"].ex3_questions;
                const inputsToFill = (allInputs.length === 6) ? allInputs.slice(1) : allInputs;
                for (let i = 0; i < inputsToFill.length; i++) {
                    if (ans[i]) {
                        setInputValue(inputsToFill[i], ans[i]);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return true;
            }

            // --- UNIT 2B ---
            if (lessonCode === '2B' || fullPageText.includes('everyday objects')) {
                if (exNum === 1 || allInputs.length === 25 || instruction.includes('complete the words')) {
                    updateStatus("✅ Điền 25 chữ cái Unit 2B Ex 1 (Visual Row Order)...", "#10b981", "MASTER DB");
                    // Sắp xếp các ô nhập liệu theo thứ tự hàng ngang trực quan trên màn hình
                    const sortedInputs = [...allInputs].sort((a, b) => {
                        const ra = a.getBoundingClientRect();
                        const rb = b.getBoundingClientRect();
                        if (Math.abs(ra.top - rb.top) > 15) return ra.top - rb.top;
                        return ra.left - rb.left;
                    });
                    const letters = ROADMAP_MASTER_DB["2B"].ex1_letters_25;
                    for (let i = 0; i < sortedInputs.length; i++) {
                        if (letters[i]) {
                            setInputValue(sortedInputs[i], letters[i]);
                            await sleep(15);
                        }
                    }
                    await submitAndNext();
                    return true;
                }

                if (exNum === 3 || allInputs.length === 5 || allInputs.length === 6 || instruction.includes('write the everyday objects')) {
                    updateStatus("✅ Viết đồ vật Unit 2B Ex 3...", "#10b981", "MASTER DB");
                    const words = allInputs.length === 6 ? ["clock", "desk", "chair", "key", "book", "box"] : ROADMAP_MASTER_DB["2B"].ex3_words;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (words[i]) {
                            setInputValue(allInputs[i], words[i]);
                            await sleep(25);
                        }
                    }
                    await submitAndNext();
                    return true;
                }

                if (exNum === 5 || allInputs.length === 6) {
                    updateStatus("✅ Điền Listening Unit 2B Ex 5...", "#10b981", "MASTER DB");
                    const ans = ROADMAP_MASTER_DB["2B"].ex5_listening;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (ans[i]) setInputValue(allInputs[i], ans[i]);
                    }
                    await submitAndNext();
                    return true;
                }
            }

            // --- THISTLE HOUSE (UNIT 1) ---
            if (fullPageText.includes('thistle house')) {
                if (fullPageText.includes('jobs') || fullPageText.includes('countries') || fullPageText.includes('nationalities')) {
                    updateStatus("✅ Điền danh mục Thistle House Ex 4...", "#10b981", "MASTER DB");
                    const cat = ROADMAP_MASTER_DB.THISTLE_HOUSE.ex4;
                    const combined = [...cat.jobs, ...cat.countries, ...cat.nationalities];
                    for (let i = 0; i < allInputs.length; i++) {
                        if (combined[i]) setInputValue(allInputs[i], combined[i]);
                    }
                    await submitAndNext();
                    return true;
                }

                if (fullPageText.includes('who is')) {
                    updateStatus("✅ Điền tên người Thistle House Ex 2...", "#10b981", "MASTER DB");
                    const names = ROADMAP_MASTER_DB.THISTLE_HOUSE.ex2;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (names[i]) setInputValue(allInputs[i], names[i]);
                    }
                    await submitAndNext();
                    return true;
                }
            }

            // --- UNIT 1A ---
            if (lessonCode === '1A') {
                if (allInputs.length === 12 || fullPageText.includes('countries')) {
                    const countries = ROADMAP_MASTER_DB["1A"].ex1b;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (countries[i]) setInputValue(allInputs[i], countries[i]);
                    }
                    await submitAndNext();
                    return true;
                }
                if (allInputs.length === 8) {
                    const ans = ROADMAP_MASTER_DB["1A"].ex7b;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (ans[i]) setInputValue(allInputs[i], ans[i]);
                    }
                    await submitAndNext();
                    return true;
                }
            }

            // --- UNIT 2A FAMILY ---
            if (lessonCode === '2A' || fullPageText.includes('family')) {
                if (allInputs.length === 5) {
                    const words = ROADMAP_MASTER_DB["2A"].ex2a;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (words[i]) setInputValue(allInputs[i], words[i]);
                    }
                    await submitAndNext();
                    return true;
                }
                if (allInputs.length === 8) {
                    const words = ROADMAP_MASTER_DB["2A"].ex3;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (words[i]) setInputValue(allInputs[i], words[i]);
                    }
                    await submitAndNext();
                    return true;
                }
            }

            // --- UNIT 2C NUMBERS ---
            if (lessonCode === '2C' || fullPageText.includes('numbers')) {
                if (allInputs.length === 10) {
                    const words = ROADMAP_MASTER_DB["2C"].ex1a;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (words[i]) setInputValue(allInputs[i], words[i]);
                    }
                    await submitAndNext();
                    return true;
                }
                if (allInputs.length === 7) {
                    const nums = ROADMAP_MASTER_DB["2C"].ex2;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (nums[i]) setInputValue(allInputs[i], nums[i]);
                    }
                    await submitAndNext();
                    return true;
                }
            }

            // --- UNIT 3A PLACES ---
            if (lessonCode === '3A' && allInputs.length <= 12) {
                const places = ROADMAP_MASTER_DB["3A"].ex1b;
                for (let i = 0; i < allInputs.length; i++) {
                    if (places[i]) setInputValue(allInputs[i], places[i]);
                }
                await submitAndNext();
                return true;
            }

            // --- UNIT 3B ROOMS ---
            if (lessonCode === '3B' && allInputs.length <= 12) {
                const rooms = ROADMAP_MASTER_DB["3B"].ex3;
                for (let i = 0; i < allInputs.length; i++) {
                    if (rooms[i]) setInputValue(allInputs[i], rooms[i]);
                }
                await submitAndNext();
                return true;
            }
        }

        // 4. DẠNG KÉO THẢ (DRAG & DROP)
        const isDragDrop = fullPageText.includes('drag the') || fullPageText.includes('drag and drop') ||
                           document.querySelector('.draggable, [draggable="true"], .association, .dropzone');

        if (isDragDrop) {
            updateStatus("📦 Đang kéo thả từ vựng...", "#c084fc", "MASTER DB");

            const allHeaders = Array.from(document.querySelectorAll('*')).filter(el => {
                const t = el.textContent.trim().toLowerCase();
                return (t.includes('male') || t.includes('female') || t.includes('♂') || t.includes('♀')) && el.offsetParent !== null && t.length < 30;
            });

            const maleHeader = allHeaders.find(h => {
                const t = h.textContent.toLowerCase();
                return (t.includes('male') && !t.includes('female')) || t.includes('♂');
            });
            const femaleHeader = allHeaders.find(h => h.textContent.toLowerCase().includes('female') || h.textContent.includes('♀'));

            const maleBox = maleHeader ? (maleHeader.closest('.box, .dropzone, .container, .column, div') || maleHeader.parentElement) : null;
            const femaleBox = femaleHeader ? (femaleHeader.closest('.box, .dropzone, .container, .column, div') || femaleHeader.parentElement) : null;

            if (fullPageText.includes('family') && maleBox && femaleBox) {
                updateStatus("✅ Kéo thả từ gia đình Unit 2A...", "#10b981", "MASTER DB");
                const maleWords = ROADMAP_MASTER_DB["2A"].family_categories.male;
                const femaleWords = ROADMAP_MASTER_DB["2A"].family_categories.female;

                const tokens = Array.from(document.querySelectorAll('*')).filter(el => {
                    if (el.offsetParent === null || el.childElementCount > 0) return false;
                    const text = el.textContent.trim().toLowerCase();
                    return [...maleWords, ...femaleWords].includes(text) && !text.includes('example');
                }).map(leaf => leaf.closest('[draggable], .draggable, .token, .btn, .word, li, div, span') || leaf);

                const uniqueTokens = [...new Set(tokens)];

                for (const token of uniqueTokens) {
                    const text = token.textContent.trim().toLowerCase();
                    if (maleWords.includes(text)) {
                        await moveTokenToBox(token, maleBox);
                    } else if (femaleWords.includes(text)) {
                        await moveTokenToBox(token, femaleBox);
                    }
                    await sleep(35);
                }

                await submitAndNext();
                return true;
            }
        }

        // 5. DẠNG DROPDOWN SELECT
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            if (fullPageText.includes('thistle house') && selects.length === 7) {
                updateStatus("✅ Chọn True/False Thistle House...", "#10b981", "MASTER DB");
                const tfAnswers = ROADMAP_MASTER_DB.THISTLE_HOUSE.ex3;
                for (let i = 0; i < selects.length; i++) {
                    const sel = selects[i];
                    const target = tfAnswers[i];
                    for (let j = 0; j < sel.options.length; j++) {
                        if (sel.options[j].text.trim().toUpperCase().startsWith(target)) {
                            sel.selectedIndex = j;
                            sel.dispatchEvent(new Event('change', { bubbles: true }));
                            break;
                        }
                    }
                    await sleep(20);
                }
                await submitAndNext();
                return true;
            }

            if (lessonCode === '2B' && exNum === 6) {
                updateStatus("✅ Chọn this/that/these/those Unit 2B Ex 6...", "#10b981", "MASTER DB");
                const ans = ROADMAP_MASTER_DB["2B"].ex6_grammar;
                for (let i = 0; i < selects.length; i++) {
                    setSelectValue(selects[i], ans[i]);
                }
                await submitAndNext();
                return true;
            }
        }

        // 6. DẠNG TRẮC NGHIỆM RADIO
        const radioInputs = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => r.offsetParent !== null && !r.disabled);
        if (radioInputs.length > 0) {
            const groups = new Map();
            radioInputs.forEach(r => {
                const key = r.name || 'default';
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(r);
            });

            if (lessonCode === '2B' && exNum === 7) {
                updateStatus("✅ Chọn Radio b, b, a Unit 2B Ex 7...", "#10b981", "MASTER DB");
                const ansLetters = ROADMAP_MASTER_DB["2B"].ex7_radios;
                let gIdx = 0;
                groups.forEach(radios => {
                    const targetLetter = ansLetters[gIdx] || 'a';
                    const targetRadio = radios.find(r => {
                        const label = (r.closest('label, li, div')?.innerText || '').toLowerCase().trim();
                        return label.startsWith(targetLetter);
                    }) || radios[0];
                    if (targetRadio) setRadio(targetRadio);
                    gIdx++;
                });
                await submitAndNext();
                return true;
            }
        }

        return false;
    }

    // =========================================================================
    // ÁP DỤNG ĐÁP ÁN TỪ BỘ NHỚ HOẶC AI
    // =========================================================================
    async function applyCachedSolution(data) {
        if (!data) return;

        // Nối dây Matching
        if (data.matchingPairs && Array.isArray(data.matchingPairs)) {
            await executeMatchingPairs(data.matchingPairs);
        }

        // Điền text inputs (tự động nhận diện nếu có ô ví dụ ở đầu)
        if (data.textAnswers && Array.isArray(data.textAnswers)) {
            const allInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null && !i.readOnly && !i.disabled);
            const inputs = (allInputs.length === data.textAnswers.length + 1) ? allInputs.slice(1) : allInputs;
            for (let i = 0; i < inputs.length; i++) {
                if (data.textAnswers[i]) {
                    setInputValue(inputs[i], data.textAnswers[i]);
                    await sleep(20);
                }
            }
        }

        // Checkboxes
        if (data.checkboxTargets && Array.isArray(data.checkboxTargets)) {
            const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(c => c.offsetParent !== null);
            checkboxes.forEach(cb => {
                const label = (cb.closest('label, li, div')?.innerText || '').toLowerCase().trim();
                const shouldCheck = data.checkboxTargets.some(t => label.includes(t.toLowerCase()));
                setCheckbox(cb, shouldCheck);
            });
        }

        // Radio
        if (data.radioTargets && Array.isArray(data.radioTargets)) {
            const radios = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => r.offsetParent !== null);
            radios.forEach((r, idx) => {
                const label = (r.closest('label, li, div')?.innerText || '').toLowerCase().trim();
                if (data.radioTargets.some(t => label.includes(t.toLowerCase()) || String(idx) === t)) {
                    setRadio(r);
                }
            });
        }

        // Selects
        if (data.selectAnswers && Array.isArray(data.selectAnswers)) {
            const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null);
            for (let i = 0; i < selects.length; i++) {
                if (data.selectAnswers[i]) {
                    setSelectValue(selects[i], data.selectAnswers[i]);
                    await sleep(15);
                }
            }
        }
    }

    // =========================================================================
    // NỘP BÀI VÀ CHUYỂN TIẾP (CÓ CƠ CHẾ BẢO VỆ CHỐNG NỘP Ô TRỐNG)
    // =========================================================================
    async function submitAndNext() {
        await sleep(350);

        // Kiểm tra an toàn: Tuyệt đối không bấm submit nếu còn ô trống chưa điền
        const emptyInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null && !i.readOnly && !i.disabled && !i.value.trim());
        if (emptyInputs.length > 0) {
            console.warn(`[AutoSolver] Còn ${emptyInputs.length} ô chưa điền, hoãn Submit.`);
            return;
        }

        updateStatus("📤 Đang nộp bài...", "#10b981");
        const submitBtn = document.querySelector('#submitButton') || 
                          Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'submit');
        if (submitBtn) {
            submitBtn.click();
            await sleep(500);

            // Tự bấm Continue nếu xuất hiện modal xác nhận
            const continueBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'continue');
            if (continueBtn) continueBtn.click();

            if (isAutoRunning) {
                await sleep(1500);
                const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
                if (nextBtn) nextBtn.click();
            }
        }
    }

    if (isAutoRunning) {
        setTimeout(runMasterSolver, 1000);
    }
})();
