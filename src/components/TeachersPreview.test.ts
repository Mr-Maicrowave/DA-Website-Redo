import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const componentUrl = new URL('./TeachersPreview.tsx', import.meta.url);

test('keeps the selected tutor thumbnail clear of the portrait arch', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /\.faculty-selector\{[\s\S]*?margin:38px auto 0;[\s\S]*?position:relative;[\s\S]*?z-index:5/);
});

test('keeps carousel rotation inside the tutor rail', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.doesNotMatch(source, /selectorRef\.current\?\.querySelector\('[^']+'\)\?\.scrollIntoView/);
  assert.match(source, /selector\.scrollTo\(\{\s*left: targetLeft,/);
});

test('preserves spaces when the tutor heading becomes one line', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /The People\{' '\}<br \/>Behind the/);
  assert.match(source, /\.faculty-title\{font-size:clamp\(3\.2rem,7vw,5rem\);line-height:\.96;letter-spacing:-\.015em\}/);
});
