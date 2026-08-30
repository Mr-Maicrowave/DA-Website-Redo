import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
        const revealMasks = ['inset(0 100% 0 0)', 'inset(100% 0 0 0)', 'inset(0 0 0 100%)', 'inset(0 100% 0 0)'];
        const editorialReveal = gsap.timeline({ scrollTrigger: { trigger: '[data-motion="know-film"]', start: 'top 82%', once: true } });
        observationRows.forEach((observation, index) => {
          const photo = observation.querySelector<HTMLElement>('[data-motion="know-photo"]');
          const image = observation.querySelector<HTMLElement>('[data-motion="know-image"]');
          const copy = observation.querySelector<HTMLElement>('[data-motion="know-row-copy"]');
          if (!photo || !image || !copy) return;
          editorialReveal
            .from(photo, { clipPath: revealMasks[index], duration: .82, ease: 'power3.out', immediateRender: false }, .34 + index * .08)
            .from(image, { scale: 1.06, duration: .9, ease: 'power3.out', immediateRender: false }, .34 + index * .08)
            .from(copy, { opacity: 0, y: 10, duration: .5, ease: 'power3.out', immediateRender: false }, .4 + index * .07);
        });

        gsap.timeline({ scrollTrigger: { trigger: '[data-motion="know-parent"]', start: 'top 86%', once: true } })
          .from('[data-motion="know-parent"] .why-da-parent__eyeline', { opacity: 0, y: 8, duration: .58, ease: 'power3.out', immediateRender: false })
          .from('[data-motion="know-parent-title"]', { yPercent: 108, duration: .82, ease: 'power3.out', immediateRender: false }, .08)
          .from('[data-motion="know-parent"] .why-da-parent__aside, [data-motion="know-parent"] .why-da-parent__copy > p:not(.why-da-parent__eyeline)', { opacity: 0, y: 8, duration: .68, ease: 'power3.out', stagger: .08, immediateRender: false }, .28);

        gsap.timeline({ scrollTrigger: { trigger: '[data-motion="know-closing"]', start: 'top 90%', once: true } })
          .from('[data-motion="know-closing"] h3', { opacity: 0, y: 10, duration: .58, ease: 'power3.out', immediateRender: false })
          .from('[data-motion="know-listen-line"]', { scaleX: 0, duration: .72, ease: 'power3.out', immediateRender: false }, .14)
          .from('[data-motion="know-closing"] p', { opacity: 0, y: 7, duration: .48, ease: 'power3.out', immediateRender: false }, .28);

        const personalisationTimeline = gsap.timeline({
          scrollTrigger: { trigger: '[data-testid="why-da-personalise"]', start: 'top 76%', once: true },
        });
        personalisationTimeline
          .from('[data-motion="personalise-intro"] > *', { opacity: 0, y: 18, duration: .68, stagger: .08, ease: 'power3.out', immediateRender: false })
          .from('[data-motion="personalise-hero-film"]', { opacity: 0, x: 38, rotation: .6, duration: .9, ease: 'power4.out', immediateRender: false }, .12)
          .from('[data-motion="personalise-film-strip"]', { opacity: 0, x: 48, duration: .92, ease: 'power4.out', immediateRender: false }, .34)
          .from('[data-motion="personalise-frame"] .film-markings', { opacity: 0, y: -5, duration: .36, stagger: .07, ease: 'power3.out', immediateRender: false }, .62);

        gsap.utils.toArray<HTMLElement>('.why-da-care, .why-da-grow, .why-da-achieve', root).forEach((section) => {
          gsap.from(section.querySelector('[data-motion="chapter-heading"]'), {
            opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', immediateRender: false,
            scrollTrigger: { trigger: section, start: 'top 78%', once: true },
          });
        });
        gsap.timeline({ scrollTrigger: { trigger: '[data-testid="why-da-care"]', start: 'top 78%', once: true } })
          .from('[data-motion="care-intro"] .why-da-section-heading', { opacity: 0, y: 10, duration: .48, ease: 'power3.out', immediateRender: false })
          .from('[data-motion="care-intro"] h3 > span', { clipPath: 'inset(0 0 100% 0)', y: 18, duration: .75, ease: 'power4.out', immediateRender: false }, .08)
          .from('[data-motion="care-intro"] h3 > em', { opacity: 0, y: 12, duration: .58, ease: 'power3.out', immediateRender: false }, .23)
          .from('[data-motion="care-intro"] > p', { opacity: 0, y: 12, duration: .58, ease: 'power3.out', immediateRender: false }, .26)
          .from('[data-motion="care-film"]', { opacity: 0, x: 80, duration: .9, ease: 'power3.out', immediateRender: false }, .34)
          .from('[data-motion="care-closing"] > *', { opacity: 0, y: 14, duration: .62, stagger: .1, ease: 'power3.out', immediateRender: false }, .62);

        const succeedTimeline = gsap.timeline({ scrollTrigger: { trigger: '[data-testid="why-da-succeed"]', start: 'top 72%', once: true } });
        const succeedFrameSlip = isMobile ? 11 : 28;
        succeedTimeline
          .from('[data-motion="succeed-intro"] .why-da-section-heading', { opacity: 0, y: 12, duration: .48, ease: 'power3.out', immediateRender: false })
          .from('[data-motion="succeed-intro"] h3 > span', { clipPath: 'inset(0 0 100% 0)', y: 18, duration: .72, ease: 'power4.out', immediateRender: false }, .08)
          .from('[data-motion="succeed-intro"] h3 > em', { opacity: 0, y: 10, duration: .52, ease: 'power3.out', immediateRender: false }, .23)
          .from('[data-motion="succeed-intro"] > p', { opacity: 0, y: 10, duration: .46, ease: 'power3.out', immediateRender: false }, .3)
          .from('[data-motion="succeed-screen-wrap"]', { opacity: 0, y: 50, scale: .94, duration: 1, ease: 'power3.out', immediateRender: false }, .38)
          .fromTo('[data-motion="succeed-aperture-top"]', { yPercent: 0 }, { yPercent: -101, duration: .9, ease: 'power3.inOut', immediateRender: false }, .72)
          .fromTo('[data-motion="succeed-aperture-bottom"]', { yPercent: 0 }, { yPercent: 101, duration: .9, ease: 'power3.inOut', immediateRender: false }, .72)
          .to('[data-motion="succeed-projection"]', { y: succeedFrameSlip, duration: .1, ease: 'none' }, 1.7)
          .to('[data-motion="succeed-projection"]', { y: -3, duration: .09, ease: 'none' }, 1.8)
          .to('[data-motion="succeed-exposure"]', { opacity: .15, duration: .07, ease: 'none' }, 1.82)
          .to('[data-motion="succeed-exposure"]', { opacity: 0, duration: .09, ease: 'none' }, 1.89)
          .to('[data-motion="succeed-projection"]', { y: isMobile ? -6 : -10, scale: 1.015, filter: 'blur(2px)', duration: .1, ease: 'none' }, 1.94)
          .to('[data-motion="succeed-projection"]', { y: isMobile ? 3 : 5, scale: 1.006, filter: 'blur(.6px)', duration: .08, ease: 'none' }, 2.04)
          .to('[data-motion="succeed-projection"]', { y: isMobile ? 8 : 12, scale: 1, filter: 'blur(0px)', duration: .075, ease: 'none' }, 2.12)
          .to('[data-motion="succeed-projection"]', { y: 0, scale: 1, filter: 'blur(0px)', duration: .08, ease: 'power2.out', clearProps: 'transform,filter' }, 2.2)
          .fromTo('[data-motion="succeed-frame-locked"]', { opacity: 0 }, { opacity: 1, duration: .12, repeat: 1, repeatDelay: .58, yoyo: true }, 2.3)
          .from('[data-motion="succeed-after"] > *', { opacity: 0, y: 18, duration: .65, stagger: .14, ease: 'power3.out', immediateRender: false }, 2.5);
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

    const personalisationCleanups = Array.from(root.querySelectorAll<HTMLElement>('.film-frame .film-image')).map((image) => {
      const imageX = gsap.quickTo(image, '--camera-x', { duration: .8, ease: 'power3.out', unit: 'px' });
      const imageY = gsap.quickTo(image, '--camera-y', { duration: .8, ease: 'power3.out', unit: 'px' });
      const move = (event: PointerEvent) => {
        const bounds = image.getBoundingClientRect();
        imageX(Math.max(-4, Math.min(4, ((event.clientX - bounds.left) / bounds.width - .5) * -8)));
        imageY(Math.max(-3, Math.min(3, ((event.clientY - bounds.top) / bounds.height - .5) * -6)));
      };
      const leave = () => { imageX(0); imageY(0); };
      image.addEventListener('pointermove', move, { passive: true });
      image.addEventListener('pointerleave', leave);
      return () => { image.removeEventListener('pointermove', move); image.removeEventListener('pointerleave', leave); };
    });

    const observationCleanups = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="know-observation"]')).map((row) => {
      const photo = row.querySelector<HTMLElement>('[data-motion="know-photo"]');
      const image = row.querySelector<HTMLElement>('[data-motion="know-image"]');
      const copy = row.querySelector<HTMLElement>('[data-motion="know-row-copy"]');
      if (!photo || !image || !copy) return () => undefined;
      const imageX = gsap.quickTo(image, '--camera-x', { duration: .75, ease: 'power3.out', unit: 'px' });
      const imageY = gsap.quickTo(image, '--camera-y', { duration: .75, ease: 'power3.out', unit: 'px' });
      const move = (event: PointerEvent) => {
        const bounds = photo.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        imageX(Math.max(-4, Math.min(4, x * -8)));
        imageY(Math.max(-3, Math.min(3, y * -6)));
      };
      const leave = () => { imageX(0); imageY(0); };
      photo.addEventListener('pointermove', move, { passive: true });
      photo.addEventListener('pointerleave', leave);
      return () => { photo.removeEventListener('pointermove', move); photo.removeEventListener('pointerleave', leave); };
    });

    hero?.addEventListener('pointermove', onHeroPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      hero?.removeEventListener('pointermove', onHeroPointerMove);
      personalisationCleanups.forEach((cleanup) => cleanup());
      observationCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return rootRef;
}
