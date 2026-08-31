# Handoff — Fix the Leaflet community map (four bugs from first-pass QA)

**Target model: Claude Sonnet.** This is debugging real runtime behaviour in a scroll-scrubbed
Leaflet integration (tile loading, `ResizeObserver` interaction, and rAF-driven state) — not a simple
copy fix. Read `prototype-handoffs/community-map-rebuild.md` first for the original spec and the
design decisions that are still locked (do not relitigate the sequence, basemap choice, or the
honesty constraint on the school count).

**Repo:** `C:\Projects\DA-Website-Redo` · React 18.3.1 + TypeScript + Vite + framer-motion 12 + Leaflet 1.9
**Component:** `src/features/wayfinder/CommunityMap.tsx` (+ `community-map.css`)
**Page:** `/locations` → `src/features/wayfinder/WayfinderLocationsPage.tsx`, "04 / COMMUNITY" section

The Leaflet rebuild (per that spec) is implemented and unit tests pass, but a first visual pass in
the browser found four real bugs. A screenshot of the broken state is attached in the conversation
this handoff came from — every visible tile just reads "Map data not yet available" tiled across the
whole viewport, which is Esri's own placeholder image, not a network failure.

## Bug 1 — No tiles ever load ("Map data not yet available" everywhere)

This is almost certainly the root cause behind bugs 2 and 3 as well, so fix this first and re-check
the others before doing anything else.

Two concrete hypotheses to check, in order:

1. **`getBoundsZoom` runs before the map container has a real size.** `CommunityMap.tsx`'s mount
   effect calls `recomputeBounds()` synchronously right after `L.map(...)` is created. If
   `mapElRef.current` is still zero-sized at that point (CSS/layout not yet settled — this section
   uses `position: sticky` inside a `174svh`-tall parent, which can easily be 0×0 on the very first
   layout pass), `map.getBoundsZoom()` can return `Infinity`/`NaN`/`0`. Downstream, `render()` guards
   on `if (!localZoom || !sydneyZoom) return;` — note this also (incorrectly) bails on a legitimately
   falsy `0`, which is a bug in its own right, but the bigger problem is that if this guard trips on
   *every* frame, `map.setView()` is never called with sane arguments and the map may fall back to
   whatever wrong default location/zoom produces this placeholder tile everywhere. Instrument
   `recomputeBounds()` (temporarily `console.log` the container's `getBoundingClientRect()` and the
   two computed zoom values) and confirm whether they're sane numbers on first run. If not, defer the
   first `recomputeBounds()` call to next frame (`requestAnimationFrame`) or gate it on the
   `ResizeObserver`'s first real callback instead of calling it eagerly and synchronously.
2. **Esri's actual max zoom is lower than the `maxZoom: 19` set on the tile layers.** `LOCAL_BOUNDS`
   is a very tight box (~150m across), so `getBoundsZoom(LOCAL_BOUNDS, true)` will ask for a very high
   zoom to fill the viewport with it — plausibly 18–19+. Esri's `World_Light_Gray_Base` /
   `World_Light_Gray_Reference` MapServer layers do not have real imagery that deep everywhere; past
   their native max zoom they can return this exact "Map data not yet available" placeholder tile
   instead of erroring. Check the ArcGIS REST service's actual `maxZoom` (`.../MapServer?f=json` will
   report it, commonly 16), set `L.tileLayer(..., { maxZoom: <site's real max>, maxNativeZoom: <same>
   })` accordingly, and reconsider whether `LOCAL_BOUNDS` is small enough that no reasonable zoom will
   look good — you may need to loosen `LOCAL_BOUNDS` slightly so the natural fitting zoom stays within
   what the tile service actually serves, or clamp the computed zoom to the layer's max before calling
   `map.setView`.

Fix whichever (likely both) apply, then confirm real street-level tiles render at the top of the
section and real Sydney-wide tiles render at the bottom, in the browser, before moving on.

## Bug 2 — Local street-level view isn't visible before the pull-back

Once Bug 1 is fixed, re-check this — it may simply have been hidden behind blank placeholder tiles.
If it's still broken after Bug 1 is fixed: confirm `render()`'s `p <= 0.28` branch is actually being
reached early in the scroll (log `p` and the branch taken), and confirm `LOCAL_BOUNDS` /
`localCentre` / `localZoom` are what you expect at that point — it's possible the section's scroll
range (`useScroll({ offset: ['start start', 'end end'] })` in `WayfinderLocationsPage.tsx`) starts
`communityProgress` at something other than 0 on load, which would skip the held street-level beat
entirely.

## Bug 3 — No dots appear even at the end of the scroll

Check, in order:

1. Whether `render()` is bailing out entirely due to the Bug 1 guard (`if (!localZoom || !sydneyZoom)
   return;`) — if so this is the same root cause and should resolve once Bug 1 is fixed.
2. Whether `dotGroupRefs.current[index]` is actually populated for all 80 schools — log
   `dotGroupRefs.current.filter(Boolean).length` after mount; it should be 80. If it's 0, the callback
   refs in the `SORTED_SCHOOLS.map(...)` JSX aren't attaching (check for a key/remount issue).
3. Whether `p` ever actually reaches into the `0.74–1.0` window during a real scroll — log the raw `p`
   value on `progress.on('change', ...)` and scroll to the very bottom of the section. If `p` maxes
   out below `~0.74` (e.g. because the section's total scrollable height, `174svh`/`1120px` mobile, is
   shorter than the actual rendered content, or the sticky container's `overflow: hidden` is clipping
   the scroll range), the dot-reveal window is simply never entered.
4. Double check the per-dot opacity math isn't producing `0` at `p = 1`: `t = clamp01((p - start) /
   0.10)` where `start = 0.74 + (index / 80) * 0.16` — the last dot's `start` is `0.74 + (79/80)*0.16
   ≈ 0.898`, so at `p = 1`, `t = clamp01((1 - 0.898) / 0.10) = 1`. That's correct in isolation, so if
   dots still don't show once 1–3 are ruled out, check the CSS: confirm
   `.community-map__dot-group { opacity: 0; }` is being overridden by the inline `style.opacity` set
   in `render()` (inline styles should always win, but confirm no `!important` elsewhere conflicts),
   and confirm `.community-map__overlay` isn't being clipped by a parent `overflow: hidden` at the
   point the dots are supposed to render off to the sides of the initial local view.

## Bug 4 — Flickering between states while scrolling

Strongest suspect: the `ResizeObserver` in the mount effect observes `mapElRef.current` and calls
`recomputeBounds()` on every callback, which itself calls `map.invalidateSize()`. Calling
`invalidateSize()` from inside a `ResizeObserver` callback that is observing the very element Leaflet
is resizing is a known way to trigger a resize/observe feedback loop (`ResizeObserver` firing again in
response to the size change `invalidateSize()` itself can cause), which would look exactly like
flicker/thrashing while the section is pinned and being scrubbed. To fix:

- Debounce or guard `recomputeBounds()` so it only actually recomputes when the container's size has
  *meaningfully* changed (compare against the last known width/height before doing the expensive
  `getBoundsZoom` + `invalidateSize` + `render` work), not on every `ResizeObserver` callback.
- Consider whether `invalidateSize()` needs to run at all outside of an actual browser resize — it's
  arguably unnecessary inside the same callback that also freshly measures bounds for zoom
  calculation; if removing it (or only calling it when width/height actually differ from the last
  observed values) stops the loop, that confirms the diagnosis.
- Separately, check that the rAF-throttled `progress.on('change', ...)` subscription in the second
  effect isn't somehow re-subscribing every frame (it shouldn't, since its dependency array is
  `[progress, reduceMotion]`, both stable) — but verify with a log counter if the flicker persists
  after fixing the `ResizeObserver` loop.

## Definition of done

1. Scroll from the top of the "04 / COMMUNITY" section to the bottom slowly. Real Esri tiles are
   visible throughout — no "Map data not yet available" placeholder at any point.
2. The street-level phase (first ~28% of the section's scroll) clearly shows real local street tiles,
   held steady, before the pull-back begins.
3. The pull-back to the Sydney-wide frame is smooth, with no visible flicker, stutter, or repeated
   snap-back.
4. By the end of the scroll, dots are visible scattered across the Sydney-wide frame, radiating
   outward from the Canley Heights hub in the correct stagger order (nearest first).
5. Scrolling back up reverses all of the above with no stuck or orphaned state.
6. Re-run `npm run test:wayfinder` — it must still pass; do not weaken the assertions to work around
   any of these bugs.
7. Note in `prototype-handoffs/community-map-fixes.md` (this file) or back to the user which of the
   above hypotheses were the actual root cause(s), since they weren't confirmed by execution when this
   handoff was written — only inferred from the code and the screenshot.
