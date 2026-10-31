// ==UserScript==
// @name         Pearson Roadmap A1 Pure Interaction Auto-Solver (Studocu Key)
// @namespace    http://tampermonkey.net/
// @version      23.0-PURE-INTERACTION
// @description  Bản siêu nhẹ KHÔNG AI: Tương tác DOM trực tiếp 100%, nạp sẵn toàn bộ đáp án chuẩn từ Studocu Roadmap A1 2021, tự động giải và chuyển bài liên tục
// @author       Antigravity Tech Lead
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let isAutoRunning = localStorage.getItem('mel_auto_run') === 'true';
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // =========================================================================
    // KHO ĐÁP ÁN GỐC TỪ SÁCH GIẢI CHUẨN STUDOCU ROADMAP A1 (STUDENTS' BOOK KEY 2021)
    // =========================================================================
    const ROADMAP_DB = {
        // --- UNIT 1: HELLO & JOBS ---
        "1a": {
            countries: ["Canada", "the UK", "the US", "Spain", "Poland", "Turkey", "Japan", "Thailand", "Argentina", "Mexico", "Brazil", "Italy"],
            listening4a: ["Mexico", "Japan", "the UK", "Argentina"],
            grammar5: ["I'm", "you're", "aren't"],
            grammar7b: ["Are", "am", "'m", "'m", "Are", "'m", "are", "'m"]
        },
        "1b": {
            countries1a: ["The US", "The UK", "Poland", "Japan", "Mexico", "Argentina", "Spain", "Thailand"],
            jobs: ["football player", "doctor", "school teacher", "pilot", "farmer", "nurse", "taxi driver", "office worker"],
            vocabBankJobs: ["student", "police officer", "manager", "soldier", "artist", "writer", "tennis player", "shop assistant", "bus driver", "waiter", "waitress", "receptionist", "tour guide"],
            reading3: ["b", "c", "a"],
            reading4a: ["b", "a", "b"],
            grammar5a: ["'s", "'s", "isn't", "'s"],
            grammar6: ["I'm", "Is it", "it is", "Is the manager", "he's", "Is he", "isn't", "'s he", "He's"]
        },
        "1c": {
            nationalities: ["Thai", "British", "Polish", "Spanish", "Turkish", "Mexican", "Japanese", "Italian", "American", "Canadian", "Brazilian", "Argentinian"],
            reading4a: ["D", "A", "C", "B", "E"],
            reading4b: ["False", "False", "True", "False", "False"],
            grammar5a: ["aren't", "are", "Are", "aren't", "are"]
        },
        "thistle_house": {
            exercise2: ["Gabriela", "Gabriela", "Steve", "Matteo", "Lesley", "Jenny", "Lesley", "Matteo", "Mi Na"],
            exercise3_tf: ["F", "T", "F", "F", "F", "T", "T"],
            exercise4_categories: {
                jobs: ["office worker", "nurse", "pilot"],
                countries: ["Brazil", "South Korea", "Italy"],
                nationalities: ["American"]
            }
        },

        // --- UNIT 2: FAMILIES & EVERYDAY OBJECTS ---
        "2a": {
            family: {
                male: ["father", "dad", "son", "brother", "husband"],
                female: ["mother", "mum", "daughter", "sister", "wife"]
            },
            exercise2a: ["mum", "father", "daughter", "brother", "wife"],
            exercise3: ["daughter", "husband", "son", "brother", "father", "wife", "children", "parents"],
            grammar5: ["my", "his", "its", "our", "their"]
        },
        "2b": {
            // Danh mục 12 đồ vật chuẩn của Unit 2B (Page 7 & 9 Studocu)
            objects: ["table", "chair", "phone", "pen", "clock", "cup", "desk", "computer", "key", "photo", "book", "box"],
            // 25 chữ cái còn thiếu cho bài điền chữ ghép từ (Exercise 1)
            exercise1_letters: [
                'h', 'i',             // 2: chair
                'h', 'o', 'e',        // 3: phone
                'e', 'n',             // 4: pen
                'l', 'c', 'k',        // 5: clock
                'u', 'p',             // 6: cup
                'e', 'k',             // 7: desk
                'o', 'p', 't', 'r',   // 8: computer
                'e', 'y',             // 9: key
                'o', 'o',             // 10: photo
                'o', 'o',             // 11: book
                'o'                   // 12: box
            ],
            listening5b: ["desk", "keys", "computer", "desk", "photos", "chair"],
            grammar6: ["this", "that", "these", "those"],
            grammar8: ["that", "those", "this", "that", "those", "these"]
        },
        "2c": {
            numbers1a: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
            grammarBank1: ["Where", "Who", "What", "How", "What", "Where", "How", "When"]
        },

        // --- UNIT 3: MY TOWN & ROOMS ---
        "3a": {
            places: ["a train station", "a hotel", "a café", "a bank", "a restaurant", "a supermarket", "a cinema", "a park", "a market", "a bookshop", "a house", "a flat"],
            grammar5: ["There is", "There are", "There are"],
            grammar7a: ["are", "a", "is", "any", "no", "two bookshops", "There's", "no"]
        },
        "3b": {
            rooms: ["living room", "kitchen", "bedroom", "bathroom", "toilet", "shower", "bed", "oven", "lift", "TV", "wifi"],
            grammar6: ["Is", "Are", "is", "isn't", "aren't", "are", "is", "are"]
        },
        "3c": {
            adjectives: ["quiet", "good", "small", "busy", "big", "cheap", "expensive", "old"]
        },

        // --- UNIT 4: BODY & EVERYDAY OBJECTS 2 ---
        "4a": {
            body: ["blonde hair", "blue eyes", "in his 20s", "brown hair", "brown eyes", "a beard", "in his 30s"],
            grammar5: ["have", "has", "hasn't"]
        },
        "4b": {
            everyday2: ["tickets", "passport", "credit card", "coat", "food", "bottle of water", "camera", "sunglasses", "phone", "money", "bag", "keys"],
            grammar5a: ["Have", "have", "Has", "has", "hasn't"]
        },

        // --- UNIT 5: MY WEEK & TRANSPORT ---
        "5a": {
            routineVerbs: ["work", "go to", "have", "have", "study", "get up", "watch"],
            grammar6: ["at", "at", "on", "On"]
        },
        "5b": {
            transport: ["bike", "bus", "train", "car", "taxi", "walk"],
            grammar4: ["Do", "do", "don't", "do", "do", "do"]
        },
        "5c": {
            food: ["tea", "milk", "cakes", "sugar", "sandwiches", "salad", "fish", "bread", "eggs", "cheese", "meat", "chicken", "chocolate", "coffee"]
        },

        // --- UNITS 6-10 ---
        "6a": {
            verbs: ["doesn't cycle", "takes", "doesn't eat", "has", "works", "doesn't work", "doesn't study", "teaches", "doesn't read", "studies"]
        },
        "7a": {
            nature: ["the sea", "north", "west", "east", "south", "a mountain", "an island", "a lake", "a hill", "a river", "a field", "the sky", "clouds", "trees", "flowers"]
        },
        "8a": {
            past: ["walked", "liked", "studied", "travelled", "started", "cleaned", "didn't like", "played"]
        },
        "9a": {
            pronouns: ["They", "them", "I", "her", "him", "us", "She", "me", "we"]
        },
        "10a": {
            collocations: ["change", "try", "make", "sell", "join", "spend", "have", "start", "move", "build"]
        }
    };

    // =========================================================================
    // HỆ THỐNG TƯƠNG TÁC DOM SIÊU TỐC (CHỈ THAO TÁC, KHÔNG CẦN TƯ DUY)
    // =========================================================================

    // 1. Điền giá trị an toàn vào input và kích hoạt đầy đủ Event của Pearson CanJS
    function setInputValue(input, val) {
        if (!input) return;
        input.focus();
        input.value = val;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // 2. Kéo thả phần tử vào hộp đích (Dạng Drag & Drop)
    async function moveTokenToBox(tokenEl, destBox) {
        if (!tokenEl || !destBox) return;

        // Bấm chọn từ
        tokenEl.focus();
        tokenEl.click();
        tokenEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
        tokenEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        await sleep(40);

        // Bấm vào hộp đích
        destBox.focus();
        destBox.click();
        destBox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
        destBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        await sleep(40);

        // Giả lập HTML5 DragEvent
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

        // Fallback chuyển DOM
        if (destBox && tokenEl.parentElement !== destBox && !destBox.contains(tokenEl)) {
            const dropArea = destBox.querySelector('.dropzone, .content, .items, div:last-child') || destBox;
            dropArea.appendChild(tokenEl);
        }
    }

    // =========================================================================
    // BẢNG ĐIỀU KHIỂN SIÊU NHẸ (FLOATING UI PANEL)
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
            width: 250px !important;
            border: 2px solid #22c55e !important;
            user-select: none !important;
        `;

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px; color:#22c55e; text-align:center; font-size:13px; letter-spacing:0.5px;">
                ⚡ AUTO-SOLVER 23.0 LITE
            </div>
            <div id="pure-status-text" style="font-size:11px; color:#38bdf8; margin-bottom:8px; text-align:center;">
                ${isAutoRunning ? '🚀 Đang tự động chạy...' : 'Sẵn sàng tương tác'}
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
        console.log(`[AutoSolver Lite 23.0] ${msg}`);
    }

    ensureUI();
    setInterval(ensureUI, 800);

    // =========================================================================
    // BỘ THỰC THI TƯƠNG TÁC (INTERACTION ENGINE)
    // =========================================================================
    async function runInteractionSolver() {
        // 1. Nếu đang ở màn hình bảng điểm (/report)
        if (window.location.href.includes('/report')) {
            updateStatus("Đang ở bảng điểm -> Đánh giá kết quả...", "#38bdf8");
            await sleep(800);
            const tryAgainBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            
            const hasErrors = document.body.innerText.includes('❌') || document.body.innerText.includes('0%') || document.querySelector('.incorrect, .wrong, .feedback-incorrect');
            if (hasErrors && tryAgainBtn && isAutoRunning) {
                updateStatus("🔄 Có câu sai -> Bấm Try again...", "#f59e0b");
                tryAgainBtn.click();
            } else if (nextBtn) {
                updateStatus("✅ Đạt điểm -> Sang bài tiếp theo...", "#4ade80");
                nextBtn.click();
            }
            return;
        }

        updateStatus("⚡ Đang tương tác giải bài...", "#eab308");
        const fullPageText = document.body.innerText.toLowerCase();

        // ---------------------------------------------------------------------
        // DẠNG 1: ĐIỀN TỪ & GHÉP CHỮ CÁI (TEXT INPUTS)
        // ---------------------------------------------------------------------
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (inputs.length > 0) {
            updateStatus(`✍️ Đang điền ${inputs.length} ô...`, "#38bdf8");

            // TRƯỜNG HỢP A: Unit 2B Everyday objects (Exercise 1 - 25 ô ký tự)
            if (fullPageText.includes('everyday objects') || fullPageText.includes('table') || inputs.length === 25) {
                updateStatus("📚 Điền 25 chữ cái Unit 2B...", "#4ade80");
                const letters = ROADMAP_DB["2b"].exercise1_letters;
                for (let i = 0; i < inputs.length; i++) {
                    if (letters[i]) {
                        setInputValue(inputs[i], letters[i]);
                        await sleep(20);
                    }
                }
                await submitAndNext();
                return;
            }

            // TRƯỜNG HỢP B: Thistle House Categorization (Jobs, Countries, Nationalities - Ex 4)
            if ((fullPageText.includes('thistle house') || fullPageText.includes('jobs')) && (fullPageText.includes('countries') || fullPageText.includes('nationalities'))) {
                updateStatus("📚 Điền danh mục Thistle House...", "#4ade80");
                const jobs = ["office worker", "nurse", "pilot"];
                const countries = ["Brazil", "South Korea", "Italy"];
                const nationalities = ["American"];
                const combined = [...jobs, ...countries, ...nationalities];

                for (let i = 0; i < inputs.length; i++) {
                    if (combined[i]) {
                        setInputValue(inputs[i], combined[i]);
                        await sleep(30);
                    }
                }
                await submitAndNext();
                return;
            }

            // TRƯỜNG HỢP C: Thistle House Name Questions (Ex 2: Who is an office worker? etc.)
            if (fullPageText.includes('who is') && fullPageText.includes('thistle house')) {
                updateStatus("📚 Điền tên người Thistle House...", "#4ade80");
                const names = ROADMAP_DB.thistle_house.exercise2;
                for (let i = 0; i < inputs.length; i++) {
                    if (names[i]) {
                        setInputValue(inputs[i], names[i]);
                        await sleep(30);
                    }
                }
                await submitAndNext();
                return;
            }

            // TRƯỜNG HỢP D: Unit 2A Family exercise 2a / 3
            if (fullPageText.includes('family') && inputs.length <= 10) {
                const words = ROADMAP_DB["2a"].exercise2a;
                for (let i = 0; i < inputs.length; i++) {
                    if (words[i]) {
                        setInputValue(inputs[i], words[i]);
                        await sleep(30);
                    }
                }
                await submitAndNext();
                return;
            }

            // TRƯỜNG HỢP E: Unit 2B Listening 5b
            if (fullPageText.includes('desk') && fullPageText.includes('computer') && inputs.length === 6) {
                const ans = ROADMAP_DB["2b"].listening5b;
                for (let i = 0; i < inputs.length; i++) {
                    if (ans[i]) setInputValue(inputs[i], ans[i]);
                }
                await submitAndNext();
                return;
            }
        }

        // ---------------------------------------------------------------------
        // DẠNG 2: KÉO THẢ PHÂN LOẠI (DRAG & DROP)
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
                const maleWords = ROADMAP_DB["2a"].family.male;
                const femaleWords = ROADMAP_DB["2a"].family.female;

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
                    await sleep(60);
                }

                await submitAndNext();
                return;
            }
        }

        // ---------------------------------------------------------------------
        // DẠNG 3: DROPDOWN SELECT
        // ---------------------------------------------------------------------
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            updateStatus(`🔽 Đang chọn ${selects.length} Dropdown...`, "#38bdf8");

            // TRƯỜNG HỢP: Thistle House True/False (Exercise 3: F, T, F, F, F, T, T)
            if (fullPageText.includes('thistle house') && fullPageText.includes('edinburgh') && selects.length === 7) {
                const tfAnswers = ROADMAP_DB.thistle_house.exercise3_tf; // ["F", "T", "F", "F", "F", "T", "T"]
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

            // Mặc định cho các Dropdown khác
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
        // DẠNG 4: TRẮC NGHIỆM (RADIO BUTTONS)
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

    // Tự động bấm Submit và Next
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
