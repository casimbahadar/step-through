#!/usr/bin/env python3
"""Make every app icon from icon-source.png (1024x1024, full bleed, no rounded corners).

Phones round the corners themselves, so the source must be a plain square that is
the icon's own colour right to the edge. Needs Pillow (pip install Pillow).

  icon-192.png, icon-512.png   the manifest's normal icons
  apple-touch-icon.png         what an iPhone uses for "Add to Home Screen" (180x180)
  icon-maskable-512.png        Android's version: artwork at 70% on the navy field, so
                               any crop shape (circle, squircle) leaves it whole
"""
import pathlib
from PIL import Image, ImageDraw, ImageFilter

here = pathlib.Path(__file__).parent
full = Image.open(here / 'icon-source.png').convert('RGB')
assert full.size == (1024, 1024), 'icon-source.png must be 1024x1024'

for name, size in [('icon-512.png', 512), ('icon-192.png', 192), ('apple-touch-icon.png', 180)]:
    full.resize((size, size), Image.LANCZOS).save(here / name, optimize=True)

# the field colour is sampled from the icon's own left edge, so the artwork blends in
edge = full.crop((30, 100, 70, 924)).resize((1, 1), Image.LANCZOS).getpixel((0, 0))
canvas = Image.new('RGB', (1024, 1024), edge)
small = full.resize((717, 717), Image.LANCZOS)
fade = Image.new('L', (717, 717), 0)
ImageDraw.Draw(fade).rounded_rectangle([40, 40, 676, 676], radius=160, fill=255)
canvas.paste(small, (153, 153), fade.filter(ImageFilter.GaussianBlur(28)))
canvas.resize((512, 512), Image.LANCZOS).save(here / 'icon-maskable-512.png', optimize=True)
print('icons written from icon-source.png')
