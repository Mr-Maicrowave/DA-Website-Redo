# HSC pathway short-desktop density

## Context

The desktop HSC pathway is a focused, three-column view that users may study for several minutes. At an effective `1536x824` viewport, its card is currently `845px` tall, so the top and bottom cannot sit comfortably within one screen at 100% browser zoom. The same card is appropriately spacious on a `1900x1080` viewport.

## Approved design

Add a height-driven compact desktop presentation for viewports at least `1280px` wide and no more than `900px` tall. Compact the card through spacing rather than scaling:

- reduce the outer margins in the guidance and detail columns;
- tighten vertical gaps between detail groups, disclosure, and actions;
- keep the existing font sizes, wording, column structure, and visual hierarchy;
- retain every interactive target at a minimum of `48px`;
- preserve the route geometry, node alignment, animation, focus treatment, and selected states;
- leave the tablet/mobile accordion unchanged;
- do not introduce a nested scroll area or clip content.

Tall desktop viewports retain the current, more generous spacing.

## Acceptance criteria

- At `1536x824`, the complete desktop pathway card is no taller than `776px`, leaving at least `48px` of total vertical breathing room.
- At `1440x900`, the compact card remains fully visible and all calls to action stay inside it.
- At `1900x1080`, the existing spacious desktop density remains in effect.
- All four SVG route endpoints remain within `0.25px` of their corresponding node centres at the tested desktop widths.
- Mobile and tablet continue to render the accordion, with one expanded panel and valid ARIA relationships.
- No content is hidden, clipped, reduced below its existing type size, or placed in an internal scrolling region.

## Verification

Add a rendered browser regression test for the short-desktop card height, then run the full pathway browser suite, pathway source tests, Mathematics motion tests, typecheck, feature lint, production build, and desktop visual QA at the short-height viewport.
