/**
 * Index.tsx — DA Tuition Homepage
 * Premium private-school inspired design with Awwwards-style animations.
 * Inspired by: korowa.vic.edu.au
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, GraduationCap, School, Play, X } from 'lucide-react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useAnimationControls, useMotionValue, animate as fmAnimate } from 'framer-motion';
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

// ─── Design tokens ────────────────────────────────────────────
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

// ─── Animation variants ────────────────────────────────────────
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

// ─── Section wrapper (scroll-triggered stagger) ───────────────
const Reveal = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={style}>
      {children}
    </motion.div>
  );
};

// ─── Section label + title block ──────────────────────────────
const SectionHead = ({ tag, title, light = false, center = true }: {
  tag: string; title: React.ReactNode; light?: boolean; center?: boolean;
}) => (
  <motion.div variants={fadeUp} style={{ textAlign: center ? 'center' : 'left', marginBottom: '56px' }}>
    <div style={{ fontFamily: sans, fontSize: '.7rem', fontWeight: 700, letterSpacing: '.17em', textTransform: 'uppercase', color: C.gold, marginBottom: '14px' }}>{tag}</div>
    <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', letterSpacing: '-.02em', lineHeight: 1.08, color: light ? C.white : C.navy }}>{title}</h2>
  </motion.div>
);

// ══════════════════════════════════════════════════════════════
//  STATS — count-up + pop + confetti (fully self-contained)
// ══════════════════════════════════════════════════════════════
const confettiFired = { v: false };

/** Single animated number card — handles its own scroll observation */
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
        setCount(0);           // reset to 0 …
        setPopped(true);       // … and make the pop scale visible

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

    // Use IntersectionObserver — fires immediately if already in view
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

// ─── Marquee ───────────────────────────────────────────────────
const MARQUEE = ['Mathematics','English','Science','Legal Studies','Business Studies','HSC Excellence','20+ Years','650+ Students','5.0 ★ Rating','Award-Winning','Small Groups','Personalised Learning'];
const MarqueeStrip = () => (
  <div style={{ background: C.navy, borderTop: `1px solid rgba(212,175,55,.2)`, borderBottom: `1px solid rgba(212,175,55,.2)`, padding: '14px 0', overflow: 'hidden' }}>
    <div style={{ display: 'flex', animation: 'marq 30s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
      {[...MARQUEE, ...MARQUEE].map((t, i) => (
        <span key={i} style={{ fontFamily: sans, fontSize: '.74rem', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: C.gold, padding: '0 38px' }}>
          {t}<span style={{ color: 'rgba(212,175,55,.3)', marginLeft: 38 }}>◆</span>
        </span>
      ))}
    </div>
    <style>{`@keyframes marq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
  </div>
);

// ══════════════════════════════════════════════════════════════
//  HERO
// ══════════════════════════════════════════════════════════════
const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
      background: `radial-gradient(ellipse 55% 48% at 50% 36%, rgba(212,175,55,.11) 0%, transparent 68%),
                   linear-gradient(180deg, ${C.cream} 0%, ${C.cream2} 55%, #E8DCC8 100%)`,
    }}>
      {/* ── DA Crest — primary visual centrepiece ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
        transition={{
          opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
          scale:   { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' as const, delay: 1.4 },
        }}
        style={{ marginBottom: 'clamp(12px, 1.6vw, 20px)', position: 'relative' }}
      >
        {/* Soft gold halo */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140%', height: '140%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.05) 55%, transparent 75%)`,
          pointerEvents: 'none',
        }} />
        <img
          src="/images/da-logo.png"
          alt="DA Tuition"
          style={{
            width: 'clamp(160px, 20vw, 260px)',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            position: 'relative',
          }}
        />
      </motion.div>

      {/* ── Headline ── */}
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2rem, 3.4vw, 3.8rem)', lineHeight: 1.1, letterSpacing: '-.018em', color: C.navy, marginBottom: '40px', maxWidth: '640px' }}>
        Where Ambition Meets<br />
        <em style={{ fontStyle: 'italic', color: C.gold }}>Academic Excellence</em>
      </motion.h1>

      {/* ── Tagline ── */}
      <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ fontFamily: sans, fontSize: 'clamp(.85rem, 1.4vw, 1rem)', color: C.muted, marginBottom: '44px', letterSpacing: '.04em' }}>
        Trusted by Families. Transforming Futures.
      </motion.p>

      {/* CTA buttons */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.68 }}
        style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>

        <motion.button whileHover={{ scale: 1.03, background: 'rgba(10,27,52,.07)' }} whileTap={{ scale: 0.97 }}
          onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ fontFamily: sans, background: 'transparent', color: C.navy, border: `1.5px solid rgba(10,27,52,.30)`, padding: '14px 40px', borderRadius: '4px', fontSize: '.9rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          View Programs
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: sans, fontSize: '.6rem', letterSpacing: '.16em', textTransform: 'uppercase', color: C.muted }}>Scroll</span>
        <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
          style={{ width: '1px', height: '44px', background: `linear-gradient(180deg,${C.gold},transparent)` }} />
      </motion.div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  PHILOSOPHY BACKED BY RESULTS
// ══════════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────────────────────
//  PHILOSOPHY_STAGES — image replacement guide
//
//  Each stage has an `image` path. Current values are temporary placeholders
//  from the existing site photo library so the layout renders immediately.
//
//  When you have real DA photos, drop them into /public/images/philosophy/
//  and update ONLY the `image` field for each stage below.
//
//  Recommended spec per photo:
//    Size: 1200 × 800 px  |  Format: JPG  |  Max file size: 250 KB
//    Style: natural light, warm/neutral tones, candid (not posed)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
//  PHILOSOPHY_STAGES
//  Each stage is one chapter of the DA educational philosophy.
//
//  Image replacement guide
//  ───────────────────────
//  Drop photos into /public/images/philosophy/ then update the `image` field.
//  Recommended: 1600 × 1067 px  |  JPG  |  < 300 KB  |  natural, warm light
//
//  Stage 1 — ▶ REPLACE: student working alone, quiet focus, warm window light
//  Stage 2 — ▶ REPLACE: tutor one-on-one with student, attentive, close frame
//  Stage 3 — ▶ REPLACE: student actively engaged — hand up or mid-explanation
//  Stage 4 — ▶ REPLACE: warm tutor–student moment, encouraging, candid
// ─────────────────────────────────────────────────────────────────────────────
const PHILOSOPHY_STAGES = [
  {
    stage: 1,
    label: 'Known',
    title: 'Students deserve to be known before they are judged.',
    supporting: 'Every student arrives with a different story. We take the time to understand where they are — because the gap between their starting point and their potential is exactly where real growth lives.',
    image: '/images/v3/warm_interaction.jpg',
  },
  {
    stage: 2,
    label: 'Belief',
    title: 'Confidence often comes before achievement.',
    supporting: 'We have seen it hundreds of times: the moment a student believes they can, the results follow. Building that belief is not a side effect of our teaching — it is the purpose of it.',
    image: '/images/v3/classroom_active.jpg',
  },
  {
    stage: 3,
    label: 'Understanding',
    title: 'Understanding matters more than memorisation.',
    supporting: 'Real mastery is knowing why something works, not just that it does. We teach students to think deeply, so knowledge becomes theirs permanently — not just until the exam.',
    image: '/images/v3/small_group_tutoring.jpg',
  },
  {
    stage: 4,
    label: 'Growth',
    title: 'We strengthen the child behind the result.',
    supporting: 'Marks improve when students feel capable, seen, and guided. Our goal is not to chase grades — it is to build the resilience, curiosity, and self-belief that make sustained excellence possible.',
    image: '/images/v3/collaborative_learning.jpg',
  },
];

const STATS_DATA = [
  { target: 20,    decimals: 0, suffix: '+',  label: 'Years of Excellence', triggerDelay: 0   },
  { target: 10000, decimals: 0, suffix: '+',  label: 'Students Supported',  triggerDelay: 200 },
  { target: 5,     decimals: 1, suffix: ' ★', label: 'Google Rating',       triggerDelay: 400 },
  { target: 450,   decimals: 0, suffix: '+',  label: 'Five-Star Reviews',   triggerDelay: 600 },
];

// ── Subtle gold sparkle — particles radiate from the number ──
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

// ── Count-up number — re-triggers every time inView flips true ──
const CountUpStat = ({ target, decimals = 0, suffix, triggerDelay, inView }: {
  target: number; decimals?: number; suffix: string;
  triggerDelay: number; inView: boolean;
}) => {
  const reduced = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [count, setCount] = useState(reduced.current ? target : 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset to 0 when leaving viewport
    if (!inView) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (!reduced.current) setCount(0);
      return;
    }

    if (reduced.current) { setCount(target); return; }

    const timer = setTimeout(() => {
      const duration = 1800;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(eased * target);
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCount(target);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, triggerDelay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, target, triggerDelay]);

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

  // ── Auto-rotation ─────────────────────────────────────────────
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
  };;

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
        }

        /* ── Philosophy stage tabs ── */

        /* Suppress mobile tap flash */
        .phi-tab { -webkit-tap-highlight-color: transparent; }

        /* Number: default → hover → active */
        .phi-tab-num {
          color: rgba(212,175,55,.20);
          transition: color 220ms ease;
        }
        .phi-tab:not([aria-selected="true"]):hover .phi-tab-num {
          color: rgba(212,175,55,.50);
        }
        .phi-tab[aria-selected="true"] .phi-tab-num {
          color: #D4AF37;
          transition: color 650ms ease;
        }

        /* Label: default → hover → active */
        .phi-tab-lbl {
          color: rgba(212,175,55,.14);
          transition: color 220ms ease;
        }
        .phi-tab:not([aria-selected="true"]):hover .phi-tab-lbl {
          color: rgba(212,175,55,.38);
        }
        .phi-tab[aria-selected="true"] .phi-tab-lbl {
          color: rgba(212,175,55,.55);
          transition: color 650ms ease;
        }

        /* Keyboard focus: thin gold outline, no browser default */
        .phi-tab:focus-visible {
          outline: 1px solid rgba(212,175,55,.40);
          outline-offset: 6px;
          border-radius: 2px;
        }

        /* Reduced motion: kill colour transitions on the tabs */
        @media (prefers-reduced-motion: reduce) {
          .phi-tab-num,
          .phi-tab-lbl { transition: none !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
           PHILOSOPHY JOURNEY
           Two equal panels: image left, content right.
           No max-width — the image bleeds to the section edge,
           giving it the same visual weight as the text.
         ════════════════════════════════════════════════════════════ */}
      <div
        className="phi-journey"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          alignItems: 'stretch',
          minHeight: 'clamp(620px, 82vh, 960px)',
        }}
      >

        {/* ── IMAGE PANEL ─────────────────────────────────────────────
             All 4 images mounted, crossfade via CSS opacity.
             Right-edge gradient bleeds into the content panel.
             Image: saturate enough to feel real, not oversaturated.
          ── */}
        <div
          className="phi-img-col"
          style={{ position: 'relative', overflow: 'hidden', alignSelf: 'stretch' }}
        >
          {PHILOSOPHY_STAGES.map((stage, i) => (
            <img
              key={stage.stage}
              src={stage.image}
              alt=""
              aria-hidden="true"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center 30%',
                filter: 'saturate(0.62) brightness(0.92)',
                opacity: i === activeIndex ? 1 : 0,
                // Ken Burns: active image slowly zooms in over 7s; inactive resets quietly
                transform: i === activeIndex ? 'scale(1.035)' : 'scale(1)',
                transition: reducedMotion
                  ? 'none'
                  : i === activeIndex
                    ? 'opacity 1600ms ease-in-out, transform 7000ms ease-out'
                    : 'opacity 900ms ease-in-out, transform 1200ms ease-in-out',
              }}
            />
          ))}

          {/* Top vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(10,27,52,.32) 0%, transparent 28%)',
          }} />

          {/* Bottom vignette — grounds the image, prevents it floating */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(10,27,52,.50) 0%, transparent 38%)',
          }} />

          {/* Right-edge blend — image dissolves into the content panel */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to right, transparent 68%, rgba(10,27,52,.60) 84%, rgba(10,27,52,1) 100%)',
          }} />
        </div>

        {/* ── CONTENT PANEL ───────────────────────────────────────────
             Flex column: eyebrow + indicator pinned top.
             Spacer lets the image breathe between nav and statement.
             Philosophy text anchors to the lower third.
             Pause rotation on hover/focus (WCAG 2.2.2).
          ── */}
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
          {/* Left-edge gold hairline — separates panels on desktop */}
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
              fontFamily: sans, fontSize: '.58rem', fontWeight: 500,
              letterSpacing: '.28em', textTransform: 'uppercase' as const,
              color: 'rgba(212,175,55,.50)', margin: '0 0 22px',
            }}
          >
            Our Philosophy
          </motion.p>

          {/* ── Stage navigator ─────────────────────────────────────
               Number + label per stage. Active: full gold.
               Inactive: barely there (22% opacity).
               The track segment slides to the active position.
            ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.08, ease: 'easeOut' }}
            style={{ marginBottom: 'clamp(28px, 3.5vw, 40px)' }}
          >
            <div
              role="tablist"
              aria-label="Philosophy stages"
              style={{ display: 'flex', marginBottom: '12px' }}
            >
              {PHILOSOPHY_STAGES.map((stage, i) => (
                <button
                  ref={el => { tabRefs.current[i] = el; }}
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Show philosophy stage ${i + 1}: ${stage.label}`}
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
                  className="phi-tab"
                  style={{
                    flex: 1, background: 'none', border: 'none',
                    cursor: 'pointer', padding: '0 0 8px 0',
                    textAlign: 'left' as const,
                    display: 'flex', flexDirection: 'column', gap: '7px',
                  }}
                >
                  <span
                    className="phi-tab-num"
                    style={{
                      display: 'block',
                      fontFamily: serif, fontSize: '.68rem', fontWeight: 400,
                      letterSpacing: '.08em', lineHeight: 1,
                    }}
                  >
                    {String(stage.stage).padStart(2, '0')}
                  </span>
                  <span
                    className="phi-tab-lbl"
                    style={{
                      display: 'block',
                      fontFamily: sans, fontSize: '.56rem', fontWeight: 500,
                      letterSpacing: '.14em', textTransform: 'uppercase' as const,
                      lineHeight: 1,
                    }}
                  >
                    {stage.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Sliding track */}
            <div style={{ position: 'relative', height: '1px', background: 'rgba(212,175,55,.10)' }}>
              <div style={{
                position: 'absolute', top: 0, height: '1px',
                left: `${(activeIndex / PHILOSOPHY_STAGES.length) * 100}%`,
                width: `${(1 / PHILOSOPHY_STAGES.length) * 100}%`,
                background: C.gold,
                transition: reducedMotion ? 'none' : 'left 650ms cubic-bezier(0.22, 1, 0.36, 1)',
              }} />
            </div>
          </motion.div>

          {/* ── Philosophy statement ────────────────────────────────
               AnimatePresence mode="wait": old content exits fully
               before new content enters. Clean, sequential, editorial.
               Both exit (250ms) and enter (680ms) feel deliberate.
            ── */}
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
                fontSize: 'clamp(1.65rem, 2.6vw, 2.75rem)',
                lineHeight: 1.22, letterSpacing: '-.024em',
                color: C.white, margin: '0 0 24px',
              }}>
                {PHILOSOPHY_STAGES[activeIndex].title}
              </h2>

              {/* Thin gold separator — draws in after the headline settles */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '44px', opacity: 0.55 }}
                transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '1px', marginBottom: '22px',
                  background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                }}
              />

              {/* Supporting paragraph */}
              <p style={{
                fontFamily: sans, fontWeight: 300,
                fontSize: '.85rem', lineHeight: 1.82,
                color: 'rgba(250,250,248,.55)',
                letterSpacing: '.008em',
                margin: 0, maxWidth: '28em',
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

// ══════════════════════════════════════════════════════════════
//  IMPACT & RECOGNITION
//  Dark navy, premium school prospectus aesthetic.
//  Left: award display + modal.  Right: 2×2 stats grid.
// ══════════════════════════════════════════════════════════════
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

          /* ── Pillar cards (cream background) ────────────────────────── */
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

          /* ── Award image inner container — matches video 4/3 frame ─── */
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

          /* ── Award frame ────────────────────────────────────────────── */
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

          /* ── Recognition story lead ──────────────────────────────────── */
          .ir-story-lead {
            border-left: 2px solid rgba(212,175,55,.24);
            padding-left: 20px;
          }

          /* ── Video thumbnail ─────────────────────────────────────────── */
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

          {/* ── FULL-WIDTH HEADER ───────────────────────────────────────── */}
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
              For more than twenty years, DA families have watched their children grow —
              in confidence first, then in results. This recognition reflects what those
              families experienced, and what the wider community came to see.
            </motion.p>
          </div>

          {/* ── MEDIA GRID: award image | video thumbnail ────────────────── */}
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

            {/* ── Award image ───────────────────────────────────────────── */}
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
                    alt="Fairfield City Local Business Awards — Outstanding Education Service, Winner 2025"
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
                  Winner — Outstanding Education Service 2025
                </motion.p>
              </div>
            </motion.div>

            {/* ── Video thumbnail ───────────────────────────────────────── */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.10, delay: 0.46, ease }}
            >
              <div
                className="ir-thumb-wrap"
                role="button"
                tabIndex={0}
                aria-label="Watch the DA Tuition award ceremony — 45 seconds"
                onClick={() => setModalOpen(true)}
                onKeyDown={e => e.key === 'Enter' && setModalOpen(true)}
              >
                <div className="ir-thumb-frame">
                  <img
                    src="/Photos and Videos/EP6_0216.jpg"
                    alt="Award ceremony footage — DA Tuition Outstanding Education Service 2025"
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

      {/* ── CINEMATIC VIDEO MODAL ───────────────────────────────────── */}
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
            aria-label="Award ceremony video — Outstanding Education Service"
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
            {/* Close — fixed top-right corner */}
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

            {/* Content wrapper — stops click-through to backdrop */}
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
              {/* ── Title card ─────────────────────────────────────────── */}
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

              {/* ── Video frame ────────────────────────────────────────── */}
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

              {/* ── Caption below video ─────────────────────────────────── */}
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

// ══════════════════════════════════════════════════════════════
//  ACHIEVEMENTS — standalone statistics section
//  Navy background, off-white + gold palette.
// ══════════════════════════════════════════════════════════════

const ACH_STATS = [
  { target: 20,    decimals: 0, suffix: '+', caption: 'TWO DECADES OF GUIDANCE' },
  { target: 10000, decimals: 0, suffix: '+', caption: 'STUDENTS SUPPORTED'      },
  { target: 5,     decimals: 1, suffix: '',  caption: 'TRUSTED BY FAMILIES'     },
  { target: 450,   decimals: 0, suffix: '+', caption: 'FIVE-STAR STORIES'       },
];

const AchievementsSection = () => {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: false, margin: '-100px' });
  const easeHero = [0.16, 1, 0.3,  1] as const;
  const easeOut  = [0.22, 1, 0.36, 1] as const;

  // Each stat's absolute position within the stage container.
  // top values create the staircase; left creates the left-to-right drift.
  const pos = [
    { left: '2%',  top:   0, delay: 0.00 },
    { left: '27%', top: 180, delay: 0.18 },
    { left: '52%', top: 330, delay: 0.36 },
    { left: '76%', top: 470, delay: 0.54 },
  ];

  // Number sizes: first stat larger for visual hierarchy
  const numSizes = [
    'clamp(5.8rem, 10.5vw, 13.0rem)',
    'clamp(4.8rem,  8.8vw, 10.5rem)',
    'clamp(4.8rem,  8.8vw, 10.5rem)',
    'clamp(4.8rem,  8.8vw, 10.5rem)',
  ];

  // Journey line: smooth bezier through the approximate center of each number.
  // ViewBox 0 0 1000 720 — scaled to fill the stage container.
  // Anchor points (x, y):
  //   Stat 0 → (130, 90)   left=2% of 1000 + half stat width~110 = 130;  top 0  + ~90
  //   Stat 1 → (380, 255)  left=270+110=380;  top 180 + ~75
  //   Stat 2 → (630, 405)  left=520+110=630;  top 330 + ~75
  //   Stat 3 → (870, 545)  left=760+110=870;  top 470 + ~75
  // S-curve: each segment uses symmetric control points so the curve arrives
  // horizontally at each anchor — feels organic, not chart-like.
  const journeyPath =
    'M 130 90 C 255 90 255 255 380 255 C 505 255 505 405 630 405 C 755 405 755 545 870 545';

  return (
    <section
      ref={ref}
      aria-label="DA Tuition achievements"
      style={{ background: C.navy, overflow: 'hidden' }}
    >
      <style>{`
        /* ── Mobile: collapse absolute stage to flow grid ── */
        @media (max-width: 760px) {
          .ach-stage {
            position: static !important;
            min-height: auto !important;
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 52px 24px !important;
            padding-bottom: 0 !important;
          }
          .ach-stat {
            position: static !important;
            width: auto !important;
            left: auto !important;
            top: auto !important;
          }
          .ach-journey { display: none !important; }
        }
        @media (max-width: 440px) {
          .ach-stage { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: 'clamp(80px, 9vw, 120px) clamp(24px, 5vw, 80px)',
      }}>

        {/* ── Heading ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 6vw, 96px)',
          alignItems: 'end',
          marginBottom: 'clamp(56px, 8vw, 96px)',
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1.20, ease: easeHero }}
            style={{
              fontFamily: serif, fontWeight: 300,
              fontSize: 'clamp(2.6rem, 4.2vw, 5.0rem)',
              lineHeight: 1.10, letterSpacing: '-.030em',
              color: '#F5F0E8', margin: 0,
            }}
          >
            When Confidence<br />Grows, Results<br />Follow.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.10, delay: 0.14, ease: easeOut }}
            style={{
              fontFamily: sans, fontWeight: 300,
              fontSize: 'clamp(.88rem, 1.1vw, 1.0rem)',
              lineHeight: 1.84,
              color: 'rgba(245,240,232,.36)',
              margin: 0,
            }}
          >
            For more than twenty years, DA Tuition has helped students
            build confidence, strengthen their habits, and achieve
            meaningful academic growth — one family at a time.
          </motion.p>
        </div>

        {/* ── Stats stage — absolute positioning creates the true staircase ── */}
        <div
          className="ach-stage"
          style={{
            position: 'relative',
            minHeight: '720px',
            paddingBottom: '40px',
          }}
        >
          {/* ── Gold journey line — thin SVG bezier, draws in on scroll ── */}
          <svg
            className="ach-journey"
            aria-hidden="true"
            viewBox="0 0 1000 720"
            preserveAspectRatio="none"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
              overflow: 'visible',
            }}
          >
            <motion.path
              d={journeyPath}
              fill="none"
              stroke="rgba(212,175,55,0.20)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 2.4, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
            {/* Small gold dots at each anchor — appear as the line draws through */}
            {[
              { cx: 130, cy:  90 },
              { cx: 380, cy: 255 },
              { cx: 630, cy: 405 },
              { cx: 870, cy: 545 },
            ].map((pt, i) => (
              <motion.circle
                key={i}
                cx={pt.cx}
                cy={pt.cy}
                r={3.5}
                fill="rgba(212,175,55,0.45)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.40, delay: 0.90 + i * 0.22 }}
              />
            ))}
          </svg>

          {/* ── Stat cells ── */}
          {ACH_STATS.map((s, i) => (
            <motion.div
              key={i}
              className="ach-stat"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 1.15, delay: pos[i].delay, ease: easeOut }}
              style={{
                position: 'absolute',
                left: pos[i].left,
                top: pos[i].top,
                width: '22%',
                zIndex: 1,
              }}
            >
              {/* Number — large italic serif */}
              <div style={{
                fontFamily: serif, fontWeight: 300,
                fontStyle: 'italic',
                fontSize: numSizes[i],
                lineHeight: 1,
                letterSpacing: '-.040em',
                color: i === 0 ? C.goldL : '#F5F0E8',
                marginBottom: 'clamp(18px, 2.2vw, 30px)',
                whiteSpace: 'nowrap',
              }}>
                <CountUpStat
                  target={s.target}
                  decimals={s.decimals}
                  suffix={i === 2 ? '' : s.suffix}
                  triggerDelay={Math.round(pos[i].delay * 1000)}
                  inView={inView}
                />
                {i === 2 && (
                  <span style={{
                    fontStyle: 'normal',
                    fontSize: '0.36em',
                    verticalAlign: '0.80em',
                    lineHeight: 1,
                    marginLeft: '0.10em',
                    color: C.gold,
                    letterSpacing: 0,
                  }}>★</span>
                )}
              </div>

              {/* Divider — gold for first, ivory for rest */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                  duration: 0.80,
                  delay: pos[i].delay + 0.22,
                  ease: [0.25, 1, 0.5, 1],
                }}
                style={{
                  height: '1px',
                  background: i === 0
                    ? 'linear-gradient(90deg, rgba(212,175,55,.65), rgba(212,175,55,.08))'
                    : 'linear-gradient(90deg, rgba(245,240,232,.26), transparent)',
                  transformOrigin: 'left',
                  marginBottom: 'clamp(16px, 2.0vw, 22px)',
                }}
              />

              {/* Caption — uppercase, letter-spaced, clearly readable */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.90, delay: pos[i].delay + 0.38 }}
                style={{
                  fontFamily: sans, fontWeight: 500,
                  fontSize: 'clamp(.80rem, 1.0vw, .94rem)',
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: i === 0
                    ? 'rgba(232,192,64,.88)'
                    : 'rgba(245,240,232,.66)',
                  margin: 0, lineHeight: 1.7,
                }}
              >
                {s.caption}
              </motion.p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  PROGRAMS
// ══════════════════════════════════════════════════════════════
const PROGRAMS = [
  { Icon: School,          href: '/programs/primary-school', sub: 'Years 3–6',   name: 'Primary School', desc: 'Building strong foundations in literacy, numeracy, and the curiosity to learn.' },
  { Icon: BookOpen,        href: '/programs/high-school',    sub: 'Years 7–10',  name: 'High School',    desc: 'Mastering core subjects with depth, examination technique, and real confidence.' },
  { Icon: GraduationCap,  href: '/hsc-excellence',          sub: 'Years 11–12', name: 'HSC Excellence', desc: 'Elite Band 6 preparation with structured study plans and expert guidance.' },
];
const ProgramsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <section id="programs" ref={ref} style={{ background: C.cream, padding: '120px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Reveal><SectionHead tag="Academic Programs" title="Tailored for Every Stage" /></Reveal>
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
          {PROGRAMS.map((p, i) => (
            <Link key={i} to={p.href} style={{ textDecoration: 'none', display: 'block' }}>
              <motion.div variants={fadeUp}
                whileHover={{ y: -7, boxShadow: '0 24px 64px rgba(10,27,52,.13)' }}
                style={{ background: '#fff', border: `1px solid rgba(212,175,55,.16)`, borderRadius: '16px', padding: '44px 36px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(10,27,52,.06)', transition: 'box-shadow .35s', height: '100%' }}>
                <p.Icon style={{ width: 28, height: 28, color: '#D4AF37', marginBottom: '22px' }} />
                <div style={{ fontFamily: sans, fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: C.gold, marginBottom: '8px', fontWeight: 700 }}>{p.sub}</div>
                <h3 style={{ fontFamily: serif, fontSize: '1.65rem', fontWeight: 600, color: C.navy, marginBottom: '12px' }}>{p.name}</h3>
                <p style={{ fontFamily: sans, fontSize: '.88rem', color: C.muted, lineHeight: 1.72 }}>{p.desc}</p>
                <div style={{ marginTop: '26px', fontFamily: sans, fontSize: '.8rem', fontWeight: 700, color: C.gold, display: 'flex', alignItems: 'center', gap: '6px' }}>Learn more <span>→</span></div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};


// ══════════════════════════════════════════════════════════════
//  THE DA DIFFERENCE — premium philosophy section
// ══════════════════════════════════════════════════════════════
const PHI_CARDS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="10" r="5" stroke="#D4AF37" strokeWidth="1.4"/>
        <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#D4AF37" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Personal Connection',
    body1: "Unlike large tutoring centres where students can become just another enrolment, our small classes allow us to understand each student's strengths, challenges and goals.",
    body2: 'Students are known by name, supported individually and encouraged to grow at their own pace.',
    img: '/images/v3/warm_interaction.jpg',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 4 L14 8 M8.5 6.5 L11.5 9.5 M5 13 L9 13 M8.5 19.5 L11.5 16.5 M14 20 L14 24 M17.5 16.5 L20.5 19.5 M19 13 L23 13 M17.5 9.5 L20.5 6.5" stroke="#D4AF37" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="14" cy="13" r="4" stroke="#D4AF37" strokeWidth="1.4"/>
      </svg>
    ),
    title: 'Confidence Before Results',
    body1: 'Academic success begins with confidence. We create an environment where students feel comfortable asking questions, making mistakes and embracing challenges.',
    body2: 'By developing resilience and self-belief, students become more engaged learners both inside and outside the classroom.',
    img: '/images/v3/classroom_active.jpg',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 22 L14 6 L22 22" stroke="#D4AF37" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 17 L19.5 17" stroke="#D4AF37" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Excellence Through Understanding',
    body1: 'We focus on deep understanding rather than memorisation. Through personalised guidance, expert teaching and structured progression, students learn how to think critically and solve problems independently.',
    body2: 'The result is not just better grades — but genuine academic confidence and lifelong capability.',
    img: '/images/v3/collaborative_learning.jpg',
  },
];

const PhiCard = ({ card, index, inView }: { card: typeof PHI_CARDS[0]; index: number; inView: boolean }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay: 0.1 + index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(212,175,55,.3)' : 'rgba(10,27,52,.07)'}`,
        boxShadow: hovered
          ? '0 40px 100px rgba(10,27,52,.12), 0 8px 32px rgba(10,27,52,.08)'
          : '0 2px 20px rgba(10,27,52,.05)',
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'all .55s cubic-bezier(.22,1,.36,1)',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
      }}>

      {/* Image — fades up from bottom, softly */}
      <div style={{
        position: 'relative',
        height: hovered ? 240 : 0,
        overflow: 'hidden',
        transition: 'height .65s cubic-bezier(.22,1,.36,1)',
        flexShrink: 0,
      }}>
        <img src={card.img} alt={card.title} style={{
          width: '100%', height: 240, objectFit: 'cover',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1.04)' : 'scale(1.08)',
          transition: 'opacity .6s ease, transform .9s ease',
          display: 'block',
        }} />
        {/* Soft fade to white at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to bottom, transparent 0%, #fff 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Card body */}
      <div style={{ padding: '48px 44px 52px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Icon */}
        <div style={{
          marginBottom: 28,
          opacity: hovered ? 1 : 0.6,
          transition: 'opacity .4s',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}>
          {card.icon}
        </div>

        {/* Gold rule — expands on hover */}
        <div style={{
          width: hovered ? 48 : 24, height: 1.5, borderRadius: 2,
          background: `linear-gradient(90deg, #D4AF37, transparent)`,
          marginBottom: 28,
          transition: 'width .5s cubic-bezier(.22,1,.36,1)',
        }} />

        {/* Heading */}
        <h3 style={{
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 'clamp(1.5rem,2.4vw,2rem)',
          color: C.navy,
          letterSpacing: '-.02em',
          lineHeight: 1.15,
          marginBottom: 20,
          transition: 'color .3s',
        }}>{card.title}</h3>

        {/* Body paragraph 1 */}
        <p style={{
          fontFamily: sans,
          fontSize: '.9rem',
          lineHeight: 1.82,
          color: 'rgba(10,27,52,.55)',
          marginBottom: 16,
        }}>{card.body1}</p>

        {/* Body paragraph 2 — slightly more prominent */}
        <p style={{
          fontFamily: sans,
          fontSize: '.9rem',
          lineHeight: 1.82,
          color: hovered ? 'rgba(10,27,52,.75)' : 'rgba(10,27,52,.45)',
          fontStyle: 'italic',
          marginTop: 'auto',
          paddingTop: 16,
          borderTop: `1px solid ${hovered ? 'rgba(212,175,55,.2)' : 'rgba(10,27,52,.06)'}`,
          transition: 'color .4s, border-color .4s',
        }}>{card.body2}</p>
      </div>
    </motion.div>
  );
};

const WhySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{
      background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F0EA 50%, #FAFAF8 100%)',
      padding: '160px 32px 180px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(10,27,52,.028) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 52 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 40 }}>

          <h2 style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: 'clamp(2.6rem,6vw,5.6rem)',
            color: C.navy,
            letterSpacing: '-.03em',
            lineHeight: 1.05,
          }}>
            Every student deserves<br />
            to be{' '}
            <em style={{
              fontStyle: 'italic',
              color: 'transparent',
              backgroundImage: `linear-gradient(135deg, #8B6914, ${C.gold}, #D4AF37)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}>known.</em>
          </h2>
        </motion.div>

        {/* Thin gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 56, height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            margin: '0 auto 44px',
          }} />

        {/* ── Intro paragraph ── */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: 'clamp(1rem,1.6vw,1.18rem)',
            color: 'rgba(10,27,52,.52)',
            lineHeight: 1.88,
            maxWidth: 640,
            margin: '0 auto 100px',
            textAlign: 'center',
            letterSpacing: '.008em',
          }}>
          At DA Tuition, we believe students achieve their best when they feel genuinely supported, personally understood, and confidently challenged. Our goal is not simply better grades, but the development of capable, resilient and independent learners.
        </motion.p>

        {/* ── Three cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
          alignItems: 'stretch',
        }}>
          {PHI_CARDS.map((c, i) => (
            <PhiCard key={i} card={c} index={i} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
};


// ══════════════════════════════════════════════════════════════
//  PULL QUOTE
// ══════════════════════════════════════════════════════════════
const QuoteSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section ref={ref} style={{ background: C.navy, padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '80px', background: `linear-gradient(180deg,transparent,${C.gold})` }} />
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '80px', background: `linear-gradient(180deg,${C.gold},transparent)` }} />
      <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div variants={fadeUp} style={{ fontFamily: serif, fontSize: '4rem', color: 'rgba(212,175,55,.3)', lineHeight: 1, marginBottom: '16px' }}>❝</motion.div>
        <motion.p variants={fadeUp} style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.44, color: C.white, letterSpacing: '.01em' }}>
          My daughter went from dreading maths to topping her class. DA Tuition didn't just improve her grades — they gave her back her confidence.
        </motion.p>
        <motion.div variants={fadeUp} style={{ width: '40px', height: '1px', background: C.gold, margin: '32px auto 18px' }} />
        <motion.p variants={fadeUp} style={{ fontFamily: sans, fontSize: '.74rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(212,175,55,.80)', fontWeight: 600 }}>
          Parent of Year 10 Student — Google Review, 5 Stars
        </motion.p>
      </motion.div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  REVIEWS — premium editorial carousel
// ══════════════════════════════════════════════════════════════

// Tags map each review to the 5 filter categories
const CAROUSEL_REVIEWS = [
  {
    id: 'cr-1',
    tags: ['Results', 'Tutors', 'HSC'],
    category: 'HSC English',
    author: 'Katelin Trinh',
    yearLevel: 'Year 12',
    preview: "From 15th to 6th in my final HSC ranking — and Band 5–6 across every English assessment. Miss Jenny didn't just lift my marks; she gave me a genuine love for the subject.",
    full: "I am so grateful for DA Tuition for helping me improve my English results and boosting my confidence in the subject. My tutor Ms Jenny has been exceptionally patient, kind, knowledgeable and always willing to go above and beyond for her students to succeed. Thanks to her, I had a drastic improvement in my assessment rank, moving from 15th to 6th in my final HSC assessment, and I received Band 5–6 across all my English assignments. Beyond academics, Ms Jenny also inspired me to develop a genuine passion for English. The staff are incredibly friendly and supportive, and the learning environment is excellent. Highly recommended to anyone looking to excel.",
  },
  {
    id: 'cr-2',
    tags: ['Confidence', 'Results', 'Family', 'HSC'],
    category: 'HSC Mathematics',
    author: 'Bryant Lam',
    yearLevel: 'Year 12',
    preview: "Eight years at DA. Five Band 6s in the HSC. The tutors here don't just teach subjects — they help you fall in love with learning.",
    full: "Being a student at DA for the last 8 years has been an absolute life changer. DA has guided and supported me to achieve academic excellence — first through the selective school program, then all the way through the HSC. Despite having confidence issues in my academic abilities, these tutors drew out my best ability and motivated me to strive for success. Ms Amanda's passion for mathematics was infectious and made me hungry to improve. Through DA I achieved five Band 6s in the HSC exam and the ATAR that made my parents proud. If you're looking for a place to develop a strong foundation and achieve your maximum potential, DA is the place for you.",
  },
  {
    id: 'cr-3',
    tags: ['Confidence', 'Family'],
    category: 'A Place of Family',
    author: 'Lisa Vu',
    yearLevel: 'Year 12',
    preview: "I began as a below-average student who received detentions and hated school. Eight years later, I leave with a bright future ahead — and a gratitude I will carry for life.",
    full: "DA Tuition is not just an educational environment but a place of upbringing and encouragement. As a committed student of 8 years, DA staff are not just teachers but family — promoters of success who bring out the best in every individual. Initially, I was a below-average student who did not concern myself with success. By being with Miss Linda, she advanced my understanding of what it means to be prosperous, guiding me through hard times by not only lifting my grades but also my perspective. I am now looking forward to a bright future, in gratitude and appreciation to all the tutors I have had. Lisa Vu — Cecil Hills High School — Year 12",
  },
  {
    id: 'cr-4',
    tags: ['Confidence', 'Results', 'Tutors'],
    category: 'Mathematics',
    author: 'Emily Nguyen',
    yearLevel: '',
    preview: "I used to be an above-average student at best. After joining DA in Year 5, I now achieve marks in the high 90s — 2nd in my grade, and 100% on my most recent exam.",
    full: "I've been going to DA Tuition since Year 5, and I can't explain how much this place has helped me improve academically throughout the years. With the help of Miss Linda and Miss Lai, my test results are now in the high 90s — including 2nd place in maths in my grade and 100% on my recent test. My confidence in learning has improved significantly and I'm now determined to achieve above 90% for all my tests. I can't thank DA and the teachers enough for their expertise and engaging lessons. With these incredible teachers and the great learning environment, I'm looking forward to continuing my journey here.",
  },
  {
    id: 'cr-5',
    tags: ['Results', 'Tutors', 'HSC'],
    category: 'HSC English',
    author: 'Lillian Pham',
    yearLevel: 'Year 12',
    preview: "English was my least favourite subject. Within weeks of joining DA, my marks improved dramatically — I jumped a significant number of ranks in my cohort.",
    full: "I had Miss Selina from the second term of my HSC year and I wish I had joined sooner. Prior to joining DA, English was my least favourite subject and my marks definitely reflected that. Although it had only been several weeks since I started English tutoring with Miss Selina, my marks for the second assessment task improved dramatically and I jumped up a significant number of ranks in my cohort. My essay writing and creative writing skills have improved so much since I started. She makes classes enjoyable, and I am more motivated than ever to do well in English. Lillian Pham — Prairiewood High School — Year 12",
  },
  {
    id: 'cr-6',
    tags: ['Confidence', 'Results', 'Family', 'HSC'],
    category: 'Nine Years at DA',
    author: 'Connor Mangala',
    yearLevel: 'Year 12',
    preview: "Miss Lai and Mr Bunsea helped me realise what I was truly capable of. I'm now enrolled in my dream university course — results I never knew I could achieve.",
    full: "I am always so grateful for all the tutors who have seen me grow over the past 9 years I have been at DA. Specifically, I want to thank Miss Lai and Mr Bunsea for helping me realise that I needed to take my learning seriously in my senior years — that my future self was depending on me. Without them I wouldn't have received the marks and ATAR I never knew I could achieve, and I wouldn't have been accepted into my dream university course.",
  },
  {
    id: 'cr-7',
    tags: ['Results', 'Tutors'],
    category: 'Mathematics',
    author: 'Diana Nguyen',
    yearLevel: '',
    preview: "Mr Bunsea took me from a C average to 94% and first in my class — in a single term. I've never been more grateful for a teacher.",
    full: "Before going to DA, I was a C average student in maths. After going to DA and having Mr Bunsea as my tutor, he made the most difficult concepts so easy to understand. In my first term with him, he pulled me from a C to a B grade. I continued with him and finally achieved 94% on my latest maths exam — first in my class. I really appreciate his dedication. The teachers at DA are extremely hardworking and caring, always willing to go out of their way to make sure students get the results they deserve. Diana Nguyen.",
  },
  {
    id: 'cr-8',
    tags: ['Confidence', 'Results', 'Tutors', 'Family'],
    category: 'Four Years at DA',
    author: 'Tiffany Lang',
    yearLevel: '',
    preview: "Having been to many tutoring centres before DA, the difference is clear. My results, my confidence, and my love of learning have all transformed here.",
    full: "Having gone to many other tutoring places before DA Tuition, I have seen my results improve over my 4 years of being here. Ms Lai, Mr Danny and Mr Bunsea have stuck with me to the end of my high schooling years, providing me with the support and knowledge to excel in my subjects, as well as making my time here the most enjoyable and memory-making experience. I truly think that DA Tuition is a great recommendation for any student.",
  },
];

const REVIEW_FILTERS = ['Confidence', 'Results', 'Tutors', 'Family', 'HSC'] as const;

const ReviewsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-60px' });

  const [current,      setCurrent]      = useState(0);
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [cardW,        setCardW]        = useState(760);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [fading,       setFading]       = useState(false);

  const GAP = 24;
  const x   = useMotionValue(0);

  // Derived: filter is cheap (8 items), no useMemo needed
  const filteredReviews = activeFilter
    ? CAROUSEL_REVIEWS.filter(r => r.tags.includes(activeFilter))
    : CAROUSEL_REVIEWS;

  // Measure card width
  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const w   = wrapRef.current.offsetWidth;
      const vw  = window.innerWidth;
      const frac = vw <= 540 ? 0.86 : vw <= 900 ? 0.78 : 0.72;
      setCardW(Math.round(w * frac));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback((idx: number, len: number) => {
    const n = Math.max(0, Math.min(len - 1, idx));
    setCurrent(n);
    fmAnimate(x, -(n * (cardW + GAP)), { type: 'spring', stiffness: 340, damping: 38 });
  }, [cardW, x]);

  const handleDragEnd = (
    _: unknown,
    { offset, velocity }: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const snap = cardW * 0.22;
    const len  = filteredReviews.length;
    if (velocity.x < -400 || offset.x < -snap) goTo(current + 1, len);
    else if (velocity.x > 400 || offset.x > snap) goTo(current - 1, len);
    else goTo(current, len);
  };

  // Filter change: fade out → reset → switch → fade in
  const handleFilterChange = (cat: string) => {
    const next = activeFilter === cat ? null : cat;
    setFading(true);
    setTimeout(() => {
      setActiveFilter(next);
      setCurrent(0);
      setExpanded(null);
      fmAnimate(x, 0, { duration: 0 });
      setFading(false);
    }, 200);
  };

  const maxDrag = -((filteredReviews.length - 1) * (cardW + GAP));
  const easeOut = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={sectionRef}
      aria-label="Family reviews"
      style={{
        background: C.cream,
        paddingTop:    'clamp(80px,9vw,120px)',
        paddingBottom: 'clamp(80px,9vw,120px)',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: '0 clamp(24px,6vw,80px)', marginBottom: 'clamp(36px,5vw,52px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: easeOut }}
        >
          <div style={{
            fontFamily: sans, fontWeight: 700,
            fontSize: '.70rem', letterSpacing: '.17em',
            textTransform: 'uppercase', color: C.gold,
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

      {/* ── Category filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.80, delay: 0.15, ease: easeOut }}
        style={{
          padding: '0 clamp(24px,6vw,80px)',
          marginBottom: 'clamp(36px,5vw,56px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {REVIEW_FILTERS.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              style={{
                height: '38px',
                padding: '0 20px',
                borderRadius: '100px',
                border: `1.5px solid ${isActive ? C.gold : 'rgba(10,27,52,0.20)'}`,
                background: isActive ? C.gold : 'transparent',
                color: isActive ? '#FFFFFF' : 'rgba(10,27,52,0.62)',
                fontFamily: sans, fontWeight: 500,
                fontSize: '.70rem', letterSpacing: '.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.26s cubic-bezier(0.22,1,0.36,1)',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </motion.div>

      {/* ── Carousel track (fades on filter switch) ── */}
      <motion.div
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      >
        <div ref={wrapRef} style={{ overflow: 'hidden' }}>
          <motion.div
            drag="x"
            dragConstraints={{ left: maxDrag, right: 0 }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{
              x,
              display: 'flex',
              gap: `${GAP}px`,
              paddingLeft:  'clamp(24px,6vw,80px)',
              paddingRight: 'clamp(24px,6vw,80px)',
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            {filteredReviews.map((r, i) => {
              const isActive   = i === current;
              const isExpanded = expanded === r.id;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.80, delay: Math.min(i * 0.05, 0.20), ease: easeOut }}
                  style={{
                    width: cardW,
                    flexShrink: 0,
                    minHeight: 'clamp(440px,56vw,520px)',
                    background: '#FFFFFF',
                    padding: 'clamp(36px,4vw,56px) clamp(32px,3.5vw,52px)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `2px solid ${isActive ? C.gold : 'transparent'}`,
                    transition: 'border-color 0.40s ease',
                    pointerEvents: 'auto',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* ── Header: category left, stars right ── */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'clamp(40px,5vw,56px)',
                  }}>
                    <span style={{
                      fontFamily: sans, fontWeight: 600,
                      fontSize: '.60rem', letterSpacing: '.24em',
                      textTransform: 'uppercase',
                      color: C.gold,
                    }}>
                      {r.category}
                    </span>
                    <span style={{
                      fontSize: '.78rem', letterSpacing: '.14em',
                      color: C.gold,
                      userSelect: 'none',
                    }}>
                      ★★★★★
                    </span>
                  </div>

                  {/* ── Quote — hero element ── */}
                  <p style={{
                    fontFamily: serif, fontWeight: 300,
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.26rem,1.75vw,1.60rem)',
                    lineHeight: 1.62,
                    letterSpacing: '-.016em',
                    color: C.navy,
                    margin: 0,
                  }}>
                    {/* Integrated opening mark — large, gold, flows with text */}
                    <span style={{
                      fontStyle: 'normal',
                      fontSize: '1.30em',
                      lineHeight: 0,
                      verticalAlign: '-0.22em',
                      color: C.gold,
                      marginRight: '0.04em',
                      opacity: 0.70,
                    }}>&ldquo;</span>
                    {isExpanded ? r.full : r.preview}
                  </p>

                  {/* ── Footer — pushed to bottom via marginTop: auto ── */}
                  <div style={{ marginTop: 'auto', paddingTop: 'clamp(36px,4.5vw,52px)' }}>

                    {/* Gold gradient rule */}
                    <div style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, rgba(212,175,55,.45), rgba(212,175,55,.05))',
                      marginBottom: 'clamp(20px,2.5vw,26px)',
                    }} />

                    {/* Name + year level */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '14px',
                      marginBottom: 'clamp(16px,2vw,20px)',
                    }}>
                      <span style={{
                        fontFamily: sans, fontWeight: 500,
                        fontSize: '.84rem', letterSpacing: '.04em',
                        color: C.navy,
                      }}>
                        {r.author}
                      </span>
                      {r.yearLevel && (
                        <span style={{
                          fontFamily: sans, fontWeight: 300,
                          fontSize: '.72rem', letterSpacing: '.06em',
                          color: 'rgba(10,27,52,0.40)',
                        }}>
                          {r.yearLevel}
                        </span>
                      )}
                    </div>

                    {/* Read Full Story */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : r.id); }}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        fontFamily: sans, fontWeight: 400,
                        fontSize: '.68rem', letterSpacing: '.16em',
                        textTransform: 'uppercase',
                        color: C.gold,
                        cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        opacity: 0.85,
                      }}
                    >
                      {isExpanded ? 'Close Story ↑' : 'Read Full Story →'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Navigation: dots + arrows ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(32px,4vw,52px) clamp(24px,6vw,80px) 0',
        }}>
          {/* Pill dots */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {filteredReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, filteredReviews.length)}
                aria-label={`Go to review ${i + 1}`}
                style={{
                  width:  i === current ? '26px' : '7px',
                  height: '7px',
                  borderRadius: '4px',
                  background: i === current ? C.gold : 'rgba(10,27,52,0.16)',
                  border: 'none', padding: 0, cursor: 'pointer',
                  transition: 'all 0.32s cubic-bezier(0.22,1,0.36,1)',
                }}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {([
              { lbl: '←', dir: -1, disabled: current === 0 },
              { lbl: '→', dir:  1, disabled: current === filteredReviews.length - 1 },
            ] as const).map(({ lbl, dir, disabled }) => (
              <button
                key={lbl}
                onClick={() => goTo(current + dir, filteredReviews.length)}
                disabled={disabled}
                aria-label={lbl === '←' ? 'Previous review' : 'Next review'}
                style={{
                  width: '48px', height: '48px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: `1.5px solid ${disabled ? 'rgba(10,27,52,0.12)' : 'rgba(10,27,52,0.28)'}`,
                  color: disabled ? 'rgba(10,27,52,0.22)' : C.navy,
                  fontFamily: sans, fontSize: '1.05rem',
                  cursor: disabled ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.22s ease',
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* ── Footer: count + supporting line + CTA ── */}
        <div style={{
          padding: 'clamp(52px,7vw,80px) clamp(24px,6vw,80px) 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}>
          {/* Left: stat + sentence */}
          <div>
            <div style={{
              fontFamily: serif, fontWeight: 300,
              fontSize: 'clamp(1.8rem,3.0vw,2.8rem)',
              letterSpacing: '-.024em', lineHeight: 1.1,
              color: C.navy,
              marginBottom: '10px',
            }}>
              450 Five-Star Reviews
            </div>
            <p style={{
              fontFamily: sans, fontWeight: 300,
              fontSize: 'clamp(.82rem,1.0vw,.92rem)',
              letterSpacing: '.012em', lineHeight: 1.7,
              color: 'rgba(10,27,52,0.48)',
              margin: 0,
            }}>
              These are only a few of the stories our families chose to share.
            </p>
          </div>

          {/* Right: secondary CTA */}
          <a
            href="https://www.google.com/maps/place/DA+Tuition/@-33.8717491,150.9282683,17z/data=!4m8!3m7!1s0x6b12bd1e45e49a8b:0x69b2c4a45f28e5a7!8m2!3d-33.8717491!4d150.9282683!9m1!1b1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              fontFamily: sans, fontWeight: 400,
              fontSize: '.72rem', letterSpacing: '.16em',
              textTransform: 'uppercase',
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
            <span style={{ fontSize: '.85em', opacity: 0.70 }}>↗</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};


// ══════════════════════════════════════════════════════════════
//  AWARD RECOGNITION
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
//  TEACHERS
// ══════════════════════════════════════════════════════════════
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


// ══════════════════════════════════════════════════════════════
//  CLOSING CTA
// ══════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════
const Index = () => (
  <div style={{ fontFamily: sans, overflowX: 'hidden' }}>
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
      <WhySection />
      <QuoteSection />
      <ReviewsSection />

      <TeachersSection />
      <ClosingCTASection />
    </main>
    <FooterNew />
  </div>
);

export default Index;
