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
  type BookLifecycleSample,
  type CompleteShelfControllerSnapshot,
  type MatrixTuple,
} from './tutor-book-lifecycle.ts';
import { createLibraryState, libraryReducer, type LibraryEvent, type LibraryState } from './tutor-library-state.ts';

const shelfPose: BookMotionPose = {
  position: [-1.125, 2.35, -7.625],
  rotation: [0, Math.PI / 2, -.012],
  scale: [1, 1, 1],
};

const shelfLocalMatrix: MatrixTuple = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -1.125, 2.35, -7.625, 1];
const shelfWorldMatrix: MatrixTuple = [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 4.5, 2.35, -6.25, 1];

function createCapture(): BookLifecycleCapture {
  return {
    editionId: 'book-a',
    rootUuid: 'persistent-root',
    shelfPose: structuredClone(shelfPose),
    shelfLocalMatrix: [...shelfLocalMatrix] as MatrixTuple,
    shelfWorldMatrix: [...shelfWorldMatrix] as MatrixTuple,
    neighbourPoses: [
      { editionId: 'book-left', pose: { position: [-1.24, 2.35, -7.625], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1] } },
      { editionId: 'book-right', pose: { position: [-1.01, 2.35, -7.625], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1] } },
    ],
  };
}

const resetReady: CompleteShelfControllerSnapshot = {
  rootUuid: 'persistent-root',
  closeComplete: true,
  resetComplete: true,
  openProgress: 0,
  pageTurnProgress: 0,
  settledPages: 0,
  deformationReset: true,
};

const sampledPose: BookMotionPose = {
  position: [.314159, 1.618034, 4.271828],
  rotation: [-.12, .47, .015],
  scale: [2.75, 2.75, 2.75],
};

function createPerturbedSample(cycle = 0): BookLifecycleSample {
  const offset = (cycle + 1) / 100;
  const local = [...shelfLocalMatrix] as number[];
  const world = [...shelfWorldMatrix] as number[];
  local[12] += offset;
  local[14] += offset * 2;
  world[12] -= offset * 3;
  world[14] += offset;
  return {
    pose: {
      position: [sampledPose.position[0] + offset, sampledPose.position[1], sampledPose.position[2]],
      rotation: [...sampledPose.rotation],
      scale: [...sampledPose.scale],
    },
    localMatrix: local as unknown as MatrixTuple,
    worldMatrix: world as unknown as MatrixTuple,
    neighbourPoses: createCapture().neighbourPoses.map((neighbour, index) => ({
      editionId: neighbour.editionId,
      pose: {
        position: [neighbour.pose.position[0] + offset * (index + 1), ...neighbour.pose.position.slice(1)] as [number, number, number],
        rotation: [...neighbour.pose.rotation],
        scale: [...neighbour.pose.scale],
      },
    })),
  };
}

type CompletionEvent = Extract<LibraryEvent, { generation: number }>;
type WithoutGeneration<T> = T extends unknown ? Omit<T, 'generation'> : never;
const completeLibrary = (state: LibraryState, event: WithoutGeneration<CompletionEvent>) =>
  libraryReducer(state, { ...event, generation: state.transitionGeneration } as LibraryEvent);

test('captures shelf matrices, root identity, neighbours, and current state by value', () => {
  const capture = createCapture();
  const coordinator = createBookLifecycleCoordinator(capture);

  assert.equal(coordinator.rootUuid, 'persistent-root');
  assert.deepEqual(coordinator.shelfLocalMatrix, capture.shelfLocalMatrix);
  assert.deepEqual(coordinator.shelfWorldMatrix, capture.shelfWorldMatrix);
  assert.deepEqual(coordinator.currentLocalMatrix, capture.shelfLocalMatrix);
  assert.deepEqual(coordinator.currentWorldMatrix, capture.shelfWorldMatrix);
  assert.deepEqual(coordinator.sampledPose, shelfPose);
  assert.deepEqual(coordinator.neighbourPoses, capture.neighbourPoses);
  assert.deepEqual(coordinator.currentNeighbourPoses, capture.neighbourPoses);
  assert.notEqual(coordinator.shelfPose, capture.shelfPose);
  assert.notEqual(coordinator.neighbourPoses, capture.neighbourPoses);
});

test('deep-freezes restoration targets and clones inbound and outbound payloads', () => {
  const capture = createCapture();
  const coordinator = createBookLifecycleCoordinator(capture);
  (capture.shelfLocalMatrix as unknown as number[])[12] = 99;
  (capture.shelfPose.position as unknown as number[])[0] = 99;
  (capture.neighbourPoses[0].pose.position as unknown as number[])[0] = 99;

  assert.deepEqual(coordinator.shelfLocalMatrix, shelfLocalMatrix);
  assert.deepEqual(coordinator.shelfPose, shelfPose);
  assert.equal(coordinator.neighbourPoses[0].pose.position[0], -1.24);
  assert.throws(() => { (coordinator.shelfWorldMatrix as unknown as number[])[12] = 99; }, TypeError);
  assert.throws(() => { (coordinator.shelfPose.position as unknown as number[])[0] = 99; }, TypeError);
  assert.throws(() => { (coordinator.neighbourPoses[0].pose.position as unknown as number[])[0] = 99; }, TypeError);

  const interrupted = interruptBookLifecycle(coordinator, createPerturbedSample(), 'escape');
  const returning = beginShelfReturn(interrupted, {
    generation: interrupted.transitionGeneration,
    controller: resetReady,
  }).coordinator;
  const outbound = sampleShelfReturn(returning, 1);
  outbound.position[0] = 99;
  assert.deepEqual(returning.returnMotion?.to, shelfPose);
});

test('resize and visibility resume restart from the exact sampled transform and matrices', () => {
  let coordinator = createBookLifecycleCoordinator(createCapture());
  const resizeSample = createPerturbedSample(0);
  coordinator = interruptBookLifecycle(coordinator, resizeSample, 'resize');
  const resizeGeneration = coordinator.transitionGeneration;

  assert.deepEqual(coordinator.sampledPose, resizeSample.pose);
  assert.deepEqual(coordinator.transitionFromPose, resizeSample.pose);
  assert.deepEqual(coordinator.currentLocalMatrix, resizeSample.localMatrix);
  assert.deepEqual(coordinator.currentWorldMatrix, resizeSample.worldMatrix);
  assert.equal(coordinator.interruption, 'resize');

  const resumedSample = createPerturbedSample(1);
  coordinator = interruptBookLifecycle(coordinator, resumedSample, 'visibility-resume');
  assert.equal(coordinator.transitionGeneration, resizeGeneration + 1);
  assert.deepEqual(coordinator.transitionFromPose, resumedSample.pose);
  assert.deepEqual(coordinator.currentNeighbourPoses, resumedSample.neighbourPoses);
  assert.equal(coordinator.rootUuid, 'persistent-root');
  assert.deepEqual(coordinator.shelfWorldMatrix, shelfWorldMatrix);
});

test('refuses stale reset completion and controller residue before shelf transit', () => {
  const coordinator = interruptBookLifecycle(createBookLifecycleCoordinator(createCapture()), createPerturbedSample(), 'escape');
  const invalid: CompleteShelfControllerSnapshot[] = [
    { ...resetReady, closeComplete: false },
    { ...resetReady, resetComplete: false },
    { ...resetReady, openProgress: .000001 },
    { ...resetReady, pageTurnProgress: .000001 },
    { ...resetReady, settledPages: 1 },
    { ...resetReady, deformationReset: false },
    { ...resetReady, rootUuid: 'replacement-root' },
  ];

  const stale = beginShelfReturn(coordinator, { generation: coordinator.transitionGeneration - 1, controller: resetReady });
  assert.equal(stale.accepted, false);
  assert.equal(stale.coordinator, coordinator);
  for (const controller of invalid) {
    const result = beginShelfReturn(coordinator, { generation: coordinator.transitionGeneration, controller });
    assert.equal(result.accepted, false);
    assert.equal(result.coordinator, coordinator);
  }

  const accepted = beginShelfReturn(coordinator, { generation: coordinator.transitionGeneration, controller: resetReady });
  assert.equal(accepted.accepted, true);
  assert.deepEqual(accepted.coordinator.returnMotion?.from, createPerturbedSample().pose);
  assert.deepEqual(accepted.coordinator.returnMotion?.to, shelfPose);
});

test('rejects an old same-root return callback after a newer return generation starts', () => {
  const initial = interruptBookLifecycle(createBookLifecycleCoordinator(createCapture()), createPerturbedSample(0), 'escape');
  const firstReturn = beginShelfReturn(initial, { generation: initial.transitionGeneration, controller: resetReady }).coordinator;
  const staleGeneration = firstReturn.transitionGeneration;
  const restarted = interruptBookLifecycle(firstReturn, createPerturbedSample(1), 'resize');
  const currentReturn = beginShelfReturn(restarted, { generation: restarted.transitionGeneration, controller: resetReady }).coordinator;

  const stale = completeShelfReturn(currentReturn, { rootUuid: 'persistent-root', generation: staleGeneration });
  assert.equal(stale.accepted, false);
  assert.equal(stale.coordinator, currentReturn);
  assert.ok(currentReturn.returnMotion);

  const current = completeShelfReturn(currentReturn, {
    rootUuid: 'persistent-root',
    generation: currentReturn.transitionGeneration,
  });
  assert.equal(current.accepted, true);
  assert.equal(current.coordinator.returnMotion, undefined);
});

test('samples return from the current interruption rather than the preview destination', () => {
  const sample = createPerturbedSample(2);
  const interrupted = interruptBookLifecycle(createBookLifecycleCoordinator(createCapture()), sample, 'escape');
  const returning = beginShelfReturn(interrupted, { generation: interrupted.transitionGeneration, controller: resetReady }).coordinator;

  assert.deepEqual(sampleShelfReturn(returning, 0), sample.pose);
  assert.deepEqual(sampleShelfReturn(returning, 1), shelfPose);
  assert.throws(() => sampleShelfReturn(createBookLifecycleCoordinator(createCapture()), .5), /return has not begun/i);
});

test('restores exact matrices and neighbour poses with matching root and generation', () => {
  const interrupted = interruptBookLifecycle(createBookLifecycleCoordinator(createCapture()), createPerturbedSample(), 'escape');
  const returning = beginShelfReturn(interrupted, { generation: interrupted.transitionGeneration, controller: resetReady }).coordinator;
  const wrongRoot = completeShelfReturn(returning, {
    rootUuid: 'replacement-root',
    generation: returning.transitionGeneration,
  });
  assert.equal(wrongRoot.accepted, false);
  assert.equal(wrongRoot.coordinator, returning);

  const result = completeShelfReturn(returning, {
    rootUuid: 'persistent-root',
    generation: returning.transitionGeneration,
  });
  assert.equal(result.accepted, true);
  const restored = result.coordinator;
  assert.equal(restored.rootUuid, 'persistent-root');
  assert.deepEqual(restored.sampledPose, shelfPose);
  assert.deepEqual(restored.currentLocalMatrix, shelfLocalMatrix);
  assert.deepEqual(restored.currentWorldMatrix, shelfWorldMatrix);
  assert.deepEqual(restored.currentNeighbourPoses, createCapture().neighbourPoses);
  assert.equal(restored.returnMotion, undefined);
});

test('restores perturbed pose, matrices, and neighbours through ten complete semantic cycles', () => {
  let coordinator = createBookLifecycleCoordinator(createCapture());
  let library = createLibraryState('primary');
  let previousLibraryGeneration = library.transitionGeneration;

  for (let cycle = 0; cycle < 10; cycle += 1) {
    library = libraryReducer(library, { type: 'HOVER', editionId: 'book-a', rootUuid: 'persistent-root' });
    library = completeLibrary(library, { type: 'HOVER_INTENT_COMPLETE' });
    library = completeLibrary(library, { type: 'PREVIEW_READY' });
    library = libraryReducer(library, { type: 'OPEN' });
    library = completeLibrary(library, { type: 'READING_POSE_READY' });
    library = completeLibrary(library, { type: 'OPEN_COMPLETE' });
    assert.equal(library.phase, 'BOOK_READING');

    const perturbed = createPerturbedSample(cycle);
    coordinator = interruptBookLifecycle(coordinator, perturbed, 'close');
    assert.ok(maxMatrixDelta(coordinator.currentLocalMatrix, shelfLocalMatrix) > 0);
    assert.ok(maxMatrixDelta(coordinator.currentWorldMatrix, shelfWorldMatrix) > 0);
    assert.notDeepEqual(coordinator.currentNeighbourPoses, coordinator.neighbourPoses);
    library = libraryReducer(library, { type: 'CLOSE' });
    library = completeLibrary(library, { type: 'CLOSE_COMPLETE' });
    library = completeLibrary(library, { type: 'RESET_COMPLETE', controller: resetReady });
    assert.equal(library.phase, 'BOOK_RETURNING');

    const begun = beginShelfReturn(coordinator, { generation: coordinator.transitionGeneration, controller: resetReady });
    assert.equal(begun.accepted, true);
    coordinator = begun.coordinator;
    assert.deepEqual(sampleShelfReturn(coordinator, 1), shelfPose);
    const completed = completeShelfReturn(coordinator, {
      rootUuid: 'persistent-root',
      generation: coordinator.transitionGeneration,
    });
    assert.equal(completed.accepted, true);
    coordinator = completed.coordinator;
    library = completeLibrary(library, { type: 'RETURN_COMPLETE' });

    assert.equal(library.phase, 'ROOM_IDLE');
    assert.ok(library.transitionGeneration > previousLibraryGeneration);
    previousLibraryGeneration = library.transitionGeneration;
    assert.equal(coordinator.rootUuid, 'persistent-root');
    assert.equal(coordinator.transitionGeneration, (cycle + 1) * 3);
    assert.ok(maxMatrixDelta(coordinator.currentLocalMatrix, shelfLocalMatrix) <= 1e-6);
    assert.ok(maxMatrixDelta(coordinator.currentWorldMatrix, shelfWorldMatrix) <= 1e-6);
    assert.deepEqual(coordinator.sampledPose, shelfPose);
    assert.deepEqual(coordinator.currentNeighbourPoses, coordinator.neighbourPoses);
  }
});

test('rejects malformed matrices rather than accepting a non-restorable capture or sample', () => {
  assert.throws(
    () => createBookLifecycleCoordinator({ ...createCapture(), shelfLocalMatrix: [1, 2, 3] as never }),
    /16 finite numbers/i,
  );
  assert.throws(
    () => createBookLifecycleCoordinator({ ...createCapture(), shelfWorldMatrix: [...shelfWorldMatrix.slice(0, 15), Number.NaN] as never }),
    /16 finite numbers/i,
  );
  assert.throws(
    () => interruptBookLifecycle(createBookLifecycleCoordinator(createCapture()), { ...createPerturbedSample(), localMatrix: [1] as never }, 'resize'),
    /16 finite numbers/i,
  );
});
