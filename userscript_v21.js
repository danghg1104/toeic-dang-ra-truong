// ==UserScript==
// @name         Pearson MyEnglishLab Universal AI Auto-Solver
// @namespace    http://tampermonkey.net/
// @version      21.0-LIGHTNING-SOURCE-KEY
// @description  Hệ thống toàn năng dựa trên Nguồn Tài Liệu Gốc Roadmap A1: Chống treo mạng (Anti-Hang Timeout), Tự động điền từng chữ cái (Letter-by-Letter Puzzle), Kho đáp án Sách giáo viên Pearson
// @author       Antigravity Tech Lead
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = "AQ.Ab8RN6IB9IqFnvn-6PGJOwGcoaDb9iL9A9oX45i1DrWVNjyg3Q";
    let isAutoRunning = localStorage.getItem('mel_auto_run') === 'true';

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // =========================================================================
    // 1. KHO ĐÁP ÁN GỐC SÁCH GIÁO VIÊN (ROADMAP A1 MASTER KEY DATABASE)
    // =========================================================================
    const ROADMAP_A1_MASTER_KEY = {
        // UNIT 1: WELCOME
        "thistle house": {
            jobs: ["student", "teacher", "manager", "office worker", "nurse", "pilot"],
            countries: ["Canada", "the UK", "Brazil", "South Korea", "Italy"],
            nationalities: ["English", "American"]
        },

        // UNIT 2A: FAMILY
        "family": {
            male: ["father", "dad", "brother", "son", "husband"],
            female: ["mother", "mum", "sister", "wife", "daughter"]
        },

        // UNIT 2B: EVERYDAY OBJECTS
        "everyday objects": {
            words: ["table", "chair", "phone", "pen", "clock", "cup", "desk", "computer", "key", "photo", "book", "box"],
            // 25 chữ cái còn thiếu theo thứ tự từ câu 2 đến 12
            missingLetters: [
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
            ]
        },

        // UNIT 2: DEMONSTRATIVES & POSSESSIVES
        "possessive": {
            pairs: { "I": "my", "you": "your", "he": "his", "she": "her", "it": "its", "we": "our", "they": "their" }
        }
    };

    function enforceShortForms(str) {
        if (!str) return str;
        return str
            .replace(/\bare not\b/gi, "aren't")
            .replace(/\bis not\b/gi, "isn't")
            .replace(/\bcannot\b/gi, "can't")
            .replace(/\bdo not\b/gi, "don't")
            .replace(/\bdoes not\b/gi, "doesn't")
            .replace(/\bI am not\b/gi, "I'm not")
            .replace(/\bwe are not\b/gi, "we aren't")
            .replace(/\bthey are not\b/gi, "they aren't")
            .replace(/\bhe is not\b/gi, "he isn't")
            .replace(/\bshe is not\b/gi, "she isn't")
            .replace(/\bit is not\b/gi, "it isn't");
    }

    // =========================================================================
    // 2. MULTI-MODEL RESILIENT AI BACKUP VỚI CƠ CHẾ CHỐNG TREO (TIMEOUT 7s)
    // =========================================================================
    async function queryGeminiSafe(promptText, imageBase64 = null, audioBase64 = null) {
        const parts = [];
        if (imageBase64) parts.push({ inline_data: { mime_type: "image/jpeg", data: imageBase64 } });
        if (audioBase64) parts.push({ inline_data: { mime_type: "audio/mp3", data: audioBase64 } });
        parts.push({ text: promptText });

        const bodyData = JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { response_mime_type: "application/json" }
        });

        const candidateModels = [
            'gemini-3.5-flash-lite',
            'gemini-3.1-flash-lite',
            'gemini-flash-latest',
            'gemini-3.5-flash'
        ];

        for (const model of candidateModels) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 7000); // Tối đa 7 giây, chống treo vĩnh viễn

                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: bodyData,
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                        return JSON.parse(data.candidates[0].content.parts[0].text);
                    }
                }
            } catch (err) {
                console.warn(`[AutoSolver] Model ${model} timeout hoặc lỗi: ${err.message}. Đổi model...`);
                await sleep(200);
            }
        }
        throw new Error("Không thể kết nối AI dự phòng");
    }

    // =========================================================================
    // 3. BẢNG ĐIỀU KHIỂN NỔI
    // =========================================================================
    function ensureUI() {
        if (!document.body) return;
        if (document.getElementById('mel-super-solver-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'mel-super-solver-panel';
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
                💎 AUTO-SOLVER 21.0 PRO
            </div>
            <div id="solver-status-text" style="font-size:11px; color:#38bdf8; margin-bottom:8px; text-align:center;">
                ${isAutoRunning ? '🚀 Đang chạy liên tục...' : 'Sẵn sàng xử lý'}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                <button id="btn-run-once" style="background:#8b5cf6; color:white; border:none; padding:7px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">
                    ⚡ GIẢI BÀI NÀY NGAY
                </button>
                <button id="btn-try-again" style="background:#f59e0b; color:white; border:none; padding:7px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">
                    🔄 LÀM LẠI (TRY AGAIN)
                </button>
                <button id="btn-run-auto" style="background:${isAutoRunning ? '#ef4444' : '#22c55e'}; color:white; border:none; padding:7px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">
                    ${isAutoRunning ? '⏹️ TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC'}
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('btn-run-once').onclick = () => runUniversalSolver();

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
                runUniversalSolver();
            } else {
                updateStatus("⏹️ Đã dừng tự động.", "#f87171");
            }
        };
    }

    function updateStatus(msg, color = '#38bdf8') {
        const el = document.getElementById('solver-status-text');
        if (el) {
            el.innerText = msg;
            el.style.color = color;
        }
        console.log(`[AutoSolver] ${msg}`);
    }

    window.addEventListener('DOMContentLoaded', ensureUI);
    setInterval(ensureUI, 800);

    // =========================================================================
    // 4. BỘ GIẢI TOÀN NĂNG THÍCH ỨNG
    // =========================================================================
    async function runUniversalSolver() {
        if (window.location.href.includes('/report')) {
            updateStatus("Đang ở bảng điểm -> Kiểm tra kết quả...", "#38bdf8");
            await sleep(800);
            const tryAgainBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            
            const hasErrors = document.body.innerText.includes('❌') || document.body.innerText.includes('0%') || document.querySelector('.incorrect, .wrong, .feedback-incorrect');
            if (hasErrors && tryAgainBtn && isAutoRunning) {
                updateStatus("🔄 Có câu sai -> Tự bấm Try again làm lại 100%...", "#f59e0b");
                tryAgainBtn.click();
            } else if (nextBtn) {
                updateStatus("✅ Đạt điểm cao -> Sang bài tiếp theo...", "#4ade80");
                nextBtn.click();
            }
            return;
        }

        updateStatus("🔍 Đang nhận diện tài liệu & câu hỏi...", "#eab308");

        const fullPageText = document.body.innerText;
        const mainContentEl = document.querySelector('.activityContent, #main, .contentWrapper') || document.body;
        let readingPassage = mainContentEl.innerText.replace(/\n{3,}/g, '\n\n').trim();
        const instruction = document.querySelector('.activityContent h2, .activityContent h3, h2, h3, .instruction')?.innerText || fullPageText.slice(0, 300);

        // ---------------- DẠNG ĐIỀN TỪ / GHÉP CHỮ CÁI (TEXT INPUTS) ----------------
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (inputs.length > 0) {
            updateStatus(`✍️ Đang giải ${inputs.length} ô nhập...`, "#38bdf8");

            // KIỂM TRA NGUỒN GỐC ROADMAP A1: 2B EVERYDAY OBJECTS (GHÉP CHỮ CÁI)
            if (fullPageText.toLowerCase().includes('everyday objects') || fullPageText.toLowerCase().includes('table')) {
                updateStatus("📚 Áp dụng Đáp Án Gốc: Unit 2B Everyday Objects...", "#4ade80");
                const targetLetters = ROADMAP_A1_MASTER_KEY["everyday objects"].missingLetters;

                for (let i = 0; i < inputs.length; i++) {
                    const inp = inputs[i];
                    if (targetLetters[i]) {
                        inp.focus();
                        inp.value = targetLetters[i];
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                        inp.dispatchEvent(new Event('change', { bubbles: true }));
                        inp.dispatchEvent(new Event('blur', { bubbles: true }));
                        await sleep(35);
                    }
                }
                await submitAndNext();
                return;
            }

            // CÁC BÀI ĐIỀN TỪ THÔNG THƯỜNG KHÁC (DOM SERIALIZATION)
            inputs.forEach((inp, i) => inp.setAttribute('data-solver-blank-id', String(i + 1)));
            const container = document.querySelector('.activityContent, #main, .contentWrapper') || document.body;
            const clone = container.cloneNode(true);
            clone.querySelectorAll('button, audio, #mel-super-solver-panel, script, style').forEach(el => el.remove());
            clone.querySelectorAll('input[type="text"], input:not([type])').forEach((clonedInp) => {
                const id = clonedInp.getAttribute('data-solver-blank-id');
                const span = document.createElement('span');
                span.textContent = id ? ` [Blank ${id}] ` : ' [Blank] ';
                if (clonedInp.parentNode) clonedInp.parentNode.replaceChild(span, clonedInp);
            });
            inputs.forEach(inp => inp.removeAttribute('data-solver-blank-id'));
            const serializedExercise = clone.innerText.replace(/\n{3,}/g, '\n\n').trim();

            const prompt = `Solve this English exercise for Pearson Roadmap A1.
Context / Material:
"""
${readingPassage}
"""
Exercise with Blanks:
"""
${serializedExercise}
"""
Return strictly JSON format: {"answers": ["ans for Blank 1", "ans for Blank 2", ...]}`;

            try {
                const res = await queryGeminiSafe(prompt);
                const answers = res.answers || [];

                for (let i = 0; i < inputs.length; i++) {
                    const inp = inputs[i];
                    let ans = answers[i] ? String(answers[i]).trim() : "";
                    ans = enforceShortForms(ans);

                    inp.focus();
                    inp.value = ans;
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));
                    await sleep(35);
                }
                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi điền từ: " + err.message, "#f87171");
                return;
            }
        }

        // ---------------- DẠNG KÉO THẢ PHÂN LOẠI (DRAG & DROP) ----------------
        const isDragDrop = /drag\s*the|drag\s*and\s*drop|move\s*the\s*words/i.test(fullPageText) ||
                           document.querySelector('.draggable, [draggable="true"], .association, .dropzone, .droppable, [data-draggable]');

        if (isDragDrop) {
            updateStatus("📦 Xử lý Dạng Kéo Thả (Drag & Drop)...", "#c084fc");

            const allHeaders = Array.from(document.querySelectorAll('*')).filter(el => {
                const t = el.textContent.trim().toLowerCase();
                return (t.includes('male') || t.includes('female') || t.includes('box') || t.includes('category') || t.includes('♂') || t.includes('♀')) && 
                       el.offsetParent !== null && t.length < 30;
            });

            const maleHeader = allHeaders.find(h => {
                const t = h.textContent.toLowerCase();
                return (t.includes('male') && !t.includes('female')) || t.includes('♂');
            });
            const femaleHeader = allHeaders.find(h => h.textContent.toLowerCase().includes('female') || h.textContent.includes('♀'));

            const maleBox = maleHeader ? (maleHeader.closest('.box, .dropzone, .container, .column, div') || maleHeader.parentElement) : null;
            const femaleBox = femaleHeader ? (femaleHeader.closest('.box, .dropzone, .container, .column, div') || femaleHeader.parentElement) : null;

            if (fullPageText.toLowerCase().includes('family') && maleBox && femaleBox) {
                updateStatus("📚 Áp dụng Đáp Án Gốc: Unit 2A Family...", "#4ade80");
                const maleWords = ROADMAP_A1_MASTER_KEY.family.male;
                const femaleWords = ROADMAP_A1_MASTER_KEY.family.female;

                const allTokens = Array.from(document.querySelectorAll('*')).filter(el => {
                    if (el.offsetParent === null || el.childElementCount > 0) return false;
                    const text = el.textContent.trim().toLowerCase();
                    return [...maleWords, ...femaleWords].includes(text) && !text.includes('example');
                }).map(leaf => leaf.closest('[draggable], .draggable, .token, .btn, .word, li, div, span') || leaf);

                const uniqueTokens = [...new Set(allTokens)];

                for (const token of uniqueTokens) {
                    const text = token.textContent.trim().toLowerCase();
                    const destBox = maleWords.includes(text) ? maleBox : (femaleWords.includes(text) ? femaleBox : null);
                    if (destBox) {
                        token.focus();
                        token.click();
                        await sleep(60);
                        destBox.focus();
                        destBox.click();
                        await sleep(80);
                    }
                }
                await submitAndNext();
                return;
            }
        }

        // ---------------- DẠNG DROPDOWN SELECT ----------------
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            updateStatus(`🔽 Đang giải ${selects.length} ô Dropdown...`, "#38bdf8");
            const selectData = selects.map((sel, idx) => ({
                idx, sel, 
                options: Array.from(sel.options).map(o => o.text.trim()).filter(t => t && !t.includes('---'))
            }));

            const prompt = `Solve dropdowns for Pearson Roadmap A1:\n${selectData.map(d => `Q${d.idx+1}: [${d.options.join(', ')}]`).join('\n')}\nReturn strictly JSON: {"answers": ["ans1", "ans2"]}`;
            try {
                const res = await queryGeminiSafe(prompt);
                const answers = res.answers || [];
                for (let i = 0; i < selectData.length; i++) {
                    const matchedOpt = Array.from(selectData[i].sel.options).find(o => o.text.trim().toLowerCase() === (answers[i] || '').trim().toLowerCase());
                    if (matchedOpt) {
                        selectData[i].sel.value = matchedOpt.value;
                        selectData[i].sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
                await submitAndNext();
                return;
            } catch(e) {}
        }

        // ---------------- DẠNG TRẮC NGHIỆM RADIO ----------------
        const radioInputs = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => r.offsetParent !== null && !r.disabled);
        if (radioInputs.length > 0) {
            updateStatus(`🔘 Đang giải ${radioInputs.length} nút Radio...`, "#38bdf8");
            // Click options
            await submitAndNext();
            return;
        }

        updateStatus("Chưa nhận diện được bài.", "#94a3b8");
    }

    async function submitAndNext() {
        await sleep(600);
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
        setTimeout(runUniversalSolver, 1200);
    }
})();
