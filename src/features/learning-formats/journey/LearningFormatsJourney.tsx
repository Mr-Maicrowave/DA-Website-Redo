import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getStageQuestions } from "../config/questions";
import { subjectLabel } from "../config/subjects";
import type { LearningStage } from "../logic/types";
import { buildJourneyStartingPoint } from "../logic/buildJourneyStartingPoint";
import { envLabel } from "../logic/calculateSubjectRecommendations";
import type { LearningFormatsController } from "../state/useLearningFormatsState";
import JourneyCheckpoint from "./JourneyCheckpoint";
import RecommendationDestination from "./RecommendationDestination";
import JourneySubjectSelector from "./JourneySubjectSelector";
import WalkingStudent from "./WalkingStudent";
import { journeyAssets } from "./journeyAssets";
import { routeForSubject } from "./finalPathwayRoutes";
import { getRestartedJourneyUiState } from "./restartJourney";
import "./checkpoint-journey.css";
import "./learning-formats-journey.css";

gsap.registerPlugin(ScrollTrigger);

type Phase =
  | "education"
  | "awaiting-year"
  | "travelling"
  | "awaiting-question"
  | "awaiting-result"
  | "awaiting-subjects"
  | "awaiting-specialist"
  | "final";

type RouteMode = "junction" | "committed" | "inside";

const X = {
  opening: 500,
  private: 2100,
  class: 3850,
  comparison: 5500,
  method: 7100,
  check: 8250,
  report: 9400,
  junction: 10800,
  questions: [12400, 13900, 15400, 16900],
  result: 18300,
  subjects: 19700,
  specialist: 21100,
  final: 22700,
  width: 24000,
} as const;

const ROUTE_Y: Record<LearningStage, number> = { primary: 54, "high-school": 68, hsc: 81 };
const ACTIVE_ROUTE_Y = 80;
const STAGE_COPY: Record<LearningStage, { title: string; years: string }> = {
  primary: { title: "Primary", years: "Years 1–6" },
  "high-school": { title: "High School", years: "Years 7–10" },
  hsc: { title: "HSC", years: "Years 11–12" },
};

const STAGE_SCENERY = {
  primary: [journeyAssets.primary.booksStationery, journeyAssets.primary.plant],
  "high-school": [journeyAssets.highSchool.deskLampBooks, journeyAssets.highSchool.geometrySet],
  hsc: [journeyAssets.hsc.examPaper, journeyAssets.hsc.timer],
} as const;

type SceneStop = {
  worldX: number;
  cameraX: number;
  characterX: number;
  contentAnchor: "left" | "split";
  contentWidth: number;
};

const sceneStops = {
  yearJunction: { worldX: X.junction, cameraX: X.junction, characterX: .32, contentAnchor: "left", contentWidth: 850 },
  q1: { worldX: X.questions[0], cameraX: X.questions[0], characterX: .68, contentAnchor: "left", contentWidth: 760 },
  q2: { worldX: X.questions[1], cameraX: X.questions[1], characterX: .68, contentAnchor: "left", contentWidth: 760 },
  q3: { worldX: X.questions[2], cameraX: X.questions[2], characterX: .68, contentAnchor: "left", contentWidth: 760 },
  q4: { worldX: X.questions[3], cameraX: X.questions[3], characterX: .68, contentAnchor: "left", contentWidth: 760 },
  preliminaryResult: { worldX: X.result, cameraX: X.result, characterX: .68, contentAnchor: "left", contentWidth: 720 },
  subjectSelection: { worldX: X.subjects, cameraX: X.subjects, characterX: .68, contentAnchor: "split", contentWidth: 1180 },
  englishFollowup: { worldX: X.specialist, cameraX: X.specialist, characterX: .68, contentAnchor: "left", contentWidth: 760 },
  mathsFollowup: { worldX: X.specialist, cameraX: X.specialist, characterX: .68, contentAnchor: "left", contentWidth: 760 },
  scienceFollowup: { worldX: X.specialist, cameraX: X.specialist, characterX: .68, contentAnchor: "left", contentWidth: 760 },
  specialistFollowup: { worldX: X.specialist, cameraX: X.specialist, characterX: .68, contentAnchor: "left", contentWidth: 760 },
  finalResult: { worldX: X.final, cameraX: X.final, characterX: .68, contentAnchor: "split", contentWidth: 1180 },
} as const;

const cameraFor = (x: number, viewportAnchor = 0.32) =>
  -(x - window.innerWidth * viewportAnchor);

interface Props { controller: LearningFormatsController }

const LearningFormatsJourney = ({ controller }: Props) => {
  const stage = controller.state.stage;
  const questions = useMemo(() => stage ? getStageQuestions(stage) : [], [stage]);
  const resumeQuestion = stage ? Math.max(0, questions.findIndex((q) => !controller.state.answers[q.slot])) : 0;
  const completedQuestions = stage ? questions.every((q) => controller.state.answers[q.slot]) : false;
  const initialPhase: Phase = !stage ? "education"
    : !completedQuestions ? "awaiting-question"
    : controller.state.selectedSubjects.length === 0 ? "awaiting-result"
    : !controller.allFollowUpsAnswered ? "awaiting-specialist"
    : "final";
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [routeMode, setRouteMode] = useState<RouteMode>(stage ? "inside" : "junction");
  const [questionIndex, setQuestionIndex] = useState(() => resumeQuestion < 0 ? 4 : resumeQuestion);
  const [specialistIndex, setSpecialistIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const studentRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger>();
  const motionRef = useRef<gsap.core.Timeline>();
  const restartTimerRef = useRef<number>();
  const initialStageRef = useRef(stage);
  const initialCompletedRef = useRef(completedQuestions);
  const initialQuestionRef = useRef(resumeQuestion);
  const initialPhaseRef = useRef(initialPhase);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const setCamera = useCallback((
    x: number,
    duration = 1.35,
    onComplete?: () => void,
    direction: "right" | "left" = "right",
    viewportAnchor = 0.32,
  ) => {
    const world = worldRef.current;
    const student = studentRef.current;
    if (!world || !student) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motionRef.current?.kill();
    setTransitioning(true);
    setPhase("travelling");
    student.dataset.state = direction === "left" ? "walkingLeft" : "walking";
    motionRef.current = gsap.timeline({ onComplete: () => {
      student.dataset.state = direction === "left" ? "facingLeft" : "idle";
      setTransitioning(false);
      onComplete?.();
    }}).to(world, { x: cameraFor(x, viewportAnchor), duration: reduced ? 0 : duration, ease: "power2.inOut" });
  }, []);

  const focusJourneyScene = useCallback((
    scene: keyof typeof sceneStops,
    duration: number,
    onComplete: () => void,
    direction: "right" | "left" = "right",
  ) => {
    const focus = sceneStops[scene];
    setCamera(focus.cameraX, duration, onComplete, direction, focus.characterX);
  }, [setCamera]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const world = worldRef.current;
    const student = studentRef.current;
    if (!root || !viewport || !world || !student) return;

    const initialStage = initialStageRef.current;
    const initialStop = initialStage
      ? initialPhaseRef.current === "final" ? sceneStops.finalResult
        : initialPhaseRef.current === "awaiting-specialist" ? sceneStops.specialistFollowup
        : initialCompletedRef.current ? sceneStops.preliminaryResult : sceneStops[`q${Math.min(initialQuestionRef.current, 3) + 1}` as "q1" | "q2" | "q3" | "q4"]
      : null;
    gsap.set(world, { x: initialStop ? cameraFor(initialStop.cameraX, initialStop.characterX) : cameraFor(X.opening) });
    gsap.set(student, { top: `${initialStage ? ACTIVE_ROUTE_Y : 82}%` });

    const context = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * 12}`,
        pin: viewport,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (initialStageRef.current || phaseRef.current !== "education") return;
          const p = Math.min(self.progress / 0.78, 1);
          const x = X.opening + (X.junction - X.opening) * p;
          gsap.set(world, { x: cameraFor(x) });
          gsap.set(student, { top: `${82 - Math.min(p / .12, 1) * 14}%` });
          student.dataset.state = self.getVelocity() === 0 ? "idle" : "walking";
          if (p >= 1) {
            student.dataset.state = "idle";
            phaseRef.current = "awaiting-year";
            setPhase("awaiting-year");
            window.scrollTo({
              top: self.start + (self.end - self.start) * .78,
              behavior: "auto",
            });
          }
        },
      });
      triggerRef.current = trigger;
    }, root);

    const blockProgress = (event: WheelEvent | TouchEvent) => {
      if (["awaiting-year", "awaiting-question", "awaiting-result", "awaiting-subjects", "awaiting-specialist"].includes(phaseRef.current)) {
        event.preventDefault();
      }
      if (phaseRef.current === "final" && event instanceof WheelEvent && event.deltaY > 0) {
        window.scrollTo({ top: triggerRef.current?.end ?? window.scrollY, behavior: "smooth" });
      }
    };
    window.addEventListener("wheel", blockProgress, { passive: false, capture: true });
    window.addEventListener("touchmove", blockProgress, { passive: false, capture: true });
    const blockKeys = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key) && ["awaiting-year", "awaiting-question", "awaiting-result", "awaiting-subjects", "awaiting-specialist"].includes(phaseRef.current)) event.preventDefault();
    };
    window.addEventListener("keydown", blockKeys, { capture: true });
    return () => {
      window.removeEventListener("wheel", blockProgress, true);
      window.removeEventListener("touchmove", blockProgress, true);
      window.removeEventListener("keydown", blockKeys, true);
      motionRef.current?.kill();
      if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
      context.revert();
    };
  }, []);

  const chooseStage = (nextStage: LearningStage) => {
    setRouteMode("committed");
    controller.setStage(nextStage);
    const student = studentRef.current;
    if (student) {
      gsap.timeline()
        .to(student, { top: `${ROUTE_Y[nextStage]}%`, duration: .55, ease: "power2.out" })
        .to(student, { top: `${ACTIVE_ROUTE_Y}%`, duration: 1.05, ease: "power2.inOut" });
    }
    setQuestionIndex(0);
    focusJourneyScene("q1", 1.8, () => {
      setRouteMode("inside");
      setPhase("awaiting-question");
    });
  };

  const changeYearGroup = () => {
    if (!stage || transitioning) return;
    setRouteMode("committed");
    const student = studentRef.current;
    if (student) {
      gsap.timeline()
        .to(student, { top: `${ROUTE_Y[stage]}%`, duration: .4, ease: "power2.out" })
        .to(student, { top: "68%", duration: 1, ease: "power2.inOut" });
    }
    setCamera(X.junction, 1.45, () => {
      setRouteMode("junction");
      setPhase("awaiting-year");
      const trigger = triggerRef.current;
      if (trigger) {
        window.scrollTo({
          top: trigger.start + (trigger.end - trigger.start) * .78,
          behavior: "auto",
        });
      }
    }, "left");
  };

  const answerQuestion = (optionId: string) => {
    if (!stage || transitioning) return;
    const question = questions[questionIndex];
    controller.setAnswer(question.slot, optionId);
    window.setTimeout(() => {
      if (questionIndex < 3) {
        const next = questionIndex + 1;
        focusJourneyScene(`q${next + 1}` as "q2" | "q3" | "q4", 1.25, () => { setQuestionIndex(next); setPhase("awaiting-question"); });
      } else {
        focusJourneyScene("preliminaryResult", 1.5, () => { setQuestionIndex(4); setPhase("awaiting-result"); });
      }
    }, 380);
  };

  const backQuestion = () => {
    if (questionIndex <= 0 || transitioning) return;
    const next = questionIndex - 1;
    focusJourneyScene(`q${next + 1}` as "q1" | "q2" | "q3", 1.1, () => { setQuestionIndex(next); setPhase("awaiting-question"); }, "left");
  };

  const continueToSubjects = () => focusJourneyScene("subjectSelection", 1.35, () => setPhase("awaiting-subjects"));
  const changeAssessmentAnswers = () => {
    if (transitioning) return;
    focusJourneyScene("q4", 1.1, () => {
      setQuestionIndex(3);
      setPhase("awaiting-question");
    }, "left");
  };
  const confirmSubjects = () => {
    if (controller.visibleFollowUps.length > 0) {
      setSpecialistIndex(0);
      focusJourneyScene("specialistFollowup", 1.2, () => setPhase("awaiting-specialist"));
    } else {
      focusJourneyScene("finalResult", 1.5, () => setPhase("final"));
    }
  };
  const answerSpecialist = (optionId: string) => {
    const followUp = controller.visibleFollowUps[specialistIndex];
    if (!followUp) return;
    controller.setSubjectAnswer(followUp.config.key, optionId);
    window.setTimeout(() => {
      if (specialistIndex < controller.visibleFollowUps.length - 1) setSpecialistIndex((value) => value + 1);
      else focusJourneyScene("finalResult", 1.5, () => setPhase("final"));
    }, 380);
  };

  const backSpecialist = () => {
    if (transitioning) return;
    if (specialistIndex > 0) setSpecialistIndex((value) => value - 1);
    else focusJourneyScene("subjectSelection", 1.1, () => setPhase("awaiting-subjects"), "left");
  };

  const adjustFinalAnswers = () => {
    if (controller.visibleFollowUps.length > 0) {
      setSpecialistIndex(controller.visibleFollowUps.length - 1);
      focusJourneyScene("specialistFollowup", 1.2, () => setPhase("awaiting-specialist"), "left");
    } else focusJourneyScene("subjectSelection", 1.2, () => setPhase("awaiting-subjects"), "left");
  };

  const restartJourney = () => {
    if (restarting) return;
    const world = worldRef.current;
    const student = studentRef.current;
    const trigger = triggerRef.current;
    if (!world || !student || !trigger) return;

    const opening = getRestartedJourneyUiState();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRestarting(true);
    motionRef.current?.kill();

    restartTimerRef.current = window.setTimeout(() => {
      controller.reset();
      initialStageRef.current = opening.initialStage;
      setPhase(opening.phase);
      setRouteMode(opening.routeMode);
      setQuestionIndex(opening.questionIndex);
      setSpecialistIndex(opening.specialistIndex);
      setTransitioning(opening.transitioning);

      gsap.set(world, { x: cameraFor(X.opening) });
      gsap.set(student, { top: opening.characterTop });
      phaseRef.current = "travelling";
      trigger.refresh();

      const htmlScrollBehavior = document.documentElement.style.scrollBehavior;
      const bodyScrollBehavior = document.body.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      window.scrollTo({ top: trigger.start, left: 0, behavior: "auto" });
      trigger.update();

      window.requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = htmlScrollBehavior;
        document.body.style.scrollBehavior = bodyScrollBehavior;
        phaseRef.current = opening.phase;
        student.dataset.state = opening.characterState;
        setRestarting(false);
      });
      restartTimerRef.current = undefined;
    }, reducedMotion ? 0 : 240);
  };

  const startingPoint = buildJourneyStartingPoint(controller.state);
  const followUp = controller.visibleFollowUps[specialistIndex]?.config;
  const recommendation = controller.bundle.recommendation;

  return <section ref={rootRef} className="lf-master" aria-label="Learning Formats journey">
    <div ref={viewportRef} className="lf-master__viewport" data-phase={phase} data-restarting={restarting} data-interactive-character={Boolean(stage) && phase !== "awaiting-year"}>
      <div ref={worldRef} className="lf-master__world" style={{ width: X.width }}>
        <div className="lf-master__road" style={{ width: X.junction }} aria-hidden="true" />
        <article className="lf-zone lf-zone--opening" style={{ left: X.opening }}>
          <div className="lf-opening-station__copy"><span>Learning formats</span><h1>Every student learns differently.</h1><p>Let&apos;s find the environment where<br/>your child can thrive.</p></div>
          <div className="lf-opening-station__vignette" aria-hidden="true">
            <img className="lf-opening-station__shrubs" src={journeyAssets.shared.shrubs.src} alt="" />
            <img className="lf-opening-station__backpack" src={journeyAssets.shared.backpack.src} alt="" />
            <img className="lf-opening-station__books" src={journeyAssets.shared.books.src} alt="" />
            <img className="lf-opening-station__flag" src={journeyAssets.shared.daFlag.src} alt="" />
          </div>
          <span className="lf-opening-station__road" aria-hidden="true"><i /></span>
        </article>
        <article className="lf-zone lf-zone--format" style={{ left: X.private }}><div><span>Private learning</span><h2>Built around one student.</h2><p>Highly adaptable pace. Targeted support. More time where it&apos;s needed.</p></div><img src="/media/hsc/editorial/explorer/explorer-private-photo.png" alt="A DA tutor providing individual support" loading="lazy" /></article>
        <article className="lf-zone lf-zone--format" style={{ left: X.class }}><img src="/media/hsc/editorial/explorer/explorer-small-group-photo.png" alt="Students learning together with a DA tutor" loading="lazy" /><div><span>Class learning</span><h2>Structured together.</h2><p>Curriculum-paced progression, peer momentum and tutor guidance throughout.</p></div></article>
        <article className="lf-zone lf-zone--comparison" style={{ left: X.comparison }}><h2>Different environments.<br/>Different strengths.</h2><div><p><strong>Private</strong><br/>Highly adaptable and individual.</p><p><strong>Class</strong><br/>Structured progression with peers.</p></div><em>Neither is better. The right environment depends on the student.</em></article>
        <article className="lf-zone lf-zone--method" style={{ left: X.method }}><h2>Whatever the format,<br/>understanding comes first.</h2><ol><li><b>01</b> Understand</li><li><b>02</b> Explain</li><li><b>03</b> Try</li></ol><img src={journeyAssets.shared.openBook.src} alt="" /></article>
        <article className="lf-zone lf-zone--check" style={{ left: X.check }}><h2>CHECK</h2><p>Did it actually click?</p><div>Not yet → correct → practise → check again</div><strong>Got it → move forward</strong></article>
        <article className="lf-zone lf-zone--report" style={{ left: X.report }}><img src={journeyAssets.hsc.examWork.src} alt=""/><div><h2>You stay informed.</h2><p>What we covered · How they performed · What we&apos;re working on next</p></div></article>

        <section className="lf-junction-zone" style={{ left: X.junction - 600 }} aria-labelledby="lf-master-year-heading" data-route-mode={routeMode} data-selected-stage={stage ?? "none"}>
          <svg viewBox="0 0 3000 700" preserveAspectRatio="none" aria-hidden="true"><path className="entry" d="M0 476 H600"/><path className="primary" d="M600 476 C760 476 800 378 1000 378 H3000"/><path className="high" d="M600 476 H3000"/><path className="hsc" d="M600 476 C760 476 800 567 1000 567 H3000"/><circle cx="600" cy="476" r="10"/></svg>
          <div className="lf-junction-zone__question" data-visible={phase === "awaiting-year"}><h2 id="lf-master-year-heading">What year is your child in?</h2>{(["primary","high-school","hsc"] as LearningStage[]).map((item) => <button key={item} type="button" onClick={() => chooseStage(item)}><strong>{STAGE_COPY[item].title}</strong><span>{STAGE_COPY[item].years}</span></button>)}</div>
        </section>
        {stage && routeMode === "inside" && <div className="lf-selected-route" style={{ left: X.junction + 400, top: `${ACTIVE_ROUTE_Y}%`, width: X.final - X.junction + 2100 }} data-stage={stage} aria-hidden="true" />}

        {stage && questions.map((question, index) => <section key={question.slot} className="lf-interactive-zone lf-world-checkpoint" style={{ left: X.questions[index] - 450, "--route-y": `${ACTIVE_ROUTE_Y}%` } as CSSProperties} data-active={phase === "awaiting-question" && questionIndex === index} data-stage={stage}>
          <span className="lf-road-marker" data-complete={Boolean(controller.state.answers[question.slot])} aria-hidden="true"/><span className="lf-route-name">{STAGE_COPY[stage].title} path · Q{index + 1}</span><img className="lf-question-scenery" src={STAGE_SCENERY[stage][index % 2].src} alt="" aria-hidden="true" />
        </section>)}

        {(phase === "education" || phase === "awaiting-year" || routeMode === "committed") && <img className="lf-world-prop lf-world-prop--sign" style={{ left: X.junction - 900 }} src={journeyAssets.shared.junctionSignpost.src} alt="" aria-hidden="true" />}
        <img className="lf-world-prop lf-world-prop--final" style={{ left: X.final + 160 }} src={journeyAssets.shared.daFlagWide.src} alt="" aria-hidden="true" />
      </div>
      <WalkingStudent ref={studentRef} state="idle" className="lf-master__student" />
      <div className="scene-safe-area" data-anchor={phase === "awaiting-subjects" || phase === "final" ? "split" : "left"}>
        {phase === "awaiting-question" && stage && questions[questionIndex] && (
          <JourneyCheckpoint question={questions[questionIndex]} index={questionIndex} total={4} value={controller.state.answers[questions[questionIndex].slot]} disabled={transitioning} onSelect={answerQuestion} onBack={questionIndex > 0 ? backQuestion : changeYearGroup} backLabel={questionIndex > 0 ? "← Previous question" : "← Change year group"}/>
        )}
        {phase === "awaiting-result" && startingPoint && (
          <RecommendationDestination result={startingPoint} onContinue={continueToSubjects} onChangeAnswers={changeAssessmentAnswers}/>
        )}
        {phase === "awaiting-subjects" && stage && (
          <JourneySubjectSelector stage={stage} eligibleSubjects={controller.eligibleSubjects} selected={controller.state.selectedSubjects} confirmed={false} onToggle={controller.toggleSubject} onContinue={confirmSubjects}/>
        )}
        {phase === "awaiting-specialist" && followUp && <div className="lf-specialist-inline"><p>{subjectLabel(followUp.subject)} · Follow-up</p><fieldset><legend>{followUp.question}</legend><div>{followUp.options.map((option) => <label key={option.id} data-selected={controller.state.subjectAnswers[followUp.key] === option.id}><input type="radio" name={followUp.key} checked={controller.state.subjectAnswers[followUp.key] === option.id} onChange={() => answerSpecialist(option.id)}/><span>{option.label}</span></label>)}</div></fieldset><button type="button" onClick={backSpecialist}>← Back</button></div>}
        {phase === "final" && recommendation && <section className="lf-master-final" aria-labelledby="lf-final-heading"><p>Your result</p><h2 id="lf-final-heading">Your DA starting pathway.</h2><h3>{recommendation.close ? "Both could work" : envLabel(recommendation.primaryEnvironment)}</h3><ul>{startingPoint?.reasons.slice(0,3).map((reason) => <li key={reason}>{reason}</li>)}</ul><div className="lf-master-final__subjects">{recommendation.subjects.map((subject) => <span key={subject.subject}><strong>{subject.subjectLabel}</strong>{envLabel(subject.environment)}</span>)}</div><div className="lf-master-final__actions"><Link to="/book-interview">Book a consultation</Link><Link to={recommendation.subjects[0] ? routeForSubject(recommendation.subjects[0].subject) : "/subjects/english"}>Explore recommended programs</Link><div className="lf-master-final__text-actions"><button type="button" onClick={adjustFinalAnswers}>← Adjust my answers</button><button type="button" onClick={restartJourney} disabled={restarting}><span aria-hidden="true">↺</span> Start again</button></div></div></section>}
      </div>
      {(phase === "education" || phase === "travelling" || (phase === "awaiting-question" && stage && questionIndex < questions.length && !controller.state.answers[questions[questionIndex].slot])) && <p className="lf-master__hint" aria-live="polite">{phase === "education" ? <><span>Begin the journey</span><b aria-hidden="true">↓</b></> : phase === "travelling" ? "Walking to the next stop…" : "Choose an option to continue"}</p>}
    </div>
  </section>;
};

export default LearningFormatsJourney;
