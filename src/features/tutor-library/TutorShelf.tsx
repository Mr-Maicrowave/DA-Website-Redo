import type { CatalogueTutor } from '../../data/teacherCatalogue';
import { selectVisibleShelfEditions, type CompleteShelfBookPool } from './complete-shelf-book-pool';
import type { CompleteShelfTutorRig } from './CompleteShelfTutorBookBridge';
import type { TutorBookEdition } from './tutor-library-data';
import { TutorBook } from './TutorBook';
import type { LibraryEvent, LibraryPhase } from './tutor-library-state';

export function TutorShelf({ editions, tutors, pool, rigIntentEditionId, onRigIntent, phase, generation, reducedMotion, selectedEditionId, motionProgress, onHover, onActivate, onRigReady, onLifecycleComplete, onError }: { editions: readonly TutorBookEdition[]; tutors: ReadonlyMap<string, CatalogueTutor>; pool: CompleteShelfBookPool<CompleteShelfTutorRig>; rigIntentEditionId?: string; onRigIntent: (editionId?: string) => void; phase: LibraryPhase; generation: number; reducedMotion: boolean; selectedEditionId?: string; motionProgress: number; onHover: (editionId: string, rootUuid: string) => void; onActivate: (editionId: string, rootUuid: string) => void; onRigReady: (editionId: string, rootUuid: string) => void; onLifecycleComplete: (event: LibraryEvent) => void; onError: (message: string) => void }) {
  const visibleEditions = selectVisibleShelfEditions(editions, selectedEditionId);
  const selected = visibleEditions.find(candidate => candidate.id === selectedEditionId);
  return <group name="tutor-shelf">{visibleEditions.map(edition => {
    const tutor = tutors.get(edition.tutorId);
    const isNeighbour = selected && selected.shelfIndex === edition.shelfIndex && Math.abs(selected.slotIndex - edition.slotIndex) === 1;
    const neighbourResponse = isNeighbour && phase !== 'ROOM_IDLE' ? (edition.slotIndex < selected.slotIndex ? -.028 : .028) : 0;
    return tutor ? <TutorBook key={edition.id} edition={edition} tutor={tutor} pool={pool} rigIntent={edition.id === rigIntentEditionId} onRigIntent={onRigIntent} phase={phase} generation={generation} reducedMotion={reducedMotion} selected={edition.id === selectedEditionId} motionProgress={motionProgress} neighbourResponse={neighbourResponse} onHover={onHover} onActivate={onActivate} onRigReady={onRigReady} onLifecycleComplete={onLifecycleComplete} onError={onError} /> : null;
  })}</group>;
}
