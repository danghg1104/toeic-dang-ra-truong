const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9228;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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
      const res = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${PORT}/json/list`, r => {
          let d = '';
          r.on('data', c => d += c);
          r.on('end', () => resolve(JSON.parse(d)));
        }).on('error', reject);
      });
      if (res && res.length) break;
    } catch(e) {}
  }

  const targets = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}/json/list`, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

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
  await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });
  await sleep(1500);

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        localStorage.setItem('cung_dang_session_user', JSON.stringify({ id: 'acc-test-senior', name: 'Nguyễn Văn Đăng', targetScore: 850 }));
        if (window.UserAuthEngine) window.UserAuthEngine.init();
        window.currentUserAccount = { id: 'acc-test-senior', name: 'Nguyễn Văn Đăng', targetScore: 850 };
        
        // Click on the first Part 1 topic card!
        const card = document.querySelector('#part1-topics-container .listening-topic-card');
        if (card) {
          card.click();
        } else {
          startQuickQuiz('listening_part1', 'Part 1: Tranh tả người');
        }

        const modal = document.getElementById('quizModal');
        const qEl = document.getElementById('quizQuestionText');
        const btns = Array.from(document.getElementById('quizOptionsContainer')?.children || []);
        
        return {
          modalHidden: modal.classList.contains('hidden'),
          qText: qEl ? qEl.innerText.trim() : null,
          optionsCount: btns.length,
          optionsLabels: btns.map(b => b.innerText.trim().replace(/\\s+/g, ' '))
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Eval result:', JSON.stringify(evalRes.result?.value || evalRes.value || evalRes, null, 2));

  // Answer option B
  const answerRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const btns = Array.from(document.getElementById('quizOptionsContainer')?.children || []);
        if (btns[1]) btns[1].click();
        const expBox = document.getElementById('quizExplanationBox');
        return {
          expHidden: expBox.classList.contains('hidden'),
          optionsAfterAnswer: btns.map(b => b.innerText.trim().replace(/\\s+/g, ' '))
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Answer result:', JSON.stringify(answerRes.result?.value || answerRes.value || answerRes, null, 2));

  // Test Part 2
  const p2Res = await send('Runtime.evaluate', {
    expression: `
      (function() {
        closeQuizModal();
        const cardP2 = document.querySelector('#part2-topics-container .listening-topic-card');
        if (cardP2) cardP2.click();
        else startQuickQuiz('listening_part2', 'Part 2: Câu hỏi Wh-');

        const qEl = document.getElementById('quizQuestionText');
        const btns = Array.from(document.getElementById('quizOptionsContainer')?.children || []);
        return {
          qTextBeforeAnswer: qEl ? qEl.innerText.trim().replace(/\\s+/g, ' ') : null,
          optionsCount: btns.length,
          optionsBeforeAnswer: btns.map(b => b.innerText.trim().replace(/\\s+/g, ' '))
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Part 2 Before Answer:', JSON.stringify(p2Res.result?.value || p2Res.value || p2Res, null, 2));

  // Answer Part 2 option A
  const p2AnswerRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const btns = Array.from(document.getElementById('quizOptionsContainer')?.children || []);
        if (btns[0]) btns[0].click();
        const qEl = document.getElementById('quizQuestionText');
        const expBox = document.getElementById('quizExplanationBox');
        return {
          expHidden: expBox.classList.contains('hidden'),
          qTextAfterAnswer: qEl ? qEl.innerText.trim().replace(/\\s+/g, ' ') : null,
          optionsAfterAnswer: btns.map(b => b.innerText.trim().replace(/\\s+/g, ' '))
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Part 2 After Answer:', JSON.stringify(p2AnswerRes.result?.value || p2AnswerRes.value || p2AnswerRes, null, 2));

  ws.close();
  chromeProcess.kill();
}
run();
