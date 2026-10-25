import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 LISTENING TEST 1 (SCRIPT AND KEY).pdf')
doc = fitz.open(pdf_path)

print("--- PAGE 2 BOTTOM ---")
lines = doc[1].get_text().split('\n')
for line in lines[-25:]:
    print(repr(line))
