# HSC Sunflower Journey Prototype Design

## Purpose

Build an isolated, desktop-first prototype that evaluates whether the generated sunflower assets can produce one continuous cinematic camera journey. The prototype must not modify or appear inside the production HSC page.

## Scope

- Add a development-only React route at `/hsc-sunflower-prototype`.
- Use the existing background plates in `/public/assets/hsc/sunflower/backgrounds/` and transparent foreground layers in `/public/assets/hsc/sunflower/foreground/`.
- Use GSAP and ScrollTrigger for a single scrubbed master timeline.
- Evaluate camera movement, depth, parallax, continuity, breeze, environment transitions, and lighting only.
- Desktop only for this iteration.

The prototype contains no text, headings, DA content, buttons, navigation, or additional generated imagery.

## Architecture

The route renders a dedicated `SunflowerJourneyPrototype` page containing one approximately `800vh` scroll region. Its viewport-sized stage is pinned by ScrollTrigger and uses this layer structure:

```text
.sunflowerJourney
  .sunflowerStage
    .backgroundLayer
    .midgroundLayer
    .foregroundLayer
    .atmosphereLayer
    .storyLayer
```

The story layer remains empty in this prototype. All styles are scoped to the prototype so the existing HSC page and global navigation are unaffected. Global site chrome is suppressed for this development route by rendering the page without the standard page transition or adding prototype-specific containment where necessary.

## Camera Journey

One GSAP master timeline, controlled by a pinned ScrollTrigger with approximately `scrub: 1.2`, represents twenty camera beats:

1. Wide and elevated
2. Slightly lower
3. Approaching flowers
4. Entering the field
5. Inside the field
6. Moving deeper
7. Increasing density
8. Surrounded
9. Lower camera
10. Narrower view
11. Deepest enclosure
12. Maximum pressure
13. Light returning
14. Field opening
15. Camera rising
16. Perspective expanding
17. Wide again
18. Significant rise
19. Near-aerial perspective
20. Open horizon

The emotional geometry is open → enter → immerse → enclose → break through → rise → open.

## Background Continuity

All ten background plates exist simultaneously in the pinned stage. Each plate receives slow scale and translation changes so it behaves like an environment rather than a slide.

Environment changes happen beneath visual occlusion:

- large right-edge flower crossing the camera;
- large left-edge flower crossing the camera;
- bottom foliage rising through the foreground;
- dense foreground cluster filling the frame;
- subtle atmospheric dissolve combined with continued camera motion.

The outgoing and incoming plates overlap spatially. No hard cuts, scroll snapping, or isolated full-section crossfades are used. A foreground movement or uninterrupted camera transform survives every plate change.

## Depth System

Three depth zones create parallax:

- Background plates: slowest scale and translation.
- Midground plants: moderate horizontal and vertical travel.
- Foreground plants and occluders: fastest travel and largest scale changes.

Foreground cutouts use bottom-centered transform origins. Their position, scale, and travel are varied to prevent repeated silhouettes or mechanical transitions.

## Breeze

Independent GSAP loops animate selected stems and clusters around their base. Each loop receives a different duration, phase, and restrained rotation amplitude. The motion remains below approximately one degree for most plants, with slightly greater movement on foliage-only layers. Breeze motion is independent from scroll progress and uses smooth non-bouncing easing.

## Lighting

The atmosphere layer combines subtle exposure, warmth, contrast, and vignette treatments:

- airy and warm at the opening;
- slightly cooler, darker, and more enclosed through the middle;
- gradual return of warmth during breakthrough;
- bright, soft, and open at the final horizon.

Changes must be felt rather than read as obvious filters.

## Reduced Motion

For `prefers-reduced-motion: reduce`, the prototype disables independent breeze and minimizes depth transforms. Scroll still reveals the environment progression with gentle opacity changes so the route remains inspectable without intensive motion.

## Verification

- Confirm the route is development-only and production HSC routes remain unchanged.
- Confirm the stage stays pinned across the full journey.
- Confirm all ten backgrounds load and every foreground asset used retains transparency.
- Inspect beginning, deepest point, breakthrough, and final horizon at a desktop viewport.
- Verify there are no blank frames, visible hard cuts, navigation, copy, or controls.
- Verify cleanup of GSAP contexts and ScrollTriggers on unmount.
- Run the relevant automated tests, TypeScript build, and targeted browser inspection.

## Files Expected to Change

- `src/App.tsx` — development-only route registration.
- New prototype page/component under `src/pages/` or a dedicated feature directory.
- New scoped stylesheet for the stage and layers.
- Targeted tests for route isolation, asset use, structure, and reduced-motion behavior.

No production HSC component, production HSC stylesheet, or generated artwork will be changed.
