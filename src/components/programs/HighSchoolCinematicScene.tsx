import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { highSchoolJourneyAssets } from "@/data/highSchoolJourneyAssets";
import {
  highSchoolJourneyStages,
  type JourneySceneId,
} from "@/data/highSchoolJourneyScenes";
import { FinaleScene } from "./high-school-finale/FinaleScene";
import { finaleConfig } from "./high-school-finale/finaleConfig";
import "./HighSchoolCinematicScene.css";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const WORLDS: JourneySceneId[] = ["blue", "green", "purple", "orange"];

const WORLD_OBJECTS = {
  blue: ["pencilCup", "books"],
  green: ["plant", "books"],
  purple: ["pages", "books"],
  orange: ["graduationCap", "pages"],
} as const;

const SCENES = {
  blue: {
    arrival: 16,
    heroStart: 24,
    heroEnd: 37,
    departure: 43,
    direction: 0,
  },
  green: {
    arrival: 39,
    heroStart: 47,
    heroEnd: 58,
    departure: 64,
    direction: 1,
  },
  purple: {
    arrival: 60,
    heroStart: 68,
    heroEnd: 79,
    departure: 85,
    direction: -1,
  },
  orange: {
    arrival: 81,
    heroStart: 88,
    heroEnd: 102,
    departure: 130,
    direction: 1,
  },
} as const;

const DEPTH = {
  FAR_BACKGROUND: { scale: [0.96, 1.07], travel: 2 },
  FOREGROUND: { scale: [0.88, 1.5], travel: 42 },
} as const;

function required(value: string | null, label: string) {
  if (!value) throw new Error(`High School journey asset missing: ${label}`);
  return value;
}

export function HighSchoolCinematicScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const entranceRef = useRef<HTMLDivElement>(null);
  const openingCopyRef = useRef<HTMLDivElement>(null);
  const mountainsRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const deskLeftRef = useRef<HTMLDivElement>(null);
  const deskRightRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLImageElement>(null);
  const planePathRef = useRef<SVGPathElement>(null);
  const layers = useRef<Record<string, Element | null>>({});

  useEffect(() => {
    [
      highSchoolJourneyAssets.background.entrancePlate.src,
      highSchoolJourneyAssets.background.haze.src,
      highSchoolJourneyAssets.objects.entranceComposite.src,
      highSchoolJourneyAssets.blue.largeWash.src,
    ].forEach((asset) => {
      if (asset) {
        const image = new Image();
        image.decoding = "async";
        image.src = asset;
      }
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return;
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      mm.add(
        {
          desktop: "(min-width:1024px)",
          tablet: "(min-width:640px) and (max-width:1023px)",
          mobile: "(max-width:639px)",
          reduce: "(prefers-reduced-motion:reduce)",
        },
        (query) => {
          const media = query.conditions as Record<
            "desktop" | "tablet" | "mobile" | "reduce",
            boolean
          >;
          if (media.reduce) return;
          const tier = media.desktop
            ? "desktop"
            : media.tablet
              ? "tablet"
              : "mobile";
          const strength =
            tier === "desktop" ? 1 : tier === "tablet" ? 0.72 : 0.48;
          section.style.setProperty(
            "--hs-journey-scroll",
            `${tier === "desktop" ? 1020 : tier === "tablet" ? 800 : 620}vh`,
          );

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(
            mountainsRef.current,
            { scale: 1 },
            { scale: 1.07, yPercent: -2, duration: 20 },
            0,
          )
            .fromTo(
              hazeRef.current,
              { scale: 1.01 },
              { scale: 1.2, yPercent: -5, opacity: 0.18, duration: 20 },
              0,
            )
            .fromTo(
              floatingRef.current,
              { scale: 1 },
              {
                scale: 1.42,
                xPercent: -9 * strength,
                yPercent: -7,
                opacity: 0,
                duration: 16,
              },
              1,
            )
            .fromTo(
              deskLeftRef.current,
              { scale: 1 },
              {
                scale: 1.62,
                xPercent: -48 * strength,
                yPercent: 12,
                opacity: 0,
                filter: `blur(${3 * strength}px)`,
                duration: 16,
              },
              1,
            )
            .fromTo(
              deskRightRef.current,
              { scale: 1 },
              {
                scale: 1.68,
                xPercent: 50 * strength,
                yPercent: 14,
                opacity: 0,
                filter: `blur(${3 * strength}px)`,
                duration: 16,
              },
              1,
            )
            .to(
              openingCopyRef.current,
              { autoAlpha: 0, y: -12, duration: 4 },
              10,
            )
            .to(entranceRef.current, { autoAlpha: 0, duration: 3 }, 18)
            .set(entranceRef.current, { visibility: "hidden" }, 21);

          WORLDS.forEach((id, index) => {
            const window = SCENES[id];
            const far = layers.current[`${id}-far`];
            const foreground = layers.current[`${id}-foreground`];
            const droplets = layers.current[`${id}-droplets`];
            const objects = layers.current[`${id}-objects`];
            const stage = layers.current[`${id}-stage`];
            const world = layers.current[`${id}-world`];
            const direction = window.direction;

            tl.set(world, { autoAlpha: 1 }, window.arrival)
              .fromTo(
                far,
                {
                  scale: DEPTH.FAR_BACKGROUND.scale[0],
                  xPercent: direction * 2,
                  opacity: 0,
                },
                {
                  scale: DEPTH.FAR_BACKGROUND.scale[1],
                  xPercent: -direction * DEPTH.FAR_BACKGROUND.travel,
                  opacity: 0.4,
                  duration: window.departure - window.arrival,
                },
                window.arrival,
              )
              .fromTo(
                stage,
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 3, ease: "power1.out" },
                window.heroStart,
              )
              .to(
                stage,
                { autoAlpha: 0, y: -15, duration: 3 },
                window.heroEnd - 2,
              )
              .fromTo(
                foreground,
                {
                  scale: DEPTH.FOREGROUND.scale[0],
                  xPercent: direction * 8,
                  yPercent: 4,
                  opacity: 0,
                },
                {
                  scale: 1.05,
                  xPercent: 0,
                  yPercent: 0,
                  opacity: 0.58,
                  duration: 2,
                },
                window.heroEnd - 1,
              )
              .to(
                foreground,
                {
                  scale: DEPTH.FOREGROUND.scale[1],
                  xPercent: -direction * DEPTH.FOREGROUND.travel * strength,
                  yPercent: -8,
                  opacity: 0,
                  filter: `blur(${2.5 * strength}px)`,
                  duration: window.departure - window.heroEnd + 1,
                },
                window.heroEnd + 1,
              )
              .fromTo(
                droplets,
                { opacity: 0, scale: 0.86, rotation: direction * -3 },
                {
                  opacity: 0.28,
                  scale: 1.08,
                  rotation: direction * 3,
                  duration: 8,
                },
                window.heroStart - 2,
              )
              .to(
                droplets,
                { opacity: 0, scale: 1.24, duration: 5 },
                window.heroEnd,
              )
              .fromTo(
                objects,
                { opacity: 0, scale: 0.9, yPercent: 8 },
                { opacity: 0.72, scale: 1, yPercent: 0, duration: 5 },
                window.heroStart - 1,
              )
              .to(
                objects,
                {
                  opacity: 0,
                  scale: 1.2,
                  xPercent: -direction * 10 * strength,
                  yPercent: -6,
                  duration: 5,
                },
                window.heroEnd,
              )
              .to(far, { opacity: 0, duration: 2 }, window.departure - 2)
              .set(world, { autoAlpha: 0 }, window.departure);
          });

          if (planeRef.current && planePathRef.current) {
            tl.fromTo(
              planeRef.current,
              { opacity: 0, scale: tier === "mobile" ? 0.55 : 0.76 },
              {
                opacity: 0.62,
                scale: tier === "mobile" ? 0.3 : 0.38,
                motionPath: {
                  path: planePathRef.current,
                  align: planePathRef.current,
                  alignOrigin: [0.5, 0.5],
                  autoRotate: 8,
                },
                duration: 67,
              },
              12,
            )
              .set(planeRef.current, { zIndex: 4 }, 33)
              .set(planeRef.current, { zIndex: 18 }, 53)
              .set(planeRef.current, { zIndex: 4 }, 66)
              .set(planeRef.current, { zIndex: 18 }, 80)
              .to(planeRef.current, { opacity: 0, duration: 7 }, 84);
          }

          const ft = finaleConfig.timeline;
          const swipe =
            tier === "desktop"
              ? finaleConfig.swipe.desktop
              : tier === "tablet"
                ? finaleConfig.swipe.tablet
                : finaleConfig.swipe.mobile;
          const finale = (part: string) => layers.current[`finale-${part}`];

          tl.set(finale("scene"), { autoAlpha: 1 }, ft.orangeHold)
            .set(
              finale("hero"),
              { opacity: 1, scale: 1.03, xPercent: 0 },
              ft.orangeHold,
            )
            .set(
              finale("burst"),
              { opacity: 0.72, scale: 1.06, transformOrigin: "50% 50%" },
              ft.orangeHold,
            )
            .set(
              [finale("reveal-0"), finale("reveal-1"), finale("reveal-2")],
              { scale: 0.03, transformOrigin: "50% 50%" },
              ft.orangeHold,
            )
            .to(
              finale("curtain-left"),
              {
                x: -10 * strength,
                rotation: -0.35,
                duration: ft.firstBreak - ft.anticipation,
              },
              ft.anticipation,
            )
            .to(
              finale("curtain-right"),
              {
                x: 8 * strength,
                rotation: 0.3,
                duration: ft.firstBreak - ft.anticipation,
              },
              ft.anticipation,
            )
            .to(finale("reveal-0"), { scale: 3.2, duration: 12 }, ft.firstBreak)
            .to(
              finale("reveal-1"),
              { scale: 3, duration: 13 },
              ft.firstBreak + 2,
            )
            .to(
              finale("reveal-2"),
              { scale: 2.8, duration: 12 },
              ft.firstBreak + 4,
            )
            .to(
              finale("curtain-left"),
              {
                x: `-${swipe}vw`,
                yPercent: -5,
                scaleX: 1.32,
                rotation: -2.2,
                duration: ft.swipeEnd - ft.swipeStart,
              },
              ft.swipeStart,
            )
            .to(
              finale("curtain-right"),
              {
                x: `${swipe}vw`,
                yPercent: 4,
                scaleX: 1.28,
                rotation: 1.8,
                duration: ft.swipeEnd - ft.swipeStart,
              },
              ft.swipeStart,
            )
            .to(finale("burst"), { opacity: 0.92, duration: 8 }, ft.firstBreak)
            .to(
              finale("hero"),
              { scale: 1, duration: ft.heroHold - ft.swipeEnd },
              ft.swipeEnd,
            );

          for (let index = 0; index < 6; index += 1) {
            const side = index % 2 === 0 ? -1 : 1;
            tl.fromTo(
              finale(`streak-${index}`),
              { opacity: 0, x: 0, scaleX: 0.8 },
              {
                opacity: 0.72,
                x: `${side * swipe * 0.82}vw`,
                scaleX: 1.45,
                duration: 9,
              },
              ft.swipeStart + index * 0.45,
            ).to(
              finale(`streak-${index}`),
              { opacity: 0, duration: 3 },
              ft.swipeEnd - 2,
            );
          }
          for (let index = 0; index < 10; index += 1) {
            const side = index % 2 === 0 ? -1 : 1;
            tl.fromTo(
              finale(`fragment-${index}`),
              { opacity: 0, x: 0, rotation: 0, scale: 0.8 },
              {
                opacity: 0.76,
                x: `${side * swipe * 0.95}vw`,
                y: side * (index % 3) * 13,
                rotation: side * (18 + index * 4),
                scale: 1.14,
                duration: 10,
              },
              ft.swipeStart + 1 + index * 0.28,
            ).to(
              finale(`fragment-${index}`),
              { opacity: 0, duration: 2 },
              ft.swipeEnd - 1,
            );
          }

          tl.set(
            [finale("curtain-left"), finale("curtain-right")],
            { autoAlpha: 0 },
            ft.swipeEnd,
          )
            .to(
              finale("hero"),
              {
                xPercent: tier === "mobile" ? 0 : -38,
                scale: tier === "mobile" ? 0.72 : 0.92,
                duration: ft.heading - ft.moveLeft,
                ease: "power2.inOut",
              },
              ft.moveLeft,
            )
            .to(
              finale("burst"),
              { scale: 1, duration: ft.heading - ft.moveLeft },
              ft.moveLeft,
            );
          tl.fromTo(
            finale("final-heading"),
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 5, ease: "power2.out" },
            ft.heading,
          );
          [ft.year7, ft.year8, ft.year9, ft.year10].forEach((at, index) => {
            tl.fromTo(
              finale(`year-${index}`),
              {
                autoAlpha: 0,
                scale: 0.18,
                yPercent: 12,
                rotation: index % 2 ? 5 : -5,
              },
              {
                autoAlpha: 1,
                scale: 1,
                yPercent: 0,
                rotation: 0,
                duration: 5,
                ease: "power2.out",
              },
              at,
            );
            if (index > 0) {
              tl.fromTo(
                finale(`year-arrow-${index - 1}`),
                { autoAlpha: 0, scale: 0.45, rotation: -8 },
                {
                  autoAlpha: 1,
                  scale: 1,
                  rotation: 0,
                  duration: 3,
                  ease: "power2.out",
                },
                at - 2,
              );
            }
          });
          tl.to(scene, { backgroundColor: "#fffdf8", duration: 5 }, ft.year10);
        },
      );
    }, section);
    return () => {
      mm.revert();
      context.revert();
    };
  }, []);

  const assign =
    (id: JourneySceneId, part: string) => (node: HTMLElement | null) => {
      layers.current[`${id}-${part}`] = node;
    };
  const registerFinale =
    (part: string) => (node: HTMLElement | SVGElement | null) => {
      layers.current[`finale-${part}`] = node;
    };

  return (
    <section
      className="hs-journey"
      ref={sectionRef}
      aria-labelledby="hs-journey-title"
    >
      <h2 id="hs-journey-title" className="sr-only">
        The four critical stages of Years 7 to 10
      </h2>
      <div className="hs-journey__sticky">
        <div className="hs-journey__scene" ref={sceneRef}>
          <div className="hs-journey__entrance" ref={entranceRef}>
            <div
              className="hs-journey__layer hs-journey__mountains"
              ref={mountainsRef}
            >
              <img
                src={required(
                  highSchoolJourneyAssets.background.entrancePlate.src,
                  "entrance plate",
                )}
                alt=""
              />
            </div>
            <div className="hs-journey__layer hs-journey__haze" ref={hazeRef}>
              <img
                src={required(
                  highSchoolJourneyAssets.background.haze.src,
                  "haze",
                )}
                alt=""
              />
            </div>
            <div
              className="hs-journey__layer hs-journey__floating"
              ref={floatingRef}
            >
              <img
                src={required(
                  highSchoolJourneyAssets.objects.floatingComposite.src,
                  "floating objects",
                )}
                alt=""
              />
            </div>
            <div
              className="hs-journey__layer hs-journey__desk hs-journey__desk--left"
              ref={deskLeftRef}
            >
              <img
                src={required(
                  highSchoolJourneyAssets.objects.entranceComposite.src,
                  "desk",
                )}
                alt=""
              />
            </div>
            <div
              className="hs-journey__layer hs-journey__desk hs-journey__desk--right"
              ref={deskRightRef}
            >
              <img
                src={required(
                  highSchoolJourneyAssets.objects.entranceComposite.src,
                  "desk",
                )}
                alt=""
              />
            </div>
            <div className="hs-journey__opening-copy" ref={openingCopyRef}>
              <p>Years 7–10</p>
              <h3>
                Find your feet.
                <br />
                Then find your direction.
              </h3>
              <span>Scroll to travel forward</span>
            </div>
          </div>

          {WORLDS.map((id, index) => {
            const worldAssets = highSchoolJourneyAssets[id];
            const worldPlate = required(
              worldAssets.largeWash.src,
              `${id} wash`,
            );
            const foreground = required(
              ("foregroundStroke" in worldAssets
                ? worldAssets.foregroundStroke
                : worldAssets.foregroundEdge
              ).src,
              `${id} foreground`,
            );
            const droplets = required(
              worldAssets.droplets.src,
              `${id} droplets`,
            );
            const stage = highSchoolJourneyStages[index];
            return (
              <div
                className={`hs-journey__world hs-journey__world--${id}`}
                key={id}
                ref={assign(id, "world") as React.Ref<HTMLDivElement>}
              >
                <div
                  className="hs-journey__pigment hs-journey__pigment--far"
                  ref={assign(id, "far") as React.Ref<HTMLDivElement>}
                >
                  <img
                    src={worldPlate}
                    alt=""
                    loading={index ? "lazy" : "eager"}
                  />
                </div>
                <div
                  className="hs-journey__pigment hs-journey__pigment--foreground"
                  ref={assign(id, "foreground") as React.Ref<HTMLDivElement>}
                >
                  <img src={foreground} alt="" loading="lazy" />
                </div>
                <div
                  className="hs-journey__droplets"
                  ref={assign(id, "droplets") as React.Ref<HTMLDivElement>}
                  aria-hidden="true"
                >
                  <img src={droplets} alt="" loading="lazy" />
                </div>
                <div
                  className={`hs-journey__world-objects hs-journey__world-objects--${id}`}
                  ref={assign(id, "objects") as React.Ref<HTMLDivElement>}
                  aria-hidden="true"
                >
                  {WORLD_OBJECTS[id].map((objectName) => (
                    <img
                      key={objectName}
                      className={`hs-journey__object hs-journey__object--${objectName}`}
                      src={required(
                        highSchoolJourneyAssets.objects[objectName].src,
                        objectName,
                      )}
                      alt=""
                      loading="lazy"
                    />
                  ))}
                </div>
                <article
                  className="hs-journey__stage"
                  ref={assign(id, "stage") as React.Ref<HTMLElement>}
                >
                  <span className="hs-journey__number">{stage.number}</span>
                  <div>
                    <h3>{stage.heading}</h3>
                    <p>{stage.body}</p>
                  </div>
                </article>
              </div>
            );
          })}

          <svg
            className="hs-journey__flight-map"
            viewBox="0 0 1200 700"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={planePathRef}
              d="M95 560C258 470 246 323 420 329c160 5 173 116 335 54 143-55 122-213 346-275"
            />
          </svg>
          <img
            ref={planeRef}
            className="hs-journey__plane"
            src={highSchoolJourneyAssets.plane.primary.src ?? ""}
            alt=""
          />
          <FinaleScene register={registerFinale} />
          <div className="hs-journey__grain" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default HighSchoolCinematicScene;
