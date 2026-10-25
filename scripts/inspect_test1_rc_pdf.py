import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz # PyMuPDF
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 READING TEST 1- KEY.pdf')
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

for page_num in range(min(5, len(doc))):
    page = doc[page_num]
    text = page.get_text()
    print(f"\n--- PAGE {page_num + 1} ---")
    print(text[:800])
