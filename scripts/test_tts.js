const { DRM, TRUSTED_CLIENT_TOKEN } = require('./edge_drm.js');
const WebSocket = require('ws');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

async function testTTS() {
  console.log('Fetching server date...');
  const serverDate = await new Promise((res, rej) => {
    https.get('https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=' + TRUSTED_CLIENT_TOKEN, r => {
      res(r.headers.date);
    }).on('error', rej);
  });
  DRM.clock_skew_seconds = (new Date(serverDate).getTime() - Date.now()) / 1000;
  console.log('Synchronized clock skew:', DRM.clock_skew_seconds);

  const chromiumVersion = '143.0.3650.75';
  const token = DRM.generate_sec_ms_gec_v2();
  const muid = DRM.generate_muid();
  const req_id = crypto.randomUUID().replace(/-/g, '');

  const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${token}&Sec-MS-GEC-Version=2-${chromiumVersion}&ConnectionId=${req_id}`;

  const ws = new WebSocket(url, {
    headers: {
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromiumVersion} Safari/537.36 Edg/${chromiumVersion}`,
      'Sec-MS-GEC': token,
      'Sec-MS-GEC-Version': `2-${chromiumVersion}`,
      'Cookie': `muid=${muid};`
    }
  });

  const audioBuffers = [];

  ws.on('open', () => {
    console.log('Connected! Sending speech.config and SSML...');
    const d = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const pad = n => String(n).padStart(2, '0');
    const timestamp = `${days[d.getUTCDay()]} ${months[d.getUTCMonth()]} ${pad(d.getUTCDate())} ${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} GMT+0000 (Coordinated Universal Time)`;
    
    // 1. Send speech.config
    const configMsg = `X-Timestamp:${timestamp}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
      JSON.stringify({
        context: {
          synthesis: {
            audio: {
              metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
              outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
            }
          }
        }
      });
    ws.send(configMsg);

    // 2. Send plain text wrapped in standard voice/prosody tags (no custom XML tags)
    const textToSpeak = 'Number 1. Look at the picture marked number 1 in your test book.';
    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>` +
      `<voice name='en-US-JennyNeural'>` +
      `<prosody pitch='+0Hz' rate='+0%' volume='+0%'>` +
      textToSpeak +
      `</prosody>` +
      `</voice></speak>`;

    const ssmlMsg = `X-RequestId:${req_id}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${timestamp}Z\r\nPath:ssml\r\n\r\n${ssml}`;
    ws.send(ssmlMsg);
  });

  ws.on('message', (data, isBinary) => {
    if (isBinary) {
      const headerLength = data.readUInt16BE(0);
      const audioData = data.subarray(2 + headerLength);
      if (audioData.length > 0) {
        audioBuffers.push(audioData);
      }
    } else {
      const text = data.toString();
      if (text.includes('Path:turn.end')) {
        console.log('Turn ended! Received complete audio stream.');
        ws.close();
        const finalMp3 = Buffer.concat(audioBuffers);
        fs.writeFileSync('scripts/test_jenny.mp3', finalMp3);
        console.log('Saved scripts/test_jenny.mp3, size:', finalMp3.length, 'bytes');
      }
    }
  });

  ws.on('error', (e) => console.error('WS Error:', e));
  ws.on('close', (code, reason) => console.log('WS Closed:', code, reason.toString()));
}

testTTS().catch(console.error);
