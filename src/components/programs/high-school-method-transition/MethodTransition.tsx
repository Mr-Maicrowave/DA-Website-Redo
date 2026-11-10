import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MethodTeachingDeck,
  type MethodTeachingDeckPresentation,
} from './MethodTeachingDeck';
import { reconcileSourceHandoffPose, type TransitionPose } from './methodTransitionGeometry';
import {
  METHOD_TRANSITION_TIMING,
  getViewportZoomTargets,
  zoomScaleAt,
} from './methodTransitionTiming';
import './MethodTransition.css';

gsap.registerPlugin(ScrollTrigger);

const CENTER_BLOOM = '/images/programs/high-school-method-transition/method-bloom-center-green-v1.png';
const MAGNIFIER = '/high-school-journey/finale/year-08-magnifying-glass-ai.png';
const SOURCE_HANDOFF_START = 0;
const SOURCE_HANDOFF_END = METHOD_TRANSITION_TIMING.detachEnd;

type MediaConditions = { reduce: boolean };

function decodeImage(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) return Promise.resolve();
  return image.decode().catch(() => undefined);
}

export function MethodTransition() {
  const [deckReady, setDeckReady] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centerBloomRef = useRef<HTMLImageElement>(null);
  const proxyRef = useRef<HTMLImageElement>(null);
  const presentationRef = useRef<MethodTeachingDeckPresentation | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const proxy = proxyRef.current;
    const centerBloom = centerBloomRef.current;
    const presentation = presentationRef.current;
    const source = document.querySelector<HTMLImageElement>('[data-method-transition-magnifier]');

    if (!section || !stage || !proxy || !centerBloom || !presentation) return;

    const { cards, diagnose, diagnoseMagnifier } = presentation;
    const siblings = Object.values(cards).filter((card) => card !== diagnose);
    const sourceOpacity = source?.style.opacity ?? '';
    const sourceVisibility = source?.style.visibility ?? '';
    const finale = source?.closest<HTMLElement>('.hs-finale') ?? null;
    const sourceYear = source?.closest<HTMLElement>('[data-method-transition-source="year-8"]') ?? null;
    const journeySticky = source?.closest<HTMLElement>('.hs-journey__sticky') ?? null;
    const media = gsap.matchMedia();
    let mounted = true;

    const context = gsap.context(() => {
      void Promise.all([decodeImage(proxy), decodeImage(centerBloom)]).then(() => {
        if (!mounted) return;

        context.add(() => {
          media.add(
            {
              desktop: '(min-width: 1024px)',
              tablet: '(min-width: 640px) and (max-width: 1023px)',
              mobile: '(max-width: 639px)',
              reduce: '(prefers-reduced-motion: reduce)',
            },
            (match) => {
              const conditions = match.conditions as MediaConditions;
              const resetDeckPresentation = () => {
                gsap.set([...Object.values(cards), diagnoseMagnifier], {
                  clearProps: 'transform,opacity,zIndex',
                });
                gsap.set(diagnoseMagnifier, { opacity: 0 });
              };

              gsap.set(proxy, { opacity: 0, transformOrigin: '50% 50%' });
              gsap.set(centerBloom, { opacity: 0, scale: 0.86 });

              if (conditions.reduce || !source) {
                resetDeckPresentation();
                setDeckReady(true);
                gsap.set(centerBloom, { opacity: 0 });
                if (!source) return;

                const crossfade = (showDeck: boolean) => {
                  gsap.to(proxy, { opacity: 0, duration: 0.18, overwrite: true });
                  gsap.to(source, { opacity: showDeck ? 0 : 1, duration: 0.18, overwrite: true });
                };
                const reducedTrigger = ScrollTrigger.create({
                  trigger: section,
                  start: 'top 82%',
                  end: 'top 38%',
                  onEnter: () => crossfade(true),
                  onLeaveBack: () => crossfade(false),
                });
                return () => reducedTrigger.kill();
              }

              const poses: Record<'source' | 'detach' | 'center' | 'dock', TransitionPose> = {
                source: { x: 0, y: 0, scale: 1 },
                detach: { x: 0, y: 0, scale: 1 },
                center: { x: 0, y: 0, scale: 1 },
                dock: { x: 0, y: 0, scale: 1 },
              };
              let introTransform = { x: 0, y: 0, scale: 1 };
              let normalizedSourceRect: DOMRect | null = null;

              const poseForRect = (rect: DOMRect, targetWidth = rect.width): TransitionPose => {
                const proxyWidth = proxy.offsetWidth;
                const proxyHeight = proxy.offsetHeight;
                return {
                  x: rect.left + rect.width / 2 - proxyWidth / 2,
                  y: rect.top + rect.height / 2 - proxyHeight / 2,
                  scale: targetWidth / proxyWidth,
                };
              };

              const measureUntransformedSource = () => {
                if (!source) return new DOMRect();
                const inlineTransform = finale?.style.transform ?? '';
                const inlineYearAnimation = sourceYear?.style.animation ?? '';
                const inlineYearTransform = sourceYear?.style.transform ?? '';
                try {
                  if (finale) finale.style.transform = 'none';
                  if (sourceYear) {
                    sourceYear.style.animation = 'none';
                    sourceYear.style.transform = 'none';
                  }
                  const sourceRect = source.getBoundingClientRect();
                  const stickyRect = journeySticky?.getBoundingClientRect();
                  if (!stickyRect) return sourceRect;
                  const handoffTravel = section.offsetHeight * SOURCE_HANDOFF_START;
                  return new DOMRect(
                    sourceRect.left,
                    sourceRect.top - stickyRect.top - handoffTravel,
                    sourceRect.width,
                    sourceRect.height,
                  );
                } finally {
                  if (sourceYear) {
                    sourceYear.style.animation = inlineYearAnimation;
                    sourceYear.style.transform = inlineYearTransform;
                  }
                  if (finale) finale.style.transform = inlineTransform;
                }
              };

              const measure = () => {
                resetDeckPresentation();
                const sourceRect = measureUntransformedSource();
                normalizedSourceRect = sourceRect;
                const stageRect = stage.getBoundingClientRect();
                const zoomTargets = getViewportZoomTargets(stageRect.width, stageRect.height);
                const centerRect = centerBloom.getBoundingClientRect();
                const finalRect = diagnose.getBoundingClientRect();
                const targetWidth = Math.min(stageRect.width * 0.3, stageRect.height * 0.58);
                const scale = Math.max(1, Math.min(targetWidth / finalRect.width, 1.65));
                const centerX = stageRect.left + stageRect.width / 2;
                const centerY = stageRect.top + stageRect.height * 0.53;

                introTransform = {
                  x: centerX - (finalRect.left + finalRect.width / 2),
                  y: centerY - (finalRect.top + finalRect.height / 2),
                  scale,
                };
                gsap.set(diagnose, { ...introTransform, opacity: 1, zIndex: 3 });
                const overlayRect = diagnoseMagnifier.getBoundingClientRect();
                resetDeckPresentation();

                poses.source = poseForRect(sourceRect);
                poses.center = poseForRect(
                  new DOMRect(centerRect.left, centerRect.top - stageRect.top, centerRect.width, centerRect.height),
                  zoomTargets.fast,
                );
                poses.dock = poseForRect(overlayRect);
                poses.detach = {
                  x: poses.source.x + (poses.center.x - poses.source.x) * 0.12,
                  y: poses.source.y + (poses.center.y - poses.source.y) * 0.12,
                  scale: zoomScaleAt(0.03, poses.source.scale),
                };
              };

              measure();
              let interactive = false;
              const handoffDeck = (nextInteractive: boolean) => {
                if (interactive === nextInteractive) return;
                interactive = nextInteractive;
                if (nextInteractive) resetDeckPresentation();
                setDeckReady(nextInteractive);
              };

              const master = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom bottom',
                  scrub: true,
                  invalidateOnRefresh: true,
                  onRefreshInit: measure,
                },
              });

              master
                .set(proxy, { x: () => poses.source.x, y: () => poses.source.y, scale: () => poses.source.scale, rotation: 0, opacity: 0 }, 0)
                .set(source, { opacity: 1 }, 0)
                .to(proxy, { opacity: 1, duration: 0.006 }, 0)
                .set(source, { opacity: 0 }, 0.008)
                .to(proxy, { x: () => poses.detach.x, y: () => poses.detach.y, scale: () => poses.detach.scale, rotation: 1, duration: 0.03 }, 0)
                .to(proxy, {
                  x: () => poses.source.x + (poses.center.x - poses.source.x) * 0.28,
                  y: () => poses.source.y + (poses.center.y - poses.source.y) * 0.28,
                  scale: () => zoomScaleAt(0.07, poses.source.scale), rotation: 2, duration: 0.04,
                }, 0.03)
                .to(proxy, {
                  x: () => poses.source.x + (poses.center.x - poses.source.x) * 0.52,
                  y: () => poses.source.y + (poses.center.y - poses.source.y) * 0.52,
                  scale: () => zoomScaleAt(0.12, poses.source.scale), rotation: 3.5, duration: 0.05,
                }, 0.07)
                .to(proxy, { x: () => poses.center.x, y: () => poses.center.y, scale: () => poses.center.scale, rotation: 5, duration: 0.03 }, 0.12)
                .to(finale, { scale: 0.94, y: -14, opacity: 0, transformOrigin: '50% 55%', duration: 0.28 }, 0)
                .to(centerBloom, { opacity: 0.72, scale: 1.24, duration: 0.15 }, 0.08)
                .to(proxy, {
                  x: () => poses.center.x, y: () => poses.center.y, scale: () => poses.center.scale, rotation: 5.5,
                  duration: METHOD_TRANSITION_TIMING.largestEnd - METHOD_TRANSITION_TIMING.fastZoomEnd,
                }, METHOD_TRANSITION_TIMING.fastZoomEnd)
                .set(diagnose, {
                  x: () => introTransform.x,
                  y: () => introTransform.y + 32,
                  scale: () => introTransform.scale,
                  opacity: 0,
                  zIndex: 3,
                }, METHOD_TRANSITION_TIMING.cardRiseStart)
                .set(siblings, { opacity: 0, y: 28, scale: 0.96, zIndex: 2 }, METHOD_TRANSITION_TIMING.cardRiseStart)
                .to(diagnose, {
                  y: () => introTransform.y,
                  opacity: 1,
                  duration: METHOD_TRANSITION_TIMING.insertionStart - METHOD_TRANSITION_TIMING.cardRiseStart,
                  ease: 'power2.out',
                }, METHOD_TRANSITION_TIMING.cardRiseStart)
                .to(centerBloom, { opacity: 0.28, scale: 1.42, duration: 0.42 }, 0.3)
                .to(proxy, {
                  x: () => poses.dock.x,
                  y: () => poses.dock.y,
                  scale: () => poses.dock.scale,
                  rotation: 0,
                  duration: METHOD_TRANSITION_TIMING.landEnd - METHOD_TRANSITION_TIMING.insertionStart,
                }, METHOD_TRANSITION_TIMING.insertionStart)
                .to(diagnoseMagnifier, { opacity: 1, duration: 0.02 }, METHOD_TRANSITION_TIMING.landEnd)
                .to(proxy, { opacity: 0, duration: 0.02 }, METHOD_TRANSITION_TIMING.landEnd)
                .to(diagnoseMagnifier, { opacity: 0, duration: 0.02 }, METHOD_TRANSITION_TIMING.joinStart)
                .to(diagnose, {
                  x: 0,
                  y: 0,
                  scale: 1,
                  duration: METHOD_TRANSITION_TIMING.joinEnd - METHOD_TRANSITION_TIMING.joinStart,
                  ease: 'power2.inOut',
                }, METHOD_TRANSITION_TIMING.joinStart)
                .to(siblings, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: METHOD_TRANSITION_TIMING.companionsEnd - METHOD_TRANSITION_TIMING.joinStart,
                  stagger: 0.012,
                  ease: 'power2.out',
                }, METHOD_TRANSITION_TIMING.joinStart)
                .to(centerBloom, {
                  opacity: 0.14,
                  y: 80,
                  duration: METHOD_TRANSITION_TIMING.joinEnd - METHOD_TRANSITION_TIMING.joinStart,
                }, METHOD_TRANSITION_TIMING.joinStart);

              master.eventCallback('onUpdate', () => {
                const progress = master.progress();
                handoffDeck(progress >= METHOD_TRANSITION_TIMING.companionsEnd);
                if (source && normalizedSourceRect && progress >= SOURCE_HANDOFF_START && progress <= SOURCE_HANDOFF_END) {
                  const strength = 1 - ((progress - SOURCE_HANDOFF_START) / (SOURCE_HANDOFF_END - SOURCE_HANDOFF_START));
                  const reconciledPose = reconcileSourceHandoffPose(
                    {
                      x: Number(gsap.getProperty(proxy, 'x')) || 0,
                      y: Number(gsap.getProperty(proxy, 'y')) || 0,
                      scale: Number(gsap.getProperty(proxy, 'scaleX')) || 1,
                    },
                    normalizedSourceRect,
                    source.getBoundingClientRect(),
                    strength,
                  );
                  gsap.set(proxy, reconciledPose);
                }
              });

              return () => {
                master.scrollTrigger?.kill();
                master.kill();
              };
            },
          );
          ScrollTrigger.refresh();
        });
      });
    }, section);

    return () => {
      mounted = false;
      media.revert();
      context.revert();
      if (source) {
        source.style.opacity = sourceOpacity;
        source.style.visibility = sourceVisibility;
      }
    };
  }, []);

  return (
    <section className="hsm-transition">
      <div
        className="hsm-transition__runway"
        ref={sectionRef}
        data-scroll-property="--method-transition-scroll"
      >
        <div className="hsm-transition__stage" ref={stageRef}>
          <img className="hsm-transition__center-bloom" ref={centerBloomRef} src={CENTER_BLOOM} alt="" aria-hidden="true" decoding="async" />
          <img className="hsm-transition__proxy" ref={proxyRef} src={MAGNIFIER} alt="" aria-hidden="true" decoding="async" />
        </div>
        <div className="hsm-transition__interaction">
          <MethodTeachingDeck ready={deckReady} presentationRef={presentationRef} />
        </div>
      </div>
    </section>
  );
}
