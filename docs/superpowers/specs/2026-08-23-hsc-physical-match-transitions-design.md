# HSC Physical Match Transitions — Design Specification

## Objective

Rebuild the existing HSC cinematic journey so it reads as one continuous painted world. The nine generated backgrounds and live HTML headings remain unchanged. The horizontal 900vw scene strip is removed because it exposes vertical seams and adjacent complete artworks during transitions.

The sequence remains cap-free. References to a graduation cap in the supplied transition brief are intentionally superseded by the user's later instruction to keep the sequence cap-free.

## Core Architecture

- Keep one pinned viewport and one GSAP master timeline with one ScrollTrigger.
- Stack all nine scenes in the same absolute viewport coordinates.
- Exactly one complete illustration is visually dominant at every scroll position.
- Incoming scenes may exist underneath the active scene, but they are revealed only while a physical foreground surface covers the viewport.
- Never translate complete 100vw scene panels horizontally.
- Never expose two full backgrounds side by side.
- Never use a full-section opacity crossfade as the transition mechanism.
- Use live HTML for scene numbers, headings, and supporting copy.
- Keep the existing generated backgrounds at `public/hsc-journey/frames/frame-01.png` through `frame-09.png`.

## Scene Composition Model

Each scene is an absolute layer containing one complete background image. Scene state is controlled with `visibility`, `z-index`, transforms, and clip/mask properties. The outgoing scene stays visible until a transition cover has concealed the viewport. The timeline then switches the underlying scene while the cover remains opaque.

Transition covers are code-generated DOM/CSS/SVG layers:

- `paper-cover`: warm ivory paper with subtle ruled texture.
- `cream-cover`: quiet warm-cream watercolor field.
- `desk-bridge`: broad wood-and-paper foreground band used for the continuous workspace glide.
- `cloud-cover`: pale cream/blue watercolor-shaped SVG mask.
- `pigment-reveal`: pale blue SVG/CSS mask used for paper-to-sky transformation.

These are transition surfaces, not additional storyboard image assets.

## Transition Choreography

### 01 → 02 — Notebook Passage

- Scene 01 receives a gentle forward camera push.
- Desk content moves downward and outward with bounded parallax.
- A code-generated notebook/paper surface enters from the lower foreground and scales until it covers at least 115% of the viewport.
- Scene 02 becomes active underneath while the paper cover is fully opaque.
- The paper continues in the same direction and exits, revealing Scene 02.
- No neighboring scene edge or crossfade is visible.

### 02 → 03 — Flying Paper Wipe

- Scene 02 tracks forward slightly faster.
- A loose paper surface approaches from the upper-right, rotates gently, and scales past the viewport bounds.
- Scene 03 activates while the paper fills the viewport.
- The sheet exits toward the lower-left without reversing camera direction.

### 03 → 04 — Chaos to Clarity

- Scene 03 accelerates into its large quiet ivory region.
- The background scales and translates so busy papers and the clock move outside the viewport.
- A cream watercolor cover expands radially until it fills the viewport.
- Scene 04 activates behind the cover.
- The cover softens through an SVG mask, revealing the organised DA workspace from the lower area upward.

### 04 → 05 — Continuous Workspace Glide

- No full-screen wipe is used.
- A shared foreground desk band remains visually continuous across the transition.
- Scene 04 pans slowly left within a clipped viewport while the desk bridge conceals the lower scene boundary.
- Scene 05 activates behind the desk bridge and resolves from right to left.
- DA planning materials leave the camera while feedback, marked work, goals, and progress enter with matched scale and movement.
- At no point are two complete frames visible together.

### 05 → 06 — Paper to Examination Desk

- Camera pushes toward the largest pale paper region in Scene 05.
- A ruled paper cover aligns to that paper's angle and scales to fill the viewport.
- Scene 06 activates while the paper is fully covering the viewport.
- The paper cover translates and scales into the perspective of the foreground examination paper, revealing the exam room behind it.

### 06 → 07 — Examination Camera Tilt

- Scene 06 moves forward down the room at corridor pace.
- Camera then tilts downward through transform-origin and vertical translation.
- Rows of desks move upward and out of frame.
- The foreground exam paper enlarges until it fills most of the viewport.
- Scene 07 activates under the paper surface with aligned perspective and color.
- The cover resolves directly into the close-up HSC booklet.

### 07 → 08 — Paper to Sky

- Camera dives into a blank region of the HSC paper.
- Paper grain scales beyond recognition and fills at least 115% of the viewport.
- A pale-blue pigment mask grows through the paper from the edges and lower-left watercolor area.
- Scene 08 activates below the pigment layer.
- The pigment mask opens to reveal the full cloudscape.
- No cap enters; the sequence remains cap-free.

### 08 → 09 — Cloud to Future

- Scene 08 performs a rapid upward chase into a large pale cream/blue cloud region.
- The cloud cover expands beyond all viewport edges and becomes fully opaque.
- Scene 09 activates behind it while covered.
- Scene 09 starts slightly enlarged and positioned on its color-matched sky.
- The cloud cover opens from the bottom with an SVG mask.
- Horizon, university, skyline, paths, and river emerge progressively from bottom to top.
- Camera settles into a slow cinematic pull-back.
- Scene 08 and Scene 09 are never placed side by side and no vertical seam can appear.

## Camera Rhythm

- Scene 01: gentle push.
- Scene 02: steady forward tracking.
- Scene 03: faster pressure-driven tracking.
- Scene 04: slow and settle.
- Scene 05: lateral workspace glide.
- Scene 06: corridor push.
- Scene 07: top-down dive.
- Scene 08: rapid upward cloud chase.
- Scene 09: slow pull-back and rest.

Easing varies by transition. Physical covers use `power2.in` while approaching and `power2.out` while leaving. Camera settles use `power1.inOut`. No bounce or elastic easing is used.

## Copy Behavior

- Only one scene's copy is visible at a time.
- Outgoing copy leaves before the physical cover reaches full viewport coverage.
- Incoming copy enters only after its scene is visually established.
- Copy never overlaps across scenes.
- Background object text remains baked into the generated image and is not animated separately.

## Responsive Behavior

- Desktop and tablet use the same physical match-transition model.
- Mobile preserves the complete contained background image.
- Transition covers scale relative to viewport dimensions so they exceed every edge on portrait and landscape screens.
- Camera translations are reduced on mobile to prevent excessive empty space.
- The scene remains free from horizontal page overflow.

## Reduced Motion

When `prefers-reduced-motion: reduce` is active, disable the pinned master timeline and present the existing vertical static journey. No masks, camera pushes, or pinned transitions run.

## Loading and Reverse Scroll

- Preload and decode all nine background frames before activating the master timeline.
- Keep the warm ivory loading surface visible until critical images decode.
- All timeline operations must be deterministic and reversible when scrubbing upward.
- Scene visibility switches occur only at points where an opaque cover fills the viewport.

## Acceptance Criteria

- Zero horizontal translation of complete scene panels.
- Zero visible vertical seams at any scroll position.
- Zero moments showing halves of two complete storyboard frames.
- Zero full-section opacity-only crossfades.
- Zero graduation-cap elements or assets in the sequence.
- Exactly one master GSAP timeline and one ScrollTrigger.
- Every transition uses its specified physical cover or camera match.
- Scene 08 → 09 visibly enters a cloud, switches while covered, reveals the landscape from bottom upward, and ends with a slow pull-back.
- Reverse scrolling reconstructs every transition without blank frames or stale copy.
- Desktop and mobile have no horizontal document overflow.
- Reduced-motion mode remains readable and static.

## Verification

- Structural test confirms stacked absolute scenes and absence of horizontal full-scene translation.
- Structural test confirms cap and MotionPath code remain absent.
- Browser QA scrubs each of the eight transition windows forward and backward.
- Browser QA pauses at transition start, midpoint, and end to check for seams, blank frames, copy overlap, and multiple complete artworks.
- Dedicated visual inspection covers Scene 08 → 09 on desktop and mobile.
- Run focused journey tests, TypeScript checks, and a production build.
