# Testimonial Transformation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one responsive, data-driven transformation-story detail system for every existing testimonial, supported by a cohesive library of generated transparent content assets while preserving all original wording.

**Architecture:** Extend the testimonial records with optional presentation metadata, expose a pure adapter for conservative fallbacks, and render every detail route through focused transformation-story components. A central asset registry maps deterministic semantic keys to generated transparent PNGs; one IntersectionObserver coordinates phase and impact activation without changing the canonical testimonial content.

**Tech Stack:** React 18, TypeScript, React Router, Framer Motion, CSS, Node test runner, built-in ChatGPT Image Generator.

**Spec:** `docs/superpowers/specs/2026-08-31-testimonial-transformation-system-design.md`

## Global Constraints

- Render every `bodyParagraphs` entry verbatim, exactly once, and in original order.
- Never invent marks, ranks, ATARs, confidence changes, subjects, teaching methods, tutor names, results, or achievements.
- Keep every meaningful word, quote, name, label, and result number as live semantic HTML.
- Generated assets must be text-free transparent PNGs saved inside the workspace.
- Navigation must derive counts and adjacent records from `testimonials.length`.
- Respect `prefers-reduced-motion` and maintain WCAG AA text contrast.

---

### Task 1: Presentation schema and conservative adapter

**Files:**
- Create: `src/components/testimonials/transformation/types.ts`
- Create: `src/components/testimonials/transformation/presentation.ts`
- Create: `src/components/testimonials/transformation/presentation.test.ts`
- Modify: `src/data/testimonials.ts`

**Interfaces:**
- Produces: `TestimonialPresentation`, `ImpactMoment`, `AchievementMomentData`, `StoryPhaseData`, and `getTestimonialPresentation(testimonial, index)`.
- Consumes: the existing `Testimonial` canonical fields.

- [ ] **Step 1: Write failing tests for deterministic palette selection, conservative callout adaptation, phase coverage, and absence of fabricated achievements.**

```ts
expect(getTestimonialPresentation(testimonials[0], 0).palette).toEqual(getTestimonialPresentation(testimonials[0], 0).palette);
expect(presentation.phases.flatMap(p => p.paragraphIndexes)).toEqual(testimonial.bodyParagraphs.map((_, i) => i));
expect(getTestimonialPresentation(shortReview, 4).achievements).toEqual([]);
```

- [ ] **Step 2: Run `npx vitest run src/components/testimonials/transformation/presentation.test.ts` and confirm failure because the module does not exist.**
- [ ] **Step 3: Define optional presentation metadata and the pure conservative adapter. Use existing callouts as impacts, existing pull quotes as quote moments, and contiguous paragraph groups as phases; never extract numerical claims from free prose in fallback mode.**
- [ ] **Step 4: Add curated metadata only for records whose existing structured fields directly support it, beginning with Tu Nguyen, the parent gratitude letter, and one short student review.**
- [ ] **Step 5: Run the focused test and `npm run typecheck`; both must pass.**
- [ ] **Step 6: Commit schema, adapter, tests, and curated metadata.**

### Task 2: Generated asset registry and transparent image library

**Files:**
- Create: `src/components/testimonials/transformation/assets.ts`
- Create: `src/components/testimonials/transformation/assets.test.ts`
- Create: `public/images/testimonials/transformation/*.png`

**Interfaces:**
- Produces: `TestimonialAssetKey` and `testimonialAssetRegistry: Record<TestimonialAssetKey, { src: string; width: number; height: number }>`.
- Consumes: semantic `assetKey` values from presentation metadata.

- [ ] **Step 1: Write a failing registry test that requires every semantic key to resolve to a unique workspace path and verifies files exist.**
- [ ] **Step 2: Run the focused test and confirm missing registry/assets.**
- [ ] **Step 3: Generate separate text-free transparent PNG assets with built-in ChatGPT Image Generator for trophy, medal, star, rising chart, wings, heart, sunrise, guiding hands, journey path, mountain milestone, paper plane, milestone marker, books, lightbulb, mathematics, English/quill, science, sprout, flowers, gemstone, and sparkles.**
- [ ] **Step 4: Inspect generated outputs, preserve alpha, copy final variants into `public/images/testimonials/transformation/`, and record intrinsic dimensions.**
- [ ] **Step 5: Implement the typed registry and run the registry test.**
- [ ] **Step 6: Commit the asset registry, tests, and final selected assets.**

### Task 3: Reusable transformation-story components

**Files:**
- Create: `src/components/testimonials/transformation/TestimonialStoryView.tsx`
- Create: `src/components/testimonials/transformation/TestimonialIntro.tsx`
- Create: `src/components/testimonials/transformation/StoryPhase.tsx`
- Create: `src/components/testimonials/transformation/PullQuoteMoment.tsx`
- Create: `src/components/testimonials/transformation/AchievementMoment.tsx`
- Create: `src/components/testimonials/transformation/ImpactRail.tsx`
- Create: `src/components/testimonials/transformation/TestimonialAsset.tsx`
- Create: `src/components/testimonials/transformation/TestimonialNavigation.tsx`
- Create: `src/components/testimonials/transformation/TestimonialStoryView.test.tsx`

**Interfaces:**
- Consumes: `Testimonial`, `TestimonialPresentation`, current index, and adjacent-navigation callbacks/URLs.
- Produces: one semantic testimonial detail article that renders all original paragraphs once.

- [ ] **Step 1: Write failing render tests asserting verbatim paragraph preservation, optional-module omission, live result text, wrapped navigation, and decorative asset alt behavior.**
- [ ] **Step 2: Run the focused test and confirm missing components.**
- [ ] **Step 3: Implement the intro, phase, quote, achievement, impact, asset, and navigation components with semantic landmarks and stable keys.**
- [ ] **Step 4: Implement `TestimonialStoryView` so desktop renders phases beside the impact rail and mobile interleaves each impact after its source phase in DOM order.**
- [ ] **Step 5: Run focused tests and typecheck.**
- [ ] **Step 6: Commit reusable components and tests.**

### Task 4: Bright editorial visual system and responsive composition

**Files:**
- Create: `src/components/testimonials/transformation/TestimonialStoryView.css`
- Create: `src/components/testimonials/transformation/TestimonialStoryView.styles.test.mjs`

**Interfaces:**
- Consumes: component class names and CSS custom properties supplied by `TestimonialStoryView`.
- Produces: desktop 60/40 composition, sticky/contained impact rail, mobile interleaving, glossy achievement hierarchy, and reduced-motion styles.

- [ ] **Step 1: Write failing static style tests for ivory canvas, 60/40 grid, sticky rail with bounded height, mobile single column, visible focus, and reduced-motion overrides.**
- [ ] **Step 2: Run the style test and confirm failure.**
- [ ] **Step 3: Implement the reference-led bright glossy system using DA navy/gold constants and per-record accent variables. Keep normal paragraphs on the open background; reserve surfaces for quotes, achievements, and impact items.**
- [ ] **Step 4: Add responsive tablet/mobile rules that interleave impacts and preserve dramatic live result typography without overflow.**
- [ ] **Step 5: Add one-shot shine and reveal classes plus complete reduced-motion fallbacks.**
- [ ] **Step 6: Run style tests and typecheck.**
- [ ] **Step 7: Commit the visual system.**

### Task 5: Route integration, activation behavior, and navigation

**Files:**
- Modify: `src/pages/TestimonialDetail.tsx`
- Create: `src/components/testimonials/transformation/useActiveStoryPhase.ts`
- Create: `src/components/testimonials/transformation/useActiveStoryPhase.test.ts`
- Create: `src/pages/TestimonialDetail.test.mjs`

**Interfaces:**
- Consumes: `testimonials`, current route slug, presentation adapter, and story view.
- Produces: route-level SEO, wrapped adjacent routes, scroll restoration, and active impact key.

- [ ] **Step 1: Write failing tests for wraparound navigation, `testimonials.length` count, scroll-to-top on slug change, and one observer-driven active phase.**
- [ ] **Step 2: Run tests and confirm failure against the old three-layout switch.**
- [ ] **Step 3: Replace the type-specific layout switch with `TestimonialStoryView`; keep not-found behavior and SEO.**
- [ ] **Step 4: Implement a single IntersectionObserver hook that activates the most visible phase and performs no work when reduced motion is preferred.**
- [ ] **Step 5: Make previous/next wrap at both ends and scroll the detail root into view after slug changes.**
- [ ] **Step 6: Run route, component, and type tests.**
- [ ] **Step 7: Commit route integration and interaction behavior.**

### Task 6: Full verification and visual QA

**Files:**
- Modify only files required by verified defects discovered during QA.

**Interfaces:**
- Consumes: completed system.
- Produces: evidence that long student, parent, short student, and principal records are usable across viewport sizes.

- [ ] **Step 1: Run `npm run typecheck`, all testimonial-focused tests, and the existing Success Stories focused tests.**
- [ ] **Step 2: Start the local Vite server and inspect Tu Nguyen, the parent gratitude letter, Ruby Nguyen, and the principal message at desktop, tablet, and mobile widths.**
- [ ] **Step 3: Verify every canonical paragraph appears once, rail content is accessible, mobile impacts are interleaved, assets load without layout shift, and text never overflows.**
- [ ] **Step 4: Verify keyboard focus, previous/next wrap, browser back behavior, and reduced-motion rendering.**
- [ ] **Step 5: Correct only evidence-backed defects and rerun the affected checks.**
- [ ] **Step 6: Commit final verification fixes and report generated asset paths and prompt set.**
