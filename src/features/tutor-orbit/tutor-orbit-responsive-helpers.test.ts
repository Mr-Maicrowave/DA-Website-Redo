import test from 'node:test';
import assert from 'node:assert/strict';
import {
  beginNavigatorSwipe,
  cancelNavigatorSwipe,
  consumeNavigatorClickSuppression,
  finishNavigatorSwipe,
  navigatorRosterStatus,
  trackNavigatorSwipe,
  supportingTutorIds,
  parallaxLimitsForBand,
} from './tutor-orbit-responsive-helpers.ts';
import { swapFacultyTutor } from './tutor-orbit-config.ts';

test('keeps the active centre tutor out of the supporting roster in deterministic tier order', () => {
  assert.deepEqual(
    supportingTutorIds('T3', ['T1', 'T2'], ['T4', 'T5']),
    ['T1', 'T2', 'T4', 'T5'],
  );
});

test('puts the previous centre tutor back into the supporting roster after an exact-slot swap', () => {
  const result = swapFacultyTutor('T3', ['T1', 'T2'], ['T4', 'T5'], 'T2');

  assert.deepEqual(
    supportingTutorIds(result.activeId, result.innerIds, result.outerIds),
    ['T1', 'T3', 'T4', 'T5'],
  );
});

test('describes normal and wrapped four-supporter roster pages accurately', () => {
  assert.equal(navigatorRosterStatus(14, 0, 4), 'Educators 1–4 of 14');
  assert.equal(navigatorRosterStatus(14, 3, 4), 'Educators 13–14 and 1–2 of 14');
});

test('captures only when the initiating pointer crosses the horizontal swipe threshold', () => {
  const started = beginNavigatorSwipe(7, 100, 60);
  const belowThreshold = trackNavigatorSwipe(started, 7, 53, 60);
  const accepted = trackNavigatorSwipe(started, 7, 52, 64);
  const wrongPointer = trackNavigatorSwipe(started, 8, 20, 60);
  const vertical = trackNavigatorSwipe(started, 7, 50, 130);

  assert.equal(started.captured, false);
  assert.equal(belowThreshold.accepted, false);
  assert.equal(accepted.direction, 1);
  assert.equal(accepted.accepted, true);
  assert.equal(accepted.state.captured, true);
  assert.equal(wrongPointer.accepted, false);
  assert.equal(vertical.accepted, false);
  assert.equal(cancelNavigatorSwipe(accepted.state, 7).pointerId, null);
});

test('consumes only the immediate pointer click after an accepted swipe and expires it', () => {
  const accepted = trackNavigatorSwipe(beginNavigatorSwipe(7, 100, 60), 7, 52, 60);
  const finished = finishNavigatorSwipe(accepted.state, 7, 1000);
  const firstClick = consumeNavigatorClickSuppression(finished, 1, 1100);
  const secondClick = consumeNavigatorClickSuppression(firstClick.state, 1, 1101);
  const expired = consumeNavigatorClickSuppression(finished, 1, 1501);

  assert.equal(firstClick.suppressed, true);
  assert.equal(secondClick.suppressed, false);
  assert.equal(expired.suppressed, false);
});

test('never suppresses keyboard activation after a swipe', () => {
  const accepted = trackNavigatorSwipe(beginNavigatorSwipe(7, 100, 60), 7, 52, 60);
  const finished = finishNavigatorSwipe(accepted.state, 7, 1000);
  const keyboard = consumeNavigatorClickSuppression(finished, 0, 1100);

  assert.equal(keyboard.suppressed, false);
  assert.equal(keyboard.state.suppressClickUntil, 0);
});

test('uses reduced tablet parallax while leaving mobile static', () => {
  assert.deepEqual(parallaxLimitsForBand('wide'), { field: 5, halo: 8, geometry: 3 });
  assert.deepEqual(parallaxLimitsForBand('desktop'), { field: 5, halo: 8, geometry: 3 });
  assert.deepEqual(parallaxLimitsForBand('tablet'), { field: 2.5, halo: 4, geometry: 1.5 });
  assert.deepEqual(parallaxLimitsForBand('mobile'), { field: 0, halo: 0, geometry: 0 });
});
