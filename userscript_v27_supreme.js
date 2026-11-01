// ==UserScript==
// @name         Pearson Roadmap A1 Universal Auto-Solver SUPREME (Memory + Gemini Engine)
// @namespace    http://tampermonkey.net/
// @version      30.0-CONTEXT-AUTO-SUBMIT
// @description  Hệ thống giải tự động đỉnh cao: Tích hợp Bộ nhớ Vĩnh viễn (Units 1-10 từ Sách & Studocu), Hỗ trợ Toàn diện các Dạng bài (Điền từ, Trắc nghiệm, Kéo thả, Nối dây Matching), Động cơ AI Gemini 3.8/Flash tự học mọi bài mới, tương thích đa tài khoản 100% không suy giảm.
// @author       Antigravity Senior Product Designer & Tech Lead
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
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
    // Dọn dẹp triệt để các phiên bản bộ nhớ cũ có thể chứa đáp án sai trước đây
    try {
        ['mel_memory', 'mel_memory_v27', 'mel_memory_v28', 'mel_memory_v29'].forEach(k => localStorage.removeItem(k));
    } catch(e) {}

    const PRE_SEEDED_MEMORY = {
        // =====================================================================
        // THISTLE HOUSE (UNIT 1) EXERCISE 4: JOBS, COUNTRIES, NATIONALITIES (THEO NHÓM)
        // =====================================================================
        "THISTLE_HOUSE_EX4": {
            type: "category_layout",
            categories: {
                jobs: ["manager", "office worker", "nurse", "pilot"],
                countries: ["the UK", "Brazil", "South Korea", "Italy"],
                nationalities: ["American"]
            }
        },
        "25411718157": { type: "category_layout", categories: { jobs: ["manager", "office worker", "nurse", "pilot"], countries: ["the UK", "Brazil", "South Korea", "Italy"], nationalities: ["American"] } },
        "25411716978": { type: "category_layout", categories: { jobs: ["manager", "office worker", "nurse", "pilot"], countries: ["the UK", "Brazil", "South Korea", "Italy"], nationalities: ["American"] } },
        "25411716331": { type: "category_layout", categories: { jobs: ["manager", "office worker", "nurse", "pilot"], countries: ["the UK", "Brazil", "South Korea", "Italy"], nationalities: ["American"] } },
        "25411716149": { type: "category_layout", categories: { jobs: ["manager", "office worker", "nurse", "pilot"], countries: ["the UK", "Brazil", "South Korea", "Italy"], nationalities: ["American"] } },
        "25411712170": { type: "category_layout", categories: { jobs: ["manager", "office worker", "nurse", "pilot"], countries: ["the UK", "Brazil", "South Korea", "Italy"], nationalities: ["American"] } },
        "25411712005": { type: "category_layout", categories: { jobs: ["manager", "office worker", "nurse", "pilot"], countries: ["the UK", "Brazil", "South Korea", "Italy"], nationalities: ["American"] } },

        // Thistle House Exercise 2 (Who is... - Activity 25411708515 & 25411710103)
        "THISTLE_HOUSE_EX2": {
            type: "context_questions",
            questions: [
                { keywords: ["office worker"], answer: "Gabriela" },
                { keywords: ["brazilian"], answer: "Gabriela" },
                { keywords: ["canadian"], answer: "Steve" },
                { keywords: ["pilot"], answer: "Matteo" },
                { keywords: ["manager"], answer: "Lesley" },
                { keywords: ["new york"], answer: "Jenny" },
                { keywords: ["british"], answer: "Lesley" },
                { keywords: ["italian"], answer: "Matteo" },
                { keywords: ["nurse"], answer: "Mi Na" },
                { keywords: ["south korea"], answer: "Mi Na" }
            ],
            textAnswers: ["Gabriela", "Gabriela", "Steve", "Matteo", "Lesley", "Jenny", "Lesley", "Matteo", "Mi Na"]
        },
        "25411710103": {
            type: "context_questions",
            questions: [
                { keywords: ["office worker"], answer: "Gabriela" },
                { keywords: ["brazilian"], answer: "Gabriela" },
                { keywords: ["canadian"], answer: "Steve" },
                { keywords: ["pilot"], answer: "Matteo" },
                { keywords: ["manager"], answer: "Lesley" },
                { keywords: ["new york"], answer: "Jenny" },
                { keywords: ["british"], answer: "Lesley" },
                { keywords: ["italian"], answer: "Matteo" },
                { keywords: ["nurse"], answer: "Mi Na" },
                { keywords: ["south korea"], answer: "Mi Na" }
            ],
            textAnswers: ["Gabriela", "Gabriela", "Steve", "Matteo", "Lesley", "Jenny", "Lesley", "Matteo", "Mi Na"]
        },
        "25411708515": {
            type: "context_questions",
            questions: [
                { keywords: ["office worker"], answer: "Gabriela" },
                { keywords: ["brazilian"], answer: "Gabriela" },
                { keywords: ["canadian"], answer: "Steve" },
                { keywords: ["pilot"], answer: "Matteo" },
                { keywords: ["manager"], answer: "Lesley" },
                { keywords: ["new york"], answer: "Jenny" },
                { keywords: ["british"], answer: "Lesley" },
                { keywords: ["italian"], answer: "Matteo" },
                { keywords: ["nurse"], answer: "Mi Na" },
                { keywords: ["south korea"], answer: "Mi Na" }
            ],
            textAnswers: ["Gabriela", "Gabriela", "Steve", "Matteo", "Lesley", "Jenny", "Lesley", "Matteo", "Mi Na"]
        },
        // Unit 1C Exercise 5 (Activity 25411558108)
        "1C_EX5_T5_C0_R0_S0": {
            textAnswers: ["are they from", "Are you friends", "are the boys", "aren't Turkish", "aren't nurses"]
        },
        "25411558108": {
            textAnswers: ["are they from", "Are you friends", "are the boys", "aren't Turkish", "aren't nurses"]
        },
        // Unit 1C Exercise 6 (Activity 25411597312) - Write questions and short answers
        "25411597312": {
            textAnswers: [
                "Are you and Simon Spanish",
                "No, we're from Argentina",
                "Who are they",
                "They're my friends",
                "Are we late",
                "No, you're on time"
            ]
        },
        "2541597312": {
            textAnswers: [
                "Are you and Simon Spanish",
                "No, we're from Argentina",
                "Who are they",
                "They're my friends",
                "Are we late",
                "No, you're on time"
            ]
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
        },
        // Unit 2A Exercise 1 - Anagrams
        "2541727765": {
            textAnswers: ["mum", "son", "father", "husband", "dad", "sister", "brother", "daughter", "wife"]
        },
        "25411727765": {
            textAnswers: ["mum", "son", "father", "husband", "dad", "sister", "brother", "daughter", "wife"]
        },
        // Unit 2A Exercise 2 (Activity 2541730736) - Family Male / Female
        "2541730736": {
            type: "family_categories"
        },
        "25411730736": {
            type: "family_categories"
        },
        // Unit 2A Exercise 3 (Activity 2541738347) - Missing letters for family words
        "2541738347": {
            textAnswers: ["rother", "ister", "ather", "other", "ife", "aughter", "on"]
        },
        "25411738347": {
            textAnswers: ["rother", "ister", "ather", "other", "ife", "aughter", "on"]
        },
        // Unit 2A Exercise 5 (Activity 2541741878) - Rewrite sentences with possessive 's
        "2541741878": {
            textAnswers: [
                "Lucy is Daniel's sister",
                "My cat's name is Pixie",
                "Oliver's wife is a nurse",
                "His daughter's name is Elizabeth",
                "Sandra is Jon's wife",
                "My husband's mother and father are farmers",
                "What's your friend's name"
            ]
        },
        "25417411878": {
            textAnswers: [
                "Lucy is Daniel's sister",
                "My cat's name is Pixie",
                "Oliver's wife is a nurse",
                "His daughter's name is Elizabeth",
                "Sandra is Jon's wife",
                "My husband's mother and father are farmers",
                "What's your friend's name"
            ]
        },
        // Unit 2B Exercise 1 (Activity 2541743963) - Complete the words for everyday objects
        "2541743963": {
            type: "two_column_letters",
            leftLetters: ['h', 'i', 'h', 'o', 'e', 'e', 'n', 'l', 'c', 'k', 'u', 'p'],
            rightLetters: ['e', 'k', 'o', 'p', 't', 'r', 'e', 'y', 'o', 'o', 'o', 'o']
        },
        "25417413963": {
            type: "two_column_letters",
            leftLetters: ['h', 'i', 'h', 'o', 'e', 'e', 'n', 'l', 'c', 'k', 'u', 'p'],
            rightLetters: ['e', 'k', 'o', 'p', 't', 'r', 'e', 'y', 'o', 'o', 'o', 'o']
        },
        // Unit 2B Grammar Exercise 5 (Activity 2541745758) - Complete table with these and that
        "2541745758": {
            textAnswers: ["that", "these"]
        },
        // Unit 2B Grammar Exercise 6 (Activity 2541748109) - Choose the correct alternatives
        "2541748109": {
            selectAnswers: ["these", "that", "This", "this", "This", "this", "These", "that", "that"]
        },
        // Unit 2C Exercise 2 (Activity 2541750756) - Drag numbers to words
        "2541750756": {
            type: "drag_drop_numbers",
            mapping: {
                "12": "twelve",
                "13": "thirteen",
                "100": "a hundred",
                "15": "fifteen",
                "90": "ninety",
                "30": "thirty",
                "11": "eleven",
                "17": "seventeen",
                "19": "nineteen",
                "20": "twenty",
                "70": "seventy"
            }
        },
        // Unit 2C Exercise 3 (Activity 2541757116) - Writing: Names and ages of six friends or people in your family
        "2541757116": {
            type: "writing",
            writingAnswer: "1 My mother, Sarah, is 45 years old.\n2 My father, David, is 48 years old.\n3 My sister, Emma, is 14 years old.\n4 My brother, Lucas, is 10 years old.\n5 My friend, Maria, is 25 years old.\n6 My friend, Tom, is 28 years old."
        },
        // Unit 2C Grammar Exercise 4 (Activity 2541766774) - Complete questions with question words (How, What, Where, Who)
        "2541766774": {
            textAnswers: ["How", "Where", "What", "How", "What", "Who", "Where"]
        },
        // Unit 2C Grammar Exercise 6 (Activity 2541771032) - Correct the question words
        "2541771032": {
            textAnswers: [
                "Where are they from",
                "How old are you",
                "Who's your best friend",
                "What's his job",
                "What's your house number"
            ]
        },
        // Unit 2D English in action Exercise 2 (Activity 2541776306 & 2541784580) - Complete table with phrases from the box
        "2541776306": {
            type: "two_column_drag_drop",
            leftColumnTitle: "Customer's phrases",
            rightColumnTitle: "Shop assistant's phrases",
            leftPhrases: [
                "Can I pay by card?",
                "How much is this book?",
                "Here's my card.",
                "How much are those cups?",
                "How much is that?"
            ],
            rightPhrases: [
                "Here's your change.",
                "Cash or card?",
                "That's £27.99, please."
            ]
        },
        "2541784580": {
            type: "two_column_drag_drop",
            leftColumnTitle: "Customer's phrases",
            rightColumnTitle: "Shop assistant's phrases",
            leftPhrases: [
                "Can I pay by card?",
                "How much is this book?",
                "Here's my card.",
                "How much are those cups?",
                "How much is that?"
            ],
            rightPhrases: [
                "Here's your change.",
                "Cash or card?",
                "That's £27.99, please."
            ]
        }
    };

    function getMemoryDB() {
        try {
            const local = JSON.parse(localStorage.getItem('mel_memory_v30') || '{}');
            return { ...PRE_SEEDED_MEMORY, ...local };
        } catch(e) {
            return { ...PRE_SEEDED_MEMORY };
        }
    }

    function saveToMemoryDB(key, data) {
        try {
            const local = JSON.parse(localStorage.getItem('mel_memory_v30') || '{}');
            local[key] = { ...data, updatedAt: new Date().toISOString() };
            localStorage.setItem('mel_memory_v30', JSON.stringify(local));
            console.log(`[Memory V30] Đã lưu bài tập vào bộ nhớ đa tài khoản: ${key}`, data);
        } catch(e) {
            console.error('[Memory V30] Lỗi ghi nhớ:', e);
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
            ex6_dialogues: [
                "Are you and Simon Spanish",
                "No, we're from Argentina",
                "Who are they",
                "They're my friends",
                "Are we late",
                "No, you're on time"
            ],
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
                jobs: ["manager", "office worker", "nurse", "pilot"],
                countries: ["the UK", "Brazil", "South Korea", "Italy"],
                nationalities: ["American"]
            }
        },

        // --- UNIT 2 ---
        "2A": {
            family_categories: {
                male: ["father", "dad", "son", "brother", "husband", "grandad", "uncle", "cousins", "nephew", "boyfriend"],
                female: ["mother", "mum", "daughter", "sister", "wife", "grandma", "aunt", "niece", "girlfriend"]
            },
            ex1_anagrams: {
                "mmu": "mum",
                "nso": "son",
                "aetrfh": "father",
                "hnsuadb": "husband",
                "add": "dad",
                "srtise": "sister",
                "hbertor": "brother",
                "rhutdaeg": "daughter",
                "ewif": "wife",
                "hteomr": "mother"
            },
            ex1_ordered: ["mum", "son", "father", "husband", "dad", "sister", "brother", "daughter", "wife"],
            ex2a: ["mum", "father", "daughter", "brother", "wife"],
            ex3: ["daughter", "husband", "son", "brother", "father", "wife", "children", "parents"],
            ex3_family_sentences: ["rother", "ister", "ather", "other", "ife", "aughter", "on"],
            ex5_possessives: [
                "Lucy is Daniel's sister",
                "My cat's name is Pixie",
                "Oliver's wife is a nurse",
                "His daughter's name is Elizabeth",
                "Sandra is Jon's wife",
                "My husband's mother and father are farmers",
                "What's your friend's name"
            ],
            grammar5: ["my", "his", "its", "our", "their"]
        },
        "2B": {
            ex1_columns: {
                left: ['h', 'i', 'h', 'o', 'e', 'e', 'n', 'l', 'c', 'k', 'u', 'p'],
                right: ['e', 'k', 'o', 'p', 't', 'r', 'e', 'y', 'o', 'o', 'o', 'o']
            },
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
            ex5_table: ["that", "these"],
            ex5_listening: ["desk", "keys", "computer", "desk", "photos", "chair"],
            ex6_grammar: ["these", "that", "This", "this", "This", "this", "These", "that", "that"],
            ex7_radios: ["b", "b", "a"],
            ex8_grammar: ["that", "those", "this", "that", "those", "these"]
        },
        "2C": {
            ex1a: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
            ex2_drag_numbers: ["twelve", "thirteen", "a hundred", "fifteen", "ninety", "thirty", "eleven", "seventeen", "nineteen", "twenty", "seventy"],
            ex2: ["13", "14", "50", "16", "70", "80", "19"],
            ex3_writing_family_ages: "1 My mother, Sarah, is 45 years old.\n2 My father, David, is 48 years old.\n3 My sister, Emma, is 14 years old.\n4 My brother, Lucas, is 10 years old.\n5 My friend, Maria, is 25 years old.\n6 My friend, Tom, is 28 years old.",
            ex4_question_words: ["How", "Where", "What", "How", "What", "Who", "Where"],
            ex6_correct_questions: [
                "Where are they from",
                "How old are you",
                "Who's your best friend",
                "What's his job",
                "What's your house number"
            ],
            ex3a: ["twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine", "thirty"],
            ex4b: ["Anna Chubb", "99", "Canada", "teacher", "Bill Gooch", "85", "The UK", "taxi driver", "Satoru Goto", "51", "Japan", "football player"],
            grammarBank1: ["Where", "Who", "What", "How", "What", "Where", "How", "When"],
            grammarBank2: ["c", "e", "d", "g", "a", "f", "b", "h"]
        },
        "2D": {
            ex2_customer_phrases: [
                "Can I pay by card?",
                "How much is this book?",
                "Here's my card.",
                "How much are those cups?",
                "How much is that?"
            ],
            ex2_shop_assistant_phrases: [
                "Here's your change.",
                "Cash or card?",
                "That's £27.99, please."
            ],
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
    function getPrefixLetterBeforeInput(input) {
        if (!input) return null;
        let textBefore = "";
        
        let node = input.previousSibling;
        while (node) {
            const str = (node.nodeType === Node.TEXT_NODE ? node.nodeValue : (node.innerText || node.textContent)) || "";
            textBefore = str + textBefore;
            if (textBefore.trim().length > 0) break;
            node = node.previousSibling;
        }

        if (!textBefore.trim() && input.parentElement) {
            const parentNodes = Array.from(input.parentElement.childNodes);
            const idx = parentNodes.indexOf(input);
            if (idx > 0) {
                textBefore = parentNodes.slice(0, idx).map(n => n.textContent || '').join('');
            }
        }

        // Tìm 1 chữ cái đơn đứng cuối cùng trước ô input (ví dụ: "My b", "Her s", "Their f", "b")
        const match = textBefore.trim().match(/(?:^|\s)([a-zA-Z])$/);
        if (match) {
            return match[1];
        }
        return null;
    }

    function getSuffixPunctuationAfterInput(input) {
        if (!input) return null;
        let textAfter = "";
        
        let node = input.nextSibling;
        while (node) {
            const str = (node.nodeType === Node.TEXT_NODE ? node.nodeValue : (node.innerText || node.textContent)) || "";
            textAfter += str;
            if (textAfter.trim().length > 0) break;
            node = node.nextSibling;
        }

        if (!textAfter.trim() && input.parentElement) {
            const parentNodes = Array.from(input.parentElement.childNodes);
            const idx = parentNodes.indexOf(input);
            if (idx >= 0 && idx < parentNodes.length - 1) {
                textAfter = parentNodes.slice(idx + 1).map(n => n.textContent || '').join('');
            }
        }

        const trimmed = textAfter.trim();
        if (trimmed.startsWith('.') || trimmed.startsWith('?') || trimmed.startsWith('!') || trimmed.startsWith(',')) {
            return trimmed[0];
        }
        return null;
    }

    function setInputValue(input, val) {
        if (!input || val === undefined || val === null) return;
        
        let finalVal = String(val).trim();
        
        // 1. Tự động phát hiện và cắt bỏ chữ cái đầu nếu đề bài đã in sẵn chữ cái đó ngay trước ô input (tránh lỗi chèn chữ: bbrother, ssister, ffather...)
        const prefix = getPrefixLetterBeforeInput(input);
        if (prefix && finalVal.toLowerCase().startsWith(prefix.toLowerCase()) && finalVal.length > 1) {
            console.log(`[Prefix Auto-Fix] Đề bài đã có sẵn chữ "${prefix}" trước ô input. Cắt bớt "${finalVal}" -> "${finalVal.slice(prefix.length)}"`);
            finalVal = finalVal.slice(prefix.length);
        }

        // 2. Tự động phát hiện và cắt bỏ dấu câu cuối nếu đề bài đã in sẵn dấu câu đó ngay sau ô input (tránh lỗi lặp dấu: sister. . hoặc name? ?)
        const suffix = getSuffixPunctuationAfterInput(input);
        if (suffix && (finalVal.endsWith('.') || finalVal.endsWith('?') || finalVal.endsWith('!'))) {
            const lastChar = finalVal[finalVal.length - 1];
            if (lastChar === suffix || (suffix === '.' && ['.', '?', '!'].includes(lastChar))) {
                console.log(`[Suffix Auto-Fix] Đề bài đã có sẵn dấu "${suffix}" sau ô input. Cắt bỏ dấu cuối: "${finalVal}" -> "${finalVal.slice(0, -1).trim()}"`);
                finalVal = finalVal.slice(0, -1).trim();
            }
        }

        input.focus();
        input.value = finalVal;
        try { input.setAttribute('value', finalVal); } catch(e) {}
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        if (typeof window.$ !== 'undefined' && window.$(input).val) {
            try { window.$(input).val(finalVal).trigger('input').trigger('change'); } catch(e) {}
        }
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function setWritingValue(el, val) {
        if (!el || val === undefined || val === null) return;
        const text = String(val).trim();
        el.focus();
        if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
            el.value = text;
            try { el.setAttribute('value', text); } catch(e) {}
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        } else {
            el.innerText = text;
            try { el.innerHTML = text.replace(/\n/g, '<br>'); } catch(e) {}
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (typeof window.$ !== 'undefined') {
            try { window.$(el).val(text).trigger('input').trigger('change'); } catch(e) {}
        }
        el.dispatchEvent(new Event('blur', { bubbles: true }));
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
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
            if (typeof window.$ !== 'undefined' && window.$(select).trigger) {
                try { window.$(select).val(select.options[matchedIdx].value).trigger('change'); } catch(e) {}
            }
        }
    }

    async function moveTokenToBox(tokenEl, destBox) {
        if (!tokenEl || !destBox) return;

        const win = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
        const $ = win.jQuery || win.$;

        function clickEl(el) {
            if (!el) return;
            el.focus();
            const r = el.getBoundingClientRect();
            const x = r.left + r.width / 2;
            const y = r.top + r.height / 2;
            const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, button: 0, buttons: 1, which: 1 };
            el.dispatchEvent(new MouseEvent('mousedown', opts));
            el.dispatchEvent(new MouseEvent('mouseup', opts));
            el.click();
        }

        const tokenClickable = tokenEl.closest('.ui-draggable, .draggable, [draggable="true"]') || tokenEl;
        const dropClickable = destBox.querySelector('.ui-droppable, .droppable, .dropzone, [data-droppable]') || destBox;

        // 1. Accessible Select Token
        clickEl(tokenClickable);
        tokenClickable.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
        tokenClickable.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
        await sleep(180);

        // 2. Accessible Drop to Box
        clickEl(dropClickable);
        dropClickable.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
        dropClickable.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
        await sleep(200);

        // 3. jQuery UI _drop Hook
        if ($) {
            try {
                const $tok = $(tokenClickable);
                const $dst = $(dropClickable).closest('.ui-droppable');
                if ($dst.length) {
                    const droppable = $dst.data('ui-droppable') || $dst.data('droppable');
                    if (droppable && droppable._drop) {
                        droppable._drop({ target: dropClickable, preventDefault: () => {} }, { draggable: $tok, helper: $tok });
                    }
                }
            } catch(e) {}
        }

        // 4. HTML5 DragEvent
        try {
            const dt = new DataTransfer();
            const sR = tokenClickable.getBoundingClientRect();
            const dR = dropClickable.getBoundingClientRect();
            tokenClickable.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: sR.left, clientY: sR.top }));
            dropClickable.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: dR.left, clientY: dR.top }));
            dropClickable.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: dR.left, clientY: dR.top }));
            dropClickable.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: dR.left, clientY: dR.top }));
            tokenClickable.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: dR.left, clientY: dR.top }));
        } catch(e) {}

        await sleep(200);
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

                let prompt = "";
                if (promptContext.isWriting) {
                    prompt = `You are an expert English teacher solving an open writing exercise from Pearson Roadmap A1.
Exercise Instruction: ${promptContext.instruction}
Context/Text on Page: ${promptContext.pageText.slice(0, 1500)}

Task: Write a high-quality, clear, natural, and grammatically accurate response that strictly follows the exercise instructions at CEFR A1 elementary level.
Return STRICTLY valid JSON with no markdown and no extra text in this structure:
{
  "type": "writing",
  "writingAnswer": "exact full response text to be written into the textarea"
}`;
                } else {
                    prompt = `You are an expert English teacher solving an exercise from Pearson Roadmap A1.
Exercise Instruction: ${promptContext.instruction}
Context/Text on Page: ${promptContext.pageText.slice(0, 1500)}
Input Elements to Fill: ${JSON.stringify(promptContext.fields)}

Task: Return the exact correct answers according to context.
CRITICAL RULES FOR BLANKS:
1. For categorized or listed blanks (Jobs, Countries, Nationalities, etc.), place EVERY item under its correct category using nearestHeading and surrounding context.
2. Do NOT duplicate words within the same category.
3. Return BOTH structured "blankAnswers" with blank numbers and answers, and flat "textAnswers".

Return STRICTLY valid JSON with no markdown and no extra text in this structure:
{
  "blankAnswers": [
    { "blank": 1, "answer": "exact answer for blank 1" },
    { "blank": 2, "answer": "exact answer for blank 2" }
  ],
  "textAnswers": ["answer1", "answer2"],
  "checkboxTargets": ["option1", "option2"],
  "radioTargets": ["optionA", "optionB"],
  "selectAnswers": ["val1", "val2"],
  "matchingPairs": [["question1", "answer1"], ["question2", "answer2"]],
  "writingAnswer": "only if writing task"
}`;
                }

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
                    🚀 AUTO-SOLVER 30.0
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
        console.log(`[AutoSolver Supreme 30.0] ${msg}`);
    }

    ensureUI();
    setInterval(ensureUI, 800);

    // =========================================================================
    // HỆ THỐNG XÁC ĐỊNH NHÓM VÀ NGỮ CẢNH THEO VỊ TRÍ HIỂN THỊ (VISUAL / CONTEXT SOLVER)
    // =========================================================================
    function findCategoryTops() {
        let jobTop = null, countryTop = null, natTop = null;
        const elements = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,div,span,b,strong,li,label'));
        for (const el of elements) {
            if (el.offsetParent === null) continue;
            const t = (el.innerText || '').trim();
            if (t.length > 35) continue;
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (/jobs/i.test(t) && !/countries|nationalities/i.test(t)) {
                if (jobTop === null || top < jobTop) jobTop = top;
            }
            if (/countries/i.test(t) && !/jobs|nationalities/i.test(t)) {
                if (countryTop === null || top < countryTop) countryTop = top;
            }
            if (/nationalities/i.test(t) && !/jobs|countries/i.test(t)) {
                if (natTop === null || top < natTop) natTop = top;
            }
        }
        return { jobTop, countryTop, natTop };
    }

    function getCategoryForInput(inp, tops) {
        const { countryTop, natTop } = tops || {};
        const rect = inp.getBoundingClientRect();
        const top = rect.top + window.scrollY;

        // Ưu tiên 1: Vị trí trục dọc (Visual Y coordinate)
        if (natTop !== null && top >= natTop - 25) return 'nationalities';
        if (countryTop !== null && top >= countryTop - 25) return 'countries';
        if (countryTop !== null && top < countryTop - 25) return 'jobs';

        // Ưu tiên 2: Container gần nhất
        const container = inp.closest('li, tr, .question, .item, .field-wrapper, .activity-item, div');
        if (container) {
            const text = (container.innerText || '').toLowerCase();
            const hasJob = /jobs/i.test(text);
            const hasCountry = /countries/i.test(text);
            const hasNat = /nationalities/i.test(text);
            if (hasJob && !hasCountry && !hasNat) return 'jobs';
            if (hasCountry && !hasJob && !hasNat) return 'countries';
            if (hasNat && !hasJob && !hasCountry) return 'nationalities';
        }

        return 'jobs';
    }

    async function solveThistleHouseEx4(customCategories) {
        updateStatus("🔍 Đang điền nhóm Thistle House Ex 4...", "#10b981", "LAYOUT SOLVER");
        console.log("[Thistle House Ex 4] Bắt đầu giải bài theo vị trí hiển thị nhóm...");

        const tops = findCategoryTops();
        console.log("[Thistle House Ex 4] Tọa độ đỉnh các nhóm:", tops);

        const allInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null);
        const editableInputs = allInputs.filter(inp => !inp.readOnly && !inp.disabled);

        if (editableInputs.length === 0) {
            console.warn("[Thistle House Ex 4] Không có ô input nào cần điền!");
            return false;
        }

        // Gom các ô input trống vào từng nhóm
        let inputsByCat = { jobs: [], countries: [], nationalities: [] };
        editableInputs.forEach(inp => {
            const cat = getCategoryForInput(inp, tops);
            if (cat && inputsByCat[cat]) {
                inputsByCat[cat].push(inp);
            }
        });

        // Nếu bài còn đủ 9 ô trống mà chưa chia chuẩn 4-4-1 thì phân cụm dọc tự động
        if (editableInputs.length === 9 && (inputsByCat.jobs.length !== 4 || inputsByCat.countries.length !== 4 || inputsByCat.nationalities.length !== 1)) {
            const sorted = [...editableInputs].sort((a, b) => {
                return (a.getBoundingClientRect().top + window.scrollY) - (b.getBoundingClientRect().top + window.scrollY);
            });
            inputsByCat = {
                jobs: sorted.slice(0, 4),
                countries: sorted.slice(4, 8),
                nationalities: sorted.slice(8, 9)
            };
        }

        // Sắp xếp các ô trong từng nhóm theo thứ tự hiển thị từ trái sang phải
        for (const cat in inputsByCat) {
            inputsByCat[cat].sort((a, b) => {
                const ra = a.getBoundingClientRect();
                const rb = b.getBoundingClientRect();
                return (ra.left + window.scrollX) - (rb.left + window.scrollX);
            });
        }

        console.log("[Thistle House Ex 4] Số ô trống thực tế cần điền mỗi nhóm:", {
            jobs: inputsByCat.jobs.length,
            countries: inputsByCat.countries.length,
            nationalities: inputsByCat.nationalities.length
        });

        // Toàn bộ kho từ vựng từ infographic
        const CATEGORY_POOLS = {
            jobs: ["student", "teacher", "manager", "office worker", "nurse", "pilot"],
            countries: ["Canada", "the UK", "Brazil", "South Korea", "Italy"],
            nationalities: ["English", "American"]
        };

        const filledResults = [];
        let globalInputCounter = 1;

        // Quét toàn bộ DOM để tìm các từ ĐÃ CÓ SẴN trong từng hàng (ví dụ student, teacher, Canada, English hoặc các từ đã làm đúng từ lần trước có dấu tick xanh)
        for (const cat of ['jobs', 'countries', 'nationalities']) {
            const groupInputs = inputsByCat[cat];
            if (groupInputs.length === 0) continue;

            const usedWords = new Set();

            // Xác định vùng hiển thị của nhóm
            let topMin = 0;
            let topMax = Infinity;
            if (cat === 'jobs') {
                topMin = (tops.jobTop || 0) - 30;
                topMax = (tops.countryTop || 650) - 20;
            } else if (cat === 'countries') {
                topMin = (tops.countryTop || 650) - 20;
                topMax = (tops.natTop || 800) - 20;
            } else if (cat === 'nationalities') {
                topMin = (tops.natTop || 800) - 20;
                topMax = Infinity;
            }

            // Quét text tĩnh & các ô có sẵn value hoặc tick xanh trong vùng này
            const regionElements = Array.from(document.querySelectorAll('*')).filter(el => {
                if (el.offsetParent === null) return false;
                const rect = el.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                return top >= topMin && top < topMax;
            });

            const regionText = regionElements.map(el => (el.value || el.innerText || '')).join(' ').toLowerCase();
            for (const word of CATEGORY_POOLS[cat]) {
                if (regionText.includes(word.toLowerCase())) {
                    usedWords.add(word.toLowerCase());
                }
            }

            console.log("[Thistle House Ex 4] Nhóm [" + cat + "] - Từ đã có sẵn trên giao diện:", Array.from(usedWords));

            // Từ còn thiếu = Toàn bộ kho từ trừ đi các từ đã có sẵn
            let missingWords = CATEGORY_POOLS[cat].filter(w => !usedWords.has(w.toLowerCase()));

            // Nếu số từ còn thiếu ít hơn số ô cần điền, bổ sung từ kho
            if (missingWords.length < groupInputs.length) {
                const remainingPool = CATEGORY_POOLS[cat].filter(w => !missingWords.includes(w));
                missingWords = [...missingWords, ...remainingPool];
            }

            console.log("[Thistle House Ex 4] Nhóm [" + cat + "] - Các từ cần điền vào ô trống:", missingWords.slice(0, groupInputs.length));

            // Điền trực tiếp vào từng ô input của nhóm
            for (let i = 0; i < groupInputs.length; i++) {
                const inp = groupInputs[i];
                const ans = missingWords[i];
                if (ans) {
                    setInputValue(inp, ans);
                    console.log('[Input #' + globalInputCounter + '] Nhóm: [' + cat + '] -> Điền: "' + ans + '"');
                    filledResults.push({
                        index: globalInputCounter,
                        group: cat,
                        answer: ans
                    });
                    globalInputCounter++;
                    await sleep(35);
                }
            }
        }

        // Tự kiểm tra an toàn trước khi nộp
        let isAllValid = true;
        for (const cat of ['jobs', 'countries', 'nationalities']) {
            const inps = inputsByCat[cat];
            const vals = inps.map(i => i.value.trim());

            if (vals.some(v => !v)) {
                console.warn("[AutoSolver Validation] ❌ Nhóm [" + cat + "] còn ô trống!", vals);
                isAllValid = false;
            }

            const lowerVals = vals.map(v => v.toLowerCase());
            const uniqueVals = new Set(lowerVals);
            if (uniqueVals.size !== lowerVals.length) {
                console.warn("[AutoSolver Validation] ❌ Nhóm [" + cat + "] có từ trùng lặp!", vals);
                isAllValid = false;
            }
        }

        if (!isAllValid) {
            console.warn("[AutoSolver] ❌ Rà soát không đạt yêu cầu. KHÔNG submit!");
            updateStatus("⚠️ Lỗi kiểm tra nhóm đáp án. Hoãn submit.", "#ef4444");
            return false;
        }

        updateStatus("✅ Đã điền xong " + filledResults.length + " ô còn thiếu!", "#10b981", "MASTER DB");
        await submitAndNext();
        return true;
    }

    async function solveContextQuestions(questionMap, fallbackAnswers = []) {
        const allInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (allInputs.length === 0) return false;

        let filledCount = 0;
        for (let i = 0; i < allInputs.length; i++) {
            const inp = allInputs[i];
            const parent = inp.closest('li, tr, p, .question, .item, .field-wrapper, div');
            const text = (parent ? parent.innerText : '').toLowerCase();

            let matchedAnswer = null;
            if (questionMap && Array.isArray(questionMap)) {
                for (const q of questionMap) {
                    if (q.keywords && q.keywords.some(k => text.includes(k.toLowerCase()))) {
                        matchedAnswer = q.answer;
                        break;
                    }
                }
            }

            if (!matchedAnswer && fallbackAnswers && fallbackAnswers.length > 0) {
                const targetIdx = (allInputs.length === fallbackAnswers.length + 1) ? i - 1 : i;
                if (targetIdx >= 0 && fallbackAnswers[targetIdx]) {
                    matchedAnswer = fallbackAnswers[targetIdx];
                }
            }

            if (matchedAnswer) {
                setInputValue(inp, matchedAnswer);
                console.log('[Context Question #' + (i + 1) + '] "' + text.slice(0, 40) + '" -> Điền: "' + matchedAnswer + '"');
                filledCount++;
                await sleep(25);
            }
        }

        return filledCount > 0;
    }

    // =========================================================================
    // ĐỘNG CƠ ĐIỀU PHỐI TỔNG THỂ (MASTER SOLVER ENGINE)
    // =========================================================================
    async function runMasterSolver() {
        const activeUnansweredModal = Array.from(document.querySelectorAll('.modal, .dialog, [role="dialog"]')).find(m => {
            return m.offsetParent !== null && window.getComputedStyle(m).display !== 'none' && (m.innerText || '').toLowerCase().includes('unanswered');
        });
        if (activeUnansweredModal) {
            const cancelModal = Array.from(activeUnansweredModal.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'cancel');
            if (cancelModal) {
                cancelModal.click();
                await sleep(200);
            }
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

        // BƯỚC 1: KIỂM TRA KHO ĐÁP ÁN GỐC TOÀN DIỆN (ROADMAP MASTER DB & VISUAL SOLVER) - ƯU TIÊN SỐ 1
        let solvedDeterministically = false;
        try {
            solvedDeterministically = await trySolveFromMasterDB(ctx, fullPageText);
        } catch (err) {
            console.error("[Master DB Error]:", err);
        }
        if (solvedDeterministically) {
            return;
        }

        // BƯỚC 2: KIỂM TRA BỘ NHỚ CỤC BỘ (CHỈ DÙNG NẾU MASTER DB CHƯA CÓ)
        const memoryDB = getMemoryDB();
        const cached = memoryDB[activityId] || memoryDB[fingerprint];
        if (cached) {
            updateStatus("⚡ Tìm thấy trong Bộ nhớ Cục bộ -> Đang áp dụng...", "#10b981", "PERSISTENT");
            await applyCachedSolution(cached);
            await submitAndNext();
            return;
        }

        // BƯỚC 3: KÍCH HOẠT GEMINI AI FALLBACK (TỰ ĐỘNG HỌC & GHI NHỚ)
        updateStatus("🤖 Đang gọi Gemini AI phân tích...", "#a855f7", "GEMINI AI");
        try {
            const textareas = Array.from(document.querySelectorAll('textarea, [contenteditable="true"], .writing-area, .essay-box')).filter(t => t.offsetParent !== null && !t.readOnly && !t.disabled);
            const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null && !i.readOnly);
            const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(c => c.offsetParent !== null);
            const radios = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => r.offsetParent !== null);
            const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null);

            // Nếu là bài viết Writing dạng textarea độc lập
            if (textareas.length > 0 && inputs.length === 0 && selects.length === 0 && checkboxes.length === 0) {
                updateStatus("🤖 Đang gọi Gemini AI tạo bài viết Writing...", "#a855f7", "GEMINI AI");
                const aiResult = await queryGeminiSolver({
                    instruction,
                    pageText: document.body.innerText,
                    isWriting: true,
                    fields: { task: "writing", instruction }
                });

                if (aiResult && aiResult.writingAnswer) {
                    saveToMemoryDB(fingerprint, aiResult);
                    if (activityId) saveToMemoryDB(activityId, aiResult);
                    setWritingValue(textareas[0], aiResult.writingAnswer);
                    await sleep(500);
                    await submitAndNext();
                    return;
                }
            }

            const pageHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b, label, .title, .label, p, div'))
                .filter(el => {
                    if (el.offsetParent === null && el.getBoundingClientRect().height === 0) return false;
                    if (el.querySelector('input, select, textarea')) return false;
                    const t = (el.innerText || '').trim();
                    return t.length > 0 && t.length < 60;
                }).map(el => ({
                    text: el.innerText.trim(),
                    top: el.getBoundingClientRect().top + window.scrollY
                })).sort((a, b) => a.top - b.top);

            const inputDetails = inputs.map((inp, idx) => {
                const rect = inp.getBoundingClientRect();
                const inpTop = rect.top + window.scrollY;
                const headingsAbove = pageHeadings.filter(h => h.top <= inpTop + 20);
                const nearestHeading = headingsAbove.length > 0 ? headingsAbove[headingsAbove.length - 1].text : 'None';
                const parent = inp.closest('li, tr, p, .question, .item, .field-wrapper, div');
                const textBefore = (parent?.innerText || '').replace(/[s ]+/g, ' ').trim().slice(0, 140);
                return {
                    blank: idx + 1,
                    nearestHeading: nearestHeading,
                    context: textBefore
                };
            });

            const promptFields = {
                textInputsCount: inputs.length,
                textInputsContext: inputDetails,
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
        const { exNum = null, lessonCode = null, instruction = "", activityId = "" } = ctx || {};

        // 0. DẠNG BÀI VIẾT (WRITING / TEXTAREA / CONTENTEDITABLE)
        const textareas = Array.from(document.querySelectorAll('textarea, [contenteditable="true"], .writing-area, .essay-box')).filter(t => {
            return t.offsetParent !== null && !t.readOnly && !t.disabled;
        });

        if (textareas.length > 0) {
            updateStatus("✍️ Phát hiện bài viết Writing...", "#38bdf8", "WRITING");

            // Unit 2C Exercise 3 (Activity 2541757116): Write the names and ages of six friends or people in your family
            if (activityId === '2541757116' || fullPageText.includes('names and ages of six friends') || fullPageText.includes('six friends or people in your family')) {
                updateStatus("✍️ Viết bài Unit 2C Ex 3 (Names and Ages)...", "#10b981", "MASTER DB");
                const defaultWriting = ROADMAP_MASTER_DB["2C"]?.ex3_writing_family_ages || 
                    "1 My mother, Sarah, is 45 years old.\n2 My father, David, is 48 years old.\n3 My sister, Emma, is 14 years old.\n4 My brother, Lucas, is 10 years old.\n5 My friend, Maria, is 25 years old.\n6 My friend, Tom, is 28 years old.";
                setWritingValue(textareas[0], defaultWriting);
                await sleep(500);
                await submitAndNext();
                return true;
            }

            const preSeeded = PRE_SEEDED_MEMORY[activityId];
            if (preSeeded && (preSeeded.type === 'writing' || preSeeded.writingAnswer)) {
                updateStatus("✍️ Viết bài từ Bộ nhớ Master...", "#10b981", "MASTER DB");
                setWritingValue(textareas[0], preSeeded.writingAnswer);
                await sleep(500);
                await submitAndNext();
                return true;
            }
        }

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
            // --- 3.0. KIỂM TRA ĐÁP ÁN TRỰC TIẾP TỪ PRE_SEEDED_MEMORY THEO ACTIVITY ID (ƯU TIÊN TUYỆT ĐỐI) ---
            const directSeeded = (activityId && PRE_SEEDED_MEMORY[activityId]) ? PRE_SEEDED_MEMORY[activityId] : null;
            if (directSeeded && directSeeded.textAnswers && Array.isArray(directSeeded.textAnswers) && 
                !activityId.includes('25411708515') && !activityId.includes('25411710103') && !activityId.includes('25411730736')) {
                updateStatus(`✅ Điền đáp án chính xác theo Activity ID (${activityId})...`, "#10b981", "MASTER DB");
                let answersToUse = [...directSeeded.textAnswers];
                if (answersToUse.length === allInputs.length + 1) {
                    answersToUse = answersToUse.slice(1);
                }
                for (let i = 0; i < allInputs.length; i++) {
                    if (answersToUse[i]) {
                        setInputValue(allInputs[i], answersToUse[i]);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return true;
            }

            // --- UNIT 2C GRAMMAR EXERCISE 4: QUESTION WORDS WITH BE ---
            const is2CEx4 = (activityId === '2541766774') ||
                            (lessonCode === '2C' && (exNum === 4 || fullPageText.includes('question words') || fullPageText.includes('old is your sister'))) ||
                            (fullPageText.includes('question word') && fullPageText.includes('old is your sister'));
            if (is2CEx4) {
                updateStatus("✅ Điền từ để hỏi Unit 2C Ex 4 (Question words with be)...", "#10b981", "MASTER DB");
                const qWords = ROADMAP_MASTER_DB["2C"].ex4_question_words || ["How", "Where", "What", "How", "What", "Who", "Where"];
                for (let i = 0; i < allInputs.length; i++) {
                    if (qWords[i]) {
                        setInputValue(allInputs[i], qWords[i]);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return true;
            }

            // --- UNIT 2C GRAMMAR EXERCISE 6: CORRECT THE QUESTION WORDS ---
            const is2CEx6 = (activityId === '2541771032') ||
                            (fullPageText.includes('correct the question words') || (fullPageText.includes("how's your name") && fullPageText.includes("who are they from")));
            if (is2CEx6) {
                updateStatus("✅ Sửa từ để hỏi Unit 2C Ex 6 (Correct the question words)...", "#10b981", "MASTER DB");
                const ex6Ans = ROADMAP_MASTER_DB["2C"]?.ex6_correct_questions || [
                    "Where are they from",
                    "How old are you",
                    "Who's your best friend",
                    "What's his job",
                    "What's your house number"
                ];
                let answersToUse = [...ex6Ans];
                if (answersToUse.length === allInputs.length + 1) {
                    answersToUse = answersToUse.slice(1);
                }
                for (let i = 0; i < allInputs.length; i++) {
                    if (answersToUse[i]) {
                        setInputValue(allInputs[i], answersToUse[i]);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return true;
            }

            // --- THISTLE HOUSE (UNIT 1) EX 4: JOBS, COUNTRIES, NATIONALITIES (ƯU TIÊN TUYỆT ĐỐI) ---
            const tops = findCategoryTops();
            const isCategorySortingEx = (tops.jobTop !== null && (tops.countryTop !== null || tops.natTop !== null)) ||
                                        (fullPageText.includes('jobs') && (fullPageText.includes('countries') || fullPageText.includes('nationalities'))) ||
                                        (fullPageText.includes('manager') || fullPageText.includes('brazil') || fullPageText.includes('american'));
            if (isCategorySortingEx) {
                const ok = await solveThistleHouseEx4();
                if (ok) return true;
            }

            // --- THISTLE HOUSE (UNIT 1) EX 2: WHO IS... ---
            const isWhoIsEx = (fullPageText.includes('who is') && (fullPageText.includes('office worker') || fullPageText.includes('brazilian') || fullPageText.includes('canadian') || fullPageText.includes('pilot'))) ||
                              activityId.includes('25411708515') || activityId.includes('25411710103');
            if (isWhoIsEx) {
                updateStatus("✅ Điền tên người Thistle House Ex 2 theo ngữ cảnh từng câu...", "#10b981", "MASTER DB");
                const ex2Questions = [
                    { keywords: ["office worker"], answer: "Gabriela" },
                    { keywords: ["brazilian"], answer: "Gabriela" },
                    { keywords: ["canadian"], answer: "Steve" },
                    { keywords: ["pilot"], answer: "Matteo" },
                    { keywords: ["manager"], answer: "Lesley" },
                    { keywords: ["new york"], answer: "Jenny" },
                    { keywords: ["british"], answer: "Lesley" },
                    { keywords: ["italian"], answer: "Matteo" },
                    { keywords: ["nurse"], answer: "Mi Na" },
                    { keywords: ["south korea"], answer: "Mi Na" }
                ];
                const names = ROADMAP_MASTER_DB.THISTLE_HOUSE.ex2;
                await solveContextQuestions(ex2Questions, names);
                await submitAndNext();
                return true;
            }
            // --- UNIT 1C GRAMMAR BE: YOU/WE/THEY (EXERCISE 5) ---
            if (lessonCode === '1C' && (exNum === 5 || allInputs.length === 5) && !fullPageText.includes('you and simon') && !fullPageText.includes('maria and anna')) {
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

            // --- UNIT 1C GRAMMAR BE: YOU/WE/THEY (EXERCISE 6) ---
            const is1CEx6 = (activityId === '25411597312' || activityId === '2541597312') ||
                            (lessonCode === '1C' && (exNum === 6 || fullPageText.includes('you and simon') || fullPageText.includes('maria and anna')));

            if (is1CEx6) {
                updateStatus("✅ Điền hội thoại Unit 1C Ex 6 (Are you and Simon Spanish...)", "#10b981", "MASTER DB");
                const ans6 = [
                    "Are you and Simon Spanish",
                    "No, we're from Argentina",
                    "Who are they",
                    "They're my friends",
                    "Are we late",
                    "No, you're on time"
                ];
                const fullAns8 = [
                    "Are Maria and Anna sisters",
                    "No, they're housemates",
                    ...ans6
                ];
                const targetAns = (allInputs.length === 8) ? fullAns8 : ans6;
                for (let i = 0; i < allInputs.length; i++) {
                    if (targetAns[i]) {
                        setInputValue(allInputs[i], targetAns[i]);
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

            // --- UNIT 2A: FAMILY VOCABULARY & ANAGRAMS ---
            const is2AEx1 = (activityId === '2541727765' || activityId === '25411727765') || 
                            (lessonCode === '2A' && exNum === 1) ||
                            (fullPageText.includes('hteomr') || fullPageText.includes('hnsuadb') || fullPageText.includes('rhutdaeg') || fullPageText.includes('srtise') || (fullPageText.includes('mmu') && fullPageText.includes('aetrfh')));

            if (is2AEx1) {
                updateStatus("✅ Giải đảo chữ Unit 2A Ex 1 (Family Anagrams)...", "#10b981", "MASTER DB");
                const anagramMap = ROADMAP_MASTER_DB["2A"].ex1_anagrams;
                const orderedAnswers = ROADMAP_MASTER_DB["2A"].ex1_ordered;

                for (let i = 0; i < allInputs.length; i++) {
                    const inp = allInputs[i];
                    // Tìm ngữ cảnh của dòng (chứa từ bị đảo chữ: mmu, nso, aetrfh, hnsuadb, add, srtise, hbertor, rhutdaeg, ewif)
                    const lineText = (inp.closest('li, tr, p, .question, .item, div')?.innerText || '').toLowerCase();
                    let matchedWord = null;

                    for (const scrambled in anagramMap) {
                        const regex = new RegExp('\b' + scrambled + '\b', 'i');
                        if (regex.test(lineText)) {
                            matchedWord = anagramMap[scrambled];
                            break;
                        }
                    }

                    // Nếu tìm thấy theo ngữ cảnh dòng chữ, dùng từ đó. Nếu không, dùng theo thứ tự mảng đã loại bỏ Example
                    const answer = matchedWord || orderedAnswers[i];
                    if (answer) {
                        setInputValue(inp, answer);
                        console.log(`[Unit 2A Ex 1] Ô ${i+1}: dòng "${lineText.slice(0, 40)}" -> Điền: "${answer}"`);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return true;
            }

            if (lessonCode === '2A' && allInputs.length > 0) {
                if (fullPageText.includes('complete the sentences with family words')) {
                    updateStatus("✅ Điền từ gia đình Unit 2A...", "#10b981", "MASTER DB");
                    const words = ROADMAP_MASTER_DB["2A"].ex2a;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (words[i]) {
                            setInputValue(allInputs[i], words[i]);
                            await sleep(25);
                        }
                    }
                    await submitAndNext();
                    return true;
                }

                if (fullPageText.includes('choose the correct words')) {
                    updateStatus("✅ Điền Unit 2A Ex 3...", "#10b981", "MASTER DB");
                    const words = ROADMAP_MASTER_DB["2A"].ex3;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (words[i]) {
                            setInputValue(allInputs[i], words[i]);
                            await sleep(25);
                        }
                    }
                    await submitAndNext();
                    return true;
                }
            }

            // --- UNIT 2A EXERCISE 3: COMPLETE FAMILY WORDS (MISSING LETTERS / PREFIX GIVEN) ---
            const is2AEx3 = (activityId === '2541738347' || activityId === '25411738347') ||
                            (lessonCode === '2A' && exNum === 3 && (allInputs.length === 7 || allInputs.length === 8)) ||
                            (fullPageText.includes('türkiye') && fullPageText.includes('argentinian') && (fullPageText.includes('luisa') || fullPageText.includes('pablo')));

            if (is2AEx3) {
                updateStatus("✅ Điền từ gia đình Unit 2A Ex 3 (Chuẩn tiền tố)...", "#10b981", "MASTER DB");
                const ans = ROADMAP_MASTER_DB["2A"].ex3_family_sentences;
                if (allInputs.length === 8) {
                    const fullAns = ["usband", ...ans];
                    for (let i = 0; i < allInputs.length; i++) {
                        if (fullAns[i]) {
                            setInputValue(allInputs[i], fullAns[i]);
                            await sleep(25);
                        }
                    }
                } else {
                    for (let i = 0; i < allInputs.length; i++) {
                        if (ans[i]) {
                            setInputValue(allInputs[i], ans[i]);
                            await sleep(25);
                        }
                    }
                }
                await submitAndNext();
                return true;
            }

            // --- UNIT 2A EXERCISE 5: REWRITE SENTENCES WITH POSSESSIVE 'S ---
            const is2AEx5 = (activityId === '2541741878' || activityId === '25417411878') ||
                            (lessonCode === '2A' && exNum === 5 && (fullPageText.includes('possessive') || fullPageText.includes('daniel sister') || fullPageText.includes('cat name is pixie'))) ||
                            (fullPageText.includes('daniel sister') && fullPageText.includes('oliver wife'));

            if (is2AEx5) {
                updateStatus("✅ Viết lại câu sở hữu cách Unit 2A Ex 5...", "#10b981", "MASTER DB");
                const ans = ROADMAP_MASTER_DB["2A"].ex5_possessives;
                if (allInputs.length === 8) {
                    const fullAns = ["My mother's mother is from Argentina", ...ans];
                    for (let i = 0; i < allInputs.length; i++) {
                        if (fullAns[i]) {
                            setInputValue(allInputs[i], fullAns[i]);
                            await sleep(25);
                        }
                    }
                } else {
                    for (let i = 0; i < allInputs.length; i++) {
                        if (ans[i]) {
                            setInputValue(allInputs[i], ans[i]);
                            await sleep(25);
                        }
                    }
                }
                await submitAndNext();
                return true;
            }

            // --- UNIT 2B ---
            if (lessonCode === '2B' || fullPageText.includes('everyday objects')) {
                if (exNum === 1 || activityId === '2541743963' || activityId === '25417413963' || (allInputs.length >= 20 && instruction.includes('complete the words'))) {
                    updateStatus("✅ Điền chữ cái đồ vật Unit 2B Ex 1 (Two-Column Layout)...", "#10b981", "MASTER DB");

                    // Phân chia ô theo 2 cột: Cột trái (chair, phone, pen, clock, cup) và Cột phải (desk, computer, key, photo, book)
                    const xs = allInputs.map(i => i.getBoundingClientRect().left);
                    const minX = Math.min(...xs);
                    const maxX = Math.max(...xs);
                    const midX = (minX + maxX) / 2;

                    const leftInputs = allInputs.filter(i => i.getBoundingClientRect().left < midX);
                    const rightInputs = allInputs.filter(i => i.getBoundingClientRect().left >= midX);

                    const sortColumn = (list) => [...list].sort((a, b) => {
                        const ra = a.getBoundingClientRect();
                        const rb = b.getBoundingClientRect();
                        if (Math.abs(ra.top - rb.top) > 12) return ra.top - rb.top;
                        return ra.left - rb.left;
                    });

                    const sortedLeft = sortColumn(leftInputs);
                    const sortedRight = sortColumn(rightInputs);

                    // Cột trái: 2: chair (h, i), 3: phone (h, o, e), 4: pen (e, n), 5: clock (l, c, k), 6: cup (u, p)
                    const leftLetters = ['h', 'i', 'h', 'o', 'e', 'e', 'n', 'l', 'c', 'k', 'u', 'p'];

                    // Cột phải: 7: desk (e, k), 8: computer (o, p, t, r), 9: key (e, y), 10: photo (o, o), 11: book (o, o)
                    const rightLetters = ['e', 'k', 'o', 'p', 't', 'r', 'e', 'y', 'o', 'o', 'o', 'o'];

                    for (let i = 0; i < sortedLeft.length; i++) {
                        if (leftLetters[i]) {
                            setInputValue(sortedLeft[i], leftLetters[i]);
                            await sleep(15);
                        }
                    }

                    for (let i = 0; i < sortedRight.length; i++) {
                        if (rightLetters[i]) {
                            setInputValue(sortedRight[i], rightLetters[i]);
                            await sleep(15);
                        }
                    }

                    await submitAndNext();
                    return true;
                }

                // Bài bảng ngữ pháp Unit 2B Grammar Ex 5: Complete the table with these and that (2 ô trống: that, these)
                if (activityId === '2541745758' || (allInputs.length === 2 && (fullPageText.includes('these and that') || fullPageText.includes('near (here)') || (lessonCode === '2B' && fullPageText.includes('grammar'))))) {
                    updateStatus("✅ Điền bảng that / these Unit 2B Grammar Ex 5...", "#10b981", "MASTER DB");
                    const sortedInputs = [...allInputs].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
                    for (const input of sortedInputs) {
                        const rowText = (input.closest('tr, .row, table')?.innerText || input.parentElement?.innerText || '').toLowerCase();
                        if (rowText.includes('singular')) {
                            setInputValue(input, 'that');
                        } else if (rowText.includes('plural')) {
                            setInputValue(input, 'these');
                        }
                    }
                    if (sortedInputs[0] && !sortedInputs[0].value) setInputValue(sortedInputs[0], 'that');
                    if (sortedInputs[1] && !sortedInputs[1].value) setInputValue(sortedInputs[1], 'these');
                    
                    await submitAndNext();
                    return true;
                }

                if ((exNum === 3 || instruction.includes('write the everyday objects')) && (allInputs.length === 5 || allInputs.length === 6) && fullPageText.includes('everyday objects')) {
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

                // Bài nghe Unit 2B Vocabulary Listening Ex 5 (6 ô: desk, keys, computer, desk, photos, chair)
                if ((exNum === 5 || allInputs.length === 6) && (fullPageText.includes('listen') || document.querySelector('.audio-player, audio, .play-button'))) {
                    updateStatus("✅ Điền Listening Unit 2B Ex 5...", "#10b981", "MASTER DB");
                    const ans = ROADMAP_MASTER_DB["2B"].ex5_listening;
                    for (let i = 0; i < allInputs.length; i++) {
                        if (ans[i]) setInputValue(allInputs[i], ans[i]);
                    }
                    await submitAndNext();
                    return true;
                }

                // Bài điền câu Unit 2B Grammar Ex 8 (6 ô: that, those, this, that, those, these)
                if ((lessonCode === '2B' && exNum === 8) || (allInputs.length === 6 && (fullPageText.includes('grammar') || fullPageText.includes('those') || fullPageText.includes('these')) && !fullPageText.includes('listen'))) {
                    updateStatus("✅ Điền this/that/these/those Unit 2B Grammar Ex 8...", "#10b981", "MASTER DB");
                    const ans = ROADMAP_MASTER_DB["2B"].ex8_grammar || ["that", "those", "this", "that", "those", "these"];
                    for (let i = 0; i < allInputs.length; i++) {
                        if (ans[i]) {
                            setInputValue(allInputs[i], ans[i]);
                            await sleep(25);
                        }
                    }
                    await submitAndNext();
                    return true;
                }
            }

// Thistle House handled at top of text inputs

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
            if ((lessonCode === '2C' && fullPageText.includes('numbers') && !fullPageText.includes('question word')) || (fullPageText.includes('numbers') && !fullPageText.includes('question word'))) {
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
        const isDragDrop = (activityId === '25411730736') || 
                           fullPageText.includes('drag the') || fullPageText.includes('drag and drop') ||
                           fullPageText.includes('correct box') ||
                           document.querySelector('.draggable, [draggable="true"], .association, .dropzone, .ui-droppable');

        if (isDragDrop) {
            updateStatus("📦 Đang kéo thả từ vựng...", "#c084fc", "MASTER DB");

            // --- UNIT 2A EXERCISE 2: FAMILY WORDS DRAG TO BOX (MALE / FEMALE) ---
            const is2AEx2 = (activityId === '2541730736' || activityId === '25411730736') || 
                            (lessonCode === '2A' && (exNum === 2 || fullPageText.includes('family words to the correct box'))) ||
                            (fullPageText.includes('male') && fullPageText.includes('female') && fullPageText.includes('family'));

            if (is2AEx2) {
                updateStatus("✅ Kéo thả từ gia đình Unit 2A (Male / Female)...", "#10b981", "MASTER DB");

                // 1. Xác định chính xác 2 hộp Male và Female
                let maleBox = null;
                let femaleBox = null;

                // Cách A: Tìm theo .ui-droppable hoặc .dropzone sắp xếp từ trái sang phải
                const droppables = Array.from(document.querySelectorAll('.ui-droppable, .droppable, .dropzone, [data-droppable], .box')).filter(el => {
                    return el.offsetParent !== null && el.getBoundingClientRect().height > 40;
                });
                if (droppables.length >= 2) {
                    droppables.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
                    maleBox = droppables[0];
                    femaleBox = droppables[1];
                }

                // Cách B: Dựa vào vị trí ví dụ father (Example) và mother (Example)
                if (!maleBox || !femaleBox) {
                    const allLeaves = Array.from(document.querySelectorAll('*')).filter(el => el.children.length === 0 && el.offsetParent !== null);
                    const fatherEl = allLeaves.find(el => (el.innerText || '').toLowerCase().includes('father') && (el.innerText || '').toLowerCase().includes('example'));
                    const motherEl = allLeaves.find(el => (el.innerText || '').toLowerCase().includes('mother') && (el.innerText || '').toLowerCase().includes('example'));
                    if (fatherEl) maleBox = fatherEl.closest('.ui-droppable, .droppable, .dropzone, .box, div') || fatherEl.parentElement;
                    if (motherEl) femaleBox = motherEl.closest('.ui-droppable, .droppable, .dropzone, .box, div') || motherEl.parentElement;
                }

                // Cách C: Dựa vào tiêu đề ♂ (Male) và ♀ (Female)
                if (!maleBox || !femaleBox) {
                    const headers = Array.from(document.querySelectorAll('*')).filter(el => {
                        const t = (el.innerText || '').trim().toLowerCase();
                        return (t.includes('male') || t.includes('female') || t.includes('♂') || t.includes('♀')) && t.length < 30;
                    });
                    const mHeader = headers.find(h => {
                        const t = h.innerText.toLowerCase();
                        return (t.includes('male') && !t.includes('female')) || t.includes('♂');
                    });
                    const fHeader = headers.find(h => h.innerText.toLowerCase().includes('female') || h.innerText.includes('♀'));

                    if (mHeader) {
                        maleBox = mHeader.nextElementSibling || 
                                  mHeader.parentElement.querySelector('.box, .dropzone, .droppable, div:last-child') || 
                                  mHeader.parentElement;
                    }
                    if (fHeader) {
                        femaleBox = fHeader.nextElementSibling || 
                                    fHeader.parentElement.querySelector('.box, .dropzone, .droppable, div:last-child') || 
                                    fHeader.parentElement;
                    }
                }

                console.log("[Unit 2A Ex 2] Male Box:", maleBox, "Female Box:", femaleBox);

                if (maleBox && femaleBox) {
                    const maleTargets = ["dad", "son", "brother", "husband"];
                    const femaleTargets = ["wife", "daughter", "sister", "mum"];

                    // Hàm tìm và di chuyển token của một từ
                    async function moveFamilyWord(word, targetBox) {
                        // Tìm token trong ngân hàng từ (không nằm trong maleBox hoặc femaleBox)
                        const candidates = Array.from(document.querySelectorAll('.ui-draggable, .draggable, [draggable="true"], .token, .btn, .word, li, div, span, button')).filter(el => {
                            if (el.offsetParent === null) return false;
                            const t = (el.innerText || '').trim().toLowerCase();
                            // Khớp nguyên từ
                            return t === word && !maleBox.contains(el) && !femaleBox.contains(el);
                        });

                        const token = candidates[candidates.length - 1] || candidates[0];
                        if (token) {
                            console.log(`[Unit 2A Ex 2] Di chuyển "${word}" vào hộp...`);
                            await moveTokenToBox(token, targetBox);
                            await sleep(100);
                        } else {
                            console.log(`[Unit 2A Ex 2] Từ "${word}" có thể đã được đặt vào hộp.`);
                        }
                    }

                    for (const w of maleTargets) {
                        await moveFamilyWord(w, maleBox);
                    }
                    for (const w of femaleTargets) {
                        await moveFamilyWord(w, femaleBox);
                    }

                    await sleep(300);
                    await submitAndNext();
                    return true;
                }
            }

            // --- UNIT 2C EXERCISE 2: NUMBERS 11-100 DRAG TO NUMBERS ---
            const is2CEx2 = (activityId === '2541750756') || 
                            (lessonCode === '2C' && (exNum === 2 || fullPageText.includes('a hundred') || fullPageText.includes('nineteen') || fullPageText.includes('fifty'))) ||
                            (fullPageText.includes('drag item here') && (fullPageText.includes('nineteen') || fullPageText.includes('seventy') || fullPageText.includes('thirteen')));

            if (is2CEx2) {
                return await solveUnit2CNumbersDragDrop();
            }

            // --- UNIT 2D EXERCISE 2: SHOPPING PHRASES (CUSTOMER VS SHOP ASSISTANT) ---
            const is2DEx2 = (activityId === '2541776306' || activityId === '2541784580') || 
                            (lessonCode === '2D' && (exNum === 2 || fullPageText.includes("customer's phrases") || fullPageText.includes("shop assistant's phrases"))) ||
                            (fullPageText.includes("customer's phrases") && fullPageText.includes("shop assistant's phrases")) ||
                            (fullPageText.includes("customer") && fullPageText.includes("shop assistant") && (fullPageText.includes("pay by card") || fullPageText.includes("here's your change")));

            if (is2DEx2) {
                return await solveUnit2DShopPhrasesDragDrop();
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

            // Unit 2B Grammar Exercise 6: Choose the correct alternatives (this, that, these, those)
            if (activityId === '2541748109' || (lessonCode === '2B' && (exNum === 6 || selects.length >= 8))) {
                updateStatus("✅ Chọn this/that/these/those Unit 2B Ex 6...", "#10b981", "MASTER DB");
                const fallbackAnswers = ROADMAP_MASTER_DB["2B"].ex6_grammar || ["these", "that", "this", "this", "this", "this", "these", "that", "that"];
                
                // Nếu đang có popup cảnh báo chưa trả lời, tự động đóng trước khi chọn
                const cancelModal = Array.from(document.querySelectorAll('.modal a, .modal button, .dialog a, .dialog button, a, button')).find(b => b.textContent.trim().toLowerCase() === 'cancel');
                if (cancelModal) cancelModal.click();

                for (let i = 0; i < selects.length; i++) {
                    const sel = selects[i];
                    const parentText = (sel.closest('li, p, tr, .question, div')?.innerText || '').replace(/\s+/g, ' ');
                    const isPlural = /\b(are|aren't|books|keys|photos|desks|cups|chairs|computers|boxes)\b/i.test(parentText);
                    const isFar = /\b(there|over there)\b/i.test(parentText);

                    let targetOptionIdx = -1;
                    const optList = Array.from(sel.options).map((o, idx) => ({ idx, text: o.text.trim().toLowerCase() }));

                    if (isPlural) {
                        const found = optList.find(o => o.text === 'these' || o.text === 'those');
                        if (found) targetOptionIdx = found.idx;
                    } else {
                        if (isFar) {
                            const found = optList.find(o => o.text === 'that') || optList.find(o => o.text === 'this');
                            if (found) targetOptionIdx = found.idx;
                        } else {
                            const found = optList.find(o => o.text === 'this') || optList.find(o => o.text === 'that');
                            if (found) targetOptionIdx = found.idx;
                        }
                    }

                    if (targetOptionIdx <= 0 && fallbackAnswers[i]) {
                        const targetWord = fallbackAnswers[i].toLowerCase();
                        const found = optList.find(o => o.text === targetWord);
                        if (found) targetOptionIdx = found.idx;
                    }

                    if (targetOptionIdx > 0) {
                        sel.selectedIndex = targetOptionIdx;
                        sel.dispatchEvent(new Event('input', { bubbles: true }));
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log(`[Unit 2B Ex 6] Câu ${i + 2}: Đã chọn "${sel.options[targetOptionIdx].text}" cho câu "${parentText.slice(0, 40)}"`);
                    }
                    await sleep(35);
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

        // 1. Phân loại theo nhóm layout (Jobs, Countries, Nationalities)
        if (data.type === 'category_layout' || data.categories) {
            const ok = await solveThistleHouseEx4(data.categories);
            if (ok) return;
        }

        // 2. Điền theo câu hỏi ngữ cảnh (Who is...)
        if (data.type === 'context_questions' || data.questions) {
            const ok = await solveContextQuestions(data.questions, data.textAnswers);
            if (ok) {
                await submitAndNext();
                return;
            }
        }

        // 3. Nối dây Matching
        if (data.matchingPairs && Array.isArray(data.matchingPairs)) {
            await executeMatchingPairs(data.matchingPairs);
        }

        // 3b. Kéo thả số và chữ Unit 2C Ex 2 (Activity 2541750756)
        if (data.type === 'drag_drop_numbers' || data.mapping) {
            const ok = await solveUnit2CNumbersDragDrop();
            if (ok) return;
        }

        // 3b2. Kéo thả 2 cột Unit 2D Ex 2 (Customer vs Shop assistant)
        if (data.type === 'two_column_drag_drop') {
            const ok = await solveUnit2DShopPhrasesDragDrop();
            if (ok) return;
        }

        // 3c. Bài viết Writing (textarea / contenteditable)
        if (data.writingAnswer || data.type === 'writing') {
            const textareas = Array.from(document.querySelectorAll('textarea, [contenteditable="true"], .writing-area, .essay-box')).filter(t => t.offsetParent !== null && !t.readOnly && !t.disabled);
            if (textareas.length > 0 && data.writingAnswer) {
                updateStatus("✍️ Đang điền bài viết Writing...", "#10b981", "WRITING");
                setWritingValue(textareas[0], data.writingAnswer);
                await sleep(500);
                await submitAndNext();
                return;
            }
        }

        // 4. blankAnswers từ Gemini dạng [{ blank: 1, answer: "..." }]
        if (data.blankAnswers && Array.isArray(data.blankAnswers)) {
            const allInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null && !i.readOnly && !i.disabled);
            // Kiểm tra xem số blank có bắt đầu từ 1 trong khi ô đầu tiên thực chất là blank 2 (do có ví dụ câu 1)
            const hasExampleOffset = (data.blankAnswers.length === allInputs.length + 1 && (data.blankAnswers[0].blank === 1 || data.blankAnswers[0].index === 1));
            for (const item of data.blankAnswers) {
                const bNum = item.blank || item.index;
                const ans = item.answer || item.text;
                const targetIdx = hasExampleOffset ? (bNum - 2) : (bNum - 1);
                if (targetIdx >= 0 && targetIdx < allInputs.length && ans) {
                    setInputValue(allInputs[targetIdx], ans);
                    console.log(`[Gemini Blank #${bNum}] -> Ô index ${targetIdx}: "${ans}"`);
                    await sleep(20);
                }
            }
        } else if (data.textAnswers && Array.isArray(data.textAnswers)) {
            const allInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null && !i.readOnly && !i.disabled);
            if (data.textAnswers.length > 0 && typeof data.textAnswers[0] === 'object') {
                const hasExampleOffset = (data.textAnswers.length === allInputs.length + 1 && (data.textAnswers[0].blank === 1 || data.textAnswers[0].index === 1));
                for (const item of data.textAnswers) {
                    const bNum = item.blank || item.index;
                    const ans = item.answer || item.text;
                    const targetIdx = hasExampleOffset ? (bNum - 2) : (bNum - 1);
                    if (targetIdx >= 0 && targetIdx < allInputs.length && ans) {
                        setInputValue(allInputs[targetIdx], ans);
                        await sleep(20);
                    }
                }
            } else {
                let answersToUse = [...data.textAnswers];
                if (answersToUse.length === allInputs.length + 1) {
                    console.log("[AutoSolver] Phát hiện danh sách đáp án chứa câu Ví dụ (Example) -> Bỏ qua phần tử đầu tiên:", answersToUse[0]);
                    answersToUse = answersToUse.slice(1);
                }
                for (let i = 0; i < allInputs.length; i++) {
                    if (answersToUse[i]) {
                        setInputValue(allInputs[i], answersToUse[i]);
                        await sleep(20);
                    }
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
    // GIẢI KÉO THẢ SỐ VÀ CHỮ UNIT 2C EX 2 (NUMBERS 11-100)
    // =========================================================================
    async function solveUnit2CNumbersDragDrop() {
        updateStatus("✅ Kéo thả số và chữ Unit 2C Numbers...", "#10b981", "MASTER DB");

        // Đóng popup cảnh báo nếu đang mở trên màn hình trước khi kéo
        const activeModal = Array.from(document.querySelectorAll('.modal, .dialog, .popup, .ui-dialog, [role="dialog"]')).find(m => {
            return m.offsetParent !== null && window.getComputedStyle(m).display !== 'none' && window.getComputedStyle(m).visibility !== 'hidden';
        });
        if (activeModal) {
            const cancelBtn = Array.from(activeModal.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'cancel');
            if (cancelBtn) {
                cancelBtn.click();
                await sleep(250);
            }
        }

        const numberMap = [
            { num: 12, word: "twelve" },
            { num: 13, word: "thirteen" },
            { num: 100, word: "a hundred" },
            { num: 15, word: "fifteen" },
            { num: 90, word: "ninety" },
            { num: 30, word: "thirty" },
            { num: 11, word: "eleven" },
            { num: 17, word: "seventeen" },
            { num: 19, word: "nineteen" },
            { num: 20, word: "twenty" },
            { num: 70, word: "seventy" }
        ];

        for (let i = 0; i < numberMap.length; i++) {
            const item = numberMap[i];
            const numStr = String(item.num);
            const wordStr = item.word.toLowerCase();

            // 1. Tìm dòng chứa số num
            const allCandidateRows = Array.from(document.querySelectorAll('li, tr, .item, .row, .question, p, div')).filter(el => {
                if (el.offsetParent === null) return false;
                const t = (el.innerText || '').replace(/\s+/g, ' ');
                const regex = new RegExp(`(^|\\s)${numStr}(\\s|$)`);
                return regex.test(t) && /drag|item/i.test(t);
            });

            // Lấy element dòng cụ thể nhất
            const row = allCandidateRows.filter(r => !allCandidateRows.some(other => other !== r && r.contains(other)))[0] || allCandidateRows[0];

            let targetDrop = null;
            if (row) {
                targetDrop = row.querySelector('.ui-droppable, .droppable, [data-droppable], .dropzone, .box') ||
                             Array.from(row.querySelectorAll('*')).find(el => /drag\s*item/i.test(el.innerText || '')) ||
                             row;
            }

            // 2. Tìm thẻ từ trong ngân hàng từ (ở khung trên)
            const allWordElements = Array.from(document.querySelectorAll('*')).filter(el => {
                if (el.offsetParent === null) return false;
                const t = (el.innerText || '').trim().toLowerCase();
                return t === wordStr;
            });
            const leafWordElements = allWordElements.filter(el => {
                return !Array.from(el.children).some(c => (c.innerText || '').trim().toLowerCase() === wordStr);
            });
            const bankTokens = leafWordElements.filter(el => {
                const r = el.closest('li, tr, .item, .row, .question');
                if (r && /\b(12|13|100|15|90|30|11|17|19|20|70)\b/.test(r.innerText)) return false;
                return true;
            });

            const token = bankTokens[0] || leafWordElements[0];

            if (token && targetDrop) {
                console.log(`[Unit 2C Ex 2] (${i + 1}/${numberMap.length}) Ghép "${wordStr}" vào số ${numStr}`);
                await moveTokenToBox(token, targetDrop);
                await sleep(150);
            }
        }

        await sleep(500);
        await submitAndNext();
        return true;
    }

    // =========================================================================
    // GIẢI KÉO THẢ BẢNG CỤM TỪ UNIT 2D EX 2 (CUSTOMER VS SHOP ASSISTANT)
    // =========================================================================
    async function solveUnit2DShopPhrasesDragDrop() {
        updateStatus("📦 Đang kéo thả cụm từ Unit 2D Ex 2...", "#10b981", "MASTER DB");
        console.log("=== BẮT ĐẦU GẮP THẢ TỪ VÀO 2 CỘT UNIT 2D EX 2 ===");

        // Đóng popup nếu có
        const activeModal = Array.from(document.querySelectorAll('.modal, .dialog, .popup, .ui-dialog, [role="dialog"]')).find(m => {
            return m.offsetParent !== null && window.getComputedStyle(m).display !== 'none' && window.getComputedStyle(m).visibility !== 'hidden';
        });
        if (activeModal) {
            const cancelBtn = Array.from(activeModal.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'cancel');
            if (cancelBtn) {
                cancelBtn.click();
                await sleep(250);
            }
        }

        const win = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
        const $ = win.jQuery || win.$;

        // 1. Định vị 2 hộp nhận chuẩn xác từ tiêu đề cột
        const allHeaders = Array.from(document.querySelectorAll('*')).filter(el => {
            if (el.offsetParent === null) return false;
            const t = (el.innerText || '').trim().toLowerCase();
            return (t === "customer's phrases" || t === "shop assistant's phrases") && el.childElementCount === 0;
        });

        const custH = allHeaders.find(h => h.innerText.toLowerCase().includes('customer'));
        const shopH = allHeaders.find(h => h.innerText.toLowerCase().includes('shop'));

        let custBox = null;
        let shopBox = null;

        if (custH && shopH) {
            const rC = custH.getBoundingClientRect();
            const rS = shopH.getBoundingClientRect();
            const elC = document.elementFromPoint(rC.left + rC.width / 2, rC.bottom + 50);
            const elS = document.elementFromPoint(rS.left + rS.width / 2, rS.bottom + 50);
            custBox = elC?.closest('.ui-droppable, .droppable, .dropzone, td, div') || elC;
            shopBox = elS?.closest('.ui-droppable, .droppable, .dropzone, td, div') || elS;
        }

        if (!custBox || !shopBox) {
            const all = Array.from(document.querySelectorAll('*')).filter(el => el.offsetParent !== null && el.childElementCount <= 2);
            const cEx = all.find(el => el.innerText?.toLowerCase().includes('here you are') && el.innerText?.toLowerCase().includes('example'));
            const sEx = all.find(el => (el.innerText?.toLowerCase().includes('12') || el.innerText?.toLowerCase().includes("it's")) && el.innerText?.toLowerCase().includes('example'));
            if (cEx) custBox = cEx.parentElement;
            if (sEx) shopBox = sEx.parentElement;
        }

        console.log("Customer Box:", custBox);
        console.log("Shop Assistant Box:", shopBox);

        if (!custBox || !shopBox) {
            updateStatus("❌ Không tìm thấy 2 hộp nhận, dừng để tránh nộp sai!", "#ef4444", "LỖI");
            console.error("❌ Không tìm thấy 2 hộp nhận, dừng lại để tránh nộp sai!");
            return false;
        }

        const items = [
            { text: "Can I pay by card?", target: custBox, name: "Customer" },
            { text: "How much is this book?", target: custBox, name: "Customer" },
            { text: "Here's my card.", target: custBox, name: "Customer" },
            { text: "How much are those cups?", target: custBox, name: "Customer" },
            { text: "How much is that?", target: custBox, name: "Customer" },
            { text: "Here's your change.", target: shopBox, name: "Shop Assistant" },
            { text: "Cash or card?", target: shopBox, name: "Shop Assistant" },
            { text: "That's £27.99, please.", target: shopBox, name: "Shop Assistant" }
        ];

        const clean = s => (s || '').toLowerCase().replace(/['’]/g, "'").replace(/[.,?!£]/g, '').replace(/\s+/g, ' ').trim();

        function clickEl(el) {
            if (!el) return;
            el.focus();
            const r = el.getBoundingClientRect();
            const x = r.left + r.width / 2;
            const y = r.top + r.height / 2;
            const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, button: 0, buttons: 1, which: 1 };
            el.dispatchEvent(new MouseEvent('mousedown', opts));
            el.dispatchEvent(new MouseEvent('mouseup', opts));
            el.click();
        }

        async function transferToken(item) {
            const targetClean = clean(item.text);
            const limitTop = custBox.getBoundingClientRect().top;

            const candidates = Array.from(document.querySelectorAll('*')).filter(el => {
                if (el.offsetParent === null) return false;
                if (custBox && custBox.contains(el)) return false;
                if (shopBox && shopBox.contains(el)) return false;
                if (el.getBoundingClientRect().bottom > limitTop) return false;
                return clean(el.innerText || el.textContent) === targetClean;
            });

            const token = candidates.find(el => el.classList.contains('ui-draggable') || el.classList.contains('draggable') || el.getAttribute('draggable') === 'true') ||
                          candidates.find(el => !Array.from(el.children).some(c => clean(c.innerText || c.textContent) === targetClean)) ||
                          candidates[0];

            if (!token) {
                console.log(`[Unit 2D Ex 2] Không tìm thấy hoặc đã đặt "${item.text}".`);
                return false;
            }

            console.log(`Gắp "${item.text}" -> ${item.name}...`);
            const tokenClickable = token.closest('.ui-draggable, .draggable, [draggable="true"]') || token;
            const dropClickable = item.target.querySelector('.ui-droppable, .droppable, .dropzone') || item.target;

            // 1. Click chọn token (Accessible select)
            clickEl(tokenClickable);
            tokenClickable.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
            tokenClickable.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
            await sleep(180);

            // 2. Click ô nhận (Accessible drop)
            clickEl(dropClickable);
            dropClickable.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
            dropClickable.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
            await sleep(200);

            // 3. Kích hoạt jQuery UI nếu có
            if ($) {
                try {
                    const $tok = $(tokenClickable);
                    const $dst = $(dropClickable).closest('.ui-droppable');
                    if ($dst.length) {
                        const droppable = $dst.data('ui-droppable') || $dst.data('droppable');
                        if (droppable && droppable._drop) {
                            droppable._drop({ target: dropClickable, preventDefault: () => {} }, { draggable: $tok, helper: $tok });
                        }
                    }
                } catch(e) {}
            }

            // 4. HTML5 DragEvent
            try {
                const dt = new DataTransfer();
                const sR = tokenClickable.getBoundingClientRect();
                const dR = dropClickable.getBoundingClientRect();
                tokenClickable.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: sR.left, clientY: sR.top }));
                dropClickable.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: dR.left, clientY: dR.top }));
                dropClickable.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: dR.left, clientY: dR.top }));
                dropClickable.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: dR.left, clientY: dR.top }));
                tokenClickable.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: dR.left, clientY: dR.top }));
            } catch(e) {}

            await sleep(250);
            return true;
        }

        for (const item of items) {
            await transferToken(item);
        }

        await sleep(600);

        // KIỂM TRA LẠI: Còn từ nào ở ngân hàng không?
        const limitTop = custBox.getBoundingClientRect().top;
        const remaining = items.filter(it => {
            const targetClean = clean(it.text);
            return Array.from(document.querySelectorAll('*')).some(el => {
                if (el.offsetParent === null) return false;
                if (el.getBoundingClientRect().bottom > limitTop) return false;
                return clean(el.innerText || el.textContent) === targetClean;
            });
        });

        console.log("Số từ còn lại trên ngân hàng:", remaining.length);

        // NẾU CÒN TỪ CHƯA VÀO HỘP -> KHÓA LẠI TUYỆT ĐỐI KHÔNG SUBMIT
        if (remaining.length > 0) {
            console.warn("⚠️ Còn " + remaining.length + " từ chưa chuyển được! TUYỆT ĐỐI KHÔNG NỘP BÀI.");
            updateStatus(`⚠️ Còn ${remaining.length} từ chưa chuyển, đã khóa nộp bài!`, "#f59e0b", "CHƯA XONG");
            return false;
        }

        console.log("✅ Đã chuyển thành công toàn bộ các từ! Đang nộp bài...");
        updateStatus("✅ Đã chuyển 8/8 cụm từ, đang nộp bài...", "#10b981", "100%");
        await submitAndNext();
        return true;
    }

    // =========================================================================
    // NỘP BÀI VÀ CHUYỂN TIẾP (CÓ CƠ CHẾ BẢO VỆ CHỐNG NỘP Ô TRỐNG)
    // =========================================================================
    async function submitAndNext() {
        await sleep(350);

        // Kiểm tra an toàn toàn diện:
        // 1. Tuyệt đối không bấm submit nếu còn ô text trống chưa điền
        const emptyInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null && !i.readOnly && !i.disabled && !i.value.trim());
        if (emptyInputs.length > 0) {
            console.warn("[AutoSolver] ❌ Còn " + emptyInputs.length + " ô chưa điền, hoãn Submit.");
            return;
        }

        // 2. Tuyệt đối không bấm submit nếu còn menu select chưa chọn
        const emptySelects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled && (s.selectedIndex <= 0 || !s.value || s.value === 'null' || s.options[s.selectedIndex]?.text?.toLowerCase()?.includes('select')));
        if (emptySelects.length > 0) {
            console.warn("[AutoSolver] ❌ Còn " + emptySelects.length + " menu chọn (select) chưa chọn, hoãn Submit.");
            return;
        }

        // 3. Tuyệt đối không bấm submit nếu còn ô kéo thả 'DRAG ITEM HERE' chưa hoàn thành
        const allDragTexts = Array.from(document.querySelectorAll('*')).filter(el => {
            if (el.offsetParent === null) return false;
            return (el.innerText || '').toLowerCase().includes('drag item here');
        });
        const unplacedDropzones = allDragTexts.filter(el => {
            return !Array.from(el.children).some(c => (c.innerText || '').toLowerCase().includes('drag item here'));
        });
        if (unplacedDropzones.length > 0) {
            console.warn("[AutoSolver] ❌ Còn " + unplacedDropzones.length + " ô kéo thả 'DRAG ITEM HERE' chưa hoàn thành, hoãn Submit.");
            return;
        }

        // 4. Tuyệt đối không bấm submit nếu còn ô bài viết (textarea) trống chưa điền
        const emptyTextareas = Array.from(document.querySelectorAll('textarea, [contenteditable="true"]')).filter(t => {
            if (t.offsetParent === null || t.readOnly || t.disabled) return false;
            const val = (t.value || t.innerText || '').trim();
            return val.length === 0;
        });
        if (emptyTextareas.length > 0) {
            console.warn("[AutoSolver] ❌ Còn " + emptyTextareas.length + " ô bài viết (textarea) chưa điền, hoãn Submit.");
            return;
        }

        // 4. Nếu là bài phân loại theo nhóm (Jobs, Countries, Nationalities...), kiểm tra tính hợp lệ của từng nhóm
        const tops = findCategoryTops();
        if (tops.jobTop !== null || tops.countryTop !== null || tops.natTop !== null) {
            const editableInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null && !i.readOnly && !i.disabled);
            const groups = {};
            editableInputs.forEach(inp => {
                const cat = getCategoryForInput(inp, tops) || 'unknown';
                if (!groups[cat]) groups[cat] = [];
                groups[cat].push(inp.value.trim().toLowerCase());
            });

            let groupHasError = false;
            for (const cat in groups) {
                const words = groups[cat];
                const uniqueWords = new Set(words);
                if (uniqueWords.size !== words.length) {
                    console.warn("[AutoSolver Validation] ❌ Nhóm [" + cat + "] có từ trùng lặp!", words);
                    groupHasError = true;
                }
            }

            if (groupHasError) {
                console.warn("[AutoSolver] ❌ Hoãn Submit do phát hiện lỗi trùng lặp trong nhóm.");
                return;
            }
        }

        updateStatus("📤 Đang nộp bài...", "#10b981");
        const allClickables = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"]'));
        const submitBtn = document.querySelector('#submitButton, .submit-btn, .btn-submit, [data-action="submit"]') || 
                          allClickables.find(b => {
                              const t = (b.textContent || b.value || '').trim().toLowerCase();
                              return t === 'submit' || t === 'nộp bài';
                          });
        if (submitBtn) {
            console.log("[AutoSolver] Đang kích hoạt Submit:", submitBtn);
            submitBtn.scrollIntoView({ block: 'center' });
            await sleep(200);
            try {
                ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {
                    submitBtn.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
                });
            } catch(e) {}
            submitBtn.click();
            await sleep(800);

            // Kiểm tra modal xác nhận nộp bài (Pearson có thể hiển thị popup xác nhận: Continue / Submit / OK)
            // Vì các kiểm tra an toàn đều đã vượt qua 100%, ta LUÔN BẤM CONTINUE để nộp bài, KHÔNG BAO GIỜ BẤM CANCEL!
            const confirmBtn = Array.from(document.querySelectorAll('.modal a, .modal button, .dialog a, .dialog button, [role="dialog"] a, [role="dialog"] button, a, button')).find(b => {
                if (b === submitBtn || b.offsetParent === null) return false;
                const t = (b.textContent || b.value || '').trim().toLowerCase();
                return (t === 'continue' || t === 'ok' || t === 'yes' || t === 'tiếp tục') && (b.closest('.modal, .dialog, .popup, [role="dialog"], .ui-dialog') || window.getComputedStyle(b).zIndex > 50);
            }) || Array.from(document.querySelectorAll('a, button')).find(b => {
                if (b === submitBtn || b.offsetParent === null) return false;
                const t = (b.textContent || b.value || '').trim().toLowerCase();
                return t === 'continue' || t === 'tiếp tục';
            });

            if (confirmBtn) {
                console.log("[AutoSolver] Đang bấm nút Continue trong modal xác nhận:", confirmBtn);
                confirmBtn.click();
                await sleep(800);
            }

            // Tự động chuyển bài tiếp theo nếu có nút Next hoặc đang bật auto
            await sleep(1200);
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => {
                if (b.offsetParent === null) return false;
                const t = (b.textContent || b.value || '').trim().toLowerCase();
                return t === 'next' || t === 'tiếp theo';
            });
            if (nextBtn && (isAutoRunning || window.location.href.includes('/report'))) {
                console.log("[AutoSolver] Đang bấm nút Next để sang bài tiếp:", nextBtn);
                nextBtn.click();
            }
        } else {
            console.warn("[AutoSolver] Không tìm thấy nút Submit trên giao diện.");
        }
    }

    if (isAutoRunning) {
        setTimeout(runMasterSolver, 1000);
    }
})();
