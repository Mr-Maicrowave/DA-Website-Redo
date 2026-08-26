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

gsap.registerPlugin(Flip);

const TUTOR_PHOTOGRAPH =
  '/images/programs/high-school-method-transition/how-we-teach-tutor-student-v1.png';
const BOTANICAL_ATMOSPHERE =
  '/images/programs/high-school-method-transition/how-we-teach-watercolor-botanical-v1.png';

type DeckProperties = CSSProperties & {
  '--hsm-active-accent': string;
  '--hsm-active-wash': string;
};

export function MethodTeachingDeck({ ready }: { ready: boolean }) {
  const [activeId, setActiveId] = useState<MethodId>('diagnose');
  const [expanded, setExpanded] = useState(false);
  const deckRef = useRef<HTMLElement>(null);
  const selectionTokenRef = useRef(0);
  const contentTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const cardRefs = useRef<Record<MethodId, HTMLButtonElement | null>>({
    diagnose: null,
    explain: null,
    practise: null,
    apply: null,
    review: null,
  });
  const activeMethod = methodItems.find((method) => method.id === activeId) ?? methodItems[0];
  const inactiveMethods = getInactiveMethods(activeId);
  const deckStyle: DeckProperties = {
    '--hsm-active-accent': activeMethod.accent,
    '--hsm-active-wash': activeMethod.atmosphere,
  };

  const focusMethod = (methodId: MethodId) => {
    cardRefs.current[methodId]?.focus();
  };

  useEffect(() => () => {
    selectionTokenRef.current += 1;
    contentTimelineRef.current?.kill();
    gsap.killTweensOf(Object.values(cardRefs.current));
  }, []);

  const selectMethod = (nextId: MethodId) => {
    const selectionToken = ++selectionTokenRef.current;
    const cardElements = Object.values(cardRefs.current).filter(
      (card): card is HTMLButtonElement => card !== null,
    );
    const outgoingContent = deckRef.current?.querySelectorAll<HTMLElement>(
      '[data-method-copy], [data-method-action], [data-method-annotation]',
    ) ?? [];
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    contentTimelineRef.current?.kill();
    contentTimelineRef.current = null;
    gsap.killTweensOf([...cardElements, ...outgoingContent]);

    const state = reducedMotion ? null : Flip.getState(cardElements);

    flushSync(() => {
      setActiveId(nextId);
      setExpanded(true);
    });

    const detail = deckRef.current?.querySelector<HTMLElement>('#hsm-method-detail');
    if (!detail) return;

    const copy = Array.from(
      detail.querySelectorAll<HTMLElement>('[data-method-copy]'),
    );
    const actions = Array.from(
      detail.querySelectorAll<HTMLElement>('[data-method-action]'),
    );
    const annotations = Array.from(
      detail.querySelectorAll<HTMLElement>('[data-method-annotation]'),
    );

    if (reducedMotion) {
      gsap.set(copy, { autoAlpha: 1, y: 0 });
      gsap.set(actions, { autoAlpha: 1, y: 0 });
      gsap.set(annotations, { autoAlpha: 1, x: 0 });
      return;
    }

    if (state) {
      Flip.from(state, {
        duration: 0.68,
        ease: 'power3.inOut',
        absolute: true,
        nested: true,
        prune: true,
      });
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        if (selectionTokenRef.current !== selectionToken) return;
        gsap.set([...copy, ...actions, ...annotations], {
          clearProps: 'opacity,visibility,transform',
        });
        contentTimelineRef.current = null;
      },
    });
    contentTimelineRef.current = timeline;

    timeline
      .fromTo(
        copy,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' },
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
    const verticalDirection = expanded
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
      <img
        className="hsm-deck__atmosphere"
        src={BOTANICAL_ATMOSPHERE}
        alt=""
        aria-hidden="true"
      />

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
                  aria-controls="hsm-method-detail"
                  data-method-id={method.id}
                  data-deck-position={isActive ? 'hero' : `tab-${inactiveIndex + 1}`}
                  onClick={() => selectMethod(method.id)}
                  onKeyDown={(event) => handleKeyDown(event, method.id)}
                >
                  <img src={method.card} alt="" aria-hidden="true" />
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>

          <p className="hsm-deck__process-note">
            Five steps. One continuous learning process.
          </p>

          <figure className="hsm-deck__photograph">
            <img
              src={TUTOR_PHOTOGRAPH}
              alt="A tutor and high-school student working through a workbook together"
            />
          </figure>
        </div>

        {expanded ? <MethodDetail method={activeMethod} /> : null}
      </div>
    </section>
  );
}
