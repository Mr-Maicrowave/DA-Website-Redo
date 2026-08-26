import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { getPhotoStyle, getPhotoUrl, type CatalogueTutor } from '@/data/teacherCatalogue';
import { nextRosterPage, rosterWindow } from './tutor-orbit-config';
import {
  NAVIGATOR_PAGE_SIZE,
  beginNavigatorSwipe,
  cancelNavigatorSwipe,
  consumeNavigatorClickSuppression,
  finishNavigatorSwipe,
  navigatorRosterStatus,
  trackNavigatorSwipe,
  type NavigatorSwipeState,
} from './tutor-orbit-responsive-helpers';

interface TutorOrbitMobileNavigatorProps {
  tutors: readonly CatalogueTutor[];
  activeId: string;
  reduced: boolean;
  onSelect: (id: string, options?: { focusCentre?: boolean }) => boolean;
}

export function TutorOrbitMobileNavigator({
  tutors,
  activeId,
  reduced,
  onSelect,
}: TutorOrbitMobileNavigatorProps) {
  const [page, setPage] = useState(0);
  const swipeState = useRef<NavigatorSwipeState>({ pointerId: null, x: 0, y: 0, captured: false, accepted: false, suppressClickUntil: 0 });
  const visibleIds = rosterWindow(tutors.map((tutor) => tutor.id), page, NAVIGATOR_PAGE_SIZE);
  const visibleTutors = visibleIds
    .map((id) => tutors.find((tutor) => tutor.id === id))
    .filter((tutor): tutor is CatalogueTutor => Boolean(tutor));
  const changePage = (direction: 1 | -1) => {
    setPage((current) => nextRosterPage(current, direction, tutors.length, NAVIGATOR_PAGE_SIZE));
  };
  const trackSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const result = trackNavigatorSwipe(swipeState.current, event.pointerId, event.clientX, event.clientY);
    swipeState.current = result.state;
    if (result.accepted) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setPage((current) => nextRosterPage(current, result.direction, tutors.length, NAVIGATOR_PAGE_SIZE));
    }
  };
  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const wasCaptured = swipeState.current.pointerId === event.pointerId && swipeState.current.captured;
    swipeState.current = finishNavigatorSwipe(swipeState.current, event.pointerId, Date.now());
    if (wasCaptured && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const cancelSwipe = (event: PointerEvent<HTMLDivElement>) => {
    swipeState.current = cancelNavigatorSwipe(swipeState.current, event.pointerId);
  };
  const suppressSwipeClick = (event: MouseEvent<HTMLElement>) => {
    // Keyboard activation must always retain native button semantics.
    const detail = event.detail === 0 ? 0 : event.detail;
    const result = consumeNavigatorClickSuppression(swipeState.current, detail, Date.now());
    swipeState.current = result.state;
    if (result.suppressed) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <nav
      className="tutor-orbit__mobile-navigator"
      aria-label="Educator navigator"
      onPointerDown={(event) => {
        swipeState.current = beginNavigatorSwipe(event.pointerId, event.clientX, event.clientY);
      }}
      onPointerMove={trackSwipe}
      onPointerUp={finishSwipe}
      onPointerCancel={cancelSwipe}
      onLostPointerCapture={cancelSwipe}
      onClickCapture={suppressSwipeClick}
    >
      <div className="tutor-orbit__navigator-heading">
        <p aria-live="polite">{navigatorRosterStatus(tutors.length, page)}</p>
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
          {visibleTutors.map((tutor) => {
            const isActive = tutor.id === activeId;
            return (
              <button
                key={tutor.id}
                type="button"
                className="tutor-orbit__navigator-tutor"
                aria-label={isActive ? `${tutor.name}, current featured educator` : `View ${tutor.name}`}
                aria-current={isActive ? 'true' : undefined}
                aria-disabled={isActive ? 'true' : undefined}
                onClick={(event) => {
                  if (!isActive) onSelect(tutor.id, { focusCentre: event.detail === 0 });
                }}
              >
              <span
                className="tutor-orbit__navigator-portrait"
                data-orbit-portrait=""
                data-orbit-tier="navigator"
                data-tutor-id={tutor.id}
              >
                <img src={getPhotoUrl(tutor)} alt="" style={getPhotoStyle(tutor)} />
              </span>
              <span data-orbit-label="" data-tutor-id={tutor.id}>{tutor.name}</span>
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}
