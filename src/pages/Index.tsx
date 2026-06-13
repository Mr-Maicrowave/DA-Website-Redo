/**
 * Index.tsx — DA Tuition Homepage
 * Premium private-school inspired design with Awwwards-style animations.
 * Inspired by: korowa.vic.edu.au
 */

import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import AwardRecognition from '@/components/AwardRecognition';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarousel';
import TeachersPreview from '@/components/TeachersPreview';
import DALogoShine from '@/components/animations/DALogoShine';
import Confetti, { fireConfetti } from '@/components/animations/Confetti';
import SEO from '@/components/SEO';
import { siteStats } from '@/data/site-stats';
import { organizationSchema, localBusinessSchema } from '@/lib/seo/schema';

// ─── Design tokens ────────────────────────────────────────────
const C = {
  navy:  '#0A1628',
  navy2: '#0F1E38',
  gold:  '#C9A227',
  goldL: '#E8C040',
  cream: '#F8F4EC',
  cream2:'#EDE5D4',
  white: '#FAFAF8',
  muted: 'rgba(10,22,40,0.52)',
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', 'Inter', sans-serif";

// ─── Animation variants ────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 52 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
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
        color: '#E8C040',
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
      <div style={{ width: 32, height: 1, background: `linear-gradient(90deg,transparent,#C9A227,transparent)`, margin: '0 auto 16px' }} />

      {/* Label */}
      <div style={{
        fontFamily: sans,
        fontSize: '.72rem',
        fontWeight: 700,
        letterSpacing: '.13em',
        textTransform: 'uppercase' as const,
        color: 'rgba(201,162,39,.65)',
      }}>
        {label}
      </div>
    </div>
  );
};

// ─── Marquee ───────────────────────────────────────────────────
const MARQUEE = ['Mathematics','English','Science','Legal Studies','Business Studies','HSC Excellence','20+ Years','650+ Students','5.0 ★ Rating','Award-Winning','Small Groups','Personalised Learning'];
const MarqueeStrip = () => (
  <div style={{ background: C.navy, borderTop: `1px solid rgba(201,162,39,.2)`, borderBottom: `1px solid rgba(201,162,39,.2)`, padding: '14px 0', overflow: 'hidden' }}>
    <div style={{ display: 'flex', animation: 'marq 30s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
      {[...MARQUEE, ...MARQUEE].map((t, i) => (
        <span key={i} style={{ fontFamily: sans, fontSize: '.74rem', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: C.gold, padding: '0 38px' }}>
          {t}<span style={{ color: 'rgba(201,162,39,.3)', marginLeft: 38 }}>◆</span>
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
  const logoY = useTransform(scrollY, [0, 500], [0, -55]);
  const logoSize = typeof window !== 'undefined' ? Math.min(Math.round(window.innerWidth * 0.30), 270) : 250;

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
      background: `radial-gradient(ellipse 55% 48% at 50% 36%, rgba(201,162,39,.11) 0%, transparent 68%),
                   linear-gradient(180deg, ${C.cream} 0%, ${C.cream2} 55%, #E8DCC8 100%)`,
    }}>
      {/* Shining logo */}
      <motion.div style={{ y: logoY, marginBottom: '44px' }}
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
        <DALogoShine size={logoSize} />
      </motion.div>

      {/* Headline */}
      <motion.h1 initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: serif, fontWeight: 500, fontSize: 'clamp(2.8rem, 6vw, 5.4rem)', lineHeight: 1.05, letterSpacing: '-.025em', color: C.navy, marginBottom: '18px', maxWidth: '800px' }}>
        Where Ambition Meets<br />
        <em style={{ fontStyle: 'italic', color: C.gold }}>Academic Excellence</em>
      </motion.h1>

      {/* Tagline */}
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.52 }}
        style={{ fontFamily: sans, fontSize: 'clamp(.95rem, 1.8vw, 1.12rem)', color: C.muted, marginBottom: '42px', letterSpacing: '.02em' }}>
        Trusted by Families. Transforming Futures.
      </motion.p>

      {/* CTA buttons */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.68 }}
        style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>

        <motion.button whileHover={{ scale: 1.03, background: 'rgba(10,22,40,.07)' }} whileTap={{ scale: 0.97 }}
          onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ fontFamily: sans, background: 'transparent', color: C.navy, border: `1.5px solid rgba(10,22,40,.30)`, padding: '14px 40px', borderRadius: '4px', fontSize: '.9rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
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
              background: '#E8C040', display: 'block',
              boxShadow: '0 0 4px 1px rgba(232,192,64,.6)',
            }}
          />
        );
      })}
    </span>
  );
};

// ── Count-up number — fires once when inView, then sparkles ──
const CountUpStat = ({ target, decimals = 0, suffix, triggerDelay, inView }: {
  target: number; decimals?: number; suffix: string;
  triggerDelay: number; inView: boolean;
}) => {
  const reduced = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [count, setCount]   = useState(reduced.current ? target : 0);
  const [sparkle, setSparkle] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!inView) return;

    // timer fires after delay — ran guard lives INSIDE so React StrictMode
    // double-effect doesn't mark it complete before the timer actually fires
    const timer = setTimeout(() => {
      if (ran.current) return;
      ran.current = true;
      if (reduced.current) { setCount(target); return; }

      const duration = 1800;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(eased * target);
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          setCount(target);
          setSparkle(true);
          setTimeout(() => setSparkle(false), 900);
        }
      };
      requestAnimationFrame(tick);
    }, triggerDelay);

    return () => clearTimeout(timer);
  }, [inView, target, triggerDelay]);

  const display = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString();

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {display}{suffix}
      {!reduced.current && <GoldSparkle active={sparkle} />}
    </span>
  );
};

const PhilosophyBackedSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  // Gentle parallax — left column drifts up slightly faster than right
  const leftY  = useTransform(scrollYProgress, [0, 1], ['18px', '-18px']);
  const rightY = useTransform(scrollYProgress, [0, 1], ['10px', '-10px']);
  const glowY  = useTransform(scrollYProgress, [0, 1], ['6%',  '-6%']);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
  <section ref={sectionRef} style={{ background: C.navy, padding: '160px 24px', position: 'relative', overflow: 'hidden' }}>

    {/* Atmosphere: layered depth — parallax glow */}
    <motion.div style={{ y: glowY, position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 80% at 10% 60%, rgba(201,162,39,.055) 0%, transparent 65%)`, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 50% 50% at 85% 20%, rgba(10,22,40,.6) 0%, transparent 70%)`, pointerEvents: 'none' }} />

    {/* Top border — hairline gold */}
    <div style={{ position: 'absolute', top: 0, left: '24px', right: '24px', height: '1px', background: `linear-gradient(90deg, transparent, rgba(201,162,39,.25) 20%, rgba(201,162,39,.25) 80%, transparent)` }} />
    {/* Bottom border — hairline gold */}
    <div style={{ position: 'absolute', bottom: 0, left: '24px', right: '24px', height: '1px', background: `linear-gradient(90deg, transparent, rgba(201,162,39,.15) 20%, rgba(201,162,39,.15) 80%, transparent)` }} />

    <div style={{
      maxWidth: '1100px', margin: '0 auto', position: 'relative',
      display: 'grid', gridTemplateColumns: '55fr 45fr', gap: '120px', alignItems: 'center',
    }}>

      {/* ── LEFT: Philosophy (dominant) ── */}
      <motion.div style={{ y: leftY }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.05, ease: 'easeOut' }}
          style={{
            fontFamily: sans, fontSize: '.63rem', fontWeight: 600,
            letterSpacing: '.24em', textTransform: 'uppercase' as const,
            color: 'rgba(201,162,39,.55)', marginBottom: '36px',
          }}>
          Our Philosophy
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          style={{
            fontFamily: serif, fontWeight: 400,
            fontSize: 'clamp(2.4rem,4vw,3.4rem)',
            lineHeight: 1.18, letterSpacing: '-.025em',
            color: C.white, margin: '0 0 40px',
          }}>
          A child's starting point should never be mistaken for{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: C.gold }}>their potential.</em>
        </motion.h2>

        {/* Gold accent rule — draws itself left to right */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.38, ease }}
          style={{ width: '48px', height: '1px', background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginBottom: '36px', transformOrigin: 'left' }} />

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.46, ease }}
          style={{
            fontFamily: sans, fontWeight: 300,
            fontSize: '.875rem', lineHeight: 2,
            color: 'rgba(250,250,248,.38)',
            letterSpacing: '.012em', marginBottom: '48px',
          }}>
          Every student deserves to be known before they are judged.
          We have found that confidence almost always arrives before results do —
          and that meaningful change only comes when a student feels genuinely guided, not simply instructed.
        </motion.p>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.58, ease }}
          style={{
            borderLeft: `1px solid rgba(201,162,39,.40)`,
            paddingLeft: '24px', paddingTop: '4px', paddingBottom: '4px',
          }}>
          <p style={{
            fontFamily: serif, fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(1rem,1.6vw,1.14rem)',
            lineHeight: 1.78, letterSpacing: '.01em',
            color: 'rgba(250,250,248,.55)', margin: 0,
          }}>
            "We are not simply trying to improve marks. We are trying to strengthen the child behind the result."
          </p>
        </motion.div>
      </motion.div>

      {/* ── RIGHT: Stats — evidence, not KPIs ── */}
      <motion.div style={{ position: 'relative', y: rightY }}>
        {/* Vertical gold thread */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.3, ease }}
          style={{
            position: 'absolute', top: 0, bottom: 0, left: '-32px',
            width: '1px',
            background: `linear-gradient(180deg, transparent, rgba(201,162,39,.20) 15%, rgba(201,162,39,.20) 85%, transparent)`,
            transformOrigin: 'top',
          }} />

        {STATS_DATA.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.28 + i * 0.1, ease }}>
            {i > 0 && (
              <div style={{ height: '1px', background: `linear-gradient(90deg, rgba(201,162,39,.14), rgba(201,162,39,.06) 60%, transparent)` }} />
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', padding: '34px 0' }}>
              <div style={{
                fontFamily: serif, fontWeight: 400,
                fontSize: 'clamp(2.2rem,3.6vw,3.2rem)',
                color: C.goldL, letterSpacing: '-.03em', lineHeight: 1,
                flexShrink: 0,
              }}>
                <CountUpStat
                  target={s.target}
                  decimals={s.decimals}
                  suffix={s.suffix}
                  triggerDelay={s.triggerDelay}
                  inView={inView}
                />
              </div>
              <div style={{
                fontFamily: sans, fontWeight: 400,
                fontSize: '.6rem', letterSpacing: '.18em',
                textTransform: 'uppercase' as const,
                color: 'rgba(201,162,39,.40)',
                textAlign: 'right' as const, lineHeight: 1.6,
              }}>
                {s.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  PROGRAMS
// ══════════════════════════════════════════════════════════════
const PROGRAMS = [
  { icon: '🏛', sub: 'Years 3–6',   name: 'Primary School',  desc: 'Building strong foundations in literacy, numeracy, and the curiosity to learn.' },
  { icon: '📚', sub: 'Years 7–10',  name: 'High School',      desc: 'Mastering core subjects with depth, examination technique, and real confidence.' },
  { icon: '🎓', sub: 'Years 11–12', name: 'HSC Excellence',   desc: 'Elite Band 6 preparation with structured study plans and expert guidance.' },
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
            <motion.div key={i} variants={fadeUp}
              whileHover={{ y: -7, boxShadow: '0 24px 64px rgba(10,22,40,.13)' }}
              style={{ background: '#fff', border: `1px solid rgba(201,162,39,.16)`, borderRadius: '16px', padding: '44px 36px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(10,22,40,.06)', transition: 'box-shadow .35s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '22px' }}>{p.icon}</div>
              <div style={{ fontFamily: sans, fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: C.gold, marginBottom: '8px', fontWeight: 700 }}>{p.sub}</div>
              <h3 style={{ fontFamily: serif, fontSize: '1.65rem', fontWeight: 600, color: C.navy, marginBottom: '12px' }}>{p.name}</h3>
              <p style={{ fontFamily: sans, fontSize: '.88rem', color: C.muted, lineHeight: 1.72 }}>{p.desc}</p>
              <div style={{ marginTop: '26px', fontFamily: sans, fontSize: '.8rem', fontWeight: 700, color: C.gold, display: 'flex', alignItems: 'center', gap: '6px' }}>Learn more <span>→</span></div>
            </motion.div>
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
        <circle cx="14" cy="10" r="5" stroke="#C9A227" strokeWidth="1.4"/>
        <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#C9A227" strokeWidth="1.4" strokeLinecap="round"/>
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
        <path d="M14 4 L14 8 M8.5 6.5 L11.5 9.5 M5 13 L9 13 M8.5 19.5 L11.5 16.5 M14 20 L14 24 M17.5 16.5 L20.5 19.5 M19 13 L23 13 M17.5 9.5 L20.5 6.5" stroke="#C9A227" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="14" cy="13" r="4" stroke="#C9A227" strokeWidth="1.4"/>
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
        <path d="M6 22 L14 6 L22 22" stroke="#C9A227" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 17 L19.5 17" stroke="#C9A227" strokeWidth="1.4" strokeLinecap="round"/>
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
        border: `1px solid ${hovered ? 'rgba(201,162,39,.3)' : 'rgba(10,22,40,.07)'}`,
        boxShadow: hovered
          ? '0 40px 100px rgba(10,22,40,.12), 0 8px 32px rgba(10,22,40,.08)'
          : '0 2px 20px rgba(10,22,40,.05)',
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
          background: `linear-gradient(90deg, #C9A227, transparent)`,
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
          color: 'rgba(10,22,40,.55)',
          marginBottom: 16,
        }}>{card.body1}</p>

        {/* Body paragraph 2 — slightly more prominent */}
        <p style={{
          fontFamily: sans,
          fontSize: '.9rem',
          lineHeight: 1.82,
          color: hovered ? 'rgba(10,22,40,.75)' : 'rgba(10,22,40,.45)',
          fontStyle: 'italic',
          marginTop: 'auto',
          paddingTop: 16,
          borderTop: `1px solid ${hovered ? 'rgba(201,162,39,.2)' : 'rgba(10,22,40,.06)'}`,
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
        backgroundImage: 'radial-gradient(rgba(10,22,40,.028) 1px, transparent 1px)',
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
              backgroundImage: `linear-gradient(135deg, #8B6914, ${C.gold}, #C9A227)`,
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
            color: 'rgba(10,22,40,.52)',
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
        <motion.div variants={fadeUp} style={{ fontFamily: serif, fontSize: '4rem', color: 'rgba(201,162,39,.3)', lineHeight: 1, marginBottom: '16px' }}>❝</motion.div>
        <motion.p variants={fadeUp} style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.44, color: C.white, letterSpacing: '.01em' }}>
          My daughter went from dreading maths to topping her class. DA Tuition didn't just improve her grades — they gave her back her confidence.
        </motion.p>
        <motion.div variants={fadeUp} style={{ width: '40px', height: '1px', background: C.gold, margin: '32px auto 18px' }} />
        <motion.p variants={fadeUp} style={{ fontFamily: sans, fontSize: '.74rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(201,162,39,.58)', fontWeight: 600 }}>
          Parent of Year 10 Student — Google Review, 5 Stars
        </motion.p>
      </motion.div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════
//  REVIEWS
// ══════════════════════════════════════════════════════════════
const ReviewsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <section ref={ref} style={{ background: C.cream, padding: '100px 0' }}>
      <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '52px', padding: '0 24px' }}>
          <div style={{ fontFamily: sans, fontSize: '.7rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: C.gold, marginBottom: '14px' }}>Families Love DA</div>
          <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 'clamp(2rem,4vw,3.4rem)', color: C.navy, letterSpacing: '-.02em' }}>393 Five-Star Reviews</h2>
        </motion.div>
        <motion.div variants={fadeIn}><GoogleReviewsCarousel /></motion.div>
      </motion.div>
    </section>
  );
};


// ══════════════════════════════════════════════════════════════
//  AWARD RECOGNITION
// ══════════════════════════════════════════════════════════════
const AwardSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <section ref={ref} style={{ background: C.navy, padding: '100px 24px' }}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} style={{ textAlign: 'center', marginBottom: '52px' }}>
        <div style={{ fontFamily: sans, fontSize: '.7rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: C.gold, marginBottom: '14px' }}>Recognition</div>
        <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 'clamp(2rem,4vw,3.4rem)', color: C.white, letterSpacing: '-.02em' }}>Award-Winning Service</h2>
      </motion.div>
      <motion.div variants={fadeIn} initial="hidden" animate={inView ? 'visible' : 'hidden'}><AwardRecognition /></motion.div>
    </section>
  );
};

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
      <ProgramsSection />
      <WhySection />
      <QuoteSection />
      <ReviewsSection />
      <AwardSection />
      <TeachersSection />
    </main>
    <FooterNew />
  </div>
);

export default Index;
