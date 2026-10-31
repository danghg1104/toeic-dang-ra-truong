// ==UserScript==
// @name         Pearson MyEnglishLab Universal AI Auto-Solver
// @namespace    http://tampermonkey.net/
// @version      13.0-OMNI-VISION-MASTER
// @description  Kiến trúc đa phương thức tối thượng (Vision + Audio + Text): Tự đọc chữ trong ảnh infographic, tự nghe audio, tự nhóm câu hỏi, giải chuẩn 100% mọi bài.
// @author       Antigravity Tech Lead
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

    // 1. TẢI FILE ÂM THANH (AUDIO MP3)
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
                    const r = reader.result;
                    resolve(typeof r === 'string' && r.includes(',') ? r.split(',')[1] : null);
                };
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            return null;
        }
    }

    // 2. TẢI HÌNH ẢNH BÀI ĐỌC INFOGRAPHIC (VISION OCR)
    async function getImageBase64() {
        const imgs = Array.from(document.querySelectorAll('.activityContent img, #main img, img'))
            .filter(img => img.offsetParent !== null && (img.naturalWidth > 180 || img.width > 180) && !img.src.includes('logo') && !img.src.includes('icon'));
        if (imgs.length === 0) return null;

        const targetImg = imgs[0];
        try {
            const res = await fetch(targetImg.src);
            const blob = await res.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const r = reader.result;
                    resolve(typeof r === 'string' && r.includes(',') ? r.split(',')[1] : null);
                };
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            return null;
        }
    }

    // 3. GỌI GEMINI 3.5 FLASH ĐA PHƯƠNG THỨC (TEXT + IMAGE + AUDIO)
    async function queryGeminiOmni(promptText, imageBase64 = null, audioBase64 = null) {
        const parts = [];
        if (imageBase64) {
            parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                }
            });
        }
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
            console.warn("Fetch lỗi, chuyển sang GM_xmlhttpRequest...", e);
        }

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
                reject(new Error("Không thể kết nối Gemini AI"));
            }
        });
    }

    // 4. BẢNG ĐIỀU KHIỂN NỔI THƯỜNG TRỰC (AUTO-REVIVE UI)
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
                💎 AUTO-SOLVER 13.0 OMNI
            </div>
            <div id="solver-status-text" style="font-size:11px; color:#38bdf8; margin-bottom:8px; text-align:center;">
                ${isAutoRunning ? '🚀 Đang chạy liên tục...' : 'Sẵn sàng xử lý mọi bài'}
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

        document.getElementById('btn-run-once').onclick = () => runOmniSolver();

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
                runOmniSolver();
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

    // 5. BỘ GIẢI ĐA PHƯƠNG THỨC OMNI
    async function runOmniSolver() {
        if (window.location.href.includes('/report')) {
            updateStatus("Đang ở bảng điểm -> Sang bài mới...", "#38bdf8");
            await sleep(800);
            const tryAgainBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            if (tryAgainBtn) {
                tryAgainBtn.click();
            } else if (nextBtn) {
                nextBtn.click();
            }
            return;
        }

        updateStatus("🔍 Đang quét Văn bản, Ảnh Infographic & Audio...", "#eab308");

        // 1. Quét hình ảnh bài đọc infographic
        const imageBase64 = await getImageBase64();
        if (imageBase64) updateStatus("🖼️ Đã nạp ảnh bài đọc vào AI...", "#38bdf8");

        // 2. Quét audio nếu có
        let audioBase64 = null;
        if (document.querySelector('audio')) {
            updateStatus("🎧 Đang tải âm thanh bài nghe...", "#c084fc");
            audioBase64 = await getAudioBase64();
        }

        const fullPageText = document.body.innerText;
        const mainContentEl = document.querySelector('.activityContent, #main, .contentWrapper') || document.body;
        const readingPassage = mainContentEl.innerText.replace(/\n{3,}/g, '\n\n').trim();
        const instruction = document.querySelector('.activityContent h2, .activityContent h3, h2, h3, .instruction')?.innerText || fullPageText.slice(0, 300);

        // ---------------- DẠNG 1: TRẮC NGHIỆM CHỌN 1 (RADIO BUTTONS) ----------------
        const radioInputs = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => r.offsetParent !== null && !r.disabled);
        if (radioInputs.length > 0) {
            updateStatus(`🔘 Đang giải ${radioInputs.length} nút Radio theo từng câu...`, "#38bdf8");

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

            const questionsPrompt = questionGroups.map((q, idx) => {
                const optStr = q.options.map(o => `   [${o.optIdx}] ${o.labelText}`).join('\n');
                return `Question ${idx + 1}: "${q.stem}"\nOptions:\n${optStr}`;
            }).join('\n\n');

            const prompt = `You are an expert English teacher solving a Pearson Roadmap A1 exercise.
Carefully read the text in the attached image (if any), text, and audio.
Instruction: ${instruction}

Passage/Context:
"""
${readingPassage}
"""

Questions:
${questionsPrompt}

CRITICAL: For each question, select the index of the CORRECT option.
Return strictly JSON format: {"selectedIndices": [idx_for_q1, idx_for_q2, ...]}`;

            try {
                const res = await queryGeminiOmni(prompt, imageBase64, audioBase64);
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

        // ---------------- DẠNG 2: BẢNG BIỂU (TABLE COMPLETION) ----------------
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

            const prompt = `You are completing an English table for Pearson Roadmap A1.
Read the attached image / text / audio.
Blanks to complete:
${blanksInfo.join('\n')}

RULES:
1. For Column Nationality: Output ONLY a single capitalized nationality word (e.g. "Polish", "Brazilian", "British", "Spanish", "American", "Italian").
2. For Column Job: Output ONLY the job name (e.g. "office worker", "student nurse", "teacher", "nurse", "manager", "student").
3. DO NOT write full sentences (NEVER write "She's..." or "He's...").
Return strictly JSON format: {"answers": ["word1", "word2", ...]}`;

            try {
                const res = await queryGeminiOmni(prompt, imageBase64, audioBase64);
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

        // ---------------- DẠNG 3: ĐIỀN TỪ & TRẢ LỜI CÂU HỎI (INPUT TEXT) ----------------
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
                prompt = `Exercise: "${instruction}". Items:\n${questionItems.join('\n')}\nEach blank MUST be ONLY a single digit number: "1", "2", or "3".\nReturn strictly JSON: {"answers": ["1", "2", "3"]}`;
            } else {
                prompt = `You are answering English reading/grammar questions for Pearson Roadmap A1.
Read the attached infographic image (which contains the names, stories, and details) and text carefully.
Instruction: ${instruction}

Passage/Context:
"""
${readingPassage}
"""

Questions to answer:
${questionItems.join('\n')}

CRITICAL RULES:
1. For questions like "Who is...?", output ONLY the character's exact name from the text/image (e.g., "Gabriela", "Steve", "Matteo", "Lesley", "Jenny", "Mi Na"). DO NOT hallucinate other names!
2. Use short forms (contractions) if asking for sentences.
3. DO NOT include trailing punctuation.
Return strictly JSON format: {"answers": ["ans1", "ans2", ...]}`;
            }

            try {
                const res = await queryGeminiOmni(prompt, imageBase64, audioBase64);
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

        // ---------------- DẠNG 4: DROPDOWN & CHECKBOX ----------------
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            updateStatus(`🔽 Dropdown (${selects.length} menu)...`, "#38bdf8");
            const selectData = selects.map((sel, idx) => {
                const options = Array.from(sel.options).map(o => o.text.trim()).filter(t => t && !t.includes('---'));
                const ctx = sel.parentElement?.innerText?.replace(/\n+/g, ' ').trim() || "";
                return `Question ${idx + 1}: Context="${ctx}", Options=[${options.join(', ')}]`;
            });

            const prompt = `Choose correct options for dropdowns in Pearson English A1:
${instruction}
Questions:\n${selectData.join('\n')}\nReturn strictly JSON: {"answers": ["option1", "option2", ...]}`;

            try {
                const res = await queryGeminiOmni(prompt, imageBase64, audioBase64);
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
        setTimeout(runOmniSolver, 1200);
    }
})();
