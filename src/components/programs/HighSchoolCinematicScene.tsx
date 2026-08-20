import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HighSchoolCinematicScene.css";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   TUNING — every scroll-linked number lives here. Nothing else in this file
   or the stylesheet needs to change to adjust the feel of the scene.

   Each layer animates scale (1 -> value) and translateY (0 -> value, in vh)
   from scroll progress 0 to 1 across the section. "outwardPx" is the extra
   horizontal split applied only to the foreground's left/right halves (the
   "passing between objects" effect). "mousePx" is the max desktop mouse-
   parallax offset in pixels.
============================================================================ */

const MOTION = {
  desktop: {
    mountains: { scale: 1.1, y: -1.5, mousePx: 1 },
    water: { scale: 1.22, y: -2.5, mousePx: 2.5 },
    floating: { scale: 1.45, y: -4, mousePx: 5 },
    foreground: { scale: 1.9, y: 6, mousePx: 8, outwardPx: 26 },
  },
  tablet: {
    mountains: { scale: 1.075, y: -1.125, mousePx: 1 },
    water: { scale: 1.165, y: -1.875, mousePx: 2.5 },
    floating: { scale: 1.3375, y: -3, mousePx: 5 },
    foreground: { scale: 1.675, y: 4.5, mousePx: 8, outwardPx: 18 },
  },
  mobile: {
    mountains: { scale: 1.04, y: -0.6 },
    water: { scale: 1.08, y: -0.9 },
    floating: { scale: 1.15, y: -1.3 },
    foreground: { scale: 1.25, y: 1.7, outwardPx: 8 },
  },
} as const;

const IMAGE_SRCS = [
  "/images/programs/highschool-layer-1-mountains.png",
  "/images/programs/highschool-layer-2-water-mist.png",
  "/images/programs/highschool-layer-3-floating-objects.png",
  "/images/programs/highschool-layer-4-foreground.png",
];

/**
 * HighSchoolCinematicScene
 * -------------------------
 * Scroll-driven "moving forward through the scene" parallax built from four
 * flat, pre-composited PNG layers (mountains / water & mist / floating
 * objects / foreground desk) that share one identical canvas, so they
 * register perfectly when stacked. A sticky 100vh viewport clips the scene
 * while the outer section's extra height (~280-300vh) supplies scroll
 * distance for the scrub.
 *
 * Depth is sold two ways: increasing scale + upward drift per layer (nearer
 * layers move more), and — for the foreground only — the image is shown
 * twice, each copy clip-masked to one half and nudged outward, so the
 * viewer reads it as passing between the desk objects. Both copies are the
 * same untouched source file; nothing is cropped or re-exported.
 *
 * A lightweight desktop-only mouse parallax rides on its own nested
 * transform layer so it never competes with the scroll-driven transform on
 * the same element. Respects prefers-reduced-motion (static, aligned,
 * no scroll or mouse motion) and disables mouse parallax on touch/coarse
 * pointers.
 */
export function HighSchoolCinematicScene() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const mountainsDepthRef = useRef<HTMLDivElement | null>(null);
  const mountainsMouseRef = useRef<HTMLDivElement | null>(null);
  const waterDepthRef = useRef<HTMLDivElement | null>(null);
  const waterMouseRef = useRef<HTMLDivElement | null>(null);
  const floatingDepthRef = useRef<HTMLDivElement | null>(null);
  const floatingMouseRef = useRef<HTMLDivElement | null>(null);
  const foregroundDepthRef = useRef<HTMLDivElement | null>(null);
  const foregroundMouseRef = useRef<HTMLDivElement | null>(null);
  const foregroundLeftRef = useRef<HTMLDivElement | null>(null);
  const foregroundRightRef = useRef<HTMLDivElement | null>(null);

  // Preload the four layers so the scene doesn't pop in mid-scroll.
  useEffect(() => {
    IMAGE_SRCS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 640px) and (max-width: 1023px)",
        isMobile: "(max-width: 639px)",
        canHoverPrecisely: "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reduceMotion, isDesktop, isTablet, canHoverPrecisely } = context.conditions as {
          reduceMotion: boolean;
          isDesktop: boolean;
          isTablet: boolean;
          isMobile: boolean;
          canHoverPrecisely: boolean;
        };

        const tier = reduceMotion ? null : isDesktop ? MOTION.desktop : isTablet ? MOTION.tablet : MOTION.mobile;

        // Reduced motion: static, correctly-aligned composition, no scroll
        // or mouse-linked movement at all.
        if (!tier) {
          gsap.set(
            [
              mountainsDepthRef.current,
              waterDepthRef.current,
              floatingDepthRef.current,
              foregroundDepthRef.current,
              mountainsMouseRef.current,
              waterMouseRef.current,
              floatingMouseRef.current,
              foregroundMouseRef.current,
              foregroundLeftRef.current,
              foregroundRightRef.current,
            ],
            { scale: 1, x: 0, y: 0, clearProps: "willChange" }
          );
          return;
        }

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        tl.fromTo(mountainsDepthRef.current, { scale: 1, y: 0 }, { scale: tier.mountains.scale, y: `${tier.mountains.y}vh` }, 0);
        tl.fromTo(waterDepthRef.current, { scale: 1, y: 0 }, { scale: tier.water.scale, y: `${tier.water.y}vh` }, 0);
        tl.fromTo(floatingDepthRef.current, { scale: 1, y: 0 }, { scale: tier.floating.scale, y: `${tier.floating.y}vh` }, 0);
        tl.fromTo(foregroundDepthRef.current, { scale: 1, y: 0 }, { scale: tier.foreground.scale, y: `${tier.foreground.y}vh` }, 0);

        // Foreground left/right halves drift apart — the "passing between
        // the desk objects" read. Both halves are the same source image,
        // each masked to one side via CSS clip-path.
        if (tier.foreground.outwardPx) {
          tl.fromTo(foregroundLeftRef.current, { x: 0 }, { x: -tier.foreground.outwardPx }, 0);
          tl.fromTo(foregroundRightRef.current, { x: 0 }, { x: tier.foreground.outwardPx }, 0);
        }

        // Desktop-only subtle mouse parallax, on its own nested transform
        // layer so it never fights the scroll-driven scale/translateY tween
        // running on the parent depth layer above.
        if (canHoverPrecisely && "mousePx" in tier.mountains) {
          const desktopTier = tier as typeof MOTION.desktop;
          const quickTos = {
            mountains: { x: gsap.quickTo(mountainsMouseRef.current, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(mountainsMouseRef.current, "y", { duration: 0.6, ease: "power3" }) },
            water: { x: gsap.quickTo(waterMouseRef.current, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(waterMouseRef.current, "y", { duration: 0.6, ease: "power3" }) },
            floating: { x: gsap.quickTo(floatingMouseRef.current, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(floatingMouseRef.current, "y", { duration: 0.6, ease: "power3" }) },
            foreground: { x: gsap.quickTo(foregroundMouseRef.current, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(foregroundMouseRef.current, "y", { duration: 0.6, ease: "power3" }) },
          };

          const handlePointerMove = (event: PointerEvent) => {
            const rect = section.getBoundingClientRect();
            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;

            quickTos.mountains.x(nx * desktopTier.mountains.mousePx);
            quickTos.mountains.y(ny * desktopTier.mountains.mousePx);
            quickTos.water.x(nx * desktopTier.water.mousePx);
            quickTos.water.y(ny * desktopTier.water.mousePx);
            quickTos.floating.x(nx * desktopTier.floating.mousePx);
            quickTos.floating.y(ny * desktopTier.floating.mousePx);
            quickTos.foreground.x(nx * desktopTier.foreground.mousePx);
            quickTos.foreground.y(ny * desktopTier.foreground.mousePx);
          };

          section.addEventListener("pointermove", handlePointerMove);
          return () => section.removeEventListener("pointermove", handlePointerMove);
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="hs-cine" ref={sectionRef} aria-hidden="true">
      <div className="hs-cine__sticky">
        <div className="hs-cine__scene">
          <div className="hs-cine__layer hs-cine__layer--mountains">
            <div className="hs-cine__align">
              <div className="hs-cine__depth" ref={mountainsDepthRef}>
                <div className="hs-cine__mouse" ref={mountainsMouseRef}>
                  <img
                    src="/images/programs/highschool-layer-1-mountains.png"
                    alt=""
                    className="hs-cine__img"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hs-cine__layer hs-cine__layer--water">
            <div className="hs-cine__align">
              <div className="hs-cine__depth" ref={waterDepthRef}>
                <div className="hs-cine__mouse" ref={waterMouseRef}>
                  <img
                    src="/images/programs/highschool-layer-2-water-mist.png"
                    alt=""
                    className="hs-cine__img"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hs-cine__layer hs-cine__layer--floating">
            <div className="hs-cine__align">
              <div className="hs-cine__depth" ref={floatingDepthRef}>
                <div className="hs-cine__mouse" ref={floatingMouseRef}>
                  <img
                    src="/images/programs/highschool-layer-3-floating-objects.png"
                    alt=""
                    className="hs-cine__img"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hs-cine__layer hs-cine__layer--foreground">
            <div className="hs-cine__align">
              <div className="hs-cine__depth" ref={foregroundDepthRef}>
                <div className="hs-cine__mouse" ref={foregroundMouseRef}>
                  <div className="hs-cine__fg-half hs-cine__fg-half--left" ref={foregroundLeftRef}>
                    <img
                      src="/images/programs/highschool-layer-4-foreground.png"
                      alt=""
                      className="hs-cine__img"
                      draggable={false}
                    />
                  </div>
                  <div className="hs-cine__fg-half hs-cine__fg-half--right" ref={foregroundRightRef}>
                    <img
                      src="/images/programs/highschool-layer-4-foreground.png"
                      alt=""
                      className="hs-cine__img"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HighSchoolCinematicScene;
