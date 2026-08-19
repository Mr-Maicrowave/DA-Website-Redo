---
target: entire Mathematics page
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-08-15T02-37-34Z
slug: src-pages-subjects-mathematics-tsx
---
# Mathematics page re-audit

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2/4 | HSC selection is clear; intro has no duration/progress and section nav has no current-location state. |
| 2 | Match System / Real World | 2/4 | Parent language is strong, but Years 7–12 conflicts with K–12/Primary content and some K–10 labels are not NSW course names. |
| 3 | User Control and Freedom | 2/4 | Intro can be skipped but blocks the page, disables Tab, ignores Escape, and returns on refresh. |
| 4 | Consistency and Standards | 2/4 | Visual system is cohesive; pathway and booking language shifts meaning across the page. |
| 5 | Error Prevention | 3/4 | Few risky interactions and HSC prerequisites are clear; scope contradictions can still cause false self-selection. |
| 6 | Recognition Rather Than Recall | 3/4 | Anchors and labelled streams help; users must still remember how stage, format, and stream differ. |
| 7 | Flexibility and Efficiency | 2/4 | Anchors, phone, booking, and Graph Lab routes exist; the long linear journey dominates on mobile. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Polished and maths-specific, but repeated cards/eyebrows and 15.8k mobile pixels dilute focus. |
| 9 | Error Recovery | 2/4 | Video fails open, but the page offers little other recovery evidence and has invalid nested CTA controls. |
| 10 | Help and Documentation | 3/4 | Concerns, stage guidance, HSC detail, and contact routes help; the strongest help CTA does not do what its label promises. |
| **Total** |  | **24/40** | **Acceptable — strong foundation, significant journey and trust fixes needed.** |

## Anti-Patterns Verdict

**LLM assessment:** Borderline pass. The real classroom photography, bespoke maths diagrams, Graph Lab invitation, HSC pathway map, and worked algebra example make the page feel genuinely DA-specific. The surrounding structure falls back on familiar AI/premium-education grammar: navy/gold/cream, oversized serif headings, repeated uppercase tracked eyebrows, uniform card grids, large radii, borders, and soft shadows. Inspiring is strong, Grounded is mixed, and Proven is weakest.

**Deterministic scan:** The CLI returned five `side-tab` warnings at `Mathematics.tsx:1519,1537,1557,1574,1695`. All five are in the legacy branch gated by `SHOW_LEGACY_MATHS_INTERACTIONS = false`, so they are false positives for the live page but valid warnings if that branch is re-enabled.

**Visual overlays:** Mutable-browser preflight was rejected by the browser URL security policy before any mutation. No user-visible overlay is available. Fallback evidence used fresh desktop/mobile DOM inspection, computed styles, console checks, and sequential screenshots.

## Overall Impression

This is no longer a generic subject page. Its strongest sections prove how DA teaches maths rather than merely claiming expertise. The main opportunity is not adding more polish; it is turning several strong sections into one clear decision journey. At present, a parent encounters a forced film, a product demo, a five-link menu, concerns, three age stages, four class formats, four HSC streams, teaching proof, an anonymous quote, and only then the final booking close.

Measured length was about 8,659–8,693px on desktop and 15,431–15,825px on mobile, or roughly 10.5 and 18.8 viewport heights respectively. No root horizontal overflow, broken images, duplicate IDs, console warnings/errors, or heading-level skips were found.

## What's Working

1. **The page demonstrates teaching.** The array, coordinate graph, unit circle, route map, and algebra correction are specific educational proof, not decorative mathematics.
2. **The HSC pathway is now a strong decision tool.** Prerequisites and Year 12 availability are legible, desktop selection state works, and mobile becomes a usable exclusive accordion.
3. **The concern-to-method copy feels real.** Freezing in tests, avoiding homework, and careless mistakes map directly to how DA responds. Real class photography strengthens the grounded signal.

## Priority Issues

### [P1] The intro video blocks every fresh visit

**Why it matters:** The 8.04-second, 19.7MB video takes over the page, locks scrolling, prevents Tab movement, has no Escape handler or progress cue, and does not remember dismissal. The user's first task becomes waiting or skipping.

**Fix:** Make it optional inline media with a poster. If retained as an interstitial, show it once per session, persist dismissal, support Escape, honour reduced motion/data preferences, expose duration, and keep Skip in a mobile-reachable position.

**Suggested command:** `$impeccable onboard`

### [P1] Scope and curriculum language contradict the offer

**Why it matters:** The hero says Years 7–12, SEO says K–12, and the page later presents Primary School K–6. Years 7–10 also lists Advanced Mathematics and Mathematical Methods even though current NSW K–10 course terminology is Mathematics / Mathematics Life Skills with Core and Paths content. This can make a primary parent leave and a detail-oriented parent distrust the copy.

**Fix:** Decide whether this route is K–12 or secondary-only and make hero, metadata, stage content, and navigation agree. Align Years 7–10 copy with current NSW language while keeping DA's enrichment offer clearly labelled as DA's offer rather than a school course name.

**Suggested command:** `$impeccable clarify`

### [P1] Decision and conversion actions do not match their labels

**Why it matters:** The hero only offers Explore. “Ask which level fits” merely scrolls to class cards; it does not ask anything. The class cards say “Choose” but are not clickable and have no CTA. The same consultation is called Book Consultation, Book an Interview, and Talk through your child's course choice.

**Fix:** Give the hero a direct booking action plus a secondary exploration action. Rename the stage action to Compare class options or connect it to booking with stage context. Add a clear action to each format and standardise one booking term.

**Suggested command:** `$impeccable clarify`

### [P2] Three decision systems create an 18.8-screen mobile journey

**Why it matters:** School stage, tuition format, and HSC stream are all presented as major pathways. Graph Lab appears before parent fit and teaching proof. The five-link mobile jump card consumes 334px, and repeated section scaffolds continuously restart the hierarchy.

**Fix:** Reorder to one parent-facing sequence: stage/need, recommended format, senior stream if relevant, teaching proof, verified proof, booking. Move Graph Lab later as optional enrichment. Convert the mobile link stack into a compact jump control. Remove repeated labels and flatten non-essential ghost-card containers.

**Suggested command:** `$impeccable distill`

### [P2] Mobile accessibility and proof quality weaken the close

**Why it matters:** The 56px phone and scroll-to-top controls visibly cover HSC and worked-equation content. Journey actions measure only 16–20px high. Several small gold labels have 2.26–4.25:1 contrast on light backgrounds. Final CTA links contain nested buttons. The testimonial is attributed only to Parent feedback.

**Fix:** Collapse/reposition fixed mobile controls, give inline actions at least 44px targets, introduce a darker small-text gold token, render each CTA as one interactive element, and replace the anonymous quote with consented attribution or specific anonymised context.

**Suggested command:** `$impeccable harden`

## Persona Red Flags

**Jordan, first-time parent:** A contextless intro precedes the value proposition; Years 7–12 appears to exclude a K–6 child; Explore and Ask which level fits do not reveal their destinations.

**Riley, sceptical evaluator:** Scope and curriculum terms conflict, pathway means three things, the final testimonial cannot be verified, and a header Contact link targets a missing `#contact` element.

**Casey, distracted mobile user:** The page is almost 19 screens long; booking is absent from the mobile hero; tiny text actions are hard to tap; two fixed controls cover lesson and HSC content.

## Minor Observations

- The class-format section is 1.36 desktop screens and 3.32 mobile screens despite containing no action.
- The teaching-proof section is strong enough to move earlier.
- The anchor card, testimonial, and final CTA all repeat large radius + border + large shadow treatment.
- Nine live uppercase tracked labels create a generated cadence.
- Four class photos are strong human proof, but all source paths still sit under `/english-page/images/subjects/english/`, which makes ownership and future maintenance unclear.
- `ScrollToTop` is mounted twice in `App.tsx`; the controls overlap visually but duplicate listeners/semantics.
- The header Contact link points to `#contact`, which does not exist on the page.
- All eight rendered images loaded with non-empty alt text; HSC pointer states, mobile menu Escape, and accordion exclusivity worked.

## Questions to Consider

1. Is this page K–12, Years 7–12, or should Primary and Secondary have separate routes?
2. Should the intro be optional inline media, session-once, or removed?
3. Should Graph Lab be an early acquisition hook, later teaching proof, or a separate resource only?
4. What verified proof can replace the anonymous closing quote: named story, specific anonymised outcome, or aggregate results?
