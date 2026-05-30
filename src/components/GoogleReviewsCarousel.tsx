import React, { useState } from 'react';
import { Star } from 'lucide-react';
import DualRowCarousel from '@/components/reviews/DualRowCarousel';
import ReviewModal from '@/components/reviews/ReviewModal';
import reviewsData from '@/data/reviews.json';


interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  subject: string;
  tags: string[];
}

interface GoogleReviewsCarouselProps {
  className?: string;
}

const GoogleReviewsCarousel: React.FC<GoogleReviewsCarouselProps> = ({
  className = ''
}) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reviews = reviewsData.reviews as Review[];
  const summary = reviewsData.summary;
  const familiesDisplay = `${Math.ceil((summary?.total ?? 0) / 100) * 100}+`;

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const renderStars = (count: number = 5) => (
    <div className="flex items-center space-x-1">
      {[...Array(count)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />
      ))}
    </div>
  );

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-white/50 mb-4">
            {renderStars()}
            <span className="text-xs sm:text-sm font-medium text-brand-midnight/80">
              {summary.average}/5.0 from {familiesDisplay} families
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-midnight mb-4">
            From the Principal of{' '}
            <span className="gradient-text">DA Tuition</span>
          </h2>

          <p className="text-base sm:text-lg text-brand-midnight/80 max-w-2xl mx-auto">
            We’re deeply grateful to the parents and students who shared their heartfelt reviews. Your stories inspire us to work even harder to help every child unlock their full potential and achieve their highest marks.
            <span className="hidden sm:inline"> Click any review to read the full story.</span>
            <span className="sm:hidden"> Tap any review to read more.</span>
          </p>
        </div>

        {/* Dual Row Carousel */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-8 bg-gradient-to-r from-white/20 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-8 bg-gradient-to-l from-white/20 to-transparent z-10 pointer-events-none"></div>

          <DualRowCarousel
            reviews={reviews}
            onReviewClick={handleReviewClick}
            className="px-4 sm:px-8"
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 sm:mt-12 px-2">
          <p className="text-sm sm:text-base text-brand-midnight/80 mb-4">
            Ready to join the families who've discovered their potential?
          </p>
          <button 
            className="btn-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:scale-105 transition-transform text-sm sm:text-base"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Interview
          </button>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default GoogleReviewsCarousel;