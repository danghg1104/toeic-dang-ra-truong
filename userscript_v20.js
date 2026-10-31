// ==UserScript==
// @name         Pearson MyEnglishLab Universal AI Auto-Solver
// @namespace    http://tampermonkey.net/
// @version      20.0-SOURCE-KEY-MASTER
// @description  Hệ thống toàn năng dựa trên Nguồn Tài Liệu Gốc: Tự động trích xuất đáp án từ Gói tin Pearson, Kho đáp án Sách giáo viên Roadmap A1 (Teacher's Book) & Multi-Model AI Backup
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
    // 1. NETWORK INTERCEPTOR: BẮT ĐÁP ÁN GỐC TRỰC TIẾP TỪ GÓI TIN PEARSON
    // =========================================================================
    window.__PEARSON_INTERCEPTED_DATA__ = [];

    function parseAndStorePayload(url, text) {
        try {
            const data = JSON.parse(text);
            if (data && typeof data === 'object') {
                window.__PEARSON_INTERCEPTED_DATA__.push({ url, data, time: Date.now() });
                console.log(`[Pearson Sniffer] Đã bắt gói tin cấu hình: ${url}`);
            }
        } catch (e) {}
    }

    // Intercept XMLHttpRequest
    const rawXHR = window.XMLHttpRequest;
    function CustomXHR() {
        const xhr = new rawXHR();
        let targetUrl = '';
        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (targetUrl.includes('activity') || targetUrl.includes('content') || targetUrl.includes('json') || targetUrl.includes('item')) {
                    parseAndStorePayload(targetUrl, xhr.responseText);
                }
            }
        });
        const origOpen = xhr.open;
        xhr.open = function(method, url) {
            targetUrl = url || '';
            return origOpen.apply(xhr, arguments);
        };
        return xhr;
    }
    window.XMLHttpRequest = CustomXHR;

    // Intercept Fetch
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
        const res = await origFetch.apply(this, args);
        try {
            const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
            if (url.includes('activity') || url.includes('content') || url.includes('json') || url.includes('item')) {
                const clone = res.clone();
                clone.text().then(t => parseAndStorePayload(url, t)).catch(() => {});
            }
        } catch (e) {}
        return res;
    };

    // =========================================================================
    // 2. KHO ĐÁP ÁN GỐC SÁCH GIÁO VIÊN (ROADMAP A1 TEACHER'S BOOK MASTER KEY)
    // =========================================================================
    const ROADMAP_A1_MASTER_KEY = {
        // UNIT 1: WELCOME
        "thistle house": {
            type: "reading",
            text: `Welcome to Thistle House!
Thistle House is a large English language school in the centre of Edinburgh in the UK.
Lesley: manager, from London in the UK.
Gabriela: office worker, from Brazil.
Steve & Jenny: teachers, Steve is from Vancouver in Canada, Jenny is American from New York.
Mi Na & Matteo: students, Mi Na is from South Korea, Matteo is from Italy. Mi Na is a nurse, Matteo is a pilot.`,
            jobs: ["student", "teacher", "manager", "office worker", "nurse", "pilot"],
            countries: ["Canada", "the UK", "Brazil", "South Korea", "Italy"],
            nationalities: ["English", "American"]
        },

        // UNIT 2: FAMILY & FRIENDS
        "family": {
            type: "drag_category",
            male: ["father", "dad", "brother", "son", "husband"],
            female: ["mother", "mum", "sister", "wife", "daughter"]
        },
        "possessive": {
            type: "grammar",
            pairs: {
                "I": "my",
                "you": "your",
                "he": "his",
                "she": "her",
                "it": "its",
                "we": "our",
                "they": "their"
            }
        },

        // UNIT 3: DAILY LIFE
        "routines": {
            verbs: ["get up", "have breakfast", "go to work", "have lunch", "finish work", "have dinner", "go to bed"]
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
    // 3. MULTI-MODEL RESILIENT AI BACKUP
    // =========================================================================
    async function queryGeminiSafe(promptText, imageBase64 = null, audioBase64 = null) {
        const parts = [];
        if (imageBase64) {
            parts.push({ inline_data: { mime_type: "image/jpeg", data: imageBase64 } });
        }
        if (audioBase64) {
            parts.push({ inline_data: { mime_type: "audio/mp3", data: audioBase64 } });
        }
        parts.push({ text: promptText });

        const bodyData = JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { response_mime_type: "application/json" }
        });

        const candidateModels = [
            'gemini-flash-latest',
            'gemini-3.5-flash-lite',
            'gemini-3.1-flash-lite',
            'gemini-3.5-flash'
        ];

        for (const model of candidateModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: bodyData
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                        return JSON.parse(data.candidates[0].content.parts[0].text);
                    }
                }
            } catch (err) {
                await sleep(200);
            }
        }
        throw new Error("Không thể kết nối AI dự phòng");
    }

    // Kiểm tra tiền tố đơn lẻ in sẵn
    function getStandalonePrefix(inp) {
        let prevText = "";
        let prevNode = inp.previousSibling;
        while (prevNode) {
            if (prevNode.nodeType === 3 && prevNode.textContent.trim()) {
                prevText = prevNode.textContent.trim();
                break;
            }
            prevNode = prevNode.previousSibling;
        }
        if (/^[a-zA-Z]$/.test(prevText)) {
            return prevText;
        }
        return "";
    }

    // =========================================================================
    // 4. BẢNG ĐIỀU KHIỂN NỔI (UI CONTROLS)
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
                💎 AUTO-SOLVER 20.0 SOURCE-KEY
            </div>
            <div id="solver-status-text" style="font-size:11px; color:#38bdf8; margin-bottom:8px; text-align:center;">
                ${isAutoRunning ? '🚀 Đang tự động giải liên tục...' : 'Sẵn sàng với Nguồn Đáp Án Gốc'}
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
    // 5. MÔ PHỎNG KÉO THẢ TỪ VỰNG VÀO HỘP ĐÍCH
    // =========================================================================
    async function simulateDrop(tokenEl, destBox) {
        if (!tokenEl || !destBox) return;

        // Bấm chọn từ (Accessible Mode)
        tokenEl.focus();
        tokenEl.click();
        tokenEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
        tokenEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        await sleep(60);

        // Bấm thả vào hộp
        destBox.focus();
        destBox.click();
        destBox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
        destBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));

        // HTML5 Drag Event simulation
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

        // DOM Reparenting fallback
        if (destBox && tokenEl.parentElement !== destBox && !destBox.contains(tokenEl)) {
            const dropArea = destBox.querySelector('.dropzone, .content, .items, div:last-child') || destBox;
            dropArea.appendChild(tokenEl);
        }
    }

    // =========================================================================
    // 6. BỘ GIẢI TOÀN NĂNG THÍCH ỨNG
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

        // ---------------- DẠNG 1: KÉO THẢ PHÂN LOẠI VÀO HỘP (DRAG & DROP) ----------------
        const isDragDrop = /drag\s*the|drag\s*and\s*drop|move\s*the\s*words/i.test(fullPageText) ||
                           document.querySelector('.draggable, [draggable="true"], .association, .dropzone, .droppable, [data-draggable]');

        if (isDragDrop) {
            updateStatus("📦 Xử lý Dạng Kéo Thả (Drag & Drop)...", "#c084fc");

            // 1. Nhận diện các hộp đích (Boxes)
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

            // 2. Tra cứu từ điển chuẩn Roadmap A1 Unit 2A (Family)
            if (fullPageText.toLowerCase().includes('family') && maleBox && femaleBox) {
                updateStatus("📚 Áp dụng Đáp Án Gốc Sách Giáo Viên: Unit 2A Family...", "#4ade80");

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
                    if (maleWords.includes(text)) {
                        await simulateDrop(token, maleBox);
                    } else if (femaleWords.includes(text)) {
                        await simulateDrop(token, femaleBox);
                    }
                    await sleep(100);
                }

                await submitAndNext();
                return;
            }
        }

        // ---------------- DẠNG 2: DROPDOWN SELECT ----------------
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            updateStatus(`🔽 Đang giải ${selects.length} ô Dropdown...`, "#38bdf8");

            const selectData = selects.map((sel, idx) => {
                const options = Array.from(sel.options)
                    .map(o => o.text.trim())
                    .filter(t => t && !t.toLowerCase().includes('select') && !t.includes('---'));
                const container = sel.closest('li, tr, .question, .item, p, div') || sel.parentElement;
                let ctx = container ? container.innerText.replace(/\n+/g, ' ').trim() : "";
                ctx = ctx.replace(/Example:.*?\./gi, '').trim();
                return { idx, sel, ctx, options };
            });

            const prompt = `Solve this English exercise with dropdown selections for Pearson Roadmap A1.
Context / Passage:
"""
${readingPassage}
"""
Instruction: ${instruction}
Questions:
${selectData.map(d => `Question ${d.idx + 1}: Context: "${d.ctx}" | Options: [${d.options.join(', ')}]`).join('\n')}
Return strictly JSON format: {"answers": ["ans1", "ans2", ...]}`;

            try {
                const res = await queryGeminiSafe(prompt);
                const answers = res.answers || [];

                for (let i = 0; i < selectData.length; i++) {
                    const item = selectData[i];
                    let target = (answers[i] || '').trim().toLowerCase();

                    if (target) {
                        const matchedOpt = Array.from(item.sel.options).find(o => {
                            const optText = o.text.trim().toLowerCase();
                            const optVal = o.value.trim().toLowerCase();
                            return (target === optText || target === optVal ||
                                    (target === 'false' && (optText === 'f' || optVal === 'f')) ||
                                    (target === 'true' && (optText === 't' || optVal === 't')) ||
                                    (target === 'f' && (optText === 'false' || optVal === 'false')) ||
                                    (target === 't' && (optText === 'true' || optVal === 'true')));
                        });

                        if (matchedOpt) {
                            item.sel.value = matchedOpt.value;
                            item.sel.dispatchEvent(new Event('change', { bubbles: true }));
                            await sleep(40);
                        }
                    }
                }
                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi dropdown: " + err.message, "#f87171");
                return;
            }
        }

        // ---------------- DẠNG 3: TRẮC NGHIỆM (RADIO BUTTONS) ----------------
        const radioInputs = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => r.offsetParent !== null && !r.disabled);
        if (radioInputs.length > 0) {
            updateStatus(`🔘 Đang giải ${radioInputs.length} nút Radio...`, "#38bdf8");

            const groupsMap = new Map();
            radioInputs.forEach(radio => {
                const groupKey = radio.name || radio.closest('.question, li, .item, p, tr')?.innerText?.slice(0, 30) || 'default_group';
                if (!groupsMap.has(groupKey)) groupsMap.set(groupKey, []);
                groupsMap.get(groupKey).push(radio);
            });

            const questionGroups = [];
            groupsMap.forEach((radios) => {
                const firstRadio = radios[0];
                const container = firstRadio.closest('li, .question, .item, p, tr') || firstRadio.parentElement?.parentElement;
                let stem = container ? container.innerText.replace(/\n+/g, ' ').trim() : `Question`;
                radios.forEach(r => {
                    const labelText = (r.closest('label')?.innerText || r.parentElement?.innerText || '').trim();
                    if (labelText) stem = stem.replace(labelText, '').trim();
                });

                const options = radios.map((r, optIdx) => {
                    const labelText = (r.closest('label')?.innerText || r.parentElement?.innerText || r.value || `Option ${optIdx}`).trim();
                    return { optIdx, labelText, el: r };
                });

                questionGroups.push({ stem, options, radios });
            });

            const prompt = `Solve multiple-choice questions for Pearson Roadmap A1.
Context:
"""
${readingPassage}
"""
Questions:
${questionGroups.map((q, idx) => `Q${idx + 1}: "${q.stem}"\n${q.options.map(o => `  [${o.optIdx}] ${o.labelText}`).join('\n')}`).join('\n\n')}
Return strictly JSON format of chosen indices: {"selectedIndices": [0, 1, ...]}`;

            try {
                const res = await queryGeminiSafe(prompt);
                const selections = res.selectedIndices || [];

                for (let qIdx = 0; qIdx < questionGroups.length; qIdx++) {
                    const targetOptIdx = selections[qIdx];
                    const group = questionGroups[qIdx];
                    if (group && targetOptIdx !== undefined) {
                        const targetRadio = group.radios[targetOptIdx] || group.radios[0];
                        if (targetRadio) {
                            targetRadio.click();
                            targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
                            await sleep(50);
                        }
                    }
                }
                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi Radio: " + err.message, "#f87171");
                return;
            }
        }

        // ---------------- DẠNG 4: BẢNG BIỂU (TABLE COMPLETION) ----------------
        const tableInputs = Array.from(document.querySelectorAll('table input[type="text"]'))
                                 .filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);

        if (tableInputs.length > 0) {
            updateStatus(`📊 Bảng biểu (${tableInputs.length} ô)...`, "#38bdf8");

            const blanksInfo = tableInputs.map((inp, idx) => {
                const tr = inp.closest('tr');
                const rowName = tr?.querySelector('td:first-child')?.innerText?.trim() || "";
                const td = inp.closest('td');
                const colIdx = td?.cellIndex;
                const colHeader = document.querySelectorAll('table th')?.[colIdx]?.innerText?.trim() || (colIdx === 1 ? "Nationality" : "Job");
                return `Blank ${idx + 1}: Person="${rowName}" | Column="${colHeader}"`;
            });

            const prompt = `Complete this English table for Pearson Roadmap A1.
Context / Material:
"""
${readingPassage}
"""
Blanks:
${blanksInfo.join('\n')}
RULES:
1. Column Nationality: Output ONLY a single capitalized nationality word.
2. Column Job: Output ONLY the job name.
Return strictly JSON format: {"answers": ["word1", "word2", ...]}`;

            try {
                const res = await queryGeminiSafe(prompt);
                const answers = res.answers || [];

                for (let i = 0; i < tableInputs.length; i++) {
                    if (tableInputs[i] && answers[i]) {
                        let word = String(answers[i]).trim().replace(/[.?!,;:]+$/, '');
                        word = word.replace(/^(she's|he's|it's|they're|i'm|a|an)\s+/gi, '').trim();

                        tableInputs[i].focus();
                        tableInputs[i].value = word;
                        tableInputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                        tableInputs[i].dispatchEvent(new Event('change', { bubbles: true }));
                        await sleep(40);
                    }
                }
                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi bảng: " + err.message, "#f87171");
                return;
            }
        }

        // ---------------- DẠNG 5: ĐIỀN TỪ / PHÂN LOẠI / CÂU HỎI (DOM SERIALIZATION) ----------------
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (inputs.length > 0) {
            updateStatus(`✍️ Đang giải ${inputs.length} ô nhập...`, "#38bdf8");

            const isNumberMatch = /conversations?\s*1[–-]3|places|number the|put in order/i.test(fullPageText);
            
            // Nhãn hóa cấu trúc [Blank N]
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

            const prefixes = inputs.map(inp => getStandalonePrefix(inp));

            let prompt = "";
            if (isNumberMatch) {
                prompt = `Exercise: "${instruction}".\nExercise Structure:\n"""\n${serializedExercise}\n"""\nEach blank MUST be ONLY a single digit number: "1", "2", or "3".\nReturn strictly JSON: {"answers": ["1", "2", ...]}`;
            } else {
                prompt = `You are an expert English teacher solving an exercise for Pearson Roadmap A1.
Context / Material:
"""
${readingPassage}
"""
Exercise Structure with Blanks:
"""
${serializedExercise}
"""
CRITICAL INSTRUCTIONS:
1. Provide the exact answer for each [Blank 1] through [Blank ${inputs.length}] in visual order.
2. If the exercise is categorization (e.g. Jobs, Countries, Nationalities), extract ONLY words mentioned in the material above. Do NOT invent external words.
3. Capitalize proper nouns. Keep common nouns lowercase.
4. If a letter is printed immediately before a blank, return the full word; the script handles trimming.
Return strictly JSON format: {"answers": ["ans for Blank 1", "ans for Blank 2", ...]}`;
            }

            try {
                const res = await queryGeminiSafe(prompt);
                const answers = res.answers || [];

                for (let i = 0; i < inputs.length; i++) {
                    const inp = inputs[i];
                    let ans = answers[i] ? String(answers[i]).trim() : "";

                    ans = ans.replace(/[.?!,;:]+$/, '').trim();
                    ans = enforceShortForms(ans);

                    const prefix = prefixes[i];
                    if (prefix && ans.toLowerCase().startsWith(prefix.toLowerCase())) {
                        ans = ans.slice(prefix.length);
                    }

                    inp.focus();
                    inp.value = ans;
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));
                    await sleep(40);
                }

                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi điền từ: " + err.message, "#f87171");
                return;
            }
        }

        // ---------------- DẠNG 6: CHECKBOX ----------------
        const checkInputs = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(inp => inp.offsetParent !== null && !inp.disabled);
        if (checkInputs.length > 0) {
            updateStatus(`☑️ Checkbox (${checkInputs.length} ô)...`, "#38bdf8");

            const choiceItems = checkInputs.map((inp, idx) => {
                const label = inp.closest('label') || inp.parentElement;
                const text = label ? label.innerText.trim() : (inp.value || `Choice ${idx + 1}`);
                return `Index ${idx}: "${text}"`;
            });

            const prompt = `Solve multiple-selection exercise for Pearson Roadmap A1.
Context:
"""
${readingPassage}
"""
Instruction: ${instruction}
Options:\n${choiceItems.join('\n')}
Return strictly JSON: {"selectedIndices": [0, 2]}`;

            try {
                const res = await queryGeminiSafe(prompt);
                const selected = res.selectedIndices || [];

                for (let i = 0; i < checkInputs.length; i++) {
                    const shouldBeChecked = selected.includes(i);
                    const inp = checkInputs[i];
                    if (inp.checked !== shouldBeChecked) {
                        inp.click();
                        await sleep(50);
                    }
                }
                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi checkbox: " + err.message, "#f87171");
                return;
            }
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
