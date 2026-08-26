import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TUTORS, type CatalogueTutor } from '@/data/teacherCatalogue';
import { DEFAULT_FEATURED_TUTOR_ID, FACULTY_ROSTER_IDS } from './tutor-orbit-config';
import { TutorProcessionStage } from './TutorProcessionStage';
import { canBeginSelection, transitionSelectionLock } from './tutor-orbit-stage-helpers';
import './tutor-orbit.css';
import './tutor-procession.css';

const tutorById = (id: string) => TUTORS.find((tutor) => tutor.id === id);

/** Phase one: the centre swaps on a short beat. The travelling exchange lands next. */
const EXCHANGE_MS = 520;
const REDUCED_EXCHANGE_MS = 180;

export function TutorOrbitHero({ onExplore }: { onExplore?: () => void }) {
  const reduced = Boolean(useReducedMotion());
  const [activeId, setActiveId] = useState(DEFAULT_FEATURED_TUTOR_ID);
  const [exchanging, setExchanging] = useState(false);
  const timers = useRef<number[]>([]);
  const selectionLock = useRef({ locked: false });
  const featuredActionRef = useRef<HTMLAnchorElement>(null);
  const pendingCentreFocusId = useRef<string | null>(null);

  const active = useMemo(
    () => tutorById(activeId) ?? tutorById(DEFAULT_FEATURED_TUTOR_ID),
    [activeId],
  );
  const roster = useMemo(
    () => FACULTY_ROSTER_IDS
      .map(tutorById)
      .filter((tutor): tutor is CatalogueTutor => Boolean(tutor)),
    [],
  );

  const clearSelectionTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => () => {
    clearSelectionTimers();
    selectionLock.current = transitionSelectionLock(selectionLock.current, 'cleanup');
  }, [clearSelectionTimers]);

  useEffect(() => {
    if (exchanging || pendingCentreFocusId.current !== activeId) return;
    featuredActionRef.current?.focus({ preventScroll: true });
    pendingCentreFocusId.current = null;
  }, [activeId, exchanging]);

  if (!active) return null;

  const selectTutor = (selectedId: string, options?: { focusCentre?: boolean }) => {
    if (exchanging || selectedId === activeId) return false;
    if (!canBeginSelection(selectionLock.current)) return false;

    pendingCentreFocusId.current = options?.focusCentre ? selectedId : null;
    selectionLock.current = transitionSelectionLock(selectionLock.current, 'select');
    clearSelectionTimers();
    setExchanging(true);
    setActiveId(selectedId);

    timers.current.push(window.setTimeout(() => {
      setExchanging(false);
      timers.current = [];
      selectionLock.current = transitionSelectionLock(selectionLock.current, 'idle');
    }, reduced ? REDUCED_EXCHANGE_MS : EXCHANGE_MS));

    return true;
  };

  return (
    <section className="tutor-orbit tutor-orbit--procession" aria-labelledby="tutor-orbit-title">
      <div className="tutor-orbit__ambient" aria-hidden="true" />

      <motion.div
        className="tutor-orbit__editorial"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.12, duration: reduced ? 0 : 0.5 }}
      >
        <p className="tutor-orbit__eyebrow">Meet the people behind the progress</p>
        <h1 id="tutor-orbit-title">Meet the educators students <em>remember.</em></h1>
        <div className="tutor-orbit__rule" aria-hidden="true"><span /></div>
        <p className="tutor-orbit__lede">
          Great teaching is more than knowledge. It&apos;s the belief, encouragement and people who
          keep showing up for their students.
        </p>
        {onExplore ? (
          <button type="button" className="tutor-orbit__directory-link" onClick={onExplore}>
            Explore the whole team <ArrowRight aria-hidden="true" />
          </button>
        ) : null}
      </motion.div>

      <TutorProcessionStage
        active={active}
        roster={roster}
        reduced={reduced}
        exchanging={exchanging}
        onSelect={selectTutor}
        featuredActionRef={featuredActionRef}
      />
    </section>
  );
}
