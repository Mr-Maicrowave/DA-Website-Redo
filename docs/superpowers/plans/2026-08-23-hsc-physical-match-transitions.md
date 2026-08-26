# HSC Physical Match Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the HSC journey's horizontal scene strip with one reversible, cap-free GSAP sequence where every scene change is concealed by a physical paper, cream, desk, pigment, or cloud match transition.

**Architecture:** Keep the existing nine full-frame illustrations and live HTML copy, but stack all scenes in one pinned viewport. One master GSAP timeline controls scene visibility, camera transforms, copy, and five reusable code-generated transition surfaces; an incoming scene is switched underneath only while a surface fully covers the viewport.

**Tech Stack:** React 18, TypeScript, GSAP 3.15, ScrollTrigger, CSS transforms/clip-path, inline SVG masks, Node test runner, Vite.

**Spec:** `docs/superpowers/specs/2026-08-23-hsc-physical-match-transitions-design.md`

## Global Constraints

- Keep `public/hsc-journey/frames/frame-01.png` through `frame-09.png` unchanged.
- Keep the sequence entirely graduation-cap-free.
- Use exactly one `gsap.timeline()` and the single ScrollTrigger owned by that timeline.
- Do not translate complete viewport-wide scenes horizontally.
- Do not show two complete backgrounds side by side or use full-section opacity crossfades.
- Switch the underlying scene only while an opaque transition surface covers at least 115% of the viewport.
- Keep live HTML scene numbers, headings, and supporting copy; baked object text stays in the backgrounds.
- Preserve deterministic reverse scrolling, responsive containment, no horizontal overflow, image preloading, and the static reduced-motion journey.

---

## File Structure

- Modify `src/components/hsc-journey/HSCJourneyFilm.tsx`: render stacked scenes and transition surfaces, preload frames, and build the single master timeline.
- Modify `src/components/hsc-journey/hsc-journey-film.css`: stack scenes, style physical transition surfaces, constrain camera movement, and preserve responsive/reduced-motion layouts.
- Modify `src/components/hsc-journey/HSCJourneyFilm.test.ts`: verify the structural invariants that prevent seams, caps, horizontal panels, and multiple timelines.
- Inspect only `src/pages/HSCExcellence.tsx`: confirm the journey remains mounted directly below the current hero; no page redesign is planned.

### Task 1: Lock the stacked-scene contract with failing structural tests

**Files:**
- Modify: `src/components/hsc-journey/HSCJourneyFilm.test.ts`

**Interfaces:**
- Consumes: existing component and CSS source as strings.
- Produces: regression assertions for `.hscjf-scenes`, `data-scene`, five transition surfaces, and absence of horizontal world-strip behavior.

- [ ] **Step 1: Replace the existing structure test with explicit stacked-scene invariants**

```ts
test("stacks nine scenes in one viewport without horizontal panel travel", () => {
  assert.match(component, /className="hscjf-scenes"/);
  assert.match(component, /data-scene=\{index \+ 1\}/);
  assert.match(css, /\.hscjf-scenes[\s\S]*position:\s*absolute/);
  assert.match(css, /\.hscjf-scene[\s\S]*inset:\s*0/);
  assert.equal(css.includes("width: 900vw"), false);
  assert.equal(css.includes("left: 100vw"), false);
  assert.equal(component.includes("window.innerWidth * (index + 1)"), false);
  assert.equal(component.includes('querySelector<HTMLElement>(".hscjf-world")'), false);
});

test("renders the five physical transition surfaces", () => {
  for (const surface of [
    "paper-cover",
    "cream-cover",
    "desk-bridge",
    "pigment-reveal",
    "cloud-cover",
  ]) {
    assert.match(component, new RegExp(`data-transition="${surface}"`));
    assert.match(css, new RegExp(`\\.hscjf-${surface}`));
  }
});
```

- [ ] **Step 2: Strengthen the existing master-timeline test**

```ts
test("uses one reversible master timeline without cap or full-scene crossfades", () => {
  assert.equal((component.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.equal((component.match(/scrollTrigger:\s*\{/g) ?? []).length, 1);
  assert.equal(component.includes("MotionPathPlugin"), false);
  assert.equal(component.includes("hscjf-cap"), false);
  assert.equal(component.includes("/cap.png"), false);
  assert.equal(component.includes("crossFade"), false);
});
```

- [ ] **Step 3: Run the focused test and confirm the new assertions fail**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: FAIL because `.hscjf-world` still travels across `900vw` and the transition surfaces do not exist.

- [ ] **Step 4: Commit the red test**

```bash
git add src/components/hsc-journey/HSCJourneyFilm.test.ts
git commit -m "test: define HSC stacked transition contract"
```

### Task 2: Replace the horizontal world with stacked scenes and reusable surfaces

**Files:**
- Modify: `src/components/hsc-journey/HSCJourneyFilm.tsx`
- Modify: `src/components/hsc-journey/hsc-journey-film.css`
- Test: `src/components/hsc-journey/HSCJourneyFilm.test.ts`

**Interfaces:**
- Consumes: `frames: string[]`, `copy`, `rootRef`, and the existing preload state.
- Produces: `.hscjf-scenes`, nine `[data-scene]` layers, and five `[data-transition]` surfaces addressable by the GSAP timeline.

- [ ] **Step 1: Render all complete backgrounds at identical viewport coordinates**

Replace `.hscjf-world` with:

```tsx
<div className="hscjf-scenes" aria-hidden="true">
  {frames.map((src, index) => (
    <div className="hscjf-scene" data-scene={index + 1} key={src}>
      <img className="hscjf-frame" src={src} alt="" draggable={false} />
    </div>
  ))}
</div>
```

Keep descriptive scene content in `StoryCopy`; decorative duplicate images must use empty alt text.

- [ ] **Step 2: Add the reusable transition surface markup after the scene stack and before `StoryCopy`**

```tsx
<div className="hscjf-transition-layer" aria-hidden="true">
  <div className="hscjf-paper-cover" data-transition="paper-cover" />
  <div className="hscjf-cream-cover" data-transition="cream-cover" />
  <div className="hscjf-desk-bridge" data-transition="desk-bridge" />
  <svg className="hscjf-pigment-reveal" data-transition="pigment-reveal" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M-10 88 C12 62 21 92 43 67 C62 46 73 66 110 28 L110 110 L-10 110 Z" />
  </svg>
  <svg className="hscjf-cloud-cover" data-transition="cloud-cover" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M-15 55 C-2 31 15 48 24 31 C37 8 53 43 65 23 C78 5 94 35 115 17 L115 115 L-15 115 Z" />
  </svg>
</div>
```

- [ ] **Step 3: Replace the `900vw` CSS layout with a shared scene stack**

```css
.hscjf-scenes,
.hscjf-scene,
.hscjf-transition-layer {
  position: absolute;
  inset: 0;
}

.hscjf-scenes {
  z-index: 1;
  overflow: hidden;
}

.hscjf-scene {
  visibility: hidden;
  overflow: hidden;
  background: var(--ivory);
  transform-origin: center;
}

.hscjf-scene[data-scene="1"] {
  visibility: visible;
}

.hscjf-transition-layer {
  z-index: 6;
  overflow: hidden;
  pointer-events: none;
}
```

Delete `.hscjf-world`, its `width: 900vw`, all `nth-child` left offsets, and every full-panel horizontal positioning rule.

- [ ] **Step 4: Style surfaces so each can exceed all viewport edges**

```css
.hscjf-paper-cover,
.hscjf-cream-cover,
.hscjf-desk-bridge,
.hscjf-pigment-reveal,
.hscjf-cloud-cover {
  position: absolute;
  visibility: hidden;
  will-change: transform, clip-path;
}

.hscjf-paper-cover {
  inset: -16%;
  background:
    repeating-linear-gradient(0deg, transparent 0 30px, rgba(91, 116, 144, 0.08) 31px 32px),
    radial-gradient(circle at 38% 42%, #fffdf8, #efe4d1 78%);
  box-shadow: 0 24px 80px rgba(35, 25, 16, 0.24);
}

.hscjf-cream-cover {
  inset: -20%;
  border-radius: 48% 52% 42% 58%;
  background: radial-gradient(circle, #fffdf7 0 38%, #f4e9d7 70%, #e8d6bd 100%);
}

.hscjf-desk-bridge {
  left: -12%;
  right: -12%;
  bottom: -8%;
  height: 42%;
  background: linear-gradient(176deg, #d6b98c 0%, #a97b4d 52%, #775134 100%);
  box-shadow: 0 -24px 50px rgba(48, 31, 17, 0.18);
}

.hscjf-pigment-reveal,
.hscjf-cloud-cover {
  inset: -12%;
  width: 124%;
  height: 124%;
  overflow: visible;
}

.hscjf-pigment-reveal path { fill: #dce9ed; }
.hscjf-cloud-cover path { fill: #eef1ec; }
```

- [ ] **Step 5: Run the focused structural test**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: PASS for stacked structure and surface markup; timeline behavior may remain incomplete until Task 4.

- [ ] **Step 6: Commit the stacked composition**

```bash
git add src/components/hsc-journey/HSCJourneyFilm.tsx src/components/hsc-journey/hsc-journey-film.css
git commit -m "refactor: stack HSC journey scenes"
```

### Task 3: Add typed timeline helpers for deterministic scene switching

**Files:**
- Modify: `src/components/hsc-journey/HSCJourneyFilm.tsx`
- Test: `src/components/hsc-journey/HSCJourneyFilm.test.ts`

**Interfaces:**
- Consumes: `gsap.core.Timeline`, `scenes: HTMLElement[]`, `copies: HTMLElement[]`.
- Produces: `showScene(timeline, index, at): void` and `showCopy(timeline, index, enterAt, leaveAt): void` inside the GSAP context.

- [ ] **Step 1: Add a failing assertion for covered visibility switches**

```ts
test("switches stacked scene visibility through timeline set operations", () => {
  assert.match(component, /const showScene\s*=\s*\(/);
  assert.match(component, /timeline\.set\(scenes\[index\]/);
  assert.match(component, /autoAlpha:\s*0/);
  assert.match(component, /visibility:\s*"hidden"/);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: FAIL because `showScene` does not yet exist.

- [ ] **Step 3: Initialise scenes, surfaces, and copies once inside `gsap.context`**

```ts
const scenes = gsap.utils.toArray<HTMLElement>(".hscjf-scene", root);
const copies = gsap.utils.toArray<HTMLElement>(".hscjf-copy", root);
const surface = (name: string) =>
  root.querySelector<HTMLElement | SVGElement>(`[data-transition="${name}"]`)!;

gsap.set(scenes, { autoAlpha: 0, visibility: "hidden", scale: 1, xPercent: 0, yPercent: 0 });
gsap.set(scenes[0], { autoAlpha: 1, visibility: "visible" });
gsap.set(copies, { autoAlpha: 0, y: 20 });
gsap.set("[data-transition]", { autoAlpha: 0, visibility: "hidden" });
```

- [ ] **Step 4: Add helpers that use only the master timeline**

```ts
const showScene = (timeline: gsap.core.Timeline, index: number, at: number) => {
  timeline.set(scenes, { autoAlpha: 0, visibility: "hidden" }, at);
  timeline.set(scenes[index], { autoAlpha: 1, visibility: "visible" }, at);
};

const showCopy = (
  timeline: gsap.core.Timeline,
  index: number,
  enterAt: number,
  leaveAt: number,
) => {
  timeline.to(copies[index], { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, enterAt);
  timeline.to(copies[index], { autoAlpha: 0, y: -16, duration: 0.55, ease: "power2.in" }, leaveAt);
};
```

The `showScene` timestamp must only be called at the opaque midpoint of a transition in Task 4.

- [ ] **Step 5: Run focused tests and TypeScript**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS with no new errors.

- [ ] **Step 6: Commit timeline helpers**

```bash
git add src/components/hsc-journey/HSCJourneyFilm.tsx src/components/hsc-journey/HSCJourneyFilm.test.ts
git commit -m "feat: add reversible HSC scene switching"
```

### Task 4: Build the eight physical match transitions on one timeline

**Files:**
- Modify: `src/components/hsc-journey/HSCJourneyFilm.tsx`
- Modify: `src/components/hsc-journey/hsc-journey-film.css`
- Test: `src/components/hsc-journey/HSCJourneyFilm.test.ts`

**Interfaces:**
- Consumes: `showScene`, `showCopy`, `scenes`, `surface(name)`, and one master `timeline`.
- Produces: labels `scene-1` through `scene-9` and `transition-1-2` through `transition-8-9`, spanning the nine 10-unit scene windows.

- [ ] **Step 1: Add label and choreography-presence tests**

```ts
test("defines all eight match transitions on one timeline", () => {
  for (let index = 1; index <= 9; index += 1) {
    assert.match(component, new RegExp(`scene-${index}`));
  }
  for (let index = 1; index < 9; index += 1) {
    assert.match(component, new RegExp(`transition-${index}-${index + 1}`));
  }
  assert.equal((component.match(/gsap\.timeline\(/g) ?? []).length, 1);
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: FAIL because the eight transition labels are absent.

- [ ] **Step 3: Create the master timeline and common scene pacing**

```ts
const timeline = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: root,
    start: "top top",
    end: "bottom bottom",
    pin: ".hscjf-viewport",
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  },
});

const starts = [0, 10, 20, 30, 40, 50, 60, 70, 80] as const;
starts.forEach((at, index) => {
  timeline.addLabel(`scene-${index + 1}`, at);
  showCopy(timeline, index, at + 0.65, at + 7.2);
});
```

- [ ] **Step 4: Implement 01→02 and 02→03 using the paper cover**

```ts
const paper = surface("paper-cover");

timeline.addLabel("transition-1-2", 7.2)
  .to(scenes[0], { scale: 1.075, yPercent: 4, duration: 2.8, ease: "power1.inOut" }, 7.2)
  .set(paper, { autoAlpha: 1, visibility: "visible", xPercent: -8, yPercent: 78, rotation: -5, scale: 0.48 }, 7.25)
  .to(paper, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1.2, duration: 1.45, ease: "power2.in" }, 7.3);
showScene(timeline, 1, 8.78);
timeline.to(paper, { yPercent: -92, scale: 1.28, duration: 1.2, ease: "power2.out" }, 8.8)
  .set(paper, { autoAlpha: 0, visibility: "hidden" }, 10);

timeline.addLabel("transition-2-3", 17.1)
  .to(scenes[1], { scale: 1.09, duration: 2.7, ease: "power1.inOut" }, 17.1)
  .set(paper, { autoAlpha: 1, visibility: "visible", xPercent: 68, yPercent: -62, rotation: 12, scale: 0.42 }, 17.15)
  .to(paper, { xPercent: 0, yPercent: 0, rotation: -5, scale: 1.25, duration: 1.35, ease: "power2.in" }, 17.2);
showScene(timeline, 2, 18.58);
timeline.to(paper, { xPercent: -72, yPercent: 66, rotation: -13, scale: 1.32, duration: 1.4, ease: "power2.out" }, 18.6)
  .set(paper, { autoAlpha: 0, visibility: "hidden" }, 20);
```

- [ ] **Step 5: Implement 03→04 and 04→05 using the cream cover and desk bridge**

```ts
const cream = surface("cream-cover");
const desk = surface("desk-bridge");

timeline.addLabel("transition-3-4", 26.8)
  .to(scenes[2], { scale: 1.16, xPercent: -5, yPercent: -3, duration: 2, ease: "power2.in" }, 26.8)
  .set(cream, { autoAlpha: 1, visibility: "visible", scale: 0.06 }, 27)
  .to(cream, { scale: 1.25, duration: 1.25, ease: "power2.in" }, 27.05);
showScene(timeline, 3, 28.32);
timeline.set(cream, { clipPath: "inset(0% 0% 0% 0%)" }, 28.33)
  .to(cream, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.65, ease: "power2.out" }, 28.35)
  .set(cream, { autoAlpha: 0, visibility: "hidden", clipPath: "none" }, 30);

timeline.addLabel("transition-4-5", 37.1)
  .set(desk, { autoAlpha: 1, visibility: "visible", yPercent: 62 }, 37.1)
  .to(desk, { yPercent: 0, duration: 0.85, ease: "power2.out" }, 37.15)
  .to(scenes[3], { xPercent: -8, scale: 1.045, duration: 2.65, ease: "power1.inOut" }, 37.2)
  .set(scenes[4], { autoAlpha: 1, visibility: "visible", xPercent: 7, scale: 1.045 }, 38.15)
  .set(scenes[3], { autoAlpha: 0, visibility: "hidden" }, 38.2)
  .to(scenes[4], { xPercent: 0, duration: 1.7, ease: "power1.inOut" }, 38.2)
  .to(desk, { yPercent: 70, duration: 0.9, ease: "power2.in" }, 39.1)
  .set(desk, { autoAlpha: 0, visibility: "hidden" }, 40);
```

The desk band conceals the lower boundary while the outgoing scene is hidden before the incoming frame resolves; the frames are never placed adjacent.

- [ ] **Step 6: Implement 05→06 and 06→07 using aligned paper perspective**

```ts
timeline.addLabel("transition-5-6", 47.05)
  .to(scenes[4], { scale: 1.18, xPercent: 3, yPercent: 5, duration: 2, ease: "power2.in" }, 47.05)
  .set(paper, { autoAlpha: 1, visibility: "visible", xPercent: 21, yPercent: 28, rotation: 7, scale: 0.38 }, 47.15)
  .to(paper, { xPercent: 0, yPercent: 0, rotation: 1, scale: 1.22, duration: 1.3, ease: "power2.in" }, 47.2);
showScene(timeline, 5, 48.52);
timeline.to(paper, { yPercent: 61, rotation: 0, scale: 0.48, duration: 1.45, ease: "power2.out" }, 48.55)
  .set(paper, { autoAlpha: 0, visibility: "hidden" }, 50);

timeline.addLabel("transition-6-7", 56.7)
  .to(scenes[5], { scale: 1.14, yPercent: -3, transformOrigin: "50% 62%", duration: 1.5, ease: "power1.inOut" }, 56.7)
  .to(scenes[5], { scale: 1.3, yPercent: -15, rotationX: 3, duration: 1.1, ease: "power2.in" }, 58.1)
  .set(paper, { autoAlpha: 1, visibility: "visible", xPercent: 0, yPercent: 48, rotation: 0, scale: 0.42 }, 58.05)
  .to(paper, { yPercent: 0, scale: 1.22, duration: 0.85, ease: "power2.in" }, 58.1);
showScene(timeline, 6, 58.98);
timeline.to(paper, { scale: 1.42, autoAlpha: 0, duration: 1, ease: "power2.out" }, 59)
  .set(paper, { visibility: "hidden" }, 60);
```

- [ ] **Step 7: Implement 07→08 and 08→09 using pigment and cloud masks**

```ts
const pigment = surface("pigment-reveal");
const cloud = surface("cloud-cover");

timeline.addLabel("transition-7-8", 66.8)
  .to(scenes[6], { scale: 1.34, xPercent: -3, yPercent: 5, duration: 1.8, ease: "power2.in" }, 66.8)
  .set(pigment, { autoAlpha: 1, visibility: "visible", scale: 0.05, transformOrigin: "18% 82%" }, 67.15)
  .to(pigment, { scale: 1.35, duration: 1.55, ease: "power2.in" }, 67.2);
showScene(timeline, 7, 68.78);
timeline.to(pigment, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "power2.out" }, 68.8)
  .set(pigment, { autoAlpha: 0, visibility: "hidden", clipPath: "none" }, 70);

timeline.addLabel("transition-8-9", 76.65)
  .to(scenes[7], { scale: 1.2, yPercent: 9, duration: 1.7, ease: "power2.in" }, 76.65)
  .set(cloud, { autoAlpha: 1, visibility: "visible", scale: 0.1, transformOrigin: "52% 35%" }, 77)
  .to(cloud, { scale: 1.36, duration: 1.65, ease: "power2.in" }, 77.05)
  .set(scenes[8], { scale: 1.1, yPercent: -3 }, 78.68);
showScene(timeline, 8, 78.7);
timeline.set(cloud, { clipPath: "inset(0% 0% 0% 0%)" }, 78.7)
  .to(cloud, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "power2.out" }, 78.72)
  .set(cloud, { autoAlpha: 0, visibility: "hidden", clipPath: "none" }, 80)
  .to(scenes[8], { scale: 1, yPercent: 0, duration: 8.5, ease: "power1.inOut" }, 80);
```

- [ ] **Step 8: Add mobile camera bounds without changing the transition model**

Inside the no-preference media handler, compute:

```ts
const mobile = window.matchMedia("(max-width: 768px)").matches;
const cameraScale = (desktop: number) => (mobile ? 1 + (desktop - 1) * 0.58 : desktop);
```

Use `cameraScale(...)` for scene camera scale values while keeping cover scales at `1.2` or greater so portrait and landscape edges remain concealed.

- [ ] **Step 9: Run focused tests and TypeScript**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

- [ ] **Step 10: Commit the physical transition timeline**

```bash
git add src/components/hsc-journey/HSCJourneyFilm.tsx src/components/hsc-journey/hsc-journey-film.css src/components/hsc-journey/HSCJourneyFilm.test.ts
git commit -m "feat: animate HSC physical match transitions"
```

### Task 5: Harden loading, reduced motion, reverse scroll, and overflow

**Files:**
- Modify: `src/components/hsc-journey/HSCJourneyFilm.tsx`
- Modify: `src/components/hsc-journey/hsc-journey-film.css`
- Test: `src/components/hsc-journey/HSCJourneyFilm.test.ts`

**Interfaces:**
- Consumes: existing frame preload promise, `ready`, `gsap.matchMedia()`, and master timeline.
- Produces: image-decode gating, static reduced journey, clean teardown, and document-width containment.

- [ ] **Step 1: Add structural tests for preload gating and teardown**

```ts
test("gates motion on image decoding and cleans up GSAP state", () => {
  assert.match(component, /Promise\.all/);
  assert.match(component, /image\.decode/);
  assert.match(component, /if \(!ready \|\| !rootRef\.current\) return/);
  assert.match(component, /context\.revert\(\)/);
  assert.match(component, /media\.revert\(\)/);
});

test("contains viewport overflow and preserves the reduced-motion journey", () => {
  assert.match(css, /overflow:\s*clip/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.hscjf-reduced[\s\S]*display:\s*block/);
});
```

- [ ] **Step 2: Run the focused test and confirm current behavior is covered**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: PASS; if a teardown assertion fails, add the missing cleanup before proceeding.

- [ ] **Step 3: Make the loading surface non-interactive only after all images settle**

Keep `Promise.all` over all nine images and set `ready` only after every decode/load/error settles. Add:

```tsx
aria-busy={!ready}
```

to the root section and retain `.hscjf-loading` until `.is-ready` is present.

- [ ] **Step 4: Ensure reverse scrubbing restores deterministic initial values**

Before timeline creation, set every animated property used later: scene visibility/opacity/scale/x/y, copy opacity/y, and transition surface visibility/opacity/transform/clip-path. Do not use callbacks such as `onComplete` or React state to switch scenes; all switches remain `timeline.set(...)` operations.

- [ ] **Step 5: Preserve the static reduced-motion journey and mobile containment**

Retain the existing `<ReducedJourney />` markup and `@media (prefers-reduced-motion: reduce)` rules. Correct the reduced-image indentation and add:

```css
.hscjf,
.hscjf-viewport,
.hscjf-scenes,
.hscjf-transition-layer {
  max-width: 100%;
  overflow-x: clip;
}

@media (max-width: 768px) {
  .hscjf-frame { object-fit: contain; }
  .hscjf-copy { max-width: calc(100vw - 36px); }
}
```

- [ ] **Step 6: Run focused tests, TypeScript, and production build**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run build`

Expected: PASS and a production bundle generated without new HSC journey warnings.

- [ ] **Step 7: Commit resilience work**

```bash
git add src/components/hsc-journey/HSCJourneyFilm.tsx src/components/hsc-journey/hsc-journey-film.css src/components/hsc-journey/HSCJourneyFilm.test.ts
git commit -m "fix: harden HSC journey playback modes"
```

### Task 6: Browser visual QA and final tuning

**Files:**
- Modify if required by observed defects: `src/components/hsc-journey/HSCJourneyFilm.tsx`
- Modify if required by observed defects: `src/components/hsc-journey/hsc-journey-film.css`
- Test: `src/components/hsc-journey/HSCJourneyFilm.test.ts`

**Interfaces:**
- Consumes: completed local HSC page at `/hsc-excellence`.
- Produces: verified forward/reverse continuity at desktop and mobile sizes with no seams, caps, blank frames, or copy overlap.

- [ ] **Step 1: Start the local development server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite reports a local URL and stays running.

- [ ] **Step 2: Inspect desktop transition checkpoints at 1440×900**

Open `/hsc-excellence`, then inspect the start, opaque midpoint, and end of all eight transition windows. At each checkpoint verify:

- one complete background is dominant;
- no vertical edge or adjacent frame appears;
- the outgoing copy is gone before full cover;
- incoming copy waits until its scene is established;
- the physical cover exceeds every viewport edge;
- no graduation cap appears.

- [ ] **Step 3: Scrub all eight transitions backward**

Expected: every cover reverses cleanly, scene visibility returns in the correct order, and no blank ivory flash or stale copy remains.

- [ ] **Step 4: Inspect mobile checkpoints at 390×844**

Verify that all nine full images remain contained, covers still fill the viewport, copy remains readable, and `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

- [ ] **Step 5: Inspect reduced motion**

Emulate `prefers-reduced-motion: reduce` and reload.

Expected: no pinned timeline, no animated masks or camera moves, and nine readable vertical static sections.

- [ ] **Step 6: Tune only observed timing or containment defects**

Limit adjustments to the relevant label time, duration, transform, transform-origin, cover scale, clip-path, or responsive camera multiplier. Do not change artwork, copy, section order, or introduce a second timeline.

- [ ] **Step 7: Re-run the complete verification set**

Run: `node --test --experimental-strip-types src/components/hsc-journey/HSCJourneyFilm.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 8: Commit final visual tuning**

```bash
git add src/components/hsc-journey/HSCJourneyFilm.tsx src/components/hsc-journey/hsc-journey-film.css src/components/hsc-journey/HSCJourneyFilm.test.ts
git commit -m "polish: tune HSC journey continuity"
```
