import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import PlacementAssessment from '@/components/PlacementAssessment';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';

// ─── Palette & typography ──────────────────────────────────────────────────────
const C = {
  navy:       '#0A1B34',
  navyDark:   '#060F1E',
  gold:       '#D4AF37',
  cream:      '#F7F4EE',
  creamDeep:  '#EDE5D4',
  white:      '#FFFFFF',
  muted:      'rgba(10,27,52,0.52)',
  goldFaint:  'rgba(212,175,55,0.10)',
  goldDim:    'rgba(212,175,55,0.55)',
  goldBorder: 'rgba(212,175,55,0.22)',
  navyBorder: 'rgba(10,27,52,0.10)',
} as const;
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', 'Inter', sans-serif";
const wrap: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' };

const sectionLabel = (text: string): React.CSSProperties => ({
  fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
  color: C.gold, textTransform: 'uppercase',
});
const goldRule: React.CSSProperties = {
  width: 32, height: 1, background: C.gold, margin: '12px 0 20px',
};

// ─── Matching Engine ───────────────────────────────────────────────────────────
const ME_FACTORS = [
  'Academic Level', 'Confidence', 'Learning Habits', 'Goals',
  'School Performance', 'Motivation', 'Study Skills', 'Subject Strengths',
];

type PathwayId = 'small' | 'class' | 'foundation' | 'accelerated' | 'hsc';

const ME_PATHWAYS: Record<PathwayId, {
  label: string; sub: string; desc: string; outcomes: string[]; keyFactors: string[];
}> = {
  small: {
    label: 'Small Group Learning', sub: '3–5 students per group',
    desc: 'The teacher knows every student by name and challenge. Questions are expected — not exceptional. Progress is adapted in real time to the students in the room.',
    outcomes: ['Close Teacher Ratio', 'Confidence Building', 'Peer Learning'],
    keyFactors: ['Confidence', 'Learning Habits', 'Motivation', 'Goals'],
  },
  class: {
    label: 'Class Environment', sub: 'Structured, curriculum-paced sessions',
    desc: 'Built to mirror real school conditions. Regular timed practice, structured lesson delivery, and the productive pressure of working alongside motivated peers.',
    outcomes: ['Exam Preparation', 'Structured Routine', 'Competitive Setting'],
    keyFactors: ['Academic Level', 'Study Skills', 'Goals', 'School Performance'],
  },
  foundation: {
    label: 'Foundation Program', sub: 'Rebuilding from where understanding broke down',
    desc: 'Students work backwards to find where understanding actually broke down — then rebuild from there. The result is genuine comprehension, not surface-level revision.',
    outcomes: ['Gap Repair', 'Rebuilt Confidence', 'Academic Recovery'],
    keyFactors: ['Academic Level', 'School Performance', 'Confidence', 'Learning Habits'],
  },
  accelerated: {
    label: 'Accelerated Program', sub: 'Challenge-led learning for high performers',
    desc: 'Content pitched above year level for students who are ready. Peers are similarly advanced. The comparison motivates rather than discourages.',
    outcomes: ['Extension Content', 'High Performance', 'Selective Prep'],
    keyFactors: ['Academic Level', 'Subject Strengths', 'Goals', 'Motivation'],
  },
  hsc: {
    label: 'HSC Excellence', sub: 'Band 5–6 preparation for serious students',
    desc: 'Systematic HSC preparation: past paper analysis, marking criteria, exam technique, and structured revision across the year. Built around what the HSC actually rewards.',
    outcomes: ['Band 6 Focus', 'Exam Technique', 'ATAR Strategy'],
    keyFactors: ['Goals', 'Study Skills', 'Subject Strengths', 'School Performance'],
  },
};
const PATHWAY_ORDER: PathwayId[] = ['small', 'class', 'foundation', 'accelerated', 'hsc'];

function MatchingEngine() {
  const [active, setActive] = useState<PathwayId>('accelerated');
  const [hoveredFactor, setHoveredFactor] = useState<number | null>(null);
  const pathway = ME_PATHWAYS[active];
  const hf = hoveredFactor;
  const litPathways: PathwayId[] | null = hf !== null
    ? PATHWAY_ORDER.filter(id => ME_PATHWAYS[id].keyFactors.includes(ME_FACTORS[hf]))
    : null;

  const SVG_W = 860, SVG_H = 440;
  const IX = 156, OX = SVG_W - 156, HX = SVG_W / 2, HY = SVG_H / 2, HR = 54;
  const iy = ME_FACTORS.map((_, i) => 40 + i * (SVG_H - 80) / 7);
  const oy = PATHWAY_ORDER.map((_, i) => 56 + i * (SVG_H - 112) / 4);

  return (
    <section style={{ background: C.cream, padding: 'clamp(80px,10vw,130px) 0' }}>
      <div style={wrap}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={sectionLabel('The Assessment Process')}>The Assessment Process</p>
          <div style={{ ...goldRule, margin: '12px auto 20px' }} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: C.navy, lineHeight: 1.15, marginBottom: 16 }}>
            How We Decide What's Right<br /><em style={{ color: C.gold }}>For Your Child</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, maxWidth: 440, margin: '0 auto', lineHeight: 1.75 }}>
            Eight factors. Five pathways. One deliberate recommendation.
          </p>
        </div>

        {/* SVG */}
        <div style={{ overflowX: 'auto', marginBottom: 0 }}>
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: 'block', minWidth: 560 }}>
            {ME_FACTORS.map((f, i) => {
              const lit = pathway.keyFactors.includes(f) || hf === i;
              const cp = IX + (HX - IX) * 0.5;
              return (
                <path key={`ic-${i}`}
                  d={`M ${IX} ${iy[i]} C ${cp} ${iy[i]} ${cp} ${HY} ${HX - HR} ${HY}`}
                  fill="none" stroke={lit ? C.gold : 'rgba(10,27,52,0.07)'}
                  strokeWidth={lit ? 1.8 : 1}
                  style={{ transition: 'stroke 0.3s ease' } as React.CSSProperties} />
              );
            })}
            {PATHWAY_ORDER.map((pid, pi) => {
              const lit = active === pid || (litPathways ? litPathways.includes(pid) : false);
              const cp = HX + (OX - HX) * 0.5;
              return (
                <path key={`oc-${pi}`}
                  d={`M ${HX + HR} ${HY} C ${cp} ${HY} ${cp} ${oy[pi]} ${OX} ${oy[pi]}`}
                  fill="none" stroke={lit ? C.gold : 'rgba(10,27,52,0.07)'}
                  strokeWidth={lit ? 1.8 : 1}
                  style={{ transition: 'stroke 0.3s ease' } as React.CSSProperties} />
              );
            })}
            <circle cx={HX} cy={HY} r={HR} fill={C.navy} stroke={C.goldBorder} strokeWidth={1.5} />
            <text x={HX} y={HY - 12} textAnchor="middle" fontFamily={sans} fontSize={10} fontWeight={800} letterSpacing="0.18em" fill={C.gold}>DA</text>
            <text x={HX} y={HY + 4} textAnchor="middle" fontFamily={sans} fontSize={7} fill="rgba(255,255,255,0.4)" letterSpacing="0.14em">MATCHING</text>
            <text x={HX} y={HY + 17} textAnchor="middle" fontFamily={sans} fontSize={7} fill="rgba(255,255,255,0.4)" letterSpacing="0.14em">ENGINE</text>
            <text x={IX} y={14} textAnchor="middle" fontFamily={sans} fontSize={8} fontWeight={700} letterSpacing="0.16em" fill={C.muted}>ASSESSMENT</text>
            <text x={OX} y={14} textAnchor="middle" fontFamily={sans} fontSize={8} fontWeight={700} letterSpacing="0.16em" fill={C.muted}>RECOMMENDATION</text>
            {ME_FACTORS.map((f, i) => {
              const isKey = pathway.keyFactors.includes(f);
              const lit = isKey || hf === i;
              return (
                <g key={`if-${i}`} style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredFactor(i)}
                  onMouseLeave={() => setHoveredFactor(null)}>
                  <rect x={IX - 120} y={iy[i] - 13} width={120} height={26} fill="transparent" />
                  <circle cx={IX} cy={iy[i]} r={lit ? 5 : 3}
                    fill={lit ? C.gold : 'rgba(10,27,52,0.22)'}
                    style={{ transition: 'r 0.2s ease, fill 0.2s ease' } as React.CSSProperties} />
                  <text x={IX - 12} y={iy[i] + 4.5} textAnchor="end" fontFamily={sans}
                    fontSize={11} fontWeight={isKey ? 700 : 400}
                    fill={C.navy} opacity={lit ? 0.9 : 0.32}
                    style={{ transition: 'opacity 0.2s ease' } as React.CSSProperties}>{f}</text>
                </g>
              );
            })}
            {PATHWAY_ORDER.map((pid, pi) => {
              const isActive = active === pid;
              const lit = isActive || (litPathways ? litPathways.includes(pid) : false);
              return (
                <g key={`op-${pi}`} style={{ cursor: 'pointer' }} onClick={() => setActive(pid)}>
                  <rect x={OX} y={oy[pi] - 14} width={180} height={28} fill="transparent" />
                  <circle cx={OX} cy={oy[pi]} r={isActive ? 6 : lit ? 4 : 3}
                    fill={isActive ? C.gold : lit ? 'rgba(212,175,55,0.45)' : 'rgba(10,27,52,0.18)'}
                    style={{ transition: 'r 0.25s ease, fill 0.25s ease' } as React.CSSProperties} />
                  <text x={OX + 14} y={oy[pi] + 4.5} textAnchor="start" fontFamily={sans}
                    fontSize={11} fontWeight={isActive ? 700 : 400}
                    fill={C.navy} opacity={lit ? 0.9 : 0.28}
                    style={{ transition: 'opacity 0.2s ease' } as React.CSSProperties}>
                    {ME_PATHWAYS[pid].label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Recommendation card */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
            style={{ border: `1px solid ${C.navyBorder}`, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ background: C.white, padding: 'clamp(24px,3vw,40px)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
              <div>
                <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase' as const, marginBottom: 8 }}>Pathway Insight</p>
                <h3 style={{ fontFamily: serif, fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 400, color: C.navy, marginBottom: 6 }}>{pathway.label}</h3>
                <p style={{ fontFamily: serif, fontSize: 13, color: C.gold, fontStyle: 'italic', marginBottom: 12 }}>{pathway.sub}</p>
                <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 520 }}>{pathway.desc}</p>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 16 }}>
                <div>
                  <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: C.muted, textTransform: 'uppercase' as const, marginBottom: 10 }}>Key Outcomes</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
                    {pathway.outcomes.map(o => (
                      <span key={o} style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, padding: '4px 10px', background: C.cream, border: `1px solid ${C.navyBorder}`, color: C.navy, borderRadius: 2 }}>{o}</span>
                    ))}
                  </div>
                </div>
                <Link to="/book-interview">
                  <button style={{ padding: '10px 20px', background: C.navy, color: C.white, fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', border: 'none', borderRadius: 2, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                    Ask if this fits →
                  </button>
                </Link>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.navyBorder}`, background: C.cream, display: 'flex', overflowX: 'auto' as const }}>
              {PATHWAY_ORDER.map(pid => (
                <button key={pid} onClick={() => setActive(pid)} style={{
                  flex: 1, padding: '13px 8px', fontFamily: sans, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.09em', textTransform: 'uppercase' as const,
                  border: 'none', borderRight: `1px solid ${C.navyBorder}`,
                  background: active === pid ? C.navy : 'transparent',
                  color: active === pid ? C.white : C.muted,
                  cursor: 'pointer', transition: 'background 0.2s ease, color 0.2s ease',
                  whiteSpace: 'nowrap' as const, minWidth: 0,
                }}>
                  {ME_PATHWAYS[pid].label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Case Studies ──────────────────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    id: 'CASE 01', archetype: 'The Quiet Student', year: 'Year 9 · English',
    situation: 'Understood the material well. Shut down completely in class.',
    happening: 'Not a knowledge problem — a confidence problem. In a smaller group, the same student was volunteering answers within the first session.',
    recommendation: 'Small Group Learning',
    outcome: 'Active class participation within two terms. English moved from a C to a B+.',
  },
  {
    id: 'CASE 02', archetype: 'The High Achiever', year: 'Year 8 · Mathematics',
    situation: 'Top of class. Increasingly disengaged. Work had stopped being challenging.',
    happening: 'No intellectual stretch. Performing well without effort — which meant nothing felt at stake.',
    recommendation: 'Accelerated Program',
    outcome: 'Completed Year 9 content ahead of schedule. Achieved a Band 6 in HSC Mathematics Extension 1.',
  },
  {
    id: 'CASE 03', archetype: 'The Inconsistent Student', year: 'Year 11 · Multiple Subjects',
    situation: 'Strong ability. Results varied significantly week to week.',
    happening: 'Poor study habits and absence of external accountability. Capable — but untethered.',
    recommendation: 'Carefully Matched Teacher',
    outcome: 'Built consistent routines within a term. Results stabilised. Confidence followed.',
  },
  {
    id: 'CASE 04', archetype: 'The Student Who Has Fallen Behind', year: 'Year 8 · Mathematics',
    situation: 'Year 8 student with Year 5-level comprehension. Three years of unaddressed gaps.',
    happening: 'The school kept moving forward. The student kept falling further behind. The gaps compounded.',
    recommendation: 'Foundation Program',
    outcome: 'Transitioned to year-level work after 18 months. Achieving above class average by Year 10.',
  },
];

function CaseStudiesSlider() {
  const [active, setActive] = useState(0);
  const cs = CASE_STUDIES[active];
  return (
    <section style={{ background: C.navyDark, padding: 'clamp(80px,10vw,130px) 0' }}>
      <div style={wrap}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 12 }}>Student Profiles</p>
          <div style={{ width: 32, height: 1, background: C.goldBorder, margin: '0 auto 20px' }} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: C.white, lineHeight: 1.15, marginBottom: 10 }}>
            Four Students.<br /><em style={{ color: C.gold }}>Four Different Needs.</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 14, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>No two students require the same environment.</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderRadius: 4, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.08)` }}>
          {CASE_STUDIES.map((cs2, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              flex: 1, padding: '12px 8px', border: 'none',
              background: active === i ? 'rgba(255,255,255,0.06)' : 'transparent',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              cursor: 'pointer',
            }}>
              <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: active === i ? C.gold : 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const, marginBottom: 3 }}>{cs2.id}</p>
              <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, color: active === i ? C.white : 'rgba(255,255,255,0.38)', lineHeight: 1.3 }}>{cs2.archetype}</p>
            </button>
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            <div style={{ background: 'rgba(255,255,255,0.035)', border: `1px solid rgba(212,175,55,0.10)`, borderRadius: 4, padding: 'clamp(28px,4vw,48px)', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'clamp(24px,4vw,56px)' }}>
              <div>
                <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 14 }}>{cs.id} · {cs.year}</p>
                <h3 style={{ fontFamily: serif, fontSize: 'clamp(28px,3.5vw,42px)', fontStyle: 'italic', fontWeight: 400, color: C.white, lineHeight: 1.2, marginBottom: 16 }}>{cs.archetype}</h3>
                <div style={{ width: 40, height: 1, background: C.goldBorder, marginBottom: 16 }} />
                <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase' as const, marginBottom: 8 }}>Current Situation</p>
                <p style={{ fontFamily: serif, fontSize: 15, fontStyle: 'italic', fontWeight: 600, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{cs.situation}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 24 }}>
                <div style={{ paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase' as const, marginBottom: 8 }}>What Was Really Happening</p>
                  <p style={{ fontFamily: sans, fontSize: 13, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75 }}>{cs.happening}</p>
                </div>
                <div style={{ paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase' as const, marginBottom: 8 }}>DA Recommendation</p>
                  <p style={{ fontFamily: serif, fontSize: 20, fontStyle: 'italic', color: C.gold, lineHeight: 1.4 }}>{cs.recommendation}</p>
                </div>
                <div>
                  <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase' as const, marginBottom: 8 }}>Outcome</p>
                  <p style={{ fontFamily: sans, fontSize: 13, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75 }}>{cs.outcome}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Pathways Accordion ────────────────────────────────────────────────────────
const PATHWAYS_LIST = [
  {
    n: '01', label: 'Small Group Learning', sub: '3–5 students per group',
    bestFor: 'Confidence, support, closing gaps',
    about: 'Small groups create the conditions for every student to be known — by name, by challenge, and by progress. Questions are expected, not exceptional. The teacher adjusts in real time.',
    idealFor: 'Students building confidence, students with targeted gaps, and learners who thrive with closer teacher attention than a class environment provides.',
    outcomes: ['Personalised Attention', 'Confidence Building', 'Peer Learning'],
  },
  {
    n: '02', label: 'Class Environment', sub: 'Structured, curriculum-paced sessions',
    bestFor: 'Structure, exam preparation',
    about: 'Designed to simulate real school conditions. Students work through problems independently and collectively, building the stamina and composure required in assessments.',
    idealFor: 'Students with a solid foundation who benefit from exam simulation, consistent structure, and the energy of working alongside motivated peers.',
    outcomes: ['Exam Preparation', 'Structured Routine', 'Competitive Drive'],
  },
  {
    n: '03', label: 'Foundation Program', sub: 'Rebuilding from where learning broke down',
    bestFor: 'Students rebuilding foundations',
    about: 'Not designed around this week\'s syllabus topic. Foundation students work backwards to identify where understanding actually broke down — then rebuild from there. The result is genuine comprehension, not patch-ups that unravel under exam conditions.',
    idealFor: 'Students with accumulated gaps, students overwhelmed by the pace of school, or those who have lost confidence due to falling behind.',
    outcomes: ['Gap Repair', 'Rebuilt Confidence', 'Academic Recovery'],
  },
  {
    n: '04', label: 'Accelerated Program', sub: 'Challenge-led learning for high performers',
    bestFor: 'High achievers seeking challenge',
    about: 'Extension content and intellectual challenge for students already ahead of their year group. Content goes deeper, not just faster. Peers are similarly advanced — the comparison drives rather than discourages.',
    idealFor: 'High-achieving students seeking selective school preparation, scholarship pathways, or early engagement with senior curriculum content.',
    outcomes: ['Extension Content', 'High Performance', 'Selective Prep'],
  },
  {
    n: '05', label: 'HSC Excellence', sub: 'Band 5–6 preparation for serious students',
    bestFor: 'Students targeting Band 5–6 results',
    about: 'Systematic preparation for the final two years of school. Past paper analysis, marking criteria, exam technique, and structured revision planning — built around what the HSC actually rewards.',
    idealFor: 'Year 11 and 12 students with a specific ATAR target who want to approach the HSC with strategic seriousness.',
    outcomes: ['Band 6 Focus', 'Exam Technique', 'ATAR Strategy'],
  },
];

function PathwaysAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ background: C.cream, padding: 'clamp(64px,8vw,100px) 0' }}>
      <div style={wrap}>
        <div style={{ marginBottom: 52 }}>
          <p style={sectionLabel('')}>Five Pathways</p>
          <div style={goldRule} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: C.navy, lineHeight: 1.15, marginBottom: 16 }}>
            The Formats We Offer<br /><em style={{ color: C.gold }}>And Who They're For</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, maxWidth: 480, lineHeight: 1.75 }}>
            Each format exists for a specific type of student. Tap any pathway to read more.
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${C.navyBorder}` }}>
          {PATHWAYS_LIST.map((p, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '22px 0', display: 'flex', alignItems: 'flex-start', gap: 20, textAlign: 'left' as const }}
              >
                <span style={{ fontFamily: serif, fontSize: 14, color: open === i ? C.gold : C.muted, fontStyle: 'italic', minWidth: 28, flexShrink: 0, paddingTop: 2 }}>{p.n}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: sans, fontSize: 'clamp(15px,2vw,18px)', fontWeight: 700, color: C.navy, display: 'block', marginBottom: 2 }}>{p.label}</span>
                  <span style={{ fontFamily: sans, fontSize: 12, color: open === i ? C.muted : 'rgba(10,27,52,0.38)', display: 'block', marginBottom: 4 }}>{p.sub}</span>
                  <span style={{ fontFamily: sans, fontSize: 11, color: C.gold, fontWeight: 600 }}>Best for: {p.bestFor}</span>
                </div>
                <span style={{ fontFamily: sans, fontSize: 22, color: open === i ? C.gold : C.muted, fontWeight: 300, flexShrink: 0, lineHeight: 1 }}>{open === i ? '×' : '+'}</span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingBottom: 32, paddingLeft: 48, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
                      <div>
                        <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 10 }}>About This Format</p>
                        <p style={{ fontFamily: sans, fontSize: 13, color: C.navy, lineHeight: 1.8, marginBottom: 20 }}>{p.about}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                          {p.outcomes.map(o => (
                            <span key={o} style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, padding: '4px 10px', background: C.creamDeep, border: `1px solid ${C.navyBorder}`, color: C.navy, borderRadius: 2 }}>{o}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ background: C.creamDeep, borderRadius: 3, padding: '20px 24px' }}>
                        <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 10 }}>Ideal For</p>
                        <p style={{ fontFamily: serif, fontSize: 15, fontStyle: 'italic', color: C.navy, lineHeight: 1.7 }}>{p.idealFor}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Comparison Panels ─────────────────────────────────────────────────────────
const SMALL_POINTS = [
  '3–5 students per group',
  'Every student is known personally',
  'High teacher interaction throughout',
  'Questions encouraged at all times',
  'Strong confidence-building environment',
  'Closes learning gaps effectively',
  'Pace adapts to the students in the room',
];
const CLASS_POINTS = [
  'Larger, structured class setting',
  'Curriculum-paced lessons',
  'Independent learning expected',
  'Healthy academic competition',
  'Strong exam preparation',
  'Exposure to a wider range of problems',
  'Students learn alongside ambitious peers',
];

function ComparisonTable() {
  return (
    <section style={{ background: C.cream, padding: 'clamp(80px,10vw,130px) 0' }}>
      <div style={wrap}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={sectionLabel('')}>Format Comparison</p>
          <div style={{ ...goldRule, margin: '12px auto 20px' }} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: C.navy, lineHeight: 1.1, marginBottom: 16 }}>
            Small Group Learning<br />
            <em style={{ color: C.gold }}>vs Class Environment</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
            Two excellent options. Designed for different students.
          </p>
        </div>

        {/* Two panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px,3vw,32px)', marginBottom: 40 }}>
          {/* Small Group panel */}
          <div style={{ background: C.navy, borderRadius: 4, padding: 'clamp(32px,4vw,52px)', display: 'flex', flexDirection: 'column' as const }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 10 }}>
                Small Group Learning
              </p>
              <p style={{ fontFamily: serif, fontSize: 'clamp(32px,4vw,48px)', fontWeight: 400, color: C.white, lineHeight: 1.1 }}>3–5</p>
              <p style={{ fontFamily: sans, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 4, letterSpacing: '0.06em' }}>students per group</p>
            </div>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column' as const, gap: 14, flex: 1 }}>
              {SMALL_POINTS.map(pt => (
                <li key={pt} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: sans, fontSize: 13, color: 'rgba(255,255,255,0.70)', lineHeight: 1.6 }}>{pt}</span>
                </li>
              ))}
            </ul>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 8 }}>
                Best Suited For
              </p>
              <p style={{ fontFamily: serif, fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                Students needing support, confidence, accountability or targeted improvement
              </p>
            </div>
          </div>

          {/* Class Environment panel */}
          <div style={{ background: C.creamDeep, borderRadius: 4, padding: 'clamp(32px,4vw,52px)', display: 'flex', flexDirection: 'column' as const, border: `1px solid ${C.navyBorder}` }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase' as const, marginBottom: 10 }}>
                Class Environment
              </p>
              <p style={{ fontFamily: serif, fontSize: 'clamp(32px,4vw,48px)', fontWeight: 400, color: C.navy, lineHeight: 1.1 }}>Structured</p>
              <p style={{ fontFamily: sans, fontSize: 12, color: C.muted, marginTop: 4, letterSpacing: '0.06em' }}>curriculum-paced sessions</p>
            </div>
            <div style={{ width: '100%', height: 1, background: C.navyBorder, marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column' as const, gap: 14, flex: 1 }}>
              {CLASS_POINTS.map(pt => (
                <li key={pt} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.muted, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{pt}</span>
                </li>
              ))}
            </ul>
            <div style={{ borderTop: `1px solid ${C.navyBorder}`, paddingTop: 24 }}>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' as const, marginBottom: 8 }}>
                Best Suited For
              </p>
              <p style={{ fontFamily: serif, fontSize: 15, fontStyle: 'italic', color: C.navy, lineHeight: 1.6 }}>
                Students seeking structure, challenge and exam-focused preparation
              </p>
            </div>
          </div>
        </div>

        {/* Footer note + bridge */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, fontStyle: 'italic', marginBottom: 28 }}>
            There is no universally better option. The right environment depends on the student.
          </p>
          <div style={{ width: 1, height: 40, background: C.navyBorder, margin: '0 auto 20px' }} />
          <p style={{ fontFamily: serif, fontSize: 'clamp(16px,2vw,20px)', color: C.navy, fontStyle: 'italic' }}>
            Still not sure which environment suits your child?<br />
            <em style={{ color: C.gold }}>Let's find out.</em>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Why Parents Trust ─────────────────────────────────────────────────────────
function WhyParentsTrust() {
  const principles = [
    {
      n: '01', h: 'We assess before recommending',
      b: "Every student undergoes a structured intake evaluation — a deliberate review of academic standing, learning patterns, confidence, and goals. A recommendation without this process is a guess. We do not make guesses about a student's education.",
    },
    {
      n: '02', h: 'We prioritise fit over enrolment numbers',
      b: 'DA operates with limited places in each group by design. We will delay an enrolment, or redirect a family to a more suitable service, if the fit is not right. A student placed incorrectly receives no benefit — and we hold ourselves accountable for that outcome.',
    },
    {
      n: '03', h: 'We review placement continuously',
      b: 'Placement is reviewed formally each term and informally through teacher observation. If a student has outgrown their group — or if a different environment would better serve their needs — we initiate that conversation directly. We do not wait to be asked.',
    },
    {
      n: '04', h: 'We match teachers intentionally',
      b: "Every teacher carries a distinct profile — subject specialty, teaching approach, experience with specific student types, and how they build rapport. Placement into a group is always paired with a deliberate teacher match, reviewed against the student's profile before the first session.",
    },
    {
      n: '05', h: 'We adapt when student needs change',
      b: "A student's needs at Year 7 are rarely the same at Year 10, or in the final stretch of the HSC. DA's structure accommodates this progression — students move between formats and teachers as their profile evolves, without having to start over.",
    },
  ];

  return (
    <section style={{ background: C.creamDeep, padding: 'clamp(64px,8vw,100px) 0' }}>
      <div style={wrap}>
        <div style={{ marginBottom: 56 }}>
          <p style={sectionLabel('')}>Placement Philosophy</p>
          <div style={goldRule} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: C.navy, lineHeight: 1.2, marginBottom: 16 }}>
            Why Parents Trust<br /><em style={{ color: C.gold }}>DA's Placement Process</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, maxWidth: 500, lineHeight: 1.75 }}>
            Placement at DA Tuition is a structured process, not an opinion. Five principles govern every enrolment decision we make.
          </p>
        </div>

        {principles.map(({ n, h, b }) => (
          <div key={n} style={{ borderTop: `1px solid ${C.navyBorder}`, padding: '28px 0', display: 'grid', gridTemplateColumns: 'clamp(160px,22%,220px) 1fr', gap: 'clamp(24px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: serif, fontSize: 13, color: C.gold, letterSpacing: '0.06em', marginBottom: 10 }}>{n}</p>
              <h3 style={{ fontFamily: sans, fontSize: 'clamp(13px,1.4vw,15px)', fontWeight: 600, color: C.navy, lineHeight: 1.45 }}>{h}</h3>
            </div>
            <p style={{ fontFamily: sans, fontSize: 14, color: 'rgba(10,27,52,0.65)', lineHeight: 1.82 }}>{b}</p>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.navyBorder}`, paddingTop: 28 }}>
          <p style={{ fontFamily: sans, fontSize: 12, color: 'rgba(10,27,52,0.32)', fontStyle: 'italic' }}>
            These principles apply to every student, regardless of year group, subject, or program.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
const LearningFormats = () => {
  return (
    <div className="min-h-screen" style={{ background: C.cream }}>
      <SEO
        title="Learning Formats — DA Tuition"
        description="Small groups, classes, Foundation, Accelerated, and HSC programs. We assess every student before recommending a learning environment."
        canonicalUrl="/learning-formats"
      />
      <NavigationNew />

      {/* 1. Hero */}
      <section style={{ background: C.navy, padding: 'clamp(140px,16vw,200px) 0 clamp(100px,12vw,150px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 16 }}>Learning Formats</p>
          <div style={{ width: 32, height: 1, background: C.goldBorder, margin: '0 auto 28px' }} />
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(36px,7vw,80px)', fontWeight: 400, color: C.white, lineHeight: 1.08, marginBottom: 20 }}>
            Every Student<br />Learns Differently.
          </h1>
          <p style={{ fontFamily: serif, fontSize: 'clamp(18px,2.5vw,28px)', fontStyle: 'italic', color: C.gold, lineHeight: 1.35 }}>
            So Every Student Needs A Different Pathway.
          </p>
        </div>
      </section>

      {/* 2. Matching Engine */}
      <MatchingEngine />

      {/* 3. Student Archetypes */}
      <CaseStudiesSlider />

      {/* 4. Comparison */}
      <ComparisonTable />

      {/* 5 & 6. Placement Assessment + Results */}
      <PlacementAssessment />

      {/* 6. CTA */}
      <section style={{ background: C.navy, padding: 'clamp(80px,10vw,130px) 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: 16 }}>Next Step</p>
          <div style={{ width: 32, height: 1, background: C.goldBorder, margin: '0 auto 28px' }} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,5vw,52px)', fontWeight: 400, color: C.white, lineHeight: 1.15, marginBottom: 16 }}>
            Ready to Find the Right<br /><em style={{ color: C.gold }}>Environment For Your Child?</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: 'rgba(255,255,255,0.48)', marginBottom: 36, lineHeight: 1.75 }}>
            The first step is a conversation. We sit down with you, understand your child, and tell you honestly what we think is right.
          </p>
          <Link to="/book-interview">
            <button style={{ padding: '14px 36px', background: 'transparent', border: `1.5px solid ${C.gold}`, color: C.gold, fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, borderRadius: 2, cursor: 'pointer' }}>
              Book an Interview
            </button>
          </Link>
          <p style={{ fontFamily: sans, fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 16 }}>No commitment required. Just a conversation.</p>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default LearningFormats;
