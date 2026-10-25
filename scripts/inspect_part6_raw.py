import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 READING TEST 1- KEY.pdf')
doc = fitz.open(pdf_path)

# Part 6 is around pages 18 to 26
p6_text = ""
for pno in range(17, 26):
    p6_text += f"\n=== PAGE {pno+1} ===\n" + doc[pno].get_text()

print(p6_text[:2500])
