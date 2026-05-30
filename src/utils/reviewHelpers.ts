import reviewsData from '@/data/reviews.json';

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  helpful: boolean;
  featured: boolean;
  tags: string[];
  subject: string;
}

export interface ReviewsSummary {
  total: number;
  average: number;
  lastUpdated: string;
  breakdown: {
    '5_star': number;
    '4_star': number;
    '3_star': number;
    '2_star': number;
    '1_star': number;
  };
}

// Get all reviews
export const getAllReviews = (): Review[] => {
  return reviewsData.reviews as Review[];
};

// Get reviews summary
export const getReviewsSummary = (): ReviewsSummary => {
  return reviewsData.summary as ReviewsSummary;
};

// Get featured reviews only
export const getFeaturedReviews = (): Review[] => {
  return getAllReviews().filter(review => review.featured);
};

// Get recent reviews (last 30 days)
export const getRecentReviews = (days: number = 30): Review[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return getAllReviews().filter(review => 
    new Date(review.date) >= cutoffDate
  );
};

// Get reviews by rating
export const getReviewsByRating = (rating: number): Review[] => {
  return getAllReviews().filter(review => review.rating === rating);
};

// Get reviews by subject
export const getReviewsBySubject = (subject: string): Review[] => {
  return getAllReviews().filter(review => 
    review.subject.toLowerCase() === subject.toLowerCase()
  );
};

// Search reviews by text content
export const searchReviews = (searchTerm: string): Review[] => {
  const term = searchTerm.toLowerCase();
  return getAllReviews().filter(review =>
    review.text.toLowerCase().includes(term) ||
    review.author.toLowerCase().includes(term) ||
    review.tags.some(tag => tag.toLowerCase().includes(term)) ||
    review.subject.toLowerCase().includes(term)
  );
};

// Get unique subjects
export const getUniqueSubjects = (): string[] => {
  const subjects = [...new Set(getAllReviews().map(review => review.subject))];
  return subjects.sort();
};

// Get unique tags
export const getUniqueTags = (): string[] => {
  const allTags = getAllReviews().flatMap(review => review.tags);
  return [...new Set(allTags)].sort();
};

// Get random reviews
export const getRandomReviews = (count: number): Review[] => {
  const reviews = getAllReviews();
  const shuffled = [...reviews].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Format date for display
export const formatReviewDate = (dateString: string, format: 'short' | 'long' = 'long'): string => {
  const date = new Date(dateString);
  if (format === 'short') {
    return date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
  }
  return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Calculate average rating for a subset of reviews
export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

// Get review distribution
export const getReviewDistribution = (reviews?: Review[]) => {
  const reviewsToAnalyze = reviews || getAllReviews();
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviewsToAnalyze.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  
  return distribution;
};

// Truncate review text
export const truncateReviewText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Check if review is recent (within last 90 days)
export const isRecentReview = (dateString: string): boolean => {
  const reviewDate = new Date(dateString);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  return reviewDate >= cutoffDate;
};

// Sort reviews by criteria
export const sortReviews = (reviews: Review[], sortBy: 'date' | 'rating' | 'featured' = 'date'): Review[] => {
  return [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'featured':
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
};