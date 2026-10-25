const WebSocket = require('ws');
const http = require('http');

http.get('http://127.0.0.1:9232/json/list', res => {
  let d = ''; res.on('data', c => d += c);
  res.on('end', async () => {
    try {
      const list = JSON.parse(d);
      const ws = new WebSocket(list[0].webSocketDebuggerUrl);
      await new Promise(r => ws.on('open', r));
      ws.on('message', data => {
        const msg = JSON.parse(data);
        if (msg.id === 1) {
          console.log('Result:', JSON.stringify(msg.result?.result?.value, null, 2));
          ws.close();
          process.exit(0);
        }
      });
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `({
            scriptSrc: document.querySelector('script[src*="listening-data-v2"]')?.src,
            p1_count: window.ListeningDatabaseV2?.part1?.length,
            q0: window.ListeningDatabaseV2?.part1?.[0],
            allTopics: window.ListeningDatabaseV2?.part1?.map(q => q.topic)
          })`,
          returnByValue: true
        }
      }));
    } catch(e) {
      console.error(e);
    }
  });
}).on('error', e => console.error(e.message));
