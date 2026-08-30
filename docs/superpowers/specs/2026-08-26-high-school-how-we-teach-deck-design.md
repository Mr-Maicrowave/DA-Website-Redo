# High School “How We Teach” Card Deck — Design Specification

## Purpose

Redesign the existing five-card “How We Teach” interaction on the High School page so parents feel that DA Tuition notices, understands, and adapts to each child. The section remains part of the existing continuous High School scroll journey and retains the current premium card artwork.

The interaction must feel warm, personal, calm, and premium—not like a dashboard, accordion, modal, or mechanical process diagram.

## Scope

This implementation includes:

1. A new human-centered section heading.
2. The initial horizontal five-card composition.
3. Click-to-expand interaction using the same card elements.
4. One large selected card with four stacked inactive tabs.
5. Editorial method content for Diagnose, Explain, Practise, Apply, and Review.
6. Smooth GSAP Flip transitions and content choreography.
7. Responsive desktop, tablet, and mobile layouts.
8. Generated supporting imagery required to match the approved reference.
9. Accessibility, reduced-motion support, and interaction QA.

This implementation does not include the transition into the following High School chapter.

## Existing Elements to Preserve

- The continuous High School scroll experience and existing upstream magnifying-glass handoff.
- The five existing premium card artworks and their colors:
  - Diagnose: forest green with magnifying glass.
  - Explain: blue with speech bubble.
  - Practise: purple with pencil.
  - Apply: orange with paper plane.
  - Review: gold with checklist.
- The current High School visual language: warm ivory, DA navy, forest green, antique gold, watercolor texture, serif/sans typography pairing.
- The current method order and spelling.

## Generated Assets

Use the built-in ChatGPT image generator to create only imagery missing from the repository. Do not regenerate or replace the five card artworks.

### Tutor-and-student photograph

A warm, natural tutoring scene showing a caring adult tutor working beside a high-school student at a desk. The image should communicate patient attention and collaboration rather than staged instruction.

- Natural Australian tutoring-centre atmosphere.
- Warm daylight and restrained neutral surroundings.
- Student and tutor looking at the same work.
- No visible brand logos, text, watermark, exaggerated smiles, or corporate stock-photo styling.
- Wide crop with enough environmental space for responsive use.

### Watercolor and botanical atmosphere

A transparent decorative layer used sparingly around the section edges and supporting photograph.

- Soft forest, muted blue, and antique-gold watercolor details.
- Fine botanical leaves and restrained speckles.
- Transparent background.
- No typography, cards, icons, borders, or dominant central motif.

Final selected assets must be copied into `public/images/programs/high-school-method-transition/` with descriptive versioned filenames.

## Section Heading

The heading sits directly above the default card row and is not enclosed in a card.

- Eyebrow: `02 — HOW WE TEACH`
- Main heading:
  - `Every student needs`
  - `something different.`
- Forest-green italic accent: `We start by finding out what.`
- Supporting copy:
  - `We don’t rush students through a fixed process.`
  - `We pay attention to what they understand,`
  - `where they’re getting stuck, and what they need next.`

Use generous whitespace, deep navy display typography, restrained gold details, and readable sans-serif body copy. The heading should express care before the interaction begins.

## Default State

Display all five cards in one horizontal desktop row, ordered Diagnose, Explain, Practise, Apply, Review. The cards remain large enough for their artwork to be appreciated. No method descriptions appear below individual cards.

Each card is a semantic button with a clear accessible name, visible keyboard focus, and stable dimensions. The default selected method is Diagnose, but the composition remains in its five-card overview state until a card is activated.

Below the cards, include the restrained handwritten annotation:

`Five steps. One continuous learning process.`

Place the generated tutor photograph as a lower-left emotional anchor beneath the default card row, blended into the page with the watercolor atmosphere rather than enclosed in a box. On mobile, place it after the handwritten process annotation and before the expanded method content.

## Expanded State

Activating any card rearranges the existing composition rather than opening new content below it.

### Desktop

- Left region: approximately 42%.
- Right region: approximately 58%.
- Selected card becomes a 300–360px-tall hero card.
- The other four cards become 56–72px-high horizontal tabs beneath it.
- Inactive tabs retain their original color, icon/artwork cue, and method name.
- Right region displays the selected method’s editorial explanation.

The stack must read as one premium deck. Tabs may overlap slightly but must remain easy to identify and activate.

### Tablet

Maintain the two-region composition while reducing the deck and typography proportionally. If the available width compromises readability, switch to the mobile stacking model rather than squeezing content.

### Mobile

- Selected hero card first.
- Compact, horizontally scrollable card selector immediately below it.
- Full method content underneath.
- No essential information is hidden or truncated.
- Touch targets remain at least 44px high.

## Method Content

Store all method copy in a typed data structure rather than embedding five duplicated layouts. Each method contains:

- number;
- title;
- emotional subheading;
- two-paragraph introduction;
- four “What We Do” items;
- one handwritten annotation per item;
- closing note;
- active atmosphere color.

The exact copy is the copy supplied in the user’s approved brief for Diagnose, Explain, Practise, Apply, and Review. Do not shorten or paraphrase it during implementation.

## Editorial Explanation Layout

The right side is open editorial content, not a card grid.

- Method number followed by a fine gold rule.
- Large navy serif title.
- Forest- or method-tinted italic emotional subheading.
- Short introductory paragraphs with a controlled line length.
- `WHAT WE DO` label and four vertically spaced items.
- Each item uses a small elegant marker, navy heading, supporting text, and thin gold detail.
- Handwritten gold annotations sit in the margin and appear only where space allows.
- Maximum four annotations visible.
- Closing note uses a subtle watercolor/botanical strip rather than a generic bordered card.

## Active Atmosphere

The overall section remains warm ivory. A very low-opacity watercolor atmosphere changes with the selected method:

- Diagnose: pale forest green.
- Explain: pale blue.
- Practise: pale lavender.
- Apply: pale peach-orange.
- Review: pale warm gold.

The tint supports orientation but never turns the section into a full-color panel. Text contrast must remain WCAG AA.

## Motion

Use GSAP and GSAP Flip so card elements appear to physically reorganize.

### Card transition

- Capture Flip state before changing the active method/layout.
- Move the selected card into the hero slot.
- Return the previous hero card to the inactive deck.
- Reorder inactive tabs without remounting visual cards.
- Duration: 0.55–0.75 seconds.
- Ease: `power3.inOut`.
- No bounce, rotation, card flip-over, giant zoom, or heavy blur.

### Content transition

- Existing text exits with a short opacity and 10–16px movement.
- New method number, title, subheading, and body enter in sequence.
- “What We Do” items reveal with a restrained 0.08–0.12-second stagger.
- Margin annotations arrive 0.15–0.2 seconds after their related item.
- Background atmosphere crossfades subtly.

Repeated clicks during motion must resolve to the latest selected method without leaving cards or text in an intermediate state.

### Reduced motion

When `prefers-reduced-motion: reduce` is active:

- Skip Flip movement and staggering.
- Switch layouts and content immediately or with a brief crossfade.
- Preserve all interaction, focus, and reading order.

## State and Component Boundaries

- `MethodTransition` continues owning the upstream scroll handoff and decides when the interactive method environment is settled.
- A dedicated interactive deck component owns active method state, overview/expanded state, Flip measurement, keyboard behavior, and responsive structure.
- A typed data module owns all method copy, card artwork paths, accent colors, and markers.
- A method detail component renders one shared editorial layout from the active data record.
- Visual styling remains scoped to the High School method-transition feature.

The design should not add global state or change unrelated High School sections.

## Accessibility

- Use semantic buttons for cards and inactive tabs.
- Use `aria-pressed` or an equivalent selected-state relationship.
- Maintain a visible focus indicator against every card color.
- Support Enter and Space activation.
- Support Arrow Left/Right across the default row and Arrow Up/Down in the desktop stacked deck; use Arrow Left/Right for the mobile horizontal selector.
- Announce the selected method heading without causing excessive screen-reader chatter.
- Keep DOM reading order logical in both desktop and mobile layouts.
- Provide meaningful alt text for the generated tutoring photograph; decorative atmosphere is ignored by assistive technology.

## Performance

- Decode large artwork before measuring Flip states.
- Animate transforms and opacity rather than layout properties.
- Use `will-change` only during active animation.
- Avoid duplicating full-resolution card images unnecessarily.
- Ensure generated assets are sensibly compressed for production delivery.

## Verification

### Automated tests

- All five exact method data records and copy blocks are present.
- Default overview renders all five card controls in order.
- Activating each method updates selected state and editorial content.
- Inactive deck order remains deterministic.
- Keyboard activation and navigation work.
- Reduced-motion behavior avoids Flip choreography.
- Existing magnifying-glass handoff still settles into the Diagnose card.

### Visual and interaction QA

Test at representative desktop, short-desktop, tablet, and mobile viewports:

- Heading immediately communicates human care.
- Five-card overview is visible and artwork remains legible.
- Selected card and inactive deck feel like the same physical set.
- Right-side content is readable and spacious.
- Repeated and rapid clicks do not cause layout jumps.
- Reverse selections remain visually consistent.
- Background atmosphere stays subtle.
- Mobile never squeezes the desktop layout.
- The section flows naturally from the preceding scroll animation.
- The following High School section is not redesigned in this task.

## Completion Criteria

The work is complete when the generated assets are saved in the project, the five-card interaction matches the approved reference direction, every method’s supplied copy is available, desktop and mobile interactions are polished, reduced motion and keyboard controls work, and the existing High School scroll continuity remains intact.
