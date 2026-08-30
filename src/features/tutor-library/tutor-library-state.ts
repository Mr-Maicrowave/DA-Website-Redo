import {
  isControllerSnapshotReadyForReturn,
  type CompleteShelfControllerSnapshot,
} from './tutor-book-lifecycle.ts';

export type LibraryPhase =
  | 'ROOM_IDLE'
  | 'ROOM_TURNING'
  | 'BOOK_HOVER_INTENT'
  | 'BOOK_EXTRACTING'
  | 'BOOK_PREVIEW'
  | 'BOOK_TO_READING'
  | 'BOOK_OPENING'
  | 'BOOK_READING'
  | 'PAGE_DRAGGING'
  | 'PAGE_TURNING'
  | 'PAGE_SETTLED'
  | 'BOOK_CLOSING'
  | 'BOOK_RESETTING'
  | 'BOOK_RETURNING';

export type ControllerResetSnapshot = CompleteShelfControllerSnapshot;

export interface LibraryState {
  phase: LibraryPhase;
  activeWallId: string;
  transitionGeneration: number;
  pendingWallId?: string;
  selectedEditionId?: string;
  expectedRootUuid?: string;
  openRequested?: boolean;
}

export type BookInteractionInput = 'pointer-preview' | 'touch-activate' | 'keyboard-activate';

export interface PendingRigIntent {
  readonly editionId: string;
  readonly input: BookInteractionInput;
  readonly token: number;
}

export interface PendingRigIntentTracker {
  begin(editionId: string, input: BookInteractionInput): PendingRigIntent;
  cancel(editionId?: string): void;
  consumeReady(editionId: string, token: number): PendingRigIntent | undefined;
  current(): PendingRigIntent | undefined;
}

export function createPendingRigIntentTracker(): PendingRigIntentTracker {
  let nextToken = 0;
  let pending: PendingRigIntent | undefined;
  return {
    begin(editionId, input) {
      pending = Object.freeze({ editionId, input, token: ++nextToken });
      return pending;
    },
    cancel(editionId) {
      if (editionId === undefined || pending?.editionId === editionId) {
        nextToken += 1;
        pending = undefined;
      }
    },
    consumeReady(editionId, token) {
      if (!pending || pending.editionId !== editionId || pending.token !== token) return undefined;
      const accepted = pending;
      pending = undefined;
      return accepted;
    },
    current() {
      return pending;
    },
  };
}

export interface LibraryControlAvailability {
  canOpen: boolean;
  canTurnPage: boolean;
  canClose: boolean;
  canTurnRoom: boolean;
}

export interface ControllerRuntimeSnapshot {
  rootUuid: string;
  openProgress: number;
  pageTurnProgress: number;
  settledPages: number;
  pagePivotCount: number;
  pageSettled: boolean;
  deformationReset: boolean;
}

type Completion = { generation: number };

export type LibraryEvent =
  | { type: 'TURN'; wallId: string }
  | ({ type: 'TURN_COMPLETE' } & Completion)
  | { type: 'HOVER'; editionId: string; rootUuid: string }
  | ({ type: 'HOVER_INTENT_COMPLETE' } & Completion)
  | ({ type: 'EXTRACT' } & Completion)
  | ({ type: 'PREVIEW_READY' } & Completion)
  | { type: 'LEAVE' }
  | { type: 'OPEN' }
  | ({ type: 'READING_POSE_READY' } & Completion)
  | ({ type: 'OPEN_COMPLETE' } & Completion)
  | { type: 'PAGE_DRAG_START' }
  | { type: 'PAGE_DRAG_CANCEL' }
  | { type: 'PAGE_TURN' }
  | ({ type: 'PAGE_TURN_COMPLETE' } & Completion)
  | { type: 'CLOSE' }
  | ({ type: 'CLOSE_COMPLETE' } & Completion)
  | ({ type: 'RESET_COMPLETE'; controller: ControllerResetSnapshot } & Completion)
  | ({ type: 'RETURN_COMPLETE' } & Completion)
  | { type: 'ESCAPE' }
  | { type: 'RESIZE' }
  | { type: 'VISIBILITY_RESUME' };

export const createLibraryState = (activeWallId: string): LibraryState => ({
  phase: 'ROOM_IDLE',
  activeWallId,
  transitionGeneration: 0,
});

export function getBookInteractionEvents(
  state: LibraryState,
  input: BookInteractionInput,
  editionId: string,
  rootUuid: string,
): LibraryEvent[] {
  if (!editionId.trim() || !rootUuid.trim()) return [];
  const maySelect = state.phase === 'ROOM_IDLE' || state.phase === 'BOOK_HOVER_INTENT';
  const isCurrent = state.selectedEditionId === editionId && state.expectedRootUuid === rootUuid;
  const mayActivateCurrent = isCurrent && (
    state.phase === 'BOOK_HOVER_INTENT'
    || state.phase === 'BOOK_EXTRACTING'
    || state.phase === 'BOOK_PREVIEW'
  );

  if (input === 'pointer-preview') {
    return maySelect && !isCurrent ? [{ type: 'HOVER', editionId, rootUuid }] : [];
  }
  if (!maySelect && !mayActivateCurrent) return [];

  if (!isCurrent) return [{ type: 'HOVER', editionId, rootUuid }];
  return [{ type: 'OPEN' }];
}

export const isBookControlDisabled = (state: LibraryState, editionId: string) => {
  if (state.phase === 'ROOM_IDLE' || state.phase === 'BOOK_HOVER_INTENT') return false;
  if (state.selectedEditionId !== editionId) return true;
  return state.phase !== 'BOOK_EXTRACTING' && state.phase !== 'BOOK_PREVIEW';
};

export function getLibraryControlAvailability(state: LibraryState): LibraryControlAvailability {
  return {
    canOpen: state.phase === 'BOOK_HOVER_INTENT' || state.phase === 'BOOK_EXTRACTING' || state.phase === 'BOOK_PREVIEW',
    canTurnPage: state.phase === 'BOOK_READING' || state.phase === 'PAGE_SETTLED',
    canClose: state.phase === 'BOOK_HOVER_INTENT'
      || state.phase === 'BOOK_EXTRACTING'
      || state.phase === 'BOOK_PREVIEW'
      || state.phase === 'BOOK_TO_READING'
      || state.phase === 'BOOK_OPENING'
      || state.phase === 'BOOK_READING'
      || state.phase === 'PAGE_DRAGGING'
      || state.phase === 'PAGE_TURNING'
      || state.phase === 'PAGE_SETTLED',
    canTurnRoom: state.phase === 'ROOM_IDLE',
  };
}

export const getFocusReturnEditionId = (previous: LibraryState, current: LibraryState) =>
  previous.phase === 'BOOK_RETURNING' && current.phase === 'ROOM_IDLE'
    ? previous.selectedEditionId
    : undefined;

export const shouldPreviewBookOnFocus = (restoringFocus: boolean) => !restoringFocus;

export function getLibraryLiveStatus(state: LibraryState, tutorName: string | undefined, wallLabel: string) {
  const name = tutorName ?? 'Tutor book';
  switch (state.phase) {
    case 'ROOM_TURNING': return `Turning toward ${wallLabel}.`;
    case 'BOOK_HOVER_INTENT': return `Preparing ${name}'s tutor book.`;
    case 'BOOK_EXTRACTING': return `Bringing ${name}'s tutor book forward.`;
    case 'BOOK_PREVIEW': return `${name}'s tutor book is ready to open.`;
    case 'BOOK_TO_READING': return `Positioning ${name}'s tutor book for reading.`;
    case 'BOOK_OPENING': return `Opening ${name}'s tutor book.`;
    case 'BOOK_READING': return `${name}'s tutor book is open for reading.`;
    case 'PAGE_DRAGGING': return `Turning a page in ${name}'s tutor book.`;
    case 'PAGE_TURNING': return `Turning a page in ${name}'s tutor book.`;
    case 'PAGE_SETTLED': return `Page turned in ${name}'s tutor book.`;
    case 'BOOK_CLOSING': return `Closing ${name}'s tutor book.`;
    case 'BOOK_RESETTING': return `Resetting ${name}'s tutor book.`;
    case 'BOOK_RETURNING': return `Returning ${name}'s tutor book to the ${wallLabel} shelf.`;
    default: return `The ${wallLabel} shelf is ready. Choose a tutor book.`;
  }
}

export function getControllerCompletionEvent(
  phase: LibraryPhase,
  generation: number,
  snapshot: ControllerRuntimeSnapshot,
): LibraryEvent | undefined {
  if (phase === 'BOOK_OPENING' && snapshot.openProgress >= .995) {
    return { type: 'OPEN_COMPLETE', generation };
  }
  if (phase === 'PAGE_TURNING' && snapshot.pageTurnProgress === 0 && snapshot.pageSettled) {
    return { type: 'PAGE_TURN_COMPLETE', generation };
  }
  if (phase === 'BOOK_CLOSING' && snapshot.openProgress <= .005) {
    return { type: 'CLOSE_COMPLETE', generation };
  }
  if (
    phase === 'BOOK_RESETTING'
    && snapshot.openProgress === 0
    && snapshot.pageTurnProgress === 0
    && snapshot.settledPages === 0
    && snapshot.deformationReset
  ) {
    return {
      type: 'RESET_COMPLETE',
      generation,
      controller: {
        rootUuid: snapshot.rootUuid,
        closeComplete: true,
        resetComplete: true,
        openProgress: snapshot.openProgress,
        pageTurnProgress: snapshot.pageTurnProgress,
        settledPages: snapshot.settledPages,
        deformationReset: snapshot.deformationReset,
      },
    };
  }
  return undefined;
}

const advance = (
  state: LibraryState,
  phase: LibraryPhase,
  changes: Partial<Omit<LibraryState, 'phase' | 'transitionGeneration'>> = {},
): LibraryState => ({
  ...state,
  ...changes,
  phase,
  transitionGeneration: state.transitionGeneration + 1,
});

const isCurrentCompletion = (state: LibraryState, event: Completion) =>
  event.generation === state.transitionGeneration;

const hasValidRootUuid = (event: { rootUuid?: unknown }) =>
  typeof event.rootUuid === 'string' && event.rootUuid.trim().length > 0;

export const isControllerResetForReturn = (
  expectedRootUuid: string | undefined,
  controller: ControllerResetSnapshot,
) => expectedRootUuid !== undefined
  && isControllerSnapshotReadyForReturn(expectedRootUuid, controller);

const RESET_DIRECTLY = new Set<LibraryPhase>([
  'BOOK_HOVER_INTENT',
  'BOOK_EXTRACTING',
  'BOOK_PREVIEW',
  'BOOK_TO_READING',
]);

const CLOSE_FIRST = new Set<LibraryPhase>([
  'BOOK_OPENING',
  'BOOK_READING',
  'PAGE_DRAGGING',
  'PAGE_TURNING',
  'PAGE_SETTLED',
]);

const RESTARTABLE_TRANSIENTS = new Set<LibraryPhase>([
  'ROOM_TURNING',
  'BOOK_HOVER_INTENT',
  'BOOK_EXTRACTING',
  'BOOK_TO_READING',
  'BOOK_OPENING',
  'PAGE_DRAGGING',
  'PAGE_TURNING',
  'BOOK_CLOSING',
  'BOOK_RESETTING',
  'BOOK_RETURNING',
]);

export function libraryReducer(state: LibraryState, event: LibraryEvent): LibraryState {
  if (event.type === 'HOVER' && !hasValidRootUuid(event)) return state;

  if (event.type === 'ESCAPE') {
    if (state.phase === 'ROOM_TURNING') {
      return advance(state, 'ROOM_IDLE', { pendingWallId: undefined });
    }
    if (RESET_DIRECTLY.has(state.phase)) {
      return advance(state, 'BOOK_RESETTING', { openRequested: undefined });
    }
    if (CLOSE_FIRST.has(state.phase)) {
      return advance(state, 'BOOK_CLOSING', { openRequested: undefined });
    }
    return state;
  }

  if (event.type === 'RESIZE' || event.type === 'VISIBILITY_RESUME') {
    return RESTARTABLE_TRANSIENTS.has(state.phase)
      ? { ...state, transitionGeneration: state.transitionGeneration + 1 }
      : state;
  }

  if (state.phase === 'ROOM_IDLE') {
    if (event.type === 'TURN' && event.wallId !== state.activeWallId) {
      return advance(state, 'ROOM_TURNING', { pendingWallId: event.wallId });
    }
    if (event.type === 'HOVER') {
      return advance(state, 'BOOK_HOVER_INTENT', {
        selectedEditionId: event.editionId,
        expectedRootUuid: event.rootUuid,
      });
    }
    return state;
  }

  if (state.phase === 'ROOM_TURNING') {
    if (event.type === 'TURN') {
      if (event.wallId === state.pendingWallId) return state;
      return advance(state, 'ROOM_TURNING', { pendingWallId: event.wallId });
    }
    if (event.type === 'TURN_COMPLETE' && isCurrentCompletion(state, event)) {
      return advance(state, 'ROOM_IDLE', {
        activeWallId: state.pendingWallId ?? state.activeWallId,
        pendingWallId: undefined,
      });
    }
    return state;
  }

  if (state.phase === 'BOOK_HOVER_INTENT') {
    if (event.type === 'HOVER') {
      if (event.editionId === state.selectedEditionId && event.rootUuid === state.expectedRootUuid) return state;
      return advance(state, 'BOOK_HOVER_INTENT', {
        selectedEditionId: event.editionId,
        expectedRootUuid: event.rootUuid,
      });
    }
    if ((event.type === 'HOVER_INTENT_COMPLETE' || event.type === 'EXTRACT') && isCurrentCompletion(state, event)) {
      return advance(state, 'BOOK_EXTRACTING');
    }
    if (event.type === 'OPEN') {
      return advance(state, 'BOOK_EXTRACTING', { openRequested: true });
    }
    if (event.type === 'LEAVE' || event.type === 'CLOSE') {
      return advance(state, 'BOOK_RESETTING', { openRequested: undefined });
    }
    return state;
  }

  if (state.phase === 'BOOK_EXTRACTING') {
    if (event.type === 'OPEN') {
      return state.openRequested ? state : { ...state, openRequested: true };
    }
    if (event.type === 'PREVIEW_READY' && isCurrentCompletion(state, event)) {
      return advance(state, state.openRequested ? 'BOOK_TO_READING' : 'BOOK_PREVIEW');
    }
    if (event.type === 'LEAVE' || event.type === 'CLOSE') {
      return advance(state, 'BOOK_RESETTING', { openRequested: undefined });
    }
    return state;
  }

  if (state.phase === 'BOOK_PREVIEW') {
    if (event.type === 'OPEN') return advance(state, 'BOOK_TO_READING', { openRequested: undefined });
    if (event.type === 'LEAVE' || event.type === 'CLOSE') {
      return advance(state, 'BOOK_RESETTING', { openRequested: undefined });
    }
    return state;
  }

  if (state.phase === 'BOOK_TO_READING') {
    if (event.type === 'READING_POSE_READY' && isCurrentCompletion(state, event)) {
      return advance(state, 'BOOK_OPENING', { openRequested: undefined });
    }
    if (event.type === 'CLOSE' || event.type === 'LEAVE') {
      return advance(state, 'BOOK_RESETTING', { openRequested: undefined });
    }
    return state;
  }

  if (state.phase === 'BOOK_OPENING') {
    if (event.type === 'OPEN_COMPLETE' && isCurrentCompletion(state, event)) {
      return advance(state, 'BOOK_READING');
    }
    if (event.type === 'CLOSE') return advance(state, 'BOOK_CLOSING');
    return state;
  }

  if (state.phase === 'BOOK_READING') {
    if (event.type === 'PAGE_DRAG_START') return advance(state, 'PAGE_DRAGGING');
    if (event.type === 'PAGE_TURN') return advance(state, 'PAGE_TURNING');
    if (event.type === 'CLOSE') return advance(state, 'BOOK_CLOSING');
    return state;
  }

  if (state.phase === 'PAGE_DRAGGING') {
    if (event.type === 'PAGE_DRAG_CANCEL') return advance(state, 'BOOK_READING');
    if (event.type === 'PAGE_TURN') return advance(state, 'PAGE_TURNING');
    if (event.type === 'CLOSE') return advance(state, 'BOOK_CLOSING');
    return state;
  }

  if (state.phase === 'PAGE_TURNING') {
    if (event.type === 'PAGE_TURN_COMPLETE' && isCurrentCompletion(state, event)) {
      return advance(state, 'PAGE_SETTLED');
    }
    if (event.type === 'CLOSE') return advance(state, 'BOOK_CLOSING');
    return state;
  }

  if (state.phase === 'PAGE_SETTLED') {
    if (event.type === 'PAGE_DRAG_START') return advance(state, 'PAGE_DRAGGING');
    if (event.type === 'PAGE_TURN') return advance(state, 'PAGE_TURNING');
    if (event.type === 'CLOSE') return advance(state, 'BOOK_CLOSING');
    return state;
  }

  if (state.phase === 'BOOK_CLOSING') {
    if (event.type === 'CLOSE_COMPLETE' && isCurrentCompletion(state, event)) {
      return advance(state, 'BOOK_RESETTING');
    }
    return state;
  }

  if (state.phase === 'BOOK_RESETTING') {
    if (
      event.type === 'RESET_COMPLETE'
      && isCurrentCompletion(state, event)
      && isControllerResetForReturn(state.expectedRootUuid, event.controller)
    ) {
      return advance(state, 'BOOK_RETURNING');
    }
    return state;
  }

  if (state.phase === 'BOOK_RETURNING') {
    if (event.type === 'RETURN_COMPLETE' && isCurrentCompletion(state, event)) {
      return {
        phase: 'ROOM_IDLE',
        activeWallId: state.activeWallId,
        transitionGeneration: state.transitionGeneration + 1,
      };
    }
    return state;
  }

  return state;
}
