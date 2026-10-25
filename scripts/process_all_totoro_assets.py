import os
from PIL import Image, ImageFilter, ImageOps
import numpy as np

user_dir = r"C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058\.user_uploaded"
mascot_dir = r"c:\Users\Admin\Documents\antigravity\noble-franklin\public\assets\mascot"
brain_dir = r"C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058"
os.makedirs(mascot_dir, exist_ok=True)

# -------------------------------------------------------------
# 1. PROCESS IMAGE 3: TÁCH NỀN / XÓA NỀN GIỮ LẠI TOTORO
# -------------------------------------------------------------
print("Processing Image 3 (Studio Ghibli Totoro)...")
img3_path = os.path.join(user_dir, "media_1792933292246_9f870f82.png")
im3 = Image.open(img3_path).convert("RGB")
arr3 = np.array(im3, dtype=float)
h3, w3 = arr3.shape[:2]

# The cyan background is [0, 173, 241]
bg = np.array([0.0, 173.0, 241.0])
dist = np.linalg.norm(arr3 - bg, axis=2)

# Analyze dark strokes vs white text:
# Dark stroke: G < 173, B < 241
dark_ratio_g = arr3[:, :, 1] / 173.0
dark_ratio_b = arr3[:, :, 2] / 241.0
dark_intensity = np.clip(1.0 - np.minimum(dark_ratio_g, dark_ratio_b), 0.0, 1.0)

# White text / stroke: R > 0
white_intensity = np.clip(arr3[:, :, 0] / 255.0, 0.0, 1.0)

# Construct RGBA
rgba3 = np.zeros((h3, w3, 4), dtype=np.uint8)

for y in range(h3):
    for x in range(w3):
        d_val = dark_intensity[y, x]
        w_val = white_intensity[y, x]
        
        # Is it dark line art?
        if d_val > 0.08 and arr3[y, x, 0] < 80:
            # Map d_val smoothly: 0.08 -> 0, 0.4 -> 1.0
            alpha = np.clip((d_val - 0.08) / 0.32, 0.0, 1.0)
            # Pure dark navy ink: [15, 23, 42]
            rgba3[y, x] = [15, 23, 42, int(alpha * 255)]
        # Is it white text?
        elif w_val > 0.08:
            alpha = np.clip((w_val - 0.08) / 0.5, 0.0, 1.0)
            rgba3[y, x] = [255, 255, 255, int(alpha * 255)]
        else:
            rgba3[y, x] = [0, 0, 0, 0]

full_trans_im = Image.fromarray(rgba3, "RGBA")
full_trans_path = os.path.join(mascot_dir, "totoro_ghibli_full_transparent.png")
full_trans_im.save(full_trans_path)
full_trans_im.save(os.path.join(brain_dir, "totoro_ghibli_full_transparent.png"))
print(f"Saved: {full_trans_path}")

# -------------------------------------------------------------
# 1B. CROP TOTORO CHARACTER ONLY (WITHOUT TEXT)
# -------------------------------------------------------------
# Totoro character is in x: [40, 375], y: [16, 375]
totoro_only = full_trans_im.crop((40, 16, 380, 375))
totoro_only_path = os.path.join(mascot_dir, "totoro_ghibli_totoro_only.png")
totoro_only.save(totoro_only_path)
totoro_only.save(os.path.join(brain_dir, "totoro_ghibli_totoro_only.png"))
print(f"Saved: {totoro_only_path} (size: {totoro_only.size})")

# -------------------------------------------------------------
# 1C. GENERATE TOTORO AVATAR LOGO (SQUARE 128x128 & 256x256)
# -------------------------------------------------------------
# Create square icon with Totoro centered, slightly focused on head & torso
# Crop head and upper body
totoro_head_crop = full_trans_im.crop((120, 16, 350, 240))
# Create transparent square 256x256
avatar_sq = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
# Resize totoro_head_crop keeping aspect ratio
totoro_head_crop.thumbnail((230, 230), Image.Resampling.LANCZOS)
paste_x = (256 - totoro_head_crop.width) // 2
paste_y = (256 - totoro_head_crop.height) // 2
avatar_sq.paste(totoro_head_crop, (paste_x, paste_y), totoro_head_crop)
avatar_sq_path = os.path.join(mascot_dir, "totoro_avatar_clean.png")
avatar_sq.save(avatar_sq_path)
avatar_sq.save(os.path.join(brain_dir, "totoro_avatar_clean.png"))
print(f"Saved: {avatar_sq_path}")

# -------------------------------------------------------------
# 1D. GENERATE TOTORO EMBEDDED BADGE FOR SIDEBAR LOGO (Hình 4)
# -------------------------------------------------------------
badge_size = 256
badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))

# Draw warm cream rounded badge background #f9f1dc
from PIL import ImageDraw
draw = ImageDraw.Draw(badge)
# Rounded rectangle
draw.rounded_rectangle([4, 4, badge_size - 4, badge_size - 4], radius=48, fill=(249, 241, 220, 255), outline=(251, 191, 36, 200), width=4)

# Place Totoro inside badge
badge.paste(totoro_head_crop, (paste_x, paste_y), totoro_head_crop)
badge_path = os.path.join(mascot_dir, "totoro_sidebar_logo_badge.png")
badge.save(badge_path)
badge.save(os.path.join(brain_dir, "totoro_sidebar_logo_badge.png"))
print(f"Saved: {badge_path}")

# -------------------------------------------------------------
# 1E. GENERATE TOTORO MASCOT CARD ASSET (Hình 5)
# -------------------------------------------------------------
# Whole Totoro centered in 256x256 with soft glowing halo
mascot_card = Image.new("RGBA", (280, 280), (0, 0, 0, 0))
totoro_full_resized = totoro_only.copy()
totoro_full_resized.thumbnail((260, 260), Image.Resampling.LANCZOS)
px = (280 - totoro_full_resized.width) // 2
py = (280 - totoro_full_resized.height) // 2
mascot_card.paste(totoro_full_resized, (px, py), totoro_full_resized)
mascot_card_path = os.path.join(mascot_dir, "totoro_mascot_ai_tutor.png")
mascot_card.save(mascot_card_path)
mascot_card.save(os.path.join(brain_dir, "totoro_mascot_ai_tutor.png"))
print(f"Saved: {mascot_card_path}")

# -------------------------------------------------------------
# 2. PROCESS IMAGE 1: 3 CHÚ TOTORO XẾP CHỒNG (Trio Stacked)
# -------------------------------------------------------------
print("Processing Image 1 (3 Totoro Stacked Trio)...")
img1_path = os.path.join(user_dir, "media_1792933248838_1d6d2d9c.png")
im1 = Image.open(img1_path)
im1_path_out = os.path.join(mascot_dir, "totoro_trio_stacked.png")
im1.save(im1_path_out)
im1.save(os.path.join(brain_dir, "totoro_trio_stacked.png"))
print(f"Saved: {im1_path_out} (size: {im1.size})")

# -------------------------------------------------------------
# 3. PROCESS IMAGE 2: TOTORO THỔI SÁO OCARINA DƯỚI TRĂNG (Listening Hero)
# -------------------------------------------------------------
print("Processing Image 2 (Totoro Ocarina Moonlight)...")
img2_path = os.path.join(user_dir, "media_1792933265475_e45c325e.png")
im2 = Image.open(img2_path)
im2_path_out = os.path.join(mascot_dir, "totoro_ocarina_moon.png")
im2.save(im2_path_out)
im2.save(os.path.join(brain_dir, "totoro_ocarina_moon.png"))
print(f"Saved: {im2_path_out} (size: {im2.size})")

print("All Totoro assets processed successfully!")
