
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import TrustBar from '@/components/TrustBar';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import HowWereDifferent from '@/components/HowWereDifferent';
import TeachersPreview from '@/components/TeachersPreview';
import Programs from '@/components/Programs';
import Contact from '@/components/Contact';
import AwardRecognition from '@/components/AwardRecognition';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarousel';
import DALogoShine from '@/components/animations/DALogoShine';
import SEO from '@/components/SEO';
import { siteStats } from '@/data/site-stats';
import { organizationSchema, localBusinessSchema } from '@/lib/seo/schema';

// Hero — centered layout with shining logo, warm cream background
const HeroTransparent = () => {
  const logoSize = typeof window !== 'undefined'
    ? Math.min(Math.round(window.innerWidth * 0.38), 320)
    : 320;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6"
      style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 38%, rgba(212,175,55,0.13) 0%, transparent 65%),
          radial-gradient(ellipse 90% 70% at 50% 50%, rgba(26,42,110,0.06) 0%, transparent 80%),
          linear-gradient(180deg, #f5f0e8 0%, #ede5d4 60%, #f0ead8 100%)
        `,
      }}
    >
      {/* Shining DA Logo */}
      <div className="mb-10 mt-8">
        <DALogoShine size={logoSize} />
      </div>

      {/* Headline */}
      <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4"
        style={{ color: '#0d1640' }}>
        Premium Tutoring for<br />Academic Excellence
      </h1>

      {/* Tagline */}
      <p className="text-lg font-medium italic mb-5" style={{ color: 'rgba(184,134,11,0.90)' }}>
        Trusted by Families. Transforming Futures.
      </p>

      {/* Supporting text */}
      <p className="text-lg max-w-xl leading-relaxed mb-10" style={{ color: 'rgba(26,26,70,0.58)' }}>
        Personalised academic support in Mathematics, Science, and English.<br />
        Over {siteStats.yearsExperience} years helping {siteStats.studentsHelped} students build
        real confidence and results.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Button
          size="lg"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'linear-gradient(135deg,#c9a227,#e8c040)',
            color: '#1a1a00',
            border: 'none',
            borderRadius: '50px',
            padding: '15px 36px',
            fontWeight: 800,
            boxShadow: '0 4px 20px rgba(212,175,55,0.40)',
          }}
        >
          Book a Trial Lesson
          <ArrowRight size={18} className="ml-2" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'transparent',
            color: '#1a2a6e',
            border: '2px solid rgba(26,42,110,0.35)',
            borderRadius: '50px',
            padding: '13px 36px',
            fontWeight: 700,
          }}
        >
          View Programs
        </Button>
      </div>

      {/* Stats bar */}
      <div
        className="flex flex-wrap justify-center divide-x overflow-hidden rounded-2xl"
        style={{
          border: '1px solid rgba(212,175,55,0.30)',
          background: 'rgba(255,255,255,0.60)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(26,42,110,0.08)',
          divideColor: 'rgba(212,175,55,0.20)',
        }}
      >
        {[
          { num: siteStats.yearsExperience, label: 'Years Experience' },
          { num: siteStats.studentsHelped,  label: 'Students Helped' },
          { num: '5.0 ★',                  label: 'Google Rating' },
          { num: siteStats.reviewCount,     label: 'Reviews' },
        ].map((s, i) => (
          <div key={i} className="px-8 py-5 text-center" style={{ borderRight: i < 3 ? '1px solid rgba(212,175,55,0.20)' : 'none' }}>
            <div className="text-2xl font-extrabold" style={{ background: 'linear-gradient(135deg,#b8860b,#d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {s.num}
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: 'rgba(26,26,70,0.45)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden pt-[120px]" style={{ background: '#f5f0e8' }}>
      <SEO
        canonicalUrl="/"
        jsonLd={[
          organizationSchema(),
          localBusinessSchema(siteStats.reviewCount),
        ]}
      />
      {/* Navigation - floating glassmorphism */}
      <NavigationNew />

      {/* Sticky Book Interview Button */}
      <StickyBookButton />

      <main className="max-w-[1400px] mx-auto space-y-20 pb-20">
        <div className="relative w-full">
          {/* Hero Section */}
          <HeroTransparent />

          {/* Trust Bar sitting cleanly inside page flow below Hero */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
            <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-white/50 p-6">
              <TrustBar />
            </div>
          </div>
        </div>

        {/* Reviews Section - Bento Grid Highlight */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="absolute -left-32 top-10 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl -z-10" />
          <GoogleReviewsCarousel />
        </div>

        {/* How We're Different Section */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="absolute -right-32 top-1/2 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl -z-10" />
          <HowWereDifferent />
        </div>

        {/* Award Recognition Section */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="absolute left-1/2 top-10 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-3xl -z-10 -translate-x-1/2" />
          <AwardRecognition />
        </div>

        {/* Teachers Section */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <TeachersPreview />
        </div>

        {/* Programs Section */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="absolute -right-20 top-0 w-80 h-80 bg-accent-green/10 rounded-full blur-3xl -z-10" />
          <Programs />
        </div>

        {/* Contact Section */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <Contact />
        </div>
      </main>

      {/* Footer */}
      <FooterNew />
    </div>
  );
};

export default Index;
