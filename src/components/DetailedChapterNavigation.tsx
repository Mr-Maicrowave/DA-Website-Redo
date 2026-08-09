import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ChevronDown, X } from 'lucide-react';
import { HERO_CHAPTERS } from '@/data/heroChapters';
import styles from './DetailedChapterNavigation.module.css';

const CHAPTER_DESTINATIONS: Record<string, string> = {
  welcome: '/',
  philosophy: '/why-choose-da',
  journey: '/principal-reflections',
  programs: '/programs/primary-school',
  subjects: '/subjects',
  environment: '/learning-formats',
  guides: '/find-teacher',
  stories: '/success-stories',
  contact: '/book-interview',
};

const CHAPTER_SUBLINKS: Record<string, readonly { label: string; destination: string }[]> = {
  programs: [
    { label: 'Primary School', destination: '/programs/primary-school' },
    { label: 'Early Years', destination: '/programs/early-years' },
    { label: 'Years 3–4', destination: '/programs/year-3-4' },
    { label: 'Years 5–6', destination: '/programs/year-5-6' },
    { label: 'High School', destination: '/programs/high-school' },
    { label: 'HSC Excellence', destination: '/programs/hsc' },
  ],
  subjects: [
    { label: 'Mathematics', destination: '/subjects/mathematics' },
    { label: 'English', destination: '/subjects/english' },
    { label: 'Science', destination: '/subjects/science' },
    { label: 'Business Studies', destination: '/subjects/business-studies' },
    { label: 'Legal Studies', destination: '/subjects/legal-studies' },
  ],
};

const getActiveChapterId = (pathname: string) => {
  if (pathname === '/why-choose-da' || pathname === '/our-approach') return 'philosophy';
  if (pathname === '/principal-reflections') return 'journey';
  if (pathname.startsWith('/programs/') || pathname === '/hsc-excellence') return 'programs';
  if (pathname === '/subjects' || pathname.startsWith('/subjects/')) return 'subjects';
  if (pathname === '/learning-formats') return 'environment';
  if (pathname === '/find-teacher' || pathname === '/teachers' || pathname === '/our-teachers') return 'guides';
  if (pathname === '/success-stories' || pathname.startsWith('/testimonials')) return 'stories';
  if (pathname === '/book-interview') return 'contact';
  return null;
};

export default function DetailedChapterNavigation() {
  const location = useLocation();
  const activeChapterId = getActiveChapterId(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSubchapterId, setOpenSubchapterId] = useState<string | null>(() =>
    activeChapterId && CHAPTER_SUBLINKS[activeChapterId] ? activeChapterId : null,
  );
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setDrawerOpen(false);
    setOpenSubchapterId(activeChapterId && CHAPTER_SUBLINKS[activeChapterId] ? activeChapterId : null);
  }, [activeChapterId, location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  if (location.pathname === '/' || location.pathname === '/english-sample') return null;

  const chapterLinks = HERO_CHAPTERS.map((chapter, index) => ({
    ...chapter,
    pageNumber: String(index + 1).padStart(2, '0'),
    destination: CHAPTER_DESTINATIONS[chapter.id],
    active: chapter.id === activeChapterId,
    sublinks: CHAPTER_SUBLINKS[chapter.id],
  }));

  const toggleSubchapters = (chapterId: string) => {
    setOpenSubchapterId(current => current === chapterId ? null : chapterId);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    triggerRef.current?.focus();
  };

  const renderChapter = (chapter: (typeof chapterLinks)[number], mobile = false) => {
    const subchaptersOpen = openSubchapterId === chapter.id;
    const panelId = `${mobile ? 'mobile' : 'desktop'}-${chapter.id}-subchapters`;

    return (
      <li key={chapter.id} className={styles.chapterItem}>
        <div className={styles.chapterRow}>
          <Link
            to={chapter.destination}
            className={`${styles.chapterLink} ${chapter.active ? styles.active : ''}`}
            aria-current={chapter.active ? 'page' : undefined}
            aria-label={`Chapter ${chapter.pageNumber}: ${chapter.chapterLabel}`}
            onClick={mobile ? () => setDrawerOpen(false) : undefined}
          >
            <small aria-hidden="true">{chapter.pageNumber}</small>
            <span>{chapter.chapterLabel}</span>
          </Link>
          {chapter.sublinks && (
            <button
              type="button"
              className={styles.subchapterToggle}
              aria-label={`${subchaptersOpen ? 'Hide' : 'Show'} ${chapter.chapterLabel} subchapters`}
              aria-expanded={subchaptersOpen}
              aria-controls={panelId}
              onClick={() => toggleSubchapters(chapter.id)}
            >
              <ChevronDown aria-hidden="true" />
            </button>
          )}
        </div>
        {chapter.sublinks && (
          <div
            id={panelId}
            className={`${styles.subchapterPanel} ${subchaptersOpen ? styles.subchapterPanelOpen : ''}`}
          >
            <ul>
              {chapter.sublinks.map(subchapter => (
                <li key={subchapter.destination}>
                  <Link
                    to={subchapter.destination}
                    className={location.pathname === subchapter.destination ? styles.subchapterActive : undefined}
                    aria-current={location.pathname === subchapter.destination ? 'page' : undefined}
                    onClick={mobile ? () => setDrawerOpen(false) : undefined}
                  >
                    {subchapter.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <nav className={styles.desktopIndex} aria-label="Page chapters">
        <ol>{chapterLinks.map(chapter => renderChapter(chapter))}</ol>
      </nav>

      <button
        ref={triggerRef}
        type="button"
        className={styles.mobileTrigger}
        aria-expanded={drawerOpen}
        aria-controls="detailed-chapter-drawer"
        onClick={() => setDrawerOpen(true)}
      >
        <BookOpen aria-hidden="true" />
        Chapters
      </button>

      {drawerOpen && (
        <div className={styles.drawerBackdrop} onMouseDown={event => {
          if (event.target === event.currentTarget) {
            closeDrawer();
          }
        }}>
          <div
            ref={drawerRef}
            id="detailed-chapter-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chapter-drawer-title"
            onTouchStart={event => {
              touchStartY.current = event.touches[0]?.clientY ?? null;
            }}
            onTouchEnd={event => {
              const endY = event.changedTouches[0]?.clientY;
              if (touchStartY.current !== null && endY && endY - touchStartY.current > 72) closeDrawer();
              touchStartY.current = null;
            }}
          >
            <span className={styles.drawerHandle} aria-hidden="true" />
            <div className={styles.drawerHead}>
              <h2 id="chapter-drawer-title">Chapters</h2>
              <button ref={closeButtonRef} type="button" aria-label="Close chapters" onClick={closeDrawer}>
                <X aria-hidden="true" />
              </button>
            </div>
            <ol>{chapterLinks.map(chapter => renderChapter(chapter, true))}</ol>
          </div>
        </div>
      )}
    </>
  );
}
