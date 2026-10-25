import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import os
import json
import gdown

raw = json.load(open('gdrive_manifest.json', 'r', encoding='utf-8'))
items = [{'id': e[0], 'path': e[1]} for e in raw if isinstance(e, list)]

test1_audio = [item for item in items if 'AUDIO' in item['path'] and 'TEST 1\\' in item['path'].upper() and item['path'].endswith('.mp3')]
print(f"Found {len(test1_audio)} audio files for Test 1.")

out_dir = os.path.join('public', 'audio', 'ets2026', 'test1')
os.makedirs(out_dir, exist_ok=True)

success = 0
for idx, p in enumerate(test1_audio):
    fname = os.path.basename(p['path'])
    dest = os.path.join(out_dir, fname)
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        success += 1
        continue
    print(f"[{idx+1}/{len(test1_audio)}] ⬇️ Downloading {fname} ...")
    try:
        gdown.download(id=p['id'], output=dest, quiet=True)
        success += 1
    except Exception as e:
        print(f"  ❌ Error downloading {fname}: {e}")

print(f"\n✅ Finished downloading Test 1 Audio: {success}/{len(test1_audio)} files saved to {out_dir}")
