import { AssessmentChoice } from "./AssessmentChoice";
import { AssessmentEncounter } from "./AssessmentEncounter";
import { JourneyProgress } from "./JourneyProgress";
import { journeyAssets } from "./journeyAssets";
import { type AcademicLevelAnswer, type EncounterPhase } from "./assessmentTypes";
import "./academic-level-encounter.css";

const choices = [
  {
    value: "rebuilding",
    title: "Rebuilding foundations",
    description: "They need more support with the basics.",
  },
  {
    value: "year-level",
    title: "Around their year level",
    description: "They're keeping up with what is expected.",
  },
  {
    value: "above-level",
    title: "Above their year level",
    description: "They're ready for greater challenge.",
  },
] as const satisfies readonly {
  value: AcademicLevelAnswer;
  title: string;
  description: string;
}[];

const ChoiceIllustration = ({ value }: { value: AcademicLevelAnswer }) => {
  if (value === "rebuilding") {
    return (
      <span className="academic-metaphor academic-metaphor--foundation">
        <img src={journeyAssets.flora[2]} alt="" className="academic-metaphor__bed" />
        <span className="academic-stones"><i /><i /><i /><i /></span>
        <span className="academic-sprout"><i /><i /></span>
      </span>
    );
  }
  if (value === "year-level") {
    return (
      <span className="academic-metaphor academic-metaphor--steady">
        <img src={journeyAssets.path[1]} alt="" className="academic-metaphor__path" />
        <img src={journeyAssets.objects[2]} alt="" className="academic-metaphor__book" />
        <img src={journeyAssets.flora[0]} alt="" className="academic-metaphor__flowers" />
      </span>
    );
  }
  return (
    <span className="academic-metaphor academic-metaphor--stretch">
      <img src={journeyAssets.path[2]} alt="" className="academic-metaphor__path" />
      <span className="academic-steps"><i /><i /><i /></span>
      <span className="academic-flag"><i /></span>
      <img src={journeyAssets.flora[1]} alt="" className="academic-metaphor__tall-plants" />
    </span>
  );
};

interface AcademicLevelEncounterProps {
  value: AcademicLevelAnswer | null;
  phase: EncounterPhase;
  onSelect: (answer: AcademicLevelAnswer) => void;
}

export const AcademicLevelEncounter = ({ value, phase, onSelect }: AcademicLevelEncounterProps) => (
  <div className="academic-level-scene" data-journey-academic-arrival>
    <JourneyProgress
      completed={value === null ? [] : ["Academic Level"]}
      current={value === null ? "Academic Level" : "Confidence"}
    />
    <AssessmentEncounter
      label="01 — ACADEMIC LEVEL"
      heading="Where is your child academically right now?"
      supportingText="Choose the one that feels most accurate."
      phase={phase}
    >
      {choices.map((choice) => (
        <AssessmentChoice
          key={choice.value}
          name="academic-level"
          {...choice}
          selected={value === choice.value}
          disabled={phase === "confirming"}
          dimmed={value !== null && value !== choice.value}
          illustration={<ChoiceIllustration value={choice.value} />}
          onSelect={onSelect}
        />
      ))}
    </AssessmentEncounter>
  </div>
);
