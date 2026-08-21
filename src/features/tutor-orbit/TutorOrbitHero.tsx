import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { TUTORS, getPhotoStyle, getPhotoUrl, type CatalogueTutor } from '@/data/teacherCatalogue';
import { FEATURED_TUTOR_IDS, TUTOR_ORBIT_LAYOUT, orbitMotionFor, orbitPositionFor } from './tutor-orbit-config';
import './tutor-orbit.css';

const featured = FEATURED_TUTOR_IDS.map(id => TUTORS.find(t => t.id === id)).filter((t): t is CatalogueTutor => Boolean(t));

const subject = (tutor: CatalogueTutor) => tutor.primarySubject === 'math' ? 'Mathematics' : tutor.primarySubject === 'both' ? 'English & Mathematics' : tutor.primarySubject[0].toUpperCase() + tutor.primarySubject.slice(1);

export function TutorOrbitHero() {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(FEATURED_TUTOR_IDS[5]);
  const active = useMemo(() => featured.find(t => t.id === activeId) ?? featured[0], [activeId]);
  if (!active) return null;
  const choose = (id: string) => { setActiveId(id as typeof activeId); };

  return <section className={`tutor-orbit tutor-orbit--${TUTOR_ORBIT_LAYOUT}`} aria-labelledby="tutor-orbit-title">
    <div className="tutor-orbit__glow" aria-hidden="true" />
    <div className="tutor-orbit__vignette" aria-hidden="true" />
    <div className="tutor-orbit__heading">
      <p>Meet the people behind the progress</p>
      <h1 id="tutor-orbit-title">Find the teacher your child will remember.</h1>
      <div className="tutor-orbit__intro"><span>A great match is more than a subject. Explore the mentors who bring clarity, momentum and belief to every lesson.</span><Link to="/find-teacher">Meet the whole team <ArrowRight /></Link></div>
    </div>
    <div className="tutor-orbit__stage">
      <div className="tutor-orbit__ring" aria-hidden="true" />
      <div className="tutor-orbit__comet" aria-hidden="true"><div className="tutor-orbit__comet-spin"><span /></div></div>
      {featured.map((tutor, index) => {
        const drift = orbitMotionFor(tutor.id);
        const isActive = tutor.id === active.id;
        return <motion.button key={tutor.id} type="button" className={`tutor-orbit__satellite tutor-orbit__satellite--${orbitPositionFor(tutor.id)}${isActive ? ' is-active' : ''}`} onMouseEnter={() => choose(tutor.id)} onFocus={() => choose(tutor.id)} onClick={() => choose(tutor.id)} animate={reduced ? { scale: isActive ? 1.1 : .84, opacity: isActive ? 1 : .72 } : { x: drift.x, y: drift.y, scale: isActive ? 1.1 : .84, opacity: isActive ? 1 : .72 }} transition={{ x: { duration: drift.duration, delay: index * .36, repeat: Infinity, ease: 'easeInOut' }, y: { duration: drift.duration, delay: index * .36, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: .36, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: .3, ease: 'easeOut' } }} aria-label={`Preview ${tutor.name}`}>
          <img src={getPhotoUrl(tutor)} alt="" style={getPhotoStyle(tutor)} />
        </motion.button>;
      })}
      <div className="tutor-orbit__centre">
        <AnimatePresence mode="wait"><motion.img key={active.id} src={getPhotoUrl(active)} alt={`${active.name}, DA Tuition educator`} style={getPhotoStyle(active)} initial={reduced ? false : { opacity: 0, scale: 1.045, filter: 'blur(5px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={reduced ? undefined : { opacity: 0, scale: .98, filter: 'blur(4px)' }} transition={{ duration: .42, ease: [0.16, 1, 0.3, 1] }} /></AnimatePresence>
      </div>
      <div className="tutor-orbit__name"><strong>{active.name}</strong><span>{active.designation} · {subject(active)}</span></div>
    </div>
    <motion.aside className="tutor-orbit__card" initial={reduced ? false : { opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .32 }}>
      <h2>{active.name}</h2><em>{active.designation}</em><div>{(active.profile?.tags ?? [subject(active), 'Warm, clear support', 'Confidence-building']).slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><p>“{active.motto}”</p><Link to="/find-teacher">Meet the whole team <ArrowRight /></Link>
    </motion.aside>
  </section>;
}
