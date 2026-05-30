import React, { useState, useRef, useEffect } from 'react';
import ReviewCarouselCard from './ReviewCarouselCard';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  subject: string;
  tags: string[];
}

interface DualRowCarouselProps {
  reviews: Review[];
  onReviewClick: (review: Review) => void;
  className?: string;
}

const DualRowCarousel: React.FC<DualRowCarouselProps> = ({
  reviews,
  onReviewClick,
  className = ''
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  // Split reviews into two groups for the two rows
  const midPoint = Math.ceil(reviews.length / 2);
  const topRowReviews = reviews.slice(0, midPoint);
  const bottomRowReviews = reviews.slice(midPoint);

  // Duplicate reviews for infinite scroll effect
  const topRowInfinite = [...topRowReviews, ...topRowReviews, ...topRowReviews];
  const bottomRowInfinite = [...bottomRowReviews, ...bottomRowReviews, ...bottomRowReviews];

  useEffect(() => {
    if (!topRowRef.current || !bottomRowRef.current) return;

    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;

    // Animation settings - responsive speed
    const animationDuration = window.innerWidth < 768 ? 4320000 : 3240000; // 72 minutes on mobile, 54 minutes on desktop
    const cardWidth = window.innerWidth < 640 ? 296 : 320; // Responsive card width (280px + 16px gap)
    const totalWidth = topRowReviews.length * cardWidth;

    // CSS animations
    const topRowKeyframes = `
      @keyframes scrollLeft {
        0% { transform: translateX(0px); }
        100% { transform: translateX(-${totalWidth}px); }
      }
    `;

    const bottomRowKeyframes = `
      @keyframes scrollRight {
        0% { transform: translateX(-${totalWidth}px); }
        100% { transform: translateX(0px); }
      }
    `;

    // Insert CSS animations
    const styleSheet = document.createElement('style');
    styleSheet.textContent = topRowKeyframes + bottomRowKeyframes;
    document.head.appendChild(styleSheet);

    // Apply animations
    if (!isPaused) {
      topRow.style.animation = `scrollLeft ${animationDuration}ms linear infinite`;
      bottomRow.style.animation = `scrollRight ${animationDuration}ms linear infinite`;
    } else {
      topRow.style.animationPlayState = 'paused';
      bottomRow.style.animationPlayState = 'paused';
    }

    // Cleanup
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isPaused, topRowReviews.length]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className={`w-full overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      {/* Top Row - Scrolling Left */}
      <div className="mb-4 sm:mb-6">
        <div 
          ref={topRowRef}
          className="flex space-x-3 sm:space-x-4 will-change-transform"
          style={{ width: 'fit-content' }}
        >
          {topRowInfinite.map((review, index) => (
            <ReviewCarouselCard
              key={`top-${review.id}-${index}`}
              review={review}
              onClick={() => onReviewClick(review)}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Bottom Row - Scrolling Right */}
      <div>
        <div 
          ref={bottomRowRef}
          className="flex space-x-3 sm:space-x-4 will-change-transform"
          style={{ width: 'fit-content' }}
        >
          {bottomRowInfinite.map((review, index) => (
            <ReviewCarouselCard
              key={`bottom-${review.id}-${index}`}
              review={review}
              onClick={() => onReviewClick(review)}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Pause functionality preserved but indicator removed for cleaner UI */}
    </div>
  );
};

export default DualRowCarousel;