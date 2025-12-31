# Environment Variables Setup Guide

## Quick Setup (5 minutes)

1. **Create `.env.local` file** in your project root (next to `package.json`)

2. **Add these essential variables:**

```bash
# AI Features (REQUIRED)
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase (if using)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Email (Optional - for contact form)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

3. **Get your Gemini API key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy and paste into `.env.local`

4. **Restart your server:**
   ```bash
   npm run dev
   ```

## Testing

After setup, test these URLs:
- AI Idea Lab: http://localhost:3000/ai-lab
- AI Estimate: http://localhost:3000/estimate
- Contact Form: http://localhost:3000/contact

## Troubleshooting

**AI not working?**
- Check `.env.local` exists in project root
- Verify API key is correct (no extra spaces)
- Restart server after changing `.env.local`
- Check browser console (F12) for errors

**Still not working?**
- See `AI_MODELS_GUIDE.md` for detailed debugging
- Check API quota: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
