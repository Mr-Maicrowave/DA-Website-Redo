# DA Tuition Locations Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the DA Tuition Locations page as one premium, route-led five-stage journey while preserving its location data, live status logic, and scroll-scrubbed Community map.

**Architecture:** `WayfinderLocationsPage.tsx` owns the section sequence and composes existing source-of-truth data into new semantic groups. `wayfinder.css` supplies the shared editorial grid, surface rhythm, route motif, and responsive recomposition. `CommunityMap.tsx` retains its Leaflet/tile/camera lifecycle; only its surrounding presentation may change.

**Tech Stack:** React 18, TypeScript, Vite, Framer Motion, Leaflet, Lucide, Node native tests, CSS.

**Spec:** `docs/superpowers/specs/2026-08-30-wayfinder-locations-journey-design.md`

## Global Constraints

- Preserve `centre` query-param selection, `resolveCentre()`, `getCentreStatus()`, `PHYSICAL_CENTRES`, directions URLs, booking path, and Australia/Sydney timezone logic.
- Use only existing Georgia/Cabin typography and the existing ivory/white/champagne/navy/gold palette.
- Do not invent travel times, school partnerships, counts, or exceptional opening hours.
- Preserve `CommunityMap`'s local-to-Sydney Leaflet camera movement, native scroll, tile safety, reverse behaviour, and reduced-motion fallback.
- Do not use section screenshots/rasterized UI or a full-page SVG route.
- Preserve unrelated dirty work. Do not stage, commit, reset, clean, or delete files in this checkout.
- Validate the finished page at 1440×900, 1280×800, 1024px, 768px, 390×844, and 360×800.

---

## File structure

- `src/features/wayfinder/WayfinderLocationsPage.tsx` — semantic five-stage composition and data binding.
- `src/features/wayfinder/wayfinder.css` — scoped layout, hierarchy, shared route motif, responsive recomposition, motion fallback.
- `src/features/wayfinder/CommunityMap.tsx` — protected Leaflet scene; only a stable presentation hook may be added if required by the new composition.
- `src/features/wayfinder/community-map.css` — Community overlay/card presentation and mobile presentation.
- `src/features/wayfinder/WayfinderMap.test.ts` — source contracts for stage order, live data, map preservation, and structural route rules.
- `src/features/wayfinder/WayfinderLocationsPage.test.ts` — create only if focused component source assertions cannot remain coherent in `WayfinderMap.test.ts`.

## Task 1: Establish the shared route-led page structure

**Files:**
- Modify: `src/features/wayfinder/WayfinderLocationsPage.tsx`
- Modify: `src/features/wayfinder/WayfinderMap.test.ts`

**Interfaces:**
- Consumes: `resolveCentre`, `PHYSICAL_CENTRES`, `getCentreStatus`, existing `WayfinderMap`, `CommunityMap`, `effective.arrival`, and `effective.hours`.
- Produces: ordered landmarks with IDs `where-title`, `when-title`, `arrive-title`, `community-title`, and `ready-title`; `CommunityMap` continues to receive `communityMapProgress` and the resolved booking path.

- [ ] **Step 1: Add the structural source-contract test.**

```ts
test('the Locations journey has the approved five-stage order and preserves CommunityMap progress', () => {
  assert.match(wayfinderPageSource, /01 \/ WHERE/);
  assert.match(wayfinderPageSource, /02 \/ WHEN/);
  assert.match(wayfinderPageSource, /03 \/ ARRIVE/);
  assert.match(wayfinderPageSource, /04 \/ COMMUNITY/);
  assert.match(wayfinderPageSource, /05 \/ READY/);
  assert.match(wayfinderPageSource, /<CommunityMap progress=\{communityMapProgress\}/);
});
```

- [ ] **Step 2: Run the focused test and verify that the old numbering/order fails.**

Run: `npm.cmd run test:wayfinder`

Expected: the new source-contract test fails because ARRIVE currently appears before WHEN and the old labels use EXPLORE.

- [ ] **Step 3: Recompose `WayfinderLocationsPage` around semantic stage shells.**

```tsx
<section className="wayfinder-where" aria-labelledby="where-title">…</section>
<section className="wayfinder-when" aria-labelledby="when-title">…</section>
<section className="wayfinder-arrive" aria-labelledby="arrive-title">…</section>
<section className="wayfinder-community" ref={communityRef} aria-labelledby="community-title">
  <div className="wayfinder-community__sticky">
    <CommunityMap progress={communityMapProgress} bookingPath={effective.bookingPath ?? '/book-interview'} />
  </div>
</section>
<section className="wayfinder-ready" aria-labelledby="ready-title">…</section>
```

Keep the native `<select>` centre control and all existing links; reorganise only markup and section labels. Use the live status only via `status.heading` and `status.detail`.

- [ ] **Step 4: Run focused tests and inspect route semantics.**

Run: `npm.cmd run test:wayfinder`

Expected: all Wayfinder tests pass; section source contains the five approved stages once each.

## Task 2: Build WHERE and WHEN as a connected light editorial opening

**Files:**
- Modify: `src/features/wayfinder/WayfinderLocationsPage.tsx`
- Modify: `src/features/wayfinder/wayfinder.css`
- Modify: `src/features/wayfinder/WayfinderMap.test.ts`

**Interfaces:**
- Consumes: `centre`, `group`, `status`, `effective.hours`, and `WayfinderMap selectedCentre={centre} variant="hero"`.
- Produces: `wayfinder-where__destination`, `wayfinder-where__selector`, `wayfinder-when__live`, and `wayfinder-when__week` presentation hooks.

- [ ] **Step 1: Add failing contracts for real status and native centre selection.**

```ts
test('WHERE and WHEN use the resolved live centre data rather than screenshot values', () => {
  assert.match(wayfinderPageSource, /getCentreStatus\(effective\.hours!, effective\.timezone\)/);
  assert.match(wayfinderPageSource, /value=\{centre\.id\}/);
  assert.match(wayfinderPageSource, /effective\.hours\?\.map/);
  assert.doesNotMatch(wayfinderPageSource, /Opens Tuesday at 4:30 pm/);
});
```

- [ ] **Step 2: Run focused tests and verify the new contracts fail before the rewrite.**

Run: `npm.cmd run test:wayfinder`

Expected: failure until the renamed stage composition and source hook names exist.

- [ ] **Step 3: Implement the WHERE semantic field.**

Keep `WayfinderMap` as the pale background. Place a left editorial heading, a quiet right destination rail, an accessible selector, short current state, selected building/address, and directions link. Do not add a card wrapper; use a route-aligned divider and a readable gradient only behind text.

- [ ] **Step 4: Implement WHEN with dominant live state and editorial weekly rows.**

```tsx
<div className="wayfinder-when__live">
  <p>TODAY / {today}</p>
  <strong>{status.heading}</strong>
  <span>{status.detail}</span>
</div>
<dl className="wayfinder-when__week">
  {effective.hours?.map((item) => <div key={item.day}>…</div>)}
</dl>
```

Use the current-day class only for the computed current weekday. Keep the existing status helper as the only source of opening text.

- [ ] **Step 5: Add responsive layout rules for 1024px and below.**

Define Wayfinder-scoped tokens (`--wayfinder-gutter`, `--wayfinder-content-max`, `--wayfinder-route-axis`) and switch WHERE/WHEN from editorial grid to stacked fields at `max-width: 768px`. Ensure selector and directions link have at least 44px touch height.

- [ ] **Step 6: Run focused tests and manual browser checks.**

Run: `npm.cmd run test:wayfinder`

Browser checks: change the selected building; confirm heading rail, address, destination link, and weekly rows reflect the resolved centre; test desktop and 390px width for no overflow.

## Task 3: Build ARRIVE and READY as the route’s physical progression and conclusion

**Files:**
- Modify: `src/features/wayfinder/WayfinderLocationsPage.tsx`
- Modify: `src/features/wayfinder/wayfinder.css`
- Modify: `src/features/wayfinder/WayfinderMap.test.ts`

**Interfaces:**
- Consumes: `effective.arrival`, `effective.parking`, `centre.addressLines`, `centre.directionsUrl`, `effective.bookingPath`, `WayfinderMap` `ready` variant.
- Produces: `wayfinder-arrive__journey`, `wayfinder-arrive__details`, `wayfinder-ready__content`, and `ready-actions` with intact hrefs.

- [ ] **Step 1: Add a failing route-data contract.**

```ts
test('ARRIVE and READY retain real arrival and conversion data', () => {
  assert.match(wayfinderPageSource, /effective\.arrival\?\.stationLabel/);
  assert.match(wayfinderPageSource, /effective\.arrival\?\.notes\?\.map/);
  assert.match(wayfinderPageSource, /centre\.directionsUrl/);
  assert.match(wayfinderPageSource, /effective\.bookingPath \?\? '\/book-interview'/);
});
```

- [ ] **Step 2: Run focused tests and verify the source contract fails before new class hooks are added.**

Run: `npm.cmd run test:wayfinder`

Expected: failure until the new journey/detail hooks exist.

- [ ] **Step 3: Implement a three-stop ARRIVE sequence.**

Render station, connection, and DA destination as ordered semantic content. Use existing Lucide icons only inside small waypoints; the central route itself is a CSS hairline. Map the existing notes into a single `dl` with dividers. Do not add a walking-time claim or three repeated cards.

- [ ] **Step 4: Implement READY as the single navy conclusion.**

Retain the `ready` map variant, booking link, directions URL, and selected address. Place conversion copy, actions, and address in an editorial content field; reduce the map opacity and route weight so it supports—not competes with—the CTA.

- [ ] **Step 5: Add mobile recomposition.**

At 768px and below, make ARRIVE a vertical narrative (heading → stops → details) and READY stack actions with full-width or comfortably sized touch targets. Check 360px headings and address wrapping.

- [ ] **Step 6: Run focused tests and browser interaction checks.**

Run: `npm.cmd run test:wayfinder`

Browser checks: verify booking/directions links have correct hrefs, visible focus styles, and no collision between map traces, headings, or address at desktop and 360px.

## Task 4: Integrate Community presentation without rebuilding its map mechanic

**Files:**
- Modify: `src/features/wayfinder/community-map.css`
- Modify: `src/features/wayfinder/CommunityMap.tsx` only if an additional class/presentation hook is necessary
- Modify: `src/features/wayfinder/wayfinder.css`
- Modify: `src/features/wayfinder/WayfinderMap.test.ts`

**Interfaces:**
- Consumes: existing `CommunityMap` `progress`, `bookingPath`, Leaflet refs, `COMMUNITY_SCHOOLS`, and `useReducedMotion` handling.
- Produces: a local-first and Sydney-wide editorial map composition that remains governed by the existing `communityMapProgress` transformation.

- [ ] **Step 1: Add protected-infrastructure tests before presentation work.**

```ts
test('Community retains its protected map mechanics during the page redesign', () => {
  assert.match(communityMapSource, /zoomSnap:\s*0/);
  assert.match(communityMapSource, /World_Light_Gray_Base/);
  assert.match(communityMapSource, /requestAnimationFrame/);
  assert.match(wayfinderPageSource, /useTransform\(communityProgress, \[0, 0\.82\], \[0, 1\]/);
});
```

- [ ] **Step 2: Run focused tests and verify all existing Community contracts remain green.**

Run: `npm.cmd run test:wayfinder`

Expected: all Community lifecycle/tile/reverse-scroll contracts continue passing before CSS changes.

- [ ] **Step 3: Refine only the surrounding typography and containment.**

Align Community card/copy measurements with the new editorial grid, keep the card out of the map’s primary school cluster, and retain the current calm network anchors. Do not alter camera bounds, tile configuration, `ResizeObserver`, scroll scheduling, or school coordinates without a demonstrated bug.

- [ ] **Step 4: Check Community states in-browser.**

Browser checks: inspect local start, mid-pullback, final Sydney state, rapid reverse scroll, nav-collapsed full-height state, 768px, and 390px. Verify no grey tile gaps, no floating copy obscures the dominant map area, dots/lines are subordinate to labels, and reduced-motion remains coherent.

- [ ] **Step 5: Run focused tests.**

Run: `npm.cmd run test:wayfinder`

Expected: all map, data-honesty, performance, and composition contracts pass.

## Task 5: Cross-viewport visual QA and handoff

**Files:**
- Modify: `src/features/wayfinder/wayfinder.css` only for defects discovered during rendered QA
- Modify: `src/features/wayfinder/WayfinderMap.test.ts` only when a repaired defect needs a durable source contract

**Interfaces:**
- Consumes: all preceding markup/style changes and existing Browser local-preview workflow.
- Produces: evidence-backed desktop/tablet/mobile composition with no relevant console errors.

- [ ] **Step 1: Start the local preview and establish the test route.**

Run: `npm.cmd run dev -- --host 127.0.0.1 --port 8080`

Route: `http://127.0.0.1:8080/tutoring-canley-heights`

- [ ] **Step 2: Validate wide desktop sections.**

At 1440×900 and 1280×800, inspect WHERE, WHEN, ARRIVE, COMMUNITY start/final, and READY. Confirm shared route alignment, readable hierarchy, restrained map decoration, and no generic card-grid appearance.

- [ ] **Step 3: Validate tablet and mobile recomposition.**

At 1024px, 768px, 390×844, and 360×800, verify no horizontal overflow, clipped heading, undersized utility text, inaccessible native selector, or overlapping map/route decoration.

- [ ] **Step 4: Validate interaction, console, and reduced motion.**

Change centre; verify source-derived address/links/hours. Scroll Community forward and back. Check browser logs for errors; React Router future warnings are recorded separately as non-blocking framework warnings. Enable reduced motion and confirm complete static content remains visible.

- [ ] **Step 5: Run final mechanical checks.**

Run: `npm.cmd run test:wayfinder`

Run: `npm.cmd run build:dev`

Run: `git diff --check`

Expected: Wayfinder tests pass, development build succeeds, and no whitespace errors exist. Report any unrelated pre-existing project typecheck failure separately rather than changing it.
