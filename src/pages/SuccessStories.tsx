import { useState, useEffect, useRef, useMemo } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Trophy, TrendingUp, Star, Quote, ArrowRight, Target, BookOpen, Heart,
  MessageSquareQuote, Search, Flag, Sparkles, Award, Users, type LucideIcon,
} from 'lucide-react';
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

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const parseNum = (s: string | number) => Number(String(s).replace(/[^0-9.]/g, '')) || 0;

/** Same serif headline font used across the program pages (HighSchool, PrimarySchool, etc.) */
const headingFont = "'Merriweather', Georgia, serif";

/* ── Explore More: link cards to the focused pages ── */
const exploreLinks = [
  {
    to: '/reviews',
    icon: Star,
    title: 'Google Reviews',
    desc: `Browse all ${siteStats.reviewCount}+ five-star reviews from DA families.`,
    accent: 'from-amber-400 to-yellow-400',
  },
  {
    to: '/testimonials',
    icon: MessageSquareQuote,
    title: 'Letters & Reflections',
    desc: 'Principal messages, parent letters, and student reflections.',
    accent: 'from-brand-navy to-teal-600',
  },
  {
    to: '/appreciation-advice',
    icon: Heart,
    title: 'Appreciation & Advice',
    desc: 'Heartfelt notes and study advice from our top achievers.',
    accent: 'from-purple-400 to-pink-400',
  },
  {
    to: '/principal-reflections',
    icon: BookOpen,
    title: "Principal's Reflections",
    desc: 'Our philosophy, values, and vision for every child.',
    accent: 'from-blue-400 to-indigo-400',
  },
];

function ExploreCard({ to, icon: Icon, title, desc, accent }: typeof exploreLinks[number]) {
  return (
    <Link to={to} className="block group">
      <div className="relative h-full bg-white rounded-2xl border border-stone-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-stone-300">
        <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
        <div className="p-6 flex flex-col h-full">
          <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center mb-4">
            <Icon className="w-5 h-5 text-brand-navy" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-2">{title}</h3>
          <p className="text-sm text-stone-500 leading-relaxed mb-4 flex-grow">{desc}</p>
          <span className="inline-flex items-center text-sm font-semibold text-brand-navy/80 group-hover:text-brand-navy transition-colors">
            Explore <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Section Heading ── */
function SectionHeading({ children, subheading }: { children: React.ReactNode; subheading?: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-stone-900" style={{ fontFamily: headingFont }}>{children}</h2>
      <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mt-3 rounded-full" />
      {subheading && <p className="text-stone-500 mt-3 max-w-2xl">{subheading}</p>}
    </div>
  );
}

/* ── Animated hero stat tile ── */
function HeroStat({ target, suffix, label, active, decimals, icon: Icon, index = 0 }: { target: number; suffix: string; label: string; active: boolean; decimals?: number; icon: LucideIcon; index?: number }) {
  const count = useCountUp(target, 1600, active);
  const display = decimals ? (active ? (count / Math.pow(10, decimals)).toFixed(decimals) : (0).toFixed(decimals)) : count.toLocaleString();
  return (
    <div
      className="relative rounded-2xl p-4 sm:p-6 text-center overflow-hidden border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1 hover:border-amber-300/40"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 100%)',
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* gold hairline accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-gradient-to-r from-amber-300 to-yellow-400" />
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300/80 mx-auto mb-2" />
      <div
        className="text-2xl sm:text-3xl font-extrabold mb-1 bg-gradient-to-b from-yellow-300 to-amber-400 bg-clip-text text-transparent"
        style={{ fontFamily: headingFont }}
      >
        {display}{suffix}
      </div>
      <div className="text-[9px] sm:text-sm text-white/80 font-medium">{label}</div>
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
  const { ref: heroStatsRef, inView: heroStatsInView } = useInView<HTMLDivElement>(0.2);

  const subjects = useMemo(() => ['All', ...Array.from(new Set(successStories.map(s => s.subject)))], []);

  const filteredStories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return successStories.filter((s) => {
      const matchesSubject = activeSubject === 'All' || s.subject === activeSubject;
      const matchesSearch = !q || [s.name, s.subject, s.achievement, s.school, s.quote].join(' ').toLowerCase().includes(q);
      return matchesSubject && matchesSearch;
    });
  }, [activeSubject, search]);

  // Spotlight: the story whose own words literally describe a "turning point"
  const spotlightStory = successStories.find(s => s.name === 'Melissa Ly') ?? successStories[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      <SEO
        title="Success Stories & Reviews"
        description="Real results from real students. Explore DA Tuition's top achievements, 5-star Google reviews, parent letters, and student reflections."
        canonicalUrl="/success-stories"
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">

        {/* ═══ HERO — cinematic ═══ */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-20">
          <div className="absolute inset-0">
            <img src="/images/v3/hero_team.jpg" alt="DA Tuition Success" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-rose-500/20 to-pink-500/30 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center py-14 sm:py-20 lg:py-28 px-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-semibold text-yellow-300">{siteStats.googleRating}</span>
              <span className="text-sm text-white/60">from {siteStats.reviewCount}+ Google reviews</span>
            </div>

            <Badge className="mb-6 px-4 py-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 backdrop-blur-md shadow-lg">
              Real Results from Real Students
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.05] drop-shadow-lg" style={{ fontFamily: headingFont }}>
              Real students.<br className="hidden sm:block" /> Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300">transformations.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-12 drop-shadow-md font-medium">
              Every mark tells a story — but the confidence, resilience, and growth behind it matter just as much. These are their journeys, in their own words.
            </p>

            <div ref={heroStatsRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
              <HeroStat target={parseNum(siteStats.yearsExperience)} suffix="+" label="Years of Impact" active={heroStatsInView} icon={Award} index={0} />
              <HeroStat target={parseNum(siteStats.studentsHelped)} suffix="+" label="Students Helped" active={heroStatsInView} icon={Users} index={1} />
              <HeroStat target={parseNum(siteStats.reviewCount)} suffix="+" label="Google Reviews" active={heroStatsInView} icon={Star} index={2} />
              <HeroStat target={successStories.length} suffix="" label="Featured Achievements" active={heroStatsInView} icon={Trophy} index={3} />
            </div>
          </div>
        </section>

        {/* ═══ SPOTLIGHT — big Apple-style pull quote, the literal "turning point" ═══ */}
        <section className="mb-20 px-4 sm:px-0">
          <div className="relative rounded-[2.5rem] bg-stone-900 px-6 sm:px-16 py-16 sm:py-24 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-6" />
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold mb-6">The Turning Point</p>
              <p className="text-2xl sm:text-4xl font-bold italic text-white leading-snug mb-8" style={{ fontFamily: headingFont }}>
                "{spotlightStory.turningPoint.replace(/^"|"$/g, '')}"
              </p>
              <p className="text-white/60 text-sm sm:text-base mb-6">
                {spotlightStory.before} Today: {spotlightStory.after}
              </p>
              <button
                onClick={() => setSelectedStory(spotlightStory)}
                className="inline-flex items-center text-amber-300 font-semibold text-sm hover:text-amber-200 transition-colors"
              >
                — {spotlightStory.name}, {spotlightStory.subject} · Read her full story <ArrowRight className="ml-1.5 w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ═══ ACHIEVEMENT WALL ═══ */}
        <section className="mb-20 px-4 sm:px-0">
          <SectionHeading subheading="Five different starting points. Five different breakthroughs.">Achievement Wall</SectionHeading>
          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[150px] lg:auto-rows-[170px] gap-4 lg:gap-5 grid-flow-row-dense">
            {successStories.map((story, i) => {
              const sizeClass = [
                'col-span-2 row-span-2',
                'col-span-1 row-span-1',
                'col-span-1 row-span-2',
                'col-span-2 row-span-1',
                'col-span-2 lg:col-span-1 row-span-1',
              ][i % 5];
              const isBig = sizeClass.includes('row-span-2');
              return (
                <button
                  key={story.reviewId}
                  onClick={() => setSelectedStory(story)}
                  className={`${sizeClass} text-left rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-stone-900/5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
                  style={{ background: story.tone.bg }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ background: story.tone.avatarBg, color: story.tone.avatarText }}
                    >
                      {story.name.charAt(0)}
                    </div>
                    <Badge variant="outline" className="text-[10px] border-stone-900/10 bg-white/60">{story.subject}</Badge>
                  </div>
                  <div>
                    <div className={`font-extrabold text-stone-900 leading-tight mb-1 ${isBig ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`} style={{ fontFamily: headingFont }}>
                      {story.achievement}
                    </div>
                    <div className="text-sm text-stone-600 font-medium">{story.name}</div>
                    {isBig && <p className="text-xs text-stone-500 mt-2 line-clamp-2">{story.after}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══ FEATURED ACHIEVEMENTS — filterable grid ═══ */}
        <section className="mb-20 px-4 sm:px-0">
          <SectionHeading>Every Story, In Their Own Words</SectionHeading>

          {/* Filters + search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setActiveSubject(subj)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    activeSubject === subj
                      ? 'bg-brand-navy text-white border-brand-navy'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories..."
                className="w-full pl-9 pr-3 py-2 rounded-full border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy/40"
              />
            </div>
          </div>

          {filteredStories.length === 0 ? (
            <div className="text-center py-16 text-stone-400">No stories match that search just yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <Card key={story.reviewId} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                  <div className="h-2" style={{ background: story.tone.avatarText }} />
                  <CardHeader className="shrink-0">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0"
                        style={{ background: story.tone.avatarBg, color: story.tone.avatarText }}
                      >
                        {story.name.charAt(0)}
                      </div>
                      <div className="flex-grow">
                        <CardTitle className="text-lg" style={{ fontFamily: headingFont }}>{story.name}</CardTitle>
                        <p className="text-sm text-brand-midnight/80">{story.school}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">{story.subject}</Badge>
                    </div>
                    <div className="flex items-center mt-3">
                      <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="font-semibold text-sm">{story.achievement}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="text-sm text-brand-midnight/80 italic line-clamp-3 flex-grow">"{story.quote}"</p>
                    <Button variant="outline" className="w-full mt-4 shrink-0" size="sm" onClick={() => setSelectedStory(story)}>Read Full Story</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ═══ EXPLORE MORE ═══ */}
        <section className="mb-20 px-4 sm:px-0">
          <SectionHeading>More Stories &amp; Reviews</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {exploreLinks.map((link) => <ExploreCard key={link.to} {...link} />)}
          </div>
        </section>

        {/* DA Journey Timeline */}
        <section className="py-16 bg-brand-navy text-white relative overflow-hidden rounded-[2.5rem] mb-16 mx-4 sm:mx-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-yellow rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: headingFont }}>The DA Tuition Journey</h2>
              <p className="text-xl opacity-90">How we transform students</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                { icon: Target, title: "Initial Interview", desc: "An initial interview identifies strengths and gaps. We create a personalized learning plan." },
                { icon: BookOpen, title: "Structured Learning", desc: "Our exam-focused curriculum builds understanding systematically." },
                { icon: TrendingUp, title: "Progress Tracking", desc: "Regular assessments and feedback ensure continuous improvement." },
                { icon: Trophy, title: "Achievement", desc: "Students achieve their goals, from passing grades to state rankings." },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3">{step.title}</h3>
                  <p className="opacity-90 text-sm sm:text-base">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <CTASection heading="Write Your Success Story" subheading="Join the thousands of students who've transformed their academic journey. Your child's success story starts with a professional interview." className="bg-brand-navy" />

      <FooterNew />

      {/* Story Detail Modal — before / turning point / after journey */}
      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex flex-wrap items-center gap-2" style={{ fontFamily: headingFont }}>
                  {selectedStory.name}
                  <Badge variant="outline">{selectedStory.subject}</Badge>
                </DialogTitle>
                <DialogDescription className="text-lg mt-1">{selectedStory.school}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full"><Trophy className="w-6 h-6 text-yellow-600" /></div>
                  <div>
                    <div className="text-sm text-yellow-800 font-semibold mb-0.5">Key Achievement</div>
                    <div className="text-lg font-bold text-brand-midnight">{selectedStory.achievement}</div>
                  </div>
                </div>

                {/* Journey: before → turning point → after */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl p-4 border border-stone-200 bg-stone-50">
                    <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wide mb-2">
                      <Flag className="w-3.5 h-3.5" /> Where it started
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">{selectedStory.before}</p>
                  </div>
                  <div className="rounded-2xl p-4 border-2 border-amber-300 bg-amber-50">
                    <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wide mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> The turning point
                    </div>
                    <p className="text-sm text-amber-900 leading-relaxed font-medium">{selectedStory.turningPoint}</p>
                  </div>
                  <div className="rounded-2xl p-4 border border-green-200 bg-green-50">
                    <div className="flex items-center gap-2 text-green-700 text-xs font-semibold uppercase tracking-wide mb-2">
                      <Trophy className="w-3.5 h-3.5" /> Where they ended up
                    </div>
                    <p className="text-sm text-green-900 leading-relaxed">{selectedStory.after}</p>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="w-8 h-8 text-gray-200 absolute -top-4 -left-2" />
                  <p className="relative z-10 text-brand-midnight/80 text-lg leading-relaxed pl-6 italic mb-4 whitespace-pre-line">"{selectedStory.quote}"</p>
                  <div className="relative z-10 text-brand-midnight/80 text-base leading-relaxed pl-6 whitespace-pre-line space-y-4">
                    <p>{selectedStory.appreciation}</p>
                    <p>{selectedStory.advice}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-4 text-sm text-brand-midnight/70 border-t">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">5-Star Verified Google Review</span>
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
