const fs = require('fs');
const path = require('path');
const { VOICE_ROTATION, buildPart1Audio } = require('./neural_tts_engine.js');

const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const targets = ['p1_q22', 'p1_q23', 'p1_q24'];

async function run() {
    for (const targetId of targets) {
        const idx = db.part1.findIndex(x => x.id === targetId);
        if (idx === -1) {
            console.error(`Not found: ${targetId}`);
            continue;
        }
        const item = db.part1[idx];
        const qNum = idx + 1;
        const voice = VOICE_ROTATION[idx % VOICE_ROTATION.length];
        const outPath = path.join(__dirname, '..', 'public', 'audio', 'listening', 'part1', `${targetId}.mp3`);
        
        console.log(`Generating ${targetId} (Q${qNum}) with voice ${voice}...`);
        await buildPart1Audio(item, qNum, voice, outPath, true);
        console.log(`✅ Finished ${targetId}, saved to ${outPath}`);
    }
}

run().catch(console.error);
