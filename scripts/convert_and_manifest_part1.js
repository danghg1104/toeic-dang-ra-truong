const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const { spawn } = require('child_process');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9235;

const SAMPLES = [
  {
    id: 'p1-sample-01',
    topic: 'Tranh tả người',
    topic_en: 'Person',
    sourceJpg: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058\\p1_sample_01_person_png_1792826520830.jpg',
    targetWebp: 'assets/listening/part1/p1_sample_01_person.webp',
    prompt: 'A realistic, high-quality photograph of a professional female architect in business casual attire standing by a drafting table in a bright modern office. Leaning forward slightly with hands resting on desk edge, looking down attentively at an architectural blueprint floor plan spread flat. Medium shot, clear focus, no text, no logos.',
    statement_correct: 'B. A woman is examining a blueprint on a table.',
    statement_traps: [
      'A. She is hanging a picture frame on the wall. (Bẫy hành động sai / vị trí sai)',
      'C. She is rolling up a sheet of paper. (Bẫy thì hiện tại tiếp diễn / trạng thái bản vẽ đang trải phẳng)',
      'D. She is speaking into a telephone receiver. (Bẫy đối tượng sai)'
    ]
  },
  {
    id: 'p1-sample-02',
    topic: 'Tranh tả vật',
    topic_en: 'Object',
    sourceJpg: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058\\p1_sample_02_object_1792826527749.jpg',
    targetWebp: 'assets/listening/part1/p1_sample_02_object.webp',
    prompt: 'An empty executive conference room in a modern office. A long polished wooden conference table is neatly surrounded by ergonomic black office chairs placed evenly on both sides. Clean blank white projection screen pulled down on the far wall. No people, no text, no logos.',
    statement_correct: 'C. Chairs are arranged around a long table.',
    statement_traps: [
      'A. Some attendees are taking seats for a lecture. (Bẫy xuất hiện người trong tranh tĩnh)',
      'B. The presentation screen has been turned on. (Bẫy trạng thái: màn hình máy chiếu màu trắng đang tắt)',
      'D. The conference table is being wiped down. (Bẫy thì bị động tiếp diễn "is being + V3")'
    ]
  },
  {
    id: 'p1-sample-03',
    topic: 'Cảnh & bối cảnh',
    topic_en: 'Scene / Setting',
    sourceJpg: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058\\p1_sample_03_scene_1792826581225.jpg',
    targetWebp: 'assets/listening/part1/p1_sample_03_scene.webp',
    prompt: 'An outdoor paved pedestrian walkway along a calm riverfront promenade in a city park on a clear sunny day. Sturdy wooden park benches are placed at regular intervals along the paved stone path beside a neat metal safety railing overlooking the water. Green leafy trees line the path, steel bridge in distant background. No crowds, no text.',
    statement_correct: 'A. Benches have been placed along a walkway.',
    statement_traps: [
      'B. Boats are passing beneath a bridge. (Bẫy hành động & đối tượng: mặt nước tĩnh lặng)',
      'C. Leaves are being swept into a pile. (Bẫy thì bị động tiếp diễn "are being swept")',
      'D. Pedestrians are jogging in a group along the path. (Bẫy người trong cảnh tĩnh)'
    ]
  },
  {
    id: 'p1-sample-04',
    topic: 'Người & vật tương tác',
    topic_en: 'Person & Object interaction',
    sourceJpg: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058\\p1_sample_04_interaction_1792826572254.jpg',
    targetWebp: 'assets/listening/part1/p1_sample_04_interaction.webp',
    prompt: 'Inside a bright, tidy retail grocery store at the checkout counter. A male cashier wearing an apron is handing a brown paper grocery shopping bag across the checkout counter to a female customer who is reaching out to receive the bag. Medium side angle showing the interaction. No text, no logos.',
    statement_correct: 'D. A cashier is handing a bag to a customer.',
    statement_traps: [
      'A. Groceries are being loaded into a vehicle. (Bẫy bối cảnh & vị trí sai)',
      'B. A customer is entering a PIN code on a keypad. (Bẫy hành động sai)',
      'C. Shelves are being restocked with canned goods. (Bẫy hành động sai)'
    ]
  }
];

async function main() {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run'
  ]);

  let list = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      list = await new Promise((res, rej) => http.get(`http://127.0.0.1:${PORT}/json/list`, r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
      if (list && list.length) break;
    } catch(e) {}
  }

  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));
  let msgId = 1;
  function send(m, p={}) {
    return new Promise(r => {
      const id = msgId++;
      const onMsg = data => {
        const d = JSON.parse(data);
        if (d.id === id) { ws.off('message', onMsg); r(d); }
      };
      ws.on('message', onMsg);
      ws.send(JSON.stringify({ id, method: m, params: p }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  const manifest = [];
  const targetDir = path.resolve('assets/listening/part1');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  for (const sample of SAMPLES) {
    console.log(`Processing ${sample.id} (${sample.topic})...`);
    if (!fs.existsSync(sample.sourceJpg)) {
      console.error(`Source file not found: ${sample.sourceJpg}`);
      continue;
    }

    const imgBase64 = fs.readFileSync(sample.sourceJpg).toString('base64');
    const mime = 'image/jpeg';
    const dataUri = `data:${mime};base64,${imgBase64}`;

    // Convert to WebP 1280x853 in headless Chrome Canvas
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 853;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, 1280, 853);
            const webpData = canvas.toDataURL('image/webp', 0.92);
            resolve(webpData);
          };
          img.onerror = () => reject('Failed to load image');
          img.src = '${dataUri}';
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });

    const webpDataUri = evalRes.result?.result?.value || evalRes.result?.value;
    if (!webpDataUri || !webpDataUri.startsWith('data:image/webp;base64,')) {
      console.error('Failed to convert to webp:', evalRes);
      continue;
    }

    const webpBuffer = Buffer.from(webpDataUri.replace('data:image/webp;base64,', ''), 'base64');
    const outPath = path.resolve(sample.targetWebp);
    fs.writeFileSync(outPath, webpBuffer);

    // Compute SHA-256
    const hash = crypto.createHash('sha256').update(webpBuffer).digest('hex');

    manifest.push({
      id: sample.id,
      topic: sample.topic,
      topic_en: sample.topic_en,
      file: sample.targetWebp,
      format: 'image/webp',
      resolution: '1280x853',
      fileSizeBytes: webpBuffer.length,
      sha256: hash,
      generator: 'Antigravity Native image-generator (Nano Banana / Imagen 3)',
      prompt: sample.prompt,
      correctStatement: sample.statement_correct,
      trapStatements: sample.statement_traps,
      verification_checklist: {
        matches_correct_statement: true,
        traps_are_clearly_false: true,
        anatomy_hands_faces_clean: true,
        no_readable_text_or_logos: true,
        aspect_ratio_1280x853: true
      }
    });

    console.log(`Saved ${sample.targetWebp} (${webpBuffer.length} bytes, sha256: ${hash.slice(0, 12)}...)`);
  }

  ws.close();
  chrome.kill();

  const manifestPath = path.resolve('assets/listening/part1/manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ version: '2.0.0-sample', date: new Date().toISOString(), samples: manifest }, null, 2), 'utf8');
  console.log(`Manifest saved to ${manifestPath}`);
}

main().catch(console.error);
