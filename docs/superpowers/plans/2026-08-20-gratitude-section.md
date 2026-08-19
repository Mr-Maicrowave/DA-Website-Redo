# Success Stories Gratitude Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the existing Success Stories appreciation collage with a cinematic, accessible, scroll-linked gratitude ending.

**Architecture:** Add one isolated `GratitudeSection` component and stylesheet using the page's existing Framer Motion dependency. The Success Stories page will replace the old section at the same render location and remove only its section-specific code and styles.

**Tech Stack:** React 18, TypeScript, Framer Motion, CSS, SVG

**Spec:** Approved user request in the current Codex task.

## Global Constraints

- Do not change the section before the replaced appreciation section.
- Do not change the footer or any other Success Stories page content.
- Do not add a dependency.
- Respect `prefers-reduced-motion` by rendering all content immediately and disabling drift/reveal movement.
- Keep the section full-width, card-free, responsive, and readable without overflow.

---

### Task 1: Lock the replacement boundary with a regression test

**Files:**
- Create: `scripts/gratitude-section.test.mjs`

**Interfaces:**
- Consumes: Success Stories source and gratitude component/style files.
- Produces: A Node test asserting the old collage is absent and the required gratitude structure is present.

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run `node --test scripts/gratitude-section.test.mjs` and confirm it fails because `GratitudeSection` does not exist**
- [ ] **Step 3: Leave the test failing while Task 2 supplies the implementation**

### Task 2: Build the isolated gratitude section

**Files:**
- Create: `src/components/success-stories/GratitudeSection.tsx`
- Create: `src/components/success-stories/GratitudeSection.css`
- Modify: `src/pages/SuccessStories.tsx`
- Modify: `src/pages/SuccessStories.css`

**Interfaces:**
- Consumes: `reduceMotion: boolean | null` from `useReducedMotion()` in the page.
- Produces: `GratitudeSection({ reduceMotion })` with scroll-linked background drift, word reveals, underline drawing, final-note reveal, exit transition, and decorative sparkles.

- [ ] **Step 1: Implement reusable scroll-linked word spans with highlighted `review`, `message`, `trust`, and `journey` tokens**
- [ ] **Step 2: Implement the semantic section, decorative watermark, SVG underline, final script message, and reduced-motion state**
- [ ] **Step 3: Add isolated desktop/mobile styling and reduced-motion CSS**
- [ ] **Step 4: Replace the old render call and remove only obsolete appreciation imports, data, markup, and CSS**
- [ ] **Step 5: Run `node --test scripts/gratitude-section.test.mjs` and confirm it passes**

### Task 3: Verify behavior and presentation

**Files:**
- Modify only if verification exposes a scoped gratitude-section issue.

**Interfaces:**
- Consumes: Completed gratitude section.
- Produces: Verified build and desktop/mobile/reduced-motion presentation.

- [ ] **Step 1: Run `npm run typecheck`**
- [ ] **Step 2: Run the focused Node regression test again**
- [ ] **Step 3: Run the local page and inspect the section at desktop width**
- [ ] **Step 4: Inspect at mobile width and with reduced motion enabled**
- [ ] **Step 5: Review the final diff to confirm the preceding section and footer are unchanged**
