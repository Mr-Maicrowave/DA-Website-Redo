---
target: the HSC maths pathway section shown in the screenshot
total_score: 23
p0_count: 0
p1_count: 4
timestamp: 2026-08-19T16-35-40Z
slug: src-features-hsc-maths-pathway-hscmathspathway-tsx
---
## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2/4 | Standard is preselected and the explicit selected marker disappears below xl. |
| 2 | Match system / real world | 2/4 | The spatial model does not clearly distinguish alternatives, concurrent study, and prerequisites. |
| 3 | User control and freedom | 3/4 | Course selection is reversible and topics can be expanded. |
| 4 | Consistency and standards | 3/4 | Styling is cohesive, though desktop and mobile communicate selection differently. |
| 5 | Error prevention | 2/4 | The default state can look like a recommendation. |
| 6 | Recognition rather than recall | 2/4 | Comparing streams requires clicking and remembering previous prose. |
| 7 | Flexibility and efficiency | 2/4 | There is no direct path for a parent who is unsure. |
| 8 | Aesthetic and minimalist design | 2/4 | Three equal columns contain too many competing messages and actions. |
| 9 | Error recovery | 3/4 | A mistaken selection is easy to reverse. |
| 10 | Help and documentation | 2/4 | Guidance exists but does not teach the diagram's relationships. |
| **Total** | | **23/40** | **Acceptable; significant improvements needed** |

## Anti-Patterns Verdict

The custom pathway concept is more distinctive than a generic card grid, and the cream, navy, and gold treatment fits DA. The composition nevertheless carries moderate template risk: a tiny uppercase kicker, editorial serif, one rounded mega-card, three columns, and repeated icon-label-paragraph rows. It looks polished before it becomes understandable.

The deterministic detector returned zero findings. This confirms there are no obvious banned implementation patterns in the target file, but it does not assess hierarchy, interaction clarity, or rendered geometry. Browser overlay injection was unavailable because the browser webview did not attach; no overlay is claimed. The live route did return HTTP 200, and the supplied screenshot plus source were used as visual evidence.

## Overall Impression

The section has useful course-specific content and a strong custom concept, but it behaves like an infographic when the parent needs a guided decision tool. The largest opportunity is to make the first action unmistakable and subordinate the pathway graphic to that action.

## What's Working

- The decision dimensions are genuinely useful: best fit, course changes, common challenges, and DA support.
- The accessibility foundation uses native buttons, pressed/expanded states, focus treatments, and reduced-motion handling.
- The restrained palette and typography communicate calm authority rather than discount-tutoring energy.

## Priority Issues

### [P1] There is no unmistakable first action

The default Standard selection and populated detail panel make it unclear whether the parent should read, inspect the diagram, click a course, or book help. Begin with the explicit question: "Which course is your child taking or considering?" Make the four choices the dominant control, add "I'm not sure yet," and avoid preselecting a recommendation-like answer.

Suggested command: `$impeccable shape HSC maths pathway chooser`

### [P1] The diagram encodes course relationships ambiguously

Standard and Advanced are alternatives; Extension 1 is studied with Advanced; Extension 2 is a Year 12 option with prerequisites. The current curved lines do not clearly encode these different relationships. Use one chronological axis and explicit relationship labels: "choose one," "studied together," and "requires."

Suggested command: `$impeccable clarify HSC maths pathway relationships`

### [P1] The component promises comparison but requires recall

Only one prose-heavy detail panel is visible, so comparison requires repeated clicking and memory. Either change the promise from "compare" to "explore" or allow a compact two-course comparison using parent-facing facts: suits, keeps open, requires, and commonly feels difficult.

Suggested command: `$impeccable distill HSC maths course details`

### [P1] Three jobs receive equal visual weight

The left guidance, central map, and right detail panel all compete. Restructure the experience as a sequence: choose a course or uncertainty state; show the relevant relationship; reveal the two most important facts; then offer topics and human help. Remove the redundant left guidance column.

Suggested command: `$impeccable layout HSC maths pathway chooser`

### [P2] Selection and relationships rely too heavily on colour

At some desktop widths the textual Selected tag is hidden, while the SVG is aria-hidden. Keep a textual selected indicator at all widths, add a non-colour state change, include prerequisite text in accessible labels, and announce detail changes politely.

Suggested command: `$impeccable audit HSC maths pathway accessibility`

## Persona Red Flags

**Jordan, first-time parent:** Standard appears recommended by default; the diagram lacks a stated first step; "where your child is headed" does not say whether to consider marks, confidence, prerequisites, or career goals; comparison is only serial.

**Sam, accessibility-dependent user:** the visually meaningful routes are aria-hidden; selection can depend on colour at common desktop widths; the changed detail region has no live announcement.

**Casey, distracted mobile parent:** Standard opens by default; each accordion panel is long; comparing two streams requires scrolling and memory; selection is not preserved after interruption.

**Sceptical DA parent:** the section looks premium but does not explain why DA is qualified to guide this decision or what the course-choice conversation will resolve.

## Minor Observations

- "What changes" has no explicit comparison baseline.
- "Where students need help" is deficit-framed; "What students often find challenging" is warmer.
- Structured facts such as availability and prerequisites exist in the model but are not consistently surfaced.
- Combining Standard 1 and Standard 2 may hide a meaningful distinction.
- Repeated uppercase labels and generic icons add visual noise without adding comprehension.

## Questions to Consider

- Is the primary job to explain NSW course architecture or to help a parent decide what to do next?
- Why is Standard selected before the parent has told DA anything?
- If the coloured curves disappeared, could a parent still explain the prerequisites correctly?
- What will a parent know after the consultation that they do not know before it?
