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
        const heroLabels = gsap.utils.toArray<HTMLElement>('[data-motion="hero-label"]', root);
        const heroSlices = gsap.utils.toArray<HTMLElement>('[data-motion="hero-background-slice"]', root);
        const heroTop = root.querySelector<HTMLElement>('.why-da-hero__background-slice--top');
        const heroBottom = root.querySelector<HTMLElement>('.why-da-hero__background-slice--bottom');

        const heroEntrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroEntrance
          .from('[data-motion="hero-base"], [data-motion="hero-background-slice"]', { opacity: 0, filter: 'brightness(.68)', duration: 1.15, clearProps: 'filter' })
          .from(heroTop, { x: isMobile ? -24 : -38, duration: 1.05, ease: 'power4.out' }, 0.12)
          .from(heroBottom, { x: isMobile ? 26 : 42, duration: 1.05, ease: 'power4.out' }, 0.12)
          .from('[data-motion="hero-meta"]', { opacity: 0, y: -8, duration: 0.48 }, 0.46)
          .from(heroLines, { yPercent: 115, duration: isMobile ? 0.72 : 0.92, stagger: 0.14, ease: 'power4.out' }, 0.54)
          .from('[data-motion="hero-support"]', { opacity: 0, y: 15, duration: 0.58 }, 1.02)
          .from(heroLabels, { opacity: 0, x: -10, duration: 0.42, stagger: 0.12 }, 1.14)
          .from('[data-motion="hero-scroll"]', { opacity: 0, duration: 0.42 }, 1.46)
          .set('[data-motion="hero-statement"]', { opacity: 0 }, 0);

        if (!isMobile) {
          gsap.to(heroTop, {
            x: -13,
            duration: 16,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.6,
          });
          gsap.to(heroBottom, {
            x: 14,
            duration: 18,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.7,
          });
        }

        heroEntrance.eventCallback('onComplete', () => {
          const heroAssembly = gsap.timeline({
            scrollTrigger: {
              trigger: '[data-testid="why-da-hero"]',
              start: 'top top',
              end: () => `+=${window.innerHeight * (isMobile ? 0.85 : 1.5)}`,
              pin: true,
              scrub: isMobile ? 0.35 : 0.75,
              invalidateOnRefresh: true,
            },
          });
          heroAssembly
            .to(heroTop, { x: 0, ease: 'none', duration: .4 }, 0)
            .to(heroBottom, { x: 0, ease: 'none', duration: .4 }, 0)
            .to(heroSlices, { scale: 1, ease: 'none', duration: .4 }, 0)
            .to(heroSlices, { opacity: 0, ease: 'none', duration: .18 }, .67)
            .to('[data-motion="hero-grade"]', { opacity: .78, ease: 'none', duration: .3 }, .67)
            .to('[data-motion="hero-copy"]', { y: isMobile ? -26 : -54, ease: 'none', duration: .3 }, .7)
            .to(heroLabels, { opacity: 0, ease: 'none', stagger: .015, duration: .22 }, .7)
            .fromTo('[data-motion="hero-statement"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: 'power3.out', duration: .2 }, .8);
          ScrollTrigger.refresh();
        });

        const knowTimeline = gsap.timeline({
          scrollTrigger: { trigger: '[data-testid="why-da-know-you"]', start: 'top 76%', once: true },
        });
        knowTimeline
          .from('[data-motion="know-intro"]', { opacity: 0, y: 12, duration: .7, ease: 'power3.out' })
          .from('[data-motion="know-number"]', { yPercent: 110, duration: .65, ease: 'power3.out' }, .08)
          .from('[data-motion="know-title"]', { opacity: 0, y: 12, duration: .62, ease: 'power3.out' }, .12)
          .from('[data-motion="know-headline"]', { yPercent: 108, duration: .82, ease: 'power4.out' }, .2)
          .from('[data-motion="know-copy"]', { opacity: 0, y: 12, duration: .58, ease: 'power3.out' }, .32);

        const observationRows = gsap.utils.toArray<HTMLElement>('[data-motion="know-observation"]', root);
        const ambientShots: gsap.core.Tween[] = [];
        const shotMovement = [
          { x: 8, y: 0, scale: 1.05, duration: 12 },
          { x: 0, y: -6, scale: 1.045, duration: 12 },
          { x: 0, y: 0, scale: 1.055, duration: 15 },
          { x: -8, y: 0, scale: 1.045, duration: 14 },
        ];

        observationRows.forEach((observation, index) => {
          const photo = observation.querySelector<HTMLElement>('[data-motion="know-photo"]');
          const image = observation.querySelector<HTMLElement>('[data-motion="know-image"]');
          const copy = observation.querySelector<HTMLElement>('[data-motion="know-row-copy"]');
          if (!photo || !image || !copy) return;

          gsap.timeline({ scrollTrigger: { trigger: observation, start: 'top 88%', once: true } })
            .from(photo, { clipPath: 'inset(0 3% 0 3%)', duration: .86, ease: 'power3.out', immediateRender: false })
            .from(image, { scale: 1.07, filter: 'brightness(.82) contrast(1.025) saturate(.94)', opacity: .88, duration: .82, ease: 'power3.out', immediateRender: false }, 0)
            .from(copy, { opacity: 0, y: 12, duration: .58, ease: 'power3.out', immediateRender: false }, .04);

          const movement = shotMovement[index];
          ambientShots.push(gsap.to(image, {
            x: isMobile ? movement.x * .2 : movement.x,
            y: isMobile ? movement.y * .2 : movement.y,
            scale: isMobile ? 1.015 : movement.scale,
            duration: movement.duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }));
        });

        const lightPass = gsap.to('[data-motion="know-film"] .why-da-observations__light', {
          xPercent: 180, duration: 17, repeat: -1, repeatDelay: 5, ease: 'sine.inOut',
        });
        const timelinePoint = root.querySelector<HTMLElement>('[data-motion="know-timeline-point"]');
        const timelineJourney = gsap.timeline({ repeat: -1, repeatDelay: 2.5, delay: .8 });
        if (timelinePoint) {
          timelineJourney.set(timelinePoint, { opacity: 0, y: 0 });
          observationRows.forEach((observation) => {
            const marker = observation.querySelector<HTMLElement>('.why-da-observation__journey i');
            const image = observation.querySelector<HTMLElement>('[data-motion="know-image"]');
            timelineJourney
              .to(timelinePoint, { opacity: .9, y: () => observation.offsetTop + observation.offsetHeight / 2, duration: 2.1, ease: 'sine.inOut' })
              .to(marker, { scale: 1.08, borderColor: 'rgba(155,115,50,1)', duration: .32, yoyo: true, repeat: 1 }, '<-.18')
              .to(image, { filter: 'brightness(1.03) contrast(1.025) saturate(.94) sepia(.025)', duration: .4, yoyo: true, repeat: 1 }, '<');
          });
          timelineJourney.to(timelinePoint, { opacity: 0, duration: .5 });
        }

        const ambientFilm = [...ambientShots, lightPass, timelineJourney];
        ScrollTrigger.create({
          trigger: '[data-motion="know-parent"]',
          start: 'top 72%',
          onEnter: () => ambientFilm.forEach((animation) => animation.pause()),
          onLeaveBack: () => ambientFilm.forEach((animation) => animation.resume()),
        });

        gsap.timeline({ scrollTrigger: { trigger: '[data-motion="know-parent"]', start: 'top 86%', once: true } })
          .from('[data-motion="know-parent"] .why-da-parent__eyeline', { opacity: 0, y: 8, duration: .58, ease: 'power3.out', immediateRender: false })
          .from('[data-motion="know-parent-title"]', { yPercent: 108, duration: .82, ease: 'power3.out', immediateRender: false }, .08)
          .from('[data-motion="know-parent"] .why-da-parent__aside, [data-motion="know-parent"] .why-da-parent__copy > p:not(.why-da-parent__eyeline)', { opacity: 0, y: 8, duration: .68, ease: 'power3.out', stagger: .08, immediateRender: false }, .28);

        gsap.timeline({ scrollTrigger: { trigger: '[data-motion="know-closing"]', start: 'top 90%', once: true } })
          .from('[data-motion="know-closing"] h3', { opacity: 0, y: 10, duration: .58, ease: 'power3.out', immediateRender: false })
          .from('[data-motion="know-listen-line"]', { scaleX: 0, duration: .72, ease: 'power3.out', immediateRender: false }, .14)
          .from('[data-motion="know-closing"] p', { opacity: 0, y: 7, duration: .48, ease: 'power3.out', immediateRender: false }, .28);

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
    const heroTop = root.querySelector<HTMLElement>('.why-da-hero__slice--top');
    const heroMiddle = root.querySelector<HTMLElement>('.why-da-hero__slice--middle');
    const heroBottom = root.querySelector<HTMLElement>('.why-da-hero__slice--bottom');
    let frame = 0;

    const onHeroPointerMove = (event: PointerEvent) => {
      if (!hero || !heroTop || !heroMiddle || !heroBottom) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(heroTop, { x: -16 + x * 4, y: y * 2, duration: 0.8, overwrite: 'auto' });
        gsap.to(heroMiddle, { x: x * 2, y: y, duration: 0.8, overwrite: 'auto' });
        gsap.to(heroBottom, { x: 18 + x * 5, y: y * 2, duration: 0.8, overwrite: 'auto' });
      });
    };

    const pathCleanups = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="path-item"]')).map((item) => {
      const enter = () => { root.dataset.activePath = item.dataset.pathTitle ?? ''; };
      const leave = () => { delete root.dataset.activePath; };
      item.addEventListener('pointerenter', enter);
      item.addEventListener('pointerleave', leave);
      return () => { item.removeEventListener('pointerenter', enter); item.removeEventListener('pointerleave', leave); };
    });

    const observationCleanups = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="know-observation"]')).map((row) => {
      const photo = row.querySelector<HTMLElement>('[data-motion="know-photo"]');
      const copy = row.querySelector<HTMLElement>('[data-motion="know-row-copy"]');
      if (!photo || !copy) return () => undefined;
      const photoX = gsap.quickTo(photo, '--depth-x', { duration: .75, ease: 'power3.out' });
      const photoY = gsap.quickTo(photo, '--depth-y', { duration: .75, ease: 'power3.out' });
      const copyX = gsap.quickTo(copy, 'x', { duration: .75, ease: 'power3.out' });
      const copyY = gsap.quickTo(copy, 'y', { duration: .75, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        const bounds = row.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        photoX(x * 8); photoY(y * 6);
        copyX(x * -2); copyY(y * -2);
      };
      const leave = () => {
        photoX(0); photoY(0); copyX(0); copyY(0);
      };
      row.addEventListener('pointermove', move, { passive: true });
      row.addEventListener('pointerleave', leave);
      return () => { row.removeEventListener('pointermove', move); row.removeEventListener('pointerleave', leave); };
    });

    hero?.addEventListener('pointermove', onHeroPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      hero?.removeEventListener('pointermove', onHeroPointerMove);
      pathCleanups.forEach((cleanup) => cleanup());
      observationCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return rootRef;
}
