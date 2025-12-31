# Vercel Deployment Checklist & Environment Variables

## 1. Essential Environment Variables
Add these to your Vercel project settings (Settings > Environment Variables).

### Firebase Client SDK (Public)
These are required for the frontend to connect to Firebase.
- `NEXT_PUBLIC_FIREBASE_API_KEY`: (From Project Settings)
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: `aviniti-website.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `aviniti-website`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: `aviniti-website.firebasestorage.app`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: `402215685347`
- `NEXT_PUBLIC_FIREBASE_APP_ID`: `1:402215685347:web:25b0591b34fde886cb89d6`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: `G-ZYXBPXPJDN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`: `https://aviniti-website-default-rtdb.firebaseio.com`

### Firebase Admin SDK (Server-Side - Secret)
Required for API routes that interact with Firebase (e.g., report generation).
**IMPORTANT:** Do NOT prefix these with `NEXT_PUBLIC_`.
- `FIREBASE_PROJECT_ID`: `aviniti-website`
- `FIREBASE_CLIENT_EMAIL`: (From Service Account JSON)
- `FIREBASE_PRIVATE_KEY`: (From Service Account JSON - Copy the entire key including `-----BEGIN PRIVATE KEY-----` and newlines)

### AI Services (Secret)
- `GEMINI_API_KEY`: (Your Google Gemini API Key)
- `NEXT_PUBLIC_GEMINI_MODEL`: `gemini-2.5-flash` (or `gemini-1.5-flash` as fallback)
- `GOOGLE_APPLICATION_CREDENTIALS`: (JSON string of service account for Speech-to-Text, if used)

### General
- `NEXT_PUBLIC_APP_ENV`: `production`
- `NEXT_PUBLIC_GA_ID`: `G-ZYXBPXPJDN`

## 2. Firebase Security Rules
Ensure you have deployed the latest security rules to Firebase Console (Firestore Database > Rules and Storage > Rules).

**Firestore Rules:**
Must allow writes to `/reports/{reportId}` and `/users/{userId}` for unauthenticated users (if public) or ensure proper auth handling.

**Storage Rules:**
Must allow PDF uploads to `/reports/{email}/{filename}`.

## 3. Deployment Verification Steps
1. **Deploy to Vercel**: Push your changes to the connected branch.
2. **Verify Build**: Check Vercel logs for any build-time errors.
3. **Check API Routes**:
   - Go to `/api/debug/ai` (if enabled) or test the AI estimation flow.
   - Ensure `GEMINI_API_KEY` is loaded correctly.
4. **Test Report Generation**:
   - Go to `/estimate`.
   - Complete the form.
   - Verify that the PDF is generated and downloaded.
   - Verify that the report data is saved to Firestore (check Firebase Console).
   - Verify that the PDF is uploaded to Storage (check Firebase Console).
