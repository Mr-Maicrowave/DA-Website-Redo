import React from 'react';
import { Star, Calendar } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  subject: string;
  tags: string[];
}

interface ReviewCarouselCardProps {
  review: Review;
  onClick: () => void;
  className?: string;
}

const ReviewCarouselCard: React.FC<ReviewCarouselCardProps> = ({
  review,
  onClick,
  className = ''
}) => {
  // Truncate text to approximately 2 lines (about 100-120 characters)
  const truncateText = (text: string, maxLength: number = 110) => {
    if (text.length <= maxLength) return text;
    
    // Find the last complete sentence or period within the limit
    const truncated = text.slice(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastPeriod > maxLength * 0.7) {
      return text.slice(0, lastPeriod + 1);
    } else if (lastSpace > maxLength * 0.8) {
      return text.slice(0, lastSpace) + '...';
    } else {
      return truncated + '...';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderStars = () => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={14} 
          className="fill-yellow-400 text-yellow-400" 
        />
      ))}
    </div>
  );

  return (
    <div
      className={`
        bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50
        cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02]
        min-w-[280px] max-w-[320px] h-[160px] flex flex-col justify-between
        sm:min-w-[300px] lg:min-w-[320px]
        ${className}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Read full review by ${review.author}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-brand-midnight text-sm truncate">
            {review.author}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            {renderStars()}
            <span className="text-xs text-brand-midnight/70 flex items-center">
              <Calendar size={10} className="mr-1" />
              {formatDate(review.date)}
            </span>
          </div>
        </div>
        
        {/* Subject tag if not General */}
        {review.subject !== 'General' && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex-shrink-0 ml-2">
            {review.subject}
          </span>
        )}
      </div>

      {/* Truncated Review Text */}
      <div className="flex-1">
        <p className="text-brand-midnight/80 text-sm leading-relaxed">
          "{truncateText(review.text)}"
        </p>
      </div>

      {/* Read More Indicator */}
      <div className="flex justify-end mt-2 pr-1">
        <button className="text-xs text-brand-blue-dark font-medium hover:text-brand-blue-light hover:underline cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue-light focus:ring-opacity-50 rounded px-1 py-0.5">
          Read more →
        </button>
      </div>
    </div>
  );
};

export default ReviewCarouselCard;