import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 LISTENING TEST 1 (SCRIPT AND KEY).pdf')
doc = fitz.open(pdf_path)

# Let's inspect pages 2, 3, 4, 5, 6
p2_text = ""
for pno in range(1, 7):
    p2_text += doc[pno].get_text() + "\n"

print("P2 text length:", len(p2_text))

# Let's see questions 7, 8, 9, 10
for qnum in [7, 8, 9, 10, 31]:
    pos = p2_text.find(f"\n{qnum}\n")
    if pos == -1:
        pos = p2_text.find(f"{qnum}\n")
    if pos != -1:
        print(f"\n--- Q{qnum} sample ---")
        print(p2_text[pos:pos+400])
    else:
        print(f"Could not find \\n{qnum}\\n in text")
