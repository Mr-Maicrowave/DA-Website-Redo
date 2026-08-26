# Learning Formats Journey — Step 1 Design

## Objective

Replace the current `/learning-formats` page body with the first slice of a reusable, scroll-driven illustrated journey. This slice ends after the student arrives at a non-functional Academic Level scene. It establishes the walking, camera-follow, horizontal world movement, parallax, accessibility, and asset architecture required for later assessment scenes.

## Scope

Step 1 includes:

- an opening landscape and the supplied opening copy;
- a pinned viewport driven by a single GSAP/ScrollTrigger master timeline;
- a student who begins idle, walks toward a 28% viewport camera-follow position, remains there while the world travels, and returns to idle at arrival;
- independently positioned world layers using the supplied illustrated assets;
- restrained parallax and environmental micro-motion;
- an arrival composition for Scene 01 with three non-interactive destination labels;
- a non-pinned reduced-motion presentation;
- desktop-first responsive behavior that remains usable on smaller screens.

Step 1 explicitly excludes quiz state, answer selection, recommendation logic, Scenes 02–05, result presentation, and redesign of unrelated page surfaces.

## Visual Direction

The page uses DA Tuition's supplied editorial ink-and-watercolour asset sheets as the source artwork. It does not reproduce the artwork of the interaction reference. The scene remains sparse and premium, with large areas of warm ivory, deep navy typography, muted antique gold, sage, dusty blue, pale peach, and occasional lavender.

The student and nearby ground provide the visual anchor. Distant hills and the DA-inspired academy silhouette remain atmospheric and low-contrast at the opening, becoming slightly clearer during travel. Scenery is deliberately intermittent rather than filling the full viewport.

Opening content:

- `Every student learns differently.`
- `Let's find where your child thrives.`
- `A short journey. Thoughtful questions. A pathway that's uniquely theirs.`
- `Begin the journey →`
- `Scroll to begin ↓`

Arrival content:

- `01 — ACADEMIC LEVEL`
- `Where is your child academically right now?`
- `Rebuilding foundations`
- `Around their year level`
- `Above their year level`

The three destinations are presentational only and must not imply working selection state.

## Asset Preparation

The four supplied transparent PNG sheets will be copied into a project source directory and non-destructively cropped into individual transparent WebP files. The original sheets will also be preserved in the project for traceability and future extraction.

Required extracted groups:

- student idle and walking frames;
- continuous path/ground segments;
- flowers, grass, rocks, and foreground planting;
- signpost;
- books and educational objects;
- middle-distance trees and shrubs;
- distant hills and DA academy landscape.

Cropping will preserve transparency and natural painted edges. Assets will be sized near their maximum rendered dimensions to avoid shipping unnecessarily large textures. The page will not depend on CSS background-position cropping of the full sheets.

## Component Architecture

The new feature lives under `src/features/learning-journey/` and exposes one page-level journey component.

### `LearningJourney`

Owns the section and pinned viewport refs, creates and cleans up the GSAP context and ScrollTrigger, and composes the opening, world, character, and Scene 01. It does not update React state per scroll frame.

### `JourneyWorld`

Defines the horizontal coordinate system and assembles independent scenery groups. Its track is wider than the viewport and remains extensible for later scenes.

### `JourneyLayer`

A small structural wrapper that gives a world group a semantic layer name, depth, positioning hook, and animation ref. Layers include distant, middle, path, detail, and foreground.

### `WalkingCharacter`

Provides an asset-adapter boundary with `idle` and `walking` visual states. Step 1 uses the extracted frame sequence, advanced without React render cycles. The outer character transform is controlled independently from the inner animation, allowing the renderer to be replaced with a sprite sheet, Lottie, or Rive without changing camera logic.

### `JourneyScene`

Provides a reusable positioned scene boundary. Step 1 supplies only `AcademicLevelArrival`, whose destination labels are static elements rather than buttons.

### Styling

Feature-specific CSS defines the spatial composition, art sizing, world coordinate positions, reduced-motion layout, and responsive adjustments. Existing DA typography and tokens are reused when they match the supplied direction; local journey tokens fill gaps without changing global styles.

## Scroll and Camera Model

One master GSAP timeline is scrubbed by one ScrollTrigger. The viewport pins for a practical distance of approximately 300–400vh, tuned through browser testing so Scene 01 is reached without excessive scrolling.

Timeline phases:

1. **0–10% — Opening:** content and landscape are settled; student is idle.
2. **10–20% — Departure:** opening copy fades and recedes; the student switches to walking and advances from the left toward approximately 28vw.
3. **20–65% — Camera follow:** the student's outer screen position stays near 28vw. World layers translate left at depth-specific rates; the path supplies the canonical travel distance.
4. **65–85% — Approach:** signpost and richer but still restrained details enter. Travel eases down and the signpost receives a tiny settling motion.
5. **85–100% — Arrival:** world and camera settle, the student returns to idle, and Academic Level content reveals.

The master timeline controls character movement, world translation, opening/arrival opacity, landscape clarity, and small scene accents. Walking-frame playback is enabled only during the moving interval. No scroll handler writes React state.

Parallax ratios remain close together to avoid a game-like effect:

- distant landscape: slowest;
- middle-distance vegetation: slightly slower than the path;
- path and primary objects: canonical speed;
- foreground details: slightly faster.

## Micro-interactions

Only the following are included:

- grass bends or drifts by a few pixels as the student passes;
- flowers use the foreground/detail parallax rate;
- the signpost makes one small damped settle near its arrival;
- distant artwork transitions from softly muted to modestly clearer.

All motion uses transforms and opacity. There are no particles, cursor effects, or looping decorative spectacles.

## Responsive and Reduced Motion

Desktop receives the full pinned journey. Fluid `clamp()` values govern student size, typography, art dimensions, and spatial offsets. The camera-follow target is computed from the viewport rather than a fixed pixel value.

On narrower screens, the world remains horizontally staged, but art scale and scene spacing compress so the student and destination remain connected. The layout must not overflow the document or obscure essential text.

For `prefers-reduced-motion: reduce`, ScrollTrigger pinning and scrubbed animation are not created. The page renders as a normal document flow containing the opening, an accessible static landscape with idle student, and the Academic Level arrival content. All important text remains visible and reading order remains logical.

## Accessibility

- Decorative scenery is ignored by assistive technology.
- The student has concise descriptive alternative text where rendered as content; repeated animation frames do not create repeated announcements.
- Opening and arrival use semantic headings and paragraphs.
- The `Begin the journey` control scrolls or focuses into the journey when motion is enabled and acts as a normal in-page link in reduced motion.
- Static destination placeholders are not rendered as buttons.
- Text contrast targets WCAG 2.1 AA.

## Performance and Lifecycle

- Animate only transform and opacity during scroll.
- Use `will-change` only on active moving layers.
- Preload the small student frames and primary opening assets; lazy-load later scenery where doing so does not cause visible arrival pop-in.
- Use a GSAP context scoped to the feature root.
- Kill the timeline and associated ScrollTrigger on unmount.
- Refresh ScrollTrigger after required image dimensions are available.
- Avoid measurements and layout reads during each scroll update.

## Integration

`src/pages/LearningFormats.tsx` retains its route-level SEO responsibilities and renders the new journey as its page body. Unrelated global navigation, footer, and other pages remain unchanged. Existing uncommitted work elsewhere in the repository is not modified.

The feature will expose data-shaped scene and layer composition points so Scenes 02–05 can extend the same world later without rewriting the engine. No future scene content is implemented in Step 1.

## Verification

Completion requires:

- focused tests for structural accessibility and the reduced-motion branch where practical;
- TypeScript typecheck;
- production build;
- browser inspection at desktop and smaller viewport sizes;
- browser verification of the 28vw follow behavior, walking/idle transitions, parallax restraint, Scene 01 arrival, scroll length, and absence of horizontal page overflow;
- reduced-motion emulation confirming a readable, non-pinned experience;
- console inspection for React, GSAP, asset, and accessibility errors.

## Acceptance Boundary

At completion, `/learning-formats` opens on the supplied elegant landscape, begins with an idle student, transitions into a genuine walking animation, shifts into camera-follow movement with restrained layered parallax, slows at the signpost, and arrives at the static Academic Level composition with the student idle. The implementation stops there.
