import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import os
import gdown

file_id = '1OaIGCcR8w3fyJYVdxs4uNSESBHf3B0dS'
dest = os.path.join('data', 'ets2026_raw', 'ETS 2026- LC.pdf')

if os.path.exists(dest) and os.path.getsize(dest) > 10000000:
    print(f"⏩ Already exists: {dest} ({os.path.getsize(dest)} bytes)")
else:
    print(f"⬇️ Downloading ETS 2026- LC.pdf (209.9 MB)...")
    gdown.download(id=file_id, output=dest, quiet=False)
    print(f"✅ Successfully downloaded: {dest} ({os.path.getsize(dest)} bytes)")
