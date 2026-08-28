import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLandscapeJourneyStage, LANDSCAPE_PATH_TIMING } from './landscapeJourneyModel';
import './primary-landscape-journey.css';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  { label: '1–2', href: '#foundation' },
  { label: '3–4', href: '#growth' },
  { label: '5–6', href: '#mastery' },
] as const;

const sparkles = [
  { x: 1094, y: 731 },
  { x: 1237, y: 620 },
  { x: 1353, y: 495 },
] as const;

const PrimaryLandscapeJourney = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState<0 | 1 | 2 | 3>(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: '(min-width: 821px)',
          tablet: '(min-width: 541px) and (max-width: 820px)',
          motion: '(prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (matchContext) => {
          const conditions = matchContext.conditions as {
            desktop: boolean;
            tablet: boolean;
            motion: boolean;
            reduceMotion: boolean;
          };
          const image = section.querySelector<HTMLElement>('.primary-landscape-journey__image');
          const path = section.querySelector<SVGPathElement>('.primary-landscape-journey__path-progress');
          const doorGlow = section.querySelector<HTMLElement>('.primary-landscape-journey__door-glow');
          const particles = gsap.utils.toArray<HTMLElement>('.primary-landscape-journey__firefly', section);
          const sparkleNodes = gsap.utils.toArray<SVGElement>('.primary-landscape-journey__sparkle', section);

          if (conditions.reduceMotion) {
            setActiveStage(3);
            gsap.set(path, { strokeDashoffset: 0 });
            gsap.set([doorGlow, ...sparkleNodes], { opacity: 1 });
            return;
          }

          if (!conditions.motion || !image || !path || !doorGlow) return;

          const pathLength = path.getTotalLength();
          gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
          gsap.set(sparkleNodes, { opacity: 0, scale: 0.45, transformOrigin: 'center' });
          gsap.set(doorGlow, { opacity: 0.15, scale: 0.96 });

          gsap.fromTo(image, { opacity: 0.94 }, { opacity: 1, duration: 1.15, ease: 'power3.out' });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              end: 'bottom 22%',
              scrub: 0.7,
              onUpdate: ({ progress }) => setActiveStage(getLandscapeJourneyStage(progress)),
            },
          });

          timeline
            .to(image, { opacity: 1, duration: 1, ease: 'none' }, 0)
            .to(path, { strokeDashoffset: 0, duration: LANDSCAPE_PATH_TIMING.duration, ease: 'none' }, LANDSCAPE_PATH_TIMING.start)
            .to(sparkleNodes[0], { opacity: 1, scale: 1, duration: 0.07 }, 0.25)
            .to(sparkleNodes[1], { opacity: 1, scale: 1, duration: 0.07 }, 0.55)
            .to(sparkleNodes[2], { opacity: 1, scale: 1, duration: 0.07 }, 0.82)
            .to(doorGlow, { opacity: 0.8, scale: 1.04, duration: 0.16, ease: 'power2.out' }, 0.82);

          if (conditions.desktop) {
            particles.forEach((particle, index) => {
              gsap.to(particle, {
                x: index % 2 === 0 ? 9 : -8,
                y: index % 2 === 0 ? -13 : -9,
                opacity: 0.8,
                duration: 2.5 + index * 0.35,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
            });
          }
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="primary-landscape-journey" aria-label="Primary school learning journey">
      <div className="primary-landscape-journey__viewport">
        <img
          className="primary-landscape-journey__image"
          src="/primary-reference/journey-landscape.png"
          alt="Two primary school children climbing a flower-lined staircase toward a garden door above a green valley"
          decoding="async"
        />
        <svg
          className="primary-landscape-journey__overlay"
          viewBox="0 0 1672 941"
          preserveAspectRatio="xMidYMin meet"
          aria-hidden="true"
        >
          <path
            className="primary-landscape-journey__path-shadow"
            d="M 1014 700 C 1047 721 1067 735 1094 731 C 1146 724 1184 671 1237 620 C 1281 578 1310 532 1353 495 C 1390 462 1404 403 1424 340"
          />
          <path
            className="primary-landscape-journey__path-progress"
            d="M 1014 700 C 1047 721 1067 735 1094 731 C 1146 724 1184 671 1237 620 C 1281 578 1310 532 1353 495 C 1390 462 1404 403 1424 340"
          />
          {sparkles.map((sparkle, index) => (
            <g className="primary-landscape-journey__sparkle" key={`${sparkle.x}-${sparkle.y}`}>
              <path d={`M ${sparkle.x} ${sparkle.y - 13} L ${sparkle.x} ${sparkle.y + 13} M ${sparkle.x - 13} ${sparkle.y} L ${sparkle.x + 13} ${sparkle.y}`} />
              <circle cx={sparkle.x} cy={sparkle.y} r="4" />
              <title>{`Years ${stages[index].label} milestone`}</title>
            </g>
          ))}
        </svg>

        <div className="primary-landscape-journey__door-glow" aria-hidden="true" />
        <div className="primary-landscape-journey__fireflies" aria-hidden="true">
          <i className="primary-landscape-journey__firefly" />
          <i className="primary-landscape-journey__firefly" />
          <i className="primary-landscape-journey__firefly" />
          <i className="primary-landscape-journey__firefly" />
        </div>

        <nav className="primary-landscape-journey__year-nav" aria-label="Primary school year stages">
          {stages.map((stage, index) => (
            <a
              key={stage.label}
              href={stage.href}
              className={activeStage === index + 1 ? 'is-active' : undefined}
              aria-current={activeStage === index + 1 ? 'step' : undefined}
            >
              {stage.label}
            </a>
          ))}
        </nav>

        <div className="primary-landscape-journey__cream-handoff" aria-hidden="true">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 62 C170 45 255 81 430 65 C608 49 730 82 918 60 C1090 40 1260 74 1440 48 L1440 90 L0 90 Z" />
            <path className="primary-landscape-journey__handoff-stroke" d="M920 66 C1030 60 1110 71 1212 60 C1280 53 1328 51 1392 45" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default PrimaryLandscapeJourney;
