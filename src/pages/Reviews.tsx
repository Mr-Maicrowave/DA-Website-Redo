import React, { useMemo } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import StaticGoogleReviews from '@/components/StaticGoogleReviews';
import ReviewBook from '@/components/ReviewBook';
import CTASection from '@/components/CTASection';
import SEO from '@/components/SEO';
import { ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteStats } from '@/data/site-stats';
import reviewsData from '@/data/reviews.json';

const Reviews = () => {
  const bookReviews = useMemo(() => {
    return [...reviewsData.reviews].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#172033]">
      <SEO
        title={`Student & Parent Reviews | ${siteStats.reviewCount} Five-Star Testimonials`}
        description={`Read all ${siteStats.reviewCount} five-star Google reviews from the DA Tuition family. Discover how we've helped thousands of students achieve academic excellence.`}
      />
      <NavigationNew />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#071629] pt-36 lg:pt-40">
          <div className="absolute inset-0">
            <img
              src="/images/programs/highschool-whiteboard-teach-2.jpg"
              alt="DA Tuition tutor teaching a high school class at the whiteboard"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/88 to-[#071629]/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-5 pb-24 text-center lg:px-8 lg:pb-28">
            <Link
              to="/"
              className="mb-8 inline-flex items-center text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Home
            </Link>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#f1df9a] backdrop-blur-md">
              <Star className="h-4 w-4" />
              {siteStats.googleRating} · {siteStats.reviewCount}+ Google Reviews
            </div>

            <h1 className="mx-auto max-w-3xl font-serif text-5xl font-medium leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Student <br />
              <span className="bg-gradient-to-r from-[#c9a227] to-[#f1df9a] bg-clip-text text-transparent">Reviews</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
              Read all 450+ testimonials from our DA Family
            </p>
          </div>
        </section>

        {/* ── Flip-book review showcase ── */}
        <section className="bg-[#fff6e7] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">
                In Their Own Words
              </p>
              <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629] md:text-4xl">
                Turn the Page on Real Stories
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#61708a]">
                Flip through all {bookReviews.length} five-star reviews from the DA family — or let it turn the page for you.
              </p>
            </div>
            <ReviewBook reviews={bookReviews} />
          </div>
        </section>

        {/* ── Reviews Section with Full Features ── */}
        <section className="bg-[#fffdf8] px-5 pt-20 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a227]">
              Browse By Topic
            </p>
            <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629] md:text-4xl">
              Browse Reviews by Topic
            </h2>
          </div>
        </section>
        <StaticGoogleReviews
          layout="grid"
          maxReviews={12}
          showHeader={false}
          showFilters={true}
          className="bg-[#fffdf8] pb-16 pt-8"
        />

        <CTASection
          heading="Experience the DA Difference Yourself"
          subheading={`Join the ${siteStats.reviewCount}+ families who have already discovered their child's true potential.`}
          className="bg-[#071629]"
        />
      </main>

      <FooterNew />
    </div>
  );
};

export default Reviews;
