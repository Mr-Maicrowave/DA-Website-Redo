import { useState, useEffect, useRef, useMemo } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Trophy, TrendingUp, Star, Quote, ArrowRight, Target, BookOpen, Heart,
  MessageSquareQuote, Search, Flag, Sparkles, Award, Users, type LucideIcon,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { successStories, SuccessStory } from '@/data/successStories';
import { siteStats } from '@/data/site-stats';
import CTASection from '@/components/CTASection';

/* ── Count-up hook for the hero stat row ── */
function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame: number;
    const raf = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(raf);
      else setValue(target);
    };
    frame = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);
  return value;
}

const parseNum = (s: string | number) => Number(String(s).replace(/[^0-9.]/g, '')) || 0;

/* ── Explore More: link cards to the focused pages ── */
const exploreLinks = [
  {
    to: '/reviews',
    icon: Star,
    title: 'Google Reviews',
    desc: `Browse all ${siteStats.reviewCount}+ five-star reviews from DA families.`,
    color: '#c9a227',
  },
  {
    to: '/testimonials',
    icon: MessageSquareQuote,
    title: 'Letters & Reflections',
    desc: 'Principal messages, parent letters, and student reflections.',
    color: '#2563eb',
  },
  {
    to: '/appreciation-advice',
    icon: Heart,
    title: 'Appreciation & Advice',
    desc: 'Heartfelt notes and study advice from our top achievers.',
    color: '#db2777',
  },
  {
    to: '/interview',
    icon: BookOpen,
    title: "Principal's Reflections",
    desc: 'Our philosophy, values, and vision for every child.',
    color: '#16a34a',
  },
];

function ExploreCard({ to, icon: Icon, title, desc, color }: typeof exploreLinks[number]) {
  return (
    <Link to={to} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#071629]/10 bg-white p-7 shadow-lg shadow-[#071629]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#071629]/10">
        <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border" style={{ borderColor: `${color}30`, background: `${color}0f` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <h3 className="mb-2 font-serif text-lg font-medium text-[#071629]">{title}</h3>
        <p className="mb-5 flex-grow text-sm leading-relaxed text-[#61708a]">{desc}</p>
        <span className="inline-flex items-center text-xs font-black uppercase tracking-[0.14em]" style={{ color }}>
          Explore <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/* ── Section heading, matches the Science page's editorial header pattern ── */
const SectionHeader = ({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) => (
  <div className="mb-12 grid gap-6 lg:grid-cols-[.85fr_1fr] lg:items-end">
    <div>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#c9a227]">{eyebrow}</p>
      <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-[#071629] lg:text-5xl">{title}</h2>
    </div>
    {text && <p className="max-w-2xl text-base leading-8 text-[#61708a]">{text}</p>}
  </div>
);

/* ── Animated hero stat tile ── */
function HeroStat({ target, suffix, label, active, icon: Icon, index = 0 }: { target: number; suffix: string; label: string; active: boolean; icon: LucideIcon; index?: number }) {
  const count = useCountUp(target, 1600, active);
  return (
    <div
      className="relative rounded-2xl border border-white/14 bg-white/[0.07] p-4 text-center backdrop-blur-xl transition-all duration-500 sm:p-6"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute left-1/2 top-0 h-[2px] w-10 -translate-x-1/2 bg-gradient-to-r from-[#c9a227] to-[#f1df9a]" />
      <Icon className="mx-auto mb-2 h-4 w-4 text-[#f1df9a]/80 sm:h-5 sm:w-5" />
      <div className="font-serif text-2xl font-medium text-[#f1df9a] sm:text-3xl">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white/65 sm:text-[11px]">{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE — Success Stories hub
   ══════════════════════════════════════════════════════════════ */
const SuccessStoriesPage = () => {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [activeSubject, setActiveSubject] = useState('All');
  const [search, setSearch] = useState('');
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const heroStatsInView = useInView(heroStatsRef, { once: true, margin: '-100px' });

  const subjects = useMemo(() => ['All', ...Array.from(new Set(successStories.map(s => s.subject)))], []);

  const filteredStories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return successStories.filter((s) => {
      const matchesSubject = activeSubject === 'All' || s.subject === activeSubject;
      const matchesSearch = !q || [s.name, s.subject, s.achievement, s.school, s.quote].join(' ').toLowerCase().includes(q);
      return matchesSubject && matchesSearch;
    });
  }, [activeSubject, search]);

  // Spotlight: rotates randomly between all Achievement Wall stories on each visit, for variety
  const spotlightStory = useMemo(
    () => successStories[Math.floor(Math.random() * successStories.length)],
    []
  );

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title="Success Stories & Reviews"
        description="Real results from real students. Explore DA Tuition's top achievements, 5-star Google reviews, parent letters, and student reflections."
        canonicalUrl="/success-stories"
      />
      <NavigationNew />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/v3/hero_team.jpg"
              alt="DA Tuition students and teachers celebrating success"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-5 pb-24 text-center lg:px-8 lg:pb-28">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
                <Trophy className="h-4 w-4" />
                Real Results from Real Students
              </div>

              <div className="mb-6 flex items-center justify-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#f1df9a] text-[#f1df9a]" />)}
                </div>
                <span className="text-sm font-bold text-[#f1df9a]">{siteStats.googleRating}</span>
                <span className="text-sm text-white/55">from {siteStats.reviewCount}+ Google reviews</span>
              </div>

              <h1 className="mx-auto max-w-3xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Real students.<br className="hidden sm:block" /> Real <span className="text-[#f1df9a]">transformations.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
                Every mark tells a story — but the confidence, resilience, and growth behind it matter just as much. These are their journeys, in their own words.
              </p>

              <div ref={heroStatsRef} className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                <HeroStat target={parseNum(siteStats.yearsExperience)} suffix="+" label="Years of Impact" active={heroStatsInView} icon={Award} index={0} />
                <HeroStat target={parseNum(siteStats.studentsHelped)} suffix="+" label="Students Helped" active={heroStatsInView} icon={Users} index={1} />
                <HeroStat target={parseNum(siteStats.reviewCount)} suffix="+" label="Google Reviews" active={heroStatsInView} icon={Star} index={2} />
                <HeroStat target={successStories.length} suffix="" label="Featured Achievements" active={heroStatsInView} icon={Trophy} index={3} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Anchor nav ── */}
        <section className="-mt-10 px-5 lg:px-8">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-3 rounded-3xl border border-[#c9a227]/20 bg-[#fffdf8] p-3 shadow-2xl shadow-[#071629]/10 md:grid-cols-4">
            {[
              ['Turning Point', '#turning-point'],
              ['Achievement Wall', '#achievement-wall'],
              ['All Stories', '#all-stories'],
              ['More Reviews', '#explore-more'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-2xl px-4 py-3 text-center text-sm font-black text-[#10233f] transition hover:bg-[#fff6e7]">
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* ── SPOTLIGHT — the literal "turning point" ── */}
        <section id="turning-point" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-[#071629] px-6 py-16 text-center sm:px-16 sm:py-24"
            >
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#c9a227]/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#2563eb]/10 blur-3xl" />
              <div className="relative z-10">
                <Sparkles className="mx-auto mb-6 h-8 w-8 text-[#c9a227]" />
                <p className="mb-6 text-xs font-black uppercase tracking-[0.28em] text-[#c9a227]">The Turning Point</p>
                <p className="mb-8 font-serif text-2xl font-medium italic leading-snug text-white sm:text-4xl">
                  "{spotlightStory.turningPoint.replace(/^"|"$/g, '')}"
                </p>
                <p className="mb-6 text-sm text-white/55 sm:text-base">
                  {spotlightStory.before} Today: {spotlightStory.after}
                </p>
                <button
                  onClick={() => setSelectedStory(spotlightStory)}
                  className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-[0.1em] text-[#f1df9a] transition hover:text-[#c9a227]"
                >
                  — {spotlightStory.name}, {spotlightStory.subject} · Read her full story <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ACHIEVEMENT WALL ── */}
        <section id="achievement-wall" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="By The Numbers" title="The Achievement Wall" text="Five different starting points. Five different breakthroughs." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {successStories.map((story, i) => (
                <motion.button
                  key={story.reviewId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  onClick={() => setSelectedStory(story)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#071629]/5 bg-white p-6 text-left shadow-lg shadow-[#071629]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#071629]/10"
                >
                  <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${story.tone.avatarText}, transparent)` }} />

                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold"
                      style={{ background: story.tone.avatarBg, color: story.tone.avatarText }}
                    >
                      {story.name.charAt(0)}
                    </div>
                    <Trophy className="h-4 w-4 opacity-40" style={{ color: story.tone.avatarText }} />
                  </div>

                  <div className="my-5 flex-grow">
                    <div className="font-serif text-xl font-medium leading-tight text-[#071629]">
                      {story.achievement}
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#61708a]">{story.after}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#071629]/8 pt-4">
                    <div>
                      <div className="text-sm font-bold text-[#071629]">{story.name}</div>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#61708a]">{story.subject}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#071629]/30 transition-transform group-hover:translate-x-1 group-hover:text-[#071629]/70" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED ACHIEVEMENTS — filterable grid ── */}
        <section id="all-stories" className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="In Their Own Words" title="Every Story, A Different Journey" />

            {/* Filters + search */}
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                {subjects.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setActiveSubject(subj)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                      activeSubject === subj
                        ? 'border-[#071629] bg-[#071629] text-white'
                        : 'border-[#071629]/15 bg-white text-[#61708a] hover:border-[#071629]/30'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
              <div className="relative sm:ml-auto sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#61708a]/60" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories..."
                  className="w-full rounded-full border border-[#071629]/15 py-2 pl-9 pr-3 text-sm focus:border-[#c9a227]/50 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/20"
                />
              </div>
            </div>

            {filteredStories.length === 0 ? (
              <div className="py-16 text-center text-[#61708a]/60">No stories match that search just yet.</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredStories.map((story, i) => (
                  <motion.div
                    key={story.reviewId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: (i % 6) * 0.06 }}
                    className="flex flex-col overflow-hidden rounded-[2rem] border border-[#071629]/10 bg-white shadow-lg shadow-[#071629]/5 transition-shadow hover:shadow-2xl hover:shadow-[#071629]/10"
                  >
                    <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${story.tone.avatarText}, ${story.tone.avatarText}80, ${story.tone.avatarText})` }} />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif font-bold"
                          style={{ background: story.tone.avatarBg, color: story.tone.avatarText }}
                        >
                          {story.name.charAt(0)}
                        </div>
                        <div className="flex-grow">
                          <p className="font-serif text-lg font-medium text-[#071629]">{story.name}</p>
                          <p className="text-sm text-[#61708a]">{story.school}</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-[#071629]/10 px-2.5 py-1 text-[10px] font-bold text-[#071629]/70">{story.subject}</span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-[#c9a227]" />
                        <span className="text-sm font-bold text-[#071629]">{story.achievement}</span>
                      </div>
                      <p className="mt-4 line-clamp-3 flex-grow font-serif text-sm italic leading-relaxed text-[#3d4f6a]">"{story.quote}"</p>
                      <Button
                        variant="outline"
                        className="mt-5 w-full rounded-full border-[#071629]/15 text-sm font-bold text-[#071629] hover:bg-[#fff6e7]"
                        onClick={() => setSelectedStory(story)}
                      >
                        Read Full Story
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── EXPLORE MORE ── */}
        <section id="explore-more" className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Keep Exploring" title="More Stories & Reviews" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {exploreLinks.map((link) => <ExploreCard key={link.to} {...link} />)}
            </div>
          </div>
        </section>

        {/* ── DA Journey Timeline ── */}
        <section className="bg-[#071629] px-5 py-24 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">The Process</p>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-white lg:text-5xl">
                The DA Tuition Journey
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/50">
                How we transform students from where they start to where they're capable of going.
              </p>
              <div className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
            </div>

            <div className="relative">
              <div
                className="absolute left-0 right-0 top-[54px] hidden h-px lg:block"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 4%, rgba(201,162,39,0.15) 20%, rgba(201,162,39,0.15) 80%, transparent 96%)',
                }}
              />
              <div className="grid gap-5 lg:grid-cols-4 lg:gap-4">
                {[
                  { n: '01', icon: Target, title: 'Initial Interview', text: 'An initial interview identifies strengths and gaps. We create a personalised learning plan.' },
                  { n: '02', icon: BookOpen, title: 'Structured Learning', text: 'Our exam-focused curriculum builds understanding systematically.' },
                  { n: '03', icon: TrendingUp, title: 'Progress Tracking', text: 'Regular assessments and feedback ensure continuous improvement.' },
                  { n: '04', icon: Trophy, title: 'Achievement', text: 'Students achieve their goals, from passing grades to state rankings.' },
                ].map((step, index) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, delay: index * 0.1 }}
                    className="group relative z-10 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-7 text-center transition duration-300 hover:border-[#c9a227]/25 hover:bg-white/[0.07]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#c9a227]/35 to-transparent transition duration-500 group-hover:via-[#c9a227]/75" />
                    <p className="mb-5 font-serif text-[11px] tracking-[0.22em] text-[#c9a227]/45 transition duration-300 group-hover:text-[#c9a227]/80">
                      {step.n}
                    </p>
                    <div className="mb-5 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a227]/20 bg-[#c9a227]/[0.06] transition duration-300 group-hover:border-[#c9a227]/45 group-hover:bg-[#c9a227]/[0.13]">
                        <step.icon strokeWidth={1.4} className="h-5 w-5 text-[#c9a227]/55 transition duration-300 group-hover:text-[#c9a227]" />
                      </div>
                    </div>
                    <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.26em] text-white/65 transition duration-300 group-hover:text-[#f1df9a]">
                      {step.title}
                    </p>
                    <div className="mx-auto mb-5 h-px w-7 bg-[#c9a227]/20 transition duration-300 group-hover:bg-[#c9a227]/55" />
                    <p className="text-[13px] leading-[1.85] text-white/42 transition duration-300 group-hover:text-white/70">
                      {step.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <CTASection heading="Write Your Success Story" subheading="Join the thousands of students who've transformed their academic journey. Your child's success story starts with a professional interview." className="bg-brand-navy" />

      <FooterNew />

      {/* Story Detail Modal — before / turning point / after journey */}
      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[1.75rem] border-[#071629]/10">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2 font-serif text-2xl font-medium text-[#071629]">
                  {selectedStory.name}
                  <span className="rounded-full border border-[#071629]/15 px-2.5 py-1 text-xs font-bold text-[#071629]/70">{selectedStory.subject}</span>
                </DialogTitle>
                <DialogDescription className="mt-1 text-base text-[#61708a]">{selectedStory.school}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex items-center gap-3 rounded-xl border border-[#c9a227]/20 bg-[#fff6e7] p-4">
                  <div className="rounded-full bg-[#c9a227]/15 p-2"><Trophy className="h-6 w-6 text-[#c9a227]" /></div>
                  <div>
                    <div className="mb-0.5 text-sm font-bold text-[#9a7517]">Key Achievement</div>
                    <div className="font-serif text-lg font-medium text-[#071629]">{selectedStory.achievement}</div>
                  </div>
                </div>

                {/* Journey: before → turning point → after */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#071629]/10 bg-[#fffdf8] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#61708a]">
                      <Flag className="h-3.5 w-3.5" /> Where it started
                    </div>
                    <p className="text-sm leading-relaxed text-[#3d4f6a]">{selectedStory.before}</p>
                  </div>
                  <div className="rounded-2xl border-2 border-[#c9a227]/40 bg-[#fff6e7] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#9a7517]">
                      <Sparkles className="h-3.5 w-3.5" /> The turning point
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[#7a5e10]">{selectedStory.turningPoint}</p>
                  </div>
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-green-700">
                      <Trophy className="h-3.5 w-3.5" /> Where they ended up
                    </div>
                    <p className="text-sm leading-relaxed text-green-900">{selectedStory.after}</p>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -left-2 -top-4 h-8 w-8 text-[#071629]/10" />
                  <p className="relative z-10 mb-4 whitespace-pre-line pl-6 font-serif text-lg italic leading-relaxed text-[#10233f]">"{selectedStory.quote}"</p>
                  <div className="relative z-10 space-y-4 whitespace-pre-line pl-6 text-base leading-relaxed text-[#3d4f6a]">
                    <p>{selectedStory.appreciation}</p>
                    <p>{selectedStory.advice}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-[#071629]/10 pt-4 text-sm text-[#61708a]">
                  <Star className="h-4 w-4 fill-[#c9a227] text-[#c9a227]" />
                  <span className="font-bold">5-Star Verified Google Review</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessStoriesPage;
