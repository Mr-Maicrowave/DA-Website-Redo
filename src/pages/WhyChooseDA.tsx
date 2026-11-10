import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';
import SubjectHero from '@/components/subjects/SubjectHero';
import { siteStats } from '@/data/site-stats';

const TEACHING_STEPS = [
  {
    number: '01',
    title: 'We notice what is really getting in the way.',
    body: 'A wrong answer can come from a missing foundation, a rushed method, or a student who no longer trusts their own thinking. Our tutors look beyond the mark to understand the cause.',
  },
  {
    number: '02',
    title: 'We explain until understanding feels secure.',
    body: 'Students are never expected to pretend they understand. Tutors slow down, change the explanation, model the thinking, and welcome questions until the idea genuinely clicks.',
  },
  {
    number: '03',
    title: 'We practise with purpose.',
    body: 'Lessons move from guided examples to independent application. Students learn how to approach unfamiliar questions, check their reasoning, and use feedback immediately.',
  },
  {
    number: '04',
    title: 'We plan the next step around the student.',
    body: 'Tutors remember what each student is working towards and where support is still needed. The next lesson builds deliberately on the last, so progress never feels accidental.',
  },
] as const;

const STUDENT_PROGRESSION = [
  {
    title: 'They ask the question.',
    body: 'The fear of being wrong begins to ease, and uncertainty becomes something they can talk about.',
  },
  {
    title: 'They join the thinking.',
    body: 'Instead of waiting for an answer, they explain ideas, test methods, and learn from the group.',
  },
  {
    title: 'They recognise the pattern.',
    body: 'Clear teaching and repeated practice help them connect concepts and approach work with a plan.',
  },
  {
    title: 'They take ownership.',
    body: 'Confidence becomes independence: better habits, stronger judgment, and the willingness to keep going.',
  },
] as const;

const LESSON_FLOW = [
  {
    step: 'Arrive',
    title: 'A genuine check-in',
    body: 'Tutors greet students by name and understand what happened at school that week before the lesson begins.',
  },
  {
    step: 'Understand',
    title: 'Clear teaching and modelling',
    body: 'New ideas are broken down carefully, connected to prior learning, and demonstrated in a way the student can follow.',
  },
  {
    step: 'Apply',
    title: 'Supported, active practice',
    body: 'Students attempt the work themselves while a tutor stays close enough to question, prompt, and correct misconceptions early.',
  },
  {
    step: 'Leave',
    title: 'A clear next step',
    body: 'The session ends with students knowing what improved, what still needs attention, and what they can do next.',
  },
] as const;

export default function WhyChooseDA() {
  return (
    <>
      <SEO
        title="The DA Difference | Teaching, Belonging and Confidence"
        description="Discover how DA Tuition combines careful small-group teaching, genuine tutor relationships and a welcoming environment to help students grow in confidence and results."
        canonicalUrl="/why-choose-da"
      />
      <NavigationNew />

      <main className="overflow-hidden bg-[#f8f7f3]">
        <SubjectHero
          eyebrow="The DA Difference"
          icon={Heart}
          headlineWhite="More than tutoring."
          headlineGold="A place they belong."
          subtext="Students learn best when they feel known, supported and capable. At DA, thoughtful teaching and a genuinely welcoming environment work together to build confidence that reaches far beyond the classroom."
          proofPills={['Small-group learning', 'Tutors who know them', 'Confidence that lasts']}
          exploreTargetId="why-students-thrive"
          placeholderLabel="DA Tuition classroom community"
          backgroundImageSrc="/images/community/class_hands_raised.jpg"
          backgroundImageAlt="DA Tuition students learning together in class"
          mobileBackgroundPosition="58% center"
        />

        <section id="why-students-thrive" className="bg-[#f7f3e8] px-5 py-24 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div className="lg:sticky lg:top-28">
                <p className="max-w-md text-sm font-black uppercase tracking-[0.14em] text-[#a88314]">
                  Why students thrive here
                </p>
                <h2 className="mt-5 max-w-xl font-serif text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-[#071629] [text-wrap:balance] sm:text-6xl">
                  Care and high expectations belong together.
                </h2>
              </div>

              <div>
                <p className="max-w-2xl text-xl leading-9 text-[#263a55] [text-wrap:pretty] sm:text-2xl sm:leading-10">
                  A student who feels judged protects themselves. A student who feels known is willing to try, ask and keep going.
                </p>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#4a5d76] [text-wrap:pretty]">
                  That sense of safety is not the opposite of academic rigour. It is what makes rigour possible. DA tutors build trusting relationships so they can challenge students honestly, respond to what they need, and help them do work they once thought was beyond them.
                </p>

                <div className="mt-12 grid gap-8 border-t border-[#071629]/15 pt-10 sm:grid-cols-2">
                  <div>
                    <h3 className="font-serif text-3xl text-[#071629]">They feel known.</h3>
                    <p className="mt-4 text-[15px] leading-7 text-[#4a5d76]">
                      Tutors know their confidence, habits, school context and goalsâ€”not only the topic written on the board.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl text-[#071629]">They are taught deliberately.</h3>
                    <p className="mt-4 text-[15px] leading-7 text-[#4a5d76]">
                      Small groups let tutors observe the thinking, correct gaps early and keep every student actively involved.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <figure className="mt-16 overflow-hidden rounded-2xl lg:mt-24">
              <img
                src="/images/community/tutor_one_on_one.jpg"
                alt="A DA tutor working closely with a student during a lesson"
                className="h-[340px] w-full object-cover sm:h-[480px] lg:h-[620px]"
              />
            </figure>
          </div>
        </section>

        <section className="bg-[#10263f] px-5 py-24 text-white sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#e4c76c]">The way we teach</p>
              <h2 className="mt-5 max-w-lg font-serif text-5xl font-medium leading-[1.02] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
                Personal attention with a clear academic purpose.
              </h2>
              <p className="mt-7 max-w-lg text-base leading-8 text-[#c5cfdb] [text-wrap:pretty]">
                Personalised teaching is not giving every student different worksheets. It is knowing what to notice, what to explain, when to challenge, and when to give a student room to solve it themselves.
              </p>
              <p className="mt-8 inline-flex rounded-full bg-[#c9a227] px-5 py-2 text-sm font-black text-[#071629]">
                Small groups of {siteStats.studentsPerGroup}
              </p>
            </div>

            <ol className="border-t border-white/20">
              {TEACHING_STEPS.map((step) => (
                <li key={step.number} className="grid gap-4 border-b border-white/20 py-8 sm:grid-cols-[4rem_1fr] sm:gap-6 lg:py-10">
                  <span className="font-serif text-2xl text-[#e4c76c]" aria-hidden="true">{step.number}</span>
                  <div>
                    <h3 className="max-w-2xl text-xl font-black leading-8 text-white sm:text-2xl">{step.title}</h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#b8c4d2]">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#f1e4b5] px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
              <h2 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-[#071629] [text-wrap:balance] sm:text-6xl">
                Confidence becomes visible in the way they learn.
              </h2>
              <p className="max-w-xl text-base leading-8 text-[#243852] lg:justify-self-end">
                The change is rarely one dramatic moment. It appears in small behaviours that build on one anotherâ€”until a student approaches school differently.
              </p>
            </div>

            <ol className="mt-14 grid border-t border-[#38506a]/25 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {STUDENT_PROGRESSION.map((stage, index) => (
                <li key={stage.title} className="border-b border-[#38506a]/25 py-8 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:last:pr-0">
                  <span className="text-sm font-black text-[#071629]/65">0{index + 1}</span>
                  <h3 className="mt-8 font-serif text-3xl leading-tight text-[#071629]">{stage.title}</h3>
                  <p className="mt-4 text-[15px] leading-7 text-[#263a55]">{stage.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#f8f9f8] px-5 py-24 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
            <figure className="relative overflow-hidden rounded-2xl">
              <img
                src="/images/community/class_induction.jpg"
                alt="DA students working through a lesson together"
                className="h-[460px] w-full object-cover sm:h-[620px]"
              />
              <figcaption className="absolute bottom-0 left-0 max-w-sm bg-[#071629] px-6 py-5 text-sm font-bold leading-6 text-white sm:px-8">
                Every part of a session has a purpose: settle, understand, apply and leave with direction.
              </figcaption>
            </figure>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a88314]">Inside a DA lesson</p>
              <h2 className="mt-5 font-serif text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-[#071629] [text-wrap:balance] sm:text-6xl">
                What thoughtful teaching looks like in practice.
              </h2>
              <ol className="mt-10 space-y-0 border-t border-[#071629]/15">
                {LESSON_FLOW.map((moment) => (
                  <li key={moment.step} className="grid gap-3 border-b border-[#071629]/15 py-6 sm:grid-cols-[6rem_1fr] sm:gap-5">
                    <span className="text-sm font-black uppercase tracking-[0.12em] text-[#a88314]">{moment.step}</span>
                    <div>
                      <h3 className="text-lg font-black text-[#071629]">{moment.title}</h3>
                      <p className="mt-2 text-[15px] leading-7 text-[#4a5d76]">{moment.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-[#10263f] px-5 py-24 text-white sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-7 border-b border-white/20 pb-12 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#e4c76c]">In their own words</p>
                <h2 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.02] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
                  The difference is something students can feelâ€”and families can see.
                </h2>
              </div>
              <div className="shrink-0 text-left lg:text-right">
                <p className="text-xl tracking-[0.18em] text-[#e4c76c]" aria-label={`${siteStats.googleRating} out of 5 stars`}>â˜…â˜…â˜…â˜…â˜…</p>
                <p className="mt-2 text-sm font-bold text-[#c5cfdb]">{siteStats.googleRating} from {siteStats.reviewCount}+ Google reviews</p>
              </div>
            </div>

            <div className="grid gap-12 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:py-20">
              <blockquote>
                <p className="font-serif text-3xl leading-[1.3] text-white [text-wrap:pretty] sm:text-4xl lg:text-5xl">
                  â€œDA has created an inviting and comfortable environment that makes you look forward to learning.â€
                </p>
                <footer className="mt-7">
                  <p className="font-black text-[#e4c76c]">Ellie Dang</p>
                  <p className="mt-1 text-sm text-[#aebbc9]">DA student for eight years</p>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-[#c5cfdb]">
                    First in English with 100% in trials, plus Band 6 results in Mathematics Advanced and Extension 1.
                  </p>
                </footer>
              </blockquote>

              <blockquote className="border-t border-white/20 pt-10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                <p className="font-serif text-2xl leading-[1.45] text-white [text-wrap:pretty] sm:text-3xl">
                  â€œHe had both a calm and encouraging attitude that made me feel very comfortable.â€
                </p>
                <footer className="mt-7">
                  <p className="font-black text-[#e4c76c]">Emma Thomas</p>
                  <p className="mt-1 text-sm text-[#aebbc9]">DA Mathematics student</p>
                  <p className="mt-4 text-sm leading-7 text-[#c5cfdb]">
                    Progressed from the low 70s to the 90s and finished Year 12 ranked first.
                  </p>
                </footer>
              </blockquote>
            </div>

            <Link to="/success-stories" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-black text-white transition-colors hover:border-[#e0bd4b] hover:text-[#e0bd4b]">
              Read more student stories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="bg-[#f7f3e8] px-5 py-24 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <h2 className="font-serif text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-[#071629] [text-wrap:balance] sm:text-6xl">
                  A place they want to return to.
                </h2>
                <p className="mt-7 max-w-lg text-base leading-8 text-[#4a5d76] [text-wrap:pretty]">
                  The atmosphere at DA is created intentionally: calm rooms, familiar faces, tutors who collaborate, and a community where effort is noticed. Students can focus because they do not have to wonder whether they belong.
                </p>
              </div>
              <p className="max-w-lg border-t border-[#071629]/15 pt-6 font-serif text-2xl leading-9 text-[#263a55] lg:justify-self-end">
                The welcome matters. The friendships matter. The quiet confidence to put your hand up matters. They all become part of the learning.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-[1.35fr_0.65fr]">
              <figure className="overflow-hidden rounded-2xl sm:row-span-2">
                <img
                  src="/images/community/teacher_kids_warmth.jpg"
                  alt="A DA tutor sharing a warm moment with students"
                  className="h-[420px] w-full object-cover sm:h-full sm:min-h-[640px]"
                />
              </figure>
              <figure className="overflow-hidden rounded-2xl">
                <img
                  src="/images/community/teen_friends.jpg"
                  alt="DA students spending time together between lessons"
                  className="h-72 w-full object-cover sm:h-80"
                />
              </figure>
              <figure className="overflow-hidden rounded-2xl">
                <img
                  src="/images/community/da_team.jpg"
                  alt="The DA Tuition teaching team"
                  className="h-72 w-full object-cover sm:h-80"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden">
          <img
            src="/images/community/primary_colorful_class.jpg"
            alt="Students learning together at DA Tuition"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(16,38,63,0.86)]" />
          <div className="relative mx-auto flex min-h-[620px] max-w-4xl flex-col items-center justify-center px-5 py-24 text-center text-white lg:min-h-[700px]">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#e4c76c]">See the difference in person</p>
            <h2 className="mt-6 font-serif text-5xl font-medium leading-[1.02] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl lg:text-7xl">
              Meet the people who could change how your child feels about learning.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#d4dce5] sm:text-lg">
              Tell us where your child is now, what you hope will change, and what support they need. We will help you understand the right next step.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link to="/book-interview" className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-8 py-4 text-sm font-black text-[#071629] transition-colors hover:bg-[#e0bd4b]">
                Book a consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/find-teacher" className="inline-flex items-center rounded-full border border-white/45 px-8 py-4 text-sm font-black text-white transition-colors hover:border-white hover:bg-white hover:text-[#071629]">
                Meet our tutors
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterNew />
    </>
  );
}

