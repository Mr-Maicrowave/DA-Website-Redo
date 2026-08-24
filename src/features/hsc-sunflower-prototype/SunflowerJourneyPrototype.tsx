import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CAMERA_BEATS,
  SUNFLOWER_BACKGROUNDS,
  SUNFLOWER_FOREGROUNDS,
} from "./sunflowerJourneyModel";
import "./sunflower-journey-prototype.css";

gsap.registerPlugin(ScrollTrigger);

type PlantStyle = CSSProperties & {
  "--plant-x": string;
  "--plant-y": string;
  "--plant-width": string;
  "--plant-opacity": number;
};

const plantLayout = [
  ["8%", "2%", "28vw", 0.76], ["76%", "0%", "27vw", 0.72],
  ["38%", "3%", "24vw", 0.7], ["64%", "8%", "21vw", 0.7],
  ["22%", "10%", "17vw", 0.66], ["43%", "0%", "35vw", 0.82],
  ["52%", "-2%", "49vw", 0], ["50%", "0%", "24vw", 0.65],
  ["48%", "-2%", "48vw", 0], ["100%", "0%", "66vw", 0],
  ["0%", "0%", "66vw", 0], ["50%", "0%", "100vw", 0],
] as const;

const CAMERA_LABELS = [
  "camera-01", "camera-02", "camera-03", "camera-04", "camera-05",
  "camera-06", "camera-07", "camera-08", "camera-09", "camera-10",
  "camera-11", "camera-12", "camera-13", "camera-14", "camera-15",
  "camera-16", "camera-17", "camera-18", "camera-19", "camera-20",
] as const;

const OCCLUSION_SEQUENCE = [
  "close-right", "bottom-leaves", "close-left", "cluster-five", "close-right",
  "leaves", "close-left", "bottom-leaves", "cluster-five",
] as const;

export default function SunflowerJourneyPrototype() {
  const rootRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sources = [
      ...SUNFLOWER_BACKGROUNDS,
      ...SUNFLOWER_FOREGROUNDS.map(({ src }) => src),
    ];
    Promise.all(sources.map((src) => new Promise<void>((resolve) => {
      const image = new Image();
      image.src = src;
      image.decode?.().then(resolve).catch(resolve);
      image.onload = () => resolve();
      image.onerror = () => resolve();
    }))).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready || !rootRef.current) return;

    const context = gsap.context(() => {
      const root = rootRef.current!;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const stage = root.querySelector<HTMLElement>(".sunflowerStage")!;
      const atmosphere = root.querySelector<HTMLElement>("[data-atmosphere]")!;
      const backgrounds = gsap.utils.toArray<HTMLElement>(".sunflowerBackground", root);
      const midground = gsap.utils.toArray<HTMLElement>(".midgroundLayer .sunflowerPlant", root);
      const foreground = gsap.utils.toArray<HTMLElement>(
        '.foregroundLayer .sunflowerPlant:not([data-plant="close-right"]):not([data-plant="close-left"]):not([data-plant="bottom-leaves"]):not([data-plant="cluster-five"])',
        root,
      );
      const plant = (id: string) => root.querySelector<HTMLElement>(`[data-plant="${id}"]`)!;
      const occluders = OCCLUSION_SEQUENCE.map(plant);

      gsap.set(backgrounds, { autoAlpha: 0, scale: 1.03, xPercent: 0, yPercent: 0 });
      gsap.set(backgrounds[0], { autoAlpha: 1 });
      gsap.set(midground, { autoAlpha: 0 });
      gsap.set(occluders, { autoAlpha: 0 });

      if (!reducedMotion) {
        [...midground, ...foreground].forEach((element, index) => {
          gsap.to(element, {
            rotation: index % 2 === 0 ? 0.72 : -0.64,
            duration: 4.8 + (index % 5) * 0.73,
            delay: -index * 0.41,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          pin: stage,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const plantRevealBeats = [2, 3, 4, 5, 6, 7, 8] as const;
      midground.forEach((element, index) => {
        timeline.to(element, {
          autoAlpha: 0.62 + (index % 3) * 0.08,
          duration: 3.2,
        }, plantRevealBeats[index] * 5);
        timeline.to(element, {
          autoAlpha: 0,
          yPercent: reducedMotion ? 0 : -12 - index * 1.4,
          duration: 8,
        }, 61 + index * 0.35);
      });

      let previousBackground = 0;
      let transitionIndex = 0;
      CAMERA_BEATS.forEach((beat, index) => {
        const at = index * 5;
        timeline.addLabel(CAMERA_LABELS[index], at);

        const activeBackground = backgrounds[beat.backgroundIndex];
        timeline.to(activeBackground, {
          scale: reducedMotion ? 1.02 : beat.scale,
          xPercent: reducedMotion ? beat.xPercent * 0.15 : beat.xPercent,
          yPercent: reducedMotion ? beat.yPercent * 0.15 : beat.yPercent,
          duration: 5,
        }, at);
        timeline.to(midground, {
          xPercent: reducedMotion ? 0 : -beat.xPercent * 1.8,
          yPercent: reducedMotion ? 0 : beat.yPercent * 0.75,
          scale: reducedMotion ? 1 : 1 + Math.max(0, beat.scale - 1) * 0.55,
          duration: 5,
        }, at);
        timeline.to(atmosphere, {
          opacity: 0.1 + Math.max(0, 1 - beat.exposure) * 1.1,
          filter: `brightness(${0.98 + beat.exposure * 0.02}) saturate(${0.92 + beat.exposure * 0.08})`,
          duration: 5,
        }, at);
        timeline.to(foreground, {
          xPercent: reducedMotion ? 0 : -beat.xPercent * 3,
          yPercent: reducedMotion ? 0 : beat.yPercent * 1.15,
          scale: reducedMotion ? 1 : 1 + Math.max(0, beat.scale - 1) * 0.85,
          duration: 5,
        }, at);

        if (beat.backgroundIndex !== previousBackground) {
          const outgoing = backgrounds[previousBackground];
          const incoming = backgrounds[beat.backgroundIndex];
          const id = OCCLUSION_SEQUENCE[transitionIndex];
          const occluder = plant(id);
          const fromX = id === "close-left" ? -72 : id === "close-right" ? 72 : 0;
          const toX = id === "close-left" ? 18 : id === "close-right" ? -18 : 0;
          const fromY = id === "bottom-leaves" ? 92 : 12;

          timeline.set(incoming, { visibility: "visible" }, at - 0.8);
          timeline.fromTo(occluder, {
            autoAlpha: 0,
            xPercent: fromX,
            yPercent: fromY,
            scale: id === "bottom-leaves" ? 1.08 : 1.22,
          }, {
            autoAlpha: reducedMotion ? 0.58 : 1,
            xPercent: toX,
            yPercent: 0,
            scale: id === "bottom-leaves" ? 1.18 : 1.52,
            duration: 1.45,
          }, at - 0.75);
          timeline.to(incoming, { autoAlpha: 1, duration: 0.75 }, at + 0.12);
          timeline.to(outgoing, { autoAlpha: 0, duration: 0.75 }, at + 0.18);
          timeline.to(occluder, {
            autoAlpha: 0,
            xPercent: -fromX * 0.72,
            yPercent: id === "bottom-leaves" ? -35 : -8,
            scale: id === "bottom-leaves" ? 1.28 : 1.8,
            duration: 1.2,
          }, at + 0.82);

          previousBackground = beat.backgroundIndex;
          transitionIndex += 1;
        }
      });
    }, rootRef);

    return () => {
      context.revert();
    };
  }, [ready]);

  return (
    <main className="sunflowerJourney" ref={rootRef} aria-busy={!ready}>
      <section className="sunflowerStage" aria-label="Cinematic sunflower field prototype">
        <div className="backgroundLayer" aria-hidden="true">
          {SUNFLOWER_BACKGROUNDS.map((src, index) => (
            <img
              className="sunflowerBackground"
              data-background={index}
              src={src}
              alt=""
              key={src}
              decoding="async"
            />
          ))}
        </div>

        {(["midground", "foreground"] as const).map((zone) => (
          <div className={zone === "midground" ? "midgroundLayer" : "foregroundLayer"} aria-hidden="true" key={zone}>
            {SUNFLOWER_FOREGROUNDS.map((asset, index) => {
              if (asset.zone !== zone) return null;
              const [x, y, width, opacity] = plantLayout[index];
              const style: PlantStyle = {
                "--plant-x": x,
                "--plant-y": y,
                "--plant-width": width,
                "--plant-opacity": opacity,
              };
              return (
                <img
                  className="sunflowerPlant"
                  data-plant={asset.id}
                  src={asset.src}
                  alt=""
                  style={style}
                  key={asset.id}
                  decoding="async"
                />
              );
            })}
          </div>
        ))}

        <div className="atmosphereLayer" data-atmosphere aria-hidden="true" />
        <div className="storyLayer" aria-hidden="true" />
      </section>
    </main>
  );
}
