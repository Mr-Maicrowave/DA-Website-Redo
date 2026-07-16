import { useEffect, useRef, useState, type FocusEvent, type RefObject, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HERO_CHAPTERS, type HeroChapter } from '@/data/heroChapters';
import styles from './BookHero.module.css';

const DEFAULT_CHAPTER = HERO_CHAPTERS[0];
const FALLBACK_CHAPTER_IMAGE = '/images/community/teacher_kids_warmth.jpg';

const useFallbackImage = (event: SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = FALLBACK_CHAPTER_IMAGE;
};

function ChapterAction({ action, secondary = false }: {
  action: NonNullable<HeroChapter['primaryCta']>;
  secondary?: boolean;
}) {
  const className = secondary ? styles.secondaryAction : styles.primaryAction;
  const content = <>{action.label}<span aria-hidden="true">→</span></>;

  if (action.href.startsWith('#')) {
    return <a className={className} href={action.href}>{content}</a>;
  }

  return <Link className={className} to={action.href}>{content}</Link>;
}

function ChapterPreview({ chapter, previewRef, onBlur, isTurning }: {
  chapter: HeroChapter;
  previewRef: RefObject<HTMLElement>;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
  isTurning: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <article ref={previewRef} className={styles.preview} onBlurCapture={onBlur}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={chapter.id}
          className={styles.previewPanel}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 14, y: 4 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -10, y: -3 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            className={styles.previewImage}
            src={chapter.image}
            alt={chapter.imageAlt}
            decoding="async"
            onError={useFallbackImage}
          />
          <div className={styles.imageVeil} aria-hidden="true" />
          <div className={styles.sunlight} aria-hidden="true" />

          <div className={styles.previewContent}>
            <div className={styles.chapterLabel}>
              <span>{chapter.chapterLabel}</span>
              <i aria-hidden="true">✦</i>
            </div>
            <h1>{chapter.title}</h1>
            <div className={styles.goldRule} aria-hidden="true"><span>✦</span></div>
            <p>{chapter.description}</p>

            {(chapter.primaryCta || chapter.secondaryCta) && (
              <div className={styles.actions}>
                {chapter.primaryCta && <ChapterAction action={chapter.primaryCta} />}
                {chapter.secondaryCta && <ChapterAction action={chapter.secondaryCta} secondary />}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      {isTurning && (
        <div className={styles.pageTurnStage} aria-hidden="true">
          <div className={styles.pageTurnOverlay}>
            <div className={styles.pageTurnFront} />
            <div className={styles.pageTurnBack} />
            <div className={styles.pageTurnFoldShadow} />
          </div>
        </div>
      )}
    </article>
  );
}

function ChapterThumbnail({ chapter, index, active, disabled, onActivate, onPreview }: {
  chapter: HeroChapter;
  index: number;
  active: boolean;
  disabled: boolean;
  onActivate: () => void;
  onPreview: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        className={`${styles.thumbnail} ${active ? styles.currentThumbnail : ''}`}
        aria-label={`Preview chapter ${index + 1}: ${chapter.chapterLabel}`}
        aria-pressed={active}
        aria-disabled={disabled}
        onClick={onActivate}
        onKeyDown={event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          onActivate();
        }}
        onMouseEnter={onPreview}
        onFocus={onPreview}
      >
        <span className={styles.thumbnailImageWrap}>
          <img src={chapter.image} alt="" aria-hidden="true" loading={index < 3 ? 'eager' : 'lazy'} decoding="async" onError={useFallbackImage} />
        </span>
        <span className={styles.thumbnailCopy}>
          <span>{chapter.shortTitle}</span>
          <small aria-hidden="true">{String(index + 1).padStart(2, '0')}</small>
        </span>
      </button>
    </li>
  );
}

export function BookHero() {
  const [activeChapterId, setActiveChapterId] = useState<string>(DEFAULT_CHAPTER.id);
  const [previewChapterId, setPreviewChapterId] = useState<string | null>(null);
  const [isTurning, setIsTurning] = useState(false);
  const reduceMotion = useReducedMotion();
  const railRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const turnTimersRef = useRef<number[]>([]);
  const isTurningRef = useRef(false);

  const visibleChapterId = previewChapterId ?? activeChapterId;
  const visibleChapter = HERO_CHAPTERS.find(chapter => chapter.id === visibleChapterId) ?? DEFAULT_CHAPTER;

  const restoreActiveUnlessFocusIsWithin = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && railRef.current?.contains(nextTarget)) return;
    if (nextTarget instanceof Node && previewRef.current?.contains(nextTarget)) return;
    setPreviewChapterId(null);
  };

  const handlePreviewBlur = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && railRef.current?.contains(nextTarget)) return;
    setPreviewChapterId(null);
  };

  useEffect(() => () => {
    turnTimersRef.current.forEach(timer => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (!window.matchMedia('(max-width: 768px), (max-width: 900px) and (max-height: 500px)').matches) return;

    const rail = railRef.current;
    const activeButton = rail?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!rail || !activeButton) return;

    const activeItem = activeButton.parentElement;
    const itemLeft = activeItem?.offsetLeft ?? activeButton.offsetLeft;
    const targetLeft = itemLeft - (rail.clientWidth - activeButton.offsetWidth) / 2;
    rail.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [activeChapterId, reduceMotion]);

  const scrollToChapter = (chapter: HeroChapter, instant = false) => {
    const target = document.getElementById(chapter.targetSectionId);
    if (!target) return;

    const fixedNavigation = document.querySelector<HTMLElement>('nav');
    const navigationHeight = fixedNavigation?.getBoundingClientRect().height ?? 72;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navigationHeight;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: instant ? 'auto' : 'smooth',
    });
  };

  const activateChapter = (chapter: HeroChapter) => {
    if (isTurningRef.current) return;

    if (reduceMotion) {
      setActiveChapterId(chapter.id);
      setPreviewChapterId(chapter.id);
      scrollToChapter(chapter, true);
      return;
    }

    isTurningRef.current = true;
    setIsTurning(true);

    const commitTimer = window.setTimeout(() => {
      setActiveChapterId(chapter.id);
      setPreviewChapterId(chapter.id);
    }, 380);

    const finishTimer = window.setTimeout(() => {
      scrollToChapter(chapter);
      isTurningRef.current = false;
      setIsTurning(false);
      turnTimersRef.current = [];
    }, 820);

    turnTimersRef.current = [commitTimer, finishTimer];
  };

  return (
    <section id="welcome" className={styles.hero} aria-label="Homepage chapter preview">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.heroShell}>
        <ChapterPreview chapter={visibleChapter} previewRef={previewRef} onBlur={handlePreviewBlur} isTurning={isTurning} />

        <aside
          ref={railRef}
          className={styles.chapterRail}
          aria-label="Homepage chapter previews"
          onMouseLeave={() => setPreviewChapterId(null)}
          onBlurCapture={restoreActiveUnlessFocusIsWithin}
        >
          <ol>
            {HERO_CHAPTERS.map((chapter, index) => (
              <ChapterThumbnail
                key={chapter.id}
                chapter={chapter}
                index={index}
                active={chapter.id === activeChapterId}
                disabled={isTurning}
                onActivate={() => activateChapter(chapter)}
                onPreview={() => setPreviewChapterId(chapter.id)}
              />
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

export default BookHero;
