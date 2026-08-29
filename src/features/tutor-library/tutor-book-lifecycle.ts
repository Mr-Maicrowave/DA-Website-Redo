import {
  cloneBookMotionPose,
  createBookReturnMotion,
  interpolateBookMotion,
  type BookMotionPose,
  type BookMotionSegment,
} from './tutor-book-motion.ts';

export type MatrixTuple = readonly [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
];

export interface NeighbourPoseSnapshot {
  editionId: string;
  pose: BookMotionPose;
}

export interface BookLifecycleCapture {
  editionId: string;
  rootUuid: string;
  shelfPose: BookMotionPose;
  shelfLocalMatrix: MatrixTuple;
  shelfWorldMatrix: MatrixTuple;
  neighbourPoses: readonly NeighbourPoseSnapshot[];
}

export interface CompleteShelfControllerSnapshot {
  rootUuid: string;
  closeComplete: boolean;
  resetComplete: boolean;
  openProgress: number;
  pageTurnProgress: number;
  settledPages: number;
  deformationReset: boolean;
}

export type BookLifecycleInterruption = 'escape' | 'selection-change' | 'resize' | 'visibility-resume';

export interface BookLifecycleCoordinator extends BookLifecycleCapture {
  transitionGeneration: number;
  sampledPose: BookMotionPose;
  transitionFromPose: BookMotionPose;
  interruption?: BookLifecycleInterruption;
  returnMotion?: BookMotionSegment;
}

export interface BeginShelfReturnResult {
  accepted: boolean;
  coordinator: BookLifecycleCoordinator;
}

const cloneMatrix = (matrix: MatrixTuple): MatrixTuple => [...matrix] as unknown as MatrixTuple;

const assertMatrix: (matrix: readonly number[], name: string) => asserts matrix is MatrixTuple = (matrix, name) => {
  if (matrix.length !== 16 || matrix.some(value => !Number.isFinite(value))) {
    throw new Error(`${name} must contain 16 finite numbers`);
  }
};

const assertPose = (pose: BookMotionPose, name: string) => {
  const values = [...pose.position, ...pose.rotation, ...pose.scale];
  if (values.some(value => !Number.isFinite(value))) throw new Error(`${name} must contain finite numbers`);
};

const cloneNeighbours = (neighbours: readonly NeighbourPoseSnapshot[]): NeighbourPoseSnapshot[] =>
  neighbours.map(neighbour => ({
    editionId: neighbour.editionId,
    pose: cloneBookMotionPose(neighbour.pose),
  }));

export function createBookLifecycleCoordinator(capture: BookLifecycleCapture): BookLifecycleCoordinator {
  assertMatrix(capture.shelfLocalMatrix, 'shelfLocalMatrix');
  assertMatrix(capture.shelfWorldMatrix, 'shelfWorldMatrix');
  assertPose(capture.shelfPose, 'shelfPose');
  capture.neighbourPoses.forEach(neighbour => assertPose(neighbour.pose, `neighbour ${neighbour.editionId}`));

  const shelfPose = cloneBookMotionPose(capture.shelfPose);
  return {
    editionId: capture.editionId,
    rootUuid: capture.rootUuid,
    shelfPose,
    shelfLocalMatrix: cloneMatrix(capture.shelfLocalMatrix),
    shelfWorldMatrix: cloneMatrix(capture.shelfWorldMatrix),
    neighbourPoses: cloneNeighbours(capture.neighbourPoses),
    transitionGeneration: 0,
    sampledPose: cloneBookMotionPose(shelfPose),
    transitionFromPose: cloneBookMotionPose(shelfPose),
  };
}

export function interruptBookLifecycle(
  coordinator: BookLifecycleCoordinator,
  sampledPose: BookMotionPose,
  interruption: BookLifecycleInterruption,
): BookLifecycleCoordinator {
  assertPose(sampledPose, 'sampledPose');
  const sampled = cloneBookMotionPose(sampledPose);
  const { returnMotion: _returnMotion, ...rest } = coordinator;
  return {
    ...rest,
    transitionGeneration: coordinator.transitionGeneration + 1,
    sampledPose: sampled,
    transitionFromPose: cloneBookMotionPose(sampled),
    interruption,
  };
}

export const isControllerReadyForShelfReturn = (
  coordinator: BookLifecycleCoordinator,
  controller: CompleteShelfControllerSnapshot,
) => controller.rootUuid === coordinator.rootUuid
  && controller.closeComplete
  && controller.resetComplete
  && controller.openProgress === 0
  && controller.pageTurnProgress === 0
  && controller.settledPages === 0
  && controller.deformationReset;

export function beginShelfReturn(
  coordinator: BookLifecycleCoordinator,
  controller: CompleteShelfControllerSnapshot,
): BeginShelfReturnResult {
  if (!isControllerReadyForShelfReturn(coordinator, controller)) {
    return { accepted: false, coordinator };
  }

  return {
    accepted: true,
    coordinator: {
      ...coordinator,
      transitionGeneration: coordinator.transitionGeneration + 1,
      returnMotion: createBookReturnMotion(coordinator.sampledPose, coordinator.shelfPose),
    },
  };
}

export function sampleShelfReturn(coordinator: BookLifecycleCoordinator, progress: number): BookMotionPose {
  if (!coordinator.returnMotion) throw new Error('Shelf return has not begun');
  return interpolateBookMotion(coordinator.returnMotion.from, coordinator.returnMotion.to, progress);
}

export function completeShelfReturn(
  coordinator: BookLifecycleCoordinator,
  rootUuid: string,
): BookLifecycleCoordinator {
  if (rootUuid !== coordinator.rootUuid) throw new Error('Book root identity changed during shelf return');
  if (!coordinator.returnMotion) throw new Error('Shelf return has not begun');

  const { returnMotion: _returnMotion, interruption: _interruption, ...rest } = coordinator;
  return {
    ...rest,
    shelfPose: cloneBookMotionPose(coordinator.shelfPose),
    shelfLocalMatrix: cloneMatrix(coordinator.shelfLocalMatrix),
    shelfWorldMatrix: cloneMatrix(coordinator.shelfWorldMatrix),
    neighbourPoses: cloneNeighbours(coordinator.neighbourPoses),
    transitionGeneration: coordinator.transitionGeneration + 1,
    sampledPose: cloneBookMotionPose(coordinator.shelfPose),
    transitionFromPose: cloneBookMotionPose(coordinator.shelfPose),
  };
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
