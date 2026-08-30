import assert from 'node:assert/strict';
import test from 'node:test';
import { closestPointOnPolyline, extractRoadSegment, getMapScene, getSceneBounds, projectCoordinate } from './wayfinder-map-scenes.ts';
import { PHYSICAL_CENTRES } from './physical-centres.ts';

test('projects the confirmed physical centres into one shared Canley Heights SVG scene', () => {
  const scene = getMapScene('canley-heights');
  const building1 = projectCoordinate(PHYSICAL_CENTRES[0].coordinates, scene.bounds, scene.viewBox);
  const building2 = projectCoordinate(PHYSICAL_CENTRES[1].coordinates, scene.bounds, scene.viewBox);

  assert.ok(building1.x >= 0 && building1.x <= scene.viewBox.width);
  assert.ok(building1.y >= 0 && building1.y <= scene.viewBox.height);
  assert.ok(building2.x >= 0 && building2.x <= scene.viewBox.width);
  assert.ok(building2.y >= 0 && building2.y <= scene.viewBox.height);
  assert.ok(building2.x < building1.x, 'Building 2 is west of Building 1');
  assert.ok(building2.y < building1.y, 'Building 2 is north of Building 1');
});

test('keeps confirmed contextual points within the local scene bounds', () => {
  const scene = getMapScene('canley-heights');
  const nearbyBounds = getSceneBounds(scene, 'nearby');
  for (const place of scene.places) {
    const point = projectCoordinate(place.coordinates, nearbyBounds, scene.viewBox);
    assert.ok(point.x >= 0 && point.x <= scene.viewBox.width, `${place.name} is horizontally in bounds`);
    assert.ok(point.y >= 0 && point.y <= scene.viewBox.height, `${place.name} is vertically in bounds`);
  }
});

test('frames the Nearby scene around the DA cluster while retaining Fairvale as distant context', () => {
  const scene = getMapScene('canley-heights');
  const nearbyBounds = getSceneBounds(scene, 'nearby');
  const building1 = projectCoordinate(PHYSICAL_CENTRES[0].coordinates, nearbyBounds, scene.viewBox);
  const fairvale = projectCoordinate(scene.places.find((place) => place.id === 'fairvale-high-school')!.coordinates, nearbyBounds, scene.viewBox);

  assert.ok(building1.y < scene.viewBox.height * .75, 'the DA cluster does not sit in the lower quarter');
  assert.ok(fairvale.y < building1.y, 'Fairvale remains geographically north of the DA cluster');
});

test('uses a dedicated ready composition without duplicating the geographic scene', () => {
  const scene = getMapScene('canley-heights');
  assert.notDeepEqual(getSceneBounds(scene, 'ready'), getSceneBounds(scene, 'hero'));
  assert.equal(getMapScene('canley-heights'), scene);
});

test('uses the corrected Building 2 property coordinate', () => {
  assert.deepEqual(PHYSICAL_CENTRES[1].coordinates, { lat: -33.8833325, lng: 150.92563243 });
});

test('derives the gold connection from the real Canley Vale Road centreline', () => {
  const scene = getMapScene('canley-heights');
  const building1 = PHYSICAL_CENTRES[0].coordinates;
  const building2 = PHYSICAL_CENTRES[1].coordinates;
  const road = scene.roads.find((item) => item.id === 'canley-vale-road');

  assert.ok(road && road.coordinates.length > 3, 'road is an independently sourced centreline polyline');
  assert.notDeepEqual(road?.coordinates[0], building1);
  assert.notDeepEqual(road?.coordinates.at(-1), building2);

  const building1RoadPoint = closestPointOnPolyline(building1, road!.coordinates);
  const building2RoadPoint = closestPointOnPolyline(building2, road!.coordinates);
  const expectedConnection = extractRoadSegment(road!.coordinates, building1RoadPoint, building2RoadPoint);

  assert.deepEqual(scene.connection, expectedConnection);
  assert.notDeepEqual(scene.connection[0], building1, 'route begins at the road, not the property marker');
  assert.notDeepEqual(scene.connection.at(-1), building2, 'route ends at the road, not the property marker');
});
