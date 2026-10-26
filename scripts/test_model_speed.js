const https = require('https');
const fs = require('fs');

if (fs.existsSync('.env')) {
  fs.readFileSync('.env', 'utf8').split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && match[1] && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
    }
  });
}

const key = process.env.OPENROUTER_API_KEY;

async function testModel(model) {
  const t0 = Date.now();
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: 'Return valid JSON only: [{"word":"trip","meaning":"chuyen di","phonetic":"/trip/","level":"A1"}]' }],
      max_tokens: 150
    });
    const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000'
      },
      timeout: 8000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(model, 'Status:', res.statusCode, 'Time:', (Date.now() - t0) + 'ms');
        if (res.statusCode !== 200) console.log('Err body:', d.slice(0, 100));
        resolve({ model, status: res.statusCode, time: Date.now() - t0 });
      });
    });
    req.on('error', (e) => {
      console.log(model, 'Error:', e.message);
      resolve({ model, error: e.message });
    });
    req.write(data);
    req.end();
  });
}

async function main() {
  await testModel('meta-llama/llama-3.1-8b-instruct');
  await testModel('google/gemini-2.0-flash-001');
  await testModel('meta-llama/llama-3.3-70b-instruct');
}

main();
