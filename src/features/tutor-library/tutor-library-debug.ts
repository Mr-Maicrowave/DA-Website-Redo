import type { LibraryPhase } from './tutor-library-state.ts';

export function parseDebugTurnProgress(value: string | null): number | undefined {
  if (value === null || value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : undefined;
}

export interface TutorLibraryViewportProfile {
  cameraRadius: number;
  targetRadius: number;
  cameraHeight: number;
  targetHeight: number;
  fov: number;
  lateralTargetOffset: number;
  maxDpr: number;
}

const isBookPhase = (phase: LibraryPhase) => phase.startsWith('BOOK_') || phase.startsWith('PAGE_');

/** Presentation-only framing. The approved room and physical book geometry remain untouched. */
export function getTutorLibraryViewportProfile(width: number, height: number, phase: LibraryPhase): TutorLibraryViewportProfile {
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 1440;
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 900;
  const portrait = safeWidth <= 700 || safeWidth / safeHeight < .72;
  const tablet = !portrait && safeWidth <= 1100;
  const laptop = !portrait && !tablet && safeWidth <= 1500;
  const maxDpr = portrait ? 1.25 : tablet ? 1.4 : 1.5;

  if (!isBookPhase(phase)) {
    return {
      cameraRadius: 4.1,
      targetRadius: 7.75,
      cameraHeight: 2.45,
      targetHeight: 2.7,
      fov: portrait ? 56 : tablet ? 54 : 52,
      lateralTargetOffset: 0,
      maxDpr,
    };
  }

  if (portrait) {
    return {
      cameraRadius: 4.2,
      targetRadius: 3.2,
      cameraHeight: 2.55,
      targetHeight: 2.25,
      fov: 56,
      lateralTargetOffset: -.42,
      maxDpr,
    };
  }

  if (tablet) {
    return {
      cameraRadius: 4.15,
      targetRadius: 3.2,
      cameraHeight: 2.5,
      targetHeight: 2.75,
      fov: 49,
      lateralTargetOffset: .48,
      maxDpr,
    };
  }

  return {
    cameraRadius: 4.1,
    targetRadius: 3.2,
    cameraHeight: 2.45,
    targetHeight: laptop ? 2.82 : 2.9,
    fov: laptop ? 46 : 44,
    lateralTargetOffset: laptop ? .64 : .82,
    maxDpr,
  };
}

export type TutorLibraryResetState = 'idle' | 'pending' | 'complete' | 'not-required';

export function getTutorLibraryResetState(phase: LibraryPhase): TutorLibraryResetState {
  if (phase === 'ROOM_IDLE') return 'idle';
  if (phase === 'BOOK_CLOSING' || phase === 'BOOK_RESETTING') return 'pending';
  if (phase === 'BOOK_RETURNING') return 'complete';
  return 'not-required';
}

export interface TutorLibraryQaSnapshot {
  phase: LibraryPhase;
  transitionId: string;
  generation: string;
  edition: string;
  wall: string;
  rootUuid: string;
  matrixDelta: string;
  resetState: TutorLibraryResetState;
  reviewView: string;
  progress: string;
}

export function createTutorLibraryQaSnapshot(input: {
  phase: LibraryPhase;
  generation: number;
  editionId?: string;
  wallId: string;
  reviewView?: string | null;
  progress: number;
}): TutorLibraryQaSnapshot {
  const progress = Number.isFinite(input.progress) ? Math.max(0, Math.min(1, input.progress)) : 0;
  return {
    phase: input.phase,
    transitionId: `library-${input.generation}`,
    generation: String(input.generation),
    edition: input.editionId ?? 'none',
    wall: input.wallId,
    rootUuid: 'unmounted',
    matrixDelta: 'unavailable',
    resetState: getTutorLibraryResetState(input.phase),
    reviewView: input.reviewView || 'live',
    progress: progress.toFixed(3),
  };
}

export function getMatrixDeltaFromIdentity(elements: readonly number[]): number | undefined {
  if (elements.length !== 16 || elements.some(value => !Number.isFinite(value))) return undefined;
  const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const delta = elements.reduce((maximum, value, index) => Math.max(maximum, Math.abs(value - identity[index])), 0);
  return Math.round(delta * 1_000_000) / 1_000_000;
}

export function writeTutorLibraryRigDiagnostics(canvas: HTMLCanvasElement, input: {
  rootUuid: string;
  matrixDelta?: number;
  resetState?: TutorLibraryResetState;
}) {
  const root = canvas.closest<HTMLElement>('[data-tutor-library-qa="root"]');
  if (!root) return;
  root.dataset.libraryRootUuid = input.rootUuid;
  root.dataset.libraryMatrixDelta = input.matrixDelta === undefined ? 'unavailable' : input.matrixDelta.toFixed(6);
  if (input.resetState) root.dataset.libraryResetState = input.resetState;
}
