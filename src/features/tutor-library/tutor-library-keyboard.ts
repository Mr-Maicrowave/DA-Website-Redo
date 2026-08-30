import type { LibraryPhase } from './tutor-library-state.ts';

export type TutorLibraryKeyboardAction = 'previous-wall' | 'next-wall' | 'return-book' | 'open-book' | 'previous-spread' | 'next-spread';

export function getTutorLibraryKeyboardAction(key: string, phase: LibraryPhase, inputFocused: boolean, settledPages = 0): TutorLibraryKeyboardAction | undefined {
  if (inputFocused) return undefined;
  if (phase === 'ROOM_IDLE') return key === 'ArrowLeft' ? 'previous-wall' : key === 'ArrowRight' ? 'next-wall' : undefined;
  if (phase === 'BOOK_PREVIEW') return key === 'ArrowLeft' ? 'return-book' : key === 'ArrowRight' ? 'open-book' : undefined;
  if (phase === 'BOOK_READING' || phase === 'PAGE_SETTLED') {
    if (key === 'ArrowLeft' && settledPages > 0) return 'previous-spread';
    if (key === 'ArrowRight' && settledPages === 0) return 'next-spread';
  }
  return undefined;
}
