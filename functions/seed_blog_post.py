"""
One-time seed script: adds the sample "App Development Cost Jordan 2025" 
blog post to Firestore so we can see the blog page working immediately.

Usage:
  pip install firebase-admin --break-system-packages
  python seed_blog_post.py

Requires GOOGLE_APPLICATION_CREDENTIALS or firebase-adminsdk JSON in same dir.
OR set FIREBASE_SERVICE_ACCOUNT_PATH env var.
"""

import os
import sys
import json
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, firestore

# ─── Init Firebase ─────────────────────────────────────────────────────────────
service_account_path = os.environ.get(
    "FIREBASE_SERVICE_ACCOUNT_PATH",
    "firebase-service-account.json"
)

if os.path.exists(service_account_path):
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred)
else:
    # Try application default credentials (works if gcloud is set up)
    firebase_admin.initialize_app()

db = firestore.client()

# ─── Blog Post Data ────────────────────────────────────────────────────────────
POST = {
    "slug": "app-development-cost-jordan-2025",
    "status": "published",
    "publishedAt": "2025-02-22T10:00:00Z",
    "featuredImage": None,  # Will be updated once image is provided
    "tags": ["app development", "Jordan", "cost", "mobile app", "startup"],
    "category": "App Development",
    "targetKeyword": "app development cost Jordan",
    "readingTime": 7,
    "generatedBy": "seed_script",
    "en": {
        "title": "How Much Does It Cost to Build an App in Jordan? (2025 Complete Guide)",
        "excerpt": "Real 2025 pricing for mobile and web app development in Jordan — broken down by app type, complexity, and what actually drives the cost up.",
        "metaDescription": "Wondering what app development costs in Jordan in 2025? Get real pricing breakdowns by app type, plus an instant AI estimate for your specific project.",
        "content": """# How Much Does It Cost to Build an App in Jordan? (2025 Complete Guide)

If you've ever tried to get a straight answer on app development pricing in Jordan, you already know the problem: most agencies either won't quote you without a lengthy discovery call, or they give you a number so vague it's useless.

This guide changes that. We'll break down exactly what drives app development costs in the Jordanian market, give you real price ranges by project type, and show you how to get an accurate estimate for your specific idea before spending a single dinar.

---

## Why App Development Costs Vary So Much

Two apps that look identical on the surface can cost 3× as much as each other. The reason almost always comes down to four factors:

**1. Complexity of features**
A basic app with login, a profile, and a feed is fundamentally different from an app with real-time GPS tracking, payment processing, and AI-powered recommendations — even if both look "simple" from the outside.

**2. Platform (iOS, Android, or both)**
Building natively for both platforms roughly doubles development time. A cross-platform approach using React Native or Flutter reduces this, but adds its own tradeoffs in performance and custom UI.

**3. Backend and integrations**
Does your app need a custom admin dashboard? Integration with payment gateways like Stripe or local Jordan payment providers? Third-party APIs? Each one adds scope.

**4. Who builds it**
A solo freelancer in Amman, a mid-size Jordanian agency, and a product-focused development company all have different hourly rates, processes, and risk profiles.

---

## Real Price Ranges in Jordan (2025)

These are honest estimates based on the Jordanian market — not inflated international numbers.

### Simple MVP App (1–2 core features)
**JOD 3,000 – 8,000 / $4,200 – $11,000**

Think: a booking app for a single business, a basic e-commerce catalog, or an internal tool for a small team. No complex backend, minimal third-party integrations.

*Timeline: 6–10 weeks*

### Mid-Complexity App (full feature set, custom backend)
**JOD 8,000 – 25,000 / $11,000 – $35,000**

This covers most serious business apps: delivery platforms, clinic management systems, loyalty apps, marketplaces with two user types (buyer + seller), or apps with real-time features.

*Timeline: 3–5 months*

### Complex / AI-Powered App (custom algorithms, large scale)
**JOD 25,000 – 80,000+ / $35,000 – $110,000+**

AI recommendation engines, large multi-vendor platforms, apps processing high transaction volumes, or anything with custom machine learning components.

*Timeline: 6–12+ months*

---

## The Hidden Costs Nobody Warns You About

The build cost is just one part of the total investment. Factor these in before you commit to a budget:

- **App Store fees:** Apple charges $99/year; Google charges a one-time $25
- **Hosting and infrastructure:** A Firebase or AWS setup for a mid-size app runs JOD 50–300/month depending on traffic
- **Maintenance:** Budget 15–20% of the initial build cost annually for bug fixes, OS updates, and security patches
- **Design:** If UI/UX design isn't included in your quote, add JOD 1,500–5,000 for a professional interface
- **Post-launch marketing:** The best app in the world needs users — factor in acquisition costs from day one

---

## Freelancer vs Agency vs Product Studio: What's Right for You?

| | Freelancer | Agency | Product Studio |
|---|---|---|---|
| **Cost** | Lowest | Mid–High | Mid–High |
| **Speed** | Varies | Moderate | Fast |
| **Risk** | Higher | Lower | Low |
| **Accountability** | Low | Medium | High |
| **Best for** | Simple MVP | Established businesses | Startups & scale-ups |

A freelancer might save you JOD 3,000 upfront but cost you twice that in fixes and delays. For anything beyond a simple prototype, a dedicated team with a structured process is worth the difference.

---

## How to Get an Accurate Estimate for Your Idea

The fastest way to understand what your specific project would cost is to describe it and let AI do the analysis.

Aviniti's **Get AI Estimate** tool takes your idea as a plain-language description and returns a detailed cost breakdown, timeline estimate, and recommended tech stack — in about 60 seconds, completely free.

👉 [Get your instant AI estimate →](/get-estimate)

You can also start with the **Idea Lab** if you're still shaping your concept and want to validate it before thinking about budget.

👉 [Explore the Idea Lab →](/idea-lab)

---

## Frequently Asked Questions

**Can I build an app for under JOD 2,000 in Jordan?**
Technically yes, but the result will be a very limited prototype, not a production-ready product. For anything you'd put in front of real customers, JOD 4,000–6,000 is a realistic floor for a focused MVP.

**Is it cheaper to build a web app than a mobile app?**
Often yes — a web app avoids platform-specific development and App Store submission. For many business tools, a responsive web app delivers 90% of the value at 60% of the cost.

**How do I protect my idea when sharing it with developers?**
Ask any development partner to sign an NDA before sharing detailed specifications. Reputable companies will do this without hesitation.

**What's the best way to reduce costs without cutting quality?**
Start with a focused MVP — one user type, one core workflow, no nice-to-haves. Validate with real users before building everything. Every feature you remove from version one is money you keep in your pocket until you know it's needed.

---

## Bottom Line

App development in Jordan in 2025 ranges from JOD 3,000 for a basic MVP to JOD 80,000+ for a complex AI-powered platform. The number that matters for *your* project depends entirely on your feature set, your platform targets, and who you partner with.

The best next step is a specific estimate for your specific idea — not a generic range from a blog post.

[Get your free AI-powered estimate in 60 seconds →](/get-estimate)"""
    },
    "ar": {
        "title": "كم تكلفة تطوير تطبيق في الأردن؟ (دليل شامل 2025)",
        "excerpt": "أسعار حقيقية لتطوير تطبيقات الموبايل والويب في الأردن لعام 2025 — مصنّفة حسب نوع التطبيق ودرجة التعقيد، مع شرح لأبرز العوامل المؤثرة في التكلفة.",
        "metaDescription": "تعرّف على تكلفة تطوير التطبيقات في الأردن 2025، مع تفاصيل الأسعار حسب نوع المشروع، والعوامل التي تحدد ميزانيتك الحقيقية.",
        "content": """# كم تكلفة تطوير تطبيق في الأردن؟ (دليل شامل 2025)

إن كنت قد حاولت الحصول على رقم واضح لتكلفة تطوير تطبيق في الأردن، فأنت تعرف المشكلة جيداً: معظم الشركات إما تتجنب الإجابة المباشرة قبل اجتماعات مطوّلة، أو تعطيك أرقاماً مبهمة لا تفيدك في شيء.

هذا الدليل يغيّر ذلك. سنشرح بالتفصيل ما الذي يحدد تكلفة التطوير في السوق الأردني، مع نطاقات سعرية حقيقية لكل نوع من المشاريع، وطريقة للحصول على تقدير دقيق لفكرتك تحديداً — قبل أن تُنفق ديناراً واحداً.

---

## لماذا تتفاوت تكاليف تطوير التطبيقات بهذا الشكل؟

تطبيقان يبدوان متشابهَين قد يختلفان في التكلفة بمقدار ثلاثة أضعاف. السبب دائماً يعود إلى أربعة عوامل رئيسية:

**١. تعقيد الميزات**
تطبيق بسيط يحتوي على تسجيل الدخول والملف الشخصي وعرض المحتوى يختلف جذرياً عن تطبيق يشمل تتبع الموقع الفوري، وبوابات الدفع، وتوصيات مدعومة بالذكاء الاصطناعي.

**٢. المنصة (iOS أو Android أو كلاهما)**
بناء تطبيق أصيل لكلتا المنصتَين يُضاعف وقت التطوير تقريباً. التطوير عبر منصات مشتركة كـ React Native أو Flutter يُخفض التكلفة، لكنه يأتي بتنازلات خاصة به.

**٣. الخادم والتكاملات**
هل يحتاج تطبيقك إلى لوحة تحكم مخصصة؟ أو تكامل مع بوابات دفع محلية أردنية؟ كل عنصر يُضيف نطاقاً أكبر للمشروع.

**٤. مَن يبني التطبيق**
مطوّر مستقل في عمّان، وشركة وساطة متوسطة الحجم، واستوديو منتج متخصص — كل منهم يمتلك أسعاراً وعمليات ومستوى مختلفاً من الالتزام.

---

## نطاقات الأسعار الحقيقية في الأردن (2025)

هذه تقديرات واقعية مبنية على السوق الأردني — لا أرقام دولية مبالغ فيها.

### تطبيق MVP بسيط (١–٢ ميزة أساسية)
**٣٠٠٠ – ٨٠٠٠ دينار أردني / ٤٢٠٠ – ١١٠٠٠ دولار**

مثل: تطبيق حجز لمشروع واحد، أو كتالوج تجارة إلكترونية بسيط، أو أداة داخلية لفريق صغير.

*المدة الزمنية: ٦–١٠ أسابيع*

### تطبيق متوسط التعقيد (مجموعة ميزات كاملة، خادم مخصص)
**٨٠٠٠ – ٢٥٠٠٠ دينار أردني / ١١٠٠٠ – ٣٥٠٠٠ دولار**

يشمل معظم التطبيقات التجارية الجادة: منصات توصيل، وأنظمة إدارة عيادات، وتطبيقات ولاء، وأسواق إلكترونية.

*المدة الزمنية: ٣–٥ أشهر*

### تطبيق معقد / مدعوم بالذكاء الاصطناعي
**٢٥٠٠٠ – ٨٠٠٠٠+ دينار أردني / ٣٥٠٠٠ – ١١٠٠٠٠+ دولار**

محركات توصيات ذكاء اصطناعي، منصات متعددة البائعين، أو تطبيقات بمكونات تعلم آلي مخصصة.

*المدة الزمنية: ٦–١٢+ شهراً*

---

## التكاليف الخفية التي لا يخبرك بها أحد

- **رسوم متاجر التطبيقات:** Apple تطلب ٩٩ دولاراً سنوياً، وGoogle رسماً لمرة واحدة بقيمة ٢٥ دولاراً
- **الاستضافة والبنية التحتية:** ٥٠–٣٠٠ دينار شهرياً حسب حجم الزيارات
- **الصيانة:** ١٥–٢٠٪ من تكلفة البناء الأولية سنوياً
- **التصميم:** ١٥٠٠–٥٠٠٠ دينار لواجهة احترافية إن لم تكن مشمولة
- **التسويق بعد الإطلاق:** احسب تكاليف الاستقطاب منذ اليوم الأول

---

## مستقل أم شركة أم استوديو؟

| | مطوّر مستقل | شركة | استوديو منتج |
|---|---|---|---|
| **التكلفة** | الأدنى | متوسطة | متوسطة |
| **السرعة** | متفاوتة | معتدلة | سريعة |
| **المخاطرة** | أعلى | منخفضة | منخفضة جداً |
| **الأنسب لـ** | نموذج أولي | شركات راسخة | الشركات الناشئة |

---

## كيف تحصل على تقدير دقيق لفكرتك؟

أداة **احصل على تقدير بالذكاء الاصطناعي** من Aviniti تأخذ وصفاً بالعربية أو الإنجليزية وتعيد إليك تفصيلاً دقيقاً للتكلفة، وتقديراً للجدول الزمني — في ٦٠ ثانية، مجاناً تاماً.

👉 [احصل على تقديرك الفوري ←](/get-estimate)

وإن كنت لا تزال في مرحلة تشكيل الفكرة، ابدأ بـ **مختبر الأفكار** للتحقق من قابليتها للتطبيق.

👉 [استكشف مختبر الأفكار ←](/idea-lab)

---

## أسئلة شائعة

**هل يمكن بناء تطبيق بأقل من ٢٠٠٠ دينار أردني؟**
من الناحية التقنية نعم، لكن الناتج سيكون نموذجاً أولياً محدوداً جداً. لأي شيء تعرضه على عملاء، ٤٠٠٠–٦٠٠٠ دينار هو الحد الأدنى الواقعي.

**هل تطبيق الويب أرخص من تطبيق الموبايل؟**
في الغالب نعم — تطبيق الويب يتجنب تطوير كل منصة على حدة. لكثير من الأدوات التجارية، يقدّم تطبيق الويب المتجاوب ٩٠٪ من القيمة بـ ٦٠٪ من التكلفة.

**كيف أحمي فكرتي عند التواصل مع المطورين؟**
اطلب توقيع اتفاقية عدم إفصاح قبل مشاركة المواصفات التفصيلية. الشركات ذات السمعة الجيدة لن تتردد في ذلك.

**ما أفضل طريقة لتخفيض التكاليف دون المساس بالجودة؟**
ابدأ بـ MVP مركّز — مستخدم واحد، مسار عمل أساسي واحد، بدون إضافات. تحقق من الفكرة مع مستخدمين حقيقيين قبل بناء كل شيء.

---

## الخلاصة

تطوير التطبيقات في الأردن عام 2025 يتراوح بين ٣٠٠٠ دينار لـ MVP بسيط، و٨٠٠٠٠ دينار أو أكثر لمنصة معقدة مدعومة بالذكاء الاصطناعي.

[احصل على تقديرك المجاني بالذكاء الاصطناعي في ٦٠ ثانية ←](/get-estimate)"""
    }
}

def seed():
    # Check if post already exists
    existing = db.collection("blog_posts").where("slug", "==", POST["slug"]).limit(1).get()
    if existing:
        print(f"⚠️  Post '{POST['slug']}' already exists. Skipping.")
        return

    db.collection("blog_posts").document().set(POST)
    print(f"✅ Seeded post: {POST['en']['title']}")
    print(f"   Slug: {POST['slug']}")
    print(f"   Note: featuredImage is null — update it once the image is generated")

if __name__ == "__main__":
    seed()
