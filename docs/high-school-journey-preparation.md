# High School watercolour journey — preparation

## Scope

This pass prepares the asset and data architecture only. It intentionally does
not add a pinned scroll sequence, camera timeline, scene transitions, or new
visible page layout.

## Current implementation

- Route: `/programs/high-school`, declared in `src/App.tsx`.
- Page: `src/pages/programs/HighSchool.tsx`.
- Existing entrance: `src/components/programs/HighSchoolCinematicScene.tsx`
  and `.css` use GSAP + ScrollTrigger to scale four registered 1672 × 941 PNG
  layers through a sticky 300vh scene.
- The page also uses Framer Motion for its existing stage progression and an
  inline SVG paper plane animated with CSS `offset-path`.
- Existing cream identity: `#FFFDF8` / `#FBF6EA`, with reusable paper textures
  at `/images/paper-texture.png`, `/images/homepage/paper-texture.png`, and
  `/book-theme/paper-texture.png`.

## Animation packages already installed

- `gsap@^3.15.0` — includes ScrollTrigger and MotionPathPlugin.
- `framer-motion@^12.23.26`.
- `lenis@^1.3.26`.
- `three@^0.170.0`, `@react-three/fiber@^8.17.10`, and
  `@react-three/drei@^9.122.0`.

No additional animation package is required.

## Recommended implementation stack

Use GSAP + ScrollTrigger as the single master timeline, CSS transforms / CSS
3D transforms for scene depth, and GSAP MotionPathPlugin for the plane. Keep
the existing Framer Motion elsewhere on the page, but do not split ownership
of the new scrubbed journey between Framer Motion and GSAP. Three.js is not
recommended: the requested depth, occlusion and camera push can be achieved
with composited DOM layers without a WebGL render loop or texture-upload cost.

## Available assets

- Entrance landscape, water/mist, floating-object and desk/foreground layers:
  `/images/programs/highschool-layer-1-mountains.png` through
  `highschool-layer-4-foreground.png` (transparent PNG, matching 1672 × 941
  canvases).
- Four transparent stage washes:
  `/images/programs/highschool-stakes-{blue|green|purple|orange}.png`
  (1536 × 1024). These work as accents but are not sufficient by themselves as
  full-width layered worlds.
- Warm paper textures and several existing book cutouts.
- Code assets created in this pass: paper plane, flight path, stars, and faint
  geometry lines.

## Still required before animation production

Each colour world needs separate transparent artwork for its soft background
pigment, midground wash, small droplets, and close foreground paint edge. The
purple foreground is a brush stroke rather than an edge. The opening desk
composite can be used initially, but independent transparent books, pencil cup,
pencils, plant/leaves, pages/fragments and graduation cap are required for
strong close-camera occlusion. An alternate plane angle is optional.

Do not bake stage text into any raster asset. Prefer transparent WebP where
the browser support target permits it; otherwise use optimized RGBA PNG.

## Performance plan

### Shared

- Animate only `transform`, `opacity`, and carefully bounded blur; never animate
  layout properties.
- Keep one sticky viewport and one GSAP timeline. Batch DOM reads before the
  timeline is built and use `gsap.context()`/`matchMedia()` for cleanup.
- Decode the next world's critical layers before its timeline segment; do not
  preload every large image at initial page load.
- Use `image-set()` or `<picture>`/`srcset` for viewport-appropriate raster
  variants. Export full-scene desktop layers around 1600–2200 px wide, tablet
  around 1280 px, and mobile around 800–960 px unless visual QA proves more is
  needed.
- Keep the persistent paper grain as one overlay rather than repeating it in
  every layer. Apply `will-change` shortly before the pinned sequence and clear
  it afterward.

### Desktop

- Use all six depth bands. Extreme foreground can travel farthest and briefly
  move beyond the viewport to sell forward passage.
- Limit active large composited layers to the current and next world; release
  old layers after cross-dissolve.

### Tablet

- Retain the same scene order but reduce extreme-foreground scale/translation
  by roughly 30–40%, cap blur, and remove pointer parallax.

### Mobile

- Use three effective depth groups: background, content/midground, foreground.
- Omit decorative geometry and some droplets; use smaller image variants and a
  shorter scroll runway while preserving all four stages and the plane beat.

### Reduced motion

- Do not pin a long scrubbed scene. Present the four stages in narrative order
  with static layered compositions or short crossfades, keep the plane static,
  and ensure all text remains immediately visible.

## Data architecture

- `src/data/highSchoolJourneyAssets.ts` is the single asset manifest. Missing
  art is explicit (`src: null`, `status: "missing"`) so it cannot silently ship
  as a broken URL.
- `src/data/highSchoolJourneyScenes.ts` defines typed depth layers, entrance and
  floating layers, four colour scenes, and the four existing content stages.
- `src/pages/programs/HighSchool.tsx` now reads its current stage content and
  wash paths from that shared data; visible copy and layout are unchanged.

