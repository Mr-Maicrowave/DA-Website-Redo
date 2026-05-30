import React from 'react';
import { X, Star, Calendar, Tag } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  subject: string;
  tags: string[];
}

interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ review, isOpen, onClose }) => {
  // Handle escape key - must be called before any early returns
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !review) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    });
  };

  const renderStars = () => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={20} 
          className="fill-yellow-400 text-yellow-400" 
        />
      ))}
    </div>
  );

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <h2 id="review-modal-title" className="text-xl font-semibold text-brand-midnight truncate">
              Review by {review.author}
            </h2>
            <div className="flex items-center space-x-4 mt-2">
              {renderStars()}
              <span className="text-sm text-brand-midnight/70 flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(review.date)}
              </span>
              {review.subject !== 'General' && (
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {review.subject}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-brand-midnight/80 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close review"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-gray max-w-none">
            <p className="text-brand-midnight/80 leading-relaxed text-base">
              "{review.text}"
            </p>
          </div>

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center mb-3">
                <Tag size={16} className="text-gray-400 mr-2" />
                <span className="text-sm font-medium text-brand-midnight/80">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-brand-midnight/80 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
          <div className="text-sm text-brand-midnight/70">
            Review ID: {review.id}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-brand-midnight/80 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;