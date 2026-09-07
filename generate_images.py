#!/usr/bin/env python3
"""
Complete Image Generator for Raj Marketing Mysore
Requires: pip install Pillow
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import textwrap

# ============================================
# CONFIGURATION
# ============================================
BRAND_COLORS = {
    'blue': '#1a56db',
    'dark_blue': '#0f1b33',
    'light_blue': '#e8f0fe',
    'orange': '#f59e0b',
    'white': '#ffffff',
    'gray': '#f3f4f6',
    'green': '#10b981',
    'purple': '#7c3aed'
}

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# ============================================
# IMAGE GENERATION FUNCTIONS
# ============================================

def create_gradient_image(size, color1, color2, text, text_color='#ffffff', 
                         font_size=30, sub_text='', sub_size=16, output_path='output.jpg'):
    """Create a gradient image with centered text"""
    rgb1 = hex_to_rgb(color1)
    rgb2 = hex_to_rgb(color2)
    
    img = Image.new('RGB', size)
    draw = ImageDraw.Draw(img)
    
    # Create gradient
    for y in range(size[1]):
        ratio = y / size[1]
        r = int(rgb1[0] * (1 - ratio) + rgb2[0] * ratio)
        g = int(rgb1[1] * (1 - ratio) + rgb2[1] * ratio)
        b = int(rgb1[2] * (1 - ratio) + rgb2[2] * ratio)
        draw.line([(0, y), (size[0], y)], fill=(r, g, b))
    
    # Try to load font
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        sub_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", sub_size)
    except:
        font = ImageFont.load_default()
        sub_font = font
    
    # Draw main text
    text_color_rgb = hex_to_rgb(text_color)
    
    # Center main text
    lines = textwrap.wrap(text, width=15)
    total_height = len(lines) * (font_size + 10)
    y = (size[1] - total_height) // 2
    
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (size[0] - text_width) // 2
        draw.text((x, y), line, fill=text_color_rgb, font=font)
        y += font_size + 10
    
    # Draw sub text
    if sub_text:
        bbox = draw.textbbox((0, 0), sub_text, font=sub_font)
        sub_width = bbox[2] - bbox[0]
        x = (size[0] - sub_width) // 2
        y = size[1] - 60
        draw.text((x, y), sub_text, fill=text_color_rgb, font=sub_font)
    
    # Add border
    draw.rectangle([5, 5, size[0]-5, size[1]-5], outline=text_color_rgb, width=2)
    
    img.save(output_path)
    print(f"  ✅ Created: {output_path}")

def create_icon_image(size, icon_text, name, price='', output_path='output.jpg'):
    """Create product icon image"""
    img = Image.new('RGB', size, hex_to_rgb(BRAND_COLORS['white']))
    draw = ImageDraw.Draw(img)
    
    # Add subtle background
    for i in range(0, size[0], 40):
        for j in range(0, size[1], 40):
            if (i + j) % 80 == 0:
                draw.rectangle([i, j, i+20, j+20], fill=hex_to_rgb(BRAND_COLORS['light_blue']))
    
    # Try to load fonts
    try:
        icon_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 80)
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
        price_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
    except:
        icon_font = ImageFont.load_default()
        name_font = icon_font
        price_font = icon_font
    
    # Draw icon
    bbox = draw.textbbox((0, 0), icon_text, font=icon_font)
    icon_width = bbox[2] - bbox[0]
    x = (size[0] - icon_width) // 2
    y = 50
    draw.text((x, y), icon_text, fill=hex_to_rgb(BRAND_COLORS['dark_blue']), font=icon_font)
    
    # Draw name
    lines = textwrap.wrap(name, width=12)
    y = 180
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=name_font)
        text_width = bbox[2] - bbox[0]
        x = (size[0] - text_width) // 2
        draw.text((x, y), line, fill=hex_to_rgb(BRAND_COLORS['dark_blue']), font=name_font)
        y += 35
    
    # Draw price
    if price:
        bbox = draw.textbbox((0, 0), price, font=price_font)
        price_width = bbox[2] - bbox[0]
        x = (size[0] - price_width) // 2
        y = size[1] - 60
        draw.text((x, y), price, fill=hex_to_rgb(BRAND_COLORS['blue']), font=price_font)
    
    # Add border
    draw.rectangle([10, 10, size[0]-10, size[1]-10], 
                   outline=hex_to_rgb(BRAND_COLORS['blue']), width=3)
    
    img.save(output_path)
    print(f"  ✅ Created: {output_path}")

# ============================================
# MAIN GENERATION
# ============================================

def main():
    print("🎨 Raj Marketing Mysore - Image Generator v2.0")
    print("═══════════════════════════════════════════════")
    print()
    
    # Create directories
    dirs = ['images', 'images/slider', 'images/category', 
            'images/products', 'images/gallery', 'images/backgrounds']
    for d in dirs:
        os.makedirs(d, exist_ok=True)
    
    print("📁 Directory structure created")
    
    # 1. Logo Images
    print("\n📌 Generating Logo Images...")
    create_gradient_image((200, 200), BRAND_COLORS['dark_blue'], BRAND_COLORS['blue'],
                         "Raj\nMarketing", BRAND_COLORS['white'], 40,
                         "Mysore", 16, 'images/logo.png')
    
    create_gradient_image((600, 200), BRAND_COLORS['dark_blue'], BRAND_COLORS['blue'],
                         "Raj Marketing", BRAND_COLORS['white'], 60,
                         "Premium Mosquito Nets", 18, 'images/logo-wide.png')
    
    create_gradient_image((1200, 630), BRAND_COLORS['dark_blue'], BRAND_COLORS['blue'],
                         "Raj Marketing Mysore", BRAND_COLORS['white'], 80,
                         "Premium Mosquito Nets • www.rajmarketingmysore.info", 24, 
                         'images/og-image.jpg')
    
    # 2. Slider Images
    print("\n📌 Generating Slider Images...")
    slider_data = [
        ("Premium Mosquito Nets", "100% Protection • Quality Guaranteed"),
        ("Custom Window Screens", "Perfect Fit for Every Window"),
        ("Trusted Since 2016", "500+ Happy Customers"),
        ("Quality You Can Trust", "Premium Materials • Expert Craftsmanship"),
        ("Protect Your Family", "Safe • Reliable • Affordable"),
        ("Why Raj Marketing?", "Quality • Trust • Excellence"),
        ("Professional Installation", "Expert Team • Hassle-free Service"),
        ("Premium Quality Nets", "Velcro • Aluminium • Pleated • Mesh"),
        ("Dealer Opportunities", "Join Our Network • Grow Your Business"),
        ("New Offers Coming!", "Stay Tuned for Exclusive Deals")
    ]
    
    for i, (main, sub) in enumerate(slider_data, 1):
        create_gradient_image((1200, 400), BRAND_COLORS['dark_blue'], BRAND_COLORS['blue'],
                             main, BRAND_COLORS['white'], 72,
                             sub, 32, f'images/slider/slider-{i:02d}.jpg')
    
    # 3. Category Images
    print("\n📌 Generating Category Images...")
    categories = [
        ("🔗 Velcro Nets", "Flexible & Easy"),
        ("▣ Aluminium Frame", "Durable & Strong"),
        ("↔️ Sliding Nets", "Space Saving"),
        ("🪗 Pleated Nets", "Foldable Design"),
        ("🚪 Openable Nets", "Easy Access"),
        ("⚙️ SS Mesh", "Premium Quality"),
        ("🌀 Fibre Mesh", "Lightweight"),
        ("📦 All Products", "View All")
    ]
    
    for name, sub in categories:
        filename = name.split()[1].lower()
        if filename == 'nets':
            filename = name.split()[0].lower().replace('🔗', 'velcro').replace('▣', 'aluminium').replace('↔️', 'sliding')
        create_gradient_image((400, 300), BRAND_COLORS['light_blue'], BRAND_COLORS['white'],
                             name, BRAND_COLORS['dark_blue'], 36,
                             sub, 16, f'images/category/category-{filename}.jpg')
    
    # 4. Product Images
    print("\n📌 Generating Product Images...")
    products = [
        ("🪗 Pleated Economic", "₹380-460"),
        ("🪗 Pleated Heavy", "₹450-460"),
        ("🪗 Pleated Top Heavy", "₹510"),
        ("🪗 SS Pleated", "₹470"),
        ("🪗 Heavy Detachable", "₹460"),
        ("🪗 Woodgrain Pleated", "₹460"),
        ("🏠 Honeycomb Double", "₹680"),
        ("↔️ Single Sliding", "₹400"),
        ("↔️ Double Sliding", "₹450"),
        ("🚪 Single Door Pleated", "₹900"),
        ("🛡️ Security Screen Single", "₹990"),
        ("🛡️ Security Screen Double", "₹1,150"),
        ("▣ Aluminium Colour", "₹420"),
        ("▣ Woodgrain SS304", "₹580"),
        ("⚙️ SS Black Mesh 0.18mm", "₹36"),
        ("⚙️ SS Black Mesh", "₹38"),
        ("⚙️ SS Black Mesh 3ft", "₹42"),
        ("⚙️ SS Bright Mesh", "₹48"),
        ("⚙️ SS Black 304G", "₹550"),
        ("🌀 Fiber/Touflex Mesh", "₹8")
    ]
    
    for name, price in products:
        # Create filename
        name_clean = name.split(' ', 1)[1] if ' ' in name else name
        filename = name_clean.lower().replace(' ', '-').replace('/', '-')
        filename = filename.replace('(', '').replace(')', '').replace('+', 'plus')
        filename = filename.replace('0.18mm', '018mm')
        if not filename.endswith('.jpg'):
            filename = filename + '.jpg'
        create_icon_image((400, 400), name.split()[0], name_clean, price, 
                         f'images/products/{filename}')
    
    # 5. Gallery Images
    print("\n📌 Generating Gallery Images...")
    gallery = [
        ("🪟 Window Installation", "Professional Fitting"),
        ("🚪 Door Installation", "Perfect Alignment"),
        ("🪗 Pleated Net Installation", "Foldable Design"),
        ("↔️ Sliding Net Installation", "Space Saving")
    ]
    
    for name, sub in gallery:
        filename = name.split()[1].lower()
        create_gradient_image((600, 480), BRAND_COLORS['gray'], BRAND_COLORS['white'],
                             name, BRAND_COLORS['dark_blue'], 80,
                             sub, 18, f'images/gallery/gallery-{filename}.jpg')
    
    # 6. Backgrounds
    print("\n📌 Generating Background Images...")
    create_gradient_image((1920, 1080), BRAND_COLORS['dark_blue'], BRAND_COLORS['blue'],
                         "", BRAND_COLORS['white'], 0,
                         "", 0, 'images/backgrounds/hero-bg.jpg')
    
    # Summary
    print()
    print("═══════════════════════════════════════════════")
    print("🎉 ALL IMAGES GENERATED SUCCESSFULLY!")
    print("═══════════════════════════════════════════════")
    print()
    print("📊 SUMMARY:")
    print("  ├── Logo Images: 3")
    print("  ├── Slider Images: 10")
    print("  ├── Category Images: 8")
    print("  ├── Product Images: 20")
    print("  ├── Gallery Images: 4")
    print("  └── Background Images: 1")
    print("  └── TOTAL: 46 Images")
    print()
    print("📁 Location: ./images/")
    print()
    print("🚀 Website is ready!")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("❌ Pillow library not found!")
        print("📦 Install: pip install Pillow")
        sys.exit(1)
