const WebSocket = require('ws');
const assert = require('assert');

(async () => {
  console.log('--- Test: PvP Instant Finish on Question 10 Completed ---');
  const ws = new WebSocket('ws://localhost:3000/ws/pvp');

  await new Promise(resolve => ws.on('open', resolve));
  console.log('Connected to PvP WebSocket.');

  ws.send(JSON.stringify({
    type: 'REGISTER_USER',
    userId: 'test_speed_player_' + Date.now(),
    name: 'Speed Tester',
    avatar: ''
  }));

  let matchData = null;
  const messages = [];

  ws.on('message', raw => {
    const msg = JSON.parse(raw.toString());
    messages.push(msg);
  });

  // Join queue
  ws.send(JSON.stringify({
    type: 'JOIN_QUEUE',
    preferredCategory: 'mixed'
  }));

  // Wait for match found
  console.log('Waiting for MATCH_FOUND...');
  const startWait = Date.now();
  while (!matchData && Date.now() - startWait < 12000) {
    const found = messages.find(m => m.type === 'MATCH_FOUND');
    if (found) {
      matchData = found;
      break;
    }
    await new Promise(r => setTimeout(r, 100));
  }

  assert.ok(matchData, 'Must find match (bot or human)');
  console.log('Match Found! MatchId:', matchData.matchId, 'Opponent:', matchData.opponent?.name);

  // Submit 10 answers rapidly
  console.log('Submitting 10 answers rapidly...');
  for (let i = 0; i < 10; i++) {
    ws.send(JSON.stringify({
      type: 'SUBMIT_ANSWER',
      matchId: matchData.matchId,
      wordIndex: i,
      answer: matchData.words[i].correctIndex,
      responseTimeMs: 250
    }));
    await new Promise(r => setTimeout(r, 80));
  }

  const finishedAnswerTime = Date.now();
  console.log('Question 10 submitted. Measuring time until MATCH_END...');

  // Wait for MATCH_END
  let matchEnd = null;
  while (!matchEnd && Date.now() - finishedAnswerTime < 5000) {
    const endMsg = messages.find(m => m.type === 'MATCH_END');
    if (endMsg) {
      matchEnd = endMsg;
      break;
    }
    await new Promise(r => setTimeout(r, 50));
  }

  assert.ok(matchEnd, 'Must receive MATCH_END');
  const elapsed = Date.now() - finishedAnswerTime;
  console.log(`MATCH_END received in ${elapsed}ms! Reason: ${matchEnd.reason}, Winner: ${matchEnd.winner}`);
  assert.ok(elapsed <= 1800, `MATCH_END must arrive in <= 1800ms (actual: ${elapsed}ms), no 34s stall!`);

  console.log('✓ PASS: Instant match completion verified!');
  ws.close();
  process.exit(0);
})().catch(err => {
  console.error('Test Failed:', err.message);
  process.exit(1);
});
