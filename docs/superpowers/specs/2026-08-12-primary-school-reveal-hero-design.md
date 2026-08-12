# RevealHero: scroll-driven slide transition from hero to next section

**Status:** Approved for planning
**Date:** 2026-08-12
**Scope:** New reusable component (`RevealHero`), first applied to the Primary School program page.

## Background

The Primary School page (`src/pages/programs/PrimarySchool.tsx`) currently uses `SubjectHero` (the shared hero used across subject pages) followed by a `.ps-hero-mist` band — a static, color-matched CSS gradient/mask that softens the visual seam between the hero photo and the illustrated sky/pathway section below it. That band closes the seam but still requires the user to scroll a full extra screen height past the hero to reach the sky.

This spec replaces that static approach with a new, reusable, scroll-driven transition: the hero photo slides fully off-screen and the next section slides into view in its place, both within a short, deliberately-paced scroll range, rather than the user scrolling past a tall hero image.

## Goals

- Let the user move from the hero straight into the next section via an animated slide transition, rather than scrolling past a full extra viewport of hero image.
- Build it as a generic, reusable component (`RevealHero`), not a Primary-School-specific hack — usable on other pages later without rework.
- No content duplication: the revealed section is a single real DOM instance, not a copy rendered twice.
- Respect `prefers-reduced-motion`: fall back to a plain static stack with no pinning/animation.
- Remove the now-redundant `.ps-hero-mist` band once this ships.

## Non-goals

- Reworking the actual home page hero (`VisualIntro`/`Index.tsx`) — out of scope for this spec. `RevealHero` may be applied there later as a follow-up, but this spec only covers Primary School.
- Touching `SubjectHero.tsx` itself — it stays exactly as-is for English/Mathematics/Science/Legal Studies/Business Studies. `RevealHero` is a new, separate component.
- True horizontal scroll/swipe input. The scroll trigger stays vertical (wheel, trackpad, touch-swipe-up, Page Down, arrow keys) throughout; only the *visual* motion is horizontal.

## Chosen approach

Two techniques were considered and rejected before landing on this one:

1. **Curtain-split** (photo splits into two panels, sky revealed through the gap) — rejected because it requires clipping a single photo into two matching halves with a risk of a visible seam, and doesn't fit this page's own "sequential stages" narrative as well as a clean slide hand-off does.
2. **Independent transform on both slides, no vertical hold** — rejected as technically broken: translating the next section horizontally does nothing to bring it into the viewport if its natural vertical scroll position hasn't been reached yet. A horizontal transform alone can't substitute for the vertical positioning problem.

The approach below reuses a pattern already proven in this codebase: `Index.tsx`'s `.hero-philosophy-pullup` (`margin-top: -110svh`) already pulls a real, single-instance section up to visually overlap a pinned hero above it, with per-breakpoint margin tuning (`-95svh` tablet, `-80svh` mobile). `RevealHero` adds a horizontal slide component on top of that same vertical-hold mechanism, driven by the same scroll progress.

## Component design

**File:** `src/components/RevealHero.tsx` (new, top-level — alongside `NavigationNew.tsx`, `StickyBookButton.tsx`, `SEO.tsx`; not under `components/subjects/` since it isn't subject-specific).

**Props:**

| Prop | Type | Notes |
|---|---|---|
| `eyebrow` | `string` | Same as `SubjectHero` |
| `icon` | `LucideIcon` | Placeholder watermark if no photo |
| `headlineWhite` / `headlineGold` | `string` | Same as `SubjectHero` |
| `subtext` | `string` | Same as `SubjectHero` |
| `proofPills` | `[string, string, string]` | Same as `SubjectHero` |
| `backgroundImageSrc` / `backgroundImageAlt` | `string` | Same as `SubjectHero` |
| `placeholderLabel` | `string` | Same as `SubjectHero`, used only when no photo supplied |
| `pinRangeVh` | `number` (optional, default ~35) | Extra scroll distance (beyond 100vh) the transition consumes. Keeps the "short & snappy" pacing tunable per page. |
| `children` | `ReactNode` | The section to reveal (e.g. the Primary School pathway section + rest of the page). Rendered once, in normal flow, immediately after the hero wrapper. |

**Rendering structure (conceptual, not final code):**

```
<div class="reveal-hero-wrapper" style="height: 100vh + pinRangeVh">
  <motion.div class="reveal-hero-stage"     <!-- position: sticky; top: 0; height: 100vh; z-index: 5 -->
    style="x: heroX">
    <!-- photo + eyebrow/headline/subtext/pills/CTA, identical visual content to SubjectHero -->
  </motion.div>
</div>
<motion.div class="reveal-hero-next" style="margin-top: -100vh (per-breakpoint tuned); x: nextX">
  {children}
</motion.div>
```

- `heroX`: scroll progress 0→1 maps to `x: 0% → -100%` (hero slides fully off-screen to the left).
- `nextX`: same scroll progress maps to `x: 100% → 0%` (next section slides fully into place from the right).
- Both driven by one `useScroll({ target: wrapperRef })` + `useTransform` pair (`framer-motion`, already used throughout this codebase), so they stay perfectly in sync.
- The hero's copy (headline, subtext, pills, CTA) travels as one cohesive unit with the photo — no separate/early fade. Simpler than a split-specific fade, and reads as an intentional "slide," not a special-cased text treatment.
- `reveal-hero-stage` needs an explicit `z-index` above the sibling content as a safety guarantee, even though `position: sticky` already paints above plain static content by default.
- The `margin-top` pull-up value must be tuned per breakpoint the same way `.hero-philosophy-pullup` is today (different values for desktop / tablet / mobile `svh` quirks) — this needs real-device testing during implementation, not just formula-derived numbers.

**Explore button:** kept for discoverability/accessibility. Instead of jumping straight past the hero, it smooth-scrolls exactly `pinRangeVh` worth of distance, playing the same transition a scrolling user would see.

**Reduced motion:** when `prefers-reduced-motion: reduce`, skip the wrapper/sticky/transform machinery entirely — render the hero as a plain static full-height section (same visual content, no motion), with `children` directly below in normal flow. Mirrors the existing fallback pattern in `VisualIntro.tsx`.

## Changes to `PrimarySchool.tsx`

- Replace the current `<SubjectHero ... />` + `<div className="ps-hero-mist" />` pair with `<RevealHero ...>` wrapping the existing `<div id="primary-page-content">…</div>` block (unchanged internals).
- Delete the `.ps-hero-mist` CSS rule and its two `@media` overrides — redundant once the slide transition ships, since the pathway section is now revealed directly rather than needing a static color-matched bridge.
- `exploreTargetId`/scroll-to-anchor behavior from `SubjectHero` is replaced by `RevealHero`'s own Explore-button behavior described above.

## Testing / verification plan

- `npm run lint` and `npm run build:dev` after implementation.
- Manual check in-browser: scroll behavior at desktop and mobile widths, Explore button, keyboard (Page Down / arrow keys / Tab) still reaches the pathway section correctly.
- `prefers-reduced-motion: reduce` fallback verified (DevTools emulation).
- Confirm no duplicate/hidden accessible content (screen-reader pass over the DOM — only one real instance of the pathway section should exist and be exposed).
- Visual check that the pull-up margin doesn't leave a gap or overlap glitch at common breakpoints (this is the part most likely to need iteration, per the existing `.hero-philosophy-pullup` precedent needing three separate breakpoint values).

## Open risk, called out explicitly

Scroll input stays vertical but the visual motion is horizontal — a known UX friction point. Mitigated by keeping the pin range short (~35vh, "short & snappy" per earlier decision) rather than a long, lingering transition. If real-device testing shows it feels disorienting, the fallback is to revert the visual choreography to a vertical variant of the same underlying mechanism (hero slides up/out, next section slides up/in) without discarding the component's props or the vertical-hold technique.
