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
      'Years 7–8 are where students begin learning the core skills of high school English. Analysing texts, structuring paragraphs, using evidence, and developing stronger written expression.',
    skills: [
      { area: 'Reading', items: ['Novels, films, poetry, short stories', 'Layers of meaning'] },
      { area: 'Analysis', items: ['Techniques, themes, characters', 'Author purpose and messages'] },
      { area: 'Writing', items: ['TEEL/PEEL paragraphs', 'Short answers and creative writing'] },
      { area: 'Essay Skills', items: ['Thesis statements', 'Topic sentences', 'Evidence integration'] },
      { area: 'Vocabulary', items: ['Academic expression', 'Analytical verbs'] },
    ],
    tags: ['TEEL Paragraph Structure', 'Text Analysis', 'Creative Writing', 'Assessment Preparation'],
    parentCards: [
      {
        concern: 'My child was fine in primary school but suddenly feels lost in high school English.',
        shortTitle: 'Suddenly lost in high school English',
        help: 'We identify exactly where the gap is and rebuild from there. Students reconnect their existing skills with the higher expectations of high school English.',
      },
      {
        concern: 'They just retell the story and do not know how to actually analyse it.',
        shortTitle: 'Retelling without analysing',
        help: 'We teach students the difference between retelling and analysing using clear models and guided practice so they learn to explain the how and why behind the text.',
      },
      {
        concern: 'I am not sure the basics are solid enough to keep up as the work gets harder.',
        shortTitle: 'Shaky foundations under pressure',
        help: 'Our structured approach builds foundational skills systematically so students are not just keeping up. They are ahead of what is coming next.',
      },
    ],
    studentCards: [
      {
        concern: 'I do not know what "analyse" actually means or how to do it.',
        shortTitle: 'Not sure what analyse even means',
        help: 'We break it down simply. You will learn what analysis looks like on the page and practise it step by step until it feels natural.',
      },
      {
        concern: 'My teacher says to "go deeper" but I do not know what that looks like.',
        shortTitle: 'Told to go deeper without knowing how',
        help: 'We show you what going deeper looks like with real examples so you can see and replicate what stronger responses actually look like.',
      },
      {
        concern: 'I can understand the text. I just do not know how to write about it.',
        shortTitle: 'Understanding the text but stuck on writing',
        help: 'We give you the structure and language to express what you already understand, turning your ideas into clear and confident written responses.',
      },
    ],
  },
  {
    id: 'y910',
    label: 'Years 9–10',
    pill: 'Sophisticated analysis · essay writing · exam readiness',
    heading: 'Strengthening Analysis and Assessment Confidence',
    intro:
      'Our Years 9–10 program helps students move from basic responses to stronger, more sophisticated analysis. Building arguments, integrating evidence, and writing clearly under exam conditions.',
    skills: [
      { area: 'Essay Writing', items: ['Thesis development', 'Strong arguments', 'Body paragraph structure'] },
      { area: 'Analysis', items: ['Techniques, themes, context', 'Characterisation and author purpose'] },
      { area: 'Text Types', items: ['Essays, speeches, feature articles', 'Creative and discursive writing'] },
      { area: 'Evidence', items: ['Quote selection and integration', 'Detailed explanation'] },
      { area: 'Exams', items: ['Timed writing and planning', 'Adapting to exam questions'] },
    ],
    tags: ['Stronger Essay Writing', 'Deeper Textual Analysis', 'Timed Exam Practice', 'Senior English Preparation'],
    parentCards: [
      {
        concern: 'They are putting in the effort but marks are stuck at the same level.',
        shortTitle: 'Effort without results',
        help: 'We identify what is holding the marks back and target it directly. Often it is structure, argument clarity or quote analysis, and we address each one systematically.',
      },
      {
        concern: 'Their writing sounds okay but never seems to get above average.',
        shortTitle: 'Writing that plateaus at average',
        help: 'We teach students how to move beyond surface-level responses by developing stronger arguments, more precise analysis and controlled expression that markers reward.',
      },
      {
        concern: 'I am worried they are not developing the skills they will need for senior English.',
        shortTitle: 'Not ready for senior English',
        help: 'Our Years 9 to 10 program is built with senior English in mind. Students develop the analytical habits and essay skills that make the transition to Years 11 and 12 manageable.',
      },
    ],
    studentCards: [
      {
        concern: 'I work hard but my essays still feel like something is missing.',
        shortTitle: 'Hard work but essays fall flat',
        help: 'We help you pinpoint what is missing. Usually it is depth of analysis, strength of argument or the way evidence is explained, and we work on each one.',
      },
      {
        concern: 'I do not know how to make my writing sound more sophisticated.',
        shortTitle: 'Writing feels basic',
        help: 'We teach you specific techniques for lifting your language, building more complex sentences and expressing ideas with greater precision and control.',
      },
      {
        concern: 'I freeze when I have to write under time pressure in class or exams.',
        shortTitle: 'Freezing under exam pressure',
        help: 'We practise planning quickly, choosing the right ideas and writing under timed conditions so pressure becomes something you can manage rather than fear.',
      },
    ],
  },
  {
    id: 'y1112',
    label: 'Years 11–12',
    pill: 'Advanced writing · critical analysis · HSC performance',
    heading: 'Senior English and HSC Preparation',
    intro: '',
    skills: [],
    tags: ['HSC Essay Preparation', 'Module-Based Text Analysis', 'Draft Feedback and Editing', 'Trial and HSC Exam Prep'],
    parentCards: [
      {
        concern: 'I do not know if they truly understand what senior English requires of them.',
        shortTitle: 'Unclear on what is expected',
        help: 'We break down exactly what the HSC requires. Students learn to read rubrics, understand module requirements and build responses that directly address what markers are looking for.',
      },
      {
        concern: 'They know the texts well but their essay marks do not reflect that.',
        shortTitle: 'Knowledge not translating to marks',
        help: 'Knowing the text is only part of it. We teach students how to construct a clear argument, integrate evidence purposefully and write with the control that strong essays require.',
      },
      {
        concern: 'I am worried about how they will perform under real HSC exam conditions.',
        shortTitle: 'Worried about HSC performance',
        help: 'We build exam confidence through timed practice, adaptable essay frameworks and question unpacking strategies so students can perform under pressure when it counts.',
      },
    ],
    studentCards: [
      {
        concern: 'I do not know if my essays are actually answering the question properly.',
        shortTitle: 'Not sure if essays are on track',
        help: 'We teach you how to read a question carefully, build a direct and relevant thesis and make sure every paragraph stays focused on what was actually asked.',
      },
      {
        concern: 'I feel like I am just memorising quotes without knowing how to use them well.',
        shortTitle: 'Memorising quotes without knowing how to use them',
        help: 'We shift the focus from memorisation to application. You will learn how to select quotes strategically and analyse them in a way that supports your argument.',
      },
      {
        concern: 'In timed exams I panic and cannot write what I actually know.',
        shortTitle: 'Panic in timed exams',
        help: 'We practise planning and writing under exam conditions regularly so that when the real thing arrives, your response comes from preparation rather than panic.',
      },
    ],
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
  { label: 'TEEL/PEEL structure', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Essay and thesis writing', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Creative writing', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Quote integration', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Timed exam practice', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Academic vocabulary', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Assessment preparation', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
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
        {year.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-[11px] font-medium text-blue-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const English = () => {
  const [hsYr, setHsYr] = useState('y78');
  const [activeStep, setActiveStep] = useState(0);

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

          {/* Year tabs — sit on the hero bottom edge */}
          <div id="english-levels" className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex border-t border-white/10">
              {highSchoolYears.map((y) => (
                <button
                  key={y.id}
                  onClick={() => setHsYr(y.id)}
                  className={`flex-1 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.06em] transition-all ${
                    hsYr === y.id
                      ? 'border-t-2 border-[#f1df9a] bg-[#f1df9a]/08 text-[#f1df9a]'
                      : 'text-white/40 hover:bg-white/05 hover:text-white/65'
                  }`}
                >
                  {y.label}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* ── Interactive Content Area ── */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-b-3xl border border-t-0 border-[#e8e6e0] bg-white shadow-sm">
            <div>
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

                    {/* Vertical timeline — interactive */}
                    <div className="px-6 pt-5 pb-4">
                      <p className="mb-5 text-[13.5px] font-semibold text-[#172033]">Senior lesson process</p>
                      <div className="relative pl-9">
                        {/* Track line — fills up to active step */}
                        <div className="absolute left-[13px] top-1.5 bottom-1.5 w-0.5 bg-[#e8e6e0]" />
                        <div
                          className="absolute left-[13px] top-1.5 w-0.5 bg-gradient-to-b from-[#c9a227] to-[#e8d97a] transition-all duration-500"
                          style={{ height: `${((activeStep + 0.5) / seniorProcess.length) * 100}%` }}
                        />

                        {seniorProcess.map((s, i) => {
                          const isActive = i === activeStep;
                          const isPast = i < activeStep;
                          return (
                            <div
                              key={s.num}
                              className="relative mb-3 last:mb-0 cursor-pointer"
                              onClick={() => setActiveStep(i)}
                            >
                              {/* Dot */}
                              <div
                                className="absolute -left-9 top-[7px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 text-[9px] font-bold transition-all duration-300"
                                style={
                                  isActive
                                    ? { background: '#c9a227', borderColor: '#c9a227', color: '#101521', boxShadow: '0 0 0 4px rgba(201,162,39,0.18)' }
                                    : isPast
                                    ? { background: '#c9a227', borderColor: '#c9a227', color: '#101521' }
                                    : { background: 'white', borderColor: '#e8e6e0', color: 'rgba(23,32,51,0.4)' }
                                }
                              >
                                {isPast && !isActive ? (
                                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4l2.5 2.5L9 1" stroke="#101521" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : s.num}
                              </div>

                              {/* Card */}
                              <div
                                className={`rounded-xl border px-4 py-3 transition-all duration-300 ${
                                  isActive
                                    ? 'border-[#c9a227]/40 bg-[#fdf8ec] shadow-sm'
                                    : isPast
                                    ? 'border-[#e8e6e0] bg-[#f7f5f0] opacity-70'
                                    : 'border-[#e8e6e0] bg-[#f7f5f0] hover:border-[#c9a227]/30 hover:bg-[#fdf8ec]/60'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <p className={`text-[12.5px] font-bold transition-colors duration-200 ${isActive ? 'text-[#7a5c0a]' : 'text-[#172033]'}`}>
                                    {s.title}
                                  </p>
                                  {!isActive && (
                                    <span className="text-[10px] text-[#172033]/30 font-medium">Step {s.num}</span>
                                  )}
                                </div>
                                {isActive && (
                                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#172033]/65">
                                    {s.desc}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Prev / Next controls */}
                      <div className="mt-5 flex items-center justify-between">
                        <button
                          onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                          disabled={activeStep === 0}
                          className="rounded-full border border-[#e8e6e0] bg-white px-4 py-1.5 text-[11.5px] font-semibold text-[#172033]/60 transition-all hover:border-[#c9a227]/50 hover:text-[#7a5c0a] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ← Previous
                        </button>
                        <span className="text-[11px] text-[#172033]/40 font-medium">
                          {activeStep + 1} of {seniorProcess.length}
                        </span>
                        <button
                          onClick={() => setActiveStep((p) => Math.min(seniorProcess.length - 1, p + 1))}
                          disabled={activeStep === seniorProcess.length - 1}
                          className="rounded-full border border-[#e8e6e0] bg-white px-4 py-1.5 text-[11.5px] font-semibold text-[#172033]/60 transition-all hover:border-[#c9a227]/50 hover:text-[#7a5c0a] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                    {/* Pastel tags */}
                    <div className="flex flex-wrap gap-2 px-6 pb-5">
                      {[
                        { label: 'HSC Essay Preparation', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                        { label: 'Module-Based Text Analysis', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                        { label: 'Draft Feedback and Editing', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                        { label: 'Trial and HSC Exam Prep', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                      ].map(({ label, cls }) => (
                        <span key={label} className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium ${cls}`}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Year-specific Concern Cards (slide reveal) ── */}
                <div className="border-t border-[#e8e6e0] px-5 py-5">

                  {/* For Parents */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-[#071629] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f1df9a]">
                        For Parents · {activeHsYear.label}
                      </span>
                      <div className="h-px flex-1 bg-[#e8e6e0]" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {activeHsYear.parentCards.map((card, i) => (
                        <div
                          key={i}
                          className="group relative overflow-hidden rounded-xl border border-[#e0ddd7]"
                          style={{ height: '10.5rem' }}
                        >
                          {/* Front */}
                          <div className="absolute inset-0 flex flex-col bg-[#f7f5f0] p-4 transition-opacity duration-300 group-hover:opacity-0">
                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#172033]/30">
                              Concern {i + 1}
                            </p>
                            <p className="flex-1 text-[12.5px] font-bold leading-[1.45] text-[#172033]">
                              {card.concern}
                            </p>
                            <p className="mt-2 text-[10px] text-[#9b8a6a]">Hover to see how DA helps</p>
                          </div>
                          {/* Back */}
                          <div className="absolute inset-0 flex translate-y-full flex-col border-t-[3px] border-[#c9a227] bg-[#fdf8ec] p-4 transition-transform duration-[350ms] ease-in-out group-hover:translate-y-0">
                            <p className="mb-2 border-b border-[#f0d08a] pb-2 text-[10.5px] font-bold leading-snug text-[#172033]">
                              {card.shortTitle}
                            </p>
                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#7a5c0a]">
                              How DA can help
                            </p>
                            <p className="flex-1 text-[11.5px] leading-[1.5] text-[#5c4a1e]">{card.help}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* For Students */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-[#1e3a8a] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#bfdbfe]">
                        For Students · {activeHsYear.label}
                      </span>
                      <div className="h-px flex-1 bg-[#e8e6e0]" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {activeHsYear.studentCards.map((card, i) => (
                        <div
                          key={i}
                          className="group relative overflow-hidden rounded-xl border border-[#e0ddd7]"
                          style={{ height: '10.5rem' }}
                        >
                          {/* Front */}
                          <div className="absolute inset-0 flex flex-col bg-[#f7f5f0] p-4 transition-opacity duration-300 group-hover:opacity-0">
                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#172033]/30">
                              Struggle {i + 1}
                            </p>
                            <p className="flex-1 text-[12.5px] font-bold leading-[1.45] text-[#172033]">
                              {card.concern}
                            </p>
                            <p className="mt-2 text-[10px] text-[#7ba4d4]">Hover to see how DA helps</p>
                          </div>
                          {/* Back */}
                          <div className="absolute inset-0 flex translate-y-full flex-col border-t-[3px] border-[#3b82f6] bg-[#eff6ff] p-4 transition-transform duration-[350ms] ease-in-out group-hover:translate-y-0">
                            <p className="mb-2 border-b border-[#bfdbfe] pb-2 text-[10.5px] font-bold leading-snug text-[#172033]">
                              {card.shortTitle}
                            </p>
                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#1d4ed8]">
                              How DA can help
                            </p>
                            <p className="flex-1 text-[11.5px] leading-[1.5] text-[#1e3a8a]">{card.help}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Key areas (all HS years) */}
                <div className="border-t border-[#e8e6e0] px-5 py-5">
                  <p className="mb-3 text-[13.5px] font-semibold text-[#172033]">
                    Key areas of support across Years 7–12
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hsKeyAreas.map(({ label, cls }) => (
                      <span key={label} className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium ${cls}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Support beyond the classroom */}
                <div className="mx-5 mb-5 rounded-xl bg-[#071629] px-5 py-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#f1df9a]" />
                    <div>
                      <p className="mb-1 text-[12px] font-bold text-[#f1df9a]">Support beyond the classroom</p>
                      <p className="text-[11.5px] leading-relaxed text-white/70">
                        Years 7–12 students receive 24/7 access to learning resources and tutor assistance
                        outside of class — allowing them to ask questions, revise content, and get help exactly
                        when they need it.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-3xl bg-[#071629] px-6 py-4">
                  <div>
                    <p className="text-[13px] font-semibold text-white">Ready to get started?</p>
                    <p className="text-[12px] text-white/60">We'll find the right class and level for your child.</p>
                  </div>
                  <Link to="/contact">
                    <Button className="h-10 rounded-full bg-[#c9a227] px-5 text-sm font-bold text-[#101521] hover:bg-[#b8911f]">
                      Book an Interview <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

          </div>
        </section>

        {/* Spacer */}
        <div className="h-20" />
      </main>

      <FooterNew />
    </div>
  );
};

export default English;
