#!/usr/bin/env bash
set -euo pipefail

# ================== EDIT THESE 5 LINES ==================
REPO_URL="https://github.com/YOUR_USER/YOUR_REPO.git"
GIT_NAME="Your Name"
GIT_EMAIL="you@example.com"

# Firebase web config — get from:
# https://console.firebase.google.com/project/raj-marketing-mysore-f91f7/settings/general
FIREBASE_API_KEY="PASTE_REAL_API_KEY"
FIREBASE_SENDER_ID="PASTE_REAL_SENDER_ID"
FIREBASE_APP_ID="PASTE_REAL_APP_ID"
# ========================================================

SRC="Raj-Marketing-Mysore-main"
OUT="Raj-Marketing-Mysore-FIXED"
ZIP="Raj-Marketing-Mysore-FIXED.zip"

echo "▶ Fresh copy…"
rm -rf "$OUT" "$ZIP"
cp -r "$SRC" "$OUT"
cd "$OUT"

# ---------- 1. Fix broken Firebase imports ----------
echo "▶ 1/12 Fixing broken Firebase imports…"
sed -i 's|"./firebase-config.js"|"../firebase-config.js"|g' \
  admin/admin-price-import.html \
  dealer/dealer-estimates.html \
  dealer/dealer-orders.html

# ---------- 2. Delete duplicate + fake files ----------
echo "▶ 2/12 Removing duplicate / fake JS files…"
rm -f js/firebase-config.js js/admin-auth.js

# ---------- 3. Write single firebase-config.js ----------
echo "▶ 3/12 Writing canonical firebase-config.js…"
cat > firebase-config.js <<EOF
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "${FIREBASE_API_KEY}",
  authDomain:        "raj-marketing-mysore-f91f7.firebaseapp.com",
  projectId:         "raj-marketing-mysore-f91f7",
  storageBucket:     "raj-marketing-mysore-f91f7.appspot.com",
  messagingSenderId: "${FIREBASE_SENDER_ID}",
  appId:             "${FIREBASE_APP_ID}"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
EOF

# ---------- 4. Fix .firebaserc ----------
echo "▶ 4/12 Fixing .firebaserc…"
cat > firebaserc <<'EOF'
{ "projects": { "default": "raj-marketing-mysore-f91f7" } }
EOF

# ---------- 5. Standardize SDK version ----------
echo "▶ 5/12 Standardizing Firebase SDK to 12.17.1…"
grep -rl "firebasejs/10.13.0" --include="*.html" --include="*.js" . 2>/dev/null | \
  xargs -r sed -i 's|firebasejs/10.13.0|firebasejs/12.17.1|g'

# ---------- 6. Fix GSTIN ----------
echo "▶ 6/12 Fixing GSTIN → 29GKYPM6953C1ZA…"
grep -rl "29CHKPR1962H1ZT" --include="*.js" --include="*.html" . 2>/dev/null | \
  xargs -r sed -i 's|29CHKPR1962H1ZT|29GKYPM6953C1ZA|g'

# ---------- 7. Fix broken navigation links ----------
echo "▶ 7/12 Fixing broken navigation links…"
find . -maxdepth 1 -name "*.html" -print0 | xargs -0 sed -i \
  -e 's|href="customer-login.html"|href="customer/customer-login.html"|g' \
  -e 's|href="customer-dashboard.html"|href="customer/customer-dashboard.html"|g' \
  -e 's|href="customer-register.html"|href="customer/customer-registration.html"|g' \
  -e 's|href="customer-referral.html"|href="customer/customer-referal.html"|g' \
  -e 's|href="customer-measurement.html"|href="customer/customer-measurements.html"|g' \
  -e 's|href="dealer-login.html"|href="dealer/dealer-login.html"|g' \
  -e 's|href="dealer-dashboard.html"|href="dealer/dealer-dashboard.html"|g' \
  -e 's|href="dealer-register.html"|href="dealer/dealer-registration.html"|g' \
  -e 's|href="dealer.html"|href="dealer/dealership.html"|g'

find customer -name "*.html" -print0 2>/dev/null | xargs -0 -r sed -i \
  -e 's|href="customer-measurement.html"|href="customer-measurements.html"|g' \
  -e 's|href="customer-referral.html"|href="customer-referal.html"|g'

sed -i \
  -e 's|cities/mysore.html|cities/Mysore.html|g' \
  -e 's|cities/chamarajanagar.html|cities/chamarajanagara.html|g' \
  -e 's|cities/gundlupet.html|cities/gundlupate.html|g' \
  index.html 2>/dev/null || true

# ---------- 8. 404 redirect map ----------
echo "▶ 8/12 Adding 404 redirect map…"
cat > 404.html <<'EOF'
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Redirecting…</title>
<script>
const map = {
  "/customer-login.html":"/customer/customer-login.html",
  "/customer-dashboard.html":"/customer/customer-dashboard.html",
  "/dealer-login.html":"/dealer/dealer-login.html",
  "/dealer-dashboard.html":"/dealer/dealer-dashboard.html",
  "/cities/mysore.html":"/cities/Mysore.html",
  "/cities/chamarajanagar.html":"/cities/chamarajanagara.html",
  "/cities/gundlupet.html":"/cities/gundlupate.html"
};
const to = map[location.pathname];
if (to) location.replace(to);
else document.body.innerHTML="<h1>404 — Page not found</h1><p><a href='/'>Go home</a></p>";
</script></head><body></body></html>
EOF

# ---------- 9. Remove secrets ----------
echo "▶ 9/12 Removing committed secrets…"
rm -f functions/.env
grep -q "^\.env$" functions/.gitignore 2>/dev/null || echo ".env" >> functions/.gitignore

# ---------- 10. Harden Firestore rules ----------
echo "▶ 10/12 Hardening firestore.rules…"
cat > firestore.rules <<'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isAdmin()    { return isSignedIn() && request.auth.token.admin == true; }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }
    match /customers/{uid} {
      allow read, update: if isOwner(uid) || isAdmin();
      allow create:       if isOwner(uid);
    }
    match /dealers/{uid} {
      allow read, update: if isOwner(uid) || isAdmin();
      allow create:       if isOwner(uid);
    }
    match /orders/{id} {
      allow read:  if isAdmin() || (isSignedIn() && resource.data.uid == request.auth.uid);
      allow write: if isAdmin();
    }
    match /enquiries/{id} {
      allow create: if request.resource.data.keys().hasOnly(['name','phone','message','createdAt']);
      allow read, update, delete: if isAdmin();
    }
    match /visitor_stats/{id} {
      allow read:  if true;
      allow write: if false;
    }
  }
}
EOF

# ---------- 11. .gitignore ----------
echo "▶ 11/12 Writing .gitignore…"
cat > .gitignore <<'EOF'
node_modules/
.env
functions/.env
serviceAccountKey.json
*.log
.DS_Store
EOF

# ---------- 12. Sanity checks ----------
echo "▶ 12/12 Running sanity checks…"
FAIL=0
grep -rn "REPLACE_WITH_REAL\|YOUR_API_KEY\|rzp_test_xxxx" . \
  --include="*.js" --include="*.html" 2>/dev/null | grep -v node_modules && FAIL=1 || true
grep -rn "29CHKPR1962H1ZT" . 2>/dev/null && FAIL=1 || true
grep -rn "firebasejs/10\." . --include="*.js" --include="*.html" 2>/dev/null && FAIL=1 || true
grep -rn 'from ["'\'']\./firebase-config' . --include="*.js" --include="*.html" 2>/dev/null && FAIL=1 || true

if [ "$FAIL" = "1" ]; then
  echo "⚠  Some checks reported issues above — inspect before pushing"
else
  echo "✅ All sanity checks passed"
fi

# ---------- ZIP ----------
cd ..
echo "▶ Creating ZIP…"
zip -qr "$ZIP" "$OUT"

# ---------- GIT PUSH ----------
echo "▶ Initializing git and pushing to GitHub…"
cd "$OUT"
git init -q
git config user.name  "$GIT_NAME"
git config user.email "$GIT_EMAIL"
git add -A
git commit -q -m "Fix all audit errors: firebase config, links, admin auth, GSTIN, rules"
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git push -u origin main --force

echo
echo "======================================================"
echo "✅ DONE"
echo "  ZIP:   $(cd .. && pwd)/$ZIP"
echo "  Repo:  $REPO_URL"
echo "  Live:  https://YOUR_USER.github.io/YOUR_REPO/"
echo "======================================================"
