# Mathematics Syllabus Scroll Story — Design

**Status:** approved visual and interaction direction; no implementation yet
**Route:** `/subjects/mathematics`
**Placement:** immediately before the existing `HscMathsPathway` feature

## Purpose

Create a 4–6-screen cinematic scroll interlude that gives the Mathematics page a premium, intelligent visual centrepiece. It must show how one mathematical idea can be understood through increasingly powerful lenses while remaining truthful about the NSW HSC course structure.

It is not a course-selection diagram and must not imply that Mathematics Standard is a prerequisite for Mathematics Advanced, Extension 1 or Extension 2. The existing `HscMathsPathway` remains the practical, accessible course-comparison experience.

## Approved visual direction

- This is a **hybrid** composition: high-quality generated raster art plates create the atmosphere, while a deliberately minimal code/SVG layer provides truthful scroll-responsive mathematical motion.
- Predominantly warm cream/ivory space with restrained deep navy construction lines and antique-gold accents.
- The central device is one **small, precise gold point**, never a heavy rendered sphere.
- The path is the visual hero: a slightly stronger navy/gold line with a soft, controlled warm glow and a subtle luminous tail.
- Richness comes from bespoke raster visual plates: paper texture, translucent drafting planes, light, depth and architectural forms. These plates are generated and iterated with the built-in image generator, then stored as optimised project assets.
- The live layer is intentionally small: SVG path/point/tangent/area accents, labels and parallax. It exists to make the mathematical idea genuinely respond to scroll; it must not be responsible for the full art direction.
- Avoid flat infographic cards, generic sci-fi HUD imagery, particles, blackboard imagery, dense decorative equations and large UI-like borders.

## Six-beat story

The beats occupy one continuous desktop composition; they are not six disconnected cards.

| Beat | Live mathematical action | Syllabus anchor | Label treatment |
| --- | --- | --- | --- |
| 1. Locate | The point finds a position and begins a measured path. | Mathematics Standard: linear relationships, measurement, networks and modelling. | `MODEL · STANDARD` |
| 2. Relate | Its trace becomes a manipulable function curve. | Mathematics Advanced: functions and graph transformations. | `RELATION · ADVANCED` |
| 3. Change | A luminous tangent attaches to the curve and reveals local rate of change. | Mathematics Advanced: differential calculus. | `CHANGE · ADVANCED` |
| 4. Accumulate | A subtle warm area fills under the curve. | Mathematics Advanced: integral calculus and applications. | `ACCUMULATION · ADVANCED` |
| 5. Extend | The plane turns into directed motion and vectors while the original curve remains legible. | Mathematics Extension 1: parametric equations, vectors and further calculus. | `MOTION · EXTENSION 1` |
| 6. Prove / explore | Layers resolve into an elegant complex/vector architecture; it then releases back to the page. | Mathematics Extension 2: vectors, complex numbers, further integration, mechanics and proof. | `NEW SPACE · EXTENSION 2` |

The text must frame these as different mathematical lenses and course content, not as a required progression from Standard to Extension 2. Content must be checked against the exact NSW syllabus version in force when the feature is published.

## Interaction and responsive behaviour

### Desktop

- A GSAP `ScrollTrigger` pins the scene across approximately 5–6 viewport heights.
- Scroll progress drives one scrubbed timeline, not competing autonomous animations.
- Each beat crossfades/changes the selected raster plate, moves or draws the live path and briefly brings in a syllabus label.
- The scene releases naturally into `HscMathsPathway`; no scroll-jacking, looping or forced completion.

### Mobile and reduced motion

- Below the desktop breakpoint, use a compact sequential reveal rather than a long pin. It contains the same six labels and syllabus meaning.
- With `prefers-reduced-motion`, do not pin, scrub, auto-play, shimmer or draw the path. Render the complete visual state and readable labels in normal document flow.
- Labels are real HTML text, not baked into images. The art plates are decorative and have empty alt text.

## Technical design

### Feature boundary

Create `src/features/maths-syllabus-scroll-story/` with:

- `MathsSyllabusScrollStory.tsx` — markup, reduced-motion branch and GSAP lifecycle.
- `maths-syllabus-scroll-story-data.ts` — typed beat data: label, course name, curriculum note, asset key and timeline interval.
- `maths-syllabus-scroll-story.css` — feature-scoped composition and responsive rules.
- `maths-syllabus-scroll-story.test.ts` — content and reduced-motion/static-contract checks.

Mount the feature in `src/pages/subjects/Mathematics.tsx` directly before `HscMathsPathway`.

### Animation implementation

- Use the already-installed GSAP and `ScrollTrigger`; register and scope them within a `gsap.context()` and revert on unmount.
- Use a small SVG overlay for the path only. Animate `transform`, `opacity` and `strokeDashoffset`; do not drive frame-by-frame React state.
- Use `ScrollTrigger.matchMedia()` to isolate desktop and mobile/reduced-motion timelines.
- Keep filters to the single controlled line glow. Do not animate large blurs, layout dimensions, full-screen SVG filters or thousands of nodes.

### Assets

- Generate 4–6 consistent art plates at wide desktop and mobile crops after the implementation plan is approved.
- Preserve the chosen cream/navy/gold direction and leave all visual text out of generated plates.
- Optimise selected output to route-scoped WebP/AVIF assets. Load the opening plate eagerly only when the Mathematics route is active; lazy-load later plates.
- Do not use a video background, Canvas/WebGL engine or Diffusion Studio for this feature.

## Validation

- Content review verifies each on-screen label against the current NSW syllabus source and checks the course-pathway wording.
- Unit tests verify all six beats, their course labels and the reduced-motion static path.
- Typecheck, focused tests, lint for touched files, direct Vite build and `git diff --check` pass.
- Rendered browser QA verifies desktop, tablet and mobile; smooth pinned entry/release; no overlap or horizontal overflow; labels remain readable; reduced motion has no scrolling animation.
- Network inspection verifies imagery is route-scoped and total media weight is acceptable before publication.

## Out of scope

- Replacing the current HSC pathway map.
- Teaching every syllabus topic or making claims about individual academic outcomes.
- Introducing a new rendering engine, a full-screen video or SVG-only art direction.

## Source baseline

- NSW Mathematics Standard 11–12 (2024): https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-standard-11-12-2024/overview/course
- NSW Mathematics Advanced 11–12 (2024): https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-advanced-11-12-2024/overview/course
- NSW Mathematics Extension 1 11–12 (2024): https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-extension-1-11-12-2024/outcomes
- NSW Mathematics Extension 2 11–12 (2024): https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-extension-2-11-12-2024/overview/course
