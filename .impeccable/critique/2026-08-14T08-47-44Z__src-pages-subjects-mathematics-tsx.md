---
target: HSC Maths stream selector in src/pages/subjects/Mathematics.tsx
total_score: 23
p0_count: 0
p1_count: 2
timestamp: 2026-08-14T08-47-44Z
slug: src-pages-subjects-mathematics-tsx
---
# HSC Maths stream selector design critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2/4 | Selection changes the route, colour, and content, but there is no explicit persistent selected marker and mobile loses the route. |
| 2 | Match System / Real World | 2/4 | The copy explains prerequisites, but the graphic depicts four peer branches from Year 10. |
| 3 | User Control and Freedom | 3/4 | Visitors can switch courses immediately without penalty. |
| 4 | Consistency and Standards | 2/4 | Course names resemble diagram labels rather than controls, and the declared tab pattern is incomplete. |
| 5 | Error Prevention | 2/4 | Helpful copy reduces mistakes, while the misleading topology can create a misconception. |
| 6 | Recognition Rather Than Recall | 2/4 | Comparing streams requires switching panels and remembering the previous content. |
| 7 | Flexibility and Efficiency | 2/4 | Direct selection is fast, but there is no comparison view or expected arrow-key tab navigation. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Calm and polished, although the decorative route dominates the decision. |
| 9 | Error Recovery | 3/4 | There is little destructive interaction and changing selection is immediate. |
| 10 | Help and Documentation | 2/4 | Guidance is useful, but placement help is not paired with a relevant action. |
| **Total** |  | **23/40** | **Acceptable - significant improvements needed.** |

## Anti-Patterns Verdict

**LLM assessment:** Moderate AI-pattern risk. The bespoke route animation gives the section personality, but the cream canvas, serif labels, tiny uppercase tracked text, ruled columns, and neon glow drift into the familiar editorial-infographic lane. It feels polished, but the effect is more decorative than grounded or proven.

**Deterministic scan:** Five `side-tab` warnings were found at Mathematics.tsx lines 1774, 1792, 1812, 1829, and 1950. All are inside the legacy branch disabled by `SHOW_LEGACY_MATHS_INTERACTIONS = false`, so they are not rendered in this selector and are false positives for the current surface. A manual source check found a mobile-only `border-l-2` accent at line 1646 that the detector did not flag.

**Visual overlay:** Mutable browser injection failed because the browser evaluation surface exposed `document.title` as getter-only. No reliable user-visible overlay was produced. Evidence instead came from the CLI detector, live DOM inspection, computed styles, click-state testing, source inspection, and the supplied screenshot.

## Overall Impression

The underlying concept is strong and the implementation works, but visitors are being asked to discover an invisible control inside an ornamental diagram. The single biggest opportunity is to make this a **course chooser first and a pathway animation second**.

## What's Working

- The parent-centred framing answers a real question: which stream fits this child and their goals.
- The course guidance is specific, particularly the explanation that Extension 1 accompanies Advanced and Extension 2 builds on Extension 1.
- Progressive disclosure keeps four long course descriptions from appearing at once, and the live buttons have generous desktop hit areas.

## Priority Issues

### [P1] The pathway drawing teaches the wrong course relationship

**Why it matters:** The current route suggests four equivalent branches directly from Year 10. Extension 1 and Extension 2 are cumulative pathways, and the selected Extension 2 route visually falls to the lowest option.

**Fix:** Draw the relationship as `Year 10 -> Standard` and `Year 10 -> Advanced -> Extension 1 -> Extension 2`. Highlight the complete prerequisite path for the selected course and keep increasing depth in one consistent visual direction.

**Suggested command:** `$impeccable shape`

### [P1] Course labels do not look reliably clickable

**Why it matters:** The labels look like annotations on an illustration. Unselected choices use whole-button opacity of 0.45, producing estimated contrast of only 1.52:1 to 1.94:1 against the cream background. Even selected Standard is approximately 2.71:1. Users can interpret the options as disabled or decorative.

**Fix:** Add `Select a course to see who it suits` above the choices. Render each course as a clear full-width row with a dark navy label, persistent selected marker, one-line descriptor, and chevron. Reserve course colour for a dot, rail, or active highlight rather than lowering text opacity.

**Suggested command:** `$impeccable clarify`

### [P2] The section explains syllabus topics better than it supports a family decision

**Why it matters:** Parents care about readiness, workload, goals, prerequisites, and where their child will need help. Five topic names are less useful than a consistent fit summary, and the swap-pane prevents direct comparison.

**Fix:** Structure every course panel as `Best fit when`, `What changes`, `Prerequisite or commitment`, and `How DA helps`. Reduce topics to three examples or put the full list behind disclosure. Add a compact `Compare all four` view and distinguish Standard 1 from Standard 2.

**Suggested command:** `$impeccable clarify`

### [P2] The interaction pattern is incomplete and weakens on mobile

**Why it matters:** Source and live DOM show `role=tab`, but every tab remains tabbable, arrow keys do not change selection, `aria-controls` is absent, and there is no `role=tabpanel`. On mobile the route disappears, leaving a disconnected list above a long panel.

**Fix:** Either implement a complete ARIA tabs pattern with roving focus and linked panels, or use ordinary buttons with `aria-pressed`. On mobile, use an accordion so each explanation opens directly below its course label.

**Suggested command:** `$impeccable adapt`

### [P2] DA-specific reassurance and the next step are too weak

**Why it matters:** At the most anxious point, the interface becomes course-ranking and syllabus-led. `Explore HSC program` is generic and sends the visitor away instead of offering the personal guidance promised in the intro.

**Fix:** Add one credible proof element, such as a teacher placement quote, real progression example, or outcome. Make `Talk through your child's course choice` the contextual primary CTA and retain the program page as secondary.

**Suggested command:** `$impeccable polish`

## Recommended Information Architecture

```text
Choose the course your child is taking
Select a course to see who it suits

Year 10 ---- Standard 1 & 2
       `--- Advanced --- + Extension 1 --- + Extension 2

[Selected course] at a glance
Best fit when ...
What changes ...
Where students need help ...
How DA supports them ...

[Talk through the right course]   [Explore HSC program]
```

Recommended control labels:

- `Standard 1 & 2` - Practical maths, no calculus
- `Advanced` - Calculus foundation for quantitative study
- `Extension 1` - Studied alongside Advanced
- `Extension 2` - Studied alongside Extension 1

## Persona Red Flags

**Jordan - first-time Year 10 parent:** May not realise the course names are clickable, encounters unexplained domain language, sees a branch graphic that conflicts with the prerequisite copy, and cannot act directly on the offer of placement help.

**Sam - keyboard, screen-reader, or low-vision visitor:** Unselected labels fail contrast, meaning depends on colour and opacity, and the declared tab pattern lacks expected keyboard behaviour and tab-to-panel relationships.

**Casey - distracted mobile parent:** The explanatory route disappears, switching courses becomes scroll-heavy, the active state stays subtle, and the contextual action sits below long prose and five topics.

## Minor Observations

- `Course selections are often made during Year 10` is warmer and safer than saying streams are usually locked near the end of Year 10.
- University assumed knowledge and prerequisites vary; qualify the Advanced badge rather than presenting it as universal.
- The default Standard selection should not look like a recommendation unless it is one.
- The active underline risks conflating keyboard focus with selection.
- The glow should end at a visible node before the label rather than passing through the text.

## Questions to Consider

- Should the main journey serve families confirming an existing course, families choosing a Year 11 course, or both through two explicit entry points?
- Should the improved design preserve the animated pathway as a supporting feature, or replace it with a simpler comparison-first course ladder?
- Would the strongest proof here be a teacher placement quote, a real student progression, or a compact HSC result?
