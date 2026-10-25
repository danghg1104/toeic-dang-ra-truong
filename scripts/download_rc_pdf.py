import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import os
import subprocess

dest = os.path.join('data', 'ets2026_raw', 'ETS 2026- RC.pdf')
if os.path.exists(dest) and os.path.getsize(dest) > 10000000:
    print(f"Already exists: {dest} ({os.path.getsize(dest)} bytes)")
else:
    print("Downloading ETS 2026- RC.pdf using curl.exe...")
    cmd = f'curl.exe -L -o "{dest}" "https://drive.google.com/uc?export=download&id=1o2rHtvjYxHfDxKi0990LVJYbinT8-vy0"'
    subprocess.run(cmd, shell=True, check=True)
    print(f"Finished downloading: {dest} ({os.path.getsize(dest)} bytes)")
