const https = require('https');
const apiKey = 'AQ.Ab8RN6IB9IqFnvn-6PGJOwGcoaDb9iL9A9oX45i1DrWVNjyg3Q';
const models = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-pro-latest'
];

async function check(model) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ contents: [{ parts: [{ text: 'say ok' }] }] });
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0]?.content?.parts?.[0]?.text) {
            resolve({ model, status: res.statusCode, ok: true, text: json.candidates[0].content.parts[0].text.trim() });
          } else {
            resolve({ model, status: res.statusCode, ok: false, err: json.error?.message || data.slice(0, 100) });
          }
        } catch (e) {
          resolve({ model, status: res.statusCode, ok: false, err: data.slice(0, 100) });
        }
      });
    });
    req.on('error', e => resolve({ model, ok: false, err: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ model, ok: false, err: 'TIMEOUT' }); });
    req.write(payload);
    req.end();
  });
}

(async () => {
  for (const m of models) {
    const r = await check(m);
    console.log(`${r.model.padEnd(26)} -> Status: ${r.status} | OK: ${r.ok} | Info: ${r.ok ? r.text : r.err}`);
  }
})();
