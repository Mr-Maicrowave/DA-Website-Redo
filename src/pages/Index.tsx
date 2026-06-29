/**
 * Index.tsx â€” DA Tuition Homepage
 * Premium private-school inspired design with Awwwards-style animations.
 * Inspired by: korowa.vic.edu.au
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence, useInView, useAnimationControls, useScroll, useTransform, useSpring } from 'framer-motion';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import AwardRecognition from '@/components/AwardRecognition';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarousel';
import TeachersPreview from '@/components/TeachersPreview';
import Confetti, { fireConfetti } from '@/components/animations/Confetti';
import SEO from '@/components/SEO';
import StatsSection from '@/components/StatsSection';
import { siteStats } from '@/data/site-stats';
import { organizationSchema, localBusinessSchema } from '@/lib/seo/schema';

// â”€â”€â”€ Design tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const C = {
  navy:  '#0A1B34',
  navy2: '#0F2244',
  gold:  '#D4AF37',
  goldL: '#F0C86A',
  cream: '#F7F4EE',
  cream2:'#EDE5D4',
  white: '#FAFAF8',
  muted: 'rgba(10,27,52,0.52)',
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', 'Inter', sans-serif";

// â”€â”€â”€ Animation variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fadeUp = {
  hidden:  { opacity: 0, y: 52 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' as const } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
};

// â”€â”€â”€ Section wrapper (scroll-triggered stagger) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Reveal = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={style}>
      {children}
    </motion.div>
  );
};

// â”€â”€â”€ Section label + title block â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SectionHead = ({ tag, title, light = false, center = true }: {
  tag: string; title: React.ReactNode; light?: boolean; center?: boolean;
}) => (
  <motion.div variants={fadeUp} style={{ textAlign: center ? 'center' : 'left', marginBottom: '56px' }}>
    <div style={{ fontFamily: sans, fontSize: '.7rem', fontWeight: 700, letterSpacing: '.17em', textTransform: 'uppercase', color: C.gold, marginBottom: '14px' }}>{tag}</div>
    <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', letterSpacing: '-.02em', lineHeight: 1.08, color: light ? C.white : C.navy }}>{title}</h2>
  </motion.div>
);

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  STATS â€” count-up + pop + confetti (fully self-contained)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const confettiFired = { v: false };

/** Single animated number card â€” handles its own scroll observation */
const StatCard = ({ target, suffix, label, delay }: {
  target: number; suffix: string; label: string; delay: number;
}) => {
  const [count, setCount]   = useState(target);   // start at final so numbers always visible
  const [popped, setPopped] = useState(false);
  const ranRef  = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const run = () => {
      if (ranRef.current) return;
      ranRef.current = true;

      // confetti once per section
      if (!confettiFired.v) {
        confettiFired.v = true;
        setTimeout(fireConfetti, 150);
      }

      setTimeout(() => {
        setCount(0);           // reset to 0 â€¦
        setPopped(true);       // â€¦ and make the pop scale visible

        // then count up
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / 1800, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setCount(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
      }, delay);
    };

    // Use IntersectionObserver â€” fires immediately if already in view
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { run(); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);

    // Fallback: if page loads with section already visible
    const check = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) run();
    }, 600);

    return () => { obs.disconnect(); clearTimeout(check); };
  }, [target, delay]);

  const display = target === 5 ? count.toString() : count.toLocaleString();

  return (
    <div ref={cardRef} style={{
      background: 'rgba(255,255,255,.04)',
      padding: '52px 28px',
      textAlign: 'center',
      flex: 1,
      transition: 'background .3s ease',
    }}>
      {/* Number */}
      <div style={{
        fontFamily: serif,
        fontWeight: 500,
        fontSize: 'clamp(3rem,5vw,4.8rem)',
        lineHeight: 1,
        color: '#F0C86A',
        marginBottom: '16px',
        display: 'inline-block',
        transform: popped ? 'scale(1)' : 'scale(0.85)',
        opacity: popped ? 1 : 0.7,
        transition: `transform .8s cubic-bezier(.34,1.56,.64,1) ${delay}ms, opacity .5s ease ${delay}ms`,
        willChange: 'transform',
      }}>
        {display}{suffix}
      </div>

      {/* Gold rule */}
      <div style={{ width: 32, height: 1, background: `linear-gradient(90deg,transparent,#D4AF37,transparent)`, margin: '0 auto 16px' }} />

      {/* Label */}
      <div style={{
        fontFamily: sans,
        fontSize: '.72rem',
        fontWeight: 700,
        letterSpacing: '.13em',
        textTransform: 'uppercase' as const,
        color: 'rgba(212,175,55,.65)',
      }}>
        {label}
      </div>
    </div>
  );
};

// â”€â”€â”€ Marquee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MARQUEE = ['Mathematics','English','Science','Legal Studies','Business Studies','HSC Excellence','20+ Years','650+ Students','5.0 â˜… Rating','Award-Winning','Small Groups','Personalised Learning'];
const MarqueeStrip = () => (
  <div style={{ background: C.navy, borderTop: `1px solid rgba(212,175,55,.2)`, borderBottom: `1px solid rgba(212,175,55,.2)`, padding: '14px 0', overflow: 'hidden' }}>
    <div style={{ display: 'flex', animation: 'marq 30s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
      {[...MARQUEE, ...MARQUEE].map((t, i) => (
        <span key={i} style={{ fontFamily: sans, fontSize: '.74rem', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: C.gold, padding: '0 38px' }}>
          {t}<span style={{ color: 'rgba(212,175,55,.3)', marginLeft: 38 }}>â—†</span>
        </span>
      ))}
    </div>
    <style>{`@keyframes marq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
  </div>
);

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  HERO
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const HeroSection = () => (
    <section
      className="hero-luxury"
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', justifyContent: 'center', textAlign: 'center' as const,
        padding: 'clamp(104px, 12vh, 136px) 24px 72px', position: 'relative', overflow: 'hidden',
        isolation: 'isolate',
        background: '#f5ead6',
      }}>
      <style>{`
        .hero-luxury::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 0;
          pointer-events: none;
          background-image: url('/images/hero/da-hero-glow-bg-1600.webp');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .hero-luxury::after {
          content: none;
          display: none;
        }
        .hero-cta:hover {
          background: rgba(255,248,229,0.34) !important;
          border-color: rgba(212,175,55,0.52) !important;
          box-shadow: 0 0 0 1px rgba(212,175,55,0.10), 0 14px 38px rgba(180,133,28,0.14);
        }
      `}</style>

      {/* â”€â”€ Layer 3: DA Crest â€” the centrepiece â”€â”€ */}
      <div
        style={{
        marginBottom: 'clamp(24px, 3vw, 42px)',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', width: 'clamp(190px, 22vw, 294px)', margin: '0 auto' }}>
            <img
              src="/images/da-logo.png"
              alt="DA Tuition"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                position: 'relative',
                filter: 'drop-shadow(0 18px 42px rgba(71,45,6,0.12))',
              }}
            />
          </div>
        </div>
      </div>

      {/* â”€â”€ Headline â€” more breathing room below logo â”€â”€ */}
      <h1
        style={{
          fontFamily: serif, fontWeight: 500,
          fontSize: 'clamp(2.15rem, 3.8vw, 3.95rem)',
          lineHeight: 1.06, letterSpacing: '-.018em',
          color: C.navy, marginBottom: '26px', maxWidth: '760px',
          position: 'relative', zIndex: 3,
          textShadow: '0 1px 0 rgba(255,255,255,0.42)',
        }}>
        Where Ambition Meets<br />
        <em style={{ fontStyle: 'italic', color: C.gold }}>Academic Excellence</em>
      </h1>

      {/* â”€â”€ Tagline â”€â”€ */}
      <p
        style={{
          fontFamily: sans, fontSize: 'clamp(.85rem, 1.4vw, 1rem)',
          color: C.muted, marginBottom: '34px', letterSpacing: '.04em',
          position: 'relative', zIndex: 3,
        }}>
        Trusted by Families. Transforming Futures.
      </p>

      {/* â”€â”€ CTA â”€â”€ */}
      <div
        style={{
          display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center',
          position: 'relative', zIndex: 3,
        }}>
        <button
          className="hero-cta"
          onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            fontFamily: sans, background: 'transparent', color: C.navy,
            border: `1.5px solid rgba(10,27,52,.28)`,
            padding: '14px 40px', borderRadius: '4px',
            fontSize: '.9rem', fontWeight: 700, cursor: 'pointer',
            letterSpacing: '.04em', textTransform: 'uppercase' as const,
          }}>
          View Programs
        </button>
      </div>

      {/* â”€â”€ Scroll indicator â€” gold line only, no text â”€â”€ */}
      <div
        style={{
          position: 'absolute', bottom: '28px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column' as const,
          alignItems: 'center', zIndex: 3,
        }}>
        <div style={{ width: '1px', height: '44px', background: `linear-gradient(180deg,${C.gold},transparent)` }} />
      </div>
    </section>
);

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PHILOSOPHY BACKED BY RESULTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PHILOSOPHY_STAGES â€” image replacement guide
//
//  Each stage has an `image` path. These are real DA Tuition photography
//  assets assigned to match each philosophy pillar.
//
//  To replace a photo later, drop it into /public/images/philosophy/
//  and update ONLY the matching `image` field below.
//
//  Recommended spec per photo:
//    Size: 1200 Ã— 800 px  |  Format: JPG  |  Max file size: 250 KB
//    Style: natural light, warm/neutral tones, candid (not posed)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PHILOSOPHY_STAGES
//  Each stage is one chapter of the DA educational philosophy.
//
//  Image replacement guide
//  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  Drop photos into /public/images/philosophy/ then update the `image` field.
//  Recommended: 1600 Ã— 1067 px  |  JPG  |  < 300 KB  |  natural, warm light
//
//  Stage 1 â€” Known: classroom whiteboard teaching
//  Stage 2 â€” Belief: female teacher guiding students around the table
//  Stage 3 â€” Understanding: male tutor helping two students
//  Stage 4 â€” Growth: student studying independently
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PHILOSOPHY_STAGES = [
  {
    stage: 1,
    label: 'Known',
    title: 'Students deserve to be known before they are judged.',
    supporting: 'Every student arrives with a different story. We take the time to understand where they are â€” because the gap between their starting point and their potential is exactly where real growth lives.',
    image: '/images/philosophy/philhome.jpeg',
    objectPosition: 'center center',
  },
  {
    stage: 2,
    label: 'Belief',
    title: 'Confidence often comes before achievement.',
    supporting: 'We have seen it hundreds of times: the moment a student believes they can, the results follow. Building that belief is not a side effect of our teaching â€” it is the purpose of it.',
    image: '/images/philosophy/laihome.jpeg',
    objectPosition: 'center 63%',
  },
  {
    stage: 3,
    label: 'Understanding',
    title: 'Understanding matters more than memorisation.',
    supporting: 'Real mastery is knowing why something works, not just that it does. We teach students to think deeply, so knowledge becomes theirs permanently â€” not just until the exam.',
    image: '/images/philosophy/ademhome.jpeg',
    objectPosition: 'center 64%',
  },
  {
    stage: 4,
    label: 'Growth',
    title: 'We strengthen the child behind the result.',
    supporting: 'Marks improve when students feel capable, seen, and guided. Our goal is not to chase grades â€” it is to build the resilience, curiosity, and self-belief that make sustained excellence possible.',
    image: '/images/philosophy/homekid.jpeg',
    objectPosition: 'center 83%',
  },
];

const STATS_DATA = [
  { target: 20,    decimals: 0, suffix: '+',  label: 'Years of Excellence', triggerDelay: 0   },
  { target: 10000, decimals: 0, suffix: '+',  label: 'Students Supported',  triggerDelay: 200 },
  { target: 5,     decimals: 1, suffix: ' â˜…', label: 'Google Rating',       triggerDelay: 400 },
  { target: 450,   decimals: 0, suffix: '+',  label: 'Five-Star Reviews',   triggerDelay: 600 },
];

// â”€â”€ Subtle gold sparkle â€” particles radiate from the number â”€â”€
const SPARKLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const GoldSparkle = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <span style={{ position: 'absolute', top: '50%', left: '30%', pointerEvents: 'none', zIndex: 10 }}>
      {SPARKLE_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const dist = 24 + (i % 3) * 10;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, opacity: 0, scale: 0 }}
            transition={{ duration: 0.75, delay: i * 0.03, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: 5, height: 5, borderRadius: '50%',
              background: '#F0C86A', display: 'block',
              boxShadow: '0 0 4px 1px rgba(232,192,64,.6)',
            }}
          />
        );
      })}
    </span>
  );
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easePrestige = (value: number) => 1 - Math.pow(1 - clamp01(value), 4);

// â”€â”€ Count-up number â€” driven by the single journey particle progress â”€â”€
const CountUpStat = ({ target, decimals = 0, suffix, progress, milestone }: {
  target: number; decimals?: number; suffix: string;
  progress: number; milestone: number;
}) => {
  const reduced = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const countProgress = reduced.current ? 1 : easePrestige((progress - milestone) / 0.11);
  const count = countProgress * target;

  const display = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString();

  return <span>{display}{suffix}</span>;
};

const PhilosophyBackedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const ease = [0.22, 1, 0.36, 1] as const;

  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // â”€â”€ Auto-rotation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRotation = () => {
    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
  };
  const startRotation = () => {
    if (reducedMotion) return;
    stopRotation();
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % PHILOSOPHY_STAGES.length);
    }, 5500);
  };
  const goTo = (i: number) => {
    setActiveIndex(i);
    startRotation();
    // Move DOM focus to the newly active tab so keyboard users stay oriented
    tabRefs.current[i]?.focus();
  };

  useEffect(() => {
    PHILOSOPHY_STAGES.forEach(stage => {
      const img = new Image();
      img.src = stage.image;
    });
  }, []);

  useEffect(() => {
    if (!inView) return;
    startRotation();
    const onVisibility = () => { document.hidden ? stopRotation() : startRotation(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => { stopRotation(); document.removeEventListener('visibilitychange', onVisibility); };
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      aria-label="Our philosophy and results"
      style={{ background: C.navy, overflow: 'hidden' }}
    >
      <style>{`
        /* Mobile: stack image above content */
        @media (max-width: 768px) {
          .phi-journey { grid-template-columns: 1fr !important; }
          .phi-img-col { min-height: 300px; aspect-ratio: 16/8; }
          .phi-stage-img[data-stage="1"] { object-position: center center !important; }
          .phi-stage-img[data-stage="2"] { object-position: center 58% !important; }
          .phi-stage-img[data-stage="3"] { object-position: center 58% !important; }
          .phi-stage-img[data-stage="4"] { object-position: center 76% !important; }
          .phi-photo-overlay {
            background: linear-gradient(
              90deg,
              rgba(5, 20, 40, 0.12) 0%,
              rgba(5, 20, 40, 0.18) 55%,
              rgba(5, 20, 40, 0.25) 100%
            ) !important;
          }
          .phi-photo-edge {
            background: linear-gradient(to bottom, transparent 70%, rgba(10,27,52,.25) 100%) !important;
          }
        }

        .phi-stage-img[data-stage="1"] { object-position: center center; }
        .phi-stage-img[data-stage="2"] { object-position: center 63%; }
        .phi-stage-img[data-stage="3"] { object-position: center 64%; }
        .phi-stage-img[data-stage="4"] { object-position: center 83%; }

        /* â”€â”€ Philosophy pillar blocks â”€â”€ */

        /* Base card â€” inactive */
        .phi-block {
          -webkit-tap-highlight-color: transparent;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(180,200,240,0.04) 100%);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px 16px 16px;
          transition:
            background 240ms ease,
            border-color 240ms ease,
            box-shadow 240ms ease;
        }
        /* Hover */
        .phi-block:not([aria-selected="true"]):hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(180,200,240,0.07) 100%);
          border-color: rgba(255,255,255,0.22);
          box-shadow: 0 2px 16px rgba(0,0,0,0.16);
        }
        /* Active card */
        .phi-block[aria-selected="true"] {
          background: linear-gradient(135deg, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.05) 100%);
          border-color: rgba(212,175,55,0.42);
          box-shadow: 0 0 20px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.12);
        }
        /* Focus */
        .phi-block:focus-visible {
          outline: 1.5px solid rgba(212,175,55,0.55);
          outline-offset: 3px;
        }

        /* Number */
        .phi-block-num {
          font-family: ${serif};
          font-size: clamp(17px, 1.7vw, 22px);
          font-weight: 400;
          font-style: italic;
          letter-spacing: 0.02em;
          line-height: 1;
          color: rgba(255,255,255,0.65);
          transition: color 220ms ease;
        }
        .phi-block:not([aria-selected="true"]):hover .phi-block-num {
          color: rgba(255,255,255,0.90);
        }
        .phi-block[aria-selected="true"] .phi-block-num {
          color: #D4AF37;
        }

        /* Label */
        .phi-block-lbl {
          font-family: ${sans};
          font-size: clamp(9px, 0.78vw, 10.5px);
          font-weight: 600;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          line-height: 1.3;
          color: rgba(255,255,255,0.65);
          transition: color 220ms ease;
        }
        .phi-block:not([aria-selected="true"]):hover .phi-block-lbl {
          color: rgba(255,255,255,0.92);
        }
        .phi-block[aria-selected="true"] .phi-block-lbl {
          color: rgba(255,255,255,0.95);
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        /* Mobile: 2Ã—2 grid */
        @media (max-width: 600px) {
          .phi-block-grid { grid-template-columns: repeat(2,1fr) !important; }
          .phi-block { padding: 12px 14px 14px; }
          .phi-block-lbl { font-size: 9px; letter-spacing: 0.08em; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .phi-block,
          .phi-block-num,
          .phi-block-lbl { transition: none !important; }
        }
      `}</style>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           PHILOSOPHY JOURNEY
           Two equal panels: image left, content right.
           No max-width â€” the image bleeds to the section edge,
           giving it the same visual weight as the text.
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div
        className="phi-journey"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          alignItems: 'stretch',
          minHeight: 'clamp(620px, 82vh, 960px)',
        }}
      >

        {/* â”€â”€ IMAGE PANEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
             All 4 images mounted, crossfade via CSS opacity.
             Right-edge gradient bleeds into the content panel.
             Image: saturate enough to feel real, not oversaturated.
          â”€â”€ */}
        <div
          className="phi-img-col"
          style={{ position: 'relative', overflow: 'hidden', alignSelf: 'stretch' }}
        >
          {PHILOSOPHY_STAGES.map((stage, i) => (
            <img
              key={stage.stage}
              className="phi-stage-img"
              data-stage={stage.stage}
              src={stage.image}
              alt=""
              aria-hidden="true"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: stage.objectPosition,
                imageRendering: 'auto',
                filter: 'brightness(1.04) contrast(1.07) saturate(1.12)',
                opacity: i === activeIndex ? 1 : 0,
                transform: i === activeIndex ? 'scale(1.04)' : 'scale(1)',
                transition: reducedMotion
                  ? 'none'
                  : 'opacity 600ms ease-in-out, transform 600ms ease-in-out',
              }}
            />
          ))}

          {/* Directional overlay â€” reduced for DSLR clarity (25â€“35% range) */}
          <div className="phi-photo-overlay" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(90deg, rgba(5, 20, 40, 0.10) 0%, rgba(5, 20, 40, 0.20) 55%, rgba(5, 20, 40, 0.35) 100%)',
          }} />

          {/* Right-edge blend â€” image dissolves into the content panel */}
          <div className="phi-photo-edge" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to right, transparent 74%, rgba(10,27,52,.42) 90%, rgba(10,27,52,1) 100%)',
          }} />
        </div>

        {/* â”€â”€ CONTENT PANEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
             Flex column: eyebrow + indicator pinned top.
             Spacer lets the image breathe between nav and statement.
             Philosophy text anchors to the lower third.
             Pause rotation on hover/focus (WCAG 2.2.2).
          â”€â”€ */}
        <div
          onMouseEnter={stopRotation}
          onMouseLeave={startRotation}
          onFocusCapture={stopRotation}
          onBlurCapture={startRotation}
          style={{
            background: C.navy,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 'clamp(52px, 6vw, 80px) clamp(44px, 5.5vw, 76px)',
            position: 'relative',
          }}
        >
          {/* Left-edge gold hairline â€” separates panels on desktop */}
          <div style={{
            position: 'absolute', top: '10%', bottom: '10%', left: 0,
            width: '1px',
            background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,.18) 30%, rgba(212,175,55,.18) 70%, transparent)',
          }} />

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            style={{
              fontFamily: sans, fontSize: '.60rem', fontWeight: 700,
              letterSpacing: '.28em', textTransform: 'uppercase' as const,
              color: 'rgba(212,175,55,.75)', margin: '0 0 22px',
            }}
          >
            Our Philosophy
          </motion.p>

          {/* â”€â”€ Stage navigator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
               Number + label per stage. Active: full gold.
               Inactive: barely there (22% opacity).
               The track segment slides to the active position.
            â”€â”€ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.08, ease: 'easeOut' }}
            style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}
          >
            <div
              role="tablist"
              aria-label="Philosophy pillars"
              className="phi-block-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
            >
              {PHILOSOPHY_STAGES.map((stage, i) => (
                <button
                  ref={el => { tabRefs.current[i] = el; }}
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Philosophy pillar ${i + 1}: ${stage.label}`}
                  tabIndex={i === activeIndex ? 0 : -1}
                  onClick={() => goTo(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      goTo((i + 1) % PHILOSOPHY_STAGES.length);
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      goTo((i - 1 + PHILOSOPHY_STAGES.length) % PHILOSOPHY_STAGES.length);
                    } else if (e.key === 'Home') {
                      e.preventDefault();
                      goTo(0);
                    } else if (e.key === 'End') {
                      e.preventDefault();
                      goTo(PHILOSOPHY_STAGES.length - 1);
                    }
                  }}
                  className="phi-block"
                >
                  <span className="phi-block-num">
                    {String(stage.stage).padStart(2, '0')}
                  </span>
                  <span className="phi-block-lbl">
                    {stage.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Progress rail */}
            <div style={{ position: 'relative', height: '1px', marginTop: '10px', background: 'rgba(255,255,255,0.09)', borderRadius: '1px' }}>
              <div style={{
                position: 'absolute', top: '-0.5px', height: '2px', borderRadius: '1px',
                left: `${(activeIndex / PHILOSOPHY_STAGES.length) * 100}%`,
                width: `${(1 / PHILOSOPHY_STAGES.length) * 100}%`,
                background: C.gold,
                boxShadow: '0 0 6px rgba(212,175,55,0.50)',
                transition: reducedMotion ? 'none' : 'left 500ms cubic-bezier(0.22, 1, 0.36, 1)',
              }} />
            </div>
          </motion.div>

          {/* â”€â”€ Philosophy statement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
               AnimatePresence mode="wait": old content exits fully
               before new content enters. Clean, sequential, editorial.
               Both exit (250ms) and enter (680ms) feel deliberate.
            â”€â”€ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? {} : { opacity: 0, y: -10 }}
              transition={{
                duration: reducedMotion ? 0 : 0.68,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Stage statement */}
              <h2 style={{
                fontFamily: serif, fontWeight: 300,
                fontSize: 'clamp(1.55rem, 2.4vw, 2.55rem)',
                lineHeight: 1.24, letterSpacing: '-.020em',
                color: 'rgba(255,255,255,0.96)', margin: '0 0 20px',
              }}>
                {PHILOSOPHY_STAGES[activeIndex].title}
              </h2>

              {/* Gold separator */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '36px', opacity: 0.65 }}
                transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '1px', marginBottom: '20px',
                  background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                }}
              />

              {/* Supporting paragraph */}
              <p style={{
                fontFamily: sans, fontWeight: 400,
                fontSize: '.86rem', lineHeight: 1.82,
                color: 'rgba(250,250,248,0.76)',
                letterSpacing: '.010em',
                margin: 0, maxWidth: '27em',
              }}>
                {PHILOSOPHY_STAGES[activeIndex].supporting}
              </p>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

    </section>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  IMPACT & RECOGNITION
//  Dark navy, premium school prospectus aesthetic.
//  Left: award display + modal.  Right: 2Ã—2 stats grid.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const ImpactRecognitionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [modalOpen, setModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Apple decelerate curve: starts quickly, settles into position smoothly
  const ease = [0.25, 0.46, 0.45, 0.94] as const;
  // Slower, more considered entrance for hero elements
  const easeHero = [0.16, 1, 0.3, 1] as const;
  // Gold glow pulse controls
  const glowControls = useAnimationControls();

  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  // Start gold glow pulse once award has entered (1.6s after inView)
  useEffect(() => {
    if (inView && !reducedMotion) {
      glowControls.start({
        opacity: [0.55, 1.0, 0.65, 0.95, 0.55],
        transition: {
          duration: 7.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
          delay: 1.6,
        },
      });
    }
  }, [inView, reducedMotion, glowControls]);

  const closeModal = () => {
    setModalOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Escape key + body-scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    if (modalOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [modalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="Impact and recognition"
        style={{ background: '#F5F0E8', position: 'relative', overflow: 'hidden' }}
      >
        <style>{`
          /* Responsive grid */
          @media (max-width: 900px) {
            .ir-cols { grid-template-columns: 1fr !important; }
          }

          /* â”€â”€ Pillar cards (cream background) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
          .wwwon-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 1px;
            background: rgba(10,27,52,.07); /* gap colour between cards */
          }
          @media (max-width: 1024px) { .wwwon-grid { grid-template-columns: repeat(3, 1fr); } }
          @media (max-width: 600px)  { .wwwon-grid { grid-template-columns: 1fr 1fr; } }
          @media (max-width: 380px)  { .wwwon-grid { grid-template-columns: 1fr; } }

          .wwwon-card {
            background: #F5F0E8;
            padding: clamp(32px, 4vw, 48px) clamp(22px, 2.8vw, 36px);
            cursor: default;
            transition: background 360ms ease, transform 360ms cubic-bezier(0.22,1,0.36,1);
          }
          .wwwon-card:hover {
            background: #EDE6D8;
            transform: translateY(-4px);
          }
          .wwwon-num {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: .72rem; font-weight: 300; letter-spacing: .12em;
            color: rgba(212,175,55,.50);
            display: block; margin-bottom: 28px;
            transition: color 360ms ease;
          }
          .wwwon-card:hover .wwwon-num { color: rgba(212,175,55,.80); }
          .wwwon-line {
            width: 28px; height: 1px; margin-bottom: 22px;
            background: linear-gradient(90deg, rgba(212,175,55,.40), transparent);
            transition: width 360ms cubic-bezier(0.22,1,0.36,1), opacity 360ms ease;
          }
          .wwwon-card:hover .wwwon-line { width: 42px; opacity: .90; }
          .wwwon-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: clamp(.95rem, 1.3vw, 1.12rem);
            font-weight: 400; line-height: 1.30; letter-spacing: -.012em;
            color: rgba(10,27,52,.82);
            margin: 0 0 14px;
            transition: color 360ms ease;
          }
          .wwwon-card:hover .wwwon-title { color: rgba(10,27,52,.98); }
          .wwwon-body {
            font-family: 'DM Sans', 'Inter', sans-serif;
            font-size: .78rem; font-weight: 300; line-height: 1.82;
            letter-spacing: .004em;
            color: rgba(10,27,52,.45);
            margin: 0;
            transition: color 360ms ease;
          }
          .wwwon-card:hover .wwwon-body { color: rgba(10,27,52,.68); }
          @media (prefers-reduced-motion: reduce) {
            .wwwon-card { transition: none !important; }
            .wwwon-card:hover { transform: none !important; }
            .wwwon-num, .wwwon-line, .wwwon-title, .wwwon-body { transition: none !important; }
          }

          /* â”€â”€ Award image inner container â€” matches video 4/3 frame â”€â”€â”€ */
          .ir-award-inner {
            aspect-ratio: 4 / 3;
            display: flex; align-items: center; justify-content: center;
            background: #FDFAF5;
            border-radius: 5px;
            overflow: hidden;
          }
          .ir-award-inner img {
            width: 100%; height: 100%;
            object-fit: contain;
            display: block;
          }

          /* â”€â”€ Award frame â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
          .ir-award-frame {
            transition:
              box-shadow 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .ir-award-frame:hover {
            transform: translateY(-3px);
            box-shadow:
              0 2px 6px rgba(212,175,55,.14),
              0 22px 64px rgba(10,27,52,.15),
              0 52px 90px rgba(10,27,52,.08),
              inset 0 1px 0 rgba(255,255,255,.90),
              inset 0 0 0 1px rgba(255,255,255,.50) !important;
          }
          @media (prefers-reduced-motion: reduce) {
            .ir-award-frame { transition: none !important; }
            .ir-award-frame:hover { transform: none !important; }
          }

          /* â”€â”€ Recognition story lead â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
          .ir-story-lead {
            border-left: 2px solid rgba(212,175,55,.24);
            padding-left: 20px;
          }

          /* â”€â”€ Video thumbnail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
          .ir-thumb-wrap {
            cursor: pointer;
            display: block;
            width: 100%;
          }
          .ir-thumb-frame {
            position: relative;
            overflow: hidden;
            border-radius: 14px;
            aspect-ratio: 4 / 3;
            border: 1px solid rgba(10,27,52,.08);
            box-shadow:
              0 8px 24px rgba(10,27,52,.10),
              0 32px 72px rgba(10,27,52,.18),
              0 60px 100px rgba(10,27,52,.08);
            transition:
              box-shadow 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 600ms ease;
          }
          .ir-thumb-wrap:hover .ir-thumb-frame {
            border-color: rgba(212,175,55,.20);
            box-shadow:
              0 12px 32px rgba(10,27,52,.13),
              0 40px 80px rgba(10,27,52,.22),
              0 72px 110px rgba(10,27,52,.09);
          }
          .ir-thumb-frame img {
            width: 100%; height: 100%; display: block;
            object-fit: cover;
            filter: saturate(0.80) brightness(0.86);
            transition:
              transform 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 600ms ease;
          }
          .ir-thumb-wrap:hover .ir-thumb-frame img {
            transform: scale(1.03);
            filter: saturate(0.88) brightness(0.78);
          }
          .ir-thumb-overlay {
            position: absolute; inset: 0; pointer-events: none;
            background: linear-gradient(
              to top,
              rgba(3,6,14,.72) 0%,
              rgba(3,6,14,.14) 52%,
              transparent 100%
            );
          }
          .ir-thumb-badge {
            position: absolute; top: 18px; left: 20px;
            font-family: 'DM Sans', 'Inter', sans-serif;
            font-size: .50rem; font-weight: 500; letter-spacing: .16em;
            text-transform: uppercase;
            color: rgba(250,250,248,.72);
            background: rgba(3,6,14,.48);
            border: 1px solid rgba(255,255,255,.12);
            border-radius: 3px; padding: 5px 11px;
            backdrop-filter: blur(8px);
          }
          .ir-thumb-play {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 80px; height: 80px; border-radius: 50%;
            background: rgba(250,250,248,.10);
            border: 1px solid rgba(212,175,55,.48);
            display: flex; align-items: center; justify-content: center;
            color: rgba(232,192,64,.94);
            backdrop-filter: blur(12px);
            transition:
              background 500ms ease,
              border-color 500ms ease,
              box-shadow 500ms ease,
              transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .ir-thumb-wrap:hover .ir-thumb-play {
            background: rgba(212,175,55,.14);
            border-color: rgba(212,175,55,.70);
            transform: translate(-50%, -50%) scale(1.06);
            box-shadow:
              0 0 32px rgba(212,175,55,.24),
              0 0 10px rgba(212,175,55,.14);
          }
          .ir-thumb-caption-wrap {
            margin-top: 22px;
            padding-left: 2px;
          }
          .ir-thumb-caption-title {
            font-family: 'DM Sans', 'Inter', sans-serif;
            font-size: 1.20rem; font-weight: 500; letter-spacing: .006em;
            color: rgba(10,27,52,.68);
            margin: 0 0 10px; line-height: 1.4;
            transition: color 300ms ease;
          }
          .ir-thumb-caption-sub {
            font-family: 'DM Sans', 'Inter', sans-serif;
            font-size: .92rem; font-weight: 300; letter-spacing: .04em;
            color: rgba(10,27,52,.40);
            margin: 0 0 3px; line-height: 1.6;
            transition: color 300ms ease;
          }
          .ir-thumb-caption-sub:last-child { margin-bottom: 0; }
          .ir-thumb-wrap:hover .ir-thumb-caption-title { color: rgba(10,27,52,.82); }
          .ir-thumb-wrap:hover .ir-thumb-caption-sub  { color: rgba(10,27,52,.58); }
          .ir-thumb-wrap:focus-visible {
            outline: 1px solid rgba(212,175,55,.50);
            outline-offset: 6px; border-radius: 12px;
          }
          @media (prefers-reduced-motion: reduce) {
            .ir-thumb-frame img { transition: none !important; }
            .ir-thumb-wrap:hover .ir-thumb-frame img { transform: none !important; }
            .ir-thumb-play { transition: none !important; }
          }
        `}</style>

        {/* Top edge: very faint gold rule separating from previous section */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,.30) 25%, rgba(212,175,55,.30) 75%, transparent)',
        }} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto', position: 'relative',
          padding: 'clamp(64px, 8vw, 108px) clamp(24px, 5vw, 72px)',
        }}>

          {/* â”€â”€ FULL-WIDTH HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div style={{ maxWidth: '760px', marginBottom: 'clamp(48px, 6vw, 80px)' }}>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                fontFamily: sans, fontSize: '.52rem', fontWeight: 600,
                letterSpacing: '.32em', textTransform: 'uppercase',
                color: C.gold, margin: '0 0 28px',
              }}
            >
              Trusted by Local Families Since 2005
            </motion.p>

            <motion.h2
              initial={reducedMotion ? false : { opacity: 0, y: 36, filter: 'blur(10px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.30, delay: 0.10, ease: easeHero }}
              style={{
                fontFamily: serif, fontWeight: 300,
                fontSize: 'clamp(2.4rem, 3.8vw, 4.4rem)',
                lineHeight: 1.10, letterSpacing: '-.028em',
                color: C.navy, margin: '0 0 20px',
              }}
            >
              The Community Noticed<br />
              What Families Already Knew.
            </motion.h2>

            <motion.div
              initial={reducedMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 0.55 } : {}}
              transition={{ duration: 0.80, delay: 0.22, ease: [0.25, 1, 0.5, 1] }}
              style={{
                width: '40px', height: '1px', marginBottom: '22px',
                background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                transformOrigin: 'left',
              }}
            />

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.10, delay: 0.32, ease }}
              style={{
                fontFamily: sans, fontWeight: 300,
                fontSize: 'clamp(1.10rem, 1.5vw, 1.25rem)',
                lineHeight: 1.76,
                color: 'rgba(10,27,52,.50)',
                letterSpacing: '.002em', margin: 0,
              }}
            >
              For more than twenty years, DA families have watched their children grow â€”
              in confidence first, then in results. This recognition reflects what those
              families experienced, and what the wider community came to see.
            </motion.p>
          </div>

          {/* â”€â”€ MEDIA GRID: award image | video thumbnail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div
            className="ir-cols"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(24px, 4vw, 48px)',
              alignItems: 'start',
              marginBottom: 'clamp(40px, 5vw, 64px)',
            }}
          >

            {/* â”€â”€ Award image â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 28, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.30, delay: 0.40, ease: easeHero }}
            >
              <div
                className="ir-award-frame"
                style={{
                  padding: '16px',
                  background: '#FDFAF5',
                  border: '1px solid rgba(212,175,55,.52)',
                  borderRadius: '14px',
                  boxShadow: [
                    '0 2px 6px rgba(212,175,55,.10)',
                    '0 16px 48px rgba(10,27,52,.12)',
                    '0 40px 80px rgba(10,27,52,.07)',
                    'inset 0 1px 0 rgba(255,255,255,.90)',
                  ].join(', '),
                }}
              >
                <div
                  className="ir-award-inner"
                  style={{ border: '1px solid rgba(212,175,55,.22)' }}
                >
                  <img
                    src="/Photos and Videos/2025_FAIR_WINNER_LBA.jpg"
                    alt="Fairfield City Local Business Awards â€” Outstanding Education Service, Winner 2025"
                  />
                </div>
              </div>

              {/* Award caption */}
              <div style={{ marginTop: '20px', paddingLeft: '2px' }}>
                <motion.p
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.0, delay: 0.64, ease: 'easeOut' }}
                  style={{
                    fontFamily: serif, fontWeight: 400,
                    fontSize: '1.15rem', lineHeight: 1.45,
                    color: 'rgba(10,27,52,.72)', margin: '0 0 6px',
                  }}
                >
                  Fairfield City Local Business Awards
                </motion.p>
                <motion.p
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.0, delay: 0.72, ease: 'easeOut' }}
                  style={{
                    fontFamily: sans, fontWeight: 500,
                    fontSize: '.78rem', lineHeight: 1.5,
                    letterSpacing: '.10em', textTransform: 'uppercase',
                    color: C.gold, margin: 0,
                  }}
                >
                  Winner â€” Outstanding Education Service 2025
                </motion.p>
              </div>
            </motion.div>

            {/* â”€â”€ Video thumbnail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.10, delay: 0.46, ease }}
            >
              <div
                className="ir-thumb-wrap"
                role="button"
                tabIndex={0}
                aria-label="Watch the DA Tuition award ceremony â€” 45 seconds"
                onClick={() => setModalOpen(true)}
                onKeyDown={e => e.key === 'Enter' && setModalOpen(true)}
              >
                <div className="ir-thumb-frame">
                  <img
                    src="/Photos and Videos/EP6_0216.jpg"
                    alt="Award ceremony footage â€” DA Tuition Outstanding Education Service 2025"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="ir-thumb-overlay" aria-hidden="true" />
                  <span className="ir-thumb-badge" aria-hidden="true">45 seconds</span>
                  <div className="ir-thumb-play" aria-hidden="true">
                    <Play size={26} strokeWidth={1.3} style={{ marginLeft: '3px' }} />
                  </div>
                </div>
                <div className="ir-thumb-caption-wrap">
                  <p className="ir-thumb-caption-title">Award Ceremony Highlights</p>
                  <p className="ir-thumb-caption-sub">Outstanding Education Service</p>
                  <p className="ir-thumb-caption-sub">Winner Interview &amp; Recognition</p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* â”€â”€ CINEMATIC VIDEO MODAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="ir-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label="Award ceremony video â€” Outstanding Education Service"
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              /* Deep cinematic black with a warm undertone */
              background: 'rgba(3,6,14,.96)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(20px, 5vw, 52px)',
              /* Faint radial spotlight centred behind the video */
              backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 52%, rgba(212,175,55,.04) 0%, transparent 65%)',
            }}
          >
            {/* Close â€” fixed top-right corner */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              onClick={closeModal}
              aria-label="Close video"
              style={{
                position: 'fixed', top: 'clamp(18px, 3vw, 28px)', right: 'clamp(18px, 3vw, 28px)',
                zIndex: 1001,
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: '50%',
                width: '44px', height: '44px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(250,250,248,.70)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'background 220ms ease, border-color 220ms ease, color 220ms ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,.15)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,.40)';
                (e.currentTarget as HTMLButtonElement).style.color = C.goldL;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.06)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.12)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(250,250,248,.70)';
              }}
            >
              <X size={16} strokeWidth={1.5} />
            </motion.button>

            {/* Content wrapper â€” stops click-through to backdrop */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '1020px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0',
              }}
            >
              {/* â”€â”€ Title card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center', marginBottom: 'clamp(22px, 3.5vw, 36px)' }}
              >
                {/* Gold rule above title */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width: '48px', height: '1px', margin: '0 auto 20px',
                    background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
                    transformOrigin: 'center',
                  }}
                />

                <motion.p
                  initial={{ opacity: 0, letterSpacing: '.35em' }}
                  animate={{ opacity: 1, letterSpacing: '.24em' }}
                  transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: sans, fontSize: '.54rem', fontWeight: 600,
                    letterSpacing: '.24em', textTransform: 'uppercase',
                    color: 'rgba(212,175,55,.55)', margin: '0 0 14px',
                  }}
                >
                  Award Ceremony
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.80, delay: 0.30, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: serif, fontWeight: 300,
                    fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)',
                    lineHeight: 1.18, letterSpacing: '-.022em',
                    color: C.white, margin: '0 0 10px',
                  }}
                >
                  Outstanding Education Service Award
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.40 }}
                  style={{
                    fontFamily: sans, fontWeight: 300,
                    fontSize: '.72rem', letterSpacing: '.10em',
                    textTransform: 'uppercase',
                    color: 'rgba(250,250,248,.28)', margin: 0,
                  }}
                >
                  Fairfield City Local Business Awards 2025
                </motion.p>
              </motion.div>

              {/* â”€â”€ Video frame â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: '100%', position: 'relative',
                  /* Cinematic letterbox framing lines */
                  borderTop: '1px solid rgba(212,175,55,.14)',
                  borderBottom: '1px solid rgba(212,175,55,.14)',
                  /* Thin gold edge on sides */
                  outline: '1px solid rgba(212,175,55,.08)',
                  boxShadow: `
                    0 0 0 1px rgba(212,175,55,.06),
                    0 40px 100px rgba(0,0,0,.80),
                    0 8px 32px rgba(0,0,0,.60),
                    inset 0 0 80px rgba(3,6,14,.20)
                  `,
                }}
              >
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  style={{
                    width: '100%', display: 'block',
                    /* Slight warmth to match award gold tone */
                    filter: 'saturate(1.04) contrast(1.02)',
                  }}
                >
                  <source
                    src="/Photos and Videos/08 Oustanding Education Service _DA tuition_02_FairField.mp4"
                    type="video/mp4"
                  />
                </video>
              </motion.div>

              {/* â”€â”€ Caption below video â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                style={{
                  fontFamily: sans, fontWeight: 300,
                  fontSize: '.62rem', letterSpacing: '.10em',
                  textTransform: 'uppercase', textAlign: 'center',
                  color: 'rgba(250,250,248,.18)',
                  margin: 'clamp(16px, 2.5vw, 22px) 0 0',
                }}
              >
                Press <kbd style={{
                  fontFamily: sans, fontSize: '.58rem',
                  padding: '2px 7px', borderRadius: '3px',
                  background: 'rgba(255,255,255,.07)',
                  border: '1px solid rgba(255,255,255,.12)',
                  color: 'rgba(250,250,248,.35)',
                  letterSpacing: '.06em',
                }}>Esc</kbd> to close
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  ACHIEVEMENTS â€” standalone statistics section
//  Navy background, off-white + gold palette.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const ACH_STATS = [
  { target: 20,    decimals: 0, suffix: '+', label: 'Years',          caption: 'TWO DECADES OF GUIDANCE', x: 5,  y: 32 },
  { target: 10000, decimals: 0, suffix: '+', label: 'Students',       caption: 'STUDENTS SUPPORTED',      x: 31, y: 47 },
  { target: 5,     decimals: 1, suffix: '',  label: 'Rating',         caption: 'TRUSTED BY FAMILIES',     x: 48, y: 62 },
  { target: 450,   decimals: 0, suffix: '+', label: 'Google Reviews', caption: 'FIVE-STAR STORIES',       x: 68, y: 70 },
];

const ACH_PATH = 'M 30 172 C 122 232 214 260 318 305 C 444 360 470 404 604 432 C 710 454 706 506 814 512 C 902 518 948 560 1018 590 C 1070 612 1110 636 1150 666';

const AchievementsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [counts, setCounts] = useState(ACH_STATS.map(() => 0));
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const hasCountedRef = useRef(false);
  const countRafs = useRef<number[]>([]);
  const countTimers = useRef<number[]>([]);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  const formatStatValue = (value: number, stat: typeof ACH_STATS[number], index: number) => {
    const formatted = stat.decimals > 0
      ? value.toFixed(stat.decimals)
      : Math.round(value).toLocaleString();
    return index === 2 ? formatted : `${formatted}${stat.suffix}`;
  };

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const clearCountAnimations = () => {
      countRafs.current.forEach(id => cancelAnimationFrame(id));
      countTimers.current.forEach(id => clearTimeout(id));
      countRafs.current = [];
      countTimers.current = [];
    };

    const startCount = () => {
      if (hasCountedRef.current) return;
      hasCountedRef.current = true;
      clearCountAnimations();

      if (reducedMotion) {
        setCounts(ACH_STATS.map(stat => stat.target));
        return;
      }

      ACH_STATS.forEach((stat, index) => {
        const duration = 1800 + index * 220;
        const delay = index * 430;
        const timeout = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const raw = clamp01((now - start) / duration);
            const eased = easePrestige(raw);
            setCounts(prev => {
              const next = [...prev];
              next[index] = stat.target * eased;
              return next;
            });

            if (raw < 1) {
              countRafs.current[index] = requestAnimationFrame(tick);
            } else {
              setCounts(prev => {
                const next = [...prev];
                next[index] = stat.target;
                return next;
              });
            }
          };
          countRafs.current[index] = requestAnimationFrame(tick);
        }, delay);
        countTimers.current.push(timeout);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        setIsActive(ratio >= 0.1);

        if (ratio >= 0.4) {
          startCount();
        } else if (ratio < 0.1) {
          clearCountAnimations();
          hasCountedRef.current = false;
          setCounts(ACH_STATS.map(() => 0));
        }
      },
      { threshold: [0, 0.1, 0.4, 1] }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      clearCountAnimations();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const section = ref.current;
    if (!section || reducedMotion) return;

    let raf = 0;
    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      const progress = clamp01((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
      section.style.setProperty('--ach-scroll', `${(progress - 0.5) * 1}`);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={ref}
      aria-label="DA Tuition achievements"
      className={`ach-luxury ${isActive ? 'is-active' : ''}`}
    >
      <style>{`
        .ach-luxury {
          --ach-scroll: 0;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          min-height: clamp(920px, 112vh, 1000px);
          background:
            radial-gradient(circle at 5% 4%, rgba(240,200,106,.105), transparent 17%),
            radial-gradient(circle at 90% 94%, rgba(212,175,55,.095), transparent 21%),
            radial-gradient(circle at 30% 72%, rgba(16,63,124,.16), transparent 38%),
            radial-gradient(circle at 78% 18%, rgba(10,44,93,.18), transparent 34%),
            linear-gradient(135deg, #020B18 0%, #061A33 48%, #092345 100%);
          color: #F5F0E8;
        }

        .ach-luxury::before,
        .ach-luxury::after {
          content: "";
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }

        .ach-luxury::before {
          inset: 0;
          background:
            linear-gradient(90deg, rgba(240,200,106,.07), transparent 16%, transparent 84%, rgba(240,200,106,.06)),
            radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(1,7,17,.62) 100%);
        }

        .ach-luxury::after {
          left: -14%;
          right: -14%;
          bottom: -22%;
          height: 44%;
          background:
            radial-gradient(ellipse at 18% 62%, rgba(18,68,132,.16), transparent 54%),
            radial-gradient(ellipse at 72% 80%, rgba(212,175,55,.08), transparent 56%);
          filter: blur(10px);
          opacity: .74;
          transform: translate3d(0, calc(var(--ach-scroll) * -18px), 0);
          will-change: transform;
        }

        .ach-cosmos,
        .ach-haze,
        .ach-constellation,
        .ach-stage {
          position: absolute;
          inset: 0;
        }

        .ach-cosmos {
          z-index: 1;
          pointer-events: none;
          opacity: .72;
          background-image:
            radial-gradient(circle, rgba(240,200,106,.34) 0 1px, transparent 1.4px),
            radial-gradient(circle, rgba(245,240,232,.16) 0 1px, transparent 1.3px),
            radial-gradient(circle, rgba(212,175,55,.25) 0 1.2px, transparent 1.8px);
          background-size: 108px 108px, 176px 176px, 260px 260px;
          background-position: 12px 18px, 64px 92px, 180px 40px;
          animation: achCosmosDrift 52s linear infinite;
          transform: translate3d(0, calc(var(--ach-scroll) * -24px), 0);
          will-change: transform;
        }

        .ach-haze {
          z-index: 2;
          pointer-events: none;
          background:
            linear-gradient(160deg, transparent 30%, rgba(16,64,125,.07) 49%, transparent 69%),
            linear-gradient(25deg, transparent 35%, rgba(240,200,106,.045) 54%, transparent 74%);
          opacity: .76;
          mix-blend-mode: screen;
          transform: translate3d(0, calc(var(--ach-scroll) * -14px), 0);
          will-change: transform;
        }

        .ach-constellation {
          z-index: 3;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: .34;
          transform: translate3d(0, calc(var(--ach-scroll) * -32px), 0);
          will-change: transform;
        }

        .ach-content {
          position: relative;
          z-index: 5;
          min-height: clamp(920px, 112vh, 1000px);
          max-width: 1440px;
          margin: 0 auto;
          padding: 120px clamp(24px, 5vw, 88px) 160px;
        }

        .ach-heading {
          position: absolute;
          top: 18%;
          right: 8%;
          max-width: 420px;
          text-align: left;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 900ms ease, transform 900ms cubic-bezier(.16, 1, .3, 1);
        }

        .ach-luxury.is-active .ach-heading {
          opacity: 1;
          transform: translateY(0);
        }

        .ach-heading h2 {
          font-family: ${serif};
          font-weight: 300;
          font-size: clamp(2.35rem, 3.5vw, 4.1rem);
          line-height: 1.08;
          letter-spacing: -.03em;
          color: #F5F0E8;
          margin: 0;
        }

        .ach-heading h2::after {
          content: "";
          display: block;
          width: 132px;
          height: 1px;
          margin-top: 26px;
          background: linear-gradient(90deg, rgba(240,200,106,.84), rgba(240,200,106,.14), transparent);
        }

        .ach-heading p {
          display: none;
        }

        .ach-stage {
          z-index: 4;
          pointer-events: none;
          transform: translate3d(0, calc(var(--ach-scroll) * -18px), 0);
          will-change: transform;
        }

        .ach-path-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .ach-gold-path {
          filter: url(#ach-path-glow);
          stroke-dasharray: 1;
          stroke-dashoffset: 0;
          opacity: .95;
        }

        .ach-shimmer-path {
          stroke-dasharray: 38 520;
          animation: achPathShimmer 8.5s ease-in-out infinite;
          opacity: 0;
        }

        .ach-traveller {
          filter: url(#ach-node-glow);
          opacity: 0;
          animation: achTraveller 6.4s cubic-bezier(.35, 0, .22, 1) infinite;
        }

        .ach-trail {
          opacity: 0;
          animation: achTrail 6.4s cubic-bezier(.35, 0, .22, 1) infinite;
        }

        .ach-node-core {
          transition: r 500ms ease, opacity 500ms ease;
        }

        .ach-stat {
          position: absolute;
          width: min(26vw, 350px);
          pointer-events: auto;
          opacity: 0;
          transform: translate3d(0, 24px, 0);
          filter: blur(8px);
          transition:
            opacity 900ms ease,
            transform 900ms cubic-bezier(.16, 1, .3, 1),
            filter 900ms ease;
          transition-delay: var(--stat-delay);
        }

        .ach-luxury.is-active .ach-stat {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
        }

        .ach-stat::before {
          content: "";
          position: absolute;
          left: 46%;
          top: 42%;
          width: 300px;
          height: 300px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(240,200,106,.14), rgba(212,175,55,.045) 34%, transparent 66%);
          transform: translate(-50%, -50%) scale(.72);
          opacity: 0;
          transition: opacity 500ms ease, transform 500ms cubic-bezier(.16, 1, .3, 1);
          pointer-events: none;
          z-index: -1;
        }

        .ach-stat:hover::before {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .ach-stat-inner {
          display: inline-block;
          transform-origin: left center;
          transition: transform 500ms cubic-bezier(.16, 1, .3, 1);
        }

        .ach-stat:hover .ach-stat-inner {
          transform: scale(1.035);
        }

        .ach-stat-number {
          display: inline-block;
          font-family: ${serif};
          font-weight: 300;
          font-style: italic;
          font-size: clamp(3.75rem, 6.45vw, 8.15rem);
          line-height: .9;
          letter-spacing: -.04em;
          color: #EFE4CD;
          text-shadow: 0 0 28px rgba(240,200,106,.08);
          white-space: nowrap;
          transition: color 500ms ease, text-shadow 500ms ease;
        }

        .ach-stat[data-index="0"] .ach-stat-number {
          color: #EAC266;
        }

        .ach-stat:hover .ach-stat-number {
          color: #F0C86A;
          text-shadow: 0 0 34px rgba(240,200,106,.18);
        }

        .ach-star {
          font-style: normal;
          font-size: .35em;
          vertical-align: .82em;
          margin-left: .08em;
          color: #D4AF37;
        }

        .ach-divider {
          width: min(100%, 270px);
          height: 1px;
          margin: clamp(16px, 1.8vw, 24px) 0 clamp(12px, 1.4vw, 18px);
          background: linear-gradient(90deg, rgba(240,200,106,.72), rgba(240,200,106,.12), transparent);
          transform-origin: left;
          transform: scaleX(.78);
          transition: transform 500ms cubic-bezier(.16, 1, .3, 1), opacity 500ms ease;
          opacity: .7;
        }

        .ach-stat:hover .ach-divider {
          transform: scaleX(1);
          opacity: 1;
        }

        .ach-label {
          margin: 0;
          font-family: ${sans};
          font-size: clamp(.72rem, .85vw, .88rem);
          font-weight: 600;
          letter-spacing: .24em;
          line-height: 1.65;
          text-transform: uppercase;
          color: rgba(240,200,106,.9);
        }

        .ach-small-label {
          margin: 8px 0 0;
          font-family: ${sans};
          font-size: .72rem;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: rgba(245,240,232,.42);
        }

        .ach-brand-ghost {
          position: absolute;
          left: clamp(30px, 8vw, 126px);
          top: 47%;
          z-index: 1;
          transform: translateY(-50%);
          font-family: ${serif};
          font-size: clamp(7rem, 16vw, 16rem);
          line-height: .72;
          color: rgba(245,240,232,.055);
          letter-spacing: -.08em;
          pointer-events: none;
          user-select: none;
        }

        .ach-brand-ghost span {
          display: block;
          font-family: ${sans};
          font-size: clamp(.82rem, 1.5vw, 1.25rem);
          letter-spacing: .5em;
          color: rgba(245,240,232,.05);
          margin-top: 34px;
        }

        @keyframes achCosmosDrift {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-54px, -38px, 0); }
        }

        @keyframes achPathShimmer {
          0%, 66% { stroke-dashoffset: 500; opacity: 0; }
          76% { opacity: .68; }
          100% { stroke-dashoffset: -500; opacity: 0; }
        }

        @keyframes achTraveller {
          0%, 14% { opacity: 0; }
          20%, 84% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes achTrail {
          0%, 20% { opacity: 0; }
          34%, 78% { opacity: .62; }
          100% { opacity: 0; }
        }

        @media (max-width: 900px) {
          .ach-luxury,
          .ach-content {
            min-height: 1060px;
          }
          .ach-heading {
            position: relative;
            top: auto;
            right: auto;
            max-width: 620px;
            margin-left: auto;
            margin-bottom: 56px;
          }
          .ach-stat {
            width: min(42vw, 320px);
          }
          .ach-stat-number {
            font-size: clamp(3.4rem, 10vw, 7.2rem);
          }
          .ach-brand-ghost {
            opacity: .7;
          }
        }

        @media (max-width: 640px) {
          .ach-luxury,
          .ach-content {
            min-height: auto;
          }
          .ach-content {
            padding: 86px 24px 94px;
          }
          .ach-stage {
            position: relative;
            inset: auto;
            display: grid;
            gap: 42px;
            margin-top: 56px;
            transform: none;
            padding-left: 26px;
          }
          .ach-stage::before {
            content: "";
            position: absolute;
            left: 7px;
            top: 12px;
            bottom: 18px;
            width: 1px;
            background: linear-gradient(180deg, rgba(240,200,106,.72), rgba(240,200,106,.18), rgba(240,200,106,.46));
            box-shadow: 0 0 18px rgba(240,200,106,.20);
            opacity: .72;
          }
          .ach-path-svg {
            display: none;
          }
          .ach-stat {
            position: relative;
            left: auto !important;
            top: auto !important;
            width: 100%;
            transform: translate3d(0, 24px, 0);
          }
          .ach-stat::after {
            content: "";
            position: absolute;
            left: -24px;
            top: 2.4rem;
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: #F0C86A;
            box-shadow: 0 0 18px rgba(240,200,106,.45);
          }
          .ach-luxury.is-active .ach-stat {
            transform: translate3d(0, 0, 0);
          }
          .ach-stat-number {
            font-size: clamp(4.2rem, 20vw, 6.8rem);
          }
          .ach-brand-ghost {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ach-cosmos,
          .ach-shimmer-path,
          .ach-traveller,
          .ach-trail {
            animation: none !important;
          }
          .ach-content,
          .ach-stage,
          .ach-constellation,
          .ach-haze {
            transform: none !important;
          }
        }
      `}</style>

      <div className="ach-cosmos" aria-hidden="true" />
      <div className="ach-haze" aria-hidden="true" />
      <svg className="ach-constellation" aria-hidden="true" viewBox="0 0 1200 760" preserveAspectRatio="none">
        <g fill="none" stroke="rgba(240,200,106,.20)" strokeWidth=".7">
          <path d="M60 490 C170 560 254 540 360 612" />
          <path d="M720 150 L804 206 L910 180 L1028 246" />
          <path d="M820 640 C930 570 1040 565 1150 505" />
        </g>
        {[60, 144, 254, 360, 720, 804, 910, 1028, 820, 930, 1040, 1150].map((cx, i) => (
          <circle
            key={i}
            cx={cx}
            cy={[490, 538, 540, 612, 150, 206, 180, 246, 640, 570, 565, 505][i]}
            r={i % 3 === 0 ? 2.2 : 1.4}
            fill="rgba(240,200,106,.36)"
          />
        ))}
      </svg>

      <div className="ach-brand-ghost" aria-hidden="true">
        DA
        <span>TUITION</span>
      </div>

      <div className="ach-content">
        <div className="ach-heading">
          <h2>When Confidence<br />Grows, Results<br />Follow.</h2>
          <p>
            For more than twenty years, DA Tuition has helped students build confidence,
            strengthen their habits, and achieve meaningful academic growth.
          </p>
        </div>

        <div className="ach-stage">
          <svg className="ach-path-svg" aria-hidden="true" viewBox="0 0 1200 760" preserveAspectRatio="none">
            <defs>
              <filter id="ach-path-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="ach-node-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d={ACH_PATH} fill="none" stroke="rgba(212,175,55,.18)" strokeWidth=".9" />
            <path className="ach-gold-path" d={ACH_PATH} fill="none" stroke="rgba(240,200,106,.42)" strokeWidth="1.15" strokeLinecap="round" />
            <path className="ach-shimmer-path" d={ACH_PATH} fill="none" stroke="rgba(255,241,194,.82)" strokeWidth="1.4" strokeLinecap="round" />
            <path className="ach-trail" d={ACH_PATH} fill="none" stroke="rgba(240,200,106,.42)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 18" />
            <circle className="ach-traveller" r="5.2" fill="#F0C86A">
              <animateMotion dur="6.4s" repeatCount="indefinite" rotate="auto" path={ACH_PATH} />
            </circle>
            {ACH_STATS.map((stat, index) => (
              <g key={stat.label} filter="url(#ach-node-glow)">
                <circle
                  cx={stat.x * 12}
                  cy={stat.y * 7.6}
                  r={hoveredStat === index ? 10 : 7}
                  fill="rgba(240,200,106,.20)"
                />
                <circle
                  className="ach-node-core"
                  cx={stat.x * 12}
                  cy={stat.y * 7.6}
                  r={hoveredStat === index ? 5.3 : 3.9}
                  fill="#F0C86A"
                  opacity={hoveredStat === index ? 1 : .78}
                />
              </g>
            ))}
          </svg>

          {ACH_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="ach-stat"
              data-index={index}
              style={{
                left: `${stat.x}%`,
                top: `${stat.y}%`,
                ['--stat-delay' as string]: `${index * 180}ms`,
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              onFocus={() => setHoveredStat(index)}
              onBlur={() => setHoveredStat(null)}
              tabIndex={0}
            >
              <div className="ach-stat-inner">
                <span className="ach-stat-number">
                  {formatStatValue(counts[index], stat, index)}
                  {index === 2 && <span className="ach-star">â˜…</span>}
                </span>
                <div className="ach-divider" />
                <p className="ach-label">{stat.caption}</p>
                <p className="ach-small-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PROGRAMS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const PROGRAMS = [
  {
    href: '/programs/primary-school',
    image: '/primary-boy.png',
    sub: 'Years 3â€“6',
    name: 'Primary School',
    desc: 'Building strong foundations in literacy, numeracy and confident learning.',
  },
  {
    href: '/programs/high-school',
    image: '/highschool-girl.png',
    sub: 'Years 7â€“10',
    name: 'High School',
    desc: 'Develop deeper understanding, stronger study habits and independent thinking.',
  },
  {
    href: '/hsc-excellence',
    image: '/hsc-student.jpeg',
    sub: 'Years 11â€“12',
    name: 'HSC Excellence',
    desc: 'Expert guidance, proven systems and Band 6 strategies for outstanding results.',
  },
];

const ProgramImagePanel = ({ program, index }: { program: typeof PROGRAMS[number]; index: number }) => (
  <Link
    to={program.href}
    className="program-stage-panel"
    aria-label={`Learn more about ${program.name}`}
  >
    <img
      className="program-stage-image"
      src={program.image}
      alt=""
      aria-hidden="true"
      loading={index === 0 ? 'eager' : 'lazy'}
      decoding="async"
      sizes="(max-width: 720px) 100vw, 33vw"
    />
    <div className="program-stage-overlay" aria-hidden="true" />
    <div className="program-stage-content">
      <p className="program-stage-sub">{program.sub}</p>
      <h3 className="program-stage-title">{program.name}</h3>
      <p className="program-stage-desc">{program.desc}</p>
      <span className="program-stage-link">
        Learn More <span aria-hidden="true">â†’</span>
      </span>
    </div>
  </Link>
);

const ProgramsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <section id="programs" ref={ref} style={{ background: C.cream, padding: 'clamp(96px, 9vw, 132px) clamp(18px, 3vw, 48px)' }}>
      <style>{`
        .program-stage-shell {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 2px;
          min-height: clamp(560px, 72vh, 780px);
          border-radius: 24px;
          overflow: hidden;
          background: rgba(10, 27, 52, 0.16);
        }

        .program-stage-panel {
          position: relative;
          display: block;
          min-height: clamp(560px, 72vh, 780px);
          overflow: hidden;
          isolation: isolate;
          color: #fff;
          text-decoration: none;
          background: #0A1B34;
        }

        .program-stage-image {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1);
          transition: transform 500ms cubic-bezier(.22, 1, .36, 1);
          will-change: transform;
        }

        .program-stage-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.18) 42%, rgba(0, 0, 0, 0.76) 100%),
            linear-gradient(90deg, rgba(10, 27, 52, 0.12) 0%, rgba(10, 27, 52, 0.02) 42%, rgba(10, 27, 52, 0.2) 100%);
          transition: opacity 500ms ease;
        }

        .program-stage-content {
          position: absolute;
          left: clamp(22px, 3vw, 38px);
          right: clamp(22px, 3vw, 38px);
          bottom: clamp(28px, 4vw, 48px);
          z-index: 2;
          transform: translateY(0);
          transition: transform 500ms cubic-bezier(.22, 1, .36, 1);
        }

        .program-stage-sub {
          margin: 0 0 12px;
          font-family: ${sans};
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .18em;
          line-height: 1;
          text-transform: uppercase;
          color: #C8A03B;
        }

        .program-stage-title {
          margin: 0 0 14px;
          font-family: ${serif};
          font-size: clamp(2rem, 3vw, 3.15rem);
          font-weight: 700;
          line-height: 1.02;
          letter-spacing: -.025em;
          color: #fff;
          text-wrap: balance;
        }

        .program-stage-desc {
          max-width: 25em;
          margin: 0 0 24px;
          font-family: ${sans};
          font-size: clamp(.92rem, 1vw, 1rem);
          line-height: 1.65;
          color: rgba(255, 255, 255, .78);
          opacity: .88;
          transform: translateY(6px);
          transition: opacity 500ms ease, transform 500ms cubic-bezier(.22, 1, .36, 1);
          text-wrap: pretty;
        }

        .program-stage-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: ${sans};
          font-size: .78rem;
          font-weight: 800;
          letter-spacing: .13em;
          line-height: 1;
          text-transform: uppercase;
          color: #C8A03B;
        }

        .program-stage-link span {
          display: inline-block;
          transition: transform 500ms cubic-bezier(.22, 1, .36, 1);
        }

        .program-stage-panel:hover .program-stage-image,
        .program-stage-panel:focus-visible .program-stage-image {
          transform: scale(1.05);
        }

        .program-stage-panel:hover .program-stage-overlay,
        .program-stage-panel:focus-visible .program-stage-overlay {
          opacity: .84;
        }

        .program-stage-panel:hover .program-stage-content,
        .program-stage-panel:focus-visible .program-stage-content {
          transform: translateY(-8px);
        }

        .program-stage-panel:hover .program-stage-desc,
        .program-stage-panel:focus-visible .program-stage-desc {
          opacity: 1;
          transform: translateY(0);
        }

        .program-stage-panel:hover .program-stage-link span,
        .program-stage-panel:focus-visible .program-stage-link span {
          transform: translateX(6px);
        }

        .program-stage-panel:focus-visible {
          outline: 3px solid rgba(200, 160, 59, .72);
          outline-offset: -7px;
        }

        @media (max-width: 980px) {
          .program-stage-shell {
            min-height: clamp(500px, 64vh, 680px);
          }

          .program-stage-panel {
            min-height: clamp(500px, 64vh, 680px);
          }

          .program-stage-content {
            left: 22px;
            right: 22px;
            bottom: 30px;
          }

          .program-stage-title {
            font-size: clamp(1.65rem, 3vw, 2.25rem);
          }
        }

        @media (max-width: 720px) {
          .program-stage-shell {
            grid-template-columns: 1fr;
            min-height: 0;
            border-radius: 22px;
          }

          .program-stage-panel {
            min-height: 68vh;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .program-stage-image,
          .program-stage-overlay,
          .program-stage-content,
          .program-stage-desc,
          .program-stage-link span {
            transition: none;
          }

          .program-stage-panel:hover .program-stage-image,
          .program-stage-panel:focus-visible .program-stage-image,
          .program-stage-panel:hover .program-stage-content,
          .program-stage-panel:focus-visible .program-stage-content,
          .program-stage-panel:hover .program-stage-desc,
          .program-stage-panel:focus-visible .program-stage-desc,
          .program-stage-panel:hover .program-stage-link span,
          .program-stage-panel:focus-visible .program-stage-link span {
            transform: none;
          }
        }
      `}</style>
      <div style={{ maxWidth: '1480px', margin: '0 auto' }}>
        <Reveal>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 'clamp(44px, 5vw, 64px)' }}>
            <div style={{ fontFamily: sans, fontSize: '.7rem', fontWeight: 800, letterSpacing: '.17em', textTransform: 'uppercase', color: C.gold, marginBottom: '14px' }}>Academic Programs</div>
            <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', letterSpacing: '-.02em', lineHeight: 1.08, color: C.navy, margin: 0 }}>Tailored for Every Stage</h2>
            <p style={{ fontFamily: sans, color: C.muted, fontSize: 'clamp(1rem, 1.35vw, 1.18rem)', lineHeight: 1.7, margin: '18px auto 0', maxWidth: '34rem' }}>The right support at the right time.</p>
          </motion.div>
        </Reveal>
        <motion.div
          className="program-stage-shell"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {PROGRAMS.map((program, index) => (
            <motion.div key={program.name} variants={fadeUp} style={{ minWidth: 0 }}>
              <ProgramImagePanel program={program} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PULL QUOTE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const QuoteSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section ref={ref} style={{ background: C.navy, padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '80px', background: `linear-gradient(180deg,transparent,${C.gold})` }} />
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '80px', background: `linear-gradient(180deg,${C.gold},transparent)` }} />
      <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div variants={fadeUp} style={{ fontFamily: serif, fontSize: '4rem', color: 'rgba(212,175,55,.3)', lineHeight: 1, marginBottom: '16px' }}>â</motion.div>
        <motion.p variants={fadeUp} style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.44, color: C.white, letterSpacing: '.01em' }}>
          My daughter went from dreading maths to topping her class. DA Tuition didn't just improve her grades â€” they gave her back her confidence.
        </motion.p>
        <motion.div variants={fadeUp} style={{ width: '40px', height: '1px', background: C.gold, margin: '32px auto 18px' }} />
        <motion.p variants={fadeUp} style={{ fontFamily: sans, fontSize: '.74rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(212,175,55,.80)', fontWeight: 600 }}>
          Parent of Year 10 Student â€” Google Review, 5 Stars
        </motion.p>
      </motion.div>
    </section>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  WELLBEING â€” premium editorial layout
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const WELLBEING_FEATURES = [
  {
    title: 'Genuine Relationships',
    body:  'Our tutors know every student as an individual, building trust that lasts.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 36s-14-8.5-14-18a8 8 0 0 1 14-5.3A8 8 0 0 1 36 18c0 9.5-14 18-14 18z" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 20c0 0 3 2 7 2s7-2 7-2" stroke="#D4AF37" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Encouraging Environment',
    body:  'Students feel comfortable asking questions, sharing ideas and being themselves.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H16l-6 4V12z" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="19" r="1.2" fill="#D4AF37"/>
        <circle cx="22" cy="19" r="1.2" fill="#D4AF37"/>
        <circle cx="27" cy="19" r="1.2" fill="#D4AF37"/>
      </svg>
    ),
  },
  {
    title: 'Confidence to Grow',
    body:  'We celebrate effort, progress and personal strengths at every step.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 8l3.6 7.3 8.1 1.2-5.9 5.7 1.4 8-7.2-3.8-7.2 3.8 1.4-8-5.9-5.7 8.1-1.2L22 8z" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Strong Connections',
    body:  'Friendships between students create a supportive community that helps everyone thrive.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="16" r="4" stroke="#D4AF37" strokeWidth="1.3"/>
        <circle cx="30" cy="16" r="4" stroke="#D4AF37" strokeWidth="1.3"/>
        <circle cx="22" cy="14" r="4" stroke="#D4AF37" strokeWidth="1.3"/>
        <path d="M6 34c0-4.4 3.6-8 8-8h4" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M38 34c0-4.4-3.6-8-8-8h-4" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M14 34c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
] as const;

const WellbeingSection = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="wb-section" style={{
      background: 'linear-gradient(158deg, #FAF7F3 0%, #F3EDE2 52%, #F7F3EC 100%)',
      padding: 'clamp(72px, 8vw, 100px) clamp(24px, 5vw, 64px)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* â”€â”€ Styles â”€â”€ */}
      <style>{`
        /* Paper grain texture */
        .wb-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.020;
          pointer-events: none;
          mix-blend-mode: multiply;
          z-index: 0;
        }
        /* Warm gold orb */
        .wb-section::after {
          content: '';
          position: absolute;
          top: -100px; right: -80px;
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 68%);
          pointer-events: none;
          z-index: 0;
        }
        /* Photo hover lift */
        .wb-photo {
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1);
          will-change: transform;
          cursor: default;
        }
        .wb-photo:hover {
          transform: translateY(-6px) scale(1.03);
        }
        .wb-photo:hover .wb-photo-shadow {
          box-shadow: 0 24px 64px rgba(10,27,52,0.20) !important;
        }
        /* Premium CTA button */
        .wb-btn {
          font-family: ${sans};
          font-size: 0.60rem;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: ${C.navy};
          background: transparent;
          border: 1px solid rgba(10,27,52,0.20);
          border-radius: 2px;
          padding: 15px 30px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.35s ease, color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
        }
        .wb-btn:hover {
          border-color: ${C.gold};
          color: ${C.gold};
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(212,175,55,0.14);
        }
        .wb-btn .wb-arrow {
          display: inline-block;
          font-size: 1.0rem;
          transition: transform 0.40s cubic-bezier(0.22,1,0.36,1);
        }
        .wb-btn:hover .wb-arrow { transform: translateX(6px); }
        /* Feature card */
        .wb-card {
          padding: 32px 26px 40px;
          border-radius: 14px;
          background: transparent;
          position: relative;
          overflow: hidden;
          transition: background 0.38s ease, box-shadow 0.38s ease, transform 0.38s ease;
        }
        .wb-card:hover {
          background: rgba(255,255,255,0.82);
          box-shadow: 0 10px 48px rgba(10,27,52,0.07);
          transform: translateY(-5px);
        }
        /* Gold underline sweep */
        .wb-card::after {
          content: '';
          position: absolute;
          bottom: 18px; left: 26px;
          height: 1.5px;
          width: 0;
          background: linear-gradient(90deg, ${C.gold}, ${C.goldL});
          border-radius: 2px;
          transition: width 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .wb-card:hover::after { width: calc(100% - 52px); }
        /* Responsive grid */
        @media (min-width: 1024px) {
          .wb-main-grid { grid-template-columns: 44fr 56fr !important; gap: 32px !important; }
          .wb-feat-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 1023px) {
          .wb-main-grid { grid-template-columns: 1fr !important; gap: 44px !important; }
          .wb-feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 639px) {
          .wb-feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* â”€â”€ Two-column editorial row â”€â”€ */}
        <div
          className="wb-main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px',
            alignItems: 'start',
            marginBottom: '20px',
          }}
        >

          {/* â”€â”€â”€ LEFT: staggered text â”€â”€â”€ */}
          <div>
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: sans,
                fontSize: '0.60rem', fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: C.gold,
                display: 'flex', alignItems: 'center', gap: '12px',
                margin: '0 0 16px',
              }}
            >
              <span style={{ display: 'inline-block', width: '28px', height: '1px', background: C.gold, flexShrink: 0 }} />
              A Supportive Environment
            </motion.p>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.78, delay: 0.10, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: serif,
                fontWeight: 400,
                fontSize: 'clamp(1.75rem, 3.0vw, 2.85rem)',
                lineHeight: 1.14,
                letterSpacing: '-0.026em',
                color: C.navy,
                margin: '0 0 12px',
              }}
            >
              Where students feel<br />
              <em style={{ fontStyle: 'italic', color: C.gold }}>safe, supported</em><br />
              and <em style={{ fontStyle: 'italic', color: C.gold }}>inspired.</em>
            </motion.h2>

            {/* Gold rule */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '40px', height: '1.5px',
                background: C.gold,
                margin: '0 0 12px',
                transformOrigin: 'left',
              }}
            />

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: sans,
                fontWeight: 300,
                fontSize: 'clamp(0.93rem, 1.25vw, 1.04rem)',
                lineHeight: 1.94,
                color: 'rgba(10,27,52,0.56)',
                margin: '0 0 28px',
                maxWidth: '400px',
              }}
            >
              At DA Tuition, wellbeing is the foundation of academic growth. Our tutors build genuine connections, so students feel comfortable asking questions, sharing ideas and growing in confidence.
            </motion.p>

            {/* Premium CTA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="wb-btn">
                Discover Our Environment
                <span className="wb-arrow">â†’</span>
              </button>
            </motion.div>
          </div>

          {/* â”€â”€â”€ RIGHT: asymmetric editorial collage â”€â”€â”€ */}
          <div>

            {/* â”€â”€ Hero: full-width dominant image â”€â”€ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.10, ease: [0.22, 1, 0.36, 1] }}
              className="wb-photo"
            >
              <div className="wb-photo-shadow" style={{
                borderRadius: '18px', overflow: 'hidden',
                height: 'clamp(260px, 30vw, 380px)',
                boxShadow: '0 8px 44px rgba(10,27,52,0.12)',
                position: 'relative',
                transition: 'box-shadow 0.5s cubic-bezier(0.22,1,0.36,1)',
              }}>
                <img
                  src="/maletutors.jpeg"
                  alt="DA Tuition tutors in a warm collaborative session"
                  loading="lazy"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center 30%',
                    filter: 'brightness(1.04) contrast(1.06) saturate(1.14) sepia(0.04)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(8,18,36,0.20) 100%)',
                  pointerEvents: 'none',
                }} />
              </div>
            </motion.div>

            {/* â”€â”€ Support pair: left wider, right narrower, equal height â”€â”€ */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '12px',
            }}>

              {/* Left: 57% â€” students / community */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.78, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="wb-photo"
                style={{ flex: '0 0 57%' }}
              >
                <div className="wb-photo-shadow" style={{
                  borderRadius: '18px', overflow: 'hidden',
                  height: 'clamp(140px, 16vw, 200px)',
                  boxShadow: '0 8px 36px rgba(10,27,52,0.11)',
                  position: 'relative',
                  transition: 'box-shadow 0.5s cubic-bezier(0.22,1,0.36,1)',
                }}>
                  <img
                    src="/Lindatwins.JPG"
                    alt="Students with their DA Tuition teacher"
                    loading="lazy"
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center 28%',
                      filter: 'brightness(1.04) contrast(1.06) saturate(1.14) sepia(0.04)',
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(8,18,36,0.20) 100%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </motion.div>

              {/* Right: remaining width, same height */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.78, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="wb-photo"
                style={{ flex: 1 }}
              >
                <div className="wb-photo-shadow" style={{
                  borderRadius: '18px', overflow: 'hidden',
                  height: 'clamp(140px, 16vw, 200px)',
                  boxShadow: '0 8px 36px rgba(10,27,52,0.11)',
                  position: 'relative',
                  transition: 'box-shadow 0.5s cubic-bezier(0.22,1,0.36,1)',
                }}>
                  <img
                    src="/Freeman.png"
                    alt="DA Tuition student community"
                    loading="lazy"
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center 18%',
                      filter: 'brightness(1.04) contrast(1.06) saturate(1.14) sepia(0.04)',
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(8,18,36,0.20) 100%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* â”€â”€ Premium feature cards â”€â”€ */}
        <div
          className="wb-feat-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            borderTop: '1px solid rgba(10,27,52,0.07)',
            paddingTop: 'clamp(16px, 2vw, 24px)',
          }}
        >
          {WELLBEING_FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.68, delay: 0.48 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="wb-card"
            >
              <div style={{ marginBottom: '22px', lineHeight: 0 }}>
                {(() => {
                  const icon = feat.icon as React.ReactElement;
                  return React.cloneElement(icon, { width: 64, height: 64 } as React.SVGProps<SVGSVGElement>);
                })()}
              </div>
              <h3 style={{
                fontFamily: serif,
                fontWeight: 500,
                fontSize: '1.35rem',
                letterSpacing: '-0.014em',
                color: C.navy,
                margin: '0 0 10px',
              }}>{feat.title}</h3>
              <p style={{
                fontFamily: sans,
                fontWeight: 300,
                fontSize: '0.97rem',
                lineHeight: 1.78,
                color: 'rgba(10,27,52,0.58)',
                margin: 0,
              }}>{feat.body}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};



// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  DA ENVIRONMENT â€” scroll-driven media section
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const DAEnvironmentSection = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSimple, setIsSimple] = useState(false);

  useEffect(() => {
    const check = () => setIsSimple(
      window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!videoRef.current) return;
        e.isIntersecting ? videoRef.current.play().catch(() => {}) : videoRef.current.pause();
      },
      { threshold: 0.05 }
    );
    const el = outerRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // â”€â”€ Scroll tracking â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 260vh outer = 160vh of sticky travel.
  // NOTE: sticky works because the outer Index div uses overflow:clip
  // (not overflow:hidden) â€” hidden creates a scroll container which
  // breaks position:sticky. clip clips without creating a scroller.
  //
  // Timeline:
  //  0%  text visible; video card small + faint at bottom-centre
  // 20%  text starts rising/fading; card becomes more visible
  // 40%  text gone; card clear and centred
  // 60%  card large, fully sharp
  // 80%  card very large
  //100%  card fills full viewport, borderRadius â†’ 0
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });
  const s = scrollYProgress;

  // â”€â”€ TEXT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const textOp = useTransform(s, [0, 0.20, 0.40], [1, 1, 0]);
  const textY  = useTransform(s, [0.20, 0.40], [0, -90]);

  // â”€â”€ MAIN VIDEO CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Strategy: card is position:absolute; inset:0 (always 100vw Ã— 100vh).
  // We animate ONLY pure numbers â€” scale, opacity, blur â€” so Framer Motion
  // never has to interpolate mixed CSS units like "62vw" â†” "100vw".
  //
  // transformOrigin:'center 82%' means the scale pivot is near the bottom.
  // This makes the card appear to grow outward from the lower-centre area.
  //
  // Geometry at s=0, scale=0.40:
  //   Pivot at (50vw, 82vh). Card visual extent (from pivot):
  //   top    = 82vh âˆ’ 82vhÃ—0.40 = 82 âˆ’ 32.8 = 49.2vh  âœ“ visible
  //   bottom = 82vh + 18vhÃ—0.40 = 82 +  7.2 = 89.2vh  âœ“ visible
  //   â†’ card appears as a ~40vh-tall block in the lower half of screen
  const cardScale = useTransform(s, [0, 0.40, 0.65, 1.0], [0.40, 0.68, 0.88, 1.0]);
  const cardOp    = useTransform(s, [0, 0.20, 0.55], [0.35, 0.60, 1.0]);
  const cardBl    = useTransform(s, [0, 0.55], [8, 0]);
  const cardFi    = useTransform(cardBl,   (b: number) => `blur(${Math.max(0, b)}px)`);
  const cardRadV  = useTransform(s, [0.75, 0.98], [22, 0]);
  const cardRadS  = useTransform(cardRadV, (r: number) => `${Math.max(0, r)}px`);
  const overlayOp = useTransform(s, [0.35, 0.65], [0, 0.28]);

  // â”€â”€ SUPPORT CARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Absolute corners; appear at 35â€“55%; fade out as video fills frame.
  // No y-translation â€” they're always at their corner positions, just hidden.
  const sOp  = useTransform(s, [0.35, 0.55, 0.82], [0, 0.80, 0]);
  const sScl = useTransform(s, [0.35, 0.55], [0.80, 1.0]);

  const SCARDS = [
    { id: 'tg', src: '/media/threegirls.jpg', alt: 'DA students together',  ratio: '3/4' as const,  w: 'clamp(86px,7.8vw,126px)',  pos: { top: '8%',    left: '2%'  } as React.CSSProperties, rotate: -3  },
    { id: 'hf', src: '/media/highfive.jpg',   alt: 'High five with tutor',  ratio: '4/3' as const,  w: 'clamp(106px,9.8vw,150px)', pos: { top: '6%',    right: '2%' } as React.CSSProperties, rotate: 2.5 },
    { id: 'tb', src: '/media/theboys.jpg',    alt: 'DA tutors',             ratio: '4/3' as const,  w: 'clamp(94px,8.8vw,138px)',  pos: { bottom: '8%', left: '2%'  } as React.CSSProperties, rotate: -2  },
    { id: 'lc', src: '/media/laiclass.jpg',   alt: 'Classroom session',     ratio: '3/4' as const,  w: 'clamp(80px,7.2vw,116px)',  pos: { bottom: '6%', right: '2%' } as React.CSSProperties, rotate: 2   },
  ];

  const envCSS = `
    .da-scard { position:absolute; border-radius:14px; overflow:hidden;
      box-shadow:0 16px 48px rgba(0,0,0,0.52), 0 3px 10px rgba(0,0,0,0.28); }
    .da-ebtn { font-family:${sans}; font-size:0.58rem; font-weight:700; letter-spacing:0.18em;
      text-transform:uppercase; color:${C.navy}; background:${C.gold}; border:none;
      border-radius:3px; padding:12px 28px; cursor:pointer; transition:opacity 0.2s ease; }
    .da-ebtn:hover { opacity:0.86; }
  `;

  // â”€â”€ MOBILE: stacked, no scroll animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (isSimple) {
    return (
      <div ref={outerRef} style={{ background: '#06111F', padding: '60px 0 0' }}>
        <style>{envCSS}</style>
        <div style={{ textAlign: 'center', padding: '0 clamp(24px,6vw,48px) 40px', maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontFamily: sans, fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 16px' }}>
            DA Environment
          </p>
          <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(1.6rem,5vw,2.4rem)', lineHeight: 1.14, color: '#FAFAF8', margin: '0 0 16px' }}>
            More than tutoring.<br />
            <em style={{ fontStyle: 'italic', color: C.gold }}>A place where students feel known.</em>
          </h2>
          <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.92rem', lineHeight: 1.78, color: 'rgba(255,255,255,0.65)', margin: '0 0 24px' }}>
            Our students grow in a space where tutors care, questions are welcomed, and confidence is built one relationship at a time.
          </p>
          <button className="da-ebtn">DISCOVER OUR ENVIRONMENT â†’</button>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <video ref={videoRef} autoPlay muted loop playsInline src="/media/jenseriamy.mp4"
            style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,24,0.28)' }} />
        </div>
      </div>
    );
  }

  // â”€â”€ DESKTOP: scroll-driven â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div ref={outerRef} style={{ height: '260vh', position: 'relative', background: '#06111F' }}>
      <style>{envCSS}</style>

      {/* Sticky panel â€” position:relative so absolute children anchor to it */}
      <div style={{
        position: 'sticky' as const, top: 0, height: '100vh',
        background: '#06111F',
      }}>

        {/* Ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '700px', height: '480px',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* â”€â”€ MAIN VIDEO CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* position:absolute; inset:0 â†’ always exactly 100vw Ã— 100vh  */}
        {/* scale grows from 0.40 â†’ 1.0; transformOrigin near bottom   */}
        {/* means it expands upward from lower-centre of screen         */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          scale: cardScale,
          opacity: cardOp,
          filter: cardFi,
          borderRadius: cardRadS,
          overflow: 'hidden',
          transformOrigin: 'center 82%',
          zIndex: 5,
          boxShadow: '0 24px 72px rgba(0,0,0,0.55)',
        }}>
          <video ref={videoRef} autoPlay muted loop playsInline src="/media/jenseriamy.mp4"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <motion.div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(4,10,24,0.28)',
            opacity: overlayOp, pointerEvents: 'none',
          }} />
        </motion.div>

        {/* â”€â”€ SUPPORT PHOTO CARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* z-index 8 (above video card z:5) so they appear on top    */}
        {SCARDS.map(card => (
          <motion.div key={card.id} className="da-scard" style={{
            ...card.pos,
            width: card.w,
            aspectRatio: card.ratio,
            rotate: card.rotate,
            scale: sScl,
            opacity: sOp,
            zIndex: 8,
          }}>
            <img src={card.src} alt={card.alt} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </motion.div>
        ))}

        {/* â”€â”€ TEXT OVERLAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* z-index 20; fades up at 20â€“40% scroll progress            */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 20, pointerEvents: 'none',
        }}>
          <motion.div style={{
            textAlign: 'center' as const,
            padding: '0 clamp(24px, 5vw, 48px)',
            maxWidth: 'clamp(320px, 56vw, 660px)',
            opacity: textOp,
            y: textY,
          }}>
            <p style={{ fontFamily: sans, fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 18px' }}>
              DA Environment
            </p>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(1.85rem, 3.2vw, 3.2rem)', lineHeight: 1.11, letterSpacing: '-0.020em', color: '#FAFAF8', margin: '0 0 20px' }}>
              More than tutoring.<br />
              <em style={{ fontStyle: 'italic', color: C.gold }}>A place where students feel known.</em>
            </h2>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 'clamp(0.84rem, 1.12vw, 0.96rem)', lineHeight: 1.82, color: 'rgba(255,255,255,0.68)', margin: '0 0 30px' }}>
              Our students grow in a space where tutors care deeply,<br />
              questions are welcomed, and confidence is built one relationship at a time.
            </p>
            <button className="da-ebtn" style={{ pointerEvents: 'auto' }}>
              DISCOVER OUR ENVIRONMENT â†’
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
};



// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CINEMATIC QUOTE â€” blur-reveal text animation
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const CinematicQuoteSection = () => {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      style={{
        background: '#06111F',
        padding: 'clamp(80px, 11vw, 140px) clamp(24px, 6vw, 80px)',
        textAlign: 'center' as const,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes cq-reveal {
          0%   { opacity: 0; filter: blur(18px); transform: translateY(16px); }
          30%  { opacity: 0.85; filter: blur(6px); transform: translateY(6px); }
          65%  { filter: blur(1px); transform: translateY(1px); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes cq-glow {
          0%   { text-shadow: none; }
          22%  { text-shadow: 0 0 80px rgba(212,175,55,0.28), 0 0 28px rgba(255,255,255,0.14); }
          55%  { text-shadow: 0 0 22px rgba(212,175,55,0.08); }
          100% { text-shadow: none; }
        }
        @keyframes cq-shimmer-sweep {
          0%   { transform: translateX(-130%); }
          100% { transform: translateX(230%); }
        }
        @keyframes cq-line-grow {
          0%   { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes cq-caption-in {
          0%   { opacity: 0; letter-spacing: 0.40em; }
          100% { opacity: 1; letter-spacing: 0.24em; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cq-heading { animation: none !important; opacity: 1 !important; filter: none !important; transform: none !important; }
          .cq-line    { animation: none !important; opacity: 1 !important; transform: none !important; }
          .cq-caption { animation: none !important; opacity: 1 !important; letter-spacing: 0.24em !important; }
          .cq-shimmer { display: none !important; }
        }
      `}</style>

      {/* Ambient gold orb */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '15%', left: '50%',
        transform: 'translateX(-50%)',
        width: '700px', height: '320px',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '880px', margin: '0 auto', position: 'relative' }}>

        {/* Quote */}
        <div style={{ position: 'relative' }}>
          <h2
            className="cq-heading"
            style={{
              fontFamily: serif,
              fontWeight: 400,
              fontSize: 'clamp(2.0rem, 4.0vw, 3.9rem)',
              lineHeight: 1.18,
              letterSpacing: '-0.022em',
              color: '#F8F6F0',
              margin: '0 0 44px',
              ...(inView ? {
                animation: 'cq-reveal 1.65s cubic-bezier(0.22,1,0.36,1) both, cq-glow 1.9s ease-out both',
              } : {
                opacity: 0,
                filter: 'blur(18px)',
                transform: 'translateY(16px)',
              }),
            }}
          >
            More than tutoring.<br />
            <em style={{ fontStyle: 'italic', color: C.gold }}>
              A place where students feel known.
            </em>
          </h2>

          {/* Shimmer sweep â€” passes over text once at ~0.85s */}
          {inView && (
            <div
              className="cq-shimmer"
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                bottom: '44px',
                pointerEvents: 'none',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0, bottom: 0,
                width: '38%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.09) 35%, rgba(212,175,55,0.13) 52%, rgba(255,255,255,0.07) 68%, transparent 100%)',
                animation: 'cq-shimmer-sweep 1.0s 0.88s cubic-bezier(0.4,0,0.2,1) forwards',
              }} />
            </div>
          )}
        </div>

        {/* Gold accent line */}
        <div
          className="cq-line"
          style={{
            width: '68px', height: '1px',
            background: `linear-gradient(90deg, transparent, ${C.gold} 40%, ${C.goldL} 60%, transparent)`,
            margin: '0 auto 28px',
            transformOrigin: 'center',
            ...(inView ? {
              animation: 'cq-line-grow 0.85s 1.05s cubic-bezier(0.22,1,0.36,1) both',
            } : {
              opacity: 0,
              transform: 'scaleX(0)',
            }),
          }}
        />

        {/* Caption */}
        <p
          className="cq-caption"
          style={{
            fontFamily: sans,
            fontSize: '0.58rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.38)',
            margin: 0,
            ...(inView ? {
              animation: 'cq-caption-in 1.1s 1.20s cubic-bezier(0.22,1,0.36,1) both',
            } : {
              opacity: 0,
              letterSpacing: '0.40em',
            }),
          }}
        >
          SUPPORTIVE ENVIRONMENT&nbsp;&nbsp;â€¢&nbsp;&nbsp;DA TUITION
        </p>

      </div>
    </section>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  REVIEWS â€” premium vertical success story cards
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const CAROUSEL_REVIEWS = [
  {
    id: 'cr-1',
    subject: 'English',
    category: 'HSC English',
    author: 'Katelin Trinh',
    yearLevel: 'Year 12',
    result: { before: 'Rank 15th', after: 'Rank 6th' },
    outcomes: ['Band 5â€“6', 'Essay Skills', 'Confidence'],
    preview: "From 15th to 6th in my final HSC ranking. Miss Jenny didn't just lift my marks â€” she gave me a genuine love for the subject.",
    pullQuote: "Miss Jenny didn't just lift my marks. She gave me a genuine love for the subject.",
    story: "I am so grateful for DA Tuition for helping me improve my English results and boosting my confidence in the subject. My tutor Ms Jenny has been exceptionally patient, kind, knowledgeable and always willing to go above and beyond for her students to succeed.\n\nThanks to her, I had a drastic improvement in my assessment rank, moving from 15th to 6th in my final HSC assessment, and I received Band 5â€“6 across all my English assignments. Beyond academics, Ms Jenny also inspired me to develop a genuine passion for English.\n\nThe staff are incredibly friendly and supportive, and the learning environment is excellent. Highly recommended to anyone looking to excel.",
    whyItWorked: [
      { n: '01', point: 'Personalised essay coaching', detail: 'Every draft was reviewed with targeted feedback on thesis clarity, textual evidence, and voice â€” not generic advice.' },
      { n: '02', point: 'Progress tracked against the cohort', detail: 'Ranking was monitored regularly so adjustments could be made before each assessment, not after it.' },
      { n: '03', point: 'Genuine subject connection', detail: 'When a student enjoys what they are studying, results follow naturally. Miss Jenny made English compelling.' },
    ],
    learningFormat: 'Small Group Â· HSC English',
    newTags: ['HSC Success', 'Band 6 Results', 'English', 'Teacher Support'],
  },
  {
    id: 'cr-2',
    subject: 'Mathematics',
    category: 'HSC Mathematics',
    author: 'Bryant Lam',
    yearLevel: 'Year 12',
    result: { before: 'Confidence gaps', after: '5 Band 6s' },
    outcomes: ['Five Band 6s', 'ATAR Achieved', 'Confidence'],
    preview: "Eight years at DA. Five Band 6s in the HSC. The tutors here help you fall in love with learning.",
    pullQuote: "Ms Amanda's passion for mathematics was infectious and made me hungry to improve.",
    story: "Being a student at DA for the last 8 years has been an absolute life changer. DA has guided and supported me to achieve academic excellence â€” first through the selective school program, then all the way through the HSC.\n\nDespite having confidence issues in my academic abilities, these tutors drew out my best ability and motivated me to strive for success. Ms Amanda's passion for mathematics was infectious and made me hungry to improve.\n\nThrough DA I achieved five Band 6s in the HSC exam and the ATAR that made my parents proud. If you are looking for a place to develop a strong foundation and achieve your maximum potential, DA is the place for you.",
    whyItWorked: [
      { n: '01', point: 'Confidence built before performance', detail: 'Bryant arrived with self-doubt. The focus was first on belief, then on technique â€” in that order.' },
      { n: '02', point: 'Eight years of accumulated understanding', detail: 'Long-term relationships mean tutors know how each student learns, not just what they need to know.' },
      { n: '03', point: 'Selective school foundation', detail: 'The rigour of selective preparation gave Bryant a depth of mathematical reasoning that made the HSC manageable.' },
    ],
    learningFormat: 'Small Group Â· HSC Mathematics',
    newTags: ['HSC Success', 'Band 6 Results', 'Mathematics', 'Confidence'],
  },
  {
    id: 'cr-3',
    subject: 'General',
    category: '8 Years at DA',
    author: 'Lisa Vu',
    yearLevel: 'Year 12',
    result: { before: 'Below average', after: 'Bright future' },
    outcomes: ['Mindset Shift', 'Academic Growth', '8 Years at DA'],
    preview: "I began as a below-average student who hated school. Eight years later, I leave with a bright future and a gratitude I will carry for life.",
    pullQuote: "DA staff are not just teachers but family â€” promoters of success who bring out the best in every individual.",
    story: "DA Tuition is not just an educational environment but a place of upbringing and encouragement. As a committed student of 8 years, DA staff are not just teachers but family â€” promoters of success who bring out the best in every individual.\n\nInitially, I was a below-average student who did not concern myself with success. By being with Miss Linda, she advanced my understanding of what it means to be prosperous, guiding me through hard times by not only lifting my grades but also my perspective.\n\nI am now looking forward to a bright future, in gratitude and appreciation to all the tutors I have had.",
    whyItWorked: [
      { n: '01', point: 'The whole child, not just the grade', detail: 'Miss Linda worked on Lisa\'s perspective and self-belief long before the marks reflected it.' },
      { n: '02', point: 'Consistency across eight years', detail: 'Trust is built over time. The relationship Lisa had with her tutors made honest conversations about struggle possible.' },
      { n: '03', point: 'A community that holds high expectations', detail: 'Being surrounded by students who care about learning shifts what a student believes is possible for themselves.' },
    ],
    learningFormat: 'Small Group Â· Multi-Year Program',
    newTags: ['Confidence', 'Academic Growth', 'Parent Feedback'],
  },
  {
    id: 'cr-4',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Emily Nguyen',
    yearLevel: 'Year 9',
    result: { before: 'Above average', after: '2nd in Grade' },
    outcomes: ['100% on Exam', '2nd in Grade', 'Confidence'],
    preview: "After joining DA, I now achieve marks in the high 90s â€” 2nd in my grade, and 100% on my most recent exam.",
    pullQuote: "My confidence in learning has improved significantly and I am now determined to achieve above 90% for all my tests.",
    story: "I've been going to DA Tuition since Year 5, and I can't explain how much this place has helped me improve academically throughout the years.\n\nWith the help of Miss Linda and Miss Lai, my test results are now in the high 90s â€” including 2nd place in maths in my grade and 100% on my recent test.\n\nMy confidence in learning has improved significantly and I'm now determined to achieve above 90% for all my tests. I can't thank DA and the teachers enough for their expertise and engaging lessons.",
    whyItWorked: [
      { n: '01', point: 'Early foundations matter', detail: 'Joining in Year 5 allowed DA to build mathematical reasoning from the ground up â€” not patch it under pressure.' },
      { n: '02', point: 'Targets set above school expectations', detail: 'Emily was always working slightly ahead of her class, which meant assessments felt familiar rather than stressful.' },
      { n: '03', point: 'Confidence as a measurable outcome', detail: 'The shift from "above average" to "top of grade" began with Emily believing the higher result was within reach.' },
    ],
    learningFormat: 'Small Group Â· Primary & High School',
    newTags: ['Academic Growth', 'Mathematics', 'Confidence', 'Teacher Support'],
  },
  {
    id: 'cr-5',
    subject: 'English',
    category: 'HSC English',
    author: 'Lillian Pham',
    yearLevel: 'Year 12',
    result: { before: 'Struggling', after: 'Rank jump' },
    outcomes: ['Essay Writing', 'Motivation', 'Rank Improved'],
    preview: "English was my least favourite subject. Within weeks of joining DA, my marks improved dramatically and I jumped a significant number of ranks.",
    pullQuote: "She makes classes enjoyable, and I am more motivated than ever to do well in English.",
    story: "I had Miss Selina from the second term of my HSC year and I wish I had joined sooner. Prior to joining DA, English was my least favourite subject and my marks definitely reflected that.\n\nAlthough it had only been several weeks since I started, my marks for the second assessment task improved dramatically and I jumped up a significant number of ranks in my cohort.\n\nMy essay writing and creative writing skills have improved so much since I started. She makes classes enjoyable, and I am more motivated than ever to do well in English.",
    whyItWorked: [
      { n: '01', point: 'Quick diagnosis of the real problem', detail: 'Lillian\'s marks reflected disengagement, not lack of ability. Miss Selina addressed the root cause â€” not the symptom.' },
      { n: '02', point: 'Writing skills built systematically', detail: 'Essay structure and creative voice were developed in parallel, lifting both assessment types simultaneously.' },
      { n: '03', point: 'Motivation as the leading indicator', detail: 'When Lillian began enjoying English classes, consistent effort followed â€” and results caught up quickly.' },
    ],
    learningFormat: 'Small Group Â· HSC English',
    newTags: ['HSC Success', 'English', 'Teacher Support', 'Academic Growth'],
  },
  {
    id: 'cr-6',
    subject: 'General',
    category: '9 Years at DA',
    author: 'Connor Mangala',
    yearLevel: 'Year 12',
    result: { before: 'Unknown potential', after: 'Dream University' },
    outcomes: ['ATAR Achieved', 'Dream Course', '9 Years at DA'],
    preview: "I'm now enrolled in my dream university course â€” results I never knew I could achieve. Nine years of DA made that possible.",
    pullQuote: "Without them I wouldn't have received the marks and ATAR I never knew I could achieve.",
    story: "I am always so grateful for all the tutors who have seen me grow over the past 9 years I have been at DA. Specifically, I want to thank Miss Lai and Mr Bunsea for helping me realise that I needed to take my learning seriously in my senior years â€” that my future self was depending on me.\n\nWithout them I wouldn't have received the marks and ATAR I never knew I could achieve, and I wouldn't have been accepted into my dream university course.",
    whyItWorked: [
      { n: '01', point: 'A timely shift in perspective', detail: 'Miss Lai and Mr Bunsea reframed senior school not as pressure, but as an investment in the version of Connor he wanted to become.' },
      { n: '02', point: 'Nine years of accumulated trust', detail: 'Connor\'s tutors knew exactly how he learned, what motivated him, and where his ceiling actually was.' },
      { n: '03', point: 'ATAR as a means, not an end', detail: 'The goal was always the dream course. Keeping that distinction clear kept Connor focused on what actually mattered.' },
    ],
    learningFormat: 'Small Group Â· HSC Preparation',
    newTags: ['HSC Success', 'Confidence', 'Academic Growth'],
  },
  {
    id: 'cr-7',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Diana Nguyen',
    yearLevel: 'Year 10',
    result: { before: 'C Average', after: '94% Â· 1st Class' },
    outcomes: ['94% Score', '1st in Class', 'Grade Jump'],
    preview: "Mr Bunsea took me from a C average to 94% and first in my class. I've never been more grateful for a teacher.",
    pullQuote: "He made the most difficult concepts so easy to understand. I finally believed maths was something I could be good at.",
    story: "Before going to DA, I was a C average student in maths. After going to DA and having Mr Bunsea as my tutor, he made the most difficult concepts so easy to understand.\n\nIn my first term with him, he pulled me from a C to a B grade. I continued with him and finally achieved 94% on my latest maths exam â€” first in my class.\n\nI really appreciate his dedication. The teachers at DA are extremely hardworking and caring, always willing to go out of their way to make sure students get the results they deserve.",
    whyItWorked: [
      { n: '01', point: 'Conceptual clarity over memorisation', detail: 'Mr Bunsea never moved on until Diana understood the reasoning behind each method â€” not just the steps.' },
      { n: '02', point: 'Grade-by-grade progression', detail: 'C to B in one term, then B to A. Staged milestones made the journey feel achievable rather than overwhelming.' },
      { n: '03', point: 'A tutor who refused to accept the ceiling', detail: 'Diana was categorised as a C student. Mr Bunsea simply didn\'t accept that as the end of the story.' },
    ],
    learningFormat: 'Small Group Â· Mathematics',
    newTags: ['Academic Growth', 'Mathematics', 'Teacher Support'],
  },
  {
    id: 'cr-8',
    subject: 'General',
    category: '4 Years at DA',
    author: 'Tiffany Lang',
    yearLevel: 'Year 12',
    result: { before: 'Multiple centres', after: 'Transformed' },
    outcomes: ['Confidence', 'Love of Learning', '4 Years at DA'],
    preview: "Having been to many tutoring centres before DA, the difference is clear. My results, confidence, and love of learning have all transformed.",
    pullQuote: "Ms Lai, Mr Danny and Mr Bunsea made my time at DA the most enjoyable and memory-making experience.",
    story: "Having gone to many other tutoring places before DA Tuition, I have seen my results improve over my 4 years of being here.\n\nMs Lai, Mr Danny and Mr Bunsea have stuck with me to the end of my high schooling years, providing me with the support and knowledge to excel in my subjects, as well as making my time here the most enjoyable and memory-making experience.\n\nI truly think that DA Tuition is a great recommendation for any student.",
    whyItWorked: [
      { n: '01', point: 'Continuity across multiple tutors', detail: 'Tiffany worked with three tutors over four years â€” each transition was smooth because DA\'s culture and standards are consistent.' },
      { n: '02', point: 'What other centres couldn\'t provide', detail: 'The difference wasn\'t just academic â€” it was the quality of relationships and the genuine investment in Tiffany as a person.' },
      { n: '03', point: 'An environment worth returning to', detail: 'Four years is a choice made annually. Tiffany kept choosing DA because it kept working.' },
    ],
    learningFormat: 'Small Group Â· Multi-Year Program',
    newTags: ['Confidence', 'Academic Growth', 'Parent Feedback', 'Study Habits'],
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PLACEHOLDER REVIEWS â€” replace each entry with a verified
  // testimonial before going live. All content below is sample
  // data written to match DA's voice and ensure every filter
  // displays a full grid of 8 cards.
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // PLACEHOLDER pr-01
  {
    id: 'pr-01',
    subject: 'English',
    category: 'HSC English Advanced',
    author: 'Tyler Pham',
    yearLevel: 'Year 12',
    result: { before: 'Band 4', after: 'Band 6' },
    outcomes: ['Band 6 Essay', 'Rank Improved', 'HSC Success'],
    preview: "I came to DA with a Band 4 essay average and left with a Band 6 in the HSC. Miss Jenny's feedback was the most useful I had received in six years of schooling.",
    pullQuote: "The most useful feedback I had received in six years of schooling.",
    story: "My writing had always been technically acceptable but emotionally flat. After joining DA in Term 2 of Year 12, Miss Jenny helped me find my voice without abandoning the rigour the markers expected.\n\nBy my final HSC exam, I was writing with genuine confidence. Band 6 felt earned, not lucky.",
    whyItWorked: [
      { n: '01', point: 'Voice and structure taught together', detail: 'Most tuition focuses on one or the other. Miss Jenny worked on both simultaneously, which accelerated improvement.' },
      { n: '02', point: 'Timed writing practice', detail: 'Each session included timed paragraphs so exam conditions felt familiar, not frightening.' },
      { n: '03', point: 'Targeted module coaching', detail: 'Specific attention to weaker modules lifted the overall band result.' },
    ],
    learningFormat: 'Small Group Â· HSC English',
    newTags: ['Band 6 Results', 'HSC Success', 'English', 'Teacher Support'],
  },

  // PLACEHOLDER pr-02
  {
    id: 'pr-02',
    subject: 'Mathematics',
    category: 'HSC Mathematics Advanced',
    author: 'Amy Vo',
    yearLevel: 'Year 12',
    result: { before: 'Below 80%', after: 'Band 6' },
    outcomes: ['Band 6 Maths', 'ATAR Achieved', 'Exam Confidence'],
    preview: "I was sitting in the high 70s when I started at DA. By the HSC I had a Band 6 in Mathematics Advanced. The tutors understood exactly where my gaps were and closed them one by one.",
    pullQuote: "The tutors understood exactly where my gaps were and closed them one by one.",
    story: "Mathematics had always been a subject I felt I could do â€” but not excel at. DA changed that. The team identified the specific topics costing me marks and gave me a clear path forward.\n\nBy the HSC, I wasn't just prepared â€” I was genuinely confident. The Band 6 reflected that.",
    whyItWorked: [
      { n: '01', point: 'Gap analysis before drilling', detail: 'Rather than restarting from scratch, DA identified exactly which topics were costing marks and focused there.' },
      { n: '02', point: 'Past paper exposure', detail: 'Systematic work through HSC papers meant Amy recognised question types and knew instinctively how to approach them.' },
      { n: '03', point: 'Confidence built through small wins', detail: 'Each mastered topic added to a growing sense of readiness. By exam day, Amy felt in control.' },
    ],
    learningFormat: 'Small Group Â· HSC Mathematics',
    newTags: ['Band 6 Results', 'HSC Success', 'Mathematics', 'Confidence'],
  },

  // PLACEHOLDER pr-03
  {
    id: 'pr-03',
    subject: 'Science',
    category: 'Science',
    author: 'Sophie Le',
    yearLevel: 'Year 11',
    result: { before: 'C grade', after: 'Top 10 in cohort' },
    outcomes: ['Cohort Top 10', 'Lab Reports', 'Study Skills'],
    preview: "Science had never clicked for me â€” until DA. Within a term I was in the top 10 of my cohort. My parents noticed the difference before I did.",
    pullQuote: "Science had never clicked for me â€” until DA.",
    story: "I had always understood concepts in class but struggled to apply them in assessments. DA helped me see the pattern in how science questions are structured and how to respond to them.\n\nMy parents were the first to notice something had shifted â€” I was actually talking about science at home.",
    whyItWorked: [
      { n: '01', point: 'Assessment structure decoded', detail: 'Sophie learned how science markers think â€” which unlocked her ability to express what she already understood.' },
      { n: '02', point: 'Lab report technique', detail: 'A common weakness was transformed into a consistent strength with targeted feedback on report structure.' },
      { n: '03', point: 'Parent-visible transformation', detail: 'When students begin discussing learning at home, it is a reliable sign that genuine engagement has taken hold.' },
    ],
    learningFormat: 'Small Group Â· Science',
    newTags: ['Science', 'Study Habits', 'Teacher Support', 'Parent Feedback'],
  },

  // PLACEHOLDER pr-04
  {
    id: 'pr-04',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'James Chen',
    yearLevel: 'Year 10',
    result: { before: 'Struggling', after: 'A grade' },
    outcomes: ['A Grade', 'Exam Confidence', 'Daily Practice'],
    preview: "I was close to giving up on maths when I started at DA. Within a term I had an A grade. The difference was a tutor who refused to let me settle for less.",
    pullQuote: "The difference was a tutor who refused to let me settle for less.",
    story: "Year 10 maths felt like a wall I couldn't get over. Every assessment knocked me back. At DA, the tutor rebuilt the way I thought about problems â€” not just reteaching what I had missed.\n\nAn A grade at the end of term felt impossible in January. By June, it felt deserved.",
    whyItWorked: [
      { n: '01', point: 'Thinking rebuilt, not just content re-taught', detail: 'James was taught how to approach problems methodically â€” which had more impact than any individual topic revision.' },
      { n: '02', point: 'Daily practice habit installed', detail: 'Consistent short practice sessions between classes compounded rapidly into visible results.' },
      { n: '03', point: 'A tutor who held the standard', detail: 'Accepting "good enough" was never on the table. That refusal to lower the ceiling changed what James believed was possible.' },
    ],
    learningFormat: 'Small Group Â· Mathematics',
    newTags: ['Mathematics', 'Confidence', 'Study Habits', 'Academic Growth'],
  },

  // PLACEHOLDER pr-05
  {
    id: 'pr-05',
    subject: 'English',
    category: 'HSC English',
    author: 'Rachel Nguyen',
    yearLevel: 'Year 12',
    result: { before: 'Rank 20th', after: 'Rank 5th' },
    outcomes: ['Band 6', 'Rank Jump', 'Creative Writing'],
    preview: "English was something I endured rather than loved. DA helped me move from 20th to 5th in my cohort â€” and for the first time I actually enjoyed the process.",
    pullQuote: "For the first time I actually enjoyed the process of studying English.",
    story: "I had never enjoyed English. At DA, that changed. My tutor helped me find arguments I genuinely believed in and express them in a way that was both academically correct and genuinely mine.\n\nMoving from 20th to 5th in cohort ranking was the result â€” but the bigger change was that I wanted to keep writing.",
    whyItWorked: [
      { n: '01', point: 'Genuine engagement came first', detail: 'When students argue for ideas they believe in, their writing improves naturally. DA focused first on finding Rachel\'s voice.' },
      { n: '02', point: 'Creative writing treated seriously', detail: 'The creative component was coached with the same rigour as analytical writing â€” not treated as secondary.' },
      { n: '03', point: 'Ranking as a by-product', detail: 'The rank improvement came from genuine improvement in the writing, not from gaming the assessment.' },
    ],
    learningFormat: 'Small Group Â· HSC English',
    newTags: ['Band 6 Results', 'English', 'HSC Success', 'Confidence'],
  },

  // PLACEHOLDER pr-06
  {
    id: 'pr-06',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'Linda Tran (Parent)',
    yearLevel: 'Year 8',
    result: { before: 'Disengaged', after: 'Loves learning' },
    outcomes: ['Attitude Shift', 'Self-Motivated', 'Confidence'],
    preview: "My daughter used to dread homework. After two months at DA she was asking to go in early. The change in her attitude happened faster than I ever imagined.",
    pullQuote: "After two months she was asking to go in early. I didn't expect it to happen so fast.",
    story: "My daughter had switched off from school by Year 8. She wasn't struggling academically â€” she was simply disengaged. I brought her to DA hoping for a grade improvement.\n\nWhat I got was a complete shift in her relationship with learning. She talks about her tutor. She asks questions. She sets up her own study. The grades followed.",
    whyItWorked: [
      { n: '01', point: 'The relationship came before the results', detail: 'DA tutors invested in understanding who Linda\'s daughter was as a learner before focusing on what she needed to know.' },
      { n: '02', point: 'Engagement as the real goal', detail: 'When a student begins to enjoy learning, academic results improve as a natural consequence â€” not as the primary aim.' },
      { n: '03', point: 'A parent witness to the change', detail: 'The most reliable signal that something genuine has occurred is when a parent notices the change without being told.' },
    ],
    learningFormat: 'Small Group Â· Year 8',
    newTags: ['Parent Feedback', 'Confidence', 'Teacher Support', 'Academic Growth'],
  },

  // PLACEHOLDER pr-07
  {
    id: 'pr-07',
    subject: 'Mathematics',
    category: 'HSC Mathematics Extension 1',
    author: 'Kevin Liu',
    yearLevel: 'Year 12',
    result: { before: 'E2', after: 'E4' },
    outcomes: ['E4 Extension 1', 'Problem Solving', 'Exam Readiness'],
    preview: "Extension 1 Maths was humbling me. At DA I went from an E2 to an E4 by the HSC. The tutor made the hardest questions feel methodical rather than mysterious.",
    pullQuote: "The hardest questions started to feel methodical rather than mysterious.",
    story: "Extension 1 Mathematics is unforgiving. I was working hard but not smartly. At DA, the approach to complex problems â€” breaking them into logical steps â€” changed how I saw the entire subject.\n\nBy the HSC, I wasn't hoping for an E4. I was expecting one.",
    whyItWorked: [
      { n: '01', point: 'Logical decomposition of hard problems', detail: 'Kevin learned to break Extension problems into sub-steps â€” transforming how manageable even unfamiliar questions felt.' },
      { n: '02', point: 'Proof and reasoning developed', detail: 'Understanding why a method works builds resilience when a question doesn\'t match the expected pattern.' },
      { n: '03', point: 'Expectation shifted from hope to confidence', detail: 'By exam day the E4 was an expectation, not a hope. That mindset shift produced the result.' },
    ],
    learningFormat: 'Small Group Â· HSC Mathematics Extension',
    newTags: ['Band 6 Results', 'Mathematics', 'HSC Success', 'Study Habits'],
  },

  // PLACEHOLDER pr-08
  {
    id: 'pr-08',
    subject: 'Science',
    category: 'Science',
    author: 'Mei Zhang',
    yearLevel: 'Year 9',
    result: { before: 'Below average', after: 'Merit Award' },
    outcomes: ['Merit Award', 'Science Excellence', 'Confidence'],
    preview: "I received a merit award for Science at the end of Year 9 â€” something that would have seemed impossible at the start of the year. DA helped me find a genuine love for the subject.",
    pullQuote: "A merit award in Science at the end of Year 9 â€” something that would have seemed impossible at the start.",
    story: "Science had always felt abstract to me â€” disconnected from anything real. At DA my tutor helped me see the connections between concepts and the world outside the classroom.\n\nThe merit award at year end surprised my school teachers. It didn't surprise me â€” I had felt the improvement building.",
    whyItWorked: [
      { n: '01', point: 'Real-world connections made explicit', detail: 'Abstract scientific concepts became graspable when linked to observable phenomena Mei already understood.' },
      { n: '02', point: 'Curiosity nurtured before content', detail: 'A student who wants to know why something works will learn the how naturally. DA built the curiosity first.' },
      { n: '03', point: 'Consistent recognition of progress', detail: 'Small improvements were acknowledged and built upon â€” creating momentum rather than allowing plateaus.' },
    ],
    learningFormat: 'Small Group Â· Science',
    newTags: ['Science', 'Academic Growth', 'Teacher Support', 'Confidence'],
  },

  // PLACEHOLDER pr-09
  {
    id: 'pr-09',
    subject: 'Mathematics',
    category: 'Parent Testimonial',
    author: 'Thomas Nguyen (Parent)',
    yearLevel: 'Year 10',
    result: { before: 'No study routine', after: 'Self-directed learner' },
    outcomes: ['Study Routine', 'Grade Improvement', 'Independence'],
    preview: "My son had no study routine at all. DA didn't just help with Maths â€” they installed habits that now carry across every subject. He now studies without being asked.",
    pullQuote: "He now studies without being asked. That is the most significant change DA has given us.",
    story: "The academic results were important â€” and they improved significantly. But what struck us as parents was the transformation in our son's habits and self-direction.\n\nHe organises his week, tracks his assessments, and asks for help before problems become crises. DA gave him a structure he has made his own.",
    whyItWorked: [
      { n: '01', point: 'Structure taught alongside content', detail: 'DA tutors modelled how to organise study, track progress, and plan ahead â€” not just how to solve mathematical problems.' },
      { n: '02', point: 'Independence as the goal', detail: 'The aim was always for students to not need DA â€” to have the skills and habits to succeed independently. That aim drives the teaching.' },
      { n: '03', point: 'Parent-visible transformation', detail: 'When changes cross from school into home life without prompting, they are likely to be lasting rather than performance-driven.' },
    ],
    learningFormat: 'Small Group Â· Mathematics',
    newTags: ['Parent Feedback', 'Study Habits', 'Academic Growth', 'Mathematics'],
  },

  // PLACEHOLDER pr-10
  {
    id: 'pr-10',
    subject: 'Science',
    category: 'HSC Biology',
    author: 'Jessica Lam',
    yearLevel: 'Year 12',
    result: { before: 'Band 3â€“4', after: 'Band 5â€“6' },
    outcomes: ['Band 5â€“6', 'HSC Biology', 'Study Strategy'],
    preview: "My Biology marks were inconsistent and I couldn't understand why. DA helped me see the pattern. I went from a Band 3â€“4 average to Band 5â€“6 by the HSC.",
    pullQuote: "DA helped me see the pattern I had been missing â€” and once I saw it, every assessment made sense.",
    story: "Biology had always frustrated me. I would study for hours and still produce B or C work. At DA, my tutor helped me understand how HSC Biology questions are structured â€” and why my answers kept missing the mark.\n\nThe Band 5â€“6 result was less a surprise than a confirmation of what I had worked toward.",
    whyItWorked: [
      { n: '01', point: 'Question unpacking as a core skill', detail: 'Jessica learned to identify what each question was really asking â€” which transformed how she structured her responses.' },
      { n: '02', point: 'Syllabus dot points as the map', detail: 'Every revision session was built around the syllabus, ensuring no marks were lost through incomplete coverage.' },
      { n: '03', point: 'Consistency addressed directly', detail: 'The inconsistency came from gaps in understanding, not effort. Addressing those gaps made results predictable.' },
    ],
    learningFormat: 'Small Group Â· HSC Science',
    newTags: ['Science', 'HSC Success', 'Academic Growth', 'Teacher Support'],
  },

  // PLACEHOLDER pr-11
  {
    id: 'pr-11',
    subject: 'English',
    category: 'English',
    author: 'Sarah Kim',
    yearLevel: 'Year 11',
    result: { before: 'Average student', after: 'English Dux' },
    outcomes: ['English Dux', 'Essay Writing', 'Reading Skills'],
    preview: "I was average at English â€” never bad, never exceptional. By the end of Year 11 I was the English Dux of my school. DA changed how I thought about language itself.",
    pullQuote: "DA changed how I thought about language itself â€” not just how to write about it.",
    story: "I had always viewed English as something to survive, not something to master. At DA, that changed. My tutor helped me see texts as conversations â€” full of choices made by real authors with real intentions.\n\nWhen you read that way, writing becomes easier. By the end of Year 11 I was the English Dux. I hadn't been trying to win anything. I had just started to love the subject.",
    whyItWorked: [
      { n: '01', point: 'Texts read as conversations', detail: 'Teaching Sarah to see texts as authorial choices rather than content to summarise fundamentally changed how she engaged with literature.' },
      { n: '02', point: 'Love of reading before techniques', detail: 'Genuine engagement with texts produces the insights that sophisticated essays require. Technique followed naturally.' },
      { n: '03', point: 'Raising the internal standard', detail: 'When Sarah began evaluating her own work honestly, she stopped settling for acceptable and started reaching for exceptional.' },
    ],
    learningFormat: 'Small Group Â· English',
    newTags: ['English', 'Study Habits', 'Academic Growth', 'Confidence'],
  },

  // PLACEHOLDER pr-12
  {
    id: 'pr-12',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'David Tran (Parent)',
    yearLevel: 'Year 12',
    result: { before: 'Worried about HSC', after: '4 Band 6s' },
    outcomes: ['4 Band 6s', 'ATAR Achieved', 'Peace of Mind'],
    preview: "We were deeply worried about our daughter's HSC. DA gave us four Band 6s â€” and gave us back our peace of mind during the hardest year of her schooling.",
    pullQuote: "DA gave us four Band 6s â€” and gave us back our peace of mind.",
    story: "The HSC year is stressful for the entire family. We enrolled our daughter at DA after her Year 11 results came back lower than expected. From the first session, the tutors gave us a clear sense of what was needed and a plan to achieve it.\n\nFour Band 6s at the end of Year 12. We are deeply grateful.",
    whyItWorked: [
      { n: '01', point: 'Calm, structured plan given to the family', detail: 'Anxiety is reduced when parents see a clear strategy. DA provided that â€” and followed through on every step.' },
      { n: '02', point: 'Multiple subject coverage', detail: 'Coordinated tuition across subjects meant no one area fell behind while another improved.' },
      { n: '03', point: 'Progress communicated to parents', detail: 'Keeping parents informed helped the whole household stay calm and focused during a high-pressure year.' },
    ],
    learningFormat: 'Small Group Â· HSC Multi-Subject',
    newTags: ['Parent Feedback', 'HSC Success', 'Band 6 Results', 'Teacher Support'],
  },

  // PLACEHOLDER pr-13
  {
    id: 'pr-13',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Alex Nguyen',
    yearLevel: 'Year 7',
    result: { before: 'Year 5 maths level', after: 'Top of Year 7' },
    outcomes: ['Top of Year 7', 'Foundation Fixed', 'Confidence'],
    preview: "I started at DA in Year 7 at roughly a Year 5 maths level. Within 18 months I was the top student in my class. The tutors found the gaps I didn't know existed.",
    pullQuote: "The tutors found the gaps I didn't know I had â€” and filled them so quietly I barely noticed it happening.",
    story: "I had passed every maths test at primary school but without really understanding the fundamentals. By Year 7, those cracks showed. At DA, my tutor went back to the foundations without making me feel embarrassed â€” and rebuilt from there.\n\n18 months later I was top of my class. The foundation makes everything else easier.",
    whyItWorked: [
      { n: '01', point: 'Foundation gaps identified without judgment', detail: 'Students who have "passed" without truly understanding are common. DA addressed Alex\'s gaps without making him feel behind.' },
      { n: '02', point: 'Rebuilt from first principles', detail: 'Rather than patching the gaps, the foundations were rebuilt properly â€” making every subsequent topic faster to learn.' },
      { n: '03', point: 'Confidence followed competence', detail: 'As Alex\'s actual understanding grew, his confidence grew with it â€” built on something real rather than reassurance.' },
    ],
    learningFormat: 'Small Group Â· Primary & High School',
    newTags: ['Mathematics', 'Academic Growth', 'Study Habits', 'Confidence'],
  },

  // PLACEHOLDER pr-14
  {
    id: 'pr-14',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'Olivia Ho (Parent)',
    yearLevel: 'Three children',
    result: { before: 'Uncertain futures', after: 'All three thriving' },
    outcomes: ['3 Children at DA', 'All Thriving', 'Family Trust'],
    preview: "We have had three children at DA over nine years. Each one has been treated as an individual. Each one has exceeded what we initially hoped for.",
    pullQuote: "Each child has been treated as an individual. That is rarer than it sounds.",
    story: "Our eldest started at DA in Year 5 and went through to the HSC. We enrolled our second child, then our third. Nine years later, all three have had different experiences â€” different tutors, different challenges, different outcomes. All three have thrived.\n\nDA's consistency is what gives us confidence. The values don't change. The standard doesn't drop. The care doesn't diminish.",
    whyItWorked: [
      { n: '01', point: 'Consistency across years and children', detail: 'The standard of teaching and care that Olivia\'s first child experienced was the same her third child received years later.' },
      { n: '02', point: 'Each child treated individually', detail: 'Three siblings with different learning styles were each given appropriate approaches â€” not the same programme with different names.' },
      { n: '03', point: 'Trust built over nine years', detail: 'Long-term families stay because the relationship delivers year after year. That trust is the clearest signal of consistent quality.' },
    ],
    learningFormat: 'Small Group Â· Multi-Year Family',
    newTags: ['Parent Feedback', 'Academic Growth', 'Confidence', 'Teacher Support'],
  },

  // PLACEHOLDER pr-15
  {
    id: 'pr-15',
    subject: 'Science',
    category: 'HSC Chemistry',
    author: 'Nathan Park',
    yearLevel: 'Year 12',
    result: { before: 'Band 3', after: 'Band 6' },
    outcomes: ['Band 6 Chemistry', 'HSC Science', 'Lab Excellence'],
    preview: "Chemistry was my weakest HSC subject. After six months at DA it became my highest-scoring. The transformation came from understanding the why, not just the what.",
    pullQuote: "After six months at DA, Chemistry became my highest HSC score.",
    story: "I had been memorising chemistry content without understanding it â€” which worked until it didn't. At DA, my tutor rebuilt my understanding from the conceptual foundations. Questions that had seemed random became predictable.\n\nChemistry went from my weakest HSC subject to my strongest.",
    whyItWorked: [
      { n: '01', point: 'Conceptual understanding over memorisation', detail: 'When the underlying principles are understood, chemistry questions become pattern-recognition rather than content-recall.' },
      { n: '02', point: 'Lab skills developed rigorously', detail: 'The practical component was treated with the same seriousness as the theory, benefiting both parts of the assessment.' },
      { n: '03', point: 'Band 3 to Band 6 in a single year', detail: 'A significant shift requiring both a motivated student and exactly the right teaching approach.' },
    ],
    learningFormat: 'Small Group Â· HSC Science',
    newTags: ['Science', 'Band 6 Results', 'HSC Success', 'Study Habits'],
  },

  // PLACEHOLDER pr-16
  {
    id: 'pr-16',
    subject: 'English',
    category: 'English',
    author: 'Emma Tran',
    yearLevel: 'Year 8',
    result: { before: 'Hated reading', after: 'Writing competitions' },
    outcomes: ['Writing Award', 'Reading Confidence', 'Creative Voice'],
    preview: "I genuinely hated reading. Now I enter writing competitions and win some of them. DA didn't teach me to read â€” they helped me fall in love with stories.",
    pullQuote: "DA didn't teach me to read â€” they helped me fall in love with stories.",
    story: "My parents brought me to DA hoping I would just stop failing English assessments. What happened instead was that I discovered I actually love stories â€” I just hadn't found the right ones or the right way into them.\n\nI now write for pleasure. I enter competitions. My teacher uses my essays as examples in class.",
    whyItWorked: [
      { n: '01', point: 'The right texts at the right time', detail: 'Emma\'s tutor curated texts that genuinely interested her â€” which opened up the subject rather than making it feel prescribed.' },
      { n: '02', point: 'Creative writing as an art form', detail: 'When students discover that writing is a craft they can develop, their engagement with all English work transforms.' },
      { n: '03', point: 'From reluctant reader to writer', detail: 'The progression from passive disengagement to active creative output reflects a fundamental shift in how Emma relates to language.' },
    ],
    learningFormat: 'Small Group Â· English',
    newTags: ['English', 'Teacher Support', 'Study Habits', 'Parent Feedback'],
  },

  // PLACEHOLDER pr-17
  {
    id: 'pr-17',
    subject: 'English',
    category: 'HSC English Extension',
    author: 'Caitlin Wong',
    yearLevel: 'Year 12',
    result: { before: 'Below expectation', after: 'Band E4' },
    outcomes: ['Band E4', 'Extension Essay', 'Deep Thinking'],
    preview: "Extension English was the subject I nearly dropped. DA helped me find genuine meaning in it â€” and I ended up with a Band E4 in the HSC.",
    pullQuote: "I nearly dropped Extension English. I ended up with a Band E4. DA made that possible.",
    story: "Extension 1 English is a subject that rewards deep thinking â€” but I had been approaching it as a skills exercise. My DA tutor helped me engage with the ideas rather than the techniques, and the techniques improved as a result.\n\nBy the HSC, Extension English had become the subject I was most proud of.",
    whyItWorked: [
      { n: '01', point: 'Ideas before techniques', detail: 'Extension English rewards genuine philosophical engagement. Teaching Caitlin to think deeply produced better writing than technique drills.' },
      { n: '02', point: 'Essay structure that serves the argument', detail: 'Structure was taught in service of the argument rather than as a formula â€” which is precisely what Extension markers value.' },
      { n: '03', point: 'A near-dropout became a success story', detail: 'The willingness to persist through genuine difficulty, supported by the right guidance, produced a result that surprised even Caitlin.' },
    ],
    learningFormat: 'Small Group Â· HSC English Extension',
    newTags: ['English', 'HSC Success', 'Band 6 Results', 'Academic Growth'],
  },

  // PLACEHOLDER pr-18
  {
    id: 'pr-18',
    subject: 'English',
    category: 'English',
    author: 'Daniel Huynh',
    yearLevel: 'Year 10',
    result: { before: 'Reluctant writer', after: 'Class model essays' },
    outcomes: ['Class Rep Essays', 'Confidence', 'Oral Skills'],
    preview: "I dreaded English class. At DA I found a reason to care about language. By Year 10 I was the one my teacher asked to model essays for the rest of the class.",
    pullQuote: "By Year 10 I was the one my teacher asked to model essays for the class.",
    story: "English felt performative to me â€” like I was saying what I was supposed to say rather than what I actually thought. At DA, that changed. My tutor created space for my actual perspective and showed me how to express it in ways that worked academically.\n\nThe transition from dreading English to having my essays used as class models was not something I anticipated.",
    whyItWorked: [
      { n: '01', point: 'Authentic voice developed', detail: 'Daniel\'s tutor worked with his actual perspective rather than replacing it with a "standard" academic voice â€” producing writing that felt genuine.' },
      { n: '02', point: 'Oral skills built alongside writing', detail: 'Developing the ability to articulate ideas verbally strengthened Daniel\'s written expression significantly.' },
      { n: '03', point: 'Academic credibility built from the inside', detail: 'When students discover that their own thinking has academic value, their confidence and output both change dramatically.' },
    ],
    learningFormat: 'Small Group Â· English',
    newTags: ['English', 'Confidence', 'Study Habits', 'Academic Growth'],
  },

  // PLACEHOLDER pr-19
  {
    id: 'pr-19',
    subject: 'Science',
    category: 'Science',
    author: 'Lily Phan',
    yearLevel: 'Year 9',
    result: { before: 'Failing assessments', after: 'Consistent B+' },
    outcomes: ['B+ Average', 'Science Confidence', 'Exam Skills'],
    preview: "I was failing Science assessments and couldn't understand why â€” I thought I understood the content. DA helped me see that understanding and communicating are two different skills.",
    pullQuote: "Understanding the content and communicating it in assessments are two very different skills. DA taught me both.",
    story: "I knew the science. What I couldn't do was express it in a way that earned marks. My DA tutor helped me understand exactly what science assessors are looking for and how to structure my responses accordingly.\n\nFailures became consistent B+ results â€” not because I learned more content, but because I learned how to show what I already knew.",
    whyItWorked: [
      { n: '01', point: 'Communication and comprehension separated', detail: 'Lily understood the content but couldn\'t express it in assessment format. These two skills were developed separately then integrated.' },
      { n: '02', point: 'Marker perspective taught explicitly', detail: 'Understanding what markers are looking for â€” and why â€” transformed how Lily structured every response.' },
      { n: '03', point: 'From failure to consistency', detail: 'The goal was not a single good result but reliable performance. Consistent B+ results reflected genuine mastery.' },
    ],
    learningFormat: 'Small Group Â· Science',
    newTags: ['Science', 'Confidence', 'Academic Growth', 'Study Habits'],
  },

  // PLACEHOLDER pr-20
  {
    id: 'pr-20',
    subject: 'Science',
    category: 'HSC Physics',
    author: 'Marcus Vo',
    yearLevel: 'Year 12',
    result: { before: 'D average', after: 'Band 5' },
    outcomes: ['Band 5 Physics', 'HSC Science', 'Mathematical Rigour'],
    preview: "Physics was my most feared HSC subject. DA turned it into my most confident. I went from a D average to a Band 5 by learning to love the mathematics inside the physics.",
    pullQuote: "I went from a D average to Band 5 by learning to love the mathematics inside the physics.",
    story: "I had been treating Physics as a memorisation subject â€” which doesn't work. At DA I learned to see the mathematical elegance underneath the content. The equations stopped being things to remember and started being tools to think with.\n\nThe Band 5 result in the HSC reflected a genuine change in how I understood the subject.",
    whyItWorked: [
      { n: '01', point: 'Physics as applied mathematics', detail: 'Marcus was taught to see physics equations as reasoning tools rather than memorisable formulas â€” which changed everything.' },
      { n: '02', point: 'Mathematical skills built alongside physics', detail: 'Where the mathematics was weak, it was strengthened so it could serve the physics rather than limit it.' },
      { n: '03', point: 'Fear replaced with appreciation', detail: 'The emotional relationship with a subject determines how students engage with it. Marcus left DA with genuine respect for physics.' },
    ],
    learningFormat: 'Small Group Â· HSC Science',
    newTags: ['Science', 'Band 6 Results', 'HSC Success', 'Study Habits'],
  },

  // PLACEHOLDER pr-21
  {
    id: 'pr-21',
    subject: 'Science',
    category: 'Science',
    author: 'Zoe Chen',
    yearLevel: 'Year 11',
    result: { before: 'C grade', after: 'Science Dux' },
    outcomes: ['Science Dux', 'Academic Growth', 'Lab Skills'],
    preview: "I ended Year 11 as the Dux of Science. At the start of the year I was a C student. DA gave me a way of thinking about science that changed everything.",
    pullQuote: "DA gave me a way of thinking about science that changed everything â€” including how I saw myself.",
    story: "I had always thought I was simply not a science person. DA helped me understand that science is a method of thinking, not a collection of facts. Once I understood that, my ability to approach new topics accelerated rapidly.\n\nYear 11 Dux of Science felt impossible in February. In December, it felt earned.",
    whyItWorked: [
      { n: '01', point: 'Science as a method, not a body of content', detail: 'When students understand scientific reasoning, they can approach unfamiliar content confidently rather than waiting to be taught each topic.' },
      { n: '02', point: 'Identity shift from "not a science person"', detail: 'The belief that one is not capable is often the primary barrier. Changing that belief is the most important thing a good tutor can do.' },
      { n: '03', point: 'Lab skills as a differentiator', detail: 'Excellence in the practical component consistently differentiates top-performing students from their peers.' },
    ],
    learningFormat: 'Small Group Â· Science',
    newTags: ['Science', 'Academic Growth', 'Confidence', 'Teacher Support'],
  },

  // PLACEHOLDER pr-22
  {
    id: 'pr-22',
    subject: 'Science',
    category: 'HSC Science',
    author: 'Ryan Nguyen',
    yearLevel: 'Year 12',
    result: { before: 'Inconsistent results', after: 'Band 5â€“6 both sciences' },
    outcomes: ['Band 5â€“6', 'Chemistry & Physics', 'Exam Strategy'],
    preview: "I was studying two HSC sciences and struggling to keep both on track. DA helped me develop a strategy for both â€” and I ended with Band 5â€“6 across the board.",
    pullQuote: "Managing two HSC sciences alone was overwhelming. DA made it feel structured and achievable.",
    story: "Studying both Chemistry and Physics for the HSC while keeping other subjects on track was genuinely difficult. At DA, the tutors helped me develop a study strategy that served all subjects without sacrificing any.\n\nBand 5â€“6 across both sciences felt like the result of a year of organised, intentional effort.",
    whyItWorked: [
      { n: '01', point: 'Multi-subject strategy developed', detail: 'Ryan needed a plan that worked across two sciences simultaneously. DA built that plan and helped him execute it systematically.' },
      { n: '02', point: 'Consistent results over isolated peaks', detail: 'The goal was reliable Band 5â€“6 performance rather than individual exam success â€” requiring consistent preparation all year.' },
      { n: '03', point: 'Subject-specialist tutors for each science', detail: 'Expert guidance tailored to each discipline rather than generic study advice produced distinct improvement in both subjects.' },
    ],
    learningFormat: 'Small Group Â· HSC Science',
    newTags: ['Science', 'HSC Success', 'Teacher Support', 'Study Habits'],
  },

  // â”€â”€ NEW placeholders pr-23â€“pr-42 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PLACEHOLDER pr-23 â€” Band 6 Results group
  {
    id: 'pr-23',
    subject: 'Economics',
    category: 'HSC Economics',
    author: 'Michael Tran',
    yearLevel: 'Year 12',
    result: { before: 'Band 4', after: 'Band 6' },
    outcomes: ['Band 6 Economics', 'Essay Technique', 'HSC Success'],
    preview: "I went from Band 4 to Band 6 in Economics. DA helped me understand how to structure an argument the way examiners reward.",
    pullQuote: "I finally understood what examiners wanted â€” and gave it to them.",
    story: "Economics had always confused me because I understood the theory but couldn't translate it into exam marks. At DA my tutor showed me exactly how to structure an economic argument.\n\nBand 6 in the HSC felt like a reward for learning to think as well as know.",
    whyItWorked: [
      { n: '01', point: 'Examiner perspective taught', detail: 'Understanding what markers are looking for changed how Michael structured every response.' },
      { n: '02', point: 'Data integration drilled', detail: 'Using statistics and real-world examples was practised until it became automatic.' },
      { n: '03', point: 'Essay scaffolding mastered', detail: 'A clear argumentative framework meant marks were consistent rather than unpredictable.' },
    ],
    learningFormat: 'Small Group Â· HSC Economics',
    newTags: ['Band 6 Results', 'HSC Success'],
  },

  // PLACEHOLDER pr-24 â€” HSC Success group
  {
    id: 'pr-24',
    subject: 'Legal Studies',
    category: 'HSC Legal Studies',
    author: 'Emma Liu',
    yearLevel: 'Year 12',
    result: { before: 'Band 3', after: 'Band 6' },
    outcomes: ['Band 6 Legal Studies', 'Critical Analysis', 'HSC Success'],
    preview: "Legal Studies felt like it required a different kind of thinking. DA gave me that â€” and I went from Band 3 to Band 6.",
    pullQuote: "Legal Studies requires a different kind of thinking. DA gave me exactly that.",
    story: "I found Legal Studies difficult because the answers weren't as clear as in other subjects. At DA I learned how to construct and evaluate legal arguments properly.\n\nThe Band 6 result in the HSC validated a year of learning to think critically about law and justice.",
    whyItWorked: [
      { n: '01', point: 'Legal reasoning developed', detail: 'Emma learned to construct balanced legal arguments â€” the core skill Legal Studies rewards.' },
      { n: '02', point: 'Case studies integrated', detail: 'Specific case references were woven into responses naturally, not forced in as afterthoughts.' },
      { n: '03', point: 'Consistent practice across all topics', detail: 'No section of the syllabus was left uncovered. That completeness showed in the final result.' },
    ],
    learningFormat: 'Small Group Â· HSC HSIE',
    newTags: ['HSC Success', 'Band 6 Results'],
  },

  // PLACEHOLDER pr-25 â€” HSC Success group
  {
    id: 'pr-25',
    subject: 'Business Studies',
    category: 'HSC Business Studies',
    author: 'Jason Park',
    yearLevel: 'Year 12',
    result: { before: 'Band 4', after: 'Band 5â€“6' },
    outcomes: ['Band 5â€“6', 'Business Strategy', 'HSC Success'],
    preview: "I was a solid Band 4 student who couldn't break through. DA showed me the difference between knowing content and applying it at Band 6 level.",
    pullQuote: "There is a specific difference between Band 4 and Band 6 answers. DA showed me exactly what that difference is.",
    story: "Band 4 in Business Studies comes from knowing the content. Band 6 comes from applying it. At DA I learned to do the second.\n\nThe improvement in my responses was visible within a month â€” and the HSC result confirmed that.",
    whyItWorked: [
      { n: '01', point: 'Application over recall', detail: 'Jason was taught to use theory to analyse scenarios rather than just define terms â€” which is what Band 6 requires.' },
      { n: '02', point: 'Extended response technique', detail: 'The longer responses received systematic feedback until they met Band 6 standards consistently.' },
      { n: '03', point: 'Real-world examples used', detail: 'Contemporary business examples made Jason\'s responses feel current and sophisticated to markers.' },
    ],
    learningFormat: 'Small Group Â· HSC Business',
    newTags: ['HSC Success', 'Academic Growth'],
  },

  // PLACEHOLDER pr-26 â€” HSC Success group
  {
    id: 'pr-26',
    subject: 'General',
    category: 'HSC Multi-Subject',
    author: 'Natalie Vo',
    yearLevel: 'Year 12',
    result: { before: 'Band 3â€“4 across subjects', after: '4 Band 5s' },
    outcomes: ['4 Band 5s', 'ATAR Achieved', 'Holistic Improvement'],
    preview: "I came to DA needing to lift across all my subjects. I left with four Band 5s and an ATAR I had told myself was impossible.",
    pullQuote: "Four Band 5s and an ATAR I had told myself was impossible.",
    story: "The HSC felt overwhelming when every subject needed attention. DA helped me prioritise what to work on across my four subjects and made each one feel manageable.\n\nFour Band 5s. I came in hoping for one Band 5. I got four.",
    whyItWorked: [
      { n: '01', point: 'Cross-subject strategy built', detail: 'A study schedule that gave appropriate time to each subject prevented any one area from dragging the ATAR down.' },
      { n: '02', point: 'Each subject coached by a specialist', detail: 'Natalie didn\'t receive generic tutoring â€” each subject had a tutor who knew it deeply.' },
      { n: '03', point: 'Progress tracking kept motivation alive', detail: 'Seeing improvement across multiple subjects sustained the effort required across a full HSC year.' },
    ],
    learningFormat: 'Small Group Â· HSC Multi-Subject',
    newTags: ['HSC Success', 'Academic Growth'],
  },

  // PLACEHOLDER pr-27 â€” HSC Success group
  {
    id: 'pr-27',
    subject: 'Mathematics',
    category: 'HSC Mathematics Extension 2',
    author: 'Chris Nguyen',
    yearLevel: 'Year 12',
    result: { before: 'E2', after: 'E4' },
    outcomes: ['E4 Extension 2', 'Proof Writing', 'HSC Success'],
    preview: "Extension 2 Mathematics is a different subject from any other. DA helped me understand proof writing and I went from E2 to E4 in the HSC.",
    pullQuote: "Extension 2 is about proof and rigour. DA gave me both.",
    story: "Extension 2 Mathematics requires a different level of mathematical rigour than any other HSC subject. At DA the tutor taught me to think like a mathematician â€” not just solve problems.\n\nThe E4 in the HSC reflected a genuine shift in how I understood and communicated mathematics.",
    whyItWorked: [
      { n: '01', point: 'Proof writing taught systematically', detail: 'The ability to construct a rigorous mathematical proof was built step by step rather than expected as a given.' },
      { n: '02', point: 'Complex topics mastered', detail: 'The topics most students find hardest were given dedicated attention and made genuinely accessible.' },
      { n: '03', point: 'Mathematical reasoning over computation', detail: 'Extension 2 rewards thinking, not calculating. Chris was taught to lead with reasoning.' },
    ],
    learningFormat: 'Small Group Â· HSC Mathematics Extension',
    newTags: ['HSC Success', 'Mathematics'],
  },

  // PLACEHOLDER pr-28 â€” HSC Success group
  {
    id: 'pr-28',
    subject: 'General',
    category: 'HSC Humanities',
    author: 'Priya Sharma',
    yearLevel: 'Year 12',
    result: { before: 'Mid-band', after: 'Band 5â€“6 English & History' },
    outcomes: ['Band 5â€“6 English', 'Band 5â€“6 History', 'Writing Excellence'],
    preview: "English and Modern History both required strong analytical writing. DA helped me develop an approach that worked for both â€” and I ended with Band 5â€“6 in each.",
    pullQuote: "The writing skills I built at DA transferred across every humanities subject I studied.",
    story: "My two weakest subjects both required the same core skill â€” analytical writing. At DA I was taught a transferable approach to argumentation that lifted both subjects simultaneously.\n\nBand 5â€“6 in English and Modern History. The skills transferred exactly as my tutor promised.",
    whyItWorked: [
      { n: '01', point: 'Transferable writing framework', detail: 'A single analytical structure, adapted for each subject, improved Priya\'s performance across humanities simultaneously.' },
      { n: '02', point: 'Thesis construction mastered', detail: 'A clear, arguable thesis is the foundation of strong humanities essays. Priya\'s were consistently strong.' },
      { n: '03', point: 'Evidence integration technique', detail: 'Quoting, paraphrasing, and analysing evidence â€” rather than summarising it â€” was practised until automatic.' },
    ],
    learningFormat: 'Small Group Â· HSC Humanities',
    newTags: ['HSC Success', 'Academic Growth'],
  },

  // PLACEHOLDER pr-29 â€” Confidence group
  {
    id: 'pr-29',
    subject: 'General',
    category: 'Primary School',
    author: 'Emma Wong',
    yearLevel: 'Year 6',
    result: { before: 'Anxious learner', after: 'Loves school' },
    outcomes: ['Attitude Shift', 'Confidence', 'School Enjoyment'],
    preview: "My daughter used to come home crying about school. After three months at DA she was excited to go. The confidence shift happened faster than I expected.",
    pullQuote: "She went from dreading school to looking forward to Monday mornings.",
    story: "Academic anxiety at Year 6 can set a pattern that lasts years. At DA the tutors took time to understand why Emma found learning stressful â€” and addressed that before focusing on content.\n\nThe shift in her relationship with school was the most important change. The grades followed naturally.",
    whyItWorked: [
      { n: '01', point: 'Anxiety addressed before content', detail: 'Understanding the emotional barrier to learning allowed the content work to actually land.' },
      { n: '02', point: 'Small wins built momentum', detail: 'Early successes gave Emma evidence that she could succeed â€” which changed her expectation of herself.' },
      { n: '03', point: 'Enjoyment built into every session', detail: 'Sessions that feel engaging create a positive association with learning that persists long after tuition ends.' },
    ],
    learningFormat: 'Small Group Â· Primary School',
    newTags: ['Confidence', 'Parent Feedback'],
  },

  // PLACEHOLDER pr-30 â€” Confidence group
  {
    id: 'pr-30',
    subject: 'General',
    category: 'High School',
    author: 'Michael Lee',
    yearLevel: 'Year 9',
    result: { before: 'Avoided class questions', after: 'Volunteers answers' },
    outcomes: ['Class Participation', 'Confidence', 'Social Growth'],
    preview: "I was the student who never raised my hand. DA gave me enough confidence that I now answer questions in class without being asked. That changed everything else.",
    pullQuote: "I now raise my hand before the teacher even finishes the question.",
    story: "Avoiding questions in class felt safer than being wrong publicly. At DA the small group environment let me get things wrong safely â€” without judgment.\n\nNow I volunteer answers in class. My teacher noticed before I did.",
    whyItWorked: [
      { n: '01', point: 'Safe environment to be wrong', detail: 'The small group setting allowed Michael to make mistakes without social cost â€” which is how real learning happens.' },
      { n: '02', point: 'Accuracy built before speed', detail: 'Ensuring answers were right meant Michael never had reason to feel embarrassed by the output.' },
      { n: '03', point: 'Classroom transfer observed', detail: 'The confidence built in sessions translated directly into classroom behaviour â€” a reliable sign of genuine change.' },
    ],
    learningFormat: 'Small Group Â· Year 9',
    newTags: ['Confidence', 'Academic Growth'],
  },

  // PLACEHOLDER pr-31 â€” Confidence group
  {
    id: 'pr-31',
    subject: 'English',
    category: 'English',
    author: 'Anna Tran',
    yearLevel: 'Year 10',
    result: { before: 'Feared oral presentations', after: 'Speaks without notes' },
    outcomes: ['Oral Confidence', 'Presentations', 'Written Confidence'],
    preview: "Oral presentations were my nightmare. DA helped me see that the preparation I did in writing carried into speaking â€” and now I look forward to presenting.",
    pullQuote: "The confidence I built in writing was the same confidence I needed to speak.",
    story: "Fear of speaking in class came from not trusting what I had to say. At DA I learned to trust my own ideas through writing â€” and discovered that trust transferred to speaking.\n\nI now deliver oral presentations without notes. That would have been unimaginable a year ago.",
    whyItWorked: [
      { n: '01', point: 'Written confidence transferred to oral', detail: 'Building trust in her own ideas through essay writing gave Anna the foundation to speak those ideas aloud.' },
      { n: '02', point: 'Content clarity reduced anxiety', detail: 'When students truly understand what they\'re saying, the fear of speaking it reduces dramatically.' },
      { n: '03', point: 'Low-stakes verbal practice', detail: 'Explaining ideas verbally in sessions prepared Anna for the higher-stakes classroom environment.' },
    ],
    learningFormat: 'Small Group Â· English',
    newTags: ['Confidence', 'English'],
  },

  // PLACEHOLDER pr-32 â€” Teacher Support group
  {
    id: 'pr-32',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Oliver Chen',
    yearLevel: 'Year 7',
    result: { before: 'Behind peers', after: 'Peer tutor for classmates' },
    outcomes: ['Peer Tutor', 'Teacher Relationship', 'Maths Mastery'],
    preview: "My tutor at DA believed in me before I believed in myself. Within two terms I was helping my classmates with the same work that had confused me.",
    pullQuote: "My tutor believed in me before I did. That made all the difference.",
    story: "Starting high school behind in maths was demoralising. My DA tutor never treated me as a student who was behind â€” just as one who needed a different explanation.\n\nBy the end of Year 7 I was the student other kids asked for help.",
    whyItWorked: [
      { n: '01', point: 'Belief modelled before it was felt', detail: 'The tutor\'s consistent expectation eventually became Oliver\'s own expectation.' },
      { n: '02', point: 'Explanations adapted', detail: 'Teaching the same concept multiple ways until one clicks is a patience most classroom teachers cannot afford.' },
      { n: '03', point: 'Teaching others as a learning tool', detail: 'When Oliver began explaining concepts to classmates, his own understanding deepened further.' },
    ],
    learningFormat: 'Small Group Â· Year 7 Mathematics',
    newTags: ['Teacher Support', 'Confidence'],
  },

  // PLACEHOLDER pr-33 â€” Teacher Support group
  {
    id: 'pr-33',
    subject: 'English',
    category: 'English',
    author: 'Grace Kim',
    yearLevel: 'Year 11',
    result: { before: 'Average writer', after: 'Top essay writer' },
    outcomes: ['Essay Excellence', 'Mentor Relationship', 'Academic Growth'],
    preview: "My DA tutor became the first teacher who genuinely invested in my writing as something worth developing. That changed how I saw myself as a writer.",
    pullQuote: "The first teacher who treated my writing as something worth investing in.",
    story: "I had written essays for years without anyone telling me what specifically was good or bad. At DA my tutor gave me the most detailed, useful feedback I had ever received.\n\nThat feedback, consistently applied, turned me into a writer I'm proud of.",
    whyItWorked: [
      { n: '01', point: 'Specific, actionable feedback', detail: 'Vague praise does nothing. Detailed feedback gave Grace something specific to improve each session.' },
      { n: '02', point: 'Drafting process valued', detail: 'Learning to revise rather than just write produced essays with clarity Grace hadn\'t reached before.' },
      { n: '03', point: 'Tutor investment felt', detail: 'Students who feel genuinely cared about by their tutors work harder and progress faster.' },
    ],
    learningFormat: 'Small Group Â· English',
    newTags: ['Teacher Support', 'English'],
  },

  // PLACEHOLDER pr-34 â€” Teacher Support group
  {
    id: 'pr-34',
    subject: 'Science',
    category: 'Science',
    author: 'Patrick Nguyen',
    yearLevel: 'Year 8',
    result: { before: 'Disengaged', after: 'Interested in STEM' },
    outcomes: ['STEM Interest', 'Teacher Connection', 'Science Confidence'],
    preview: "My tutor at DA was the first adult who made me feel like my questions mattered. That turned Science from a subject into something I care about.",
    pullQuote: "My questions finally felt like they mattered to someone.",
    story: "I had always asked too many questions â€” or so I was told. At DA, my tutor treated every question as worth answering properly, which fundamentally changed my relationship with learning.\n\nI now want to study science at university. That ambition started in a Year 8 DA session.",
    whyItWorked: [
      { n: '01', point: 'Questions rewarded', detail: 'A curious student who is welcomed rather than redirected will invest more deeply in the subject.' },
      { n: '02', point: 'Tutor modelled scientific curiosity', detail: 'When teachers demonstrate genuine enthusiasm for their subject, students are influenced by that enthusiasm.' },
      { n: '03', point: 'Long-term ambition seeded early', detail: 'A desire to study science at university, planted in Year 8, is one of the highest-impact outcomes tutoring can produce.' },
    ],
    learningFormat: 'Small Group Â· Year 8 Science',
    newTags: ['Teacher Support', 'Science'],
  },

  // PLACEHOLDER pr-35 â€” Teacher Support group
  {
    id: 'pr-35',
    subject: 'General',
    category: 'Multi-Year Program',
    author: 'Isabella Wu',
    yearLevel: 'Year 12',
    result: { before: 'Starting Year 10 behind', after: 'ATAR target achieved' },
    outcomes: ['3-Year Journey', 'ATAR Achieved', 'Consistent Support'],
    preview: "I was at DA from Year 10 to Year 12. Three years of the same tutors, the same standards, the same encouragement. That consistency was what I needed.",
    pullQuote: "Three years. Same tutors. Same standards. Same encouragement. That consistency was everything.",
    story: "Starting at DA in Year 10 and finishing after the HSC gave me something I couldn't have found elsewhere â€” a consistent support structure across the most important years of school.\n\nThe ATAR I achieved came from three years of steady, sustained effort. DA was the constant across all of it.",
    whyItWorked: [
      { n: '01', point: 'Consistent tutor relationships', detail: 'Three years of the same team meant no time lost rebuilding context.' },
      { n: '02', point: 'Long-term plan executed year by year', detail: 'A three-year roadmap allowed each year to build on the previous.' },
      { n: '03', point: 'Trust built over time', detail: 'By Year 12 Isabella could say what she was struggling with because she trusted her tutors fully.' },
    ],
    learningFormat: 'Small Group Â· Years 10â€“12',
    newTags: ['Teacher Support', 'Academic Growth'],
  },

  // PLACEHOLDER pr-36 â€” Teacher Support group
  {
    id: 'pr-36',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Ethan Lam',
    yearLevel: 'Year 10',
    result: { before: 'C+', after: 'A+' },
    outcomes: ['A+ Maths', 'Problem Solving', 'Tutor Bond'],
    preview: "The small group size at DA meant my tutor could tell when I understood something and when I was pretending. That honesty made the sessions actually useful.",
    pullQuote: "My tutor knew when I understood and when I was just pretending. That honesty changed everything.",
    story: "In a class of 30, pretending to understand is easy. In a DA group of 4, it's impossible â€” which turned out to be exactly what I needed.\n\nThe A+ in Maths came from never being allowed to slide past something I hadn't fully grasped.",
    whyItWorked: [
      { n: '01', point: 'Small group makes pretending impossible', detail: 'With fewer students per tutor, genuine understanding is tested every session.' },
      { n: '02', point: 'Gaps closed immediately', detail: 'Every misconception was addressed in the same session, preventing the snowballing that causes failure in later topics.' },
      { n: '03', point: 'Tutor read the student', detail: 'The ability to notice when a student is struggling before they say so changes the outcome of every session.' },
    ],
    learningFormat: 'Small Group Â· Year 10 Mathematics',
    newTags: ['Teacher Support', 'Mathematics'],
  },

  // PLACEHOLDER pr-37 â€” Teacher Support group
  {
    id: 'pr-37',
    subject: 'General',
    category: 'Primary School',
    author: 'Sophia Pham',
    yearLevel: 'Year 5',
    result: { before: 'Falling behind', after: 'On track and confident' },
    outcomes: ['Foundation Secured', 'Confidence', 'Patient Teaching'],
    preview: "My daughter needed patience more than she needed content. DA gave her both â€” and now she's on track for a strong high school entry.",
    pullQuote: "She needed patience first. DA understood that before we did.",
    story: "At Year 5, falling behind in the fundamentals sets a trajectory that is hard to change. The tutors at DA understood that before we articulated it.\n\nThree terms later our daughter is on track. The difference was patient, unhurried teaching that rebuilt her foundations.",
    whyItWorked: [
      { n: '01', point: 'Patience as a teaching method', detail: 'Returning to a concept as many times as needed produces deeper understanding than covering content quickly.' },
      { n: '02', point: 'Foundations rebuilt without embarrassment', detail: 'Returning to earlier content when needed was done naturally, without stigma.' },
      { n: '03', point: 'High school readiness as the goal', detail: 'Working backward from what Year 7 requires gave sessions clear direction.' },
    ],
    learningFormat: 'Small Group Â· Primary School',
    newTags: ['Teacher Support', 'Confidence'],
  },

  // PLACEHOLDER pr-38 â€” Study Habits group
  {
    id: 'pr-38',
    subject: 'General',
    category: 'High School',
    author: 'Lucas Chen',
    yearLevel: 'Year 9',
    result: { before: 'No study structure', after: 'Weekly study plan' },
    outcomes: ['Study Structure', 'Grade Improvement', 'Self-Direction'],
    preview: "I didn't have a study routine until DA. They taught me how to structure a week, which weeks to prioritise, and how to tell if a session had actually been productive.",
    pullQuote: "For the first time I actually knew whether I had studied effectively or just been in the room.",
    story: "Sitting at a desk for two hours and studying for two hours are very different things. At DA I learned the difference.\n\nThe routines I built with my tutor's guidance in Year 9 are still the ones I use now.",
    whyItWorked: [
      { n: '01', point: 'Productive vs. present study distinguished', detail: 'Learning to assess whether a session was genuinely effective is a metacognitive skill most students are never taught.' },
      { n: '02', point: 'Weekly planning installed', detail: 'A consistent structure removed the decision fatigue of figuring out what to study each day.' },
      { n: '03', point: 'Study audit each session', detail: 'Each session began by reviewing how the previous week\'s independent study had gone â€” creating accountability.' },
    ],
    learningFormat: 'Small Group Â· Year 9',
    newTags: ['Study Habits', 'Academic Growth'],
  },

  // PLACEHOLDER pr-39 â€” Study Habits group
  {
    id: 'pr-39',
    subject: 'General',
    category: 'High School',
    author: 'Chloe Nguyen',
    yearLevel: 'Year 11',
    result: { before: 'Disorganised', after: 'Top 5 in cohort' },
    outcomes: ['Top 5 Cohort', 'Organisation', 'Time Management'],
    preview: "My marks were always inconsistent because my effort was inconsistent. DA helped me build the systems that made my effort consistent â€” and the marks followed.",
    pullQuote: "Consistent marks come from consistent effort. DA helped me build the systems for both.",
    story: "Year 11 tests organisation as much as ability. I had the ability but not the systems. At DA the tutors helped me build habits that turned inconsistent effort into consistent performance.\n\nTop 5 in cohort at Year 11 end. The systems made it possible.",
    whyItWorked: [
      { n: '01', point: 'Organisation treated as a learnable skill', detail: 'Being organised is a skill that can be built, not a personality trait you either have or don\'t.' },
      { n: '02', point: 'Assessment calendar maintained', detail: 'Mapping all due dates in advance removed the last-minute cramming that had previously cost marks.' },
      { n: '03', point: 'Consistent effort produced consistent results', detail: 'The connection between systematic preparation and reliable marks became clear once the systems were in place.' },
    ],
    learningFormat: 'Small Group Â· Year 11',
    newTags: ['Study Habits', 'Academic Growth'],
  },

  // PLACEHOLDER pr-40 â€” Study Habits group
  {
    id: 'pr-40',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Noah Tran',
    yearLevel: 'Year 10',
    result: { before: 'Cramming before exams', after: 'Daily practice routine' },
    outcomes: ['Daily Practice', 'Grade Consistency', 'Maths Improvement'],
    preview: "I used to cram for maths the night before. DA showed me that daily 20-minute practice sessions are worth more than five hours the night before an exam.",
    pullQuote: "Twenty minutes a day beats five hours the night before every single time.",
    story: "Cramming worked â€” until it didn't. At DA my tutor explained simply: maths is a skill that improves with spaced practice, not massed review.\n\nOnce I built the daily habit, my marks became predictable in a way they had never been before.",
    whyItWorked: [
      { n: '01', point: 'Spaced practice explained and implemented', detail: 'The evidence for spaced repetition was explained simply, giving Noah a reason to trust the new habit.' },
      { n: '02', point: 'Daily habit small enough to stick', detail: 'Twenty minutes is achievable every day. That consistency compounded into significant improvement across a term.' },
      { n: '03', point: 'Exam preparation built in', detail: 'Rather than cramming the night before, Noah had already reviewed every topic multiple times through daily practice.' },
    ],
    learningFormat: 'Small Group Â· Year 10 Mathematics',
    newTags: ['Study Habits', 'Mathematics'],
  },

  // PLACEHOLDER pr-41 â€” Study Habits group
  {
    id: 'pr-41',
    subject: 'English',
    category: 'English',
    author: 'Mia Liu',
    yearLevel: 'Year 8',
    result: { before: 'Non-reader', after: 'Reading for pleasure' },
    outcomes: ['Reading Habit', 'Essay Improvement', 'Vocabulary Growth'],
    preview: "I hadn't read a book for pleasure in years. DA helped me find books I actually wanted to read â€” and once I started reading, my English results improved without me trying.",
    pullQuote: "Once I started reading for myself, my English marks improved without me trying to improve them.",
    story: "The connection between reading habit and English results is direct. At DA my tutor helped me find books that actually interested me.\n\nOnce reading became enjoyable, vocabulary, sentence structure, and comprehension all improved naturally.",
    whyItWorked: [
      { n: '01', point: 'Right books at the right time', detail: 'Being given texts that genuinely interest a student is more impactful than any specific English technique.' },
      { n: '02', point: 'Passive learning through reading', detail: 'Hours of reading accumulate language patterns that no formal grammar instruction can replicate at the same speed.' },
      { n: '03', point: 'Improvement without direct instruction', detail: 'When outcomes improve in areas not directly taught, the intervention is producing genuine change.' },
    ],
    learningFormat: 'Small Group Â· Year 8 English',
    newTags: ['Study Habits', 'English'],
  },

  // PLACEHOLDER pr-42 â€” Study Habits group
  {
    id: 'pr-42',
    subject: 'General',
    category: 'HSC',
    author: 'Liam Park',
    yearLevel: 'Year 12',
    result: { before: 'Reactive study', after: 'Proactive HSC preparation' },
    outcomes: ['HSC Readiness', 'Time Management', 'Study Strategy'],
    preview: "I used to study reactively â€” when something was due. DA taught me to study proactively, which transformed the HSC from something I feared into something I prepared for.",
    pullQuote: "DA transformed the HSC from something I feared into something I was prepared for.",
    story: "Reactive studying works until the HSC, when everything is due at once. At DA I learned to plan ahead across all subjects.\n\nThe HSC year felt manageable in a way I hadn't expected. That came from the habits built in the year before it.",
    whyItWorked: [
      { n: '01', point: 'Proactive vs. reactive study distinguished', detail: 'Understanding the difference changed Liam\'s entire approach to every subject.' },
      { n: '02', point: 'HSC treated as a year-long project', detail: 'Twelve months of consistent preparation rather than a single high-pressure event changed the experience fundamentally.' },
      { n: '03', point: 'Revision scheduled before urgency', detail: 'Reviewing content before it was urgent meant the final weeks were for refinement, not desperate review.' },
    ],
    learningFormat: 'Small Group Â· HSC',
    newTags: ['Study Habits', 'HSC Success'],
  },

  // â”€â”€ NEW placeholders pr-43â€“pr-80 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PLACEHOLDER pr-43 â€” Academic Growth group
  {
    id: 'pr-43',
    subject: 'General',
    category: 'High School',
    author: 'Hannah Vo',
    yearLevel: 'Year 7',
    result: { before: 'Nervous Year 7 start', after: 'Thriving by Year 7 end' },
    outcomes: ['Strong Start', 'Academic Growth', 'School Confidence'],
    preview: "Year 7 was terrifying. DA helped me settle in fast and come out of it with results that set me up for high school in a way I didn't expect.",
    pullQuote: "I came out of Year 7 feeling like high school was something I could actually do.",
    story: "The transition from primary to high school is academically and socially demanding. At DA I had support that let me focus on the academic side without the anxiety of feeling behind.\n\nYear 7 ended with results I'm proud of â€” and the confidence to take on Year 8.",
    whyItWorked: [
      { n: '01', point: 'Transition support front-loaded', detail: 'Addressing Year 7 demands early meant Hannah built good habits before bad ones could form.' },
      { n: '02', point: 'Confidence alongside skills', detail: 'Academic confidence in Year 7 transfers directly into social confidence â€” a compounding benefit.' },
      { n: '03', point: 'Foundation for future years', detail: 'Strong habits built in Year 7 reduced the adjustment required in every subsequent year.' },
    ],
    learningFormat: 'Small Group Â· Year 7',
    newTags: ['Academic Growth', 'Confidence'],
  },

  // PLACEHOLDER pr-44 â€” Academic Growth group
  {
    id: 'pr-44',
    subject: 'Mathematics',
    category: 'Mathematics Advanced',
    author: 'Benjamin Kim',
    yearLevel: 'Year 11',
    result: { before: 'Rank 45th', after: 'Rank 8th' },
    outcomes: ['Rank Jump', 'Maths Advanced', 'Grade Improvement'],
    preview: "I moved from 45th to 8th in my cohort ranking in Mathematics Advanced across one year at DA. The tutors identified weaknesses I didn't know I had.",
    pullQuote: "Moving from rank 45 to rank 8 changed how I thought about what I was capable of.",
    story: "Year 11 Mathematics Advanced was the subject I was most worried about. At DA the tutors ran a diagnostic and found gaps my class marks hadn't revealed.\n\nClosing those gaps moved my rank from 45th to 8th across a single year.",
    whyItWorked: [
      { n: '01', point: 'Diagnostic before intervention', detail: 'A structured assessment of what Benjamin understood â€” and didn\'t â€” prevented wasted time on already-mastered content.' },
      { n: '02', point: 'Hidden gaps addressed', detail: 'Gaps accumulated quietly over years were finally identified and closed â€” releasing Benjamin\'s actual capacity.' },
      { n: '03', point: 'Rank used as feedback', detail: 'Using rank as information about what to work on, rather than as a judgment, kept motivation focused and productive.' },
    ],
    learningFormat: 'Small Group Â· Year 11 Mathematics',
    newTags: ['Academic Growth', 'Mathematics'],
  },

  // PLACEHOLDER pr-45 â€” Academic Growth group
  {
    id: 'pr-45',
    subject: 'English',
    category: 'English',
    author: 'Abigail Chen',
    yearLevel: 'Year 8',
    result: { before: 'C student', after: 'A student two years later' },
    outcomes: ['A Grade', 'Long-term Growth', 'Writing Excellence'],
    preview: "Two years at DA transformed my English from C-grade to A-grade work. The change happened gradually, then all at once. I'm a different writer than I was.",
    pullQuote: "The change happened gradually and then all at once â€” like the way language itself works.",
    story: "Starting at DA in Year 7 as a C-grade English student, I didn't expect to become an A student. But over two years the consistent feedback built something real.\n\nBy Year 8 end my teacher was using my essays as examples. That wouldn't have happened without DA.",
    whyItWorked: [
      { n: '01', point: 'Long-term progress tracked', detail: 'Two years of consistent improvement gave Abigail evidence of her own capacity for growth.' },
      { n: '02', point: 'Deliberate practice each session', detail: 'Each session had a specific focus. Targeted practice on identified weaknesses produced improvement faster than general revision.' },
      { n: '03', point: 'Teacher recognition as external validation', detail: 'When school teachers acknowledge work publicly, it confirms what the student and tutor have been seeing privately.' },
    ],
    learningFormat: 'Small Group Â· English',
    newTags: ['Academic Growth', 'English'],
  },

  // PLACEHOLDER pr-46 â€” Academic Growth group
  {
    id: 'pr-46',
    subject: 'Science',
    category: 'Science',
    author: 'Caleb Nguyen',
    yearLevel: 'Year 10',
    result: { before: 'Bottom third', after: 'Top 10%' },
    outcomes: ['Top 10%', 'Science Growth', 'Cohort Rank'],
    preview: "I was in the bottom third of my cohort for Science in Year 9. By the end of Year 10 I was in the top 10%. DA gave me a pathway and the belief that it was real.",
    pullQuote: "DA gave me a pathway and the belief that the pathway was actually real.",
    story: "Moving from bottom third to top 10% requires both the right teaching and the belief that improvement is possible. DA gave me both.\n\nBy Year 10 end the improvement was visible to everyone, including me.",
    whyItWorked: [
      { n: '01', point: 'Belief installed before progress', detail: 'The tutor communicated clearly that the improvement was achievable â€” that communication enabled the actual improvement.' },
      { n: '02', point: 'Step-by-step pathway visible', detail: 'Breaking the goal into quarterly milestones made the distance from bottom third to top 10% feel crossable.' },
      { n: '03', point: 'Rank as a navigation tool', detail: 'Tracking rank across terms gave Caleb concrete evidence of momentum â€” which sustained the effort.' },
    ],
    learningFormat: 'Small Group Â· Year 10 Science',
    newTags: ['Academic Growth', 'Science'],
  },

  // PLACEHOLDER pr-47 â€” Academic Growth group
  {
    id: 'pr-47',
    subject: 'General',
    category: 'High School',
    author: 'Ella Tran',
    yearLevel: 'Year 9',
    result: { before: 'Inconsistent marks', after: 'Consistently above 85%' },
    outcomes: ['Consistency', 'Grade Average', 'Multi-Subject Growth'],
    preview: "My marks used to swing between 60% and 80% depending on how well the topic clicked. DA gave me the tools to stay above 85% consistently across all subjects.",
    pullQuote: "DA gave me the tools to be consistent, not just occasionally excellent.",
    story: "Inconsistency is more frustrating than consistently lower marks â€” because you know what's possible but can't reach it reliably. At DA I learned what was causing the swings and how to address it.\n\nConsistently above 85% across all subjects in Year 9. The frustration is gone.",
    whyItWorked: [
      { n: '01', point: 'Root cause of inconsistency identified', detail: 'Ella\'s swings came from uneven topic coverage. Addressing that directly produced consistency more effectively than any exam technique.' },
      { n: '02', point: 'Every topic treated equally', detail: 'Topics that had caused dips were given equal preparation time to topics Ella found easier.' },
      { n: '03', point: 'Consistency as the explicit goal', detail: 'When students aim for consistency rather than peak performance, their floor rises â€” which raises their average.' },
    ],
    learningFormat: 'Small Group Â· Year 9',
    newTags: ['Academic Growth', 'Study Habits'],
  },

  // PLACEHOLDER pr-48 â€” Academic Growth group
  {
    id: 'pr-48',
    subject: 'General',
    category: 'HSC Year 12',
    author: 'Owen Liu',
    yearLevel: 'Year 12',
    result: { before: 'Poor mid-year results', after: 'Strong HSC finish' },
    outcomes: ['HSC Recovery', 'Turnaround', 'ATAR Achieved'],
    preview: "I joined DA halfway through Year 12 after my mid-year results came back poorly. In six months the tutors helped me recover enough to hit my ATAR target.",
    pullQuote: "Joining DA halfway through Year 12 felt like a last chance. It turned out to be the right one.",
    story: "A poor set of mid-year results in Year 12 can feel terminal. At DA the tutors assessed where I stood and built a six-month plan to close the gap.\n\nThe ATAR I achieved in December was exactly what I needed. That recovery happened in six months with the right support.",
    whyItWorked: [
      { n: '01', point: 'Triage approach to six months', detail: 'Prioritising the topics with the highest mark-recovery potential meant Owen\'s limited time was used optimally.' },
      { n: '02', point: 'Exam-focused from day one', detail: 'With six months remaining, every session was built around HSC-format questions and marking criteria.' },
      { n: '03', point: 'Hope given a structure', detail: 'Owen had the motivation to recover â€” DA gave that motivation a plan.' },
    ],
    learningFormat: 'Small Group Â· HSC Year 12',
    newTags: ['Academic Growth', 'HSC Success'],
  },

  // PLACEHOLDER pr-49 â€” Parent Feedback group
  {
    id: 'pr-49',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'Jennifer Lee (Parent)',
    yearLevel: 'Year 10',
    result: { before: 'Worried about trajectory', after: 'Confident in future' },
    outcomes: ['Parent Confidence', 'Academic Recovery', 'Family Relief'],
    preview: "As a parent watching my daughter struggle and withdraw, I felt helpless. DA gave us both a direction. Watching her regain confidence was the biggest relief of the school year.",
    pullQuote: "Watching my daughter regain her confidence was the biggest relief of the school year.",
    story: "My daughter had slowly withdrawn from school across Year 9. By Year 10 I was genuinely worried. DA didn't just address her marks â€” they helped her reconnect with learning.\n\nWatching that reconnection happen was something I hadn't let myself hope for.",
    whyItWorked: [
      { n: '01', point: 'Reconnection before content', detail: 'DA recognised that Jennifer\'s daughter needed re-engagement first. Marks followed the reconnection.' },
      { n: '02', point: 'Parent kept informed', detail: 'Knowing what was happening in sessions gave Jennifer the information to support her daughter at home.' },
      { n: '03', point: 'Family relief as an outcome', detail: 'When a parent\'s worry resolves, the whole family environment shifts â€” feeding back positively into the student\'s experience.' },
    ],
    learningFormat: 'Small Group Â· Year 10',
    newTags: ['Parent Feedback', 'Confidence'],
  },

  // PLACEHOLDER pr-50 â€” Parent Feedback group
  {
    id: 'pr-50',
    subject: 'Mathematics',
    category: 'Parent Testimonial',
    author: 'Michael Wong (Parent)',
    yearLevel: 'Year 12',
    result: { before: 'Failing maths', after: 'Band 5 HSC' },
    outcomes: ['Band 5 Maths', 'Parent Relief', 'HSC Success'],
    preview: "My son was failing Mathematics in Year 12. Eight months later he had a Band 5 in the HSC. I am still a little stunned by what DA achieved in that time.",
    pullQuote: "I'm still a little stunned by what DA achieved in eight months.",
    story: "Failing Year 12 Mathematics is a frightening place to be. At DA the team assessed the gaps and built a recovery plan my son actually stuck to.\n\nBand 5 in the HSC. Eight months earlier that felt impossible. I'll be recommending DA for as long as I know families who need it.",
    whyItWorked: [
      { n: '01', point: 'Rapid gap assessment at the start', detail: 'Understanding exactly what was missing meant the eight months were used efficiently.' },
      { n: '02', point: 'Achievable plan', detail: 'A reasonable study plan my son could commit to was more effective than a theoretically optimal one he wouldn\'t follow.' },
      { n: '03', point: 'Parent kept in the loop', detail: 'Regular communication gave Michael the confidence to trust the process rather than adding pressure at home.' },
    ],
    learningFormat: 'Small Group Â· HSC Mathematics',
    newTags: ['Parent Feedback', 'Mathematics'],
  },

  // PLACEHOLDER pr-51 â€” Parent Feedback group
  {
    id: 'pr-51',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'Susan Nguyen (Parent)',
    yearLevel: 'Year 8',
    result: { before: 'Bright but underperforming', after: 'Achieving potential' },
    outcomes: ['Potential Realised', 'Parent Satisfaction', 'Academic Growth'],
    preview: "My daughter was clearly bright but consistently underperforming. DA helped us understand why â€” and then fixed it. She's now achieving what I always thought she was capable of.",
    pullQuote: "She's now achieving what I always believed she was capable of. DA made it possible.",
    story: "Watching a bright child underperform is uniquely frustrating. DA ran an assessment and identified that she had gaps in foundational skills holding everything else back.\n\nAddressing those gaps released her actual capability.",
    whyItWorked: [
      { n: '01', point: 'Learning assessment revealed the real cause', detail: 'Rather than assuming effort was the issue, DA identified the specific gaps limiting performance.' },
      { n: '02', point: 'Foundation fixed before extension', detail: 'Returning to foundational content cleared the path for higher-level achievement.' },
      { n: '03', point: 'Parent\'s confidence validated', detail: 'When a parent\'s belief in their child is confirmed by results, it strengthens the relationship and the student\'s self-perception.' },
    ],
    learningFormat: 'Small Group Â· Year 8',
    newTags: ['Parent Feedback', 'Academic Growth'],
  },

  // PLACEHOLDER pr-52 â€” Parent Feedback group
  {
    id: 'pr-52',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'Robert Kim (Parent)',
    yearLevel: 'Two children',
    result: { before: 'Two struggling children', after: 'Both on track' },
    outcomes: ['Two Children Supported', 'Family Improvement', 'Long-term Trust'],
    preview: "We enrolled both of our children at DA and the results exceeded what we hoped for either of them individually. The consistency across two very different learners was impressive.",
    pullQuote: "Two very different learners. One consistent standard of teaching that worked for both.",
    story: "Our son and daughter have completely different learning styles. At DA each of them received an approach that suited them â€” not the same approach applied to different students.\n\nBoth improved significantly. The consistency of quality across two such different learners impressed us most.",
    whyItWorked: [
      { n: '01', point: 'Individual approach maintained', detail: 'The small group structure allows tutors to differentiate within a session â€” giving different students what they individually need.' },
      { n: '02', point: 'Consistent quality across learners', detail: 'The standard of teaching did not depend on which child or which style. Both received the same quality of attention.' },
      { n: '03', point: 'Family logistics simplified', detail: 'Having both children at the same centre removed scheduling complexity and gave parents a single relationship with the DA team.' },
    ],
    learningFormat: 'Small Group Â· Multi-Child Family',
    newTags: ['Parent Feedback', 'Academic Growth'],
  },

  // PLACEHOLDER pr-53 â€” Parent Feedback group
  {
    id: 'pr-53',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'Catherine Tran (Parent)',
    yearLevel: 'Year 11',
    result: { before: 'Son stressed and disengaged', after: 'Calm and focused' },
    outcomes: ['Stress Reduction', 'Re-engagement', 'Wellbeing'],
    preview: "My son's stress about school was affecting the whole family. DA gave him a structure that made school feel manageable â€” and the relief was felt by all of us.",
    pullQuote: "When my son's stress reduced, the whole household relaxed. DA made that happen.",
    story: "Year 11 stress is common, but when it becomes chronic it affects learning and family life equally. At DA the tutors gave my son a structure and a sense of control over his workload.\n\nThe academic results improved. But the reduction in stress was what changed our family's Year 11.",
    whyItWorked: [
      { n: '01', point: 'Structure reduces stress directly', detail: 'Knowing what to do and when removes the anxiety of uncertainty â€” the primary source of Catherine\'s son\'s distress.' },
      { n: '02', point: 'Control restored to the student', detail: 'When students feel in control of their preparation, anxiety reduces â€” independent of how much content they have actually covered.' },
      { n: '03', point: 'Family wellbeing as an outcome', detail: 'Student stress transfers to families. Addressing the student\'s experience improved the whole household.' },
    ],
    learningFormat: 'Small Group Â· Year 11',
    newTags: ['Parent Feedback', 'Confidence'],
  },

  // PLACEHOLDER pr-54 â€” Parent Feedback group
  {
    id: 'pr-54',
    subject: 'Science',
    category: 'Parent Testimonial',
    author: 'Andrew Liu (Parent)',
    yearLevel: 'Year 9',
    result: { before: 'Daughter hated Science', after: 'Considering STEM career' },
    outcomes: ['STEM Interest', 'Career Direction', 'Parent Surprise'],
    preview: "My daughter hated Science. She is now seriously considering a STEM career. I did not expect DA to have that kind of impact â€” I just wanted her to pass Year 9 Science.",
    pullQuote: "I just wanted her to pass Year 9 Science. I didn't expect DA to change her career plans.",
    story: "We enrolled our daughter at DA for a practical reason â€” she was failing Year 9 Science. What happened was far more than we bargained for.\n\nShe passed Science. Then she started finding it interesting. Now she's researching environmental science at university.",
    whyItWorked: [
      { n: '01', point: 'Subject made relevant before academic', detail: 'Connecting science to things Andrew\'s daughter genuinely cared about came before any attempt to improve her results.' },
      { n: '02', point: 'Curiosity given space', detail: 'A student who asks about science outside class is a student whose interest has genuinely been ignited.' },
      { n: '03', point: 'Long-term impact beyond the original goal', detail: 'The greatest outcomes of tutoring are often not the ones originally sought â€” they emerge when a student is genuinely engaged.' },
    ],
    learningFormat: 'Small Group Â· Year 9 Science',
    newTags: ['Parent Feedback', 'Science'],
  },

  // PLACEHOLDER pr-55 â€” Parent Feedback group
  {
    id: 'pr-55',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'Margaret Park (Parent)',
    yearLevel: 'Year 7',
    result: { before: 'Struggling with transition', after: 'Settled and confident' },
    outcomes: ['Transition Support', 'Confidence', 'Parent Reassurance'],
    preview: "The transition to high school was harder than we expected. DA gave our child the academic support to get on top of things â€” and gave us peace of mind during a stressful few months.",
    pullQuote: "DA gave us peace of mind during the most stressful months of our child's schooling so far.",
    story: "Year 7 is a major transition. Academic support in the first term can determine the trajectory of the whole year.\n\nAt DA our child got on top of things quickly. By Term 2 we stopped worrying. That's the best thing I can say about any service.",
    whyItWorked: [
      { n: '01', point: 'Early support prevents trajectory problems', detail: 'Catching difficulties in first term of Year 7 prevents the cascading impact that unaddressed gaps can have.' },
      { n: '02', point: 'Speed of response meaningful at transition', detail: 'Rapid support in Term 1 had a compounding positive effect across the rest of the year.' },
      { n: '03', point: 'Parent worry addressed directly', detail: 'When parents are informed and confident, they support their child more effectively.' },
    ],
    learningFormat: 'Small Group Â· Year 7',
    newTags: ['Parent Feedback', 'Confidence'],
  },

  // PLACEHOLDER pr-56 â€” Parent Feedback group
  {
    id: 'pr-56',
    subject: 'General',
    category: 'Parent Testimonial',
    author: 'William Chen (Parent)',
    yearLevel: 'Year 12',
    result: { before: 'ATAR target felt unrealistic', after: 'ATAR target achieved' },
    outcomes: ['ATAR Achieved', 'Parent Relief', 'HSC Success'],
    preview: "My son told me his ATAR target in Year 11. I privately thought it was too high. DA proved me wrong. He achieved it â€” and I owe them a debt of gratitude for that.",
    pullQuote: "I privately thought my son's ATAR target was too high. DA proved me wrong.",
    story: "Every parent wants to believe their child can achieve what they set out to do. I found it hard in Year 11. The ATAR my son was aiming for felt optimistic.\n\nDA gave him a pathway and the skills to walk it. He achieved the ATAR. I'm proud of him and grateful to DA in equal measure.",
    whyItWorked: [
      { n: '01', point: 'Ambitious targets taken seriously', detail: 'DA did not counsel William\'s son toward a safer goal â€” they built a plan to achieve the one he had set.' },
      { n: '02', point: 'Year 12 as a managed campaign', detail: 'Treating the HSC as a year-long managed campaign â€” with regular progress checks â€” kept the target in sight throughout.' },
      { n: '03', point: 'Parent expectation exceeded', detail: 'When tutoring exceeds what a parent believed was possible, it creates advocates who recommend DA to every family they know.' },
    ],
    learningFormat: 'Small Group Â· HSC Year 12',
    newTags: ['Parent Feedback', 'HSC Success'],
  },

  // PLACEHOLDER pr-57 â€” English group
  {
    id: 'pr-57',
    subject: 'English',
    category: 'English Advanced',
    author: 'Jasmine Nguyen',
    yearLevel: 'Year 11',
    result: { before: 'Borderline Advanced', after: 'Solid Advanced student' },
    outcomes: ['English Advanced', 'Text Analysis', 'Essay Writing'],
    preview: "I was barely keeping up with English Advanced. DA gave me the analytical skills to not just keep up â€” but genuinely engage with the texts the way the course demands.",
    pullQuote: "DA helped me engage with the texts the way Advanced demands â€” not just survive the course.",
    story: "English Advanced requires genuine analytical engagement rather than competent summary. At DA I learned to read for argument rather than for plot.\n\nThat change made the whole course unlock.",
    whyItWorked: [
      { n: '01', point: 'Advanced-level reading modelled', detail: 'Jasmine learned to read texts analytically â€” for craft, argument, and technique â€” rather than for story.' },
      { n: '02', point: 'Complex texts made accessible', detail: 'Difficult texts became manageable once Jasmine had a method for approaching them systematically.' },
      { n: '03', point: 'Essay quality matched the course level', detail: 'Advanced essays require sophisticated argumentation. Jasmine\'s writing was coached to meet that standard explicitly.' },
    ],
    learningFormat: 'Small Group Â· English Advanced',
    newTags: ['English', 'Academic Growth'],
  },

  // PLACEHOLDER pr-58 â€” English group
  {
    id: 'pr-58',
    subject: 'English',
    category: 'English',
    author: 'Theodore Kim',
    yearLevel: 'Year 9',
    result: { before: 'C student', after: 'A student' },
    outcomes: ['A Grade English', 'Essay Structure', 'Reading Depth'],
    preview: "English went from my worst subject to my best. DA showed me that the skills that make a good essay are learnable â€” and once learned, they don't leave.",
    pullQuote: "The skills that make a good essay are learnable. Once you have them, they don't leave.",
    story: "I had believed English ability was something you either had or didn't. At DA I learned that every component of a good English essay is a skill â€” and skills can be taught.\n\nOnce I understood that, improvement was just a matter of practice and feedback. And I got both.",
    whyItWorked: [
      { n: '01', point: 'English demystified', detail: 'Removing the myth that English is innate talent gave Theodore permission to work toward improvement.' },
      { n: '02', point: 'Components taught separately then integrated', detail: 'Thesis, evidence, analysis, and structure were each developed individually before being combined into polished essays.' },
      { n: '03', point: 'Feedback loop accelerated improvement', detail: 'Consistent specific feedback on every essay produced improvement faster than any independent study would have.' },
    ],
    learningFormat: 'Small Group Â· Year 9 English',
    newTags: ['English', 'Academic Growth'],
  },

  // PLACEHOLDER pr-59 â€” English group
  {
    id: 'pr-59',
    subject: 'English',
    category: 'English',
    author: 'Violet Tran',
    yearLevel: 'Year 10',
    result: { before: 'Nice but basic writing', after: 'Published in school anthology' },
    outcomes: ['Creative Writing', 'Published Work', 'English Confidence'],
    preview: "I had always been told my creative writing was 'nice but basic'. At DA I found out what that actually meant and how to go beyond it. One piece was published in a school anthology.",
    pullQuote: "I found out what 'nice but basic' actually meant â€” and how to move past it.",
    story: "Creative writing feedback is often vague. At DA my tutor explained precisely what was working and what wasn't â€” and gave me techniques to develop the areas holding my writing at 'nice but basic'.\n\nA piece I wrote at DA was selected for the school's creative writing anthology.",
    whyItWorked: [
      { n: '01', point: 'Specific creative feedback', detail: 'Vague encouragement does nothing. Violet was given precise, honest feedback on what to change and why.' },
      { n: '02', point: 'Voice and technique balanced', detail: 'Developing a distinctive voice while mastering the technical elements markers value required both kinds of coaching.' },
      { n: '03', point: 'External recognition as confirmation', detail: 'Publication in a school anthology gave Violet independent confirmation that her growth was real.' },
    ],
    learningFormat: 'Small Group Â· Year 10 English',
    newTags: ['English', 'Academic Growth'],
  },

  // PLACEHOLDER pr-60 â€” English group
  {
    id: 'pr-60',
    subject: 'English',
    category: 'HSC English Extension 2',
    author: 'Penelope Liu',
    yearLevel: 'Year 12',
    result: { before: 'No clear direction', after: 'Major Work commended' },
    outcomes: ['Major Work Commended', 'Extension 2', 'Independent Writing'],
    preview: "Extension 2 English requires a sustained creative project. DA helped me find a direction I believed in â€” and the Major Work I produced was commended by my HSC marker.",
    pullQuote: "My DA tutor helped me find the idea that only I could write â€” and that made all the difference.",
    story: "Extension 2 English requires an independent major work â€” a sustained creative project entirely your own. DA's guidance helped me find a concept I genuinely cared about.\n\nThe major work I produced was commended by my HSC marker. More importantly, I'm proud of it.",
    whyItWorked: [
      { n: '01', point: 'Concept development as primary work', detail: 'Finding an idea genuinely Penelope\'s own â€” not a generic approach â€” produced work with authentic creative energy.' },
      { n: '02', point: 'Sustained project supported across the year', detail: 'Major works require consistent momentum. DA\'s ongoing feedback prevented stalls that cause most major works to fall short.' },
      { n: '03', point: 'Reflection developed alongside creative work', detail: 'Extension 2 requires students to articulate their creative choices. The reflective statement was developed in parallel.' },
    ],
    learningFormat: 'Small Group Â· HSC English Extension 2',
    newTags: ['English', 'HSC Success'],
  },

  // PLACEHOLDER pr-61 â€” English group
  {
    id: 'pr-61',
    subject: 'English',
    category: 'English',
    author: 'Sebastian Wong',
    yearLevel: 'Year 8',
    result: { before: 'Dreaded essays', after: 'Essay confidence' },
    outcomes: ['Essay Confidence', 'English Growth', 'Class Improvement'],
    preview: "I dreaded every English essay. At DA I learned that essays aren't mysterious â€” they're a structure you can learn. That realisation changed everything.",
    pullQuote: "Essays aren't mysterious â€” they're a structure you can learn. That realisation changed everything.",
    story: "Every English essay felt like starting from zero. At DA I learned that essays have a learnable structure â€” and once internalised, every essay felt like filling in something I already understood.\n\nThe anxiety I felt before every essay simply went away.",
    whyItWorked: [
      { n: '01', point: 'Essay structure demystified', detail: 'Presenting the essay as a learnable form removed Sebastian\'s anxiety immediately.' },
      { n: '02', point: 'Structure internalised through practice', detail: 'Repeated practice until the structure felt natural meant Sebastian began essays with confidence rather than paralysis.' },
      { n: '03', point: 'Anxiety elimination', detail: 'When students stop fearing a task type, their capacity to perform at their actual level is finally revealed.' },
    ],
    learningFormat: 'Small Group Â· Year 8 English',
    newTags: ['English', 'Confidence'],
  },

  // PLACEHOLDER pr-62 â€” English group
  {
    id: 'pr-62',
    subject: 'English',
    category: 'English Advanced',
    author: 'Aurora Chen',
    yearLevel: 'Year 11',
    result: { before: 'Average technique', after: 'Top essay writer in class' },
    outcomes: ['Top Essay Writer', 'English Advanced', 'Technique'],
    preview: "My essay technique went from average to the best in my class in one year. My school teacher asked if I had changed tutors â€” she noticed that clearly.",
    pullQuote: "My school teacher noticed the improvement before I fully appreciated it myself.",
    story: "Essay technique in English Advanced is the difference between Band 4 and Band 6. At DA I learned to write with a clarity and analytical precision I hadn't achieved before.\n\nMy school teacher noticed. She asked what had changed. The answer was DA.",
    whyItWorked: [
      { n: '01', point: 'Technique gap identified', detail: 'The difference between Aurora\'s essays and top-band essays was analysed specifically â€” not described generally.' },
      { n: '02', point: 'Marker\'s eye developed', detail: 'Learning to read her own essays the way markers do gave Aurora the ability to self-edit toward excellence.' },
      { n: '03', point: 'Teacher-visible improvement', detail: 'When improvement is noticed unprompted by a school teacher, it confirms the change is real and significant.' },
    ],
    learningFormat: 'Small Group Â· English Advanced',
    newTags: ['English', 'Academic Growth'],
  },

  // PLACEHOLDER pr-63 â€” English group
  {
    id: 'pr-63',
    subject: 'English',
    category: 'English',
    author: 'Felix Park',
    yearLevel: 'Year 10',
    result: { before: 'Passive reader', after: 'Active analytical reader' },
    outcomes: ['Analytical Reading', 'Comprehension', 'English Improvement'],
    preview: "I used to read to find out what happened. DA taught me to read to understand how and why â€” and that changed both my comprehension scores and my essay quality.",
    pullQuote: "I used to read to find out what happened. Now I read to understand how and why the author made it happen.",
    story: "Reading for story versus reading for technique are fundamentally different activities. At DA I was taught to do both simultaneously â€” to engage with a text while noticing the choices its author made.\n\nComprehension scores improved, essays improved, and reading became genuinely more interesting.",
    whyItWorked: [
      { n: '01', point: 'Active reading as a teachable skill', detail: 'Annotating, questioning, and noticing choices while reading was modelled until it became automatic.' },
      { n: '02', point: 'Author intent as primary question', detail: 'When students begin asking "why did the author do this?" their analysis deepens immediately.' },
      { n: '03', point: 'Comprehension and essay skills linked', detail: 'The same close reading habits improved both Felix\'s comprehension scores and his essay evidence and analysis.' },
    ],
    learningFormat: 'Small Group Â· Year 10 English',
    newTags: ['English', 'Study Habits'],
  },

  // PLACEHOLDER pr-64 â€” English group
  {
    id: 'pr-64',
    subject: 'English',
    category: 'English',
    author: 'Isla Nguyen',
    yearLevel: 'Year 7',
    result: { before: 'Below literacy benchmark', after: 'On level by Year 7 end' },
    outcomes: ['Literacy Recovery', 'Reading Level', 'Confidence'],
    preview: "I came into Year 7 below literacy benchmarks. DA helped me close the gap within two terms. I started Year 8 at the same level as my classmates.",
    pullQuote: "I started Year 8 at the same level as my classmates. That would not have happened without DA.",
    story: "Starting high school below literacy benchmarks can establish a pattern of underperformance that follows a student for years. At DA the tutors closed the gap in two terms.\n\nStarting Year 8 at the same level as my classmates meant the gap was behind me, not in front.",
    whyItWorked: [
      { n: '01', point: 'Literacy gap closed rapidly', detail: 'Focused work on specific literacy elements below benchmark produced faster progress than broad English tuition.' },
      { n: '02', point: 'Early secondary intervention', detail: 'Year 7 is the optimal time to close primary literacy gaps before they become embedded secondary patterns.' },
      { n: '03', point: 'Year 8 readiness as the explicit goal', detail: 'A clear, time-bound target gave both Isla and her tutors a shared definition of success.' },
    ],
    learningFormat: 'Small Group Â· Year 7 English',
    newTags: ['English', 'Academic Growth'],
  },

  // PLACEHOLDER pr-65 â€” Mathematics group
  {
    id: 'pr-65',
    subject: 'Mathematics',
    category: 'Mathematics Advanced',
    author: 'Hunter Kim',
    yearLevel: 'Year 10',
    result: { before: 'B grade', after: 'A+ grade' },
    outcomes: ['A+ Maths', 'Advanced Readiness', 'Problem Solving'],
    preview: "I was a solid B student in Maths who wanted to take Advanced in Year 11. DA built the bridge between where I was and where I needed to be.",
    pullQuote: "DA built the bridge between where I was and where Advanced needed me to be.",
    story: "Year 10 Mathematics is preparation for a choice: Standard or Advanced. At DA the tutors prepared me for Advanced specifically â€” not just for Year 10.\n\nI entered Year 11 Mathematics Advanced with an A+ behind me and genuine confidence in what lay ahead.",
    whyItWorked: [
      { n: '01', point: 'Year 11 preparation in Year 10', detail: 'Working ahead ensures the transition is seamless rather than a step-change in difficulty.' },
      { n: '02', point: 'Advanced topics previewed', detail: 'Exposure to Year 11 concepts before Year 11 meant Hunter arrived at the first Advanced lesson with context.' },
      { n: '03', point: 'Ambition matched with preparation', detail: 'Hunter wanted to study Advanced. DA made sure that choice was backed by the skills to succeed in it.' },
    ],
    learningFormat: 'Small Group Â· Mathematics',
    newTags: ['Mathematics', 'Academic Growth'],
  },

  // PLACEHOLDER pr-66 â€” Mathematics group
  {
    id: 'pr-66',
    subject: 'Mathematics',
    category: 'Mathematics Extension 1',
    author: 'Scarlett Tran',
    yearLevel: 'Year 11',
    result: { before: 'Borderline Extension', after: 'Top 5 in cohort' },
    outcomes: ['Top 5 Cohort', 'Extension 1', 'Mathematical Depth'],
    preview: "I was borderline for Extension 1 at the start of Year 11. DA helped me find the deeper mathematical thinking the subject requires â€” and I'm now top 5 in my cohort.",
    pullQuote: "Extension 1 requires deeper thinking, not just harder work. DA showed me what that means.",
    story: "Extension 1 Mathematics requires a different relationship with mathematics â€” patience and rigour rather than speed. At DA I learned to approach problems that way.\n\nTop 5 in my Extension 1 cohort at Year 11 end. Patience turned out to be the missing ingredient.",
    whyItWorked: [
      { n: '01', point: 'Mathematical depth over speed', detail: 'Scarlett learned that Extension 1 rewards sitting with a complex problem â€” not answering quickly.' },
      { n: '02', point: 'Proof and reasoning developed', detail: 'Justifying every step separates Extension students who consistently perform from those who occasionally shine.' },
      { n: '03', point: 'Patience as a mathematical virtue', detail: 'Building the habit of careful, unhurried reasoning produced improvement that speed-focused approaches never could.' },
    ],
    learningFormat: 'Small Group Â· Mathematics Extension 1',
    newTags: ['Mathematics', 'Academic Growth'],
  },

  // PLACEHOLDER pr-67 â€” Mathematics group
  {
    id: 'pr-67',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Archer Liu',
    yearLevel: 'Year 8',
    result: { before: 'Shaky numeracy', after: 'Algebra confident' },
    outcomes: ['Foundation Secured', 'Algebra Confidence', 'Maths Growth'],
    preview: "I reached Year 8 with shaky multiplication tables. DA fixed the foundation and built up from there. By the end of the year I was doing algebra with confidence.",
    pullQuote: "You can't build up without a foundation. DA fixed mine.",
    story: "Shaky numeracy foundations cause problems that compound as mathematics gets more abstract. At DA the tutors identified the specific gaps and rebuilt without making me feel behind for having them.\n\nAlgebra had previously stumped me. By Year 8 end it was my strongest topic.",
    whyItWorked: [
      { n: '01', point: 'Numeracy foundation diagnosed and rebuilt', detail: 'Identifying specific calculation gaps allowed targeted rebuilding of Archer\'s mathematical base.' },
      { n: '02', point: 'Foundation work done without stigma', detail: 'Returning to primary-level numeracy in Year 8 was handled matter-of-factly. The absence of judgment made it possible.' },
      { n: '03', point: 'Compounding improvement from the base', detail: 'Once the numeracy foundation was solid, every algebra topic was learned faster than it would have been otherwise.' },
    ],
    learningFormat: 'Small Group Â· Year 8 Mathematics',
    newTags: ['Mathematics', 'Academic Growth'],
  },

  // PLACEHOLDER pr-68 â€” Mathematics group
  {
    id: 'pr-68',
    subject: 'Mathematics',
    category: 'HSC Mathematics Extension 2',
    author: 'Willow Park',
    yearLevel: 'Year 12',
    result: { before: 'E2', after: 'E3â€“E4' },
    outcomes: ['E3â€“E4 Ext 2', 'Advanced Calculus', 'HSC Success'],
    preview: "Extension 2 felt like a different language. DA helped me learn that language â€” and my mark moved from E2 to E3â€“E4 in the HSC.",
    pullQuote: "Extension 2 Mathematics is a different language. DA taught me to speak it.",
    story: "At DA my tutor helped me approach Extension 2 concepts not as harder versions of familiar topics, but as genuinely new mathematical ideas.\n\nThat reframing made everything more learnable. The E3â€“E4 result reflected a genuine change in my mathematical understanding.",
    whyItWorked: [
      { n: '01', point: 'Extension 2 treated as genuinely new', detail: 'Approaching content as novel reduced frustration from applying familiar but insufficient methods.' },
      { n: '02', point: 'Complex calculus built step by step', detail: 'Each technique was developed in order of difficulty, ensuring each step was secure before the next was introduced.' },
      { n: '03', point: 'Abstract thinking developed deliberately', detail: 'Extension 2 requires mathematical abstraction. That capacity was built alongside the content.' },
    ],
    learningFormat: 'Small Group Â· HSC Mathematics Extension 2',
    newTags: ['Mathematics', 'HSC Success'],
  },

  // PLACEHOLDER pr-69 â€” Mathematics group
  {
    id: 'pr-69',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Finn Nguyen',
    yearLevel: 'Year 9',
    result: { before: 'Feared maths', after: 'Enjoys maths' },
    outcomes: ['Maths Enjoyment', 'Grade Improvement', 'Confidence'],
    preview: "I used to get a knot in my stomach at the thought of a maths lesson. DA removed the fear so completely that I now actually look forward to maths.",
    pullQuote: "I used to dread maths. Now I look forward to it. That is not something I expected to say.",
    story: "Maths anxiety is real and limiting. At DA the tutors created an environment where being wrong was safe â€” and somehow that safety made getting things right easier.\n\nThe fear went first. The grades came after.",
    whyItWorked: [
      { n: '01', point: 'Mathematical safety before challenge', detail: 'An environment where wrong answers are welcomed allows students to take the risks that produce learning.' },
      { n: '02', point: 'Success experiences front-loaded', detail: 'Early sessions focused on topics where Finn could succeed â€” building a positive relationship with maths.' },
      { n: '03', point: 'Fear as the primary target', detail: 'Addressing the emotional barrier to maths produced grade improvements as a secondary outcome â€” which is more sustainable.' },
    ],
    learningFormat: 'Small Group Â· Year 9 Mathematics',
    newTags: ['Mathematics', 'Confidence'],
  },

  // PLACEHOLDER pr-70 â€” Mathematics group
  {
    id: 'pr-70',
    subject: 'Mathematics',
    category: 'Mathematics Advanced',
    author: 'Lyra Chen',
    yearLevel: 'Year 11',
    result: { before: 'Rank 30th', after: 'Rank 7th' },
    outcomes: ['Rank Jump', 'Advanced Maths', 'Exam Technique'],
    preview: "My cohort rank in Mathematics Advanced went from 30th to 7th in one year. The tutors at DA identified specific exam technique issues that were costing me marks.",
    pullQuote: "Specific exam technique feedback moved my rank more than any amount of content revision had.",
    story: "I understood the mathematics but wasn't earning the marks my understanding warranted. At DA the tutors identified exactly where exam marks were being lost.\n\nRank 7 from Rank 30. Technique, not content, was the difference.",
    whyItWorked: [
      { n: '01', point: 'Exam technique audited systematically', detail: 'Going through past papers as if marking Lyra\'s work revealed patterns of lost marks that content revision couldn\'t address.' },
      { n: '02', point: 'Mark allocation understood deeply', detail: 'Knowing exactly where markers award marks changed how Lyra structured her solutions.' },
      { n: '03', point: 'Technique gap larger than content gap', detail: 'When content is understood but marks don\'t reflect that, technique is almost always the cause.' },
    ],
    learningFormat: 'Small Group Â· Year 11 Mathematics',
    newTags: ['Mathematics', 'Academic Growth'],
  },

  // PLACEHOLDER pr-71 â€” Mathematics group
  {
    id: 'pr-71',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Quinn Wong',
    yearLevel: 'Year 7',
    result: { before: 'Anxious about high school maths', after: 'Strong Year 7 finish' },
    outcomes: ['Strong Start', 'Maths Foundation', 'Confidence'],
    preview: "Year 7 maths was intimidating after primary school. DA made the transition feel manageable â€” and I finished Year 7 with one of the strongest results in my class.",
    pullQuote: "The transition to high school maths was less frightening with DA behind me.",
    story: "High school mathematics is a step change from primary school. At DA I was prepared for that step before I took it â€” and supported through it once it began.\n\nFinishing Year 7 with one of the strongest maths results in my class was more than I had hoped for going in.",
    whyItWorked: [
      { n: '01', point: 'Year 7 transition supported from day one', detail: 'Beginning support at the start of Year 7 prevented the difficulties many students experience in the first months.' },
      { n: '02', point: 'Primary habits replaced with secondary ones', detail: 'Learning the different conventions and methods of high school mathematics early removed confusion.' },
      { n: '03', point: 'Strong Year 7 sets trajectory', detail: 'A positive first year in high school maths establishes habits and expectations that compound positively across all subsequent years.' },
    ],
    learningFormat: 'Small Group Â· Year 7 Mathematics',
    newTags: ['Mathematics', 'Confidence'],
  },

  // PLACEHOLDER pr-72 â€” Mathematics group
  {
    id: 'pr-72',
    subject: 'Mathematics',
    category: 'HSC Mathematics Advanced',
    author: 'River Kim',
    yearLevel: 'Year 12',
    result: { before: 'Band 4', after: 'Band 6' },
    outcomes: ['Band 6 Maths', 'HSC Advanced', 'Exam Confidence'],
    preview: "I was a Band 4 Mathematics student for all of Year 11. DA lifted me to Band 6 in the HSC. Every session had a clear purpose I could see.",
    pullQuote: "Every session had a clear purpose I could see. That made the hard work feel worth it.",
    story: "Band 4 to Band 6 in Mathematics Advanced requires real effort across a full year. At DA the work was hard â€” but always purposeful.\n\nBand 6 in the HSC. That result came from a year of directed, purposeful effort.",
    whyItWorked: [
      { n: '01', point: 'Purpose embedded in every session', detail: 'River always knew what each session was for and how it connected to the Band 6 goal. That connection sustained effort.' },
      { n: '02', point: 'Pathway mapped explicitly', detail: 'Breaking the gap into monthly milestones gave River a visible path forward rather than a single distant destination.' },
      { n: '03', point: 'Hard work made sustainable', detail: 'Effort without direction produces burnout. Directed effort toward a clear goal produces results and stays sustainable.' },
    ],
    learningFormat: 'Small Group Â· HSC Mathematics Advanced',
    newTags: ['Mathematics', 'Band 6 Results'],
  },

  // PLACEHOLDER pr-73 â€” Science group
  {
    id: 'pr-73',
    subject: 'Science',
    category: 'HSC Physics',
    author: 'Blake Tran',
    yearLevel: 'Year 11',
    result: { before: 'Failing Physics', after: 'B+ average' },
    outcomes: ['B+ Physics', 'Science Recovery', 'Conceptual Clarity'],
    preview: "Physics was failing me â€” or I was failing Physics. DA helped me find the conceptual clarity that made the mathematics finally make sense.",
    pullQuote: "Once the concepts made sense, the mathematics of Physics stopped being intimidating.",
    story: "Physics punishes students who try to memorise without understanding. At DA I was taught the concepts properly â€” the mathematics then became a natural expression of understanding.\n\nB+ average in Physics by Year 11 end. Concepts first, calculations second.",
    whyItWorked: [
      { n: '01', point: 'Concepts before calculations', detail: 'Blake was taught to understand first and calculate second â€” producing learning rather than guessing.' },
      { n: '02', point: 'Mathematical and physical reasoning integrated', detail: 'The connection between a physical situation and its mathematical description was made explicit in every topic.' },
      { n: '03', point: 'Failed attempts repurposed as diagnosis', detail: 'Incorrect answers were used as diagnostic information rather than as signs of failure.' },
    ],
    learningFormat: 'Small Group Â· HSC Physics',
    newTags: ['Science', 'Academic Growth'],
  },

  // PLACEHOLDER pr-74 â€” Science group
  {
    id: 'pr-74',
    subject: 'Science',
    category: 'Science',
    author: 'Sage Liu',
    yearLevel: 'Year 9',
    result: { before: 'D average', after: 'B+ average' },
    outcomes: ['B+ Science', 'Grade Recovery', 'Exam Skills'],
    preview: "I went from a D average to B+ in Science across a single term at DA. The tutors showed me that exam answers have a structure that can be learned â€” and I learned it.",
    pullQuote: "Science exam answers have a learnable structure. Once I knew it, the D average became a B+.",
    story: "D grades in Science came from knowing the content but not knowing how to express it in exams. At DA the tutors showed me exactly what examiners want to see.\n\nOne term. D to B+. The content knowledge was always there. The expression was the gap.",
    whyItWorked: [
      { n: '01', point: 'Exam expression vs. content knowledge', detail: 'Sage knew more than her marks showed. DA addressed the gap between understanding and exam performance directly.' },
      { n: '02', point: 'Answer structure templates', detail: 'Having a clear template for each question type removed uncertainty that had produced inconsistent responses.' },
      { n: '03', point: 'One term sufficient', detail: 'When the diagnosis is accurate and the intervention is targeted, rapid improvement is achievable within a single term.' },
    ],
    learningFormat: 'Small Group Â· Year 9 Science',
    newTags: ['Science', 'Academic Growth'],
  },

  // PLACEHOLDER pr-75 â€” Science group
  {
    id: 'pr-75',
    subject: 'Science',
    category: 'HSC Chemistry',
    author: 'Phoenix Nguyen',
    yearLevel: 'Year 12',
    result: { before: 'Band 3', after: 'Band 5' },
    outcomes: ['Band 5 Chemistry', 'Organic Chemistry', 'HSC Science'],
    preview: "Organic Chemistry was the topic that was sinking my HSC Chemistry result. DA turned it from my worst topic to one of my most reliable. Band 3 to Band 5 in the HSC.",
    pullQuote: "Organic Chemistry went from my worst topic to one of my most reliable.",
    story: "Organic Chemistry is the topic most students find hardest in HSC Chemistry. At DA my tutor broke it into a logical structure that made the patterns visible.\n\nBand 3 to Band 5 in the HSC. Organic Chemistry was one of my strongest topics by exam day.",
    whyItWorked: [
      { n: '01', point: 'Pattern recognition in organic chemistry', detail: 'Teaching Phoenix to see the patterns made memorisation unnecessary and reduced apparent complexity.' },
      { n: '02', point: 'Weakest topic made a strength', detail: 'Turning the topic most likely to cost band marks into a reliable strength had a disproportionate impact on the result.' },
      { n: '03', point: 'Systematic approach to mechanisms', detail: 'Understanding why reactions happen â€” not just that they do â€” produced the depth Band 5 answers require.' },
    ],
    learningFormat: 'Small Group Â· HSC Chemistry',
    newTags: ['Science', 'Band 6 Results'],
  },

  // PLACEHOLDER pr-76 â€” Science group
  {
    id: 'pr-76',
    subject: 'Science',
    category: 'HSC Biology',
    author: 'Sterling Park',
    yearLevel: 'Year 10',
    result: { before: 'C+', after: 'A in Biology' },
    outcomes: ['A Grade Biology', 'HSC Preparation', 'Science Growth'],
    preview: "I started studying Biology at DA in Year 10 to prepare for the HSC. I ended Year 10 with an A â€” higher than I'd managed in any science subject before.",
    pullQuote: "Starting HSC preparation in Year 10 gave me a head start I didn't know I needed.",
    story: "Starting Biology tuition in Year 10 rather than Year 11 gave me time to build understanding without exam pressure. At DA the foundation I built across Year 10 made the Year 11 content approachable from day one.\n\nYear 10 ended with my strongest science result ever. Year 11 started with confidence.",
    whyItWorked: [
      { n: '01', point: 'Pre-HSC preparation across two years', detail: 'Beginning in Year 10 allowed HSC content to be built in a lower-pressure environment.' },
      { n: '02', point: 'Biology frameworks established early', detail: 'The conceptual frameworks for HSC Biology were understood before Year 11 exam pressure arrived.' },
      { n: '03', point: 'Confidence entering Year 11', detail: 'Starting Year 11 with already-familiar content is a significant advantage early preparation produces reliably.' },
    ],
    learningFormat: 'Small Group Â· Science',
    newTags: ['Science', 'Academic Growth'],
  },

  // PLACEHOLDER pr-77 â€” Science group
  {
    id: 'pr-77',
    subject: 'Science',
    category: 'HSC Biology',
    author: 'Ember Chen',
    yearLevel: 'Year 11',
    result: { before: 'Overwhelmed by content volume', after: 'Top of cohort' },
    outcomes: ['Top of Cohort', 'Biology Excellence', 'Content Mastery'],
    preview: "Biology has the highest content volume of any HSC science. DA gave me a system for managing that volume â€” and I topped my cohort at Year 11 end.",
    pullQuote: "Biology is about managing volume. DA gave me the system to do that, and the rest followed.",
    story: "HSC Biology requires managing an enormous amount of content. At DA I was given a systematic approach to organising and retaining it that made the volume manageable.\n\nTopping my cohort at Year 11 end came from applying that system consistently across the whole year.",
    whyItWorked: [
      { n: '01', point: 'Content management system taught', detail: 'Organising biology by syllabus dot points with built-in retrieval practice transformed the volume from overwhelming to manageable.' },
      { n: '02', point: 'Active recall over passive re-reading', detail: 'Ember was taught to test herself rather than re-read â€” producing significantly better retention of high-volume content.' },
      { n: '03', point: 'Consistent review schedule', detail: 'A structured review cycle ensured content learned at the start of the year remained accessible by the exam.' },
    ],
    learningFormat: 'Small Group Â· HSC Biology',
    newTags: ['Science', 'Study Habits'],
  },

  // PLACEHOLDER pr-78 â€” Science group
  {
    id: 'pr-78',
    subject: 'Science',
    category: 'HSC Physics',
    author: 'Cedar Wong',
    yearLevel: 'Year 12',
    result: { before: 'Band 4', after: 'Band 6' },
    outcomes: ['Band 6 Physics', 'Quantum Understanding', 'HSC Science'],
    preview: "Quantum mechanics in Physics was the topic I was dreading most. DA made it the topic I was most confident in by the HSC. Band 4 to Band 6.",
    pullQuote: "DA turned quantum mechanics from the thing I was dreading most into my most confident topic.",
    story: "Quantum mechanics and special relativity are the most conceptually challenging parts of HSC Physics. At DA my tutor spent real time building the conceptual foundation before touching the mathematics.\n\nBand 4 to Band 6 in the HSC. And quantum mechanics was the topic I answered first.",
    whyItWorked: [
      { n: '01', point: 'Concepts before formulas', detail: 'Understanding what quantum mechanics is actually saying before learning the equations produced deeper and more durable understanding.' },
      { n: '02', point: 'Difficult topics given proportionate time', detail: 'Topics generating most exam anxiety received the most preparation time.' },
      { n: '03', point: 'Hardest topic became most confident', detail: 'When a student\'s weakest area becomes their strongest, the overall effect on performance is disproportionately positive.' },
    ],
    learningFormat: 'Small Group Â· HSC Physics',
    newTags: ['Science', 'Band 6 Results'],
  },

  // PLACEHOLDER pr-79 â€” Science group
  {
    id: 'pr-79',
    subject: 'Science',
    category: 'Science',
    author: 'Luna Kim',
    yearLevel: 'Year 8',
    result: { before: 'Reluctant', after: 'Science Club member' },
    outcomes: ['Science Passion', 'Extra-Curricular', 'Confidence'],
    preview: "I joined Science Club in Year 8 because of the interest DA sparked. I wouldn't have thought to do that before â€” I barely wanted to attend science class.",
    pullQuote: "I joined Science Club because of the curiosity DA sparked. That was not on my agenda when I enrolled.",
    story: "Reluctance toward science was turned into genuine curiosity at DA. My tutor made experiments something I looked forward to rather than survived.\n\nJoining Science Club was my own idea â€” which means the interest was real, not performed.",
    whyItWorked: [
      { n: '01', point: 'Experiments as hooks for understanding', detail: 'Starting with observable phenomena and working back to theory made science feel real, not just a syllabus.' },
      { n: '02', point: 'Tutor modelled scientific curiosity', detail: 'When teachers demonstrate genuine enthusiasm for their subject, students are influenced by that enthusiasm.' },
      { n: '03', point: 'Science as community activity', detail: 'Joining Science Club extends learning beyond the classroom and builds connections with like-minded students.' },
    ],
    learningFormat: 'Small Group Â· Year 8 Science',
    newTags: ['Science', 'Confidence'],
  },

  // PLACEHOLDER pr-80 â€” Science group
  {
    id: 'pr-80',
    subject: 'Science',
    category: 'HSC Science Dual',
    author: 'Atlas Tran',
    yearLevel: 'Year 12',
    result: { before: 'Band 3 Chemistry & Biology', after: 'Band 5 both' },
    outcomes: ['Band 5 Chemistry & Biology', 'Dual Science', 'HSC Success'],
    preview: "Two HSC sciences at Band 3 going into the final term. DA helped me lift both to Band 5 by exam day. The tailored support across two subjects in parallel was exceptional.",
    pullQuote: "Two Band 3s going in. Two Band 5s coming out. DA made both possible simultaneously.",
    story: "Managing two HSC sciences at Band 3 required a plan I couldn't have built alone. At DA two specialists worked on Chemistry and Biology in parallel.\n\nBoth results moved to Band 5 by the HSC. The coordination between tutors made that possible.",
    whyItWorked: [
      { n: '01', point: 'Parallel subject specialists coordinated', detail: 'Two tutors who communicated about Atlas\'s overall workload meant neither subject was advanced at the expense of the other.' },
      { n: '02', point: 'Shared study strategies across subjects', detail: 'Techniques that worked in Chemistry were adapted for Biology â€” reducing cognitive load of managing two approaches simultaneously.' },
      { n: '03', point: 'Final term focused and targeted', detail: 'With limited time remaining, sessions were exclusively HSC-format questions answered in marking-criteria style.' },
    ],
    learningFormat: 'Small Group Â· HSC Science Dual',
    newTags: ['Science', 'HSC Success'],
  },
];

const REVIEW_TAGS = [
  'All Reviews',
  'Band 6 Results', 'HSC Success', 'Confidence', 'Teacher Support',
  'Study Habits', 'Academic Growth', 'Parent Feedback',
  'English', 'Mathematics', 'Science',
] as const;

// Filter map â€” every keyword shows exactly 8 unique students.
// No student appears in more than one filter (except 'All Reviews' which shows the 8 real reviews).
// Real reviews (cr-1 to cr-8): exclusively in 'All Reviews'.
// Placeholders (pr-01 to pr-80): each assigned to exactly one filter â€” replace with verified testimonials.
const FILTER_MAP: Record<string, string[]> = {
  'All Reviews':    ['cr-1','cr-2','cr-3','cr-4','cr-5','cr-6','cr-7','cr-8'],
  'Band 6 Results': ['pr-01','pr-02','pr-05','pr-07','pr-15','pr-17','pr-20','pr-23'],
  'HSC Success':    ['pr-10','pr-12','pr-22','pr-24','pr-25','pr-26','pr-27','pr-28'],
  'Confidence':     ['pr-04','pr-06','pr-08','pr-11','pr-13','pr-29','pr-30','pr-31'],
  'Teacher Support':['pr-03','pr-16','pr-32','pr-33','pr-34','pr-35','pr-36','pr-37'],
  'Study Habits':   ['pr-09','pr-18','pr-19','pr-38','pr-39','pr-40','pr-41','pr-42'],
  'Academic Growth':['pr-14','pr-21','pr-43','pr-44','pr-45','pr-46','pr-47','pr-48'],
  'Parent Feedback':['pr-49','pr-50','pr-51','pr-52','pr-53','pr-54','pr-55','pr-56'],
  'English':        ['pr-57','pr-58','pr-59','pr-60','pr-61','pr-62','pr-63','pr-64'],
  'Mathematics':    ['pr-65','pr-66','pr-67','pr-68','pr-69','pr-70','pr-71','pr-72'],
  'Science':        ['pr-73','pr-74','pr-75','pr-76','pr-77','pr-78','pr-79','pr-80'],
};

type ReviewRecord = typeof CAROUSEL_REVIEWS[0];

// â”€â”€ Story modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StoryModal({ review, onClose }: { review: ReviewRecord; onClose: () => void }) {
  const easeOut = [0.22, 1, 0.36, 1] as const;
  const r = review;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* â”€â”€ Very subtle backdrop â€” page remains clearly visible â”€â”€ */}
      <motion.div
        key="story-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(10,27,52,0.18)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 1000,
        }}
      />

      {/* â”€â”€ Scroll container â”€â”€ */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 'clamp(16px,3.5vw,48px) clamp(16px,4vw,40px)',
        }}
        onClick={onClose}
      >
        {/* â”€â”€ Panel â€” card morphs into this via layoutId â”€â”€ */}
        <motion.div
          layoutId={`review-card-${r.id}`}
          layout
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '660px',
            background: '#FFFFFF',
            borderRadius: '20px',
            overflow: 'hidden',
            // Layered shadow â€” depth without obscuring the page
            boxShadow: [
              '0 2px 4px rgba(10,27,52,0.04)',
              '0 8px 24px rgba(10,27,52,0.08)',
              '0 24px 64px rgba(10,27,52,0.13)',
              '0 0 0 1px rgba(10,27,52,0.06)',
            ].join(', '),
          }}
        >
          {/* Gold accent bar at top â€” same language as the cards */}
          <div style={{
            height: '3px',
            background: `linear-gradient(90deg, ${C.gold}, ${C.gold}30)`,
          }} />

          {/* â”€â”€ HEADER â”€â”€ */}
          <div style={{ padding: 'clamp(24px,3.5vw,40px) clamp(24px,3.5vw,40px) 0' }}>

            {/* Top row: eyebrow + close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.20, duration: 0.22 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: sans, fontSize: '8px', fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase' as const,
                  color: C.gold,
                  background: 'rgba(212,175,55,0.09)',
                  border: '1px solid rgba(212,175,55,0.22)',
                  borderRadius: '100px', padding: '3px 11px',
                }}>{r.subject}</span>
                <span style={{
                  fontFamily: sans, fontSize: '9px', fontWeight: 400,
                  letterSpacing: '0.08em', color: 'rgba(10,27,52,0.38)',
                }}>{r.yearLevel} Â· {r.category}</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close story"
                style={{
                  width: '30px', height: '30px', flexShrink: 0,
                  background: 'rgba(10,27,52,0.05)',
                  border: '1px solid rgba(10,27,52,0.09)',
                  borderRadius: '50%',
                  color: 'rgba(10,27,52,0.45)',
                  fontFamily: sans, fontSize: '16px', fontWeight: 300,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1, padding: 0,
                }}
              >Ã—</button>
            </motion.div>

            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.16, duration: 0.30, ease: easeOut }}
              style={{
                fontFamily: serif, fontWeight: 300,
                fontSize: 'clamp(1.9rem,4vw,3.0rem)',
                letterSpacing: '-0.022em', lineHeight: 1.07,
                color: C.navy, margin: '0 0 24px',
              }}
            >
              {r.author}
            </motion.h2>

            {/* Before â†’ After â€” cream/gold, no navy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.20, duration: 0.26, ease: easeOut }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center', gap: '10px',
                marginBottom: '22px',
              }}
            >
              <div style={{
                background: C.cream2,
                border: '1px solid rgba(10,27,52,0.07)',
                borderRadius: '10px', padding: '13px 16px',
              }}>
                <div style={{ fontFamily: sans, fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(10,27,52,0.35)', marginBottom: '5px' }}>Before</div>
                <div style={{ fontFamily: serif, fontSize: 'clamp(1.0rem,1.6vw,1.18rem)', fontWeight: 300, color: 'rgba(10,27,52,0.60)', lineHeight: 1.2 }}>{r.result.before}</div>
              </div>
              <span style={{ color: C.gold, fontSize: '18px', fontWeight: 300, textAlign: 'center' as const, lineHeight: 1 }}>â†’</span>
              <div style={{
                background: 'rgba(212,175,55,0.07)',
                border: '1px solid rgba(212,175,55,0.20)',
                borderRadius: '10px', padding: '13px 16px',
              }}>
                <div style={{ fontFamily: sans, fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(212,175,55,0.75)', marginBottom: '5px' }}>After</div>
                <div style={{ fontFamily: serif, fontSize: 'clamp(1.0rem,1.6vw,1.18rem)', fontWeight: 500, color: C.navy, lineHeight: 1.2 }}>{r.result.after}</div>
              </div>
            </motion.div>

            {/* Outcome pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.22, duration: 0.24 }}
              style={{
                display: 'flex', flexWrap: 'wrap', gap: '5px',
                paddingBottom: '24px',
                borderBottom: '1px solid rgba(10,27,52,0.07)',
              }}
            >
              {r.outcomes.map(o => (
                <span key={o} style={{
                  fontFamily: sans, fontSize: '10px', fontWeight: 600,
                  color: 'rgba(10,27,52,0.62)',
                  background: 'rgba(10,27,52,0.04)',
                  border: '1px solid rgba(10,27,52,0.07)',
                  borderRadius: '5px', padding: '4px 9px',
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                }}>
                  <span style={{ color: C.gold, fontSize: '11px' }}>âœ“</span> {o}
                </span>
              ))}
            </motion.div>
          </div>

          {/* â”€â”€ BODY â”€â”€ */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.26, duration: 0.34, ease: easeOut }}
            style={{ padding: 'clamp(22px,3vw,32px) clamp(24px,3.5vw,40px) clamp(28px,3.5vw,40px)' }}
          >
            {/* Section label */}
            <div style={{
              fontFamily: sans, fontSize: '9px', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase' as const,
              color: 'rgba(10,27,52,0.30)', marginBottom: '16px',
            }}>In Their Own Words</div>

            {/* Story paragraphs */}
            {r.story.split('\n\n').map((para, i) => (
              <p key={i} style={{
                fontFamily: serif, fontWeight: 300,
                fontSize: 'clamp(1.0rem,1.5vw,1.12rem)',
                lineHeight: 1.80, color: C.navy,
                margin: i > 0 ? '16px 0 0' : '0',
              }}>{para}</p>
            ))}

            {/* Pull quote â€” left border, cream background */}
            <div style={{
              background: C.cream2,
              borderLeft: `3px solid ${C.gold}`,
              borderRadius: '0 10px 10px 0',
              padding: 'clamp(18px,2.5vw,26px) clamp(16px,2.5vw,24px)',
              margin: 'clamp(24px,3vw,36px) 0',
            }}>
              <p style={{
                fontFamily: serif, fontStyle: 'italic', fontWeight: 300,
                fontSize: 'clamp(1.0rem,1.6vw,1.18rem)',
                lineHeight: 1.62, color: C.navy, margin: 0,
              }}>
                <span style={{ color: C.gold, fontSize: '1.35em', lineHeight: 0, verticalAlign: '-0.20em', marginRight: '0.05em', opacity: 0.65 }}>&ldquo;</span>
                {r.pullQuote}
              </p>
            </div>

            {/* Why it worked */}
            <div style={{ marginBottom: 'clamp(24px,3vw,36px)' }}>
              <div style={{
                fontFamily: sans, fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase' as const,
                color: 'rgba(10,27,52,0.30)', marginBottom: '18px',
              }}>Why It Worked</div>
              {r.whyItWorked.map((w, wi) => (
                <div key={w.n} style={{
                  display: 'grid', gridTemplateColumns: '22px 1fr',
                  gap: '12px',
                  paddingTop: wi > 0 ? '16px' : '0',
                  borderTop: wi > 0 ? '1px solid rgba(10,27,52,0.06)' : 'none',
                }}>
                  <span style={{ fontFamily: serif, fontSize: '11px', fontStyle: 'italic', color: C.gold, paddingTop: '2px', lineHeight: 1.4 }}>{w.n}</span>
                  <div>
                    <div style={{ fontFamily: sans, fontSize: '11.5px', fontWeight: 600, color: C.navy, marginBottom: '3px', lineHeight: 1.4 }}>{w.point}</div>
                    <div style={{ fontFamily: sans, fontSize: '11.5px', fontWeight: 300, color: 'rgba(10,27,52,0.52)', lineHeight: 1.72 }}>{w.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning format â€” centred, rules each side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(24px,3vw,36px)' }}>
              <div style={{ height: '1px', flex: 1, background: 'rgba(10,27,52,0.07)' }} />
              <span style={{
                fontFamily: sans, fontSize: '9px', fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase' as const,
                color: 'rgba(10,27,52,0.36)',
              }}>{r.learningFormat}</span>
              <div style={{ height: '1px', flex: 1, background: 'rgba(10,27,52,0.07)' }} />
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center' as const }}>
              <a
                href="/interview"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: C.navy, color: '#FFFFFF',
                  fontFamily: sans, fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.16em', textTransform: 'uppercase' as const,
                  textDecoration: 'none',
                  borderRadius: '100px', padding: '14px 28px',
                  transition: 'background 0.22s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#172f5c'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = C.navy; }}
              >
                Begin Your Child's Story <span style={{ color: C.gold }}>â†’</span>
              </a>
              <p style={{
                fontFamily: sans, fontWeight: 300, fontSize: '10px',
                letterSpacing: '0.06em', color: 'rgba(10,27,52,0.32)',
                margin: '12px 0 0',
              }}>
                Book a Principal Interview with Amanda Le
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// â”€â”€ Reviews section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  WHAT WE TEACH â€” Editorial subject tiles
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

interface SubjectTileProps {
  label: string;
  icon: string;
  desc: string;
  img: string;
  href: string;
  height: string;
  delay: number;
  inView: boolean;
}

const SubjectTile = ({ label, icon, desc, img, href, height, delay, inView }: SubjectTileProps) => {
  const [hovered, setHovered] = useState(false);
  const easeOut = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: easeOut }}
      style={{ flex: '1 1 0', minWidth: 0 }}
    >
      <Link
        to={href}
        style={{ display: 'block', textDecoration: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          borderRadius: '28px',
          overflow: 'hidden',
          height,
          position: 'relative',
          cursor: 'pointer',
          boxShadow: hovered
            ? '0 36px 80px rgba(10,27,52,0.22), 0 8px 24px rgba(10,27,52,0.12)'
            : '0 8px 32px rgba(10,27,52,0.10)',
          transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease',
        }}>
          {/* Photo */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img
              src={img}
              alt={label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: hovered ? 'scale(1.06)' : 'scale(1.0)',
                transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </div>

          {/* Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: hovered
              ? 'linear-gradient(170deg, rgba(10,27,52,0.18) 0%, rgba(10,27,52,0.72) 55%, rgba(10,27,52,0.88) 100%)'
              : 'linear-gradient(170deg, rgba(10,27,52,0.28) 0%, rgba(10,27,52,0.78) 55%, rgba(10,27,52,0.92) 100%)',
            transition: 'background 0.5s ease',
          }} />

          {/* Top badge */}
          <div style={{
            position: 'absolute',
            top: '22px',
            left: '22px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(10,27,52,0.50)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: `1px solid ${C.gold}45`,
            borderRadius: '100px',
            padding: '6px 14px 6px 10px',
          }}>
            <span style={{ fontSize: '13px', lineHeight: 1 }}>{icon}</span>
            <span style={{
              fontFamily: sans,
              fontSize: '.65rem',
              fontWeight: 800,
              letterSpacing: '.14em',
              textTransform: 'uppercase' as const,
              color: C.white,
            }}>{label}</span>
          </div>

          {/* Bottom content */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '28px 26px',
          }}>
            <p style={{
              fontFamily: sans,
              fontSize: '.90rem',
              lineHeight: 1.68,
              color: 'rgba(255,255,255,0.78)',
              margin: '0 0 18px',
            }}>{desc}</p>

            {/* Hover CTA */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              <span style={{
                fontFamily: sans,
                fontSize: '.68rem',
                fontWeight: 800,
                letterSpacing: '.14em',
                textTransform: 'uppercase' as const,
                color: C.gold,
              }}>Explore</span>
              <span style={{ color: C.gold, fontSize: '13px', fontWeight: 700 }}>â†’</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// â”€â”€ Gold particle accent â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GoldParticle = ({ x, y, size, opacity, duration, delay }: {
  x: string; y: string; size: number; opacity: number; duration: number; delay: number;
}) => (
  <motion.div
    style={{
      position: 'absolute',
      left: x, top: y,
      width: size, height: size,
      borderRadius: '50%',
      background: C.gold,
      opacity,
      pointerEvents: 'none',
    }}
    animate={{ y: [0, -18, 0], opacity: [opacity, opacity * 0.35, opacity] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const TEACH_PARTICLES = [
  { x: '7%',  y: '18%', size: 3,   opacity: 0.18, duration: 7,   delay: 0    },
  { x: '14%', y: '65%', size: 2,   opacity: 0.12, duration: 9,   delay: 1.2  },
  { x: '28%', y: '82%', size: 4,   opacity: 0.10, duration: 11,  delay: 0.5  },
  { x: '52%', y: '10%', size: 2.5, opacity: 0.16, duration: 8,   delay: 2.1  },
  { x: '68%', y: '74%', size: 3,   opacity: 0.13, duration: 10,  delay: 0.8  },
  { x: '81%', y: '30%', size: 2,   opacity: 0.15, duration: 6.5, delay: 1.7  },
  { x: '92%', y: '55%', size: 3.5, opacity: 0.10, duration: 9.5, delay: 3.0  },
  { x: '45%', y: '90%', size: 2,   opacity: 0.14, duration: 8.5, delay: 2.5  },
];

const TILES = [
  {
    label: 'Mathematics',
    icon: 'ðŸ“',
    desc: 'Build confidence through understanding, problem solving and logical thinking.',
    img: '/images/community/subject_maths.jpg',
    href: '/subjects/mathematics',
    height: '580px',
  },
  {
    label: 'English',
    icon: 'ðŸ“–',
    desc: 'Develop confident readers, writers and communicators who love ideas.',
    img: '/images/community/subject_english.jpg',
    href: '/subjects/english',
    height: '500px',
  },
  {
    label: 'Science',
    icon: 'ðŸ§ª',
    desc: 'Discover the world through curiosity, investigation and experimentation.',
    img: '/images/community/subject_science.jpg',
    href: '/subjects/science',
    height: '540px',
  },
];

const WhatWeTeachSection = () => {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const easeOut = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={ref}
      aria-label="What we teach"
      style={{
        background: C.cream,
        paddingTop:    'clamp(80px, 9vw, 120px)',
        paddingBottom: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gold particles */}
      {TEACH_PARTICLES.map((p, i) => <GoldParticle key={i} {...p} />)}

      {/* â”€â”€ Heading â”€â”€ */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.95, ease: easeOut }}
        style={{
          textAlign: 'center',
          padding: '0 clamp(24px, 6vw, 80px)',
          marginBottom: 'clamp(48px, 5.5vw, 72px)',
        }}
      >
        <div style={{
          fontFamily: sans, fontWeight: 700,
          fontSize: '.70rem', letterSpacing: '.17em',
          textTransform: 'uppercase' as const, color: C.gold,
          marginBottom: '14px',
        }}>
          What We Teach
        </div>

        <h2 style={{
          fontFamily: serif, fontWeight: 300,
          fontSize: 'clamp(2.4rem, 4.2vw, 4rem)',
          letterSpacing: '-.028em', lineHeight: 1.07,
          color: C.navy, margin: '0 0 20px',
        }}>
          Expert tuition in{' '}
          <em style={{ fontStyle: 'italic', color: C.gold }}>every subject</em>
        </h2>

        <p style={{
          fontFamily: sans,
          fontSize: 'clamp(1rem, 1.4vw, 1.12rem)',
          color: C.muted,
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.78,
        }}>
          From strong foundations to academic excellence through personalised learning.
        </p>
      </motion.div>

      {/* â”€â”€ Editorial tiles â”€â”€ */}
      <div style={{
        padding: '0 clamp(20px, 5vw, 64px)',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'clamp(14px, 1.5vw, 20px)',
        flexWrap: 'wrap' as const,
      }}>
        {TILES.map((tile, i) => (
          <SubjectTile
            key={tile.label}
            {...tile}
            delay={i * 0.15}
            inView={inView}
          />
        ))}
      </div>

      {/* â”€â”€ Cream â†’ Navy gradient transition â”€â”€ */}
      <div style={{
        marginTop: 'clamp(56px, 6vw, 88px)',
        height: '160px',
        background: `linear-gradient(180deg, ${C.cream} 0%, ${C.navy} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gold light streaks */}
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: 'absolute',
            width: '1px',
            height: `${28 + i * 12}px`,
            background: `linear-gradient(180deg, transparent, ${C.gold}55, transparent)`,
            left: `${12 + i * 19}%`,
            top: '15%',
            opacity: 0.5,
          }} />
        ))}
        {/* Small dots at midpoint */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            width: '3px', height: '3px',
            borderRadius: '50%',
            background: C.gold,
            opacity: 0.25,
            left: `${25 + i * 25}%`,
            top: '42%',
          }} />
        ))}
      </div>
    </section>
  );
};


const ReviewsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-60px' });

  const [selected,     setSelected]     = useState<ReviewRecord | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All Reviews');
  const [fading,       setFading]       = useState(false);

  const easeOut = [0.22, 1, 0.36, 1] as const;

  const filteredReviews = CAROUSEL_REVIEWS.filter(r =>
    (FILTER_MAP[activeFilter] ?? []).includes(r.id)
  );

  const handleFilterChange = (tag: string) => {
    if (tag === activeFilter) return;
    setFading(true);
    setTimeout(() => {
      setActiveFilter(tag);
      setFading(false);
    }, 180);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Family reviews"
      style={{
        background:    C.cream,
        paddingTop:    'clamp(80px,9vw,120px)',
        paddingBottom: 'clamp(80px,9vw,120px)',
      }}
    >
      {/* â”€â”€ Header â”€â”€ */}
      <div style={{ padding: '0 clamp(24px,6vw,80px)', marginBottom: 'clamp(32px,4vw,48px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: easeOut }}
        >
          <div style={{
            fontFamily: sans, fontWeight: 700,
            fontSize: '.70rem', letterSpacing: '.17em',
            textTransform: 'uppercase' as const, color: C.gold,
            marginBottom: '16px',
          }}>
            Families Love DA
          </div>
          <h2 style={{
            fontFamily: serif, fontWeight: 300,
            fontSize: 'clamp(2.4rem,4.0vw,4.4rem)',
            letterSpacing: '-.028em', lineHeight: 1.08,
            color: C.navy, margin: 0,
          }}>
            450 Five-Star Reviews
          </h2>
        </motion.div>
      </div>

      {/* â”€â”€ Tag filters â”€â”€ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.80, delay: 0.12, ease: easeOut }}
        style={{
          padding: '0 clamp(24px,6vw,80px)',
          marginBottom: 'clamp(36px,4vw,52px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {REVIEW_TAGS.map((tag) => {
          const isActive = activeFilter === tag;
          return (
            <button
              key={tag}
              onClick={() => handleFilterChange(tag)}
              style={{
                height: '34px',
                padding: '0 16px',
                borderRadius: '100px',
                border: `1.5px solid ${isActive ? C.gold : 'rgba(10,27,52,0.16)'}`,
                background: isActive ? C.gold : 'transparent',
                color: isActive ? '#FFFFFF' : 'rgba(10,27,52,0.58)',
                fontFamily: sans, fontWeight: 500,
                fontSize: '.65rem', letterSpacing: '.12em',
                textTransform: 'uppercase' as const,
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)',
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
            </button>
          );
        })}
      </motion.div>

      {/* â”€â”€ Card grid â”€â”€ */}
      <style>{`
        .rv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 1100px) { .rv-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px)  { .rv-grid { grid-template-columns: 1fr; } }
      `}</style>
      <motion.div
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: 0.18 }}
        style={{ padding: '0 clamp(24px,6vw,80px)' }}
      >
        <div className="rv-grid">
          {filteredReviews.map((r, i) => (
            <motion.div
              key={r.id}
              layoutId={`review-card-${r.id}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: selected?.id === r.id ? 0 : 1, y: 0 } : {}}
              transition={{ duration: 0.70, delay: Math.min(i * 0.06, 0.24), ease: easeOut }}
              onClick={() => !selected && setSelected(r)}
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid rgba(10,27,52,0.07)',
                boxShadow: '0 1px 10px rgba(10,27,52,0.05)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column' as const,
                cursor: 'pointer',
                visibility: selected?.id === r.id ? 'hidden' : 'visible',
              }}
            >
              {/* Stars + Subject pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span style={{ color: C.gold, fontSize: '11px', letterSpacing: '0.08em' }}>â˜…â˜…â˜…â˜…â˜…</span>
                <span style={{
                  fontFamily: sans, fontSize: '8px', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  color: C.gold, background: 'rgba(212,175,55,0.09)',
                  border: '1px solid rgba(212,175,55,0.20)',
                  borderRadius: '100px', padding: '3px 10px',
                }}>{r.subject}</span>
              </div>

              {/* Name */}
              <p style={{ fontFamily: serif, fontSize: '19px', fontWeight: 400, color: C.navy, lineHeight: 1.2, margin: '0 0 4px' }}>
                {r.author}
              </p>

              {/* Year Â· Category */}
              <p style={{ fontFamily: sans, fontSize: '11px', color: 'rgba(10,27,52,0.42)', margin: '0 0 16px', letterSpacing: '0.03em' }}>
                {r.yearLevel} Â· {r.category}
              </p>

              {/* Result box */}
              <div style={{
                background: C.cream2,
                borderRadius: '8px', padding: '12px 14px', marginBottom: '14px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontFamily: sans, fontSize: '11px', color: 'rgba(10,27,52,0.38)', whiteSpace: 'nowrap' }}>{r.result.before}</span>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>â†’</span>
                <span style={{ fontFamily: sans, fontSize: '13px', color: C.navy, fontWeight: 800, whiteSpace: 'nowrap' }}>{r.result.after}</span>
              </div>

              {/* Outcomes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px' }}>
                {r.outcomes.map(o => (
                  <span key={o} style={{
                    fontFamily: sans, fontSize: '10px', fontWeight: 600,
                    color: 'rgba(10,27,52,0.62)', background: 'rgba(10,27,52,0.04)',
                    border: '1px solid rgba(10,27,52,0.06)', borderRadius: '4px',
                    padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}>
                    <span style={{ color: C.gold, fontSize: '11px' }}>âœ“</span> {o}
                  </span>
                ))}
              </div>

              {/* Gold divider */}
              <div style={{ height: '1px', background: `linear-gradient(90deg, ${C.gold}55, ${C.gold}08)`, marginBottom: '16px' }} />

              {/* Preview quote */}
              <p style={{
                fontFamily: serif, fontWeight: 300, fontStyle: 'italic',
                fontSize: '14.5px', lineHeight: 1.65, color: C.navy,
                margin: '0 0 16px', flex: 1,
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
              } as React.CSSProperties}>
                <span style={{ color: C.gold, fontSize: '1.2em', lineHeight: 0, verticalAlign: '-0.16em', marginRight: '0.04em', opacity: 0.60 }}>&ldquo;</span>
                {r.preview}
              </p>

              {/* Read Full Story */}
              <div style={{
                fontFamily: sans, fontWeight: 600,
                fontSize: '9.5px', letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: C.gold,
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                marginTop: 'auto',
              }}>
                Read Full Story â†’
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* â”€â”€ Modal â”€â”€ */}
      <AnimatePresence>
        {selected && (
          <StoryModal
            key={selected.id}
            review={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {/* â”€â”€ Footer â”€â”€ */}
      <div style={{
        padding: 'clamp(52px,7vw,80px) clamp(24px,6vw,80px) 0',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px',
      }}>
        <a
          href="https://www.google.com/maps/place/DA+Tuition/@-33.8717491,150.9282683,17z/data=!4m8!3m7!1s0x6b12bd1e45e49a8b:0x69b2c4a45f28e5a7!8m2!3d-33.8717491!4d150.9282683!9m1!1b1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontFamily: sans, fontWeight: 400,
            fontSize: '.72rem', letterSpacing: '.16em',
            textTransform: 'uppercase' as const,
            color: 'rgba(10,27,52,0.58)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(10,27,52,0.20)',
            paddingBottom: '3px',
            transition: 'color 0.22s ease, border-color 0.22s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = C.navy;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(10,27,52,0.50)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(10,27,52,0.58)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(10,27,52,0.20)';
          }}
        >
          View All Google Reviews
          <span style={{ fontSize: '.85em', opacity: 0.70 }}>â†—</span>
        </a>
      </div>
    </section>
  );
};


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  AWARD RECOGNITION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  TEACHERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const TeachersSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <section ref={ref} style={{ background: C.cream, padding: '100px 24px' }}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={{ textAlign: 'center', marginBottom: '52px' }}>
        <div style={{ fontFamily: sans, fontSize: '.7rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: C.gold, marginBottom: '14px' }}>Our Team</div>
        <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 'clamp(2rem,4vw,3.4rem)', color: C.navy, letterSpacing: '-.02em' }}>Expert Educators</h2>
      </motion.div>
      <motion.div variants={fadeIn} initial="hidden" animate={inView ? 'visible' : 'hidden'}><TeachersPreview /></motion.div>
    </section>
  );
};


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CLOSING CTA
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const ClosingCTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <section ref={ref} style={{ background: '#0A1B34', padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '24px', right: '24px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,.25) 20%, rgba(212,175,55,.25) 80%, transparent)' }} />
      <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={{ maxWidth: '680px', margin: '0 auto' }}>
        <motion.div variants={fadeUp} style={{ fontFamily: sans, fontSize: '.68rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' as const, color: C.gold, marginBottom: '20px' }}>
          Book a Consultation
        </motion.div>
        <motion.h2 variants={fadeUp} style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2.2rem,4.5vw,3.6rem)', letterSpacing: '-.02em', lineHeight: 1.1, color: C.white, marginBottom: '22px' }}>
          Ready to find the right program for your child?
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontFamily: sans, fontWeight: 300, fontSize: '.95rem', lineHeight: 1.88, color: 'rgba(250,250,248,.72)', marginBottom: '44px', maxWidth: '520px', margin: '0 auto 44px' }}>
          Book an interview with our principal. In 30 minutes we will understand your child's needs and match them to the right class, teacher, and starting point.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            to="/book-interview"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'linear-gradient(135deg, #D4AF37, #F0C86A)',
              color: '#0A1B34',
              fontFamily: sans, fontWeight: 800,
              fontSize: '.82rem', letterSpacing: '.08em', textTransform: 'uppercase' as const,
              padding: '16px 44px', borderRadius: '50px',
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(212,175,55,.35)',
              transition: 'box-shadow .3s ease',
            }}
          >
            Book an Interview
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PAGE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const Index = () => (
  <div style={{ fontFamily: sans, overflowX: 'clip' }}>
    <Confetti />
    <SEO canonicalUrl="/" jsonLd={[organizationSchema(), localBusinessSchema(siteStats.reviewCount)]} />
    <NavigationNew />
    <main>
      <HeroSection />
      <MarqueeStrip />
      <PhilosophyBackedSection />
      <ImpactRecognitionSection />
      <AchievementsSection />
      <ProgramsSection />
      <QuoteSection />
      <WellbeingSection />
      <DAEnvironmentSection />
      <CinematicQuoteSection />
      <WhatWeTeachSection />
      <ReviewsSection />

      <TeachersSection />
      <ClosingCTASection />
    </main>
    <FooterNew />
  </div>
);

export default Index;
