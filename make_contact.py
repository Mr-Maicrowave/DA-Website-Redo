import os
import math
import subprocess
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow', '--break-system-packages'])
    from PIL import Image, ImageDraw, ImageFont

thumb_dir = "/tmp/da_photos_thumbs"
files = [f for f in os.listdir(thumb_dir) if f.endswith(".jpg")]
files.sort()

cols = 8
rows = 10
images_per_sheet = cols * rows
thumb_w = 400
thumb_h = 400
margin = 20
text_height = 40

sheet_w = cols * (thumb_w + margin) + margin
sheet_h = rows * (thumb_h + margin + text_height) + margin

for i in range(math.ceil(len(files) / images_per_sheet)):
    sheet = Image.new('RGB', (sheet_w, sheet_h), (255, 255, 255))
    draw = ImageDraw.Draw(sheet)
    
    start_idx = i * images_per_sheet
    end_idx = min(start_idx + images_per_sheet, len(files))
    
    for j in range(start_idx, end_idx):
        f = files[j]
        img_path = os.path.join(thumb_dir, f)
        try:
            img = Image.open(img_path)
            img.thumbnail((thumb_w, thumb_h))
            
            idx_in_sheet = j - start_idx
            col = idx_in_sheet % cols
            row = idx_in_sheet // cols
            
            x = margin + col * (thumb_w + margin)
            y = margin + row * (thumb_h + margin + text_height)
            
            offset_x = x + (thumb_w - img.width) // 2
            offset_y = y + (thumb_h - img.height) // 2
            
            sheet.paste(img, (offset_x, offset_y))
            
            text_x = x
            text_y = y + thumb_h + 5
            draw.text((text_x, text_y), f, fill=(0, 0, 0))
        except Exception as e:
            print(f"Error processing {f}: {e}")
            
    out_path = f"/Users/jared/Software Developement/da-tuition-website/DA Photos/contact_sheet_{i+1}.png"
    sheet.save(out_path)
    print(f"Saved {out_path}")
