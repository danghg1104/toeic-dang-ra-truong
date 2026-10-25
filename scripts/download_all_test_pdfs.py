import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import os
import json
import subprocess

out_dir = os.path.join('data', 'ets2026_raw')
os.makedirs(out_dir, exist_ok=True)

manifest = json.load(open('gdrive_manifest.json', encoding='utf-8'))

pdfs_to_download = []
for fid, rpath, _ in manifest:
    if not rpath.endswith('.pdf'):
        continue
    base = os.path.basename(rpath)
    if 'LISTENING TEST' in base.upper() or 'READING TEST' in base.upper():
        dest = os.path.join(out_dir, base)
        pdfs_to_download.append((base, fid, dest))

print(f"Total PDFs in manifest: {len(pdfs_to_download)}")

for idx, (base, fid, dest) in enumerate(pdfs_to_download):
    if os.path.exists(dest) and os.path.getsize(dest) > 100000:
        print(f"[{idx+1}/{len(pdfs_to_download)}] ⏩ Already exists: {base} ({os.path.getsize(dest)} bytes)")
        continue
    print(f"[{idx+1}/{len(pdfs_to_download)}] ⬇️ Downloading {base} (ID: {fid})...")
    url = f"https://drive.google.com/uc?export=download&id={fid}"
    cmd = ['curl.exe', '-L', '-s', '-o', dest, url]
    subprocess.run(cmd, check=True)
    size = os.path.getsize(dest) if os.path.exists(dest) else 0
    print(f"  ✓ Saved {base} ({size} bytes)")

print("\n✅ All Key & Script PDFs downloaded successfully!")
