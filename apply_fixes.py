#!/usr/bin/env python3
"""
Raj Marketing Mysore - audit fix applier
=========================================
Run this script INSIDE your extracted Raj-Marketing-Mysore folder
(after copying the `fixed-files/` contents over it), OR run it in
the repo root and it will also copy fixed-files for you.

    python apply_fixes.py

It patches the four large files that cannot be shipped pre-edited:
  - admin/admin-price-import.html   (broken firebase-config import)
  - dealer/dealer-estimates.html    (broken firebase-config import)
  - dealer/dealer-orders.html       (broken firebase-config import)
  - index.html                      (city links, gallery images,
                                     GSTIN, apple-touch-icon)
The script is idempotent: running it twice is safe.
"""
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

PATCHES = {
    "admin/admin-price-import.html": [
        ('from "./firebase-config.js"', 'from "../firebase-config.js"'),
    ],
    "dealer/dealer-estimates.html": [
        ('from "./firebase-config.js"', 'from "../firebase-config.js"'),
    ],
    "dealer/dealer-orders.html": [
        ('from "./firebase-config.js"', 'from "../firebase-config.js"'),
    ],
    "index.html": [
        ('href="images/apple-touch-icon.png"', 'href="images/logo-wide.png"'),
        ('src="images/gallery-window.jpg"',    'src="images/category-openable.jpg"'),
        ('src="images/gallery-door.jpg"',      'src="images/gallery-door.png"'),
        ('src="images/gallery-pleated.jpg"',   'src="images/velcro-economic.jpg"'),
        ('src="images/gallery-sliding.jpg"',   'src="images/double-sliding.jpg"'),
        ('href="cities/mysore.html"',          'href="cities/Mysore.html"'),
        ('href="cities/chamarajanagar.html"',  'href="cities/chamarajanagara.html"'),
        ('href="cities/gundlupet.html"',       'href="cities/gundlupate.html"'),
        ('"vatID": "29GKYPM6953C1ZA"',         '"vatID": "29CHKPR1962H1ZT"'),
        ("GST: 29GKYPM6953C1ZA",               "GST: 29CHKPR1962H1ZT"),
    ],
}

def copy_fixed_files():
    src = os.path.join(HERE, "fixed-files")
    if not os.path.isdir(src):
        return
    count = 0
    for root, _dirs, files in os.walk(src):
        for name in files:
            s = os.path.join(root, name)
            rel = os.path.relpath(s, src)
            d = os.path.join(HERE, rel)
            if os.path.abspath(s) == os.path.abspath(d):
                continue
            os.makedirs(os.path.dirname(d), exist_ok=True)
            shutil.copy2(s, d)
            count += 1
    print(f"[ok] copied {count} fixed files from fixed-files/")

def apply_patches():
    failures = 0
    for rel_path, replacements in PATCHES.items():
        path = os.path.join(HERE, rel_path)
        if not os.path.isfile(path):
            print(f"[skip] {rel_path} not found")
            continue
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        changed = False
        for old, new in replacements:
            if old in content:
                content = content.replace(old, new)
                changed = True
                print(f"[ok] {rel_path}: replaced {old[:60]}")
            elif new in content:
                print(f"[ok] {rel_path}: already patched ({new[:50]})")
            else:
                print(f"[warn] {rel_path}: pattern NOT found: {old[:60]}")
                failures += 1
        if changed:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
    return failures

if __name__ == "__main__":
    copy_fixed_files()
    n = apply_patches()
    print()
    if n:
        print(f"Finished with {n} warning(s) - review the [warn] lines above.")
        sys.exit(1)
    print("All patches applied successfully.")
