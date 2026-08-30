import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, CircleX, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPhotoStyle, getPhotoUrl, type CatalogueTutor } from '../../data/teacherCatalogue';
import { SUBJECT_WALLS, type SubjectWall, type TutorBookEdition } from './tutor-library-data';
import {
  isBookControlDisabled,
  type BookInteractionInput,
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
  visibleEditions: readonly TutorBookEdition[];
  tutors: ReadonlyMap<string, CatalogueTutor>;
  selectedTutor?: CatalogueTutor;
  fallbackTutor: CatalogueTutor;
  availability: LibraryControlAvailability;
  status: string;
  sceneError?: string;
  focusReturnEditionId?: string;
  settledPages: number;
  pageCount: number;
  showControls?: boolean;
  onTurn(wallId: string): void;
  onBookInteraction(editionId: string, input: BookInteractionInput): void;
  onCancelPending(editionId?: string): void;
  onEscape(): void;
  onOpen(): void;
  onPageTurn(direction: TutorBookPageTurnDirection): void;
  onClose(): void;
}

export function TutorLibraryControlSurface({ library, activeWall, visibleEditions, tutors, selectedTutor, fallbackTutor, availability, status, sceneError, focusReturnEditionId, settledPages, pageCount, showControls = true, onTurn, onBookInteraction, onCancelPending, onEscape, onOpen, onPageTurn, onClose }: TutorLibraryControlSurfaceProps) {
  const tutorPicker = useRef<HTMLSelectElement>(null);
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
    tutorPicker.current?.focus();
  }, [focusReturnEditionId]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      onCancelPending();
      onEscape();
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [onCancelPending, onEscape]);

  useEffect(() => {
    if (!selectedTutor || sceneError) return;
    const turnPage = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, select, textarea, [contenteditable="true"]')) return;
      const direction = getPageTurnDirectionForKey(event.key);
      if (!direction || !canTurn(direction)) return;
      event.preventDefault();
      requestPageTurn(direction);
    };
    window.addEventListener('keydown', turnPage);
    return () => window.removeEventListener('keydown', turnPage);
  }, [availability.canTurnPage, onPageTurn, pageCount, sceneError, selectedTutor, settledPages]);

  return <>
    {showControls ? <div className="tutor-library__controls" aria-disabled={sceneError ? 'true' : undefined} {...(sceneError ? { inert: '' } as Record<string, string> : {})}>
      <nav className="tutor-library__wall-nav" aria-label="Turn toward a subject wall">{SUBJECT_WALLS.map(wall => <button key={wall.id} type="button" disabled={Boolean(sceneError) || !availability.canTurnRoom || wall.id === activeWall.id} aria-pressed={wall.id === activeWall.id} onClick={() => onTurn(wall.id)}>{wall.label}</button>)}</nav>
      <label className="tutor-library__tutor-picker" hidden={Boolean(selectedTutor)}>
        <span>Choose a tutor</span>
        <select
          ref={tutorPicker}
          aria-label={`Choose a ${activeWall.label} tutor book`}
          value=""
          disabled={Boolean(sceneError) || visibleEditions.every(edition => isBookControlDisabled(library, edition.id))}
          onChange={event => {
            const editionId = event.currentTarget.value;
            if (editionId && !sceneError && !isBookControlDisabled(library, editionId)) {
              onBookInteraction(editionId, 'keyboard-activate');
            }
          }}
        >
          <option value="">Select a book from the shelf</option>
          {visibleEditions.map(edition => {
            const tutor = tutors.get(edition.tutorId);
            return tutor ? <option key={edition.id} value={edition.id}>{tutor.name}</option> : null;
          })}
        </select>
      </label>
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
