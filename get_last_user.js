const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/Admin/.gemini/antigravity/brain/a5c812dd-6346-4cf6-a90c-dad8dc9b5691/.system_generated/logs/transcript.jsonl'),
  crlfDelay: Infinity
});
const userInputs = [];
rl.on('line', (line) => {
  if (line.includes('"USER_INPUT"')) {
    try {
      const obj = JSON.parse(line);
      userInputs.push({ step_index: obj.step_index, content: obj.content, media: obj.media });
    } catch(e) {}
  }
});
rl.on('close', () => {
  console.log(JSON.stringify(userInputs.slice(-5), null, 2));
});
