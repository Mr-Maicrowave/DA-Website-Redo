import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, X } from 'lucide-react';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeChapterId = getActiveChapterId(location.pathname);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

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

  if (location.pathname === '/') return null;

  const chapterLinks = HERO_CHAPTERS.map((chapter, index) => ({
    ...chapter,
    pageNumber: String(index + 1).padStart(2, '0'),
    destination: CHAPTER_DESTINATIONS[chapter.id],
    active: chapter.id === activeChapterId,
  }));

  return (
    <>
      <nav className={styles.desktopIndex} aria-label="Page chapters">
        <ol>
          {chapterLinks.map(chapter => (
            <li key={chapter.id}>
              <Link
                to={chapter.destination}
                className={chapter.active ? styles.active : undefined}
                aria-current={chapter.active ? 'page' : undefined}
                aria-label={`Chapter ${chapter.pageNumber}: ${chapter.chapterLabel}`}
              >
                <small aria-hidden="true">{chapter.pageNumber}</small>
                <span>{chapter.chapterLabel}</span>
              </Link>
            </li>
          ))}
        </ol>
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
            setDrawerOpen(false);
            triggerRef.current?.focus();
          }
        }}>
          <div
            ref={drawerRef}
            id="detailed-chapter-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chapter-drawer-title"
          >
            <div className={styles.drawerHead}>
              <h2 id="chapter-drawer-title">Chapters</h2>
              <button ref={closeButtonRef} type="button" aria-label="Close chapters" onClick={() => {
                setDrawerOpen(false);
                triggerRef.current?.focus();
              }}>
                <X aria-hidden="true" />
              </button>
            </div>
            <ol>
              {chapterLinks.map(chapter => (
                <li key={chapter.id}>
                  <Link
                    to={chapter.destination}
                    className={chapter.active ? styles.active : undefined}
                    aria-current={chapter.active ? 'page' : undefined}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <small aria-hidden="true">{chapter.pageNumber}</small>
                    <span>{chapter.chapterLabel}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
