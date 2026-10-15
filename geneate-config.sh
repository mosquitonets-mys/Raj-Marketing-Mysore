#!/bin/bash
source .env
cp firebase-config.template.js firebase-config.js
sed -i "s|__FIREBASE_API_KEY__|$FIREBASE_API_KEY|g" firebase-config.js
sed -i "s|__FIREBASE_AUTH_DOMAIN__|$FIREBASE_AUTH_DOMAIN|g" firebase-config.js
sed -i "s|__FIREBASE_PROJECT_ID__|$FIREBASE_PROJECT_ID|g" firebase-config.js
sed -i "s|__FIREBASE_STORAGE_BUCKET__|$FIREBASE_STORAGE_BUCKET|g" firebase-config.js
sed -i "s|__FIREBASE_MESSAGING_SENDER_ID__|$FIREBASE_MESSAGING_SENDER_ID|g" firebase-config.js
sed -i "s|__FIREBASE_APP_ID__|$FIREBASE_APP_ID|g" firebase-config.js
sed -i "s|__FIREBASE_MEASUREMENT_ID__|$FIREBASE_MEASUREMENT_ID|g" firebase-config.js
echo "✅ Local firebase-config.js generated"
