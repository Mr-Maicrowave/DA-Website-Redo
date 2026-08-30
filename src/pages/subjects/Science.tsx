import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import { SubjectReviewCarousel } from '@/components/subjects/SubjectReviewCarousel';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Atom,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  Target,
  TrendingUp,
  Zap,
  FlaskConical,
  Microscope,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import SEO from '@/components/SEO';
import DAMethodSection from '@/components/DAMethodSection';
import { ScienceIntroVideoGate } from '@/features/science-intro-video/ScienceIntroVideoGate';

// ── Curiosity Constellation data ─────────────────────────────────────────────
// SVG viewBox 0 0 460 460. Hexagonal inner network centred at (230, 230), r=92.
// N1(230,138) N2(310,184) N3(310,276) N4(230,322) N5(150,276) N6(150,184)

const INNER_NODES = [
  { x: 230, y: 138 }, // N1 — top
  { x: 310, y: 184 }, // N2 — top-right
  { x: 310, y: 276 }, // N3 — bottom-right
  { x: 230, y: 322 }, // N4 — bottom
  { x: 150, y: 276 }, // N5 — bottom-left
  { x: 150, y: 184 }, // N6 — top-left
] as const;

const INNER_BONDS: [number, number][] = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]];

// Subject colour tokens
const SUBJECT_COLORS: Record<string, { node: string; line: string; text: string }> = {
  Physics:        { node: '#2563eb', line: '#2563eb', text: '#1e40af' },
  Chemistry:      { node: '#c9a227', line: '#c9a227', text: '#92740d' },
  Biology:        { node: '#16a34a', line: '#16a34a', text: '#15803d' },
  'Earth Science': { node: '#0284c7', line: '#0284c7', text: '#0369a1' },
};

const SUBJECT_ICONS: Record<string, string> = {
  Physics:        '⚡',
  Chemistry:      '🧪',
  Biology:        '🧬',
  'Earth Science': '🌤️',
};

const WONDER_ITEMS = [
  {
    id: 'lightning',
    question: 'Why does lightning come before thunder?',
    line1: 'Why does lightning',
    line2: 'come before thunder?',
    subject: 'Physics',
    concepts: ['Wave Speed', 'Energy Transfer'],
    explanation: 'Light travels at 300,000 km/s — almost instantly to our eyes. Sound moves at just 343 m/s through air. The lightning and thunder happen at the same moment, but the light arrives first while the sound takes seconds to follow.',
    nswTopic: 'Waves and Energy Transfer',
    daConnection: 'At DA, students connect everyday observations to scientific principles — building the kind of understanding that holds up when exam questions change the context.',
    color: '#2563eb',
    svgX: 250, svgY: 60,
    connectX: 230, connectY: 138,  // → N1
    textX: 250, textY1: 26, textSize: 13.5,
    textAnchor: 'middle' as const,
  },
  {
    id: 'coke',
    question: 'Why does Coke go flat?',
    line1: 'Why does',
    line2: 'Coke go flat?',
    subject: 'Chemistry',
    concepts: ['Gas Particles', 'Pressure', 'Solubility'],
    explanation: 'CO₂ is forced into the liquid under high pressure during bottling. When the seal breaks, pressure drops — the gas can no longer stay dissolved and escapes as bubbles. This is Henry\'s Law made visible.',
    nswTopic: 'Gas and Particle Theory',
    daConnection: 'At DA, students understand the principles of solubility and pressure — not just the outcome — so they can confidently tackle any gas theory question in an exam.',
    color: '#c9a227',
    svgX: 392, svgY: 168,
    connectX: 310, connectY: 184,  // → N2
    textX: 392, textY1: 132, textSize: 13.5,
    textAnchor: 'middle' as const,
  },
  {
    id: 'seatbelts',
    question: 'Why do seatbelts save lives?',
    line1: 'Why do seatbelts',
    line2: 'save lives?',
    subject: 'Physics',
    concepts: ['Forces', 'Motion', 'Inertia'],
    explanation: "Newton's first law: a body in motion stays in motion unless a force acts on it. In a collision the car stops suddenly — but your body wants to keep moving. The seatbelt applies the stopping force gradually, reducing peak impact on your body.",
    nswTopic: 'Forces and Motion',
    daConnection: 'At DA, students apply Newton\'s laws to real-world scenarios — not just textbook diagrams — giving them the flexibility to reason through unfamiliar exam problems.',
    color: '#2563eb',
    svgX: 352, svgY: 382,
    connectX: 310, connectY: 276,  // → N3
    textX: 352, textY1: 408, textSize: 13.5,
    textAnchor: 'middle' as const,
  },
  {
    id: 'sky',
    question: 'Why is the sky blue?',
    line1: 'Why is the',
    line2: 'sky blue?',
    subject: 'Earth Science',
    concepts: ['Light', 'Scattering', 'Atmosphere'],
    explanation: 'Sunlight contains all colours of light. As sunlight travels through Earth\'s atmosphere, tiny particles scatter blue light more strongly than other colours. This scattered blue light reaches our eyes from every direction, making the sky appear blue.',
    nswTopic: 'Light, Waves & The Atmosphere',
    daConnection: 'Students learn how scientific concepts explain everyday observations. We connect Physics ideas to real-world examples so students understand why concepts work, not just what to memorise for exams.',
    color: '#0284c7',
    svgX: 230, svgY: 418,
    connectX: 230, connectY: 322,   // → N3 — bottom vertex
    textX: 230, textY1: 444, textSize: 13.5,
    textAnchor: 'middle' as const,
  },
  {
    id: 'sick',
    question: 'Why do we get sick?',
    line1: 'Why do',
    line2: 'we get sick?',
    subject: 'Biology',
    concepts: ['Immune System', 'Pathogens', 'Cell Defence'],
    explanation: 'Viruses and bacteria — pathogens — enter the body and begin replicating. The immune system detects foreign antigens and launches a response: white blood cells attack the pathogen, while memory cells remain to defend against the same threat in future.',
    nswTopic: 'Disease and Body Systems',
    daConnection: 'At DA, students understand biological systems in depth — not just what happens, but why — which means they can explain immune responses clearly in any exam format.',
    color: '#16a34a',
    svgX: 104, svgY: 378,
    connectX: 150, connectY: 276,  // → N5
    textX: 104, textY1: 408, textSize: 13.5,
    textAnchor: 'middle' as const,
  },
  {
    id: 'apple',
    question: 'Why does cut apple turn brown?',
    line1: 'Why does cut',
    line2: 'apple turn brown?',
    subject: 'Chemistry',
    concepts: ['Oxidation', 'Enzymes', 'Chemical Change'],
    explanation: 'Enzymes inside the apple cells are exposed when you cut it. These enzymes react with oxygen in the air — an oxidation reaction that produces melanin, the brown pigment you see forming on the surface.',
    nswTopic: 'Chemical Reactions',
    daConnection: 'At DA, students learn to identify and describe chemical changes systematically — so oxidation questions, whether structured or extended response, become straightforward.',
    color: '#c9a227',
    svgX: 58, svgY: 162,
    connectX: 150, connectY: 184,  // → N6
    textX: 58, textY1: 126, textSize: 13.5,
    textAnchor: 'middle' as const,
  },
];

const SCIENCE_STORIES = [
  {
    initials: 'SD',
    name: 'Selene Dixon',
    subjects: 'Biology',
    result: '1st Place · Trials',
    outcome: 'From failing grades to top of class',
    quote: 'I was on the brink of failing my biology class, with failing grades and a sense of hopelessness. Fast forward to my recent triumph in the trials where I secured the coveted first place. Mr Danny didn\'t just teach the subject — he brought it to life.',
  },
  {
    initials: 'NL',
    name: 'Nhi Le',
    subjects: 'Chemistry',
    result: '1st in Year 12 Chemistry',
    outcome: 'Joined at end of Year 11',
    quote: 'I came to DA at the end of Year 11 and was really surprised how much I improved in Chemistry. Mr Danny gave me more than other tutors could — mental support and the push to get better. I became first place in Chemistry in Year 12 thanks to him.',
  },
  {
    initials: 'JD',
    name: 'Jenny Doan',
    subjects: 'Chemistry + Biology',
    result: 'B\'s → A\'s',
    outcome: 'Year 11 student',
    quote: 'My results went from B\'s to A\'s. I was struggling in Chemistry and my school teacher was just not helping — the way Mr Oliver explains and teaches is amazing, making it easy to understand. For Biology, Mr Danny is so humorous, plus his teaching is brilliant.',
  },
  {
    initials: 'JH',
    name: 'Jess Hoang',
    subjects: 'Chemistry',
    result: 'Prelim Chemistry',
    outcome: 'MMC, Year 11',
    quote: 'Three weeks before my first assessment task and I didn\'t know anything about my topic — that\'s when I joined DA Chemistry. After Mr Oliver\'s classes I always felt prepared for anything the school was going to throw at me.',
  },
  {
    initials: 'CL',
    name: 'Chantelle Ly',
    subjects: 'Chemistry',
    result: 'HSC Chemistry',
    outcome: 'Bonnyrigg High School, Year 11',
    quote: 'Before we joined DA, learning Chemistry from school was boring and we found the theory too difficult to understand. From thinking of it as "cheMYSTERY", joining Mr Oliver\'s class made us more confident and focused. We\'re really glad we chose Chemistry for our HSC.',
  },
  {
    initials: 'JL',
    name: 'Jessica La',
    subjects: 'Science',
    result: 'Top of Class',
    outcome: 'Cabramatta High School, Year 9',
    quote: 'My marks went from low to the top of the class. Miss Stephanie has taught me so many things about Science — she makes it fun and easy to understand, and always checks our work before tests to make sure we\'re ready. I\'ve overcome myself in Science since high school started.',
  },
];


// ── Programs: One World, Three Lenses ────────────────────────────────────────
const SCIENCE_LENSES = [
  {
    label: 'Biology',
    scale: 'Living systems',
    tagline: 'Understand life from cells to ecosystems.',
    topics: ['Genetics & evolution', 'Human systems', 'Ecosystems', 'Scientific investigations'],
    diagram: 'biology',
  },
  {
    label: 'Chemistry',
    scale: 'Matter & change',
    tagline: 'Master reactions, calculations and molecular thinking.',
    topics: ['Chemical reactions', 'Stoichiometry', 'Equilibrium', 'Organic chemistry'],
    diagram: 'chemistry',
  },
  {
    label: 'Physics',
    scale: 'Forces & fields',
    tagline: 'Discover the principles that govern the universe.',
    topics: ['Mechanics', 'Electricity & magnetism', 'Waves', 'Quantum physics'],
    diagram: 'physics',
  },
] as const;

const LensStudy = ({ kind }: { kind: typeof SCIENCE_LENSES[number]['diagram'] }) => {
  if (kind === 'biology') return (
    <svg viewBox="0 0 240 112" aria-hidden="true" className="h-24 w-full overflow-visible fill-none stroke-current">
      <circle cx="52" cy="56" r="31" strokeWidth="1.25" />
      <circle cx="52" cy="56" r="11" stroke="#c9a227" strokeWidth="1.25" />
      <path d="M96 23c36 13 48 35 66 69M89 68c34-2 57-21 84-52" strokeWidth="1.25" />
      <path d="M154 18c17 5 30 17 45 34M159 81c15-5 27-16 37-31" stroke="#c9a227" strokeWidth="1.25" />
    </svg>
  );
  if (kind === 'chemistry') return (
    <svg viewBox="0 0 240 112" aria-hidden="true" className="h-24 w-full overflow-visible fill-none stroke-current">
      <circle cx="28" cy="58" r="7" strokeWidth="1.25" /><circle cx="90" cy="27" r="7" stroke="#c9a227" strokeWidth="1.25" />
      <circle cx="125" cy="78" r="7" strokeWidth="1.25" /><circle cx="190" cy="43" r="7" stroke="#c9a227" strokeWidth="1.25" />
      <path d="M35 55l48-24M96 33l24 41M132 75l51-29" strokeWidth="1.25" />
      <path d="M18 89h196" stroke="#c9a227" strokeWidth="1.25" strokeDasharray="3 5" />
    </svg>
  );
  return (
    <svg viewBox="0 0 240 112" aria-hidden="true" className="h-24 w-full overflow-visible fill-none stroke-current">
      <path d="M3 59c18-47 36 47 54 0s36-47 54 0 36 47 54 0 36-47 72-5" strokeWidth="1.25" />
      <path d="M24 90h146M170 90l-10-6M170 90l-10 6" stroke="#c9a227" strokeWidth="1.25" />
      <path d="M50 25v32M50 25l-6 9M50 25l6 9" strokeWidth="1.25" />
    </svg>
  );
};

const SciencePrograms = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const lensFrameRef = useRef<HTMLDivElement>(null);
  const handoffCapturedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] });
  const [handoffGeometry, setHandoffGeometry] = useState<{ x: number; y: number; scale: number } | null>(null);
  useEffect(() => {
    [
      '/images/science-scale/fallen-apple-impact-v3.png',
      '/images/science-scale/apple-flesh-macro-v3.png',
      '/images/science-scale/apple-tissue-micrograph-v3.png',
      '/images/science-scale/molecular-material-v3.png',
      '/images/science-scale/wave-field-v3.png',
    ].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);
  // The orchard apple is authored in the tree's 1536×1024 coordinate space;
  // the optical layer is viewport-pinned. Freeze the actual rendered apple
  // rect at handoff and convert it to the lens frame's viewport space so the
  // first ring forms around that apple, at every responsive size.
  useEffect(() => {
    const captureHandoffGeometry = () => {
      if (handoffCapturedRef.current) return;
      const apple = document.querySelector<HTMLElement>('.science-story-apple');
      const lensFrame = lensFrameRef.current;
      if (!apple || !lensFrame) return;
      const appleRect = apple.getBoundingClientRect();
      const lensRect = lensFrame.getBoundingClientRect();
      // Do not compare a scene rect with a lens that is still below the
      // viewport in normal document flow. The lens frame must be on its
      // pinned stage before both rects share viewport coordinates.
      const appleCenterY = appleRect.top + appleRect.height / 2;
      if (!appleRect.width || !appleRect.height || !lensRect.width || !lensRect.height || lensRect.top < -12 || lensRect.top > window.innerHeight || appleCenterY < window.innerHeight * .8 || appleCenterY > window.innerHeight) return;
      setHandoffGeometry({
        x: appleRect.left + appleRect.width / 2 - (lensRect.left + lensRect.width / 2),
        y: appleRect.top + appleRect.height / 2 - (lensRect.top + lensRect.height / 2),
        scale: Math.max(.1, Math.min(.32, Math.max(appleRect.width, appleRect.height) / lensRect.width)),
      });
      handoffCapturedRef.current = true;
    };
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      if (progress <= .015) captureHandoffGeometry();
    });
    const onResize = () => {
      handoffCapturedRef.current = false;
      captureHandoffGeometry();
    };
    window.addEventListener('scroll', captureHandoffGeometry, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', captureHandoffGeometry);
      window.removeEventListener('resize', onResize);
    };
  }, [scrollYProgress]);
  const lensEntryScale = useTransform(scrollYProgress, [0, .018, .055], [handoffGeometry?.scale ?? .18, handoffGeometry?.scale ?? .18, 1]);
  const lensEntryX = useTransform(scrollYProgress, [0, .018, .055], [handoffGeometry?.x ?? 0, handoffGeometry?.x ?? 0, 0]);
  const lensEntryY = useTransform(scrollYProgress, [0, .018, .055], [handoffGeometry?.y ?? 0, handoffGeometry?.y ?? 0, 0]);
  const lensEntryOpacity = useTransform(scrollYProgress, [0, .006, .018], [0, 1, 1]);
  const lensEntryFilter = useTransform(scrollYProgress, [0, .018, .055], ['blur(6px) brightness(1.16)', 'blur(2px) brightness(1.05)', 'blur(0px) brightness(1)']);
  const lensBackdropOpacity = useTransform(scrollYProgress, [0, .035, .072], [0, .35, 1]);
  // The real orchard apple remains visible through the early aperture. The
  // photographic impact specimen only takes over once the lens is large
  // enough for the asset change to read as resolving detail, not replacement.
  const lensMediaOpacity = useTransform(scrollYProgress, [.02, .055, .10], [0, .15, 1]);
  // A closing iris reads as a viewing device arriving around the specimen,
  // rather than a decorative circle that was simply always there.
  const lensIrisOpacity = useTransform(scrollYProgress, [0, .045], [1, 0]);
  // Editorial chrome (headline, scale readout, progress rail) settles in a
  // beat after the specimen has focused, so it never competes with impact.
  const introOpacity = useTransform(scrollYProgress, [.064, .09], [0, 1]);
  const readoutOpacity = useTransform(scrollYProgress, [.076, .103], [0, 1]);
  const programmeOpacity = useTransform(scrollYProgress, [.086, .113], [0, 1]);
  const trackOpacity = useTransform(scrollYProgress, [.098, .125], [0, 1]);
  const chromeY = useTransform(scrollYProgress, [.064, .103], ['10px', '0px']);
  // The tree owns the falling action. This stage begins at the resolved
  // impact, so there is no second hanging apple or cropped-tree reset.
  const appleScale = useTransform(scrollYProgress, [0, .25, .31], [1, 1, 2.35]);
  const appleOpacity = useTransform(scrollYProgress, [0, .275, .28, .31], [1, 1, 0, 0]);
  const appleFilter = useTransform(scrollYProgress, [.25, .31], ['blur(0px) brightness(1)', 'blur(8px) brightness(1.12)']);
  const appleX = useTransform(scrollYProgress, [.25, .31], ['0%', '-7%']);
  const appleY = useTransform(scrollYProgress, [.25, .31], ['0%', '-4%']);

  const macroScale = useTransform(scrollYProgress, [.22, .31, .46, .52], [1.28, 1.04, 1.08, 2.4]);
  const macroOpacity = useTransform(scrollYProgress, [.22, .275, .28, .485, .50, .52], [0, 0, 1, 1, 0, 0]);
  const macroFilter = useTransform(scrollYProgress, [.22, .31, .46, .52], ['blur(8px) brightness(1.12)', 'blur(0px) brightness(1)', 'blur(0px) brightness(1)', 'blur(8px) brightness(1.12)']);
  const macroX = useTransform(scrollYProgress, [.22, .31, .46, .52], ['8%', '0%', '0%', '5%']);
  const macroY = useTransform(scrollYProgress, [.22, .31, .46, .52], ['4%', '0%', '0%', '3%']);

  const cellScale = useTransform(scrollYProgress, [.46, .52, .67, .73], [1.28, 1.04, 1.08, 2.4]);
  const cellOpacity = useTransform(scrollYProgress, [.46, .485, .50, .695, .71, .73], [0, 0, 1, 1, 0, 0]);
  const cellFilter = useTransform(scrollYProgress, [.46, .52, .67, .73], ['blur(8px) brightness(1.12)', 'blur(0px) brightness(1)', 'blur(0px) brightness(1)', 'blur(8px) brightness(1.12)']);
  const cellX = useTransform(scrollYProgress, [.46, .52, .67, .73], ['-7%', '0%', '0%', '-5%']);
  const cellY = useTransform(scrollYProgress, [.46, .52, .67, .73], ['4%', '0%', '0%', '3%']);

  const moleculeScale = useTransform(scrollYProgress, [.67, .73, .86, .92], [1.28, 1.04, 1.08, 2.4]);
  const moleculeOpacity = useTransform(scrollYProgress, [.67, .695, .71, .875, .89, .92], [0, 0, 1, 1, 0, 0]);
  const moleculeFilter = useTransform(scrollYProgress, [.67, .73, .86, .92], ['blur(8px) brightness(1.12)', 'blur(0px) brightness(1)', 'blur(0px) brightness(1)', 'blur(8px) brightness(1.12)']);
  const moleculeX = useTransform(scrollYProgress, [.67, .73, .86, .92], ['-7%', '0%', '0%', '7%']);
  const moleculeY = useTransform(scrollYProgress, [.67, .73, .86, .92], ['6%', '0%', '0%', '-4%']);

  const fieldScale = useTransform(scrollYProgress, [.86, .92, 1], [1.28, 1.04, 1.08]);
  const fieldOpacity = useTransform(scrollYProgress, [.86, .875, .89, .92], [0, 0, 1, 1]);
  const fieldFilter = useTransform(scrollYProgress, [.86, .92], ['blur(8px) brightness(1.12)', 'blur(0px) brightness(1)']);
  const fieldX = useTransform(scrollYProgress, [.86, .92], ['6%', '0%']);
  const fieldY = useTransform(scrollYProgress, [.86, .92], ['-5%', '0%']);

  const appleCaptionOpacity = useTransform(scrollYProgress, [.075, .10, .27, .29], [0, 1, 1, 0]);
  const macroCaptionOpacity = useTransform(scrollYProgress, [.275, .30, .49, .505], [0, 1, 1, 0]);
  const biologyCaptionOpacity = useTransform(scrollYProgress, [.495, .52, .70, .715], [0, 1, 1, 0]);
  const chemistryCaptionOpacity = useTransform(scrollYProgress, [.705, .73, .88, .895], [0, 1, 1, 0]);
  const physicsCaptionOpacity = useTransform(scrollYProgress, [.885, .92], [0, 1]);
  const appleProgrammeOpacity = useTransform([appleCaptionOpacity, programmeOpacity], ([stage, reveal]) => Number(stage) * Number(reveal));
  // Bloom seams: each is a sharp single peak — light flaring through as the
  // camera pushes past, not a held white frame — so the zoom never feels
  // like it paused. The first flash is the apple's own impact (final drop
  // -> brief motion blur -> cracked-open photo); four more repeat it
  // between each magnification plateau.
  const seamBloomOpacity = useTransform(
    scrollYProgress,
    [.25, .28, .31, .46, .49, .52, .67, .70, .73, .86, .89, .92],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  );
  const scaleProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const appleTargetOpacity = useTransform(scrollYProgress, [.22, .245, .295, .32], [0, 1, 1, 0]);
  const cellTargetOpacity = useTransform(scrollYProgress, [.45, .485, .51, .535], [0, 1, 1, 0]);
  const moleculeTargetOpacity = useTransform(scrollYProgress, [.66, .695, .72, .745], [0, 1, 1, 0]);
  const fieldTargetOpacity = useTransform(scrollYProgress, [.85, .88, .91, .94], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} id="science-pathways" className="relative z-10 bg-[#fff8eb] px-5 pb-24 pt-12 lg:-mt-[100svh] lg:bg-transparent lg:px-8 lg:pb-32 lg:pt-0">
      <div>
        <div className="relative mx-auto max-w-7xl">
        <div ref={storyRef} className="science-scale-story relative left-1/2 h-[580vh] w-screen -translate-x-1/2 lg:h-[600vh]">
          <div className="sticky top-0 grid min-h-[100svh] place-items-center overflow-hidden bg-transparent py-12 lg:py-8">
            <motion.div aria-hidden="true" className="science-lens-backdrop pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,248,235,.04)_0%,rgba(255,248,235,.42)_34%,#fff8eb_72%)]" style={reducedMotion ? { opacity: 1 } : { opacity: lensBackdropOpacity }} />
            <div className="science-macro-stage relative z-10 h-[min(72svh,700px)] w-full" aria-label="A scientific view moving from the visible world to cells, molecules, and physical fields as the page scrolls">
              <div ref={lensFrameRef} className="science-eyepiece science-lens-reveal absolute left-1/2 top-[39%] h-[min(50svh,50vw,500px)] aspect-square -translate-x-1/2 -translate-y-1/2 overflow-visible">
                <motion.div
                className="science-lens-entry absolute inset-0"
                style={reducedMotion ? undefined : { x: lensEntryX, y: lensEntryY, scale: lensEntryScale, opacity: lensEntryOpacity, filter: lensEntryFilter, transformOrigin: '50% 50%' }}
              >
                <div aria-hidden="true" className="pointer-events-none absolute -inset-[10px] rounded-full border border-[#071629]/55" />
                <div aria-hidden="true" className="pointer-events-none absolute -inset-[6px] rounded-full border border-[#c9a227]/55 shadow-[inset_0_0_0_1px_rgba(255,255,255,.35)]" />
                <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute -inset-[13px] h-[calc(100%+26px)] w-[calc(100%+26px)] fill-none" preserveAspectRatio="none"><g stroke="#c9a227" strokeLinecap="round" opacity=".72"><path d="M18 31l4 2M20 27l5 3M23 23l5 4M27 20l4 5M31 18l3 5M35 16l2 5" strokeWidth=".55" /><path d="M14 35l7 3" strokeWidth="1" /></g></svg>
                <motion.div aria-hidden="true" style={reducedMotion ? { opacity: 1 } : { opacity: appleCaptionOpacity }} className="pointer-events-none absolute -left-[clamp(6rem,10vw,8rem)] top-[8%] border-l border-[#c9a227]/80 pl-2 text-[8px] font-black uppercase leading-3 tracking-[.18em] text-[#071629]">Optical view<br /><span className="text-[#c9a227]">Macro</span></motion.div>
                <motion.div aria-hidden="true" style={reducedMotion ? { opacity: 0 } : { opacity: macroCaptionOpacity }} className="pointer-events-none absolute -left-[clamp(6rem,10vw,8rem)] top-[8%] border-l border-[#c9a227]/80 pl-2 text-[8px] font-black uppercase leading-3 tracking-[.18em] text-[#071629]">Optical view<br /><span className="text-[#c9a227]">Tissue</span></motion.div>
                <motion.div aria-hidden="true" style={reducedMotion ? { opacity: 0 } : { opacity: biologyCaptionOpacity }} className="pointer-events-none absolute -left-[clamp(6rem,10vw,8rem)] top-[8%] border-l border-[#c9a227]/80 pl-2 text-[8px] font-black uppercase leading-3 tracking-[.18em] text-[#071629]">Optical view<br /><span className="text-[#c9a227]">Cellular</span></motion.div>
                <motion.div aria-hidden="true" style={reducedMotion ? { opacity: 0 } : { opacity: chemistryCaptionOpacity }} className="pointer-events-none absolute -left-[clamp(6rem,10vw,8rem)] top-[8%] border-l border-[#c9a227]/80 pl-2 text-[8px] font-black uppercase leading-3 tracking-[.18em] text-[#071629]">Optical view<br /><span className="text-[#c9a227]">Molecular</span></motion.div>
                <motion.div aria-hidden="true" style={reducedMotion ? { opacity: 0 } : { opacity: physicsCaptionOpacity }} className="pointer-events-none absolute -left-[clamp(6rem,10vw,8rem)] top-[8%] border-l border-[#c9a227]/80 pl-2 text-[8px] font-black uppercase leading-3 tracking-[.18em] text-[#071629]">Physical model<br /><span className="text-[#c9a227]">Fields &amp; waves</span></motion.div>
                <motion.div style={reducedMotion ? { opacity: 1 } : { opacity: lensMediaOpacity }} className="absolute inset-0 overflow-hidden rounded-full border border-[#071629]/70 bg-[#071629] shadow-[0_20px_70px_rgba(7,22,41,.16)]">
                <motion.div style={reducedMotion ? { opacity: 1, scale: 1 } : { x: appleX, y: appleY, scale: appleScale, opacity: appleOpacity, filter: appleFilter, transformOrigin: '55% 50%' }} className="absolute inset-0 will-change-transform">
                  <img src="/images/science-scale/fallen-apple-impact-v3.png" alt="A fallen apple split open on the ground" className="h-full w-full object-cover" />
                </motion.div>
                <motion.div style={reducedMotion ? { opacity: 0 } : { x: macroX, y: macroY, scale: macroScale, opacity: macroOpacity, filter: macroFilter, transformOrigin: '55% 50%' }} className="absolute inset-0 will-change-transform">
                  <img src="/images/science-scale/apple-flesh-macro-v3.png" alt="A close view of the apple's exposed flesh and seeds" className="h-full w-full object-cover" />
                </motion.div>
                <motion.div style={reducedMotion ? { opacity: 0 } : { x: cellX, y: cellY, scale: cellScale, opacity: cellOpacity, filter: cellFilter, transformOrigin: '50% 50%' }} className="absolute inset-0 will-change-transform">
                  <img src="/images/science-scale/apple-tissue-micrograph-v3.png" alt="Apple tissue under a microscope" className="h-full w-full object-cover" />
                </motion.div>
                <motion.div style={reducedMotion ? { opacity: 0 } : { x: moleculeX, y: moleculeY, scale: moleculeScale, opacity: moleculeOpacity, filter: moleculeFilter, transformOrigin: '35% 58%' }} className="absolute inset-0 will-change-transform">
                  <img src="/images/science-scale/molecular-material-v3.png" alt="Molecular structures in a material" className="h-full w-full object-cover" />
                </motion.div>
                <motion.div style={reducedMotion ? { opacity: 0 } : { x: fieldX, y: fieldY, scale: fieldScale, opacity: fieldOpacity, filter: fieldFilter, transformOrigin: '50% 52%' }} className="absolute inset-0 will-change-transform">
                  <img src="/images/science-scale/wave-field-v3.png" alt="Light and field lines radiating from a central source" className="h-full w-full object-cover" />
                </motion.div>
                <motion.div aria-hidden="true" style={{ opacity: reducedMotion ? 0 : appleTargetOpacity }} className="science-focus-target absolute left-[57%] top-[54%]" />
                <motion.div aria-hidden="true" style={{ opacity: reducedMotion ? 0 : cellTargetOpacity }} className="science-focus-target absolute left-[47%] top-[45%]" />
                <motion.div aria-hidden="true" style={{ opacity: reducedMotion ? 0 : moleculeTargetOpacity }} className="science-focus-target absolute left-[38%] top-[58%]" />
                <motion.div aria-hidden="true" style={{ opacity: reducedMotion ? 0 : fieldTargetOpacity }} className="science-focus-target absolute left-[56%] top-[48%]" />
                <motion.div aria-hidden="true" style={reducedMotion ? { opacity: 0 } : { opacity: lensIrisOpacity }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_46%,rgba(7,22,41,.5)_62%,rgba(7,22,41,.92)_100%)]" />
                <motion.div aria-hidden="true" style={reducedMotion ? { opacity: 0 } : { opacity: seamBloomOpacity }} className="science-seam-bloom pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_50%,#fffdf5_0%,#fff8eb_42%,#fff8eb_100%)]" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_36%_19%,rgba(255,255,255,.22),transparent_23%),radial-gradient(circle,transparent_57%,rgba(7,22,41,.2)_100%)]" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-[10px] rounded-full border border-white/35" />
                </motion.div>
              </motion.div>
              </div>
              <motion.div style={reducedMotion ? { opacity: 1 } : { opacity: introOpacity, y: chromeY }} className="science-scale-story__intro pointer-events-none absolute bottom-full left-5 mb-5 w-[calc(100%-2.5rem)] text-center xl:hidden"><p className="text-[10px] font-black uppercase tracking-[.3em] text-[#c9a227]">Science at every scale</p><p className="mt-2 font-serif text-xl tracking-[-.03em] text-[#071629] sm:text-2xl">One world.<br />A closer look<br />changes everything.</p></motion.div>
              <div className="pointer-events-none absolute left-[clamp(3rem,8vw,10rem)] top-[calc(50%-12rem)] hidden w-64 xl:block">
              <motion.div style={reducedMotion ? { opacity: 1 } : { opacity: introOpacity, y: chromeY }} className="science-scale-story__intro"><p className="text-[10px] font-black uppercase tracking-[.3em] leading-5 text-[#c9a227]">Science at every scale</p><p className="mt-3 font-serif text-3xl leading-[1.05] tracking-[-.03em] text-[#071629]">One world.<br />A closer look<br />changes everything.</p></motion.div>
              <motion.div style={reducedMotion ? { opacity: 1 } : { opacity: readoutOpacity, y: chromeY }} className="science-scale-story__readout relative mt-10 h-32 border-l border-[#c9a227]/70 pl-4">
                <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#657084]">Scale readout</p>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[.18em] text-[#c9a227]">Current specimen</p>
                <motion.div style={reducedMotion ? { opacity: 1 } : { opacity: appleCaptionOpacity }} className="absolute left-4 top-11"><p className="font-serif text-lg text-[#071629]">Macro · impact</p><p className="mt-1 text-sm leading-5 text-[#52647a]">A falling apple reveals the specimen.</p></motion.div>
                <motion.div style={reducedMotion ? { opacity: 0 } : { opacity: macroCaptionOpacity }} className="absolute left-4 top-11"><p className="font-serif text-lg text-[#071629]">Tissue · apple flesh</p><p className="mt-1 text-sm leading-5 text-[#52647a]">Travel through the exposed structure.</p></motion.div>
                <motion.div style={reducedMotion ? { opacity: 0 } : { opacity: biologyCaptionOpacity }} className="absolute left-4 top-11"><p className="font-serif text-lg text-[#071629]">Cellular · living cells</p><p className="mt-1 text-sm leading-5 text-[#52647a]">Structure becomes a living system.</p></motion.div>
                <motion.div style={reducedMotion ? { opacity: 0 } : { opacity: chemistryCaptionOpacity }} className="absolute left-4 top-11"><p className="font-serif text-lg text-[#071629]">Molecular · matter</p><p className="mt-1 text-sm leading-5 text-[#52647a]">Follow bonds beneath the surface.</p></motion.div>
                <motion.div style={reducedMotion ? { opacity: 0 } : { opacity: physicsCaptionOpacity }} className="absolute left-4 top-11"><p className="font-serif text-lg text-[#071629]">Fields &amp; waves</p><p className="mt-1 text-sm leading-5 text-[#52647a]">See the forces that connect it all.</p></motion.div>
              </motion.div>
              </div>
              <div className="pointer-events-none absolute bottom-[clamp(1.5rem,4vh,3rem)] left-1/2 w-[min(80rem,calc(100vw-3rem))] -translate-x-1/2">
                <motion.div style={reducedMotion ? { opacity: 1 } : { opacity: trackOpacity, y: chromeY }} className="relative border-t border-[#071629]/15 pt-5 text-[10px] font-black uppercase tracking-[.16em] text-[#657084]">
                  <motion.div aria-hidden="true" style={{ width: scaleProgress }} className="absolute left-0 top-[-1px] h-px bg-[#c9a227]" />
                  <motion.div aria-hidden="true" style={{ left: scaleProgress }} className="absolute -top-2 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border border-[#071629]/70 bg-[#fff8eb] shadow-[0_0_0_3px_#fff8eb]"><span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" /></motion.div>
                  <div className="flex justify-between"><span>Impact</span><span className="hidden sm:inline">Flesh</span><span className="hidden sm:inline">Cells</span><span className="hidden md:inline">Molecules</span><span>Fields &amp; waves</span></div>
                </motion.div>
              </div>
              <motion.div style={reducedMotion ? { opacity: 1 } : { opacity: appleProgrammeOpacity }} className="science-scale-caption pointer-events-none absolute left-5 top-full mt-12 max-w-[18rem] border-l-2 border-[#c9a227] pl-4 xl:left-auto xl:right-[clamp(3rem,8vw,10rem)] xl:top-1/2 xl:mt-0 xl:w-64 xl:-translate-y-1/2"><p className="text-[9px] font-black uppercase tracking-[.2em] text-[#c9a227]">Foundation Science · Years 7–10</p><p className="mt-2 font-serif text-2xl text-[#071629]">Build the foundations.</p><p className="mt-2 text-sm leading-5 text-[#43556e]">Develop connected understanding across Biology, Chemistry and Physics—then learn to observe, question, test and explain.</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#657084]">Investigation · Problem solving · Exam skills</p></motion.div>
              <motion.div style={reducedMotion ? { opacity: 0 } : { opacity: macroCaptionOpacity }} className="science-scale-caption pointer-events-none absolute left-5 top-full mt-12 max-w-[18rem] border-l-2 border-[#c9a227] pl-4 xl:left-auto xl:right-[clamp(3rem,8vw,10rem)] xl:top-1/2 xl:mt-0 xl:w-64 xl:-translate-y-1/2"><p className="text-[9px] font-black uppercase tracking-[.2em] text-[#c9a227]">Foundation Science · Years 7–10</p><p className="mt-2 font-serif text-2xl text-[#071629]">Build the foundations.</p><p className="mt-2 text-sm leading-5 text-[#43556e]">Use evidence to connect an everyday specimen to its structure, material change and the forces acting on it.</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#657084]">Biology · Chemistry · Physics</p></motion.div>
              <motion.div style={reducedMotion ? { opacity: 0 } : { opacity: biologyCaptionOpacity }} className="science-scale-caption pointer-events-none absolute left-5 top-full mt-12 max-w-[18rem] border-l-2 border-[#c9a227] pl-4 xl:left-auto xl:right-[clamp(3rem,8vw,10rem)] xl:top-1/2 xl:mt-0 xl:w-64 xl:-translate-y-1/2"><p className="text-[9px] font-black uppercase tracking-[.2em] text-[#c9a227]">HSC BIOLOGY · YEARS 11–12</p><p className="mt-2 font-serif text-2xl text-[#071629]">Living systems, in focus.</p><p className="mt-2 text-sm leading-5 text-[#43556e]">Explore cells, organisms, heredity, ecosystems and biological systems with the analytical habits needed for HSC Biology.</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#657084]">Cellular processes · Genetics · Ecosystems</p></motion.div>
              <motion.div style={reducedMotion ? { opacity: 0 } : { opacity: chemistryCaptionOpacity }} className="science-scale-caption pointer-events-none absolute left-5 top-full mt-12 max-w-[18rem] border-l-2 border-[#c9a227] pl-4 xl:left-auto xl:right-[clamp(3rem,8vw,10rem)] xl:top-1/2 xl:mt-0 xl:w-64 xl:-translate-y-1/2"><p className="text-[9px] font-black uppercase tracking-[.2em] text-[#c9a227]">HSC CHEMISTRY · YEARS 11–12</p><p className="mt-2 font-serif text-2xl text-[#071629]">Matter, in motion.</p><p className="mt-2 text-sm leading-5 text-[#43556e]">Understand how particles, structure, bonding and reactions explain matter—from microscopic interactions to observable change.</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#657084]">Structure &amp; bonding · Reactions · Quantitative chemistry</p></motion.div>
              <motion.div style={reducedMotion ? { opacity: 0 } : { opacity: physicsCaptionOpacity }} className="science-scale-caption pointer-events-none absolute left-5 top-full mt-12 max-w-[18rem] border-l-2 border-[#c9a227] pl-4 xl:left-auto xl:right-[clamp(3rem,8vw,10rem)] xl:top-1/2 xl:mt-0 xl:w-64 xl:-translate-y-1/2"><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#c9a227]">HSC PHYSICS · YEARS 11–12</p><p className="mt-2 font-serif text-2xl text-[#071629]">The rules beneath every scale.</p><p className="mt-2 text-[15px] leading-6 text-[#43556e]">Explore forces, energy, waves and fields that shape the physical world—from the falling apple to interactions within matter.</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#657084]">Motion &amp; forces · Waves &amp; energy · Fields</p></motion.div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-l border-[#c9a227] pl-6 lg:mt-20"><p className="text-[10px] font-black uppercase tracking-[.24em] text-[#c9a227]">HSC SPECIALISATION</p><p className="mt-3 max-w-lg text-sm leading-6 text-[#52647a]">Follow the scale that most interests you, then study it in depth.</p></div>
        <section className="science-programs__hsc mt-8 grid border-t border-[#071629]/20 lg:grid-cols-3" aria-label="HSC science specialisations">
          {SCIENCE_LENSES.map((subject) => (
            <article key={subject.label} className="group relative border-b border-[#071629]/20 p-7 transition-colors duration-200 hover:bg-[#fff6e7] focus-within:bg-[#fff6e7] lg:min-h-[465px] lg:border-b-0 lg:p-9 lg:not-first:border-l">
              <p className="text-[9px] font-black uppercase tracking-[.23em] text-[#c9a227]">HSC {subject.label}</p>
              <h3 className="mt-5 font-serif text-4xl font-medium tracking-[-.045em] text-[#071629]">{subject.label}</h3>
              <p className="mt-3 text-[14px] leading-6 text-[#4c5e74]">{subject.tagline}</p>
              <p className="mt-5 border-t border-[#071629]/15 pt-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#657084]">{subject.scale}</p>
              <ul className="mt-3 space-y-2 border-b border-[#071629]/15 pb-4 text-[12px] text-[#52647a]">{subject.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              <div className="mt-5 text-[#071629] transition-transform duration-200 group-hover:translate-x-1 group-focus-within:translate-x-1"><LensStudy kind={subject.diagram} /></div>
              <Link to="/book-interview" className="mt-3 inline-flex items-center gap-2 border-b border-[#c9a227] pb-1.5 text-[10px] font-black uppercase tracking-[.15em] text-[#071629] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#071629]">Explore program <ArrowRight className="h-3.5 w-3.5" /></Link>
            </article>
          ))}
        </section>

        <div className="mt-16 border-t border-[#071629]/20 pt-8 text-center"><svg viewBox="0 0 1100 35" aria-hidden="true" className="mx-auto h-8 w-full max-w-5xl fill-none"><path d="M0 5c120 0 170 25 310 25s178-25 240-25 98 25 240 25S980 5 1100 5" stroke="#c9a227" strokeWidth="1.2" /></svg><p className="mt-6 font-serif text-2xl tracking-[-.03em] text-[#071629]">Not sure which pathway is right?</p><Link to="/book-interview" className="mt-4 inline-flex items-center gap-2 border-b border-[#c9a227] pb-1.5 text-[10px] font-black uppercase tracking-[.16em] text-[#071629] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#071629]">Book a consultation <ArrowRight className="h-3.5 w-3.5" /></Link></div>
        </div>
      </div>
    </section>
  );
}

const SCIENCE_FACTS = [
  {
    title: '🪐 A day on Venus is longer than a year on Venus.',
    body: 'Venus spins so slowly that it takes 243 Earth days to rotate once on its axis. However, it only takes 225 Earth days to complete one orbit around the Sun. If you lived on Venus, you would celebrate your birthday before the planet finished a single day.',
  },
  {
    title: "🌞 If the Sun suddenly disappeared, Earth wouldn't know for about 8 minutes.",
    body: 'Light takes approximately 8 minutes and 20 seconds to travel from the Sun to Earth. If the Sun vanished instantly, we would continue seeing sunlight—and feeling its gravity—for those eight minutes before everything changed.',
  },
  {
    title: '⭐ Every atom in your body was once inside a star.',
    body: 'The carbon in your muscles, the oxygen you breathe, the calcium in your bones, and the iron in your blood were all created by ancient stars billions of years ago before being scattered across space by exploding supernovae. In a very real sense, we are made of stardust.',
  },
  {
    title: '⚡ Lightning is much hotter than the surface of the Sun.',
    body: "A lightning bolt can reach temperatures of around 30,000°C—about five times hotter than the Sun's surface. This intense heat causes the surrounding air to expand explosively, producing the sound wave we hear as thunder.",
  },
  {
    title: '🦈 Sharks are older than trees.',
    body: "The first sharks appeared in Earth's oceans over 400 million years ago. The earliest trees didn't evolve until roughly 350 million years ago, meaning sharks had already been swimming the oceans for around 50 million years before forests existed.",
  },
  {
    title: '🧊 Ice floats because it expands when it freezes.',
    body: 'Most substances become denser as they cool. Water behaves differently. As it freezes, its molecules arrange into an open crystal structure that takes up more space, making ice less dense than liquid water. Without this unusual property, lakes would freeze from the bottom up and life on Earth would be very different.',
  },
  {
    title: '🧬 Your DNA is incredibly long.',
    body: 'If you stretched out all the DNA inside just one of your cells, it would measure about two metres long. Since your body contains around 37 trillion cells, the total length of your DNA would be long enough to travel from Earth to the Sun—and back—hundreds of times.',
  },
  {
    title: '🐙 An octopus has three hearts and blue blood.',
    body: 'Two hearts pump blood to the gills while the third pumps it around the rest of the body. Their blood appears blue because it uses a copper-rich molecule called hemocyanin to transport oxygen instead of the iron-based haemoglobin found in humans.',
  },
  {
    title: "🌍 Earth isn't perfectly round.",
    body: 'Because Earth rotates, centrifugal force causes the equator to bulge outward slightly. As a result, our planet is about 43 kilometres wider around the equator than it is from the North Pole to the South Pole.',
  },
  {
    title: '🍌 Bananas are naturally radioactive.',
    body: "Bananas contain potassium, including a tiny amount of the radioactive isotope potassium-40. The amount is completely harmless—you would need to eat millions of bananas at once before the radiation became dangerous—but it's a fascinating example of natural radioactivity found in everyday life.",
  },
] as const;

const NEWTON_APPLES = [
  { id: 'upper-centre-right', sourceX: 1220, sourceY: 350, sourceSize: 74, fallX: -62, fallY: 395, asset: 'gold', rotation: -4, fallRotation: 51, mirror: true, scale: .94, mobileVisible: false, smallMobileVisible: false },
  { id: 'lower-left-hero', sourceX: 646, sourceY: 322, sourceSize: 70, fallX: 48, fallY: 422, asset: 'gold', rotation: -5, fallRotation: 44, mirror: false, scale: .92, mobileVisible: false, smallMobileVisible: false },
  { id: 'centre-lower-red', sourceX: 826, sourceY: 405, sourceSize: 70, fallX: 0, fallY: 382, asset: 'red', rotation: 4, fallRotation: 52, mirror: true, scale: .92, mobileVisible: false, smallMobileVisible: false },
  { id: 'lower-centre-hero', sourceX: 927, sourceY: 376, sourceSize: 74, fallX: -6, fallY: 386, asset: 'green', rotation: -3, fallRotation: 48, mirror: false, scale: .94, mobileVisible: false, smallMobileVisible: false },
  { id: 'right-lower-red', sourceX: 1131, sourceY: 380, sourceSize: 70, fallX: -48, fallY: 374, asset: 'red', rotation: 3, fallRotation: 55, mirror: false, scale: .92, mobileVisible: true, smallMobileVisible: true },
  { id: 'mid-low-red', sourceX: 969, sourceY: 573, sourceSize: 64, fallX: -18, fallY: 232, asset: 'gold', rotation: -4, fallRotation: 43, mirror: true, scale: .9, mobileVisible: false, smallMobileVisible: false },
] as const;

const NEWTON_ARTWORK_WIDTH = 1536;
const NEWTON_ARTWORK_HEIGHT = 1024;
const NEWTON_IMPACT_MS = 1420;
const NEWTON_RESET_MS = 4300;
const NEWTON_APPLE_ASSETS = {
  red: '/images/newton-apples/apple-red.png',
  gold: '/images/newton-apples/apple-gold.png',
  green: '/images/newton-apples/apple-green.png',
} as const;

type ScienceFact = typeof SCIENCE_FACTS[number];

const formatFactTitle = (title: string) => title.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D]+\s*/u, '');

const factCatalogueNumber = (fact: ScienceFact) => {
  const factIndex = SCIENCE_FACTS.findIndex((candidate) => candidate.title === fact.title);
  return factIndex >= 0 ? String(factIndex + 1).padStart(2, '0') : '—';
};

const randomFact = (current: ScienceFact | null) => {
  let next = SCIENCE_FACTS[Math.floor(Math.random() * SCIENCE_FACTS.length)];
  while (next.title === current?.title) {
    next = SCIENCE_FACTS[Math.floor(Math.random() * SCIENCE_FACTS.length)];
  }
  return next;
};

const NewtonGravityExperience = () => {
  const [activeFact, setActiveFact] = useState<ScienceFact | null>(null);
  const [fallingApple, setFallingApple] = useState<string | null>(null);
  const [restoringApple, setRestoringApple] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [visibleAppleIds, setVisibleAppleIds] = useState<Set<string>>(() => new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const treeWrapRef = useRef<HTMLDivElement>(null);
  const appleButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const resetTimerRef = useRef<number | null>(null);
  const factTimerRef = useRef<number | null>(null);
  const restoreTimerRef = useRef<number | null>(null);
  const lastFactRef = useRef<ScienceFact | null>(null);
  const debugMode = import.meta.env.DEV
    && typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).get('newtonDebug') === '1';
  // This is the first half of the same native-scroll story that resolves in
  // SciencePrograms below. The sticky orchard gives the apple enough physical
  // room to detach, cross the ground plane, and create the lens transition.
  const { scrollYProgress: storyProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const storyAppleY = useTransform(storyProgress, [0, .62, .76, .89, .96, 1], ['0vh', '0vh', '4vh', '22vh', '34vh', '38vh']);
  const storyAppleRotate = useTransform(storyProgress, [0, .62, .89, .96, 1], [-5, -5, 38, 64, 74]);
  const storyAppleScale = useTransform(storyProgress, [0, .62, .89, .96, 1], [1, 1, 1.04, .98, .95]);
  // The orchard apple is the source object for the optical handoff. Keep it
  // present until the cream field and detailed lens specimen have taken over;
  // the overlap prevents a visible apple-to-nothing frame in either direction.
  const storyAppleOpacity = useTransform(storyProgress, [0, .88, 1], [1, 1, 1]);
  const storyContentOpacity = useTransform(storyProgress, [0, .84, .91], [1, 1, 0]);
  const scrollCueOpacity = useTransform(storyProgress, [.55, .64, .79, .86], [0, 1, 1, 0]);
  // The orchard and the fallen apple share this plane. Scaling it around the
  // apple anchor turns the final fall into a camera approach, rather than
  // asking an unrelated lens to do all of the narrative work.
  const storyPushScale = useTransform(storyProgress, [0, .82, .96, 1], [1, 1, 1.46, 1.66]);
  const storyPushX = useTransform(storyProgress, [0, .82, .96, 1], ['0vw', '0vw', '-15vw', '-20vw']);
  const storyPushY = useTransform(storyProgress, [0, .82, .96, 1], ['0vh', '0vh', '-11vh', '-15vh']);
  const storyFocusOpacity = useTransform(storyProgress, [.78, .90, .98, 1], [0, .12, .32, .42]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const mobileMedia = window.matchMedia('(max-width: 680px)');
    const smallMobileMedia = window.matchMedia('(max-width: 360px)');
    const update = () => {
      setIsMobile(mobileMedia.matches);
      setIsSmallMobile(smallMobileMedia.matches);
    };
    update();
    mobileMedia.addEventListener('change', update);
    smallMobileMedia.addEventListener('change', update);
    return () => {
      mobileMedia.removeEventListener('change', update);
      smallMobileMedia.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => () => {
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    if (factTimerRef.current) window.clearTimeout(factTimerRef.current);
    if (restoreTimerRef.current) window.clearTimeout(restoreTimerRef.current);
  }, []);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const treeWrap = treeWrapRef.current;
    if (!scene || !treeWrap) return;

    const updateAppleVisibility = () => {
      const sceneRect = scene.getBoundingClientRect();
      const wrapRect = treeWrap.getBoundingClientRect();
      const clip = {
        left: Math.max(sceneRect.left, wrapRect.left),
        right: Math.min(sceneRect.right, wrapRect.right),
        top: Math.max(sceneRect.top, wrapRect.top),
        bottom: Math.min(sceneRect.bottom, wrapRect.bottom),
      };
      const next = new Set<string>();

      appleButtonRefs.current.forEach((button, appleId) => {
        if (button.hidden) return;
        const rect = button.getBoundingClientRect();
        if (rect.right > clip.left && rect.left < clip.right && rect.bottom > clip.top && rect.top < clip.bottom) {
          next.add(appleId);
        }
      });

      setVisibleAppleIds((current) => {
        if (current.size === next.size && [...current].every((appleId) => next.has(appleId))) return current;
        return next;
      });
    };

    const observer = new ResizeObserver(updateAppleVisibility);
    observer.observe(scene);
    observer.observe(treeWrap);
    const frame = window.requestAnimationFrame(updateAppleVisibility);
    window.addEventListener('resize', updateAppleVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateAppleVisibility);
      observer.disconnect();
    };
  }, [isMobile, isSmallMobile]);

  const revealFact = () => {
    const nextFact = randomFact(lastFactRef.current);
    lastFactRef.current = nextFact;
    setActiveFact(nextFact);
  };

  const restoreApple = (appleId: string) => {
    setFallingApple(null);
    setRestoringApple(appleId);
    restoreTimerRef.current = window.setTimeout(() => setRestoringApple(null), 180);
  };

  const handleAppleClick = (appleId: string) => {
    if (fallingApple) return;

    setHasInteracted(true);

    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    if (factTimerRef.current) window.clearTimeout(factTimerRef.current);
    if (restoreTimerRef.current) window.clearTimeout(restoreTimerRef.current);

    setFallingApple(appleId);
    setRestoringApple(null);
    setActiveFact(null);

    if (reducedMotion) {
      revealFact();
      resetTimerRef.current = window.setTimeout(() => restoreApple(appleId), 900);
      return;
    }

    factTimerRef.current = window.setTimeout(revealFact, NEWTON_IMPACT_MS);

    resetTimerRef.current = window.setTimeout(() => {
      restoreApple(appleId);
    }, NEWTON_RESET_MS);
  };

  const handleFactClose = () => {
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    if (factTimerRef.current) window.clearTimeout(factTimerRef.current);
    setActiveFact(null);
    if (fallingApple) restoreApple(fallingApple);
  };

  return (
    <section id="science-concerns" ref={sectionRef} className="newton-gravity science-journey">
      <style>{`
        .newton-gravity {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 72% 28%, rgba(201, 162, 39, .12), transparent 28%),
            radial-gradient(circle at 10% 12%, rgba(255, 255, 255, .82), transparent 34%),
            linear-gradient(135deg, #fffaf0 0%, #fff6e7 46%, #f5ecd9 100%);
          color: #071629;
        }

        @media (min-width: 1025px) {
          .science-journey {
            min-height: 260svh;
            overflow: visible;
          }

          .science-journey .newton-gravity__inner {
            position: sticky;
            top: 0;
            height: 100svh;
            min-height: 100svh;
            box-sizing: border-box;
          }
        }

        .newton-gravity::before,
        .newton-gravity::after {
          content: "";
          position: absolute;
          pointer-events: none;
        }

        .newton-gravity::before {
          inset: 0;
          background:
            radial-gradient(ellipse at 68% 76%, rgba(82, 120, 58, .14), transparent 42%),
            linear-gradient(90deg, rgba(255, 250, 240, .94) 0%, rgba(255, 250, 240, .5) 35%, transparent 68%);
          z-index: 0;
        }

        .newton-gravity::after {
          left: 0;
          right: 0;
          bottom: -1px;
          height: 124px;
          z-index: 2;
          background: linear-gradient(180deg, transparent, #fffdf8 84%);
        }

        .newton-gravity__inner {
          position: relative;
          z-index: 3;
          min-height: clamp(680px, 78vh, 820px);
          max-width: 1580px;
          margin: 0 auto;
          padding: clamp(42px, 5vw, 74px) clamp(18px, 4vw, 64px) clamp(48px, 5vw, 78px);
        }

        .newton-gravity__content {
          position: relative;
          z-index: 5;
          max-width: 530px;
          padding-top: clamp(14px, 3vw, 38px);
        }

        .newton-gravity__eyebrow {
          margin: 0 0 18px;
          font-size: clamp(.72rem, .9vw, .86rem);
          font-weight: 900;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: #c9a227;
        }

        .newton-gravity__title {
          margin: 0;
          max-width: 530px;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(2.55rem, 3.45vw, 4.15rem);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -.03em;
          color: #071629;
          text-wrap: balance;
        }

        .newton-gravity__title .newton-title-line {
          display: block;
          color: inherit;
        }

        .newton-title-dot {
          color: #c9a227;
        }

        .newton-title-rule {
          width: 82px;
          height: 3px;
          margin: 24px 0 24px;
          border-radius: 999px;
          background: #c9a227;
        }

        .newton-gravity__copy {
          max-width: 520px;
          margin: 0;
          font-size: clamp(.98rem, 1.08vw, 1.1rem);
          font-weight: 650;
          line-height: 1.74;
          color: rgba(16, 35, 63, .62);
        }

        .newton-law-card {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          max-width: 430px;
          margin-top: 24px;
          padding: clamp(18px, 1.8vw, 24px);
          border: 1px solid rgba(201, 162, 39, .18);
          border-radius: 22px;
          background: rgba(255, 255, 255, .76);
          box-shadow: 0 18px 48px rgba(7, 22, 41, .07);
          backdrop-filter: blur(18px);
        }

        .newton-fact__icon {
          display: grid;
          place-items: center;
          width: 62px;
          height: 62px;
          border-radius: 999px;
          background: rgba(201, 162, 39, .12);
          color: #c9a227;
        }

        .newton-law-card__icon {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 999px;
          background: rgba(201, 162, 39, .12);
          color: #c9a227;
        }

        .newton-law-card h3 {
          margin: 0 0 10px;
          font-size: clamp(.82rem, .95vw, .98rem);
          font-weight: 900;
          letter-spacing: .085em;
          line-height: 1.36;
          text-transform: uppercase;
          color: #b98512;
        }

        .newton-law-card p {
          margin: 0;
          font-size: clamp(.88rem, .95vw, .98rem);
          font-weight: 650;
          line-height: 1.58;
          color: rgba(16, 35, 63, .76);
        }

        .newton-click-note {
          position: absolute;
          left: clamp(390px, 32vw, 490px);
          top: 38%;
          z-index: 6;
          width: 210px;
          color: #10233f;
          font-family: "Bradley Hand", "Segoe Print", "Comic Sans MS", cursive;
          font-size: clamp(1.22rem, 2vw, 1.65rem);
          font-weight: 700;
          line-height: 1.18;
          letter-spacing: .01em;
          transform: rotate(-4deg);
          pointer-events: none;
          text-shadow: 0 1px 0 rgba(255,255,255,.35);
        }

        .newton-click-note svg {
          display: block;
          width: 94px;
          height: 58px;
          margin: 6px 0 0 70px;
        }

        .newton-scene {
          --tree-width: clamp(1580px, 122vw, 2200px);
          position: absolute;
          inset: 0;
          z-index: 2;
          border-radius: 0;
          isolation: isolate;
          overflow: visible;
          pointer-events: none;
        }

        .newton-scene__halo {
          position: absolute;
          inset: 8% 3% 7% 0;
          z-index: 0;
          border-radius: 999px;
          background:
            radial-gradient(circle at 42% 28%, rgba(255, 246, 190, .62), transparent 28%),
            radial-gradient(circle at 68% 52%, rgba(201, 162, 39, .18), transparent 38%);
          filter: blur(18px);
          opacity: .9;
        }

        .newton-tree-wrap {
          position: absolute;
          inset: -18% -8% 0 0;
          z-index: 1;
          overflow: hidden;
          border-radius: 0;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent 20%, rgba(0,0,0,.18) 27%, rgba(0,0,0,.82) 38%, #000 48%, #000 100%);
          mask-image: linear-gradient(90deg, transparent 0%, transparent 20%, rgba(0,0,0,.18) 27%, rgba(0,0,0,.82) 38%, #000 48%, #000 100%);
        }

        .newton-focus-falloff {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: radial-gradient(circle at 69.5% 65.8%, transparent 0%, transparent 13%, rgba(7,22,41,.04) 28%, rgba(255,248,235,.22) 68%, rgba(255,248,235,.42) 100%);
        }

        .newton-tree-layer {
          position: absolute;
          bottom: 0;
          right: -12%;
          width: var(--tree-width);
          aspect-ratio: 3 / 2;
          filter: saturate(1.04) contrast(1.02) drop-shadow(0 34px 48px rgba(7, 22, 41, .18));
          transform-origin: 58% 22%;
          transition: transform 900ms cubic-bezier(.16, 1, .3, 1);
          will-change: transform;
        }

        .newton-tree {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          object-position: right bottom;
        }

        .newton-scene:hover .newton-tree-layer {
          transform: rotate(.35deg) scale(1.006);
        }

        .newton-apple {
          position: absolute;
          left: var(--apple-x);
          top: var(--apple-y);
          z-index: 4;
          display: grid;
          place-items: center;
          width: max(44px, var(--apple-size));
          height: max(44px, var(--apple-size));
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: transparent;
          box-shadow: none;
          cursor: pointer;
          pointer-events: auto;
          transform: translate3d(-50%, -50%, 0);
          transform-origin: 50% 18%;
          -webkit-tap-highlight-color: transparent;
        }

        .newton-scroll-apple-anchor {
          position: absolute;
          left: 69.5%;
          top: 65.8%;
          z-index: 5;
          width: clamp(46px, calc(72 / 1536 * var(--tree-width)), 92px);
          height: clamp(46px, calc(72 / 1536 * var(--tree-width)), 92px);
          pointer-events: none;
          transform: translate3d(-50%, -50%, 0);
        }

        .newton-scroll-apple {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 5px 5px rgba(50, 28, 7, .3));
          transform-origin: 50% 18%;
          will-change: transform, opacity;
        }

        .newton-apple[hidden] {
          display: none;
        }

        .newton-apple__image {
          display: block;
          width: calc(var(--apple-size) * var(--apple-scale));
          height: calc(var(--apple-size) * var(--apple-scale));
          max-width: none;
          object-fit: contain;
          pointer-events: none;
          filter: drop-shadow(0 5px 5px rgba(50, 28, 7, .28));
          transform: scaleX(var(--apple-mirror)) rotate(var(--apple-rotation));
          transform-origin: 50% 18%;
          transition: filter 180ms ease, transform 220ms cubic-bezier(.16, 1, .3, 1);
        }

        .newton-apple.is-discovery-cue {
          animation: newtonAppleDiscoveryCue 4.2s ease-in-out infinite;
        }

        .newton-apple.is-discovery-cue:hover,
        .newton-apple.is-discovery-cue:focus-visible {
          animation-play-state: paused;
        }

        .newton-apple:hover:not(:disabled) .newton-apple__image {
          filter: brightness(1.07) saturate(1.04) drop-shadow(0 7px 8px rgba(50, 28, 7, .34));
          transform: scaleX(var(--apple-mirror)) rotate(var(--apple-hover-rotation)) translateY(-3px);
        }

        .newton-apple:focus-visible {
          outline: 3px solid rgba(7, 22, 41, .88);
          outline-offset: 5px;
          border-radius: 42% 48% 46% 44%;
        }

        .newton-apple:disabled {
          cursor: default;
        }

        .newton-apple.is-falling {
          pointer-events: none;
          will-change: transform, opacity;
          animation: newtonAppleFall 4.3s linear forwards;
        }

        .newton-apple.is-restoring {
          animation: newtonAppleRestore 180ms ease-out both;
        }

        .newton-impact {
          position: absolute;
          left: calc(var(--apple-x) + var(--fall-x));
          top: calc(var(--apple-y) + var(--fall-y));
          z-index: 3;
          width: 82px;
          height: 22px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, .5);
          background: radial-gradient(ellipse, rgba(255, 247, 205, .32), transparent 72%);
          opacity: 0;
          transform: translate3d(-50%, -50%, 0) scale(.2);
          pointer-events: none;
        }

        .newton-impact.is-active {
          animation: impactRipple 920ms ease-out 1.38s forwards;
        }

        .newton-debug {
          position: absolute;
          inset: 0;
          z-index: 9;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }

        .newton-fact {
          position: absolute;
          right: clamp(120px, 8vw, 180px);
          bottom: clamp(80px, 10vh, 140px);
          z-index: 7;
          pointer-events: auto;
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr) 38px;
          gap: 20px;
          align-items: start;
          isolation: isolate;
          width: clamp(500px, 36vw, 610px);
          max-width: calc(100% - 240px);
          padding: clamp(28px, 2.3vw, 36px) clamp(28px, 2.7vw, 42px);
          border: 0;
          color: #142b47;
          background: #f3dfb3;
          clip-path: polygon(1.2% 3%, 5% 1.2%, 10% 2.2%, 16% .8%, 22% 1.8%, 30% .6%, 38% 1.7%, 47% .5%, 55% 1.6%, 64% .8%, 72% 1.8%, 81% .5%, 90% 1.4%, 96% .8%, 99% 4%, 98.2% 10%, 99.3% 18%, 98.4% 28%, 99.4% 38%, 98.3% 48%, 99.2% 58%, 98.1% 68%, 99.1% 78%, 98.4% 88%, 99% 96%, 96% 99%, 89% 98.4%, 81% 99.2%, 73% 98.1%, 65% 99.3%, 56% 98.4%, 48% 99.2%, 39% 98.2%, 31% 99.4%, 23% 98.3%, 15% 99.1%, 8% 98.1%, 1.5% 96%, 2.2% 88%, .8% 79%, 1.8% 69%, .7% 59%, 1.7% 48%, .6% 37%, 1.6% 27%, .7% 17%);
          filter: drop-shadow(0 18px 22px rgba(58, 37, 12, .26));
        }

        .newton-fact::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 14% 18%, rgba(255, 251, 224, .58), transparent 28%),
            radial-gradient(ellipse at 78% 70%, rgba(122, 84, 31, .07), transparent 34%),
            repeating-linear-gradient(8deg, transparent 0 7px, rgba(94, 63, 24, .022) 8px, transparent 9px 16px),
            repeating-linear-gradient(96deg, transparent 0 13px, rgba(255, 252, 229, .035) 14px, transparent 15px 23px),
            linear-gradient(103deg, rgba(255, 250, 222, .78), rgba(231, 203, 145, .28) 46%, rgba(255, 246, 208, .7));
          box-shadow: inset 0 0 38px rgba(116, 74, 22, .13);
        }

        .newton-fact > * {
          position: relative;
          z-index: 1;
        }

        .newton-fact__catalogue {
          align-self: stretch;
          min-height: 100%;
          padding: 2px 14px 0 0;
          border-right: 1px solid rgba(20, 43, 71, .56);
          color: #a6750b;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.05rem;
          font-variant-numeric: lining-nums tabular-nums;
          line-height: 1.2;
        }

        .newton-fact__label {
          margin: 0 0 12px;
          padding-bottom: 9px;
          border-bottom: 1px solid rgba(20, 43, 71, .42);
          font-family: Georgia, 'Times New Roman', serif;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: #142b47;
        }

        .newton-fact__text {
          margin: 0;
          font-size: .93rem;
          line-height: 1.62;
          color: rgba(20, 43, 71, .86);
        }

        .newton-fact__title {
          margin: 0 0 12px;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(1.16rem, 1.35vw, 1.42rem);
          font-weight: 600;
          line-height: 1.32;
          letter-spacing: -.018em;
          color: #142b47;
        }

        .newton-fact__body {
          margin: 0;
          color: rgba(20, 43, 71, .82);
        }

        .newton-fact__close {
          align-self: start;
          justify-self: end;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          margin: -10px -12px 0 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: rgba(20, 43, 71, .72);
          cursor: pointer;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.6rem;
          line-height: 1;
        }

        .newton-fact__close:hover {
          color: #142b47;
        }

        .newton-fact__close:focus-visible {
          outline: 2px solid #142b47;
          outline-offset: 2px;
          border-radius: 3px;
          color: #142b47;
        }

        @keyframes newtonAppleDiscoveryCue {
          0%, 67%, 100% { transform: translate3d(-50%, -50%, 0) rotate(0deg); }
          73% { transform: translate3d(-50%, -50%, 0) rotate(-2.5deg); }
          79% { transform: translate3d(-50%, -50%, 0) rotate(2deg); }
          85% { transform: translate3d(-50%, -50%, 0) rotate(-1.2deg); }
          91% { transform: translate3d(-50%, -50%, 0) rotate(.6deg); }
          96% { transform: translate3d(-50%, -50%, 0) rotate(0deg); }
        }

        @keyframes newtonAppleFall {
          0% {
            transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          3.25% {
            transform: translate3d(calc(-50% + 1px), calc(-50% - 4px), 0) rotate(-3deg) scale(1.01);
            animation-timing-function: cubic-bezier(.45, 0, .75, .4);
          }
          26% {
            transform: translate3d(calc(-50% + var(--fall-x) * .62), calc(-50% + var(--fall-y) * .48), 0) rotate(calc(var(--fall-rotation) * .42)) scale(1);
            animation-timing-function: cubic-bezier(.4, 0, .9, .64);
          }
          32.3% {
            transform: translate3d(calc(-50% + var(--fall-x)), calc(-50% + var(--fall-y)), 0) rotate(var(--fall-rotation)) scale(1);
            animation-timing-function: cubic-bezier(.16, 1, .3, 1);
          }
          34.4% {
            transform: translate3d(calc(-50% + var(--fall-x)), calc(-50% + var(--fall-y) + 2px), 0) rotate(var(--fall-rotation)) scaleX(1.08) scaleY(.88);
          }
          37%, 91% {
            transform: translate3d(calc(-50% + var(--fall-x)), calc(-50% + var(--fall-y) - 3px), 0) rotate(var(--fall-rotation)) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate3d(calc(-50% + var(--fall-x)), calc(-50% + var(--fall-y) - 3px), 0) rotate(var(--fall-rotation)) scale(.96);
            opacity: 0;
          }
        }

        @keyframes newtonAppleRestore {
          from { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(.96); }
          to { opacity: 1; transform: translate3d(-50%, -50%, 0) scale(1); }
        }

        @keyframes impactRipple {
          0% { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(.2); }
          26% { opacity: .72; }
          100% { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(1.55); }
        }

        @media (max-width: 1024px) {
          .newton-gravity__inner {
            grid-template-columns: 1fr;
            min-height: 0;
          }

          .newton-gravity__content {
            max-width: 760px;
          }

          .newton-scene {
            min-height: clamp(520px, 70vw, 680px);
            --tree-width: clamp(980px, 136vw, 1380px);
          }

          .newton-tree-layer {
            right: -10%;
            bottom: 0;
          }

          .newton-click-note {
            left: clamp(32px, 6vw, 64px);
            top: 44%;
          }

          .newton-fact {
            right: clamp(88px, 8vw, 120px);
            bottom: 104px;
            width: min(500px, calc(100% - 180px));
            max-width: none;
          }
        }

        @media (max-width: 680px) {
          .newton-gravity__inner {
            padding-top: 72px;
            padding-bottom: 0;
          }

          .newton-gravity__title {
            font-size: clamp(2.7rem, 13vw, 4rem);
          }

          .newton-law-card {
            grid-template-columns: 1fr;
          }

          .newton-click-note {
            left: 18px;
            top: 80px;
            font-size: 1.08rem;
            width: 160px;
          }

          .newton-click-note svg {
            margin: 6px 0 0 65px;
            transform: rotate(-35deg);
            transform-origin: 52% 44%;
          }

          .newton-scene {
            --tree-width: 1040px;
            position: relative;
            inset: auto;
            min-height: 460px;
            margin: 34px -18px 0;
          }

          .newton-scene.has-active-fact {
            min-height: 700px;
          }

          .newton-scene.has-active-fact .newton-fact {
            top: 230px;
            bottom: auto;
          }

          .newton-tree-wrap {
            inset: 0 -18px;
            -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 9%, #000 96%, transparent 100%);
            mask-image: linear-gradient(90deg, transparent 0%, #000 9%, #000 96%, transparent 100%);
          }

          .newton-tree-layer {
            right: -10%;
            top: 0;
            bottom: auto;
          }

          .newton-fact {
            position: absolute;
            left: 16px;
            right: 16px;
            bottom: 16px;
            width: auto;
            max-width: calc(100vw - 32px);
            margin: 0;
            grid-template-columns: 32px minmax(0, 1fr) 34px;
            gap: 12px;
            padding: 22px 20px 24px;
          }

          .newton-fact__catalogue {
            padding-right: 9px;
            font-size: .82rem;
          }

          .newton-fact__text {
            font-size: .84rem;
            line-height: 1.52;
          }

          .newton-fact__title {
            font-size: 1.08rem;
          }

          .newton-fact__close {
            width: 34px;
            height: 34px;
            margin: -8px -8px 0 0;
          }

          .science-focus-target {
            width: clamp(34px, 7%, 52px);
            aspect-ratio: 1;
            transform: translate(-50%, -50%);
            border: 1px solid rgba(201, 162, 39, .95);
            border-radius: 999px;
            box-shadow: 0 0 0 3px rgba(255, 248, 235, .18);
          }

          .science-focus-target::before,
          .science-focus-target::after {
            content: '';
            position: absolute;
            background: #c9a227;
          }

          .science-focus-target::before {
            left: 50%;
            top: -6px;
            width: 1px;
            height: calc(100% + 12px);
            background: linear-gradient(to bottom, #c9a227 0 5px, transparent 5px calc(100% - 5px), #c9a227 calc(100% - 5px));
          }

          .science-focus-target::after {
            top: 50%;
            left: -6px;
            height: 1px;
            width: calc(100% + 12px);
            background: linear-gradient(to right, #c9a227 0 5px, transparent 5px calc(100% - 5px), #c9a227 calc(100% - 5px));
          }

          .newton-scroll-cue {
            position: absolute;
            z-index: 4;
            left: clamp(32px, 6vw, 64px);
            bottom: 46px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #f6dd8d;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          .newton-scroll-cue::after {
            content: '';
            width: 18px;
            height: 18px;
            border-right: 1px solid currentColor;
            border-bottom: 1px solid currentColor;
            transform: rotate(45deg) translateY(-4px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .newton-tree,
          .newton-tree-layer,
          .newton-apple,
          .newton-apple__image,
          .newton-apple.is-falling,
          .newton-apple.is-restoring,
          .newton-apple.is-discovery-cue,
          .newton-impact.is-active,
          .newton-scene:hover .newton-tree-layer {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="newton-gravity__inner">
        <motion.div
          className="newton-gravity__content"
          initial={reducedMotion ? false : { y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: .65, ease: [0.16, 1, 0.3, 1] }}
          style={reducedMotion ? undefined : { opacity: storyContentOpacity }}
        >
          <p className="newton-gravity__eyebrow">Science in the Real World</p>
          <h2 className="newton-gravity__title">
            <span className="newton-title-line">From Curiosity</span>
            <span className="newton-title-line">to Discovery<span className="newton-title-dot">.</span></span>
          </h2>
          <div className="newton-title-rule" aria-hidden="true" />
          <p className="newton-gravity__copy">
            Science explains the world around us.<br />
            Explore Newton&apos;s Law of Universal Gravitation<br />
            through this interactive apple moment —<br />
            then click an apple to discover a fun science fact!
          </p>

          <div className="newton-law-card">
            <div className="newton-law-card__icon" aria-hidden="true">
              <Atom className="h-5 w-5" />
            </div>
            <div>
              <h3>Newton&apos;s Law of Universal Gravitation</h3>
              <p>
                Every object with mass attracts every other object.<br />
                The larger the mass, the stronger the attraction.<br />
                This invisible force is what pulls the apple toward the Earth.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={sceneRef}
          className={`newton-scene${activeFact ? ' has-active-fact' : ''}`}
          initial={reducedMotion ? false : { opacity: 0, scale: .985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: .8, delay: .08, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Interactive apple tree demonstrating gravity"
        >
          <div className="newton-scene__halo" aria-hidden="true" />
          <motion.div style={reducedMotion ? undefined : { opacity: storyContentOpacity }} className="newton-click-note" aria-hidden="true">
            Click an<br />
            apple to learn<br />
            a fun fact!
            <svg viewBox="0 0 120 80" fill="none">
              <path
                d="M12 10 C 28 54, 72 60, 102 38"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M92 25 L106 38 L90 48"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <motion.p style={reducedMotion ? { opacity: 1 } : { opacity: scrollCueOpacity }} className="newton-scroll-cue" aria-hidden="true">Scroll to follow the apple</motion.p>
          <motion.div aria-hidden="true" style={reducedMotion ? { opacity: 0 } : { opacity: storyFocusOpacity }} className="newton-focus-falloff" />
          <div ref={treeWrapRef} className="newton-tree-wrap">
            <motion.div className="newton-tree-layer" style={reducedMotion ? undefined : { x: storyPushX, y: storyPushY, scale: storyPushScale, transformOrigin: '69.5% 65.8%' }}>
              <img
                className="newton-tree"
                src="/images/apple-tree-background-clean.png"
                alt=""
                width={NEWTON_ARTWORK_WIDTH}
                height={NEWTON_ARTWORK_HEIGHT}
                loading="eager"
                decoding="async"
              />
              <div className="newton-scroll-apple-anchor" aria-hidden="true">
                <motion.img
                  className="newton-scroll-apple science-story-apple"
                  src={NEWTON_APPLE_ASSETS.red}
                  alt=""
                  style={reducedMotion ? { opacity: 0 } : { y: storyAppleY, rotate: storyAppleRotate, scale: storyAppleScale, opacity: storyAppleOpacity }}
                  draggable="false"
                  decoding="async"
                />
              </div>
              {NEWTON_APPLES.map((apple, index) => {
                const isFalling = fallingApple === apple.id;
                const isRestoring = restoringApple === apple.id;
                const hiddenForViewport = (isMobile && !apple.mobileVisible)
                  || (isSmallMobile && !apple.smallMobileVisible);
                const isInteractive = !hiddenForViewport && visibleAppleIds.has(apple.id);
                const fallY = isMobile ? Math.min(apple.fallY, 650 - apple.sourceY) : apple.fallY;
                return (
                  <button
                    ref={(button) => {
                      if (button) appleButtonRefs.current.set(apple.id, button);
                      else appleButtonRefs.current.delete(apple.id);
                    }}
                    key={apple.id}
                    type="button"
                    className={`newton-apple ${isFalling ? 'is-falling' : ''} ${isRestoring ? 'is-restoring' : ''} ${!hasInteracted && apple.id === 'right-lower-red' ? 'is-discovery-cue' : ''}`}
                    aria-label={`Drop apple ${index + 1} and reveal a science fact`}
                    aria-hidden={!isInteractive}
                    tabIndex={isInteractive ? 0 : -1}
                    disabled={Boolean(fallingApple)}
                    hidden={hiddenForViewport}
                    onClick={() => handleAppleClick(apple.id)}
                    style={{
                      ['--apple-x' as string]: `${(apple.sourceX / NEWTON_ARTWORK_WIDTH) * 100}%`,
                      ['--apple-y' as string]: `${(apple.sourceY / NEWTON_ARTWORK_HEIGHT) * 100}%`,
                      ['--apple-size' as string]: `clamp(38px, calc(${apple.sourceSize / NEWTON_ARTWORK_WIDTH} * var(--tree-width)), 92px)`,
                      ['--apple-scale' as string]: apple.scale,
                      ['--apple-mirror' as string]: apple.mirror ? -1 : 1,
                      ['--apple-rotation' as string]: `${apple.rotation}deg`,
                      ['--apple-hover-rotation' as string]: `${apple.rotation + (apple.rotation > 0 ? -3 : 3)}deg`,
                      ['--fall-rotation' as string]: `${apple.fallRotation}deg`,
                      ['--fall-x' as string]: `calc(${apple.fallX / NEWTON_ARTWORK_WIDTH} * var(--tree-width))`,
                      ['--fall-y' as string]: `calc(${fallY / NEWTON_ARTWORK_WIDTH} * var(--tree-width))`,
                    }}
                  >
                    <img
                      className="newton-apple__image"
                      src={NEWTON_APPLE_ASSETS[apple.asset]}
                      alt=""
                      width="384"
                      height="384"
                      draggable="false"
                      decoding="async"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}

              {NEWTON_APPLES.map((apple) => {
                const fallY = isMobile ? Math.min(apple.fallY, 650 - apple.sourceY) : apple.fallY;
                return (
                  <span
                    key={`impact-${apple.id}`}
                    className={`newton-impact ${fallingApple === apple.id ? 'is-active' : ''}`}
                    aria-hidden="true"
                    style={{
                      ['--apple-x' as string]: `${(apple.sourceX / NEWTON_ARTWORK_WIDTH) * 100}%`,
                      ['--apple-y' as string]: `${(apple.sourceY / NEWTON_ARTWORK_HEIGHT) * 100}%`,
                      ['--fall-x' as string]: `calc(${apple.fallX / NEWTON_ARTWORK_WIDTH} * var(--tree-width))`,
                      ['--fall-y' as string]: `calc(${fallY / NEWTON_ARTWORK_WIDTH} * var(--tree-width))`,
                    }}
                  />
                );
              })}

              {debugMode && (
                <svg className="newton-debug" viewBox={`0 0 ${NEWTON_ARTWORK_WIDTH} ${NEWTON_ARTWORK_HEIGHT}`} aria-hidden="true">
                  <rect x="2" y="2" width={NEWTON_ARTWORK_WIDTH - 4} height={NEWTON_ARTWORK_HEIGHT - 4} fill="none" stroke="#00e5ff" strokeWidth="4" />
                  {NEWTON_APPLES.map((apple) => (
                    <g key={`debug-${apple.id}`}>
                      <line
                        x1={apple.sourceX}
                        y1={apple.sourceY}
                        x2={apple.sourceX + apple.fallX}
                        y2={apple.sourceY + apple.fallY}
                        stroke="#00e5ff"
                        strokeWidth="3"
                        strokeDasharray="10 8"
                        vectorEffect="non-scaling-stroke"
                      />
                      <rect x={apple.sourceX - 22} y={apple.sourceY - 22} width="44" height="44" fill="rgba(0, 229, 255, .14)" stroke="#00e5ff" strokeWidth="2" />
                      <circle cx={apple.sourceX} cy={apple.sourceY} r="5" fill="#ff2d55" />
                      <circle cx={apple.sourceX + apple.fallX} cy={apple.sourceY + apple.fallY} r="8" fill="none" stroke="#ffe66d" strokeWidth="4" />
                      <text x={apple.sourceX + 12} y={apple.sourceY - 12} fill="#071629" stroke="#fff" strokeWidth="5" paintOrder="stroke" fontSize="22" fontWeight="800">
                        {apple.id} → ({apple.sourceX + apple.fallX}, {apple.sourceY + apple.fallY})
                      </text>
                    </g>
                  ))}
                </svg>
              )}
            </motion.div>
          </div>
          <AnimatePresence>
            {activeFact && (
              <motion.div
                className="newton-fact"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: .96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: .98 }}
                transition={{ duration: reducedMotion ? .12 : .32, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="newton-fact__catalogue" aria-hidden="true">
                  {factCatalogueNumber(activeFact)}
                </div>
                <div>
                  <p className="newton-fact__label">Fun Fact</p>
                  <div className="newton-fact__text">
                    <p className="newton-fact__title">{formatFactTitle(activeFact.title)}</p>
                    <p className="newton-fact__body">{activeFact.body}</p>
                  </div>
                </div>
                <button className="newton-fact__close" type="button" onClick={handleFactClose} aria-label="Close fun fact">
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const Science = () => {
  const [activeId, setActiveId] = useState<string>('lightning');
  const activeItem = WONDER_ITEMS.find(i => i.id === activeId)!;
  const constellationRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(constellationRef, { once: true, margin: '-120px' });


  const hscSubjects = [
    {
      name: 'Biology',
      badge: 'Concepts & investigations',
      topics: ['Genetics & evolution', 'Living systems', 'Ecological studies', 'Scientific investigations', 'Depth study skills'],
    },
    {
      name: 'Chemistry',
      badge: 'Calculations & analysis',
      topics: ['Chemical reactions', 'Stoichiometry', 'Organic chemistry', 'Equilibrium', 'Acid-base chemistry'],
    },
    {
      name: 'Physics',
      badge: 'Methods & problem-solving',
      topics: ['Mechanics', 'Electricity & magnetism', 'Waves', 'Quantum & nuclear', 'Space & relativity'],
    },
  ];

  const parentConcerns = [
    {
      icon: HelpCircle,
      title: 'My child understands the theory but freezes in exam questions.',
      detail: 'We teach students how to identify question types, structure responses, and work through multi-step problems under timed conditions.',
    },
    {
      icon: Clock,
      title: 'They memorise content but forget it all under pressure.',
      detail: 'We rebuild understanding from first principles so students can reconstruct answers confidently — not just retrieve memorised phrases.',
    },
    {
      icon: Target,
      title: 'Calculations in Physics and Chemistry always trip them up.',
      detail: 'We teach a systematic setup-select-execute method that makes calculation problems feel structured and manageable, not random.',
    },
  ];

  const teachingSteps = [
    { title: 'Diagnose', text: 'Identify the exact concepts, habits, and gaps holding the student back.' },
    { title: 'Explain', text: 'Break difficult ideas into clear steps with visual examples and guided practice.' },
    { title: 'Apply', text: 'Move from guided examples into exam-style questions with structured teacher feedback.' },
    { title: 'Master', text: 'Build speed, accuracy, and independent problem-solving that holds under pressure.' },
  ];

  const skills = [
    'Conceptual understanding',
    'Exam technique',
    'Calculation method',
    'Scientific reasoning',
    'Investigation skills',
    'Study structure',
  ];

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <ScienceIntroVideoGate />
      <SEO
        title="Science Tutoring – Biology, Chemistry & Physics (Years 7–12)"
        description="From Year 7 Science to HSC Biology, Chemistry and Physics, DA Tuition builds genuine understanding and exam confidence."
        canonicalUrl="/subjects/science"
      />
      <NavigationNew />

      <main>
        {/* ── Hero ── */}
        <SubjectHero
          eyebrow="Science Tutoring · Years 7-12"
          icon={Atom}
          headlineWhite="Curious about everything."
          headlineGold="Certain about why."
          subtext="From Years 7–10 Science to HSC Biology, Chemistry and Physics, we help students build genuine understanding — not just memorise content."
          proofPills={['Real-world explanations', 'Marked feedback', 'Clear HSC pathway']}
          exploreTargetId="science-pathways"
          placeholderLabel="Science classroom"
        />

        {/* ── Anchor nav ── */}
        <section className="px-5 pt-10 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-3 rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10 md:grid-cols-4">
            {[
              ['Curious minds',    '#science-concerns'],
              ['Science programs',  '#science-pathways'],
              ['HSC focus areas',  '#hsc-sciences'],
              ['How we teach',     '#hsc-sciences'],
            ].map(([label, href]) => (
              <a key={label} href={href} className="rounded-2xl px-4 py-3 text-center text-sm font-black text-[#10233f] transition hover:bg-[#f5ecd9]">
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* ── Newton's Law interactive experience ── */}
        <NewtonGravityExperience />

        {/* ── Legacy curiosity network retained off-screen while the Newton experience replaces this section ── */}
        <section aria-hidden="true" className="hidden">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

            {/* ── Mobile heading ── */}
            <div className="lg:hidden mb-8">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]">
                For Curious Minds
              </p>
              <h2 className="mb-3 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.042em] text-[#071629]">
                Every scientist<br />starts by wondering.
              </h2>
              <p className="text-sm leading-7 text-[#61708a]">
                Some questions sound silly. Some sound impossible. But the students who ask
                questions are often the ones who understand the most.
              </p>
            </div>

            {/* ── Desktop heading — full width, above the network ── */}
            <div className="hidden lg:block mb-16 max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]"
              >
                For Curious Minds
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.06 }}
                className="font-serif text-5xl font-medium leading-[1.06] tracking-[-0.042em] text-[#071629]"
              >
                Every scientist<br />starts by wondering.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.12 }}
                className="mt-5 text-sm leading-7 text-[#61708a]"
              >
                Some questions sound silly. Some sound impossible. But the students who ask
                questions are often the ones who understand the most. At DA, we help students
                turn everyday curiosity into scientific understanding and exam confidence.
              </motion.p>
            </div>

            {/* ── Curiosity Network + Science Lens — stacks on mobile, side-by-side on desktop ── */}
            <div className="grid lg:grid-cols-2 lg:items-center lg:gap-16">

              {/* ─── Network ─── */}
              <motion.div
                ref={constellationRef}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <svg
                  viewBox="0 0 460 460"
                  className="w-full"
                  style={{ overflow: 'visible' }}
                  aria-hidden="true"
                >
                  <defs>
                    {/* Central WHY glow */}
                    <radialGradient id="whyGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#c9a227" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* WHY node background glow */}
                  <circle cx={230} cy={230} r={120} fill="url(#whyGlow)" />

                  {/* ── Inner hex: radii from centre ── */}
                  {INNER_NODES.map((n, i) => {
                    const isLinked = activeItem.connectX === n.x && activeItem.connectY === n.y;
                    return (
                      <motion.line
                        key={`radius-${i}`}
                        x1={230} y1={230} x2={n.x} y2={n.y}
                        stroke="#c9a227"
                        strokeWidth={isLinked ? 1 : 0.55}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={isInView ? { pathLength: 1, opacity: isLinked ? 0.38 : 0.18 } : {}}
                        transition={{ duration: 0.4, delay: 0.04 + i * 0.05 }}
                      />
                    );
                  })}

                  {/* ── Inner hex: ring bonds ── */}
                  {INNER_BONDS.map(([a, b], i) => (
                    <motion.line
                      key={`bond-${i}`}
                      x1={INNER_NODES[a].x} y1={INNER_NODES[a].y}
                      x2={INNER_NODES[b].x} y2={INNER_NODES[b].y}
                      stroke="#c9a227"
                      strokeWidth={0.55}
                      strokeDasharray="2 6"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isInView ? { pathLength: 1, opacity: 0.2 } : {}}
                      transition={{ duration: 0.5, delay: 0.25 + i * 0.06 }}
                    />
                  ))}

                  {/* ── Inner hex: node dots ── */}
                  {INNER_NODES.map((n, i) => {
                    const isLinked = activeItem.connectX === n.x && activeItem.connectY === n.y;
                    return (
                      <g key={`inode-${i}`} style={{ pointerEvents: 'none' }}>
                        <circle cx={n.x} cy={n.y} r={isLinked ? 6 : 4}
                          fill="#fffdf8" stroke="#c9a227"
                          strokeWidth={isLinked ? 1.2 : 0.7}
                          opacity={isLinked ? 1 : 0.65}
                          style={{ transition: 'r 0.3s ease, opacity 0.3s ease' }}
                        />
                        <circle cx={n.x} cy={n.y} r={isLinked ? 2.5 : 1.6}
                          fill="#c9a227"
                          opacity={isLinked ? 0.8 : 0.4}
                          style={{ transition: 'r 0.3s ease, opacity 0.3s ease' }}
                        />
                      </g>
                    );
                  })}

                  {/* ── Question connection lines — subject-coloured, endpoint tracks node ── */}
                  {WONDER_ITEMS.map((item, i) => {
                    const active = activeId === item.id;
                    const col = SUBJECT_COLORS[item.subject];
                    const ndx = 20;
                    const ndy = (item.connectY - item.svgY) * 0.2;
                    const restPath = `M ${item.svgX} ${item.svgY} L ${item.connectX} ${item.connectY}`;
                    const activePath = `M ${item.svgX + ndx} ${item.svgY + ndy} L ${item.connectX} ${item.connectY}`;
                    return (
                      <motion.path
                        key={`qline-${item.id}`}
                        fill="none"
                        stroke={col.line}
                        strokeDasharray="3 7"
                        initial={{ pathLength: 0, opacity: 0, d: restPath }}
                        animate={isInView ? {
                          pathLength: 1,
                          opacity: active ? 0.58 : 0.13,
                          strokeWidth: active ? 1.6 : 0.7,
                          d: active ? activePath : restPath,
                        } : {}}
                        transition={{
                          pathLength: { duration: 0.75, delay: 0.55 + i * 0.1 },
                          opacity: { duration: 0.3 },
                          strokeWidth: { duration: 0.3 },
                          d: { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] },
                        }}
                      />
                    );
                  })}

                  {/* ── Question outer nodes — drift toward Science Lens on select ── */}
                  {WONDER_ITEMS.map((item, i) => {
                    const active = activeId === item.id;
                    const col = SUBJECT_COLORS[item.subject];
                    const ndx = 20;
                    const ndy = (item.connectY - item.svgY) * 0.2;
                    return (
                      <motion.g
                        key={`qnode-${item.id}`}
                        onMouseEnter={() => setActiveId(item.id)}
                        onClick={() => setActiveId(item.id)}
                        style={{ cursor: 'pointer' }}
                        animate={{ x: active ? ndx : 0, y: active ? ndy : 0 }}
                        transition={{ duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        {/* Hit area */}
                        <circle cx={item.svgX} cy={item.svgY} r={34} fill="transparent" />
                        {/* Active glow */}
                        {active && (
                          <circle cx={item.svgX} cy={item.svgY} r={26}
                            fill={col.node} opacity={0.1}
                          />
                        )}
                        {/* Outer node ring */}
                        <motion.circle
                          cx={item.svgX} cy={item.svgY}
                          r={active ? 14 : 9}
                          fill="#fffdf8"
                          stroke={col.node}
                          strokeWidth={active ? 2 : 1.2}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isInView ? {
                            opacity: active ? 1 : 0.45,
                            scale: 1,
                          } : {}}
                          transition={{ duration: 0.38, delay: 1.05 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ transition: 'r 0.3s ease', filter: active ? `drop-shadow(0 0 6px ${col.node}60)` : 'none' } as React.CSSProperties}
                        />
                        {/* Inner coloured dot */}
                        <motion.circle
                          cx={item.svgX} cy={item.svgY}
                          r={active ? 6 : 3.5}
                          fill={col.node}
                          initial={{ opacity: 0 }}
                          animate={isInView ? {
                            opacity: active ? 0.9 : 0.45,
                          } : {}}
                          transition={{ duration: 0.38, delay: 1.05 + i * 0.1 }}
                          style={{ transition: 'r 0.3s ease' } as React.CSSProperties}
                        />
                      </motion.g>
                    );
                  })}

                  {/* ── Question text labels — drift with node toward Science Lens ── */}
                  {WONDER_ITEMS.map((item, i) => {
                    const active = activeId === item.id;
                    const col = SUBJECT_COLORS[item.subject];
                    const ndx = 20;
                    const ndy = (item.connectY - item.svgY) * 0.2;
                    return (
                      <motion.g
                        key={`qlabel-${item.id}`}
                        initial={{ opacity: 0 }}
                        animate={isInView ? {
                          opacity: active ? 1 : 0.45,
                          x: active ? ndx : 0,
                          y: active ? ndy : 0,
                        } : { opacity: 0, x: 0, y: 0 }}
                        transition={{
                          opacity: { duration: 0.3, delay: isInView ? 1.3 + i * 0.09 : 0 },
                          x: { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] },
                          y: { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] },
                        }}
                        style={{ pointerEvents: 'none' }}
                      >
                        <text
                          x={item.textX} y={item.textY1}
                          textAnchor={item.textAnchor}
                          fontFamily="Georgia,'Times New Roman',serif"
                          fontSize={item.textSize}
                          fontStyle="italic"
                          fill={active ? col.text : '#1a2f50'}
                          style={{ transition: 'fill 0.25s ease' }}
                        >
                          <tspan x={item.textX} dy="0">{item.line1}</tspan>
                          <tspan x={item.textX} dy={item.textSize * 1.5}>{item.line2}</tspan>
                        </text>
                      </motion.g>
                    );
                  })}

                  {/* ── Central WHY? node — rendered last so it sits above all network lines ── */}
                  <motion.g
                    style={{ transformOrigin: '230px 230px' }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Outer atmospheric rings */}
                    <circle cx={230} cy={230} r={78}
                      fill="none" stroke="#c9a227" strokeWidth={0.6} opacity={0.06} />
                    <circle cx={230} cy={230} r={67}
                      fill="none" stroke="#c9a227" strokeWidth={0.7} opacity={0.10} />
                    {/* Pulsing ring — gentle, not dramatic */}
                    <motion.circle cx={230} cy={230} r={58}
                      fill="none" stroke="#c9a227" strokeWidth={0.8} opacity={0.13}
                      animate={isInView ? { r: [58, 76, 58], opacity: [0.13, 0, 0.13] } : {}}
                      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeOut', delay: 2.5 }}
                    />
                    {/* Main circle — enlarged for breathing room */}
                    <circle cx={230} cy={230} r={56}
                      fill="#fffdf8" stroke="#c9a227" strokeWidth={1.1} opacity={0.98} />
                    {/* WHY? — smaller, optically centred above midpoint */}
                    <text x={230} y={224} textAnchor="middle"
                      fontFamily="Georgia,'Times New Roman',serif"
                      fontSize={20} fill="#c9a227"
                      style={{ letterSpacing: '4px', fontWeight: '600' }}
                    >WHY?</text>
                    {/* Thin gold rule — separates heading from caption */}
                    <line x1={214} y1={230} x2={246} y2={230}
                      stroke="#c9a227" strokeWidth={0.5} opacity={0.28}
                    />
                    {/* Subtitle — whisper-quiet uppercase caption */}
                    <text x={230} y={242} textAnchor="middle"
                      fontFamily="Georgia,'Times New Roman',serif"
                      fontSize={5.2} fill="#071629" opacity={0.30}
                      style={{ letterSpacing: '0.8px' }}
                    >WHERE UNDERSTANDING BEGINS</text>
                  </motion.g>

                </svg>

                {/* Prompt */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.38 } : {}}
                  transition={{ duration: 0.4, delay: 2.4 }}
                  className="pointer-events-none mt-4 select-none text-center text-[10px] font-medium text-[#071629]"
                >
                  <span className="lg:hidden">Tap a node.</span>
                  <span className="hidden lg:inline">Hover a node.</span>
                  {' '}
                  <span className="opacity-60">
                    <span className="lg:hidden">The science opens below.</span>
                    <span className="hidden lg:inline">The science opens on the right.</span>
                  </span>
                </motion.p>
              </motion.div>

              {/* ─── Science Lens Panel ─── */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="mt-8 lg:mt-0"
              >
                {/* Mobile bridge: selected question → answer */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`bridge-${activeId}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.25 }}
                    className="lg:hidden mb-5"
                  >
                    <div className="mb-2.5 flex items-center gap-2">
                      <div className="h-px flex-1" style={{ background: `${SUBJECT_COLORS[activeItem.subject].node}28` }} />
                      <span
                        className="text-[8px] font-black uppercase tracking-[0.28em]"
                        style={{ color: SUBJECT_COLORS[activeItem.subject].text }}
                      >
                        {SUBJECT_ICONS[activeItem.subject]} {activeItem.subject}
                      </span>
                      <div className="h-px flex-1" style={{ background: `${SUBJECT_COLORS[activeItem.subject].node}28` }} />
                    </div>
                    <p className="text-center font-serif text-[1.05rem] italic leading-snug text-[#071629]">
                      {activeItem.question}
                    </p>
                    <div className="mt-3 flex justify-center">
                      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true">
                        <line x1="7" y1="0" x2="7" y2="14" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
                        <polyline points="3,9 7,14 11,9" fill="none" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
                      </svg>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Editorial section marker */}
                <p className="mb-8 flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.32em] text-[#c9a227]/50">
                  <span className="inline-block h-px w-5 bg-[#c9a227]/40" />
                  Science Lens
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Left-border accent — subject-coloured, runs full height */}
                    <div
                      className="border-l-[1.5px] pl-6"
                      style={{ borderColor: `${SUBJECT_COLORS[activeItem.subject].node}35` }}
                    >

                      {/* Subject label */}
                      <p
                        className="mb-4 text-[7.5px] font-black uppercase tracking-[0.36em]"
                        style={{ color: SUBJECT_COLORS[activeItem.subject].text }}
                      >
                        {SUBJECT_ICONS[activeItem.subject]}&nbsp;&nbsp;{activeItem.subject}
                      </p>

                      {/* Question — the visual focus */}
                      <h3 className="mb-5 font-serif text-[1.65rem] font-medium leading-[1.18] tracking-[-0.035em] text-[#071629]">
                        {activeItem.question}
                      </h3>

                      {/* Short accent rule — inherits subject colour */}
                      <div
                        className="mb-6 h-px w-8"
                        style={{ background: `${SUBJECT_COLORS[activeItem.subject].node}55` }}
                      />

                      {/* Explanation */}
                      <p className="mb-9 font-serif text-[14.5px] italic leading-[1.88] text-[#10233f]/80">
                        {activeItem.explanation}
                      </p>

                      {/* NSW Topic */}
                      <div
                        className="mb-6 border-t pt-5"
                        style={{ borderColor: `${SUBJECT_COLORS[activeItem.subject].node}18` }}
                      >
                        <p className="mb-1.5 text-[7px] font-black uppercase tracking-[0.36em] text-[#071629]/30">
                          NSW Science Topic
                        </p>
                        <p className="font-serif text-[13.5px] font-medium leading-[1.55] text-[#071629]/80">
                          {activeItem.nswTopic}
                        </p>
                      </div>

                      {/* At DA Tuition */}
                      <div
                        className="border-t pt-5"
                        style={{ borderColor: `${SUBJECT_COLORS[activeItem.subject].node}18` }}
                      >
                        <p className="mb-2 text-[7px] font-black uppercase tracking-[0.36em] text-[#071629]/30">
                          At DA Tuition
                        </p>
                        <p className="text-[13px] italic leading-[1.88] text-[#10233f]/60">
                          {activeItem.daConnection}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                </AnimatePresence>

                <p className="hidden lg:block mt-9 text-[8.5px] text-[#071629]/25">
                  Hover a question node to explore
                </p>
              </motion.div>

            </div>

            {/* ── (mobile layout now unified with desktop grid above) ── */}
            <div className="hidden">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]">
                For Curious Minds
              </p>
              <h2 className="mb-4 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.042em] text-[#071629]">
                Every scientist<br />starts by wondering.
              </h2>
              <p className="mb-8 text-sm leading-7 text-[#61708a]">
                Some questions sound silly. Some sound impossible. But the students who ask
                questions are often the ones who understand the most.
              </p>

              <p className="mb-4 text-[9px] font-black uppercase tracking-[0.32em] text-[#c9a227]/60">
                Science Lens
              </p>

              {/* Question selector buttons */}
              <div className="mb-6 flex flex-col gap-2">
                {WONDER_ITEMS.map((item) => {
                  const active = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200"
                      style={{
                        background: active ? `${SUBJECT_COLORS[item.subject].node}10` : 'transparent',
                        border: `1px solid ${active ? SUBJECT_COLORS[item.subject].node + '35' : '#07162912'}`,
                      }}
                    >
                      <div
                        className="shrink-0 rounded-full transition-all duration-200"
                        style={{
                          width: 8,
                          height: 8,
                          background: active
                            ? SUBJECT_COLORS[item.subject].node
                            : `${SUBJECT_COLORS[item.subject].node}55`,
                        }}
                      />
                      <span
                        className="font-serif text-sm italic leading-snug"
                        style={{ color: active ? '#071629' : '#61708a' }}
                      >
                        {item.question}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected question — bridge between curiosity and answer */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`bridge-${activeId}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="mb-5"
                >
                  <div className="mb-2.5 flex items-center gap-2">
                    <div className="h-px flex-1" style={{ background: `${SUBJECT_COLORS[activeItem.subject].node}28` }} />
                    <span
                      className="text-[8px] font-black uppercase tracking-[0.28em]"
                      style={{ color: SUBJECT_COLORS[activeItem.subject].text }}
                    >
                      {SUBJECT_ICONS[activeItem.subject]} {activeItem.subject}
                    </span>
                    <div className="h-px flex-1" style={{ background: `${SUBJECT_COLORS[activeItem.subject].node}28` }} />
                  </div>
                  <p className="text-center font-serif text-[1.05rem] italic leading-snug text-[#071629]">
                    {activeItem.question}
                  </p>
                  <div className="mt-3 flex justify-center">
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true">
                      <line x1="7" y1="0" x2="7" y2="14" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
                      <polyline points="3,9 7,14 11,9" fill="none" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
                    </svg>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Mobile Science Lens panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`m-${activeId}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_32px_rgba(7,22,41,0.07)]"
                >
                  <div style={{ height: 3, background: SUBJECT_COLORS[activeItem.subject].node }} />
                  <div className="p-6">
                    <div className="mb-5 h-[1.5px] w-8 bg-[#c9a227]/45" />
                    <p className="mb-6 font-serif text-sm italic leading-[1.78] text-[#10233f]">
                      {activeItem.explanation}
                    </p>
                    <div className="mb-4 border-t border-[#071629]/7 pt-4">
                      <p className="mb-1 text-[7.5px] font-black uppercase tracking-[0.3em] text-[#071629]/35">
                        NSW Science Topic
                      </p>
                      <p className="font-serif text-[13px] font-medium text-[#10233f]">
                        {activeItem.nswTopic}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#fff6e7] p-4">
                      <p className="mb-1.5 text-[7.5px] font-black uppercase tracking-[0.3em] text-[#c9a227]/70">
                        At DA Tuition
                      </p>
                      <p className="text-[12px] italic leading-[1.75] text-[#10233f]/75">
                        {activeItem.daConnection}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Closing quote ── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mx-auto mt-16 max-w-xl text-center"
            >
              <div className="mx-auto mb-6 h-px w-10 bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />
              <p className="font-serif text-xl font-medium italic leading-[1.6] tracking-[-0.02em] text-[#10233f] lg:text-2xl">
                Science is not a collection of facts.
              </p>
              <p className="mt-1 font-serif text-xl font-medium italic leading-[1.6] tracking-[-0.02em] text-[#61708a] lg:text-2xl">
                It is a way of understanding the world around us.
              </p>
            </motion.div>

          </div>
        </section>

        <SciencePrograms />

        {/* ── How DA Turns Understanding Into Results ── */}
        <DAMethodSection />

        {/* ── Learning format cards ── */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#071629]/10 bg-gradient-to-br from-[#f0fff4] to-[#dcfce7] p-8 shadow-lg shadow-[#071629]/5">
              <Atom className="mb-5 h-10 w-10 text-[#10233f]" />
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#10233f]">Small Group Tutoring</h2>
              <p className="mt-4 text-sm leading-7 text-[#61708a]">
                Our 3–5 student groups give your child focused attention in a structured environment. Students are matched to their subject and level so every session moves them forward.
              </p>
              <Link to="/learning-formats" className="mt-6 inline-flex items-center text-sm font-black text-[#10233f]">
                Compare formats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] border border-[#071629]/10 bg-gradient-to-br from-[#fffdf7] to-[#fff1cd] p-8 shadow-lg shadow-[#071629]/5">
              <Zap className="mb-5 h-10 w-10 text-[#10233f]" />
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#10233f]">HSC Science Classes</h2>
              <p className="mt-4 text-sm leading-7 text-[#61708a]">
                Subject-specific classes for Biology, Chemistry, and Physics. Structured around the syllabus with regular exam practice, past paper walkthroughs, and progress tracking.
              </p>
              <Link to="/hsc-excellence" className="mt-6 inline-flex items-center text-sm font-black text-[#10233f]">
                View HSC Program
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── What Students Struggle With ── */}
        <ScienceStruggleSection />

        <SubjectReviewCarousel subject="science" />

        {/* ── Final CTA ── */}
        <section className="bg-[#071629] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 shadow-2xl md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a]">Next step</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white">
                Find the right science starting point.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/66">
                Book an interview and we will help you work out whether your child needs foundational support, subject-specific coaching, or HSC exam preparation.
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

/* ── What Students Struggle With ──
   Numbering is generated automatically — do not add a 'num' field.
   Each entry must represent a genuinely distinct underlying difficulty.
   ── */
const STRUGGLES: { id: string; headline: string; why: string; how: string; improvement: string }[] = [
  {
    id: 'exam',
    headline: "I understand the lesson but can't answer exam questions.",
    why: "HSC exams test application, not recall. Students who study by re-reading notes build passive recognition — they feel like they understand the content but freeze when asked to structure a multi-step response under timed conditions. The gap between 'I get it' and 'I can write it under pressure' is wider than most students realise until they see their first exam result.",
    how: "DA's approach teaches exam literacy alongside content. Students practise breaking down question stems, identifying the verb (describe, explain, analyse, evaluate), and structuring responses to match marking criteria. Every session includes at least one exam-style problem. Over time, this becomes instinctive rather than effortful.",
    improvement: "Most students see a measurable improvement in structured response scores within 4–6 weeks. Band 4 students regularly progress to Band 5/6 once exam strategy becomes second nature — not because the content changed, but because the delivery did.",
  },
  {
    id: 'biology-memory',
    headline: "I keep forgetting Biology — there's just too much content.",
    why: "Biology has the highest content volume of any science. Students who try to memorise every term and process in isolation quickly hit a ceiling — the brain can only hold so many disconnected facts before they start to blur together. Biology becomes overwhelming when it's treated as a glossary to learn rather than a system to understand.",
    how: "DA teachers build Biology knowledge through connected stories rather than isolated definitions. Students learn how photosynthesis, cellular respiration, and the carbon cycle relate to one another before they drill individual terms. When concepts are networked, forgetting one node doesn't erase the whole picture — students can reason their way back.",
    improvement: "Students typically report that Biology starts to feel manageable within 3–4 weeks. By the time exams arrive, most can explain multi-step processes — the immune response, inheritance patterns, gene expression — without needing to check their notes mid-explanation.",
  },
  {
    id: 'physics-formulas',
    headline: "Physics formulas all look the same to me.",
    why: "Students who try to memorise formulas without understanding what they describe inevitably confuse them under pressure. F = ma and W = mg look almost identical. v² = u² + 2as and v = u + at share the same variables. When you don't know what each formula is modelling, you're effectively guessing.",
    how: "DA connects every equation to the physical situation it describes before students are asked to apply it. Rather than 'here is the formula,' teachers ask: 'what is actually happening here, and why does this equation capture it?' Once students can visualise the physics behind the algebra, formula selection becomes a reasoning process — not a memory test.",
    improvement: "Students who develop physical intuition alongside mathematical fluency typically stop second-guessing formula choice within a term. Multi-step mechanics and energy problems — the ones that cost the most marks — become reliably solvable.",
  },
  {
    id: 'calculations',
    headline: "I don't understand Chemistry calculations.",
    why: "Calculation problems fail at three points: setting up the problem incorrectly, choosing the wrong formula, or making unit errors under pressure. For Chemistry specifically, mole calculations feel abstract because students can't visualise what a mole actually represents. Stoichiometry errors almost always trace back to a conceptual gap — not a careless mistake.",
    how: "DA teaches a systematic three-step method: identify what is known and what is being asked, select the correct relationship (formula or mole ratio), then execute with careful unit tracking. For mole concepts specifically, teachers use concrete analogies — dozen thinking, scaled-up counting — until the abstraction clicks. Students practise this method until it's automatic, not just correct.",
    improvement: "Students who apply this method consistently typically recover 6–12 marks per paper within a term. Stoichiometry and equilibrium calculations tend to show the fastest improvement because once the setup process is reliable, execution becomes straightforward.",
  },
  {
    id: 'study-plan',
    headline: "I don't know what to study first.",
    why: "Without a structured plan, students default to re-reading notes or doing random practice questions — creating a feeling of busyness without genuine progress. This approach guarantees anxiety: the more they 'study,' the less certain they feel, because they can never tell whether they've done enough. The problem isn't work ethic — it's the absence of a map.",
    how: "Every DA student receives a personalised study roadmap aligned to their exam calendar. Sessions are sequenced to build skills progressively: foundational concepts first, then application, then exam-style practice. Students always know what they're working on, why it's the priority right now, and how it connects to what comes next.",
    improvement: "Students with a structured plan typically feel more confident within the first two weeks — not because they know more, but because they know where they are. By mid-term, most have shifted from reactive cramming to deliberate, purposeful preparation.",
  },
  {
    id: 'silly-mistakes',
    headline: "I make silly mistakes and lose easy marks.",
    why: "So-called 'silly' mistakes are rarely random. They cluster around specific habits: skipping unit conversions, misreading the question, not checking that the answer makes physical or biological sense, writing the working but omitting the unit in the final answer. These are process errors — and because students attribute them to carelessness rather than habit, they never get fixed.",
    how: "DA trains students to use a brief, consistent checking routine after every calculation or response: does the magnitude make sense? are units correct? have I answered what was actually asked? It sounds simple, but the habit has to be built deliberately. Students practise it in every session until it's reflexive, not something they remember to do only when they have spare time.",
    improvement: "Most students who adopt a checking routine recover 4–8 marks per paper within a term — marks that were always within reach. For borderline students, this alone can mean the difference between a Band 4 and a Band 5.",
  },
  {
    id: 'exam-anxiety',
    headline: "I panic during science exams.",
    why: "Exam anxiety in science usually has one of two root causes: either the student genuinely hasn't practised enough under time pressure, so the exam feels unfamiliar and threatening; or they have practised, but they lack a mental procedure for handling a question they can't immediately answer. The panic isn't irrational — it's a signal that a skill is missing.",
    how: "DA addresses both causes. Students sit timed practice exams regularly throughout the term, so the exam environment becomes routine rather than exceptional. They also learn an explicit 'stuck protocol' — what to do when you blank on a question: move on, collect the marks you can, and return with fresh eyes. Anxiety reduces dramatically when students have a plan for when things go wrong.",
    improvement: "After 6–8 weeks of timed practice and protocol training, most students describe their exam experience as feeling more controlled — even when questions are difficult. The panic doesn't disappear entirely, but it no longer derails the whole paper.",
  },
  {
    id: 'study-efficiency',
    headline: "I spend hours studying but my marks don't improve.",
    why: "Time spent is not the same as learning. Students who re-read, highlight, and copy out notes are engaging in passive processing — comfortable activities that feel productive but don't build retrievable knowledge. The uncomfortable truth is that effective study requires effort that passive study never demands: retrieval practice, problem-solving, self-testing. Most students avoid it because it feels harder and less reassuring.",
    how: "DA shifts students from passive to active study from the first session. Instead of reading about a concept, students have to explain it back, solve a problem that uses it, or identify where it appears in an exam question. This is less comfortable than re-reading — and substantially more effective. Students also learn to recognise when they're slipping into passive habits so they can self-correct.",
    improvement: "Most students see a mark improvement within one exam cycle once they shift to active study. The hours don't necessarily increase — but the return on each hour does, and students start to trust that their preparation is actually working.",
  },
  {
    id: 'long-response',
    headline: "I don't know how to answer long-response questions.",
    why: "Extended response questions in Science require a different skill set from short-answer: students must select relevant information, organise it into a coherent argument, and express it in scientific language that matches the marking guidelines. Most students attempt to 'write everything they know,' which produces long, unfocused answers that score poorly despite containing correct information.",
    how: "DA teaches a structured response framework: identify the command verb, plan the scope of the answer in 30 seconds, use a clear topic sentence, provide evidence from the syllabus, and close with a link to the question. Students practise this on real past-paper questions, with feedback on both scientific content and communication quality — because both are assessed.",
    improvement: "Students who learn to structure their extended responses typically see the most dramatic per-question mark improvement of any skill we teach. A well-organised 200-word response consistently outscores a rambling 400-word response on the same topic.",
  },
  {
    id: 'scientific-reasoning',
    headline: "I struggle to explain my scientific reasoning.",
    why: "Science teachers can often follow a student's thinking when they're talking through a problem, but on paper, the reasoning disappears — students write conclusions without justifications, or state facts without linking them to the question. Marking rubrics for Year 11–12 science explicitly reward the quality of reasoning, not just the accuracy of facts. Knowing the right answer isn't enough.",
    how: "DA explicitly teaches the 'claim–evidence–reasoning' structure for scientific communication. Students learn to state what they conclude, cite the evidence that supports it, and explain the mechanism that connects the two. This is practised in writing every session — not just in conversation — because the gap between verbal and written reasoning is where most marks are lost.",
    improvement: "Students who develop written scientific reasoning typically see consistent improvement across all question types, because reasoning is rewarded in everything from short-answer justifications to experiment design. It is the single most transferable skill in HSC Science.",
  },
  {
    id: 'year-change',
    headline: "Science became much harder this year.",
    why: "The step from Year 10 to Year 11 Science — and again from Year 11 to Year 12 — involves a qualitative shift in what is expected, not just more content. At Year 10, understanding is enough. At Year 11, students must apply understanding to unfamiliar problems. At Year 12, they must evaluate, argue, and synthesise. Students who thrived on memorisation often hit a wall precisely when the curriculum begins to reward deeper thinking.",
    how: "DA tutors identify exactly where a student's current skills sit relative to where the syllabus is heading. Rather than racing through content, sessions are calibrated to close specific gaps — usually in application and reasoning — before moving forward. Students who feel behind are rarely as far behind as they believe; they usually need a targeted intervention rather than a full restart.",
    improvement: "Most students who engage with DA at the start of a new year report that they feel back in control within 4–6 weeks. The jump in difficulty is real, but it is navigable — and students who understand what changed are far better positioned than those who simply try to study harder.",
  },
  {
    id: 'overwhelmed',
    headline: "There are too many things to memorise — I don't know what actually matters.",
    why: "Science syllabuses are dense, and students without guidance tend to treat every piece of content as equally important. They spend the same energy on peripheral detail as on core examinable concepts, then run out of time before the topics that attract the most marks have been properly understood. The problem is not the volume of content — it is the absence of triage.",
    how: "DA teachers know the NSW Science syllabuses in depth and can tell students exactly which outcomes are examined frequently, which carry the most marks, and which supporting details are worth knowing versus simply recognising. Students learn to prioritise their effort where it has the greatest return, which immediately reduces the feeling of overwhelm and focuses study time where it counts.",
    improvement: "Students who develop a clear sense of syllabus priority typically feel significantly less anxious about exams within a fortnight. Rather than feeling like they need to know everything perfectly, they can articulate exactly what they need to be confident in — and direct their energy accordingly.",
  },
];

const ScienceStruggleSection = () => {
  const [selectedId, setSelectedId] = useState(STRUGGLES[0].id);
  const selected = STRUGGLES.find(s => s.id === selectedId)!;

  return (
    <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <ScienceSectionHeader
          eyebrow="Understanding the Problem"
          title="What Science Students Usually Struggle With"
          text="Select the one that sounds most like your child. Every problem has a pattern — and a path forward."
        />

        {/* Split layout */}
        <div className="grid gap-6 lg:grid-cols-[2fr_3fr] lg:gap-10 lg:items-start">

          {/* ── Left: selectable cards ── */}
          <div className="flex flex-col gap-3">
            {STRUGGLES.map((s, i) => {
              const active = s.id === selectedId;
              const num = String(i + 1).padStart(2, '0');
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`group w-full rounded-3xl border p-5 text-left transition duration-200 ${
                    active
                      ? 'border-[#c9a227]/40 bg-white shadow-lg shadow-[#071629]/8'
                      : 'border-[#071629]/8 bg-white/60 hover:bg-white hover:shadow-md hover:shadow-[#071629]/5'
                  }`}
                  style={{ borderLeft: active ? '3px solid #c9a227' : undefined }}
                >
                  <div className="flex items-start gap-4">
                    <span className={`mt-0.5 shrink-0 font-serif text-sm font-medium transition ${active ? 'text-[#c9a227]' : 'text-[#071629]/25 group-hover:text-[#071629]/40'}`}>
                      {num}
                    </span>
                    <p className={`font-serif text-base italic leading-snug transition ${active ? 'text-[#071629]' : 'text-[#071629]/55 group-hover:text-[#071629]/75'}`}>
                      &ldquo;{s.headline}&rdquo;
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Right: detail panel ── */}
          <div className="lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.26, ease: 'easeOut' }}
                className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-2xl shadow-[#071629]/8"
              >
                {/* Gold top rule */}
                <div className="h-[3px] bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />

                <div className="p-8 md:p-10">
                  {/* Quote */}
                  <p className="mb-8 border-b border-[#071629]/8 pb-8 font-serif text-lg italic leading-relaxed tracking-[-0.01em] text-[#10233f]">
                    &ldquo;{selected.headline}&rdquo;
                  </p>

                  {/* Three insight blocks */}
                  <div className="space-y-7">
                    {[
                      { label: 'Why this happens',           labelClass: 'bg-amber-50 text-amber-700',   text: selected.why },
                      { label: 'How DA addresses it',        labelClass: 'bg-[#c9a227]/12 text-[#7a5e10]', text: selected.how },
                      { label: 'What students typically see', labelClass: 'bg-emerald-50 text-emerald-700', text: selected.improvement },
                    ].map((block) => (
                      <div key={block.label}>
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${block.labelClass}`}>
                          {block.label}
                        </span>
                        <p className="mt-3 text-sm leading-7 text-[#61708a]">{block.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-8 border-t border-[#071629]/8 pt-8">
                    <Link to="/book-interview">
                      <Button className="rounded-full bg-[#c9a227] px-6 font-black text-[#101521] shadow-lg shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                        Book an Interview
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

/* ── Science Success Carousel ── */
const ScienceSuccessCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1);
  const touchX                = useRef(0);

  const go = useCallback((next: number) => {
    const n = (next + SCIENCE_STORIES.length) % SCIENCE_STORIES.length;
    setDir(next > current || (current === SCIENCE_STORIES.length - 1 && next === 0) ? 1 : -1);
    setCurrent(n);
  }, [current]);

  const story = SCIENCE_STORIES[current];

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    centre: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Student Outcomes</p>
          <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
            Science Success Stories
          </h2>
          <div className="mx-auto mt-5 h-px w-12 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
        </div>

        {/* Card */}
        <div
          className="relative px-8 lg:px-10"
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const dx = touchX.current - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 40) go(dx > 0 ? current + 1 : current - 1);
          }}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="centre"
              exit="exit"
              transition={{ duration: 0.30, ease: [0.25, 0.8, 0.25, 1] }}
              className="rounded-[2rem] border border-[#071629]/10 bg-white shadow-2xl shadow-[#071629]/8 overflow-hidden"
            >
              {/* Gold top rule */}
              <div className="h-[3px] bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />

              <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-[auto_1fr] lg:gap-12">

                {/* Avatar */}
                <div className="flex flex-col items-center gap-3 lg:items-start">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#c9a227]/30 bg-gradient-to-br from-[#071629] to-[#1a3a6e] text-2xl font-serif font-medium text-[#f1df9a]">
                    {story.initials}
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="font-black tracking-[-0.02em] text-[#10233f]">{story.name}</p>
                    <p className="mt-0.5 text-xs font-black uppercase tracking-[0.12em] text-[#c9a227]">{story.subjects}</p>
                    <p className="mt-1 text-sm font-semibold text-[#61708a]">{story.result}</p>
                    <p className="mt-0.5 text-xs italic text-[#61708a]/80">{story.outcome}</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="flex items-center">
                  <blockquote className="border-l-2 border-[#c9a227]/40 pl-6 font-serif text-xl leading-relaxed tracking-[-0.02em] text-[#10233f] md:text-2xl">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            onClick={() => go(current - 1)}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 hidden h-11 w-11 items-center justify-center rounded-full border border-[#071629]/14 bg-white shadow-lg transition hover:border-[#c9a227]/50 hover:shadow-xl lg:flex"
          >
            <ChevronLeft className="h-5 w-5 text-[#10233f]" />
          </button>
          <button
            onClick={() => go(current + 1)}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden h-11 w-11 items-center justify-center rounded-full border border-[#071629]/14 bg-white shadow-lg transition hover:border-[#c9a227]/50 hover:shadow-xl lg:flex"
          >
            <ChevronRight className="h-5 w-5 text-[#10233f]" />
          </button>
        </div>

        {/* Mobile arrows + dots */}
        <div className="mt-6 flex items-center justify-between lg:justify-center lg:gap-8">
          <button onClick={() => go(current - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#071629]/14 bg-white shadow-sm transition hover:border-[#c9a227]/50 lg:hidden">
            <ChevronLeft className="h-4 w-4 text-[#10233f]" />
          </button>

          <div className="flex gap-2">
            {SCIENCE_STORIES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-[#c9a227]' : 'w-2 bg-[#071629]/18 hover:bg-[#071629]/35'}`}
              />
            ))}
          </div>

          <button onClick={() => go(current + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#071629]/14 bg-white shadow-sm transition hover:border-[#c9a227]/50 lg:hidden">
            <ChevronRight className="h-4 w-4 text-[#10233f]" />
          </button>
        </div>

        {/* View more link */}
        <div className="mt-10 text-center">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 text-sm font-black tracking-wide text-[#c9a227] transition hover:gap-3"
          >
            View More Success Stories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

const ScienceSectionHeader = ({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) => (
  <div className="mb-10 grid gap-6 lg:grid-cols-[.85fr_1fr] lg:items-end">
    <div>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">{eyebrow}</p>
      <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">{title}</h2>
    </div>
    <p className="max-w-2xl text-base leading-8 text-[#61708a]">{text}</p>
  </div>
);

export default Science;
