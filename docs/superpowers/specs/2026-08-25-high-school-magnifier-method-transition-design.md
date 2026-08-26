# High School Magnifier-to-Methods Transition Design

## Purpose

Replace the current `TransitionBridge` and `CurriculumExplorer` immediately after the existing Year 7–10 cinematic hero with one continuous, reversible scroll sequence. The magnifying glass attached to the Year 8 bubble must appear to leave the existing timeline, approach the viewer, and settle as the first control in a five-method icon selector.

The existing cinematic hero, student artwork, year content, typography, bubbles, and layout remain unchanged.

## Replacement Boundary

- Preserve `HighSchoolCinematicScene` and its existing finale.
- Replace `TransitionBridge` and `CurriculumExplorer` inside `HighSchoolProfessionalJourney` with a new `MethodTransition` component.
- Preserve the later `TeachingProcess`, `TeacherSupport`, `ProgressJourney`, and `HSCBridge` sections.
- The completed selector contains symbols only. It has no heading, description, card, visible method label, or subject content.

## Component Architecture

### Existing magnifier source

The Year 8 button in `FinaleScene` already renders `/high-school-journey/finale/year-08-magnifying-glass-ai.png` as `.hs-finale__year-icon`. Add stable data attributes to the Year 8 source element and its year button so the transition can measure them without coupling to positional CSS selectors.

### `MethodTransition`

Create an isolated component under `src/components/programs/high-school-method-transition/` containing:

- A 300vh outer section that supplies scroll distance.
- A sticky 100vh stage.
- A fixed-position transition proxy using the same Year 8 magnifier asset.
- A large central watercolor bloom.
- A five-button method row.
- A data model for `diagnose`, `explain`, `practise`, `apply`, and `review`.
- A single GSAP/ScrollTrigger master timeline.

The component measures three rectangles on refresh:

1. Existing Year 8 magnifier source.
2. Viewport-centred hero position.
3. Final Diagnose button icon position.

It converts those rectangles into transform-only coordinates for the proxy. Measurements rerun on `ScrollTrigger.refresh`, breakpoint changes, and image decode completion.

### Physical handoff

Use a proxy instead of reparenting the original React node across component boundaries:

1. Position the proxy exactly over the source icon using `getBoundingClientRect()`.
2. Keep the proxy hidden until the overlap is exact.
3. Reveal the proxy and hide only the original icon.
4. Animate the proxy through the centre scene.
5. Position it exactly over the final Diagnose symbol.
6. Reveal the final symbol only after overlap and hide the proxy.

Both handoffs use opacity changes only after geometric alignment, preventing popping. Reverse scrolling performs the same handoffs in reverse through the scrubbed timeline.

## Scroll Timeline

Use one pinned, reversible timeline with `scrub: 0.8`, `invalidateOnRefresh: true`, and transform/opacity animation only.

- `0.00–0.15`: existing Year scene remains essentially unchanged.
- `0.15–0.32`: proxy takes over and detaches from Year 8.
- `0.32–0.48`: proxy travels to viewport centre, rotates slightly, and scales to 180–240px on desktop.
- `0.48–0.58`: centred breathing moment; pale-green watercolor bloom gently reaches full presence.
- `0.58–0.76`: magnifier shrinks and moves toward the final row.
- `0.76–0.86`: proxy aligns precisely with the Diagnose position and hands off.
- `0.84–0.94`: Explain, Practise, Apply, and Review reveal sequentially with 60–100ms-equivalent stagger, `opacity 0→1`, `scale .8→1`, and `y 15→0`.
- `0.94–1.00`: selector settles with all five controls available.

During the approach, the existing finale scene recedes subtly toward `scale: .96`, lower opacity, and a small vertical offset. It never abruptly fades to white.

## Generated Raster Assets

Use built-in ChatGPT ImageGen in `stylized-concept` mode. Generate separate transparent PNG files so each pigment layer can be independently transformed and faded:

1. `method-bloom-center-green-v1.png` — broad pale-green centre bloom with faint gold flecks.
2. `method-bloom-diagnose-teal-v1.png` — restrained teal/green-blue irregular bloom.
3. `method-bloom-explain-green-v1.png` — soft leaf-green irregular bloom.
4. `method-bloom-practise-lavender-v1.png` — muted lavender irregular bloom.
5. `method-bloom-apply-peach-v1.png` — warm peach/orange irregular bloom.
6. `method-bloom-review-gold-v1.png` — muted DA-gold/yellow irregular bloom.

All assets must have genuine transparency, soft watercolor edges, subtle paper pigment granulation, no text, no icons, no borders, no shadows, and no watermark. Save final selected files under `public/images/programs/high-school-method-transition/`.

The moving magnifier reuses the existing Year 8 asset to preserve identity. The other four symbols use crisp `lucide-react` SVG components because generated raster icons would lose sharpness while scaling and would not provide predictable stroke quality.

## Final Selector

The selector is a spacious horizontal composition with no card containers. Each button combines a subtle generated pigment bloom with a crisp line icon:

- Diagnose: magnifying glass, teal.
- Explain: speech bubble, green.
- Practise: pencil, lavender.
- Apply: paper plane, peach.
- Review: clipboard/check, gold.

Desktop width is capped around 1050px. The watercolor treatment occupies approximately 80–105px and the line symbol approximately 45–60px. Buttons keep 44px minimum interactive targets and expose `aria-label` values despite having no visible text.

Arrow keys, Home, and End move focus through the selector using roving `tabIndex`. Click and active state are represented in component state so the later expansion interaction can be added without restructuring the row; no expanded method content is built in this scope.

## Responsive Behaviour

- Desktop: one five-icon row with generous spacing; centred magnifier peaks at 180–240px.
- Tablet: one row with reduced gaps and a smaller centre magnifier.
- Mobile: compact single-row selector inside a horizontally scrollable region; the transition peak is reduced so the magnifier remains fully visible.
- Recompute source, centre, and destination positions at every breakpoint.
- No vertical stack of five oversized controls.

## Reduced Motion

For `prefers-reduced-motion: reduce`, skip the large extraction and zoom. Crossfade from the existing Year finale into the completed five-icon selector over a short duration. All controls remain immediately keyboard-accessible.

## Accessibility

- Use semantic buttons with `aria-label="Diagnose"`, `Explain`, `Practise`, `Apply`, and `Review`.
- Maintain visible focus indicators with sufficient contrast.
- Decorative blooms are `aria-hidden` and use empty alt text.
- Keep the selector usable without pointer input and without animation.

## Performance and Cleanup

- Animate only `transform` and `opacity` during scroll.
- Apply `will-change` only to the proxy, finale recession layer, centre bloom, and icons while the sequence is active.
- Preload/decode transition artwork before final measurements.
- Scope the timeline in `gsap.context()` and kill ScrollTriggers/listeners on unmount.
- Do not add another smooth-scroll library; use the project’s existing GSAP/ScrollTrigger setup.

## Verification

- Unit/source tests confirm the replacement boundary, one master timeline, five accessible buttons, stagger order, stable Year 8 source hook, and reduced-motion branch.
- Desktop and mobile browser QA confirm pixel-aligned handoffs, no duplicate visible magnifier, no clipping, correct reverse scrolling, no horizontal page overflow, and no console errors.
- Run component tests, TypeScript checking, and a production build before completion.
