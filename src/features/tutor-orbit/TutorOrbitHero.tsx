import {
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TUTORS,
  type CatalogueTutor,
} from '@/data/teacherCatalogue';
import {
  DEFAULT_FEATURED_TUTOR_ID,
  INNER_ORBIT_TUTOR_IDS,
  OUTER_ORBIT_TUTOR_IDS,
  selectionSequenceFor,
  swapFacultyTutor,
  type OrbitTier,
  type SelectionPhase,
} from './tutor-orbit-config';
import { TutorOrbitProfile } from './TutorOrbitProfile';
import { TutorOrbitMobileNavigator } from './TutorOrbitMobileNavigator';
import { TutorOrbitStage } from './TutorOrbitStage';
import { supportingTutorIds } from './tutor-orbit-responsive-helpers';
import {
  canBeginSelection,
  transitionSelectionLock,
} from './tutor-orbit-stage-helpers';
import './tutor-orbit.css';

const tutorById = (id: string) => TUTORS.find((tutor) => tutor.id === id);

export function TutorOrbitHero() {
  const reduced = Boolean(useReducedMotion());
  const [activeId, setActiveId] = useState(DEFAULT_FEATURED_TUTOR_ID);
  const [innerIds, setInnerIds] = useState<string[]>(() => [...INNER_ORBIT_TUTOR_IDS]);
  const [outerIds, setOuterIds] = useState<string[]>(() => [...OUTER_ORBIT_TUTOR_IDS]);
  const [selection, setSelection] = useState<{ phase: SelectionPhase; selectedId: string | null; originTier: OrbitTier | null }>({
    phase: 'idle',
    selectedId: null,
    originTier: null,
  });
  const timers = useRef<number[]>([]);
  const selectionLock = useRef({ locked: false });

  const active = useMemo(() => tutorById(activeId) ?? tutorById(DEFAULT_FEATURED_TUTOR_ID), [activeId]);
  const innerTutors = useMemo(
    () => innerIds.map(tutorById).filter((tutor): tutor is CatalogueTutor => Boolean(tutor)),
    [innerIds],
  );
  const outerTutors = useMemo(
    () => outerIds.map(tutorById).filter((tutor): tutor is CatalogueTutor => Boolean(tutor)),
    [outerIds],
  );
  const supportingTutors = useMemo(
    () => supportingTutorIds(activeId, innerIds, outerIds)
      .map(tutorById)
      .filter((tutor): tutor is CatalogueTutor => Boolean(tutor)),
    [activeId, innerIds, outerIds],
  );

  const clearSelectionTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => () => {
    clearSelectionTimers();
    selectionLock.current = transitionSelectionLock(selectionLock.current, 'cleanup');
  }, [clearSelectionTimers]);

  if (!active) return null;

  const selectTutor = (selectedId: string) => {
    if (selection.phase !== 'idle' || !canBeginSelection(selectionLock.current)) return false;
    const originTier: OrbitTier = innerIds.includes(selectedId) ? 'inner' : 'outer';
    const result = swapFacultyTutor(activeId, innerIds, outerIds, selectedId);
    if (result.selectedSlot === -1) return false;

    selectionLock.current = transitionSelectionLock(selectionLock.current, 'select');
    clearSelectionTimers();
    for (const step of selectionSequenceFor(originTier, reduced)) {
      timers.current.push(window.setTimeout(() => {
        setSelection({
          phase: step.phase,
          selectedId: step.phase === 'idle' ? null : selectedId,
          originTier: step.phase === 'idle' ? null : originTier,
        });
        if (step.phase === 'exchanging') {
          setActiveId(result.activeId);
          setInnerIds(result.innerIds);
          setOuterIds(result.outerIds);
        }
        if (step.phase === 'idle') {
          timers.current = [];
          selectionLock.current = transitionSelectionLock(selectionLock.current, 'idle');
        }
      }, step.at));
    }
    return true;
  };

  return (
    <section className="tutor-orbit" aria-labelledby="tutor-orbit-title">
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
        <Link className="tutor-orbit__directory-link" to="/find-teacher">
          Explore the whole team <ArrowRight aria-hidden="true" />
        </Link>
      </motion.div>

      <LayoutGroup id="tutor-faculty-orbit">
        <TutorOrbitStage
          active={active}
          innerTutors={innerTutors}
          outerTutors={outerTutors}
          phase={selection.phase}
          selectedId={selection.selectedId}
          originTier={selection.originTier}
          reduced={reduced}
          onSelect={selectTutor}
        />
        <TutorOrbitMobileNavigator
          tutors={supportingTutors}
          reduced={reduced}
          onSelect={selectTutor}
        />
        <TutorOrbitProfile tutor={active} reduced={reduced} changing={selection.phase !== 'idle'} />
      </LayoutGroup>
    </section>
  );
}
