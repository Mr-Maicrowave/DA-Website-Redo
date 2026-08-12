import React, { useEffect, useRef, useState } from 'react';

interface SubjectTypedBannerProps {
  imageSrc: string;
  imageAlt: string;
  headline: string;
  emphasis: string;
  support?: string;
}

type TypedLines = {
  headline: string;
  emphasis: string;
  support: string;
};

const TYPE_DELAY_MS = 24;
const LINE_PAUSE_MS = 180;

const SubjectTypedBanner = ({
  imageSrc,
  imageAlt,
  headline,
  emphasis,
  support = '',
}: SubjectTypedBannerProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [typedLines, setTypedLines] = useState<TypedLines>({
    headline: '',
    emphasis: '',
    support: '',
  });

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      setTypedLines({ headline, emphasis, support });
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

    const typeLine = async (key: keyof TypedLines, text: string) => {
      for (let index = 1; index <= text.length; index += 1) {
        if (cancelled) return;
        setTypedLines((current) => ({
          ...current,
          [key]: text.slice(0, index),
        }));
        await sleep(TYPE_DELAY_MS);
      }
    };

    const runTyping = async () => {
      setTypedLines({ headline: '', emphasis: '', support: '' });
      await typeLine('headline', headline);
      await sleep(LINE_PAUSE_MS);
      await typeLine('emphasis', emphasis);
      if (support) {
        await sleep(LINE_PAUSE_MS);
        await typeLine('support', support);
      }
    };

    runTyping();

    return () => {
      cancelled = true;
    };
  }, [emphasis, hasStarted, headline, support]);

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden bg-[#fbf3e7]"
      aria-label={`${headline} ${emphasis} ${support}`.trim()}
    >
      <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[520px]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-y-[6%] left-[24%] right-[0%] rounded-[999px] bg-[#fff8ec]/100 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-[14%] left-[30%] right-[3%] rounded-[999px] bg-[#fff8ec]/100 blur-xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[340px] items-center px-5 py-12 sm:min-h-[420px] sm:px-8 lg:min-h-[520px]">
          <div className="ml-auto w-full max-w-[58rem] text-center">
            <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2.15rem,5.8vw,5.25rem)] font-semibold leading-[0.98] text-[#071b35]">
              {typedLines.headline}
              {hasStarted && !typedLines.emphasis && (
                <span className="ml-1 inline-block h-[0.82em] w-[2px] translate-y-[0.08em] animate-pulse bg-[#c99a2e]" />
              )}
            </h2>
            <p className="mt-4 font-['Playfair_Display',Georgia,serif] text-[clamp(1.45rem,3.3vw,3.15rem)] italic leading-tight text-[#9f7218]">
              {typedLines.emphasis}
              {typedLines.emphasis && typedLines.emphasis !== emphasis && (
                <span className="ml-1 inline-block h-[0.82em] w-[2px] translate-y-[0.08em] animate-pulse bg-[#c99a2e]" />
              )}
            </p>
            {support && (
              <p className="mx-auto mt-8 max-w-[48rem] text-[clamp(1rem,1.6vw,1.35rem)] font-semibold leading-relaxed text-[#0b2444]">
                {typedLines.support}
                {typedLines.emphasis === emphasis && typedLines.support !== support && (
                  <span className="ml-1 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] animate-pulse bg-[#c99a2e]" />
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectTypedBanner;
