import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 READING TEST 1- KEY.pdf')
doc = fitz.open(pdf_path)

# Let's inspect page 27, 28, 29 (Part 7 start)
print("=== PAGE 27 ===")
print(doc[26].get_text()[:1200])

print("\n=== PAGE 28 ===")
print(doc[27].get_text()[:1200])
