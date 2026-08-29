import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPhotoStyle, getPhotoUrl, type CatalogueTutor } from '../../data/teacherCatalogue';
import { SUBJECT_WALLS, type SubjectWall, type TutorBookEdition } from './tutor-library-data';
import {
  isBookControlDisabled,
  shouldPreviewBookOnFocus,
  type BookInteractionInput,
  type LibraryControlAvailability,
  type LibraryState,
} from './tutor-library-state';

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
  showControls?: boolean;
  onTurn(wallId: string): void;
  onBookInteraction(editionId: string, input: BookInteractionInput): void;
  onCancelPending(editionId?: string): void;
  onEscape(): void;
  onOpen(): void;
  onPageTurn(): void;
  onClose(): void;
}

export function TutorLibraryControlSurface({ library, activeWall, visibleEditions, tutors, selectedTutor, fallbackTutor, availability, status, sceneError, focusReturnEditionId, showControls = true, onTurn, onBookInteraction, onCancelPending, onEscape, onOpen, onPageTurn, onClose }: TutorLibraryControlSurfaceProps) {
  const restoringFocus = useRef(false);
  const bookButtons = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (!focusReturnEditionId) return;
    restoringFocus.current = true;
    bookButtons.current.get(focusReturnEditionId)?.focus();
    restoringFocus.current = false;
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
      <div className="tutor-library__book-controls" role="group" aria-label={`${activeWall.label} tutor books`}>{visibleEditions.map(edition => {
        const tutor = tutors.get(edition.tutorId); if (!tutor) return null;
        const selected = edition.id === library.selectedEditionId;
        return <button key={edition.id} ref={node => { if (node) bookButtons.current.set(edition.id, node); else bookButtons.current.delete(edition.id); }} type="button" className="tutor-library__book-control" data-edition-id={edition.id} disabled={Boolean(sceneError) || isBookControlDisabled(library, edition.id)} aria-pressed={selected} aria-label={`${selected ? 'Open' : 'Preview'} ${tutor.name}'s tutor book`} onPointerEnter={event => { if (event.pointerType !== 'touch') onBookInteraction(edition.id, 'pointer-preview'); }} onPointerLeave={() => onCancelPending(edition.id)} onFocus={() => { if (shouldPreviewBookOnFocus(restoringFocus.current)) onBookInteraction(edition.id, 'pointer-preview'); }} onBlur={() => onCancelPending(edition.id)} onClick={() => onBookInteraction(edition.id, 'keyboard-activate')}><span>{tutor.name.replace(/^(Mr|Ms|Mrs)\s+/i, '')}</span><small>{tutor.designation}</small></button>;
      })}</div>
    </div> : null}

    {selectedTutor && !sceneError ? <aside className="tutor-library__reader" aria-label={`${selectedTutor.name} tutor book controls`}>
      <div className="tutor-library__reader-profile"><Portrait tutor={selectedTutor} /><div><p>{selectedTutor.name}</p><span>{selectedTutor.designation}</span></div></div>
      <p className="tutor-library__reader-summary">{selectedTutor.tagline}</p>
      <div className="tutor-library__reader-actions"><button type="button" disabled={!availability.canOpen} onClick={onOpen}>Open book</button><button type="button" disabled={!availability.canTurnPage} onClick={onPageTurn}>Turn next page</button><button type="button" disabled={!availability.canClose} onClick={onClose}>Close and return book</button><Link to={`/find-teacher?tutor=${selectedTutor.id}`}>View full tutor profile</Link></div>
    </aside> : null}

    {sceneError ? <div className="tutor-library__fallback" role="alert"><p>The interactive library could not be displayed.</p><span>{sceneError}</span><Link to={`/find-teacher?tutor=${fallbackTutor.id}`}>Browse {fallbackTutor.name}'s searchable profile</Link></div> : null}
    {showControls ? <p className="tutor-library__status" role="status" aria-live="polite" aria-atomic="true">{status}</p> : null}
  </>;
}
