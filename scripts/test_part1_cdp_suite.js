const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function runTest() {
  console.log('🚀 Starting Chrome CDP Test for Part 1 Distinct Images & Routing...');
  const tmpProfile = os.tmpdir() + '\\chrome-test-profile-' + Date.now();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9245',
    '--disable-gpu',
    '--user-data-dir=' + tmpProfile,
    '--no-first-run'
  ]);

  let list = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      list = await new Promise((res, rej) => http.get('http://127.0.0.1:9245/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
      if (list && list.length) break;
    } catch(e) {}
  }

  const pageTarget = list.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));
  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (res && res.exceptionDetails) {
      console.error('EXCEPTION in evaluate:', res.exceptionDetails.text, res.exceptionDetails.exception?.description);
    }
    return res && res.result ? res.result.value : undefined;
  }

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });

  // Wait for scripts to parse and window.startQuickQuiz to be available
  let isReady = false;
  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 300));
    isReady = await evaluate(`typeof window.startQuickQuiz === 'function' && typeof window.ListeningDatabaseV2 !== 'undefined'`);
    if (isReady) break;
  }
  console.log('App ready check:', isReady);

  await evaluate(`
    window.testUser = { email: 'admin@pass.edu', name: 'Đăng' };
    window.getCurrentUser = () => window.testUser;
    currentUserAccount = window.testUser;
    window.currentUserAccount = window.testUser;
  `);

  async function testTopic(topicTitle, expectedCount = 10) {
    console.log(`\n========================================\nTesting Topic: "${topicTitle}"\n========================================`);
    const startRes = await evaluate(`
      (() => {
        try {
          currentUserAccount = window.testUser;
          window.currentUserAccount = window.testUser;
          window.startQuickQuiz('listening_part1', '${topicTitle}');
          return { ok: true, count: activeQuizList.length, title: document.getElementById('quizModalTitle').textContent };
        } catch(e) {
          return { ok: false, error: e.message, stack: e.stack };
        }
      })()
    `);
    console.log('Quiz Started:', startRes);

    const images = [];
    for (let q = 1; q <= expectedCount; q++) {
      const qInfo = await evaluate(`
        (() => {
          const img = document.getElementById('quizImageImg');
          const progress = document.getElementById('quizProgressLabel')?.textContent;
          const modalTitle = document.getElementById('quizModalTitle')?.textContent;
          return {
            title: modalTitle,
            progress: progress,
            src: img?.src,
            complete: img?.complete,
            naturalWidth: img?.naturalWidth,
            naturalHeight: img?.naturalHeight
          };
        })()
      `);
      const filename = qInfo.src ? qInfo.src.split('/').pop() : 'none';
      images.push(filename);
      console.log(`  Q${q}: [${qInfo.progress}] ${filename} (Loaded: ${qInfo.complete && qInfo.naturalWidth > 0}, Dim: ${qInfo.naturalWidth}x${qInfo.naturalHeight})`);

      if (q < expectedCount) {
        await evaluate(`nextQuizQuestion();`);
        await new Promise(r => setTimeout(r, 200));
      }
    }

    const unique = new Set(images);
    console.log(`Result for "${topicTitle}": ${unique.size}/${expectedCount} unique images.`);
    
    // Close modal
    await evaluate(`closeQuizModal();`);
    await new Promise(r => setTimeout(r, 300));
    return images;
  }

  const objImgs = await testTopic('Part 1: Tranh tả vật', 10);
  const personImgs = await testTopic('Part 1: Tranh tả người', 10);
  const sceneImgs = await testTopic('Part 1: Cảnh & bối cảnh', 10);
  const interactImgs = await testTopic('Part 1: Người & vật', 10);

  const totalAll = new Set([...objImgs, ...personImgs, ...sceneImgs, ...interactImgs]);
  console.log('\n======================================================');
  console.log(`TOTAL DISTINCT IMAGES ACROSS ALL 40 PART 1 QUESTIONS: ${totalAll.size}/40`);
  console.log('======================================================');

  ws.close();
  chrome.kill();
  process.exit(totalAll.size === 40 ? 0 : 1);
}

runTest().catch((e) => {
  console.error(e);
  process.exit(1);
});
