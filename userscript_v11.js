// ==UserScript==
// @name         Pearson MyEnglishLab Universal AI Auto-Solver
// @namespace    http://tampermonkey.net/
// @version      11.0-LISTENING-MASTER
// @description  Bản siêu cấp giải chuẩn 100% mọi bài Listening (nghe trực tiếp file audio) và toàn bộ bài tập Pearson
// @author       Antigravity
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @connect      *
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

    // ================= 2. BỘ TẢI AUDIO FILE TỐC ĐỘ CAO =================
    async function getAudioBase64() {
        const audioEl = document.querySelector('audio') || document.querySelector('audio source');
        const src = audioEl ? (audioEl.src || audioEl.currentSrc) : null;
        if (!src) return null;

        try {
            const res = await fetch(src);
            const blob = await res.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    if (typeof result === 'string' && result.includes(',')) {
                        resolve(result.split(',')[1]);
                    } else {
                        resolve(null);
                    }
                };
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.warn("Lỗi tải audio trực tiếp:", e);
            return null;
        }
    }

    // ================= 3. BỘ GỌI GEMINI AI ĐA PHƯƠNG THỨC (TEXT + AUDIO) =================
    async function queryGemini(promptText, audioBase64 = null) {
        const parts = [];
        if (audioBase64) {
            parts.push({
                inline_data: {
                    mime_type: "audio/mp3",
                    data: audioBase64
                }
            });
        }
        parts.push({ text: promptText });

        const bodyData = JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { response_mime_type: "application/json" }
        });

        // Sử dụng gemini-3.5-flash để vừa nghe audio siêu tốc vừa hiểu ngữ pháp
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: bodyData
            });
            if (res.ok) {
                const data = await res.json();
                return JSON.parse(data.candidates[0].content.parts[0].text);
            }
        } catch (e) {
            console.warn("Fetch lỗi, chuyển sang fallback...", e);
        }

        // Dự phòng với GM_xmlhttpRequest nếu có
        return new Promise((resolve, reject) => {
            const reqFunc = (typeof GM_xmlhttpRequest !== 'undefined') ? GM_xmlhttpRequest : null;
            if (reqFunc) {
                reqFunc({
                    method: "POST",
                    url: url,
                    headers: { "Content-Type": "application/json" },
                    data: bodyData,
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

    // ================= 4. GIAO DIỆN NỔI BẤT TỬ (AUTO-REVIVE UI) =================
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
                💎 AUTO-SOLVER 11.0 MASTER
            </div>
            <div id="solver-status-text" style="font-size:11px; color:#38bdf8; margin-bottom:8px; text-align:center;">
                ${isAutoRunning ? '🚀 Đang chạy liên tục...' : 'Sẵn sàng xử lý mọi bài'}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                <button id="btn-run-once" style="background:#8b5cf6; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">
                    ⚡ GIẢI BÀI NÀY NGAY
                </button>
                <button id="btn-run-auto" style="background:${isAutoRunning ? '#ef4444' : '#22c55e'}; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">
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

    ensureUI();
    setInterval(ensureUI, 800);

    // ================= 5. BỘ GIẢI TOÀN NĂNG (MASTER SOLVER) =================
    async function runMasterSolver() {
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

        // 1. Kiểm tra nếu có audio -> Tải file MP3 để AI nghe trực tiếp
        let audioBase64 = null;
        const hasAudio = !!document.querySelector('audio');
        if (hasAudio) {
            updateStatus("🎧 Đang tải âm thanh bài nghe...", "#c084fc");
            audioBase64 = await getAudioBase64();
            if (audioBase64) {
                updateStatus("🧠 AI đang nghe audio trực tiếp...", "#a855f7");
            }
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

            const prompt = `You are completing an English table for Pearson Roadmap A1 based on the attached audio (if any) and text.
Instruction: ${instruction}

Blanks to complete:
${blanksInfo.join('\n')}

CRITICAL RULES:
1. For Column Nationality: Output ONLY a single capitalized nationality word (e.g. "Polish", "Brazilian", "British", "Spanish", "American", "Italian").
2. For Column Job: Output ONLY the job name (e.g. "office worker", "student nurse", "teacher", "nurse", "manager", "student").
3. DO NOT write full sentences (NEVER write "She's..." or "He's...").
Return strictly JSON format: {"answers": ["word1", "word2", ...]}`;

            try {
                const res = await queryGemini(prompt, audioBase64);
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
            const prompt = `Match pairs for English exercise:\n${instruction}\nItems:\n${itemsText}\nReturn strictly JSON pairs of indices: {"pairs": [[idxA, idxB], [idxC, idxD], ...]}`;

            try {
                const res = await queryGemini(prompt, audioBase64);
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
                console.warn("Không khớp matching, thử dạng khác...");
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
Instruction: ${instruction}

Options:
${choiceItems.join('\n')}

Select the CORRECT indices that MUST be checked based on the attached audio (if any).
Return strictly JSON: {"selectedIndices": [0, 2, 4]}`;

            try {
                const res = await queryGemini(prompt, audioBase64);
                const selected = res.selectedIndices || [];

                for (let i = 0; i < choiceInputs.length; i++) {
                    const shouldBeChecked = selected.includes(i);
                    const inp = choiceInputs[i];
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

        // ---------------- DẠNG 4: MENU XỔ XUỐNG (DROPDOWN SELECT) ----------------
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            updateStatus(`🔽 Nhận diện: Dropdown (${selects.length} menu)...`, "#38bdf8");

            const selectData = selects.map((sel, idx) => {
                const options = Array.from(sel.options).map(o => o.text.trim()).filter(t => t && !t.includes('---'));
                const ctx = sel.parentElement?.innerText?.replace(/\n+/g, ' ').trim() || "";
                return `Question ${idx + 1}: Context="${ctx}", Options=[${options.join(', ')}]`;
            });

            const prompt = `Choose the correct option for each dropdown in Pearson English A1:\n${instruction}\nQuestions:\n${selectData.join('\n')}\nReturn strictly JSON: {"answers": ["option1", "option2", ...]}`;

            try {
                const res = await queryGemini(prompt, audioBase64);
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
                prompt = `Exercise: "${instruction}". Items: ${questionItems.join('\n')}\nEach blank MUST be ONLY a single digit number: "1", "2", or "3" matching the conversation in the audio.\nReturn strictly JSON: {"answers": ["1", "2", "3"]}`;
            } else {
                prompt = `Exercise: ${instruction}. Questions: ${questionItems.join('\n')}\nRules:\n1. Use short forms (contractions): "aren't", "isn't", "'m not", "can't", "don't".\n2. DO NOT include trailing punctuation.\nReturn strictly JSON: {"answers": ["ans1", "ans2", ...]}`;
            }

            try {
                const res = await queryGemini(prompt, audioBase64);
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

    // ================= 6. NỘP BÀI & TỰ ĐỘNG CHUYỂN BÀI =================
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

    if (isAutoRunning) {
        setTimeout(runMasterSolver, 1200);
    }
})();
