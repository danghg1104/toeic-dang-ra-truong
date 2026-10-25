const WebSocket = require('ws');
const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9255', '--disable-gpu'
  ]);
  let list = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      list = await new Promise((res, rej) => http.get('http://127.0.0.1:9255/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
      if (list && list.length) break;
    } catch(e) {}
  }
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));
  ws.on('message', data => {
    const d = JSON.parse(data);
    if (d.method === 'Runtime.exceptionThrown') {
      console.log('UNCAUGHT EXCEPTION:', JSON.stringify(d.params.exceptionDetails, null, 2));
    }
  });
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

  // Wait 3 seconds
  await new Promise(r => setTimeout(r, 3000));

  const res = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const p1 = window.ListeningDatabaseV2 ? window.ListeningDatabaseV2.part1 : null;
        return {
          hasDb: !!window.ListeningDatabaseV2,
          length: p1 ? p1.length : 0,
          firstTwo: p1 ? p1.slice(0, 2).map(x => ({ id: x.id, topic: x.topic, image: x.image })) : null
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Direct Evaluation:', JSON.stringify(res.result.result.value, null, 2));

  ws.close();
  chrome.kill();
}

test().catch(console.error);
