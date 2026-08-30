# DA Wayfinder Locations Implementation Specification and Build Plan

> Do not implement until this plan is approved.

**Goal:** Build DA Wayfinder around layered organisation/group/centre data, configurable map scenes and scroll-progress route segments.

**Spec:** `docs/superpowers/specs/2026-08-28-da-wayfinder-locations-design.md`

## File boundary
- `src/data/physical-centres.ts`: defaults, groups, centres, resolution helpers.
- `src/data/wayfinder-map-scenes.ts`: scene geometry, labels and nearby context.
- `src/data/physical-centres.test.ts`: inheritance, overrides, fallback, IDs, selector threshold, scene lookup.
- `src/features/wayfinder/centre-status.ts` and test: timezone-aware status.
- `src/features/wayfinder/WayfinderMap.tsx`: scene-driven SVG and marker transitions.
- `src/features/wayfinder/RouteSegment.tsx`: local scroll-progress SVG path.
- `src/features/wayfinder/CentreSelector.tsx`: accessible selector.
- `src/features/wayfinder/WayfinderLocationsPage.tsx`: single query-selected resolved centre.
- `src/features/wayfinder/wayfinder.css`: responsive anchors and reduced motion.
- `src/pages/locations/CanleyHeights.tsx`: retained wrapper/SEO/navigation/footer.

## Task 1 — Layered centre data, test first
1. Write failing tests for scalable string IDs, Building 1/2 lookup, invalid fallback, selector threshold, Canley inheritance, centre override precedence, synthetic Parramatta isolation and map-scene lookup.
2. Run `node --test --experimental-strip-types src/data/physical-centres.test.ts`; confirm failure.
3. Implement organisation defaults, location groups, physical centres and `resolveCentre()`; add one Canley Heights group with `Australia/Sydney` and both verified building records.
4. Rerun focused tests; commit the data files only.

## Task 2 — Map-scene configuration, test first
1. Add failing tests proving both current buildings resolve to `canley-heights` with unique markers/focus and that a synthetic Parramatta centre resolves to a distinct scene with no `WayfinderMap` modification.
2. Implement a sparse Canley scene in `wayfinder-map-scenes.ts`; nearby schools belong to that scene.
3. Rerun tests and commit.

## Task 3 — Timezone status, test first
1. Add deterministic tests for Sydney open, closed, opens later, closing soon, group timezone and centre-hours override.
2. Implement `getCentreStatus(hours, timezone, now)` with `Intl.DateTimeFormat(...).formatToParts()`, never local `Date#getHours()`.
3. Run tests and commit.

## Task 4 — Map and progressive route primitives, test first
1. Test selected/secondary markers, aria-hidden geometry, same-scene focus inputs and cross-scene transition inputs.
2. Implement a small scene SVG driven by scene config and Framer Motion only.
3. Test a `RouteSegment` path receives independent scroll progress.
4. Implement local `useScroll({target: sectionRef, offset: ['start end','end start']})` plus `useTransform` for reversible pathLength; add desktop/mobile grid anchors.
5. Run tests and commit.

## Task 5 — One-state page, test first
1. Test Building 1/2 query selection, unrelated query preservation, exact directions links, selector threshold and dependent-section updates.
2. Implement `CentreSelector` and compute one resolved centre from `useSearchParams()`.
3. Render Explore, Arrive, When, Nearby and Ready from resolved effective values; render only present arrival fields.
4. Replace only the old CanleyHeights page body; retain wrapper infrastructure.
5. Run tests and commit.

## Task 6 — QA
Run focused tests, `npm.cmd run typecheck`, `npm.cmd run build` and `git diff --check`. Inspect 1440, 1920, 1024, 768 and 390px. Capture Building 1 hero, Building 2 hero, switch transition, route seam, Arrive, When, Nearby, Ready, full desktop, mobile hero/practical view and reduced motion. Keyboard-test selection, URL, directions and focus. Fix every observed defect test-first.

## Acceptance
Existing-scene centre = centre data only. New-area centre = centre data plus scene definition. No service area enters the selector. No future centre requires union-type, selector, section, CTA or status-rendering changes.

