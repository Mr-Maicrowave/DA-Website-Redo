import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PATH_SEQUENCE = [
  'LEVEL',
  'PACE',
  'MATERIALS',
  'CLASS FORMAT',
  'TUTOR',
  'LEARNING PLAN',
  'GOALS',
  'FOUNDATION → EXTENSION',
] as const;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export function useWhyDAMotion(): RefObject<HTMLElement> {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(`(prefers-reduced-motion: no-preference)`, () => {
        const isMobile = matchMedia('(max-width: 767px)').matches;
        const heroLines = gsap.utils.toArray<HTMLElement>('[data-motion="hero-line"]', root);
        const signals = gsap.utils.toArray<HTMLElement>('[data-motion="observation"]', root);
        const signalLines = gsap.utils.toArray<SVGPathElement>('[data-motion="signal-line"]', root);

        gsap.set(signalLines, { strokeDasharray: 160, strokeDashoffset: 160 });
        const heroEntrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroEntrance
          .from('[data-motion="hero-meta"]', { opacity: 0, y: -8, duration: 0.45 })
          .from(heroLines, { yPercent: 115, duration: isMobile ? 0.7 : 0.9, stagger: 0.13 }, 0.12)
          .from('[data-motion="hero-support"]', { opacity: 0, y: 16, duration: 0.55 }, 0.72)
          .from('[data-motion="hero-cta"]', { opacity: 0, y: 12, duration: 0.48 }, 0.84)
          .from('[data-motion="hero-student"]', {
            opacity: 0,
            scale: 1.04,
            y: 30,
            filter: 'blur(7px)',
            duration: 1.2,
            clearProps: 'filter',
          }, 0.18)
          .from(signals, {
            opacity: 0,
            scale: 0.92,
            x: (index) => (index % 2 === 0 ? 46 : -46),
            y: 22,
            duration: 0.5,
            stagger: 0.13,
          }, 0.9)
          .to(signalLines, { strokeDashoffset: 0, duration: 0.52, stagger: 0.13, ease: 'power2.out' }, 1.02);

        if (!isMobile) {
          gsap.to('[data-motion="hero-student-image"]', {
            y: 4,
            duration: 5.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.35,
          });
        }

        heroEntrance.eventCallback('onComplete', () => {
          gsap.timeline({
            scrollTrigger: {
              trigger: '[data-testid="why-da-hero"]',
              start: 'top top',
              end: 'bottom top',
              scrub: isMobile ? 0.35 : 0.7,
            },
          })
            .fromTo('[data-motion="hero-copy"]', { y: 0 }, { y: isMobile ? -28 : -68, ease: 'none', immediateRender: false }, 0)
            .fromTo('[data-motion="hero-support"], [data-motion="hero-cta"]', { opacity: 1, y: 0 }, { opacity: 0.22, y: -18, ease: 'none', immediateRender: false }, 0)
            .fromTo('[data-motion="hero-student"]', { yPercent: 0 }, { yPercent: isMobile ? -3 : -7, ease: 'none', immediateRender: false }, 0)
            .fromTo(signals, { y: 0, opacity: 1 }, { y: isMobile ? 32 : 92, opacity: 0.38, stagger: 0.015, ease: 'none', immediateRender: false }, 0);
          ScrollTrigger.refresh();
        });

        const knowTimeline = gsap.timeline({
          scrollTrigger: { trigger: '[data-testid="why-da-know-you"]', start: 'top 76%', once: true },
        });
        knowTimeline
          .from('[data-motion="know-number"]', { yPercent: 110, duration: 0.68, ease: 'power3.out' })
          .from('[data-motion="know-title"]', { clipPath: 'inset(0 100% 0 0)', x: -18, duration: 0.72, ease: 'power3.out' }, 0.14)
          .from('[data-motion="know-copy"]', { opacity: 0, y: 16, duration: 0.5 }, 0.34)
          .from('[data-motion="evidence-photo"]', { clipPath: 'inset(0 0 100% 0 round 16px)', duration: 0.9, ease: 'power3.inOut' }, 0.16)
          .from('[data-motion="evidence-image"]', { scale: 1.08, duration: 1.15, ease: 'power3.out' }, 0.16)
          .from('[data-motion="discovery-item"]', {
            opacity: 0,
            y: 18,
            scale: 0.96,
            duration: 0.42,
            stagger: 0.11,
            ease: 'power3.out',
          }, 0.72)
          .to('[data-motion="discovery-item"]', {
            '--discovery-pulse': 1,
            scale: 1.05,
            duration: 0.18,
            stagger: 0.11,
            yoyo: true,
            repeat: 1,
          }, 0.84);

        gsap.fromTo('[data-motion="evidence-image"]', { yPercent: -2 }, {
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-motion="evidence-photo"]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        });

        const pathItems = PATH_SEQUENCE
          .map((title) => root.querySelector<HTMLElement>(`[data-path-title="${title}"]`))
          .filter((item): item is HTMLElement => Boolean(item));
        const pathwayTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-testid="why-da-personalise"]',
            start: 'top 78%',
            end: isMobile ? 'top 24%' : 'top 18%',
            scrub: isMobile ? 0.35 : 0.65,
          },
        });
        pathwayTimeline
          .from('[data-motion="journey-path"]', { strokeDashoffset: 520, duration: 0.75, stagger: 0.06, ease: 'none' })
          .from('[data-motion="path-ring"]', { opacity: 0, scale: 0.88, rotation: -3, duration: 0.7, stagger: 0.12 }, 0.12)
          .from('[data-motion="path-node"]', { opacity: 0, scale: 0.5, duration: 0.34, stagger: 0.08 }, 0.26)
          .from('[data-motion="path-centre"]', { opacity: 0, scale: 0.85, duration: 0.72, ease: 'power3.out' }, 0.34)
          .from('[data-motion="path-centre"] span', { opacity: 0, y: 12, duration: 0.45 }, 0.55)
          .from(pathItems, { opacity: 0, x: (index) => (index < 3 || index === 5 ? -22 : 22), duration: 0.42, stagger: 0.12 }, 0.48);

        gsap.from('[data-motion="proof-photo"]', {
          clipPath: 'inset(0 0 100% 0 round 10px)',
          y: (index) => 10 + (index % 3) * 10,
          duration: 0.78,
          stagger: 0.12,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.why-da-photo-strip', start: 'top 82%', once: true },
        });

        gsap.from('[data-motion="proof-icon"]', {
          opacity: 0,
          scale: 0.82,
          duration: 0.45,
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-testid="why-da-proof-band"]', start: 'top 84%', once: true },
        });

        root.querySelectorAll<HTMLElement>('[data-count-to]').forEach((value) => {
          const target = Number(value.dataset.countTo);
          const suffix = value.dataset.countSuffix ?? '';
          ScrollTrigger.create({
            trigger: value,
            start: 'top 92%',
            once: true,
            onEnter: () => {
              const counter = { value: 0 };
              gsap.to(counter, {
                value: target,
                duration: 1.25,
                ease: 'power3.out',
                onUpdate: () => { value.textContent = `${Math.round(counter.value)}${suffix}`; },
              });
            },
          });
        });

        gsap.fromTo('[data-motion="continuation-thread"]', { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-testid="why-da-proof-band"]', start: 'top 78%', end: 'bottom bottom', scrub: 0.5 },
        });

        gsap.utils.toArray<HTMLElement>('.why-da-teach, .why-da-care, .why-da-connected, .why-da-grow, .why-da-achieve', root).forEach((section) => {
          gsap.from(section.querySelector('[data-motion="chapter-heading"]'), {
            opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', immediateRender: false,
            scrollTrigger: { trigger: section, start: 'top 78%', once: true },
          });
        });
        gsap.from('[data-motion="teach-step"]', {
          opacity: 0, y: 18, scale: 0.95, duration: 0.48, stagger: 0.1, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-cycle', start: 'top 82%', once: true },
        });
        gsap.from('[data-motion="teach-photo"]', {
          clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power3.inOut', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-teach__practice', start: 'top 80%', once: true },
        });
        gsap.from('[data-motion="lesson-board"]', {
          opacity: 0, x: 28, rotation: 1, duration: 0.72, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-teach__practice', start: 'top 76%', once: true },
        });
        gsap.from('[data-motion="care-value"]', {
          opacity: 0, y: 24, duration: 0.55, stagger: 0.1, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-care__values', start: 'top 84%', once: true },
        });
        gsap.from('[data-motion="connection-panel"]', {
          opacity: 0, y: 28, duration: 0.66, stagger: 0.13, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-connected__dashboard', start: 'top 82%', once: true },
        });
        gsap.from('[data-motion="growth-milestone"]', {
          opacity: 0, y: 22, duration: 0.58, stagger: 0.11, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-growth-milestones', start: 'top 82%', once: true },
        });
        gsap.from('[data-motion="growth-quality"]', {
          opacity: 0, y: 14, duration: 0.42, stagger: 0.08, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-growth-qualities', start: 'top 88%', once: true },
        });
        gsap.from('[data-motion="result-card"]', {
          opacity: 0, y: 26, duration: 0.56, stagger: 0.1, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-results', start: 'top 84%', once: true },
        });
        gsap.from('[data-motion="testimonial"]', {
          opacity: 0, y: 20, rotation: (index) => index % 2 ? 0.4 : -0.4, duration: 0.5, stagger: 0.08, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '.why-da-testimonials', start: 'top 84%', once: true },
        });
        gsap.from('[data-motion="closing-cta"]', {
          opacity: 0, x: -28, duration: 0.75, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: '[data-testid="why-da-closing-cta"]', start: 'top 78%', once: true },
        });
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      context.revert();
      media.revert();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || matchMedia(REDUCED_MOTION).matches || !matchMedia(FINE_POINTER).matches) return;

    const hero = root.querySelector<HTMLElement>('[data-testid="why-da-hero"]');
    const student = root.querySelector<HTMLElement>('[data-motion="hero-student-image"]');
    const observationLayer = root.querySelector<HTMLElement>('.why-da-hero__visual');
    const atmosphere = root.querySelector<HTMLElement>('.why-da-signal-orbit');
    let frame = 0;

    const onHeroPointerMove = (event: PointerEvent) => {
      if (!hero || !student || !observationLayer || !atmosphere) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(atmosphere, { x: x * 5, y: y * 5, duration: 0.7, overwrite: 'auto' });
        gsap.to(student, { x: x * 3, duration: 0.7, overwrite: 'auto' });
        gsap.to(observationLayer, { '--observation-x': `${x * 8}px`, '--observation-y': `${y * 8}px`, duration: 0.7, overwrite: 'auto' });
      });
    };

    const signalCleanups = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="observation"]')).map((signal) => {
      const onMove = (event: PointerEvent) => {
        const bounds = signal.getBoundingClientRect();
        const x = Math.max(-5, Math.min(5, (event.clientX - (bounds.left + bounds.width / 2)) * 0.08));
        const y = Math.max(-5, Math.min(5, (event.clientY - (bounds.top + bounds.height / 2)) * 0.08));
        gsap.to(signal, { x, y, scale: 1.02, duration: 0.24, overwrite: 'auto' });
        signal.dataset.active = 'true';
      };
      const onLeave = () => {
        gsap.to(signal, { x: 0, y: 0, scale: 1, duration: 0.38, ease: 'power3.out', overwrite: 'auto' });
        delete signal.dataset.active;
      };
      signal.addEventListener('pointermove', onMove, { passive: true });
      signal.addEventListener('pointerleave', onLeave);
      return () => { signal.removeEventListener('pointermove', onMove); signal.removeEventListener('pointerleave', onLeave); };
    });

    const pathCleanups = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="path-item"]')).map((item) => {
      const enter = () => { root.dataset.activePath = item.dataset.pathTitle ?? ''; };
      const leave = () => { delete root.dataset.activePath; };
      item.addEventListener('pointerenter', enter);
      item.addEventListener('pointerleave', leave);
      return () => { item.removeEventListener('pointerenter', enter); item.removeEventListener('pointerleave', leave); };
    });

    hero?.addEventListener('pointermove', onHeroPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      hero?.removeEventListener('pointermove', onHeroPointerMove);
      signalCleanups.forEach((cleanup) => cleanup());
      pathCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return rootRef;
}
