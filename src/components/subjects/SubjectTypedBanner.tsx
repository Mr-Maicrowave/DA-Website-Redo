import React, { useEffect, useRef, useState } from 'react';

interface SubjectTypedBannerProps {
  imageSrc: string;
  imageAlt: string;
  headline: string;
  emphasis: string;
  support?: string;
  variant?: 'business' | 'legal';
}

type TypedLines = {
  headline: number;
  emphasis: number;
  support: number;
};

const TYPE_DELAY_MS = 24;
const LINE_PAUSE_MS = 180;

type RevealLine = keyof TypedLines;

const revealMasks: Record<
  NonNullable<SubjectTypedBannerProps['variant']>,
  Array<{ key: RevealLine; text: string; top: number; left: number; width: number; height: number }>
> = {
  business: [
    { key: 'headline', text: 'Master Business Studies.', top: 29, left: 30, width: 66, height: 20 },
    { key: 'emphasis', text: 'Think strategically. Lead with insight.', top: 43, left: 35, width: 61, height: 11 },
  ],
  legal: [
    { key: 'headline', text: 'Master Legal Studies.', top: 31, left: 34, width: 62, height: 16 },
    { key: 'emphasis', text: 'Understand the law. Think critically.', top: 44, left: 36, width: 60, height: 11 },
  ],
};

const permanentMasks: Record<
  NonNullable<SubjectTypedBannerProps['variant']>,
  Array<{ top: number; left: number; width: number; height: number }>
> = {
  business: [],
  legal: [],
};

const SubjectTypedBanner = ({
  imageSrc,
  imageAlt,
  headline,
  emphasis,
  support = '',
  variant = 'business',
}: SubjectTypedBannerProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [revealProgress, setRevealProgress] = useState<TypedLines>({
    headline: 0,
    emphasis: 0,
    support: 0,
  });

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      setRevealProgress({ headline: 1, emphasis: 1, support: 1 });
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [emphasis, headline, support]);

  useEffect(() => {
    if (!hasStarted) return;

    let cancelled = false;
    const sleep = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));
    const activeMasks = revealMasks[variant];

    const revealLine = async (key: RevealLine, text: string) => {
      for (let index = 1; index <= text.length; index += 1) {
        if (cancelled) return;
        setRevealProgress((current) => ({
          ...current,
          [key]: index / text.length,
        }));
        await sleep(TYPE_DELAY_MS);
      }
    };

    const runTyping = async () => {
      setRevealProgress({ headline: 0, emphasis: 0, support: 0 });
      for (const mask of activeMasks) {
        await revealLine(mask.key, mask.text);
        await sleep(LINE_PAUSE_MS);
      }
    };

    runTyping();

    return () => {
      cancelled = true;
    };
  }, [hasStarted, variant]);

  const isLegal = variant === 'legal';
  const activeMasks = isLegal ? [] : revealMasks[variant];
  const activeMask = activeMasks.find((mask) => revealProgress[mask.key] > 0 && revealProgress[mask.key] < 1);
  const imagePosition = isLegal ? 'center bottom' : 'center 72%';

  return (
    <section
      ref={rootRef}
      className={`subject-typed-banner subject-typed-banner--${variant} relative isolate overflow-hidden bg-[#fbf3e7]`}
      aria-label={`${headline} ${emphasis} ${support}`.trim()}
    >
      <div className={isLegal ? "subject-typed-banner__stage relative grid h-[calc(100vh-8.5rem)] min-h-[320px] max-h-[620px] place-items-center bg-[#fff7ed]" : "subject-typed-banner__stage relative h-[calc(100vh-8.5rem)] min-h-[430px] max-h-[760px]"}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={isLegal ? "h-full w-full object-contain" : "h-full w-full object-cover"}
          style={{ objectPosition: imagePosition }}
        />
        {permanentMasks[variant].map((mask) => (
          <div
            key={`${mask.top}-${mask.left}`}
            className="absolute bg-[#fff8ec]"
            style={{
              top: `${mask.top}%`,
              left: `${mask.left}%`,
              width: `${mask.width}%`,
              height: `${mask.height}%`,
            }}
            aria-hidden="true"
          />
        ))}
        {activeMasks.map((mask) => {
          const progress = revealProgress[mask.key];
          const coverLeft = mask.left + mask.width * progress;
          const coverWidth = mask.width * (1 - progress);

          if (coverWidth <= 0) return null;

          return (
            <div
              key={mask.key}
              className="absolute bg-[#fff8ec]"
              style={{
                top: `${mask.top}%`,
                left: `${coverLeft}%`,
                width: `${coverWidth}%`,
                height: `${mask.height}%`,
              }}
              aria-hidden="true"
            />
          );
        })}
        {activeMask && (
          <div
            className="absolute w-[2px] animate-pulse bg-[#c99a2e]"
            style={{
              top: `${activeMask.top + 1}%`,
              left: `${activeMask.left + activeMask.width * revealProgress[activeMask.key]}%`,
              height: `${activeMask.height - 2}%`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </section>
  );
};

export default SubjectTypedBanner;
