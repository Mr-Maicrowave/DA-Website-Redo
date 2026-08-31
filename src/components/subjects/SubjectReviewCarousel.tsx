import { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, X } from 'lucide-react';
import { mathsReviews, scienceReviews, type SubjectReview } from '@/data/subject-reviews';
import { getReviewPosition, getReviewPreview, type ReviewPosition } from './subjectReviewCarouselUtils';
import './subject-review-carousel.css';

type Subject = 'maths' | 'science';

const reviewSets = { maths: mathsReviews, science: scienceReviews } as const;

export function SubjectReviewCarousel({ subject }: { subject: Subject }) {
  const reviews = reviewSets[subject];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const subjectLabel = subject === 'maths' ? 'Maths' : 'Science';
  const normalize = useCallback((index: number) => (index + reviews.length) % reviews.length, [reviews.length]);

  const move = useCallback((offset: number) => {
    setIsReading(false);
    setActiveIndex((current) => normalize(current + offset));
  }, [normalize]);

  return (
    <section className="subject-reviews" aria-labelledby={`${subject}-reviews-heading`}>
      <div className="subject-reviews__inner">
        <header className="subject-reviews__header">
          <p>Real student reviews</p>
          <h2 id={`${subject}-reviews-heading`}>
            Progress you can <em>see.</em><br />
            Confidence you can <em>feel.</em>
          </h2>
        </header>

        <div
          className={`subject-reviews__stage${isReading ? ' is-reading' : ''}`}
          aria-label={`${subjectLabel} student reviews`}
          aria-roledescription="carousel"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') move(-1);
            if (event.key === 'ArrowRight') move(1);
          }}
          onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            const startX = touchStartX.current;
            const endX = event.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (startX !== null && endX !== undefined && Math.abs(startX - endX) > 44) move(startX > endX ? 1 : -1);
          }}
          tabIndex={0}
        >
          {reviews.map((review, index) => {
            const position = getReviewPosition(index, activeIndex, reviews.length);
            return (
              <ReviewCard
                key={`${review.author}-${index}`}
                review={review}
                position={position}
                subjectLabel={subjectLabel}
                isReading={isReading && position === 'active'}
                onRead={() => setIsReading(true)}
                onClose={() => setIsReading(false)}
              />
            );
          })}

          {!isReading && <>
            <button type="button" onClick={() => move(-1)} aria-label="Previous student review" className="subject-reviews__arrow subject-reviews__arrow--previous"><ChevronLeft aria-hidden="true" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next student review" className="subject-reviews__arrow subject-reviews__arrow--next"><ChevronRight aria-hidden="true" /></button>
          </>}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, position, subjectLabel, isReading = false, onRead, onClose }: {
  review: SubjectReview;
  position: ReviewPosition;
  subjectLabel?: string;
  isReading?: boolean;
  onRead?: () => void;
  onClose?: () => void;
}) {
  const isActive = position === 'active';
  const isSideCard = position === 'previous' || position === 'next';
  const preview = getReviewPreview(review.quote, isSideCard ? 135 : 190);

  return (
    <article className={`subject-review-card subject-review-card--${position}${isReading ? ' is-reading' : ''}`} data-review-position={position} aria-hidden={!isActive}>
      {isReading && isActive ? (
        <div className="subject-review-card__expanded">
          <div className="subject-review-card__expanded-header">
            <p>Full {subjectLabel} review</p>
            <button type="button" onClick={onClose} aria-label="Back to review preview"><X aria-hidden="true" /></button>
          </div>
          <blockquote>“{review.quote}”</blockquote>
          <ReviewMeta review={review} />
        </div>
      ) : <>
        <div className="subject-review-card__ornament" aria-hidden="true"><Quote /></div>
        <blockquote className="subject-review-card__quote">“{preview}”</blockquote>
        {isActive && <button type="button" onClick={onRead} className="subject-review-card__full">Read full review <span aria-hidden="true">→</span></button>}
        <ReviewMeta review={review} />
      </>}
    </article>
  );
}

function ReviewMeta({ review }: { review: SubjectReview }) {
  return <footer className="subject-review-card__meta"><span aria-hidden="true" /><p>{review.author}</p><small>{review.source}</small></footer>;
}
