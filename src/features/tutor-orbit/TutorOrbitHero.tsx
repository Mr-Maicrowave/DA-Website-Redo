import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight, BookOpen, HeartHandshake, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  TUTORS,
  teachesEnglish,
  teachesMath,
  teachesScience,
  type CatalogueTutor,
} from '@/data/teacherCatalogue';
import {
  DEFAULT_FEATURED_TUTOR_ID,
  INNER_ORBIT_TUTOR_IDS,
  OUTER_ORBIT_TUTOR_IDS,
  selectionSequenceFor,
  swapFacultyTutor,
  type SelectionPhase,
} from './tutor-orbit-config';
import { TutorOrbitStage } from './TutorOrbitStage';
import './tutor-orbit.css';

const tutorById = (id: string) => TUTORS.find((tutor) => tutor.id === id);

function subjectLabels(tutor: CatalogueTutor) {
  const labels: string[] = [];
  if (teachesEnglish(tutor)) labels.push('English');
  if (teachesMath(tutor)) labels.push('Mathematics');
  if (teachesScience(tutor)) labels.push('Science');
  if (tutor.hasPrimary) labels.push('Primary');
  return labels.slice(0, 3);
}

export function TutorOrbitHero() {
  const reduced = Boolean(useReducedMotion());
  const [activeId, setActiveId] = useState(DEFAULT_FEATURED_TUTOR_ID);
  const [innerIds, setInnerIds] = useState<string[]>(() => [...INNER_ORBIT_TUTOR_IDS]);
  const [outerIds, setOuterIds] = useState<string[]>(() => [...OUTER_ORBIT_TUTOR_IDS]);
  const [phase, setPhase] = useState<SelectionPhase>('idle');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [originTier, setOriginTier] = useState<'inner' | 'outer' | null>(null);
  const transitionTimers = useRef<number[]>([]);

  const active = useMemo(() => tutorById(activeId) ?? tutorById(DEFAULT_FEATURED_TUTOR_ID), [activeId]);
  const innerTutors = useMemo(
    () => innerIds.map(tutorById).filter((tutor): tutor is CatalogueTutor => Boolean(tutor)),
    [innerIds],
  );
  const outerTutors = useMemo(
    () => outerIds.map(tutorById).filter((tutor): tutor is CatalogueTutor => Boolean(tutor)),
    [outerIds],
  );

  useEffect(() => () => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  if (!active) return null;

  const selectTutor = (selectedId: string) => {
    const result = swapFacultyTutor(activeId, innerIds, outerIds, selectedId);
    if (result.selectedSlot === -1 || phase !== 'idle') return;

    setSelectedId(selectedId);
    setOriginTier(result.selectedTier);
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    const steps = selectionSequenceFor(result.selectedTier, reduced);
    const applyStep = (nextPhase: SelectionPhase) => {
      setPhase(nextPhase);
      if (nextPhase === 'exchanging') {
        setActiveId(result.activeId);
        setInnerIds(result.innerIds);
        setOuterIds(result.outerIds);
      }
      if (nextPhase === 'idle') {
        setSelectedId(null);
        setOriginTier(null);
        transitionTimers.current = [];
      }
    };
    applyStep(steps[0].phase);
    transitionTimers.current = steps.slice(1).map(({ phase: nextPhase, at }) => (
      window.setTimeout(() => applyStep(nextPhase), at)
    ));
  };

  const subjects = subjectLabels(active);
  const strengths = (active.profile?.tags ?? []).slice(0, 3);
  const profileHref = `/find-teacher?tutor=${active.id}`;

  return (
    <section className="tutor-orbit" aria-labelledby="tutor-orbit-title">
      <div className="tutor-orbit__ambient" aria-hidden="true" />

      <div className="tutor-orbit__editorial">
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
      </div>

      <LayoutGroup id="tutor-faculty-orbit">
        <TutorOrbitStage
          active={active}
          innerTutors={innerTutors}
          outerTutors={outerTutors}
          phase={phase}
          selectedId={selectedId}
          originTier={originTier}
          reduced={reduced}
          onSelect={selectTutor}
        />

        <motion.aside className="tutor-orbit__profile" aria-live="polite" initial={false} animate={{ opacity: 1 }}>
          <div className="tutor-orbit__profile-heading">
            <p>{active.tier === 'senior' ? 'Senior educator' : 'Educator'}</p>
            <Sparkles aria-hidden="true" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="tutor-orbit__profile-content"
              key={active.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <h2>{active.name}</h2>
              <p className="tutor-orbit__designation">{active.designation}</p>
              <dl className="tutor-orbit__details">
                <div><dt>Subjects</dt><dd className="tutor-orbit__subjects">{subjects.map((item) => <span key={item}>{item}</span>)}</dd></div>
                <div><dt>Year levels</dt><dd>{active.hasPrimary ? 'Primary–Year 12' : 'Years 7–12'}</dd></div>
                <div><dt>Teaching style</dt><dd>&ldquo;{active.tagline}&rdquo;</dd></div>
              </dl>
              <div className="tutor-orbit__strengths">
                <p>Strengths</p>
                <ul>
                  {strengths.map((strength, index) => {
                    const Icon = [HeartHandshake, BookOpen, Sparkles][index] ?? Sparkles;
                    return <li key={strength}><Icon aria-hidden="true" /><span>{strength}</span></li>;
                  })}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          <Link className="tutor-orbit__profile-link" to={profileHref}>Open full profile <ArrowRight aria-hidden="true" /></Link>
        </motion.aside>
      </LayoutGroup>
    </section>
  );
}
