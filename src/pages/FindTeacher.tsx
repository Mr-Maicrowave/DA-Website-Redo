import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';
import {
  TUTORS,
  type CatalogueTutor,
  getPhotoStyle,
  getPhotoUrl,
  teachesEnglish,
  teachesMath,
  teachesScience,
} from '@/data/teacherCatalogue';
import './FindTeacher.css';

type FilterKey = 'all' | 'english' | 'maths' | 'science' | 'primary';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All educators' },
  { key: 'english', label: 'English' },
  { key: 'maths', label: 'Mathematics' },
  { key: 'science', label: 'Science' },
  { key: 'primary', label: 'Primary' },
];

const subjectLabel = (teacher: CatalogueTutor) => {
  if (teacher.hasPrimary && teacher.primarySubject === 'both') return 'Primary · English & Mathematics';
  const subject = teacher.primarySubject === 'math' ? 'Mathematics' : teacher.primarySubject[0].toUpperCase() + teacher.primarySubject.slice(1);
  return teacher.hasPrimary ? `Primary · ${subject}` : subject;
};

const firstName = (name: string) => name.replace(/^(Mr|Mrs|Ms|Miss|Dr)\.?\s+/i, '').split(/\s+/)[0];

const subjectList = (teacher: CatalogueTutor) => teacher.subjects.split('/').map(item => item.trim());

const fitGuidance = (teacher: CatalogueTutor) => {
  const subject = teacher.primarySubject === 'english'
    ? 'needs clearer structure and confidence in reading or writing'
    : teacher.primarySubject === 'math'
      ? 'benefits from patient, step-by-step mathematical reasoning'
      : teacher.primarySubject === 'science'
        ? 'is curious, analytical, and wants ideas made memorable'
        : 'is building strong foundations across English and mathematics';
  const pace = teacher.tier === 'senior'
    ? 'responds well to high expectations delivered with close guidance'
    : 'does best with steady encouragement and a clear lesson rhythm';
  return [subject, pace, 'values a teacher who notices the person behind the marks'];
};

const Portrait = ({ teacher, eager = false }: { teacher: CatalogueTutor; eager?: boolean }) => (
  <img
    src={getPhotoUrl(teacher)}
    alt={`Portrait of ${teacher.name}, DA Tuition educator`}
    loading={eager ? 'eager' : 'lazy'}
    style={getPhotoStyle(teacher)}
  />
);

function EducatorTile({
  teacher,
  index,
  onOpen,
}: {
  teacher: CatalogueTutor;
  index: number;
  onOpen: (teacher: CatalogueTutor, trigger: HTMLButtonElement) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <motion.button
      ref={ref}
      type="button"
      className={`faculty-tile faculty-tile--${(index % 7) + 1}`}
      onClick={() => ref.current && onOpen(teacher, ref.current)}
      aria-label={`Open the full profile for ${teacher.name}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: Math.min(index % 5, 3) * 0.045, ease: [0.2, 0.75, 0.2, 1] }}
    >
      <span className="faculty-tile__portrait">
        <Portrait teacher={teacher} />
      </span>
      <span className="faculty-tile__rail" aria-hidden="true">
        <span className="faculty-tile__rail-label">Good fit if your child…</span>
        <span className="faculty-tile__rail-copy">{fitGuidance(teacher)[0]}</span>
        <span className="faculty-tile__rail-link">Open profile <ArrowRight /></span>
      </span>
      <span className="faculty-tile__caption">
        <span>
          <strong>{teacher.name}</strong>
          <em>{teacher.designation}</em>
        </span>
        <small>{subjectLabel(teacher)}</small>
      </span>
    </motion.button>
  );
}

function ProfileView({
  teacher,
  position,
  total,
  onClose,
  onPrevious,
  onNext,
  returnFocusTo,
}: {
  teacher: CatalogueTutor;
  position: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  returnFocusTo: HTMLElement | null;
}) {
  const profileRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const profile = profileRef.current;
    profile?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrevious();
      if (event.key === 'ArrowRight') onNext();
      if (event.key !== 'Tab' || !profile) return;
      const focusable = Array.from(profile.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      returnFocusTo?.focus();
    };
  }, [onClose, onNext, onPrevious, returnFocusTo, teacher.id]);

  const profile = teacher.profile;
  const previousDisabled = position === 1;
  const nextDisabled = position === total;

  return (
    <motion.div
      ref={profileRef}
      className="educator-profile"
      role="dialog"
      aria-modal="true"
      aria-labelledby="educator-profile-title"
      tabIndex={-1}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.45, ease: [0.2, 0.75, 0.2, 1] }}
    >
      <header className="profile-nav">
        <button type="button" className="profile-nav__back" onClick={onClose}>
          <ArrowLeft /> <span>All educators</span>
        </button>
        <div className="profile-nav__position" aria-live="polite">
          <span>{String(position).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
        </div>
        <div className="profile-nav__steps">
          <button type="button" onClick={onPrevious} disabled={previousDisabled} aria-label="Previous educator"><ChevronLeft /></button>
          <span>Previous / Next</span>
          <button type="button" onClick={onNext} disabled={nextDisabled} aria-label="Next educator"><ChevronRight /></button>
          <button type="button" className="profile-nav__close" onClick={onClose} aria-label="Close profile"><X /></button>
        </div>
      </header>

      <div className="profile-scroll">
        <section className="profile-hero">
          <div className="profile-hero__portrait"><Portrait teacher={teacher} eager /></div>
          <div className="profile-hero__intro">
            <p className="profile-hero__subject">{subjectLabel(teacher)}</p>
            <h1 id="educator-profile-title">{teacher.name}</h1>
            <p className="profile-hero__signature">{teacher.designation}</p>
            <blockquote>“{teacher.tagline}”</blockquote>
            <div className="profile-hero__meta">
              <span>{teacher.tier === 'senior' ? 'Senior educator' : teacher.tier === 'mid' ? 'Experienced educator' : 'Educator'}</span>
              <span>{subjectList(teacher).length} teaching areas</span>
            </div>
            <a className="profile-hero__cta" href="/book-interview">Discuss the right class <ArrowRight /></a>
          </div>
        </section>

        <div className="profile-body">
          <aside className="profile-fit">
            <p>A good fit if your child…</p>
            <ul>
              {fitGuidance(teacher).map(item => <li key={item}>{item}</li>)}
            </ul>
            <small>Class placement also considers year level, availability and your child’s goals.</small>
          </aside>

          <main className="profile-story">
            <section>
              <h2>In the classroom</h2>
              <p className="profile-story__lead">{profile?.whyDA ?? teacher.tagline}</p>
            </section>

            <section className="profile-values">
              <h2>Teaching values</h2>
              <div>
                {(profile?.tags ?? ['Clarity', 'Care', 'Progress']).map((tag, index) => (
                  <span key={tag}><b>{String(index + 1).padStart(2, '0')}</b>{tag}</span>
                ))}
              </div>
            </section>

            <blockquote className="profile-motto">“{teacher.motto}”</blockquote>

            <section className="profile-details">
              <div>
                <h2>What I want for students</h2>
                <p>{profile?.goals ?? 'To help every student build skills, confidence and an independent approach to learning.'}</p>
              </div>
              <div>
                <h2>Subjects & year levels</h2>
                <ul>{subjectList(teacher).map(subject => <li key={subject}>{subject}</li>)}</ul>
              </div>
            </section>

            <section className="profile-remembered">
              <span>What I hope students remember</span>
              <p>{profile?.remembered ?? teacher.motto}</p>
            </section>
          </main>
        </div>

        <footer className="profile-next">
          <span>Continue through the faculty</span>
          <button type="button" onClick={nextDisabled ? onClose : onNext}>
            <span>{nextDisabled ? 'Return to catalogue' : `Meet the next educator`}</span>
            <ArrowRight />
          </button>
        </footer>
      </div>
    </motion.div>
  );
}

const FindTeacher = () => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selected, setSelected] = useState<CatalogueTutor | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'english') return TUTORS.filter(teachesEnglish);
    if (filter === 'maths') return TUTORS.filter(teachesMath);
    if (filter === 'science') return TUTORS.filter(teachesScience);
    if (filter === 'primary') return TUTORS.filter(teacher => teacher.hasPrimary);
    return TUTORS;
  }, [filter]);

  const openProfile = useCallback((teacher: CatalogueTutor, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelected(teacher);
  }, []);
  const closeProfile = useCallback(() => setSelected(null), []);
  const selectedIndex = selected ? TUTORS.findIndex(teacher => teacher.id === selected.id) : -1;
  const previous = useCallback(() => {
    if (selectedIndex > 0) setSelected(TUTORS[selectedIndex - 1]);
  }, [selectedIndex]);
  const next = useCallback(() => {
    if (selectedIndex < TUTORS.length - 1) setSelected(TUTORS[selectedIndex + 1]);
  }, [selectedIndex]);

  useEffect(() => {
    document.body.classList.toggle('teacher-profile-open', Boolean(selected));
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => {
      document.body.classList.remove('teacher-profile-open');
      document.body.style.overflow = '';
    };
  }, [selected]);

  const featured = TUTORS.slice(0, 3);
  const catalogue = filter === 'all' ? filtered.filter(teacher => !featured.some(item => item.id === teacher.id)) : filtered;

  return (
    <div className="faculty-page">
      <SEO
        title="Meet Our Educators"
        description="Meet DA Tuition's educators across Primary, English, Mathematics and Science for Years 3–12."
        canonicalUrl="/find-teacher"
      />
      <NavigationNew />

      <main>
        <section className="faculty-hero">
          <div className="faculty-hero__copy">
            <p className="faculty-kicker">The people your child learns beside</p>
            <h1>Meet our<br /><i>educators.</i></h1>
            <p className="faculty-hero__intro">Great teaching is personal. Meet a faculty chosen for subject knowledge, clarity and the rare ability to make a student feel truly seen.</p>
            <a href="#faculty-catalogue">Browse the faculty <ArrowRight /></a>
          </div>
          <div className="faculty-hero__portraits" aria-label="A selection of DA Tuition educators">
            {featured.map((teacher, index) => (
              <button key={teacher.id} type="button" onClick={event => openProfile(teacher, event.currentTarget)} className={`faculty-hero__portrait faculty-hero__portrait--${index + 1}`}>
                <Portrait teacher={teacher} eager />
                <span>{firstName(teacher.name)}<small>{subjectLabel(teacher)}</small></span>
              </button>
            ))}
            <p>Three educators in focus.<br />The selection changes through the year.</p>
          </div>
        </section>

        <section className="faculty-intro" id="faculty-catalogue">
          <div>
            <span>One faculty, many ways to connect.</span>
            <p>Every educator works within DA’s shared teaching standards. The portraits shown larger are an editorial introduction—not a ranking.</p>
          </div>
          <nav className="faculty-filters" aria-label="Filter educators by subject">
            {FILTERS.map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={filter === item.key ? 'is-active' : ''}
                aria-pressed={filter === item.key}
              >{item.label}</button>
            ))}
          </nav>
        </section>

        {filter === 'all' && (
          <section className="faculty-feature">
            <div className="faculty-feature__image"><Portrait teacher={featured[0]} eager /></div>
            <div className="faculty-feature__copy">
              <span>Faculty note</span>
              <h2>{featured[0].designation}</h2>
              <blockquote>“{featured[0].motto}”</blockquote>
              <p>{featured[0].name} · {subjectLabel(featured[0])}</p>
              <button type="button" onClick={event => openProfile(featured[0], event.currentTarget)}>Read {firstName(featured[0].name)}’s story <ArrowRight /></button>
            </div>
          </section>
        )}

        <section className="faculty-index" aria-live="polite">
          <header>
            <h2>{filter === 'all' ? 'The faculty index' : FILTERS.find(item => item.key === filter)?.label}</h2>
            <p>{catalogue.length} educators · Select a portrait to read their story</p>
          </header>
          <div className="faculty-grid">
            {catalogue.map((teacher, index) => <EducatorTile key={teacher.id} teacher={teacher} index={index} onOpen={openProfile} />)}
          </div>
        </section>

        <section className="faculty-guidance">
          <p>Not sure which teaching style will suit your child?</p>
          <h2>We know the people behind every portrait.</h2>
          <a href="/book-interview">Talk to our education team <ArrowRight /></a>
        </section>
      </main>
      <FooterNew />

      <AnimatePresence mode="wait">
        {selected && (
          <ProfileView
            key={selected.id}
            teacher={selected}
            position={selectedIndex + 1}
            total={TUTORS.length}
            onClose={closeProfile}
            onPrevious={previous}
            onNext={next}
            returnFocusTo={triggerRef.current}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindTeacher;
