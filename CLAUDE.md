# Aviniti Website — Project Rules

## Internationalization (i18n) — Mandatory for All Work

### Core Rules
- **Every piece of UI text, label, heading, button, placeholder, tooltip, error message, success message, meta tag, alt text, and aria-label MUST exist in both English (en) and Arabic (ar).**
- Never hardcode strings in components. Always use the translation system (`next-intl` with `useTranslations` hook).
- When creating ANY new component, page, section, or feature — translations for both EN and AR must be added in the same PR/commit. No exceptions.
- All translation keys must follow a consistent namespace pattern: `section.subsection.key` (e.g., `hero.title`, `services.ai.description`, `footer.copyright`).
- Translation files live in `/messages/en/*.json` and `/messages/ar/*.json` (namespace-per-file pattern).

### RTL / LTR Layout Rules
- When the active language is **Arabic (ar)**: the entire layout MUST be **RTL (right-to-left)**.
- When the active language is **English (en)**: the entire layout MUST be **LTR (left-to-right)**.
- Use logical CSS properties instead of physical ones:
  - `margin-inline-start` instead of `margin-left`
  - `padding-inline-end` instead of `padding-right`
  - `inset-inline-start` instead of `left`
  - `border-inline-end` instead of `border-right`
- Use `gap`, `flexbox`, and `grid` which auto-adapt to text direction.
- For icons/arrows that indicate direction (chevrons, arrows, back buttons): these MUST be mirrored in RTL mode.
- Set `dir="rtl"` and `lang="ar"` on the `<html>` tag when Arabic is active, and `dir="ltr"` and `lang="en"` for English.
- Font stack for Arabic: use `'Noto Sans Arabic', 'Tajawal', 'Cairo', sans-serif` — always include an Arabic-optimized font.
- Font stack for English: use the existing project font stack (Inter, Plus Jakarta Sans).
- Test every component in BOTH directions before considering it complete.

### Translation File Structure
- Translations are stored in `/messages/en/*.json` and `/messages/ar/*.json`.
- Each namespace has its own file (e.g., `common.json`, `home.json`, `solutions.json`).
- Namespaces are loaded in `/src/lib/i18n/request.ts`.
- Group translations by page/section for maintainability.
- Arabic translations must be reviewed for proper grammar, formal tone, and industry-appropriate terminology. Use Modern Standard Arabic (MSA) for professional content. For Jordanian market context, use common Jordanian/Levantine phrasing where it feels more natural (e.g., service descriptions, CTAs).

### Language Switcher
- A visible language toggle (EN | عربي) must be accessible from every page, in the header/navbar.
- Language preference should persist across sessions (localStorage or cookie).
- URL structure reflects language: `/en/about` and `/ar/about` (handled by `next-intl` routing).
- Default language: English. Auto-detect browser language if possible.

### SEO & Meta
- Every page must have localized `<title>`, `<meta description>`, and Open Graph tags in both languages.
- Use `hreflang` tags to indicate language alternatives to search engines.
- Localized sitemap entries for both language versions.

### Important i18n Notes
- Arabic text is typically 20-30% longer than English. Account for this in UI layouts — don't use fixed widths that might clip Arabic text.
- Numbers: Use Western numerals (1, 2, 3) not Eastern Arabic numerals (١, ٢, ٣) for the Jordanian market.
- Phone numbers and emails: Keep in LTR direction even within RTL layout using `direction: ltr; unicode-bidi: embed;`.
- Brand name "Aviniti": Keep in English in both versions. Don't transliterate.
- Tagline "Your Ideas, Our Reality": Translate to Arabic — أفكارك، واقعنا.
- Currency: Display in both USD ($) and JOD (د.أ) where relevant.
- Date formats: EN: `MM/DD/YYYY` or `Month DD, YYYY`. AR: `DD/MM/YYYY` or `DD شهر YYYY`.

### AI Tool Output Language Rule
- **All AI tools (Idea Lab, AI Analyzer, Get Estimate, ROI Calculator) MUST generate their output in the same language as the user's input.**
- If the user writes their idea/description in **English** → the AI analysis, results, recommendations, PDF report, and all generated content MUST be in **English**.
- If the user writes their idea/description in **Arabic** → the AI analysis, results, recommendations, PDF report, and all generated content MUST be in **Arabic**.
- This is enforced at the API/prompt level: the Gemini prompt MUST include an instruction like `"Respond in the same language as the user's input"` or detect the input language and set the output language accordingly.
- The UI chrome (buttons, labels, navigation) follows the site locale as usual — but the **AI-generated content** follows the **input language**.
- This rule applies to all AI endpoints: `/api/ai/analyzer`, `/api/ai/estimate`, `/api/ai/idea-lab`, `/api/ai/roi-calculator`.

### Content Strategy Notes
- **Blog posts & case studies**: Will be served from CMS/Firebase — do NOT create static JSON translations for blog/case study content. Only translate the UI shell (page titles, buttons, filters, labels).
- **Legal pages (Privacy Policy, Terms of Service)**: Full bilingual support via static JSON translations.
- **Hero device mockup screens**: Keep in English only (demo visuals, not translated).

---

## Image Generation — Gemini Imagen 4.0 Ultra

### When to Use
Any time new hero images, marketing visuals, or solution mockups are needed for the website. This was used to generate all 8 Ready-Made Solutions hero images and should be reused for blog post featured images, case study visuals, etc.

### API Details
- **API Key**: `REDACTED_API_KEY`
- **Model**: `imagen-4.0-ultra-generate-001`
- **Library**: `google-genai` (Python — `pip install google-genai`)
- **Output format**: WebP (best compression + quality for Next.js Image component)
- **Note**: The API generates PNG natively. Convert to WebP using Pillow (`pip install Pillow`).

### Generation Script Pattern
```python
from google import genai
from google.genai import types
from pathlib import Path
from PIL import Image
import io

client = genai.Client(api_key="REDACTED_API_KEY")

response = client.models.generate_images(
    model='imagen-4.0-ultra-generate-001',
    prompt="Your detailed prompt here",
    config=types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio="16:9",  # Use 16:9 for hero images, 1:1 for thumbnails
    )
)

# Convert to WebP
if response.generated_images:
    img_bytes = response.generated_images[0].image.image_bytes
    img = Image.open(io.BytesIO(img_bytes))
    img.save("output.webp", "WEBP", quality=85)
```

### Design System for Prompts
All image prompts MUST follow the Aviniti design system:
- **Background**: Dark navy blue `#0A1628`
- **Accent color**: Bronze/gold `#C08460`
- **Style**: Professional, clean, modern SaaS tech company aesthetic
- **Device mockups**: Photorealistic with slight 3D perspective
- **Always include**: "No text overlays or watermarks" in the prompt
- **Aspect ratios**: `16:9` for hero/banner images, `1:1` for thumbnails/cards

### Rate Limiting
- Add a 3-second pause (`time.sleep(3)`) between consecutive API calls.
- Batch generations in a single script, don't run them individually.

### File Naming & Location
- **Solutions images**: `/public/Ready-made-solutions/{Solution Name}.webp`
- **Blog images**: `/public/blog/{slug}.webp` (when blog system is built)
- **General marketing**: `/public/images/{descriptive-name}.webp`
- Always use `.webp` extension. Never commit `.png` or `.svg` for AI-generated images.
- Keep file sizes under 200KB per image where possible.

### Cleanup Rules
- Delete generation scripts after use — they are one-time tools, not part of the codebase.
- Never commit API keys in scripts. The key is stored here in CLAUDE.md for reference.
- When regenerating images, delete old files first to avoid stale assets.

---

## Multi-Agent Workflow — Mandatory for All Tasks

### Architecture
- **The main Claude Code window is the ORCHESTRATOR.** It plans, delegates, and coordinates.
- **Always spawn sub-agents for individual tasks.** Each sub-agent handles one focused task with clean, isolated context.
- The orchestrator should NEVER do the actual implementation work itself. It only:
  1. Analyzes the overall task and breaks it into sub-tasks.
  2. Spawns a sub-agent for each sub-task with clear, specific instructions.
  3. Reviews the output of each sub-agent.
  4. Coordinates dependencies between sub-agents.
  5. Validates the final result.

### Rules
- **One agent = one task.** Never overload a single agent with multiple unrelated responsibilities.
- Each sub-agent gets a clean context with ONLY the information it needs — no noise from other tasks.
- Sub-agents should be given explicit file paths, function names, and expected outputs.
- If a task has dependencies (e.g., "translate this section" depends on "extract all strings from this section"), the orchestrator must sequence them correctly.
- Sub-agents report back to the orchestrator, which then decides the next step.

### Example Workflow for Localization
```
Orchestrator:
├── Agent 1: Audit /app/page.tsx → list all hardcoded strings
├── Agent 2: Audit /components/Header.tsx → list all hardcoded strings
├── Agent 3: Create translation keys for Hero section (EN + AR)
├── Agent 4: Refactor Hero component to use i18n keys
├── Agent 5: Create translation keys for Services section (EN + AR)
├── Agent 6: Refactor Services component to use i18n keys
├── Agent 7: Implement RTL layout support
├── Agent 8: Build language switcher component
└── Agent 9: Test all sections in both EN and AR
```

### Benefits
- Clean context = fewer hallucinations and errors.
- Parallel work where possible.
- Easy to retry a single failed sub-task without losing progress on others.
- Each agent's output is reviewable in isolation.
