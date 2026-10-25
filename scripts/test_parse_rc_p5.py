import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re
import json

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 READING TEST 1- KEY.pdf')
doc = fitz.open(pdf_path)

# Part 5 is on pages 1 to 20
p5_text = ""
for pno in range(0, 18):
    txt = doc[pno].get_text()
    p5_text += txt + "\n"

# Cut before Part 6 (Question 131-134)
if 'Question 131' in p5_text:
    p5_text = p5_text[:p5_text.index('Question 131')]

print("P5 text length:", len(p5_text))

part5_items = []
for qnum in range(101, 131):
    next_num = qnum + 1 if qnum < 130 else r'(?:Question|PART|\Z)'
    pattern = rf'(?:^|\n)\s*{qnum}\s*\n(.*?)\n\s*(\(A\).*?\(D\).*?)\n(.*?)(?=(?:^|\n)\s*{next_num}\s*\n|\Z)'
    match = re.search(pattern, p5_text, re.DOTALL)
    if match:
        q_sentence = match.group(1).strip().replace('\n', ' ')
        opts_raw = match.group(2).strip()
        explanation = match.group(3).strip()
        
        # parse options (A) - (D)
        opts = re.findall(r'\(([A-D])\)\s*(.*?)(?=\([A-D]\)|\Z)', opts_raw, re.DOTALL)
        options = [f"{l}. {t.strip().replace(chr(10), ' ')}" for l, t in opts]
        
        # find answer: e.g. "Chọn (B)" or "=> Chọn (B)" or "chọn (A)" or "chọn B"
        ans_m = re.search(r'(?:Chọn|=>\s*Chọn)\s*\(?([A-D])\)?', explanation, re.IGNORECASE)
        ans_let = ans_m.group(1).upper() if ans_m else 'A'
        ans_idx = ord(ans_let) - 65
        
        # find translation: e.g. "Dịch: ..."
        dich_m = re.search(r'Dịch:\s*(.*?)(?=\n\s*(?:Useful|\Z))', explanation, re.DOTALL | re.IGNORECASE)
        dich_vi = dich_m.group(1).strip().replace('\n', ' ') if dich_m else ""
        
        item = {
            "id": f"ets26_t1_p5_q{qnum}",
            "qNum": qnum,
            "part": 5,
            "test": 1,
            "q": q_sentence,
            "options": options,
            "ans": ans_idx,
            "ansLetter": ans_let,
            "explanation": explanation.replace('\n\n', '\n'),
            "translation_vi": dich_vi
        }
        part5_items.append(item)
        print(f"✅ Parsed Part 5 Q{qnum}: Ans {ans_let} | {q_sentence[:40]}...")
    else:
        print(f"❌ Failed to parse Q{qnum}")

print(f"\nTotal Part 5 items parsed: {len(part5_items)}/30")
