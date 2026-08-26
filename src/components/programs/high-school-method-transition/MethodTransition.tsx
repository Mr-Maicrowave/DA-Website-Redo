import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MethodTeachingDeck } from './MethodTeachingDeck';
import { reconcileSourceHandoffPose, type TransitionPose } from './methodTransitionGeometry';
import { methodItems } from './methodTransitionData';
import {
  METHOD_TRANSITION_SCROLL_VH,
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
  const cardRef = useRef<HTMLDivElement>(null);
  const staticGlassRef = useRef<HTMLImageElement>(null);
  const cardSlotRef = useRef<HTMLDivElement>(null);
  const companionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const proxyRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const proxy = proxyRef.current;
    const centerBloom = centerBloomRef.current;
    const card = cardRef.current;
    const staticGlass = staticGlassRef.current;
    const cardSlot = cardSlotRef.current;
    const source = document.querySelector<HTMLImageElement>('[data-method-transition-magnifier]');

    if (!section || !stage || !proxy || !centerBloom || !card || !staticGlass || !cardSlot) return;

    const companions = companionRefs.current.filter(
      (companion): companion is HTMLDivElement => companion !== null,
    );

    const sourceOpacity = source?.style.opacity ?? '';
    const sourceVisibility = source?.style.visibility ?? '';
    const finale = source?.closest<HTMLElement>('.hs-finale') ?? null;
    const sourceYear = source?.closest<HTMLElement>('[data-method-transition-source="year-8"]') ?? null;
    const journeySticky = source?.closest<HTMLElement>('.hs-journey__sticky') ?? null;
    const media = gsap.matchMedia();
    let mounted = true;

    const context = gsap.context(() => {
      const artwork = Array.from(section.querySelectorAll<HTMLImageElement>('img'));
      void Promise.all(artwork.map(decodeImage)).then(() => {
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

              gsap.set(proxy, { opacity: 0, transformOrigin: '50% 50%' });
              gsap.set(centerBloom, { opacity: 0, scale: 0.86 });
              gsap.set(card, { xPercent: -50, yPercent: 115, scale: 0.985 });
              gsap.set(staticGlass, { opacity: 0 });
              gsap.set(companions, { opacity: 0, y: 34, scale: 0.92 });

              if (conditions.reduce || !source) {
                setDeckReady(true);
                gsap.set(card, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
                gsap.set(staticGlass, { opacity: 1 });
                gsap.set(proxy, { opacity: 0 });
                gsap.set(companions, { opacity: 1, y: 0, scale: 1 });
                gsap.set(centerBloom, { opacity: 0 });
                if (!source) return;

                const placeReducedMagnifier = () => {
                  const stageRect = stage.getBoundingClientRect();
                  const cardRect = card.getBoundingClientRect();
                  const targetWidth = cardRect.width * 0.58;
                  const targetRect = new DOMRect(
                    cardRect.left + (cardRect.width - targetWidth) / 2,
                    cardRect.top - stageRect.top + cardRect.height * 0.43 - targetWidth / 2,
                    targetWidth,
                    targetWidth,
                  );
                  gsap.set(proxy, {
                    x: targetRect.left,
                    y: targetRect.top,
                    scale: targetWidth / proxy.offsetWidth,
                    rotation: 0,
                    opacity: 1,
                  });
                };

                const crossfade = (showCard: boolean) => {
                  placeReducedMagnifier();
                  gsap.to(card, { opacity: showCard ? 1 : 0, y: showCard ? 0 : 24, duration: 0.18, overwrite: true });
                  gsap.to(proxy, { opacity: showCard ? 1 : 0, duration: 0.18, overwrite: true });
                  gsap.to(source, { opacity: showCard ? 0 : 1, duration: 0.18, overwrite: true });
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

              const poses: Record<'source' | 'detach' | 'center' | 'lower' | 'card' | 'joinedCard' | 'joinedGlass', TransitionPose> = {
                source: { x: 0, y: 0, scale: 1 },
                detach: { x: 0, y: 0, scale: 1 },
                center: { x: 0, y: 0, scale: 1 },
                lower: { x: 0, y: 0, scale: 1 },
                card: { x: 0, y: 0, scale: 1 },
                joinedCard: { x: 0, y: 0, scale: 1 },
                joinedGlass: { x: 0, y: 0, scale: 1 },
              };
              let normalizedSourceRect: DOMRect | null = null;

              const poseForRect = (rect: DOMRect, targetWidth = rect.width): TransitionPose => {
                const proxyWidth = proxy.offsetWidth;
                const proxyHeight = proxy.offsetHeight;
                const scale = targetWidth / proxyWidth;
                return {
                  x: rect.left + rect.width / 2 - proxyWidth / 2,
                  y: rect.top + rect.height / 2 - proxyHeight / 2,
                  scale,
                };
              };

              const measureUntransformedSource = () => {
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
                  return new DOMRect(sourceRect.left, sourceRect.top - stickyRect.top - handoffTravel, sourceRect.width, sourceRect.height);
                } finally {
                  if (sourceYear) {
                    sourceYear.style.animation = inlineYearAnimation;
                    sourceYear.style.transform = inlineYearTransform;
                  }
                  if (finale) finale.style.transform = inlineTransform;
                }
              };

              const measure = () => {
                const sourceRect = measureUntransformedSource();
                normalizedSourceRect = sourceRect;
                const stageRect = stage.getBoundingClientRect();
                const zoomTargets = getViewportZoomTargets(stageRect.width, stageRect.height);
                const centerRect = centerBloom.getBoundingClientRect();
                const savedCardTransform = card.style.transform;
                gsap.set(card, { xPercent: -50, yPercent: -50, y: 0, scale: 1 });
                const cardRect = card.getBoundingClientRect();
                card.style.transform = savedCardTransform;
                const slotRect = cardSlot.getBoundingClientRect();
                const finalWidth = cardRect.width * 0.58;
                const cardTargetRect = new DOMRect(
                  cardRect.left + (cardRect.width - finalWidth) / 2,
                  cardRect.top - stageRect.top + cardRect.height * 0.43 - finalWidth / 2,
                  finalWidth,
                  finalWidth,
                );

                poses.source = poseForRect(sourceRect);
                poses.center = poseForRect(
                  new DOMRect(centerRect.left, centerRect.top - stageRect.top, centerRect.width, centerRect.height),
                  zoomTargets.fast,
                );
                poses.card = poseForRect(cardTargetRect);
                const joinedScale = slotRect.width / cardRect.width;
                poses.joinedCard = {
                  x: slotRect.left + slotRect.width / 2 - (cardRect.left + cardRect.width / 2),
                  y: slotRect.top + slotRect.height / 2 - (cardRect.top + cardRect.height / 2),
                  scale: joinedScale,
                };
                const joinedGlassWidth = slotRect.width * 0.72;
                poses.joinedGlass = poseForRect(new DOMRect(
                  slotRect.left + (slotRect.width - joinedGlassWidth) / 2,
                  slotRect.top - stageRect.top + slotRect.height * 0.43 - joinedGlassWidth / 2,
                  joinedGlassWidth,
                  joinedGlassWidth,
                ));
                poses.lower = {
                  x: poses.center.x + (poses.card.x - poses.center.x) * 0.72,
                  y: poses.center.y + (poses.card.y - poses.center.y) * 0.72,
                  scale: Math.max(poses.card.scale * 1.28, poses.center.scale * 0.42),
                };
                poses.detach = {
                  x: poses.source.x + (poses.center.x - poses.source.x) * 0.12,
                  y: poses.source.y + (poses.center.y - poses.source.y) * 0.12,
                  scale: zoomScaleAt(0.03, poses.source.scale),
                };
              };

              measure();

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
                .to(proxy, {
                  x: () => poses.lower.x, y: () => poses.lower.y, scale: () => poses.lower.scale, rotation: 2,
                  duration: METHOD_TRANSITION_TIMING.insertionStart - METHOD_TRANSITION_TIMING.descendStart,
                }, METHOD_TRANSITION_TIMING.descendStart)
                .to(card, {
                  yPercent: 16, scale: 0.992,
                  duration: METHOD_TRANSITION_TIMING.insertionStart - METHOD_TRANSITION_TIMING.cardRiseStart,
                }, METHOD_TRANSITION_TIMING.cardRiseStart)
                .to(card, {
                  yPercent: -50, scale: 1,
                  duration: METHOD_TRANSITION_TIMING.landEnd - METHOD_TRANSITION_TIMING.insertionStart,
                }, METHOD_TRANSITION_TIMING.insertionStart)
                .to(proxy, {
                  x: () => poses.card.x, y: () => poses.card.y + 6, scale: () => poses.card.scale * 0.96, rotation: 0,
                  duration: METHOD_TRANSITION_TIMING.landEnd - METHOD_TRANSITION_TIMING.insertionStart,
                }, METHOD_TRANSITION_TIMING.insertionStart)
                .to(proxy, {
                  y: () => poses.card.y, scale: () => poses.card.scale,
                  duration: METHOD_TRANSITION_TIMING.reactionEnd - METHOD_TRANSITION_TIMING.landEnd, ease: 'power2.out',
                }, METHOD_TRANSITION_TIMING.landEnd)
                .to(card, {
                  scale: 0.985,
                  duration: (METHOD_TRANSITION_TIMING.reactionEnd - METHOD_TRANSITION_TIMING.landEnd) / 2,
                }, METHOD_TRANSITION_TIMING.landEnd)
                .to(card, {
                  scale: 1,
                  duration: (METHOD_TRANSITION_TIMING.reactionEnd - METHOD_TRANSITION_TIMING.landEnd) / 2,
                  ease: 'power2.out',
                }, (METHOD_TRANSITION_TIMING.landEnd + METHOD_TRANSITION_TIMING.reactionEnd) / 2)
                .to(centerBloom, { opacity: 0.28, scale: 1.42, duration: 0.42 }, 0.3)
                .to(card, {
                  x: () => poses.joinedCard.x,
                  y: () => poses.joinedCard.y,
                  scale: () => poses.joinedCard.scale,
                  duration: METHOD_TRANSITION_TIMING.joinEnd - METHOD_TRANSITION_TIMING.joinStart,
                  ease: 'power2.inOut',
                }, METHOD_TRANSITION_TIMING.joinStart)
                .to(proxy, {
                  x: () => poses.joinedGlass.x,
                  y: () => poses.joinedGlass.y,
                  scale: () => poses.joinedGlass.scale,
                  duration: METHOD_TRANSITION_TIMING.joinEnd - METHOD_TRANSITION_TIMING.joinStart,
                  ease: 'power2.inOut',
                }, METHOD_TRANSITION_TIMING.joinStart)
                .to(centerBloom, {
                  opacity: 0.14,
                  y: 80,
                  duration: METHOD_TRANSITION_TIMING.joinEnd - METHOD_TRANSITION_TIMING.joinStart,
                }, METHOD_TRANSITION_TIMING.joinStart)
                .to(companions, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: METHOD_TRANSITION_TIMING.companionsEnd - 0.88,
                  stagger: 0.012,
                  ease: 'power2.out',
                }, 0.88)
                .set(proxy, { opacity: 0 }, METHOD_TRANSITION_TIMING.joinEnd)
                .set(staticGlass, { opacity: 1 }, METHOD_TRANSITION_TIMING.joinEnd);

              master.eventCallback('onUpdate', () => {
                const progress = master.progress();
                setDeckReady(progress >= METHOD_TRANSITION_TIMING.companionsEnd);
                if (normalizedSourceRect && progress >= SOURCE_HANDOFF_START && progress <= SOURCE_HANDOFF_END) {
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
    <section
      className="hsm-transition"
      style={{ '--method-transition-scroll': `${METHOD_TRANSITION_SCROLL_VH}vh` } as CSSProperties}
    >
      <div
        className="hsm-transition__runway"
        ref={sectionRef}
        data-scroll-property="--method-transition-scroll"
      >
        <div className="hsm-transition__stage" ref={stageRef}>
          <img className="hsm-transition__center-bloom" ref={centerBloomRef} src={CENTER_BLOOM} alt="" aria-hidden="true" decoding="async" />
          <div className="hsm-transition__card" ref={cardRef} aria-hidden="true">
            <img
              className="hsm-transition__static-glass"
              ref={staticGlassRef}
              src={MAGNIFIER}
              alt=""
              decoding="async"
            />
          </div>
          <img className="hsm-transition__proxy" ref={proxyRef} src={MAGNIFIER} alt="" aria-hidden="true" decoding="async" />
          <div className="hsm-transition__card-row" aria-hidden="true">
            <div className="hsm-transition__card-slot" ref={cardSlotRef} />
            {methodItems.slice(1).map((method, index) => (
              <div
                className="hsm-transition__companion-card"
                key={method.id}
                ref={(node) => {
                  companionRefs.current[index] = node;
                }}
              >
                <img src={method.card} alt="" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hsm-transition__interaction"><MethodTeachingDeck ready={deckReady} /></div>
    </section>
  );
}
