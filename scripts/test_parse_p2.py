import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re
import json

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 LISTENING TEST 1 (SCRIPT AND KEY).pdf')
doc = fitz.open(pdf_path)

# Part 2 is on pages 2 through 7 (doc[1] to doc[6])
p2_text = ""
for pno in range(1, 7):
    # Remove header / footer lines
    txt = doc[pno].get_text()
    txt = re.sub(r'^\s*ETS 2026 LISTENING TEST\s*$', '', txt, flags=re.MULTILINE)
    p2_text += txt + "\n"

# Match each question from 7 to 31
part2_items = []
for qnum in range(7, 32):
    # Pattern:
    # {qnum} \s*\n
    # {q_en} \s*\n
    # (A) {optA} \s*\n (B) {optB} \s*\n (C) {optC} \s*\n
    # {ans} \s*\n
    # {q_vi} \s*\n
    # (A) {optA_vi} \s*\n (B) {optB_vi} \s*\n (C) {optC_vi}
    next_num = qnum + 1 if qnum < 31 else '(?:PART|STT|\Z)'
    pattern = rf'(?:^|\n)\s*{qnum}\s*\n(.*?)\n\s*(\(A\).*?\(C\).*?)\n\s*([A-C])\s*\n(.*?)\n\s*(\(A\).*?\(C\).*?)(?=\n\s*{next_num}\s*\n|\Z)'
    match = re.search(pattern, p2_text, re.DOTALL)
    if match:
        q_en = match.group(1).strip().replace('\n', ' ')
        opts_en_raw = match.group(2).strip()
        ans = match.group(3).strip()
        q_vi = match.group(4).strip().replace('\n', ' ')
        opts_vi_raw = match.group(5).strip()
        
        opts_en = re.findall(r'\(([A-C])\)\s*(.*?)(?=\([A-C]\)|\Z)', opts_en_raw, re.DOTALL)
        opts_vi = re.findall(r'\(([A-C])\)\s*(.*?)(?=\([A-C]\)|\Z)', opts_vi_raw, re.DOTALL)
        
        options = [f"{letter}. {text.strip().replace(chr(10), ' ')}" for letter, text in opts_en]
        options_vi = [f"({letter}) {text.strip().replace(chr(10), ' ')}" for letter, text in opts_vi]
        
        ans_idx = ord(ans) - 65
        
        item = {
            "id": f"ets26_t1_p2_q{str(qnum).zfill(2)}",
            "qNum": qnum,
            "part": 2,
            "test": 1,
            "audio_url": f"/audio/ets2026/test1/E26-T01-{str(qnum).zfill(2)}.mp3",
            "q": q_en,
            "q_vi": q_vi,
            "options": options,
            "options_vi": options_vi,
            "ans": ans_idx,
            "ansLetter": ans,
            "transcript": f"{q_en} " + " ".join(options),
            "transcript_vi": f"{q_vi} " + " ".join(options_vi)
        }
        part2_items.append(item)
        print(f"✅ Parsed Part 2 Q{qnum}: Ans {ans} | {q_en[:35]}...")
    else:
        print(f"❌ Failed to regex match Part 2 Q{qnum}")

print(f"\nTotal Part 2 items parsed: {len(part2_items)}/25")
