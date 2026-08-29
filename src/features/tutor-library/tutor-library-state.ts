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

type Completion = { generation: number };

export type LibraryEvent =
  | { type: 'TURN'; wallId: string }
  | ({ type: 'TURN_COMPLETE' } & Completion)
  | { type: 'HOVER'; editionId: string; rootUuid?: string }
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
