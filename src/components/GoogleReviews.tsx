import React from 'react';
import StaticGoogleReviews from '@/components/StaticGoogleReviews';

interface GoogleReviewsProps {
  layout?: 'carousel' | 'grid' | 'featured';
  maxReviews?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  className?: string;
}

const GoogleReviews: React.FC<GoogleReviewsProps> = ({
  layout = 'carousel',
  maxReviews = 6,
  showHeader = true,
  showFilters = false,
  className = ''
}) => {
  return (
    <StaticGoogleReviews
      layout={layout}
      maxReviews={maxReviews}
      showHeader={showHeader}
      showFilters={showFilters}
      className={className}
    />
  );
};

export default GoogleReviews;