# HSC DA Messaging Integration — Design Specification

## Objective

Integrate meaningful DA Tuition messaging into the existing nine-frame HSC cinematic journey. The artwork, cap-free physical transition system, frame order, camera continuity, pinned viewport, and single GSAP master timeline remain intact.

The narrative becomes:

`UNDERSTAND → PLAN → TEACH → SUPPORT → REFINE → PRACTISE → PERFORM → GROW → BEYOND`

The sequence must show parents how DA supports a student across Years 11–12 without turning the experience into conventional webpage sections, cards, or a static diagram.

## Superseding Decisions

- The journey remains graduation-cap-free. Cap references in the supplied messaging brief are intentionally omitted because the user explicitly confirmed the sequence must stay cap-free.
- Preserve the existing physical paper, cream, desk, pigment, and cloud transitions. Do not replace them with full-scene opacity crossfades.
- Do not redesign, regenerate, recolor, crop, or replace `frame-01.png` through `frame-09.png`.
- Use the full supplied messaging system, not headings alone.

## Copy Architecture

Replace the existing tuple-based `copy` collection with a typed scene-message model:

```ts
type SceneMessage = {
  label: string;
  headline: string[];
  sequence?: string[];
  support?: string[];
  closing?: string[];
  handwritten?: string;
};
```

Each line or phrase renders as an individually addressable live HTML element. Scene wrappers keep stable `data-copy-scene` attributes; message parts use `data-copy-part` and `data-copy-step` attributes so the master timeline can choreograph them without creating additional timelines.

## Visual Language

- Primary copy: DA navy `#071b34`.
- Labels and restrained emphasis: antique gold `#b88724`.
- Typography remains consistent with the existing HSC page: Merriweather/Georgia for major statements and the existing sans-serif for supporting material.
- Handwritten annotations use Georgia italic or the closest existing brand-safe handwritten treatment; no image-generated lettering is introduced.
- Copy sits directly in negative space with a restrained text shadow or local gradient scrim only where contrast requires it.
- Remove the existing cream text-panel background. No white cards, bordered boxes, pills, badges, or glass effects.
- Headline maximum letter spacing remains no tighter than `-0.035em`.
- Supporting copy is capped at approximately `60ch` and must maintain WCAG AA contrast.

## Frame Messaging and Choreography

### 01 — Understand

- Label: `01 · UNDERSTAND`
- Headline: `Before we teach,` / `we understand.`
- Progressive questions:
  - `Where are they now?`
  - `Where do they want to go?`
  - `What is standing in the way?`
- Handwritten close: `Every student starts somewhere different.`
- Reveal order: label, headline lines, questions one at a time, handwritten mask reveal.

### 02 — Plan

- Label: `02 · PLAN`
- Headline: `We build the plan` / `around them.`
- Milestones: `School assessments.` / `DA classes.` / `Revision.` / `Trials.` / `HSC.`
- Closing message: `We work backwards from the important dates,` / `so every week has a purpose.`
- Reveal order follows the milestone path before the closing message.

### 03 — Teach

- Label: `03 · TEACH`
- Headline: `Knowing it` / `isn't enough.`
- Progressive statements: `UNDERSTAND IT.` / `EXPLAIN IT.` / `EARN THE MARK.`
- Closing message: `We connect syllabus knowledge with the way` / `HSC questions are actually assessed.`
- The cadence is quicker than Frames 01–02, but uses controlled easing and no bounce.

### 04 — Support

- Label: `04 · SUPPORT`
- Headline: `They don't have to` / `figure it out alone.`
- Supporting line: `DA stays beside them throughout the journey.`
- Progressive annotations:
  - `Weekly classes`
  - `Assessment support`
  - `Study planning`
  - `Questions & clarification`
  - `Tutor feedback`
  - `Past-paper practice`
- Handwritten close: `We're here, all the way.`
- Annotations appear around negative space without lines, cards, or overlap with the planner/book objects.

### 05 — Refine

- Label: `05 · REFINE`
- Headline: `Every mistake tells us` / `what to teach next.`
- Animated process: `ATTEMPT` / `FEEDBACK` / `TARGET` / `PRACTISE` / `RE-ATTEMPT` / `IMPROVE`
- Closing message: `We don't just mark the work.` / `We decide what happens next.`
- The process reveals progressively with the existing camera movement, never as a complete static diagram.

### 06 — Practise

- Label: `06 · PRACTISE`
- Headline: `We practise the pressure` / `before it matters.`
- Progressive annotations: `Timing.` / `Question selection.` / `Exam technique.` / `Full responses.` / `Marking criteria.`
- Closing message: `So the real exam isn't the first time` / `they've felt this pressure.`
- Maintain a slow, focused, controlled pace.

### 07 — Perform

- Label: `07 · PERFORM`
- Headline sequence: `HSC.` then `No new tricks.` then `Just everything` / `we've practised.`
- Final small line: `Content. Timing. Structure. Technique. Confidence.`
- This scene contains deliberate scroll pauses and substantially less visual activity.

### 08 — Grow

- Label: `08 · GROW`
- Headline: `The HSC ends.` then `The growth shouldn't.`
- Progressive words: `CONFIDENCE` / `INDEPENDENCE` / `DISCIPLINE` / `RESILIENCE` / `CURIOSITY` / `KNOWING HOW TO LEARN`
- Closing message: `These are the things we hope they carry forward.`
- Words remain typographic elements placed in negative space, not floating tags.

### 09 — Beyond

- Label: `09 · BEYOND`
- Headline: `We prepare for more` / `than an exam.`
- Progressive possibilities: `University.` / `A career.` / `A different path.` / `A bigger goal.` / `A future they're still discovering.`
- Main close: `Whatever comes next,` / `we want them ready for it.`
- Handwritten close: `We'll be with them all the way there.`
- Hold the main close before revealing the handwritten final line.

## Animation Rules

- Continue using exactly one GSAP timeline and its existing ScrollTrigger.
- Copy choreography is added to the same scene windows already used by the physical transitions.
- Outgoing copy is fully gone before the relevant physical cover becomes opaque.
- Incoming copy begins only after the incoming artwork is established.
- Labels: opacity `0 → 1`, letter spacing `0.18em → 0.1em`.
- Headline lines: opacity `0 → 1`, translateY `25px → 0`, blur `5px → 0`.
- Supporting and sequence items: staggered individually within the scene window using durations equivalent to approximately `0.08–0.15` seconds at normal playback.
- Handwritten copy: reveal with `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)`.
- No bounce, spin, glow, neon, typewriter effect, floating cards, glass effects, or separate autonomous animations.
- Reverse scrolling must reconstruct every message reveal deterministically.

## Placement

- Each scene receives its own placement modifier rather than forcing every message into the same top-left position.
- Desktop placement uses artwork-specific negative space determined by the current frame composition.
- Mobile uses a consistent upper text zone with narrower type scale and a subtle local image-tone scrim only when necessary for contrast.
- Copy never covers the dominant educational objects in each background.
- At most one major headline group and one supporting group are visually dominant at a time.

## Reduced Motion

- Keep the existing static vertical journey when `prefers-reduced-motion: reduce` is active.
- Render every scene's label, headline, supporting content, and closing message in reading order.
- Do not animate masks, blur, transforms, or progressive sequences in reduced-motion mode.

## Acceptance Criteria

- All nine frames display the approved DA messages in the correct narrative order.
- The journey remains cap-free.
- Artwork and existing physical transitions are unchanged.
- Exactly one master timeline and one ScrollTrigger remain.
- No copy appears inside cards or boxes.
- No entire paragraph appears simultaneously when the brief specifies progressive disclosure.
- Scene 05 visibly communicates the feedback loop over time.
- Scene 07 uses deliberate pauses and substantially reduced activity.
- Scene 09 holds the main close before the handwritten final line.
- No copy overlaps important artwork or another scene's copy.
- No horizontal overflow occurs at desktop or mobile widths.
- Reduced-motion mode contains the complete message in a readable static layout.

## Verification

- Structural tests confirm the typed nine-scene message model and all required labels/headlines.
- Structural tests confirm the cap remains absent and one timeline/ScrollTrigger remain.
- Focused tests confirm individual copy-part selectors and handwritten reveal hooks exist.
- TypeScript and production build pass.
- Browser QA checks scene start, middle, and end for all nine scenes at desktop width.
- Browser QA specifically validates Frame 05 sequencing, Frame 07 pauses, and Frame 09 closing hold.
- Mobile QA checks placement, text contrast, complete frame containment, and zero horizontal overflow.
- Reduced-motion QA confirms all messaging remains available without animation.
