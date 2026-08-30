# HSC Learning Formats Explorer — Design Specification

## Objective

Rebuild the below-hero HSC learning-formats area as a single interactive editorial explorer matching the approved reference. The explorer must let families compare four support formats without leaving the section while preserving the existing hero, earlier editorial sequence, and single continuous living-watercolor video background.

## Scope

The new explorer replaces the current dedicated Private Tuition panel beneath the four-path support journey. It does not alter the hero, the four “Why These Years Matter” scenes, the support-journey section above it, or unrelated routes.

The explorer contains:

- a desktop vertical selector for four formats;
- one reusable active-format brochure panel;
- a clickable photo that flips to format-specific parent questions;
- previous/next navigation with wraparound;
- keyboard navigation while focus is inside the explorer;
- a mobile horizontal selector and vertically ordered content;
- reduced-motion behavior.

## Visual Composition

### Background and shell

- Keep the existing living-watercolor video mounted once behind the entire below-hero experience.
- Do not generate or add another landscape background.
- Apply only a translucent cream readability wash, approximately 0.58–0.72 opacity.
- Constrain the explorer to roughly 1450–1550px.
- Desktop split: approximately 30% selector and 70% active panel.
- Avoid a single opaque section rectangle, glossy UI, glassmorphism, heavy shadows, and dashboard-style tabs.

### Left selector

- Eyebrow: “EXPLORE OUR FOUR / WAYS TO LEARN”.
- Heading: “Different students / need different / kinds of support.”
- Supporting copy from the approved brief.
- Four connected selector buttons with a vertical progress line.
- Active item uses deep navy, a gold number and marker, cream text, and a small gold edge pointer.
- Inactive items use transparent backgrounds, lower emphasis, and thin dividers.
- Bottom handwritten instruction note.

### Right brochure panel

- Warm ivory paper texture, restrained radius, subtle paper shadow, navy and antique-gold typography.
- Header with format number, title, and handwritten tagline.
- Large format-specific photo with an editorial brush/torn edge.
- Visible lower-right “Questions parents ask ↗” cue.
- Three format attributes.
- “Best For” checklist.
- “How It Works” process.
- Bottom previous/current/next controls and progress dots.

## Content Model

Use one `classFormats` data structure containing four objects. Each object includes:

- `id`, `number`, `title`, `shortTitle`, `navDescription`;
- `tagline`, optional secondary handwritten line;
- `image`, image alt text;
- three `attributes` with generated icon paths;
- five `bestFor` items;
- four or five `process` steps with generated icon paths;
- four `parentQuestions` with generated icon paths;
- previous and next display labels derived from array position.

One shared markup tree renders the active object. Four duplicated panel trees are prohibited.

## Interaction State

The explorer owns:

- `activeIndex: number`;
- `isFlipped: boolean`;
- a root ref used to scope keyboard handling.

Changing formats always resets `isFlipped` before the next format appears.

Selectors, previous, next, photo front, and FAQ return controls are native buttons. The active selector exposes `aria-current="true"` or `aria-pressed="true"`. Photo controls receive format-specific accessible labels.

Previous/next wraps between indices 0 and 3. Left/right keyboard arrows work only when focus is within the explorer. Mobile swipe is optional and must not delay or destabilize the core implementation.

## Photo Flip

- Implement an in-place 3D card flip, not a modal or route change.
- Use `perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`, and `rotateY(180deg)`.
- Duration: 600–750ms with a restrained power/ease-in-out curve.
- Front: generated format photo and interactive cue.
- Back: warm reassurance-paper asset, heading, subline, four questions, and return action.
- Changing format from the back immediately resets the card to its front before the content transition.
- With reduced motion, replace the 3D rotation with an instant swap or short opacity transition.

## Format Content

All format titles, taglines, attributes, Best For items, process steps, and parent-question copy follow the user-provided brief verbatim. No class-size number or other DA operational fact may be invented. Small-group class size uses the supplied neutral wording unless existing project data provides an authoritative value.

## Asset Manifest

Create every visual through ChatGPT Image Generator as a separate project-bound PNG. Do not reuse existing Lucide icons or previously generated HSC icons in this explorer.

### Photographs — 4

1. `explorer-private-photo.png`
2. `explorer-small-group-photo.png`
3. `explorer-hsc-prep-photo.png`
4. `explorer-trial-prep-photo.png`

Each is generated independently with natural editorial photography, realistic hands/materials, no readable text, no logos, and composition matching its format.

### Attribute icons — 12

Three separately generated icons per format, named `explorer-<format>-attribute-<slug>.png`.

### Process icons — 19

- Private Tuition: 4
- Small Group Classes: 5
- HSC Preparation: 5
- Trial Preparation: 5

Each is a separately generated icon named `explorer-<format>-process-<slug>.png`.

### Parent-question icons — 16

Four separately generated icons per format, named `explorer-<format>-faq-<slug>.png`.

### Paper and instruction assets — 3

1. `explorer-panel-paper.png`
2. `explorer-reassurance-paper.png`
3. `explorer-instruction-accent.png`

Total: 54 separately saved assets in `public/media/hsc/editorial/explorer/`.

All icons share a coherent antique-gold watercolor line-art system, but each is generated as its own file. Generated text is prohibited; all meaningful copy remains HTML. Any false checkerboard background must be rejected or removed from the visible crop before integration.

## Transitions

Use Framer Motion, already installed, unless repository inspection proves GSAP is already the established mechanism for this component.

Target sequence:

- outgoing photo shifts about 20px and fades;
- outgoing heading softens;
- active marker moves along the selector;
- incoming photo enters from the navigation direction;
- heading and tagline follow;
- attributes, Best For, and process reveal with a restrained stagger;
- total change completes in approximately 700–850ms.

No bounce, spin, zoom burst, or background remount.

## Responsive Design

At 820px and below:

- replace the vertical selector with a horizontally scrollable row of four 44px-minimum buttons;
- render active content in this order: header, tagline, flip card, attributes, Best For, process, previous/next;
- allow the panel to grow vertically rather than simulating a pinned desktop viewport;
- keep every control at least 44px;
- prevent horizontal page overflow;
- maintain legible text and uncropped generated artwork.

## Component Boundaries

Create a focused explorer component and stylesheet rather than continuing to enlarge `HSCWhyYearsMatter.tsx`:

- `src/components/hsc/HSCLearningFormatsExplorer.tsx`
- `src/components/hsc/HSCLearningFormatsExplorer.css`
- `src/components/hsc/HSCLearningFormatsExplorer.test.ts`
- `src/components/hsc/hscLearningFormatsData.tsx` when JSX-bearing content/icons require TSX; otherwise `.ts`.

`HSCWhyYearsMatter.tsx` imports and renders the explorer at the current Private Tuition panel position.

## Testing and Verification

Automated coverage must verify:

- all four formats are represented in one data structure;
- selectors and previous/next controls update the active format;
- navigation wraps in both directions;
- all four photo fronts flip to unique FAQ backs;
- changing format resets the flip state;
- keyboard navigation is scoped to the explorer;
- required accessible labels and active-state attributes exist;
- existing HSC editorial assets and continuous landscape video remain unchanged;
- no legacy dedicated Private Tuition panel remains.

Final validation:

- component tests and existing HSC landscape tests;
- ESLint for touched TypeScript/TSX;
- `git diff --check`;
- desktop visual QA at 1440×900;
- mobile visual QA at 390×844;
- no horizontal overflow;
- no clipped copy or media;
- all 54 asset requests resolve successfully;
- no console errors;
- living background remains continuously mounted through format changes.

## Out of Scope

- hero redesign;
- changes to earlier HSC editorial scenes;
- replacing the living background;
- separate routes or stacked sections for each format;
- modal FAQ experiences;
- invented DA statistics or class-size claims.
