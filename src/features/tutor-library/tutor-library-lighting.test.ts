import assert from 'node:assert/strict';
import test from 'node:test';
import { createCabinetBlueprint } from './room-architecture.ts';
import { CASE_STRIP_TILT_X, createCaseLightPlan, getIlluminationAngle } from './tutor-library-lighting.ts';

const WIDTH = 16.45;
const HEIGHT = 5.8;

test('places one lighting strip under every shelf board that has books standing beneath it', () => {
  const cabinet = createCabinetBlueprint(WIDTH, HEIGHT);
  const plan = createCaseLightPlan(WIDTH, HEIGHT);

  assert.equal(plan.length, cabinet.shelfLevels.length - 1, 'the lowest board carries books, it never lights them');
  plan.forEach((strip, index) => {
    const board = cabinet.shelfLevels[index + 1];
    assert.ok(strip.y < board, 'the strip must be tucked under its board, not buried in it');
    assert.ok(board - strip.y < .2, 'the strip must hug the board rather than float mid-bay');
    assert.ok(strip.y > cabinet.shelfLevels[index], 'the strip must sit above the board the books stand on');
  });
});

test('keeps strips inside the case and in front of the books they graze', () => {
  const cabinet = createCabinetBlueprint(WIDTH, HEIGHT);
  const plan = createCaseLightPlan(WIDTH, HEIGHT);

  plan.forEach(strip => {
    assert.ok(strip.width < WIDTH - cabinet.frameThickness * 2, 'strips must not overhang the face frame');
    assert.ok(strip.z > cabinet.bays[0].bookBackZ, 'strips sit forward of the back panel');
    assert.ok(strip.z < cabinet.frameDepth, 'strips stay behind the face frame so the source is never seen');
    assert.ok(strip.intensity > 0);
  });
});

test('aims the strips down and back into the case rather than straight out at the viewer', () => {
  assert.ok(CASE_STRIP_TILT_X < -Math.PI / 4, 'the strip is predominantly downward facing');
  assert.ok(CASE_STRIP_TILT_X > -Math.PI / 2, 'the strip is tilted back toward the shelf, not plumb down');
});

test('travels the illumination the short way around the rotunda', () => {
  assert.equal(getIlluminationAngle(0, 0, 1, 4), 0);
  assert.equal(getIlluminationAngle(0, 3, 1, 4).toFixed(4), (-Math.PI / 2).toFixed(4));
  assert.equal(getIlluminationAngle(0, 1, .5, 4).toFixed(4), (Math.PI / 4).toFixed(4));
  assert.throws(() => getIlluminationAngle(0, 1, 0, 2));
});
