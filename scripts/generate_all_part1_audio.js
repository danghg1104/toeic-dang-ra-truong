const fs = require('fs');
const path = require('path');
const {
    VOICE_ROTATION,
    buildPart1Audio
} = require('./neural_tts_engine.js');

const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio', 'listening', 'part1');

async function main() {
    console.log('🚀 Generating Microsoft Edge Neural TTS Audio for all 40 Part 1 questions...');
    if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    console.log(`Found ${db.part1.length} Part 1 questions.`);

    for (let i = 0; i < db.part1.length; i++) {
        const item = db.part1[i];
        const qNum = i + 1;
        const voice = VOICE_ROTATION[i % VOICE_ROTATION.length];
        const outPath = path.join(AUDIO_DIR, `${item.id}.mp3`);
        
        // Update item speakers/accent metadata if needed
        const accentTag = voice.includes('US') ? 'US' : voice.includes('GB') ? 'UK' : voice.includes('AU') ? 'AU' : 'CA';
        const genderTag = voice.includes('Jenny') || voice.includes('Sonia') || voice.includes('Natasha') || voice.includes('Clara') ? 'Female' : 'Male';
        item.accent = accentTag;
        item.voice_name = voice;
        item.gender = genderTag;
        item.audio_url = `/audio/listening/part1/${item.id}.mp3`;

        if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
            console.log(`[${qNum}/40] ⏩ Already exists: ${item.id}`);
            continue;
        }

        console.log(`[${qNum}/40] Generating ${item.id} (${item.topic} - ${accentTag} ${genderTag}: ${voice})...`);
        await buildPart1Audio(item, qNum, voice, outPath, true);
        console.log(`  ✓ Saved: ${outPath}`);
    }

    // Save updated database with exact accent and voice_name metadata
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log('\n✅ All 40 Part 1 neural audio files generated and database metadata updated!');
}

main().catch(err => {
    console.error('❌ Error during generation:', err);
    process.exit(1);
});
