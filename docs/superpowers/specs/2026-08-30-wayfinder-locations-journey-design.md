# DA Tuition Locations: route-led journey redesign

## Intent

Rebuild the Locations page as one calm, premium journey from finding DA through to booking. The page must read as five connected stages—WHERE, WHEN, ARRIVE, COMMUNITY, READY—rather than five independent compositions. It will use a restrained cartographic language: hairline routes, aligned waypoints, coordinates, and pale map fields. It must not resemble a map application, dashboard, travel interface, or a collection of cards.

The approved reference is art direction only. No page or section is to be recreated from a raster image.

## Fixed constraints

- Reuse the established Georgia/Cabin type system and existing DA palette.
- Retain the existing selected-centre query parameter, two-building selector, address, Google directions links, booking path, timezone-aware opening-hours helper, and arrival data.
- Do not invent walking times, school partnerships, centre counts, or opening-hour exceptions.
- Preserve the Community map as a genuine Leaflet local Canley Heights to Sydney-wide, scroll-driven camera movement. It remains reversible and uses real school-community data. No replacement map, cards, tabs, or fake SVG map.
- Keep native page scrolling; the Community ending uses the existing readable scroll runway rather than an input-trapping scroll lock.
- Keep SVG limited to existing maps, route fragments, markers, and simple waypoints.

## Shared system

`WayfinderLocationsPage` becomes the page composition owner. Its five sections share a max-width editorial grid (approximately 1500px), wide clamp-based gutters, an aligned route axis, small gold stage labels, serif display headings, and thin architectural dividers. The route motif is implied through repeated alignment and short fragments rather than a fragile full-page SVG.

Light stages alternate quiet ivory, soft-white, and pale-champagne surfaces. Navy is reserved for functional emphasis and the final READY stage; gold denotes selected waypoints, active status, and route direction. Reusable CSS custom properties define colour, grid, route, and measure values within the Wayfinder scope.

## Section composition

### 01 / WHERE

The opening is a pale geographic field, not the old three-column hero. `WayfinderMap` remains the meaningful map layer and selected-building marker. The heading and supporting copy occupy a left editorial block that is spatially crossed by the route. A quiet destination rail on the far edge contains the accessible centre selector, short current status, selected building, address, and directions link. The map remains beneath the typography, with restrained gradients only where readability requires them.

The full opening-hours experience is deliberately absent here; only a compact current state is shown.

### 02 / WHEN

WHEN precedes ARRIVE. Its principal live state is isolated in a generous field: current day, status heading, and next opening/closing detail. The weekly schedule is an editorial row sequence with one current-day emphasis and small gold waypoint—not a bordered card or generic data table. The status continues to come exclusively from `getCentreStatus(effective.hours, effective.timezone)`.

### 03 / ARRIVE

ARRIVE becomes a progressive physical route. Existing arrival data supplies the station, connection method, destination, and supporting train/bus/parking notes. A central vertical sequence uses three simple circular waypoints and a fine, lightly bent connecting line; only the DA destination carries navy/gold emphasis. The notes are one divided information field, avoiding duplicated icon cards. No walking duration is shown because none is in the current source data.

### 04 / COMMUNITY

`CommunityMap` and its camera/tile/ResizeObserver mechanics remain untouched unless a concrete defect emerges. Its surrounding presentation changes only as necessary to match the new grid: local copy, final reach copy, label hierarchy, marker styling, and the quiet selected network anchors. The final state continues to say what dots represent without asserting an unverified school count or named teaching relationships.

### 05 / READY

READY is the only predominantly navy stage. `WayfinderMap` stays as a very subdued route trace behind the content. The content is split with a decisive primary booking action, secondary directions link, and compact selected-building address. The gold selected waypoint resolves the visual route begun in WHERE.

## Motion and accessibility

- Existing Framer Motion may introduce only opacity/transform/path-length transitions that do not alter layout.
- Route and waypoint movement is paced as a single calm settlement, not a repeated entrance system.
- The Community camera retains its bounded, frame-throttled Leaflet update and scroll-up reversal.
- `prefers-reduced-motion` renders static, complete states without content being hidden.
- Selectors, links, and native controls remain keyboard usable; decorative maps/route layers stay `aria-hidden`.

## Responsive composition

Desktop uses the wide editorial grid and roomy asymmetric fields. At tablet widths, information rails move beneath or beside the primary content without overflow. At 768px and below, the page becomes a vertical route narrative: WHERE map first/typography and destination rail follow; WHEN live status precedes weekly rows; ARRIVE shows the three-stop route followed by notes; COMMUNITY uses its existing mobile map-and-copy arrangement; READY keeps both actions visible and touch-sized.

Target rendered checks: 1440×900, 1280×800, 1024px, 768px, 390×844, and 360×800. There must be no horizontal overflow, clipped serif heading, tiny utility text, or decorative overlap.

## Implementation boundaries

Primary edits: `WayfinderLocationsPage.tsx` and `wayfinder.css`. Small presentation-only refinements may be made to `WayfinderMap.tsx` and `community-map.css` when they serve the shared system. `CommunityMap.tsx` logic is protected; no rewrite of its map lifecycle, data projection, or scroll choreography is in scope.

Focused source-contract tests will be updated only to cover structural guarantees that matter: stage ordering, live-status data source, map continuity, centre selection, and Community preservation. Existing tests remain required.

## Validation

1. `npm.cmd run test:wayfinder` passes.
2. The relevant development build passes.
3. Browser QA verifies desktop and mobile composition, live state, centre change, destination link presence, Community initial/final/reverse state, no framework overlay, and no relevant console errors.
4. `git diff --check` passes. Existing unrelated working-tree changes are not modified, reset, staged, committed, or deleted.
