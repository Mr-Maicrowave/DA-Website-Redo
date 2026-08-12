import type { ReactNode } from 'react';
import { ArrowRight, Image as ImageIcon, type LucideIcon } from 'lucide-react';

export interface RevealHeroProps {
  /** Small uppercase badge above the headline, e.g. "Primary School · Years 1-6" */
  eyebrow: string;
  /** Icon watermarked into the placeholder background when no real photo is supplied */
  icon: LucideIcon;
  /** First line of the motto, rendered in white */
  headlineWhite: string;
  /** Second line of the motto, rendered in gold */
  headlineGold: string;
  /** Supporting paragraph under the motto */
  subtext: string;
  /** Three short proof points shown as a pill row */
  proofPills: [string, string, string];
  /** Short label describing what photo should eventually replace the placeholder */
  placeholderLabel: string;
  /** Real photo to use as the hero background. Omit to show the placeholder instead. */
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  /** Extra scroll distance (in vh) the reveal transition consumes, beyond the hero's own 100svh. Default 35. */
  pinRangeVh?: number;
  /** The section to reveal — rendered once, in normal document flow, right after the hero. */
  children: ReactNode;
}

const RevealHeroPhoto = ({
  icon: Icon,
  placeholderLabel,
  backgroundImageSrc,
  backgroundImageAlt,
}: Pick<RevealHeroProps, 'icon' | 'placeholderLabel' | 'backgroundImageSrc' | 'backgroundImageAlt'>) => (
  <div className="absolute inset-0">
    {backgroundImageSrc ? (
      <img
        src={backgroundImageSrc}
        alt={backgroundImageAlt ?? ''}
        className="h-full w-full object-cover"
      />
    ) : (
      <>
        <div
          className="h-full w-full"
          style={{
            background: 'repeating-linear-gradient(135deg, #0c2038 0px, #0c2038 22px, #0f2745 22px, #0f2745 44px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-end pr-6 opacity-[0.06] lg:pr-16">
          <Icon className="h-[62%] w-auto text-white" strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-full border border-dashed border-white/30 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
          <ImageIcon className="h-3 w-3" />
          Photo placeholder — {placeholderLabel}
        </div>
      </>
    )}
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, rgba(4,11,23,.86) 0%, rgba(4,11,23,.66) 46%, rgba(4,11,23,.22) 100%)',
      }}
    />
  </div>
);

const RevealHeroCopy = ({
  eyebrow,
  headlineWhite,
  headlineGold,
  subtext,
  proofPills,
  onExplore,
}: Pick<RevealHeroProps, 'eyebrow' | 'headlineWhite' | 'headlineGold' | 'subtext' | 'proofPills'> & { onExplore: () => void }) => (
  <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-8">
    <div className="max-w-3xl">
      <div className="mb-5 inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#f1df9a]">
        <span className="h-[2px] w-7 bg-[#c9a227]" />
        {eyebrow}
      </div>

      <h1
        className="text-white"
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

      <div className="mt-8">
        <button
          type="button"
          onClick={onExplore}
          className="inline-flex h-12 items-center rounded-full bg-[#c9a227] px-7 font-black text-[#101521] shadow-xl shadow-[#c9a227]/25 transition hover:bg-[#e0bd4b]"
        >
          Explore
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-black uppercase tracking-[0.06em] text-white">
        {proofPills.map((pill) => (
          <span key={pill} className="border-l-2 border-[#c9a227] pl-3">
            {pill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const RevealHero = ({
  eyebrow,
  icon,
  headlineWhite,
  headlineGold,
  subtext,
  proofPills,
  placeholderLabel,
  backgroundImageSrc,
  backgroundImageAlt,
  pinRangeVh = 35,
  children,
}: RevealHeroProps) => {
  return (
    <>
      <div className="reveal-hero-wrapper" style={{ height: `calc(100svh + ${pinRangeVh}svh)` }}>
        <div className="reveal-hero-stage">
          <div className="reveal-hero-slide">
            <RevealHeroPhoto
              icon={icon}
              placeholderLabel={placeholderLabel}
              backgroundImageSrc={backgroundImageSrc}
              backgroundImageAlt={backgroundImageAlt}
            />
            <RevealHeroCopy
              eyebrow={eyebrow}
              headlineWhite={headlineWhite}
              headlineGold={headlineGold}
              subtext={subtext}
              proofPills={proofPills}
              onExplore={() => {}}
            />
          </div>
        </div>
      </div>
      {children}
      <style>{`
        .reveal-hero-wrapper { position: relative; width: 100%; }
        .reveal-hero-stage { position: sticky; top: 0; height: 100svh; overflow: hidden; z-index: 5; background: #071629; }
        .reveal-hero-slide { position: relative; height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center; }
      `}</style>
    </>
  );
};

export default RevealHero;
