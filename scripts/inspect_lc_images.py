import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026- LC.pdf')
doc = fitz.open(pdf_path)

for pno in range(min(10, len(doc))):
    page = doc[pno]
    imgs = page.get_images()
    txt = page.get_text().strip()
    print(f"Page {pno + 1}: {len(imgs)} embedded images, text length: {len(txt)}")

# Let's render page 4 and 5 to see what they are!
os.makedirs('data/ets2026_raw/sample_renders', exist_ok=True)
for pno in [3, 4, 5, 6]:
    pix = doc[pno].get_pixmap(dpi=150)
    out_img = f"data/ets2026_raw/sample_renders/page_{pno + 1}.png"
    pix.save(out_img)
    print(f"Rendered page {pno + 1} to {out_img} ({pix.width}x{pix.height})")
