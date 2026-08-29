import assert from 'node:assert/strict';
import test from 'node:test';
import type { BookMotionPose } from './tutor-book-motion.ts';
import {
  beginShelfReturn,
  completeShelfReturn,
  createBookLifecycleCoordinator,
  interruptBookLifecycle,
  maxMatrixDelta,
  sampleShelfReturn,
  type BookLifecycleCapture,
  type CompleteShelfControllerSnapshot,
} from './tutor-book-lifecycle.ts';

const shelfPose: BookMotionPose = {
  position: [-1.125, 2.35, -7.625],
  rotation: [0, Math.PI / 2, -.012],
  scale: [1, 1, 1],
};

const capture: BookLifecycleCapture = {
  editionId: 'book-a',
  rootUuid: 'persistent-root',
  shelfPose,
  shelfLocalMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -1.125, 2.35, -7.625, 1],
  shelfWorldMatrix: [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 4.5, 2.35, -6.25, 1],
  neighbourPoses: [
    { editionId: 'book-left', pose: { position: [-1.24, 2.35, -7.625], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1] } },
    { editionId: 'book-right', pose: { position: [-1.01, 2.35, -7.625], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1] } },
  ],
};

const resetReady: CompleteShelfControllerSnapshot = {
  rootUuid: 'persistent-root',
  closeComplete: true,
  resetComplete: true,
  openProgress: 0,
  pageTurnProgress: 0,
  settledPages: 0,
  deformationReset: true,
};

const sampled: BookMotionPose = {
  position: [.314159, 1.618034, 4.271828],
  rotation: [-.12, .47, .015],
  scale: [2.75, 2.75, 2.75],
};

test('captures shelf matrices, root identity, neighbours, and current pose by value', () => {
  const coordinator = createBookLifecycleCoordinator(capture);

  assert.equal(coordinator.rootUuid, 'persistent-root');
  assert.deepEqual(coordinator.shelfLocalMatrix, capture.shelfLocalMatrix);
  assert.deepEqual(coordinator.shelfWorldMatrix, capture.shelfWorldMatrix);
  assert.deepEqual(coordinator.sampledPose, shelfPose);
  assert.deepEqual(coordinator.neighbourPoses, capture.neighbourPoses);
  assert.notEqual(coordinator.shelfPose, capture.shelfPose);
  assert.notEqual(coordinator.neighbourPoses, capture.neighbourPoses);
});

test('resize and visibility resume restart from the exact sampled transform', () => {
  let coordinator = createBookLifecycleCoordinator(capture);
  coordinator = interruptBookLifecycle(coordinator, sampled, 'resize');
  const resizeGeneration = coordinator.transitionGeneration;

  assert.deepEqual(coordinator.sampledPose, sampled);
  assert.deepEqual(coordinator.transitionFromPose, sampled);
  assert.equal(coordinator.interruption, 'resize');

  const resumedPose: BookMotionPose = { ...sampled, position: [.4, 1.7, 4.1] };
  coordinator = interruptBookLifecycle(coordinator, resumedPose, 'visibility-resume');
  assert.equal(coordinator.transitionGeneration, resizeGeneration + 1);
  assert.deepEqual(coordinator.transitionFromPose, resumedPose);
  assert.equal(coordinator.rootUuid, capture.rootUuid);
  assert.deepEqual(coordinator.shelfWorldMatrix, capture.shelfWorldMatrix);
});

test('refuses shelf transit until close and reset are complete with no residue', () => {
  const coordinator = interruptBookLifecycle(createBookLifecycleCoordinator(capture), sampled, 'escape');
  const invalid: CompleteShelfControllerSnapshot[] = [
    { ...resetReady, closeComplete: false },
    { ...resetReady, resetComplete: false },
    { ...resetReady, openProgress: .000001 },
    { ...resetReady, pageTurnProgress: .000001 },
    { ...resetReady, settledPages: 1 },
    { ...resetReady, deformationReset: false },
    { ...resetReady, rootUuid: 'replacement-root' },
  ];

  for (const controller of invalid) {
    const result = beginShelfReturn(coordinator, controller);
    assert.equal(result.accepted, false);
    assert.equal(result.coordinator, coordinator);
  }

  const accepted = beginShelfReturn(coordinator, resetReady);
  assert.equal(accepted.accepted, true);
  assert.deepEqual(accepted.coordinator.returnMotion?.from, sampled);
  assert.deepEqual(accepted.coordinator.returnMotion?.to, shelfPose);
});

test('samples return from the current interruption rather than the preview destination', () => {
  const interrupted = interruptBookLifecycle(createBookLifecycleCoordinator(capture), sampled, 'escape');
  const returning = beginShelfReturn(interrupted, resetReady).coordinator;

  assert.deepEqual(sampleShelfReturn(returning, 0), sampled);
  assert.deepEqual(sampleShelfReturn(returning, 1), shelfPose);
  assert.throws(() => sampleShelfReturn(createBookLifecycleCoordinator(capture), .5), /return has not begun/i);
});

test('restores exact matrices and neighbour poses with the same physical root', () => {
  const interrupted = interruptBookLifecycle(createBookLifecycleCoordinator(capture), sampled, 'escape');
  const returning = beginShelfReturn(interrupted, resetReady).coordinator;
  const restored = completeShelfReturn(returning, capture.rootUuid);

  assert.equal(restored.rootUuid, capture.rootUuid);
  assert.deepEqual(restored.sampledPose, shelfPose);
  assert.deepEqual(restored.shelfLocalMatrix, capture.shelfLocalMatrix);
  assert.deepEqual(restored.shelfWorldMatrix, capture.shelfWorldMatrix);
  assert.deepEqual(restored.neighbourPoses, capture.neighbourPoses);
  assert.equal(restored.returnMotion, undefined);
  assert.throws(() => completeShelfReturn(returning, 'replacement-root'), /root identity/i);
});

test('has no accumulated transform drift over ten complete cycles', () => {
  let coordinator = createBookLifecycleCoordinator(capture);
  for (let cycle = 0; cycle < 10; cycle += 1) {
    const cyclePose: BookMotionPose = {
      position: [sampled.position[0] + cycle / 1000, sampled.position[1], sampled.position[2]],
      rotation: sampled.rotation,
      scale: sampled.scale,
    };
    coordinator = interruptBookLifecycle(coordinator, cyclePose, 'escape');
    coordinator = beginShelfReturn(coordinator, resetReady).coordinator;
    assert.deepEqual(sampleShelfReturn(coordinator, 1), shelfPose);
    coordinator = completeShelfReturn(coordinator, capture.rootUuid);
  }

  assert.deepEqual(coordinator.sampledPose, shelfPose);
  assert.equal(maxMatrixDelta(coordinator.shelfLocalMatrix, capture.shelfLocalMatrix), 0);
  assert.equal(maxMatrixDelta(coordinator.shelfWorldMatrix, capture.shelfWorldMatrix), 0);
  assert.ok(maxMatrixDelta(coordinator.shelfWorldMatrix, capture.shelfWorldMatrix) <= 1e-6);
});

test('rejects malformed matrices rather than accepting a non-restorable capture', () => {
  assert.throws(
    () => createBookLifecycleCoordinator({ ...capture, shelfLocalMatrix: [1, 2, 3] as never }),
    /16 finite numbers/i,
  );
  assert.throws(
    () => createBookLifecycleCoordinator({ ...capture, shelfWorldMatrix: [...capture.shelfWorldMatrix.slice(0, 15), Number.NaN] as never }),
    /16 finite numbers/i,
  );
});
