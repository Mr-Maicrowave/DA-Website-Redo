import { useRef, type PointerEvent, type ReactNode } from 'react';

import './ReviewCard.css';

export type ReviewCardProps = {
  review: string;
  name: string;
  role: string;
  rating: number;
  googleIcon: ReactNode;
  className?: string;
};

const ReviewCard = ({
  review,
  name,
  role,
  rating,
  googleIcon,
  className = '',
}: ReviewCardProps) => {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)));
  const plaqueRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const plaque = plaqueRef.current;
    if (!plaque) return;
    const bounds = plaque.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      plaque.style.setProperty('--plaque-rotate-x', `${(0.5 - y) * 10}deg`);
      plaque.style.setProperty('--plaque-rotate-y', `${(x - 0.5) * 14}deg`);
      plaque.style.setProperty('--plaque-light-x', `${x * 100}%`);
      plaque.style.setProperty('--plaque-light-y', `${y * 100}%`);
      plaque.style.setProperty('--plaque-shadow-x', `${(0.5 - x) * 12}px`);
      plaque.style.setProperty('--plaque-shadow-y', `${8 + (0.5 - y) * 8}px`);
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const plaque = plaqueRef.current;
    if (!plaque) return;
    plaque.style.setProperty('--plaque-rotate-x', '0deg');
    plaque.style.setProperty('--plaque-rotate-y', '0deg');
    plaque.style.setProperty('--plaque-light-x', '28%');
    plaque.style.setProperty('--plaque-light-y', '18%');
    plaque.style.setProperty('--plaque-shadow-x', '0px');
    plaque.style.setProperty('--plaque-shadow-y', '10px');
  };

  return (
    <div
      ref={plaqueRef}
      className={`review-plaque${className ? ` ${className}` : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="review-plaque__shell review-plaque__shell--far" aria-hidden="true" />
      <span className="review-plaque__shell review-plaque__shell--near" aria-hidden="true" />
      <span className="review-plaque__back" aria-hidden="true" />
      <span className="review-plaque__edge review-plaque__edge--left" aria-hidden="true" />
      <span className="review-plaque__edge review-plaque__edge--right" aria-hidden="true" />
      <span className="review-plaque__edge review-plaque__edge--top" aria-hidden="true" />
      <span className="review-plaque__edge review-plaque__edge--bottom" aria-hidden="true" />
      <article
        className="review-card"
        aria-label={`${normalizedRating} out of 5 star Google review from ${name}`}
      >
        <span className="review-card__light" aria-hidden="true" />
        <header className="review-card__header">
          <span className="review-card__stars" aria-label={`${normalizedRating} out of 5 stars`}>
            <span aria-hidden="true">{'★'.repeat(normalizedRating)}</span>
            <span className="review-card__empty-stars" aria-hidden="true">
              {'★'.repeat(5 - normalizedRating)}
            </span>
          </span>
          <span className="review-card__google-icon">{googleIcon}</span>
        </header>

        <p className="review-card__review">{review}</p>

        <footer className="review-card__reviewer">
          <strong>{name}</strong>
          <span>{role}</span>
        </footer>
      </article>
    </div>
  );
};

export default ReviewCard;
