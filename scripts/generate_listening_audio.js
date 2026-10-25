const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT_DIR, 'public', 'audio', 'listening');
const MANIFEST_PATH = path.join(ROOT_DIR, 'data', 'listening_audio_manifest.json');

// Accent to Google TTS Lang Code map
const ACCENT_VOICES = {
    'US': { code: 'en-US', name: 'American Accent' },
    'UK': { code: 'en-GB', name: 'British Accent' },
    'AU': { code: 'en-AU', name: 'Australian Accent' },
    'CA': { code: 'en-CA', name: 'Canadian Accent' }
};

// Đọc hoặc khởi tạo Manifest
let manifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
    try {
        manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (e) {
        manifest = {};
    }
}

function calculateHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

function splitTextIntoChunks(text, maxLength = 130) {
    const cleanText = text.replace(/[\r\n\t]+/g, ' ').trim();
    if (!cleanText) return [];
    if (cleanText.length <= maxLength) return [cleanText];

    const sentences = cleanText.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [cleanText];
    const result = [];
    let current = '';

    for (const s of sentences) {
        const sentence = s.trim();
        if (!sentence) continue;
        if (sentence.length > maxLength) {
            const words = sentence.split(' ');
            let sub = '';
            for (const w of words) {
                if ((sub + ' ' + w).trim().length <= maxLength) {
                    sub = (sub + ' ' + w).trim();
                } else {
                    if (sub) result.push(sub);
                    sub = w;
                }
            }
            if (sub) result.push(sub);
        } else if ((current + ' ' + sentence).trim().length <= maxLength) {
            current = (current + ' ' + sentence).trim();
        } else {
            if (current) result.push(current);
            current = sentence;
        }
    }
    if (current) result.push(current);
    return result.filter(Boolean);
}

// Fetch single small TTS chunk (<= 140 chars)
function fetchSingleTtsChunk(cleanText, lang = 'en-US', retries = 3) {
    return new Promise((resolve, reject) => {
        if (!cleanText) return resolve(Buffer.alloc(0));
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
        
        function attempt(rem) {
            const req = https.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://translate.google.com/'
                },
                timeout: 10000
            }, res => {
                if (res.statusCode === 200) {
                    const chunks = [];
                    res.on('data', c => chunks.push(c));
                    res.on('end', () => resolve(Buffer.concat(chunks)));
                } else if (rem > 0) {
                    setTimeout(() => attempt(rem - 1), 600);
                } else {
                    reject(new Error(`TTS Upstream status: ${res.statusCode} for text: "${cleanText.slice(0, 30)}..."`));
                }
            });

            req.on('error', err => {
                if (rem > 0) {
                    setTimeout(() => attempt(rem - 1), 600);
                } else {
                    reject(err);
                }
            });
        }

        attempt(retries);
    });
}

// Fetch MP3 segment with automatic smart chunking
async function fetchTtsChunk(text, lang = 'en-US', retries = 3) {
    const pieces = splitTextIntoChunks(text, 130);
    if (pieces.length === 0) return Buffer.alloc(0);
    if (pieces.length === 1) return fetchSingleTtsChunk(pieces[0], lang, retries);

    const buffers = [];
    for (const piece of pieces) {
        const buf = await fetchSingleTtsChunk(piece, lang, retries);
        buffers.push(buf);
    }
    return Buffer.concat(buffers);
}

// Sinh khoảng lặng giả lập tự nhiên (khoảng nghỉ chuẩn ETS)
let cachedPauseBuffer = null;
async function getPauseBuffer() {
    if (cachedPauseBuffer) return cachedPauseBuffer;
    cachedPauseBuffer = await fetchTtsChunk('...', 'en-US');
    return cachedPauseBuffer;
}

/**
 * Xử lý ghép âm thanh Part 1 (Photographs):
 * Pacing chuẩn: Number X. Look at the picture... [Pause] (A) ... [Pause] (B) ... [Pause] (C) ... [Pause] (D)
 */
async function buildPart1Audio(item, number = 1, accent = 'US') {
    const lang = ACCENT_VOICES[accent]?.code || 'en-US';
    const pause = await getPauseBuffer();
    const chunks = [];

    const leadIn = `Number ${number}. Look at the picture marked number ${number} in your test book.`;
    chunks.push(await fetchTtsChunk(leadIn, lang));
    chunks.push(pause);

    // Options (A), (B), (C), (D)
    for (const opt of item.options) {
        chunks.push(await fetchTtsChunk(opt, lang));
        chunks.push(pause);
    }

    return Buffer.concat(chunks);
}

/**
 * Xử lý ghép âm thanh Part 2 (Question-Response):
 * Pacing chuẩn: Number X. Question text... [Pause] (A) ... [Pause] (B) ... [Pause] (C)
 */
async function buildPart2Audio(item, number = 7, accent = 'US') {
    const lang = ACCENT_VOICES[accent]?.code || 'en-US';
    const pause = await getPauseBuffer();
    const chunks = [];

    const leadIn = `Number ${number}. ${item.q}`;
    chunks.push(await fetchTtsChunk(leadIn, lang));
    chunks.push(pause);

    for (const opt of item.options.slice(0, 3)) {
        chunks.push(await fetchTtsChunk(opt, lang));
        chunks.push(pause);
    }

    return Buffer.concat(chunks);
}

/**
 * Xử lý ghép âm thanh Part 3 (Conversations - Đa giọng Nam/Nữ):
 * Tự động phân tách lượt thoại giữa Man và Woman, áp dụng các giọng khác nhau, chèn khoảng nghỉ 600ms
 */
async function buildPart3Audio(dialogueScript, questions = [], startNum = 32, primaryAccent = 'US', secondaryAccent = 'UK') {
    const pause = await getPauseBuffer();
    const chunks = [];

    const leadIn = `Questions ${startNum} through ${startNum + 2} refer to the following conversation.`;
    chunks.push(await fetchTtsChunk(leadIn, 'en-US'));
    chunks.push(pause);

    // Phân tích các dòng thoại Man vs Woman
    const lines = dialogueScript.split(/(?=Man:|Woman:|M:|W:)/i).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
        const isMan = /^Man:|^M:/i.test(line);
        const speechText = line.replace(/^(Man:|Woman:|M:|W:)\s*/i, '').trim();
        // Giọng nam dùng primaryAccent, giọng nữ dùng secondaryAccent (hoặc ngược lại)
        const lang = isMan ? (ACCENT_VOICES[primaryAccent]?.code || 'en-US') : (ACCENT_VOICES[secondaryAccent]?.code || 'en-GB');
        chunks.push(await fetchTtsChunk(speechText, lang));
        chunks.push(pause);
    }

    // Đọc lần lượt 3 câu hỏi với khoảng nghỉ ETS
    for (let i = 0; i < questions.length; i++) {
        chunks.push(pause);
        const qNum = startNum + i;
        const qTextRaw = typeof questions[i] === 'object' && questions[i] !== null ? (questions[i].q || '') : questions[i];
        const qText = `Question number ${qNum}. ${qTextRaw}`;
        chunks.push(await fetchTtsChunk(qText, 'en-US'));
        // Khoảng nghỉ suy nghĩ giữa các câu hỏi
        chunks.push(pause);
        chunks.push(pause);
    }

    return Buffer.concat(chunks);
}

/**
 * Xử lý ghép âm thanh Part 4 (Short Talks - Độc thoại chuyên sâu):
 * Độc thoại (Thông báo, radio, voicemail) + Đọc 3 câu hỏi
 */
async function buildPart4Audio(talkScript, questions = [], startNum = 71, accent = 'CA') {
    const pause = await getPauseBuffer();
    const chunks = [];
    const lang = ACCENT_VOICES[accent]?.code || 'en-CA';

    const leadIn = `Questions ${startNum} through ${startNum + 2} refer to the following announcement.`;
    chunks.push(await fetchTtsChunk(leadIn, 'en-US'));
    chunks.push(pause);

    // Độc thoại
    chunks.push(await fetchTtsChunk(talkScript, lang));
    chunks.push(pause);

    // Đọc 3 câu hỏi
    for (let i = 0; i < questions.length; i++) {
        chunks.push(pause);
        const qNum = startNum + i;
        const qTextRaw = typeof questions[i] === 'object' && questions[i] !== null ? (questions[i].q || '') : questions[i];
        const qText = `Question number ${qNum}. ${qTextRaw}`;
        chunks.push(await fetchTtsChunk(qText, 'en-US'));
        chunks.push(pause);
        chunks.push(pause);
    }

    return Buffer.concat(chunks);
}

/**
 * Hàm sinh hàng loạt (Batch Generator với Resume, Retry, Hash Cache)
 */
async function generateAllListeningAudio(itemsByPart) {
    console.log('🎧 Bắt đầu quá trình Batch Audio Generator chuẩn ETS 2026...');
    let generatedCount = 0;
    let skippedCount = 0;

    for (const partKey of Object.keys(itemsByPart)) {
        const partNum = parseInt(partKey.replace(/\D/g, ''), 10);
        const items = itemsByPart[partKey];
        const partFolder = path.join(AUDIO_DIR, `part${partNum}`);
        if (!fs.existsSync(partFolder)) fs.mkdirSync(partFolder, { recursive: true });

        console.log(`\n📂 Đang xử lý Part ${partNum} (${items.length} bài)...`);

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const id = item.id || item.setId || `p${partNum}-${i + 1}`;
            const targetPath = path.join(partFolder, `${id}.mp3`);
            const audioUrl = `/audio/listening/part${partNum}/${id}.mp3`;

            // Dữ liệu hash để kiểm tra thay đổi nội dung
            const rawContent = (item.audioScript || item.q || item.transcript || '') + JSON.stringify(item.options || []);
            const contentHash = calculateHash(rawContent);

            // Kiểm tra cache hash và file tồn tại
            if (fs.existsSync(targetPath) && manifest[id] && manifest[id].hash === contentHash) {
                skippedCount++;
                item.audio_url = audioUrl;
                continue;
            }

            try {
                let mp3Buffer;
                const accent = item.accent || (['US', 'UK', 'AU', 'CA'][i % 4]);

                if (partNum === 1) {
                    mp3Buffer = await buildPart1Audio(item, i + 1, accent);
                } else if (partNum === 2) {
                    mp3Buffer = await buildPart2Audio(item, 7 + i, accent);
                } else if (partNum === 3) {
                    const secAccent = accent === 'US' ? 'UK' : (accent === 'UK' ? 'US' : 'AU');
                    mp3Buffer = await buildPart3Audio(item.audioScript || item.transcript, item.questions || [item.q], 32 + (i * 3), accent, secAccent);
                } else if (partNum === 4) {
                    mp3Buffer = await buildPart4Audio(item.audioScript || item.transcript, item.questions || [item.q], 71 + (i * 3), accent);
                }

                if (mp3Buffer && mp3Buffer.length > 0) {
                    fs.writeFileSync(targetPath, mp3Buffer);
                    manifest[id] = {
                        id,
                        part: partNum,
                        file_path: targetPath,
                        audio_url: audioUrl,
                        accent,
                        bytes: mp3Buffer.length,
                        hash: contentHash,
                        updated_at: new Date().toISOString()
                    };
                    item.audio_url = audioUrl;
                    generatedCount++;
                    process.stdout.write(`  ✅ [Part ${partNum}] ${id}.mp3 (${Math.round(mp3Buffer.length / 1024)} KB) - Accent: ${accent}\n`);
                }
            } catch (err) {
                console.error(`  ❌ Lỗi khi sinh audio cho ${id}:`, err.message);
            }
        }
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`\n🎉 Hoàn thành Batch Audio Generator!`);
    console.log(`   - File mới sinh: ${generatedCount}`);
    console.log(`   - File giữ nguyên từ cache: ${skippedCount}`);
    console.log(`   - Manifest đã lưu tại: ${MANIFEST_PATH}`);
}

module.exports = {
    generateAllListeningAudio,
    buildPart1Audio,
    buildPart2Audio,
    buildPart3Audio,
    buildPart4Audio,
    MANIFEST_PATH,
    AUDIO_DIR
};

// Self-invoking runner when run directly
if (require.main === module) {
    const dbPath = path.join(ROOT_DIR, 'data', 'listening_database_v2.json');
    if (!fs.existsSync(dbPath)) {
        console.error('❌ Không tìm thấy data/listening_database_v2.json. Hãy chạy build_listening_database_v2.js trước.');
        process.exit(1);
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    generateAllListeningAudio({
        part1: db.part1,
        part2: db.part2,
        part3: db.part3,
        part4: db.part4
    }).then(() => {
        console.log('✅ Hoàn tất quá trình sinh audio listening!');
        process.exit(0);
    }).catch(err => {
        console.error('❌ Lỗi runtime trong batch generator:', err);
        process.exit(1);
    });
}
