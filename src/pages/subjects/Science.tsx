import { useState, useRef, useCallback } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Atom,
  CheckCircle,
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
import { motion, AnimatePresence, useInView } from 'framer-motion';
import SEO from '@/components/SEO';

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


// ── HSC Subject editorial rows ───────────────────────────────────────────────
const HSC_SUBJECTS = [
  {
    n: '01',
    label: 'Biology',
    badge: 'Life Sciences',
    tagline: 'Understand life from cells to ecosystems.',
    color: '#16a34a',
    topics: ['Genetics & evolution', 'Human systems', 'Ecosystems', 'Scientific investigations'],
    cta: 'Explore Biology',
  },
  {
    n: '02',
    label: 'Chemistry',
    badge: 'Physical Sciences',
    tagline: 'Master reactions, calculations and molecular thinking.',
    color: '#c9a227',
    topics: ['Chemical reactions', 'Stoichiometry', 'Equilibrium', 'Organic chemistry'],
    cta: 'Explore Chemistry',
  },
  {
    n: '03',
    label: 'Physics',
    badge: 'Physical Sciences',
    tagline: 'Discover the principles that govern the universe.',
    color: '#2563eb',
    topics: ['Mechanics', 'Electricity & magnetism', 'Waves', 'Quantum physics'],
    cta: 'Explore Physics',
  },
] as const;

function HscSubjectRow({ s, index }: { s: typeof HSC_SUBJECTS[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="relative border-b border-[#071629]/10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover tint */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.28 }}
        style={{ background: `${s.color}0c` }}
      />
      {/* Left accent bar — grows from top */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: s.color, transformOrigin: 'top center' }}
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        initial={{ scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      />

      <Link to="/book-interview" className="relative block px-6 py-8 lg:px-8 lg:py-10">
        <div className="flex items-start gap-6 lg:gap-10">
          {/* Editorial number */}
          <span className="hidden shrink-0 pt-1 font-mono text-[10px] font-black tracking-[0.24em] text-[#071629]/20 lg:block w-7">
            {s.n}
          </span>

          <div className="min-w-0 flex-1">
            {/* Subject meta */}
            <p className="mb-3 text-[8px] font-black uppercase tracking-[0.34em] text-[#071629]/30">
              HSC Subject&ensp;·&ensp;{s.badge}
            </p>
            {/* Subject name */}
            <motion.h3
              className="font-serif text-2xl font-medium tracking-[-0.03em] lg:text-[1.75rem]"
              animate={{ color: hovered ? s.color : '#071629' }}
              transition={{ duration: 0.22 }}
            >
              HSC {s.label}
            </motion.h3>
            {/* Tagline */}
            <p className="mt-2 text-[13px] leading-[1.65] text-[#61708a]">{s.tagline}</p>
            {/* Topics — inline with dividers */}
            <div className="mt-4 flex flex-wrap items-center gap-y-1">
              {s.topics.map((topic, ti) => (
                <span key={topic} className="inline-flex items-center">
                  <span className="text-[11.5px] font-medium text-[#071629]/40">{topic}</span>
                  {ti < s.topics.length - 1 && (
                    <span className="mx-2.5 text-[#071629]/18 text-xs select-none">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* CTA — slides in on hover, desktop only */}
          <motion.div
            className="hidden shrink-0 items-center gap-1.5 pt-1 text-[9.5px] font-black uppercase tracking-[0.16em] lg:flex"
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            style={{ color: s.color }}
          >
            {s.cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] lg:hidden" style={{ color: s.color }}>
          {s.cta}
          <ArrowRight className="h-3 w-3" />
        </div>
      </Link>
    </motion.div>
  );
}

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

  const scrollToSubjects = () => {
    document.getElementById('science-pathways')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="Science Tutoring – Biology, Chemistry & Physics (Years 7–12)"
        description="From Year 7 Science to HSC Biology, Chemistry and Physics, DA Tuition builds genuine understanding and exam confidence."
        canonicalUrl="/subjects/science"
      />
      <NavigationNew />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/v3/collaborative_learning.jpg"
              alt="Science tutoring at DA Tuition"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-24 lg:grid-cols-[1.05fr_.75fr] lg:px-8 lg:pb-28">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <Atom className="h-4 w-4" />
                Science Tutoring · Years 7–12
              </div>
              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                When understanding grows,<br className="hidden sm:block" /> results follow.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                From Years 7–10 Science to HSC Biology, Chemistry and Physics, we help students build genuine understanding — not just memorise content.
              </p>

              {/* Subject pills */}
              <div className="mt-7 flex flex-wrap gap-2">
                {['Years 7–10 Science', 'Biology', 'Chemistry', 'Physics'].map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[#c9a227]/40 bg-[#c9a227]/10 px-4 py-1.5 text-xs font-bold tracking-wide text-[#f1df9a]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/book-interview">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                    Book Interview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToSubjects}
                  className="h-12 rounded-full border-white/30 bg-white/10 px-7 font-bold text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
                >
                  Explore Programs
                </Button>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
              className="self-end rounded-3xl border border-white/14 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-xl"
            >
              <p className="text-[8px] font-black uppercase tracking-[0.32em] text-[#f1df9a]/70">Does this sound familiar?</p>
              <div className="mt-5 space-y-2.5">
                {[
                  'Science makes sense in class, but exam questions feel completely different?',
                  'Spending hours memorising content but still losing marks?',
                  'Struggling with calculations in Physics or Chemistry?',
                  'Not sure how to structure extended responses for maximum marks?',
                  'Finding HSC Biology, Chemistry or Physics overwhelming?',
                  'Knowing the answer at home but blanking out in exams?',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-white/90">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#f1df9a]" />
                    <span className="text-[13px] leading-[1.6]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[12.5px] leading-[1.75] text-white/60">
                  Book an interview and we'll identify whether the issue is content knowledge, exam technique, response structure, calculations or confidence — then build a plan to address it.
                </p>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* ── Anchor nav ── */}
        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-3 rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10 md:grid-cols-4">
            {[
              ['Curious minds',    '#science-concerns'],
              ['Science programs',  '#science-pathways'],
              ['HSC focus areas',  '#hsc-sciences'],
              ['How we teach',     '#hsc-sciences'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-2xl px-4 py-3 text-center text-sm font-black text-[#10233f] transition hover:bg-[#f5ecd9]">
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* ── Every scientist starts by wondering ── */}
        <section id="science-concerns" className="bg-[#fff6e7]">
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

        {/* ── Science Programs ── */}
        <section id="science-pathways" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <ScienceSectionHeader
              eyebrow="Science Programs"
              title="From Year 7 Science foundations to specialised HSC subjects."
              text="Whether your child is building core scientific thinking in high school or preparing for HSC subject exams, DA has a structured program to match."
            />

            {/* ── Years 7–10 — primary editorial panel ── */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55 }}
              className="group relative overflow-hidden rounded-[2rem] border border-[#1d4ed8]/12 bg-gradient-to-br from-[#f0f7ff] to-[#dbeafe]"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Left: editorial content */}
                <div className="flex flex-1 flex-col p-8 lg:p-12">
                  <p className="mb-6 text-[8.5px] font-black uppercase tracking-[0.34em] text-[#1d4ed8]/60">
                    Foundation Program · Years 7–10
                  </p>

                  <h2 className="font-serif text-4xl font-medium tracking-[-0.045em] text-[#071629] lg:text-[3.25rem] lg:leading-[1.06]">
                    Junior Science
                  </h2>

                  <p className="mt-4 max-w-lg text-[14.5px] italic leading-[1.85] text-[#3d4f6a]">
                    Build strong foundations across Biology, Chemistry and Physics while developing scientific thinking, practical skills and exam confidence.
                  </p>

                  {/* Three subject lines — minimal, spaced */}
                  <div className="mt-8 space-y-3 border-t border-[#1d4ed8]/10 pt-8">
                    {[
                      { name: 'Biology', sub: 'Cells, ecosystems, living systems', color: '#16a34a' },
                      { name: 'Chemistry', sub: 'Particles, reactions, energy', color: '#c9a227' },
                      { name: 'Physics', sub: 'Forces, waves, energy transfer', color: '#2563eb' },
                    ].map(({ name, sub, color }) => (
                      <div key={name} className="flex items-center gap-4">
                        <span
                          className="shrink-0 h-1 w-4 rounded-full"
                          style={{ background: color }}
                        />
                        <span className="font-serif text-[15px] font-medium text-[#071629]">{name}</span>
                        <span className="text-[12px] text-[#61708a]">— {sub}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/book-interview"
                    className="mt-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#1d4ed8] transition"
                  >
                    Explore the program
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Right: typographic accent — desktop only */}
                <div className="hidden shrink-0 items-end justify-end p-12 pb-10 lg:flex">
                  <div className="text-right">
                    <p
                      className="font-serif font-medium leading-none tracking-[-0.05em] text-[#1d4ed8]/12"
                      style={{ fontSize: 'clamp(5rem, 10vw, 8rem)' }}
                    >
                      Yr<br />7–10
                    </p>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#1d4ed8]/30">
                      Foundation Science
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* ── HSC Subjects — editorial rows ── */}
            <div className="mt-14">
              <p className="mb-6 text-[8px] font-black uppercase tracking-[0.34em] text-[#071629]/30">
                HSC Subjects
              </p>
              <div className="border-t border-[#071629]/10">
                {HSC_SUBJECTS.map((s, i) => (
                  <HscSubjectRow key={s.label} s={s} index={i} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How DA Turns Understanding Into Results ── */}
        <section id="hsc-sciences" className="bg-[#071629] px-5 py-24 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">

            {/* Header */}
            <div className="mb-20 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">The DA Method</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
                Why DA Students Improve Faster
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/50">
                Understanding science is only the beginning. We teach students how to think,
                respond and improve so their knowledge translates into stronger results.
              </p>
              <div className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
            </div>

            {/* Four-step methodology */}
            <div className="relative">

              {/* Desktop flow line behind the cards */}
              <div
                className="absolute left-0 right-0 top-[54px] hidden h-px lg:block"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 4%, rgba(201,162,39,0.15) 20%, rgba(201,162,39,0.15) 80%, transparent 96%)',
                }}
              />

              <div className="grid gap-5 lg:grid-cols-4 lg:gap-4">
                {[
                  {
                    n: '01',
                    title: 'Decode the Question',
                    Icon: Microscope,
                    text: 'Before students answer, they learn how to identify exactly what the question is asking and where the marks come from.',
                  },
                  {
                    n: '02',
                    title: 'Build Real Understanding',
                    Icon: Atom,
                    text: 'Students connect ideas, fill gaps and understand the science behind the syllabus rather than memorising isolated facts.',
                  },
                  {
                    n: '03',
                    title: 'Practise With Purpose',
                    Icon: FlaskConical,
                    text: 'Students work through carefully selected questions that reveal weaknesses and strengthen exam technique.',
                  },
                  {
                    n: '04',
                    title: 'Refine Through Feedback',
                    Icon: TrendingUp,
                    text: 'Every mistake becomes a learning opportunity. Teachers provide targeted feedback so students continuously improve.',
                  },
                ].map((step, index) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, delay: index * 0.10 }}
                    className="group relative z-10 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-7 text-center transition duration-300 hover:border-[#c9a227]/25 hover:bg-white/[0.07]"
                  >
                    {/* Gold top accent — brightens on hover */}
                    <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#c9a227]/35 to-transparent transition duration-500 group-hover:via-[#c9a227]/75" />

                    {/* Step number — small, editorial */}
                    <p className="mb-5 font-serif text-[11px] tracking-[0.22em] text-[#c9a227]/45 transition duration-300 group-hover:text-[#c9a227]/80">
                      {step.n}
                    </p>

                    {/* Icon in a refined circle */}
                    <div className="mb-5 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a227]/20 bg-[#c9a227]/[0.06] transition duration-300 group-hover:border-[#c9a227]/45 group-hover:bg-[#c9a227]/[0.13]">
                        <step.Icon
                          strokeWidth={1.4}
                          className="h-5 w-5 text-[#c9a227]/55 transition duration-300 group-hover:text-[#c9a227]"
                        />
                      </div>
                    </div>

                    {/* Step title */}
                    <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.26em] text-white/65 transition duration-300 group-hover:text-[#f1df9a]">
                      {step.title}
                    </p>

                    {/* Thin gold rule */}
                    <div className="mx-auto mb-5 h-px w-7 bg-[#c9a227]/20 transition duration-300 group-hover:bg-[#c9a227]/55" />

                    {/* Body */}
                    <p className="text-[13px] leading-[1.85] text-white/42 transition duration-300 group-hover:text-white/70">
                      {step.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Bottom context note */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 text-center text-[11px] leading-6 text-white/28"
              >
                Results improve when students understand both the science and the assessment. DA teaches both.
              </motion.p>
            </div>

          </div>
        </section>

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

        {/* ── Science Success Stories ── */}
        <ScienceSuccessCarousel />

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

/* ── What Students Struggle With ── */
const STRUGGLES = [
  {
    id: 'exam',
    num: '01',
    headline: 'I understand the theory but can\'t answer exam questions.',
    why: 'HSC exams test application, not recall. Students who study by re-reading notes build passive recognition — they feel like they understand the content but freeze when asked to structure a multi-step response under timed conditions.',
    how: 'DA\'s approach teaches exam literacy alongside content. Students practise breaking down question stems, identifying what markers are looking for, and structuring responses to match marking criteria. Every session includes at least one exam-style problem.',
    improvement: 'Most students see a measurable improvement in structured response scores within 4–6 weeks. Band 4 students regularly progress to Band 5/6 once exam strategy becomes second nature.',
  },
  {
    id: 'memory',
    num: '02',
    headline: 'I memorise everything but forget it during tests.',
    why: 'Memorisation without understanding creates fragile knowledge. Under exam stress, isolated facts are the first things the brain loses access to — especially when a question is phrased differently from what was practised.',
    how: 'DA teachers focus on conceptual anchors — the underlying "why" behind each idea. When students understand how concepts connect, they can reconstruct knowledge under pressure rather than retrieve exact memorised phrases.',
    improvement: 'Students typically report that content starts to "stick" within 3–4 weeks. By the trial exam period, most can explain complex topics in their own words without notes.',
  },
  {
    id: 'calc',
    num: '03',
    headline: 'I struggle with calculations in Physics and Chemistry.',
    why: 'Calculation problems fail at three points: setting up the problem incorrectly, choosing the wrong formula, or making unit errors under pressure. Most students skip the setup step and jump straight to numbers.',
    how: 'DA teaches a systematic three-step method: identify what you\'re being asked, select the correct equation, then execute with careful unit tracking. Students practise this until it becomes automatic — not just correct, but fast.',
    improvement: 'Students who apply this method consistently typically recover 6–12 marks per paper within a term. Mechanics and Stoichiometry tend to show the fastest improvement.',
  },
  {
    id: 'start',
    num: '04',
    headline: 'I don\'t know where to start studying.',
    why: 'Without a structured plan, students default to re-reading notes or doing random practice questions — creating a feeling of busyness without genuine progress, and leading to last-minute panic as exams approach.',
    how: 'Every DA student receives a personalised study roadmap aligned to their exam calendar. Sessions are sequenced to build skills progressively, with clear milestones so students always know what they\'re working toward and why.',
    improvement: 'Students with a structured plan typically feel more confident within the first two weeks. By mid-term, most have shifted from reactive cramming to proactive, deliberate preparation.',
  },
];

const ScienceStruggleSection = () => {
  const [selectedId, setSelectedId] = useState('exam');
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
            {STRUGGLES.map((s) => {
              const active = s.id === selectedId;
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
                      {s.num}
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
