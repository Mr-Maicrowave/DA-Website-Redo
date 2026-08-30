import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:8080';
const routeBase = `${baseUrl.replace(/\/$/, '')}/dev/complete-shelf-rig`;
const expectedReferenceHash = '163b4a99d34e24ce8ab205f28f1d3f1f33da216285be2c5db31422f13090b026';
const referencePath = new URL('../public/dev/complete-shelf-reference/index.html', import.meta.url);

const reference = await readFile(referencePath);
const referenceHash = createHash('sha256').update(reference).digest('hex');
assert.equal(
  referenceHash,
  expectedReferenceHash,
  'The approved Complete Shelf reference must remain byte-identical to its pinned source',
);

for (const route of [routeBase, `${routeBase}/`]) {
  const response = await fetch(route);
  assert.equal(response.status, 200, `Expected ${route} to resolve`);
  assert.match(response.headers.get('content-type') ?? '', /^text\/html/);

  const html = await response.text();
  assert.match(html, /Complete Shelf Codex book rig/);
  assert.match(html, /complete-shelf-book-rig\.js/);
  assert.match(html, /data-artwork-status="pending"/);
  assert.match(html, /data-artwork-source="immutable-reference"/);
  assert.match(html, /setArtworkStatus\('failed'/);
  assert.match(html, /Atlas failure forced for verification/);
  assert.match(html, /data-framing/);
  assert.match(html, /narrow-390-safe/);
  assert.match(html, /data-action-state/);
  assert.match(html, /setActiveState/);
  assert.match(html, /runStateContract/);
  assert.match(html, /rig\.controller\.open\(\); settle\(\);/);
  assert.match(html, /rig\.controller\.close\(\); settle\(\);/);
  assert.match(html, /applied = rig\.controller\.settlePage\(\)/);
}

const runtimeResponse = await fetch(`${routeBase}/vendor/three.module.js`);
assert.equal(runtimeResponse.status, 200, 'The isolated host must serve its local Three.js runtime');
const runtimeSource = await runtimeResponse.text();
assert.match(
  runtimeSource,
  /const REVISION = '165'/,
  'The isolated host must use the source-compatible Three.js r165 runtime',
);

const moduleResponse = await fetch(`${routeBase}/complete-shelf-book-rig.js`);
assert.equal(moduleResponse.status, 200, 'The isolated host must serve its dedicated rig module');
assert.match(moduleResponse.headers.get('content-type') ?? '', /javascript/);
const moduleSource = await moduleResponse.text();
assert.match(moduleSource, /export function createCompleteShelfBookRig/);
assert.match(moduleSource, /smoothstep/);
assert.match(moduleSource, /dragCurveBoost/);
assert.match(moduleSource, /flexTwistTarget/);
assert.match(moduleSource, /0\.032/);
assert.match(moduleSource, /pageDrag\.progressVelocity/);
assert.match(moduleSource, /Math\.abs\(targetCurve - nextCurve\) < 0\.00002/);
assert.doesNotMatch(moduleSource, /config\.book/);

for (const [file, exportName] of [['vendor/RoundedBoxGeometry.js', 'RoundedBoxGeometry'], ['vendor/RoomEnvironment.js', 'RoomEnvironment']]) {
  const response = await fetch(`${routeBase}/${file}`);
  assert.equal(response.status, 200, `The isolated host must serve ${file}`);
  assert.match(response.headers.get('content-type') ?? '', /javascript/);
  assert.match(await response.text(), new RegExp(exportName));
}

const hostResponse = await fetch(`${routeBase}/`);
const hostSource = await hostResponse.text();
assert.match(hostSource, /__completeShelfRigProbe/);
assert.match(hostSource, /closed-again/);
assert.match(hostSource, /rig\.controller\.close\(\); settle\(\);/);
assert.match(hostSource, /environmentTarget\.dispose\(\)/);

console.log(`Complete Shelf Codex rig route passed: ${routeBase}`);
