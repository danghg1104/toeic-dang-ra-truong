const { execSync } = require('child_process');
const path = require('path');

const ffprobe = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';
const p = path.join(__dirname, '..', 'public', 'audio', 'listening', 'part1', 'p1_q22.mp3');

try {
    const out = execSync(`"${ffprobe}" -v debug "${p}" 2>&1`).toString();
    console.log(out.slice(0, 2000));
} catch (e) {
    console.log(e.stdout ? e.stdout.toString() : e.message);
}
