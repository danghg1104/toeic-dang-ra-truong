import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 READING TEST 1- KEY.pdf')
doc = fitz.open(pdf_path)

print("=== PAGE 16 ===")
print(doc[15].get_text()[:800])

print("=== PAGE 17 ===")
print(doc[16].get_text()[:800])
