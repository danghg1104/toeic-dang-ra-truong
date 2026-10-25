const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9227;

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run'
  ]);

  for (let i = 0; i < 30; i++) {
    await sleep(300);
    try {
      const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  let msgId = 1;
  const callbacks = new Map();
  ws.on('message', data => {
    const res = JSON.parse(data);
    if (res.id && callbacks.has(res.id)) {
      const cb = callbacks.get(res.id);
      callbacks.delete(res.id);
      cb.resolve(res.result || res);
    }
  });
  await new Promise(resolve => ws.on('open', resolve));
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });
  await sleep(1500);

  const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

  // 1. Test Part 1 Quick Quiz
  console.log('Testing Part 1 quick quiz modal...');
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('cung_dang_session_user', JSON.stringify({ id: 'acc-test-senior', name: 'Nguyễn Văn Đăng', targetScore: 850 }));
      if (window.UserAuthEngine) window.UserAuthEngine.init();
      window.currentUserAccount = { id: 'acc-test-senior', name: 'Nguyễn Văn Đăng', targetScore: 850 };
      startQuickQuiz('listening_part1', 'Part 1: Tranh tả người');
    `
  });
  await sleep(600);

  const p1CheckBefore = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const modal = document.getElementById('quizModal');
        const qEl = document.getElementById('quizQuestionText');
        const optionBtns = Array.from(document.getElementById('quizOptionsContainer')?.children || []);
        const optionsTexts = optionBtns.map(b => b.innerText.trim().replace(/\\s+/g, ' '));
        return {
          isVisible: modal ? !modal.classList.contains('hidden') : false,
          qText: qEl ? qEl.innerText.trim() : '',
          optionsCount: optionBtns.length,
          optionsTexts,
          revealsSentences: optionsTexts.some(t => t.includes('bicycle') || t.includes('leaning') || t.includes('cyclist'))
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Part 1 Before Answer:', JSON.stringify(p1CheckBefore.result?.value || p1CheckBefore.value || p1CheckBefore));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'test_fix3_part1_modal_before.png'), Buffer.from(shot.data, 'base64'));

  // Click option B
  console.log('Clicking Part 1 option B...');
  await send('Runtime.evaluate', {
    expression: `
      const btns = document.getElementById('quizOptionsContainer').children;
      if (btns[1]) btns[1].click();
    `
  });
  await sleep(400);

  const p1CheckAfter = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const optionBtns = Array.from(document.getElementById('quizOptionsContainer')?.children || []);
        const optionsTexts = optionBtns.map(b => b.innerText.trim().replace(/\\s+/g, ' '));
        const expVisible = !document.getElementById('quizExplanationBox').classList.contains('hidden');
        return {
          expVisible,
          optionsTexts
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Part 1 After Answer:', JSON.stringify(p1CheckAfter.result?.value || p1CheckAfter.value || p1CheckAfter));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'test_fix3_part1_modal_after.png'), Buffer.from(shot.data, 'base64'));

  // 2. Test Part 2 Quick Quiz
  console.log('Testing Part 2 quick quiz modal...');
  await send('Runtime.evaluate', {
    expression: `
      closeQuizModal();
      startQuickQuiz('listening_part2', 'Part 2: Câu hỏi Wh-');
    `
  });
  await sleep(600);

  const p2CheckBefore = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const qEl = document.getElementById('quizQuestionText');
        const optionBtns = Array.from(document.getElementById('quizOptionsContainer')?.children || []);
        const optionsTexts = optionBtns.map(b => b.innerText.trim().replace(/\\s+/g, ' '));
        return {
          qText: qEl ? qEl.innerText.trim().replace(/\\s+/g, ' ') : '',
          optionsCount: optionBtns.length,
          optionsTexts,
          revealsQuestion: qEl ? (qEl.innerText.includes('Where') || qEl.innerText.includes('When') || qEl.innerText.includes('Who')) : false,
          revealsResponses: optionsTexts.some(t => t.includes('Room') || t.includes('Tuesday') || t.includes('expensive'))
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Part 2 Before Answer:', JSON.stringify(p2CheckBefore.result?.value || p2CheckBefore.value || p2CheckBefore));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'test_fix3_part2_modal_before.png'), Buffer.from(shot.data, 'base64'));

  // Answer Part 2 option A
  console.log('Clicking Part 2 option A...');
  await send('Runtime.evaluate', {
    expression: `
      const btns = document.getElementById('quizOptionsContainer').children;
      if (btns[0]) btns[0].click();
    `
  });
  await sleep(400);

  const p2CheckAfter = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const qEl = document.getElementById('quizQuestionText');
        const optionBtns = Array.from(document.getElementById('quizOptionsContainer')?.children || []);
        const optionsTexts = optionBtns.map(b => b.innerText.trim().replace(/\\s+/g, ' '));
        const expVisible = !document.getElementById('quizExplanationBox').classList.contains('hidden');
        return {
          expVisible,
          revealedQText: qEl ? qEl.innerText.trim().replace(/\\s+/g, ' ') : '',
          optionsTexts
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Part 2 After Answer:', JSON.stringify(p2CheckAfter.result?.value || p2CheckAfter.value || p2CheckAfter));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'test_fix3_part2_modal_after.png'), Buffer.from(shot.data, 'base64'));

  ws.close();
  chromeProcess.kill();
  console.log('Fix 3 verification finished cleanly!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
