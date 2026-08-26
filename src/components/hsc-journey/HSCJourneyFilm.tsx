import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./hsc-journey-film.css";

gsap.registerPlugin(ScrollTrigger);

const A = "/hsc-journey";
const frames = Array.from(
  { length: 9 },
  (_, index) => `${A}/frames/frame-${String(index + 1).padStart(2, "0")}.png`,
);

const copy = [
  {
    label: "01 · START WITH THEM",
    heading: ["Every HSC journey", "starts somewhere different."],
    body: "We begin by understanding their subjects, their goals, their confidence, and where they need the most support.",
  },
  {
    label: "02 · BUILD THE PLAN",
    heading: ["We turn the year ahead", "into something they can manage."],
    body: "A clear plan for school, assessments, revision, Trials and the HSC — so every week moves them closer to their goal.",
  },
  {
    label: "03 · TEACH FOR THE MARK",
    heading: ["Knowing it", "isn’t enough."],
    body: "We teach students how to turn what they know into the responses, working and exam technique that earn marks.",
  },
  {
    label: "04 · WE’RE THERE",
    heading: ["Support shouldn’t disappear", "when class ends."],
    body: "We’re here for the questions, the worries, the setbacks and the breakthroughs.",
  },
  {
    label: "05 · FEEDBACK → ACTION",
    heading: ["Every mistake tells us", "what to work on next."],
    body: "Understand. Practise. Feedback. Improve. We close the gap, not just mark the work.",
  },
  {
    label: "06 · PRACTISE THE PRESSURE",
    heading: ["Practice before", "it counts."],
    body: "Timed work, past papers and exam conditions prepare them for the pressure of Trials and the HSC.",
  },
  {
    label: "07 · HSC",
    heading: ["By the time HSC arrives,", "they’ve done this before."],
    body: "They’ve practised the timing. The technique. The decisions. Now it’s time to trust the preparation.",
  },
  {
    label: "08 · MORE THAN A MARK",
    heading: ["We prepare for more", "than an exam."],
    body: "Independence. Confidence. Discipline. Resilience. The things they’ll need long after the final exam.",
  },
  {
    label: "09 · BEYOND HSC",
    heading: ["More choices for", "whatever comes next."],
    body: "University. A career. A different path entirely. Our job is to help them leave Year 12 ready to choose.",
  },
] as const;

function StoryCopy() {
  return (
    <div className="hscjf-copy-track" aria-live="off">
      {copy.map(({ label, heading, body }, index) => (
        <div className={`hscjf-copy hscjf-copy-${index + 1}`} key={label}>
          <span data-copy-part="label">{label}</span>
          <h2 data-copy-part="heading">
            {heading.map((line, lineIndex) => (
              <span className="hscjf-heading-line" key={line}>
                {line}
                {lineIndex < heading.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <p data-copy-part="body">{body}</p>
        </div>
      ))}
    </div>
  );
}

function ReducedJourney() {
  return (
    <div className="hscjf-reduced">
      {copy.map(({ label, heading, body }, index) => (
        <section key={label}>
          <img src={frames[index]} alt="" />
          <div>
            <span>{label}</span>
            <h2>{heading.join(" ")}</h2>
            <p>{body}</p>
          </div>
        </section>
      ))}
    </div>
  );
}

export default function HSCJourneyFilm() {
  const rootRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    let cancelled = false;
    Promise.all(
      frames.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.src = src;
            image.decode?.().then(resolve).catch(resolve);
            image.onload = () => resolve();
            image.onerror = () => resolve();
          }),
      ),
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready || !rootRef.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const root = rootRef.current!;
        const scenes = gsap.utils.toArray<HTMLElement>(
          ".hscjf-scene",
          root,
        );
        const copies = gsap.utils.toArray<HTMLElement>(".hscjf-copy", root);
        const copyParts = {
          label: copies.map((item) =>
            item.querySelector<HTMLElement>('[data-copy-part="label"]')!,
          ),
          heading: copies.map((item) =>
            item.querySelector<HTMLElement>('[data-copy-part="heading"]')!,
          ),
          body: copies.map((item) =>
            item.querySelector<HTMLElement>('[data-copy-part="body"]')!,
          ),
        };
        const surface = (name: string) =>
          root.querySelector<Element>(`[data-transition="${name}"]`)!;
        const mobile = window.matchMedia("(max-width: 768px)").matches;
        const cameraScale = (desktop: number) =>
          mobile ? 1 + (desktop - 1) * 0.58 : desktop;

        gsap.set(scenes, {
          autoAlpha: 0,
          visibility: "hidden",
          scale: 1,
          xPercent: 0,
          yPercent: 0,
        });
        gsap.set(scenes[0], { autoAlpha: 1, visibility: "visible" });
        gsap.set(copies, { autoAlpha: 1, y: 0 });
        gsap.set(
          [...copyParts.label, ...copyParts.heading, ...copyParts.body],
          { autoAlpha: 0, y: 16 },
        );
        gsap.set("[data-transition]", {
          autoAlpha: 0,
          visibility: "hidden",
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          scale: 1,
          clipPath: "none",
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            pin: ".hscjf-viewport",
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const showScene = (
          timeline: gsap.core.Timeline,
          index: number,
          at: number,
        ) => {
          timeline.set(
            scenes,
            { autoAlpha: 0, visibility: "hidden" },
            at,
          );
          timeline.set(
            scenes[index],
            { autoAlpha: 1, visibility: "visible" },
            at,
          );
        };

        const showCopy = (
          timeline: gsap.core.Timeline,
          index: number,
          enterAt: number,
          leaveAt?: number,
        ) => {
          timeline
            .to(
              copyParts.label[index],
              { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" },
              enterAt,
            )
            .to(
              copyParts.heading[index],
              { autoAlpha: 1, y: 0, duration: 0.58, ease: "power3.out" },
              enterAt + 0.3,
            )
            .to(
              copyParts.body[index],
              { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" },
              enterAt + 0.68,
            );
          if (leaveAt !== undefined) {
            timeline.to(
              copies[index],
              { autoAlpha: 0, y: -16, duration: 0.4, ease: "power2.in" },
              leaveAt,
            );
          }
        };

        const sceneLabels = [
          "scene-1",
          "scene-2",
          "scene-3",
          "scene-4",
          "scene-5",
          "scene-6",
          "scene-7",
          "scene-8",
          "scene-9",
        ] as const;
        sceneLabels.forEach((label, index) => {
          const at = index * 10;
          timeline.addLabel(label, at);
          showCopy(
            timeline,
            index,
            at + 0.65,
            index < copy.length - 1 ? index * 10 + 6.1 : undefined,
          );
        });

        const paper = surface("paper-cover");
        const cream = surface("cream-cover");
        const pigment = surface("pigment-reveal");
        const cloud = surface("cloud-cover");

        timeline
          .addLabel("transition-1-2", 7.2)
          .to(
            scenes[0],
            {
              scale: cameraScale(1.075),
              yPercent: 4,
              duration: 2.8,
              ease: "power1.inOut",
            },
            7.2,
          )
          .set(
            paper,
            {
              autoAlpha: 1,
              visibility: "visible",
              xPercent: -8,
              yPercent: 78,
              rotation: -5,
              scale: 0.48,
            },
            7.25,
          )
          .to(
            paper,
            {
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              scale: 1.2,
              duration: 1.45,
              ease: "power2.in",
            },
            7.3,
          );
        showScene(timeline, 1, 8.78);
        timeline
          .to(
            paper,
            {
              yPercent: -92,
              scale: 1.28,
              duration: 1.2,
              ease: "power2.out",
            },
            8.8,
          )
          .set(paper, { autoAlpha: 0, visibility: "hidden" }, 10)
          .addLabel("transition-2-3", 17.1)
          .to(
            scenes[1],
            {
              scale: cameraScale(1.09),
              duration: 2.7,
              ease: "power1.inOut",
            },
            17.1,
          )
          .set(
            paper,
            {
              autoAlpha: 1,
              visibility: "visible",
              xPercent: 68,
              yPercent: -62,
              rotation: 12,
              scale: 0.42,
            },
            17.15,
          )
          .to(
            paper,
            {
              xPercent: 0,
              yPercent: 0,
              rotation: -5,
              scale: 1.25,
              duration: 1.35,
              ease: "power2.in",
            },
            17.2,
          );
        showScene(timeline, 2, 18.58);
        timeline
          .to(
            paper,
            {
              xPercent: -72,
              yPercent: 66,
              rotation: -13,
              scale: 1.32,
              duration: 1.4,
              ease: "power2.out",
            },
            18.6,
          )
          .set(paper, { autoAlpha: 0, visibility: "hidden" }, 20)
          .addLabel("transition-3-4", 26.8)
          .to(
            scenes[2],
            {
              scale: cameraScale(1.16),
              xPercent: -5,
              yPercent: -3,
              duration: 2,
              ease: "power2.in",
            },
            26.8,
          )
          .set(
            cream,
            { autoAlpha: 1, visibility: "visible", scale: 0.06 },
            27,
          )
          .to(
            cream,
            { scale: 1.25, duration: 1.25, ease: "power2.in" },
            27.05,
          );
        showScene(timeline, 3, 28.32);
        timeline
          .set(cream, { clipPath: "inset(0% 0% 0% 0%)" }, 28.33)
          .to(
            cream,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              duration: 1.65,
              ease: "power2.out",
            },
            28.35,
          )
          .set(
            cream,
            { autoAlpha: 0, visibility: "hidden", clipPath: "none" },
            30,
          )
          .addLabel("transition-4-5", 37.1)
          .to(
            scenes[3],
            {
              xPercent: -8,
              scale: cameraScale(1.045),
              duration: 2.65,
              ease: "power1.inOut",
            },
            37.2,
          )
          .set(
            scenes[4],
            {
              autoAlpha: 1,
              visibility: "visible",
              xPercent: 7,
              scale: cameraScale(1.045),
            },
            38.15,
          )
          .set(scenes[3], { autoAlpha: 0, visibility: "hidden" }, 38.2)
          .to(
            scenes[4],
            { xPercent: 0, duration: 1.7, ease: "power1.inOut" },
            38.2,
          )
          .addLabel("transition-5-6", 47.05)
          .to(
            scenes[4],
            {
              scale: cameraScale(1.18),
              xPercent: 3,
              yPercent: 5,
              duration: 2,
              ease: "power2.in",
            },
            47.05,
          )
          .set(
            paper,
            {
              autoAlpha: 1,
              visibility: "visible",
              xPercent: 21,
              yPercent: 28,
              rotation: 7,
              scale: 0.38,
            },
            47.15,
          )
          .to(
            paper,
            {
              xPercent: 0,
              yPercent: 0,
              rotation: 1,
              scale: 1.22,
              duration: 1.3,
              ease: "power2.in",
            },
            47.2,
          );
        showScene(timeline, 5, 48.52);
        timeline
          .to(
            paper,
            {
              yPercent: 61,
              rotation: 0,
              scale: 0.48,
              duration: 1.45,
              ease: "power2.out",
            },
            48.55,
          )
          .set(paper, { autoAlpha: 0, visibility: "hidden" }, 50)
          .addLabel("transition-6-7", 56.7)
          .to(
            scenes[5],
            {
              scale: cameraScale(1.14),
              yPercent: -3,
              transformOrigin: "50% 62%",
              duration: 1.5,
              ease: "power1.inOut",
            },
            56.7,
          )
          .to(
            scenes[5],
            {
              scale: cameraScale(1.3),
              yPercent: -15,
              rotationX: 3,
              duration: 1.1,
              ease: "power2.in",
            },
            58.1,
          )
          .set(
            paper,
            {
              autoAlpha: 1,
              visibility: "visible",
              xPercent: 0,
              yPercent: 48,
              rotation: 0,
              scale: 0.42,
            },
            58.05,
          )
          .to(
            paper,
            {
              yPercent: 0,
              scale: 1.22,
              duration: 0.85,
              ease: "power2.in",
            },
            58.1,
          );
        showScene(timeline, 6, 58.98);
        timeline
          .to(
            paper,
            {
              scale: 1.42,
              autoAlpha: 0,
              duration: 1,
              ease: "power2.out",
            },
            59,
          )
          .set(paper, { visibility: "hidden" }, 60)
          .addLabel("transition-7-8", 66.8)
          .to(
            scenes[6],
            {
              scale: cameraScale(1.34),
              xPercent: -3,
              yPercent: 5,
              duration: 1.8,
              ease: "power2.in",
            },
            66.8,
          )
          .set(
            pigment,
            {
              autoAlpha: 1,
              visibility: "visible",
              scale: 0.05,
              transformOrigin: "18% 82%",
            },
            67.15,
          )
          .to(
            pigment,
            { scale: 1.35, duration: 1.55, ease: "power2.in" },
            67.2,
          );
        showScene(timeline, 7, 68.78);
        timeline
          .to(
            pigment,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              duration: 1.2,
              ease: "power2.out",
            },
            68.8,
          )
          .set(
            pigment,
            { autoAlpha: 0, visibility: "hidden", clipPath: "none" },
            70,
          )
          .addLabel("transition-8-9", 76.65)
          .to(
            scenes[7],
            {
              scale: cameraScale(1.2),
              yPercent: 9,
              duration: 1.7,
              ease: "power2.in",
            },
            76.65,
          )
          .set(
            cloud,
            {
              autoAlpha: 1,
              visibility: "visible",
              scale: 0.1,
              transformOrigin: "52% 35%",
            },
            77,
          )
          .to(
            cloud,
            { scale: 1.36, duration: 1.65, ease: "power2.in" },
            77.05,
          )
          .set(
            scenes[8],
            { scale: cameraScale(1.1), yPercent: -3 },
            78.68,
          );
        showScene(timeline, 8, 78.7);
        timeline
          .set(cloud, { clipPath: "inset(0% 0% 0% 0%)" }, 78.7)
          .to(
            cloud,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              duration: 1.3,
              ease: "power2.out",
            },
            78.72,
          )
          .set(
            cloud,
            { autoAlpha: 0, visibility: "hidden", clipPath: "none" },
            80,
          )
          .to(
            scenes[8],
            {
              scale: 1,
              yPercent: 0,
              duration: 8.5,
              ease: "power1.inOut",
            },
            80,
          );

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, rootRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, [ready]);

  return (
    <>
      <section
        ref={rootRef}
        className={`hscjf ${ready ? "is-ready" : ""}`}
        aria-label="The HSC journey from Year 11 to what comes next"
        aria-busy={!ready}
      >
        <div className="hscjf-loading" aria-hidden="true">
          Preparing the journey…
        </div>
        <div className="hscjf-viewport">
          <div className="hscjf-stage">
            <div className="hscjf-scenes" aria-hidden="true">
              {frames.map((src, index) => (
                <div className="hscjf-scene" data-scene={index + 1} key={src}>
                  <img
                    className="hscjf-frame"
                    src={src}
                    alt=""
                    draggable={false}
                  />
                </div>
              ))}
            </div>
            <div className="hscjf-transition-layer" aria-hidden="true">
              <div
                className="hscjf-paper-cover"
                data-transition="paper-cover"
              />
              <div
                className="hscjf-cream-cover"
                data-transition="cream-cover"
              />
              <svg
                className="hscjf-pigment-reveal"
                data-transition="pigment-reveal"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M-10 88 C12 62 21 92 43 67 C62 46 73 66 110 28 L110 110 L-10 110 Z" />
              </svg>
              <svg
                className="hscjf-cloud-cover"
                data-transition="cloud-cover"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M-15 55 C-2 31 15 48 24 31 C37 8 53 43 65 23 C78 5 94 35 115 17 L115 115 L-15 115 Z" />
              </svg>
            </div>
          </div>
          <StoryCopy />
        </div>
        <ReducedJourney />
      </section>
      <div className="hscjf-exit">
        <p>The journey continues</p>
        <h2>So how do we help them get there?</h2>
      </div>
    </>
  );
}
