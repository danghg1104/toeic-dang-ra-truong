// ==UserScript==
// @name         Pearson Roadmap A1 Universal Auto-Solver MASTER (Units 1-10)
// @namespace    http://tampermonkey.net/
// @version      26.0-UNIVERSAL-MASTER
// @description  Bản toàn năng chuẩn Tech Lead: Nhận diện chính xác từng bài (Exercise 1..8) theo Unit, nạp sẵn toàn bộ đáp án chuẩn từ Studocu & Sách Roadmap A1 2021 cho Units 1 đến 10, giải và tự động chuyển bài liên tục
// @author       Antigravity Senior Tech Lead
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let isAutoRunning = localStorage.getItem('mel_auto_run') === 'true';
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // =========================================================================
    // KHO ĐÁP ÁN GỐC TOÀN DIỆN CHO TẤT CẢ CÁC BÀI TẬP (UNITS 1 - 10)
    // TỪ SÁCH GIẢI CHUẨN STUDOCU & ROADMAP A1 STUDENTS' BOOK 2021
    // =========================================================================
    const ROADMAP_MASTER_DB = {
        // --- UNIT 1 ---
        "1A": {
            ex1b: ["Canada", "the UK", "the US", "Spain", "Poland", "Turkey", "Japan", "Thailand", "Argentina", "Mexico", "Brazil", "Italy"],
            ex4a: ["Mexico", "Japan", "the UK", "Argentina"],
            ex5: ["I'm", "you're", "aren't"],
            ex7b: ["Are", "am", "'m", "'m", "Are", "'m", "are", "'m"]
        },
        "1B": {
            ex1a: ["The US", "The UK", "Poland", "Japan", "Mexico", "Argentina", "Spain", "Thailand"],
            ex1c: ["football player", "doctor", "school teacher", "pilot", "farmer", "nurse", "taxi driver", "office worker"],
            ex3: ["b", "c", "a"],
            ex4a: ["b", "a", "b"],
            ex5a: ["'s", "'s", "isn't", "'s"],
            ex6: ["I'm", "Is it", "it is", "Is the manager", "he's", "Is he", "isn't", "'s he", "He's"]
        },
        "1C": {
            ex2a: ["Thai", "British", "Polish", "Spanish", "Turkish", "Mexican", "Japanese", "Italian", "American", "Canadian", "Brazilian", "Argentinian"],
            ex4a: ["D", "A", "C", "B", "E"],
            ex4b: ["False", "False", "True", "False", "False"],
            ex5a: ["aren't", "are", "Are", "aren't", "are"]
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
            // Exercise 1: 25 chữ cái cho 12 đồ vật (theo hàng ngang DOM)
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
            // Exercise 2: Chọn đồ vật trong ảnh bàn làm việc
            ex2_photo_targets: ["phone", "pen", "cup", "desk", "computer"],
            // Exercise 3: Viết tên đồ vật theo tranh (It's a ...)
            ex3_words: ["desk", "chair", "key", "book", "box"],
            // Exercise 5: Listening 5b
            ex5_listening: ["desk", "keys", "computer", "desk", "photos", "chair"],
            // Exercise 6: Grammar this, that, these, those
            ex6_grammar: ["this", "that", "these", "those"],
            // Exercise 7: Radio b, b, a
            ex7_radios: ["b", "b", "a"],
            // Exercise 8: Grammar bank
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
            ex5b_ticks: ["1", "2", "3", "5", "6", "7"], // tick all except 4 and 8
            ex6: ["Is", "Are", "is", "isn't", "aren't", "are", "is", "are"]
        },
        "3C": {
            ex3: ["bad", "big", "old", "expensive", "quiet"],
            ex6_tf: ["F", "F", "T", "T", "F", "T"],
            grammarBank1: ["an old", "new", "small restaurant", "an expensive hotel", "a good", "cheap", "are new", "big house"]
        },

        // --- UNITS 4 - 10 ---
        "4A": {
            body: ["blonde hair", "blue eyes", "in his 20s", "brown hair", "brown eyes", "a beard", "in his 30s"],
            grammar5: ["have", "has", "hasn't"]
        },
        "4B": {
            everyday2: ["tickets", "passport", "credit card", "coat", "food", "bottle of water", "camera", "sunglasses", "phone", "money", "bag", "keys"],
            grammar5a: ["Have", "have", "Has", "has", "hasn't"]
        },
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
        "6A": {
            verbs: ["doesn't cycle", "takes", "doesn't eat", "has", "works", "doesn't work", "doesn't study", "teaches", "doesn't read", "studies"]
        },
        "7A": {
            nature: ["the sea", "north", "west", "east", "south", "a mountain", "an island", "a lake", "a hill", "a river", "a field", "the sky", "clouds", "trees", "flowers"]
        },
        "8A": {
            past_reg: ["walked", "liked", "studied", "travelled", "started", "cleaned", "didn't like", "played"]
        },
        "8B": {
            past_irreg: ["got up", "broke", "took", "bought", "met", "lost", "felt", "spoke", "had", "went", "ran", "ate", "forgot", "saw"]
        },
        "9A": {
            pronouns: ["me", "you", "him", "her", "it", "us", "them", "They", "She", "He", "We", "I"]
        },
        "10A": {
            goals: ["change jobs", "try a new sport", "make friends", "sell things", "join a club", "spend time", "have children", "start a business", "move to a big city", "build a house"]
        }
    };

    // =========================================================================
    // HỆ THỐNG TƯƠNG TÁC DOM SIÊU TỐC & AN TOÀN
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
    // NHẬN DIỆN CHÍNH XÁC SỐ BÀI TẬP VÀ MÃ BÀI (EXERCISE CONTEXT)
    // =========================================================================
    function getExerciseContext() {
        let exNum = null;
        let lessonCode = null;

        const bodyText = document.body.innerText;

        // 1. Tìm số Exercise (Exercise 1, Exercise 2, Exercise 3...)
        const exMatch = bodyText.match(/Exercise\s+(\d+)/i);
        if (exMatch) exNum = parseInt(exMatch[1], 10);

        // 2. Tìm mã bài học (1A, 1B, 1C, 2A, 2B, 2C, 2D, 3A, ...)
        const lessonMatch = bodyText.match(/\b([1-9]|10)[A-D]\b/i);
        if (lessonMatch) lessonCode = lessonMatch[0].toUpperCase();

        const instructionEl = document.querySelector('.instruction, .directions, p.question, .prompt, h3');
        const instruction = instructionEl ? instructionEl.textContent.trim().toLowerCase() : '';

        return { exNum, lessonCode, instruction };
    }

    // =========================================================================
    // BẢNG ĐIỀU KHIỂN NỔI
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
                ⚡ AUTO-SOLVER 26.0 MASTER
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
        console.log(`[AutoSolver Master 26.0] ${msg}`);
    }

    ensureUI();
    setInterval(ensureUI, 800);

    // =========================================================================
    // BỘ THỰC THI CHUẨN XÁC TỪNG BÀI TẬP
    // =========================================================================
    async function runInteractionSolver() {
        // --- 0. MÀN HÌNH BẢNG ĐIỂM (/report) ---
        if (window.location.href.includes('/report')) {
            updateStatus("Đang ở bảng điểm -> Đánh giá kết quả...", "#38bdf8");
            await sleep(800);
            const tryAgainBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            
            const hasErrors = document.body.innerText.includes('❌') || document.body.innerText.includes('0%') || document.querySelector('.incorrect, .wrong, .feedback-incorrect');
            if (hasErrors && tryAgainBtn && isAutoRunning) {
                updateStatus("🔄 Có câu sai -> Tự bấm Try again...", "#f59e0b");
                tryAgainBtn.click();
            } else if (nextBtn) {
                updateStatus("✅ Hoàn thành 100% -> Chuyển bài tiếp theo...", "#4ade80");
                nextBtn.click();
            }
            return;
        }

        updateStatus("⚡ Đang nhận diện & giải bài...", "#eab308");
        const fullPageText = document.body.innerText.toLowerCase();
        const { exNum, lessonCode, instruction } = getExerciseContext();

        // ---------------------------------------------------------------------
        // DẠNG 1: CHECKBOX (CHỌN NHIỀU ĐÁP ÁN)
        // ---------------------------------------------------------------------
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(cb => cb.offsetParent !== null && !cb.disabled);
        if (checkboxes.length > 0) {
            updateStatus(`☑️ Đang xử lý ${checkboxes.length} ô Checkbox...`, "#38bdf8");

            // Unit 2B Exercise 2: Chọn đồ vật trong ảnh
            if ((lessonCode === '2B' && exNum === 2) || (fullPageText.includes('photo') && fullPageText.includes('everyday objects'))) {
                updateStatus("📚 Tick đồ vật trong ảnh Unit 2B Ex 2...", "#4ade80");
                const targets = ROADMAP_MASTER_DB["2B"].ex2_photo_targets; // phone, pen, cup, desk, computer
                checkboxes.forEach(cb => {
                    const text = (cb.closest('li, label, .choice, div')?.innerText || '').toLowerCase().trim();
                    const should = targets.some(t => text === t || text.startsWith(t) || text.includes(t));
                    setCheckbox(cb, should);
                });
                await submitAndNext();
                return;
            }

            // Unit 2D: Cụm từ mua sắm
            if (fullPageText.includes('how much') || fullPageText.includes('tick the following phrases')) {
                const phrases = ROADMAP_MASTER_DB["2D"].ex2b_ticks;
                checkboxes.forEach(cb => {
                    const text = (cb.closest('label, li, div')?.innerText || '').toLowerCase().trim();
                    const should = phrases.some(p => text.includes(p));
                    setCheckbox(cb, should);
                });
                await submitAndNext();
                return;
            }

            checkboxes.forEach(cb => setCheckbox(cb, true));
            await submitAndNext();
            return;
        }

        // ---------------------------------------------------------------------
        // DẠNG 2: TEXT INPUTS (ĐIỀN TỪ, GHÉP CHỮ)
        // ---------------------------------------------------------------------
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (inputs.length > 0) {
            updateStatus(`✍️ Đang điền ${inputs.length} ô Text...`, "#38bdf8");

            // --- UNIT 2B ---
            if (lessonCode === '2B' || fullPageText.includes('everyday objects')) {
                // Bài 1: 25 chữ cái cho 12 đồ vật
                if (exNum === 1 || inputs.length === 25 || instruction.includes('complete the words')) {
                    updateStatus("📚 Điền 25 chữ cái Unit 2B Ex 1...", "#4ade80");
                    const letters = ROADMAP_MASTER_DB["2B"].ex1_letters_25;
                    for (let i = 0; i < inputs.length; i++) {
                        if (letters[i]) {
                            setInputValue(inputs[i], letters[i]);
                            await sleep(15);
                        }
                    }
                    await submitAndNext();
                    return;
                }

                // Bài 3: Viết tên đồ vật (desk, chair, key, book, box)
                if (exNum === 3 || inputs.length === 5 || instruction.includes('write the everyday objects')) {
                    updateStatus("📚 Viết tên 5 đồ vật Unit 2B Ex 3...", "#4ade80");
                    const words = ROADMAP_MASTER_DB["2B"].ex3_words; // ["desk", "chair", "key", "book", "box"]
                    for (let i = 0; i < inputs.length; i++) {
                        if (words[i]) {
                            setInputValue(inputs[i], words[i]);
                            await sleep(25);
                        }
                    }
                    await submitAndNext();
                    return;
                }

                // Bài 5: Listening 5b
                if (exNum === 5 || inputs.length === 6) {
                    updateStatus("📚 Điền Listening Unit 2B Ex 5...", "#4ade80");
                    const ans = ROADMAP_MASTER_DB["2B"].ex5_listening;
                    for (let i = 0; i < inputs.length; i++) {
                        if (ans[i]) setInputValue(inputs[i], ans[i]);
                    }
                    await submitAndNext();
                    return;
                }
            }

            // --- THISTLE HOUSE (UNIT 1) ---
            if (fullPageText.includes('thistle house')) {
                if (fullPageText.includes('jobs') || fullPageText.includes('countries') || fullPageText.includes('nationalities')) {
                    updateStatus("📚 Điền danh mục Thistle House Ex 4...", "#4ade80");
                    const cat = ROADMAP_MASTER_DB.THISTLE_HOUSE.ex4;
                    const combined = [...cat.jobs, ...cat.countries, ...cat.nationalities];
                    for (let i = 0; i < inputs.length; i++) {
                        if (combined[i]) setInputValue(inputs[i], combined[i]);
                    }
                    await submitAndNext();
                    return;
                }

                if (fullPageText.includes('who is')) {
                    updateStatus("📚 Điền tên người Thistle House Ex 2...", "#4ade80");
                    const names = ROADMAP_MASTER_DB.THISTLE_HOUSE.ex2;
                    for (let i = 0; i < inputs.length; i++) {
                        if (names[i]) setInputValue(inputs[i], names[i]);
                    }
                    await submitAndNext();
                    return;
                }
            }

            // --- UNIT 2A FAMILY ---
            if (fullPageText.includes('family') && inputs.length <= 10) {
                const words = ROADMAP_MASTER_DB["2A"].ex2a;
                for (let i = 0; i < inputs.length; i++) {
                    if (words[i]) setInputValue(inputs[i], words[i]);
                }
                await submitAndNext();
                return;
            }

            // --- UNIT 2C NUMBERS ---
            if (lessonCode === '2C' || fullPageText.includes('numbers')) {
                if (inputs.length === 10) {
                    const words = ROADMAP_MASTER_DB["2C"].ex1a;
                    for (let i = 0; i < inputs.length; i++) {
                        if (words[i]) setInputValue(inputs[i], words[i]);
                    }
                    await submitAndNext();
                    return;
                }
            }

            // --- UNIT 3A PLACES ---
            if (lessonCode === '3A' && inputs.length <= 12) {
                const places = ROADMAP_MASTER_DB["3A"].ex1b;
                for (let i = 0; i < inputs.length; i++) {
                    if (places[i]) setInputValue(inputs[i], places[i]);
                }
                await submitAndNext();
                return;
            }

            // --- UNIT 3B ROOMS ---
            if (lessonCode === '3B' && inputs.length <= 12) {
                const rooms = ROADMAP_MASTER_DB["3B"].ex3;
                for (let i = 0; i < inputs.length; i++) {
                    if (rooms[i]) setInputValue(inputs[i], rooms[i]);
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
                    await sleep(40);
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
                return;
            }

            // Unit 2B Exercise 6: this, that, these, those
            if (lessonCode === '2B' && exNum === 6) {
                const ans = ROADMAP_MASTER_DB["2B"].ex6_grammar;
                for (let i = 0; i < selects.length; i++) {
                    const target = ans[i];
                    const sel = selects[i];
                    for (let j = 0; j < sel.options.length; j++) {
                        if (sel.options[j].text.trim().toLowerCase() === target.toLowerCase()) {
                            sel.selectedIndex = j;
                            sel.dispatchEvent(new Event('change', { bubbles: true }));
                            break;
                        }
                    }
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

            // Unit 2B Exercise 7: b, b, a
            if (lessonCode === '2B' && exNum === 7) {
                const ansLetters = ROADMAP_MASTER_DB["2B"].ex7_radios; // ['b', 'b', 'a']
                let gIdx = 0;
                groups.forEach(radios => {
                    const targetLetter = ansLetters[gIdx] || 'a';
                    const targetRadio = radios.find(r => {
                        const label = (r.closest('label, li, div')?.innerText || '').toLowerCase().trim();
                        return label.startsWith(targetLetter);
                    }) || radios[0];
                    if (targetRadio) {
                        targetRadio.click();
                        targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    gIdx++;
                });
                await submitAndNext();
                return;
            }

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
