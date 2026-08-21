# HSC Future Continuous Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the duplicate post-hero HSC opening with one continuous, pinned cinematic story using the generated Ben and future assets.

**Architecture:** A single `HSCFutureStory` owns one sticky stage and one GSAP master timeline. Shared layers—watercolour, journey SVG, Ben, labels, horizon, opportunity frames, support milestones, roadmap, and typography—remain mounted while their geometry and emphasis evolve. Mobile and reduced-motion use a readable static narrative without pinning.

**Tech Stack:** React 18, TypeScript, GSAP 3, ScrollTrigger, MotionPathPlugin, Lucide React, CSS/SVG, Node test runner.

**Spec:** `/Users/lethanhhuyen/.codex/attachments/6017e3a7-f75e-4274-92a3-9bb2baa11fc3/pasted-text.txt`

## Global Constraints

- Keep the existing `SubjectHero` unchanged.
- Use one pinned stage and one master timeline; storyboard frames are timing references only.
- The gold line must remain visually continuous through every phase.
- Preserve Ben's face, hoodie, pose, and proportions; front and rear assets are the only approved views.
- Use MotionPathPlugin only for small light pulses.
- Do not add MorphSVGPlugin or another smooth-scroll system.
- Support `prefers-reduced-motion`, mobile layouts, semantic text, and no scroll locking.

---

### Task 1: Architecture contract

**Files:**
- Create: `src/components/hsc-future-v2/HSCFutureStory.test.ts`
- Create: `src/components/hsc-future-v2/HSCFutureStory.tsx`

**Interfaces:**
- Produces: default React component `HSCFutureStory`.

- [ ] Write a source contract test requiring a single stage, a single master GSAP timeline, named overlap labels, shared Ben layers, Journey Network SVG, MotionPathPlugin, generated assets, and reduced-motion markup.
- [ ] Run the test and confirm it fails because the component does not exist.
- [ ] Build the semantic layer structure and rerun the test until it passes.

### Task 2: Continuous motion system

**Files:**
- Modify: `src/components/hsc-future-v2/HSCFutureStory.tsx`
- Create: `src/components/hsc-future-v2/hsc-future-story.css`

**Interfaces:**
- Consumes: the mounted shared layers from Task 1.
- Produces: one GSAP timeline with labels `handover`, `student`, `possibilities`, `parent`, `horizon`, `opportunities`, `converge`, `support`, and `roadmap`.

- [ ] Animate the Year 10 handover into Year 11 and Ben without clearing the stage.
- [ ] Draw branches in sequence and run small light dots over selected SVG paths.
- [ ] Recompose Ben and soften existing branches for the parent message.
- [ ] Blend the watercolour into the horizon while perspective paths extend.
- [ ] Build and retract opportunity frames, then converge seven paths into one.
- [ ] Grow support and roadmap nodes from the same line.
- [ ] Add mobile and reduced-motion static fallbacks.

### Task 3: HSC page integration

**Files:**
- Modify: `src/pages/HSCExcellence.tsx`

**Interfaces:**
- Consumes: `HSCFutureStory`.

- [ ] Replace only the duplicate `.hsc-hero` and `.hsc-photo-banner` immediately beneath `SubjectHero`.
- [ ] Preserve every later HSC section unchanged.
- [ ] Run the architecture test and TypeScript check.

### Task 4: Rendered verification

**Files:**
- No committed files.

- [ ] Start the local Vite server.
- [ ] Verify page identity, meaningful DOM, no framework overlay, and console health.
- [ ] Inspect the handover, possibilities, opportunity, support, and roadmap points on desktop.
- [ ] Verify a 390px mobile viewport has no horizontal overflow and presents all narrative copy.
- [ ] Verify reduced-motion content remains readable.

