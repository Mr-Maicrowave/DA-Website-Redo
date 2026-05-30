import { useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { testimonials, Testimonial } from '@/data/testimonials';
import { Quote, Star, ChevronDown } from 'lucide-react';
import { siteStats } from '@/data/site-stats';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CTASection from '@/components/CTASection';

const principalTestimonials = testimonials.filter(t => t.type === 'principal-message');
const parentTestimonials = testimonials.filter(t => t.type === 'parent-letter');
const studentTestimonials = testimonials.filter(t => t.type === 'student-review');

const FEATURED_SLUGS = [
  'a-student-reflection-tu-nguyen',
  'a-student-reflection-angelina-nguyen',
];
const featuredTestimonials = studentTestimonials.filter(t => FEATURED_SLUGS.includes(t.slug));
const regularStudentTestimonials = studentTestimonials.filter(t => !FEATURED_SLUGS.includes(t.slug));
const INITIAL_VISIBLE = 6;
const QUOTE_LENGTH = 180;

function getCardQuote(t: Testimonial): string {
  const quote = t.pullQuotes[0]?.text ?? t.bottomQuote ?? t.bodyParagraphs[0] ?? '';
  if (quote.length <= QUOTE_LENGTH) return quote;
  const trimmed = quote.slice(0, QUOTE_LENGTH);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 40 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
}

function getSubtitleSnippet(t: Testimonial): string {
  const sub = t.subtitle || '';
  if (sub.length <= 80) return sub;
  const trimmed = sub.slice(0, 80);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 30 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
}

function getLabelBadge(t: Testimonial): string | null {
  if (!t.label) return null;
  if (t.label.includes('2025 GRADUATE')) return '2025 Graduate';
  if (t.label.includes('2024 GRADUATE')) return '2024 Graduate';
  if (t.label.includes('2023 GRADUATE')) return '2023 Graduate';
  if (t.label.includes('2022 GRADUATE')) return '2022 Graduate';
  if (t.label.includes('GOOGLE REVIEW')) return 'Google Review';
  if (t.label.includes('PRINCIPAL')) return 'Principal';
  return null;
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

/* ── Principal Card: full-width, warm gold editorial feel ── */
function PrincipalCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-stone-50 rounded-2xl border border-amber-200/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-amber-300/80">
        <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300" />
        <div className="p-8 md:p-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-amber-600/80">
                Principal&rsquo;s Message
              </span>
              <div className="w-8 h-[2px] bg-amber-400 mt-2" />
            </div>
            <span className="text-sm font-semibold text-stone-700 tracking-wide">
              {testimonial.author}
            </span>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed mb-6 max-w-3xl">
            {testimonial.subtitle}
          </p>
          <div className="flex gap-4 items-start mb-6">
            <Quote className="w-8 h-8 text-amber-400/60 shrink-0 mt-1" />
            <p className="text-xl md:text-2xl font-semibold text-stone-800 leading-snug italic">
              {getCardQuote(testimonial)}
            </p>
          </div>
          <span className="inline-flex items-center text-sm font-semibold text-amber-700 group-hover:text-amber-900 transition-colors">
            Read full message
            <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Parent Letter Card: navy accent, two-tone editorial ── */
function ParentLetterCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative h-full bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-stone-300">
        <div className="h-1.5 bg-brand-navy" />
        <div className="p-6 md:p-8 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-brand-navy/60">
              Parent Letter
            </span>
            <span className="text-sm font-semibold text-stone-700">
              {testimonial.author}
            </span>
          </div>
          <p className="text-stone-500 text-xs leading-relaxed mb-5 line-clamp-2">
            {testimonial.subtitle}
          </p>
          <div className="bg-brand-navy rounded-xl p-5 mb-5 flex-1">
            <p className="text-white/90 text-base font-medium italic leading-relaxed">
              &ldquo;{getCardQuote(testimonial)}&rdquo;
            </p>
          </div>
          <span className="inline-flex items-center text-sm font-semibold text-brand-navy/80 group-hover:text-brand-navy transition-colors">
            Read their story
            <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Featured Student Card: larger, gold-teal accent ── */
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
              <span className="uppercase tracking-[0.15em] text-[10px] font-semibold text-amber-600/80">
                Featured Story
              </span>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-stone-800 block">{testimonial.author}</span>
              {badgeText && (
                <Badge className="mt-1 bg-teal-50 text-teal-700 border-teal-200/60 text-[10px] font-medium">
                  {badgeText}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed mb-5 max-w-3xl">
            {testimonial.subtitle}
          </p>
          <div className="flex gap-4 items-start mb-5">
            <Quote className="w-7 h-7 text-amber-400/50 shrink-0 mt-1" />
            <p className="text-lg md:text-xl font-semibold text-stone-800 leading-snug italic">
              {quote}
            </p>
          </div>
          <span className="inline-flex items-center text-sm font-semibold text-teal-700 group-hover:text-teal-900 transition-colors">
            Read their full journey
            <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Student Review Card: teal/navy accent, clean editorial ── */
function StudentCard({ testimonial }: { testimonial: Testimonial }) {
  const badgeText = getLabelBadge(testimonial);

  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative h-full bg-white rounded-xl border border-stone-200/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-stone-300">
        <div className="h-1 bg-gradient-to-r from-brand-navy to-teal-600" />
        <div className="p-5 md:p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <span className="uppercase tracking-[0.15em] text-[10px] font-semibold text-teal-600/70">
              Student Reflection
            </span>
            <div className="text-right">
              <span className="text-sm font-bold text-stone-800 block">
                {testimonial.author}
              </span>
              {badgeText && (
                <Badge className="mt-1 bg-stone-100 text-stone-500 border-stone-200/60 text-[9px] font-medium px-2 py-0">
                  {badgeText}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-stone-400 text-[11px] leading-relaxed mb-4 line-clamp-2">
            {getSubtitleSnippet(testimonial)}
          </p>
          <div className="border-l-[3px] border-amber-400 pl-4 mb-4 flex-1">
            <p className="text-stone-700 text-[15px] font-medium italic leading-relaxed">
              &ldquo;{getCardQuote(testimonial)}&rdquo;
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-stone-500 group-hover:text-brand-navy transition-colors">
            Read full story
            <span className="ml-1.5 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Section Heading ── */
function SectionHeading({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="mb-10 flex items-end gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
          {children}
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mt-3 rounded-full" />
      </div>
      {count !== undefined && (
        <span className="text-sm text-stone-400 font-medium mb-1">{count} stories</span>
      )}
    </div>
  );
}

/* ── Student Grid with Show More ── */
function StudentGrid({ students, showAll, onToggle }: { students: Testimonial[]; showAll: boolean; onToggle: () => void }) {
  const visible = showAll ? students : students.slice(0, INITIAL_VISIBLE);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map(t => (
          <StudentCard key={t.slug} testimonial={t} />
        ))}
      </div>
      {students.length > INITIAL_VISIBLE && (
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onToggle}
            className="border-stone-300 text-stone-600 hover:bg-stone-50 hover:text-brand-navy rounded-xl px-8"
          >
            {showAll ? (
              <>Show Fewer Stories</>
            ) : (
              <>
                Show All {students.length} Stories
                <ChevronDown className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}

/* ── Featured Stories Block ── */
function FeaturedBlock() {
  if (featuredTestimonials.length === 0) return null;
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
        <h3 className="text-lg font-semibold text-stone-800">Featured Stories</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredTestimonials.map(t => (
          <FeaturedTestimonialCard key={t.slug} testimonial={t} />
        ))}
      </div>
    </section>
  );
}

const Testimonials = () => {
  const [showAllStudents, setShowAllStudents] = useState(false);

  return (
    <>
      <SEO
        title="Testimonials"
        description="Read letters of gratitude, reflections, and stories from the families and students of DA Tuition. Discover how our care and guidance has made a lasting difference."
        canonicalUrl="/success-stories"
      />
      <NavigationNew />

      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">

          {/* ── Hero ── */}
          <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-20">
            <div className="absolute inset-0 bg-brand-navy" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy via-blue-900/80 to-amber-900/30" />

            <div className="relative z-10 py-16 lg:py-24 px-8 lg:px-16">
              {/* Google Trust Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-yellow-300">{siteStats.googleRating}</span>
                <span className="text-sm text-white/60">from {siteStats.reviewCount}+ Google reviews</span>
              </div>

              <p className="uppercase tracking-[0.25em] text-[11px] font-medium text-amber-300/80 mb-4">
                DA Tuition
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                Testimonials
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                  &amp; Reflections
                </span>
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mb-10 leading-relaxed">
                Letters of gratitude, reflections, and stories from our families and students &mdash; in their own words.
              </p>

              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold text-yellow-300 mb-1">{testimonials.length}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/70 font-medium uppercase tracking-widest">Stories Shared</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold text-yellow-300 mb-1">{studentTestimonials.length}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/70 font-medium uppercase tracking-widest">Student Reflections</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold text-yellow-300 mb-1">{siteStats.googleRating}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/70 font-medium uppercase tracking-widest">Google Rating</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold text-yellow-300 mb-1">{siteStats.reviewCount}+</div>
                  <div className="text-[9px] sm:text-[10px] text-white/70 font-medium uppercase tracking-widest">Google Reviews</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Tabbed Testimonials ── */}
          <Tabs defaultValue="all" className="px-4 sm:px-0">
            <TabsList className="mb-10 bg-stone-100 p-1 rounded-xl w-full sm:w-auto flex flex-wrap">
              <TabsTrigger value="all" className="rounded-lg px-4 sm:px-5 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-brand-navy data-[state=active]:shadow-sm">
                All ({testimonials.length})
              </TabsTrigger>
              <TabsTrigger value="principal" className="rounded-lg px-4 sm:px-5 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-brand-navy data-[state=active]:shadow-sm">
                Principal
              </TabsTrigger>
              <TabsTrigger value="parents" className="rounded-lg px-4 sm:px-5 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-brand-navy data-[state=active]:shadow-sm">
                Parents ({parentTestimonials.length})
              </TabsTrigger>
              <TabsTrigger value="students" className="rounded-lg px-4 sm:px-5 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-brand-navy data-[state=active]:shadow-sm">
                Students ({studentTestimonials.length})
              </TabsTrigger>
            </TabsList>

            {/* ── ALL tab ── */}
            <TabsContent value="all">
              <section className="mb-16">
                <SectionHeading>From the Principal</SectionHeading>
                {principalTestimonials.map(t => (
                  <PrincipalCard key={t.slug} testimonial={t} />
                ))}
              </section>

              <SectionDivider label="Parent Letters" />

              <section className="mb-16">
                <SectionHeading count={parentTestimonials.length}>Parent Letters</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {parentTestimonials.map(t => (
                    <ParentLetterCard key={t.slug} testimonial={t} />
                  ))}
                </div>
              </section>

              <SectionDivider label="Student Reflections" />

              <FeaturedBlock />

              <section className="mb-24">
                <SectionHeading count={regularStudentTestimonials.length}>More Student Reflections</SectionHeading>
                <StudentGrid
                  students={regularStudentTestimonials}
                  showAll={showAllStudents}
                  onToggle={() => setShowAllStudents(!showAllStudents)}
                />
              </section>
            </TabsContent>

            {/* ── PRINCIPAL tab ── */}
            <TabsContent value="principal">
              <section className="mb-24">
                <SectionHeading>From the Principal</SectionHeading>
                {principalTestimonials.map(t => (
                  <PrincipalCard key={t.slug} testimonial={t} />
                ))}
              </section>
            </TabsContent>

            {/* ── PARENTS tab ── */}
            <TabsContent value="parents">
              <section className="mb-24">
                <SectionHeading count={parentTestimonials.length}>Parent Letters</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {parentTestimonials.map(t => (
                    <ParentLetterCard key={t.slug} testimonial={t} />
                  ))}
                </div>
              </section>
            </TabsContent>

            {/* ── STUDENTS tab ── */}
            <TabsContent value="students">
              <FeaturedBlock />

              <SectionDivider label="All Student Reflections" />

              <section className="mb-24">
                <SectionHeading count={studentTestimonials.length}>Student Reflections</SectionHeading>
                <StudentGrid
                  students={regularStudentTestimonials}
                  showAll={showAllStudents}
                  onToggle={() => setShowAllStudents(!showAllStudents)}
                />
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CTASection
        heading="Start Your Child's Success Story"
        subheading="Join the DA family and experience the difference that care and guidance can make."
        className="bg-brand-navy"
      />

      <FooterNew />
    </>
  );
};

export default Testimonials;
