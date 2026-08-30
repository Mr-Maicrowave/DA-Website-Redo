import { cloneElement, type ReactElement, useEffect, useRef, useState } from 'react';
import { motion, type MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// PHOTO PAIR REPLACEMENT GUIDE
// Replace only the `left` and `right` paths below when final DA photography is ready.
// Each object is one coordinated full-screen composition; both sides always change together.
const imagePairs = [
  {
    left: '/images/homepage/homepage-cream/coworkers-1.png',
    right: '/images/homepage/homepage-cream/smiling girl-2.png',
  },
  {
    left: '/images/homepage/homepage-cream/ngoc and a girl-3.png',
    right: '/images/homepage/homepage-cream/studying girl-4.png',
  },
  {
    left: '/images/homepage/homepage-cream/lindainclass-5.jpeg',
    right: '/images/homepage/homepage-cream/studying boy-6.jpeg',
  },
  {
    left: '/images/homepage/homepage-cream/laiinclass-7.jpeg',
    right: '/images/homepage/homepage-cream/girl raising hand-8.png',
  },
  {
    left: '/images/homepage/homepage-cream/leeinclass-9.jpeg',
    right: '/images/homepage/homepage-cream/3boys-10.png',
  },
];

// Per-photo focal points keep important subjects inside the half-screen crop.
const imageFocalPoints: Record<string, string> = {
  '/images/homepage/homepage-cream/lindainclass-5.jpeg': '100% center',
};

type ImagePanelProps = {
  src: string;
  pairIndex: number;
  side: 'left' | 'right';
  reducedMotion: boolean;
};

const ImagePanel = ({ src, pairIndex, side, reducedMotion }: ImagePanelProps) => {
  const [visibleSrc, setVisibleSrc] = useState(src);
  const [incomingSrc, setIncomingSrc] = useState<string | null>(null);

  useEffect(() => {
    if (src !== visibleSrc) setIncomingSrc(src);
  }, [src, visibleSrc]);

  const finishTransition = () => {
    if (!incomingSrc) return;
    setVisibleSrc(incomingSrc);
    setIncomingSrc(null);
  };

  return (
    <div className={`visual-intro__panel visual-intro__panel--${side}`} aria-hidden="true">
      {/* This opaque base never fades, so the panel can never expose its background. */}
      <img
        className="visual-intro__base-image"
        src={visibleSrc}
        alt=""
        decoding="async"
        draggable={false}
        style={{ objectPosition: imageFocalPoints[visibleSrc] }}
      />

      {incomingSrc && (
      <motion.img
        className="visual-intro__incoming-image"
        key={`${pairIndex}-${incomingSrc}`}
        src={incomingSrc}
        alt=""
        decoding="async"
        draggable={false}
        style={{ objectPosition: imageFocalPoints[incomingSrc] }}
        initial={reducedMotion ? false : {
          opacity: 0,
          scale: 1.03,
          filter: 'blur(5px)',
        }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{
          duration: reducedMotion ? 0.01 : 1.05,
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: reducedMotion ? 0.01 : 1.05 },
        }}
        onAnimationComplete={finishTransition}
      />
      )}
      <div className="visual-intro__shade" />
    </div>
  );
};

type VisualIntroProps = {
  children: ReactElement<{ introProgress?: MotionValue<number> }>;
};

const VisualIntro = ({ children }: VisualIntroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const heroUnderlayRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [rotationPaused, setRotationPaused] = useState(false);
  const [heroInteractive, setHeroInteractive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : sectionRef,
    offset: ['start start', 'end end'],
  });

  // The curtain sequence now resolves within the first 22% of the sticky travel
  // (was 47.6% — roughly 1.5 viewport-heights of scroll before the headline/CTA
  // became visible or interactive at all, flagged by the website-page-audit skill's
  // homepage audit as delaying access to content). Internal proportions below are
  // unchanged, just compressed into a shorter physical scroll distance, so the same
  // curtain motion still plays — it just finishes sooner. The remaining distance
  // still holds the completed hero while Philosophy rises over it.
  const curtainProgress = useTransform(scrollYProgress, [0, 0.22], [0, 1], { clamp: true });
  const leftX = useTransform(curtainProgress, [0, 0.35, 0.8, 1], ['0%', '0%', '-110%', '-112%']);
  const rightX = useTransform(curtainProgress, [0, 0.35, 0.8, 1], ['0%', '0%', '110%', '112%']);
  const leftRotateY = useTransform(curtainProgress, [0.25, 0.8, 1], [0, -2.2, -2.4]);
  const rightRotateY = useTransform(curtainProgress, [0.25, 0.8, 1], [0, 2.2, 2.4]);
  const curtainScale = useTransform(curtainProgress, [0, 1], [1, 0.985]);
  const curtainOpacity = useTransform(curtainProgress, [0, 0.48, 0.61, 1], [1, 1, 0, 0]);
  const heroY = useTransform(curtainProgress, [0, 1], [0, 0]);
  const heroOpacity = useTransform(curtainProgress, [0, 1], [1, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setRotationPaused((current) => {
      if (!current && progress > 0.002) return true;
      if (current && progress <= 0.001) return false;
      return current;
    });
    // Lower bound scaled down to match the compressed curtainProgress envelope
    // above (0.371 was calibrated against the old 0.476 window: 0.371 * 0.22/0.476
    // ≈ 0.17). Philosophy is opaque and above the hero by 0.79; remove covered
    // hero controls from pointer and keyboard interaction until scrolling back.
    setHeroInteractive(progress >= 0.17 && progress < 0.79);
  });

  // `aria-hidden` alone doesn't stop a focusable descendant (the hero's
  // /book-interview Link) from still receiving Tab focus while hidden from the
  // accessibility tree — a WCAG 4.1.2 anti-pattern. `inert` closes that gap; same
  // ref.current?.toggleAttribute('inert', bool) pattern NavigationNew already uses
  // for its own layer-swap.
  useEffect(() => {
    heroUnderlayRef.current?.toggleAttribute('inert', !heroInteractive);
  }, [heroInteractive]);

  useEffect(() => {
    imagePairs.flatMap((pair) => [pair.left, pair.right]).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || rotationPaused) return;

    let cancelled = false;
    let animationFrame: number | undefined;
    const nextPairIndex = (activePairIndex + 1) % imagePairs.length;
    const nextPair = imagePairs[nextPairIndex];

    const preload = (src: string) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
      if (image.complete) resolve();
    });

    const pairTimer = window.setTimeout(async () => {
      await Promise.all([preload(nextPair.left), preload(nextPair.right)]);
      if (cancelled) return;

      // One animation frame and one state commit guarantee a matched pair on both panels.
      animationFrame = window.requestAnimationFrame(() => {
        if (!cancelled) setActivePairIndex(nextPairIndex);
      });
    }, 3500);

    return () => {
      cancelled = true;
      window.clearTimeout(pairTimer);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, [activePairIndex, prefersReducedMotion, rotationPaused]);

  const activePair = imagePairs[activePairIndex];
  const cinematicHero = cloneElement(children, { introProgress: curtainProgress });

  if (prefersReducedMotion) {
    return (
      <section className="visual-intro visual-intro--reduced" aria-label="DA Tuition learning community">
        <div className="visual-intro__reduced-images">
          <ImagePanel src={imagePairs[0].left} pairIndex={0} side="left" reducedMotion />
          <ImagePanel src={imagePairs[0].right} pairIndex={0} side="right" reducedMotion />
        </div>
        <div className="visual-intro__reduced-hero">{children}</div>
        <VisualIntroStyles />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="visual-intro" aria-label="DA Tuition learning community">
      <div className="visual-intro__stage">
        <motion.div
          ref={heroUnderlayRef}
          className="visual-intro__hero-underlay"
          style={{
            y: heroY,
            opacity: heroOpacity,
            pointerEvents: heroInteractive ? 'auto' : 'none',
          }}
          aria-hidden={!heroInteractive}
        >
          {cinematicHero}
        </motion.div>

        <motion.div className="visual-intro__curtain-layer" style={{ opacity: curtainOpacity }} aria-hidden="true">
          <motion.div className="visual-intro__curtain" style={{ x: leftX, rotateY: leftRotateY, scale: curtainScale, transformPerspective: 1400 }}>
            <ImagePanel src={activePair.left} pairIndex={activePairIndex} side="left" reducedMotion={false} />
          </motion.div>
          <motion.div className="visual-intro__curtain" style={{ x: rightX, rotateY: rightRotateY, scale: curtainScale, transformPerspective: 1400 }}>
            <ImagePanel src={activePair.right} pairIndex={activePairIndex} side="right" reducedMotion={false} />
          </motion.div>
          <div className="visual-intro__vignette" />
        </motion.div>
      </div>

      <VisualIntroStyles />
    </section>
  );
};

const VisualIntroStyles = () => (
      <style>{`
        .visual-intro {
          position: relative;
          height: 310svh;
          background: #0A1B34;
        }
        .visual-intro__stage {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
          background: #f5ead6;
          isolation: isolate;
        }
        .visual-intro__hero-underlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          min-width: 0;
          transform-origin: center center;
          will-change: transform, opacity, filter;
        }
        .visual-intro__hero-underlay > * {
          min-height: 100svh !important;
          height: 100%;
        }
        .visual-intro__curtain-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          overflow: hidden;
          pointer-events: none;
        }
        .visual-intro__curtain {
          position: relative;
          flex: 0 0 50%;
          width: 50%;
          min-width: 50%;
          height: 100%;
          will-change: transform;
          transform: translate3d(0,0,0);
        }
        .visual-intro__curtain:first-child {
          width: calc(50% + 2px);
          min-width: calc(50% + 2px);
          margin-right: -2px;
        }
        .visual-intro__panel {
          position: relative;
          width: 100%;
          min-width: 0;
          height: 100%;
          overflow: hidden;
          /* Shimmer plays behind the <img> while its src is still downloading;
             the moment the photo paints in (opaque, z-index 1) it fully covers
             this, so a slow connection sees motion instead of a flat block. */
          background: linear-gradient(100deg, #0A1B34 40%, #16305a 50%, #0A1B34 60%);
          background-size: 250% 100%;
          animation: visualIntroShimmer 2.2s ease-in-out infinite;
        }
        @keyframes visualIntroShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
        .visual-intro__panel img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          object-position: center;
          backface-visibility: hidden;
          transform: translateZ(0);
          will-change: transform, opacity;
        }
        .visual-intro__base-image { z-index: 1; opacity: 1; }
        .visual-intro__incoming-image { z-index: 2; }
        .visual-intro__panel--left img { object-position: center 42%; }
        .visual-intro__panel--right img { object-position: center 48%; }
        .visual-intro__shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(5,14,28,.22) 0%, transparent 24%, transparent 72%, rgba(5,14,28,.18) 100%);
          z-index: 3;
        }
        .visual-intro__vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 4;
          box-shadow: inset 0 0 110px rgba(3,10,20,.18);
        }
        @media (max-width: 767px) {
          .visual-intro { height: 250svh; }
          .visual-intro__curtain-layer { display: flex; }
          .visual-intro__panel--left img { object-position: 46% center; }
          .visual-intro__panel--right img { object-position: 54% center; }
          .visual-intro__vignette { box-shadow: inset 0 0 60px rgba(3,10,20,.16); }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .visual-intro { height: 295svh; }
        }
        @media (prefers-reduced-motion: reduce) {
          .visual-intro--reduced { height: auto; background: #0A1B34; }
          .visual-intro__reduced-images {
            height: 58svh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            overflow: hidden;
          }
          .visual-intro__reduced-hero { min-height: 100svh; }
          .visual-intro__panel img { will-change: auto; }
          .visual-intro__panel { animation: none; background: #0A1B34; }
        }
      `}</style>
);

export default VisualIntro;
