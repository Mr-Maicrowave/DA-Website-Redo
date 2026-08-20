# HSC Mathematics Pathway Redesign

Date: 2026-08-14
Status: Approved visual direction, awaiting written-spec confirmation
Surface: `/subjects/mathematics`, HSC pathway section
North-star mock: `docs/design/hsc-maths-pathway-north-star.png`

## Purpose

Replace the current decorative HSC stream selector with a clearer interactive pathway that preserves its curved, luminous character while accurately explaining course relationships. The section must help both families confirming an existing course and Year 10 families deciding what comes next.

## Approved Direction

The visual lane is a polished contemporary museum exhibit: academic, calm, premium, gently luminous, and highly legible. Keep the existing warm off-white canvas, academic navy typography, and four course identities:

- Standard: ochre gold
- Advanced: jade green
- Extension 1: clear blue
- Extension 2: violet

All course labels remain dark navy at accessible contrast. Course colours identify nodes, routes, and selected accents; inactive text is never faded. Glow is restricted to the active prerequisite route and remains subordinate to the controls and content.

The mock is a north star rather than a screenshot to trace. Preserve its hierarchy, route topology, node treatment, responsive intent, and decision-focused content. Do not rasterise UI text, controls, route lines, or icons.

## Course Model

The visual model must distinguish availability from prerequisites:

- Standard is a separate pathway from Year 10.
- Advanced is the base course for the Extension pathway.
- Extension 1 is studied with Advanced.
- Extension 2 becomes available in Year 12.
- Extension 2 requires Year 11 Advanced and Extension 1, and is studied with Year 12 Advanced and Extension 1.

The desktop route therefore reads:

```text
Year 10 -> Standard 1 & 2
        -> Advanced -> Extension 1 -> [Year 12 threshold] -> Extension 2
```

The Extension 2 node must carry both `Year 12 only` and `Requires Advanced + Extension 1`. The connector from Advanced to Extension 1 must communicate `Studied with Advanced`.

## Desktop Composition

The existing section heading remains above one wide bordered pathway panel.

The panel has three zones:

1. **Orientation:** `HSC Maths`, a short instruction for enrolled and undecided families, and a concise Year 10 reassurance.
2. **Course pathway:** four vertically separated, clearly interactive course rows positioned around a semantic SVG route. Standard branches separately. Advanced continues to Extension 1, followed by a visible Year 12 threshold and Extension 2.
3. **Selected course detail:** a heading in the form `<Course> at a glance`, four consistent decision groups, topic disclosure, and contextual actions.

The course rows are real buttons. Each contains a course-colour node, dark navy course name, short descriptor, chevron, and persistent selected state. Lines terminate at nodes and never pass through labels.

## Mobile Composition

Below the desktop content breakpoint, replace the spatial diagram with a single course accordion. Do not merely hide the route and leave a detached selector.

- Four full-width rows with at least 48px touch height
- Dark navy course names and course-colour dots
- Clear expanded state and chevron
- Selected course details directly below its row
- Extension 2 retains the Year 12 and prerequisite labels
- Primary and secondary actions remain available without excessive scrolling
- Only one course is expanded at a time

Desktop and mobile use the same content model and active selection state.

## Content Structure

Each course uses the same fields:

- `name`
- `shortDescriptor`
- `availability`
- `prerequisites`
- `bestFit`
- `whatChanges`
- `helpNeeded`
- `daSupport`
- `topics`
- `colour`

The detail panel shows:

1. Best fit when
2. What changes
3. Where students need help
4. How DA helps

Topics are collapsed behind `See topics covered` by default or shown as no more than three concise examples. Copy must support a parent decision rather than reproduce a syllabus list.

Primary action: `Talk through your child's course choice`, linking to `/book-interview`.

Secondary action: `Explore HSC program`, linking to `/hsc-excellence`.

## Interaction and Accessibility

Use ordinary disclosure/selection buttons rather than an incomplete ARIA tab implementation.

- Desktop course buttons use `aria-pressed` and an explicit selected label.
- Mobile accordion buttons use `aria-expanded` and `aria-controls` with matching labelled regions.
- Every control is keyboard operable with native Enter and Space behaviour.
- Focus-visible styling is distinct from selected styling.
- State is never communicated by colour alone.
- All text meets WCAG AA contrast; course colours do not replace dark text.
- The selected detail heading receives a stable accessible relationship without forcibly moving focus after pointer selection.

## Motion

On first view, the route draws in once. On selection, only the relevant branch/prerequisite segments illuminate.

- Target duration: approximately 450–600ms
- Ease: existing exponential/quart-style project easing
- No bounce or elastic motion
- Detail panel uses a short opacity/translate transition
- Hover may strengthen a node on fine-pointer devices but cannot reveal required information
- `prefers-reduced-motion` disables path tracing and removes spatial movement while preserving instant state changes

## Implementation Boundaries

Extract the section into a focused feature folder rather than increasing the already-large Mathematics page:

```text
src/features/hsc-maths-pathway/
  HscMathsPathway.tsx
  hsc-maths-pathway-model.ts
  hsc-maths-pathway.test.ts
```

`Mathematics.tsx` will render the feature in the existing section location. The model module owns course data and prerequisite-chain helpers so the course truth can be tested independently from presentation.

No new dependency is required. Reuse React, Framer Motion, Lucide, React Router, Tailwind, and the existing reduced-motion approach.

## Testing

Follow red-green-refactor.

Automated tests must prove:

- Standard has no Extension prerequisite chain.
- Extension 1 includes Advanced in its active path.
- Extension 2 includes Advanced and Extension 1 and is marked Year 12 only.
- The component exposes clear button/accordion semantics, reduced-motion handling, contextual CTA copy, and both destination links.
- The old incomplete `role="tab"` implementation is removed from the Mathematics page.

Verification includes the feature test, existing maths tests, typecheck, production build, deterministic design detector, and live visual inspection at mobile, tablet, and desktop widths. Pointer and keyboard activation are checked separately.

## Acceptance Criteria

- A visitor understands within five seconds that the four course rows are selectable.
- The diagram accurately communicates Standard as separate, Extension 1 with Advanced, and Extension 2 as Year 12 only after Advanced and Extension 1.
- The selected course and its prerequisites remain visually obvious without low-contrast text.
- Course copy answers fit, change, support need, and DA response before listing topics.
- Desktop preserves the approved curved museum-exhibit character.
- Mobile behaves as a native-feeling accordion.
- Keyboard, focus, screen-reader state, contrast, and reduced motion are addressed.
- No unrelated Mathematics page sections change.
