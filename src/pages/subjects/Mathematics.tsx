import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle,
  Clock,
  HelpCircle,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface StepRow {
  label: string;
  working: string;
  isMistake?: boolean;
}

interface ErrorExample {
  problem: string;
  steps: StepRow[];
  explanation: string;
}

interface ErrorTab {
  id: string;
  label: string;
  examples: ErrorExample[];
}

const ERROR_TABS: ErrorTab[] = [
  {
    id: 'yr78',
    label: 'Year 7–8',
    examples: [
      {
        problem: 'Simplify $3 + 4 \\times 2$.',
        steps: [
          { label: 'Step 1', working: '3 + 4 = 7', isMistake: true },
          { label: 'Step 2', working: '7 \\times 2 = 14' },
          { label: 'Answer', working: '14' },
        ],
        explanation:
          'Multiplication must come before addition (BODMAS/BIDMAS). The correct order is $4 \\times 2 = 8$ first, then $3 + 8 = \\mathbf{11}$. Doing the addition first is the most common order-of-operations error in Year 7.',
      },
      {
        problem: 'If $x = -2$, find the value of $x^2$.',
        steps: [
          { label: 'Step 1', working: 'x^2 = -2^2 = -4', isMistake: true },
          { label: 'Answer', working: '-4' },
        ],
        explanation:
          '$-2^2$ without brackets means $-(2^2) = -4$ by convention, but the question asks for $x^2$ where $x = -2$, which means $(-2)^2 = (-2) \\times (-2) = \\mathbf{4}$. Always substitute with brackets around negative values: $(-2)^2$. This mistake costs marks across every topic that uses substitution.',
      },
      {
        problem: 'Solve $\\dfrac{x}{3} = 7$.',
        steps: [
          { label: 'Step 1', working: 'x = 7 - 3 = 4', isMistake: true },
          { label: 'Answer', working: 'x = 4' },
        ],
        explanation:
          'To undo dividing by 3, you must **multiply** both sides by 3 — not subtract. The correct working: $x = 7 \\times 3 = \\mathbf{21}$. The student confused the inverse operation. Dividing → multiply to undo; subtracting → add to undo.',
      },
    ],
  },
  {
    id: 'yr910',
    label: 'Year 9–10',
    examples: [
      {
        problem: 'Expand $(x + 3)(x - 2)$.',
        steps: [
          { label: 'Step 1', working: 'x \\cdot x = x^2' },
          { label: 'Step 2', working: 'x \\cdot (-2) = -2x' },
          { label: 'Step 3', working: '3 \\cdot x = 3x' },
          { label: 'Step 4', working: '3 \\cdot (-2) = \\mathbf{+6}', isMistake: true },
          { label: 'Answer', working: 'x^2 + x + 6' },
        ],
        explanation:
          'A positive times a negative is negative: $3 \\times (-2) = -6$, not $+6$. The correct expansion is $x^2 + x - 6$. Sign errors in the last term of a FOIL expansion are the single most common algebra mistake at this level — always check the sign of the constant term last.',
      },
      {
        problem: 'Simplify $x^3 \\times x^4$.',
        steps: [
          { label: 'Step 1', working: 'x^3 \\times x^4 = x^{3 \\times 4} = x^{12}', isMistake: true },
          { label: 'Answer', working: 'x^{12}' },
        ],
        explanation:
          'When **multiplying** terms with the same base, you **add** the indices: $x^3 \\times x^4 = x^{3+4} = \\mathbf{x^7}$. Multiplying the indices ($3 \\times 4$) is the rule for a **power of a power** — $(x^3)^4 = x^{12}$. These two index laws are commonly confused.',
      },
      {
        problem: 'Solve $2x + 5 = 13$.',
        steps: [
          { label: 'Step 1', working: '2x = 13 + 5 = 18', isMistake: true },
          { label: 'Step 2', working: 'x = 18 \\div 2 = 9' },
          { label: 'Answer', working: 'x = 9' },
        ],
        explanation:
          'To isolate $2x$, subtract 5 from both sides: $2x = 13 - 5 = 8$. The student added instead of subtracted. Correct answer: $x = 8 \\div 2 = \\mathbf{4}$. A quick check: $2(4) + 5 = 13$ ✓. Always substitute back to verify.',
      },
    ],
  },
  {
    id: 'hsc',
    label: 'HSC',
    examples: [
      {
        problem: 'Differentiate $y = (2x + 1)^3$.',
        steps: [
          { label: 'Step 1', working: '\\dfrac{dy}{dx} = 3(2x+1)^2', isMistake: true },
          { label: 'Answer', working: '3(2x+1)^2' },
        ],
        explanation:
          'The chain rule requires multiplying by the derivative of the inner function. The inner function is $2x + 1$, whose derivative is $2$. Correct answer: $\\dfrac{dy}{dx} = 3(2x+1)^2 \\times 2 = \\mathbf{6(2x+1)^2}$. Forgetting the chain rule multiplier is the most common differentiation error in the HSC.',
      },
      {
        problem: 'Find $\\displaystyle\\int (3x^2 + 2x)\\,dx$.',
        steps: [
          { label: 'Step 1', working: '= \\dfrac{3x^3}{3} + \\dfrac{2x^2}{2}' },
          { label: 'Step 2', working: '= x^3 + x^2', isMistake: true },
          { label: 'Answer', working: 'x^3 + x^2' },
        ],
        explanation:
          'Every indefinite integral requires a constant of integration $+\\,C$. The correct answer is $\\mathbf{x^3 + x^2 + C}$. In the HSC, omitting $+C$ from an indefinite integral costs the mark outright — markers are specifically instructed to penalise this every time.',
      },
      {
        problem: 'Solve $\\sin x = \\dfrac{1}{2}$ for $0 \\leq x \\leq 2\\pi$.',
        steps: [
          { label: 'Step 1', working: 'x = \\dfrac{\\pi}{6}', isMistake: true },
          { label: 'Answer', working: 'x = \\dfrac{\\pi}{6}' },
        ],
        explanation:
          'Sine is positive in both the first and second quadrants. The full solution is $x = \\dfrac{\\pi}{6}$ **and** $x = \\pi - \\dfrac{\\pi}{6} = \\dfrac{5\\pi}{6}$. Only giving one solution when the domain allows two is a systematic HSC error — always check all four quadrants against the given domain before writing the final answer.',
      },
      {
        problem: 'Solve $\\log_2 x + \\log_2 4 = \\log_2 12$.',
        steps: [
          { label: 'Step 1', working: '\\log_2(4x) = \\log_2 12' },
          { label: 'Step 2', working: '4x = 12' },
          { label: 'Step 3', working: 'x = 4', isMistake: true },
          { label: 'Answer', working: 'x = 4' },
        ],
        explanation:
          "$4x = 12$ gives $x = 12 \\div 4 = \\mathbf{3}$, not $4$. The log manipulation in Steps 1–2 is correct; the error is a simple division slip at the final arithmetic step. This illustrates why checking $4 \\times 3 = 12$ (not $4 \\times 4$) before writing the answer is worth two seconds of every HSC student's time.",
      },
    ],
  },
];

const MixedMath = ({ text }: { text: string }) => {
  const parts = text.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(part.slice(1, -1), { throwOnError: false }),
              }}
            />
          );
        }
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part ? <span key={i}>{part}</span> : null;
      })}
    </>
  );
};

// ── Curiosity card SVG illustrations ──────────────────────────────────────
const IlluParabola = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 120 76" className="h-full w-full" aria-hidden="true">
    <line x1="6" y1="72" x2="114" y2="72" stroke="#071629" strokeWidth="1" strokeOpacity="0.12" strokeLinecap="round" />
    <path
      d="M 8,71 Q 60,6 112,71"
      fill="none" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round"
      strokeDasharray="250"
      style={{
        strokeDashoffset: isOpen ? 0 : 250,
        transition: isOpen ? 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    />
    <circle
      cx="60" cy="6" r="6" fill="#c9a227"
      style={{
        opacity: isOpen ? 1 : 0.28,
        transform: isOpen ? 'scale(1)' : 'scale(0.55)',
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transition: isOpen ? 'opacity 0.35s ease 0.5s, transform 0.35s ease 0.5s' : 'none',
      }}
    />
  </svg>
);

const IlluPhone = ({ isOpen: _ }: { isOpen: boolean }) => (
  <svg viewBox="0 0 120 76" className="h-full w-full" aria-hidden="true">
    <g style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'maths-phoneRock 2.4s ease-in-out infinite' }}>
      <rect x="42" y="5" width="36" height="58" rx="6" fill="#071629" fillOpacity="0.12" />
      <rect x="44" y="10" width="32" height="42" rx="3" fill="#071629" fillOpacity="0.08" />
      <circle cx="60" cy="59" r="2.5" fill="#071629" fillOpacity="0.22" />
    </g>
    <line x1="16" y1="66" x2="16" y2="46" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" />
    <polygon points="13,49 16,43 19,49" fill="#c9a227" />
    <line x1="16" y1="66" x2="36" y2="66" stroke="#071629" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
    <polygon points="33,63 39,66 33,69" fill="#071629" fillOpacity="0.3" />
  </svg>
);

const IlluNormalDist = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 120 76" className="h-full w-full" aria-hidden="true">
    <line x1="6" y1="70" x2="114" y2="70" stroke="#071629" strokeWidth="1" strokeOpacity="0.12" strokeLinecap="round" />
    <line
      x1="60" y1="70" x2="60" y2="10" stroke="#071629" strokeWidth="1" strokeDasharray="3 3"
      strokeOpacity={isOpen ? 0.25 : 0}
      style={{ transition: 'stroke-opacity 0.3s 0.5s' }}
    />
    <path
      d="M 6,70 C 22,70 30,68 40,52 C 48,40 52,10 60,10 C 68,10 72,40 80,52 C 90,68 98,70 114,70"
      fill="none" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round"
      strokeDasharray="220"
      style={{
        strokeDashoffset: isOpen ? 0 : 220,
        transition: isOpen ? 'stroke-dashoffset 0.75s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    />
    <circle
      cx="60" cy="10" r="4" fill="#c9a227"
      style={{
        opacity: isOpen ? 1 : 0,
        transition: isOpen ? 'opacity 0.3s ease 0.6s' : 'none',
      }}
    />
  </svg>
);

const IlluNetflix = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 120 76" className="h-full w-full" aria-hidden="true">
    <rect x="10" y="8" width="100" height="58" rx="7" fill="none" stroke="#071629" strokeWidth="1.5" strokeOpacity="0.18" />
    <line x1="60" y1="66" x2="60" y2="73" stroke="#071629" strokeWidth="2" strokeOpacity="0.14" />
    <line x1="48" y1="73" x2="72" y2="73" stroke="#071629" strokeWidth="1.5" strokeOpacity="0.14" />
    {isOpen && (
      <>
        <circle cx="60" cy="36" r="18" fill="none" stroke="#c9a227" strokeWidth="1.5"
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'maths-ripple 0.8s ease-out 0.05s forwards', opacity: 0 }} />
        <circle cx="60" cy="36" r="18" fill="none" stroke="#c9a227" strokeWidth="1"
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'maths-ripple 0.8s ease-out 0.3s forwards', opacity: 0 }} />
      </>
    )}
    <polygon points="50,24 50,50 76,37" fill="#c9a227" fillOpacity="0.9" />
  </svg>
);

const IlluGPS = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 120 76" className="h-full w-full" aria-hidden="true">
    {/* Grid lines */}
    {[20, 40, 60, 80, 100].map(x => (
      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="76" stroke="#071629" strokeWidth="0.5" strokeOpacity="0.07" />
    ))}
    {[18, 36, 54, 70].map(y => (
      <line key={`h${y}`} x1="0" y1={y} x2="120" y2={y} stroke="#071629" strokeWidth="0.5" strokeOpacity="0.07" />
    ))}
    {/* Crosshairs */}
    <line x1="60" y1="2" x2="60" y2="74" stroke="#c9a227" strokeWidth="1" strokeLinecap="round"
      strokeOpacity={isOpen ? 0.45 : 0.15}
      style={{ transition: 'stroke-opacity 0.35s' }}
    />
    <line x1="2" y1="38" x2="118" y2="38" stroke="#c9a227" strokeWidth="1" strokeLinecap="round"
      strokeOpacity={isOpen ? 0.45 : 0.15}
      style={{ transition: 'stroke-opacity 0.35s' }}
    />
    {/* Outer ring */}
    <circle cx="60" cy="38" r="16" fill="none" stroke="#c9a227" strokeWidth="1"
      strokeOpacity={isOpen ? 0.3 : 0}
      style={{ transition: 'stroke-opacity 0.4s 0.15s' }}
    />
    {/* Centre dot */}
    <circle cx="60" cy="38" r="6" fill="#c9a227"
      style={{ opacity: isOpen ? 1 : 0.25, transition: 'opacity 0.3s' }}
    />
    <circle cx="60" cy="38" r="2.5" fill="white"
      style={{ opacity: isOpen ? 1 : 0.25, transition: 'opacity 0.3s' }}
    />
  </svg>
);

const IlluF1 = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 120 76" className="h-full w-full" aria-hidden="true">
    {/* Speedometer background arc */}
    <path d="M 18,68 A 42,42 0 0 1 102,68"
      fill="none" stroke="#071629" strokeWidth="3" strokeOpacity="0.1" strokeLinecap="round"
    />
    {/* Speedometer fill arc */}
    <path d="M 18,68 A 42,42 0 0 1 102,68"
      fill="none" stroke="#c9a227" strokeWidth="3" strokeLinecap="round"
      strokeDasharray="132"
      style={{
        strokeDashoffset: isOpen ? 0 : 132,
        transition: isOpen ? 'stroke-dashoffset 0.75s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    />
    {/* Speed ticks */}
    {[0, 1, 2, 3, 4, 5, 6].map(i => {
      const angle = Math.PI * (1 + i / 6);
      const r1 = 36, r2 = 42, cx = 60, cy = 68;
      return (
        <line key={i}
          x1={cx + r1 * Math.cos(angle)} y1={cy + r1 * Math.sin(angle)}
          x2={cx + r2 * Math.cos(angle)} y2={cy + r2 * Math.sin(angle)}
          stroke="#071629" strokeWidth="1" strokeOpacity="0.18" strokeLinecap="round"
        />
      );
    })}
    {/* Needle — rotates from left (-90°) to high-speed (70°) */}
    <g style={{
      transform: `translate(60px, 68px) rotate(${isOpen ? 70 : -90}deg)`,
      transition: isOpen ? 'transform 0.75s cubic-bezier(0.4,0,0.2,1)' : 'none',
    }}>
      <line x1="0" y1="0" x2="0" y2="-36" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    <circle cx="60" cy="68" r="4" fill="#071629" fillOpacity="0.18" />
    <circle cx="60" cy="68" r="2" fill="#c9a227" />
  </svg>
);

// ── Card data ──────────────────────────────────────────────────────────────
const CURIOSITY_CARDS = [
  {
    topic: 'Parabolas',
    hook: 'The path of a ball',
    year: 'Years 9–10',
    fact: (
      <>
        Every time a basketball leaves someone&apos;s hands, it traces a <strong>parabola</strong>. Engineers
        use the exact same equation to design <strong>satellite dishes</strong> and{' '}
        <strong>suspension bridges</strong>.
      </>
    ),
    Illustration: IlluParabola,
  },
  {
    topic: 'Trigonometry',
    hook: 'How your phone knows which way is up',
    year: 'Years 9–10',
    fact: (
      <>
        Your phone knows which way is up because of trig. The <strong>accelerometer</strong> converts
        angles into <strong>sine and cosine</strong> values thousands of times per second.
      </>
    ),
    Illustration: IlluPhone,
  },
  {
    topic: 'Statistics',
    hook: 'Why most things cluster near average',
    year: 'Years 9–10',
    fact: (
      <>
        Heights, test scores, reaction times — most real-world data forms a <strong>bell curve</strong>.
        Statisticians use the <strong>normal distribution</strong> to work out how likely any result is,
        from exam marks to manufacturing tolerances.
      </>
    ),
    Illustration: IlluNormalDist,
  },
  {
    topic: 'Calculus',
    hook: 'How Netflix picks your next show',
    year: 'Years 11–12',
    fact: (
      <>
        Netflix uses calculus (<strong>gradient descent</strong>) to decide what to recommend next. Every
        time you press play, a <strong>derivative</strong> is being solved in the background.
      </>
    ),
    Illustration: IlluNetflix,
  },
  {
    topic: 'Vectors',
    hook: 'How GPS knows exactly where you are',
    year: 'Years 11–12',
    fact: (
      <>
        GPS works by measuring your distance from multiple satellites using <strong>vectors</strong>. Your
        phone solves a system of equations in real time to pinpoint your position to within{' '}
        <strong>a few metres</strong>.
      </>
    ),
    Illustration: IlluGPS,
  },
  {
    topic: 'Speed & Distance',
    hook: 'How F1 teams decide when to pit',
    year: 'Years 7–8',
    fact: (
      <>
        F1 strategists use <strong>speed, distance, and time</strong> calculations to decide the exact lap
        to call a driver in. A one-second error in timing can cost a race position.
      </>
    ),
    Illustration: IlluF1,
  },
];

const WALKTHROUGH_VERSIONS = [
  {
    id: 'hsc',
    label: 'HSC',
    problem: 'Find the values of k for which the equation 3x² − kx + 3 = 0 has no real solutions.',
    steps: [
      {
        content: 'Recall that a quadratic ax² + bx + c = 0 has **no real solutions** when the discriminant Δ < 0, where Δ = b² − 4ac.',
        note: '"No real solutions" is the key phrase. That\'s the discriminant test. Lock it in before touching the numbers.',
      },
      {
        content: 'Identify the coefficients: a = 3, b = −k, c = 3.',
        note: "Don't rush. Write out a, b, c explicitly. Dropping a negative sign here is the most common mistake in the HSC.",
      },
      {
        content: 'Substitute into Δ = b² − 4ac: Δ = (−k)² − 4(3)(3) = k² − 36.',
        note: '(−k)² = k² — the negative disappears when you square.',
      },
      {
        content: 'Set Δ < 0: k² − 36 < 0, so k² < 36.',
        note: 'We want no real solutions, so the discriminant must be negative. Flip the condition.',
      },
      {
        content: 'Solve: −6 < k < 6.',
        note: 'Square-root both sides of k² < 36. Remember: square root of an inequality gives both a positive and negative bound. Final answer: −6 < k < 6.',
      },
    ],
  },
  {
    id: 'yr8',
    label: 'Year 8',
    problem: 'A rectangle has a length that is 4 cm more than twice its width. Its perimeter is 50 cm. Find the dimensions.',
    steps: [
      {
        content: 'Let the width = w. Then the length = 2w + 4.',
        note: 'Pick one unknown and build the other from the words. "4 more than twice the width" → 2w + 4.',
      },
      {
        content: 'Perimeter of a rectangle = 2(length + width). So: 2(2w + 4 + w) = 50.',
        note: "Write the perimeter formula first, then substitute — don't skip straight to numbers.",
      },
      {
        content: 'Simplify inside the bracket: 2(3w + 4) = 50.',
        note: 'Collect the w terms: 2w + w = 3w.',
      },
      {
        content: 'Expand: 6w + 8 = 50. Then 6w = 42, so w = 7.',
        note: 'Divide both sides by 6 cleanly.',
      },
      {
        content: 'Width = 7 cm, length = 2(7) + 4 = 18 cm. **Check:** 2(18 + 7) = 2(25) = 50 ✓',
        note: "Always substitute back. If it doesn't check out, something went wrong earlier.",
      },
    ],
  },
];

const Mathematics = () => {
  const courseLevels = [
    {
      label: 'Primary School',
      years: 'Years K-6',
      tone: 'from-[#f7fbff] to-[#e8f2ff]',
      icon: BookOpen,
      description: 'Build number confidence, mental maths, times tables, and problem-solving habits before gaps become stressful.',
      subjects: ['K-6 Mathematics', 'Problem Solving', 'Mental Maths', 'Times Tables Mastery'],
    },
    {
      label: 'High School',
      years: 'Years 7-10',
      tone: 'from-[#fbfff8] to-[#eaf8ef]',
      icon: Brain,
      description: 'Strengthen algebra, geometry, trigonometry, and exam routines while school expectations increase.',
      subjects: ['Core Mathematics', 'Advanced Mathematics', 'Mathematical Methods', 'Problem Solving & Enrichment'],
    },
    {
      label: 'HSC Mathematics',
      years: 'Years 11-12',
      tone: 'from-[#fffdf7] to-[#fff1cd]',
      icon: TrendingUp,
      description: 'Prepare for Standard, Advanced, Extension 1, and Extension 2 with structured syllabus and exam support.',
      subjects: ['Mathematics Standard 1 & 2', 'Mathematics Advanced', 'Mathematics Extension 1', 'Mathematics Extension 2'],
    },
  ];

  const hscStreams = [
    {
      name: 'Standard',
      badge: 'Confidence and marks',
      topics: ['Algebra & equations', 'Measurement & geometry', 'Statistics & probability', 'Financial mathematics', 'Networks & paths'],
    },
    {
      name: 'Advanced',
      badge: 'Most common HSC path',
      topics: ['Functions & relations', 'Trigonometry', 'Calculus', 'Statistical analysis', 'Financial modelling'],
    },
    {
      name: 'Extension 1',
      badge: 'High scaling',
      topics: ['Further calculus', 'Polynomials', 'Combinatorics', 'Proof by induction', 'Vectors'],
    },
    {
      name: 'Extension 2',
      badge: 'Elite level',
      topics: ['Complex numbers', 'Further integration', 'Mechanics', 'Statistical inference', 'Advanced proof'],
    },
  ];

  const parentConcerns = [
    {
      icon: HelpCircle,
      title: 'My child understands it in class, then freezes in tests.',
      detail: 'We teach students how to identify question types, choose a method, and show working under pressure.',
    },
    {
      icon: Clock,
      title: 'They are falling behind and avoiding maths homework.',
      detail: 'We rebuild missing foundations step by step so new school content stops feeling impossible.',
    },
    {
      icon: Target,
      title: 'They are capable, but careless mistakes cost marks.',
      detail: 'We focus on checking routines, mathematical communication, and exam habits that reduce avoidable errors.',
    },
  ];

  // The same running problem (2x + 5 = 13) is annotated differently at each
  // stage of the method, so a viewer can see what actually changes step to step.
  const teachingSteps = [
    {
      title: 'Diagnose',
      text: 'Find the exact gaps, habits, and confidence blocks holding the student back.',
      chips: ['Problem-solving strategies', 'Mathematical reasoning'],
      example: {
        kind: 'diagnose' as const,
        problem: '2x + 5 = 13',
        note: 'A 60-second diagnostic shows whether the gap is the algebra itself, or just the inverse-operation habit that undoes the +5.',
      },
    },
    {
      title: 'Explain',
      text: 'Break concepts into clear steps with worked examples and guided practice.',
      chips: ['Algebraic manipulation', 'Geometric visualization'],
      example: {
        kind: 'explain' as const,
        problem: '2x + 5 = 13',
        steps: [
          { content: 'Subtract 5 from both sides: 2x = 13 − 5 = 8.', note: 'The most common slip is adding instead of subtracting — always undo the last operation first.' },
          { content: 'Divide both sides by 2: x = 8 ÷ 2 = 4.', note: 'Undo each operation in reverse order — that is the whole idea of solving an equation.' },
          { content: 'Check by substitution: 2(4) + 5 = 13 ✓', note: 'A ten-second check catches almost every careless mistake before it costs a mark.' },
        ],
      },
    },
    {
      title: 'Apply',
      text: 'Move from simple questions into exam-style problems with teacher feedback.',
      chips: ['Statistical interpretation'],
      example: {
        kind: 'apply' as const,
        problem: '3x − 4 = 11',
        answer: 'x = 5',
        note: 'Same method, new numbers. A student who can explain why each step works can now apply it under light exam pressure.',
      },
    },
    {
      title: 'Refine',
      text: 'Build speed, accuracy, and independent problem-solving over time.',
      chips: ['Exam technique'],
      example: {
        kind: 'refine' as const,
        before: 'x = 15',
        after: 'x = 5 — check: 3(5) − 4 = 11 ✓',
        note: 'The first attempt skipped the final check and mis-divided 15 ÷ 3. Refining means tightening exactly this kind of slip before it reaches the exam.',
      },
    },
  ];

  const scrollToPathways = () => {
    document.getElementById('math-pathways')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<number>(0);
  const [teachStep, setTeachStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('yr910');
  const [exampleIdx, setExampleIdx] = useState<number>(0);
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);

  const currentTab = ERROR_TABS.find((t) => t.id === activeTab)!;
  const currentExample = currentTab.examples[exampleIdx];
  const mistakeStep = currentExample.steps.find((s) => s.isMistake);
  const mistakeIndex = currentExample.steps.findIndex((s) => s.isMistake);
  const isLastExample = exampleIdx === currentTab.examples.length - 1;
  const revealed = pickedIndex === mistakeIndex;

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="Mathematics Tutoring (K-12 & HSC)"
        description="From foundational numeracy to advanced HSC mathematics, we build confidence through expert guidance and proven teaching methods at DA Tuition."
        canonicalUrl="/subjects/mathematics"
      />
      <NavigationNew />

      <main>
        {/* Hero */}
        <SubjectHero
          eyebrow="Years K-12 Mathematics"
          icon={Calculator}
          headlineWhite="Working with method."
          headlineGold="Answering with confidence."
          subtext="From times tables to Extension 2, DA Tuition helps students see the method, connect each step, and walk into assessments with confidence."
          proofPills={['Step-by-step working', 'Marked feedback', 'Clear year-level pathway']}
          exploreTargetId="math-pathways"
          placeholderLabel="Mathematics classroom"
        />

        {/* Anchor navigation */}
        <section className="px-5 pt-10 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-3 rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10 md:grid-cols-4">
            {[
              ['Year levels', '#math-pathways'],
              ['HSC streams', '#hsc-maths'],
              ['How we teach', '#math-method'],
              ['See it in action', '#maths-interactive'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-2xl px-4 py-3 text-center text-sm font-black text-[#10233f] transition hover:bg-[#f5ecd9]">
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* Curiosity grid — Where does this maths actually show up? */}
        <section id="where-used" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <style>{`
            @keyframes maths-phoneRock {
              0%   { transform: rotate(8deg);  }
              50%  { transform: rotate(-5deg); }
              100% { transform: rotate(8deg);  }
            }
            @keyframes maths-ripple {
              from { transform: scale(1);   opacity: 0.55; }
              to   { transform: scale(2.8); opacity: 0;    }
            }
          `}</style>

          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Where does this maths actually show up?
              </h2>
              <p className="mt-3 font-serif text-base italic text-[#9b8a6a]">Tap a card to find out.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3">
              {CURIOSITY_CARDS.map((card) => {
                const isOpen = activeCard === card.topic;
                return (
                  <button
                    key={card.topic}
                    type="button"
                    onClick={() => setActiveCard(isOpen ? null : card.topic)}
                    aria-expanded={isOpen}
                    className="group relative flex flex-col overflow-hidden rounded-[2rem] border text-left shadow-[0_2px_12px_rgba(7,22,41,0.07)] transition duration-150 hover:scale-[1.02] hover:shadow-[0_8px_28px_rgba(7,22,41,0.12)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2"
                    style={{
                      borderColor: isOpen ? 'rgba(201,162,39,0.35)' : 'rgba(7,22,41,0.08)',
                      background: isOpen ? '#fdf8ec' : 'white',
                    }}
                  >
                    {/* Gold top accent */}
                    <div
                      className="absolute inset-x-0 top-0 h-[3px] transition-opacity duration-300"
                      style={{ background: '#c9a227', opacity: isOpen ? 1 : 0 }}
                    />

                    {/* Topic badge — top-right corner */}
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-[#071629]/5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#9b8a6a]">
                      {card.topic}
                    </span>

                    {/* Illustration — shrinks when open */}
                    <div
                      className="mx-5 mt-8 overflow-hidden transition-[height] duration-200 ease-out"
                      style={{ height: isOpen ? '3.5rem' : '7rem' }}
                    >
                      <card.Illustration isOpen={isOpen} />
                    </div>

                    {/* Text area */}
                    <div className="px-6 pb-5 pt-3">
                      {/* Hook title */}
                      <p
                        className="font-serif font-medium leading-snug transition-all duration-200"
                        style={{
                          fontSize: isOpen ? '0.95rem' : '1.18rem',
                          color: isOpen ? '#7a5c0a' : '#071629',
                        }}
                      >
                        {card.hook}
                      </p>

                      {/* Fact — expands via grid-template-rows */}
                      <div
                        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p
                            className="mt-3 text-[13.5px] leading-[1.8] text-[#5c4a1e] transition-opacity duration-200"
                            style={{ opacity: isOpen ? 1 : 0 }}
                          >
                            {card.fact}
                          </p>
                        </div>
                      </div>

                      {/* Year badge */}
                      <span className="mt-3 inline-block rounded-full bg-[#071629]/6 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#9b8a6a]">
                        {card.year}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Parent concerns */}
        <section id="parent-concerns" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="For parents"
              title="Maths problems usually show up as confidence problems first."
              text="Whether your child freezes in tests, avoids homework, or needs to push further ahead, these are the situations we work with every day."
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {parentConcerns.map((concern, index) => (
                <motion.article
                  key={concern.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="rounded-3xl border border-[#071629]/10 bg-white p-6 shadow-lg shadow-[#071629]/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2ff] text-[#10233f]">
                    <concern.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black leading-snug tracking-[-0.02em] text-[#10233f]">{concern.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#61708a]">{concern.detail}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Year level pathways */}
        <section id="math-pathways" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Pathways"
              title="Choose by school stage, not by guesswork."
              text="Not sure which level fits your child? The interview will help. These cards give you a starting point to compare before you call."
            />

            <div className="grid gap-6 lg:grid-cols-3">
              {courseLevels.map((level, index) => (
                <motion.article
                  key={level.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={`group flex min-h-[430px] flex-col justify-between rounded-[2rem] border border-[#071629]/10 bg-gradient-to-b ${level.tone} p-7 shadow-lg shadow-[#071629]/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#10233f]">{level.years}</span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10233f] text-[#f1df9a]">
                        <level.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h2 className="mt-12 font-serif text-3xl font-medium tracking-[-0.04em] text-[#071629]">{level.label}</h2>
                    <p className="mt-4 text-sm leading-7 text-[#61708a]">{level.description}</p>
                    <ul className="mt-6 space-y-3">
                      {level.subjects.map((subject) => (
                        <li key={subject} className="flex items-start gap-3 text-sm font-semibold text-[#24324a]">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227]" />
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to="/book-interview" className="mt-8 inline-flex items-center text-sm font-black text-[#10233f]">
                    Ask which level fits
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* HSC streams */}
        <section id="hsc-maths" className="bg-[#071629] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a]">HSC focus</p>
                <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
                  Clear pathways for Standard, Advanced, and Extension maths.
                </h2>
              </div>
              <p className="text-base leading-8 text-white/64">
                We support all four HSC mathematics streams. You do not need to decode the syllabus — just tell us which subject your child is enrolled in and we will match them to the right class and teacher.
              </p>
            </div>

            {/* Segmented stream selector — same swap-a-pane pattern as "How we teach" below */}
            <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="HSC mathematics stream">
              {hscStreams.map((stream, index) => (
                <button
                  key={stream.name}
                  role="tab"
                  aria-selected={activeStream === index}
                  onClick={() => setActiveStream(index)}
                  className={`rounded-full px-5 py-2.5 text-sm font-black transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071629] ${
                    activeStream === index ? 'bg-[#c9a227] text-[#071629]' : 'border border-white/15 bg-white/[0.06] text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {stream.name}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-white/12 bg-white/[0.06] p-8 shadow-2xl shadow-black/10 backdrop-blur md:p-10">
              <div className="grid gap-8 md:grid-cols-[.9fr_1.1fr] md:items-start">
                <div>
                  <span className="rounded-full bg-[#c9a227]/18 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#f1df9a]">
                    {hscStreams[activeStream].badge}
                  </span>
                  <h3 className="mt-5 text-3xl font-black tracking-[-0.02em]">{hscStreams[activeStream].name}</h3>
                  <Link to="/hsc-excellence" className="mt-6 inline-flex">
                    <Button variant="outline" className="rounded-full border-white/30 bg-transparent font-bold text-white hover:bg-white/10 hover:text-white">
                      Explore HSC Program
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {hscStreams[activeStream].topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-3 rounded-2xl bg-white/[0.05] px-4 py-3 text-sm leading-6 text-white/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f1df9a]" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/70">
              Mathematics teachers include high-achieving subject specialists who help students move from knowing content to showing clear working under exam conditions.
            </p>
          </div>
        </section>

        {/* How we teach — sticky rail, since the 4 steps are genuinely sequential */}
        <section id="math-method" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="How we teach"
              title="Diagnose → Explain → Apply → Refine."
              text="The same four-step method behind every session — sequential by nature, so it stays visible on the left while the detail scrolls on the right."
            />

            <div className="grid overflow-hidden rounded-[2rem] border border-[#071629]/10 lg:grid-cols-[260px_1fr]">
              <div className="flex gap-2 overflow-x-auto bg-[#fdf8ec] p-4 lg:sticky lg:top-24 lg:block lg:h-fit lg:gap-0 lg:overflow-visible lg:p-6">
                {teachingSteps.map((step, index) => (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setTeachStep(index)}
                    aria-current={teachStep === index}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                      teachStep === index ? 'bg-[#071629] text-[#f1df9a]' : 'text-[#61708a] hover:bg-[#f5ecd9] hover:text-[#10233f]'
                    } lg:mb-1 lg:w-full`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
                        teachStep === index ? 'border-[#f1df9a] text-[#f1df9a]' : 'border-[#071629]/15 text-[#9b8a6a]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    {step.title}
                  </button>
                ))}
              </div>

              <div className="bg-white p-8 md:p-10">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Step {teachStep + 1}</p>
                <h3 className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629]">{teachingSteps[teachStep].title}</h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-[#61708a]">{teachingSteps[teachStep].text}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {teachingSteps[teachStep].chips.map((chip) => (
                    <span key={chip} className="flex items-center gap-2 rounded-full bg-[#fff6e7] px-4 py-2 text-xs font-bold text-[#24324a]">
                      <Calculator className="h-3.5 w-3.5 text-[#c9a227]" />
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Annotated worked example — same running problem, seen through this stage's lens */}
                <div className="mt-7 rounded-2xl border border-[#071629]/10 bg-[#fdf8ec] p-5 md:p-6">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#9b8a6a]">In practice</p>

                  {teachingSteps[teachStep].example.kind === 'diagnose' && (
                    <>
                      <p className="mb-3 font-mono text-base font-bold text-[#071629]">{teachingSteps[teachStep].example.problem}</p>
                      <div className="rounded-xl border-l-4 border-[#c9a227] bg-white px-4 py-3">
                        <p className="text-[13px] italic leading-[1.65] text-[#5c4a1e]">{teachingSteps[teachStep].example.note}</p>
                      </div>
                    </>
                  )}

                  {teachingSteps[teachStep].example.kind === 'explain' && (
                    <>
                      <p className="mb-4 font-mono text-base font-bold text-[#071629]">{teachingSteps[teachStep].example.problem}</p>
                      <div className="divide-y divide-[#071629]/6">
                        {teachingSteps[teachStep].example.steps.map((step, idx) => (
                          <div key={idx} className="grid grid-cols-1 gap-3 py-4 first:pt-0 md:grid-cols-[3fr_2fr]">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#071629] text-xs font-black text-[#f1df9a]">
                                {idx + 1}
                              </div>
                              <p className="text-[14px] leading-6 text-[#172033]">{step.content}</p>
                            </div>
                            <div className="rounded-xl border-l-4 border-[#c9a227] bg-white px-4 py-3">
                              <p className="text-[12.5px] italic leading-[1.6] text-[#5c4a1e]">{step.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {teachingSteps[teachStep].example.kind === 'apply' && (
                    <>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-white px-3 py-2 font-mono text-base font-bold text-[#071629]">
                          {teachingSteps[teachStep].example.problem}
                        </span>
                        <ArrowRight className="h-4 w-4 text-[#c9a227]" />
                        <span className="rounded-lg bg-[#071629] px-3 py-2 font-mono text-base font-bold text-[#f1df9a]">
                          {teachingSteps[teachStep].example.answer}
                        </span>
                      </div>
                      <div className="rounded-xl border-l-4 border-[#c9a227] bg-white px-4 py-3">
                        <p className="text-[13px] italic leading-[1.65] text-[#5c4a1e]">{teachingSteps[teachStep].example.note}</p>
                      </div>
                    </>
                  )}

                  {teachingSteps[teachStep].example.kind === 'refine' && (
                    <>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-white px-3 py-2 font-mono text-base font-bold text-[#a13d36] line-through decoration-2">
                          {teachingSteps[teachStep].example.before}
                        </span>
                        <ArrowRight className="h-4 w-4 text-[#c9a227]" />
                        <span className="rounded-lg bg-[#eaf6ec] px-3 py-2 font-mono text-base font-bold text-[#2f6e3d]">
                          {teachingSteps[teachStep].example.after}
                        </span>
                      </div>
                      <div className="rounded-xl border-l-4 border-[#c9a227] bg-white px-4 py-3">
                        <p className="text-[13px] italic leading-[1.65] text-[#5c4a1e]">{teachingSteps[teachStep].example.note}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spot the Mistake — full marking-desk workbench (second hook, upgraded to "mark it yourself") */}
        <section id="maths-interactive" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Spot the mistake"
              title="Find the marks lost before we tell you."
              text="Real curriculum mistakes, marked the way an exam actually loses points — click the line where you think the working goes wrong."
            />

            <div className="grid overflow-hidden rounded-[2rem] border border-[#071629]/10 lg:grid-cols-[230px_1fr]">
              <div className="flex gap-2 overflow-x-auto bg-[#071629] p-4 lg:block lg:gap-0 lg:overflow-visible lg:p-6" role="tablist" aria-label="Year level">
                <p className="mb-3 hidden text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a] lg:block">Year level</p>
                {ERROR_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setExampleIdx(0);
                      setPickedIndex(null);
                    }}
                    className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-black transition lg:mb-1 lg:w-full ${
                      activeTab === tab.id ? 'bg-white/10 text-[#f1df9a]' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white p-6 md:p-10">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-[#c9a227]">
                    Example {exampleIdx + 1} of {currentTab.examples.length}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setExampleIdx((i) => Math.max(0, i - 1));
                        setPickedIndex(null);
                      }}
                      disabled={exampleIdx === 0}
                      className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#10233f] transition hover:bg-[#f5ecd9] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => {
                        setExampleIdx((i) => Math.min(currentTab.examples.length - 1, i + 1));
                        setPickedIndex(null);
                      }}
                      disabled={isLastExample}
                      className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#10233f] transition hover:bg-[#f5ecd9] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#9b8a6a]">Problem</p>
                <p className="mb-7 inline-block rounded-xl border border-[#071629]/10 bg-[#fdf8ec] px-5 py-3 text-base font-semibold leading-7 text-[#071629]">
                  <MixedMath text={currentExample.problem} />
                </p>

                <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[#9b8a6a]">Click the line that&rsquo;s wrong</p>
                <div className="space-y-2">
                  {currentExample.steps.map((step, index) => {
                    const isPicked = pickedIndex === index;
                    const isCorrectPick = isPicked && step.isMistake === true;
                    const isWrongPick = isPicked && !step.isMistake;
                    return (
                      <button
                        key={step.label}
                        type="button"
                        onClick={() => setPickedIndex(index)}
                        className="flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2"
                        style={{
                          borderColor: isCorrectPick ? '#5db66a' : isWrongPick ? '#c9a227' : 'rgba(7,22,41,0.1)',
                          background: isCorrectPick ? '#eaf6ec' : isWrongPick ? '#fffbeb' : 'white',
                        }}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                            step.label === 'Answer' ? 'bg-[#071629] text-[#f1df9a]' : 'border border-[#071629]/15 text-[#9b8a6a]'
                          }`}
                        >
                          {step.label === 'Answer' ? '=' : step.label.replace('Step ', '')}
                        </span>
                        <span
                          className="text-sm text-[#172033]"
                          dangerouslySetInnerHTML={{
                            __html: katex.renderToString(step.working, { throwOnError: false }),
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Aria-live region for screen readers */}
                <div aria-live="polite" className="sr-only">
                  {revealed && mistakeStep
                    ? `Correct — the mistake is in ${mistakeStep.label}.`
                    : pickedIndex !== null
                      ? 'Not this line — try another.'
                      : ''}
                </div>

                {pickedIndex !== null && (
                  <div className="mt-5 rounded-2xl border-l-4 border-[#c9a227] bg-[#fffbeb] px-5 py-4">
                    {revealed ? (
                      <>
                        <p className="mb-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#c9a227]">What went wrong</p>
                        <p className="text-sm italic leading-7 text-[#5c4a1e]">
                          <MixedMath text={currentExample.explanation} />
                        </p>
                        <button
                          onClick={() => {
                            if (!isLastExample) {
                              setExampleIdx((i) => i + 1);
                            } else {
                              setExampleIdx(0);
                            }
                            setPickedIndex(null);
                          }}
                          className="mt-4 rounded-full bg-[#c9a227] px-6 py-2.5 text-sm font-black text-[#071629] transition hover:bg-[#e0bd4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2"
                        >
                          {isLastExample ? 'Start over' : 'Next example →'}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm italic leading-7 text-[#5c4a1e]">
                        Not this line — it follows correctly from the step before it. Try another line.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-[#fffdf8] px-5 pb-20 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#071629]/10 bg-white p-8 shadow-2xl shadow-[#071629]/8 md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#10233f] text-[#f1df9a]">
              <Quote className="h-8 w-8" />
            </div>
            <blockquote className="mx-auto max-w-3xl text-center font-serif text-2xl leading-snug tracking-[-0.03em] text-[#10233f] md:text-3xl">
              "The biggest change was not just marks. My child stopped saying, 'I'm bad at maths,' and started showing us how they solved the question."
            </blockquote>
            <p className="mt-6 text-center text-sm font-black uppercase tracking-[0.12em] text-[#c9a227]">Parent feedback</p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#071629] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 shadow-2xl md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a]">Next step</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white">
                Find the right maths starting point.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/66">
                Book an interview and we will help you work out whether your child needs confidence support, extension work, or HSC exam preparation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link to="/book-interview">
                <Button size="lg" className="h-12 w-full rounded-full bg-[#c9a227] px-7 font-black text-[#101521] hover:bg-[#e0bd4b]">
                  Book an Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:0401940207">
                <Button size="lg" variant="outline" className="h-12 w-full rounded-full border-white/30 bg-transparent px-7 font-bold text-white hover:bg-white/10 hover:text-white">
                  Call 0401 940 207
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
};

const SectionHeader = ({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) => (
  <div className="mb-10 grid gap-6 lg:grid-cols-[.85fr_1fr] lg:items-end">
    <div>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">{eyebrow}</p>
      <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">{title}</h2>
    </div>
    <p className="max-w-2xl text-base leading-8 text-[#61708a]">{text}</p>
  </div>
);

export default Mathematics;
