import { Canvas } from '@react-three/fiber';
import { useEffect, useReducer, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TutorLibraryScene } from './TutorLibraryScene';
import { SUBJECT_WALLS } from './tutor-library-data';
import { createTutorBookEditions } from './tutor-library-data';
import { TUTORS } from '../../data/teacherCatalogue';
import { parseDebugTurnProgress } from './tutor-library-debug';
import { createLibraryState, libraryReducer } from './tutor-library-state';
import './tutor-library.css';

const TURN_DURATION_MS = 1600;
const BOOK_INTENT_DELAY_MS = 90;
const BOOK_EXTRACTION_DURATION_MS = 720;
const BOOK_RETURN_DURATION_MS = 560;
const easeInOutQuart = (progress: number) => progress < .5 ? 8 * progress ** 4 : 1 - (-2 * progress + 2) ** 4 / 2;
const getLogicalBookRootUuid = (editionId: string) => `logical:tutor-book:${editionId}`;

export function TutorLibrary() {
  const [searchParams] = useSearchParams();
  const [library, dispatch] = useReducer(libraryReducer, 'primary', createLibraryState);
  const [turnProgress, setTurnProgress] = useState(0);
  const [bookMotionProgress, setBookMotionProgress] = useState(0);
  const debugTurnProgress = parseDebugTurnProgress(searchParams.get('libraryTurnProgress'));
  const debugBookProgress = parseDebugTurnProgress(searchParams.get('libraryBookProgress'));
  const isDebugTurn = debugTurnProgress !== undefined;
  const isDebugBook = debugBookProgress !== undefined;
  const debugEditionId = createTutorBookEditions(TUTORS).find(edition => edition.wallId === 'primary')?.id;
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

  useEffect(() => {
    if (!isTurning) {
      setTurnProgress(0);
      return;
    }

    let frameId = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const rawProgress = Math.min(1, (now - startedAt) / TURN_DURATION_MS);
      setTurnProgress(easeInOutQuart(rawProgress));
      if (rawProgress < 1) frameId = requestAnimationFrame(tick);
      else dispatch({ type: 'TURN_COMPLETE', generation: library.transitionGeneration });
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isTurning, library.transitionGeneration]);

  useEffect(() => {
    if (library.phase === 'BOOK_HOVER_INTENT') {
      const timeoutId = window.setTimeout(() => dispatch({ type: 'EXTRACT', generation: library.transitionGeneration }), BOOK_INTENT_DELAY_MS);
      return () => window.clearTimeout(timeoutId);
    }
    if (library.phase === 'BOOK_RETURNING') {
      let frameId = 0;
      const startedAt = performance.now();
      const tick = (now: number) => {
        const rawProgress = Math.min(1, (now - startedAt) / BOOK_RETURN_DURATION_MS);
        setBookMotionProgress(rawProgress * rawProgress * (3 - 2 * rawProgress));
        if (rawProgress < 1) frameId = requestAnimationFrame(tick);
        else dispatch({ type: 'RETURN_COMPLETE', generation: library.transitionGeneration });
      };
      frameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frameId);
    }
    if (library.phase !== 'BOOK_EXTRACTING') {
      setBookMotionProgress(library.phase === 'BOOK_PREVIEW' ? 1 : 0);
      return;
    }
    let frameId = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const rawProgress = Math.min(1, (now - startedAt) / BOOK_EXTRACTION_DURATION_MS);
      setBookMotionProgress(1 - (1 - rawProgress) ** 3);
      if (rawProgress < 1) frameId = requestAnimationFrame(tick);
      else dispatch({ type: 'PREVIEW_READY', generation: library.transitionGeneration });
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [library.phase, library.transitionGeneration]);

  const activeWall = SUBJECT_WALLS[activeWallIndex];
  const targetWall = SUBJECT_WALLS[targetWallIndex];

  return (
    <section className={`tutor-library${isDebugTurn || isDebugBook ? ' tutor-library--diagnostic' : ''}${sceneBookPhase.startsWith('BOOK_') ? ' tutor-library--book-active' : ''}`} aria-labelledby="tutor-library-title" data-room-phase={sceneBookPhase} data-turn-progress={sceneProgress.toFixed(2)}>
      <header className={`tutor-library__copy${checkpointView || isDebugTurn ? ' tutor-library__copy--checkpoint' : ''}`}>
        <p>DA Tuition faculty</p>
        <h1 id="tutor-library-title">Find the person behind the teaching.</h1>
        <span>Turn toward a subject and explore the educators who bring it to life.</span>
      </header>
      <div className="tutor-library__canvas">
        <Canvas shadows camera={{ position: [0, 1.9, .2], fov: 52, near: .1, far: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} onPointerLeave={() => dispatch({ type: 'LEAVE' })}>
          <TutorLibraryScene fromWallIndex={activeWallIndex} toWallIndex={targetWallIndex} turnProgress={sceneProgress} reviewView={reviewView} showWallLabels={!isDebugTurn && !isDebugBook} phase={sceneBookPhase} selectedEditionId={sceneSelectedEditionId} bookMotionProgress={sceneBookMotionProgress} onHover={editionId => dispatch({ type: 'HOVER', editionId, rootUuid: getLogicalBookRootUuid(editionId) })} />
        </Canvas>
      </div>
      {!isDebugTurn && <nav className="tutor-library__wall-nav" aria-label="Turn toward a subject wall">
        {SUBJECT_WALLS.map(wall => <button key={wall.id} type="button" disabled={isTurning || wall.id === activeWall.id} aria-pressed={wall.id === activeWall.id} onClick={() => dispatch({ type: 'TURN', wallId: wall.id })}>
          {wall.label}
        </button>)}
      </nav>}
      {!isDebugTurn && <p className="tutor-library__status" aria-live="polite">{isTurning ? `Turning toward ${targetWall.label}.` : library.phase === 'BOOK_PREVIEW' ? 'A tutor book is ready to open.' : 'Hover a tutor book to bring their story forward.'}</p>}
    </section>
  );
}
