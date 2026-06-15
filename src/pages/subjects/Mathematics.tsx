import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle,
  Clock,
  HelpCircle,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const Mathematics = () => {
  const courseLevels = [
    {
      label: 'Primary School',
      years: 'Years K-6',
      tone: 'from-[#f7fbff] to-[#e8f2ff]',
      icon: BookOpen,
      description: 'Build number confidence, mental maths, times tables, and problem-solving habits before gaps become stressful.',
      subjects: ['K-6 Mathematics', 'Problem Solving', 'Mental Maths', 'Times Tables Mastery'],
    },
    {
      label: 'High School',
      years: 'Years 7-10',
      tone: 'from-[#fbfff8] to-[#eaf8ef]',
      icon: Brain,
      description: 'Strengthen algebra, geometry, trigonometry, and exam routines while school expectations increase.',
      subjects: ['Core Mathematics', 'Advanced Mathematics', 'Mathematical Methods', 'Problem Solving & Enrichment'],
    },
    {
      label: 'HSC Mathematics',
      years: 'Years 11-12',
      tone: 'from-[#fffdf7] to-[#fff1cd]',
      icon: TrendingUp,
      description: 'Prepare for Standard, Advanced, Extension 1, and Extension 2 with structured syllabus and exam support.',
      subjects: ['Mathematics Standard 1 & 2', 'Mathematics Advanced', 'Mathematics Extension 1', 'Mathematics Extension 2'],
    },
  ];

  const hscStreams = [
    {
      name: 'Standard',
      badge: 'Confidence and marks',
      topics: ['Algebra & equations', 'Measurement & geometry', 'Statistics & probability', 'Financial mathematics', 'Networks & paths'],
    },
    {
      name: 'Advanced',
      badge: 'Most common HSC path',
      topics: ['Functions & relations', 'Trigonometry', 'Calculus', 'Statistical analysis', 'Financial modelling'],
    },
    {
      name: 'Extension 1',
      badge: 'High scaling',
      topics: ['Further calculus', 'Polynomials', 'Combinatorics', 'Proof by induction', 'Vectors'],
    },
    {
      name: 'Extension 2',
      badge: 'Elite level',
      topics: ['Complex numbers', 'Further integration', 'Mechanics', 'Statistical inference', 'Advanced proof'],
    },
  ];

  const parentConcerns = [
    {
      icon: HelpCircle,
      title: 'My child understands it in class, then freezes in tests.',
      detail: 'We teach students how to identify question types, choose a method, and show working under pressure.',
    },
    {
      icon: Clock,
      title: 'They are falling behind and avoiding maths homework.',
      detail: 'We rebuild missing foundations step by step so new school content stops feeling impossible.',
    },
    {
      icon: Target,
      title: 'They are capable, but careless mistakes cost marks.',
      detail: 'We focus on checking routines, mathematical communication, and exam habits that reduce avoidable errors.',
    },
  ];

  const teachingSteps = [
    { title: 'Diagnose', text: 'Find the exact gaps, habits, and confidence blocks holding the student back.' },
    { title: 'Explain', text: 'Break concepts into clear steps with worked examples and guided practice.' },
    { title: 'Apply', text: 'Move from simple questions into exam-style problems with teacher feedback.' },
    { title: 'Refine', text: 'Build speed, accuracy, and independent problem-solving over time.' },
  ];

  const skills = [
    'Problem-solving strategies',
    'Mathematical reasoning',
    'Algebraic manipulation',
    'Geometric visualization',
    'Statistical interpretation',
    'Exam technique',
  ];

  const scrollToPathways = () => {
    document.getElementById('math-pathways')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="Mathematics Tutoring (K-12 & HSC)"
        description="From foundational numeracy to advanced HSC mathematics, we build confidence through expert guidance and proven teaching methods at DA Tuition."
        canonicalUrl="/subjects/mathematics"
      />
      <NavigationNew />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/v3/teacher_whiteboard.jpg"
              alt="Mathematics tutoring at DA Tuition"
              className="h-full w-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fff6e7] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-24 lg:grid-cols-[1.05fr_.75fr] lg:px-8 lg:pb-28">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <Calculator className="h-4 w-4" />
                Years K-12 mathematics
              </div>
              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                Maths support that feels calm, clear, and serious.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                From times tables to Extension 2, DA Tuition helps students understand the method, practise with structure, and walk into assessments with confidence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/book-interview">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                    Book an Interview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToPathways}
                  className="h-12 rounded-full border-white/30 bg-white/10 px-7 font-bold text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
                >
                  Find the Right Level
                </Button>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
              className="self-end rounded-3xl border border-white/14 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-xl"
            >
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#f1df9a]">Parent quick check</p>
              <div className="mt-5 space-y-4">
                {['Unsure which maths level fits?', 'Worried about confidence?', 'Preparing for HSC exams?'].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 text-white">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#f1df9a]" />
                    <span className="text-sm font-semibold leading-6">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-white/90">
                Not sure where to start? Book an interview and we will work out the right level, class, and starting point together.
              </p>
            </motion.aside>
          </div>
        </section>

        {/* Anchor navigation */}
        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-3 rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10 md:grid-cols-4">
            {[
              ['Parent concerns', '#parent-concerns'],
              ['Year levels', '#math-pathways'],
              ['HSC streams', '#hsc-maths'],
              ['How we teach', '#math-method'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-2xl px-4 py-3 text-center text-sm font-black text-[#10233f] transition hover:bg-[#f5ecd9]">
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* Parent concerns */}
        <section id="parent-concerns" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="For parents"
              title="Maths problems usually show up as confidence problems first."
              text="Whether your child freezes in tests, avoids homework, or needs to push further ahead, these are the situations we work with every day."
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {parentConcerns.map((concern, index) => (
                <motion.article
                  key={concern.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="rounded-3xl border border-[#071629]/10 bg-white p-6 shadow-lg shadow-[#071629]/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2ff] text-[#10233f]">
                    <concern.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black leading-snug tracking-[-0.02em] text-[#10233f]">{concern.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#61708a]">{concern.detail}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Year level pathways */}
        <section id="math-pathways" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Pathways"
              title="Choose by school stage, not by guesswork."
              text="Not sure which level fits your child? The interview will help. These cards give you a starting point to compare before you call."
            />

            <div className="grid gap-6 lg:grid-cols-3">
              {courseLevels.map((level, index) => (
                <motion.article
                  key={level.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={`group flex min-h-[430px] flex-col justify-between rounded-[2rem] border border-[#071629]/10 bg-gradient-to-b ${level.tone} p-7 shadow-lg shadow-[#071629]/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#10233f]">{level.years}</span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10233f] text-[#f1df9a]">
                        <level.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h2 className="mt-12 font-serif text-3xl font-medium tracking-[-0.04em] text-[#071629]">{level.label}</h2>
                    <p className="mt-4 text-sm leading-7 text-[#61708a]">{level.description}</p>
                    <ul className="mt-6 space-y-3">
                      {level.subjects.map((subject) => (
                        <li key={subject} className="flex items-start gap-3 text-sm font-semibold text-[#24324a]">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227]" />
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to="/book-interview" className="mt-8 inline-flex items-center text-sm font-black text-[#10233f]">
                    Ask which level fits
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* HSC streams */}
        <section id="hsc-maths" className="bg-[#071629] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a]">HSC focus</p>
                <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
                  Clear pathways for Standard, Advanced, and Extension maths.
                </h2>
              </div>
              <p className="text-base leading-8 text-white/64">
                We support all four HSC mathematics streams. You do not need to decode the syllabus — just tell us which subject your child is enrolled in and we will match them to the right class and teacher.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {hscStreams.map((stream, index) => (
                <motion.article
                  key={stream.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="rounded-3xl border border-white/12 bg-white/[0.07] p-6 shadow-2xl shadow-black/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]"
                >
                  <span className="rounded-full bg-[#c9a227]/18 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#f1df9a]">{stream.badge}</span>
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.02em]">{stream.name}</h3>
                  <ul className="mt-5 space-y-3">
                    {stream.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-3 text-sm leading-6 text-white/72">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f1df9a]" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/12 bg-white/[0.06] p-6 md:flex-row md:items-center">
              <p className="max-w-3xl text-sm leading-7 text-white/70">
                Mathematics teachers include high-achieving subject specialists who help students move from knowing content to showing clear working under exam conditions.
              </p>
              <Link to="/hsc-excellence">
                <Button variant="outline" className="rounded-full border-white/30 bg-transparent font-bold text-white hover:bg-white/10 hover:text-white">
                  Explore HSC Program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How we teach */}
        <section id="math-method" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">How we teach</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Less panic. More method.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#61708a]">
                Maths feels more manageable when students know exactly what to do when a question is unfamiliar. We teach method alongside content so students build real confidence alongside their marks.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#24324a] shadow-sm">
                    <Calculator className="h-4 w-4 text-[#c9a227]" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {teachingSteps.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="rounded-3xl border border-[#071629]/10 bg-white p-6 shadow-lg shadow-[#071629]/5"
                >
                  <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#071629] text-sm font-black text-[#f1df9a]">{index + 1}</div>
                  <h3 className="text-xl font-black tracking-[-0.02em] text-[#10233f]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#61708a]">{step.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Learning format cards */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#071629]/10 bg-gradient-to-br from-[#f7fbff] to-[#e8f2ff] p-8 shadow-lg shadow-[#071629]/5">
              <Sparkles className="mb-5 h-10 w-10 text-[#10233f]" />
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#10233f]">Problem-Solving Workshops</h2>
              <p className="mt-4 text-sm leading-7 text-[#61708a]">
                For students aiming high in their class or tackling enrichment challenges. Focused sessions on harder problem types that go beyond the standard lesson program.
              </p>
              <Link to="/hsc-excellence" className="mt-6 inline-flex items-center text-sm font-black text-[#10233f]">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] border border-[#071629]/10 bg-gradient-to-br from-[#fffdf7] to-[#fff1cd] p-8 shadow-lg shadow-[#071629]/5">
              <Users className="mb-5 h-10 w-10 text-[#10233f]" />
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#10233f]">Small Groups and Classes</h2>
              <p className="mt-4 text-sm leading-7 text-[#61708a]">
                Our small group classes (3–5 students) give your child focused attention in a structured setting. Students are matched to a group that suits their current level and pace.
              </p>
              <Link to="/learning-formats" className="mt-6 inline-flex items-center text-sm font-black text-[#10233f]">
                Compare formats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-[#fffdf8] px-5 pb-20 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#071629]/10 bg-white p-8 shadow-2xl shadow-[#071629]/8 md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#10233f] text-[#f1df9a]">
              <Quote className="h-8 w-8" />
            </div>
            <blockquote className="mx-auto max-w-3xl text-center font-serif text-2xl leading-snug tracking-[-0.03em] text-[#10233f] md:text-3xl">
              "The biggest change was not just marks. My child stopped saying, 'I'm bad at maths,' and started showing us how they solved the question."
            </blockquote>
            <p className="mt-6 text-center text-sm font-black uppercase tracking-[0.12em] text-[#c9a227]">Parent feedback</p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#071629] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 shadow-2xl md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a]">Next step</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white">
                Find the right maths starting point.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/66">
                Book an interview and we will help you work out whether your child needs confidence support, extension work, or HSC exam preparation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link to="/book-interview">
                <Button size="lg" className="h-12 w-full rounded-full bg-[#c9a227] px-7 font-black text-[#101521] hover:bg-[#e0bd4b]">
                  Book an Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
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

const SectionHeader = ({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) => (
  <div className="mb-10 grid gap-6 lg:grid-cols-[.85fr_1fr] lg:items-end">
    <div>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">{eyebrow}</p>
      <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">{title}</h2>
    </div>
    <p className="max-w-2xl text-base leading-8 text-[#61708a]">{text}</p>
  </div>
);

export default Mathematics;
