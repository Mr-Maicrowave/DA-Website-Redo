import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  BOOK_INTRO_OPENING_SCENES,
  BOOK_INTRO_SCENE_CALIBRATION,
  type BookIntroSceneCalibration,
} from '@/data/bookIntroCalibration';
import { markBookIntroComplete } from '@/lib/bookIntroSession';
import { PROLOGUE_BLOCKS, usePrologueWriting } from './usePrologueWriting';
import styles from './BookIntro.module.css';

const dustParticles = [
  { left: '18%', top: '22%', delay: '-2s', duration: '13s' },
  { left: '27%', top: '64%', delay: '-7s', duration: '16s' },
  { left: '36%', top: '31%', delay: '-10s', duration: '15s' },
  { left: '43%', top: '76%', delay: '-4s', duration: '18s' },
  { left: '51%', top: '18%', delay: '-12s', duration: '17s' },
  { left: '58%', top: '57%', delay: '-5s', duration: '14s' },
  { left: '66%', top: '27%', delay: '-9s', duration: '19s' },
  { left: '74%', top: '69%', delay: '-3s', duration: '16s' },
  { left: '81%', top: '38%', delay: '-11s', duration: '18s' },
  { left: '31%', top: '48%', delay: '-6s', duration: '17s' },
  { left: '62%', top: '81%', delay: '-1s', duration: '15s' },
  { left: '47%', top: '42%', delay: '-8s', duration: '20s' },
] as const;

type BookIntroProps = {
  onComplete: () => void;
};

const BookIntro = ({ onComplete }: BookIntroProps) => {
  const sceneRef = useRef<HTMLElement>(null);
  const openTriggerRef = useRef<HTMLButtonElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const animationTimers = useRef<number[]>([]);
  const frameFadeTimer = useRef<number>();
  const activeFrameRef = useRef(1);
  const animationLocked = useRef(false);
  const exitLocked = useRef(false);
  const completed = useRef(false);
  const [activeFrame, setActiveFrame] = useState(1);
  const [previousFrame, setPreviousFrame] = useState<number | null>(null);
  const [isFrameTransitioning, setIsFrameTransitioning] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [exitPhase, setExitPhase] = useState(0);
  const reduceMotion = useReducedMotion();
  const prologueActive = activeFrame === 1 && !isOpening && exitPhase === 0;
  const prologueWriting = usePrologueWriting({
    active: prologueActive,
    reducedMotion: Boolean(reduceMotion),
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.daBookIntroActive = 'true';

    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>('nav, main, footer, .site-sticky-book-button'),
    ).map(element => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute('aria-hidden'),
    }));

    backgroundElements.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });

    const preloadSources = [
      ...BOOK_INTRO_OPENING_SCENES.map(scene => scene.src),
      '/book-theme/paper-texture.png',
    ];
    preloadSources.forEach(source => {
      const image = new Image();
      image.decoding = 'async';
      image.src = source;
    });

    window.requestAnimationFrame(() => openTriggerRef.current?.focus({ preventScroll: true }));

    return () => {
      animationTimers.current.forEach(timer => window.clearTimeout(timer));
      window.clearTimeout(frameFadeTimer.current);
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.daBookIntroActive;
      delete document.body.dataset.daBookIntroPhase;

      backgroundElements.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });

      if (completed.current) {
        window.requestAnimationFrame(() => {
          const homepage = document.querySelector<HTMLElement>('main');
          if (!homepage) return;
          homepage.setAttribute('tabindex', '-1');
          homepage.focus({ preventScroll: true });
          homepage.addEventListener('blur', () => homepage.removeAttribute('tabindex'), { once: true });
        });
      }
    };
  }, []);

  useEffect(() => {
    document.body.dataset.daBookIntroPhase = String(exitPhase);
  }, [exitPhase]);

  useEffect(() => {
    if (!prologueActive) return;
    window.requestAnimationFrame(() => sceneRef.current?.focus({ preventScroll: true }));
  }, [prologueActive]);

  const handleSceneKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (
      prologueActive
      && !prologueWriting.complete
      && (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      prologueWriting.skip();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]'),
    );
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const transitionToFrame = (nextFrame: number) => {
    window.clearTimeout(frameFadeTimer.current);
    setIsFrameTransitioning(true);
    setPreviousFrame(activeFrameRef.current);
    activeFrameRef.current = nextFrame;
    setActiveFrame(nextFrame);
    frameFadeTimer.current = window.setTimeout(() => {
      setPreviousFrame(null);
      setIsFrameTransitioning(false);
    }, reduceMotion ? 140 : 920);
  };

  const openBook = () => {
    if (animationLocked.current || activeFrame !== 0) return;

    animationLocked.current = true;

    if (reduceMotion) {
      transitionToFrame(1);
      window.requestAnimationFrame(() => exploreButtonRef.current?.focus({ preventScroll: true }));
      return;
    }

    setIsOpening(true);

    animationTimers.current = [
      window.setTimeout(() => transitionToFrame(1), 120),
      window.setTimeout(() => {
        setIsOpening(false);
        animationTimers.current = [];
      }, 1120),
    ];
  };

  const enterHomepage = () => {
    if (exitLocked.current || activeFrame !== 1 || isOpening) return;

    exitLocked.current = true;

    if (reduceMotion) {
      setExitPhase(4);
      animationTimers.current = [
        window.setTimeout(() => {
          completed.current = true;
          markBookIntroComplete();
          onComplete();
        }, 180),
      ];
      return;
    }

    setExitPhase(1);

    animationTimers.current = [
      window.setTimeout(() => setExitPhase(2), 420),
      window.setTimeout(() => setExitPhase(3), 1780),
      window.setTimeout(() => setExitPhase(4), 2920),
      window.setTimeout(() => {
        completed.current = true;
        markBookIntroComplete();
        onComplete();
      }, 3780),
    ];
  };

  const cameraClass = [
    styles.camera,
    isOpening ? styles.cameraPush : '',
    exitPhase === 1 ? styles.entryZoomRight : '',
    exitPhase >= 2 ? styles.entryZoomDeep : '',
  ].filter(Boolean).join(' ');

  return (
    <section
      ref={sceneRef}
      className={`${styles.overlay} ${exitPhase === 4 ? styles.overlayLeaving : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="DA Tuition book introduction"
      tabIndex={-1}
      onKeyDown={handleSceneKeyDown}
    >
      <div
        className={styles.bookButton}
      >
        <button
          ref={openTriggerRef}
          type="button"
          className={styles.openTrigger}
          aria-label="Open the DA Tuition book"
          disabled={activeFrame !== 0 || isOpening || exitPhase > 0}
          onClick={openBook}
        />
        <span
          className={`${styles.openCue} ${activeFrame === 0 && !isOpening ? styles.openCueVisible : ''}`}
          aria-hidden="true"
        >
          Open the Book
        </span>
        <div className={cameraClass}>
          <span
            className={styles.masterEnvironment}
          style={{ backgroundImage: `url('${BOOK_INTRO_SCENE_CALIBRATION.prologue.src}')` }}
            aria-hidden="true"
          />
          <div className={styles.stageCanvas}>
            {BOOK_INTRO_OPENING_SCENES.map((scene, index) => {
              if (index !== activeFrame && index !== previousFrame) return null;
              const isActive = index === activeFrame;
              const sceneStyle = createSceneStyle(scene);

              return (
                <span
                  key={`frame-${scene.src}`}
                  className={`${styles.sceneLayer} ${isActive ? styles.incomingScene : styles.outgoingScene}`}
                  style={sceneStyle}
                >
                  <span
                    className={styles.environment}
                    style={{ backgroundImage: `url('${scene.src}')` }}
                  />
                  <span className={styles.sceneTransform}>
                    <img
                      className={styles.bookImage}
                      src={scene.src}
                      alt=""
                      aria-hidden="true"
                      draggable="false"
                      loading="eager"
                      decoding="async"
                    />
                  </span>
                </span>
              );
            })}
          </div>
          <div
            className={`${styles.prologueOverlay} ${activeFrame === 1 && !isOpening && exitPhase === 0 ? styles.prologueVisible : ''}`}
            aria-hidden={activeFrame !== 1 || isOpening || exitPhase > 0}
            onClick={event => {
              if (prologueWriting.complete) return;
              event.stopPropagation();
              prologueWriting.skip();
            }}
          >
            <p className={styles.screenReaderPrologue}>
              PROLOGUE. {PROLOGUE_BLOCKS.map(block => block.text).join(' ')}
            </p>
            <div className={`${styles.pageCopy} ${styles.leftPageCopy}`}>
              <p className={`${styles.prologueLabel} ${prologueWriting.labelVisible ? styles.inkVisible : ''}`} aria-hidden="true">
                PROLOGUE
              </p>
              <p className={styles.prologueStatement} aria-hidden="true">
                <WritingText
                  text={prologueWriting.textFor('opening')}
                  active={prologueWriting.activeBlockId === 'opening'}
                />
              </p>
              <p className={styles.welcomeLine} aria-hidden="true">
                <WritingText
                  text={prologueWriting.textFor('welcome')}
                  active={prologueWriting.activeBlockId === 'welcome'}
                />
              </p>
            </div>

            <div className={`${styles.pageCopy} ${styles.rightPageCopy}`}>
              <p aria-hidden="true">
                <WritingText
                  text={prologueWriting.textFor('body')}
                  active={prologueWriting.activeBlockId === 'body'}
                />
              </p>
              <p aria-hidden="true">
                <WritingText
                  text={prologueWriting.textFor('invitation')}
                  active={prologueWriting.activeBlockId === 'invitation'}
                />
              </p>
              <button
                ref={exploreButtonRef}
                type="button"
                className={`${styles.exploreButton} ${
                  prologueWriting.buttonPhase === 'drawing'
                    ? styles.buttonDrawing
                    : prologueWriting.buttonPhase === 'ready'
                      ? styles.buttonReady
                      : ''
                }`}
                disabled={!prologueWriting.complete || activeFrame !== 1 || isOpening || exitPhase > 0}
                onClick={event => {
                  event.stopPropagation();
                  enterHomepage();
                }}
              >
                <span>Explore More</span>
              </button>
            </div>
          </div>
          <span
            className={`${styles.transitionVeil} ${isFrameTransitioning || (exitPhase > 0 && exitPhase < 3) ? styles.transitionVeilVisible : ''}`}
            aria-hidden="true"
          />
        </div>
        <span className={styles.sunlight} aria-hidden="true" />
        <span className={styles.dust} aria-hidden="true">
          {dustParticles.map((particle, index) => (
            <i
              key={index}
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </span>
        <span
          className={`${styles.paperLayer} ${exitPhase >= 3 ? styles.paperVisible : ''}`}
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

const WritingText = ({ text, active }: { text: string; active: boolean }) => (
  <span className={styles.writingText}>
    {text.split('\n').map((line, index) => (
      <span key={index} className={styles.writingLine}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ))}
    {active && <span className={styles.writingPoint} aria-hidden="true" />}
  </span>
);

type SceneStyle = CSSProperties & {
  '--scene-transform': string;
  '--scene-position': string;
};

const createSceneStyle = (scene: BookIntroSceneCalibration): SceneStyle => ({
  '--scene-transform': `translate3d(${scene.x}px, ${scene.y}px, 0) scale(${scene.scale})`,
  '--scene-position': `${scene.objectPositionX}% ${scene.objectPositionY}%`,
});

export default BookIntro;
