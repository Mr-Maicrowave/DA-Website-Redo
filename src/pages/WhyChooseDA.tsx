import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Heart, Play } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';
import SubjectHero from '@/components/subjects/SubjectHero';
import {
  hasStoryVideo,
  journeys,
  startingPoints,
  studentStories,
  type JourneyArtifact,
  type StartingPoint,
} from '@/data/why-da';

/**
 * The DA Difference, told as chapters of a year.
 *
 * The page is one school year told through the eyes of the child the parent
 * recognises. The sticky selector rewrites the four term chapters; the weekly
 * rhythm is its own standalone section (it is true for every child, so it sits
 * outside the per-child story); the student-film slot is the Term 4 payoff; and
 * the proof wall closes by widening out to twenty years of the same story.
 */

const WEEKLY_RHYTHM = [
  {
    moment: 'Arrive',
    title: 'Walk into a familiar room.',
    body: 'The welcome is real. Faces are familiar, names are remembered, and students settle before the work begins.',
    image: '/images/difference/rhythm-arrive.jpg',
    alt: 'Students smiling together at the start of a DA lesson',
  },
  {
    moment: 'Feel known',
    title: 'Be seen as a whole person.',
    body: 'Tutors notice confidence as well as content, and understand the goals and pressures a student carries in from school.',
    image: '/images/difference/rhythm-feel-known.jpg',
    alt: 'A DA tutor sharing a warm moment with a young student',
  },
  {
    moment: 'Be challenged',
    title: 'Do work worth being proud of.',
    body: 'Thoughtful teaching gives students enough support to start, and enough room to think for themselves.',
    image: '/images/difference/rhythm-be-challenged.jpg',
    alt: 'A student working with focus on a problem at DA',
  },
  {
    moment: 'Grow',
    title: 'Notice what they can now do.',
    body: 'A clearer method, a raised hand, a better question. Progress becomes visible in how students carry themselves.',
    image: '/images/difference/rhythm-grow.jpg',
    alt: 'Two DA students smiling over their work together',
  },
  {
    moment: 'Belong',
    title: 'Leave with more than a finished worksheet.',
    body: 'They leave with direction, encouragement and a community that expects good things from them.',
    image: '/images/difference/rhythm-belong.jpg',
    alt: 'DA students sharing a laptop and a laugh between tasks',
  },
] as const;

const STUDENT_GAINS = [
  { title: 'A voice of their own', body: 'They learn to ask a question, explain a method and contribute when an idea is still taking shape.', tone: 'bg-white shadow-[0_8px_20px_rgba(7,22,41,0.06)]' },
  { title: 'Habits that travel', body: 'Preparation, follow-through and a calmer way to approach difficult work become how they learn everywhere.', tone: 'bg-[#e4d39e]' },
  { title: 'The courage to persist', body: 'Challenge stops being a verdict on their ability. It becomes where capability is built.', tone: 'bg-[#dfe8e1]' },
  { title: 'People in their corner', body: 'Friendships and trusted tutors make it easier to take healthy risks and recover from setbacks.', tone: 'bg-white shadow-[0_8px_20px_rgba(7,22,41,0.06)]' },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/**
 * The Term 1 artifact, rendered as real HTML rather than an image so the text
 * stays at a readable size, reflows on small screens and can be selected.
 */
function ArtifactCard({ artifact }: { artifact: JourneyArtifact }) {
  const maxMarks = artifact.kind === 'analysis' ? Math.max(...artifact.rows.map((row) => row.marks)) : 0;

  return (
    <figure className="relative flex flex-col overflow-hidden rounded-2xl bg-[#fffaf0] shadow-[0_12px_28px_rgba(7,22,41,0.08)]">
      <div aria-hidden="true" className="absolute -right-20 -top-20 h-44 w-44 rounded-full border-[14px] border-[#e4c76c]/20" />
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-[#c9a227]/35" />
      <p className="relative border-b border-[#e2d3ab] bg-[#f4e7c7] px-7 py-5 text-xs font-black uppercase tracking-[0.16em] text-[#8a6810] sm:px-8">
        <span className="border-b-2 border-[#c9a227] pb-1.5">{artifact.label}</span>
      </p>

      <div className="relative px-7 py-8 sm:px-8 sm:py-10">
        {artifact.kind === 'observation' ? (
          <ul className="space-y-5">
            {artifact.items.map((item) => (
              <li key={item} className="flex gap-4">
                <Check aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-[#c9a227]" strokeWidth={2.5} />
                <span className="font-serif text-xl leading-8 text-[#1c2b45]">{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {artifact.kind === 'analysis' ? (
          <dl className="space-y-7">
            {artifact.rows.map((row, index) => {
              const isLargest = row.marks === maxMarks;
              return (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-serif text-xl text-[#1c2b45]">{row.label}</dt>
                    <dd className={`text-lg font-black tabular-nums ${isLargest ? 'text-[#8a6810]' : 'text-[#52657b]'}`}>
                      {row.marks} marks
                    </dd>
                  </div>
                  <div className="mt-3 h-3.5 overflow-hidden rounded-full bg-[#f1eee4]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.round((row.marks / maxMarks) * 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${isLargest ? 'bg-[#c9a227]' : 'bg-[#dfe8e1]'}`}
                    />
                  </div>
                </div>
              );
            })}
          </dl>
        ) : null}

        {artifact.kind === 'plan' ? (
          <ol className="space-y-6">
            {artifact.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#c9a227] font-serif text-base ${
                    index === artifact.steps.length - 1 ? 'bg-[#c9a227] text-[#071629]' : 'bg-[#faf6ea] text-[#a88314]'
                  }`}
                >
                  {index + 1}
                </span>
                <span>
                  <span className="block font-serif text-xl leading-8 text-[#1c2b45]">{step.title}</span>
                  <span className="mt-1 block text-base font-bold text-[#6f849a]">{step.timing}</span>
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <figcaption className="relative border-t border-[#e2d3ab] bg-[#f7edcf] px-7 py-6 sm:px-8">
        <p className="font-serif text-xl italic leading-8 text-[#4a3c0d]">
          {artifact.kind === 'observation' ? (
            <>
              <span className="mb-1 block text-xs font-black uppercase not-italic tracking-[0.16em] text-[#a88314]">
                {artifact.footerLabel}
              </span>
              {artifact.footerLine}
            </>
          ) : (
            artifact.footerLine
          )}
        </p>
      </figcaption>
    </figure>
  );
}

/** A tutor's handwritten note, styled as a notepad page. Text differs per journey. */
function TutorNote({ note, week, author }: { note: string; week: string; author: string }) {
  return (
    <figure className="flex h-full min-h-[25rem] -rotate-1 flex-col overflow-hidden rounded-2xl bg-[#fffdf6] shadow-[0_16px_34px_rgba(7,22,41,0.16)] sm:min-h-[29rem]">
      <div className="flex items-center gap-2 bg-[#e7dcc0] px-8 py-5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#c9a227]/60" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#c9a227]/60" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#c9a227]/60" />
        <p className="ml-2 text-xs font-black uppercase tracking-[0.18em] text-[#8a6810]">Tutor note</p>
      </div>
      <blockquote className="flex flex-1 items-center px-8 py-12 sm:px-10 sm:py-14">
        <p className="font-serif text-3xl italic leading-[1.3] text-[#4a3c0d] sm:text-4xl lg:text-[2.8rem]">&ldquo;{note}&rdquo;</p>
      </blockquote>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-[#efe6cc] px-8 py-6 sm:px-10">
        <span className="font-serif text-xl text-[#6b5510]">{author}</span>
        <span className="text-sm font-black uppercase tracking-[0.16em] text-[#a88314]">{week}</span>
      </figcaption>
    </figure>
  );
}

function ChapterMarker({ numeral, filled = false }: { numeral: string; filled?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-0 top-1 hidden h-9 w-9 items-center justify-center rounded-full border-2 border-[#c9a227] font-serif text-sm lg:flex ${
        filled ? 'bg-[#c9a227] text-[#071629]' : 'bg-[#fbf8ef] text-[#a88314]'
      }`}
    >
      {numeral}
    </span>
  );
}

export default function WhyChooseDA() {
  const [selectedId, setSelectedId] = useState<StartingPoint['id']>(startingPoints[0].id);
  const journey = journeys[selectedId];

  const journeyStories = studentStories.filter((story) => story.journeyId === selectedId);
  const playableStories = journeyStories.filter(hasStoryVideo);
  const [activeStoryId, setActiveStoryId] = useState(playableStories[0]?.id);
  const activeStory = playableStories.find((story) => story.id === activeStoryId) ?? playableStories[0];

  return (
    <>
      <SEO
        title="The DA Difference | One School Year, Told Through Your Child's Eyes"
        description="Choose the student who sounds most like yours and follow their year at DA Tuition, from the first week to their own words on film. Small groups, tutors who notice, confidence that lasts."
        canonicalUrl="/why-choose-da"
      />
      <NavigationNew />

      <main className="overflow-hidden bg-[#fbf8ef]">
        <SubjectHero
          eyebrow="The DA Difference"
          icon={Heart}
          headlineWhite="One school year."
          headlineGold="Told through your child's eyes."
          subtext="Choose the student who sounds most like yours. This page becomes their story, term by term, all the way to their own words on film."
          proofPills={['Small-group learning', 'Tutors who know them', 'Confidence that lasts']}
          exploreTargetId="their-year"
          placeholderLabel="DA Tuition classroom community"
          backgroundImageSrc="/images/difference/difference-hero-enhanced.png"
          backgroundImageAlt="A DA Tuition class with students raising their hands"
          mobileBackgroundPosition="62% center"
        />

        {/* STICKY CHILD SELECTOR */}
        <div
          id="their-year"
          className="sticky top-14 z-30 scroll-mt-20 border-y-2 border-[#c9a227]/45 bg-[#eee3c8]/95 px-5 py-5 shadow-[0_6px_18px_rgba(7,22,41,0.06)] backdrop-blur-sm sm:py-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl lg:flex lg:items-center lg:gap-10">
            <div className="shrink-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a88314]">Choose a starting point</p>
              <p className="mt-1.5 font-serif text-xl leading-tight text-[#071629] sm:text-2xl">Which one sounds like yours?</p>
            </div>

            <div
              className="mt-4 grid gap-2.5 sm:grid-cols-3 lg:mt-0 lg:flex-1"
              role="group"
              aria-label="Choose the student this story follows"
            >
              {startingPoints.map((point) => {
                const isSelected = point.id === selectedId;
                return (
                  <button
                    key={point.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(point.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl px-5 py-4 text-left text-base font-bold leading-6 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a88314] ${
                      isSelected
                        ? 'bg-[#173552] text-white shadow-[0_8px_18px_rgba(7,22,41,0.22)]'
                        : 'bg-white/85 text-[#19324d] hover:bg-white hover:shadow-[0_6px_14px_rgba(7,22,41,0.1)]'
                    }`}
                  >
                    <span>{journeys[point.id].selectorLabel}</span>
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected ? 'border-[#e4c76c] bg-[#e4c76c] text-[#173552]' : 'border-[#c9a227]/45 text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* THE YEAR: chapters connected by the gold thread */}
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div aria-hidden="true" className="absolute bottom-16 left-[calc(1.25rem+17px)] top-16 hidden w-0.5 bg-gradient-to-b from-transparent via-[#c9a227] to-transparent lg:left-[calc(2rem+17px)] lg:block" />

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {/* TERM 1 */}
              <section aria-label="Term one" className="relative lg:pl-16">
                <ChapterMarker numeral="I" />
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">Term 1 · Arrive</p>
                <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-tight tracking-[-0.02em] text-[#071629] sm:text-4xl">{journey.term1Heading}</h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[#30445e]">{journey.term1Body}</p>
                <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                  <figure className="flex flex-col overflow-hidden rounded-2xl shadow-[0_12px_28px_rgba(7,22,41,0.08)]">
                    <img src={journey.term1Image} alt={journey.term1ImageAlt} className="h-72 w-full flex-1 object-cover brightness-[1.04] contrast-[1.02] saturate-[1.03] sm:h-auto" />
                  </figure>
                  <div className="flex flex-col gap-4">
                    <ArtifactCard artifact={journey.term1Artifact} />
                    <p className="text-[15px] leading-7 text-[#40536a]">{journey.term1ArtifactCaption}</p>
                  </div>
                </div>
              </section>

              {/* TERM 2 */}
              <section aria-label="Term two" className="relative mt-16 lg:pl-16">
                <ChapterMarker numeral="II" />
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">Term 2 · The turn</p>
                <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-tight tracking-[-0.02em] text-[#071629] sm:text-4xl">{journey.term2Heading}</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-[#30445e]">{journey.term2Body}</p>
                <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                  <TutorNote note={journey.term2Note} week={journey.term2NoteWeek} author={journey.term2NoteAuthor} />

                  <div className="rounded-2xl bg-[#173552] p-7 text-white sm:p-8">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e4c76c]">What changed this term</p>
                    <dl className="mt-6 space-y-6">
                      {journey.term2Signals.map((signal) => (
                        <div key={signal.label} className="border-l-2 border-[#c9a227]/60 pl-5">
                          <dt className="font-serif text-xl leading-tight text-[#e4c76c]">{signal.label}</dt>
                          <dd className="mt-2 text-[15px] leading-7 text-white/80">{signal.detail}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </section>

              {/* TERM 3 */}
              <section aria-label="Term three" className="relative mt-16 lg:pl-16">
                <ChapterMarker numeral="III" />
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">Term 3 · Momentum</p>
                <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-tight tracking-[-0.02em] text-[#071629] sm:text-4xl">{journey.term3Heading}</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-[#30445e]">{journey.term3Body}</p>
                <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
                  <div className="flex flex-col gap-5">
                    <figure className="overflow-hidden rounded-2xl shadow-[0_12px_28px_rgba(7,22,41,0.08)]">
                      <img src={journey.term3Image} alt={journey.term3ImageAlt} className="h-64 w-full object-cover brightness-[1.04] contrast-[1.02] saturate-[1.03]" loading="lazy" />
                    </figure>
                    <blockquote className="rounded-2xl bg-[#173552] p-6 text-white">
                      <p className="font-serif text-lg italic leading-relaxed">&ldquo;{journey.term3Quote}&rdquo;</p>
                      <footer className="mt-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#e4c76c]">{journey.term3QuoteAuthor}</footer>
                    </blockquote>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:content-center">
                    {STUDENT_GAINS.map((gain) => (
                      <article key={gain.title} className={`rounded-2xl p-5 ${gain.tone}`}>
                        <h3 className="font-serif text-xl leading-tight text-[#071629]">{gain.title}</h3>
                        <p className="mt-2.5 text-sm leading-6 text-[#30445e]">{gain.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              {/* TERM 4: the film */}
              <section aria-label="Term four" className="relative mt-16 lg:pl-16">
                <ChapterMarker numeral="IV" filled />
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">Term 4 · In their own words</p>
                <h2 className="mt-3 max-w-5xl font-serif text-3xl font-medium italic leading-tight tracking-[-0.02em] text-[#071629] [text-wrap:balance] sm:text-4xl lg:text-5xl">&ldquo;{journey.term4Quote}&rdquo;</h2>

                <div className="mt-8 rounded-3xl bg-[#102b47] p-5 text-white sm:p-7 lg:max-w-4xl">
                  <div className="overflow-hidden rounded-2xl bg-[#173a5a]">
                    {activeStory ? (
                      <video key={activeStory.id} controls poster={activeStory.poster} className="aspect-video w-full" aria-label={`${activeStory.student}, student story`}>
                        <source src={activeStory.src} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex aspect-video flex-col items-center justify-center px-6 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e4c76c] text-[#e4c76c]" aria-hidden="true">
                          <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                        </span>
                        <p className="mt-5 font-serif text-xl text-white sm:text-2xl">Student stories on film, coming soon.</p>
                        <p className="mt-3 max-w-md text-sm leading-6 text-[#c5cfdb]">The end of the year, in the students&apos; own words. Films appear here as they are ready.</p>
                      </div>
                    )}
                  </div>

                  <ul className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Student stories">
                    {journeyStories.map((story) => {
                      const playable = hasStoryVideo(story);
                      const isActive = activeStory?.id === story.id;
                      return (
                        <li key={story.id}>
                          <button
                            type="button"
                            disabled={!playable}
                            aria-pressed={isActive}
                            onClick={() => setActiveStoryId(story.id)}
                            className={`w-full rounded-xl p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e4c76c] ${
                              isActive ? 'bg-[#e4c76c] text-[#071629]' : playable ? 'bg-[#173a5a] text-white hover:bg-[#1d456a]' : 'cursor-default bg-white/[0.04] text-[#8fa1b5]'
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${isActive ? 'border-[#071629]/40' : playable ? 'border-[#e4c76c] text-[#e4c76c]' : 'border-white/20 text-white/30'}`}>
                                <Play className="ml-0.5 h-3 w-3" fill="currentColor" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate font-serif text-base leading-5">{story.student}</span>
                                <span className={`block text-[11px] font-bold uppercase tracking-wide ${isActive ? 'text-[#071629]/70' : playable ? 'text-[#8fa1b5]' : 'text-white/30'}`}>
                                  {playable ? story.detail : 'Coming soon'}
                                </span>
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* WEEKLY RHYTHM: its own section, true for every child */}
        <section className="bg-[#f5efdd] px-5 py-20 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">Life at DA</p>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[#071629] [text-wrap:balance] sm:text-5xl">
                Whichever student they are, the week looks like this.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#30445e]">
                Five moments, every week, all year. It is the rhythm underneath every story on this page.
              </p>
            </motion.div>

            <ol className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {WEEKLY_RHYTHM.map((step, index) => (
                <motion.li
                  key={step.moment}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  className="group"
                >
                  <figure className="overflow-hidden rounded-2xl bg-[#dce2df] shadow-[0_12px_26px_rgba(7,22,41,0.1)]">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="h-64 w-full object-cover brightness-[1.04] contrast-[1.02] saturate-[1.03] transition-transform duration-500 motion-safe:group-hover:scale-105 sm:h-72"
                      loading="lazy"
                    />
                  </figure>
                  <div className="mt-6">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a88314]">{index + 1} · {step.moment}</p>
                    <h3 className="mt-2.5 font-serif text-2xl leading-tight text-[#071629]">{step.title}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-[#40536a]">{step.body}</p>
                  </div>
                </motion.li>
              ))}

              <motion.li initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} className="sm:col-span-2 lg:col-span-1">
                <figure className="overflow-hidden rounded-2xl border border-[#c9a227]/35 bg-[#fbf8ef]">
                  <img src="/images/difference/five-chairs.svg" alt="A diagram of one DA table seating four students with a fifth seat left empty" className="h-64 w-full object-contain p-4 sm:h-72" loading="lazy" />
                </figure>
                <div className="mt-6">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a88314]">Why it works</p>
                  <h3 className="mt-2.5 font-serif text-2xl leading-tight text-[#071629]">Three to five students. Never more.</h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#40536a]">Small enough that noticing is not a promise. It is unavoidable. The quiet student speaks in a room of four.</p>
                </div>
              </motion.li>
            </ol>
          </div>
        </section>

        {/* THE WALL */}
        <section className="bg-[#f8f7f3] px-5 py-20 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#a88314]">And this year has happened hundreds of times</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[#071629] [text-wrap:balance] sm:text-5xl">
                Twenty years of these stories, pinned in one place.
              </h2>
              <p className="mt-3 text-sm italic text-[#a88314]">Photos, quotes and tutor notes, all real, all DA families.</p>
            </motion.div>

            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              <blockquote className="relative col-span-2 -rotate-1 rounded-2xl bg-[#173552] p-7 text-white shadow-[0_14px_30px_rgba(7,22,41,0.18)]">
                <span aria-hidden="true" className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#c9a227] shadow" />
                <p className="font-serif text-xl leading-relaxed sm:text-2xl">&ldquo;DA has created an inviting and comfortable environment that makes you look forward to learning.&rdquo;</p>
                <footer className="mt-6 text-xs font-black uppercase tracking-wide text-[#e4c76c]">Ellie Dang · 8 years at DA</footer>
              </blockquote>

              <figure className="relative rotate-1 overflow-hidden rounded-2xl shadow-[0_12px_24px_rgba(7,22,41,0.12)]">
                <span aria-hidden="true" className="absolute -top-1.5 left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#c9a227] shadow" />
                <img src="/images/difference/wall-together-sign.jpg" alt="A wall display at DA Tuition reading Together We Make A Difference" className="h-56 w-full object-cover brightness-[1.04] contrast-[1.02] saturate-[1.03] sm:h-64" loading="lazy" />
              </figure>

              <figure className="relative -rotate-1 overflow-hidden rounded-2xl shadow-[0_12px_24px_rgba(7,22,41,0.12)]">
                <span aria-hidden="true" className="absolute -top-1.5 left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#c9a227] shadow" />
                <img src="/images/difference/wall-whiteboard-teacher.jpg" alt="A DA teacher smiling mid-lesson at the whiteboard" className="h-56 w-full object-cover brightness-[1.04] contrast-[1.02] saturate-[1.03] sm:h-64" loading="lazy" />
              </figure>

              <figure className="relative rotate-1 overflow-hidden rounded-2xl bg-[#fffdf6] shadow-[0_12px_24px_rgba(7,22,41,0.12)]">
                <span aria-hidden="true" className="absolute -top-1.5 left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#c9a227] shadow" />
                <img src="/images/difference/wall-tutor-note.svg" alt="A pinned tutor note from Mr Phillip about a student who has stopped rushing question three" className="h-56 w-full object-cover sm:h-64" loading="lazy" />
              </figure>

              <figure className="relative -rotate-1 overflow-hidden rounded-2xl bg-white p-3 shadow-[0_12px_24px_rgba(7,22,41,0.12)]">
                <span aria-hidden="true" className="absolute -top-1.5 left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#c9a227] shadow" />
                <img src="/images/difference/marked-paper.svg" alt="A practice paper marked by a DA tutor, with a circled working step and a margin note" className="h-52 w-full object-contain sm:h-[14.5rem]" loading="lazy" />
              </figure>

              <blockquote className="relative rotate-1 rounded-2xl bg-white p-6 shadow-[0_10px_22px_rgba(7,22,41,0.08)]">
                <span aria-hidden="true" className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#c9a227] shadow" />
                <p className="font-serif text-lg leading-relaxed text-[#19324d]">&ldquo;He had both a calm and encouraging attitude that made me feel very comfortable.&rdquo;</p>
                <footer className="mt-4 text-[11px] font-black uppercase tracking-wide text-[#a88314]">Emma Thomas · Mathematics</footer>
              </blockquote>

              <figure className="relative -rotate-1 overflow-hidden rounded-2xl shadow-[0_12px_24px_rgba(7,22,41,0.12)]">
                <span aria-hidden="true" className="absolute -top-1.5 left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#c9a227] shadow" />
                <img src="/images/difference/wall-laptop-smiles.jpg" alt="A DA tutor and student smiling together at a laptop" className="h-56 w-full object-cover brightness-[1.04] contrast-[1.02] saturate-[1.03] sm:h-64" loading="lazy" />
              </figure>

              <blockquote className="relative rotate-1 rounded-2xl bg-white p-6 shadow-[0_10px_22px_rgba(7,22,41,0.08)]">
                <span aria-hidden="true" className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#c9a227] shadow" />
                <p className="font-serif text-lg leading-relaxed text-[#19324d]">&ldquo;They allowed me to believe that hard work trumps all.&rdquo;</p>
                <footer className="mt-4 text-[11px] font-black uppercase tracking-wide text-[#a88314]">Anna Pham · Year 12</footer>
              </blockquote>

              <div className="col-span-2 flex min-h-[9rem] items-center justify-center rounded-2xl border-2 border-dashed border-[#c9a227] bg-[#fbf8ef]">
                <p className="-rotate-2 font-serif text-xl italic text-[#a88314]">your child&apos;s story goes here</p>
              </div>
            </div>

            <div className="mt-10 text-right">
              <Link to="/success-stories" className="inline-flex items-center gap-2 border-b border-[#a88314] pb-2 text-sm font-black text-[#a88314] transition-colors hover:text-[#071629]">
                Read more written stories <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#071629] px-5 py-20 text-center text-white sm:py-24 lg:px-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(201,162,39,0.12),transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="font-serif text-4xl font-medium leading-[1.1] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
              Every one of these years started with <em className="text-[#e4c76c]">one conversation.</em>
            </h2>
            <p className="mt-6 text-base leading-8 text-[#d4dce5] sm:text-lg">
              Bring your questions, concerns and hopes for your child. We will listen first, share how DA works, and help you decide whether it feels like the right fit. No pressure.
            </p>
            <Link to="/book-interview" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-8 py-4 text-sm font-black text-[#071629] transition-colors hover:bg-[#e0bd4b]">
              Book a conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <FooterNew />
    </>
  );
}
