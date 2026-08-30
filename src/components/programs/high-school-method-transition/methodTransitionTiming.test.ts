import assert from 'node:assert/strict';
import test from 'node:test';
import {
  METHOD_TRANSITION_SCROLL_VH,
  METHOD_TRANSITION_TIMING,
  getViewportZoomTargets,
  zoomScaleAt,
} from './methodTransitionTiming.ts';

test('accelerates the magnifier aggressively during the first fifth', () => {
  const sourceScale = 1;

  assert.equal(zoomScaleAt(0, sourceScale), 1);
  assert.equal(zoomScaleAt(0.03, sourceScale), 1.4);
  assert.equal(zoomScaleAt(0.07, sourceScale), 2.3);
  assert.equal(zoomScaleAt(0.12, sourceScale), 3.5);
  assert.equal(zoomScaleAt(0.16, sourceScale), 5.5);
  assert.equal(zoomScaleAt(0.22, sourceScale), 8);
});

test('moves the glass downward while the green card rises and catches it', () => {
  assert.deepEqual(METHOD_TRANSITION_TIMING, {
    detachEnd: 0.05,
    fastZoomEnd: 0.15,
    largestEnd: 0.25,
    descendStart: 0.25,
    cardRiseStart: 0.32,
    insertionStart: 0.55,
    landEnd: 0.76,
    reactionEnd: 0.82,
    joinStart: 0.82,
    joinEnd: 0.94,
    companionsEnd: 1,
    settleEnd: 1,
  });
});

test('uses a shorter pinned scroll runway', () => {
  assert.equal(METHOD_TRANSITION_SCROLL_VH, 230);
});

test('keeps the complete magnifier inside desktop and mobile viewports', () => {
  assert.deepEqual(getViewportZoomTargets(1440, 900), {
    fast: 450,
    enormous: 648,
    portal: 648,
  });
  assert.deepEqual(getViewportZoomTargets(390, 844), {
    fast: 273,
    enormous: 280.8,
    portal: 280.8,
  });
});
