# SEO Phase 3a — Off-Page Foundations Handoff

Manual web-UI steps Jared needs to perform to unlock Phase 3a. Each step produces a value (verification string or measurement ID) that gets pasted back to Claude, who wires it into `index.html` or component code.

> **Status:** placeholder code is already staged in `index.html` with `TODO_GSC_VERIFICATION_STRING`. Swap in the real value when you complete Step 1.

---

## Step 1 — Google Search Console (HTML tag verification)

1. Open https://search.google.com/search-console signed in to **the Google account that owns the DA Tuition domain/business**.
2. Top-left dropdown → **Add property** → **URL prefix** (not Domain — Domain method requires DNS, HTML-tag is faster).
3. Enter exactly: `https://datuition.com.au` → **Continue**.
4. Expand **HTML tag** under "Other verification methods".
5. You'll see a meta tag like:
   ```html
   <meta name="google-site-verification" content="abcDEF123xyz...456" />
   ```
6. Copy the **content value only** (the string between the quotes).
7. **Don't click "Verify" yet.** Leave the GSC tab open.
8. Paste the value to Claude → Claude swaps the placeholder in `index.html` → push/deploy → wait for Vercel → click **Verify** in GSC.
9. Once verified: in GSC sidebar → **Sitemaps** → Add → enter `sitemap.xml` → Submit. (URL submitted will be `https://datuition.com.au/sitemap.xml`.)

**Owns:** Jared (steps 1-7, 9), Claude (step 8 wiring).

---

## Step 2 — Bing Webmaster Tools (Meta tag verification)

1. Open https://www.bing.com/webmasters and sign in.
2. **Add a Site** → enter `https://datuition.com.au`.
3. Choose **Meta tag** verification method.
4. You'll see a tag like:
   ```html
   <meta name="msvalidate.01" content="ABC123..." />
   ```
5. Copy the content value, paste to Claude.
6. After Claude wires it and you redeploy → click **Verify** in Bing Webmaster.
7. Once verified: **Sitemaps** → Submit `https://datuition.com.au/sitemap.xml`.

**Tip:** Bing also offers "Import from GSC" — if Step 1 is done, you can skip steps 1-6 and just import.

---

## Step 3 — Google Analytics 4 (GA4)

1. Open https://analytics.google.com signed in to the right account.
2. Admin (gear icon, bottom-left) → **Create Property** → name it "DA Tuition" → set timezone Australia/Sydney, currency AUD.
3. Property → **Data Streams** → Add stream → **Web** → `https://datuition.com.au` → name "DA Tuition Production".
4. Copy the **Measurement ID** — looks like `G-XXXXXXXXXX`.
5. Paste to Claude → Claude adds the gtag snippet to `index.html` and wires conversion events on the Book Assessment CTA buttons.
6. After deploy: in GA4 → **Admin → DebugView** → click any Book Assessment button on the live site → confirm `book_assessment_click` event appears.
7. In GA4 → **Admin → Events** → mark `book_assessment_click` as a **Key Event** (formerly "Conversion") so it counts in funnel reports.

**Owns:** Jared (steps 1-4, 6-7), Claude (step 5 wiring).

---

## Step 4 — Google Business Profile audit (no code, audit only)

1. Confirm you have admin access at https://business.google.com.
2. Once access is confirmed, ask Claude for the GBP audit checklist. Categories: NAP consistency, hours, photos, services list, posts, Q&A, review responses, attributes (e.g. "wheelchair accessible", "accepts new students").
3. GBP changes are made in the GBP UI directly — no repo changes needed unless we discover a NAP mismatch with the website.

**Owns:** Jared (everything), Claude (audit checklist + flagging code-side fixes).

---

## What's already done (Phases 1 + 2)

- ✅ `sitemap.xml` generated at build time, 79 URLs, referenced from `robots.txt`
- ✅ Per-page meta titles + descriptions + canonicals via `SEO.tsx` component
- ✅ JSON-LD: `Organization`, `LocalBusiness`, `EducationalOrganization`, `FAQPage`, `Breadcrumb`, `AggregateRating`, per-suburb `LocalBusiness` with `areaServed`
- ✅ 5 suburb landing pages: Cabramatta, Fairfield, Canley Vale, Smithfield, Lansvale
- ✅ Crawler-fallback meta in `index.html` (og:url, og:locale, theme-color, canonical)
