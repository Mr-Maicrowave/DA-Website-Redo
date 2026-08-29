import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createCompleteShelfPrototypePlan,
  createCompleteShelfLeafLayout,
  getCompleteShelfReadingEnvelope,
  getCompleteShelfBookMetrics,
  isCompleteShelfReturnSafe,
  sampleCompleteShelfPageTurn,
  sampleCompleteShelfPrototypePose,
  shouldRenderCompleteShelfLeaves,
  isCompleteShelfLeafInsideClosedEnvelope,
} from './complete-shelf-book-prototype.ts';
import type { ShelfPose } from './tutor-book-geometry.ts';

const shelfPose: ShelfPose = {
  position: [1.2, .78, .31],
  rotation: [0, Math.PI / 2, .018],
  width: .48,
  height: .92,
  depth: .3,
};

test('keeps Complete Shelf hardcover proportions when uniformly fitted to a DA shelf slot', () => {
  const metrics = getCompleteShelfBookMetrics(shelfPose);

  assert.equal(metrics.boardThickness, .032);
  assert.equal(metrics.boardRadius, .0045);
  assert.equal(metrics.spineWidth, .082);
  assert.equal(metrics.pageInsetWidth, .074);
  assert.equal(metrics.pageInsetHeight, .068);
  assert.equal(metrics.leafCount, 6);
  assert.equal(metrics.uniformScale, .92 / 1.58);
});

test('holds spine orientation until the extraction clears the shelf', () => {
  const plan = createCompleteShelfPrototypePlan(shelfPose);
  const extracting = sampleCompleteShelfPrototypePose(plan, .42);
  const preview = sampleCompleteShelfPrototypePose(plan, 1);

  assert.equal(extracting.rotation[1], Math.PI / 2);
  assert.ok(extracting.position[2] > shelfPose.position[2]);
  assert.equal(preview.rotation[1], 0);
  assert.ok(preview.position[2] > extracting.position[2]);
});

test('returns precisely to the original stored shelf transform without drift', () => {
  const plan = createCompleteShelfPrototypePlan(shelfPose);
  const returned = sampleCompleteShelfPrototypePose(plan, 1, 'returning');

  assert.deepEqual(returned, {
    position: shelfPose.position,
    rotation: shelfPose.rotation,
    scale: [getCompleteShelfBookMetrics(shelfPose).uniformScale, getCompleteShelfBookMetrics(shelfPose).uniformScale, getCompleteShelfBookMetrics(shelfPose).uniformScale],
  });
});

test('creates six two-sided leaves ordered from the binding to the fore edge', () => {
  const leaves = createCompleteShelfLeafLayout();

  assert.equal(leaves.length, 6);
  assert.equal(leaves[0].leafOrder, 5);
  assert.equal(leaves.at(-1)?.leafOrder, 0);
  assert.ok(leaves.every(leaf => leaf.widthSegments === 18 && leaf.verticalSegments === 5 && leaf.surfaceCount === 2));
  assert.ok(leaves.every(leaf => leaf.restZ > 0 && leaf.turnedZ > leaf.restZ));
});

test('uses restrained asymmetric paper curvature through a page turn', () => {
  const early = sampleCompleteShelfPageTurn(.25, .56, .5);
  const middle = sampleCompleteShelfPageTurn(.5, .56, .5);
  const late = sampleCompleteShelfPageTurn(.75, .56, .5);

  assert.ok(early.bow > 0 && early.bow < .04, 'quarter turn lifts without a sail-like bow');
  assert.ok(middle.bow > early.bow, 'mid turn carries the strongest bow');
  assert.ok(late.bow < middle.bow, 'late turn relaxes toward the destination stack');
  assert.ok(Math.abs(middle.twist) < .025, 'twist remains paper-like rather than rubbery');
});

test('keeps the binding edge constrained while the fore edge travels through the turn', () => {
  const binding = sampleCompleteShelfPageTurn(.5, 0, .5);
  const foreEdge = sampleCompleteShelfPageTurn(.5, 1, .5);

  assert.equal(binding.bow, 0);
  assert.ok(foreEdge.rotation > binding.rotation);
  assert.ok(foreEdge.bow < .07);
});

test('keeps every turning leaf sample above the shelf safety plane in reading pose', () => {
  const envelope = getCompleteShelfReadingEnvelope(-.19);

  assert.ok(envelope.rootPosition[1] - envelope.bookHalfHeight > envelope.safeShelfY);
  assert.ok(envelope.turningLeafLowestY > envelope.safeShelfY);
  assert.ok(envelope.rootPosition[2] > .5, 'reading pose clears forward from the shelf');
});

test('does not allow return to the shelf until cover and turning leaf are fully reset', () => {
  assert.equal(isCompleteShelfReturnSafe({ coverAngle: 0, activePageTurnProgress: 0, turningLeafOffset: 0, turningLeafRotation: 0, pageStackReseated: true }), true);
  assert.equal(isCompleteShelfReturnSafe({ coverAngle: .001, activePageTurnProgress: 0, turningLeafOffset: 0, turningLeafRotation: 0, pageStackReseated: true }), false);
  assert.equal(isCompleteShelfReturnSafe({ coverAngle: 0, activePageTurnProgress: .001, turningLeafOffset: 0, turningLeafRotation: 0, pageStackReseated: true }), false);
});

test('removes articulated leaves from the fully closed return geometry', () => {
  assert.equal(shouldRenderCompleteShelfLeaves(0), false);
  assert.equal(shouldRenderCompleteShelfLeaves(.08), false);
  assert.equal(shouldRenderCompleteShelfLeaves(.5), true);
});

test('rejects a closed return when any leaf vertex remains outside the text-block envelope', () => {
  assert.equal(isCompleteShelfLeafInsideClosedEnvelope({ minX: -.44, maxX: .44, minY: -.68, maxY: .68, minZ: -.1, maxZ: .1 }), true);
  assert.equal(isCompleteShelfLeafInsideClosedEnvelope({ minX: -.44, maxX: .44, minY: -.68, maxY: .82, minZ: -.1, maxZ: .1 }), false);
});
