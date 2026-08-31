/**
 * Index.tsx — DA Tuition Homepage
 * Premium private-school inspired design with Awwwards-style animations.
 * Inspired by: korowa.vic.edu.au
 */

import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BriefcaseBusiness, Calculator, ChartNoAxesCombined, ChevronDown, FlaskConical, Maximize2, Minimize2, Pause, Play, Scale, ShieldCheck, UsersRound, Volume2, VolumeX, X, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion';
import NavigationNew from '@/components/NavigationNew';
import HomeFooterTrial from '@/components/HomeFooterTrial';
import AwardRecognition from '@/components/AwardRecognition';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarousel';
import TeachersPreview from '@/components/TeachersPreview';
import Confetti, { fireConfetti } from '@/components/animations/Confetti';
import SEO from '@/components/SEO';
import StatsSection from '@/components/StatsSection';
import { siteStats } from '@/data/site-stats';
import { supplementalHomepageReviews } from '@/data/homepage-reviews';
import { organizationSchema, localBusinessSchema } from '@/lib/seo/schema';
import VisualIntro from '@/components/home/VisualIntro';

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
const sans  = "'Cabin', system-ui, sans-serif";

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
const MARQUEE = ['Mathematics','English','Science','Legal Studies','Business Studies','HSC Excellence','20+ Years','1,500+ Students','5.0 ★ Rating','Award-Winning','Small Groups','Personalised Learning'];
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

const HeroSection = ({ embedded = false }: { embedded?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reducedMotion ? '0%' : '20%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.94, reducedMotion ? 1 : 0]);

  return (
    <motion.section
      ref={sectionRef}
      className="hero-luxury"
    >
      <style>{`
        .hero-luxury {
          position: relative;
          isolation: isolate;
          display: grid;
          grid-template-columns: minmax(0, 17fr) minmax(0, 66fr) minmax(0, 17fr);
          width: 100%;
          height: 100svh;
          min-height: 100svh;
          overflow: hidden;
          background: #fbf7ee;
          color: ${C.navy};
        }
        .hero-side-image {
          position: relative;
          z-index: 1;
          min-width: 0;
          height: 100%;
          overflow: hidden;
          background: ${C.navy};
        }
        .hero-side-image:first-child { margin-right: -1px; }
        .hero-side-image:last-child { margin-left: -1px; }
        .hero-side-image img {
          width: 100%;
          height: 100%;
          max-width: none;
          display: block;
          object-fit: cover;
        }
        .hero-side-image--left img { object-position: 31% center; }
        .hero-side-image--right img { object-position: 53% center; }
        .hero-side-image::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(116,73,16,.05), rgba(87,50,8,.12));
        }
        .hero-centre {
          position: relative;
          z-index: 2;
          min-width: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 40%, rgba(255,255,255,.88) 0%, rgba(251,247,238,.42) 42%, transparent 72%),
            #fbf7ee;
          box-shadow: inset 22px 0 42px -44px rgba(86,49,8,.38), inset -22px 0 42px -44px rgba(86,49,8,.38);
        }
        .hero-composition {
          position: relative;
          z-index: 2;
          width: min(94%, 930px);
          height: calc(100% - clamp(66px, 7.2vh, 80px));
          margin-top: clamp(66px, 7.2vh, 80px);
          padding: clamp(14px, 2.1vh, 24px) clamp(18px, 3vw, 52px) clamp(64px, 8vh, 86px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 1.35vh, 15px);
        }
        .hero-crest { width: clamp(170px, 15vw, 230px); height: auto; display: block; }
        .hero-eyebrow {
          font-family: ${sans};
          font-size: clamp(.58rem, .72vw, .74rem);
          font-weight: 600;
          letter-spacing: .2em;
          line-height: 1.4;
          color: #a8731f;
          text-transform: uppercase;
        }
        .hero-title {
          margin: clamp(1px, .4vh, 5px) 0 0;
          font-family: ${serif};
          font-size: clamp(2.55rem, 4.15vw, 4.55rem);
          font-weight: 600;
          line-height: .99;
          letter-spacing: -.025em;
          color: ${C.navy};
          text-wrap: balance;
        }
        .hero-title span,
        .hero-title em { display: block; white-space: nowrap; }
        .hero-title em { color: #b8842f; font-size: .9em; font-weight: 500; }
        .hero-support {
          max-width: 590px;
          margin: clamp(2px, .65vh, 7px) 0 0;
          font-family: ${sans};
          font-size: clamp(.87rem, 1.05vw, 1.08rem);
          line-height: 1.55;
          color: rgba(10,27,52,.82);
          text-wrap: balance;
        }
        .hero-actions { display: flex; justify-content: center; gap: 14px; margin-top: clamp(3px, .7vh, 8px); }
        .hero-cta {
          min-width: 190px;
          min-height: 48px;
          padding: 12px 24px;
          border-radius: 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          font-family: ${sans};
          font-size: .9rem;
          font-weight: 700;
          line-height: 1;
          transition: transform 250ms cubic-bezier(.22,1,.36,1), box-shadow 250ms ease, background-color 250ms ease;
        }
        .hero-cta:hover { transform: translateY(-2px); }
        .hero-cta:focus-visible { outline: 3px solid rgba(212,175,55,.55); outline-offset: 3px; }
        .hero-cta--primary { color: #fffaf0; background: ${C.navy}; border: 1px solid #b8842f; box-shadow: 0 5px 8px rgba(10,27,52,.14); }
        .hero-cta--primary:hover { box-shadow: 0 7px 8px rgba(10,27,52,.19); }
        .hero-cta--secondary { color: ${C.navy}; background: rgba(251,247,238,.56); border: 1px solid rgba(184,132,47,.7); }
        .hero-cta--secondary:hover { background: #fffaf1; box-shadow: 0 5px 8px rgba(116,73,16,.1); }
        .hero-values {
          width: min(100%, 730px);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(14px, 2.1vw, 30px);
          margin-top: clamp(9px, 1.7vh, 20px);
          text-align: left;
        }
        .hero-value { min-width: 0; display: grid; grid-template-columns: 40px 1fr; gap: 11px; align-items: start; }
        .hero-value svg { width: 34px; height: 34px; color: #b8842f; stroke-width: 1.35; }
        .hero-value strong { display: block; margin: 1px 0 5px; font-family: ${sans}; font-size: clamp(.72rem, .82vw, .84rem); color: ${C.navy}; }
        .hero-value p { margin: 0; font-family: ${sans}; font-size: clamp(.66rem, .75vw, .77rem); line-height: 1.45; color: rgba(10,27,52,.72); }
        .hero-trust {
          margin: clamp(1px, .35vh, 4px) 0 0;
          font-family: ${sans};
          font-size: clamp(.68rem, .76vw, .8rem);
          font-weight: 500;
          letter-spacing: .07em;
          line-height: 1.4;
          color: rgba(10,27,52,.58);
        }
        .hero-scroll { margin-top: clamp(2px, .7vh, 8px); color: #b8842f; animation: heroChevron 2.8s cubic-bezier(.22,1,.36,1) infinite; }
        @keyframes heroChevron { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
        @media (max-width: 1100px) {
          .hero-luxury { grid-template-columns: minmax(0, 15fr) minmax(0, 70fr) minmax(0, 15fr); }
          .hero-composition { width: 96%; padding-inline: 22px; }
          .hero-title { font-size: clamp(2.35rem, 4.7vw, 3.8rem); }
          .hero-value { grid-template-columns: 31px 1fr; gap: 8px; }
          .hero-value svg { width: 28px; height: 28px; }
        }
        @media (max-width: 767px) {
          .hero-luxury {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: minmax(0, 78fr) minmax(0, 22fr);
          }
          .hero-centre { grid-column: 1 / -1; grid-row: 1; }
          .hero-side-image { grid-row: 2; height: calc(100% + 1px); }
          .hero-side-image:first-child { grid-column: 1; margin: -1px -1px 0 0; }
          .hero-side-image:last-child { grid-column: 2; margin: -1px 0 0 -1px; }
          .hero-side-image--left img { object-position: center 42%; }
          .hero-side-image--right img { object-position: center 43%; }
          .hero-composition {
            width: 100%;
            height: calc(100% - 55px);
            margin-top: 55px;
            padding: 8px 16px 7px;
            gap: clamp(4px, .7vh, 7px);
          }
          .hero-crest { width: clamp(96px, 24vw, 124px); }
          .hero-eyebrow { font-size: .48rem; letter-spacing: .15em; }
          .hero-title { font-size: clamp(2rem, 9.4vw, 2.7rem); line-height: 1; }
          .hero-title span, .hero-title em { white-space: normal; }
          .hero-support { max-width: 350px; font-size: clamp(.72rem, 3.2vw, .86rem); line-height: 1.4; }
          .hero-actions { width: 100%; gap: 8px; }
          .hero-cta { min-width: 0; flex: 1; min-height: 40px; padding: 9px 10px; font-size: .72rem; }
          .hero-values { grid-template-columns: 1fr 1fr; gap: 7px 13px; margin-top: 4px; max-width: 370px; }
          .hero-value { grid-template-columns: 24px 1fr; gap: 6px; }
          .hero-value:last-child { grid-column: 1 / -1; width: 54%; justify-self: center; }
          .hero-value svg { width: 22px; height: 22px; }
          .hero-value strong { font-size: .58rem; margin-bottom: 1px; }
          .hero-value p { font-size: .52rem; line-height: 1.25; }
          .hero-trust { margin-top: 0; font-size: .58rem; letter-spacing: .045em; }
          .hero-scroll { margin-top: 0; }
        }
        @media (max-height: 760px) and (min-width: 768px) {
          .hero-composition { gap: 7px; padding-top: 10px; padding-bottom: 9px; }
          .hero-crest { width: 132px; }
          .hero-title { font-size: clamp(2.45rem, 3.8vw, 3.55rem); }
          .hero-values { margin-top: 7px; }
          .hero-trust { margin-top: 6px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-scroll { animation: none; }
          .hero-cta { transition: none; }
        }
      `}</style>

      <figure className="hero-side-image hero-side-image--left">
        <img src="/images/homepage/homepage-cream/ngoc and a girl-3.png" alt="DA Tuition tutor guiding a student through her work" />
      </figure>

      <div className="hero-centre">
        <motion.div
          className="hero-composition"
          style={{ y: embedded ? 0 : contentY, opacity: embedded ? 1 : contentOpacity }}
        >
          <img className="hero-crest" src="/images/da-logo.png" alt="DA Tuition" />
          <div className="hero-eyebrow">Personalised Learning. Exceptional Results.</div>
          <h1 className="hero-title">
            <span>Where Ambition Meets</span>
            <em>Academic Excellence</em>
          </h1>
          <p className="hero-trust">Trusted by Families. Transforming Futures.</p>
          <p className="hero-support">
            Tailored academic support that builds confidence,<br className="hidden sm:block" /> strengthens understanding and delivers success.
          </p>
          <div className="hero-actions">
            <a className="hero-cta hero-cta--primary" href="#programs-intro">
              Explore Programs <ArrowRight aria-hidden="true" size={18} strokeWidth={1.6} />
            </a>
            <Link className="hero-cta hero-cta--secondary" to="/book-interview">Book Consultation</Link>
          </div>
          <div className="hero-values" aria-label="Why families choose DA Tuition">
            <div className="hero-value">
              <UsersRound aria-hidden="true" />
              <div><strong>Personalised Approach</strong><p>Every student is unique.<br />Every plan is tailored.</p></div>
            </div>
            <div className="hero-value">
              <ChartNoAxesCombined aria-hidden="true" />
              <div><strong>Expert Educators</strong><p>Experienced tutors who<br />inspire and empower.</p></div>
            </div>
            <div className="hero-value">
              <ShieldCheck aria-hidden="true" />
              <div><strong>Proven Results</strong><p>Stronger academic outcomes<br />and real long-term growth.</p></div>
            </div>
          </div>
          <ChevronDown className="hero-scroll" aria-hidden="true" size={25} strokeWidth={1.2} />
        </motion.div>
      </div>

      <figure className="hero-side-image hero-side-image--right">
        <img src="/images/homepage/homepage-cream/studying girl-4.png" alt="DA Tuition student concentrating on her studies" />
      </figure>
    </motion.section>
  );
};

// ══════════════════════════════════════════════════════════════
//  PHILOSOPHY BACKED BY RESULTS
// ══════════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────────────────────
//  PHILOSOPHY_STAGES — image replacement guide
//
//  Each stage has an `image` path. These are real DA Tuition photography
//  assets assigned to match each philosophy pillar.
//
//  To replace a photo later, drop it into /public/images/philosophy/
//  and update ONLY the matching `image` field below.
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
//  Stage 1 — Known: classroom whiteboard teaching
//  Stage 2 — Belief: female teacher guiding students around the table
//  Stage 3 — Understanding: male tutor helping two students
//  Stage 4 — Growth: student studying independently
// ─────────────────────────────────────────────────────────────────────────────
const PHILOSOPHY_STAGES = [
  {
    stage: 1,
    label: 'Known',
    title: 'Students deserve to be known before they are judged.',
    supporting: 'Every student arrives with a different story. We take the time to understand where they are — because the gap between their starting point and their potential is exactly where real growth lives.',
    image: '/images/homepage/homepage-cream/philosophy-known-1.png',
    objectPosition: 'center center',
  },
  {
    stage: 2,
    label: 'Belief',
    title: 'Confidence often comes before achievement.',
    supporting: 'We have seen it hundreds of times: the moment a student believes they can, the results follow. Building that belief is not a side effect of our teaching — it is the purpose of it.',
    image: '/images/homepage/homepage-cream/philosophy-belief-2.png',
    objectPosition: '50% center',
  },
  {
    stage: 3,
    label: 'Understanding',
    title: 'Understanding matters more than memorisation.',
    supporting: 'Real mastery is knowing why something works, not just that it does. We teach students to think deeply, so knowledge becomes theirs permanently — not just until the exam.',
    image: '/images/homepage/homepage-cream/philosophy-understanding-3.png',
    objectPosition: '43% center',
  },
  {
    stage: 4,
    label: 'Growth',
    title: 'We strengthen the child behind the result.',
    supporting: 'Marks improve when students feel capable, seen, and guided. Our goal is not to chase grades — it is to build the resilience, curiosity, and self-belief that make sustained excellence possible.',
    image: '/images/homepage/homepage-cream/philosophy-growth-4.png',
    objectPosition: '58% center',
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

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easePrestige = (value: number) => 1 - Math.pow(1 - clamp01(value), 4);

// ── Count-up number — driven by the single journey particle progress ──
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
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Hold the internal reveal until most of the real Philosophy viewport is visible.
  const inView = useInView(stageRef, { once: true, amount: 0.65 });
  const ease = [0.22, 1, 0.36, 1] as const;

  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (reducedMotion || window.matchMedia('(max-width: 768px)').matches) return;
    const nextIndex = Math.min(
      PHILOSOPHY_STAGES.length - 1,
      Math.floor(progress * PHILOSOPHY_STAGES.length)
    );
    setActiveIndex(current => current === nextIndex ? current : nextIndex);
  });

  const goTo = (i: number) => {
    setActiveIndex(i);
    // Move DOM focus to the newly active tab so keyboard users stay oriented
    tabRefs.current[i]?.focus();
  };

  useEffect(() => {
    PHILOSOPHY_STAGES.forEach(stage => {
      const img = new Image();
      img.src = stage.image;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Our philosophy and results"
      className="phi-scroll-scene"
      style={{ background: C.navy, minHeight: `${PHILOSOPHY_STAGES.length * 100}svh` }}
    >
      <style>{`
        /* Mobile: stack image above content */
        @media (max-width: 768px) {
          .phi-scroll-scene { min-height: auto !important; }
          .phi-scroll-stage { position: relative !important; top: auto !important; min-height: auto !important; }
          .phi-journey { grid-template-columns: 1fr !important; min-height: auto !important; }
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

        /* ── Philosophy pillar blocks ── */

        /* Base card — inactive */
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

        /* Mobile: 2×2 grid */
        @media (max-width: 600px) {
          .phi-block-grid { grid-template-columns: repeat(2,1fr) !important; }
          .phi-block { padding: 12px 14px 14px; }
          .phi-block-lbl { font-size: 9px; letter-spacing: 0.08em; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .phi-scroll-scene { min-height: auto !important; }
          .phi-scroll-stage { position: relative !important; top: auto !important; min-height: auto !important; }
          .phi-block,
          .phi-block-num,
          .phi-block-lbl { transition: none !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
           PHILOSOPHY JOURNEY
           Two equal panels: image left, content right.
           No max-width — the image bleeds to the section edge,
           giving it the same visual weight as the text.
         ════════════════════════════════════════════════════════════ */}
      <div
        ref={stageRef}
        className="phi-scroll-stage"
        style={{ position: 'sticky', top: '56px', minHeight: 'calc(100svh - 56px)', display: 'grid', alignItems: 'stretch' }}
      >
      <div
        className="phi-journey"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          alignItems: 'stretch',
          minHeight: 'calc(100svh - 56px)',
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
                transform: i === activeIndex ? 'scale(1.035) translate3d(0,0,0)' : 'scale(1.11) translate3d(0,1.5%,0)',
                clipPath: i === activeIndex ? 'inset(0% 0% 0% 0%)' : 'inset(7% 0% 7% 0%)',
                transition: reducedMotion
                  ? 'none'
                  : 'opacity 900ms cubic-bezier(.16,1,.3,1), transform 1400ms cubic-bezier(.16,1,.3,1), clip-path 1100ms cubic-bezier(.16,1,.3,1)',
                willChange: 'opacity, transform, clip-path',
              }}
            />
          ))}

          {/* Directional overlay — reduced for DSLR clarity (25–35% range) */}
          <div className="phi-photo-overlay" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(90deg, rgba(5, 20, 40, 0.10) 0%, rgba(5, 20, 40, 0.20) 55%, rgba(5, 20, 40, 0.35) 100%)',
          }} />

          {/* Right-edge blend — image dissolves into the content panel */}
          <div className="phi-photo-edge" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to right, transparent 74%, rgba(10,27,52,.42) 90%, rgba(10,27,52,1) 100%)',
          }} />
        </div>

        {/* ── CONTENT PANEL ───────────────────────────────────────────
             Flex column: eyebrow + indicator pinned top.
             Spacer lets the image breathe between nav and statement.
             Philosophy text anchors to the lower third.
             Pause rotation on hover/focus (WCAG 2.2.2).
          ── */}
        <div
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
              fontFamily: sans, fontSize: '.60rem', fontWeight: 700,
              letterSpacing: '.28em', textTransform: 'uppercase' as const,
              color: 'rgba(212,175,55,.75)', margin: '0 0 22px',
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
      </div>

    </section>
  );
};

const PHILOSOPHY_ALTS = [
  'DA Tuition teacher guiding students at the classroom whiteboard',
  'DA Tuition tutor encouraging students during a small-group lesson',
  'DA Tuition educator explaining a concept to two students',
  'DA Tuition student working independently with confidence',
];

// The first photograph belongs to the Known chapter, not the title intro. Its
// reveal begins only after that chapter reaches its viewport activation line.
const PHILOSOPHY_KNOWN_REVEAL = [0.045, 0.10] as const;
// Let the outgoing chapter's copy clear the reading position first. Each
// photograph turns immediately before the incoming chapter settles alongside
// the card, so image and copy arrive as one idea rather than competing beats.
const PHILOSOPHY_FLIP_WINDOWS = [[0.275, 0.355], [0.465, 0.545], [0.655, 0.735]] as const;

const PhilosophyVisualFace = ({ index, progress }: { index: number; progress: MotionValue<number> }) => {
  const visual = {
    ...PHILOSOPHY_STAGES[index],
    alt: PHILOSOPHY_ALTS[index],
  };
  const incoming = index > 0 ? PHILOSOPHY_FLIP_WINDOWS[index - 1] : null;
  const outgoing = index < PHILOSOPHY_STAGES.length - 1 ? PHILOSOPHY_FLIP_WINDOWS[index] : null;
  const input = index === 0
    ? [0, PHILOSOPHY_KNOWN_REVEAL[0], PHILOSOPHY_KNOWN_REVEAL[1], outgoing![0], outgoing![1], 1]
    : incoming && outgoing
      ? [0, incoming[0], incoming[1], outgoing[0], outgoing[1], 1]
      : [0, incoming![0], incoming![1], 1];
  const output = index === 0
    ? [0, 0, 0, 0, -180, -180]
    : incoming && outgoing
      ? [180, 180, 0, 0, -180, -180]
      : [180, 180, 0, 0];
  const rotateY = useTransform(progress, input, output);
  const entryY = useTransform(
    progress,
    index === 0 ? [0, PHILOSOPHY_KNOWN_REVEAL[0], PHILOSOPHY_KNOWN_REVEAL[1], 1] : [0, 1],
    index === 0 ? [50, 50, 0, 0] : [0, 0],
  );
  const entryRotate = useTransform(
    progress,
    index === 0 ? [0, PHILOSOPHY_KNOWN_REVEAL[0], PHILOSOPHY_KNOWN_REVEAL[1], 1] : [0, 1],
    index === 0 ? [0, 0, 0, 0] : [0, 0],
  );
  const opacity = useTransform(
    progress,
    index === 0 ? [0, PHILOSOPHY_KNOWN_REVEAL[0], PHILOSOPHY_KNOWN_REVEAL[1], 1] : [0, 1],
    index === 0 ? [0, 0, 1, 1] : [1, 1],
  );

  return (
    <motion.img
      className="phi-flip-face"
      src={visual.image}
      alt={visual.alt}
      style={{ rotateY, rotateZ: entryRotate, y: entryY, opacity, objectPosition: visual.objectPosition, zIndex: 10 - index }}
    />
  );
};

const PhilosophyChapter = ({ index, exitOpacity, exitY, exitHidden = false }: {
  index: number;
  exitOpacity?: MotionValue<number>;
  exitY?: MotionValue<number>;
  exitHidden?: boolean;
}) => {
  const articleRef = useRef<HTMLElement>(null);
  const stage = PHILOSOPHY_STAGES[index];
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0.08, 0.36, 0.7, 1], [0, 1, 1, 0.55]);
  const y = useTransform(scrollYProgress, [0.08, 0.36, 0.7, 1], [30, 0, 0, -18]);
  const filter = useTransform(scrollYProgress, [0.08, 0.36, 0.7, 1], ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(2px)']);

  return (
    <motion.article
      ref={articleRef}
      className={`phi-chapter${index === PHILOSOPHY_STAGES.length - 1 ? ' phi-chapter--growth' : ''}${exitHidden ? ' is-growth-hidden' : ''}`}
      data-philosophy-chapter={stage.label.toLowerCase()}
      style={exitOpacity ? { opacity: exitOpacity, y: exitY } : undefined}
    >
      <motion.div className="phi-chapter-copy" style={{ opacity, y, filter }}>
        <span className="phi-copy-label">{stage.label}</span>
        <h3>{stage.title}</h3>
        <div className="phi-copy-rule" />
      </motion.div>
      <div className="phi-chapter-anchor" data-philosophy-anchor={stage.label.toLowerCase()} aria-hidden="true" />
      <motion.div className="phi-chapter-definition" style={{ opacity, y, filter }}>
        <p>{stage.supporting}</p>
      </motion.div>
    </motion.article>
  );
};

const PhilosophyEditorialSection = ({ nextSectionRef }: { nextSectionRef: React.RefObject<HTMLElement> }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const philosophyCardRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(78);
  const [safeCardWidth, setSafeCardWidth] = useState(620);
  const [cardPhase, setCardPhase] = useState<'hidden' | 'prelude' | 'fixed' | 'released'>('hidden');
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: reducedMotion ? undefined : sectionRef, offset: ['start start', 'end end'] });
  const { scrollYProgress: incomingSectionProgress } = useScroll({
    target: nextSectionRef,
    offset: ['start end', 'start 35%'],
  });
  const storyProgress = useSpring(scrollYProgress, { stiffness: 105, damping: 30, mass: 0.5, restDelta: 0.0005 });
  const cardScale = useTransform(
    storyProgress,
    [0, 0.045, 0.10, 0.275, 0.315, 0.355, 0.465, 0.505, 0.545, 0.655, 0.695, 0.735, 1],
    [0.96, 0.96, 1, 1, 0.98, 1, 1, 0.98, 1, 1, 0.98, 1, 1],
  );
  const backdropOpacity = useTransform(storyProgress, [0, 0.035, 0.115, 1], [1, 1, 0.1, 0.09]);
  const backdropOurY = useTransform(storyProgress, [0, 1], ['0vh', '-6vh']);
  const backdropPhilosophyX = useTransform(storyProgress, [0, 1], ['0vw', '3vw']);
  // The Awards section is the single source of truth for the final exit. With the
  // trigger ending at 35% of the viewport, 0.22 progress is roughly 14% coverage.
  const growthPhotoOpacity = useTransform(incomingSectionProgress, [0, 0.20], [1, 0]);
  const growthPhotoScale = useTransform(incomingSectionProgress, [0, 0.20], [1, 0.97]);
  const growthPhotoY = useTransform(incomingSectionProgress, [0, 0.20], [0, -18]);
  const growthTextOpacity = useTransform(incomingSectionProgress, [0, 0.22], [1, 0]);
  const growthTextY = useTransform(incomingSectionProgress, [0, 0.22], [0, -12]);
  const backdropPhilosophyOpacity = useTransform(incomingSectionProgress, [0, 0.18], [1, 0]);
  const contentVeilOpacity = useTransform(incomingSectionProgress, [0, 0.18], [1, 0]);
  const [growthForegroundHidden, setGrowthForegroundHidden] = useState(false);

  useMotionValueEvent(incomingSectionProgress, 'change', latest => {
    setGrowthForegroundHidden(current => {
      const next = latest >= 0.225;
      return current === next ? current : next;
    });
  });

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const measure = () => {
      const navigationHeight = Math.ceil(document.querySelector('nav')?.getBoundingClientRect().height ?? 78);
      setHeaderHeight(navigationHeight);
      setSafeCardWidth(Math.max(220, (window.innerHeight - navigationHeight - 88) * 0.84));
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    document.fonts?.ready.then(measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const updateCardPhase = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const section = sectionRef.current;
        const card = philosophyCardRef.current;
        if (!section || !card) return;
        const sectionRect = section.getBoundingClientRect();
        const knownChapter = section.querySelector<HTMLElement>('[data-philosophy-chapter="known"]');
        const knownRect = knownChapter?.getBoundingClientRect();
        const usableCentre = headerHeight + (window.innerHeight - headerHeight) / 2;
        const releaseBoundary = usableCentre + card.offsetHeight / 2;
        // Keep the title intro completely clear. The travelling card activates
        // only when the Known chapter itself enters the reading area.
        const knownActivationLine = headerHeight + (window.innerHeight - headerHeight) * 0.72;
        const knownIsActive = Boolean(knownRect && knownRect.top <= knownActivationLine);
        const nextPhase = sectionRect.bottom <= 0 || sectionRect.top >= window.innerHeight
          ? 'hidden'
          : sectionRect.bottom <= releaseBoundary
            ? 'released'
            : knownIsActive
              ? 'fixed'
              : 'prelude';
        setCardPhase(current => current === nextPhase ? current : nextPhase);
      });
    };
    updateCardPhase();
    window.addEventListener('scroll', updateCardPhase, { passive: true });
    window.addEventListener('resize', updateCardPhase);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateCardPhase);
      window.removeEventListener('resize', updateCardPhase);
    };
  }, [headerHeight, reducedMotion]);

  useEffect(() => {
    PHILOSOPHY_STAGES.forEach(item => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);

  if (reducedMotion) {
    return (
      <section className="phi-reduced" aria-labelledby="philosophy-title-reduced">
        <style>{`
          .phi-reduced{padding:110px clamp(20px,6vw,80px);background:${C.navy};color:${C.white}}
          .phi-reduced-intro{min-height:80svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden}.phi-reduced-intro h2{display:flex;flex-direction:column;align-items:center;margin:0;font-family:'Anton','Arial Narrow',sans-serif;font-weight:400;line-height:.72;letter-spacing:-.035em;text-transform:uppercase;color:#f3eadb}.phi-reduced-intro h2 span:first-child{font-size:clamp(11.25rem,25vw,26.25rem)}.phi-reduced-intro h2 span:last-child{margin-top:-.05em;font-size:clamp(9rem,21.2vw,25rem)}
          .phi-reduced-watermark{position:sticky;top:var(--header-height,78px);z-index:0;height:calc(100svh - var(--header-height,78px));margin-bottom:calc(-100svh + var(--header-height,78px));overflow:hidden;pointer-events:none}.phi-reduced-watermark p{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;margin:0;color:rgba(247,240,224,.09);font-family:'Anton','Arial Narrow',sans-serif;font-weight:400;line-height:.72;letter-spacing:-.035em;text-transform:uppercase;white-space:nowrap;user-select:none}.phi-reduced-watermark p span:first-child{font-size:clamp(11.25rem,25vw,26.25rem)}.phi-reduced-watermark p span:last-child{margin-top:-.05em;font-size:clamp(9rem,21.2vw,25rem)}
          .phi-reduced article{position:relative;z-index:1}
          .phi-reduced article{display:grid;grid-template-columns:minmax(220px,420px) minmax(0,560px);gap:clamp(28px,6vw,80px);align-items:center;margin:0 auto 80px;max-width:1100px}.phi-reduced article img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:16px}.phi-reduced article span{color:${C.gold};font:700 .72rem ${sans};letter-spacing:.14em;text-transform:uppercase}.phi-reduced article h3{font:400 clamp(2rem,4vw,3.5rem)/1.08 ${serif}}.phi-reduced article p{max-width:34em;color:rgba(247,242,232,.75);font:400 1rem/1.7 ${sans}}
          @media(max-width:768px){.phi-reduced{padding:80px 18px}.phi-reduced-watermark p span:first-child{font-size:clamp(6rem,27vw,12rem)}.phi-reduced-watermark p span:last-child{font-size:clamp(4.5rem,21vw,9rem)}.phi-reduced article{grid-template-columns:1fr;gap:20px}}
        `}</style>
        <div className="phi-reduced-intro">
          <h2 id="philosophy-title-reduced"><span>Our</span><span>Philosophy</span></h2>
        </div>
        <div className="phi-reduced-watermark" aria-hidden="true">
          <p><span>Our</span><span>Philosophy</span></p>
        </div>
        {PHILOSOPHY_STAGES.map((item, index) => (
          <article key={item.stage}>
            <img src={item.image} alt={PHILOSOPHY_ALTS[index]} style={{ objectPosition: item.objectPosition }} />
            <div><span>{item.label}</span><h3>{item.title}</h3><p>{item.supporting}</p></div>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="phi-editorial" aria-labelledby="philosophy-title" style={{ '--header-height': `${headerHeight}px`, '--phi-card-safe-width': `${safeCardWidth}px`, '--phi-visual-centre': `calc(${headerHeight}px + (100svh - ${headerHeight}px) / 2)` } as React.CSSProperties}>
      <style>{`
        .phi-editorial{position:relative;background:${C.navy};color:${C.white};isolation:isolate;overflow:clip}
        .phi-backdrop{position:sticky;top:var(--header-height);z-index:1;height:calc(100svh - var(--header-height));min-height:620px;overflow:hidden;pointer-events:none}
        .phi-backdrop-title{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;margin:0;padding:clamp(18px,2.5vh,32px) 0 clamp(28px,4vh,48px);font-family:'Anton','Arial Narrow',sans-serif;font-weight:400;line-height:.72;letter-spacing:-.035em;text-align:center;text-transform:uppercase;white-space:nowrap;color:#f3eadb;user-select:none;will-change:opacity}
        .phi-backdrop-title span{display:block;width:max-content;will-change:transform}.phi-backdrop-title__our{font-size:clamp(11.25rem,25vw,26.25rem);line-height:.72}.phi-backdrop-title__main{margin-top:-.05em;font-size:clamp(9rem,21.2vw,25rem);line-height:.72}.phi-content-veil{position:absolute;inset:0;z-index:2;background:radial-gradient(circle at center,rgba(7,29,56,.3) 0%,rgba(7,29,56,.12) 42%,transparent 72%);pointer-events:none}
        .phi-story-outro{height:clamp(7rem,18svh,12rem)}
        .phi-chapter{position:relative;z-index:5;min-height:calc(100svh - var(--header-height));padding-block:clamp(42px,5vh,76px);padding-inline:clamp(48px,4.2vw,86px);display:grid;grid-template-columns:minmax(390px,1fr) clamp(520px,36vw,760px) minmax(390px,1fr);align-items:center;column-gap:clamp(42px,4.2vw,76px);overflow:visible}
        .phi-chapter--growth{position:sticky;top:var(--header-height)}.phi-chapter--growth.is-growth-hidden{visibility:hidden;pointer-events:none}
        .phi-chapter-copy{grid-column:1}.phi-chapter-definition{grid-column:3}.phi-chapter-anchor{grid-column:2;width:100%;height:min(54svh,520px)}
        .phi-chapter-copy,.phi-chapter-definition{align-self:stretch;min-height:100%;display:flex;flex-direction:column;justify-content:center;margin:0;will-change:transform,opacity,filter}
        .phi-copy-label{display:block;margin-bottom:clamp(18px,1.8vh,26px);font:800 clamp(.74rem,.82vw,.92rem)/1 ${sans};letter-spacing:.18em;text-transform:uppercase;color:${C.gold}}
        .phi-chapter-copy h3{margin:0;max-width:11em;font:400 clamp(3.15rem,4.35vw,5.35rem)/1.08 ${serif};letter-spacing:-.02em;color:rgba(255,250,240,.97);text-wrap:balance;word-break:normal;overflow-wrap:normal;hyphens:none}
        .phi-copy-rule{width:58px;height:1px;margin:clamp(24px,2.6vh,36px) 0 0;background:${C.gold};opacity:.9}.phi-chapter-definition p{max-width:26em;margin:0;font:600 clamp(1.32rem,1.62vw,2.02rem)/1.45 ${sans};color:rgba(255,252,245,.94);text-wrap:pretty;word-break:normal;overflow-wrap:normal;hyphens:none}
        .phi-card-viewport-anchor{z-index:6;left:50%;width:min(clamp(520px,36vw,760px),var(--phi-card-safe-width));pointer-events:none;opacity:0;visibility:hidden;transition:opacity .78s cubic-bezier(.22,1,.36,1),visibility 0s linear .78s}.phi-card-viewport-anchor.is-prelude,.phi-card-viewport-anchor.is-fixed{position:fixed;top:var(--phi-visual-centre);bottom:auto;transform:translate(-50%,-50%)}.phi-card-viewport-anchor.is-fixed,.phi-card-viewport-anchor.is-released{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .78s cubic-bezier(.22,1,.36,1),visibility 0s linear 0s}.phi-card-viewport-anchor.is-released{position:absolute;top:auto;bottom:0;transform:translateX(-50%)}.phi-card-viewport-anchor.is-hidden{position:absolute;top:0;bottom:auto;transform:translateX(-50%)}.phi-travel-centre{width:100%;transform:translateY(50px) scale(.98);transform-origin:center center;transition:transform .78s cubic-bezier(.22,1,.36,1);will-change:transform}.phi-card-viewport-anchor.is-fixed .phi-travel-centre,.phi-card-viewport-anchor.is-released .phi-travel-centre{transform:translateY(0) scale(1)}
        .phi-growth-exit{width:100%;transform-origin:center center;will-change:transform,opacity}.phi-growth-exit.is-exit-hidden{visibility:hidden;pointer-events:none}.phi-flip-frame{position:relative;width:100%;aspect-ratio:4/5;overflow:visible;background:transparent;perspective:1500px;transform-origin:center center;transform-style:preserve-3d;will-change:transform}.phi-flip-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:22px;box-shadow:0 20px 38px rgba(0,0,0,.26);backface-visibility:hidden;transform-origin:center center;will-change:transform,opacity;transform-style:preserve-3d}
        .phi-reduced{padding:110px clamp(20px,6vw,80px);background:${C.navy};color:${C.white}}.phi-reduced-intro{min-height:80svh;text-align:center}.phi-reduced-intro h2{margin:0;font:800 clamp(3rem,10vw,8rem)/.9 ${sans};text-transform:uppercase}.phi-reduced article{display:grid;grid-template-columns:minmax(220px,420px) minmax(0,560px);gap:clamp(28px,6vw,80px);align-items:center;margin:0 auto 80px;max-width:1100px}.phi-reduced article img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:16px}.phi-reduced article span{color:${C.gold};font:700 .72rem ${sans};letter-spacing:.14em;text-transform:uppercase}.phi-reduced article h3{font:400 clamp(2rem,4vw,3.5rem)/1.08 ${serif}}.phi-reduced article p{max-width:34em;color:rgba(247,242,232,.75);font:400 1rem/1.7 ${sans}}
        @media(min-width:769px) and (max-width:1100px){.phi-backdrop-title__our{font-size:clamp(8.5rem,24vw,16rem)}.phi-backdrop-title__main{font-size:clamp(7rem,21vw,14rem)}.phi-chapter{grid-template-columns:minmax(0,1fr) minmax(260px,340px);grid-template-rows:auto auto;padding-inline:clamp(28px,4vw,48px);column-gap:clamp(28px,4vw,52px);row-gap:24px}.phi-chapter-copy{grid-column:1;grid-row:1;min-height:0;justify-content:flex-end}.phi-chapter-definition{grid-column:1;grid-row:2;min-height:0;justify-content:flex-start}.phi-chapter-anchor{grid-column:2;grid-row:1/3}.phi-card-viewport-anchor{width:min(clamp(260px,31vw,340px),var(--phi-card-safe-width))}.phi-chapter-copy h3{font-size:clamp(1.8rem,3.6vw,2.8rem)}.phi-chapter-definition p{font-size:.88rem}}
        @media(max-width:768px){.phi-story-outro{height:12svh}.phi-backdrop{min-height:560px}.phi-backdrop-title{padding:20px 0 34px}.phi-backdrop-title__our{font-size:clamp(6rem,27vw,12rem)}.phi-backdrop-title__main{font-size:clamp(4.5rem,21vw,9rem)}.phi-content-veil{background:radial-gradient(circle at center,rgba(7,29,56,.34) 0%,rgba(7,29,56,.16) 48%,transparent 76%)}.phi-chapter{min-height:auto;padding:96px 18px;grid-template-columns:minmax(0,1fr);grid-template-rows:auto min(97.5vw,400px) auto;gap:28px;align-content:center}.phi-chapter-copy{grid-column:1;grid-row:1;min-height:0;text-align:center}.phi-chapter-definition{grid-column:1;grid-row:3;min-height:0;text-align:center}.phi-chapter-anchor{grid-column:1;grid-row:2;height:100%}.phi-copy-label{text-align:center;font-size:.58rem}.phi-chapter-copy h3{max-width:11em;margin-inline:auto;text-align:center;font-size:clamp(1.6rem,7vw,2.2rem)}.phi-copy-rule{margin-inline:auto}.phi-chapter-definition p{max-width:35em;margin-inline:auto;font-size:clamp(.78rem,3.2vw,.92rem);line-height:1.55}.phi-card-viewport-anchor{width:min(78vw,320px,var(--phi-card-safe-width))}.phi-flip-frame img{border-radius:20px}.phi-reduced{padding:80px 18px}.phi-reduced article{grid-template-columns:1fr;gap:20px}}
      `}</style>
      <div className="phi-backdrop">
        <motion.h2 id="philosophy-title" className="phi-backdrop-title" style={{ opacity: backdropOpacity }}>
          <motion.span className="phi-backdrop-title__our" style={{ y: backdropOurY }}>Our</motion.span>
        <motion.span className="phi-backdrop-title__main" style={{ x: backdropPhilosophyX, opacity: backdropPhilosophyOpacity }}>Philosophy</motion.span>
      </motion.h2>
        <motion.div className="phi-content-veil" style={{ opacity: contentVeilOpacity }} aria-hidden="true" />
      </div>
      {PHILOSOPHY_STAGES.map((_, index) => (
        <PhilosophyChapter
          key={PHILOSOPHY_STAGES[index].stage}
          index={index}
          exitOpacity={index === PHILOSOPHY_STAGES.length - 1 ? growthTextOpacity : undefined}
          exitY={index === PHILOSOPHY_STAGES.length - 1 ? growthTextY : undefined}
          exitHidden={index === PHILOSOPHY_STAGES.length - 1 && growthForegroundHidden}
        />
      ))}
      <div className="phi-story-outro" aria-hidden="true" />
      <div ref={philosophyCardRef} className={`phi-card-viewport-anchor is-${cardPhase}`} aria-hidden="true">
        <div className="phi-travel-centre">
          <motion.div
            className={`phi-growth-exit${growthForegroundHidden ? ' is-exit-hidden' : ''}`}
            style={{ opacity: growthPhotoOpacity, scale: growthPhotoScale, y: growthPhotoY }}
          >
            <motion.div className="phi-flip-frame" style={{ scale: cardScale }}>
              {[0, 1, 2, 3].map(index => <PhilosophyVisualFace key={index} index={index} progress={storyProgress} />)}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  AWARD BRIDGE — a short hand-off from philosophy to recognition
// ══════════════════════════════════════════════════════════════
const OurAwardTransition = ({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) => {
  return (
    <section ref={sectionRef} className="our-award-bridge" aria-labelledby="our-award-title">
      <style>{`
        .our-award-bridge{position:relative;z-index:30;display:grid;min-height:clamp(190px,25svh,260px);place-items:center;overflow:hidden;background:#F5F0E8;color:${C.navy};isolation:isolate}
        .our-award-bridge:before{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,${C.navy} 0 2px,transparent 2px);content:''}
        .oa-bridge-copy{width:min(calc(100% - 48px),760px);text-align:center}
        .oa-bridge-rule{display:flex;align-items:center;justify-content:center;gap:10px;width:118px;margin:0 auto 18px;color:#b8872f}.oa-bridge-rule:before,.oa-bridge-rule:after{content:'';height:1px;flex:1;background:currentColor;opacity:.65}.oa-bridge-rule span{font-size:.55rem}
        .oa-bridge-label{margin:0 0 9px;color:#ad7d29;font:700 clamp(.58rem,.8vw,.72rem)/1.4 ${sans};letter-spacing:.16em;text-transform:uppercase}
        .oa-bridge-title{margin:0;color:${C.navy};font:400 clamp(1.8rem,3.6vw,3.6rem)/1.08 ${serif};letter-spacing:-.025em;text-wrap:balance}
        .oa-bridge-proof{margin:12px auto 0;max-width:52ch;color:rgba(10,27,52,.66);font:500 clamp(.72rem,1vw,.9rem)/1.65 ${sans};text-wrap:pretty}
        @media(max-width:600px){.our-award-bridge{min-height:210px}.oa-bridge-copy{width:min(calc(100% - 36px),520px)}.oa-bridge-proof{max-width:36ch}}
      `}</style>
      <div className="oa-bridge-copy">
        <div className="oa-bridge-rule" aria-hidden="true"><span>◆</span></div>
        <p className="oa-bridge-label">Recognition</p>
        <h2 id="our-award-title" className="oa-bridge-title">Outstanding Education Service</h2>
        <p className="oa-bridge-proof">2025 Fairfield City Local Business Awards winner and 2026 Fairfield City Local Business Awards finalist — recognition earned through the work families see every day.</p>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  IMPACT & RECOGNITION
//  Dark navy, premium school prospectus aesthetic.
//  Left: award display + modal.  Right: 2×2 stats grid.
// ══════════════════════════════════════════════════════════════
const ImpactRecognitionSection = ({ sectionRef: providedSectionRef }: { sectionRef?: React.RefObject<HTMLElement> } = {}) => {
  const localSectionRef = useRef<HTMLElement>(null);
  const sectionRef = providedSectionRef ?? localSectionRef;
  const reducedMotionPreference = useReducedMotion();
  const reducedMotion = Boolean(reducedMotionPreference);
  const { scrollYProgress: awardsEntryProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });
  const { scrollYProgress: recognitionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const mastheadOpacity = useTransform(awardsEntryProgress, [0, 0.16, 0.32, 1], reducedMotion ? [1, 1, 1, 1] : [0, 0, 1, 1]);
  const mastheadY = useTransform(awardsEntryProgress, [0, 0.16, 0.32, 1], reducedMotion ? [0, 0, 0, 0] : [30, 30, 0, 0]);
  const headingOpacity = useTransform(awardsEntryProgress, [0, 0.22, 0.42, 1], reducedMotion ? [1, 1, 1, 1] : [0, 0, 1, 1]);
  const headingY = useTransform(awardsEntryProgress, [0, 0.22, 0.42, 1], reducedMotion ? [0, 0, 0, 0] : [36, 36, 0, 0]);
  const introOpacity = useTransform(awardsEntryProgress, [0, 0.28, 0.48, 1], reducedMotion ? [1, 1, 1, 1] : [0, 0, 1, 1]);
  const introY = useTransform(awardsEntryProgress, [0, 0.28, 0.48, 1], reducedMotion ? [0, 0, 0, 0] : [32, 32, 0, 0]);
  const mediaOpacity = useTransform(awardsEntryProgress, [0, 0.38, 0.62, 1], reducedMotion ? [1, 1, 1, 1] : [0, 0, 1, 1]);
  const mediaY = useTransform(awardsEntryProgress, [0, 0.38, 0.62, 1], reducedMotion ? [0, 0, 0, 0] : [42, 42, 0, 0]);
  const captionOpacity = useTransform(awardsEntryProgress, [0, 0.48, 0.70, 1], reducedMotion ? [1, 1, 1, 1] : [0, 0, 1, 1]);
  const captionY = useTransform(awardsEntryProgress, [0, 0.48, 0.70, 1], reducedMotion ? [0, 0, 0, 0] : [24, 24, 0, 0]);
  const closingHeaderOpacity = useTransform(recognitionProgress, [0.56, 0.78], reducedMotion ? [1, 1] : [1, 0.82]);
  const closingHeaderY = useTransform(recognitionProgress, [0.56, 0.78], reducedMotion ? [0, 0] : [0, -16]);
  const awardClosingScale = useTransform(recognitionProgress, [0.55, 0.80], reducedMotion ? [1, 1] : [1, 0.975]);
  const awardClosingY = useTransform(recognitionProgress, [0.55, 0.80], reducedMotion ? [0, 0] : [0, -8]);
  const [streakVisible, setStreakVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setStreakVisible(true);
      return;
    }

    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setStreakVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.28) {
        setStreakVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: [0, 0.28, 0.35] });

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, sectionRef]);

  return (
      <section
        ref={sectionRef}
        className="ir-section"
        aria-label="Impact and recognition"
        style={{ background: '#FBF8F2', position: 'relative', overflow: 'hidden' }}
      >
        <style>{`
          /* ── Editorial recognition composition ─────────────────────── */
          .ir-section {
            isolation: isolate;
            background:
              radial-gradient(circle at 52% 70%, rgba(215,177,94,.045), transparent 32%),
              radial-gradient(circle at 50% 50%, rgba(219,181,96,.03), transparent 46%),
              #FBF8F2;
          }
          .ir-section::before {
            position: absolute;
            top: 0;
            left: clamp(24px, 6vw, 96px);
            right: clamp(24px, 6vw, 96px);
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(190,139,43,.38), transparent);
            content: '';
          }
          .ir-section::after {
            position: absolute;
            left: 50%;
            top: clamp(600px, 49vw, 760px);
            z-index: 0;
            width: clamp(420px, 38vw, 620px);
            aspect-ratio: 1;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(211,168,78,.10), rgba(211,168,78,.035) 36%, transparent 68%);
            content: '';
            pointer-events: none;
            transform: translate(-50%, -50%);
          }
          .ir-old-rule { display: none; }
          .ir-shell {
            position: relative !important;
            z-index: 3;
            max-width: 1400px !important;
            margin: 0 auto;
            isolation: isolate;
            padding: clamp(60px, 6vw, 78px) clamp(20px, 4vw, 56px) clamp(66px, 6vw, 86px) !important;
          }
          .ir-header {
            position: relative;
            z-index: 4;
            max-width: 960px !important;
            margin: 0 auto !important;
            text-align: center;
          }
          .ir-header-logo {
            display: none;
            width: clamp(62px, 5.8vw, 78px);
            height: clamp(62px, 5.8vw, 78px);
            object-fit: contain;
            margin: 0 auto 12px;
          }
          .ir-eyebrow {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: clamp(14px, 1.6vw, 22px);
            margin: 0 0 clamp(20px, 2vw, 24px) !important;
            font-size: clamp(.74rem, .8vw, .86rem) !important;
            letter-spacing: .30em !important;
            color: rgba(168,126,52,.92) !important;
          }
          .ir-eyebrow::before,
          .ir-eyebrow::after {
            width: clamp(44px, 4.8vw, 70px);
            height: 1px;
            background: rgba(207,165,74,.66);
            content: '';
          }
          .ir-heading {
            max-width: 980px;
            margin: 0 auto 20px !important;
            font-size: clamp(3.5rem, 5vw, 6.5rem) !important;
            font-weight: 700 !important;
            line-height: .97 !important;
            letter-spacing: 0 !important;
            text-wrap: balance;
          }
          .ir-header-divider {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 128px !important;
            height: 13px !important;
            margin: 0 auto 18px !important;
            background: transparent !important;
            transform-origin: center !important;
          }
          .ir-header-divider::before,
          .ir-header-divider::after {
            width: 42px;
            height: 1px;
            background: rgba(190,139,43,.48);
            content: '';
          }
          .ir-header-divider::before { margin-right: 14px; }
          .ir-header-divider::after { margin-left: 14px; }
          .ir-header-divider span,
          .ir-showcase-divider span {
            width: 9px;
            height: 9px;
            flex: 0 0 auto;
            border: 1px solid rgba(190,139,43,.58);
            background: rgba(212,175,55,.52);
            transform: rotate(45deg);
          }
          .ir-intro-copy {
            max-width: 900px;
            margin-inline: auto !important;
            font-size: clamp(1rem, 1.08vw, 1.18rem) !important;
            line-height: 1.55 !important;
            color: rgba(10,27,52,.72) !important;
          }
          .ir-award-curves {
            position: relative;
            display: block;
            left: 50%;
            top: auto;
            z-index: 1;
            width: 112vw;
            height: clamp(86px, 8vw, 116px);
            margin: clamp(16px, 2vw, 24px) 0 clamp(16px, 2vw, 24px);
            pointer-events: none;
            transform: translateX(-50%);
            overflow: visible;
          }
          .ir-streak {
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            opacity: 0;
            will-change: stroke-dashoffset;
          }
          .ir-streak-primary {
            filter: drop-shadow(0 4px 8px rgba(115,74,12,.12));
          }
          .ir-award-curves.is-visible .ir-streak-primary {
            opacity: 1;
            animation: ir-streak-trace 2.25s cubic-bezier(.65,0,.35,1) forwards;
          }
          .ir-award-curves.is-visible .ir-streak-secondary {
            opacity: 1;
            animation: ir-streak-trace 2.3s cubic-bezier(.65,0,.35,1) 150ms forwards;
          }
          .ir-award-curves.is-visible .ir-streak-tertiary {
            opacity: 1;
            animation: ir-streak-trace 2.35s cubic-bezier(.65,0,.35,1) 280ms forwards;
          }
          .ir-streak-glint {
            opacity: 0;
            filter: drop-shadow(0 0 8px rgba(211,168,78,.30));
            pointer-events: none;
          }
          @keyframes ir-streak-trace {
            to { stroke-dashoffset: 0; }
          }
          .ir-showcase {
            position: relative;
            z-index: 3;
            display: grid;
            grid-template-columns: minmax(280px, .95fr) minmax(320px, 1.15fr) minmax(270px, .9fr);
            align-items: start;
            gap: clamp(42px, 4.8vw, 76px);
            max-width: 1360px;
            margin: 0 auto;
            padding: 0;
          }
          .ir-showcase-divider { display: none; }
          .ir-award-proof {
            align-self: start;
            text-align: center;
          }
          .ir-award-badges {
            position: relative;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(34px, 3.2vw, 52px);
            align-items: start;
          }
          .ir-award-badges::before {
            position: absolute;
            top: 22px;
            bottom: 16px;
            left: 50%;
            width: 1px;
            background: linear-gradient(180deg, transparent, rgba(207,165,74,.58), transparent);
            content: '';
            transform: translateX(-50%);
          }
          .ir-award-badges::after {
            position: absolute;
            top: 58%;
            left: 50%;
            width: 12px;
            height: 12px;
            border: 1px solid rgba(207,165,74,.66);
            background: #D3A84E;
            box-shadow: 0 0 0 10px rgba(251,248,242,.82);
            content: '';
            transform: translate(-50%, -50%) rotate(45deg);
          }
          .ir-award-badge {
            min-width: 0;
            position: relative;
            z-index: 4;
            padding: 0;
            transition:
              transform 350ms cubic-bezier(.22,.61,.36,1),
              filter 350ms cubic-bezier(.22,.61,.36,1),
              opacity 350ms cubic-bezier(.22,.61,.36,1);
          }
          .ir-award-badge:hover {
            transform: translateY(-5px);
          }
          .ir-award-frame {
            width: 100%;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            transition: transform 300ms ease;
          }
          .ir-award-badge:hover .ir-award-frame { transform: translateY(-2px); }
          .ir-award-inner {
            position: relative;
            width: min(100%, 150px);
            height: auto;
            margin: 0 auto;
            aspect-ratio: 407 / 600;
            overflow: visible !important;
            border: 0 !important;
            border-radius: 0 !important;
            background: transparent !important;
          }
          .ir-award-badge--finalist .ir-award-inner {
            width: min(100%, 166px);
            aspect-ratio: 1 / 1;
          }
          .ir-award-inner .ir-award-medal {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 2;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            max-height: none !important;
            object-fit: contain !important;
            display: block;
            filter:
              drop-shadow(0 10px 18px rgba(38,31,20,.10))
              drop-shadow(0 3px 8px rgba(38,31,20,.05));
            transform: translate(-50%, -50%);
            transition: filter 350ms cubic-bezier(.22,.61,.36,1);
          }
          .ir-award-badge:hover .ir-award-medal {
            filter:
              drop-shadow(0 16px 24px rgba(38,31,20,.14))
              drop-shadow(0 5px 12px rgba(38,31,20,.07));
          }
          .ir-award-caption {
            position: relative;
            z-index: 5;
            margin-top: clamp(14px, 1.6vw, 18px) !important;
            padding: 0 !important;
          }
          .ir-award-year {
            margin: 0 0 3px;
            font: 500 clamp(1.7rem, 2.6vw, 2.35rem)/1 ${serif};
            color: #B8872F;
            letter-spacing: .02em;
          }
          .ir-award-caption-title {
            margin: 0 0 8px;
            font-family: ${serif} !important;
            font-size: clamp(1.34rem, 1.85vw, 1.72rem) !important;
            font-weight: 700 !important;
            line-height: 1.05 !important;
            letter-spacing: .09em !important;
            text-transform: uppercase;
            color: rgba(10,27,52,.92) !important;
          }
          .ir-award-caption p:last-child {
            font-family: ${sans};
            font-size: clamp(.72rem, .92vw, .86rem) !important;
            font-weight: 700 !important;
            line-height: 1.55 !important;
            letter-spacing: .20em !important;
            text-transform: uppercase;
            color: rgba(10,27,52,.68) !important;
            margin: 0;
          }
          .ir-video-feature {
            min-width: 0;
            display: flex;
            justify-content: center;
            align-self: start;
          }
          .ir-thumb-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          .ir-thumb-wrap::before {
            position: absolute;
            z-index: 0;
            width: clamp(360px, 34vw, 560px);
            aspect-ratio: 1;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(210,166,76,.12), rgba(210,166,76,.045) 42%, transparent 72%);
            content: '';
            pointer-events: none;
          }
          .ir-thumb-frame {
            position: relative;
            z-index: 5;
            width: clamp(320px, 29vw, 480px);
            max-width: 100%;
            aspect-ratio: 1 / 1;
            flex: 0 0 auto;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgba(207,165,74,.70);
            outline: 1px solid rgba(207,165,74,.22);
            outline-offset: 8px;
            box-shadow:
              0 20px 55px rgba(38,31,20,.10),
              0 4px 12px rgba(38,31,20,.05),
              0 5px 18px rgba(207,165,74,.10),
              inset 0 0 0 1px rgba(255,255,255,.55);
          }
          .ir-thumb-photo {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            object-position: 50% 44%;
            filter: saturate(.96) brightness(.98);
          }
          .ir-thumb-overlay {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: linear-gradient(to top, rgba(3,6,14,.18), transparent 48%);
          }
          .ir-winner-details {
            min-width: 0;
            position: relative;
            z-index: 5;
            align-self: start;
            text-align: center;
            color: ${C.navy};
          }
          .ir-winner-trophy {
            display: block;
            width: clamp(148px, 13vw, 208px);
            height: clamp(148px, 13vw, 208px);
            object-fit: contain;
            margin: 0 auto 10px;
            filter:
              drop-shadow(0 12px 18px rgba(57,40,16,.12))
              drop-shadow(0 3px 8px rgba(57,40,16,.06));
            transform: rotate(-24deg);
            transform-origin: 50% 58%;
          }
          .ir-thumb-caption-title {
            margin: 0 0 18px;
            font-family: ${serif};
            font-size: clamp(2.65rem, 4vw, 4.4rem);
            font-weight: 500;
            line-height: .9;
            letter-spacing: .04em;
            text-transform: uppercase;
            color: rgba(10,27,52,.96);
          }
          .ir-winner-rule {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 182px;
            height: 12px;
            margin: 0 auto 20px;
          }
          .ir-winner-rule::before,
          .ir-winner-rule::after {
            width: 66px;
            height: 1px;
            background: rgba(190,139,43,.42);
            content: '';
          }
          .ir-winner-rule::before { margin-right: 12px; }
          .ir-winner-rule::after { margin-left: 12px; }
          .ir-winner-rule span {
            width: 8px;
            height: 8px;
            border: 1px solid rgba(190,139,43,.56);
            background: rgba(212,175,55,.48);
            transform: rotate(45deg);
          }
          .ir-thumb-caption-sub {
            max-width: 34ch;
            margin: 0 auto;
            font-family: ${sans};
            font-size: clamp(.95rem, 1.05vw, 1.08rem);
            font-weight: 400;
            line-height: 1.62;
            letter-spacing: .01em;
            color: rgba(10,27,52,.68);
          }
          .ir-thumb-caption-sub em {
            display: block;
            margin-bottom: 7px;
            font-family: ${serif};
            font-size: clamp(1.08rem, 1.3vw, 1.28rem);
            font-style: italic;
            font-weight: 500;
            line-height: 1.25;
            color: rgba(10,27,52,.90);
          }
          @media (max-width: 1100px) {
            .ir-showcase {
              grid-template-columns: minmax(0, 1fr) minmax(270px, .95fr);
              align-items: center;
              row-gap: 38px;
            }
            .ir-video-feature {
              grid-column: 2;
              grid-row: 1;
            }
            .ir-winner-details {
              grid-column: 1 / -1;
              grid-row: 2;
            }
            .ir-thumb-frame { width: clamp(300px, 40vw, 400px); }
            .ir-award-curves {
              height: clamp(82px, 13vw, 116px);
              margin: clamp(18px, 3vw, 28px) 0 clamp(18px, 3vw, 28px);
            }
          }
          @media (max-width: 760px) {
            .ir-shell {
              padding: clamp(92px, 22vw, 112px) clamp(18px, 5vw, 24px) clamp(52px, 10vw, 68px) !important;
            }
            .ir-header {
              margin-bottom: 34px !important;
            }
            .ir-header-logo {
              width: 76px;
              height: 76px;
              margin-bottom: 13px;
            }
            .ir-eyebrow {
              font-size: .68rem !important;
              letter-spacing: .20em !important;
              margin-bottom: 14px !important;
            }
            .ir-heading {
              font-size: clamp(2.35rem, 11vw, 3.25rem) !important;
              line-height: 1.02 !important;
              margin-bottom: 17px !important;
            }
            .ir-header-divider {
              margin-bottom: 17px !important;
            }
            .ir-intro-copy {
              font-size: .98rem !important;
              line-height: 1.58 !important;
            }
            .ir-award-curves {
              height: clamp(76px, 20vw, 104px);
              margin: 20px 0 24px;
              opacity: .72;
            }
            .ir-showcase {
              display: flex;
              flex-direction: column;
              gap: 30px;
              padding: 0;
            }
            .ir-award-badges {
              width: 100%;
              gap: 30px;
            }
            .ir-award-badge {
              padding: 0;
            }
            .ir-award-inner {
              width: min(100%, 116px);
            }
            .ir-award-badge--finalist .ir-award-inner {
              width: min(100%, 132px);
            }
            .ir-award-year {
              font-size: clamp(1.38rem, 7vw, 1.76rem);
            }
            .ir-award-caption-title {
              font-size: clamp(1rem, 5vw, 1.22rem) !important;
            }
            .ir-award-caption p:last-child {
              font-size: .62rem !important;
              letter-spacing: .10em !important;
            }
            .ir-thumb-frame {
              width: clamp(220px, 70vw, 310px);
            }
            .ir-winner-trophy {
              width: clamp(120px, 34vw, 148px);
              height: clamp(120px, 34vw, 148px);
              margin-bottom: 8px;
            }
            .ir-thumb-caption-title {
              font-size: clamp(1.85rem, 9vw, 2.35rem);
              margin-bottom: 13px;
            }
            .ir-winner-rule {
              margin-bottom: 15px;
            }
            .ir-thumb-caption-sub {
              font-size: .95rem;
              line-height: 1.54;
            }
          }
          @media (max-width: 340px) {
            .ir-award-badges {
              grid-template-columns: 1fr;
            }
            .ir-award-badge {
              max-width: 230px;
              margin-inline: auto;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .ir-streak {
              animation: none !important;
              opacity: 1 !important;
              stroke-dashoffset: 0 !important;
            }
            .ir-streak-glint {
              display: none !important;
            }
            .ir-award-badge,
            .ir-award-frame {
              transition: none !important;
            }
            .ir-award-badge:hover,
            .ir-award-badge:hover .ir-award-frame {
              transform: none !important;
            }
          }
        `}</style>

        {/* Top edge: very faint gold rule separating from previous section */}
        <div className="ir-old-rule" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,.30) 25%, rgba(212,175,55,.30) 75%, transparent)',
        }} />

        <div className="ir-shell" style={{
          maxWidth: '1200px', margin: '0 auto', position: 'relative',
          padding: 'clamp(64px, 8vw, 108px) clamp(24px, 5vw, 72px)',
        }}>

          {/* ── FULL-WIDTH HEADER ───────────────────────────────────────── */}
          <motion.div className="ir-header" style={{ maxWidth: '760px', marginBottom: 'clamp(48px, 6vw, 80px)', opacity: closingHeaderOpacity, y: closingHeaderY }}>

            <motion.div style={{ opacity: mastheadOpacity, y: mastheadY }}>
              <img
                className="ir-header-logo"
                src="/images/da-logo.png"
                alt=""
                aria-hidden="true"
              />
              <p
                className="ir-eyebrow"
                style={{
                  fontFamily: sans, fontSize: '.52rem', fontWeight: 600,
                  letterSpacing: '.32em', textTransform: 'uppercase',
                  color: C.gold, margin: '0 0 28px',
                }}
              >
                Recognised By Our Community
              </p>
            </motion.div>

            <motion.h2
              className="ir-heading"
              style={{
                opacity: headingOpacity, y: headingY,
                fontFamily: serif, fontWeight: 700,
                fontSize: 'clamp(2.4rem, 3.8vw, 4.4rem)',
                lineHeight: 1.10, letterSpacing: '-.028em',
                color: C.navy, margin: '0 0 20px',
              }}
            >
              The Community Noticed<br />
              What Families Already Knew.
            </motion.h2>

            <motion.div
              className="ir-header-divider"
              style={{
                opacity: headingOpacity,
                width: '40px', height: '1px', marginBottom: '22px',
                background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                transformOrigin: 'left',
              }}
            >
              <span aria-hidden="true" />
            </motion.div>

            <motion.p
              className="ir-intro-copy"
              style={{
                opacity: introOpacity, y: introY,
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
          </motion.div>

          <svg
            className={`ir-award-curves ${streakVisible ? 'is-visible' : ''}`}
            viewBox="0 0 1600 140"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              id="ir-streak-primary-path"
              className="ir-streak ir-streak-primary"
              pathLength="1"
              d="M -80 58 C 150 86 350 84 548 56 C 704 34 850 36 1014 58 C 1200 86 1386 90 1680 42"
              stroke="#CFA54A"
              strokeWidth="2.35"
              strokeOpacity=".80"
            />
            <path
              className="ir-streak ir-streak-secondary"
              pathLength="1"
              d="M -80 76 C 152 102 354 100 552 74 C 710 52 850 54 1010 76 C 1198 104 1390 108 1680 60"
              stroke="#D8B45F"
              strokeWidth="1"
              strokeOpacity=".28"
            />
            <path
              className="ir-streak ir-streak-tertiary"
              pathLength="1"
              d="M -80 94 C 154 118 360 116 560 92 C 712 72 852 74 1008 94 C 1192 122 1390 126 1680 78"
              stroke="#D8B45F"
              strokeWidth="1"
              strokeOpacity=".16"
            />
            {streakVisible && !reducedMotion && (
              <circle className="ir-streak-glint" r="4.2" fill="#E4BC5A">
                <animateMotion dur="2.25s" begin="0s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".65 0 .35 1">
                  <mpath href="#ir-streak-primary-path" />
                </animateMotion>
                <animate attributeName="opacity" values="0;.85;.75;0" keyTimes="0;.08;.82;1" dur="2.25s" begin="0s" fill="freeze" />
              </circle>
            )}
          </svg>

          {/* ── Awards showcase: achievement badges | recipient photo | winner details ── */}
          <motion.div
            className="ir-showcase"
            style={{
              opacity: mediaOpacity,
              y: mediaY,
            }}
          >

            {/* ── Award badges ──────────────────────────────────────────── */}
            <motion.div className="ir-award-proof" style={{ scale: awardClosingScale, y: awardClosingY }}>
              <div className="ir-award-badges">
                <div className="ir-award-badge ir-award-badge--winner">
                  <div className="ir-award-frame">
                    <div className="ir-award-inner">
                      <img
                        className="ir-award-medal"
                        src="/Photos and Videos/2025_FAIR_WINNER_LBA.jpg"
                        alt="Fairfield City Local Business Awards — Outstanding Education Service, Winner 2025"
                      />
                    </div>
                  </div>
                  <motion.div className="ir-award-caption" style={{ opacity: captionOpacity, y: captionY }}>
                    <p className="ir-award-year">2025</p>
                    <p className="ir-award-caption-title">Winner</p>
                    <p>
                      Education Services
                    </p>
                  </motion.div>
                </div>
                <div className="ir-award-badge ir-award-badge--finalist">
                  <div className="ir-award-frame">
                    <div className="ir-award-inner">
                      <img
                        className="ir-award-medal"
                        src="/images/awards/2026-fairfield-finalist.png"
                        alt="Fairfield City Local Business Awards finalist 2026"
                      />
                    </div>
                  </div>
                  <motion.div className="ir-award-caption" style={{ opacity: captionOpacity, y: captionY }}>
                    <p className="ir-award-year">2026</p>
                    <p className="ir-award-caption-title">Finalist</p>
                    <p>
                      Fairfield City
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* ── Ceremony photo ───────────────────────────────────────── */}
            <div className="ir-video-feature">
              <div className="ir-thumb-wrap">
                <div className="ir-thumb-frame">
                  <img
                    className="ir-thumb-photo"
                    src="/Photos and Videos/EP6_0216.jpg"
                    alt="DA Tuition accepting the Outstanding Education Service award — Fairfield City Local Business Awards 2025"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="ir-thumb-overlay" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* ── Winner details ───────────────────────────────────────── */}
            <motion.div className="ir-winner-details" style={{ opacity: captionOpacity, y: captionY }}>
              <img className="ir-winner-trophy" src="/images/awards/gold-trophy.png" alt="" aria-hidden="true" />
              <p className="ir-thumb-caption-title">Award<br />Winner</p>
              <div className="ir-winner-rule" aria-hidden="true"><span /></div>
              <p className="ir-thumb-caption-sub">
                <em>Outstanding Education Service</em>
                Fairfield City Local Business Awards 2025
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  ACHIEVEMENTS — standalone statistics section
//  Navy background, off-white + gold palette.
// ══════════════════════════════════════════════════════════════

const ACH_STATS = [
  { target: 20,    decimals: 0, suffix: '+', label: 'Years',          caption: 'TWO DECADES OF GUIDANCE',    x: 5,  y: 70 },
  { target: 10000, decimals: 0, suffix: '+', label: 'Students',       caption: 'STUDENTS SUPPORTED',        x: 30, y: 56 },
  { target: 5,     decimals: 1, suffix: '',  label: 'Rating',         caption: 'TRUSTED BY FAMILIES',       x: 48, y: 43 },
  { target: 450,   decimals: 0, suffix: '+', label: 'Google Reviews', caption: 'FIVE-STAR STORIES',         x: 62, y: 24 },
  { target: 125,   decimals: 0, suffix: '+', label: 'Schools',        caption: 'STUDENTS FROM 125+ SCHOOLS', x: 75, y: 7  },
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
          top: 14%;
          left: 8%;
          max-width: 390px;
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
          right: clamp(30px, 8vw, 126px);
          bottom: 9%;
          z-index: 1;
          transform: none;
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
            left: auto;
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
            padding: 158px 24px 116px;
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
            display: none;
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
            display: block;
            right: 24px;
            top: 18px;
            bottom: auto;
            left: auto;
            transform: none;
            font-size: clamp(4.8rem, 24vw, 6.5rem);
            opacity: .86;
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
            <g transform="translate(0 760) scale(1 -1)">
              <path d={ACH_PATH} fill="none" stroke="rgba(212,175,55,.18)" strokeWidth=".9" />
              <path className="ach-gold-path" d={ACH_PATH} fill="none" stroke="rgba(240,200,106,.42)" strokeWidth="1.15" strokeLinecap="round" />
              <path className="ach-shimmer-path" d={ACH_PATH} fill="none" stroke="rgba(255,241,194,.82)" strokeWidth="1.4" strokeLinecap="round" />
              <path className="ach-trail" d={ACH_PATH} fill="none" stroke="rgba(240,200,106,.42)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 18" />
              <circle className="ach-traveller" r="5.2" fill="#F0C86A">
                <animateMotion dur="6.4s" repeatCount="indefinite" rotate="auto" path={ACH_PATH} />
              </circle>
            </g>
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
                  {index === 2 && <span className="ach-star">★</span>}
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

// ══════════════════════════════════════════════════════════════
//  PROGRAMS
// ══════════════════════════════════════════════════════════════
const PROGRAMS = [
  {
    href: '/programs/primary-school',
    image: '/images/homepage/program-cards/primary-school-student.jpg',
    sub: 'Years 3-6',
    name: 'Primary School',
    desc: 'Building strong foundations in literacy, numeracy and confident learning.',
  },
  {
    href: '/programs/high-school',
    image: '/images/homepage/program-cards/high-school-student.jpg',
    sub: 'Years 7-10',
    name: 'High School',
    desc: 'Develop deeper understanding, stronger study habits and independent thinking.',
  },
  {
    href: '/hsc-excellence',
    image: '/images/homepage/program-cards/hsc-excellence-student.jpg',
    sub: 'Years 11-12',
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
        Learn More <span aria-hidden="true">→</span>
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
          <motion.div id="programs-intro" variants={fadeUp} style={{ textAlign: 'center', marginBottom: 'clamp(44px, 5vw, 64px)', scrollMarginTop: '10px' }}>
            <div style={{ fontFamily: sans, fontSize: '.7rem', fontWeight: 800, letterSpacing: '.17em', textTransform: 'uppercase', color: C.gold, marginBottom: '14px' }}>Academic Programs</div>
            <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', letterSpacing: '-.02em', lineHeight: 1.08, color: C.navy, margin: 0 }}>Tailored for Every Stage</h2>
            <p style={{ fontFamily: sans, color: C.muted, fontSize: 'clamp(1rem, 1.35vw, 1.18rem)', lineHeight: 1.7, margin: '18px auto 0', maxWidth: '34rem' }}>The right support at the right time.</p>
          </motion.div>
        </Reveal>
        <motion.div
          id="programs-catalogue"
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

// ══════════════════════════════════════════════════════════════
//  SUBJECT PEEK
// ══════════════════════════════════════════════════════════════
const SUBJECT_PEEK_CARDS: Array<{
  name: string;
  href: string;
  image: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: string;
  desc: string;
  Icon: LucideIcon;
}> = [
  {
    name: 'Mathematics',
    href: '/subjects/mathematics',
    image: '/images/homepage/subject-cards/maths-home-subject.png',
    imageFit: 'contain',
    imagePosition: 'center center',
    desc: 'Build confidence through understanding, problem solving and logical thinking.',
    Icon: Calculator,
  },
  {
    name: 'English',
    href: '/subjects/english',
    image: '/images/homepage/subject-cards/english-home-subject.png',
    imagePosition: 'center center',
    desc: 'Develop confident readers, writers and communicators who love ideas.',
    Icon: BookOpen,
  },
  {
    name: 'Science',
    href: '/subjects/science',
    image: '/images/homepage/subject-cards/science-home-subject.png',
    imagePosition: 'center center',
    desc: 'Discover the world through curiosity, investigation and experimentation.',
    Icon: FlaskConical,
  },
  {
    name: 'Business',
    href: '/subjects/business-studies',
    image: '/images/homepage/subject-cards/business-home-subject.png',
    imagePosition: 'center center',
    desc: 'Think strategically about markets, people, operations and real-world decisions.',
    Icon: BriefcaseBusiness,
  },
  {
    name: 'Legal',
    href: '/subjects/legal-studies',
    image: '/images/homepage/subject-cards/legal-home-subject.png',
    imagePosition: 'center center',
    desc: 'Explore justice, rights and contemporary issues with precise, confident reasoning.',
    Icon: Scale,
  },
];

const SubjectPeekPanel = ({ subject, index }: { subject: typeof SUBJECT_PEEK_CARDS[number]; index: number }) => {
  const Icon = subject.Icon;

  return (
    <motion.div className="subject-peek-card-wrap" variants={fadeUp} layout>
      <Link to={subject.href} className="subject-peek-card" aria-label={`Explore ${subject.name}`}>
        <img
          className={`subject-peek-image${subject.imageFit === 'contain' ? ' subject-peek-image--contain' : ''}`}
          src={subject.image}
          alt=""
          aria-hidden="true"
          loading={index < 3 ? 'eager' : 'lazy'}
          decoding="async"
          sizes="(max-width: 760px) 82vw, 33vw"
          style={{ objectPosition: subject.imagePosition }}
        />
        <div className="subject-peek-overlay" aria-hidden="true" />
        <div className="subject-peek-badge">
          <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
          <span>{subject.name}</span>
        </div>
        <div className="subject-peek-copy">
          <p>{subject.desc}</p>
          <span className="subject-peek-link">
            Explore {subject.name}
            <ArrowRight size={17} strokeWidth={2.3} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

const SubjectPeekSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const visibleSubjects = showAllSubjects ? SUBJECT_PEEK_CARDS : SUBJECT_PEEK_CARDS.slice(0, 3);

  return (
    <section ref={ref} aria-labelledby="subject-peek-heading" style={{ background: C.cream, padding: 'clamp(86px, 8vw, 124px) clamp(18px, 3vw, 48px)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .subject-peek-shell {
          position: relative;
          max-width: 1480px;
          margin: 0 auto;
        }

        .subject-peek-intro {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: end;
          margin-bottom: clamp(32px, 4vw, 52px);
        }

        .subject-peek-kicker {
          margin: 0 0 12px;
          font-family: ${sans};
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .17em;
          line-height: 1;
          text-transform: uppercase;
          color: ${C.gold};
        }

        .subject-peek-title {
          max-width: 780px;
          margin: 0;
          font-family: ${serif};
          font-size: clamp(2.2rem, 4.4vw, 3.85rem);
          font-weight: 600;
          line-height: 1.06;
          letter-spacing: -.02em;
          color: ${C.navy};
          text-wrap: balance;
        }

        .subject-peek-more {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          min-height: 48px;
          padding: 14px 20px;
          border: 1px solid rgba(200, 155, 60, .52);
          border-radius: 999px;
          background: ${C.navy};
          color: ${C.white};
          font-family: ${sans};
          font-size: .76rem;
          font-weight: 800;
          letter-spacing: .11em;
          line-height: 1.2;
          text-transform: uppercase;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(10, 27, 52, .16);
          transition: transform 350ms cubic-bezier(.22, 1, .36, 1), box-shadow 350ms ease, background 350ms ease;
        }

        .subject-peek-more svg {
          color: ${C.goldL};
          transition: transform 350ms cubic-bezier(.22, 1, .36, 1);
        }

        .subject-peek-more:hover,
        .subject-peek-more:focus-visible {
          background: ${C.navy2};
          transform: translateY(-2px);
          box-shadow: 0 18px 34px rgba(10, 27, 52, .2);
        }

        .subject-peek-more:hover svg,
        .subject-peek-more:focus-visible svg {
          transform: translateX(4px);
        }

        .subject-peek-more:focus-visible {
          outline: 3px solid rgba(212, 175, 55, .76);
          outline-offset: 4px;
        }

        .subject-peek-frame {
          --peek-gap: clamp(20px, 2.2vw, 36px);
          position: relative;
          overflow: visible;
          padding: 2px 2px 32px;
        }

        .subject-peek-track {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: flex-start;
          gap: var(--peek-gap);
        }

        .subject-peek-card-wrap {
          min-width: 0;
          padding-top: clamp(22px, 2.4vw, 42px);
        }

        .subject-peek-card-wrap:nth-child(2) {
          padding-top: 0;
        }

        .subject-peek-card {
          position: relative;
          display: block;
          height: clamp(470px, 39vw, 620px);
          overflow: hidden;
          isolation: isolate;
          border: 1px solid rgba(200, 155, 60, .52);
          border-radius: 30px;
          background: ${C.navy};
          color: #fff;
          text-decoration: none;
          box-shadow: 0 22px 45px rgba(10, 27, 52, .12);
          transform: translateZ(0);
          transition: transform 500ms cubic-bezier(.22, 1, .36, 1), box-shadow 500ms ease, border-color 500ms ease;
        }

        .subject-peek-card-wrap:nth-child(2) .subject-peek-card {
          height: clamp(540px, 45vw, 710px);
        }

        .subject-peek-image {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(.98) brightness(1.04);
          transition: transform 650ms cubic-bezier(.22, 1, .36, 1), filter 500ms ease;
        }

        .subject-peek-image--contain {
          object-fit: contain;
          background: linear-gradient(180deg, #f5ecdf 0%, #efe0cf 100%);
        }

        .subject-peek-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(10, 27, 52, .04) 0%, rgba(10, 27, 52, .13) 43%, rgba(5, 18, 38, .88) 100%),
            linear-gradient(90deg, rgba(8, 24, 50, .2) 0%, transparent 48%, rgba(8, 24, 50, .18) 100%);
        }

        .subject-peek-badge {
          position: absolute;
          top: clamp(18px, 2vw, 28px);
          left: clamp(18px, 2vw, 28px);
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          max-width: calc(100% - 36px);
          padding: 10px 17px;
          border: 1px solid rgba(200, 155, 60, .44);
          border-radius: 999px;
          background: rgba(10, 27, 52, .9);
          color: #fff;
          box-shadow: 0 10px 20px rgba(4, 14, 30, .18);
          font-family: ${sans};
          font-size: .74rem;
          font-weight: 800;
          letter-spacing: .13em;
          line-height: 1;
          text-transform: uppercase;
        }

        .subject-peek-badge svg {
          flex: 0 0 auto;
          color: ${C.goldL};
        }

        .subject-peek-copy {
          position: absolute;
          left: clamp(24px, 2.5vw, 38px);
          right: clamp(24px, 2.5vw, 38px);
          bottom: clamp(28px, 3vw, 42px);
          z-index: 2;
        }

        .subject-peek-copy p {
          max-width: 34ch;
          margin: 0 0 24px;
          color: rgba(255, 255, 255, .9);
          font-family: ${sans};
          font-size: clamp(1rem, 1.25vw, 1.16rem);
          font-weight: 600;
          line-height: 1.55;
          text-wrap: pretty;
        }

        .subject-peek-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: ${C.goldL};
          font-family: ${sans};
          font-size: .78rem;
          font-weight: 900;
          letter-spacing: .1em;
          line-height: 1.25;
          text-transform: uppercase;
        }

        .subject-peek-link svg {
          transition: transform 350ms cubic-bezier(.22, 1, .36, 1);
        }

        .subject-peek-card:hover,
        .subject-peek-card:focus-visible {
          transform: translateY(-8px);
          border-color: rgba(212, 175, 55, .92);
          box-shadow: 0 30px 60px rgba(10, 27, 52, .18);
        }

        .subject-peek-card:hover .subject-peek-image,
        .subject-peek-card:focus-visible .subject-peek-image {
          transform: scale(1.045);
          filter: saturate(1.02) brightness(1.08);
        }

        .subject-peek-card:hover .subject-peek-link svg,
        .subject-peek-card:focus-visible .subject-peek-link svg {
          transform: translateX(7px);
        }

        .subject-peek-card:focus-visible {
          outline: 3px solid rgba(212, 175, 55, .78);
          outline-offset: 5px;
        }

        .subject-peek-sweep {
          position: absolute;
          left: 8%;
          right: 8%;
          bottom: -14px;
          z-index: 0;
          height: 70px;
          border-bottom: 1px dashed rgba(200, 155, 60, .48);
          border-radius: 0 0 50% 50%;
          pointer-events: none;
        }

        .subject-peek-star {
          position: absolute;
          bottom: -9px;
          width: 9px;
          height: 9px;
          background: ${C.gold};
          transform: rotate(45deg);
          box-shadow: 0 0 0 6px rgba(250, 247, 240, .78);
        }

        .subject-peek-star:nth-child(1) { left: 31%; }
        .subject-peek-star:nth-child(2) { left: 50%; }
        .subject-peek-star:nth-child(3) { left: 69%; }

        @media (max-width: 980px) {
          .subject-peek-intro {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .subject-peek-more {
            width: fit-content;
          }

          .subject-peek-frame {
            padding-bottom: 0;
          }

          .subject-peek-track {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .subject-peek-card-wrap,
          .subject-peek-card-wrap:nth-child(2) {
            padding-top: 0;
          }

          .subject-peek-card,
          .subject-peek-card-wrap:nth-child(2) .subject-peek-card {
            height: clamp(440px, 96vw, 570px);
          }

          .subject-peek-sweep {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .subject-peek-track {
            grid-template-columns: 1fr;
          }

          .subject-peek-card,
          .subject-peek-card-wrap:nth-child(2) .subject-peek-card {
            border-radius: 24px;
          }

          .subject-peek-copy p {
            font-size: .98rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .subject-peek-track,
          .subject-peek-card,
          .subject-peek-image,
          .subject-peek-link svg,
          .subject-peek-more,
          .subject-peek-more svg {
            transition: none !important;
          }

          .subject-peek-more:hover,
          .subject-peek-more:focus-visible,
          .subject-peek-more:hover svg,
          .subject-peek-more:focus-visible svg,
          .subject-peek-card:hover,
          .subject-peek-card:focus-visible,
          .subject-peek-card:hover .subject-peek-image,
          .subject-peek-card:focus-visible .subject-peek-image,
          .subject-peek-card:hover .subject-peek-link svg,
          .subject-peek-card:focus-visible .subject-peek-link svg {
            transform: none;
          }
        }
      `}</style>
      <div className="subject-peek-shell">
        <motion.div className="subject-peek-intro" variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp}>
            <p className="subject-peek-kicker">Subject Pathways</p>
            <h2 id="subject-peek-heading" className="subject-peek-title">Explore the subjects students grow through at DA.</h2>
          </motion.div>
          <motion.button
            type="button"
            className="subject-peek-more"
            variants={fadeUp}
            aria-expanded={showAllSubjects}
            aria-controls="subject-peek-cards"
            onClick={() => setShowAllSubjects((open) => !open)}
          >
            <span>{showAllSubjects ? 'Show fewer subjects' : 'See more subjects'}</span>
            <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
          </motion.button>
        </motion.div>

        <div className="subject-peek-frame" aria-label="Subject cards">
          <motion.div id="subject-peek-cards" className="subject-peek-track" variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} layout>
            <AnimatePresence initial={false}>
              {visibleSubjects.map((subject, index) => (
                <SubjectPeekPanel key={subject.name} subject={subject} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
          <div className="subject-peek-sweep" aria-hidden="true">
            <span className="subject-peek-star" />
            <span className="subject-peek-star" />
            <span className="subject-peek-star" />
          </div>
        </div>
      </div>
    </section>
  );
};


// ══════════════════════════════════════════════════════════════
//  PULL QUOTE
// ══════════════════════════════════════════════════════════════
const QuoteSection = () => {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: reducedMotion ? undefined : ref, offset: ['start start', 'end end'] });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const preludeOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 1, 0]);
  const preludeY = useTransform(scrollYProgress, [0, 0.18], [0, -24]);
  const ornamentOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [0, 0.45, 1]);
  const ornamentY = useTransform(scrollYProgress, [0, 0.15], [12, 0]);
  const line1Opacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.15, 0.35], [30, 0]);
  const line1Blur = useTransform(scrollYProgress, [0.15, 0.35], ['blur(6px)', 'blur(0px)']);
  const line2Opacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.35, 0.55], [30, 0]);
  const line2Blur = useTransform(scrollYProgress, [0.35, 0.55], ['blur(6px)', 'blur(0px)']);
  const toppingColour = useTransform(scrollYProgress, [0.48, 0.55], ['rgba(250,250,248,.95)', C.goldL]);
  const line3Opacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const line3Y = useTransform(scrollYProgress, [0.55, 0.75], [30, 0]);
  const line3Blur = useTransform(scrollYProgress, [0.55, 0.75], ['blur(6px)', 'blur(0px)']);
  const line4Opacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const line4Y = useTransform(scrollYProgress, [0.75, 0.9], [30, 0]);
  const line4Blur = useTransform(scrollYProgress, [0.75, 0.9], ['blur(6px)', 'blur(0px)']);
  const confidenceColour = useTransform(scrollYProgress, [0.84, 0.9], ['rgba(250,250,248,.95)', '#FFFDF5']);
  const attributionOpacity = useTransform(scrollYProgress, [0.9, 0.96], [0, 1]);
  const attributionY = useTransform(scrollYProgress, [0.9, 0.96], [16, 0]);

  if (reducedMotion) {
    return (
      <section className="quote-static" style={{ background: C.navy, padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <style>{`.quote-static .quote-review-line{display:block}.quote-static .quote-emphasis{color:${C.goldL}}`}</style>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '80px', background: `linear-gradient(180deg,transparent,${C.gold})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '80px', background: `linear-gradient(180deg,${C.gold},transparent)` }} />
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontFamily: serif, fontSize: '4rem', color: 'rgba(212,175,55,.3)', lineHeight: 1, marginBottom: '16px' }}>❝</div>
          <p style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.44, color: C.white, letterSpacing: '.01em' }}>
            <span className="quote-review-line">My daughter went from dreading maths to</span>
            <span className="quote-review-line"><span className="quote-emphasis">topping her class.</span></span>
            <span className="quote-review-line">DA Tuition didn't just improve her grades —</span>
            <span className="quote-review-line">they <span style={{ color: '#FFFDF5' }}>gave her back her confidence.</span></span>
          </p>
          <div style={{ width: '40px', height: '1px', background: C.gold, margin: '32px auto 18px' }} />
          <p style={{ margin: 0, fontFamily: sans, fontSize: '.74rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(212,175,55,.80)', fontWeight: 600 }}>Parent of Year 10 Student · Google Review · ★★★★★</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="quote-scroll" aria-label="Parent testimonial">
      <style>{`
        .quote-scroll{position:relative;height:180svh;background:${C.navy};color:${C.white}}
        .quote-sticky{position:sticky;top:0;height:100svh;min-height:560px;display:grid;place-items:center;overflow:hidden;padding:clamp(88px,12vh,120px) 24px;text-align:center;background:${C.navy}}
        .quote-prelude{position:absolute;z-index:1;inset:0;display:grid;place-items:center;padding:clamp(88px,12vh,120px) 24px;pointer-events:none}
        .quote-prelude p{max-width:16ch;margin:0;font:400 clamp(2.1rem,4.6vw,4.5rem)/1.08 ${serif};letter-spacing:-.025em;color:rgba(250,250,248,.96);text-wrap:balance}
        .quote-prelude span{display:block;margin-top:22px;font:600 .72rem/1.5 ${sans};letter-spacing:.14em;text-transform:uppercase;color:rgba(212,175,55,.88)}
        .quote-progress{position:absolute;z-index:3;top:0;left:0;width:100%;height:1px;background:${C.gold};opacity:.55;transform-origin:left center;will-change:transform}
        .quote-line-top,.quote-line-bottom{position:absolute;left:50%;width:1px;height:80px;transform:translateX(-50%);pointer-events:none}.quote-line-top{top:0;background:linear-gradient(180deg,transparent,${C.gold})}.quote-line-bottom{bottom:0;background:linear-gradient(180deg,${C.gold},transparent)}
        .quote-reading{width:100%;max-width:800px;margin:0 auto}
        .quote-mark{font:400 4rem/1 ${serif};color:rgba(212,175,55,.3);margin-bottom:16px;will-change:transform,opacity}
        .quote-review{margin:0;font:italic 300 clamp(1.8rem,4vw,3rem)/1.44 ${serif};letter-spacing:.01em;color:${C.white}}
        .quote-review-line{display:block;will-change:transform,opacity,filter}
        .quote-attribution-rule{width:40px;height:1px;margin:32px auto 18px;background:${C.gold}}
        .quote-attribution{margin:0;font:600 .74rem/1.65 ${sans};letter-spacing:.14em;text-transform:uppercase;color:rgba(212,175,55,.8);will-change:transform,opacity}
        .quote-attribution span{display:inline-block}.quote-attribution span+span:before{content:' · ';padding-inline:.32em}
        @media(max-width:760px){.quote-scroll{height:170svh}.quote-sticky,.quote-prelude{min-height:500px;padding:74px 20px}.quote-prelude p{font-size:clamp(2rem,9vw,3.1rem)}.quote-mark{font-size:3.25rem;margin-bottom:12px}.quote-review{font-size:clamp(1.55rem,7.2vw,2.2rem);line-height:1.38}.quote-review-line{transform-origin:center}.quote-attribution{font-size:.66rem;line-height:1.7;letter-spacing:.1em}.quote-attribution span{display:block}.quote-attribution span+span:before{content:'';padding:0}}
      `}</style>
      <div className="quote-sticky">
        <motion.div className="quote-progress" style={{ scaleX: progressScale }} aria-hidden="true" />
        <motion.div className="quote-line-top" style={{ opacity: ornamentOpacity }} aria-hidden="true" />
        <motion.div className="quote-line-bottom" style={{ opacity: attributionOpacity }} aria-hidden="true" />
        <motion.div className="quote-prelude" style={{ opacity: preludeOpacity, y: preludeY }}>
          <div>
            <p>When a child starts believing in themselves, everything can change.</p>
            <span>One parent’s story</span>
          </div>
        </motion.div>
        <div className="quote-reading">
          <motion.div className="quote-mark" style={{ opacity: ornamentOpacity, y: ornamentY }} aria-hidden="true">❝</motion.div>
          <p className="quote-review">
            <motion.span className="quote-review-line" style={{ opacity: line1Opacity, y: line1Y, filter: line1Blur }}>My daughter went from dreading maths to</motion.span>
            <motion.span className="quote-review-line" style={{ opacity: line2Opacity, y: line2Y, filter: line2Blur }}><motion.span style={{ color: toppingColour }}>topping her class.</motion.span></motion.span>
            <motion.span className="quote-review-line" style={{ opacity: line3Opacity, y: line3Y, filter: line3Blur }}>DA Tuition didn't just improve her grades —</motion.span>
            <motion.span className="quote-review-line" style={{ opacity: line4Opacity, y: line4Y, filter: line4Blur }}>they <motion.span style={{ color: confidenceColour }}>gave her back her confidence.</motion.span></motion.span>
          </p>
          <motion.div style={{ opacity: attributionOpacity, y: attributionY }}>
            <div className="quote-attribution-rule" aria-hidden="true" />
            <p className="quote-attribution"><span>Parent of Year 10 Student</span><span>Google Review</span><span aria-label="5 stars">★★★★★</span></p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  WELLBEING — premium editorial layout
// ══════════════════════════════════════════════════════════════

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

      {/* ── Styles ── */}
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
          text-decoration: none;
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

        {/* ── Two-column editorial row ── */}
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

          {/* ─── LEFT: staggered text ─── */}
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
              <a className="wb-btn" href="#closing-cta">
                Book a Consultation
                <span className="wb-arrow">→</span>
              </a>
            </motion.div>
          </div>

          {/* ─── RIGHT: asymmetric editorial collage ─── */}
          <div>

            {/* ── Hero: full-width dominant image ── */}
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
                    src="/images/homepage/wellbeing-male-tutors.png"
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

            {/* ── Support pair: left wider, right narrower, equal height ── */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '12px',
            }}>

              {/* Left: 57% — students / community */}
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
                    src="/images/homepage/wellbeing-young-student.png"
                    alt="DA Tuition student working confidently at a classroom table"
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
                    src="/images/homepage/wellbeing-student-community.png"
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

        {/* ── Premium feature cards ── */}
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



// ══════════════════════════════════════════════════════════════
//  DA ENVIRONMENT — scroll-driven media section
// ══════════════════════════════════════════════════════════════

const formatVideoTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const wholeSeconds = Math.floor(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
};

const VideoTransportControls = ({
  isPlaying,
  currentTime,
  duration,
  onTogglePlayback,
  onSeek,
  isVisible,
}: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlayback: () => void;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isVisible: boolean;
}) => {
  if (!isVisible) return null;

  return (
  <div className="da-video-controls">
    <button className="da-video-play-toggle" type="button" onClick={onTogglePlayback} aria-label={isPlaying ? 'Pause video' : 'Play video'}>
      {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
    </button>
    <input
      className="da-video-progress"
      type="range"
      min="0"
      max={duration || 0}
      step="0.1"
      value={Math.min(currentTime, duration || 0)}
      onChange={onSeek}
      aria-label="Video progress"
      disabled={!duration}
    />
    <span className="da-video-time" aria-hidden="true">{formatVideoTime(currentTime)} / {formatVideoTime(duration)}</span>
  </div>
  );
};

const DAEnvironmentSection = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dismissedRef = useRef(false);
  const resumeAfterVisibilityRef = useRef(false);
  const resumeAfterDismissRef = useRef(false);
  const manuallyPausedRef = useRef(false);
  const hasEnteredSectionRef = useRef(false);
  const expandedRef = useRef(false);
  const floatingDragRef = useRef<{ pointerId: number; startX: number; startY: number; left: number; top: number } | null>(null);
  const [isSimple, setIsSimple] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [floatingDismissed, setFloatingDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDraggingFloating, setIsDraggingFloating] = useState(false);
  const [floatingPosition, setFloatingPosition] = useState<{ left: number; top: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoFullyInFrame, setIsVideoFullyInFrame] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());

  const toggleVideoAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) videoRef.current.play().catch(() => {});
    }
  };

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      manuallyPausedRef.current = false;
      setIsPlaying(true);
      video.play().catch(() => {});
    } else {
      manuallyPausedRef.current = true;
      setIsPlaying(false);
      video.pause();
    }
  };

  const handleVideoPlay = () => {
    // Some browsers retry muted autoplay while the section is moving into its
    // floating state. Honour an explicit visitor pause instead of restarting.
    if (manuallyPausedRef.current) {
      videoRef.current?.pause();
      return;
    }
    setIsPlaying(true);
  };

  const handleVideoPause = () => setIsPlaying(false);

  const seekVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const nextTime = Number(event.target.value);
    if (!video || !Number.isFinite(nextTime)) return;

    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const syncVideoMetadata = () => {
    const video = videoRef.current;
    if (video) setDuration(video.duration);
  };

  const syncVideoProgress = () => {
    const video = videoRef.current;
    if (video) setCurrentTime(video.currentTime);
  };

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
        const video = videoRef.current;
        if (!video) return;
        if (expandedRef.current) {
          setIsFloating(false);
          return;
        }
        const passedSection = !e.isIntersecting && e.boundingClientRect.bottom <= 0;
        const enableFloating = passedSection && window.innerWidth >= 380 && !dismissedRef.current;

        if (e.isIntersecting && !hasEnteredSectionRef.current) {
          hasEnteredSectionRef.current = true;
          video.muted = false;
          setIsMuted(false);
          // If audible autoplay is blocked, remain paused and unmuted. The
          // visitor's Play action will then begin the film with sound.
          video.play().catch(() => setIsPlaying(false));
        }

        if (e.isIntersecting) {
          dismissedRef.current = false;
          setFloatingDismissed(false);
          setIsFloating(false);
          if (resumeAfterDismissRef.current && !manuallyPausedRef.current) {
            video.play().catch(() => {});
          }
          resumeAfterDismissRef.current = false;
        } else if (enableFloating) {
          setIsFloating(true);
        } else if (!passedSection) {
          // Section hasn't been reached yet (or user scrolled back above it).
          // Don't pause here: pausing and later resuming this looping video was
          // causing the browser to discard its buffered
          // data and re-fetch/re-decode from scratch, which stalls playback
          // noticeably on anything larger than a tiny file. Leaving it playing
          // is cheap (muted, no user-facing audio/CPU cost worth guarding).
          setIsFloating(false);
        }
      },
      { threshold: 0 }
    );
    const el = outerRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) {
        resumeAfterVisibilityRef.current = !video.paused;
        video.pause();
      } else if (resumeAfterVisibilityRef.current) {
        video.play().catch(() => {});
        resumeAfterVisibilityRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const closeFloatingVideo = () => {
    const video = videoRef.current;
    resumeAfterDismissRef.current = Boolean(video && !video.paused);
    video?.pause();
    expandedRef.current = false;
    setIsExpanded(false);
    dismissedRef.current = true;
    setFloatingDismissed(true);
    setIsFloating(false);
  };

  const returnToFullVideo = () => {
    expandedRef.current = true;
    setIsFloating(false);
    setIsExpanded(true);
  };

  const minimiseExpandedVideo = () => {
    expandedRef.current = false;
    setIsExpanded(false);
    setIsFloating(true);
  };

  const handleFloatingPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isFloating || isExpanded || (event.target as HTMLElement).closest('button,input,a')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    floatingDragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDraggingFloating(true);
  };

  const handleFloatingPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = floatingDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const left = Math.min(Math.max(12, drag.left + event.clientX - drag.startX), window.innerWidth - rect.width - 12);
    const top = Math.min(Math.max(12, drag.top + event.clientY - drag.startY), window.innerHeight - rect.height - 12);
    setFloatingPosition({ left, top });
  };

  const handleFloatingPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (floatingDragRef.current?.pointerId !== event.pointerId) return;
    floatingDragRef.current = null;
    setIsDraggingFloating(false);
  };

  // The section now hands directly from the results story into the environment
  // film: copy recedes as the video grows cleanly to the full viewport.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });
  const s = scrollYProgress;

  const textOp = useTransform(s, [0, 0.16, 0.34], [1, 1, 0]);
  const textY = useTransform(s, [0.16, 0.34], [0, -72]);
  const cardScale = useTransform(s, [0, 0.28, 0.55, 0.82], [0.58, 0.76, 0.92, 1.0]);
  const cardOp = useTransform(s, [0, 0.14, 0.42], [0.48, 0.72, 1.0]);
  const cardRadV = useTransform(s, [0.58, 0.82], [22, 0]);
  const cardRadS = useTransform(cardRadV, (radius: number) => `${Math.max(0, radius)}px`);
  const overlayOp = useTransform(s, [0.26, 0.55], [0, 0.28]);

  useMotionValueEvent(s, 'change', (progress) => {
    setIsVideoFullyInFrame((current) => {
      const next = progress >= 0.82;
      return current === next ? current : next;
    });
  });

  const envCSS = `
    .da-ebtn { font-family:${sans}; font-size:0.58rem; font-weight:700; letter-spacing:0.18em;
      text-transform:uppercase; color:${C.navy}; background:${C.gold}; border:none;
      border-radius:3px; padding:12px 28px; cursor:pointer; transition:opacity 0.2s ease; }
    .da-ebtn:hover { opacity:0.86; }
    .da-audio-toggle { position:absolute;right:clamp(14px,2vw,28px);bottom:clamp(14px,2vw,28px);z-index:12;
      display:inline-flex;align-items:center;gap:9px;padding:10px 14px;border:1px solid rgba(255,255,255,.46);
      border-radius:999px;background:rgba(6,17,31,.72);color:#fff;font-family:${sans};font-size:.74rem;
      font-weight:600;letter-spacing:.02em;cursor:pointer;backdrop-filter:blur(10px);
      transition:background 220ms ease,border-color 220ms ease,transform 220ms cubic-bezier(.22,1,.36,1); }
    .da-audio-toggle:hover { background:rgba(6,17,31,.9);border-color:rgba(212,175,55,.8);transform:translateY(-2px); }
    .da-audio-toggle:focus-visible { outline:3px solid rgba(240,200,106,.72);outline-offset:3px; }
    .da-video-controls{position:absolute;left:clamp(14px,2vw,28px);right:clamp(126px,13vw,174px);bottom:clamp(14px,2vw,28px);z-index:24;display:flex;align-items:center;gap:10px;min-height:42px;padding:7px 11px 7px 7px;border:1px solid rgba(255,255,255,.34);border-radius:999px;background:rgba(6,17,31,.72);color:#fff;backdrop-filter:blur(10px)}
    .da-video-play-toggle{width:30px;height:30px;display:grid;place-items:center;flex:0 0 auto;padding:0;border:0;border-radius:50%;background:${C.gold};color:${C.navy};cursor:pointer}.da-video-play-toggle:hover{background:${C.goldL}}.da-video-play-toggle:focus-visible{outline:3px solid rgba(240,200,106,.72);outline-offset:3px}
    .da-video-progress{width:100%;min-width:0;accent-color:${C.gold};cursor:pointer}.da-video-progress:disabled{cursor:not-allowed;opacity:.55}
    .da-video-time{flex:0 0 auto;font:600 .62rem/1 ${sans};letter-spacing:.02em;white-space:nowrap;color:rgba(255,255,255,.88)}
    .da-video-wrapper{will-change:transform,border-radius;isolation:isolate}
    .da-video-wrapper.is-floating{position:fixed!important;top:var(--da-video-top,auto)!important;right:var(--da-video-right,clamp(28px,2.2vw,32px))!important;bottom:var(--da-video-bottom,clamp(164px,12vw,172px))!important;left:var(--da-video-left,auto)!important;width:clamp(320px,27vw,380px)!important;height:auto!important;aspect-ratio:16/9;z-index:1000!important;border-radius:16px!important;border:0!important;background:#06111f;box-shadow:0 14px 32px rgba(2,12,27,.22)!important;filter:none!important;opacity:1!important;transform-origin:center!important;cursor:grab}
    .da-video-wrapper.is-floating.is-dragging{cursor:grabbing;user-select:none}
    .da-video-wrapper.is-expanded{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;aspect-ratio:auto!important;z-index:1100!important;border:0!important;border-radius:0!important;background:#06111f;box-shadow:none!important;filter:none!important;opacity:1!important;transform:none!important}
    .da-floating-header{position:absolute;z-index:20;inset:0 0 auto;height:48px;display:flex;align-items:center;justify-content:space-between;padding:8px 9px 13px 14px;background:linear-gradient(180deg,rgba(4,14,29,.88),rgba(4,14,29,.52) 64%,transparent);opacity:0;transition:opacity .25s ease;pointer-events:none}
    .da-video-wrapper.is-floating:hover .da-floating-header,.da-video-wrapper.is-floating:focus-within .da-floating-header{opacity:1}
    .da-floating-label{font:700 .58rem/1 ${sans};letter-spacing:.16em;text-transform:uppercase;color:rgba(255,250,240,.86)}
    .da-floating-actions{display:flex;gap:5px;pointer-events:auto}
    .da-floating-control{width:31px;height:31px;display:grid;place-items:center;padding:0;border:1px solid rgba(255,250,240,.28);border-radius:50%;background:rgba(6,17,31,.72);color:#fff;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .2s ease}
    .da-floating-control:hover{background:rgba(6,17,31,.94);border-color:rgba(240,200,106,.7);transform:translateY(-1px)}
    .da-floating-control:focus-visible{outline:3px solid rgba(240,200,106,.65);outline-offset:2px}
    .da-video-wrapper.is-floating .da-audio-toggle{display:none}
    .da-video-wrapper.is-floating .da-video-controls{left:10px;right:10px;bottom:10px;min-height:34px;padding:5px 8px 5px 5px;gap:7px}.da-video-wrapper.is-floating .da-video-play-toggle{width:26px;height:26px}.da-video-wrapper.is-floating .da-video-time{font-size:.53rem}
    .da-video-wrapper.is-floating .da-video-overlay{opacity:.08!important}
    .da-video-wrapper.is-expanded .da-floating-header{opacity:1;pointer-events:auto;height:64px;padding:14px 18px 20px}.da-video-wrapper.is-expanded .da-floating-label{font-size:.7rem}.da-video-wrapper.is-expanded .da-video-controls{left:clamp(16px,3vw,42px);right:clamp(140px,14vw,210px);bottom:clamp(18px,3vw,42px);min-height:46px}.da-video-wrapper.is-expanded .da-audio-toggle{display:inline-flex;right:clamp(16px,3vw,42px);bottom:clamp(18px,3vw,42px)}
    .da-video-wrapper.is-dismissed{visibility:hidden;pointer-events:none}
    @media(max-width:767px){.da-video-wrapper.is-floating{right:16px!important;bottom:calc(176px + env(safe-area-inset-bottom))!important;width:min(82vw,320px)!important}.da-floating-header{opacity:.92}.da-video-controls{right:116px}.da-video-time{display:none}}
    @media(max-width:379px){.da-video-wrapper.is-floating{display:none!important}}
    @media(prefers-reduced-motion:reduce){.da-audio-toggle,.da-floating-header,.da-floating-control{transition:none}.da-audio-toggle:hover,.da-floating-control:hover{transform:none}}
  `;

  // ── MOBILE: stacked, no scroll animation ─────────────────────
  if (isSimple) {
    return (
      <div id="environment" ref={outerRef} style={{ background: '#06111F', padding: '60px 0 0' }}>
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
          <button className="da-ebtn">DISCOVER OUR ENVIRONMENT →</button>
        </div>
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'visible' }}>
          <motion.div
            layout
            className={`da-video-wrapper${isFloating ? ' is-floating' : ''}${isExpanded ? ' is-expanded' : ''}${isDraggingFloating ? ' is-dragging' : ''}${floatingDismissed ? ' is-dismissed' : ''}`}
            transition={{ layout: { duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] } }}
            onPointerDown={handleFloatingPointerDown}
            onPointerMove={handleFloatingPointerMove}
            onPointerUp={handleFloatingPointerEnd}
            onPointerCancel={handleFloatingPointerEnd}
            style={isExpanded ? undefined : isFloating ? (floatingPosition ? {
              '--da-video-left': `${floatingPosition.left}px`, '--da-video-top': `${floatingPosition.top}px`, '--da-video-right': 'auto', '--da-video-bottom': 'auto',
            } as React.CSSProperties : undefined) : { position: 'absolute', inset: 0, overflow: 'hidden' }}
          >
            <video ref={videoRef} muted={isMuted} loop playsInline src="/images/homepage/homepage-cream/0706.mp4"
              onPlay={handleVideoPlay} onPause={handleVideoPause} onLoadedMetadata={syncVideoMetadata} onTimeUpdate={syncVideoProgress}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
            <div className="da-video-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,24,0.28)', pointerEvents: 'none' }} />
            <div className="da-floating-header">
              <span className="da-floating-label">DA Story</span>
              <span className="da-floating-actions">
                <button className="da-floating-control" type="button" onClick={toggleVideoAudio} aria-label={isMuted ? 'Unmute floating video' : 'Mute floating video'}>{isMuted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}</button>
                <button className="da-floating-control" type="button" onClick={isExpanded ? minimiseExpandedVideo : returnToFullVideo} aria-label={isExpanded ? 'Minimise full video' : 'Expand video'}>{isExpanded ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}</button>
                <button className="da-floating-control" type="button" onClick={closeFloatingVideo} aria-label="Close floating video"><X size={15} aria-hidden="true" /></button>
              </span>
            </div>
            <VideoTransportControls isPlaying={isPlaying} currentTime={currentTime} duration={duration} onTogglePlayback={toggleVideoPlayback} onSeek={seekVideo} isVisible={isSimple || isFloating || isExpanded || isVideoFullyInFrame} />
            <button className="da-audio-toggle" type="button" onClick={toggleVideoAudio} aria-pressed={!isMuted} aria-label={isMuted ? 'Turn video sound on' : 'Mute video'}>
              {isMuted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
              <span>{isMuted ? 'Sound on' : 'Mute'}</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── DESKTOP: scroll-driven ────────────────────────────────────
  return (
    <div id="environment" ref={outerRef} style={{ height: '155vh', position: 'relative', zIndex: 20, background: '#06111F' }}>
      <style>{envCSS}</style>

      {/* Sticky panel holds the entrance sequence while the video grows. */}
      <div style={{
        position: 'sticky' as const, top: 0, height: '100vh', zIndex: 1,
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

        {/* ── MAIN VIDEO CARD ─────────────────────────────────────── */}
        {/* position:absolute; inset:0 → always exactly 100vw × 100vh  */}
        {/* scale grows from 0.40 → 1.0; transformOrigin near bottom   */}
        {/* means it expands upward from lower-centre of screen         */}
        <motion.div
          layout
          className={`da-video-wrapper${isFloating ? ' is-floating' : ''}${isExpanded ? ' is-expanded' : ''}${isDraggingFloating ? ' is-dragging' : ''}${floatingDismissed ? ' is-dismissed' : ''}`}
          transition={{ layout: { duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] } }}
          onPointerDown={handleFloatingPointerDown}
          onPointerMove={handleFloatingPointerMove}
          onPointerUp={handleFloatingPointerEnd}
          onPointerCancel={handleFloatingPointerEnd}
          style={isExpanded ? undefined : isFloating ? (floatingPosition ? {
            '--da-video-left': `${floatingPosition.left}px`, '--da-video-top': `${floatingPosition.top}px`, '--da-video-right': 'auto', '--da-video-bottom': 'auto',
          } as React.CSSProperties : undefined) : {
            position: 'absolute', inset: 0,
            scale: cardScale,
            opacity: cardOp,
            borderRadius: cardRadS,
            overflow: 'hidden',
            transformOrigin: 'center 82%',
            zIndex: 5,
            boxShadow: '0 24px 72px rgba(0,0,0,0.55)',
          }}>
          <video ref={videoRef} muted={isMuted} loop playsInline src="/images/homepage/homepage-cream/0706.mp4"
            onPlay={handleVideoPlay} onPause={handleVideoPause} onLoadedMetadata={syncVideoMetadata} onTimeUpdate={syncVideoProgress}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <motion.div className="da-video-overlay" style={{
            position: 'absolute', inset: 0,
            background: 'rgba(4,10,24,0.28)',
            opacity: overlayOp, pointerEvents: 'none',
          }} />
          <div className="da-floating-header">
            <span className="da-floating-label">DA Story</span>
            <span className="da-floating-actions">
              <button className="da-floating-control" type="button" onClick={toggleVideoAudio} aria-label={isMuted ? 'Unmute floating video' : 'Mute floating video'}>{isMuted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}</button>
              <button className="da-floating-control" type="button" onClick={isExpanded ? minimiseExpandedVideo : returnToFullVideo} aria-label={isExpanded ? 'Minimise full video' : 'Expand video'}>{isExpanded ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}</button>
              <button className="da-floating-control" type="button" onClick={closeFloatingVideo} aria-label="Close floating video"><X size={15} aria-hidden="true" /></button>
            </span>
          </div>
          <VideoTransportControls isPlaying={isPlaying} currentTime={currentTime} duration={duration} onTogglePlayback={toggleVideoPlayback} onSeek={seekVideo} isVisible={isSimple || isFloating || isExpanded || isVideoFullyInFrame} />
          <button className="da-audio-toggle" type="button" onClick={toggleVideoAudio} aria-pressed={!isMuted} aria-label={isMuted ? 'Turn video sound on' : 'Mute video'}>
            {isMuted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
            <span>{isMuted ? 'Sound on' : 'Mute'}</span>
          </button>
        </motion.div>

        {/* ── TEXT OVERLAY ────────────────────────────────────────── */}
        {/* z-index 20; fades up at 20–40% scroll progress            */}
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
              DISCOVER OUR ENVIRONMENT →
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
};



// ══════════════════════════════════════════════════════════════
//  CINEMATIC QUOTE — blur-reveal text animation
// ══════════════════════════════════════════════════════════════

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

          {/* Shimmer sweep — passes over text once at ~0.85s */}
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
          SUPPORTIVE ENVIRONMENT&nbsp;&nbsp;•&nbsp;&nbsp;DA TUITION
        </p>

      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  REVIEWS — premium vertical success story cards
// ══════════════════════════════════════════════════════════════

const CAROUSEL_REVIEWS = [
  {
    id: 'cr-7',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Diana Nguyen',
    yearLevel: 'Year 10',
    result: { before: 'C Average', after: '94% · 1st Class' },
    outcomes: ['94% Score', '1st in Class', 'Grade Jump'],
    preview: "Mr Bunsea took me from a C average to 94% and first in my class. I've never been more grateful for a teacher.",
    pullQuote: "He made the most difficult concepts so easy to understand. I finally believed maths was something I could be good at.",
    story: "Before going to DA, I was a C average student in maths. After going to DA and having Mr Bunsea as my tutor, he made the most difficult concepts so easy to understand.\n\nIn my first term with him, he pulled me from a C to a B grade. I continued with him and finally achieved 94% on my latest maths exam — first in my class.\n\nI really appreciate his dedication. The teachers at DA are extremely hardworking and caring, always willing to go out of their way to make sure students get the results they deserve.",
    whyItWorked: [
      { n: '01', point: 'Conceptual clarity over memorisation', detail: 'Mr Bunsea never moved on until Diana understood the reasoning behind each method — not just the steps.' },
      { n: '02', point: 'Grade-by-grade progression', detail: 'C to B in one term, then B to A. Staged milestones made the journey feel achievable rather than overwhelming.' },
      { n: '03', point: 'A tutor who refused to accept the ceiling', detail: 'Diana was categorised as a C student. Mr Bunsea simply didn\'t accept that as the end of the story.' },
    ],
    learningFormat: 'Small Group · Mathematics',
    newTags: ['Academic Growth', 'Mathematics', 'Teacher Support'],
  },
  {
    id: 'cr-4',
    subject: 'Mathematics',
    category: 'Mathematics',
    author: 'Emily Nguyen',
    yearLevel: 'Year 9',
    result: { before: 'Above average', after: '2nd in Grade' },
    outcomes: ['100% on Exam', '2nd in Grade', 'Confidence'],
    preview: "After joining DA, I now achieve marks in the high 90s — 2nd in my grade, and 100% on my most recent exam.",
    pullQuote: "My confidence in learning has improved significantly and I am now determined to achieve above 90% for all my tests.",
    story: "I've been going to DA Tuition since Year 5, and I can't explain how much this place has helped me improve academically throughout the years.\n\nWith the help of Miss Linda and Miss Lai, my test results are now in the high 90s — including 2nd place in maths in my grade and 100% on my recent test.\n\nMy confidence in learning has improved significantly and I'm now determined to achieve above 90% for all my tests. I can't thank DA and the teachers enough for their expertise and engaging lessons.",
    whyItWorked: [
      { n: '01', point: 'Early foundations matter', detail: 'Joining in Year 5 allowed DA to build mathematical reasoning from the ground up — not patch it under pressure.' },
      { n: '02', point: 'Targets set above school expectations', detail: 'Emily was always working slightly ahead of her class, which meant assessments felt familiar rather than stressful.' },
      { n: '03', point: 'Confidence as a measurable outcome', detail: 'The shift from "above average" to "top of grade" began with Emily believing the higher result was within reach.' },
    ],
    learningFormat: 'Small Group · Primary & High School',
    newTags: ['Academic Growth', 'Mathematics', 'Confidence', 'Teacher Support'],
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
    story: "Being a student at DA for the last 8 years has been an absolute life changer. DA has guided and supported me to achieve academic excellence — first through the selective school program, then all the way through the HSC.\n\nDespite having confidence issues in my academic abilities, these tutors drew out my best ability and motivated me to strive for success. Ms Amanda's passion for mathematics was infectious and made me hungry to improve.\n\nThrough DA I achieved five Band 6s in the HSC exam and the ATAR that made my parents proud. If you are looking for a place to develop a strong foundation and achieve your maximum potential, DA is the place for you.",
    whyItWorked: [
      { n: '01', point: 'Confidence built before performance', detail: 'Bryant arrived with self-doubt. The focus was first on belief, then on technique — in that order.' },
      { n: '02', point: 'Eight years of accumulated understanding', detail: 'Long-term relationships mean tutors know how each student learns, not just what they need to know.' },
      { n: '03', point: 'Selective school foundation', detail: 'The rigour of selective preparation gave Bryant a depth of mathematical reasoning that made the HSC manageable.' },
    ],
    learningFormat: 'Small Group · HSC Mathematics',
    newTags: ['HSC Success', 'Band 6 Results', 'Mathematics', 'Confidence'],
  },
  {
    id: 'cr-1',
    subject: 'English',
    category: 'HSC English',
    author: 'Katelin Trinh',
    yearLevel: 'Year 12',
    result: { before: 'Rank 15th', after: 'Rank 6th' },
    outcomes: ['Band 5–6', 'Essay Skills', 'Confidence'],
    preview: "From 15th to 6th in my final HSC ranking. Miss Jenny didn't just lift my marks — she gave me a genuine love for the subject.",
    pullQuote: "Miss Jenny didn't just lift my marks. She gave me a genuine love for the subject.",
    story: "I am so grateful for DA Tuition for helping me improve my English results and boosting my confidence in the subject. My tutor Ms Jenny has been exceptionally patient, kind, knowledgeable and always willing to go above and beyond for her students to succeed.\n\nThanks to her, I had a drastic improvement in my assessment rank, moving from 15th to 6th in my final HSC assessment, and I received Band 5–6 across all my English assignments. Beyond academics, Ms Jenny also inspired me to develop a genuine passion for English.\n\nThe staff are incredibly friendly and supportive, and the learning environment is excellent. Highly recommended to anyone looking to excel.",
    whyItWorked: [
      { n: '01', point: 'Personalised essay coaching', detail: 'Every draft was reviewed with targeted feedback on thesis clarity, textual evidence, and voice — not generic advice.' },
      { n: '02', point: 'Progress tracked against the cohort', detail: 'Ranking was monitored regularly so adjustments could be made before each assessment, not after it.' },
      { n: '03', point: 'Genuine subject connection', detail: 'When a student enjoys what they are studying, results follow naturally. Miss Jenny made English compelling.' },
    ],
    learningFormat: 'Small Group · HSC English',
    newTags: ['HSC Success', 'Band 6 Results', 'English', 'Teacher Support'],
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
    pullQuote: "DA staff are not just teachers but family — promoters of success who bring out the best in every individual.",
    story: "DA Tuition is not just an educational environment but a place of upbringing and encouragement. As a committed student of 8 years, DA staff are not just teachers but family — promoters of success who bring out the best in every individual.\n\nInitially, I was a below-average student who did not concern myself with success. By being with Miss Linda, she advanced my understanding of what it means to be prosperous, guiding me through hard times by not only lifting my grades but also my perspective.\n\nI am now looking forward to a bright future, in gratitude and appreciation to all the tutors I have had.",
    whyItWorked: [
      { n: '01', point: 'The whole child, not just the grade', detail: 'Miss Linda worked on Lisa\'s perspective and self-belief long before the marks reflected it.' },
      { n: '02', point: 'Consistency across eight years', detail: 'Trust is built over time. The relationship Lisa had with her tutors made honest conversations about struggle possible.' },
      { n: '03', point: 'A community that holds high expectations', detail: 'Being surrounded by students who care about learning shifts what a student believes is possible for themselves.' },
    ],
    learningFormat: 'Small Group · Multi-Year Program',
    newTags: ['Confidence', 'Academic Growth', 'Parent Feedback'],
  },
  {
    id: 'cr-6',
    subject: 'General',
    category: '9 Years at DA',
    author: 'Connor Mangala',
    yearLevel: 'Year 12',
    result: { before: 'Unknown potential', after: 'Dream University' },
    outcomes: ['ATAR Achieved', 'Dream Course', '9 Years at DA'],
    preview: "I'm now enrolled in my dream university course — results I never knew I could achieve. Nine years of DA made that possible.",
    pullQuote: "Without them I wouldn't have received the marks and ATAR I never knew I could achieve.",
    story: "I am always so grateful for all the tutors who have seen me grow over the past 9 years I have been at DA. Specifically, I want to thank Miss Lai and Mr Bunsea for helping me realise that I needed to take my learning seriously in my senior years — that my future self was depending on me.\n\nWithout them I wouldn't have received the marks and ATAR I never knew I could achieve, and I wouldn't have been accepted into my dream university course.",
    whyItWorked: [
      { n: '01', point: 'A timely shift in perspective', detail: 'Miss Lai and Mr Bunsea reframed senior school not as pressure, but as an investment in the version of Connor he wanted to become.' },
      { n: '02', point: 'Nine years of accumulated trust', detail: 'Connor\'s tutors knew exactly how he learned, what motivated him, and where his ceiling actually was.' },
      { n: '03', point: 'ATAR as a means, not an end', detail: 'The goal was always the dream course. Keeping that distinction clear kept Connor focused on what actually mattered.' },
    ],
    learningFormat: 'Small Group · HSC Preparation',
    newTags: ['HSC Success', 'Confidence', 'Academic Growth'],
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
      { n: '01', point: 'Quick diagnosis of the real problem', detail: 'Lillian\'s marks reflected disengagement, not lack of ability. Miss Selina addressed the root cause — not the symptom.' },
      { n: '02', point: 'Writing skills built systematically', detail: 'Essay structure and creative voice were developed in parallel, lifting both assessment types simultaneously.' },
      { n: '03', point: 'Motivation as the leading indicator', detail: 'When Lillian began enjoying English classes, consistent effort followed — and results caught up quickly.' },
    ],
    learningFormat: 'Small Group · HSC English',
    newTags: ['HSC Success', 'English', 'Teacher Support', 'Academic Growth'],
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
      { n: '01', point: 'Continuity across multiple tutors', detail: 'Tiffany worked with three tutors over four years — each transition was smooth because DA\'s culture and standards are consistent.' },
      { n: '02', point: 'What other centres couldn\'t provide', detail: 'The difference wasn\'t just academic — it was the quality of relationships and the genuine investment in Tiffany as a person.' },
      { n: '03', point: 'An environment worth returning to', detail: 'Four years is a choice made annually. Tiffany kept choosing DA because it kept working.' },
    ],
    learningFormat: 'Small Group · Multi-Year Program',
    newTags: ['Confidence', 'Academic Growth', 'Parent Feedback', 'Study Habits'],
  },
  {
    "id": "vr-m1",
    "subject": "Mathematics",
    "category": "Mathematics Student Result",
    "author": "Selene Dixon",
    "yearLevel": "Verified review",
    "result": {
      "before": "40% · Failing",
      "after": "91% · 1st in Trials"
    },
    "outcomes": [
      "40% to 91%",
      "1st in Trials",
      "6th of 100+"
    ],
    "preview": "From a failing 40% average to 91% and first place in the trials — plus 99 on an assignment and 6th out of 100+ overall.",
    "pullQuote": "The results of his tutoring are nothing short of astonishing.",
    "story": "I cannot express enough how truly remarkable my experience has been with Mr. Danny, my biology tutor at DA who has turned my academic life around. When I first approached him, I was on the brink of failing my biology class, with failing grades and a sense of hopelessness. Fast forward to my recent triumph in the trials where I secured the coveted first place, and I owe it all to Mr. Danny. From the very first session, it was clear that Mr. Danny was not your average tutor. His passion for biology was palpable, and it was infectious. He didn't just teach the subject; he brought it to life. He used creative teaching methods and real-world examples to make complex biological concepts understandable and engaging. His ability to simplify the most intricate topics was astounding.\r\n\r\nFurthermore, I can hardly believe the transformation that has occurred in my Mathematics Standard 2 Course, all thanks to the incredible tutoring prowess of Mr. Bunsea. What sets Mr. Bunsea apart is his unwavering commitment to his students' success. He didn't just teach math; he demystified it. He broke down complex problems step by step, ensuring that I not only solved them but understood the underlying principles. His patience was unwavering, and he encouraged questions, no matter how ‘stupid’ they may have seemed. Mr. Bunsea’s dedication extended far beyond our tutoring sessions. He went the extra mile, providing additional resources, practice problems, and personalized study strategies. He was always accessible, ready to assist with homework or clarify doubts, even outside our scheduled sessions. His level of commitment was truly exceptional. The results of his tutoring are nothing short of astonishing. Going from a failing grade (averaging 40%) to securing the top position in the trials with a remarkable 91% is a testament to Mr. Bunsea’s exceptional teaching abilities. Additionally, achieving an assignment mark of 99 and my final ranking 6th out of 100+ students showed that his guidance not only improved my math skills but also rekindled my love for the subject.\r\n\r\nFor English Advanced, one of the standout aspects of Mr. Jonathan’s tutoring was his unwavering patience and encouragement. He created a safe and supportive environment. His feedback on my writing was constructive and inspiring, pushing me to constantly improve. He provided additional reading materials, practice exercises, and recommended literary works that expanded my horizons and deepened my understanding of English. His commitment to my success was evident in the countless hours he spent reviewing my assignments and providing valuable insights. In the end, the results were nothing short of astounding. From ranking last in prelim, to achieving consistently 1st place in all assessments and trials, with an overall rank of 1st in English. Mr. Jonathan’s exceptional teaching, mentorship, and guidance had propelled me to unimaginable heights.",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "40% · Failing became 91% · 1st in Trials. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "Mathematics Tuition",
    "newTags": [
      "HSC Success",
      "Confidence",
      "Teacher Support",
      "Academic Growth",
      "Mathematics"
    ]
  },
  {
    "id": "vr-m2",
    "subject": "Mathematics",
    "category": "Mathematics Student Result",
    "author": "Kayla Dos Santos",
    "yearLevel": "Verified review",
    "result": {
      "before": "One of the lowest",
      "after": "100% in Maths"
    },
    "outcomes": [
      "100% Exam",
      "Top 10 English",
      "1st Biology Task"
    ],
    "preview": "I went from one of the lowest-ranked students in my class to 100% on my last Advanced Maths exam.",
    "pullQuote": "All the staff are super nice and supportive but still value education by encouraging kids to do well.",
    "story": "I currently have Mr Bunsea for Advanced Maths and I went from being one of the lowest ranked students in my class to getting 100% on my last maths exam after being taught by sir. I also have Miss Stephanie for Advanced English and I have improved so much, again I was ranked quite low now I am apart of the top ten in Advanced English. Mr Danny also teaches me for Biology and similar to English, I have improved so much, becoming first in my first biology task.\r\n\r\nOverall, all the staff are super nice and supportive but still value education by encouraging kids to do well",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "One of the lowest became 100% in Maths. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "Mathematics Tuition",
    "newTags": [
      "Confidence",
      "Teacher Support",
      "Academic Growth",
      "English",
      "Mathematics"
    ]
  },
  {
    "id": "vr-m3",
    "subject": "Mathematics",
    "category": "Mathematics Student Result",
    "author": "Anthony Nguyen",
    "yearLevel": "Verified review",
    "result": {
      "before": "Untapped potential",
      "after": "2nd of 135"
    },
    "outcomes": [
      "2nd of 135",
      "Tailored Teaching",
      "Confidence"
    ],
    "preview": "DA helped me achieve marks I never thought possible — especially second place out of 135 in Mathematics.",
    "pullQuote": "Their dedication and tailored teaching have truly boosted my confidence.",
    "story": "I've been attending Da Tuition since Year 10, starting with Maths and later adding English and Biology in Years 11 and 12. I would like to thank my tutors—Ms. Linda, Ms. Lauren, Mr. King, and Mr. Danny—for helping me achieve marks I never thought possible and for deepening my understanding of each subject. Their dedication and tailored teaching have truly boosted my confidence and inspired me to constantly improve, especially in Maths, where I was able to achieve 2nd place out of 135.",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "Untapped potential became 2nd of 135. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "Mathematics Tuition",
    "newTags": [
      "Confidence",
      "Teacher Support",
      "Academic Growth",
      "Mathematics"
    ]
  },
  {
    "id": "vr-m4",
    "subject": "Mathematics",
    "category": "Mathematics Student Result",
    "author": "Albert Tran",
    "yearLevel": "Verified review",
    "result": {
      "before": "Complex 4U topics",
      "after": "100% · Top HSC Bands"
    },
    "outcomes": [
      "100% in 4U",
      "Top Band 3U",
      "Top Band 4U"
    ],
    "preview": "With Mr Bunsea’s help, I achieved 100% in a Year 12 4U exam and the highest bands in both 3U and 4U for the HSC.",
    "pullQuote": "He even made me enjoy learning the most conceptually confusing topics.",
    "story": "Mr Bunsea is an awesome tutor who I was lucky enough to have to help me throughout the course of year 12 and the HSC. He is an extremely friendly and approachable tutor who was able to guide me through some of the most tedious and conceptually confusing 4U topics like conics and harder 3U, and even made me enjoy learning them. Whenever I was stuck on a difficult question in class, Mr Bunsea would always be able to help me understand it in a clear manner, allowing me to approach future questions in the same way. Even out of class he offered his help, as I was able to message him if I had any trouble with any questions, which was really useful especially during exam season and I greatly appreciated this. So it was with his help that I was actually able to get 100% on one of my 4U exams in year 12 at Baulkham Hills, as well as get the highest bands in both 3U and 4U for the HSC; and I can't thank him enough.\nAlbert Tran - Baulkham Hills High School - Year 12",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "Complex 4U topics became 100% · Top HSC Bands. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "Mathematics Tuition",
    "newTags": [
      "HSC Success",
      "Teacher Support",
      "Academic Growth",
      "Mathematics"
    ]
  },
  {
    "id": "vr-m5",
    "subject": "Mathematics",
    "category": "Mathematics Student Result",
    "author": "Amanda Vu",
    "yearLevel": "Verified review",
    "result": {
      "before": "Building confidence",
      "after": "Top 5 · 95%+"
    },
    "outcomes": [
      "Top 5 in Grade",
      "95% and Above",
      "Four Years at DA"
    ],
    "preview": "I ranked in the top five in my grade for every Maths test this year, scoring 95% and above.",
    "pullQuote": "I have never felt more accomplished.",
    "story": "I have been attending DA tuition for almost 4 years now, and I have never felt more accomplished. Throughout these years, I have seen immense improvement in my schooling results. Originally I attended DA’s selective training class through years 5 - 6, then made my way up to GAT class through year 7. Then, I climbed my way up to ET class through years 8 and currently 9, proving my abilities with top marks and satisfactory results. ET class with Miss Linda is by far the best class I’ve been a part of because of the comfortable environment, and having a knowledgeable teacher that encourages me to do well. Miss Linda’s teaching style is extremely clear and easy to perceive, allowing me to understand content easily, and to apply it tangibly. I love how motivational she is too, encouraging us students to strive to accomplish academic goals as well as enjoying our years of youth. Thanks to Miss Linda, I have become more confident in my abilities and have been more motivated in DA and at school, due to the satisfying results I have accomplished through her guidance. In school I have been able to rank top 5 in the grade for every maths test this year (95% and above) and I couldn't be happier :). As for DA, I have been improving each week, ranking high for homework results as well as in class quizzes. I'm excited for another year at DA!",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "Building confidence became Top 5 · 95%+. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "Mathematics Tuition",
    "newTags": [
      "Confidence",
      "Teacher Support",
      "Academic Growth",
      "Mathematics"
    ]
  },
  {
    "id": "vr-e1",
    "subject": "English",
    "category": "English Student Result",
    "author": "Cherissa Nguyen",
    "yearLevel": "Verified review",
    "result": {
      "before": "Rank 50th",
      "after": "Rank 6th"
    },
    "outcomes": [
      "44-Rank Jump",
      "Writing Skills",
      "Motivation"
    ],
    "preview": "My English marks used to be very bad. With Miss Lai’s support, I jumped from 50th to 6th.",
    "pullQuote": "Thank you for helping me achieve my goals and giving me more motivation.",
    "story": "My English marks used to be very bad because I am an international student, but since I joined DA Tuition, Miss Lai, who is my English tutoring teacher, has helped me a lot with my work and improved my understanding so as to improve my writing skills in English. I love her sweet personality and well coming atmosphere during class. I really appreciate that! Thank you, Miss and DA Tuition, for helping me to archive my goals and giving me more motivation to continue working hard on exams! Jumped from 50th to 6th!!!!!!!",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "Rank 50th became Rank 6th. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "English Tuition",
    "newTags": [
      "Confidence",
      "Teacher Support",
      "Academic Growth",
      "English"
    ]
  },
  {
    "id": "vr-e2",
    "subject": "English",
    "category": "English Student Result",
    "author": "Amy Tran",
    "yearLevel": "Verified review",
    "result": {
      "before": "Barely passing",
      "after": "20/20 · 100%"
    },
    "outcomes": [
      "20/20 Assessment",
      "100% Result",
      "Confidence"
    ],
    "preview": "Before DA, I would barely pass exams. Miss Stephanie then helped me achieve 20/20 on my recent English assessment.",
    "pullQuote": "I could not believe I achieved the 100%.",
    "story": "Before DA, I would barely pass any exams and would always keep things to myself. After learning at DA and having Miss Stephanie for English and Miss Linda for Maths as my teachers, they have helped me do exceptionally well in many assignments and exams. Miss Stephanie helped me get a 20/20 for my recent assessment and I could not believe I achieved the 100%. They have helped me with all the things that I didn't understand in the subjects before.\nAmy Tran - James Busby High School - Year 9",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "Barely passing became 20/20 · 100%. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "English Tuition",
    "newTags": [
      "Confidence",
      "Teacher Support",
      "Academic Growth",
      "English"
    ]
  },
  {
    "id": "vr-e3",
    "subject": "English",
    "category": "English Student Result",
    "author": "Angelina Luong",
    "yearLevel": "Verified review",
    "result": {
      "before": "Straight C Grade",
      "after": "Full Marks"
    },
    "outcomes": [
      "C to A Range",
      "Full Marks",
      "Confidence"
    ],
    "preview": "I moved from straight Cs to high Bs and As, then achieved full marks on my English preliminary exam.",
    "pullQuote": "My tutor guided me, built my confidence and supported me through the tough moments.",
    "story": "DA has helped improved my english grades and understanding in general. From being a straight C grade student to now achieving high B’s and A’s. My tutor Miss Lauren has guided me well and helped me gain confidence in english, and supported me even through the tough moments when getting a disappointed grade! Because of those tough times I studied even harder and learnt from past mistakes, resulting in me getting full marks on my english prelim exam!!! I am entirely grateful :D",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "Straight C Grade became Full Marks. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "English Tuition",
    "newTags": [
      "Confidence",
      "Teacher Support",
      "Academic Growth",
      "English"
    ]
  },
  {
    "id": "vr-e4",
    "subject": "English",
    "category": "English Student Result",
    "author": "Crystal Tran",
    "yearLevel": "Verified review",
    "result": {
      "before": "First Advanced Task",
      "after": "19/20"
    },
    "outcomes": [
      "19/20 Result",
      "Advanced English",
      "Expert Feedback"
    ],
    "preview": "I received 19/20 for my first Advanced English task with Miss Stephanie’s help.",
    "pullQuote": "It is impossible to want another English tutor after having a lesson with her.",
    "story": "I received a 19/20 for my first Advanced English task with the help of Miss Stephanie in private class. She has an extensive understanding of the content and is continuously educating herself to aid her students to the best of her ability. It is impossible to want another English tutor after having a lesson with her!",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "First Advanced Task became 19/20. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "English Tuition",
    "newTags": [
      "Teacher Support",
      "Academic Growth",
      "English"
    ]
  },
  {
    "id": "vr-e5",
    "subject": "English",
    "category": "English Student Result",
    "author": "Diana Pham",
    "yearLevel": "Verified review",
    "result": {
      "before": "C Student",
      "after": "Top 10 in Grade"
    },
    "outcomes": [
      "C to Consistent A",
      "Top 10",
      "HSC Success"
    ],
    "preview": "From a C student in Year 7, I reached consistent As and finished Year 12 in the top ten for English.",
    "pullQuote": "This would not have happened if Miss Lai did not push me to my limits.",
    "story": "Ms Lai was an amazing teacher who encouraged me to do the best I can. I gained better skills and vocabulary over time, which lead me to improve my writing. From being a C student in Year 7, I was eventually able to keep a constant A from Year 8. In Year 12, I was in the top 10 in the grade for English, and this wouldn’t have happened if Miss Lai didn’t push me to my limits. She helped me to think about the way I’ve been writing and assisted me in dropping bad habits, cultivating good ones. Ms Lai broadened my perspective of writing in different styles, and enhanced my ability to quickly answer questions in the HSC format. I finished my HSC English with amazing results and I cannot recommend Ms Lai enough. \nDiana Pham - Mary Mackillop Catholic College, Year 12",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "C Student became Top 10 in Grade. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "English Tuition",
    "newTags": [
      "HSC Success",
      "Confidence",
      "Teacher Support",
      "Academic Growth",
      "English"
    ]
  },
  {
    "id": "vr-e6",
    "subject": "English",
    "category": "English Student Result",
    "author": "Adrian Dang",
    "yearLevel": "Verified review",
    "result": {
      "before": "Semester 1 Rank",
      "after": "Top of Trials Class"
    },
    "outcomes": [
      "10-Place Rank Jump",
      "Top Trial Result",
      "Nine Years at DA"
    ],
    "preview": "Miss Lai helped boost my English rank by ten places, then I topped my class in the trial exams.",
    "pullQuote": "The teachers are by far the best, helping me achieve new heights.",
    "story": "I’ve been at DA for 9 years now, and can say that the teachers are by far the best, helping me achieve new heights I wouldn’t have without their constant support and investment in my learning. Not only are they extremely caring, the teachers put an immense amount of hard work and dedication into helping us achieve exemplary results, which has created a comfortable learning environment for students.\n\nI began in private classes in year 3 which helped build the foundation of my learning in the lead up to years 5 and 6, where I had Mr Danny, and without him and his constant support I would not have achieved excellent results in the selective exams.\n\nFollowing this I had Miss Linda and Miss Jenny, and I owe them a large debt of gratitude in helping me excel in my junior years of high school, putting in an immeasurable amount of effort into making sure I’m prepared for exam conditions and submitting assignments on time and at a high standard.\n\nFrom the lead up to my senior years of high school, I had Mr King and Miss Amanda as my maths teachers, and they are undoubtedly the best math tutors you will find. Having their constant support through ensuring students understand concepts thoroughly whilst exposing us to the toughest questions to prepare for exam conditions constituted my success, and not to mention their unique connection with students which help them understand our areas of improvement to help us excel.\n\nFor English advanced I had Miss Lai, and she is the most supportive, hardworking and dedicated teacher you will find, helping me thrive during assignments and exams which boosted my ranks by 10 places between semester 1 and 2, and topping my class for the trial exams.\n\nI’ve enjoyed every moment here and highly recommend for anyone looking for a fantastic tutor :)",
    "whyItWorked": [
      {
        "n": "01",
        "point": "A measurable change",
        "detail": "Semester 1 Rank became Top of Trials Class. This outcome is stated in the student’s original review."
      },
      {
        "n": "02",
        "point": "Specific teaching support",
        "detail": "The full review explains the teaching, feedback and encouragement behind the result."
      },
      {
        "n": "03",
        "point": "Verified student voice",
        "detail": "This testimonial is reproduced from DA’s supplied review spreadsheet."
      }
    ],
    "learningFormat": "English Tuition",
    "newTags": [
      "HSC Success",
      "Teacher Support",
      "Academic Growth",
      "English"
    ]
  },
];

const ALL_CAROUSEL_REVIEWS = [...CAROUSEL_REVIEWS, ...supplementalHomepageReviews];

const REVIEW_TAGS = [
  'All Reviews',
  'HSC Success', 'Confidence', 'Teacher Support',
  'Academic Growth', 'English', 'Mathematics', 'Science',
] as const;

const FILTER_MAP: Record<string, string[]> = Object.fromEntries(
  REVIEW_TAGS.map((tag) => [
    tag,
    ALL_CAROUSEL_REVIEWS
      .filter((review) => tag === 'All Reviews' || review.newTags.includes(tag))
      .map((review) => review.id),
  ]),
);

const REVIEW_IMPACT_ORDER = [
  'vr-m1', 'cr-7', 'vr-m2', 'cr-4', 'vr-e1', 'cr-1', 'vr-e2', 'vr-e3',
  'vr-m4', 'vr-m3', 'cr-2', 'vr-e4', 'vr-e5', 'vr-e6', 'vr-m5',
  'cr-3', 'cr-6', 'cr-5', 'cr-8',
];
const REVIEW_IMPACT_RANK = new Map(REVIEW_IMPACT_ORDER.map((id, index) => [id, index]));

type ReviewRecord = (typeof ALL_CAROUSEL_REVIEWS)[number];

// ── Story modal ───────────────────────────────────────────────
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
      {/* ── Very subtle backdrop — page remains clearly visible ── */}
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

      {/* ── Scroll container ── */}
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
        {/* ── Panel — card morphs into this via layoutId ── */}
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
            // Layered shadow — depth without obscuring the page
            boxShadow: [
              '0 2px 4px rgba(10,27,52,0.04)',
              '0 8px 24px rgba(10,27,52,0.08)',
              '0 24px 64px rgba(10,27,52,0.13)',
              '0 0 0 1px rgba(10,27,52,0.06)',
            ].join(', '),
          }}
        >
          {/* Gold accent bar at top — same language as the cards */}
          <div style={{
            height: '3px',
            background: `linear-gradient(90deg, ${C.gold}, ${C.gold}30)`,
          }} />

          {/* ── HEADER ── */}
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
                }}>{r.yearLevel} · {r.category}</span>
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
              >×</button>
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

            {/* Before → After — cream/gold, no navy */}
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
              <span style={{ color: C.gold, fontSize: '18px', fontWeight: 300, textAlign: 'center' as const, lineHeight: 1 }}>→</span>
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
                  <span style={{ color: C.gold, fontSize: '11px' }}>✓</span> {o}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── BODY ── */}
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

            {/* Pull quote — left border, cream background */}
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

            {/* Learning format — centred, rules each side */}
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
                href="/principal-reflections"
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
                Begin Your Child's Story <span style={{ color: C.gold }}>→</span>
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

// ── Reviews section ───────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
//  WHAT WE TEACH — Editorial subject tiles
// ══════════════════════════════════════════════════════════════

interface SubjectTileProps {
  label: string;
  icon: string;
  desc: string;
  img: string;
  href: string;
  variant: 'math' | 'english' | 'science';
  delay: number;
  inView: boolean;
}

const SubjectTile = ({ label, icon, desc, img, href, variant, delay, inView }: SubjectTileProps) => {
  const easeOut = [0.22, 1, 0.36, 1] as const;
  const initial = variant === 'math' ? { opacity: 0, x: -42 } : variant === 'science' ? { opacity: 0, x: 42 } : { opacity: 0, y: 38 };

  return (
    <motion.article
      className={`teach-card-wrap teach-card-wrap--${variant}`}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: easeOut }}
    >
      <Link to={href} className="teach-card" aria-label={`Explore ${label}`}>
          <div className="teach-card-photo">
            <img
              src={img}
              alt={label}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="teach-card-overlay" aria-hidden="true" />

          <div className="teach-card-badge">
            <span style={{ fontSize: '13px', lineHeight: 1 }}>{icon}</span>
            <span>{label}</span>
          </div>

          <div className="teach-card-content">
            <p>{desc}</p>
            <div className="teach-card-cta">
              <span>Explore {label}</span>
              <span className="teach-card-arrow" aria-hidden="true">→</span>
            </div>
          </div>
      </Link>
    </motion.article>
  );
};

// ── Gold particle accent ──────────────────────────────────────
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
    label: 'English',
    icon: '📖',
    desc: 'Develop confident readers, writers and communicators who love ideas.',
    img: '/images/community/subject_english.jpg',
    href: '/subjects/english',
    variant: 'english' as const,
  },
  {
    label: 'Mathematics',
    icon: '📐',
    desc: 'Build confidence through understanding, problem solving and logical thinking.',
    img: '/images/community/subject_maths.jpg',
    href: '/subjects/mathematics',
    variant: 'math' as const,
  },
  {
    label: 'Science',
    icon: '🧪',
    desc: 'Discover the world through curiosity, investigation and experimentation.',
    img: '/images/community/subject_science.jpg',
    href: '/subjects/science',
    variant: 'science' as const,
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
      <style>{`
        .teach-watermarks{position:absolute;inset:0;pointer-events:none;user-select:none;color:rgba(183,126,22,.045);font-family:${serif};z-index:0}
        .teach-watermark{position:absolute;font-size:clamp(3.5rem,7vw,7rem);line-height:1;white-space:nowrap}.teach-watermark--math{left:2%;top:28%;transform:rotate(-8deg)}.teach-watermark--english{left:50%;top:35%;transform:translateX(-50%) rotate(-3deg)}.teach-watermark--science{right:2%;top:25%;transform:rotate(7deg)}
        .teach-grid-shell{position:relative;z-index:2;max-width:1400px;margin:0 auto;padding:0 clamp(24px,5vw,68px)}
        .teach-grid{position:relative;display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.14fr) minmax(0,.92fr);grid-template-areas:'math english science';gap:clamp(36px,4vw,68px);align-items:start}
        .teach-card-wrap{min-width:0}.teach-card-wrap--math{grid-area:math;padding-top:46px}.teach-card-wrap--english{grid-area:english}.teach-card-wrap--science{grid-area:science;padding-top:40px}
        .teach-card{position:relative;display:block;height:clamp(480px,43vw,620px);overflow:hidden;border:1px solid rgba(183,126,22,.42);border-radius:30px;background:rgba(255,255,255,.18);box-shadow:0 16px 34px rgba(10,27,52,.12);text-decoration:none;transform:translateZ(0);transition:transform .55s cubic-bezier(.22,1,.36,1),box-shadow .55s ease,border-color .55s ease}
        .teach-card-wrap--math .teach-card,.teach-card-wrap--science .teach-card{height:clamp(410px,36vw,520px)}
        .teach-card:hover,.teach-card:focus-visible{transform:translateY(-7px);border-color:rgba(212,175,55,.9);box-shadow:0 26px 52px rgba(10,27,52,.19),0 0 0 2px rgba(212,175,55,.1)}.teach-card:focus-visible{outline:2px solid ${C.gold};outline-offset:5px}
        .teach-card-photo{position:absolute;inset:0;overflow:hidden}.teach-card-photo img{width:100%;height:100%;display:block;object-fit:cover;filter:saturate(.98) brightness(1.08);transition:transform .7s cubic-bezier(.22,1,.36,1),filter .55s ease}.teach-card:hover .teach-card-photo img,.teach-card:focus-visible .teach-card-photo img{transform:scale(1.04);filter:saturate(1) brightness(1.11)}
        .teach-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(4,20,42,.97) 0%,rgba(6,24,48,.82) 25%,rgba(6,24,48,.22) 42%,transparent 58%)}
        .teach-card-badge{position:absolute;top:22px;left:22px;display:inline-flex;align-items:center;gap:8px;padding:8px 15px;border:1px solid rgba(212,175,55,.42);border-radius:999px;background:rgba(6,24,48,.86);color:#fff;font:800 .68rem/1 ${sans};letter-spacing:.14em;text-transform:uppercase;box-shadow:0 5px 12px rgba(3,14,31,.15);transition:transform .45s cubic-bezier(.22,1,.36,1)}.teach-card:hover .teach-card-badge,.teach-card:focus-visible .teach-card-badge{transform:translateY(-3px)}
        .teach-card-content{position:absolute;left:0;right:0;bottom:0;padding:clamp(24px,2.3vw,34px)}.teach-card-content p{max-width:35ch;margin:0 0 18px;color:rgba(255,255,255,.88);font:400 clamp(.94rem,1.05vw,1.08rem)/1.62 ${sans};text-wrap:pretty}
        .teach-card-cta{display:flex;align-items:center;gap:10px;color:#F0C760;font:700 .74rem/1.3 ${sans};letter-spacing:.08em;text-transform:uppercase}.teach-card-arrow{font-size:1rem;transition:transform .35s cubic-bezier(.22,1,.36,1)}.teach-card:hover .teach-card-arrow,.teach-card:focus-visible .teach-card-arrow{transform:translateX(7px)}
        .teach-connector{position:absolute;z-index:0;left:8%;right:8%;bottom:-52px;width:84%;height:110px;overflow:visible;pointer-events:none}.teach-connector path{fill:none;stroke:rgba(183,126,22,.58);stroke-width:1;stroke-dasharray:4 5}.teach-connector text{fill:#C08A22;font-size:15px}
        .teach-footer{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:clamp(28px,5vw,72px);max-width:1120px;margin:clamp(94px,9vw,126px) auto 0;padding:0 24px}.teach-highlight{display:flex;align-items:center;gap:14px;color:${C.navy}}.teach-highlight:last-child{justify-self:end}.teach-highlight-icon{font-size:1.5rem}.teach-highlight strong{display:block;font:600 .98rem/1.3 ${serif}}.teach-highlight span{display:block;margin-top:2px;color:rgba(10,27,52,.6);font:400 .76rem/1.45 ${sans}}
        @media(max-width:1024px){.teach-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-areas:'english english' 'math science';max-width:820px;margin:auto}.teach-card-wrap--english{width:min(100%,620px);justify-self:center}.teach-card-wrap--math,.teach-card-wrap--science{padding-top:0}.teach-card-wrap--english .teach-card{height:clamp(500px,70vw,620px)}.teach-card-wrap--math .teach-card,.teach-card-wrap--science .teach-card{height:clamp(400px,54vw,500px)}.teach-connector{display:none}.teach-watermark{opacity:.65}}
        @media(max-width:640px){.teach-grid{grid-template-columns:1fr;grid-template-areas:'english' 'math' 'science';gap:28px}.teach-card-wrap--english{width:100%}.teach-card,.teach-card-wrap--english .teach-card,.teach-card-wrap--math .teach-card,.teach-card-wrap--science .teach-card{height:clamp(430px,128vw,540px);border-radius:24px}.teach-footer{grid-template-columns:1fr;justify-items:center;margin-top:64px;text-align:center}.teach-highlight,.teach-highlight:last-child{grid-row:auto;justify-self:center}.teach-watermarks{display:none}}
        @media(prefers-reduced-motion:reduce){.teach-card,.teach-card-photo img,.teach-card-badge,.teach-card-arrow{transition:none!important}.teach-card:hover,.teach-card:focus-visible{transform:none}.teach-card:hover .teach-card-photo img,.teach-card:focus-visible .teach-card-photo img{transform:none}}
      `}</style>

      <div className="teach-watermarks" aria-hidden="true">
        <div className="teach-watermark teach-watermark--math">x² + y² · △ ∠</div>
        <div className="teach-watermark teach-watermark--english">﹏ ✒︎ ︿</div>
        <div className="teach-watermark teach-watermark--science">⚗︎ · H₂O · ✧</div>
      </div>

      {/* Subtle gold particles */}
      {TEACH_PARTICLES.map((p, i) => <GoldParticle key={i} {...p} />)}

      {/* ── Heading ── */}
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
          fontSize: 'clamp(2.8rem, 5vw, 5rem)',
          letterSpacing: '-.028em', lineHeight: 1.07,
          color: C.navy, margin: '0 0 20px',
        }}>
          Excellence across{' '}
          <em style={{ fontStyle: 'italic', color: C.gold }}>every subject</em>
        </h2>

        <p style={{
          fontFamily: sans,
          fontSize: 'clamp(1.05rem, 1.45vw, 1.2rem)',
          color: C.muted,
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.78,
        }}>
          From strong foundations to academic excellence through personalised learning.
        </p>
      </motion.div>

      {/* ── Editorial tiles ── */}
      <div className="teach-grid-shell">
        <div className="teach-grid">
        {TILES.map((tile, i) => (
          <SubjectTile
            key={tile.label}
            {...tile}
            delay={i * 0.15}
            inView={inView}
          />
        ))}
          <svg className="teach-connector" viewBox="0 0 1000 110" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 8 C250 105 750 105 1000 8" />
            <text x="240" y="76">✦</text><text x="493" y="101">✦</text><text x="745" y="76">✦</text>
          </svg>
        </div>
      </div>

      <div className="teach-footer">
        <div className="teach-highlight"><span className="teach-highlight-icon" aria-hidden="true">👨‍🏫</span><div><strong>43 Expert Educators</strong><span>Across all subjects</span></div></div>
        <div className="teach-highlight"><span className="teach-highlight-icon" aria-hidden="true">🏆</span><div><strong>Proven Results</strong><span>Academic excellence through personalised learning</span></div></div>
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
  const [reviewPage,   setReviewPage]   = useState(0);

  const easeOut = [0.22, 1, 0.36, 1] as const;
  const reviewsPerPage = 4;

  const filteredReviews = ALL_CAROUSEL_REVIEWS
    .filter(r => (FILTER_MAP[activeFilter] ?? []).includes(r.id))
    .sort((a, b) => (REVIEW_IMPACT_RANK.get(a.id) ?? 999) - (REVIEW_IMPACT_RANK.get(b.id) ?? 999));
  const totalReviewPages = Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage));
  const visibleReviews = filteredReviews.slice(
    reviewPage * reviewsPerPage,
    reviewPage * reviewsPerPage + reviewsPerPage
  );

  const handleFilterChange = (tag: string) => {
    if (tag === activeFilter) return;
    setFading(true);
    setTimeout(() => {
      setActiveFilter(tag);
      setReviewPage(0);
      setFading(false);
    }, 180);
  };

  const handleReviewPageChange = (direction: 1 | -1) => {
    setFading(true);
    setTimeout(() => {
      setReviewPage((page) => (page + direction + totalReviewPages) % totalReviewPages);
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
      {/* ── Header ── */}
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
            Let’s look at some of our Google Reviews
          </h2>
        </motion.div>
      </div>

      {/* ── Tag filters ── */}
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
                padding: '0 18px',
                borderRadius: '100px',
                border: `1.5px solid ${isActive ? C.gold : 'rgba(10,27,52,0.16)'}`,
                background: isActive ? C.gold : 'transparent',
                color: isActive ? '#FFFFFF' : 'rgba(10,27,52,0.58)',
                fontFamily: sans, fontWeight: 500,
                fontSize: '.72rem', letterSpacing: '.12em',
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

      {/* ── Card grid ── */}
      <style>{`
        .rv-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(22px, 1.65vw, 30px); }
        @media (max-width: 1180px) { .rv-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px)  { .rv-grid { grid-template-columns: 1fr; } }
      `}</style>
      <motion.div
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: 0.18 }}
        style={{ padding: '0 clamp(24px,6vw,80px)' }}
      >
        <div className="rv-grid">
          {visibleReviews.map((r, i) => (
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
                padding: 'clamp(26px,2vw,34px)',
                minHeight: 'clamp(520px,34vw,620px)',
                display: 'flex',
                flexDirection: 'column' as const,
                cursor: 'pointer',
                visibility: selected?.id === r.id ? 'hidden' : 'visible',
              }}
            >
              {/* Stars + Subject pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '24px' }}>
                <span style={{ color: C.gold, fontSize: '13px', letterSpacing: '0.10em' }}>★★★★★</span>
                <span style={{
                  fontFamily: sans, fontSize: '9.5px', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  color: C.gold, background: 'rgba(212,175,55,0.09)',
                  border: '1px solid rgba(212,175,55,0.20)',
                  borderRadius: '100px', padding: '5px 12px',
                }}>{r.subject}</span>
              </div>

              {/* Name */}
              <p style={{ fontFamily: serif, fontSize: 'clamp(24px,1.55vw,30px)', fontWeight: 400, color: C.navy, lineHeight: 1.15, margin: '0 0 7px' }}>
                {r.author}
              </p>

              {/* Year · Category */}
              <p style={{ fontFamily: sans, fontSize: '13px', color: 'rgba(10,27,52,0.46)', margin: '0 0 22px', letterSpacing: '0.025em', lineHeight: 1.35 }}>
                {r.yearLevel} · {r.category}
              </p>

              {/* Result box */}
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
                borderRadius: '12px', padding: '18px 20px 20px', marginBottom: '18px',
                border: '1px solid rgba(212,175,55,0.34)',
                boxShadow: '0 12px 28px rgba(10,27,52,0.18)',
              }}>
                <div style={{
                  fontFamily: sans, fontSize: '9px', fontWeight: 800,
                  color: C.goldL, letterSpacing: '0.19em', textTransform: 'uppercase',
                  marginBottom: '11px',
                }}>The result</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: sans, fontSize: '11px', color: 'rgba(255,255,255,0.52)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{r.result.before}</span>
                  <span aria-hidden="true" style={{ color: C.gold, fontWeight: 800, fontSize: '18px' }}>→</span>
                  <strong style={{
                    fontFamily: serif, fontSize: 'clamp(1.65rem,2.4vw,2.35rem)',
                    lineHeight: 0.95, color: '#FFFFFF', fontWeight: 600,
                    letterSpacing: '-0.025em',
                  }}>{r.result.after}</strong>
                </div>
                <div aria-hidden="true" style={{
                  position: 'absolute', width: '90px', height: '90px', right: '-34px', top: '-42px',
                  borderRadius: '50%', border: '1px solid rgba(212,175,55,0.24)',
                  boxShadow: '0 0 50px rgba(212,175,55,0.16)',
                }} />
              </div>

              {/* Outcomes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '24px' }}>
                {r.outcomes.map(o => (
                  <span key={o} style={{
                    fontFamily: sans, fontSize: '11.5px', fontWeight: 600,
                    color: 'rgba(10,27,52,0.62)', background: 'rgba(10,27,52,0.04)',
                    border: '1px solid rgba(10,27,52,0.06)', borderRadius: '4px',
                    padding: '5px 9px', display: 'inline-flex', alignItems: 'center', gap: '5px',
                    lineHeight: 1.2,
                  }}>
                    <span style={{ color: C.gold, fontSize: '12px' }}>✓</span> {o}
                  </span>
                ))}
              </div>

              {/* Gold divider */}
              <div style={{ height: '1px', background: `linear-gradient(90deg, ${C.gold}55, ${C.gold}08)`, marginBottom: '22px' }} />

              {/* Preview quote */}
              <p style={{
                fontFamily: serif, fontWeight: 300, fontStyle: 'italic',
                fontSize: 'clamp(17px,1.06vw,20px)', lineHeight: 1.7, color: C.navy,
                margin: '0 0 22px', flex: 1,
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
              } as React.CSSProperties}>
                <span style={{ color: C.gold, fontSize: '1.2em', lineHeight: 0, verticalAlign: '-0.16em', marginRight: '0.04em', opacity: 0.60 }}>&ldquo;</span>
                {r.preview}
              </p>

              {/* Read Full Story */}
              <div style={{
                fontFamily: sans, fontWeight: 600,
                fontSize: '11px', letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: C.gold,
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                marginTop: 'auto',
              }}>
                Read Full Story →
              </div>
            </motion.div>
          ))}
        </div>
        {totalReviewPages > 1 && (
          <div style={{
            marginTop: 'clamp(28px,3vw,42px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            flexWrap: 'wrap',
          }}>
            <button
              type="button"
              onClick={() => handleReviewPageChange(-1)}
              style={{
                width: '44px', height: '44px',
                borderRadius: '999px',
                border: `1px solid rgba(10,27,52,0.16)`,
                background: '#FFFFFF',
                color: C.navy,
                fontFamily: sans,
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              aria-label="Show previous reviews"
            >
              ←
            </button>
            <span style={{
              fontFamily: sans,
              fontSize: '.78rem',
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'rgba(10,27,52,0.58)',
            }}>
              {reviewPage + 1} / {totalReviewPages}
            </span>
            <button
              type="button"
              onClick={() => handleReviewPageChange(1)}
              style={{
                width: '44px', height: '44px',
                borderRadius: '999px',
                border: `1px solid ${C.gold}`,
                background: C.navy,
                color: '#FFFFFF',
                fontFamily: sans,
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              aria-label="Show next reviews"
            >
              →
            </button>
          </div>
        )}
      </motion.div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && (
          <StoryModal
            key={selected.id}
            review={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
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
          <span style={{ fontSize: '.85em', opacity: 0.70 }}>↗</span>
        </a>
      </div>
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
    <motion.div ref={ref} variants={fadeIn} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
      <TeachersPreview />
    </motion.div>
  );
};


// ══════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════
const Index = () => {
  const philosophyNextSectionRef = useRef<HTMLElement>(null);

  return (
  <div style={{ fontFamily: sans }}>
    <Confetti />
    <SEO
      title="Premium K-12 Tutoring in Canley Heights, Sydney"
      description="DA Tuition delivers personalised K-12 tutoring in Canley Heights, Sydney — small-group classes, expert educators, and proven HSC results. Book a consultation today."
      canonicalUrl="/"
      jsonLd={[organizationSchema(), localBusinessSchema(siteStats.reviewCount)]}
    />
    <NavigationNew />
    <main>
      <VisualIntro>
        <HeroSection embedded />
      </VisualIntro>
      <div className="philosophy-next-transition">
        <style>{`
          .philosophy-next-transition {
            position: relative;
            isolation: isolate;
          }
          .hero-philosophy-pullup {
            position: relative;
            z-index: 20;
            margin-top: -110svh;
            width: 100%;
            overflow-x: clip;
            background: ${C.navy};
            box-shadow: 0 -12px 30px rgba(13,35,68,.06);
          }
          @media (min-width: 768px) and (max-width: 1024px) {
            .hero-philosophy-pullup { margin-top: -95svh; }
          }
          @media (max-width: 767px) {
            .hero-philosophy-pullup { margin-top: -80svh; }
          }
          @media (prefers-reduced-motion: reduce) {
            .hero-philosophy-pullup {
              margin-top: 0;
              box-shadow: none;
            }
          }
        `}</style>
        <div className="hero-philosophy-pullup">
          <MarqueeStrip />
          <PhilosophyEditorialSection nextSectionRef={philosophyNextSectionRef} />
        </div>
        <ImpactRecognitionSection sectionRef={philosophyNextSectionRef} />
      </div>
      <AchievementsSection />
      <DAEnvironmentSection />
      <ReviewsSection />
      <QuoteSection />
      <ProgramsSection />
      <SubjectPeekSection />
      <TeachersSection />
      <WellbeingSection />
      <CinematicQuoteSection />
    </main>
    <HomeFooterTrial />
  </div>
  );
};

export default Index;
