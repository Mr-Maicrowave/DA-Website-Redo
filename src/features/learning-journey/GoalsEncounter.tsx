import { AssessmentEncounter } from "./AssessmentEncounter";
import { JourneyProgress } from "./JourneyProgress";
import { TelescopeSelector } from "./TelescopeSelector";
import { type EncounterPhase, type GoalsAnswer } from "./assessmentTypes";
import "./goals-encounter.css";

interface GoalsEncounterProps {
  value: GoalsAnswer | null;
  phase: EncounterPhase;
  onSelect: (answer: GoalsAnswer) => void;
}

export const GoalsEncounter = ({ value, phase, onSelect }: GoalsEncounterProps) => (
  <div className="goals-scene" data-journey-goals-arrival>
    <JourneyProgress
      completed={value === null
        ? ["Academic Level", "Confidence", "Learning Habits", "Motivation"]
        : ["Academic Level", "Confidence", "Learning Habits", "Motivation", "Goals"]}
      current="Goals"
    />
    <AssessmentEncounter
      id="goals"
      label="05 — LOOKING AHEAD"
      heading="What would you most like learning to do next?"
      supportingText="There's no wrong answer — think about what would make the biggest difference right now."
      phase={phase}
      confirmationText=""
    >
      <TelescopeSelector
        value={value}
        disabled={phase === "confirming"}
        onSelect={onSelect}
      />
    </AssessmentEncounter>
  </div>
);
