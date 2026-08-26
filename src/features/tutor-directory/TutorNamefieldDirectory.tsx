import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import {
  TUTORS,
  type CatalogueTutor,
  getPhotoStyle,
  getPhotoUrl,
  teachesEnglish,
  teachesMath,
  teachesScience,
} from '@/data/teacherCatalogue';
import { profileContentFor } from '@/pages/profileContent';
import './tutor-namefield.css';

type FilterKey = 'all' | 'primary' | 'english' | 'maths' | 'science';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All educators' },
  { key: 'primary', label: 'Primary' },
  { key: 'english', label: 'English' },
  { key: 'maths', label: 'Mathematics' },
  { key: 'science', label: 'Science' },
];

const firstSentence = (copy: string) => copy.match(/[^.!?]+[.!?]+/)?.[0]?.trim() ?? copy;

const subjectSummary = (teacher: CatalogueTutor) => {
  const subjects = [
    teacher.hasPrimary ? 'Primary' : null,
    teachesEnglish(teacher) ? 'English' : null,
    teachesMath(teacher) ? 'Mathematics' : null,
    teachesScience(teacher) ? 'Science' : null,
  ].filter((subject): subject is string => Boolean(subject));
  return subjects.join(' · ') || teacher.subjects.split('/')[0].trim();
};

const yearSummary = (teacher: CatalogueTutor) => {
  if (/Extension|Advanced|Standard/i.test(teacher.subjects)) return 'Years 7–12';
  if (teacher.hasPrimary) return 'Primary';
  return 'Years 7–10';
};

const tierLabel = (teacher: CatalogueTutor) => teacher.tier === 'senior'
  ? 'Senior educator'
  : teacher.tier === 'mid'
    ? 'Experienced educator'
    : 'DA educator';

function Portrait({ teacher, eager = false }: { teacher: CatalogueTutor; eager?: boolean }) {
  return (
    <img
      src={getPhotoUrl(teacher)}
      alt={`Portrait of ${teacher.name}, DA Tuition educator`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={getPhotoStyle(teacher)}
    />
  );
}

function DirectoryProfile({ teacher, onBack }: { teacher: CatalogueTutor; onBack: () => void }) {
  const profile = profileContentFor(teacher);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backRef.current?.focus();
  }, [teacher.id]);

  return (
    <article className="namefield-profile" aria-labelledby="namefield-profile-name">
      <button ref={backRef} type="button" className="namefield-profile__back" onClick={onBack}>
        <ArrowLeft aria-hidden="true" /> All educators
      </button>
      <header className="namefield-profile__intro">
        <p>{tierLabel(teacher)}</p>
        <h1 id="namefield-profile-name">{teacher.name}</h1>
        <span>{subjectSummary(teacher)} · {yearSummary(teacher)}</span>
        <p className="namefield-profile__summary">{firstSentence(profile.remembered)}</p>
      </header>
      <div className="namefield-profile__portrait"><Portrait teacher={teacher} eager /></div>
      <dl className="namefield-profile__facts">
        <div><dt>Teaches</dt><dd>{subjectSummary(teacher)}<br />{yearSummary(teacher)}</dd></div>
        <div><dt>Teaching approach</dt><dd>{firstSentence(profile.approach)}</dd></div>
        <div><dt>What students remember</dt><dd>{firstSentence(profile.remembered)}</dd></div>
      </dl>
      <section className="namefield-profile__story">
        <h2>About {teacher.name}</h2>
        <p>{profile.whyDA}</p>
      </section>
      <a className="namefield-profile__enquire" href="/book-interview">Enquire about learning with {teacher.name} <ArrowRight aria-hidden="true" /></a>
    </article>
  );
}

export function TutorNamefieldDirectory({ onBackToHero }: { onBackToHero: () => void }) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [selected, setSelected] = useState<CatalogueTutor | null>(null);
  const directoryRef = useRef<HTMLElement>(null);

  const filteredTutors = useMemo(() => {
    const normalisedQuery = query.trim().toLocaleLowerCase();
    return TUTORS.filter((teacher) => {
      const matchesFilter = filter === 'all'
        || (filter === 'primary' && teacher.hasPrimary)
        || (filter === 'english' && teachesEnglish(teacher))
        || (filter === 'maths' && teachesMath(teacher))
        || (filter === 'science' && teachesScience(teacher));
      const matchesQuery = !normalisedQuery || [teacher.name, teacher.subjects]
        .some((value) => value.toLocaleLowerCase().includes(normalisedQuery));
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  useEffect(() => {
    setPreviewId((current) => filteredTutors.some((teacher) => teacher.id === current) ? current : null);
  }, [filteredTutors]);

  useEffect(() => {
    directoryRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  if (selected) {
    return <DirectoryProfile teacher={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <section ref={directoryRef} className="namefield" tabIndex={-1} aria-labelledby="namefield-title">
      <header className="namefield__header">
        <button type="button" className="namefield__back" onClick={onBackToHero}><ArrowLeft aria-hidden="true" /> Meet our educators</button>
        <div>
          <h1 id="namefield-title">Every name has a teaching story.</h1>
          <p>{TUTORS.length} educators · search by name or subject</p>
        </div>
        <label className="namefield__search"><span className="sr-only">Search educators</span><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the faculty" /></label>
      </header>
      <div className="namefield__body">
        <nav className="namefield__filters" aria-label="Filter educators">
          {FILTERS.map((item) => {
            const count = item.key === 'all' ? TUTORS.length : TUTORS.filter((teacher) => (
              item.key === 'primary' ? teacher.hasPrimary : item.key === 'english' ? teachesEnglish(teacher) : item.key === 'maths' ? teachesMath(teacher) : teachesScience(teacher)
            )).length;
            return <button key={item.key} type="button" className={filter === item.key ? 'is-active' : ''} aria-pressed={filter === item.key} onClick={() => setFilter(item.key)}>{item.label} <span>— {count}</span></button>;
          })}
        </nav>
        <div className="namefield__list" aria-live="polite">
          {filteredTutors.map((teacher, index) => {
            const previewed = previewId === teacher.id;
            const profile = profileContentFor(teacher);
            return (
              <article key={teacher.id} className={`namefield__row${previewed ? ' is-previewed' : ''}`} onMouseEnter={() => setPreviewId(teacher.id)} onMouseLeave={() => setPreviewId(null)}>
                <button
                  type="button"
                  aria-expanded={previewed}
                  aria-label={`Full profile for ${teacher.name}`}
                  onFocus={() => setPreviewId(teacher.id)}
                  onClick={() => setSelected(teacher)}
                >
                  <span className="namefield__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="namefield__identity"><strong>{teacher.name}</strong><small>{subjectSummary(teacher)}</small></span>
                  <span className="namefield__thumb"><Portrait teacher={teacher} /></span>
                  <ArrowRight className="namefield__arrow" aria-hidden="true" />
                </button>
                <div className="namefield__preview" aria-hidden={!previewed}>
                  <p>{tierLabel(teacher)} · {yearSummary(teacher)}</p>
                  <span>{firstSentence(profile.remembered)}</span>
                  <em>Open full profile <ArrowRight aria-hidden="true" /></em>
                </div>
              </article>
            );
          })}
          {!filteredTutors.length && <p className="namefield__empty">No educators match that search. Try another name or subject.</p>}
        </div>
      </div>
    </section>
  );
}
