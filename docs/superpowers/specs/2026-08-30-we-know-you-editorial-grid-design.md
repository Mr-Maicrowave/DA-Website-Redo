# WE KNOW YOU Editorial Grid Redesign

## Scope

Redesign only the existing `01 — WE KNOW YOU` chapter on the Why DA page. The hero, global navigation, later Why DA chapters, routes, and shared site components remain unchanged. The existing parent-perspective, closing statement, and Chapter 02 transition remain part of this chapter but sit below the new one-viewport student-story spread.

## Intended Impression

The section should feel like four real DA classroom moments deliberately composed into one warm, cinematic editorial spread. Its message is that DA notices the whole student before deciding how to teach. The real students remain the primary visual hierarchy; questions, explanatory copy, and motion support the photography.

## Desktop Composition

At viewports of 1024px and wider, the chapter heading and all four student stories occupy exactly the available viewport below the 56px navigation (`100svh - 56px`). The closing parent perspective begins immediately after that spread.

The spread uses a fixed outer timeline rail plus a twelve-column content grid divided into three unequal horizontal bands:

1. **Opening band — approximately 36% of the spread height.** The section marker and large serif statement occupy the left 34–38%; Story 01 copy occupies a narrow centre column; the older student photograph occupies the right 55–61%. This is the dominant image.
2. **Confidence band — approximately 31% of the spread height.** The raised-hand photograph occupies the left 62–68%; Story 02 copy sits on the right. A single thin gold connector runs from the image toward the copy and ends in a small point.
3. **Closing student band — approximately 33% of the spread height.** Story 03 copy occupies the left, its photograph occupies the centre, and Story 04 combines a wider photograph with an offset text block on the right. Stories 03 and 04 use unequal track widths and different image proportions.

The geometry is rectangular and ruled by 1px low-opacity warm grey/gold dividers. There are no cards, large shadows, decorative rounded containers, masonry behavior, or large navy surfaces.

## Content

The heading remains `01 — WE KNOW YOU`.

The main statement is:

> A student is more  
> than the mark on  
> their paper.

The support copy is:

> Before we teach, we take the time to truly understand who your child is, where they are now, and where they want to go.

The four stories use the exact questions, emotional labels, and body copy supplied in the approved brief. Story 04 changes from the current destination list to:

> We clarify their short-term goals and long-term aspirations to create a clear direction.

## Photography and Crop Safety

Use only the four existing files under `public/images/why-da-reference/observations/`. No person, face, expression, ethnicity, or photographic content is generated or altered.

Each photograph gets an explicit desktop and mobile `object-position`. The starting-point student’s face, the confidence student’s full raised hand and face, the concentrating student’s face/pencil/worksheet, and the goals students’ interaction remain visible at rest and through the maximum animated transform.

The confidence image uses a face-and-hand-safe treatment: a contained, uninterrupted foreground image over a softly filled version of the same photograph when the shallow crop cannot preserve both features with `cover`. This avoids clip or crop boundaries through the student while retaining a cinematic frame.

## Timeline and Interaction

A thin antique-gold rail runs near the left edge with four numbered icon nodes. Nodes are real keyboard-operable buttons with accessible labels. Hover, keyboard focus, or click activates the corresponding story; leaving the complete spread returns it to Story 01 as the neutral composition. All four stories and all copy remain visible regardless of active state.

On capable desktop devices:

- Grid tracks remain fixed during interaction so the supplied reference composition never shifts or causes reflow.
- Its image pushes from the resting scale to no more than `1.045`, with a story-specific transform origin and directional translation.
- Pointer-responsive image movement is clamped to ±4px horizontally and ±3px vertically and affects only the image inside its crop window.
- One nearby gold divider grows from roughly 35% to 100% over 500–700ms.
- The number gains opacity, the headline moves 4px, the italic label moves 7px, and body opacity increases.
- Non-active photographs remain visible at brightness 0.92; text is not faded or blurred.
- The gold timeline playhead moves to the active node over 350–650ms.

Layout state is controlled by a single active story index on the spread. React updates only on story activation. Pointer camera movement is applied directly through GSAP `quickTo`, avoiding React renders and layout reads on every pointer event.

## Initial Reveal

When the chapter first enters, one 1.2–1.6 second sequence reveals the chapter marker, draws selected divider lines, reveals the four photographs in their specified directions, and settles typography. Content is visible by default before JavaScript enhancement. The cream surface lifts naturally from the dark hero boundary over 500–800ms without changing or pinning the hero. There is no pinning, scroll-jacking, carousel behavior, or staged multi-screen wait.

Reveal directions are:

- Story 01: left to right
- Story 02: bottom to top
- Story 03: right to left
- Story 04: left to right

No reveal boundary is allowed to pause across a face or body. The confidence student remains on one uninterrupted foreground layer; animation affects its surrounding photo window/background treatment.

## Parent Perspective and Chapter Closing

Below the viewport spread, retain the real parent-perspective composition and handwritten-note concept already present. Update the visible language to the approved brief:

- `AND WHAT ARE YOU SEEING`
- `AT HOME?`
- `Parent perspective matters.`
- `You know your child best. We want to hear what you’re seeing at home so we can support them in every way possible.`

The note remains restrained, with at most 1–2 degrees rotation and a small defined shadow. No new person is generated.

The closing remains minimal:

- `WE LISTEN FIRST.`
- `Because understanding the student changes how we teach them.`

A thin gold line leads into `NEXT / 02 / WE PERSONALISE / Now that we know, we build it around them.` The copy is corrected to “Now,” not “How.”

## Responsive Behavior

Tablet uses a simplified two-column editorial composition while retaining unequal photo proportions and alternating story direction. It does not force the full desktop spread into one viewport.

Mobile becomes a single readable sequence: introduction, Story 01, Story 02, Story 03, Story 04, parent perspective, closing. Photo and copy placement alternates where the reading order remains natural. Timeline nodes remain visible as compact chapter markers but grid resizing and pointer camera movement are disabled.

## Accessibility

- Story activation works with pointer, keyboard focus, and click.
- Interactive timeline nodes have visible focus treatment and descriptive accessible names.
- Hover never reveals essential content.
- All images retain meaningful alt text.
- Body copy meets WCAG AA contrast against the ivory background.
- With `prefers-reduced-motion: reduce`, grid resizing, pointer movement, playhead travel, clip-path animation, and push-in transforms are disabled; all content and photos are immediately visible.

## Performance

CSS Grid owns static layout. Motion uses transforms, opacity, and selected clip paths only. GSAP is used only for the coordinated entrance, playhead, and smoothed pointer transform. No image dimensions animate, no continuous layout calculation runs during pointer movement, and no new image assets are downloaded.

## Implementation Boundaries

Primary files:

- `src/components/why-da/WeKnowYouSection.tsx` — semantic grid structure, active story state, timeline controls.
- `src/pages/WhyChooseDA.css` — asymmetric desktop geometry, responsive variants, crop protection, interaction states.
- `src/pages/useWhyDAMotion.ts` — coordinated entrance, playhead, and camera motion scoped to this chapter.
- Existing Why DA reference and motion tests — updated to assert the new grid, copy, accessibility hooks, viewport accounting, and reduced-motion fallback.

Do not modify the hero, navigation, or unrelated Why DA sections.

## Verification

Before completion:

1. Run the focused Why DA component, reference, and motion tests.
2. Run TypeScript and the production build.
3. Inspect desktop at 1440×900 and at least one shorter laptop viewport, confirming the heading plus four student stories end at the viewport bottom below the 56px navigation.
4. Inspect tablet and mobile reading order, focus states, text overflow, horizontal overflow, and protected face/hand crops.
5. Inspect without animation and with reduced motion enabled.
6. Confirm the hero, parent perspective, closing, and Chapter 02 transition have not regressed.
