# Standalone Mathematics Scroll Scene — Design Spec

**Date:** 2026-08-20  
**Status:** Approved direction; awaiting written-spec review  
**Scope:** Isolated prototype only — no existing website route, page, app shell, or global styling is changed.

## Purpose

Create one continuous, native-scroll mathematical journey that begins with a precise relationship and gradually reveals a spatial field of connected NSW Stage 6 topics. The final syllabus network is the destination and longest sustained moment: earlier scenes seed its motifs and relationships, rather than acting as isolated demonstrations. It is an experiential prototype, not a teaching lesson, navigation system, or production integration.

## Product Boundary

The deliverable is a portable React feature mounted only through an isolated development entry. Its public export is:

```ts
export function MathsScrollScene(): JSX.Element;
```

The feature must be copyable into a React or Next.js application with only a local stylesheet import and GSAP/Three dependencies. It must not import the DA website's router, layout, Tailwind classes, site tokens, navigation, analytics, or page components.

## Visual Direction

The scene uses warm ivory (`#f7f3eb`) as the field, deep navy (`#0b1f3a`) for typography and coordinate structure, and muted gold (`#b68a30`) for the active mathematical relationship. The composition is deliberately open: a single full-viewport canvas, sparse changing titles only when they clarify a transition, and carefully spaced labels that recede when the geometry can speak for itself. There is no persistent stage counter.

The visual reference is a finely printed mathematical folio slowly opening into space: precise ruled structure, calm type, and one active gold gesture against a large field of negative space. Depth is earned gradually through adjacent planes, parallax, and a long camera pullback; it never jumps abruptly from flat calculus to an unrelated 3D world. There are no cards, dashboards, product chrome, stock imagery, heavy gradients, glowing sci-fi interfaces, cartoon illustration, generic floating equations, or manually made art assets.

## Rendering Allocation

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Persistent mathematical objects | React Three Fiber / Three.js | Point, related function families, tangent, area mesh, neighbouring coordinate planes, vectors, complex-plane orbit, mechanics trace, camera pullback, final topic-node motifs. |
| Scroll choreography | GSAP + ScrollTrigger | One scrubbed timeline that maps document position to scene state and supports reverse travel. |
| Typography and shell | React + CSS | Minimal, changing concept title/caption, responsive spacing, focus styles, and an accessible static network summary. |
| Precise 2D marks | SVG | Coordinate planes, simple leaders, integral hatch/mask, a restrained course-membership key, and final-network connectors when crisper than WebGL. |

No manual raster or vector artwork is used. Every visual element is generated from the object data and rendering code.

## Component Architecture

```text
src/prototypes/maths-scroll/
  MathsScrollScene.tsx          # Public component; owns reduced-motion and shell
  MathsSceneCanvas.tsx          # R3F canvas and scene graph
  maths-scene-state.ts          # Typed stage values, bounds, labels, and interpolation helpers
  maths-scene-geometry.ts       # Pure generated families, calculus, vectors, mechanics, orbit, and network geometry
  useMathsScrollTimeline.ts     # GSAP ScrollTrigger setup, teardown, and scrubbed master timeline
  maths-scroll-scene.css        # Local CSS only
  MathsScrollSceneDemo.tsx      # Isolated dev-only mount, not imported by App.tsx
  maths-scene-geometry.test.ts  # Pure geometry invariants
```

`MathsScrollScene` owns DOM accessibility and the responsive shell. `MathsSceneCanvas` receives a small mutable scene-state object rather than receiving React state on every scroll tick. GSAP updates that object and invalidates the Canvas frame; the React tree does not re-render per scroll position.

## Master Scroll Timeline

The component places a `position: sticky` scene inside a normal document-flow scroll track approximately 11 viewport-heights long. `ScrollTrigger` scrubs a single linear master timeline from `0` to `1`; it never calls `preventDefault`, adjusts scroll position, or intercepts pointer/touch input. Every range is bidirectional. The final network reveal and settling occupy 34% of the scroll distance, so the syllabus structure reads as the payoff rather than a closing diagram.

| Range | Stage | Primary state change |
| --- | --- | --- |
| 0.00–0.07 | Point / relationship | A gold point establishes an origin on a near-flat coordinate folio; a quiet second point hints that relations, not isolated objects, are the starting idea. |
| 0.07–0.15 | Function emerges | A quadratic relationship, `f(x) = 0.16x² - 0.7x + 0.25`, is drawn from the point field; the original points remain as anchors. |
| 0.15–0.25 | Function families branch | Adjacent, faint coordinate planes slide into view. The quadratic is joined by a linear and exponential family, while two fine branch lines mark Functions → Trigonometry and Functions → Calculus. |
| 0.25–0.34 | Trigonometric behaviour | A sine wave travels across a neighbouring plane and aligns with the function field. The camera shifts laterally, keeping the quadratic present rather than transforming it into the wave. |
| 0.34–0.47 | Calculus | The camera moves toward the quadratic plane. A tangent reveals rate of change, then accumulation appears as a restrained area mesh; a second branch glows from Calculus → Further Calculus. |
| 0.47–0.57 | Space opens | The existing planes separate gently in depth. Their sample points gain modest z-offset and parallax before becoming a coherent vector field. |
| 0.57–0.65 | Complex rotation | One vector plane rotates toward the viewer and becomes a complex-plane orbit. The camera follows the relationship; other function and calculus planes remain visible at a distance. |
| 0.65–0.72 | Mechanics | A vector resolves into a restrained projectile trace on a newly revealed plane, linking Vectors → Mechanics without replacing the complex orbit. |
| 0.72–0.80 | Major pullback | Camera retreats decisively to reveal the full field: functions, trigonometry, calculus, vectors, rotation, mechanics, and a quiet combinatorics/probability cluster already connected by fine lines. |
| 0.80–0.91 | Network reveal | Earlier motifs condense into topic nodes; inter-topic lines draw in sequence. Functions, calculus, vectors, combinatorics, probability, statistics, and mechanics are the primary reading order. |
| 0.91–1.00 | Network settling / pathways | Connections illuminate, settle, and then reveal Standard, Advanced, Extension 1, and Extension 2 as secondary membership treatments distributed across the same network. |

The minimal caption changes only at the midpoint of a range so it does not flicker during small reverse scroll movements; it fades away during the pullback and most of the final network so the scene remains dominant.

## Mathematical Object Continuity

| Stage | Object | Reused by next stage |
| --- | --- | --- |
| Point relationship | Two anchored points on a flat folio plane | Establish the coordinate reference and seed the first relationship line. |
| Quadratic function | `f(x) = 0.16x² - 0.7x + 0.25` | Remains the calculus plane and gives the tangent/area their local meaning. |
| Function families | Linear, quadratic, exponential, and trigonometric curves on neighbouring planes | Remain spatially present and seed function, trigonometry, and calculus nodes/edges. |
| Tangent and integral | Local derivative at `x = 1.1` and a bounded sampled area mesh | Become compact calculus and further-calculus motifs; their branch is shown before the final pullback. |
| Planes and vectors | Formerly flat planes gain gentle depth, then expose sampled directional vectors | Seed vector nodes and the bridge to mechanics. |
| Complex rotation | Complex-plane radial orbit | Persists beside the mechanics plane and becomes the complex-number motif. |
| Mechanics trace | Projectile trajectory derived from a vector relationship | Keeps vectors visible as an application rather than presenting mechanics as a separate scene. |
| Combinatorics cluster | Small branching tree and discrete points revealed during the pullback | Seeds Combinatorics → Probability / Statistics before the final network appears. |
| Pullback field | All previous forms, reduced in scale but recognisable | Provides the physical locations and visual signatures of network nodes. |
| Network | Topic nodes with motif glyphs and links | Reveals course membership only after the concept relationships are legible. |

## Final Network

The final graph is a sparse, deliberately readable topic network rather than four course columns or a dense curriculum map. It is spatially organised by mathematical relationship first: Functions sits near the main function-family field and connects to Trigonometry and Calculus; Calculus connects to Further Calculus; Vectors links to Mechanics; Combinatorics branches into Probability and Statistics. Complex Numbers occupy the rotational area adjacent to vectors/further calculus. Each node retains a small visual signature from the scene that preceded it.

Standard, Advanced, Extension 1, and Extension 2 are secondary overlays across this shared graph, never separate buckets. Their membership is conveyed with subtle perimeter tints, line treatments, and low-opacity halos; nodes may show multiple appropriate pathways when a topic spans them. A very small course key may appear only after the topic topology is legible and must never become a panel or dashboard control.

The network has three phases: topic motifs coalesce into nodes, genuine prerequisite/application connections illuminate in waves, and course-membership treatments settle over the already connected structure. The final 30–35% of the timeline is intentionally quiet enough to let visitors read this result and reverse through its construction.

## Responsiveness and Accessibility

- Desktop uses an approximately eleven-viewport track; roughly 3.7 viewport-heights are reserved for the network reveal and settling. The only persistent DOM copy is an accessible scene label; contextual captioning is transient.
- Mobile keeps the one continuous narrative but uses an approximately eight-viewport track so the longer network payoff remains readable without feeling stalled. It caps device pixel ratio, hides non-essential annotation, and moves any temporary caption below the canvas.
- Canvas uses a DPR cap of `1.5` for mobile and `2` for larger screens, with modest sampled geometry and no shadows/post-processing.
- `prefers-reduced-motion` disables pinning and scroll animation, then renders the completed concept-first syllabus network with a static ordered relationship list and course-membership key below it.
- Text remains DOM text, scene canvas is labelled, and the reduced-motion content carries the same meaning without animation.
- The scene does not require pointer interaction, autoplay, or keyboard interception.

## Performance Contract

- One Canvas; no per-stage Canvas remounts.
- Geometry is generated once and reused; final-network lines and low-detail distant planes have fixed, small counts.
- Scroll updates mutate only scalar scene state and invalidate render frames.
- No animation loops run while the scene is offscreen.
- All visual transitions use opacity, transforms, geometry attributes, or camera properties — never layout reads/writes per scroll frame.

## Verification

- Start the prototype locally through the isolated demo entry; do not import it into `App.tsx`.
- Check desktop and mobile-sized viewports visually.
- Traverse the master timeline slowly, rapidly, and in reverse; confirm the scene moves through related spatial objects without hard cuts or forced literal mesh morphs.
- Confirm depth arrives progressively: a flat folio field first, neighbouring planes/parallax next, and fully spatial vectors, rotation, mechanics, then network only later.
- Confirm early branches remain visible or are spatially recalled: Functions → Trigonometry, Functions → Calculus, Calculus → Further Calculus, Vectors → Mechanics, and Combinatorics → Probability / Statistics.
- Confirm the final 30–35% is devoted to topic-network formation, connection illumination, and settling; ensure concepts are visually primary and course membership is secondary.
- Check browser console for scene, WebGL, and React errors.
- Check the reduced-motion state.
- Monitor frame cadence using browser performance tools across the pullback and full network; refine geometry, distant-plane detail, or DPR if interaction drops below a smooth normal-laptop experience.
- Run TypeScript and the focused pure-geometry test. Build only after preserving the existing worktree's unrelated changes.

## Explicitly Out of Scope

- Integration into the site, routing, or production navigation.
- New dependencies (GSAP, Three, and React Three Fiber are already installed).
- User controls, lesson questions, scoring, topic deep-links, persistent progress, or audio.
- Scroll-jacking, slides, hard cuts, static asset pipelines, or hand-drawn complex SVG illustration.
