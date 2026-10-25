import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re

lc_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 LISTENING TEST 2 (SCRIPT AND KEY).pdf')
rc_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 READING TEST 2- KEY.pdf')

doc_lc = fitz.open(lc_path)
doc_rc = fitz.open(rc_path)

lc_pages = [p.get_text() for p in doc_lc]
rc_pages = [p.get_text() for p in doc_rc]

print(f"Test 2 LC pages: {len(lc_pages)}, RC pages: {len(rc_pages)}")

# 1. Part 1
p1_text = lc_pages[0] + "\n" + lc_pages[1]
p1_found = 0
for qnum in range(1, 7):
    pattern = rf'\b{qnum}\s*\n\s*(\(A\).*?\(D\).*?)\n\s*([A-D])\s*\n\s*(\(A\).*?\(D\).*?)(?=\n\s*(?:{qnum+1}|PART|\Z))'
    m = re.search(pattern, p1_text, re.DOTALL)
    if m:
        p1_found += 1
print(f"Part 1: {p1_found}/6")

# 2. Part 2
p2_text = ""
for pno in range(1, 7):
    txt = re.sub(r'^\s*ETS 2026 LISTENING TEST\s*$', '', lc_pages[pno], flags=re.MULTILINE)
    p2_text += txt + "\n"

p2_found = 0
for qnum in range(7, 32):
    next_num = qnum + 1 if qnum < 31 else r'(?:PART|STT|\Z)'
    pattern = rf'(?:^|\n)\s*{qnum}\s*\n(.*?)\n\s*(\(A\).*?\(C\).*?)\n\s*([A-C])\s*\n(.*?)\n\s*(\(A\).*?\(C\).*?)(?=\n\s*{next_num}\s*\n|\Z)'
    m = re.search(pattern, p2_text, re.DOTALL)
    if m:
        p2_found += 1
print(f"Part 2: {p2_found}/25")

# 3. Part 3
p3_text = ""
for pno in range(6, 22):
    txt = re.sub(r'^\s*ETS 2026 LISTENING TEST\s*$', '', lc_pages[pno], flags=re.MULTILINE)
    p3_text += txt + "\n"
if 'PART 4' in p3_text:
    p3_text = p3_text[:p3_text.index('PART 4')]

p3_ranges = [
    (32, 34), (35, 37), (38, 40), (41, 43), (44, 46),
    (47, 49), (50, 52), (53, 55), (56, 58), (59, 61),
    (62, 64), (65, 67), (68, 70)
]
p3_found = 0
for q_start, q_end in p3_ranges:
    next_h = f"{q_end + 1}-\s*{q_end + 3}" if q_end < 70 else r'\Z'
    pattern = rf'(?:^|\n)\s*{q_start}-\s*\n?\s*{q_end}\s*\n(.*?)(?=(?:^|\n)\s*{next_h}|\Z)'
    m = re.search(pattern, p3_text, re.DOTALL)
    if m:
        p3_found += 1
print(f"Part 3: {p3_found}/13 sets")

# 4. Part 4
p4_text = ""
for pno in range(20, len(lc_pages)):
    txt = re.sub(r'^\s*ETS 2026 LISTENING TEST\s*$', '', lc_pages[pno], flags=re.MULTILINE)
    p4_text += txt + "\n"
if 'PART 4' in p4_text:
    p4_text = p4_text[p4_text.index('PART 4'):]
p4_text = re.sub(r'98-10\s*\n\s*0', '98-100', p4_text)

p4_ranges = [
    (71, 73), (74, 76), (77, 79), (80, 82), (83, 85),
    (86, 88), (89, 91), (92, 94), (95, 97), (98, 100)
]
p4_found = 0
for q_start, q_end in p4_ranges:
    next_h = f"{q_end + 1}-\s*{q_end + 3}" if q_end < 100 else r'\Z'
    pattern = rf'(?:^|\n)\s*{q_start}-\s*\n?\s*{q_end}\s*\n(.*?)(?=(?:^|\n)\s*{next_h}|\Z)'
    m = re.search(pattern, p4_text, re.DOTALL)
    if m:
        p4_found += 1
print(f"Part 4: {p4_found}/10 sets")

# 5. Part 5
p5_text = ""
for pno in range(0, min(18, len(rc_pages))):
    p5_text += rc_pages[pno] + "\n"
if 'Question 131' in p5_text:
    p5_text = p5_text[:p5_text.index('Question 131')]

p5_found = 0
for qnum in range(101, 131):
    next_num = qnum + 1 if qnum < 130 else r'(?:Question|PART|\Z)'
    pattern = rf'(?:^|\n)\s*{qnum}\s*\n(.*?)\n\s*(\(A\).*?\(D\).*?)\n(.*?)(?=(?:^|\n)\s*{next_num}\s*\n|\Z)'
    m = re.search(pattern, p5_text, re.DOTALL)
    if m:
        p5_found += 1
print(f"Part 5: {p5_found}/30")
