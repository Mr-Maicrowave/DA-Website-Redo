import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
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
  Users,
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

const IlluSpotify = ({ isOpen: _ }: { isOpen: boolean }) => {
  const bars = [22, 40, 54, 30, 48, 26, 44];
  const bW = 8, gap = 4;
  const sx = (120 - bars.length * (bW + gap) + gap) / 2;
  const base = 58;
  return (
    <svg viewBox="0 0 120 76" className="h-full w-full" aria-hidden="true">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={sx + i * (bW + gap)} y={base - h} width={bW} height={h} rx="3"
          fill="#c9a227" fillOpacity="0.72"
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center bottom',
            animation: `maths-barPulse ${1.0 + i * 0.14}s ease-in-out ${i * 0.09}s infinite`,
          }}
        />
      ))}
      <g opacity="0.35" stroke="#071629" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <line x1="28" y1="72" x2="72" y2="65" />
        <polygon points="67,62 75,65 67,68" fill="#071629" stroke="none" />
        <line x1="28" y1="65" x2="72" y2="72" />
        <polygon points="67,75 75,72 67,69" fill="#071629" stroke="none" />
      </g>
    </svg>
  );
};

const IlluSeismic = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 120 76" className="h-full w-full" aria-hidden="true">
    <polyline
      points="0,46 38,46 43,44 48,48 52,44 57,10 63,72 67,46 72,48 76,46 120,46"
      fill="none" stroke="#071629" strokeWidth="0.5" strokeOpacity="0.1" strokeLinejoin="round"
    />
    <polyline
      points="0,46 38,46 43,44 48,48 52,44 57,10 63,72 67,46 72,48 76,46 120,46"
      fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="350"
      style={{
        strokeDashoffset: isOpen ? 0 : 350,
        transition: isOpen ? 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' : 'none',
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
    topic: 'Probability',
    hook: "Why Spotify doesn't feel random",
    year: 'Years 9–10',
    fact: (
      <>
        Spotify&apos;s shuffle isn&apos;t truly random — it uses <strong>probability weighting</strong> so
        you don&apos;t hear the same artist <strong>twice in a row</strong>. Pure randomness felt too random.
      </>
    ),
    Illustration: IlluSpotify,
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

  const teachingSteps = [
    { title: 'Diagnose', text: 'Find the exact gaps, habits, and confidence blocks holding the student back.' },
    { title: 'Explain', text: 'Break concepts into clear steps with worked examples and guided practice.' },
    { title: 'Apply', text: 'Move from simple questions into exam-style problems with teacher feedback.' },
    { title: 'Refine', text: 'Build speed, accuracy, and independent problem-solving over time.' },
  ];

  const skills = [
    'Problem-solving strategies',
    'Mathematical reasoning',
    'Algebraic manipulation',
    'Geometric visualization',
    'Statistical interpretation',
    'Exam technique',
  ];

  const scrollToPathways = () => {
    document.getElementById('math-pathways')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('yr910');
  const [exampleIdx, setExampleIdx] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);

  const currentTab = ERROR_TABS.find((t) => t.id === activeTab)!;
  const currentExample = currentTab.examples[exampleIdx];
  const mistakeStep = currentExample.steps.find((s) => s.isMistake);
  const isLastExample = exampleIdx === currentTab.examples.length - 1;

  const [version, setVersion] = useState<string>('hsc');
  const [stepCount, setStepCount] = useState<number>(0);
  const currentVersion = WALKTHROUGH_VERSIONS.find((v) => v.id === version)!;

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
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/v3/teacher_whiteboard.jpg"
              alt="Mathematics tutoring at DA Tuition"
              className="h-full w-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fff6e7] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-24 lg:grid-cols-[1.05fr_.75fr] lg:px-8 lg:pb-28">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <Calculator className="h-4 w-4" />
                Years K-12 mathematics
              </div>
              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                Maths support that feels calm, clear, and serious.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                From times tables to Extension 2, DA Tuition helps students understand the method, practise with structure, and walk into assessments with confidence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/book-interview">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                    Book an Interview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToPathways}
                  className="h-12 rounded-full border-white/30 bg-white/10 px-7 font-bold text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
                >
                  Find the Right Level
                </Button>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
              className="self-end rounded-3xl border border-white/14 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-xl"
            >
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#f1df9a]">Parent quick check</p>
              <div className="mt-5 space-y-4">
                {['Unsure which maths level fits?', 'Worried about confidence?', 'Preparing for HSC exams?'].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 text-white">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#f1df9a]" />
                    <span className="text-sm font-semibold leading-6">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-white/90">
                Not sure where to start? Book an interview and we will work out the right level, class, and starting point together.
              </p>
            </motion.aside>
          </div>
        </section>

        {/* Anchor navigation */}
        <section className="-mt-10 px-5 lg:px-8">
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
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <style>{`
            @keyframes maths-phoneRock {
              0%   { transform: rotate(8deg);  }
              50%  { transform: rotate(-5deg); }
              100% { transform: rotate(8deg);  }
            }
            @keyframes maths-barPulse {
              0%, 100% { transform: scaleY(0.65); opacity: 0.42; }
              50%       { transform: scaleY(1);    opacity: 0.85; }
            }
            @keyframes maths-ripple {
              from { transform: scale(1);   opacity: 0.55; }
              to   { transform: scale(2.8); opacity: 0;    }
            }
            @keyframes maths-stepIn {
              from { opacity: 0; transform: translateY(-10px); }
              to   { opacity: 1; transform: translateY(0);     }
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

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {hscStreams.map((stream, index) => (
                <motion.article
                  key={stream.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="rounded-3xl border border-white/12 bg-white/[0.07] p-6 shadow-2xl shadow-black/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]"
                >
                  <span className="rounded-full bg-[#c9a227]/18 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#f1df9a]">{stream.badge}</span>
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.02em]">{stream.name}</h3>
                  <ul className="mt-5 space-y-3">
                    {stream.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-3 text-sm leading-6 text-white/72">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f1df9a]" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/12 bg-white/[0.06] p-6 md:flex-row md:items-center">
              <p className="max-w-3xl text-sm leading-7 text-white/70">
                Mathematics teachers include high-achieving subject specialists who help students move from knowing content to showing clear working under exam conditions.
              </p>
              <Link to="/hsc-excellence">
                <Button variant="outline" className="rounded-full border-white/30 bg-transparent font-bold text-white hover:bg-white/10 hover:text-white">
                  Explore HSC Program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How we teach */}
        <section id="math-method" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">How we teach</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Less panic. More method.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#61708a]">
                Maths feels more manageable when students know exactly what to do when a question is unfamiliar. We teach method alongside content so students build real confidence alongside their marks.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#24324a] shadow-sm">
                    <Calculator className="h-4 w-4 text-[#c9a227]" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {teachingSteps.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="rounded-3xl border border-[#071629]/10 bg-white p-6 shadow-lg shadow-[#071629]/5"
                >
                  <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#071629] text-sm font-black text-[#f1df9a]">{index + 1}</div>
                  <h3 className="text-xl font-black tracking-[-0.02em] text-[#10233f]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#61708a]">{step.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Learning format cards */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#071629]/10 bg-gradient-to-br from-[#f7fbff] to-[#e8f2ff] p-8 shadow-lg shadow-[#071629]/5">
              <Sparkles className="mb-5 h-10 w-10 text-[#10233f]" />
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#10233f]">Problem-Solving Workshops</h2>
              <p className="mt-4 text-sm leading-7 text-[#61708a]">
                For students aiming high in their class or tackling enrichment challenges. Focused sessions on harder problem types that go beyond the standard lesson program.
              </p>
              <Link to="/hsc-excellence" className="mt-6 inline-flex items-center text-sm font-black text-[#10233f]">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] border border-[#071629]/10 bg-gradient-to-br from-[#fffdf7] to-[#fff1cd] p-8 shadow-lg shadow-[#071629]/5">
              <Users className="mb-5 h-10 w-10 text-[#10233f]" />
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#10233f]">Small Groups and Classes</h2>
              <p className="mt-4 text-sm leading-7 text-[#61708a]">
                Our small group classes (3–5 students) give your child focused attention in a structured setting. Students are matched to a group that suits their current level and pace.
              </p>
              <Link to="/learning-formats" className="mt-6 inline-flex items-center text-sm font-black text-[#10233f]">
                Compare formats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Spot the Mistake — Exam Error Detective */}
        <section id="maths-interactive" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Can you spot what cost this student marks?
              </h2>
              <p className="mt-3 font-serif text-base italic text-[#9b8a6a]">
                Every example below is a real mistake type. Tap &ldquo;Reveal mistake&rdquo; when you&rsquo;ve found it.
              </p>
            </div>

            {/* Tab pills */}
            <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Year level">
              {ERROR_TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setExampleIdx(0);
                    setRevealed(false);
                  }}
                  className={`rounded-full px-5 py-2.5 text-sm font-black transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2 ${
                    activeTab === tab.id
                      ? 'bg-[#071629] text-[#f1df9a]'
                      : 'border border-[#071629]/15 bg-white text-[#10233f] hover:bg-[#f5ecd9]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Example card */}
            <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-2xl shadow-[#071629]/6">
              {/* Card header: counter + prev/next */}
              <div className="flex items-center justify-between border-b border-[#071629]/8 px-6 py-4">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#c9a227]">
                  Example {exampleIdx + 1} of {currentTab.examples.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setExampleIdx((i) => Math.max(0, i - 1));
                      setRevealed(false);
                    }}
                    disabled={exampleIdx === 0}
                    className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#10233f] transition hover:bg-[#f5ecd9] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => {
                      setExampleIdx((i) => Math.min(currentTab.examples.length - 1, i + 1));
                      setRevealed(false);
                    }}
                    disabled={isLastExample}
                    className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#10233f] transition hover:bg-[#f5ecd9] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-7 md:px-10">
                {/* Problem statement */}
                <div className="mb-7">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#9b8a6a]">Problem</p>
                  <p className="text-base font-semibold leading-7 text-[#071629]">
                    <MixedMath text={currentExample.problem} />
                  </p>
                </div>

                {/* Worked solution table */}
                <div className="mb-7">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[#9b8a6a]">Worked solution</p>
                  <div className="overflow-x-auto rounded-2xl border border-[#071629]/10">
                    <table className="w-full text-sm">
                      <tbody>
                        {currentExample.steps.map((step) => {
                          const isHighlighted = step.isMistake === true && revealed;
                          return (
                            <tr
                              key={step.label}
                              className="border-b border-[#071629]/6 last:border-0 transition-colors duration-200"
                              style={isHighlighted ? { background: '#fff8ed', borderLeft: '4px solid #c9a227' } : {}}
                            >
                              <td
                                className={`w-[5.5rem] whitespace-nowrap py-3.5 pl-4 pr-4 align-top text-xs ${
                                  step.label === 'Answer'
                                    ? 'font-black text-[#071629]'
                                    : 'font-mono font-bold text-[#9b8a6a]'
                                }`}
                              >
                                {step.label === 'Answer' ? 'Answer:' : step.label}
                              </td>
                              <td className="py-3.5 pr-4 text-[#172033]">
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: katex.renderToString(step.working, { throwOnError: false }),
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Aria-live region for screen readers */}
                <div aria-live="polite" className="sr-only">
                  {revealed && mistakeStep ? `The mistake is in ${mistakeStep.label}.` : ''}
                </div>

                {/* Action button */}
                {!revealed ? (
                  <button
                    onClick={() => setRevealed(true)}
                    className="rounded-full bg-[#071629] px-7 py-3 text-sm font-black text-white transition hover:bg-[#10233f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2"
                  >
                    Reveal mistake
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!isLastExample) {
                        setExampleIdx((i) => i + 1);
                      } else {
                        setExampleIdx(0);
                      }
                      setRevealed(false);
                    }}
                    className="rounded-full bg-[#c9a227] px-7 py-3 text-sm font-black text-[#071629] transition hover:bg-[#e0bd4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2"
                  >
                    {isLastExample ? 'Start over' : 'Next example →'}
                  </button>
                )}

                {/* Explanation block — visible after reveal */}
                {revealed && (
                  <div className="mt-5 rounded-2xl border-l-4 border-[#c9a227] bg-[#fffbeb] px-5 py-4">
                    <p className="mb-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#c9a227]">
                      What went wrong
                    </p>
                    <p className="text-sm italic leading-7 text-[#5c4a1e]">
                      <MixedMath text={currentExample.explanation} />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Problem walkthrough */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 grid gap-6 lg:grid-cols-[.85fr_1fr] lg:items-end">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Problem walkthrough</p>
                <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                  Watch a scary problem become easy.
                </h2>
              </div>
              <p className="text-base leading-8 text-[#61708a]">
                Tap "Show next step" to reveal the solution one step at a time. A thinking note explains the reasoning at each stage.
              </p>
            </div>

            {/* Version toggle */}
            <div className="mb-8">
              <div
                className="inline-flex rounded-full border border-[#071629]/10 bg-white p-1 shadow-sm"
                role="group"
                aria-label="Problem version"
              >
                {WALKTHROUGH_VERSIONS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setVersion(v.id); setStepCount(0); }}
                    className={`rounded-full px-5 py-2 text-sm font-black transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-1 ${
                      version === v.id
                        ? 'bg-[#071629] text-[#f1df9a]'
                        : 'text-[#10233f] hover:bg-[#f5ecd9]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem card */}
            <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-2xl shadow-[#071629]/6">
              <div className="border-b border-[#071629]/8 bg-[#f4f7ff] px-8 py-7">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#9b8a6a]">Problem</p>
                <p className="text-base font-semibold leading-7 text-[#071629]">{currentVersion.problem}</p>
              </div>

              <div className="px-6 py-7 md:px-10">
                <div className="divide-y divide-[#071629]/6" aria-live="polite">
                  {currentVersion.steps.slice(0, stepCount).map((step, idx) => (
                    <div
                      key={`${version}-step-${idx}`}
                      className="grid grid-cols-1 gap-4 py-5 first:pt-0 md:grid-cols-[3fr_2fr]"
                      style={{ animation: 'maths-stepIn 0.2s ease-out both' }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#071629] text-xs font-black text-[#f1df9a]">
                          {idx + 1}
                        </div>
                        <p className="text-[15px] leading-7 text-[#172033]">
                          <MixedMath text={step.content} />
                        </p>
                      </div>
                      <div className="rounded-xl border-l-4 border-[#c9a227] bg-[#fffbeb] px-4 py-3">
                        <p className="text-[12.5px] italic leading-[1.65] text-[#5c4a1e]">{step.note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={stepCount > 0 ? 'mt-6 border-t border-[#071629]/6 pt-6' : 'mt-2'}>
                  {stepCount < currentVersion.steps.length ? (
                    <button
                      onClick={() => setStepCount((c) => c + 1)}
                      className="rounded-full bg-[#071629] px-7 py-3 text-sm font-black text-white transition hover:bg-[#10233f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2"
                    >
                      Show next step →
                    </button>
                  ) : (
                    <button
                      onClick={() => setStepCount(0)}
                      className="rounded-full bg-[#c9a227] px-7 py-3 text-sm font-black text-[#071629] transition hover:bg-[#e0bd4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2"
                    >
                      Start again
                    </button>
                  )}
                </div>
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
