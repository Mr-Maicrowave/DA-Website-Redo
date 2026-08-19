import { ArrowRight, CheckCircle, type LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useState, type CSSProperties } from 'react';

type Concern = {
  icon: LucideIcon;
  title: string;
  detail: string;
};

type Level = {
  label: string;
  years: string;
  description: string;
  subjects: readonly string[];
  tone: string;
  icon: LucideIcon;
};

type ConfidenceJourneyProps = {
  concerns: readonly Concern[];
  levels: readonly Level[];
};

const easing = [0.16, 1, 0.3, 1] as const;

// Each Years 7-12 stage uses a different diagram grammar: a continuous graph for
// connected high-school methods and an exact-value unit-circle argument for HSC reasoning.
const STAGE_VISUALS = [
  {
    kind: 'coordinate-plane', accent: '#238c68', soft: '#daf2e6', label: 'Connections become methods',
    caption: 'Algebra, geometry and graphs start to speak the same language.',
    realExample: 'A tradesperson who charges a $50 call-out fee plus $80 an hour is describing a straight line — the exact y = mx + c relationship graphed in Year 9, just with an invoice attached.',
  },
  {
    kind: 'unit-circle', accent: '#aa7014', soft: '#fce7b9', label: 'Reasoning holds under pressure',
    caption: 'A complete solution is built one justified step at a time.',
    realExample: 'Surveyors and engineers still rely on exact trig ratios like sin 60° = √3/2 for precise calculations — the same reasoning tested in every HSC trigonometry question.',
  },
] as const;

// Optional, click-to-reveal only — the diagram and caption above already carry the
// primary signal ("what kind of maths happens at this stage") and must read fully
// without any interaction. This is a bonus layer for a curious browser, not a gate.
const RealExampleToggle = ({ accent, example }: { accent: string; example: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative mt-6">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.1em] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ color: accent, '--tw-ring-color': accent } as CSSProperties}
      >
        {isOpen ? 'Hide real example' : 'See a real example'}
        <ArrowRight className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-in-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
        <div className="min-h-0 overflow-hidden">
          <p className="mt-3 max-w-[27ch] text-sm leading-6 text-[#40516b] transition-opacity duration-200" style={{ opacity: isOpen ? 1 : 0 }}>
            {example}
          </p>
        </div>
      </div>
    </div>
  );
};

const STAGE_PLOT_LINE_LENGTH: Record<(typeof STAGE_VISUALS)[number]['kind'], number> = {
  'coordinate-plane': 160,
  'unit-circle': 200,
};

const StagePlot = ({ index }: { index: number }) => {
  const visual = STAGE_VISUALS[index];
  const gradientId = `stage-${visual.kind}-line`;
  const shineId = `stage-${visual.kind}-shine`;
  const prefersReducedMotion = useReducedMotion();
  // The card itself already fades in on scroll; this delay lets that settle first so the
  // curve reads as "the diagram drawing itself in," not a second competing fade.
  const lineTransition = { duration: 0.85, delay: 0.15, ease: easing };
  const markTransition = (delay: number) => ({ duration: 0.32, delay: 0.65 + delay, ease: easing });
  const lineInitial = prefersReducedMotion
    ? false
    : { pathLength: 0, opacity: 0, strokeDasharray: STAGE_PLOT_LINE_LENGTH[visual.kind] };
  const markInitial = prefersReducedMotion ? false : { opacity: 0, scale: 0.4 };
  const grid = (
    <>
      {[24, 48, 72].map((y) => <line key={`y-${y}`} x1="8" y1={y} x2="152" y2={y} stroke="#071629" strokeOpacity="0.1" />)}
      {[32, 64, 96, 128].map((x) => <line key={`x-${x}`} x1={x} y1="8" x2={x} y2="84" stroke="#071629" strokeOpacity="0.1" />)}
    </>
  );

  return (
    <svg viewBox="0 0 160 102" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={visual.accent} />
          <stop offset="0.44" stopColor="#fff8dc" />
          <stop offset="0.58" stopColor={visual.accent} />
          <stop offset="1" stopColor={visual.accent} />
        </linearGradient>
        <filter id={shineId} x="-30%" y="-50%" width="160%" height="200%">
          <feGaussianBlur stdDeviation="2.1" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {visual.kind === 'coordinate-plane' && (
        <>
          {grid}
          <line x1="18" y1="78" x2="148" y2="78" stroke="#071629" strokeOpacity="0.45" />
          <line x1="30" y1="86" x2="30" y2="12" stroke="#071629" strokeOpacity="0.45" />
          <motion.path
            d="M 30 72 L 142 18"
            fill="none" stroke={`url(#${gradientId})`} strokeWidth="4" strokeLinecap="round" filter={`url(#${shineId})`}
            initial={lineInitial}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={lineTransition}
          />
          <path d="M 30 28 L 58 40 L 84 50 L 112 62 L 142 72" fill="none" stroke="#238c68" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 4" />
          <motion.circle
            cx="84" cy="49" r="5" fill={visual.accent} stroke="#fffdf8" strokeWidth="2"
            initial={markInitial}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={markTransition(0)}
          />
          <rect x="104" y="5" width="51" height="13" rx="2" fill="#fffdf8" fillOpacity="0.92" />
          <text x="108" y="14" fill={visual.accent} fontSize="8" fontWeight="700">y = 2x + 1</text>
        </>
      )}
      {visual.kind === 'unit-circle' && (
        <>
          <line x1="10" y1="47" x2="110" y2="47" stroke="#071629" strokeOpacity="0.32" />
          <line x1="58" y1="6" x2="58" y2="82" stroke="#071629" strokeOpacity="0.32" />
          <motion.circle
            cx="58" cy="47" r="30" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" filter={`url(#${shineId})`}
            initial={lineInitial}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={lineTransition}
          />
          {/* The radius sweeps to a classic exact-value angle (60 degrees), then the
              perpendicular drop and the angle mark explain where the ratio comes from. */}
          <motion.line
            x1="58" y1="47" x2="73" y2="21" stroke={visual.accent} strokeWidth="2"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.3, delay: 0.65, ease: easing }}
          />
          <motion.line
            x1="73" y1="21" x2="73" y2="47" stroke={visual.accent} strokeOpacity="0.5" strokeWidth="1.3" strokeDasharray="3 3"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.26, delay: 0.85, ease: easing }}
          />
          <motion.path
            d="M72,47 A14,14 0 0 0 65,35" fill="none" stroke="#071629" strokeOpacity="0.42" strokeWidth="1.1"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.24, delay: 0.9, ease: easing }}
          />
          <text x="96" y="43" fill={visual.accent} fontSize="7" fontWeight="700">60°</text>
          <motion.circle
            cx="73" cy="21" r="4.2" fill={visual.accent} stroke="#fffdf8" strokeWidth="1.6"
            initial={markInitial}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={markTransition(0.4)}
          />
          <motion.g
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.3, delay: 1.25, ease: easing }}
          >
            <text x="23" y="94" fill={visual.accent} fontSize="9" fontWeight="700">sin 60° =</text>
            <path d="M 76 88 L 80 93 L 85 81 L 100 81" fill="none" stroke={visual.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <text x="91" y="93" fill={visual.accent} fontSize="9" fontWeight="700">3</text>
            <text x="104" y="93" fill={visual.accent} fontSize="9" fontWeight="700">/2</text>
          </motion.g>
        </>
      )}
    </svg>
  );
};

export const ConfidenceJourney = ({ concerns, levels }: ConfidenceJourneyProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <section id="parent-concerns" className="relative isolate overflow-hidden bg-[#fff6e7] px-5 pb-20 pt-14 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[radial-gradient(ellipse_at_center_bottom,rgba(201,162,39,.13),transparent_68%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8a6110]">For parents</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-start lg:gap-16">
            <h2 className="text-balance font-serif text-4xl font-medium leading-tight tracking-[-0.04em] text-[#071629] lg:text-5xl">Maths problems usually show up as confidence problems first.</h2>
            <p className="max-w-[54ch] text-pretty text-base leading-8 text-[#52627b] lg:pt-2">Whether your child freezes in tests, avoids homework, or needs to push further ahead, these are the situations we work with every day.</p>
          </div>

          <div className="relative mt-12">
            <motion.svg className="pointer-events-none absolute left-[8%] top-7 hidden h-28 w-[84%] lg:block" viewBox="0 0 1000 128" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M 20 93 C 202 102, 267 30, 430 64 S 677 116, 980 26"
                fill="none"
                stroke="#c9a227"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="5 10"
                initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.72 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: easing }}
              />
            </motion.svg>
            <div className="grid gap-5 lg:grid-cols-3">
              {concerns.map((concern, index) => {
                const Icon = concern.icon;
                return (
                  <motion.article
                    key={concern.title}
                    className="group relative rounded-2xl bg-[#fffdf8]/90 p-6 ring-1 ring-[#071629]/10 transition-shadow duration-200 hover:shadow-[0_10px_26px_rgba(7,22,41,.1)] motion-reduce:transition-none"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: easing }}
                  >
                    <span className="mb-7 flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f2ff] text-[#10233f] ring-4 ring-[#fff6e7]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="max-w-[23ch] text-xl font-black leading-snug tracking-[-0.02em] text-[#10233f]">{concern.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#52627b]">{concern.detail}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="math-pathways" className="bg-[#fffdf8] px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[.85fr_1fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#8a6110]">Your child&apos;s journey</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.04em] text-[#071629] lg:text-5xl">Choose by school stage, not by guesswork.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[#52627b]">Not sure which level fits your child? The interview will help. These stages give you a clear starting point before you call.</p>
          </div>

          <div className="mt-16 space-y-14 lg:space-y-20">
            {levels.map((level, index) => {
              const Icon = level.icon;
              const reverse = index % 2 === 1;
              const visual = STAGE_VISUALS[index];
              return (
                <motion.article
                  key={level.label}
                  className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,.64fr)] lg:items-center lg:gap-16"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, ease: easing }}
                >
                  <div className={reverse ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.14em]" style={{ color: visual.accent }}>
                      <span className="font-serif text-base tracking-normal">0{index + 1}</span>
                      <span className="h-px w-8" style={{ backgroundColor: visual.accent }} aria-hidden="true" />
                      {level.years}
                    </div>
                    <div className="mt-5 flex items-start gap-5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#10233f] text-[#f1df9a]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <div>
                        <h3 className="font-serif text-3xl font-medium tracking-[-0.035em] sm:text-4xl" style={{ color: visual.accent }}>{level.label}</h3>
                        <p className="mt-3 max-w-[56ch] text-sm leading-7 text-[#52627b]">{level.description}</p>
                      </div>
                    </div>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {level.subjects.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-3 text-sm font-semibold text-[#24324a]">
                          <CheckCircle className="h-4 w-4 shrink-0" style={{ color: visual.accent }} aria-hidden="true" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <button type="button" className="mt-7 inline-flex items-center gap-2 text-sm font-black transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4" style={{ color: visual.accent, '--tw-ring-color': visual.accent } as CSSProperties} onClick={() => document.getElementById('maths-class-options')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                      Ask which level fits <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className={`relative w-full max-w-[32rem] overflow-hidden rounded-2xl bg-gradient-to-br ${level.tone} p-7 sm:p-10 ${reverse ? 'lg:order-1 lg:justify-self-start' : 'lg:justify-self-end'}`}>
                    <span className="absolute right-6 top-5 font-serif text-6xl leading-none text-[#071629]/8" aria-hidden="true">{index + 1}</span>
                    <p className="relative text-xs font-black uppercase tracking-[0.15em]" style={{ color: visual.accent }}>{visual.label}</p>
                    <div className="relative mt-8 max-w-xs"><StagePlot index={index} /></div>
                    <p className="relative mt-5 max-w-[25ch] font-serif text-xl leading-snug text-[#071629]">{visual.caption}</p>
                    <div className="relative">
                      <RealExampleToggle accent={visual.accent} example={visual.realExample} />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
