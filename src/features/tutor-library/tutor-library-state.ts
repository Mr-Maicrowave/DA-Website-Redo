export type LibraryPhase =
  | 'ROOM_IDLE'
  | 'ROOM_TURNING'
  | 'BOOK_HOVER_INTENT'
  | 'BOOK_EXTRACTING'
  | 'BOOK_PREVIEW'
  | 'BOOK_OPENING'
  | 'BOOK_READING'
  | 'PAGE_DRAGGING'
  | 'PAGE_TURNING'
  | 'BOOK_CLOSING'
  | 'BOOK_RETURNING';

export interface LibraryState {
  phase: LibraryPhase;
  activeWallId: string;
  pendingWallId?: string;
  selectedEditionId?: string;
}

export type LibraryEvent =
  | { type: 'TURN'; wallId: string }
  | { type: 'TURN_COMPLETE' }
  | { type: 'HOVER'; editionId: string }
  | { type: 'EXTRACT' }
  | { type: 'PREVIEW_READY' }
  | { type: 'LEAVE' }
  | { type: 'OPEN' }
  | { type: 'OPEN_COMPLETE' }
  | { type: 'CLOSE' }
  | { type: 'RETURN_COMPLETE' };

export const createLibraryState = (activeWallId: string): LibraryState => ({
  phase: 'ROOM_IDLE',
  activeWallId,
});

export function libraryReducer(state: LibraryState, event: LibraryEvent): LibraryState {
  if (state.phase === 'ROOM_IDLE' && event.type === 'TURN' && event.wallId !== state.activeWallId) {
    return { ...state, phase: 'ROOM_TURNING', pendingWallId: event.wallId };
  }
  if (state.phase === 'ROOM_TURNING' && event.type === 'TURN_COMPLETE') {
    return { phase: 'ROOM_IDLE', activeWallId: state.pendingWallId ?? state.activeWallId };
  }
  if (state.phase === 'ROOM_IDLE' && event.type === 'HOVER') {
    return { ...state, phase: 'BOOK_HOVER_INTENT', selectedEditionId: event.editionId };
  }
  if (state.phase === 'BOOK_HOVER_INTENT' && event.type === 'EXTRACT') return { ...state, phase: 'BOOK_EXTRACTING' };
  if (state.phase === 'BOOK_EXTRACTING' && event.type === 'PREVIEW_READY') return { ...state, phase: 'BOOK_PREVIEW' };
  if ((state.phase === 'BOOK_HOVER_INTENT' || state.phase === 'BOOK_EXTRACTING' || state.phase === 'BOOK_PREVIEW') && event.type === 'LEAVE') return { ...state, phase: 'BOOK_RETURNING' };
  if (state.phase === 'BOOK_PREVIEW' && event.type === 'OPEN') return { ...state, phase: 'BOOK_OPENING' };
  if (state.phase === 'BOOK_OPENING' && event.type === 'OPEN_COMPLETE') return { ...state, phase: 'BOOK_READING' };
  if ((state.phase === 'BOOK_PREVIEW' || state.phase === 'BOOK_READING') && event.type === 'CLOSE') return { ...state, phase: 'BOOK_CLOSING' };
  if ((state.phase === 'BOOK_CLOSING' || state.phase === 'BOOK_RETURNING') && event.type === 'RETURN_COMPLETE') return { phase: 'ROOM_IDLE', activeWallId: state.activeWallId };
  return state;
}
