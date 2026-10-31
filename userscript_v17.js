// ==UserScript==
// @name         Pearson MyEnglishLab Universal AI Auto-Solver
// @namespace    http://tampermonkey.net/
// @version      17.0-ULTRA-RESILIENT
// @description  Bản toàn năng tối thượng: Tự động phân luồng model (gemini-3.5-flash-lite, 3.1-flash-lite, 3.5-flash) chống quá tải 503/429, DOM serialization thông minh, tự giải 100% mọi dạng bài
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

    // 1. TẢI FILE ÂM THANH
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

    // 2. TẢI ẢNH INFOGRAPHIC / BÀI ĐỌC
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

    // 3. GỌI GEMINI AN TOÀN VỚI HỆ THỐNG MODEL DỰ PHÒNG CHỐNG QUÁ TẢI (MULTI-MODEL RESILIENCE)
    async function callSingleModel(modelName, bodyData) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

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
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || `HTTP ${res.status}`);
        } catch (fetchErr) {
            if (typeof GM_xmlhttpRequest === 'undefined') {
                throw fetchErr;
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: { "Content-Type": "application/json" },
                    data: bodyData,
                    timeout: 15000,
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                                resolve(JSON.parse(data.candidates[0].content.parts[0].text));
                            } else {
                                reject(new Error(data.error?.message || `API Error ${res.status}`));
                            }
                        } catch (err) { reject(err); }
                    },
                    ontimeout: () => reject(new Error("Timeout GM_xmlhttpRequest")),
                    onerror: reject
                });
            });
        }
    }

    async function queryGeminiSafe(promptText, imageBase64 = null, audioBase64 = null) {
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

        // Danh sách model ưu tiên (flash-lite và flash-latest chạy cực nhanh và không bao giờ bị quá tải 503)
        const candidateModels = [
            'gemini-3.5-flash-lite',
            'gemini-3.1-flash-lite',
            'gemini-flash-latest',
            'gemini-3.1-flash-lite-preview',
            'gemini-3.5-flash'
        ];

        let lastError = null;
        for (const model of candidateModels) {
            try {
                console.log(`[AutoSolver] Đang truy vấn AI model: ${model}...`);
                const result = await callSingleModel(model, bodyData);
                return result;
            } catch (err) {
                console.warn(`[AutoSolver] Model ${model} gặp lỗi: "${err.message}". Đang chuyển sang model tiếp theo...`);
                lastError = err;
                await sleep(200);
            }
        }
        throw new Error(lastError ? lastError.message : "Tất cả các model AI đều bận.");
    }

    // 4. BẢNG ĐIỀU KHIỂN NỔI THƯỜNG TRỰC
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
                💎 AUTO-SOLVER 17.0 ULTRA
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

    ensureUI();
    setInterval(ensureUI, 800);

    // 5. TRÍCH XUẤT CẤU TRÚC DOM CHUẨN XÁC DẠNG SERIALIZATION
    function serializeInputsWithBlanks(inputs) {
        inputs.forEach((inp, i) => {
            inp.setAttribute('data-solver-blank-id', String(i + 1));
        });

        const container = document.querySelector('.activityContent, #main, .contentWrapper') || document.body;
        const clone = container.cloneNode(true);

        // Loại bỏ phần tử không liên quan
        clone.querySelectorAll('button, audio, .audio-player, #mel-super-solver-panel, script, style').forEach(el => el.remove());

        // Thay thế input trong clone bằng [Blank N]
        const clonedInputs = clone.querySelectorAll('input[type="text"], input:not([type])');
        clonedInputs.forEach((clonedInp) => {
            const id = clonedInp.getAttribute('data-solver-blank-id');
            const span = document.createElement('span');
            span.textContent = id ? ` [Blank ${id}] ` : ' [Blank] ';
            if (clonedInp.parentNode) {
                clonedInp.parentNode.replaceChild(span, clonedInp);
            }
        });

        // Xóa attribute tạm
        inputs.forEach(inp => inp.removeAttribute('data-solver-blank-id'));

        return clone.innerText.replace(/\n{3,}/g, '\n\n').trim();
    }

    // 6. BỘ GIẢI TOÀN NĂNG THÍCH ỨNG
    async function runUniversalSolver() {
        if (window.location.href.includes('/report')) {
            updateStatus("Đang ở bảng điểm -> Sang bài mới...", "#38bdf8");
            await sleep(800);
            const tryAgainBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'try again');
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            if (tryAgainBtn && isAutoRunning && document.body.innerText.includes('0%')) {
                tryAgainBtn.click();
            } else if (nextBtn) {
                nextBtn.click();
            }
            return;
        }

        updateStatus("🔍 Đang nhận diện tài liệu & câu hỏi...", "#eab308");

        const imageBase64 = await getImageBase64();
        let audioBase64 = null;
        if (document.querySelector('audio')) {
            updateStatus("🎧 Đang tải âm thanh bài nghe...", "#c084fc");
            audioBase64 = await getAudioBase64();
        }

        const fullPageText = document.body.innerText;
        const mainContentEl = document.querySelector('.activityContent, #main, .contentWrapper') || document.body;
        const readingPassage = mainContentEl.innerText.replace(/\n{3,}/g, '\n\n').trim();
        const instruction = document.querySelector('.activityContent h2, .activityContent h3, h2, h3, .instruction')?.innerText || fullPageText.slice(0, 300);

        // ---------------- DẠNG 1: DROPDOWN SELECT ----------------
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
Context / Passage / Attached Image / Audio:
"""
${readingPassage}
"""
Instruction: ${instruction}

Questions:
${selectData.map(d => `Question ${d.idx + 1}: Context: "${d.ctx}" | Options: [${d.options.join(', ')}]`).join('\n')}

For each dropdown, select the EXACT matching option (e.g. True/False, T/F, or word).
Return strictly JSON format: {"answers": ["ans1", "ans2", ...]}`;

            try {
                const res = await queryGeminiSafe(prompt, imageBase64, audioBase64);
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
                            item.sel.dispatchEvent(new Event('blur', { bubbles: true }));
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

        // ---------------- DẠNG 2: TRẮC NGHIỆM CHỌN 1 (RADIO BUTTONS) ----------------
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
Context / Image:
"""
${readingPassage}
"""
Questions:
${questionGroups.map((q, idx) => `Q${idx + 1}: "${q.stem}"\n${q.options.map(o => `  [${o.optIdx}] ${o.labelText}`).join('\n')}`).join('\n\n')}

Return strictly JSON format of chosen indices: {"selectedIndices": [0, 1, ...]}`;

            try {
                const res = await queryGeminiSafe(prompt, imageBase64, audioBase64);
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

        // ---------------- DẠNG 3: BẢNG BIỂU (TABLE COMPLETION) ----------------
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
Context / Audio / Text / Image:
"""
${readingPassage}
"""
Blanks:
${blanksInfo.join('\n')}

RULES:
1. Column Nationality: Output ONLY a single capitalized nationality word (e.g. "Polish", "Brazilian", "British", "Spanish", "American", "Italian").
2. Column Job: Output ONLY the job name (e.g. "office worker", "student nurse", "teacher", "nurse", "manager", "student").
3. DO NOT write full sentences.
Return strictly JSON format: {"answers": ["word1", "word2", ...]}`;

            try {
                const res = await queryGeminiSafe(prompt, imageBase64, audioBase64);
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

        // ---------------- DẠNG 4: ĐIỀN TỪ / PHÂN LOẠI / CÂU HỎI (DOM SERIALIZATION) ----------------
        const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(inp => inp.offsetParent !== null && !inp.readOnly && !inp.disabled);
        if (inputs.length > 0) {
            updateStatus(`✍️ Đang giải ${inputs.length} ô nhập...`, "#38bdf8");

            const isNumberMatch = /conversations?\s*1[–-]3|places|number the|put in order/i.test(fullPageText);
            const serializedExercise = serializeInputsWithBlanks(inputs);

            // Kiểm tra chữ cái in sẵn ngay trước mỗi ô
            const prefixes = inputs.map(inp => {
                let prevText = "";
                let prevNode = inp.previousSibling;
                while (prevNode) {
                    if (prevNode.nodeType === 3 && prevNode.textContent.trim()) {
                        prevText = prevNode.textContent.trim();
                        break;
                    }
                    prevNode = prevNode.previousSibling;
                }
                return (prevText.slice(-1).match(/^[a-zA-Z]$/)) ? prevText.slice(-1) : "";
            });

            let prompt = "";
            if (isNumberMatch) {
                prompt = `Exercise: "${instruction}".\nExercise Structure:\n"""\n${serializedExercise}\n"""\nEach blank MUST be ONLY a single digit number: "1", "2", or "3".\nReturn strictly JSON: {"answers": ["1", "2", ...]}`;
            } else {
                prompt = `You are an expert English teacher solving an exercise for Pearson Roadmap A1.
Context / Material / Infographic / Audio:
"""
${readingPassage}
"""

Exercise Structure with Blanks:
"""
${serializedExercise}
"""

CRITICAL INSTRUCTIONS:
1. Provide the exact answer for each [Blank 1] through [Blank ${inputs.length}] in order.
2. If the exercise is a categorization task (e.g. Jobs, Countries, Nationalities), extract ONLY words mentioned in the material above that belong to each category. Do NOT invent unrelated words. Do NOT repeat words that are already shown on screen.
3. If the exercise asks "Who is...?", answer ONLY with the person's exact name from the text.
4. Capitalize proper nouns (Names, Countries, Nationalities). Keep common nouns lowercase unless at the start of a sentence.
5. If a letter is printed immediately before a blank, return the full word; the script handles trimming.
Return strictly JSON format: {"answers": ["ans for Blank 1", "ans for Blank 2", ...]}`;
            }

            try {
                const res = await queryGeminiSafe(prompt, imageBase64, audioBase64);
                const answers = res.answers || [];

                for (let i = 0; i < inputs.length; i++) {
                    const inp = inputs[i];
                    let ans = answers[i] ? String(answers[i]).trim() : "";

                    ans = ans.replace(/[.?!,;:]+$/, '').trim();
                    ans = enforceShortForms(ans);

                    // Gọt chữ cái đầu nếu đề bài đã in sẵn
                    const prefix = prefixes[i];
                    if (prefix && ans.toLowerCase().startsWith(prefix.toLowerCase())) {
                        ans = ans.slice(prefix.length);
                    }

                    inp.focus();
                    inp.value = ans;
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));
                    inp.dispatchEvent(new Event('blur', { bubbles: true }));
                    await sleep(40);
                }

                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi điền từ: " + err.message, "#f87171");
                return;
            }
        }

        // ---------------- DẠNG 5: CHECKBOX ----------------
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
                const res = await queryGeminiSafe(prompt, imageBase64, audioBase64);
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
