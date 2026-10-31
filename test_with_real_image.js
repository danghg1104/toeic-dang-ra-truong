const fs = require('fs');
const https = require('https');
const apiKey = 'AQ.Ab8RN6IB9IqFnvn-6PGJOwGcoaDb9iL9A9oX45i1DrWVNjyg3Q';

const imagePath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a5c812dd-6346-4cf6-a90c-dad8dc9b5691\\.user_uploaded\\media_1793374757032_b78a12a6.png';
const imageBase64 = fs.readFileSync(imagePath).toString('base64');

const serializedExercise = `
1 Jobs
student , teacher , [Blank 1] , [Blank 2] , manager ✔ , [Blank 3]

2 Countries
[Blank 4] , Canada , [Blank 5] , [Blank 6] , the UK ✔

3 Nationalities
[Blank 7] , English
`;

const prompt = `You are an expert English teacher solving an exercise for Pearson Roadmap A1.
Read the attached infographic image carefully.

Exercise Structure with Blanks:
"""
${serializedExercise}
"""

CRITICAL INSTRUCTIONS:
1. Provide the exact answer for each [Blank 1] through [Blank 7] in order.
2. If the exercise is a categorization task (e.g. Jobs, Countries, Nationalities), extract ONLY words mentioned in the attached image that belong to each category. Do NOT invent unrelated words. Do NOT repeat words that are already shown on screen.
3. Capitalize proper nouns (Names, Countries, Nationalities). Keep common nouns lowercase unless at the start of a sentence.
Return strictly JSON format: {"answers": ["ans for Blank 1", "ans for Blank 2", "ans for Blank 3", "ans for Blank 4", "ans for Blank 5", "ans for Blank 6", "ans for Blank 7"]}`;

const payload = JSON.stringify({
  contents: [{
    parts: [
      {
        inline_data: {
          mime_type: 'image/png',
          data: imageBase64
        }
      },
      { text: prompt }
    ]
  }],
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
