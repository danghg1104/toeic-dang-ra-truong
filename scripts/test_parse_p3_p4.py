import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re
import json

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 LISTENING TEST 1 (SCRIPT AND KEY).pdf')
doc = fitz.open(pdf_path)

# Part 3 is on pages 7 through 22 (doc[6] to doc[21])
p3_text = ""
for pno in range(6, 22):
    txt = doc[pno].get_text()
    txt = re.sub(r'^\s*ETS 2026 LISTENING TEST\s*$', '', txt, flags=re.MULTILINE)
    p3_text += txt + "\n"

# Cut at PART 4
if 'PART 4' in p3_text:
    p3_text = p3_text[:p3_text.index('PART 4')]

print("P3 text length:", len(p3_text))

# Define the 13 sets
set_ranges = [
    (32, 34), (35, 37), (38, 40), (41, 43), (44, 46),
    (47, 49), (50, 52), (53, 55), (56, 58), (59, 61),
    (62, 64), (65, 67), (68, 70)
]

parsed_sets = []

for q_start, q_end in set_ranges:
    # Match the set block
    # Looks for: {q_start}-\s*{q_end}
    next_header = f"{q_end + 1}-\s*{q_end + 3}" if q_end < 70 else r'\Z'
    pattern = rf'(?:^|\n)\s*{q_start}-\s*\n?\s*{q_end}\s*\n(.*?)(?=(?:^|\n)\s*{next_header}|\Z)'
    match = re.search(pattern, p3_text, re.DOTALL)
    if match:
        block = match.group(1).strip()
        
        # In block, there is:
        # 1. Dialogue text (English and Vietnamese)
        # 2. Questions block: {q_start}. ... {q_start+1}. ... {q_end}. ...
        # 3. Answers: {q_start}.\s*([A-D]) ...
        # 4. Questions translation
        
        # Let's find where questions start: rf'{q_start}\.\s*'
        q_pos = re.search(rf'(?:^|\n)\s*{q_start}\.\s*', block)
        if q_pos:
            dialogue_section = block[:q_pos.start()].strip()
            rest = block[q_pos.start():].strip()
            
            # Find answers: e.g. "32.\nB\n33.\nD\n34.\nB" or "32.\n B"
            ans_map = {}
            for qn in range(q_start, q_end + 1):
                ans_m = re.search(rf'{qn}\.\s*\n?\s*([A-D])\b', rest)
                if ans_m:
                    ans_map[qn] = ans_m.group(1).strip()
            
            # Separate English dialogue and Vietnamese translation
            # Look for "Nữ:" or "Nam:"
            vi_split = re.search(r'(?:^|\n)\s*(?:Nữ:|Nam:)', dialogue_section)
            if vi_split:
                dialogue_en = dialogue_section[:vi_split.start()].strip()
                dialogue_vi = dialogue_section[vi_split.start():].strip()
            else:
                dialogue_en = dialogue_section
                dialogue_vi = ""
            
            # Extract the 3 questions
            q_list = []
            for qn in range(q_start, q_end + 1):
                next_q = qn + 1 if qn < q_end else rf'(?:{q_start}\.|\Z)'
                qm = re.search(rf'(?:^|\n)\s*{qn}\.\s*(.*?)(?=\n\s*(?:{next_q}|\d+\.|\Z))', rest, re.DOTALL)
                if qm:
                    raw_q = qm.group(1).strip()
                    # extract question text and options (A)-(D)
                    opt_pos = raw_q.find('(A)')
                    if opt_pos != -1:
                        q_text = raw_q[:opt_pos].strip().replace('\n', ' ')
                        opts_raw = raw_q[opt_pos:].strip()
                        opts = re.findall(r'\(([A-D])\)\s*(.*?)(?=\([A-D]\)|\Z)', opts_raw, re.DOTALL)
                        options = [f"{l}. {t.strip().replace(chr(10), ' ')}" for l, t in opts]
                    else:
                        q_text = raw_q.replace('\n', ' ')
                        options = []
                    
                    ans_let = ans_map.get(qn, 'A')
                    ans_idx = ord(ans_let) - 65
                    q_list.append({
                        "qNum": qn,
                        "q": q_text,
                        "options": options,
                        "ans": ans_idx,
                        "ansLetter": ans_let
                    })
            
            set_item = {
                "setId": f"ets26_t1_p3_s{str((q_start-32)//3 + 1).zfill(2)}",
                "part": 3,
                "test": 1,
                "qRange": f"{q_start}-{q_end}",
                "audio_url": f"/audio/ets2026/test1/E26-T01-{q_start}-{q_end}.mp3",
                "dialogue": dialogue_en.replace('\n\n', '\n'),
                "dialogue_vi": dialogue_vi.replace('\n\n', '\n'),
                "questions": q_list
            }
            parsed_sets.append(set_item)
            print(f"✅ Parsed Part 3 Set {q_start}-{q_end}: {len(q_list)} questions | Ans: {[q['ansLetter'] for q in q_list]}")
        else:
            print(f"❌ Could not find question start for Set {q_start}-{q_end}")
    else:
        print(f"❌ Could not match block for Set {q_start}-{q_end}")

print(f"\nTotal Part 3 sets parsed: {len(parsed_sets)}/13")
