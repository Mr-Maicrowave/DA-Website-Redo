import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const componentUrl = new URL('./HSCFutureStory.tsx', import.meta.url);
const cssUrl = new URL('./hsc-future-story.css', import.meta.url);

test('uses one persistent stage and one master timeline for the complete story', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /className="hfs-stage"/);
  assert.equal((source.match(/gsap\.timeline\(/g) ?? []).length, 1);
  for (const label of ['handover', 'student', 'possibilities', 'parent', 'wipe', 'horizon', 'opportunities', 'doorZoom', 'clearPlan', 'support', 'roadmap']) {
    assert.match(source, new RegExp(`addLabel\\('${label}'`));
  }
  assert.doesNotMatch(source, /hfs-scene|slide/i);
});

test('keeps continuity layers mounted and uses the generated asset set', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /MotionPathPlugin/);
  assert.match(source, /hfs-journey-network/);
  assert.match(source, /ben-front\.png/);
  assert.match(source, /ben-rear\.png/);
  assert.match(source, /watercolor-bloom\.png/);
  assert.match(source, /future-horizon\.png/);
  assert.match(source, /hsc-roadmap-horizon\.png/);
  assert.match(source, /opportunity-portals\.png/);
});

test('provides mobile and reduced-motion fallbacks', () => {
  const css = readFileSync(cssUrl, 'utf8');
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /overflow-x:\s*clip/);
});

test('removes every decorative yellow connector line', () => {
  const css = readFileSync(cssUrl, 'utf8');
  assert.match(css, /\.hfs-journey-network,.hfs-gold-line,.hfs-support-line,.hfs-roadmap-line\{display:none!important\}/);
});

test('uses the v3 storyboard assets and includes wipe and door-camera phases', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /hsc-storyboard-v3/);
  assert.match(source, /gold-journey-line\.png/);
  assert.match(source, /opportunity-portals\.png/);
  assert.match(source, /addLabel\('wipe'/);
  assert.match(source, /addLabel\('doorZoom'/);
  assert.match(source, /addLabel\('clearPlan'/);
  assert.match(source, /hfs-wipe/);
  assert.match(source, /hfs-door-camera/);
});
