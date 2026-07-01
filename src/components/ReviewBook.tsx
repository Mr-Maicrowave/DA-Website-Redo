import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play, BadgeCheck, X, Maximize2 } from 'lucide-react';

export interface BookReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  featured: boolean;
  subject: string;
}

interface ReviewBookProps {
  reviews: BookReview[];
  autoPlayMs?: number;
}

const headingFont = "'Merriweather', Georgia, serif";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'long' });
}

const clampStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 8,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

// Reviews longer than this are likely to get cut off by the 8-line clamp, so we offer a "Read full review" expand option.
const EXPAND_THRESHOLD = 200;

const ReviewBook: React.FC<ReviewBookProps> = ({ reviews, autoPlayMs = 6000 }) => {
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<{ dir: 'next' | 'prev'; from: number; to: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expandedReview, setExpandedReview] = useState<BookReview | null>(null);
  const touchStartX = useRef<number | null>(null);
  const total = reviews.length;

  const goTo = useCallback((dir: 'next' | 'prev', manual: boolean) => {
    if (total < 2) return;
    setFlip((current) => {
      if (current) return current;
      const to = dir === 'next' ? (index + 1) % total : (index - 1 + total) % total;
      return { dir, from: index, to };
    });
    if (manual) setIsPlaying(false);
  }, [index, total]);

  // Auto-play (paused while a review is expanded in the modal)
  useEffect(() => {
    if (!isPlaying || flip || total < 2 || expandedReview) return;
    const t = setTimeout(() => goTo('next', false), autoPlayMs);
    return () => clearTimeout(t);
  }, [isPlaying, flip, index, autoPlayMs, goTo, total, expandedReview]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (expandedReview) {
        if (e.key === 'Escape') setExpandedReview(null);
        return;
      }
      if (e.key === 'ArrowRight') goTo('next', true);
      if (e.key === 'ArrowLeft') goTo('prev', true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goTo, expandedReview]);

  const handleTransitionEnd = () => {
    if (!flip) return;
    setIndex(flip.to);
    setFlip(null);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) goTo(delta < 0 ? 'next' : 'prev', true);
    touchStartX.current = null;
  };

  if (total === 0) return null;

  const current = reviews[flip ? flip.from : index];
  const incoming = flip ? reviews[flip.to] : current;
  const pageNumber = (flip ? flip.from : index) + 1;

  const renderFace = (review: BookReview, pageNo: number) => (
    <div
      className="relative w-full h-full flex flex-col px-6 sm:px-12 lg:px-16 py-8 sm:py-12"
      style={{ background: 'linear-gradient(155deg, #fffdf8 0%, #fff6e6 100%)' }}
    >
      {/* faint decorative quote mark */}
      <Quote className="absolute top-4 right-5 sm:top-6 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 text-amber-900/[0.07] pointer-events-none" />

      <div className="flex items-center justify-between mb-4 sm:mb-6 shrink-0">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'} />
          ))}
        </div>
        {review.subject !== 'General' && (
          <span
            className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border border-amber-300/60 text-amber-800 bg-amber-50"
          >
            {review.subject}
          </span>
        )}
      </div>

      <div className="relative flex-1 min-h-0 overflow-hidden">
        <blockquote
          className={`absolute inset-x-0 top-0 z-10 text-stone-800 italic text-base sm:text-xl lg:text-2xl leading-relaxed ${
            review.text.length > EXPAND_THRESHOLD ? 'bottom-7 sm:bottom-8' : 'bottom-0'
          }`}
          style={{ fontFamily: headingFont, ...clampStyle }}
        >
          "{review.text}"
        </blockquote>
        {review.text.length > EXPAND_THRESHOLD && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-7 sm:bottom-8 h-5"
              style={{ background: 'linear-gradient(to top, #fff6e6, transparent)' }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(false);
                setExpandedReview(review);
              }}
              className="absolute z-20 bottom-0 left-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-800 underline-offset-2 hover:underline"
            >
              <Maximize2 size={13} />
              Read full review
            </button>
          </>
        )}
      </div>

      <div className="relative z-10 mt-6 sm:mt-8 pt-5 border-t border-amber-900/10 flex items-center justify-between flex-wrap gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shrink-0"
            style={{ background: '#fff1cd', color: '#9a7517', fontFamily: headingFont }}
          >
            {review.author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-stone-900 text-sm sm:text-base" style={{ fontFamily: headingFont }}>
              {review.author}
            </div>
            <div className="text-[11px] sm:text-xs text-stone-500 flex items-center gap-1">
              <BadgeCheck size={12} className="text-emerald-600" />
              Verified Google Review &middot; {formatDate(review.date)}
            </div>
          </div>
        </div>
        <div className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-amber-700/60 font-medium">
          Page {pageNo} / {total}
        </div>
      </div>
    </div>
  );

  return (
    <div className="select-none">
      {/* tilted "lying open" outer frame */}
      <div
        className="relative mx-auto max-w-3xl"
        style={{ perspective: '2400px', transformStyle: 'preserve-3d' }}
      >
        {/* page-stack sliver shadows to suggest thickness */}
        <div className="absolute inset-y-3 right-[-6px] left-[6px] rounded-[1.4rem] bg-amber-100/70 -z-10" style={{ transform: 'translateY(6px)' }} />
        <div className="absolute inset-y-2 right-[-3px] left-[3px] rounded-[1.4rem] bg-amber-50/90 -z-10" style={{ transform: 'translateY(3px)' }} />

        {/* spine / cover frame */}
        <div
          className="relative rounded-[1.6rem] p-1.5 sm:p-2 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #1a2c4a 0%, #0d1b2e 60%, #1a2c4a 100%)' }}
        >
          {/* ribbon bookmark */}
          <div
            className="absolute -top-2 right-10 sm:right-16 w-4 sm:w-5 h-12 sm:h-16 z-20"
            style={{
              background: 'linear-gradient(180deg, #d4a647, #b5562f)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
            }}
          />

          <div
            className="relative rounded-[1.3rem] overflow-hidden h-[420px] sm:h-[400px] lg:h-[380px]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* bottom / incoming layer */}
            <div className="absolute inset-0">{renderFace(incoming, (flip ? flip.to : index) + 1)}</div>

            {/* top / current layer that flips away */}
            <div
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                transformOrigin: flip?.dir === 'prev' ? 'right center' : 'left center',
                WebkitTransformOrigin: flip?.dir === 'prev' ? 'right center' : 'left center',
                transform: flip ? `rotateY(${flip.dir === 'next' ? -176 : 176}deg)` : 'rotateY(0deg)',
                transition: flip ? 'transform 700ms cubic-bezier(.45,.05,.55,.95)' : 'none',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform',
                boxShadow: '0 0 40px rgba(0,0,0,0.08)',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {renderFace(current, pageNumber)}
              {flip && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      flip.dir === 'next'
                        ? 'linear-gradient(to left, rgba(0,0,0,0.4), transparent 60%)'
                        : 'linear-gradient(to right, rgba(0,0,0,0.4), transparent 60%)',
                    animation: 'reviewBookFlipShadow 700ms ease-in-out',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* nav buttons */}
        <button
          aria-label="Previous review"
          onClick={() => goTo('prev', true)}
          className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:translate-x-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-50 hover:scale-105 transition-all z-30"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          aria-label="Next review"
          onClick={() => goTo('next', true)}
          className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-50 hover:scale-105 transition-all z-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* controls row */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          aria-label={isPlaying ? 'Pause auto-flip' : 'Resume auto-flip'}
          onClick={() => setIsPlaying((p) => !p)}
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-700 transition-colors shrink-0"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <div className="w-40 sm:w-64 h-1.5 rounded-full bg-stone-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-xs sm:text-sm text-stone-500 font-medium shrink-0 tabular-nums">
          {index + 1} / {total}
        </span>
      </div>

      {/* expanded review modal */}
      {expandedReview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Full review from ${expandedReview.author}`}
          onClick={() => setExpandedReview(null)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-[1.3rem] p-6 sm:p-10 shadow-2xl"
            style={{ background: 'linear-gradient(155deg, #fffdf8 0%, #fff6e6 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close review"
              onClick={() => setExpandedReview(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-600 shadow-md hover:bg-amber-50 hover:text-stone-900 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center justify-between gap-3 pr-12">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < expandedReview.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                  />
                ))}
              </div>
              {expandedReview.subject !== 'General' && (
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border border-amber-300/60 text-amber-800 bg-amber-50">
                  {expandedReview.subject}
                </span>
              )}
            </div>

            <blockquote
              className="relative z-10 mt-5 text-stone-800 italic text-base sm:text-xl leading-relaxed"
              style={{ fontFamily: headingFont }}
            >
              "{expandedReview.text}"
            </blockquote>

            <div className="relative z-10 mt-6 pt-5 border-t border-amber-900/10 flex items-center gap-3">
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shrink-0"
                style={{ background: '#fff1cd', color: '#9a7517', fontFamily: headingFont }}
              >
                {expandedReview.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-stone-900 text-sm sm:text-base" style={{ fontFamily: headingFont }}>
                  {expandedReview.author}
                </div>
                <div className="text-[11px] sm:text-xs text-stone-500 flex items-center gap-1">
                  <BadgeCheck size={12} className="text-emerald-600" />
                  Verified Google Review &middot; {formatDate(expandedReview.date)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes reviewBookFlipShadow {
          0% { opacity: 0; }
          45% { opacity: 1; }
          55% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ReviewBook;
