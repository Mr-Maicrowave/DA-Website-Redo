import {
  createBookReturnMotion,
  interpolateBookMotion,
  type BookMotionPose,
} from './tutor-book-motion.ts';

export type MatrixTuple = readonly [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
];

export interface ReadonlyBookMotionPose {
  readonly position: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
  readonly scale: readonly [number, number, number];
}

export interface NeighbourPoseSnapshot {
  readonly editionId: string;
  readonly pose: ReadonlyBookMotionPose;
}

interface ReadonlyBookMotionSegment {
  readonly from: ReadonlyBookMotionPose;
  readonly to: ReadonlyBookMotionPose;
}

export interface BookLifecycleCapture {
  readonly editionId: string;
  readonly rootUuid: string;
  readonly shelfPose: ReadonlyBookMotionPose;
  readonly shelfLocalMatrix: MatrixTuple;
  readonly shelfWorldMatrix: MatrixTuple;
  readonly neighbourPoses: readonly NeighbourPoseSnapshot[];
}

export interface BookLifecycleSample {
  readonly pose: ReadonlyBookMotionPose;
  readonly localMatrix: MatrixTuple;
  readonly worldMatrix: MatrixTuple;
  readonly neighbourPoses: readonly NeighbourPoseSnapshot[];
}

export interface CompleteShelfControllerSnapshot {
  readonly rootUuid: string;
  readonly closeComplete: boolean;
  readonly resetComplete: boolean;
  readonly openProgress: number;
  readonly pageTurnProgress: number;
  readonly settledPages: number;
  readonly deformationReset: boolean;
}

export type BookLifecycleInterruption = 'close' | 'escape' | 'selection-change' | 'resize' | 'visibility-resume';

export interface BookLifecycleCoordinator extends BookLifecycleCapture {
  readonly transitionGeneration: number;
  readonly sampledPose: ReadonlyBookMotionPose;
  readonly transitionFromPose: ReadonlyBookMotionPose;
  readonly currentLocalMatrix: MatrixTuple;
  readonly currentWorldMatrix: MatrixTuple;
  readonly currentNeighbourPoses: readonly NeighbourPoseSnapshot[];
  readonly interruption?: BookLifecycleInterruption;
  readonly returnMotion?: ReadonlyBookMotionSegment;
}

export interface BeginShelfReturnCompletion {
  readonly generation: number;
  readonly controller: CompleteShelfControllerSnapshot;
}

export interface CompleteShelfReturnCompletion {
  readonly generation: number;
  readonly rootUuid: string;
}

export interface LifecycleCompletionResult {
  readonly accepted: boolean;
  readonly coordinator: BookLifecycleCoordinator;
}

const assertMatrix: (matrix: readonly number[], name: string) => asserts matrix is MatrixTuple = (matrix, name) => {
  if (matrix.length !== 16 || matrix.some(value => !Number.isFinite(value))) {
    throw new Error(`${name} must contain 16 finite numbers`);
  }
};

const assertPose = (pose: ReadonlyBookMotionPose, name: string) => {
  const values = [...pose.position, ...pose.rotation, ...pose.scale];
  if (values.some(value => !Number.isFinite(value))) throw new Error(`${name} must contain finite numbers`);
};

const assertNeighbours = (neighbours: readonly NeighbourPoseSnapshot[], name: string) => {
  neighbours.forEach(neighbour => assertPose(neighbour.pose, `${name} ${neighbour.editionId}`));
};

const cloneMutablePose = (pose: ReadonlyBookMotionPose): BookMotionPose => ({
  position: [...pose.position],
  rotation: [...pose.rotation],
  scale: [...pose.scale],
});

const freezePose = (pose: ReadonlyBookMotionPose): ReadonlyBookMotionPose => Object.freeze({
  position: Object.freeze([...pose.position]) as readonly [number, number, number],
  rotation: Object.freeze([...pose.rotation]) as readonly [number, number, number],
  scale: Object.freeze([...pose.scale]) as readonly [number, number, number],
});

const freezeMatrix = (matrix: MatrixTuple): MatrixTuple =>
  Object.freeze([...matrix]) as unknown as MatrixTuple;

const freezeNeighbours = (neighbours: readonly NeighbourPoseSnapshot[]): readonly NeighbourPoseSnapshot[] =>
  Object.freeze(neighbours.map(neighbour => Object.freeze({
    editionId: neighbour.editionId,
    pose: freezePose(neighbour.pose),
  })));

const freezeSegment = (from: ReadonlyBookMotionPose, to: ReadonlyBookMotionPose): ReadonlyBookMotionSegment =>
  Object.freeze({ from: freezePose(from), to: freezePose(to) });

const freezeCoordinator = (coordinator: BookLifecycleCoordinator): BookLifecycleCoordinator =>
  Object.freeze(coordinator);

export function createBookLifecycleCoordinator(capture: BookLifecycleCapture): BookLifecycleCoordinator {
  assertMatrix(capture.shelfLocalMatrix, 'shelfLocalMatrix');
  assertMatrix(capture.shelfWorldMatrix, 'shelfWorldMatrix');
  assertPose(capture.shelfPose, 'shelfPose');
  assertNeighbours(capture.neighbourPoses, 'neighbour');

  const shelfPose = freezePose(capture.shelfPose);
  const shelfLocal = freezeMatrix(capture.shelfLocalMatrix);
  const shelfWorld = freezeMatrix(capture.shelfWorldMatrix);
  const neighbours = freezeNeighbours(capture.neighbourPoses);
  return freezeCoordinator({
    editionId: capture.editionId,
    rootUuid: capture.rootUuid,
    shelfPose,
    shelfLocalMatrix: shelfLocal,
    shelfWorldMatrix: shelfWorld,
    neighbourPoses: neighbours,
    transitionGeneration: 0,
    sampledPose: shelfPose,
    transitionFromPose: shelfPose,
    currentLocalMatrix: shelfLocal,
    currentWorldMatrix: shelfWorld,
    currentNeighbourPoses: neighbours,
  });
}

export function interruptBookLifecycle(
  coordinator: BookLifecycleCoordinator,
  sample: BookLifecycleSample,
  interruption: BookLifecycleInterruption,
): BookLifecycleCoordinator {
  assertPose(sample.pose, 'sampledPose');
  assertMatrix(sample.localMatrix, 'currentLocalMatrix');
  assertMatrix(sample.worldMatrix, 'currentWorldMatrix');
  assertNeighbours(sample.neighbourPoses, 'current neighbour');
  const sampledPose = freezePose(sample.pose);
  const { returnMotion: _returnMotion, ...rest } = coordinator;
  return freezeCoordinator({
    ...rest,
    transitionGeneration: coordinator.transitionGeneration + 1,
    sampledPose,
    transitionFromPose: sampledPose,
    currentLocalMatrix: freezeMatrix(sample.localMatrix),
    currentWorldMatrix: freezeMatrix(sample.worldMatrix),
    currentNeighbourPoses: freezeNeighbours(sample.neighbourPoses),
    interruption,
  });
}

export const isControllerSnapshotReadyForReturn = (
  expectedRootUuid: string,
  controller: CompleteShelfControllerSnapshot,
) => controller.rootUuid === expectedRootUuid
  && controller.closeComplete
  && controller.resetComplete
  && controller.openProgress === 0
  && controller.pageTurnProgress === 0
  && controller.settledPages === 0
  && controller.deformationReset;

export function beginShelfReturn(
  coordinator: BookLifecycleCoordinator,
  completion: BeginShelfReturnCompletion,
): LifecycleCompletionResult {
  if (
    completion.generation !== coordinator.transitionGeneration
    || !isControllerSnapshotReadyForReturn(coordinator.rootUuid, completion.controller)
  ) {
    return Object.freeze({ accepted: false, coordinator });
  }

  const returnMotion = createBookReturnMotion(
    cloneMutablePose(coordinator.sampledPose),
    cloneMutablePose(coordinator.shelfPose),
  );
  return Object.freeze({
    accepted: true,
    coordinator: freezeCoordinator({
      ...coordinator,
      transitionGeneration: coordinator.transitionGeneration + 1,
      returnMotion: freezeSegment(returnMotion.from, returnMotion.to),
    }),
  });
}

export function sampleShelfReturn(coordinator: BookLifecycleCoordinator, progress: number): BookMotionPose {
  if (!coordinator.returnMotion) throw new Error('Shelf return has not begun');
  return interpolateBookMotion(
    cloneMutablePose(coordinator.returnMotion.from),
    cloneMutablePose(coordinator.returnMotion.to),
    progress,
  );
}

export function completeShelfReturn(
  coordinator: BookLifecycleCoordinator,
  completion: CompleteShelfReturnCompletion,
): LifecycleCompletionResult {
  if (
    !coordinator.returnMotion
    || completion.rootUuid !== coordinator.rootUuid
    || completion.generation !== coordinator.transitionGeneration
  ) {
    return Object.freeze({ accepted: false, coordinator });
  }

  const { returnMotion: _returnMotion, interruption: _interruption, ...rest } = coordinator;
  return Object.freeze({
    accepted: true,
    coordinator: freezeCoordinator({
      ...rest,
      transitionGeneration: coordinator.transitionGeneration + 1,
      sampledPose: coordinator.shelfPose,
      transitionFromPose: coordinator.shelfPose,
      currentLocalMatrix: coordinator.shelfLocalMatrix,
      currentWorldMatrix: coordinator.shelfWorldMatrix,
      currentNeighbourPoses: coordinator.neighbourPoses,
    }),
  });
}

export function maxMatrixDelta(left: readonly number[], right: readonly number[]): number {
  assertMatrix(left, 'left matrix');
  assertMatrix(right, 'right matrix');
  let maxDelta = 0;
  for (let index = 0; index < 16; index += 1) {
    maxDelta = Math.max(maxDelta, Math.abs(left[index] - right[index]));
  }
  return maxDelta;
}
