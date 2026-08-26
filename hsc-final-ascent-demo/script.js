(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const stage = document.querySelector(".sticky-stage");
  const camera = document.querySelector(".camera");
  const drift = document.querySelector(".camera-drift");
  const background = document.querySelector(".background");
  const midground = document.querySelector(".midground");
  const foreground = document.querySelector(".foreground");
  const desk = document.querySelector(".desk-scene");
  const scrollCue = document.querySelector(".scroll-cue");
  const progress = document.querySelector(".progress span");
  const routes = gsap.utils.toArray("[data-route]");
  const markers = gsap.utils.toArray("[data-marker]");
  const messages = gsap.utils.toArray("[data-message]");
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const mobile = window.matchMedia("(max-width: 700px)").matches;

  gsap.set(messages, { autoAlpha: 0, y: 20, scale: 0.992 });
  gsap.set(messages[0], { autoAlpha: 1, y: 0, scale: 1 });
  gsap.set(markers, { autoAlpha: 0, y: 14, scale: 0.82 });
  routes.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  });

  const showMessage = (timeline, target, enter, hold) => {
    timeline
      .to(target, { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out" }, enter)
      .to(target, { autoAlpha: 0, y: -16, scale: 0.995, duration: 0.8, ease: "power2.in" }, enter + hold);
  };

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".final-ascent",
      start: "top top",
      end: "bottom bottom",
      pin: stage,
      scrub: 1.15,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
    },
  });

  tl.addLabel("starting-point", 0)
    .to(camera, { scale: mobile ? 1.045 : 1.08, duration: 12, ease: "power1.inOut" }, 0)
    .to(scrollCue, { autoAlpha: 0, duration: 2 }, 6)
    .to(messages[0], { autoAlpha: 0, y: -18, duration: 2, ease: "power2.in" }, 10)

    .addLabel("leave-desk", 12)
    .to(camera, {
      x: mobile ? "-3vw" : "-11vw",
      y: mobile ? "-12vh" : "-16vh",
      scale: mobile ? 1.18 : 1.3,
      rotation: -0.35,
      duration: 14,
      ease: "power2.inOut",
    }, 12)
    .to(desk, { x: mobile ? "-7vw" : "-20vw", y: "62vh", scale: 1.1, duration: 14, ease: "power2.in" }, 12)
    .to(foreground, { x: mobile ? "-1vw" : "-5vw", y: "6vh", duration: 14 }, 12)
    .to(midground, { x: mobile ? "-.5vw" : "-2vw", y: "2vh", duration: 14 }, 12)
    .to(background, { x: mobile ? "-.2vw" : "-.8vw", y: ".7vh", duration: 14 }, 12)

    .addLabel("enter-map", 26)
    .to(camera, {
      x: mobile ? "-18vw" : "-41vw",
      y: mobile ? "-25vh" : "-30vh",
      scale: mobile ? 1.42 : 1.72,
      rotation: 0.7,
      duration: 11,
      ease: "power3.in",
    }, 26)
    .to(camera, {
      x: mobile ? "-12vw" : "-32vw",
      y: mobile ? "-20vh" : "-24vh",
      scale: mobile ? 1.2 : 1.3,
      rotation: 0,
      duration: 5,
      ease: "power2.out",
    }, 37)

    .addLabel("route-reveal", 42);

  showMessage(tl, messages[1], 42.8, 11.2);

  tl.addLabel("support-routes", 57)
    .to(routes[0], { strokeDashoffset: 0, duration: 4.2, ease: "power1.inOut" }, 57)
    .to(markers[0], { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, 59.6);
  showMessage(tl, messages[2], 58.2, 3.6);

  tl.to(routes[1], { strokeDashoffset: 0, duration: 4.2, ease: "power1.inOut" }, 61.6)
    .to(markers[1], { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, 64.1);
  showMessage(tl, messages[3], 62.5, 3.5);

  tl.to(routes[2], { strokeDashoffset: 0, duration: 4.2, ease: "power1.inOut" }, 66.2)
    .to(markers[2], { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, 68.7);
  showMessage(tl, messages[4], 67.1, 3.5);

  tl.to(routes[3], { strokeDashoffset: 0, duration: 4.2, ease: "power1.inOut" }, 70.8)
    .to(markers[3], { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, 73.3);
  showMessage(tl, messages[5], 71.7, 3.7);

  tl.addLabel("explore-choice", 76)
    .to(camera, {
      x: mobile ? "-21vw" : "-48vw",
      y: mobile ? "-31vh" : "-36vh",
      scale: mobile ? 1.28 : 1.44,
      rotation: -0.8,
      duration: 7,
      ease: "power2.inOut",
    }, 76)
    .to(camera, {
      x: mobile ? "-8vw" : "-25vw",
      y: mobile ? "-17vh" : "-18vh",
      scale: mobile ? 1.11 : 1.2,
      rotation: 0.45,
      duration: 7,
      ease: "power2.inOut",
    }, 83)

    .addLabel("big-reveal", 90)
    .to(camera, {
      x: mobile ? "-8vw" : "-27vw",
      y: mobile ? "-9vh" : "-10vh",
      scale: mobile ? 0.93 : 0.82,
      rotation: 0,
      duration: 10,
      ease: "power2.inOut",
    }, 90)
    .to(routes, { opacity: 0.38, duration: 3, ease: "power1.out" }, 90)
    .to(markers, { opacity: 0.62, duration: 3, ease: "power1.out" }, 90)
    .to(messages[6], { autoAlpha: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" }, 92)
    .to(".destination-flag", { scale: 1.08, transformOrigin: "50% 100%", duration: 3, ease: "power1.inOut" }, 94);

  if (!coarsePointer) {
    const driftX = gsap.quickTo(drift, "x", { duration: 1.2, ease: "power3.out" });
    const driftY = gsap.quickTo(drift, "y", { duration: 1.2, ease: "power3.out" });
    const bgX = gsap.quickTo(background, "xPercent", { duration: 1.5, ease: "power3.out" });
    const midX = gsap.quickTo(midground, "xPercent", { duration: 1.4, ease: "power3.out" });
    const foreX = gsap.quickTo(foreground, "xPercent", { duration: 1.3, ease: "power3.out" });

    window.addEventListener("pointermove", (event) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      driftX(nx * 10);
      driftY(ny * 7);
      bgX(nx * 0.12);
      midX(nx * 0.3);
      foreX(nx * 0.6);
    }, { passive: true });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
})();
