import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Clock, Users, CheckCircle, ArrowRight, Quote, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { siteStats } from '@/data/site-stats';
import { motion } from 'framer-motion';

const features = [
  { icon: Trophy, title: 'ATAR Maximization', description: 'Strategic focus on scaling and band optimization' },
  { icon: TrendingUp, title: 'Band 6 Strategies', description: 'Proven techniques from past high achievers' },
  { icon: Clock, title: 'Time Management', description: 'Balancing study, assessments, and wellbeing' },
  { icon: Users, title: 'Small Groups', description: 'Matched to small groups (3-5), classes, or accelerated programs' },
];

const subjects = [
  { category: 'Mathematics', courses: ['Mathematics Standard', 'Mathematics Advanced', 'Mathematics Extension 1', 'Mathematics Extension 2'] },
  { category: 'English', courses: ['English Standard', 'English Advanced', 'English Extension 1', 'English Extension 2'] },
  { category: 'Sciences', courses: ['Physics', 'Chemistry', 'Biology', 'Earth & Environmental Science'] },
  { category: 'Commerce', courses: ['Business Studies', 'Legal Studies'] },
];

const timeline = [
  { term: 'Year 11 - Term 1', focus: 'Foundation building, study habits, subject mastery' },
  { term: 'Year 11 - Terms 2-3', focus: 'Preliminary exams, assessment preparation, skill refinement' },
  { term: 'Year 11 - Term 4', focus: 'HSC course transition and preparation' },
  { term: 'Year 12 - Term 1', focus: 'HSC content mastery, trial preparation begins' },
  { term: 'Year 12 - Term 2', focus: 'Trial exams, intensive revision, Band 6 techniques' },
  { term: 'Year 12 - Term 3', focus: 'Final HSC preparation, exam strategies, stress management' },
];

const results = [
  { year: '2024', stat: '94%', description: 'of students achieved Band 5 or 6' },
  { year: '2024', stat: '15', description: 'students achieved ATAR 95+' },
  { year: '2023', stat: '87%', description: 'improved by 2+ bands' },
  { year: '2023', stat: '100%', description: 'university placement rate' },
];

const HSC = () => {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="HSC Tutoring & Excellence Program"
        description={`Your pathway to Band 6 results and the ATAR you deserve—with proven strategies from ${siteStats.yearsExperience} years of HSC success at DA Tuition.`}
        canonicalUrl="/hsc-excellence"
      />
      <NavigationNew />
      <StickyBookButton />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629]">
          <div className="absolute inset-0">
            <img src="/images/programs/hsc-physics.jpg" alt="HSC Classroom" className="h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto px-5 py-20 text-center lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <Star className="h-4 w-4 fill-current" />
                Years 11 & 12
              </div>
              <h1 className="font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
                HSC Excellence<br /><span className="text-[#f1df9a]">Program</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/75">
                Your pathway to Band 6 results and the ATAR you deserve—with proven strategies from {siteStats.yearsExperience} years of HSC success.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Results banner ── */}
        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-8 rounded-[2rem] border border-[#c9a227]/20 bg-[#071629] p-8 text-center shadow-2xl shadow-[#071629]/10 md:grid-cols-4 md:p-12">
            {results.map((result) => (
              <div key={result.description}>
                <div className="font-serif text-4xl font-bold text-[#f1df9a] md:text-5xl">{result.stat}</div>
                <div className="mt-2 text-sm font-medium text-white/80 md:text-base">{result.description}</div>
                <div className="mt-1 text-xs font-bold tracking-wider text-white/40">{result.year}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Intro + features ── */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">Why It Matters</p>
              <h2 className="mb-6 font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629]">The Most Important Two Years</h2>
              <div className="space-y-4 text-base leading-8 text-[#61708a]">
                <p>The HSC isn't just about memorizing content - it's about mastering the art of high-level thinking, effective communication, and strategic exam performance. At DA Tuition, we've guided hundreds of students to HSC success with a proven formula.</p>
                <p>Our HSC program goes beyond traditional tutoring. We become your academic partners, providing not just subject expertise but also mentorship, motivation, and the confidence needed to perform at your best.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-[1.5rem] border border-[#071629]/10 bg-[#fff6e7] p-6 transition hover:-translate-y-1 hover:shadow-md">
                  <feature.icon className="mb-4 h-7 w-7 text-[#c9a227]" />
                  <h3 className="mb-2 font-bold text-[#071629]">{feature.title}</h3>
                  <p className="text-sm leading-snug text-[#61708a]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Visual proof ── */}
        <section className="bg-[#fffdf8] px-5 pb-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2">
            <div className="group relative h-[280px] overflow-hidden rounded-[2rem] border border-[#071629]/10 shadow-xl md:h-[380px]">
              <img src="/images/programs/hsc-maths.jpg" alt="HSC Mathematics tutoring at DA Tuition" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071629]/75 to-transparent p-6">
                <span className="text-sm font-bold uppercase tracking-wide text-white">HSC Mathematics</span>
              </div>
            </div>
            <div className="group relative h-[280px] overflow-hidden rounded-[2rem] border border-[#071629]/10 shadow-xl md:h-[380px]">
              <img src="/images/programs/hsc-physics.jpg" alt="HSC Sciences tutoring at DA Tuition" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071629]/75 to-transparent p-6">
                <span className="text-sm font-bold uppercase tracking-wide text-white">HSC Sciences</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Band 6 strategies + testimonial ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
            <div className="rounded-[2rem] border border-[#071629]/10 bg-white p-8 shadow-lg shadow-[#071629]/5 lg:col-span-7 md:p-12">
              <h3 className="mb-8 font-serif text-3xl font-medium text-[#071629]">Band 6 Success Strategies</h3>
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#071629]/10 bg-[#fff6e7] p-6">
                  <h4 className="mb-2 flex items-center font-bold text-[#c9a227]">
                    <TrendingUp className="mr-2 h-5 w-5" /> Assessment Task Excellence
                  </h4>
                  <p className="text-[#61708a]">Master every assessment with detailed feedback, exemplar responses, and strategic planning for maximum marks.</p>
                </div>
                <div className="rounded-2xl border border-[#071629]/10 bg-[#fff6e7] p-6">
                  <h4 className="mb-2 flex items-center font-bold text-[#071629]">
                    <Award className="mr-2 h-5 w-5" /> Exam Technique Mastery
                  </h4>
                  <p className="text-[#61708a]">Learn time management, question analysis, and response structuring from teachers who've achieved Band 6 themselves.</p>
                </div>
                <div className="rounded-2xl border border-[#071629]/10 bg-[#fff6e7] p-6">
                  <h4 className="mb-2 flex items-center font-bold text-[#c9a227]">
                    <Trophy className="mr-2 h-5 w-5" /> Scaling Optimization
                  </h4>
                  <p className="text-[#61708a]">Strategic advice on subject selection and performance targets to maximize your ATAR through smart scaling.</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden rounded-[2rem] bg-[#071629] p-8 text-white shadow-xl lg:col-span-5 md:p-12">
              <Quote className="mb-6 h-12 w-12 text-[#c9a227]/40" />
              <blockquote className="relative z-10 mb-8 font-serif text-xl italic leading-relaxed text-white">
                &ldquo;DA Tuition is not just an educational environment but also collectively, a place of upbringing and encouragement. As a committed student of 8 years, DA staff are not just teachers but considered as family and also promoters of success for students to bring out the best of each individual's potentials.&rdquo;
              </blockquote>
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-[#071629]">L</div>
                <div>
                  <p className="font-bold text-[#f1df9a]">Lisa Vu</p>
                  <p className="text-sm font-medium text-white/60">Year 12 Student, Cecil Hills High School</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 mx-auto max-w-2xl text-center">
              <h2 className="mb-4 font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629]">Your Timeline to Success</h2>
              <p className="text-base leading-8 text-[#61708a]">Strategic planning across two years to maximize your ATAR potential.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {timeline.map((period) => (
                <div key={period.term} className="rounded-[1.5rem] border border-[#071629]/10 bg-white p-7 shadow-sm transition-colors hover:border-[#c9a227]/30">
                  <div className="mb-3 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#c9a227]" />
                    <h3 className="text-lg font-bold text-[#071629]">{period.term}</h3>
                  </div>
                  <p className="font-medium text-[#61708a]">{period.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Subjects ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 mx-auto max-w-2xl text-center">
              <h2 className="mb-4 font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629]">Comprehensive Support</h2>
              <p className="text-base leading-8 text-[#61708a]">Expert tutoring from teachers who achieved Band 6 in their subjects and understand the latest syllabus requirements.</p>
            </div>
            <div className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {subjects.map((subject) => (
                <div key={subject.category} className="rounded-[1.5rem] border border-[#071629]/10 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="mb-4 text-xl font-bold text-[#071629]">{subject.category}</h3>
                  <ul className="space-y-2 text-left">
                    {subject.courses.map((course) => (
                      <li key={course} className="flex items-start">
                        <CheckCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-[#c9a227]" />
                        <span className="text-sm font-medium text-[#071629]/85">{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/subjects">
                <Button size="lg" className="h-12 rounded-full bg-[#071629] px-7 font-black text-white hover:bg-[#0e2a4a]">
                  Explore All Subjects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-[#071629] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 text-center shadow-2xl md:p-12">
            <div>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white md:text-5xl">
                Your Band 6 Journey Starts Here
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-medium text-white/90">
                Join the hundreds of students who've achieved their dream ATAR with DA Tuition.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/book-interview">
                  <Button size="lg" className="h-12 rounded-full bg-[#c9a227] px-7 font-black text-[#101521] hover:bg-[#e0bd4b]">
                    Book an Interview
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/30 bg-transparent px-7 font-bold text-white hover:bg-white/10 hover:text-white"
                  onClick={() => window.location.href = '/#contact'}
                >
                  Request HSC Guide
                </Button>
              </div>
              <p className="mt-6 font-medium tracking-wide text-white/60">
                Limited spots available. Call us at <a href="tel:0401940207" className="underline transition-colors hover:text-white">0401 940 207</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
};

export default HSC;
