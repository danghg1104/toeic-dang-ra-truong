const fs = require('fs');
const https = require('https');
const apiKey = 'AQ.Ab8RN6IB9IqFnvn-6PGJOwGcoaDb9iL9A9oX45i1DrWVNjyg3Q';

const imagePath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a5c812dd-6346-4cf6-a90c-dad8dc9b5691\\.user_uploaded\\media_1793374757032_b78a12a6.png';
const imageBase64 = fs.readFileSync(imagePath).toString('base64');

async function testModel(model) {
  return new Promise((resolve) => {
    const prompt = `Transcribe all the text in this image verbatim. Do not hallucinate.`;
    const payload = JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: 'image/png', data: imageBase64 } },
          { text: prompt }
        ]
      }]
    });

    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(b);
          resolve({ model, status: res.statusCode, text: j.candidates?.[0]?.content?.parts?.[0]?.text });
        } catch(e) {
          resolve({ model, status: res.statusCode, err: b.slice(0, 100) });
        }
      });
    });
    req.write(payload);
    req.end();
  });
}

(async () => {
  for (const m of ['gemini-flash-latest', 'gemini-3.5-flash']) {
    const r = await testModel(m);
    console.log('=== MODEL:', m, r.status);
    console.log(r.text || r.err);
  }
})();
