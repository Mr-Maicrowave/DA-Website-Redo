import React, { useState, useMemo } from 'react';
import { Star, ExternalLink, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import reviewsData from '@/data/reviews.json';

interface Review {
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

interface StaticGoogleReviewsProps {
  layout?: 'carousel' | 'grid' | 'featured';
  maxReviews?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  className?: string;
}

const StaticGoogleReviews: React.FC<StaticGoogleReviewsProps> = ({
  layout = 'carousel',
  maxReviews = 10,
  showHeader = true,
  showFilters = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  
  const reviews = reviewsData.reviews as Review[];
  const summary = reviewsData.summary;

  // Filter and search reviews
  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply rating filter
    if (ratingFilter) {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }

    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(review => 
        review.subject.toLowerCase() === subjectFilter.toLowerCase()
      );
    }

    // Show featured first, then by date
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [reviews, searchTerm, ratingFilter, subjectFilter]);

  // Pagination for grid layout
  const reviewsPerPage = layout === 'carousel' ? maxReviews : 6;
  const paginatedReviews = layout === 'grid' 
    ? filteredReviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage)
    : filteredReviews.slice(0, maxReviews);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'long' });
  };

  const getUniqueSubjects = () => {
    const subjects = [...new Set(reviews.map(review => review.subject))];
    return subjects.filter(subject => subject !== 'General');
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={16} 
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
        />
      ))}
    </div>
  );

  const renderReviewCard = (review: Review, index: number) => (
    <div
      key={review.id}
      className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50 ${
        review.featured ? 'ring-2 ring-orange-200' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {review.featured && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Featured Review
          </span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-brand-midnight">{review.author}</h4>
          <div className="flex items-center space-x-2 mt-1">
            {renderStars(review.rating)}
            <span className="text-sm text-brand-midnight/70">{formatDate(review.date)}</span>
          </div>
          {review.subject !== 'General' && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              {review.subject}
            </span>
          )}
        </div>
      </div>

      <p className="text-brand-midnight/80 leading-relaxed text-sm mb-4">
        {review.text}
      </p>

      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {review.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-brand-midnight/80 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-1 mr-3">
                {renderStars(5)}
              </div>
              <span className="text-lg font-semibold text-brand-midnight/80">
                {summary.average} from {summary.total}+ Reviews
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              What Our <span className="gradient-text">DA Family</span> Says
            </h2>
            <p className="text-xl text-brand-midnight/80">
              Real experiences from real families. See why over {summary.total} families trust DA Tuition 
              with their children's education and personal growth.
            </p>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="max-w-4xl mx-auto mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <select
                  value={ratingFilter || ''}
                  onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
                >
                  <option value="all">All Subjects</option>
                  <option value="general">General</option>
                  {getUniqueSubjects().map(subject => (
                    <option key={subject} value={subject.toLowerCase()}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || ratingFilter || subjectFilter !== 'all') && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setRatingFilter(null);
                    setSubjectFilter('all');
                    setCurrentPage(0);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Reviews Display */}
        {layout === 'carousel' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {paginatedReviews.map((review, index) => renderReviewCard(review, index))}
          </div>
        )}

        {layout === 'grid' && (
          <>
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
              {paginatedReviews.map((review, index) => renderReviewCard(review, index))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-brand-midnight/80">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {layout === 'featured' && (
          <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
            {paginatedReviews.filter(review => review.featured).map((review, index) => 
              renderReviewCard(review, index)
            )}
          </div>
        )}

        {/* Links */}
        <div className="text-center mt-12 space-y-4">
          {layout !== 'grid' && (
            <div>
              <a
                href="/reviews"
                className="inline-flex items-center text-brand-blue-dark hover:text-brand-blue-light transition-colors font-medium text-lg"
              >
                Read all {summary.total} reviews
                <ChevronRight size={16} className="ml-2" />
              </a>
            </div>
          )}
          <div>
            <a
              href="https://www.google.com/search?q=DA+Tuition+Canley+Heights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-brand-blue-dark hover:text-brand-blue-light transition-colors font-medium"
            >
              View all reviews on Google
              <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticGoogleReviews;