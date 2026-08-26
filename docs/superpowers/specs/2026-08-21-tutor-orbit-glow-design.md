# Tutor Orbit Hero — 3D Glow & Shading Design

## Context

`TutorOrbitHero` (`src/features/tutor-orbit/TutorOrbitHero.tsx` + `tutor-orbit.css`) is the hero
section on `/tutors` (About > Meet the whole team). It renders a dark navy scene with a gold
orbit ring, circular satellite photos that drift/orbit and can be hovered/clicked to become the
active "centre" portrait, a name plate, and an info card describing the active tutor.

Currently the scene reads as flat: solid gradient background, a hairline gold ring, satellite
photos with a plain outline + small drop shadow, and a flat cream card. The goal is to make the
whole section feel more three-dimensional and alive via layered shading, ambient glow, and light
continuous motion — without changing the existing interaction model (hover/focus/click to select
a tutor) or component behavior.

## Goals

- Make the photo circles (satellites + centre portrait) read as lit, shaded spheres rather than
  flat cutouts, via rim-light + grounding shadow + selection glow.
- Give the orbit ring and background a sense of luminous depth (soft glow, breathing light)
  instead of static flat paint.
- Give the name plate and info card real elevation (layered shadow + sheen) instead of a
  hairline border.
- Add a small amount of continuous ambient motion (ring comet, breathing glow) as a purely
  decorative layer on top of the existing Framer Motion drift/selection logic.
- Keep the "premium ambient glow" style: soft gold/blue light, restrained and luxury-feeling,
  consistent with the existing serif/gold branding — not neon, not glassmorphism-heavy.

## Non-goals

- No change to `TUTOR_ORBIT_LAYOUT`, `orbitMotionFor`, `orbitPositionFor`, or any selection logic
  in `tutor-orbit-config.ts`.
- No change to which tutors are featured or how the active tutor is chosen.
- No new dependencies. Ambient motion is plain CSS `@keyframes` (opacity/transform only), not
  Framer Motion — the existing JS-driven drift/hover/select animations are untouched.
- No mouse-tracked 3D tilt / parallax-on-cursor. Motion budget is "ambient", not "interactive
  tilt".
- Card/name-plate frosted-glass treatment is scoped to the default overlapping layout only (see
  below); the always-expanded grid layout keeps a solid card since nothing sits behind it.

## Design

### A. Background & atmosphere

- The two existing radial-gradient "light sources" (blue main light at 56%/48%, gold accent at
  88%/57%) get a slow breathing animation: opacity (and slight scale) oscillate on a ~12s
  ease-in-out infinite alternate loop, offset from each other so they don't pulse in lockstep.
  Implemented via CSS custom property animation or by animating a wrapping pseudo-element's
  opacity — background gradients stay defined once, animation only touches opacity/transform.
- Add a soft vignette: a new radial-gradient darkening layer near the edges/corners of the
  section, so the eye is drawn toward the orbit rather than the flat corners.
- The existing starfield dots (`.tutor-orbit::before`) gain a faint twinkle — subtle opacity
  keyframe (e.g. 0.75 → 0.95 → 0.75) on a slow (~6-8s) loop.

### B. Orbit ring

- `.tutor-orbit__ring` (currently a 1px stroke) gets a soft glow: a blurred duplicate of the
  ring (via `filter: blur()` on a pseudo-layer or a wider `box-shadow` blur) sitting behind the
  crisp stroke, so it reads as emitting light rather than being drawn.
- A new small "comet" orb (new `<div className="tutor-orbit__comet" aria-hidden="true" />` in
  the TSX, one per ring) continuously travels around the ring path: a small radial-gradient
  gold blob, animated via a rotating parent wrapper (`transform-origin` at the ring's center,
  `@keyframes` rotating 0→360deg linear over ~20s infinite) with the blob offset to the ring's
  radius. Pure CSS, no JS.
- The two existing static ring node dots (`.tutor-orbit__ring::before/::after`) get a brighter
  glow (larger, softer `box-shadow` halo) to match the new lighting language.

### C. Photo circles (satellites + centre) — primary focus

- **Rim lighting**: each circle (`.tutor-orbit__satellite`, `.tutor-orbit__centre`) gets layered
  inset shadows — a light highlight near the top-left inner edge and a darker inset shadow
  toward the bottom-right — so the photo reads as a lit sphere rather than a flat disc. This is
  additive to the existing `img` content, applied on the circle container.
- **Grounding shadow**: each circle gets a soft blurred elliptical shadow beneath it (a
  pseudo-element or an additional offset `box-shadow`), giving the impression the circle is
  floating in front of the background with a light source above.
- **Selection glow**: replaces/augments the current `outline-color` swap on hover/focus/active
  with an actual emitted-light halo — a soft gold `box-shadow` blur that fades in/out smoothly
  (CSS transition, since hover/active state is already toggled via existing class logic and
  Framer Motion scale/opacity — this is a parallel CSS transition on `box-shadow`, not a new JS
  animation).
- **Centre portrait**: gets the strongest treatment — rim-light + grounding shadow as above,
  plus a slowly pulsing gold halo synced to the same breathing rhythm as the background glow
  (ties section A and C together visually, like a spotlight breathing behind the featured
  tutor).

### D. Name plate & info card

- `.tutor-orbit__name` and `.tutor-orbit__card` move from a flat hairline-border slab to a
  layered elevation: a tight, close dark contact shadow (small blur, low spread, reads as
  "resting on a surface") plus a soft ambient colored shadow (low-opacity gold or navy tint,
  larger blur) for depth. The card's existing gold top bar is kept, not duplicated.
- Add a subtle top-edge sheen: a thin light gradient highlight along the top inner edge of both
  elements.
- **Default (overlapping) layout only** — where `.tutor-orbit__card` is `position: absolute` and
  sits on top of the glowing stage — give it a light frosted backdrop (`backdrop-filter: blur()`
  with a semi-transparent background) so the glow behind it visually bleeds through. In the
  `.tutor-orbit--always-expanded` grid layout, the card sits in its own column with nothing
  behind it, so it keeps a solid cream background (no backdrop-filter there).

### E. Technical approach & constraints

- All new continuous motion (background breathing, starfield twinkle, ring comet, centre-portrait
  halo pulse) is implemented as plain CSS `@keyframes` animating only `opacity` and `transform`
  (GPU-cheap, no layout thrash).
- These new animations are automatically covered by the existing blanket rule at the bottom of
  `tutor-orbit.css`:
  ```css
  @media(prefers-reduced-motion:reduce){.tutor-orbit *{animation:none!important;transition:none!important}}
  ```
  No additional reduced-motion handling is required beyond ensuring any new decorative elements
  are inside `.tutor-orbit` and use `animation`/`transition` (not inline style-driven motion).
- The two new decorative elements needed (comet orb wrapper, vignette layer) are added as plain
  `aria-hidden="true"` `div`s in `TutorOrbitHero.tsx`, matching the existing `.tutor-orbit__ring`
  pattern (also `aria-hidden`). No changes to tutor data, selection state, or existing
  Framer-Motion-driven elements (`.tutor-orbit__satellite`, `.tutor-orbit__centre` img
  transitions, `.tutor-orbit__card` entrance) — the new CSS is layered around them.
- Existing responsive breakpoints (`@media(max-width:1100px)`, `@media(max-width:900px)`) are
  preserved; new decorative elements (ring glow, comet, vignette) should degrade gracefully or be
  hidden on the sub-900px stacked layout if they'd look cramped (to be confirmed visually during
  implementation, not a hard requirement here).

## Testing / verification

No automated tests exist for this visual-only change (matches project convention — this repo has
no test suite for styling). Verification is manual:

- `npm run lint` and `npm run build:dev` to confirm no syntax/type errors from the new TSX
  elements.
- Manual visual check on `/tutors` in dev server across desktop, the 1100px breakpoint, and the
  900px stacked mobile layout.
- Manual check with OS-level "reduce motion" enabled (or DevTools emulation) to confirm all new
  ambient animations stop, per the existing blanket rule.
- Confirm hover/focus/click selection behavior (satellite → centre swap) is visually unchanged
  in function, only enhanced in shading/glow.
