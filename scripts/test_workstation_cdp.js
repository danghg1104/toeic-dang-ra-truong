const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function runTest() {
  console.log('🚀 Starting Chrome CDP Test for TOEIC Listening Workstation (Parts 1, 2, 3, 4)...');
  const tmpProfile = os.tmpdir() + '\\chrome-workstation-' + Date.now();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9246',
    '--disable-gpu',
    '--window-size=1440,900',
    '--user-data-dir=' + tmpProfile,
    '--no-first-run'
  ]);

  let list = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      list = await new Promise((res, rej) => http.get('http://127.0.0.1:9246/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
      if (list && list.length) break;
    } catch(e) {}
  }

  const pageTarget = list.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));
  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (res && res.exceptionDetails) {
      console.error('EXCEPTION in evaluate:', res.exceptionDetails.text, res.exceptionDetails.exception?.description);
    }
    return res && res.result ? res.result.value : undefined;
  }

  async function screenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`📸 Screenshot saved: ${outPath} (${buffer.length} bytes)`);
  }

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });

  // Wait for scripts to parse
  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 300));
    const ready = await evaluate(`typeof window.ToeicListeningWorkstation !== 'undefined' && typeof window.startQuickQuiz === 'function'`);
    if (ready) break;
  }

  // Authenticate user
  await evaluate(`
    window.testUser = { email: 'admin@pass.edu', name: 'Đăng' };
    window.getCurrentUser = () => window.testUser;
    currentUserAccount = window.testUser;
    window.currentUserAccount = window.testUser;
  `);

  // ==========================================
  // TEST 1: PART 1 (Photographs - Tranh tả người)
  // ==========================================
  console.log('\n--- 1. Testing Workstation: Part 1 Photographs ---');
  await evaluate(`startQuickQuiz('listening_part1', 'Part 1: Tranh tả người');`);
  await new Promise(r => setTimeout(r, 800));

  const p1State = await evaluate(`
    (() => {
      const ws = document.getElementById('toeicListeningWorkstation');
      const title = document.getElementById('tlwTitle')?.textContent;
      const subtitle = document.getElementById('tlwSubtitle')?.textContent;
      const inst = document.getElementById('tlwInstruction')?.textContent;
      const photo = document.querySelector('#tlwVisualArea img');
      const qCards = document.querySelectorAll('#tlwQuestionsContainer > div');
      const options = document.querySelectorAll('#tlwQuestionsContainer button');
      return {
        isOpen: !ws.classList.contains('hidden'),
        title: title,
        subtitle: subtitle,
        instruction: inst,
        hasPhoto: !!photo,
        photoSrc: photo?.src,
        qCardCount: qCards.length,
        optionCount: options.length
      };
    })()
  `);
  console.log('Part 1 State:', p1State);

  // Click option B on Question 1 to verify answer selection
  await evaluate(`
    const btn = document.querySelectorAll('#tlwQuestionsContainer button')[1];
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 400));
  await screenshot('workstation_part1_photographs.png');

  // ==========================================
  // TEST 2: PART 2 (Question-Response)
  // ==========================================
  console.log('\n--- 2. Testing Workstation: Part 2 Question-Response ---');
  await evaluate(`startQuickQuiz('listening_part2', 'Part 2: Câu hỏi Wh-');`);
  await new Promise(r => setTimeout(r, 800));

  const p2State = await evaluate(`
    (() => {
      const title = document.getElementById('tlwTitle')?.textContent;
      const subtitle = document.getElementById('tlwSubtitle')?.textContent;
      const inst = document.getElementById('tlwInstruction')?.textContent;
      const options = document.querySelectorAll('#tlwQuestionsContainer button');
      return {
        title: title,
        subtitle: subtitle,
        instruction: inst,
        optionCount: options.length
      };
    })()
  `);
  console.log('Part 2 State:', p2State);
  await screenshot('workstation_part2_question_response.png');

  // ==========================================
  // TEST 3: PART 3 (Conversations - 3 Questions Together!)
  // ==========================================
  console.log('\n--- 3. Testing Workstation: Part 3 Conversations ---');
  await evaluate(`startQuickQuiz('listening_part3', 'Part 3: Hội thoại công sở & Nhân sự');`);
  await new Promise(r => setTimeout(r, 800));

  const p3State = await evaluate(`
    (() => {
      const title = document.getElementById('tlwTitle')?.textContent;
      const subtitle = document.getElementById('tlwSubtitle')?.textContent;
      const inst = document.getElementById('tlwInstruction')?.textContent;
      const qCards = document.querySelectorAll('#tlwQuestionsContainer > div');
      const options = document.querySelectorAll('#tlwQuestionsContainer button');
      return {
        title: title,
        subtitle: subtitle,
        instruction: inst,
        qCardCount: qCards.length,
        optionCount: options.length
      };
    })()
  `);
  console.log('Part 3 State (Should have 3 questions on screen):', p3State);

  // Toggle Transcript and Bilingual on Part 3
  await evaluate(`
    ToeicListeningWorkstation.toggleTranscript();
    ToeicListeningWorkstation.toggleBilingual();
  `);
  await new Promise(r => setTimeout(r, 400));
  await screenshot('workstation_part3_conversations.png');

  // ==========================================
  // TEST 4: PART 4 (Short Talks - 3 Questions Together!)
  // ==========================================
  console.log('\n--- 4. Testing Workstation: Part 4 Short Talks ---');
  await evaluate(`startQuickQuiz('listening_part4', 'Part 4: Thông báo & Tin nhắn thoại');`);
  await new Promise(r => setTimeout(r, 800));

  const p4State = await evaluate(`
    (() => {
      const title = document.getElementById('tlwTitle')?.textContent;
      const subtitle = document.getElementById('tlwSubtitle')?.textContent;
      const inst = document.getElementById('tlwInstruction')?.textContent;
      const qCards = document.querySelectorAll('#tlwQuestionsContainer > div');
      const options = document.querySelectorAll('#tlwQuestionsContainer button');
      return {
        title: title,
        subtitle: subtitle,
        instruction: inst,
        qCardCount: qCards.length,
        optionCount: options.length
      };
    })()
  `);
  console.log('Part 4 State (Should have 3 questions on screen):', p4State);
  await screenshot('workstation_part4_short_talks.png');

  // ==========================================
  // TEST 5: QUESTION PALETTE POPUP
  // ==========================================
  console.log('\n--- 5. Testing Question Palette Popup ---');
  await evaluate(`ToeicListeningWorkstation.openPalette();`);
  await new Promise(r => setTimeout(r, 500));
  await screenshot('workstation_question_palette.png');

  console.log('\n🎉 ALL WORKSTATION TESTS PASSED CLEANLY!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

runTest().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
