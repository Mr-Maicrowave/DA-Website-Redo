import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';

const slides = [
  { quote: "My daughter started Year 1 really struggling with reading, and she didn't want to go to school because she felt so behind. After just one term at DA Tuition, the change was <strong>remarkable</strong>. She's not just reading better, she's actually excited to pick up books on her own.", name: 'Jessica M.', role: 'Mum of a Year 2 student', initial: 'J' },
  { quote: 'My son was completely disengaged from maths in Year 1. Within six weeks at DA Tuition he was asking to do <strong>maths worksheets for fun</strong>. The teachers have a gift for making numbers feel like a game.', name: 'Amanda K.', role: 'Mum of a Year 1 student', initial: 'A' },
  { quote: 'DA Tuition identified the exact gaps in the first session and within one term she was reading <strong>above her year level</strong>. Incredible progress.', name: 'Rachel T.', role: 'Mum of a Year 2 student', initial: 'R' },
  { quote: 'The small group format was exactly what our son needed. At DA Tuition he gets genuine individual attention and his <strong>confidence has absolutely soared</strong>.', name: 'Michael & Sarah P.', role: 'Parents of a Year 1 student', initial: 'M' },
];

const curriculumRows = [
  { area: 'Phonics & Decoding', badge: 'Core', what: 'Sound–letter relationships, blending, digraphs', skills: 'Reading fluency, spelling patterns' },
  { area: 'Reading Comprehension', badge: '', what: 'Understanding stories, inferencing, retelling', skills: 'Vocabulary, main idea, sequencing' },
  { area: 'Writing & Expression', badge: '', what: 'Sentence construction, punctuation, creative ideas', skills: 'Capital letters, full stops, description' },
  { area: 'Number & Place Value', badge: 'Core', what: 'Counting, grouping, two-digit numbers', skills: 'Addition, subtraction, skip counting' },
  { area: 'Maths Problem Solving', badge: '', what: 'Word problems, logical thinking', skills: 'Reasoning, strategy, checking answers' },
];

const approachSteps = [
  { num: '1', title: 'We Start With a Diagnostic', desc: "Before teaching a single thing, we assess exactly where your child is: what they know, what they're almost ready for, and what's causing them to stumble. No guesswork, ever." },
  { num: '2', title: 'Small Groups, Big Attention', desc: 'Our K–Y2 groups are capped at just 4 students so every child gets genuine individual attention, not just a seat in a class where they go unnoticed.' },
  { num: '3', title: 'Hands-On, Playful Learning', desc: 'Young children learn through doing. We use games, manipulatives, visual tools, and stories, because engaged kids learn faster and remember far more.' },
  { num: '4', title: 'Regular Progress Updates', desc: "You'll receive written progress updates every term so you always know exactly how your child is going, and what to reinforce at home between sessions." },
];

const fitPoints = [
  'Your child is in <strong>Year 1 or Year 2</strong> and you want to give them the strongest possible start',
  "You've noticed your child is <strong>behind in reading or phonics</strong> and want to close the gap before Year 3",
  'Your child finds <strong>numbers or basic maths</strong> confusing and needs a patient, step-by-step approach',
  'You want <strong>more than just homework help</strong>: you want genuine skill-building from qualified teachers',
  'Your child is already doing well and you want to <strong>extend and enrich</strong> their learning above classroom level',
  'You want a centre that <strong>communicates clearly with you</strong> and gives honest progress feedback every single term',
];

const whyCards = [
  { num: 'I', title: 'Reading Is the Gateway Skill', color: '#2563eb', desc: 'Every subject, including <strong>maths, science, history</strong>, demands reading. Children who <strong>read fluently by Year 2</strong> have a <strong>compounding advantage</strong> that grows every single year.' },
  { num: 'II', title: "Number Sense Can't Be Rushed", color: '#c9a227', desc: 'Understanding <em>why</em> numbers work, not just <strong>memorising facts</strong>, is what separates a child who <strong>struggles with maths</strong> from one who <strong>genuinely loves it</strong>.' },
  { num: 'III', title: 'Confidence Is Formed Early', color: '#16a34a', desc: 'How a child feels about school in <strong>Year 1–2 shapes their identity as a learner</strong> for years. We build <strong>confidence alongside skills</strong> so they believe they can do hard things.' },
  { num: 'IV', title: 'Early Gaps Widen Fast', color: '#2563eb', desc: 'A <strong>small gap at school entry</strong> becomes a <strong>significant gap by Year 4</strong>. Addressing it early is <strong>faster, less stressful, and far more effective</strong> than catching up later.' },
];

const siblingTabs = [
  { label: 'Early Years (Y1–Y2)', to: '/programs/early-years', active: true },
  { label: 'Year 3–4', to: '/programs/year-3-4', active: false },
  { label: 'Year 5–6', to: '/programs/year-5-6', active: false },
];

const EarlyYears = () => {
  const [slide, setSlide] = useState(0);
  const s = slides[slide];

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO title="Early Years Tutoring (Year 1–2) | DA Tuition" description="Build the reading, writing, and number sense foundations that last a lifetime. Year 1–2 tutoring in Sydney." canonicalUrl="/programs/early-years" />
      <NavigationNew />
      <StickyBookButton />

      {/* ── Breadcrumb + sibling tabs ── */}
      <div className="bg-[#fff6e7] px-5 pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl pb-3 text-sm text-[#61708a]">
          <Link to="/" className="font-semibold text-[#071629] hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/programs/primary-school" className="font-semibold text-[#071629] hover:underline">Primary School</Link>
          <span className="mx-2">›</span>
          Early Years (Y1–Y2)
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto border-t border-[#c9a227]/20">
          {siblingTabs.map((tab) => (
            <Link
              key={tab.label}
              to={tab.to}
              className={`whitespace-nowrap px-5 py-3 text-sm font-bold transition ${tab.active ? 'border-b-2 border-[#c9a227] text-[#071629]' : 'border-b-2 border-transparent text-[#61708a] hover:text-[#071629]'}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629]">
          <div className="absolute inset-0">
            <img
              src="/images/programs/primary-group-smile.jpg"
              alt="A young primary school student smiling during a DA Tuition Early Years session"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto px-5 py-20 text-center lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                Early Years · Year 1 – Year 2 · Ages 6–8
              </div>
              <h1 className="font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
                Build the <span className="text-[#f1df9a]">Foundations</span><br />That Last a Lifetime
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/75">
                The early years are the single most important window for developing <strong className="text-white">reading, writing, and number sense</strong>. Get it right now, and everything that follows becomes so much easier.
              </p>
              <div className="mt-8 flex justify-center">
                <a href="/#contact">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                    Book a Free Trial Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Photo strip ── */}
        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#c9a227]/20 shadow-2xl shadow-[#071629]/10 sm:grid-cols-2">
            <div className="h-[300px] sm:h-[360px]">
              <img src="/images/programs/early-years.jpg" alt="DA Tuition early years student learning one-on-one with teacher" className="h-full w-full object-cover object-[center_top]" />
            </div>
            <div className="flex flex-col justify-center bg-[#071629] p-9">
              <div className="mb-5 inline-block w-fit rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]">Inside DA Tuition</div>
              <h2 className="mb-4 font-serif text-2xl font-medium leading-tight tracking-[-0.03em] text-white">Every Child Gets Noticed, Every Session</h2>
              <p className="text-[15px] leading-[1.75] text-white/70">Our Early Years groups are capped at just 4 students, so your child receives genuine individual attention. Not a seat in a room. Real teaching.</p>
            </div>
          </div>
        </section>

        {/* ── Why ── */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Why It Matters</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Why These Years Are So Critical
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#61708a]">
                Children who build <strong className="text-[#071629]">strong literacy and numeracy</strong> in their first three years of school carry that advantage <strong className="text-[#071629]">all the way through to Year 12</strong> and beyond.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyCards.map((card, i) => (
                <motion.div
                  key={card.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-[2rem] border border-[#071629]/10 bg-white p-7 shadow-lg shadow-[#071629]/5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl font-serif text-base font-bold text-[#f1df9a]" style={{ background: '#071629', border: `2px solid ${card.color}` }}>
                    {card.num}
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-medium text-[#071629]">{card.title}</h3>
                  <p className="text-sm leading-7 text-[#61708a]" dangerouslySetInnerHTML={{ __html: card.desc }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Photo pair ── */}
        <section className="bg-[#fffdf8] px-5 pb-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2">
            <img src="/images/programs/primary-deskwork-1.jpg" alt="DA Tuition teacher warmly encouraging a young Year 1-2 student during a lesson" className="h-64 w-full rounded-[2rem] border border-[#071629]/10 object-cover shadow-lg" />
            <img src="/images/programs/primary-tutor-warm-1.jpg" alt="Smiling DA Tuition teacher supporting an early years student in a small group session" className="h-64 w-full rounded-[2rem] border border-[#071629]/10 object-cover shadow-lg" />
          </div>
        </section>

        {/* ── Curriculum + testimonial carousel ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">What We Cover</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Year 1–2 Curriculum Focus Areas
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#61708a]">
                Every session is aligned to the <strong className="text-[#071629]">NSW Curriculum</strong> for your child's exact year group, reinforcing and extending what they learn at school.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-lg shadow-[#071629]/5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#071629]">
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-white">Focus Area</th>
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-white">What We Build</th>
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-white">Key Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {curriculumRows.map((row, i) => (
                      <tr key={row.area} className={i % 2 === 0 ? 'bg-white' : 'bg-[#fff6e7]/60'}>
                        <td className="border-b border-[#071629]/8 px-5 py-4 font-bold text-[#071629]">
                          {row.area}
                          {row.badge && <span className="ml-2 rounded-full bg-[#c9a227]/15 px-2.5 py-0.5 text-[11px] font-black text-[#7a5e10]">{row.badge}</span>}
                        </td>
                        <td className="border-b border-[#071629]/8 px-5 py-4 text-[#61708a]">{row.what}</td>
                        <td className="border-b border-[#071629]/8 px-5 py-4 text-[#61708a]">{row.skills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-lg shadow-[#071629]/5">
                <div className="h-[3px] bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
                <div className="p-7">
                  <div className="mb-3 flex gap-0.5 text-[#c9a227]">
                    {Array.from({ length: 5 }).map((_, i) => <Sparkles key={i} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                  <p className="mb-5 min-h-[100px] font-serif text-[15px] italic leading-[1.75] text-[#10233f]" dangerouslySetInnerHTML={{ __html: `&ldquo;${s.quote}&rdquo;` }} />
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c9a227]/40 bg-[#fff6e7] text-sm font-black text-[#071629]">{s.initial}</div>
                    <div>
                      <p className="text-sm font-bold text-[#071629]">{s.name}</p>
                      <p className="text-xs text-[#61708a]">{s.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setSlide((i) => (i - 1 + slides.length) % slides.length)} aria-label="Previous testimonial" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c9a227]/40 bg-[#fff6e7] text-[#071629] transition hover:bg-[#c9a227]/15">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex gap-1.5">
                      {slides.map((_, i) => (
                        <button key={i} onClick={() => setSlide(i)} aria-label={`Show testimonial ${i + 1}`} className={`h-2 rounded-full transition-all ${i === slide ? 'w-5 bg-[#c9a227]' : 'w-2 bg-[#071629]/15'}`} />
                      ))}
                    </div>
                    <button onClick={() => setSlide((i) => (i + 1) % slides.length)} aria-label="Next testimonial" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c9a227]/40 bg-[#fff6e7] text-[#071629] transition hover:bg-[#c9a227]/15">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Approach ── */}
        <section className="bg-[#071629] px-5 py-24 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Our Approach</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
                How We Teach Early Years
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/65">Young learners need a specific environment: warm, structured, and full of small wins. Here's exactly how we create it.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {approachSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-6"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#10233f] text-sm font-black text-[#f1df9a]">{step.num}</div>
                  <h3 className="mb-2 font-serif text-base font-medium text-white">{step.title}</h3>
                  <p className="text-[13px] leading-[1.7] text-white/55">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fit ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Is This Right for Us?</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                DA Tuition Early Years Is Perfect If…
              </h2>
            </div>
            <div className="space-y-3">
              {fitPoints.map((pt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-start gap-4 rounded-2xl border border-[#c9a227]/25 bg-white p-5"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a227]" />
                  <p className="text-sm leading-7 text-[#61708a]" dangerouslySetInnerHTML={{ __html: pt }} />
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href="/#contact">
                <Button size="lg" className="h-12 rounded-full bg-[#071629] px-7 font-black text-white hover:bg-[#0e2a4a]">
                  Book Our Free Trial Lesson, No Commitment
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-[#071629] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 text-center shadow-2xl md:p-12">
            <div>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white md:text-5xl">
                Ready to Give Your Child<br />the Best Start?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/75">
                Join hundreds of K–Y2 families across Sydney who've trusted DA Tuition to build the foundations that last a lifetime. Spots are limited, so secure yours today.
              </p>
              <div className="mt-8">
                <a href="/#contact">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] hover:bg-[#e0bd4b]">
                    Book a Free Trial Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.12em] text-white/45">
                No entrance exam · No lock-in contract · Just results
              </p>
            </div>
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
};

export default EarlyYears;
