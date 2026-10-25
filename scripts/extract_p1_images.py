import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import fitz
import os

pdf_path = os.path.join('data', 'ets2026_raw', 'ETS 2026- LC.pdf')
doc = fitz.open(pdf_path)

out_dir = os.path.join('public', 'assets', 'ets2026', 'test1')
os.makedirs(out_dir, exist_ok=True)

# Let's inspect page 4, 5, 6
# On pages 4, 5, 6: Part 1 usually has 6 photos (2 per page: Q1-Q2, Q3-Q4, Q5-Q6)
print("Extracting images from page 4, 5, 6...")
for pno in [3, 4, 5]:
    page = doc[pno]
    image_list = page.get_images(full=True)
    print(f"\nPage {pno + 1} has {len(image_list)} images:")
    for img_index, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        w = base_image["width"]
        h = base_image["height"]
        print(f"  Img {img_index}: xref {xref}, format {image_ext}, {w}x{h}, size {len(image_bytes)} bytes")
