import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type MotionConditions = {
  desktop: boolean;
  motion: boolean;
  reduceMotion: boolean;
};

const usePrimaryReferenceMotion = (rootRef: RefObject<HTMLElement>): void => {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: '(min-width: 761px)',
          motion: '(prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (matchContext) => {
          const { desktop, motion, reduceMotion } = matchContext.conditions as MotionConditions;
          const scrapbookPhotos = gsap.utils.toArray<HTMLElement>(
            [
              '.primary-reference-foundation__photo',
              '.primary-reference-growth__photo',
              '.primary-reference-mastery__photo',
            ].join(','),
            root,
          );
          const teachingMoments = gsap.utils.toArray<HTMLElement>(
            '.primary-reference-teaching li',
            root,
          );
          const teachingPath = root.querySelector<HTMLElement>('.primary-reference-teaching__path');
          const programObjects = gsap.utils.toArray<HTMLElement>('.primary-program-bag__control', root);
          const pathway = root.querySelector<HTMLElement>('#pathway');
          const programs = root.querySelector<HTMLElement>('#programs');
          const outro = root.querySelector<HTMLElement>('#primary-journey-outro');
          const outroLandscape = root.querySelector<HTMLElement>('.primary-journey-outro__landscape');
          const outroContent = root.querySelector<HTMLElement>('.primary-journey-outro__content');
          const motionTargets = [
            ...scrapbookPhotos,
            ...teachingMoments,
            ...programObjects,
            ...(teachingPath ? [teachingPath] : []),
            ...(outroLandscape ? [outroLandscape] : []),
            ...(outroContent ? [outroContent] : []),
          ];

          if (reduceMotion) {
            gsap.set(motionTargets, {
              clearProps: 'transform,opacity,visibility,clipPath',
            });
            return;
          }

          if (!motion) return;

          scrapbookPhotos.forEach((photo) => {
            gsap.from(photo, {
              y: desktop ? 28 : 16,
              scale: desktop ? .985 : .995,
              duration: .8,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: photo,
                start: 'top 82%',
                once: true,
              },
            });
          });

          if (teachingMoments.length && pathway) {
            const teachingTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: pathway,
                start: 'top 72%',
                once: true,
              },
            });

            teachingTimeline.from(teachingMoments, {
              y: desktop ? 24 : 14,
              scale: .99,
              duration: .72,
              ease: 'power4.out',
              stagger: .12,
            });

            if (teachingPath) {
              teachingTimeline.fromTo(
                teachingPath,
                { clipPath: 'inset(0 100% 0 0)' },
                { clipPath: 'inset(0 0% 0 0)', duration: 1.15, ease: 'power2.inOut' },
                .16,
              );
            }
          }

          if (programObjects.length && programs) {
            gsap.from(programObjects, {
              y: desktop ? 30 : 18,
              scale: .97,
              duration: .76,
              ease: 'power4.out',
              stagger: .11,
              scrollTrigger: {
                trigger: programs,
                start: 'top 68%',
                once: true,
              },
            });
          }

          if (outro && outroLandscape && outroContent) {
            const outroTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: outro,
                start: 'top 78%',
                once: true,
              },
            });
            outroTimeline
              .from(outroLandscape, { scale: 1.035, duration: 1.2, ease: 'power3.out' })
              .from(outroContent, { y: 18, duration: .7, ease: 'power4.out' }, .18);
          }
        },
      );
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, [rootRef]);
};

export default usePrimaryReferenceMotion;
