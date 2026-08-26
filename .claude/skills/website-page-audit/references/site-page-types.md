# Site Page Types

Derived from `src/App.tsx` routing, `src/components/NavigationNew.tsx`, and the actual page components — not assumed. Grouped by purpose and user behavior, not by URL.

## Redirect-only routes (not page types)

These exist in `App.tsx` but render nothing of their own — they `<Navigate replace>` to a real page. Resolve to the destination before classifying:

| Route | Redirects to |
|---|---|
| `/interview` | `/principal-reflections` |
| `/reviews` | `/success-stories` |
| `/appreciation-advice` | `/success-stories` |
| `/teachers`, `/our-teachers` | `/find-teacher` |
| `/testimonials` | `/success-stories` |
| `/subjects` | `/subjects/english` |

`/book-intro-calibration` is dev-only (`import.meta.env.DEV` gated, else redirects to `/`) — not a public page; refuse to audit it as one.

---

## 1. Homepage

- **Route:** `/` (`src/pages/Index.tsx`)
- **Audience:** First-time visitors from search/referral/ads; the site's single highest-traffic entry point.
- **Purpose:** Establish credibility and premium positioning fast, then route every visitor segment (by subject, by year group, by "just show me proof") to the right next page.
- **Primary user goal:** "Is this a real, trustworthy, premium tutoring service — worth a few more minutes?"
- **Primary conversion:** Click through to a Service Landing Page, `/success-stories`, or directly to `/book-interview`.
- **Secondary actions:** Scroll through stats (`StatsSection`), reviews carousel, awards, teachers preview.
- **Important content/features:** Hero with video/animation intro (`VisualIntro`), `AwardRecognition`, `GoogleReviewsCarousel`, `TeachersPreview`, animated stat counters with confetti.
- **Failure looks like:** Visitor bounces before understanding what DA Tuition is or who it's for; hero fails to load/animate and page reads broken; no clear path to a subject/program page.
- **Disproportionate dimensions:** First Impression/Wow Factor, Navigation & Journey, Engagement, Brand Consistency.

---

## 2. Service Landing Page

- **Routes:** `/subjects/mathematics`, `/subjects/english`, `/subjects/science`, `/subjects/business-studies`, `/subjects/legal-studies`, `/programs/primary-school`, `/programs/early-years`, `/programs/year-3-4`, `/programs/year-5-6`, `/programs/high-school`, `/programs/hsc` + `/hsc-excellence` (same component, two routes), `/english-sample` (flagged experimental — see note).
- **Audience:** Parents who already know roughly what they need (a subject, or a year group) and are evaluating whether DA Tuition fits.
- **Purpose:** Persuade a specific-need parent that this offering is credible and right for their child.
- **Primary user goal:** "Does DA Tuition actually teach what my child needs, well?"
- **Primary conversion:** `/book-interview` (via in-page CTA / `CTASection`).
- **Secondary actions:** Explore-scroll within the page (subject pages use `SubjectHero`'s scroll-target pattern), cross-link to other subjects/programs, sometimes to `/find-teacher`.
- **Important content/features:** Shared `SubjectHero` banner (English/Maths/Science/Legal/Business all use it), curriculum/approach detail, teacher fit, program-specific proof. Mathematics (`src/pages/subjects/Mathematics.tsx`, ~1,800 lines) is the most heavily invested page on the whole site — interactive `GuidedJourneyPanel`, `ConfidenceJourney`, ambient motion, and an intro-video gate (`MathsIntroVideoGate`) not present on other Service pages.
- **Failure looks like:** Parent can't tell within a few seconds whether this page is for their child's actual need; CTA to book is missing/buried; page makes claims with no supporting proof.
- **Disproportionate dimensions:** Conversion Effectiveness, Content Quality & Persuasion, Trust & Credibility, Clarity & Information Hierarchy.
- **Merge rationale:** Subject pages and Program/HSC pages were evaluated separately and merged into one profile — both sit at the exact same funnel position (a parent with a specific need, evaluating fit, routing to the same `/book-interview` CTA) and share the same content shape (hero → proof → curriculum detail → CTA). The gap between Mathematics.tsx's heavy interactivity and a plainer Program page is a *content-investment* difference the audit will surface as a score gap — it isn't evidence the two need different success criteria.
- **Note on `/english-sample`:** explicitly marked in code as a temporary interactive trial ("Do NOT change this to `<Index />>`"). Audit it under this profile but flag it as non-production/experimental in the summary.

---

## 3. Local SEO Location Page

- **Routes:** `/tutoring-canley-heights`, `/tutoring-cabramatta`, `/tutoring-fairfield`, `/tutoring-canley-vale`, `/tutoring-smithfield`, `/tutoring-lansvale`.
- **Audience:** Local searchers ("tutoring near [suburb]") — high commercial intent, low brand awareness.
- **Purpose:** Rank and convert for a specific suburb; reassure the visitor the service is genuinely local to them.
- **Primary user goal:** "Is there tutoring near me, and is it any good?"
- **Primary conversion:** `/book-interview`, or a phone call.
- **Secondary actions:** Check nearby schools/transport links (both hardcoded per suburb, e.g. `CanleyHeights.tsx`'s `schools`/`transport` arrays).
- **Important content/features:** Shared `LocationHero`, `educationalOrganizationSchema` + `breadcrumbSchema` JSON-LD, suburb-specific school/transport lists.
- **Failure looks like:** Content is close enough to a sibling suburb page to read as duplicate/spun (`Canley Vale High School` appearing verbatim as a "local" school on multiple suburb pages, etc.); business info doesn't match the canonical listing (`src/data/business-info.ts`); page isn't reachable from nav (only `/tutoring-canley-heights` is linked, from the Resources dropdown — the other five are orphaned except via direct/search traffic, which is normal for this page type but worth noting).
- **Disproportionate dimensions:** SEO & Discoverability, Trust & Credibility, Conversion Effectiveness. Content Quality carries specific weight here for cross-page duplication risk, not just per-page quality.

---

## 4. About / Trust / Philosophy Page

- **Routes:** `/why-choose-da`, `/principal-reflections`, `/learning-formats`.
- **Audience:** A parent already interested, doing due diligence before committing.
- **Purpose:** Deepen trust and differentiate DA Tuition's philosophy/approach from generic tutoring.
- **Primary user goal:** "What actually makes this different, and do I believe it?"
- **Primary conversion:** Move on to `/book-interview` or a Service Landing Page — softer, narrative-led push rather than a hard CTA wall.
- **Secondary actions:** Cross-link to teachers (`/find-teacher`), success stories.
- **Important content/features:** Founder/principal voice (`PrincipalReflections`), methodology explanation, format comparison (`LearningFormats`).
- **Failure looks like:** Reads as generic marketing copy indistinguishable from any tutoring competitor; no concrete differentiator; wall of text with no hierarchy.
- **Disproportionate dimensions:** Trust & Credibility, Content Quality & Persuasion, Clarity & Information Hierarchy.

---

## 5. Interactive Tool Page

- **Routes:** `/find-teacher`, `/maths-graph-lab`.
- **Audience:** `/find-teacher` — a parent ready to pick a specific tutor. `/maths-graph-lab` — a current/prospective student (or parent) evaluating the teaching product directly.
- **Purpose:** Complete a real task, not just read/scroll. `/find-teacher` filters a tutor catalogue (`src/data/teacherCatalogue.ts`) by subject; `/maths-graph-lab` is a genuine graphing calculator — expression parsing (`parser.ts`), viewport/zoom (`viewport.ts`), a guided-journey mode with persisted progress (`guided-transformations.ts`, `readGuidedState`/`writeGuidedState`).
- **Primary user goal:** "Let me find/do the specific thing I came here for."
- **Primary conversion:** `/find-teacher` → contact a specific tutor / book. `/maths-graph-lab` → demonstrate teaching quality, indirectly building trust toward booking; it's also a standalone teaching resource that may be used with no booking intent at all.
- **Secondary actions:** Filter switching, pagination (`/find-teacher`'s `PAGE_SIZE`), theme toggle / guided mode toggle (`/maths-graph-lab`).
- **Important content/features:** Search/filter state, empty-state handling, keyboard/touch interaction with graph controls, light/dark theme persistence.
- **Failure looks like:** Filter returns wrong/no results for a valid query; graph fails to render an expression or viewport controls don't respond; guided-journey progress doesn't persist; touch targets too small on mobile for the zoom/pan controls.
- **Disproportionate dimensions:** Usability & Task Completion (dominant), Responsive Design, Accessibility. First Impression/Wow Factor and Brand Consistency are deliberately low-weighted — cinematic spectacle isn't this page's job, task completion is (per the spec's own principle: don't penalize a functional tool for lacking hero-page spectacle).

---

## 6. Social Proof Page

- **Routes:** `/success-stories`, `/testimonials/:slug`.
- **Audience:** A skeptical parent seeking third-party validation before committing.
- **Purpose:** Prove results happened for real families, not just claimed by DA Tuition.
- **Primary user goal:** "Did this actually work for someone like my child?"
- **Primary conversion:** Move to `/book-interview`, having been convinced.
- **Secondary actions:** Read individual stories, browse by category/subject if filterable.
- **Important content/features:** Testimonial carousel/grid on the hub; single-story narrative depth on detail pages.
- **Failure looks like:** Testimonials read as generic/fabricated (no specifics — child's actual result, subject, timeframe); detail page for a slug that doesn't exist silently 404s instead of a clear error.
- **Disproportionate dimensions:** Trust & Credibility (dominant), Content Quality & Persuasion.
- **Merge rationale:** Hub and detail share the same purpose (third-party proof) and the same low-pressure conversion posture; detail pages just go deeper into one story. Splitting them into two profiles would duplicate the same top-two weights for no behavioral difference.

---

## 7. Article / Blog Resource

- **Routes:** `/articles` (index/search), `/articles/:slug` (detail, via `ArticleView.tsx` + `SectionedMarkdown`).
- **Audience:** Organic-search visitors researching a topic (exam tips, parenting/education advice) — often pre-awareness of DA Tuition specifically.
- **Purpose:** Rank for informational search queries, demonstrate expertise, funnel into the brand.
- **Primary user goal:** On the index — find an article relevant to my question. On a detail page — actually get the answer/advice.
- **Primary conversion:** Soft — read to the end, then convert via the `CTASection` embedded at the bottom, or click through to a related Service Landing Page.
- **Secondary actions:** Search/filter by category (index), share (detail).
- **Important content/features:** `articles-index.json` metadata, category-chunked markdown rendering, read-time estimates, featured-article treatment.
- **Failure looks like:** Article content is thin/generic AI-pattern filler with no genuine expertise; search/filter on the index returns nothing for common queries; long-form content has no heading hierarchy so it reads as a wall of text; broken article image or markdown rendering artifact.
- **Disproportionate dimensions:** Content Quality & Persuasion (dominant), SEO & Discoverability, Navigation & User Journey.

---

## 8. FAQ Page

- **Route:** `/faq`.
- **Audience:** A parent with specific unresolved objections (price, scheduling, safety, results) blocking conversion.
- **Purpose:** Remove last-mile objections with accurate, specific answers; win the FAQ-schema rich-result in search.
- **Primary user goal:** Find the one answer that's blocking them from booking.
- **Primary conversion:** `/book-interview`, immediately after their objection is resolved.
- **Secondary actions:** Category filter, popular-question flagging (`popular` field), inline links out to relevant pages (`links` field per FAQ item).
- **Important content/features:** Accordion (`Accordion`/`AccordionItem`), category tabs (`CategoryId` union: start/programs/fees/classes/teachers/results/safety), `faqPageSchema` JSON-LD (must match visible answers — a mismatch is a real defect, not cosmetic).
- **Failure looks like:** An answer is vague/evasive on a genuine objection (fees, safety); category filter hides items instead of properly filtering; JSON-LD schema answer text drifts from the visible accordion answer.
- **Disproportionate dimensions:** Content Quality & Persuasion, Clarity & Information Hierarchy, Usability & Task Completion (the filter/accordion interaction itself).

---

## 9. Booking / Enquiry Form Page

- **Routes:** `/book-interview` (multi-step intake — parent + one-or-more students, hand-rolled `FormErrors` validation, no `react-hook-form`/Zod despite it being installed), `/contact` (single-step enquiry form, posts to `formsubmit.co` via `fetch`, honeypot field `_honey`).
- **Audience:** A parent who has already decided to take action — the highest-intent segment on the whole site.
- **Purpose:** Capture the lead with minimum friction and maximum completion rate.
- **Primary user goal:** Submit my/my child's details and get a response.
- **Primary conversion:** Successful submission — a confirmation state shown **and backed by an actual send/persist call**. A polished "Thank You" screen with no `fetch`/API call behind it is not a conversion; it's a defect wearing a conversion's clothes. Verify the transmission exists before crediting this dimension or this gate.
- **Secondary actions:** Add/remove a student (`/book-interview`'s multi-student flow), pick preferred contact method.
- **Important content/features:** Step progression + validation feedback, submit/loading/error states, honeypot spam guard (`/contact`).
- **Failure looks like:** Any required field's error state is unclear or non-blocking (invalid data submits anyway); step navigation traps the user (can't go back, loses entered data); submission fails with no visible error (`/contact`'s `submitError` state exists — check it's actually surfaced); success state is ambiguous ("did that actually work?").
- **Disproportionate dimensions:** Usability & Task Completion (dominant), Conversion Effectiveness, Accessibility (label/error association, keyboard completability).
- **Merge rationale:** Different step-count and backend, identical job — capture a lead with minimum friction. One profile, applied to both; note in the report if one materially outperforms the other on friction, since they should ideally converge.

---

## 10. Legal / Policy Page

- **Route:** `/privacy-policy`.
- **Audience:** Rare, deliberate visit — usually pre-enrollment due diligence or a regulatory requirement check.
- **Purpose:** Accurately and clearly disclose data practices under the Australian Privacy Act 1988; not a persuasion surface.
- **Primary user goal:** Confirm the business handles personal information appropriately.
- **Primary conversion:** None expected — success is "read and satisfied," not a click.
- **Secondary actions:** None material.
- **Important content/features:** `contactInfo` sourced live from `src/data/business-info.ts` (phone/hours), `LAST_UPDATED` date — check it's actually current, not stale.
- **Failure looks like:** Content contradicts actual business practices/contact info elsewhere on the site; wall of unstructured legal text with no heading navigation; page abandons the site's visual brand entirely (plain `bg-white` div — check whether that reads as "deliberately minimal" or "neglected").
- **Disproportionate dimensions:** Clarity & Information Hierarchy, Content Quality & Persuasion (here meaning accuracy/completeness, not sales copy), Accessibility.

---

## 11. Error Page

- **Route:** catch-all `*` (`src/pages/NotFound.tsx`).
- **Audience:** Anyone who followed a broken/stale link — internal or external.
- **Purpose:** Recover the visit; don't lose the visitor entirely.
- **Primary user goal:** Get back to somewhere useful.
- **Primary conversion:** Click through to `/` (currently the only escape route offered) or, ideally, to a more specific useful destination.
- **Secondary actions:** None currently offered (no search, no nav, no suggested pages).
- **Important content/features:** `noindex` SEO tag (correct), `console.error` logging of the attempted path (dev-facing, not user-facing).
- **Failure looks like:** Already partially true by inspection — the page currently renders **without** `NavigationNew`/`FooterNew`, so a visitor who lands here has no site navigation at all beyond one plain-text home link. Confirm and score this as found; don't pre-assume the severity without checking current behavior against the rest of the site's chrome.
- **Disproportionate dimensions:** Navigation & User Journey (dominant — the entire point of this page), Clarity & Information Hierarchy, Brand Consistency.

---

## Fallback / Default Profile

For any route not covered above (a new page added later, or one of the CLAUDE.md-documented prototype/demo routes like `/color-comparison`, `/plain`, `/prototype/teacher-cards` if the user asks to audit one — note these aren't in the live `App.tsx` route table as of this analysis and may be dead code; verify before auditing). Balanced weighting across all 14 dimensions, no dimension above ~12%. Use this profile and say explicitly that no specific family fit, rather than forcing the page into a mismatched profile.
