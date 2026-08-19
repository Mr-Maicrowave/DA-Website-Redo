import type { CSSProperties } from 'react';
import { ArrowRight, Image as ImageIcon, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubjectHeroProps {
  /** Small uppercase badge above the headline, e.g. "Years 7-12 English" */
  eyebrow: string;
  /** Icon watermarked into the placeholder background when no real photo is supplied */
  icon: LucideIcon;
  /** First line of the motto, rendered in white */
  headlineWhite: string;
  /** Second line of the motto, rendered in gold */
  headlineGold: string;
  /** Supporting paragraph under the motto */
  subtext: string;
  /** Short proof points shown as a pill row, e.g. ["Booklet-led lessons", "Marked feedback", "Clear writing pathway"] */
  proofPills?: [string, string, string];
  /** Id (no #) of the section the Explore button should scroll to */
  exploreTargetId: string;
  /** Hide the Explore button for hero variants that should lead with copy only. */
  showExploreButton?: boolean;
  /** Short label describing what photo should eventually replace the placeholder, e.g. "Mathematics classroom" */
  placeholderLabel: string;
  /** Keep an internal placeholder without exposing unfinished-production copy to visitors. */
  showPlaceholderBadge?: boolean;
  /** Real photo to use as the hero background. Omit to show the placeholder instead. */
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  /** Mobile-only focal point for a desktop-oriented source image. */
  mobileBackgroundPosition?: string;
  /** Desktop focal point for a source image. */
  backgroundPosition?: string;
  /** Use contain when the entire source image must remain visible. */
  backgroundFit?: 'cover' | 'contain';
  /** Optional zoom for photos that need tighter art direction behind the fixed copy. */
  backgroundScale?: number;
  /** English trial: place the copy low in the mobile hero to preserve the photo's focal subject. */
  mobileContentPosition?: 'center' | 'bottom';
  /** Optional page-specific nudge for the copy block, without changing the shared hero layout. */
  copyOffsetClassName?: string;
}

/**
 * Shared hero used at the top of every subject page (English, Mathematics, Science).
 * Only the copy (and, once photos exist, the background photo) passed in as props
 * should differ between pages — layout, type, colour and spacing are intentionally
 * identical across all three.
 */
const SubjectHero = ({
  eyebrow,
  icon: Icon,
  headlineWhite,
  headlineGold,
  subtext,
  proofPills,
  exploreTargetId,
  showExploreButton = true,
  placeholderLabel,
  showPlaceholderBadge = true,
  backgroundImageSrc,
  backgroundImageAlt,
  mobileBackgroundPosition,
  backgroundPosition,
  backgroundFit = 'cover',
  backgroundScale,
  mobileContentPosition = 'center',
  copyOffsetClassName,
}: SubjectHeroProps) => {
  const scrollToExplore = () => {
    document.getElementById(exploreTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={`subject-hero relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#071629] px-5 py-28 lg:px-8 ${mobileContentPosition === 'bottom' ? 'subject-hero--mobile-bottom-copy' : ''}`}>
      <div className="absolute inset-0">
        {backgroundImageSrc ? (
          <img
            src={backgroundImageSrc}
            alt={backgroundImageAlt ?? ''}
            className="subject-hero-image h-full w-full object-cover"
            style={{
              objectFit: backgroundFit,
              ...(backgroundPosition ? { objectPosition: backgroundPosition } : {}),
              ...(mobileBackgroundPosition ? { '--subject-hero-mobile-position': mobileBackgroundPosition } : {}),
              ...(backgroundScale ? { transform: `scale(${backgroundScale})`, transformOrigin: backgroundPosition ?? 'center center' } : {}),
            } as CSSProperties}
          />
        ) : (
          <>
            {/* Placeholder background — swap for a real photo later */}
            <div
              className="h-full w-full"
              style={{
                background: 'repeating-linear-gradient(135deg, #0c2038 0px, #0c2038 22px, #0f2745 22px, #0f2745 44px)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-end pr-6 opacity-[0.06] lg:pr-16">
              <Icon className="h-[62%] w-auto text-white" strokeWidth={0.5} />
            </div>
            {showPlaceholderBadge ? (
              <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-full border border-dashed border-white/30 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
                <ImageIcon className="h-3 w-3" />
                Photo placeholder — {placeholderLabel}
              </div>
            ) : null}
          </>
        )}
        <div
          className="subject-hero-overlay absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(4,11,23,.86) 0%, rgba(4,11,23,.66) 46%, rgba(4,11,23,.22) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`subject-hero-copy max-w-3xl ${copyOffsetClassName ?? ''}`}
        >
          <div className="mb-5 inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#f1df9a]">
            <span className="h-[2px] w-7 bg-[#c9a227]" />
            {eyebrow}
          </div>

          <h1
            className="subject-hero-heading text-white"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(3rem, 6.5vw, 6.6rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {headlineWhite}
            <span className="block text-[#c9a227]">{headlineGold}</span>
          </h1>

          <p className="mt-7 max-w-[54ch] text-lg leading-[1.75] text-white/85">{subtext}</p>

          {showExploreButton ? (
            <div className="mt-8">
              <button
                type="button"
                onClick={scrollToExplore}
                className="inline-flex h-12 items-center rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 transition hover:bg-[#e0bd4b]"
              >
                Explore
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          ) : null}

          {proofPills ? (
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-black uppercase tracking-[0.06em] text-white">
              {proofPills.map((pill) => (
                <span key={pill} className="border-l-2 border-[#c9a227] pl-3">
                  {pill}
                </span>
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
      {(mobileBackgroundPosition || mobileContentPosition === 'bottom') && (
        <style>{`
          @media (max-width: 767px) {
            .subject-hero-image { object-position: var(--subject-hero-mobile-position); }
            .subject-hero--mobile-bottom-copy {
              min-height: 44rem;
              justify-content: flex-end;
              padding-top: 6rem;
              padding-bottom: 2.5rem;
            }
            .subject-hero--mobile-bottom-copy .subject-hero-overlay {
              background: linear-gradient(180deg, rgba(4,11,23,.24) 0%, rgba(4,11,23,.18) 33%, rgba(4,11,23,.5) 58%, rgba(4,11,23,.94) 100%), linear-gradient(90deg, rgba(4,11,23,.68) 0%, rgba(4,11,23,.32) 100%) !important;
            }
            .subject-hero--mobile-bottom-copy .subject-hero-heading {
              font-size: clamp(3rem, 12.5vw, 3.7rem) !important;
            }
            .subject-hero--mobile-bottom-copy .subject-hero-copy > p {
              margin-top: 1.35rem;
              font-size: 1rem;
              line-height: 1.55;
            }
            .subject-hero--mobile-bottom-copy .subject-hero-copy > div:last-child {
              margin-top: 1.5rem;
            }
          }
        `}</style>
      )}
    </section>
  );
};

export default SubjectHero;
