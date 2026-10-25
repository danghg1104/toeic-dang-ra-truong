const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');

async function test() {
  const tmpProfile = `${os.tmpdir()}\\chrome-test-profile-${Date.now()}`;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    `--user-data-dir=${tmpProfile}`,
    '--no-first-run'
  ]);
  let list = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      list = await new Promise((res, rej) => http.get('http://127.0.0.1:9232/json/list', r => {
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
  await send('Network.enable');
  await send('Network.clearBrowserCache');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });
  await new Promise(r => setTimeout(r, 2000));
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (function() {
        try {
          localStorage.setItem('cung_dang_session_user', JSON.stringify({ id: 'acc-test', name: 'Đăng' }));
          window.currentUserAccount = { id: 'acc-test', name: 'Đăng' };
          currentUserAccount = window.currentUserAccount;
          openFullPartPracticeModal(2);
          const modal = document.getElementById('fullPartPracticeModal');
          const qArea = document.getElementById('fullPartQuestionArea');
          return {
            modalExists: !!modal,
            modalVisible: modal ? !modal.classList.contains('hidden') : false,
            qAreaExists: !!qArea
          };
        } catch(e) {
          return { error: e.message, stack: e.stack };
        }
      })()
    `,
    returnByValue: true
  });
  console.log('Eval open modal:', JSON.stringify(evalRes, null, 2));
  await new Promise(r => setTimeout(r, 800));
  const checkDb = await send('Runtime.evaluate', {
    expression: `
      ({
        hasDb: !!window.ListeningDatabaseV2,
        p1Count: window.ListeningDatabaseV2 ? window.ListeningDatabaseV2.part1.length : 0,
        q0_img: window.ListeningDatabaseV2 ? window.ListeningDatabaseV2.part1[0].image : null,
        q0_topic: window.ListeningDatabaseV2 ? window.ListeningDatabaseV2.part1[0].topic : null
      })
    `,
    returnByValue: true
  });
  console.log('In-Browser DB Check:', JSON.stringify(checkDb.result?.result?.value || checkDb, null, 2));

  // Test all 4 Part 1 topic cards
  const cardsToTest = [
    { title: 'Part 1: Tranh tả người', expectedImg: 'p1_sample_01_person.webp' },
    { title: 'Part 1: Tranh tả vật', expectedImg: 'p1_sample_02_object.webp' },
    { title: 'Part 1: Cảnh & bối cảnh', expectedImg: 'p1_sample_03_scene.webp' },
    { title: 'Part 1: Người & vật', expectedImg: 'p1_sample_04_interaction.webp' }
  ];

  const results = [];
  for (const card of cardsToTest) {
    const cardRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          try {
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
          } catch(e) {
            return { error: e.message };
          }
        })()
      `,
      returnByValue: true
    });
    const val = cardRes.result?.result?.value || cardRes.result?.value;
    results.push({
      tested: card.title,
      matchesExpected: val && val.imgSrc ? val.imgSrc.includes(card.expectedImg) : false,
      ...val
    });
    // Close modal
    await send('Runtime.evaluate', {
      expression: `document.getElementById('quizModal')?.classList.add('hidden');`
    });
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Part 1 Cards Routing Results:', JSON.stringify(results, null, 2));

  ws.close();
  chrome.kill();
}
test().catch(console.error);
