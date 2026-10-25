const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const missing = [
  { fname: 'E26-T01-50-52.mp3', id: '1cR1V4K5ZDxRJqu2tvRxyN93FjgDkQCCe' },
  { fname: 'E26-T01-53-55.mp3', id: '156j97PnDDvZV9VLVolpijJ6xDObHlcqd' },
  { fname: 'E26-T01-56-58.mp3', id: '1Mewi35vTmkRqevBRrHUXgc6-0f6G3ixi' },
  { fname: 'E26-T01-59-61.mp3', id: '1rYa14AcpfLO78Gv0VXckCfdGplRLAfoG' },
  { fname: 'E26-T01-62-64.mp3', id: '1UH87Scqg4yFOrW9-ebFVwiC6FgTFa9AJ' },
  { fname: 'E26-T01-65-67.mp3', id: '1i45otHb153juxFB-L95cwl_kAiswUwmd' },
  { fname: 'E26-T01-68-70.mp3', id: '1WadCEJ0Jxy83bwPZBwb0UsAyuGQnDy0C' },
  { fname: 'E26-T01-71-73.mp3', id: '1F2oj_oT3tWWCj6YdWVJ-Emzi71gHggp0' },
  { fname: 'E26-T01-74-76.mp3', id: '1yrIyUrU_4BmCv7Tt9al83VenNDLhHO3J' },
  { fname: 'E26-T01-77-79.mp3', id: '1TBZ-b8fT9sXH55Z5Te1GufY7mqS3r91k' },
  { fname: 'E26-T01-80-82.mp3', id: '1mPic3ryCHAeclV2SI41dme5EVkl7D10x' },
  { fname: 'E26-T01-83-85.mp3', id: '1NZrbKh5BPyr0Wo5Qdt9dp2-MktHkGNmT' },
  { fname: 'E26-T01-86-88.mp3', id: '1X48x7J2-motxpyy2Z_AsmvV-BxP9ZiTf' },
  { fname: 'E26-T01-89-91.mp3', id: '1rS3yH6WUBAP1NU5aWEpEkZTJwLhL4nSQ' },
  { fname: 'E26-T01-92-94.mp3', id: '1P30OkeidO0IcSs4X91TbPxoqgXZWUqkA' },
  { fname: 'E26-T01-95-97.mp3', id: '1yBMp_bneMrAT0eI6NSbjZ0VlDzyBj64M' },
  { fname: 'E26-T01-98-100.mp3', id: '1fdJAi-Lv-rC8TTosUjNu85sxKWXXPGCz' }
];

const outDir = path.join(__dirname, '..', 'public', 'audio', 'ets2026', 'test1');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// clean up test_50.mp3 if exists
if (fs.existsSync('test_50.mp3')) fs.unlinkSync('test_50.mp3');

for (let i = 0; i < missing.length; i++) {
    const { fname, id } = missing[i];
    const dest = path.join(outDir, fname);
    console.log(`[${i+1}/${missing.length}] ⬇️ Downloading ${fname}...`);
    const cmd = `curl.exe -L -s -o "${dest}" "https://drive.google.com/uc?export=download&id=${id}"`;
    execSync(cmd);
    const sz = fs.statSync(dest).size;
    console.log(`  ✓ Saved ${fname} (${sz} bytes)`);
}

console.log('✅ ALL 17 REMAINING AUDIO FILES DOWNLOADED SUCCESSFULLY!');
