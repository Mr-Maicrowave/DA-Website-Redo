import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Heart, Sparkles, Star } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';

// ─── Design tokens ──────────────────────────────────────────────────────────
const FadeUp = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const NAV_SECTIONS = [
  { id: 'life-at-da',          label: 'Life at DA'          },
  { id: 'tutor-relationships', label: 'Tutor Relationships' },
  { id: 'a-day-at-da',        label: 'A Day at DA'         },
  { id: 'learning-spaces',    label: 'Learning Spaces'     },
  { id: 'celebrations',       label: 'Celebrations'        },
  { id: 'behind-the-scenes',  label: 'Behind the Scenes'   },
];

const DAY_STEPS = [
  { step: '1', title: 'Warm welcome',     body: 'Tutors greet every student by name at the door.',                    img: '/images/community/teacher_kids_warmth.jpg'       },
  { step: '2', title: 'Check-in',         body: "A quick catch-up — how was your week, how's school going?",         img: '/images/community/tutor_mentor_girls.jpg'        },
  { step: '3', title: 'Focused learning', body: 'Small-group sessions where every question gets answered.',           img: '/images/community/class_induction.jpg'       },
  { step: '4', title: 'Discussion',       body: "Students talk through ideas together — no pressure.",               img: '/images/community/student_raising_hand.jpg' },
  { step: '5', title: 'Practice',         body: "Applying what they've learned with tutor support nearby.",          img: '/images/community/student_attentive.jpg'   },
  { step: '6', title: 'Progress check',   body: 'Tutors note what clicked and what to revisit next time.',           img: '/images/community/tutor_one_on_one.jpg'    },
  { step: '7', title: 'Leave smiling',    body: 'Students walk out feeling capable — not drained.',                  img: '/images/community/class_smiling_camera.jpg'      },
];

const MOMENTS = [
  { title: 'First Day',                   body: 'Every new student is welcomed with a personal introduction and a tutor who already knows their name.',          img: '/images/community/class_smiling_camera.jpg',     icon: '👋' },
  { title: 'Milestones',                  body: 'Small wins — a concept finally clicking — are celebrated just as warmly as big ones.',                         img: '/images/community/student_raising_hand.jpg',        icon: '⭐' },
  { title: 'End-of-Term Celebrations',    body: 'We pause to celebrate effort, growth and community — because belonging matters as much as results.',           img: '/images/community/teen_friends.jpg',           icon: '🎉' },
  { title: 'Achievements',               body: 'When a student reaches a personal goal, the whole team celebrates with them — loudly and genuinely.',           img: '/images/community/tutor_young_girls.jpg',       icon: '🏆' },
];

const BEHIND = [
  { title: 'Tutor training',      img: '/images/community/class_induction.jpg'       },
  { title: 'Staff collaboration', img: '/images/community/da_team.jpg'               },
  { title: 'Community events',    img: '/images/community/teen_friends.jpg'         },
  { title: 'Parent meetings',     img: '/images/community/teacher_kids_warmth.jpg'   },
];

function StickyNav() {
  const [active, setActive] = useState('life-at-da');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-[#071629]/8 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 py-3 lg:px-8">
        {NAV_SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black tracking-[0.08em] uppercase transition-all duration-200 ${
              active === id
                ? 'bg-[#c9a227] text-[#071629]'
                : 'text-[#071629]/55 hover:text-[#071629]'
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function WhyChooseDA() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <SEO
        title="Life at DA Tuition | The DA Environment"
        description="Discover what it feels like to be part of the DA Tuition community — the relationships, the spaces, and the moments that matter."
        canonicalUrl="/why-choose-da"
      />
      <NavigationNew />

      <main className="overflow-hidden">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/community/class_hands_raised.jpg"
              alt="DA Tuition students and tutors"
              className="h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/85 to-[#071629]/35" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-28 lg:grid-cols-[1.1fr_.7fr] lg:px-8 lg:pb-32">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: 'easeOut' }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#f1df9a] backdrop-blur-md">
                <Heart className="h-3.5 w-3.5" />
                The DA Environment
              </div>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.5rem]">
                More Than A<br />Tuition Centre.<br />
                <em className="not-italic text-[#f1df9a]">A Place They Belong.</em>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/72">
                Great learning happens in an environment built on trust, encouragement and genuine care.
                Every student is known, supported and celebrated every step of the way.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/interview">
                  <button className="inline-flex h-12 items-center gap-2 rounded-full bg-[#c9a227] px-7 text-sm font-black text-[#071629] shadow-xl shadow-[#c9a227]/25 transition hover:bg-[#e0bd4b]">
                    Book an Interview
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <a href="#life-at-da">
                  <button className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15">
                    Explore Our Community
                  </button>
                </a>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.14, ease: 'easeOut' }}
              className="self-end rounded-3xl border border-white/14 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-xl"
            >
              <p className="text-[8px] font-black uppercase tracking-[0.34em] text-[#f1df9a]/70">
                What Parents Notice
              </p>
              <div className="mt-5 space-y-3">
                {[
                  'Students actually enjoy coming to class',
                  'Tutors know every student personally',
                  'Confidence grows naturally over time',
                  'Small achievements are celebrated',
                  'Genuine friendships are built here',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-white/88">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f1df9a]" />
                    <span className="text-[13px] leading-[1.65]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[12px] leading-[1.8] text-white/50">
                  The DA environment is something parents and students notice from their very first visit.
                </p>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* ── Anchor pill nav ── */}
        <section className="-mt-8 px-5 lg:px-8">
          <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap gap-2 rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10">
            {NAV_SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex-1 rounded-2xl px-3 py-3 text-center text-[11px] font-black text-[#10233f] transition hover:bg-[#f5ecd9] min-w-[100px]"
              >
                {label}
              </a>
            ))}
          </div>
        </section>

        <StickyNav />

        {/* ── SECTION 1 — Known. Supported. Valued. ── */}
        <section id="life-at-da" className="bg-[#fffdf8] px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <FadeUp>
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]">
                  Every Student Has a Place Here
                </p>
                <h2 className="font-serif text-5xl font-medium leading-[1.02] tracking-[-0.040em] text-[#071629] lg:text-6xl">
                  Known.<br />Supported.<br />Valued.
                </h2>
                <p className="mt-6 max-w-md text-[15px] leading-8 text-[#61708a]">
                  At DA, every student is genuinely known — not just as a learner, but as a person.
                  Tutors remember what makes each student tick, what they struggle with, and what
                  makes them light up. That kind of relationship changes everything.
                </p>
              </FadeUp>

              <FadeUp delay={0.18}>
                <div className="mt-10 max-w-sm rounded-2xl border border-[#c9a227]/20 bg-white p-6 shadow-xl shadow-[#071629]/6">
                  <p className="font-serif text-[17px] font-medium italic leading-7 text-[#071629]">
                    "I actually enjoy coming here. Everyone is so nice and learning feels comfortable."
                  </p>
                  <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#c9a227]">
                    — Year 9 Student
                  </p>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.1} className="overflow-hidden rounded-[28px] shadow-2xl shadow-[#071629]/15">
              <img
                src="/images/community/tutor_one_on_one.jpg"
                alt="Tutor working closely with student"
                className="h-[520px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </FadeUp>
          </div>
        </section>

        {/* ── SECTION 2 — True Mentors ── */}
        <section id="tutor-relationships" className="bg-[#071629] px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <FadeUp className="overflow-hidden rounded-[28px] shadow-2xl shadow-black/30 lg:order-first">
              <img
                src="/images/community/teacher_kids_warmth.jpg"
                alt="DA tutor with student"
                className="h-[560px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]">
                More Than Teachers
              </p>
              <h2 className="font-serif text-5xl font-medium leading-[1.02] tracking-[-0.040em] text-white lg:text-[3.25rem]">
                True Mentors.
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-8 text-white/65">
                The people who teach at DA choose to be here because they genuinely care.
                They don't just answer questions — they stay until the student understands,
                celebrate every small improvement, and make each student feel like they belong.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  { icon: <Sparkles className="h-5 w-5" />, label: 'They explain until it clicks',     body: 'No question is too small and no concept is rushed.' },
                  { icon: <Heart    className="h-5 w-5" />, label: 'They believe in every student',    body: 'Before the student believes in themselves, the tutor already does.' },
                  { icon: <Star     className="h-5 w-5" />, label: 'They celebrate every improvement', body: 'Progress is noticed and acknowledged — always.' },
                ].map(({ icon, label, body }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/15 text-[#f1df9a]">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{label}</p>
                      <p className="mt-1 text-[13px] leading-[1.7] text-white/52">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── SECTION 3 — A Day at DA ── */}
        <section id="a-day-at-da" className="bg-[#fffdf8] px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <FadeUp className="mb-14 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]">
                Inside a Session
              </p>
              <h2 className="font-serif text-5xl font-medium leading-[1.02] tracking-[-0.040em] text-[#071629]">
                A Day at DA
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-8 text-[#61708a]">
                From the moment they arrive to the moment they leave, every part of the session is
                designed to make students feel capable and cared for.
              </p>
            </FadeUp>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {DAY_STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] transition-all duration-200 ${
                    activeStep === i
                      ? 'bg-[#c9a227] text-[#071629] shadow-lg shadow-[#c9a227]/25'
                      : 'bg-[#071629]/6 text-[#071629]/55 hover:bg-[#071629]/10 hover:text-[#071629]'
                  }`}
                >
                  {s.step}. {s.title}
                </button>
              ))}
            </div>

            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="grid overflow-hidden rounded-[28px] shadow-2xl shadow-[#071629]/12 lg:grid-cols-2"
            >
              <div className="relative min-h-[320px] lg:min-h-[420px]">
                <img
                  src={DAY_STEPS[activeStep].img}
                  alt={DAY_STEPS[activeStep].title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center bg-[#071629] p-10 lg:p-14">
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.32em] text-[#c9a227]/70">
                  Step {DAY_STEPS[activeStep].step} of {DAY_STEPS.length}
                </p>
                <h3 className="font-serif text-3xl font-medium text-white lg:text-4xl">
                  {DAY_STEPS[activeStep].title}
                </h3>
                <p className="mt-4 text-[15px] leading-8 text-white/65">
                  {DAY_STEPS[activeStep].body}
                </p>
                <div className="mt-10 flex gap-2">
                  {DAY_STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeStep ? 'w-8 bg-[#c9a227]' : 'w-2 bg-white/25 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 4 — Learning Spaces ── */}
        <section id="learning-spaces" className="bg-[#071629] px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <FadeUp>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]">
                The Environment
              </p>
              <h2 className="font-serif text-5xl font-medium leading-[1.02] tracking-[-0.040em] text-white lg:text-[3.25rem]">
                Spaces Designed<br />for Focus
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-8 text-white/65">
                Every room at DA was built with learning in mind — calm, warm and welcoming.
                Students feel settled the moment they walk in, which means they can focus on what matters.
              </p>
              <Link to="/interview">
                <button className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-[#c9a227] px-7 text-sm font-black text-[#071629] shadow-xl shadow-[#c9a227]/20 transition hover:bg-[#e0bd4b]">
                  See It for Yourself
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { src: '/images/community/primary_colorful_class.jpg', alt: 'Classroom at DA' },
                  { src: '/images/community/student_typing_laptop.jpg',  alt: 'Student studying' },
                  { src: '/images/community/hallway_group.jpg',           alt: 'Students in hallway' },
                  { src: '/images/community/class_smiling_camera.jpg',   alt: 'Students smiling' },
                ].map(({ src, alt }) => (
                  <div key={alt} className="overflow-hidden rounded-2xl shadow-xl shadow-black/25">
                    <img
                      src={src}
                      alt={alt}
                      className="h-52 w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── SECTION 5 — Celebrations ── */}
        <section id="celebrations" className="bg-[#fffdf8] px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <FadeUp className="mb-14 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]">
                Community
              </p>
              <h2 className="font-serif text-5xl font-medium leading-[1.02] tracking-[-0.040em] text-[#071629]">
                The Moments That Matter
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-8 text-[#61708a]">
                It's not always the big milestones that stay with students. Often, it's the small ones — the moments that make them feel truly seen.
              </p>
            </FadeUp>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MOMENTS.map((m, i) => (
                <FadeUp key={m.title} delay={i * 0.08}>
                  <div className="group overflow-hidden rounded-[24px] bg-white shadow-xl shadow-[#071629]/8 transition hover:-translate-y-1 hover:shadow-2xl">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={m.img}
                        alt={m.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071629]/50 to-transparent" />
                      <span className="absolute bottom-4 left-4 text-2xl">{m.icon}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-medium text-[#071629]">{m.title}</h3>
                      <p className="mt-2 text-[13px] leading-[1.75] text-[#61708a]">{m.body}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 6 — Behind the Scenes ── */}
        <section id="behind-the-scenes" className="bg-[#071629] px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <FadeUp className="mb-14">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9a227]">
                Behind the Scenes
              </p>
              <h2 className="font-serif text-5xl font-medium leading-[1.02] tracking-[-0.040em] text-white">
                The work behind<br />the community.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-8 text-white/60">
                What makes DA feel the way it does doesn't happen by accident. It's the result of
                intentional effort — from tutor training to team culture to family communication.
              </p>
            </FadeUp>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {BEHIND.map((b, i) => (
                <FadeUp key={b.title} delay={i * 0.08}>
                  <div className="group overflow-hidden rounded-[24px]">
                    <div className="relative h-64 overflow-hidden rounded-[24px] shadow-xl shadow-black/30">
                      <img
                        src={b.img}
                        alt={b.title}
                        className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071629]/80 to-transparent" />
                      <p className="absolute bottom-4 left-4 right-4 text-sm font-bold text-white">{b.title}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/community/primary_colorful_class.jpg"
              alt="DA Tuition community"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#071629]/72" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 py-36 text-center lg:py-44">
            <FadeUp>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.32em] text-[#f1df9a]/70">
                Come and See
              </p>
              <h2 className="font-serif text-5xl font-medium leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl">
                Come Experience<br />It Yourself.
              </h2>
              <p className="mx-auto mt-6 max-w-md text-[15px] leading-8 text-white/65">
                The best way to understand DA is to experience one lesson with us.
                Come in, meet the team, and feel the difference for yourself.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link to="/interview">
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-8 py-3.5 text-sm font-black text-[#071629] shadow-xl shadow-[#c9a227]/25 transition hover:bg-[#e0bd4b]">
                    Book an Interview
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

      </main>

      <FooterNew />
    </>
  );
}
