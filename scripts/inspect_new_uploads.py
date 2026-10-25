import os
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

base = r"C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058\.user_uploaded"
files = [
    "media_1792934915164_831d0429.png", # Ảnh 1
    "media_1792935439348_ec317463.png", # Ảnh 2
    "media_1792935460949_f5404b3d.png", # Ảnh 3
    "media_1792935472302_f3829b04.png", # Ảnh 4
    "media_1792935510743_3ef18f05.png"  # Ảnh 5
]

for idx, f in enumerate(files, 1):
    fp = os.path.join(base, f)
    im = Image.open(fp)
    is_anim = getattr(im, "is_animated", False)
    n_frames = getattr(im, "n_frames", 1)
    print(f"Ảnh {idx}: {f} | format={im.format}, size={im.size}, mode={im.mode}, animated={is_anim}, frames={n_frames}")
