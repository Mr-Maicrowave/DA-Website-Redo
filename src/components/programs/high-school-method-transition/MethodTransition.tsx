import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MethodTeachingDeck, type MethodDeckPresentationElements } from './MethodTeachingDeck';
import { reconcileSourceHandoffPose, type TransitionPose } from './methodTransitionGeometry';
import { METHOD_TRANSITION_SCROLL_VH } from './methodTransitionTiming';
import './MethodTransition.css';

gsap.registerPlugin(ScrollTrigger);

const BLOOM = '/images/programs/high-school-method-transition/method-bloom-center-green-v1.png';
const MAGNIFIER = '/high-school-journey/finale/year-08-magnifying-glass-ai.png';
const SOURCE_END = 0.05;
const ENTER_START = 0.16;
const ENTER_END = 0.36;
const DOCK_END = 0.58;

function decode(image: HTMLImageElement) {
  return image.complete && image.naturalWidth > 0 ? Promise.resolve() : image.decode().catch(() => undefined);
}

function hasCompletePresentationElements(
  elements: MethodDeckPresentationElements | null,
): elements is MethodDeckPresentationElements {
  return Boolean(
    elements
    && elements.deck.isConnected
    && elements.diagnoseMagnifier.isConnected
    && Object.values(elements.cards).every((card) => card?.isConnected),
  );
}

export function MethodTransition() {
  const [ready, setReady] = useState(false);
  const [deckElements, setDeckElements] = useState<MethodDeckPresentationElements | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLImageElement>(null);
  const proxyRef = useRef<HTMLImageElement>(null);
  const registerDeckElements = useCallback((elements: MethodDeckPresentationElements | null) => {
    const completeElements = hasCompletePresentationElements(elements) ? elements : null;
    setDeckElements(completeElements);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const bloom = bloomRef.current;
    const proxy = proxyRef.current;
    const source = document.querySelector<HTMLImageElement>('[data-method-transition-magnifier]');
    if (!section || !stage || !bloom || !proxy || !source || !hasCompletePresentationElements(deckElements)) return;

    const elements = deckElements;
    const { deck, cards, diagnoseMagnifier } = elements;
    const cardElements = Object.values(cards);
    const diagnose = cards.diagnose;
    const secondary = cardElements.filter((card) => card !== diagnose);
    const sourceOpacity = source.style.opacity;
    const sourceVisibility = source.style.visibility;
    const finale = source.closest<HTMLElement>('.hs-finale');
    const sourceYear = source.closest<HTMLElement>('[data-method-transition-source="year-8"]');
    const sticky = source.closest<HTMLElement>('.hs-journey__sticky');
    const media = gsap.matchMedia();
    let mounted = true;

    const context = gsap.context(() => {
      media.add({ all: 'all', reduce: '(prefers-reduced-motion: reduce)' }, (match) => {
          // The stage is the pinned frame. Diagnose, the secondary cards and the
          // docked magnifier all live inside it, so every measurement below is a
          // delta relative to the stage's own box - stable for the whole pin,
          // regardless of where the stage happens to sit in the document when it
          // isn't pinned yet.
          const poses: Record<'source' | 'dock', TransitionPose> = {
            source: { x: 0, y: 0, scale: 1 }, dock: { x: 0, y: 0, scale: 1 },
          };
          let intro = { x: 0, y: 0, scale: 1 };
          let normalizedSource: DOMRect | null = null;
          const poseFor = (rect: DOMRect, width = rect.width): TransitionPose => ({
            x: rect.left + rect.width / 2 - proxy.offsetWidth / 2,
            y: rect.top + rect.height / 2 - proxy.offsetHeight / 2,
            scale: width / proxy.offsetWidth,
          });
          const measureSource = () => {
            const finaleTransform = finale?.style.transform ?? '';
            const yearAnimation = sourceYear?.style.animation ?? '';
            const yearTransform = sourceYear?.style.transform ?? '';
            try {
              if (finale) finale.style.transform = 'none';
              if (sourceYear) { sourceYear.style.animation = 'none'; sourceYear.style.transform = 'none'; }
              const rect = source.getBoundingClientRect();
              const stickyRect = sticky?.getBoundingClientRect();
              return stickyRect ? new DOMRect(rect.left, rect.top - stickyRect.top, rect.width, rect.height) : rect;
            } finally {
              if (sourceYear) { sourceYear.style.animation = yearAnimation; sourceYear.style.transform = yearTransform; }
              if (finale) finale.style.transform = finaleTransform;
            }
          };
          const measure = () => {
            gsap.set([...cardElements, diagnoseMagnifier], { clearProps: 'transform,opacity,visibility,willChange' });
            const stageRect = stage.getBoundingClientRect();
            const diagnoseRect = diagnose.getBoundingClientRect();
            const targetWidth = Math.min(stageRect.width * 0.34, 380);
            intro = {
              x: stageRect.left + stageRect.width / 2 - (diagnoseRect.left + diagnoseRect.width / 2),
              y: stageRect.top + stageRect.height / 2 - (diagnoseRect.top + diagnoseRect.height / 2),
              scale: targetWidth / diagnoseRect.width,
            };
            gsap.set(diagnose, { ...intro, autoAlpha: 1 });
            const dockRect = diagnoseMagnifier.getBoundingClientRect();
            gsap.set(diagnoseMagnifier, { autoAlpha: 0 });
            normalizedSource = measureSource();
            poses.source = poseFor(normalizedSource);
            poses.dock = poseFor(new DOMRect(dockRect.left, dockRect.top - stageRect.top, dockRect.width, dockRect.height));
          };

          gsap.set(proxy, { autoAlpha: 0, transformOrigin: '50% 50%' });
          deck.dataset.presentation = 'true';
          if ((match.conditions as { reduce: boolean }).reduce) {
            gsap.set([...cardElements, diagnoseMagnifier], { clearProps: 'transform,opacity,visibility,willChange' });
            deck.dataset.presentation = 'idle';
            setReady(true);
            return;
          }

          measure();
          const master = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage, start: 'top top',
              end: () => `+=${Math.round(window.innerHeight * (METHOD_TRANSITION_SCROLL_VH / 100))}`,
              pin: true, pinType: 'fixed', pinSpacing: true, scrub: true,
              invalidateOnRefresh: true, onRefreshInit: measure,
            },
          });
          master
            // One continuous flight: the proxy interpolates straight from the
            // journey hand-off pose to the real dock pose. It never targets an
            // oversized "portal" scale along the way, so it never has to shrink
            // back down once it arrives - no overshoot, no correction.
            .set(proxy, { x: () => poses.source.x, y: () => poses.source.y, scale: () => poses.source.scale, autoAlpha: 0 }, 0)
            .set(source, { autoAlpha: 1 }, 0)
            .to(proxy, { autoAlpha: 1, duration: 0.006 }, 0)
            .set(source, { autoAlpha: 0 }, 0.008)
            .to(finale, { scale: 0.94, y: -14, autoAlpha: 0, duration: 0.25 }, 0)
            .to(bloom, { autoAlpha: 0.72, scale: 1.15, duration: 0.3 }, 0.05)
            .to(proxy, { x: () => poses.dock.x, y: () => poses.dock.y, scale: () => poses.dock.scale, duration: DOCK_END - SOURCE_END, ease: 'power1.inOut' }, SOURCE_END)
            .set(diagnose, { x: () => intro.x, y: () => intro.y + 64, scale: () => intro.scale, autoAlpha: 0, willChange: 'transform,opacity' }, 0)
            .set(secondary, { x: 28, y: 30, autoAlpha: 0, willChange: 'transform,opacity' }, 0)
            .to(diagnose, { x: () => intro.x, y: () => intro.y, scale: () => intro.scale, autoAlpha: 1, duration: ENTER_END - ENTER_START, ease: 'power2.out' }, ENTER_START)
            .to(proxy, { autoAlpha: 0, duration: 0.025 }, DOCK_END)
            .to(diagnoseMagnifier, { autoAlpha: 1, duration: 0.025 }, DOCK_END)
            // Diagnose (now carrying the docked magnifier) and the four
            // secondary cards resolve into the real row while the stage is
            // still pinned on screen - the assembly is never off-screen.
            .to(diagnose, { x: 0, y: 0, scale: 1, duration: 1 - DOCK_END, ease: 'power2.inOut' }, DOCK_END)
            .to(secondary, { x: 0, y: 0, autoAlpha: 1, duration: 0.25, stagger: 0.045, ease: 'power2.out' }, DOCK_END + 0.04)
            .to(bloom, { autoAlpha: 0, duration: 1 - DOCK_END }, DOCK_END);
          master.eventCallback('onUpdate', () => {
            const complete = master.progress() >= 0.999;
            if (complete) {
              gsap.set([...cardElements, diagnoseMagnifier], { clearProps: 'transform,opacity,visibility,willChange' });
              deck.dataset.presentation = 'idle';
            } else deck.dataset.presentation = 'true';
            setReady((previous) => previous === complete ? previous : complete);
            if (normalizedSource && master.progress() <= SOURCE_END) {
              gsap.set(proxy, reconcileSourceHandoffPose({ x: Number(gsap.getProperty(proxy, 'x')) || 0, y: Number(gsap.getProperty(proxy, 'y')) || 0, scale: Number(gsap.getProperty(proxy, 'scaleX')) || 1 }, normalizedSource, source.getBoundingClientRect(), 1 - master.progress() / SOURCE_END));
            }
          });
          return () => {
            master.scrollTrigger?.kill(); master.kill();
            gsap.set([...cardElements, diagnoseMagnifier], { clearProps: 'transform,opacity,visibility,willChange' });
            deck.dataset.presentation = 'idle';
          };
      });
    }, section);
    void Promise.all(Array.from(section.querySelectorAll<HTMLImageElement>('img')).map(decode)).then(() => {
      if (mounted) ScrollTrigger.refresh();
    });
    return () => {
      mounted = false; media.revert(); context.revert();
      source.style.opacity = sourceOpacity; source.style.visibility = sourceVisibility;
    };
  }, [deckElements]);

  return <section className="hsm-transition" ref={sectionRef}>
    <div className="hsm-transition__stage" ref={stageRef}>
      <img className="hsm-transition__center-bloom" ref={bloomRef} src={BLOOM} alt="" aria-hidden="true" decoding="async" />
      <div className="hsm-transition__interaction"><MethodTeachingDeck ready={ready} onPresentationElements={registerDeckElements} /></div>
    </div>
    <img className="hsm-transition__proxy" ref={proxyRef} src={MAGNIFIER} alt="" aria-hidden="true" decoding="async" />
  </section>;
}
