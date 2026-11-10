import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  TUTORS,
  type CatalogueTutor,
  getPhotoStyle,
  getPhotoUrl,
} from '@/data/teacherCatalogue';
import { FullTutorProfile } from './FullTutorProfile';
import {
  matchesDiscoveryFilters,
  toDiscoveryRecord,
  type TutorSubject,
  type TutorYearLevel,
} from './tutorDiscovery';
import './tutor-directory.css';

const SUBJECT_FILTERS: Array<{ value: TutorSubject; label: string }> = [
  { value: 'english', label: 'English' },
  { value: 'maths', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'primary', label: 'Primary · K–6' },
];

const YEAR_FILTERS: Array<{ value: TutorYearLevel; label: string }> = [
  { value: 'years-3-6', label: 'Years 3–6' },
  { value: 'years-7-10', label: 'Years 7–10' },
  { value: 'years-11-12', label: 'Years 11–12' },
];

const DISCOVERY_RECORDS = TUTORS.map(toDiscoveryRecord);

const firstName = (name: string) => name.replace(/^(Mr|Mrs|Ms|Miss|Dr)\.?\s+/i, '').split(/\s+/)[0];

function Portrait({ tutor, eager = false }: { tutor: CatalogueTutor; eager?: boolean }) {
  return (
    <img
      src={getPhotoUrl(tutor)}
      alt={`Portrait of ${tutor.name}, DA Tuition educator`}
      loading={eager ? 'eager' : 'lazy'}
      style={getPhotoStyle(tutor)}
    />
  );
}

function FilterToggle<T extends string>({
  value,
  label,
  selected,
  onToggle,
}: {
  value: T;
  label: string;
  selected: boolean;
  onToggle: (value: T) => void;
}) {
  return (
    <button type="button" aria-pressed={selected} className={selected ? 'is-active' : ''} onClick={() => onToggle(value)}>
      {label}
    </button>
  );
}

function storyPreview(tutor: CatalogueTutor) {
  return tutor.profile?.whyDA ?? tutor.tagline;
}

export function TutorDirectory() {
  const [searchParams] = useSearchParams();
  const requestedTutorId = searchParams.get('tutor');
  const [query, setQuery] = useState('');
  const [subjects, setSubjects] = useState<Set<TutorSubject>>(() => new Set());
  const [yearLevels, setYearLevels] = useState<Set<TutorYearLevel>>(() => new Set());
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [profileTutorId, setProfileTutorId] = useState<string | null>(null);
  const directoryRef = useRef<HTMLElement>(null);
  const profileTriggerRef = useRef<HTMLElement | null>(null);

  const focusedRecords = useMemo(
    () => DISCOVERY_RECORDS.filter(record => matchesDiscoveryFilters(record, { query, subjects, yearLevels })),
    [query, subjects, yearLevels],
  );
  const featuredTutor = (selectedTutorId
    ? TUTORS.find(tutor => tutor.id === selectedTutorId)
    : focusedRecords[0]?.tutor) ?? TUTORS[0];
  const profileTutor = profileTutorId ? TUTORS.find(tutor => tutor.id === profileTutorId) ?? null : null;
  const profilePosition = profileTutor ? TUTORS.findIndex(tutor => tutor.id === profileTutor.id) : -1;
  const filtersActive = query.trim().length > 0 || subjects.size > 0 || yearLevels.size > 0;

  useEffect(() => {
    if (!requestedTutorId) return;
    const requestedTutor = TUTORS.find(tutor => tutor.id === requestedTutorId);
    if (!requestedTutor) return;
    setSelectedTutorId(requestedTutor.id);
    setProfileTutorId(requestedTutor.id);
  }, [requestedTutorId]);

  useEffect(() => {
    if (!selectedTutorId || focusedRecords.some(record => record.tutor.id === selectedTutorId)) return;
    setSelectedTutorId(null);
  }, [focusedRecords, selectedTutorId]);

  const toggleSubject = useCallback((subject: TutorSubject) => {
    setSubjects(current => {
      const next = new Set(current);
      if (next.has(subject)) next.delete(subject);
      else next.add(subject);
      return next;
    });
  }, []);

  const toggleYearLevel = useCallback((yearLevel: TutorYearLevel) => {
    setYearLevels(current => {
      const next = new Set(current);
      if (next.has(yearLevel)) next.delete(yearLevel);
      else next.add(yearLevel);
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setQuery('');
    setSubjects(new Set());
    setYearLevels(new Set());
    setSelectedTutorId(null);
  }, []);

  const openProfile = useCallback((tutor: CatalogueTutor, trigger: HTMLElement | null) => {
    profileTriggerRef.current = trigger;
    setSelectedTutorId(tutor.id);
    setProfileTutorId(tutor.id);
  }, []);

  const closeProfile = useCallback(() => setProfileTutorId(null), []);
  const selectStory = useCallback((tutor: CatalogueTutor) => setSelectedTutorId(tutor.id), []);

  return (
    <section ref={directoryRef} className="tutor-directory" aria-labelledby="tutor-directory-title" tabIndex={-1}>
      <header className="tutor-directory__intro">
        <p>DA Tuition educators</p>
        <h1 id="tutor-directory-title">Find the educator who fits your child.</h1>
        <p>Real people, real teaching philosophies, and a team ready to help your child grow with confidence.</p>
      </header>

      <section className="tutor-directory__toolbar" aria-label="Find an educator">
        <label className="tutor-directory__search">
          <span>Search by educator name</span>
          <span className="tutor-directory__search-control">
            <Search aria-hidden="true" />
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Start typing a name" />
          </span>
        </label>
        <fieldset>
          <legend>Subjects</legend>
          <div>{SUBJECT_FILTERS.map(filter => <FilterToggle key={filter.value} {...filter} selected={subjects.has(filter.value)} onToggle={toggleSubject} />)}</div>
        </fieldset>
        <fieldset>
          <legend>Year level</legend>
          <div>{YEAR_FILTERS.map(filter => <FilterToggle key={filter.value} {...filter} selected={yearLevels.has(filter.value)} onToggle={toggleYearLevel} />)}</div>
        </fieldset>
        <button className="tutor-directory__reset" type="button" onClick={resetFilters} disabled={!filtersActive}><X aria-hidden="true" /> Reset</button>
        <p className="tutor-directory__count" aria-live="polite" aria-atomic="true"><strong>{focusedRecords.length}</strong> educators to explore</p>
      </section>

      <section className="impact-directory" aria-labelledby="impact-directory-title">
        <header className="impact-directory__heading">
          <div>
            <BookOpen aria-hidden="true" />
            <p>Book of Impact</p>
          </div>
          <h2 id="impact-directory-title">Meet the people behind the progress.</h2>
          <p>Choose an educator to see what they value, how they teach, and the moments that stay with them.</p>
        </header>

        {focusedRecords.length > 0 ? (
          <>
            <article className="impact-directory__spotlight">
              <div className="impact-directory__spotlight-photo"><Portrait tutor={featuredTutor} eager /></div>
              <div className="impact-directory__spotlight-copy">
                <p className="impact-directory__eyebrow">Educator spotlight</p>
                <h3>{featuredTutor.name}</h3>
                <p className="impact-directory__designation">{featuredTutor.designation}</p>
                <blockquote>“{featuredTutor.tagline}”</blockquote>
                <p className="impact-directory__story">{storyPreview(featuredTutor)}</p>
                <ul aria-label={`${featuredTutor.name}'s teaching strengths`}>
                  {(featuredTutor.profile?.tags ?? []).slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}
                </ul>
                <button type="button" onClick={event => openProfile(featuredTutor, event.currentTarget)}>
                  Read {firstName(featuredTutor.name)}'s story <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </article>

            <div className="impact-directory__stories" aria-label="Educator stories">
              {focusedRecords.map(record => {
                const { tutor } = record;
                const isSelected = tutor.id === featuredTutor.id;
                return (
                  <article key={tutor.id} className={`impact-directory__story-card${isSelected ? ' is-selected' : ''}`}>
                    <button type="button" onClick={() => selectStory(tutor)} aria-pressed={isSelected}>
                      <span className="impact-directory__card-photo"><Portrait tutor={tutor} /></span>
                      <span className="impact-directory__card-copy">
                        <strong>{tutor.name}</strong>
                        <em>{tutor.designation}</em>
                        <small>{tutor.subjects}</small>
                        <span className="impact-directory__card-link">Explore story <ArrowRight aria-hidden="true" /></span>
                      </span>
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="impact-directory__empty">
            <h2>No educators match those filters yet.</h2>
            <p>Try removing a filter, or search by a different name or subject.</p>
            <button type="button" onClick={resetFilters}>Show all educators</button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {profileTutor && (
          <FullTutorProfile
            teacher={profileTutor}
            position={profilePosition + 1}
            onClose={closeProfile}
            onPrevious={() => setProfileTutorId(TUTORS[Math.max(0, profilePosition - 1)]?.id ?? null)}
            onNext={() => setProfileTutorId(TUTORS[Math.min(TUTORS.length - 1, profilePosition + 1)]?.id ?? null)}
            returnFocusTo={profileTriggerRef.current}
            fallbackFocusTo={directoryRef.current}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
