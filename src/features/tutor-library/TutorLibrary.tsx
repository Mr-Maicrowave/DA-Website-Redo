import { Canvas } from '@react-three/fiber';
import { Component, useEffect, useMemo, useReducer, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPhotoStyle, getPhotoUrl, TUTORS } from '../../data/teacherCatalogue';
import { createMountedRigRootRegistry, selectVisibleShelfEditions } from './complete-shelf-book-pool';
import { createBookMotionTimingPolicy } from './tutor-book-motion';
import { parseDebugTurnProgress } from './tutor-library-debug';
import { createTutorBookEditions, SUBJECT_WALLS } from './tutor-library-data';
import {
  createLibraryState,
  createPendingRigIntentTracker,
  getBookInteractionEvents,
  getFocusReturnEditionId,
  getLibraryControlAvailability,
  getLibraryLiveStatus,
  isBookControlDisabled,
  libraryReducer,
  shouldPreviewBookOnFocus,
  type BookInteractionInput,
  type LibraryEvent,
  type LibraryState,
  type PendingRigIntent,
} from './tutor-library-state';
import { TutorLibraryScene } from './TutorLibraryScene';
import './tutor-library.css';

const BOOK_EDITIONS = createTutorBookEditions(TUTORS);
const TUTOR_BY_ID = new Map(TUTORS.map(tutor => [tutor.id, tutor]));
const FALLBACK_TUTOR = TUTORS.find(tutor => tutor.id === 'T003')!;
const easeInOutQuart = (progress: number) => progress < .5 ? 8 * progress ** 4 : 1 - (-2 * progress + 2) ** 4 / 2;

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

function Portrait({ tutor }: { tutor: typeof FALLBACK_TUTOR }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [tutor.id]);
  return failed
    ? <span className="tutor-library__portrait-fallback" aria-hidden="true">{tutor.name.replace(/^(Mr|Ms|Mrs)\s+/i, '').slice(0, 1)}</span>
    : <img src={getPhotoUrl(tutor)} alt={`Portrait of ${tutor.name}`} style={getPhotoStyle(tutor)} onError={() => setFailed(true)} />;
}

export function TutorLibrary() {
  const [searchParams] = useSearchParams();
  const [library, dispatch] = useReducer(libraryReducer, 'primary', createLibraryState);
  const [turnProgress, setTurnProgress] = useState(0);
  const [bookMotionProgress, setBookMotionProgress] = useState(0);
  const [rigIntent, setRigIntent] = useState<PendingRigIntent>();
  const [sceneError, setSceneError] = useState<string | undefined>(() => searchParams.get('libraryForceCanvasError') === '1' ? 'Forced Tutor Library Canvas failure' : undefined);
  const reducedMotion = useReducedMotionPreference();
  const timing = useMemo(() => createBookMotionTimingPolicy(reducedMotion), [reducedMotion]);
  const mountedRoots = useRef(createMountedRigRootRegistry());
  const pendingIntent = useRef(createPendingRigIntentTracker());
  const previousLibrary = useRef(library);
  const restoringFocus = useRef(false);
  const bookButtons = useRef(new Map<string, HTMLButtonElement>());
  const debugTurnProgress = parseDebugTurnProgress(searchParams.get('libraryTurnProgress'));
  const debugBookProgress = parseDebugTurnProgress(searchParams.get('libraryBookProgress'));
  const isDebugTurn = debugTurnProgress !== undefined;
  const isDebugBook = debugBookProgress !== undefined;
  const debugEditionId = BOOK_EDITIONS.find(edition => edition.wallId === 'primary')?.id;
  const isTurning = library.phase === 'ROOM_TURNING';
  const activeWallIndex = isDebugTurn ? 0 : Math.max(0, SUBJECT_WALLS.findIndex(wall => wall.id === library.activeWallId));
  const pendingWallIndex = Math.max(0, SUBJECT_WALLS.findIndex(wall => wall.id === library.pendingWallId));
  const targetWallIndex = isDebugTurn ? 1 : isTurning ? pendingWallIndex : activeWallIndex;
  const sceneProgress = isDebugTurn ? debugTurnProgress : turnProgress;
  const sceneBookPhase = isDebugBook ? (debugBookProgress === 0 ? 'BOOK_HOVER_INTENT' : debugBookProgress === 1 ? 'BOOK_PREVIEW' : 'BOOK_EXTRACTING') : library.phase;
  const sceneSelectedEditionId = isDebugBook ? debugEditionId : library.selectedEditionId;
  const sceneBookMotionProgress = isDebugBook ? debugBookProgress : bookMotionProgress;
  const checkpointView = searchParams.get('checkpoint') === 'b';
  const reviewView = searchParams.get('libraryReviewView');
  const forceCanvasFailure = searchParams.get('libraryForceCanvasError') === '1';
  const activeWall = SUBJECT_WALLS[activeWallIndex];
  const targetWall = SUBJECT_WALLS[targetWallIndex];
  const selectedEdition = BOOK_EDITIONS.find(edition => edition.id === library.selectedEditionId);
  const selectedTutor = selectedEdition ? TUTOR_BY_ID.get(selectedEdition.tutorId) : undefined;
  const visibleEditions = selectVisibleShelfEditions(BOOK_EDITIONS.filter(edition => edition.wallId === activeWall.id), library.selectedEditionId);
  const availability = getLibraryControlAvailability(library);

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
    const previous = previousLibrary.current;
    const focusEditionId = getFocusReturnEditionId(previous, library);
    if (focusEditionId) {
      restoringFocus.current = true;
      bookButtons.current.get(focusEditionId)?.focus();
      restoringFocus.current = false;
    }
    previousLibrary.current = library;
    if (library.phase === 'ROOM_IDLE' && !library.selectedEditionId && !pendingIntent.current.current()) setRigIntent(undefined);
  }, [library]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      cancelPendingIntent();
      dispatch({ type: 'ESCAPE' });
    };
    const resize = () => dispatch({ type: 'RESIZE' });
    const visibility = () => { if (document.visibilityState === 'visible') dispatch({ type: 'VISIBILITY_RESUME' }); };
    window.addEventListener('keydown', escape);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('keydown', escape);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (!isTurning) { setTurnProgress(0); return; }
    let frameId = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const rawProgress = timing.roomTurnMs === 0 ? 1 : Math.min(1, (now - startedAt) / timing.roomTurnMs);
      setTurnProgress(easeInOutQuart(rawProgress));
      if (rawProgress < 1) frameId = requestAnimationFrame(tick);
      else dispatch({ type: 'TURN_COMPLETE', generation: library.transitionGeneration });
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isTurning, library.transitionGeneration, timing.roomTurnMs]);

  useEffect(() => {
    const completion: Partial<Record<LibraryState['phase'], { duration: number; type: LibraryEvent['type'] }>> = {
      BOOK_HOVER_INTENT: { duration: timing.hoverIntentMs, type: 'EXTRACT' },
      BOOK_EXTRACTING: { duration: timing.extractionMs, type: 'PREVIEW_READY' },
      BOOK_TO_READING: { duration: timing.toReadingMs, type: 'READING_POSE_READY' },
      BOOK_RETURNING: { duration: timing.returnMs, type: 'RETURN_COMPLETE' },
    };
    const current = completion[library.phase];
    if (!current) { if (library.phase !== 'BOOK_PREVIEW') setBookMotionProgress(0); return; }
    let frameId = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const rawProgress = current.duration === 0 ? 1 : Math.min(1, (now - startedAt) / current.duration);
      setBookMotionProgress(rawProgress * rawProgress * (3 - 2 * rawProgress));
      if (rawProgress < 1) frameId = requestAnimationFrame(tick);
      else dispatch({ type: current.type, generation: library.transitionGeneration } as LibraryEvent);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [library.phase, library.transitionGeneration, timing.extractionMs, timing.hoverIntentMs, timing.returnMs, timing.toReadingMs]);

  const handleRigReady = (editionId: string, rootUuid: string, token: number) => {
    mountedRoots.current.mount(editionId, rootUuid);
    const pending = pendingIntent.current.consumeReady(editionId, token);
    if (!pending) return;
    dispatchEvents(getBookInteractionEvents(library, pending.input, editionId, rootUuid));
  };

  const handleRigUnavailable = (editionId: string, rootUuid: string) => {
    mountedRoots.current.unmount(editionId, rootUuid);
  };

  const fallbackTutor = selectedTutor ?? FALLBACK_TUTOR;
  const status = getLibraryLiveStatus(library, selectedTutor?.name, targetWall.label);

  return <section className={`tutor-library${isDebugTurn || isDebugBook ? ' tutor-library--diagnostic' : ''}${sceneBookPhase.startsWith('BOOK_') || sceneBookPhase.startsWith('PAGE_') ? ' tutor-library--book-active' : ''}`} aria-labelledby="tutor-library-title" data-room-phase={sceneBookPhase} data-turn-progress={sceneProgress.toFixed(2)} data-reduced-motion={reducedMotion ? 'true' : 'false'}>
    <header className={`tutor-library__copy${checkpointView || isDebugTurn ? ' tutor-library__copy--checkpoint' : ''}`}>
      <p>DA Tuition faculty</p><h1 id="tutor-library-title">Find the person behind the teaching.</h1><span>Turn toward a subject and explore the educators who bring it to life.</span>
    </header>
    <div className="tutor-library__canvas" aria-hidden="true"><CanvasBoundary onError={(message) => { cancelPendingIntent(); setSceneError(message); }}>
      {forceCanvasFailure ? null : <Canvas shadows camera={{ position: [0, 1.9, .2], fov: 52, near: .1, far: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} onPointerLeave={() => { cancelPendingIntent(); dispatch({ type: 'LEAVE' }); }}>
        <TutorLibraryScene fromWallIndex={activeWallIndex} toWallIndex={targetWallIndex} turnProgress={sceneProgress} reviewView={reviewView} showWallLabels={!isDebugTurn && !isDebugBook} phase={sceneBookPhase} generation={library.transitionGeneration} reducedMotion={reducedMotion} selectedEditionId={sceneSelectedEditionId} rigIntentEditionId={rigIntent?.editionId} rigIntentToken={rigIntent?.token ?? 0} bookMotionProgress={sceneBookMotionProgress} onHover={(editionId, rootUuid) => dispatchEvents(getBookInteractionEvents(library, 'pointer-preview', editionId, rootUuid))} onActivate={(editionId, rootUuid) => dispatchEvents(getBookInteractionEvents(library, 'touch-activate', editionId, rootUuid))} onRigReady={handleRigReady} onRigUnavailable={handleRigUnavailable} onLifecycleComplete={dispatch} onError={(message) => { cancelPendingIntent(); setSceneError(message); }} />
      </Canvas>}
    </CanvasBoundary></div>

    {!isDebugTurn ? <div className="tutor-library__controls" aria-disabled={sceneError ? 'true' : undefined} {...(sceneError ? { inert: '' } as Record<string, string> : {})}>
      <nav className="tutor-library__wall-nav" aria-label="Turn toward a subject wall">{SUBJECT_WALLS.map(wall => <button key={wall.id} type="button" disabled={Boolean(sceneError) || !availability.canTurnRoom || wall.id === activeWall.id} aria-pressed={wall.id === activeWall.id} onClick={() => dispatch({ type: 'TURN', wallId: wall.id })}>{wall.label}</button>)}</nav>
      <div className="tutor-library__book-controls" role="group" aria-label={`${activeWall.label} tutor books`}>{visibleEditions.map(edition => {
        const tutor = TUTOR_BY_ID.get(edition.tutorId); if (!tutor) return null;
        const selected = edition.id === library.selectedEditionId;
        return <button key={edition.id} ref={node => { if (node) bookButtons.current.set(edition.id, node); else bookButtons.current.delete(edition.id); }} type="button" className="tutor-library__book-control" data-edition-id={edition.id} disabled={Boolean(sceneError) || isBookControlDisabled(library, edition.id)} aria-pressed={selected} aria-label={`${selected ? 'Open' : 'Preview'} ${tutor.name}'s tutor book`} onPointerEnter={event => { if (event.pointerType !== 'touch') interactWithBook(edition.id, 'pointer-preview'); }} onPointerLeave={() => cancelPendingIntent(edition.id)} onFocus={() => { if (shouldPreviewBookOnFocus(restoringFocus.current)) interactWithBook(edition.id, 'pointer-preview'); }} onBlur={() => cancelPendingIntent(edition.id)} onClick={() => interactWithBook(edition.id, 'keyboard-activate')}><span>{tutor.name.replace(/^(Mr|Ms|Mrs)\s+/i, '')}</span><small>{tutor.designation}</small></button>;
      })}</div>
    </div> : null}

    {selectedTutor && !sceneError ? <aside className="tutor-library__reader" aria-label={`${selectedTutor.name} tutor book controls`}>
      <div className="tutor-library__reader-profile"><Portrait tutor={selectedTutor} /><div><p>{selectedTutor.name}</p><span>{selectedTutor.designation}</span></div></div>
      <p className="tutor-library__reader-summary">{selectedTutor.tagline}</p>
      <div className="tutor-library__reader-actions"><button type="button" disabled={!availability.canOpen} onClick={() => dispatch({ type: 'OPEN' })}>Open book</button><button type="button" disabled={!availability.canTurnPage} onClick={() => dispatch({ type: 'PAGE_TURN' })}>Turn next page</button><button type="button" disabled={!availability.canClose} onClick={() => dispatch({ type: 'CLOSE' })}>Close and return book</button><Link to={`/find-teacher?tutor=${selectedTutor.id}`}>View full tutor profile</Link></div>
    </aside> : null}

    {sceneError ? <div className="tutor-library__fallback" role="alert"><p>The interactive library could not be displayed.</p><span>{sceneError}</span><Link to={`/find-teacher?tutor=${fallbackTutor.id}`}>Browse {fallbackTutor.name}'s searchable profile</Link></div> : null}
    {!isDebugTurn ? <p className="tutor-library__status" role="status" aria-live="polite" aria-atomic="true">{status}</p> : null}
  </section>;
}
