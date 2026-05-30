import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { getReviewsSummary } from '@/utils/reviewHelpers';

interface ReviewsBadgeProps {
  className?: string;
  showLink?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ReviewsBadge: React.FC<ReviewsBadgeProps> = ({
  className = '',
  showLink = true,
  size = 'md'
}) => {
  const summary = getReviewsSummary();
  
  const sizeClasses = {
    sm: { star: 14, text: 'text-sm', rating: 'text-sm' },
    md: { star: 16, text: 'text-base', rating: 'text-base' },
    lg: { star: 18, text: 'text-lg', rating: 'text-lg' }
  };

  return (
    <div className={`inline-flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={sizeClasses[size].star} 
              className="fill-yellow-400 text-yellow-400" 
            />
          ))}
        </div>
        <span className={`font-medium text-brand-midnight/80 ${sizeClasses[size].rating}`}>
          {summary.average}
        </span>
        <span className={`text-brand-midnight/70 ${sizeClasses[size].text}`}>
          ({summary.total}+ reviews)
        </span>
      </div>
      
      {showLink && (
        <a
          href="https://www.google.com/search?q=DA+Tuition+Canley+Heights"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-blue-dark hover:text-brand-blue-light transition-colors ml-2"
          aria-label="View all reviews on Google"
        >
          <ExternalLink size={sizeClasses[size].star} />
        </a>
      )}
    </div>
  );
};

export default ReviewsBadge;