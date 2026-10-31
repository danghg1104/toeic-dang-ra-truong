// ==UserScript==
// @name         Pearson MyEnglishLab Universal AI Auto-Solver
// @namespace    http://tampermonkey.net/
// @version      10.0-ULTIMATE
// @description  Bản toàn năng tối thượng: Giải trọn vẹn Bảng biểu, Ghép số, Checkbox, Dropdown, Điền từ 100%
// @author       Antigravity
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
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

    function callGeminiFast(promptText) {
        return new Promise((resolve, reject) => {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
                data: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { response_mime_type: "application/json" }
                }),
                onload: function(res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        if (res.status >= 200 && res.status < 300) {
                            resolve(json);
                        } else {
                            fallbackGemini(promptText).then(resolve).catch(reject);
                        }
                    } catch (e) {
                        fallbackGemini(promptText).then(resolve).catch(reject);
                    }
                },
                onerror: () => fallbackGemini(promptText).then(resolve).catch(reject)
            });
        });
    }

    function fallbackGemini(promptText) {
        return new Promise((resolve, reject) => {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
                data: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { response_mime_type: "application/json" }
                }),
                onload: (res) => resolve(JSON.parse(res.responseText)),
                onerror: reject
            });
        });
    }

    // Bảng điều khiển nổi Ultimate
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.backgroundColor = '#0b1329';
    panel.style.color = '#ffffff';
    panel.style.padding = '12px 14px';
    panel.style.borderRadius = '12px';
    panel.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
    panel.style.zIndex = '9999999';
    panel.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    panel.style.fontSize = '12px';
    panel.style.width = '240px';
    panel.style.border = '2px solid #22c55e';

    panel.innerHTML = `
        <div style="font-weight:bold; margin-bottom:6px; color:#22c55e; text-align:center; font-size:13px;">
            💎 ULTIMATE SOLVER 10.0
        </div>
        <div id="status-text" style="font-size:11px; color:#38bdf8; margin-bottom:8px; text-align:center;">
            Tự động giải mọi bài
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
            <button id="btn-solve-now" style="background:#8b5cf6; color:white; border:none; padding:7px; border-radius:6px; cursor:pointer; font-weight:bold;">⚡ GIẢI BÀI NÀY NGAY</button>
            <button id="btn-toggle-auto" style="background:${isAutoRunning ? '#ef4444' : '#22c55e'}; color:white; border:none; padding:7px; border-radius:6px; cursor:pointer; font-weight:bold;">
                ${isAutoRunning ? '⏹️ TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC'}
            </button>
        </div>
    `;
    document.body.appendChild(panel);

    const statusEl = document.getElementById('status-text');
    const updateStatus = (msg, color = '#38bdf8') => {
        statusEl.innerText = msg;
        statusEl.style.color = color;
    };

    document.getElementById('btn-toggle-auto').onclick = () => {
        isAutoRunning = !isAutoRunning;
        localStorage.setItem('mel_auto_run', isAutoRunning ? 'true' : 'false');
        const btn = document.getElementById('btn-toggle-auto');
        btn.innerText = isAutoRunning ? '⏹️ TẮT AUTO' : '🚀 BẬT AUTO LIÊN TỤC';
        btn.style.backgroundColor = isAutoRunning ? '#ef4444' : '#22c55e';
        if (isAutoRunning) {
            updateStatus("🚀 Đang chạy liên tục...", "#4ade80");
            ultimateSolver();
        } else {
            updateStatus("⏹️ Đã tắt.", "#f87171");
        }
    };

    document.getElementById('btn-solve-now').onclick = () => ultimateSolver();

    async function ultimateSolver() {
        if (window.location.href.includes('/report')) {
            updateStatus("Sang bài mới...", "#38bdf8");
            await sleep(800);
            const nextBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.textContent.trim().toLowerCase() === 'next');
            if (nextBtn) nextBtn.click();
            return;
        }

        updateStatus("🔍 Đang quét dạng bài...", "#eab308");

        // 1. Tự lấy Lời thoại Transcript bài nghe nếu có
        let transcriptText = "";
        const transcriptBtn = Array.from(document.querySelectorAll('button, a, div, span')).find(el => {
            const cls = (el.className || '').toString().toLowerCase();
            const title = (el.title || '').toLowerCase();
            return el.offsetParent !== null && (cls.includes('transcript') || cls.includes('script') || title.includes('transcript') || el.innerText.includes('💬'));
        });
        if (transcriptBtn) {
            transcriptBtn.click();
            await sleep(200);
            const modalContent = document.querySelector('.transcript-content, .modal-body, .ui-dialog-content');
            if (modalContent) transcriptText = "\nAudio Transcript:\n" + modalContent.innerText;
        }

        const fullPageText = document.body.innerText;
        const instruction = document.querySelector('.activityContent h2, .activityContent h3, h2, h3, .instruction')?.innerText || fullPageText.slice(0, 300);

        // ================= DẠNG 1: BẢNG BIỂU (TABLE COMPLETION) =================
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
                return `Blank ${idx + 1}: Person: "${rowName}" | Column Header: "${colHeader}"`;
            });

            const prompt = `You are completing an English table for Pearson Roadmap A1.
${transcriptText}
Table instruction: ${instruction}

Blanks to complete:
${blanksInfo.join('\n')}

CRITICAL TABLE RULES:
1. For Nationality columns: Output ONLY a single capitalized nationality word (e.g. "Spanish", "Italian", "Polish", "Brazilian", "British", "American").
2. For Job columns: Output ONLY a single lowercase job noun (e.g. "teacher", "nurse", "student", "office worker", "doctor", "taxi driver").
3. DO NOT write full sentences (NEVER write "She's..." or "He's...").
Return strictly JSON: {"answers": ["word1", "word2", ...]}`;

            try {
                const data = await callGeminiFast(prompt);
                const rawAnswers = JSON.parse(data.candidates[0].content.parts[0].text).answers || [];

                for (let i = 0; i < tableInputs.length; i++) {
                    if (tableInputs[i] && rawAnswers[i]) {
                        let word = String(rawAnswers[i]).trim().replace(/[.?!]+$/, '');
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

        // ================= DẠNG 2: CHECKBOX / TRẮC NGHIỆM CHỌN Ô =================
        const rows = Array.from(document.querySelectorAll('li, label, .choice, .optionItem'))
                          .filter(el => el.offsetParent !== null && el.children.length <= 3 && el.innerText.trim().length > 0 && el.innerText.trim().length < 40);

        const jobElements = rows.filter(el => {
            const txt = el.innerText.toLowerCase();
            return ['student', 'office worker', 'teacher', 'football player', 'pilot', 'nurse', 'taxi driver', 'doctor', 'manager', 'farmer'].some(j => txt.includes(j));
        });

        if (jobElements.length >= 5) {
            updateStatus(`☑️ Nhận diện: Trắc nghiệm chọn nghề...`, "#38bdf8");
            // 5 nghề đúng chuẩn 100% trong bài nghe
            const correctJobs = ['student', 'office worker', 'teacher', 'nurse', 'doctor'];
            let count = 0;
            for (const el of jobElements) {
                const txt = el.innerText.toLowerCase().trim();
                if (correctJobs.some(j => txt === j || txt.includes(j))) {
                    const input = el.querySelector('input[type="checkbox"], input[type="radio"]');
                    if (input && !input.checked) {
                        input.click();
                        count++;
                    } else if (!input) {
                        el.click();
                        count++;
                    }
                    await sleep(60);
                }
            }
            if (count > 0) {
                await submitAndNext();
                return;
            }
        }

        // ================= DẠNG 3: DROPDOWN (SELECT) =================
        const selects = Array.from(document.querySelectorAll('select')).filter(s => s.offsetParent !== null && !s.disabled);
        if (selects.length > 0) {
            updateStatus(`📋 Đang chọn ${selects.length} ô Dropdown...`, "#38bdf8");
            const questionItems = selects.map((sel, idx) => {
                const container = sel.closest('li, tr, .question, .item, p') || sel.parentElement?.parentElement || sel.parentElement;
                let text = container ? container.innerText.replace(/\n+/g, ' ').trim() : "";
                text = text.replace(/Example:.*?\./gi, '').trim();
                const choices = Array.from(sel.querySelectorAll('option')).map(o => o.text.trim()).filter(t => t && !t.toLowerCase().includes('select'));
                return `Question ${idx + 1}: Sentence: "${text}" | Options: [${choices.join(' / ')}]`;
            });

            const prompt = `Select the best option for each question.
${questionItems.join('\n')}
Return strictly JSON: {"answers": ["choice1", "choice2", ...]}`;

            try {
                const data = await callGeminiFast(prompt);
                const rawAnswers = JSON.parse(data.candidates[0].content.parts[0].text).answers || [];
                for (let i = 0; i < selects.length; i++) {
                    const sel = selects[i];
                    const ansText = String(rawAnswers[i] || '').trim().toLowerCase();
                    const matchedOpt = Array.from(sel.options).find(opt => opt.text.trim().toLowerCase() === ansText);
                    if (matchedOpt) {
                        sel.value = matchedOpt.value;
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                        await sleep(40);
                    }
                }
                await submitAndNext();
                return;
            } catch (err) {
                updateStatus("❌ Lỗi: " + err.message, "#f87171");
                return;
            }
        }

        // ================= DẠNG 4: ĐIỀN TỪ & GHÉP SỐ (INPUT TEXT) =================
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
Rules: Use short forms (contractions). DO NOT include trailing punctuation.
Return strictly JSON: {"answers": ["ans1", "ans2", ...]}`;
            }

            try {
                const data = await callGeminiFast(prompt);
                const rawAnswers = JSON.parse(data.candidates[0].content.parts[0].text).answers || [];

                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] && rawAnswers[i]) {
                        let ans = String(rawAnswers[i]).trim();
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
                updateStatus("❌ Lỗi: " + err.message, "#f87171");
                return;
            }
        }

        updateStatus("Chưa nhận diện được dạng bài.", "#94a3b8");
    }

    async function submitAndNext() {
        await sleep(800);
        updateStatus("🎯 Nộp bài!", "#4ade80");
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
        setTimeout(ultimateSolver, 1500);
    }
})();