# da-tuition-website

## Current State
**Last session**: 2026-04-08 - SEO Phase 3a foundations shipped (4702d37 + 19c0a4a): /privacy-policy page, Hero CTA fix, GBP/consent docs, inert GSC/Bing/GA4 placeholders. T1 closed earlier in session. Discovered datuition.com.au is intentionally pre-launch (Vercel alias is current target).
**Next action**: Wait for Jared's DNS launch + Phase 3a manual handoffs (GSC verification value, Bing value, GA4 measurement ID, GBP admin access). Can also tackle T2/T3/T4 in parallel.

---

## Active Tickets
<!-- Lightweight tracking - full details only when working on ticket -->
<!-- Format: | ID | Title | Status | Next Step | -->

| ID | Title | Status | Next Step |
|----|-------|--------|-----------|
| T2 | Lint backlog cleanup (23 pre-existing errors) | backlog | Decide priority; mostly ArticleView any-types + shadcn empty-interface |
| T3 | Draft /terms-of-service page (footer link is dead) | backlog | Mirror Privacy Policy structure; cover enrolment, payment, cancellation, IP, liability |
| T4 | Replace placeholder ABN in footer | backlog | FooterNew.tsx:221 ships `ABN: 58 123 456 789` (sequential placeholder digits) to production. Legal/trust risk on a site collecting parent data. Need real ABN from Jared. |

### Ticket #T2 AC
- [ ] `pages/ArticleView.tsx` — replace 17 `no-explicit-any` with proper types
- [ ] `components/ui/*` — fix 3 `no-empty-object-type` errors in shadcn primitives (command.tsx, textarea.tsx, etc.)
- [ ] `tailwind.config.ts` — replace `require()` with ES import (`no-require-imports`)
- [ ] Resolve 11 `react-refresh/only-export-components` warnings (FAQ.tsx, HSC.tsx, etc.) or document as expected
- [ ] `npm run lint` exits 0

**Statuses:** `backlog` → `ready` → `active` → `done`

---

## Blocked / Waiting
<!-- Items that can't proceed -->
<!-- Format: - [ID] Title - Blocked on: [reason] -->

---

## Recently Completed
<!-- Last 5 completed items - older ones can be deleted -->
<!-- Format: - [DATE] [ID] Title -->
- [2026-04-08] SEO Phase 3a foundations (4702d37 + 19c0a4a): /privacy-policy page, Hero CTA fix, GBP/consent docs, inert GSC/Bing/GA4 placeholders, business-info refactor
- [2026-04-08] T1 Mobile optimization for entire website (verified done in commit ef66ff7, 2026-03-31)

---

## Gotchas
<!-- Things that catch you out in this project -->
- **datuition.com.au is intentionally pre-launch** — DNS still on GoDaddy with expired self-signed cert. Vercel alias (`https://da-tuition-website.vercel.app`) is the current live target. Sitemap/schema/canonical URLs forward-point at the canonical domain as launch prep — do NOT change them. Smoke testing the canonical will fail with TLS errors until DNS launches. (See `~/.claude/projects/.../memory/project_dns_pre_launch.md`)
- **Phase 3a meta tags are inert HTML comments** in `index.html` — uncomment + paste real values when GSC/Bing/GA4 IDs land. Workflow documented in `docs/seo/phase-3a-handoff.md`.
- **Homepage hero stats come from `src/data/site-stats.ts`, not `src/components/Hero.tsx`** — the homepage renders an inline `HeroTransparent` in `src/pages/Index.tsx`. If the homepage still shows `450 families`, update `siteStats.reviewCount`; Vite HMR was verified working on 2026-05-30.

---

## Decisions
<!-- Key decisions with brief rationale -->

---

## Session Log
<!-- Last 3 sessions only - keeps context fresh -->
<!-- Format: - [DATE]: Summary | Next -->
- [2026-05-30]: Verified Vite HMR works. Homepage `450 families` text comes from `src/data/site-stats.ts` via inline `HeroTransparent` in `src/pages/Index.tsx`; `src/components/Hero.tsx` is not the rendered homepage hero. Updated session shortcut scripts so Start Session pulls latest changes and starts Vite, and End Session validates/commits/pulls-rebases/pushes. | Next: use Start Session -> edit -> End Session for team workflow; decide whether `siteStats.reviewCount` should become `999`.
- [2026-04-08]: SEO Phase 3a foundations shipped (4702d37 + 19c0a4a). Privacy policy live, Hero CTA fixed, GBP/consent docs written, inert GSC/Bing/GA4 placeholders staged. T1 closed (already shipped in ef66ff7). T2/T3/T4 opened. Discovered datuition.com.au pre-launch state. | Next: wait on Jared for DNS launch + Phase 3a handoffs, or tackle T2/T3/T4
- [2026-04-08 earlier]: CEO-led verification of #T1 — found all 6 mobile fixes already shipped in ef66ff7 (2026-03-31). Closed T1, opened T2 for lint backlog. | Next: T2 when prioritized






<!-- compaction-checkpoint-start -->
## Pre-Compaction Checkpoint
**When**: 2026-03-31 10:26:11 | **Branch**: main | **Activity**: 2 msgs, 0
0 tools, 0
0 files

**Recent work**:
- ### [10:21:11] 💬 User Message
- ### [10:21:49] 💬 User Message

**Modified files**:
- 

**Dirty files** (46): AGENTS.md,src/App.tsx,src/components/AwardRecognition.tsx,src/components/AwardsSection.tsx,src/components/Contact.tsx

> Resume context: Read this section + git diff + recent session log to reconstruct state.
<!-- compaction-checkpoint-end -->

## Imported Claude Cowork project instructions
