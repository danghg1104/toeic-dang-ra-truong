const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffprobe = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';
const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

function checkList(name, items, getRelPath) {
    console.log(`\n--- Checking ${name} ---`);
    const bad = [];
    for (let i = 0; i < items.length; i++) {
        const rel = getRelPath(items[i], i);
        const full = path.join(__dirname, '..', 'public', rel);
        if (!fs.existsSync(full)) {
            console.log(`❌ Missing: ${rel}`);
            bad.push(rel);
            continue;
        }
        const buf = fs.readFileSync(full);
        const isId3 = buf.subarray(0, 3).toString('utf8') === 'ID3';
        const isMp3Sync = (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0);
        let duration = 0;
        try {
            const out = execSync(`"${ffprobe}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${full}"`).toString().trim();
            duration = parseFloat(out);
        } catch (e) {
            duration = -1;
        }

        if (!isId3 && !isMp3Sync || isNaN(duration) || duration <= 0) {
            console.log(`⚠️ BAD FILE: ${rel} | Size: ${buf.length} | Dur: ${duration}`);
            bad.push(rel);
        } else {
            // console.log(`✅ OK: ${rel} (${duration.toFixed(1)}s)`);
        }
    }
    console.log(`${name} Results: ${items.length - bad.length}/${items.length} OK. Bad count: ${bad.length}`);
    if (bad.length > 0) console.log('Bad items:', bad);
    return bad;
}

const badP2 = checkList('Part 2 (25 questions)', db.part2, (item, i) => `audio/listening/part2/${item.id}.mp3`);
const badP3 = checkList('Part 3 (13 sets)', db.part3, (item, i) => `audio/listening/part3/${item.setId}.mp3`);
const badP4 = checkList('Part 4 (10 sets)', db.part4, (item, i) => `audio/listening/part4/${item.setId}.mp3`);
