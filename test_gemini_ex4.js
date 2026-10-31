const https = require('https');
const apiKey = 'AQ.Ab8RN6IB9IqFnvn-6PGJOwGcoaDb9iL9A9oX45i1DrWVNjyg3Q';

const prompt = `You are solving an English exercise for Pearson Roadmap A1.
Text:
Welcome to Thistle House!
Thistle House is a large English language school. It is in the centre of Edinburgh in the UK. Our students and teachers come from all over the world.
Lesley: I'm the manager of Thistle House. I'm not from Edinburgh. I'm from London in the UK.
Gabriela: I'm from Brazil. I'm an office worker at Thistle House.
Steve: Hello, we're teachers here! I'm Steve. I'm from Vancouver in Canada. Jenny is American. She's from New York.
Mi Na & Matteo: Hi, we're students here. I'm Mi Na and I'm from South Korea. Matteo is from Italy. I'm a nurse and Matteo's a pilot.

Exercise:
1 Jobs: student, teacher, [Blank 1], [Blank 2], manager (already solved), [Blank 3]
2 Countries: [Blank 4], Canada, [Blank 5], [Blank 6], the UK (already solved)
3 Nationalities: [Blank 7], English

Extract ONLY words mentioned in the text for each category that are not already given.
Return JSON:
{"answers": ["Blank 1", "Blank 2", "Blank 3", "Blank 4", "Blank 5", "Blank 6", "Blank 7"]}
`;

const payload = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { response_mime_type: 'application/json' }
});

const req = https.request({
  hostname: 'generativelanguage.googleapis.com',
  path: '/v1beta/models/gemini-3.5-flash-lite:generateContent?key=' + apiKey,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log(b);
  });
});
req.write(payload);
req.end();
