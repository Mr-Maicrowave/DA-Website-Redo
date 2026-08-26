import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import { Button } from '@/components/ui/button';
import SubjectHero from '@/components/subjects/SubjectHero';
import HighSchoolCinematicScene from '@/components/programs/HighSchoolCinematicScene';
import HighSchoolProfessionalJourney from '@/components/programs/high-school-professional/HighSchoolProfessionalJourney';
import { highSchoolJourneyAssets } from '@/data/highSchoolJourneyAssets';
import { highSchoolJourneyStages } from '@/data/highSchoolJourneyScenes';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, GraduationCap, Star } from 'lucide-react';

/* ============================================================================
   CONTENT — every field below is preserved verbatim from the previous build
   of this page. Nothing has been shortened, summarised or removed; only the
   presentation has changed. New copy (the Year 7-10 journey stages and the
   "Find Your Voice" moment) is additive and clearly separated below.
============================================================================ */

const focusRows = [
  { area: 'English and Essay Writing', build: 'Analytical writing, close reading, text response', skills: 'Thesis construction, evidence integration, language techniques', Icon: SketchPen },
  { area: 'Mathematics', build: 'Algebra, geometry, statistics, calculus foundations', skills: 'Problem-solving, working mathematically, exam technique', Icon: SketchGraph },
  { area: 'Sciences', build: 'Physics, Chemistry, Biology concepts and inquiry skills', skills: 'Scientific reasoning, data analysis, extended response writing', Icon: SketchFlask },
  { area: 'HSIE / Humanities', build: 'Geography, History, critical thinking, source analysis', skills: 'Argument structure, perspective taking, extended response', Icon: SketchGlobe },
  { area: 'Exam and Study Skills', build: 'Organisation, note-taking, revision strategies', skills: 'Time management, past-paper practice, reducing exam anxiety', Icon: SketchClock },
];

const stakesCards = highSchoolJourneyStages.map((stage, index) => ({
  title: stage.heading,
  color: stage.colour,
  text: stage.body,
  icon: ['book', 'sprout', 'route', 'summit'][index],
  asset: highSchoolJourneyAssetsForStage(stage.sceneId),
}));

function highSchoolJourneyAssetsForStage(sceneId: (typeof highSchoolJourneyStages)[number]['sceneId']) {
  const asset = highSchoolJourneyAssets[sceneId].largeWash;
  if (!asset.src) throw new Error(`Missing large watercolour wash for ${sceneId}`);
  return asset.src;
}

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
    <span className={`hs-hand inline-block ${className}`} style={style}>
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
   YEAR 7-10 JOURNEY — an editorial split composition pairing the student
   portrait with the supplied watercolour milestone artwork.
============================================================================ */

function YearJourney() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay: number, y = 18) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: reduceMotion ? 0 : 0.75, delay, ease: premiumEase },
  });

  return (
    <section data-testid="highschool-year-journey" className="relative overflow-hidden bg-[#FFFDF8] px-5 py-16 sm:py-20 lg:px-8 lg:py-0">
      <div className="mx-auto grid max-w-[98rem] items-center lg:min-h-[min(900px,100svh)] lg:grid-cols-[44%_56%] lg:grid-rows-[auto_1fr]">
        <div className="order-1 lg:col-start-2 lg:row-start-1 lg:pb-4 lg:pl-8 lg:pt-20 xl:pl-12">
          <motion.p {...reveal(0.12)} className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#A7791D]">
            Years 7–10
          </motion.p>
          <motion.h2 {...reveal(0.2)} className="hs-year-journey-title text-[clamp(2.6rem,3.9vw,4rem)] font-normal leading-[0.94] tracking-[-0.035em] text-[#0A1B34] [text-wrap:balance]">
            <span className="block lg:whitespace-nowrap">The Four Years</span>
            <span className="block lg:whitespace-nowrap">That Change <span className="hs-underline-wrap">Everything.<MarkerUnderline color="#C79A2B" className="hs-underline hs-underline--wide" delay={0.48} /></span></span>
          </motion.h2>
        </div>

        <motion.div
          {...reveal(0.05, 24)}
          className="order-2 mx-auto mt-8 w-full max-w-[34rem] self-end lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:max-w-none lg:pr-3"
        >
          <img
            src="/images/programs/highschool-hero-student.png"
            alt="DA Tuition student holding her study books"
            className="block h-auto w-full object-contain object-bottom"
          />
        </motion.div>

        <div className="order-3 relative mt-8 pb-4 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-start lg:pl-2 lg:pr-2 xl:pl-6">
          <motion.div
            {...reveal(0.34, 14)}
            whileHover={reduceMotion ? undefined : { scale: 1.015, y: -2 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: premiumEase }}
            className="relative mx-auto w-full origin-center"
          >
            <img
              src="/images/programs/highschool-year-journey-diagonal.png"
              alt="Year 7 to Year 10 journey: Explore, Question, Discover and Direction"
              className="block h-auto w-full object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StakesDoodle({ type, color, active }: { type: string; color: string; active: boolean }) {
  const path = {
    book: 'M5 11 Q12 7 20 11 V31 Q12 27 5 31 Z M35 11 Q28 7 20 11 V31 Q28 27 35 31 Z',
    sprout: 'M20 34 Q19 25 20 15 M20 23 Q11 23 9 16 Q17 14 20 20 M20 18 Q27 18 31 11 Q22 9 20 15',
    route: 'M6 31 Q11 19 20 24 Q29 29 34 9 M27 11 L34 7 L36 15 M10 12 L12 15 L16 16 L13 19 L14 23 L10 21 L6 23 L7 19 L4 16 L8 15 Z',
    summit: 'M5 33 Q15 29 20 19 Q25 10 35 6 M28 10 L36 6 L34 15 M20 19 L27 20 L24 14',
  }[type];

  return (
    <motion.svg viewBox="0 0 40 40" className="h-11 w-11" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.path
        d={path}
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0.25 }}
        transition={{ duration: 0.75, ease: premiumEase }}
      />
      {type === 'summit' && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: active ? [0, 1, 0.45] : 0 }} transition={{ duration: 1, delay: 0.45 }}>
          <path d="M31 2 V5 M38 9 H35 M35 3 L33 6" />
        </motion.g>
      )}
    </motion.svg>
  );
}

/* ============================================================================
   WHAT MAKES YEARS 7-10 SO IMPORTANT — a scroll-built editorial progression.
============================================================================ */

function WhyItMatters() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reduceMotion) return;
    const next = value < 0.3 ? 0 : value < 0.45 ? 1 : value < 0.6 ? 2 : 3;
    setActiveIndex(next);
  });

  const paintY1 = useTransform(scrollYProgress, [0.12, 0.22, 0.245], [620, -8, 0]);
  const paintY2 = useTransform(scrollYProgress, [0.28, 0.38, 0.405], [620, -8, 0]);
  const paintY3 = useTransform(scrollYProgress, [0.44, 0.54, 0.565], [620, -8, 0]);
  const paintY4 = useTransform(scrollYProgress, [0.6, 0.7, 0.725], [620, -8, 0]);
  const paintScale1 = useTransform(scrollYProgress, [0.12, 0.22, 0.245], [0.94, 1.055, 1]);
  const paintScale2 = useTransform(scrollYProgress, [0.28, 0.38, 0.405], [0.94, 1.055, 1]);
  const paintScale3 = useTransform(scrollYProgress, [0.44, 0.54, 0.565], [0.94, 1.055, 1]);
  const paintScale4 = useTransform(scrollYProgress, [0.6, 0.7, 0.725], [0.94, 1.055, 1]);
  const paintOpacity1 = useTransform(scrollYProgress, [0.12, 0.17], [0, 0.92]);
  const paintOpacity2 = useTransform(scrollYProgress, [0.28, 0.33], [0, 0.92]);
  const paintOpacity3 = useTransform(scrollYProgress, [0.44, 0.49], [0, 0.92]);
  const paintOpacity4 = useTransform(scrollYProgress, [0.6, 0.65], [0, 0.92]);
  const textOpacity1 = useTransform(scrollYProgress, [0.18, 0.25], [0.2, 1]);
  const textOpacity2 = useTransform(scrollYProgress, [0.34, 0.41], [0.2, 1]);
  const textOpacity3 = useTransform(scrollYProgress, [0.5, 0.57], [0.2, 1]);
  const textOpacity4 = useTransform(scrollYProgress, [0.66, 0.73], [0.2, 1]);
  const textY1 = useTransform(scrollYProgress, [0.19, 0.25], [14, 0]);
  const textY2 = useTransform(scrollYProgress, [0.35, 0.41], [14, 0]);
  const textY3 = useTransform(scrollYProgress, [0.51, 0.57], [14, 0]);
  const textY4 = useTransform(scrollYProgress, [0.67, 0.73], [14, 0]);
  const trailLength = useTransform(scrollYProgress, [0.75, 0.97], [0, 1]);
  const planeDistance = useTransform(scrollYProgress, [0.75, 0.97], ['0%', '100%']);
  const planeOpacity = useTransform(scrollYProgress, [0, 0.74, 0.77, 0.96, 0.99], [0.52, 0.52, 1, 1, 0.52]);
  const paintStyles = [
    { y: paintY1, scale: paintScale1, opacity: paintOpacity1 },
    { y: paintY2, scale: paintScale2, opacity: paintOpacity2 },
    { y: paintY3, scale: paintScale3, opacity: paintOpacity3 },
    { y: paintY4, scale: paintScale4, opacity: paintOpacity4 },
  ];
  const textStyles = [
    { opacity: textOpacity1, y: textY1 },
    { opacity: textOpacity2, y: textY2 },
    { opacity: textOpacity3, y: textY3 },
    { opacity: textOpacity4, y: textY4 },
  ];
  const planePath = isDesktop
    ? 'path("M 15 610 C 165 560 95 430 260 435 C 450 440 275 275 480 275 C 610 275 545 105 760 35")'
    : 'path("M 18 690 C 145 650 70 540 250 520 C 350 505 225 375 330 340 C 400 315 310 180 390 105")';

  return (
    <section ref={sectionRef} id="programs" data-testid="why-it-matters-progress" className="relative overflow-clip bg-[#FBF6EA] lg:h-[300vh]">
      <div className="hs-stakes-shell mx-auto flex min-h-screen max-w-[1500px] flex-col justify-center px-5 py-20 sm:px-10 lg:sticky lg:top-0 lg:grid lg:h-screen lg:min-h-0 lg:grid-cols-[36%_64%] lg:items-center lg:gap-8 lg:overflow-hidden lg:px-16 lg:py-0 xl:grid-cols-[40%_60%] xl:gap-12 xl:px-20">
        <div className="relative z-20 shrink-0 lg:pr-4 xl:pr-8">
          <motion.p initial={reduceMotion ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#A7791D]">
            Why This Stage Is Critical
          </motion.p>
          <motion.h2 initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: premiumEase }} className="hs-stakes-title">
            What Makes<br />Years 7–10<br />So Important<span className="text-[#B98A22]">.</span>
          </motion.h2>
          <p className="hs-hand mt-7 max-w-sm origin-left text-[clamp(1.35rem,2.2vw,1.9rem)] text-[#B77D10]">
            Small foundations become<br className="hidden sm:block" /> big possibilities.
          </p>
          <span className="mt-2 block h-[3px] w-20 -rotate-3 rounded-full bg-[#B77D10]" aria-hidden="true" />
        </div>

        <div className="hs-stakes-list relative z-10 mt-16 flex flex-col gap-16 lg:mt-0 lg:h-[76vh] lg:max-h-[760px] lg:min-h-[570px] lg:justify-between lg:gap-0">
          {stakesCards.map((card, i) => {
            const active = reduceMotion || activeIndex >= i;
            return (
              <motion.article
                key={card.title}
                id={`milestone-0${i + 1}`}
                style={!reduceMotion && isDesktop ? textStyles[i] : undefined}
                className="hs-stakes-milestone group"
              >
                <div className="hs-stakes-row relative grid grid-cols-[130px_minmax(0,1fr)] items-center gap-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-9 lg:grid-cols-[clamp(160px,15vw,190px)_minmax(0,1fr)] lg:gap-9 xl:gap-12">
                  <div className="hs-stakes-visual relative flex h-[145px] w-[130px] shrink-0 items-center justify-center sm:h-[160px] sm:w-[160px] lg:h-[170px] lg:w-full">
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
                      style={!reduceMotion && isDesktop ? paintStyles[i] : { opacity: 0.92 }}
                      aria-hidden="true"
                    >
                      <img
                        src={card.asset}
                        alt=""
                        className="w-[150px] max-w-none select-none sm:w-[165px] lg:w-[clamp(165px,14vw,185px)]"
                      />
                    </motion.div>
                    <span className="hs-stakes-num relative z-[2]" style={{ color: card.color }}>0{i + 1}</span>
                    <div className="absolute bottom-[8%] right-[5%] z-[2] lg:right-[3%]">
                      <StakesDoodle type={card.icon} color={card.color} active={active} />
                    </div>
                  </div>
                  <div className="hs-stakes-content relative z-[3] min-w-0 lg:max-w-[560px]">
                    <h3 className="hs-stakes-heading text-[#0A1B34]">
                      {i === 2 ? <>Selective &amp; Scholarship Pressure</> : card.title}
                    </h3>
                    <motion.span className="mt-2 block h-[2px] w-24 origin-left rounded-full" style={{ backgroundColor: card.color }} animate={{ scaleX: active ? 1 : 0.15 }} transition={{ duration: 0.55, ease: premiumEase }} />
                    <p className="mt-3 max-w-[35rem] text-[clamp(0.95rem,1.2vw,1.08rem)] leading-[1.6] text-[#46536A]">{i === 3 ? <>When students believe in themselves, they&rsquo;re willing to take on bigger challenges.</> : card.text}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <svg viewBox="0 0 780 650" preserveAspectRatio="none" className="pointer-events-none absolute inset-y-0 right-16 z-20 hidden h-full w-[60%] lg:block xl:right-20" fill="none" aria-hidden="true">
          <defs>
            <mask id="stakes-flight-mask-desktop">
              <motion.path d="M15 610 C165 560 95 430 260 435 C450 440 275 275 480 275 C610 275 545 105 760 35" stroke="white" strokeWidth="8" fill="none" style={{ pathLength: reduceMotion ? 1 : trailLength }} />
            </mask>
          </defs>
          <path d="M15 610 C165 560 95 430 260 435 C450 440 275 275 480 275 C610 275 545 105 760 35" stroke="#123D76" strokeWidth="1.5" strokeDasharray="7 10" strokeLinecap="round" opacity="0.16" />
          <path data-testid="stakes-flight-trail" d="M15 610 C165 560 95 430 260 435 C450 440 275 275 480 275 C610 275 545 105 760 35" stroke="#123D76" strokeWidth="2" strokeDasharray="7 10" strokeLinecap="round" mask="url(#stakes-flight-mask-desktop)" />
        </svg>
        <motion.div
          data-testid="stakes-paper-plane"
          className="pointer-events-none absolute left-0 top-0 z-30 hidden h-12 w-12 text-[#123D76] lg:left-[38%] lg:block lg:h-16 lg:w-16"
          style={{ offsetPath: planePath, offsetDistance: reduceMotion ? '0%' : planeDistance, offsetRotate: 'auto 12deg', opacity: reduceMotion ? 0.52 : planeOpacity }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 64 54" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
            <path d="M4 24 L58 4 L43 48 L30 32 L18 43 L20 28 Z" />
            <path d="M20 28 L58 4 L30 32" />
            <path d="M18 43 L27 34" opacity=".7" />
          </svg>
        </motion.div>
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
  const { scrollYProgress: p } = useScroll({ target: reduceMotion ? undefined : ref, offset: ['start start', 'end end'] });

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
          <HighSchoolCinematicScene />
          <HighSchoolProfessionalJourney />
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

        .hs-hand { font-family: 'Caveat', cursive; line-height: 1.15; transform: rotate(var(--hs-rotate, -2deg)); }

        .hs-hero-h1 { font-weight: 800; letter-spacing: -0.03em; line-height: 0.92; font-size: clamp(2.9rem, 7vw, 5.4rem); }
        .hs-hero-h1__voice { color: #8574C4; }
        .hs-hero-h1__direction { color: #D4AF37; }

        .hs-h2 { font-weight: 700; letter-spacing: -0.03em; line-height: 1.04; font-size: clamp(2.1rem, 3.6vw, 3.1rem); color: #0A1B34; }
        .hs-h3 { font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; font-size: clamp(1.5rem, 2vw, 1.85rem); }
        .hs-h3-sm { font-weight: 700; letter-spacing: -0.015em; line-height: 1.25; font-size: 1.2rem; }
        .hs-year-journey-title { font-family: 'Libre Baskerville', Georgia, serif !important; }

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

        /* Why it matters */
        .hs-stakes-title { font-family: 'Libre Baskerville', Georgia, serif !important; font-weight: 700; letter-spacing: -0.035em; line-height: 1.04; font-size: clamp(2.45rem, 4.6vw, 4.75rem); color: #0A1B34; }
        .hs-stakes-milestone { position: relative; min-height: 0; }
        .hs-stakes-num { font-family: 'Libre Baskerville', Georgia, serif; font-weight: 700; font-size: clamp(3.4rem, 5vw, 5.375rem); line-height: 0.9; letter-spacing: -0.065em; }
        .hs-stakes-heading { font-family: 'Libre Baskerville', Georgia, serif !important; font-weight: 700; font-size: clamp(1.25rem, 1.55vw, 1.625rem); line-height: 1.2; letter-spacing: -0.025em; }

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
          .hs-teach-item { gap: 1rem; }
          .hs-stakes-title { font-size: clamp(2rem, 10vw, 2.65rem); }
          .hs-stakes-num { font-size: clamp(3.2rem, 15vw, 4rem); }
          .hs-stakes-heading { font-size: clamp(1.05rem, 4.7vw, 1.25rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hs-page * { scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default HighSchool;
