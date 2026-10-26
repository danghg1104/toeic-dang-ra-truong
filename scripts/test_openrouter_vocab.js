const https = require('https');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const key = (env.match(/OPENROUTER_API_KEY=([^\r\n]+)/) || [])[1]?.trim();

const promptText = `Generate a JSON array of 3 vocabulary words for the topic "Du lịch (Travel)" at CEFR level "B1".
Respond ONLY with a valid JSON array of objects strictly matching this schema with NO markdown and NO extra text:
[
  {
    "word": "itinerary",
    "meaning": "lịch trình chuyến đi",
    "phonetic": "/aɪˈtɪn.ə.rer.i/",
    "level": "B1"
  }
]`;

const postData = JSON.stringify({
  model: 'meta-llama/llama-3.3-70b-instruct',
  messages: [{ role: 'user', content: promptText }],
  temperature: 0.3
});

const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Cung Dang Ra Truong'
  },
  timeout: 10000
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('AI Response:', parsed.choices[0].message.content);
    } catch(e) {
      console.log('Raw:', data);
    }
  });
});
req.write(postData);
req.end();
