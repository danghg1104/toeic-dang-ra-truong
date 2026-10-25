const WebSocket = require('ws');
const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9265', '--disable-gpu', '--disable-extensions'
  ]);
  let list = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      list = await new Promise((res, rej) => http.get('http://127.0.0.1:9265/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
      if (list && list.length) break;
    } catch(e) {}
  }
  const pageTarget = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://')) || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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

  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 400));
    const chk = await send('Runtime.evaluate', {
      expression: 'typeof window.startQuickQuiz === "function" && typeof window.ListeningDatabaseV2 !== "undefined"'
    });
    if (chk.result?.result?.value === true) break;
  }

  const res = await send('Runtime.evaluate', {
    expression: `
      (function() {
        try {
          localStorage.setItem('cung_dang_session_user', JSON.stringify({ id: 'acc-test', name: 'Đăng' }));
          window.currentUserAccount = { id: 'acc-test', name: 'Đăng' };
          currentUserAccount = window.currentUserAccount;
          
          const cards = [
            { title: 'Part 1: Tranh tả người', expectedImg: 'p1_sample_01_person.webp' },
            { title: 'Part 1: Tranh tả vật', expectedImg: 'p1_sample_02_object.webp' },
            { title: 'Part 1: Cảnh & bối cảnh', expectedImg: 'p1_sample_03_scene.webp' },
            { title: 'Part 1: Người & vật', expectedImg: 'p1_sample_04_interaction.webp' }
          ];

          return cards.map(c => {
            startQuickQuiz('listening_part1', c.title);
            const item = activeQuizList[0];
            return {
              cardTitle: c.title,
              qId: item ? item.id : null,
              topic: item ? item.topic : null,
              image: item ? item.image : null,
              matchesExpected: item && item.image ? item.image.includes(c.expectedImg) : false
            };
          });
        } catch(e) {
          return { error: e.message, stack: e.stack };
        }
      })()
    `,
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(res.result?.result?.value, null, 2));

  ws.close();
  chrome.kill();
}
test().catch(console.error);
