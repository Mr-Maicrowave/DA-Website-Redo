import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getJourneyScrollBehavior, normaliseJourneySections, type JourneySection } from './pageJourneyUtils';
import './page-journey.css';

type PageJourneyProps = {
  pageLabel: string;
  sections: readonly JourneySection[];
};

const getActiveSection = (ids: string[]) => {
  const viewportAnchor = window.innerHeight * 0.46;
  const starts = ids
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => element !== null)
    .map((element) => ({ id: element.id, top: element.getBoundingClientRect().top }));

  if (!starts.length) return ids[0] ?? '';
  return starts.reduce((active, section) => section.top <= viewportAnchor ? section.id : active, starts[0].id);
};

export default function PageJourney({ pageLabel, sections: suppliedSections }: PageJourneyProps) {
  const sections = useMemo(() => normaliseJourneySections(suppliedSections), [suppliedSections]);
  const reduceMotion = Boolean(useReducedMotion());
  const [activeId, setActiveId] = useState(() => sections[0]?.id ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeId));
  const activeTheme = sections[activeIndex]?.theme ?? 'light';
  const activeMarkerTop = sections.length > 1
    ? `calc(19px + (100% - 38px) * ${activeIndex / (sections.length - 1)})`
    : '50%';

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setActiveId(getActiveSection(sections.map((section) => section.id)));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sections]);

  const navigate = (section: (typeof sections)[number]) => {
    const target = document.getElementById(section.id);
    if (!target) return;
    const distance = Math.abs(target.getBoundingClientRect().top);
    window.scrollTo({
      top: window.scrollY + target.getBoundingClientRect().top - 72,
      behavior: getJourneyScrollBehavior({ reducedMotion: reduceMotion, longScroll: section.longScroll, distance }),
    });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`page-journey page-journey--${activeTheme}${mobileOpen ? ' is-mobile-open' : ''}`}
      aria-label={`${pageLabel} chapters`}
      data-active-section={activeId}
    >
      <button
        className="page-journey__mobile-toggle"
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="page-journey-index"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span className="sr-only">Browse {pageLabel} chapters</span>
        <span aria-hidden="true" />
      </button>
      <div className="page-journey__rail" aria-hidden="true" />
      <div className="page-journey__markers" aria-hidden="true">
        {sections.map((section) => <span key={section.id} className="page-journey__marker" />)}
        <span
          className="page-journey__active-indicator"
          style={{ '--journey-active-marker-top': activeMarkerTop } as CSSProperties}
        />
      </div>
      <div className="page-journey__index" id="page-journey-index">
        <div className="page-journey__heading">
          <p className="page-journey__title">Journey</p>
          <p className="page-journey__heading-progress">{String(activeIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</p>
        </div>
        <ol>
          {sections.map((section, index) => {
            const active = section.id === activeId;
            return (
              <li key={section.id} className={active ? 'is-active' : undefined}>
                <button type="button" onClick={() => navigate(section)} aria-current={active ? 'location' : undefined}>
                  <span className="page-journey__mark" aria-hidden="true" />
                  <span className="page-journey__number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="page-journey__copy"><strong>{section.label}</strong>{section.description && <small>{section.description}</small>}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="page-journey__progress" aria-label={`${activeIndex + 1} of ${sections.length} chapters`}>
          <span style={{ transform: `scaleX(${(activeIndex + 1) / sections.length})` }} />
        </div>
      </div>
    </nav>
  );
}
