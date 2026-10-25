const fs = require('fs');
const path = require('path');
const {
    VOICES,
    buildPart3Audio,
    buildPart4Audio
} = require('./neural_tts_engine.js');

const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio', 'listening');

async function main() {
    console.log('🚀 Starting Neural TTS for Part 3 & Part 4...');
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    // 1. Generate Part 3 Audio (13 conversation sets)
    console.log('\n🎙️ Generating Part 3 Audio (13 Conversations)...');
    const p3Dir = path.join(AUDIO_DIR, 'part3');
    if (!fs.existsSync(p3Dir)) fs.mkdirSync(p3Dir, { recursive: true });

    const maleVoices = [VOICES.US_M, VOICES.UK_M, VOICES.AU_M, VOICES.CA_M];
    const femaleVoices = [VOICES.US_F, VOICES.UK_F, VOICES.AU_F, VOICES.CA_F];

    for (let i = 0; i < db.part3.length; i++) {
        const set = db.part3[i];
        const sNum = i + 1;
        const startQ = 32 + (i * 3); // 32, 35, 38, ...
        const mVoice = maleVoices[i % maleVoices.length];
        const fVoice = femaleVoices[i % femaleVoices.length];
        const outPath = path.join(p3Dir, `p3_set${String(sNum).padStart(2, '0')}.mp3`);

        console.log(`  [Part 3 Set ${sNum}] Q${startQ}-${startQ+2} (${set.topic}) -> Voices: ${mVoice} & ${fVoice}`);
        await buildPart3Audio(set, startQ, mVoice, fVoice, VOICES.US_F, outPath);
        console.log(`    ✓ Saved: ${outPath}`);
    }

    // 2. Generate Part 4 Audio (10 short talks)
    console.log('\n🎙️ Generating Part 4 Audio (10 Talks)...');
    const p4Dir = path.join(AUDIO_DIR, 'part4');
    if (!fs.existsSync(p4Dir)) fs.mkdirSync(p4Dir, { recursive: true });

    const talkVoices = [
        VOICES.US_F, VOICES.US_M,
        VOICES.UK_F, VOICES.UK_M,
        VOICES.AU_F, VOICES.AU_M,
        VOICES.CA_F, VOICES.CA_M,
        VOICES.US_F, VOICES.UK_F
    ];

    for (let i = 0; i < db.part4.length; i++) {
        const set = db.part4[i];
        const sNum = i + 1;
        const startQ = 71 + (i * 3); // 71, 74, 77, ...
        const voice = talkVoices[i % talkVoices.length];
        const outPath = path.join(p4Dir, `p4_set${String(sNum).padStart(2, '0')}.mp3`);

        console.log(`  [Part 4 Set ${sNum}] Q${startQ}-${startQ+2} (${set.topic}) -> Voice: ${voice}`);
        await buildPart4Audio(set, startQ, voice, outPath);
        console.log(`    ✓ Saved: ${outPath}`);
    }

    console.log('\n🎉 Neural audio for Part 3 & Part 4 generated successfully!');
}

main().catch(console.error);
