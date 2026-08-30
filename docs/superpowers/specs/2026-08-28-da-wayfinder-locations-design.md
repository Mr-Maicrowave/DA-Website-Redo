# DA Wayfinder Locations Design Specification

## Scope
DA Wayfinder keeps the approved “Find your way to DA” concept: navy cartographic Explore/Ready, ivory Arrive/When/Nearby, gold route/action/destination semantics, custom lightweight cartography, Framer Motion and Google Maps only for external directions. It replaces only the body of `/tutoring-canley-heights`; routing, SEO, navigation, footer, booking and service-area pages remain intact.

## Physical-centre boundary
`canley-heights-building-1` is Canley Heights — Building 1, 1/194 Canley Vale Road, Canley Heights NSW 2166, using only the generic address-search directions URL. `canley-heights-building-2` is Canley Heights — Building 2, Level 1/229 Canley Vale Road, Canley Heights NSW 2166, retaining its existing verified directions URL. `src/data/locations.ts` remains service-area content and never populates the selector.

## Scalable layered data
Use organisation defaults, location groups and physical-centre overrides:
```ts
type OrganisationDefaults = { bookingPath?: string; phone?: string };
type LocationGroup = {
 id: string; displayName: string; timezone: string; mapSceneId: string;
 phone?: string; bookingPath?: string; hours?: CentreHours; parking?: string;
 arrival?: ArrivalDetails; nearbyContext?: NearbyContext;
};
type PhysicalCentre = {
 id: string; locationGroupId: string; buildingLabel: string;
 addressLines: readonly [string, string]; directionsUrl: string;
 marker: {x:number;y:number}; focus: MapFocus;
 phone?: string; bookingPath?: string; hours?: CentreHours; parking?: string;
 arrival?: ArrivalDetails; accessibility?: string; entranceNote?: string; dropOffNote?: string;
};
```
Resolve centre override → location group → organisation default. Optional arrival categories are omitted. Current shared facts belong to the Canley Heights group, never to a global Canley default. Future groups can have different timezone, phone, hours, parking, arrival, nearby context and booking path.

## Map scenes
Define `WayfinderMapScene` with `id`, `locationGroupId`, `viewBox`, sparse geometry, labels and contextual places. Centres reference their group scene and provide marker/focus configuration. The current buildings share `canley-heights`; same-scene switching pans/reframes one scene. A future centre in an existing scene needs centre data only. A new geographic area needs centre data plus a reusable scene definition. No centre-ID conditionals belong in `WayfinderMap`; cross-scene switching fades/retracts the old scene then resolves the new scene.

## One state and interactions
`WayfinderLocationsPage` owns the only selected-centre state via `?centre=<id>`; invalid/missing values resolve safely to the default and unrelated params are retained. Change centre appears only with two or more physical centres, names both group and building, and never lists service areas. Hero, marker, address, directions, status, hours, parking, arrival, transport, nearby, final CTA, accessibility, entrance and drop-off all derive from one resolved centre.

## Route, responsive and motion
Each chapter owns a small `RouteSegment` with CSS-grid entry/exit anchors: centre column desktop, left spine mobile. Framer Motion `useScroll`/`useTransform` maps actual local section progress to pathLength, so drawing advances/retracts smoothly; IntersectionObserver may only gate non-critical work. No full-page SVG, scroll-jacking or brittle viewport coordinates. Reduced motion shows complete static routes/maps and immediate switching.

At 1024px reduce map detail, at 768px stack content, and at 390px keep essential geometry/selected label, readable nearby list fallback, visible selector and no horizontal overflow. Decorative SVG geometry is aria-hidden; all facts remain semantic HTML with focus-visible controls and concise aria-live destination updates.

## Future-state acceptance
Canley Heights (2), Parramatta (1) and Chatswood (2) can be represented without union-type edits, selector branches, page-markup branches, CTA branches or status changes. Each group can differ in context and each building can override it.

