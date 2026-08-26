import test from 'node:test';
import assert from 'node:assert/strict';
import { SAFE_SECTORS } from './tutor-orbit-geometry.ts';
import {
  canBeginSelection,
  holdKeysAfterSelection,
  normalizeStagePointer,
  pruneTutorHoldKeys,
  tutorsForGeometryBand,
  transitionSelectionLock,
} from './tutor-orbit-stage-helpers.ts';

test('normalizes and clamps a stage pointer to the safe parallax range', () => {
  assert.equal(normalizeStagePointer(25, 0, 100), -0.5);
  assert.equal(normalizeStagePointer(-40, 0, 100), -1);
  assert.equal(normalizeStagePointer(200, 0, 100), 1);
  assert.equal(normalizeStagePointer(50, 0, 0), 0);
});

test('prunes both hover and focus holds for a promoted tutor only', () => {
  const holds = new Set(['hover:T001', 'focus:T001', 'hover:T002', 'keyboard:global']);
  assert.deepEqual(
    [...pruneTutorHoldKeys(holds, 'T001')],
    ['hover:T002', 'keyboard:global'],
  );
});

test('retains rejected selection holds and prunes accepted selection holds', () => {
  const holds = new Set(['hover:T001', 'focus:T001', 'hover:T002']);
  assert.deepEqual([...holdKeysAfterSelection(holds, 'T001', false)], [...holds]);
  assert.deepEqual([...holdKeysAfterSelection(holds, 'T001', true)], ['hover:T002']);
});

test('limits every band to its authored safe-sector count', () => {
  const tutors = Array.from({ length: 12 }, (_, index) => `T${index + 1}`);
  for (const band of ['wide', 'desktop', 'tablet', 'mobile'] as const) {
    for (const tier of ['inner', 'outer'] as const) {
      assert.deepEqual(
        tutorsForGeometryBand(tutors, band, tier),
        tutors.slice(0, SAFE_SECTORS[band][tier].length),
      );
    }
  }
});

test('locks a selection synchronously until idle or cleanup', () => {
  const locked = transitionSelectionLock({ locked: false }, 'select');
  assert.equal(canBeginSelection(locked), false);
  assert.deepEqual(transitionSelectionLock(locked, 'idle'), { locked: false });
  assert.deepEqual(transitionSelectionLock(locked, 'cleanup'), { locked: false });
});
