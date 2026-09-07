#!/bin/bash

# ============================================
# COMPLETE IMAGE GENERATION SCRIPT
# Raj Marketing Mysore - v2.0
# ============================================

set -e

echo "🎨 Raj Marketing Mysore - Image Generator v2.0"
echo "═══════════════════════════════════════════════"
echo ""

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for ImageMagick
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick not found!${NC}"
    echo ""
    echo "📦 Install it using:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  MacOS: brew install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/script/download.php"
    echo ""
    echo "Or use the Python script instead."
    exit 1
fi

echo -e "${GREEN}✅ ImageMagick found!${NC}"
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p images/{slider,category,products,gallery,backgrounds,icons}

# Brand Colors
BLUE="#1a56db"
DARK_BLUE="#0f1b33"
LIGHT_BLUE="#e8f0fe"
ORANGE="#f59e0b"
WHITE="#ffffff"
GRAY="#f3f4f6"
GREEN_COLOR="#10b981"
PURPLE="#7c3aed"

# ============================================
# 1. LOGO & BRAND IMAGES
# ============================================
echo -e "\n${BLUE}📌 Generating Logo & Brand Images...${NC}"

# Main Logo - 200x200 PNG
convert -size 200x200 gradient:$DARK_BLUE-$BLUE \
  -fill $WHITE -font Arial-Bold -pointize 72 -gravity center \
  -annotate +0-15 "RM" \
  -fill $ORANGE -font Arial -pointize 16 -gravity south -annotate +0+10 "Raj Marketing" \
  -fill $LIGHT_BLUE -font Arial -pointize 10 -gravity south -annotate +0+0 "Mysore" \
  images/logo.png
echo -e "${GREEN}  ✅ logo.png${NC}"

# Logo with text - 600x200 PNG
convert -size 600x200 gradient:$DARK_BLUE-$BLUE \
  -fill $WHITE -font Arial-Bold -pointize 60 -gravity center \
  -annotate +0-10 "Raj Marketing" \
  -fill $ORANGE -font Arial-Bold -pointize 24 -gravity south \
  -annotate +0+10 "Mysore" \
  -fill $LIGHT_BLUE -font Arial -pointize 14 -gravity south -annotate +0-0 "Premium Mosquito Nets" \
  images/logo-wide.png
echo -e "${GREEN}  ✅ logo-wide.png${NC}"

# Apple Touch Icon - 180x180 PNG
convert -size 180x180 gradient:$BLUE-$DARK_BLUE \
  -fill $WHITE -font Arial-Bold -pointize 50 -gravity center \
  -annotate +0-5 "RM" \
  images/apple-touch-icon.png
echo -e "${GREEN}  ✅ apple-touch-icon.png${NC}"

# OG Image - 1200x630 JPG
convert -size 1200x630 gradient:$DARK_BLUE-$BLUE \
  -fill $WHITE -font Arial-Bold -pointize 80 -gravity center \
  -annotate +0-40 "Raj Marketing Mysore" \
  -fill $ORANGE -font Arial -pointize 36 -gravity center \
  -annotate +0+60 "Premium Mosquito Nets" \
  -fill $LIGHT_BLUE -font Arial -pointize 24 -gravity south -annotate +0+30 "www.rajmarketingmysore.info" \
  images/og-image.jpg
echo -e "${GREEN}  ✅ og-image.jpg${NC}"

# Favicon - 64x64 ICO
convert -size 64x64 gradient:$BLUE-$DARK_BLUE \
  -fill $WHITE -font Arial-Bold -pointize 28 -gravity center \
  -annotate +0-2 "RM" \
  images/favicon.ico
echo -e "${GREEN}  ✅ favicon.ico${NC}"

# ============================================
# 2. SLIDER IMAGES (10 images)
# ============================================
echo -e "\n${BLUE}📌 Generating Slider Images...${NC}"

declare -A SLIDER_TEXTS=(
  [1]="Premium Mosquito Nets|100% Protection • Quality Guaranteed"
  [2]="Custom Window Screens|Perfect Fit for Every Window"
  [3]="Trusted Since 2016|500+ Happy Customers"
  [4]="Quality You Can Trust|Premium Materials • Expert Craftsmanship"
  [5]="Protect Your Family|Safe • Reliable • Affordable"
  [6]="Why Raj Marketing?|Quality • Trust • Excellence"
  [7]="Professional Installation|Expert Team • Hassle-free Service"
  [8]="Premium Quality Nets|Velcro • Aluminium • Pleated • Mesh"
  [9]="Dealer Opportunities|Join Our Network • Grow Your Business"
  [10]="New Offers Coming!|Stay Tuned for Exclusive Deals"
)

for i in {1..10}; do
  IFS='|' read -r MAIN SUB <<< "${SLIDER_TEXTS[$i]}"
  
  # Create gradient with pattern overlay
  convert -size 1200x400 gradient:$DARK_BLUE-$BLUE \
    -fill "rgba(255,255,255,0.05)" -draw "circle 1000,50 1200,200" \
    -fill "rgba(255,255,255,0.03)" -draw "circle 200,350 400,450" \
    -fill "rgba(255,255,255,0.02)" -draw "circle 600,100 800,300" \
    -fill $WHITE -font Arial-Bold -pointize 72 -gravity center \
    -annotate +0-30 "$MAIN" \
    -fill $ORANGE -font Arial -pointize 32 -gravity center \
    -annotate +0+50 "$SUB" \
    -fill "rgba(255,255,255,0.08)" -draw "rectangle 0,380 1200,400" \
    -fill "rgba(255,255,255,0.05)" -draw "rectangle 0,0 1200,2" \
    images/slider/slider-$(printf "%02d" $i).jpg
  
  echo -e "${GREEN}  ✅ slider-$(printf "%02d" $i).jpg${NC}"
done

# ============================================
# 3. CATEGORY IMAGES (8 images)
# ============================================
echo -e "\n${BLUE}📌 Generating Category Images...${NC}"

declare -A CATEGORIES=(
  ["velcro"]="🔗 Velcro Nets|Flexible & Easy"
  ["aluminium"]="▣ Aluminium Frame|Durable & Strong"
  ["sliding"]="↔️ Sliding Nets|Space Saving"
  ["pleated"]="🪗 Pleated Nets|Foldable Design"
  ["openable"]="🚪 Openable Nets|Easy Access"
  ["ss-mesh"]="⚙️ SS Mesh|Premium Quality"
  ["fibre"]="🌀 Fibre Mesh|Lightweight"
  ["all"]="📦 All Products|View All"
)

for cat in "${!CATEGORIES[@]}"; do
  IFS='|' read -r NAME SUB <<< "${CATEGORIES[$cat]}"
  
  convert -size 400x300 gradient:$LIGHT_BLUE-$WHITE \
    -fill $DARK_BLUE -font Arial -pointize 36 -gravity center \
    -annotate +0-15 "$NAME" \
    -fill $BLUE -font Arial -pointize 16 -gravity center \
    -annotate +0+30 "$SUB" \
    -fill "rgba(26,86,219,0.05)" -draw "circle 350,50 400,100" \
    -stroke $BLUE -strokewidth 2 -draw "rectangle 10,10 390,290" \
    -fill "rgba(255,255,255,0.8)" -draw "rectangle 300,0 400,40" \
    images/category/category-$cat.jpg
  
  echo -e "${GREEN}  ✅ category-$cat.jpg${NC}"
done

# ============================================
# 4. PRODUCT IMAGES (20 images)
# ============================================
echo -e "\n${BLUE}📌 Generating Product Images...${NC}"

declare -A PRODUCTS=(
  ["pleated-economic"]="🪗 Pleated Economic|₹380-460"
  ["pleated-heavy"]="🪗 Pleated Heavy|₹450-460"
  ["pleated-top-heavy"]="🪗 Pleated Top Heavy|₹510"
  ["ss-pleated"]="🪗 SS Pleated|₹470"
  ["heavy-detachable-pleated"]="🪗 Heavy Detachable|₹460"
  ["woodgrain-pleated"]="🪗 Woodgrain Pleated|₹460"
  ["honeycomb-double-door"]="🏠 Honeycomb Double|₹680"
  ["single-sliding"]="↔️ Single Sliding|₹400"
  ["double-sliding"]="↔️ Double Sliding|₹450"
  ["single-door-pleated"]="🚪 Single Door Pleated|₹900"
  ["security-screen-single"]="🛡️ Security Screen Single|₹990"
  ["security-screen-double"]="🛡️ Security Screen Double|₹1,150"
  ["aluminium-colour-mesh"]="▣ Aluminium Colour|₹420"
  ["woodgrain-ss304"]="▣ Woodgrain SS304|₹580"
  ["ss-black-mesh"]="⚙️ SS Black Mesh 0.18mm|₹36"
  ["ss-black-mesh-standard"]="⚙️ SS Black Mesh|₹38"
  ["ss-black-mesh-3ft"]="⚙️ SS Black Mesh 3ft|₹42"
  ["ss-bright-mesh"]="⚙️ SS Bright Mesh|₹48"
  ["ss-black-304g"]="⚙️ SS Black 304G|₹550"
  ["fiber-mesh"]="🌀 Fiber/Touflex Mesh|₹8"
)

for product in "${!PRODUCTS[@]}"; do
  IFS='|' read -r NAME PRICE <<< "${PRODUCTS[$product]}"
  
  # Extract emoji for icon
  ICON=$(echo "$NAME" | cut -d' ' -f1)
  NAME_CLEAN=$(echo "$NAME" | cut -d' ' -f2-)
  
  convert -size 400x400 gradient:$WHITE-$LIGHT_BLUE \
    -fill $DARK_BLUE -font Arial -pointize 60 -gravity center \
    -annotate +0-40 "$ICON" \
    -fill $DARK_BLUE -font Arial -pointize 22 -gravity center \
    -annotate +0+40 "$NAME_CLEAN" \
    -fill $BLUE -font Arial-Bold -pointize 24 -gravity south \
    -annotate +0+30 "$PRICE" \
    -fill "rgba(26,86,219,0.05)" -draw "circle 350,50 400,100" \
    -stroke $BLUE -strokewidth 2 -draw "rectangle 10,10 390,390" \
    -fill "rgba(255,255,255,0.8)" -draw "rectangle 300,0 400,50" \
    images/products/$product.jpg
  
  echo -e "${GREEN}  ✅ $product.jpg${NC}"
done

# ============================================
# 5. GALLERY IMAGES (4 images)
# ============================================
echo -e "\n${BLUE}📌 Generating Gallery Images...${NC}"

declare -A GALLERY=(
  ["window"]="🪟 Window Installation|Professional Fitting"
  ["door"]="🚪 Door Installation|Perfect Alignment"
  ["pleated"]="🪗 Pleated Net Installation|Foldable Design"
  ["sliding"]="↔️ Sliding Net Installation|Space Saving"
)

for gal in "${!GALLERY[@]}"; do
  IFS='|' read -r NAME SUB <<< "${GALLERY[$gal]}"
  
  convert -size 600x480 gradient:$GRAY-$WHITE \
    -fill $DARK_BLUE -font Arial -pointize 80 -gravity center \
    -annotate +0-40 "$(echo $NAME | cut -d' ' -f1)" \
    -fill $DARK_BLUE -font Arial -pointize 32 -gravity center \
    -annotate +0+50 "$(echo $NAME | cut -d' ' -f2-)" \
    -fill $BLUE -font Arial -pointize 18 -gravity south \
    -annotate +0+30 "$SUB" \
    -fill "rgba(26,86,219,0.03)" -draw "circle 500,100 600,200" \
    -stroke $BLUE -strokewidth 3 -draw "rectangle 15,15 585,465" \
    images/gallery/gallery-$gal.jpg
  
  echo -e "${GREEN}  ✅ gallery-$gal.jpg${NC}"
done

# ============================================
# 6. BACKGROUND IMAGES
# ============================================
echo -e "\n${BLUE}📌 Generating Background Images...${NC}"

# Hero Background
convert -size 1920x1080 gradient:$DARK_BLUE-$BLUE \
  -fill "rgba(255,255,255,0.03)" -draw "circle 200,200 400,400" \
  -fill "rgba(255,255,255,0.02)" -draw "circle 1500,800 1700,1000" \
  -fill "rgba(255,255,255,0.04)" -draw "circle 800,500 1000,700" \
  images/backgrounds/hero-bg.jpg
echo -e "${GREEN}  ✅ hero-bg.jpg${NC}"

# Pattern Background
convert -size 800x800 pattern:checkerboard \
  -fill $LIGHT_BLUE -opaque white \
  -fill $WHITE -opaque black \
  images/backgrounds/pattern.png
echo -e "${GREEN}  ✅ pattern.png${NC}"

# ============================================
# 7. ICONS (SVG)
# ============================================
echo -e "\n${BLUE}📌 Generating Icon SVGs...${NC}"

# Create SVG icons
for icon in shield star check phone envelope map whatsapp; do
  case $icon in
    shield)
      cat > images/icons/shield.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  <polyline points="9 12 11 14 15 10"/>
</svg>
EOF
      ;;
    star)
      cat > images/icons/star.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>
EOF
      ;;
    check)
      cat > images/icons/check.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
  <polyline points="22 4 12 14.01 9 11.01"/>
</svg>
EOF
      ;;
    phone)
      cat > images/icons/phone.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>
EOF
      ;;
    envelope)
      cat > images/icons/envelope.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
  <polyline points="22,6 12,13 2,6"/>
</svg>
EOF
      ;;
    map)
      cat > images/icons/map.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>
EOF
      ;;
    whatsapp)
      cat > images/icons/whatsapp.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
</svg>
EOF
      ;;
  esac
  echo -e "${GREEN}  ✅ $icon.svg${NC}"
done

# ============================================
# 8. SUMMARY
# ============================================
echo ""
echo "═══════════════════════════════════════════════"
echo -e "${GREEN}🎉 ALL IMAGES GENERATED SUCCESSFULLY!${NC}"
echo "═══════════════════════════════════════════════"
echo ""
echo -e "${BLUE}📊 SUMMARY:${NC}"
echo "  ├── Logo Images: 5"
echo "  ├── Slider Images: 10"
echo "  ├── Category Images: 8"
echo "  ├── Product Images: 20"
echo "  ├── Gallery Images: 4"
echo "  ├── Background Images: 2"
echo "  └── SVG Icons: 7"
echo "  └── TOTAL: 56 Images"
echo ""
echo -e "${BLUE}📁 Location:${NC} ./images/"
echo ""
echo -e "${BLUE}📁 Structure:${NC}"
echo "  ├── images/"
echo "  │   ├── logo.png"
echo "  │   ├── logo-wide.png"
echo "  │   ├── apple-touch-icon.png"
echo "  │   ├── og-image.jpg"
echo "  │   ├── favicon.ico"
echo "  │   ├── slider/ (10 images)"
echo "  │   ├── category/ (8 images)"
echo "  │   ├── products/ (20 images)"
echo "  │   ├── gallery/ (4 images)"
echo "  │   ├── backgrounds/ (2 images)"
echo "  │   └── icons/ (7 SVG icons)"
echo ""
echo -e "${BLUE}🔧 Next Steps:${NC}"
echo "  1. Review all generated images"
echo "  2. Replace with actual product photos when available"
echo "  3. Optimize images for web (use TinyPNG or ImageOptim)"
echo "  4. Update the website with new images"
echo ""
echo -e "${GREEN}🚀 Website is ready to launch!${NC}"
