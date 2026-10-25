import os
import sys
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')

fp = r"C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058\.user_uploaded\media_1792936573785_ddf03ba4.png"
im = Image.open(fp).convert("RGBA")
brain_dir = r"C:\Users\Admin\.gemini\antigravity\brain\a08eff3b-945d-45ab-b5c1-5f5efd108058"
mascot_dir = r"c:\Users\Admin\Documents\antigravity\noble-franklin\public\assets\mascot"
assets_dir = r"c:\Users\Admin\Documents\antigravity\noble-franklin\assets\mascot"
www_dir = r"c:\Users\Admin\Documents\antigravity\noble-franklin\www\assets\mascot"

# Clean top row text if any: y from 2 to 333 (height 331)
clean_im = im.crop((0, 2, im.width, im.height - 2))
cw, ch = clean_im.size # 420 x 331

# Crop 1: Balanced (x: 10 to 341, y: 0 to 331) -> 331x331 square
crop_balanced = clean_im.crop((10, 0, 341, 331)).resize((256, 256), Image.Resampling.LANCZOS)

# Crop 2: Centered on Totoro (x: 35 to 366, y: 0 to 331) -> 331x331 square
crop_totoro_focus = clean_im.crop((35, 0, 366, 331)).resize((256, 256), Image.Resampling.LANCZOS)

# Create rounded icon versions with subtle borders for the logo
def make_rounded_icon(sq_im, radius=48):
    icon = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    mask = Image.new("L", (256, 256), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, 256, 256], radius=radius, fill=255)
    icon.paste(sq_im, (0, 0), mask)
    
    draw_border = ImageDraw.Draw(icon)
    draw_border.rounded_rectangle([2, 2, 254, 254], radius=radius, outline=(251, 191, 36, 230), width=6)
    return icon

icon_balanced = make_rounded_icon(crop_balanced)
icon_totoro_focus = make_rounded_icon(crop_totoro_focus)

# Save the full clean original too
clean_im.save(os.path.join(mascot_dir, "totoro_umbrella_full.png"))
clean_im.save(os.path.join(brain_dir, "totoro_umbrella_full.png"))

# Save the chosen logo: Balanced crop captures both the blue umbrella and Totoro's cute face & leaf hat!
icon_balanced.save(os.path.join(mascot_dir, "totoro_umbrella_logo.png"))
icon_balanced.save(os.path.join(assets_dir, "totoro_umbrella_logo.png"))
icon_balanced.save(os.path.join(www_dir, "totoro_umbrella_logo.png"))
icon_balanced.save(os.path.join(brain_dir, "totoro_umbrella_logo.png"))

# Also save square unrounded version so object-cover in CSS works seamlessly with Tailwind rounded-2xl
crop_balanced.save(os.path.join(mascot_dir, "totoro_umbrella_square.png"))
crop_balanced.save(os.path.join(assets_dir, "totoro_umbrella_square.png"))
crop_balanced.save(os.path.join(www_dir, "totoro_umbrella_square.png"))
crop_balanced.save(os.path.join(brain_dir, "totoro_umbrella_square.png"))

print("Processed and saved totoro_umbrella_logo.png and totoro_umbrella_square.png!")
