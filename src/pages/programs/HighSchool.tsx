import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import NavigationNew from '@/components/NavigationNew';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

const focusRows = [
  { area: 'English and Essay Writing', build: 'Analytical writing, close reading, text response', skills: 'Thesis construction, evidence integration, language techniques' },
  { area: 'Mathematics', build: 'Algebra, geometry, statistics, calculus foundations', skills: 'Problem-solving, working mathematically, exam technique', highlight: true },
  { area: 'Sciences', build: 'Physics, Chemistry, Biology concepts and inquiry skills', skills: 'Scientific reasoning, data analysis, extended response writing' },
  { area: 'HSIE / Humanities', build: 'Geography, History, critical thinking, source analysis', skills: 'Argument structure, perspective taking, extended response', highlight: true },
  { area: 'Exam and Study Skills', build: 'Organisation, note-taking, revision strategies', skills: 'Time management, past-paper practice, reducing exam anxiety' },
];

const stakesCards = [
  { title: 'The Curriculum Gets Serious', color: '#2563eb', text: 'Year 7 introduces abstract concepts: algebra, essay writing, scientific reasoning. These compound year on year. Students who build strong foundations early keep more options open all the way to the HSC.' },
  { title: 'Habits Form Now or Not at All', color: '#16a34a', text: 'The study habits a student develops in Years 7-8 determine how they handle the pressure of Years 11-12. We teach method, not just content.' },
  { title: 'Selective and Scholarship Pressure', color: '#c9a227', text: 'Many families are managing Year 9-10 class selection or scholarship applications at the same time. Our tutors know what selective and private schools are looking for.' },
  { title: 'Confidence Decides Outcomes', color: '#2563eb', text: 'A teenager who believes they can do hard things will attempt hard things. We build that belief deliberately, through visible progress every session.' },
];

const approachCards = [
  { title: 'We Diagnose Before We Teach', text: "We identify exactly where each student's gaps are and why. Then we fix the root cause, not just the symptom." },
  { title: 'Small Groups, Expert Attention', text: 'High school groups are capped at 5 students. Every student gets individual feedback every session, not just group instruction.' },
  { title: 'Past Papers and Exam Technique', text: 'From Year 8 onwards we integrate past paper practice, marking criteria, and time-pressure drills so students know exactly how to perform on test day.' },
  { title: 'Parent Visibility at Every Step', text: 'You receive a written progress update every term. You will never wonder whether the lessons are working.' },
];

const fitItems = [
  'Your child is finding the jump from primary to high school harder than expected',
  'Marks are inconsistent: strong in class, weaker in exams',
  'Your teenager lacks confidence in one or more subjects',
  'You want selective school or scholarship preparation built into the program',
  'Your child needs better study habits before Year 11 hits',
  'You want written progress updates, not just anecdotal feedback',
];

const testimonials = [
  { text: 'My son started Year 9 <strong>two years behind in maths</strong>. After two terms with DA Tuition he passed his half-yearly with a B, something I genuinely did not think was possible. The progress updates kept us in the loop the whole way through.', name: 'Mum of a Year 9 student', initials: 'M' },
  { text: 'She used to dread English assignments and put them off until the last minute. Now she <strong>brings her drafts in early</strong> just to get feedback before they\'re due.', name: 'Mum of a Year 8 student', initials: 'J' },
  { text: 'We needed something more structured than homework help. The <strong>weekly written updates</strong> told us exactly what was working and what to focus on next.', name: 'Dad of a Year 10 student', initials: 'D' },
  { text: 'His marks were all over the place before DA Tuition. Within a term he was <strong>consistently scoring in the top band</strong> on every test, and he actually believes he can do it now.', name: 'Mum of a Year 7 student', initials: 'P' },
];

const HighSchool = () => {
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTIdx((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[tIdx];

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="High School Tutoring Years 7-10"
        description="Years 7-10 tutoring at DA Tuition builds the skills, habits, and confidence students need for senior school and beyond."
        canonicalUrl="/programs/high-school"
      />
      <NavigationNew />

      {/* ── Breadcrumb + sibling tabs ── */}
      <div className="bg-[#fff6e7] px-5 pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl pb-3 text-sm text-[#61708a]">
          <Link to="/" className="font-semibold text-[#071629] hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/#programs" className="font-semibold text-[#071629] hover:underline">Programs</Link>
          <span className="mx-2">›</span>
          High School
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto border-t border-[#c9a227]/20">
          <Link to="/programs/high-school" className="whitespace-nowrap border-b-2 border-[#c9a227] px-5 py-3 text-sm font-bold text-[#071629]">
            High School (Y7-10)
          </Link>
          <Link to="/hsc-excellence" className="whitespace-nowrap border-b-2 border-transparent px-5 py-3 text-sm font-bold text-[#61708a] hover:text-[#071629]">
            HSC Excellence (Y11-12)
          </Link>
        </div>
      </div>

      {/* ── Urgency banner ── */}
      <div className="flex flex-wrap items-center justify-center gap-8 border-y border-[#c9a227]/25 bg-[#fff6e7] px-5 py-4 lg:px-8">
        {[
          { text: 'Limited Places This Term', highlight: 'Filling Fast' },
          { text: 'Years 7-10 Programs', highlight: null },
          { text: 'Selective School Preparation', highlight: null },
          { text: 'HSC Ready from Year 7', highlight: null },
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
              src="/images/programs/highschool-classroom-wide-1.jpg"
              alt="High school students working together in a DA Tuition classroom"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto px-5 py-20 text-center lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                High School Tuition · Years 7-10
              </div>
              <h1 className="font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
                The Years That Shape <span className="text-[#f1df9a]">Everything</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/75">
                Years 7-10 are where academic trajectories lock in. Our small-group tutoring builds the skills, habits, and confidence your child needs to perform well in senior school and beyond.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/book-interview">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 hover:bg-[#e0bd4b]">
                    Book a Free Trial Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#programs">
                  <Button size="lg" variant="outline" className="h-12 rounded-full border-white/30 bg-transparent px-7 font-bold text-white hover:bg-white/10 hover:text-white">
                    See Our Programs
                  </Button>
                </a>
              </div>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/14 bg-white/[0.09] px-6 py-4 backdrop-blur-xl">
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Selective School and HSC Preparation</p>
                  <p className="text-xs text-white/55">Built into every session from Year 7</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Photo split ── */}
        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#c9a227]/20 shadow-2xl shadow-[#071629]/10 sm:grid-cols-2">
            <div className="h-[280px] sm:h-auto">
              <img src="/images/programs/highschool-tutoring.jpg" alt="High school tutoring at DA Tuition" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center bg-[#fff6e7] p-9">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Expert Instruction</p>
              <h2 className="mb-4 font-serif text-2xl font-medium leading-tight tracking-[-0.03em] text-[#071629]">Your Teacher Beside You, Every Step</h2>
              <p className="text-[15px] leading-[1.75] text-[#61708a]">At DA Tuition, high school students don't just receive instruction. They get an experienced tutor working beside them, identifying exactly where they're losing marks and showing them how to fix it.</p>
            </div>
          </div>
        </section>

        {/* ── Stakes ── */}
        <section id="programs" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Why This Stage Is Critical</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                What Makes Years 7-10 So Important
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#61708a]">
                The move from primary to secondary school is the most significant academic shift a child faces. Here is what is at stake.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stakesCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-[2rem] border border-[#071629]/10 bg-white p-7 shadow-lg shadow-[#071629]/5"
                >
                  <div className="mb-4 h-1 w-9 rounded-full" style={{ background: card.color }} />
                  <h3 className="mb-2 font-serif text-lg font-medium text-[#071629]">{card.title}</h3>
                  <p className="text-sm leading-7 text-[#61708a]">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Curriculum focus table ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Curriculum Coverage</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                Year 7-10 Curriculum Focus Areas
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#61708a]">
                Aligned to the NSW syllabus and structured to build on what your child already knows.
              </p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-lg shadow-[#071629]/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#071629]">
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-white">Focus Area</th>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-white">What We Build</th>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-white">Key Skills Developed</th>
                  </tr>
                </thead>
                <tbody>
                  {focusRows.map((row, i) => (
                    <tr key={row.area} className={row.highlight ? 'bg-[#fff6e7]/70' : i % 2 === 0 ? 'bg-white' : 'bg-[#fff6e7]/30'}>
                      <td className="border-b border-[#071629]/8 px-5 py-4 font-bold text-[#071629]">{row.area}</td>
                      <td className="border-b border-[#071629]/8 px-5 py-4 text-[#61708a]">{row.build}</td>
                      <td className="border-b border-[#071629]/8 px-5 py-4 text-[#61708a]">{row.skills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Approach ── */}
        <section className="bg-[#071629] px-5 py-24 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">Our Approach</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
                How We Teach High School
              </h2>
              <div className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {approachCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-6"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#10233f] text-sm font-black text-[#f1df9a]">{i + 1}</div>
                  <h3 className="mb-2 font-serif text-base font-medium text-white">{card.title}</h3>
                  <p className="text-[13px] leading-[1.7] text-white/55">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonial + photos ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-5">
              <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10">
                <img src="/images/programs/highschool-group.jpg" alt="High school students collaborating at DA Tuition" className="h-48 w-full object-cover" />
                <div className="bg-[#071629] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white/80">Collaborative group sessions</div>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10">
                <img src="/images/programs/highschool-english.jpg" alt="English tutoring at DA Tuition" className="h-48 w-full object-cover" />
                <div className="bg-[#071629] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white/80">Expert instruction</div>
              </div>
            </div>

            <div>
              <p className="mb-5 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Real Families, Real Results</p>
              <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white text-center shadow-lg shadow-[#071629]/5">
                <div className="h-[3px] bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
                <div className="p-9">
                  <div className="mb-4 flex justify-center gap-0.5 text-[#c9a227]">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mb-6 min-h-[140px] font-serif text-[16px] italic leading-[1.75] text-[#10233f]" dangerouslySetInnerHTML={{ __html: `&ldquo;${t.text}&rdquo;` }} />
                  <div className="mb-6 flex items-center justify-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c9a227]/40 bg-[#fff6e7] text-sm font-black text-[#071629]">{t.initials}</div>
                    <p className="text-sm font-bold text-[#071629]">{t.name}</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTIdx(i)}
                        aria-label={`Show testimonial ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${i === tIdx ? 'w-5 bg-[#c9a227]' : 'w-2 bg-[#071629]/15'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Fit ── */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Is This Right for Us?</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">
                DA Tuition High School Is Perfect If...
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fitItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-start gap-4 rounded-2xl border border-[#c9a227]/25 bg-[#fff6e7] p-5"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a227]" />
                  <span className="text-sm leading-7 text-[#61708a]">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/book-interview">
                <Button size="lg" className="h-12 rounded-full bg-[#071629] px-7 font-black text-white hover:bg-[#0e2a4a]">
                  Book a Free Trial Lesson
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Photo pair ── */}
        <section className="bg-[#fffdf8] px-5 pb-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10">
              <img src="/images/programs/highschool-tutor-whiteboard.jpg" alt="DA Tuition teacher explaining a concept on the whiteboard to high school students" className="h-60 w-full object-cover" />
              <div className="bg-[#071629] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white/80">Concepts explained step by step</div>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-[#071629]/10">
              <img src="/images/programs/highschool-tutoring.jpg" alt="Small group of Years 7-10 students receiving individual attention from a DA Tuition tutor" className="h-60 w-full object-cover" />
              <div className="bg-[#071629] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white/80">Individual attention, every session</div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-[#071629] px-5 py-20 text-center text-white lg:px-8">
          <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
            Do Not Wait for the<br />Report Card
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/72">
            The sooner we identify the gaps, the easier they are to close. Book a free trial lesson: no entrance exam, no lock-in contract. Just a session that shows you what is possible.
          </p>
          <div className="mt-8">
            <Link to="/book-interview">
              <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] hover:bg-[#e0bd4b]">
                Book a Free Trial Lesson
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.12em] text-white/45">
            No entrance exam · No lock-in contract · Limited spots each term
          </p>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3.5 border-t border-white/10 bg-[#071629] px-5 py-7 lg:px-8">
        <div className="text-base font-black text-white">DA <span className="text-[#e0bd4b]">Tuition</span></div>
        <p className="text-xs text-white/45">© 2025 DA Tuition · Sydney, Australia</p>
        <p className="text-xs text-white/45">hello@datuition.com.au</p>
      </footer>
    </div>
  );
};

export default HighSchool;
