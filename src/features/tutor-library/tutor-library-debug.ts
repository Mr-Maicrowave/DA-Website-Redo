import type { ControllerRuntimeSnapshot, LibraryPhase } from './tutor-library-state.ts';

export const TUTOR_LIBRARY_QA_STATES = [
  'shelf-rest',
  'hover-intent',
  'extract-50',
  'cover-preview',
  'open-50',
  'reading-open',
  'page-25',
  'page-50',
  'page-75',
  'page-settled',
  'close-50',
  'return-50',
  'shelf-restored',
] as const;

export type TutorLibraryQaStateId = typeof TUTOR_LIBRARY_QA_STATES[number];

export interface TutorLibraryQaState {
  id: TutorLibraryQaStateId;
  phase: LibraryPhase;
  motionProgress: number;
  controller: {
    openProgress: number;
    pageTurnProgress: number;
    settlePage: boolean;
  };
  showReader: boolean;
}

const qaState = (
  id: TutorLibraryQaStateId,
  phase: LibraryPhase,
  motionProgress: number,
  openProgress = 0,
  pageTurnProgress = 0,
  settlePage = false,
  showReader = !['shelf-rest', 'shelf-restored', 'hover-intent', 'extract-50'].includes(id),
): TutorLibraryQaState => Object.freeze({
  id,
  phase,
  motionProgress,
  controller: Object.freeze({ openProgress, pageTurnProgress, settlePage }),
  showReader,
});

const QA_STATE_BY_ID = new Map<TutorLibraryQaStateId, TutorLibraryQaState>([
  ['shelf-rest', qaState('shelf-rest', 'ROOM_IDLE', 0)],
  ['hover-intent', qaState('hover-intent', 'BOOK_HOVER_INTENT', 0)],
  ['extract-50', qaState('extract-50', 'BOOK_EXTRACTING', .5)],
  ['cover-preview', qaState('cover-preview', 'BOOK_PREVIEW', 1)],
  ['open-50', qaState('open-50', 'BOOK_OPENING', 1, .5)],
  ['reading-open', qaState('reading-open', 'BOOK_READING', 1, 1)],
  ['page-25', qaState('page-25', 'PAGE_TURNING', 1, 1, .25)],
  ['page-50', qaState('page-50', 'PAGE_TURNING', 1, 1, .5)],
  ['page-75', qaState('page-75', 'PAGE_TURNING', 1, 1, .75)],
  ['page-settled', qaState('page-settled', 'PAGE_SETTLED', 1, 1, 0, true)],
  ['close-50', qaState('close-50', 'BOOK_CLOSING', 1, .5)],
  ['return-50', qaState('return-50', 'BOOK_RETURNING', .5)],
  ['shelf-restored', qaState('shelf-restored', 'ROOM_IDLE', 0)],
]);

export function selectTutorLibraryQaState(value: string | null): TutorLibraryQaState | undefined {
  return value && TUTOR_LIBRARY_QA_STATES.includes(value as TutorLibraryQaStateId)
    ? QA_STATE_BY_ID.get(value as TutorLibraryQaStateId)
    : undefined;
}

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
      targetHeight: 2.2,
      fov: 60,
      lateralTargetOffset: -.68,
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
    cameraRadius: laptop ? 3.45 : 3.25,
    targetRadius: 3.5,
    cameraHeight: 2.45,
    targetHeight: laptop ? 2.88 : 2.96,
    fov: laptop ? 40 : 38,
    lateralTargetOffset: 0,
    maxDpr,
  };
}

const clampProgress = (progress: number) => Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;

/** Normalized progress from the controller that owns the physical cover/page/reset motion. */
export function getControllerDiagnosticProgress(
  phase: LibraryPhase,
  snapshot: ControllerRuntimeSnapshot,
): number | undefined {
  if (phase === 'BOOK_OPENING') return clampProgress(snapshot.openProgress);
  if (phase === 'PAGE_TURNING') return snapshot.pageSettled ? 1 : clampProgress(snapshot.pageTurnProgress);
  if (phase === 'BOOK_CLOSING') return 1 - clampProgress(snapshot.openProgress);
  if (phase === 'BOOK_RESETTING') {
    const coverReset = 1 - clampProgress(snapshot.openProgress);
    const pageReset = 1 - clampProgress(snapshot.pageTurnProgress);
    const settledPagesReset = snapshot.settledPages === 0 ? 1 : 0;
    const deformationReset = snapshot.deformationReset ? 1 : 0;
    return (coverReset + pageReset + settledPagesReset + deformationReset) / 4;
  }
  return undefined;
}

export function getTutorLibraryAccessibilityProps(bookActive: boolean, tutorName?: string) {
  return bookActive ? {
    rootLabel: `${tutorName ?? 'Selected tutor'} tutor library reader`,
    rootLabelledBy: undefined,
    copyAriaHidden: true,
  } : {
    rootLabel: undefined,
    rootLabelledBy: 'tutor-library-title',
    copyAriaHidden: false,
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
  controllerProgress?: number;
  controllerSnapshot?: ControllerRuntimeSnapshot;
}) {
  const root = canvas.closest<HTMLElement>('[data-tutor-library-qa="root"]');
  if (!root) return;
  root.dataset.libraryRootUuid = input.rootUuid;
  root.dataset.libraryMatrixDelta = input.matrixDelta === undefined ? 'unavailable' : input.matrixDelta.toFixed(6);
  if (input.resetState) root.dataset.libraryResetState = input.resetState;
  if (input.controllerSnapshot) {
    root.dataset.libraryOpenProgress = input.controllerSnapshot.openProgress.toFixed(6);
    root.dataset.libraryPageTurnProgress = input.controllerSnapshot.pageTurnProgress.toFixed(6);
    root.dataset.librarySettledPages = String(input.controllerSnapshot.settledPages);
    root.dataset.libraryDeformationReset = String(input.controllerSnapshot.deformationReset);
  }
  if (input.controllerProgress !== undefined) {
    const progress = clampProgress(input.controllerProgress).toFixed(3);
    root.dataset.libraryControllerProgress = progress;
    root.dataset.libraryQaProgress = progress;
  }
}
