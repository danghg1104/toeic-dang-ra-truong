const https = require('https');
const apiKey = 'AQ.Ab8RN6IB9IqFnvn-6PGJOwGcoaDb9iL9A9oX45i1DrWVNjyg3Q';

const serializedText = `
Exercise 4
Write the words from the text in the correct list.

1 Jobs
student , teacher , [Blank 1] , [Blank 2] , manager ✔ , [Blank 3]

2 Countries
[Blank 4] , Canada , [Blank 5] , [Blank 6] , the UK ✔

3 Nationalities
[Blank 7] , English
`;

const contextText = `
Welcome to Thistle House!
Thistle House is a large English language school. It is in the centre of Edinburgh in the UK. Our students and teachers come from all over the world.
Lesley: Hi! I'm Lesley. I'm the manager of Thistle House. I'm not from Edinburgh. I'm from London in the UK.
Gabriela: Hi, I'm Gabriela. I'm from Brazil. I'm an office worker at Thistle House.
Steve: Hello, we're teachers here! I'm Steve. I'm from Vancouver in Canada. Jenny is American. She's from New York.
Mi Na & Matteo: Hi, we're students here. I'm Mi Na and I'm from South Korea. Matteo is from Italy. I'm a nurse and Matteo's a pilot.
`;

const prompt = `You are an expert English teacher solving an exercise for Pearson Roadmap A1.
Material / Context:
"""
${contextText}
"""

Exercise with Blanks:
"""
${serializedText}
"""

Instructions:
1. Provide the exact word or phrase for each [Blank 1] through [Blank 7] based strictly on the material above.
2. Do not repeat words that are already shown in the exercise (e.g. student, teacher, manager, Canada, the UK, English).
3. Jobs should only be jobs mentioned in the text. Countries should only be countries mentioned in the text. Nationalities should only be nationalities mentioned in the text.
4. Capitalize proper nouns (names, countries, nationalities). Keep common nouns lowercase.
5. Return strictly JSON: {"answers": ["ans for Blank 1", "ans for Blank 2", ...]}`;

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
