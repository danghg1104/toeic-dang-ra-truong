const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffprobe = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';
const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log('Part 3 item keys:', Object.keys(db.part3[0]));
console.log('Part 3 item 0:', {
    id: db.part3[0].id,
    setId: db.part3[0].setId,
    set_id: db.part3[0].set_id,
    audio_url: db.part3[0].audio_url
});

console.log('Part 4 item keys:', Object.keys(db.part4[0]));
console.log('Part 4 item 0:', {
    id: db.part4[0].id,
    setId: db.part4[0].setId,
    set_id: db.part4[0].set_id,
    audio_url: db.part4[0].audio_url
});

['p1_q22.mp3', 'p1_q23.mp3', 'p1_q24.mp3'].forEach(f => {
    const p = path.join(__dirname, '..', 'public', 'audio', 'listening', 'part1', f);
    const stat = fs.statSync(p);
    console.log(`\nFile ${f}, size: ${stat.size}`);
    try {
        const out = execSync(`"${ffprobe}" -v error -show_entries format=duration,bit_rate -of json "${p}"`).toString();
        console.log(out);
    } catch (e) {
        console.log('Error:', e.message);
    }
});
