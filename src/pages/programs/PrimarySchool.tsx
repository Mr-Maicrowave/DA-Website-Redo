import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, GraduationCap, CheckCircle, ChevronLeft, ChevronRight,
  BookOpen, Target, Brain, Users, FileText, Heart,
} from 'lucide-react';

const testimonials = [
  { text: 'My son went from struggling with his times tables to <strong>topping his class in one term.</strong> He actually looks forward to Saturdays now.', name: 'Sarah L.', role: 'Mum of a Year 4 student', initials: 'SL' },
  { text: 'Our daughter was so anxious about reading aloud. After just <strong>six weeks at DA Tuition,</strong> she was putting her hand up in class.', name: 'Jessica M.', role: 'Mum of a Year 2 student', initials: 'JM' },
  { text: 'We enrolled before Year 3 NAPLAN. He ended up in <strong>the top band in reading and numeracy.</strong> He stopped saying he was bad at school.', name: 'David K.', role: 'Dad of a Year 3 student', initials: 'DK' },
  { text: 'Our daughter got into <strong>her first-choice selective school.</strong> The bigger win was watching her stop saying "I\'m not smart."', name: 'Priya C.', role: 'Mum of a Year 6 student', initials: 'PC' },
];

const fitItems = [
  { text: 'Want to <strong>address gaps</strong> before they compound into bigger problems', color: '#2563eb' },
  { text: 'Have a child who is <strong>capable but not yet</strong> performing to their potential', color: '#16a34a' },
  { text: 'Want <strong>NAPLAN preparation</strong> woven naturally into regular lessons', color: '#c9a227' },
  { text: 'Are looking for <strong>extension work</strong> for a child ahead of their class', color: '#2563eb' },
  { text: 'Want their child entering each year with <strong>confidence and momentum</strong>', color: '#16a34a' },
  { text: 'Value <strong>regular communication</strong> and transparent progress updates', color: '#c9a227' },
];

const pillars = [
  {
    num: '01', title: 'Strong Foundations', Icon: BookOpen, color: '#2563eb',
    desc: '<strong>Phonics, reading fluency, handwriting,</strong> and number sense built through structured, age-appropriate practice that sticks for life.',
    points: ['Phonics & decoding skills', 'Reading fluency & comprehension', 'Number sense & place value'],
  },
  {
    num: '02', title: 'Academic Excellence', Icon: Target, color: '#c9a227',
    desc: '<strong>English and Maths aligned to the NSW Curriculum,</strong> with extension work for students ready to go further and be genuinely challenged.',
    points: ['100% NSW Curriculum aligned', 'Extension tasks for advanced learners', 'NAPLAN preparation built in'],
  },
  {
    num: '03', title: 'Critical Thinking', Icon: Brain, color: '#16a34a',
    desc: '<strong>Problem-solving tasks, comprehension strategies,</strong> and worded questions that build truly independent thinkers who don\'t give up.',
    points: ['Multi-step problem solving', 'Inferencing & text analysis', 'Independent study habits'],
  },
];

const approachSteps = [
  { n: '01', title: 'Small Groups (3–4 Students)', Icon: Users, text: 'Every child is noticed, supported, and genuinely challenged.' },
  { n: '02', title: 'Regular Parent Reports', Icon: FileText, text: 'Written progress updates every term, so you always know where your child stands.' },
  { n: '03', title: 'Positive Reinforcement', Icon: Heart, text: 'Confidence and capability built together, every single session.' },
];

const yearGroups = [
  { label: 'Year 1 – Year 2', desc: 'Phonics, reading & early maths', to: '/programs/early-years', color: '#2563eb' },
  { label: 'Year 3 – Year 4', desc: 'NAPLAN prep & comprehension', to: '/programs/year-3-4', color: '#c9a227' },
  { label: 'Year 5 – Year 6', desc: 'Selective prep & high school ready', to: '/programs/year-5-6', color: '#16a34a' },
];

const PrimarySchool = () => {
  const [tIdx, setTIdx] = useState(0);
  const prev = () => setTIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setTIdx(i => (i + 1) % testimonials.length);
  const t = testimonials[tIdx];

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="Primary School Tutoring (K–6) | DA Tuition"
        description="Personalised K–6 tutoring that builds unshakeable confidence, strengthens foundations, and turns every child into a capable independent learner."
        canonicalUrl="/programs/primary-school"
      />
      <NavigationNew />
      <StickyBookButton />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/programs/primary-group-colorful-1.jpg"
              alt="DA Tuition primary school students working together in a small-group classroom session"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 lg:px-8 lg:pb-28">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <GraduationCap className="h-4 w-4" />
                Year 1–6 Primary School · NSW Curriculum Aligned
              </div>
              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Where Every Child's<br className="hidden sm:block" /> <span className="text-[#f1df9a]">Potential Blooms</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                Personalised tutoring that builds <strong className="text-white">unshakeable confidence</strong>, strengthens foundations, and turns every child into a capable, independent learner, from Kindergarten to Year 6.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="/#contact">
                  <Button size="lg" className="h-12 w-full rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b] sm:w-auto">
                    Book an Interview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="#year-groups">
                  <Button size="lg" variant="outline" className="h-12 w-full rounded-full border-white/30 bg-white/10 px-7 font-bold text-white backdrop-blur-md hover:bg-white/15 hover:text-white sm:w-auto">
                    See Our Programs
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Anchor nav ── */}
        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-3 rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10 md:grid-cols-4">
            {[
              ['Year groups', '#year-groups'],
              ['Our pillars', '#pillars'],
              ['Our approach', '#approach'],
              ['Is this right for us', '#fit'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-2xl px-4 py-3 text-center text-sm font-black text-[#10233f] transition hover:bg-[#f5ecd9]">
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* ── Year groups ── */}
        <section id="year-groups" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Select Your Child's Year Group</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                A Program for Every Stage
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {yearGroups.map((tile, i) => (
                <motion.div
                  key={tile.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    to={tile.to}
                    className="group block rounded-3xl border border-[#071629]/10 bg-white p-7 text-center shadow-lg shadow-[#071629]/5 transition hover:-translate-y-1 hover:shadow-xl"
                    style={{ borderTop: `4px solid ${tile.color}` }}
                  >
                    <div className="font-serif text-xl font-medium text-[#071629]">{tile.label}</div>
                    <div className="mt-2 text-sm text-[#61708a]">{tile.desc}</div>
                    <div className="mt-4 flex justify-center">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: tile.color }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section id="pillars" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 grid gap-6 lg:grid-cols-[.85fr_1fr] lg:items-end">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Our Three Pillars</p>
                <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                  Built for Every Stage of Primary School
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-[#61708a]">
                Our program is grounded in <strong className="text-[#071629]">three core pillars</strong> that work together, giving every child the skills, confidence, and thinking habits they need to thrive at every level.
              </p>
            </div>

            <motion.img
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              src="/images/programs/primary-tutor-help-1.jpg"
              alt="Primary school students putting up their hands to answer in a small group classroom session"
              className="mb-10 h-72 w-full rounded-[2rem] border border-[#071629]/10 object-cover shadow-lg shadow-[#071629]/10"
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className="rounded-[2rem] border border-[#071629]/10 bg-white p-8 shadow-lg shadow-[#071629]/5"
                  style={{ borderTop: `4px solid ${p.color}` }}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border" style={{ borderColor: `${p.color}35`, background: `${p.color}10` }}>
                    <p.Icon className="h-5 w-5" style={{ color: p.color }} strokeWidth={1.6} />
                  </div>
                  <p className="mb-1 font-serif text-[11px] tracking-[0.22em] text-[#071629]/30">{p.num}</p>
                  <h3 className="mb-3 font-serif text-xl font-medium text-[#071629]">{p.title}</h3>
                  <p className="mb-5 text-sm leading-7 text-[#61708a]" dangerouslySetInnerHTML={{ __html: p.desc }} />
                  <ul className="space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-[13px] text-[#071629]/80">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: p.color }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Approach ── */}
        <section id="approach" className="bg-[#071629] px-5 py-24 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">How We Teach</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
                Our Approach
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/50">
                Every child learns differently. Our tutors build genuine relationships with each student and follow the NSW Curriculum so everything reinforces what your child is already doing in school.
              </p>
              <div className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                {approachSteps.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                    className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.04] p-7 transition duration-300 hover:border-[#c9a227]/25 hover:bg-white/[0.07]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#c9a227]/35 to-transparent transition duration-500 group-hover:via-[#c9a227]/75" />
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9a227]/20 bg-[#c9a227]/[0.06] transition duration-300 group-hover:border-[#c9a227]/45 group-hover:bg-[#c9a227]/[0.13]">
                        <s.Icon strokeWidth={1.4} className="h-5 w-5 text-[#c9a227]/65 transition duration-300 group-hover:text-[#c9a227]" />
                      </div>
                      <p className="font-serif text-[11px] tracking-[0.22em] text-[#c9a227]/45">{s.n}</p>
                    </div>
                    <p className="mb-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/80">{s.title}</p>
                    <p className="text-[13px] leading-[1.7] text-white/45">{s.text}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/images/programs/primary-tutor-whiteboard-2.jpg"
                  alt="A DA Tuition teacher having a warm, encouraging interaction with a primary school student"
                  className="mb-6 h-56 w-full rounded-[2rem] object-cover shadow-2xl"
                />
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl">
                  <div className="h-[3px] bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
                  <div className="p-7">
                    <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">What Parents Tell Us</p>
                    <AnimatePresence mode="wait">
                      <motion.div key={tIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                        <p className="mb-6 min-h-[90px] font-serif text-base italic leading-[1.75] text-white/90" dangerouslySetInnerHTML={{ __html: `&ldquo;${t.text}&rdquo;` }} />
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c9a227]/40 bg-[#c9a227]/10 text-sm font-black text-[#f1df9a]">{t.initials}</div>
                          <div>
                            <p className="text-sm font-bold text-white">{t.name}</p>
                            <p className="text-xs text-white/50">{t.role}</p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setTIdx(i)}
                            aria-label={`Show testimonial ${i + 1}`}
                            className={`h-2 rounded-full transition-all ${i === tIdx ? 'w-6 bg-[#c9a227]' : 'w-2 bg-white/20 hover:bg-white/35'}`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={prev} aria-label="Previous" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#c9a227]/50 hover:text-white">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button onClick={next} aria-label="Next" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#c9a227]/50 hover:text-white">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Fit ── */}
        <section id="fit" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 grid gap-6 lg:grid-cols-[.85fr_1fr] lg:items-end">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Is This Right for Us?</p>
                <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                  This Program Is for Families Who…
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fitItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                  className="flex items-start gap-3 rounded-2xl border border-[#071629]/8 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: item.color }}>
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm leading-6 text-[#61708a]" dangerouslySetInnerHTML={{ __html: item.text }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-[#071629] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 shadow-2xl md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f1df9a]">Next step</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white">
                Give Your Child the Strongest Possible Start
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/66">
                No entrance exam. No pressure. We gently assess your child in the first session and tailor the program from there.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-white/35">
                Free 20-minute consultation · No obligation · Limited spots each term
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href="/#contact">
                <Button size="lg" className="h-12 w-full rounded-full bg-[#c9a227] px-7 font-black text-[#101521] hover:bg-[#e0bd4b]">
                  Book an Interview
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

export default PrimarySchool;
