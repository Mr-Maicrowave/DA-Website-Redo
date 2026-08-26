# Maths Topic Network — Design Spec

**Date:** 2026-08-20
**Status:** Draft, pending user review
**Page:** `src/pages/subjects/Mathematics.tsx`

## Summary

A new section on the Mathematics page: a dark, glowing "constellation" diagram of Years 7–12 maths topics. Fundamental concepts (Algebra, Equations, Integers, Directed Numbers) sit near the center; domains (Probability, Calculus, Trigonometry, etc.) surround them; specific subtopics (Tree Diagrams, Differentiation, etc.) sit further out again. As the visitor scrolls, the diagram grows outward — fundamentals first, then domains, then subtopics and cross-links — and holds in a "fully connected" state for a stretch before releasing the scroll back to the rest of the page. Visitors can click a node to see how it connects, and toggle between an organic, physics-settled arrangement and a clean deterministic one.

**Purpose:** credibility/"wow" visual — communicates how comprehensive and interconnected the curriculum is. It is explicitly *not* a navigation tool; nothing here needs to deep-link anywhere or replace the site's actual subject/topic pages.

This design was validated through eight rounds of interactive HTML/SVG mockups (built with the brainstorming skill's visual companion). The mockups are throwaway scratch files, not shipped code — they exist only to de-risk the approach before implementation; final code should be written fresh against real codebase conventions (Framer Motion, TypeScript, Tailwind), not ported from the mockup's vanilla JS.

## Why this shape, not a literal tree

The original idea was a literal tree (roots/trunk = fundamentals, branches = related topics). Two things ruled that out:
- The Science page already has a literal, photorealistic tree (Newton's apple tree, for the gravity story) — a second tree would read as reused.
- Maths topics don't have one parent each. Calculus depends on both Algebra and Functions; Discrete Distributions relates to both Probability and Statistics. A strict tree can't represent that convergence; a network graph can (via cross-links).

## Placement

A new section within `Mathematics.tsx`, alongside its existing sections. The page currently has `SHOW_LEGACY_MATHS_INTERACTIONS = false` gating out the old Basketball Calculus / Fourier sections, so the Graphing Lab invitation is the only other heavy interactive piece — there's room for this without overloading the page. Suggested position: after the HSC Pathway section and before the final CTA/testimonial sections, alongside the Graphing Lab invitation as another "go deeper" showcase moment. Exact ordering is an implementation-time call, not load-bearing to this spec.

## Visual design

- **Canvas:** the section reuses the site's existing navy gradient (`linear-gradient(160deg, #071629 0%, #0b294d 100%)`, already used in `#maths-class-options`), pinned inside a rounded panel. This gives the "dark constellation / Obsidian-vault" feel the client asked for while staying on-brand rather than borrowing a foreign dark theme.
- **Nodes:** every topic is a small glowing dot (blurred halo + solid dot + very low-opacity "bubble" behind it) with its label offset outward along a short leader line — never text centered inside a circle, which is what caused label collisions in early iterations.
- **Tier sizing/coloring:** core nodes are gold (`#c9a227`/`#e0bd4b`), largest halo. Each domain has its own accent color (Functions blue, Trigonometry orange, Calculus green, Probability purple, Statistics pink, Geometry teal, Financial Maths yellow-gold); its subtopics inherit that color at the same or a lighter tint. Label weight/size steps down by tier (core boldest/largest → domain → subtopic smallest/lightest).
- **Ambient scatter:** a faint, blurred field of ~45 unrelated dots and a few connecting threads sits behind the main diagram (low opacity, slight blur) — evokes "there's a much bigger vault here" without cluttering the readable diagram in front. Purely decorative, not part of the data model.
- **No ring guides.** Earlier iterations drew faint concentric circles to mark the tiers; once the layout became organic (see below) there's no longer an exact radius for a ring to represent, so they were dropped.

## Data model

Content lives in a small, framework-agnostic data file (see "Components" below). Shape:

```ts
interface CoreTopic { id: string; label: string; blurb: string; }
interface DomainTopic {
  id: string; label: string; blurb: string;
  color: string; dotColor: string;
  corePrerequisite: string; // id of the one CoreTopic this domain depends on most
}
interface Subtopic { id: string; parent: string; label: string; blurb: string; }
interface CrossLink { from: string; to: string; } // subtopic id -> domain id
```

**Draft content** (validated in the mockups, needs a copy review pass before shipping — see Open Items):

- **Core (4):** Algebra, Equations, Integers, Directed Numbers.
- **Domains (7), each with one core prerequisite:** Functions←Equations, Trigonometry←Algebra, Calculus←Equations, Probability←Directed Numbers, Statistics←Integers, Geometry←Algebra, Financial Maths←Directed Numbers.
- **Subtopics (16, ~2 per domain):** e.g. Probability → Venn Diagrams, Tree Diagrams, Discrete Distributions, Continuous Distributions; Calculus → Differentiation, Integration; full list in the mockup source (`layout-v8.html` in `.superpowers/brainstorm/`, if still present) or to be re-authored during implementation.
- **Cross-links (2 in the mockup, expect a few more in the real set):** Discrete Distributions↔Statistics, Differentiation↔Trigonometry — subtopics that genuinely relate to a second domain beyond their primary parent.

Each domain having exactly **one** core prerequisite (rather than fanning every domain to every core node) is deliberate: it's what lets edges visually originate from a specific fundamental instead of an abstract center point, and it keeps the "click to see connections" feature semantically accurate rather than cosmetic.

## Layout algorithm

Positions are computed at runtime (client-side, on mount), not hand-plotted per breakpoint like the older `HscMathsPathway` component — with ~27 nodes and a "randomize every load" requirement (below), a formula-driven or physics-driven layout is the only approach that scales.

Two layouts are computed up front, and the UI tweens between them:

**1. Organic layout (default, first impression):**
- Nodes start at randomized positions within a rough radius band per tier.
- A small hand-written force relaxation runs ~260 iterations before anything renders: nodes repel each other (so nothing overlaps), edges (core→domain, domain→subtopic) act as springs pulling connected nodes toward a target distance, and a weak radial force nudges each node toward its tier's ideal distance from center.
- **Hierarchy safety clamp**, applied after the simulation settles: core nodes are hard-capped at radius ≤85, domains are hard-floored at radius ≥150, and every subtopic is hard-floored at 85px further out than wherever its own parent domain landed. This guarantees "more fundamental = closer to center" can never visually break, while angle (and moderate radius variation within each tier) stays free — this is what makes it look organic rather than gridded, without losing the legible hierarchy.
- **Randomized per page load:** the simulation's random seed is derived from load time, so the arrangement differs every visit (reinforces the "living" feel). This was stress-tested across many random reloads in the mockup; the clamp + label-declutter (below) keep every roll readable.

**2. Tidy layout (opt-in, on demand):** the original deterministic formula — core nodes at fixed 90°-apart positions, domains evenly spaced around a fixed-radius ring, subtopics evenly fanned around their parent domain's angle. No randomness, same every time. This is the "snap back to something scannable" view (see Interaction below).

**Label auto-declutter:** after each layout is computed, a pass measures every label's actual rendered bounding box (SVG `getBBox()`) and nudges any that overlap apart (a handful of iterations of pairwise push-apart), then re-anchors each leader line to follow. This runs independently for the organic layout and the tidy layout (their overlaps differ), and generalizes — it isn't hand-tuned per node, so it keeps working as topics are added, renamed, or reworded later.

## Scroll mechanic

Follows the same pattern already used on this site's homepage hero (`VisualIntro.tsx`) and `TransformationTimeline.tsx`: Framer Motion's `useScroll`/`useTransform` against a `position: sticky` panel inside a taller-than-viewport track. The real implementation should use those hooks directly rather than the mockup's manual `requestAnimationFrame` + `getBoundingClientRect` scroll listener, which was only necessary because the mockup tool's preview frame doesn't use plain document scroll — the real page does.

**Growth sequence**, driven by scroll progress through the track:
1. **Fundamentals** visible from the start (no fade-in needed, they're the baseline).
2. **Domains** fade/rise in with their connecting lines drawing on (not just fading — the line's stroke animates in via the SVG `pathLength` trick).
3. **Subtopics** fade/rise in the same way.
4. **Cross-links** draw in last, as the "everything's connected" finishing touch.
5. Growth fully resolves at roughly **68%** of the track's scroll distance.

**Soft lock:** the remaining ~32% of the track is a held "dead zone" — the diagram doesn't change further, so scrolling through it visibly does nothing for a stretch, which reads as resistance. This is *not* scroll-hijacking (no `preventDefault`, no intercepting wheel/touch input) — it's simply that the pinned track is longer than the animation needs, which is the standard, accessible way to get this feel without fighting the browser's native scroll (keyboard scroll, screen readers, and reduced-motion users are all unaffected). A small "All connected — scroll to continue ↓" prompt fades in during this zone so it reads as intentional rather than broken, and the stage caption switches to "Fully connected."

**`prefers-reduced-motion`:** following the existing pattern in `BasketballCalculusJourney` (checked via `window.matchMedia('(prefers-reduced-motion: reduce)')`), when reduced motion is requested the section should skip the pinned scroll-scrub entirely and render the fully-grown, fully-connected state immediately with no pin/lock — visitors still see and can interact with the complete diagram, they just don't get the scroll-driven reveal.

## Interaction

**Click a node** (only once the section is in its "fully connected" / locked state — nodes are inert, `pointer-events: none`, while still fading in): its direct connections light up (its core prerequisite for a domain, its parent + core-grandparent for a subtopic, plus any cross-link partner), everything else dims to ~14% opacity, and a card in the corner shows the node's label, its blurb, and a "Connects to: …" list. Clicking a core node highlights every domain that depends on it — the "everything traces back to this" moment. Clicking empty space, or the same node again, resets.

**"Snap to tidy view" toggle:** a button appears (same gating as node clicks — only once fully grown) that eases every node from the organic layout to the tidy layout over ~750ms, and back again on a second click. This directly answers "is the organic view too messy to actually read" — the wow moment is organic-on-load, and there's a one-click path to something scannable, without needing full manual drag-and-drop (considered and explicitly deferred — see Open Items).

Both interactions are additive to the "credibility visual" purpose, not a pivot toward a functional tool: nothing here needs to link out anywhere, and both are inert until the diagram has finished growing.

## Mobile behavior

Below the breakpoint the existing `useIsMobile` hook (`src/hooks/use-mobile.tsx`) already defines, the diagram does not render as a dense radial graph — validated separately as too cramped. Instead:
- Core fundamentals stay a small static row of pills at the top (no interaction needed, they're not the point of exploration).
- Each domain becomes a row in a tappable list.
- Tapping a domain unfolds its subtopics as an inline accordion (pushes the rest of the list down — normal document flow, nothing overlapping).
- No pinned scroll-scrub on mobile; the section behaves like a normal in-flow block. (The desktop's pin/lock mechanic is a "hold you in place while scrolling" pattern that's a much rougher experience on a phone-sized viewport and isn't worth the added complexity for that breakpoint.)

**Implementation note on the accordion:** the mockup animated `max-height` for the expand/collapse, which is a real layout-thrash risk if implemented that way in production. The real component should use either a transform/opacity-based approach or Framer Motion's built-in height animation (already used elsewhere in this codebase), not raw CSS `max-height` transitions.

## Components (suggested structure)

Following the existing feature-folder convention (e.g. `src/features/hsc-maths-pathway/`):

```
src/features/maths-topic-network/
  MathsTopicNetwork.tsx          — main component: renders desktop diagram + mobile accordion, owns scroll/interaction state
  topic-network-data.ts          — CORE / DOMAINS / SUBTOPICS / CROSS_LINKS content (typed, see Data model)
  topic-network-layout.ts        — pure functions: force relaxation, hierarchy clamp, tidy formula, label declutter
  topic-network-layout.test.ts   — unit tests for the pure layout functions (see Testing)
  maths-topic-network.css        — pin/sticky/glow/keyframe rules that don't fit cleanly in Tailwind classes
```

`MathsTopicNetwork.tsx` is imported into `Mathematics.tsx` the same way `HscMathsPathway` and `MathsGraphLabInvitation` already are.

## Performance notes

- The force relaxation is O(n²) per iteration over ~27 nodes for 260 iterations (~190k operations) — trivial, runs once on mount, not a concern.
- Scroll-driven updates must animate `opacity`/`transform` only, never layout properties (`width`/`height`/`top`/`left` etc.), and should be rAF-throttled if not already handled by Framer Motion's own scroll hooks.
- The mockup's `findScrollParent()` workaround (walking up the DOM for a scrolling ancestor) is specific to the visual-companion preview tool's non-standard scroll container and should **not** be carried into the real implementation — the real page uses plain document scroll, same as every other scroll-linked section on the site.

## Explicitly out of scope

- **Free drag-and-drop** of individual nodes. Considered and deferred: it would need to coexist with the pinned scroll-scrub, work on touch, and pushes the feature from "credibility visual" toward "interactive graph tool," which was explicitly not the goal. The organic/tidy toggle covers the "let me rearrange this" impulse without the build cost or scope drift.
- **Deep-linking / navigation.** Clicking a node shows a blurb card, nothing more — it does not route anywhere. If a future iteration wants nodes to link to real subject/topic pages, that's a separate scoped decision (also revisits accessibility/SEO implications of interactive-only content).
- **Exhaustive K-12 coverage.** Scoped to Years 7–12 per the site's HSC-heavy positioning; Primary School content is not included.

## Testing / verification

No end-to-end test framework exists in this repo (per `CLAUDE.md`); verification is `npm run lint`, `npm run build:dev`, and manual QA in the dev server, consistent with how the rest of the codebase is checked. Additionally, following the precedent set by `hsc-maths-pathway.test.ts` (which uses Node's built-in `node:test`):

- Unit tests for `topic-network-layout.ts`'s pure functions: given a fixed seed, the hierarchy clamp invariant holds (every core radius ≤ every domain radius ≤ its own children's radii) across many random seeds, not just one.
- A source-inspection test confirming `Mathematics.tsx` actually imports and mounts `MathsTopicNetwork`.
- Manual QA checklist: scroll growth resolves in order, soft lock holds and releases, click highlighting matches the data model's edges, tidy toggle animates both directions, mobile accordion expands/collapses without layout jank, `prefers-reduced-motion` shows the fully-grown static state.

## Open items for the user to confirm before/while implementing

1. **Content copy review.** The topic list, domain→core-prerequisite assignments, and all blurb text used in the mockups are drafts written for demonstration purposes, not finished marketing copy — review before shipping.
2. **Exact section placement** within `Mathematics.tsx`'s existing section order is a suggestion, not fixed by this spec.
3. **Cross-link list** is intentionally minimal (2 examples) in the mockups; the real content pass should identify the full, accurate set of cross-domain relationships worth surfacing.
