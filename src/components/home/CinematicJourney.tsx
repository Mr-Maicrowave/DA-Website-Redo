import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Send, Sprout, TrendingUp } from "lucide-react";
import "./CinematicJourney.css";

gsap.registerPlugin(ScrollTrigger);

/** Builds the CSS custom properties that drive `.cj-float`'s idle motion. */
function floatVars(y: string, r: string, duration: string, delay = "0s"): CSSProperties {
  return {
    "--cj-float-y": y,
    "--cj-float-r": r,
    "--cj-float-duration": duration,
    "--cj-float-delay": delay,
  } as CSSProperties;
}

/**
 * CinematicJourney
 * -----------------
 * Isolated, reusable scroll-driven 3D parallax section.
 *
 * Mechanic: a sticky viewport + preserve-3d scene with three depth layers
 * (back / mid / front). On scroll, each layer travels along Z (and a touch
 * of X/Y) at a different rate so the page feels like it is moving forward
 * through the scene rather than just scrolling past it. Individual
 * decorative items inside each layer get their own small extra drift so no
 * two objects move identically.
 *
 * Content (label / heading / supporting line) stays centred and readable;
 * it only settles into a slightly smaller, softer state as the camera
 * moves, then reveals the supporting line afterwards.
 *
 * Respects prefers-reduced-motion (static composition, no scroll-linked
 * movement) and reduces layer count / depth / blur on small screens.
 */
export function CinematicJourney() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const backLayerRef = useRef<HTMLDivElement | null>(null);
  const midLayerRef = useRef<HTMLDivElement | null>(null);
  const frontLayerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerItem = (key: string) => (el: HTMLElement | null) => {
    if (el) itemRefs.current.set(key, el);
    else itemRefs.current.delete(key);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        // isDesktop/isMobile are a complementary pair (exactly one is
        // always true) so this callback is guaranteed to fire on mount —
        // gsap.matchMedia() only invokes the handler once at least one
        // registered query currently matches, and reduceMotion alone can
        // legitimately be false with nothing else true.
        isDesktop: "(min-width: 820px)",
        isMobile: "(max-width: 819px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reduceMotion, isMobile } = context.conditions as {
          reduceMotion: boolean;
          isMobile: boolean;
        };

        // Static, non-scroll-linked composition for reduced motion.
        if (reduceMotion) {
          gsap.set(backLayerRef.current, { z: -260 });
          gsap.set(midLayerRef.current, { z: -50 });
          gsap.set(frontLayerRef.current, { z: 120 });
          gsap.set(contentRef.current, { scale: 1, opacity: 1 });
          gsap.set(subRef.current, { opacity: 1, y: 0 });
          gsap.set(cueRef.current, { opacity: 1 });
          return;
        }

        // Scale down travel distances on small screens so nothing feels
        // like it is flying off-screen on a cramped viewport.
        const depth = isMobile ? 0.42 : 1;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        // BACKGROUND — farthest, subtle, slow.
        tl.fromTo(
          backLayerRef.current,
          { z: -500 * depth, x: 0, scale: 1 },
          { z: -150 * depth, x: 14 * depth, scale: 1.06 },
          0
        );

        // MIDGROUND — clearer, medium speed, gentle pan.
        tl.fromTo(
          midLayerRef.current,
          { z: -250 * depth, x: 0, scale: 1 },
          { z: 100 * depth, x: -16 * depth, scale: 1.03 },
          0
        );

        // FOREGROUND — closest, largest, fastest, strongest parallax.
        tl.fromTo(
          frontLayerRef.current,
          { z: 0, x: 0, scale: 1 },
          { z: 400 * depth, x: -20 * depth, scale: 1.16 },
          0
        );

        // Heading settles slightly as the camera pushes through the scene.
        tl.fromTo(
          contentRef.current,
          { scale: 1, opacity: 1, y: 0 },
          { scale: 0.9, opacity: 0.75, y: -10 * depth },
          0
        );

        // Scroll cue fades out early — it has done its job by then.
        tl.fromTo(cueRef.current, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0);

        // Supporting line reveals afterwards, once the heading has settled.
        tl.fromTo(
          subRef.current,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.55
        );

        // Each decorative item gets its own small extra drift/rotation on
        // top of its layer's macro movement, so nothing moves identically.
        itemRefs.current.forEach((el) => {
          const driftX = parseFloat(el.dataset.driftX || "0") * depth;
          const driftY = parseFloat(el.dataset.driftY || "0") * depth;
          const rotate = parseFloat(el.dataset.rotate || "0");
          const hasScale = el.dataset.scaleTo !== undefined;
          const scaleTo = hasScale ? parseFloat(el.dataset.scaleTo as string) : 1;

          tl.fromTo(
            el,
            { x: 0, y: 0, rotate: 0, scale: 1 },
            { x: driftX, y: driftY, rotate, scale: hasScale ? scaleTo : 1 },
            0
          );
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      className="cinematic-journey"
      ref={sectionRef}
      aria-label="The DA Tuition learning journey"
    >
      <div className="cinematic-journey__sticky">
        <div className="cinematic-journey__scene">
          {/* BACKGROUND LAYER — distant, subtle, blurred, slow */}
          <div
            className="cinematic-journey__layer cinematic-journey__layer--back"
            ref={backLayerRef}
            aria-hidden="true"
          >
            <div className="cj-glow" />
            <div className="cj-mountains" />
            <span className="cj-star cj-star--1" ref={registerItem("star-1")} data-drift-y="-16">
              ✦
            </span>
            <span className="cj-star cj-star--2" ref={registerItem("star-2")} data-drift-y="-10" data-drift-x="6">
              ✦
            </span>
            <span className="cj-star cj-star--3" ref={registerItem("star-3")} data-drift-y="-12">
              ✦
            </span>
            <span className="cj-star cj-star--4" ref={registerItem("star-4")} data-drift-y="-14" data-drift-x="-6">
              ✦
            </span>
            <span className="cj-star cj-star--5" ref={registerItem("star-5")} data-drift-y="-8">
              ✦
            </span>
          </div>

          {/* MIDGROUND LAYER — clearer, medium speed */}
          <div
            className="cinematic-journey__layer cinematic-journey__layer--mid"
            ref={midLayerRef}
            aria-hidden="true"
          >
            <span className="cj-thread cj-thread--foundations" />
            <span className="cj-thread cj-thread--habits" />
            <span className="cj-thread cj-thread--growth" />
            <span className="cj-thread cj-thread--confidence" />

            <div
              className="cj-chapter cj-chapter--foundations"
              ref={registerItem("chapter-foundations")}
              data-drift-x="-14"
              data-drift-y="-22"
              data-rotate="-2"
            >
              <span className="cj-float" style={floatVars("-9px", "1.6deg", "6.4s")}>
                <BookOpen className="cj-chapter__icon" size={20} strokeWidth={1.6} />
                <span className="cj-chapter__blob" />
                <span className="cj-chapter__number">01</span>
                <span className="cj-chapter__label">Foundations</span>
              </span>
            </div>

            <div
              className="cj-chapter cj-chapter--habits"
              ref={registerItem("chapter-habits")}
              data-drift-x="-10"
              data-drift-y="18"
              data-rotate="2"
            >
              <span className="cj-float" style={floatVars("-7px", "-1.4deg", "7.2s", "-2s")}>
                <Sprout className="cj-chapter__icon" size={20} strokeWidth={1.6} />
                <span className="cj-chapter__blob" />
                <span className="cj-chapter__number">02</span>
                <span className="cj-chapter__label">Habits</span>
              </span>
            </div>

            <div
              className="cj-chapter cj-chapter--growth"
              ref={registerItem("chapter-growth")}
              data-drift-x="16"
              data-drift-y="-16"
              data-rotate="2"
            >
              <span className="cj-float" style={floatVars("-8px", "1.8deg", "5.6s", "-1s")}>
                <Send className="cj-chapter__icon" size={20} strokeWidth={1.6} />
                <span className="cj-chapter__blob" />
                <span className="cj-chapter__number">03</span>
                <span className="cj-chapter__label">Growth</span>
              </span>
            </div>

            <div
              className="cj-chapter cj-chapter--confidence"
              ref={registerItem("chapter-confidence")}
              data-drift-x="14"
              data-drift-y="16"
              data-rotate="-2"
            >
              <span className="cj-float" style={floatVars("-9px", "-1.6deg", "6.8s", "-3.4s")}>
                <TrendingUp className="cj-chapter__icon" size={20} strokeWidth={1.6} />
                <span className="cj-chapter__blob" />
                <span className="cj-chapter__number">04</span>
                <span className="cj-chapter__label">Confidence</span>
              </span>
            </div>
          </div>

          {/* FOREGROUND LAYER — large, cropped, closest, fastest */}
          <div
            className="cinematic-journey__layer cinematic-journey__layer--front"
            ref={frontLayerRef}
            aria-hidden="true"
          >
            <div
              className="cj-pencils"
              ref={registerItem("pencils")}
              data-drift-x="-14"
              data-drift-y="20"
              data-rotate="-2"
              data-scale-to="1.08"
            >
              <span className="cj-pencil cj-pencil--1" />
              <span className="cj-pencil cj-pencil--2" />
              <span className="cj-pencil cj-pencil--3" />
            </div>

            <div
              className="cj-book-pages"
              ref={registerItem("book-pages")}
              data-drift-x="16"
              data-drift-y="18"
              data-rotate="1"
              data-scale-to="1.1"
            >
              <span className="cj-book-page cj-book-page--left" />
              <span className="cj-book-page cj-book-page--right" />
              <span className="cj-book-spine" />
            </div>

            <div
              className="cj-paper-plane"
              ref={registerItem("paper-plane")}
              data-drift-x="-26"
              data-drift-y="24"
              data-rotate="-8"
              data-scale-to="1.2"
            >
              <span className="cj-float" style={floatVars("-10px", "2deg", "5.2s", "-1.6s")}>
                <Send size={64} strokeWidth={1.3} />
              </span>
            </div>
          </div>

          {/* MAIN CONTENT — stays centred and readable throughout */}
          <div className="cinematic-journey__content" ref={contentRef}>
            <span className="cinematic-journey__mark" aria-hidden="true">
              ✦
            </span>

            <p className="cinematic-journey__label">DA Tuition</p>

            <h2 className="cinematic-journey__heading">
              Learning is <em>a&nbsp;journey.</em>
            </h2>

            <p className="cinematic-journey__sub" ref={subRef}>
              Every step builds confidence for what comes next.
            </p>
          </div>

          <div className="cinematic-journey__cue" ref={cueRef} aria-hidden="true">
            <span>Scroll to explore</span>
            <span className="cinematic-journey__cue-stem" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CinematicJourney;
