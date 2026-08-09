import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, CheckCircle, Star } from 'lucide-react';

const curriculumRows = [
  { area: 'Reading Comprehension', badge: 'Core', what: 'Literal and inferential understanding, text types', skills: "Main idea, author's purpose, vocabulary in context" },
  { area: 'Writing & Language Conventions', badge: 'NAPLAN', what: 'Narrative and informative writing, grammar, spelling', skills: 'Paragraphing, punctuation, cohesive language use' },
  { area: 'Multiplication & Division', badge: 'Core', what: 'Times tables fluency, mental strategies, word problems', skills: 'Multiplication facts, division as inverse, arrays' },
  { area: 'Numeracy & Problem Solving', badge: 'NAPLAN', what: 'Multi-step problems, data interpretation, measurement', skills: 'Fractions, decimals, area, graphing, number patterns' },
  { area: 'Critical Thinking & Analysis', badge: '', what: 'Comparing texts, evaluating information, reasoning', skills: 'Opinion writing, inference, multi-step maths reasoning' },
];

const naplanChecklist = [
  'Reading accurately under time pressure',
  'Writing clearly with correct punctuation & grammar',
  'Multiplication and division fact fluency',
  'Interpreting graphs, tables, and data displays',
  'Multi-step word problem strategies',
  'Staying calm and confident under test conditions',
];

const approachPoints = [
  { title: 'NSW Curriculum aligned', sub: 'We reinforce and extend, never conflict with school' },
  { title: 'NAPLAN preparation built in', sub: 'Every lesson develops tested skills naturally' },
  { title: 'Small groups (3–4 students)', sub: 'Every child is seen and heard every session' },
  { title: 'Term-by-term progress reports', sub: 'You always know where your child stands' },
  { title: 'Positive, encouraging environment', sub: 'Confidence and capability built together' },
];

const fitPoints = [
  'Your child is in <strong>Year 3 or Year 4</strong> and you want to make the most of this critical window',
  'You want <strong>NAPLAN preparation</strong> that builds genuine skills, not just test tricks',
  'Your child is <strong>struggling with times tables, fractions, or word problems</strong> and needs targeted help',
  'Your child is finding <strong>reading comprehension or extended writing</strong> harder than it used to be',
  'Your child is already strong and you want to <strong>extend them beyond the classroom</strong> with challenging work',
  'You want a tuition centre that gives you <strong>clear, honest progress updates</strong> every single term',
];

const whyCards = [
  { num: 'I', title: 'The Big Shift Happens Now', color: '#2563eb', desc: 'In <strong>Year 3, school changes dramatically</strong>. Children move from <strong>learning foundational skills</strong> to <strong>applying them across every subject</strong>. This transition catches many families off guard.' },
  { num: 'II', title: 'NAPLAN Is on the Horizon', color: '#c9a227', desc: '<strong>Year 3 NAPLAN</strong> tests <strong>reading, writing, language conventions, and numeracy</strong>. Strong performance here builds <strong>momentum and genuine confidence</strong>, heading into upper primary.' },
  { num: 'III', title: 'Gaps Compound Quickly', color: '#16a34a', desc: "A child who doesn't fully grasp <strong>multiplication in Year 3</strong> will struggle with <strong>fractions in Year 4</strong>, <strong>algebra in Year 7</strong>, and beyond. <strong>These years are the time to close gaps</strong>, not later." },
  { num: 'IV', title: 'Confidence Becomes Identity', color: '#2563eb', desc: 'The children who thrive in Year 3–4 develop an identity as <strong>"someone who\'s good at school."</strong> We help every child <strong>own that story</strong>, regardless of where they\'re starting from.' },
];

const siblingTabs = [
  { label: 'Early Years (Y1–Y2)', to: '/programs/early-years', active: false },
  { label: 'Year 3–4', to: '/programs/year-3-4', active: true },
  { label: 'Year 5–6', to: '/programs/year-5-6', active: false },
];

const Year34 = () => {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO title="Year 3–4 Tutoring | NAPLAN Ready | DA Tuition" description="Year 3 and 4 are where children build real confidence or begin to fall behind. DA Tuition builds genuine skills for NAPLAN and beyond." canonicalUrl="/programs/year-3-4" />
      <NavigationNew />
      <StickyBookButton />

      {/* ── Breadcrumb + sibling tabs ── */}
      <div className="bg-[#fff6e7] px-5 pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl pb-3 text-sm text-[#61708a]">
          <Link to="/" className="font-semibold text-[#071629] hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/programs/primary-school" className="font-semibold text-[#071629] hover:underline">Primary School</Link>
          <span className="mx-2">›</span>
          Year 3–4
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
              src="/images/programs/primary-group-collab-1.jpg"
              alt="Year 3-4 students collaborating with their tutor on a classroom task at DA Tuition"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.05fr_.75fr] lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <GraduationCap className="h-4 w-4" />
                Year 3–4 · Ages 8–10 · NAPLAN Ready
              </div>
              <h1 className="max-w-2xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
                The <span className="text-[#f1df9a]">Middle Years</span><br />Define the Trajectory
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
                Year 3 and 4 are where children either build real confidence, or begin to fall behind. <strong className="text-white">This is the window that shapes everything that follows.</strong> We make sure it counts.
              </p>
              <div className="mt-8">
                <a href="/#contact">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                    Book a Free Trial Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
              className="self-end rounded-3xl border border-white/14 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-xl"
            >
              <p className="text-[8px] font-black uppercase tracking-[0.32em] text-[#f1df9a]/70">At a Glance</p>
              <div className="mt-5 space-y-4">
                {[
                  { title: 'NAPLAN Years 3 & 5', sub: 'We build real skills, not just test tricks' },
                  { title: 'NSW Curriculum Aligned', sub: "Reinforces exactly what's taught at school" },
                  { title: 'Small Groups (3–4 Students)', sub: 'Real individual attention every session' },
                ].map((b) => (
                  <div key={b.title} className="border-l-2 border-[#c9a227]/40 pl-3">
                    <p className="text-sm font-bold text-white">{b.title}</p>
                    <p className="text-xs text-white/55">{b.sub}</p>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        {/* ── Anchor nav ── */}
        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-3 rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10 md:grid-cols-4">
            {[
              ['Why it matters', '#why'],
              ['Curriculum', '#curriculum'],
              ['Our approach', '#approach'],
              ['Is this right for us', '#fit'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-2xl px-4 py-3 text-center text-sm font-black text-[#10233f] transition hover:bg-[#f5ecd9]">
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* ── Why ── */}
        <section id="why" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">The Middle Years Moment</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                What Makes Year 3–4 So Important
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#61708a]">
                The shift from <strong className="text-[#071629]">learning to read, to reading to learn,</strong> happens in Year 3. Miss this transition and the gap widens quickly. Nail it, and your child becomes <strong className="text-[#071629]">unstoppable</strong>.
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

        {/* ── Curriculum + checklist ── */}
        <section id="curriculum" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">What We Cover</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Year 3–4 Curriculum Focus Areas
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#61708a]">
                100% aligned to the <strong className="text-[#071629]">NSW Curriculum</strong>, with NAPLAN preparation naturally woven into every English and Maths session.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
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

              <div className="flex flex-col gap-5">
                <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-lg shadow-[#071629]/5">
                  <div className="h-[3px] bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
                  <div className="p-7">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">NAPLAN Readiness Checklist</p>
                    <p className="mb-5 text-xs text-[#61708a]">Skills we develop across Year 3–4 sessions</p>
                    <div className="space-y-2.5">
                      {naplanChecklist.map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 shrink-0 text-[#c9a227]" />
                          <span className="text-sm text-[#071629]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-lg shadow-[#071629]/5">
                  <div className="h-[3px] bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
                  <div className="p-7">
                    <div className="mb-3 flex gap-0.5 text-[#c9a227]">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                    </div>
                    <p className="mb-5 font-serif text-[15px] italic leading-[1.75] text-[#10233f]">
                      &ldquo;We enrolled our son before Year 3 NAPLAN and honestly didn't know what to expect. He ended up in <strong className="font-medium not-italic">the top band for both reading and numeracy.</strong> More importantly, he completely stopped saying he was bad at school.&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c9a227]/40 bg-[#fff6e7] text-sm font-black text-[#071629]">D</div>
                      <div>
                        <p className="text-sm font-bold text-[#071629]">David K.</p>
                        <p className="text-xs text-[#61708a]">Dad of a Year 3 student · Strathfield</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Approach ── */}
        <section id="approach" className="bg-[#071629] px-5 py-24 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Our Approach</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
                How We Teach Year 3–4
              </h2>
              <div className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="mb-5 text-[15px] leading-[1.85] text-white/65">
                  In Year 3–4, children need <strong className="text-white">more than repetition</strong>. They need to understand why things work so they can apply skills in new situations, including NAPLAN questions they've never seen before.
                </p>
                <p className="text-[15px] leading-[1.85] text-white/65">
                  Our tutors identify <strong className="text-white">the specific misconceptions</strong> holding each child back and address them directly, rather than just re-teaching what the class already covered.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {approachPoints.map((ap, i) => (
                  <motion.div
                    key={ap.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 transition duration-300 hover:border-[#c9a227]/25 hover:bg-white/[0.07]"
                  >
                    <CheckCircle className="mb-3 h-5 w-5 text-[#c9a227]/70 transition group-hover:text-[#c9a227]" />
                    <p className="mb-1 text-[13px] font-black uppercase tracking-wide text-white/85">{ap.title}</p>
                    <p className="text-[12.5px] leading-[1.6] text-white/45">{ap.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Photo pair ── */}
        <section className="bg-[#fffdf8] px-5 pt-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2">
            <img src="/images/programs/year34.jpg" alt="Year 3-4 students actively participating in a DA Tuition classroom session" className="h-64 w-full rounded-[2rem] border border-[#071629]/10 object-cover shadow-lg" />
            <img src="/images/programs/primary-group-collab-1.jpg" alt="Group of primary school students working together at DA Tuition" className="h-64 w-full rounded-[2rem] border border-[#071629]/10 object-cover shadow-lg" />
          </div>
        </section>

        {/* ── Photo strip w/ quote ── */}
        <section className="bg-[#fffdf8] px-5 py-16 lg:px-8">
          <div className="relative mx-auto h-[380px] max-w-7xl overflow-hidden rounded-[2rem] border border-[#071629]/10">
            <img src="/images/programs/year34.jpg" alt="Year 3-4 students engaged in a DA Tuition class" className="h-full w-full object-cover" style={{ objectPosition: 'center 25%' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629]/80 via-[#071629]/35 to-transparent" />
            <div className="absolute left-8 top-1/2 max-w-md -translate-y-1/2 lg:left-12">
              <div className="mb-3 flex gap-0.5 text-[#c9a227]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mb-3 font-serif text-xl italic leading-[1.5] text-white">&ldquo;Every hand up, every question answered: this is what real engagement looks like.&rdquo;</p>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">The DA Tuition Year 3–4 Classroom</p>
            </div>
          </div>
        </section>

        {/* ── Fit ── */}
        <section id="fit" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Is This Right for Us?</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                DA Tuition Year 3–4 Is Perfect If…
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
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 shadow-2xl md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a]">Next step</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white">
                Don't Let the Middle Years Slip By Unaddressed
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/66">
                Year 3 and 4 are too important to leave to chance. Book a free trial lesson and let's show your child what they're truly capable of.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-white/35">
                No lock-in contract · Limited spots each term · Results guaranteed or additional support at no cost
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href="/#contact">
                <Button size="lg" className="h-12 w-full rounded-full bg-[#c9a227] px-7 font-black text-[#101521] hover:bg-[#e0bd4b]">
                  Book a Free Trial Lesson
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
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

export default Year34;
