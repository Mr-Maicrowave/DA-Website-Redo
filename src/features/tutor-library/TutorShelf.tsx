import type { CatalogueTutor } from '../../data/teacherCatalogue';
import { selectVisibleShelfEditions, type CompleteShelfBookPool } from './complete-shelf-book-pool';
import type { CompleteShelfTutorRig } from './CompleteShelfTutorBookBridge';
import type { TutorBookEdition } from './tutor-library-data';
import { TutorBook } from './TutorBook';
import type { LibraryPhase } from './tutor-library-state';

export function TutorShelf({ editions, tutors, pool, phase, selectedEditionId, motionProgress, onHover }: { editions: readonly TutorBookEdition[]; tutors: ReadonlyMap<string, CatalogueTutor>; pool: CompleteShelfBookPool<CompleteShelfTutorRig>; phase: LibraryPhase; selectedEditionId?: string; motionProgress: number; onHover: (editionId: string, rootUuid: string) => void }) {
  const visibleEditions = selectVisibleShelfEditions(editions, selectedEditionId);
  const selected = visibleEditions.find(candidate => candidate.id === selectedEditionId);
  return <group name="tutor-shelf">{visibleEditions.map(edition => {
    const tutor = tutors.get(edition.tutorId);
    const isNeighbour = selected && selected.shelfIndex === edition.shelfIndex && Math.abs(selected.slotIndex - edition.slotIndex) === 1;
    const neighbourResponse = isNeighbour && phase !== 'ROOM_IDLE' ? (edition.slotIndex < selected.slotIndex ? -.028 : .028) : 0;
    return tutor ? <TutorBook key={edition.id} edition={edition} tutor={tutor} pool={pool} phase={phase} selected={edition.id === selectedEditionId} motionProgress={motionProgress} neighbourResponse={neighbourResponse} onHover={onHover} /> : null;
  })}</group>;
}
