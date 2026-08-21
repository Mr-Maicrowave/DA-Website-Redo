import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const sceneUrl = new URL('./MathsTowerScene.tsx', import.meta.url);
const source = existsSync(sceneUrl) ? readFileSync(sceneUrl, 'utf8') : '';

test('one Catmull-Rom curve drives the visible rail and ball', () => {
  assert.match(source, /new CatmullRomCurve3/);
  assert.match(source, /TubeGeometry\(curve/);
  assert.match(source, /curve\.getPointAt\(progress\)/);
  assert.equal((source.match(/maths-tower-ball/g) ?? []).length, 1);
});

test('renders one substantial metallic gold ball', () => {
  assert.match(source, /sphereGeometry args=\{\[0\.3[0-9], 40, 40\]\}/);
  assert.match(source, /metalness=\{0\.9[0-9]\}/);
  assert.match(source, /roughness=\{0\.1[0-9]\}/);
});

test('caps canvas density and reports WebGL context loss', () => {
  assert.match(source, /dpr=\{\[1, 1\.5\]\}/);
  assert.match(source, /webglcontextlost/);
  assert.match(source, /onContextFailure\(\)/);
});
