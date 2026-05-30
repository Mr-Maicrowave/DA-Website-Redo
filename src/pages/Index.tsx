import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import TrustBar from '@/components/TrustBar';
import StickyBookButton from '@/components/StickyBookButton';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import HowWereDifferent from '@/components/HowWereDifferent';
import TeachersPreview from '@/components/TeachersPreview';
import Programs from '@/components/Programs';
import Contact from '@/components/Contact';
import AwardRecognition from '@/components/AwardRecognition';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarousel';
import TextReveal from '@/components/animations/TextReveal';
import ParallaxImage from '@/components/animations/ParallaxImage';
import SEO from '@/components/SEO';
import { siteStats } from '@/data/site-stats';
import { organizationSchema, localBusinessSchema } from '@/lib/seo/schema';

// Custom Hero component without background
const HeroTransparent = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern - Center Energy Colors */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-accent-teal/20 rounded-full mix-blend-multiply filter blur-[80px] animate-float"></div>
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-accent-pink/20 rounded-full mix-blend-multiply filter blur-[80px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-accent-yellow/20 rounded-full mix-blend-multiply filter blur-[80px] animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative w-full max-w-[2000px] mx-auto pt-20 pb-32 overflow-visible">
        <div className="grid lg:grid-cols-2 lg:gap-8 items-center min-h-[70vh]">
          {/* Content */}
          <div className="space-y-8 animate-fade-in px-4 sm:px-6 lg:pl-12 xl:pl-20 lg:pr-8 z-20 relative lg:max-w-3xl">
            {/* Trust Badge */}
            <div className="flex items-center space-x-2 text-sm text-brand-navy">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent-yellow text-accent-yellow" />
                ))}
              </div>
              <span className="font-medium text-brand-navy">{siteStats.googleRating} rating from {siteStats.reviewCount} families</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-extrabold text-brand-navy leading-tight tracking-tight">
              <TextReveal text="Where Every Child's" />
              <div className="gradient-text"><TextReveal text="Potential" delay={0.4} /></div>
              <TextReveal text="Becomes Their" delay={0.6} />
              <div className="gradient-text"><TextReveal text="Reality" delay={1.0} /></div>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-brand-navy/70 leading-relaxed max-w-2xl">
              At DA Tuition, we help you choose the program that matches your child and the learning format that works best for them.
              For over {siteStats.yearsExperience} years, we've been creating personalized educational experiences where students don't just improve their grades—they
              discover their confidence, build resilience, and unlock their true potential.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 py-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-blue">{siteStats.yearsExperience}</div>
                <div className="text-xs sm:text-sm text-brand-navy/60 font-medium">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-blue">{siteStats.studentsHelped}</div>
                <div className="text-xs sm:text-sm text-brand-navy/60 font-medium">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-accent-green">5.0 ★</div>
                <div className="text-xs sm:text-sm text-brand-navy/60 font-medium">Google Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-primary group"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Interview
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-brand-navy/60 font-medium">
              Join {siteStats.reviewCount} families who've discovered what's possible at DA Tuition
            </p>
          </div>

          {/* Hero Image - Taking up full right side */}
          <div className="relative animate-slide-up h-full w-full lg:absolute lg:right-0 lg:top-0 lg:w-[55%] lg:h-full z-10 pt-12 lg:pt-0 pb-12 lg:pb-0 px-4 lg:px-0">
            <div className="relative h-[400px] lg:h-full w-full flex items-center justify-center lg:pl-16">
              {/* Image Container with its own hidden overflow for parallax */}
              <div className="rounded-2xl lg:rounded-none lg:rounded-l-3xl shadow-2xl overflow-hidden w-full h-[90%] lg:h-full relative z-0">
                <ParallaxImage
                  src="/images/v3/hero_team.jpg"
                  alt="DA Tuition Center"
                  offset={40}
                  className="w-full h-full"
                />
              </div>

              {/* Gradient Overlay for Fade Effect (Left to Right) */}
              <div className="hidden lg:block absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-brand-canvas via-brand-canvas/80 to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-brand-canvas overflow-x-hidden pt-[120px]">
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
