import { useState } from 'react';
import type { CatalogueTutor } from '../../data/teacherCatalogue';
import { selectVisibleShelfEditions, type CompleteShelfBookPool } from './complete-shelf-book-pool';
import type { CompleteShelfTutorRig } from './CompleteShelfTutorBookBridge';
import type { TutorBookEdition } from './tutor-library-data';
import { TutorBook } from './TutorBook';
import type { LibraryEvent, LibraryPhase } from './tutor-library-state';
import type { TutorBookPageTurnDirection } from './tutor-book-pages';

export function TutorShelf({ editions, tutors, pool, rigIntentEditionId, rigIntentToken, onRigIntent, phase, generation, reducedMotion, pageTurnDirection, selectedEditionId, motionProgress, onActivate, onRigReady, onRigUnavailable, onLifecycleComplete, onPageSettled, onError }: { editions: readonly TutorBookEdition[]; tutors: ReadonlyMap<string, CatalogueTutor>; pool: CompleteShelfBookPool<CompleteShelfTutorRig>; rigIntentEditionId?: string; rigIntentToken: number; onRigIntent: (editionId?: string) => void; phase: LibraryPhase; generation: number; reducedMotion: boolean; pageTurnDirection: TutorBookPageTurnDirection; selectedEditionId?: string; motionProgress: number; onActivate: (editionId: string, rootUuid: string) => void; onRigReady: (editionId: string, rootUuid: string, token: number) => void; onRigUnavailable: (editionId: string, rootUuid: string) => void; onLifecycleComplete: (event: LibraryEvent) => void; onPageSettled: (settledPages: number) => void; onError: (message: string) => void }) {
  const [hoveredEditionId, setHoveredEditionId] = useState<string>();
  const visibleEditions = selectVisibleShelfEditions(editions, selectedEditionId);
  const selected = visibleEditions.find(candidate => candidate.id === selectedEditionId);
  return <group name="tutor-shelf">{visibleEditions.map(edition => {
    const tutor = tutors.get(edition.tutorId);
    const responseBook = selected ?? visibleEditions.find(candidate => candidate.id === hoveredEditionId);
    const isNeighbour = responseBook && responseBook.shelfIndex === edition.shelfIndex && Math.abs(responseBook.slotIndex - edition.slotIndex) === 1;
    const neighbourResponse = isNeighbour && (selected ? phase !== 'ROOM_IDLE' : phase === 'ROOM_IDLE') ? (edition.slotIndex < responseBook.slotIndex ? -.028 : .028) : 0;
    return tutor ? <TutorBook key={edition.id} edition={edition} tutor={tutor} pool={pool} rigIntent={edition.id === rigIntentEditionId} rigIntentToken={rigIntentToken} onRigIntent={onRigIntent} phase={phase} generation={generation} reducedMotion={reducedMotion} pageTurnDirection={pageTurnDirection} selected={edition.id === selectedEditionId} motionProgress={motionProgress} neighbourResponse={neighbourResponse} onHoverChange={setHoveredEditionId} onActivate={onActivate} onRigReady={onRigReady} onRigUnavailable={onRigUnavailable} onLifecycleComplete={onLifecycleComplete} onPageSettled={onPageSettled} onError={onError} /> : null;
  })}</group>;
}
