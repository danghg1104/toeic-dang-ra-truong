const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9230;

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
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
      const list = await getJson(`http://127.0.0.1:${PORT}/json/list`);
      if (list && list.length) break;
    } catch(e) {}
  }

  const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

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

  await new Promise(r => ws.on('open', r));
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });
  await sleep(2500);

  // Set user
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('cung_dang_session_user', JSON.stringify({
        id: 'acc-test-senior',
        name: 'Nguyễn Văn Đăng',
        targetScore: 850
      }));
      if (window.UserAuthEngine) window.UserAuthEngine.init();
      window.currentUserAccount = { id: 'acc-test-senior', name: 'Nguyễn Văn Đăng', targetScore: 850 };
      switchTab('nghe');
    `
  });
  await sleep(1000);

  const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

  // 1. TEST FULL PART PRACTICE MODAL (PART 1)
  console.log('Testing openFullPartPracticeModal(1)...');
  await send('Runtime.evaluate', {
    expression: `
      openFullPartPracticeModal(1);
    `
  });
  await sleep(800);

  const fp1Before = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const modal = document.getElementById('fullPartPracticeModal');
        const qArea = document.getElementById('fullPartQuestionArea');
        const btns = Array.from(qArea.querySelectorAll('button[onclick*="selectAnswer"]'));
        const texts = btns.map(b => b.innerText.trim().replace(/\\s+/g, ' '));
        const qStatement = qArea.querySelector('.rounded-2xl.text-sm.font-bold')?.innerText.trim().replace(/\\s+/g, ' ');
        return {
          modalVisible: !modal.classList.contains('hidden'),
          qStatement,
          buttonsCount: btns.length,
          buttonsLabels: texts,
          revealsSentences: texts.some(t => t.includes('bicycle') || t.includes('leaning') || t.includes('cyclist'))
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Full Part 1 Before Answer:', JSON.stringify(fp1Before.result?.value || fp1Before.value, null, 2));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'test_fix3_full_part1_before.png'), Buffer.from(shot.data, 'base64'));

  // Click option A
  console.log('Answering option A on Full Part 1...');
  await send('Runtime.evaluate', {
    expression: `
      FullPartPracticeEngine.selectAnswer(0, 'A');
    `
  });
  await sleep(500);

  const fp1After = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const qArea = document.getElementById('fullPartQuestionArea');
        const btns = Array.from(qArea.querySelectorAll('button[onclick*="selectAnswer"]'));
        const texts = btns.map(b => b.innerText.trim().replace(/\\s+/g, ' '));
        const hasExplanation = qArea.innerText.includes('Giải thích chi tiết') || qArea.innerText.includes('Colleagues') || qArea.innerText.includes('typing');
        return {
          buttonsAfter: texts,
          hasExplanation: hasExplanation
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Full Part 1 After Answer:', JSON.stringify(fp1After.result?.value || fp1After.value, null, 2));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'test_fix3_full_part1_after.png'), Buffer.from(shot.data, 'base64'));

  // 2. TEST FULL PART PRACTICE MODAL (PART 2)
  console.log('Testing openFullPartPracticeModal(2)...');
  await send('Runtime.evaluate', {
    expression: `
      FullPartPracticeEngine.closeModal();
      openFullPartPracticeModal(2);
    `
  });
  await sleep(800);

  const fp2Before = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const qArea = document.getElementById('fullPartQuestionArea');
        const btns = Array.from(qArea.querySelectorAll('button[onclick*="selectAnswer"]'));
        const texts = btns.map(b => b.innerText.trim().replace(/\\s+/g, ' '));
        const qStatement = qArea.querySelector('.rounded-2xl.text-sm.font-bold')?.innerText.trim().replace(/\\s+/g, ' ');
        return {
          qStatement,
          buttonsCount: btns.length,
          buttonsLabels: texts,
          revealsQuestion: qStatement.includes('Where') || qStatement.includes('When') || qStatement.includes('Who'),
          revealsResponses: texts.some(t => t.includes('Room') || t.includes('Tuesday') || t.includes('expensive'))
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Full Part 2 Before Answer:', JSON.stringify(fp2Before.result?.value || fp2Before.value, null, 2));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'test_fix3_full_part2_before.png'), Buffer.from(shot.data, 'base64'));

  // Click option B on Part 2
  console.log('Answering option B on Full Part 2...');
  await send('Runtime.evaluate', {
    expression: `
      FullPartPracticeEngine.selectAnswer(0, 'B');
    `
  });
  await sleep(500);

  const fp2After = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const qArea = document.getElementById('fullPartQuestionArea');
        const btns = Array.from(qArea.querySelectorAll('button[onclick*="selectAnswer"]'));
        const texts = btns.map(b => b.innerText.trim().replace(/\\s+/g, ' '));
        const qStatement = qArea.querySelector('.rounded-2xl.text-sm.font-bold')?.innerText.trim().replace(/\\s+/g, ' ');
        return {
          qStatementAfterAnswer: qStatement,
          buttonsAfter: texts
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Full Part 2 After Answer:', JSON.stringify(fp2After.result?.value || fp2After.value, null, 2));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'test_fix3_full_part2_after.png'), Buffer.from(shot.data, 'base64'));

  ws.close();
  chromeProcess.kill();
  console.log('All Fix 3 Full Part tests completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
