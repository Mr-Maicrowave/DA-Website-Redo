import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, CheckCircle, MessageCircle, Clock, ListChecks } from 'lucide-react';
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
      <div className="border-b border-[#e8e6e0] px-9 py-8">
        <span className="mb-3 inline-block rounded-md bg-amber-100 px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-amber-800">
          {year.pill}
        </span>
        <h3 className="font-serif text-[2rem] font-medium text-[#172033]">{year.heading}</h3>
        <p className="mt-3 text-[17px] leading-relaxed text-[#172033]/65">{year.intro}</p>
      </div>

      {/* Skills */}
      {year.skills.length > 0 && (
        <div className="grid grid-cols-2 gap-4 p-7 sm:grid-cols-3 lg:grid-cols-5">
          {year.skills.map((s) => (
            <div key={s.area} className="rounded-xl bg-[#f7f5f0] p-5">
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-[#172033]/50">{s.area}</p>
              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[15px] leading-snug text-[#172033]">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-3 px-7 pb-7">
        {year.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-[14px] font-medium text-blue-700">
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
  const [activeConcern, setActiveConcern] = useState<string | null>(null);

  const concerns = [
    { label: 'Essay writing', text: 'Our structured essay program teaches PEEL, argument scaffolding, and tutor-marked drafts — so every essay improves, not just passes.' },
    { label: 'Reading speed', text: 'We train students in close reading and inference so they stop skimming and start understanding what texts actually ask.' },
    { label: 'HSC prep', text: 'Module-specific coaching, past paper practice, and written feedback on every response — so students walk into the HSC exam prepared.' },
    { label: 'Confidence', text: 'Small classes and weekly tutor check-ins mean students are never lost in the crowd — they ask questions and get real answers.' },
    { label: 'Spelling & grammar', text: 'Embedded across every lesson — we treat accuracy as a skill, not a talent, and correct it every single session.' },
    { label: 'Exam technique', text: 'Timed practise, question deconstruction, and response frameworks students can apply to any unseen text or question.' },
  ];
  const [previewOpen, setPreviewOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPage, setLightboxPage] = useState(0);

  const [essayPreviewOpen, setEssayPreviewOpen] = useState(false);
  const [essayLightboxOpen, setEssayLightboxOpen] = useState(false);
  const [essayLightboxPage, setEssayLightboxPage] = useState(0);

  const essayPages = [
    { src: '/samples/essay_page_1.png', label: 'Page 1' },
    { src: '/samples/essay_page_2.png', label: 'Page 2' },
    { src: null, label: 'End of preview' },
  ];

  const openEssayLightbox = (page = 0) => { setEssayLightboxPage(page); setEssayLightboxOpen(true); };
  const closeEssayLightbox = () => setEssayLightboxOpen(false);
  const prevEssayPage = () => setEssayLightboxPage((p) => Math.max(0, p - 1));
  const nextEssayPage = () => setEssayLightboxPage((p) => Math.min(essayPages.length - 1, p + 1));

  const previewPages = [
    { src: '/samples/lear_page_1.png', label: 'Cover' },
    { src: '/samples/lear_page_3.png', label: 'Character map' },
    { src: '/samples/lear_page_9.png', label: 'Analysis' },
    { src: '/samples/lear_page_15.png', label: 'Activities' },
    { src: null, label: 'End of preview' },
  ];

  const openLightbox = (page = 0) => { setLightboxPage(page); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevPage = () => setLightboxPage((p) => Math.max(0, p - 1));
  const nextPage = () => setLightboxPage((p) => Math.min(previewPages.length - 1, p + 1));

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
              src="/images/programs/highschool-peer-notes.jpg"
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
                <motion.span
                  initial={{ color: '#ffffff' }}
                  animate={{ color: '#f1df9a' }}
                  transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
                  style={{ display: 'inline' }}
                >
                  English
                </motion.span>{' '}support that grows with your child.
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

            {/* Right — concern picker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
              className="hidden lg:flex lg:items-center"
            >
              <div className="w-full rounded-2xl border border-[#e8d98a] bg-[#fffdf8] p-7 shadow-2xl">
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#7a5c0a]">
                  What's your biggest concern?
                </p>
                <p className="mb-5 text-[12px] text-[#9b8a6a]">Tap one to see how DA helps.</p>

                <div className="mb-5 flex flex-wrap gap-2">
                  {concerns.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setActiveConcern(activeConcern === c.label ? null : c.label)}
                      className="rounded-full px-4 py-2 text-[12px] font-600 transition-all duration-200"
                      style={
                        activeConcern === c.label
                          ? { background: '#c9a227', color: '#101521', fontWeight: 700 }
                          : { background: '#f5f0e8', border: '1px solid #d9c98a', color: '#5c4a1e', fontWeight: 600 }
                      }
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div
                  className="min-h-[72px] rounded-xl border border-[#e8c96a] bg-[#fef9ef] px-5 py-4 transition-all duration-300"
                >
                  {activeConcern ? (
                    <p className="text-[13px] leading-relaxed text-[#3d2800]">
                      {concerns.find((c) => c.label === activeConcern)?.text}
                    </p>
                  ) : (
                    <p className="text-[12px] text-[#b8a070]">Select a concern above to see how we help.</p>
                  )}
                </div>

                <Link to="/contact" className="mt-5 block">
                  <Button className="h-11 w-full rounded-xl bg-[#c9a227] text-sm font-bold text-[#101521] hover:bg-[#b8911f]">
                    Book an Interview <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
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
        <motion.section
          className="mx-auto max-w-7xl px-5 lg:px-8"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
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
                    <div className="border-b border-[#e8e6e0] px-9 py-8">
                      <span className="mb-3 inline-block rounded-md bg-amber-100 px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-amber-800">
                        {activeHsYear.pill}
                      </span>
                      <h3 className="font-serif text-[2rem] font-medium text-[#172033]">{activeHsYear.heading}</h3>
                      <p className="mt-4 text-[17px] leading-relaxed text-[#172033]/70">
                        Our Years 11–12 English program is designed to take the uncertainty out of HSC English.
                        Guided by tutors who have succeeded in the HSC and understand the expectations of
                        high-level responses, students learn how to think critically, write with purpose, and
                        approach each module with confidence.
                      </p>
                      <p className="mt-4 text-[17px] leading-relaxed text-[#172033]/70">
                        At DA Tuition, we focus on more than memorisation. We help students understand what
                        strong writing looks like, what markers value, and how to develop responses that are
                        clear, insightful, and adaptable across assessments, trials, and the HSC.
                      </p>
                    </div>

                    {/* Vertical timeline — interactive */}
                    <div className="px-9 pt-8 pb-6">
                      <p className="mb-7 text-[17px] font-semibold text-[#172033]">Senior lesson process</p>
                      <div className="relative pl-[4.5rem]">
                        {/* Track line */}
                        <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-[#e8e6e0]" />
                        <div
                          className="absolute left-[22px] top-2 w-0.5 bg-gradient-to-b from-[#c9a227] to-[#e8d97a] transition-all duration-500"
                          style={{ height: `${((activeStep + 0.5) / seniorProcess.length) * 100}%` }}
                        />

                        {seniorProcess.map((s, i) => {
                          const isActive = i === activeStep;
                          const isPast = i < activeStep;
                          return (
                            <div
                              key={s.num}
                              className="relative mb-5 last:mb-0 cursor-pointer"
                              onClick={() => setActiveStep(i)}
                            >
                              {/* Dot */}
                              <div
                                className="absolute -left-[4.5rem] top-[10px] flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 text-[13px] font-bold transition-all duration-300"
                                style={
                                  isActive
                                    ? { background: '#c9a227', borderColor: '#c9a227', color: '#101521', boxShadow: '0 0 0 6px rgba(201,162,39,0.18)' }
                                    : isPast
                                    ? { background: '#c9a227', borderColor: '#c9a227', color: '#101521' }
                                    : { background: 'white', borderColor: '#e8e6e0', color: 'rgba(23,32,51,0.4)' }
                                }
                              >
                                {isPast && !isActive ? (
                                  <svg width="14" height="11" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4l2.5 2.5L9 1" stroke="#101521" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : s.num}
                              </div>

                              {/* Card */}
                              <div
                                className={`rounded-xl border px-6 py-5 transition-all duration-300 ${
                                  isActive
                                    ? 'border-[#c9a227]/40 bg-[#fdf8ec] shadow-sm'
                                    : isPast
                                    ? 'border-[#e8e6e0] bg-[#f7f5f0] opacity-70'
                                    : 'border-[#e8e6e0] bg-[#f7f5f0] hover:border-[#c9a227]/30 hover:bg-[#fdf8ec]/60'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <p className={`text-[16px] font-bold transition-colors duration-200 ${isActive ? 'text-[#7a5c0a]' : 'text-[#172033]'}`}>
                                    {s.title}
                                  </p>
                                  {!isActive && (
                                    <span className="text-[13px] text-[#172033]/30 font-medium">Step {s.num}</span>
                                  )}
                                </div>
                                {isActive && (
                                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#172033]/65">
                                    {s.desc}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Prev / Next controls */}
                      <div className="mt-7 flex items-center justify-between">
                        <button
                          onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                          disabled={activeStep === 0}
                          className="rounded-full border border-[#e8e6e0] bg-white px-6 py-2.5 text-[15px] font-semibold text-[#172033]/60 transition-all hover:border-[#c9a227]/50 hover:text-[#7a5c0a] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ← Previous
                        </button>
                        <span className="text-[14px] text-[#172033]/40 font-medium">
                          {activeStep + 1} of {seniorProcess.length}
                        </span>
                        <button
                          onClick={() => setActiveStep((p) => Math.min(seniorProcess.length - 1, p + 1))}
                          disabled={activeStep === seniorProcess.length - 1}
                          className="rounded-full border border-[#e8e6e0] bg-white px-6 py-2.5 text-[15px] font-semibold text-[#172033]/60 transition-all hover:border-[#c9a227]/50 hover:text-[#7a5c0a] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                    {/* Pastel tags */}
                    <div className="flex flex-wrap gap-3 px-9 pb-7">
                      {[
                        { label: 'HSC Essay Preparation', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                        { label: 'Module-Based Text Analysis', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                        { label: 'Draft Feedback and Editing', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                        { label: 'Trial and HSC Exam Prep', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                      ].map(({ label, cls }) => (
                        <span key={label} className={`rounded-full border px-5 py-2 text-[14px] font-medium ${cls}`}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Year-specific Concern Cards (slide reveal) ── */}
                <div className="border-t border-[#e8e6e0] bg-gradient-to-b from-[#fef9ef] to-[#fffdf8] px-5 py-7">

                  {/* For Parents */}
                  <div className="mb-7">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-full bg-[#071629] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f1df9a]">
                        For Parents · {activeHsYear.label}
                      </span>
                      <div className="h-px flex-1 bg-[#e8c96a]/40" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {activeHsYear.parentCards.map((card, i) => (
                        <div
                          key={i}
                          className="group relative overflow-hidden rounded-xl border border-[#e8d98a]/60 shadow-sm"
                          style={{ height: '13rem' }}
                        >
                          {/* Front */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-5 text-center transition-opacity duration-300 group-hover:opacity-0">
                            <p className="text-[17.5px] font-bold leading-[1.4] text-[#172033]">
                              &ldquo;{card.concern}&rdquo;
                            </p>
                            <p className="mt-3 text-[10px] text-[#9b8a6a]">Hover to see how DA helps</p>
                          </div>
                          {/* Back */}
                          <div className="absolute inset-0 flex translate-y-full flex-col border-t-[3px] border-[#c9a227] bg-[#fdf8ec] p-5 transition-transform duration-[350ms] ease-in-out group-hover:translate-y-0">
                            <p className="mb-2 border-b border-[#f0d08a] pb-2 text-[13px] font-bold leading-snug text-[#172033]">
                              {card.shortTitle}
                            </p>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#7a5c0a]">
                              How DA can help
                            </p>
                            <p className="flex-1 text-[14.5px] leading-[1.55] text-[#5c4a1e]">{card.help}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* For Students */}
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-full bg-[#1e3a8a] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#bfdbfe]">
                        For Students · {activeHsYear.label}
                      </span>
                      <div className="h-px flex-1 bg-[#93c5fd]/40" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {activeHsYear.studentCards.map((card, i) => (
                        <div
                          key={i}
                          className="group relative overflow-hidden rounded-xl border border-[#bfdbfe]/60 shadow-sm"
                          style={{ height: '13rem' }}
                        >
                          {/* Front */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-5 text-center transition-opacity duration-300 group-hover:opacity-0">
                            <p className="text-[17.5px] font-bold leading-[1.4] text-[#172033]">
                              &ldquo;{card.concern}&rdquo;
                            </p>
                            <p className="mt-3 text-[10px] text-[#7ba4d4]">Hover to see how DA helps</p>
                          </div>
                          {/* Back */}
                          <div className="absolute inset-0 flex translate-y-full flex-col border-t-[3px] border-[#3b82f6] bg-[#eff6ff] p-5 transition-transform duration-[350ms] ease-in-out group-hover:translate-y-0">
                            <p className="mb-2 border-b border-[#bfdbfe] pb-2 text-[13px] font-bold leading-snug text-[#172033]">
                              {card.shortTitle}
                            </p>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1d4ed8]">
                              How DA can help
                            </p>
                            <p className="flex-1 text-[14.5px] leading-[1.55] text-[#1e3a8a]">{card.help}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

          </div>
        </motion.section>

        {/* ── Sample Booklet Preview (Years 9–10 only) ── */}
        {hsYr === 'y910' && <motion.section
          className="mx-auto mt-8 max-w-7xl px-5 lg:px-8"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="overflow-hidden rounded-2xl border border-[#e8e6e0] bg-white shadow-sm">

            {/* Split top row */}
            <div className="grid sm:grid-cols-[3fr_2fr]">
              {/* Left — pitch */}
              <div className="border-b border-[#e8e6e0] p-14 sm:border-b-0 sm:border-r">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e8c96a] bg-[#fef9ef] px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#7a5c0a]">
                  <BookOpen className="h-4 w-4" /> Years 9–10 · King Lear
                </span>
                <h3 className="mt-3 font-serif text-[2rem] font-medium leading-snug text-[#172033]">
                  See inside a DA lesson booklet
                </h3>
                <p className="mt-4 text-[17px] leading-relaxed text-[#172033]/70">
                  Every session comes with a purpose-built student booklet. Students work through
                  context, character analysis, close reading, and scaffolded writing tasks — all
                  designed to build skill and confidence progressively.
                </p>
                <button
                  onClick={() => setPreviewOpen((o) => !o)}
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#071629] px-8 py-4 text-[15px] font-bold text-[#f1df9a] transition-colors hover:bg-[#162d4e]"
                >
                  {previewOpen ? 'Close preview' : 'Preview sample pages'}
                  <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${previewOpen ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Right — cover with gold shadow stack */}
              <div className="flex items-center justify-center bg-[#fafaf8] p-14">
                <div className="relative">
                  <div className="absolute left-4 top-4 h-full w-full rounded-xl bg-[#c9a227]/25" />
                  <img
                    src="/samples/lear_page_1.png"
                    alt="King Lear student booklet cover"
                    className="relative z-10 w-72 rounded-xl shadow-xl transition-transform duration-200 hover:scale-[1.03]"
                    onClick={() => openLightbox(0)}
                    style={{ cursor: 'zoom-in' }}
                  />
                </div>
              </div>
            </div>

            {/* Expandable page strip */}
            {previewOpen && (
              <div className="animate-fadeIn border-t border-[#e8e6e0] bg-[#fafaf8] px-14 py-10">
                <p className="mb-6 text-[13px] font-bold uppercase tracking-[0.09em] text-[#172033]/35">
                  Sample preview · 4 of 18 pages shown
                </p>
                <div className="flex items-end gap-6 overflow-x-auto pb-3">
                  {[
                    { src: '/samples/lear_page_1.png', label: 'Cover', idx: 0 },
                    { src: '/samples/lear_page_3.png', label: 'Character map', idx: 1 },
                    { src: '/samples/lear_page_9.png', label: 'Analysis', idx: 2 },
                    { src: '/samples/lear_page_15.png', label: 'Activities', idx: 3 },
                  ].map(({ src, label, idx }) => (
                    <div key={label} className="flex flex-shrink-0 flex-col items-center gap-3">
                      <img
                        src={src}
                        alt={label}
                        className="h-72 rounded-lg shadow-md transition-transform duration-200 hover:scale-[1.03]"
                        onClick={() => openLightbox(idx)}
                        style={{ cursor: 'zoom-in' }}
                      />
                      <span className="text-[13px] text-[#172033]/45">{label}</span>
                    </div>
                  ))}

                  {/* End card */}
                  <div className="flex flex-shrink-0 flex-col items-center gap-3">
                    <div className="flex h-72 w-48 flex-col items-center justify-center rounded-lg bg-[#071629] px-6 text-center shadow-md">
                      <p className="mb-3 text-[15px] font-bold leading-snug text-[#f1df9a]">
                        End of preview
                      </p>
                      <p className="mb-5 text-[13px] leading-snug text-white/50">
                        Want to see more of what we do?
                      </p>
                      <Link to="/contact">
                        <Button className="h-9 rounded-full bg-[#c9a227] px-5 text-[13px] font-bold text-[#071629] hover:bg-[#b8911f]">
                          Book an interview
                        </Button>

                      </Link>
                    </div>
                    <span className="text-[13px] text-transparent select-none">·</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>}

        {/* ── Essay Feedback Preview (Years 11–12 only) ── */}
        {hsYr === 'y1112' && <motion.section
          className="mx-auto mt-8 max-w-7xl px-5 lg:px-8"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="overflow-hidden rounded-2xl border border-[#e8e6e0] bg-white shadow-sm">

            {/* Split top row */}
            <div className="grid sm:grid-cols-[3fr_2fr]">
              {/* Left — pitch */}
              <div className="border-b border-[#e8e6e0] p-14 sm:border-b-0 sm:border-r">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e8c96a] bg-[#fef9ef] px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#7a5c0a]">
                  <CheckCircle className="h-4 w-4" /> Years 11–12 · Sample Feedback
                </span>
                <h3 className="mt-3 font-serif text-[2rem] font-medium leading-snug text-[#172033]">
                  See the quality of feedback we give students
                </h3>
                <p className="mt-4 text-[17px] leading-relaxed text-[#172033]/70">
                  Every essay and response our students submit comes back with detailed, personalised
                  feedback. This is a real example of the guidance a Year 11–12 student receives — line
                  by line, with clear direction on how to improve.
                </p>
                <button
                  onClick={() => setEssayPreviewOpen((o) => !o)}
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#071629] px-8 py-4 text-[15px] font-bold text-[#f1df9a] transition-colors hover:bg-[#162d4e]"
                >
                  {essayPreviewOpen ? 'Close preview' : 'Preview sample feedback'}
                  <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${essayPreviewOpen ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Right — page 1 thumbnail */}
              <div className="flex items-center justify-center bg-[#fafaf8] p-14">
                <div className="relative">
                  <div className="absolute left-4 top-4 h-full w-full rounded-xl bg-[#c9a227]/25" />
                  <img
                    src="/samples/essay_page_1.png"
                    alt="Sample student essay feedback"
                    className="relative z-10 w-72 rounded-xl shadow-xl transition-transform duration-200 hover:scale-[1.03]"
                    onClick={() => openEssayLightbox(0)}
                    style={{ cursor: 'zoom-in' }}
                  />
                </div>
              </div>
            </div>

            {/* Expandable page strip */}
            {essayPreviewOpen && (
              <div className="animate-fadeIn border-t border-[#e8e6e0] bg-[#fafaf8] px-14 py-10">
                <p className="mb-6 text-[13px] font-bold uppercase tracking-[0.09em] text-[#172033]/35">
                  Sample preview · 2 pages shown
                </p>
                <div className="flex items-end gap-6 overflow-x-auto pb-3">
                  {[
                    { src: '/samples/essay_page_1.png', label: 'Page 1', idx: 0 },
                    { src: '/samples/essay_page_2.png', label: 'Page 2', idx: 1 },
                  ].map(({ src, label, idx }) => (
                    <div key={label} className="flex flex-shrink-0 flex-col items-center gap-3">
                      <img
                        src={src}
                        alt={label}
                        className="h-72 rounded-lg shadow-md transition-transform duration-200 hover:scale-[1.03]"
                        onClick={() => openEssayLightbox(idx)}
                        style={{ cursor: 'zoom-in' }}
                      />
                      <span className="text-[13px] text-[#172033]/45">{label}</span>
                    </div>
                  ))}

                  {/* End card */}
                  <div className="flex flex-shrink-0 flex-col items-center gap-3">
                    <div className="flex h-72 w-48 flex-col items-center justify-center rounded-lg bg-[#071629] px-6 text-center shadow-md">
                      <p className="mb-3 text-[15px] font-bold leading-snug text-[#f1df9a]">End of preview</p>
                      <p className="mb-5 text-[13px] leading-snug text-white/50">
                        Want to see more of what we do?
                      </p>
                      <Link to="/contact">
                        <Button className="h-9 rounded-full bg-[#c9a227] px-5 text-[13px] font-bold text-[#071629] hover:bg-[#b8911f]">
                          Book an interview
                        </Button>
                      </Link>
                    </div>
                    <span className="text-[13px] text-transparent select-none">·</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>}

        {/* ── 3 Differentiator Banners ── */}
        <section className="mt-8 bg-[#eee9df] px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                Icon: Clock,
                bold: '24/7',
                heading: 'Ongoing support beyond the classroom',
                body: 'With round-the-clock access to resources and tutor assistance, students get help exactly when they need it — not just during class hours.',
              },
              {
                Icon: ListChecks,
                bold: 'Structured',
                heading: 'Structured learning, not random worksheets',
                body: 'Every lesson follows a clear learning purpose, building on the last. Students make meaningful progress each week — not just complete tasks.',
              },
              {
                Icon: MessageCircle,
                bold: 'Feedback',
                heading: 'Feedback that turns mistakes into progress',
                body: 'Mistakes are never ignored. Through corrections and detailed written feedback, students understand exactly where they went wrong and how to improve.',
              },
            ].map(({ Icon, bold, heading, body }, idx) => (
              <motion.div
                key={heading}
                className="overflow-hidden rounded-2xl shadow-lg"
                style={{ border: '1px solid #0e2545', background: '#fffbe8' }}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.12 }}
              >
                {/* Top — dark navy */}
                <div className="bg-[#071629] px-8 pt-8 pb-7">
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(201,162,39,0.13)' }}
                  >
                    <Icon className="h-6 w-6 text-[#c9a227]" />
                  </div>
                  <p className="mb-1 text-[22px] font-black tracking-tight text-[#f1df9a]">{bold}</p>
                  <h3 className="text-[1rem] font-bold leading-snug text-white/85">{heading}</h3>
                </div>
                {/* Gold separator */}
                <div className="h-[2px] w-full bg-[#c9a227]" />
                {/* Body */}
                <div className="px-8 py-7" style={{ background: '#fffbe8' }}>
                  <p className="text-[14.5px] leading-relaxed" style={{ color: '#5c4a1e' }}>{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Key areas + Support + CTA (always shown, after previews) ── */}
        <motion.section
          className="mx-auto mt-8 max-w-7xl px-5 lg:px-8"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="overflow-hidden rounded-2xl border border-[#e8e6e0] bg-white shadow-sm">

            {/* Key areas */}
            <div className="px-6 py-5">
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

            {/* CTA bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-2xl bg-[#071629] px-6 py-4">
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
        </motion.section>

        {/* Spacer */}
        <div className="h-20" />
      </main>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Panel — stop propagation so clicking inside doesn't close */}
          <div
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col items-center px-16"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close preview"
            >
              ✕
            </button>

            {/* Page indicator */}
            <p className="mb-4 text-[13px] font-medium text-white/50">
              {lightboxPage + 1} / {previewPages.length} &nbsp;·&nbsp; {previewPages[lightboxPage].label}
            </p>

            {/* Content */}
            {previewPages[lightboxPage].src ? (
              <img
                src={previewPages[lightboxPage].src!}
                alt={previewPages[lightboxPage].label}
                className="max-h-[72vh] w-auto rounded-xl shadow-2xl object-contain"
              />
            ) : (
              /* End card */
              <div className="flex h-[72vh] w-[51vh] flex-col items-center justify-center rounded-xl bg-[#071629] px-12 text-center shadow-2xl">
                <p className="mb-4 text-[32px] font-bold text-[#f1df9a]">End of preview</p>
                <p className="mb-10 text-[18px] leading-relaxed text-white/60">
                  Book an interview to see our full curriculum and find the right class for your child.
                </p>
                <Link to="/contact" onClick={closeLightbox}>
                  <Button className="h-14 rounded-full bg-[#c9a227] px-8 text-[16px] font-bold text-[#071629] hover:bg-[#b8911f]">
                    Book an interview
                  </Button>
                </Link>
              </div>
            )}

            {/* Arrows */}
            <div className="mt-6 flex items-center gap-6">
              <button
                onClick={prevPage}
                disabled={lightboxPage === 0}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 disabled:opacity-25"
                aria-label="Previous page"
              >
                ←
              </button>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {previewPages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxPage(i)}
                    className={`h-2 rounded-full transition-all ${i === lightboxPage ? 'w-6 bg-[#c9a227]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={lightboxPage === previewPages.length - 1}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 disabled:opacity-25"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Essay Lightbox ── */}
      {essayLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={closeEssayLightbox}
        >
          <div
            className="relative flex max-h-[96vh] w-[92vw] max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEssayLightbox}
              className="absolute -right-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close preview"
            >
              ✕
            </button>

            <p className="mb-3 text-[13px] font-medium text-white/50">
              {essayLightboxPage + 1} / {essayPages.length} &nbsp;·&nbsp; {essayPages[essayLightboxPage].label}
            </p>

            {essayPages[essayLightboxPage].src ? (
              <div className="w-full overflow-y-auto rounded-xl shadow-2xl" style={{ maxHeight: '82vh' }}>
                <img
                  src={essayPages[essayLightboxPage].src!}
                  alt={essayPages[essayLightboxPage].label}
                  className="block w-full"
                />
              </div>
            ) : (
              <div className="flex h-[72vh] w-[51vh] flex-col items-center justify-center rounded-xl bg-[#071629] px-12 text-center shadow-2xl">
                <p className="mb-4 text-[32px] font-bold text-[#f1df9a]">End of preview</p>
                <p className="mb-10 text-[18px] leading-relaxed text-white/60">
                  Book an interview to see our full curriculum and the level of support your child will receive.
                </p>
                <Link to="/contact" onClick={closeEssayLightbox}>
                  <Button className="h-14 rounded-full bg-[#c9a227] px-8 text-[16px] font-bold text-[#071629] hover:bg-[#b8911f]">
                    Book an interview
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-6 flex items-center gap-6">
              <button
                onClick={prevEssayPage}
                disabled={essayLightboxPage === 0}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 disabled:opacity-25"
                aria-label="Previous page"
              >
                ←
              </button>
              <div className="flex gap-2">
                {essayPages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setEssayLightboxPage(i)}
                    className={`h-2 rounded-full transition-all ${i === essayLightboxPage ? 'w-6 bg-[#c9a227]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextEssayPage}
                disabled={essayLightboxPage === essayPages.length - 1}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 disabled:opacity-25"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterNew />
    </div>
  );
};

export default English;
