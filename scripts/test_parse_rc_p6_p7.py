import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re
import json

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 READING TEST 1- KEY.pdf')
doc = fitz.open(pdf_path)

# Extract full text from page 18 to end
rc_text = ""
for pno in range(17, len(doc)):
    rc_text += doc[pno].get_text() + "\n"

print("RC P6+P7 text length:", len(rc_text))

# Let's check all questions from 131 to 200
found_questions = {}
for qnum in range(131, 201):
    m = re.search(rf'(?:^|\n)\s*{qnum}\.?\s*\n', rc_text)
    if m:
        found_questions[qnum] = True

print(f"Questions found between 131 and 200: {len(found_questions)}/70")
missing = [q for q in range(131, 201) if q not in found_questions]
if missing:
    print("Missing questions:", missing[:10])
