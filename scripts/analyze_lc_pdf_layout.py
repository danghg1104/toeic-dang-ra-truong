import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 LISTENING TEST 1 (SCRIPT AND KEY).pdf')
doc = fitz.open(pdf_path)

print(f"Scanning {len(doc)} pages of LC Test 1...")

part_pages = {}
for i, page in enumerate(doc):
    txt = page.get_text()
    for part in ['PART 1', 'PART 2', 'PART 3', 'PART 4']:
        if re.search(r'\b' + part + r'\b', txt, re.IGNORECASE):
            if part not in part_pages:
                part_pages[part] = i + 1

print("Part starting pages:", part_pages)

# Sample Part 3 page
p3_start = part_pages.get('PART 3', 8) - 1
print(f"\n--- PART 3 SAMPLE (Page {p3_start + 1}) ---")
print(doc[p3_start].get_text()[:1200])

# Sample Part 4 page
p4_start = part_pages.get('PART 4', 20) - 1
print(f"\n--- PART 4 SAMPLE (Page {p4_start + 1}) ---")
print(doc[p4_start].get_text()[:1200])
