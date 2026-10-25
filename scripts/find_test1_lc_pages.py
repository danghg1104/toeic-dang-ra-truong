import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026- LC.pdf')
doc = fitz.open(pdf_path)
print(f"Total pages in ETS 2026- LC.pdf: {len(doc)}")

for page_num in range(min(20, len(doc))):
    txt = doc[page_num].get_text()
    if 'TEST 1' in txt.upper() or 'PART 1' in txt.upper():
        print(f"\n--- Page {page_num + 1} ---")
        lines = [line.strip() for line in txt.split('\n') if line.strip()]
        print(' | '.join(lines[:8]))
