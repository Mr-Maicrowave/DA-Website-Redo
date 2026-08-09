import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type SyntheticEvent,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import { HERO_CHAPTERS } from '@/data/heroChapters';
import { BOOK_PAGE_DEFINITIONS } from '@/data/bookPages';
import { BookPageContent } from './BookPageContent';
import styles from './BookHero.module.css';

const FALLBACK_CHAPTER_IMAGE = '/images/book-hero/welcome.webp';

const getThumbnailImage = (image: string) => image.replace(/\.webp$/, '-thumb.webp');

const useFallbackImage = (event: SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = FALLBACK_CHAPTER_IMAGE;
};

export function BookHero() {
  const [pageIndex, setPageIndex] = useState(0);
  const [displayedPageIndex, setDisplayedPageIndex] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [isCrossFading, setIsCrossFading] = useState(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'previous'>('next');
  const [previewsOpen, setPreviewsOpen] = useState(false);
  const pageDefinition = BOOK_PAGE_DEFINITIONS[displayedPageIndex];
  const chapter = pageDefinition.source;
  const isArchivalAwardPage = pageDefinition.template === 'trust';
  const pageTotal = HERO_CHAPTERS.length;
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previewRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previewToggleRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const turnTimers = useRef<number[]>([]);
  const isTurningRef = useRef(false);

  useEffect(() => () => {
    turnTimers.current.forEach(timer => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const nextChapter = HERO_CHAPTERS[pageIndex + 1];
    if (!nextChapter) return;

    const nextImage = new Image();
    nextImage.decoding = 'async';
    nextImage.src = nextChapter.image;
  }, [pageIndex]);

  const changePage = (nextIndex: number, focusActiveTab = false) => {
    const boundedIndex = Math.max(0, Math.min(pageTotal - 1, nextIndex));
    if (boundedIndex === pageIndex || isTurningRef.current) return;

    const direction = boundedIndex > pageIndex ? 'next' : 'previous';

    if (reduceMotion) {
      isTurningRef.current = true;
      setIsCrossFading(true);

      const commitTimer = window.setTimeout(() => {
        setDisplayedPageIndex(boundedIndex);
        setPageIndex(boundedIndex);
        if (focusActiveTab) tabRefs.current[boundedIndex]?.focus();
      }, 110);

      const finishTimer = window.setTimeout(() => {
        setIsCrossFading(false);
        isTurningRef.current = false;
        turnTimers.current = [];
      }, 230);

      turnTimers.current = [commitTimer, finishTimer];
      return;
    }

    isTurningRef.current = true;
    setTurnDirection(direction);
    setIsTurning(true);

    const contentTimer = window.setTimeout(() => {
      setDisplayedPageIndex(boundedIndex);
    }, 390);

    const finishTimer = window.setTimeout(() => {
      setPageIndex(boundedIndex);
      setIsTurning(false);
      isTurningRef.current = false;
      turnTimers.current = [];
      if (focusActiveTab) tabRefs.current[boundedIndex]?.focus();
    }, 860);

    turnTimers.current = [contentTimer, finishTimer];
  };

  const previousPage = () => changePage(pageIndex - 1);
  const nextPage = () => changePage(pageIndex + 1);

  const closePreviews = () => {
    setPreviewsOpen(false);
    window.requestAnimationFrame(() => previewToggleRef.current?.focus());
  };

  const selectPreviewChapter = (index: number) => {
    changePage(index);
    closePreviews();
  };

  const handleBookKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && previewsOpen) {
      event.preventDefault();
      closePreviews();
      return;
    }

    if (isTurningRef.current) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const target = event.target;
    if (target instanceof HTMLElement) {
      if (target.closest('a, input, textarea, select, [contenteditable="true"]')) return;
    }

    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(pageTotal - 1, pageIndex + direction));
    if (nextIndex === pageIndex) return;

    event.preventDefault();
    changePage(nextIndex, true);
  };

  const handleSwipeStart = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch' || isTurningRef.current) return;
    const browserGestureEdge = 28;
    if (event.clientX <= browserGestureEdge || event.clientX >= window.innerWidth - browserGestureEdge) return;
    swipeStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const handleSwipeEnd = (event: PointerEvent<HTMLElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || start.pointerId !== event.pointerId || event.pointerType !== 'touch') return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isClearHorizontalSwipe = Math.abs(deltaX) >= 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35;
    if (!isClearHorizontalSwipe) return;

    changePage(deltaX < 0 ? pageIndex + 1 : pageIndex - 1);
  };

  return (
    <section
      id="welcome"
      className={styles.hero}
      aria-label="Homepage chapter preview"
      onKeyDown={handleBookKeyDown}
    >
      <div className={styles.atmosphere} aria-hidden="true" />

      <div className={styles.bookStage}>
        <div className={styles.cover} aria-hidden="true" />
        <div className={styles.pageLayers} aria-hidden="true" />

        <article
          className={`${styles.bookSpread} ${isCrossFading ? styles.crossFading : ''}`}
          onPointerDown={handleSwipeStart}
          onPointerUp={handleSwipeEnd}
          onPointerCancel={() => { swipeStart.current = null; }}
        >
          <div className={`${styles.leftPage} ${isArchivalAwardPage ? styles.awardLeftPage : ''}`}>
            <div className={styles.paperGrain} aria-hidden="true" />
            <div className={styles.pageFrame} aria-hidden="true" />

            <BookPageContent
              chapter={chapter}
              pageNumber={pageIndex + 1}
              template={pageDefinition.template}
            />
            <span className={styles.pageNumber} aria-hidden="true">
              {String(pageIndex + 1).padStart(2, '0')}
            </span>
          </div>

          <div className={styles.gutter} aria-hidden="true" />

          <div className={`${styles.rightPage} ${chapter.imageFit === 'contain' ? styles.containedImagePage : ''} ${isArchivalAwardPage ? styles.archivalDocumentPage : ''}`}>
            <div className={styles.paperGrain} aria-hidden="true" />
            <div className={styles.pageFrame} aria-hidden="true" />
            {isArchivalAwardPage ? (
              <div className={styles.archivalMount}>
                <img
                  className={`${styles.chapterImage} ${styles.containedImage} ${styles.archivalDocumentImage}`}
                  src={chapter.image}
                  alt={chapter.imageAlt}
                  style={{ objectPosition: chapter.imagePosition ?? '50% 50%' }}
                  decoding="async"
                  onError={useFallbackImage}
                />
              </div>
            ) : (
              <img
                className={`${styles.chapterImage} ${chapter.imageFit === 'contain' ? styles.containedImage : ''}`}
                src={chapter.image}
                alt={chapter.imageAlt}
                style={{ objectPosition: chapter.imagePosition ?? '50% 50%' }}
                loading={displayedPageIndex === 0 ? 'eager' : undefined}
                {...{ fetchpriority: displayedPageIndex === 0 ? 'high' : 'auto' }}
                decoding="async"
                onError={useFallbackImage}
              />
            )}
            <div className={styles.imageGrade} aria-hidden="true" />
            <div className={styles.imageEdge} aria-hidden="true" />
          </div>

          {isTurning && (
            <div
              className={`${styles.pageTurnStage} ${turnDirection === 'next' ? styles.turnNext : styles.turnPrevious}`}
              aria-hidden="true"
            >
              <div className={styles.movingGutterShadow} />
              <div className={styles.turningPage}>
                <div className={styles.turningPageFront} />
                <div className={styles.turningPageBack} />
                <div className={styles.foldShadow} />
              </div>
            </div>
          )}
        </article>

        <nav className={styles.chapterTabs} aria-label="Homepage chapters">
          <ol>
            {HERO_CHAPTERS.map((chapterDefinition, index) => {
              const isActive = index === pageIndex;
              const pageNumber = String(index + 1).padStart(2, '0');

              return (
                <li key={chapterDefinition.id}>
                  <button
                    ref={element => { tabRefs.current[index] = element; }}
                    type="button"
                    className={isActive ? styles.activeTab : undefined}
                    aria-label={`Open chapter ${pageNumber}: ${chapterDefinition.shortTitle}`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-pressed={isActive}
                    disabled={isTurning}
                    onClick={() => changePage(index)}
                  >
                    <small aria-hidden="true">{pageNumber}</small>
                    <span>{chapterDefinition.shortTitle}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <button
          ref={previewToggleRef}
          type="button"
          className={styles.previewToggle}
          aria-label={previewsOpen ? 'Close chapter previews' : 'Open chapter previews'}
          aria-expanded={previewsOpen}
          aria-controls="book-chapter-previews"
          onClick={() => {
            setPreviewsOpen(current => {
              const next = !current;
              if (next) {
                window.requestAnimationFrame(() => previewRefs.current[pageIndex]?.focus());
              }
              return next;
            });
          }}
        >
          <span aria-hidden="true">▤</span>
          <span className={styles.previewToggleLabel}>Chapters</span>
        </button>

        {previewsOpen && (
          <aside
            id="book-chapter-previews"
            className={styles.previewDrawer}
            aria-label="Chapter previews"
          >
            <ol>
              {HERO_CHAPTERS.map((chapterDefinition, index) => {
                const isActive = index === pageIndex;
                const pageNumber = String(index + 1).padStart(2, '0');

                return (
                  <li key={chapterDefinition.id}>
                    <button
                      ref={element => { previewRefs.current[index] = element; }}
                      type="button"
                      className={isActive ? styles.activePreview : undefined}
                      aria-label={`Turn to chapter ${pageNumber}: ${chapterDefinition.title}`}
                      aria-current={isActive ? 'page' : undefined}
                      aria-pressed={isActive}
                      disabled={isTurning}
                      onClick={() => selectPreviewChapter(index)}
                    >
                      <span className={`${styles.previewThumbImage} ${chapterDefinition.imageFit === 'contain' ? styles.containedThumbnail : ''}`}>
                        <img
                          src={getThumbnailImage(chapterDefinition.image)}
                          alt=""
                          aria-hidden="true"
                          width="320"
                          height="213"
                          loading="lazy"
                          decoding="async"
                          onError={useFallbackImage}
                        />
                      </span>
                      <span className={styles.previewThumbCopy}>
                        <small aria-hidden="true">{pageNumber}</small>
                        <span>{chapterDefinition.title}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
        )}

        <nav className={styles.pageControls} aria-label="Book page navigation">
          <button type="button" onClick={previousPage} disabled={pageIndex === 0 || isTurning}>
            <span aria-hidden="true">←</span> Previous
          </button>
          <output className={styles.pageCounter} aria-live="polite" aria-atomic="true">
            {String(pageIndex + 1).padStart(2, '0')} <span aria-hidden="true">/</span><span className={styles.visuallyHidden}> of </span> {String(pageTotal).padStart(2, '0')}
          </output>
          <button type="button" onClick={nextPage} disabled={pageIndex === pageTotal - 1 || isTurning}>
            Next <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
    </section>
  );
}

export default BookHero;
