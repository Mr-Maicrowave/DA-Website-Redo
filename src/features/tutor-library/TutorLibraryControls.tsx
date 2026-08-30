import { useEffect, useRef, useState } from 'react';
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

    {selectedTutor && !sceneError ? <aside className="tutor-library__reader" aria-label={`${selectedTutor.name} tutor book controls`} tabIndex={0}
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
      <p className="tutor-library__page-status" aria-live="polite">Page {Math.min(pageCount, settledPages + 1)} of {pageCount}</p>
      <div className="tutor-library__reader-actions"><button type="button" disabled={!availability.canOpen} onClick={onOpen}>Open book</button><button type="button" aria-label="Previous tutor profile page" disabled={!canTurn(-1)} onClick={() => requestPageTurn(-1)}>Previous page</button><button type="button" aria-label="Next tutor profile page" disabled={!canTurn(1)} onClick={() => requestPageTurn(1)}>Next page</button><button type="button" disabled={!availability.canClose} onClick={onClose}>Close and return book</button><Link to={`/find-teacher?tutor=${selectedTutor.id}`}>View full tutor profile</Link></div>
      <div className="sr-only">{pages.map(page => <section key={page.id}><h2>{page.label}</h2>{page.sourceText.map((text, index) => <p key={`${page.id}-${index}`}>{text}</p>)}</section>)}</div>
    </aside> : null}

    {sceneError ? <div className="tutor-library__fallback" role="alert"><p>The interactive library could not be displayed.</p><span>{sceneError}</span><Link to={`/find-teacher?tutor=${fallbackTutor.id}`}>Browse {fallbackTutor.name}'s searchable profile</Link></div> : null}
    {showControls ? <p className="tutor-library__status" role="status" aria-live="polite" aria-atomic="true">{status}</p> : null}
  </>;
}
