const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffprobe = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';

function checkSample(p) {
    if (!fs.existsSync(p)) return;
    const stat = fs.statSync(p);
    let probeInfo = '';
    try {
        probeInfo = execSync(`"${ffprobe}" -v error -show_entries format=duration,bit_rate -of json "${p}"`).toString().trim();
    } catch (e) {
        probeInfo = e.message;
    }
    console.log(`Path: ${p}\nSize: ${stat.size} bytes\nMTime: ${stat.mtime}\nProbe: ${probeInfo}\n`);
}

console.log('--- Checking public/audio/listening samples ---');
checkSample('public/audio/listening/part1/p1_q01.mp3');
checkSample('public/audio/listening/part1/p1_q02.mp3');
checkSample('public/audio/listening/part2/p2_q01.mp3');
checkSample('public/audio/listening/part3/p3_set01.mp3');
checkSample('public/audio/listening/part4/p4_set01.mp3');
