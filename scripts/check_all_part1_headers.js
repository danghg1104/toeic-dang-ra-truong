const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffprobe = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';
const p1Dir = path.join(__dirname, '..', 'public', 'audio', 'listening', 'part1');

console.log('--- Scanning Part 1 MP3 files in public/audio/listening/part1 ---');

const badFiles = [];

for (let i = 1; i <= 40; i++) {
    const id = `p1_q${String(i).padStart(2, '0')}`;
    const p = path.join(p1Dir, `${id}.mp3`);
    if (!fs.existsSync(p)) {
        console.log(`❌ Missing: ${id}`);
        badFiles.push(id);
        continue;
    }
    const buf = fs.readFileSync(p);
    const headerHex = buf.subarray(0, 10).toString('hex');
    const isId3 = buf.subarray(0, 3).toString('utf8') === 'ID3';
    const isMp3Sync = (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0);

    let duration = 0;
    try {
        const out = execSync(`"${ffprobe}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${p}"`).toString().trim();
        duration = parseFloat(out);
    } catch (e) {
        duration = -1;
    }

    if (!isId3 && !isMp3Sync || isNaN(duration) || duration <= 0) {
        console.log(`⚠️ BAD FILE: ${id}.mp3 | Header: ${headerHex} | Duration: ${duration} | Size: ${buf.length}`);
        badFiles.push(id);
    } else {
        console.log(`✅ OK: ${id}.mp3 | Duration: ${duration.toFixed(1)}s | Size: ${buf.length}`);
    }
}

console.log('\nTotal bad Part 1 files:', badFiles);
