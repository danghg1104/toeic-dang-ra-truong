import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 READING TEST 1- KEY.pdf')
doc = fitz.open(pdf_path)

for page_num in [10, 20, 30, 45, 60]:
    if page_num < len(doc):
        page = doc[page_num]
        print(f"\n--- PAGE {page_num + 1} ---")
        print(page.get_text()[:600])
