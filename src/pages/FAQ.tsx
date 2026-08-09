import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  HelpCircle,
  MapPin,
  Phone,
  School,
  Search,
  Shield,
  Users,
} from 'lucide-react';
import { siteStats } from '@/data/site-stats';
import { faqPageSchema } from '@/lib/seo/schema';

type CategoryId = 'all' | 'start' | 'programs' | 'fees' | 'classes' | 'teachers' | 'results' | 'safety';

type FAQItem = {
  category: Exclude<CategoryId, 'all'>;
  question: string;
  answer: React.ReactNode;
  schemaAnswer: string;
  keywords: string[];
  popular?: boolean;
  links?: Array<{ label: string; href: string }>;
};

const inlineLink = 'font-semibold text-brand-navy underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold';
const easeOut = [0.16, 1, 0.3, 1] as const;

const categories: Array<{ id: CategoryId; label: string; shortLabel: string; icon: React.ElementType }> = [
  { id: 'all', label: 'All questions', shortLabel: 'All', icon: HelpCircle },
  { id: 'start', label: 'Starting at DA', shortLabel: 'Start', icon: School },
  { id: 'programs', label: 'Programs and subjects', shortLabel: 'Programs', icon: BookOpen },
  { id: 'fees', label: 'Fees and payments', shortLabel: 'Fees', icon: DollarSign },
  { id: 'classes', label: 'Classes and timing', shortLabel: 'Classes', icon: Clock },
  { id: 'teachers', label: 'Teachers and support', shortLabel: 'Teachers', icon: Users },
  { id: 'results', label: 'Results and progress', shortLabel: 'Results', icon: Award },
  { id: 'safety', label: 'Safety and policies', shortLabel: 'Safety', icon: Shield },
];

const faqs: FAQItem[] = [
  {
    category: 'start',
    question: 'What is the best way to get started at DA Tuition?',
    schemaAnswer: 'The best first step is to book an interview. DA Tuition uses the interview to understand the student, their current level, goals, confidence, and the right class or program fit.',
    keywords: ['enrol', 'enroll', 'start', 'interview', 'assessment', 'book'],
    popular: true,
    links: [{ label: 'Book an interview', href: '/book-interview' }],
    answer: (
      <>
        <p>
          Start with a <Link to="/book-interview" className={inlineLink}>booked interview</Link>. We use that time to understand your child's current level, goals, confidence, and the class fit that will actually help.
        </p>
        <p>
          You do not need to know the exact subject or program before contacting us. Bring the school year, recent concerns, and any goals you have in mind.
        </p>
      </>
    ),
  },
  {
    category: 'start',
    question: 'Is the interview a test?',
    schemaAnswer: 'The interview is not a formal entrance test. It is a guided conversation and learning check so DA Tuition can recommend the right class, teacher, and starting point.',
    keywords: ['test', 'assessment', 'interview', 'nervous', 'entry'],
    popular: true,
    links: [{ label: 'Book an interview', href: '/book-interview' }],
    answer: (
      <>
        <p>
          No. It is a guided conversation and learning check, not a pass-or-fail exam. The goal is to place your child where they can improve without feeling lost or held back.
        </p>
        <p>
          If your child is anxious, tell us. The interview can be paced gently.
        </p>
      </>
    ),
  },
  {
    category: 'start',
    question: 'Can my child join during the term?',
    schemaAnswer: 'Students can usually join during the term if there is a suitable class and available place. DA Tuition recommends booking an interview first so the student is placed correctly.',
    keywords: ['join', 'mid term', 'during term', 'availability', 'start date'],
    links: [{ label: 'View learning formats', href: '/learning-formats' }],
    answer: (
      <p>
        Usually, yes, if there is a suitable class available. We will not just put a student anywhere to fill a seat. The interview helps us choose the right level and timing before they start. You can also review our <Link to="/learning-formats" className={inlineLink}>learning formats</Link>.
      </p>
    ),
  },
  {
    category: 'programs',
    question: 'Which year levels do you teach?',
    schemaAnswer: 'DA Tuition teaches students from primary school through high school and HSC. Programs include primary school, high school, and HSC preparation.',
    keywords: ['year', 'primary', 'high school', 'hsc', 'k-6', '7-10', 'year 12'],
    popular: true,
    links: [
      { label: 'Primary school', href: '/programs/primary-school' },
      { label: 'High school', href: '/programs/high-school' },
      { label: 'HSC excellence', href: '/hsc-excellence' },
    ],
    answer: (
      <p>
        We teach from primary school through HSC. Start with <Link to="/programs/primary-school" className={inlineLink}>primary school</Link>, <Link to="/programs/high-school" className={inlineLink}>high school</Link>, or <Link to="/hsc-excellence" className={inlineLink}>HSC excellence</Link> depending on your child's stage.
      </p>
    ),
  },
  {
    category: 'programs',
    question: 'What subjects are available?',
    schemaAnswer: 'DA Tuition offers Mathematics, English, Science, Business Studies, Legal Studies, primary support, high school support, and HSC preparation.',
    keywords: ['subjects', 'maths', 'mathematics', 'english', 'science', 'business', 'legal'],
    links: [{ label: 'View all subjects', href: '/subjects' }],
    answer: (
      <p>
        Core subjects include <Link to="/subjects/mathematics" className={inlineLink}>Mathematics</Link>, <Link to="/subjects/english" className={inlineLink}>English</Link>, <Link to="/subjects/science" className={inlineLink}>Science</Link>, Business Studies, Legal Studies, and HSC preparation. See the full <Link to="/subjects" className={inlineLink}>subjects page</Link> for the current list.
      </p>
    ),
  },
  {
    category: 'programs',
    question: 'Do you follow the NSW curriculum?',
    schemaAnswer: 'Yes. DA Tuition follows the NSW curriculum and NESA syllabus expectations, while also teaching exam technique, response structure, and deeper understanding.',
    keywords: ['nsw', 'nesa', 'curriculum', 'syllabus', 'school'],
    answer: (
      <p>
        Yes. Lessons are aligned with NSW syllabus expectations, but we do more than cover content. Students also learn how to structure answers, manage exam time, and understand why a method works.
      </p>
    ),
  },
  {
    category: 'fees',
    question: 'How much does tutoring cost?',
    schemaAnswer: 'Fees depend on the year level, subject, and program. DA Tuition discusses the relevant fee after understanding the student and recommending the right class.',
    keywords: ['price', 'pricing', 'cost', 'fees', 'payment', 'how much'],
    popular: true,
    links: [{ label: 'Book an interview', href: '/book-interview' }],
    answer: (
      <p>
        Fees depend on the year level, subject, and program. The simplest way to get an accurate answer is to <Link to="/book-interview" className={inlineLink}>book an interview</Link> so we can recommend the right class before discussing the fee.
      </p>
    ),
  },
  {
    category: 'fees',
    question: 'Are learning materials included?',
    schemaAnswer: 'Learning materials are included with DA Tuition classes unless a specific exception is explained during enrolment.',
    keywords: ['materials', 'resources', 'books', 'extra costs', 'worksheets'],
    answer: (
      <p>
        Yes, regular class materials and learning resources are included unless we explain a specific exception before enrolment. Parents should not be surprised by hidden resource charges.
      </p>
    ),
  },
  {
    category: 'classes',
    question: 'How big are the classes?',
    schemaAnswer: `DA Tuition keeps groups small. Small groups are typically around ${siteStats.studentsPerGroup} students so students can receive attention while still learning around peers.`,
    keywords: ['class size', 'small group', 'one on one', '1 on 1', 'students'],
    popular: true,
    links: [{ label: 'Learning formats', href: '/learning-formats' }],
    answer: (
      <p>
        Groups are intentionally small, usually around {siteStats.studentsPerGroup} students. That gives students room to ask questions while still benefiting from peer discussion. See <Link to="/learning-formats" className={inlineLink}>learning formats</Link> for how the classes are structured.
      </p>
    ),
  },
  {
    category: 'classes',
    question: 'When are classes held?',
    schemaAnswer: 'DA Tuition classes run after school and on weekends, with exact times depending on subject, year level, and availability.',
    keywords: ['time', 'schedule', 'weekend', 'after school', 'hours'],
    links: [{ label: 'Contact DA Tuition', href: '/#contact' }],
    answer: (
      <p>
        Classes run after school and on weekends. Exact times depend on the subject, year level, and current availability. If timing is your main concern, <Link to="/#contact" className={inlineLink}>contact us</Link> and we can check realistic options.
      </p>
    ),
  },
  {
    category: 'classes',
    question: 'Do you offer online classes?',
    schemaAnswer: 'DA Tuition is primarily an in-person centre. Online support may be arranged in specific circumstances, but the main learning experience is face to face.',
    keywords: ['online', 'zoom', 'remote', 'in person', 'face to face'],
    links: [{ label: 'Visit our location', href: '/tutoring-canley-heights' }],
    answer: (
      <p>
        DA is primarily an in-person centre because the teaching style depends on close feedback, attention, and classroom energy. If your family has a specific access issue, ask us directly. You can also view our <Link to="/tutoring-canley-heights" className={inlineLink}>Canley Heights location</Link>.
      </p>
    ),
  },
  {
    category: 'teachers',
    question: 'Who teaches the classes?',
    schemaAnswer: 'DA Tuition classes are taught by trained tutors who understand the subject, syllabus, and student experience. Teacher matching depends on the subject, year level, and student needs.',
    keywords: ['teacher', 'tutor', 'who teaches', 'staff', 'mentor'],
    popular: true,
    links: [{ label: 'Find a tutor', href: '/find-teacher' }],
    answer: (
      <p>
        Classes are taught by trained tutors who understand the subject, syllabus, and student experience. Many families also value that our teachers are relatable mentors, not just content deliverers. Meet some of them on <Link to="/find-teacher" className={inlineLink}>Find a Tutor</Link>.
      </p>
    ),
  },
  {
    category: 'teachers',
    question: 'Can we request a specific teacher?',
    schemaAnswer: 'Families can request a teacher, subject to availability. DA Tuition still considers class fit, level, and student needs before confirming placement.',
    keywords: ['request', 'specific teacher', 'choose tutor', 'teacher change'],
    answer: (
      <p>
        You can ask, and we will consider availability. We also look at class fit, level, subject, and personality. The best teacher on paper is not always the best match for every student.
      </p>
    ),
  },
  {
    category: 'results',
    question: 'What results do DA students achieve?',
    schemaAnswer: `DA Tuition has helped students over ${siteStats.yearsExperience} years, with ${siteStats.band6Results} Band 6 results and ${siteStats.atar95Plus} students achieving ATARs above 95.`,
    keywords: ['results', 'atar', 'band 6', 'success', 'reviews', 'proof'],
    popular: true,
    links: [{ label: 'Success stories', href: '/success-stories' }],
    answer: (
      <p>
        Over {siteStats.yearsExperience} years, DA students have achieved {siteStats.band6Results} Band 6 results and {siteStats.atar95Plus} ATARs above 95. For the more useful version of that proof, read the real <Link to="/success-stories" className={inlineLink}>success stories</Link>.
      </p>
    ),
  },
  {
    category: 'results',
    question: 'How do parents know if their child is improving?',
    schemaAnswer: 'DA Tuition tracks student progress through class performance, teacher feedback, assessment, and parent communication.',
    keywords: ['progress', 'reports', 'feedback', 'improvement', 'parents'],
    answer: (
      <p>
        Improvement is tracked through class performance, teacher feedback, assessment, and parent communication. We look for stronger confidence, better habits, clearer understanding, and better marks, not just one isolated test result.
      </p>
    ),
  },
  {
    category: 'results',
    question: 'Do you guarantee marks?',
    schemaAnswer: 'DA Tuition does not guarantee specific marks because results depend on attendance, effort, practice, and school assessment conditions. DA Tuition does commit to quality teaching and support.',
    keywords: ['guarantee', 'marks', 'improve', 'promise'],
    answer: (
      <p>
        We do not guarantee a specific mark because effort, attendance, practice, and school assessment conditions matter. We do commit to quality teaching, honest feedback, and support when a student is doing the work but still struggling.
      </p>
    ),
  },
  {
    category: 'safety',
    question: 'Is DA Tuition safe for younger students?',
    schemaAnswer: 'DA Tuition takes student safety seriously, including supervision, parent communication, and Working With Children Check expectations for staff.',
    keywords: ['safe', 'safety', 'younger', 'child', 'wwcc'],
    popular: true,
    answer: (
      <p>
        Yes. Student safety is treated seriously, especially for younger students. Staff expectations, supervision, parent communication, and Working With Children Check requirements are part of how the centre operates.
      </p>
    ),
  },
  {
    category: 'safety',
    question: 'What should we do if our child is sick or misses class?',
    schemaAnswer: 'Families should contact DA Tuition if a student is sick or needs to miss class. The centre can advise what catch-up or material support is available.',
    keywords: ['sick', 'miss class', 'absence', 'catch up', 'make up'],
    links: [{ label: 'Contact us', href: '/#contact' }],
    answer: (
      <p>
        Keep sick children at home and contact us as early as possible. We can advise what catch-up support or materials are available for that situation.
      </p>
    ),
  },
];

const categoryCounts = faqs.reduce<Record<CategoryId, number>>((acc, faq) => {
  acc[faq.category] += 1;
  acc.all += 1;
  return acc;
}, { all: 0, start: 0, programs: 0, fees: 0, classes: 0, teachers: 0, results: 0, safety: 0 });

const categoryById = new Map(categories.map((category) => [category.id, category]));
const faqByQuestion = new Map(faqs.map((faq) => [faq.question, faq]));
const popularFAQs = faqs.filter((faq) => faq.popular);
const heroHints = ['Fees', 'Class size', 'Teachers', 'Results'];
const heroConcerns = [
  { label: 'What will this cost?', question: 'How much does tutoring cost?' },
  { label: 'Will the class suit my child?', question: 'How big are the classes?' },
  { label: 'Can I trust the results?', question: 'What results do DA students achieve?' },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [openQuestion, setOpenQuestion] = useState<string>();

  const filteredFAQs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return faqs.filter((faq) => {
      const category = categoryById.get(faq.category);
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const haystack = [
        faq.question,
        faq.schemaAnswer,
        category?.label,
        ...faq.keywords,
      ].join(' ').toLowerCase();

      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [searchTerm, selectedCategory]);

  const selectedCategoryLabel = categoryById.get(selectedCategory)?.label ?? 'All questions';
  const activeAccordionValue = openQuestion ?? (filteredFAQs.length === 1 ? filteredFAQs[0].question : undefined);
  const openAnswer = (faq: FAQItem) => {
    setSelectedCategory(faq.category);
    setSearchTerm('');
    setOpenQuestion(faq.question);
    window.setTimeout(() => document.getElementById('faq-answers')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <div className="min-h-screen bg-[#fbf6ea] text-brand-navy">
      <SEO
        title="Frequently Asked Questions"
        description="Clear answers about DA Tuition programs, fees, class sizes, teachers, results, safety, and how to book an interview."
        canonicalUrl="/faq"
        jsonLd={faqPageSchema(faqs.map(({ question, schemaAnswer }) => ({ question, answer: schemaAnswer })))}
      />
      <NavigationNew />

      <main>
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/hero/da-hero-glow-bg-1600.webp"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/90 to-[#071629]/52" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fbf6ea] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-24 lg:grid-cols-[1.05fr_.75fr] lg:px-8 lg:pb-28">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: easeOut }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <HelpCircle className="h-4 w-4" />
                Parent questions
              </div>
              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                The answer should feel easy to find.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                Search naturally, choose a question, or follow the parent concerns below. The answer opens without making you hunt through dropdowns.
              </p>

              <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-[1fr_auto]">
                <label className="relative block">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-navy/45" />
                  <input
                    type="text"
                    placeholder="Search fees, class size, HSC, teachers..."
                    aria-label="Search frequently asked questions"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setOpenQuestion(undefined);
                    }}
                    className="h-14 w-full rounded-full border border-white/70 bg-white pl-12 pr-5 text-base font-medium text-brand-navy shadow-sm outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20"
                  />
                </label>
                <Button asChild className="h-14 rounded-full bg-brand-gold px-7 font-bold text-brand-navy hover:bg-brand-lightGold">
                  <Link to="/book-interview">
                    Book Interview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {heroHints.map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => {
                      setSearchTerm(hint);
                      setSelectedCategory('all');
                      setOpenQuestion(undefined);
                      document.getElementById('faq-answers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="rounded-full border border-[#c9a227]/40 bg-[#c9a227]/10 px-4 py-1.5 text-xs font-bold tracking-wide text-[#f1df9a] transition hover:bg-[#c9a227]/20"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12, ease: easeOut }}
              className="hidden self-end rounded-3xl border border-white/18 bg-[#071629]/55 p-6 shadow-2xl backdrop-blur-xl lg:block"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f1df9a]/75">Start with the real concern</p>
              <div className="relative mt-6 space-y-3">
                <div className="absolute bottom-6 left-[18px] top-6 w-px bg-gradient-to-b from-[#f1df9a]/70 via-[#f1df9a]/20 to-transparent" />
                {heroConcerns.map(({ label, question }, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const faq = faqByQuestion.get(question);
                      if (faq) openAnswer(faq);
                    }}
                    className="group relative flex w-full items-center gap-4 rounded-2xl bg-white/[0.08] p-4 text-left text-white transition hover:bg-white/[0.13]"
                  >
                    <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f1df9a]/35 bg-[#071629] text-xs font-black text-[#f1df9a]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold leading-6">{label}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-[#f1df9a] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-white/78">
                Each concern opens the answer directly, then points to the next useful page if you need more context.
              </p>
            </motion.aside>
          </div>
        </section>

        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto max-w-7xl rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10">
            <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Browse topics</p>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const active = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setOpenQuestion(undefined);
                      }}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                        active
                          ? 'bg-brand-navy text-white shadow-sm'
                          : 'text-brand-navy/76 hover:bg-brand-gold/10 hover:text-brand-navy'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-brand-lightGold' : 'text-brand-gold'}`} />
                        <span className="truncate text-sm font-semibold">{category.shortLabel}</span>
                      </span>
                      <span className={`ml-3 rounded-full px-2 py-0.5 text-xs font-bold ${active ? 'bg-white/14 text-white' : 'bg-brand-navy/6 text-brand-navy/65'}`}>
                        {categoryCounts[category.id]}
                      </span>
                    </button>
                  );
                })}
              </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl space-y-8">
              <motion.section
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, ease: easeOut }}
                className="overflow-hidden rounded-[2rem] border border-[#c9a227]/20 bg-[#fffdf8] shadow-xl shadow-[#071629]/5"
              >
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Most asked</p>
                    <h2 className="font-serif text-3xl font-medium tracking-[-0.035em] text-[#071629]">Start where parents usually start.</h2>
                  </div>
                  <Link to="/success-stories" className="mx-5 mt-1 inline-flex items-center text-sm font-bold text-brand-navy hover:text-brand-gold sm:mx-6">
                    See proof
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                <div className="grid border-t border-[#071629]/10 md:grid-cols-2">
                  {popularFAQs.slice(0, 6).map((faq) => (
                    <button
                      key={faq.question}
                      type="button"
                      onClick={() => openAnswer(faq)}
                      className="group flex min-h-[92px] items-center gap-4 border-b border-[#071629]/10 px-5 py-5 text-left transition hover:bg-[#f5ecd9] md:border-r md:px-6"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-gold" />
                      <span className="block text-sm font-black leading-6 text-brand-navy">{faq.question}</span>
                      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-brand-gold opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="faq-answers"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, ease: easeOut }}
                className="scroll-mt-32 rounded-[2rem] border border-[#c9a227]/20 bg-[#fffdf8] p-5 shadow-xl shadow-[#071629]/5 sm:p-6"
              >
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-brand-gold">{selectedCategoryLabel}</p>
                    <h2 className="font-serif text-3xl font-semibold tracking-[-0.01em] text-brand-navy">
                      {filteredFAQs.length} answer{filteredFAQs.length === 1 ? '' : 's'}
                    </h2>
                  </div>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setOpenQuestion(undefined);
                      }}
                      className="text-sm font-bold text-brand-navy/65 hover:text-brand-gold"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {filteredFAQs.length > 0 ? (
                  <Accordion type="single" collapsible value={activeAccordionValue} onValueChange={setOpenQuestion} className="space-y-3">
                    {filteredFAQs.map((faq, index) => (
                      <AccordionItem
                        key={`${faq.category}-${faq.question}`}
                        value={faq.question}
                        className="rounded-2xl border border-brand-navy/10 bg-white px-5 shadow-sm data-[state=open]:border-brand-gold/45"
                      >
                        <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                          <span className="text-base font-bold leading-7 text-brand-navy">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-5 text-brand-navy/76">
                          <div className="space-y-4 text-base leading-8">
                            {faq.answer}
                            {faq.links && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {faq.links.map((link) => (
                                  <Link
                                    key={link.href}
                                    to={link.href}
                                    className="inline-flex items-center rounded-full border border-brand-gold/35 bg-brand-gold/10 px-3 py-1.5 text-sm font-bold text-brand-navy hover:bg-brand-gold hover:text-brand-navy"
                                  >
                                    {link.label}
                                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="rounded-2xl border border-dashed border-brand-gold/45 bg-[#fffaf0] p-8 text-center">
                    <HelpCircle className="mx-auto mb-4 h-8 w-8 text-brand-gold" />
                    <h3 className="font-serif text-2xl font-semibold text-brand-navy">No matching question yet.</h3>
                    <p className="mx-auto mt-3 max-w-xl text-brand-navy/70">
                      Try a simpler search like "fees", "HSC", "teacher", or "class size". If your question depends on your child, book an interview and we will answer it directly.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button variant="outline" className="rounded-full border-brand-gold/40" onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}>
                        Clear filters
                      </Button>
                      <Button asChild className="rounded-full bg-brand-gold text-brand-navy hover:bg-brand-lightGold">
                        <Link to="/book-interview">Book Interview</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </motion.section>
          </div>
        </section>

        <section className="relative overflow-hidden bg-brand-navy px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/35 to-transparent" />
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-lightGold">Need a human answer?</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
                Bring the question to the interview.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
                The fastest answer is often personal: year level, subject, confidence, school goals, and timing all matter. We will help you find the right starting point.
              </p>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/8 p-5">
              <div className="grid gap-3">
                <a href="tel:0401940207" className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15">
                  <Phone className="h-4 w-4 text-brand-lightGold" />
                  Call 0401 940 207
                </a>
                <Link to="/book-interview" className="flex items-center gap-3 rounded-xl bg-brand-gold px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-lightGold">
                  <School className="h-4 w-4" />
                  Book an Interview
                </Link>
                <Link to="/tutoring-canley-heights" className="flex items-center gap-3 rounded-xl border border-white/14 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  <MapPin className="h-4 w-4 text-brand-lightGold" />
                  Visit Canley Heights
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ;
