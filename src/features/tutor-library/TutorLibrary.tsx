import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { Component, useEffect, useMemo, useReducer, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TUTORS } from '../../data/teacherCatalogue';
import { createMountedRigRootRegistry, selectVisibleShelfEditions } from './complete-shelf-book-pool';
import { createBookMotionTimingPolicy } from './tutor-book-motion';
import { createTutorLibraryQaSnapshot, getTutorLibraryAccessibilityProps, getTutorLibraryViewportProfile, parseDebugTurnProgress, selectTutorLibraryQaState } from './tutor-library-debug';
import { createTutorBookEditions, SUBJECT_WALLS } from './tutor-library-data';
import {
  createLibraryState,
  createPendingRigIntentTracker,
  getBookInteractionEvents,
  getFocusReturnEditionId,
  getLibraryControlAvailability,
  getLibraryLiveStatus,
  libraryReducer,
  type BookInteractionInput,
  type LibraryEvent,
  type LibraryState,
  type PendingRigIntent,
} from './tutor-library-state';
import { TutorLibraryScene } from './TutorLibraryScene';
import { TutorLibraryControlSurface } from './TutorLibraryControls';
import {
  TUTOR_BOOK_READING_STATE_COUNT,
  getTutorBookPageTarget,
  type TutorBookPageTurnDirection,
} from './tutor-book-pages';
import './tutor-library.css';

const BOOK_EDITIONS = createTutorBookEditions(TUTORS);
const TUTOR_BY_ID = new Map(TUTORS.map(tutor => [tutor.id, tutor]));
const FALLBACK_TUTOR = TUTORS.find(tutor => tutor.id === 'T003')!;

class CanvasBoundary extends Component<{ children: ReactNode; onError(message: string): void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Tutor Library Canvas failed', error, info);
    this.props.onError(error.message);
  }
  render() { return this.state.failed ? null : this.props.children; }
}

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reducedMotion;
}

export function TutorLibrary() {
  const [searchParams] = useSearchParams();
  const [library, dispatch] = useReducer(libraryReducer, 'primary', createLibraryState);
  const [settledPages, setSettledPages] = useState(0);
  const [pageTurnDirection, setPageTurnDirection] = useState<TutorBookPageTurnDirection>(1);
  const [rigIntent, setRigIntent] = useState<PendingRigIntent>();
  const [sceneError, setSceneError] = useState<string | undefined>(() => searchParams.get('libraryForceCanvasError') === '1' ? 'Forced Tutor Library Canvas failure' : undefined);
  const [roomReady, setRoomReady] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === 'undefined' ? 1440 : window.innerWidth,
    height: typeof window === 'undefined' ? 900 : window.innerHeight,
  }));
  const reducedMotion = useReducedMotionPreference();
  useEffect(() => {
    if (roomReady || sceneError) {
      setLoadingVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setLoadingVisible(true), 180);
    return () => window.clearTimeout(timer);
  }, [roomReady, sceneError]);
  const timing = useMemo(() => createBookMotionTimingPolicy(reducedMotion), [reducedMotion]);
  const mountedRoots = useRef(createMountedRigRootRegistry());
  const pendingIntent = useRef(createPendingRigIntentTracker());
  const previousLibrary = useRef(library);
  const motionProgress = useRef({ turn: 0, book: 0 });
  const debugTurnProgress = parseDebugTurnProgress(searchParams.get('libraryTurnProgress'));
  const debugBookProgress = parseDebugTurnProgress(searchParams.get('libraryBookProgress'));
  const qaState = selectTutorLibraryQaState(searchParams.get('libraryQaState'));
  const isDebugTurn = debugTurnProgress !== undefined;
  const isDebugBook = debugBookProgress !== undefined;
  const debugEditionId = BOOK_EDITIONS.find(edition => edition.wallId === 'primary')?.id;
  const isTurning = library.phase === 'ROOM_TURNING';
  const activeWallIndex = isDebugTurn ? 0 : Math.max(0, SUBJECT_WALLS.findIndex(wall => wall.id === library.activeWallId));
  const pendingWallIndex = Math.max(0, SUBJECT_WALLS.findIndex(wall => wall.id === library.pendingWallId));
  const targetWallIndex = isDebugTurn ? 1 : isTurning ? pendingWallIndex : activeWallIndex;
  const sceneBookPhase = qaState?.phase ?? (isDebugBook ? (debugBookProgress === 0 ? 'BOOK_HOVER_INTENT' : debugBookProgress === 1 ? 'BOOK_PREVIEW' : 'BOOK_EXTRACTING') : library.phase);
  const sceneSelectedEditionId = qaState || isDebugBook ? debugEditionId : library.selectedEditionId;
  const checkpointView = searchParams.get('checkpoint') === 'b';
  const reviewView = searchParams.get('libraryReviewView');
  const forceCanvasFailure = searchParams.get('libraryForceCanvasError') === '1';
  const activeWall = SUBJECT_WALLS[activeWallIndex];
  const targetWall = SUBJECT_WALLS[targetWallIndex];
  const selectedEdition = BOOK_EDITIONS.find(edition => edition.id === (qaState?.showReader ? sceneSelectedEditionId : library.selectedEditionId));
  const selectedTutor = selectedEdition ? TUTOR_BY_ID.get(selectedEdition.tutorId) : undefined;
  const controlLibrary: LibraryState = qaState?.showReader && sceneSelectedEditionId ? {
    ...library,
    phase: sceneBookPhase,
    selectedEditionId: sceneSelectedEditionId,
    expectedRootUuid: library.expectedRootUuid ?? 'qa-pending-root',
  } : library;
  const visibleEditions = selectVisibleShelfEditions(BOOK_EDITIONS.filter(edition => edition.wallId === activeWall.id), sceneSelectedEditionId);
  const availability = getLibraryControlAvailability(controlLibrary);
  const focusReturnEditionId = getFocusReturnEditionId(previousLibrary.current, library);

  const dispatchEvents = (events: readonly LibraryEvent[]) => events.forEach(dispatch);
  const cancelPendingIntent = (editionId?: string) => {
    const pending = pendingIntent.current.current();
    pendingIntent.current.cancel(editionId);
    if (pending && (editionId === undefined || pending.editionId === editionId)) setRigIntent(undefined);
  };
  const interactWithBook = (editionId: string, input: BookInteractionInput) => {
    const rootUuid = mountedRoots.current.get(editionId);
    if (rootUuid) {
      pendingIntent.current.cancel();
      dispatchEvents(getBookInteractionEvents(library, input, editionId, rootUuid));
      return;
    }
    const intent = pendingIntent.current.begin(editionId, input);
    setRigIntent(intent);
  };

  useEffect(() => {
    previousLibrary.current = library;
    if (library.phase === 'ROOM_IDLE' && !library.selectedEditionId && !pendingIntent.current.current()) setRigIntent(undefined);
  }, [library]);

  useEffect(() => {
    if (library.phase === 'ROOM_IDLE' || library.phase === 'BOOK_OPENING' || library.phase === 'BOOK_CLOSING' || library.phase === 'BOOK_RESETTING') {
      setSettledPages(0);
      setPageTurnDirection(1);
    }
  }, [library.phase]);

  useEffect(() => {
    let resizeFrame = 0;
    const resize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        setViewport({ width: window.innerWidth, height: window.innerHeight });
        dispatch({ type: 'RESIZE' });
      });
    };
    const visibility = () => { if (document.visibilityState === 'visible') dispatch({ type: 'VISIBILITY_RESUME' }); };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);


  const handleRigReady = (editionId: string, rootUuid: string, token: number) => {
    mountedRoots.current.mount(editionId, rootUuid);
    const pending = pendingIntent.current.consumeReady(editionId, token);
    if (!pending) return;
    dispatchEvents(getBookInteractionEvents(library, pending.input, editionId, rootUuid));
  };

  const handleRigUnavailable = (editionId: string, rootUuid: string) => {
    mountedRoots.current.unmount(editionId, rootUuid);
  };

  const handlePageTurn = (direction: TutorBookPageTurnDirection) => {
    if (!availability.canTurnPage || getTutorBookPageTarget(settledPages, direction) === undefined) return;
    setPageTurnDirection(direction);
    dispatch({ type: 'PAGE_TURN' });
  };

  const fallbackTutor = selectedTutor ?? FALLBACK_TUTOR;
  const status = getLibraryLiveStatus(library, selectedTutor?.name, targetWall.label);
  const liveProgress = isTurning ? motionProgress.current.turn : motionProgress.current.book;
  const qaProgress = isDebugTurn ? debugTurnProgress!
    : sceneBookPhase.startsWith('BOOK_') || sceneBookPhase.startsWith('PAGE_') || isTurning ? liveProgress : 0;
  const qa = createTutorLibraryQaSnapshot({
    phase: sceneBookPhase,
    generation: library.transitionGeneration,
    editionId: sceneSelectedEditionId,
    wallId: targetWall.id,
    reviewView: qaState?.id ?? reviewView,
    progress: qaProgress,
  });
  const viewportProfile = getTutorLibraryViewportProfile(viewport.width, viewport.height, sceneBookPhase);
  const bookActive = sceneBookPhase.startsWith('BOOK_') || sceneBookPhase.startsWith('PAGE_');
  const accessibility = getTutorLibraryAccessibilityProps(bookActive, selectedTutor?.name);

  return <section className={`tutor-library${isDebugTurn || isDebugBook || qaState ? ' tutor-library--diagnostic' : ''}${bookActive ? ' tutor-library--book-active' : ''}`} aria-label={accessibility.rootLabel} aria-labelledby={accessibility.rootLabelledBy} data-tutor-library-qa="root" data-library-phase={qa.phase} data-library-transition-id={qa.transitionId} data-library-generation={qa.generation} data-library-edition={qa.edition} data-library-wall={qa.wall} data-library-root-uuid={qa.rootUuid} data-library-matrix-delta={qa.matrixDelta} data-library-reset-state={qa.resetState} data-library-review-view={qa.reviewView} data-library-review-progress={qa.progress} data-library-qa-progress={qa.progress} data-library-controller-progress="unavailable" data-library-qa-state={qaState?.id ?? 'live'} data-room-phase={sceneBookPhase} data-turn-progress={liveProgress.toFixed(2)} data-reduced-motion={reducedMotion ? 'true' : 'false'}>
    {loadingVisible && !roomReady && !sceneError ? <div className="tutor-library__loading" role="status" aria-live="polite">
      <div className="tutor-library__loading-card">
        <p>DA Tuition faculty</p>
        <h2>The tutor library is opening</h2>
        <div className="tutor-library__loading-shelf" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i />
        </div>
        <span>Preparing the reading room</span>
      </div>
    </div> : null}
    <header className={`tutor-library__copy${checkpointView || isDebugTurn ? ' tutor-library__copy--checkpoint' : ''}`} aria-hidden={accessibility.copyAriaHidden}>
      <p>DA Tuition faculty</p><h1 id="tutor-library-title">Find the person behind the teaching.</h1><span>Turn toward a subject and explore the educators who bring it to life.</span>
    </header>
    <div className="tutor-library__canvas" aria-hidden="true"><CanvasBoundary onError={(message) => { cancelPendingIntent(); setSceneError(message); }}>
      {forceCanvasFailure ? null : <Canvas shadows="soft" camera={{ position: [0, 1.9, .2], fov: 52, near: .1, far: 60 }} dpr={[1, viewportProfile.maxDpr]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.06 }}>
        <TutorLibraryScene fromWallIndex={activeWallIndex} toWallIndex={targetWallIndex} motionProgress={motionProgress} debugTurnProgress={isDebugTurn ? debugTurnProgress : undefined} debugBookProgress={qaState?.motionProgress ?? (isDebugBook ? debugBookProgress : undefined)} timing={timing} reviewView={reviewView} showWallLabels={!isDebugTurn && !isDebugBook} phase={sceneBookPhase} generation={library.transitionGeneration} reducedMotion={reducedMotion} pageTurnDirection={pageTurnDirection} selectedEditionId={sceneSelectedEditionId} rigIntentEditionId={rigIntent?.editionId} rigIntentToken={rigIntent?.token ?? 0} onRoomReady={() => setRoomReady(true)} onActivate={(editionId, rootUuid) => dispatchEvents(getBookInteractionEvents(library, 'touch-activate', editionId, rootUuid))} onRigReady={handleRigReady} onRigUnavailable={handleRigUnavailable} onLifecycleComplete={dispatch} onPageSettled={setSettledPages} onError={(message) => { cancelPendingIntent(); setSceneError(message); }} />
      </Canvas>}
    </CanvasBoundary></div>

    <TutorLibraryControlSurface library={controlLibrary} activeWall={activeWall} visibleEditions={visibleEditions} tutors={TUTOR_BY_ID} selectedTutor={selectedTutor} fallbackTutor={fallbackTutor} availability={availability} status={status} sceneError={sceneError} focusReturnEditionId={focusReturnEditionId} settledPages={settledPages} pageCount={TUTOR_BOOK_READING_STATE_COUNT} showControls={!isDebugTurn} onTurn={wallId => dispatch({ type: 'TURN', wallId })} onBookInteraction={interactWithBook} onCancelPending={cancelPendingIntent} onEscape={() => dispatch({ type: 'ESCAPE' })} onOpen={() => dispatch({ type: 'OPEN' })} onPageTurn={handlePageTurn} onClose={() => dispatch({ type: 'CLOSE' })} />
  </section>;
}
