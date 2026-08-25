import {
  type CSSProperties,
  type KeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  reconcileSourceHandoffPose,
  type TransitionPose,
} from './methodTransitionGeometry';
import { methodItems } from './methodTransitionData';
import { getNextMethodIndex } from './methodTransitionKeyboard';
import './MethodTransition.css';

gsap.registerPlugin(ScrollTrigger);

const CENTER_BLOOM = '/images/programs/high-school-method-transition/method-bloom-center-green-v1.png';
const MAGNIFIER = '/high-school-journey/finale/year-08-magnifying-glass-ai.png';
const SOURCE_HANDOFF_START = 0.15;
const SOURCE_HANDOFF_END = 0.32;

type MediaConditions = {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
  reduce: boolean;
};

function decodeImage(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) return Promise.resolve();
  return image.decode().catch(() => undefined);
}

export function MethodTransition() {
  const [active, setActive] = useState(0);
  const [methodsAvailable, setMethodsAvailable] = useState(false);
  const methodsAvailableRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centerBloomRef = useRef<HTMLImageElement>(null);
  const proxyRef = useRef<HTMLImageElement>(null);
  const methodsRef = useRef<HTMLDivElement>(null);
  const diagnoseRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useLayoutEffect(() => {
    methodsRef.current?.toggleAttribute('inert', !methodsAvailable);
  }, [methodsAvailable]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const proxy = proxyRef.current;
    const centerBloom = centerBloomRef.current;
    const methods = methodsRef.current;
    const diagnose = diagnoseRef.current;
    const source = document.querySelector<HTMLImageElement>(
      '[data-method-transition-magnifier]',
    );

    if (!section || !stage || !proxy || !centerBloom || !methods || !diagnose) return;

    const buttons = buttonRefs.current.filter(
      (button): button is HTMLButtonElement => button !== null,
    );
    const sourceOpacity = source?.style.opacity ?? '';
    const sourceVisibility = source?.style.visibility ?? '';
    const finale = source?.closest<HTMLElement>('.hs-finale') ?? null;
    const sourceYear = source?.closest<HTMLElement>(
      '[data-method-transition-source="year-8"]',
    ) ?? null;
    const journeySticky = source?.closest<HTMLElement>('.hs-journey__sticky') ?? null;
    const media = gsap.matchMedia();
    let mounted = true;
    const updateMethodsAvailability = (available: boolean) => {
      if (methodsAvailableRef.current === available) return;
      methodsAvailableRef.current = available;
      setMethodsAvailable(available);
    };
    const context = gsap.context(() => {
      const artwork = Array.from(
        section.querySelectorAll<HTMLImageElement>('img'),
      );

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
              gsap.set(methods, { opacity: conditions.reduce ? 0 : 1 });

              if (conditions.reduce || !source) {
                updateMethodsAvailability(true);
                gsap.set(buttons, { opacity: 1, scale: 1, y: 0 });
                gsap.set(diagnose, { opacity: 1 });
                gsap.set(proxy, { opacity: 0 });

                if (!source) {
                  gsap.set(methods, { opacity: 1 });
                  return;
                }

                let reducedTweens: gsap.core.Tween[] = [];
                const crossfade = (showMethods: boolean) => {
                  reducedTweens.forEach((tween) => tween.kill());
                  reducedTweens = [
                    gsap.to(methods, {
                      opacity: showMethods ? 1 : 0,
                      duration: 0.18,
                      overwrite: true,
                    }),
                    gsap.to(source, {
                      opacity: showMethods ? 0 : 1,
                      duration: 0.18,
                      overwrite: true,
                    }),
                  ];
                };
                const reducedTrigger = ScrollTrigger.create({
                  trigger: section,
                  start: 'top 82%',
                  end: 'top 38%',
                  onEnter: () => crossfade(true),
                  onLeaveBack: () => crossfade(false),
                });

                return () => {
                  reducedTweens.forEach((tween) => tween.kill());
                  reducedTrigger.kill();
                };
              }

              updateMethodsAvailability(false);

              const peakSize = conditions.desktop ? 216 : conditions.tablet ? 180 : 136;
              const poses: Record<'source' | 'detach' | 'center' | 'diagnose', TransitionPose> = {
                source: { x: 0, y: 0, scale: 1 },
                detach: { x: 0, y: 0, scale: 1 },
                center: { x: 0, y: 0, scale: 1 },
                diagnose: { x: 0, y: 0, scale: 1 },
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
                  // Normalize both GSAP layers before the synchronous read. The
                  // sticky offset projects the final cinematic pose into the
                  // viewport even when setup runs before the journey arrives.
                  if (finale) finale.style.transform = 'none';
                  if (sourceYear) {
                    sourceYear.style.animation = 'none';
                    sourceYear.style.transform = 'none';
                  }
                  const sourceRect = source.getBoundingClientRect();
                  const stickyRect = journeySticky?.getBoundingClientRect();
                  if (!stickyRect) return sourceRect;
                  const handoffTravel = section.offsetHeight * 0.15;
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
                const sourceRect = measureUntransformedSource();
                normalizedSourceRect = sourceRect;
                const stageRect = stage.getBoundingClientRect();
                const centerRect = centerBloom.getBoundingClientRect();
                const diagnoseRect = diagnose.getBoundingClientRect();
                const diagnoseButton = buttons[0];
                const buttonX = Number(gsap.getProperty(diagnoseButton, 'x')) || 0;
                const buttonY = Number(gsap.getProperty(diagnoseButton, 'y')) || 0;
                const buttonScale = Number(gsap.getProperty(diagnoseButton, 'scaleX')) || 1;
                const diagnoseWidth = diagnoseRect.width / buttonScale;
                const diagnoseHeight = diagnoseRect.height / buttonScale;
                const finalDiagnoseRect = new DOMRect(
                  diagnoseRect.left + diagnoseRect.width / 2 - buttonX - diagnoseWidth / 2,
                  diagnoseRect.top + diagnoseRect.height / 2 - buttonY - diagnoseHeight / 2,
                  diagnoseWidth,
                  diagnoseHeight,
                );

                poses.source = poseForRect(sourceRect);
                poses.center = poseForRect(
                  new DOMRect(
                    centerRect.left,
                    centerRect.top - stageRect.top,
                    centerRect.width,
                    centerRect.height,
                  ),
                  peakSize,
                );
                poses.diagnose = poseForRect(new DOMRect(
                  finalDiagnoseRect.left,
                  finalDiagnoseRect.top - stageRect.top,
                  finalDiagnoseRect.width,
                  finalDiagnoseRect.height,
                ));
                poses.detach = {
                  x: poses.source.x + (poses.center.x - poses.source.x) * 0.18,
                  y: poses.source.y + (poses.center.y - poses.source.y) * 0.18,
                  scale: poses.source.scale + (poses.center.scale - poses.source.scale) * 0.14,
                };
              };

              measure();
              gsap.set(buttons, { opacity: 0, scale: 0.8, y: 15 });
              gsap.set(diagnose, { opacity: 0 });

              const master = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom bottom',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                  onRefreshInit: measure,
                },
              });

              master
                .set(proxy, {
                  x: () => poses.source.x,
                  y: () => poses.source.y,
                  scale: () => poses.source.scale,
                  rotation: 0,
                  opacity: 0,
                }, 0)
                .set(source, { opacity: 1 }, 0)
                .set(proxy, { opacity: 1 }, 0.15)
                .set(source, { opacity: 0 }, 0.15)
                .to(proxy, {
                  x: () => poses.detach.x,
                  y: () => poses.detach.y,
                  scale: () => poses.detach.scale,
                  rotation: 2,
                  duration: 0.17,
                }, 0.15)
                .to(finale, {
                  scale: 0.96,
                  y: -12,
                  opacity: 0.72,
                  transformOrigin: '50% 55%',
                  duration: 0.33,
                }, 0.15)
                .to(proxy, {
                  x: () => poses.center.x,
                  y: () => poses.center.y,
                  scale: () => poses.center.scale,
                  rotation: 6,
                  duration: 0.16,
                }, 0.32)
                .to(centerBloom, {
                  opacity: 0.78,
                  scale: 1,
                  duration: 0.1,
                }, 0.48)
                .to(proxy, { scale: () => poses.center.scale * 1.025, duration: 0.05 }, 0.48)
                .to(proxy, { scale: () => poses.center.scale, duration: 0.05 }, 0.53)
                .to(proxy, {
                  x: () => poses.diagnose.x,
                  y: () => poses.diagnose.y,
                  scale: () => poses.diagnose.scale,
                  rotation: 0,
                  duration: 0.18,
                }, 0.58)
                .to(centerBloom, { opacity: 0, scale: 1.06, duration: 0.22 }, 0.58)
                .to(buttons[0], { opacity: 1, scale: 0.98, y: 0, duration: 0.1 }, 0.76)
                .set(diagnose, { opacity: 1 }, 0.86)
                .set(proxy, { opacity: 0 }, 0.86)
                .to(buttons.slice(1), {
                  opacity: 1,
                  scale: 0.98,
                  y: 0,
                  duration: 0.06,
                  stagger: 0.013,
                  ease: 'power2.out',
                }, 0.84)
                .to(buttons, { scale: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.94);

              master.eventCallback('onUpdate', () => {
                const progress = master.progress();
                if (
                  normalizedSourceRect
                  && progress >= SOURCE_HANDOFF_START
                  && progress <= SOURCE_HANDOFF_END
                ) {
                  const strength = 1 - (
                    (progress - SOURCE_HANDOFF_START)
                    / (SOURCE_HANDOFF_END - SOURCE_HANDOFF_START)
                  );
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
                updateMethodsAvailability(progress >= 0.94);
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

  const selectFromKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const next = getNextMethodIndex(event.key, index, methodItems.length);
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    buttonRefs.current[next]?.focus();
  };

  return (
    <section
      className="hsm-transition"
      ref={sectionRef}
      data-scroll-property="--method-transition-scroll"
    >
      <div className="hsm-transition__stage" ref={stageRef}>
        <img
          className="hsm-transition__center-bloom"
          ref={centerBloomRef}
          src={CENTER_BLOOM}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        <img
          className="hsm-transition__proxy"
          ref={proxyRef}
          src={MAGNIFIER}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        <div
          className="hsm-transition__methods"
          ref={methodsRef}
          role="toolbar"
          aria-label="DA Tuition teaching methods"
          aria-hidden={!methodsAvailable}
          data-available={methodsAvailable}
        >
          {methodItems.map((method, index) => (
            <button
              key={method.id}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              className="hsm-transition__method"
              type="button"
              aria-label={method.label}
              aria-pressed={active === index}
              disabled={!methodsAvailable}
              tabIndex={methodsAvailable && active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => selectFromKeyboard(event, index)}
              style={{ '--method-accent': method.accent } as CSSProperties}
            >
              <img
                className="hsm-transition__method-bloom"
                src={method.bloom}
                alt=""
                aria-hidden="true"
                decoding="async"
              />
              <span
                className="hsm-transition__method-symbol"
                ref={index === 0 ? diagnoseRef : undefined}
                aria-hidden="true"
              >
                <method.Icon strokeWidth={1.7} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
