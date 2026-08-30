import { AssessmentChoice } from "./AssessmentChoice";
import { AssessmentEncounter } from "./AssessmentEncounter";
import { JourneyProgress } from "./JourneyProgress";
import { journeyAssets } from "./journeyAssets";
import { learningHabitsChoices } from "./learningHabitsModel";
import { type EncounterPhase, type LearningHabitsAnswer } from "./assessmentTypes";
import "./learning-habits-encounter.css";

const StudyArchitecture = () => (
  <div className="learning-habits-study" aria-hidden="true">
    <span className="learning-habits-study__shelf">
      <img src={journeyAssets.classroom[3]} alt="" />
      <i /><i />
    </span>
    <img
      className="learning-habits-study__lamp"
      src={journeyAssets.classroom[2]}
      alt=""
    />
    <span className="learning-habits-study__plant"><i /><i /><i /></span>
    <span className="learning-habits-study__support-point">Support point</span>
  </div>
);

const Tutor = ({ distant = false }: { distant?: boolean }) => (
  <span
    className={distant ? "learning-habit-tutor learning-habit-tutor--distant" : "learning-habit-tutor"}
    data-learning-habit-tutor
  >
    <i /><i />
  </span>
);

const StudyChoice = ({ value }: { value: LearningHabitsAnswer }) => (
  <span className={`learning-habit-vignette learning-habit-vignette--${value}`}>
    <span className="learning-habit-desk">
      <span className="learning-habit-page" data-learning-habit-page><i /><i /></span>
      <span className="learning-habit-pencil" data-learning-habit-pencil />
      <span className="learning-habit-page-stack" data-learning-habit-stack><i /><i /></span>
      <span className="learning-habit-gold-line" data-learning-habit-line />
    </span>
    <img
      className="learning-habit-student"
      src={journeyAssets.classroom[0]}
      alt=""
      data-learning-habit-student
    />
    {value === "guided" ? (
      <>
        <Tutor />
        <span className="learning-habit-checklist" data-learning-habit-checklist><i /><i /><i /></span>
      </>
    ) : null}
    {value === "check-in" ? (
      <>
        <Tutor distant />
        <span className="learning-habit-help-glow" data-learning-habit-help-glow />
      </>
    ) : null}
    {value === "independent" ? (
      <span className="learning-habit-forward-accent" data-learning-habit-forward-accent />
    ) : null}
  </span>
);

interface LearningHabitsEncounterProps {
  value: LearningHabitsAnswer | null;
  phase: EncounterPhase;
  onSelect: (answer: LearningHabitsAnswer) => void;
}

export const LearningHabitsEncounter = ({
  value,
  phase,
  onSelect,
}: LearningHabitsEncounterProps) => (
  <div className="learning-habits-scene" data-journey-learning-habits-arrival>
    <StudyArchitecture />
    <JourneyProgress
      completed={value === null
        ? ["Academic Level", "Confidence"]
        : ["Academic Level", "Confidence", "Learning Habits"]}
      current={value === null ? "Learning Habits" : "Motivation"}
    />
    <AssessmentEncounter
      id="learning-habits"
      label="03 — LEARNING HABITS"
      heading="Once your child understands what to do, how much support do they usually need?"
      supportingText="Choose the one that feels most like them."
      phase={phase}
    >
      {learningHabitsChoices.map((choice) => (
        <AssessmentChoice
          key={choice.value}
          name="learning-habits"
          {...choice}
          selected={value === choice.value}
          disabled={phase === "confirming"}
          dimmed={value !== null && value !== choice.value}
          illustration={<StudyChoice value={choice.value} />}
          onSelect={onSelect}
        />
      ))}
    </AssessmentEncounter>
  </div>
);
