import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import os
import json
import gdown

raw = json.load(open('gdrive_manifest.json', 'r', encoding='utf-8'))
items = [{'id': e[0], 'path': e[1]} for e in raw if isinstance(e, list)]

# Find Test 1 key & script pdfs
test1_pdfs = [item for item in items if 'TEST 1' in item['path'].upper() and item['path'].endswith('.pdf')]
print("Found Test 1 PDFs:")
for p in test1_pdfs:
    print(f"  {p['path']} -> ID: {p['id']}")

out_dir = os.path.join('data', 'ets2026_raw')
os.makedirs(out_dir, exist_ok=True)

for p in test1_pdfs:
    fname = os.path.basename(p['path'])
    dest = os.path.join(out_dir, fname)
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"⏩ Already exists: {dest} ({os.path.getsize(dest)} bytes)")
        continue
    print(f"⬇️ Downloading: {fname} (ID: {p['id']}) ...")
    gdown.download(id=p['id'], output=dest, quiet=False)
    print(f"  ✓ Saved {dest} ({os.path.getsize(dest)} bytes)")

print("\n✅ Download finished!")
