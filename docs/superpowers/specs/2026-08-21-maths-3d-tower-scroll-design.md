# Mathematics 3D tower scroll story

## Decision

Replace the current raster tower scroll scene. It cannot keep a screen-positioned ball aligned to a moving cropped image, and its masking cannot provide credible depth. This design uses the installed React Three Fiber and Three.js packages for a deterministic scene; Veo is not part of the primary interaction.

## Experience

The Mathematics page retains its existing live HTML introduction and six syllabus cards (Years 7-8, Years 9-10, Standard, Advanced, Extension 1 and Extension 2). Beside them, a warm ivory, navy and gold architectural tower appears as a real 3D object:

1. A single substantial polished-gold sphere starts on the upper rail.
2. Scroll advances one shared progress value. The ball travels one measured 3D spline which follows the helix rail exactly, while the camera tracks gently through the tower.
3. The tower’s translucent ivory structure and gold/navy rail supply genuine foreground occlusion; the ball is never hidden by a progress threshold.
4. Each syllabus card holds for its chapter, with only a very short non-overlapping transition.
5. At the end, the rail and tower fade into cream, the ball leaves the final rail and lands at centre, and an expanding gold bloom/ripple reveals the exact local DA Tuition logo. The logo is the supplied PNG, not generated or approximated.

## Scene architecture

`MathsTowerScene` owns the WebGL Canvas and receives a normalised `progress` prop. It builds geometry from code only:

- a `CatmullRomCurve3` / TubeGeometry helix defines the path and the visible rail from the same source of truth;
- the ball position is `curve.getPointAt(progress)` and its tangent controls subtle roll/rotation;
- glass-like tower planes, frames and levels use layered transparent materials with depth writing configured to preserve occlusion;
- camera target and camera position are interpolated from authored progress keyframes, rather than being derived from scroll pixels;
- the canvas has no text, controls, or product data.

`MathsSyllabusScrollStory` remains the orchestration and accessibility layer. GSAP ScrollTrigger writes the progress prop. It also controls the semantic card state and final DOM logo overlay. The logo overlay starts only after the ball reaches the physical landing point; tower/canvas opacity fades concurrently.

## Performance and fallbacks

Desktop motion runs only for capable desktop contexts and honours `prefers-reduced-motion`. Mobile, reduced-motion, WebGL/context failure, and low-performance detection use the existing static poster plus the six normal-flow semantic cards. The 3D scene uses simple procedural geometry, one small Canvas, capped device pixel ratio, no external model, and no network video request.

## Quality requirements

- Ball diameter is visibly substantial (roughly 28-40 CSS px at normal desktop framing), with metalness, roughness, environment highlights and a soft contact shadow.
- There is exactly one ball instance and one authored rail curve.
- Ball path and rail curve are generated from the same data, so drift is impossible.
- Occlusion comes from depth-tested geometry only: no timeline-based disappearance rules.
- The final frame fades the tower fully before/while the logo arrives; the final logo image remains byte-identical to `public/images/maths-tower-story/da-logo-full-exact.png`.
- Standard remains a separate senior route; Extension 1 and 2 are described as Advanced companions, never as an extension of Standard.

## Verification

Automated source/data tests verify one curve drives both rail and ball, exact logo use, motion fallback, one ball, no video, and HSC pathway ordering. Typecheck, focused tests, lint for touched files, build, and diff check must pass. Browser QA covers: desktop start/mid/end screenshots, a rail-contact inspection, the logo-ending state, mobile fallback, reduced motion fallback, and console health.
