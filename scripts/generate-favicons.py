import os
from PIL import Image

def generate_favicons():
    logo_path = 'public/logo.png'
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found")
        return

    img = Image.open(logo_path)
    w, h = img.size

    # Crop the emblem symbol from the top region of logo.png
    # Bounding box of the emblem is X(160, 860), Y(10, 650)
    # We create a 1:1 square crop centered on the emblem
    crop_box = (150, 0, 870, 650)
    emblem = img.crop(crop_box)

    # Ensure square aspect ratio with dark background matching site theme #0A0F14 / transparent
    emblem_w, emblem_h = emblem.size
    max_dim = max(emblem_w, emblem_h)
    square_img = Image.new('RGBA', (max_dim, max_dim), (10, 15, 20, 255))
    offset = ((max_dim - emblem_w) // 2, (max_dim - emblem_h) // 2)
    square_img.paste(emblem, offset, emblem if emblem.mode == 'RGBA' else None)

    public_dir = 'public'

    sizes = {
        'favicon-16x16.png': (16, 16),
        'favicon-32x32.png': (32, 32),
        'favicon-48x48.png': (48, 48),
        'apple-touch-icon.png': (180, 180),
        'android-chrome-192x192.png': (192, 192),
        'android-chrome-512x512.png': (512, 512),
    }

    for filename, dim in sizes.items():
        resized = square_img.resize(dim, Image.Resampling.LANCZOS)
        out_path = os.path.join(public_dir, filename)
        resized.save(out_path, format='PNG', optimize=True)
        print(f"Generated: {out_path} ({dim[0]}x{dim[1]})")

    # Generate multi-size favicon.ico
    ico_path = os.path.join(public_dir, 'favicon.ico')
    ico_16 = square_img.resize((16, 16), Image.Resampling.LANCZOS)
    ico_32 = square_img.resize((32, 32), Image.Resampling.LANCZOS)
    ico_48 = square_img.resize((48, 48), Image.Resampling.LANCZOS)
    ico_16.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"Generated: {ico_path} (Multi-size ICO)")

if __name__ == '__main__':
    generate_favicons()
