import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Science.tsx', import.meta.url);

test('uses a unique label key when two science navigation links share a destination', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /\['HSC focus areas',\s*'#hsc-sciences'\]/);
  assert.match(source, /\['How we teach',\s*'#hsc-sciences'\]/);
  assert.match(source, /<a key=\{label\} href=\{href\}/);
});
