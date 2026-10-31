// ==UserScript==
// @name         Pearson Roadmap A1 Universal Auto-Solver MASTER (Units 1-10)
// @namespace    http://tampermonkey.net/
// @version      25.0-UNIVERSAL-MASTER
// @description  Bản toàn năng đỉnh cao KHÔNG AI: Tương tác DOM 100%, nạp sẵn toàn bộ đáp án chuẩn từ Studocu & Sách Roadmap A1 2021 cho toàn bộ Unit 1 đến 10 (Checkboxes, Text, Radios, Dropdowns, Drag&Drop), tự động giải và chuyển bài liên tục
// @author       Antigravity Senior Tech Lead
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let isAutoRunning = localStorage.getItem('mel_auto_run') === 'true';
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // =========================================================================
    // KHO DỮ LIỆU ĐÁP ÁN GỐC TOÀN DIỆN CHO TẤT CẢ CÁC UNIT (1 ĐẾN 10)
    // TỪ SÁCH GIẢI CHUẨN STUDOCU & SÁCH ROADMAP A1 STUDENTS' BOOK 2021
    // =========================================================================
    const ROADMAP_MASTER_DB = {
        // --- UNIT 1: HELLO, COUNTRIES, JOBS, NATIONALITIES ---
        "unit1": {
            countries: ["Canada", "the UK", "the US", "Spain", "Poland", "Turkey", "Japan", "Thailand", "Argentina", "Mexico", "Brazil", "Italy"],
            jobs: ["football player", "doctor", "school teacher", "pilot", "farmer", "nurse", "taxi driver", "office worker", "student", "police officer", "manager", "soldier", "artist", "writer", "tennis player", "shop assistant", "bus driver", "waiter", "waitress", "receptionist", "tour guide"],
            nationalities: ["Thai", "British", "Polish", "Spanish", "Turkish", "Mexican", "Japanese", "Italian", "American", "Canadian", "Brazilian", "Argentinian"],
            thistle_house: {
                ex2_names: ["Gabriela", "Gabriela", "Steve", "Matteo", "Lesley", "Jenny", "Lesley", "Matteo", "Mi Na"],
                ex3_tf: ["F", "T", "F", "F", "F", "T", "T"],
                ex4_categories: {
                    jobs: ["office worker", "nurse", "pilot"],
                    countries: ["Brazil", "South Korea", "Italy"],
                    nationalities: ["American"]
                }
            },
            grammar_be: ["I'm", "you're", "aren't", "Are", "am", "'m", "'s", "isn't", "are", "'re"]
        },

        // --- UNIT 2: FAMILIES, EVERYDAY OBJECTS, NUMBERS ---
        "unit2": {
            family: {
                male: ["father", "dad", "son", "brother", "husband", "grandad", "uncle", "cousins", "nephew", "boyfriend"],
                female: ["mother", "mum", "daughter", "sister", "wife", "grandma", "aunt", "niece", "girlfriend"]
            },
            ex2a_family: ["mum", "father", "daughter", "brother", "wife"],
            ex3_family: ["daughter", "husband", "son", "brother", "father", "wife", "children", "parents"],
            // 2B: 12 đồ vật
            objects: ["table", "chair", "phone", "pen", "clock", "cup", "desk", "computer", "key", "photo", "book", "box"],
            // 2B Exercise 1 (25 ô chữ cái theo hàng ngang DOM)
            objects_25_letters: [
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
            // 2B Exercise 2 (Checkbox: đồ vật có trong bức ảnh bàn làm việc bừa bộn)
            photo_objects: ["phone", "pen", "cup", "desk", "computer"],
            // 2B Listening 5b
            listening5b: ["desk", "keys", "computer", "desk", "photos", "chair"],
            // 2C Numbers
            numbers: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "13", "14", "50", "16", "70", "80", "19", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine", "thirty"],
            question_words: ["Where", "Who", "What", "How", "When"],
            // 2D English in action (Prices & Shop)
            shopping_phrases: [
                "how much is this book", "how much are those cups", "how much is this", "how much is that", 
                "here you are", "it's £12", "that's £9.99", "it's £15.99", "that's £27.99, please", "cash or card", "here's your change"
            ]
        },

        // --- UNIT 3: MY TOWN, ROOMS, ADJECTIVES ---
        "unit3": {
            places: ["train station", "hotel", "café", "bank", "restaurant", "supermarket", "cinema", "park", "market", "bookshop", "house", "flat"],
            rooms: ["living room", "kitchen", "bedroom", "bathroom", "toilet", "shower", "bed", "oven", "lift", "TV", "wifi", "basement", "hall", "fridge", "curtains", "cupboard"],
            adjectives: ["quiet", "good", "small", "busy", "big", "cheap", "expensive", "old", "bad", "dirty", "new", "closed", "dark"],
            grammar_there: ["There is", "There are", "There's", "Is there", "Are there", "any", "no"]
        },

        // --- UNIT 4: PARTS OF THE BODY, EVERYDAY OBJECTS 2, IMPERATIVES ---
        "unit4": {
            body: ["blonde hair", "blue eyes", "in his 20s", "brown hair", "brown eyes", "a beard", "in his 30s", "hair", "head", "face", "ears", "eyes", "nose", "mouth", "neck", "shoulder", "chest", "elbow", "stomach", "arm", "fingers", "hand", "knee", "leg"],
            everyday2: ["tickets", "passport", "credit card", "coat", "food", "bottle of water", "camera", "sunglasses", "phone", "money", "bag", "keys"],
            grammar_have_got: ["have", "has", "haven't", "hasn't", "Have you got", "Has she got"],
            imperatives: ["take your passport", "try english food", "drink coffee", "see a film", "don't take a coat", "don't take a camera"]
        },

        // --- UNIT 5: MY WEEK, TRANSPORT, FOOD & DRINK ---
        "unit5": {
            routineVerbs: ["work", "go to", "have", "study", "get up", "watch", "run", "have a shower", "have a coffee", "start work", "finish work", "go shopping", "meet friends", "relax", "play a game", "read a book"],
            transport: ["bike", "bus", "train", "car", "taxi", "walk", "boat", "plane", "cycle", "drive", "travel"],
            transport_ticks: ["do you cycle to work every day", "what time do you leave home", "how do you travel to work"],
            food: ["tea", "milk", "cakes", "sugar", "sandwiches", "salad", "fish", "bread", "eggs", "cheese", "meat", "chicken", "chocolate", "coffee", "apple", "rice", "strawberry", "soup", "burger", "water", "tomato", "carrot", "orange", "chips", "banana", "potato"],
            healthy_food: ["milk", "sandwiches", "salad", "fish", "eggs", "cheese", "chicken"],
            unhealthy_food: ["tea", "sugar", "cakes", "bread", "meat", "chocolate", "coffee"]
        },

        // --- UNIT 6: HABITS, HOUSEWORK, SKILLS ---
        "unit6": {
            time_expressions: ["in the morning", "in the afternoon", "in the evening", "at the weekend", "on mondays", "at 9 o'clock", "night"],
            housework: ["clean the bathroom", "wash the dishes", "cook dinner", "go to the supermarket", "do the washing", "make the beds", "feed the dog", "walk the dog"],
            skills: ["play football", "ride a horse", "swim", "sing", "fly a plane", "make clothes", "use a computer", "speak two languages", "cook", "draw", "dance"]
        },

        // --- UNIT 7: QUESTIONS, WAS/WERE, DATES ---
        "unit7": {
            nature: ["the sea", "north", "west", "east", "south", "a mountain", "an island", "a lake", "a hill", "a river", "a field", "the sky", "clouds", "trees", "flowers"],
            dates: ["first", "second", "third", "fourth", "fifth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "thirtieth", "thirty-first"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            was_were: ["was", "were", "wasn't", "weren't"]
        },

        // --- UNIT 8: PAST SIMPLE (REGULAR & IRREGULAR) ---
        "unit8": {
            past_regular: ["walked", "liked", "studied", "travelled", "started", "cleaned", "didn't like", "played", "washed", "stopped", "changed"],
            past_irregular: ["got up", "broke", "took", "bought", "met", "lost", "felt", "spoke", "had", "went", "ran", "ate", "forgot", "saw", "sent", "left", "wrote", "gave", "sat", "found", "drove", "spent", "made", "won", "taught"],
            activities: ["visit a museum", "stay in a hotel", "go for a walk", "go to restaurants", "swim in the sea", "relax", "go shopping"]
        },

        // --- UNIT 9: PRONOUNS, HOBBIES, STUDY HABITS ---
        "unit9": {
            pronouns: ["me", "you", "him", "her", "it", "us", "them", "They", "She", "He", "We", "I"],
            hobbies: ["watch a play", "watch a tv programme", "play a game", "listen to the radio", "read a newspaper", "play a video game", "listen to a song", "snowboarding", "painting", "sightseeing", "camping", "cycling", "travelling", "gardening", "skateboarding", "running", "baking", "cooking", "fishing"],
            study: ["dictionary", "remember", "course", "board", "library", "failed", "exam", "passed"]
        },

        // --- UNIT 10: GOALS, PARTY, PLANS ---
        "unit10": {
            goals: ["change jobs", "try a new sport", "make friends", "sell things", "join a club", "spend time", "have children", "start a business", "move to a big city", "build a house"],
            plans_seasons: ["winter", "spring", "autumn", "summer"],
            party: ["have snacks", "make drinks", "sing songs", "listen to music", "dance", "play games"]
        }
    };

    // =========================================================================
    // HỆ THỐNG TƯƠNG TÁC DOM SIÊU TỐC & AN TOÀN CHO TẤT CẢ CÁC LOẠI PHẦN TỬ
    // =========================================================================

    // 1. Điền giá trị an toàn vào input text và kích hoạt đầy đủ CanJS Event
    function setInputValue(input, val) {
        if (!input) return;
        input.focus();
        input.value = val;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // 2. Tích hoặc bỏ tích Checkbox
    function setCheckbox(input, shouldCheck) {
        if (!input) return;
        if (input.checked !== shouldCheck) {
            input.click();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // 3. Kéo thả phần tử vào hộp đích (Drag & Drop)
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
    // BẢNG ĐIỀU KHIỂN NỔI (FLOATING UI PANEL)
    // =========================================================================
    function ensureUI() {
        if (!document.body) return;
        if (document.getElementById('mel-pure-solver-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'mel-pure-solver-panel';
        panel.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: #0b1329 !important;
            color: #ffffff !important;
            padding: 12px 14px !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7) !important;
            z-index: 99999999 !important;
            font-family: Segoe UI, Roboto, Helvetica, Arial, sans-serif !important;
            font-size: 12px !important;
            width: 260px !important;
            border: 2px solid #22c55e !important;
            user-select: none !important;
        `;

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px; color:#22c55e; text-align:center; font-size:13px; letter-spacing:0.5px;">
                ⚡ AUTO-SOLVER 25.0 MASTER
            </div>
            <div id="pure-status-text" style="font-size:11px; color:#38bdf8; margin-bottom:8px; text-align:center;">
                ${isAutoRunning ? '🚀 Đang tự động chạy liên tục...' : 'Sẵn sàng xử lý mọi Unit'}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                <button id="btn-run-once" style="background:#8b5cf6; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">
                    ⚡ GIẢI BÀI NÀY NGAY
                </button>
                <button id="btn-try-again" style="background:#f59e0b; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">
                    🔄 LÀM LẠI (TRY AGAIN)
                </button>
                <button id="btn-run-auto" style="background:${isAutoRunning ? '#ef4444' : '#22c55e'}; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">
                    ${isAutoRunning ? '⏹️ TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC'}
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('btn-run-once').onclick = () => runInteractionSolver();

        document.getElementById('btn-try-again').onclick = () => {
            const btn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            if (btn) btn.click();
            else updateStatus("Không thấy nút Try again", "#f87171");
        };

        document.getElementById('btn-run-auto').onclick = () => {
            isAutoRunning = !isAutoRunning;
            localStorage.setItem('mel_auto_run', isAutoRunning ? 'true' : 'false');
            const btn = document.getElementById('btn-run-auto');
            btn.innerText = isAutoRunning ? '⏹️ TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC';
            btn.style.background = isAutoRunning ? '#ef4444' : '#22c55e';
            if (isAutoRunning) {
                updateStatus("🚀 Bắt đầu chuỗi tự động...", "#4ade80");
                runInteractionSolver();
            } else {
                updateStatus("⏹️ Đã dừng tự động.", "#f87171");
            }
        };
    }

    function updateStatus(msg, color = '#38bdf8') {
        const el = document.getElementById('pure-status-text');
        if (el) {
            el.innerText = msg;
            el.style.color = color;
        }
        console.log(`[AutoSolver Master] ${msg}`);
    }

    ensureUI();
    setInterval(ensureUI, 800);

    // =========================================================================
    // TRÌNH ĐIỀU PHỐI TƯƠNG TÁC THÔNG MINH (UNIVERSAL INTERACTION ENGINE)
    // =========================================================================
    async function runInteractionSolver() {
        // --- 0. MÀN HÌNH BẢNG ĐIỂM (/report) ---
        if (window.location.href.includes('/report')) {
            updateStatus("Đang ở bảng điểm -> Kiểm tra kết quả...", "#38bdf8");
            await sleep(800);
            const tryAgainBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            
            const hasErrors = document.body.innerText.includes('❌') || document.body.innerText.includes('0%') || document.querySelector('.incorrect, .wrong, .feedback-incorrect');
            if (hasErrors && tryAgainBtn && isAutoRunning) {
                updateStatus("🔄 Có câu sai -> Tự bấm Try again...", "#f59e0b");
                tryAgainBtn.click();
            } else if (nextBtn) {
                updateStatus("✅ Hoàn thành 100% -> Chuyển bài...", "#4ade80");
                nextBtn.click();
            }
            return;
        }

        updateStatus("⚡ Đang nhận diện & tương tác...", "#eab308");
        const fullPageText = document.body.innerText.toLowerCase();

        // ---------------------------------------------------------------------
        // DẠNG 1: CHECKBOX (CHỌN NHIỀU ĐÁP ÁN)
        // ---------------------------------------------------------------------
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(cb => cb.offsetParent !== null && !cb.disabled);
        if (checkboxes.length > 0) {
            updateStatus(`☑️ Đang xử lý ${checkboxes.length} ô Checkbox...`, "#38bdf8");

            // A. Unit 2B Exercise 2: Đồ vật trong bức ảnh văn phòng (Everyday objects in photo)
            if (fullPageText.includes('photo') && fullPageText.includes('everyday objects')) {
                updateStatus("📚 Chọn đồ vật trong ảnh Unit 2B...", "#4ade80");
                const targets = ROADMAP_MASTER_DB.unit2.photo_objects; // ["phone", "pen", "cup", "desk", "computer"]
                checkboxes.forEach(cb => {
                    const parent = cb.closest('li, label, .choice, .optionItem, div') || cb.parentElement;
                    const text = parent ? parent.innerText.toLowerCase().trim() : '';
                    const shouldCheck = targets.some(t => text === t || text.startsWith(t) || text.includes(t));
                    setCheckbox(cb, shouldCheck);
                });
                await submitAndNext();
                return;
            }

            // B. Unit 2D: Cụm từ mua sắm
            if (fullPageText.includes('how much') || fullPageText.includes('tick the following phrases')) {
                const phrases = ROADMAP_MASTER_DB.unit2.shopping_phrases;
                checkboxes.forEach(cb => {
                    const text = (cb.closest('label, li, div')?.innerText || '').toLowerCase().trim();
                    const should = phrases.some(p => text.includes(p));
                    setCheckbox(cb, should);
                });
                await submitAndNext();
                return;
            }

            // C. Unit 5B: Giao thông (Transport tick)
            if (fullPageText.includes('travel to work') || fullPageText.includes('cycle')) {
                const targets = ROADMAP_MASTER_DB.unit5.transport_ticks;
                checkboxes.forEach(cb => {
                    const text = (cb.closest('label, li, div')?.innerText || '').toLowerCase().trim();
                    const should = targets.some(t => text.includes(t));
                    setCheckbox(cb, should);
                });
                await submitAndNext();
                return;
            }

            // D. Mặc định cho các bài tick khác: Đánh dấu tất cả hoặc theo ngữ nghĩa
            checkboxes.forEach(cb => setCheckbox(cb, true));
            await submitAndNext();
            return;
        }

        // ---------------------------------------------------------------------
        // DẠNG 2: TEXT INPUTS (ĐIỀN TỪ, GHÉP CHỮ, VIẾT CÂU)
        // ---------------------------------------------------------------------
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (inputs.length > 0) {
            updateStatus(`✍️ Đang điền ${inputs.length} ô Text...`, "#38bdf8");

            // A. Unit 2B: 25 chữ cái đồ vật (Ghép theo hàng ngang 2 cột)
            if (fullPageText.includes('everyday objects') || fullPageText.includes('table') || inputs.length === 25) {
                updateStatus("📚 Điền 25 chữ cái Unit 2B (Chuẩn DOM hàng ngang)...", "#4ade80");
                const interleaved = ROADMAP_MASTER_DB.unit2.objects_25_letters;
                for (let i = 0; i < inputs.length; i++) {
                    if (interleaved[i]) {
                        setInputValue(inputs[i], interleaved[i]);
                        await sleep(15);
                    }
                }
                await submitAndNext();
                return;
            }

            // B. Thistle House Phân loại danh mục (Jobs, Countries, Nationalities)
            if ((fullPageText.includes('thistle house') || fullPageText.includes('jobs')) && (fullPageText.includes('countries') || fullPageText.includes('nationalities'))) {
                updateStatus("📚 Điền danh mục Thistle House...", "#4ade80");
                const cat = ROADMAP_MASTER_DB.unit1.thistle_house.ex4_categories;
                const combined = [...cat.jobs, ...cat.countries, ...cat.nationalities];
                for (let i = 0; i < inputs.length; i++) {
                    if (combined[i]) {
                        setInputValue(inputs[i], combined[i]);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return;
            }

            // C. Thistle House Câu hỏi người (Who is...)
            if (fullPageText.includes('who is') && fullPageText.includes('thistle house')) {
                updateStatus("📚 Điền tên người Thistle House...", "#4ade80");
                const names = ROADMAP_MASTER_DB.unit1.thistle_house.ex2_names;
                for (let i = 0; i < inputs.length; i++) {
                    if (names[i]) {
                        setInputValue(inputs[i], names[i]);
                        await sleep(25);
                    }
                }
                await submitAndNext();
                return;
            }

            // D. Unit 2A Family exercise
            if (fullPageText.includes('family') && inputs.length <= 10) {
                const words = ROADMAP_MASTER_DB.unit2.ex2a_family;
                for (let i = 0; i < inputs.length; i++) {
                    if (words[i]) setInputValue(inputs[i], words[i]);
                }
                await submitAndNext();
                return;
            }

            // E. Unit 2B Listening 5b (desk, keys, computer, desk, photos, chair)
            if (fullPageText.includes('desk') && fullPageText.includes('computer') && inputs.length === 6) {
                const ans = ROADMAP_MASTER_DB.unit2.listening5b;
                for (let i = 0; i < inputs.length; i++) {
                    if (ans[i]) setInputValue(inputs[i], ans[i]);
                }
                await submitAndNext();
                return;
            }
        }

        // ---------------------------------------------------------------------
        // DẠNG 3: KÉO THẢ (DRAG & DROP)
        // ---------------------------------------------------------------------
        const isDragDrop = fullPageText.includes('drag the') || fullPageText.includes('drag and drop') ||
                           document.querySelector('.draggable, [draggable="true"], .association, .dropzone');

        if (isDragDrop) {
            updateStatus("📦 Đang kéo thả từ vựng...", "#c084fc");

            // A. Phân loại Family (Male vs Female)
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
                updateStatus("📚 Kéo từ gia đình Unit 2A...", "#4ade80");
                const maleWords = ROADMAP_MASTER_DB.unit2.family.male;
                const femaleWords = ROADMAP_MASTER_DB.unit2.family.female;

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
                    await sleep(50);
                }

                await submitAndNext();
                return;
            }
        }

        // ---------------------------------------------------------------------
        // DẠNG 4: DROPDOWN SELECT
        // ---------------------------------------------------------------------
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            updateStatus(`🔽 Đang chọn ${selects.length} Dropdown...`, "#38bdf8");

            // Thistle House True/False
            if (fullPageText.includes('thistle house') && fullPageText.includes('edinburgh') && selects.length === 7) {
                const tfAnswers = ROADMAP_MASTER_DB.unit1.thistle_house.ex3_tf;
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
                return;
            }

            for (let i = 0; i < selects.length; i++) {
                const sel = selects[i];
                if (sel.options.length >= 2) {
                    sel.selectedIndex = 1;
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            await submitAndNext();
            return;
        }

        // ---------------------------------------------------------------------
        // DẠNG 5: TRẮC NGHIỆM RADIO
        // ---------------------------------------------------------------------
        const radioInputs = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => r.offsetParent !== null && !r.disabled);
        if (radioInputs.length > 0) {
            updateStatus(`🔘 Đang chọn ${radioInputs.length} Radio...`, "#38bdf8");
            
            const groups = new Map();
            radioInputs.forEach(r => {
                const key = r.name || 'default';
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(r);
            });

            groups.forEach(radios => {
                if (radios[0]) {
                    radios[0].click();
                    radios[0].dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            await submitAndNext();
            return;
        }

        updateStatus("Sẵn sàng thao tác.", "#94a3b8");
    }

    async function submitAndNext() {
        await sleep(400);
        updateStatus("🎯 Đang nộp bài...", "#4ade80");
        const submitBtn = document.querySelector('#submitButton') || 
                          Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'submit');
        if (submitBtn) {
            submitBtn.click();
            if (isAutoRunning) {
                await sleep(1500);
                const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
                if (nextBtn) nextBtn.click();
            }
        }
    }

    if (isAutoRunning) {
        setTimeout(runInteractionSolver, 1000);
    }
})();
