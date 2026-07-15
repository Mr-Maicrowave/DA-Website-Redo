import { useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import styles from './BookHero.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

export function ChapterHeading() {
  return (
    <div className={styles.chapterHeading}>
      <span>Chapter One</span>
      <span className={styles.chapterRule} aria-hidden="true"><i>✦</i></span>
    </div>
  );
}

export function Bookmark() {
  return (
    <div className={styles.bookmark} aria-hidden="true">
      <span>✦</span>
    </div>
  );
}

const chapterLabels = [
  'Opening chapter',
  'Our philosophy',
  'The DA journey',
  'Programs',
  'Our educators',
  'Inside DA',
  'Subjects',
  'Student stories',
  'Results',
];

export function ChapterIndex() {
  const jumpToChapter = (index: number) => {
    const sections = document.querySelectorAll<HTMLElement>('main > section');
    sections[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={styles.chapterIndex} aria-label="Homepage chapters">
      <ol>
        {chapterLabels.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              className={index === 0 ? styles.activeChapter : undefined}
              aria-current={index === 0 ? 'location' : undefined}
              aria-label={`Chapter ${index + 1}: ${label}`}
              onClick={() => jumpToChapter(index)}
            >
              {String(index + 1).padStart(2, '0')}
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ol>
      <i aria-hidden="true">✦</i>
    </nav>
  );
}

export function LeftPage() {
  return (
    <article className={`${styles.page} ${styles.leftPage}`}>
      <Bookmark />
      <div className={styles.leftContent}>
        <ChapterHeading />
        <h1 id="book-hero-title">Where Every<br />Story Begins</h1>
        <div className={styles.ornamentRule} aria-hidden="true"><span>✦</span></div>
        <p>
          Every child arrives with a different story.
          <br />
          At DA, we help them build confidence, discover their strengths and write what comes next.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryAction} to="/book-interview">
            Begin the Journey <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Our Programs <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <span className={styles.pageNumber} aria-hidden="true">01</span>
      <span className={styles.cornerOrnament} aria-hidden="true">⌜</span>
    </article>
  );
}

export function RightPage() {
  return (
    <article className={`${styles.page} ${styles.rightPage}`} aria-label="A DA Tuition tutor supporting a young student">
      <div className={styles.photoWash} aria-hidden="true" />
      <img
        src="/images/community/tutor_one_on_one.jpg"
        alt="A DA Tuition tutor helping a young student with her work"
        fetchPriority="high"
        decoding="async"
      />
      <span className={styles.photoCaption}>Guidance that begins with knowing the student.</span>
      <span className={styles.rightPageNumber} aria-hidden="true">02</span>
    </article>
  );
}

export function BookSpine() {
  return <div className={styles.spine} aria-hidden="true"><span /></div>;
}

export function BookHero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bookScale = useTransform(scrollYProgress, [0, .72], [1, 1.075]);
  const bookRadius = useTransform(scrollYProgress, [0, .7], ['18px', '0px']);
  const edgeOpacity = useTransform(scrollYProgress, [0, .58, .88], [1, .42, 0]);
  const spineOpacity = useTransform(scrollYProgress, [0, .55, .88], [1, .35, 0]);
  const backdropOpacity = useTransform(scrollYProgress, [0, .72], [1, 0]);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="book-hero-title">
      <motion.div className={styles.atmosphere} style={{ opacity: reduceMotion ? 0 : backdropOpacity }} aria-hidden="true" />
      <div className={styles.dust} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--dust-index': index } as CSSProperties} />)}
      </div>
      <div className={styles.stickyStage}>
        <motion.div
          className={styles.book}
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.05, ease }}
          style={{ scale: reduceMotion ? 1 : bookScale, borderRadius: reduceMotion ? 0 : bookRadius }}
        >
          <motion.div className={styles.bookEdges} style={{ opacity: reduceMotion ? 0 : edgeOpacity }} aria-hidden="true" />
          <div className={styles.pages}>
            <LeftPage />
            <motion.div className={styles.spineWrap} style={{ opacity: reduceMotion ? 0 : spineOpacity }}><BookSpine /></motion.div>
            <RightPage />
          </div>
          <ChapterIndex />
          <motion.div className={styles.pageStack} style={{ opacity: reduceMotion ? 0 : edgeOpacity }} aria-hidden="true" />
        </motion.div>
      </div>
      <div className={styles.scrollHandoff} aria-hidden="true" />
    </section>
  );
}

export default BookHero;
