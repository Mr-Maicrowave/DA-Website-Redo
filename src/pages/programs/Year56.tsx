import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, CheckCircle, Star, AlertTriangle } from 'lucide-react';

const curriculumRows = [
  { area: 'Advanced Reading & Analysis', badge: '', what: "Complex text types, author's craft, critical evaluation", skills: 'Inferencing, synthesis, literary techniques, perspective' },
  { area: 'Writing for NAPLAN', badge: 'NAPLAN', what: 'Persuasive and narrative writing at a high level', skills: 'Structure, voice, cohesion, vocabulary, sophisticated grammar' },
  { area: 'Algebra & Problem Solving', badge: 'Core', what: 'Variables, equations, number patterns, multi-step reasoning', skills: 'Algebraic thinking, fraction operations, ratio, percentage' },
  { area: 'Selective School Skills', badge: 'Selective', what: 'Abstract reasoning, general ability, reading under pressure', skills: 'Pattern recognition, logical deduction, speed and accuracy' },
  { area: 'Numeracy & Data', badge: 'NAPLAN', what: 'Statistics, geometry, financial maths, measurement', skills: 'Data interpretation, spatial reasoning, real-world application' },
  { area: 'Study Skills & Independence', badge: '', what: 'Organisation, note-taking, self-testing, time management', skills: 'Exam strategies, revision habits, high school preparation' },
];

const hsChecklist = [
  'Extended writing across multiple text types',
  'Algebraic reasoning and equation solving',
  'Abstract and general reasoning skills (selective prep)',
  'Independent study habits and organisation',
  'Exam strategy and time management under pressure',
  'Self-correction and growth mindset in learning',
];

const approachPoints = [
  { title: 'Selective school preparation', sub: 'Specific skills for OC, selective, and scholarship exams' },
  { title: 'NAPLAN Year 5 aligned', sub: 'We target tested domains throughout the year' },
  { title: 'Small groups (3–4 students)', sub: 'Senior students get individual coaching, not a lecture' },
  { title: 'High school transition support', sub: 'Building the study habits that Year 7 demands' },
  { title: 'Term progress reports', sub: 'Transparent, specific feedback for parents every term' },
];

const fitPoints = [
  'Your child is in <strong>Year 5 or Year 6</strong> and you want to make the most of this critical final window in primary school',
  "You're preparing for a <strong>selective school, OC, or scholarship exam</strong> and need targeted, expert preparation",
  'You want <strong>Year 5 NAPLAN preparation</strong> that builds genuine skills, not test anxiety',
  'Your child is <strong>capable but not yet performing to their potential</strong> and needs a push in the right direction',
  'You want your child entering <strong>high school with strong foundations</strong> and real confidence in both Maths and English',
  'You value a tuition centre that <strong>communicates honestly</strong> and gives specific, useful progress feedback every term',
];

const whyCards = [
  { num: 'I', title: 'Year 5 NAPLAN', color: '#2563eb', desc: '<strong>Year 5 NAPLAN results matter</strong> for <strong>selective school applications</strong>, <strong>scholarship eligibility</strong>, and the <strong>academic streaming decisions</strong> that shape your child\'s high school experience.' },
  { num: 'II', title: 'Selective School Entry', color: '#c9a227', desc: 'Selective school and scholarship exams require a <strong>very specific skill set</strong>, well beyond the regular curriculum. <strong>Preparation needs to start early</strong> and be <strong>strategic</strong> to be effective.' },
  { num: 'III', title: 'High School Readiness', color: '#16a34a', desc: '<strong>Year 7 demands significantly more</strong> independent thinking and organisation. Children who enter high school with <strong>strong foundations thrive</strong>, while those who don\'t <strong>often struggle silently</strong>.' },
  { num: 'IV', title: 'Advanced Content Mastery', color: '#2563eb', desc: 'Year 5–6 maths and English move into <strong>abstract reasoning, algebra, extended analysis</strong>, and <strong>sophisticated writing</strong>, skills that require <strong>explicit teaching</strong>, not just practice.' },
];

const siblingTabs = [
  { label: 'Early Years (Y1–Y2)', to: '/programs/early-years', active: false },
  { label: 'Year 3–4', to: '/programs/year-3-4', active: false },
  { label: 'Year 5–6', to: '/programs/year-5-6', active: true },
];

const Year56 = () => {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO title="Year 5–6 Tutoring | Selective School & NAPLAN | DA Tuition" description="Selective school, Year 5 NAPLAN, and high school readiness all converge in Year 5–6. DA Tuition prepares your child for every milestone." canonicalUrl="/programs/year-5-6" />
      <NavigationNew />
      <StickyBookButton />

      {/* ── Breadcrumb + sibling tabs ── */}
      <div className="bg-[#fff6e7] px-5 pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl pb-3 text-sm text-[#61708a]">
          <Link to="/" className="font-semibold text-[#071629] hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/programs/primary-school" className="font-semibold text-[#071629] hover:underline">Primary School</Link>
          <span className="mx-2">›</span>
          Year 5–6
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

      {/* ── Urgency banner ── */}
      <div className="flex flex-wrap items-center justify-center gap-8 border-y border-[#c9a227]/25 bg-[#fff6e7] px-5 py-4 lg:px-8">
        {[
          { text: 'Limited Places This Term', highlight: 'Filling Fast' },
          { text: 'Selective School Prep', highlight: null },
          { text: 'Year 5 NAPLAN Ready', highlight: null },
          { text: 'High School Transition Support', highlight: null },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2.5 text-sm font-bold text-[#071629]">
            {item.text}
            {item.highlight && <span className="whitespace-nowrap rounded-full bg-[#071629] px-3.5 py-1 text-xs font-black text-white">{item.highlight}</span>}
          </div>
        ))}
      </div>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629]">
          <div className="absolute inset-0">
            <img
              src="/images/programs/primary-tutor-1on1-1.jpg"
              alt="A Year 5-6 student working one-on-one with a DA Tuition tutor in a busy classroom"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto px-5 py-20 text-center lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <GraduationCap className="h-4 w-4" />
                Year 5–6 · Ages 10–12 · Selective & HS Ready
              </div>
              <h1 className="font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
                This Is Where <span className="text-[#f1df9a]">Everything</span><br />Gets Decided
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/75">
                Year 5 and 6 are the most consequential years of primary school. <strong className="text-white">Selective school opportunities, Year 5 NAPLAN, and high school readiness</strong> all converge right here.
              </p>
              <div className="mt-8 flex justify-center">
                <a href="/#contact">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                    Secure a Spot, Limited Places
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
            <div className="flex flex-col justify-center bg-[#071629] p-9">
              <div className="mb-5 inline-block w-fit rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227]">Inside the Classroom</div>
              <h2 className="mb-4 font-serif text-2xl font-medium leading-tight tracking-[-0.03em] text-white">Real Students, Real Engagement</h2>
              <p className="text-[15px] leading-[1.75] text-white/70">Small groups, expert teachers, students who are actively learning, not just sitting. This is what a Year 5–6 session at DA Tuition looks like.</p>
            </div>
            <div className="h-[300px] sm:h-[360px]">
              <img src="/images/programs/year56.jpg" alt="Year 5-6 students working at the whiteboard with their teacher" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* ── Why ── */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">The Stakes</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Why Year 5–6 Is the Most Critical Window
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#61708a]">
                <strong className="text-[#071629]">Four major milestones</strong> converge in these two years. The families who <strong className="text-[#071629]">prepare now</strong> are the ones who look back <strong className="text-[#071629]">without regret</strong>.
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

        {/* ── Photo banner ── */}
        <section className="bg-[#fffdf8] px-5 pb-20 lg:px-8">
          <div className="relative mx-auto h-[320px] max-w-7xl overflow-hidden rounded-[2rem] border border-[#071629]/10">
            <img src="/images/programs/primary-tutor-whiteboard-2.jpg" alt="DA Tuition teacher guiding Year 5-6 students through a problem on the whiteboard" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071629]/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="font-serif text-xl font-medium text-white">Targeted teaching, not just more worksheets.</p>
            </div>
          </div>
        </section>

        {/* ── Curriculum + checklist ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">What We Cover</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Year 5–6 Curriculum Focus Areas
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#61708a]">
                Aligned to the <strong className="text-[#071629]">NSW Curriculum</strong> with NAPLAN preparation and selective school extension for students aiming higher.
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
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">High School Readiness Checklist</p>
                    <p className="mb-5 text-xs text-[#61708a]">Skills built across our Year 5–6 program</p>
                    <div className="space-y-2.5">
                      {hsChecklist.map((item) => (
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
                      &ldquo;Our daughter got into <strong className="font-medium not-italic">her first-choice selective school</strong>. But the bigger win was watching her stop saying 'I'm not smart enough.' DA Tuition didn't just prepare her for the exam. They changed how she sees herself.&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c9a227]/40 bg-[#fff6e7] text-sm font-black text-[#071629]">P</div>
                      <div>
                        <p className="text-sm font-bold text-[#071629]">Priya C.</p>
                        <p className="text-xs text-[#61708a]">Mum of a Year 6 student</p>
                      </div>
                    </div>
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
                How We Teach Year 5–6
              </h2>
              <div className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="mb-5 text-[15px] leading-[1.85] text-white/65">
                  Year 5–6 students need <strong className="text-white">more than content delivery</strong>, they need to develop the kind of thinking that allows them to tackle questions they've never seen before. That's what selective school and NAPLAN actually test.
                </p>
                <p className="text-[15px] leading-[1.85] text-white/65">
                  Our tutors work closely with each student to identify <strong className="text-white">exactly where they're losing marks</strong> and build targeted strategies, not just more practice sheets.
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
            <img src="/images/v3/high_energy_class.jpg" alt="Year 5-6 students engaged in an energetic small group class" className="h-60 w-full rounded-[2rem] border border-[#071629]/10 object-cover shadow-lg" />
            <img src="/images/programs/primary-tutor-group-1.jpg" alt="A DA Tuition student celebrating selective school and NAPLAN success" className="h-60 w-full rounded-[2rem] border border-[#071629]/10 object-cover shadow-lg" />
          </div>
        </section>

        {/* ── Scarcity ── */}
        <section className="bg-[#fffdf8] px-5 py-16 lg:px-8">
          <div className="mx-auto flex max-w-3xl items-start gap-5 rounded-[2rem] border border-[#c9a227]/35 bg-[#fff6e7] p-8">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#071629]">
              <AlertTriangle className="h-4.5 w-4.5 text-[#e0bd4b]" />
            </div>
            <div>
              <h3 className="mb-2 font-serif text-lg font-medium text-[#071629]">Year 5–6 Spots Fill Quickly Each Term</h3>
              <p className="text-sm leading-7 text-[#61708a]">Our senior primary program is our most in-demand offering. We keep groups intentionally small, which means we can only accept a limited number of students each term. <strong className="text-[#071629]">Families who enquire early secure their place. Those who wait often miss out.</strong></p>
            </div>
          </div>
        </section>

        {/* ── Fit ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Is This Right for Us?</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                DA Tuition Year 5–6 Is Perfect If…
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
                  Secure a Spot, Limited Places Available
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
                Year 5–6 Is Too Important to Leave to Chance
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/66">
                Selective schools, Year 5 NAPLAN, and high school readiness all come down to preparation. The families who start early are the ones who look back without regret. Secure your child's spot today.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-white/35">
                Limited spots this term · No lock-in contract · Free 20-minute consultation included
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

export default Year56;
