# Raj Marketing Mysore — Audit Fixes (12 October 2026)

This package applies the fixes from the static repository audit.
It contains **only the files that change** plus a script that patches
the four large HTML files. Binary images and untouched pages are not
included — keep the rest of your repository as-is.

## How to apply

1. Extract this package **inside** your `Raj-Marketing-Mysore` folder
   (the repo root, next to `index.html`), OR copy the `fixed-files/`
   contents over your repo manually.
2. Run:

   ```bash
   python apply_fixes.py
   ```

   The script copies `fixed-files/` over the repo and patches the big
   files. It is safe to run twice (idempotent).

## What was fixed

### Critical / High
- **Firebase single config** — root `firebase-config.js` now holds the real
  `raj-marketing-mysore-f91f7` project values (SDK 12.17.1, same as
  `js/firebase-config.js`). `js/firebase-config.js` is now a thin shim that
  re-exports the root config, so both import styles work.
- **`.firebaserc`** now points to `raj-marketing-mysore-f91f7`, matching the
  populated config.
- **Broken imports fixed** — `admin/admin-price-import.html`,
  `dealer/dealer-estimates.html`, `dealer/dealer-orders.html` imported
  `./firebase-config.js` (nonexistent in their folders); patched to
  `../firebase-config.js`.
- **`js/admin-auth.js`** contained an entire HTML document (invalid JS).
  Replaced with a tiny script that redirects to `admin/admin-login.html`.
- **`admin/js/admin-auth.js`** — client-side hash check kept working but
  wrapped in a prominent security warning. **Change the default password
  today (the hash corresponds to the publicly known "admin123") and plan
  the move to Firebase Auth + custom claims (see manual steps).**

### Broken links → fixed via redirect stubs (new files)
Old paths that many pages still reference now redirect to the real pages:
`customer-login.html`, `dealer-login.html`, `customer-register.html`,
`customer-dashboard.html`, `customer-measurement.html`,
`customer-referral.html`, `dealer-register.html`, `dealer-dashboard.html`,
`dealer.html` (root stubs) · `customer/customer-measurement.html`,
`customer/customer-referral.html` · `cities/chamarajanagar.html`,
`cities/gundlupet.html`, `cities/mysore.html` (case/name fixes — GitHub
Pages paths are case-sensitive).

### index.html
- City links fixed: `cities/Mysore.html`, `cities/chamarajanagara.html`,
  `cities/gundlupate.html`.
- Gallery images remapped to files that exist (`gallery-door.png`,
  `category-openable.jpg`, `velcro-economic.jpg`, `double-sliding.jpg`).
- `apple-touch-icon` now points to the existing `images/logo-wide.png`;
  a real `manifest.json` was added.
- GSTIN in the JSON-LD and footer standardized (see warning below).

### Other
- `js/main.js`: GSTIN standardized; product images now have an
  `onerror` fallback so a missing file degrades gracefully.
- `config.js`: placeholder Firebase block populated with the real project.
- `functions/.env`: guidance comments added (placeholders remain on purpose).
- `images/logo.png`: generated placeholder logo (fixes the broken logo in
  `appointment.html`).

## ⚠️ Manual steps you MUST still do

1. **Verify the GSTIN.** Two values existed: `29CHKPR1962H1ZT` and
   `29GKYPM6953C1ZA`. This package standardizes on
   **`29CHKPR1962H1ZT`** (the majority value). Confirm with your GST
   certificate before publishing invoices — if the other one is correct,
   run a find-and-replace for `29CHKPR1962H1ZT` → `29GKYPM6953C1ZA`.
2. **Confirm the Firebase project.** Everything now points to
   `raj-marketing-mysore-f91f7`. If the intended production project is
   actually `raj-marketing-mysore`, update `firebase-config.js`,
   `js/firebase-config.js`, `config.js` and `.firebaserc`.
3. **Razorpay keys.** `functions/.env` still has test placeholders —
   payments will not work. Use real keys via Firebase secrets
   (`firebase functions:secrets:set ...`), not a committed `.env`.
4. **Admin security.** Replace the client-side admin hash with Firebase
   Authentication + custom claims, and enforce admin rights in
   `firestore.rules`. Until then, treat the admin panel as public.
5. **Firestore rules:** run emulator tests (ownership, admin-only writes,
   abuse of public enquiry/feedback/visitor paths) and deploy to the
   same project as the config.
6. Re-check `index.html` og-image (`images/og-image.jpg` is still
   missing — add the file or remove the tag).

## Not covered (static audit limits)
No live browser test, emulator run, checkout transaction, or mobile test
was performed. Test login, registration, orders, estimates and the admin
imports after applying.
