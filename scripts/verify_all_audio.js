const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffprobe = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';
const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log('=== VERIFYING ALL LISTENING AUDIO FILES ===');

let totalChecked = 0;
let errors = 0;

function checkFile(relPath) {
    totalChecked++;
    const fullPublic = path.join(__dirname, '..', 'public', relPath);
    if (!fs.existsSync(fullPublic)) {
        console.error(`❌ MISSING in public: ${relPath}`);
        errors++;
        return;
    }
    const stat = fs.statSync(fullPublic);
    if (stat.size < 5000) {
        console.error(`❌ TOO SMALL (${stat.size} bytes): ${relPath}`);
        errors++;
        return;
    }
    try {
        const probe = JSON.parse(execSync(`"${ffprobe}" -v error -show_entries format=duration -of json "${fullPublic}"`).toString());
        const dur = parseFloat(probe.format?.duration || 0);
        if (dur < 3) {
            console.error(`❌ DURATION TOO SHORT (${dur}s): ${relPath}`);
            errors++;
        }
    } catch (e) {
        console.error(`❌ PROBE ERROR: ${relPath} - ${e.message}`);
        errors++;
    }
}

// Part 1: 40 questions
console.log(`Checking ${db.part1.length} Part 1 files...`);
db.part1.forEach(item => {
    checkFile(`audio/listening/part1/${item.id}.mp3`);
});

// Part 2: 25 questions
console.log(`Checking ${db.part2.length} Part 2 files...`);
db.part2.forEach(item => {
    checkFile(`audio/listening/part2/${item.id}.mp3`);
});

// Part 3: 13 sets
console.log(`Checking ${db.part3.length} Part 3 files...`);
db.part3.forEach(set => {
    checkFile(`audio/listening/part3/${set.id}.mp3`);
});

// Part 4: 10 sets
console.log(`Checking ${db.part4.length} Part 4 files...`);
db.part4.forEach(set => {
    checkFile(`audio/listening/part4/${set.id}.mp3`);
});

console.log(`\nVerification Summary: Total checked: ${totalChecked}, Errors: ${errors}`);
