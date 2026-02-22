# Aviniti Blog Auto-Generation Cloud Function

Firebase Cloud Function (2nd gen, Python) that automatically publishes bilingual (EN/AR)  
SEO-optimized blog posts every 48 hours.

## Architecture

```
Cloud Scheduler (every 48h)
    → generate_blog_post()
        → Check/refill topic backlog (Firestore: blog_topic_backlog)
        → Generate content via Gemini 2.0 Flash
        → Generate image via Imagen 4.0 Ultra
        → Upload image to Firebase Storage
        → Save post to Firestore (blog_posts)
        → Trigger Next.js ISR revalidation
        → Log result (blog_generation_log)
```

## Firestore Collections

### `blog_posts`
Each document:
```json
{
  "slug": "app-development-cost-jordan-2025",
  "status": "published",
  "publishedAt": "2025-02-22T10:00:00Z",
  "featuredImage": "https://storage.googleapis.com/...",
  "tags": ["app development", "Jordan"],
  "category": "App Development",
  "targetKeyword": "app development cost Jordan",
  "readingTime": 7,
  "en": { "title": "...", "excerpt": "...", "content": "...markdown...", "metaDescription": "..." },
  "ar": { "title": "...", "excerpt": "...", "content": "...arabic markdown...", "metaDescription": "..." }
}
```

### `blog_topic_backlog`
```json
{
  "topic": "...", "targetKeyword": "...", "angle": "...",
  "category": "...", "priority": 8, "status": "pending"
}
```

### `blog_generation_log`
Audit trail of every run.

## Required Firestore Indexes
Create a composite index:
- Collection: `blog_posts`
- Fields: `status` (ASC) + `publishedAt` (DESC)

## Environment Variables (Firebase Functions config)
```
GEMINI_API_KEY=REDACTED_API_KEY
REVALIDATE_URL=https://aviniti.app/api/revalidate
REVALIDATE_SECRET=<generate a strong random secret>
STORAGE_BUCKET=<your-firebase-project>.appspot.com
```

Set via Firebase CLI:
```bash
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set REVALIDATE_SECRET
firebase functions:secrets:set REVALIDATE_URL
firebase functions:secrets:set STORAGE_BUCKET
```

## Deploy
```bash
cd functions/blog_generator
firebase deploy --only functions:generate_blog_post
```

## Manual Trigger (for testing)
```bash
firebase functions:shell
# Then run:
generate_blog_post()
```
