# Page-Type Weighting Profiles

Every table sums to exactly 100 (verified with `scripts/calculate_score.py --check-weights`, not by hand). A dimension not listed for a profile is **not scored** for that page type — it's omitted, not zero-padded. Dimension names match `audit-rubric.md`.

## 1. Homepage

| Category | Weight |
|---|---|
| First Impression / Wow Factor | 14 |
| Navigation & User Journey | 10 |
| Engagement & Interaction | 10 |
| Visual Design & Polish | 10 |
| Clarity & Information Hierarchy | 9 |
| Conversion Effectiveness | 9 |
| Trust & Credibility | 8 |
| Responsive Design | 7 |
| Content Quality & Persuasion | 6 |
| Accessibility | 6 |
| Performance & Technical Quality | 6 |
| SEO & Discoverability | 3 |
| Brand Consistency | 2 |

**Why it differs from default:** this is the site's only true "does this feel premium and trustworthy in 5 seconds" page — First Impression and Engagement are weighted well above every other profile. SEO is low because the homepage doesn't need to win a specific search query the way a Location or Article page does; it needs to convert whoever already arrived.

## 2. Service Landing Page

*Applies to:* all `/subjects/*`, all `/programs/*`, `/hsc-excellence`, `/english-sample`.

| Category | Weight |
|---|---|
| Conversion Effectiveness | 16 |
| Content Quality & Persuasion | 14 |
| Trust & Credibility | 12 |
| Clarity & Information Hierarchy | 10 |
| Visual Design & Polish | 8 |
| First Impression / Wow Factor | 7 |
| Responsive Design | 7 |
| Engagement & Interaction | 6 |
| Navigation & User Journey | 6 |
| Accessibility | 5 |
| Performance & Technical Quality | 4 |
| SEO & Discoverability | 3 |
| Brand Consistency | 2 |

**Why it differs from default:** this page's entire job is converting a visitor with a specific, already-identified need — Conversion and persuasive Content Quality dominate. SEO is comparatively low (3) because these pages compete mostly on brand/direct-nav traffic already inside the funnel, not cold search discovery — that job belongs to Location and Article pages.

## 3. Local SEO Location Page

*Applies to:* all `/tutoring-*` routes.

| Category | Weight |
|---|---|
| SEO & Discoverability | 14 |
| Trust & Credibility | 14 |
| Conversion Effectiveness | 14 |
| Content Quality & Persuasion | 12 |
| Clarity & Information Hierarchy | 8 |
| Navigation & User Journey | 6 |
| Visual Design & Polish | 6 |
| Responsive Design | 7 |
| Performance & Technical Quality | 5 |
| Accessibility | 5 |
| First Impression / Wow Factor | 4 |
| Engagement & Interaction | 3 |
| Brand Consistency | 2 |

**Why it differs from default:** these pages exist purely to win a local-intent search query and convert on arrival — SEO, Trust and Conversion are tied at the top. First Impression/Engagement are deliberately low: a suburb landing page isn't trying to be memorable, it's trying to confirm "yes, we're local and legitimate" fast. Content Quality is weighted specifically to catch cross-page duplication risk across the six near-identical siblings, not generic prose quality.

## 4. About / Trust / Philosophy Page

*Applies to:* `/why-choose-da`, `/principal-reflections`, `/learning-formats`.

| Category | Weight |
|---|---|
| Trust & Credibility | 16 |
| Content Quality & Persuasion | 16 |
| Clarity & Information Hierarchy | 10 |
| Conversion Effectiveness | 8 |
| First Impression / Wow Factor | 8 |
| Visual Design & Polish | 8 |
| Navigation & User Journey | 7 |
| Responsive Design | 7 |
| Engagement & Interaction | 6 |
| Accessibility | 5 |
| Performance & Technical Quality | 4 |
| SEO & Discoverability | 3 |
| Brand Consistency | 2 |

**Why it differs from default:** Trust and Content Quality are tied at the top because this page family exists specifically to differentiate DA Tuition's philosophy from generic competitors — if it reads as generic, it has failed at its one job. Conversion is present but deliberately softer (8, vs. 16 on Service Landing Pages) because these are due-diligence pages, not decision-point pages.

## 5. Interactive Tool Page

*Applies to:* `/find-teacher`, `/maths-graph-lab`.

| Category | Weight |
|---|---|
| Usability & Task Completion | 28 |
| Responsive Design | 10 |
| Accessibility | 10 |
| Performance & Technical Quality | 8 |
| Clarity & Information Hierarchy | 8 |
| Conversion Effectiveness | 6 |
| Navigation & User Journey | 6 |
| Engagement & Interaction | 5 |
| Visual Design & Polish | 5 |
| Trust & Credibility | 4 |
| First Impression / Wow Factor | 3 |
| Content Quality & Persuasion | 3 |
| SEO & Discoverability | 2 |
| Brand Consistency | 2 |

**Why it differs from default:** Usability & Task Completion alone outweighs any two other categories combined — these pages exist to let a visitor *do* something (filter a catalogue, graph an expression), and if that fails, nothing else about the page matters. First Impression and Brand Consistency are the lowest of any profile on the site, deliberately: per the spec's own principle, a functional tool shouldn't be penalized for lacking cinematic spectacle if spectacle wouldn't serve its purpose here.

## 6. Social Proof Page

*Applies to:* `/success-stories`, `/testimonials/:slug`.

| Category | Weight |
|---|---|
| Trust & Credibility | 20 |
| Content Quality & Persuasion | 16 |
| Conversion Effectiveness | 8 |
| Visual Design & Polish | 7 |
| Responsive Design | 7 |
| Clarity & Information Hierarchy | 7 |
| First Impression / Wow Factor | 6 |
| Engagement & Interaction | 6 |
| Navigation & User Journey | 6 |
| Accessibility | 5 |
| Performance & Technical Quality | 4 |
| SEO & Discoverability | 4 |
| Brand Consistency | 4 |

**Why it differs from default:** Trust is the single highest weight of any category in any profile on this site (20) — this page family's entire value is third-party proof, and if the testimonials don't read as genuine and specific, the page has no other job to fall back on.

## 7. Article / Blog Resource

*Applies to:* `/articles`, `/articles/:slug`.

| Category | Weight |
|---|---|
| Content Quality & Persuasion | 22 |
| SEO & Discoverability | 14 |
| Navigation & User Journey | 10 |
| Clarity & Information Hierarchy | 9 |
| Visual Design & Polish | 6 |
| Trust & Credibility | 6 |
| Accessibility | 6 |
| Conversion Effectiveness | 5 |
| Performance & Technical Quality | 5 |
| Responsive Design | 7 |
| Engagement & Interaction | 4 |
| Brand Consistency | 3 |
| First Impression / Wow Factor | 3 |

**Why it differs from default:** Content Quality is the highest single weight of any dimension in any profile (22) — this content exists specifically to demonstrate genuine expertise and rank organically; generic filler fails both jobs at once. Conversion is intentionally low (5) — the CTA is a soft, end-of-article nudge, not the page's reason to exist.

## 8. FAQ Page

*Applies to:* `/faq`.

| Category | Weight |
|---|---|
| Content Quality & Persuasion | 16 |
| Clarity & Information Hierarchy | 12 |
| Usability & Task Completion | 12 |
| Conversion Effectiveness | 8 |
| Navigation & User Journey | 8 |
| Trust & Credibility | 8 |
| Responsive Design | 7 |
| Visual Design & Polish | 5 |
| Accessibility | 8 |
| Performance & Technical Quality | 4 |
| SEO & Discoverability | 4 |
| Engagement & Interaction | 4 |
| First Impression / Wow Factor | 2 |
| Brand Consistency | 2 |

**Why it differs from default:** this is the only profile besides Interactive Tool and Booking Form to carry real Usability weight (12) — the category filter and accordion are genuine interactions the visitor must operate correctly to find their answer, alongside the answer itself needing to be specific enough to actually resolve an objection (Content Quality 16).

## 9. Booking / Enquiry Form Page

*Applies to:* `/book-interview`, `/contact`.

| Category | Weight |
|---|---|
| Usability & Task Completion | 24 |
| Conversion Effectiveness | 18 |
| Accessibility | 10 |
| Responsive Design | 9 |
| Clarity & Information Hierarchy | 9 |
| Trust & Credibility | 8 |
| Navigation & User Journey | 4 |
| Content Quality & Persuasion | 4 |
| Visual Design & Polish | 5 |
| Performance & Technical Quality | 3 |
| First Impression / Wow Factor | 2 |
| Engagement & Interaction | 2 |
| Brand Consistency | 2 |

*(SEO & Discoverability omitted — these pages aren't built to win organic search and typically shouldn't be judged on it.)*

**Why it differs from default:** Usability and Conversion together are 42 of the 100 points — nothing else matters if the form can't be completed, and this is the highest-intent page family on the site, so friction here is the most expensive friction anywhere. Navigation is the lowest of any profile (4) — a visitor mid-form shouldn't be thinking about site navigation at all.

## 10. Legal / Policy Page

*Applies to:* `/privacy-policy`.

| Category | Weight |
|---|---|
| Clarity & Information Hierarchy | 20 |
| Content Quality & Persuasion | 20 |
| Accessibility | 12 |
| Trust & Credibility | 10 |
| Brand Consistency | 10 |
| Navigation & User Journey | 8 |
| Responsive Design | 6 |
| SEO & Discoverability | 4 |
| Performance & Technical Quality | 4 |
| Visual Design & Polish | 4 |
| Conversion Effectiveness | 2 |

*(First Impression / Wow Factor and Engagement & Interaction omitted — not relevant to a policy page's job.)*

**Why it differs from default:** Clarity and (accuracy-sense) Content Quality tie for highest weight — a legal page's only real job is being correct and readable. Brand Consistency (10) is unusually high for a utility page specifically because this page currently drops the site's chrome pattern (plain `bg-white` div, no `gradient-transition` treatment) more than any other page type — worth explicit weight to judge whether that reads as "deliberately minimal" or "abandoned."

## 11. Error Page

*Applies to:* catch-all `*` (`NotFound.tsx`).

| Category | Weight |
|---|---|
| Navigation & User Journey | 24 |
| Clarity & Information Hierarchy | 14 |
| Visual Design & Polish | 8 |
| Responsive Design | 8 |
| Brand Consistency | 8 |
| Conversion Effectiveness | 6 |
| Accessibility | 8 |
| Performance & Technical Quality | 6 |
| First Impression / Wow Factor | 4 |
| SEO & Discoverability | 4 |
| Trust & Credibility | 4 |
| Content Quality & Persuasion | 4 |
| Engagement & Interaction | 2 |

**Why it differs from default:** Navigation & User Journey at 24 is the single highest weight of any dimension in any profile on the site — recovering a lost visit is this page's entire reason to exist, full stop.

## 12. Fallback / Default Profile

*Applies to:* any route not covered above.

| Category | Weight |
|---|---|
| Content Quality & Persuasion | 10 |
| Conversion Effectiveness | 10 |
| Clarity & Information Hierarchy | 10 |
| Visual Design & Polish | 8 |
| Navigation & User Journey | 8 |
| Trust & Credibility | 8 |
| Accessibility | 8 |
| Responsive Design | 8 |
| Performance & Technical Quality | 6 |
| SEO & Discoverability | 6 |
| Engagement & Interaction | 6 |
| First Impression / Wow Factor | 6 |
| Brand Consistency | 6 |

No dimension exceeds 10% — this profile makes no assumption about what the page is optimizing for. If the unclassified page turns out to have a real completable task (a form, a tool), add Usability & Task Completion back in manually, redistribute a proportional amount from Content Quality/Conversion/Clarity, and say so explicitly in the report rather than silently using an incomplete profile.

---

## Hybrid profiles

Only use when a page genuinely combines two functions — not merely because classification confidence is Medium instead of High. When you do:

1. State which two profiles are being blended (e.g., "70% Service Landing Page / 30% Interactive Tool" — this would apply if, say, a future Service Landing Page embedded the graph lab directly inline as a primary feature rather than linking out to it).
2. State the percentage blend.
3. Recompute every listed dimension's weight as `(profileA_weight × blendA%) + (profileB_weight × blendB%)`, summing across the union of both profiles' dimensions, and confirm the result still sums to 100 with `calculate_score.py --check-weights`.
4. Explain in one or two sentences why a hybrid is warranted — cite the specific structural evidence (not just "it's ambiguous").

As of this analysis, no live route on this site requires a hybrid — every route maps cleanly to exactly one family above.
