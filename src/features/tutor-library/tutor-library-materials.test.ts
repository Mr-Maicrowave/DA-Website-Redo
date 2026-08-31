import assert from 'node:assert/strict';
import test from 'node:test';
import { createWalnutGrainPixels } from './tutor-library-materials.ts';

test('creates a detailed shared walnut texture without a large image dependency', () => {
  const pixels = createWalnutGrainPixels(128);
  const luminance = new Set<number>();
  for (let index = 0; index < pixels.length; index += 4) luminance.add(pixels[index]);

  assert.equal(pixels.length, 128 * 128 * 4);
  assert.ok(luminance.size >= 48, 'multi-scale grain avoids the visibly repeated low-detail stripe pattern');
  assert.ok(pixels.every((value, index) => index % 4 !== 3 || value === 255));
});
