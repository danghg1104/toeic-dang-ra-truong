import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import os
import json
import gdown

url = 'https://drive.google.com/drive/folders/1pRLwACjO3OuvOS18DG44WnLl-zZa5mJ_'

print(f"Scanning Google Drive folder: {url} ...")
try:
    items = gdown.download_folder(url, skip_download=True)
    out_file = 'gdrive_manifest.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"✅ Successfully wrote {len(items)} items to {out_file}")
except Exception as e:
    print(f"❌ Error: {e}")
