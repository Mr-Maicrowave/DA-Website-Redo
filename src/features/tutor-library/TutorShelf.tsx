import type { CatalogueTutor } from '../../data/teacherCatalogue';
import type { TutorBookEdition } from './tutor-library-data';
import { TutorBook } from './TutorBook';
import type { LibraryPhase } from './tutor-library-state';

export function TutorShelf({ editions, tutors, phase, selectedEditionId, motionProgress, onHover }: { editions: readonly TutorBookEdition[]; tutors: ReadonlyMap<string, CatalogueTutor>; phase: LibraryPhase; selectedEditionId?: string; motionProgress: number; onHover: (editionId: string) => void }) {
  return <group name="tutor-shelf">{editions.map(edition => {
    const tutor = tutors.get(edition.tutorId);
    const selected = editions.find(candidate => candidate.id === selectedEditionId);
    const isNeighbour = selected && selected.shelfIndex === edition.shelfIndex && Math.abs(selected.slotIndex - edition.slotIndex) === 1;
    const neighbourResponse = isNeighbour && phase !== 'ROOM_IDLE' ? (edition.slotIndex < selected.slotIndex ? -.028 : .028) : 0;
    return tutor ? <TutorBook key={edition.id} edition={edition} tutor={tutor} phase={phase} selected={edition.id === selectedEditionId} motionProgress={motionProgress} neighbourResponse={neighbourResponse} onHover={onHover} /> : null;
  })}</group>;
}
