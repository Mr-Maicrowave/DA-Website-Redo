import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, type PointerEvent } from 'react';
import { getPhotoStyle, getPhotoUrl, type CatalogueTutor } from '@/data/teacherCatalogue';
import { nextRosterPage, rosterWindow } from './tutor-orbit-config';

interface TutorOrbitMobileNavigatorProps {
  tutors: readonly CatalogueTutor[];
  activeId: string;
  reduced: boolean;
  onSelect: (id: string) => boolean;
}

export function TutorOrbitMobileNavigator({
  tutors,
  activeId,
  reduced,
  onSelect,
}: TutorOrbitMobileNavigatorProps) {
  const [page, setPage] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const visibleIds = rosterWindow(tutors.map((tutor) => tutor.id), page, 4);
  const visibleTutors = visibleIds
    .map((id) => tutors.find((tutor) => tutor.id === id))
    .filter((tutor): tutor is CatalogueTutor => Boolean(tutor));
  const start = tutors.length === 0 ? 0 : page * 4 + 1;
  const end = Math.min(start + 3, tutors.length);
  const changePage = (direction: 1 | -1) => {
    setPage((current) => nextRosterPage(current, direction, tutors.length, 4));
  };
  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy)) {
      setPage((current) => nextRosterPage(current, dx < 0 ? 1 : -1, tutors.length, 4));
    }
    pointerStart.current = null;
  };

  return (
    <nav
      className="tutor-orbit__mobile-navigator"
      aria-label="Educator navigator"
      onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; }}
      onPointerUp={finishSwipe}
      onPointerCancel={() => { pointerStart.current = null; }}
    >
      <div className="tutor-orbit__navigator-heading">
        <p aria-live="polite">Educators {start}–{end} of {tutors.length}</p>
        <div className="tutor-orbit__navigator-controls">
          <button type="button" aria-label="Previous educators" onClick={() => changePage(-1)}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next educators" onClick={() => changePage(1)}>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={page}
          className="tutor-orbit__navigator-roster"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: reduced ? 0.12 : 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          {visibleTutors.map((tutor) => (
            <button
              key={tutor.id}
              type="button"
              className="tutor-orbit__navigator-tutor"
              aria-current={tutor.id === activeId ? 'true' : undefined}
              aria-label={`View ${tutor.name}`}
              onClick={() => onSelect(tutor.id)}
            >
              <span className="tutor-orbit__navigator-portrait">
                <img src={getPhotoUrl(tutor)} alt="" style={getPhotoStyle(tutor)} />
              </span>
              <span>{tutor.name}</span>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}
