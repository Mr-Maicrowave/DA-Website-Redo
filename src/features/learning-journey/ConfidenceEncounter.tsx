import { AssessmentChoice } from "./AssessmentChoice";
import { AssessmentEncounter } from "./AssessmentEncounter";
import { JourneyProgress } from "./JourneyProgress";
import { confidenceChoices } from "./confidenceModel";
import { journeyAssets } from "./journeyAssets";
import { type ConfidenceAnswer, type EncounterPhase } from "./assessmentTypes";
import "./confidence-encounter.css";

const ClassroomArchitecture = () => (
  <div className="confidence-classroom" aria-hidden="true">
    <span className="confidence-classroom__doorway"><i /></span>
    <span className="confidence-classroom__window"><i /><i /></span>
    <span className="confidence-classroom__board" />
    <span className="confidence-classroom__shelf">
      <img src={journeyAssets.classroom[3]} alt="" />
    </span>
    <img
      src={journeyAssets.classroom[2]}
      alt=""
      className="confidence-classroom__lamp"
    />
  </div>
);

const ClassroomChoice = ({ value }: { value: ConfidenceAnswer }) => (
  <span className={`confidence-vignette confidence-vignette--${value}`}>
    <span className="confidence-desk">
      <span className="confidence-page" data-confidence-page />
      <span className="confidence-pencil" data-confidence-pencil />
    </span>
    <img
      src={journeyAssets.classroom[0]}
      alt=""
      className="confidence-student"
      data-confidence-student
    />
    {value === "encouraged" && (
      <>
        <span className="confidence-tutor" data-confidence-tutor><i /><i /></span>
        <span className="confidence-speech" data-confidence-speech />
      </>
    )}
    {value === "confident" && (
      <>
        <span className="confidence-hand" data-confidence-hand><i /></span>
        <span className="confidence-glint" data-confidence-glint />
      </>
    )}
    <span className="confidence-floor-detail" />
  </span>
);

interface ConfidenceEncounterProps {
  value: ConfidenceAnswer | null;
  phase: EncounterPhase;
  onSelect: (answer: ConfidenceAnswer) => void;
}

export const ConfidenceEncounter = ({
  value,
  phase,
  onSelect,
}: ConfidenceEncounterProps) => (
  <div className="confidence-scene" data-journey-confidence-arrival>
    <ClassroomArchitecture />
    <JourneyProgress
      completed={value === null
        ? ["Academic Level"]
        : ["Academic Level", "Confidence"]}
      current={value === null ? "Confidence" : "Learning Habits"}
    />
    <AssessmentEncounter
      id="confidence"
      label="02 — CONFIDENCE IN CLASS"
      heading="Even when they know the answer, what usually happens?"
      supportingText="Choose the one that feels most like your child."
      phase={phase}
    >
      {confidenceChoices.map((choice) => (
        <AssessmentChoice
          key={choice.value}
          name="confidence"
          {...choice}
          selected={value === choice.value}
          disabled={phase === "confirming"}
          dimmed={value !== null && value !== choice.value}
          illustration={<ClassroomChoice value={choice.value} />}
          onSelect={onSelect}
        />
      ))}
    </AssessmentEncounter>
  </div>
);
