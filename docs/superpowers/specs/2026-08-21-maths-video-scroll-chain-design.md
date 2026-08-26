# Mathematics video scroll chain

## Purpose

Replace the disconnected visual transitions in the desktop Mathematics syllabus story with one short, continuous cream-paper film. The visual journey must support, rather than replace, accurate HSC syllabus copy.

## Scope

The story uses three silent, 16:9, 720p desktop clips:

1. `curve-to-area`: small gold point becomes a curve and subtle accumulated area. This clip already exists and has a scrub-safe web encode.
2. `area-to-vectors`: the accumulated area resolves into a tangent/change construction, then the paper plane opens into vector motion. It supports Mathematics Advanced calculus through Extension 1.
3. `vectors-to-structure`: vectors travel through the same paper world and resolve into a richer folded spatial structure. It supports Extension 2 topics such as vectors, complex numbers, mechanics, proof and further integration.

Each next clip must use the actual final rendered frame of the preceding approved clip as its opening frame. It may not use an approximate regenerated still. This frame hand-off preserves both composition and camera direction.

## Visual direction

- One continuous editorial paper architecture: bright cream, ivory and parchment, restrained warm gold, distant navy shadow.
- The gold point stays small; the curve carries visual weight.
- Video contains no text, equations, axes, course labels, cards, logos or people.
- Course labels and syllabus claims remain live HTML. The site keeps control of accessibility, typography and curriculum accuracy.
- Camera movement is calm and forward: gentle drift, opening plane and depth reveal. No cuts, reversals, shake or sudden zooms.

## Playback

- Desktop only, when reduced motion is not requested.
- Each clip is a silent H.264 MP4, 1280x720, 24 fps, `faststart`, and frequent keyframes (at least every six frames).
- The active clip is preloaded on desktop before its scroll range. The next clip can be prefetched near the preceding hand-off.
- Scroll uses coalesced video seeking: while a seek is in flight, retain only the latest desired timestamp and issue it once `seeked` fires.
- The section retains a static poster while video cannot paint a frame.
- Mobile and reduced-motion render one static completed visual and the complete readable syllabus sequence—no video request or pinned scrub interaction.

## Hand-offs and failure behaviour

- The previous video fades only after its final frame is decoded and the next clip’s shared first frame is ready.
- If a video cannot load or decode, its poster remains visible and the live SVG/HTML story continues without blank or black media.
- A very fast desktop scroll may settle to the latest frame after one decode interval; it must not queue a backlog of stale seeks.

## Acceptance checks

- Desktop: screenshot just before and after each clip hand-off has no visual composition pop.
- Desktop: slow forward and backward scroll keeps the visible clip close to scroll position without repeated decoder stalls.
- Desktop: console contains no media errors.
- Mobile at 390px and reduced motion: no clip is requested, no overlap or blank space appears, and all six explanations remain before the HSC pathway map.
- Focused source tests, TypeScript check, targeted lint and production build pass.
