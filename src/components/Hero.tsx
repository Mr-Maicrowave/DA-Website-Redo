
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ctaDefaults } from '@/data/business-info';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-blue-light rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-brand-orange rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-brand-green rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Trust Badge */}
            <div className="flex items-center space-x-2 text-sm text-brand-blue-dark">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-medium">5.0 rating from 450+ families</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Where Every Child's{' '}
              <span className="gradient-text">Potential</span>{' '}
              Becomes Their{' '}
              <span className="gradient-text">Reality</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-brand-midnight/80 leading-relaxed">
              At DA Tuition, we help you choose the program that matches your child and the learning format that works best for them.
              For over 20 years, we've been creating personalized educational experiences where students don't just improve their grades—they
              discover their confidence, build resilience, and unlock their true potential.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 py-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-brand-blue-dark">20+</div>
                <div className="text-xs sm:text-sm text-brand-midnight/80">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-brand-blue-dark">10,000+</div>
                <div className="text-xs sm:text-sm text-brand-midnight/80">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-brand-blue-dark">95%</div>
                <div className="text-xs sm:text-sm text-brand-midnight/80">HSC Success Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="btn-primary group">
                <Link to={ctaDefaults.primaryLink}>
                  {ctaDefaults.primaryText}
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-brand-midnight/70">
              Join 450+ families who've discovered what's possible at DA Tuition
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative">
              <img
                src="/images/v3/hero_storefront.jpg"
                alt="DA Tuition Storefront"
                className="rounded-2xl shadow-2xl object-cover aspect-[4/3]"
              />

              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">95% HSC Success</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-blue-dark">A+</div>
                  <div className="text-xs text-brand-midnight/80">Average Improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
