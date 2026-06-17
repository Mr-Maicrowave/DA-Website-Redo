import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, CheckCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

// ─── Data ────────────────────────────────────────────────────────────────────

const primaryYears = [
  {
    id: 'y12',
    label: 'Years 1–2',
    pill: 'Early literacy · confidence · foundations',
    heading: 'Building Strong Foundations',
    intro:
      'Our Years 1–2 English program helps young students build the foundations of reading, writing, spelling, and comprehension. Lessons are gentle, structured, and encouraging — helping students develop confidence from the very beginning.',
    skills: [
      {
        area: 'Reading',
        items: ['Phonics and sounding out words', 'Sight words and fluency', 'Reading with expression'],
      },
      {
        area: 'Writing',
        items: ['Sentence writing', 'Capital letters and full stops', 'Handwriting basics'],
      },
      {
        area: 'Spelling',
        items: ['Common spelling patterns', 'High-frequency words'],
      },
      {
        area: 'Comprehension',
        items: ['Retelling stories', 'Identifying characters and events', 'Answering simple questions'],
      },
      {
        area: 'Confidence',
        items: ['Building vocabulary', 'Explaining ideas clearly', 'Enjoying reading and writing'],
      },
    ],
    tags: ['Phonics and Reading Fluency', 'Sentence Writing', 'Spelling Foundations', 'Confidence with Words'],
  },
  {
    id: 'y34',
    label: 'Years 3–4',
    pill: 'Comprehension · paragraph writing · grammar',
    heading: 'Growing Confident Readers and Writers',
    intro:
      'In Years 3–4, students begin developing deeper reading and writing skills. We help students move beyond simple answers by teaching them how to explain ideas, organise paragraphs, and write with more detail.',
    skills: [
      {
        area: 'Reading',
        items: ['Fluency and expression', 'Vocabulary building'],
      },
      {
        area: 'Comprehension',
        items: ['Literal and inferential questions', 'Main ideas and character feelings'],
      },
      {
        area: 'Writing',
        items: ['Paragraph and creative writing', 'Persuasive writing'],
      },
      {
        area: 'Grammar',
        items: ['Punctuation and sentence variety', 'Adjectives, verbs, conjunctions'],
      },
      {
        area: 'Exam Skills',
        items: ['Word families and spelling rules', 'Answering in full sentences'],
      },
    ],
    tags: ['Reading for Meaning', 'Paragraph Writing', 'Creative and Persuasive Writing', 'Vocabulary and Grammar'],
  },
  {
    id: 'y56',
    label: 'Years 5–6',
    pill: 'Stronger writing · deeper thinking · high school readiness',
    heading: 'Preparing for Upper Primary and High School',
    intro:
      'Our Years 5–6 program prepares students for the jump into high school English. Students learn how to write stronger paragraphs, answer comprehension questions with evidence, and express their ideas with clarity and confidence.',
    skills: [
      {
        area: 'Comprehension',
        items: ['Inference and author purpose', 'Evidence-based answers'],
      },
      {
        area: 'Writing',
        items: ['Narrative and persuasive writing', 'Informative and reflective writing'],
      },
      {
        area: 'Paragraphs',
        items: ['Topic sentences and examples', 'Linking and explaining ideas'],
      },
      {
        area: 'Vocabulary',
        items: ['Figurative language', 'Stronger word choice'],
      },
      {
        area: 'Exam Skills',
        items: ['Planning and time management', 'Editing and answering the question'],
      },
    ],
    tags: ['High School Readiness', 'Comprehension with Evidence', 'Assessment Confidence', 'Extended Writing'],
  },
];

const termWeeks = [
  {
    label: 'Weeks 1–7',
    title: 'Concept Learning',
    desc: 'Structured booklets covering 10 key concepts per term. Every lesson opens with Corrections — reviewing homework mistakes before moving on.',
    bg: 'bg-blue-50 border-blue-200',
    labelColor: 'text-blue-700',
  },
  {
    label: 'Week 8',
    title: 'Exam Revision',
    desc: 'Students revisit major concepts and practise applying skills to exam-style questions.',
    bg: 'bg-amber-50 border-amber-200',
    labelColor: 'text-amber-700',
  },
  {
    label: 'Week 9',
    title: 'Consolidation Exam',
    desc: 'An exam-style task builds confidence under pressure and prepares students for school assessments.',
    bg: 'bg-green-50 border-green-200',
    labelColor: 'text-green-700',
  },
  {
    label: 'Week 10',
    title: 'Exam Review',
    desc: 'Students go through their exam in detail, correct mistakes, and revisit challenging concepts.',
    bg: 'bg-teal-50 border-teal-200',
    labelColor: 'text-teal-700',
  },
];

const lessonSteps = [
  {
    num: '1',
    title: 'Corrections',
    desc: 'Review homework or previous mistakes with teacher guidance — understanding errors, not just moving past them.',
  },
  {
    num: '2',
    title: 'Concept Teaching',
    desc: 'A key English skill is introduced through clear explanations and worked examples.',
  },
  {
    num: '3',
    title: 'Guided Practice',
    desc: 'Students practise with teacher support, asking questions and building confidence.',
  },
  {
    num: '4',
    title: 'Independent Application',
    desc: 'Students apply the concept through writing, comprehension, grammar, vocabulary, or exam-style activities.',
  },
  {
    num: '5',
    title: 'Homework',
    desc: 'Structured homework reinforces the lesson and prepares students for the following week.',
  },
];

const highSchoolYears = [
  {
    id: 'y78',
    label: 'Years 7–8',
    pill: 'Essay foundations · text analysis · structured responses',
    heading: 'Building High School English Skills',
    intro:
      'Years 7–8 are where students begin learning the core skills of high school English — analysing texts, structuring paragraphs, using evidence, and developing stronger written expression.',
    skills: [
      { area: 'Reading', items: ['Novels, films, poetry, short stories', 'Layers of meaning'] },
      { area: 'Analysis', items: ['Techniques, themes, characters', 'Author purpose and messages'] },
      { area: 'Writing', items: ['TEEL/PEEL paragraphs', 'Short answers and creative writing'] },
      { area: 'Essay Skills', items: ['Thesis statements', 'Topic sentences', 'Evidence integration'] },
      { area: 'Vocabulary', items: ['Academic expression', 'Analytical verbs'] },
    ],
    tags: ['TEEL Paragraph Structure', 'Text Analysis', 'Creative Writing', 'Assessment Preparation'],
  },
  {
    id: 'y910',
    label: 'Years 9–10',
    pill: 'Sophisticated analysis · essay writing · exam readiness',
    heading: 'Strengthening Analysis and Assessment Confidence',
    intro:
      'Our Years 9–10 program helps students move from basic responses to stronger, more sophisticated analysis — building arguments, integrating evidence, and writing clearly under exam conditions.',
    skills: [
      { area: 'Essay Writing', items: ['Thesis development', 'Strong arguments', 'Body paragraph structure'] },
      { area: 'Analysis', items: ['Techniques, themes, context', 'Characterisation and author purpose'] },
      { area: 'Text Types', items: ['Essays, speeches, feature articles', 'Creative and discursive writing'] },
      { area: 'Evidence', items: ['Quote selection and integration', 'Detailed explanation'] },
      { area: 'Exams', items: ['Timed writing and planning', 'Adapting to exam questions'] },
    ],
    tags: ['Stronger Essay Writing', 'Deeper Textual Analysis', 'Timed Exam Practice', 'Senior English Preparation'],
  },
  {
    id: 'y1112',
    label: 'Years 11–12',
    pill: 'Advanced writing · critical analysis · HSC performance',
    heading: 'Senior English and HSC Preparation',
    intro: '',
    skills: [],
    tags: ['HSC Essay Preparation', 'Module-Based Text Analysis', 'Draft Feedback and Editing', 'Trial and HSC Exam Prep'],
  },
];

const seniorProcess = [
  {
    num: '1',
    title: 'Rubric Deconstruction',
    desc: 'Students unpack the module rubric so they understand exactly what the syllabus requires them to demonstrate.',
  },
  {
    num: '2',
    title: 'Textual Analysis',
    desc: 'Prescribed texts analysed through themes, techniques, context, values, and author purpose.',
  },
  {
    num: '3',
    title: 'Guided Response Building',
    desc: 'Thesis statements, topic sentences, quote analysis, and structured body paragraphs built with support.',
  },
  {
    num: '4',
    title: 'Draft Development',
    desc: 'Students complete a first draft with guidance, applying ideas and structures developed in class.',
  },
  {
    num: '5',
    title: 'Personalised Feedback',
    desc: 'Prompt, detailed feedback with specific suggestions for improvement after every draft submission.',
  },
  {
    num: '6',
    title: 'Refinement and Exam Prep',
    desc: 'Students adapt essays to different questions and build confidence in timed exam conditions.',
  },
];

const hsKeyAreas = [
  { label: 'Text analysis', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'TEEL/PEEL structure', cls: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: 'Essay and thesis writing', cls: 'bg-amber-50 border-amber-200 text-amber-700' },
  { label: 'Creative writing', cls: 'bg-rose-50 border-rose-200 text-rose-700' },
  { label: 'Quote integration', cls: 'bg-green-50 border-green-200 text-green-700' },
  { label: 'Timed exam practice', cls: 'bg-teal-50 border-teal-200 text-teal-700' },
  { label: 'Academic vocabulary', cls: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { label: 'Assessment preparation', cls: 'bg-orange-50 border-orange-200 text-orange-700' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function YearSkillPanel({ year }: { year: typeof primaryYears[0] }) {
  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="border-b border-[#e8e6e0] px-6 py-5">
        <span className="mb-2 inline-block rounded-md bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-800">
          {year.pill}
        </span>
        <h3 className="font-serif text-[1.3rem] font-medium text-[#172033]">{year.heading}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#172033]/65">{year.intro}</p>
      </div>

      {/* Skills */}
      {year.skills.length > 0 && (
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-5">
          {year.skills.map((s) => (
            <div key={s.area} className="rounded-xl bg-[#f7f5f0] p-3.5">
              <p className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#172033]/50">{s.area}</p>
              <ul className="space-y-1">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-[11.5px] leading-snug text-[#172033]">
                    <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#c9a227]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 px-5 pb-5">
        {year.tags.map((tag, i) => {
          const pastels = [
            'bg-purple-50 border-purple-200 text-purple-700',
            'bg-blue-50 border-blue-200 text-blue-700',
            'bg-green-50 border-green-200 text-green-700',
            'bg-amber-50 border-amber-200 text-amber-700',
            'bg-rose-50 border-rose-200 text-rose-700',
            'bg-teal-50 border-teal-200 text-teal-700',
          ];
          return (
            <span key={tag} className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium ${pastels[i % pastels.length]}`}>
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const English = () => {
  const [mainTab, setMainTab] = useState<'primary' | 'highschool'>('primary');
  const [primaryYr, setPrimaryYr] = useState('y12');
  const [hsYr, setHsYr] = useState('y78');

  const activePrimaryYear = primaryYears.find((y) => y.id === primaryYr)!;
  const activeHsYear = highSchoolYears.find((y) => y.id === hsYr)!;

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="English Tutoring (Years 1–12 & HSC)"
        description="From early reading and spelling to senior essays and HSC preparation, DA Tuition helps students build English skills and confidence at every stage."
        canonicalUrl="/subjects/english"
      />
      <NavigationNew />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/v3/teacher_screen.jpg"
              alt="English tutoring at DA Tuition"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-0 lg:grid-cols-[1.1fr_.7fr] lg:px-8">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="pb-10 lg:pb-14"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <BookOpen className="h-4 w-4" />
                Years 1–12 English
              </div>

              <h1 className="max-w-2xl font-serif text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                English support that grows with your child.
              </h1>

              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
                From early reading and spelling to senior essays and HSC preparation, DA Tuition helps students
                build the skills, confidence, and structure they need at every stage.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/contact">
                  <Button className="h-11 rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#101521] hover:bg-[#b8911f]">
                    Book an Interview <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <button
                  onClick={() => document.getElementById('english-levels')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-11 rounded-full border border-white/30 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/15"
                >
                  Find the Right Level
                </button>
              </div>
            </motion.div>

            {/* Right — quick-check card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="hidden self-end lg:block pb-12"
            >
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.14em] text-[#f1df9a]">
                  Parent quick check
                </p>
                {[
                  'Unsure which level fits?',
                  'Worried about writing or reading skills?',
                  'Preparing for HSC English?',
                ].map((item) => (
                  <div
                    key={item}
                    className="mb-2 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-[11px] font-semibold text-white last:mb-0"
                  >
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#f1df9a]" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main tabs — sit on the hero bottom edge */}
          <div id="english-levels" className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex border-t border-white/10">
              {(['primary', 'highschool'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMainTab(tab)}
                  className={`flex-1 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.06em] transition-all ${
                    mainTab === tab
                      ? 'border-t-2 border-[#f1df9a] bg-[#f1df9a]/08 text-[#f1df9a]'
                      : 'text-white/40 hover:bg-white/05 hover:text-white/65'
                  }`}
                >
                  {tab === 'primary' ? 'Primary (Years 1–6)' : 'High School (Years 7–12)'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Interactive Content Area ── */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-b-3xl border border-t-0 border-[#e8e6e0] bg-white shadow-sm">

            {/* ════ PRIMARY PANEL ════ */}
            {mainTab === 'primary' && (
              <div>
                {/* Year sub-tabs */}
                <div className="flex border-b border-[#e8e6e0] bg-[#f7f5f0]">
                  {primaryYears.map((y) => (
                    <button
                      key={y.id}
                      onClick={() => setPrimaryYr(y.id)}
                      className={`px-5 py-2.5 text-[11.5px] font-semibold transition-all ${
                        primaryYr === y.id
                          ? 'border-b-2 border-[#c9a227] bg-white text-[#7a5c0a]'
                          : 'text-[#172033]/50 hover:text-[#172033]'
                      }`}
                    >
                      {y.label}
                    </button>
                  ))}
                </div>

                {/* Skills panel */}
                <YearSkillPanel key={primaryYr} year={activePrimaryYear} />

                {/* ── Shared Approach Section ── */}
                <div className="mx-5 border-t-[3px] border-[#e8e6e0] pt-6 pb-6 lg:mx-6">
                  {/* Eyebrow */}
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-md bg-[#071629] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">
                      Years 1–6 · All classes
                    </span>
                    <div className="h-px flex-1 bg-[#e8e6e0]" />
                  </div>

                  <h2 className="font-serif text-[1.15rem] font-medium text-[#172033]">
                    How we teach every primary lesson
                  </h2>
                  <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-[#172033]/60">
                    Every DA Tuition primary class follows the same proven structure — regardless of year level.
                    Each 10-week term is carefully sequenced so students build, practise, consolidate, and review
                    their skills before moving on.
                  </p>

                  {/* 10-week term */}
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {termWeeks.map((w) => (
                      <div key={w.label} className={`rounded-xl border p-3.5 ${w.bg}`}>
                        <p className={`mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] ${w.labelColor}`}>
                          {w.label}
                        </p>
                        <p className="mb-1 text-[12.5px] font-semibold text-[#172033]">{w.title}</p>
                        <p className="text-[11px] leading-snug text-[#172033]/60">{w.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* 5-step lesson */}
                  <h3 className="mt-6 mb-3 text-[13.5px] font-semibold text-[#172033]">
                    What happens in each lesson
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {lessonSteps.map((s) => (
                      <div key={s.num} className="rounded-xl bg-[#f7f5f0] p-3.5">
                        <p className="mb-1.5 text-[22px] font-light leading-none text-[#c9a227]">{s.num}</p>
                        <p className="mb-1 text-[12px] font-bold text-[#172033]">{s.title}</p>
                        <p className="text-[11px] leading-snug text-[#172033]/60">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-3xl bg-[#071629] px-6 py-4">
                  <div>
                    <p className="text-[13px] font-semibold text-white">Not sure which year group fits?</p>
                    <p className="text-[12px] text-white/60">We'll identify your child's level together.</p>
                  </div>
                  <Link to="/contact">
                    <Button className="h-10 rounded-full bg-[#c9a227] px-5 text-sm font-bold text-[#101521] hover:bg-[#b8911f]">
                      Book an Interview <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* ════ HIGH SCHOOL PANEL ════ */}
            {mainTab === 'highschool' && (
              <div>
                {/* Year sub-tabs */}
                <div className="flex border-b border-[#e8e6e0] bg-[#f7f5f0]">
                  {highSchoolYears.map((y) => (
                    <button
                      key={y.id}
                      onClick={() => setHsYr(y.id)}
                      className={`px-5 py-2.5 text-[11.5px] font-semibold transition-all ${
                        hsYr === y.id
                          ? 'border-b-2 border-[#c9a227] bg-white text-[#7a5c0a]'
                          : 'text-[#172033]/50 hover:text-[#172033]'
                      }`}
                    >
                      {y.label}
                    </button>
                  ))}
                </div>

                {/* Years 7-8 and 9-10 skill panels */}
                {(hsYr === 'y78' || hsYr === 'y910') && (
                  <YearSkillPanel key={hsYr} year={activeHsYear} />
                )}

                {/* Years 11-12 senior process — vertical timeline */}
                {hsYr === 'y1112' && (
                  <div className="animate-fadeIn">
                    {/* Header */}
                    <div className="border-b border-[#e8e6e0] px-6 py-5">
                      <span className="mb-2 inline-block rounded-md bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                        {activeHsYear.pill}
                      </span>
                      <h3 className="font-serif text-[1.3rem] font-medium text-[#172033]">{activeHsYear.heading}</h3>
                      <p className="mt-3 text-[13px] leading-relaxed text-[#172033]/70">
                        Our Years 11–12 English program is designed to take the uncertainty out of HSC English.
                        Guided by tutors who have succeeded in the HSC and understand the expectations of
                        high-level responses, students learn how to think critically, write with purpose, and
                        approach each module with confidence.
                      </p>
                      <p className="mt-3 text-[13px] leading-relaxed text-[#172033]/70">
                        At DA Tuition, we focus on more than memorisation. We help students understand what
                        strong writing looks like, what markers value, and how to develop responses that are
                        clear, insightful, and adaptable across assessments, trials, and the HSC.
                      </p>
                    </div>

                    {/* Vertical timeline */}
                    <div className="px-6 pt-5 pb-4">
                      <p className="mb-5 text-[13.5px] font-semibold text-[#172033]">Senior lesson process</p>
                      <div className="relative pl-9">
                        {/* Vertical line */}
                        <div className="absolute left-[13px] top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-[#c9a227] to-[#e8e6e0]" />

                        {seniorProcess.map((s, i) => (
                          <div key={s.num} className={`relative mb-4 last:mb-0`}>
                            {/* Dot */}
                            <div className="absolute -left-9 top-[6px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#e8e6e0] bg-white text-[9px] font-bold text-[#172033]/50"
                              style={i === 0 ? { background: '#c9a227', borderColor: '#c9a227', color: '#101521' } : {}}>
                              {s.num}
                            </div>
                            {/* Card */}
                            <div className="rounded-xl border border-[#e8e6e0] bg-[#f7f5f0] px-4 py-3">
                              <p className="text-[12.5px] font-bold text-[#172033]">{s.title}</p>
                              <p className="mt-1 text-[11.5px] leading-relaxed text-[#172033]/60">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pastel tags */}
                    <div className="flex flex-wrap gap-2 px-6 pb-5">
                      {[
                        { label: 'HSC Essay Preparation', cls: 'bg-purple-50 border-purple-200 text-purple-700' },
                        { label: 'Module-Based Text Analysis', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                        { label: 'Draft Feedback and Editing', cls: 'bg-green-50 border-green-200 text-green-700' },
                        { label: 'Trial and HSC Exam Prep', cls: 'bg-amber-50 border-amber-200 text-amber-700' },
                      ].map(({ label, cls }) => (
                        <span key={label} className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium ${cls}`}>
                          {label}
             