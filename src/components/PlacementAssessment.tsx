import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// ─── Palette & typography ──────────────────────────────────────────────────────
const C = {
  navy:       '#0A1B34',
  gold:       '#D4AF37',
  cream:      '#F7F4EE',
  creamDeep:  '#EDE5D4',
  white:      '#FFFFFF',
  muted:      'rgba(10,27,52,0.52)',
  goldBorder: 'rgba(212,175,55,0.22)',
  navyBorder: 'rgba(10,27,52,0.10)',
} as const;
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', 'Inter', sans-serif";

type ProgramId = 'small' | 'class' | 'foundation' | 'accelerated' | 'hsc';

// ─── Questions ─────────────────────────────────────────────────────────────────
const PA_QUESTIONS: {
  section: string;
  q: string;
  options: { label: string; scores: Partial<Record<ProgramId, number>> }[];
}[] = [
  {
    section: 'Academic Level',
    q: "How would you describe your child's current academic standing relative to their year group?",
    options: [
      { label: 'Noticeably behind — there are clear gaps to address', scores: { foundation: 3, small: 2 } },
      { label: 'Roughly on track with occasional gaps', scores: { small: 3, class: 1 } },
      { label: 'On track or slightly ahead in most areas', scores: { class: 3, small: 1 } },
      { label: 'Significantly ahead — working beyond year level', scores: { accelerated: 3, hsc: 2 } },
    ],
  },
  {
    section: 'Academic Level',
    q: "How has your child's academic performance trended over the past year?",
    options: [
      { label: 'Declining — results have dropped noticeably', scores: { foundation: 3, small: 2 } },
      { label: 'Inconsistent — variable from term to term', scores: { small: 3, foundation: 1 } },
      { label: 'Stable with gradual improvement', scores: { class: 2, small: 2 } },
      { label: 'Consistently strong or actively improving', scores: { accelerated: 2, hsc: 2, class: 2 } },
    ],
  },
  {
    section: 'Confidence',
    q: 'When your child encounters a difficult question in class, they typically…',
    options: [
      { label: 'Withdraw and wait for it to pass', scores: { foundation: 3, small: 2 } },
      { label: 'Ask a teacher quietly one-on-one afterward', scores: { small: 3 } },
      { label: 'Attempt it but hesitate to share their thinking', scores: { small: 2, class: 2 } },
      { label: 'Engage actively — they enjoy the challenge', scores: { class: 3, accelerated: 2 } },
    ],
  },
  {
    section: 'Confidence',
    q: 'How does your child respond to academic mistakes or setbacks?',
    options: [
      { label: 'Becomes discouraged and reluctant to try again', scores: { foundation: 3, small: 2 } },
      { label: 'Needs significant reassurance to continue', scores: { small: 3, foundation: 1 } },
      { label: 'Recovers with some adult support', scores: { small: 2, class: 2 } },
      { label: 'Treats mistakes as part of the learning process', scores: { class: 2, accelerated: 3, hsc: 2 } },
    ],
  },
  {
    section: 'Learning Habits',
    q: "Describe your child's independent study habits at home.",
    options: [
      { label: 'Rarely studies without direct prompting', scores: { foundation: 3, small: 2 } },
      { label: 'Studies but requires frequent reminders', scores: { small: 3, foundation: 1 } },
      { label: 'Has a loose routine that is sometimes inconsistent', scores: { class: 2, small: 2 } },
      { label: 'Self-directed — follows a consistent routine independently', scores: { accelerated: 3, hsc: 3 } },
    ],
  },
  {
    section: 'Learning Habits',
    q: 'How does your child typically approach homework completion?',
    options: [
      { label: 'Often leaves it incomplete or avoids it', scores: { foundation: 3, small: 1 } },
      { label: 'Completes the minimum with little extra effort', scores: { small: 3, foundation: 1 } },
      { label: 'Completes work reliably and to a reasonable standard', scores: { class: 3, small: 1 } },
      { label: 'Consistently goes beyond what is required', scores: { accelerated: 3, hsc: 2 } },
    ],
  },
  {
    section: 'Goals',
    q: 'What is your primary goal in seeking tutoring support right now?',
    options: [
      { label: 'Build confidence and address foundational gaps', scores: { foundation: 3, small: 2 } },
      { label: 'Improve overall grades and consistency', scores: { small: 3, class: 2 } },
      { label: 'Prepare thoroughly for assessments and exams', scores: { class: 3, hsc: 2 } },
      { label: 'Achieve top-tier results and academic acceleration', scores: { accelerated: 3, hsc: 3 } },
    ],
  },
  {
    section: 'Goals',
    q: 'Looking ahead, what matters most to your child personally?',
    options: [
      { label: 'Feeling less anxious and more capable at school', scores: { foundation: 3, small: 2 } },
      { label: 'Passing assessments with confidence', scores: { small: 3, class: 2 } },
      { label: 'Competing for a strong ATAR or selective placement', scores: { class: 2, hsc: 3 } },
      { label: 'University entry and long-term career pathway', scores: { hsc: 3, accelerated: 2 } },
    ],
  },
  {
    section: 'School Performance',
    q: "What have your child's school reports shown over the past two terms?",
    options: [
      { label: 'Results significantly below expectations or year average', scores: { foundation: 3, small: 2 } },
      { label: 'Mixed — strong in some subjects, struggling in others', scores: { small: 3, foundation: 1 } },
      { label: 'Mostly satisfactory with room to improve', scores: { class: 2, small: 2 } },
      { label: 'Strong results across most or all subject areas', scores: { accelerated: 3, hsc: 2 } },
    ],
  },
  {
    section: 'School Performance',
    q: "How do your child's teachers describe their classroom engagement?",
    options: [
      { label: 'Disengaged or frequently struggles to follow the lesson', scores: { foundation: 3, small: 2 } },
      { label: 'Participates when prompted but rarely volunteers', scores: { small: 3 } },
      { label: 'Actively engaged and contributes regularly', scores: { class: 3, small: 1 } },
      { label: 'Highly engaged — often leads discussion or asks advanced questions', scores: { accelerated: 3, hsc: 2 } },
    ],
  },
  {
    section: 'Motivation',
    q: "What best describes your child's overall attitude toward academic learning?",
    options: [
      { label: 'Resistant — school often feels like a burden', scores: { foundation: 3, small: 2 } },
      { label: 'Compliant but not particularly enthusiastic', scores: { small: 3, foundation: 1 } },
      { label: 'Motivated when the subject is engaging or relevant', scores: { class: 2, small: 2 } },
      { label: 'Intrinsically driven — self-motivated to achieve', scores: { accelerated: 3, hsc: 3 } },
    ],
  },
  {
    section: 'Motivation',
    q: 'When your child succeeds academically, what tends to drive that success?',
    options: [
      { label: 'External reward or a desire to avoid trouble', scores: { foundation: 2, small: 2 } },
      { label: 'Meeting parental expectations', scores: { small: 3, class: 1 } },
      { label: 'Personal satisfaction and sense of achievement', scores: { class: 3, accelerated: 2 } },
      { label: 'Ambition toward specific future goals', scores: { hsc: 3, accelerated: 3 } },
    ],
  },
  {
    section: 'Study Skills',
    q: "How effectively does your child organise their study time and materials?",
    options: [
      { label: 'Poorly — often loses track of tasks and deadlines', scores: { foundation: 3, small: 2 } },
      { label: 'Manages with significant parental or adult support', scores: { small: 3, foundation: 1 } },
      { label: 'Has basic organisation but applies it inconsistently', scores: { class: 2, small: 2 } },
      { label: 'Organised and largely self-managing', scores: { accelerated: 3, hsc: 3 } },
    ],
  },
  {
    section: 'Study Skills',
    q: 'When preparing for a test or assessment, your child typically…',
    options: [
      { label: 'Studies last-minute without a clear structure', scores: { foundation: 3, small: 2 } },
      { label: 'Reviews notes but lacks an effective revision strategy', scores: { small: 3, class: 1 } },
      { label: "Has a study plan but doesn't always follow through", scores: { class: 3, small: 1 } },
      { label: 'Follows a structured, multi-week revision schedule', scores: { hsc: 3, accelerated: 2 } },
    ],
  },
  {
    section: 'Subject Strengths',
    q: "Which best describes your child's subject profile?",
    options: [
      { label: 'Struggles across most subjects — broad gaps to address', scores: { foundation: 3, small: 1 } },
      { label: 'Stronger in some areas, noticeably weaker in others', scores: { small: 3, class: 1 } },
      { label: 'Solid across the board with no significant weak areas', scores: { class: 3, accelerated: 1 } },
      { label: 'Excels in specific subjects — potential for distinction-level work', scores: { accelerated: 3, hsc: 2 } },
    ],
  },
];

// ─── Pathway result data ───────────────────────────────────────────────────────
const PA_RESULTS: Record<ProgramId, {
  name: string;
  sub: string;
  why: string[];
  context: string;
  note: string;
}> = {
  foundation: {
    name: 'Foundation Support Program',
    sub: 'Targeted gap-repair in a highly supported environment',
    why: [
      'Smallest group sizes (2–3 students) for maximum individual attention',
      'Deliberate pacing designed to rebuild foundational understanding',
      'Confidence-building integrated into every session',
      'Frequent, low-stakes assessment to track and reinforce progress',
    ],
    context: "Your responses suggest a student who may benefit from a highly personalised setting where the pace is calibrated specifically to their current level. The Foundation Support Program works with the smallest group sizes — typically 2 to 3 students — allowing the teacher to identify and systematically address gaps in foundational knowledge while actively rebuilding confidence.",
    note: 'Students who begin in Foundation Support often transition to Small Group Learning once confidence and momentum are established.',
  },
  small: {
    name: 'Small Group Learning',
    sub: 'Personalised attention within a collaborative peer environment',
    why: [
      'Groups of 3–5 students — every student is known by name and challenge',
      'Questions are expected, not exceptional',
      'Peer learning normalises discussion and reduces academic anxiety',
      'Approach adapts as the student develops',
    ],
    context: "Your responses suggest a student who is likely to thrive in a learning environment that balances individual attention with the social dynamics of a small peer group. This profile points toward a student who needs more than a classroom — but less than an intensive one-on-one intervention.",
    note: 'Small Group Learning is appropriate across a wide range of student profiles. Many students remain in this format throughout; others transition to a class environment as their confidence builds.',
  },
  class: {
    name: 'Class-Based Environment',
    sub: 'Exam-ready, structured, and built for competitive preparation',
    why: [
      'Structured lessons that mirror real school and exam environments',
      'Regular timed practice builds competence and composure under pressure',
      'Exposure to diverse problem-solving approaches from motivated peers',
      'Appropriate for students with a solid foundation across Years 7–12',
    ],
    context: "Your responses suggest a student who is academically on track and likely to benefit from the structure and energy of a more formal class setting. Class-based learning at DA Tuition is designed to simulate the conditions students will face in school assessments and the HSC — timed practice, structured lesson delivery, and the productive pressure of working alongside peers.",
    note: 'Some students thrive from their first session in a class environment. Others benefit from a brief period in small group first. Our team will discuss this at the interview.',
  },
  accelerated: {
    name: 'Accelerated Program',
    sub: 'Advanced curriculum and high-achieving peers',
    why: [
      'Curriculum pitched above year level — going deeper, not just faster',
      'Peers who are similarly advanced — comparison motivates',
      'Extension problem sets and analytical tasks beyond the standard curriculum',
      'Preparation for selective school, scholarship, and tertiary pathways',
    ],
    context: "Your responses suggest a student performing above their year level who is ready for material and intellectual challenge beyond the standard curriculum. The Accelerated Program places students with similarly advanced peers, working through extension content, advanced problem-solving, and high-level analytical work.",
    note: 'Entry into the Accelerated Program is confirmed at the interview stage after our team has assessed the student directly.',
  },
  hsc: {
    name: 'HSC Intensive Program',
    sub: 'Strategic preparation for high-stakes final year assessment',
    why: [
      'HSC-specific content, question types, and marking criteria focus',
      'Past paper analysis with worked solutions and examiner commentary',
      'Systematic preparation structured across the full year',
      'Guidance on time management, study planning, and exam strategy',
    ],
    context: "Your responses suggest a student with clear academic goals, strong self-direction, and a focus on HSC outcomes. The HSC Intensive Program is built specifically around the demands of the final two years of schooling — structured revision, past paper analysis, marking criteria, and exam technique.",
    note: 'The HSC Intensive Program is available for Years 11 and 12. For younger students with a similar profile, the Accelerated Program is the more appropriate starting point.',
  },
};

// ─── Snapshot and strengths/areas derivation ──────────────────────────────────
const SNAPSHOT_LABELS: Record<string, string[]> = {
  'Academic Level':    ['Below expectations', 'Roughly on track', 'On track / ahead', 'Significantly advanced'],
  'Confidence':        ['Needs rebuilding', 'Building gradually', 'Moderate and growing', 'High and self-assured'],
  'Learning Habits':   ['Inconsistent', 'Developing', 'Building consistency', 'Structured and reliable'],
  'Primary Goal':      ['Rebuild confidence', 'Grade improvement', 'Exam preparation', 'Top-tier results'],
};

function getSnapshot(answers: Record<number, number>) {
  return [
    { label: 'Academic Level',  value: SNAPSHOT_LABELS['Academic Level'][answers[0] ?? 1] },
    { label: 'Confidence',      value: SNAPSHOT_LABELS['Confidence'][answers[2] ?? 1] },
    { label: 'Learning Habits', value: SNAPSHOT_LABELS['Learning Habits'][answers[4] ?? 1] },
    { label: 'Primary Goal',    value: SNAPSHOT_LABELS['Primary Goal'][answers[6] ?? 1] },
  ];
}

function getStrengths(answers: Record<number, number>): string[] {
  const s: string[] = [];
  if ((answers[0] ?? 1) >= 2) s.push('Academic performance at or above year-level expectations');
  if ((answers[2] ?? 1) >= 2) s.push('Engages actively and recovers well from academic setbacks');
  if ((answers[4] ?? 1) >= 2) s.push('Established independent study routines at home');
  if ((answers[6] ?? 1) >= 2) s.push('Clear academic goals and personal motivation');
  if ((answers[8] ?? 1) >= 2) s.push('Positive school-based performance indicators');
  if ((answers[10] ?? 1) >= 2) s.push('Strong internal drive toward learning');
  if ((answers[12] ?? 1) >= 2) s.push('Organised approach to study and revision');
  if ((answers[14] ?? 1) >= 2) s.push('Strong subject profile across key areas');
  return s.length > 0 ? s : ['Enrolled and seeking support — a meaningful first step'];
}

function getAreas(answers: Record<number, number>): string[] {
  const a: string[] = [];
  if ((answers[0] ?? 1) <= 1) a.push('Foundation knowledge requires targeted attention');
  if ((answers[2] ?? 1) <= 1) a.push('Academic confidence and willingness to engage in class');
  if ((answers[4] ?? 1) <= 1) a.push('Independent study habits and consistency at home');
  if ((answers[6] ?? 1) <= 1) a.push('Clarity of academic goals and direction');
  if ((answers[8] ?? 1) <= 1) a.push('School-based performance and assessment results');
  if ((answers[10] ?? 1) <= 1) a.push('Motivation and engagement in academic contexts');
  if ((answers[12] ?? 1) <= 1) a.push('Study organisation and exam preparation strategy');
  if ((answers[14] ?? 1) <= 1) a.push('Subject consistency and breadth of knowledge');
  return a;
}

function computeResult(answers: Record<number, number>): { primary: ProgramId; others: ProgramId[] } {
  const scores: Record<ProgramId, number> = { small: 0, class: 0, foundation: 0, accelerated: 0, hsc: 0 };
  PA_QUESTIONS.forEach((q, qi) => {
    const ai = answers[qi];
    if (ai === undefined) return;
    const opt = q.options[ai];
    if (!opt) return;
    (Object.entries(opt.scores) as [ProgramId, number][]).forEach(([id, val]) => { scores[id] += val; });
  });
  const sorted = (Object.entries(scores) as [ProgramId, number][]).sort((a, b) => b[1] - a[1]);
  return {
    primary: sorted[0][0],
    others: sorted.slice(1, 3).map(([id]) => id),
  };
}

const PATHWAY_NAMES: Record<ProgramId, string> = {
  small: 'Small Group Learning',
  class: 'Class Environment',
  foundation: 'Foundation Program',
  accelerated: 'Accelerated Program',
  hsc: 'HSC Excellence',
};

const PATHWAY_SUBS: Record<ProgramId, string> = {
  small: '3–5 students per group',
  class: 'Structured, curriculum-paced sessions',
  foundation: 'Rebuilding from where learning broke down',
  accelerated: 'Challenge-led for high performers',
  hsc: 'Band 5–6 preparation',
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function PlacementAssessment() {
  const [phase,   setPhase]   = useState<'intro' | 'question' | 'result'>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const total = PA_QUESTIONS.length;
  const q     = PA_QUESTIONS[current];

  function handleAnswer(optIndex: number) {
    const newAnswers = { ...answers, [current]: optIndex };
    setAnswers(newAnswers);
    if (current < total - 1) { setCurrent(c => c + 1); }
    else { setPhase('result'); }
  }

  function handleBack() {
    if (current > 0) setCurrent(c => c - 1);
    else setPhase('intro');
  }

  function reset() {
    setPhase('intro'); setCurrent(0); setAnswers({});
  }

  const outerWrap: React.CSSProperties = {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '0 clamp(20px,4vw,48px)',
  };

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <section style={{ background: C.cream, padding: 'clamp(64px,8vw,100px) 0' }}>
        <div style={outerWrap}>
          <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
            Placement Assessment
          </p>
          <div style={{ width: 32, height: 1, background: C.gold, marginBottom: 20 }} />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: C.navy, lineHeight: 1.15, marginBottom: 12 }}>
            Which Environment<br /><em style={{ color: C.gold }}>Suits Your Child?</em>
          </h2>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, maxWidth: 500, lineHeight: 1.75, marginBottom: 40 }}>
            15 questions across 8 factors. Approximately 4 minutes. Receive a preliminary pathway recommendation to bring to your interview.
          </p>

          {/* Main card */}
          <div style={{ background: C.navy, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ padding: 'clamp(32px,5vw,60px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'start' }}>
              {/* Left */}
              <div>
                <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: C.gold, textTransform: 'uppercase', marginBottom: 14 }}>What This Covers</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
                  {['Academic Level', 'Confidence', 'Learning Habits', 'Goals', 'School Performance', 'Motivation', 'Study Skills', 'Subject Strengths'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: C.gold, flexShrink: 0 }} />
                      <span style={{ fontFamily: sans, fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
                  {[['15', 'Questions'], ['8', 'Factors'], ['5', 'Pathways']].map(([n, l]) => (
                    <div key={l} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 3, padding: '16px 12px', textAlign: 'center' }}>
                      <p style={{ fontFamily: serif, fontSize: 32, fontWeight: 400, color: C.white, lineHeight: 1 }}>{n}</p>
                      <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: 4 }}>{l}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setPhase('question')}
                  style={{ width: '100%', padding: '16px 24px', background: C.gold, color: C.navy, fontFamily: sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', border: 'none', borderRadius: 2, cursor: 'pointer' }}
                >
                  Begin Assessment →
                </button>
                <p style={{ fontFamily: sans, fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 12, fontStyle: 'italic', textAlign: 'center' }}>
                  Not a diagnostic test. Results are a guide for your interview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── QUESTION ───────────────────────────────────────────────────────────────
  if (phase === 'question') {
    const pct = (current / total) * 100;
    const section = q.section;
    const sections = [...new Set(PA_QUESTIONS.map(q2 => q2.section))];
    const sectionIndex = sections.indexOf(section);

    return (
      <section style={{ background: C.cream, padding: 'clamp(64px,8vw,100px) 0' }}>
        <div style={outerWrap}>
          {/* Progress */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: C.gold, textTransform: 'uppercase' as const }}>
                {section}
              </span>
              <span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>
                {current + 1} of {total}
              </span>
            </div>
            <div style={{ height: 2, background: C.navyBorder, borderRadius: 1, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: C.gold, transition: 'width 0.4s ease', borderRadius: 1 }} />
            </div>
            {/* Section tabs */}
            <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
              {sections.map((s, si) => (
                <div key={s} style={{ flex: 1, height: 2, borderRadius: 1, background: si <= sectionIndex ? C.gold : 'rgba(10,27,52,0.10)', transition: 'background 0.3s ease' }} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <div style={{ background: C.white, border: `1px solid ${C.navyBorder}`, borderRadius: 4, padding: 'clamp(28px,4vw,52px)', marginBottom: 20 }}>
                <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' as const, marginBottom: 14 }}>
                  Question {current + 1}
                </p>
                <h3 style={{ fontFamily: serif, fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 400, color: C.navy, lineHeight: 1.4, marginBottom: 32 }}>
                  {q.q}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                  {q.options.map((opt, i) => {
                    const sel = answers[current] === i;
                    return (
                      <motion.button key={i} whileHover={{ x: 3 }} onClick={() => handleAnswer(i)} style={{
                        width: '100%', textAlign: 'left' as const, padding: '15px 20px',
                        background: sel ? C.navy : C.cream,
                        border: `1px solid ${sel ? C.navy : C.navyBorder}`,
                        borderRadius: 3, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 14,
                        transition: 'background 0.18s ease, border-color 0.18s ease',
                      }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${sel ? C.gold : 'rgba(10,27,52,0.18)'}`, background: sel ? C.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {sel && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2 2 5-5" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </span>
                        <span style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.5, color: sel ? C.white : C.navy }}>
                          {opt.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: sans, fontSize: 12, color: C.muted, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  ← Back
                </button>
                {answers[current] !== undefined && (
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => handleAnswer(answers[current])}
                    style={{ padding: '12px 28px', background: C.navy, color: C.white, fontFamily: sans, fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 2, cursor: 'pointer' }}>
                    {current === total - 1 ? 'See My Profile →' : 'Continue →'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  const { primary, others } = computeResult(answers);
  const programData = PA_RESULTS[primary];
  const snapshot    = getSnapshot(answers);
  const strengths   = getStrengths(answers);
  const areas       = getAreas(answers);

  return (
    <section style={{ background: C.cream, padding: 'clamp(64px,8vw,100px) 0' }}>
      <div style={outerWrap}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>

          {/* ── Header ── */}
          <div style={{ background: C.navy, borderRadius: '4px 4px 0 0', padding: 'clamp(28px,4vw,48px)', textAlign: 'center' }}>
            <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase', marginBottom: 16 }}>
              Placement Profile
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 400, color: C.white, lineHeight: 1.2, marginBottom: 12 }}>
              Based on your responses across 8 factors
            </h2>
            <p style={{ fontFamily: sans, fontSize: 13, color: 'rgba(255,255,255,0.45)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7, fontStyle: 'italic' }}>
              This profile reflects patterns in your answers. Bring it to your interview — our team will review it with you.
            </p>
          </div>

          {/* ── Current Snapshot ── */}
          <div style={{ background: C.creamDeep, border: `1px solid ${C.navyBorder}`, borderTop: 'none', padding: 'clamp(24px,3.5vw,40px)' }}>
            <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: C.muted, textTransform: 'uppercase', marginBottom: 20 }}>Current Snapshot</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {snapshot.map(({ label, value }) => (
                <div key={label} style={{ background: C.white, border: `1px solid ${C.navyBorder}`, borderRadius: 3, padding: '16px 18px' }}>
                  <p style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: C.gold, textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: sans, fontSize: 13, color: C.navy, fontWeight: 500, lineHeight: 1.4 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Strengths + Areas ── */}
          <div style={{ background: C.white, border: `1px solid ${C.navyBorder}`, borderTop: 'none', padding: 'clamp(24px,3.5vw,40px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: C.muted, textTransform: 'uppercase', marginBottom: 20 }}>Strengths</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="7" cy="7" r="6.5" stroke={C.gold} strokeWidth="1" />
                      <path d="M4.5 7l2 2 3.5-3.5" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p style={{ fontFamily: sans, fontSize: 13, color: C.navy, lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
            {areas.length > 0 && (
              <div>
                <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: C.muted, textTransform: 'uppercase', marginBottom: 20 }}>Areas to Develop</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {areas.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                        <circle cx="7" cy="7" r="6.5" stroke="rgba(10,27,52,0.20)" strokeWidth="1" />
                        <path d="M5 9l2-2m0 0l2-2m-2 2L5 5m2 2l2 2" stroke="rgba(10,27,52,0.30)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Recommended Pathway ── */}
          <div style={{ background: C.white, border: `1px solid ${C.navyBorder}`, borderTop: 'none', padding: 'clamp(24px,3.5vw,40px)' }}>
            <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: C.muted, textTransform: 'uppercase', marginBottom: 20 }}>Recommended Pathway to Explore</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 32, alignItems: 'start', marginBottom: 24 }}>
              <div style={{ background: C.navy, padding: '28px 24px', borderRadius: 3 }}>
                <p style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.18em', color: C.gold, textTransform: 'uppercase', marginBottom: 10 }}>Suggested Pathway</p>
                <h3 style={{ fontFamily: serif, fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 400, color: C.white, lineHeight: 1.3, marginBottom: 8 }}>
                  {programData.name}
                </h3>
                <p style={{ fontFamily: sans, fontSize: 12, color: 'rgba(255,255,255,0.48)', fontStyle: 'italic', lineHeight: 1.5 }}>{programData.sub}</p>
              </div>
              <div>
                <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase', marginBottom: 14 }}>Why This May Suit</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {programData.why.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: C.gold, flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontFamily: sans, fontSize: 13, color: C.navy, lineHeight: 1.65 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ background: C.cream, borderRadius: 3, padding: '18px 22px', borderLeft: `3px solid ${C.goldBorder}` }}>
              <p style={{ fontFamily: sans, fontSize: 13, color: C.navy, lineHeight: 1.75 }}>{programData.context}</p>
            </div>
            {programData.note && (
              <p style={{ fontFamily: sans, fontSize: 12, color: C.muted, fontStyle: 'italic', lineHeight: 1.65, marginTop: 16 }}>{programData.note}</p>
            )}
          </div>

          {/* ── Other Pathways ── */}
          <div style={{ background: C.creamDeep, border: `1px solid ${C.navyBorder}`, borderTop: 'none', padding: 'clamp(20px,3vw,36px)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <p style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase', flexShrink: 0 }}>
              Other Pathways Worth Discussing
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {others.map(id => (
                <div key={id} style={{ background: C.white, border: `1px solid ${C.navyBorder}`, borderRadius: 3, padding: '8px 14px' }}>
                  <p style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.navy }}>{PATHWAY_NAMES[id]}</p>
                  <p style={{ fontFamily: sans, fontSize: 10, color: C.muted, marginTop: 2 }}>{PATHWAY_SUBS[id]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Important Note ── */}
          <div style={{ background: C.white, border: `1px solid ${C.navyBorder}`, borderTop: 'none', padding: 'clamp(18px,3vw,32px)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 3, background: C.goldBorder, borderRadius: 1, flexShrink: 0, alignSelf: 'stretch', minHeight: 24 }} />
            <p style={{ fontFamily: sans, fontSize: 12, color: C.muted, fontStyle: 'italic', lineHeight: 1.7 }}>
              This is a preliminary profile only. Placement is confirmed after a consultation interview with our team — in person, after understanding your child directly. This profile is a starting point for that conversation, not a final decision.
            </p>
          </div>

          {/* ── CTAs ── */}
          <div style={{ background: C.navy, borderRadius: '0 0 4px 4px', padding: 'clamp(28px,4vw,48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: serif, fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 400, color: C.white, marginBottom: 4 }}>
                Discuss this profile with our team
              </h3>
              <p style={{ fontFamily: sans, fontSize: 12, color: 'rgba(255,255,255,0.42)', maxWidth: 360, lineHeight: 1.6 }}>
                Book a consultation to review your child's profile with a DA Tuition educator.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <Link to="/interview">
                <button style={{ padding: '13px 28px', background: C.gold, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', border: 'none', borderRadius: 2, cursor: 'pointer' }}>
                  Book an Interview →
                </button>
              </Link>
              <button onClick={reset} style={{ padding: '13px 24px', background: 'transparent', color: 'rgba(255,255,255,0.55)', fontFamily: sans, fontSize: 12, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2, cursor: 'pointer' }}>
                Start Again
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
