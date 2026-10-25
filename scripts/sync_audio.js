const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'public', 'audio', 'listening');
const destDir = path.join(__dirname, '..', 'audio', 'listening');

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else if (entry.isFile()) {
            fs.copyFileSync(srcPath, destPath);
            // console.log(`Copied ${entry.name}`);
        }
    }
}

// Remove old corrupted files in destDir first
if (fs.existsSync(destDir)) {
    console.log('Purging legacy root audio/listening directory...');
    fs.rmSync(destDir, { recursive: true, force: true });
}

console.log('Synchronizing clean neural audio from public/audio/listening to audio/listening...');
copyDirRecursive(srcDir, destDir);

const count = (dir) => {
    let c = 0;
    fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
        if (e.isDirectory()) c += count(path.join(dir, e.name));
        else if (e.isFile() && e.name.endsWith('.mp3')) c++;
    });
    return c;
};

console.log(`✅ Synchronization complete! Root audio/listening now contains ${count(destDir)} clean neural audio files.`);
