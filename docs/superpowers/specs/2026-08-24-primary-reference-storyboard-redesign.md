# Primary School Reference Storyboard Redesign

## Scope

Redesign only the content after the existing Primary School hero on `/programs/primary-school`. Preserve the navbar, hero, route, year navigation, consultation links, mobile menu, real DA photography, and aquarium behavior.

The supplied storyboard is the primary composition reference. The implementation must reproduce its compact editorial rhythm, cream ground, navy typography, scrapbook photography, pastel crayon language, asymmetric section proportions, and connected journey.

## Asset-first workflow

All new raster assets are generated and reviewed before page implementation begins. Existing illustrated assets may be reused only when they visually match the supplied reference. Existing DA photographs remain authentic and are not regenerated.

Generate these project-bound assets:

1. Years 1–2 transparent crayon decoration set: smiling cloud, stars, pencil, flower, open book, blocks, curved marks.
2. Years 1–2 curriculum transparent illustration set: large house plus book, pencil, and blocks.
3. Aquarium environment rebuilt as separate water background, distant reef, midground reef, foreground reef, bubbles, and seven transparent creature sprites. These replace mismatched artwork while preserving the PixiJS engine.
4. How We Teach transparent dashed-path and accent set in blue, pink, green, and orange.
5. Years 3–4 transparent academic crayon set: paper plane, maths equation, pencil marks, stars, learning icons.
6. Years 5–6 transparent academic crayon set: geometry, equations, graph, books, arrow, lightbulb.
7. Program-bag objects as four separate transparent assets: large blue-and-gold backpack, blue spiral notebook, green pencil case, pink storybook. No generated logo or baked text. The official project crest is overlaid separately.
8. Program-helper miniature crayon icons.
9. Why Families Choose DA transparent icon strip.
10. Wide illustrated closing meadow, hills, and path, with sufficient calm negative space for HTML CTA copy.

Assets use a shared coloured-pencil/crayon medium: visibly textured strokes, slight handmade irregularity, restrained pastel blue/pink/orange/sage/gold, transparent backgrounds where compositing is required, no text, no watermark, no invented branding.

## Page composition

The post-hero content uses a fluid editorial canvas capped around 1440px. Desktop proportions follow the supplied reference closely; content remains HTML and is never baked into generated artwork.

1. **Years 1–2 Foundations:** three-column composition with editorial heading left, irregular real DA photo center, four outcomes right.
2. **Years 1–2 Curriculum + Aquarium:** approximately 38/62 split. Curriculum and large house illustration left; preserved interactive Pixi aquarium right.
3. **How We Teach:** centered heading and four real DA photo moments connected by one sequential crayon path.
4. **Years 3–4:** heading and supporting copy left, group photo center, outcomes and compact curriculum right.
5. **Years 5–6:** mature dusty-blue variation with real classroom photo, four outcomes, and curriculum content.
6. **Find Their Place:** helper copy at left; oversized bag composition dominates the section. Each program object is an independent keyboard-accessible control.
7. **Why Families Choose DA:** thin four-column editorial strip, not cards.
8. **Final CTA:** wide calm landscape reconnecting the end of the page to the existing journey visual.

Section edges and crayon paths visually overlap so the experience reads as one story rather than a stack of cards.

## Photography

Use existing real DA imagery selected from `public/images/community/`:

- Years 1–2: tutor with a young student.
- How We Teach: four distinct explanation, guided practice, independent work, and positive review moments.
- Years 3–4: tutor with a small student group.
- Years 5–6: larger upper-primary classroom.
- Program selection remains focused on the illustrated object and HTML description; it does not introduce an additional photo panel.

Photos use subtle irregular paper masks, restrained shadows, individual rotation, and occasional generated tape/accent marks. They remain recognizable and are not AI-modified.

## Interaction and motion

- Preserve the current aquarium swimming, pointer avoidance, continuous water wake, click ripples, bubbles, facts, accessible fish controls, and discovery counter.
- Use GSAP/ScrollTrigger for purposeful placement and path-drawing sequences.
- Doodles draw in small organic groups using SVG/CSS stroke animation where appropriate.
- How We Teach runs in sequence: photo settles, path draws, next photo settles.
- The curriculum paper-plane path visually enters the aquarium; the exit fish trail becomes the Years 3–4 plane path.
- Program objects rise independently about 14px on hover/focus/tap. Selection emphasizes one object without bouncing the bag.
- Reduced-motion mode removes continuous movement and replaces entrances with immediate or short crossfade states.
- Off-screen expensive animation pauses.

## Responsive behavior

- Desktop retains the compact reference proportions and asymmetric grids.
- Tablet preserves all content, reducing secondary doodles and path complexity.
- Mobile stacks content vertically, keeps authentic photography and the interactive aquarium, and places tappable program objects around or beneath the bag without horizontal overflow.
- Interactive targets remain at least 44px and keyboard focus is visible.

## Architecture

- Keep `PrimarySchool.tsx` responsible for the preserved hero and story ordering.
- Split post-hero sections into focused components under `src/features/primary-storybook/`.
- Centralize copy, icon metadata, photo paths, and program data in typed data modules.
- Keep aquarium physics/rendering isolated from layout components.
- Add a dedicated GSAP hook for section choreography with complete cleanup.
- Keep section CSS in the Primary story stylesheet or focused companion stylesheets where size warrants separation.

## Verification

- Source tests confirm exact section order, required copy, preserved hero boundary, program accessibility, aquarium functionality, and reduced-motion handling.
- TypeScript and relevant unit tests must pass.
- Browser QA at desktop, tablet, and 390px mobile verifies composition, overflow, interactive aquarium, program selection, keyboard controls, and console errors.
- Final visual comparison checks spacing, proportion, heading scale, photograph scale, crayon density, cream consistency, schoolbag prominence, and photo/illustration balance against the supplied reference.
