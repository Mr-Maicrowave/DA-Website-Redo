import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, HeartHandshake, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  teachesEnglish,
  teachesMath,
  teachesScience,
  type CatalogueTutor,
} from '@/data/teacherCatalogue';

export const shellVariants = {
  idle: { y: 0 },
  changing: { y: -6 },
};

export const contentVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function subjectLabels(tutor: CatalogueTutor) {
  const labels: string[] = [];
  if (teachesEnglish(tutor)) labels.push('English');
  if (teachesMath(tutor)) labels.push('Mathematics');
  if (teachesScience(tutor)) labels.push('Science');
  if (tutor.hasPrimary) labels.push('Primary');
  return labels.slice(0, 3);
}

interface TutorOrbitProfileProps {
  tutor: CatalogueTutor;
  reduced: boolean;
  changing: boolean;
}

export function TutorOrbitProfile({ tutor, reduced, changing }: TutorOrbitProfileProps) {
  const subjects = subjectLabels(tutor);
  const strengths = (tutor.profile?.tags ?? []).slice(0, 3);
  const profileHref = `/find-teacher?tutor=${tutor.id}`;
  const animationState = reduced ? 'idle' : changing ? 'changing' : 'idle';

  return (
    <motion.aside
      className="tutor-orbit__profile"
      aria-live="polite"
      initial={false}
      animate={animationState}
      variants={shellVariants}
      transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tutor.id}
          className="tutor-orbit__profile-sequence"
          variants={reduced ? undefined : contentVariants}
          initial={reduced ? false : 'hidden'}
          animate={reduced ? undefined : 'visible'}
          exit={reduced ? undefined : 'exit'}
        >
          <motion.div className="tutor-orbit__profile-heading" variants={reduced ? undefined : itemVariants}>
            <p>{tutor.tier === 'senior' ? 'Senior educator' : 'Educator'}</p>
            <Sparkles aria-hidden="true" />
          </motion.div>
          <motion.h2 className="tutor-orbit__profile-name" variants={reduced ? undefined : itemVariants}>{tutor.name}</motion.h2>
          <motion.p className="tutor-orbit__designation" variants={reduced ? undefined : itemVariants}>
            {tutor.designation}
          </motion.p>
          <motion.dl
            className="tutor-orbit__details tutor-orbit__profile-details"
            variants={reduced ? undefined : itemVariants}
          >
            <div><dt>Subjects</dt><dd className="tutor-orbit__subjects">{subjects.map((subject) => <span key={subject}>{subject}</span>)}</dd></div>
            <div><dt>Year levels</dt><dd>{tutor.hasPrimary ? 'Primary–Year 12' : 'Years 7–12'}</dd></div>
          </motion.dl>
          <motion.dl className="tutor-orbit__details tutor-orbit__profile-teaching" variants={reduced ? undefined : itemVariants}>
            <div><dt>Teaching style</dt><dd>&ldquo;{tutor.tagline}&rdquo;</dd></div>
          </motion.dl>
          <motion.div className="tutor-orbit__strengths" variants={reduced ? undefined : itemVariants}>
            <p>Strengths</p>
            <ul>
              {strengths.map((strength, index) => {
                const Icon = [HeartHandshake, BookOpen, Sparkles][index] ?? Sparkles;
                return <li key={strength}><Icon aria-hidden="true" /><span>{strength}</span></li>;
              })}
            </ul>
          </motion.div>
          <motion.div className="tutor-orbit__profile-cta" variants={reduced ? undefined : itemVariants}>
            <Link className="tutor-orbit__profile-link" to={profileHref}>
              Open full profile <ArrowRight aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
}
