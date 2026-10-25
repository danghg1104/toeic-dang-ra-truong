import json
import os

raw = json.load(open('gdrive_manifest.json', 'r', encoding='utf-8'))
items = [{'id': e[0], 'path': e[1]} for e in raw if isinstance(e, list)]

test1_audio = [item for item in items if 'AUDIO' in item['path'] and 'TEST 1\\' in item['path'].upper() and item['path'].endswith('.mp3')]

out_dir = os.path.join('public', 'audio', 'ets2026', 'test1')
missing = []
for item in test1_audio:
    fname = os.path.basename(item['path'])
    dest = os.path.join(out_dir, fname)
    if not os.path.exists(dest) or os.path.getsize(dest) < 1000:
        missing.append({'filename': fname, 'id': item['id']})

print(f"Missing {len(missing)} audio files:")
for m in missing:
    print(f"  {m['filename']}: https://drive.google.com/uc?id={m['id']}")
