import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026- LC.pdf')
doc = fitz.open(pdf_path)

out_dir = os.path.join('public', 'assets', 'listening', 'ets2026_test1')
os.makedirs(out_dir, exist_ok=True)

# Page 4: Q1 & Q2 (xrefs 31, 32)
# Page 5: Q3 & Q4 (xrefs 40, 41)
# Page 6: Q5 & Q6 (xrefs 49, 50)
photo_xrefs = [
    (31, 'p1_q01.jpg'),
    (32, 'p1_q02.jpg'),
    (40, 'p1_q03.jpg'),
    (41, 'p1_q04.jpg'),
    (49, 'p1_q05.jpg'),
    (50, 'p1_q06.jpg')
]

for xref, fname in photo_xrefs:
    img_data = doc.extract_image(xref)
    dest = os.path.join(out_dir, fname)
    with open(dest, 'wb') as f:
        f.write(img_data['image'])
    print(f"Saved {fname}: {img_data['width']}x{img_data['height']} ({len(img_data['image'])} bytes)")

print("\n✅ All 6 Part 1 photos extracted successfully!")
