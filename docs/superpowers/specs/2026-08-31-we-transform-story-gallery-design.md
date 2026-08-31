# 04 — We Transform Story Gallery

## Objective

Insert a new `04 — WE TRANSFORM` chapter between the existing `03 — WE CARE` and `05 — WE SUCCEED` chapters. The section presents five real transformation stories simultaneously, defaults to story 03, and transitions directly from warm cream into the existing dark navy finale.

The supplied reference is the primary visual target. Chapters 03 and 05 remain structurally unchanged except for their connecting labels and any minimal seam-spacing required at the handoff.

## Composition

The section uses the existing DA cream, deep navy, antique gold, serif display typography, and restrained sans-serif labels.

Desktop contains:

1. Centered `04 / WE TRANSFORM` chapter label.
2. Two-line headline: “Change looks different / on everyone.” with “everyone.” in gold italic.
3. Supporting line: “Five stories. Five different journeys.”
4. Optional annotations: “Real students.” and “Real journeys.”
5. Five portrait panels visible at once. Story 03 is active and wider by default.
6. Left and right circular navigation controls.
7. A thin five-point progress line with compact story labels.
8. Closing line: “Five different stories. / One reason we keep going.”
9. A restrained “Scroll to the finale” prompt and a thin gold seam into chapter 05.

The section targets roughly 950–1250px on desktop and must not pin or scroll-jack.

## Component Architecture

### `transformStories.ts`

Exports five `TransformStory` objects. Each object contains:

- `id`
- `number`
- `category`
- `shortLine`
- `quote`
- `emphasis`
- `videoSrc`
- `poster`
- `captions`
- `duration`
- `objectPositionDesktop`
- `objectPositionTablet`
- `objectPositionMobile`

All video, poster, caption, and duration values begin as `null`. Replacing media later requires data changes only.

### `WeTransformSection.tsx`

Owns active-story state, gallery keyboard handling, previous/next navigation, modal state, and pointer-response state. It renders the section intro, gallery, progress navigation, closing line, and viewer.

### `TransformStoryPanel`

Receives one story, active status, and activation/watch callbacks. The whole panel is keyboard focusable and selectable. It renders a neutral warm placeholder while `videoSrc` is null. A real video uses `playsInline`, `muted`, `loop`, and `preload="none"` or `metadata`, with active and adjacent stories prioritized.

Inactive panels show number, play icon, category, and short transformation line. The active panel additionally reveals the quote, supporting copy, and `WATCH STORY` control.

### `TransformStoryViewer`

One shared accessible dialog renders the selected real video. It provides play/pause, progress, mute/unmute, captions when supplied, and close. Escape closes it and focus returns to the triggering panel. Placeholder stories do not open an empty viewer.

## Interaction Model

`activeIndex` defaults to `2`.

- Fine-pointer hover activates a panel.
- Click or keyboard activation selects a panel.
- Clicking the already-active panel or its `WATCH STORY` control opens the viewer only when media exists.
- Left/right buttons move through the five stories and wrap at the ends.
- Left Arrow and Right Arrow work while focus is within the gallery.
- Mobile uses native horizontal scrolling and scroll snap. Selecting a panel scrolls it into the dominant position.
- The active story never advances automatically.

Placeholder panels retain the complete expansion, compression, progress, and text-transition behavior.

## Responsive Layout

### Desktop

Use a five-column CSS grid. The active column uses approximately `1.75fr`; inactive columns use `1fr`. Gaps remain 8–14px. Width is `min(92vw, 1600px)` and panel height is clamped around 500–620px. Grid-track transitions use 750–850ms with an exponential/power3-style easing.

### Tablet

Switch to an overflow-x scroll-snap track. The active panel occupies about 58–64vw and neighboring panels remain partially visible at 24–30vw. Arrow and progress navigation remain available.

### Mobile

Show one dominant portrait panel at roughly 82–88vw with previous/next peeks. Native touch scrolling provides swipe behavior. Hover logic is disabled. Progress navigation remains fully usable.

## Motion

On viewport entry:

1. Chapter label fades in.
2. Headline reveals upward through a mask.
3. Gold emphasis follows by approximately 120ms.
4. Supporting line fades in.
5. All five panels open simultaneously from narrow vertical slits using `clip-path: inset(0 48% 0 48%)` to `inset(0)` over 800–1000ms.

Active-state changes animate the grid widths and panel copy. Quote and description move no more than 12px. Real active video scales no more than `1.02`. Fine-pointer response inside the active panel is limited to ±3px horizontally and ±2px vertically with no tilt.

At the chapter transition, the gallery may move upward 10–18px and soften slightly while the existing navy finale enters below. No pinning occurs.

Reduced motion removes slit reveals, grid morphing, cursor response, and large transforms. Content remains visible and changes through immediate state or short opacity transitions.

## Accessibility

- Semantic section heading and labelled gallery.
- Interactive panels and arrows use buttons.
- Visible focus treatment meets DA contrast requirements.
- Left/Right Arrow navigation within the gallery.
- Dialog traps focus, supports Escape, and restores focus on close.
- No autoplay audio.
- Captions track is supported when supplied.
- Placeholder state communicates that the story video is pending without disabling story navigation.

## Performance

- No real videos are loaded in the initial placeholder implementation.
- Future videos use posters and `preload="none"` or `metadata`.
- Only active and neighboring previews should be eligible to load/play.
- Animation relies primarily on transforms, opacity, clip-path, and stable grid tracks.
- The design does not require media dimensions to drive layout.

## Page Integration

Page order becomes:

1. `WeCareFilmSection`
2. `WeTransformSection`
3. `WeSucceedSection`

The WE CARE handoff changes to `04 / WE TRANSFORM`. Any stale main-sequence `WE STAY CONNECTED` handoff is removed. WE TRANSFORM closes toward `05 / WE SUCCEED`. The existing WE SUCCEED component and its video system remain intact.

## Verification

- Static source tests verify order, data contract, placeholder state, reference copy, and absence of stock/generated media.
- Interaction tests cover default story, pointer activation, arrows, keyboard navigation, and placeholder-safe viewer behavior.
- Motion tests verify the entry choreography, reduced-motion branch, and cleanup.
- Rendered QA covers desktop, tablet, and mobile composition plus keyboard focus and viewer controls once real video is available.

