---
target: /find-teacher
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-06-29T06-22-19Z
slug: src-pages-findteacher-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Search/filter state is visible; portrait loading falls back silently to monograms. |
| 2 | Match System / Real World | 3 | Warm faculty language works; the page still leans more gallery than parent decision support. |
| 3 | User Control and Freedom | 3 | Modal close, Escape, and filters are good; mobile global buttons intrude on the sheet. |
| 4 | Consistency and Standards | 3 | Brand palette is aligned; CTAs split between `/#contact` and `/book-interview`. |
| 5 | Error Prevention | 2 | Overlay conflicts and CTA inconsistency are preventable implementation issues. |
| 6 | Recognition Rather Than Recall | 3 | Cards and filters are clear; lower-card monograms weaken recognition of real educators. |
| 7 | Flexibility and Efficiency | 3 | Search and filters help; no quick path to compare or shortlist teachers. |
| 8 | Aesthetic and Minimalist Design | 3 | Much better than before; still repetitive once the compact grid begins. |
| 9 | Error Recovery | 3 | Empty search has clear recovery; image fallback is graceful but not explanatory. |
| 10 | Help and Documentation | 2 | The page says who teaches, but gives little guidance on choosing the right educator. |
| **Total** | | **28/40** | **Good foundation, targeted fixes needed** |

## Anti-Patterns Verdict

**LLM assessment**: This no longer reads as a basic AI card grid at first glance. The navy/gold faculty treatment, senior grouping, and dossier modal are real upgrades. The remaining AI tells are repetition in the 37-card lower grid, decorative stats that feel generic, and two thick quote side rules that look like the common AI callout pattern.

**Deterministic scan**: `detect.mjs` found 2 warnings in `src/pages/FindTeacher.tsx`: side-tab accent border at lines 380 and 441. These are blockquote borders, not cards, but they still match the banned side-accent pattern. Treat as a low-cost polish fix.

**Visual overlays**: Browser mutation preflight succeeded, but the Impeccable live-server endpoint was unreachable after startup, so no reliable visible overlay was injected. Fallback evidence used: CLI detector plus headless Chrome screenshots at 1440x900 and 390x844.

## Overall Impression

The rebuild is directionally right. It finally feels like a DA Tuition faculty page instead of a stock teacher directory. The biggest opportunity is to reduce perceived repetition and fix mobile modal obstruction so the polished work is not undercut by global UI.

## What's Working

- The senior faculty split gives the page hierarchy and makes the first six educators feel intentionally curated.
- The modal accessibility and motion model are stronger than typical custom modals: focus restore, Escape, tabs, reduced motion, and native button cards are all good.
- The palette and type are now much closer to the homepage than the old teacher page.

## Priority Issues

**[P1] Mobile profile sheet is obstructed by global floating buttons**
Why it matters: On mobile, the scroll-to-top button and phone/book button sit on top of the open educator profile. This makes the sheet feel broken and blocks reading/tapping near the lower right.
Fix: Hide or lower-priority `StickyBookButton` and `ScrollToTop` while a profile modal is open, ideally via a shared modal/open-overlay state or body data attribute.
Suggested command: `$impeccable adapt /find-teacher`

**[P1] The lower educator grid still becomes repetitive and partly impersonal**
Why it matters: After the strong senior section, the 37-card grid returns to a dense directory. Many lower cards show monogram fallbacks or identical headshot treatment, which weakens the promise of real, knowable educators.
Fix: Split the lower section into smaller subject/year groups, reduce visible cards per section, or show a curated subset with "View all"/filter flow. If some tutors lack portraits, give no-photo profiles a different compact list treatment instead of pretending they are portrait cards.
Suggested command: `$impeccable layout /find-teacher`

**[P2] CTA destinations are inconsistent**
Why it matters: The nav uses `/book-interview`, while modal and page CTAs use `/#contact`. Parents should not have to infer whether "Book consultation", "Request match", and contact are different flows.
Fix: Pick one booking destination for all primary consultation/match CTAs. Use secondary contact only for phone/address.
Suggested command: `$impeccable clarify /find-teacher`

**[P2] Hero is polished but still generic for a faculty page**
Why it matters: The hero says "Meet Our Educators" and shows stats, but does not immediately show teaching, mentorship, or real staff energy. It is better than before, but still a conventional masthead.
Fix: Add one concrete faculty signal: a small senior educator quote strip, a group-photo/candid-teaching asset if available, or a concise "how we match your child" promise.
Suggested command: `$impeccable delight /find-teacher`

**[P3] Quote side borders trigger the AI side-tab detector**
Why it matters: The gold `borderLeft: 3px solid` blockquotes are a small visual tell, especially because the rest of the page now aims for premium restraint.
Fix: Replace with a top gold rule, a quote mark, or a full subtle bordered quote block.
Suggested command: `$impeccable polish /find-teacher`

## Persona Red Flags

**Jordan, first-time parent**: The page shows many educators but does not clearly explain how to choose one. Search and subject filters help, but a parent still has to inspect profiles one by one. The "Request a teacher match" CTA is good, but it appears after a long grid.

**Casey, distracted mobile user**: The mobile sheet is readable, but two floating global buttons overlap it. The page is also very long on mobile, so finding the right teacher may feel like scrolling through a directory rather than being guided.

**Sam, accessibility-dependent user**: The core custom modal pattern is much better than average. Remaining concern: decorative initials/monogram fallback may be read as visual identity without explaining unavailable portraits; ensure image alt text and fallback text do not duplicate confusingly.

## Minor Observations

- The sticky filter bar uses a hard-coded `top-[72px]`; the new nav is about 57px. Check this after the nav settles.
- Desktop modal left portrait can briefly show only initials while the selected image loads. It is graceful, but it can look unfinished for prominent senior profiles.
- The stat row is useful, but it is a common hero pattern. Keep it if the rest of the hero gains more DA-specific proof.

## Questions to Consider

- Should this page help parents choose a teacher, or simply show the full team? Those are different layouts.
- Do all 43 educators need equal visual treatment, or should unphotographed/supporting profiles use a lighter directory format?
- Should "Request a teacher match" be the primary action above the grid rather than after it?
