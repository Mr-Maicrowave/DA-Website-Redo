import { useState, useEffect } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Trophy, GraduationCap, TrendingUp, Star, Quote, ArrowRight, CheckCircle, School, Target, BookOpen, ChevronDown, Heart } from 'lucide-react';
import { successStories, SuccessStory } from '@/data/successStories';
import { testimonials, Testimonial } from '@/data/testimonials';
import { siteStats } from '@/data/site-stats';
import { sectionizeMarkdown } from '@/lib/markdown/sectionize';
import { StudentAppreciationCard } from '@/components/StudentAppreciationCard';
import StaticGoogleReviews from '@/components/StaticGoogleReviews';
import CTASection from '@/components/CTASection';

/* ── Data Setup ── */
const principalTestimonials = testimonials.filter(t => t.type === 'principal-message');
const parentTestimonials = testimonials.filter(t => t.type === 'parent-letter');
const studentTestimonials = testimonials.filter(t => t.type === 'student-review');
const FEATURED_SLUGS = ['a-student-reflection-tu-nguyen', 'a-student-reflection-angelina-nguyen'];
const featuredTestimonials = studentTestimonials.filter(t => FEATURED_SLUGS.includes(t.slug));
const regularStudentTestimonials = studentTestimonials.filter(t => !FEATURED_SLUGS.includes(t.slug));
const INITIAL_VISIBLE = 6;
const QUOTE_LENGTH = 180;

/* ── Helpers ── */
function getCardQuote(t: Testimonial): string {
  const quote = t.pullQuotes[0]?.text ?? t.bottomQuote ?? t.bodyParagraphs[0] ?? '';
  if (quote.length <= QUOTE_LENGTH) return quote;
  const trimmed = quote.slice(0, QUOTE_LENGTH);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 40 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
}

function getLabelBadge(t: Testimonial): string | null {
  if (!t.label) return null;
  if (t.label.includes('2025 GRADUATE')) return '2025 Graduate';
  if (t.label.includes('2024 GRADUATE')) return '2024 Graduate';
  if (t.label.includes('2023 GRADUATE')) return '2023 Graduate';
  if (t.label.includes('GOOGLE REVIEW')) return 'Google Review';
  return null;
}

function getSubtitleSnippet(t: Testimonial): string {
  const sub = t.subtitle || '';
  if (sub.length <= 80) return sub;
  const trimmed = sub.slice(0, 80);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 30 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
}

interface ManifestItem { filename: string; slug: string; name: string; }
interface StudentData { slug: string; name: string; appreciation?: string; advice?: string; }

function extractSection(markdown: string, title: string): string | undefined {
  const sections = sectionizeMarkdown(markdown, { splitBy: 'h2' });
  const match = sections.find((s) => /^##\s+/.test(s) && s.toLowerCase().startsWith(`## ${title}`.toLowerCase()));
  if (!match) return undefined;
  return match.replace(/^##\s+.*\n?/, '').trim();
}

/* ── Section Divider ── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-16 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
      <span className="text-xs text-stone-400 font-medium uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
    </div>
  );
}

/* ── Section Heading ── */
function SectionHeading({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="mb-10 flex items-end gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900">{children}</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mt-3 rounded-full" />
      </div>
      {count !== undefined && (
        <span className="text-sm text-stone-400 font-medium mb-1">{count} stories</span>
      )}
    </div>
  );
}

/* ── Principal Card ── */
function PrincipalCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-stone-50 rounded-2xl border border-amber-200/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-amber-300/80">
        <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300" />
        <div className="p-8 md:p-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-amber-600/80">Principal&rsquo;s Message</span>
              <div className="w-8 h-[2px] bg-amber-400 mt-2" />
            </div>
            <span className="text-sm font-semibold text-stone-700 tracking-wide">{testimonial.author}</span>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed mb-6 max-w-3xl">{testimonial.subtitle}</p>
          <div className="flex gap-4 items-start mb-6">
            <Quote className="w-8 h-8 text-amber-400/60 shrink-0 mt-1" />
            <p className="text-xl md:text-2xl font-semibold text-stone-800 leading-snug italic">{getCardQuote(testimonial)}</p>
          </div>
          <span className="inline-flex items-center text-sm font-semibold text-amber-700 group-hover:text-amber-900 transition-colors">
            Read full message <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Parent Letter Card ── */
function ParentLetterCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative h-full bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-stone-300">
        <div className="h-1.5 bg-brand-navy" />
        <div className="p-6 md:p-8 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-brand-navy/60">Parent Letter</span>
            <span className="text-sm font-semibold text-stone-700">{testimonial.author}</span>
          </div>
          <p className="text-stone-500 text-xs leading-relaxed mb-5 line-clamp-2">{testimonial.subtitle}</p>
          <div className="bg-brand-navy rounded-xl p-5 mb-5 flex-1">
            <p className="text-white/90 text-base font-medium italic leading-relaxed">&ldquo;{getCardQuote(testimonial)}&rdquo;</p>
          </div>
          <span className="inline-flex items-center text-sm font-semibold text-brand-navy/80 group-hover:text-brand-navy transition-colors">
            Read their story <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Featured Testimonial Card ── */
function FeaturedTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const badgeText = getLabelBadge(testimonial);
  const quote = testimonial.pullQuotes[0]?.text ?? testimonial.bottomQuote ?? '';
  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative h-full bg-gradient-to-br from-amber-50/80 via-white to-stone-50 rounded-2xl border border-amber-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-amber-300/70">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-teal-500" />
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="uppercase tracking-[0.15em] text-[10px] font-semibold text-amber-600/80">Featured Story</span>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-stone-800 block">{testimonial.author}</span>
              {badgeText && <Badge className="mt-1 bg-teal-50 text-teal-700 border-teal-200/60 text-[10px] font-medium">{badgeText}</Badge>}
            </div>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed mb-5 max-w-3xl">{testimonial.subtitle}</p>
          <div className="flex gap-4 items-start mb-5">
            <Quote className="w-7 h-7 text-amber-400/50 shrink-0 mt-1" />
            <p className="text-lg md:text-xl font-semibold text-stone-800 leading-snug italic">{quote}</p>
          </div>
          <span className="inline-flex items-center text-sm font-semibold text-teal-700 group-hover:text-teal-900 transition-colors">
            Read their full journey <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Student Card ── */
function StudentCard({ testimonial }: { testimonial: Testimonial }) {
  const badgeText = getLabelBadge(testimonial);
  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative h-full bg-white rounded-xl border border-stone-200/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-stone-300">
        <div className="h-1 bg-gradient-to-r from-brand-navy to-teal-600" />
        <div className="p-5 md:p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <span className="uppercase tracking-[0.15em] text-[10px] font-semibold text-teal-600/70">Student Reflection</span>
            <div className="text-right">
              <span className="text-sm font-bold text-stone-800 block">{testimonial.author}</span>
              {badgeText && <Badge className="mt-1 bg-stone-100 text-stone-500 border-stone-200/60 text-[9px] font-medium px-2 py-0">{badgeText}</Badge>}
            </div>
          </div>
          <p className="text-stone-400 text-[11px] leading-relaxed mb-4 line-clamp-2">{getSubtitleSnippet(testimonial)}</p>
          <div className="border-l-[3px] border-amber-400 pl-4 mb-4 flex-1">
            <p className="text-stone-700 text-[15px] font-medium italic leading-relaxed">&ldquo;{getCardQuote(testimonial)}&rdquo;</p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-stone-500 group-hover:text-brand-navy transition-colors">
            Read full story <span className="ml-1.5 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════ */
const SuccessStoriesPage = () => {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [appreciationStudents, setAppreciationStudents] = useState<StudentData[]>([]);
  const [appreciationLoading, setAppreciationLoading] = useState(true);

  const visibleStudents = showAllStudents ? regularStudentTestimonials : regularStudentTestimonials.slice(0, INITIAL_VISIBLE);
  const featuredStories = successStories.slice(0, 2);

  useEffect(() => {
    const run = async () => {
      try {
        const manifestRes = await fetch('/Appreciation%20and%20advice/index.json');
        const manifest: ManifestItem[] = await manifestRes.json();
        const loaded: StudentData[] = [];
        for (const m of manifest) {
          const url = `/Appreciation%20and%20advice/${encodeURIComponent(m.filename)}`;
          const md = await fetch(url).then((r) => r.text());
          const appreciation = extractSection(md, 'Appreciation');
          const advice = extractSection(md, 'Advice');
          loaded.push({ slug: m.slug, name: m.name, appreciation, advice });
        }
        setAppreciationStudents(loaded);
      } catch (e) {
        console.error('Failed to load appreciation data:', e);
      } finally {
        setAppreciationLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      <SEO
        title="Success Stories & Reviews"
        description="5-star Google reviews, parent letters, and student reflections from DA Tuition families in Canley Heights. Real results, real stories, real families."
        canonicalUrl="/success-stories"
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">

        {/* ═══ HERO ═══ */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-20">
          <div className="absolute inset-0">
            <img src="/images/v3/class_smiling.jpg" alt="DA Tuition Success" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-rose-500/20 to-pink-500/30 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
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

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300">Stories</span>
              <span className="block text-2xl lg:text-3xl mt-4 text-white/90 font-semibold">Reviews, Testimonials &amp; Reflections</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-12 drop-shadow-md font-medium">
              Every student has a story. Discover how DA Tuition has changed thousands of lives &mdash; in their own words.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
              {[
                { value: siteStats.studentsHelped, label: "Students Helped" },
                { value: `${siteStats.reviewCount}+`, label: "Google Reviews" },
                { value: testimonials.length, label: "Testimonials" },
                { value: siteStats.yearsExperience, label: "Years of Impact" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-1">{stat.value}</div>
                  <div className="text-[9px] sm:text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: TESTIMONIALS & LETTERS ═══ */}
        <section className="mb-16 px-4 sm:px-0">
          <SectionHeading>From the Principal</SectionHeading>
          {principalTestimonials.map(t => <PrincipalCard key={t.slug} testimonial={t} />)}
        </section>

        <section className="mb-16 px-4 sm:px-0">
          <SectionHeading count={parentTestimonials.length}>Parent Letters</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {parentTestimonials.map(t => <ParentLetterCard key={t.slug} testimonial={t} />)}
          </div>
        </section>

        {featuredTestimonials.length > 0 && (
          <section className="mb-12 px-4 sm:px-0">
            <div className="mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-semibold text-stone-800">Featured Student Stories</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredTestimonials.map(t => <FeaturedTestimonialCard key={t.slug} testimonial={t} />)}
            </div>
          </section>
        )}

        <section className="mb-16 px-4 sm:px-0">
          <SectionHeading count={regularStudentTestimonials.length}>Student Reflections</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleStudents.map(t => <StudentCard key={t.slug} testimonial={t} />)}
          </div>
          {regularStudentTestimonials.length > INITIAL_VISIBLE && (
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg" onClick={() => setShowAllStudents(!showAllStudents)} className="border-stone-300 text-stone-600 hover:bg-stone-50 hover:text-brand-navy rounded-xl px-8">
                {showAllStudents ? 'Show Fewer Stories' : (<>Show All {regularStudentTestimonials.length} Stories <ChevronDown className="ml-2 w-4 h-4" /></>)}
              </Button>
            </div>
          )}
        </section>

        <SectionDivider label="Success Stories" />

        {/* ═══ SECTION 3: SUCCESS STORIES ═══ */}
        <section className="mb-16 px-4 sm:px-0">
          <SectionHeading>Featured Achievements</SectionHeading>
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {featuredStories.map((story) => (
              <Card key={story.reviewId} className="overflow-hidden hover:shadow-2xl transition-shadow flex flex-col h-full">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2" />
                <CardHeader className="pb-4 shrink-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{story.name}</CardTitle>
                      <p className="text-brand-midnight/80 text-sm mt-1">{story.school}</p>
                      <div className="flex flex-wrap items-center mt-3 gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800"><Trophy className="w-3 h-3 mr-1" />{story.achievement}</Badge>
                        <Badge variant="secondary">{story.subject}</Badge>
                      </div>
                    </div>
                    <div className="flex shrink-0">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <Quote className="w-4 h-4 text-gray-400 mb-2" />
                    <p className="text-sm text-brand-midnight/80 italic">"{story.quote}"</p>
                  </div>
                  <p className="text-sm text-brand-midnight/80 line-clamp-3 flex-grow">{story.appreciation}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      <span className="text-sm font-semibold">{story.improvement}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStory(story)}>Read Full Story</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {successStories.length > 2 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.slice(2).map((story) => (
                <Card key={story.reviewId} className="hover:shadow-xl transition-shadow flex flex-col h-full">
                  <CardHeader className="shrink-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{story.name}</CardTitle>
                        <p className="text-sm text-brand-midnight/80">{story.school}</p>
                      </div>
                      <Badge variant="outline">{story.subject}</Badge>
                    </div>
                    <div className="flex items-center mt-2">
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

        <SectionDivider label="Google Reviews" />

        {/* ═══ SECTION 4: GOOGLE REVIEWS ═══ */}
        <section className="mb-8 px-4 sm:px-0">
          <SectionHeading count={siteStats.reviewCount}>Google Reviews</SectionHeading>
        </section>
      </div>

      <StaticGoogleReviews layout="grid" maxReviews={12} showHeader={false} showFilters={true} className="pb-16" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        <SectionDivider label="Appreciation & Advice" />

        {/* ═══ SECTION 5: APPRECIATION & ADVICE ═══ */}
        <section className="mb-12 px-4 sm:px-0">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-[1.5fr,1fr]">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-brand-midnight">The High Achiever Mindset</h2>
                </div>
                <div className="prose prose-lg text-brand-midnight/80 mb-8">
                  <p>Coming first in one exam is tough. Consistently topping the class? That's a craft. The students featured below didn't rely on luck. They relied on <strong>discipline, strategy, and resilience.</strong></p>
                  <p>They maximized every tool, asked every question, and treated every lesson with intent.</p>
                </div>
                <div className="space-y-4">
                  {["Using provided help to its full potential", "Spending time where it matters most", "Treating revision like the real exam", "Turning tutor advice into immediate action"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                      <span className="text-brand-midnight/80 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100">
                <blockquote className="text-2xl font-serif italic text-amber-900 leading-relaxed mb-6">
                  "Success doesn't happen by chance; it's earned. These students prove that excellence is a habit, not a gift."
                </blockquote>
                <div className="flex items-center gap-2 text-amber-700 font-semibold">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  DA Tuition Excellence Team
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24 px-4 sm:px-0 max-w-5xl mx-auto">
          {appreciationLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
              <p className="text-brand-midnight/70">Loading wisdom...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {appreciationStudents.map((student, index) => (
                <StudentAppreciationCard key={student.slug} student={student} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* DA Journey Timeline */}
        <section className="py-16 bg-brand-navy text-white relative overflow-hidden rounded-[2.5rem] mb-16 mx-4 sm:mx-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-yellow rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">The DA Tuition Journey</h2>
              <p className="text-xl opacity-90">How we transform students</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                { icon: Target, title: "Initial Interview", desc: "An initial interview identifies strengths and gaps. We create a personalized learning plan." },
                { icon: BookOpen, title: "Structured Learning", desc: "Our exam-focused curriculum builds understanding systematically." },
                { icon: TrendingUp, title: "Progress Tracking", desc: "Regular assessments and feedback ensure continuous improvement." },
                { icon: Trophy, title: "Achievement", desc: "Students achieve their goals - from passing grades to state rankings." },
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

      {/* Story Detail Modal */}
      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex flex-wrap items-center gap-2">
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
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-sm text-green-600 mb-1">Results & Improvement</div>
                  <div className="font-bold text-green-700">{selectedStory.improvement}</div>
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
