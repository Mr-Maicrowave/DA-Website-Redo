import { useEffect, useMemo, useRef, useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Calculator,
  CheckCircle,
  Clock,
  HelpCircle,
  Play,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import SEO from '@/components/SEO';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { createShieldTrace } from '@/features/graph-lab/fourier-shield';
import {
  DerivativeAmbientMoment,
  NetworkAmbientMoment,
  VectorAmbientMoment,
} from '@/features/maths-ambient-motion/MathsAmbientMotion';
import { ConfidenceJourney } from '@/features/maths-confidence-journey/ConfidenceJourney';
import { MathsGraphLabInvitation, MathsTeachingProof } from '@/features/maths-teaching-proof/MathsTeachingProof';
import { MathsIntroVideoGate } from '@/features/maths-intro-video/MathsIntroVideoGate';
import { HscMathsPathway } from '@/features/hsc-maths-pathway/HscMathsPathway';
import { MathsTopicNetwork } from '@/features/maths-topic-network/MathsTopicNetwork';
import { MathematicalFieldStation } from '@/features/mathematical-field-station/MathematicalFieldStation';
import { YearCube } from '@/features/year-cube/YearCube';

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

const MATHS_CLASS_OPTIONS = [
  {
    title: 'Private Maths Tuition',
    description: 'One-to-one lessons for students who need targeted explanations, tailored practice, and a pace built around their own goals.',
    image: '/english-page/images/subjects/english/class-private.png',
    alt: 'A tutor working one-to-one with a student',
    icon: UserRound,
    accent: '#b9a6e8',
    tint: '#f0edff',
  },
  {
    title: 'Small-Group Maths Classes',
    description: 'A consistent weekly class that builds strong foundations, gives students room to ask questions, and keeps them moving forward.',
    image: '/english-page/images/subjects/english/class-gat.png',
    alt: 'Students working together in a DA Tuition class',
    icon: UsersRound,
    accent: '#8ecfb2',
    tint: '#e7f6ee',
  },
  {
    title: 'School Focus Classes',
    description: 'Students from the same school learn in step with their classroom program, reinforcing the exact concepts and assessments they are facing.',
    image: '/english-page/images/subjects/english/class-focus.png',
    alt: 'A small group of students learning with a tutor',
    icon: Target,
    accent: '#82bceb',
    tint: '#e8f4ff',
  },
  {
    title: 'Selective & Trial Preparation',
    description: 'Purpose-built preparation for selective-school and school trial exams, with timed practice, problem-solving strategies, and clear feedback.',
    image: '/english-page/images/subjects/english/class-bullet.png',
    alt: 'Students completing focused classroom work',
    icon: TrendingUp,
    accent: '#f0b06d',
    tint: '#fff0df',
  },
] as const;

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

type BasketballStage = 'release' | 'barrier' | 'peak' | 'landing';

const BASKETBALL_STAGES: Record<BasketballStage, {
  label: string;
  prompt: string;
  equation: string;
  working: string[];
  explanation: string;
  time: number;
}> = {
  release: {
    label: '1. Release',
    prompt: 'Look for “initially”.',
    equation: 'h(0) = 1.6\\,\\mathrm{m}',
    working: [
      'h(t) = −4.9t² + 9.8t + 1.6',
      'h(0) = −4.9(0)² + 9.8(0) + 1.6',
      'h(0) = 1.6 m',
    ],
    explanation: '“Initially” means start at t = 0. The constant 1.6 tells us the ball leaves the player’s hands 1.6 metres above the ground.',
    time: 0,
  },
  peak: {
    label: '3. Highest point',
    prompt: 'Look for “maximum” or “highest”.',
    equation: 'h^{\\prime}(t) = -9.8t + 9.8 = 0',
    working: [
      'h′(t) = −9.8t + 9.8',
      '0 = −9.8t + 9.8',
      't = 1.0 s  →  h(1) = 6.5 m',
    ],
    explanation: 'At the highest point the ball is neither rising nor falling, so its gradient is zero. Solving gives t = 1.0 second, and h(1) = 6.5 metres.',
    time: 1,
  },
  barrier: {
    label: '2. The barrier',
    prompt: 'Turn distance into time first.',
    equation: 't = \\frac{d}{v} = \\frac{1.5}{6} = 0.25\\,\\mathrm{s}',
    working: [
      't = d ÷ v = 1.5 ÷ 6 = 0.25 s',
      'h(0.25) = −4.9(0.25)² + 9.8(0.25) + 1.6',
      'h(0.25) = 3.74 m > 3.0 m',
    ],
    explanation: 'The equation uses time, not horizontal distance. At 6 metres per second, the ball reaches a barrier 1.5 metres away after 0.25 seconds. Its height is 3.74 metres, so it clears a 3 metre barrier.',
    time: 0.25,
  },
  landing: {
    label: '4. Landing',
    prompt: 'Look for “hits the ground”.',
    equation: 'h(t) = 0 \\Rightarrow t \\approx 2.15\\,\\mathrm{s}',
    working: [
      '0 = −4.9t² + 9.8t + 1.6',
      '4.9t² − 9.8t − 1.6 = 0',
      't ≈ 2.15 s  (positive time)',
    ],
    explanation: 'The ball hits the ground when its height is zero. Solve h(t) = 0, then keep the positive time because the negative solution happened before the throw.',
    time: 2.1517,
  },
};

const renderLatex = (expression: string, displayMode: boolean) => katex.renderToString(expression, {
  displayMode,
  // Catch authoring mistakes during development instead of shipping raw red source text.
  throwOnError: import.meta.env.DEV,
});

const LatexBlock = ({ expression }: { expression: string }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: renderLatex(expression, true),
    }}
  />
);

const JourneyMath = ({ expression }: { expression: string }) => (
  <span className="inline-block align-baseline [&_.katex]:text-inherit" dangerouslySetInnerHTML={{ __html: renderLatex(expression, false) }} />
);

const BasketballCalculusJourney = () => {
  const [stage, setStage] = useState<BasketballStage>('release');
  const [ballTime, setBallTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [showQuadraticRoute, setShowQuadraticRoute] = useState(false);
  const animationFrame = useRef<number | null>(null);

  const left = 74;
  const right = 654;
  const top = 54;
  const base = 366;
  const maxTime = 2.3;
  const maxHeight = 8;
  const landingTime = 2.1517;
  const height = (time: number) => -4.9 * time * time + 9.8 * time + 1.6;
  const x = (time: number) => left + (time / maxTime) * (right - left);
  const y = (value: number) => base - (value / maxHeight) * (base - top);
  const curve = Array.from({ length: 90 }, (_, index) => {
    const time = (landingTime * index) / 89;
    return `${index === 0 ? 'M' : 'L'}${x(time).toFixed(1)},${y(Math.max(0, height(time))).toFixed(1)}`;
  }).join(' ');
  const ballX = x(ballTime);
  const ballY = y(Math.max(0, height(ballTime)));
  const mobileX = (time: number) => 48 + (time / maxTime) * 294;
  const mobileY = (value: number) => 264 - (value / maxHeight) * 204;
  const mobileCurve = Array.from({ length: 80 }, (_, index) => {
    const time = (landingTime * index) / 79;
    return `${index === 0 ? 'M' : 'L'}${mobileX(time).toFixed(1)},${mobileY(Math.max(0, height(time))).toFixed(1)}`;
  }).join(' ');
  const mobileBallX = mobileX(ballTime);
  const mobileBallY = mobileY(Math.max(0, height(ballTime)));
  const current = BASKETBALL_STAGES[stage];
  const isJourneyInProgress = journeyStep > 0 && !journeyComplete;
  const completedStages = (['release', 'barrier', 'peak', 'landing'] as BasketballStage[]).slice(0, journeyStep);

  const cancelAnimation = () => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    setIsPlaying(false);
  };

  const animateTo = (targetTime: number, onComplete?: () => void) => {
    const fromTime = ballTime;
    const startedAt = performance.now();
    const duration = Math.max(380, Math.abs(targetTime - fromTime) * 760);
    const frame = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setBallTime(fromTime + (targetTime - fromTime) * eased);
      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(frame);
      } else {
        animationFrame.current = null;
        onComplete?.();
      }
    };
    animationFrame.current = requestAnimationFrame(frame);
  };

  const selectStage = (nextStage: BasketballStage) => {
    cancelAnimation();
    setJourneyStep(0);
    setJourneyComplete(false);
    setShowQuadraticRoute(false);
    setStage(nextStage);
    animateTo(BASKETBALL_STAGES[nextStage].time);
  };

  const playJourney = () => {
    cancelAnimation();
    setIsPlaying(true);
    setStage('release');
    setBallTime(0);
    setJourneyStep(1);
    setJourneyComplete(false);
    setShowQuadraticRoute(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage('landing');
      setBallTime(landingTime);
      setJourneyStep(4);
      setJourneyComplete(true);
      return;
    }
    const startedAt = performance.now();
    // Long enough for students to follow the curve and absorb each prompt as it changes.
    const duration = 4500;
    const frame = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const time = landingTime * (1 - Math.pow(1 - progress, 3));
      setBallTime(time);
      if (time >= 1.75) {
        setStage('landing');
        setJourneyStep(4);
      } else if (time >= 0.7) {
        setStage('peak');
        setJourneyStep(3);
      } else if (time >= 0.12) {
        setStage('barrier');
        setJourneyStep(2);
      } else {
        setStage('release');
        setJourneyStep(1);
      }
      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(frame);
      } else {
        animationFrame.current = null;
        setStage('landing');
        setIsPlaying(false);
        setJourneyStep(4);
        setJourneyComplete(true);
      }
    };
    animationFrame.current = requestAnimationFrame(frame);
  };

  useEffect(() => () => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
  }, []);

  const showQuadraticMethod = () => {
    cancelAnimation();
    setStage('peak');
    setJourneyStep(3);
    setJourneyComplete(true);
    setShowQuadraticRoute(true);
    animateTo(BASKETBALL_STAGES.peak.time);
  };

  return (
    <section className="overflow-hidden bg-[#fffdf8] px-5 py-20 lg:px-8" aria-labelledby="basketball-calculus-heading">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(260px,.78fr)_minmax(0,1.22fr)] lg:items-start">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Maths in motion</p>
          <h2 id="basketball-calculus-heading" className="font-serif text-4xl font-medium leading-[1.03] tracking-[-0.04em] text-[#071629] sm:text-5xl">
            Read the question. Then read the curve.
          </h2>
          <p className="mt-5 max-w-[42ch] text-base leading-8 text-[#61708a]">
            An HSC Advanced and Extension preview: each part of the question points to a different mathematical decision.
          </p>

          <aside className="mt-7 rounded-[1.5rem] border border-[#d9ceb1] bg-[#fffaf0] p-5 shadow-[0_16px_36px_rgba(7,22,41,0.07)]" aria-label="Exam-style basketball question">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a6812]">Exam-style question</p>
            <p className="mt-3 font-serif text-xl leading-7 text-[#071629]">A high basketball lob is modelled by <JourneyMath expression={'h(t) = -4.9t^2 + 9.8t + 1.6'} />.</p>
            <p className="mt-3 text-sm leading-6 text-[#536077]">The ball travels horizontally at a constant 6 m/s, over a 3 m training screen placed 1.5 m from the player.</p>
            <ol className="mt-4 space-y-2 border-t border-[#d9ceb1] pt-4 text-sm leading-6 text-[#253956]">
              <li><strong>(a)</strong> Find the ball’s initial height.</li>
              <li><strong>(b)</strong> Decide whether it clears the barrier.</li>
              <li><strong>(c)</strong> Find its maximum height.</li>
              <li className="text-[#61708a]"><strong>Extension:</strong> Find when it lands.</li>
            </ol>
          </aside>

          <div className="mt-8 flex flex-wrap gap-2" aria-label="Choose a point in the basketball journey">
            {(['release', 'barrier', 'peak', 'landing'] as BasketballStage[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => selectStage(key)}
                aria-pressed={stage === key}
                className={`min-h-11 rounded-full px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2 ${
                  stage === key ? 'bg-[#071629] text-[#f1df9a]' : 'border border-[#071629]/15 bg-transparent text-[#4f5c70] hover:border-[#c9a227]/60 hover:text-[#071629]'
                }`}
              >
                {BASKETBALL_STAGES[key].label}
              </button>
            ))}
            <button
              type="button"
              onClick={playJourney}
              className="inline-flex min-h-11 items-center rounded-full bg-[#c9a227] px-4 text-sm font-black text-[#071629] transition hover:bg-[#e0bd4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2"
            >
              <Play className="mr-2 h-4 w-4" fill="currentColor" aria-hidden="true" />
              {isPlaying ? 'Playing…' : 'Play journey'}
            </button>
          </div>

          {journeyStep === 0 ? (
            <div className="mt-7 border-t border-[#d9ceb1] pt-5" aria-live="polite">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#c9a227]">{current.label}</p>
              <p className="mt-3 font-serif text-2xl font-medium tracking-[-0.02em] text-[#071629]">{current.prompt}</p>
              <div className="mt-4 text-xl text-[#8a6812] [&_.katex-display]:my-0 [&_.katex-display]:text-left">
                <LatexBlock expression={current.equation} />
              </div>
              <p className="mt-4 max-w-[47ch] text-sm leading-7 text-[#536077]">{current.explanation}</p>
            </div>
          ) : null}
          {isJourneyInProgress ? (
            <div className="mt-7 border-t border-[#d9ceb1] pt-5" aria-live="polite">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#c9a227]">Current step: {current.label}</p>
              <p className="mt-2 text-sm leading-6 text-[#536077]">{current.prompt}</p>
              <div className="mt-3 text-lg text-[#8a6812] [&_.katex-display]:my-0 [&_.katex-display]:text-left">
                <LatexBlock expression={current.equation} />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#253956]">Completed so far: {completedStages.map((key) => BASKETBALL_STAGES[key].label).join(' · ')}</p>
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="relative hidden md:block">
            <div className="absolute left-[14%] top-[7%] z-10 text-xl text-[#071629] [&_.katex-display]:my-0">
              <LatexBlock expression={'h(t) = -4.9t^2 + 9.8t + 1.6'} />
            </div>
          <svg viewBox="0 0 720 476" className="block h-auto w-full" role="img" aria-labelledby="basketball-graph-title basketball-graph-description">
            <title id="basketball-graph-title">Height of a basketball over time</title>
            <desc id="basketball-graph-description">A three-dimensional teaching diagram of a basketball following the height function h of t equals negative 4 point 9 t squared plus 9 point 8 t plus 1 point 6. It shows release, a three metre barrier, and the highest point.</desc>
            <defs>
              <pattern id="basketball-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#071629" strokeOpacity="0.07" strokeWidth="1" />
              </pattern>
              <linearGradient id="basketball-floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d8c27c" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#071629" stopOpacity="0.12" />
              </linearGradient>
              <radialGradient id="basketball-ball" cx="32%" cy="24%" r="72%">
                <stop offset="0%" stopColor="#f8e681" />
                <stop offset="60%" stopColor="#d5ad22" />
                <stop offset="100%" stopColor="#a7790b" />
              </radialGradient>
              <filter id="basketball-shadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#071629" floodOpacity="0.26" />
              </filter>
            </defs>
            <rect x="48" y="34" width="636" height="350" fill="url(#basketball-grid)" rx="6" />
            <path d={`M${left},${base} H${right} L${right + 38},420 H${left - 28} Z`} fill="url(#basketball-floor)" />
            {[0.15, 0.35, 0.58, 0.82].map((depth) => (
              <line key={`floor-${depth}`} x1={left - 28 + (right - left + 66) * depth / 2} y1="420" x2={left + (right - left) * depth} y2={base} stroke="#071629" strokeOpacity="0.09" />
            ))}
            {[0, 2, 4, 6, 8].map((tick) => (
              <g key={`height-${tick}`}>
                <line x1={left} y1={y(tick)} x2={right} y2={y(tick)} stroke="#071629" strokeOpacity="0.08" />
                <text x="52" y={y(tick) + 5} fill="#61708a" fontSize="12">{tick}</text>
              </g>
            ))}
            {[0, 0.5, 1, 1.5, 2].map((tick) => (
              <g key={`time-${tick}`}>
                <line x1={x(tick)} y1={top} x2={x(tick)} y2={base} stroke="#071629" strokeOpacity="0.06" />
                <text x={x(tick) - 8} y="410" fill="#61708a" fontSize="12">{tick}</text>
              </g>
            ))}
            {[0, 1.5, 3, 6, 9, 12].map((distance) => {
              const distanceX = x(distance / 6);
              const isBarrier = distance === 1.5;
              return (
                <g key={`distance-${distance}`}>
                  <line x1={distanceX} y1="423" x2={distanceX} y2="429" stroke={isBarrier ? '#c9a227' : '#61708a'} strokeWidth={isBarrier ? '2' : '1'} />
                  <text x={distanceX} y="443" textAnchor="middle" fill={isBarrier ? '#8a6812' : '#61708a'} fontSize="11" fontWeight={isBarrier ? '700' : '400'}>{distance}</text>
                </g>
              );
            })}
            <line x1={left} y1={base} x2={right + 16} y2={base} stroke="#071629" strokeWidth="2" />
            <line x1={left} y1={base} x2={left} y2={top - 15} stroke="#071629" strokeWidth="2" />
            <path d={`M${right + 16},${base} l-8,-5 v10 Z`} fill="#071629" />
            <path d={`M${left},${top - 15} l-5,8 h10 Z`} fill="#071629" />
            <text x="616" y="410" fill="#61708a" fontSize="12">time t (s)</text>
            <text x="616" y="462" fill="#61708a" fontSize="12">distance x (m)</text>
            <text x="76" y="462" fill="#61708a" fontSize="11">x = 6t</text>
            <text x="22" y="252" fill="#61708a" fontSize="12" transform="rotate(-90 22 252)">height (m)</text>
            <path d={curve} fill="none" stroke="#071629" strokeWidth="4" strokeLinecap="round" />
            <g aria-label="Three metre barrier, one point five metres from the shooter">
              <rect x={x(BASKETBALL_STAGES.barrier.time) - 7} y={y(3)} width="14" height={base - y(3)} rx="3" fill="#253956" filter="url(#basketball-shadow)" />
              <path d={`M${x(BASKETBALL_STAGES.barrier.time) - 7},${y(3)} h14 l6,-6 h-14 Z`} fill="#d8c27c" />
              <text x={x(BASKETBALL_STAGES.barrier.time) + 18} y={y(3) + 4} fill="#8a6812" fontSize="12" fontWeight="700">3 m training screen</text>
              <text x={x(BASKETBALL_STAGES.barrier.time) + 18} y={y(3) + 21} fill="#61708a" fontSize="11">1.5 m away</text>
            </g>
            {(Object.keys(BASKETBALL_STAGES) as BasketballStage[]).map((key) => {
              const marker = BASKETBALL_STAGES[key];
              const markerX = x(marker.time);
              const markerY = y(Math.max(0, height(marker.time)));
              return (
                <g key={key} opacity={stage === key ? 1 : 0.42}>
                  <circle cx={markerX} cy={markerY} r={stage === key ? 8 : 5} fill={stage === key ? '#c9a227' : '#61708a'} />
                </g>
              );
            })}
            <line x1={ballX} y1={base} x2={ballX} y2={ballY} stroke="#c9a227" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.75" />
            <ellipse cx={ballX + 8} cy={base + 9} rx="18" ry="4" fill="#071629" opacity={Math.max(0.1, 0.32 - (height(ballTime) / maxHeight) * 0.25)} />
            <g transform={`translate(${ballX} ${ballY})`}>
              <circle r="17" fill="url(#basketball-ball)" stroke="#fffdf8" strokeWidth="3" filter="url(#basketball-shadow)" />
              <circle cx="-5" cy="-6" r="3" fill="#fff7cf" opacity="0.74" />
              <path d="M-15 0H15M0-15C8-8 8 8 0 15M0-15C-8-8-8 8 0 15" fill="none" stroke="#071629" strokeWidth="1.3" />
            </g>
            {stage === 'release' && <text x={ballX + 18} y={ballY - 14} fill="#8a6812" fontSize="13" fontWeight="700">(0, 1.6)</text>}
            {stage === 'barrier' && <text x={ballX + 16} y={ballY - 14} fill="#8a6812" fontSize="13" fontWeight="700">h(0.25) = 3.74 m</text>}
            {stage === 'peak' && <text x={ballX - 38} y={ballY - 24} fill="#8a6812" fontSize="13" fontWeight="700">max: (1.0, 6.5)</text>}
            {stage === 'landing' && <text x={ballX - 62} y={ballY - 30} fill="#8a6812" fontSize="13" fontWeight="700">lands: 2.15 s</text>}
            {showQuadraticRoute && (
              <g>
                <path d={`M${ballX + 16},${ballY - 6} L${ballX + 78},${ballY - 38}`} fill="none" stroke="#c9a227" strokeWidth="1.5" />
                <text x={ballX + 84} y={ballY - 42} fill="#8a6812" fontSize="13" fontWeight="700">axis of symmetry</text>
                <text x={ballX + 84} y={ballY - 24} fill="#61708a" fontSize="12">t = −b / 2a = 1.0</text>
              </g>
            )}
          </svg>
          </div>
          <p className="mt-1 hidden text-center text-xs font-semibold text-[#536077] md:block">Horizontal distance and time are linked: <JourneyMath expression={'x = 6t'} />. The screen at <JourneyMath expression={'x = 1.5'} /> is reached at <JourneyMath expression={'t = 0.25\\,\\mathrm{s}'} />.</p>
          <div className="md:hidden">
            <div className="mb-3 text-center text-lg text-[#071629] [&_.katex-display]:my-0">
              <LatexBlock expression={'h(t) = -4.9t^2 + 9.8t + 1.6'} />
            </div>
            <svg viewBox="0 0 390 318" className="block h-auto w-full" role="img" aria-labelledby="basketball-mobile-graph-title basketball-mobile-graph-description">
              <title id="basketball-mobile-graph-title">Basketball height over time</title>
              <desc id="basketball-mobile-graph-description">A simplified mobile graph showing a high basketball lob clear a three metre training screen, reach its highest point, and land.</desc>
              <defs>
                <radialGradient id="basketball-mobile-ball" cx="32%" cy="24%" r="72%">
                  <stop offset="0%" stopColor="#f8e681" />
                  <stop offset="62%" stopColor="#d5ad22" />
                  <stop offset="100%" stopColor="#a7790b" />
                </radialGradient>
              </defs>
              {[0, 2, 4, 6, 8].map((tick) => <g key={`mobile-y-${tick}`}><line x1="48" y1={mobileY(tick)} x2="342" y2={mobileY(tick)} stroke="#071629" strokeOpacity="0.08" /><text x="35" y={mobileY(tick) + 4} textAnchor="end" fill="#536077" fontSize="13">{tick}</text></g>)}
              <line x1="48" y1="264" x2="350" y2="264" stroke="#071629" strokeWidth="2" />
              <line x1="48" y1="264" x2="48" y2="35" stroke="#071629" strokeWidth="2" />
              <path d={mobileCurve} fill="none" stroke="#071629" strokeWidth="4" strokeLinecap="round" />
              <line x1={mobileX(0.25)} y1="264" x2={mobileX(0.25)} y2={mobileY(3)} stroke="#c9a227" strokeDasharray="4 4" strokeWidth="1.5" />
              <rect x={mobileX(0.25) - 7} y={mobileY(3)} width="14" height={264 - mobileY(3)} rx="3" fill="#253956" />
              <text x={mobileX(0.25) + 13} y={mobileY(3) - 9} fill="#8a6812" fontSize="13" fontWeight="700">3 m screen</text>
              <circle cx={mobileBallX} cy={mobileBallY} r="15" fill="url(#basketball-mobile-ball)" stroke="#fffdf8" strokeWidth="3" />
              <path d={`M${mobileBallX - 13} ${mobileBallY}H${mobileBallX + 13} M${mobileBallX} ${mobileBallY - 13}C${mobileBallX + 7} ${mobileBallY - 7} ${mobileBallX + 7} ${mobileBallY + 7} ${mobileBallX} ${mobileBallY + 13} M${mobileBallX} ${mobileBallY - 13}C${mobileBallX - 7} ${mobileBallY - 7} ${mobileBallX - 7} ${mobileBallY + 7} ${mobileBallX} ${mobileBallY + 13}`} fill="none" stroke="#071629" strokeWidth="1.2" />
              <text x="250" y="292" fill="#536077" fontSize="13">time, t (seconds)</text>
              <text x="15" y="180" fill="#536077" fontSize="13" transform="rotate(-90 15 180)">height (m)</text>
              {stage === 'release' && <text x={mobileBallX + 16} y={mobileBallY - 12} fill="#8a6812" fontSize="13" fontWeight="700">1.6 m</text>}
              {stage === 'barrier' && <text x={mobileBallX + 16} y={mobileBallY - 12} fill="#8a6812" fontSize="13" fontWeight="700">3.74 m</text>}
              {stage === 'peak' && <text x={mobileBallX - 27} y={mobileBallY - 20} fill="#8a6812" fontSize="13" fontWeight="700">6.5 m</text>}
              {stage === 'landing' && <text x={mobileBallX - 43} y={mobileBallY - 16} fill="#8a6812" fontSize="13" fontWeight="700">2.15 s</text>}
            </svg>
            <p className="mt-3 text-center text-sm leading-6 text-[#536077]">Horizontal distance uses <JourneyMath expression={'x = 6t'} />: the screen at <JourneyMath expression={'x = 1.5\\,\\mathrm{m}'} /> is reached at <JourneyMath expression={'t = 0.25\\,\\mathrm{s}'} />.</p>
          </div>
        </div>
      </div>
      {journeyComplete && (
        <div className="mx-auto mt-12 max-w-4xl border-y border-[#d9ceb1] py-8 text-center" aria-live="polite" aria-label={showQuadraticRoute ? 'Quadratic alternative solution' : 'Full worked solution'}>
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#8a6812]">
            {showQuadraticRoute ? 'Another valid route' : 'Full worked journey'}
          </p>
          <div className="mx-auto mt-6 max-w-full px-2 text-center text-[0.78rem] text-[#253956] sm:text-base lg:text-xl [&_.katex-display]:my-2 [&_.katex-display]:overflow-visible">
            {showQuadraticRoute ? (
              <>
                <LatexBlock expression={'t_{\\mathrm{axis}} = -\\frac{b}{2a} = -\\frac{9.8}{2(-4.9)} = 1.0\\,\\mathrm{s}'} />
                <LatexBlock expression={'h(1) = -4.9(1)^2 + 9.8(1) + 1.6 = 6.5\\,\\mathrm{m}'} />
              </>
            ) : (
              <>
                <LatexBlock expression={'h(0) = 1.6\\,\\mathrm{m}'} />
                <LatexBlock expression={'t_{\\mathrm{barrier}} = \\frac{d}{v} = \\frac{1.5}{6} = 0.25\\,\\mathrm{s}'} />
                <LatexBlock expression={'\\begin{aligned} h(0.25) &= -4.9(0.25)^2 \\\\ &\\quad + 9.8(0.25) + 1.6 \\\\ &= 3.74\\,\\mathrm{m} > 3.0\\,\\mathrm{m} \\end{aligned}'} />
                <LatexBlock expression={'h^{\\prime}(t) = -9.8t + 9.8 = 0 \\Rightarrow t = 1.0\\,\\mathrm{s}'} />
                <LatexBlock expression={'h(1) = 6.5\\,\\mathrm{m}'} />
                <LatexBlock expression={'h(t) = 0 \\Rightarrow t \\approx 2.15\\,\\mathrm{s}'} />
              </>
            )}
          </div>
          {journeyComplete && !showQuadraticRoute && (
            <button
              type="button"
              onClick={showQuadraticMethod}
              className="mt-6 text-sm font-black text-[#071629] underline decoration-[#c9a227] decoration-2 underline-offset-4 transition hover:text-[#8a6812] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]"
            >
              See the quadratic route to the same maximum
            </button>
          )}
          {showQuadraticRoute && (
            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#536077]">The axis of symmetry points to the same highest point shown on the graph.</p>
          )}
        </div>
      )}
    </section>
  );
};

const FOURIER_TERMS = [1, 3, 5, 7, 9, 11, 13];

const fourierWave = (x: number, terms: number) => {
  let value = 0;
  for (let i = 0; i < terms; i += 1) {
    const harmonic = FOURIER_TERMS[i];
    value += (4 / Math.PI) * Math.sin(harmonic * x) / harmonic;
  }
  return value;
};

const fourierPath = (mode: 'square' | 'sum' | number, terms: number, width = 360, height = 142) => {
  const points = 180;
  const path = Array.from({ length: points }, (_, index) => {
    const x = -Math.PI * 2 + (index / (points - 1)) * Math.PI * 4;
    const value = mode === 'square'
      ? (Math.sin(x) >= 0 ? 1 : -1)
      : mode === 'sum'
        ? fourierWave(x, terms)
        : (4 / Math.PI) * Math.sin(mode * x) / mode;
    const px = (index / (points - 1)) * width;
    const py = height / 2 - value * (height * 0.34);
    return `${index === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`;
  });
  return path.join(' ');
};

const FourierGraph = ({
  title,
  path,
  color,
  subtitle,
}: {
  title: string;
  path: string;
  color: string;
  subtitle: string;
}) => (
  <div className="rounded-2xl border border-[#071629]/10 bg-[#fffdf8] p-3 sm:p-4">
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <p className="text-sm font-black text-[#071629]">{title}</p>
      <p className="text-[11px] font-semibold text-[#7d8798]">{subtitle}</p>
    </div>
    <svg viewBox="0 0 360 142" className="h-auto w-full" role="img" aria-label={title}>
      {[26, 61, 96, 131].map((y) => <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#071629" strokeOpacity="0.08" />)}
      {[45, 135, 225, 315].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="142" stroke="#071629" strokeOpacity="0.08" />)}
      <line x1="0" y1="71" x2="360" y2="71" stroke="#071629" strokeOpacity="0.24" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const FourierDecomposition = () => {
  const [terms, setTerms] = useState(3);
  const activeHarmonics = FOURIER_TERMS.slice(0, terms);
  const equation = activeHarmonics
    .map((harmonic, index) => `${index === 0 ? '' : ' + '}\\frac{4}{${harmonic}\\pi}\\sin(${harmonic}x)`)
    .join('');

  return (
    <section id="fourier-waves" className="overflow-hidden bg-[#f3f7fb] px-5 py-20 lg:px-8" aria-labelledby="fourier-heading">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#b174bd]">Now take it apart</p>
            <h2 id="fourier-heading" className="font-serif text-4xl font-medium leading-[1.04] tracking-[-0.045em] text-[#071629] sm:text-5xl">
              One picture.<br />Many simple waves.
            </h2>
            <p className="mt-5 max-w-[44ch] text-base leading-8 text-[#536077]">
              The rotating arrows above are built from the same idea: a complicated pattern can be analysed as a combination of simple sinusoidal waves.
            </p>
            <div className="mt-7 rounded-2xl border border-[#071629]/10 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="fourier-terms" className="text-sm font-black text-[#071629]">Add harmonics</label>
                <span className="rounded-full bg-[#071629] px-3 py-1 text-xs font-black text-[#f1df9a]">{terms} terms</span>
              </div>
              <input
                id="fourier-terms"
                type="range"
                min="1"
                max={FOURIER_TERMS.length}
                value={terms}
                onChange={(event) => setTerms(Number(event.target.value))}
                className="mt-5 h-2 w-full cursor-pointer accent-[#b174bd]"
                aria-describedby="fourier-terms-help"
              />
              <p id="fourier-terms-help" className="mt-3 text-sm leading-6 text-[#536077]">More terms make the approximation look more like the original square wave.</p>
            </div>
          </div>

          <div className="relative flex flex-col rounded-[1.75rem] border border-[#071629]/10 bg-white p-4 shadow-[0_18px_45px_rgba(7,22,41,0.08)] sm:p-6 lg:h-[520px] lg:min-h-0">
            <div className="pointer-events-none absolute inset-x-12 top-1/2 hidden h-px bg-[#b174bd]/20 lg:block" />
            <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[1fr_1.08fr] md:items-center">
              <FourierGraph title="Original waveform" subtitle="time" path={fourierPath('square', terms)} color="#c51f3a" />
              <div className="grid min-w-0 gap-2 md:grid-cols-2">
                {FOURIER_TERMS.slice(0, 4).map((harmonic, index) => activeHarmonics.includes(harmonic) ? (
                  <FourierGraph
                    key={harmonic}
                    title={`Harmonic ${harmonic}`}
                    subtitle={`1 / ${harmonic}`}
                    path={fourierPath(harmonic, terms)}
                    color={['#5d568e', '#8e4d8c', '#b174bd', '#d18ab8'][index]}
                  />
                ) : <div key={harmonic} className="invisible" aria-hidden="true"><FourierGraph title={`Harmonic ${harmonic}`} subtitle={`1 / ${harmonic}`} path={fourierPath(harmonic, terms)} color="#5d568e" /></div>)}
                {terms > 4 && <p className="px-2 text-center text-xs font-bold text-[#7d8798]">+ {terms - 4} more sinusoidal component{terms - 4 === 1 ? '' : 's'}</p>}
              </div>
            </div>
            <div className="mt-4 min-w-0 shrink-0 overflow-hidden rounded-xl bg-[#071629] px-4 py-4 text-center text-[#f5e8bc] sm:px-6">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#b174bd]">Current approximation</p>
              <div className="min-w-0 overflow-x-auto text-sm sm:text-base [&_.katex-display]:my-0 [&_.katex-display]:whitespace-nowrap" dangerouslySetInnerHTML={{ __html: katex.renderToString(`f(x) \\approx ${equation}`, { throwOnError: false, displayMode: true }) }} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-[#071629]/10 bg-white p-4 sm:p-5">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="text-sm font-black text-[#071629]">Reconstructed signal</p>
              <p className="text-[11px] font-semibold text-[#7d8798]">time → amplitude</p>
            </div>
            <svg viewBox="0 0 720 158" className="h-auto w-full" role="img" aria-label="Fourier series approximation of the original waveform">
              {[28, 67, 106, 145].map((y) => <line key={y} x1="0" y1={y} x2="720" y2={y} stroke="#071629" strokeOpacity="0.08" />)}
              <line x1="0" y1="79" x2="720" y2="79" stroke="#071629" strokeOpacity="0.24" />
              <path d={fourierPath('square', terms, 720, 158)} fill="none" stroke="#c51f3a" strokeOpacity="0.22" strokeWidth="2" strokeDasharray="5 6" />
              <path d={fourierPath('sum', terms, 720, 158)} fill="none" stroke="#b174bd" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-[#536077]"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#b174bd]" />sum of terms</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#c51f3a]/30" />original waveform</span></div>
          </div>
          <div className="rounded-2xl border border-[#071629]/10 bg-[#fffaf0] p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6812]">Frequency view</p>
            <p className="mt-2 text-sm leading-6 text-[#536077]">The tall peaks reveal which frequencies are present in the original signal.</p>
            <svg viewBox="0 0 360 116" className="mt-4 h-auto w-full" role="img" aria-label="Frequency spectrum with peaks at odd harmonics">
              <line x1="12" y1="96" x2="348" y2="96" stroke="#071629" strokeOpacity="0.25" />
              {activeHarmonics.map((harmonic) => {
                const x = 28 + (harmonic / 13) * 300;
                const barHeight = 68 / harmonic;
                return <g key={harmonic}><line x1={x} y1={96 - barHeight} x2={x} y2="96" stroke="#b174bd" strokeWidth="7" strokeLinecap="round" /><text x={x} y="111" textAnchor="middle" fill="#536077" fontSize="10">{harmonic}ω</text></g>;
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FourierPoint {
  x: number;
  y: number;
}

interface FourierCoefficient extends FourierPoint {
  frequency: number;
  amplitude: number;
  phase: number;
}

type DrawingPreset = 'da-logo' | 'fourier' | 'heart';

const DRAWING_PRESETS: Array<{ id: DrawingPreset; label: string; description: string; imageSrc?: string; imageAlt?: string }> = [
  { id: 'da-logo', label: 'DA Tuition', description: 'Traced from the DA mark', imageSrc: '/images/da-logo.png', imageAlt: 'DA Tuition logo' },
  { id: 'fourier', label: 'Joseph Fourier', description: 'Traced from a public-domain portrait', imageSrc: '/fourier-joseph-portrait.jpg', imageAlt: 'Engraved portrait of Joseph Fourier' },
  { id: 'heart', label: 'Heart', description: 'A simple control shape' },
];

const drawingPoints = (preset: DrawingPreset, count = 240): FourierPoint[] => {
  if (preset === 'da-logo') return createShieldTrace(count);
  return Array.from({ length: count }, (_, index) => {
  const t = (index / count) * Math.PI * 2;
  if (preset === 'fourier') {
    // A stylised, continuous bust/profile line for Joseph Fourier.
    const points = [
      { x: -18, y: -96 }, { x: 20, y: -90 }, { x: 38, y: -70 },
      { x: 31, y: -49 }, { x: 48, y: -33 }, { x: 30, y: -25 },
      { x: 27, y: -5 }, { x: 49, y: 24 }, { x: 66, y: 72 },
      { x: 34, y: 88 }, { x: -44, y: 84 }, { x: -65, y: 36 },
      { x: -43, y: -8 }, { x: -48, y: -46 }, { x: -18, y: -96 },
    ];
    const u = (index / (count - 1)) * (points.length - 1);
    const segment = Math.min(points.length - 2, Math.floor(u));
    const local = u - segment;
    const start = points[segment];
    const end = points[segment + 1];
    return { x: start.x + (end.x - start.x) * local, y: start.y + (end.y - start.y) * local };
  }
  if (preset === 'heart') {
    return {
      x: 4.8 * (16 * Math.sin(t) ** 3),
      y: -4.8 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    };
  }
  if (preset === 'star') {
    const radius = index % 2 === 0 ? 92 : 42;
    return { x: radius * Math.cos(t - Math.PI / 2), y: radius * Math.sin(t - Math.PI / 2) };
  }
  return { x: 92 * Math.sin(3 * t), y: 72 * Math.sin(2 * t + Math.PI / 4) };
  });
};

const calculateFourierCoefficients = (points: FourierPoint[], count: number): FourierCoefficient[] => {
  const frequencies = Array.from({ length: count * 2 + 1 }, (_, index) => index - count);
  return frequencies
    .map((frequency) => {
      const coefficient = points.reduce((sum, point, index) => {
        const t = (index / points.length) * Math.PI * 2;
        const angle = frequency * t;
        return {
          x: sum.x + (point.x * Math.cos(angle) + point.y * Math.sin(angle)) / points.length,
          y: sum.y + (point.y * Math.cos(angle) - point.x * Math.sin(angle)) / points.length,
        };
      }, { x: 0, y: 0 });
      return {
        frequency,
        x: coefficient.x,
        y: coefficient.y,
        amplitude: Math.hypot(coefficient.x, coefficient.y),
        phase: Math.atan2(coefficient.y, coefficient.x),
      };
    })
    .sort((a, b) => b.amplitude - a.amplitude);
};

const epicycleState = (coefficients: FourierCoefficient[], progress: number) => {
  let point = { x: 0, y: 0 };
  const centres: FourierPoint[] = [];
  coefficients.forEach((coefficient) => {
    centres.push({ ...point });
    const angle = coefficient.phase + coefficient.frequency * progress * Math.PI * 2;
    point = {
      x: point.x + coefficient.amplitude * Math.cos(angle),
      y: point.y + coefficient.amplitude * Math.sin(angle),
    };
  });
  return { centres, tip: point };
};

const pathFromPoints = (points: FourierPoint[], offsetX = 180, offsetY = 130) => points
  .map((point, index) => `${index === 0 ? 'M' : 'L'}${(point.x + offsetX).toFixed(2)},${(point.y + offsetY).toFixed(2)}`)
  .join(' ');

const FourierDrawing = () => {
  const [preset, setPreset] = useState<DrawingPreset>('da-logo');
  const [vectors, setVectors] = useState(31);
  const [progress, setProgress] = useState(0);
  const [trace, setTrace] = useState<FourierPoint[]>([]);
  const [sourcePoints, setSourcePoints] = useState<FourierPoint[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Only the drawing itself should gate the loop, not the whole two-column section —
  // a generous margin keeps it running while the SVG is merely near the viewport.
  const isInView = useInView(sectionRef, { margin: '200px 0px 200px 0px' });
  const selectedPreset = DRAWING_PRESETS.find((option) => option.id === preset)!;
  const points = useMemo(() => preset === 'da-logo' ? drawingPoints(preset) : (sourcePoints.length > 0 ? sourcePoints : drawingPoints(preset)), [preset, sourcePoints]);
  const coefficients = useMemo(() => calculateFourierCoefficients(points, 60).slice(0, vectors), [points, vectors]);
  const { centres, tip } = epicycleState(coefficients, progress);

  useEffect(() => {
    if (selectedPreset.id === 'da-logo') {
      setSourcePoints([]);
      return undefined;
    }
    if (!selectedPreset.imageSrc) {
      setSourcePoints([]);
      return undefined;
    }
    const image = new Image();
    image.src = selectedPreset.imageSrc;
    image.onload = () => {
      const size = 240;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      context.clearRect(0, 0, size, size);
      const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      const pixels = context.getImageData(0, 0, size, size).data;
      const foreground = new Uint8Array(size * size);
      for (let index = 0; index < size * size; index += 1) {
        const pixel = index * 4;
        const alpha = pixels[pixel + 3];
        const luminance = (pixels[pixel] + pixels[pixel + 1] + pixels[pixel + 2]) / 3;
        foreground[index] = selectedPreset.id === 'da-logo' ? (alpha > 32 ? 1 : 0) : (luminance < 200 ? 1 : 0);
      }
      // Thicken the engraving strokes so the portrait becomes one connected silhouette.
      for (let pass = 0; pass < 4; pass += 1) {
        const expanded = foreground.slice();
        for (let y = 1; y < size - 1; y += 1) {
          for (let x = 1; x < size - 1; x += 1) {
            const index = y * size + x;
            if (foreground[index] || foreground[index - 1] || foreground[index + 1] || foreground[index - size] || foreground[index + size]) expanded[index] = 1;
          }
        }
        foreground.set(expanded);
      }
      const visited = new Uint8Array(size * size);
      let largestComponent: number[] = [];
      for (let start = 0; start < foreground.length; start += 1) {
        if (!foreground[start] || visited[start]) continue;
        const queue = [start];
        const component: number[] = [];
        visited[start] = 1;
        while (queue.length > 0) {
          const current = queue.pop()!;
          component.push(current);
          const x = current % size;
          const y = Math.floor(current / size);
          for (const neighbour of [current - 1, current + 1, current - size, current + size]) {
            const neighbourX = neighbour % size;
            if (neighbour >= 0 && neighbour < foreground.length && Math.abs(neighbourX - x) <= 1 && foreground[neighbour] && !visited[neighbour]) {
              visited[neighbour] = 1;
              queue.push(neighbour);
            }
          }
        }
        if (component.length > largestComponent.length) largestComponent = component;
      }
      const componentSet = new Set(largestComponent);
      const boundary: FourierPoint[] = [];
      let totalX = 0;
      let totalY = 0;
      largestComponent.forEach((index) => {
        const x = index % size;
        const y = Math.floor(index / size);
        if (!componentSet.has(index - 1) || !componentSet.has(index + 1) || !componentSet.has(index - size) || !componentSet.has(index + size)) {
          boundary.push({ x, y });
          totalX += x;
          totalY += y;
        }
      });
      const centreX = totalX / Math.max(1, boundary.length);
      const centreY = totalY / Math.max(1, boundary.length);
      boundary.sort((a, b) => Math.atan2(a.y - centreY, a.x - centreX) - Math.atan2(b.y - centreY, b.x - centreX));
      const minX = Math.min(...boundary.map((point) => point.x));
      const maxX = Math.max(...boundary.map((point) => point.x));
      const minY = Math.min(...boundary.map((point) => point.y));
      const maxY = Math.max(...boundary.map((point) => point.y));
      const widthScale = Math.max(1, maxX - minX);
      const heightScale = Math.max(1, maxY - minY);
      const extracted = Array.from({ length: 240 }, (_, index) => {
        const point = boundary[Math.floor((index / 240) * boundary.length)] ?? { x: centreX, y: centreY };
        return { x: ((point.x - minX) / widthScale - 0.5) * 190, y: ((point.y - minY) / heightScale - 0.5) * 210 };
      });
      setSourcePoints(extracted);
    };
    return () => { image.onload = null; };
  }, [selectedPreset]);

  useEffect(() => {
    setProgress(0);
    setTrace([]);
    // Pausing off-screen stops a 60fps setState loop from running (and re-rendering
    // up to 61 SVG vectors) indefinitely while the visitor is nowhere near this section.
    if (prefersReducedMotion || !isInView) return undefined;
    let animationFrame = 0;
    const startedAt = performance.now();
    const animate = (now: number) => {
      const nextProgress = ((now - startedAt) / 8500) % 1;
      const nextTip = epicycleState(coefficients, nextProgress).tip;
      setProgress(nextProgress);
      setTrace((current) => [...current.slice(-220), nextTip]);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [coefficients, prefersReducedMotion, isInView]);

  const originalPath = pathFromPoints(points);
  const tracePath = pathFromPoints(trace);
  const equationLabel = coefficients.slice(0, 3).map((coefficient) => `${coefficient.frequency >= 0 ? '+' : '−'} ${Math.abs(coefficient.frequency)}ω`).join(' ');

  return (
    <section ref={sectionRef} id="fourier-drawing" className="scroll-mt-24 bg-[#fffdf8] px-5 py-20 lg:px-8" aria-labelledby="fourier-drawing-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#8a6812]">Optional enrichment · beyond the NSW syllabus</p>
            <h2 id="fourier-drawing-heading" className="font-serif text-4xl font-medium leading-[1.04] tracking-[-0.045em] text-[#071629] sm:text-5xl">How can simple rotations draw a picture?</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#536077]">Fourier series are not a required Mathematics Advanced topic. This spectacle uses assessable ideas about sine waves and transformations to show where those concepts can lead.</p>
        </div>

        <div className="grid overflow-hidden rounded-[1.75rem] border border-[#071629]/10 bg-[#071629] lg:grid-cols-[minmax(220px,.7fr)_minmax(0,1.3fr)]">
          <div className="p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#f1df9a]">Choose a path</p>
            <div className="mt-5 grid gap-2" role="tablist" aria-label="Fourier drawing presets">
              {DRAWING_PRESETS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={preset === option.id}
                  onClick={() => setPreset(option.id)}
                  className={`rounded-xl px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1df9a] ${preset === option.id ? 'bg-white/12 text-[#f1df9a]' : 'text-white/65 hover:bg-white/6 hover:text-white'}`}
                >
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className="mt-1 block text-xs text-current/65">{option.description}</span>
                </button>
              ))}
            </div>
            <label htmlFor="fourier-vectors" className="mt-8 block text-sm font-black text-white">Number of rotating vectors <span className="float-right rounded-full bg-[#f1df9a] px-2.5 py-1 text-xs text-[#071629]">{vectors}</span></label>
            <input id="fourier-vectors" type="range" min="5" max="61" step="2" value={vectors} onChange={(event) => setVectors(Number(event.target.value))} className="mt-5 h-2 w-full cursor-pointer accent-[#f1df9a]" />
            <div className="mt-2 flex justify-between text-[11px] font-bold text-white/45"><span>5 · broad shape</span><span>61 · finer detail</span></div>
            <p className="mt-3 text-sm leading-6 text-white/60">More vectors capture finer detail, especially around the shield edges and portrait profile.</p>
            <div className="mt-8 border-t border-white/15 pt-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b174bd]">Assessable foundations</p>
              <p className="mt-3 text-sm leading-6 text-white/72">Functions, graph transformations and trigonometric graphs lead into this construction. Fourier series themselves are optional enrichment.</p>
              <span className="mt-4 inline-flex rounded-full border border-[#b174bd]/45 px-3 py-1.5 text-xs font-bold text-[#e0b8e7]">Not required for HSC Mathematics Advanced</span>
            </div>
          </div>

          <div className="bg-[#f3f7fb] p-4 sm:p-7">
            <div className="grid gap-4 md:grid-cols-[1.25fr_.75fr] md:items-center">
              <div className="rounded-2xl border border-[#071629]/10 bg-white p-3 sm:p-4">
                <svg viewBox="0 0 360 260" className="h-auto w-full" role="img" aria-label={`${selectedPreset.label} traced by rotating Fourier vectors`}>
                  {selectedPreset.imageSrc && <image href={selectedPreset.imageSrc} x="72" y="8" width="216" height="244" preserveAspectRatio="xMidYMid meet" opacity="0.12" aria-hidden="true" />}
                  <path d={originalPath} fill="none" stroke="#c51f3a" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="4 5" />
                  {centres.map((centre, index) => {
                    const coefficient = coefficients[index];
                    return <g key={`${coefficient.frequency}-${index}`}><circle cx={centre.x + 180} cy={centre.y + 130} r={coefficient.amplitude} fill="none" stroke="#8e4d8c" strokeOpacity="0.22" /><line x1={centre.x + 180} y1={centre.y + 130} x2={centres[index].x + 180 + coefficient.amplitude * Math.cos(coefficient.phase + coefficient.frequency * progress * Math.PI * 2)} y2={centres[index].y + 130 + coefficient.amplitude * Math.sin(coefficient.phase + coefficient.frequency * progress * Math.PI * 2)} stroke="#8e4d8c" strokeWidth="1.5" strokeOpacity="0.75" /></g>;
                  })}
                  <path d={tracePath} fill="none" stroke="#b174bd" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx={tip.x + 180} cy={tip.y + 130} r="4" fill="#c9a227" />
                </svg>
                <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-[#536077]"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#b174bd]" />traced path</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#c51f3a]/30" />target shape</span></div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6812]">What the computer is adding</p>
                <p className="mt-3 text-sm leading-7 text-[#536077]">Each vector contributes a rotating sinusoidal component. Together, their endpoint follows the original curve.</p>
                <div className="mt-5 rounded-xl bg-[#071629] p-4 text-center text-[#f5e8bc]">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#b174bd]">Active frequencies</p>
                  <p className="mt-2 font-mono text-sm">{equationLabel || '0ω'}</p>
                </div>
                <p className="mt-4 text-xs leading-5 text-[#7d8798]">Optional enrichment: enjoy the construction without treating it as assessable course content.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const SHOW_LEGACY_MATHS_INTERACTIONS = false;

const Mathematics = () => {
  const prefersReducedMotion = useReducedMotion();
  const courseLevels = [
    {
      label: 'High School',
      years: 'Years 7-10',
      tone: 'from-[#fbfff8] to-[#eaf8ef]',
      icon: Brain,
      description: 'As maths becomes more connected, students learn to move between algebra, diagrams, graphs and written reasoning without losing the method. We close earlier gaps, then rehearse how to choose an approach, set out working clearly and check it under assessment conditions.',
      // "Core" and "Path" are the NSW Mathematics K-10 Syllabus's own content bands within
      // the single K-10 Mathematics course — there is no separately-named "Advanced
      // Mathematics" or "Mathematical Methods" course at this stage (Mathematical Methods
      // is a Victorian VCE subject, not an NSW one). Naming these DA-branded course names
      // would misrepresent them as official school subjects.
      subjects: ['Core Mathematics', 'Path Mathematics (extension content)', 'Problem Solving & Enrichment'],
    },
    {
      label: 'HSC Mathematics',
      years: 'Years 11-12',
      tone: 'from-[#fffdf7] to-[#fff1cd]',
      icon: TrendingUp,
      description: 'HSC preparation is not just more questions. We teach students to read the command word, identify the syllabus idea being tested, build a complete chain of working and make strategic checking decisions before time runs out — across Standard, Advanced and Extension pathways.',
      subjects: ['Mathematics Standard 1 & 2', 'Mathematics Advanced', 'Mathematics Extension 1', 'Mathematics Extension 2'],
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
      <MathsIntroVideoGate />
      <SEO
        title="Mathematics Tutoring (Years 7-12 & HSC)"
        description="From Year 7 foundations to advanced HSC mathematics, we build confidence through expert guidance and proven teaching methods at DA Tuition."
        canonicalUrl="/subjects/mathematics"
      />
      <NavigationNew />

      <main>
        {/* Hero */}
        <SubjectHero
          eyebrow="Years 7-12 Mathematics"
          icon={Calculator}
          headlineWhite="Understand the method."
          headlineGold="Solve with confidence."
          subtext="Mathematics tuition for students who need clear explanations, stronger problem-solving, and the confidence to show their working — from Year 7 foundations through to HSC questions."
          proofPills={['Step-by-step working', 'Marked feedback', 'Clear problem-solving']}
          exploreTargetId="math-pathways"
          placeholderLabel="Mathematics classroom"
          showPlaceholderBadge={false}
          backgroundImageSrc="/math-tutor-ogive-hero.jpg"
          backgroundImageAlt="DA Tuition mathematics tutor working through problems on a whiteboard"
          backgroundPosition="100% center"
          mobileBackgroundPosition="70% center"
          copyOffsetClassName="lg:-translate-y-10"
          heroTone="light"
        />

        {SHOW_LEGACY_MATHS_INTERACTIONS ? <BasketballCalculusJourney /> : null}

        {SHOW_LEGACY_MATHS_INTERACTIONS ? <FourierDecomposition /> : null}

        {/* Anchor navigation */}
        <nav aria-label="Mathematics page sections" className="border-y border-[#071629]/12 bg-[#fffdf8] px-5 lg:px-8">
          <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto snap-x md:grid md:grid-cols-5 md:gap-8">
            {[
              { label: 'Where they are now', href: '#math-pathways' },
              { label: 'Their right class', href: '#maths-class-options' },
              { label: 'HSC direction', href: '#hsc-maths' },
              { label: 'How progress is built', href: '#math-teaching-proof' },
              { label: 'Optional exploration', href: '/maths-graph-lab', opensPage: true },
            ].map(({ label, href, opensPage }) => (
              <a
                key={href}
                href={href}
                aria-label={opensPage ? `${label}, opens a separate page` : undefined}
                className="relative flex min-h-14 min-w-[9.75rem] shrink-0 snap-start items-center justify-center gap-1.5 px-1 py-4 text-center text-sm font-black text-[#10233f] outline-none after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#a6760e] after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100 md:min-w-0"
              >
                {label}
                {opensPage ? <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
              </a>
            ))}
          </div>
        </nav>

        <NetworkAmbientMoment passive />

        <ConfidenceJourney concerns={parentConcerns} levels={courseLevels} />

        {/* Mid-page CTA — the only other booking action on the page is at the very
            bottom, after class options, HSC streams and teaching proof. A parent
            already convinced by the concerns above shouldn't have to scroll the
            rest of the page to find a way to act on it. */}
        <section className="border-y border-[#071629]/10 bg-[#fffdf8] px-5 py-14 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-xl text-lg font-medium leading-7 text-[#10233f]">
              Recognise your child in one of these? Book an interview and we'll help you work out the right starting point.
            </p>
            <Link to="/book-interview" className="shrink-0">
              <Button size="lg" className="h-12 w-full rounded-full bg-[#c9a227] px-7 font-black text-[#101521] hover:bg-[#e0bd4b] sm:w-auto">
                Book an Interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Maths class options */}
        <section id="maths-class-options" className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#071629_0%,#0b294d_100%)] px-5 py-24 lg:px-8 lg:py-28">
          <div className="pointer-events-none absolute -left-36 -top-36 h-80 w-80 rounded-full border border-[#c9a227]/35" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-44 -right-44 h-96 w-96 rounded-full border border-[#c9a227]/30" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-7 top-7 h-32 w-32 opacity-50"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.2) 1px, transparent 1.5px)', backgroundSize: '14px 14px' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-7 right-7 h-32 w-32 opacity-35"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.2) 1px, transparent 1.5px)', backgroundSize: '14px 14px' }}
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-[1480px]">
            <motion.div
              className="mx-auto mb-14 max-w-5xl text-center"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 22, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a] before:h-px before:w-16 before:bg-gradient-to-r before:from-transparent before:to-[#c9a227]/80 after:h-px after:w-16 after:bg-gradient-to-l after:from-transparent after:to-[#c9a227]/80">
                Maths class options
              </span>
              <h2 className="mt-6 font-serif text-5xl font-medium leading-[1.25] tracking-[-0.035em] text-[#fff9ef] md:text-6xl xl:text-[4.25rem]">
                Choose the maths pathway that fits your child.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#c7d4e5]">
                From personalised support to school-aligned learning and exam preparation, we will help you choose the right starting point.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {MATHS_CLASS_OPTIONS.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.article
                    key={option.title}
                    className="group flex min-h-full flex-col overflow-hidden rounded-2xl border bg-[#fff9ef] transition-colors duration-200 motion-reduce:transition-none"
                    style={{ borderColor: option.accent }}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -6, transition: { duration: 0.18, delay: 0, ease: [0.16, 1, 0.3, 1] } }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.62, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#10233f]">
                      <img
                        src={option.image}
                        alt={option.alt}
                        className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: option.accent }} aria-hidden="true" />
                    </div>
                    <div className="relative flex flex-1 flex-col px-6 pb-7 pt-11 text-center">
                      <div className="pointer-events-none absolute inset-x-0 -top-9 flex justify-center">
                        <motion.span
                          className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border bg-[#fff9ef]"
                          style={{
                            borderColor: option.accent,
                            color: option.accent,
                            backgroundColor: option.tint,
                          }}
                          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.78 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.44, delay: index * 0.1 + 0.16, ease: [0.16, 1, 0.3, 1] }}
                          aria-hidden="true"
                        >
                          <Icon className="block h-7 w-7" strokeWidth={1.6} />
                        </motion.span>
                      </div>
                      <h3 className="flex min-h-[4.75rem] items-center justify-center text-balance font-serif text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#071629]">
                        {option.title}
                      </h3>
                      <span className="mx-auto flex h-8 items-center gap-2" aria-hidden="true">
                        <i className="h-px w-7 shrink-0" style={{ backgroundColor: option.accent }} />
                        <i className="h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: '#c9a227' }} />
                        <i className="h-px w-7 shrink-0" style={{ backgroundColor: option.accent }} />
                      </span>
                      <p className="mt-2 text-[15px] leading-7 text-[#40516b]">{option.description}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <VectorAmbientMoment passive />

        <YearCube />

        <HscMathsPathway />

        <MathematicalFieldStation />

        <section className="bg-[#071629] px-5 py-20 lg:px-8" aria-labelledby="maths-topic-network-heading">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">The whole picture</p>
            <h2 id="maths-topic-network-heading" className="font-serif text-4xl font-medium leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl">
              Every topic connects to another.
            </h2>
            <p className="mt-5 max-w-[52ch] text-base leading-8 text-[#b9c4d6]">
              Scroll to watch how Years 7–12 maths builds outward from a handful of fundamentals — click any topic to see what it depends on.
            </p>
            <div className="mt-10">
              <MathsTopicNetwork />
            </div>
          </div>
        </section>

        <MathsTeachingProof />

        <MathsGraphLabInvitation />

        {SHOW_LEGACY_MATHS_INTERACTIONS ? (
          <>
        {/* How we teach — retained temporarily for reversible visual review */}
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
          </>
        ) : null}

        <DerivativeAmbientMoment passive />

        {/* Real Google review — review-078 in src/data/reviews.json (subject: Mathematics).
            Quoted verbatim from the "she broke it down into steps..." sentence; only the
            surrounding scene-setting was trimmed for length, no wording changed. */}
        <section className="border-y border-[#071629]/10 bg-[#fffdf8] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.62fr_1fr] lg:items-start lg:gap-20">
            <div>
              <p className="text-sm font-black text-[#8a6110]">In their own words</p>
              <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-[1.08] tracking-[-0.035em] text-[#071629] sm:text-5xl">
                What changes when the method clicks.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#40516b]">
                A verified DA Tuition Google review from a maths student.
              </p>
            </div>
            <div className="border-t-2 border-[#c9a227] pt-8 lg:pt-10">
              <Quote className="h-9 w-9 text-[#8a6110]" aria-hidden="true" />
              <blockquote className="mt-6 max-w-[30ch] text-balance font-serif text-3xl leading-[1.25] tracking-[-0.03em] text-[#10233f] sm:text-4xl">
                “Even when I was certain I couldn't solve a question, she broke it down into steps in the easiest method which made it seem so simple — I understood it immediately and could apply it to other challenging questions.”
              </blockquote>
              <p className="mt-7 text-sm font-bold text-[#40516b]">— Christina Lee, Year 10</p>
            </div>
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
