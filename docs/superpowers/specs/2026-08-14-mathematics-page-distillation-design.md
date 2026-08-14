# Mathematics Page Distillation

## Purpose

Turn `/subjects/mathematics` from a collection of interactive demonstrations into a restrained subject landing page that earns parent trust, gives students one memorable mathematical moment, and leads interested students to the practical Graph Lab.

## Approved hierarchy

1. Keep `FourierDrawing` as the page's only substantial on-page interaction. It remains a visually memorable optional-enrichment experience built around the DA shield.
2. Present Graph Lab as a concise practical destination and CTA to `/maths-graph-lab`; do not embed the full tool on the subject page.
3. Replace the interactive “How we teach” and “Spot the mistake” sections with one static teaching-proof section.
4. Remove the basketball “Maths in motion” journey and `FourierDecomposition` from the rendered page.
5. Put the three ambient mathematics scenes on the normal route as passive desktop decoration. They do not expand, capture focus, or count as additional activities.

## Static teaching proof

The replacement section uses one NSW-syllabus-relevant algebra misconception instead of generic claims:

- Student attempt: solving `2x + 5 = 13` by adding 5 rather than subtracting it.
- Tutor prompt: “What operation is being applied to `2x`, and what inverse operation undoes it?”
- Corrected reasoning: subtract 5 from both sides, divide by 2, and check by substitution.
- Teaching sequence: Predict → Explore → Explain → Apply.

This section is read-only. It must show a concrete tutor intervention and corrected reasoning without asking visitors to click through steps.

## Navigation and route behavior

- `/subjects/mathematics` renders the distilled composition without a query parameter.
- Remove the `motionPreview` gate from the page.
- Replace the old “How we teach” and “See it in action” anchor links with one “How learning changes” anchor.
- Keep the Graph Lab navigation destination.

## Reversibility

During this review pass, retain the legacy basketball, Fourier decomposition, teaching-step and mistake activity code in source, but stop rendering it. Permanent deletion happens only after the user approves the live composition.

## Accessibility and performance

- Static teaching proof uses semantic headings, ordered steps and readable KaTeX.
- Passive ambient scenes use `aria-hidden="true"`, do not enter the tab order and do not intercept pointer input.
- Ambient motion respects `prefers-reduced-motion` and remains hidden below the existing desktop threshold.
- The normal page must have no horizontal overflow at desktop or mobile widths.

## Verification

- Add regression tests for the rendered composition and passive ambient API.
- Run `npm.cmd run test:maths-motion`, `npm.cmd run test:graph-lab`, `npm.cmd run typecheck`, `npm.cmd run lint -- --quiet`, `npm.cmd run build` and `git diff --check`.
- Render-check `/subjects/mathematics` without `motionPreview` at desktop and mobile sizes.

