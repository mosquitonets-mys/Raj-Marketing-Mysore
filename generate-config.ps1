Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        Set-Item -Path "env:$($matches[1])" -Value $matches[2]
    }
}
Copy-Item firebase-config.template.js firebase-config.js
(Get-Content firebase-config.js) `
    -replace '__FIREBASE_API_KEY__', $env:FIREBASE_API_KEY `
    -replace '__FIREBASE_AUTH_DOMAIN__', $env:FIREBASE_AUTH_DOMAIN `
    -replace '__FIREBASE_PROJECT_ID__', $env:FIREBASE_PROJECT_ID `
    -replace '__FIREBASE_STORAGE_BUCKET__', $env:FIREBASE_STORAGE_BUCKET `
    -replace '__FIREBASE_MESSAGING_SENDER_ID__', $env:FIREBASE_MESSAGING_SENDER_ID `
    -replace '__FIREBASE_APP_ID__', $env:FIREBASE_APP_ID `
    -replace '__FIREBASE_MEASUREMENT_ID__', $env:FIREBASE_MEASUREMENT_ID `
    | Set-Content firebase-config.js
Write-Host "✅ Local firebase-config.js generated"
