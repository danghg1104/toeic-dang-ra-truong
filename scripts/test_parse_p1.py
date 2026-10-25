import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re
import json

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026 LISTENING TEST 1 (SCRIPT AND KEY).pdf')
doc = fitz.open(pdf_path)

# Extract full text page by page
pages_text = [page.get_text() for page in doc]
full_text = "\n---PAGE---\n".join(pages_text)

print("Full text length:", len(full_text))

# Let's inspect Part 1 questions 1 to 6
part1_items = []

# Pattern for Part 1 items
# STT \n Transcript \n Đáp án \n Dịch nghĩa
# In page 1 and 2:
p1_text = pages_text[0] + "\n" + pages_text[1]

# Match questions 1 to 6
for qnum in range(1, 7):
    # Search for number followed by (A) ... (D)
    pattern = rf'\b{qnum}\s*\n\s*(\(A\).*?\(D\).*?)\n\s*([A-D])\s*\n\s*(\(A\).*?\(D\).*?)(?=\n\s*(?:{qnum+1}|PART|\Z))'
    match = re.search(pattern, p1_text, re.DOTALL)
    if match:
        transcript = match.group(1).strip()
        ans = match.group(2).strip()
        trans_vi = match.group(3).strip()
        
        # Parse options
        opts_en = re.findall(r'\(([A-D])\)\s*(.*?)(?=\([A-D]\)|\Z)', transcript, re.DOTALL)
        opts_vi = re.findall(r'\(([A-D])\)\s*(.*?)(?=\([A-D]\)|\Z)', trans_vi, re.DOTALL)
        
        options = [f"{letter}. {text.strip().replace(chr(10), ' ')}" for letter, text in opts_en]
        options_vi = [f"({letter}) {text.strip().replace(chr(10), ' ')}" for letter, text in opts_vi]
        
        ans_idx = ord(ans) - 65
        
        item = {
            "id": f"ets26_t1_p1_q{str(qnum).zfill(2)}",
            "qNum": qnum,
            "part": 1,
            "test": 1,
            "image": f"assets/listening/ets2026_test1/p1_q0{qnum}.jpg",
            "audio_url": f"/audio/ets2026/test1/E26-T01-0{qnum}.mp3",
            "q": "Look at the picture and choose the statement that best describes what you see:",
            "options": options,
            "ans": ans_idx,
            "ansLetter": ans,
            "transcript": transcript.replace('\n', ' '),
            "transcript_vi": trans_vi.replace('\n', ' '),
            "options_vi": options_vi
        }
        part1_items.append(item)
        print(f"✅ Parsed Part 1 Q{qnum}: Ans {ans} | Opts: {len(options)}")
    else:
        print(f"❌ Failed to regex match Part 1 Q{qnum}")

print(f"\nTotal Part 1 items parsed: {len(part1_items)}/6")
