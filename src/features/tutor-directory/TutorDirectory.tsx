import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
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
  type TutorDiscoveryRecord,
  type TutorSubject,
  type TutorYearLevel,
} from './tutorDiscovery';
import {
  TUTOR_ORBIT_GROUPS,
  TUTOR_ORBIT_SLOTS,
  type TutorOrbitSlot,
} from './tutorOrbitLayout';
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
const DISCOVERY_RECORDS_BY_ID = new Map(
  DISCOVERY_RECORDS.map(record => [record.tutor.id, record]),
);

type OrbitSlotStyle = CSSProperties & {
  '--td-x': string;
  '--td-y': string;
  '--td-size': string;
  '--td-drift-delay': string;
  '--td-drift-duration': string;
};

function orbitSlotStyle(slot: TutorOrbitSlot): OrbitSlotStyle {
  const placementIndex = [
    'mathematics',
    'english',
    'science',
    'maths-english-bridge',
    'maths-science-bridge',
  ].indexOf(slot.placementId);
  return {
    '--td-x': `${slot.x}%`,
    '--td-y': `${slot.y}%`,
    '--td-size': `${slot.size}px`,
    '--td-drift-delay': `${-(placementIndex * 1.1 + slot.placementSlotIndex * 0.37)}s`,
    '--td-drift-duration': `${8 + ((placementIndex + slot.placementSlotIndex) % 4) * 0.8}s`,
  };
}

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

function selectedSubjects(record: TutorDiscoveryRecord) {
  return record.tutor.subjects.split('/').map(subject => subject.trim()).filter(Boolean);
}

function strengthsFor(tutor: CatalogueTutor) {
  return tutor.profile?.tags ?? [];
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
  const focusedIds = useMemo(() => new Set(focusedRecords.map(record => record.tutor.id)), [focusedRecords]);
  const selectedRecord = selectedTutorId
    ? DISCOVERY_RECORDS.find(record => record.tutor.id === selectedTutorId) ?? null
    : null;
  const profileTutor = profileTutorId ? TUTORS.find(tutor => tutor.id === profileTutorId) ?? null : null;
  const profilePosition = profileTutor ? TUTORS.findIndex(tutor => tutor.id === profileTutor.id) : -1;
  const filtersActive = query.trim().length > 0 || subjects.size > 0 || yearLevels.size > 0;
  const primaryPathwayActive = subjects.has('primary');

  useEffect(() => {
    if (!requestedTutorId) return;
    const requestedTutor = TUTORS.find(tutor => tutor.id === requestedTutorId);
    if (!requestedTutor) return;
    setSelectedTutorId(requestedTutor.id);
    setProfileTutorId(requestedTutor.id);
  }, [requestedTutorId]);

  useEffect(() => {
    setSelectedTutorId(current => current && !focusedIds.has(current) ? null : current);
  }, [focusedIds]);

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

  const showPreviousProfile = useCallback(() => {
    if (profilePosition <= 0) return;
    const previousTutorId = TUTORS[profilePosition - 1].id;
    setProfileTutorId(previousTutorId);
    setSelectedTutorId(previousTutorId);
  }, [profilePosition]);

  const showNextProfile = useCallback(() => {
    if (profilePosition >= 0 && profilePosition < TUTORS.length - 1) {
      const nextTutorId = TUTORS[profilePosition + 1].id;
      setProfileTutorId(nextTutorId);
      setSelectedTutorId(nextTutorId);
    }
  }, [profilePosition]);

  return (
    <section ref={directoryRef} className="tutor-directory" aria-labelledby="tutor-directory-title" tabIndex={-1}>
      <header className="tutor-directory__intro">
        <p>DA Tuition educators</p>
        <h1 id="tutor-directory-title">Meet the people behind the progress.</h1>
        <p>Search the whole team, then explore the educators who match your child’s subject and year level.</p>
      </header>

      <section className="tutor-directory__toolbar" aria-label="Find an educator">
        <label className="tutor-directory__search">
          <span>Search by educator name</span>
          <span className="tutor-directory__search-control">
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Start typing a name"
            />
          </span>
        </label>

        <fieldset>
          <legend>Subjects</legend>
          <div>
            {SUBJECT_FILTERS.map(filter => (
              <FilterToggle
                key={filter.value}
                {...filter}
                selected={subjects.has(filter.value)}
                onToggle={toggleSubject}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Year level</legend>
          <div>
            {YEAR_FILTERS.map(filter => (
              <FilterToggle
                key={filter.value}
                {...filter}
                selected={yearLevels.has(filter.value)}
                onToggle={toggleYearLevel}
              />
            ))}
          </div>
        </fieldset>

        <button className="tutor-directory__reset" type="button" onClick={resetFilters} disabled={!filtersActive}>
          <X aria-hidden="true" /> Reset
        </button>

        <p className="tutor-directory__count" aria-live="polite" aria-atomic="true">
          Focused educators: <strong>{focusedRecords.length}</strong> of {TUTORS.length}
        </p>
      </section>

      <div
        className={`tutor-directory__stage${primaryPathwayActive ? ' is-primary-active' : ''}`}
        aria-label="DA Tuition educators grouped by teaching subject"
      >
        <div className="tutor-directory__space-depth" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="tutor-directory__path-depth">
          {TUTOR_ORBIT_GROUPS.map(group => (
            <section
              key={group.id}
              className="tutor-directory__system"
              data-orbit-group={group.id}
              aria-labelledby={`tutor-system-${group.id}`}
            >
              <div className="tutor-directory__system-glow" aria-hidden="true" />
              <div className="tutor-directory__system-ring tutor-directory__system-ring--outer" aria-hidden="true" />
              <div className="tutor-directory__system-ring tutor-directory__system-ring--inner" aria-hidden="true" />
              <h2 id={`tutor-system-${group.id}`} className="tutor-directory__system-label">{group.label}</h2>
            </section>
          ))}

          <div className="tutor-directory__bridge-line tutor-directory__bridge-line--maths-english" aria-hidden="true" />
          <div className="tutor-directory__bridge-line tutor-directory__bridge-line--maths-science" aria-hidden="true" />
          <div
            className={`tutor-directory__primary-pathway${primaryPathwayActive ? ' is-active' : ''}`}
            aria-hidden="true"
          >
            <span>Primary pathway · K–6</span>
          </div>
        </div>

        <div className="tutor-directory__portrait-depth">
          {TUTOR_ORBIT_SLOTS.map(slot => {
            const record = DISCOVERY_RECORDS_BY_ID.get(slot.tutorId);
            if (!record) return null;

            const focused = focusedIds.has(record.tutor.id);
            const selected = selectedTutorId === record.tutor.id;
            const partial = !focused
              && subjects.size > 0
              && record.subjects.some(subject => subjects.has(subject));
            const stateClass = focused ? 'is-focused' : partial ? 'is-partial' : 'is-dimmed';

            return (
              <button
                key={record.tutor.id}
                type="button"
                className={`tutor-directory__portrait-button ${stateClass}${slot.isAnchor ? ' is-anchor' : ''}${selected ? ' is-selected' : ''}`}
                style={orbitSlotStyle(slot)}
                data-placement={slot.placementId}
                aria-label={`Select ${record.tutor.name}`}
                aria-pressed={selected}
                onClick={() => setSelectedTutorId(record.tutor.id)}
              >
                <span className="tutor-directory__portrait-drift">
                  {slot.isAnchor && <span className="tutor-directory__anchor-halo" aria-hidden="true" />}
                  <span className="tutor-directory__portrait-frame">
                    <Portrait tutor={record.tutor} eager={slot.isAnchor} />
                  </span>
                  <span className="tutor-directory__portrait-name">{record.tutor.name}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className={`tutor-directory__focus${selectedRecord ? ' has-selection' : ''}`}>
          {selectedRecord ? (
            <>
              <div className="tutor-directory__focus-portrait"><Portrait tutor={selectedRecord.tutor} eager /></div>
              <div className="tutor-directory__focus-copy">
                <h2>{selectedRecord.tutor.name}</h2>
                <p className="tutor-directory__designation">{selectedRecord.tutor.designation}</p>
                <p className="tutor-directory__subjects">{selectedSubjects(selectedRecord).join(' · ')}</p>
                {strengthsFor(selectedRecord.tutor).length > 0 && (
                  <ul aria-label="Teaching strengths">
                    {strengthsFor(selectedRecord.tutor).map(strength => <li key={strength}>{strength}</li>)}
                  </ul>
                )}
                <button type="button" onClick={event => openProfile(selectedRecord.tutor, event.currentTarget)}>
                  View full profile <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </>
          ) : (
            <div className="tutor-directory__neutral">
              <span aria-hidden="true">{TUTORS.length}</span>
              <h2>Explore the DA team</h2>
              <p>Select any portrait to meet the educator behind it.</p>
            </div>
          )}
        </div>
      </div>

      <div className="tutor-directory__mobile-list" aria-label="Filtered DA Tuition educators">
        {focusedRecords.length > 0 ? focusedRecords.map(record => {
          const selected = selectedTutorId === record.tutor.id;
          return (
            <article key={record.tutor.id} className={selected ? 'is-selected' : ''}>
              <button
                className="tutor-directory__mobile-select"
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedTutorId(record.tutor.id)}
              >
                <span className="tutor-directory__mobile-portrait"><Portrait tutor={record.tutor} /></span>
                <span className="tutor-directory__mobile-copy">
                  <strong>{record.tutor.name}</strong>
                  <span>{record.tutor.designation}</span>
                  <small>{selectedSubjects(record).join(' · ')}</small>
                </span>
              </button>
              {selected && (
                <button className="tutor-directory__mobile-profile" type="button" onClick={event => openProfile(record.tutor, event.currentTarget)}>
                  View full profile <ArrowRight aria-hidden="true" />
                </button>
              )}
            </article>
          );
        }) : (
          <div className="tutor-directory__empty">
            <h2>No educators match those filters.</h2>
            <p>Clear the filters to explore the full DA team.</p>
            <button type="button" onClick={resetFilters}>Show all educators</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {profileTutor && (
          <FullTutorProfile
            teacher={profileTutor}
            position={profilePosition + 1}
            onClose={closeProfile}
            onPrevious={showPreviousProfile}
            onNext={showNextProfile}
            returnFocusTo={profileTriggerRef.current}
            fallbackFocusTo={directoryRef.current}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
