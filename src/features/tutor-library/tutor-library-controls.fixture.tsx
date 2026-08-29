import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { TUTORS } from '../../data/teacherCatalogue';
import { selectVisibleShelfEditions } from './complete-shelf-book-pool';
import { TutorLibraryControlSurface } from './TutorLibraryControls';
import { createTutorBookEditions, SUBJECT_WALLS } from './tutor-library-data';
import { createLibraryState, getLibraryControlAvailability, type LibraryPhase } from './tutor-library-state';

declare global {
  interface Window {
    tutorLibraryFixture: {
      events: string[];
      setFailure(failed: boolean): Promise<void>;
      setFocusReturn(editionId?: string): Promise<void>;
      setPhase(phase: LibraryPhase): Promise<void>;
    };
    IS_REACT_ACT_ENVIRONMENT: boolean;
  }
}

window.IS_REACT_ACT_ENVIRONMENT = true;
const events: string[] = [];
const editions = createTutorBookEditions(TUTORS);
const primaryWall = SUBJECT_WALLS[0];
const primaryEditions = selectVisibleShelfEditions(editions.filter(edition => edition.wallId === primaryWall.id));
const tutors = new Map(TUTORS.map(tutor => [tutor.id, tutor]));
let setFailureState: (failed: boolean) => void;
let setFocusReturnState: (editionId?: string) => void;
let setPhaseState: (phase: LibraryPhase) => void;

function Fixture() {
  const [sceneError, setSceneError] = useState<string>();
  const [focusReturnEditionId, setFocusReturnEditionId] = useState<string>();
  const [phase, setPhase] = useState<LibraryPhase>('ROOM_IDLE');
  setFailureState = failed => setSceneError(failed ? 'Canvas unavailable' : undefined);
  setFocusReturnState = setFocusReturnEditionId;
  setPhaseState = setPhase;
  const library = {
    ...createLibraryState(primaryWall.id),
    phase,
    selectedEditionId: phase === 'ROOM_IDLE' ? undefined : 'T003:primary',
  };

  return <MemoryRouter><TutorLibraryControlSurface
    library={library}
    activeWall={primaryWall}
    visibleEditions={primaryEditions}
    tutors={tutors}
    selectedTutor={phase === 'ROOM_IDLE' ? undefined : tutors.get('T003')}
    fallbackTutor={tutors.get('T003')!}
    availability={getLibraryControlAvailability(library)}
    status="Fixture status"
    sceneError={sceneError}
    focusReturnEditionId={focusReturnEditionId}
    onTurn={wallId => events.push(`turn:${wallId}`)}
    onBookInteraction={(editionId, input) => events.push(`book:${editionId}:${input}`)}
    onCancelPending={editionId => events.push(`cancel:${editionId ?? 'all'}`)}
    onEscape={() => events.push('escape')}
    onOpen={() => events.push('open')}
    onPageTurn={() => events.push('page')}
    onClose={() => events.push('close')}
  /></MemoryRouter>;
}

await act(async () => { createRoot(document.getElementById('root')!).render(<Fixture />); });
window.tutorLibraryFixture = {
  events,
  async setFailure(failed) { await act(async () => setFailureState(failed)); },
  async setFocusReturn(editionId) { await act(async () => setFocusReturnState(editionId)); },
  async setPhase(nextPhase) { await act(async () => setPhaseState(nextPhase)); },
};
