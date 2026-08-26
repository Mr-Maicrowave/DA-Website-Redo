import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const componentUrl = new URL('./TeachersPreview.tsx', import.meta.url);

test('shows six complete, readable tutor selectors beneath a wider desktop portrait', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /width:min\(100%,600px\)/);
  assert.match(source, /grid-auto-columns:calc\(\(100% - 60px\)\/6\)/);
  assert.match(source, /font:500 clamp\(\.84rem,.9vw,.94rem\)\/1.2/);
  assert.match(source, /inline: 'nearest'/);
});
