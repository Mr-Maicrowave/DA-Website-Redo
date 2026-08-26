# Mathematics Ambient Side Motion Preview

## Purpose

Test whether three restrained, side-mounted mathematical animations can give the Mathematics page more curiosity and visual identity without competing with its tutoring content. Graph Lab and Fourier remain the page's substantial interactive experiences; these moments are ambient discoveries with optional depth.

## Preview boundary

- The prototype appears only at `/subjects/mathematics?motionPreview=1`.
- `/subjects/mathematics` continues to render the current page unchanged.
- Basketball and the mistake-finding sections remain untouched during this iteration.
- All prototype code stays in `src/features/maths-ambient-motion/`.
- The feature uses React, SVG, KaTeX and Framer Motion; Manim is not a runtime dependency.

## Concepts and sequence

Keep three concepts that span the senior course levels without duplicating Graph Lab or Fourier:

1. **Networks — Mathematics Standard:** a search frontier spreads from a source and leaves the shortest route illuminated.
2. **Differentiation — Mathematics Advanced:** a tangent moves across an original function while the derivative is revealed at exactly the same horizontal rate.
3. **Vector projection — Mathematics Extension:** a perpendicular drops from one vector and illuminates its projection onto the other, making the dot-product formula visually legible.

Remove the sine/cosine and integration ambient scenes. Trigonometric waves already receive substantial attention in Fourier and Graph Lab; differentiation gives Advanced calculus representation while leaving room for Standard and Extension concepts.

## Default presentation

- Diagrams are drawn directly into beige page areas. They have no dark panel, card, border or obvious container.
- Placement alternates: network right, differentiation left, vectors right.
- Each ambient scene is approximately 180–230 px wide and deliberately less detailed than its expanded state.
- Idle linework is lightly translucent. DA navy/blue supplies structure; gold indicates the active construction or derived result.
- Gold is a luminous material rather than a flat fill: use a light-to-deep-gold gradient, a bright leading point and a bounded glow.
- The diagrams never intercept scrolling or ordinary page interaction outside their explicit interactive target.

## Interaction model

- **Hover/focus:** after a short delay, the diagram brightens and scales by 5–8%. Leaving before the delay causes no visible change.
- **Click/keyboard activation:** the diagram opens into a centred lesson surface while a high-opacity warm veil fades and blurs the rest of the page.
- The expanded state contains one headline KaTeX equation and three concise mathematical derivation steps. It has no close icon.
- Clicking outside the centred lesson or pressing Escape returns the diagram to its side position.
- Touch devices do not depend on hover. If a device has adequate side space, tapping opens the focused state.
- The full teaching sequence remains a later optional enhancement; this iteration does not add a new destination or non-functional CTA.

## Placement and responsive behaviour

- Mount the network moment after the hero, differentiation before the anchor navigation, and vectors before the HSC pathway section.
- **Revised (2026-08-14 follow-up):** the original plan below assumed a floating side gutter is safe from `1180px`. It is not — this page's widest sections (`max-w-[1480px]`) fill their padded width completely below roughly `1540px`, so a floating element in that range draws over real content, not empty space. The corrected contract:
  - `< 768px`: hidden entirely, matching the original mobile restraint below.
  - `768px`–`1439.98px`: renders as a small centred card in normal document flow (`position: static`, its own vertical space, a visible one-line label) — this cannot overlap content by construction, and is the only way to extend reach into this range.
  - `≥ 1440px`: floats in the outer page gutter as originally designed; this is the first width where a real empty margin exists outside the widest content column.
- Position each moment in the outer page gutter without reserving vertical space or shifting existing content — ~~this only applies at `≥1440px` now~~.
- ~~Show compact moments from `min-width: 1180px`, increasing their width at `1440px` when more gutter space is available.~~ Superseded by the revised contract above.
- ~~Below the threshold, hide the feature entirely. Do not move it inline, stack it, or add a mobile replacement.~~ Superseded: an in-flow, non-floating presentation is now used for `768px`–`1439.98px` specifically because it cannot overlap, unlike a floating one.
- `prefers-reduced-motion: reduce` renders a static final construction and uses an instant open/close state.

## Mathematical correctness

### Differentiation

- Generate the original function and derivative from the same sampled mathematical model.
- The tangent point must progress monotonically in `x`.
- Reveal the derivative with a clip whose right edge shares the tangent point's current `x` and duration.
- Calculate the tangent angle from the derivative at the current sample. Do not approximate it with unrelated path rotation.

### Network

- Start with the source node and reveal exploration edges in frontier order.
- Keep inactive edges subdued.
- After the destination is reached, retain one clearly illuminated shortest path.

### Vector projection

- Draw vectors from a shared origin with enough angular separation to distinguish them.
- Drop a perpendicular from the tip of `a` to the line of `b`.
- Illuminate the projected length `|a| cos θ` before displaying the dot-product relationship.

## Component boundaries

- `AmbientMathsMoment`: owns delayed hover, focus state, Escape/outside-close behaviour, layout expansion, focus wash and accessible labelling.
- `NetworkAmbientScene`, `DerivativeAmbientScene` and `VectorAmbientScene`: own only their SVG mathematical constructions and short expanded copy.
- `Mathematics.tsx`: supplies the three stable mounting points and the preview gate.
- `SubjectHero` is not modified.

## Performance and accessibility

- Animate SVG transforms, clip geometry, opacity and bounded filters; do not add video payloads or global scroll listeners.
- Only moments near the viewport animate.
- Provide an explicit button target, keyboard focus styles, `aria-expanded`, SVG titles/descriptions, outside-click dismissal and Escape dismissal.
- Preserve the page's tab order and restore focus to the side moment after closing.
- The focus veil covers the complete viewport, including navigation and floating controls, so the lesson is the only active visual layer.

## Verification

- Source tests verify that only three moments remain, placements alternate, the feature is preview-gated, and no full-width motion stage survives.
- Unit tests verify the sampled derivative model and shared timing contract.
- Run `npm.cmd run test:maths-motion`, `npm.cmd run test:graph-lab`, `npm.cmd run typecheck`, `npm.cmd run lint -- --quiet` and `npm.cmd run build`.
- Render-check at 1920 px, 1440 px, 1280 px and 390 px.
- At 1920/1440/1280 px verify side placement, hover delay, focus-layer coverage, outside-click/Escape dismissal, focus restoration and no content overlap.
- At 390 px verify the moments are absent and no vertical gap or horizontal overflow remains.
- Compare `/subjects/mathematics` with the preview URL to confirm the normal page is unchanged.

## Approved visibility and focus refinement

- Small ambient diagrams retain the page's beige background, but use thicker near-black DA ink for structure and brighter champagne gold for the mathematical result. Cobalt blue is removed.
- Fine strokes and nodes receive restrained local glow or shadow so the diagrams remain legible in peripheral page space without becoming cards.
- The expanded lesson sits above a high-opacity warm focus veil and every site-level floating control. Outside click or Escape closes it; there is no close icon.
- Each expanded lesson connects its headline equation to at least two short mathematical steps rendered with KaTeX. The copy explains what each animated mark represents and how the displayed formula follows.

## Approved syllabus-language refinement

- The network moment uses the syllabus terms **vertex**, **edge**, **weight** and **shortest path**. It shows edge weights and calculates a route by adding them; it does not introduce algorithm-relaxation notation.
- The differentiation moment uses the clean model `f(x)=x^3-3x` and derives `f'(x)=3x^2-3`. The explanation explicitly calls the derivative the **gradient function**.
- The vector moment visibly labels vectors `a` and `b`, the angle `theta`, the perpendicular and the projected length. Its explanation uses **scalar (dot) product**, the current syllabus wording.
- The vector lesson does not display a syllabus-transition or HSC-year badge; the mathematical terminology remains syllabus-aligned without presenting curriculum metadata to visitors.

## Approved scale and compact-colour refinement

- The expanded lesson uses substantially more of the viewport, up to approximately `72rem` wide, with a wider explanation column and responsive padding.
- Every headline equation and worked line remains fully contained within the lesson surface. Long equations reduce responsively rather than extending beyond the card.
- Compact diagrams are deliberately softer than the surrounding page text: structural ink shifts to muted slate and the whole scene uses reduced saturation and opacity.
- Motion remains the invitation. A small champagne-gold construction acts like a moving light source while the rest of the diagram stays subdued.
- Deliberate hover or keyboard focus restores clarity, saturation and glow. Expanded lessons use the full ink-and-gold palette for reading.
