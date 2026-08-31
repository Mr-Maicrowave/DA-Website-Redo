import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const wayfinderMapSource = readFileSync(new URL('./WayfinderMap.tsx', import.meta.url), 'utf8');
const navigationSource = readFileSync(new URL('../../components/NavigationNew.tsx', import.meta.url), 'utf8');
const wayfinderPageSource = readFileSync(new URL('./WayfinderLocationsPage.tsx', import.meta.url), 'utf8');
const communityMapSource = readFileSync(new URL('./CommunityMap.tsx', import.meta.url), 'utf8');
const communityMapCssSource = readFileSync(new URL('./community-map.css', import.meta.url), 'utf8');
const wayfinderCssSource = readFileSync(new URL('./wayfinder.css', import.meta.url), 'utf8');
const communitySchemaSource = readFileSync(new URL('../../data/community-schools.ts', import.meta.url), 'utf8');

test('the invented regional basemap is no longer imported anywhere', () => {
  assert.doesNotMatch(wayfinderMapSource, /community-basemap/, 'WayfinderMap.tsx should not import the removed fabricated geometry module');
  assert.doesNotMatch(communityMapSource, /community-basemap/, 'CommunityMap.tsx should not import the removed fabricated geometry module');
});

test('WayfinderMap.tsx still exports the hero / nearby / ready variants and drops the community variant', () => {
  assert.match(wayfinderMapSource, /type WayfinderMapVariant = 'hero' \| 'nearby' \| 'ready'/, 'only the three non-Leaflet variants remain');
  assert.doesNotMatch(wayfinderMapSource, /isCommunity/, 'the community code paths have moved to CommunityMap.tsx');
});

test('the Locations journey has the approved five-stage order and preserves CommunityMap progress', () => {
  assert.match(wayfinderPageSource, /01 \/ WHERE/);
  assert.match(wayfinderPageSource, /02 \/ WHEN/);
  assert.match(wayfinderPageSource, /03 \/ ARRIVE/);
  assert.match(wayfinderPageSource, /04 \/ COMMUNITY/);
  assert.match(wayfinderPageSource, /05 \/ READY/);
  assert.match(wayfinderPageSource, /<CommunityMap progress=\{communityMapProgress\}/);
});

test('WHERE and WHEN use the resolved live centre data rather than screenshot values', () => {
  assert.match(wayfinderPageSource, /getCentreStatus\(effective\.hours!, effective\.timezone\)/);
  assert.match(wayfinderPageSource, /value=\{centre\.id\}/);
  assert.match(wayfinderPageSource, /effective\.hours\?\.map/);
  assert.match(wayfinderPageSource, /className="wayfinder-where__destination"/);
  assert.match(wayfinderPageSource, /className="wayfinder-where__selector"/);
  assert.match(wayfinderPageSource, /className="wayfinder-when__live"/);
  assert.match(wayfinderPageSource, /className="wayfinder-when__week"/);
  assert.doesNotMatch(wayfinderPageSource, /Opens Tuesday at 4:30 pm/);
});

test('WHERE keeps its selected destination live region mounted and uses accessible editorial label ink', () => {
  assert.match(
    wayfinderPageSource,
    /<div className="wayfinder-where__destination" aria-live="polite" aria-atomic="true">/,
    'the live region must persist while its destination content changes',
  );
  assert.doesNotMatch(
    wayfinderPageSource,
    /className="wayfinder-where__destination"\s+key=\{centre\.id\}/,
    'the live region itself must not be remounted for a centre change',
  );
  assert.match(
    wayfinderCssSource,
    /--wayfinder-gold-ink:\s*#72500a/,
    'small labels on ivory must use the darker AA-safe gold ink token',
  );
  assert.match(
    wayfinderCssSource,
    /\.wayfinder-navline span, \.wayfinder-step, \.wayfinder-where__editorial > p \{ color: var\(--wayfinder-gold-ink\); \}/,
  );
});

test('ARRIVE and READY retain real arrival and conversion data', () => {
  const arriveStart = wayfinderPageSource.indexOf('id="location-arrive"');
  const communityStart = wayfinderPageSource.indexOf('id="location-community"');
  const readyStart = wayfinderPageSource.indexOf('id="location-ready"');
  assert.ok(arriveStart >= 0 && communityStart > arriveStart, 'ARRIVE must remain a distinct stage before COMMUNITY');
  assert.ok(readyStart > communityStart, 'READY must remain the final journey stage');

  const arriveSectionSource = wayfinderPageSource.slice(arriveStart, communityStart);
  const readySectionSource = wayfinderPageSource.slice(readyStart);
  const arriveStops = arriveSectionSource.match(
    /<li className="wayfinder-route-node(?: is-destination)?">[\s\S]*?<\/li>/g,
  ) ?? [];

  assert.match(arriveSectionSource, /<ol className="wayfinder-arrive__journey"/);
  assert.equal(arriveStops.length, 3, 'ARRIVE must remain a three-stop route');
  assert.match(arriveStops[0] ?? '', /effective\.arrival\?\.stationLabel/, 'ARRIVE stop 1 must be the station');
  assert.match(arriveStops[1] ?? '', /effective\.arrival\?\.routeLabel/, 'ARRIVE stop 2 must be the route connection');
  assert.match(arriveStops[2] ?? '', /className="wayfinder-route-node is-destination"/, 'ARRIVE stop 3 must be the destination');
  assert.match(arriveStops[2] ?? '', /centre\.buildingLabel/, 'ARRIVE destination must retain the selected building');
  assert.match(arriveStops[2] ?? '', /centre\.addressLines\[0\]/, 'ARRIVE destination must retain address line 1');
  assert.match(arriveStops[2] ?? '', /centre\.addressLines\[1\]/, 'ARRIVE destination must retain address line 2');
  assert.match(arriveSectionSource, /<dl className="wayfinder-arrive__details"/);
  assert.match(arriveSectionSource, /effective\.arrival\?\.notes\?\.map/);
  assert.doesNotMatch(arriveSectionSource, /\b\d+\s*(?:-|–)?\s*(?:min|minute|minutes)\s+walk\b/i, 'ARRIVE must not invent a walking duration');

  assert.match(wayfinderPageSource, /effective\.bookingPath \?\? '\/book-interview'/);
  assert.match(readySectionSource, /<WayfinderMap selectedCentre=\{centre\} variant="ready"/);
  assert.match(readySectionSource, /className="wayfinder-ready__content"/);
  assert.match(readySectionSource, /className="ready-actions"/);
  assert.match(readySectionSource, /<Link to=\{bookingPath\}>/, 'READY must retain its resolved booking link');
  assert.match(readySectionSource, /centre\.addressLines\[0\]/);
  assert.match(readySectionSource, /centre\.addressLines\[1\]/);
  assert.match(readySectionSource, /href=\{centre\.directionsUrl\}/, 'READY must retain the selected centre directions URL');
});

test('ARRIVE recomposes before the desktop grid minimums can overflow', () => {
  assert.match(
    wayfinderCssSource,
    /@media \(min-width: 769px\) and \(max-width: 847px\) \{[\s\S]*?\.wayfinder-arrive\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)[^}]*\}[\s\S]*?\.wayfinder-arrive__details\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s,
    'the former 769–847px overflow band needs a two-column ARRIVE layout with details below',
  );
});

test('WHERE map geometry and its markers share one responsive SVG coordinate system', () => {
  assert.match(wayfinderMapSource, /<svg className="wayfinder-map" viewBox=\{`0 0 \$\{scene\.viewBox\.width\} \$\{scene\.viewBox\.height\}`\}/);
  assert.match(wayfinderMapSource, /<motion\.g animate=\{camera\}/, 'roads, route, property links, and markers must move as one map group');
  assert.match(wayfinderMapSource, /<motion\.path d=\{pathFromCoordinates\(scene\.connection, bounds, scene\.viewBox\)\}/, 'the gold route must use projected geographic coordinates');
  assert.match(wayfinderMapSource, /transform=\{`translate\(\$\{point\.x\} \$\{point\.y\}\)`\}/, 'building markers must use the same projected coordinates');
  assert.doesNotMatch(wayfinderPageSource, /wayfinder-route-exit/, 'a page-level absolute connector must not pretend to be part of the map geometry');
});

test('WHEN begins in a compact transition zone without a spacer-sized route connector', () => {
  assert.match(wayfinderCssSource, /\.wayfinder-when::before\s*\{[^}]*height:\s*clamp\(32px, 3vw, 44px\)/s);
  assert.match(wayfinderCssSource, /\.wayfinder-when__inner\s*\{[^}]*padding:\s*clamp\(56px, 5vw, 76px\)/s);
  assert.match(wayfinderCssSource, /\.wayfinder-when__week\s*\{[^}]*padding-left:\s*14px/s, 'today marker uses a dedicated row gutter');
  assert.match(wayfinderCssSource, /\.wayfinder-when__week \.is-today::before\s*\{[^}]*left:\s*-14px/s, 'today marker must stay anchored to the active row');
});

test('CommunityMap initialises Leaflet with fractional zoom and never steals the page scroll', () => {
  assert.match(communityMapSource, /zoomSnap:\s*0/, 'zoomSnap: 0 is required or the scroll-driven pull-back stair-steps');
  assert.match(communityMapSource, /dragging:\s*false/, 'the map must never capture drag input');
  assert.match(communityMapSource, /scrollWheelZoom:\s*false/, 'the map must never capture the page scroll');
});

test('the Esri attribution is present and required tile layers are used', () => {
  assert.match(communityMapSource, /Tiles &copy; Esri/, 'the legally required Esri attribution string must stay visible');
  assert.match(communityMapSource, /World_Light_Gray_Base/, 'uses the Esri Light Gray Canvas base layer');
  assert.match(communityMapSource, /World_Light_Gray_Reference/, 'uses a separate reference/labels layer');
});

test('CommunityMap stays within Esri Light Gray Canvas native tile coverage', () => {
  assert.match(communityMapSource, /const ESRI_MAX_NATIVE_ZOOM = 16/, 'Australian Light Gray Canvas coverage ends at zoom 16');
  assert.match(communityMapSource, /maxZoom: ESRI_MAX_NATIVE_ZOOM/, 'Leaflet must not request unsupported higher zooms');
  assert.match(communityMapSource, /maxNativeZoom: ESRI_MAX_NATIVE_ZOOM/, 'both Esri raster layers must clamp to native tiles');
});

test('Leaflet tiles stay behind the community overlay and card', () => {
  assert.match(communityMapCssSource, /\.community-map__canvas\s*\{[^}]*z-index:\s*0/s, 'the Leaflet stacking context must sit behind SVG markers');
  assert.match(communityMapCssSource, /\.community-map__overlay\s*\{[^}]*z-index:\s*[1-9]/s, 'the SVG markers must paint above Leaflet tiles');
  assert.match(communityMapCssSource, /\.community-card\s*\{[^}]*z-index:\s*[1-9]/s, 'the copy card must paint above Leaflet tiles');
});

test('the regional composition leaves the western school cluster visible', () => {
  assert.match(communityMapCssSource, /\.community-card\s*\{[^}]*right:\s*clamp\(20px,\s*5vw,\s*72px\)/s, 'the desktop copy veil belongs on the clear right side of the map');
  assert.match(communityMapSource, /r=\{isInnerCatchment \? 7\.5 : isOuterSydney \? 5\.25 : 6\.25\}/, 'school dots must have a legible regional hierarchy');
  assert.match(communityMapSource, /className="community-map__building-label"/, 'the local frame should identify the real DA buildings');
  assert.match(communityMapSource, /DA CANLEY HEIGHTS/, 'the paired building markers should resolve into one destination');
});

test('the Canley Heights hub remains legible without obscuring the surrounding map', () => {
  assert.match(communityMapSource, /<circle r="32" className="community-map__hub-density" \/>/, 'the catchment tint should stay compact');
  assert.match(communityMapSource, /<circle r="24" className="community-map__hub-glow" \/>/, 'the gold glow should not mask nearby map labels');
  assert.doesNotMatch(communityMapSource, /community-map__hub-pulse/, 'the hub should not add a distracting animated radar ring');
  assert.match(communityMapCssSource, /\.community-map__hub-density\s*\{[^}]*fill-opacity:\s*\.055/s, 'the catchment tint should remain transparent enough to read through');
});

test('the pull-back has enough physical scroll distance and a final community-network hold', () => {
  assert.match(wayfinderCssSource, /\.wayfinder-community\s*\{[^}]*min-height:\s*260svh/s, 'the longer sticky runway gives the completed map time to be read');
  assert.match(wayfinderPageSource, /useTransform\(communityProgress, \[0, 0\.82\], \[0, 1\], \{ clamp: true \}\)/, 'the map must finish before the section’s scroll runway ends');
  assert.match(communityMapSource, /requestAnimationFrame\(\(\) =>/, 'camera updates remain frame-throttled');
  assert.match(communityMapSource, /zoomSnap:\s*0/, 'camera interpolation remains fractional rather than stair-stepped');
});

test('the regional map keeps its visual texture honest and gently connected to DA', () => {
  assert.match(communityMapSource, /className="community-map__connection"/, 'school markers should have a dedicated connector layer');
  assert.match(communityMapSource, /const CONNECTION_SCHOOL_INDICES/, 'the map should use a curated set of network anchors rather than a full starburst');
  assert.match(communityMapSource, /connection\.style\.opacity = String\(t \* 0\.3\)/, 'connections should reveal progressively and remain quieter than dots');
  assert.match(communityMapCssSource, /\.community-map__connection\s*\{[^}]*stroke-dasharray:\s*1\.5 8/s, 'connections should retain their light map-notation rhythm');
  assert.match(communityMapSource, /INDICATIVE COMMUNITY MAP/, 'the regional card must label its placeholders honestly');
  assert.match(communityMapSource, /not verified school-origin data/, 'the regional card must not imply that placeholder dots are verified origins');
  assert.doesNotMatch(communityMapSource, /Students join DA from schools|SCHOOL COMMUNITIES|connected to DA through our students|Students travel to Canley Heights from right across the city/, 'Community copy must not turn placeholder dots into claims about students or schools');
});

test('reduced motion opens directly into one coherent regional map state', () => {
  assert.match(communityMapSource, /const showRegionalContext = Boolean\(reduceMotion\)/, 'reduced motion must select one explicit static presentation state');
  assert.match(communityMapSource, /if \(showRegionalContext\) \{\s*centre = sydneyCentre;\s*zoom = sydneyZoom;\s*buildingOpacity = 0;/s, 'the static state must use the regional camera rather than a local card over a regional map');
  assert.match(communityMapSource, /const localOpacity = showRegionalContext \? 0/, 'the local copy must be hidden in the static regional state');
  assert.match(communityMapSource, /const regionalOpacity = showRegionalContext \? 1/, 'the regional copy must be visible in the static regional state');
  assert.match(communityMapSource, /const t = showRegionalContext \? 1/, 'the regional markers must be visible with the regional copy');
});

test('ARRIVE uses AA-safe gold ink for its small route and detail labels', () => {
  assert.match(wayfinderCssSource, /\.wayfinder-route-node small\s*\{[^}]*color:\s*var\(--wayfinder-gold-ink\)/s);
  assert.match(wayfinderCssSource, /\.wayfinder-arrive__details dt\s*\{[^}]*color:\s*var\(--wayfinder-gold-ink\)/s);
});

test('the community map reclaims the header strip only while the desktop navigation is collapsed', () => {
  assert.match(navigationSource, /data-da-nav-state=\{navState\}/, 'the desktop navigation must expose its collapsed state to page-scoped layout');
  assert.match(wayfinderCssSource, /body:has\(\[data-da-nav-state='collapsed'\]\) \.wayfinder-community__sticky\s*\{[^}]*top:\s*0[^}]*height:\s*100svh/s, 'the collapsed navigation state should let the map fill the full viewport');
});

test('the mobile Community composition leaves enough room for the full regional explanation', () => {
  assert.match(communityMapCssSource, /@media \(max-width: 768px\)[\s\S]*?\.community-map__canvas, \.community-map__overlay\s*\{[^}]*height:\s*40svh/s, 'mobile map height must leave an editorial reading field below');
  assert.match(communityMapCssSource, /@media \(max-width: 768px\)[\s\S]*?\.community-card\s*\{[^}]*padding:\s*22px 28px 24px/s, 'mobile regional copy needs compact but comfortable in-frame spacing');
});

test('the camera scrub preserves the prior raster grid while the next tile level loads', () => {
  assert.match(communityMapSource, /scrubbedMap\._move\(centre, zoom, undefined, true\)/, 'scrubbing must avoid Leaflet setView viewprereset tile clearing');
  assert.match(communityMapSource, /_setView\(centre, zoom, true, false\)/, 'a native tile-level handoff must retain prior tiles until the new level is available');
  assert.match(communityMapSource, /keepBuffer: 6/, 'enough nearby tiles must survive a brisk scroll');
  assert.match(communityMapSource, /fadeAnimation: true/, 'tile-level swaps should crossfade instead of flashing the bare canvas');
  assert.match(communityMapCssSource, /\.community-map__canvas \.leaflet-tile\s*\{\s*opacity:\s*1 !important;/, 'loaded raster tiles must not sit transparent during Leaflet’s internal fade timer');
  assert.match(communityMapCssSource, /\.community-map__canvas\.leaflet-container\s*\{[^}]*background:\s*#f8f4ea/s, 'the map’s transient tile surface must stay warm rather than Leaflet grey');
});

test('rapid reverse scrolling settles the camera in bounded steps instead of scaling a stale tile grid', () => {
  assert.match(communityMapSource, /const MAX_CAMERA_ZOOM_STEP = 0\.14/, 'camera zoom changes must be capped per rendered frame');
  assert.match(communityMapSource, /Math\.min\(Math\.abs\(zoom - currentZoom\), MAX_CAMERA_ZOOM_STEP\)/, 'a scroll jump must only advance the camera by one bounded zoom step');
  assert.match(communityMapSource, /requestAnimationFrame\(\(\) => \{\s*rafRef\.current = null;\s*renderRef\.current\(latestProgressRef\.current\);\s*\}\)/s, 'the camera must continue settling after a large scroll jump');
});

test('a resized sticky viewport refreshes tile coverage and clips overlay markers to the map', () => {
  assert.match(communityMapSource, /map\.invalidateSize\(\{ animate: false, pan: false \}\)/, 'a meaningful map-size change must update Leaflet’s internal viewport');
  assert.match(communityMapSource, /scrubbedLayer\._setView\(centre, zoom, true, false\)/, 'every camera frame must refresh tile coverage, even when the native zoom is unchanged');
  assert.doesNotMatch(communityMapSource, /scrubbedLayer\._setZoomTransforms\(/, 'a transform-only frame leaves newly exposed map edges without tiles after a resize');
  assert.match(communityMapCssSource, /\.community-map__overlay\s*\{[^}]*overflow:\s*hidden/s, 'map overlays must not paint beyond the map viewport');
});

test('no hardcoded school count appears in the map or its data module', () => {
  assert.doesNotMatch(communityMapSource, /\b122\b/, 'the reference design\'s placeholder count must never be hardcoded');
  assert.match(communityMapSource, /verifiedCount/, 'the stat must be derived from verified rows, not a literal number');
  assert.match(communitySchemaSource, /verified: boolean/, 'each school row must carry an explicit verified flag');
});
