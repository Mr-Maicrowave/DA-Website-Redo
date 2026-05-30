# Feature Registry — da-tuition-website

Per `magi/rules/project-ops.md`: every user-facing feature MUST have a spec here before session ends.

Counts as a feature: routes, pages, endpoints, cron jobs, UI components with non-trivial behavior, automations.
NOT a feature: refactors, config, docs, dependency bumps, bug fixes to existing specs.

---

## /privacy-policy page

**File:** `src/pages/PrivacyPolicy.tsx`
**Route:** `/privacy-policy` (registered in `src/App.tsx`)
**Sitemap:** `scripts/generate-sitemap.mjs` (priority 0.3, yearly)
**Footer link:** `src/components/FooterNew.tsx` (live `<Link>`)

**Description:** Static privacy policy page covering APP-compliant disclosure of personal information collection, including pre-written GA4 cookie disclosure ready for when GA4 launches.

**Trigger:** User clicks "Privacy Policy" in the footer, or navigates directly to `/privacy-policy`.

**Backend behavior:** None — fully static React page rendered client-side. No API calls, no form submission, no state.

**Frontend behavior:**
- Renders 11 sections: collection scope, collection methods, purpose, storage/protection, reviews/testimonials, GA4 cookies, third-party disclosure, user rights, contact, OAIC complaint path, change history
- Uses standard `<SEO>` component with title "Privacy Policy", canonical `/privacy-policy`
- Last-updated date is hardcoded as `LAST_UPDATED` const at top of file (currently `8 April 2026`)
- Uses standard `NavigationNew` + `FooterNew` layout

**Error case:** None applicable — no failure modes for a static page beyond standard React render errors.

**E2E test scenario:**
1. Navigate to `https://datuition.com.au/privacy-policy`
2. Assert page loads without console errors
3. Assert `<h1>` contains "Privacy Policy"
4. Assert all 11 `<h2>` sections render (1. What we collect through 11. Changes to this policy)
5. Assert `LAST_UPDATED` date is present in the header
6. Assert footer "Privacy Policy" link routes here from any page
7. Assert sitemap.xml contains `<loc>https://datuition.com.au/privacy-policy</loc>`

**Owner:** Jared (content), Claude (page structure)
**Added:** 2026-04-08 as part of SEO Phase 3a (off-page foundations)
