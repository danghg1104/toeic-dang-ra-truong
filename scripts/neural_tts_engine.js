const { DRM, TRUSTED_CLIENT_TOKEN } = require('./edge_drm.js');
const WebSocket = require('ws');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const FFMPEG_PATH = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';
const FFPROBE_PATH = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';

// Voice Roster
const VOICES = {
    'US_F': 'en-US-JennyNeural',
    'US_M': 'en-US-GuyNeural',
    'UK_F': 'en-GB-SoniaNeural',
    'UK_M': 'en-GB-RyanNeural',
    'AU_F': 'en-AU-NatashaNeural',
    'AU_M': 'en-AU-WilliamMultilingualNeural',
    'CA_F': 'en-CA-ClaraNeural',
    'CA_M': 'en-CA-LiamNeural'
};

const VOICE_ROTATION = [
    VOICES.US_F, VOICES.US_M,
    VOICES.UK_F, VOICES.UK_M,
    VOICES.AU_F, VOICES.AU_M,
    VOICES.CA_F, VOICES.CA_M
];

let isClockSkewSynced = false;

async function syncClockSkew() {
    if (isClockSkewSynced) return;
    try {
        const serverDate = await new Promise((res, rej) => {
            https.get('https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=' + TRUSTED_CLIENT_TOKEN, r => {
                res(r.headers.date);
            }).on('error', rej);
        });
        DRM.clock_skew_seconds = (new Date(serverDate).getTime() - Date.now()) / 1000;
        isClockSkewSynced = true;
    } catch (e) {
        console.warn('Clock sync warning:', e.message);
    }
}

/**
 * Synthesizes a single clean spoken phrase into a Buffer using Microsoft Edge Neural TTS.
 */
function synthesizePhrase(text, voice = 'en-US-JennyNeural') {
    return new Promise(async (resolve, reject) => {
        await syncClockSkew();

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
        let isDone = false;

        ws.on('open', () => {
            const d = new Date();
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const pad = n => String(n).padStart(2, '0');
            const timestamp = `${days[d.getUTCDay()]} ${months[d.getUTCMonth()]} ${pad(d.getUTCDate())} ${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} GMT+0000 (Coordinated Universal Time)`;

            // Send config
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

            // Escape XML entities
            const safeText = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');

            const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>` +
                `<voice name='${voice}'>` +
                `<prosody pitch='+0Hz' rate='+0%' volume='+0%'>` +
                safeText +
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
                const msg = data.toString();
                if (msg.includes('Path:turn.end')) {
                    isDone = true;
                    ws.close();
                    resolve(Buffer.concat(audioBuffers));
                }
            }
        });

        ws.on('error', (err) => {
            if (!isDone) reject(err);
        });

        ws.on('close', (code, reason) => {
            if (!isDone) {
                reject(new Error(`WebSocket closed unexpectedly (${code}): ${reason}`));
            }
        });
    });
}

/**
 * Creates a bit-exact silence MP3 buffer of given duration in seconds.
 */
function createSilenceBuffer(durationSec = 1.5) {
    return new Promise((resolve, reject) => {
        const ff = spawn(FFMPEG_PATH, [
            '-y',
            '-f', 'lavfi',
            '-i', 'anullsrc=r=24000:cl=mono',
            '-t', durationSec.toString(),
            '-c:a', 'libmp3lame',
            '-b:a', '48k',
            '-f', 'mp3',
            'pipe:1'
        ], { stdio: ['ignore', 'pipe', 'ignore'] });

        const chunks = [];
        ff.stdout.on('data', c => chunks.push(c));
        ff.on('close', code => {
            if (code === 0) resolve(Buffer.concat(chunks));
            else reject(new Error(`ffmpeg silence failed with code ${code}`));
        });
        ff.on('error', reject);
    });
}

/**
 * Concatenates an array of MP3 buffers into a single normalized MP3 using ffmpeg concat.
 */
function concatenateMp3Buffers(buffers, outputPath) {
    return new Promise((resolve, reject) => {
        const tempDir = path.join(__dirname, 'temp_audio');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const filePaths = [];
        for (let i = 0; i < buffers.length; i++) {
            const p = path.join(tempDir, `chunk_${i}.mp3`);
            fs.writeFileSync(p, buffers[i]);
            filePaths.push(p);
        }

        const listPath = path.join(tempDir, 'list.txt');
        const listContent = filePaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
        fs.writeFileSync(listPath, listContent);

        // Ensure output parent directory exists
        const outDir = path.dirname(outputPath);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        const ff = spawn(FFMPEG_PATH, [
            '-y',
            '-f', 'concat',
            '-safe', '0',
            '-i', listPath,
            '-c:a', 'libmp3lame',
            '-b:a', '48k',
            outputPath
        ], { stdio: 'inherit' });

        ff.on('close', code => {
            // Cleanup temp files
            try {
                filePaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
                if (fs.existsSync(listPath)) fs.unlinkSync(listPath);
            } catch (e) {}

            if (code === 0) resolve(outputPath);
            else reject(new Error(`ffmpeg concat failed with code ${code}`));
        });
        ff.on('error', reject);
    });
}

/**
 * Builds Part 1 Audio:
 * Format:
 * Lead-in: "Number X." (or full prompt if concise=false)
 * Pause 1.0s
 * Option (A)
 * Pause 1.2s
 * Option (B)
 * Pause 1.2s
 * Option (C)
 * Pause 1.2s
 * Option (D)
 */
async function buildPart1Audio(item, number = 1, voice = 'en-US-JennyNeural', outputPath, concise = true) {
    const buffers = [];
    const silenceLead = await createSilenceBuffer(1.0);
    const silenceOpt = await createSilenceBuffer(1.2);

    const leadIn = concise 
        ? `Number ${number}.`
        : `Number ${number}. Look at the picture marked number ${number} in your test book.`;
    buffers.push(await synthesizePhrase(leadIn, voice));
    buffers.push(silenceLead);

    for (let i = 0; i < item.options.length; i++) {
        let optText = item.options[i].trim();
        // Ensure format is "(A) Statement"
        optText = optText.replace(/^[A-D]\.\s*/, `(${String.fromCharCode(65 + i)}) `);
        buffers.push(await synthesizePhrase(optText, voice));
        if (i < item.options.length - 1) {
            buffers.push(silenceOpt);
        }
    }

    return await concatenateMp3Buffers(buffers, outputPath);
}

/**
 * Builds Part 2 Audio:
 * Format:
 * "Number X."
 * Pause 0.8s
 * Question text
 * Pause 1.2s
 * Option (A)
 * Pause 1.2s
 * Option (B)
 * Pause 1.2s
 * Option (C)
 */
async function buildPart2Audio(item, number = 7, voice = 'en-US-JennyNeural', outputPath) {
    const buffers = [];
    const silenceNum = await createSilenceBuffer(0.8);
    const silenceOpt = await createSilenceBuffer(1.2);

    buffers.push(await synthesizePhrase(`Number ${number}.`, voice));
    buffers.push(silenceNum);

    buffers.push(await synthesizePhrase(item.q, voice));
    buffers.push(silenceOpt);

    const opts = item.options.slice(0, 3);
    for (let i = 0; i < opts.length; i++) {
        let optText = opts[i].trim();
        optText = optText.replace(/^[A-C]\.\s*/, `(${String.fromCharCode(65 + i)}) `);
        buffers.push(await synthesizePhrase(optText, voice));
        if (i < opts.length - 1) {
            buffers.push(silenceOpt);
        }
    }

    return await concatenateMp3Buffers(buffers, outputPath);
}

/**
 * Builds Part 3 Audio (Conversations - Multi-speaker + 3 questions with 8s ETS pause):
 */
async function buildPart3Audio(set, startNumber = 32, primaryVoice = 'en-US-GuyNeural', secondaryVoice = 'en-GB-SoniaNeural', thirdVoice = 'en-US-JennyNeural', outputPath) {
    const buffers = [];
    const silenceLead = await createSilenceBuffer(1.2);
    const silenceTurn = await createSilenceBuffer(0.6);
    const silenceAfterDialogue = await createSilenceBuffer(1.5);
    const silenceAnswer = await createSilenceBuffer(8.0);

    const hasGraphic = !!set.graphic;
    const leadIn = `Questions ${startNumber} through ${startNumber + 2} refer to the following conversation${hasGraphic ? ' and table' : ''}.`;
    buffers.push(await synthesizePhrase(leadIn, 'en-US-JennyNeural'));
    buffers.push(silenceLead);

    // Parse dialogue lines
    const lines = set.audioScript.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let voiceToUse = primaryVoice;
        let speechText = line;

        if (/^Woman:|^W:/i.test(line)) {
            voiceToUse = secondaryVoice;
            speechText = line.replace(/^(Woman:|W:)\s*/i, '');
        } else if (/^Man 1:|^M1:/i.test(line)) {
            voiceToUse = primaryVoice;
            speechText = line.replace(/^(Man 1:|M1:)\s*/i, '');
        } else if (/^Man 2:|^M2:/i.test(line)) {
            voiceToUse = thirdVoice;
            speechText = line.replace(/^(Man 2:|M2:)\s*/i, '');
        } else if (/^Man:|^M:/i.test(line)) {
            voiceToUse = primaryVoice;
            speechText = line.replace(/^(Man:|M:)\s*/i, '');
        }

        buffers.push(await synthesizePhrase(speechText, voiceToUse));
        if (i < lines.length - 1) {
            buffers.push(silenceTurn);
        }
    }

    buffers.push(silenceAfterDialogue);

    // 3 Questions read aloud with 8s answer pause
    const questions = set.questions || [];
    for (let i = 0; i < questions.length; i++) {
        const qNum = startNumber + i;
        const qText = `Question number ${qNum}. ${questions[i].q}`;
        buffers.push(await synthesizePhrase(qText, 'en-US-JennyNeural'));
        if (i < questions.length - 1) {
            buffers.push(silenceAnswer);
        } else {
            buffers.push(await createSilenceBuffer(3.0));
        }
    }

    return await concatenateMp3Buffers(buffers, outputPath);
}

/**
 * Builds Part 4 Audio (Short Talks - Single speaker monologue + 3 questions with 8s ETS pause):
 */
async function buildPart4Audio(set, startNumber = 71, narratorVoice = 'en-US-JennyNeural', outputPath) {
    const buffers = [];
    const silenceLead = await createSilenceBuffer(1.2);
    const silenceAfterTalk = await createSilenceBuffer(1.5);
    const silenceAnswer = await createSilenceBuffer(8.0);

    const hasGraphic = !!set.graphic;
    const leadIn = `Questions ${startNumber} through ${startNumber + 2} refer to the following talk${hasGraphic ? ' and graphic' : ''}.`;
    buffers.push(await synthesizePhrase(leadIn, 'en-US-GuyNeural'));
    buffers.push(silenceLead);

    // Single narrator talk
    buffers.push(await synthesizePhrase(set.audioScript, narratorVoice));
    buffers.push(silenceAfterTalk);

    // 3 Questions read aloud with 8s answer pause
    const questions = set.questions || [];
    for (let i = 0; i < questions.length; i++) {
        const qNum = startNumber + i;
        const qText = `Question number ${qNum}. ${questions[i].q}`;
        buffers.push(await synthesizePhrase(qText, 'en-US-GuyNeural'));
        if (i < questions.length - 1) {
            buffers.push(silenceAnswer);
        } else {
            buffers.push(await createSilenceBuffer(3.0));
        }
    }

    return await concatenateMp3Buffers(buffers, outputPath);
}

module.exports = {
    VOICES,
    VOICE_ROTATION,
    synthesizePhrase,
    createSilenceBuffer,
    concatenateMp3Buffers,
    buildPart1Audio,
    buildPart2Audio,
    buildPart3Audio,
    buildPart4Audio
};
