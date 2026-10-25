import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026- LC.pdf')
if not os.path.exists(pdf_path):
    print(f"Error: {pdf_path} not found.")
    sys.exit(1)

doc = fitz.open(pdf_path)
print(f"📖 Loaded ETS 2026- LC.pdf ({len(doc)} pages)")

total_extracted = 0

for t in range(1, 11):
    out_dir = os.path.join('public', 'assets', 'listening', f'ets2026_test{t}')
    os.makedirs(out_dir, exist_ok=True)
    
    start_pno = 3 + (t - 1) * 14
    pnos = [start_pno, start_pno + 1, start_pno + 2]
    
    extracted_for_test = []
    for page_idx, pno in enumerate(pnos):
        page = doc[pno]
        imgs = page.get_images()
        # Find all large photos
        candidates = []
        for img in imgs:
            xref = img[0]
            b = doc.extract_image(xref)
            w = b['width']
            h = b['height']
            # We know question photos are high-res (> 2000px wide, > 800px high)
            if w > 2000 and h > 800:
                candidates.append((xref, b))
        
        # Take the first 2 photos from each page
        for c in candidates[:2]:
            extracted_for_test.append(c)
            
    print(f"Test {t}: found {len(extracted_for_test)} photos (expected 6)")
    for q_idx, (xref, b) in enumerate(extracted_for_test[:6]):
        qnum = q_idx + 1
        out_fname = f"p1_q{str(qnum).zfill(2)}.jpg"
        out_path = os.path.join(out_dir, out_fname)
        with open(out_path, 'wb') as f:
            f.write(b['image'])
        total_extracted += 1

print(f"\n🎉 Successfully extracted {total_extracted}/60 Part 1 high-resolution photos for all 10 tests!")
