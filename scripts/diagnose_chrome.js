const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9229;

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
    if (res.method === 'Runtime.exceptionThrown') {
      console.error('CHROME EXCEPTION:', JSON.stringify(res.params.exceptionDetails));
    }
    if (res.method === 'Runtime.consoleAPICalled') {
      const text = res.params.args.map(a => a.value || a.description).join(' ');
      console.log('CONSOLE:', text);
    }
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
  
  // Wait for page load event
  await sleep(3000);

  const check = await send('Runtime.evaluate', {
    expression: `
      typeof startQuickQuiz
    `
  });
  console.log('typeof startQuickQuiz:', check.result?.value);

  ws.close();
  chromeProcess.kill();
}
run();
