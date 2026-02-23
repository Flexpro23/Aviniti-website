"""
Aviniti Blog Auto-Generation Cloud Function
Firebase Functions 2nd gen (Python)

Triggered by Cloud Scheduler every 2 days.
Generates SEO-optimized bilingual (EN + AR) blog posts automatically.

Environment variables required (set in Firebase):
  GEMINI_API_KEY        - Google Gemini API key
  REVALIDATE_URL        - Next.js revalidation webhook URL  
  REVALIDATE_SECRET     - Secret token for revalidation endpoint
  STORAGE_BUCKET        - Firebase Storage bucket name (e.g. your-project.appspot.com)
"""

import json
import re
import time
import logging
import os
import io
import traceback
import requests
from datetime import datetime, timezone
from urllib.parse import quote

import firebase_admin
from firebase_admin import credentials, firestore, storage
from firebase_functions import scheduler_fn, https_fn
from google import genai
from google.genai import types
from PIL import Image

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Firebase init (lazy — avoids deployment analysis timeout) ────────────────
_db = None

def get_db():
    global _db
    if _db is None:
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
        _db = firestore.client()
    return _db

# ─── Constants ────────────────────────────────────────────────────────────────
AVINITI_CONTEXT = """
Aviniti is an AI-powered app development company based in Amman, Jordan.
Services: custom mobile apps (iOS/Android), web apps, SaaS platforms, AI integration, 
digital transformation consulting.
Target market: businesses in Jordan and the broader MENA region.
Key industries served: food delivery, healthcare/clinics, beauty/salons, 
education/nurseries, barbershops, business management/ERP, e-commerce.
AI tools offered: Idea Lab (business idea validation), AI Analyzer (market analysis), 
Get AI Estimate (instant cost estimation), ROI Calculator.
Tagline: "Your Ideas, Our Reality"
Website: https://aviniti.app
"""

TOPIC_SEED_AREAS = [
    "App development costs and budgeting in Jordan",
    "AI integration for small businesses in MENA",
    "Digital transformation for Jordanian SMEs",
    "Mobile app vs web app decisions for startups",
    "Custom software ROI and business justification",
    "Food delivery app development and features",
    "Healthcare app development for clinics in Jordan",
    "E-commerce app trends in Arab world",
    "SaaS business models for regional companies",
    "App security and compliance in Middle East",
    "React Native vs Flutter for MENA startups",
    "Firebase and cloud infrastructure for apps",
    "UX design for Arabic-speaking users",
    "Payment gateway integration in Jordan",
    "MVP strategy for first-time tech founders",
    "AI chatbots for customer service in Arabic",
    "App store optimization in Arabic-speaking markets",
    "Tech startup ecosystem in Jordan and Amman",
    "Loyalty and rewards apps for retail in Jordan",
    "Appointment booking apps for beauty and health",
]

# ─── Topic Generation ──────────────────────────────────────────────────────────

def generate_topic_ideas(existing_slugs: list[str], count: int = 10) -> list[dict]:
    """Use Gemini to generate SEO-targeted topic ideas Aviniti hasn't covered yet."""
    api_key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")

    client = genai.Client(api_key=api_key)
    
    existing_list = "\n".join(f"- {s}" for s in existing_slugs) if existing_slugs else "None yet"
    areas_list = "\n".join(f"- {a}" for a in TOPIC_SEED_AREAS)

    prompt = f"""You are an SEO content strategist for Aviniti, an AI-powered app development company in Amman, Jordan.

Company context:
{AVINITI_CONTEXT}

Topic areas to draw from:
{areas_list}

Already published slugs (DO NOT repeat these topics):
{existing_list}

Generate exactly {count} new blog post topic ideas that:
1. Target keywords potential Aviniti clients would search for (high buyer intent)
2. Are specific to Jordan/MENA market context where relevant
3. Cover different topic areas (don't cluster too many similar topics)
4. Would naturally lead readers to Aviniti's services
5. Have realistic SEO potential (not too broad, not too narrow)

Return ONLY valid JSON array, no markdown, no explanation:
[
  {{
    "topic": "Descriptive topic title",
    "targetKeyword": "main SEO keyword phrase",
    "angle": "specific content angle or hook",
    "category": "App Development|AI|Digital Transformation|Business|Mobile|Web",
    "priority": 1-10
  }}
]"""

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.7)
    )
    
    raw = response.text.strip()
    # Strip markdown code blocks if present
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    
    ideas = json.loads(raw)
    logger.info(f"Generated {len(ideas)} topic ideas")
    return ideas


def get_or_create_topic(existing_slugs: list[str]) -> dict:
    """Get next pending topic from backlog, or generate new ones if backlog is low."""
    backlog_ref = get_db().collection("blog_topic_backlog")
    
    # Count pending topics
    pending = backlog_ref.where("status", "==", "pending").order_by("priority", direction=firestore.Query.DESCENDING).limit(1).get()
    pending_count = len(backlog_ref.where("status", "==", "pending").limit(10).get())
    
    # Refill backlog if running low
    if pending_count < 5:
        logger.info(f"Backlog low ({pending_count} topics). Generating new ideas...")
        new_ideas = generate_topic_ideas(existing_slugs, count=10)
        batch = get_db().batch()
        for idea in new_ideas:
            doc_ref = backlog_ref.document()
            batch.set(doc_ref, {
                **idea,
                "status": "pending",
                "createdAt": datetime.now(timezone.utc).isoformat(),
            })
        batch.commit()
        logger.info(f"Added {len(new_ideas)} new topics to backlog")
        
        # Re-fetch
        pending = backlog_ref.where("status", "==", "pending").order_by("priority", direction=firestore.Query.DESCENDING).limit(1).get()
    
    if not pending:
        raise RuntimeError("No pending topics available even after generation")
    
    doc = pending[0]
    return {"id": doc.id, "ref": doc.reference, **doc.to_dict()}


# ─── Content Generation ────────────────────────────────────────────────────────

def generate_blog_content(topic: dict) -> dict:
    """Generate full bilingual blog post content using Gemini."""
    api_key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    client = genai.Client(api_key=api_key)
    
    slug = re.sub(r'[^a-z0-9]+', '-', topic['targetKeyword'].lower()).strip('-')
    slug = f"{slug}-{datetime.now(timezone.utc).year}"
    
    prompt = f"""You are a professional content writer for Aviniti, an AI-powered app development company in Amman, Jordan.

Company context:
{AVINITI_CONTEXT}

Write a complete, SEO-optimized blog post with these specifications:
- Topic: {topic['topic']}
- Target keyword: {topic['targetKeyword']}
- Content angle: {topic['angle']}
- Category: {topic['category']}
- Length: 900-1200 words
- Audience: Business owners, entrepreneurs, and decision-makers in Jordan/MENA considering building an app or digitizing their business

Requirements:
1. The content must be genuinely helpful and informative — not just marketing fluff
2. Use proper markdown: # H1, ## H2, ### H3, **bold**, *italic*, tables where relevant
3. Include at least one comparison table if relevant
4. Include a short FAQ section (3-5 questions) at the end  
5. End with a clear CTA linking to relevant Aviniti tools:
   - For cost/estimate topics → link to /get-estimate  
   - For idea/validation topics → link to /idea-lab
   - For analysis topics → link to /ai-analyzer
   - General → link to /contact
6. Naturally mention Aviniti 2-3 times maximum — don't be salesy
7. Include realistic numbers and specific details relevant to Jordan/MENA market
8. Use Western numerals (1, 2, 3) not Arabic-Indic

Also provide:
- An Arabic version of the ENTIRE post (translate + adapt naturally, not just literal translation)
  - Use Modern Standard Arabic (MSA) with natural Jordanian business context
  - Arabic CTA links should use the same paths (/get-estimate, etc.)
  - Arabic version should feel naturally written, not machine-translated

Return ONLY valid JSON (no markdown wrapper):
{{
  "slug": "{slug}",
  "targetKeyword": "{topic['targetKeyword']}",
  "category": "{topic['category']}",
  "readingTime": <integer minutes>,
  "tags": ["tag1", "tag2", "tag3"],
  "imagePrompt": "Detailed prompt for Imagen 4.0 to generate a featured image for this post. Must follow Aviniti design system: dark navy #0A1628 background, bronze/gold #C08460 accents, professional SaaS aesthetic, photorealistic device mockups if relevant, cinematic lighting. No text overlays, no watermarks, no logos. 16:9 aspect ratio.",
  "en": {{
    "title": "SEO-optimized title with target keyword",
    "excerpt": "2-3 sentence compelling excerpt for cards and meta",
    "metaDescription": "Under 155 chars SEO meta description with keyword",
    "content": "Full markdown content here..."
  }},
  "ar": {{
    "title": "Arabic title",
    "excerpt": "Arabic excerpt",
    "metaDescription": "Arabic meta description",
    "content": "Full Arabic markdown content..."
  }}
}}"""

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.6,
            max_output_tokens=8192,
        )
    )
    
    raw = response.text.strip()
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    
    post_data = json.loads(raw)
    logger.info(f"Generated content for: {post_data['en']['title']}")
    return post_data


# ─── Image Generation ──────────────────────────────────────────────────────────

def generate_and_upload_image(image_prompt: str, slug: str) -> str | None:
    """Generate featured image with Imagen 4.0 Ultra and upload to Firebase Storage."""
    api_key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    bucket_name = (os.environ.get("STORAGE_BUCKET") or "").strip()

    if not bucket_name:
        logger.warning("STORAGE_BUCKET not set, skipping image generation")
        return None
    
    try:
        client = genai.Client(api_key=api_key)
        
        full_prompt = f"""
        {image_prompt}
        
        Technical requirements:
        - Background: dark navy #0A1628
        - Primary accent: bronze/gold #C08460
        - Style: Professional, premium SaaS tech company aesthetic
        - Lighting: Cinematic, warm bronze rim light
        - Composition: Clean, modern, slight 3D perspective if devices shown
        - NO text overlays, NO watermarks, NO logos, NO brand names
        - 16:9 aspect ratio
        """
        
        response = client.models.generate_images(
            model='imagen-4.0-ultra-generate-001',
            prompt=full_prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="16:9",
            )
        )
        
        if not response.generated_images:
            logger.error("Imagen returned no images")
            return None
        
        # Convert to WebP
        img_bytes = response.generated_images[0].image.image_bytes
        img = Image.open(io.BytesIO(img_bytes))
        webp_buffer = io.BytesIO()
        img.save(webp_buffer, "WEBP", quality=85)
        webp_buffer.seek(0)
        
        # Upload to Firebase Storage
        bucket = storage.bucket(bucket_name)
        blob_path = f"blog/{slug}.webp"
        blob = bucket.blob(blob_path)
        blob.upload_from_file(webp_buffer, content_type="image/webp")

        # Build the Firebase Storage REST download URL.
        # This works with Firebase Storage security rules (allow read: if true for /blog/)
        # without requiring object-level ACLs (which fail on uniform-access buckets).
        encoded_path = quote(blob_path, safe="")
        download_url = (
            f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}"
            f"/o/{encoded_path}?alt=media"
        )
        logger.info(f"Image uploaded: {download_url}")
        return download_url

    except Exception as e:
        logger.error(f"Image generation/upload failed: {e}\n{traceback.format_exc()}")
        return None


# ─── Revalidation ─────────────────────────────────────────────────────────────

def trigger_revalidation(slug: str) -> None:
    """Notify Next.js to revalidate the blog pages."""
    revalidate_url = (os.environ.get("REVALIDATE_URL") or "").strip()
    revalidate_secret = (os.environ.get("REVALIDATE_SECRET") or "").strip()
    
    if not revalidate_url or not revalidate_secret:
        logger.warning("REVALIDATE_URL or REVALIDATE_SECRET not set, skipping revalidation")
        return
    
    try:
        response = requests.post(
            revalidate_url,
            json={"secret": revalidate_secret, "slug": slug, "type": "blog"},
            timeout=15,
        )
        if response.status_code == 200:
            logger.info(f"Revalidation triggered for /blog/{slug}")
        else:
            logger.warning(f"Revalidation returned {response.status_code}: {response.text}")
    except Exception as e:
        logger.warning(f"Revalidation request failed (non-fatal): {e}")


# ─── Main Scheduled Function ───────────────────────────────────────────────────

@scheduler_fn.on_schedule(
    schedule="0 0 * * *",
    timezone="Asia/Amman",
    memory=512,
    timeout_sec=540,
    secrets=["GEMINI_API_KEY", "REVALIDATE_SECRET", "REVALIDATE_URL", "STORAGE_BUCKET"],
)
def generate_blog_post(event: scheduler_fn.ScheduledEvent) -> None:
    """
    Main entry point. Runs every 48 hours to publish a new bilingual blog post.
    """
    run_id = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    log_ref = get_db().collection("blog_generation_log").document(run_id)
    
    log_ref.set({
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "status": "running",
    })

    topic_ref = None
    try:
        # 1. Get existing slugs to avoid duplicates
        existing_docs = get_db().collection("blog_posts").select(["slug"]).get()
        existing_slugs = [doc.to_dict().get("slug", "") for doc in existing_docs]
        logger.info(f"Found {len(existing_slugs)} existing posts")
        
        # 2. Get next topic from backlog
        topic = get_or_create_topic(existing_slugs)
        logger.info(f"Selected topic: {topic['topic']}")

        # Mark topic as processing immediately to prevent duplicate posts on concurrent runs
        topic_ref = topic["ref"]
        topic_ref.update({"status": "processing"})

        # Small pause before calling Gemini
        time.sleep(2)

        # 3. Generate bilingual content
        post_data = generate_blog_content(topic)
        slug = post_data["slug"]
        
        # Check slug uniqueness
        if slug in existing_slugs:
            slug = f"{slug}-2"
        
        # Small pause before image generation
        time.sleep(3)
        
        # 4. Generate and upload featured image
        image_url = generate_and_upload_image(post_data.get("imagePrompt", ""), slug)
        
        # 5. Save post to Firestore
        post_doc = {
            "slug": slug,
            "status": "published",
            "publishedAt": datetime.now(timezone.utc).isoformat(),
            "featuredImage": image_url,
            "tags": post_data.get("tags", []),
            "category": post_data.get("category", "General"),
            "targetKeyword": post_data.get("targetKeyword", ""),
            "readingTime": post_data.get("readingTime", 7),
            "en": post_data["en"],
            "ar": post_data["ar"],
            "generatedBy": "cloud_function",
            "generationRunId": run_id,
        }
        
        get_db().collection("blog_posts").document().set(post_doc)
        logger.info(f"✅ Published post: {slug}")
        
        # 6. Mark topic as used
        topic["ref"].update({"status": "used", "usedAt": datetime.now(timezone.utc).isoformat()})
        
        # 7. Trigger Next.js revalidation
        trigger_revalidation(slug)
        
        # 8. Update log
        log_ref.update({
            "status": "success",
            "slug": slug,
            "title": post_data["en"]["title"],
            "imageGenerated": image_url is not None,
            "completedAt": datetime.now(timezone.utc).isoformat(),
        })
        
        logger.info(f"✅ Blog generation complete: {post_data['en']['title']}")
        
    except Exception as e:
        logger.error(f"❌ Blog generation failed: {e}", exc_info=True)
        # Mark topic as failed so it can be retried
        if topic_ref is not None:
            try:
                topic_ref.update({"status": "failed", "failedAt": datetime.now(timezone.utc).isoformat()})
            except Exception as mark_err:
                logger.warning(f"Could not mark topic as failed: {mark_err}")
        log_ref.update({
            "status": "failed",
            "error": str(e),
            "completedAt": datetime.now(timezone.utc).isoformat(),
        })
        raise


# ─── Manual HTTP Trigger (for initial testing — delete after use) ──────────────

@https_fn.on_request(
    memory=512,
    timeout_sec=540,
    secrets=["GEMINI_API_KEY", "REVALIDATE_SECRET", "REVALIDATE_URL", "STORAGE_BUCKET"],
)
def generate_blog_post_manual(req: https_fn.Request) -> https_fn.Response:
    """
    HTTP trigger for manually firing blog generation.
    Protect with a secret token in the request header.
    DELETE THIS FUNCTION after initial testing.

    Usage: curl -X POST https://<region>-aviniti-website.cloudfunctions.net/generate_blog_post_manual \\
           -H "X-Trigger-Secret: <REVALIDATE_SECRET>"
    """
    secret = req.headers.get("X-Trigger-Secret", "").strip()
    revalidate_secret = (os.environ.get("REVALIDATE_SECRET") or "").strip()
    if not secret or not revalidate_secret or secret != revalidate_secret:
        return https_fn.Response("Unauthorized", status=401)

    run_id = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S") + "_manual"
    log_ref = get_db().collection("blog_generation_log").document(run_id)
    log_ref.set({"startedAt": datetime.now(timezone.utc).isoformat(), "status": "running", "trigger": "manual"})

    try:
        existing_docs = get_db().collection("blog_posts").select(["slug"]).get()
        existing_slugs = [doc.to_dict().get("slug", "") for doc in existing_docs]
        topic = get_or_create_topic(existing_slugs)
        time.sleep(2)
        post_data = generate_blog_content(topic)
        slug = post_data["slug"]
        if slug in existing_slugs:
            slug = f"{slug}-2"
        time.sleep(3)
        image_url = generate_and_upload_image(post_data.get("imagePrompt", ""), slug)
        post_doc = {
            "slug": slug, "status": "published",
            "publishedAt": datetime.now(timezone.utc).isoformat(),
            "featuredImage": image_url,
            "tags": post_data.get("tags", []),
            "category": post_data.get("category", "General"),
            "targetKeyword": post_data.get("targetKeyword", ""),
            "readingTime": post_data.get("readingTime", 7),
            "en": post_data["en"], "ar": post_data["ar"],
            "generatedBy": "manual_http_trigger",
            "generationRunId": run_id,
        }
        get_db().collection("blog_posts").document().set(post_doc)
        topic["ref"].update({"status": "used", "usedAt": datetime.now(timezone.utc).isoformat()})
        trigger_revalidation(slug)
        log_ref.update({"status": "success", "slug": slug, "title": post_data["en"]["title"], "completedAt": datetime.now(timezone.utc).isoformat()})
        return https_fn.Response(f"✅ Published: {slug}", status=200)
    except Exception as e:
        log_ref.update({"status": "failed", "error": str(e), "completedAt": datetime.now(timezone.utc).isoformat()})
        return https_fn.Response(f"❌ Failed: {str(e)}", status=500)
