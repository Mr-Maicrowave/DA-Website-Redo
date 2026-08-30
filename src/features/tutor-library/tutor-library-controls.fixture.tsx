import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { TUTORS } from '../../data/teacherCatalogue';
import { selectVisibleShelfEditions } from './complete-shelf-book-pool';
import { TutorLibraryControlSurface } from './TutorLibraryControls';
import { createTutorBookEditions, SUBJECT_WALLS } from './tutor-library-data';
import { getTutorLibraryAccessibilityProps } from './tutor-library-debug';
import { createLibraryState, getLibraryControlAvailability, type LibraryPhase } from './tutor-library-state';
import { getTutorBookPageTarget, type TutorBookPageTurnDirection } from './tutor-book-pages';
import '../../index.css';
import './tutor-library.css';

declare global {
  interface Window {
    tutorLibraryFixture: {
      events: string[];
      setFailure(failed: boolean): Promise<void>;
      setFocusReturn(editionId?: string): Promise<void>;
      setPhase(phase: LibraryPhase): Promise<void>;
      setPage(page: number): Promise<void>;
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
let setPageState: (page: number) => void;

function Fixture() {
  const [sceneError, setSceneError] = useState<string>();
  const [focusReturnEditionId, setFocusReturnEditionId] = useState<string>();
  const [phase, setPhase] = useState<LibraryPhase>('ROOM_IDLE');
  const [settledPages, setSettledPages] = useState(0);
  setFailureState = failed => setSceneError(failed ? 'Canvas unavailable' : undefined);
  setFocusReturnState = setFocusReturnEditionId;
  setPhaseState = setPhase;
  setPageState = setSettledPages;
  const library = {
    ...createLibraryState(primaryWall.id),
    phase,
    selectedEditionId: phase === 'ROOM_IDLE' ? undefined : 'T003:primary',
  };
  const selectedTutor = phase === 'ROOM_IDLE' ? undefined : tutors.get('T003');
  const accessibility = getTutorLibraryAccessibilityProps(phase !== 'ROOM_IDLE', selectedTutor?.name);

  return <MemoryRouter><section className={`tutor-library${phase === 'ROOM_IDLE' ? '' : ' tutor-library--book-active'}`} aria-label={accessibility.rootLabel} aria-labelledby={accessibility.rootLabelledBy}>
    <header className="tutor-library__copy" aria-hidden={accessibility.copyAriaHidden}>
      <p>DA Tuition faculty</p><h1 id="tutor-library-title">Find the person behind the teaching.</h1><span>Turn toward a subject and explore the educators who bring it to life.</span>
    </header>
    <TutorLibraryControlSurface
    library={library}
    activeWall={primaryWall}
    selectedTutor={selectedTutor}
    fallbackTutor={tutors.get('T003')!}
    availability={getLibraryControlAvailability(library)}
    status="Fixture status"
    sceneError={sceneError}
    focusReturnEditionId={focusReturnEditionId}
    settledPages={settledPages}
    pageCount={2}
    spotlightQuery=""
    spotlightResultCount={0}
    spotlightOffset={0}
    spotlightPageCount={1}
    spotlightActive={false}
    onSpotlightQueryChange={() => undefined}
    onSpotlightOffsetChange={() => undefined}
    onTurn={wallId => events.push(`turn:${wallId}`)}
    onCancelPending={editionId => events.push(`cancel:${editionId ?? 'all'}`)}
    onEscape={() => events.push('escape')}
    onOpen={() => events.push('open')}
    onPageTurn={(direction: TutorBookPageTurnDirection) => {
      const target = getTutorBookPageTarget(settledPages, direction);
      if (target === undefined) return;
      events.push(`page:${direction}`);
      setSettledPages(target);
    }}
    onClose={() => events.push('close')}
  /></section></MemoryRouter>;
}

await act(async () => { createRoot(document.getElementById('root')!).render(<Fixture />); });
window.tutorLibraryFixture = {
  events,
  async setFailure(failed) { await act(async () => setFailureState(failed)); },
  async setFocusReturn(editionId) { await act(async () => setFocusReturnState(editionId)); },
  async setPhase(nextPhase) { await act(async () => setPhaseState(nextPhase)); },
  async setPage(page) { await act(async () => setPageState(page)); },
};
