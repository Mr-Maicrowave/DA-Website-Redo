import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  TUTORS,
  type CatalogueTutor,
  getPhotoStyle,
  getPhotoUrl,
} from '@/data/teacherCatalogue';
import { profileContentFor, profilePronounsFor, profileSubjectGroupsFor } from '@/pages/profileContent';
import { resetProfileScroll } from '@/pages/profileNavigation';
import '@/pages/FindTeacher.css';

interface FullTutorProfileProps {
  teacher: CatalogueTutor;
  position: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  returnFocusTo: HTMLElement | null;
}

const firstName = (name: string) => name.replace(/^(Mr|Mrs|Ms|Miss|Dr)\.?\s+/i, '').split(/\s+/)[0];

const subjectLabel = (teacher: CatalogueTutor) => {
  const subject = teacher.primarySubject === 'math'
    ? 'Mathematics'
    : teacher.primarySubject === 'both'
      ? 'English · Mathematics'
      : teacher.primarySubject[0].toUpperCase() + teacher.primarySubject.slice(1);
  return teacher.hasPrimary ? `Primary · ${subject}` : subject;
};

const subjects = (teacher: CatalogueTutor) => teacher.subjects.split('/').map(item => item.trim());

function Portrait({ teacher }: { teacher: CatalogueTutor }) {
  return (
    <img
      src={getPhotoUrl(teacher)}
      alt={`Portrait of ${teacher.name}, DA Tuition educator`}
      loading="eager"
      style={getPhotoStyle(teacher)}
    />
  );
}

export function FullTutorProfile({
  teacher,
  position,
  onClose,
  onPrevious,
  onNext,
  returnFocusTo,
}: FullTutorProfileProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const content = profileContentFor(teacher);
  const pronouns = profilePronounsFor(teacher.name);
  const subjectGroups = profileSubjectGroupsFor(subjects(teacher));

  useLayoutEffect(() => {
    resetProfileScroll(scrollRef.current);
  }, [teacher.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add('teacher-profile-open');
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrevious();
      if (event.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
      document.body.classList.remove('teacher-profile-open');
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus();
    };
  }, [onClose, onNext, onPrevious, returnFocusTo, teacher.id]);

  return (
    <motion.div
      ref={panelRef}
      className="full-profile"
      role="dialog"
      aria-modal="true"
      aria-labelledby="full-profile-name"
      tabIndex={-1}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.42, ease: [0.2, 0.75, 0.2, 1] }}
    >
      <header className="full-profile__nav">
        <button type="button" onClick={onClose}><ArrowLeft /> All educators</button>
        <span>{String(position).padStart(2, '0')} / {String(TUTORS.length).padStart(2, '0')}</span>
        <div>
          <button type="button" onClick={onPrevious} disabled={position === 1} aria-label="Previous educator"><ChevronLeft /></button>
          <button type="button" onClick={onNext} disabled={position === TUTORS.length} aria-label="Next educator"><ChevronRight /></button>
          <button type="button" onClick={onClose} aria-label="Close profile"><X /></button>
        </div>
      </header>

      <div ref={scrollRef} className="full-profile__scroll">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.section
            key={teacher.id}
            className="full-profile__layout"
            initial={{ opacity: 0, x: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : -18 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.26, ease: [0.2, 0.75, 0.2, 1] }}
          >
            <aside className="full-profile__rail" aria-label={`${teacher.name} portrait`}>
              <div className="full-profile__photo"><Portrait teacher={teacher} /></div>
            </aside>

            <main className="full-profile__content">
              <header className="full-profile__intro">
                <p>{subjectLabel(teacher)}</p>
                <div className="full-profile__subject-chips" aria-label={`Subjects taught by ${teacher.name}`}>
                  {subjectGroups.map(group => (
                    <span key={group.category} className={`full-profile__subject-chip full-profile__subject-chip--${group.category}`}>
                      {group.label}
                    </span>
                  ))}
                </div>
                <h1 id="full-profile-name">{teacher.name}</h1>
                <h2>{teacher.designation}</h2>
                <blockquote>“{teacher.tagline}”</blockquote>
              </header>

              {content.strengths.length > 0 && (
                <section className="full-profile__strengths">
                  <h2>Teaching strengths</h2>
                  <ul>{content.strengths.map(strength => <li key={strength}>{strength}</li>)}</ul>
                </section>
              )}

              <section className="full-profile__story">
                <div>
                  <h2>{pronouns.possessive[0].toUpperCase() + pronouns.possessive.slice(1)} approach</h2>
                  <p>{content.approach}</p>
                </div>
                <div>
                  <h2>What {pronouns.subject} {pronouns.subject === 'they' ? 'hope' : 'hopes'} students remember</h2>
                  <p>{content.remembered}</p>
                </div>
              </section>

              <section className="full-profile__why-da">
                <h2>Why {firstName(teacher.name)} teaches at DA</h2>
                <p>{content.whyDA}</p>
              </section>
            </main>
          </motion.section>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
