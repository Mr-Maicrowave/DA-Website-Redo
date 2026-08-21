import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const sceneUrl = new URL('./MathsTowerScene.tsx', import.meta.url);
const source = existsSync(sceneUrl) ? readFileSync(sceneUrl, 'utf8') : '';

function getBallSource(): string {
  const match = source.match(/<mesh[^>]*name="maths-tower-ball"[\s\S]*?<\/mesh>/);
  assert.ok(match, 'expected the named maths tower ball mesh');
  return match[0];
}

test('passes one shared Catmull-Rom curve to the visible tube and ball position', () => {
  assert.match(
    source,
    /const curve = useMemo\(\s*\(\) => new CatmullRomCurve3\(TOWER_RAIL_POINTS\.map/,
  );
  assert.match(source, /function TowerRail\(\{ curve \}[\s\S]*?new TubeGeometry\(curve,/);
  assert.match(source, /<TowerRail curve=\{curve\} \/>/);
  assert.match(source, /const point = curve\.getPointAt\(progress\);/);
  assert.match(getBallSource(), /position=\{point\}/);
  assert.equal((source.match(/name="maths-tower-ball"/g) ?? []).length, 1);
});

test('renders one substantial metallic gold ball', () => {
  const ballSource = getBallSource();
  const geometry = ballSource.match(/sphereGeometry args=\{\[([0-9]*\.?[0-9]+), 40, 40\]\}/);
  const metalness = ballSource.match(/metalness=\{([0-9]*\.?[0-9]+)\}/);
  const roughness = ballSource.match(/roughness=\{([0-9]*\.?[0-9]+)\}/);

  assert.ok(geometry, 'expected 40 x 40 sphere geometry on the named ball');
  assert.ok(Number(geometry[1]) >= 0.28, 'ball radius must be at least 0.28');
  assert.ok(metalness && Number(metalness[1]) >= 0.85, 'ball must have high metalness');
  assert.ok(roughness && Number(roughness[1]) <= 0.25, 'ball must have low roughness');
});

test('caps canvas density and reports WebGL context loss', () => {
  assert.match(source, /dpr=\{\[1, 1\.5\]\}/);
  assert.match(source, /addEventListener\('webglcontextlost', handleContextLost/);
  assert.match(source, /handleContextLost[\s\S]*?onContextFailure\(\)/);
});

test('initializes area-light textures and bounds contact-shadow work', () => {
  assert.match(source, /RectAreaLightUniformsLib\.init\(\);/);

  const contactShadows = source.match(/<ContactShadows[\s\S]*?\/>/);
  assert.ok(contactShadows, 'expected a ContactShadows element');
  const frames = contactShadows[0].match(/frames=\{([0-9]+)\}/);
  assert.ok(frames && Number(frames[1]) > 0, 'contact shadows must use a finite positive frame budget');
});
