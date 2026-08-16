import FooterNew from '@/components/FooterNew';
import ReviewCard from '@/components/success-stories/ReviewCard';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { successStories, type SuccessStory } from '@/data/successStories';
import { testimonials } from '@/data/testimonials';
import { googleReviews, type GoogleReview } from '@/data/googleReviews';
import { successStoryReviewCards } from '@/data/successStoryReviewCards';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionStyle, type MotionValue } from 'framer-motion';
import { BookOpen, ChartNoAxesCombined, GraduationCap, Heart, Paperclip, Rocket, Sparkles, Sprout, Target, Trophy, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import './SuccessStories.css';

const easeOut = [0.22, 1, 0.36, 1] as const;

type StoryPanel = {
  id: string;
  number: string;
  chapterTitle: string;
  artwork: string;
  artworkAlt: string;
  artworkPosition: string;
  artworkFit: 'cover' | 'contain';
  artworkWidth: number;
  artworkHeight: number;
  artworkCaption: string;
  accent: string;
  studentName: string;
  subject: string;
  headlineLead: string;
  headlineResult: string;
  headlineQuoted?: boolean;
  narrative: string[];
  quote?: string;
  beforeLabel: string;
  afterLabel: string;
  before: string;
  after: string;
  resultLabel: string;
  story: SuccessStory | (typeof testimonials)[number];
};

const katelinStory = successStories.find((story) => story.name === 'Katelin Trinh');
const emilyStory = successStories.find((story) => story.name === 'Emily Nguyen');
const melissaStory = successStories.find((story) => story.name === 'Melissa Ly');
const bryantStory = successStories.find((story) => story.name === 'Bryant Lam');
const joieStory = successStories.find((story) => story.name === 'Joie Lim');
const tuStory = testimonials.find((story) => story.author === 'Tu Nguyen');

if (!katelinStory || !emilyStory || !melissaStory || !bryantStory || !joieStory || !tuStory) {
  throw new Error('Required verified Success Stories data is missing.');
}

const storyPanels: StoryPanel[] = [
  {
    id: 'the-climb',
    number: '01',
    chapterTitle: 'The Climb',
    artwork: '/images/success-stories/story-01-the-climb.png',
    artworkAlt: 'Painted interpretation of a student facing a staircase rising toward warm light.',
    artworkPosition: '56% center',
    artworkFit: 'cover',
    artworkWidth: 1536,
    artworkHeight: 1024,
    artworkCaption: 'From uncertainty to momentum.',
    accent: '#8fb3d9',
    studentName: katelinStory.name,
    subject: katelinStory.subject,
    headlineLead: 'I moved from',
    headlineResult: '15th to 6th.',
    headlineQuoted: true,
    narrative: [
      'At the beginning of her senior studies, English had become a challenge. Katelin was not reaching the results she had hoped for, and the subject had begun to test her confidence.',
      'With Ms Jenny’s patience and encouragement, she found room to ask questions, make mistakes and keep pushing. The support helped turn uncertainty into momentum — and momentum into a result she could see.',
    ],
    quote: katelinStory.quote,
    beforeLabel: 'Before',
    afterLabel: 'After',
    before: '15TH',
    after: '6TH',
    resultLabel: 'Final HSC English assessment rank',
    story: katelinStory,
  },
  {
    id: 'the-maze-becomes-clear', number: '02', chapterTitle: 'The Maze Becomes Clear', artwork: '/images/success-stories/story-02-the-maze.png',
    artworkAlt: 'Painted interpretation of a student entering an ivy-covered maze leading toward a glowing destination.', artworkPosition: '50% 48%', artworkFit: 'contain', artworkWidth: 1535, artworkHeight: 1024, artworkCaption: 'From confusion to clarity.', accent: '#9ebfa6', studentName: emilyStory.name, subject: emilyStory.subject,
    headlineLead: 'Understanding first.', headlineResult: 'Then the results followed.',
    narrative: [
      'Emily began at DA in Year 5 as an above-average student who still had room to grow. The shift came through years of steady teaching from Miss Linda and Miss Lai: difficult work became something she could approach with confidence rather than uncertainty.',
      'That understanding changed what she expected of herself. Her mathematics results moved into the high 90s, culminating in second place in her grade and a perfect score on her most recent test.',
    ],
    quote: emilyStory.quote,
    beforeLabel: 'Starting point', afterLabel: 'Outcome', before: 'ABOVE AVERAGE', after: '2ND PLACE', resultLabel: 'Mathematics — plus 100% in her most recent test', story: emilyStory,
  },
  {
    id: 'breaking-through', number: '03', chapterTitle: 'Breaking Through', artwork: '/images/success-stories/story-03-the-breakthrough.png',
    artworkAlt: 'Painted interpretation of a student breaking through a barrier into bright golden light.', artworkPosition: '50% center', artworkFit: 'contain', artworkWidth: 1536, artworkHeight: 1024, artworkCaption: 'The moment possibility became real.', accent: '#d58a62', studentName: melissaStory.name, subject: melissaStory.subject,
    headlineLead: 'The ceiling broke.', headlineResult: 'First place followed.',
    narrative: [
      'Melissa started as a struggling mathematics student with weak foundations in the basics of high-school maths. Entering Miss Amanda’s GAT class became the turning point: it gave her another chance to work deliberately toward the goals she had set herself.',
      'Across two years, her marks climbed into the 80–100% range. The breakthrough was not one isolated result—it included her first-ever 100% on a 2-unit assessment and first place in her 2-unit trial exam.',
    ],
    quote: melissaStory.quote,
    beforeLabel: 'Starting point', afterLabel: 'Result', before: 'STRUGGLING', after: 'RANKED 1ST', resultLabel: '2-unit Mathematics trial examination', story: melissaStory,
  },
  {
    id: 'five-lights', number: '04', chapterTitle: 'Five Lights', artwork: '/images/success-stories/story-04-five-lights.png',
    artworkAlt: 'Painted interpretation of a student facing five monumental glowing arches.', artworkPosition: '50% center', artworkFit: 'contain', artworkWidth: 1536, artworkHeight: 1024, artworkCaption: 'One goal became five achievements.', accent: '#b7a5cf', studentName: bryantStory.name, subject: 'HSC',
    headlineLead: 'Five subjects.', headlineResult: 'Five Band 6s.',
    narrative: [
      'Bryant’s achievement grew from eight years of foundations rather than one fortunate exam. He arrived describing himself as an average student with doubts about his academic ability; over time, his tutors drew out greater confidence, sharper skills and genuine motivation across his studies.',
      'That consistency carried into the HSC. Five subjects became five Band 6 results—and an ATAR that made his parents proud. More importantly, Bryant left believing the skills he built could travel with him into the future.',
    ],
    quote: bryantStory.quote,
    beforeLabel: 'Then', afterLabel: 'HSC outcome', before: 'AVERAGE STUDENT', after: 'FIVE BAND 6s', resultLabel: 'Consistent achievement across five HSC subjects', story: bryantStory,
  },
  {
    id: 'the-hundred', number: '05', chapterTitle: 'The Hundred', artwork: '/images/success-stories/story-05-the-hundred.png',
    artworkAlt: 'Painted interpretation of a student celebrating a 100 percent academic result at a study desk.', artworkPosition: '50% center', artworkFit: 'contain', artworkWidth: 1254, artworkHeight: 1254, artworkCaption: 'A milestone worth remembering.', accent: '#e4c36a', studentName: joieStory.name, subject: joieStory.subject,
    headlineLead: 'The first 100%.', headlineResult: 'Then another.',
    narrative: [
      'Joie joined DA during the second term of Year 12. Structured mathematics resources—flashcards, past trials, topic-sorted HSC questions and targeted trial classes—gave her the practice she needed to face unfamiliar questions with greater confidence.',
      'The milestone arrived quickly: 100% in both assessments two and three, followed by 97% in her mathematics trial. Her rank moved from 13th in semester one to first overall in her school’s Mathematics Standard course by the end of Year 12.',
    ],
    quote: joieStory.quote,
    beforeLabel: 'Semester one', afterLabel: 'Year 12 outcome', before: 'RANKED 13TH', after: 'RANKED 1ST', resultLabel: 'Mathematics Standard — including two 100% assessments', story: joieStory,
  },
  {
    id: 'beyond-the-result', number: '06', chapterTitle: 'Beyond the Result', artwork: '/images/success-stories/story-06-the-horizon.png',
    artworkAlt: 'Painted interpretation of a student overlooking branching paths toward a bright horizon.', artworkPosition: '50% center', artworkFit: 'contain', artworkWidth: 1536, artworkHeight: 1024, artworkCaption: 'What happens when the future opens up.', accent: '#a8c7df', studentName: tuStory.author, subject: 'Mathematics & English',
    headlineLead: 'The result changed.', headlineResult: 'So did what felt possible.',
    narrative: [
      'Tu arrived near the end of Year 11 academically behind and low in confidence, particularly in mathematics. After being advised to withdraw from Extension 1, he had begun to believe he simply was not capable. Patient guidance rebuilt his foundations—and, within a month, genuine improvement began to feel possible.',
      'The marks that followed were extraordinary, but Tu’s lasting outcome was a new discipline and belief in growth. He ranked first in every subject throughout Year 12 and attained a 99.05 ATAR, carrying forward a conviction that achievement can be cultivated.',
    ],
    quote: tuStory.bottomQuote ?? tuStory.pullQuotes[4]?.text,
    beforeLabel: 'Starting point', afterLabel: 'Overall outcome', before: 'LOW CONFIDENCE', after: '99.05 ATAR', resultLabel: 'Ranked 1st in every subject throughout Year 12', story: tuStory,
  },
];

type SuccessStoryPanelProps = {
  panel: StoryPanel;
  reduceMotion: boolean | null;
  stackIndex: number;
  stackProgress: MotionValue<number>;
  onOpenStory: (index: number) => void;
};

const SuccessStoryPanel = ({ panel, reduceMotion, stackIndex, stackProgress, onOpenStory }: SuccessStoryPanelProps) => {
  const panelCount = storyPanels.length;
  const transitionCount = Math.max(panelCount - 1, 1);
  const isFinalPanel = stackIndex === panelCount - 1;
  const carouselY = useTransform(stackProgress, (progress) => {
    const phase = progress * transitionCount - stackIndex;
    if (phase < 0) return `${Math.min(Math.abs(phase), 5) * 58}px`;
    // Keep the final story framed in place until the sticky sequence releases.
    // It then leaves through normal document flow, allowing the review scene
    // immediately below to follow it without an empty transition viewport.
    if (isFinalPanel) return '0%';
    if (phase > 1) return '-118%';
    return `${phase * -118}%`;
  });
  const carouselRotate = useTransform(stackProgress, (progress) => {
    const phase = progress * transitionCount - stackIndex;
    if (phase <= 0 || isFinalPanel) return 0;
    return Math.min(phase, 1) * (stackIndex % 2 === 0 ? -2.2 : 2.2);
  });
  const carouselTilt = useTransform(stackProgress, (progress) => {
    const phase = progress * transitionCount - stackIndex;
    if (phase <= 0 || isFinalPanel) return 0;
    return Math.min(phase, 1) * -4.5;
  });
  const carouselScale = useTransform(stackProgress, (progress) => {
    const phase = progress * transitionCount - stackIndex;
    if (phase < 0) return 1 - Math.min(Math.abs(phase), 5) * 0.004;
    if (isFinalPanel) return 1;
    return 1 - Math.min(phase, 1) * 0.035;
  });
  const carouselOpacity = useTransform(stackProgress, (progress) => {
    const phase = progress * transitionCount - stackIndex;
    if (phase < 0) return Math.max(0.9, 1 - Math.abs(phase) * 0.02);
    if (isFinalPanel) return 1;
    if (phase > 0.82) return Math.max(0, 1 - ((phase - 0.82) / 0.18));
    return 1;
  });
  const panelStyle = {
    '--story-accent': panel.accent,
    '--stack-index': stackIndex,
    '--artwork-position': panel.artworkPosition,
    '--artwork-fit': panel.artworkFit,
    ...(reduceMotion ? {} : {
      y: carouselY,
      rotateZ: carouselRotate,
      rotateX: carouselTilt,
      scale: carouselScale,
      opacity: carouselOpacity,
    }),
  } as unknown as MotionStyle;
  const scrollReveal = (delay: number, y = 20) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.38 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.68, delay, ease: easeOut },
  });

  return (
    <motion.article
      id={`story-${panel.id}`}
      className={`ss-story-panel ss-story-panel--art-${panel.artworkFit}${panel.id === 'the-climb' ? ' ss-story-panel--the-climb' : ''}`}
      style={panelStyle}
      aria-labelledby={`story-${panel.id}-heading`}
    >
      <div className="ss-story-panel__interior">
        <motion.figure
        initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.84, ease: easeOut }}
        className="ss-story-panel__artwork"
        >
          <img
            src={panel.artwork}
            alt={panel.artworkAlt}
            width={panel.artworkWidth}
            height={panel.artworkHeight}
            loading={stackIndex < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
          {panel.id === 'the-climb' && panel.quote && (
            <motion.blockquote {...scrollReveal(0.52, 14)} className="ss-climb-quote">
              “{panel.quote}”
            </motion.blockquote>
          )}
          <figcaption>
            <strong>{panel.chapterTitle} — Story {panel.number}</strong>
            <span>{panel.artworkCaption}</span>
          </figcaption>
        </motion.figure>

        <div className="ss-story-panel__story">
          <motion.header {...scrollReveal(0.16, 14)} className="ss-story-panel__header">
            <p className="sr-only">{panel.number} — {panel.chapterTitle}</p>
            <strong>{panel.studentName}</strong>
            <span>{panel.subject}{panel.number === '01' ? ' · HSC' : ''}</span>
          </motion.header>

          <motion.h2 {...scrollReveal(0.27, 24)} id={`story-${panel.id}-heading`} className="sr-only">
            {panel.headlineQuoted && '“'}{panel.headlineLead} {panel.headlineResult}{panel.headlineQuoted && '”'}
          </motion.h2>

          <span className="ss-story-panel__editorial-rule" aria-hidden="true" />

          {panel.id === 'the-climb' ? (
            <>
              <motion.p {...scrollReveal(0.31, 14)} className="ss-climb-intro">
                With consistent guidance and a clear plan, Katelin turned her challenges into outstanding results.
              </motion.p>
              <motion.div {...scrollReveal(0.39, 16)} className="ss-climb-result" aria-label="In-school rank improved from 15th to 6th">
                <div><span>Before</span><strong>15th</strong><small>in-school rank</small></div>
                <i aria-hidden="true">→</i>
                <div><span>After</span><strong>6th</strong><small>in-school rank</small></div>
              </motion.div>
              <motion.div {...scrollReveal(0.52, 14)} className="ss-climb-achievements">
                <div><Target aria-hidden="true" /><strong>Clear Goals</strong><span>Focused study strategy</span></div>
                <div><BookOpen aria-hidden="true" /><strong>Consistent Effort</strong><span>Smarter practice every week</span></div>
                <div><Trophy aria-hidden="true" /><strong>Outstanding Results</strong><span>Top 10 rank in HSC English</span></div>
              </motion.div>
              <motion.button
                {...scrollReveal(0.66, 10)}
                type="button"
                className="ss-story-panel__link ss-story-panel__link--full"
                aria-label="Read Katelin's full story"
                onClick={() => onOpenStory(stackIndex)}
              >
                  Read Katelin’s full story <span aria-hidden="true">→</span>
              </motion.button>
            </>
          ) : (
          <>
          <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.65 }}
          className={`ss-story-panel__result${Math.max(panel.before.length, panel.after.length) > 9 ? ' ss-story-panel__result--compact' : ''}`}
          aria-label={`${panel.resultLabel}: ${panel.beforeLabel} ${panel.before}, ${panel.afterLabel} ${panel.after}`}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.48, delay: 0.1, ease: easeOut } } }}>
              <span>{panel.beforeLabel}</span>
              <strong>{panel.before}</strong>
            </motion.div>
            <motion.i variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: reduceMotion ? 0 : 0.5, delay: 0.3, ease: easeOut } } }} aria-hidden="true">→</motion.i>
            <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.48, delay: 0.52, ease: easeOut } } }}>
              <span>{panel.afterLabel}</span>
              <strong>{panel.after}</strong>
            </motion.div>
            <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.45, delay: 0.68 } } }}>{panel.resultLabel}</motion.p>
          </motion.div>

          {panel.quote && (
            <motion.blockquote {...scrollReveal(0.49, 16)}>
              “{panel.quote}”
            </motion.blockquote>
          )}

          <motion.button
            {...scrollReveal(0.72, 10)}
            type="button"
            className="ss-story-panel__link ss-story-panel__link--full"
            aria-label={`Read ${panel.studentName}'s full story`}
            onClick={() => onOpenStory(stackIndex)}
          >
              Read {panel.studentName.split(' ')[0]}'s full story <span aria-hidden="true">→</span>
          </motion.button>
          </>
          )}
        </div>
      </div>

      <img
        className="ss-story-panel__frame ss-story-panel__frame--universal"
        src="/images/success-stories/heritage-crest-frame-universal.png"
        width="1672"
        height="941"
        alt=""
        aria-hidden="true"
      />
      <span
        className={`ss-story-panel__plaque${panel.chapterTitle.length > 16 ? ' ss-story-panel__plaque--compact' : ''}`}
        aria-hidden="true"
      >
        {panel.number} · {panel.chapterTitle}
      </span>
    </motion.article>
  );
};

const SuccessStoryCarousel = ({ reduceMotion, onOpenStory }: { reduceMotion: boolean | null; onOpenStory: (index: number) => void }) => {
  const stackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={stackRef}
      className={`ss-story-stack${reduceMotion ? ' ss-story-stack--reduced' : ''}`}
      style={{
        // A sticky stage needs one viewport for its own visible height plus
        // one viewport per transition. This makes the sixth story arrive at
        // the exact end of the runway, with the review scene immediately next.
        '--story-scroll-height': `${Math.max(storyPanels.length, 1) * 100}svh`,
      } as CSSProperties}
      aria-label="Student turning point stories"
    >
      <div className="ss-story-stack__stage">
        <div className="ss-container ss-story-stack__track">
          {storyPanels.map((panel, index) => (
            <SuccessStoryPanel
              key={panel.number}
              panel={panel}
              reduceMotion={reduceMotion}
              stackIndex={index}
              stackProgress={scrollYProgress}
              onOpenStory={onOpenStory}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const getCompleteStoryParagraphs = (panel: StoryPanel) => {
  if ('bodyParagraphs' in panel.story) return panel.story.bodyParagraphs;
  return [panel.story.appreciation, panel.story.advice]
    .flatMap((section) => section.split(/\n\s*\n/))
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const storySheetThemes: Record<string, { accent: string; wash: string; motif: string; annotation?: string }> = {
  'the-climb': { accent: '#a9bfd5', wash: '#dce6ee', motif: 'steps' },
  'the-maze-becomes-clear': { accent: '#abc6b2', wash: '#e0e9df', motif: 'maze' },
  'breaking-through': {
    accent: '#b9a8d0',
    wash: '#e5dff0',
    motif: 'mountain',
    annotation: 'You know what else I’ve never dreamed of happening ever?',
  },
  'five-lights': { accent: '#b7add0', wash: '#e4dfed', motif: 'constellation' },
  'the-hundred': { accent: '#d7bc69', wash: '#eee4bd', motif: 'milestone' },
  'beyond-the-result': { accent: '#a9c3d6', wash: '#dde8ef', motif: 'horizon' },
};

const getFutureStudentNote = (panel: StoryPanel, paragraphs: string[]) => {
  if ('advice' in panel.story) {
    const adviceParagraphs = panel.story.advice
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    return adviceParagraphs.at(-1) ?? paragraphs.at(-1) ?? '';
  }
  return paragraphs.at(-1) ?? '';
};

type StudentStoryModalProps = {
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onClose: () => void;
  reduceMotion: boolean | null;
};

const StudentStoryModal = ({ selectedIndex, onSelect, onClose, reduceMotion }: StudentStoryModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = selectedIndex !== null;
  const panel = selectedIndex === null ? null : storyPanels[selectedIndex];
  const paragraphs = panel ? getCompleteStoryParagraphs(panel) : [];
  const midpoint = Math.max(1, Math.ceil(paragraphs.length / 2));
  const theme = panel ? storySheetThemes[panel.id] : storySheetThemes['the-climb'];
  const futureStudentNote = panel ? getFutureStudentNote(panel, paragraphs) : '';

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {panel && selectedIndex !== null && (
        <motion.div
          className="ss-story-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="student-story-modal-title"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            className="ss-story-sheet"
            initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: easeOut }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button ref={closeButtonRef} type="button" className="ss-story-sheet__close" onClick={onClose} aria-label="Close student story">×</button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={panel.id}
                className={`ss-story-sheet__page ss-story-sheet__page--${theme.motif}`}
                style={{
                  '--sheet-accent': theme.accent,
                  '--sheet-wash': theme.wash,
                } as CSSProperties}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: easeOut }}
              >
                <header className="ss-story-sheet__header">
                  <img src="/images/da-logo.png" alt="DA Tuition" width={160} height={160} />
                  <div className="ss-story-sheet__identity">
                    <p>Student story · {panel.number} / 06</p>
                    <h2 id="student-story-modal-title">{panel.studentName}</h2>
                    <span>{panel.subject} · {panel.chapterTitle}</span>
                  </div>
                  {theme.annotation && <p className="ss-story-sheet__annotation">{theme.annotation}</p>}
                </header>

                <div className="ss-story-sheet__rule" aria-hidden="true" />

                <div className="ss-story-sheet__main">
                  <section className="ss-story-sheet__story-column">
                    <p className="ss-story-sheet__section-label">My story</p>
                    <div className="ss-story-sheet__review">
                      {paragraphs.slice(0, midpoint).map((paragraph, index) => (
                        <p key={`${panel.id}-paragraph-${index + 1}`}>{paragraph}</p>
                      ))}
                    </div>

                    {panel.quote && (
                      <blockquote className="ss-story-sheet__pull-quote">“{panel.quote}”</blockquote>
                    )}

                    <div className="ss-story-sheet__review">
                      {paragraphs.slice(midpoint).map((paragraph, index) => (
                        <p key={`${panel.id}-paragraph-${midpoint + index + 1}`}>{paragraph}</p>
                      ))}
                    </div>
                  </section>

                  <aside className="ss-story-sheet__achievement" aria-label={`${panel.afterLabel}: ${panel.after}`}>
                    <svg className="ss-story-sheet__path" viewBox="0 0 160 400" aria-hidden="true">
                      <path d="M39 8 C 125 88, 19 132, 88 210 S 40 310, 115 391" />
                      <circle cx="39" cy="8" r="4" />
                      <circle cx="115" cy="391" r="4" />
                    </svg>
                    <div className="ss-story-sheet__outcome">
                      <span>The turning point</span>
                      <strong>{panel.after}</strong>
                      <p>{panel.resultLabel}</p>
                    </div>
                    <img className="ss-story-sheet__mountain" src="/images/success-stories/student-story-mountain.png" alt="" />
                    <span className="ss-story-sheet__sparkles" aria-hidden="true">✦ · ✧</span>
                  </aside>
                </div>

                <aside className="ss-story-sheet__future-note">
                  <span>A note to future students</span>
                  <p>{futureStudentNote}</p>
                  <i aria-hidden="true">DA</i>
                </aside>

                <footer className="ss-story-sheet__ending">
                  <strong>{panel.studentName}</strong>
                  <span>Thank you for letting DA be part of your story.</span>
                </footer>
              </motion.article>
            </AnimatePresence>

            <nav className="ss-story-sheet__navigation" aria-label="Browse student stories">
              <button type="button" onClick={() => onSelect((selectedIndex - 1 + storyPanels.length) % storyPanels.length)}>← Previous</button>
              <span>{panel.number} / 06</span>
              <button type="button" onClick={() => onSelect((selectedIndex + 1) % storyPanels.length)}>Next →</button>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

const GoogleReviewMark = () => (
  <svg className="ss-google-mark" viewBox="0 0 24 24" role="img" aria-label="Google">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const normalizeReviewText = (text: string) => text
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .replace(/[.,!?\'"“”‘’]/g, '')
  .trim();

const uniqueRibbonReviews = googleReviews.filter((review, index, reviews) => {
  const fingerprint = `${review.author.trim().toLowerCase()}\u0000${normalizeReviewText(review.text)}`;
  return reviews.findIndex((candidate) => (
    `${candidate.author.trim().toLowerCase()}\u0000${normalizeReviewText(candidate.text)}` === fingerprint
  )) === index;
});

const ribbonRows = [
  uniqueRibbonReviews.filter((_, index) => index % 2 === 0),
  uniqueRibbonReviews.filter((_, index) => index % 2 === 1),
] as const;

const ReviewRibbonCard = ({ review, index }: { review: GoogleReview; index: number }) => (
  <article
    className="ss-praise-ribbon__card"
    style={{
      '--ribbon-tilt': `${[-0.7, 0.45, -0.3, 0.65, -0.4][index % 5]}deg`,
      '--ribbon-lift': `${[-3, 2, 4, -2, 1][index % 5]}px`,
    } as CSSProperties}
    aria-label={`${review.rating} out of 5 star Google review from ${review.author}`}
  >
    <GoogleReviewMark />
    <p>{review.text}</p>
    <footer>
      <span>— {review.author}</span>
      <small>{review.date}</small>
    </footer>
    <div className="ss-praise-ribbon__stars" aria-label={`${review.rating} out of 5 stars`}>
      {'★'.repeat(review.rating)}
    </div>
  </article>
);

const ReviewRibbon = ({ reduceMotion }: { reduceMotion: boolean | null }) => (
  <section
    className={`ss-praise-ribbon${reduceMotion ? ' ss-praise-ribbon--reduced' : ''}`}
    aria-labelledby="praise-ribbon-heading"
  >
    <span className="ss-praise-ribbon__loop" aria-hidden="true" />
    <span className="ss-praise-ribbon__spark ss-praise-ribbon__spark--one" aria-hidden="true">✦</span>
    <span className="ss-praise-ribbon__spark ss-praise-ribbon__spark--two" aria-hidden="true">✧</span>
    <motion.h2
      id="praise-ribbon-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: easeOut }}
    >
      <span aria-hidden="true" />
      Their words. Our proudest moments.
      <span aria-hidden="true" />
    </motion.h2>

    <div className="ss-praise-ribbon__rows">
      {ribbonRows.map((reviews, rowIndex) => (
        <motion.div
          key={`ribbon-row-${rowIndex + 1}`}
          className={`ss-praise-ribbon__row ss-praise-ribbon__row--${rowIndex === 0 ? 'forward' : 'reverse'}`}
          initial={reduceMotion ? false : { opacity: 0, x: rowIndex === 0 ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.62, delay: 0.12 + rowIndex * 0.1, ease: easeOut }}
        >
          <div className="ss-praise-ribbon__track">
            <div className="ss-praise-ribbon__group">
              {reviews.map((review, index) => <ReviewRibbonCard key={`${review.author}-${index}`} review={review} index={index} />)}
            </div>
            <div className="ss-praise-ribbon__group" aria-hidden="true">
              {reviews.map((review, index) => <ReviewRibbonCard key={`loop-${review.author}-${index}`} review={review} index={index} />)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

type ParentReviewSource = {
  id: string;
  reviewer: string;
  descriptor: string;
  text: string;
};

type ParentNote = ParentReviewSource & {
  theme: string;
  quote: string;
  icon: LucideIcon;
};

const explicitParentGoogleReview: ParentReviewSource = {
  id: 'review-177',
  reviewer: "Jenny's Cakery",
  descriptor: 'Parent Google review',
  text: 'My son enjoys learning with Mrs Christina. She is very nice and makes learning fun.',
};

const parentReviewPool: ParentReviewSource[] = [
  explicitParentGoogleReview,
  ...testimonials
    .filter((review) => review.type === 'parent-letter')
    .map((review) => ({
      id: review.slug,
      reviewer: review.author,
      descriptor: review.slug.includes('nicholas-and-kristina')
        ? 'Parent of Nicholas and Kristina'
        : 'DA parent',
      text: review.bodyParagraphs.join(' '),
    })),
].filter((review, index, reviews) => {
  const fingerprint = `${review.id}\u0000${review.reviewer.toLowerCase()}\u0000${normalizeReviewText(review.text)}`;
  return reviews.findIndex((candidate) => (
    `${candidate.id}\u0000${candidate.reviewer.toLowerCase()}\u0000${normalizeReviewText(candidate.text)}` === fingerprint
  )) === index;
});

const parentNoteRecipes = [
  {
    sourceId: 'review-177',
    theme: 'Enjoys learning',
    quote: explicitParentGoogleReview.text,
    icon: Heart,
  },
  {
    sourceId: 'a-parent-google-review-nicholas-and-kristina',
    theme: 'Better motivation',
    quote: 'This has helped to generate the motivation, willingness, enthusiasm, discipline and commitment required to achieve consistent excellent academic results.',
    icon: Rocket,
  },
  {
    sourceId: 'a-parents-letter-of-gratitude',
    theme: 'Growing responsibility',
    quote: 'Over time, the defeated child who once felt ashamed to ask questions became a young man with confidence, responsibility, and genuine pride in himself.',
    icon: Sprout,
  },
] as const;

const parentNotes: ParentNote[] = parentNoteRecipes.flatMap((recipe) => {
  const source = parentReviewPool.find((review) => review.id === recipe.sourceId);
  if (!source || !normalizeReviewText(source.text).includes(normalizeReviewText(recipe.quote))) return [];
  return [{ ...source, ...recipe }];
});

const ParentGrowthNotes = ({ reduceMotion }: { reduceMotion: boolean | null }) => (
  <section className="ss-parent-growth" aria-labelledby="parent-growth-heading">
    <span className="ss-parent-growth__line-art ss-parent-growth__line-art--heart" aria-hidden="true">
      <Heart />
    </span>
    <span className="ss-parent-growth__line-art ss-parent-growth__line-art--sprout" aria-hidden="true">
      <Sprout />
    </span>

    <div className="ss-container ss-parent-growth__layout">
      <motion.header
        className="ss-parent-growth__intro"
        initial={reduceMotion ? false : { opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.62, ease: easeOut }}
      >
        <p className="ss-parent-growth__label">What parents notice</p>
        <h2 id="parent-growth-heading">
          <span>Beyond marks.</span>
          <em>They see the growth.</em>
        </h2>
        <span className="ss-parent-growth__rule" aria-hidden="true" />
        <p className="ss-parent-growth__support">
          <strong>It’s not just about results.</strong>
          It’s about confidence, motivation,<br />
          independence and joy in learning.
        </p>
      </motion.header>

      <div className="ss-parent-growth__notes" aria-label="Three reflections from DA parents">
        {parentNotes.map((note, index) => {
          const Icon = note.icon;
          return (
            <motion.article
              key={note.id}
              className={`ss-parent-note ss-parent-note--${index + 1}`}
              initial={reduceMotion ? false : { opacity: 0, y: 26, rotate: index === 0 ? -4 : index === 2 ? 4 : 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: index === 0 ? -2 : index === 2 ? 2 : 0.6 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.58, delay: 0.12 + index * 0.11, ease: easeOut }}
            >
              <span className="ss-parent-note__tape" aria-hidden="true" />
              <Icon className="ss-parent-note__icon" aria-hidden="true" />
              <h3>{note.theme}</h3>
              <blockquote>“{note.quote}”</blockquote>
              <footer>
                <strong>— {note.reviewer}</strong>
                <span>{note.descriptor}</span>
              </footer>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

const reviewScrollPaths = [
  { x: 16, y: -92, z: 42, rotateX: 2.4, rotateY: -3.6 },
  { x: -26, y: -108, z: 34, rotateX: -2.8, rotateY: 4.4 },
  { x: 28, y: -98, z: 38, rotateX: 2.2, rotateY: -4.2 },
  { x: 12, y: -52, z: 18, rotateX: -1.6, rotateY: 2.4 },
  { x: -14, y: -38, z: 14, rotateX: 1.2, rotateY: -2.2 },
  { x: 16, y: -44, z: 12, rotateX: -1.4, rotateY: 2.1 },
  { x: -9, y: -29, z: 8, rotateX: 0.8, rotateY: -1.4 },
  { x: 7, y: -22, z: 6, rotateX: -0.7, rotateY: 1.1 },
] as const;

type ReviewPose = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  opacity: number;
  blur: number;
};

const reviewPoseStops: Record<number, ReviewPose> = {
  [-3]: { x: 34, y: 126, z: -280, width: 320, height: 360, scale: 0.5, rotateX: 0, rotateY: -5, rotateZ: 4, opacity: 0.14, blur: 2.2 },
  [-2]: { x: -206, y: -174, z: -220, width: 310, height: 350, scale: 0.56, rotateX: 0, rotateY: 7, rotateZ: -3, opacity: 0.2, blur: 1.7 },
  [-1]: { x: -315, y: 34, z: -20, width: 300, height: 410, scale: 0.9, rotateX: 0.5, rotateY: 17, rotateZ: -2, opacity: 0.98, blur: 0 },
  [0]: { x: 0, y: -8, z: 120, width: 430, height: 450, scale: 0.96, rotateX: -1, rotateY: -0.35, rotateZ: -0.35, opacity: 1, blur: 0 },
  [1]: { x: 315, y: 34, z: -20, width: 300, height: 410, scale: 0.9, rotateX: 0.5, rotateY: -17, rotateZ: 2, opacity: 0.98, blur: 0 },
  [2]: { x: 206, y: -174, z: -220, width: 310, height: 350, scale: 0.56, rotateX: 0, rotateY: -7, rotateZ: 3, opacity: 0.2, blur: 1.7 },
  [3]: { x: 22, y: -218, z: -280, width: 320, height: 360, scale: 0.5, rotateX: 0, rotateY: -4, rotateZ: 4, opacity: 0.14, blur: 2.2 },
};

const interpolatePose = (position: number): ReviewPose => {
  const bounded = Math.max(-3, Math.min(3, position));
  const lower = Math.floor(bounded);
  const upper = Math.ceil(bounded);
  if (lower === upper) return reviewPoseStops[lower];

  const amount = bounded - lower;
  const from = reviewPoseStops[lower];
  const to = reviewPoseStops[upper];
  return Object.fromEntries(
    Object.keys(from).map((key) => {
      const property = key as keyof ReviewPose;
      return [property, from[property] + (to[property] - from[property]) * amount];
    }),
  ) as ReviewPose;
};

const wrappedRelativeIndex = (index: number, activeIndex: number, count: number) => {
  const wrapped = ((index - activeIndex) % count + count) % count;
  let relative = wrapped;
  if (relative > count / 2) relative -= count;
  return relative;
};

type ReviewMotionCardProps = {
  index: number;
  activeIndex: number;
  dragOffset: number;
  dragging: boolean;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
  review: (typeof successStoryReviewCards)[number];
};

const ReviewMotionCard = ({ index, activeIndex, dragOffset, dragging, progress, reduceMotion, review }: ReviewMotionCardProps) => {
  const path = reviewScrollPaths[index];
  const scrollY = useTransform(progress, [0, 1], [path.y * -0.08, path.y * 0.12]);
  const scrollZ = useTransform(progress, [0, 1], [path.z * -0.08, path.z * 0.1]);
  const relative = wrappedRelativeIndex(index, activeIndex, successStoryReviewCards.length);
  const pose = interpolatePose(relative + dragOffset / 330);
  const hidden = Math.abs(relative) > 3 && Math.abs(dragOffset) < 1;

  return (
    <div className="review-world__position" style={{ zIndex: Math.max(1, 20 - Math.round(Math.abs(relative + dragOffset / 330) * 4)) }}>
      <motion.div
        className={`review-world__carousel-plane${relative === 0 ? ' is-active' : Math.abs(relative) === 1 ? ' is-side' : ' is-background'}`}
        style={{ pointerEvents: hidden ? 'none' : 'auto' }}
        animate={{
          x: pose.x,
          y: pose.y,
          z: pose.z,
          width: pose.width,
          height: pose.height,
          marginLeft: (430 - pose.width) / 2,
          marginTop: (450 - pose.height) / 2,
          scale: pose.scale,
          rotateX: pose.rotateX,
          rotateY: pose.rotateY,
          rotateZ: pose.rotateZ,
          opacity: hidden ? 0 : pose.opacity,
          filter: `blur(${pose.blur}px)`,
        }}
        transition={dragging || reduceMotion
          ? { duration: 0 }
          : { duration: 0.64, ease: easeOut }}
      >
        <motion.div className="review-world__scroll-plane" style={!dragging && !reduceMotion ? { y: scrollY, z: scrollZ } : undefined}>
          <ReviewCard
            review={review.review}
            name={review.name}
            role={review.role}
            rating={review.rating}
            googleIcon={<GoogleReviewMark />}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const ReviewField = () => {
  const reviewRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef(0);
  const dragLastRef = useRef({ x: 0, time: 0, velocity: 0 });
  const { scrollYProgress } = useScroll({
    target: reviewRef,
    offset: ['start end', 'end start'],
  });

  const moveReview = (direction: -1 | 1) => {
    setActiveReviewIndex((current) => (current + direction + successStoryReviewCards.length) % successStoryReviewCards.length);
    setDragOffset(0);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = event.clientX;
    dragLastRef.current = { x: event.clientX, time: performance.now(), velocity: 0 };
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const now = performance.now();
    const elapsed = Math.max(1, now - dragLastRef.current.time);
    const velocity = (event.clientX - dragLastRef.current.x) / elapsed;
    dragLastRef.current = { x: event.clientX, time: now, velocity };
    setDragOffset(Math.max(-380, Math.min(380, event.clientX - dragStartRef.current)));
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const velocity = dragLastRef.current.velocity;
    const shouldAdvance = Math.abs(dragOffset) >= 85 || Math.abs(velocity) >= 0.55;
    setDragging(false);
    if (shouldAdvance) moveReview(dragOffset < 0 || velocity < -0.55 ? 1 : -1);
    else setDragOffset(0);
  };

  const handleReviewKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveReview(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveReview(1);
    }
  };

  return (
    <section ref={reviewRef} className="ss-review-field" aria-label="Google reviews">
      <div className="ss-container ss-review-field__layout">
        <div className="ss-review-field__intro">
          <span className="ss-review-field__eyebrow">Success stories</span>
          <h2>In their<br />own <em>words.</em></h2>
          <p>Hundreds of students and families have trusted DA with their journey.</p>
          <div className="ss-review-field__rating" aria-label="4.9 out of 5 from more than 450 Google reviews">
            <span className="ss-review-field__stars" aria-hidden="true">★★★★★</span>
            <div className="ss-review-field__rating-line">
              <GoogleReviewMark />
              <p><strong>4.9/5</strong><br />from 450+ Google reviews</p>
            </div>
          </div>
        </div>
        <div
          className={`review-world review-world--carousel${dragging ? ' is-dragging' : ''}`}
          data-review-scene
          tabIndex={0}
          onKeyDown={handleReviewKeys}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          aria-label="Google review carousel. Drag or use the arrow keys to explore reviews."
        >
          <span className="review-world__glow" aria-hidden="true" />
          <span className="review-world__orbit review-world__orbit--wide" aria-hidden="true" />
          <span className="review-world__orbit review-world__orbit--high" aria-hidden="true" />
          <span className="review-world__sparkle review-world__sparkle--one" aria-hidden="true" />
          <span className="review-world__sparkle review-world__sparkle--two" aria-hidden="true" />
          <span className="review-world__sparkle review-world__sparkle--three" aria-hidden="true" />
          {successStoryReviewCards.map((review, index) => (
            <ReviewMotionCard
              key={review.id}
              index={index}
              activeIndex={activeReviewIndex}
              dragOffset={dragOffset}
              dragging={dragging}
              progress={scrollYProgress}
              reduceMotion={reduceMotion}
              review={review}
            />
          ))}
          <div className="review-world__controls">
            <button type="button" onClick={() => moveReview(-1)} aria-label="Previous review">←</button>
            <span aria-hidden="true">Drag to explore</span>
            <button type="button" onClick={() => moveReview(1)} aria-label="Next review">→</button>
          </div>
          <span className="review-world__hint" aria-hidden="true">Swipe or drag to see more reviews</span>
          <p className="sr-only" aria-live="polite">
            Review {activeReviewIndex + 1} of {successStoryReviewCards.length}: {successStoryReviewCards[activeReviewIndex].name}
          </p>
        </div>
      </div>
    </section>
  );
};

const appreciationNotes = [
  {
    id: 'review-089',
    quote: 'I am always so grateful for all the tutors that have seen me grow and put up with me for the past nine years.',
    author: 'Connor Mangala',
    detail: 'DA student of nine years',
  },
  {
    id: 'review-278',
    quote: 'Mr Bunsea was really patient and nice throughout our lessons, and he was always encouraging me.',
    author: 'My Chi Ho',
    detail: 'DA student',
  },
  {
    id: 'review-240',
    quote: 'I will forever be grateful for Miss Marissa. I can’t thank her enough for the learning experience she has given me.',
    author: 'Lana Khorn',
    detail: 'DA student',
  },
  {
    id: 'review-230',
    quote: 'He always listens whenever I talk to him, whether that be about the weather, something at school or even something at home.',
    author: 'Khushleen Kaur',
    detail: 'DA graduate',
  },
] as const;

const AppreciationSection = ({ reduceMotion }: { reduceMotion: boolean | null }) => (
  <section className="ss-appreciation" aria-labelledby="appreciation-heading">
    <span className="ss-appreciation__spark ss-appreciation__spark--one" aria-hidden="true">✦</span>
    <span className="ss-appreciation__spark ss-appreciation__spark--two" aria-hidden="true">✧</span>
    <Heart className="ss-appreciation__heart" aria-hidden="true" />

    <div className="ss-container ss-appreciation__layout">
      <motion.header
        className="ss-appreciation__copy"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.64, ease: easeOut }}
      >
        <p className="ss-appreciation__label">To our students &amp; families</p>
        <h2 id="appreciation-heading">
          <span>These words mean more</span>
          <em>than five stars.</em>
        </h2>
        <p className="ss-appreciation__body">
          Every review represents a student who trusted us,<br />
          a parent who believed in us,<br />
          and a journey we were privileged to be part of.
        </p>
        <img
          className="ss-appreciation__thanks-doodle"
          src="/images/success-stories/thank-you-story-doodle.png"
          alt="Thank you for letting DA be part of your story."
          width={2171}
          height={724}
          loading="lazy"
          decoding="async"
        />
      </motion.header>

      <div className="ss-appreciation__collage" aria-label="Messages of appreciation from DA students">
        {appreciationNotes.map((note, index) => (
          <motion.blockquote
            key={note.id}
            className={`ss-memory-note ss-memory-note--${index + 1}`}
            initial={reduceMotion ? false : { opacity: 0, y: 19, rotate: [-4, 3, -3, 4][index] }}
            whileInView={{ opacity: 1, y: 0, rotate: [-2, 1, -1, 2][index] }}
            viewport={{ once: true, amount: 0.25 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.1 + index * 0.09, ease: easeOut }}
          >
            {index === 0 && <span className="ss-memory-note__tape" aria-hidden="true" />}
            {index === 1 && <Paperclip className="ss-memory-note__clip" aria-hidden="true" />}
            {index === 2 && <span className="ss-memory-note__pin" aria-hidden="true" />}
            {index === 3 && <span className="ss-memory-note__fold" aria-hidden="true" />}
            <p>“{note.quote}”</p>
            <footer>
              <strong>— {note.author}</strong>
              <span>{note.detail}</span>
            </footer>
          </motion.blockquote>
        ))}

        <motion.figure
          className="ss-memory-photo ss-memory-photo--one"
          initial={reduceMotion ? false : { opacity: 0, y: 16, rotate: 4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 2 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.58, delay: 0.3, ease: easeOut }}
        >
          <span aria-hidden="true" />
          <img src="/images/community/tutor_one_on_one.jpg" alt="A DA tutor supporting a student during a lesson" width={6000} height={3368} loading="lazy" decoding="async" />
        </motion.figure>

        <motion.figure
          className="ss-memory-photo ss-memory-photo--two"
          initial={reduceMotion ? false : { opacity: 0, y: 16, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.58, delay: 0.4, ease: easeOut }}
        >
          <span aria-hidden="true" />
          <img src="/images/community/class_hands_raised.jpg" alt="DA students participating together in class" width={6000} height={3368} loading="lazy" decoding="async" />
        </motion.figure>

        <span className="ss-appreciation__annotation ss-appreciation__annotation--one" aria-hidden="true">We remember this.</span>
        <span className="ss-appreciation__annotation ss-appreciation__annotation--two" aria-hidden="true">Always grateful.</span>
      </div>
    </div>
  </section>
);

const SuccessStoriesPage = () => {
  const reduceMotion = useReducedMotion();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const closeSelectedStory = useCallback(() => setSelectedStoryIndex(null), []);
  const reveal = (delay: number, duration: number, y = 15) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration, delay, ease: easeOut },
  });

  return (
    <div className="success-stories-page flex min-h-screen flex-col">
    <SEO
      title="Success Stories & Reviews"
      description="Real results from real students. Explore DA Tuition's student achievements, family reviews, and reflections."
      canonicalUrl="/success-stories"
    />

    <NavigationNew />

    <main className="ss-hero flex-1">
      <div className="ss-container ss-hero__layout">
        <div className="ss-hero__copy">
          <motion.p {...reveal(0.04, 0.48, 12)} className="ss-hero__label ss-label">Success Stories</motion.p>
          <h1 className="ss-display">
            <span className="ss-headline-line"><motion.span {...reveal(0.13, 0.78, 32)}>There’s a story</motion.span></span>
            <span className="ss-headline-line"><motion.span {...reveal(0.25, 0.78, 32)}>behind <em>every result.</em></motion.span></span>
          </h1>
          <motion.p {...reveal(0.58, 0.58, 15)} className="ss-hero__intro">
            Not every student arrives at DA at the top of their class.<br />
            Some arrive frustrated. Some have lost confidence.<br />
            Some simply know they’re capable of more.
          </motion.p>
          <motion.div {...reveal(0.7, 0.58, 14)} className="ss-hero__outcomes" aria-label="Student outcomes">
            <span><GraduationCap aria-hidden="true" /><strong>Stronger<br />Confidence</strong></span>
            <span><ChartNoAxesCombined aria-hidden="true" /><strong>Real Academic<br />Growth</strong></span>
            <span><Sparkles aria-hidden="true" /><strong>Brighter<br />Futures</strong></span>
          </motion.div>
          <motion.img
            initial={reduceMotion ? false : { opacity: 0, y: 12, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.62, delay: 0.88, ease: easeOut }}
            className="ss-hero__doodle"
            src="/images/success-stories/different-beginnings-doodle.png"
            alt="Different beginnings. Extraordinary outcomes."
            width={1536}
            height={1024}
            decoding="async"
          />
        </div>

        <div className="ss-collage">
          <motion.img
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.95, ease: easeOut }}
            className="ss-collage__artwork"
            src="/images/success-stories/success-hero-student-collage.png"
            alt="Five DA Tuition students learning in class, arranged as a taped photographic collage"
            width={1536}
            height={1024}
            decoding="async"
          />
        </div>
      </div>
    </main>

    <section className="ss-turning-points" aria-labelledby="turning-points-heading">
      <div className="ss-container ss-turning-points__composition">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: easeOut }}
          className="ss-turning-points__label ss-label"
        >
          The Turning Points
        </motion.p>

        <h2 id="turning-points-heading" className="ss-turning-points__heading">
          {[
            'Real students.',
            'Real turning points.',
          ].map((line, index) => (
            <span className="ss-turning-points__line" key={line}>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.72, delay: 0.12 + index * 0.13, ease: easeOut }}
                className={index === 1 ? 'ss-turning-points__change' : undefined}
              >
                {line}
                {index === 1 && (
                  <motion.i
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.75, ease: easeOut }}
                    aria-hidden="true"
                  />
                )}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.58, delay: 0.6, ease: easeOut }}
          className="ss-turning-points__support"
        >
          Swipe through different journeys of growth,<br />
          breakthroughs and achievements.
        </motion.p>

        <motion.img
          initial={reduceMotion ? false : { opacity: 0, y: 12, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.78, ease: easeOut }}
          className="ss-turning-points__scroll-note"
          src="/images/success-stories/scroll-to-explore-doodle.png"
          alt="Scroll to explore all stories"
          width={2138}
          height={736}
          decoding="async"
        />
      </div>
    </section>

    <SuccessStoryCarousel reduceMotion={reduceMotion} onOpenStory={setSelectedStoryIndex} />
    <ReviewRibbon reduceMotion={reduceMotion} />
    <ParentGrowthNotes reduceMotion={reduceMotion} />
    <ReviewField />
    <AppreciationSection reduceMotion={reduceMotion} />
    <FooterNew />
    <StudentStoryModal
      selectedIndex={selectedStoryIndex}
      onSelect={setSelectedStoryIndex}
      onClose={closeSelectedStory}
      reduceMotion={reduceMotion}
    />
    </div>
  );
};

export default SuccessStoriesPage;
