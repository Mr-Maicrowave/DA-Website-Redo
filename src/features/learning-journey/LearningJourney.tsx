import {
  type MouseEvent as ReactMouseEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AcademicLevelEncounter } from "./AcademicLevelEncounter";
import { ConfidenceEncounter } from "./ConfidenceEncounter";
import { LearningHabitsEncounter } from "./LearningHabitsEncounter";
import { MotivationEncounter } from "./MotivationEncounter";
import { GoalsEncounter } from "./GoalsEncounter";
import { JourneyCompletion } from "./JourneyCompletion";
import {
  AssessmentJourneyProvider,
  useAssessmentJourney,
} from "./AssessmentJourneyContext";
import { JourneyWorld } from "./JourneyWorld";
import { RecommendationJourney, type RecommendationRevealPhase } from "./RecommendationJourney";
import { RecommendationResult } from "./RecommendationResult";
import { WalkingCharacter } from "./WalkingCharacter";
import { journeyAssets, walkingFrames } from "./journeyAssets";
import { calculateLearningRecommendation } from "./recommendationScoring";
import { isCompleteAssessment } from "./recommendationTypes";
import { useEncounterSelection } from "./useEncounterSelection";
import "./learning-journey.css";

gsap.registerPlugin(ScrollTrigger);

const NO_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const JOURNEY_DEPARTURE_PROGRESS = 0.12;
const GATE_SETTLE_EPSILON = 0.002;
const ACADEMIC_HOLD_PROGRESS = 0.32;
const CONFIDENCE_HOLD_PROGRESS = 0.52;
const LEARNING_HABITS_HOLD_PROGRESS = 0.72;
const MOTIVATION_HOLD_PROGRESS = 0.85;
const GOALS_HOLD_PROGRESS = 0.96;

const LearningJourneyExperience = () => {
  const {
    answers,
    setAcademicLevelAnswer,
    setConfidenceAnswer,
    setLearningHabitsAnswer,
    setMotivationAnswer,
    setGoalsAnswer,
    resultRevealed,
    setResultRevealed,
  } = useAssessmentJourney();
  const [journeyComplete, setJourneyComplete] = useState(() => answers.goals !== null);
  const [revealPhase, setRevealPhase] = useState<RecommendationRevealPhase>(
    () => resultRevealed ? "editorial" : "hidden",
  );
  const recommendation = useMemo(
    () => isCompleteAssessment(answers) ? calculateLearningRecommendation(answers) : null,
    [answers],
  );
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const walkFramesRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const revealTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const shouldAnimateRevealRef = useRef(false);
  const answersRef = useRef({
    academicLevel: answers.academicLevel,
    confidence: answers.confidence,
    learningHabits: answers.learningHabits,
    motivation: answers.motivation,
    goals: answers.goals,
  });

  const continueFromEncounter = (progress: number) => {
    const trigger = scrollTriggerRef.current;
    if (!trigger || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const settledProgress = Math.min(1, progress + GATE_SETTLE_EPSILON);
    const destination = trigger.start + (trigger.end - trigger.start) * settledProgress;
    trigger.scroll(Math.min(trigger.end, Math.max(window.scrollY, destination)));
    ScrollTrigger.update();
  };

  const academicSelection = useEncounterSelection({
    value: answers.academicLevel,
    setValue: setAcademicLevelAnswer,
    rootRef,
    characterRef,
    choiceSelector: (answer) =>
      `[data-encounter="academic-level"] [data-encounter-choice="${answer}"]`,
    onValueCommitted: (answer) => {
      answersRef.current.academicLevel = answer;
    },
    onFirstComplete: () => continueFromEncounter(CONFIDENCE_HOLD_PROGRESS),
  });

  const confidenceSelection = useEncounterSelection({
    value: answers.confidence,
    setValue: setConfidenceAnswer,
    rootRef,
    characterRef,
    choiceSelector: (answer) =>
      `[data-encounter="confidence"] [data-encounter-choice="${answer}"]`,
    onValueCommitted: (answer) => {
      answersRef.current.confidence = answer;
    },
    onFirstComplete: () => continueFromEncounter(LEARNING_HABITS_HOLD_PROGRESS),
  });

  const learningHabitsSelection = useEncounterSelection({
    value: answers.learningHabits,
    setValue: setLearningHabitsAnswer,
    rootRef,
    characterRef,
    choiceSelector: (answer) =>
      `[data-encounter="learning-habits"] [data-encounter-choice="${answer}"]`,
    onValueCommitted: (answer) => {
      answersRef.current.learningHabits = answer;
    },
    onFirstComplete: () => continueFromEncounter(MOTIVATION_HOLD_PROGRESS),
  });

  const motivationSelection = useEncounterSelection({
    value: answers.motivation,
    setValue: setMotivationAnswer,
    rootRef,
    characterRef,
    choiceSelector: (answer) =>
      `[data-encounter="motivation"] [data-encounter-choice="${answer}"]`,
    onValueCommitted: (answer) => {
      answersRef.current.motivation = answer;
    },
    onFirstComplete: () => {
      const obstacle = rootRef.current?.querySelector<HTMLElement>(".motivation-obstacle__twig");
      const motivationScene = rootRef.current?.querySelector<HTMLElement>("[data-journey-motivation-arrival]");
      if (!window.matchMedia(REDUCED_MOTION_QUERY).matches) {
        gsap.to(characterRef.current, { x: "+=12", y: -3, duration: 0.28, ease: "power3.out", yoyo: true, repeat: 1 });
        gsap.to(obstacle, { rotation: 3, x: 5, duration: 0.38, ease: "power3.out" });
        gsap.to(motivationScene, { autoAlpha: 0, duration: 0.32, delay: 0.28, ease: "power3.out" });
      }
      continueFromEncounter(GOALS_HOLD_PROGRESS);
    },
  });

  const goalsSelection = useEncounterSelection({
    value: answers.goals,
    setValue: setGoalsAnswer,
    rootRef,
    characterRef,
    choiceSelector: (answer) =>
      `[data-encounter="goals"] [data-encounter-choice="${answer}"]`,
    onValueCommitted: (answer) => {
      answersRef.current.goals = answer;
      setJourneyComplete(true);
    },
  });

  const focusRecommendation = () => {
    const heading = rootRef.current?.querySelector<HTMLElement>(
      "[data-recommendation-heading]",
    );
    if (!heading) return;
    heading.focus();
    const bounds = heading.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRevealPathway = () => {
    if (!recommendation || resultRevealed) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      setRevealPhase("editorial");
      setResultRevealed(true);
      window.requestAnimationFrame(focusRecommendation);
      return;
    }
    shouldAnimateRevealRef.current = true;
    setRevealPhase("quiet");
    setResultRevealed(true);
  };

  useLayoutEffect(() => {
    if (!resultRevealed) {
      revealTimelineRef.current?.kill();
      revealTimelineRef.current = null;
      shouldAnimateRevealRef.current = false;
      setRevealPhase("hidden");
      return;
    }
    if (!recommendation || !shouldAnimateRevealRef.current || !rootRef.current) return;

    shouldAnimateRevealRef.current = false;
    const root = rootRef.current;
    const recommendationWorld = root.querySelector<HTMLElement>("[data-recommendation-journey]");
    const completionMessage = root.querySelector<HTMLElement>(".journey-completion__message");
    const completionMemory = root.querySelector<HTMLElement>(".journey-completion__memory");
    const resultMemory = Array.from(root.querySelectorAll<HTMLElement>("[data-result-memory-marker]"));
    const route = root.querySelector<HTMLElement>("[data-recommendation-route] > span");
    const primaryRoute = root.querySelector<HTMLElement>("[data-primary-route]");
    const destinations = root.querySelector<HTMLElement>("[data-recommendation-destinations]");
    const direction = root.querySelector<HTMLElement>("[data-direction-reveal]");
    const idleLayer = root.querySelector<HTMLElement>("[data-journey-character-idle]");
    const walkingLayer = root.querySelector<HTMLElement>("[data-journey-character-walking]");
    if (!recommendationWorld || !route || !primaryRoute || !destinations || !idleLayer || !walkingLayer) return;

    const context = gsap.context(() => {
      gsap.set(recommendationWorld, {
        x: () => -(recommendationWorld.offsetLeft - window.innerWidth * 0.06),
      });
      gsap.set(resultMemory, { autoAlpha: 0, y: 8 });
      gsap.set([route, primaryRoute], { scaleX: 0 });
      gsap.set(destinations, { autoAlpha: 0 });
      gsap.set(direction, { autoAlpha: 0, y: 10 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        .addLabel("quiet")
        .call(() => setRevealPhase("quiet"))
        .to([completionMessage, completionMemory], { autoAlpha: 0, duration: 0.42 })
        .addLabel("memory")
        .call(() => setRevealPhase("memory"))
        .to(resultMemory, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.25 })
        .addLabel("path")
        .call(() => setRevealPhase("path"))
        .to(route, { scaleX: 1, duration: 0.72 })
        .addLabel("destinations")
        .call(() => setRevealPhase("destinations"))
        .to(destinations, { autoAlpha: 1, duration: 0.62 }, "<+.12")
        .addLabel("resolve")
        .call(() => setRevealPhase("resolve"))
        .to(primaryRoute, { scaleX: 1, duration: 0.58 })
        .set(idleLayer, { autoAlpha: 0 })
        .set(walkingLayer, { autoAlpha: 1 })
        .to(characterRef.current, {
          x: () => `+=${Math.min(92, Math.max(46, window.innerWidth * 0.06))}`,
          duration: 0.82,
          ease: "power2.inOut",
        })
        .set(walkingLayer, { autoAlpha: 0 })
        .set(idleLayer, { autoAlpha: 1 })
        .addLabel("arrived")
        .call(() => setRevealPhase("arrived"))
        .to(characterRef.current, { y: -2, duration: 0.22, yoyo: true, repeat: 1 })
        .addLabel("direction")
        .call(() => setRevealPhase("direction"))
        .to(direction, { autoAlpha: 1, y: 0, duration: 0.48 })
        .addLabel("editorial")
        .call(() => setRevealPhase("editorial"))
        .call(() => {
          const trigger = scrollTriggerRef.current;
          if (trigger) {
            trigger.scroll(trigger.end);
            ScrollTrigger.update();
          }
          window.requestAnimationFrame(focusRecommendation);
        });
      revealTimelineRef.current = timeline;
    }, root);

    return () => {
      revealTimelineRef.current?.kill();
      revealTimelineRef.current = null;
      context.revert();
    };
  }, [resultRevealed, recommendation]);

  useLayoutEffect(() => {
    if (!journeyComplete || !rootRef.current) return;
    const root = rootRef.current;
    const completion = root.querySelector<HTMLElement>("[data-journey-completion]");
    const goalsScene = root.querySelector<HTMLElement>("[data-journey-goals-arrival]");
    const markers = gsap.utils.toArray<HTMLElement>("[data-memory-marker]", completion ?? undefined);
    const line = completion?.querySelector<HTMLElement>(".journey-completion__memory > b");
    const light = completion?.querySelector<HTMLElement>(".journey-completion__forward-light");
    const message = completion?.querySelector<HTMLElement>(".journey-completion__message");
    if (!completion || !goalsScene || !line || !light || !message) return;

    const context = gsap.context(() => {
      if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(characterRef.current, { x: "+=10", rotation: -2, duration: 0.28, delay: 0.55 })
        .to(goalsScene, { autoAlpha: 0, duration: 0.35 }, "<+.12")
        .to(completion, { autoAlpha: 1, duration: 0.4 }, "<")
        .to(viewportRef.current, { scale: 0.97, duration: 0.45 }, "<")
        .to(markers, { autoAlpha: 1, stagger: 0.11, duration: 0.22 })
        .to(line, { scaleX: 1, duration: 0.55 }, "<+.05")
        .to(light, { opacity: 1, duration: 0.42 })
        .to(characterRef.current, { rotation: 0, duration: 0.22 }, "<")
        .to(message, { autoAlpha: 1, y: 0, duration: 0.42 }, "<+.15");
    }, root);
    return () => context.revert();
  }, [journeyComplete]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const opening = openingRef.current;
    const character = characterRef.current;
    const walkFrameLayer = walkFramesRef.current;

    if (!root || !viewport || !opening || !character || !walkFrameLayer) {
      return;
    }

    let mounted = true;
    let refreshFrame: number | null = null;
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      media.add(NO_MOTION_QUERY, () => {
        const select = gsap.utils.selector(root);
        const worldTrack = select<HTMLElement>("[data-journey-world-track]")[0];
        const academicArrival = select<HTMLElement>("[data-journey-academic-arrival]")[0];
        const confidenceArrival = select<HTMLElement>("[data-journey-confidence-arrival]")[0];
        const learningHabitsArrival = select<HTMLElement>("[data-journey-learning-habits-arrival]")[0];
        const motivationArrival = select<HTMLElement>("[data-journey-motivation-arrival]")[0];
        const goalsArrival = select<HTMLElement>("[data-journey-goals-arrival]")[0];
        const completion = select<HTMLElement>("[data-journey-completion]")[0];
        const idleLayer = select<HTMLElement>("[data-journey-character-idle]")[0];
        const walkingLayer = select<HTMLElement>(
          "[data-journey-character-walking]",
        )[0];
        const frames = gsap.utils.toArray<HTMLImageElement>(
          "[data-frame-index]",
          walkFrameLayer,
        );
        const distanceLayer = select<HTMLElement>(
          '[data-journey-layer="distance"]',
        )[0];
        const middleLayer = select<HTMLElement>(
          '[data-journey-layer="middle"]',
        )[0];
        const pathLayer = select<HTMLElement>(
          '[data-journey-layer="path"]',
        )[0];
        const detailLayer = select<HTMLElement>(
          '[data-journey-layer="detail"]',
        )[0];
        const foregroundLayer = select<HTMLElement>(
          '[data-journey-layer="foreground"]',
        )[0];
        const academy = select<HTMLElement>(".journey-art--academy")[0];
        const grass = select<HTMLElement>(
          ".journey-art--wildflowers, .journey-art--lavender",
        );
        const signpost = select<HTMLElement>("[data-journey-signpost]")[0];

        if (
          !worldTrack ||
          !academicArrival ||
          !confidenceArrival ||
          !learningHabitsArrival ||
          !motivationArrival ||
          !goalsArrival ||
          !completion ||
          !idleLayer ||
          !walkingLayer ||
          !distanceLayer ||
          !middleLayer ||
          !pathLayer ||
          !detailLayer ||
          !foregroundLayer ||
          frames.length === 0
        ) {
          return;
        }

        const getTravelDistance = () =>
          Math.max(0, worldTrack.scrollWidth - viewport.clientWidth);
        const getEncounterAnchor = () =>
          viewport.clientWidth <= 480
            ? viewport.clientWidth * 0.54
            : viewport.clientWidth <= 1100
              ? viewport.clientWidth * 0.12
              : viewport.clientWidth * 0.28;
        const getScrollDistance = () => {
          const minimum = window.innerHeight * 5.5;
          const maximum = window.innerHeight * 7;
          return Math.round(
            Math.min(maximum, Math.max(minimum, getTravelDistance() * 1.5)),
          );
        };

        const frameState = { index: 0 };
        const renderWalkFrame = () => {
          const activeFrame = Math.round(frameState.index) % frames.length;

          frames.forEach((frame, index) => {
            const isActive = index === activeFrame;
            frame.style.opacity = isActive ? "1" : "0";
            frame.style.visibility = isActive ? "visible" : "hidden";
          });
        };

        gsap.set([academicArrival, confidenceArrival, learningHabitsArrival, motivationArrival, goalsArrival], { autoAlpha: 0, y: 18 });
        gsap.set(completion, { autoAlpha: 0 });
        gsap.set(idleLayer, { autoAlpha: 1 });
        gsap.set(walkingLayer, { autoAlpha: 0 });
        gsap.set(
          [
            character,
            distanceLayer,
            middleLayer,
            pathLayer,
            detailLayer,
            foregroundLayer,
          ],
          { willChange: "transform" },
        );
        gsap.set([academicArrival, confidenceArrival, learningHabitsArrival, motivationArrival, goalsArrival], { willChange: "transform, opacity" });
        renderWalkFrame();

        const clampToPendingGate = (self: ScrollTrigger) => {
          const blockedAt = !answersRef.current.academicLevel
            ? ACADEMIC_HOLD_PROGRESS
            : !answersRef.current.confidence
              ? CONFIDENCE_HOLD_PROGRESS
              : !answersRef.current.learningHabits
                ? LEARNING_HABITS_HOLD_PROGRESS
                : !answersRef.current.motivation
                  ? MOTIVATION_HOLD_PROGRESS
                  : !answersRef.current.goals
                    ? GOALS_HOLD_PROGRESS
                : null;
          if (blockedAt === null || self.progress <= blockedAt) return;
          const gateScroll = self.start + (self.end - self.start) * blockedAt;
          self.getTween?.()?.kill();
          self.animation?.progress(blockedAt);
          const pendingArrival = blockedAt === ACADEMIC_HOLD_PROGRESS
            ? academicArrival
            : blockedAt === CONFIDENCE_HOLD_PROGRESS
              ? confidenceArrival
              : blockedAt === LEARNING_HABITS_HOLD_PROGRESS
                ? learningHabitsArrival
                : blockedAt === MOTIVATION_HOLD_PROGRESS
                  ? motivationArrival
                  : goalsArrival;
          gsap.set(pendingArrival, { autoAlpha: 1, y: 0 });
          gsap.set(
            pendingArrival.querySelectorAll<HTMLElement>(
              "[data-encounter-label], [data-encounter-heading], [data-encounter-support], .assessment-choice",
            ),
            { autoAlpha: 1, y: 0 },
          );
          gsap.set(walkingLayer, { autoAlpha: 0, scale: 1 });
          gsap.set(idleLayer, { autoAlpha: 1 });
          self.scroll(gateScroll);
          ScrollTrigger.update();
        };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: 0.65,
            pin: viewportRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.direction < 1) return;
              clampToPendingGate(self);
            },
            onScrubComplete: clampToPendingGate,
            onLeave: clampToPendingGate,
          },
          defaults: { ease: "none" },
        });
        const timelineScrollTrigger = timeline.scrollTrigger;
        scrollTriggerRef.current = timelineScrollTrigger ?? null;

        timeline
          .addLabel("opening", 0)
          .addLabel("departure", 0.05)
          .addLabel("travel", 0.1)
          .addLabel("approach", 0.25)
          .addLabel("arrival", 0.28)
          .addLabel("academic-hold", ACADEMIC_HOLD_PROGRESS)
          .addLabel("continuation-start", 0.34)
          .addLabel("confidence-arrival", 0.48)
          .addLabel("confidence-hold", CONFIDENCE_HOLD_PROGRESS)
          .addLabel("learning-habits-continuation", 0.54)
          .addLabel("learning-habits-arrival", 0.65)
          .addLabel("learning-habits-hold", LEARNING_HABITS_HOLD_PROGRESS)
          .addLabel("motivation-continuation", 0.74)
          .addLabel("motivation-obstacle-cues", 0.77)
          .addLabel("motivation-arrival", 0.81)
          .addLabel("motivation-hold", MOTIVATION_HOLD_PROGRESS)
          .addLabel("goals-continuation", 0.87)
          .addLabel("lookout-approach", 0.9)
          .addLabel("goals-arrival", 0.93)
          .addLabel("goals-hold", GOALS_HOLD_PROGRESS)
          .addLabel("journey-completion", 0.975)
          .addLabel("complete", 1)
          .to(
            opening,
            { autoAlpha: 0, yPercent: -5, duration: 0.1 },
            "departure",
          )
          .to(
            character,
            {
              x: () => window.innerWidth * 0.28,
              duration: 0.05,
              ease: "power2.out",
            },
            "departure",
          )
          .set(idleLayer, { autoAlpha: 0 }, "departure")
          .set(walkingLayer, { autoAlpha: 1 }, "departure")
          .to(
            frameState,
            {
              index: frames.length * 6 - 1,
              duration: 0.78,
              ease: `steps(${frames.length * 6 - 1})`,
              onUpdate: renderWalkFrame,
            },
            "departure",
          )
          .to(
            distanceLayer,
            { x: () => -getTravelDistance() * 0.27, duration: 0.19 },
            "travel",
          )
          .to(
            middleLayer,
            { x: () => -getTravelDistance() * 0.3, duration: 0.19 },
            "travel",
          )
          .to(
            pathLayer,
            { x: () => -getTravelDistance() * 0.32, duration: 0.19 },
            "travel",
          )
          .to(
            detailLayer,
            { x: () => -getTravelDistance() * 0.32, duration: 0.19 },
            "travel",
          )
          .to(
            foregroundLayer,
            { x: () => -getTravelDistance() * 0.34, duration: 0.19 },
            "travel",
          )
          .to(
            academicArrival,
            { x: () => -(academicArrival.offsetLeft - getEncounterAnchor()), duration: 0.19 },
            "travel",
          )
          .to(
            academy,
            { opacity: 0.72, duration: 0.45 },
            "travel",
          )
          .to(
            grass,
            {
              y: (index) => (index % 2 === 0 ? -4 : 3),
              rotation: (index) => (index % 2 === 0 ? -0.7 : 0.6),
              duration: 0.52,
            },
            "travel+=0.06",
          )
          .fromTo(
            signpost,
            { rotation: -2.2, y: 5 },
            { rotation: 0, y: 0, duration: 0.14, ease: "power3.out" },
            "approach+=0.03",
          )
          .set(walkingLayer, { autoAlpha: 0 }, "arrival")
          .set(idleLayer, { autoAlpha: 1 }, "arrival")
          .to(
            academicArrival,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.13,
              ease: "power3.out",
            },
            "arrival",
          )
          .fromTo(
            select<HTMLElement>(
              '[data-encounter="academic-level"] [data-encounter-label], [data-encounter="academic-level"] [data-encounter-heading], [data-encounter="academic-level"] [data-encounter-support], [data-encounter="academic-level"] .assessment-choice',
            ),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, stagger: 0.005, duration: 0.04, ease: "power3.out" },
            "arrival",
          )
          .set(idleLayer, { autoAlpha: 0 }, "continuation-start")
          .set(walkingLayer, { autoAlpha: 1 }, "continuation-start")
          .to(distanceLayer, { x: () => -getTravelDistance() * 0.51, duration: 0.13 }, "continuation-start")
          .to(middleLayer, { x: () => -getTravelDistance() * 0.55, duration: 0.13 }, "continuation-start")
          .to(pathLayer, { x: () => -getTravelDistance() * 0.58, duration: 0.13 }, "continuation-start")
          .to(detailLayer, { x: () => -getTravelDistance() * 0.58, duration: 0.13 }, "continuation-start")
          .to(foregroundLayer, { x: () => -getTravelDistance() * 0.61, duration: 0.13 }, "continuation-start")
          .to(academicArrival, { x: () => -(academicArrival.offsetLeft + viewport.clientWidth * 0.3), autoAlpha: 0, duration: 0.13 }, "continuation-start")
          .to(confidenceArrival, { x: () => -(confidenceArrival.offsetLeft - getEncounterAnchor()), duration: 0.13 }, "continuation-start")
          .to(
            frameState,
            {
              index: frames.length * 8 - 1,
              duration: 0.13,
              ease: `steps(${frames.length * 2})`,
              onUpdate: renderWalkFrame,
            },
            "continuation-start",
          )
          .set(walkingLayer, { autoAlpha: 0 }, "confidence-arrival")
          .set(idleLayer, { autoAlpha: 1 }, "confidence-arrival")
          .to(confidenceArrival, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power3.out" }, "confidence-arrival")
          .fromTo(
            select<HTMLElement>(
              '[data-encounter="confidence"] [data-encounter-label], [data-encounter="confidence"] [data-encounter-heading], [data-encounter="confidence"] [data-encounter-support], [data-encounter="confidence"] .assessment-choice',
            ),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, stagger: 0.005, duration: 0.04, ease: "power3.out" },
            "confidence-arrival",
          )
          .set(idleLayer, { autoAlpha: 0 }, "learning-habits-continuation")
          .set(walkingLayer, { autoAlpha: 1 }, "learning-habits-continuation")
          .to(distanceLayer, { x: () => -getTravelDistance() * 0.7, duration: 0.14 }, "learning-habits-continuation")
          .to(middleLayer, { x: () => -getTravelDistance() * 0.76, duration: 0.14 }, "learning-habits-continuation")
          .to(pathLayer, { x: () => -getTravelDistance() * 0.81, duration: 0.14 }, "learning-habits-continuation")
          .to(detailLayer, { x: () => -getTravelDistance() * 0.81, duration: 0.14 }, "learning-habits-continuation")
          .to(foregroundLayer, { x: () => -getTravelDistance() * 0.85, duration: 0.14 }, "learning-habits-continuation")
          .to(confidenceArrival, { x: () => -(confidenceArrival.offsetLeft + viewport.clientWidth * 0.3), autoAlpha: 0, duration: 0.11 }, "learning-habits-continuation")
          .to(learningHabitsArrival, { x: () => -(learningHabitsArrival.offsetLeft - getEncounterAnchor()), duration: 0.14 }, "learning-habits-continuation")
          .set(walkingLayer, { autoAlpha: 0 }, "learning-habits-arrival")
          .set(idleLayer, { autoAlpha: 1 }, "learning-habits-arrival")
          .to(learningHabitsArrival, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power3.out" }, "learning-habits-arrival")
          .fromTo(
            select<HTMLElement>(
              '[data-encounter="learning-habits"] [data-encounter-label], [data-encounter="learning-habits"] [data-encounter-heading], [data-encounter="learning-habits"] [data-encounter-support]',
            ),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, stagger: 0.012, duration: 0.035, ease: "power3.out" },
            "learning-habits-arrival",
          )
          .fromTo(
            select<HTMLElement>('[data-encounter="learning-habits"] .assessment-choice'),
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, stagger: 0.01, duration: 0.02, ease: "power3.out" },
            "learning-habits-arrival+=0.005",
          )
          .set(idleLayer, { autoAlpha: 0 }, "motivation-continuation")
          .set(walkingLayer, { autoAlpha: 1 }, "motivation-continuation")
          .to(distanceLayer, { x: () => -getTravelDistance() * 0.9, duration: 0.05 }, "motivation-continuation")
          .to(middleLayer, { x: () => -getTravelDistance() * 0.96, duration: 0.05 }, "motivation-continuation")
          .to(pathLayer, { x: () => -getTravelDistance(), duration: 0.05 }, "motivation-continuation")
          .to(detailLayer, { x: () => -getTravelDistance(), duration: 0.05 }, "motivation-continuation")
          .to(foregroundLayer, { x: () => -getTravelDistance() * 1.04, duration: 0.05 }, "motivation-continuation")
          .to(learningHabitsArrival, { x: () => -(learningHabitsArrival.offsetLeft + viewport.clientWidth * 0.3), autoAlpha: 0, duration: 0.045 }, "motivation-continuation")
          .to(motivationArrival, { x: () => -(motivationArrival.offsetLeft - getEncounterAnchor()), duration: 0.05, ease: "power2.out" }, "motivation-continuation")
          .to(frameState, { index: frames.length * 10 - 1, duration: 0.05, ease: `steps(${frames.length * 2})`, onUpdate: renderWalkFrame }, "motivation-continuation")
          .set(walkingLayer, { autoAlpha: 0, scale: 1 }, "motivation-arrival")
          .set(idleLayer, { autoAlpha: 1 }, "motivation-arrival")
          .to(motivationArrival, { autoAlpha: 1, y: 0, duration: 0.018, ease: "power3.out" }, "motivation-arrival")
          .fromTo(
            select<HTMLElement>('[data-encounter="motivation"] [data-encounter-label], [data-encounter="motivation"] [data-encounter-heading], [data-encounter="motivation"] [data-encounter-support], [data-encounter="motivation"] .assessment-choice'),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, stagger: 0.003, duration: 0.012, ease: "power3.out" },
            "motivation-arrival",
          )
          .set(idleLayer, { autoAlpha: 0 }, "goals-continuation")
          .set(walkingLayer, { autoAlpha: 1 }, "goals-continuation")
          .to(motivationArrival, { x: () => -(motivationArrival.offsetLeft + viewport.clientWidth * 0.3), autoAlpha: 0, duration: 0.06 }, "goals-continuation")
          .to(goalsArrival, { x: () => -(goalsArrival.offsetLeft - getEncounterAnchor()), duration: 0.07, ease: "power2.out" }, "goals-continuation")
          .to(frameState, { index: frames.length * 12 - 1, duration: 0.07, ease: `steps(${frames.length * 2})`, onUpdate: renderWalkFrame }, "goals-continuation")
          .to(walkingLayer, { scale: 0.98, duration: 0.025, ease: "power2.out" }, "lookout-approach")
          .set(walkingLayer, { autoAlpha: 0, scale: 1 }, "goals-arrival")
          .set(idleLayer, { autoAlpha: 1 }, "goals-arrival")
          .to(goalsArrival, { autoAlpha: 1, y: 0, duration: 0.025, ease: "power3.out" }, "goals-arrival")
          .fromTo(
            select<HTMLElement>('[data-encounter="goals"] [data-encounter-label], [data-encounter="goals"] [data-encounter-heading], [data-encounter="goals"] [data-encounter-support], [data-encounter="goals"] .assessment-choice'),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, stagger: 0.004, duration: 0.018, ease: "power3.out" },
            "goals-arrival",
          );

        return () => {
          if (scrollTriggerRef.current === timelineScrollTrigger) {
            scrollTriggerRef.current = null;
          }
          timelineScrollTrigger?.kill();
          timeline.kill();
          frames.forEach((frame) => {
            frame.style.removeProperty("opacity");
            frame.style.removeProperty("visibility");
          });
        };
      });
    }, root);

    const primaryImages = Array.from(
      root.querySelectorAll<HTMLImageElement>(
        "[data-journey-character] img, .journey-art--academy, .journey-art--path",
      ),
    );

    void Promise.all(
      primaryImages.map((image) => image.decode().catch(() => undefined)),
    ).then(() => {
      if (!mounted) return;

      refreshFrame = window.requestAnimationFrame(() => {
        if (mounted) ScrollTrigger.refresh();
      });
    });

    return () => {
      mounted = false;
      if (refreshFrame !== null) window.cancelAnimationFrame(refreshFrame);
      media.revert();
      context.revert();
    };
  }, []);

  const handleBegin = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (reducedMotion) return;

    const scrollTrigger = scrollTriggerRef.current;
    if (!scrollTrigger) return;

    event.preventDefault();
    const departureScroll = scrollTrigger.start
      + (scrollTrigger.end - scrollTrigger.start) * JOURNEY_DEPARTURE_PROGRESS;

    window.scrollTo({
      top: departureScroll,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={rootRef}
      className="learning-journey"
      aria-labelledby="learning-journey-heading"
    >
      <div ref={viewportRef} className="learning-journey__viewport">
        <header ref={openingRef} className="journey-opening">
          <p className="journey-opening__lead">
            Every student learns differently.
          </p>
          <h1 id="learning-journey-heading" className="journey-opening__title">
            Let&apos;s find where your child thrives.
          </h1>
          <p className="journey-opening__support">
            A short journey. Thoughtful questions. A pathway that&apos;s uniquely theirs.
          </p>
          <a
            className="journey-opening__cta"
            href="#journey-movement"
            onClick={handleBegin}
          >
            Begin the journey →
          </a>
          <p className="journey-opening__instruction" aria-hidden="true">
            Scroll to begin ↓
          </p>
        </header>

        <div className="learning-journey__canvas">
          <div
            id="journey-movement"
            className="learning-journey__movement-anchor"
          />
          <JourneyWorld
            academicEncounter={(
              <AcademicLevelEncounter
                value={answers.academicLevel}
                phase={academicSelection.phase}
                onSelect={academicSelection.select}
              />
            )}
            confidenceEncounter={(
              <ConfidenceEncounter
                value={answers.confidence}
                phase={confidenceSelection.phase}
                onSelect={confidenceSelection.select}
              />
            )}
            learningHabitsEncounter={(
              <LearningHabitsEncounter
                value={answers.learningHabits}
                phase={learningHabitsSelection.phase}
                onSelect={learningHabitsSelection.select}
              />
            )}
            motivationEncounter={(
              <MotivationEncounter
                value={answers.motivation}
                phase={motivationSelection.phase}
                onSelect={motivationSelection.select}
              />
            )}
            goalsEncounter={(
              <GoalsEncounter
                value={answers.goals}
                phase={goalsSelection.phase}
                onSelect={goalsSelection.select}
              />
            )}
            completion={(
              <JourneyCompletion
                complete={journeyComplete}
                onRevealPathway={handleRevealPathway}
                revealing={resultRevealed && revealPhase !== "editorial"}
              />
            )}
            recommendationJourney={recommendation ? (
              <RecommendationJourney recommendation={recommendation} phase={revealPhase} />
            ) : null}
          />
          <WalkingCharacter
            ref={characterRef}
            walkFramesRef={walkFramesRef}
            idleSrc={journeyAssets.character.idle}
            walkingFrames={walkingFrames}
            className="journey-character journey-character-shell"
          />
        </div>
      </div>
      {recommendation ? (
        <RecommendationResult
          recommendation={recommendation}
          visible={revealPhase === "editorial"}
        />
      ) : null}
    </section>
  );
};

const LearningJourney = () => (
  <AssessmentJourneyProvider>
    <LearningJourneyExperience />
  </AssessmentJourneyProvider>
);

export default LearningJourney;
