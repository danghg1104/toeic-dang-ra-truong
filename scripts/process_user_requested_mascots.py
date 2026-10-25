import os
import sys
from PIL import Image, ImageDraw, ImageOps

sys.stdout.reconfigure(encoding='utf-8')

user_dir = r"C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058\.user_uploaded"
mascot_dir = r"c:\Users\Admin\Documents\antigravity\noble-franklin\public\assets\mascot"
assets_dir = r"c:\Users\Admin\Documents\antigravity\noble-franklin\assets\mascot"
www_dir = r"c:\Users\Admin\Documents\antigravity\noble-franklin\www\assets\mascot"
brain_dir = r"C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058"

for d in [mascot_dir, assets_dir, www_dir]:
    os.makedirs(d, exist_ok=True)

# -------------------------------------------------------------
# 1. ẢNH 2 -> LOGO (ở logo ảnh 1 thì thay ảnh 2 vào)
# -------------------------------------------------------------
img2_path = os.path.join(user_dir, "media_1792935439348_ec317463.png")
im2 = Image.open(img2_path).convert("RGBA")

# Save full version
im2.save(os.path.join(mascot_dir, "totoro_forest_sleeping_full.png"))

# Create 256x256 square crop centered around Totoro sleeping in the forest
# Totoro is horizontally centered, slightly lower than top
w2, h2 = im2.size
# Center square
cx, cy = w2 // 2, h2 // 2
crop_box = (cx - 150, cy - 150, cx + 150, cy + 150)
sq_logo = im2.crop(crop_box).resize((256, 256), Image.Resampling.LANCZOS)

# Create rounded version for the logo badge
logo_rounded = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
mask = Image.new("L", (256, 256), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle([0, 0, 256, 256], radius=48, fill=255)
logo_rounded.paste(sq_logo, (0, 0), mask)

# Add a subtle glowing golden border
draw_border = ImageDraw.Draw(logo_rounded)
draw_border.rounded_rectangle([2, 2, 254, 254], radius=48, outline=(251, 191, 36, 230), width=6)

logo_rounded.save(os.path.join(mascot_dir, "totoro_forest_logo.png"))
logo_rounded.save(os.path.join(assets_dir, "totoro_forest_logo.png"))
logo_rounded.save(os.path.join(www_dir, "totoro_forest_logo.png"))
logo_rounded.save(os.path.join(brain_dir, "totoro_forest_logo.png"))
print("Saved: totoro_forest_logo.png (Ảnh 2 -> Logo)")

# -------------------------------------------------------------
# 2. ẢNH 3 -> PHẦN NGHE (phần nghe thì thay ảnh 3 vào)
# -------------------------------------------------------------
img3_path = os.path.join(user_dir, "media_1792935460949_f5404b3d.png")
im3 = Image.open(img3_path).convert("RGBA")

# Save full
im3.save(os.path.join(mascot_dir, "totoro_listening_hero.png"))

# Create card version with rounded corners
w3, h3 = im3.size
card3 = Image.new("RGBA", (w3, h3), (0, 0, 0, 0))
mask3 = Image.new("L", (w3, h3), 0)
draw3 = ImageDraw.Draw(mask3)
draw3.rounded_rectangle([0, 0, w3, h3], radius=28, fill=255)
card3.paste(im3, (0, 0), mask3)

# Add subtle teal/indigo border
draw3_border = ImageDraw.Draw(card3)
draw3_border.rounded_rectangle([1, 1, w3-2, h3-2], radius=28, outline=(45, 212, 191, 200), width=4)

card3.save(os.path.join(mascot_dir, "totoro_listening_card.png"))
card3.save(os.path.join(assets_dir, "totoro_listening_card.png"))
card3.save(os.path.join(www_dir, "totoro_listening_card.png"))
card3.save(os.path.join(brain_dir, "totoro_listening_card.png"))
print("Saved: totoro_listening_card.png (Ảnh 3 -> Phần Nghe)")

# -------------------------------------------------------------
# 3. ẢNH 4 -> PHẦN ĐỌC (phần đọc thì thay ảnh 4 vào)
# -------------------------------------------------------------
img4_path = os.path.join(user_dir, "media_1792935472302_f3829b04.png")
im4 = Image.open(img4_path).convert("RGBA")

# Save full
im4.save(os.path.join(mascot_dir, "totoro_reading_hero.png"))

# Create card version with rounded corners
w4, h4 = im4.size
card4 = Image.new("RGBA", (w4, h4), (0, 0, 0, 0))
mask4 = Image.new("L", (w4, h4), 0)
draw4 = ImageDraw.Draw(mask4)
draw4.rounded_rectangle([0, 0, w4, h4], radius=32, fill=255)
card4.paste(im4, (0, 0), mask4)

# Add subtle cyan/blue border
draw4_border = ImageDraw.Draw(card4)
draw4_border.rounded_rectangle([1, 1, w4-2, h4-2], radius=32, outline=(56, 189, 248, 220), width=4)

card4.save(os.path.join(mascot_dir, "totoro_reading_card.png"))
card4.save(os.path.join(assets_dir, "totoro_reading_card.png"))
card4.save(os.path.join(www_dir, "totoro_reading_card.png"))
card4.save(os.path.join(brain_dir, "totoro_reading_card.png"))
print("Saved: totoro_reading_card.png (Ảnh 4 -> Phần Đọc)")

# -------------------------------------------------------------
# 4. ẢNH 5 -> PHẦN THI THỬ (phần thi thử thay ảnh 5 vào)
# -------------------------------------------------------------
img5_path = os.path.join(user_dir, "media_1792935510743_3ef18f05.png")
im5 = Image.open(img5_path).convert("RGBA")

# Save full
im5.save(os.path.join(mascot_dir, "totoro_mock_test_hero.png"))

# Create card version with rounded corners
w5, h5 = im5.size
card5 = Image.new("RGBA", (w5, h5), (0, 0, 0, 0))
mask5 = Image.new("L", (w5, h5), 0)
draw5 = ImageDraw.Draw(mask5)
draw5.rounded_rectangle([0, 0, w5, h5], radius=36, fill=255)
card5.paste(im5, (0, 0), mask5)

# Add subtle lime/amber border
draw5_border = ImageDraw.Draw(card5)
draw5_border.rounded_rectangle([1, 1, w5-2, h5-2], radius=36, outline=(132, 204, 22, 220), width=5)

card5.save(os.path.join(mascot_dir, "totoro_mock_test_card.png"))
card5.save(os.path.join(assets_dir, "totoro_mock_test_card.png"))
card5.save(os.path.join(www_dir, "totoro_mock_test_card.png"))
card5.save(os.path.join(brain_dir, "totoro_mock_test_card.png"))
print("Saved: totoro_mock_test_card.png (Ảnh 5 -> Phần Thi Thử)")

# Sync all mascot assets
print("All 4 assets processed and synced successfully!")
