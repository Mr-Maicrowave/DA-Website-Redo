import React from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StaticGoogleReviews from '@/components/StaticGoogleReviews';
import CTASection from '@/components/CTASection';
import SEO from '@/components/SEO';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteStats } from '@/data/site-stats';

const Reviews = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title={`Student & Parent Reviews | ${siteStats.reviewCount} Five-Star Testimonials`}
        description={`Read all ${siteStats.reviewCount} five-star Google reviews from the DA Tuition family. Discover how we've helped thousands of students achieve academic excellence.`}
      />
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Header Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/class_smiling.jpg" alt="DA Tuition Reviews" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Friendly vibrant pastel glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-amber-500/30 to-rose-400/40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 lg:py-28">
            <Link
              to="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Student <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-pink-300">Reviews</span>
            </h1>
            <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md font-medium">
              Read all 450+ testimonials from our DA Family
            </p>
          </div>
        </section>
      </div>

      {/* Reviews Section with Full Features */}
      <StaticGoogleReviews
        layout="grid"
        maxReviews={12}
        showHeader={false}
        showFilters={true}
        className="pt-8 pb-16"
      />

      <CTASection 
        heading="Experience the DA Difference Yourself"
        subheading={`Join the ${siteStats.reviewCount}+ families who have already discovered their child's true potential.`}
        className="bg-brand-navy"
      />

      <FooterNew />
    </div>
  );
};

export default Reviews;