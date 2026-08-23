import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Flag, Mountain, Play, Sparkles } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';
import { hasStoryVideo, journeys, startingPoints, studentStories, type StartingPoint } from '@/data/why-da';
import './WhyChooseDA.css';

type PathId = StartingPoint['id'];

const PATHWAY_LABELS: Record<PathId, string> = {
  confidence: 'Confidence',
  stuck: 'Clarity',
  challenge: 'Challenge',
};

const QUESTIONS: ReadonlyArray<{ question: string; choices: ReadonlyArray<{ label: string; path: PathId }> }> = [
  { question: 'When work gets difficult, what happens first?', choices: [
    { label: 'They doubt themselves, even when they know more than they think.', path: 'confidence' },
    { label: 'They keep trying, but do not know where the gap is.', path: 'stuck' },
    { label: 'They finish quickly and want something more to reach for.', path: 'challenge' },
  ] },
  { question: 'What would make the biggest difference right now?', choices: [
    { label: 'Feeling safe enough to speak up and give it a go.', path: 'confidence' },
    { label: 'A clearer way through what is holding them back.', path: 'stuck' },
    { label: 'A tutor who can stretch their thinking with purpose.', path: 'challenge' },
  ] },
  { question: 'What do you hope they leave DA feeling?', choices: [
    { label: 'More sure of their own voice.', path: 'confidence' },
    { label: 'Capable again, with a way forward.', path: 'stuck' },
    { label: 'Excited by what they can do next.', path: 'challenge' },
  ] },
];

const RHYTHM = [
  { moment: 'Arrive', title: 'Walk into a familiar room.', body: 'Faces are familiar, names are remembered, and students settle before the work begins.', image: '/images/difference/student-moment-01-natural-smiles.png', alt: 'A group of DA students gathered in their classroom' },
  { moment: 'Feel known', title: 'Be seen as a whole person.', body: 'Tutors notice confidence as well as content, and understand the pressures a student carries in from school.', image: '/images/difference/rhythm-belong.jpg', alt: 'Two DA students during a lesson' },
  { moment: 'Be challenged', title: 'Do work worth being proud of.', body: 'Thoughtful teaching gives students enough support to start, and enough room to think for themselves.', image: '/images/difference/student-moment-03.jpg', alt: 'Students working together during a DA lesson' },
  { moment: 'Grow', title: 'Notice what they can now do.', body: 'A clearer method, a raised hand, a better question. Progress becomes visible in how students carry themselves.', image: '/images/difference/rhythm-grow.jpg', alt: 'Two DA students smiling over their work together' },
  { moment: 'Belong', title: 'Leave with more than a finished worksheet.', body: 'They leave with direction, encouragement and a community that expects good things from them.', image: '/images/difference/student-moment-02-smiles.png', alt: 'DA students gathered with their tutor during a lesson' },
] as const;

const GAINS = [
  ['A voice of their own', 'They learn to ask a question, explain a method and contribute when an idea is still taking shape.'],
  ['Habits that travel', 'Preparation, follow-through and a calmer way to approach difficult work become how they learn everywhere.'],
  ['The courage to persist', 'Challenge stops being a verdict on their ability. It becomes where capability is built.'],
  ['People in their corner', 'Friendships and trusted tutors make it easier to take healthy risks and recover from setbacks.'],
] as const;

const PROGRAM_FITS: Record<PathId, ReadonlyArray<{ name: string; detail: string }>> = {
  confidence: [
    { name: 'Focus Class', detail: 'Small-group support that builds clarity, consistency and confidence in the fundamentals.' },
    { name: 'Bullet Class', detail: 'Focused revision that helps students see what they know and use it with confidence.' },
  ],
  stuck: [
    { name: 'Focus Class', detail: 'A calm, structured way to repair foundations and make each next step clear.' },
    { name: 'Bullet Class', detail: 'Fast, focused exam preparation built around key skills, technique and revision.' },
  ],
  challenge: [
    { name: 'GAT Class', detail: 'Extension-style learning for high-performing students ready for greater depth.' },
    { name: 'Bullet Class', detail: 'High-impact lessons to sharpen exam technique and stretch performance.' },
  ],
};

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

function PathMarker({ value, filled = false }: { value: string; filled?: boolean }) {
  return <span aria-hidden="true" className={`absolute -left-14 top-1 hidden h-9 w-9 items-center justify-center rounded-full border-2 border-[#c9a227] font-serif text-sm lg:flex ${filled ? 'bg-[#c9a227] text-[#071629]' : 'bg-[#fbf8ef] text-[#a88314]'}`}>{value}</span>;
}

function PathwayIcon({ path }: { path: PathId }) {
  const Icon = path === 'confidence' ? Mountain : path === 'stuck' ? Sparkles : Flag;
  return <span aria-hidden="true" className="da-difference__choice-map-number"><Icon className="h-6 w-6" strokeWidth={1.5} /></span>;
}

export default function WhyChooseDA() {
  const [answers, setAnswers] = useState<(PathId | null)[]>([null, null, null]);
  const [selectedId, setSelectedId] = useState<PathId | null>(null);
  const [isRailPaused, setIsRailPaused] = useState(false);
  const lifeRailRef = useRef<HTMLOListElement>(null);
  const answeredCount = answers.filter(Boolean).length;
  const journey = selectedId ? journeys[selectedId] : null;
  const story = selectedId ? studentStories.find((item) => item.journeyId === selectedId && hasStoryVideo(item)) : undefined;

  function choose(questionIndex: number, path: PathId) {
    const next = answers.map((answer, index) => index === questionIndex ? path : answer);
    setAnswers(next);
    if (next.every(Boolean)) {
      const counts = next.reduce<Record<PathId, number>>((total, answer) => {
        if (answer) total[answer] += 1;
        return total;
      }, { confidence: 0, stuck: 0, challenge: 0 });
      setSelectedId((Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'confidence') as PathId);
    }
  }

  function chooseStartingPoint(path: PathId) {
    setSelectedId(path);
    window.setTimeout(() => document.getElementById('quick-questions')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  function moveLifeRail(direction: -1 | 1) {
    const rail = lifeRailRef.current;
    const firstCard = rail?.querySelector<HTMLElement>('li');
    if (!rail || !firstCard) return;
    rail.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + 24), behavior: 'smooth' });
  }

  useEffect(() => {
    if (isRailPaused) return;
    const rail = lifeRailRef.current;
    if (!rail) return;
    const interval = window.setInterval(() => {
      const firstCard = rail.querySelector<HTMLElement>('li');
      if (!firstCard) return;
      const cardWidth = firstCard.getBoundingClientRect().width + 24;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
      rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + cardWidth, behavior: 'smooth' });
    }, 6500);
    return () => window.clearInterval(interval);
  }, [isRailPaused]);

  return <>
    <SEO title="The DA Difference | A Story That Starts With Your Child" description="Discover how DA Tuition sees each student, then follow a pathway shaped around confidence, clarity or challenge." canonicalUrl="/why-choose-da" />
    <NavigationNew />
    <main className="da-difference overflow-hidden bg-[#fbf8ef]">
      <section className="da-difference__cinematic-art relative overflow-hidden bg-[#071b33]" aria-label="The DA Difference: every child arrives differently, the care does not.">
        <img src="/images/difference/da-difference-cinematic-hero-one-to-one.png" alt="A DA tutor looking warmly toward one student during a lesson" className="da-difference__cinematic-art-image block w-full" />
        <div className="da-difference__hero-journey absolute inset-x-0 bottom-0 z-10 px-5 pb-8 pt-16 sm:px-10 sm:pb-11 lg:px-16 lg:pb-14">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e4c76c] sm:text-sm">The DA journey</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.08] tracking-[-0.025em] text-white sm:text-4xl">We notice the person doing the work.</h2>
            <p className="mt-4 max-w-[62ch] text-base leading-7 text-[#d4dce5] sm:text-lg sm:leading-8">We pay attention to how each child learns, what they carry into the room and the kind of support that helps them move forward. The work matters. So does the child doing it.</p>
          </div>
        </div>
      </section>

      <section className="relative bg-[#f5efdd] px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">Life at DA</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[#071629] sm:text-5xl">Whatever brings them here, the week looks like this.</h2>
            <p className="mt-5 text-lg leading-8 text-[#30445e]">Five moments, week after week. It is the rhythm underneath every story on this page.</p>
          </div>
          <div className="da-difference__life-controls mt-8 flex justify-end">
            <div className="flex gap-2"><button type="button" aria-label="Previous life at DA moment" onClick={() => moveLifeRail(-1)} className="da-difference__life-arrow"><ChevronLeft className="h-5 w-5" /></button><button type="button" aria-label="Next life at DA moment" onClick={() => moveLifeRail(1)} className="da-difference__life-arrow"><ChevronRight className="h-5 w-5" /></button></div>
          </div>
          <ol ref={lifeRailRef} onPointerEnter={() => setIsRailPaused(true)} onPointerLeave={() => setIsRailPaused(false)} onFocus={() => setIsRailPaused(true)} onBlur={() => setIsRailPaused(false)} className="da-difference__life-rail mt-8">
            {RHYTHM.map((step, index) => <li key={step.moment} className="da-difference__life-card group"><figure className="overflow-hidden rounded-2xl bg-[#dce2df]"><img src={step.image} alt={step.alt} className="h-64 w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 sm:h-72" loading="lazy" /></figure><div className="mt-6"><p className="text-sm font-black uppercase tracking-[0.14em] text-[#a88314]">{index + 1} · {step.moment}</p><h3 className="mt-2.5 font-serif text-[1.7rem] leading-tight text-[#071629]">{step.title}</h3><p className="mt-3 text-base leading-7 text-[#40536a]">{step.body}</p></div></li>)}
          </ol>
        </div>
      </section>

      <section id="find-your-child" className="da-difference__questionnaire relative overflow-hidden bg-[#071b33] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
        <div aria-hidden="true" className="da-difference__questionnaire-lines" />
        <div className="relative mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="text-center"><p className="text-sm font-black uppercase tracking-[0.2em] text-[#e4c76c]">A place to begin</p><h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl">Which sounds like <em className="not-italic text-[#e4c76c]">your child?</em></h2></motion.div>
          <div className="da-difference__choice-map mt-16">
            <p className="mb-7 text-center text-base text-[#d4dce5]">Choose the starting point that feels closest. We&rsquo;ll take you straight to the questions.</p>
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-8">
              {startingPoints.map((point) => <button key={point.id} type="button" onClick={() => chooseStartingPoint(point.id)} className={`da-difference__choice-map-item ${selectedId === point.id ? 'is-selected' : ''}`}><PathwayIcon path={point.id} /><span className="mt-4 block font-serif text-3xl text-[#e4c76c]">{PATHWAY_LABELS[point.id]}</span><span className="mt-3 block text-base leading-7 text-[#e2e8ef]">{point.title}</span><span className="da-difference__choice-map-cta">Choose this starting point <ArrowRight className="h-4 w-4" /></span></button>)}
            </div>
            <div className="da-difference__choice-map-route" aria-hidden="true"><svg viewBox="0 0 1200 130" preserveAspectRatio="none"><path d="M 200 0 C 200 58 470 52 600 128" /><path d="M 600 0 L 600 128" /><path d="M 1000 0 C 1000 58 730 52 600 128" /><circle cx="200" cy="0" r="4" /><circle cx="600" cy="0" r="4" /><circle cx="1000" cy="0" r="4" /><circle cx="600" cy="128" r="5" /></svg><span>Continue to the three quick questions</span></div>
          </div>
          <div id="quick-questions" className="mx-auto mt-14 max-w-4xl scroll-mt-24 space-y-7 border-t border-[#e4c76c]/35 pt-12">
            <p className="text-center text-sm font-black uppercase tracking-[0.2em] text-[#e4c76c]">Three quick questions</p>
            {QUESTIONS.slice(0, Math.min(answeredCount + 1, QUESTIONS.length)).map((question, questionIndex) => <motion.fieldset key={question.question} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="da-difference__question border-t border-[#e4c76c]/40 pt-7 first:border-t-0 first:pt-0"><legend className="flex items-baseline gap-4 font-serif text-2xl leading-tight text-white sm:text-3xl"><span className="text-[#e4c76c]">{questionIndex + 1}.</span>{question.question}</legend><div className="mt-5 grid gap-3 sm:grid-cols-3">{question.choices.map((choice) => { const active = answers[questionIndex] === choice.path; return <button key={choice.label} type="button" aria-pressed={active} onClick={() => choose(questionIndex, choice.path)} className={`min-h-28 border px-5 py-5 text-left text-[17px] leading-7 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4c76c] ${active ? 'border-[#e4c76c] bg-[#e4c76c] text-[#071629]' : 'border-white/25 bg-white/[0.03] text-[#edf2f7] hover:border-[#e4c76c] hover:bg-white/[0.08]'}`}><span className="block">{choice.label}</span>{active ? <Check aria-hidden="true" className="mt-4 h-5 w-5" strokeWidth={3} /> : null}</button>; })}</div></motion.fieldset>)}
          </div>
          <AnimatePresence>{journey ? <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-14 border-t border-[#e4c76c]/45 pt-9 text-center"><p className="font-serif text-3xl text-white sm:text-4xl">This may feel familiar.</p><p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-[#d4dce5]">{startingPoints.find((point) => point.id === selectedId)?.responseHeading}</p><a href="#your-pathway" className="mt-7 inline-flex items-center gap-2 border-b border-[#e4c76c] pb-2 text-sm font-black text-[#e4c76c]">Follow this pathway <ArrowRight className="h-4 w-4" /></a></motion.div> : null}</AnimatePresence>
        </div>
      </section>

      <section id="your-pathway" className="scroll-mt-20 bg-[#fbf8ef] px-5 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">Three pathways. One promise.</p><h2 className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] sm:text-5xl">Every child is met where they are, then taken somewhere further.</h2></div><p className="max-w-lg text-lg leading-8 text-[#40536a]">The questions above are only a starting point. Explore every story — your child may recognise pieces of themselves in more than one.</p></div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Explore student pathways">{startingPoints.map((point) => { const active = point.id === selectedId; return <button key={point.id} id={`${point.id}-tab`} type="button" role="tab" aria-selected={active} onClick={() => setSelectedId(point.id)} className={`rounded-2xl border px-6 py-6 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a88314] ${active ? 'border-[#173552] bg-[#173552] text-white shadow-[0_10px_20px_rgba(7,22,41,0.16)]' : 'border-[#d8c99f] bg-[#fffdf7] text-[#173552] hover:border-[#a88314]'}`}><span className="font-serif text-2xl leading-tight">{point.title}</span><span className={`mt-4 block text-base leading-7 ${active ? 'text-[#d4dce5]' : 'text-[#40536a]'}`}>{point.responseHeading}</span></button>; })}</div>

          <AnimatePresence mode="wait">{journey ? <motion.div key={selectedId} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.38 }} className="relative mt-14 lg:pl-16"><motion.div aria-hidden="true" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="da-difference__path-line absolute bottom-16 left-4 top-6 hidden w-px origin-top bg-gradient-to-b from-transparent via-[#c9a227] to-transparent lg:block" />
            <section className="mb-16 border-y border-[#c9a227]/35 py-8"><div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">The right kind of room</p><h3 className="mt-3 font-serif text-3xl leading-tight text-[#071629]">Support takes different shapes.</h3><p className="mt-4 text-base leading-7 text-[#40536a]">The pathway describes what a child may need. The class format is how DA meets them there.</p></div><div className="grid gap-5 sm:grid-cols-3">{PROGRAM_FITS[selectedId as PathId].map((program) => <article key={program.name} className="border-t border-[#c9a227]/45 pt-4"><h4 className="font-serif text-xl text-[#071629]">{program.name}</h4><p className="mt-2 text-[15px] leading-7 text-[#40536a]">{program.detail}</p></article>)}</div></div></section>
            <section className="relative"><PathMarker value="I" /><p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">The first lesson</p><h3 className="mt-3 max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] sm:text-5xl">{journey.term1Heading}</h3><p className="mt-5 max-w-3xl text-lg leading-8 text-[#30445e] sm:text-xl sm:leading-9">{journey.term1Body}</p><div className="mt-9 grid items-stretch gap-7 lg:grid-cols-[0.85fr_1.15fr]"><figure className="overflow-hidden rounded-2xl shadow-[0_12px_24px_rgba(7,22,41,0.1)]"><img src={journey.term1Image} alt={journey.term1ImageAlt} className="h-80 w-full object-cover lg:h-full" /></figure><div className="overflow-hidden rounded-2xl bg-[#fffaf0] shadow-[0_12px_24px_rgba(7,22,41,0.1)]"><p className="border-b border-[#e2d3ab] bg-[#f4e7c7] px-7 py-5 text-xs font-black uppercase tracking-[0.16em] text-[#8a6810]">{journey.term1Artifact.label}</p><div className="px-7 py-8"><p className="font-serif text-2xl leading-9 text-[#1c2b45]">{journey.term1Artifact.footerLine}</p></div><p className="border-t border-[#e2d3ab] bg-[#f7edcf] px-7 py-6 text-base leading-7 text-[#40536a]">{journey.term1ArtifactCaption}</p></div></div></section>
            <section className="relative mt-16"><PathMarker value="II" /><p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">The turn</p><h3 className="mt-3 max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] sm:text-5xl">{journey.term2Heading}</h3><p className="mt-5 max-w-3xl text-lg leading-8 text-[#30445e] sm:text-xl sm:leading-9">{journey.term2Body}</p><div className="mt-9 grid items-stretch gap-7 lg:grid-cols-[1.35fr_0.65fr]"><div className="rounded-2xl bg-[#fffdf6] p-8 shadow-[0_12px_24px_rgba(7,22,41,0.1)]"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a6810]">Tutor note · {journey.term2NoteWeek}</p><blockquote className="mt-10 font-serif text-3xl italic leading-[1.3] text-[#4a3c0d] sm:text-4xl">&ldquo;{journey.term2Note}&rdquo;</blockquote><p className="mt-10 font-serif text-xl text-[#6b5510]">{journey.term2NoteAuthor}</p></div><div className="rounded-2xl bg-[#173552] p-8 text-white"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#e4c76c]">What changed</p><dl className="mt-7 space-y-7">{journey.term2Signals.map((signal) => <div key={signal.label}><dt className="font-serif text-2xl leading-tight text-[#e4c76c]">{signal.label}</dt><dd className="mt-2 text-base leading-7 text-white/85">{signal.detail}</dd></div>)}</dl></div></div></section>
            <section className="relative mt-16"><PathMarker value="III" /><p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">The momentum</p><h3 className="mt-3 max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[#071629] sm:text-5xl">{journey.term3Heading}</h3><p className="mt-5 max-w-3xl text-lg leading-8 text-[#30445e] sm:text-xl sm:leading-9">{journey.term3Body}</p><div className="mt-9 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]"><div className="space-y-6"><figure className="overflow-hidden rounded-2xl shadow-[0_12px_24px_rgba(7,22,41,0.1)]"><img src={journey.term3Image} alt={journey.term3ImageAlt} className="h-72 w-full object-cover" loading="lazy" /></figure><blockquote className="rounded-2xl bg-[#173552] p-7 text-white"><p className="font-serif text-2xl italic leading-relaxed">&ldquo;{journey.term3Quote}&rdquo;</p><footer className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-[#e4c76c]">{journey.term3QuoteAuthor}</footer></blockquote></div><div className="grid gap-4 sm:grid-cols-2 lg:content-center">{GAINS.map(([title, body]) => <article key={title} className="rounded-2xl bg-[#f2ead5] p-6"><h4 className="font-serif text-2xl leading-tight text-[#071629]">{title}</h4><p className="mt-3 text-base leading-7 text-[#30445e]">{body}</p></article>)}</div></div></section>
            <section className="relative mt-16"><PathMarker value="IV" filled /><p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">In their own words</p><h3 className="mt-3 max-w-5xl font-serif text-4xl font-medium italic leading-[1.08] tracking-[-0.03em] text-[#071629] sm:text-5xl">&ldquo;{journey.term4Quote}&rdquo;</h3><div className="mt-9 overflow-hidden rounded-2xl bg-[#102b47] p-4 text-white sm:p-7 lg:max-w-5xl">{story ? <video controls poster={story.poster} className="aspect-video w-full rounded-xl" aria-label={`${story.student}, student story`}><source src={story.src} />Your browser does not support the video tag.</video> : <div className="flex aspect-video flex-col items-center justify-center px-6 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e4c76c] text-[#e4c76c]"><Play className="ml-0.5 h-5 w-5" fill="currentColor" /></span><p className="mt-5 font-serif text-2xl">Student stories on film, coming soon.</p></div>}<p className="px-1 pt-5 font-serif text-2xl text-white">{story?.student ?? 'A DA student'}</p></div></section>
          </motion.div> : <div className="mt-12 rounded-2xl bg-[#f2ead5] px-7 py-12 text-center"><p className="font-serif text-3xl text-[#071629]">Answer the three questions above to begin with a pathway.</p></div>}</AnimatePresence>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#071629] px-5 py-16 text-center text-white sm:py-20 lg:px-8"><div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(201,162,39,0.12),transparent_70%)]" /><div className="relative mx-auto max-w-3xl"><h2 className="font-serif text-4xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-5xl">Every story starts with <em className="text-[#e4c76c]">one conversation.</em></h2><p className="mt-6 text-lg leading-8 text-[#d4dce5]">Bring your questions, concerns and hopes for your child. We will listen first, then help you decide whether DA feels like the right fit.</p><Link to="/book-interview" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-8 py-4 text-sm font-black text-[#071629] transition-colors hover:bg-[#e0bd4b]">Book a conversation <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
    <FooterNew />
  </>;
}
