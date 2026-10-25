const fs = require('fs');
const path = require('path');
const {
    VOICES,
    VOICE_ROTATION,
    buildPart1Audio,
    buildPart2Audio,
    buildPart3Audio,
    buildPart4Audio
} = require('./neural_tts_engine.js');

const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio', 'listening');

async function main() {
    console.log('🚀 Starting Microsoft Edge Neural TTS Audio Generation (v2)...');
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    // 1. Generate Part 1 Audio (6 questions)
    console.log('\n🎙️ Generating Part 1 Audio (Photographs)...');
    const p1Dir = path.join(AUDIO_DIR, 'part1');
    if (!fs.existsSync(p1Dir)) fs.mkdirSync(p1Dir, { recursive: true });

    const p1Voices = [
        VOICES.US_F, // Q1: Jenny (US)
        VOICES.US_M, // Q2: Guy (US)
        VOICES.UK_F, // Q3: Sonia (UK)
        VOICES.UK_M, // Q4: Ryan (UK)
        VOICES.AU_F, // Q5: Natasha (AU)
        VOICES.AU_M  // Q6: William (AU)
    ];

    for (let i = 0; i < db.part1.length; i++) {
        const item = db.part1[i];
        const voice = p1Voices[i % p1Voices.length];
        const outPath = path.join(p1Dir, `${item.id}.mp3`);
        console.log(`  [Part 1] ${item.id} (${item.topic}) -> Voice: ${voice}`);
        await buildPart1Audio(item, i + 1, voice, outPath, true);
        console.log(`    ✓ Saved: ${outPath}`);
    }

    // 2. Generate Part 2 Audio (25 questions)
    console.log('\n🎙️ Generating Part 2 Audio (Question-Response)...');
    const p2Dir = path.join(AUDIO_DIR, 'part2');
    if (!fs.existsSync(p2Dir)) fs.mkdirSync(p2Dir, { recursive: true });

    for (let i = 0; i < db.part2.length; i++) {
        const item = db.part2[i];
        const qNum = 7 + i; // Questions 7-31
        const voice = VOICE_ROTATION[i % VOICE_ROTATION.length];
        const outPath = path.join(p2Dir, `${item.id}.mp3`);
        console.log(`  [Part 2] ${item.id} (Q${qNum}: ${item.question_type}) -> Voice: ${voice}`);
        await buildPart2Audio(item, qNum, voice, outPath);
        console.log(`    ✓ Saved: ${outPath}`);
    }

    console.log('\n🎉 Neural audio generation for Part 1 & Part 2 completed successfully!');
}

main().catch(console.error);
