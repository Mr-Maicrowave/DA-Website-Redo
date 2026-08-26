# Primary Storybook Design

## Goal

Rebuild the Primary School page below the existing hero as one continuous, animated crayon-storybook journey that follows the supplied 14-frame storyboard while preserving DA Tuition's existing Primary identity, classroom photography, and written program content.

## Experience

The page flows from the existing staircase landscape through Years 1–2 foundations and curriculum, into a signature interactive aquarium, then through Years 3–4 growth, Years 5–6 preparation, a return to the landscape, and a calm final CTA. Visual continuity comes from one blue paper plane, hand-drawn paths, overlapping painterly transitions, and section-specific transformations rather than generic fade-up reveals.

## Architecture

- `PrimarySchool.tsx` remains the route shell and preserves SEO, navigation, hero, and footer integration.
- Focused components live in `src/features/primary-storybook/` and share typed content data.
- A fixed `PrimaryJourneyLayer` owns the recurring plane and cross-section SVG route.
- GSAP ScrollTrigger drives the narrative timeline; Framer Motion remains limited to small UI interactions.
- The aquarium uses PixiJS with an imperative animation loop, pooled particles, ref-based pointer input, and accessible DOM buttons aligned to creatures.
- CSS owns responsive layout, visual transitions, and reduced-motion fallbacks.

## Required Sequence

1. Hero landscape continuation
2. Years 1–2 introduction and benefits
3. Years 1–2 curriculum
4. Interactive aquarium and fun facts
5. Aquarium-to-crayon transition
6. Years 3–4 introduction, skills, and curriculum
7. Years 5–6 introduction, outcomes, and curriculum
8. Journey Continues landscape
9. Final CTA

## Interaction and Motion

- Draw: key SVG lines use dash offset animation.
- Travel: one paper plane follows a global SVG motion path.
- React: only nearby decorative doodles respond subtly to pointer proximity.
- Transform: the route crosses painterly section boundaries; the aquarium's focused blue fish trail becomes the plane path.
- Fish wander independently, steer away from desktop pointers, stay within bounds, and reveal facts on click/tap/keyboard activation.
- Mobile removes cursor chasing and reduces fish/particle counts; tapping still reveals facts.
- Reduced motion disables parallax, continuous plane travel, cursor distortion, and high-motion fish behavior while preserving all content and fact controls.

## Content and Visual Constraints

- Keep cream/ivory surfaces, navy serif typography, pastel crayon doodles, real DA photos, and existing core copy.
- Include every curriculum stage, especially Years 1–2.
- Do not copy the High School or futuristic HSC visual language.
- Keep all essential text in the DOM and all interactive fish keyboard accessible with visible focus.
- Use generated assets under `public/primary/`; animated paths and important draw-on marks remain SVG/code-native.

## Performance

- Dynamically import PixiJS only when the aquarium approaches the viewport.
- Use requestAnimationFrame/Pixi ticker and refs for per-frame state.
- Animate transforms and opacity, pool particles, lazy-load below-fold photos, and avoid React state updates during pointer movement.
- Target smooth desktop and tablet behavior with a simplified mobile fallback.

## Validation

- Source tests verify sequence, copy, accessibility controls, asset references, and reduced-motion hooks.
- Unit tests verify fish steering, boundary handling, and discovery progression.
- Typecheck, build, and relevant tests must pass.
- Browser QA covers desktop, tablet, mobile, keyboard, and reduced-motion modes.
