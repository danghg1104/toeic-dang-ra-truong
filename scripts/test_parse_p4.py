import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 LISTENING TEST 1 (SCRIPT AND KEY).pdf')
doc = fitz.open(pdf_path)

# Part 4 is on pages 22 to 31 (doc[21] to doc[30])
p4_text = ""
for pno in range(21, len(doc)):
    txt = doc[pno].get_text()
    txt = re.sub(r'^\s*ETS 2026 LISTENING TEST\s*$', '', txt, flags=re.MULTILINE)
    p4_text += txt + "\n"

# Cut before PART 4 header itself if duplicated
if 'PART 4' in p4_text:
    p4_text = p4_text[p4_text.index('PART 4'):]

print("P4 text length:", len(p4_text))

# Define the 10 sets
p4_ranges = [
    (71, 73), (74, 76), (77, 79), (80, 82), (83, 85),
    (86, 88), (89, 91), (92, 94), (95, 97), (98, 100)
]

parsed_p4 = []

for q_start, q_end in p4_ranges:
    next_header = f"{q_end + 1}-\s*{q_end + 3}" if q_end < 100 else r'\Z'
    pattern = rf'(?:^|\n)\s*{q_start}-\s*\n?\s*{q_end}\s*\n(.*?)(?=(?:^|\n)\s*{next_header}|\Z)'
    match = re.search(pattern, p4_text, re.DOTALL)
    if match:
        block = match.group(1).strip()
        
        q_pos = re.search(rf'(?:^|\n)\s*{q_start}\.\s*', block)
        if q_pos:
            talk_section = block[:q_pos.start()].strip()
            rest = block[q_pos.start():].strip()
            
            ans_map = {}
            for qn in range(q_start, q_end + 1):
                ans_m = re.search(rf'{qn}\.\s*\n?\s*([A-D])\b', rest)
                if ans_m:
                    ans_map[qn] = ans_m.group(1).strip()
            
            # Find Vietnamese translation of talk (usually begins with a Vietnamese word or second paragraph)
            talk_en = talk_section
            talk_vi = ""
            # Often Vietnamese translation starts after a blank line or paragraph
            paras = [p.strip() for p in talk_section.split('\n\n') if p.strip()]
            if len(paras) >= 2:
                # check if second half is Vietnamese
                talk_en = paras[0]
                talk_vi = "\n".join(paras[1:])
            
            q_list = []
            for qn in range(q_start, q_end + 1):
                next_q = qn + 1 if qn < q_end else rf'(?:{q_start}\.|\Z)'
                qm = re.search(rf'(?:^|\n)\s*{qn}\.\s*(.*?)(?=\n\s*(?:{next_q}|\d+\.|\Z))', rest, re.DOTALL)
                if qm:
                    raw_q = qm.group(1).strip()
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
                "setId": f"ets26_t1_p4_s{str((q_start-71)//3 + 1).zfill(2)}",
                "part": 4,
                "test": 1,
                "qRange": f"{q_start}-{q_end}",
                "audio_url": f"/audio/ets2026/test1/E26-T01-{q_start}-{q_end}.mp3",
                "talk": talk_en.replace('\n', ' '),
                "talk_vi": talk_vi.replace('\n', ' '),
                "questions": q_list
            }
            parsed_p4.append(set_item)
            print(f"✅ Parsed Part 4 Set {q_start}-{q_end}: {len(q_list)} questions | Ans: {[q['ansLetter'] for q in q_list]}")
        else:
            print(f"❌ Could not find question start for Part 4 Set {q_start}-{q_end}")
    else:
        print(f"❌ Could not match block for Part 4 Set {q_start}-{q_end}")

print(f"\nTotal Part 4 sets parsed: {len(parsed_p4)}/10")
