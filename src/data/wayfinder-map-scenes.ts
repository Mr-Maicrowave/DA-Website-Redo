import { PHYSICAL_CENTRES, type GeographicCoordinate } from './physical-centres.ts';

export type MapBounds = { north: number; south: number; east: number; west: number };
export type MapViewBox = { width: number; height: number };
export type ProjectedCoordinate = { x: number; y: number };
export type RoadSnap = { coordinate: GeographicCoordinate; segmentIndex: number; t: number };
export type GeographicRoad = { id: string; name: string; hierarchy: 'major' | 'secondary' | 'minor' | 'rail'; coordinates: readonly GeographicCoordinate[] };
export type ContextualPlace = { id: string; name: string; kind: 'station' | 'school'; coordinates: GeographicCoordinate; labelOffset?: ProjectedCoordinate };
export type WayfinderMapScene = { id: string; bounds: MapBounds; nearbyBounds: MapBounds; readyBounds: MapBounds; communityMetroBounds: MapBounds; communityBounds: MapBounds; viewBox: MapViewBox; roads: readonly GeographicRoad[]; places: readonly ContextualPlace[]; connection: readonly GeographicCoordinate[] };

const HERO_BOUNDS: MapBounds = { north: -33.880, south: -33.887, west: 150.917, east: 150.938 };
const NEARBY_BOUNDS: MapBounds = { north: -33.8700, south: -33.8900, west: 150.9205, east: 150.9535 };
const READY_BOUNDS: MapBounds = { north: -33.8795, south: -33.8885, west: 150.919, east: 150.945 };
const COMMUNITY_METRO_BOUNDS: MapBounds = { north: -33.73, south: -34.00, west: 150.72, east: 151.15 };
// This is intentionally a camera frame, not a claim about DA's service area or student-origin data.
const COMMUNITY_BOUNDS: MapBounds = { north: -33.64, south: -34.03, west: 150.60, east: 151.35 };
const CANLEY_HEIGHTS_VIEWBOX: MapViewBox = { width: 1200, height: 700 };

export const projectCoordinate = (
  coordinate: GeographicCoordinate,
  bounds: MapBounds,
  viewBox: MapViewBox,
): ProjectedCoordinate => ({
  x: ((coordinate.lng - bounds.west) / (bounds.east - bounds.west)) * viewBox.width,
  y: ((bounds.north - coordinate.lat) / (bounds.north - bounds.south)) * viewBox.height,
});

export const getSceneBounds = (scene: WayfinderMapScene, presentation: 'hero' | 'nearby' | 'ready'): MapBounds =>
  presentation === 'nearby' ? scene.nearbyBounds : presentation === 'ready' ? scene.readyBounds : scene.bounds;

export const interpolateBounds = (from: MapBounds, to: MapBounds, progress: number): MapBounds => {
  const clamped = Math.max(0, Math.min(1, progress));
  const interpolate = (start: number, end: number) => start + (end - start) * clamped;
  return {
    north: interpolate(from.north, to.north),
    south: interpolate(from.south, to.south),
    east: interpolate(from.east, to.east),
    west: interpolate(from.west, to.west),
  };
};

export const getCommunityCameraBounds = (scene: WayfinderMapScene, progress: number, finalBounds: MapBounds = scene.communityBounds): MapBounds => {
  const localBounds = getSceneBounds(scene, 'nearby');
  const clamped = Math.max(0, Math.min(1, progress));
  return clamped < .52
    ? interpolateBounds(localBounds, scene.communityMetroBounds, Math.pow(clamped / .52, 1.6))
    : interpolateBounds(scene.communityMetroBounds, finalBounds, (clamped - .52) / .48);
};

const sameCoordinate = (first: GeographicCoordinate, second: GeographicCoordinate) =>
  first.lat === second.lat && first.lng === second.lng;

const coordinateProgress = (snap: RoadSnap) => snap.segmentIndex + snap.t;

export const closestPointOnPolyline = (
  point: GeographicCoordinate,
  polyline: readonly GeographicCoordinate[],
): RoadSnap => {
  const longitudeScale = Math.cos(point.lat * Math.PI / 180);
  let nearest: RoadSnap | undefined;
  let shortestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < polyline.length - 1; index += 1) {
    const start = polyline[index];
    const end = polyline[index + 1];
    const segmentLng = (end.lng - start.lng) * longitudeScale;
    const segmentLat = end.lat - start.lat;
    const pointLng = (point.lng - start.lng) * longitudeScale;
    const pointLat = point.lat - start.lat;
    const segmentLengthSquared = segmentLng ** 2 + segmentLat ** 2;
    const t = Math.max(0, Math.min(1, (pointLng * segmentLng + pointLat * segmentLat) / segmentLengthSquared));
    const coordinate = {
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t,
    };
    const distanceSquared = ((coordinate.lng - point.lng) * longitudeScale) ** 2 + (coordinate.lat - point.lat) ** 2;
    if (distanceSquared < shortestDistance) {
      shortestDistance = distanceSquared;
      nearest = { coordinate, segmentIndex: index, t };
    }
  }

  if (!nearest) throw new Error('A road polyline requires at least two coordinates.');
  return nearest;
};

export const extractRoadSegment = (
  polyline: readonly GeographicCoordinate[],
  start: RoadSnap,
  end: RoadSnap,
): GeographicCoordinate[] => {
  const forwards = coordinateProgress(start) <= coordinateProgress(end);
  const first = forwards ? start : end;
  const last = forwards ? end : start;
  const segment = [first.coordinate, ...polyline.slice(first.segmentIndex + 1, last.segmentIndex + 1), last.coordinate]
    .filter((coordinate, index, coordinates) => index === 0 || !sameCoordinate(coordinate, coordinates[index - 1]));
  return forwards ? segment : segment.reverse();
};

const [BUILDING_1, BUILDING_2] = PHYSICAL_CENTRES;

// Simplified from OpenStreetMap way 8028046. Property markers remain separate geographic points.
const CANLEY_VALE_ROAD: GeographicRoad = {
  id: 'canley-vale-road',
  name: 'Canley Vale Road',
  hierarchy: 'major',
  coordinates: [
    { lat: -33.8837682, lng: 150.9248198 }, { lat: -33.8838029, lng: 150.925162 },
    { lat: -33.8838229, lng: 150.9253003 }, { lat: -33.8839578, lng: 150.9262585 },
    { lat: -33.883978, lng: 150.9264099 }, { lat: -33.8841386, lng: 150.9275202 },
    { lat: -33.8841596, lng: 150.9276755 }, { lat: -33.884286, lng: 150.9285762 },
    { lat: -33.8843271, lng: 150.9288687 }, { lat: -33.8844942, lng: 150.9301066 },
    { lat: -33.8846663, lng: 150.9313351 }, { lat: -33.8848336, lng: 150.9325455 },
    { lat: -33.8848385, lng: 150.9325818 }, { lat: -33.8850109, lng: 150.9338211 },
    { lat: -33.8851454, lng: 150.9347667 }, { lat: -33.8851814, lng: 150.935039 },
  ],
};

const INTER_CENTRE_CONNECTION = extractRoadSegment(
  CANLEY_VALE_ROAD.coordinates,
  closestPointOnPolyline(BUILDING_1.coordinates, CANLEY_VALE_ROAD.coordinates),
  closestPointOnPolyline(BUILDING_2.coordinates, CANLEY_VALE_ROAD.coordinates),
);

// Simplified from local OpenStreetMap geometry during development and baked in for a lightweight SVG.
const LOCAL_STREETS: readonly GeographicRoad[] = [
  { id: 'ascot-street', name: 'Ascot Street', hierarchy: 'minor', coordinates: [{ lat: -33.8841596, lng: 150.9276755 }, { lat: -33.8840689, lng: 150.9276935 }, { lat: -33.8837534, lng: 150.927756 }, { lat: -33.8804019, lng: 150.9284247 }] },
  { id: 'adolphus-street', name: 'Adolphus Street', hierarchy: 'secondary', coordinates: [{ lat: -33.8804424, lng: 150.9334425 }, { lat: -33.8818969, lng: 150.933166 }, { lat: -33.8833546, lng: 150.9328687 }, { lat: -33.8848385, lng: 150.9325818 }] },
  { id: 'peel-street', name: 'Peel Street', hierarchy: 'secondary', coordinates: [{ lat: -33.8802306, lng: 150.9271675 }, { lat: -33.8805571, lng: 150.9271021 }, { lat: -33.8832327, lng: 150.9265658 }, { lat: -33.883978, lng: 150.9264099 }] },
  { id: 'ferngrove-road', name: 'Ferngrove Road', hierarchy: 'minor', coordinates: [{ lat: -33.8798854, lng: 150.9246858 }, { lat: -33.8800547, lng: 150.9259016 }, { lat: -33.8802306, lng: 150.9271675 }, { lat: -33.8804019, lng: 150.9284247 }, { lat: -33.8805716, lng: 150.9296232 }] },
  { id: 'queen-street', name: 'Queen Street', hierarchy: 'minor', coordinates: [{ lat: -33.8821107, lng: 150.929307 }, { lat: -33.882279, lng: 150.9305388 }, { lat: -33.8824601, lng: 150.9318194 }, { lat: -33.8826255, lng: 150.9330261 }, { lat: -33.8829663, lng: 150.9354676 }] },
  { id: 'prince-street', name: 'Prince Street', hierarchy: 'minor', coordinates: [{ lat: -33.8813768, lng: 150.929456 }, { lat: -33.881542, lng: 150.9306951 }, { lat: -33.8817259, lng: 150.9319524 }, { lat: -33.8818969, lng: 150.933166 }, { lat: -33.8820726, lng: 150.9343943 }, { lat: -33.8824365, lng: 150.936849 }] },
  { id: 'buckingham-street', name: 'Buckingham Street', hierarchy: 'minor', coordinates: [{ lat: -33.8835753, lng: 150.9290159 }, { lat: -33.8837593, lng: 150.9302257 }, { lat: -33.8840941, lng: 150.9326828 }, { lat: -33.8842649, lng: 150.933996 }, { lat: -33.8844336, lng: 150.935174 }] },
  { id: 'earl-street', name: 'Earl Street', hierarchy: 'minor', coordinates: [{ lat: -33.882841, lng: 150.9291652 }, { lat: -33.8831909, lng: 150.9316697 }, { lat: -33.8833546, lng: 150.9328687 }, { lat: -33.8835423, lng: 150.9341432 }, { lat: -33.8836972, lng: 150.9353212 }] },
  { id: 'torrens-street', name: 'Torrens Street', hierarchy: 'minor', coordinates: [{ lat: -33.8847309, lng: 150.9262276 }, { lat: -33.8849046, lng: 150.927488 }, { lat: -33.8850728, lng: 150.9287173 }, { lat: -33.8852424, lng: 150.9299022 }] },
  { id: 'kiora-street', name: 'Kiora Street', hierarchy: 'minor', coordinates: [{ lat: -33.8854647, lng: 150.9260912 }, { lat: -33.8856334, lng: 150.9272989 }, { lat: -33.8858079, lng: 150.9285485 }, { lat: -33.8859737, lng: 150.9297454 }] },
  { id: 'salisbury-street', name: 'Salisbury Street', hierarchy: 'minor', coordinates: [{ lat: -33.8789088, lng: 150.9299455 }, { lat: -33.8799159, lng: 150.9297468 }, { lat: -33.8805716, lng: 150.9296232 }, { lat: -33.8813768, lng: 150.929456 }, { lat: -33.8821107, lng: 150.929307 }, { lat: -33.882841, lng: 150.9291652 }, { lat: -33.8835753, lng: 150.9290159 }, { lat: -33.8843271, lng: 150.9288687 }] },
  { id: 'duke-street', name: 'Duke Street', hierarchy: 'minor', coordinates: [{ lat: -33.8799159, lng: 150.9297468 }, { lat: -33.8800776, lng: 150.9309837 }, { lat: -33.8802542, lng: 150.9321986 }, { lat: -33.8804424, lng: 150.9334425 }] },
  { id: 'george-street', name: 'George Street', hierarchy: 'minor', coordinates: [{ lat: -33.880638, lng: 150.9296118 }, { lat: -33.8808129, lng: 150.9308391 }, { lat: -33.8809938, lng: 150.9321033 }, { lat: -33.8811671, lng: 150.9333141 }, { lat: -33.8813481, lng: 150.93453 }] },
  { id: 'gladstone-street', name: 'Gladstone Street', hierarchy: 'minor', coordinates: [{ lat: -33.8786584, lng: 150.9312611 }, { lat: -33.8793481, lng: 150.9311242 }, { lat: -33.8800776, lng: 150.9309837 }, { lat: -33.8808129, lng: 150.9308391 }, { lat: -33.8811586, lng: 150.9307708 }] },
  // Additional surrounding streets, simplified from the same OSM extract as the primary road.
  { id: 'derby-street', name: 'Derby Street', hierarchy: 'minor', coordinates: [{ lat: -33.8800547, lng: 150.9259016 }, { lat: -33.882627, lng: 150.9253865 }, { lat: -33.8834172, lng: 150.9252283 }, { lat: -33.8845062, lng: 150.9250284 }] },
  { id: 'allenby-street', name: 'Allenby Street', hierarchy: 'minor', coordinates: [{ lat: -33.8802943, lng: 150.9218343 }, { lat: -33.8805948, lng: 150.9227655 }, { lat: -33.8818268, lng: 150.9226277 }, { lat: -33.8834100, lng: 150.9223180 }] },
  { id: 'andrew-avenue', name: 'Andrew Avenue', hierarchy: 'minor', coordinates: [{ lat: -33.8832572, lng: 150.9212359 }, { lat: -33.8817854, lng: 150.9215327 }, { lat: -33.8802943, lng: 150.9218343 }, { lat: -33.8795036, lng: 150.9219938 }] },
  { id: 'beelar-street', name: 'Beelar Street', hierarchy: 'minor', coordinates: [{ lat: -33.8830119, lng: 150.9194496 }, { lat: -33.8814599, lng: 150.9197837 }, { lat: -33.8798211, lng: 150.9201146 }, { lat: -33.8793235, lng: 150.9203802 }] },
  { id: 'malouf-street', name: 'Malouf Street', hierarchy: 'minor', coordinates: [{ lat: -33.8830909, lng: 150.9200136 }, { lat: -33.8836427, lng: 150.9198810 }, { lat: -33.8861837, lng: 150.9193089 }] },
  { id: 'mcilvenie-street', name: 'McIlvenie Street', hierarchy: 'minor', coordinates: [{ lat: -33.8831927, lng: 150.9207689 }, { lat: -33.8832767, lng: 150.9207527 }, { lat: -33.8863073, lng: 150.9201688 }] },
  { id: 'arbutus-street', name: 'Arbutus Street', hierarchy: 'minor', coordinates: [{ lat: -33.8858552, lng: 150.9234811 }, { lat: -33.8862087, lng: 150.9259871 }, { lat: -33.8865506, lng: 150.9284530 }, { lat: -33.8867271, lng: 150.9297087 }, { lat: -33.8869018, lng: 150.9308694 }, { lat: -33.8873962, lng: 150.9345736 }] },
  { id: 'chatham-street', name: 'Chatham Street', hierarchy: 'minor', coordinates: [{ lat: -33.8854207, lng: 150.9311916 }, { lat: -33.8847425, lng: 150.9313214 }, { lat: -33.8839249, lng: 150.9315012 }] },
  { id: 'palmerston-street', name: 'Palmerston Street', hierarchy: 'minor', coordinates: [{ lat: -33.8851814, lng: 150.9350390 }, { lat: -33.8859363, lng: 150.9348964 }, { lat: -33.8866707, lng: 150.9347459 }, { lat: -33.8874007, lng: 150.9346048 }] },
  { id: 'avenel-street', name: 'Avenel Street', hierarchy: 'secondary', coordinates: [{ lat: -33.8795878, lng: 150.9356584 }, { lat: -33.8802785, lng: 150.9367708 }, { lat: -33.8820047, lng: 150.9396269 }] },
  { id: 'sackville-street', name: 'Sackville Street', hierarchy: 'secondary', coordinates: [{ lat: -33.8829706, lng: 150.9390726 }, { lat: -33.8839751, lng: 150.9382931 }, { lat: -33.8847976, lng: 150.9376083 }, { lat: -33.8854877, lng: 150.9370320 }, { lat: -33.8861530, lng: 150.9364810 }, { lat: -33.8882150, lng: 150.9348086 }] },
  { id: 'canley-vale-road-east', name: 'Canley Vale Road', hierarchy: 'major', coordinates: [{ lat: -33.8851814, lng: 150.9350390 }, { lat: -33.8854877, lng: 150.9370320 }, { lat: -33.8860279, lng: 150.9385102 }, { lat: -33.8867099, lng: 150.9412052 }, { lat: -33.8872941, lng: 150.9433174 }] },
  { id: 'canley-vale-rail', name: 'Rail corridor', hierarchy: 'rail', coordinates: [{ lat: -33.8897853, lng: 150.9413941 }, { lat: -33.8875182, lng: 150.9433603 }, { lat: -33.8868613, lng: 150.9439325 }, { lat: -33.8862098, lng: 150.944495 }] },
];

export const WAYFINDER_MAP_SCENES: readonly WayfinderMapScene[] = [{
  id: 'canley-heights',
  bounds: HERO_BOUNDS,
  nearbyBounds: NEARBY_BOUNDS,
  readyBounds: READY_BOUNDS,
  communityMetroBounds: COMMUNITY_METRO_BOUNDS,
  communityBounds: COMMUNITY_BOUNDS,
  viewBox: CANLEY_HEIGHTS_VIEWBOX,
  roads: [CANLEY_VALE_ROAD, ...LOCAL_STREETS],
  places: [
    { id: 'canley-vale-station', name: 'Canley Vale Station', kind: 'station', coordinates: { lat: -33.886889, lng: 150.943652 }, labelOffset: { x: -158, y: 28 } },
    { id: 'canley-heights-public-school', name: 'Canley Heights Public School', kind: 'school', coordinates: { lat: -33.884812, lng: 150.922611 }, labelOffset: { x: 18, y: 28 } },
    { id: 'canley-vale-high-school', name: 'Canley Vale High School', kind: 'school', coordinates: { lat: -33.88467, lng: 150.95166 }, labelOffset: { x: -168, y: -14 } },
    { id: 'fairvale-high-school', name: 'Fairvale High School', kind: 'school', coordinates: { lat: -33.87362, lng: 150.92945 }, labelOffset: { x: 16, y: 24 } },
  ],
  connection: INTER_CENTRE_CONNECTION,
}];

export const getMapScene = (id: string): WayfinderMapScene =>
  WAYFINDER_MAP_SCENES.find((scene) => scene.id === id) ?? WAYFINDER_MAP_SCENES[0];
