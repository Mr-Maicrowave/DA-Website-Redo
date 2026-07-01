import { useState, useEffect, useRef } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { testimonials, Testimonial } from '@/data/testimonials';
import { Quote, Star, ChevronDown, Users, Award } from 'lucide-react';
import { siteStats } from '@/data/site-stats';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CTASection from '@/components/CTASection';

/* ── Scroll-reveal wrapper: fades/slides content up the first time it enters view ── */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

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
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#071629]/12 to-transparent" />
      <span className="text-xs font-black uppercase tracking-[0.24em] text-[#071629]/35">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#071629]/12 to-transparent" />
    </div>
  );
}

/* ── Principal Card: full-width, warm gold editorial feel ── */
function PrincipalCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[#c9a227]/20 bg-gradient-to-br from-[#fff6e7] via-white to-[#fffdf8] transition-all duration-300 hover:shadow-xl hover:shadow-[#071629]/8 hover:border-[#c9a227]/40">
        <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#c9a227]" />
        <div className="p-8 md:p-10">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">
                Principal&rsquo;s Message
              </span>
              <div className="mt-2 h-[2px] w-8 bg-[#c9a227]" />
            </div>
            <span className="text-sm font-bold tracking-wide text-[#071629]/70">
              {testimonial.author}
            </span>
          </div>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-[#61708a]">
            {testimonial.subtitle}
          </p>
          <div className="mb-6 flex items-start gap-4">
            <Quote className="mt-1 h-8 w-8 shrink-0 text-[#c9a227]/50" />
            <p className="font-serif text-xl font-medium italic leading-snug text-[#10233f] md:text-2xl">
              {getCardQuote(testimonial)}
            </p>
          </div>
          <span className="inline-flex items-center text-sm font-bold text-[#c9a227] transition-colors group-hover:text-[#7a5e10]">
            Read full message
            <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
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
      <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-[#071629]/10 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-[#071629]/8 hover:border-[#071629]/20">
        <div className="h-1.5 bg-[#071629]" />
        <div className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#071629]/50">
              Parent Letter
            </span>
            <span className="text-sm font-bold text-[#071629]/70">
              {testimonial.author}
            </span>
          </div>
          <p className="mb-5 line-clamp-2 text-xs leading-relaxed text-[#61708a]">
            {testimonial.subtitle}
          </p>
          <div className="mb-5 flex-1 rounded-xl bg-[#071629] p-5">
            <p className="font-serif text-base font-medium italic leading-relaxed text-white/90">
              &ldquo;{getCardQuote(testimonial)}&rdquo;
            </p>
          </div>
          <span className="inline-flex items-center text-sm font-bold text-[#071629]/70 transition-colors group-hover:text-[#071629]">
            Read their story
            <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Featured Student Card: larger, gold-blue accent ── */
function FeaturedTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const badgeText = getLabelBadge(testimonial);
  const quote = testimonial.pullQuotes[0]?.text ?? testimonial.bottomQuote ?? '';

  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-[#c9a227]/20 bg-gradient-to-br from-[#fff6e7]/70 via-white to-[#fffdf8] transition-all duration-300 hover:shadow-xl hover:shadow-[#071629]/8 hover:border-[#c9a227]/40">
        <div className="h-1.5 bg-gradient-to-r from-[#c9a227] via-[#f1df9a] to-[#2563eb]" />
        <div className="p-6 md:p-8 lg:p-10">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-[#c9a227] text-[#c9a227]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
                Featured Story
              </span>
            </div>
            <div className="text-right">
              <span className="block text-base font-black text-[#071629]">{testimonial.author}</span>
              {badgeText && (
                <Badge className="mt-1 border-[#2563eb]/20 bg-[#2563eb]/10 text-[10px] font-semibold text-[#2563eb]">
                  {badgeText}
                </Badge>
              )}
            </div>
          </div>
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-[#61708a]">
            {testimonial.subtitle}
          </p>
          <div className="mb-5 flex items-start gap-4">
            <Quote className="mt-1 h-7 w-7 shrink-0 text-[#c9a227]/45" />
            <p className="font-serif text-lg font-medium italic leading-snug text-[#10233f] md:text-xl">
              {quote}
            </p>
          </div>
          <span className="inline-flex items-center text-sm font-bold text-[#2563eb] transition-colors group-hover:text-[#1d4ed8]">
            Read their full journey
            <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Student Review Card: navy/blue accent, clean editorial ── */
function StudentCard({ testimonial }: { testimonial: Testimonial }) {
  const badgeText = getLabelBadge(testimonial);

  return (
    <Link to={`/testimonials/${testimonial.slug}`} className="block group">
      <div className="relative h-full overflow-hidden rounded-2xl border border-[#071629]/8 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-[#071629]/6 hover:border-[#071629]/16">
        <div className="h-1 bg-gradient-to-r from-[#071629] to-[#2563eb]" />
        <div className="flex h-full flex-col p-5 md:p-6">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb]/70">
              Student Reflection
            </span>
            <div className="text-right">
              <span className="block text-sm font-bold text-[#071629]">
                {testimonial.author}
              </span>
              {badgeText && (
                <Badge className="mt-1 border-[#071629]/10 bg-[#071629]/5 px-2 py-0 text-[9px] font-medium text-[#61708a]">
                  {badgeText}
                </Badge>
              )}
            </div>
          </div>
          <p className="mb-4 line-clamp-2 text-[11px] leading-relaxed text-[#61708a]/80">
            {getSubtitleSnippet(testimonial)}
          </p>
          <div className="mb-4 flex-1 border-l-[3px] border-[#c9a227] pl-4">
            <p className="font-serif text-[15px] font-medium italic leading-relaxed text-[#10233f]">
              &ldquo;{getCardQuote(testimonial)}&rdquo;
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-bold text-[#61708a] transition-colors group-hover:text-[#071629]">
            Read full story
            <span className="ml-1.5 transition-transform group-hover:translate-x-1">&rarr;</span>
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
        <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071629] md:text-3xl">
          {children}
        </h2>
        <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#c9a227] to-[#f1df9a]" />
      </div>
      {count !== undefined && (
        <span className="mb-1 text-sm font-semibold text-[#61708a]">{count} stories</span>
      )}
    </div>
  );
}

/* ── Student Grid with Show More ── */
function StudentGrid({ students, showAll, onToggle }: { students: Testimonial[]; showAll: boolean; onToggle: () => void }) {
  const visible = showAll ? students : students.slice(0, INITIAL_VISIBLE);

  return (
    <>
      <div className="columns-1 gap-6 [column-fill:_balance] md:columns-2 lg:columns-3">
        {visible.map((t, i) => (
          <Reveal key={t.slug} delay={(i % 6) * 80} className="mb-6 break-inside-avoid">
            <StudentCard testimonial={t} />
          </Reveal>
        ))}
      </div>
      {students.length > INITIAL_VISIBLE && (
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onToggle}
            className="rounded-full border-[#071629]/20 px-8 text-[#071629]/70 hover:bg-[#fff6e7] hover:text-[#071629]"
          >
            {showAll ? (
              <>Show Fewer Stories</>
            ) : (
              <>
                Show All {students.length} Stories
                <ChevronDown className="ml-2 h-4 w-4" />
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
        <Star className="h-5 w-5 fill-[#c9a227] text-[#c9a227]" />
        <h3 className="font-serif text-lg font-medium text-[#071629]">Featured Stories</h3>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {featuredTestimonials.map((t, i) => (
          <Reveal key={t.slug} delay={i * 120}>
            <FeaturedTestimonialCard testimonial={t} />
          </Reveal>
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
        canonicalUrl="/testimonials"
      />
      <NavigationNew />

      <div className="min-h-screen bg-[#fffdf8] text-[#172033]">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/programs/highschool-tutor-1on1-1.jpg"
              alt="DA Tuition Testimonials"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 lg:px-8 lg:pb-28">
            {/* Google Trust Badge */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#f1df9a] text-[#f1df9a]" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#f1df9a]">{siteStats.googleRating}</span>
              <span className="text-sm text-white/60">from {siteStats.reviewCount}+ Google reviews</span>
            </div>

            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-[#f1df9a]/80">
              DA Tuition
            </p>
            <h1 className="font-serif text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Testimonials
              <span className="block bg-gradient-to-r from-[#c9a227] to-[#f1df9a] bg-clip-text text-transparent">
                &amp; Reflections
              </span>
            </h1>
            <p className="mb-10 mt-4 max-w-2xl text-lg leading-8 text-white/75">
              Letters of gratitude, reflections, and stories from our families and students &mdash; in their own words.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              {[
                { icon: Quote, value: testimonials.length, label: 'Stories Shared' },
                { icon: Users, value: studentTestimonials.length, label: 'Student Reflections' },
                { icon: Star, value: siteStats.googleRating, label: 'Google Rating' },
                { icon: Award, value: `${siteStats.reviewCount}+`, label: 'Google Reviews' },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="relative rounded-2xl border border-white/15 px-5 py-4 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a227]/40 sm:px-6 sm:py-5"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 100%)',
                  }}
                >
                  <div className="absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 bg-gradient-to-r from-[#c9a227] to-[#f1df9a]" />
                  <Icon className="mx-auto mb-1.5 h-4 w-4 text-[#f1df9a]/80" />
                  <div className="mb-1 font-serif text-xl font-medium text-[#f1df9a] sm:text-2xl">
                    {value}
                  </div>
                  <div className="text-[9px] font-medium uppercase tracking-widest text-white/70 sm:text-[10px]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tabbed Testimonials ── */}
        <section className="bg-[#fffdf8] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Tabs defaultValue="all">
              <TabsList className="mb-10 flex w-full flex-wrap rounded-xl bg-[#fff6e7] p-1 sm:w-auto">
                <TabsTrigger value="all" className="rounded-lg px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#071629] data-[state=active]:shadow-sm sm:px-5">
                  All ({testimonials.length})
                </TabsTrigger>
                <TabsTrigger value="principal" className="rounded-lg px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#071629] data-[state=active]:shadow-sm sm:px-5">
                  Principal
                </TabsTrigger>
                <TabsTrigger value="parents" className="rounded-lg px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#071629] data-[state=active]:shadow-sm sm:px-5">
                  Parents ({parentTestimonials.length})
                </TabsTrigger>
                <TabsTrigger value="students" className="rounded-lg px-4 py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#071629] data-[state=active]:shadow-sm sm:px-5">
                  Students ({studentTestimonials.length})
                </TabsTrigger>
              </TabsList>

              {/* ── ALL tab ── */}
              <TabsContent value="all">
                <section className="mb-16">
                  <SectionHeading>From the Principal</SectionHeading>
                  {principalTestimonials.map(t => (
                    <Reveal key={t.slug}>
                      <PrincipalCard testimonial={t} />
                    </Reveal>
                  ))}
                </section>

                <SectionDivider label="Parent Letters" />

                <section className="mb-16">
                  <SectionHeading count={parentTestimonials.length}>Parent Letters</SectionHeading>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {parentTestimonials.map((t, i) => (
                      <Reveal key={t.slug} delay={(i % 4) * 100} className={i % 2 === 1 ? 'md:mt-8' : ''}>
                        <ParentLetterCard testimonial={t} />
                      </Reveal>
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
                    <Reveal key={t.slug}>
                      <PrincipalCard testimonial={t} />
                    </Reveal>
                  ))}
                </section>
              </TabsContent>

              {/* ── PARENTS tab ── */}
              <TabsContent value="parents">
                <section className="mb-24">
                  <SectionHeading count={parentTestimonials.length}>Parent Letters</SectionHeading>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {parentTestimonials.map((t, i) => (
                      <Reveal key={t.slug} delay={(i % 4) * 100} className={i % 2 === 1 ? 'md:mt-8' : ''}>
                        <ParentLetterCard testimonial={t} />
                      </Reveal>
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
        </section>

        <CTASection
          heading="Start Your Child's Success Story"
          subheading="Join the DA family and experience the difference that care and guidance can make."
          className="bg-[#071629]"
        />
      </div>

      <FooterNew />
    </>
  );
};

export default Testimonials;
