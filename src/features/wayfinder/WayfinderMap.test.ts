import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./WayfinderMap.tsx', import.meta.url), 'utf8');

test('uses regional corridors as independent geographic axes rather than a hub-and-spoke network', () => {
  const corridorSource = source.slice(source.indexOf('const COMMUNITY_CORRIDORS'), source.indexOf('const COMMUNITY_WATERWAY'));
  const formerSharedJunctions = corridorSource.match(/lat: -33\.89, lng: 150\.93/g) ?? [];

  assert.ok(formerSharedJunctions.length < 2, 'regional corridors should not converge on an invented DA junction');
  assert.doesNotMatch(source, /const COMMUNITY_CORRIDORS/, 'legacy inline corridors should be replaced by the editable basemap layer');
});

test('keeps the community hub to a halo and two purposeful marker rings', () => {
  assert.doesNotMatch(source, /community-map__hub-influence/, 'the redundant radar ring should not return');
  assert.match(source, /community-map__hub-glow/, 'the restrained warm halo remains');
  assert.match(source, /community-map__hub-pulse/, 'the single strong ring remains');
});

test('fades local labels before the camera reaches the crowded mid-state', () => {
  assert.match(source, /progress - \.08\) \/ \.12/, 'local labels should finish fading by 20% progress');
  assert.match(source, /x=\{selected \? 28 : -12\} y=\{selected \? 30 : -14\} textAnchor=/, 'the centre labels should clear both each other and Canley Vale Road');
});

test('renders a separately defined wide basemap rather than only regional school dots', () => {
  assert.match(source, /community-basemap/, 'wide geography should be sourced from an editable data module');
  assert.match(source, /COMMUNITY_WIDE_BASEMAP/, 'the wide map should render explicit basemap layers');
});
