const WebSocket = require('ws');
const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9238', '--disable-gpu'
  ]);
  let list = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      list = await new Promise((res, rej) => http.get('http://127.0.0.1:9238/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
      if (list && list.length) break;
    } catch(e) {}
  }
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));
  let msgId = 1;
  function send(m, p={}) {
    return new Promise(r => {
      const id = msgId++;
      const onMsg = data => {
        const d = JSON.parse(data);
        if (d.id === id) { ws.off('message', onMsg); r(d); }
      };
      ws.on('message', onMsg);
      ws.send(JSON.stringify({ id, method: m, params: p }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });

  // Wait until startQuickQuiz is defined
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 400));
    const chk = await send('Runtime.evaluate', {
      expression: 'typeof window.startQuickQuiz === "function"'
    });
    if (chk.result?.result?.value === true || chk.result?.value === true) {
      console.log(`Page ready after ${(i + 1) * 400}ms!`);
      break;
    }
  }

  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('cung_dang_session_user', JSON.stringify({ id: 'acc-test', name: 'Đăng' }));
      window.currentUserAccount = { id: 'acc-test', name: 'Đăng' };
      currentUserAccount = window.currentUserAccount;
    `
  });

  const cardsToTest = [
    { title: 'Part 1: Tranh tả người', expectedImg: 'p1_sample_01_person.webp' },
    { title: 'Part 1: Tranh tả vật', expectedImg: 'p1_sample_02_object.webp' },
    { title: 'Part 1: Cảnh & bối cảnh', expectedImg: 'p1_sample_03_scene.webp' },
    { title: 'Part 1: Người & vật', expectedImg: 'p1_sample_04_interaction.webp' }
  ];

  const results = [];

  for (const card of cardsToTest) {
    const res = await send('Runtime.evaluate', {
      expression: `
        (function() {
          startQuickQuiz('listening_part1', '${card.title}');
          const item = activeQuizList[activeQuizIndex];
          const imgEl = document.getElementById('quizImageImg');
          const modal = document.getElementById('quizModal');
          const isVisible = modal && !modal.classList.contains('hidden');
          const currentImgSrc = imgEl ? imgEl.src : '';
          return {
            title: '${card.title}',
            qId: item ? item.id : null,
            topic: item ? item.topic : null,
            imgSrc: currentImgSrc,
            modalVisible: isVisible
          };
        })()
      `,
      returnByValue: true
    });
    const val = res.result?.result?.value || res.result?.value;
    if (!val) {
      console.log('Error/Exception on card evaluate:', JSON.stringify(res, null, 2));
      continue;
    }
    results.push({
      tested: card.title,
      matchesExpected: val.imgSrc ? val.imgSrc.includes(card.expectedImg) : false,
      ...val
    });

    // Close modal before next test
    await send('Runtime.evaluate', {
      expression: `document.getElementById('quizModal')?.classList.add('hidden');`
    });
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('Results:', JSON.stringify(results, null, 2));

  ws.close();
  chrome.kill();
}

test().catch(console.error);
