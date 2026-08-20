# Standalone Mathematics Scroll Scene — Design Spec

**Date:** 2026-08-20  
**Status:** Approved direction; awaiting written-spec review  
**Scope:** Isolated prototype only — no existing website route, page, app shell, or global styling is changed.

## Purpose

Create one continuous, native-scroll mathematical journey that demonstrates how a single geometric idea expands into Stage 6 concepts and finally reveals a connected syllabus structure. It is an experiential prototype, not a teaching lesson, navigation system, or production integration.

## Product Boundary

The deliverable is a portable React feature mounted only through an isolated development entry. Its public export is:

```ts
export function MathsScrollScene(): JSX.Element;
```

The feature must be copyable into a React or Next.js application with only a local stylesheet import and GSAP/Three dependencies. It must not import the DA website's router, layout, Tailwind classes, site tokens, navigation, analytics, or page components.

## Visual Direction

The scene uses warm ivory (`#f7f3eb`) as the field, deep navy (`#0b1f3a`) for typography and coordinate structure, and muted gold (`#b68a30`) for the active mathematical object. The composition is deliberately open: a single full-viewport canvas, a small stage counter, an academic title/caption rail, and carefully spaced labels. There are no cards, product chrome, stock imagery, heavy gradients, cartoon illustration, or manually made art assets.

The visual reference is a finely printed mathematical folio brought into space: precise ruled structure, calm type, and one active gold gesture against a large field of negative space.

## Rendering Allocation

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Persistent mathematical objects | React Three Fiber / Three.js | Point, line, sampled function, tangent, area mesh, axes, vectors, complex-plane orbit, camera pullback, final network nodes. |
| Scroll choreography | GSAP + ScrollTrigger | One scrubbed timeline that maps document position to scene state and supports reverse travel. |
| Typography and shell | React + CSS | Stage number, concept title, short explanatory copy, progress rule, responsive spacing, focus styles. |
| Precise 2D marks | SVG | Coordinate axes, simple leader lines, the integral hatch/mask, and final-network structural connectors when crisper than WebGL. |

No manual raster or vector artwork is used. Every visual element is generated from the object data and rendering code.

## Component Architecture

```text
src/prototypes/maths-scroll/
  MathsScrollScene.tsx          # Public component; owns reduced-motion and shell
  MathsSceneCanvas.tsx          # R3F canvas and scene graph
  maths-scene-state.ts          # Typed stage values, bounds, labels, and interpolation helpers
  maths-scene-geometry.ts       # Pure generated curve, area, vectors, orbit, and network geometry
  useMathsScrollTimeline.ts     # GSAP ScrollTrigger setup, teardown, and scrubbed master timeline
  maths-scroll-scene.css        # Local CSS only
  MathsScrollSceneDemo.tsx      # Isolated dev-only mount, not imported by App.tsx
  maths-scene-geometry.test.ts  # Pure geometry invariants
```

`MathsScrollScene` owns DOM accessibility and the responsive shell. `MathsSceneCanvas` receives a small mutable scene-state object rather than receiving React state on every scroll tick. GSAP updates that object and invalidates the Canvas frame; the React tree does not re-render per scroll position.

## Master Scroll Timeline

The component places a `position: sticky` scene inside a normal document-flow scroll track approximately 10 viewport-heights long. `ScrollTrigger` scrubs a single linear master timeline from `0` to `1`; it never calls `preventDefault`, adjusts scroll position, or intercepts pointer/touch input. Every range is bidirectional.

| Range | Stage | Primary state change |
| --- | --- | --- |
| 0.00–0.08 | Point | Gold point settles at origin; axes fade in. |
| 0.08–0.17 | Line | Point extrudes along x; origin stays visible as the line's root. |
| 0.17–0.29 | Function | The line's evenly spaced points are displaced into a cubic function. |
| 0.29–0.39 | Tangent | A local derivative line pivots at the original anchor; `Δx` contracts. |
| 0.39–0.50 | Area | Function samples stitch into a translucent area-under-curve mesh and hatch. |
| 0.50–0.61 | Vectors | Axes rotate to 3D; former curve samples lift into vector endpoints. |
| 0.61–0.70 | Rotation | Vectors settle to a complex plane; a gold radius traces a rotational orbit. |
| 0.70–0.80 | Pullback | Camera retreats; earlier forms become legible small motifs in one field. |
| 0.80–0.91 | Network | Motifs become syllabus nodes and draw their relationship lines. |
| 0.91–1.00 | Syllabus | Network settles into four linked pathways: Standard, Advanced, Extension 1, Extension 2. |

The caption changes only at the midpoint of each range so it does not flicker during small reverse scroll movements.

## Mathematical Object Continuity

| Stage | Object | Reused by next stage |
| --- | --- | --- |
| Point | Origin `P(0,0)` | Remains the root and tangent contact point. |
| Line | Sampled x-axis segment | Its samples become function vertices. |
| Function | `f(x) = 0.16x² - 0.7x + 0.25` | Supplies tangent contact, area samples, and later vector endpoints. |
| Tangent | Local derivative at `x = 1.1` | Shares the function's sampled anchor. |
| Integral | Bounded sampled mesh under `f(x)` | Mesh vertices lift into the vector field. |
| Vectors | 3D vector endpoints derived from samples | Project into complex-plane radial vectors. |
| Rotation | Unit-circle-like complex orbit | Its positions become the radial structure behind final topic nodes. |
| Pullback | All prior forms, reduced in scale | Become recognisable visual signatures for topic nodes. |
| Network | Nodes with motif glyphs | Resolves into the final syllabus relationships. |

## Final Network

The final graph is a sparse, deliberately readable structure rather than a dense curriculum map. It groups topics by pathway:

- Standard: finance, networks, probability, non-linear relationships.
- Advanced: functions, calculus, statistics, trigonometry.
- Extension 1: vectors, parametrics, further calculus.
- Extension 2: complex numbers, mechanics, advanced integration.

Relationship lines express genuine progression: functions connect to calculus and trigonometry; calculus connects to Extension 1 and Extension 2; vectors bridge Extension 1 and mechanics; complex numbers form the rotational endpoint. A small legend uses line and tint only, avoiding a card-like UI.

## Responsiveness and Accessibility

- Desktop uses a ten-viewport track with labels on the left rail.
- Mobile keeps the one continuous narrative but shortens the track to roughly seven viewports, uses a capped device pixel ratio, hides non-essential annotation, and moves the caption below the canvas.
- Canvas uses a DPR cap of `1.5` for mobile and `2` for larger screens, with modest sampled geometry and no shadows/post-processing.
- `prefers-reduced-motion` disables pinning and scroll animation, then renders the completed syllabus network with a static ordered concept list below it.
- Text remains DOM text, scene canvas is labelled, and the reduced-motion content carries the same meaning without animation.
- The scene does not require pointer interaction, autoplay, or keyboard interception.

## Performance Contract

- One Canvas; no per-stage Canvas remounts.
- Geometry is generated once and reused; final-network lines have a fixed, small node count.
- Scroll updates mutate only scalar scene state and invalidate render frames.
- No animation loops run while the scene is offscreen.
- All visual transitions use opacity, transforms, geometry attributes, or camera properties — never layout reads/writes per scroll frame.

## Verification

- Start the prototype locally through the isolated demo entry; do not import it into `App.tsx`.
- Check desktop and mobile-sized viewports visually.
- Traverse the master timeline slowly, rapidly, and in reverse; confirm each transition is continuous and deterministic.
- Check browser console for scene, WebGL, and React errors.
- Check the reduced-motion state.
- Monitor frame cadence using browser performance tools; refine geometry/DPR if interaction drops below a smooth normal-laptop experience.
- Run TypeScript and the focused pure-geometry test. Build only after preserving the existing worktree's unrelated changes.

## Explicitly Out of Scope

- Integration into the site, routing, or production navigation.
- New dependencies (GSAP, Three, and React Three Fiber are already installed).
- User controls, lesson questions, scoring, topic deep-links, persistent progress, or audio.
- Scroll-jacking, slides, hard cuts, static asset pipelines, or hand-drawn complex SVG illustration.
