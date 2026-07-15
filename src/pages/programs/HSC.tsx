import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Clock, Users, CheckCircle, ArrowRight, Quote, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { siteStats } from '@/data/site-stats';
import ChapterOpening from '@/components/chapter/ChapterOpening';
import ChapterTabs from '@/components/chapter/ChapterTabs';
import ChapterLabel from '@/components/chapter/ChapterLabel';
import GoldDivider from '@/components/chapter/GoldDivider';
import PaperSection from '@/components/chapter/PaperSection';
import NavySection from '@/components/chapter/NavySection';
import EditorialImage from '@/components/chapter/EditorialImage';

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

const chapterTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'strategies', label: 'Strategies' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'enrol', label: 'Enrol' },
];

const HSC = () => {
  return (
    <div className="min-h-screen bg-brand-ivory text-brand-navy">
      <SEO
        title="HSC Tutoring & Excellence Program"
        description={`Your pathway to Band 6 results and the ATAR you deserve—with proven strategies from ${siteStats.yearsExperience} years of HSC success at DA Tuition.`}
        canonicalUrl="/hsc-excellence"
      />
      <NavigationNew />
      <StickyBookButton />
      <ChapterTabs tabs={chapterTabs} />

      <main>
        {/* ── Chapter opening spread ── */}
        <ChapterOpening
          number="03"
          eyebrow="Years 11 & 12"
          title={<>HSC Excellence<br /><em className="italic text-brand-gold">Program</em></>}
          intro={<>Your pathway to Band 6 results and the ATAR you deserve—with proven strategies from {siteStats.yearsExperience} years of HSC success.</>}
          image="/images/programs/hsc-physics.jpg"
          imageAlt="HSC Classroom"
        />

        {/* ── Results banner — navy band with gold serif figures ── */}
        <NavySection>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-14 text-center md:grid-cols-4 md:py-16 lg:px-8">
            {results.map((result) => (
              <div key={result.description}>
                <div className="font-display text-4xl font-bold text-brand-lightGold md:text-5xl">{result.stat}</div>
                <div className="mt-2 text-sm font-medium text-white/80 md:text-base">{result.description}</div>
                <div className="mt-1 text-xs font-bold tracking-wider text-white/40">{result.year}</div>
              </div>
            ))}
          </div>
          <div className="da-gold-rule" aria-hidden="true" />
        </NavySection>

        {/* ── Intro + features ── */}
        <PaperSection id="overview" pageEdge>
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <ChapterLabel style={{ marginBottom: 12 }}>Why It Matters</ChapterLabel>
              <h2 className="mb-6 font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-brand-navy md:text-5xl">The Most Important Two Years</h2>
              <GoldDivider width={110} style={{ margin: '0 0 24px' }} />
              <div className="space-y-4 text-base leading-8 text-brand-navy/70">
                <p>The HSC isn't just about memorizing content - it's about mastering the art of high-level thinking, effective communication, and strategic exam performance. At DA Tuition, we've guided hundreds of students to HSC success with a proven formula.</p>
                <p>Our HSC program goes beyond traditional tutoring. We become your academic partners, providing not just subject expertise but also mentorship, motivation, and the confidence needed to perform at your best.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="da-shimmer relative rounded-lg border border-brand-gold/25 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span aria-hidden="true" className="absolute right-4 top-3 font-display text-2xl italic text-brand-gold/30">{String(i + 1).padStart(2, '0')}</span>
                  <feature.icon className="mb-4 h-7 w-7 text-brand-gold" />
                  <h3 className="mb-2 font-bold text-brand-navy">{feature.title}</h3>
                  <p className="text-sm leading-snug text-brand-navy/65">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </PaperSection>

        {/* ── Visual proof — editorial photo mounts ── */}
        <PaperSection>
          <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:grid-cols-2 lg:px-8">
            <figure className="m-0">
              <EditorialImage src="/images/programs/hsc-maths.jpg" alt="HSC Mathematics tutoring at DA Tuition" ratio="4 / 2.9" />
              <figcaption className="mt-3 text-center text-sm font-bold uppercase tracking-wide text-brand-navy/70">HSC Mathematics</figcaption>
            </figure>
            <figure className="m-0">
              <EditorialImage src="/images/programs/hsc-physics.jpg" alt="HSC Sciences tutoring at DA Tuition" ratio="4 / 2.9" />
              <figcaption className="mt-3 text-center text-sm font-bold uppercase tracking-wide text-brand-navy/70">HSC Sciences</figcaption>
            </figure>
          </div>
        </PaperSection>

        {/* ── Band 6 strategies + testimonial ── */}
        <section id="strategies" className="bg-[#EDE5D4] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
            <div className="rounded-lg border border-brand-gold/25 bg-white p-8 shadow-lg shadow-brand-navy/5 lg:col-span-7 md:p-12">
              <h3 className="mb-8 font-display text-3xl font-semibold text-brand-navy">Band 6 Success Strategies</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-brand-gold bg-brand-ivory p-6">
                  <h4 className="mb-2 flex items-center font-bold text-brand-navy">
                    <TrendingUp className="mr-2 h-5 w-5 text-brand-gold" /> Assessment Task Excellence
                  </h4>
                  <p className="text-brand-navy/65">Master every assessment with detailed feedback, exemplar responses, and strategic planning for maximum marks.</p>
                </div>
                <div className="border-l-2 border-brand-gold bg-brand-ivory p-6">
                  <h4 className="mb-2 flex items-center font-bold text-brand-navy">
                    <Award className="mr-2 h-5 w-5 text-brand-gold" /> Exam Technique Mastery
                  </h4>
                  <p className="text-brand-navy/65">Learn time management, question analysis, and response structuring from teachers who've achieved Band 6 themselves.</p>
                </div>
                <div className="border-l-2 border-brand-gold bg-brand-ivory p-6">
                  <h4 className="mb-2 flex items-center font-bold text-brand-navy">
                    <Trophy className="mr-2 h-5 w-5 text-brand-gold" /> Scaling Optimization
                  </h4>
                  <p className="text-brand-navy/65">Strategic advice on subject selection and performance targets to maximize your ATAR through smart scaling.</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden rounded-lg p-8 text-white shadow-xl lg:col-span-5 md:p-12" style={{ background: 'linear-gradient(180deg, #0F2244 0%, #0A1B34 100%)' }}>
              <Quote className="mb-6 h-12 w-12 text-brand-gold/40" />
              <blockquote className="relative z-10 mb-8 font-display text-xl italic leading-relaxed text-white">
                &ldquo;DA Tuition is not just an educational environment but also collectively, a place of upbringing and encouragement. As a committed student of 8 years, DA staff are not just teachers but considered as family and also promoters of success for students to bring out the best of each individual's potentials.&rdquo;
              </blockquote>
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-brand-navy">L</div>
                <div>
                  <p className="font-bold text-brand-lightGold">Lisa Vu</p>
                  <p className="text-sm font-medium text-white/60">Year 12 Student, Cecil Hills High School</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <PaperSection id="timeline" pageEdge>
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="mb-12 mx-auto max-w-2xl text-center">
              <ChapterLabel style={{ marginBottom: 12, textAlign: 'center' }}>The Journey</ChapterLabel>
              <h2 className="mb-4 font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-brand-navy md:text-5xl">Your Timeline to Success</h2>
              <GoldDivider width={110} style={{ margin: '0 auto 18px' }} />
              <p className="text-base leading-8 text-brand-navy/70">Strategic planning across two years to maximize your ATAR potential.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {timeline.map((period, i) => (
                <div key={period.term} className="relative rounded-lg border border-brand-gold/25 bg-white p-7 shadow-sm transition-colors hover:border-brand-gold/50">
                  <span aria-hidden="true" className="absolute right-5 top-4 font-display text-3xl italic text-brand-gold/25">{String(i + 1).padStart(2, '0')}</span>
                  <div className="mb-3 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-brand-gold" />
                    <h3 className="text-lg font-bold text-brand-navy">{period.term}</h3>
                  </div>
                  <p className="font-medium text-brand-navy/65">{period.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </PaperSection>

        {/* ── Subjects ── */}
        <section id="subjects" className="bg-[#EDE5D4] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 mx-auto max-w-2xl text-center">
              <ChapterLabel style={{ marginBottom: 12, textAlign: 'center' }}>What We Teach</ChapterLabel>
              <h2 className="mb-4 font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-brand-navy md:text-5xl">Comprehensive Support</h2>
              <GoldDivider width={110} style={{ margin: '0 auto 18px' }} />
              <p className="text-base leading-8 text-brand-navy/70">Expert tutoring from teachers who achieved Band 6 in their subjects and understand the latest syllabus requirements.</p>
            </div>
            <div className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {subjects.map((subject) => (
                <div key={subject.category} className="rounded-lg border border-brand-gold/25 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="mb-1 text-center font-display text-2xl font-semibold text-brand-navy">{subject.category}</h3>
                  <GoldDivider width={64} motif={false} style={{ margin: '0 auto 16px' }} />
                  <ul className="space-y-2 text-left">
                    {subject.courses.map((course) => (
                      <li key={course} className="flex items-start">
                        <CheckCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                        <span className="text-sm font-medium text-brand-navy/85">{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/subjects">
                <Button size="lg" className="h-12 rounded-full bg-brand-navy px-7 font-black text-white hover:bg-[#0F2244]" style={{ border: '1px solid rgba(212,175,55,0.55)', boxShadow: 'inset 0 -2px 0 rgba(212,175,55,0.6)' }}>
                  Explore All Subjects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <NavySection id="enrol">
          <div className="px-5 py-20 lg:px-8">
            <div className="da-gold-corners relative mx-auto grid max-w-6xl gap-8 rounded-lg border border-brand-gold/30 bg-white/[0.05] p-8 text-center shadow-2xl md:p-12">
              <div>
                <ChapterLabel light style={{ marginBottom: 14, textAlign: 'center' }}>Begin the Next Chapter</ChapterLabel>
                <h2 className="font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-white md:text-5xl">
                  Your Band 6 Journey Starts Here
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg font-medium text-white/90">
                  Join the hundreds of students who've achieved their dream ATAR with DA Tuition.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link to="/book-interview">
                    <Button size="lg" className="h-12 rounded-full bg-brand-gold px-7 font-black text-brand-navy hover:bg-brand-lightGold">
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
          </div>
        </NavySection>
      </main>

      <FooterNew />
    </div>
  );
};

export default HSC;
