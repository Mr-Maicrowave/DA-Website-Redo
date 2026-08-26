# Mathematics Intro Video Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show an eight-second, skippable, full-screen introduction whenever a visitor enters the Mathematics page.

**Architecture:** A focused React component owns overlay state, playback completion, focus trapping, and document scroll locking. The Mathematics page mounts it at the route root; the supplied MP4 is served from Vite's public assets. A Node source-contract test protects route integration and required exit paths.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Node built-in test runner, Vite public assets.

## Global Constraints

- Show the gate on every fresh entry to `/subjects/mathematics`; do not persist completion in browser storage.
- Lock site interaction and scrolling only while the overlay is active; provide an immediate `Skip intro` exit.
- Release the page on playback completion, playback failure, or component unmount.
- Do not modify existing Mathematics teaching content, routing, or global navigation behaviour.

---

### Task 1: Add the intro gate and its contract test

**Files:**
- Create: `src/features/maths-intro-video/MathsIntroVideoGate.tsx`
- Create: `src/features/maths-intro-video/MathsIntroVideoGate.test.ts`

**Interfaces:**
- Produces: `MathsIntroVideoGate`, a zero-prop component that blocks the route until skip, end, or error.
- Consumes: `/math_intro_video.mp4` as a public static asset.

- [ ] **Step 1: Write the failing test**

```ts
const source = readFileSync(new URL('./MathsIntroVideoGate.tsx', import.meta.url), 'utf8');
assert.match(source, /document\.body\.style\.overflow = 'hidden'/);
assert.match(source, /onEnded=\{dismiss\}/);
assert.match(source, /onError=\{dismiss\}/);
assert.match(source, />\s*Skip intro\s*</);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --experimental-strip-types src/features/maths-intro-video/MathsIntroVideoGate.test.ts`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
export const MathsIntroVideoGate = () => {
  const [isOpen, setIsOpen] = useState(true);
  const dismiss = () => setIsOpen(false);
  // Lock the document while isOpen, then restore the former state on cleanup.
  return isOpen ? <div role="dialog" aria-modal="true">...</div> : null;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test --experimental-strip-types src/features/maths-intro-video/MathsIntroVideoGate.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add src/features/maths-intro-video && git commit -m "feat: add Mathematics intro video gate"`

### Task 2: Mount the gate and add the supplied video

**Files:**
- Modify: `src/pages/subjects/Mathematics.tsx`
- Create: `public/math_intro_video.mp4`
- Modify: `src/features/maths-intro-video/MathsIntroVideoGate.test.ts`

**Interfaces:**
- Consumes: `MathsIntroVideoGate` from Task 1.
- Produces: Mathematics-route integration protected by a source-contract test.

- [ ] **Step 1: Extend the failing integration test**

```ts
const mathematicsSource = readFileSync(new URL('../../pages/subjects/Mathematics.tsx', import.meta.url), 'utf8');
assert.match(mathematicsSource, /import \{ MathsIntroVideoGate \}/);
assert.match(mathematicsSource, /<MathsIntroVideoGate\s*\/>/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --experimental-strip-types src/features/maths-intro-video/MathsIntroVideoGate.test.ts`

Expected: FAIL because Mathematics does not mount the gate.

- [ ] **Step 3: Add the asset and mount the component**

Copy `C:\Users\phill\Downloads\math_intro_video.mp4` unchanged to `public/math_intro_video.mp4`, import `MathsIntroVideoGate`, and render it as the first child of the Mathematics route root.

- [ ] **Step 4: Run focused tests and project checks**

Run: `node --test --experimental-strip-types src/features/maths-intro-video/MathsIntroVideoGate.test.ts`, `npm.cmd run typecheck`, and `npm.cmd run build`.

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

Run: `git add public/math_intro_video.mp4 src/pages/subjects/Mathematics.tsx src/features/maths-intro-video/MathsIntroVideoGate.test.ts && git commit -m "feat: show Maths intro on page entry"`
