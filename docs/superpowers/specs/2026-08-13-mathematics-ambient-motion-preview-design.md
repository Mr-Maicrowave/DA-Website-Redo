# Mathematics Ambient Motion Preview

## Purpose

Test whether restrained, continuously moving mathematics can give the Mathematics page more visual identity and curiosity without reducing readability or making the page feel like a video player.

The prototype will be judged in the real Mathematics layout. It will not replace the Graph Lab and it will not alter the normal public Mathematics page until it is approved.

## Preview boundary

- The prototype appears only at `/subjects/mathematics?motionPreview=1`.
- `/subjects/mathematics` continues to render the current page unchanged.
- All prototype code is contained in a small `maths-ambient-motion` feature module rather than being embedded throughout the page.
- The initial prototype uses browser-native SVG and React animation. Manim remains an authored-video option for later explanatory sequences, not a runtime dependency for ambient motion.

## First-pass experience

### 1. Hero mathematical trace

A low-opacity gold construction animates within a protected region of the Mathematics hero. A point travels along a curve while a short mathematical label resolves beside it. The motion should feel as though the mathematics on the whiteboard has become alive, while preserving the tutor, headline, CTA and hero photograph.

The loop will:

- last approximately 10 to 14 seconds;
- pause briefly at the completed state before restarting;
- avoid flashing, particles and rapid camera movement;
- remain decorative and use `aria-hidden="true"`;
- disappear when the available composition cannot safely accommodate it.

### 2. Scroll-linked living margin

One large-screen content section will gain a mathematical annotation in the otherwise empty outer margin. As the section enters the viewport, a compact diagram draws itself and a two-line explanation appears. The first concept will use a moving tangent to connect a changing graph with the idea of instantaneous rate of change.

This is not a sticky widget that follows the visitor through the entire page. It belongs to one section, remains quiet after its entrance and exits with that section.

## Responsive behaviour

- `>= 1440px`: show the full margin diagram and explanation outside the main reading column.
- `1024px–1439px`: move the diagram into a narrow, non-overlapping position within the section composition and shorten its explanation.
- `< 1024px`: omit the hero trace if it competes with the photograph; place a single static or lightly animated diagram inline between content blocks instead of using the margin.
- `prefers-reduced-motion: reduce`: render the final diagram state with no travelling point, path drawing or scroll-linked movement.

No essential copy, controls or navigation may depend on the animation being present.

## Components and ownership

- `MathsAmbientPreview`: reads the preview flag and owns the prototype boundary.
- `HeroMathTrace`: renders the decorative hero SVG and its loop.
- `LivingMarginMath`: observes one section and renders the tangent diagram plus explanation.
- `useReducedMotion` and an intersection observer control whether animation runs; the Mathematics page supplies only stable mounting points.

The shared `SubjectHero` may receive one optional visual slot. Other subject pages must remain unchanged when that slot is absent.

## Visual direction

- Preserve DA navy, gold and white, with violet reserved for a secondary mathematical quantity.
- Use crisp plotted lines and restrained glow rather than particles or generic futuristic effects.
- Keep equations in KaTeX or accessible HTML outside SVG when they convey meaning.
- Treat explanations like museum annotations: brief, specific and subordinate to the page headline.
- Avoid overlapping the tutor's face, hand, whiteboard focal markings, navigation or CTA.

## Performance and loading

- No Manim, Python, FFmpeg or video payload is required for this prototype.
- SVG paths and transforms are animated on the compositor where possible.
- The margin animation begins only when near the viewport.
- The feature adds no global scroll listener; intersection and motion values are scoped to the component.
- Target: no visible layout shift and no degradation to the hero's image loading priority.

## Failure and fallback behaviour

- Without JavaScript, the current Mathematics page remains complete.
- If intersection observation is unavailable, show the final static diagram.
- If the query parameter is absent or invalid, do not mount prototype visuals.
- If the animation cannot fit without overlap at a breakpoint, hide it rather than shrinking it into illegibility.

## Verification

- Unit-test preview flag parsing and reduced-motion/static-state behaviour where practical.
- Typecheck, lint the touched files and run the production build.
- Compare the normal and preview URLs to ensure the normal page is unchanged.
- Render-check desktop widths around 1440 and 1920 pixels, tablet at 1024 pixels and mobile at 390 pixels.
- Verify text contrast, keyboard behaviour, no pointer interception, no horizontal overflow and no obstruction of the hero content.

## Approval questions after the prototype

The review should decide whether the motion feels distinctive enough, whether the explanation earns its space, and whether future concepts should remain browser-native or receive longer optional Manim explanation clips.
