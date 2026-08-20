import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
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

const PAGE_SIZE = 4;

const subjectLabel = (teacher: CatalogueTutor) => {
  const subject = teacher.primarySubject === 'math'
    ? 'Mathematics'
    : teacher.primarySubject === 'both'
      ? 'English · Mathematics'
      : teacher.primarySubject[0].toUpperCase() + teacher.primarySubject.slice(1);
  return teacher.hasPrimary ? `Primary · ${subject}` : subject;
};

const subjects = (teacher: CatalogueTutor) => teacher.subjects.split('/').map(item => item.trim());

const fitGuidance = (teacher: CatalogueTutor) => {
  const subjectFit = teacher.primarySubject === 'english'
    ? 'Students building confidence in reading and writing'
    : teacher.primarySubject === 'math'
      ? 'Students who benefit from clear, step-by-step methods'
      : teacher.primarySubject === 'science'
        ? 'Students who want complex ideas made memorable'
        : 'Students strengthening core English and maths foundations';
  const teachingFit = teacher.tier === 'senior'
    ? 'Students ready for high expectations and close guidance'
    : 'Students who thrive with calm structure and encouragement';
  return [subjectFit, teachingFit, 'Students who want to understand, not simply memorise'];
};

const strengths = (teacher: CatalogueTutor) => {
  const source = teacher.profile?.tags ?? [];
  const fallbacks = teacher.primarySubject === 'english'
    ? ['Clear communicator', 'Thoughtful', 'Encouraging']
    : teacher.primarySubject === 'math'
      ? ['Methodical', 'Precise', 'Patient']
      : ['Curious', 'Analytical', 'Engaging'];
  return [...source, ...fallbacks].slice(0, 3);
};

const firstName = (name: string) => name.replace(/^(Mr|Mrs|Ms|Miss|Dr)\.?\s+/i, '').split(/\s+/)[0];

const biography = (teacher: CatalogueTutor) => teacher.profile?.whyDA ?? teacher.tagline;

const shortBiography = (teacher: CatalogueTutor) => {
  const copy = biography(teacher);
  const sentences = copy.match(/[^.!?]+[.!?]+/g) ?? [copy];
  return sentences.slice(0, 2).join(' ').trim();
};

function Portrait({ teacher, eager = false }: { teacher: CatalogueTutor; eager?: boolean }) {
  return (
    <img
      src={getPhotoUrl(teacher)}
      alt={`Portrait of ${teacher.name}, DA Tuition educator`}
      loading={eager ? 'eager' : 'lazy'}
      style={getPhotoStyle(teacher)}
    />
  );
}

function EducatorCard({
  teacher,
  active,
  onPreview,
  onOpen,
}: {
  teacher: CatalogueTutor;
  active: boolean;
  onPreview: () => void;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardStrengths = strengths(teacher);

  return (
    <motion.article
      className={`educator-card${active ? ' is-active' : ''}`}
      onMouseEnter={onPreview}
      onPointerEnter={onPreview}
      onClick={event => {
        if (!(event.target as HTMLElement).closest('button, a')) onPreview();
      }}
      onFocusCapture={onPreview}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .42, ease: [0.2, 0.75, 0.2, 1] }}
    >
      <div className="educator-card__portrait">
        <span aria-hidden="true" className="educator-card__diamond" />
        <Portrait teacher={teacher} />
      </div>
      <div className="educator-card__content">
        <div>
          <h2>{teacher.name}</h2>
          <p className="educator-card__signature">{teacher.designation}</p>
          <blockquote>“{teacher.tagline}”</blockquote>
        </div>
        <div>
          <p className="educator-card__subjects">{subjectLabel(teacher)}</p>
          <div className="educator-card__strengths" aria-label="Teaching strengths">
            {cardStrengths.map((strength, index) => (
              <span key={strength}><b>{String(index + 1).padStart(2, '0')}</b>{strength}</span>
            ))}
          </div>
          <button ref={buttonRef} type="button" onClick={() => buttonRef.current && onOpen(buttonRef.current)}>
            Read full profile <ArrowRight />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProfilePreview({ teacher, onOpen }: { teacher: CatalogueTutor; onOpen: () => void }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={teacher.id}
        className="faculty-preview__inner"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: .3, ease: [0.2, 0.75, 0.2, 1] }}
      >
        <div className="faculty-preview__portrait"><Portrait teacher={teacher} eager /></div>
        <p className="faculty-preview__position">
          {teacher.tier === 'senior' ? 'Senior educator' : teacher.tier === 'mid' ? 'Experienced educator' : 'DA educator'}
        </p>
        <h2>{teacher.name}</h2>
        <p className="faculty-preview__signature">{teacher.designation}</p>
        <a href="/book-interview" className="faculty-preview__enquire">Enquire about {firstName(teacher.name)} <ArrowRight /></a>
        <blockquote>“{teacher.motto}”</blockquote>

        <section>
          <h3>Meet {firstName(teacher.name)}</h3>
          <p>{shortBiography(teacher)}</p>
        </section>

        <section>
          <h3>A good fit for</h3>
          <ul>{fitGuidance(teacher).map(item => <li key={item}><Check />{item}</li>)}</ul>
        </section>

        <section>
          <h3>Teaching strengths</h3>
          <div className="faculty-preview__strengths">
            {strengths(teacher).map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, '0')}</b>{item}</span>)}
          </div>
        </section>

        <button type="button" className="faculty-preview__full" onClick={onOpen}>Read full profile <ArrowRight /></button>
      </motion.div>
    </AnimatePresence>
  );
}

function FullProfile({
  teacher,
  position,
  onClose,
  onPrevious,
  onNext,
  returnFocusTo,
}: {
  teacher: CatalogueTutor;
  position: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  returnFocusTo: HTMLElement | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    panelRef.current?.focus();
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrevious();
      if (event.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
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
      transition={{ duration: reduceMotion ? .1 : .42, ease: [0.2, 0.75, 0.2, 1] }}
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

      <div className="full-profile__scroll">
        <section className="full-profile__hero">
          <div className="full-profile__photo"><Portrait teacher={teacher} eager /></div>
          <div className="full-profile__intro">
            <p>{subjectLabel(teacher)}</p>
            <h1 id="full-profile-name">{teacher.name}</h1>
            <h2>{teacher.designation}</h2>
            <blockquote>“{teacher.tagline}”</blockquote>
            <a href="/book-interview">Discuss the right class <ArrowRight /></a>
          </div>
        </section>

        <div className="full-profile__body">
          <aside>
            <h2>A good fit if your child…</h2>
            <ul>{fitGuidance(teacher).map(item => <li key={item}><Check />{item}</li>)}</ul>
            <small>Class placement also considers year level, availability and your child’s goals.</small>
          </aside>
          <main>
            <section>
              <h2>In the classroom</h2>
              <p className="full-profile__lead">{biography(teacher)}</p>
            </section>
            <blockquote className="full-profile__motto">“{teacher.motto}”</blockquote>
            <section className="full-profile__columns">
              <div>
                <h2>What I want for students</h2>
                <p>{teacher.profile?.goals ?? teacher.motto}</p>
              </div>
              <div>
                <h2>Subjects and year levels</h2>
                <ul>{subjects(teacher).map(subject => <li key={subject}>{subject}</li>)}</ul>
              </div>
            </section>
            <section className="full-profile__remembered">
              <h2>What I hope students remember</h2>
              <p>{teacher.profile?.remembered ?? teacher.motto}</p>
            </section>
          </main>
        </div>
      </div>
    </motion.div>
  );
}

const FindTeacher = () => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<CatalogueTutor>(TUTORS[0]);
  const [selected, setSelected] = useState<CatalogueTutor | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    let list = TUTORS;
    if (filter === 'english') list = list.filter(teachesEnglish);
    if (filter === 'maths') list = list.filter(teachesMath);
    if (filter === 'science') list = list.filter(teachesScience);
    if (filter === 'primary') list = list.filter(teacher => teacher.hasPrimary);
    const query = search.trim().toLowerCase();
    if (query) list = list.filter(teacher => [teacher.name, teacher.designation, teacher.tagline, teacher.subjects].some(value => value.toLowerCase().includes(query)));
    return list;
  }, [filter, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageTutors = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  useEffect(() => {
    if (pageTutors.length && !pageTutors.some(teacher => teacher.id === preview.id)) setPreview(pageTutors[0]);
  }, [pageTutors, preview.id]);

  useEffect(() => {
    document.body.classList.toggle('teacher-profile-open', Boolean(selected));
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => {
      document.body.classList.remove('teacher-profile-open');
      document.body.style.overflow = '';
    };
  }, [selected]);

  const openProfile = useCallback((teacher: CatalogueTutor, trigger?: HTMLElement) => {
    if (trigger) triggerRef.current = trigger;
    setSelected(teacher);
  }, []);
  const selectedIndex = selected ? TUTORS.findIndex(teacher => teacher.id === selected.id) : -1;
  const previous = useCallback(() => {
    if (selectedIndex > 0) setSelected(TUTORS[selectedIndex - 1]);
  }, [selectedIndex]);
  const next = useCallback(() => {
    if (selectedIndex < TUTORS.length - 1) setSelected(TUTORS[selectedIndex + 1]);
  }, [selectedIndex]);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.querySelector('.faculty-catalogue__masthead')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="faculty-page">
      <SEO
        title="Meet Our Educators"
        description="Browse DA Tuition educators across Primary, English, Mathematics and Science for Years 3–12."
        canonicalUrl="/find-teacher"
      />
      <NavigationNew />

      <main className="faculty-workspace">
        <div className="faculty-catalogue">
          <header className="faculty-catalogue__masthead">
            <div>
              <p>DA Tuition faculty</p>
              <h1>Meet our educators</h1>
              <blockquote>Every child learns differently. Meet the people who know how to notice—and respond to—the difference.</blockquote>
            </div>
            <div className="faculty-tools">
              <label>
                <Search />
                <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name or subject" aria-label="Search educators" />
              </label>
              <nav aria-label="Filter educators by subject">
                {FILTERS.map(item => (
                  <button
                    key={item.key}
                    type="button"
                    className={filter === item.key ? 'is-active' : ''}
                    aria-pressed={filter === item.key}
                    onClick={() => setFilter(item.key)}
                  >{item.label}</button>
                ))}
              </nav>
            </div>
          </header>

          {pageTutors.length ? (
            <div className="faculty-cards">
              {pageTutors.map(teacher => (
                <EducatorCard
                  key={teacher.id}
                  teacher={teacher}
                  active={preview.id === teacher.id}
                  onPreview={() => setPreview(teacher)}
                  onOpen={trigger => openProfile(teacher, trigger)}
                />
              ))}
            </div>
          ) : (
            <div className="faculty-empty">
              <h2>No educators found</h2>
              <p>Try another subject or clear your search.</p>
              <button type="button" onClick={() => { setSearch(''); setFilter('all'); }}>Show all educators</button>
            </div>
          )}

          {pageTutors.length > 0 && (
            <footer className="faculty-pagination">
              <p>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} educators</p>
              <nav aria-label="Educator catalogue pages">
                <button type="button" onClick={() => changePage(page - 1)} disabled={page === 1} aria-label="Previous page"><ChevronLeft /></button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).filter(value => value === 1 || value === pageCount || Math.abs(value - page) <= 1).map((value, index, visible) => (
                  <span key={value}>
                    {index > 0 && value - visible[index - 1] > 1 && <i>…</i>}
                    <button type="button" className={value === page ? 'is-active' : ''} aria-current={value === page ? 'page' : undefined} onClick={() => changePage(value)}>{value}</button>
                  </span>
                ))}
                <button type="button" onClick={() => changePage(page + 1)} disabled={page === pageCount} aria-label="Next page"><ChevronRight /></button>
              </nav>
            </footer>
          )}
        </div>

        <aside className="faculty-preview" aria-label={`Preview profile for ${preview.name}`}>
          <ProfilePreview teacher={preview} onOpen={() => openProfile(preview)} />
        </aside>
      </main>

      <section className="faculty-mobile-guidance">
        <p>Unsure which educator may suit your child?</p>
        <h2>We know the person behind every portrait.</h2>
        <a href="/book-interview">Talk to our education team <ArrowRight /></a>
      </section>
      <FooterNew />

      <AnimatePresence mode="wait">
        {selected && (
          <FullProfile
            key={selected.id}
            teacher={selected}
            position={selectedIndex + 1}
            onClose={() => setSelected(null)}
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
