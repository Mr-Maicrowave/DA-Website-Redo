# Handoff — Rebuild the Wayfinder "Community" map on a real basemap

**Target model: Claude Sonnet.** Not Haiku — this touches a new runtime dependency, scroll-driven
camera choreography, an existing test file that asserts on source text, and responsive behaviour.
Haiku will get the Leaflet fractional-zoom and scrub-vs-animate details wrong.

**Repo:** `C:\Projects\DA-Website-Redo` · React 18.3.1 + TypeScript + Vite + framer-motion 12
**Page:** `/locations` → `src/features/wayfinder/WayfinderLocationsPage.tsx`
**Section:** `<section className="wayfinder-community">` (the 4th section, "04 / COMMUNITY")

---

## 1. Why this is being rebuilt

The community section currently draws its own map in SVG. Two problems, both confirmed by reading
the source:

1. **The Sydney-wide geometry is invented.** `src/data/community-basemap.ts` contains three 5-point
   "district masses", three "major roads" and four "connectors" that correspond to nothing real —
   no coastline, no Sydney Harbour, no Botany Bay, no actual M4/M5/M7. There is no recognisable
   Sydney silhouette, so the eye has no anchor and reads the strokes as noise.
2. **Both zoom levels are alive at once.** It is one continuous camera interpolation over a single
   SVG with `preserveAspectRatio="none"`, so the Canley Heights street grid survives all the way out
   to the ~75 km frame, stretched non-uniformly, on top of the regional lines.

The fix is to stop hand-drawing cartography and use a real basemap. The stakeholder supplied a
reference screenshot of exactly the intended result: a Leaflet map on Esri Light Gray tiles, warm
cream tones, navy dots for schools, a gold hub marker at Canley Heights, and a floating white card
on the left.

## 2. Decisions already made — do not relitigate these

| Decision | Choice |
|---|---|
| Basemap | **Esri Light Gray Canvas** via Leaflet raster tiles. No API key. Warm CSS filter on top. |
| Sequence | **Street level → pull back to Sydney → hold → dots fly in.** Both frames kept. |
| Copy layout | **Floating white card**, left side, contents cross-fade between the two beats. |
| Dot data | Keep the existing mock points as texture. **No fabricated numeric claim.** See §7. |
| Local detail | Blocks / parks / road hierarchy now come from the tiles — **do not hand-draw them.** |

## 3. Scope — what changes and what must not

**Create:**
- `src/features/wayfinder/CommunityMap.tsx` — the new Leaflet component
- `src/features/wayfinder/community-map.css` — its styles
- `src/data/community-schools.ts` — dot data with a `verified` flag

**Modify:**
- `src/features/wayfinder/WayfinderLocationsPage.tsx` — swap `<WayfinderMap variant="community">`
  for `<CommunityMap>`; move the community copy into the card
- `src/features/wayfinder/wayfinder.css` — remove `.community-map__*` and
  `.wayfinder-community__copy` / `__regional-copy` / `__caption` rules
- `src/features/wayfinder/WayfinderMap.test.ts` — see §8, rewrite rather than delete
- `package.json` — add `leaflet` + `@types/leaflet`; add a `test:wayfinder` script

**Delete once nothing imports them:**
- `src/data/community-basemap.ts` (the invented geometry — this is the point of the exercise)
- The `isCommunity` branches inside `src/features/wayfinder/WayfinderMap.tsx`
- `getCommunityCameraBounds`, `communityBounds`, `communityMetroBounds` in
  `src/data/wayfinder-map-scenes.ts`, and their assertions in `wayfinder-map-scenes.test.ts`

**CRITICAL — do not remove `WayfinderMap.tsx`.** It still renders the `hero`, `nearby` and `ready`
variants elsewhere on the same page. Only the `community` variant moves to Leaflet. Strip the
community code paths out of it; leave the rest working exactly as-is.

## 4. The map component

### Dependency and tiles

```
npm install leaflet @types/leaflet
```

Base layer, then a separate labels layer on top so label density is tunable independently:

```
https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}
https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}
```

**Gotcha:** ArcGIS REST uses `{z}/{y}/{x}` order, not the `{z}/{x}/{y}` most tile servers use.
Getting this wrong yields a mirrored, wrong-place map that still renders — so verify visually that
Botany Bay is where it should be.

Attribution is legally required and must stay visible:
`Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors`. Style it small and quiet in the
bottom-right; do not remove it.

### Warm tint

Esri Light Gray ships neutral grey. Nudge it toward the DA cream with a filter on the tile pane
only — never on the whole map container, or the navy dots and gold hub get tinted too.

```css
.community-map .leaflet-tile-pane { filter: var(--map-warmth); }
:root { --map-warmth: sepia(.30) saturate(.82) hue-rotate(-8deg) brightness(1.03); }
```

Expose it as a variable so it can be tuned without touching component code. Target look: land reads
as a warm off-white close to `#f0e8dc`, water noticeably cooler, labels still clearly legible.

### Map initialisation — this is where a naive implementation fails

The camera is **scroll-scrubbed, not animated.** Leaflet's `flyTo` runs its own animation clock and
will fight the scroll position, producing lag and rubber-banding. Instead drive `setView` directly
from scroll progress with all animation disabled:

```ts
const map = L.map(el, {
  zoomSnap: 0,          // REQUIRED — allows fractional zoom, without it the pull-back stair-steps
  zoomDelta: 0,
  zoomAnimation: false,
  fadeAnimation: false,
  markerZoomAnimation: false,
  attributionControl: true,
  zoomControl: false,
  // the map must never capture the user's scroll or touch:
  dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
  touchZoom: false, boxZoom: false, keyboard: false, tap: false,
});
```

Then on each scroll frame (rAF-throttled, one `setView` per frame maximum):

```ts
map.setView(center, zoom, { animate: false });
```

### Responsive camera — use bounds, not hardcoded zoom levels

A fixed zoom number that frames Sydney nicely at 1440px will crop it badly at 390px. Define the two
framings as `LatLngBounds` and derive the zoom per viewport:

```ts
const LOCAL_BOUNDS  = L.latLngBounds([-33.8875, 150.9195], [-33.8795, 150.9365]);
const SYDNEY_BOUNDS = L.latLngBounds([-34.03, 150.62],     [-33.66, 151.30]);

const localZoom  = map.getBoundsZoom(LOCAL_BOUNDS,  true);
const sydneyZoom = map.getBoundsZoom(SYDNEY_BOUNDS, true);
```

Recompute both on resize. Interpolate zoom **linearly in zoom-space** (zoom is already logarithmic,
so a linear lerp between the two gives a visually constant-rate pull-back — do not lerp the bounds
themselves, which produces a rush at the end).

Offset the Sydney centre so the hub sits clear of the card: shift the target centre east by roughly
18% of the visible longitude span on desktop, 0% on mobile where the card sits below.

## 5. Scroll choreography

Section height `min-height: 220svh`, inner `position: sticky; top: 56px; height: calc(100svh - 56px)`.
Use the existing `useScroll({ target: communityRef, offset: ['start start', 'end end'] })` pattern
already in `WayfinderLocationsPage.tsx`. Progress `p` runs 0 → 1.

| Range | Phase | Behaviour |
|---|---|---|
| `0 → .28` | **Street level, held** | Camera parked at `LOCAL_BOUNDS`. Both DA building plates and the gold Canley Vale Road connector visible. Card shows the local copy. |
| `.28 → .62` | **Pull back** | Zoom lerps `localZoom → sydneyZoom`, centre lerps to the offset Sydney centre. Ease with a cubic `t*t*(3-2*t)` so it starts and ends softly. Building plates fade out over `.28 → .38`. |
| `.44 → .56` | *(overlaps)* | Card contents cross-fade: local copy out `.44 → .50`, regional copy in `.50 → .56`. Card box itself never moves. |
| `.62 → .74` | **Hold** | Camera fully settled on Sydney. No dots yet. This empty beat is deliberate — it is what makes the dots land. Do not shorten it. |
| `.74 → 1.0` | **Dots fly in** | Staggered reveal, nearest-to-hub first. See below. |

### The dot reveal

Sort the school points by great-circle distance from the hub once, at module load. Map each dot's
index to a start offset inside the `.74 → 1.0` window so the wave radiates outward from Canley
Heights. Each dot animates over roughly 12% of the window:

```ts
const t = clamp01((p - (0.74 + (i / total) * 0.16)) / 0.10);
// scale: 0.4 → 1, with a slight overshoot at t≈0.8
// opacity: 0 → target
// translateY: -6px → 0
```

Because it is scrubbed, scrolling back up plays it in reverse — that is correct and desirable.

**Render the dots as an SVG overlay, not as Leaflet markers.** 80–130 `L.marker` or `L.circleMarker`
instances are slow and give no control over per-dot transforms. Instead: one absolutely-positioned
`<svg>` covering the map container, and on every camera update convert each point with
`map.latLngToContainerPoint(latlng)` to get `cx`/`cy`. This keeps everything in one paint and makes
the stagger trivial.

### Dot styling (from the reference)

- Standard: `r=5`, fill `#2c4a63`, `stroke #fff` at `1.5`, opacity `.88`
- Inner catchment (first 52 points, the Fairfield/Liverpool cluster): `r=5.5`, fill `#1e465f`, plus a
  second white ring at `r=8.5, stroke-width 1.2, opacity .55` — this is the double-ring look visible
  in the dense cluster in the reference
- Outer Sydney points: `r=4.5`, opacity `.62`
- **Hub** at the midpoint of the two centres: gold `#d6a921` core `r=7`, white ring `r=11`, gold ring
  `r=13 stroke 2`, and a soft radial glow `r=44`. Visible in every phase. Keep the existing slow
  `community-hub-pulse` animation from `wayfinder.css`.

## 6. The card

Matches the reference: a solid white panel over a full-bleed map, square corners, hairline rules
between blocks. It stays fixed in place for the whole section; only its contents change.

```
WHERE THEY COME FROM              11px / 800 / ls 2px / #6b7f8d
────────────────────────────────────────
One centre, trusted right         Georgia 500 / clamp(36px,3.4vw,52px) / lh 1.06 / #0b2135
across Sydney.                    "trusted" in italic + #a77e11
────────────────────────────────  hairline #e3ddd2
[ stat slot — see §7 ]
────────────────────────────────  hairline #e3ddd2
BOOK AN INTERVIEW  →              12px / 800 / ls 2px / underlined / links to effective.bookingPath
```

Box: `background #fff`, `border 1px solid #e3ddd2`, `border-radius 0`, `padding clamp(28px,3vw,44px)`,
`width clamp(320px, 31vw, 430px)`, `box-shadow 0 18px 48px rgba(11,33,53,.10)`.
Position: `left clamp(24px, 6vw, 84px)`, vertically centred in the sticky viewport.

Local-phase contents (before the cross-fade): eyebrow `04 / COMMUNITY`, headline `Local community.`,
body `Students join DA from schools across the surrounding Fairfield area.` Same box, same position.

Keep `aria-labelledby="community-title"` wired to whichever headline is currently opaque, and mark
the faded-out one `aria-hidden`.

## 7. Dot data and the honesty constraint

`src/data/community-school-points.ts` currently holds 80 **fabricated** points, flagged `mock: true`
with a header comment stating they are not verified student-origin data. That comment is correct and
must be respected.

Move the data to `src/data/community-schools.ts` with this shape:

```ts
export type CommunitySchool = {
  id: string; name: string | null; suburb: string;
  coordinates: { lat: number; lng: number };
  verified: boolean;
};
```

Carry the existing 80 points across with `verified: false`. They are fine as visual texture.

**The stat slot in the card renders only when there is verified data:**

```ts
const verifiedCount = COMMUNITY_SCHOOLS.filter(s => s.verified).length;
```

- `verifiedCount === 0` → render a plain sentence instead of the number:
  *"Students travel to Canley Heights from right across the city."*
- `verifiedCount > 0` → render the reference's stat block: the count in Georgia 48px `#a77e11`, with
  `local schools represented, and counting` beside it.

Never hardcode a school count. When the real list arrives it is a one-file swap and the number turns
on by itself. Do not print "122" or any other figure that is not derived from `verified: true` rows.

## 8. Existing tests — read before you touch them

`src/features/wayfinder/WayfinderMap.test.ts` asserts against the **source text** of
`WayfinderMap.tsx` (it does `readFileSync` and regex-matches). Several assertions reference things
this rework deliberately removes — `community-map__hub-glow`, the `progress - .08) / .12` label-fade
expression, the centre-label coordinates.

Do not delete the file and do not weaken assertions to make them pass. Those tests encode real past
design decisions. Rewrite them to assert the new invariants:

- `community-basemap.ts` is no longer imported anywhere (the invented geometry stays gone)
- `CommunityMap.tsx` initialises Leaflet with `zoomSnap: 0` (the fractional-zoom requirement)
- `CommunityMap.tsx` sets `dragging: false` and `scrollWheelZoom: false` (never steals scroll)
- The Esri attribution string is present
- No hardcoded school count appears in the card component
- `WayfinderMap.tsx` still exports the `hero` / `nearby` / `ready` variants

Add to `package.json`:
```
"test:wayfinder": "node --test --experimental-strip-types src/features/wayfinder/*.test.ts"
```

## 9. Mobile

- Card becomes full-width, anchored below the map: map `height 58svh`, card beneath it
- `SYDNEY_BOUNDS` framing derives from `getBoundsZoom` so it fits automatically — verify at 390px
- Drop the Sydney centre offset to 0 (the card no longer overlaps the map)
- Reduce the reference/labels tile layer opacity to ~.7 — Esri labels get dense on small screens
- Consider capping visible dots to the inner catchment plus the 10 furthest, if 80 dots crowd

## 10. Reduced motion

`useReducedMotion()` is already imported in this feature. When true: no scrub at all — render the
Sydney framing immediately, all dots at full opacity, no stagger, card shows the regional copy. The
section should still be scrollable and readable, just static.

## 11. Definition of done

```
npm run lint
npm run typecheck
npm run build:dev
npm run test:wayfinder
```

All four clean. Note `npm run build` also runs `check:encoding` — the existing copy uses a curly
apostrophe (U+2019) in "DA's"; keep that character consistent with the rest of the file or the check
fails.

Then verify by hand at `http://localhost:8080/locations`:

1. Scroll slowly through the whole community section. The pull-back is smooth with no stair-stepping
   (if it steps, `zoomSnap: 0` is missing or being overridden).
2. Scrolling with the cursor over the map scrolls the *page*, never zooms the map.
3. Botany Bay and Sydney Harbour are in the right places — confirms the `{z}/{y}/{x}` order is right.
4. At the street-level phase, Canley Vale Road and both building plates are clearly readable.
5. The hold beat exists — there is a moment where Sydney is settled and no dots have appeared.
6. Dots radiate outward from Canley Heights, not in random order.
7. Scroll back up: the dots retract in reverse. No stuck or orphaned dots.
8. Card text never sits on top of a busy tile region; the map is never visible *through* the card.
9. Repeat at 390px width.
10. No console errors, and no Leaflet "Map container is already initialized" warning on hot reload
    (clean up with `map.remove()` in the effect teardown).

## 12. Things to explicitly not do

- Do not hand-draw blocks, parks, roads, coastlines or building outlines. The tiles supply all of it.
  If something looks thin, adjust the tile filter or zoom — do not add invented geometry back.
- Do not use `flyTo` / `setZoomAround` / any animated Leaflet camera method. Scrub only.
- Do not render dots as Leaflet markers.
- Do not delete `WayfinderMap.tsx` — three other variants depend on it.
- Do not display any school count not derived from `verified: true` rows.
- Do not remove the Esri attribution.
