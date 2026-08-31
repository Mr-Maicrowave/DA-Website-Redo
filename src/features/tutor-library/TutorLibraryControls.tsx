import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, CircleX, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPhotoStyle, getPhotoUrl, type CatalogueTutor } from '../../data/teacherCatalogue';
import { SUBJECT_WALLS, type SubjectWall } from './tutor-library-data';
import {
  type LibraryControlAvailability,
  type LibraryState,
} from './tutor-library-state';
import {
  createTutorBookPages,
  getPageTurnDirectionForKey,
  getPageTurnDirectionForSwipe,
  getTutorBookPageTarget,
  type TutorBookPageTurnDirection,
} from './tutor-book-pages';
import { getTutorLibraryKeyboardAction } from './tutor-library-keyboard';

function Portrait({ tutor }: { tutor: CatalogueTutor }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [tutor.id]);
  return failed
    ? <span className="tutor-library__portrait-fallback" aria-hidden="true">{tutor.name.replace(/^(Mr|Ms|Mrs)\s+/i, '').slice(0, 1)}</span>
    : <img src={getPhotoUrl(tutor)} alt={`Portrait of ${tutor.name}`} style={getPhotoStyle(tutor)} onError={() => setFailed(true)} />;
}

export interface TutorLibraryControlSurfaceProps {
  library: LibraryState;
  activeWall: SubjectWall;
  selectedTutor?: CatalogueTutor;
  fallbackTutor: CatalogueTutor;
  availability: LibraryControlAvailability;
  status: string;
  sceneError?: string;
  focusReturnEditionId?: string;
  settledPages: number;
  pageCount: number;
  spotlightQuery: string;
  spotlightResultCount: number;
  spotlightOffset: number;
  spotlightPageCount: number;
  spotlightActive: boolean;
  showControls?: boolean;
  onSpotlightQueryChange(query: string): void;
  onSpotlightOffsetChange(offset: number): void;
  onTurn(wallId: string): void;
  onCancelPending(editionId?: string): void;
  onEscape(): void;
  onOpen(): void;
  onPageTurn(direction: TutorBookPageTurnDirection): void;
  onClose(): void;
}

export function TutorLibraryControlSurface({ library, activeWall, selectedTutor, fallbackTutor, availability, status, sceneError, focusReturnEditionId, settledPages, pageCount, spotlightQuery, spotlightResultCount, spotlightOffset, spotlightPageCount, spotlightActive, showControls = true, onSpotlightQueryChange, onSpotlightOffsetChange, onTurn, onCancelPending, onEscape, onOpen, onPageTurn, onClose }: TutorLibraryControlSurfaceProps) {
  const spotlightInput = useRef<HTMLInputElement>(null);
  const pointerStart = useRef<{ x: number; y: number; id: number }>();
  const pages = selectedTutor ? createTutorBookPages(selectedTutor) : [];
  const readerStage = library.phase === 'BOOK_PREVIEW' ? 'cover' : 'spread';
  const readerVisible = library.phase === 'BOOK_PREVIEW' || library.phase === 'BOOK_READING' || library.phase === 'PAGE_SETTLED';
  const canTurn = (direction: TutorBookPageTurnDirection) => availability.canTurnPage
    && getTutorBookPageTarget(settledPages, direction) !== undefined;
  const requestPageTurn = (direction: TutorBookPageTurnDirection) => {
    if (canTurn(direction)) onPageTurn(direction);
  };

  useEffect(() => {
    if (!focusReturnEditionId) return;
    spotlightInput.current?.focus();
  }, [focusReturnEditionId]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (spotlightQuery && !selectedTutor) {
        event.preventDefault();
        onSpotlightQueryChange('');
        return;
      }
      onCancelPending();
      onEscape();
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [onCancelPending, onEscape, onSpotlightQueryChange, selectedTutor, spotlightQuery]);

  useEffect(() => {
    if (sceneError) return;
    const navigate = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, select, textarea, [contenteditable="true"]')) return;
      const action = getTutorLibraryKeyboardAction(event.key, library.phase, false, settledPages);
      if (!action) return;
      event.preventDefault();
      if (action === 'open-book') onOpen();
      else if (action === 'return-book') onClose();
      else if (action === 'previous-spread') requestPageTurn(-1);
      else if (action === 'next-spread') requestPageTurn(1);
      else {
        const current = SUBJECT_WALLS.findIndex(wall => wall.id === activeWall.id);
        const offset = action === 'previous-wall' ? -1 : 1;
        onTurn(SUBJECT_WALLS[(current + offset + SUBJECT_WALLS.length) % SUBJECT_WALLS.length]!.id);
      }
    };
    window.addEventListener('keydown', navigate);
    return () => window.removeEventListener('keydown', navigate);
  }, [activeWall.id, library.phase, onClose, onOpen, onPageTurn, onTurn, sceneError, settledPages]);

  return <>
    {showControls ? <div className="tutor-library__controls" aria-disabled={sceneError ? 'true' : undefined} {...(sceneError ? { inert: '' } as Record<string, string> : {})}>
      <nav className="tutor-library__wall-nav" hidden={spotlightActive} aria-label="Turn toward a subject wall">{SUBJECT_WALLS.map(wall => <button key={wall.id} type="button" disabled={Boolean(sceneError) || !availability.canTurnRoom || wall.id === activeWall.id} aria-pressed={wall.id === activeWall.id} onClick={() => onTurn(wall.id)}>{wall.label}</button>)}</nav>
      <div className="tutor-library__spotlight" hidden={Boolean(selectedTutor)}>
        <label htmlFor="tutor-library-spotlight">Find a tutor</label>
        <input ref={spotlightInput} id="tutor-library-spotlight" type="search" value={spotlightQuery} placeholder="Search all tutors" autoComplete="off" disabled={Boolean(sceneError)} aria-describedby="tutor-library-spotlight-status" onChange={event => onSpotlightQueryChange(event.currentTarget.value)} />
        {spotlightActive ? <div className="tutor-library__spotlight-results">
          <button type="button" aria-label="Show previous tutor results" disabled={spotlightOffset === 0} onClick={() => onSpotlightOffsetChange(spotlightOffset - 1)}>‹</button>
          <p id="tutor-library-spotlight-status" role="status">{spotlightResultCount === 0 ? 'No tutors found. Try a name, subject or teaching strength.' : `${Math.min(spotlightResultCount, spotlightOffset * (window.innerWidth <= 700 ? 5 : 7) + 1)}–${Math.min(spotlightResultCount, (spotlightOffset + 1) * (window.innerWidth <= 700 ? 5 : 7))} of ${spotlightResultCount} tutors`}</p>
          <button type="button" aria-label="Show next tutor results" disabled={spotlightOffset >= spotlightPageCount - 1} onClick={() => onSpotlightOffsetChange(spotlightOffset + 1)}>›</button>
          <button className="tutor-library__spotlight-clear" type="button" onClick={() => onSpotlightQueryChange('')}>Clear search</button>
        </div> : <p id="tutor-library-spotlight-status">Search names, subjects or teaching strengths.</p>}
      </div>
      {!selectedTutor ? <p className="tutor-library__room-hint"><kbd>←</kbd> <kbd>→</kbd> Explore subjects</p> : null}
    </div> : null}

    {selectedTutor && readerVisible && !sceneError ? <aside className="tutor-library__reader" data-reader-stage={readerStage} aria-label={`${selectedTutor.name} tutor book controls`} aria-keyshortcuts="ArrowLeft ArrowRight PageUp PageDown" tabIndex={0}
      onKeyDown={event => {
        const direction = getPageTurnDirectionForKey(event.key);
        if (!direction || !canTurn(direction)) return;
        event.preventDefault();
        requestPageTurn(direction);
      }}
      onPointerDown={event => {
        if (!availability.canTurnPage || !event.isPrimary) return;
        pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
      }}
      onPointerUp={event => {
        const start = pointerStart.current;
        pointerStart.current = undefined;
        if (!start || start.id !== event.pointerId) return;
        const direction = getPageTurnDirectionForSwipe(event.clientX - start.x, event.clientY - start.y);
        if (direction) requestPageTurn(direction);
      }}
      onPointerCancel={() => { pointerStart.current = undefined; }}>
      <div className="tutor-library__reader-profile"><Portrait tutor={selectedTutor} /><div><p>{selectedTutor.name}</p><span>{selectedTutor.designation}</span></div></div>
      <p className="tutor-library__reader-summary">{selectedTutor.tagline}</p>
      {readerStage === 'spread' ? <><p className="tutor-library__page-status" aria-live="polite">Spread {Math.min(pageCount, settledPages + 1)} of {pageCount}</p>
      <p className="tutor-library__page-hint">Use <kbd>←</kbd> <kbd>→</kbd> to turn spreads</p></> : null}
      <div className="tutor-library__reader-actions">
        {readerStage === 'cover' ? <>
        <button className="tutor-library__reader-action" type="button" disabled={!availability.canOpen} onClick={onOpen}><BookOpen aria-hidden="true" /><span>Open book</span><ChevronRight aria-hidden="true" /></button>
        <Link className="tutor-library__reader-action" to={`/find-teacher?tutor=${selectedTutor.id}`}><UserRound aria-hidden="true" /><span>View full tutor profile</span><ChevronRight aria-hidden="true" /></Link>
        <button className="tutor-library__reader-action" type="button" disabled={!availability.canClose} onClick={onClose}><CircleX aria-hidden="true" /><span>Return book</span><ChevronRight aria-hidden="true" /></button>
        </> : <>
        <button className="tutor-library__reader-action" type="button" aria-label="Previous tutor profile spread" disabled={!canTurn(-1)} onClick={() => requestPageTurn(-1)}><ArrowLeft aria-hidden="true" /><span>Previous spread</span><ChevronRight aria-hidden="true" /></button>
        <button className="tutor-library__reader-action" type="button" aria-label="Next tutor profile spread" disabled={!canTurn(1)} onClick={() => requestPageTurn(1)}><ArrowRight aria-hidden="true" /><span>Next spread</span><ChevronRight aria-hidden="true" /></button>
        <Link className="tutor-library__reader-action" to={`/find-teacher?tutor=${selectedTutor.id}`}><UserRound aria-hidden="true" /><span>View full tutor profile</span><ChevronRight aria-hidden="true" /></Link>
        <button className="tutor-library__reader-action" type="button" disabled={!availability.canClose} onClick={onClose}><CircleX aria-hidden="true" /><span>Close book</span><ChevronRight aria-hidden="true" /></button>
        </>}
      </div>
      <div className="sr-only">{pages.map(page => <section key={page.id}><h2>{page.label}</h2>{page.sourceText.map((text, index) => <p key={`${page.id}-${index}`}>{text}</p>)}</section>)}</div>
    </aside> : null}

    {sceneError ? <div className="tutor-library__fallback" role="alert"><p>The interactive library could not be displayed.</p><span>{sceneError}</span><Link to={`/find-teacher?tutor=${fallbackTutor.id}`}>Browse {fallbackTutor.name}'s searchable profile</Link></div> : null}
    {showControls ? <p className="tutor-library__status" role="status" aria-live="polite" aria-atomic="true">{status}</p> : null}
  </>;
}
