import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import { Button } from '@/components/ui/button';
import SubjectHero from '@/components/subjects/SubjectHero';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, GraduationCap, Star } from 'lucide-react';

/* ============================================================================
   CONTENT — every field below is preserved verbatim from the previous build
   of this page. Nothing has been shortened, summarised or removed; only the
   presentation has changed. New copy (the Year 7-10 journey stages and the
   "Find Your Voice" moment) is additive and clearly separated below.
============================================================================ */

// Year 7-10 colour system, used subtly throughout (marker strokes, numerals,
// underlines, small washes) rather than as full-bleed colour blocks.
const YEARS = [
  {
    n: '07', year: 'Year 7', word: 'Explore.', color: '#2563EB', wash: 'rgba(37,99,235,0.10)',
    text: 'Everything is new: new subjects, new teachers, new expectations. We help students settle in fast, build steady habits, and start high school with confidence instead of catch-up.',
    Sketch: SketchPlane,
  },
  {
    n: '08', year: 'Year 8', word: 'Question.', color: '#5B8266', wash: 'rgba(91,130,102,0.12)',
    text: 'Content gets more abstract and students start asking why, not just how. We build the algebra, essay and reasoning foundations that make Years 9 and 10 easier.',
    Sketch: SketchMagnifier,
  },
  {
    n: '09', year: 'Year 9', word: 'Discover.', color: '#8574C4', wash: 'rgba(133,116,196,0.12)',
    text: 'Strengths and interests start to surface, and subject-selection decisions loom. We help students discover what they are genuinely good at, so those choices feel informed, not guessed.',
    Sketch: SketchStar,
  },
  {
    n: '10', year: 'Year 10', word: 'Direction.', color: '#D97D3D', wash: 'rgba(217,125,61,0.13)',
    text: 'Every session now points toward Year 11. We close gaps, sharpen exam technique, and build the study habits that carry straight into the HSC with confidence.',
    Sketch: SketchTarget,
  },
] as const;

const focusRows = [
  { area: 'English and Essay Writing', build: 'Analytical writing, close reading, text response', skills: 'Thesis construction, evidence integration, language techniques', Icon: SketchPen },
  { area: 'Mathematics', build: 'Algebra, geometry, statistics, calculus foundations', skills: 'Problem-solving, working mathematically, exam technique', Icon: SketchGraph },
  { area: 'Sciences', build: 'Physics, Chemistry, Biology concepts and inquiry skills', skills: 'Scientific reasoning, data analysis, extended response writing', Icon: SketchFlask },
  { area: 'HSIE / Humanities', build: 'Geography, History, critical thinking, source analysis', skills: 'Argument structure, perspective taking, extended response', Icon: SketchGlobe },
  { area: 'Exam and Study Skills', build: 'Organisation, note-taking, revision strategies', skills: 'Time management, past-paper practice, reducing exam anxiety', Icon: SketchClock },
];

const stakesCards = [
  { title: 'The Curriculum Gets Serious', color: '#2563EB', text: 'Year 7 introduces abstract concepts: algebra, essay writing, scientific reasoning. These compound year on year. Students who build strong foundations early keep more options open all the way to the HSC.' },
  { title: 'Habits Form Now or Not at All', color: '#5B8266', text: 'The study habits a student develops in Years 7-8 determine how they handle the pressure of Years 11-12. We teach method, not just content.' },
  { title: 'Selective and Scholarship Pressure', color: '#8574C4', text: 'Many families are managing Year 9-10 class selection or scholarship applications at the same time. Our tutors know what selective and private schools are looking for.' },
  { title: 'Confidence Decides Outcomes', color: '#D97D3D', text: 'A teenager who believes they can do hard things will attempt hard things. We build that belief deliberately, through visible progress every session.' },
];

const approachCards = [
  { title: 'We Diagnose Before We Teach', text: "We identify exactly where each student's gaps are and why. Then we fix the root cause, not just the symptom.", color: '#2563EB' },
  { title: 'Small Groups, Expert Attention', text: 'High school groups are capped at 5 students. Every student gets individual feedback every session, not just group instruction.', color: '#5B8266' },
  { title: 'Past Papers and Exam Technique', text: 'From Year 8 onwards we integrate past paper practice, marking criteria, and time-pressure drills so students know exactly how to perform on test day.', color: '#8574C4' },
  { title: 'Parent Visibility at Every Step', text: 'You receive a written progress update every term. You will never wonder whether the lessons are working.', color: '#D97D3D' },
];

const fitItems = [
  'Your child is finding the jump from primary to high school harder than expected',
  'Marks are inconsistent: strong in class, weaker in exams',
  'Your teenager lacks confidence in one or more subjects',
  'You want selective school or scholarship preparation built into the program',
  'Your child needs better study habits before Year 11 hits',
  'You want written progress updates, not just anecdotal feedback',
];

const testimonials = [
  { text: 'My son started Year 9 <strong>two years behind in maths</strong>. After two terms with DA Tuition he passed his half-yearly with a B, something I genuinely did not think was possible. The progress updates kept us in the loop the whole way through.', name: 'Mum of a Year 9 student', initials: 'M' },
  { text: 'She used to dread English assignments and put them off until the last minute. Now she <strong>brings her drafts in early</strong> just to get feedback before they\'re due.', name: 'Mum of a Year 8 student', initials: 'J' },
  { text: 'We needed something more structured than homework help. The <strong>weekly written updates</strong> told us exactly what was working and what to focus on next.', name: 'Dad of a Year 10 student', initials: 'D' },
  { text: 'His marks were all over the place before DA Tuition. Within a term he was <strong>consistently scoring in the top band</strong> on every test, and he actually believes he can do it now.', name: 'Mum of a Year 7 student', initials: 'P' },
];

const premiumEase = [0.22, 1, 0.36, 1] as const;

/* ============================================================================
   SMALL SKETCH ICONS — thin, sophisticated line drawings. No filled shapes,
   no gradients, no shadows. These stand in for the "academic sketches" from
   the reference without needing new image assets.
============================================================================ */

function SketchPlane({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 22 L34 8 L22 36 L18 24 L4 22 Z" />
      <path d="M18 24 L34 8" />
    </svg>
  );
}
function SketchMagnifier({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="17" cy="17" r="11" />
      <path d="M25.5 25.5 L35 35" />
    </svg>
  );
}
function SketchStar({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 4 L24 16 L36 16 L26 23 L30 35 L20 27 L10 35 L14 23 L4 16 L16 16 Z" />
    </svg>
  );
}
function SketchTarget({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="15" />
      <circle cx="20" cy="20" r="9" />
      <circle cx="20" cy="20" r="2.4" fill={color} stroke="none" />
    </svg>
  );
}
function SketchPen({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8 32 L11 24 L26 9 A3 3 0 0 1 30 13 L15 28 Z" />
      <path d="M8 32 L6.5 34.5" />
      <path d="M11.5 33 Q 18 34 22 30" opacity=".5" />
    </svg>
  );
}
function SketchGraph({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 34 L6 8" />
      <path d="M6 34 L34 34" />
      <path d="M9 27 L16 20 L22 25 L32 12" />
    </svg>
  );
}
function SketchFlask({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 6 L16 16 L7 32 A3 3 0 0 0 10 36 L30 36 A3 3 0 0 0 33 32 L24 16 L24 6" />
      <path d="M14 6 L26 6" />
      <path d="M11.5 27 L28.5 27" opacity=".5" />
    </svg>
  );
}
function SketchGlobe({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="15" />
      <ellipse cx="20" cy="20" rx="6" ry="15" />
      <path d="M5 20 L35 20" />
      <path d="M7.5 12 L32.5 12" opacity=".6" />
      <path d="M7.5 28 L32.5 28" opacity=".6" />
    </svg>
  );
}
function SketchClock({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="15" />
      <path d="M20 12 L20 20 L26 24" />
    </svg>
  );
}
function SketchArrowRight({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 10 Q 24 2 44 10" />
      <path d="M36 4 L45 10 L37 15" />
    </svg>
  );
}

// A rough, hand-drawn "marker" stroke used behind photos/words. Two
// overlapping wavy paths give it a slightly imperfect, non-vector feel.
function MarkerStroke({ color, className = '', opacity = 0.4 }: { color: string; className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 220 60" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M4 34 Q 40 14, 80 30 T 160 26 T 216 30" stroke={color} strokeWidth="24" strokeLinecap="round" fill="none" opacity={opacity} />
    </svg>
  );
}
// A short marker underline for emphasised words.
function MarkerUnderline({ color, className = '', delay = 0 }: { color: string; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <svg viewBox="0 0 160 16" preserveAspectRatio="none" className={className} aria-hidden="true">
      <motion.path
        d="M3 9 Q 40 3 80 8 T 157 7"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        initial={reduceMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, delay, ease: premiumEase }}
      />
    </svg>
  );
}

function HandNote({ children, color = '#0A1B34', className = '', rotate = -2 }: { children: React.ReactNode; color?: string; className?: string; rotate?: number }) {
  const style = { color, '--hs-rotate': `${rotate}deg` } as React.CSSProperties;
  return (
    <span className={`hs-hand ${className}`} style={style}>
      {children}
    </span>
  );
}

/* ============================================================================
   TOP BAR — breadcrumb, Y7-10 / HSC program tabs, urgency strip.
   Functionally identical to the previous build.
============================================================================ */

function TopBar() {
  return (
    <div className="relative z-20 bg-[#FBF6EA] px-5 pt-28 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-7xl pb-3 text-sm text-[#61708a]">
        <Link to="/" className="font-semibold text-[#071629] hover:underline">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/#programs" className="font-semibold text-[#071629] hover:underline">Programs</Link>
        <span className="mx-2">›</span>
        High School
      </div>
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto border-t border-[#0A1B34]/10">
        <Link to="/programs/high-school" className="whitespace-nowrap border-b-2 border-[#D4AF37] px-4 py-3 text-sm font-bold text-[#071629] sm:px-5">
          High School (Y7-10)
        </Link>
        <Link to="/hsc-excellence" className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm font-bold text-[#61708a] hover:text-[#071629] sm:px-5">
          HSC Excellence (Y11-12)
        </Link>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 border-t border-[#0A1B34]/10 py-4">
        {[
          { text: 'Limited Places This Term', highlight: 'Filling Fast' },
          { text: 'Years 7-10 Programs', highlight: null },
          { text: 'Selective School Preparation', highlight: null },
          { text: 'HSC Ready from Year 7', highlight: null },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2.5 text-xs font-bold text-[#071629] sm:text-sm">
            {item.text}
            {item.highlight && <span className="whitespace-nowrap rounded-full bg-[#071629] px-3 py-1 text-[10px] font-black text-white sm:text-xs">{item.highlight}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   HERO
============================================================================ */

function Hero() {
  const reduceMotion = useReducedMotion();
  const entrance = (delay: number, y = 22) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.8, delay, ease: premiumEase },
  });

  return (
    <section className="hs-hero relative overflow-hidden bg-[#FBF6EA] px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-16">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ── Copy ── */}
        <div className="relative z-10">
          <motion.p {...entrance(0)} className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#B98A22]">
            High School Tuition · Years 7-10
          </motion.p>

          <h1 className="hs-hero-h1">
            <motion.span {...entrance(0.08)} className="block text-[#0A1B34]">Find Your</motion.span>
            <motion.span {...entrance(0.16)} className="hs-hero-h1__voice block">Voice.</motion.span>
            <motion.span {...entrance(0.24)} className="block text-[#0A1B34]">Find Your</motion.span>
            <motion.span {...entrance(0.32)} className="hs-hero-h1__direction block">Direction.</motion.span>
          </h1>

          <motion.p {...entrance(0.42)} className="mt-7 max-w-lg font-serif text-xl italic leading-snug text-[#0A1B34]/80">
            The years that shape everything.
          </motion.p>

          <motion.p {...entrance(0.5)} className="mt-4 max-w-lg text-base leading-8 text-[#4b5768]">
            Years 7-10 are where academic trajectories lock in. Our small-group tutoring builds the skills, habits, and confidence your child needs to perform well in senior school and beyond.
          </motion.p>

          <motion.div {...entrance(0.58)} className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link to="/book-interview">
              <Button size="lg" className="h-12 rounded-full bg-[#D4AF37] px-7 font-black text-[#0A1B34] shadow-lg shadow-[#D4AF37]/25 hover:bg-[#E0BD4B]">
                Book a Free Trial Lesson
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#programs">
              <Button size="lg" variant="outline" className="h-12 rounded-full border-[#0A1B34]/25 bg-transparent px-7 font-bold text-[#0A1B34] hover:bg-[#0A1B34]/5">
                See Our Programs
              </Button>
            </a>
          </motion.div>

          <motion.div {...entrance(0.66)} className="mt-8 inline-flex items-start gap-3 border-l-2 border-[#D4AF37] pl-4">
            <div>
              <p className="text-sm font-bold text-[#0A1B34]">Selective School and HSC Preparation</p>
              <p className="text-xs text-[#61708a]">Built into every session from Year 7</p>
            </div>
          </motion.div>
        </div>

        {/* ── Photo + iPad visual ── */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.2, ease: premiumEase }}
            className="hs-hero-photo relative mx-auto w-[78%] sm:w-[68%] lg:w-[74%]"
          >
            <MarkerStroke color="#2563EB" className="absolute -left-10 top-10 h-16 w-40 -rotate-6 opacity-70" opacity={0.5} />
            <MarkerStroke color="#D97D3D" className="absolute -right-6 bottom-12 h-14 w-36 rotate-3 opacity-70" opacity={0.5} />
            <div className="hs-hero-photo__frame">
              <img src="/highschool-girl.png" alt="A DA Tuition high school student focused on her written work" className="h-full w-full object-cover" />
            </div>
            <HandNote color="#5B8266" rotate={-4} className="absolute -left-4 -top-8 hidden text-lg sm:block lg:-left-10">
              the questions get<br />better from here.
            </HandNote>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.5, ease: premiumEase }}
            className="hs-ipad"
            aria-hidden="true"
          >
            <div className="hs-ipad__cam" />
            <div className="hs-ipad__screen">
              <p className="hs-ipad__title">Today&rsquo;s Plan</p>
              <ul className="hs-ipad__list">
                <li><Check /> Be curious</li>
                <li><Check /> Ask questions</li>
                <li><Check /> Try new things</li>
                <li><Check /> Challenge myself</li>
                <li><Check /> Find my direction</li>
              </ul>
              <div className="hs-ipad__venn">
                <span className="hs-ipad__circle hs-ipad__circle--a">Interests</span>
                <span className="hs-ipad__circle hs-ipad__circle--b">Strengths</span>
                <span className="hs-ipad__circle hs-ipad__circle--c">Values</span>
              </div>
              <p className="hs-ipad__result">→ My Direction</p>
            </div>
            <div className="hs-ipad__pencil" />
          </motion.div>

          <HandNote color="#8574C4" rotate={2} className="absolute -bottom-6 right-0 hidden text-base sm:block lg:right-4">
            every step shapes what&rsquo;s next.
          </HandNote>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   YEAR 7-10 JOURNEY — the signature scroll animation. One coloured line
   travels through Explore → Question → Discover → Direction → What's Next,
   changing colour as it goes. Light and spacious, per the page rhythm.
============================================================================ */

function YearJourney() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 45%'] });

  const seg1 = useTransform(scrollYProgress, [0.04, 0.28], [0, 1]);
  const seg2 = useTransform(scrollYProgress, [0.27, 0.51], [0, 1]);
  const seg3 = useTransform(scrollYProgress, [0.5, 0.74], [0, 1]);
  const seg4 = useTransform(scrollYProgress, [0.73, 0.93], [0, 1]);
  const arrowOpacity = useTransform(scrollYProgress, [0.85, 0.97], [0, 1]);

  const pl1 = reduceMotion ? 1 : seg1;
  const pl2 = reduceMotion ? 1 : seg2;
  const pl3 = reduceMotion ? 1 : seg3;
  const pl4 = reduceMotion ? 1 : seg4;
  const arrowOp = reduceMotion ? 1 : arrowOpacity;

  const activation = { once: false, margin: '-42% 0px -42% 0px' } as const;

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#FFFDF8] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center lg:mb-20">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#B98A22]">Years 7-10</p>
          <h2 className="hs-h2">
            The Four Years That<br className="hidden sm:block" /> Change <span className="hs-underline-wrap">Everything<MarkerUnderline color="#8574C4" className="hs-underline hs-underline--wide" /></span>
          </h2>
        </div>

        {/* Desktop / tablet: horizontal line */}
        <div className="relative hidden lg:block">
          <svg viewBox="0 0 1220 170" fill="none" className="absolute inset-x-0 top-[38px] h-[110px] w-full" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M70 92 C 150 40, 220 140, 330 88" stroke={YEARS[0].color} strokeWidth="3" strokeLinecap="round" fill="none" style={{ pathLength: pl1 }} />
            <motion.path d="M330 88 C 420 42, 500 132, 605 84" stroke={YEARS[1].color} strokeWidth="3" strokeLinecap="round" fill="none" style={{ pathLength: pl2 }} />
            <motion.path d="M605 84 C 690 40, 770 130, 880 86" stroke={YEARS[2].color} strokeWidth="3" strokeLinecap="round" fill="none" style={{ pathLength: pl3 }} />
            <motion.path d="M880 86 C 950 46, 1010 60, 1080 60" stroke={YEARS[3].color} strokeWidth="3" strokeLinecap="round" fill="none" style={{ pathLength: pl4 }} />
            <motion.path d="M1075 52 L 1100 60 L 1074 70" stroke={YEARS[3].color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: arrowOp }} />
          </svg>

          <div className="relative grid grid-cols-4 gap-6 pt-2">
            {YEARS.map((y) => (
              <motion.div
                key={y.n}
                initial={reduceMotion ? false : { opacity: 0.4 }}
                whileInView={{ opacity: 1 }}
                viewport={activation}
                transition={{ duration: 0.5, ease: premiumEase }}
                className="hs-year-stage"
              >
                <motion.span
                  aria-hidden="true"
                  className="hs-year-wash"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={activation}
                  transition={{ duration: 0.6, ease: premiumEase }}
                  style={{ background: y.wash }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="hs-year-num" style={{ color: y.color }}>{y.n}</span>
                    <y.Sketch className="h-6 w-6" color={y.color} />
                  </div>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#61708a]">{y.year}</p>
                  <p className="hs-h3 mt-1" style={{ color: y.color }}>{y.word}</p>
                  <p className="mt-3 text-sm leading-7 text-[#4b5768]">{y.text}</p>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.8 }}
              transition={{ duration: 0.5, ease: premiumEase }}
              className="absolute -right-3 top-[6px] text-right"
            >
              <p className="whitespace-nowrap font-serif text-lg italic text-[#0A1B34]/70">What&rsquo;s<br />Next?</p>
            </motion.div>
          </div>
        </div>

        {/* Mobile / small tablet: vertical line */}
        <div className="relative lg:hidden">
          <svg viewBox="0 0 40 900" fill="none" className="absolute left-[18px] top-0 h-full w-10" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M20 40 C 40 90, 0 150, 20 220" stroke={YEARS[0].color} strokeWidth="3" strokeLinecap="round" fill="none" style={{ pathLength: pl1 }} />
            <motion.path d="M20 220 C 40 270, 0 330, 20 400" stroke={YEARS[1].color} strokeWidth="3" strokeLinecap="round" fill="none" style={{ pathLength: pl2 }} />
            <motion.path d="M20 400 C 40 450, 0 510, 20 580" stroke={YEARS[2].color} strokeWidth="3" strokeLinecap="round" fill="none" style={{ pathLength: pl3 }} />
            <motion.path d="M20 580 C 40 630, 0 670, 20 720" stroke={YEARS[3].color} strokeWidth="3" strokeLinecap="round" fill="none" style={{ pathLength: pl4 }} />
            <motion.path d="M12 712 L 20 736 L 28 712" stroke={YEARS[3].color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: arrowOp }} />
          </svg>
          <div className="flex flex-col gap-14 pl-14">
            {YEARS.map((y) => (
              <motion.div
                key={y.n}
                initial={reduceMotion ? false : { opacity: 0.4 }}
                whileInView={{ opacity: 1 }}
                viewport={activation}
                transition={{ duration: 0.5, ease: premiumEase }}
                className="hs-year-stage"
              >
                <motion.span
                  aria-hidden="true"
                  className="hs-year-wash"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={activation}
                  transition={{ duration: 0.6, ease: premiumEase }}
                  style={{ background: y.wash }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="hs-year-num" style={{ color: y.color }}>{y.n}</span>
                    <y.Sketch className="h-6 w-6" color={y.color} />
                  </div>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#61708a]">{y.year}</p>
                  <p className="hs-h3 mt-1" style={{ color: y.color }}>{y.word}</p>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-[#4b5768]">{y.text}</p>
                </div>
              </motion.div>
            ))}
            <p className="pl-1 font-serif text-lg italic text-[#0A1B34]/70">What&rsquo;s next?</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   WHAT MAKES YEARS 7-10 SO IMPORTANT — all four original items and their
   full explanatory paragraphs, kept intact. Sticky heading on desktop with
   01-04 activating as they cross the centre of the viewport.
============================================================================ */

function WhyItMatters() {
  const reduceMotion = useReducedMotion();
  const activation = { once: false, margin: '-45% 0px -45% 0px' } as const;

  return (
    <section id="programs" className="bg-[#FBF6EA] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#B98A22]">Why This Stage Is Critical</p>
          <h2 className="hs-h2">What Makes Years 7-10<br />So Important</h2>
          <p className="mt-5 max-w-md text-base leading-8 text-[#4b5768]">
            The move from primary to secondary school is the most significant academic shift a child faces. Here is what is at stake.
          </p>
        </div>

        <div className="mt-14 lg:mt-0">
          {stakesCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={reduceMotion ? false : { opacity: 0.35, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={activation}
              transition={{ duration: 0.5, ease: premiumEase }}
              className="hs-stakes-item"
            >
              <span className="hs-stakes-num" style={{ color: card.color }}>0{i + 1}</span>
              <div className="min-w-0">
                <h3 className="hs-h3-sm relative inline-block text-[#0A1B34]">
                  {card.title}
                  <MarkerUnderline color={card.color} className="hs-underline hs-underline--tight" delay={0.1} />
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-[#4b5768]">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   EXPERT INSTRUCTION — "Your Teacher Beside You, Every Step". Photo bleeds
   into the canvas rather than sitting in a bordered split card.
============================================================================ */

function TeacherBeside() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#FFFDF8] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: premiumEase }}
          className="relative order-2 lg:order-1"
        >
          <MarkerStroke color="#2563EB" className="absolute -left-8 -top-6 h-20 w-52 -rotate-3" opacity={0.4} />
          <div className="hs-bleed-photo hs-bleed-photo--teacher">
            <img src="/images/programs/highschool-tutor-laugh.jpg" alt="A DA Tuition tutor warmly explaining algebra to a high school student at the whiteboard" className="h-full w-full object-cover" />
          </div>
          <HandNote color="#0A1B34" rotate={-3} className="absolute -bottom-7 left-6 hidden text-lg sm:block">
            right beside you.
          </HandNote>
        </motion.div>

        <div className="order-1 lg:order-2">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#B98A22]">Expert Instruction</p>
          <h2 className="hs-h2">Your Teacher Beside You,<br />Every Step</h2>
          <p className="mt-6 max-w-md text-base leading-8 text-[#4b5768]">
            At DA Tuition, high school students don&rsquo;t just receive instruction. They get an experienced tutor working beside them, identifying exactly where they&rsquo;re losing marks and showing them how to fix it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CURRICULUM — "More Than Subjects." All five focus areas and their full
   "What We Build" / "Key Skills Developed" content, as an interactive index
   instead of a table.
============================================================================ */

function Curriculum() {
  const [active, setActive] = useState(0);
  const row = focusRows[active];
  const Icon = row.Icon;

  return (
    <section className="bg-[#FBF6EA] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#B98A22]">Curriculum Coverage</p>
          <h2 className="hs-h2">More Than<br />Subjects.</h2>
          <p className="mt-6 text-base leading-8 text-[#4b5768]">
            Year 7-10 curriculum focus areas, aligned to the NSW syllabus and structured to build on what your child already knows.
          </p>
        </div>

        <div role="tablist" aria-label="Curriculum focus areas" className="hs-subject-index">
          {focusRows.map((r, i) => (
            <button
              key={r.area}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`hs-subject-index__item ${active === i ? 'is-active' : ''}`}
            >
              <r.Icon className="h-5 w-5 shrink-0" />
              <span>{r.area}</span>
            </button>
          ))}
        </div>

        <div className="relative mt-4 min-h-[220px] border-t border-[#0A1B34]/10 pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={row.area}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: premiumEase }}
              className="grid gap-10 sm:grid-cols-[auto_1fr_1fr] sm:items-start"
            >
              <Icon className="hidden h-16 w-16 shrink-0 text-[#B98A22] sm:block" />
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#61708a]">What We Build</p>
                <p className="text-[15px] leading-[1.75] text-[#0A1B34]">{row.build}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#61708a]">Key Skills Developed</p>
                <p className="text-[15px] leading-[1.75] text-[#0A1B34]">{row.skills}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-14 text-center sm:text-left">
          <Link to="/subjects" className="inline-flex items-center gap-2 border-b border-[#0A1B34]/40 pb-1 text-sm font-bold text-[#0A1B34] hover:border-[#0A1B34]">
            Explore All Subjects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   FIND YOUR VOICE — the signature dark moment. Words are the visual: a
   scroll-driven sequence from self-doubt to "This is what I think."
============================================================================ */

function FindYourVoice() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const useFadeRange = (a: number, b: number, c: number, d: number) => useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
  const useRiseInRange = (a: number, b: number) => useTransform(p, [a, b], [0, 1]);

  const o1 = useFadeRange(0.03, 0.07, 0.13, 0.17);
  const o2 = useFadeRange(0.11, 0.15, 0.21, 0.25);
  const o3 = useFadeRange(0.19, 0.23, 0.29, 0.33);
  const o4 = useFadeRange(0.27, 0.31, 0.38, 0.43);

  const o5 = useFadeRange(0.48, 0.53, 0.58, 0.62);
  const o6 = useFadeRange(0.58, 0.63, 0.68, 0.72);
  const oFinal = useRiseInRange(0.72, 0.79);
  const underline = useRiseInRange(0.8, 0.9);
  const oSupport = useRiseInRange(0.9, 0.98);

  if (reduceMotion) {
    return (
      <section className="bg-[#0A1B34] px-5 py-24 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-10 space-y-1 text-white/45">
            <p>&ldquo;I don&rsquo;t know.&rdquo; &ldquo;Maybe?&rdquo; &ldquo;What if I&rsquo;m wrong?&rdquo; &ldquo;Everyone else gets it&hellip;&rdquo;</p>
          </div>
          <p className="font-serif text-2xl italic text-white/70">I think&hellip; I think because&hellip;</p>
          <p className="hs-voice-final mt-4">This Is<br />What I Think.</p>
          <div className="mx-auto mt-6 h-[6px] w-56 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#D97D3D]" />
          <p className="mx-auto mt-10 max-w-md text-base leading-8 text-white/60">
            Confidence isn&rsquo;t having every answer. It&rsquo;s learning to trust your thinking enough to contribute one.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative bg-[#0A1B34] text-white" style={{ height: '320vh' }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="relative mx-auto w-full max-w-3xl text-center">
          <motion.p style={{ opacity: o1 }} className="hs-voice-doubt absolute inset-x-0">&ldquo;I don&rsquo;t know.&rdquo;</motion.p>
          <motion.p style={{ opacity: o2 }} className="hs-voice-doubt absolute inset-x-0">&ldquo;Maybe?&rdquo;</motion.p>
          <motion.p style={{ opacity: o3 }} className="hs-voice-doubt absolute inset-x-0">&ldquo;What if I&rsquo;m wrong?&rdquo;</motion.p>
          <motion.p style={{ opacity: o4 }} className="hs-voice-doubt absolute inset-x-0">&ldquo;Everyone else gets it&hellip;&rdquo;</motion.p>

          <motion.p style={{ opacity: o5 }} className="hs-voice-mid absolute inset-x-0">I think&hellip;</motion.p>
          <motion.p style={{ opacity: o6 }} className="hs-voice-mid absolute inset-x-0">I think because&hellip;</motion.p>

          <motion.div style={{ opacity: oFinal }} className="relative">
            <p className="hs-voice-final">This Is<br />What I Think.</p>
            <svg viewBox="0 0 300 20" className="mx-auto mt-4 h-4 w-56" preserveAspectRatio="none" aria-hidden="true">
              <motion.path d="M4 12 Q 80 4 150 10 T 296 8" stroke="#D4AF37" strokeWidth="7" strokeLinecap="round" fill="none" style={{ pathLength: underline }} />
            </svg>
            <motion.p style={{ opacity: oSupport }} className="mx-auto mt-10 max-w-sm text-base leading-8 text-white/60">
              Confidence isn&rsquo;t having every answer. It&rsquo;s learning to <span className="hs-voice-trust">trust</span> your thinking enough to contribute one.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HOW WE TEACH HIGH SCHOOL — all four principles, full descriptions, with a
   sticky classroom photograph on desktop.
============================================================================ */

function HowWeTeach() {
  const reduceMotion = useReducedMotion();
  const activation = { once: false, margin: '-42% 0px -42% 0px' } as const;

  return (
    <section className="bg-[#FFFDF8] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#B98A22]">Our Approach</p>
          <h2 className="hs-h2">How We Teach<br />High School</h2>
        </div>

        <div className="lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)] lg:self-start">
            <div className="hs-bleed-photo hs-bleed-photo--classroom h-[320px] lg:h-full">
              <img src="/images/programs/highschool-classroom-wide-2.jpg" alt="A DA Tuition tutor actively teaching a small group of high school students" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="mt-14 lg:mt-0">
            {approachCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={reduceMotion ? false : { opacity: 0.35, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={activation}
                transition={{ duration: 0.5, ease: premiumEase }}
                className="hs-teach-item"
              >
                <span className="hs-teach-line" style={{ background: card.color }} />
                <span className="hs-stakes-num" style={{ color: card.color }}>0{i + 1}</span>
                <div>
                  <h3 className="hs-h3-sm text-[#0A1B34]">{card.title}</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-[1.75] text-[#4b5768]">{card.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   REAL FAMILIES, REAL RESULTS — editorial photo story, all four testimonials
   preserved with their attribution and star rating.
============================================================================ */

function RealResults() {
  const [tIdx, setTIdx] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setTIdx((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const t = testimonials[tIdx];
  const go = (dir: 1 | -1) => setTIdx((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section className="bg-[#FBF6EA] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div className="hs-bleed-photo hs-bleed-photo--results h-[320px] sm:h-[420px] lg:h-[520px]">
          <img src="/images/programs/highschool-group.jpg" alt="High school students collaborating at DA Tuition" className="h-full w-full object-cover" />
        </div>

        <div>
          <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-[#B98A22]">Real Families, Real Results</p>

          <div className="mb-5 flex gap-0.5 text-[#D4AF37]">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tIdx}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: premiumEase }}
            >
              <p className="min-h-[150px] font-serif text-[19px] italic leading-[1.7] text-[#0A1B34]" dangerouslySetInnerHTML={{ __html: `&ldquo;${t.text}&rdquo;` }} />
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#D4AF37]/40 bg-white text-sm font-black text-[#0A1B34]">{t.initials}</div>
                <p className="text-sm font-bold text-[#0A1B34]">{t.name}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-4">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="hs-carousel-btn"><ChevronLeft className="h-4 w-4" /></button>
            <span className="font-serif text-sm italic text-[#61708a]">0{tIdx + 1} / 0{testimonials.length}</span>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="hs-carousel-btn"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   PHOTO DUO — a short, quiet interstitial. Same two photographs and captions
   as before, asymmetrical rather than matched rounded-card pairs.
============================================================================ */

function PhotoDuo() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="bg-[#FFFDF8] px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 sm:items-end">
        <motion.figure
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: premiumEase }}
          className="hs-bleed-photo hs-bleed-photo--duo h-64 sm:h-80"
        >
          <img src="/images/programs/highschool-tutor-whiteboard.jpg" alt="DA Tuition teacher explaining a concept on the whiteboard to high school students" className="h-full w-full object-cover" />
          <figcaption className="mt-3 text-sm text-[#61708a]">Concepts explained step by step</figcaption>
        </motion.figure>
        <motion.figure
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1, ease: premiumEase }}
          className="hs-bleed-photo hs-bleed-photo--duo h-52 sm:h-64"
        >
          <img src="/images/programs/highschool-tutoring.jpg" alt="Small group of Years 7-10 students receiving individual attention from a DA Tuition tutor" className="h-full w-full object-cover" />
          <figcaption className="mt-3 text-sm text-[#61708a]">Individual attention, every session</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

/* ============================================================================
   DA TUITION HIGH SCHOOL IS PERFECT IF... — all six statements preserved.
============================================================================ */

function PerfectIf() {
  const reduceMotion = useReducedMotion();
  const activation = { once: false, margin: '-40% 0px -40% 0px' } as const;

  return (
    <section className="bg-[#FBF6EA] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#B98A22]">Is This Right for Us?</p>
          <h2 className="hs-h2">DA Tuition High School<br />Is Perfect If&hellip;</h2>
        </div>

        <div className="divide-y divide-[#0A1B34]/10 border-y border-[#0A1B34]/10">
          {fitItems.map((item, i) => (
            <motion.div
              key={item}
              initial={reduceMotion ? false : { opacity: 0.35 }}
              whileInView={{ opacity: 1 }}
              viewport={activation}
              transition={{ duration: 0.45, ease: premiumEase }}
              className="hs-fit-item"
            >
              <span className="hs-fit-num">0{i + 1}</span>
              <svg viewBox="0 0 24 24" className="hs-fit-check" aria-hidden="true">
                <motion.path
                  d="M4 12.5 L9.5 18 L20 5"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={activation}
                  transition={{ duration: 0.5, ease: premiumEase }}
                />
              </svg>
              <span className="text-[15px] leading-[1.75] text-[#0A1B34]">{item}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/book-interview">
            <Button size="lg" className="h-12 rounded-full bg-[#0A1B34] px-7 font-black text-white hover:bg-[#0e2a4a]">
              Book a Free Trial Lesson
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HSC TRANSITION — clean, directional close. Palette simplifies from the
   four-colour journey down to navy + gold, and the line becomes a single
   gold arrow pointing toward Years 11-12 / HSC. Ends with the original
   final CTA, fully preserved.
============================================================================ */

function HSCTransition() {
  const reduceMotion = useReducedMotion();
  return (
    <>
      <section className="bg-[#FFFDF8] px-5 py-24 text-center lg:px-8 lg:py-28">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: premiumEase }}
          className="hs-h2 mx-auto max-w-2xl"
        >
          You don&rsquo;t have to know exactly<br />where you&rsquo;re going yet.
        </motion.p>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.15, ease: premiumEase }}
          className="hs-hand mt-4 text-xl"
          style={{ color: '#B98A22', '--hs-rotate': '-1.5deg' } as React.CSSProperties}
        >
          That&rsquo;s what these years are for.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.3, ease: premiumEase }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <SketchArrowRight className="h-6 w-16 text-[#D4AF37]" />
          <Link
            to="/hsc-excellence"
            className="inline-flex items-center gap-2 rounded-full border border-[#0A1B34]/15 bg-white px-5 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-[#0A1B34] shadow-sm transition hover:border-[#D4AF37] hover:text-[#B98A22]"
          >
            What&rsquo;s Next? Year 11-12 / HSC
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      <section className="bg-[#0A1B34] px-5 py-20 text-center text-white lg:px-8">
        <h2 className="hs-h2 text-white">
          Do Not Wait for the<br />Report Card
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/72">
          The sooner we identify the gaps, the easier they are to close. Book a free trial lesson: no entrance exam, no lock-in contract. Just a session that shows you what is possible.
        </p>
        <div className="mt-8">
          <Link to="/book-interview">
            <Button size="lg" className="h-12 rounded-full bg-[#D4AF37] px-7 font-black text-[#0A1B34] hover:bg-[#E0BD4B]">
              Book a Free Trial Lesson
            </Button>
          </Link>
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.12em] text-white/45">
          No entrance exam · No lock-in contract · Limited spots each term
        </p>
      </section>
    </>
  );
}

/* ============================================================================
   PAGE
============================================================================ */

const HighSchool = () => {
  return (
    <div className="hs-page min-h-screen bg-[#FFFDF8] text-[#172033]">
      <SEO
        title="High School Tutoring Years 7-10"
        description="Years 7-10 tutoring at DA Tuition builds the skills, habits, and confidence students need for senior school and beyond."
        canonicalUrl="/programs/high-school"
      />
      <NavigationNew />

      <SubjectHero
        eyebrow="High School Tuition · Years 7-10"
        icon={GraduationCap}
        headlineWhite="Find your voice."
        headlineGold="Find your direction."
        subtext="Years 7-10 are where academic trajectories lock in. Our small-group tutoring builds the skills, habits, and confidence your child needs to perform well in senior school and beyond."
        proofPills={['Small groups, capped at 5', 'Selective school prep', 'Written progress updates']}
        exploreTargetId="highschool-page-content"
        placeholderLabel="High school classroom"
        backgroundImageSrc="/highschool-girl.png"
        backgroundImageAlt="A DA Tuition high school student focused on her written work"
      />

      <div id="highschool-page-content">
        <main>
          <Hero />
          <YearJourney />
          <WhyItMatters />
          <TeacherBeside />
          <Curriculum />
          <FindYourVoice />
          <HowWeTeach />
          <RealResults />
          <PhotoDuo />
          <PerfectIf />
          <HSCTransition />
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3.5 border-t border-white/10 bg-[#0A1B34] px-5 py-7 lg:px-8">
          <div className="text-base font-black text-white">DA <span className="text-[#E0BD4B]">Tuition</span></div>
          <p className="text-xs text-white/45">© 2025 DA Tuition · Sydney, Australia</p>
          <p className="text-xs text-white/45">hello@datuition.com.au</p>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Caveat:wght@500;600;700&family=Merriweather:ital,wght@0,400;1,400&display=swap');

        .hs-page { overflow-x: clip; }
        .hs-page h1, .hs-page h2, .hs-page h3 { font-family: 'Outfit', 'Inter', system-ui, sans-serif; }

        .hs-hand { font-family: 'Caveat', cursive; display: inline-block; line-height: 1.15; transform: rotate(var(--hs-rotate, -2deg)); }

        .hs-hero-h1 { font-weight: 800; letter-spacing: -0.03em; line-height: 0.92; font-size: clamp(2.9rem, 7vw, 5.4rem); }
        .hs-hero-h1__voice { color: #8574C4; }
        .hs-hero-h1__direction { color: #D4AF37; }

        .hs-h2 { font-weight: 700; letter-spacing: -0.03em; line-height: 1.04; font-size: clamp(2.1rem, 3.6vw, 3.1rem); color: #0A1B34; }
        .hs-h3 { font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; font-size: clamp(1.5rem, 2vw, 1.85rem); }
        .hs-h3-sm { font-weight: 700; letter-spacing: -0.015em; line-height: 1.25; font-size: 1.2rem; }

        .hs-underline-wrap { position: relative; display: inline-block; }
        .hs-underline { position: absolute; left: -2%; bottom: -0.14em; width: 104%; height: 0.5em; pointer-events: none; }
        .hs-underline--wide { bottom: -0.08em; height: 0.45em; }
        .hs-underline--tight { bottom: -0.18em; height: 0.4em; }

        /* Hero photo + iPad visual */
        .hs-hero-photo__frame { position: relative; z-index: 2; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 1.25rem 2.5rem 1.25rem 2.5rem; box-shadow: 0 24px 48px -20px rgba(10,27,52,0.35); }
        .hs-ipad { position: absolute; right: -6%; bottom: -8%; z-index: 3; width: 62%; max-width: 300px; filter: drop-shadow(0 22px 34px rgba(10,27,52,0.28)); }
        .hs-ipad__screen { position: relative; border-radius: 0.9rem; border: 8px solid #10233f; background: #fefaf1; padding: 1.1rem 1rem 1.2rem; aspect-ratio: 3/3.9; display: flex; flex-direction: column; }
        .hs-ipad__cam { position: absolute; top: -19px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background: #0A1B34; }
        .hs-ipad__title { font-family: 'Caveat', cursive; font-size: 1.3rem; font-weight: 700; color: #0A1B34; margin: 0 0 0.5rem; }
        .hs-ipad__list { list-style: none; margin: 0 0 0.85rem; padding: 0; display: grid; gap: 0.32rem; }
        .hs-ipad__list li { display: flex; align-items: center; gap: 0.4rem; font-size: 0.66rem; font-weight: 600; color: #2c3a52; }
        .hs-ipad__list li svg { width: 0.7rem; height: 0.7rem; color: #5B8266; flex-shrink: 0; }
        .hs-ipad__venn { position: relative; height: 4.6rem; margin: 0.2rem 0 0.4rem; }
        .hs-ipad__circle { position: absolute; width: 3.1rem; height: 3.1rem; border-radius: 50%; border: 1.3px solid; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 0.42rem; font-weight: 700; letter-spacing: 0.02em; background: rgba(255,255,255,0.6); }
        .hs-ipad__circle--a { left: 6%; top: 0; border-color: #2563EB; color: #2563EB; }
        .hs-ipad__circle--b { right: 6%; top: 0; border-color: #5B8266; color: #5B8266; }
        .hs-ipad__circle--c { left: 50%; bottom: 0; transform: translateX(-50%); border-color: #8574C4; color: #8574C4; }
        .hs-ipad__result { margin: 0; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.03em; color: #0A1B34; text-transform: uppercase; border-top: 1px solid rgba(10,27,52,0.12); padding-top: 0.45rem; }
        .hs-ipad__pencil { position: absolute; right: 6%; bottom: 8%; width: 3px; height: 34%; background: linear-gradient(180deg, #f3d68a, #d4af37 70%, #b98a22 70%, #b98a22 100%); border-radius: 2px; transform: rotate(28deg); }

        /* Bleed photos: soft clipped shapes instead of uniform rounded rectangles */
        .hs-bleed-photo { position: relative; overflow: hidden; }
        .hs-bleed-photo img { display: block; }
        .hs-bleed-photo--teacher { clip-path: polygon(4% 2%, 94% 0%, 100% 10%, 98% 94%, 88% 100%, 6% 97%, 0% 88%, 2% 8%); aspect-ratio: 4/5; }
        .hs-bleed-photo--classroom { clip-path: polygon(2% 0%, 100% 2%, 100% 100%, 3% 100%); }
        .hs-bleed-photo--results { clip-path: polygon(0% 4%, 96% 0%, 100% 92%, 6% 100%); }
        .hs-bleed-photo--duo { border-radius: 0.75rem 3rem 0.75rem 0.75rem; }

        /* Year journey */
        .hs-year-stage { position: relative; padding: 1.5rem 1.1rem 1.25rem; }
        .hs-year-wash { position: absolute; inset: -0.4rem -0.6rem; border-radius: 1.4rem; z-index: 0; }
        .hs-year-num { position: relative; z-index: 1; font-weight: 800; font-size: 2rem; line-height: 1; letter-spacing: -0.02em; }

        /* Why it matters */
        .hs-stakes-item { display: flex; gap: 1.5rem; align-items: flex-start; padding: 1.75rem 0; }
        .hs-stakes-num { font-weight: 800; font-size: 1.6rem; line-height: 1; letter-spacing: -0.01em; min-width: 3rem; }

        /* How we teach */
        .hs-teach-item { position: relative; display: flex; gap: 1.25rem; align-items: flex-start; padding: 1.9rem 0 1.9rem 1.1rem; }
        .hs-teach-line { position: absolute; left: 0; top: 2.1rem; bottom: 2.1rem; width: 2px; }

        /* Curriculum subject index */
        .hs-subject-index { display: flex; flex-wrap: wrap; gap: 0.4rem 1.8rem; }
        .hs-subject-index__item { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 2px solid transparent; font-size: 0.82rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #61708a; background: none; cursor: pointer; transition: color 0.25s ease, border-color 0.25s ease; }
        .hs-subject-index__item svg { color: #B98A22; opacity: 0.7; }
        .hs-subject-index__item.is-active, .hs-subject-index__item:hover { color: #0A1B34; border-color: #D4AF37; }

        /* Find your voice */
        .hs-voice-doubt { font-family: 'Merriweather', serif; font-style: italic; font-size: clamp(1.6rem, 4vw, 2.4rem); color: rgba(255,255,255,0.55); }
        .hs-voice-mid { font-family: 'Merriweather', serif; font-style: italic; font-size: clamp(1.8rem, 4.5vw, 2.7rem); color: rgba(255,255,255,0.85); }
        .hs-voice-final { font-family: 'Outfit', sans-serif; font-weight: 800; letter-spacing: -0.03em; line-height: 0.98; font-size: clamp(2.6rem, 7vw, 4.6rem); color: #fff; margin: 0; }
        .hs-voice-trust { color: #D4AF37; border: 1.5px solid #D4AF37; border-radius: 0.3rem; padding: 0 0.35rem; }

        /* Perfect if */
        .hs-fit-item { position: relative; display: flex; align-items: center; gap: 1.1rem; padding: 1.4rem 0.25rem; }
        .hs-fit-num { font-weight: 800; font-size: 0.85rem; color: #B98A22; min-width: 1.6rem; }
        .hs-fit-check { width: 1.15rem; height: 1.15rem; flex-shrink: 0; }

        /* Testimonial carousel */
        .hs-carousel-btn { display: inline-flex; align-items: center; justify-content: center; width: 2.1rem; height: 2.1rem; border-radius: 999px; border: 1px solid rgba(10,27,52,0.15); color: #0A1B34; background: transparent; transition: border-color 0.2s ease, background 0.2s ease; }
        .hs-carousel-btn:hover { border-color: #D4AF37; background: rgba(212,175,55,0.08); }

        @media (max-width: 1024px) {
          .hs-ipad { position: relative; right: auto; bottom: auto; width: min(78%, 280px); margin: 1.75rem auto 0; }
        }
        @media (max-width: 640px) {
          .hs-hero-photo { width: 88%; }
          .hs-stakes-item, .hs-teach-item { gap: 1rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hs-page * { scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default HighSchool;
