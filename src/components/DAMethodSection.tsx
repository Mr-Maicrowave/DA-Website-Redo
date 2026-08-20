/**
 * DAMethodSection — interactive polygon for "The DA Method"
 * Used on: /our-approach, /subjects/science (and any future subject pages)
 *
 * Left (55%): animated SVG diamond — hub + 4 nodes + particles
 * Right (45%): crossfading step detail panel
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Data ──────────────────────────────────────────────────────────────────────

interface DaStep {
  id: string;
  num: string;
  node: string;
  cx: number;
  cy: number;
  title: string;
  sentence: string;
  bullets: string[];
  result: string;
}

const HUB = { cx: 250, cy: 240 };

export const DA_STEPS: DaStep[] = [
  {
    id: 'decode',
    num: '01',
    node: 'Decode',
    cx: 250, cy: 68,
    title: 'Decode the Question',
    sentence: 'Students learn what the exam is actually asking before they attempt to answer it.',
    bullets: [
      'Identify command words (describe, explain, evaluate, assess)',
      'Locate exactly where marks are allocated in the question',
      'Understand what the marker expects to see — before writing a word',
    ],
    result: 'Answer with precision, not assumption.',
  },
  {
    id: 'understand',
    num: '02',
    node: 'Understand',
    cx: 432, cy: 240,
    title: 'Build Real Understanding',
    sentence: 'We teach the reasoning behind every concept — not just the steps to follow.',
    bullets: [
      'Connect new ideas to what students already know',
      'Ask "why" before memorising "how"',
      'Build knowledge that holds under exam pressure',
    ],
    result: 'Content that stays — even inside the exam room.',
  },
  {
    id: 'practise',
    num: '03',
    node: 'Practise',
    cx: 250, cy: 412,
    title: 'Deliberate Practice',
    sentence: 'Students practise exactly the problems they will face — under exam conditions.',
    bullets: [
      'Timed exam-style questions in every session',
      'Targeted feedback on each attempt, not just a mark',
      'Build speed without sacrificing accuracy',
    ],
    result: 'Exam readiness — not just topic familiarity.',
  },
  {
    id: 'refine',
    num: '04',
    node: 'Refine',
    cx: 68, cy: 240,
    title: 'Refine Until Reliable',
    sentence: 'Gaps are found, addressed, and retested until performance is consistent.',
    bullets: [
      'Identify which topics cost the most marks',
      'Close specific gaps with targeted review',
      'Confirm improvement before moving forward',
    ],
    result: 'Marks that improve — and stay improved.',
  },
];

// ── Particle ──────────────────────────────────────────────────────────────────

const DaParticle = ({ step, delay }: { step: DaStep; delay: number }) => (
  <motion.g
    initial={{ x: HUB.cx, y: HUB.cy, opacity: 0 }}
    animate={{
      x:       [HUB.cx, step.cx],
      y:       [HUB.cy, step.cy],
      opacity: [0.80, 0],
    }}
    transition={{
      duration:    2.2,
      delay,
      repeat:      Infinity,
      repeatDelay: 0.9,
      ease:        'easeIn',
    }}
  >
    <circle cx={0} cy={0} r={1.8} fill="#D4AF37" />
  </motion.g>
);

// ── Section ───────────────────────────────────────────────────────────────────

const DAMethodSection = () => {
  const [activeId,  setActiveId]  = useState<string>(DA_STEPS[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const focusedId  = hoveredId ?? activeId;
  const activeStep = DA_STEPS.find(s => s.id === activeId)!;

  return (
    <section style={{
      background:  '#06101E',
      padding:     '96px 32px',
      position:    'relative',
      overflow:    'hidden',
    }}>

      {/* Ambient glow centred behind polygon */}
      <div style={{
        position: 'absolute', top: '50%', left: '27%',
        width: '480px', height: '480px',
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.055) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase' as const,
            color: '#D4AF37', marginBottom: '14px',
          }}>The DA Method</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2rem, 3.6vw, 3rem)',
            fontWeight: 500, letterSpacing: '-0.022em',
            lineHeight: 1.1, color: '#F7F4EE',
            margin: 0,
          }}>A System Built for Results</h2>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-16 lg:gap-20 items-center">

          {/* ─── LEFT: SVG polygon ─── */}
          <div className="flex justify-center">
            <svg viewBox="0 0 500 480" style={{ width: '100%', maxWidth: '540px', overflow: 'visible' }}>

              {/* Nested diamond outlines — depth */}
              {([
                { d: 'M250,68 L432,240 L250,412 L68,240Z',   o: 0.10 },
                { d: 'M250,137 L361,240 L250,343 L139,240Z', o: 0.06 },
                { d: 'M250,171 L322,240 L250,309 L178,240Z', o: 0.04 },
              ] as { d: string; o: number }[]).map(({ d, o }, i) => (
                <path key={i} d={d} fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity={o} />
              ))}

              {/* Connection lines — illuminate on focus */}
              {DA_STEPS.map(s => {
                const focused = s.id === focusedId;
                return (
                  <motion.line
                    key={s.id}
                    x1={HUB.cx} y1={HUB.cy}
                    x2={s.cx}   y2={s.cy}
                    stroke="#D4AF37"
                    animate={{
                      strokeWidth: focused ? 1.2 : 0.5,
                      opacity:     focused ? 0.58 : 0.15,
                    }}
                    transition={{ duration: 0.30, ease: 'easeOut' }}
                  />
                );
              })}

              {/* Particles — two staggered waves per line */}
              {DA_STEPS.map((s, i) => (
                <DaParticle key={`p1-${s.id}`} step={s} delay={i * 0.60} />
              ))}
              {DA_STEPS.map((s, i) => (
                <DaParticle key={`p2-${s.id}`} step={s} delay={i * 0.60 + 1.1} />
              ))}

              {/* ── Centre hub ── */}
              <circle cx={HUB.cx} cy={HUB.cy} r={64}
                fill="#09162A" stroke="#D4AF37" strokeWidth="0.9" opacity="0.96" />
              <circle cx={HUB.cx} cy={HUB.cy} r={57}
                fill="none" stroke="#D4AF37" strokeWidth="0.35" opacity="0.28" />
              <text x={HUB.cx} y={HUB.cy - 16}
                textAnchor="middle"
                fontFamily="'DM Sans', sans-serif"
                fontSize="6.5" fontWeight="700" letterSpacing="2.5"
                fill="#D4AF37" opacity="0.80">THE DA METHOD</text>
              <text x={HUB.cx} y={HUB.cy + 1}
                textAnchor="middle"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="9" fontStyle="italic"
                fill="#F7F4EE" opacity="0.52">Why DA Students</text>
              <text x={HUB.cx} y={HUB.cy + 15}
                textAnchor="middle"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="9" fontStyle="italic"
                fill="#F7F4EE" opacity="0.52">Improve Faster</text>

              {/* ── Nodes ── */}
              {DA_STEPS.map(s => {
                const focused  = s.id === focusedId;
                const isActive = s.id === activeId;
                return (
                  <g
                    key={s.id}
                    transform={`translate(${s.cx},${s.cy})`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredId(s.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setActiveId(s.id)}
                  >
                    {/* Outer glow ring */}
                    <motion.circle
                      cx={0} cy={0} r={54}
                      fill="none" stroke="#D4AF37" strokeWidth="12"
                      animate={{ opacity: focused ? 0.08 : 0 }}
                      transition={{ duration: 0.30 }}
                    />
                    {/* Node body — spring-scales on focus */}
                    <motion.g
                      animate={{ scale: focused ? 1.13 : 1 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    >
                      <circle
                        cx={0} cy={0} r={38}
                        fill={isActive ? 'rgba(212,175,55,0.11)' : '#09162A'}
                        stroke="#D4AF37"
                        strokeWidth={focused ? 1.4 : 0.7}
                        style={{
                          transition: 'stroke-width 0.3s ease, fill 0.3s ease',
                          opacity: focused ? 1 : 0.52,
                        }}
                      />
                      <text x={0} y={-7}
                        textAnchor="middle" dominantBaseline="middle"
                        fontFamily="'Cormorant Garamond', Georgia, serif"
                        fontSize="11" fill="#D4AF37"
                        style={{ opacity: focused ? 0.95 : 0.42, transition: 'opacity 0.3s ease' }}
                      >{s.num}</text>
                      <text x={0} y={9}
                        textAnchor="middle" dominantBaseline="middle"
                        fontFamily="'DM Sans', sans-serif"
                        fontSize="9.5" fontWeight="600" fill="#F7F4EE"
                        style={{ opacity: focused ? 1 : 0.40, transition: 'opacity 0.3s ease' }}
                      >{s.node}</text>
                    </motion.g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ─── RIGHT: Detail panel ─── */}
          <div style={{ minHeight: '360px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -22 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {/* Ghost step number */}
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '5.5rem', fontWeight: 500, lineHeight: 1,
                  color: 'rgba(212,175,55,0.11)',
                  marginBottom: 0, userSelect: 'none' as const,
                }}>{activeStep.num}</p>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(1.75rem, 2.8vw, 2.6rem)',
                  fontWeight: 500, letterSpacing: '-0.022em',
                  lineHeight: 1.1, color: '#F7F4EE',
                  marginTop: '-6px', marginBottom: '18px',
                }}>{activeStep.title}</h3>

                {/* One-sentence summary */}
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.925rem', lineHeight: 1.78,
                  color: 'rgba(247,244,238,0.52)',
                  marginBottom: '28px',
                }}>{activeStep.sentence}</p>

                {/* Gold rule */}
                <div style={{
                  width: '36px', height: '1px',
                  background: 'rgba(212,175,55,0.38)',
                  marginBottom: '26px',
                }} />

                {/* Bullets */}
                <ul style={{
                  listStyle: 'none', padding: 0, margin: '0 0 32px',
                  display: 'flex', flexDirection: 'column' as const, gap: '13px',
                }}>
                  {activeStep.bullets.map((b, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '13px' }}>
                      <span style={{
                        width: '4px', height: '4px', borderRadius: '50%',
                        background: '#D4AF37',
                        marginTop: '9px', flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.875rem', lineHeight: 1.72,
                        color: 'rgba(247,244,238,0.70)',
                      }}>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Result */}
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.14)', paddingTop: '22px' }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.62rem', fontWeight: 700,
                    letterSpacing: '0.17em',
                    textTransform: 'uppercase' as const,
                    color: '#D4AF37', marginBottom: '7px',
                  }}>Result</p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.15rem', fontStyle: 'italic',
                    lineHeight: 1.55,
                    color: 'rgba(247,244,238,0.82)',
                    margin: 0,
                  }}>{activeStep.result}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DAMethodSection;
