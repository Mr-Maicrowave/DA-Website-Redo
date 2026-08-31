import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./MathsTeachingProof.tsx', import.meta.url), 'utf8');

test('starts the teaching proof near the top of a desktop viewport', () => {
  assert.match(source, /py-20[^"\n]*lg:pb-24 lg:pt-8/);
  assert.doesNotMatch(source, /lg:py-24/);
});
