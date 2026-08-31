# We Transform Story Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert a responsive, accessible, data-driven five-story `04 — WE TRANSFORM` gallery between the existing WE CARE and WE SUCCEED chapters using video placeholders that can later be replaced through data paths only.

**Architecture:** A focused story-data module supplies five media-ready records to one `WeTransformSection` component. The component owns selection, keyboard navigation, scroll-snap synchronization, and a shared accessible video dialog; CSS owns the reference composition and breakpoint behavior, while the existing Why DA motion hook orchestrates entry and chapter handoff.

**Tech Stack:** React 18, TypeScript, CSS Grid/Flexbox/scroll snap, GSAP + ScrollTrigger, Lucide React, Node test runner, ESLint, Vite.

**Spec:** `docs/superpowers/specs/2026-08-31-we-transform-story-gallery-design.md`

## Global Constraints

- Preserve the existing WE CARE and WE SUCCEED internals.
- Page order must be WE CARE → WE TRANSFORM → WE SUCCEED.
- Use warm DA cream, deep navy, and muted antique gold; never pure white.
- Show all five stories simultaneously on desktop, with story 03 active by default.
- Use neutral placeholders only; no stock, generated, or fake student media.
- Never autoplay sound or automatically cycle the active story.
- Video/poster replacement must require data-path changes only.
- Do not pin, scroll-jack, add film sprockets, use glassmorphism, or use irregular masks.
- Respect `prefers-reduced-motion: reduce` and preserve full keyboard access.

## File Structure

- Create `src/components/why-da/transformStories.ts`: story type and five placeholder records.
- Create `src/components/why-da/WeTransformSection.tsx`: gallery, panels, progress navigation, and viewer.
- Create `src/components/why-da/WeTransformSection.css`: reference composition, active widths, responsive track, viewer, focus, and reduced motion.
- Create `src/components/why-da/WeTransformSection.test.mjs`: static contract and integration regression tests.
- Modify `src/pages/WhyChooseDA.tsx`: insert the new chapter in the correct order.
- Modify `src/components/why-da/WeCareFilmSection.tsx`: update its next-chapter handoff.
- Modify `src/components/why-da/WeCareFilmSection.test.mjs`: lock the updated handoff.
- Modify `src/pages/useWhyDAMotion.ts`: add entry and finale-handoff motion.
- Modify `src/pages/WhyChooseDA.motion.test.mjs`: lock motion scope, cleanup, and reduced-motion behavior.

---

### Task 1: Story Data Contract and Page Placement

**Files:**
- Create: `src/components/why-da/transformStories.ts`
- Create: `src/components/why-da/WeTransformSection.test.mjs`
- Modify: `src/pages/WhyChooseDA.tsx`

**Interfaces:**
- Produces: `TransformStory` and `transformStories: TransformStory[]`.
- Produces: a `WeTransformSection` page slot between `WeCareFilmSection` and `WeSucceedSection`.

- [ ] **Step 1: Write the failing page-order and data-contract tests**

```js
const page = await readFile(new URL('../../pages/WhyChooseDA.tsx', import.meta.url), 'utf8');
const data = await readFile(new URL('./transformStories.ts', import.meta.url), 'utf8').catch(() => '');

test('inserts We Transform between We Care and We Succeed', () => {
  assert.match(page, /<WeCareFilmSection\s*\/>[\s\S]*<WeTransformSection\s*\/>[\s\S]*<WeSucceedSection\s*\/>/);
});

test('defines five path-only media-ready stories with story 03 as independence', () => {
  assert.equal((data.match(/videoSrc:\s*null/g) ?? []).length, 5);
  assert.equal((data.match(/poster:\s*null/g) ?? []).length, 5);
  assert.match(data, /confidence[\s\S]*foundations[\s\S]*independence[\s\S]*progress[\s\S]*ambition/);
  assert.match(data, /objectPositionDesktop[\s\S]*objectPositionTablet[\s\S]*objectPositionMobile/);
  assert.doesNotMatch(data, /https?:\/\/|unsplash|stock|generated/i);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test src/components/why-da/WeTransformSection.test.mjs`

Expected: FAIL because `transformStories.ts` and `WeTransformSection` placement do not exist.

- [ ] **Step 3: Add the complete story type and five placeholder records**

```ts
export type TransformStory = {
  id: 'confidence' | 'foundations' | 'independence' | 'progress' | 'ambition';
  number: string;
  category: string;
  shortLine: string;
  quote: string;
  emphasis: string;
  videoSrc: string | null;
  poster: string | null;
  captions: string | null;
  duration: string | null;
  objectPositionDesktop: string;
  objectPositionTablet: string;
  objectPositionMobile: string;
};

export const transformStories: TransformStory[] = [
  { id: 'confidence', number: '01', category: 'CONFIDENCE', shortLine: 'From afraid to ask to willing to try.', quote: 'I’m not afraid to ask questions now.', emphasis: 'not afraid', videoSrc: null, poster: null, captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'foundations', number: '02', category: 'FOUNDATIONS', shortLine: 'From gaps to understanding.', quote: 'Maths finally makes sense.', emphasis: 'makes sense', videoSrc: null, poster: null, captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'independence', number: '03', category: 'INDEPENDENCE', shortLine: 'From quiet and unsure to confident, independent and excited to learn.', quote: 'She believes in herself now.', emphasis: 'believes in herself', videoSrc: null, poster: null, captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'progress', number: '04', category: 'PROGRESS', shortLine: 'From struggling to moving forward.', quote: 'My marks actually improved.', emphasis: 'actually improved', videoSrc: null, poster: null, captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
  { id: 'ambition', number: '05', category: 'AMBITION', shortLine: 'From just getting through it to wanting more.', quote: 'I want to keep going even further.', emphasis: 'keep going', videoSrc: null, poster: null, captions: null, duration: null, objectPositionDesktop: '50% 50%', objectPositionTablet: '50% 50%', objectPositionMobile: '50% 50%' },
];
```

- [ ] **Step 4: Add the page import and placement**

```tsx
import WeTransformSection from '@/components/why-da/WeTransformSection';

<WeCareFilmSection />
<WeTransformSection />
<WeSucceedSection />
```

Create a temporary exported `WeTransformSection` shell containing `data-testid="why-da-transform"`; Task 2 replaces its body.

- [ ] **Step 5: Run the test and verify GREEN**

Run: `node --test src/components/why-da/WeTransformSection.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/why-da/transformStories.ts src/components/why-da/WeTransformSection.test.mjs src/components/why-da/WeTransformSection.tsx src/pages/WhyChooseDA.tsx
git commit -m "feat: add We Transform story data and chapter slot"
```

### Task 2: Five-Panel Desktop Gallery and Selection Controls

**Files:**
- Modify: `src/components/why-da/WeTransformSection.tsx`
- Create: `src/components/why-da/WeTransformSection.css`
- Modify: `src/components/why-da/WeTransformSection.test.mjs`

**Interfaces:**
- Consumes: `transformStories` and `TransformStory` from Task 1.
- Produces: `activeIndex`, `activate(index)`, `activatePrevious()`, and `activateNext()` behavior inside `WeTransformSection`.

- [ ] **Step 1: Add failing tests for the reference composition**

```js
test('renders the approved five-panel composition with story 03 active by default', () => {
  assert.match(component, /04 \/[\s\S]*WE TRANSFORM/);
  assert.match(component, /Change looks different[\s\S]*everyone/);
  assert.match(component, /Five stories\. Five different journeys\./);
  assert.match(component, /useState\(2\)/);
  assert.match(component, /VIDEO \{story\.number\} PENDING/);
  assert.match(styles, /grid-template-columns/);
  assert.match(styles, /--transform-active-track/);
});

test('supports pointer, click, arrow buttons, and keyboard activation', () => {
  assert.match(component, /onPointerEnter/);
  assert.match(component, /activatePrevious/);
  assert.match(component, /activateNext/);
  assert.match(component, /ArrowLeft/);
  assert.match(component, /ArrowRight/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test src/components/why-da/WeTransformSection.test.mjs`

Expected: FAIL because the gallery markup and behavior are absent.

- [ ] **Step 3: Implement selection and keyboard logic**

```tsx
const [activeIndex, setActiveIndex] = useState(2);
const activate = (index: number) => setActiveIndex(index);
const activatePrevious = () => setActiveIndex((index) => (index + transformStories.length - 1) % transformStories.length);
const activateNext = () => setActiveIndex((index) => (index + 1) % transformStories.length);

const handleGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); activatePrevious(); }
  if (event.key === 'ArrowRight') { event.preventDefault(); activateNext(); }
};
```

- [ ] **Step 4: Implement the panel component and reference copy**

Each `TransformStoryPanel` must render a real `<video>` only when `videoSrc` exists. Otherwise render:

```tsx
<div className="transform-panel__placeholder">
  <span>VIDEO {story.number} PENDING</span>
</div>
```

Use a button overlay for selection, an additional `WATCH STORY` button in the active panel, and `aria-pressed={active}`. Split `story.quote` around `story.emphasis` in a helper so the emphasized phrase renders as `<em>` without using raw HTML.

- [ ] **Step 5: Implement stable desktop tracks**

```css
.transform-gallery__panels {
  --transform-active-track: minmax(300px, 1.75fr);
  display: grid;
  grid-template-columns: var(--transform-tracks);
  gap: clamp(8px, .8vw, 14px);
  height: clamp(500px, 38vw, 620px);
  transition: grid-template-columns 820ms cubic-bezier(.77,0,.18,1);
}
```

Set `--transform-tracks` from the active index to one `1.75fr` track and four `1fr` tracks. Use clean 10px radii, a warm neutral placeholder, a bottom readability gradient, no film borders, and no heavy shadow.

- [ ] **Step 6: Run tests and verify GREEN**

Run: `node --test src/components/why-da/WeTransformSection.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/why-da/WeTransformSection.tsx src/components/why-da/WeTransformSection.css src/components/why-da/WeTransformSection.test.mjs
git commit -m "feat: build We Transform five-panel gallery"
```

### Task 3: Progress Playhead and Responsive Scroll-Snap Gallery

**Files:**
- Modify: `src/components/why-da/WeTransformSection.tsx`
- Modify: `src/components/why-da/WeTransformSection.css`
- Modify: `src/components/why-da/WeTransformSection.test.mjs`

**Interfaces:**
- Consumes: `activeIndex` and `activate(index)` from Task 2.
- Produces: labelled progress buttons and responsive `scrollPanelIntoView(index)` behavior.

- [ ] **Step 1: Add failing responsive and progress tests**

```js
test('renders a five-point labelled playhead and a mobile scroll-snap path', () => {
  assert.match(component, /transform-progress__indicator/);
  assert.match(component, /aria-label=\{`Show story \$\{story\.number\}/);
  assert.match(styles, /scroll-snap-type:\s*x mandatory/);
  assert.match(styles, /scroll-snap-align:\s*center/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test src/components/why-da/WeTransformSection.test.mjs`

Expected: FAIL because the progress and mobile paths are absent.

- [ ] **Step 3: Implement the playhead**

Render one semantic navigation list with five buttons. Position the gold indicator using:

```tsx
style={{ transform: `translateX(${activeIndex * 100}%)` }}
```

Each button displays number and category, activates its story, and reflects active state with `aria-current={active ? 'step' : undefined}`.

- [ ] **Step 4: Implement tablet/mobile scroll snap**

At `max-width: 900px`, replace the grid with `display:flex; overflow-x:auto; scroll-snap-type:x mandatory`. Use 60vw panels on tablet and 86vw panels on mobile. Keep `scroll-padding-inline` equal to the outer page gutter and call `panelRefs.current[index]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })` after arrow/progress activation.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `node --test src/components/why-da/WeTransformSection.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/why-da/WeTransformSection.tsx src/components/why-da/WeTransformSection.css src/components/why-da/WeTransformSection.test.mjs
git commit -m "feat: add transform playhead and responsive gallery"
```

### Task 4: Accessible Full-Story Viewer and Media Loading Contract

**Files:**
- Modify: `src/components/why-da/WeTransformSection.tsx`
- Modify: `src/components/why-da/WeTransformSection.css`
- Modify: `src/components/why-da/WeTransformSection.test.mjs`

**Interfaces:**
- Consumes: active `TransformStory`.
- Produces: `viewerStory: TransformStory | null`, `openViewer(story)`, `closeViewer()`, and accessible playback controls.

- [ ] **Step 1: Add failing viewer tests**

```js
test('provides a placeholder-safe accessible inline viewer contract', () => {
  assert.match(component, /role="dialog"/);
  assert.match(component, /aria-modal="true"/);
  assert.match(component, /if \(!story\.videoSrc\) return/);
  assert.match(component, /Escape/);
  assert.match(component, /Pause story video/);
  assert.match(component, /Mute story video/);
  assert.match(component, /track kind="captions"/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test src/components/why-da/WeTransformSection.test.mjs`

Expected: FAIL because the viewer is absent.

- [ ] **Step 3: Implement safe viewer state and focus restoration**

Store the trigger in `viewerTriggerRef`. `openViewer(story, trigger)` returns immediately when `story.videoSrc` is null. `closeViewer()` pauses the video, clears viewer state, and returns focus to the trigger. A document keydown listener closes on Escape only while the viewer is open and is removed in cleanup.

- [ ] **Step 4: Implement viewer controls**

Render one `<video>` with `playsInline`, `preload="metadata"`, optional poster, and optional captions track. Provide separate buttons for play/pause, mute/unmute, and close plus a native-range seek input tied to current time. No control triggers sound automatically.

- [ ] **Step 5: Style the warm-navy overlay and responsive viewer**

Use a fixed backdrop with `rgba(6,23,37,.82)`, a viewer width of `min(82vw,1300px)`, a 12px maximum radius, visible focus rings, and no glass blur.

- [ ] **Step 6: Run tests and verify GREEN**

Run: `node --test src/components/why-da/WeTransformSection.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/why-da/WeTransformSection.tsx src/components/why-da/WeTransformSection.css src/components/why-da/WeTransformSection.test.mjs
git commit -m "feat: add accessible transformation story viewer"
```

### Task 5: Chapter Handoffs and GSAP Choreography

**Files:**
- Modify: `src/components/why-da/WeCareFilmSection.tsx`
- Modify: `src/components/why-da/WeCareFilmSection.test.mjs`
- Modify: `src/pages/useWhyDAMotion.ts`
- Modify: `src/pages/WhyChooseDA.motion.test.mjs`
- Modify: `src/components/why-da/WeTransformSection.css`

**Interfaces:**
- Consumes: `data-motion` hooks rendered by `WeTransformSection`.
- Produces: scoped, cleaned-up GSAP entry and handoff timelines.

- [ ] **Step 1: Add failing handoff and motion tests**

```js
test('hands care into transform instead of the stale connected chapter', () => {
  assert.match(component, /04 \/[\s\S]*WE TRANSFORM/);
  assert.doesNotMatch(component, /WE STAY CONNECTED/);
});

test('opens all transform frames together and hands into the finale', () => {
  assert.match(motion, /why-da-transform/);
  assert.match(motion, /transform-panel/);
  assert.match(motion, /clipPath/);
  assert.match(motion, /transform-finale-handoff/);
  assert.match(motion, /prefersReducedMotion/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test src/components/why-da/WeCareFilmSection.test.mjs src/pages/WhyChooseDA.motion.test.mjs`

Expected: FAIL on the stale handoff and missing transform timeline.

- [ ] **Step 3: Update WE CARE’s handoff copy only**

Replace the displayed next-chapter label with `04 / WE TRANSFORM`; leave the rest of WE CARE unchanged.

- [ ] **Step 4: Add transform motion hooks to the component**

Use `data-motion="transform-label"`, `transform-headline`, `transform-emphasis`, `transform-support`, `transform-panel`, and `transform-finale-handoff`. Default CSS must keep all content visible before GSAP initializes.

- [ ] **Step 5: Add scoped GSAP entry and handoff timelines**

Inside the existing `gsap.context`, create one timeline triggered by `[data-testid="why-da-transform"]`. Set the five panels from `clipPath: 'inset(0 48% 0 48%)'` to `inset(0)` simultaneously over about `.9` seconds using `power3.inOut`. Reveal headline and emphasis with the specified 120ms relationship. Add a separate short non-pinned handoff that moves the gallery up no more than 16px and reduces opacity slightly as WE SUCCEED enters.

For reduced motion, skip clip-path and positional transforms and ensure final visible state immediately.

- [ ] **Step 6: Run tests and verify GREEN**

Run: `node --test src/components/why-da/WeCareFilmSection.test.mjs src/pages/WhyChooseDA.motion.test.mjs src/components/why-da/WeTransformSection.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/why-da/WeCareFilmSection.tsx src/components/why-da/WeCareFilmSection.test.mjs src/components/why-da/WeTransformSection.tsx src/components/why-da/WeTransformSection.css src/pages/useWhyDAMotion.ts src/pages/WhyChooseDA.motion.test.mjs
git commit -m "feat: choreograph We Transform chapter handoffs"
```

### Task 6: Production Verification and Reference QA

**Files:**
- Modify only if QA finds scoped regressions in the files listed above.

**Interfaces:**
- Consumes: completed Tasks 1–5.
- Produces: verified desktop/mobile section and interaction evidence.

- [ ] **Step 1: Run targeted tests**

Run:

```bash
node --test src/components/why-da/WeTransformSection.test.mjs src/components/why-da/WeCareFilmSection.test.mjs src/pages/WhyChooseDA.motion.test.mjs
```

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Run lint and type checks**

Run:

```bash
npx eslint src/components/why-da/WeTransformSection.tsx src/components/why-da/transformStories.ts src/components/why-da/WeCareFilmSection.tsx src/pages/useWhyDAMotion.ts
npm run typecheck
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 3: Run rendered desktop QA**

At `/why-choose-da` with a 1440×1000 viewport verify:

- Chapter order is 03 → 04 → 05.
- All five panels are visible.
- Story 03 is the dominant default.
- Hovering 01, 02, 04, or 05 expands that panel without hiding any sibling.
- Arrow and progress controls update the active panel.
- Placeholder watch controls do not open an empty viewer.
- The cream section meets the navy finale with no unintended gap.
- Browser console has no relevant warnings or errors.

- [ ] **Step 4: Run rendered mobile QA**

At 390×844 verify:

- One dominant panel plus neighboring peeks.
- Native horizontal swipe/scroll snap reaches all five stories.
- Progress controls remain readable and operable.
- No overflow, clipped headings, or stale WE STAY CONNECTED copy.
- Focus-visible styling works with keyboard navigation.

- [ ] **Step 5: Check reduced motion**

Emulate `prefers-reduced-motion: reduce` and verify the gallery renders immediately, selection remains usable, and no slit, cursor, or large width motion runs.

- [ ] **Step 6: Commit any QA-only fixes**

```bash
git add src/components/why-da/WeTransformSection.tsx src/components/why-da/WeTransformSection.css src/components/why-da/transformStories.ts src/components/why-da/WeCareFilmSection.tsx src/pages/WhyChooseDA.tsx src/pages/useWhyDAMotion.ts
git commit -m "fix: polish We Transform responsive gallery"
```

