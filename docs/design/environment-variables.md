# Environment Variables Specification

**Version:** 1.0
**Date:** February 2026
**Stack:** Next.js 14+ (App Router)
**Status:** Design Specification

---

## Table of Contents

1. [Overview](#1-overview)
2. [Variable Categories](#2-variable-categories)
3. [Complete .env.example](#3-complete-envexample)
4. [Variable Reference Table](#4-variable-reference-table)
5. [Development vs Production](#5-development-vs-production)
6. [Security Guidelines](#6-security-guidelines)

---

## 1. Overview

### Naming Conventions

Next.js uses a specific convention for environment variables:

| Prefix | Accessible From | Use Case |
|--------|----------------|----------|
| `NEXT_PUBLIC_` | Client-side (browser) AND server-side | Public configuration visible in the browser bundle. Safe to expose. |
| No prefix | Server-side ONLY | Secrets, API keys, credentials. NEVER exposed to the browser. |

**Critical rule:** Any variable containing a secret (API key, service account, database credential) must NEVER have the `NEXT_PUBLIC_` prefix. Exposing secrets to the client is a security vulnerability.

### File Structure

| File | Purpose | Git Tracked |
|------|---------|-------------|
| `.env.example` | Template with placeholder values. Documents all required variables. | Yes |
| `.env.local` | Local development overrides. Contains real values for development. | No (in `.gitignore`) |
| `.env.development` | Development-specific defaults (optional). | Yes (no secrets) |
| `.env.production` | Production-specific defaults (optional). | Yes (no secrets) |

Production secrets are set via the hosting platform's environment variable UI (Vercel dashboard) and are never committed to version control.

---

## 2. Variable Categories

### Summary

| # | Category | Count | Visibility |
|---|----------|-------|------------|
| 1 | Firebase (Client) | 7 | Public (`NEXT_PUBLIC_`) |
| 2 | Firebase Admin (Server) | 3 | Secret (server-only) |
| 3 | Gemini AI | 1 | Secret (server-only) |
| 4 | Google Analytics | 1 | Public (`NEXT_PUBLIC_`) |
| 5 | Contact Information | 3 | Public (`NEXT_PUBLIC_`) |
| 6 | Calendly | 1 | Public (`NEXT_PUBLIC_`) |
| 7 | Site Configuration | 2 | Public (`NEXT_PUBLIC_`) |
| 8 | Email Service | 2 | Secret (server-only) |
| 9 | Rate Limiting | 1 | Secret (server-only) |
| **Total** | | **21** | |

---

## 3. Complete .env.example

```bash
# ==============================================================================
# AVINITI WEBSITE - Environment Variables
# ==============================================================================
# Copy this file to .env.local and fill in your values.
#
# IMPORTANT:
# - Variables prefixed with NEXT_PUBLIC_ are exposed to the browser.
#   Only use this prefix for non-secret configuration.
# - Variables WITHOUT the prefix are server-side only (API routes, server
#   components). Use these for all secrets and credentials.
# - Never commit .env.local or any file containing real secrets to git.
# ==============================================================================


# ==============================================================================
# 1. FIREBASE CLIENT SDK (Public)
# ==============================================================================
# These values configure the Firebase client SDK. They are NOT secrets.
# Firebase client config is designed to be public -- security is enforced
# via Firestore Security Rules (which deny all client access in our case)
# and Firebase App Check (optional).
#
# Find these values in: Firebase Console > Project Settings > General > Your Apps
# ==============================================================================

# [REQUIRED] Firebase API key for the web app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# [REQUIRED] Firebase auth domain
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com

# [REQUIRED] Firebase project ID
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# [REQUIRED] Firebase storage bucket
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# [REQUIRED] Firebase messaging sender ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012

# [REQUIRED] Firebase app ID
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef

# [OPTIONAL] Firebase measurement ID (for Firebase Analytics, if enabled)
# If you are using Google Analytics (GA4) separately, you may not need this.
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX


# ==============================================================================
# 2. FIREBASE ADMIN SDK (Secret -- Server-Side Only)
# ==============================================================================
# The Firebase Admin SDK authenticates with a service account to bypass
# Firestore security rules. This is used ONLY in Next.js API routes.
#
# OPTION A: Provide the entire service account JSON as a single variable.
#           This is the recommended approach for Vercel deployment.
#           The JSON must be on a single line (escape newlines).
#
# OPTION B: Provide individual fields from the service account JSON.
#           Useful if your hosting platform has character limits on env vars.
#
# Use ONE of the two options, not both.
#
# To get the service account JSON:
# Firebase Console > Project Settings > Service Accounts > Generate New Private Key
# ==============================================================================

# --- OPTION A: Full service account JSON (recommended for Vercel) ---
# [REQUIRED if not using Option B] Entire service account JSON, single-line
# Tip: In Vercel, paste the JSON directly. For .env.local, wrap in single quotes.
FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"your-project-id","private_key_id":"key-id","private_key":"-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com","client_id":"123456789012345678901","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token"}'

# --- OPTION B: Individual fields (alternative) ---
# [REQUIRED if not using Option A] Service account project ID
# FIREBASE_ADMIN_PROJECT_ID=your-project-id

# [REQUIRED if not using Option A] Service account client email
# FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# [REQUIRED if not using Option A] Service account private key
# Note: The private key contains newline characters (\n). Wrap in double quotes.
# FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEo...\n-----END RSA PRIVATE KEY-----\n"


# ==============================================================================
# 3. GEMINI AI (Secret -- Server-Side Only)
# ==============================================================================
# Google Gemini API key for AI-powered tools (Idea Lab, Analyzer, Estimate,
# ROI Calculator, and the Avi chatbot).
#
# This key is used ONLY in server-side API routes. It must NEVER be prefixed
# with NEXT_PUBLIC_ or exposed to the client.
#
# Get your API key: https://aistudio.google.com/app/apikey
# ==============================================================================

# [REQUIRED] Gemini API key
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


# ==============================================================================
# 4. GOOGLE ANALYTICS (Public)
# ==============================================================================
# GA4 Measurement ID for website analytics and conversion tracking.
# This is public -- it is embedded in the client-side tracking script.
#
# Find this in: Google Analytics > Admin > Data Streams > Web > Measurement ID
# ==============================================================================

# [REQUIRED] Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX


# ==============================================================================
# 5. CONTACT INFORMATION (Public)
# ==============================================================================
# Public contact details displayed across the website (footer, contact page,
# WhatsApp button, etc.). These are intentionally public.
# ==============================================================================

# [REQUIRED] WhatsApp Business number in international format (no +, no spaces)
# Used for wa.me links: https://wa.me/{number}
NEXT_PUBLIC_WHATSAPP_NUMBER=962791234567

# [REQUIRED] Primary contact email address
NEXT_PUBLIC_CONTACT_EMAIL=hello@aviniti.com

# [REQUIRED] Primary contact phone number (display format with country code)
NEXT_PUBLIC_CONTACT_PHONE=+962 79 123 4567


# ==============================================================================
# 6. CALENDLY (Public)
# ==============================================================================
# Calendly scheduling widget embed URL. Displayed on the Contact page and
# used in exit intent Variant B (consultation offer).
#
# Find this in: Calendly > Event Types > [Your Event] > Share > Embed
# ==============================================================================

# [REQUIRED] Calendly inline embed URL for the consultation booking widget
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/aviniti/15min


# ==============================================================================
# 7. SITE CONFIGURATION (Public)
# ==============================================================================
# General site configuration used for SEO meta tags, canonical URLs,
# Open Graph tags, and sitemap generation.
# ==============================================================================

# [REQUIRED] Full site URL (no trailing slash)
# Development: http://localhost:3000
# Production: https://aviniti.com
NEXT_PUBLIC_SITE_URL=https://aviniti.com

# [OPTIONAL] Default locale for the website
# Used as fallback when locale cannot be determined from the URL.
# Default: en
NEXT_PUBLIC_DEFAULT_LOCALE=en


# ==============================================================================
# 8. EMAIL SERVICE (Secret -- Server-Side Only)
# ==============================================================================
# Transactional email service for sending AI tool results, contact form
# confirmations, lead magnet downloads, and ROI reports to users.
#
# Recommended provider: Resend (https://resend.com)
# Alternatives: SendGrid, Postmark, AWS SES
#
# Resend setup: https://resend.com/docs/api-reference/introduction
# ==============================================================================

# [REQUIRED] Email service API key (Resend recommended)
EMAIL_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# [REQUIRED] Verified sender email address
# Must be verified with your email service provider.
# For Resend: verified via DNS records on your domain.
EMAIL_FROM_ADDRESS=noreply@aviniti.com


# ==============================================================================
# 9. RATE LIMITING (Secret -- Server-Side Only)
# ==============================================================================
# External key-value store for distributed rate limiting across API routes.
# Required if deploying to serverless environments (Vercel) where in-memory
# rate limiting does not work across function invocations.
#
# Recommended provider: Upstash Redis (https://upstash.com)
# Alternative: Vercel KV (which uses Upstash under the hood)
#
# If not provided, rate limiting falls back to in-memory storage
# (works for single-instance deployments but not for serverless at scale).
# ==============================================================================

# [OPTIONAL] Redis/KV connection URL for distributed rate limiting
# Format for Upstash: https://xxxxxxxx.upstash.io
# Format for Vercel KV: provided automatically when linked
RATE_LIMIT_KV_URL=https://xxxxxxxx-xxxxx.upstash.io

# [OPTIONAL] Redis/KV authentication token (required if using Upstash directly)
RATE_LIMIT_KV_TOKEN=AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx
```

---

## 4. Variable Reference Table

### All Variables at a Glance

| Variable | Required | Public | Category | Format / Example |
|----------|----------|--------|----------|-----------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Yes | Firebase Client | `AIzaSy...` (39 chars) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Yes | Firebase Client | `project-id.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Yes | Firebase Client | `aviniti-website` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Yes | Firebase Client | `project-id.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Yes | Firebase Client | `123456789012` (12 digits) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Yes | Firebase Client | `1:123...:web:abc...` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | No | Yes | Firebase Client | `G-XXXXXXXXXX` |
| `FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON` | Yes* | No | Firebase Admin | JSON string (single-line) |
| `FIREBASE_ADMIN_PROJECT_ID` | Yes* | No | Firebase Admin | `aviniti-website` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Yes* | No | Firebase Admin | `firebase-adminsdk-...@project.iam.gserviceaccount.com` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Yes* | No | Firebase Admin | `-----BEGIN RSA PRIVATE KEY-----\n...` |
| `GEMINI_API_KEY` | Yes | No | Gemini AI | `AIzaSy...` (39 chars) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Yes | Yes | Google Analytics | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes | Yes | Contact Info | `962791234567` (digits only) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | Yes | Contact Info | `hello@aviniti.com` |
| `NEXT_PUBLIC_CONTACT_PHONE` | Yes | Yes | Contact Info | `+962 79 123 4567` |
| `NEXT_PUBLIC_CALENDLY_URL` | Yes | Yes | Calendly | `https://calendly.com/aviniti/15min` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Yes | Site Config | `https://aviniti.com` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | No | Yes | Site Config | `en` or `ar` |
| `EMAIL_API_KEY` | Yes | No | Email Service | `re_XXXX...` (Resend format) |
| `EMAIL_FROM_ADDRESS` | Yes | No | Email Service | `noreply@aviniti.com` |
| `RATE_LIMIT_KV_URL` | No | No | Rate Limiting | `https://xxx.upstash.io` |
| `RATE_LIMIT_KV_TOKEN` | No | No | Rate Limiting | `AXXXX...` |

*Firebase Admin: Either provide `FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON` (Option A) OR all three individual fields (Option B). One set is required.

---

## 5. Development vs Production

### Differences by Environment

| Variable | Development Value | Production Value | Notes |
|----------|------------------|------------------|-------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://aviniti.com` | Affects canonical URLs, OG tags, sitemap |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Dev GA property or empty | Production GA property | Use a separate GA4 property for dev to avoid polluting production analytics |
| `GEMINI_API_KEY` | Same key (or dev-specific key) | Production key | Consider using a separate API key for development with lower quota |
| `EMAIL_API_KEY` | Resend test key or sandbox | Production API key | Resend provides test keys that do not send real emails |
| `EMAIL_FROM_ADDRESS` | `onboarding@resend.dev` (test) | `noreply@aviniti.com` | Resend test mode requires their test sender address |
| `RATE_LIMIT_KV_URL` | Empty (uses in-memory fallback) | Upstash Redis URL | In-memory rate limiting is sufficient for local development |
| Firebase variables | Development Firebase project | Production Firebase project | Recommended: use separate Firebase projects for dev and prod |

### Local Development Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the values for your development Firebase project and API keys.

3. For Firebase Admin SDK, download the service account JSON from the Firebase Console and either:
   - Paste the entire JSON as the value of `FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON`, or
   - Extract the individual fields into `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY`

4. Start the development server:
   ```bash
   npm run dev
   ```

### Vercel Deployment

1. In the Vercel dashboard, navigate to your project > Settings > Environment Variables.
2. Add each variable individually. Vercel supports setting different values per environment (Production, Preview, Development).
3. For `FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON`, paste the raw JSON directly -- Vercel handles multiline values.
4. For `FIREBASE_ADMIN_PRIVATE_KEY` (if using Option B), paste the key including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` markers. Vercel preserves newlines.
5. Redeploy after adding or changing environment variables.

---

## 6. Security Guidelines

### Do

- Store all secrets in environment variables, never in code.
- Use separate Firebase projects for development and production.
- Use separate API keys for development and production where possible.
- Rotate API keys periodically (at least annually).
- Restrict API keys by HTTP referrer (Firebase) or IP address where supported.
- Use Vercel's environment variable UI for production secrets.
- Add `.env.local` and `.env*.local` to `.gitignore` (Next.js does this by default).

### Do Not

- Never prefix secrets with `NEXT_PUBLIC_`. This exposes them in the client bundle.
- Never commit `.env.local` or any file containing real credentials to version control.
- Never log environment variables in client-side code or expose them in error messages.
- Never share API keys in Slack, email, or other unencrypted channels.
- Never use production API keys in local development if avoidable.
- Never hardcode fallback values for secrets in application code.

### API Key Restrictions

| Key | Restriction Method | Restriction Value |
|-----|-------------------|-------------------|
| Firebase API Key | HTTP referrer restriction (in Google Cloud Console) | `aviniti.com/*`, `localhost:3000/*` |
| Gemini API Key | IP restriction or API key restriction per Google AI Studio | Server IP addresses only |
| Resend API Key | Domain restriction | `aviniti.com` sender domain only |
| GA Measurement ID | N/A (public by design) | -- |

### Validation on Startup

The application should validate that all required environment variables are present at build time or server startup. Missing variables should cause a clear error message, not a silent failure.

```typescript
// Example: lib/env.ts
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Check your .env.local file or Vercel environment settings.`
    );
  }
  return value;
}

export const env = {
  firebase: {
    projectId: requireEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    // ... other Firebase client vars
  },
  firebaseAdmin: {
    serviceAccountJson: process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON,
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  gemini: {
    apiKey: requireEnv('GEMINI_API_KEY'),
  },
  email: {
    apiKey: requireEnv('EMAIL_API_KEY'),
    fromAddress: requireEnv('EMAIL_FROM_ADDRESS'),
  },
  rateLimit: {
    kvUrl: process.env.RATE_LIMIT_KV_URL,       // optional
    kvToken: process.env.RATE_LIMIT_KV_TOKEN,    // optional
  },
} as const;
```

---

**End of Environment Variables Specification**
