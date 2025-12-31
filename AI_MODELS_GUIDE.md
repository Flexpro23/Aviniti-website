# AI Models & API Configuration Guide

## Overview

Your Aviniti website uses **Google's Gemini AI models** for two main features:
1. **AI Idea Lab** - Conversational brainstorming assistant
2. **AI Estimate Tool** - App cost & feature estimation

---

## AI Models Used

### 1. AI Idea Lab (`/api/ai-strategy-session`)

**Primary Model:** `gemini-2.5-flash`
- **Purpose:** Fast, conversational responses during brainstorming
- **Use case:** Real-time chat interactions
- **Speed:** Very fast (optimized for chat)
- **Cost:** Lower cost per request

**Secondary Model:** `gemini-2.0-pro-exp-02-05`
- **Purpose:** Generate detailed structured JSON for final opportunity blueprints
- **Use case:** When user requests final ideas/report
- **Speed:** Slower but more capable
- **Cost:** Higher cost but better quality

**Location:** `src/app/api/ai-strategy-session/route.ts`

### 2. AI Estimate Tool (`GeminiService.ts`)

**Model:** `gemini-2.5-flash` (configurable)
- **Purpose:** Analyze app descriptions and generate cost estimates
- **Use case:** Feature analysis, cost breakdown, timeline estimation
- **Speed:** Fast enough for interactive use
- **Cost:** Moderate

**Location:** `src/lib/services/GeminiService.ts`

---

## Current API Key Configuration

### AI Idea Lab
```typescript
// Line 30 in ai-strategy-session/route.ts
const geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyBOWp_3aq4U15lW2U0aOH3EzuC3E1akFao';
```

**Current Status:** ✅ Has a hardcoded fallback API key

### AI Estimate Tool
```typescript
// Line 12 in GeminiService.ts
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
```

**Current Status:** ⚠️ No fallback - requires environment variable

---

## Why You're Seeing the Error

The error message **"I apologize, but I'm having trouble processing your request right now"** appears because:

1. The API call to Gemini is failing (likely due to API quota/rate limits)
2. The fallback demo responses are being returned
3. The demo responses are generic and don't actually process your input

### Error Flow:
```
User sends message 
  → API tries to call Gemini
  → Gemini API fails (quota exceeded, invalid key, network error)
  → Catches error and returns demo response
  → User sees generic "I'm having trouble..." message
```

---

## How to Fix the AI Idea Lab

### Option 1: Get Your Own Gemini API Key (Recommended)

1. **Get a free API key:**
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key

2. **Add it to your `.env.local` file:**
   ```bash
   GEMINI_API_KEY=your_new_api_key_here
   ```

3. **Restart your dev server**

### Option 2: Use the Existing Key with Caution

The hardcoded key `AIzaSyBOWp_3aq4U15lW2U0aOH3EzuC3E1akFao` might be:
- Exhausted (hit daily quota)
- Restricted (only works from certain IPs/domains)
- Shared (being used by others)

**To check if it's working:**
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBOWp_3aq4U15lW2U0aOH3EzuC3E1akFao" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Option 3: Remove Hardcoded Key (Production Best Practice)

For security, you should remove the hardcoded key and require environment variables:

```typescript
// In ai-strategy-session/route.ts, change line 30 to:
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  return NextResponse.json(
    { error: 'AI service not configured. Please contact support.' },
    { status: 503 }
  );
}
```

---

## Gemini API Pricing & Limits

### Free Tier (as of 2024)
- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per day**

### Paid Tier
- Much higher limits
- Pay-as-you-go pricing
- ~$0.00025 per 1K characters for Flash models

**Check your quota:** https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

---

## Testing the AI Locally

### Test AI Idea Lab:
1. Open http://localhost:3000/ai-lab
2. Select language
3. Type a message like: "I want to build an app for fitness tracking"
4. Check browser console (F12) for API errors
5. Check terminal for server-side logs

### Test AI Estimate Tool:
1. Open http://localhost:3000/estimate
2. Describe an app
3. Select features
4. Generate report
5. Check console for errors

---

## Debugging Checklist

When AI features aren't working:

- [ ] Check `.env.local` has `GEMINI_API_KEY` set
- [ ] Restart dev server after changing `.env.local`
- [ ] Check browser console for client-side errors
- [ ] Check terminal for server-side API errors
- [ ] Verify API key is valid (test with curl)
- [ ] Check if you've hit rate limits (wait 1 minute and retry)
- [ ] Ensure you have internet connection
- [ ] Check if Google AI Studio is accessible in your region

---

## Environment Variables Summary

Create/update `.env.local` in your project root:

```bash
# AI Idea Lab (server-side)
GEMINI_API_KEY=your_gemini_api_key_here

# AI Estimate Tool (client-side)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Override default model
NEXT_PUBLIC_GEMINI_MODEL=gemini-2.5-flash

# Firebase (if using Firestore for saving opportunities)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# ... other Firebase config
```

---

## Model Comparison

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| gemini-2.5-flash | ⚡⚡⚡ | ⭐⭐⭐ | 💰 | Chat, quick responses |
| gemini-2.0-pro-exp | ⚡⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 | Complex analysis, JSON generation |
| gemini-1.5-pro | ⚡⚡ | ⭐⭐⭐⭐ | 💰💰 | Balanced option |

---

## Next Steps

1. **Get your own Gemini API key** (5 minutes)
2. **Add it to `.env.local`**
3. **Restart server**
4. **Test both AI features**
5. **Monitor usage** in Google Cloud Console
6. **Consider upgrading** if you hit limits

---

## Support Resources

- **Gemini API Docs:** https://ai.google.dev/docs
- **Get API Key:** https://makersuite.google.com/app/apikey
- **Pricing:** https://ai.google.dev/pricing
- **Quota Limits:** https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
