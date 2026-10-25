const { execSync } = require('child_process');
const fs = require('fs');

const ffprobe = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';

const files = [
    'audio/listening/part1/p1_q01.mp3',
    'public/audio/listening/part1/p1_q01.mp3'
];

files.forEach(f => {
    if (!fs.existsSync(f)) {
        console.log(`File not found: ${f}`);
        return;
    }
    const stat = fs.statSync(f);
    console.log(`--- ${f} ---`);
    console.log(`Size on disk: ${stat.size} bytes, modified: ${stat.mtime}`);
    try {
        const out = execSync(`"${ffprobe}" -v error -show_entries format=duration,size,bit_rate:stream=codec_name,sample_rate,channels -of json "${f}"`).toString();
        console.log(out);
    } catch(e) {
        console.error('ffprobe error:', e.message);
    }
});
