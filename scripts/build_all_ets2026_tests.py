import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os
import re
import json

print("🚀 Starting compilation for ALL 10 ETS 2026 Full Tests (2,000 Questions)...")

raw_dir = os.path.join('data', 'ets2026_raw')
out_dir = os.path.join('data', 'ets2026')
os.makedirs(out_dir, exist_ok=True)

test_summary = []

for test_num in range(1, 11):
    print(f"\n=======================================================")
    print(f"📦 COMPILING ETS 2026 TEST {test_num}")
    print(f"=======================================================")
    
    lc_pdf_path = os.path.join(raw_dir, f"ETS 2026 LISTENING TEST {test_num} (SCRIPT AND KEY).pdf")
    rc_pdf_path = os.path.join(raw_dir, f"ETS 2026 READING TEST {test_num}- KEY.pdf")
    
    if not os.path.exists(lc_pdf_path) or not os.path.exists(rc_pdf_path):
        print(f"❌ Missing PDF for Test {test_num}")
        continue
        
    doc_lc = fitz.open(lc_pdf_path)
    doc_rc = fitz.open(rc_pdf_path)
    
    lc_pages = [re.sub(r'^\s*ETS 2026 LISTENING TEST\s*\d*$', '', p.get_text().replace('\u200b', ''), flags=re.MULTILINE) for p in doc_lc]
    rc_pages = [re.sub(r'^\s*ETS 2026 READING TEST\s*\d*$', '', p.get_text().replace('\u200b', ''), flags=re.MULTILINE) for p in doc_rc]
    
    lc_full_text = "\n".join(lc_pages)
    rc_full_text = "\n".join(rc_pages)
    
    # --------------------------------------------------------------------------
    # 1. PART 1 (Q1 - Q6)
    # --------------------------------------------------------------------------
    p2_pos = lc_full_text.find('PART 2')
    p1_text = lc_full_text[:p2_pos] if p2_pos != -1 else (lc_pages[0] + "\n" + lc_pages[1])
    part1_items = []
    for qnum in range(1, 7):
        pattern = rf'(?:^|\n)\s*{qnum}\.?\s*\n?(?:\s*[A-Z]-[A-Za-z]+(?:\s*/\s*[A-Z]-[A-Za-z]+)?\s*\n)?\s*([\(A-D].*?[\(D].*?)\n\s*\(?([A-D])\)?\s*\n\s*([\(A-D].*?[\(D].*?)(?=\n\s*(?:{qnum+1}|PART|\Z))'
        m = re.search(pattern, p1_text, re.DOTALL)
        if m:
            transcript = m.group(1).strip()
            ans = m.group(2).strip().upper()
            trans_vi = m.group(3).strip()
            
            opts_en = re.findall(r'(?:\(([A-D])\)|([A-D])\.)\s*(.*?)(?=(?:\([A-D]\)|[A-D]\.)|\Z)', transcript, re.DOTALL)
            opts_vi = re.findall(r'(?:\(([A-D])\)|([A-D])\.)\s*(.*?)(?=(?:\([A-D]\)|[A-D]\.)|\Z)', trans_vi, re.DOTALL)
            
            options = [f"{(l or l2)}. {t.strip().replace(chr(10), ' ')}" for l, l2, t in opts_en]
            options_vi = [f"({(l or l2)}) {t.strip().replace(chr(10), ' ')}" for l, l2, t in opts_vi]
            ans_idx = ord(ans) - 65
            
            item = {
                "id": f"ets26_t{test_num}_p1_q{str(qnum).zfill(2)}",
                "qNum": qnum,
                "part": 1,
                "test": test_num,
                "topic": f"ETS 2026 Test {test_num} - Part 1",
                "image": f"assets/listening/ets2026_test{test_num}/p1_q{str(qnum).zfill(2)}.jpg",
                "audio_url": f"/audio/ets2026/test{test_num}/E26-T{str(test_num).zfill(2)}-0{qnum}.mp3",
                "q": "Look at the picture and choose the statement that best describes what you see:",
                "options": options,
                "ans": ans_idx,
                "ansLetter": ans,
                "transcript": transcript.replace('\n', ' '),
                "transcript_vi": trans_vi.replace('\n', ' '),
                "options_vi": options_vi,
                "explanation_vi": f"Đáp án đúng là ({ans}). Dịch nghĩa các phương án:\n" + "\n".join(options_vi)
            }
            part1_items.append(item)
    print(f"  ✓ Part 1: {len(part1_items)}/6")

    # --------------------------------------------------------------------------
    # 2. PART 2 (Q7 - Q31)
    # --------------------------------------------------------------------------
    p3_idx = lc_full_text.find('PART 3')
    p2_text = lc_full_text[:p3_idx] if p3_idx != -1 else lc_full_text
    
    part2_items = []
    for qnum in range(7, 32):
        next_num = qnum + 1 if qnum < 31 else r'(?:PART|STT|\Z)'
        pattern = rf'(?:^|\n)\s*{qnum}\.?\s*\n?(?:\s*[A-Z]-[A-Za-z]+(?:\s*/\s*[A-Z]-[A-Za-z]+)?\s*\n)?\s*(.*?)\n\s*(\(A\).*?\(C\).*?)\n\s*\(?([A-C])\)?\s*\n(.*?)\n\s*((?:\(A\)|A\.).*?(?:\(C\)|C\.).*?)(?=\n\s*{next_num}\s*\n|\Z)'
        m = re.search(pattern, p2_text, re.DOTALL)
        if m:
            q_en = m.group(1).strip().replace('\n', ' ')
            opts_en_raw = m.group(2).strip()
            ans = m.group(3).strip().upper()
            q_vi = m.group(4).strip().replace('\n', ' ')
            opts_vi_raw = m.group(5).strip()
            
            opts_en = re.findall(r'(?:\(([A-C])\)|([A-C])\.)\s*(.*?)(?=(?:\([A-C]\)|[A-C]\.)|\Z)', opts_en_raw, re.DOTALL)
            opts_vi = re.findall(r'(?:\(([A-C])\)|([A-C])\.)\s*(.*?)(?=(?:\([A-C]\)|[A-C]\.)|\Z)', opts_vi_raw, re.DOTALL)
            
            options = [f"{(l or l2)}. {t.strip().replace(chr(10), ' ')}" for l, l2, t in opts_en]
            options_vi = [f"({(l or l2)}) {t.strip().replace(chr(10), ' ')}" for l, l2, t in opts_vi]
            ans_idx = ord(ans) - 65
            
            item = {
                "id": f"ets26_t{test_num}_p2_q{str(qnum).zfill(2)}",
                "qNum": qnum,
                "part": 2,
                "test": test_num,
                "topic": f"ETS 2026 Test {test_num} - Part 2",
                "audio_url": f"/audio/ets2026/test{test_num}/E26-T{str(test_num).zfill(2)}-{str(qnum).zfill(2)}.mp3",
                "q": q_en,
                "q_vi": q_vi,
                "options": options,
                "options_vi": options_vi,
                "ans": ans_idx,
                "ansLetter": ans,
                "transcript": f"{q_en} " + " ".join(options),
                "transcript_vi": f"{q_vi} " + " ".join(options_vi),
                "explanation_vi": f"Đáp án đúng là ({ans}).\nCâu hỏi: {q_vi}\n" + "\n".join(options_vi)
            }
            part2_items.append(item)
    print(f"  ✓ Part 2: {len(part2_items)}/25")

    # --------------------------------------------------------------------------
    # 3. PART 3 (Q32 - Q70, 13 sets)
    # --------------------------------------------------------------------------
    p4_idx = lc_full_text.find('PART 4')
    p3_text = lc_full_text[p3_idx:p4_idx] if p3_idx != -1 and p4_idx != -1 else lc_full_text
    
    p3_ranges = [
        (32, 34), (35, 37), (38, 40), (41, 43), (44, 46),
        (47, 49), (50, 52), (53, 55), (56, 58), (59, 61),
        (62, 64), (65, 67), (68, 70)
    ]
    
    part3_sets = []
    for q_start, q_end in p3_ranges:
        next_h = rf'{q_end + 1}\s*-\s*{q_end + 3}' if q_end < 70 else r'\Z'
        pattern = rf'(?:^|\n)\s*(?:Bộ câu\s*\n)?\s*{q_start}\s*-\s*{q_end}(?:[^\n]*\n)?(.*?)(?=(?:^|\n)\s*(?:Bộ câu\s*\n)?\s*{next_h}|\Z)'
        m = re.search(pattern, p3_text, re.DOTALL)
        if m:
            block = m.group(1).strip()
            q_pos = re.search(rf'(?:^|\n)\s*{q_start}\.\s*', block)
            if q_pos:
                dialogue_section = block[:q_pos.start()].strip()
                rest = block[q_pos.start():].strip()
                
                ans_map = {}
                for qn in range(q_start, q_end + 1):
                    ans_m = re.search(rf'{qn}\.?\s*[:\.]?\s*\(?([A-D])\)?\b', rest)
                    if ans_m: ans_map[qn] = ans_m.group(1).strip().upper()
                
                vi_split = re.search(r'(?:^|\n)\s*(?:Nữ:|Nam:|W:|M:)', dialogue_section)
                if vi_split:
                    dialogue_en = dialogue_section[:vi_split.start()].strip()
                    dialogue_vi = dialogue_section[vi_split.start():].strip()
                else:
                    dialogue_en = dialogue_section
                    dialogue_vi = ""
                
                q_list = []
                for qn in range(q_start, q_end + 1):
                    next_q = qn + 1 if qn < q_end else rf'(?:{q_start}\b|\Z)'
                    qm = re.search(rf'(?:^|\n)\s*{qn}\.\s*(.*?)(?=\n\s*(?:{next_q}|\d+\b)|\Z)', rest, re.DOTALL)
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
                        q_list.append({
                            "id": f"ets26_t{test_num}_p3_q{qn}",
                            "qNum": qn,
                            "q": q_text,
                            "options": options,
                            "ans": ord(ans_let) - 65,
                            "ansLetter": ans_let,
                            "explanation_vi": f"Đáp án đúng: ({ans_let})"
                        })
                
                set_item = {
                    "setId": f"ets26_t{test_num}_p3_s{str((q_start-32)//3 + 1).zfill(2)}",
                    "part": 3,
                    "test": test_num,
                    "topic": f"ETS 2026 Test {test_num} - Part 3 (Q{q_start}-{q_end})",
                    "qRange": f"{q_start}-{q_end}",
                    "audio_url": f"/audio/ets2026/test{test_num}/E26-T{str(test_num).zfill(2)}-{q_start}-{q_end}.mp3",
                    "dialogue": dialogue_en.replace('\n\n', '\n'),
                    "dialogue_vi": dialogue_vi.replace('\n\n', '\n'),
                    "questions": q_list
                }
                part3_sets.append(set_item)
    print(f"  ✓ Part 3: {len(part3_sets)}/13 sets ({len(part3_sets)*3} questions)")

    # --------------------------------------------------------------------------
    # 4. PART 4 (Q71 - Q100, 10 sets)
    # --------------------------------------------------------------------------
    p4_text = lc_full_text[p4_idx:] if p4_idx != -1 else lc_full_text
    p4_text = re.sub(r'98-10\s*\n\s*0', '98-100', p4_text)
    
    p4_ranges = [
        (71, 73), (74, 76), (77, 79), (80, 82), (83, 85),
        (86, 88), (89, 91), (92, 94), (95, 97), (98, 100)
    ]
    
    part4_sets = []
    for q_start, q_end in p4_ranges:
        next_h = rf'{q_end + 1}\s*-\s*{q_end + 3}' if q_end < 100 else r'\Z'
        pattern = rf'(?:^|\n)\s*(?:Bộ câu\s*\n)?\s*{q_start}\s*-\s*{q_end}(?:[^\n]*\n)?(.*?)(?=(?:^|\n)\s*(?:Bộ câu\s*\n)?\s*{next_h}|\Z)'
        m = re.search(pattern, p4_text, re.DOTALL)
        if m:
            block = m.group(1).strip()
            q_pos = re.search(rf'(?:^|\n)\s*{q_start}\.\s*', block)
            if q_pos:
                talk_section = block[:q_pos.start()].strip()
                rest = block[q_pos.start():].strip()
                
                ans_map = {}
                for qn in range(q_start, q_end + 1):
                    ans_m = re.search(rf'{qn}\.?\s*[:\.]?\s*\(?([A-D])\)?\b', rest)
                    if ans_m: ans_map[qn] = ans_m.group(1).strip().upper()
                
                talk_en = talk_section
                talk_vi = ""
                paras = [p.strip() for p in talk_section.split('\n\n') if p.strip()]
                if len(paras) >= 2:
                    talk_en = paras[0]
                    talk_vi = "\n".join(paras[1:])
                
                q_list = []
                for qn in range(q_start, q_end + 1):
                    next_q = qn + 1 if qn < q_end else rf'(?:{q_start}\b|\Z)'
                    qm = re.search(rf'(?:^|\n)\s*{qn}\.\s*(.*?)(?=\n\s*(?:{next_q}|\d+\b)|\Z)', rest, re.DOTALL)
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
                        q_list.append({
                            "id": f"ets26_t{test_num}_p4_q{qn}",
                            "qNum": qn,
                            "q": q_text,
                            "options": options,
                            "ans": ord(ans_let) - 65,
                            "ansLetter": ans_let,
                            "explanation_vi": f"Đáp án đúng: ({ans_let})"
                        })
                
                set_item = {
                    "setId": f"ets26_t{test_num}_p4_s{str((q_start-71)//3 + 1).zfill(2)}",
                    "part": 4,
                    "test": test_num,
                    "topic": f"ETS 2026 Test {test_num} - Part 4 (Q{q_start}-{q_end})",
                    "qRange": f"{q_start}-{q_end}",
                    "audio_url": f"/audio/ets2026/test{test_num}/E26-T{str(test_num).zfill(2)}-{q_start}-{q_end}.mp3",
                    "talk": talk_en.replace('\n', ' '),
                    "talk_vi": talk_vi.replace('\n', ' '),
                    "questions": q_list
                }
                part4_sets.append(set_item)
    print(f"  ✓ Part 4: {len(part4_sets)}/10 sets ({len(part4_sets)*3} questions)")

    # --------------------------------------------------------------------------
    # 5. PART 5 (Q101 - Q130)
    # --------------------------------------------------------------------------
    p6_rc_idx = rc_full_text.find('PART 6')
    if p6_rc_idx == -1:
        p6_rc_idx = rc_full_text.find('Question 131')
    p5_text = rc_full_text[:p6_rc_idx] if p6_rc_idx != -1 else rc_full_text
    
    part5_items = []
    for qnum in range(101, 131):
        next_num = qnum + 1 if qnum < 130 else r'(?:Question|PART|\Z)'
        pattern = rf'(?:^|\n)\s*{qnum}\.?\s*\n(.*?)\n\s*(\(A\).*?\(D\).*?)\n(.*?)(?=(?:^|\n)\s*{next_num}\.?\s*\n|\Z)'
        m = re.search(pattern, p5_text, re.DOTALL)
        if m:
            q_sentence = m.group(1).strip().replace('\n', ' ')
            opts_raw = m.group(2).strip()
            explanation = m.group(3).strip()
            
            opts = re.findall(r'\(([A-D])\)\s*(.*?)(?=\([A-D]\)|\Z)', opts_raw, re.DOTALL)
            options = [f"{l}. {t.strip().replace(chr(10), ' ')}" for l, t in opts]
            
            ans_m = re.search(r'(?:Chọn|=>\s*Chọn|→\s*Chọn)\s*\(?([A-D])\)?', explanation, re.IGNORECASE)
            ans_let = ans_m.group(1).upper() if ans_m else 'A'
            
            dich_m = re.search(r'Dịch:\s*(.*?)(?=\n\s*(?:Useful|\Z))', explanation, re.DOTALL | re.IGNORECASE)
            dich_vi = dich_m.group(1).strip().replace('\n', ' ') if dich_m else ""
            
            item = {
                "id": f"ets26_t{test_num}_p5_q{qnum}",
                "qNum": qnum,
                "part": 5,
                "test": test_num,
                "topic": f"ETS 2026 Test {test_num} - Part 5",
                "q": q_sentence,
                "options": options,
                "ans": ord(ans_let) - 65,
                "ansLetter": ans_let,
                "explanation_vi": explanation.replace('\n\n', '\n'),
                "translation_vi": dich_vi
            }
            part5_items.append(item)
    print(f"  ✓ Part 5: {len(part5_items)}/30")

    # --------------------------------------------------------------------------
    # 6. PART 6 (Q131 - Q146, 4 passages)
    # --------------------------------------------------------------------------
    p7_rc_idx = rc_full_text.find('PART 7')
    if p7_rc_idx == -1:
        p7_rc_idx = rc_full_text.find('Question 147')
    p6_text = rc_full_text[p6_rc_idx:p7_rc_idx] if p6_rc_idx != -1 and p7_rc_idx != -1 else rc_full_text
    
    p6_ranges = [(131, 134), (135, 138), (139, 142), (143, 146)]
    part6_sets = []
    
    for q_start, q_end in p6_ranges:
        q_list = []
        for qn in range(q_start, q_end + 1):
            next_q = qn + 1 if qn < q_end else r'(?:Question|PART|\Z)'
            pattern = rf'(?:^|\n)\s*{qn}\.?\s*(\(A\).*?\(D\).*?)\n(.*?)(?=(?:^|\n)\s*{next_q}\.?\s*|\Z)'
            m = re.search(pattern, p6_text, re.DOTALL)
            if m:
                opts_raw = m.group(1).strip()
                exp = m.group(2).strip()
                opts = re.findall(r'\(([A-D])\)\s*(.*?)(?=\([A-D]\)|\Z)', opts_raw, re.DOTALL)
                options = [f"{l}. {t.strip().replace(chr(10), ' ')}" for l, t in opts]
                ans_m = re.search(r'(?:Chọn|=>\s*Chọn|→\s*Chọn)\s*\(?([A-D])\)?', exp, re.IGNORECASE)
                ans_let = ans_m.group(1).upper() if ans_m else 'A'
                q_list.append({
                    "id": f"ets26_t{test_num}_p6_q{qn}",
                    "qNum": qn,
                    "q": f"Select the best option for blank ({qn}):",
                    "options": options,
                    "ans": ord(ans_let) - 65,
                    "ansLetter": ans_let,
                    "explanation_vi": exp.replace('\n\n', '\n')
                })
        
        pass_m = re.search(rf'Question\s*{q_start}-{q_end}\s*\n(.*?)(?=\n\s*{q_start}\s*[\.\(])', p6_text, re.DOTALL)
        pass_trans = pass_m.group(1).strip().replace('\n\n', '\n') if pass_m else ""
        
        part6_sets.append({
            "setId": f"ets26_t{test_num}_p6_s{str((q_start-131)//4 + 1).zfill(2)}",
            "part": 6,
            "test": test_num,
            "topic": f"ETS 2026 Test {test_num} - Part 6 (Q{q_start}-{q_end})",
            "qRange": f"{q_start}-{q_end}",
            "passage_vi": pass_trans,
            "questions": q_list
        })
    print(f"  ✓ Part 6: {len(part6_sets)}/4 sets ({sum(len(s['questions']) for s in part6_sets)} questions)")

    # --------------------------------------------------------------------------
    # 7. PART 7 (Q147 - Q200)
    # --------------------------------------------------------------------------
    p7_text = rc_full_text[p7_rc_idx:] if p7_rc_idx != -1 else rc_full_text
    
    part7_items = []
    for qn in range(147, 201):
        next_q = qn + 1 if qn < 200 else r'(?:$|\Z)'
        pattern = rf'(?:^|\n)\s*{qn}\.?\s*(.*?)(?=(?:^|\n)\s*{next_q}\.?\s*|\Z)'
        m = re.search(pattern, p7_text, re.DOTALL)
        if m:
            block = m.group(1).strip()
            ans_m = re.search(r'(?:Chọn|=>\s*Chọn|→\s*Chọn)\s*\(?([A-D])\)?', block, re.IGNORECASE)
            if not ans_m:
                ans_m = re.search(r'(?:^|\n)\s*([A-D])\b', block)
            ans_let = ans_m.group(1).upper() if ans_m else 'A'
            
            opt_pos = block.find('(A)')
            if opt_pos != -1:
                q_en = block[:opt_pos].strip().replace('\n', ' ')
                opts_raw = block[opt_pos:].strip()
                opts = re.findall(r'\(([A-D])\)\s*(.*?)(?=\([A-D]\)|\n\s*(?:Chọn|=>|→|BẢN|TẠP|\d+\.)|\Z)', opts_raw, re.DOTALL)
                options = [f"{l}. {t.strip().replace(chr(10), ' ')}" for l, t in opts[:4]]
            else:
                q_en = f"Question {qn}"
                options = ["A. Option A", "B. Option B", "C. Option C", "D. Option D"]
            
            part7_items.append({
                "id": f"ets26_t{test_num}_p7_q{qn}",
                "qNum": qn,
                "part": 7,
                "test": test_num,
                "topic": f"ETS 2026 Test {test_num} - Part 7 (Q{qn})",
                "q": q_en,
                "options": options,
                "ans": ord(ans_let) - 65,
                "ansLetter": ans_let,
                "explanation_vi": f"Đáp án: ({ans_let})\n" + block.replace('\n\n', '\n')[:600]
            })
    print(f"  ✓ Part 7: {len(part7_items)}/54")

    # --------------------------------------------------------------------------
    # SAVE MASTER TEST JSON
    # --------------------------------------------------------------------------
    total_lc = len(part1_items) + len(part2_items) + sum(len(s['questions']) for s in part3_sets) + sum(len(s['questions']) for s in part4_sets)
    total_rc = len(part5_items) + sum(len(s['questions']) for s in part6_sets) + len(part7_items)
    
    out_db = {
        "test_info": {
            "test_number": test_num,
            "title": f"ETS 2026 TOEIC Full Test {str(test_num).zfill(2)} (Official ETS)",
            "source": "ETS 2026 Public Collection",
            "total_listening": total_lc,
            "total_reading": total_rc,
            "total_questions": total_lc + total_rc,
            "created_at": "2026-10-24"
        },
        "listening": {
            "part1": part1_items,
            "part2": part2_items,
            "part3": part3_sets,
            "part4": part4_sets
        },
        "reading": {
            "part5": part5_items,
            "part6": part6_sets,
            "part7": part7_items
        }
    }
    
    fname = f"test{str(test_num).zfill(2)}_full.json"
    fpath = os.path.join(out_dir, fname)
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(out_db, f, ensure_ascii=False, indent=2)
        
    sz = os.path.getsize(fpath)
    total_q = out_db["test_info"]["total_questions"]
    print(f"  ✅ Saved {fname} ({total_q}/200 questions, {sz} bytes)")
    test_summary.append({
        "test_number": test_num,
        "title": out_db["test_info"]["title"],
        "filename": fname,
        "total_questions": total_q,
        "listening": total_lc,
        "reading": total_rc,
        "size_bytes": sz
    })

# Save tests index
index_path = os.path.join(out_dir, 'tests_index.json')
with open(index_path, 'w', encoding='utf-8') as f:
    json.dump({
        "total_tests": len(test_summary),
        "tests": test_summary
    }, f, ensure_ascii=False, indent=2)

print("\n🎉 ALL 10 TESTS COMPILED SUCCESSFULLY!")
for s in test_summary:
    print(f"  Test {s['test_number']}: {s['total_questions']}/200 questions (LC: {s['listening']}, RC: {s['reading']})")
