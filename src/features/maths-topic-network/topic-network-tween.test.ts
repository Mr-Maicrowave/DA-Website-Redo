import test from 'node:test';
import assert from 'node:assert/strict';
import { easeInOutCubic } from './topic-network-tween.ts';

test('easeInOutCubic starts at 0 and ends at 1', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
});

test('easeInOutCubic is symmetric around the midpoint', () => {
  assert.ok(Math.abs(easeInOutCubic(0.5) - 0.5) < 1e-9);
});

test('easeInOutCubic is monotonically increasing', () => {
  let previous = -1;
  for (let p = 0; p <= 1; p += 0.05) {
    const value = easeInOutCubic(p);
    assert.ok(value >= previous, `eased value decreased at p=${p}`);
    previous = value;
  }
});
