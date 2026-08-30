import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { MethodDetail } from './MethodDetail';
import {
  methodItems,
  type MethodId,
} from './methodTransitionData';
import {
  getAdjacentMethodId,
  getInactiveMethods,
} from './methodTeachingDeckState';
import './MethodTeachingDeck.css';

gsap.registerPlugin(Flip);

const BOTANICAL_ATMOSPHERE =
  '/images/programs/high-school-method-transition/how-we-teach-watercolor-botanical-v1.png';
const BOTANICAL_ATMOSPHERE_AVIF_SMALL =
  '/images/programs/high-school-method-transition/how-we-teach-watercolor-botanical-v1-768w.avif';
const BOTANICAL_ATMOSPHERE_AVIF_LARGE =
  '/images/programs/high-school-method-transition/how-we-teach-watercolor-botanical-v1-1536w.avif';
const BOTANICAL_ATMOSPHERE_WEBP_SMALL =
  '/images/programs/high-school-method-transition/how-we-teach-watercolor-botanical-v1-768w.webp';
const BOTANICAL_ATMOSPHERE_WEBP_LARGE =
  '/images/programs/high-school-method-transition/how-we-teach-watercolor-botanical-v1-1536w.webp';

type DeckProperties = CSSProperties & {
  '--hsm-active-accent': string;
  '--hsm-active-text-accent': string;
  '--hsm-active-wash': string;
};

function killOwnedAnimation<T extends gsap.core.Animation>(animationRef: {
  current: T | null;
}) {
  const animation = animationRef.current;
  if (!animation) return;

  animation.revert();
  animation.kill();
  animationRef.current = null;
}

function setDetailFinal(detail: HTMLElement) {
  gsap.set(detail, { autoAlpha: 1, x: 0, y: 0 });
  gsap.set(detail.querySelectorAll<HTMLElement>(
    '[data-method-copy], [data-method-action], [data-method-annotation]',
  ), { autoAlpha: 1, x: 0, y: 0 });
}

async function decodeCardArtwork(cardElements: readonly HTMLButtonElement[]) {
  const images = cardElements.flatMap((card) => {
    const image = card.querySelector<HTMLImageElement>('img');
    return image ? [image] : [];
  });
  if (images.length !== cardElements.length) return false;

  const decoded = await Promise.all(images.map(async (image) => {
    if (typeof image.decode !== 'function') {
      return image.complete && image.naturalWidth > 0;
    }

    try {
      await image.decode();
      return image.complete && image.naturalWidth > 0;
    } catch {
      return false;
    }
  }));

  return decoded.every(Boolean);
}

// eslint-disable-next-line react-refresh/only-export-components -- Testable coordinator must stay in this two-file feature scope.
export function createMethodSelectionCoordinator(
  initialActiveId: MethodId,
  callbacks: {
    onCommit: (methodId: MethodId) => void;
    onInvalidate: () => void;
  },
) {
  let generation = 0;
  let activeId = initialActiveId;
  let pendingId: MethodId | null = null;

  const invalidate = () => {
    generation += 1;
    pendingId = null;
    callbacks.onInvalidate();
  };

  return {
    request(nextId: MethodId) {
      generation += 1;
      pendingId = nextId;
      callbacks.onInvalidate();
      const requestGeneration = generation;
      const isCurrent = () => requestGeneration === generation;

      return {
        isCurrent,
        commit() {
          if (!isCurrent() || pendingId === null) return null;
          activeId = pendingId;
          pendingId = null;
          callbacks.onCommit(activeId);
          return activeId;
        },
      };
    },
    settleLatest() {
      generation += 1;
      const latestId = pendingId;
      pendingId = null;
      callbacks.onInvalidate();
      if (latestId === null) return null;
      activeId = latestId;
      callbacks.onCommit(activeId);
      return activeId;
    },
    invalidate,
  };
}

export function MethodTeachingDeck({ ready }: { ready: boolean }) {
  const [activeId, setActiveId] = useState<MethodId>('diagnose');
  const [expanded, setExpanded] = useState(false);
  const deckRef = useRef<HTMLElement>(null);
  const flipAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const contentTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const cardRefs = useRef<Record<MethodId, HTMLButtonElement | null>>({
    diagnose: null,
    explain: null,
    practise: null,
    apply: null,
    review: null,
  });
  const selectionCoordinatorRef = useRef<ReturnType<
    typeof createMethodSelectionCoordinator
  > | null>(null);
  if (!selectionCoordinatorRef.current) {
    selectionCoordinatorRef.current = createMethodSelectionCoordinator(
      'diagnose',
      {
        onCommit: (methodId) => {
          flushSync(() => {
            setActiveId(methodId);
            setExpanded(true);
          });
        },
        onInvalidate: () => {
          killOwnedAnimation(flipAnimationRef);
          killOwnedAnimation(contentTimelineRef);
          const cardElements = Object.values(cardRefs.current).filter(
            (card): card is HTMLButtonElement => card !== null,
          );
          const detail = deckRef.current?.querySelector<HTMLElement>(
            '#hsm-method-detail',
          );
          gsap.killTweensOf(detail ? [...cardElements, detail] : cardElements);
        },
      },
    );
  }
  const selectionCoordinator = selectionCoordinatorRef.current;
  const activeMethod = methodItems.find((method) => method.id === activeId) ?? methodItems[0];
  const inactiveMethods = getInactiveMethods(activeId);
  const deckStyle: DeckProperties = {
    '--hsm-active-accent': activeMethod.accent,
    '--hsm-active-text-accent': activeMethod.textAccent,
    '--hsm-active-wash': activeMethod.atmosphere,
  };

  const focusMethod = (methodId: MethodId) => {
    cardRefs.current[methodId]?.focus();
  };

  useEffect(() => {
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const handleMotionPreferenceChange = () => {
      selectionCoordinator.settleLatest();

      const detail = deckRef.current?.querySelector<HTMLElement>(
        '#hsm-method-detail',
      );
      if (detail) setDetailFinal(detail);
    };

    motionPreference.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      motionPreference.removeEventListener('change', handleMotionPreferenceChange);
      selectionCoordinator.invalidate();
    };
  }, [selectionCoordinator]);

  const selectMethod = (nextId: MethodId) => {
    const selectionRequest = selectionCoordinator.request(nextId);
    const cardElements = Object.values(cardRefs.current).filter(
      (card): card is HTMLButtonElement => card !== null,
    );
    const outgoingDetail = deckRef.current?.querySelector<HTMLElement>(
      '#hsm-method-detail',
    ) ?? null;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const commitSelection = async () => {
      if (!selectionRequest.isCurrent()) return;
      const artworkReady = reducedMotion
        ? true
        : await decodeCardArtwork(cardElements);
      if (!selectionRequest.isCurrent()) return;

      const state = reducedMotion || !artworkReady
        ? null
        : Flip.getState(cardElements);
      const committedId = selectionRequest.commit();
      if (!committedId) return;

      if (!selectionRequest.isCurrent()) return;

      const detail = deckRef.current?.querySelector<HTMLElement>(
        '#hsm-method-detail',
      );
      if (!detail) return;

      if (reducedMotion || !artworkReady) {
        setDetailFinal(detail);
        return;
      }

      if (state) {
        flipAnimationRef.current = Flip.from(state, {
          duration: 0.68,
          ease: 'power3.inOut',
          absolute: true,
          nested: true,
          prune: true,
        });
        const flipAnimation = flipAnimationRef.current;
        flipAnimation.eventCallback('onComplete', () => {
          if (flipAnimationRef.current === flipAnimation) {
            flipAnimationRef.current = null;
          }
        });
      }

      const copy = Array.from(
        detail.querySelectorAll<HTMLElement>('[data-method-copy]'),
      );
      const actions = Array.from(
        detail.querySelectorAll<HTMLElement>('[data-method-action]'),
      );
      const annotations = Array.from(
        detail.querySelectorAll<HTMLElement>('[data-method-annotation]'),
      );
      const timeline = gsap.timeline({
        onComplete: () => {
          if (!selectionRequest.isCurrent()) return;
          gsap.set([detail, ...copy, ...actions, ...annotations], {
            clearProps: 'opacity,visibility,transform',
          });
          if (contentTimelineRef.current === timeline) {
            contentTimelineRef.current = null;
          }
        },
      });
      contentTimelineRef.current = timeline;

      timeline
        .fromTo(
          detail,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' },
        )
        .fromTo(
          copy,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' },
          '<',
        )
        .fromTo(
          actions,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: 'power3.out',
            stagger: 0.1,
          },
          '<0.08',
        )
        .fromTo(
          annotations,
          { autoAlpha: 0, x: 8 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.3,
            ease: 'power3.out',
            stagger: 0.1,
          },
          '>0.15',
        );
    };

    if (reducedMotion || !outgoingDetail) {
      void commitSelection();
      return;
    }

    const exitTimeline = gsap.timeline();
    contentTimelineRef.current = exitTimeline;
    exitTimeline
      .to(outgoingDetail, {
        autoAlpha: 0,
        y: 12,
        duration: 0.2,
        ease: 'power2.in',
      })
      .call(() => {
        if (!selectionRequest.isCurrent()) return;
        void commitSelection();
      });
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    methodId: MethodId,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectMethod(methodId);
      focusMethod(methodId);
      return;
    }

    const horizontalDirection =
      event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : null;
    const usesStackedDeck = expanded && window.matchMedia(
      '(min-width: 768px)',
    ).matches;
    const verticalDirection = usesStackedDeck
      ? event.key === 'ArrowUp'
        ? -1
        : event.key === 'ArrowDown'
          ? 1
          : null
      : null;
    const direction = horizontalDirection ?? verticalDirection;

    if (direction === null) return;

    event.preventDefault();
    const nextId = getAdjacentMethodId(methodId, direction);
    selectMethod(nextId);
    focusMethod(nextId);
  };

  return (
    <section
      className="hsm-deck"
      data-expanded={expanded}
      data-ready={ready}
      data-layout-ratio="42/58"
      style={deckStyle}
      aria-labelledby="hsm-deck-heading"
      ref={deckRef}
    >
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-method-status
      >
        {expanded ? `${activeMethod.label} selected` : ''}
      </p>

      <picture className="hsm-deck__atmosphere" aria-hidden="true">
        <source
          type="image/avif"
          srcSet={`${BOTANICAL_ATMOSPHERE_AVIF_SMALL} 768w, ${BOTANICAL_ATMOSPHERE_AVIF_LARGE} 1536w`}
          sizes="(max-width: 767px) 760px, min(72vw, 1060px)"
        />
        <source
          type="image/webp"
          srcSet={`${BOTANICAL_ATMOSPHERE_WEBP_SMALL} 768w, ${BOTANICAL_ATMOSPHERE_WEBP_LARGE} 1536w`}
          sizes="(max-width: 767px) 760px, min(72vw, 1060px)"
        />
        <img
          src={BOTANICAL_ATMOSPHERE}
          alt=""
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
        />
      </picture>

      <header className="hsm-deck__heading">
        <p className="hsm-deck__eyebrow">02 — HOW WE TEACH</p>
        <h2 id="hsm-deck-heading">
          Every student needs
          <br />
          something different.
        </h2>
        <p className="hsm-deck__heading-accent">
          We start by finding out what.
        </p>
        <p className="hsm-deck__introduction">
          We don’t rush students through a fixed process.
          <br />
          We pay attention to what they understand,
          <br />
          where they’re getting stuck, and what they need next.
        </p>
      </header>

      <div className="hsm-deck__composition">
        <div className="hsm-deck__deck-panel">
          <div
            className="hsm-deck__cards"
            role="group"
            aria-label="Teaching methods"
          >
            {methodItems.map((method) => {
              const isActive = method.id === activeId;
              const inactiveIndex = inactiveMethods.indexOf(method.id);

              return (
                <button
                  key={method.id}
                  ref={(element) => {
                    cardRefs.current[method.id] = element;
                  }}
                  type="button"
                  className={`hsm-deck__card hsm-deck__card--${method.id}${isActive ? ' is-active' : ''}`}
                  aria-label={method.label}
                  aria-pressed={isActive}
                  aria-controls={expanded ? 'hsm-method-detail' : undefined}
                  data-method-id={method.id}
                  data-deck-position={isActive ? 'hero' : `tab-${inactiveIndex + 1}`}
                  onClick={() => selectMethod(method.id)}
                  onKeyDown={(event) => handleKeyDown(event, method.id)}
                >
                  <picture aria-hidden="true">
                    <source
                      type="image/avif"
                      srcSet={`${method.cardAvifSmall} 512w, ${method.cardAvifLarge} 1024w`}
                      sizes={expanded ? '(max-width: 767px) calc(100vw - 44px), 42vw' : '(max-width: 767px) 120px, 20vw'}
                    />
                    <source
                      type="image/webp"
                      srcSet={`${method.cardWebpSmall} 512w, ${method.cardWebpLarge} 1024w`}
                      sizes={expanded ? '(max-width: 767px) calc(100vw - 44px), 42vw' : '(max-width: 767px) 120px, 20vw'}
                    />
                    <img
                      src={method.card}
                      alt=""
                      width={1024}
                      height={1536}
                      decoding="async"
                    />
                  </picture>
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>

          <p className="hsm-deck__process-note">
            Five steps. One continuous learning process.
          </p>

        </div>

        {expanded ? <MethodDetail method={activeMethod} /> : null}
      </div>
    </section>
  );
}
