// ==UserScript==
// @name         Pearson MyEnglishLab Universal AI Auto-Solver
// @namespace    http://tampermonkey.net/
// @version      10.5-SUPER-MASTER
// @description  Tự động giải mọi dạng bài Pearson Roadmap A1: Bảng biểu, Ghép số, Checkbox, Dropdown, Nối dây, Điền từ 100%
// @author       Antigravity
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = "AQ.Ab8RN6IB9IqFnvn-6PGJOwGcoaDb9iL9A9oX45i1DrWVNjyg3Q";
    let isAutoRunning = localStorage.getItem('mel_auto_run') === 'true';

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // ================= 1. BỘ GỌT VIẾT TẮT & DẤU CÂU =================
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

    // ================= 2. BỘ GỌI GEMINI AI SIÊU TỐC =================
    async function queryGemini(promptText) {
        // Thử fetch trực tiếp trước (nhanh và không bị pop-up chặn)
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { response_mime_type: "application/json" }
                })
            });
            if (res.ok) {
                const data = await res.json();
                return JSON.parse(data.candidates[0].content.parts[0].text);
            }
        } catch (e) {
            console.warn("Fetch trực tiếp lỗi, chuyển sang GM_xmlhttpRequest / model dự phòng...", e);
        }

        // Dự phòng với GM_xmlhttpRequest nếu có
        return new Promise((resolve, reject) => {
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
            const reqFunc = (typeof GM_xmlhttpRequest !== 'undefined') ? GM_xmlhttpRequest : null;
            if (reqFunc) {
                reqFunc({
                    method: "POST",
                    url: fallbackUrl,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: { response_mime_type: "application/json" }
                    }),
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(JSON.parse(data.candidates[0].content.parts[0].text));
                        } catch (err) { reject(err); }
                    },
                    onerror: reject
                });
            } else {
                reject(new Error("Không thể kết nối đến Gemini AI"));
            }
        });
    }

    // ================= 3. GIAO DIỆN NỔI BẤT TỬ (AUTO-REVIVE UI) =================
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
            width: 240px !important;
            border: 2px solid #22c55e !important;
            user-select: none !important;
        `;

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:6px; color:#22c55e; text-align:center; font-size:13px; letter-spacing:0.5px;">
                💎 AUTO-SOLVER 10.5 MASTER
            </div>
            <div id="solver-status-text" style="font-size:11px; color:#38bdf8; margin-bottom:8px; text-align:center;">
                ${isAutoRunning ? '🚀 Đang chạy liên tục...' : 'Sẵn sàng xử lý mọi bài'}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                <button id="btn-run-once" style="background:#8b5cf6; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px; transition:0.2s;">
                    ⚡ GIẢI BÀI NÀY NGAY
                </button>
                <button id="btn-run-auto" style="background:${isAutoRunning ? '#ef4444' : '#22c55e'}; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px; transition:0.2s;">
                    ${isAutoRunning ? '⏹️ TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC'}
                </button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('btn-run-once').onclick = () => runMasterSolver();

        document.getElementById('btn-run-auto').onclick = () => {
            isAutoRunning = !isAutoRunning;
            localStorage.setItem('mel_auto_run', isAutoRunning ? 'true' : 'false');
            const btn = document.getElementById('btn-run-auto');
            btn.innerText = isAutoRunning ? '⏹️ TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC';
            btn.style.background = isAutoRunning ? '#ef4444' : '#22c55e';
            if (isAutoRunning) {
                updateStatus("🚀 Bắt đầu chuỗi tự động...", "#4ade80");
                runMasterSolver();
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

    // Tự động kiểm tra và hồi sinh UI nếu trang Pearson làm mất thẻ
    ensureUI();
    setInterval(ensureUI, 800);

    // ================= 4. BỘ GIẢI TOÀN NĂNG (MASTER SOLVER) =================
    async function runMasterSolver() {
        // Nếu đang ở trang xem kết quả (/report) -> Tự bấm Next để sang bài kế tiếp
        if (window.location.href.includes('/report')) {
            updateStatus("Đang chuyển sang bài tiếp...", "#38bdf8");
            await sleep(800);
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            if (nextBtn) {
                nextBtn.click();
            } else {
                const tryAgainBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
                if (tryAgainBtn) tryAgainBtn.click();
            }
            return;
        }

        updateStatus("🔍 Đang phân tích bài tập...", "#eab308");

        // Tự động mở và lấy Lời thoại Audio Transcript (nút bong bóng 💬)
        let transcriptText = "";
        const transcriptBtn = document.querySelector('button.transcript, .audio-script, [class*="transcript"], [title*="transcript"]') ||
                              Array.from(document.querySelectorAll('a, button, div')).find(el => el.innerHTML?.includes('svg') && el.closest('.plyr, .audio-player'));
        if (transcriptBtn) {
            transcriptBtn.click();
            await sleep(250);
            const modalContent = document.querySelector('.transcript-content, .modal-body, .ui-dialog-content');
            if (modalContent) transcriptText = "\nAUDIO TRANSCRIPT:\n" + modalContent.innerText;
        }

        const fullPageText = document.body.innerText;
        const instruction = document.querySelector('.activityContent h2, .activityContent h3, h2, h3, .instruction')?.innerText || fullPageText.slice(0, 300);

        // ---------------- DẠNG 1: BẢNG BIỂU (TABLE COMPLETION) ----------------
        const tableInputs = Array.from(document.querySelectorAll('table input[type="text"]'))
                                 .filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);

        if (tableInputs.length > 0) {
            updateStatus(`📊 Nhận diện: Bảng biểu (${tableInputs.length} ô)...`, "#38bdf8");

            const blanksInfo = tableInputs.map((inp, idx) => {
                const tr = inp.closest('tr');
                const rowName = tr?.querySelector('td:first-child')?.innerText?.trim() || "";
                const td = inp.closest('td');
                const colIdx = td?.cellIndex;
                const colHeader = document.querySelectorAll('table th')?.[colIdx]?.innerText?.trim() || (colIdx === 1 ? "Nationality" : "Job");
                return `Blank ${idx + 1}: Person="${rowName}" | Column="${colHeader}"`;
            });

            const prompt = `You are completing an English table for Pearson Roadmap A1.
${transcriptText}
Instruction: ${instruction}

Blanks:
${blanksInfo.join('\n')}

CRITICAL RULES:
1. For Column Nationality: Output ONLY a single capitalized nationality word (e.g. "Polish", "Italian", "Spanish", "British", "American", "Brazilian").
2. For Column Job: Output ONLY a single lowercase job noun (e.g. "teacher", "student", "office worker", "nurse", "doctor", "manager").
3. NEVER write sentences (DO NOT write "She's..." or "He's...").
Return strictly JSON format: {"answers": ["word1", "word2", ...]}`;

            try {
                const res = await queryGemini(prompt);
                const answers = res.answers || [];

                for (let i = 0; i < tableInputs.length; i++) {
                    if (tableInputs[i] && answers[i]) {
                        let word = String(answers[i]).trim().replace(/[.?!,;:]+$/, '');
                        word = word.replace(/^(she's|he's|it's|they're|i'm|a|an)\s+/gi, '').trim();

                        tableInputs[i].focus();
                        tableInputs[i].value = word;
                        tableInputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                        tableInputs[i].dispatchEvent(new Event('change', { bubbles: true }));
                        tableInputs[i].dispatchEvent(new Event('blur', { bubbles: true }));
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

        // ---------------- DẠNG 2: NỐI DÂY (SVG MATCHING LINES) ----------------
        const matchingItems = Array.from(document.querySelectorAll('.matchingElement, [data-matching-id], .match-item, .left-column li, .right-column li'))
                                   .filter(el => el.offsetParent !== null && el.innerText.trim().length > 0);
        if (matchingItems.length >= 4) {
            updateStatus("🔗 Nhận diện: Nối dây matching...", "#38bdf8");
            const itemsText = matchingItems.map((el, i) => `Item ${i}: "${el.innerText.trim()}"`).join('\n');
            const prompt = `Match pairs for English exercise:
${instruction}
Items:
${itemsText}

Return strictly JSON pairs of indices: {"pairs": [[idxA, idxB], [idxC, idxD], ...]}`;

            try {
                const res = await queryGemini(prompt);
                const pairs = res.pairs || [];
                for (const [idxA, idxB] of pairs) {
                    const elA = matchingItems[idxA];
                    const elB = matchingItems[idxB];
                    if (elA && elB) {
                        elA.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        elA.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        await sleep(60);
                        elB.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        elB.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        await sleep(100);
                    }
                }
                await submitAndNext();
                return;
            } catch (e) {
                console.warn("Không khớp matching, chuyển sang dạng khác...");
            }
        }

        // ---------------- DẠNG 3: TRẮC NGHIỆM CHECKBOX / RADIO ----------------
        const choiceInputs = Array.from(document.querySelectorAll('input[type="checkbox"], input[type="radio"]'))
                                  .filter(inp => inp.offsetParent !== null && !inp.disabled);

        if (choiceInputs.length > 0) {
            updateStatus(`☑️ Nhận diện: Trắc nghiệm (${choiceInputs.length} lựa chọn)...`, "#38bdf8");

            const choiceItems = choiceInputs.map((inp, idx) => {
                const label = inp.closest('label') || inp.parentElement;
                const text = label ? label.innerText.trim() : (inp.value || `Choice ${idx + 1}`);
                return `Index ${idx}: "${text}"`;
            });

            const prompt = `You are solving a multiple-choice English exercise for Pearson Roadmap A1.
${transcriptText}
Instruction: ${instruction}

Options:
${choiceItems.join('\n')}

Select the CORRECT indices that MUST be checked.
Return strictly JSON: {"selectedIndices": [0, 2, 4]}`;

            try {
                const res = await queryGemini(prompt);
                const selected = res.selectedIndices || [];

                for (let i = 0; i < choiceInputs.length; i++) {
                    const shouldBeChecked = selected.includes(i);
                    const inp = choiceInputs[i];
                    if (inp.checked !== shouldBeChecked) {
                        inp.click(); // Click DUY NHẤT 1 lần để đổi trạng thái
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

        // ---------------- DẠNG 4: MENU XỔ XUỐNG (DROPDOWN SELECT) ----------------
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            updateStatus(`🔽 Nhận diện: Dropdown (${selects.length} menu)...`, "#38bdf8");

            const selectData = selects.map((sel, idx) => {
                const options = Array.from(sel.options).map(o => o.text.trim()).filter(t => t && !t.includes('---'));
                const ctx = sel.parentElement?.innerText?.replace(/\n+/g, ' ').trim() || "";
                return `Question ${idx + 1}: Context="${ctx}", Options=[${options.join(', ')}]`;
            });

            const prompt = `Choose the correct option for each dropdown in Pearson English A1:
${instruction}
Questions:
${selectData.join('\n')}

Return strictly JSON: {"answers": ["option1", "option2", ...]}`;

            try {
                const res = await queryGemini(prompt);
                const answers = res.answers || [];

                for (let i = 0; i < selects.length; i++) {
                    const sel = selects[i];
                    const target = (answers[i] || '').trim().toLowerCase();
                    const matchedOpt = Array.from(sel.options).find(o => o.text.trim().toLowerCase() === target || o.value.trim().toLowerCase() === target);
                    if (matchedOpt) {
                        sel.value = matchedOpt.value;
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                        await sleep(40);
                    }
                }
                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi dropdown: " + err.message, "#f87171");
                return;
            }
        }

        // ---------------- DẠNG 5: ĐIỀN TỪ & GHÉP SỐ (INPUT TEXT) ----------------
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (inputs.length > 0) {
            updateStatus(`✍️ Đang giải ${inputs.length} ô nhập...`, "#38bdf8");

            const isNumberMatch = /conversations?\s*1[–-]3|places|number the|put in order/i.test(fullPageText);
            const questionItems = inputs.map((inp, idx) => {
                const container = inp.closest('li, tr, .question, .item, p') || inp.parentElement?.parentElement || inp.parentElement;
                let text = container ? container.innerText.replace(/\n+/g, ' ').trim() : "";
                text = text.replace(/Example:.*?\./gi, '').trim();
                return `Question ${idx + 1}: "${text}"`;
            });

            let prompt = "";
            if (isNumberMatch) {
                prompt = `Exercise: "${instruction}". Items: ${questionItems.join('\n')}
Each blank MUST be ONLY a single digit number: "1", "2", or "3".
Return strictly JSON: {"answers": ["1", "2", "3"]}`;
            } else {
                prompt = `Exercise: ${instruction}. Questions: ${questionItems.join('\n')}
Rules:
1. Use short forms (contractions): "aren't", "isn't", "'m not", "can't", "don't".
2. DO NOT include trailing punctuation (no periods or question marks).
Return strictly JSON: {"answers": ["ans1", "ans2", ...]}`;
            }

            try {
                const res = await queryGemini(prompt);
                const answers = res.answers || [];

                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] && answers[i]) {
                        let ans = String(answers[i]).trim();
                        if (isNumberMatch) {
                            const matchDigit = ans.match(/[1-9]/);
                            if (matchDigit) ans = matchDigit[0];
                        } else {
                            ans = ans.replace(/[.?!,;:]+$/, '').trim();
                            ans = enforceShortForms(ans);

                            // Gọt chữ cái đầu nếu đề bài đã in sẵn
                            let prevText = "";
                            let prevNode = inputs[i].previousSibling;
                            while (prevNode) {
                                if (prevNode.nodeType === 3 && prevNode.textContent.trim()) {
                                    prevText = prevNode.textContent.trim();
                                    break;
                                }
                                prevNode = prevNode.previousSibling;
                            }
                            const lastChar = prevText.slice(-1);
                            if (lastChar && /^[a-zA-Z]$/.test(lastChar) && ans.toLowerCase().startsWith(lastChar.toLowerCase())) {
                                ans = ans.slice(1);
                            }
                        }

                        inputs[i].focus();
                        inputs[i].value = ans;
                        inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                        inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
                        inputs[i].dispatchEvent(new Event('blur', { bubbles: true }));
                        await sleep(40);
                    }
                }
                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi điền từ: " + err.message, "#f87171");
                return;
            }
        }

        updateStatus("Chưa nhận diện được dạng bài trên màn hình.", "#94a3b8");
    }

    // ================= 5. NỘP BÀI & TỰ ĐỘNG CHUYỂN BÀI =================
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
                if (nextBtn) {
                    nextBtn.click();
                }
            }
        }
    }

    // Tự động giải nếu chế độ Auto đang bật
    if (isAutoRunning) {
        setTimeout(runMasterSolver, 1200);
    }
})();
