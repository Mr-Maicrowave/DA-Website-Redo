---
target: /programs primary-school high-school hsc
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-06-29T06-59-41Z
slug: programs-primary-school-high-school-hsc
---
# Impeccable Critique: Programs Primary, High School, HSC

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active sibling tabs exist on High School/HSC, but Primary has no matching program-family position indicator. |
| 2 | Match System / Real World | 3 | Stage-specific language is mostly parent-friendly, but HSC leans heavily on pressure/urgency rather than reassurance. |
| 3 | User Control and Freedom | 2 | Some jump links exist, but CTA destinations and sibling routes are inconsistent. |
| 4 | Consistency and Standards | 2 | Primary, High School, and HSC use different page structures, footers, CTA wording, and route conventions. |
| 5 | Error Prevention | 2 | Several CTAs route to `/#contact` or `/hsc-excellence` instead of the expected program/booking routes. |
| 6 | Recognition Rather Than Recall | 2 | Navigation is visible, but users must decode breadcrumb, sibling tabs, urgency bar, hero CTA, and floating CTA at once. |
| 7 | Flexibility and Efficiency | 2 | Pages support basic scanning, but no guided path by year/need beyond the Primary year-group tiles. |
| 8 | Aesthetic and Minimalist Design | 2 | Strong brand colors exist, but repeated cards, uppercase labels, pills, and table sections create a templated feel. |
| 9 | Error Recovery | 2 | Static marketing pages have limited error states, but route/CTA ambiguity gives users little recovery guidance. |
| 10 | Help and Documentation | 2 | FAQ/resources are in global nav, but program pages do not contextually link to pricing, teachers, results, or FAQ answers. |
| **Total** | | **24/40** | **Acceptable: solid content base, but needs program-family polish before it feels premium.** |

## Anti-Patterns Verdict

**LLM assessment**: The pages are serviceable and readable, but High School and HSC still read as template siblings. The main AI tells are repeated tiny uppercase section labels, soft cream sections, identical card grids, pill badges, thick top-border card accents, and generic "important stage / approach / curriculum / testimonial / fit / CTA" sequencing. Primary has more warmth and imagery, but it is visually disconnected from the other two pages.

**Deterministic scan**: The detector found 2 warnings:

- `src/pages/programs/HighSchool.tsx:183` - thick `border-top: 4px solid` accent on a rounded testimonial card.
- `src/pages/HSCExcellence.tsx:190` - same rounded-card top-border accent pattern.

These are true positives. They are not catastrophic, but they match the broader pattern: cards are doing too much of the design work.

**Visual overlays**: Mutable browser injection worked, but the live overlay helper endpoint was unreachable on the reported port, so no reliable user-visible overlay is available. Fallback evidence came from CLI detector output plus Playwright desktop/mobile screenshots.

## Overall Impression

The content is directionally right, and the nav update helps. The biggest opportunity is to rebuild these as one coherent "Programs" system: same navigation logic, same booking path, same brand grammar, but with each age stage receiving a distinct hero treatment and emotional rhythm.

## What's Working

- The pages answer real parent concerns: year stage, curriculum, group size, progress, results, and booking path are all present.
- The Primary page has the best parent journey because it gives year-group choices early and feels more supportive than sales-heavy.
- High School and HSC use real DA classroom imagery, which is much better than abstract filler and gives the pages credibility.

## Priority Issues

**[P1] High School and HSC delay the actual hero on mobile**

**Why it matters**: On mobile, users see nav, breadcrumb, sibling tabs, urgency banner, and only then the H1. The first emotional/value message arrives too late, and the floating phone button overlaps the hero copy. This makes the page feel administrative before it feels inspiring.

**Fix**: Collapse breadcrumb + sibling tabs into a compact program switcher below the hero or into a single short row. Move the urgency proof into the hero itself as one calm supporting line. On mobile, keep only the nav and hero before any secondary program controls.

**Suggested command**: `$impeccable adapt /programs`

**[P1] CTA routing and copy are inconsistent across the three pages**

**Why it matters**: Parents should learn one booking model. Primary says "Book an Interview" but links to `/#contact`; High School says "Book a Free Trial Lesson"; HSC says "Secure a Spot - Limited Places"; the nav says "Book Consultation". That makes the offer feel less trustworthy.

**Fix**: Pick one primary CTA label and one destination, likely `/book-interview`. Use age-specific supporting copy under the CTA, not different button labels. Replace `/#contact` on Primary with `/book-interview` unless the homepage contact anchor is intentionally the booking flow.

**Suggested command**: `$impeccable clarify /programs`

**[P1] The program family structure is inconsistent**

**Why it matters**: Primary looks like a separate build, High School and HSC look like a paired template, and HSC links point to `/hsc-excellence` while the current program route is `/programs/hsc`. Users can end up on two URLs for what appears to be the same page.

**Fix**: Standardize the family shell: shared program switcher, shared site footer, shared CTA pattern, canonical route links, and shared page-section rhythm. Keep page-specific art direction inside that shell.

**Suggested command**: `$impeccable layout /programs`

**[P2] High School and HSC are too visually similar**

**Why it matters**: Years 7-10 and HSC are different emotional moments. One is transition, confidence, and habit formation; the other is pressure, exam craft, and senior accountability. Right now the two pages feel like the same page with words swapped.

**Fix**: Give each page a distinct hero device. High School could use a "bridge from uncertainty to senior confidence" visual system. HSC could use a sharper "exam strategy desk / marking criteria / score pathway" system. Keep DA navy/gold, but vary composition, imagery placement, and motion.

**Suggested command**: `$impeccable bolder /programs/high-school /programs/hsc`

**[P2] Tables and card grids make the middle sections feel dense**

**Why it matters**: Parents scan quickly. The curriculum tables carry useful information, but on mobile they become long, wide, and spreadsheet-like. Card grids repeat in several sections, so nothing feels like the standout answer.

**Fix**: On mobile, convert curriculum tables into stacked subject cards with one strong takeaway each. Limit visible cards per section to 3-4, with progressive disclosure or a "compare subjects" fold for the rest.

**Suggested command**: `$impeccable distill /programs`

**[P2] Some imagery and alt text do not match the emotional claim**

**Why it matters**: Primary's hero alt says a primary student in tutoring, but the visible image reads as an award/wall display. That weakens trust and makes the page feel assembled rather than art-directed.

**Fix**: Use a child/tutor interaction image for the Primary hero, or rewrite the section around the award-wall image as proof/results. Ensure every visible image's content matches its alt text and section promise.

**Suggested command**: `$impeccable polish /programs/primary-school`

## Persona Red Flags

**Jordan, first-time parent**: The Primary page is easiest for Jordan because the year-group tiles make the next step obvious. High School and HSC force Jordan to parse multiple control layers before understanding the page. The urgency banner also risks anxiety before reassurance.

**Casey, distracted mobile parent**: Casey gets the H1 too late on High School/HSC and sees the floating phone button covering copy/CTA territory. The table sections create long scroll depth and horizontal/compact reading effort.

**Sam, accessibility-dependent user**: The pages have visible text and alt attributes, but visual-only emphasis, duplicated CTA meanings, and inconsistent routes can confuse screen-reader navigation. Primary also uses anchor/button styling with inline handlers and no obvious reduced-motion handling for hover effects.

**DA parent persona: cautious enrolment decision-maker**: This parent wants to know "is this right for my child?" and "what happens next?" The pages answer both, but the inconsistent CTA language creates a trust gap at the exact decision point.

## Minor Observations

- The repeated uppercase tag pattern is overused across all three pages.
- High School/HSC local footers feel cheaper than the richer site footer used on Primary.
- Primary imports and renders `StickyBookButton` even though `App.tsx` also renders it globally; browser output shows duplicate "Book Interview" links.
- HSC's final CTA has two buttons that both go to `/book-interview`, which creates fake choice.
- HSC pressure copy is persuasive, but should be balanced with calm support so the brand does not feel fear-led.

## Questions to Consider

- Should the program pages optimize for "choose the right age stage" or "book the interview immediately"? Pick one primary job per page.
- Should HSC feel urgent and high-stakes, or premium and calm under pressure?
- Should Primary, High School, and HSC share one modular template, or should they share only a shell while each hero/mid-page narrative is bespoke?
