const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'gdrive_manifest.json');
const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Find audio files for tests 2 to 10
const audioItems = [];
for (const item of raw) {
    if (!Array.isArray(item)) continue;
    const [fid, rpath] = item;
    if (!rpath.endsWith('.mp3')) continue;
    
    // Check if it belongs to Test 2 .. 10
    const m = rpath.match(/AUDIO[\\\/]Test (\d+)[\\\/](.*\.mp3)/i);
    if (m) {
        const testNum = parseInt(m[1], 10);
        if (testNum >= 2 && testNum <= 10) {
            const fname = m[2];
            const outDir = path.join(__dirname, '..', 'public', 'audio', 'ets2026', `test${testNum}`);
            const dest = path.join(outDir, fname);
            audioItems.push({ fid, rpath, testNum, fname, outDir, dest });
        }
    }
}

console.log(`Found ${audioItems.length} audio files across Tests 2 to 10.`);

// Filter out already downloaded
const toDownload = audioItems.filter(item => {
    if (fs.existsSync(item.dest)) {
        const sz = fs.statSync(item.dest).size;
        if (sz > 5000) return false;
    }
    return true;
});

console.log(`Need to download: ${toDownload.length} files (${audioItems.length - toDownload.length} already exist).`);

async function downloadFile(item) {
    if (!fs.existsSync(item.outDir)) {
        fs.mkdirSync(item.outDir, { recursive: true });
    }
    const url = `https://drive.google.com/uc?export=download&id=${item.fid}`;
    return new Promise((resolve) => {
        const child = spawn('curl.exe', ['-L', '-s', '-o', item.dest, url]);
        child.on('close', (code) => {
            if (code === 0 && fs.existsSync(item.dest) && fs.statSync(item.dest).size > 5000) {
                resolve({ success: true, item });
            } else {
                resolve({ success: false, item });
            }
        });
    });
}

async function runQueue(concurrency = 8) {
    let index = 0;
    let completed = 0;
    let failed = 0;
    const total = toDownload.length;
    
    console.log(`Starting parallel download with concurrency = ${concurrency}...`);
    
    async function worker() {
        while (index < total) {
            const current = toDownload[index++];
            const res = await downloadFile(current);
            if (res.success) {
                completed++;
            } else {
                failed++;
            }
            if ((completed + failed) % 25 === 0 || (completed + failed) === total) {
                console.log(`[${completed + failed}/${total}] Completed: ${completed}, Failed: ${failed}`);
            }
        }
    }

    const workers = [];
    for (let i = 0; i < concurrency; i++) {
        workers.push(worker());
    }
    await Promise.all(workers);
    console.log(`\n🎉 Audio download completed: ${completed} succeeded, ${failed} failed.`);
}

runQueue(8).catch(console.error);
